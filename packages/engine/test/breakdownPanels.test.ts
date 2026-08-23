import { describe, expect, it } from 'vitest';

import {
  confusablesFor,
  questionById,
  SEED_PACK,
  SIBLING_CAP,
  siblingsSharingComponent,
  validatePack,
  type ContentPack,
  type Question,
} from '../src/index.js';

/**
 * design/cards/README.md "the breakdown is the screen that teaches", steps 3
 * ("the same move again") and 4 ("the confusable"). Both selectors must
 * derive purely from stored pack data - component ids and confusable_with
 * links - never from a substring or glyph match, per the §3.3.4 ruling
 * `DecompositionPanel` itself already holds.
 */
describe('siblingsSharingComponent', () => {
  const organCharacter = (): Question => {
    const q = questionById(SEED_PACK, 'menu-animal-high-3'); // 肝
    if (q === undefined) throw new Error('fixture question missing from seed pack');
    return q;
  };

  it('returns only real pack items that share the same stored semantic_radical', () => {
    const question = organCharacter();
    const radical = question.decomposition?.kind === 'character' ? question.decomposition.semantic_radical : undefined;
    expect(radical).toBeDefined();
    const siblings = siblingsSharingComponent(SEED_PACK, question);
    expect(siblings.length).toBeGreaterThan(0);
    for (const sibling of siblings) {
      expect(SEED_PACK.questions).toContain(sibling);
      expect(sibling.decomposition?.kind).toBe('character');
      if (sibling.decomposition?.kind === 'character') {
        expect(sibling.decomposition.semantic_radical).toBe(radical);
      }
    }
  });

  it('never includes the question itself', () => {
    const question = organCharacter();
    const siblings = siblingsSharingComponent(SEED_PACK, question);
    expect(siblings.some((s) => s.id === question.id)).toBe(false);
  });

  it('respects the documented cap', () => {
    const question = organCharacter();
    const siblings = siblingsSharingComponent(SEED_PACK, question);
    expect(siblings.length).toBeLessThanOrEqual(SIBLING_CAP);
  });

  it('never derives siblings from a substring or glyph match', () => {
    // 血/舌/皮 sit in the same menu-animal category, next to the organ set, and
    // explicitly do NOT carry the meat radical (see menu-animal.ts) - if the
    // selector were doing anything glyph-based rather than reading the stored
    // component id, they would leak in here.
    const question = organCharacter();
    const siblings = siblingsSharingComponent(SEED_PACK, question);
    const bloodTongueSkin = new Set(['血', '舌', '皮']);
    for (const sibling of siblings) {
      expect(bloodTongueSkin.has(sibling.face?.hanzi ?? '')).toBe(false);
    }
  });

  it('returns nothing for a question without a decomposition', () => {
    const noDecomp = SEED_PACK.questions.find((q) => q.decomposition === undefined);
    if (noDecomp === undefined) throw new Error('fixture missing: expected a question with no decomposition');
    expect(siblingsSharingComponent(SEED_PACK, noDecomp)).toEqual([]);
  });
});

describe('fire-radical cooking-method sibling set (decomposition-backfill pass, Aug 2026)', () => {
  it('surfaces at least SIBLING_CAP other fire-radical cooking methods for 炒', () => {
    const chao = questionById(SEED_PACK, 'menu-cooking-mid-1'); // 炒
    if (chao === undefined) throw new Error('fixture question missing from seed pack');
    const siblings = siblingsSharingComponent(SEED_PACK, chao);
    expect(siblings.length).toBe(SIBLING_CAP);
    for (const sibling of siblings) {
      expect(sibling.decomposition?.kind).toBe('character');
      if (sibling.decomposition?.kind === 'character') {
        expect(sibling.decomposition.semantic_radical).toBe(
          chao.decomposition?.kind === 'character' ? chao.decomposition.semantic_radical : undefined,
        );
      }
    }
  });
});

describe('confusablesFor', () => {
  it('resolves confusable_with ids to real pack items', () => {
    const exit = questionById(SEED_PACK, 'transit-platform-low-2'); // 出口
    if (exit === undefined) throw new Error('fixture question missing from seed pack');
    const confusables = confusablesFor(SEED_PACK, exit);
    expect(confusables).toHaveLength(1);
    expect(confusables[0]?.face?.hanzi).toBe('入口');
  });

  it('is symmetric for the tagged pair', () => {
    const entrance = questionById(SEED_PACK, 'transit-platform-low-3'); // 入口
    if (entrance === undefined) throw new Error('fixture question missing from seed pack');
    const confusables = confusablesFor(SEED_PACK, entrance);
    expect(confusables[0]?.face?.hanzi).toBe('出口');
  });

  it('returns nothing for a question with no confusable_with', () => {
    const plain = SEED_PACK.questions.find((q) => q.confusable_with === undefined);
    if (plain === undefined) throw new Error('fixture missing: expected a question with no confusable_with');
    expect(confusablesFor(SEED_PACK, plain)).toEqual([]);
  });

  it('drops dangling ids rather than throwing', () => {
    const fabricated: ContentPack = {
      ...SEED_PACK,
      questions: [
        { ...(SEED_PACK.questions[0] as Question), id: 'fixture-1', confusable_with: ['does-not-exist'] },
      ],
    };
    expect(confusablesFor(fabricated, fabricated.questions[0] as Question)).toEqual([]);
  });
});

