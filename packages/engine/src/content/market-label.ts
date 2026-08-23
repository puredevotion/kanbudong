import type { CategoryContent } from './row.js';

/** market-label — generated from DESIGN.md §7. IDS notation verbatim; ui/glyphs.tsx draws it. */
export const MARKET_LABEL: CategoryContent = {
  low: [
    [
      'On a shelf-edge label. What does it mean?',
      ['special price', 'flat things — tickets, cards, tables', 'buy one get one free', 'supermarket'],
      0,
      'tèjià · aanbieding. Rank 213/422; confusable with 特色 (§7.1) and 特产',
      { hanzi: '特价', pinyin: 'tèjià', nl: 'aanbieding' },
    ],
    [
      'On a shelf-edge label. What does it mean?',
      ['discount as the fraction you pay', 'loose, sold by weight', 'imported', 'weigh here'],
      0,
      'zhé · korting, uitgedrukt als wat je betaalt. 打八折 = pay 80%, i.e. 20% off. A European reading "8折" as "80% off" errs badly in the wrong direction',
      { hanzi: '折', pinyin: 'zhé', nl: 'korting, uitgedrukt als wat je betaalt' },
    ],
  ],
  mid: [
    [
      'On a shelf-edge label. What does it mean?',
      ['buy one get one free', 'cup, glass', '1, capital form', 'members\' price'],
      0,
      'mǎi yī sòng yī · 1+1 gratis. Every character in the top 900 (865 / 1 / 712). Absent from every HSK level. Sandhi: spoken mǎi yí sòng yī',
      { hanzi: '买一送一', pinyin: 'mǎi yī sòng yī', nl: '1+1 gratis' },
    ],
    [
      'On a shelf-edge label. What does it mean?',
      ['members\' price', 'pairs', 'kilogram = 2 斤', 'ten thousand'],
      0,
      'huìyuánjià · ledenprijs. Displayed as if it were the price; needs a scanned app account',
      { hanzi: '会员价', pinyin: 'huìyuánjià', nl: 'ledenprijs' },
    ],
  ],
  high: [
    [
      'On a shelf-edge label. What does it mean?',
      ['members\' price', 'net content', 'loose, sold by weight', 'catty = 500 g'],
      0,
      'huìyuánjià · ledenprijs. Displayed as if it were the price; needs a scanned app account',
      { hanzi: '会员价', pinyin: 'huìyuánjià', nl: 'ledenprijs' },
    ],
  ],
};
