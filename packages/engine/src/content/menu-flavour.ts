import type { CategoryContent } from './row.js';

/**
 * menu-flavour — generated from DESIGN.md §7.1. `freqRank` is Jun Da's Modern
 * Chinese Character Frequency List (lingua.mtsu.edu/chinese-computing,
 * 193,504,018-character corpus, 9,933 distinct characters, dated 2004-03-30)
 * — a different corpus from the one DESIGN.md's own prose cites, so these
 * numbers do not match DESIGN.md's inline ranks character-for-character.
 */
export const MENU_FLAVOUR: CategoryContent = {
  low: [
    [
      'Beside a dish. What is it warning you about?',
      ['chilli-hot', 'cold dishes', 'sweet'],
      0,
      'là · pittig, heet (chilli-hot, spicy). The most important warning character to recognize.',
      { hanzi: '辣', pinyin: 'là', nl: 'pittig, heet', en: 'chilli-hot' },
      undefined,
      { tier: 0, freqRank: 2420 },
    ],
    [
      'Beside a dish. What is it warning you about?',
      ['numbing, lip-tingling', 'sour', 'soft drinks'],
      0,
      'má · verdovend, tintelend (numbing, lip-tingling). This is not spicy heat — it is a tingling, numbing sensation with no exact Dutch or English word.',
      { hanzi: '麻', pinyin: 'má', nl: 'verdovend, tintelend', en: 'numbing, lip-tingling' },
      undefined,
      { tier: 0, freqRank: 1108 },
    ],
  ],
  mid: [
    [
      'Beside a dish. What is it warning you about?',
      ['salty', 'vegetarian', 'soft drinks'],
      0,
      'xián · zout (salty). Dishes labelled this way tend to be saltier than "salty" usually implies in Dutch or English.',
      { hanzi: '咸', pinyin: 'xián', nl: 'zout', en: 'salty' },
      undefined,
      { tier: 1, freqRank: 2525 },
    ],
    [
      'Beside a dish. What is it warning you about?',
      ['sour', 'tossed, dressed', 'cold dishes'],
      0,
      'suān · zuur (sour). Also marks pickled-vegetable dishes.',
      { hanzi: '酸', pinyin: 'suān', nl: 'zuur', en: 'sour' },
      undefined,
      { tier: 1, freqRank: 1456 },
    ],
    [
      'Beside a dish. What is it warning you about?',
      ['sweet', 'house specialty', 'egg'],
      0,
      'tián · zoet (sweet). In a savoury dish name, this means the sauce has sugar added.',
      { hanzi: '甜', pinyin: 'tián', nl: 'zoet', en: 'sweet' },
      undefined,
      { tier: 1, freqRank: 2020 },
    ],
  ],
  high: [
    [
      'Beside a dish. What is it warning you about?',
      ['sweet', 'skin, crackling', 'lamb, mutton, goat'],
      0,
      'tián · zoet (sweet). In a savoury dish name, this means the sauce has sugar added.',
      { hanzi: '甜', pinyin: 'tián', nl: 'zoet', en: 'sweet' },
      undefined,
      { tier: 1, freqRank: 2020 },
    ],
  ],
};
