import { describe, expect, it } from 'vitest';

import { createRng } from '../src/index.js';

describe('seeded rng', () => {
  it('is reproducible for the same seed', () => {
    const a = createRng('seed', 1, 'x');
    const b = createRng('seed', 1, 'x');
    for (let i = 0; i < 100; i += 1) expect(a.uint32()).toBe(b.uint32());
  });

  it('diverges for different seeds', () => {
    const a = createRng('seed-a');
    const b = createRng('seed-b');
    const left = Array.from({ length: 20 }, () => a.uint32());
    const right = Array.from({ length: 20 }, () => b.uint32());
    expect(left).not.toEqual(right);
  });

  it('produces 32-bit unsigned integers', () => {
    const rng = createRng('range');
    for (let i = 0; i < 5_000; i += 1) {
      const value = rng.uint32();
      expect(Number.isInteger(value)).toBe(true);
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(2 ** 32);
    }
  });

  it('keeps next() inside [0, 1)', () => {
    const rng = createRng('unit');
    for (let i = 0; i < 5_000; i += 1) {
      const value = rng.next();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });

  it('spreads int() roughly evenly across buckets', () => {
    const rng = createRng('buckets');
    const counts = new Array<number>(10).fill(0);
    const draws = 100_000;
    for (let i = 0; i < draws; i += 1) {
      const bucket = rng.int(10);
      counts[bucket] = (counts[bucket] ?? 0) + 1;
    }
    for (const count of counts) {
      // A fair generator lands well inside +/-15% of a tenth over 100k draws.
      expect(count).toBeGreaterThan(draws / 10 * 0.85);
      expect(count).toBeLessThan(draws / 10 * 1.15);
    }
  });

  it('rejects a non-positive bound', () => {
    const rng = createRng('bound');
    expect(() => rng.int(0)).toThrow(RangeError);
    expect(() => rng.int(-3)).toThrow(RangeError);
  });

  it('shuffles without mutating the input and keeps every element', () => {
    const rng = createRng('shuffle');
    const input = Object.freeze([1, 2, 3, 4, 5, 6, 7, 8]);
    const out = rng.shuffle(input);
    expect(out).toHaveLength(input.length);
    expect([...out].sort((a, b) => a - b)).toEqual([...input]);
    expect(input).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it('actually permutes rather than returning the input order', () => {
    const rng = createRng('permute');
    const source = Array.from({ length: 20 }, (_, i) => i);
    let differed = 0;
    for (let i = 0; i < 20; i += 1) {
      if (rng.shuffle(source).join() !== source.join()) differed += 1;
    }
    expect(differed).toBe(20);
  });

  it('throws when picking from nothing', () => {
    expect(() => createRng('empty').pick([])).toThrow(RangeError);
  });
});
