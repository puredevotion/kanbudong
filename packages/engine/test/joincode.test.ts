import { describe, expect, it } from 'vitest';

import {
  CODE_BITS,
  completeWord,
  createRng,
  decodeJoinCode,
  encodeJoinCode,
  isValidJoinCode,
  normalizeJoinCode,
  randomJoinCode,
  roomIdFromJoinCode,
  WORDLIST,
} from '../src/index.js';

describe('wordlist', () => {
  it('is exactly 1024 unique words, so a code is exactly 40 bits', () => {
    expect(WORDLIST).toHaveLength(1024);
    expect(new Set(WORDLIST).size).toBe(1024);
    expect(CODE_BITS).toBe(40);
  });

  it('contains only lowercase letters, 3 to 4 characters', () => {
    for (const word of WORDLIST) {
      expect(word).toMatch(/^[a-z]{3,4}$/);
    }
  });

  it('spans the alphabet rather than stopping partway', () => {
    const initials = new Set(WORDLIST.map((w) => w[0]));
    expect(initials.size).toBeGreaterThanOrEqual(24);
  });
});

describe('join codes', () => {
  it('round-trips every corner of the space', () => {
    const corners = [0, 1, 1023, 1024, 2 ** CODE_BITS - 1];
    for (const bits of corners) {
      const code = encodeJoinCode(bits);
      expect(code.split('-')).toHaveLength(4);
      expect(decodeJoinCode(code)).toBe(bits);
    }
  });

  it('round-trips a large random sample', () => {
    const rng = createRng('join-code-sample');
    for (let i = 0; i < 2_000; i += 1) {
      // Two 20-bit halves, because rng.int takes a 32-bit-safe bound.
      const bits = rng.int(2 ** 20) * 2 ** 20 + rng.int(2 ** 20);
      expect(decodeJoinCode(encodeJoinCode(bits))).toBe(bits);
    }
  });

  it('rejects out-of-range integers', () => {
    expect(() => encodeJoinCode(-1)).toThrow(RangeError);
    expect(() => encodeJoinCode(2 ** CODE_BITS)).toThrow(RangeError);
    expect(() => encodeJoinCode(1.5)).toThrow(RangeError);
  });

  it('generates valid random codes', () => {
    for (let i = 0; i < 50; i += 1) {
      const code = randomJoinCode();
      expect(isValidJoinCode(code)).toBe(true);
      expect(decodeJoinCode(code)).not.toBeNull();
    }
  });

  it('forgives how a human types a code', () => {
    const code = encodeJoinCode(123_456_789);
    const words = code.split('-');
    expect(normalizeJoinCode(code.toUpperCase())).toBe(code);
    expect(normalizeJoinCode(words.join(' '))).toBe(code);
    expect(normalizeJoinCode(`  ${words.join(', ')}  `)).toBe(code);
    expect(normalizeJoinCode(words.join('_'))).toBe(code);
  });

  it('refuses codes with unknown or missing words', () => {
    expect(normalizeJoinCode('otter-badger-falcon')).toBeNull();
    expect(normalizeJoinCode('otter-badger-falcon-zzzzz')).toBeNull();
    expect(normalizeJoinCode('')).toBeNull();
    expect(isValidJoinCode('frog frog frog frog')).toBe(true);
  });

  it('derives a room id that hides the code', () => {
    const code = encodeJoinCode(42);
    const room = roomIdFromJoinCode(code);
    expect(room).toMatch(/^[a-z2-7]{26}$/);
    // The code must not be recoverable by reading the topic (R-8).
    for (const word of code.split('-')) expect(room).not.toContain(word);
    // Stable across calls, and different for a different code.
    expect(roomIdFromJoinCode(code.toUpperCase().replace(/-/g, ' '))).toBe(room);
    expect(roomIdFromJoinCode(encodeJoinCode(43))).not.toBe(room);
  });

  it('throws on a room id request for a non-code', () => {
    expect(() => roomIdFromJoinCode('not a code')).toThrow(TypeError);
  });

  it('offers completions for a prefix', () => {
    const matches = completeWord(WORDLIST[0]?.slice(0, 2) ?? 'ab', 4);
    expect(matches.length).toBeGreaterThan(0);
    expect(matches.length).toBeLessThanOrEqual(4);
    expect(completeWord('')).toEqual([]);
    expect(completeWord('zzzzzz')).toEqual([]);
  });
});
