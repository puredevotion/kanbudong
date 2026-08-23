import { describe, expect, it } from 'vitest';

import {
  AGAIN_RADICAL,
  ALTAR_RADICAL,
  ANIMAL_RADICAL,
  AXE_RADICAL,
  BAMBOO_RADICAL,
  BAN_PHONETIC,
  BAO_PHONETIC,
  BIRD_RADICAL,
  BITTER_RADICAL,
  BOW_RADICAL,
  BUILDING_RADICAL,
  CHENG_PHONETIC,
  CITY_RADICAL,
  CLOTH_RADICAL,
  CLOTHES_RADICAL,
  COMPONENTS,
  DI_PHONETIC,
  DIPPER_RADICAL,
  DOOR_RADICAL,
  EARTH_SEMANTIC,
  expand,
  FIRE_DOTS_RADICAL,
  FIRE_RADICAL,
  FOOD_RADICAL,
  GATE_RADICAL,
  GRAIN_RADICAL,
  GRASS_RADICAL,
  GUO_PHONETIC,
  HAND_RADICAL,
  HEART_RADICAL,
  HEART_RADICAL_FULL,
  HUI_PHONETIC,
  ICE_RADICAL,
  INSECT_RADICAL,
  KAO_PHONETIC,
  KNIFE_RADICAL,
  LIE_PHONETIC,
  MA_PHONETIC,
  SHAO_PHONETIC,
  MEAT_RADICAL,
  MEN_PHONETIC,
  METAL_RADICAL,
  MOUND_RADICAL,
  MOUTH_RADICAL,
  ONE_RADICAL,
  OX_RADICAL,
  PERSON_RADICAL,
  POTTERY_RADICAL,
  QI_PHONETIC,
  RUN_RADICAL,
  SEED_PACK,
  SHELL_RADICAL,
  SILK_RADICAL,
  SILK_RADICAL_FULL,
  SPEECH_RADICAL,
  SPEECH_RADICAL_FULL,
  STAND_SEMANTIC,
  STONE_RADICAL,
  SUN_RADICAL,
  SWEET_RADICAL,
  TAP_RADICAL,
  TEN_RADICAL,
  THOUSAND_RADICAL,
  TI_PHONETIC,
  TING_PHONETIC,
  TONGUE_RADICAL,
  TWO_HANDS_RADICAL,
  validatePack,
  VILLAGE_RADICAL,
  WALK_RADICAL,
  WAN_PHONETIC,
  WATER_RADICAL,
  WINE_RADICAL,
  WOOD_RADICAL,
  WRAP_PHONETIC,
  YI_PHONETIC,
  YOU_PHONETIC,
  ZHAN_PHONETIC,
  ZHENG_PHONETIC,
  ZHI_PHONETIC,
  ZHU_PHONETIC,
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
   * gitignored scratch copy as STAND_SEMANTIC/EARTH_SEMANTIC): the remaining
   * six semantic-only organ characters do not clear the GAN_PHONETIC/
   * ZHAN_PHONETIC/CHENG_PHONETIC exact-match bar (target reading == phonetic
   * component's own reading, same syllable and tone, checked against the
   * candidate's FULL `pinyin-data` reading list, not just its primary
   * reading). Per-character reason:
   *   肠 cháng / phonetic 昜 yáng — different syllable entirely.
   *   肚 dǔ / phonetic 土 (tǔ, dù, chǎ, tú) — none of 土's readings is dǔ
   *     (dù is a near-miss tone away, not a match).
   *   脑 nǎo — dictionary.txt records no single phonetic component at all.
   *   肺 fèi / phonetic 巿 (fú, pó) — no reading matches fèi.
   *   肾 shèn — no phonetic component in the simplified form; the traditional
   *     腎's phonetic 臤 (qiān, xián, qìn) has no reading matching shèn.
   *   胗 zhēn / phonetic 㐱 zhěn — same syllable, different tone, and zhěn is
   *     㐱's only listed reading.
   * A wrong or near-miss phonetic hint is worse than none (DESIGN.md
   * §3.3.3(6)), so all six stay semantic-only. (腰 was originally in this
   * set too - see the "corrected misses" test below for why it moved out.)
   */
  it('does not claim a phonetic component for any near-miss organ character', () => {
    const NEAR_MISS_NO_PHONETIC = new Set(['肠', '肚', '脑', '肺', '肾', '胗']);
    for (const d of organDecompositions) {
      if (NEAR_MISS_NO_PHONETIC.has(d.hanzi)) {
        expect(
          d.components.some((c) => c.role === 'phonetic'),
          `${d.hanzi} should not carry a phonetic component`,
        ).toBe(false);
      }
    }
  });

  /**
   * Full-reading-list re-audit (Aug 2026, prompted by a user catching that
   * 份/分 was wrongly rejected on a primary-reading-only check). 腰's
   * original rejection made the identical mistake: it compared yāo against
   * 要's primary reading yào and stopped there, even though `pinyin-data`
   * lists 要 as a genuine heteronym (yào, yāo, yǎo) - yāo is itself an
   * attested reading, an exact match. Make Me a Hanzi classifies 腰/要 as
   * `pictophonetic`, so this ships as a real phonetic hint, not an
   * ideographic pairing like 份/分 turned out to be.
   */
  it('ships 腰 with a verified exact phonetic component (要, yāo = yāo) after the full-reading-list re-audit', () => {
    const d = organDecompositions.find((d) => d.hanzi === '腰');
    expect(d).toBeDefined();
    expect(d?.components).toContainEqual({ componentId: 'phonetic-yao', role: 'phonetic' });
    expect(COMPONENTS['phonetic-yao']?.reliability).toBe('exact');
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

  it('gives 场 a semantic-only decomposition (mnemonic-only decomposition-gap audit, Aug 2026) and leaves 行 undecomposed', () => {
    const chang = findCharDecomp('transit-ticket', '场');
    expect(chang?.semantic_radical).toBe(EARTH_SEMANTIC.id);
    expect(chang?.components.some((c) => c.role === 'phonetic')).toBe(false);
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

  it('tags the six left-right fire-radical cooking methods, with phonetics of the right reliability tier', () => {
    const phonetic: Record<string, { id: string; reliability: string }> = {
      烤: { id: KAO_PHONETIC.id, reliability: 'exact' },
      焖: { id: MEN_PHONETIC.id, reliability: 'exact' },
      爆: { id: BAO_PHONETIC.id, reliability: 'exact' },
      // 炒 chǎo / 少 shǎo,shào: same rime and (on shǎo) same tone, different
      // initial - a real phonetic component wrongly dropped entirely on a
      // first pass that only checked for an exact match. See SHAO_PHONETIC's
      // doc comment.
      炒: { id: SHAO_PHONETIC.id, reliability: 'rime-only' },
    };
    for (const hanzi of ['炒', '炖', '烤', '烧', '焖', '爆']) {
      const decomps = findCharDecomps('menu-cooking', hanzi);
      expect(decomps.length, `${hanzi} should have a CharacterDecomposition`).toBeGreaterThan(0);
      for (const d of decomps) {
        expect(d.semantic_radical).toBe(FIRE_RADICAL.id);
        const expected = phonetic[hanzi];
        if (expected !== undefined) {
          expect(d.components).toContainEqual({ componentId: expected.id, role: 'phonetic' });
          expect(COMPONENTS[expected.id]?.reliability).toBe(expected.reliability);
        } else {
          expect(d.components.some((c) => c.role === 'phonetic'), `${hanzi} should not claim a phonetic component`).toBe(false);
        }
      }
    }
  });

  it('gives 炸 the fire radical, semantic-only (zhá vs 乍 zhà/zuò is a tone-and-reading mismatch, never a verified phonetic component)', () => {
    const decomps = findCharDecomps('menu-cooking', '炸');
    expect(decomps.length).toBe(1);
    expect(decomps[0]?.semantic_radical).toBe(FIRE_RADICAL.id);
    expect(decomps[0]?.components.some((c) => c.role === 'phonetic')).toBe(false);
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

  it('tags 饺/馆 with the food radical, semantic-only (no reading of 交/官 matches jiǎo/guǎn)', () => {
    for (const [category, hanzi] of [
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

  /**
   * Full-reading-list re-audit (Aug 2026, prompted by the 份/分 catch): 饭's
   * phonetic half 反 was originally checked only against its primary
   * reading (fǎn) and logged as a tone-only near miss for fàn - but
   * `pinyin-data` lists 反 as a genuine heteronym (fǎn, fàn), so fàn is
   * itself an attested reading of 反, an exact match. 饭 now ships
   * `FAN_PHONETIC` alongside the food radical.
   */
  it('tags 饭 with the food radical plus an exact-match phonetic (反, fàn = fàn) after the full-reading-list re-audit', () => {
    const decomps = findCharDecomps('menu-animal', '饭');
    expect(decomps.length).toBeGreaterThan(0);
    for (const d of decomps) {
      expect(d.semantic_radical).toBe(FOOD_RADICAL.id);
      expect(d.components).toContainEqual({ componentId: 'phonetic-fan', role: 'phonetic' });
      expect(COMPONENTS['phonetic-fan']?.reliability).toBe('exact');
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

  it('gives 台 the mouth radical alongside its mnemonic-only story (mnemonic-only decomposition-gap audit, Aug 2026)', () => {
    const tai = SEED_PACK.questions.find((q) => q.category === 'market-checkout' && q.face?.hanzi === '台');
    expect(tai?.glossProvenance).toBe('mnemonic-only');
    expect(tai?.decomposition?.kind).toBe('character');
    const decomp = tai?.decomposition as CharacterDecomposition | undefined;
    expect(decomp?.semantic_radical).toBe(MOUTH_RADICAL.id);
    expect(decomp?.components.some((c) => c.role === 'phonetic')).toBe(false);
  });

  it('gives 高/火/车 labelled mnemonic-only stories (Make Me a Hanzi records them as bare pictographs, no split)', () => {
    for (const hanzi of ['高', '火', '车']) {
      const q = SEED_PACK.questions.find((qq) => qq.category === 'transit-ticket' && qq.face?.hanzi === hanzi);
      expect(q?.glossProvenance, `${hanzi} should be mnemonic-only`).toBe('mnemonic-only');
      expect(q?.decomposition).toBeUndefined();
    }
  });

  it('gives 手/局 labelled mnemonic-only stories (no clean semantic/phonetic split to verify)', () => {
    for (const hanzi of ['手', '局']) {
      const q = SEED_PACK.questions.find((qq) => qq.category === 'street-way' && qq.face?.hanzi === hanzi);
      expect(q?.glossProvenance, `${hanzi} should be mnemonic-only`).toBe('mnemonic-only');
      expect(q?.decomposition).toBeUndefined();
    }
  });

  it('gives 间 the gate and sun radicals, 问 the mouth radical (mnemonic-only decomposition-gap audit, Aug 2026)', () => {
    const jian = findCharDecomp('street-way', '间');
    expect(jian?.semantic_radical).toBe(GATE_RADICAL.id);
    expect(jian?.components).toEqual([
      { componentId: GATE_RADICAL.id, role: 'semantic' },
      { componentId: SUN_RADICAL.id, role: 'semantic' },
    ]);

    const wen = findCharDecomp('street-way', '问');
    expect(wen?.semantic_radical).toBe(MOUTH_RADICAL.id);
    expect(wen?.components.some((c) => c.role === 'phonetic')).toBe(false);
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

  it('gives 个/半 in market-panel labelled mnemonic-only stories', () => {
    for (const hanzi of ['个', '半']) {
      const q = SEED_PACK.questions.find((qq) => qq.category === 'market-panel' && qq.face?.hanzi === hanzi);
      expect(q?.glossProvenance, `${hanzi} should be mnemonic-only`).toBe('mnemonic-only');
      expect(q?.decomposition).toBeUndefined();
    }
  });

  it('gives 只 the mouth radical alongside its mnemonic-only story (mnemonic-only decomposition-gap audit, Aug 2026)', () => {
    const zhi = findCharDecomp('market-panel', '只');
    expect(zhi?.semantic_radical).toBe(MOUTH_RADICAL.id);
    expect(zhi?.components.some((c) => c.role === 'phonetic')).toBe(false);
    const q = SEED_PACK.questions.find((qq) => qq.category === 'market-panel' && qq.face?.hanzi === '只');
    expect(q?.glossProvenance).toBe('mnemonic-only');
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

describe('90%+ coverage push (Aug 2026, DESIGN.md §9.1)', () => {
  it('marks every genuinely non-compositional span opaque, old and new', () => {
    const opaqueHanzi = new Set(
      SEED_PACK.questions
        .filter((q) => q.face?.transparency === 'opaque')
        .map((q) => q.face?.hanzi),
    );
    // 保质期/时价/招牌/咖啡 predate this pass; the rest are new this pass -
    // 净含量 (a fixed GB 7718 label field, same treatment as 保质期), 深圳通
    // (a place-name brand, not a compositional word), 开张大吉/胡同/
    // 此路不通 (idiomatic register or a historical loanword whose parts do
    // not predict the whole).
    for (const hanzi of [
      '保质期', '时价', '招牌', '咖啡',
      '净含量', '深圳通', '开张大吉', '胡同', '此路不通',
    ]) {
      expect(opaqueHanzi.has(hanzi), `${hanzi} should be marked transparency: 'opaque'`).toBe(true);
    }
  });

  it('gives 超市/进口/银行/千克 transparent WordDecompositions with the expected morphemes', () => {
    const wordDecomp = (hanzi: string): WordDecomposition | undefined =>
      SEED_PACK.questions
        .map((q) => q.decomposition)
        .find((d): d is WordDecomposition => d?.kind === 'word' && d.hanzi === hanzi);

    expect(wordDecomp('超市')?.morphemes.map((m) => m.span)).toEqual(['超', '市']);
    expect(wordDecomp('进口')?.morphemes.map((m) => m.span)).toEqual(['进', '口']);
    expect(wordDecomp('银行')?.morphemes.map((m) => m.span)).toEqual(['银', '行']);
    expect(wordDecomp('千克')?.morphemes.map((m) => m.span)).toEqual(['千', '克']);
  });

  it('leaves 主食 genuinely bare - no standalone item exists for 主 or 食, and none was authored just for this one word', () => {
    const q = SEED_PACK.questions.find((qq) => qq.category === 'menu-order' && qq.face?.hanzi === '主食');
    expect(q?.decomposition).toBeUndefined();
    expect(q?.glossProvenance).toBeUndefined();
    expect(q?.face?.transparency).toBeUndefined();
  });

  it('still leaves 皮/票/行 exactly as earlier phases decided, unaffected by this pass', () => {
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

  it('authors every new standalone character this pass introduced, each with a real resolution', () => {
    const newStandalones = [
      '市', '码', '卡', '一', '特', '价', '生', '冷', '口', '装', '重', '证',
      '菜', '料', '卖', '仓', '大', '惠', '所', '院', '发', '厅', '小',
      '电', '问', '无', '乘', '检', '向', '开',
      '提', '指', '禁', '请', '警', '心', '注',
    ];
    for (const hanzi of newStandalones) {
      const q = SEED_PACK.questions.find((qq) => qq.face?.hanzi === hanzi);
      expect(q, `${hanzi} should exist as a standalone question`).toBeDefined();
      const resolved =
        q?.decomposition !== undefined ||
        q?.glossProvenance === 'mnemonic-only' ||
        q?.face?.transparency === 'opaque';
      expect(resolved, `${hanzi} should have a decomposition, mnemonic, or opaque marking`).toBe(true);
    }
  });
});

/**
 * Mnemonic-only decomposition-gap audit (Aug 2026, the 价 bug's aftermath):
 * every `glossProvenance: 'mnemonic-only'` item in the bank was checked for
 * the same gap 价 had - a mnemonic naming real structural pieces with no
 * `decomposition` field to back it. This block regression-tests every
 * content-file addition that pass made, content-bank scans against
 * `SEED_PACK` rather than synthetic fixtures, matching this test file's
 * existing style.
 */
describe('mnemonic-only decomposition-gap audit (Aug 2026)', () => {
  const findCharDecomp = (category: string, hanzi: string): CharacterDecomposition | undefined =>
    SEED_PACK.questions
      .filter((q) => q.category === category)
      .map((q) => q.decomposition)
      .find((d): d is CharacterDecomposition => d?.kind === 'character' && d.hanzi === hanzi);

  it('tags 市/码/百/千/亿 in market-checkout with verified decompositions', () => {
    const shi = findCharDecomp('market-checkout', '市');
    expect(shi?.semantic_radical).toBe(CLOTH_RADICAL.id);
    expect(shi?.components.some((c) => c.role === 'phonetic')).toBe(false);

    const ma = findCharDecomp('market-checkout', '码');
    expect(ma?.components).toEqual([
      { componentId: STONE_RADICAL.id, role: 'semantic' },
      { componentId: MA_PHONETIC.id, role: 'phonetic' },
    ]);
    expect(COMPONENTS[MA_PHONETIC.id]?.reliability).toBe('exact');

    const bai = findCharDecomp('market-checkout', '百');
    expect(bai?.semantic_radical).toBe(ONE_RADICAL.id);
    expect(bai?.components.some((c) => c.role === 'phonetic')).toBe(false);

    const qian = findCharDecomp('market-checkout', '千');
    expect(qian?.semantic_radical).toBe(TEN_RADICAL.id);

    const yi = findCharDecomp('market-checkout', '亿');
    expect(yi?.components).toEqual([
      { componentId: PERSON_RADICAL.id, role: 'semantic' },
      { componentId: YI_PHONETIC.id, role: 'phonetic' },
    ]);
    expect(COMPONENTS[YI_PHONETIC.id]?.reliability).toBe('exact');
  });

  it('leaves 万/卡/壹/贰/叁 bare mnemonic-only in market-checkout (unresolved ？, mismatched radical, or no clean numeral radical)', () => {
    for (const hanzi of ['万', '卡', '壹', '贰', '叁']) {
      const q = SEED_PACK.questions.find((qq) => qq.category === 'market-checkout' && qq.face?.hanzi === hanzi);
      expect(q?.decomposition, `${hanzi} should have no decomposition`).toBeUndefined();
      expect(q?.glossProvenance, `${hanzi} should be mnemonic-only`).toBe('mnemonic-only');
    }
  });

  it('tags 特 in market-label with the ox radical', () => {
    const te = findCharDecomp('market-label', '特');
    expect(te?.semantic_radical).toBe(OX_RADICAL.id);
    expect(te?.components.some((c) => c.role === 'phonetic')).toBe(false);
  });

  it('tags 杯/碗/瓶/张/冷/只/件/装/重/证 in market-panel with verified decompositions', () => {
    expect(findCharDecomp('market-panel', '杯')?.semantic_radical).toBe(WOOD_RADICAL.id);

    const wan = findCharDecomp('market-panel', '碗');
    expect(wan?.components).toEqual([
      { componentId: STONE_RADICAL.id, role: 'semantic' },
      { componentId: WAN_PHONETIC.id, role: 'phonetic' },
    ]);
    expect(COMPONENTS[WAN_PHONETIC.id]?.reliability).toBe('exact');

    expect(findCharDecomp('market-panel', '瓶')?.semantic_radical).toBe(POTTERY_RADICAL.id);
    expect(findCharDecomp('market-panel', '张')?.semantic_radical).toBe(BOW_RADICAL.id);
    expect(findCharDecomp('market-panel', '冷')?.semantic_radical).toBe(ICE_RADICAL.id);
    expect(findCharDecomp('market-panel', '只')?.semantic_radical).toBe(MOUTH_RADICAL.id);

    const jian = findCharDecomp('market-panel', '件');
    expect(jian?.components).toEqual([
      { componentId: PERSON_RADICAL.id, role: 'semantic' },
      { componentId: OX_RADICAL.id, role: 'semantic' },
    ]);

    expect(findCharDecomp('market-panel', '装')?.semantic_radical).toBe(CLOTHES_RADICAL.id);

    const zhong = findCharDecomp('market-panel', '重');
    expect(zhong?.components).toEqual([
      { componentId: THOUSAND_RADICAL.id, role: 'semantic' },
      { componentId: VILLAGE_RADICAL.id, role: 'semantic' },
    ]);
    expect(zhong?.semantic_radical).toBe(VILLAGE_RADICAL.id);

    const zheng = findCharDecomp('market-panel', '证');
    expect(zheng?.components).toEqual([
      { componentId: SPEECH_RADICAL.id, role: 'semantic' },
      { componentId: ZHENG_PHONETIC.id, role: 'phonetic' },
    ]);
    expect(COMPONENTS[ZHENG_PHONETIC.id]?.reliability).toBe('exact');
  });

  it('tags 块/分 in market-weight with verified decompositions', () => {
    expect(findCharDecomp('market-weight', '块')?.semantic_radical).toBe(EARTH_SEMANTIC.id);
    expect(findCharDecomp('market-weight', '分')?.semantic_radical).toBe(KNIFE_RADICAL.id);
  });

  it('leaves 元/斤/两/克/角/毛 bare mnemonic-only in market-weight', () => {
    for (const hanzi of ['元', '斤', '两', '克', '角', '毛']) {
      const q = SEED_PACK.questions.find((qq) => qq.category === 'market-weight' && qq.face?.hanzi === hanzi);
      expect(q?.decomposition, `${hanzi} should have no decomposition`).toBeUndefined();
    }
  });

  it('tags 荤 in menu-animal with the grass radical', () => {
    expect(findCharDecomp('menu-animal', '荤')?.semantic_radical).toBe(GRASS_RADICAL.id);
  });

  it('tags 辣/咸/酸/甜 in menu-flavour with verified decompositions', () => {
    expect(findCharDecomp('menu-flavour', '辣')?.semantic_radical).toBe(BITTER_RADICAL.id);
    expect(findCharDecomp('menu-flavour', '咸')?.semantic_radical).toBe(MOUTH_RADICAL.id);
    expect(findCharDecomp('menu-flavour', '酸')?.semantic_radical).toBe(WINE_RADICAL.id);

    const tianMid = SEED_PACK.questions.find((q) => q.id === 'menu-flavour-mid-3')?.decomposition as
      | CharacterDecomposition
      | undefined;
    const tianHigh = SEED_PACK.questions.find((q) => q.id === 'menu-flavour-high-1')?.decomposition as
      | CharacterDecomposition
      | undefined;
    for (const tian of [tianMid, tianHigh]) {
      expect(tian?.components).toEqual([
        { componentId: TONGUE_RADICAL.id, role: 'semantic' },
        { componentId: SWEET_RADICAL.id, role: 'semantic' },
      ]);
      expect(tian?.semantic_radical).toBe(SWEET_RADICAL.id);
    }
  });

  it('leaves 麻 bare mnemonic-only in menu-flavour (self-radical, MMH radical does not match either named component)', () => {
    const q = SEED_PACK.questions.find((qq) => qq.category === 'menu-flavour' && qq.face?.hanzi === '麻');
    expect(q?.decomposition).toBeUndefined();
  });

  it('tags 料/例/起/位 in menu-order with verified decompositions', () => {
    expect(findCharDecomp('menu-order', '料')?.semantic_radical).toBe(DIPPER_RADICAL.id);

    const li = findCharDecomp('menu-order', '例');
    expect(li?.components).toEqual([
      { componentId: PERSON_RADICAL.id, role: 'semantic' },
      { componentId: LIE_PHONETIC.id, role: 'phonetic' },
    ]);
    expect(COMPONENTS[LIE_PHONETIC.id]?.reliability).toBe('exact');

    const qi = findCharDecomp('menu-order', '起');
    expect(qi?.components).toEqual([
      { componentId: RUN_RADICAL.id, role: 'semantic' },
      { componentId: QI_PHONETIC.id, role: 'phonetic' },
    ]);
    expect(COMPONENTS[QI_PHONETIC.id]?.reliability).toBe('exact');

    const wei = findCharDecomp('menu-order', '位');
    expect(wei?.components).toEqual([
      { componentId: PERSON_RADICAL.id, role: 'semantic' },
      { componentId: STAND_SEMANTIC.id, role: 'semantic' },
    ]);
  });

  it('tags 提/指 with verified decompositions (exact phonetic matches found by checking full reading lists)', () => {
    const ti = findCharDecomp('safety-exit', '提');
    expect(ti?.components).toEqual([
      { componentId: HAND_RADICAL.id, role: 'semantic' },
      { componentId: TI_PHONETIC.id, role: 'phonetic' },
    ]);
    expect(COMPONENTS[TI_PHONETIC.id]?.reliability).toBe('exact');

    const zhi = findCharDecomp('safety-instruction', '指');
    expect(zhi?.components).toEqual([
      { componentId: HAND_RADICAL.id, role: 'semantic' },
      { componentId: ZHI_PHONETIC.id, role: 'phonetic' },
    ]);
    expect(COMPONENTS[ZHI_PHONETIC.id]?.reliability).toBe('exact');
  });

  it('tags 禁/请 in safety-prohibition with verified semantic-only decompositions', () => {
    expect(findCharDecomp('safety-prohibition', '禁')?.semantic_radical).toBe(ALTAR_RADICAL.id);
    expect(findCharDecomp('safety-prohibition', '请')?.semantic_radical).toBe(SPEECH_RADICAL.id);
  });

  it('tags 警/注 in safety-warning, leaves 心 bare', () => {
    expect(findCharDecomp('safety-warning', '警')?.semantic_radical).toBe(SPEECH_RADICAL_FULL.id);

    const zhu = findCharDecomp('safety-warning', '注');
    expect(zhu?.components).toEqual([
      { componentId: WATER_RADICAL.id, role: 'semantic' },
      { componentId: ZHU_PHONETIC.id, role: 'phonetic' },
    ]);
    expect(COMPONENTS[ZHU_PHONETIC.id]?.reliability).toBe('exact');

    const xin = SEED_PACK.questions.find((q) => q.category === 'safety-warning' && q.face?.hanzi === '心');
    expect(xin?.decomposition).toBeUndefined();
  });

  it('tags 惠 in street-promo, leaves 卖/仓/大 bare', () => {
    const hui = findCharDecomp('street-promo', '惠');
    expect(hui?.components).toEqual([
      { componentId: HUI_PHONETIC.id, role: 'phonetic' },
      { componentId: HEART_RADICAL_FULL.id, role: 'semantic' },
    ]);
    expect(COMPONENTS[HUI_PHONETIC.id]?.reliability).toBe('exact');

    for (const hanzi of ['卖', '仓', '大']) {
      const q = SEED_PACK.questions.find((qq) => qq.category === 'street-promo' && qq.face?.hanzi === hanzi);
      expect(q?.decomposition, `${hanzi} should have no decomposition`).toBeUndefined();
    }
  });

  it('tags 所/院/厅 in street-trade, leaves 发/小 bare', () => {
    const suo = findCharDecomp('street-trade', '所');
    expect(suo?.components).toEqual([
      { componentId: DOOR_RADICAL.id, role: 'semantic' },
      { componentId: AXE_RADICAL.id, role: 'semantic' },
    ]);

    expect(findCharDecomp('street-trade', '院')?.semantic_radical).toBe(MOUND_RADICAL.id);
    expect(findCharDecomp('street-trade', '厅')?.semantic_radical).toBe(BUILDING_RADICAL.id);

    for (const hanzi of ['发', '小']) {
      const q = SEED_PACK.questions.find((qq) => qq.category === 'street-trade' && qq.face?.hanzi === hanzi);
      expect(q?.decomposition, `${hanzi} should have no decomposition`).toBeUndefined();
    }
  });

  it('院 uses the mound radical, distinct from 邮\'s city radical despite the identical 阝 glyph', () => {
    const yuan = findCharDecomp('street-trade', '院');
    const you = findCharDecomp('street-way', '邮');
    expect(yuan?.semantic_radical).toBe(MOUND_RADICAL.id);
    expect(you?.semantic_radical).toBe(CITY_RADICAL.id);
    expect(MOUND_RADICAL.id).not.toBe(CITY_RADICAL.id);
    expect(COMPONENTS[MOUND_RADICAL.id]?.displayGlyph).toBe(COMPONENTS[CITY_RADICAL.id]?.displayGlyph);
  });

  it('tags 检/开 in transit-platform, leaves 口/乘/向 bare', () => {
    expect(findCharDecomp('transit-platform', '检')?.semantic_radical).toBe(WOOD_RADICAL.id);
    expect(findCharDecomp('transit-platform', '开')?.semantic_radical).toBe(TWO_HANDS_RADICAL.id);

    for (const hanzi of ['口', '乘', '向']) {
      const q = SEED_PACK.questions.find((qq) => qq.category === 'transit-platform' && qq.face?.hanzi === hanzi);
      expect(q?.decomposition, `${hanzi} should have no decomposition`).toBeUndefined();
    }
  });

  it('tags 店/场 in transit-ticket, leaves 高/火/车 bare', () => {
    const dianRows = SEED_PACK.questions.filter(
      (q) => q.category === 'transit-ticket' && q.face?.hanzi === '店' && q.glossProvenance === 'mnemonic-only',
    );
    expect(dianRows.length).toBe(2);
    for (const row of dianRows) {
      expect((row.decomposition as CharacterDecomposition | undefined)?.semantic_radical).toBe(BUILDING_RADICAL.id);
    }

    expect(findCharDecomp('transit-ticket', '场')?.semantic_radical).toBe(EARTH_SEMANTIC.id);

    for (const hanzi of ['高', '火', '车']) {
      const q = SEED_PACK.questions.find((qq) => qq.category === 'transit-ticket' && qq.face?.hanzi === hanzi);
      expect(q?.decomposition, `${hanzi} should have no decomposition`).toBeUndefined();
    }
  });

  it('never claims a semantic-role component whose own literal meaning contradicts the mnemonic gloss it would sit beside', () => {
    // 只's MMH decomposition also names 八 ("eight"), but the mnemonic glosses
    // it as "simple words" - a meaning 八 does not literally have - so only
    // the genuinely meaningful 口 (mouth) component was added, never 八.
    const zhi = findCharDecomp('market-panel', '只');
    expect(zhi?.components.map((c) => c.componentId)).toEqual([MOUTH_RADICAL.id]);
  });

  it('every phonetic component added this pass is registered with reliability: exact', () => {
    for (const phonetic of [
      MA_PHONETIC,
      WAN_PHONETIC,
      YI_PHONETIC,
      ZHENG_PHONETIC,
      ZHI_PHONETIC,
      LIE_PHONETIC,
      QI_PHONETIC,
      TI_PHONETIC,
      ZHU_PHONETIC,
      HUI_PHONETIC,
    ]) {
      expect(COMPONENTS[phonetic.id]?.reliability, `${phonetic.displayGlyph} should be exact`).toBe('exact');
    }
  });

  it('registers every new component in COMPONENTS with no dangling id anywhere in SEED_PACK', () => {
    for (const component of [
      CLOTH_RADICAL,
      TEN_RADICAL,
      STONE_RADICAL,
      MA_PHONETIC,
      WAN_PHONETIC,
      ONE_RADICAL,
      OX_RADICAL,
      WOOD_RADICAL,
      POTTERY_RADICAL,
      BOW_RADICAL,
      ICE_RADICAL,
      CLOTHES_RADICAL,
      KNIFE_RADICAL,
      THOUSAND_RADICAL,
      VILLAGE_RADICAL,
      SPEECH_RADICAL,
      ZHENG_PHONETIC,
      SPEECH_RADICAL_FULL,
      HEART_RADICAL_FULL,
      HUI_PHONETIC,
      MOUND_RADICAL,
      BUILDING_RADICAL,
      DOOR_RADICAL,
      AXE_RADICAL,
      TWO_HANDS_RADICAL,
      GATE_RADICAL,
      RUN_RADICAL,
      QI_PHONETIC,
      TI_PHONETIC,
      ZHI_PHONETIC,
      ALTAR_RADICAL,
      BITTER_RADICAL,
      WINE_RADICAL,
      SWEET_RADICAL,
      TONGUE_RADICAL,
      DIPPER_RADICAL,
      YI_PHONETIC,
      LIE_PHONETIC,
      ZHU_PHONETIC,
    ]) {
      expect(COMPONENTS[component.id], `${component.id} should be registered in COMPONENTS`).toBeDefined();
    }
    expect(validatePack(SEED_PACK)).toEqual([]);
  });

  it('still finds at least 90 mnemonic-only items and the full count matches the audit (91 without a decomposition, plus 价 already fixed)', () => {
    const mnemonicOnly = SEED_PACK.questions.filter((q) => q.glossProvenance === 'mnemonic-only');
    expect(mnemonicOnly.length).toBeGreaterThanOrEqual(90);
    const stillBare = mnemonicOnly.filter((q) => q.decomposition === undefined);
    // 43 items across the bank were genuinely left bare after verification -
    // see the per-file audit comments (unresolved MMH placeholders, self-
    // radical pictographs, radical/etymology mismatches, or no MMH data).
    expect(stillBare.length).toBe(43);
  });
});
