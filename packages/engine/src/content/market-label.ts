import type { CategoryContent } from './row.js';

/** market-label — generated from DESIGN.md §7. Bridge content; §6.1's span model replaces it. */
export const MARKET_LABEL: CategoryContent = {
  low: [
    [
      '特价 — you see this on a sign. What does it mean?',
      ['special price', 'flat things — tickets, cards, tables', 'buy one get one free', 'supermarket'],
      0,
      'tèjià · aanbieding (special price). Don\'t confuse it with 特色 (specialty) or 特产 (local product) — similar-looking words with different meanings.',
    ],
    [
      '折 — you see this on a sign. What does it mean?',
      ['discount as the fraction you pay', 'loose, sold by weight', 'imported', 'weigh here'],
      0,
      'zhé · korting, uitgedrukt als het percentage dat je betaalt (discount as the fraction you pay). 打八折 means pay 80%, i.e. 20% off — reading "8折" as "80% off" has it backwards.',
    ],
  ],
  mid: [
    [
      '买一送一 — you see this on a sign. What does it mean?',
      ['buy one get one free', 'cup, glass', '1, capital form', 'members\' price'],
      0,
      'mǎi yī sòng yī · 1+1 gratis (buy one get one free). In speech, 一 shifts tone here: it\'s pronounced mǎi yí sòng yī.',
    ],
    [
      '会员价 — you see this on a sign. What does it mean?',
      ['members\' price', 'pairs', 'kilogram = 2 斤', 'ten thousand'],
      0,
      'huìyuánjià · ledenprijs (members\' price). It\'s shown as if it\'s the regular price, but you need to scan a membership app to actually get it.',
    ],
  ],
  high: [
    [
      '会员价 — you see this on a sign. What does it mean?',
      ['members\' price', 'net content', 'loose, sold by weight', 'catty = 500 g'],
      0,
      'huìyuánjià · ledenprijs (members\' price). It\'s shown as if it\'s the regular price, but you need to scan a membership app to actually get it.',
    ],
  ],
};
