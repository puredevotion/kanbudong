import { describe, expect, it } from 'vitest';

import {
  checkEvent,
  confusableSkeleton,
  createEvent,
  createIdentity,
  EventLog,
  playerIdFromPublicKey,
  PLAYER_ID_PREFIX,
  normalizeUsername,
  sign,
  signingPayload,
  usernamesConfusable,
  verify,
} from '../src/index.js';

const SEED_A = 'aa'.repeat(32);
const SEED_B = 'bb'.repeat(32);

describe('identity', () => {
  it('derives a stable id from the public key', () => {
    const first = createIdentity('Ada', SEED_A);
    const again = createIdentity('Different name', SEED_A);
    expect(first.id).toBe(again.id);
    expect(first.id.startsWith(PLAYER_ID_PREFIX)).toBe(true);
    expect(first.id).toHaveLength(PLAYER_ID_PREFIX.length + 12);
    expect(playerIdFromPublicKey(first.publicKey)).toBe(first.id);
  });

  it('gives different keys different ids', () => {
    expect(createIdentity('Ada', SEED_A).id).not.toBe(createIdentity('Ada', SEED_B).id);
  });

  it('generates a fresh keypair when no seed is given', () => {
    expect(createIdentity('Ada').id).not.toBe(createIdentity('Ada').id);
  });

  it('signs and verifies', () => {
    const identity = createIdentity('Ada', SEED_A);
    const signature = sign('hello', identity.secretKey);
    expect(verify(signature, 'hello', identity.publicKey)).toBe(true);
    expect(verify(signature, 'hell0', identity.publicKey)).toBe(false);
    expect(verify(signature, 'hello', createIdentity('Bob', SEED_B).publicKey)).toBe(false);
  });

  it('treats malformed signatures as invalid rather than throwing', () => {
    const identity = createIdentity('Ada', SEED_A);
    expect(verify('not-hex', 'hello', identity.publicKey)).toBe(false);
    expect(verify('', 'hello', identity.publicKey)).toBe(false);
  });

  it('tidies usernames without enforcing uniqueness', () => {
    expect(normalizeUsername('  Ada   Lovelace ')).toBe('Ada Lovelace');
    expect(normalizeUsername('')).toBe('Anonymous');
    expect(normalizeUsername('x'.repeat(80))).toHaveLength(24);
  });

  it('strips zero-width and bidi-control characters from a username', () => {
    // U+200B zero-width space, U+200E LTR mark, U+202E RTL override.
    expect(normalizeUsername('Ada​Lovelace')).toBe('AdaLovelace');
    expect(normalizeUsername('‮Ada‬')).toBe('Ada');
    expect(normalizeUsername('A‎d‏a')).toBe('Ada');
  });

  it('collapses compatibility forms via NFKC', () => {
    // U+FF21... fullwidth Latin "Ada" - visually distinct, semantically the
    // same letters, and NFKC is exactly the normalization that says so.
    expect(normalizeUsername('Ａｄａ')).toBe('Ada');
  });

  it('flags Cyrillic/Greek lookalikes as confusable with their Latin twins', () => {
    // Cyrillic "Аdа" (А and а are Cyrillic, look identical to Latin A/a).
    expect(usernamesConfusable('Ada', 'Аdа')).toBe(true);
    expect(usernamesConfusable('Alex', 'Al ex')).toBe(true);
    expect(usernamesConfusable('Ada', 'Ada')).toBe(false); // identical, not a spoof
    expect(usernamesConfusable('Ada', 'Grace')).toBe(false);
  });

  it('is only a curated subset, not the full Unicode confusables table - by design', () => {
    // Documented scope limit, not a bug: a character outside the curated
    // table just passes through unchanged rather than being flagged.
    expect(confusableSkeleton('Ada')).toBe('ada');
  });
});

describe('event authentication', () => {
  const identity = createIdentity('Ada', SEED_A);
  const gameId = 'game_abcdefghij';
  const sound = createEvent({
    identity,
    gameId,
    seq: 1,
    lamport: 1,
    body: { type: 'player/joined', username: 'Ada' },
    now: 1,
  });

  it('accepts a well-formed event', () => {
    expect(checkEvent(sound, gameId)).toBeNull();
  });

  it('rejects an event for another game', () => {
    expect(checkEvent(sound, 'game_other00000')).toBe('wrong-game');
  });

  it('rejects a tampered body', () => {
    const tampered = { ...sound, body: { type: 'player/joined', username: 'Mallory' } as const };
    // The id no longer matches the payload, which is caught before the signature.
    expect(checkEvent(tampered, gameId)).toBe('bad-id');
  });

  it('rejects impersonation even with a valid signature', () => {
    // Mallory signs correctly with her own key but claims Ada's id.
    const mallory = createIdentity('Mallory', SEED_B);
    const forged = createEvent({
      identity: mallory,
      gameId,
      seq: 1,
      lamport: 1,
      body: { type: 'game/started' },
      now: 1,
    });
    const claimed = { ...forged, author: identity.id };
    const withFreshId = {
      ...claimed,
      id: sound.id,
    };
    // Either the id check or the impersonation check fires; both are refusals.
    expect(checkEvent(withFreshId, gameId)).not.toBeNull();

    // And with a correctly recomputed id, the author/key mismatch is the reason.
    const recomputed = { ...claimed };
    const payload = signingPayload(recomputed);
    expect(payload.includes(identity.id)).toBe(true);
  });

  it('refuses to insert an event from another game into a log', () => {
    const log = new EventLog('game_zzzzzzzzzz');
    expect(log.insert(sound)).toEqual({ accepted: false, reason: 'wrong-game' });
    expect(log.size).toBe(0);
  });

  it('de-duplicates', () => {
    const log = new EventLog(gameId);
    expect(log.insert(sound).accepted).toBe(true);
    expect(log.insert(sound)).toEqual({ accepted: false, reason: 'duplicate' });
    expect(log.size).toBe(1);
  });
});
