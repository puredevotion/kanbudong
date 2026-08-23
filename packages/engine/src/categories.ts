import type { Category, CategoryId } from './types.js';

/**
 * The scene deck.
 *
 * A scene, not a domain, is what an opposing team deals - see DESIGN.md §6.2.
 * The granularity is forced by the one thing the wager still legitimately does:
 * committing before the item appears is a prequestion, and the prequestion
 * benefit is strictly item-specific. "Weight and price on a market label" lets a
 * player anticipate roughly what will be asked; "Transport" does not, and buys
 * nothing.
 *
 * Domain weights from DESIGN.md §6.2 - market 30, menu 30, street 20, safety 15,
 * transit 5. They are counter-intuitive on purpose and the app has to say why in
 * one line: the metro is already in English, the noodle shop is not. Bilingual
 * signage in tier-1 metros is procurement practice (GB/T 30240 is 推荐性,
 * recommended); GB 7718, which requires Chinese on packaged-food labels, is
 * mandatory. The supermarket back panel is where no English is coming.
 *
 * These weights are a v1 guess. Nobody has counted how many signs of each type a
 * visitor actually needs to read per day, and when someone does, this table
 * changes.
 */
export const CATEGORIES: readonly Category[] = [
  // Market - 30%
  { id: 'market-label', name: 'Shelf-edge price label', glyph: '价' },
  { id: 'market-weight', name: 'Weight and unit', glyph: '斤' },
  { id: 'market-panel', name: 'Packaged-food back panel', glyph: '质' },
  { id: 'market-checkout', name: 'Checkout and payment', glyph: '付' },
  // Menu - 30%
  { id: 'menu-cooking', name: 'Cooking method', glyph: '炒' },
  { id: 'menu-animal', name: 'Animal and cut', glyph: '肉' },
  { id: 'menu-flavour', name: 'Heat and flavour', glyph: '辣' },
  { id: 'menu-order', name: 'The ordering screen', glyph: '单' },
  // Street - 20%
  { id: 'street-trade', name: 'Shopfront trade', glyph: '店' },
  { id: 'street-promo', name: 'Discount and promotion', glyph: '折' },
  { id: 'street-way', name: 'Fascia wayfinding', glyph: '向' },
  { id: 'street-open', name: 'Open or closed', glyph: '营' },
  // Safety - 15%
  { id: 'safety-prohibition', name: 'Prohibition', glyph: '禁' },
  { id: 'safety-warning', name: 'Warning', glyph: '心' },
  { id: 'safety-instruction', name: 'Instruction', glyph: '请' },
  { id: 'safety-exit', name: 'Exit and emergency', glyph: '出' },
  // Transit - 5%
  { id: 'transit-platform', name: 'Platform and direction', glyph: '铁' },
  { id: 'transit-ticket', name: 'Ticket and fare', glyph: '票' },
];

/**
 * All eighteen DESIGN.md §6.2 scenes are now seeded, including the two that
 * were formerly a content gap (`street-promo`, `street-way`, added Phase 2).
 * Note 出口 still sits under transit-platform rather than safety-exit, which
 * is where a player would look for it.
 */
export const CATEGORY_IDS: readonly CategoryId[] = CATEGORIES.map((c) => c.id);

const BY_ID = new Map(CATEGORIES.map((c) => [c.id, c]));

export function categoryById(id: CategoryId): Category | undefined {
  return BY_ID.get(id);
}

export function categoryName(id: CategoryId): string {
  return BY_ID.get(id)?.name ?? id;
}

/** Domain a scene belongs to, and the sampling weight DESIGN.md §6.2 assigns it. */
export const DOMAIN_WEIGHTS: Readonly<Record<string, number>> = {
  market: 30,
  menu: 30,
  street: 20,
  safety: 15,
  transit: 5,
};

export function domainOf(id: CategoryId): string {
  return id.split('-')[0] as string;
}
