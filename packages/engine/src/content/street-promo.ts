import type { CategoryContent } from './row.js';

/**
 * street-promo — DESIGN.md §6.2's "discount and promotion" scene, restoring
 * one of the two categories `categories.ts` used to carry as a documented
 * content gap. Distinct from the market-panel/-checkout promotion vocabulary
 * (特价, 折, 买一送一, 会员价 — §7.2's shelf-price promotions): these are the
 * clearance/sale posters plastered across a shopfront rather than a printed
 * price tag.
 *
 * Coverage push (Aug 2026, DESIGN.md §9.1): 打折 gets a `WordDecomposition`
 * resolving fully via the existing 折 standalone (market-label.ts). 甩卖/
 * 清仓/大促销/优惠 each get one backed by a new standalone - 卖, 仓, 大 and 惠
 * respectively. 开张大吉 is marked `transparency: 'opaque'`: it is a fixed
 * auspicious four-character phrase ("grand opening, may fortune follow") for
 * a launch banner, not a compound whose parts predict "grand opening" the
 * way 打折/清仓 predict theirs.
 */
export const STREET_PROMO: CategoryContent = {
  low: [
    [
      'On a shopfront window. What does this sign mean?',
      ['on sale, discounted', 'closed today', 'members only'],
      0,
      'dǎzhé · korting (discount) — literally "hit a percentage": the fraction is what you pay, not what you save.',
      { hanzi: '打折', pinyin: 'dǎzhé', nl: 'korting', en: 'on sale, discounted' },
      { kind: 'word', hanzi: '打折', morphemes: [
        { span: '打', gloss: 'to hit, do' },
        { span: '折', gloss: 'discount as a fraction' },
      ] },
      { tier: 1 },
    ],
    [
      'On a shopfront window. What does this sign mean?',
      ['clearance sale', 'grand opening', 'out of stock'],
      0,
      'shuǎimài · uitverkoop (clearance sale) — everything must go, usually before a shop closes or moves.',
      { hanzi: '甩卖', pinyin: 'shuǎimài', nl: 'uitverkoop', en: 'clearance sale' },
      { kind: 'word', hanzi: '甩卖', morphemes: [
        { span: '甩', gloss: 'to fling off' },
        { span: '卖', gloss: 'to sell' },
      ] },
      { tier: 1 },
    ],
  ],
  mid: [
    [
      'On a shopfront window. What does this sign mean?',
      ['stock clearance, everything must go', 'on sale, discounted', 'grand opening'],
      0,
      'qīngcāng · alles moet weg (stock clearance) — a step past 打折: the whole inventory is being sold off, not just discounted.',
      { hanzi: '清仓', pinyin: 'qīngcāng', nl: 'alles moet weg', en: 'stock clearance, everything must go' },
      { kind: 'word', hanzi: '清仓', morphemes: [
        { span: '清', gloss: 'to clear' },
        { span: '仓', gloss: 'warehouse' },
      ] },
      { tier: 2 },
    ],
    [
      'On a shopfront window. What does this sign mean?',
      ['big promotion, big sale', 'clearance sale', 'reserved'],
      0,
      'dàcùxiāo · grote aanbieding (big promotion) — a general "big sale" banner, without saying by how much.',
      { hanzi: '大促销', pinyin: 'dàcùxiāo', nl: 'grote aanbieding', en: 'big promotion, big sale' },
      { kind: 'word', hanzi: '大促销', morphemes: [
        { span: '大', gloss: 'big' },
        { span: '促销', gloss: 'promotion' },
      ] },
      { tier: 2 },
    ],
  ],
  high: [
    [
      'On a shopfront window. What does this sign mean?',
      ['special offer, discount', 'stock clearance, everything must go', 'grand opening'],
      0,
      'yōuhuì · aanbieding, korting (special offer) — a softer, more general word than 打折; it does not commit to a specific mechanism.',
      { hanzi: '优惠', pinyin: 'yōuhuì', nl: 'aanbieding, korting', en: 'special offer, discount' },
      { kind: 'word', hanzi: '优惠', morphemes: [
        { span: '优', gloss: 'excellent' },
        { span: '惠', gloss: 'favour, benefit' },
      ] },
      { tier: 2 },
    ],
    [
      'On a shopfront window. What does this sign mean?',
      ['grand opening', 'special offer, discount', 'reserved'],
      0,
      'kāizhāng dàjí · grote opening (grand opening) — a launch banner, not a discount at all; a common source of confusion with the sale posters around it.',
      { hanzi: '开张大吉', pinyin: 'kāizhāng dàjí', nl: 'grote opening', en: 'grand opening', transparency: 'opaque' },
      undefined,
      { tier: 2 },
    ],
    [
      'On a shopfront window. What does this sign mean?',
      ['to sell', 'clearance sale', 'to hit, do'],
      0,
      'mài · verkopen (to sell). Seen in 甩卖 (clearance sale). Don\'t confuse it with the near-mirror-image 买 (to buy) — one extra stroke on top makes all the difference. Picture 卖 as a stall owner standing tall (士) over goods (买-shaped basket below) held out for anyone to take: mài.',
      { hanzi: '卖', pinyin: 'mài', nl: 'verkopen', en: 'to sell' },
      undefined,
      { glossProvenance: 'mnemonic-only' },
    ],
    [
      'On a shopfront window. What does this sign mean?',
      ['warehouse', 'to sell', 'stock clearance, everything must go'],
      0,
      'cāng · pakhuis (warehouse). Seen in 清仓 (stock clearance, literally "clear the warehouse"). Picture 仓 as a peaked roof capping a storeroom stacked right up to the rafters: cāng.',
      { hanzi: '仓', pinyin: 'cāng', nl: 'pakhuis', en: 'warehouse' },
      undefined,
      { glossProvenance: 'mnemonic-only' },
    ],
    [
      'On a shopfront window. What does this sign mean?',
      ['big', 'warehouse', 'to sell'],
      0,
      'dà · groot (big). Seen in 大促销 (big promotion) and 大份 (large portion). Picture 大 as a person standing with both arms flung wide open - as big as they can make themselves: dà.',
      { hanzi: '大', pinyin: 'dà', nl: 'groot', en: 'big' },
      undefined,
      { glossProvenance: 'mnemonic-only' },
    ],
    [
      'On a shopfront window. What does this sign mean?',
      ['favour, benefit', 'big', 'to sell'],
      0,
      'huì · gunst, voordeel (favour, benefit). Seen in 优惠 (special offer). Picture 惠 as a spinning wheel (叀) turned over and over by a caring heart (心) - a kindness given freely: huì.',
      { hanzi: '惠', pinyin: 'huì', nl: 'gunst, voordeel', en: 'favour, benefit' },
      undefined,
      { glossProvenance: 'mnemonic-only' },
    ],
  ],
};
