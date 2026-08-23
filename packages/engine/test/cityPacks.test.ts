import { describe, expect, it } from 'vitest';

import {
  SEED_PACK,
  SHENZHEN_PACK,
  SHENZHEN_PACK_HASH,
  SINGAPORE_PACK,
  SINGAPORE_PACK_HASH,
  packHash,
  validatePack,
} from '../src/index.js';
import type { ContentPack } from '../src/index.js';

const CITY_PACKS: readonly [string, ContentPack][] = [
  ['Shenzhen', SHENZHEN_PACK],
  ['Singapore', SINGAPORE_PACK],
];

describe('city packs', () => {
  for (const [name, pack] of CITY_PACKS) {
    describe(name, () => {
      it('is structurally valid', () => {
        expect(validatePack(pack)).toEqual([]);
      });

      it('is a separate pack from SEED_PACK, with its own id and hash', () => {
        expect(pack.id).not.toBe(SEED_PACK.id);
        expect(packHash(pack)).not.toBe(packHash(SEED_PACK));
        // Category ids are namespaced (transit-shenzhen / transit-singapore),
        // never one of SEED_PACK's fixed 18 scene ids - a city pack is a
        // different axis of selection (DESIGN.md §11.6), not a 19th scene.
        for (const category of pack.categories) {
          expect(SEED_PACK.categories.some((c) => c.id === category.id)).toBe(false);
        }
      });

      it('has more than one station authored', () => {
        expect(pack.questions.length).toBeGreaterThan(1);
      });

      it('never collides a question id with SEED_PACK', () => {
        const seedIds = new Set(SEED_PACK.questions.map((q) => q.id));
        for (const q of pack.questions) {
          expect(seedIds.has(q.id)).toBe(false);
        }
      });

      it('has no duplicate question ids within the pack', () => {
        const ids = pack.questions.map((q) => q.id);
        expect(new Set(ids).size).toBe(ids.length);
      });

      /**
       * DESIGN.md §11.6 correction 3 / §9.1: "all distractor sets carry
       * `whyPlausible`" - every non-answer option needs an authored reason,
       * enforced here directly (not only via validatePack, so a future
       * refactor that stops calling validatePack on these packs still
       * fails this test).
       */
      it('gives every distractor an authored whyPlausible rationale', () => {
        for (const q of pack.questions) {
          expect(q.distractorRationale, `${q.id} has no distractorRationale at all`).toBeDefined();
          const distractors = q.options.filter((_, i) => i !== q.answer);
          for (const text of distractors) {
            const rationale = q.distractorRationale?.[text];
            expect(rationale, `${q.id}: distractor "${text}" has no whyPlausible entry`).toBeTruthy();
            expect(rationale?.trim().length ?? 0).toBeGreaterThan(10);
          }
        }
      });

      /**
       * DESIGN.md §11.6 correction 2: distractors are real network stations,
       * never a made-up name - checked here as "every distractor string
       * equals the `en` face of some other item in this same pack."
       */
      it('draws every distractor from a real station elsewhere in the same pack', () => {
        const realNames = new Set(pack.questions.map((q) => q.face?.en).filter((v): v is string => v !== undefined));
        for (const q of pack.questions) {
          const distractors = q.options.filter((_, i) => i !== q.answer);
          for (const text of distractors) {
            expect(realNames.has(text), `${q.id}: distractor "${text}" is not a real station name in this pack`).toBe(true);
          }
        }
      });

      it('carries a face with hanzi, pinyin and an English gloss on every item', () => {
        for (const q of pack.questions) {
          expect(q.face?.hanzi.length ?? 0).toBeGreaterThan(0);
          expect(q.face?.pinyin.length ?? 0).toBeGreaterThan(0);
          expect(q.face?.en?.length ?? 0).toBeGreaterThan(0);
        }
      });
    });
  }

  it('hashes are stable across re-derivation', () => {
    expect(packHash(SHENZHEN_PACK)).toBe(SHENZHEN_PACK_HASH);
    expect(packHash(SINGAPORE_PACK)).toBe(SINGAPORE_PACK_HASH);
  });

  it('does not collide any station id between the two city packs', () => {
    const shenzhenIds = new Set(SHENZHEN_PACK.questions.map((q) => q.id));
    for (const q of SINGAPORE_PACK.questions) {
      expect(shenzhenIds.has(q.id)).toBe(false);
    }
  });
});
