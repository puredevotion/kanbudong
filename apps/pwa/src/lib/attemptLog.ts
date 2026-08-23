import {
  computeCrossedASleepPeriod,
  resolveChosenItem,
  type AttemptRecord,
  type ContentPack,
  type PlayerId,
  type QuestionId,
  type RawSoloAttempt,
} from '@kanbudong/engine';

/**
 * DESIGN.md §10.1's "cheapest honest instrument": log `chosen_option` on
 * every attempt, not just correct/incorrect. Group mode already gets this
 * for free from the synced game log (`attemptRecordsFromHistory`, engine
 * side) - this module is the solo half, which has no shared log to derive
 * it from and so is the only mode that needs its own local storage for it.
 *
 * Local and unsynced, same as `soloMemory.ts`: this is per-device usage
 * telemetry, not game state.
 */

interface StoredSoloAttempt {
  readonly questionId: QuestionId;
  readonly chosenText: string | null;
  readonly correct: boolean;
  readonly timestamp: number;
  /** `ItemMemory.lastReview` as it stood *before* this attempt, or null on a first encounter. */
  readonly priorLastReview: number | null;
}

const MAX_ATTEMPTS = 2000;

function storageKey(playerId: PlayerId): string {
  return `kanbudong.attemptLog.v1.${playerId}`;
}

function load(playerId: PlayerId): StoredSoloAttempt[] {
  try {
    const raw = globalThis.localStorage?.getItem(storageKey(playerId));
    if (raw == null) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as StoredSoloAttempt[]) : [];
  } catch {
    return [];
  }
}

function save(playerId: PlayerId, attempts: readonly StoredSoloAttempt[]): void {
  try {
    globalThis.localStorage?.setItem(storageKey(playerId), JSON.stringify(attempts));
  } catch {
    // Storage blocked or full: the session still plays, it just won't be
    // instrumented, same degraded mode `soloMemory.ts` already tolerates.
  }
}

export function recordSoloAttempt(
  playerId: PlayerId,
  attempt: {
    readonly questionId: QuestionId;
    readonly chosenText: string | null;
    readonly correct: boolean;
    readonly priorLastReview: number | null;
  },
  now: number = Date.now(),
): void {
  const attempts = load(playerId);
  const next = [...attempts, { ...attempt, timestamp: now }].slice(-MAX_ATTEMPTS);
  save(playerId, next);
}

/**
 * The same stored log, shaped for `@kanbudong/engine`'s `buildFsrsTrainingSet`
 * instead of DESIGN.md §10.1's schema — no `ContentPack` needed, since a
 * refit only cares about item id, grade and elapsed time, not display text.
 */
export function loadRawSoloAttempts(playerId: PlayerId): RawSoloAttempt[] {
  return load(playerId).map((attempt) => ({
    itemId: attempt.questionId,
    correct: attempt.correct,
    timestamp: attempt.timestamp,
    priorLastReview: attempt.priorLastReview,
  }));
}

/** The solo half of the attempt log, shaped to DESIGN.md §10.1's schema for inspection or aggregation. */
export function soloAttemptRecords(playerId: PlayerId, pack: ContentPack): AttemptRecord[] {
  const byId = new Map(pack.questions.map((q) => [q.id, q] as const));
  const out: AttemptRecord[] = [];
  for (const attempt of load(playerId)) {
    const question = byId.get(attempt.questionId);
    if (question === undefined) continue;
    out.push({
      playerId,
      mode: 'solo',
      role: 'answerer',
      targetItem: attempt.questionId,
      chosenOption: attempt.chosenText,
      chosenItem: resolveChosenItem(pack, question, attempt.chosenText),
      correct: attempt.correct,
      timestamp: attempt.timestamp,
      crossedASleepPeriod: computeCrossedASleepPeriod(attempt.priorLastReview, attempt.timestamp),
    });
  }
  return out;
}
