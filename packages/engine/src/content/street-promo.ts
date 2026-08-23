import type { CategoryContent } from './row.js';

/**
 * street-promo — DESIGN.md §6.2's "discount and promotion" scene, restoring
 * one of the two categories `categories.ts` used to carry as a documented
 * content gap. Distinct from the market-panel/-checkout promotion vocabulary
 * (特价, 折, 买一送一, 会员价 — §7.2's shelf-price promotions): these are the
 * clearance/sale posters plastered across a shopfront rather than a printed
 * price tag.
 */
export const STREET_PROMO: CategoryContent = {
  low: [
    [
      'On a shopfront window. What does this sign mean?',
      ['on sale, discounted', 'closed today', 'members only'],
      0,
      'dǎzhé · korting (discount) — literally "hit a percentage": the fraction is what you pay, not what you save.',
      { hanzi: '打折', pinyin: 'dǎzhé', nl: 'korting', en: 'on sale, discounted' },
      undefined,
      { tier: 1 },
    ],
    [
      'On a shopfront window. What does this sign mean?',
      ['clearance sale', 'grand opening', 'out of stock'],
      0,
      'shuǎimài · uitverkoop (clearance sale) — everything must go, usually before a shop closes or moves.',
      { hanzi: '甩卖', pinyin: 'shuǎimài', nl: 'uitverkoop', en: 'clearance sale' },
      undefined,
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
      undefined,
      { tier: 2 },
    ],
    [
      'On a shopfront window. What does this sign mean?',
      ['big promotion, big sale', 'clearance sale', 'reserved'],
      0,
      'dàcùxiāo · grote aanbieding (big promotion) — a general "big sale" banner, without saying by how much.',
      { hanzi: '大促销', pinyin: 'dàcùxiāo', nl: 'grote aanbieding', en: 'big promotion, big sale' },
      undefined,
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
      undefined,
      { tier: 2 },
    ],
    [
      'On a shopfront window. What does this sign mean?',
      ['grand opening', 'special offer, discount', 'reserved'],
      0,
      'kāizhāng dàjí · grote opening (grand opening) — a launch banner, not a discount at all; a common source of confusion with the sale posters around it.',
      { hanzi: '开张大吉', pinyin: 'kāizhāng dàjí', nl: 'grote opening', en: 'grand opening' },
      undefined,
      { tier: 2 },
    ],
  ],
};
