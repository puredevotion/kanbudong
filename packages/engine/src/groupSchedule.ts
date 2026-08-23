/**
 * Group-session item selection (docs/DESIGN.md §6.5, §11.8, reinforced by
 * P37/§5.4's four hard constraints and §11.9's "pickItem degrades to the
 * single-player case for free").
 *
 * [SIMPLIFICATION] §6.5 is DESIGN.md's own admitted highest-risk,
 * least-evidenced component ("no prior art... the highest-risk unvalidated
 * bet in the design"). The 3:1 under/over-target weighting, the softmax
 * temperature and the top-8 cutoff below are shipped as the documented
 * guess, not defended as tuned constants - see §12.1 #1.
 *
 * [SIMPLIFICATION] §6.4 stores a `state ∈ {NEW, LEARNING, SOLID}` field this
 * codebase's `ItemMemory` (memory.ts) does not carry - Phase 3 shipped only
 * the 16-byte `{stability, difficulty, lastReview}` struct. Constraint (2)
 * below ("no item leaves LEARNING on same-session corrects") is therefore
 * implemented against a same-product-day check on `lastReview`, not an
 * explicit LEARNING/SOLID state machine: a later correct on an item already
 * reviewed earlier the same product day is graded but logged `exposure`
 * (no further stability movement), which is the observable behaviour §6.4's
 * state field exists to produce, not a reimplementation of the field itself.
 *
 * This module does not decide where the rotating priority-player pointer
 * `π` lives - PLAN.md's Phase 7 section says that state belongs in the
 * *shared* game-state reducer, and the reducer this repo ships still runs
 * the pre-P39 "correct keeps the turn" team mechanic (see reducer.ts's
 * `resolve`), not the per-player blind-simultaneous-commit turn shape §2.4
 * and §5.1 specify. Rebuilding that turn mechanic is explicitly out of this
 * phase's scope (PLAN.md Phase 7, "Out of scope"), so `pickItem` takes the
 * priority player as a plain input rather than reading it from anywhere.
 */

import {
  elapsedDaysSince,
  gradeFromAnswer,
  isDue,
  retrievability,
  TARGET_RETENTION,
  type ItemMemory,
  type ReviewGrade,
  type ReviewRole,
} from './memory.js';
import { isSpanEligible } from './eligibility.js';
import type { Rng } from './rng.js';
import type { CategoryId, PlayerId, Question, QuestionId } from './types.js';

/** §11.8's corrected objective shares FSRS's own request-retention target. */
export const GROUP_TARGET_RETENTION = TARGET_RETENTION;

/** §11.8: reviewing early (R above target) is cheap waste; reviewing late (R below target) loses the item. */
export const UNDER_TARGET_PENALTY_WEIGHT = 3;
export const OVER_TARGET_PENALTY_WEIGHT = 1;

/** §6.5/§11.8: the rotating priority player's weight in the objective; everyone else gets 1. */
export const PRIORITY_PLAYER_WEIGHT = 3;
export const PEER_PLAYER_WEIGHT = 1;

/** §6.5: "softmax-sample over the top 8 rather than argmax". */
export const SOFTMAX_POOL_SIZE = 8;
/** [SIMPLIFICATION] no data exists to fit this yet; a flat temperature is the documented placeholder. */
export const SOFTMAX_TEMPERATURE = 1;

/** P37 (2): the third strike, not the second, is what forces an injection. */
export const CONSECUTIVE_MISS_CAP = 2;
/** P37 (3): the force-injected item must be one the missing player finds easy. */
export const FORCE_INJECT_RETRIEVABILITY_FLOOR = 0.95;
/** P37 (4), and §1.5's minimum-gap rule: floor on any item's per-player recurrence. */
export const MIN_INTERVAL_DAYS = 1;

/** §11.1: a late-night session and the next morning are different product days. */
export const DAY_START_HOUR = 4;
const MS_PER_HOUR = 3_600_000;

export interface GroupPlayer {
  readonly playerId: PlayerId;
  /** §6.5: `w_π = 3` for the rotating priority player, `w_p = 1` otherwise. Caller-assigned - see the module doc on where `π` lives. */
  readonly weight: number;
  readonly memoryFor: (id: QuestionId) => ItemMemory | null;
  readonly isIntroduced: (charId: QuestionId) => boolean;
}

/** Per-table bookkeeping the four hard constraints read and write across a session. */
export interface GroupSessionState {
  /** P37 (1): items already dealt at this table this session. */
  readonly scoredThisSession: ReadonlySet<QuestionId>;
  /** P37 (2)/(3): consecutive misses since a player's last correct, this session. */
  readonly consecutiveMisses: Readonly<Record<PlayerId, number>>;
}

export function emptySessionState(): GroupSessionState {
  return { scoredThisSession: new Set(), consecutiveMisses: {} };
}

