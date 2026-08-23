import { describe, expect, it } from 'vitest';

import { gradeFromAnswer, isDue, retrievability, reviewItem, TARGET_RETENTION } from '../src/index.js';

const DAY = 86_400_000;

describe('retrievability', () => {
  it('is 0.9 at t = S, by construction', () => {
    expect(retrievability(10, 10)).toBeCloseTo(0.9, 5);
  });

  it('decays towards 0 as elapsed time grows', () => {
    const soon = retrievability(1, 10);
    const later = retrievability(30, 10);
    expect(later).toBeLessThan(soon);
    expect(later).toBeGreaterThan(0);
  });

  it('is 1 at zero elapsed time', () => {
    expect(retrievability(0, 10)).toBeCloseTo(1, 10);
  });
});

describe('reviewItem', () => {
  it('seeds a new item on first review', () => {
    const now = Date.now();
    const memory = reviewItem(null, 'good', now);
    expect(memory).not.toBeNull();
    expect(memory?.lastReview).toBe(now);
    expect(memory?.stability).toBeGreaterThan(0);
  });

  it('shrinks stability and raises difficulty on a lapse', () => {
    const now = Date.now();
    const seeded = reviewItem(null, 'good', now - 10 * DAY);
    const lapsed = reviewItem(seeded, 'again', now);
    expect(lapsed?.stability).toBeLessThan(seeded!.stability);
    expect(lapsed?.difficulty).toBeGreaterThan(seeded!.difficulty);
  });

  it('grows stability more on a good recall of a nearly-forgotten item than a fresh one', () => {
    const now = Date.now();
    const seeded = reviewItem(null, 'good', now - 1 * DAY);
    const nearlyForgotten = reviewItem(seeded, 'good', now - 1 * DAY + 20 * DAY);
    const stillFresh = reviewItem(seeded, 'good', now - 1 * DAY + 0.01 * DAY);
    expect(nearlyForgotten!.stability).toBeGreaterThan(stillFresh!.stability);
  });

  it('grades a first-ever correct as Hard, not Good, per §6.3', () => {
    const now = Date.now();
    const hard = reviewItem(null, gradeFromAnswer(true, true), now);
    const good = reviewItem(null, gradeFromAnswer(true, false), now);
    expect(hard!.stability).toBeLessThan(good!.stability);
  });

  it('never changes stability or difficulty on an exposure-role review', () => {
    const now = Date.now();
    const seeded = reviewItem(null, 'good', now - 5 * DAY)!;
    const afterScaffolded = reviewItem(seeded, 'good', now, 'exposure');
    expect(afterScaffolded).toEqual(seeded);
  });

  it('leaves an unseen item unseen when its only response is an exposure', () => {
    const now = Date.now();
    expect(reviewItem(null, 'good', now, 'exposure')).toBeNull();
  });
});

describe('isDue', () => {
  it('is always due when never reviewed', () => {
    expect(isDue(null, Date.now())).toBe(true);
  });

  it('is not due immediately after a review', () => {
    const now = Date.now();
    const memory = reviewItem(null, 'good', now);
    expect(isDue(memory, now)).toBe(false);
  });

  it('becomes due once retrievability decays under target', () => {
    const now = Date.now();
    const memory = reviewItem(null, 'good', now - 1000 * DAY);
    expect(isDue(memory, now)).toBe(true);
  });

  it('shares its default target with the FSRS request-retention config (§11.8)', () => {
    expect(TARGET_RETENTION).toBe(0.9);
  });
});

describe('gradeFromAnswer', () => {
  it('grades an incorrect answer as a lapse regardless of encounter history', () => {
    expect(gradeFromAnswer(false, true)).toBe('again');
    expect(gradeFromAnswer(false, false)).toBe('again');
  });

  it('treats a first-ever correct as weaker evidence than a review correct', () => {
    expect(gradeFromAnswer(true, true)).toBe('hard');
    expect(gradeFromAnswer(true, false)).toBe('good');
  });
});
