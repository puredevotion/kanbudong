import type { CategoryContent } from './row.js';

/** transit-ticket — generated from DESIGN.md §7. Bridge content; §6.1's span model replaces it. */
export const TRANSIT_TICKET: CategoryContent = {
  low: [
    [
      '店 — you see this on a sign. What does it mean?',
      ['shop', 'transfer, change lines', 'market', 'metro'],
      0,
      'diàn · winkel. ⿸广占 — same 占 as 站; 广 recurs in 座, 库, 床 but not 厂房, since 厂 U+5382 differs from 广 U+5E7F and 广 = ⿱丶厂 contains it: a foil, not a family. Tail of 药店, 书店, 花店, 便利店, 眼镜店 — highest-yield head, 6:1.',
    ],
  ],
  mid: [
    [
      '店 — you see this on a sign. What does it mean?',
      ['shop', 'security check', 'entrance', 'ID card'],
      0,
      'diàn · winkel. ⿸广占 — same 占 as 站; 广 recurs in 座, 库, 床 but not 厂房, since 厂 U+5382 differs from 广 U+5E7F and 广 = ⿱丶厂 contains it: a foil, not a family. Tail of 药店, 书店, 花店, 便利店, 眼镜店 — highest-yield head, 6:1.',
    ],
    [
      '铺 — you see this on a sign. What does it mean?',
      ['shop (older, smaller)', 'metro', 'collect a printed ticket', 'large retail complex'],
      0,
      'pù · winkeltje. ⿰钅甫. Reads pù, not pū. 铺 pù, 捕 bǔ, 浦 pǔ share a rime, not an initial: a memory hook, not a reading predictor.',
    ],
    [
      '行 — you see this on a sign. What does it mean?',
      ['trade house', 'ticket', 'bound for', 'exit'],
      0,
      'háng · handelshuis. Rank 37, five listed readings, and in a business name it is háng, not xíng — 银行, 车行, 商行. Stored per item, not per character.',
    ],
    [
      '馆 — you see this on a sign. What does it mean?',
      ['establishment, house of', 'security check', 'transfer, change lines', 'entrance'],
      0,
      'guǎn · gelegenheid. ⿰饣官 — 饣 is on 43 characters against 12 for 食, a fact about the inventory that helps a player remember 馆 and says nothing about what a 馆 sells: 面馆 and 茶馆 are food, 宾馆 and 图书馆 are not. The head narrows, it does not decide.',
    ],
    [
      '城 — you see this on a sign. What does it mean?',
      ['large retail complex', 'bound for', 'platform', 'exit'],
      0,
      'chéng · markthal, centrum. ⿰土成, rank 150. 美食城, 电脑城 — a "city" of one product type. The character is easy, the shop sense is not.',
    ],
    [
      '场 — you see this on a sign. What does it mean?',
      ['venue, ground', 'shop', 'ticket', 'high-speed rail (G)'],
      0,
      'chǎng · terrein, plein. Rank 175, two readings, chǎng here. 停车场, 广场, 商场.',
    ],
    [
      '中心 — you see this on a sign. What does it mean?',
      ['centre', 'high-speed rail (G)', 'collect a printed ticket', 'train'],
      0,
      'zhōngxīn · centrum. Two-character head. 购物中心, 服务中心.',
    ],
    [
      '市场 — you see this on a sign. What does it mean?',
      ['market', 'platform', 'trade house', 'line number'],
      0,
      'shìchǎng · markt. Two-character head. 菜市场 is the wet market, where the supermarket strand\'s produce vocabulary gets used.',
    ],
  ],
  high: [
    [
      '高铁 — you see this on a sign. What does it mean?',
      ['high-speed rail (G)', 'transfer, change lines', 'large retail complex', 'ID card'],
      0,
      'gāotiě · hogesnelheidstrein. Band 4. Distinguishes G from D (动车), which differ in price and seat class.',
    ],
    [
      '火车 — you see this on a sign. What does it mean?',
      ['train', 'high-speed rail (G)', 'metro', 'centre'],
      0,
      'huǒchē · trein. Band 1, ranks 438/371 — the easiest item in the strand, an anchor.',
    ],
    [
      '候车 — you see this on a sign. What does it mean?',
      ['wait for the train', 'transfer, change lines', 'high-speed rail (G)', 'shop (older, smaller)'],
      0,
      'hòuchē · wachten op de trein. Absent from HSK. 候车室: stations gate you into a hall, not onto a platform.',
    ],
    [
      '检票 — you see this on a sign. What does it mean?',
      ['ticket check', 'carriage, coach', 'train', 'transfer, change lines'],
      0,
      'jiǎnpiào · kaartcontrole. Absent from HSK. 检票时间 gates close minutes before departure and do not reopen — why this is scored consequential.',
    ],
    [
      '车厢 — you see this on a sign. What does it mean?',
      ['carriage, coach', 'train', 'trade house', 'line number'],
      0,
      'chēxiāng · rijtuig, wagon. Band 7–9; 厢 is rank 2,537, outside a top-1500 bank, in regardless. ⿸厂相, the cheap 厂 cluster.',
    ],
    [
      '身份证 — you see this on a sign. What does it mean?',
      ['ID card', 'station, stop', 'entrance', 'market'],
      0,
      'shēnfènzhèng · identiteitsbewijs. Band 3, with its exception: foreigners use a passport 护照, so the gates reject you and you queue at 人工窗口.',
    ],
    [
      '取票 — you see this on a sign. What does it mean?',
      ['collect a printed ticket', 'high-speed rail (G)', 'security check', 'shop (older, smaller)'],
      0,
      'qǔpiào · ticket ophalen. Absent from HSK. 取 = ⿰耳又, rank 327.',
    ],
  ],
};