/**
 * P37 (1): "no item scored twice in one session." Applied to the candidate
 * pool before scoring, so a recurrence can never win the objective and reach
 * the table a second time.
 */
export function excludeScoredThisSession(
  candidates: readonly Question[],
  scoredThisSession: ReadonlySet<QuestionId>,
): Question[] {
  return candidates.filter((q) => !scoredThisSession.has(q.id));
}

/**
 * P37 (4)/§1.5: floors this player's recurrence of `question` at
 * {@link MIN_INTERVAL_DAYS}, independently of whether FSRS's own
 * retrievability formula would already call it due - a freshly-seeded item
 * can carry a stability well under a day, so without this guard it re-enters
 * the same player's due queue again the same evening.
 */
export function meetsMinimumInterval(question: Question, player: GroupPlayer, now: number): boolean {
  const memory = player.memoryFor(question.id);
  if (memory === null) return true;
  return elapsedDaysSince(memory.lastReview, now) >= MIN_INTERVAL_DAYS;
}

/** Retrievability for `player` on `question`, treating "never reviewed" as maximally due (R = 0), matching solo.ts's fresh-item convention. */
function retrievabilityFor(question: Question, player: GroupPlayer, now: number): number {
  const memory = player.memoryFor(question.id);
  if (memory === null) return 0;
  return retrievability(elapsedDaysSince(memory.lastReview, now), memory.stability);
}

/**
 * §6.5 point 1: "eligibility is applied per player, not group-wide." A
 * question is a candidate at all once it is eligible, due, and past the
 * minimum-interval floor for at least one seated player - never once for
 * every player, which is the "catastrophic" group-wide reading DESIGN.md
 * names explicitly.
 */
export function isCandidateForPlayer(question: Question, player: GroupPlayer, now: number): boolean {
  if (!isSpanEligible(question, player.isIntroduced)) return false;
  if (!isDue(player.memoryFor(question.id), now)) return false;
  return meetsMinimumInterval(question, player, now);
}

/**
 * §6.5 point 1: candidates = union of every seated player's due items,
 * filtered to the dealt scene, with per-player eligibility already applied.
 */
export function buildCandidatePool(
  pack: { readonly questions: readonly Question[] },
  scene: CategoryId,
  players: readonly GroupPlayer[],
  sessionState: GroupSessionState,
  now: number,
): Question[] {
  const inScene = pack.questions.filter((q) => q.category === scene);
  const union = inScene.filter((q) => players.some((p) => isCandidateForPlayer(q, p, now)));
  return excludeScoredThisSession(union, sessionState.scoredThisSession);
}

/** §11.8's corrected asymmetric squared loss, one player's term. */
function playerLoss(rP: number): number {
  const under = Math.max(0, GROUP_TARGET_RETENTION - rP);
  const over = Math.max(0, rP - GROUP_TARGET_RETENTION);
  return UNDER_TARGET_PENALTY_WEIGHT * under * under + OVER_TARGET_PENALTY_WEIGHT * over * over;
}

/** `U(i) = -Σ_p w_p·[3·max(0, R*-R_p)² + max(0, R_p-R*)²]` (§11.8, replacing the earlier symmetric §6.5 draft). */
export function objectiveScore(question: Question, players: readonly GroupPlayer[], now: number): number {
  let loss = 0;
  for (const player of players) {
    loss += player.weight * playerLoss(retrievabilityFor(question, player, now));
  }
  return -loss;
}

/**
 * P37 (2)/(3): after {@link CONSECUTIVE_MISS_CAP} consecutive misses by any
 * player, the *next* pick must be an item that player finds easy
 * (R_p > {@link FORCE_INJECT_RETRIEVABILITY_FLOOR}), overriding the
 * objective outright. Scans the whole scene, not just the already-built due
 * pool, because a "too easy" item is by construction not due.
 */
export function forceInjectionPool(
  pack: { readonly questions: readonly Question[] },
  scene: CategoryId,
  players: readonly GroupPlayer[],
  sessionState: GroupSessionState,
  now: number,
): { readonly forPlayerId: PlayerId; readonly pool: readonly Question[] } | null {
  for (const player of players) {
    const misses = sessionState.consecutiveMisses[player.playerId] ?? 0;
    if (misses < CONSECUTIVE_MISS_CAP) continue;
    const pool = pack.questions.filter((q) => {
      if (q.category !== scene) return false;
      if (sessionState.scoredThisSession.has(q.id)) return false;
      const memory = player.memoryFor(q.id);
      if (memory === null) return false;
      return retrievability(elapsedDaysSince(memory.lastReview, now), memory.stability) > FORCE_INJECT_RETRIEVABILITY_FLOOR;
    });
    if (pool.length > 0) return { forPlayerId: player.playerId, pool };
  }
  return null;
}

