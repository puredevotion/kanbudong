import {
  AGAIN_RADICAL,
  BOW_RADICAL,
  CLOTHES_RADICAL,
  FEN_SEMANTIC,
  ICE_RADICAL,
  MOUTH_RADICAL,
  OX_RADICAL,
  PERSON_RADICAL,
  POTTERY_RADICAL,
  SPEECH_RADICAL,
  STONE_RADICAL,
  THOUSAND_RADICAL,
  VILLAGE_RADICAL,
  WAN_PHONETIC,
  WOOD_RADICAL,
  ZHENG_PHONETIC,
} from '../components.js';
import type { CategoryContent } from './row.js';

/**
 * market-panel — generated from DESIGN.md §7. IDS notation verbatim;
 * ui/glyphs.tsx draws it. `freqRank` (single characters only) is Jun Da's
 * Modern Chinese Character Frequency List (lingua.mtsu.edu/chinese-computing,
 * 193,504,018-character corpus, 9,933 distinct characters, dated 2004-03-30)
 * — a different corpus from the one DESIGN.md's own prose cites, so numbers
 * here do not match DESIGN.md's inline ranks character-for-character.
 * 保质期 is marked `transparency: 'opaque'` per DESIGN.md §3.3.3(8), which
 * names it as non-compositional ("no useful decomposition, learn this whole").
 *
 * 配料表/储存条件/生产厂家/许可证 (context-authoring phase, Aug 2026) carry real
 * GB 7718 back-panel fields as `context`, same pattern as 号 above. None of
 * the four has a verified `tier` placement in DESIGN.md's curriculum tables
 * or a verified Jun Da rank, so both are left unset rather than guessed.
 *
 * 冷藏/冷冻 are tagged `confusion_type: 'shared-morpheme'` against each other
 * (confusable-pair backfill, Aug 2026): both share 冷, both differ in exactly
 * the one character that matters, and their own explanations already flagged
 * each other by name before this field existed.
 *
 * Rest-of-bank coverage pass (Aug 2026): 号 gets a verified CharacterDecomposition
 * (semantic 口, `MOUTH_RADICAL`; its phonetic half 丂 is not a tone-or-syllable
 * match for hào, so semantic-only). 份 reuses `PERSON_RADICAL` (亻, from
 * street-open.ts's 停) alongside `FEN_SEMANTIC` (分) - corrected against Make
 * Me a Hanzi's own `ideographic` classification (see `FEN_SEMANTIC`'s doc
 * comment in components.ts): 分 is a genuine heteronym (fēn/fèn/fén per
 * pinyin-data), so fèn is an attested reading, not the "tone-only near miss"
 * an earlier pass assumed from checking only 分's primary reading. 双 is a
 * genuine ⿰又又 - the same "又 doubled" hint its
 * own explanation already gave before this field existed - so it carries
 * `AGAIN_RADICAL` twice with no phonetic claim. 个/半 have no MMH semantic/
 * phonetic split clean enough to verify - both are ideographic, but MMH's own
 * `radical` field lands on a bare stroke (个's 丨) or a component the hint
 * never names (半's 十) rather than the etymologically meaningful piece each
 * hint actually describes - so both stay `glossProvenance: 'mnemonic-only'`
 * with no decomposition.
 *
 * Mnemonic-only decomposition-gap audit (Aug 2026, the 价 bug's aftermath):
 * 杯/碗/瓶/张/冷/只/件/装/重/证 all get a verified `CharacterDecomposition`
 * alongside their existing mnemonic-only prose, same combination 价's own fix
 * established. 只's MMH radical (口) does track a real, independent meaning
 * ("mouth") even though it doesn't explain the modern measure-word sense -
 * the same low bar `MOUTH_RADICAL`'s own 号 entry above was already held to.
 * 碗's phonetic half 宛 (wǎn) is an exact match found by checking its full
 * `pinyin-data` reading list, not just its more common yuān reading - the
 * same miss class `FAN_PHONETIC`/`YAO_PHONETIC` document elsewhere. 件 ships
 * both halves of its ideographic pair (亻 person, 牛 ox) as semantic, the
 * same "two real meaningful parts" pattern `FEN_SEMANTIC` uses for 份. 重
 * ships both halves of its own ideographic pair (千 thousand, 里 village/
 * distance) the same way - see `THOUSAND_RADICAL`'s doc comment in
 * components.ts for why that component's id carries no "kangxi-" claim.
 *
 * Coverage push (Aug 2026, DESIGN.md §9.1): 生产日期/生产厂家/冷藏/冷冻/进口/
 * 散装/称重/许可证 all get `WordDecomposition`s. 净含量 ("净" + "含" + "量") is
 * marked `transparency: 'opaque'` instead, same GB 7718 back-panel-label
 * treatment as 保质期 in this same file - a shopper reads the whole label
 * field, not its three characters separately. New standalones: 生 (also
 * unlocks 生产厂家), 冷 (also unlocks 冷冻), 口 (also unlocks transit-
 * platform.ts's 出口/入口), 装, 重 (also unlocks menu-flavour.ts's 重辣) and
 * 证 (also unlocks transit-ticket.ts's 身份证). 储存条件 resolves fully
 * without any new standalone - both its second-half morphemes, 条 and 件,
 * already exist above as measure-word items. 生产厂家 resolves via 生 alone;
 * 厂/家 are not separately authored. All new standalones ship
 * `glossProvenance: 'mnemonic-only'`.
 */
