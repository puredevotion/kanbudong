import type { CategoryContent } from './row.js';

/**
 * safety-instruction — generated from DESIGN.md §7, filed by GB 2894
 * category. `freqRank` unset: 指令 is a two-character word and DESIGN.md
 * §7.5.1 gives no corpus rank for it.
 */
export const SAFETY_INSTRUCTION: CategoryContent = {
  low: [
    [
      'On a blue sign. What is it telling you to do?',
      ['mandatory — solid blue circle', 'prohibition — red circle, diagonal bar', 'be careful, mind'],
      0,
      'zhǐlìng · gebod — blauwe cirkel (mandatory — solid blue circle). Easy to misread as "just information" — it is actually an order: you must do this.',
      { hanzi: '指令', pinyin: 'zhǐlìng', nl: 'gebod — blauwe cirkel', en: 'mandatory — solid blue circle' },
      undefined,
      { tier: 0 },
    ],
  ],
  mid: [
    [
      'On a blue sign. What is it telling you to do?',
      ['mandatory — solid blue circle', 'prohibition — red circle, diagonal bar', 'be careful, mind'],
      0,
      'zhǐlìng · gebod — blauwe cirkel (mandatory — solid blue circle). Easy to misread as "just information" — it is actually an order: you must do this.',
      { hanzi: '指令', pinyin: 'zhǐlìng', nl: 'gebod — blauwe cirkel', en: 'mandatory — solid blue circle' },
      undefined,
      { tier: 0 },
    ],
  ],
  high: [
    [
      'On a blue sign. What is it telling you to do?',
      ['mandatory — solid blue circle', 'prohibition — red circle, diagonal bar', 'be careful, mind'],
      0,
      'zhǐlìng · gebod — blauwe cirkel (mandatory — solid blue circle). Easy to misread as "just information" — it is actually an order: you must do this.',
      { hanzi: '指令', pinyin: 'zhǐlìng', nl: 'gebod — blauwe cirkel', en: 'mandatory — solid blue circle' },
      undefined,
      { tier: 0 },
    ],
  ],
};
