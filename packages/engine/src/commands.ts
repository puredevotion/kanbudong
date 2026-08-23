import type { GameEventBody, SignedEvent } from './events.js';
import { createEvent } from './events.js';
import type { Identity } from './identity.js';
import { newGameId, newTeamId, newTurnNonce } from './ids.js';
import type { EventLog } from './log.js';
import { randomJoinCode } from './joincode.js';
import type { RulesConfig } from './rules.js';
import { normalizeRules } from './rules.js';
import type { CategoryId, Difficulty, GameId, PlayerId, TeamId } from './types.js';

/**
 * These names ride in a wire event, so a UI's `maxLength` on an `<input>` is
 * not a real bound - a hand-crafted event, or a client that skips the form
 * entirely, bypasses it. Clamping here is the actual boundary; the UI limit
 * is just the same number applied early for a better typing experience.
 */
const MAX_NAME_LENGTH = 40;

function clampName(raw: string, fallback: string): string {
  const trimmed = raw.replace(/\s+/g, ' ').trim().slice(0, MAX_NAME_LENGTH);
  return trimmed.length === 0 ? fallback : trimmed;
}

/**
 * Thin constructors for the events a UI needs to emit.
 *
 * They exist so no screen has to know about Lamport clocks or sequence numbers:
 * pass the log and the identity, get back a signed event ready to gossip.
 */
export function makeEvent(
  log: EventLog,
  identity: Identity,
  body: GameEventBody,
  now?: number,
): SignedEvent {
  return createEvent({
    identity,
    gameId: log.gameId,
    seq: log.nextSeq(identity.id),
    lamport: log.nextLamport(),
    body,
    ...(now === undefined ? {} : { now }),
  });
}

export interface NewGame {
  readonly gameId: GameId;
  readonly joinCode: string;
  /** Always exactly [game/created, player/joined], in that order. */
  readonly events: readonly [created: SignedEvent, joined: SignedEvent];
}

/**
 * Open a game. Produces the two events every game starts with: the creation
 * record and the host's own join, so the host is never a player-less host.
 *
 * Unlike every other command below, this one inserts directly into the log
 * (via `makeLog`) rather than returning unsent events for the caller to
 * commit - `game/created` has to exist in the log before `nextLamport`/
 * `nextSeq` can be computed for the `player/joined` that follows it in the
 * same call, so there is no meaningful "unsent" state to hand back partway
 * through opening a game.
 */
export function createGame(options: {
  readonly identity: Identity;
  readonly name: string;
  readonly packHash: string;
  readonly rules?: Partial<RulesConfig>;
  readonly joinCode?: string;
  readonly makeLog: (gameId: GameId) => EventLog;
  readonly now?: number;
}): NewGame {
  const joinCode = options.joinCode ?? randomJoinCode();
  const gameId = newGameId(options.identity.id, joinCode);
  const log = options.makeLog(gameId);
  const created = makeEvent(
    log,
    options.identity,
    {
      type: 'game/created',
      name: clampName(options.name, 'Dohhh game'),
      joinCode,
      rules: normalizeRules(options.rules),
      packHash: options.packHash,
    },
    options.now,
  );
  log.insert(created);
  const joined = makeEvent(
    log,
    options.identity,
    { type: 'player/joined', username: options.identity.username },
    options.now,
  );
  log.insert(joined);
  return { gameId, joinCode, events: [created, joined] };
}

export const announce = (log: EventLog, identity: Identity): SignedEvent =>
  makeEvent(log, identity, { type: 'player/joined', username: identity.username });

export const openTeam = (log: EventLog, identity: Identity, name: string): SignedEvent =>
  makeEvent(log, identity, {
    type: 'team/created',
    teamId: newTeamId(log.gameId, name),
    name: clampName(name, 'Team'),
  });

export const joinTeam = (log: EventLog, identity: Identity, teamId: TeamId): SignedEvent =>
  makeEvent(log, identity, { type: 'team/joined', teamId });

export const leaveTeam = (log: EventLog, identity: Identity, teamId: TeamId): SignedEvent =>
  makeEvent(log, identity, { type: 'team/left', teamId });

export const startGame = (log: EventLog, identity: Identity): SignedEvent =>
  makeEvent(log, identity, { type: 'game/started' });

/** Deal the next question. Only a peer off the acting team may do this (R-10). */
export const drawTurn = (log: EventLog, identity: Identity, turnIndex: number): SignedEvent =>
  makeEvent(log, identity, { type: 'turn/drawn', turnIndex, nonce: newTurnNonce() });

/** Pick one of the three categories turn/drawn offered. */
export const chooseCategory = (
  log: EventLog,
  identity: Identity,
  turnIndex: number,
  categoryId: CategoryId,
): SignedEvent => makeEvent(log, identity, { type: 'turn/category', turnIndex, categoryId });

export const chooseDifficulty = (
  log: EventLog,
  identity: Identity,
  turnIndex: number,
  difficulty: Difficulty,
): SignedEvent => makeEvent(log, identity, { type: 'turn/difficulty', turnIndex, difficulty });

export const answerTurn = (
  log: EventLog,
  identity: Identity,
  turnIndex: number,
  chosenIndex: number,
): SignedEvent => makeEvent(log, identity, { type: 'turn/answered', turnIndex, chosenIndex });

export const callTimeout = (log: EventLog, identity: Identity, turnIndex: number): SignedEvent =>
  makeEvent(log, identity, { type: 'turn/timeout', turnIndex });

/** Host-only; the reducer refuses this from anyone else. */
export const setRoomLocked = (log: EventLog, identity: Identity, locked: boolean): SignedEvent =>
  makeEvent(log, identity, { type: 'room/locked', locked });

/** Host-only; the reducer refuses this from anyone else, and refuses the host kicking themselves. */
export const kickPlayer = (log: EventLog, identity: Identity, targetId: PlayerId): SignedEvent =>
  makeEvent(log, identity, { type: 'player/kicked', targetId });
