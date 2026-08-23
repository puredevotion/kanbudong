import { BUILDING_RADICAL, CHENG_PHONETIC, EARTH_SEMANTIC, METAL_RADICAL, FOOD_RADICAL } from '../components.js';
import type { CategoryContent } from './row.js';

/**
 * transit-ticket — generated from DESIGN.md §7. IDS notation verbatim;
 * ui/glyphs.tsx draws it. `freqRank` (single characters only) is Jun Da's
 * Modern Chinese Character Frequency List (lingua.mtsu.edu/chinese-computing,
 * 193,504,018-character corpus, 9,933 distinct characters, dated 2004-03-30)
 * — a different corpus from the one DESIGN.md's own prose cites, so numbers
 * here do not match DESIGN.md's inline ranks character-for-character. 城's
 * decomposition is verified against the gitignored Make Me a Hanzi scratch
 * copy (see `EARTH_SEMANTIC`/`CHENG_PHONETIC` in components.ts). 行 is an
 * ideographic compound of two mirrored strokes (⿰彳亍) with no clean
 * semantic/phonetic split for a learner and five listed readings, so it
 * ships `structure: 'atomic'` with no decomposition claim, same treatment as
 * 皮 in the organ set. 场 (⿰土勿) ships semantic-only (mnemonic-only
 * decomposition-gap audit, Aug 2026, the 价 bug's aftermath): Make Me a
 * Hanzi's own etymology names 昜 as the historical phonetic, but the
 * displayed tree component is 勿, a different, non-phonetic-matching shape —
 * too muddled to ship a phonetic claim at the exact-match bar this bank
 * holds phonetic hints to. That muddle is about the phonetic half only; the
 * semantic half, 土 (reused from `EARTH_SEMANTIC`, this file's own 城), is
 * clean and unambiguous in both the radical field and the etymology, so it
 * ships alongside 场's existing mnemonic-only prose.
 *
 * 一卡通/深圳通 (context-authoring phase, Aug 2026) are a genuine regional pair:
 * every major Chinese city issues its own branded transit card, and Beijing's
 * (一卡通, "Yikatong") and Shenzhen's (深圳通, "Shenzhentong") are different
 * products under different names, not one term with regional spelling
 * variance. 检票口 also new this phase. None of the three has a verified
 * `tier` or Jun Da rank, so both are left unset.
 *
 * A decomposition-backfill pass (Aug 2026) added two more, verified against
 * the gitignored Make Me a Hanzi scratch copy: 铺 carries the metal radical
 * `METAL_RADICAL` (钅, also on menu-animal.ts's 锅), semantic-only since its
 * phonetic half 甫 (fǔ) is not a tone-or-syllable match for pù; 馆 carries the
 * food radical `FOOD_RADICAL` (饣, also on menu-animal.ts's 饭/饺),
 * semantic-only since its phonetic half 官 (guān) is a tone-only near miss
 * for guǎn, not the exact match this bank requires.
 *
 * 高铁/火车 (word-decomposition backfill, Aug 2026) are genuinely transparent
 * compounds - 高 "high" + 铁 "rail/iron" and 火 "fire" + 车 "vehicle" - each
 * already spelled out in its own explanation before this field existed, same
 * pattern as street-trade.ts's 快递.
 *
 * 铁/高/火/车 (eligibility-gap backfill, Aug 2026): standalone items for every
 * morpheme 高铁/火车 name, so `deriveComponentCharIds` can resolve both words
 * - see the audit note in content/index.ts. 铁 reuses `METAL_RADICAL` (its
 * phonetic half 失 shī/yì is not a tone-or-syllable match for tiě, so
 * semantic-only); Make Me a Hanzi records 高/火/车 as plain pictographs with
 * no semantic/phonetic split to verify, so all three ship
 * `glossProvenance: 'mnemonic-only'` instead.
 *
 * Coverage push (Aug 2026, DESIGN.md §9.1): 中心/市场/一卡通/候车/检票/车厢/
 * 身份证/取票/检票口 all get `WordDecomposition`s. 中心 and 身份证 resolve via
 * new standalones authored elsewhere (心 in safety-warning.ts; 证 in market-
 * panel.ts, alongside 份 already in the bank). 市场/一卡通/候车/车厢/取票 all
 * resolve fully via existing standalones (市, 场, 一, 卡, 车, 票) with no new
 * authoring needed. 检票/检票口 resolve via the existing 票 and the new 检
 * (transit-platform.ts's 安检); 检票口 additionally resolves via the new 口
 * (also transit-platform.ts). 深圳通 is marked `transparency: 'opaque'`: 圳
 * is a place-name character specific to Shenzhen with no independent meaning
 * to decompose, making this a brand name (like Beijing's 一卡通) rather than
 * a compositional word.
 *
 * Mnemonic-only decomposition-gap audit (Aug 2026, the 价 bug's aftermath):
 * 店 gets a verified CharacterDecomposition alongside its existing
 * mnemonic-only prose, which already named its real semantic component (广,
 * "roof") - `BUILDING_RADICAL`, reused from street-trade.ts's 厅. Its
 * rejected phonetic candidate, 占 (zhàn/zhān/tiē), is not a match for diàn,
 * so it ships semantic-only. 高/火/车 stay bare mnemonic-only: all three are
 * self-radical pictographs (a tall building, flames, a two-wheeled cart)
 * with no separable component.
 */
