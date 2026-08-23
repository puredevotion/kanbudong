import type { CategoryContent } from './row.js';

/** menu-order — generated from DESIGN.md §7. IDS notation verbatim; ui/glyphs.tsx draws it. */
export const MENU_ORDER: CategoryContent = {
  low: [
    [
      'On the menu. What does this mean?',
      ['large portion', 'lung', 'stir-fry', 'boil'],
      0,
      'dà fèn · grote portie. 份 is rank 742 but reads "share/copy" elsewhere',
      { hanzi: '大份', pinyin: 'dà fèn', nl: 'grote portie' },
    ],
  ],
  mid: [
    [
      'On the menu. What does this mean?',
      ['large portion', 'boil', 'shrimp, prawn', 'roast, grill'],
      0,
      'dà fèn · grote portie. 份 is rank 742 but reads "share/copy" elsewhere',
      { hanzi: '大份', pinyin: 'dà fèn', nl: 'grote portie' },
    ],
    [
      'On the menu. What does this mean?',
      ['small portion', 'beef', 'standard portion', 'master-stock braise'],
      0,
      'xiǎo fèn · kleine portie. The pair is the item, not the individual characters',
      { hanzi: '小份', pinyin: 'xiǎo fèn', nl: 'kleine portie' },
    ],
    [
      'On the menu. What does this mean?',
      ['cold dishes', 'chilli-hot', 'steam', 'cooked rice; also "meal"'],
      0,
      'liángcài · koude gerechten. Always the first section; 凉 is rank 1,602',
      { hanzi: '凉菜', pinyin: 'liángcài', nl: 'koude gerechten' },
    ],
    [
      'On the menu. What does this mean?',
      ['hot dishes', 'salty', 'steam', 'intestine'],
      0,
      'rècài · warme gerechten. 热 rank 475, 菜 rank 847 — both known, the pair still needs teaching',
      { hanzi: '热菜', pinyin: 'rècài', nl: 'warme gerechten' },
    ],
    [
      'On the menu. What does this mean?',
      ['soup', 'swish in broth', 'tossed, dressed', 'intestine'],
      0,
      'tāng · soep. Rank 1,393; single-character header',
      { hanzi: '汤', pinyin: 'tāng', nl: 'soep' },
    ],
    [
      'On the menu. What does this mean?',
      ['staples: rice, noodles, buns', 'market price', 'fish', 'large portion'],
      0,
      'zhǔshí · basisgerechten. Ordered last in China. A Dutch diner expecting bread first is misreading the whole page',
      { hanzi: '主食', pinyin: 'zhǔshí', nl: 'basisgerechten' },
    ],
    [
      'On the menu. What does this mean?',
      ['soft drinks', 'lamb, mutton, goat', 'house specialty', 'swish in broth'],
      0,
      'yǐnliào · frisdrank. Distinct from 酒水, which is alcohol',
      { hanzi: '饮料', pinyin: 'yǐnliào', nl: 'frisdrank' },
    ],
  ],
  high: [
    [
      'On the menu. What does this mean?',
      ['market price', 'lung', 'deep-fry', 'numbing, lip-tingling'],
      0,
      'shíjià · dagprijs. Both characters are common (24, 422); the compound is opaque and absent from every HSK level',
      { hanzi: '时价', pinyin: 'shíjià', nl: 'dagprijs' },
    ],
    [
      'On the menu. What does this mean?',
      ['standard portion', 'fish', 'soft drinks', 'flash-fry'],
      0,
      'lì · standaardportie. Rank 691 as "example" — the portion sense is invisible to frequency',
      { hanzi: '例', pinyin: 'lì', nl: 'standaardportie' },
    ],
    [
      'On the menu. What does this mean?',
      ['signature dish', 'long-stew', 'cold dishes', 'cooked rice; also "meal"'],
      0,
      'zhāopái · huisspecialiteit. Also means "shop sign" — same glyphs, two situations',
      { hanzi: '招牌', pinyin: 'zhāopái', nl: 'huisspecialiteit' },
    ],
    [
      'On the menu. What does this mean?',
      ['house specialty', 'covered braise', 'standard portion', 'lamb, mutton, goat'],
      0,
      'tèsè · specialiteit. Confusable with 特价 (§7.2); authored distractor pair',
      { hanzi: '特色', pinyin: 'tèsè', nl: 'specialiteit' },
    ],
    [
      'On the menu. What does this mean?',
      ['"from" (a price)', 'liver', 'per person', 'standard portion'],
      0,
      'qǐ · vanaf. 88元起 means 88 is the floor, not the price',
      { hanzi: '起', pinyin: 'qǐ', nl: 'vanaf' },
    ],
    [
      'On the menu. What does this mean?',
      ['per person', 'large portion', 'skin, crackling', 'soup'],
      0,
      'wèi · per persoon. Drives 茶位费 and 餐位费, the cover charges',
      { hanzi: '位', pinyin: 'wèi', nl: 'per persoon' },
    ],
  ],
};
