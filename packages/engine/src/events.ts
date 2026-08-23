import { canonicalJson, sha256Hex } from './canonical.js';
import type { Identity } from './identity.js';
import { playerIdFromPublicKey, sign, verify } from './identity.js';
import type { RulesConfig } from './rules.js';
import type { CategoryId, Difficulty, GameId, PlayerId, TeamId } from './types.js';

/**
 * Wire format version. Peers refuse to play across a mismatch rather than
 * discovering the incompatibility on turn nine (R-11).
 *
 * Bumped to 3 for `room/locked` and `player/kicked`: genuinely new,
 * wire-visible event variants (unlike `TurnRecord.chosenText`, which is
 * purely locally reducer-derived and never needed a bump) - an older peer's
 * `apply()` would hit its exhaustiveness `default` case and silently treat
 * either as an unknown-event rejection rather than actually moderating the
 * room, so the mismatch has to be refused at the door instead.
 */
export const PROTOCOL_VERSION = 3;

export type GameEventBody =
  | {
      readonly type: 'game/created';
      readonly name: string;
      readonly joinCode: string;
      readonly rules: RulesConfig;
      /** Content-pack hash. A peer with a different pack is refused at the door. */
      readonly packHash: string;
    }
  | { readonly type: 'player/joined'; readonly username: string }
  | { readonly type: 'team/created'; readonly teamId: TeamId; readonly name: string }
  | { readonly type: 'team/joined'; readonly teamId: TeamId }
  | { readonly type: 'team/left'; readonly teamId: TeamId }
  | { readonly type: 'game/started' }
  /** Published by the drawer, never by the answering team. See R-10. */
  | { readonly type: 'turn/drawn'; readonly turnIndex: number; readonly nonce: string }
  /**
   * The dealing side's pick among the categoryOptions turn/drawn offered.
   * Same "not the acting team" restriction as turn/drawn - it is still the
   * opposing side revealing the category, just from a choice of three now.
   */
  | {
      readonly type: 'turn/category';
      readonly turnIndex: number;
      readonly categoryId: CategoryId;
    }
  | {
      readonly type: 'turn/difficulty';
      readonly turnIndex: number;
      readonly difficulty: Difficulty;
    }
  | {
      readonly type: 'turn/answered';
      readonly turnIndex: number;
      /** Index into the presented (shuffled) option order. */
      readonly chosenIndex: number;
    }
  /** Proposable by any peer, so one locked phone cannot stall the game (R-3). */
  | { readonly type: 'turn/timeout'; readonly turnIndex: number }
  /**
   * Host-only. Blocks brand-new `player/joined` announcements while set -
   * an already-known player (one already in `state.players`, e.g.
   * reconnecting) is never blocked by this, only a stranger nobody has
   * seen yet. The join code alone is otherwise the only access control
   * this game has (see the join-code-is-a-shared-secret design in the
   * README) - this is the host's way to close the door once everyone
   * expected has arrived.
   */
  | { readonly type: 'room/locked'; readonly locked: boolean }
  /**
   * Host-only. Bans `targetId`: every future event that player ever
   * authors (including a re-announcement) is refused from here on (see the
   * banned check at the top of `apply()` in reducer.ts), and they're
   * removed from any team and the spectator list immediately. Their past
   * history (turns already resolved, scores already applied) is not
   * undone - this stops future participation, it does not retroactively
   * erase what already happened, which every peer's log already agrees on.
   */
  | { readonly type: 'player/kicked'; readonly targetId: PlayerId };

export type GameEventType = GameEventBody['type'];

/**
 * An event as it travels between peers.
 *
 * `pub` rides along on every event so verification is stateless: a peer can
 * check a signature from a player whose `player/joined` it has not received
 * yet, which is routine when a backfill arrives out of order.
 */
export interface SignedEvent {
  readonly v: number;
  readonly gameId: GameId;
  readonly author: PlayerId;
  /** Hex Ed25519 public key of the author. */
  readonly pub: string;
  /** Per-author monotonic counter, starting at 1. Gaps mean missing events. */
  readonly seq: number;
  /** Lamport clock, for a total order that respects causality. */
  readonly lamport: number;
  /**
   * Author's wall clock, milliseconds. For display only. The reducer must never
   * branch on this: clocks are not synchronised and a lying peer is free.
   */
  readonly at: number;
  readonly body: GameEventBody;
  readonly id: string;
  readonly sig: string;
}

export type UnsignedEvent = Omit<SignedEvent, 'id' | 'sig'>;

export function signingPayload(event: UnsignedEvent): string {
  return canonicalJson({
    v: event.v,
    gameId: event.gameId,
    author: event.author,
    pub: event.pub,
    seq: event.seq,
    lamport: event.lamport,
    at: event.at,
    body: event.body,
  });
}

export interface CreateEventOptions {
  readonly identity: Identity;
  readonly gameId: GameId;
  readonly seq: number;
  readonly lamport: number;
  readonly body: GameEventBody;
  /** Injectable so tests are not at the mercy of the clock. */
  readonly now?: number;
}

