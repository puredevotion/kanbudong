import { describe, expect, it } from 'vitest';

import {
  discriminatingCues,
  GAN_PHONETIC,
  hasSelfExplanationPrompt,
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

describe('discriminatingCues / hasSelfExplanationPrompt', () => {
  it('offers both a meaning and a sound proposition for 肝, which has a hand-verified phonetic hint', () => {
    const gan = SEED_PACK.questions.find(
      (q) => q.decomposition?.kind === 'character' && q.decomposition.hanzi === '肝',
    );
    expect(gan).toBeDefined();
    const cues = discriminatingCues(gan as Question);
    expect(cues.map((c) => c.kind).sort()).toEqual(['phonetic_hint', 'semantic_radical']);
    expect(hasSelfExplanationPrompt(gan as Question)).toBe(true);
  });

  it('yields no prompt for a single-component character with nothing to contrast against', () => {
    const q = baseQuestion({
      decomposition: {
        kind: 'character',
        hanzi: '肚',
        components: [{ componentId: MEAT_RADICAL.id, role: 'meaning' }],
        semantic_radical: MEAT_RADICAL.id,
      },
    });
    expect(discriminatingCues(q)).toHaveLength(1);
    expect(hasSelfExplanationPrompt(q)).toBe(false);
  });

  it('yields no prompt at all for an atomic sign with no decomposition and no confusable', () => {
    const q = baseQuestion({});
    expect(discriminatingCues(q)).toEqual([]);
    expect(hasSelfExplanationPrompt(q)).toBe(false);
  });

  it('withholds an unverified phonetic hint rather than surfacing a wrong-cost cue', () => {
    const q = baseQuestion({
      decomposition: {
        kind: 'character',
        hanzi: '期',
        components: [
          { componentId: MEAT_RADICAL.id, role: 'meaning' },
          { componentId: 'moon-phonetic-unverified', role: 'sound' },
        ],
        semantic_radical: MEAT_RADICAL.id,
      },
    });
    // 'moon-phonetic-unverified' does not resolve through the component table,
    // so its reliability cannot be confirmed - it must not be offered as a cue.
    expect(discriminatingCues(q)).toEqual([{ kind: 'semantic_radical', componentId: MEAT_RADICAL.id }]);
  });

  it('reads a contrast_character proposition from confusable_with', () => {
    const q = baseQuestion({
      confusable_with: ['some-other-question'],
    });
    expect(discriminatingCues(q)).toEqual([
      { kind: 'contrast_character', contrastQuestionId: 'some-other-question' },
    ]);
  });

  it('the hand-verified phonetic hint used above is GAN_PHONETIC with exact reliability', () => {
    expect(GAN_PHONETIC.reliability).toBe('exact');
  });
});