export const MARKET_PANEL: CategoryContent = {
  low: [
    [
      'On the back of the packet. What does it mean?',
      ['general measure word', 'garments, items, matters', 'half'],
      0,
      'gè · algemeen maatwoord (general measure word). Works for almost anything, so when in doubt, use this one. Picture 个 as a single person (人) with one straight stroke (丨) planted beside them like a tally mark — one person, one count: gè.',
      { hanzi: '个', pinyin: 'gè', nl: 'algemeen maatwoord', en: 'general measure word' },
      undefined,
      { tier: 0, freqRank: 12, glossProvenance: 'mnemonic-only' },
    ],
  ],
  mid: [
    [
      'On the back of the packet. What does it mean?',
      ['production date', '3, capital form', 'scan the QR code'],
      0,
      'shēngchǎn rìqī · productiedatum (production date).',
      { hanzi: '生产日期', pinyin: 'shēngchǎn rìqī', nl: 'productiedatum', en: 'production date' },
      { kind: 'word', hanzi: '生产日期', morphemes: [
        { span: '生', gloss: 'to produce, give birth' },
        { span: '产', gloss: 'to produce' },
        { span: '日', gloss: 'day' },
        { span: '期', gloss: 'period' },
      ] },
      { tier: 1 },
    ],
    [
      'On the back of the packet. What does it mean?',
      ['shelf life, as a duration', 'refrigerate, 0–4 °C', '3, capital form'],
      0,
      'bǎozhìqī · houdbaarheidsduur (shelf life). A number like 保质期12个月 tells you how long it lasts, not an actual date.',
      { hanzi: '保质期', pinyin: 'bǎozhìqī', nl: 'houdbaarheidsduur', en: 'shelf life, as a duration', transparency: 'opaque' },
      undefined,
      { tier: 1 },
    ],
    [
      'On the back of the packet. What does it mean?',
      ['net content', 'buy one get one free', 'freeze, −18 °C'],
      0,
      'jìnghánliàng · netto-inhoud (net content). Here 量 is read liàng, not liáng.',
      { hanzi: '净含量', pinyin: 'jìnghánliàng', nl: 'netto-inhoud', en: 'net content', transparency: 'opaque' },
      undefined,
      { tier: 1 },
    ],
    [
      'On the back of the packet. What does it mean?',
      ['refrigerate, 0–4 °C', 'members\' price', 'special price'],
      0,
      'lěngcáng · gekoeld bewaren (refrigerate, 0–4 °C). Shares its first character with 冷冻 (freeze) but means the opposite — worth telling apart.',
      { hanzi: '冷藏', pinyin: 'lěngcáng', nl: 'gekoeld bewaren', en: 'refrigerate, 0–4 °C' },
      { kind: 'word', hanzi: '冷藏', morphemes: [
        { span: '冷', gloss: 'cold' },
        { span: '藏', gloss: 'to store, hide' },
      ] },
      {
        tier: 1,
        confusion_type: 'shared-morpheme',
        confusable_with: ['market-panel-mid-5'],
      },
    ],
    [
      'On the back of the packet. What does it mean?',
      ['freeze, −18 °C', 'loose, sold by weight', 'yuan (written)'],
      0,
      'lěngdòng · diepvries (freeze, −18 °C). Easy to mix up with 冷藏 (refrigerate) — same first character, opposite instruction, and getting it wrong ruins the food.',
      { hanzi: '冷冻', pinyin: 'lěngdòng', nl: 'diepvries', en: 'freeze, −18 °C' },
      { kind: 'word', hanzi: '冷冻', morphemes: [
        { span: '冷', gloss: 'cold' },
        { span: '冻', gloss: 'to freeze' },
      ] },
      {
        tier: 1,
        confusion_type: 'shared-morpheme',
        confusable_with: ['market-panel-mid-4'],
      },
    ],
    [
      'On the back of the packet. What does it mean?',
      ['imported', 'supermarket', 'special price'],
      0,
      'jìnkǒu · geïmporteerd (imported). On a metro sign the same two characters mean "entrance" instead.',
      { hanzi: '进口', pinyin: 'jìnkǒu', nl: 'geïmporteerd', en: 'imported' },
      { kind: 'word', hanzi: '进口', morphemes: [
        { span: '进', gloss: 'to enter, advance' },
        { span: '口', gloss: 'mouth, opening' },
      ] },
      { tier: 1 },
    ],
    [
      'On the back of the packet. What does it mean?',
      ['day of month (spoken); number', 'production date', 'special price'],
      0,
      'hào · dag (spreektaal); nummer (day of month, spoken; number). In writing you\'d use 日 for a date, but say hào out loud instead — the same pattern as writing 元 but saying 块 for money. Also the batch/lot number required on a food label, and the "number" on doors, platforms and bus stops.',
      {
        hanzi: '号',
        pinyin: 'hào',
        nl: 'dag (spreektaal); nummer',
        en: 'day of month (spoken); number',
        context: { before: '产品批', after: ' 20260815' },
        structure: 'top-bottom',
      },
      {
        kind: 'character',
        hanzi: '号',
        components: [{ componentId: MOUTH_RADICAL.id, role: 'semantic' }],
        semantic_radical: MOUTH_RADICAL.id,
      },
      { tier: 1, freqRank: 487 },
    ],
    [
      'On the back of the packet. What does it mean?',
      ['half', 'kilogram = 2 斤', 'hundred'],
      0,
      'bàn · half. Used for half past the hour, and also in 半份 (half portion) and 半斤 (250 g) on menus and at the market — one character, several everyday uses. Picture 半 as two short strokes slicing straight down through a whole (十) — cutting it cleanly in two: bàn.',
      { hanzi: '半', pinyin: 'bàn', nl: 'half', en: 'half' },
      undefined,
      { tier: 1, freqRank: 513, glossProvenance: 'mnemonic-only' },
    ],
    [
      'On the back of the packet. What does it mean?',
      ['portion, serving', 'half', 'buy one get one free'],
      0,
      'fèn · portie (portion, serving). Seen in 大份/中份/小份/半份 (large/medium/small/half portion) on menus. Literally the lot 分 (to divide; a share) allotted to a person 亻 — a person\'s portion.',
      { hanzi: '份', pinyin: 'fèn', nl: 'portie', en: 'portion, serving', structure: 'left-right' },
      {
        kind: 'character',
        hanzi: '份',
        components: [
          { componentId: PERSON_RADICAL.id, role: 'semantic' },
          { componentId: FEN_SEMANTIC.id, role: 'semantic' },
        ],
        semantic_radical: PERSON_RADICAL.id,
      },
      { tier: 1, freqRank: 784, glossProvenance: 'etymological' },
    ],
    [
      'On the back of the packet. What does it mean?',
      ['cup, glass', 'checkout', '1, capital form'],
      0,
      'bēi · kopje, glas (cup, glass). Used for drinks. Written with the wood radical 木 on the left. Picture 杯 as a wooden (木) cup that is somehow "not" (不) ever quite full enough — you always want a refill: bēi.',
      { hanzi: '杯', pinyin: 'bēi', nl: 'kopje, glas', en: 'cup, glass', structure: 'left-right' },
      {
        kind: 'character',
        hanzi: '杯',
        components: [{ componentId: WOOD_RADICAL.id, role: 'semantic' }],
        semantic_radical: WOOD_RADICAL.id,
      },
      { tier: 1, freqRank: 1396, glossProvenance: 'mnemonic-only' },
    ],
    [
      'On the back of the packet. What does it mean?',
      ['bowl', 'pairs', 'loose, sold by weight'],
      0,
      'wǎn · kom (bowl). Used for noodles, rice, congee — a common word on menus even though the character itself is rare elsewhere. Picture 碗 as a stone (石) bowl curved into a perfectly round hollow for rice: wǎn.',
      { hanzi: '碗', pinyin: 'wǎn', nl: 'kom', en: 'bowl', structure: 'left-right' },
      {
        kind: 'character',
        hanzi: '碗',
        components: [
          { componentId: STONE_RADICAL.id, role: 'semantic' },
          { componentId: WAN_PHONETIC.id, role: 'phonetic' },
        ],
        semantic_radical: STONE_RADICAL.id,
      },
      { tier: 1, freqRank: 1939, glossProvenance: 'mnemonic-only' },
    ],
    [
      'On the back of the packet. What does it mean?',
      ['bottle', 'yuan (spoken)', 'long thin things — fish, streets, trousers'],
      0,
      'píng · fles (bottle). Used for water, beer, sauce — also appears on shelf labels as a unit. Picture 瓶 as two matching things standing side by side (并), both made of fired clay (瓦) — a pair of bottles from the same kiln: píng.',
      { hanzi: '瓶', pinyin: 'píng', nl: 'fles', en: 'bottle', structure: 'left-right' },
      {
        kind: 'character',
        hanzi: '瓶',
        components: [{ componentId: POTTERY_RADICAL.id, role: 'semantic' }],
        semantic_radical: POTTERY_RADICAL.id,
      },
      { tier: 1, freqRank: 1703, glossProvenance: 'mnemonic-only' },
    ],
    [
      'On the back of the packet. What does it mean?',
      ['flat things — tickets, cards, tables', 'garments, items, matters', 'gram'],
      0,
      'zhāng · platte dingen — kaartjes, tafels (flat things — tickets, cards, tables). E.g. 一张票 (one ticket) — the word you need at a ticket window. Picture 张 as a bow (弓) drawn out long (长) — the same stretching motion as unrolling one flat ticket or sheet: zhāng.',
      { hanzi: '张', pinyin: 'zhāng', nl: 'platte dingen — kaartjes, tafels', en: 'flat things — tickets, cards, tables', structure: 'left-right' },
      {
        kind: 'character',
        hanzi: '张',
        components: [{ componentId: BOW_RADICAL.id, role: 'semantic' }],
        semantic_radical: BOW_RADICAL.id,
      },
      { tier: 1, freqRank: 318, glossProvenance: 'mnemonic-only' },
    ],
    [
      'On the back of the packet. What does it mean?',
      ['ingredient list', 'shelf life, as a duration', 'net content'],
      0,
      'pèiliào biǎo · ingrediëntenlijst (ingredient list). Ingredients are listed in descending order by weight, so whatever comes first is the main one.',
      {
        hanzi: '配料表',
        pinyin: 'pèiliào biǎo',
        nl: 'ingrediëntenlijst',
        en: 'ingredient list',
        context: { after: '：水、小麦粉、白砂糖、食用盐、酵母' },
      },
      { kind: 'word', hanzi: '配料表', morphemes: [
        { span: '配', gloss: 'to mix, pair' },
        { span: '料', gloss: 'material, ingredient' },
        { span: '表', gloss: 'table, list' },
      ] },
    ],
    [
      'On the back of the packet. What does it mean?',
      ['storage conditions', 'refrigerate, 0–4 °C', 'net content'],
      0,
      'chǔcún tiáojiàn · bewaarcondities (storage conditions). Usually followed by something like 阴凉干燥处保存 (store in a cool, dry place) rather than an exact temperature.',
      {
        hanzi: '储存条件',
        pinyin: 'chǔcún tiáojiàn',
        nl: 'bewaarcondities',
        en: 'storage conditions',
        context: { after: '：阴凉干燥处保存，避免阳光直射' },
      },
      { kind: 'word', hanzi: '储存条件', morphemes: [
        { span: '储', gloss: 'to store' },
        { span: '存', gloss: 'to exist, keep' },
        { span: '条', gloss: 'item, clause' },
        { span: '件', gloss: 'item' },
      ] },
    ],
    [
      'On the back of the packet. What does it mean?',
      ['manufacturer', 'production date', 'imported'],
      0,
      'shēngchǎn chǎngjiā · fabrikant (manufacturer). Required alongside the address on every packaged-food label, distinct from 生产日期 (production date), which is a date, not a name.',
      {
        hanzi: '生产厂家',
        pinyin: 'shēngchǎn chǎngjiā',
        nl: 'fabrikant',
        en: 'manufacturer',
        context: { after: '：广东金穗食品有限公司' },
      },
      { kind: 'word', hanzi: '生产厂家', morphemes: [
        { span: '生', gloss: 'to produce, give birth' },
        { span: '产', gloss: 'to produce' },
      ] },
    ],
    [
      'On the back of the packet. What does it mean?',
      ['to produce, give birth', 'day of month (spoken); number', 'production date'],
      0,
      'shēng · produceren, geboren worden (to produce, give birth). Seen in 生产日期 (production date) and 生产厂家 (manufacturer). Picture 生 as a seedling (the top strokes) pushing straight up out of the ground (the bottom stroke): shēng.',
      { hanzi: '生', pinyin: 'shēng', nl: 'produceren, geboren worden', en: 'to produce, give birth' },
      undefined,
      { glossProvenance: 'mnemonic-only' },
    ],
    [
      'On the back of the packet. What does it mean?',
      ['cold', 'refrigerate, 0–4 °C', 'freeze, −18 °C'],
      0,
      'lěng · koud (cold). Seen in 冷藏 (refrigerate) and 冷冻 (freeze) - the shared first character both instructions differ from. Picture 冷 as ice (冫) so bracing it feels like a command (令) to shiver: lěng.',
      { hanzi: '冷', pinyin: 'lěng', nl: 'koud', en: 'cold', structure: 'left-right' },
      {
        kind: 'character',
        hanzi: '冷',
        components: [{ componentId: ICE_RADICAL.id, role: 'semantic' }],
        semantic_radical: ICE_RADICAL.id,
      },
      { glossProvenance: 'mnemonic-only' },
    ],
    [
      'On the back of the packet. What does it mean?',
      ['mouth, opening', 'imported', 'day of month (spoken); number'],
      0,
      'kǒu · mond, opening (mouth, opening). Seen in 进口 (imported, literally "enter opening") and — on a metro sign instead of a packet — 出口/入口 (exit/entrance). Picture 口 as a simple open mouth, drawn as a small square: kǒu.',
      { hanzi: '口', pinyin: 'kǒu', nl: 'mond, opening', en: 'mouth, opening' },
      undefined,
      { glossProvenance: 'mnemonic-only' },
    ],
  ],
  high: [
    [
      'On the back of the packet. What does it mean?',
      ['loose, sold by weight', 'shelf life, as a duration', 'freeze, −18 °C'],
      0,
      'sǎnzhuāng · los, per gewicht (loose, sold by weight). Signals that the price is per weight (yuan per jin), not a fixed price.',
      { hanzi: '散装', pinyin: 'sǎnzhuāng', nl: 'los, per gewicht', en: 'loose, sold by weight' },
      { kind: 'word', hanzi: '散装', morphemes: [
        { span: '散', gloss: 'to scatter, loose' },
        { span: '装', gloss: 'to pack' },
      ] },
      { tier: 2 },
    ],
    [
      'On the back of the packet. What does it mean?',
      ['weigh here', 'bottle', 'gram'],
      0,
      'chēngzhòng · hier afwegen (weigh here). Weigh loose produce and get a barcode sticker before you go to the till.',
      { hanzi: '称重', pinyin: 'chēngzhòng', nl: 'hier afwegen', en: 'weigh here' },
      { kind: 'word', hanzi: '称重', morphemes: [
        { span: '称', gloss: 'to weigh' },
        { span: '重', gloss: 'weight' },
      ] },
      { tier: 2 },
    ],
    [
      'On the back of the packet. What does it mean?',
      ['animals, one of a pair, some containers', 'net content', 'members\' price'],
      0,
      'zhī · dieren, één van een paar (measure word for animals, one of a pair, some containers). As "only", the same character is read zhǐ instead. Picture 只 as a little bird (the top strokes) perched with its two legs (八) apart on a branch — one single bird, one single thing: zhī.',
      { hanzi: '只', pinyin: 'zhī', nl: 'dieren, één van een paar', en: 'animals, one of a pair, some containers', structure: 'top-bottom' },
      {
        kind: 'character',
        hanzi: '只',
        components: [{ componentId: MOUTH_RADICAL.id, role: 'semantic' }],
        semantic_radical: MOUTH_RADICAL.id,
      },
      { tier: 2, freqRank: 97, glossProvenance: 'mnemonic-only' },
    ],
    [
      'On the back of the packet. What does it mean?',
      ['garments, items, matters', '1, capital form', 'general measure word'],
      0,
      'jiàn · kledingstukken, artikelen (garments, items, matters). E.g. 第二件半价 — "second item half price," a phrase you\'ll see in shops. Picture 件 as a person (亻) leading an ox (牛) by a rope — one person, one item, one clear unit to count: jiàn.',
      { hanzi: '件', pinyin: 'jiàn', nl: 'kledingstukken, artikelen', en: 'garments, items, matters', structure: 'left-right' },
      {
        kind: 'character',
        hanzi: '件',
        components: [
          { componentId: PERSON_RADICAL.id, role: 'semantic' },
          { componentId: OX_RADICAL.id, role: 'semantic' },
        ],
        semantic_radical: PERSON_RADICAL.id,
      },
      { tier: 2, freqRank: 250, glossProvenance: 'mnemonic-only' },
    ],
    [
      'On the back of the packet. What does it mean?',
      ['pairs', 'general measure word', '2, capital form'],
      0,
      'shuāng · paar (pairs). Shoes, chopsticks, socks. Written with 又 doubled — a visual hint at "a pair".',
      { hanzi: '双', pinyin: 'shuāng', nl: 'paar', en: 'pairs', structure: 'left-right' },
      {
        kind: 'character',
        hanzi: '双',
        components: [
          { componentId: AGAIN_RADICAL.id, role: 'semantic' },
          { componentId: AGAIN_RADICAL.id, role: 'semantic' },
        ],
        semantic_radical: AGAIN_RADICAL.id,
      },
      { tier: 2, freqRank: 581 },
    ],
    [
      'On the back of the packet. What does it mean?',
      ['long thin things — fish, streets, trousers', 'supermarket', 'special price'],
      0,
      'tiáo · lange dunne dingen — vis, straten, broeken (long thin things — fish, streets, trousers). E.g. 一条鱼 (one fish) on a market sign. Picture 条 as a branch (木) being whittled down by a hand with a stick (攵) into one long thin strip: tiáo.',
      { hanzi: '条', pinyin: 'tiáo', nl: 'lange dunne dingen — vis, straten', en: 'long thin things — fish, streets, trousers' },
      undefined,
      { tier: 2, freqRank: 214, glossProvenance: 'mnemonic-only' },
    ],
    [
      'On the back of the packet. What does it mean?',
      ['license', 'shelf life, as a duration', 'net content'],
      0,
      'xǔkězhèng · vergunning (license). On a food label this is the production licence, printed as 生产许可证编号 followed by an SC code (SC + 14 digits) — the mark that replaced the old QS logo in 2015.',
      {
        hanzi: '许可证',
        pinyin: 'xǔkězhèng',
        nl: 'vergunning',
        en: 'license',
        context: { before: '生产', after: '编号：SC11410115012345' },
      },
      { kind: 'word', hanzi: '许可证', morphemes: [
        { span: '许', gloss: 'to permit' },
        { span: '可', gloss: 'may' },
        { span: '证', gloss: 'certificate' },
      ] },
    ],
    [
      'On the back of the packet. What does it mean?',
      ['to pack, install', 'loose, sold by weight', 'weigh here'],
      0,
      'zhuāng · inpakken, installeren (to pack, install). Seen in 散装 (loose, sold by weight, literally "scattered packing"). Picture 装 as a strong (壮) pair of hands folding clothing (衣) up and packing it away: zhuāng.',
      { hanzi: '装', pinyin: 'zhuāng', nl: 'inpakken, installeren', en: 'to pack, install', structure: 'top-bottom' },
      {
        kind: 'character',
        hanzi: '装',
        components: [{ componentId: CLOTHES_RADICAL.id, role: 'semantic' }],
        semantic_radical: CLOTHES_RADICAL.id,
      },
      { glossProvenance: 'mnemonic-only' },
    ],
    [
      'On the back of the packet. What does it mean?',
      ['weight, heavy', 'weigh here', 'mild spice'],
      0,
      'zhòng · gewicht, zwaar (weight, heavy). Seen in 称重 (weigh here) and 重辣 (very spicy, "heavy chilli"). Picture 重 as a person bent low under a heavy sack slung on their back: zhòng.',
      { hanzi: '重', pinyin: 'zhòng', nl: 'gewicht, zwaar', en: 'weight, heavy' },
      {
        kind: 'character',
        hanzi: '重',
        components: [
          { componentId: THOUSAND_RADICAL.id, role: 'semantic' },
          { componentId: VILLAGE_RADICAL.id, role: 'semantic' },
        ],
        semantic_radical: VILLAGE_RADICAL.id,
      },
      { glossProvenance: 'mnemonic-only' },
    ],
    [
      'On the back of the packet. What does it mean?',
      ['certificate', 'license', 'to permit'],
      0,
      'zhèng · certificaat, bewijs (certificate). Seen in 许可证 (license) and 身份证 (ID card). Picture 证 as spoken words (讠) confirmed correct (正) - an official proof: zhèng.',
      { hanzi: '证', pinyin: 'zhèng', nl: 'certificaat, bewijs', en: 'certificate', structure: 'left-right' },
      {
        kind: 'character',
        hanzi: '证',
        components: [
          { componentId: SPEECH_RADICAL.id, role: 'semantic' },
          { componentId: ZHENG_PHONETIC.id, role: 'phonetic' },
        ],
        semantic_radical: SPEECH_RADICAL.id,
      },
      { glossProvenance: 'mnemonic-only' },
    ],
  ],
};
