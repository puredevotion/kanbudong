import {
  answerTurn,
  activeQuestion,
  chooseCategory,
  chooseDifficulty,
  PROTOCOL_VERSION,
  createGame,
  createIdentity,
  drawTurn,
  encodeJoinCode,
  EventLog,
  joinTeam,
  makeEvent,
  openTeam,
  SEED_PACK,
  SEED_PACK_HASH,
  startGame,
  type GameId,
  type GameState,
  type Identity,
  type SignedEvent,
} from '@kanbudong/engine';
import { beforeEach, describe, expect, it } from 'vitest';

import { discoverGame } from '../src/discover.js';
import { GameSession } from '../src/session.js';

import { FakeMesh } from './mesh.js';

const seed = (n: number): string => n.toString(16).padStart(2, '0').repeat(32);

interface Fixture {
  readonly mesh: FakeMesh;
  readonly gameId: GameId;
  readonly joinCode: string;
  readonly host: Identity;
  readonly guest: Identity;
  readonly hostSession: GameSession;
  readonly guestSession: GameSession;
}

function twoDevices(): Fixture {
  const mesh = new FakeMesh();
  const host = createIdentity('Ada', seed(1));
  const guest = createIdentity('Grace', seed(2));

  // The host builds the opening events locally, exactly as the app does before
  // anyone else has arrived.
  let hostLog: EventLog | undefined;
  const game = createGame({
    identity: host,
    name: 'Pub quiz',
    packHash: SEED_PACK_HASH,
    makeLog: (gameId) => {
      hostLog = new EventLog(gameId);
      return hostLog;
    },
    now: 1,
  });

  const hostSession = new GameSession({
    identity: host,
    pack: SEED_PACK,
    gameId: game.gameId,
    joinCode: game.joinCode,
    seed: hostLog?.events ?? [],
    gossipIntervalMs: 0,
    makeTransport: mesh.transportFactory,
  });

  // The guest starts from nothing but the ticket: no events at all.
  const guestSession = new GameSession({
    identity: guest,
    pack: SEED_PACK,
    gameId: game.gameId,
    joinCode: game.joinCode,
    gossipIntervalMs: 0,
    makeTransport: mesh.transportFactory,
  });

  return {
    mesh,
    gameId: game.gameId,
    joinCode: game.joinCode,
    host,
    guest,
    hostSession,
    guestSession,
  };
}

describe('joining an existing game', () => {
  let f: Fixture;
  beforeEach(() => {
    f = twoDevices();
  });

  it('starts with the guest knowing nothing', () => {
    expect(f.guestSession.state).toBeNull();
    expect(f.hostSession.state?.phase).toBe('lobby');
  });

  it('backfills the whole log from a peer', () => {
    f.mesh.settle();
    expect(f.guestSession.log.digest()).toBe(f.hostSession.log.digest());
    expect(f.guestSession.state?.gameId).toBe(f.gameId);
    expect(f.guestSession.state?.hostId).toBe(f.host.id);
    expect(f.guestSession.state?.joinCode).toBe(f.joinCode);
  });

  it('converges on the guest announcing itself', () => {
    f.mesh.settle();
    f.guestSession.commit(announceOf(f.guestSession, f.guest));
    f.mesh.settle();
    const hostView = f.hostSession.state;
    expect(hostView?.players[f.guest.id]?.username).toBe('Grace');
    expect(f.hostSession.log.digest()).toBe(f.guestSession.log.digest());
  });
});

describe('anti-entropy', () => {
  it('recovers a dropped broadcast at the next vector exchange', () => {
    const f = twoDevices();
    f.mesh.settle();

    // The guest speaks, and the network eats it.
    f.guestSession.commit(announceOf(f.guestSession, f.guest));
    expect(f.mesh.inFlight).toBeGreaterThan(0);
    expect(f.mesh.drop()).toBeGreaterThan(0);
    expect(f.hostSession.state?.players[f.guest.id]).toBeUndefined();

    // A later "have" from the guest is enough for the host to notice the gap
    // and ask for it: no retry queue, no acknowledgements, no timers.
    f.guestSession.commit(openTeamOf(f.guestSession, f.guest, 'Recursive'));
    f.mesh.settle();
    expect(f.hostSession.log.digest()).toBe(f.guestSession.log.digest());
    expect(f.hostSession.state?.players[f.guest.id]?.username).toBe('Grace');
  });

  it('reaches the same state whichever peer produced the events', () => {
    const f = twoDevices();
    f.mesh.settle();
    f.guestSession.commit(announceOf(f.guestSession, f.guest));
    f.mesh.settle();

    const teamA = f.hostSession.commit(openTeamOf(f.hostSession, f.host, 'Analytical'));
    expect(teamA.accepted).toBe(true);
    f.mesh.settle();
    const teamB = f.guestSession.commit(openTeamOf(f.guestSession, f.guest, 'Recursive'));
    expect(teamB.accepted).toBe(true);
    f.mesh.settle();

    const teams = f.hostSession.state?.teams ?? [];
    expect(teams).toHaveLength(2);
    f.hostSession.commit(
      joinTeam(f.hostSession.log, f.host, teams.find((t) => t.name === 'Analytical')?.id ?? ''),
    );
    f.guestSession.commit(
      joinTeam(f.guestSession.log, f.guest, teams.find((t) => t.name === 'Recursive')?.id ?? ''),
    );
    f.mesh.settle();

    expect(f.hostSession.log.digest()).toBe(f.guestSession.log.digest());
    expect(f.hostSession.state).toEqual(f.guestSession.state);
  });

  it('ignores traffic for another game on the same channel', () => {
    const f = twoDevices();
    f.mesh.settle();
    const before = f.hostSession.log.digest();
    // Anyone can join a relay room, so the channel carries whatever turns up.
    f.hostSession.log.insert({} as unknown as SignedEvent);
    expect(f.hostSession.log.digest()).toBe(before);
  });
});