export const TRANSIT_TICKET: CategoryContent = {
  low: [
    [
      'At the ticket hall. What does it mean?',
      ['shop', 'market', 'metro'],
      0,
      'diàn · winkel. Shares the 占 part with 站 (station), so the two look similar but mean different things. Common ending in shop names: 药店 (pharmacy), 书店 (bookstore), 花店 (florist), 便利店 (convenience store), 眼镜店 (optician). Picture 店 as someone staking a claim (占) to a spot under a roof (广) and setting up shop there: diàn.',
      { hanzi: '店', pinyin: 'diàn', nl: 'winkel', en: 'shop', structure: 'enclosure' },
      {
        kind: 'character',
        hanzi: '店',
        components: [{ componentId: BUILDING_RADICAL.id, role: 'meaning' }],
        semantic_radical: BUILDING_RADICAL.id,
      },
      { tier: 1, glossProvenance: 'mnemonic-only' },
    ],
  ],
  mid: [
    [
      'At the ticket hall. What does it mean?',
      ['shop', 'entrance', 'ID card'],
      0,
      'diàn · winkel. Shares the 占 part with 站 (station), so the two look similar but mean different things. Common ending in shop names: 药店 (pharmacy), 书店 (bookstore), 花店 (florist), 便利店 (convenience store), 眼镜店 (optician). Picture 店 as someone staking a claim (占) to a spot under a roof (广) and setting up shop there: diàn.',
      { hanzi: '店', pinyin: 'diàn', nl: 'winkel', en: 'shop', structure: 'enclosure' },
      {
        kind: 'character',
        hanzi: '店',
        components: [{ componentId: BUILDING_RADICAL.id, role: 'meaning' }],
        semantic_radical: BUILDING_RADICAL.id,
      },
      { tier: 1, glossProvenance: 'mnemonic-only' },
    ],
    [
      'At the ticket hall. What does it mean?',
      ['shop (older, smaller)', 'collect a printed ticket', 'large retail complex'],
      0,
      'pù · winkeltje, meaning a smaller, older-style shop. Read as pù here, not pū — 铺 has two readings depending on meaning.',
      { hanzi: '铺', pinyin: 'pù', nl: 'winkeltje', en: 'shop (older, smaller)', structure: 'left-right' },
      {
        kind: 'character',
        hanzi: '铺',
        components: [{ componentId: METAL_RADICAL.id, role: 'meaning' }],
        semantic_radical: METAL_RADICAL.id,
      },
      { tier: 1, freqRank: 1613 },
    ],
    [
      'At the ticket hall. What does it mean?',
      ['trade house', 'ticket', 'exit'],
      0,
      'háng · handelshuis, a trade house or firm. In a business name it is read háng, not xíng, as in 银行 (bank), 车行 (car dealer), 商行 (trading firm).',
      { hanzi: '行', pinyin: 'háng', nl: 'handelshuis', en: 'trade house', structure: 'atomic' },
      undefined,
      { tier: 1, freqRank: 53 },
    ],
    [
      'At the ticket hall. What does it mean?',
      ['establishment, house of', 'transfer, change lines', 'entrance'],
      0,
      'guǎn · gelegenheid, an establishment or "house of ___". Can be food-related, like 面馆 (noodle shop) and 茶馆 (teahouse), or not, like 宾馆 (hotel) and 图书馆 (library) — the meaning depends on what comes before it.',
      { hanzi: '馆', pinyin: 'guǎn', nl: 'gelegenheid', en: 'establishment, house of', structure: 'left-right' },
      {
        kind: 'character',
        hanzi: '馆',
        components: [{ componentId: FOOD_RADICAL.id, role: 'meaning' }],
        semantic_radical: FOOD_RADICAL.id,
      },
      { tier: 1, freqRank: 1011 },
    ],
    [
      'At the ticket hall. What does it mean?',
      ['large retail complex', 'platform', 'exit'],
      0,
      'chéng · markthal, centrum. Literally "city", used for a large retail complex focused on one type of product, like 美食城 (food court) or 电脑城 (computer mall).',
      { hanzi: '城', pinyin: 'chéng', nl: 'markthal, centrum', en: 'large retail complex', structure: 'left-right' },
      {
        kind: 'character',
        hanzi: '城',
        components: [
          { componentId: EARTH_SEMANTIC.id, role: 'meaning' },
          { componentId: CHENG_PHONETIC.id, role: 'sound' },
        ],
        semantic_radical: EARTH_SEMANTIC.id,
      },
      { tier: 1, freqRank: 413 },
    ],
    [
      'At the ticket hall. What does it mean?',
      ['venue, ground', 'shop', 'high-speed rail (G)'],
      0,
      'chǎng · terrein, plein, a venue or open ground. Read chǎng here, as in 停车场 (parking lot), 广场 (square), 商场 (shopping mall). Picture 场 as flat earth (土) with a banner flapping over it (the strokes on the right) — open ground cleared and staked out for an event: chǎng.',
      { hanzi: '场', pinyin: 'chǎng', nl: 'terrein, plein', en: 'venue, ground', structure: 'left-right' },
      {
        kind: 'character',
        hanzi: '场',
        components: [{ componentId: EARTH_SEMANTIC.id, role: 'meaning' }],
        semantic_radical: EARTH_SEMANTIC.id,
      },
      { tier: 1, freqRank: 249, glossProvenance: 'mnemonic-only' },
    ],
    [
      'At the ticket hall. What does it mean?',
      ['centre', 'high-speed rail (G)', 'train'],
      0,
      'zhōngxīn · centrum, "centre". Seen in 购物中心 (shopping centre), 服务中心 (service centre).',
      { hanzi: '中心', pinyin: 'zhōngxīn', nl: 'centrum', en: 'centre' },
      { kind: 'word', hanzi: '中心', morphemes: [
        { span: '中', gloss: 'middle' },
        { span: '心', gloss: 'heart' },
      ] },
      { tier: 1 },
    ],
    [
      'At the ticket hall. What does it mean?',
      ['market', 'platform', 'trade house'],
      0,
      'shìchǎng · markt, "market". 菜市场 is the wet market, where fresh produce is sold.',
      { hanzi: '市场', pinyin: 'shìchǎng', nl: 'markt', en: 'market' },
      { kind: 'word', hanzi: '市场', morphemes: [
        { span: '市', gloss: 'market, city' },
        { span: '场', gloss: 'venue, ground' },
      ] },
      { tier: 1 },
    ],
    [
      'At the ticket hall. What does it mean?',
      ["Beijing's transit card (Yikatong)", "Shenzhen's transit card (Shenzhen Tong)", 'single-journey ticket'],
      0,
      'yīkǎtōng · Beijing OV-kaart (Yikatong) — Beijing\'s own branded transit card, not a generic term; Shenzhen issues a different card under a different name, 深圳通.',
      {
        hanzi: '一卡通',
        pinyin: 'yīkǎtōng',
        nl: 'Beijing OV-kaart (Yikatong)',
        en: "Beijing's transit card (Yikatong)",
        context: { after: '充值、退卡' },
      },
      { kind: 'word', hanzi: '一卡通', morphemes: [
        { span: '一', gloss: 'one' },
        { span: '卡', gloss: 'card' },
        { span: '通', gloss: 'to pass through' },
      ] },
    ],
    [
      'At the ticket hall. What does it mean?',
      ["Shenzhen's transit card (Shenzhen Tong)", "Beijing's transit card (Yikatong)", 'security check'],
      0,
      'shēnzhèntōng · Shenzhen OV-kaart (Shenzhentong) — Shenzhen\'s own branded transit card; Beijing issues a different card under a different name, 一卡通.',
      {
        hanzi: '深圳通',
        pinyin: 'shēnzhèntōng',
        nl: 'Shenzhen OV-kaart (Shenzhentong)',
        en: "Shenzhen's transit card (Shenzhen Tong)",
        context: { after: '充值、退卡' },
        transparency: 'opaque',
      },
    ],
  ],
  high: [
    [
      'At the ticket hall. What does it mean?',
      ['high-speed rail (G)', 'transfer, change lines', 'ID card'],
      0,
      'gāotiě · hogesnelheidstrein, "high-speed rail". Marked G on tickets and boards; D (动车) is a different, slightly slower train with different pricing and seat classes.',
      { hanzi: '高铁', pinyin: 'gāotiě', nl: 'hogesnelheidstrein', en: 'high-speed rail (G)' },
      { kind: 'word', hanzi: '高铁', morphemes: [
        { span: '高', gloss: 'high' },
        { span: '铁', gloss: 'rail, iron' },
      ] },
      { tier: 2 },
    ],
    [
      'At the ticket hall. What does it mean?',
      ['train', 'high-speed rail (G)', 'metro'],
      0,
      'huǒchē · trein, "train". Literally "fire vehicle" — one of the most common everyday words for train.',
      { hanzi: '火车', pinyin: 'huǒchē', nl: 'trein', en: 'train' },
      { kind: 'word', hanzi: '火车', morphemes: [
        { span: '火', gloss: 'fire' },
        { span: '车', gloss: 'vehicle' },
      ] },
      { tier: 2 },
    ],
    [
      'At the ticket hall. What does it mean?',
      ['wait for the train', 'transfer, change lines', 'high-speed rail (G)'],
      0,
      'hòuchē · wachten op de trein, "wait for the train". Seen on 候车室, the waiting room — stations usually hold you in a hall before letting you onto the platform.',
      { hanzi: '候车', pinyin: 'hòuchē', nl: 'wachten op de trein', en: 'wait for the train' },
      { kind: 'word', hanzi: '候车', morphemes: [
        { span: '候', gloss: 'to wait' },
        { span: '车', gloss: 'vehicle' },
      ] },
      { tier: 2 },
    ],
    [
      'At the ticket hall. What does it mean?',
      ['ticket check', 'train', 'transfer, change lines'],
      0,
      'jiǎnpiào · kaartcontrole, "ticket check". Worth knowing well: the gates for 检票时间 close a few minutes before departure and do not reopen.',
      { hanzi: '检票', pinyin: 'jiǎnpiào', nl: 'kaartcontrole', en: 'ticket check' },
      { kind: 'word', hanzi: '检票', morphemes: [
        { span: '检', gloss: 'to inspect' },
        { span: '票', gloss: 'ticket, note' },
      ] },
      { tier: 2 },
    ],
    [
      'At the ticket hall. What does it mean?',
      ['carriage, coach', 'train', 'line number'],
      0,
      'chēxiāng · rijtuig, wagon, "carriage" or "coach". A less common character, so worth memorizing on its own rather than expecting to recognize it from context.',
      { hanzi: '车厢', pinyin: 'chēxiāng', nl: 'rijtuig, wagon', en: 'carriage, coach' },
      { kind: 'word', hanzi: '车厢', morphemes: [
        { span: '车', gloss: 'vehicle' },
        { span: '厢', gloss: 'compartment' },
      ] },
      { tier: 2 },
    ],
    [
      'At the ticket hall. What does it mean?',
      ['ID card', 'entrance', 'market'],
      0,
      'shēnfènzhèng · identiteitsbewijs, "ID card". Foreigners use a passport (护照) instead, which automatic gates often reject — go to the staffed counter (人工窗口) instead.',
      { hanzi: '身份证', pinyin: 'shēnfènzhèng', nl: 'identiteitsbewijs', en: 'ID card' },
      { kind: 'word', hanzi: '身份证', morphemes: [
        { span: '身', gloss: 'body' },
        { span: '份', gloss: 'portion, share' },
        { span: '证', gloss: 'certificate' },
      ] },
      { tier: 2 },
    ],
    [
      'At the ticket hall. What does it mean?',
      ['collect a printed ticket', 'high-speed rail (G)', 'security check'],
      0,
      'qǔpiào · ticket ophalen, "collect a printed ticket" — for picking up a ticket you already booked online.',
      { hanzi: '取票', pinyin: 'qǔpiào', nl: 'ticket ophalen', en: 'collect a printed ticket' },
      { kind: 'word', hanzi: '取票', morphemes: [
        { span: '取', gloss: 'to take, collect' },
        { span: '票', gloss: 'ticket, note' },
      ] },
      { tier: 2 },
    ],
    [
      'At the ticket hall. What does it mean?',
      ['ticket gate', 'ticket check', 'platform'],
      0,
      'jiǎnpiàokǒu · poortje voor kaartcontrole (ticket gate). Departure boards show which numbered gate to use, e.g. 检票口5 — the number is what you actually need to find.',
      {
        hanzi: '检票口',
        pinyin: 'jiǎnpiàokǒu',
        nl: 'poortje voor kaartcontrole',
        en: 'ticket gate',
        context: { after: '5' },
      },
      { kind: 'word', hanzi: '检票口', morphemes: [
        { span: '检', gloss: 'to inspect' },
        { span: '票', gloss: 'ticket, note' },
        { span: '口', gloss: 'mouth, opening' },
      ] },
    ],
    [
      'At the ticket hall. What does it mean?',
      ['iron, rail', 'ground, land', 'metro'],
      0,
      'tiě · ijzer, spoor (iron, rail). Seen in 地铁 (metro), 高铁 (high-speed rail) and 火车 (train). Carries the 钅 (metal) radical, the same one in 银 (silver) and 铺 (shop).',
      { hanzi: '铁', pinyin: 'tiě', nl: 'ijzer, spoor', en: 'iron, rail', structure: 'left-right' },
      {
        kind: 'character',
        hanzi: '铁',
        components: [{ componentId: METAL_RADICAL.id, role: 'meaning' }],
        semantic_radical: METAL_RADICAL.id,
      },
      { freqRank: 779 },
    ],
    [
      'At the ticket hall. What does it mean?',
      ['tall, high', 'fast, quick', 'iron, rail'],
      0,
      'gāo · hoog (tall, high). Seen in 高铁 (high-speed rail, literally "tall/fast rail"). Picture 高 as a tall tower: a peaked roof at the top, a little window partway down, and a wide gate at street level: gāo.',
      { hanzi: '高', pinyin: 'gāo', nl: 'hoog', en: 'tall, high' },
      undefined,
      { freqRank: 134, glossProvenance: 'mnemonic-only' },
    ],
    [
      'At the ticket hall. What does it mean?',
      ['fire', 'vehicle', 'tall, high'],
      0,
      'huǒ · vuur (fire). Seen in 火车 (train, literally "fire vehicle" - after the old steam engines) and 火锅 (hotpot). Picture 火 as two small flames flaring up above a flickering base: huǒ.',
      { hanzi: '火', pinyin: 'huǒ', nl: 'vuur', en: 'fire' },
      undefined,
      { freqRank: 433, glossProvenance: 'mnemonic-only' },
    ],
    [
      'At the ticket hall. What does it mean?',
      ['vehicle, car', 'fire', 'tall, high'],
      0,
      'chē · voertuig (vehicle, car). Seen in 火车 (train), 车厢 (carriage) and 停车场 (car park). Picture 车 as a cart seen from directly above: a single axle running through the middle, with a wheel at each end: chē.',
      { hanzi: '车', pinyin: 'chē', nl: 'voertuig', en: 'vehicle, car' },
      undefined,
      { freqRank: 361, glossProvenance: 'mnemonic-only' },
    ],
  ],
};