export function createEvent(options: CreateEventOptions): SignedEvent {
  const unsigned: UnsignedEvent = {
    v: PROTOCOL_VERSION,
    gameId: options.gameId,
    author: options.identity.id,
    pub: options.identity.publicKey,
    seq: options.seq,
    lamport: options.lamport,
    at: options.now ?? Date.now(),
    body: options.body,
  };
  const payload = signingPayload(unsigned);
  return {
    ...unsigned,
    id: sha256Hex(payload),
    sig: sign(payload, options.identity.secretKey),
  };
}

export type EventRejection =
  | 'malformed'
  | 'wrong-protocol'
  | 'wrong-game'
  | 'bad-id'
  | 'impersonation'
  | 'bad-signature';

/**
 * The vocabulary for "why did this get refused" across the engine, in one
 * place rather than scattered per-caller, because it grew inconsistently
 * before this: {@link checkEvent}/{@link EventLog.insert} settled on a
 * closed set of short machine-readable codes (this type), while the
 * reducer's own rule checks (`apply()` in reducer.ts) return free-form
 * English sentences instead ('the acting team cannot draw its own
 * question'). Both are legitimate - the reducer's rules are numerous,
 * business-specific, and already human-readable by design; the log/event
 * layer's are few, structural, and better as stable codes a caller could
 * branch on. Rather than force one shape onto both (which would either
 * strip the reducer's readability or multiply the log layer's codes for no
 * reason), {@link explainRejection} is the single seam that turns *either*
 * kind into one consistent, presentable sentence - callers displaying a
 * rejection to a person go through here instead of hand-writing per-reason
 * copy at each call site.
 */
export function explainRejection(reason: string): string {
  const known: Readonly<Record<EventRejection | 'duplicate' | 'log-full', string>> = {
    malformed: 'That message was not a valid event.',
    'wrong-protocol': 'That device is running a different version of Dohhh.',
    'wrong-game': 'That event belongs to a different game.',
    'bad-id': 'That event was corrupted in transit.',
    impersonation: 'That event was signed by a different key than it claims to be from.',
    'bad-signature': 'That event failed its signature check.',
    duplicate: 'Already have that one.',
    'log-full': 'This game has grown too large to accept anything else.',
  };
  const explained = known[reason as keyof typeof known];
  if (explained !== undefined) return explained;
  // Anything else is one of the reducer's own rule-rejection strings, which
  // are already written as a sentence fragment for a human (see apply() in
  // reducer.ts) - just finish the sentence.
  const trimmed = reason.trim();
  if (trimmed.length === 0) return 'That did not go through.';
  const capitalized = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  return /[.!?]$/.test(capitalized) ? capitalized : `${capitalized}.`;
}

/**
 * Full cryptographic check of an event received from the network. Returns the
 * reason for refusal, or `null` when the event is sound.
 *
 * `impersonation` is the interesting one: because a player id is a hash of the
 * public key, an event claiming to be from someone else fails without anyone
 * having to consult a registry.
 */
export function checkEvent(event: SignedEvent, expectedGameId?: GameId): EventRejection | null {
  if (
    typeof event !== 'object' ||
    event === null ||
    typeof event.id !== 'string' ||
    typeof event.sig !== 'string' ||
    typeof event.pub !== 'string' ||
    typeof event.author !== 'string' ||
    typeof event.gameId !== 'string' ||
    !Number.isInteger(event.seq) ||
    event.seq < 1 ||
    !Number.isInteger(event.lamport) ||
    event.lamport < 0 ||
    typeof event.body !== 'object' ||
    event.body === null ||
    typeof event.body.type !== 'string'
  ) {
    return 'malformed';
  }
  if (event.v !== PROTOCOL_VERSION) return 'wrong-protocol';
  if (expectedGameId !== undefined && event.gameId !== expectedGameId) return 'wrong-game';

  let payload: string;
  try {
    payload = signingPayload(event);
  } catch {
    // canonicalJson refuses to recurse past a sane depth (a guard against a
    // future event type nesting attacker-influenced JSON) - that is a
    // reason to reject the event, not a reason for the fold to crash.
    return 'malformed';
  }
  if (sha256Hex(payload) !== event.id) return 'bad-id';
  if (playerIdFromPublicKey(event.pub) !== event.author) return 'impersonation';
  if (!verify(event.sig, payload, event.pub)) return 'bad-signature';
  return null;
}

export function isValidEvent(event: SignedEvent, expectedGameId?: GameId): boolean {
  return checkEvent(event, expectedGameId) === null;
}

/**
 * Total order over events: Lamport clock first (so causality is respected),
 * then author id and sequence to break ties deterministically. Every peer
 * sorts identically, which is the whole reason the reducer can be pure.
 */
export function compareEvents(a: SignedEvent, b: SignedEvent): number {
  if (a.lamport !== b.lamport) return a.lamport - b.lamport;
  if (a.author !== b.author) return a.author < b.author ? -1 : 1;
  if (a.seq !== b.seq) return a.seq - b.seq;
  return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
}
