import type { CategoryContent } from './row.js';

/**
 * safety-prohibition — generated from DESIGN.md §7, filed by GB 2894
 * category. `freqRank` unset throughout: DESIGN.md §7.5.2 only cites
 * per-character corpus ranks for 禁/止/严/勿 individually, never a rank for
 * the two-character words 禁止/请勿/严禁 as spans, so no word-level figure is
 * available to cite honestly.
 */
export const SAFETY_PROHIBITION: CategoryContent = {
  low: [
    [
      'On a sign. What is forbidden?',
      ['prohibition — red circle, diagonal bar', 'strictly forbidden', 'beware'],
      0,
      'jìnzhǐ · verbod — rode cirkel met streep. Red forbids. The shape carries the whole message; the characters under it are confirmation, not information.',
      { hanzi: '禁止', pinyin: 'jìnzhǐ', nl: 'verbod — rode cirkel met streep', en: 'prohibition — red circle, diagonal bar' },
      undefined,
      { tier: 0 },
    ],
    [
      'On a sign. What is forbidden?',
      ['please do not', 'mandatory — solid blue circle', 'warning — yellow triangle, black border'],
      0,
      'qǐngwù · gelieve niet. The polite register. Same force as 禁止 in practice — a traveller who reads 请勿 as a suggestion is wrong. 勿 appears almost nowhere else, which is exactly why it is unambiguous once known.',
      { hanzi: '请勿', pinyin: 'qǐngwù', nl: 'gelieve niet', en: 'please do not' },
      undefined,
      { tier: 0 },
    ],
  ],
  mid: [
    [
      'On a sign. What is forbidden?',
      ['prohibition — red circle, diagonal bar', 'beware', 'please do not'],
      0,
      'jìnzhǐ · verbod — rode cirkel met streep. Red forbids. The shape carries the whole message; the characters under it are confirmation, not information.',
      { hanzi: '禁止', pinyin: 'jìnzhǐ', nl: 'verbod — rode cirkel met streep', en: 'prohibition — red circle, diagonal bar' },
      undefined,
      { tier: 0 },
    ],
    [
      'On a sign. What is forbidden?',
      ['strictly forbidden', 'warning — yellow triangle, black border', 'prohibition — red circle, diagonal bar'],
      0,
      'yánjìn · streng verboden (strictly forbidden). The strongest prohibition wording; also appears in 严禁烟火 (fire and smoking strictly forbidden).',
      { hanzi: '严禁', pinyin: 'yánjìn', nl: 'streng verboden', en: 'strictly forbidden' },
      undefined,
      { tier: 1 },
    ],
  ],
  high: [
    [
      'On a sign. What is forbidden?',
      ['prohibition — red circle, diagonal bar', 'notice, safe condition — green square', 'danger'],
      0,
      'jìnzhǐ · verbod — rode cirkel met streep. Red forbids. The shape carries the whole message; the characters under it are confirmation, not information.',
      { hanzi: '禁止', pinyin: 'jìnzhǐ', nl: 'verbod — rode cirkel met streep', en: 'prohibition — red circle, diagonal bar' },
      undefined,
      { tier: 0 },
    ],
  ],
};
