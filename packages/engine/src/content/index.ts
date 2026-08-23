import { CATEGORIES } from '../categories.js';
import { packHash } from '../pack.js';
import type { ContentPack } from '../types.js';

import { expand } from './row.js';
import { MARKET_CHECKOUT } from './market-checkout.js';
import { MARKET_LABEL } from './market-label.js';
import { MARKET_PANEL } from './market-panel.js';
import { MARKET_WEIGHT } from './market-weight.js';
import { MENU_ANIMAL } from './menu-animal.js';
import { MENU_COOKING } from './menu-cooking.js';
import { MENU_FLAVOUR } from './menu-flavour.js';
import { MENU_ORDER } from './menu-order.js';
import { SAFETY_EXIT } from './safety-exit.js';
import { SAFETY_INSTRUCTION } from './safety-instruction.js';
import { SAFETY_PROHIBITION } from './safety-prohibition.js';
import { SAFETY_WARNING } from './safety-warning.js';
import { STREET_OPEN } from './street-open.js';
import { STREET_PROMO } from './street-promo.js';
import { STREET_TRADE } from './street-trade.js';
import { STREET_WAY } from './street-way.js';
import { TRANSIT_PLATFORM } from './transit-platform.js';
import { TRANSIT_TICKET } from './transit-ticket.js';

/**
 * The seed bank, generated from the curriculum tables in DESIGN.md §7 — pinyin
 * verified against a 44,437-line reference table, characters against a
 * decomposition set.
 *
 * Ideographic description sequences are stored verbatim (⿰阝完, not a prose
 * paraphrase): no CJK webfont draws U+2FF0–U+2FFB, so apps/pwa/src/ui/glyphs.tsx
 * shims them as inline SVG. Content stays canonical; the font gap is the
 * renderer's problem.
 *
 * Every item carries a `face` — the characters on their own, so a sign template
 * can set them at display size rather than parsing them back out of a sentence.
 *
 * BRIDGE CONTENT. The four-option shape is inherited, not chosen. All 18
 * DESIGN.md §6.2 scenes are seeded as of Phase 2, and the menu-animal organ
 * set carries real `CharacterDecomposition` records against §6.1's span
 * model, but most of the bank still predates `tier`/`decomposition` and is
 * far short of the ~2,700-item/1,500-character target in §11.0 - that is the
 * long-tail authoring effort DESIGN.md itself scopes outside any one phase.
 */
export const SEED_PACK: ContentPack = {
  id: 'kanbudong.seed',
  version: '0.1.0',
  name: '看不懂 Seed Bank',
  categories: CATEGORIES,
  questions: [
    ...expand('market-checkout', MARKET_CHECKOUT),
    ...expand('market-label', MARKET_LABEL),
    ...expand('market-panel', MARKET_PANEL),
    ...expand('market-weight', MARKET_WEIGHT),
    ...expand('menu-animal', MENU_ANIMAL),
    ...expand('menu-cooking', MENU_COOKING),
    ...expand('menu-flavour', MENU_FLAVOUR),
    ...expand('menu-order', MENU_ORDER),
    ...expand('safety-exit', SAFETY_EXIT),
    ...expand('safety-instruction', SAFETY_INSTRUCTION),
    ...expand('safety-prohibition', SAFETY_PROHIBITION),
    ...expand('safety-warning', SAFETY_WARNING),
    ...expand('street-open', STREET_OPEN),
    ...expand('street-promo', STREET_PROMO),
    ...expand('street-trade', STREET_TRADE),
    ...expand('street-way', STREET_WAY),
    ...expand('transit-platform', TRANSIT_PLATFORM),
    ...expand('transit-ticket', TRANSIT_TICKET),
  ],
};

export const SEED_PACK_HASH = packHash(SEED_PACK);
