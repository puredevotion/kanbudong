import type { CategoryContent } from './row.js';

/**
 * menu-order — generated from DESIGN.md §7.1. `freqRank` (single characters
 * only; DESIGN.md never states a compound's own corpus rank, only its parts')
 * is Jun Da's Modern Chinese Character Frequency List
 * (lingua.mtsu.edu/chinese-computing, 193,504,018-character corpus, 9,933
 * distinct characters, dated 2004-03-30) — a different corpus from the one
 * DESIGN.md's own prose cites, so numbers here do not match DESIGN.md's
 * inline ranks character-for-character. 时价 and 招牌 are marked
 * `transparency: 'opaque'` per DESIGN.md §3.3.3(8), which names both as
 * non-compositional ("no useful decomposition, learn this whole").
 */
export const MENU_ORDER: CategoryContent = {
  low: [
    [
      'On the menu. What does this mean?',
      ['large portion', 'stir-fry', 'boil'],
      0,
      'dà fèn · grote portie (large portion). 份 can also mean "share" or "copy" elsewhere, so read it with 大 for this sense.',
      { hanzi: '大份', pinyin: 'dà fèn', nl: 'grote portie', en: 'large portion' },
      undefined,
      { tier: 1 },
    ],
  ],
  mid: [
    [
      'On the menu. What does this mean?',
      ['large portion', 'shrimp, prawn', 'roast, grill'],
      0,
      'dà fèn · grote portie (large portion). 份 can also mean "share" or "copy" elsewhere, so read it with 大 for this sense.',
      { hanzi: '大份', pinyin: 'dà fèn', nl: 'grote portie', en: 'large portion' },
      undefined,
      { tier: 1 },
    ],
    [
      'On the menu. What does this mean?',
      ['small portion', 'beef', 'standard portion'],
      0,
      'xiǎo fèn · kleine portie (small portion). Read the two characters together as one term, not separately.',
      { hanzi: '小份', pinyin: 'xiǎo fèn', nl: 'kleine portie', en: 'small portion' },
      undefined,
      { tier: 1 },
    ],
    [
      'On the menu. What does this mean?',
      ['cold dishes', 'chilli-hot', 'steam'],
      0,
      'liángcài · koude gerechten (cold dishes). These are always listed as the first section on the menu.',
      { hanzi: '凉菜', pinyin: 'liángcài', nl: 'koude gerechten', en: 'cold dishes' },
      undefined,
      { tier: 1 },
    ],
    [
      'On the menu. What does this mean?',
      ['hot dishes', 'salty', 'steam'],
      0,
      'rècài · warme gerechten (hot dishes). Usually the section right after the cold dishes.',
      { hanzi: '热菜', pinyin: 'rècài', nl: 'warme gerechten', en: 'hot dishes' },
      undefined,
      { tier: 1 },
    ],
    [
      'On the menu. What does this mean?',
      ['soup', 'swish in broth', 'tossed, dressed'],
      0,
      'tāng · soep (soup). Often stands alone as a menu section header.',
      { hanzi: '汤', pinyin: 'tāng', nl: 'soep', en: 'soup' },
      undefined,
      { tier: 1, freqRank: 1618 },
    ],
    [
      'On the menu. What does this mean?',
      ['staples: rice, noodles, buns', 'market price', 'large portion'],
      0,
      'zhǔshí · basisgerechten (staples: rice, noodles, buns). Unlike a Dutch meal, these are served last, not first.',
      { hanzi: '主食', pinyin: 'zhǔshí', nl: 'basisgerechten', en: 'staples: rice, noodles, buns' },
      undefined,
      { tier: 1 },
    ],
    [
      'On the menu. What does this mean?',
      ['soft drinks', 'house specialty', 'swish in broth'],
      0,
      'yǐnliào · frisdrank (soft drinks). Different from 酒水, which means alcoholic drinks.',
      { hanzi: '饮料', pinyin: 'yǐnliào', nl: 'frisdrank', en: 'soft drinks' },
      undefined,
      { tier: 1 },
    ],
  ],
  high: [
    [
      'On the menu. What does this mean?',
      ['market price', 'deep-fry', 'numbing, lip-tingling'],
      0,
      'shíjià · dagprijs (market price, i.e. it varies by day). Worth memorizing as a whole word since the two characters don\'t hint at this meaning on their own.',
      { hanzi: '时价', pinyin: 'shíjià', nl: 'dagprijs', en: 'market price', transparency: 'opaque' },
      undefined,
      { tier: 2 },
    ],
    [
      'On the menu. What does this mean?',
      ['standard portion', 'soft drinks', 'flash-fry'],
      0,
      'lì · standaardportie (standard portion). Usually means "example" elsewhere, so this menu sense is a special case worth remembering.',
      { hanzi: '例', pinyin: 'lì', nl: 'standaardportie', en: 'standard portion' },
      undefined,
      { tier: 2, freqRank: 547 },
    ],
    [
      'On the menu. What does this mean?',
      ['signature dish', 'long-stew', 'cold dishes'],
      0,
      'zhāopái · huisspecialiteit (signature dish). The same word can also mean "shop sign" in other contexts.',
      { hanzi: '招牌', pinyin: 'zhāopái', nl: 'huisspecialiteit', en: 'signature dish', transparency: 'opaque' },
      undefined,
      { tier: 2 },
    ],
    [
      'On the menu. What does this mean?',
      ['house specialty', 'covered braise', 'standard portion'],
      0,
      'tèsè · specialiteit (house specialty). Easy to confuse with 特价 (special price) — look closely at the second character.',
      { hanzi: '特色', pinyin: 'tèsè', nl: 'specialiteit', en: 'house specialty' },
      undefined,
      { tier: 2 },
    ],
    [
      'On the menu. What does this mean?',
      ['"from" (a price)', 'per person', 'standard portion'],
      0,
      'qǐ · vanaf ("from," used with a price). E.g. 88元起 means prices start at 88 yuan, not that it costs exactly 88.',
      { hanzi: '起', pinyin: 'qǐ', nl: 'vanaf', en: '"from" (a price)' },
      undefined,
      { tier: 2, freqRank: 75 },
    ],
    [
      'On the menu. What does this mean?',
      ['per person', 'large portion', 'soup'],
      0,
      'wèi · per persoon (per person). Shows up in charges like 茶位费 and 餐位费 (tea/table cover charges).',
      { hanzi: '位', pinyin: 'wèi', nl: 'per persoon', en: 'per person' },
      undefined,
      { tier: 2, freqRank: 182 },
    ],
  ],
};
