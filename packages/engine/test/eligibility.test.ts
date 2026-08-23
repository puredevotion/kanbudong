import { describe, expect, it } from 'vitest';

import {
  deriveComponentCharIds,
  expand,
  isSpanEligible,
  type CategoryContent,
  type Question,
} from '../src/index.js';

function charQuestion(hanzi: string, id: string): Question {
  return {
    id,
    category: 'menu-cooking',
    difficulty: 'low',
    prompt: `What does ${hanzi} mean?`,
    options: ['right', 'w1', 'w2', 'w3'],
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
      options: ['shelf life', 'w1', 'w2', 'w3'],
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
      options: ['a', 'b', 'c', 'd'],
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
      options: ['a', 'b', 'c', 'd'],
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
      options: ['a', 'b', 'c', 'd'],
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
    options: ['a', 'b', 'c', 'd'],
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

describe('expand output feeds deriveComponentCharIds unchanged', () => {
  it('exercises the authoring pipeline shape, not just hand-built Question objects', () => {
    const chunk: CategoryContent = {
      low: [
        ['p', ['a', 'b', 'c', 'd'], 0, 'e', { hanzi: '期', pinyin: 'qī', nl: 'x' }],
      ],
      mid: [],
      high: [],
    };
    const questions = expand('menu-cooking', chunk);
    const derived = deriveComponentCharIds(questions);
    expect(derived.size).toBe(0);
  });
});
