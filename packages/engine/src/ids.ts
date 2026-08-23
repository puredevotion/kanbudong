import { randomBytes } from '@noble/hashes/utils.js';

import { shortId, toBase32 } from './canonical.js';
import type { GameId, TeamId } from './types.js';

/**
 * Ids are hashes of what makes them unique rather than counters, because there
 * is no allocator: two devices must be able to mint ids simultaneously without
 * a chance of collision and without asking anyone.
 */
export function newGameId(hostId: string, joinCode: string, salt = randomHex(8)): GameId {
  return shortId('game', `${hostId}|${joinCode}|${salt}`, 10);
}

export function newTeamId(gameId: GameId, name: string, salt = randomHex(4)): TeamId {
  return shortId('team', `${gameId}|${name}|${salt}`, 6);
}

/** Hex string of `bytes` random bytes. Used for turn nonces and id salts. */
export function randomHex(bytes: number): string {
  const out = randomBytes(bytes);
  let hex = '';
  for (const byte of out) hex += byte.toString(16).padStart(2, '0');
  return hex;
}

/**
 * The drawer's nonce (R-10). Sixteen bytes: far more than needed to stop a
 * precomputation, and small enough to gossip on every turn.
 */
export function newTurnNonce(): string {
  return randomHex(16);
}

export function shortenId(id: string, keep = 4): string {
  const body = id.includes('_') ? (id.split('_')[1] ?? id) : id;
  return body.slice(0, keep);
}

export { toBase32 };
