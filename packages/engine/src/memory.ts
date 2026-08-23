/**
 * The solo review scheduler (docs/DESIGN.md §6.3, §11.9).
 *
 * This is a simplified spaced-repetition model, not full FSRS: the design
 * document specifies FSRS's retrievability curve and its Elo-style item
 * difficulty precisely, but never gives FSRS's own ~19-parameter stability
 * update (that requires a fit against real review data this product does not
 * have yet). `reviewItem` below approximates that update with a small,
 * documented heuristic so a real solo loop can ship; replacing it with a
 * proper FSRS fit later does not change anything that calls it, because the
 * interface (`ItemMemory` in, `ItemMemory` out) is what a real fit would also
 * expose.
 *
 * Storage is deliberately not this module's job: §6.4 keeps the memory store
 * local to the device and out of the synced game log, which for this package
 * (imported by a browser bundle, an Expo bundle and node tests alike) means
 * no persistence API can be assumed here. The caller persists `ItemMemory`.
 */

/** Per `(player, item)`. Stability and the review clock are in days / ms. */
export interface ItemMemory {
  readonly stability: number;
  readonly difficulty: number;
  readonly lastReview: number;
}

/** How a single response is graded, per the mapping in §6.3. */
export type ReviewGrade = 'again' | 'hard' | 'good';

const MS_PER_DAY = 86_400_000;

/** From §6.3: fit to Ebbinghaus-style forgetting, R = 0.9 at t = S. */
export const RETRIEVABILITY_DECAY = 0.1542;
const RETRIEVABILITY_FACTOR = 0.9 ** (1 / -RETRIEVABILITY_DECAY) - 1;

const NEW_ITEM_STABILITY_DAYS = 1;
const NEW_ITEM_DIFFICULTY = 5;
const MIN_DIFFICULTY = 1;
const MAX_DIFFICULTY = 10;
const MIN_STABILITY_DAYS = 0.2;

/** §6.3's `R(t, S)` — probability of recall `t` days after a review with stability `S`. */
export function retrievability(elapsedDays: number, stabilityDays: number): number {
  if (stabilityDays <= 0) return 0;
  const t = Math.max(0, elapsedDays);
  return (1 + (RETRIEVABILITY_FACTOR * t) / stabilityDays) ** -RETRIEVABILITY_DECAY;
}

export function elapsedDaysSince(lastReview: number, now: number): number {
  return Math.max(0, (now - lastReview) / MS_PER_DAY);
}

/**
 * An item is due when its retrievability has decayed under the session
 * target (§6.3's observed-accuracy target, 0.9 by default here since solo has
 * no format-tier correction to make). A never-reviewed item is always due.
 */
export function isDue(memory: ItemMemory | null, now: number, target = 0.9): boolean {
  if (memory === null) return true;
  return retrievability(elapsedDaysSince(memory.lastReview, now), memory.stability) < target;
}

/**
 * Applies one graded review. `memory === null` is a first-ever encounter,
 * seeded per §6.3's cold-start clamp (`initial_interval` inside `[0.5x, 1.5x]`
 * the global new-item interval) rather than computed from a retrievability
 * that does not exist yet.
 */
export function reviewItem(memory: ItemMemory | null, grade: ReviewGrade, now: number): ItemMemory {
  if (memory === null) {
    const stability =
      grade === 'again'
        ? MIN_STABILITY_DAYS
        : grade === 'hard'
          ? NEW_ITEM_STABILITY_DAYS * 0.7
          : NEW_ITEM_STABILITY_DAYS;
    return { stability, difficulty: NEW_ITEM_DIFFICULTY, lastReview: now };
  }

  const r = retrievability(elapsedDaysSince(memory.lastReview, now), memory.stability);
  let { stability, difficulty } = memory;

  switch (grade) {
    case 'again':
      // A lapse both shrinks the interval and makes the item harder to grow
      // back, mirroring FSRS's own lapse behaviour without its exact constants.
      difficulty = Math.min(MAX_DIFFICULTY, difficulty + 1);
      stability = Math.max(MIN_STABILITY_DAYS, stability * 0.5);
      break;
    case 'hard':
      difficulty = Math.min(MAX_DIFFICULTY, difficulty + 0.3);
      stability *= 1 + 0.3 * (1 - r);
      break;
    case 'good':
      // The lower the retrievability at the moment of recall, the harder the
      // retrieval was, and the more the interval is allowed to grow — this is
      // the spacing effect, and the one property a heuristic must preserve.
      difficulty = Math.max(MIN_DIFFICULTY, difficulty - 0.1);
      stability *= 1 + (11 - difficulty) * (1 - r) * 0.5;
      break;
  }

  return { stability, difficulty, lastReview: now };
}

/**
 * §6.3's grading rule for the solo surface: an item with no memory strength
 * is answered correctly by chance at a nonzero rate, so a first-ever correct
 * is weak evidence (Hard) rather than full-strength evidence (Good).
 */
export function gradeFromAnswer(correct: boolean, isFirstEncounter: boolean): ReviewGrade {
  if (!correct) return 'again';
  return isFirstEncounter ? 'hard' : 'good';
}
