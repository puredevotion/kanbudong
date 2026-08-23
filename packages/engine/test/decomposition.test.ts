import { describe, expect, it } from 'vitest';

import {
  COMPONENTS,
  expand,
  MEAT_RADICAL,
  SEED_PACK,
  validatePack,
  type CategoryContent,
  type CharacterDecomposition,
  type ContentPack,
} from '../src/index.js';

describe('CharacterDecomposition', () => {
  it('round-trips 肝 with semantic_radical pointing at the ⺼-shaped component', () => {
    const decomposition: CharacterDecomposition = {
      kind: 'character',
      hanzi: '肝',
      components: [
        { componentId: MEAT_RADICAL.id, role: 'semantic' },
        { componentId: 'phonetic-gan', role: 'phonetic' },
      ],
      semantic_radical: MEAT_RADICAL.id,
    };

    expect(decomposition.semantic_radical).toBe(MEAT_RADICAL.id);
    const radical = COMPONENTS[decomposition.semantic_radical as string];
    expect(radical?.displayGlyph).toBe('⺼');
    expect(radical?.id).not.toBe('月');
  });

  /**
   * The regression guard for the ⺼/月 bug class (DESIGN.md §3.3.4): nothing in
   * the schema or its serialization may resolve component identity by
   * matching the rendered glyph. Grepping this file's own source for the
   * literal substring check is the only honest way to assert "no code path
   * does this" without re-implementing the forbidden check to test for it.
   */
  it('never resolves component identity by substring/glyph match', () => {
    const decomposition: CharacterDecomposition = {
      kind: 'character',
      hanzi: '期',
      components: [{ componentId: 'moon-phonetic', role: 'phonetic' }],
    };
    // 期 contains the real 月 (U+6708) and must never be treated as carrying
    // the meat radical - it is here specifically to demonstrate that no
    // component field on this record is derived from `hanzi.includes(...)`.
    const usesGlyphMatch = (hanzi: string) => hanzi.includes('⺼');
    expect(usesGlyphMatch(decomposition.hanzi)).toBe(false);
    expect(decomposition.components.some((c) => c.componentId === MEAT_RADICAL.id)).toBe(false);
  });
});

describe('opaque compounds', () => {
  const chunk: CategoryContent = {
    low: [
      [
        'What does this shop sign mean?',
        ['sundries, odds and ends', 'east', 'west', 'north'],
        0,
        'dōngxi · this compound does not come apart into "east+west" meaning - learn it whole.',
        { hanzi: '东西', pinyin: 'dōngxi', nl: 'spullen', transparency: 'opaque' },
      ],
    ],
    mid: [],
    high: [],
  };

  it('represents an opaque span with no components array and no validation failure', () => {
    const pack: ContentPack = {
      id: 'test.opaque',
      version: '0.0.0',
      name: 'opaque test',
      categories: [{ id: 'street-trade', name: 'Street trade', glyph: '铺' }],
      questions: expand('street-trade', chunk),
    };
    const problems = validatePack(pack);
    expect(problems).toEqual([]);
    expect(pack.questions[0]?.face?.transparency).toBe('opaque');
    expect(pack.questions[0]?.decomposition).toBeUndefined();
  });
});

describe('menu-animal organ set: ⺼/月 reverse-error guard (DESIGN.md §7.1)', () => {
  // Verified per DESIGN.md's decomposition source: these eight carry U+2EBC.
  const CARRIES_MEAT_RADICAL = new Set(['肝', '肠', '肚', '腰', '脑', '肺', '肾', '胗']);
  // Verified per the same source to NOT carry it, despite sharing the menu -
  // this is the "reverse error" DESIGN.md flags: a naive highlighter that
  // matches on 月 fires on none of the eight above and instead paints "meat"
  // onto characters like these that merely sit nearby.
  const CONFIRMED_NON_CARRIERS = new Set(['血', '舌', '皮', '筋']);

  const organDecompositions = SEED_PACK.questions
    .filter((q) => q.category === 'menu-animal')
    .map((q) => q.decomposition)
    .filter((d): d is CharacterDecomposition => d?.kind === 'character');

  it('tags every authored decomposition\'s meat-radical claim correctly', () => {
    for (const d of organDecompositions) {
      const claimsMeat = d.semantic_radical === MEAT_RADICAL.id;
      if (CARRIES_MEAT_RADICAL.has(d.hanzi)) {
        expect(claimsMeat, `${d.hanzi} should carry the meat radical`).toBe(true);
      }
      if (CONFIRMED_NON_CARRIERS.has(d.hanzi)) {
        expect(claimsMeat, `${d.hanzi} should NOT carry the meat radical`).toBe(false);
      }
    }
  });

  it('authors a CharacterDecomposition for every ⺼-bearing organ character shipped', () => {
    const decomposed = new Set(organDecompositions.map((d) => d.hanzi));
    for (const hanzi of CARRIES_MEAT_RADICAL) {
      expect(decomposed.has(hanzi), `${hanzi} is missing its CharacterDecomposition`).toBe(true);
    }
  });
});

describe('validatePack component references', () => {
  it('fails the build on a dangling componentId', () => {
    const chunk: CategoryContent = {
      low: [
        [
          'Prompt?',
          ['right', 'w1', 'w2', 'w3'],
          0,
          'because',
          undefined,
          { kind: 'character', hanzi: '肝', components: [{ componentId: 'does-not-exist', role: 'semantic' }] },
        ],
      ],
      mid: [],
      high: [],
    };
    const pack: ContentPack = {
      id: 'test.dangling',
      version: '0.0.0',
      name: 'dangling component test',
      categories: [{ id: 'menu-cooking', name: 'Cooking', glyph: '炒' }],
      questions: expand('menu-cooking', chunk),
    };
    const problems = validatePack(pack);
    expect(problems).toEqual(['menu-cooking-low-1: unknown component id does-not-exist']);
  });
});
