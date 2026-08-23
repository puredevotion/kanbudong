import { CHENG_PHONETIC, EARTH_SEMANTIC, METAL_RADICAL, FOOD_RADICAL } from '../components.js';
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
 * 皮 in the organ set. 场 (⿰土勿) is left undecomposed: Make Me a Hanzi's own
 * etymology names 昜 as the historical phonetic, but the displayed component
 * is 勿, a different, non-phonetic-matching shape — too muddled to ship
 * honestly at the exact-match bar this bank holds phonetic hints to.
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
 */
export const TRANSIT_TICKET: CategoryContent = {
  low: [
    [
      'At the ticket hall. What does it mean?',
      ['shop', 'market', 'metro'],
      0,
      'diàn · winkel. Shares the 占 part with 站 (station), so the two look similar but mean different things. Common ending in shop names: 药店 (pharmacy), 书店 (bookstore), 花店 (florist), 便利店 (convenience store), 眼镜店 (optician).',
      { hanzi: '店', pinyin: 'diàn', nl: 'winkel', en: 'shop' },
      undefined,
      { tier: 1 },
    ],
  ],
  mid: [
    [
      'At the ticket hall. What does it mean?',
      ['shop', 'entrance', 'ID card'],
      0,
      'diàn · winkel. Shares the 占 part with 站 (station), so the two look similar but mean different things. Common ending in shop names: 药店 (pharmacy), 书店 (bookstore), 花店 (florist), 便利店 (convenience store), 眼镜店 (optician).',
      { hanzi: '店', pinyin: 'diàn', nl: 'winkel', en: 'shop' },
      undefined,
      { tier: 1 },
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
        components: [{ componentId: METAL_RADICAL.id, role: 'semantic' }],
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
        components: [{ componentId: FOOD_RADICAL.id, role: 'semantic' }],
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
          { componentId: EARTH_SEMANTIC.id, role: 'semantic' },
          { componentId: CHENG_PHONETIC.id, role: 'phonetic' },
        ],
        semantic_radical: EARTH_SEMANTIC.id,
      },
      { tier: 1, freqRank: 413 },
    ],
    [
      'At the ticket hall. What does it mean?',
      ['venue, ground', 'shop', 'high-speed rail (G)'],
      0,
      'chǎng · terrein, plein, a venue or open ground. Read chǎng here, as in 停车场 (parking lot), 广场 (square), 商场 (shopping mall).',
      { hanzi: '场', pinyin: 'chǎng', nl: 'terrein, plein', en: 'venue, ground' },
      undefined,
      { tier: 1, freqRank: 249 },
    ],
    [
      'At the ticket hall. What does it mean?',
      ['centre', 'high-speed rail (G)', 'train'],
      0,
      'zhōngxīn · centrum, "centre". Seen in 购物中心 (shopping centre), 服务中心 (service centre).',
      { hanzi: '中心', pinyin: 'zhōngxīn', nl: 'centrum', en: 'centre' },
      undefined,
      { tier: 1 },
    ],
    [
      'At the ticket hall. What does it mean?',
      ['market', 'platform', 'trade house'],
      0,
      'shìchǎng · markt, "market". 菜市场 is the wet market, where fresh produce is sold.',
      { hanzi: '市场', pinyin: 'shìchǎng', nl: 'markt', en: 'market' },
      undefined,
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
      undefined,
      { tier: 2 },
    ],
    [
      'At the ticket hall. What does it mean?',
      ['ticket check', 'train', 'transfer, change lines'],
      0,
      'jiǎnpiào · kaartcontrole, "ticket check". Worth knowing well: the gates for 检票时间 close a few minutes before departure and do not reopen.',
      { hanzi: '检票', pinyin: 'jiǎnpiào', nl: 'kaartcontrole', en: 'ticket check' },
      undefined,
      { tier: 2 },
    ],
    [
      'At the ticket hall. What does it mean?',
      ['carriage, coach', 'train', 'line number'],
      0,
      'chēxiāng · rijtuig, wagon, "carriage" or "coach". A less common character, so worth memorizing on its own rather than expecting to recognize it from context.',
      { hanzi: '车厢', pinyin: 'chēxiāng', nl: 'rijtuig, wagon', en: 'carriage, coach' },
      undefined,
      { tier: 2 },
    ],
    [
      'At the ticket hall. What does it mean?',
      ['ID card', 'entrance', 'market'],
      0,
      'shēnfènzhèng · identiteitsbewijs, "ID card". Foreigners use a passport (护照) instead, which automatic gates often reject — go to the staffed counter (人工窗口) instead.',
      { hanzi: '身份证', pinyin: 'shēnfènzhèng', nl: 'identiteitsbewijs', en: 'ID card' },
      undefined,
      { tier: 2 },
    ],
    [
      'At the ticket hall. What does it mean?',
      ['collect a printed ticket', 'high-speed rail (G)', 'security check'],
      0,
      'qǔpiào · ticket ophalen, "collect a printed ticket" — for picking up a ticket you already booked online.',
      { hanzi: '取票', pinyin: 'qǔpiào', nl: 'ticket ophalen', en: 'collect a printed ticket' },
      undefined,
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
    ],
  ],
};
