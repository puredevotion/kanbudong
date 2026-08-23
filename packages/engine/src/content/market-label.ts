import { HAND_RADICAL, OX_RADICAL, PERSON_RADICAL } from '../components.js';
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
 *
 * Coverage push (Aug 2026, DESIGN.md §9.1): 特价/会员价/买一送一 all get
 * `WordDecomposition`s, backed by three new standalones - 特 (also unlocks
 * menu-order.ts's 特色), 价 (also unlocks 会员价 on its own) and 一 (the
 * simplest possible character, also unlocks transit-ticket.ts's 一卡通). All
 * three ship `glossProvenance: 'mnemonic-only'`.
 */
export const MARKET_LABEL: CategoryContent = {
  low: [
    [
      'On a shelf-edge label. What does it mean?',
      ['special price', 'buy one get one free', 'supermarket'],
      0,
      'tèjià · aanbieding (special price). Don\'t confuse it with 特色 (specialty) or 特产 (local product) — similar-looking words with different meanings.',
      { hanzi: '特价', pinyin: 'tèjià', nl: 'aanbieding', en: 'special price' },
      { kind: 'word', hanzi: '特价', morphemes: [
        { span: '特', gloss: 'special' },
        { span: '价', gloss: 'price' },
      ] },
      {
        tier: 0,
        confusion_type: 'shared-morpheme',
        confusable_with: ['menu-order-high-4'],
      },
    ],
    [
      'On a shelf-edge label. What does it mean?',
      ['special', 'discount as the fraction you pay', 'members\' price'],
      0,
      'tè · speciaal (special). Seen in 特价 (special price) and 特色 (house specialty). Picture 特 as an ox (牛) kept apart at the temple (寺) for something special: tè.',
      { hanzi: '特', pinyin: 'tè', nl: 'speciaal', en: 'special', structure: 'left-right' },
      {
        kind: 'character',
        hanzi: '特',
        components: [{ componentId: OX_RADICAL.id, role: 'semantic' }],
        semantic_radical: OX_RADICAL.id,
      },
      { glossProvenance: 'mnemonic-only' },
    ],
    [
      'On a shelf-edge label. What does it mean?',
      ['price', 'special', 'members\' price'],
      0,
      'jià · prijs (price). Seen in 特价 (special price) and 会员价 (members\' price). Picture 价 as a person (亻) standing right between (介) buyer and seller, settling on a price: jià.',
      { hanzi: '价', pinyin: 'jià', nl: 'prijs', en: 'price', structure: 'left-right' },
      {
        kind: 'character',
        hanzi: '价',
        components: [{ componentId: PERSON_RADICAL.id, role: 'semantic' }],
        semantic_radical: PERSON_RADICAL.id,
      },
      { glossProvenance: 'mnemonic-only' },
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
      { kind: 'word', hanzi: '买一送一', morphemes: [
        { span: '买', gloss: 'to buy' },
        { span: '一', gloss: 'one' },
        { span: '送', gloss: 'to give' },
      ] },
      { tier: 1 },
    ],
    [
      'On a shelf-edge label. What does it mean?',
      ['one', 'hundred', 'thousand'],
      0,
      'yī · een (one). The simplest character there is - just watch for it shifting tone before another syllable, as in 买一送一. Picture 一 as a single horizontal stroke: yī.',
      { hanzi: '一', pinyin: 'yī', nl: 'een', en: 'one' },
      undefined,
      { glossProvenance: 'mnemonic-only' },
    ],
    [
      'On a shelf-edge label. What does it mean?',
      ['members\' price', 'kilogram = 2 斤', 'ten thousand'],
      0,
      'huìyuánjià · ledenprijs (members\' price). It\'s shown as if it\'s the regular price, but you need to scan a membership app to actually get it.',
      { hanzi: '会员价', pinyin: 'huìyuánjià', nl: 'ledenprijs', en: 'members\' price' },
      { kind: 'word', hanzi: '会员价', morphemes: [
        { span: '会', gloss: 'association' },
        { span: '员', gloss: 'member' },
        { span: '价', gloss: 'price' },
      ] },
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
      { kind: 'word', hanzi: '会员价', morphemes: [
        { span: '会', gloss: 'association' },
        { span: '员', gloss: 'member' },
        { span: '价', gloss: 'price' },
      ] },
      { tier: 1 },
    ],
  ],
};
