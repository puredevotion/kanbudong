import type { CategoryContent } from './row.js';

/**
 * menu-flavour — generated from DESIGN.md §7.1. `freqRank` is Jun Da's Modern
 * Chinese Character Frequency List (lingua.mtsu.edu/chinese-computing,
 * 193,504,018-character corpus, 9,933 distinct characters, dated 2004-03-30)
 * — a different corpus from the one DESIGN.md's own prose cites, so these
 * numbers do not match DESIGN.md's inline ranks character-for-character.
 */
// 微辣/重辣 (context-authoring phase, Aug 2026) are the real spice-level
// gradations printed next to 辣, region-neutral, not curriculum-table
// entries, so `tier`/`freqRank` are left unset rather than guessed.
export const MENU_FLAVOUR: CategoryContent = {
  low: [
    [
      'Beside a dish. What is it warning you about?',
      ['chilli-hot', 'cold dishes', 'sweet'],
      0,
      'là · pittig, heet (chilli-hot, spicy). The most important warning character to recognize. Picture 辣 as a bundle of chili peppers (束) tied right onto the sign for a sharp, pungent taste (辛): là.',
      { hanzi: '辣', pinyin: 'là', nl: 'pittig, heet', en: 'chilli-hot' },
      undefined,
      { tier: 0, freqRank: 2420, glossProvenance: 'mnemonic-only' },
    ],
    [
      'Beside a dish. What is it warning you about?',
      ['numbing, lip-tingling', 'sour', 'soft drinks'],
      0,
      'má · verdovend, tintelend (numbing, lip-tingling). This is not spicy heat — it is a tingling, numbing sensation with no exact Dutch or English word. Picture 麻 as hemp stalks (林, two trees) drying under a lean-to roof (广) — fibres so sharp-edged they leave your fingers tingling and numb: má.',
      { hanzi: '麻', pinyin: 'má', nl: 'verdovend, tintelend', en: 'numbing, lip-tingling' },
      undefined,
      { tier: 0, freqRank: 1108, glossProvenance: 'mnemonic-only' },
    ],
    [
      'Beside a dish. What is it warning you about?',
      ['mild spice', 'sour', 'sweet'],
      0,
      'wēilà · licht pittig (mild spice) — the lowest rung on the spice-level scale printed next to a dish, below 中辣 and 重辣.',
      {
        hanzi: '微辣',
        pinyin: 'wēilà',
        nl: 'licht pittig',
        en: 'mild spice',
        context: { after: '  中辣  重辣' },
      },
    ],
    [
      'Beside a dish. What is it warning you about?',
      ['very spicy', 'salty', 'numbing, lip-tingling'],
      0,
      'zhònglà · extra pittig (very spicy) — the top of the spice-level scale, above 微辣 and 中辣.',
      {
        hanzi: '重辣',
        pinyin: 'zhònglà',
        nl: 'extra pittig',
        en: 'very spicy',
        context: { before: '微辣  中辣  ' },
      },
    ],
  ],
  mid: [
    [
      'Beside a dish. What is it warning you about?',
      ['salty', 'vegetarian', 'soft drinks'],
      0,
      'xián · zout (salty). Dishes labelled this way tend to be saltier than "salty" usually implies in Dutch or English. Picture 咸 as a halberd (戌) held right up to a mouth (口) — a taste sharp enough to feel like a blade: xián.',
      { hanzi: '咸', pinyin: 'xián', nl: 'zout', en: 'salty' },
      undefined,
      { tier: 1, freqRank: 2525, glossProvenance: 'mnemonic-only' },
    ],
    [
      'Beside a dish. What is it warning you about?',
      ['sour', 'tossed, dressed', 'cold dishes'],
      0,
      'suān · zuur (sour). Also marks pickled-vegetable dishes. Picture 酸 as someone doubling over (夋) right after taking a swig straight from the wine jar (酉) — a face-puckering sourness: suān.',
      { hanzi: '酸', pinyin: 'suān', nl: 'zuur', en: 'sour' },
      undefined,
      { tier: 1, freqRank: 1456, glossProvenance: 'mnemonic-only' },
    ],
    [
      'Beside a dish. What is it warning you about?',
      ['sweet', 'house specialty', 'egg'],
      0,
      'tián · zoet (sweet). In a savoury dish name, this means the sauce has sugar added. Picture 甜 as a tongue (舌) resting happily inside a mouth already savoring something sweet (甘): tián.',
      { hanzi: '甜', pinyin: 'tián', nl: 'zoet', en: 'sweet' },
      undefined,
      { tier: 1, freqRank: 2020, glossProvenance: 'mnemonic-only' },
    ],
  ],
  high: [
    [
      'Beside a dish. What is it warning you about?',
      ['sweet', 'skin, crackling', 'lamb, mutton, goat'],
      0,
      'tián · zoet (sweet). In a savoury dish name, this means the sauce has sugar added. Picture 甜 as a tongue (舌) resting happily inside a mouth already savoring something sweet (甘): tián.',
      { hanzi: '甜', pinyin: 'tián', nl: 'zoet', en: 'sweet' },
      undefined,
      { tier: 1, freqRank: 2020, glossProvenance: 'mnemonic-only' },
    ],
  ],
};
