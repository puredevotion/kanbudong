import {
  CAI_PHONETIC,
  DIPPER_RADICAL,
  GRASS_RADICAL,
  LIE_PHONETIC,
  PERSON_RADICAL,
  QI_PHONETIC,
  RUN_RADICAL,
  STAND_SEMANTIC,
  WATER_RADICAL,
} from '../components.js';
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
 *
 * Coverage push (Aug 2026, DESIGN.md §9.1): 大份/小份 get `WordDecomposition`s
 * resolving fully via the existing 份 standalone (market-panel.ts); 打包 and
 * 购物车 resolve fully via the existing 包/车 standalones. 特色 gets one too,
 * resolving via market-label.ts's new 特. 凉菜/热菜 share a new standalone,
 * 菜, authored here (neither 凉/热/菜 existed before). 饮料 gets a new
 * standalone, 料, also reused by market-panel.ts's 配料表 - 饮 is not
 * separately authored. 主食 (主 + 食) is left bare: neither morpheme has a
 * standalone item and authoring one for this single word alone is out of
 * proportion for this pass - logged as a genuine, still-inert gap rather
 * than shipped with a `WordDecomposition` that would resolve empty.
 *
 * Mnemonic-only decomposition-gap audit (Aug 2026, the 价 bug's aftermath):
 * 料/例/起/位 all get a verified CharacterDecomposition alongside their
 * existing mnemonic-only prose - every mnemonic already named the real
 * components (料's 斗/米, 例's 亻/列, 起's 己/走, 位's 亻/立) before this pass
 * added a matching decomposition field. 料 ships MMH's own radical, 斗
 * (dipper, to measure), not 米 - the mnemonic's other named piece - since 斗
 * is what MMH's `radical` field actually assigns. 例/起 both turned up an
 * exact-reading phonetic match (列 lì, 己 qǐ) that a prior pass would have
 * missed by only checking each candidate's more common primary reading
 * (liè, jǐ) - the same miss class `FAN_PHONETIC`/`FEN_SEMANTIC`/`YAO_PHONETIC`
 * document. 位 ships both halves of its ideographic pair (亻 person, 立 to
 * stand) as semantic, the same "two real meaningful parts" pattern
 * `FEN_SEMANTIC` uses for 份.
 */
export const MENU_ORDER: CategoryContent = {
  low: [
    [
      'On the menu. What does this mean?',
      ['large portion', 'stir-fry', 'boil'],
      0,
      'dà fèn · grote portie (large portion). 份 can also mean "share" or "copy" elsewhere, so read it with 大 for this sense.',
      { hanzi: '大份', pinyin: 'dà fèn', nl: 'grote portie', en: 'large portion' },
      { kind: 'word', hanzi: '大份', morphemes: [
        { span: '大', gloss: 'big' },
        { span: '份', gloss: 'portion' },
      ] },
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
      { kind: 'word', hanzi: '大份', morphemes: [
        { span: '大', gloss: 'big' },
        { span: '份', gloss: 'portion' },
      ] },
      { tier: 1 },
    ],
    [
      'On the menu. What does this mean?',
      ['small portion', 'beef', 'standard portion'],
      0,
      'xiǎo fèn · kleine portie (small portion). Read the two characters together as one term, not separately.',
      { hanzi: '小份', pinyin: 'xiǎo fèn', nl: 'kleine portie', en: 'small portion' },
      { kind: 'word', hanzi: '小份', morphemes: [
        { span: '小', gloss: 'small' },
        { span: '份', gloss: 'portion' },
      ] },
      { tier: 1 },
    ],
    [
      'On the menu. What does this mean?',
      ['cold dishes', 'chilli-hot', 'steam'],
      0,
      'liángcài · koude gerechten (cold dishes). These are always listed as the first section on the menu.',
      { hanzi: '凉菜', pinyin: 'liángcài', nl: 'koude gerechten', en: 'cold dishes' },
      { kind: 'word', hanzi: '凉菜', morphemes: [
        { span: '凉', gloss: 'cool' },
        { span: '菜', gloss: 'dish, vegetable' },
      ] },
      { tier: 1 },
    ],
    [
      'On the menu. What does this mean?',
      ['hot dishes', 'salty', 'steam'],
      0,
      'rècài · warme gerechten (hot dishes). Usually the section right after the cold dishes.',
      { hanzi: '热菜', pinyin: 'rècài', nl: 'warme gerechten', en: 'hot dishes' },
      { kind: 'word', hanzi: '热菜', morphemes: [
        { span: '热', gloss: 'hot' },
        { span: '菜', gloss: 'dish, vegetable' },
      ] },
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
      { kind: 'word', hanzi: '饮料', morphemes: [
        { span: '饮', gloss: 'to drink' },
        { span: '料', gloss: 'material, ingredient' },
      ] },
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
      { kind: 'word', hanzi: '打包', morphemes: [
        { span: '打', gloss: 'to hit, do' },
        { span: '包', gloss: 'filled bun, to wrap' },
      ] },
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
      { kind: 'word', hanzi: '购物车', morphemes: [
        { span: '购', gloss: 'to purchase' },
        { span: '物', gloss: 'thing, object' },
        { span: '车', gloss: 'vehicle, cart' },
      ] },
    ],
    [
      'On the menu. What does this mean?',
      ['dish, vegetable', 'cold dishes', 'hot dishes'],
      0,
      'cài · gerecht, groente (dish, vegetable). Seen in 凉菜/热菜 (cold/hot dishes) on a menu section header. 采 (picking) under 艹 (plant): cài, produce picked for the table.',
      { hanzi: '菜', pinyin: 'cài', nl: 'gerecht, groente', en: 'dish, vegetable', structure: 'top-bottom' },
      {
        kind: 'character',
        hanzi: '菜',
        components: [
          { componentId: GRASS_RADICAL.id, role: 'semantic' },
          { componentId: CAI_PHONETIC.id, role: 'phonetic' },
        ],
        semantic_radical: GRASS_RADICAL.id,
      },
    ],
    [
      'On the menu. What does this mean?',
      ['material, ingredient', 'soft drinks', 'dish, vegetable'],
      0,
      'liào · materiaal, ingrediënt (material, ingredient). Seen in 饮料 (soft drinks) and 配料表 (ingredient list, on a package back panel). Picture 料 as a wooden dipper (斗) scooping out rice (米) - the raw ingredient before it\'s measured into anything: liào.',
      { hanzi: '料', pinyin: 'liào', nl: 'materiaal, ingrediënt', en: 'material, ingredient', structure: 'left-right' },
      {
        kind: 'character',
        hanzi: '料',
        components: [{ componentId: DIPPER_RADICAL.id, role: 'semantic' }],
        semantic_radical: DIPPER_RADICAL.id,
      },
      { glossProvenance: 'mnemonic-only' },
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
      'lì · standaardportie (standard portion). Usually means "example" elsewhere, so this menu sense is a special case worth remembering. Picture 例 as a person (亻) standing at their assigned place in a lined-up row (列) — everyone gets the same standard-issue portion: lì.',
      { hanzi: '例', pinyin: 'lì', nl: 'standaardportie', en: 'standard portion', structure: 'left-right' },
      {
        kind: 'character',
        hanzi: '例',
        components: [
          { componentId: PERSON_RADICAL.id, role: 'semantic' },
          { componentId: LIE_PHONETIC.id, role: 'phonetic' },
        ],
        semantic_radical: PERSON_RADICAL.id,
      },
      { tier: 2, freqRank: 547, glossProvenance: 'mnemonic-only' },
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
      { kind: 'word', hanzi: '特色', morphemes: [
        { span: '特', gloss: 'special' },
        { span: '色', gloss: 'colour, character' },
      ] },
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
      'qǐ · vanaf ("from," used with a price). E.g. 88元起 means prices start at 88 yuan, not that it costs exactly 88. Picture 起 as your own feet (己) starting to walk (走) — the price gets up on its own two feet and starts climbing from this number: qǐ.',
      { hanzi: '起', pinyin: 'qǐ', nl: 'vanaf', en: '"from" (a price)', structure: 'enclosure' },
      {
        kind: 'character',
        hanzi: '起',
        components: [
          { componentId: RUN_RADICAL.id, role: 'semantic' },
          { componentId: QI_PHONETIC.id, role: 'phonetic' },
        ],
        semantic_radical: RUN_RADICAL.id,
      },
      { tier: 2, freqRank: 75, glossProvenance: 'mnemonic-only' },
    ],
    [
      'On the menu. What does this mean?',
      ['per person', 'large portion', 'soup'],
      0,
      'wèi · per persoon (per person). Shows up in charges like 茶位费 and 餐位费 (tea/table cover charges). Picture 位 as a person (亻) standing (立) in their own assigned spot at the table — one standing spot, one person, one charge: wèi.',
      { hanzi: '位', pinyin: 'wèi', nl: 'per persoon', en: 'per person', structure: 'left-right' },
      {
        kind: 'character',
        hanzi: '位',
        components: [
          { componentId: PERSON_RADICAL.id, role: 'semantic' },
          { componentId: STAND_SEMANTIC.id, role: 'semantic' },
        ],
        semantic_radical: PERSON_RADICAL.id,
      },
      { tier: 2, freqRank: 182, glossProvenance: 'mnemonic-only' },
    ],
  ],
};
