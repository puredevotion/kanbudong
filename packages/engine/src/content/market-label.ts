import type { CategoryContent } from './row.js';

/** market-label — generated from DESIGN.md §7. IDS notation verbatim; ui/glyphs.tsx draws it. */
export const MARKET_LABEL: CategoryContent = {
  low: [
    [
      'On a shelf-edge label. What does it mean?',
      ['special price', 'flat things — tickets, cards, tables', 'buy one get one free', 'supermarket'],
      0,
      'tèjià · aanbieding (special price). Don\'t confuse it with 特色 (specialty) or 特产 (local product) — similar-looking words with different meanings.',
      { hanzi: '特价', pinyin: 'tèjià', nl: 'aanbieding' },
    ],
    [
      'On a shelf-edge label. What does it mean?',
      ['discount as the fraction you pay', 'loose, sold by weight', 'imported', 'weigh here'],
      0,
      'zhé · korting, uitgedrukt als het percentage dat je betaalt (discount as the fraction you pay). 打八折 means pay 80%, i.e. 20% off — reading "8折" as "80% off" has it backwards.',
      { hanzi: '折', pinyin: 'zhé', nl: 'korting, uitgedrukt als wat je betaalt' },
    ],
  ],
  mid: [
    [
      'On a shelf-edge label. What does it mean?',
      ['buy one get one free', 'cup, glass', '1, capital form', 'members\' price'],
      0,
      'mǎi yī sòng yī · 1+1 gratis (buy one get one free). In speech, 一 shifts tone here: it\'s pronounced mǎi yí sòng yī.',
      { hanzi: '买一送一', pinyin: 'mǎi yī sòng yī', nl: '1+1 gratis' },
    ],
    [
      'On a shelf-edge label. What does it mean?',
      ['members\' price', 'pairs', 'kilogram = 2 斤', 'ten thousand'],
      0,
      'huìyuánjià · ledenprijs (members\' price). It\'s shown as if it\'s the regular price, but you need to scan a membership app to actually get it.',
      { hanzi: '会员价', pinyin: 'huìyuánjià', nl: 'ledenprijs' },
    ],
  ],
  high: [
    [
      'On a shelf-edge label. What does it mean?',
      ['members\' price', 'net content', 'loose, sold by weight', 'catty = 500 g'],
      0,
      'huìyuánjià · ledenprijs (members\' price). It\'s shown as if it\'s the regular price, but you need to scan a membership app to actually get it.',
      { hanzi: '会员价', pinyin: 'huìyuánjià', nl: 'ledenprijs' },
    ],
  ],
};