describe('confusable-pair backfill (Aug 2026)', () => {
  const hanziOf = (id: string): string | undefined => questionById(SEED_PACK, id)?.face?.hanzi;

  it('tags 特价/特色 bidirectionally as shared-morpheme', () => {
    const teJia = questionById(SEED_PACK, 'market-label-low-1'); // 特价
    const teSe = questionById(SEED_PACK, 'menu-order-high-4'); // 特色
    expect(teJia?.face?.hanzi).toBe('特价');
    expect(teSe?.face?.hanzi).toBe('特色');
    expect(teJia?.confusion_type).toBe('shared-morpheme');
    expect(teSe?.confusion_type).toBe('shared-morpheme');
    expect(confusablesFor(SEED_PACK, teJia as Question).map((q) => q.face?.hanzi)).toEqual(['特色']);
    expect(confusablesFor(SEED_PACK, teSe as Question).map((q) => q.face?.hanzi)).toEqual(['特价']);
  });

  it('tags 冷藏/冷冻 bidirectionally as shared-morpheme', () => {
    const cang = questionById(SEED_PACK, 'market-panel-mid-4'); // 冷藏
    const dong = questionById(SEED_PACK, 'market-panel-mid-5'); // 冷冻
    expect(cang?.face?.hanzi).toBe('冷藏');
    expect(dong?.face?.hanzi).toBe('冷冻');
    expect(confusablesFor(SEED_PACK, cang as Question).map((q) => q.face?.hanzi)).toEqual(['冷冻']);
    expect(confusablesFor(SEED_PACK, dong as Question).map((q) => q.face?.hanzi)).toEqual(['冷藏']);
  });

  it('tags 厕所/洗手间 bidirectionally as meaning-visually-distinct', () => {
    const ceSuo = questionById(SEED_PACK, 'street-trade-low-1'); // 厕所
    const xiShouJian = questionById(SEED_PACK, 'street-trade-low-2'); // 洗手间
    expect(ceSuo?.face?.hanzi).toBe('厕所');
    expect(xiShouJian?.face?.hanzi).toBe('洗手间');
    expect(ceSuo?.confusion_type).toBe('meaning-visually-distinct');
    expect(xiShouJian?.confusion_type).toBe('meaning-visually-distinct');
    expect(confusablesFor(SEED_PACK, ceSuo as Question).map((q) => q.face?.hanzi)).toEqual(['洗手间']);
    expect(confusablesFor(SEED_PACK, xiShouJian as Question).map((q) => q.face?.hanzi)).toEqual(['厕所']);
  });

  it('tags every 停业 occurrence (low/mid/high) against 暂停营业, and back', () => {
    for (const id of ['street-open-low-1', 'street-open-mid-1', 'street-open-high-1']) {
      const q = questionById(SEED_PACK, id);
      expect(q?.face?.hanzi).toBe('停业');
      expect(q?.confusion_type).toBe('shared-morpheme');
      expect(confusablesFor(SEED_PACK, q as Question).map((c) => c.face?.hanzi)).toEqual(['暂停营业']);
    }
    const zanting = questionById(SEED_PACK, 'street-open-mid-4');
    expect(zanting?.face?.hanzi).toBe('暂停营业');
    const back = confusablesFor(SEED_PACK, zanting as Question).map((c) => hanziOf(c.id));
    expect(back).toEqual(['停业', '停业', '停业']);
  });
});

describe('validatePack: confusable_with referential integrity', () => {
  it('flags a dangling confusable_with entry', () => {
    const fabricated: ContentPack = {
      ...SEED_PACK,
      questions: [
        { ...(SEED_PACK.questions[0] as Question), id: 'fixture-1', confusable_with: ['does-not-exist'] },
      ],
    };
    const problems = validatePack(fabricated);
    expect(problems.some((p) => p.includes('unknown confusable_with entry'))).toBe(true);
  });

  it('the real seed pack has no dangling confusable_with entries', () => {
    const problems = validatePack(SEED_PACK);
    expect(problems.some((p) => p.includes('confusable_with'))).toBe(false);
  });
});
