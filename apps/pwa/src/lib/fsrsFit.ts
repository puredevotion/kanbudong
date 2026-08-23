import type { PersonalFsrsFit, PlayerId } from '@kanbudong/engine';

/**
 * The local, unsynced store for a player's fitted FSRS-6 `w` — same shape of
 * concern as `soloMemory.ts`: private per-device scheduling state, never
 * part of the shared game log. Storing this separately from `soloMemory.ts`
 * (rather than folding it into that per-item map) keeps a single-record
 * read/write instead of dragging a per-player fit in and out on every
 * per-item memory access.
 */
function storageKey(playerId: PlayerId): string {
  return `kanbudong.fsrsFit.v1.${playerId}`;
}

export function getFsrsFit(playerId: PlayerId): PersonalFsrsFit | null {
  try {
    const raw = globalThis.localStorage?.getItem(storageKey(playerId));
    if (raw == null) return null;
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      !Array.isArray((parsed as PersonalFsrsFit).w) ||
      typeof (parsed as PersonalFsrsFit).fittedAt !== 'number' ||
      typeof (parsed as PersonalFsrsFit).reviewCount !== 'number'
    ) {
      return null;
    }
    return parsed as PersonalFsrsFit;
  } catch {
    return null;
  }
}

export function putFsrsFit(playerId: PlayerId, fit: PersonalFsrsFit): void {
  try {
    globalThis.localStorage?.setItem(storageKey(playerId), JSON.stringify(fit));
  } catch {
    // Storage blocked or full: the player just keeps scheduling on whatever
    // w they had before (default_w, if this is their first fit) - same
    // degraded mode soloMemory.ts and attemptLog.ts already tolerate.
  }
}
