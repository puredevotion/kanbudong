import { describe, expect, it } from 'vitest';

import {
  deriveComponentCharIds,
  expand,
  isSpanEligible,
  SEED_PACK,
  type CategoryContent,
  type Question,
} from '../src/index.js';

function charQuestion(hanzi: string, id: string): Question {
  return {
    id,
    category: 'menu-cooking',
    difficulty: 'low',
    prompt: `What does ${hanzi} mean?`,
    options: ['right', 'w1', 'w2'],
    answer: 0,
    explanation: 'because',
    face: { hanzi, pinyin: 'x', nl: 'x' },
  };
}

describe('deriveComponentCharIds', () => {
  it('resolves a word span\'s morphemes to the matching single-character questions', () => {
    const qi1 = charQuestion('期', 'menu-cooking-low-1');
    const qi2 = charQuestion('保', 'menu-cooking-low-2');
    const qi3 = charQuestion('质', 'menu-cooking-low-3');
    const word: Question = {
      id: 'market-panel-low-1',
      category: 'market-panel',
      difficulty: 'low',
      prompt: 'What does 保质期 mean?',
      options: ['shelf life', 'w1', 'w2'],
      answer: 0,
      explanation: 'because',
      face: { hanzi: '保质期', pinyin: 'bǎozhìqī', nl: 'houdbaarheidsduur' },
      decomposition: {
        kind: 'word',
        hanzi: '保质期',
        morphemes: [
          { span: '保', gloss: 'guarantee' },
          { span: '质', gloss: 'quality' },
          { span: '期', gloss: 'period' },
        ],
      },
    };

    const derived = deriveComponentCharIds([qi1, qi2, qi3, word]);
    expect(derived.get('market-panel-low-1')).toEqual([qi2.id, qi3.id, qi1.id]);
  });

  it('credits the same character node from two different containing spans (期 via 保质期 and 星期)', () => {
    const qi = charQuestion('期', 'menu-cooking-low-1');
    const baozhiqi: Question = {
      id: 'market-panel-low-1',
      category: 'market-panel',
      difficulty: 'low',
      prompt: 'p1',
      options: ['a', 'b', 'c'],
      answer: 0,
      explanation: 'e',
      face: { hanzi: '保质期', pinyin: 'bǎozhìqī', nl: 'x' },
      decomposition: { kind: 'word', hanzi: '保质期', morphemes: [{ span: '期', gloss: 'period' }] },
    };
    const xingqi: Question = {
      id: 'transit-platform-low-1',
      category: 'transit-platform',
      difficulty: 'low',
      prompt: 'p2',
      options: ['a', 'b', 'c'],
      answer: 0,
      explanation: 'e',
      face: { hanzi: '星期', pinyin: 'xīngqī', nl: 'x' },
      decomposition: { kind: 'word', hanzi: '星期', morphemes: [{ span: '期', gloss: 'period' }] },
    };

    const derived = deriveComponentCharIds([qi, baozhiqi, xingqi]);
    expect(derived.get('market-panel-low-1')).toEqual([qi.id]);
    expect(derived.get('transit-platform-low-1')).toEqual([qi.id]);
  });

  it('omits a morpheme with no matching single-character question rather than erroring', () => {
    const word: Question = {
      id: 'market-panel-low-1',
      category: 'market-panel',
      difficulty: 'low',
      prompt: 'p',
      options: ['a', 'b', 'c'],
      answer: 0,
      explanation: 'e',
      face: { hanzi: '净含量', pinyin: 'jìnghánliàng', nl: 'x' },
      decomposition: { kind: 'word', hanzi: '净含量', morphemes: [{ span: '净', gloss: 'net' }] },
    };
    const derived = deriveComponentCharIds([word]);
    expect(derived.has('market-panel-low-1')).toBe(false);
  });
});

