import { describe, expect, it } from 'vitest';

import {
  acceptFittedParameters,
  buildFsrsTrainingSet,
  default_w,
  FSRS_PARAMETER_COUNT,
  FSRS_REFIT_MIN_NEW_REVIEWS,
  FSRS_REFIT_MIN_REVIEWS,
  gradeFromAnswer,
  ratingForGrade,
  resolveFsrsParameters,
  reviewItem,
  shouldAttemptRefit,
  totalTrainingReviews,
  type RawSoloAttempt,
} from '../src/index.js';

const DAY = 86_400_000;

describe('buildFsrsTrainingSet', () => {
  it('is a faithful reconstruction of the grade reviewItem actually applied', () => {
    // Mirrors apps/pwa/src/screens/Solo.tsx's submit(): grade derived from
    // (correct, priorLastReview === null), exactly as reviewItem saw it live.
    const now = Date.now();
    const seeded = reviewItem(null, gradeFromAnswer(true, true), now - 5 * DAY)!;

    const attempts: RawSoloAttempt[] = [
      { itemId: 'q1', correct: true, timestamp: now - 5 * DAY, priorLastReview: null },
      { itemId: 'q1', correct: true, timestamp: now, priorLastReview: seeded.lastReview },
    ];

    const set = buildFsrsTrainingSet(attempts);
    expect(set).toHaveLength(1);
    expect(set[0]!.itemId).toBe('q1');
    expect(set[0]!.reviews).toEqual([
      { rating: ratingForGrade(gradeFromAnswer(true, true)), elapsedDays: 0 },
      { rating: ratingForGrade(gradeFromAnswer(true, false)), elapsedDays: 5 },
    ]);
  });

  it('grades an incorrect answer as a lapse regardless of encounter history', () => {
    const now = Date.now();
    const set = buildFsrsTrainingSet([
      { itemId: 'q1', correct: false, timestamp: now, priorLastReview: now - DAY },
    ]);
    expect(set[0]!.reviews[0]!.rating).toBe(ratingForGrade('again'));
  });

  it('groups reviews by item and sorts each group chronologically regardless of log order', () => {
    const now = Date.now();
    const attempts: RawSoloAttempt[] = [
      { itemId: 'q2', correct: true, timestamp: now, priorLastReview: now - 2 * DAY },
      { itemId: 'q1', correct: true, timestamp: now - 3 * DAY, priorLastReview: null },
      { itemId: 'q1', correct: true, timestamp: now, priorLastReview: now - 3 * DAY },
    ];
    const set = buildFsrsTrainingSet(attempts);
    const byId = new Map(set.map((item) => [item.itemId, item] as const));
    expect(byId.get('q1')!.reviews.map((r) => r.elapsedDays)).toEqual([0, 3]);
    expect(byId.get('q2')!.reviews).toHaveLength(1);
  });

  it('rounds fractional elapsed time to whole days, per FSRS training granularity', () => {
    const now = Date.now();
    const set = buildFsrsTrainingSet([
      { itemId: 'q1', correct: true, timestamp: now, priorLastReview: now - 2.6 * DAY },
    ]);
    expect(set[0]!.reviews[0]!.elapsedDays).toBe(3);
  });

  it('totalTrainingReviews counts across all items', () => {
    const now = Date.now();
    const set = buildFsrsTrainingSet([
      { itemId: 'q1', correct: true, timestamp: now, priorLastReview: null },
      { itemId: 'q2', correct: true, timestamp: now, priorLastReview: null },
      { itemId: 'q1', correct: true, timestamp: now + DAY, priorLastReview: now },
    ]);
    expect(totalTrainingReviews(set)).toBe(3);
  });
});

describe('shouldAttemptRefit', () => {
  it('never fits below the minimum-review floor, however long that takes to reach', () => {
    expect(shouldAttemptRefit(0, null)).toBe(false);
    expect(shouldAttemptRefit(FSRS_REFIT_MIN_REVIEWS - 1, null)).toBe(false);
  });

  it('attempts a first fit as soon as the floor is crossed', () => {
    expect(shouldAttemptRefit(FSRS_REFIT_MIN_REVIEWS, null)).toBe(true);
  });

  it('does not refit again until enough new reviews accumulate since the last fit', () => {
    const lastFit = { reviewCountAtFit: FSRS_REFIT_MIN_REVIEWS };
    expect(
      shouldAttemptRefit(FSRS_REFIT_MIN_REVIEWS + FSRS_REFIT_MIN_NEW_REVIEWS - 1, lastFit),
    ).toBe(false);
    expect(shouldAttemptRefit(FSRS_REFIT_MIN_REVIEWS + FSRS_REFIT_MIN_NEW_REVIEWS, lastFit)).toBe(
      true,
    );
  });
});

describe('acceptFittedParameters', () => {
  it('accepts a well-formed 21-parameter vector', () => {
    const candidate = Array.from(default_w);
    expect(acceptFittedParameters(candidate)).toEqual(candidate);
  });

  it('rejects a vector of the wrong length', () => {
    expect(acceptFittedParameters([1, 2, 3])).toBeNull();
  });

  it('rejects a vector containing NaN or Infinity from a degenerate fit', () => {
    const bad = Array.from(default_w);
    bad[3] = Number.NaN;
    expect(acceptFittedParameters(bad)).toBeNull();
    const bad2 = Array.from(default_w);
    bad2[3] = Number.POSITIVE_INFINITY;
    expect(acceptFittedParameters(bad2)).toBeNull();
  });

  it('validates against the same length default_w actually has', () => {
    expect(default_w.length).toBe(FSRS_PARAMETER_COUNT);
  });
});

describe('resolveFsrsParameters', () => {
  it('falls back to default_w when no personal fit exists yet — the common case for weeks', () => {
    expect(resolveFsrsParameters(null)).toBe(default_w);
  });

  it('uses the personal fit once one exists', () => {
    const w = Array.from(default_w);
    const fit = { w, fittedAt: Date.now(), reviewCount: FSRS_REFIT_MIN_REVIEWS };
    expect(resolveFsrsParameters(fit)).toBe(w);
  });
});
