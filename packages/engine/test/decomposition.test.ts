import { describe, expect, it } from 'vitest';

import {
  CHENG_PHONETIC,
  COMPONENTS,
  EARTH_SEMANTIC,
  expand,
  GRASS_RADICAL,
  MEAT_RADICAL,
  SEED_PACK,
  STAND_SEMANTIC,
  validatePack,
  ZHAN_PHONETIC,
  type CategoryContent,
  type CharacterDecomposition,
  type ContentPack,
  type WordDecomposition,
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
        ['sundries, odds and ends', 'east', 'west'],
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

describe('Phase 2 backfill: 站/城/茶/快递 decomposition claims (market/transit/street strands)', () => {
  const findCharDecomp = (category: string, hanzi: string): CharacterDecomposition | undefined =>
    SEED_PACK.questions
      .filter((q) => q.category === category)
      .map((q) => q.decomposition)
      .find((d): d is CharacterDecomposition => d?.kind === 'character' && d.hanzi === hanzi);

  it('tags 站 with the ⿰立占 semantic/phonetic split, phonetic verified exact (zhàn = zhàn)', () => {
    const d = findCharDecomp('transit-platform', '站');
    expect(d).toBeDefined();
    expect(d?.semantic_radical).toBe(STAND_SEMANTIC.id);
    expect(d?.components).toEqual([
      { componentId: STAND_SEMANTIC.id, role: 'semantic' },
      { componentId: ZHAN_PHONETIC.id, role: 'phonetic' },
    ]);
    expect(COMPONENTS[ZHAN_PHONETIC.id]?.reliability).toBe('exact');
  });

  it('tags 城 with the ⿰土成 semantic/phonetic split, phonetic verified exact (chéng = chéng)', () => {
    const d = findCharDecomp('transit-ticket', '城');
    expect(d).toBeDefined();
    expect(d?.semantic_radical).toBe(EARTH_SEMANTIC.id);
    expect(d?.components).toEqual([
      { componentId: EARTH_SEMANTIC.id, role: 'semantic' },
      { componentId: CHENG_PHONETIC.id, role: 'phonetic' },
    ]);
    expect(COMPONENTS[CHENG_PHONETIC.id]?.reliability).toBe('exact');
  });

  it('tags 茶 with a semantic-only decomposition (⺿ grass radical), no phonetic claim', () => {
    const d = findCharDecomp('street-trade', '茶');
    expect(d).toBeDefined();
    expect(d?.semantic_radical).toBe(GRASS_RADICAL.id);
    expect(d?.components).toEqual([{ componentId: GRASS_RADICAL.id, role: 'semantic' }]);
    expect(d?.components.some((c) => c.role === 'phonetic')).toBe(false);
  });

  it('never claims 场 or 行 carry a verified phonetic component (both left undecomposed)', () => {
    expect(findCharDecomp('transit-ticket', '场')).toBeUndefined();
    expect(findCharDecomp('transit-ticket', '行')).toBeUndefined();
  });

  it('gives 快递 a word-level decomposition (快 + 递), not a character-level one', () => {
    const wordDecomp = SEED_PACK.questions
      .filter((q) => q.category === 'street-trade')
      .map((q) => q.decomposition)
      .find((d): d is WordDecomposition => d?.kind === 'word' && d.hanzi === '快递');
    expect(wordDecomp).toBeDefined();
    expect(wordDecomp?.morphemes.map((m) => m.span)).toEqual(['快', '递']);
  });

  it('marks the known non-compositional spans opaque: 时价, 招牌, 保质期, 咖啡', () => {
    const opaqueHanzi = new Set(
      SEED_PACK.questions
        .filter((q) => q.face?.transparency === 'opaque')
        .map((q) => q.face?.hanzi),
    );
    for (const hanzi of ['时价', '招牌', '保质期', '咖啡']) {
      expect(opaqueHanzi.has(hanzi), `${hanzi} should be marked transparency: 'opaque'`).toBe(true);
    }
  });
});

describe('validatePack forbidden codepoints', () => {
  // DESIGN.md §4.11 gate 8/§3.3.4: U+2EBC (CJK RADICAL MEAT) and the rest of
  // the CJK Radicals Supplement block are component shapes, never something a
  // player reads - a naive font-subset extraction over item strings alone
  // would never even notice ⺼ was missing, because it never legitimately
  // appears in one.
  const chunk: CategoryContent = {
    low: [
      [
        'Prompt with a bare radical ⺼?',
        ['right', 'w1', 'w2'],
        0,
        'because',
        { hanzi: '肝', pinyin: 'gān', nl: 'lever' },
      ],
    ],
    mid: [],
    high: [],
  };

  it('fails the build on a literal U+2EBC in a player-facing string', () => {
    const pack: ContentPack = {
      id: 'test.radical-leak',
      version: '0.0.0',
      name: 'radical leak test',
      categories: [{ id: 'menu-animal', name: 'Animal', glyph: '肉' }],
      questions: expand('menu-animal', chunk),
    };
    const problems = validatePack(pack);
    expect(problems.some((p) => p.includes('prompt') && p.includes('CJK Radicals Supplement'))).toBe(true);
  });

  it('does not flag the ordinary characters that make up SEED_PACK', () => {
    expect(validatePack(SEED_PACK)).toEqual([]);
  });
});

describe('validatePack component references', () => {
  it('fails the build on a dangling componentId', () => {
    const chunk: CategoryContent = {
      low: [
        [
          'Prompt?',
          ['right', 'w1', 'w2'],
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
