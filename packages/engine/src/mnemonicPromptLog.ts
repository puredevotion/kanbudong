/**
 * Instrumentation for the reveal's optional mnemonic prompts (self-
 * explanation, PLAN.md Phase 8; the loci hedge, this phase - see
 * `lociMnemonic.ts` for why that one is a hedge and not a validated
 * mechanic). Both prompts are opt-in, so `'none'` has to be a first-class
 * outcome here, not an absence: a stream that only ever logs button presses
 * cannot distinguish "shown and ignored" from "never shown," and DESIGN.md
 * §10's instrumentation ruling treats that distinction as the whole point of
 * logging a hedge at all.
 */

import type { QuestionId } from './types.js';

export type MnemonicPromptKind = 'self_explanation' | 'loci' | 'none';

export interface MnemonicPromptEvent {
  readonly questionId: QuestionId;
  readonly kind: MnemonicPromptKind;
  readonly at: number;
}

/** Counts by kind, all three keys always present so a zero reads as zero, never as a missing key. */
export function summarizeMnemonicPromptUsage(
  events: readonly MnemonicPromptEvent[],
): Readonly<Record<MnemonicPromptKind, number>> {
  const counts: Record<MnemonicPromptKind, number> = { self_explanation: 0, loci: 0, none: 0 };
  for (const event of events) counts[event.kind] += 1;
  return counts;
}
