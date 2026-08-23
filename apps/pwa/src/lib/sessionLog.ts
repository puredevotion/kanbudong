import type { AttemptMode, PlayerId, SessionEvent } from '@kanbudong/engine';

/**
 * DESIGN.md §12.2's falsification instrument, recorded from day one per
 * PLAN.md Phase 9 ("get it logging early even if nothing consumes it yet"):
 * "if the median multiplayer gap exceeds ~7 days while solo sits under ~3,
 * invert the architecture." One session-start timestamp per mode per
 * calendar day is enough to compute the gap - logging every render would
 * only inflate storage, not the signal.
 *
 * Local and unsynced, same as `soloMemory.ts` - this is per-device usage
 * telemetry, not game state, so it has no business in the shared event log.
 */

const MAX_EVENTS = 2000;

function storageKey(playerId: PlayerId): string {
  return `kanbudong.sessionLog.v1.${playerId}`;
}

function load(playerId: PlayerId): SessionEvent[] {
  try {
    const raw = globalThis.localStorage?.getItem(storageKey(playerId));
    if (raw == null) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as SessionEvent[]) : [];
  } catch {
    return [];
  }
}

function save(playerId: PlayerId, events: readonly SessionEvent[]): void {
  try {
    globalThis.localStorage?.setItem(storageKey(playerId), JSON.stringify(events));
  } catch {
    // Storage blocked or full: the session still plays, it just won't be
    // instrumented, same degraded mode `soloMemory.ts` already tolerates.
  }
}

/** Records one session start, deduped to at most one per mode per calendar day. */
export function recordSessionStart(
  playerId: PlayerId,
  mode: AttemptMode,
  now: number = Date.now(),
): void {
  const events = load(playerId);
  const today = new Date(now).toDateString();
  const alreadyToday = events.some(
    (e) => e.mode === mode && new Date(e.startedAt).toDateString() === today,
  );
  if (alreadyToday) return;
  const next = [...events, { mode, startedAt: now }].slice(-MAX_EVENTS);
  save(playerId, next);
}

export function loadSessionEvents(playerId: PlayerId): SessionEvent[] {
  return load(playerId);
}
