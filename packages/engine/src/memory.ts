/**
 * The solo review scheduler (docs/DESIGN.md §6.3, §6.4, §11.9, §11.8).
 *
 * Delegates the stability/difficulty update to `ts-fsrs`'s FSRS-6 algorithm
 * (`FSRSVersion` at the pinned version is "v5.4.1 using FSRS-6.0" — the
 * generation §11.8 requires, not FSRS-7) instead of the hand-rolled
 * heuristic this module used to carry. `w[20]`/`FSRS6_DEFAULT_DECAY` — the
 * one constant §4 of the phase plan calls out as "verbatim, worth
 * preserving exactly" — matches this library's own `FSRS6_DEFAULT_DECAY`
 * (0.1542) and its `forgetting_curve`'s formula matches §6.3's `R(t,S)`
 * term for term, so `retrievability` below is a thin, citable wrapper
 * rather than a reimplementation.
 *
 * [SIMPLIFICATION] §11.8 specifies shipping FSRS-6 "pretrain-4" — only the
 * four per-grade initial-stability weights (`w[0..3]`) refit, the rest of
 * `w` left at their literature defaults — rather than either a full 21-
 * parameter per-user fit (needs review history this product does not have)
 * or the stock all-defaults config the same section calls out as
 * benchmarking *below* a zero-parameter moving average. A real pretrain-4
 * fit is itself computed from a large per-collection corpus we do not have
 * access to in this repo, so this module ships `ts-fsrs`'s published
 * `default_w` unmodified rather than inventing numbers for `w[0..3]` that
 * would carry no citation. This is a further, explicitly-flagged narrowing
 * of the phase plan's own already-acknowledged pretrain-4 simplification,
 * not a silent substitution — replace `default_w` with a real pretrain-4 or
 * per-population fit once review data exists to derive one from.
 *
 * That review history now exists (`apps/pwa/src/lib/attemptLog.ts`), and
 * `apps/pwa` runs a real full 21-parameter refit against it off this
 * package's `w`-parameterized functions below (`fsrsRefit.ts` in this
 * package shapes the training data and gates when a fit is trustworthy; the
 * WASM optimizer call itself lives in `apps/pwa` because this package stays
 * platform-free). Every exported function here now accepts an optional `w`
 * — a per-player fitted vector — and falls back to `default_w` when none is
 * given, so every existing call site that doesn't know about personalization
 * keeps working unchanged.
 *
 * Per-(player, item) state stays the 16 bytes §6.4 specifies — `stability`,
 * `difficulty`, `last_review` — because `FSRSAlgorithm.next_state` (the
 * low-level primitive used here, as opposed to the higher-level `Card`-
 * based `Scheduler`) only ever needs that pair in and that pair out; it has
 * no use for review/lapse counts, so widening the stored shape to carry
 * them would add bytes DESIGN.md does not ask for.
 *
 * Direction (§6.1: sign → meaning, fixed, no production mode in v1) is not
 * threaded through this module's API. §6.1 says direction "sits in the key"
 * for a future audio mode, but with a single constant direction in v1 there
 * is nothing for a second value to disambiguate yet — the per-item state
 * this module stores is already scoped to one direction implicitly, same as
 * the identity of the item itself. Confirmed against DESIGN.md's current
 * text per the phase plan's flag, rather than assumed moot.
 *
 * Storage is deliberately not this module's job: §6.4 keeps the memory store
 * local to the device and out of the synced game log, which for this package
 * (imported by a browser bundle, an Expo bundle and node tests alike) means
 * no persistence API can be assumed here. The caller persists `ItemMemory`.
 */

import {
  FSRSAlgorithm,
  Rating,
  default_w,
  generatorParameters,
  type FSRSState,
  type Grade,
} from 'ts-fsrs';

/** Per `(player, item)`. Stability and the review clock are in days / ms. */
export interface ItemMemory {
  readonly stability: number;
  readonly difficulty: number;
  readonly lastReview: number;
}

/** How a single response is graded, per the mapping in §6.3. */
export type ReviewGrade = 'again' | 'hard' | 'good';

/**
 * §6.3/§6.5: whether a response counts as evidence for the scheduler.
 * Pinyin-scaffolded answers, commit-window timeouts, and at-most-one-per-
 * session "too easy" freebies (`R_p > 0.95`) are `exposure` — logged to the
 * game log elsewhere, but must never move `stability`/`difficulty` here.
 * The caller (whatever records the attempt) decides the role; this module
 * only enforces that an `exposure` role is a no-op on memory.
 */
export type ReviewRole = 'review' | 'exposure';

const MS_PER_DAY = 86_400_000;

/** §6.3/§11.8: target retention, shared by the selector and the scheduler on purpose. */
export const TARGET_RETENTION = 0.9;

/** §6.3's fixed constant, verbatim — see `FSRSAlgorithm`'s own `FSRS6_DEFAULT_DECAY`. */
export const RETRIEVABILITY_DECAY = 0.1542;

const GRADE_TO_RATING: Record<ReviewGrade, Grade> = {
  again: Rating.Again,
  hard: Rating.Hard,
  good: Rating.Good,
};

/** The numeric FSRS rating (1/2/3, ts-fsrs's `Rating` enum) a grade maps to — the same convention `fsrs-browser`'s optimizer expects its `ratings` array in. */
export function ratingForGrade(grade: ReviewGrade): Grade {
  return GRADE_TO_RATING[grade];
}

