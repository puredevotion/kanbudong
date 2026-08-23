import type { Category } from '../../types.js';

/**
 * City-pack categories, deliberately NOT added to `CATEGORIES`/`CATEGORY_IDS`
 * in ../../categories.ts. Those arrays are the party game's fixed 18-scene
 * deck with DESIGN.md §6.2's domain sampling weights (market 30, menu 30,
 * street 20, safety 15, transit 5) — a city pack is a different axis
 * entirely (which city you're in, chosen at onboarding per DESIGN.md §11.6),
 * not a nineteenth scene competing for a slot in that weighted bag. Each
 * `ContentPack` below carries its own `categories` array containing exactly
 * the one category it defines, which is all `validatePack` requires.
 */
export const SHENZHEN_CATEGORY: Category = {
  id: 'transit-shenzhen',
  name: 'Shenzhen Metro station',
  glyph: '深',
};

export const SINGAPORE_CATEGORY: Category = {
  id: 'transit-singapore',
  name: 'Singapore MRT station',
  glyph: '狮',
};
