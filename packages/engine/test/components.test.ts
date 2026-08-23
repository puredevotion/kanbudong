import { describe, expect, it } from 'vitest';

import { COMPONENTS, SEED_PACK, type CharacterDecomposition } from '../src/index.js';

describe('COMPONENTS', () => {
  it('gives every component a non-empty meaning gloss', () => {
    for (const [id, component] of Object.entries(COMPONENTS)) {
      expect(component.meaning, `${id} is missing a meaning`).toBeTruthy();
      expect(component.meaning.trim().length, `${id}'s meaning is blank`).toBeGreaterThan(0);
    }
  });

  /**
   * Regression guard for the 8-category Dong Chinese re-audit (Aug 2026):
   * `ComponentRole`'s original 3-value model (`'semantic' | 'phonetic' |
   * 'neither'`) must never resurface, on the shared `Component` table or on
   * any per-usage `CharacterDecomposition.components[].role` in the shipped
   * content bank.
   */
  it('carries no old 3-value role string anywhere in SEED_PACK or COMPONENTS', () => {
    const OLD_ROLES = new Set(['semantic', 'phonetic', 'neither']);

    for (const [id, component] of Object.entries(COMPONENTS)) {
      expect(OLD_ROLES.has(component.role), `${id} still carries an old-model role`).toBe(false);
    }

    const characterDecomps = SEED_PACK.questions
      .map((q) => q.decomposition)
      .filter((d): d is CharacterDecomposition => d?.kind === 'character');
    for (const d of characterDecomps) {
      for (const c of d.components) {
        expect(
          OLD_ROLES.has(c.role),
          `${d.hanzi}'s ${c.componentId} still carries an old-model role`,
        ).toBe(false);
      }
    }
  });
});