export interface PickItemResult {
  readonly question: Question;
  /** True when P37 (3) overrode the objective rather than the softmax choosing it. */
  readonly forcedInject: boolean;
  readonly forcedForPlayerId: PlayerId | null;
}

/**
 * §6.5: `pickItem(candidates, players[]) -> item`, pure and stateless. Takes
 * the scene's full question set (not a pre-filtered candidate list) because
 * eligibility and the four hard constraints must be applied per player
 * inside here, not by a caller that could get the per-player split wrong.
 */
export function pickItem(
  pack: { readonly questions: readonly Question[] },
  scene: CategoryId,
  players: readonly GroupPlayer[],
  sessionState: GroupSessionState,
  now: number,
  rng: Rng,
): PickItemResult | null {
  const forced = forceInjectionPool(pack, scene, players, sessionState, now);
  if (forced !== null) {
    const question = rng.pick(forced.pool);
    return { question, forcedInject: true, forcedForPlayerId: forced.forPlayerId };
  }

  const candidates = buildCandidatePool(pack, scene, players, sessionState, now);
  if (candidates.length === 0) return null;

  const scored = candidates
    .map((question) => ({ question, u: objectiveScore(question, players, now) }))
    .sort((a, b) => b.u - a.u)
    .slice(0, SOFTMAX_POOL_SIZE);

  const question = softmaxSample(rng, scored);
  return { question, forcedInject: false, forcedForPlayerId: null };
}

function softmaxSample(rng: Rng, scored: readonly { readonly question: Question; readonly u: number }[]): Question {
  const first = scored[0];
  if (first === undefined) throw new RangeError('softmaxSample on an empty pool');
  const max = scored.reduce((m, s) => Math.max(m, s.u), first.u);
  const weights = scored.map((s) => Math.exp((s.u - max) / SOFTMAX_TEMPERATURE));
  const total = weights.reduce((a, b) => a + b, 0);
  let draw = rng.next() * total;
  for (let i = 0; i < scored.length; i += 1) {
    draw -= weights[i] as number;
    if (draw <= 0) return (scored[i] as { question: Question }).question;
  }
  return (scored[scored.length - 1] as { question: Question }).question;
}

/**
 * Records the outcome of a dealt item into `sessionState` for the next
 * `pickItem` call: marks it scored (P37 (1)) and updates the answering
 * player's consecutive-miss streak (P37 (2)/(3)). A pure state transition,
 * not a persistence write - the caller still owns storing the result.
 */
export function advanceSessionState(
  sessionState: GroupSessionState,
  questionId: QuestionId,
  answererId: PlayerId,
  correct: boolean,
): GroupSessionState {
  const previous = sessionState.consecutiveMisses[answererId] ?? 0;
  return {
    scoredThisSession: new Set([...sessionState.scoredThisSession, questionId]),
    consecutiveMisses: {
      ...sessionState.consecutiveMisses,
      [answererId]: correct ? 0 : previous + 1,
    },
  };
}

/** UTC product day, `day_start = 4` (§11.1) - see the module doc's [SIMPLIFICATION] on timezone. */
function productDay(timestampMs: number): number {
  return Math.floor((timestampMs - DAY_START_HOUR * MS_PER_HOUR) / (24 * MS_PER_HOUR));
}

function isSameProductDay(aMs: number, bMs: number): boolean {
  return productDay(aMs) === productDay(bMs);
}

export interface GroupGradeResult {
  readonly grade: ReviewGrade;
  readonly role: ReviewRole;
}

/**
 * §6.5's group-specific grading path: an item dealt from someone else's
 * queue that is NEW for this player enters their schedule as a completed
 * first review, graded Hard on a correct and Again on a miss - the same
 * shape `gradeFromAnswer`'s first-encounter branch already produces, kept
 * here as its own named entry point because the *reason* differs (an
 * introduction engine for this player, not a review) even though the grade
 * table does not, per PLAN.md's "new grading path... not a replacement".
 *
 * P37 (2): if `memory` was already reviewed earlier the *same product day*
 * (mode-blind, per §6.5 "reconciling solo and group"), this encounter is
 * logged `exposure` regardless of correctness, so a same-session recurrence
 * cannot advance the item further - see the module doc's [SIMPLIFICATION]
 * on why this substitutes for an explicit LEARNING/SOLID state check.
 */
export function gradeGroupEncounter(memory: ItemMemory | null, correct: boolean, now: number): GroupGradeResult {
  if (memory !== null && isSameProductDay(memory.lastReview, now)) {
    return { grade: correct ? 'good' : 'again', role: 'exposure' };
  }
  return { grade: gradeFromAnswer(correct, memory === null), role: 'review' };
}