describe('playing across two devices', () => {
  it('runs a full turn with the draw on one device and the answer on the other', () => {
    const f = twoDevices();
    f.mesh.settle();
    f.guestSession.commit(announceOf(f.guestSession, f.guest));
    f.mesh.settle();

    f.hostSession.commit(openTeamOf(f.hostSession, f.host, 'Analytical'));
    f.mesh.settle();
    f.guestSession.commit(openTeamOf(f.guestSession, f.guest, 'Recursive'));
    f.mesh.settle();

    const teams = f.hostSession.state?.teams ?? [];
    const analytical = teams.find((t) => t.name === 'Analytical')?.id ?? '';
    const recursive = teams.find((t) => t.name === 'Recursive')?.id ?? '';
    f.hostSession.commit(joinTeam(f.hostSession.log, f.host, analytical));
    f.mesh.settle();
    f.guestSession.commit(joinTeam(f.guestSession.log, f.guest, recursive));
    f.mesh.settle();

    f.hostSession.commit(startGame(f.hostSession.log, f.host));
    f.mesh.settle();
    expect(f.guestSession.state?.phase).toBe('playing');

    // The guest is not on the acting team, so the guest deals the question.
    const turnIndex = f.guestSession.state?.turnIndex ?? 0;
    f.guestSession.commit(drawTurn(f.guestSession.log, f.guest, turnIndex));
    f.mesh.settle();
    const categoryId = f.hostSession.state?.active?.categoryOptions[0];
    expect(categoryId).toBeDefined();

    // The guest, still not on the acting team, picks one of the offered
    // categories before the host can be asked to bet.
    f.guestSession.commit(chooseCategory(f.guestSession.log, f.guest, turnIndex, categoryId ?? ''));
    f.mesh.settle();
    expect(f.hostSession.state?.active?.categoryId).toBe(categoryId);

    // The host, who is on the acting team, bets and answers.
    f.hostSession.commit(chooseDifficulty(f.hostSession.log, f.host, turnIndex, 'high'));
    f.mesh.settle();

    const presented = activeQuestion(stateOf(f.hostSession), SEED_PACK);
    expect(presented).not.toBeNull();
    // Both devices must have derived the same question from the same nonce.
    const guestView = activeQuestion(stateOf(f.guestSession), SEED_PACK);
    expect(guestView?.question.id).toBe(presented?.question.id);
    expect(guestView?.options).toEqual(presented?.options);

    f.hostSession.commit(
      answerTurn(f.hostSession.log, f.host, turnIndex, presented?.correctIndex ?? 0),
    );
    f.mesh.settle();

    expect(f.hostSession.state?.scores[analytical]).toBe(15);
    expect(f.guestSession.state?.scores[analytical]).toBe(15);
    expect(f.hostSession.state).toEqual(f.guestSession.state);
  });
});

// Small helpers, kept out of the assertions above so the tests read as scenarios.
function announceOf(session: GameSession, identity: Identity): SignedEvent {
  return makeEvent(session.log, identity, {
    type: 'player/joined',
    username: identity.username,
  });
}

function openTeamOf(session: GameSession, identity: Identity, name: string): SignedEvent {
  return openTeam(session.log, identity, name);
}

function stateOf(session: GameSession): GameState {
  const state = session.state;
  if (state === null) throw new Error('session has no state yet');
  return state;
}

describe('discovery by join code', () => {
  it('learns the game id from a peer already in the room', async () => {
    const f = twoDevices();
    f.mesh.settle();
    // A third device knows only the four words, not the game id, because a
    // game id is derived from the host's key and cannot be typed.
    const pending = discoverGame({
      joinCode: f.joinCode,
      timeoutMs: 1_000,
      makeTransport: f.mesh.transportFactory,
    });
    f.mesh.settle();
    await expect(pending).resolves.toEqual(
      expect.objectContaining({ gameId: f.gameId, protocol: PROTOCOL_VERSION }),
    );
  });

  it('gives up rather than spinning when nobody answers', async () => {
    const mesh = new FakeMesh();
    const result = await discoverGame({
      joinCode: encodeJoinCode(999_999),
      timeoutMs: 20,
      makeTransport: mesh.transportFactory,
    });
    expect(result).toBeNull();
  });
});
