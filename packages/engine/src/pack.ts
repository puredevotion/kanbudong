import { canonicalJson, sha256Hex } from './canonical.js';
import { CATEGORY_IDS } from './categories.js';
import { COMPONENTS } from './components.js';
import { createRng } from './rng.js';
import { DIFFICULTY_ORDER } from './rules.js';
import type { CategoryId, ContentPack, Difficulty, Question, QuestionId } from './types.js';

/**
 * Content is a versioned, hash-identified pack rather than a hard-coded array,
 * because content is the actual product (R-12) and it has to be able to grow
 * and be replaced without an engine change.
 */
export function packHash(pack: ContentPack): string {
  // Hash the semantics, not the file: reordering questions or editing the pack
  // name must not invalidate a game already in progress, but changing a prompt,
  // an option or an answer must.
  const material = pack.questions
    .map((q) =>
      canonicalJson({
        id: q.id,
        category: q.category,
        difficulty: q.difficulty,
        prompt: q.prompt,
        options: q.options,
        answer: q.answer,
        // The rendered characters are what the player is asked to read, so a
        // change here is a change to the game, not to presentation.
        face: q.face === undefined ? null : q.face.hanzi,
        decomposition: q.decomposition ?? null,
      }),
    )
    .sort();
  return sha256Hex(canonicalJson({ id: pack.id, questions: material }));
}

export interface PackStats {
  readonly total: number;
  /** Count per category per difficulty; the gaps are where authoring is owed. */
  readonly byCategory: Readonly<Record<CategoryId, Readonly<Record<Difficulty, number>>>>;
  readonly thinnest: { readonly category: CategoryId; readonly difficulty: Difficulty; readonly count: number };
}

export function packStats(pack: ContentPack): PackStats {
  const byCategory: Record<string, Record<string, number>> = {};
  for (const category of CATEGORY_IDS) {
    byCategory[category] = {};
    for (const difficulty of DIFFICULTY_ORDER) {
      (byCategory[category] as Record<string, number>)[difficulty] = 0;
    }
  }
  for (const q of pack.questions) {
    const row = byCategory[q.category];
    if (row === undefined) continue;
    row[q.difficulty] = (row[q.difficulty] ?? 0) + 1;
  }
  let thinnest = { category: CATEGORY_IDS[0] as CategoryId, difficulty: 'low' as Difficulty, count: Number.POSITIVE_INFINITY };
  for (const category of CATEGORY_IDS) {
    for (const difficulty of DIFFICULTY_ORDER) {
      const count = byCategory[category]?.[difficulty] ?? 0;
      if (count < thinnest.count) thinnest = { category, difficulty, count };
    }
  }
  return {
    total: pack.questions.length,
    byCategory: byCategory as PackStats['byCategory'],
    thinnest,
  };
}

export function questionById(pack: ContentPack, id: QuestionId): Question | undefined {
  return pack.questions.find((q) => q.id === id);
}

export function questionsFor(pack: ContentPack, category: CategoryId, difficulty: Difficulty): Question[] {
  return pack.questions.filter((q) => q.category === category && q.difficulty === difficulty);
}

/**
 * design/cards/README.md "the same move again": how many sibling examples the
 * breakdown surface shows before it stops being "almost no new load" and
 * starts being a lecture on the whole category - the design doc's own worked
 * example (牛肉/猪肉/羊肉/鸡肉/鸭肉) is four.
 */
export const SIBLING_CAP = 4;

/**
 * Other real pack items built the same way as `question`, for the
 * breakdown's "same construction" panel. Identity is always a stored
 * component id (`semantic_radical` for a {@link CharacterDecomposition}) or a
 * stored morpheme span (for a {@link WordDecomposition}) - never a substring
 * or glyph match against the rendered hanzi, same rule `validatePack` and
 * `DecompositionPanel` already hold for component highlighting (§3.3.4).
 * Excludes `question` itself and caps at {@link SIBLING_CAP}.
 */
