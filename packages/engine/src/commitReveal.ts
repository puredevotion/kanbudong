import { canonicalJson, sha256Hex } from './canonical.js';

/**
 * Hex-encoded sha256 is always this many characters. Used to sanity-check a
 * `commitHash` field's shape before it is trusted as one, the same way
 * `turn/drawn`'s nonce gets a length check rather than being taken on faith.
 */
export const COMMIT_HASH_LENGTH = 64;

const HEX_COMMIT_HASH = /^[0-9a-f]{64}$/;

/**
 * The commitment: sha256 of the canonical JSON of `{ payload, salt }`.
 *
 * Reused for both directions - the committer computes this once to publish in
 * `commit/made`, and the reducer recomputes it from the `commit/revealed`
 * that follows to check the two match (see apply() in reducer.ts). Routing
 * through `canonicalJson` rather than `JSON.stringify` directly is what makes
 * the hash agree across peers regardless of key order, same as every other
 * hash in this protocol.
 *
 * This is honesty-assuming secrecy, not cryptographic secrecy: there is no
 * server, so nothing stops the committing client itself from having peeked
 * at `payload` before ever calling this function. What it buys is that every
 * *other* peer can trust the payload was fixed at commit time rather than
 * chosen after the fact - the same raised-not-eliminated cheating cost as
 * R-10's drawer nonce.
 */
export function commitHash(payload: unknown, salt: string): string {
  return sha256Hex(canonicalJson({ payload, salt }));
}

/** Shape check only - does not imply the hash was honestly derived from anything. */
export function isWellFormedCommitHash(value: unknown): value is string {
  return typeof value === 'string' && HEX_COMMIT_HASH.test(value);
}
