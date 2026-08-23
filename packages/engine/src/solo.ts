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

import { default_w, isDue, retrievability, elapsedDaysSince, TARGET_RETENTION, type ItemMemory } from './memory.js';
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
 *
 * `seededToday` is DESIGN.md §6.5's "morning-after queue": items a group
 * session introduced for this player, pushed to the front of the very next
 * solo session ahead of everything else due - "the hinge the whole model
 * turns on" for turning a massed party game into a spaced one. Writing that
 * set is the caller's job (it crosses the shared-log/local-memory boundary
 * §11.1 draws deliberately narrowly); this function only ever reads it.
 *
 * `w` is the same per-player FSRS-6 parameter vector `memory.ts`'s functions
 * take — defaulting to `default_w` — so that once a caller has a personal
 * fit, due-ness and overdue ordering agree with the stability/difficulty
 * math that produced them, rather than judging a personalized memory state
 * against the stock literature curve.
 */
export function buildSoloQueue(
  pack: ContentPack,
  memoryFor: (id: QuestionId) => ItemMemory | null,
  now: number,
  seededToday: ReadonlySet<QuestionId> = new Set(),
  w: readonly number[] = default_w,
): SoloQueue {
  const due: Array<{ question: Question; overdueBy: number }> = [];
  const fresh: Question[] = [];

  for (const question of pack.questions) {
    const memory = memoryFor(question.id);
    if (memory === null) {
      fresh.push(question);
      continue;
    }
    if (!isDue(memory, now, TARGET_RETENTION, w)) continue;
    const r = retrievability(elapsedDaysSince(memory.lastReview, now), memory.stability, w);
    due.push({ question, overdueBy: 1 - r });
  }

  due.sort((a, b) => b.overdueBy - a.overdueBy);

  const ordered = due.map((d) => d.question);
  const seededFirst = [...ordered].sort((a, b) => Number(seededToday.has(b.id)) - Number(seededToday.has(a.id)));

  return { due: seededFirst, fresh };
}

/** Next item for the session: due items first, then fresh ones, skipping anything already presented this session. */
export function nextSoloItem(queue: SoloQueue, presented: ReadonlySet<QuestionId>): Question | null {
  for (const question of queue.due) if (!presented.has(question.id)) return question;
  for (const question of queue.fresh) if (!presented.has(question.id)) return question;
  return null;
}
