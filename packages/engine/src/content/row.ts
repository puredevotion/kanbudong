import type { Decomposition } from '../components.js';
import { createRng } from '../rng.js';
import type {
  CategoryId,
  ConfusionType,
  Difficulty,
  GlossProvenance,
  Question,
  QuestionId,
  SignFace,
  Tier,
} from '../types.js';

/**
 * Fields authored rarely enough that giving each one its own positional tuple
 * slot would push {@link Row} past the point Phase 1 flagged - "positional
 * growth past ~6 fields is a signal to switch." Grouped here instead of
 * added as slots 7 and 8.
 */
export interface RowMeta {
  readonly tier?: Tier;
  readonly freqRank?: number;
  readonly confusion_type?: ConfusionType;
  readonly confusable_with?: readonly QuestionId[];
  readonly interference_set?: readonly QuestionId[];
  /** Set only when `explanation` carries an origin story; see DESIGN.md §3.3.3(7). */
  readonly glossProvenance?: GlossProvenance;
  /** DESIGN.md §5.1's confer-beat isomorph pairing; see {@link Question.isomorph_group_id}. */
  readonly isomorph_group_id?: string;
  /** DESIGN.md §11.6 correction 3; see {@link Question.distractorRationale}. */
  readonly distractorRationale?: Readonly<Record<string, string>>;
}

/**
 * Compact authoring format: `[prompt, options, answerIndex, explanation]`.
 *
 * Questions are content, and content gets edited by people who are not editing
 * the engine, so the shape they type is deliberately smaller than the shape the
 * engine consumes. Ids are derived, never typed - a hand-written id is a
 * duplicate waiting to happen.
 *
 * By convention the correct option is written **first**, which makes review
 * cheap: a reader checks one line per question rather than hunting for which of
 * four it is. {@link expand} then rotates each question deterministically, so
 * the authoring convention never reaches the pack.
 */
export type Row = readonly [
  prompt: string,
  /** DESIGN.md §2.3/§1.2 P6: three options, not four. */
  options: readonly [string, string, string],
  answer: 0 | 1 | 2,
  explanation: string,
  /** What the sign template draws. Absent on items that are not a sign. */
  face?: SignFace,
  /** Most rows have none; see DESIGN.md §3.3.3(5) on why this is not on `face`. */
  decomposition?: Decomposition,
  meta?: RowMeta,
];

export type CategoryContent = Readonly<Record<Difficulty, readonly Row[]>>;

/**
 * Flatten one or more content chunks for a category into engine questions.
 *
 * Variadic so a category's bank can be split across files - a base set and
 * later additions - without renumbering anything: ids are assigned over the
 * concatenation, so appending a chunk only ever adds ids and never changes an
 * existing one. That matters because a question id is what a finished game's
 * history refers back to.
 */
export function expand(category: CategoryId, ...chunks: readonly CategoryContent[]): Question[] {
  const out: Question[] = [];
  for (const difficulty of ['low', 'mid', 'high'] as const) {
    const rows = chunks.flatMap((chunk) => chunk[difficulty]);
    rows.forEach((row, index) => {
      const [prompt, options, answer, explanation, face, decomposition, meta] = row;
      const id = `${category}-${difficulty}-${index + 1}`;
      out.push({
        ...rotate(options, answer, id),
        id,
        category,
        difficulty,
        prompt,
        explanation,
        ...(face === undefined ? {} : { face }),
        ...(decomposition === undefined ? {} : { decomposition }),
        ...(meta?.tier === undefined ? {} : { tier: meta.tier }),
        ...(meta?.freqRank === undefined ? {} : { freqRank: meta.freqRank }),
        ...(meta?.confusion_type === undefined ? {} : { confusion_type: meta.confusion_type }),
        ...(meta?.confusable_with === undefined ? {} : { confusable_with: meta.confusable_with }),
        ...(meta?.interference_set === undefined
          ? {}
          : { interference_set: meta.interference_set }),
        ...(meta?.glossProvenance === undefined
          ? {}
          : { glossProvenance: meta.glossProvenance }),
        ...(meta?.isomorph_group_id === undefined
          ? {}
          : { isomorph_group_id: meta.isomorph_group_id }),
        ...(meta?.distractorRationale === undefined
          ? {}
          : { distractorRationale: meta.distractorRationale }),
      });
    });
  }
  return out;
}

/**
 * Spread the authored answer position evenly across the four slots.
 *
 * Authoring the answer first is convenient and produces a pack in which the
 * answer is almost always index 0 - which is fine in theory, because
 * `presentQuestion` shuffles per turn from the drawer's nonce, and wrong in
 * practice: any consumer that renders the authored order, or any inspection of
 * the pack, sees a bank that looks rigged. Rotating here means the stored pack
 * is already balanced, so the shuffle is defence in depth rather than the only
 * defence.
 *
 * A rotation is used rather than a shuffle because it is trivially
 * meaning-preserving: the same four options in a different cyclic order, with
 * the answer index moved by the same amount.
 */
function rotate(
  options: readonly [string, string, string],
  answer: 0 | 1 | 2,
  id: string,
): { options: [string, string, string]; answer: 0 | 1 | 2 } {
  const by = createRng('rotate', id).int(3);
  const rotated = options.map((_, i) => options[(i + by) % 3] as string) as [
    string,
    string,
    string,
  ];
  return { options: rotated, answer: (((answer - by + 3) % 3) as 0 | 1 | 2) };
}
