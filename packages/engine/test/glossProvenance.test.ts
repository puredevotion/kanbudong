import { describe, expect, it } from 'vitest';

import { COMPONENTS, SEED_PACK } from '../src/index.js';

/**
 * DESIGN.md §3.3.3(7): `glossProvenance: 'mnemonic-only'` labels an invented
 * memory aid so it is never mistaken for real etymology (the Chineasy
 * reputational liability DESIGN.md §1.7 #31 warns against). These checks
 * guard the ways that labelling could quietly rot:
 *
 * - a `mnemonic-only` item's `decomposition`, when present, must never claim
 *   a `'sound'` role UNLESS that component is itself registered at
 *   `reliability: 'exact'` (a real, checked pronunciation cue) or `'no-cue'`
 *   (verified to carry no cue at all, e.g. `DOOR_RADICAL`/户 in 所 - a genuine
 *   Dong Chinese `'sound'` component that shares no reading with suǒ) in
 *   `COMPONENTS`. Both are settled, checked end states; the partial-certainty
 *   tiers (`'rime-only'`, `'segmental'`) and the not-yet-checked
 *   `'unverified'` stay barred, since those could still read as a real cue
 *   under a mnemonic-only item's lighter scrutiny. `glossProvenance` labels
 *   the honesty of the explanation *prose* (an invented picture vs a
 *   documented origin story), not whether the underlying structural data is
 *   real: `DecompositionPanel`/`LociMnemonicPrompt` only ever render a
 *   `'sound'` role as an actual pronunciation hint when its reliability
 *   clears this same bar, regardless of the label next to it. A mnemonic-only
 *   decomposition-gap audit (Aug 2026, prompted by the 价 bug below) found
 *   several mnemonic-only items whose prose already named a phonetic
 *   component that turns out to be an exact reading match once its FULL
 *   `pinyin-data` reading list is checked (not just its more common primary
 *   reading) - e.g. 码's phonetic 马 (mǎ), 证's 正 (zhèng) - the same "only
 *   checked the primary reading" miss class `FAN_PHONETIC`/`FEN_PHONETIC`/
 *   `YAO_PHONETIC` document elsewhere in this bank. 价 (jià) is the original
 *   worked case: real semantic radical 亻 (verified, Make Me a Hanzi),
 *   phonetic half 介 fails the exact-tone-and-syllable bar (jiè/gè vs jià) so
 *   no phonetic claim is made there, and the mnemonic story uses 介's real
 *   standalone meaning ("between") as a memory hook without asserting it
 *   explains the sound;
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

  it('never claims an unverified phonetic role in a decomposition alongside a mnemonic-only gloss', () => {
    const offenders = mnemonicOnly.filter(
      (q) =>
        q.decomposition?.kind === 'character' &&
        q.decomposition.components.some((c) => {
          if (c.role !== 'sound') return false;
          const reliability = COMPONENTS[c.componentId]?.reliability;
          return reliability !== 'exact' && reliability !== 'no-cue';
        }),
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
