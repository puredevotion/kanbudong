import { WATER_RADICAL } from '../components.js';
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
 *
 * 打包/购物车 (context-authoring phase, Aug 2026) are the real controls on a
 * QR ordering screen, not curriculum-table entries, so `tier`/`freqRank` are
 * left unset rather than guessed.
 *
 * 汤 carries the water radical `WATER_RADICAL` (decomposition-backfill pass,
 * Aug 2026), verified against the gitignored Make Me a Hanzi scratch copy;
 * see menu-cooking.ts's header for 涮, the other water-radical sibling. 特色
 * is tagged `confusion_type: 'shared-morpheme'` against 特价
 * (market-label.ts): both start with 特, and the explanation for 特色 already
 * named 特价 as the thing worth telling apart before this field existed.
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
      { hanzi: '汤', pinyin: 'tāng', nl: 'soep', en: 'soup', structure: 'left-right' },
      {
        kind: 'character',
        hanzi: '汤',
        components: [{ componentId: WATER_RADICAL.id, role: 'semantic' }],
        semantic_radical: WATER_RADICAL.id,
      },
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
    [
      'On the menu. What does this mean?',
      ['pack up, takeaway', 'large portion', 'staples: rice, noodles, buns'],
      0,
      'dǎbāo · inpakken (pack up, takeaway). Also what you ask for at the end of a meal to take leftovers home.',
      {
        hanzi: '打包',
        pinyin: 'dǎbāo',
        nl: 'inpakken, meenemen',
        en: 'pack up, takeaway',
        context: { after: '费+1元' },
      },
    ],
    [
      'On the menu. What does this mean?',
      ['shopping cart', 'checkout', 'small portion'],
      0,
      'gòuwùchē · winkelwagentje (shopping cart) — the running order on a QR ordering screen, the same word used for an online shopping cart.',
      {
        hanzi: '购物车',
        pinyin: 'gòuwùchē',
        nl: 'winkelwagentje',
        en: 'shopping cart',
        context: { after: ' 2' },
      },
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
      {
        tier: 2,
        confusion_type: 'shared-morpheme',
        confusable_with: ['market-label-low-1'],
      },
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
