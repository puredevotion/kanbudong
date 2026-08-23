import { describe, expect, it } from 'vitest';

import {
  GAN_PHONETIC,
  hasLociMnemonicPrompt,
  lociTiles,
  MEAT_RADICAL,
  SEED_PACK,
  type Question,
} from '../src/index.js';

function baseQuestion(overrides: Partial<Question>): Question {
  return {
    id: 'test-low-1',
    category: 'menu-animal',
    difficulty: 'low',
    prompt: 'p',
    options: ['a', 'b', 'c'],
    answer: 0,
    explanation: 'e',
    ...overrides,
  };
}

describe('lociTiles / hasLociMnemonicPrompt', () => {
  it('gives 肝 two named positions from its real left-right decomposition', () => {
    const gan = SEED_PACK.questions.find(
      (q) => q.decomposition?.kind === 'character' && q.decomposition.hanzi === '肝',
    );
    expect(gan).toBeDefined();
    const tiles = lociTiles(gan as Question);
    expect(tiles).toEqual([
      { componentId: MEAT_RADICAL.id, role: 'semantic', position: 'left' },
      { componentId: GAN_PHONETIC.id, role: 'phonetic', position: 'right' },
    ]);
    expect(hasLociMnemonicPrompt(gan as Question)).toBe(true);
  });

  it('yields no prompt for a single-component character - nothing to place in a second position', () => {
    const q = baseQuestion({
      face: { hanzi: '肚', pinyin: 'dǔ', nl: 'pens', structure: 'left-right' },
      decomposition: {
        kind: 'character',
        hanzi: '肚',
        components: [{ componentId: MEAT_RADICAL.id, role: 'semantic' }],
        semantic_radical: MEAT_RADICAL.id,
      },
    });
    expect(lociTiles(q)).toBeUndefined();
    expect(hasLociMnemonicPrompt(q)).toBe(false);
  });

  it('places a top-bottom decomposition\'s two components at top and bottom', () => {
    const q = baseQuestion({
      face: { hanzi: '肾', pinyin: 'shèn', nl: 'nier', structure: 'top-bottom' },
      decomposition: {
        kind: 'character',
        hanzi: '肾',
        components: [
          { componentId: MEAT_RADICAL.id, role: 'semantic' },
          { componentId: GAN_PHONETIC.id, role: 'phonetic' },
        ],
        semantic_radical: MEAT_RADICAL.id,
      },
    });
    expect(lociTiles(q)).toEqual([
      { componentId: MEAT_RADICAL.id, role: 'semantic', position: 'top' },
      { componentId: GAN_PHONETIC.id, role: 'phonetic', position: 'bottom' },
    ]);
  });

  it('withholds a prompt for an enclosure/atomic/unset structure - no honest two-slot layout to offer', () => {
    const withoutStructure = baseQuestion({
      decomposition: {
        kind: 'character',
        hanzi: '肝',
        components: [
          { componentId: MEAT_RADICAL.id, role: 'semantic' },
          { componentId: GAN_PHONETIC.id, role: 'phonetic' },
        ],
        semantic_radical: MEAT_RADICAL.id,
      },
    });
    expect(lociTiles(withoutStructure)).toBeUndefined();

    const enclosure = baseQuestion({
      face: { hanzi: '国', pinyin: 'guó', nl: 'land', structure: 'enclosure' },
      decomposition: {
        kind: 'character',
        hanzi: '国',
        components: [
          { componentId: MEAT_RADICAL.id, role: 'semantic' },
          { componentId: GAN_PHONETIC.id, role: 'phonetic' },
        ],
      },
    });
    expect(lociTiles(enclosure)).toBeUndefined();
  });

  it('yields no prompt at all for an atomic sign with no decomposition, and for a word-level decomposition', () => {
    expect(lociTiles(baseQuestion({}))).toBeUndefined();
    expect(
      lociTiles(
        baseQuestion({
          decomposition: {
            kind: 'word',
            hanzi: '牛肉',
            morphemes: [
              { span: '牛', gloss: 'beef' },
              { span: '肉', gloss: 'meat' },
            ],
          },
        }),
      ),
    ).toBeUndefined();
  });
});
