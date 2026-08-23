import type {
  MnemonicPromptEvent,
  MnemonicPromptKind,
  PlayerId,
  QuestionId,
} from '@kanbudong/engine';

/**
 * Local half of the mnemonic-prompt-usage log (`packages/engine/src/mnemonicPromptLog.ts`
 * defines the shape and the pure aggregation). Same storage shape as
 * `attemptLog.ts`/`sessionLog.ts`: per-device usage telemetry, not game
 * state, so it never touches the synced event log or `TurnRecord`.
 */

const MAX_EVENTS = 2000;

function storageKey(playerId: PlayerId): string {
  return `kanbudong.mnemonicPromptLog.v1.${playerId}`;
}

function load(playerId: PlayerId): MnemonicPromptEvent[] {
  try {
    const raw = globalThis.localStorage?.getItem(storageKey(playerId));
    if (raw == null) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as MnemonicPromptEvent[]) : [];
  } catch {
    return [];
  }
}

function save(playerId: PlayerId, events: readonly MnemonicPromptEvent[]): void {
  try {
    globalThis.localStorage?.setItem(storageKey(playerId), JSON.stringify(events));
  } catch {
    // Storage blocked or full: the session still plays, it just won't be instrumented.
  }
}

/**
 * Records the outcome of one reveal that offered at least one mnemonic
 * prompt: `'self_explanation'` or `'loci'` when the player picked through
 * it, `'none'` when the breakdown was opened and a prompt was on offer but
 * the player never engaged. Exactly one event per reveal - callers should
 * call this once, on the reveal closing, not once per keystroke.
 */
export function recordMnemonicPromptUsed(
  playerId: PlayerId,
  questionId: QuestionId,
  kind: MnemonicPromptKind,
  now: number = Date.now(),
): void {
  const events = load(playerId);
  const next = [...events, { questionId, kind, at: now }].slice(-MAX_EVENTS);
  save(playerId, next);
}

export function loadMnemonicPromptEvents(playerId: PlayerId): MnemonicPromptEvent[] {
  return load(playerId);
}
