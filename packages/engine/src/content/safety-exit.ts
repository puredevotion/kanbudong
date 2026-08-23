import type { CategoryContent } from './row.js';

/**
 * safety-exit — generated from DESIGN.md §7, filed by GB 2894 category.
 * `freqRank` unset throughout: 提示 is a two-character word and DESIGN.md
 * §7.5.1 gives no corpus rank for it (only for the colour/shape category as
 * a whole), so no word-level rank is available to cite.
 */
export const SAFETY_EXIT: CategoryContent = {
  low: [
    [
      'On a green sign. Where does this take you?',
      ['notice, safe condition — green square', 'mandatory — solid blue circle', 'prohibition — red circle, diagonal bar'],
      0,
      'tíshì · aanwijzing — groen vierkant. Green is where safety is, not where danger is. Sets up 安全出口 below.',
      { hanzi: '提示', pinyin: 'tíshì', nl: 'aanwijzing — groen vierkant', en: 'notice, safe condition — green square' },
      undefined,
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
      undefined,
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
      undefined,
      { tier: 0 },
    ],
  ],
};
