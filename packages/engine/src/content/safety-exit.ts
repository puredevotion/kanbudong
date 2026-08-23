import type { CategoryContent } from './row.js';

/**
 * safety-exit — generated from DESIGN.md §7, filed by GB 2894 category.
 * `freqRank` unset throughout: 提示 is a two-character word and DESIGN.md
 * §7.5.1 gives no corpus rank for it (only for the colour/shape category as
 * a whole), so no word-level rank is available to cite.
 *
 * Coverage push (Aug 2026, DESIGN.md §9.1): 提示 ("to raise" + "to show" -
 * genuinely transparent: raising something into view is what a prompt does)
 * gets a `WordDecomposition`, backed by a new standalone, 提.
 */
export const SAFETY_EXIT: CategoryContent = {
  low: [
    [
      'On a green sign. Where does this take you?',
      ['notice, safe condition — green square', 'mandatory — solid blue circle', 'prohibition — red circle, diagonal bar'],
      0,
      'tíshì · aanwijzing — groen vierkant. Green is where safety is, not where danger is. Sets up 安全出口 below.',
      { hanzi: '提示', pinyin: 'tíshì', nl: 'aanwijzing — groen vierkant', en: 'notice, safe condition — green square' },
      { kind: 'word', hanzi: '提示', morphemes: [
        { span: '提', gloss: 'to raise' },
        { span: '示', gloss: 'to show' },
      ] },
      { tier: 0 },
    ],
  ],
  mid: [
    [
      'On a green sign. Where does this take you?',
      ['notice, safe condition — green square', 'mandatory — solid blue circle', 'prohibition — red circle, diagonal bar'],
      0,
      'tíshì · aanwijzing — groen vierkant. Green is where safety is, not where danger is. Sets up 安全出口 below.',
      { hanzi: '提示', pinyin: 'tíshì', nl: 'aanwijzing — groen vierkant', en: 'notice, safe condition — green square' },
      { kind: 'word', hanzi: '提示', morphemes: [
        { span: '提', gloss: 'to raise' },
        { span: '示', gloss: 'to show' },
      ] },
      { tier: 0 },
    ],
  ],
  high: [
    [
      'On a green sign. Where does this take you?',
      ['notice, safe condition — green square', 'mandatory — solid blue circle', 'prohibition — red circle, diagonal bar'],
      0,
      'tíshì · aanwijzing — groen vierkant. Green is where safety is, not where danger is. Sets up 安全出口 below.',
      { hanzi: '提示', pinyin: 'tíshì', nl: 'aanwijzing — groen vierkant', en: 'notice, safe condition — green square' },
      { kind: 'word', hanzi: '提示', morphemes: [
        { span: '提', gloss: 'to raise' },
        { span: '示', gloss: 'to show' },
      ] },
      { tier: 0 },
    ],
    [
      'On a green sign. Where does this take you?',
      ['to raise, lift', 'to show', 'mandatory — solid blue circle'],
      0,
      'tí · optillen (to raise, lift). Seen in 提示 (notice, prompt, literally "raised into view"). Picture 提 as a hand (扌) lifting the one thing that is (是) correct, up where everyone can see it: tí.',
      { hanzi: '提', pinyin: 'tí', nl: 'optillen', en: 'to raise, lift' },
      undefined,
      { glossProvenance: 'mnemonic-only' },
    ],
  ],
};