export function siblingsSharingComponent(pack: ContentPack, question: Question): readonly Question[] {
  const decomposition = question.decomposition;
  if (decomposition === undefined) return [];

  if (decomposition.kind === 'character') {
    const radical = decomposition.semantic_radical;
    if (radical === undefined) return [];
    return pack.questions
      .filter(
        (q) =>
          q.id !== question.id &&
          q.decomposition?.kind === 'character' &&
          q.decomposition.semantic_radical === radical,
      )
      .slice(0, SIBLING_CAP);
  }

  const spans = new Set(decomposition.morphemes.map((m) => m.span));
  return pack.questions
    .filter((q) => {
      if (q.id === question.id) return false;
      if (q.decomposition?.kind !== 'word') return false;
      return q.decomposition.morphemes.some((m) => spans.has(m.span));
    })
    .slice(0, SIBLING_CAP);
}

/**
 * `question.confusable_with` resolved to real pack items, for the
 * breakdown's confusable panel (§2.3/§3.4). Dangling ids are dropped rather
 * than thrown on - `validatePack` is where a dangling `confusable_with`
 * becomes a build-time failure; this stays a pure, always-safe read.
 *
 * Unconditional: the doc comment on `confusable_with` gates this panel on
 * "once both members are consolidated," which would need per-player FSRS
 * memory state threaded into the reveal UI - a bigger plumbing change than
 * this selector should take on. Shipped unconditionally for now; real
 * consolidation-gating is follow-up work, same deferral as distractor
 * selection from a confusable family (see the doc comment on
 * `Question.confusion_type`).
 */
export function confusablesFor(pack: ContentPack, question: Question): readonly Question[] {
  return (question.confusable_with ?? []).flatMap((id) => {
    const other = questionById(pack, id);
    return other === undefined ? [] : [other];
  });
}

export interface SelectQuestionInput {
  readonly pack: ContentPack;
  readonly category: CategoryId;
  readonly difficulty: Difficulty;
  /** The drawer's nonce. Without it the answering device could precompute (R-10). */
  readonly nonce: string;
  /** Question ids already used this game. */
  readonly exclude: readonly QuestionId[];
}

export interface SelectQuestionResult {
  readonly question: Question | null;
  /** True when the pool was exhausted and a repeat had to be allowed. */
  readonly repeat: boolean;
}

/**
 * Prefer a question not yet asked; fall back to repeating one from the same
 * candidate pool rather than returning nothing. Shared by both fallback
 * tiers in the question-selection chain (exact cell, then same-tier-any-
 * category) so there is exactly one place that implements "prefer fresh,
 * repeat rather than stall."
 */
export function pickFromPool(
  candidates: readonly Question[],
  exclude: readonly QuestionId[],
  rng: { pick: <T>(items: readonly T[]) => T },
): SelectQuestionResult {
  if (candidates.length === 0) return { question: null, repeat: false };
  const used = new Set(exclude);
  const fresh = candidates.filter((q) => !used.has(q.id));
  const pool = fresh.length > 0 ? fresh : candidates;
  return { question: rng.pick(pool), repeat: fresh.length === 0 };
}

/**
 * Deterministic, unpredictable-to-the-answerer question choice.
 *
 * Deterministic because every peer must resolve the same event to the same
 * question with no round trip; unpredictable because the nonce comes from an
 * opponent.
 */
export function selectQuestion(input: SelectQuestionInput): SelectQuestionResult {
  const candidates = questionsFor(input.pack, input.category, input.difficulty);
  const rng = createRng(input.nonce, input.category, input.difficulty);
  return pickFromPool(candidates, input.exclude, rng);
}

export interface PresentedQuestion {
  readonly question: Question;
  /** Options in the order they must be shown. */
  readonly options: readonly string[];
  /** Index into {@link options} of the correct answer. */
  readonly correctIndex: number;
}

/**
 * Option order is shuffled per turn so the correct answer is not always in the
 * authored position, and shuffled *deterministically* so every device shows the
 * same four buttons in the same order and an answer index means one thing.
 */
export function presentQuestion(question: Question, nonce: string): PresentedQuestion {
  const rng = createRng(nonce, 'options', question.id);
  const order = rng.shuffle([0, 1, 2]);
  return {
    question,
    options: order.map((i) => question.options[i] as string),
    correctIndex: order.indexOf(question.answer),
  };
}