describe('isSpanEligible', () => {
  const wordQuestion: Question = {
    id: 'market-panel-low-1',
    category: 'market-panel',
    difficulty: 'low',
    prompt: 'p',
    options: ['a', 'b', 'c'],
    answer: 0,
    explanation: 'e',
    face: { hanzi: '保质期', pinyin: 'bǎozhìqī', nl: 'x' },
    component_char_ids: ['保', '质', '期'],
  };

  it('is eligible once every component character is introduced', () => {
    const introduced = new Set(['保', '质', '期']);
    expect(isSpanEligible(wordQuestion, (id) => introduced.has(id))).toBe(true);
  });

  it('is not eligible while any component character remains un-introduced', () => {
    const introduced = new Set(['保', '质']);
    expect(isSpanEligible(wordQuestion, (id) => introduced.has(id))).toBe(false);
  });

  it('is always eligible when there is nothing to gate on', () => {
    const noGate: Question = { ...wordQuestion, component_char_ids: undefined };
    expect(isSpanEligible(noGate, () => false)).toBe(true);
  });
});

/**
 * DESIGN.md §9.1 coverage audit (Aug 2026): every `WordDecomposition` in the
 * real seed pack previously named morphemes with no matching standalone
 * single-character item, so `component_char_ids` silently resolved to
 * nothing for all ten of them - word decomposition was structurally inert
 * bank-wide, not a few edge cases. This guards the fix: every one of those
 * ten words must now resolve a non-empty `component_char_ids` on the actual
 * built pack, not just on hand-built fixtures.
 */
describe('word decomposition resolves against the real seed pack (eligibility-gap backfill, Aug 2026)', () => {
  const previouslyInert: readonly [id: string, hanzi: string][] = [
    ['market-checkout-mid-3', '收银台'],
    ['market-checkout-mid-4', '结账'],
    ['street-trade-low-2', '洗手间'],
    ['street-trade-mid-1', '药店'],
    ['street-trade-mid-4', '邮局'],
    ['street-trade-mid-6', '快递'],
    ['street-trade-mid-8', '停车场'],
    ['transit-platform-mid-1', '地铁'],
    ['transit-ticket-high-1', '高铁'],
    ['transit-ticket-high-2', '火车'],
  ];

  const derived = deriveComponentCharIds(SEED_PACK.questions);

  it('resolves a non-empty component_char_ids for every previously-inert word', () => {
    for (const [id, hanzi] of previouslyInert) {
      const ids = derived.get(id);
      expect(ids, `${id} (${hanzi}) should resolve at least one component character`).toBeDefined();
      expect(ids?.length ?? 0, `${id} (${hanzi}) resolved zero components`).toBeGreaterThan(0);
    }
  });

  it('resolves one component id per morpheme, none of them dangling', () => {
    const byId = new Map(SEED_PACK.questions.map((q) => [q.id, q] as const));
    for (const [id] of previouslyInert) {
      const word = byId.get(id);
      if (word?.decomposition?.kind !== 'word') throw new Error(`fixture missing: ${id}`);
      const ids = derived.get(id) ?? [];
      expect(ids.length).toBe(word.decomposition.morphemes.length);
      for (const charId of ids) {
        expect(byId.has(charId), `${charId} should be a real question in the pack`).toBe(true);
      }
    }
  });

  it('carries the same component_char_ids on the built SEED_PACK questions themselves', () => {
    for (const [id] of previouslyInert) {
      const word = SEED_PACK.questions.find((q) => q.id === id);
      expect(word?.component_char_ids?.length ?? 0, `${id} should carry component_char_ids`).toBeGreaterThan(0);
    }
  });
});

describe('expand output feeds deriveComponentCharIds unchanged', () => {
  it('exercises the authoring pipeline shape, not just hand-built Question objects', () => {
    const chunk: CategoryContent = {
      low: [
        ['p', ['a', 'b', 'c'], 0, 'e', { hanzi: '期', pinyin: 'qī', nl: 'x' }],
      ],
      mid: [],
      high: [],
    };
    const questions = expand('menu-cooking', chunk);
    const derived = deriveComponentCharIds(questions);
    expect(derived.size).toBe(0);
  });
});
