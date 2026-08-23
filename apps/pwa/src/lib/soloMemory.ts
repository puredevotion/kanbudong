import type { ItemMemory, PlayerId, QuestionId } from '@kanbudong/engine';

/**
 * The local, unsynced half of §6.4's "two stores" split — the shared game log
 * lives in the signed event log; this is the private per-device memory store,
 * keyed by player so a shared phone in pass-and-play does not blend two
 * people's scheduling into one.
 */

type MemoryByItem = Record<QuestionId, ItemMemory>;

// v2: ItemMemory's stability/difficulty now come from ts-fsrs's FSRS-6 update
// (see packages/engine/src/memory.ts) instead of the old hand-rolled
// heuristic — the numbers are not comparable, so this is a clean-break
// version bump (docs/PLAN.md §0), not a migration. Old v1 rows are simply
// orphaned, unread by this code.
function storageKey(playerId: PlayerId): string {
  return `kanbudong.soloMemory.v2.${playerId}`;
}

function load(playerId: PlayerId): MemoryByItem {
  try {
    const raw = globalThis.localStorage?.getItem(storageKey(playerId));
    if (raw == null) return {};
    const parsed: unknown = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null ? (parsed as MemoryByItem) : {};
  } catch {
    return {};
  }
}

function save(playerId: PlayerId, memory: MemoryByItem): void {
  try {
    globalThis.localStorage?.setItem(storageKey(playerId), JSON.stringify(memory));
  } catch {
    // Storage blocked or full: the session still plays, it just won't remember
    // progress, same degraded mode the rest of the app already tolerates.
  }
}

export function getItemMemory(playerId: PlayerId, itemId: QuestionId): ItemMemory | null {
  return load(playerId)[itemId] ?? null;
}

export function loadAllMemory(playerId: PlayerId): (itemId: QuestionId) => ItemMemory | null {
  const memory = load(playerId);
  return (itemId) => memory[itemId] ?? null;
}

export function putItemMemory(playerId: PlayerId, itemId: QuestionId, item: ItemMemory): void {
  const memory = load(playerId);
  memory[itemId] = item;
  save(playerId, memory);
}
