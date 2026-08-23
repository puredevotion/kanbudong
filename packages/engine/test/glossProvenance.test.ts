import { describe, expect, it } from 'vitest';

import { SEED_PACK } from '../src/index.js';

/**
 * DESIGN.md §3.3.3(7): `glossProvenance: 'mnemonic-only'` labels an invented
 * memory aid so it is never mistaken for real etymology (the Chineasy
 * reputational liability DESIGN.md §1.7 #31 warns against). These checks
 * guard the ways that labelling could quietly rot:
 *
 * - a `mnemonic-only` item's `decomposition`, when present, must never claim
 *   a `phonetic` role - a phonetic claim needs the exact-match verification
 *   bar the rest of this bank holds it to, and a mnemonic-only item is
 *   definitionally one where that couldn't be verified. A `semantic`-only
 *   decomposition (a real, Kangxi-verified radical) is fine alongside a
 *   mnemonic-only *prose* story: `DecompositionPanel` only ever renders
 *   verified structural facts regardless of `glossProvenance`, which labels
 *   the explanation text, not the decomposition data. 价 (jià) is the worked
 *   case: real semantic radical 亻 (verified, Make Me a Hanzi), phonetic half
 *   介 fails the exact-tone-and-syllable bar (jiè/gè vs jià) so no phonetic
 *   claim is made, and the mnemonic story uses 介's real standalone meaning
 *   ("between") as a memory hook without asserting it explains the sound;
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

  it('never claims a phonetic role in a decomposition alongside a mnemonic-only gloss', () => {
    const offenders = mnemonicOnly.filter(
      (q) => q.decomposition?.kind === 'character' && q.decomposition.components.some((c) => c.role === 'phonetic'),
    );
    expect(offenders.map((q) => q.id)).toEqual([]);
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