/**
 * DESIGN.md §3.3.4/§4.11 gate 8: "never put U+2EBC in shipped copy" - the
 * whole CJK Radicals Supplement block (U+2E80-U+2EFF) is a set of component
 * shapes with no place in text a player reads, since every one of them is a
 * homoglyph of an ordinary character in mainland type (⺼/月 being the worked
 * example). A component identity belongs in `componentId`/`semantic_radical`,
 * never inlined into `prompt`, `options`, `explanation` or `face`.
 */
const CJK_RADICALS_SUPPLEMENT = /[⺀-⻿]/u;

function forbiddenCodepointStrings(q: Question): readonly [string, string][] {
  return [
    ['prompt', q.prompt],
    ['options', q.options.join('')],
    ['explanation', q.explanation],
    ['face.hanzi', q.face?.hanzi ?? ''],
    ['face.pinyin', q.face?.pinyin ?? ''],
    ['face.nl', q.face?.nl ?? ''],
    ['face.en', q.face?.en ?? ''],
    ['face.context.before', q.face?.context?.before ?? ''],
    ['face.context.after', q.face?.context?.after ?? ''],
  ];
}

/**
 * Structural validation of a pack. Cheap, and it turns a content typo into a
 * failing test instead of a mid-game divergence.
 */
export function validatePack(pack: ContentPack): string[] {
  const problems: string[] = [];
  const seen = new Set<string>();
  const categories = new Set(pack.categories.map((c) => c.id));
  const allIds = new Set(pack.questions.map((q) => q.id));
  for (const q of pack.questions) {
    for (const [field, value] of forbiddenCodepointStrings(q)) {
      if (CJK_RADICALS_SUPPLEMENT.test(value)) {
        problems.push(`${q.id}: ${field} contains a CJK Radicals Supplement codepoint (e.g. U+2EBC) - shipped copy must use the ordinary character, never the bare radical shape`);
      }
    }
    if (seen.has(q.id)) problems.push(`duplicate question id: ${q.id}`);
    seen.add(q.id);
    if (!categories.has(q.category)) problems.push(`${q.id}: unknown category ${q.category}`);
    if (!DIFFICULTY_ORDER.includes(q.difficulty)) problems.push(`${q.id}: unknown difficulty ${q.difficulty}`);
    if (q.options.length !== 3) problems.push(`${q.id}: needs exactly 3 options`);
    if (new Set(q.options).size !== q.options.length) problems.push(`${q.id}: duplicate options`);
    if (q.answer < 0 || q.answer > 2) problems.push(`${q.id}: answer out of range`);
    if (q.explanation.trim().length === 0) problems.push(`${q.id}: missing explanation`);
    if (q.prompt.trim().length === 0) problems.push(`${q.id}: missing prompt`);
    if (q.decomposition?.kind === 'character') {
      for (const { componentId } of q.decomposition.components) {
        if (!(componentId in COMPONENTS)) {
          problems.push(`${q.id}: unknown component id ${componentId}`);
        }
      }
      const radical = q.decomposition.semantic_radical;
      if (radical !== undefined && !(radical in COMPONENTS)) {
        problems.push(`${q.id}: unknown semantic_radical component id ${radical}`);
      }
    }
    for (const charId of q.component_char_ids ?? []) {
      if (!allIds.has(charId)) {
        problems.push(`${q.id}: unknown component_char_ids entry ${charId}`);
      }
    }
    for (const confusableId of q.confusable_with ?? []) {
      if (!allIds.has(confusableId)) {
        problems.push(`${q.id}: unknown confusable_with entry ${confusableId}`);
      }
    }
    if (q.distractorRationale !== undefined) {
      const distractorTexts = q.options.filter((_, i) => i !== q.answer);
      for (const text of distractorTexts) {
        if (!(text in q.distractorRationale)) {
          problems.push(`${q.id}: distractor "${text}" has no whyPlausible entry in distractorRationale (DESIGN.md §11.6 correction 3)`);
        }
      }
    }
  }
  const isomorphGroups = new Map<string, number>();
  for (const q of pack.questions) {
    if (q.isomorph_group_id === undefined) continue;
    isomorphGroups.set(q.isomorph_group_id, (isomorphGroups.get(q.isomorph_group_id) ?? 0) + 1);
  }
  for (const [groupId, count] of isomorphGroups) {
    if (count < 2) {
      problems.push(`isomorph_group_id ${groupId}: only one item - DESIGN.md §5.1 needs pairs or triples`);
    }
  }
  return problems;
}