/** FSRS-6's stock literature weights — this module's fallback whenever no per-player fit exists yet. Re-exported so callers never need their own `ts-fsrs` import just to name the fallback. */
export { default_w };

/** The length a fitted `w` vector must have to be a valid FSRS-6 parameter set (`default_w.length`, 21: the 4 pretrain weights plus difficulty, forgetting-curve, and short-term terms). */
export const FSRS_PARAMETER_COUNT = default_w.length;

function buildAlgorithm(w: readonly number[]): FSRSAlgorithm {
  return new FSRSAlgorithm(
    generatorParameters({
      request_retention: TARGET_RETENTION,
      w: w as number[],
      enable_fuzz: false,
      enable_short_term: false,
    }),
  );
}

const defaultAlgorithm = buildAlgorithm(default_w);

// A single-slot cache, not a `Map`: every call site here passes either the
// module default or the one per-player `w` array a caller loaded once per
// session, so the last-built algorithm is virtually always the right one
// to reuse instead of re-parsing `generatorParameters` on every review.
let cachedCustom: { readonly w: readonly number[]; readonly algorithm: FSRSAlgorithm } | null = null;

function algorithmFor(w: readonly number[] = default_w): FSRSAlgorithm {
  if (w === default_w) return defaultAlgorithm;
  if (cachedCustom !== null && cachedCustom.w === w) return cachedCustom.algorithm;
  const algorithm = buildAlgorithm(w);
  cachedCustom = { w, algorithm };
  return algorithm;
}

/** §6.3's `R(t, S)` — probability of recall `t` days after a review with stability `S`. */
export function retrievability(elapsedDays: number, stabilityDays: number, w: readonly number[] = default_w): number {
  if (stabilityDays <= 0) return 0;
  const t = Math.max(0, elapsedDays);
  return algorithmFor(w).forgetting_curve(t, stabilityDays);
}

export function elapsedDaysSince(lastReview: number, now: number): number {
  return Math.max(0, (now - lastReview) / MS_PER_DAY);
}

/**
 * An item is due when its retrievability has decayed under the session
 * target (§11.8: the selector and the scheduler must read the same target,
 * 0.90, on pain of it being "a bug and not a tuning choice"). A never-
 * reviewed item is always due.
 */
export function isDue(
  memory: ItemMemory | null,
  now: number,
  target: number = TARGET_RETENTION,
  w: readonly number[] = default_w,
): boolean {
  if (memory === null) return true;
  return retrievability(elapsedDaysSince(memory.lastReview, now), memory.stability, w) < target;
}

/**
 * Applies one graded review via FSRS-6's own stability/difficulty update.
 * `memory === null` is a first-ever encounter: `FSRSAlgorithm.next_state`
 * seeds it from `w[grade-1]` (initial stability) and the `w[4]`/`w[5]`
 * initial-difficulty formula, rather than a fixed table.
 *
 * `role: 'exposure'` is a no-op — returns `memory` unchanged (including
 * `null`, when an unseen item is only ever exposed and never actually
 * reviewed) — per §6.3/§6.5's ban on exposure rows feeding the scheduler.
 */
function fullUpdate(
  memory: ItemMemory | null,
  grade: ReviewGrade,
  now: number,
  w: readonly number[] = default_w,
): ItemMemory {
  const state: FSRSState | null = memory === null ? null : { stability: memory.stability, difficulty: memory.difficulty };
  const t = memory === null ? 0 : elapsedDaysSince(memory.lastReview, now);
  const next = algorithmFor(w).next_state(state, t, GRADE_TO_RATING[grade]);
  return { stability: next.stability, difficulty: next.difficulty, lastReview: now };
}

export function reviewItem(
  memory: ItemMemory | null,
  grade: ReviewGrade,
  now: number,
  role: ReviewRole = 'review',
  w: readonly number[] = default_w,
): ItemMemory | null {
  if (role === 'exposure') return memory;
  return fullUpdate(memory, grade, now, w);
}

/**
 * §6.1's "credited exposure at discounted weight": when a span resolves,
 * each of its component characters is credited a fraction of what a direct
 * review of that character would move - "enough to move a character node,
 * not enough to graduate it alone" - so a character met only inside larger
 * spans (期 inside both 保质期 and 星期) still compounds towards
 * introduction without ever counting as if it had been reviewed on its own.
 * A separate function rather than a `reviewItem` parameter, so a caller
 * crediting a component can never be mistaken for one reporting a real
 * review of it.
 */
export const COMPONENT_CREDIT_WEIGHT = 0.25;

export function creditComponentExposure(
  memory: ItemMemory | null,
  grade: ReviewGrade,
  now: number,
  w: readonly number[] = default_w,
): ItemMemory {
  const full = fullUpdate(memory, grade, now, w);
  const baseStability = memory?.stability ?? 0;
  const baseDifficulty = memory?.difficulty ?? full.difficulty;
  return {
    stability: baseStability + (full.stability - baseStability) * COMPONENT_CREDIT_WEIGHT,
    difficulty: baseDifficulty + (full.difficulty - baseDifficulty) * COMPONENT_CREDIT_WEIGHT,
    lastReview: now,
  };
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
