import { describe, expect, it } from 'vitest';

import { summarizeMnemonicPromptUsage, type MnemonicPromptEvent } from '../src/index.js';

describe('summarizeMnemonicPromptUsage', () => {
  it('counts every kind, including zero-count kinds, so a zero reads as zero not as a missing key', () => {
    const events: MnemonicPromptEvent[] = [
      { questionId: 'menu-animal-high-3', kind: 'loci', at: 1 },
      { questionId: 'menu-animal-high-3', kind: 'self_explanation', at: 2 },
      { questionId: 'menu-animal-high-1', kind: 'none', at: 3 },
      { questionId: 'menu-animal-high-2', kind: 'loci', at: 4 },
    ];
    expect(summarizeMnemonicPromptUsage(events)).toEqual({ self_explanation: 1, loci: 2, none: 1 });
  });

  it('returns all-zero counts for an empty stream, distinguishing "no data yet" from any real outcome', () => {
    expect(summarizeMnemonicPromptUsage([])).toEqual({ self_explanation: 0, loci: 0, none: 0 });
  });
});
