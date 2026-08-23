import { randomBytes } from '@noble/hashes/utils.js';

import { sha256Bytes, toBase32 } from './canonical.js';
import { CODE_BITS, WORD_BITS, WORDLIST, WORDS_PER_CODE, wordIndex } from './wordlist.js';

/**
 * Four lowercase words, e.g. `amber-otter-glass-tide`.
 *
 * Chosen over a random string because the code has to survive being shouted
 * across a table. 1024 words x 4 = 40 bits: far too many to guess, few enough
 * to say out loud.
 */
export const JOIN_CODE_SEPARATOR = '-';

/** Namespace for the relay topic. Bump this and every old code stops resolving. */
export const PROTOCOL_NAMESPACE = 'dohhh:v1';

export function randomJoinCode(): string {
  // 40 bits of CSPRNG output, read big-endian out of 5 bytes.
  const bytes = randomBytes(5);
  let bits = 0;
  for (let i = 0; i < 5; i += 1) bits = bits * 256 + (bytes[i] ?? 0);
  return encodeJoinCode(bits);
}

/** Encode a 40-bit integer as four words. Most-significant word first. */
export function encodeJoinCode(bits: number): string {
  if (!Number.isInteger(bits) || bits < 0 || bits >= 2 ** CODE_BITS) {
    throw new RangeError(`join code needs a ${CODE_BITS}-bit integer, got ${bits}`);
  }
  const words: string[] = [];
  let remaining = bits;
  for (let i = 0; i < WORDS_PER_CODE; i += 1) {
    const shift = 2 ** (WORD_BITS * (WORDS_PER_CODE - 1 - i));
    const index = Math.floor(remaining / shift);
    remaining -= index * shift;
    words.push(WORDLIST[index] as string);
  }
  return words.join(JOIN_CODE_SEPARATOR);
}

/** Inverse of {@link encodeJoinCode}; `null` for anything not a valid code. */
export function decodeJoinCode(code: string): number | null {
  const words = splitCode(code);
  if (words.length !== WORDS_PER_CODE) return null;
  let bits = 0;
  for (const word of words) {
    const index = wordIndex(word);
    if (index === undefined) return null;
    bits = bits * 2 ** WORD_BITS + index;
  }
  return bits;
}

/**
 * Forgiving input handling: people type spaces, capitals, commas and stray
 * punctuation. Anything that survives is a canonical code or nothing.
 */
export function normalizeJoinCode(input: string): string | null {
  const words = splitCode(input);
  if (words.length !== WORDS_PER_CODE) return null;
  if (words.some((w) => wordIndex(w) === undefined)) return null;
  return words.join(JOIN_CODE_SEPARATOR);
}

export function isValidJoinCode(input: string): boolean {
  return normalizeJoinCode(input) !== null;
}

/**
 * The topic used on public discovery infrastructure.
 *
 * Deliberately a hash and not the code itself (R-8): peers watching public
 * relays see opaque topics, so a code cannot be harvested and squatted. Knowing
 * the room id does not yield the code, and every game event is signed, so an
 * uninvited peer can occupy a room but cannot forge a score.
 */
export function roomIdFromJoinCode(code: string): string {
  const canonical = normalizeJoinCode(code);
  if (canonical === null) throw new TypeError(`not a join code: ${code}`);
  return toBase32(sha256Bytes(`${PROTOCOL_NAMESPACE}:room:${canonical}`)).slice(0, 26);
}

/**
 * Words are typed one at a time on a phone keyboard, so offer completions.
 * Returns at most `limit` matches for a prefix.
 */
export function completeWord(prefix: string, limit = 6): string[] {
  const needle = prefix.trim().toLowerCase();
  if (needle.length === 0) return [];
  const out: string[] = [];
  for (const word of WORDLIST) {
    if (word.startsWith(needle)) {
      out.push(word);
      if (out.length >= limit) break;
    }
  }
  return out;
}

function splitCode(input: string): string[] {
  return input
    .toLowerCase()
    .split(/[^a-z]+/)
    .filter((part) => part.length > 0);
}
