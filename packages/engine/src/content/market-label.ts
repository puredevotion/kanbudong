import { HAND_RADICAL } from '../components.js';
import type { CategoryContent } from './row.js';

/**
 * market-label — generated from DESIGN.md §7. IDS notation verbatim;
 * ui/glyphs.tsx draws it. `freqRank` (single characters only) is Jun Da's
 * Modern Chinese Character Frequency List (lingua.mtsu.edu/chinese-computing,
 * 193,504,018-character corpus, 9,933 distinct characters, dated 2004-03-30)
 * — a different corpus from the one DESIGN.md's own prose cites, so numbers
 * here do not match DESIGN.md's inline ranks character-for-character.
 *
 * 折 carries the hand radical `HAND_RADICAL` (decomposition-backfill pass,
 * Aug 2026), verified against the gitignored Make Me a Hanzi scratch copy;
 * its phonetic half, 斤 (jīn), is not an exact-tone match for zhé, so this
 * ships semantic-only, unlike menu-cooking.ts's 拌 (also `HAND_RADICAL`,
 * which does get an exact-match phonetic). 特价 is tagged
 * `confusion_type: 'shared-morpheme'` against 特色 (menu-order.ts) — its own
 * explanation already named 特色 as the thing worth telling apart before
 * this field existed.
 */
export const MARKET_LABEL: CategoryContent = {
  low: [
    [
      'On a shelf-edge label. What does it mean?',
      ['special price', 'buy one get one free', 'supermarket'],
      0,
      'tèjià · aanbieding (special price). Don\'t confuse it with 特色 (specialty) or 特产 (local product) — similar-looking words with different meanings.',
      { hanzi: '特价', pinyin: 'tèjià', nl: 'aanbieding', en: 'special price' },
      undefined,
      {
        tier: 0,
        confusion_type: 'shared-morpheme',
        confusable_with: ['menu-order-high-4'],
      },
    ],
    [
      'On a shelf-edge label. What does it mean?',
      ['discount as the fraction you pay', 'loose, sold by weight', 'weigh here'],
      0,
      'zhé · korting, uitgedrukt als het percentage dat je betaalt (discount as the fraction you pay). 打八折 means pay 80%, i.e. 20% off — reading "8折" as "80% off" has it backwards.',
      { hanzi: '折', pinyin: 'zhé', nl: 'korting, uitgedrukt als wat je betaalt', en: 'discount as the fraction you pay', structure: 'left-right' },
      {
        kind: 'character',
        hanzi: '折',
        components: [{ componentId: HAND_RADICAL.id, role: 'semantic' }],
        semantic_radical: HAND_RADICAL.id,
      },
      { tier: 0, freqRank: 1131 },
    ],
  ],
  mid: [
    [
      'On a shelf-edge label. What does it mean?',
      ['buy one get one free', '1, capital form', 'members\' price'],
      0,
      'mǎi yī sòng yī · 1+1 gratis (buy one get one free). In speech, 一 shifts tone here: it\'s pronounced mǎi yí sòng yī.',
      { hanzi: '买一送一', pinyin: 'mǎi yī sòng yī', nl: '1+1 gratis', en: 'buy one get one free' },
      undefined,
      { tier: 1 },
    ],
    [
      'On a shelf-edge label. What does it mean?',
      ['members\' price', 'kilogram = 2 斤', 'ten thousand'],
      0,
      'huìyuánjià · ledenprijs (members\' price). It\'s shown as if it\'s the regular price, but you need to scan a membership app to actually get it.',
      { hanzi: '会员价', pinyin: 'huìyuánjià', nl: 'ledenprijs', en: 'members\' price' },
      undefined,
      { tier: 1 },
    ],
  ],
  high: [
    [
      'On a shelf-edge label. What does it mean?',
      ['members\' price', 'loose, sold by weight', 'catty = 500 g'],
      0,
      'huìyuánjià · ledenprijs (members\' price). It\'s shown as if it\'s the regular price, but you need to scan a membership app to actually get it.',
      { hanzi: '会员价', pinyin: 'huìyuánjià', nl: 'ledenprijs', en: 'members\' price' },
      undefined,
      { tier: 1 },
    ],
  ],
};
