import { describe, expect, it } from 'vitest';

import { NEW_ITEM_THETA, updateItemDifficulty } from '../src/index.js';

describe('updateItemDifficulty', () => {
  it('seeds a new item at the neutral reference difficulty', () => {
    const updated = updateItemDifficulty(null, true);
    expect(updated.n).toBe(1);
    expect(updated.theta).toBeLessThan(NEW_ITEM_THETA);
  });

  it('raises theta (harder) on an incorrect answer', () => {
    const seeded = updateItemDifficulty(null, true);
    const missed = updateItemDifficulty(seeded, false);
    expect(missed.theta).toBeGreaterThan(seeded.theta);
  });

  it('shrinks the update step as n grows, per K = 0.4/(1+0.05n)', () => {
    let item = updateItemDifficulty(null, false);
    const firstStep = item.theta - NEW_ITEM_THETA;
    for (let i = 0; i < 20; i++) item = updateItemDifficulty(item, false);
    const laterStep = updateItemDifficulty(item, false).theta - item.theta;
    expect(Math.abs(laterStep)).toBeLessThan(Math.abs(firstStep));
  });
});
