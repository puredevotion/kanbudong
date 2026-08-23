/**
 * The attempt log's product-level schema (docs/DESIGN.md §10.1): what a
 * single graded response looks like once role and cross-item confusion are
 * both attached, and the confusion matrix built from a stream of them.
 *
 * This module only shapes and aggregates data the rest of the engine already
 * produces - it does not decide when an attempt happens or persist anything,
 * per PLAN.md Phase 9's "add checks and logs around existing behaviour, no
 * scheduling change."
 */

import { elapsedDaysSince } from './memory.js';
import type { ContentPack, PlayerId, Question, QuestionId, TeamId, TurnRecord } from './types.js';

export type AttemptMode = 'solo' | 'group';

/**
 * DESIGN.md §10.1: pooled accuracy across these roles hides roughly the
 * testing-effect gap (Rowland 2014) between answering and merely watching -
 * `answerer` and `co_committed` are reported as two series, never pooled.
 */
export type AttemptRole = 'answerer' | 'co_committed' | 'observer' | 'exposure';

export interface AttemptRecord {
  readonly playerId: PlayerId;
  readonly mode: AttemptMode;
  readonly role: AttemptRole;
  readonly targetItem: QuestionId;
  /** The literal text chosen - "log chosen_option, not just correct/incorrect" (§10.1/P15). */
  readonly chosenOption: string | null;
  /** The other bank item `chosenOption` belongs to, when the wrong answer is itself a confusable item's text. */
  readonly chosenItem: QuestionId | null;
  readonly correct: boolean;
  readonly timestamp: number;
  /** Null when there is no prior review to measure a gap from - a first encounter, or a mode with no per-item review clock. */
  readonly crossedASleepPeriod: boolean | null;
}

/**
 * Resolves a chosen option's text back to the bank item it belongs to, but
 * only among `target`'s own declared `confusable_with` set - matching text
 * against the whole bank would produce false positives from two unrelated
 * items that happen to share a gloss word.
 */
export function resolveChosenItem(
  pack: ContentPack,
  target: Question,
  chosenOption: string | null,
): QuestionId | null {
  if (chosenOption === null) return null;
  const byId = new Map(pack.questions.map((q) => [q.id, q] as const));
  for (const candidateId of target.confusable_with ?? []) {
    const candidate = byId.get(candidateId);
    if (candidate !== undefined && candidate.options.includes(chosenOption)) return candidateId;
  }
  return null;
}

/** §10.1's `crossed_a_sleep_period`: at least one elapsed day since the item's last review. Null on a first encounter. */
export function computeCrossedASleepPeriod(lastReview: number | null, now: number): boolean | null {
  if (lastReview === null) return null;
  return elapsedDaysSince(lastReview, now) >= 1;
}

/**
 * §10.1's per-user confusion matrix, `confusion[target][chosen]`
 * (`confusion[入口][出口]` in the design doc's own example). Built only from
 * wrong answers with a resolved `chosenItem` - a correct answer or an
 * unresolvable distractor has nothing to key a cross-association on.
 */
export function buildConfusionMatrix(
  attempts: readonly AttemptRecord[],
): ReadonlyMap<QuestionId, ReadonlyMap<QuestionId, number>> {
  const matrix = new Map<QuestionId, Map<QuestionId, number>>();
  for (const attempt of attempts) {
    if (attempt.correct || attempt.chosenItem === null) continue;
    let row = matrix.get(attempt.targetItem);
    if (row === undefined) {
      row = new Map();
      matrix.set(attempt.targetItem, row);
    }
    row.set(attempt.chosenItem, (row.get(attempt.chosenItem) ?? 0) + 1);
  }
  return matrix;
}

/**
 * §10.1's role split for the group surface, derived from `TurnRecord` rather
 * than stored separately: `answerer` is whoever actually submitted,
 * `co_committed` is a teammate who did not, `observer` is the other side.
 * `exposure` never applies here - that role is reserved for items credited
 * via `creditComponentExposure` (memory.ts), which never produces a
 * `TurnRecord` at all.
 */
export function roleForTurn(record: TurnRecord, playerId: PlayerId, myTeamId: TeamId | null): AttemptRole {
  if (record.answererId === playerId) return 'answerer';
  if (myTeamId !== null && record.teamId === myTeamId) return 'co_committed';
  return 'observer';
}

/**
 * Derives group-mode attempt records straight from the already-synced game
 * log - every peer already folds the same `history`, so there is nothing new
 * to persist for this mode. A timeout is excluded: nobody chose anything, so
 * there is no `chosen_option` to log.
 *
 * `crossedASleepPeriod` is left `null` for every record: the group scheduler
 * (`groupSchedule.ts`) is PLAN.md's own "simplified stand-in" and keeps no
 * per-(player, item) review clock the way `memory.ts` does for solo, so
 * there is no honest gap to report yet rather than an invented one.
 */
export function attemptRecordsFromHistory(
  pack: ContentPack,
  history: readonly TurnRecord[],
  playerId: PlayerId,
  myTeamId: TeamId | null,
): AttemptRecord[] {
  const byId = new Map(pack.questions.map((q) => [q.id, q] as const));
  const out: AttemptRecord[] = [];
  for (const record of history) {
    if (record.timedOut) continue;
    const question = byId.get(record.questionId);
    if (question === undefined) continue;
    out.push({
      playerId,
      mode: 'group',
      role: roleForTurn(record, playerId, myTeamId),
      targetItem: record.questionId,
      chosenOption: record.chosenText,
      chosenItem: resolveChosenItem(pack, question, record.chosenText),
      correct: record.correct,
      timestamp: record.at,
      crossedASleepPeriod: null,
    });
  }
  return out;
}
