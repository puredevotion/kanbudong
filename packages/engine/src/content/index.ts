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
import { SAFETY_INSTRUCTION } from './safety-instruction.js';
import { SAFETY_PROHIBITION } from './safety-prohibition.js';
import { SAFETY_WARNING } from './safety-warning.js';
import { STREET_TRADE } from './street-trade.js';
import { TRANSIT_PLATFORM } from './transit-platform.js';
import { TRANSIT_TICKET } from './transit-ticket.js';

/**
 * The seed bank, generated from the curriculum tables in DESIGN.md §7 — pinyin
 * verified against a 44,437-line reference table, characters against a
 * decomposition set, and every codepoint against the produced font subset.
 *
 * BRIDGE CONTENT. It uses the inherited four-option question shape so the tree
 * builds and plays today. DESIGN.md §6.1 defines the real item as a *span* — a
 * one-to-four-character string met as a unit on a physical surface — carrying a
 * `transparency` field and a component table underneath it. Replacing this pack
 * is the first content task here, and the shape below is not a decision.
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
    ...expand('safety-instruction', SAFETY_INSTRUCTION),
    ...expand('safety-prohibition', SAFETY_PROHIBITION),
    ...expand('safety-warning', SAFETY_WARNING),
    ...expand('street-trade', STREET_TRADE),
    ...expand('transit-platform', TRANSIT_PLATFORM),
    ...expand('transit-ticket', TRANSIT_TICKET),
  ],
};

export const SEED_PACK_HASH = packHash(SEED_PACK);
