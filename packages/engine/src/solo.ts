/**
 * Solo review-session selection (docs/DESIGN.md §11.9).
 *
 * §11.9 specifies the solo surface's selection as "single-player FSRS due
 * queue first; then the `high_confidence_miss` requeue; then component-
 * contrast injections" and notes `pickItem` should degrade to the
 * single-player case "for free" — a single-element weight vector. This
 * package has no group scheduler yet (§12.1 #1 is still open), so rather than
 * fake that degradation, this is the direct single-player queue: due items
 * ordered by how overdue they are, then unseen items, with no group-shaped
 * concept (bet tiers, opponent dealing, public reveal) touched at all, per
 * §11.9's "what it does not get" list.
 */

import { isDue, retrievability, elapsedDaysSince, type ItemMemory } from './memory.js';
import type { ContentPack, Question, QuestionId } from './types.js';

/** §11.9: "ends ... at ~40 retrievals, whichever comes first." */
export const SOLO_SESSION_TARGET_RETRIEVALS = 40;

export interface SoloQueue {
  /** Previously-seen items whose retrievability has decayed under target, most overdue first. */
  readonly due: readonly Question[];
  /** Items with no memory record yet, in pack order. */
  readonly fresh: readonly Question[];
}

/**
 * Builds the session's candidate order. Does not mutate or persist anything —
 * memory lookup is injected so this package still never touches a storage API.
 */
export function buildSoloQueue(
  pack: ContentPack,
  memoryFor: (id: QuestionId) => ItemMemory | null,
  now: number,
): SoloQueue {
  const due: Array<{ question: Question; overdueBy: number }> = [];
  const fresh: Question[] = [];

  for (const question of pack.questions) {
    const memory = memoryFor(question.id);
    if (memory === null) {
      fresh.push(question);
      continue;
    }
    if (!isDue(memory, now)) continue;
    const r = retrievability(elapsedDaysSince(memory.lastReview, now), memory.stability);
    due.push({ question, overdueBy: 1 - r });
  }

  due.sort((a, b) => b.overdueBy - a.overdueBy);

  return { due: due.map((d) => d.question), fresh };
}

/** Next item for the session: due items first, then fresh ones, skipping anything already presented this session. */
export function nextSoloItem(queue: SoloQueue, presented: ReadonlySet<QuestionId>): Question | null {
  for (const question of queue.due) if (!presented.has(question.id)) return question;
  for (const question of queue.fresh) if (!presented.has(question.id)) return question;
  return null;
}
