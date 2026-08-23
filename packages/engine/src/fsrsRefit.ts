/**
 * Pure logic for personalizing FSRS-6's `w` per player (memory.ts's
 * docstring: "replace `default_w` with a real ... fit once review data
 * exists to derive one from"). `apps/pwa/src/lib/attemptLog.ts` is that
 * data; `fsrs-browser` (a WASM build of the official FSRS optimizer,
 * `open-spaced-repetition/fsrs-rs`) is the fit. Neither the raw attempt log
 * nor WASM belong in this platform-free package, so this module only:
 *
 *  - shapes attempt-log rows into the `{rating, elapsedDays}` per-item
 *    training records an FSRS optimizer needs (`buildFsrsTrainingSet`),
 *  - decides whether there is *enough* history to trust a fit
 *    (`shouldAttemptRefit`), and
 *  - validates/accepts a fitted vector a caller got back from the optimizer
 *    (`acceptFittedParameters`) and picks which `w` to actually use
 *    (`resolveFsrsParameters`).
 *
 * `apps/pwa` owns everything WASM: loading `fsrs-browser`, flattening this
 * module's per-item training records into the flat typed arrays its
 * `Fsrs.computeParameters` expects, running it (off the main thread, see
 * that package's worker), and persisting the result.
 *
 * [Minimum-data gate] `FSRS_REFIT_MIN_REVIEWS = 400` is not a round number
 * invented for this repo: it is the review-count floor the FSRS project's
 * own tutorial cites for Anki 24.04 (`open-spaced-repetition/fsrs4anki`,
 * `docs/tutorial.md`) as the point below which the optimizer's own client
 * refuses to run at all — a jump down from the >=1000 reviews required by
 * older Anki versions, but still a floor. (Anki 24.06+ dropped the client-
 * side minimum entirely, on the theory that a from-scratch Bayesian prior
 * and internal regularization keep a sparse fit from being actively worse
 * than the defaults — but "not obviously worse" is a lower bar than "the
 * per-user signal this module's own docstring wants to be able to cite,"
 * so this app keeps the more conservative, previously-load-bearing 400.)
 * Below that, `resolveFsrsParameters` keeps returning `default_w`, and that
 * fallback path is exercised by test, not just assumed — most players will
 * sit below 400 solo reviews for weeks, and that must render identically to
 * the pre-personalization behaviour.
 */

import { default_w, gradeFromAnswer, ratingForGrade, type ReviewGrade } from './memory.js';
import type { QuestionId } from './types.js';

const MS_PER_DAY = 86_400_000;

/** One logged solo attempt, in the shape `attemptLog.ts` already stores. */
export interface RawSoloAttempt {
  readonly itemId: QuestionId;
  readonly correct: boolean;
  readonly timestamp: number;
  /** `ItemMemory.lastReview` as it stood before this attempt, or null on a first encounter. */
  readonly priorLastReview: number | null;
}

/** One review of one item, in the `{rating, elapsed_days}` shape an FSRS optimizer trains on. */
export interface FsrsTrainingReview {
  /** ts-fsrs's numeric `Rating` (1 Again / 2 Hard / 3 Good) — this product never emits Easy. */
  readonly rating: number;
  /** Whole days since the previous review of this item; 0 on a first encounter. */
  readonly elapsedDays: number;
}

export interface FsrsTrainingItem {
  readonly itemId: QuestionId;
  /** In chronological order — FSRS-6's per-item state is a Markov chain over review order. */
  readonly reviews: readonly FsrsTrainingReview[];
}

/**
 * Reconstructs, per item, exactly the grade sequence `reviewItem` actually
 * applied — `gradeFromAnswer(correct, priorLastReview === null)` matches
 * `Solo.tsx`'s own `isFirstEncounter = priorMemory === null` test term for
 * term, and `priorLastReview` is `ItemMemory.lastReview` from the same
 * `priorMemory`, so this is not an approximation of the historical grade,
 * it is the same computation the live review already ran. Elapsed time is
 * rounded to whole days because that is the granularity an FSRS optimizer
 * trains on (real revlogs are day-granular too) — the live scheduler itself
 * uses the fractional day count, so a refit's inputs are a faithful-but-
 * day-quantized reading of history, not a bit-for-bit replay.
 */
