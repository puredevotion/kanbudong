import { packHash } from '../../pack.js';
import type { ContentPack } from '../../types.js';
import { withComponentCharIds } from '../../eligibility.js';
import { expand } from '../row.js';

import { SHENZHEN_CATEGORY, SINGAPORE_CATEGORY } from './categories.js';
import { TRANSIT_SHENZHEN } from './shenzhen.js';
import { TRANSIT_SINGAPORE } from './singapore.js';

/**
 * City packs as separate `ContentPack`s, not categories merged into
 * `SEED_PACK`. DESIGN.md §11.6 calls these "separately downloadable
 * bundles... selected at onboarding," and PLAN.md §2.4 (ticket refusal on a
 * content-pack hash mismatch) only makes sense for a bundle a player may or
 * may not have installed — bundling station names unconditionally into
 * every install's `SEED_PACK_HASH` would make that hash mean two different
 * things depending on which country's pack got authored last, which is
 * exactly the kind of divergence the hash exists to catch.
 *
 * What this DOES NOT include (flagged explicitly, per this task's own
 * instruction to say so): the "downloadable, selected at onboarding"
 * *delivery* mechanism. `apps/pwa/src` is hard-wired to exactly one pack
 * (`SEED_PACK`) everywhere a pack is consulted — there is no pack registry,
 * no onboarding pack-selection screen, and no multi-pack ticket/session
 * plumbing. Building that is a separate, larger piece of work than this
 * task's content-authoring scope; these packs are structurally ready for it
 * (own id, own hash, own categories) but are not yet wired into any UI or
 * session flow. A follow-up phase needs to: add a pack registry/selector to
 * onboarding, extend the ticket schema to carry which city pack(s) a game
 * expects (alongside `SEED_PACK_HASH`), and extend `scripts/build-fonts.py`'s
 * gate 1 to ship each pack's font delta separately (today it already sweeps
 * these files up for free, because its glob over
 * `packages/engine/src/content/**\/*.ts` is recursive and these files live
 * under that tree — but it does not yet split the result into a per-pack
 * delta the way DESIGN.md's corrected §11.6 asks for).
 */
export const SHENZHEN_PACK: ContentPack = {
  id: 'kanbudong.city.shenzhen',
  version: '0.1.0',
  name: 'Shenzhen Metro',
  categories: [SHENZHEN_CATEGORY],
  questions: withComponentCharIds([...expand('transit-shenzhen', TRANSIT_SHENZHEN)]),
};

export const SHENZHEN_PACK_HASH = packHash(SHENZHEN_PACK);

export const SINGAPORE_PACK: ContentPack = {
  id: 'kanbudong.city.singapore',
  version: '0.1.0',
  name: 'Singapore MRT',
  categories: [SINGAPORE_CATEGORY],
  questions: withComponentCharIds([...expand('transit-singapore', TRANSIT_SINGAPORE)]),
};

export const SINGAPORE_PACK_HASH = packHash(SINGAPORE_PACK);

export const CITY_PACKS: readonly ContentPack[] = [SHENZHEN_PACK, SINGAPORE_PACK];
