import { describe, expect, it } from 'vitest';

import { SEED_PACK } from '../src/index.js';

/**
 * DESIGN.md §3.3.3(7): `glossProvenance: 'mnemonic-only'` labels an invented
 * memory aid so it is never mistaken for real etymology (the Chineasy
 * reputational liability DESIGN.md §1.7 #31 warns against). These two checks
 * guard the two ways that labelling could quietly rot:
 *
 * - a `mnemonic-only` item picking up a `decomposition` later would present
 *   an invented story and a verified one side by side, blurring exactly the
 *   line this field exists to keep sharp;
 * - the explanation prose drifting into confident-sounding etymological
 *   language ("originally", "derived from", "ancient"), which reads as a
 *   historical claim regardless of what the UI label says next to it.
 *
 * The second check is a lightweight heuristic, not a prose-quality audit —
 * it only catches the specific phrasing this content-authoring pass was told
 * to avoid, on the assumption that manual review (this pass's own) catches
 * the rest.
 */
describe('glossProvenance: mnemonic-only', () => {
  const mnemonicOnly = SEED_PACK.questions.filter((q) => q.glossProvenance === 'mnemonic-only');

  it('finds the mnemonic-only items this content pass added', () => {
    expect(mnemonicOnly.length).toBeGreaterThanOrEqual(90);
  });

  it('never carries a decomposition alongside a mnemonic-only gloss', () => {
    const withBoth = mnemonicOnly.filter((q) => q.decomposition !== undefined);
    expect(withBoth.map((q) => q.id)).toEqual([]);
  });

  it('never carries etymological-sounding language in the explanation', () => {
    const historyClaimPattern = /\b(originally|derived from|ancient|historically)\b/i;
    const offenders = mnemonicOnly.filter((q) => historyClaimPattern.test(q.explanation));
    expect(offenders.map((q) => q.id)).toEqual([]);
  });

  it('always writes the mnemonic as an invented picture, not an assertion', () => {
    const invitesPattern = /\b(picture|think of)\b/i;
    const offenders = mnemonicOnly.filter((q) => !invitesPattern.test(q.explanation));
    expect(offenders.map((q) => q.id)).toEqual([]);
  });
});