export function buildFsrsTrainingSet(
  attempts: readonly RawSoloAttempt[],
): readonly FsrsTrainingItem[] {
  const byItem = new Map<QuestionId, FsrsTrainingReview[]>();
  const sorted = [...attempts].sort((a, b) => a.timestamp - b.timestamp);
  for (const attempt of sorted) {
    const grade: ReviewGrade = gradeFromAnswer(attempt.correct, attempt.priorLastReview === null);
    const elapsedDays =
      attempt.priorLastReview === null
        ? 0
        : Math.round((attempt.timestamp - attempt.priorLastReview) / MS_PER_DAY);
    const reviews = byItem.get(attempt.itemId) ?? [];
    reviews.push({ rating: ratingForGrade(grade), elapsedDays: Math.max(0, elapsedDays) });
    byItem.set(attempt.itemId, reviews);
  }
  return Array.from(byItem, ([itemId, reviews]) => ({ itemId, reviews }));
}

export function totalTrainingReviews(trainingSet: readonly FsrsTrainingItem[]): number {
  return trainingSet.reduce((total, item) => total + item.reviews.length, 0);
}

/**
 * FSRS project guidance (see module docstring): below this many total
 * graded reviews, a "personalized" fit carries no real signal — the module
 * `memory.ts` was built to avoid inventing exactly this kind of unearned
 * precision.
 */
export const FSRS_REFIT_MIN_REVIEWS = 400;

/**
 * Once past the floor, don't re-run the optimizer on every single session —
 * only once at least this many *new* reviews have accumulated since the
 * last fit. A round, cheap-to-explain number, not a cited one: it exists
 * purely to bound how often a nontrivial WASM optimization pass runs, not
 * to express anything about statistical significance.
 */
export const FSRS_REFIT_MIN_NEW_REVIEWS = 50;

/** What the caller needs to remember about the last fit to decide when to try the next one. */
export interface FsrsRefitState {
  readonly reviewCountAtFit: number;
}

/**
 * Whether it's worth asking the optimizer for a new fit right now. `null`
 * for `lastFit` means "never fitted" — every player starts here, and stays
 * here until they cross `FSRS_REFIT_MIN_REVIEWS` (expected to take weeks
 * for most players; that path must fall through cleanly, not be treated as
 * a bug).
 */
export function shouldAttemptRefit(totalReviews: number, lastFit: FsrsRefitState | null): boolean {
  if (totalReviews < FSRS_REFIT_MIN_REVIEWS) return false;
  if (lastFit === null) return true;
  return totalReviews - lastFit.reviewCountAtFit >= FSRS_REFIT_MIN_NEW_REVIEWS;
}

/**
 * Validates a vector an optimizer claims is a fitted `w` before it's ever
 * allowed to replace `default_w` for real scheduling. Guards against a WASM
 * call returning something malformed (wrong length, `NaN`/`Infinity` from a
 * degenerate fit) silently corrupting every future review's stability math.
 */
export function acceptFittedParameters(candidate: readonly number[]): readonly number[] | null {
  if (candidate.length !== default_w.length) return null;
  if (!candidate.every((value) => Number.isFinite(value))) return null;
  return candidate;
}

/** A validated per-player fit, plus enough metadata to gate the next refit and to explain the number to the player if ever surfaced. */
export interface PersonalFsrsFit {
  readonly w: readonly number[];
  readonly fittedAt: number;
  readonly reviewCount: number;
}

/** The `w` to actually schedule with: the per-player fit if one exists, `default_w` otherwise. This is the one place that fallback decision is made, so it can't drift between call sites. */
export function resolveFsrsParameters(fit: PersonalFsrsFit | null): readonly number[] {
  return fit?.w ?? default_w;
}
