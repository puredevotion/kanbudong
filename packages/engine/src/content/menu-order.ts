import type { CategoryContent } from './row.js';

/** menu-order — generated from DESIGN.md §7. Bridge content; §6.1's span model replaces it. */
export const MENU_ORDER: CategoryContent = {
  low: [
    [
      '大份 — you see this on a sign. What does it mean?',
      ['large portion', 'lung', 'stir-fry', 'boil'],
      0,
      'dà fèn · grote portie. 份 is rank 742 but reads "share/copy" elsewhere',
    ],
  ],
  mid: [
    [
      '大份 — you see this on a sign. What does it mean?',
      ['large portion', 'boil', 'shrimp, prawn', 'roast, grill'],
      0,
      'dà fèn · grote portie. 份 is rank 742 but reads "share/copy" elsewhere',
    ],
    [
      '小份 — you see this on a sign. What does it mean?',
      ['small portion', 'beef', 'standard portion', 'master-stock braise'],
      0,
      'xiǎo fèn · kleine portie. The pair is the item, not the individual characters',
    ],
    [
      '凉菜 — you see this on a sign. What does it mean?',
      ['cold dishes', 'chilli-hot', 'steam', 'cooked rice; also "meal"'],
      0,
      'liángcài · koude gerechten. Always the first section; 凉 is rank 1,602',
    ],
    [
      '热菜 — you see this on a sign. What does it mean?',
      ['hot dishes', 'salty', 'steam', 'intestine'],
      0,
      'rècài · warme gerechten. 热 rank 475, 菜 rank 847 — both known, the pair still needs teaching',
    ],
    [
      '汤 — you see this on a sign. What does it mean?',
      ['soup', 'swish in broth', 'tossed, dressed', 'intestine'],
      0,
      'tāng · soep. Rank 1,393; single-character header',
    ],
    [
      '主食 — you see this on a sign. What does it mean?',
      ['staples: rice, noodles, buns', 'market price', 'fish', 'large portion'],
      0,
      'zhǔshí · basisgerechten. Ordered last in China. A Dutch diner expecting bread first is misreading the whole page',
    ],
    [
      '饮料 — you see this on a sign. What does it mean?',
      ['soft drinks', 'lamb, mutton, goat', 'house specialty', 'swish in broth'],
      0,
      'yǐnliào · frisdrank. Distinct from 酒水, which is alcohol',
    ],
  ],
  high: [
    [
      '时价 — you see this on a sign. What does it mean?',
      ['market price', 'lung', 'deep-fry', 'numbing, lip-tingling'],
      0,
      'shíjià · dagprijs. Both characters are common (24, 422); the compound is opaque and absent from every HSK level',
    ],
    [
      '例 — you see this on a sign. What does it mean?',
      ['standard portion', 'fish', 'soft drinks', 'flash-fry'],
      0,
      'lì · standaardportie. Rank 691 as "example" — the portion sense is invisible to frequency',
    ],
    [
      '招牌 — you see this on a sign. What does it mean?',
      ['signature dish', 'long-stew', 'cold dishes', 'cooked rice; also "meal"'],
      0,
      'zhāopái · huisspecialiteit. Also means "shop sign" — same glyphs, two situations',
    ],
    [
      '特色 — you see this on a sign. What does it mean?',
      ['house specialty', 'covered braise', 'standard portion', 'lamb, mutton, goat'],
      0,
      'tèsè · specialiteit. Confusable with 特价 (§7.2); authored distractor pair',
    ],
    [
      '起 — you see this on a sign. What does it mean?',
      ['"from" (a price)', 'liver', 'per person', 'standard portion'],
      0,
      'qǐ · vanaf. 88元起 means 88 is the floor, not the price',
    ],
    [
      '位 — you see this on a sign. What does it mean?',
      ['per person', 'large portion', 'skin, crackling', 'soup'],
      0,
      'wèi · per persoon. Drives 茶位费 and 餐位费, the cover charges',
    ],
  ],
};
