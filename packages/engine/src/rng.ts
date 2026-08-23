import { sha256Bytes } from './canonical.js';

/**
 * A seeded PRNG, because every peer must derive the same category, the same
 * question and the same option order from the same log with no coordination.
 * `Math.random()` appears nowhere downstream of a game event for that reason.
 *
 * xoshiro128** - small, fast, well-distributed, and trivially portable, which
 * matters more here than cryptographic quality: unpredictability comes from the
 * drawer's nonce (R-10), not from the generator.
 */
export interface Rng {
  /** Raw 32-bit draw. */
  uint32(): number;
  /** Float in [0, 1). */
  next(): number;
  /** Integer in [0, maxExclusive). */
  int(maxExclusive: number): number;
  pick<T>(items: readonly T[]): T;
  /** Fisher-Yates on a copy; the input is never mutated. */
  shuffle<T>(items: readonly T[]): T[];
}

export function createRng(...seedParts: readonly (string | number)[]): Rng {
  const digest = sha256Bytes(seedParts.join(' '));
  let s0 = readU32(digest, 0) || 1;
  let s1 = readU32(digest, 4) || 2;
  let s2 = readU32(digest, 8) || 3;
  let s3 = readU32(digest, 12) || 4;

  const uint32 = (): number => {
    const result = (Math.imul(rotl(Math.imul(s1, 5) >>> 0, 7), 9) >>> 0);
    const t = (s1 << 9) >>> 0;
    s2 = (s2 ^ s0) >>> 0;
    s3 = (s3 ^ s1) >>> 0;
    s1 = (s1 ^ s2) >>> 0;
    s0 = (s0 ^ s3) >>> 0;
    s2 = (s2 ^ t) >>> 0;
    s3 = rotl(s3, 11);
    return result;
  };

  const next = (): number => uint32() / 0x1_0000_0000;

  const int = (maxExclusive: number): number => {
    if (!Number.isFinite(maxExclusive) || maxExclusive <= 0) {
      throw new RangeError(`rng.int needs a positive bound, got ${maxExclusive}`);
    }
    return Math.floor(next() * maxExclusive);
  };

  return {
    uint32,
    next,
    int,
    pick<T>(items: readonly T[]): T {
      if (items.length === 0) throw new RangeError('rng.pick on an empty list');
      return items[int(items.length)] as T;
    },
    shuffle<T>(items: readonly T[]): T[] {
      const out = items.slice();
      for (let i = out.length - 1; i > 0; i -= 1) {
        const j = int(i + 1);
        const a = out[i] as T;
        const b = out[j] as T;
        out[i] = b;
        out[j] = a;
      }
      return out;
    },
  };
}

function rotl(x: number, k: number): number {
  return ((x << k) | (x >>> (32 - k))) >>> 0;
}

function readU32(bytes: Uint8Array, offset: number): number {
  return (
    (((bytes[offset] ?? 0) << 24) |
      ((bytes[offset + 1] ?? 0) << 16) |
      ((bytes[offset + 2] ?? 0) << 8) |
      (bytes[offset + 3] ?? 0)) >>>
    0
  );
}
