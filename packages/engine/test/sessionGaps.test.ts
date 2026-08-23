import { describe, expect, it } from 'vitest';

import { daysBetweenSessions, medianDays, type SessionEvent } from '../src/index.js';

const DAY = 86_400_000;

describe('daysBetweenSessions', () => {
  it('is empty with zero or one session', () => {
    expect(daysBetweenSessions([], 'solo')).toEqual([]);
    expect(daysBetweenSessions([{ mode: 'solo', startedAt: 0 }], 'solo')).toEqual([]);
  });

  it('computes gaps in order, independent of input order, split by mode', () => {
    const events: SessionEvent[] = [
      { mode: 'solo', startedAt: 2 * DAY },
      { mode: 'group', startedAt: 0 },
      { mode: 'solo', startedAt: 0 },
      { mode: 'group', startedAt: 10 * DAY },
    ];
    expect(daysBetweenSessions(events, 'solo')).toEqual([2]);
    expect(daysBetweenSessions(events, 'group')).toEqual([10]);
  });
});

describe('medianDays', () => {
  it('is null with no gaps, never coerced to 0', () => {
    expect(medianDays([])).toBeNull();
  });

  it("matches DESIGN.md §12.2's worked thresholds", () => {
    // "the median multiplayer gap exceeds ~7 days while solo sits under ~3"
    expect(medianDays([8, 9, 10])).toBeGreaterThan(7);
    expect(medianDays([1, 2, 3])).toBeLessThan(3);
  });

  it('averages the two middle values on an even count', () => {
    expect(medianDays([1, 3])).toBe(2);
  });
});
