import { describe, expect, it } from 'vitest';

import {
  AGAIN_RADICAL,
  ANIMAL_RADICAL,
  BAMBOO_RADICAL,
  BAN_PHONETIC,
  BAO_PHONETIC,
  BIRD_RADICAL,
  CHENG_PHONETIC,
  CITY_RADICAL,
  COMPONENTS,
  DI_PHONETIC,
  EARTH_SEMANTIC,
  expand,
  FIRE_DOTS_RADICAL,
  FIRE_RADICAL,
  FOOD_RADICAL,
  GRAIN_RADICAL,
  GRASS_RADICAL,
  GUO_PHONETIC,
  HAND_RADICAL,
  HEART_RADICAL,
  INSECT_RADICAL,
  KAO_PHONETIC,
  MEAT_RADICAL,
  MEN_PHONETIC,
  METAL_RADICAL,
  MOUTH_RADICAL,
  PERSON_RADICAL,
  SEED_PACK,
  SHELL_RADICAL,
  SILK_RADICAL,
  SILK_RADICAL_FULL,
  STAND_SEMANTIC,
  SUN_RADICAL,
  TAP_RADICAL,
  TING_PHONETIC,
  validatePack,
  WALK_RADICAL,
  WATER_RADICAL,
  WRAP_PHONETIC,
  YOU_PHONETIC,
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

  /**
   * Re-verification pass against Make Me a Hanzi's `dictionary.txt` (same
   * gitignored scratch copy as STAND_SEMANTIC/EARTH_SEMANTIC): none of the
   * remaining seven semantic-only organ characters clear the GAN_PHONETIC/
   * ZHAN_PHONETIC/CHENG_PHONETIC exact-match bar (target reading == phonetic
   * component's own reading, same syllable and tone). Per-character reason:
   *   肠 cháng / phonetic 昜 yáng — different syllable entirely.
   *   肚 dǔ / phonetic 土 tǔ — same rime and tone, different initial (t/d).
   *   腰 yāo / phonetic 要 — 要's primary reading is yào, tone mismatch; an
   *     archaic yāo reading of 要 exists in pinyin-data but is not the
   *     character's common reading, so it fails the same bar this project
   *     already rejects 站/占-style near-misses on (DESIGN.md §3.3.3(6)).
   *   脑 nǎo — dictionary.txt records no single phonetic component at all.
   *   肺 fèi / phonetic 巿 fú — different rime and tone.
   *   肾 shèn — no phonetic component in the simplified form; the traditional
   *     腎's phonetic 臤 is qiān, unrelated to shèn.
   *   胗 zhēn / phonetic 㐱 zhěn — same syllable, different tone.
   * A wrong or near-miss phonetic hint is worse than none (DESIGN.md
   * §3.3.3(6)), so all seven stay semantic-only.
   */
  it('does not claim a phonetic component for any near-miss organ character', () => {
    const NEAR_MISS_NO_PHONETIC = new Set(['肠', '肚', '腰', '脑', '肺', '肾', '胗']);
    for (const d of organDecompositions) {
      if (NEAR_MISS_NO_PHONETIC.has(d.hanzi)) {
        expect(
          d.components.some((c) => c.role === 'phonetic'),
          `${d.hanzi} should not carry a phonetic component`,
        ).toBe(false);
      }
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

describe('decomposition-backfill pass (Aug 2026): fire/water/animal/food/hand/metal/grain radicals', () => {
  const findCharDecomps = (category: string, hanzi: string): CharacterDecomposition[] =>
    SEED_PACK.questions
      .filter((q) => q.category === category && q.decomposition?.kind === 'character' && q.decomposition.hanzi === hanzi)
      .map((q) => q.decomposition as CharacterDecomposition);

  it('tags the six left-right fire-radical cooking methods, with exact phonetics on 烤/焖/爆 only', () => {
    const exactPhonetic: Record<string, string> = {
      烤: KAO_PHONETIC.id,
      焖: MEN_PHONETIC.id,
      爆: BAO_PHONETIC.id,
    };
    for (const hanzi of ['炒', '炖', '烤', '烧', '焖', '爆']) {
      const decomps = findCharDecomps('menu-cooking', hanzi);
      expect(decomps.length, `${hanzi} should have a CharacterDecomposition`).toBeGreaterThan(0);
      for (const d of decomps) {
        expect(d.semantic_radical).toBe(FIRE_RADICAL.id);
        const phoneticId = exactPhonetic[hanzi];
        if (phoneticId !== undefined) {
          expect(d.components).toContainEqual({ componentId: phoneticId, role: 'phonetic' });
          expect(COMPONENTS[phoneticId]?.reliability).toBe('exact');
        } else {
          expect(d.components.some((c) => c.role === 'phonetic'), `${hanzi} should not claim a phonetic component`).toBe(false);
        }
      }
    }
  });

  it('never claims 炸 has a verified phonetic component (zhá vs 乍 zhà/zuò is a tone-and-reading mismatch)', () => {
    expect(findCharDecomps('menu-cooking', '炸')).toEqual([]);
  });

  it('never decomposes 蒸 or 卤 (ideographic / no MMH decomposition data)', () => {
    expect(findCharDecomps('menu-cooking', '蒸')).toEqual([]);
    expect(findCharDecomps('menu-cooking', '卤')).toEqual([]);
  });

  it('tags 煮/煎 with the four-dot fire radical, semantic-only', () => {
    for (const hanzi of ['煮', '煎']) {
      const decomps = findCharDecomps('menu-cooking', hanzi);
      expect(decomps.length).toBeGreaterThan(0);
      for (const d of decomps) {
        expect(d.semantic_radical).toBe(FIRE_DOTS_RADICAL.id);
        expect(d.components.some((c) => c.role === 'phonetic')).toBe(false);
      }
    }
  });

  it('tags 汤/涮 with the water radical, semantic-only', () => {
    for (const [category, hanzi] of [['menu-order', '汤'], ['menu-cooking', '涮']] as const) {
      const decomps = findCharDecomps(category, hanzi);
      expect(decomps.length).toBeGreaterThan(0);
      for (const d of decomps) {
        expect(d.semantic_radical).toBe(WATER_RADICAL.id);
        expect(d.components.some((c) => c.role === 'phonetic')).toBe(false);
      }
    }
  });

  it('tags 猪 with the animal radical, semantic-only', () => {
    const decomps = findCharDecomps('menu-animal', '猪');
    expect(decomps.length).toBeGreaterThan(0);
    for (const d of decomps) {
      expect(d.semantic_radical).toBe(ANIMAL_RADICAL.id);
      expect(d.components.some((c) => c.role === 'phonetic')).toBe(false);
    }
  });

  it('tags 饭/饺/馆 with the food radical, all semantic-only (near-miss tone on every phonetic half)', () => {
    for (const [category, hanzi] of [
      ['menu-animal', '饭'],
      ['menu-animal', '饺'],
      ['transit-ticket', '馆'],
    ] as const) {
      const decomps = findCharDecomps(category, hanzi);
      expect(decomps.length).toBeGreaterThan(0);
      for (const d of decomps) {
        expect(d.semantic_radical).toBe(FOOD_RADICAL.id);
        expect(d.components.some((c) => c.role === 'phonetic')).toBe(false);
      }
    }
  });

  it('never decomposes 面 (Make Me a Hanzi has no decomposition data for it)', () => {
    expect(findCharDecomps('menu-animal', '面')).toEqual([]);
  });

  it('tags 拌 with the hand radical plus an exact-match phonetic (半), 折 semantic-only', () => {
    const ban = findCharDecomps('menu-cooking', '拌');
    expect(ban.length).toBeGreaterThan(0);
    for (const d of ban) {
      expect(d.semantic_radical).toBe(HAND_RADICAL.id);
      expect(d.components).toContainEqual({ componentId: BAN_PHONETIC.id, role: 'phonetic' });
    }
    expect(COMPONENTS[BAN_PHONETIC.id]?.reliability).toBe('exact');

    const zhe = findCharDecomps('market-label', '折');
    expect(zhe.length).toBeGreaterThan(0);
    for (const d of zhe) {
      expect(d.semantic_radical).toBe(HAND_RADICAL.id);
      expect(d.components.some((c) => c.role === 'phonetic')).toBe(false);
    }
  });

  it('tags 锅 with the metal radical plus an exact-match phonetic (呙), 铺 semantic-only', () => {
    const guo = findCharDecomps('menu-animal', '锅');
    expect(guo.length).toBeGreaterThan(0);
    for (const d of guo) {
      expect(d.semantic_radical).toBe(METAL_RADICAL.id);
      expect(d.components).toContainEqual({ componentId: GUO_PHONETIC.id, role: 'phonetic' });
    }
    expect(COMPONENTS[GUO_PHONETIC.id]?.reliability).toBe('exact');

    const pu = findCharDecomps('transit-ticket', '铺');
    expect(pu.length).toBeGreaterThan(0);
    for (const d of pu) {
      expect(d.semantic_radical).toBe(METAL_RADICAL.id);
      expect(d.components.some((c) => c.role === 'phonetic')).toBe(false);
    }
  });

  it('tags 粉 with the grain radical, semantic-only', () => {
    const decomps = findCharDecomps('menu-animal', '粉');
    expect(decomps.length).toBeGreaterThan(0);
    for (const d of decomps) {
      expect(d.semantic_radical).toBe(GRAIN_RADICAL.id);
      expect(d.components.some((c) => c.role === 'phonetic')).toBe(false);
    }
  });

  it('gives the new transparent compounds a word-level decomposition, not a character-level one', () => {
    const findWordDecomp = (category: string, hanzi: string): WordDecomposition | undefined =>
      SEED_PACK.questions
        .filter((q) => q.category === category)
        .map((q) => q.decomposition)
        .find((d): d is WordDecomposition => d?.kind === 'word' && d.hanzi === hanzi);

    expect(findWordDecomp('transit-ticket', '高铁')?.morphemes.map((m) => m.span)).toEqual(['高', '铁']);
    expect(findWordDecomp('transit-ticket', '火车')?.morphemes.map((m) => m.span)).toEqual(['火', '车']);
    expect(findWordDecomp('transit-platform', '地铁')?.morphemes.map((m) => m.span)).toEqual(['地', '铁']);
    expect(findWordDecomp('street-trade', '洗手间')?.morphemes.map((m) => m.span)).toEqual(['洗', '手', '间']);
    expect(findWordDecomp('street-trade', '药店')?.morphemes.map((m) => m.span)).toEqual(['药', '店']);
    expect(findWordDecomp('street-trade', '邮局')?.morphemes.map((m) => m.span)).toEqual(['邮', '局']);
    expect(findWordDecomp('street-trade', '停车场')?.morphemes.map((m) => m.span)).toEqual(['停', '车', '场']);
    expect(findWordDecomp('market-checkout', '收银台')?.morphemes.map((m) => m.span)).toEqual(['收', '银', '台']);
    expect(findWordDecomp('market-checkout', '结账')?.morphemes.map((m) => m.span)).toEqual(['结', '账']);
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

describe('eligibility-gap backfill (Aug 2026): standalone characters for previously-inert word decompositions', () => {
  const findCharDecomp = (category: string, hanzi: string): CharacterDecomposition | undefined =>
    SEED_PACK.questions
      .filter((q) => q.category === category)
      .map((q) => q.decomposition)
      .find((d): d is CharacterDecomposition => d?.kind === 'character' && d.hanzi === hanzi);

  it('tags 收 with the tap radical, semantic-only', () => {
    const d = findCharDecomp('market-checkout', '收');
    expect(d?.semantic_radical).toBe(TAP_RADICAL.id);
    expect(d?.components.some((c) => c.role === 'phonetic')).toBe(false);
  });

  it('tags 银/铁 with the metal radical (reused from 锅/铺), semantic-only', () => {
    for (const [category, hanzi] of [
      ['market-checkout', '银'],
      ['transit-ticket', '铁'],
    ] as const) {
      const d = findCharDecomp(category, hanzi);
      expect(d?.semantic_radical, `${hanzi} should carry METAL_RADICAL`).toBe(METAL_RADICAL.id);
      expect(d?.components.some((c) => c.role === 'phonetic')).toBe(false);
    }
  });

  it('tags 结/账 with new semantic-only radicals (silk, shell)', () => {
    const jie = findCharDecomp('market-checkout', '结');
    expect(jie?.semantic_radical).toBe(SILK_RADICAL.id);
    const zhang = findCharDecomp('market-checkout', '账');
    expect(zhang?.semantic_radical).toBe(SHELL_RADICAL.id);
  });

  it('tags 洗 with the water radical (reused from 汤/涮) and 药 with the grass radical (reused from 茶)', () => {
    const xi = findCharDecomp('street-way', '洗');
    expect(xi?.semantic_radical).toBe(WATER_RADICAL.id);
    const yao = findCharDecomp('street-way', '药');
    expect(yao?.semantic_radical).toBe(GRASS_RADICAL.id);
  });

  it('tags 地 with the earth radical (reused from 城)', () => {
    const di = findCharDecomp('transit-platform', '地');
    expect(di?.semantic_radical).toBe(EARTH_SEMANTIC.id);
  });

  it('tags 邮/递/停 with an exact-match phonetic pairing (由/弟/亭)', () => {
    const you = findCharDecomp('street-way', '邮');
    expect(you?.semantic_radical).toBe(CITY_RADICAL.id);
    expect(you?.components).toContainEqual({ componentId: YOU_PHONETIC.id, role: 'phonetic' });
    expect(COMPONENTS[YOU_PHONETIC.id]?.reliability).toBe('exact');

    const di = findCharDecomp('street-way', '递');
    expect(di?.semantic_radical).toBe(WALK_RADICAL.id);
    expect(di?.components).toContainEqual({ componentId: DI_PHONETIC.id, role: 'phonetic' });
    expect(COMPONENTS[DI_PHONETIC.id]?.reliability).toBe('exact');

    const ting = findCharDecomp('street-open', '停');
    expect(ting?.semantic_radical).toBe(PERSON_RADICAL.id);
    expect(ting?.components).toContainEqual({ componentId: TING_PHONETIC.id, role: 'phonetic' });
    expect(COMPONENTS[TING_PHONETIC.id]?.reliability).toBe('exact');
  });

  it('tags 快 with the heart radical, no phonetic claim (夬 guài/jué does not match kuài)', () => {
    const kuai = findCharDecomp('street-way', '快');
    expect(kuai?.semantic_radical).toBe(HEART_RADICAL.id);
    expect(kuai?.components.some((c) => c.role === 'phonetic')).toBe(false);
  });

  it('gives 台 a labelled mnemonic-only story instead of a fabricated decomposition (MMH has no etymology entry for it)', () => {
    const tai = SEED_PACK.questions.find((q) => q.category === 'market-checkout' && q.face?.hanzi === '台');
    expect(tai?.glossProvenance).toBe('mnemonic-only');
    expect(tai?.decomposition).toBeUndefined();
  });

  it('gives 高/火/车 labelled mnemonic-only stories (Make Me a Hanzi records them as bare pictographs, no split)', () => {
    for (const hanzi of ['高', '火', '车']) {
      const q = SEED_PACK.questions.find((qq) => qq.category === 'transit-ticket' && qq.face?.hanzi === hanzi);
      expect(q?.glossProvenance, `${hanzi} should be mnemonic-only`).toBe('mnemonic-only');
      expect(q?.decomposition).toBeUndefined();
    }
  });

  it('gives 手/间/局 labelled mnemonic-only stories (no clean semantic/phonetic split to verify)', () => {
    for (const hanzi of ['手', '间', '局']) {
      const q = SEED_PACK.questions.find((qq) => qq.category === 'street-way' && qq.face?.hanzi === hanzi);
      expect(q?.glossProvenance, `${hanzi} should be mnemonic-only`).toBe('mnemonic-only');
      expect(q?.decomposition).toBeUndefined();
    }
  });
});

describe('rest-of-bank coverage pass (Aug 2026): remaining single characters', () => {
  const findCharDecomp = (category: string, hanzi: string): CharacterDecomposition | undefined =>
    SEED_PACK.questions
      .filter((q) => q.category === category)
      .map((q) => q.decomposition)
      .find((d): d is CharacterDecomposition => d?.kind === 'character' && d.hanzi === hanzi);

  it('tags 号/份/双 in market-panel with real, verified decompositions', () => {
    const hao = findCharDecomp('market-panel', '号');
    expect(hao?.semantic_radical).toBe(MOUTH_RADICAL.id);
    expect(hao?.components.some((c) => c.role === 'phonetic')).toBe(false);

    const fen = findCharDecomp('market-panel', '份');
    expect(fen?.semantic_radical).toBe(PERSON_RADICAL.id);

    const shuang = findCharDecomp('market-panel', '双');
    expect(shuang?.components).toEqual([
      { componentId: AGAIN_RADICAL.id, role: 'semantic' },
      { componentId: AGAIN_RADICAL.id, role: 'semantic' },
    ]);
  });

  it('gives 个/半/只 in market-panel labelled mnemonic-only stories', () => {
    for (const hanzi of ['个', '半', '只']) {
      const q = SEED_PACK.questions.find((qq) => qq.category === 'market-panel' && qq.face?.hanzi === hanzi);
      expect(q?.glossProvenance, `${hanzi} should be mnemonic-only`).toBe('mnemonic-only');
      expect(q?.decomposition).toBeUndefined();
    }
  });

  it('gives 百/千/壹/贰/叁 in market-checkout labelled mnemonic-only stories', () => {
    for (const hanzi of ['百', '千', '壹', '贰', '叁']) {
      const q = SEED_PACK.questions.find((qq) => qq.category === 'market-checkout' && qq.face?.hanzi === hanzi);
      expect(q?.glossProvenance, `${hanzi} should be mnemonic-only`).toBe('mnemonic-only');
    }
  });

  it('tags 鸡/虾/蛋/筋/包 in menu-animal with real, verified decompositions', () => {
    const ji = findCharDecomp('menu-animal', '鸡');
    expect(ji?.semantic_radical).toBe(BIRD_RADICAL.id);

    const xia = findCharDecomp('menu-animal', '虾');
    expect(xia?.semantic_radical).toBe(INSECT_RADICAL.id);
    const dan = findCharDecomp('menu-animal', '蛋');
    expect(dan?.semantic_radical).toBe(INSECT_RADICAL.id);

    const jin = findCharDecomp('menu-animal', '筋');
    expect(jin?.semantic_radical).toBe(BAMBOO_RADICAL.id);

    const bao = findCharDecomp('menu-animal', '包');
    expect(bao?.components).toEqual([{ componentId: WRAP_PHONETIC.id, role: 'phonetic' }]);
    expect(COMPONENTS[WRAP_PHONETIC.id]?.reliability).toBe('exact');

    const su = findCharDecomp('menu-animal', '素');
    expect(su?.semantic_radical).toBe(SILK_RADICAL_FULL.id);
    expect(su?.components.some((c) => c.role === 'phonetic')).toBe(false);
  });

  it('gives 肉/牛/羊/鱼/血/舌 in menu-animal labelled mnemonic-only stories', () => {
    for (const hanzi of ['肉', '牛', '羊', '鱼', '血', '舌']) {
      const q = SEED_PACK.questions.find((qq) => qq.category === 'menu-animal' && qq.face?.hanzi === hanzi);
      expect(q?.glossProvenance, `${hanzi} should be mnemonic-only`).toBe('mnemonic-only');
      expect(q?.decomposition).toBeUndefined();
    }
  });

  it('never claims a decomposition or mnemonic for 皮/票/行 - left exactly as earlier phases decided', () => {
    for (const [category, hanzi] of [
      ['menu-animal', '皮'],
      ['transit-platform', '票'],
      ['transit-ticket', '行'],
    ] as const) {
      const q = SEED_PACK.questions.find((qq) => qq.category === category && qq.face?.hanzi === hanzi);
      expect(q?.decomposition, `${hanzi} should have no decomposition`).toBeUndefined();
      expect(q?.glossProvenance, `${hanzi} should have no glossProvenance`).toBeUndefined();
    }
  });

  it('tags 时 with the sun radical and 点 with the fire-dots radical (reused from 煮/煎)', () => {
    const shi = findCharDecomp('street-open', '时');
    expect(shi?.semantic_radical).toBe(SUN_RADICAL.id);
    const dian = findCharDecomp('street-open', '点');
    expect(dian?.semantic_radical).toBe(FIRE_DOTS_RADICAL.id);
  });

  it('registers every new component in COMPONENTS with no dangling id anywhere in SEED_PACK', () => {
    for (const id of [
      TAP_RADICAL.id,
      SILK_RADICAL.id,
      SHELL_RADICAL.id,
      CITY_RADICAL.id,
      YOU_PHONETIC.id,
      WALK_RADICAL.id,
      DI_PHONETIC.id,
      PERSON_RADICAL.id,
      TING_PHONETIC.id,
      HEART_RADICAL.id,
      MOUTH_RADICAL.id,
      AGAIN_RADICAL.id,
      SILK_RADICAL_FULL.id,
      BIRD_RADICAL.id,
      INSECT_RADICAL.id,
      BAMBOO_RADICAL.id,
      SUN_RADICAL.id,
      WRAP_PHONETIC.id,
    ]) {
      expect(COMPONENTS[id], `${id} should be registered in COMPONENTS`).toBeDefined();
    }
    expect(validatePack(SEED_PACK)).toEqual([]);
  });
});
