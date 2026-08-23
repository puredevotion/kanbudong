/**
 * Span eligibility and derivation of `component_char_ids` (docs/DESIGN.md
 * §6.1): "a multi-character span is eligible for a given player only once
 * its component characters have been introduced for that player."
 *
 * This module is pure over engine-native types. It does not decide *when*
 * to check eligibility - that is the scheduler's job (solo ordering today,
 * group dealing in a later phase).
 */

import type { ContentPack, Question, QuestionId } from './types.js';

function isSingleCharacter(hanzi: string): boolean {
  return [...hanzi].length === 1;
}

/**
 * Resolves each multi-character span's `WordDecomposition` morphemes against
 * the pack's own single-character questions, keyed by `face.hanzi`. Derived
 * rather than hand-authored so a morpheme string and its character item's id
 * cannot drift apart - the worked example is 期, met once as its own
 * character item and again inside a span like 保质期, both resolving to the
 * same `QuestionId`.
 *
 * A morpheme with no matching single-character question in the pack (not yet
 * authored, or genuinely absent) is silently omitted rather than treated as
 * an error - Phase 2 does not guarantee every morpheme of every authored
 * word has its own character item yet.
 */
export function deriveComponentCharIds(
  questions: readonly Question[],
): ReadonlyMap<QuestionId, readonly QuestionId[]> {
  const byHanzi = new Map<string, QuestionId>();
  for (const q of questions) {
    if (q.face !== undefined && isSingleCharacter(q.face.hanzi)) {
      byHanzi.set(q.face.hanzi, q.id);
    }
  }

  const result = new Map<QuestionId, readonly QuestionId[]>();
  for (const q of questions) {
    if (q.decomposition?.kind !== 'word') continue;
    const ids: QuestionId[] = [];
    for (const morpheme of q.decomposition.morphemes) {
      const id = byHanzi.get(morpheme.span);
      if (id !== undefined) ids.push(id);
    }
    if (ids.length > 0) result.set(q.id, ids);
  }
  return result;
}

/** Attaches derived `component_char_ids` to every question in a pack that resolved any. */
export function withComponentCharIds(questions: readonly Question[]): readonly Question[] {
  const derived = deriveComponentCharIds(questions);
  return questions.map((q) => {
    const ids = derived.get(q.id);
    return ids === undefined ? q : { ...q, component_char_ids: ids };
  });
}

/**
 * A span with no `component_char_ids` (single-character, or no resolvable
 * word decomposition) has nothing to gate on and is always eligible.
 * Otherwise eligible only once every listed component character is
 * introduced for this player.
 */
export function isSpanEligible(
  question: Question,
  isIntroduced: (charId: QuestionId) => boolean,
): boolean {
  const ids = question.component_char_ids;
  if (ids === undefined || ids.length === 0) return true;
  return ids.every((id) => isIntroduced(id));
}

/** Filters a pack's questions down to those eligible for a given player. */
export function eligibleQuestions(
  pack: ContentPack,
  isIntroduced: (charId: QuestionId) => boolean,
): readonly Question[] {
  return pack.questions.filter((q) => isSpanEligible(q, isIntroduced));
}
