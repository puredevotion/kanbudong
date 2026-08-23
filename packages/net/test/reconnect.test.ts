import { createGame, createIdentity, EventLog, SEED_PACK, SEED_PACK_HASH, type Identity } from '@kanbudong/engine';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { GameSession } from '../src/session.js';

import { FakeMesh } from './mesh.js';

const seed = (n: number): string => n.toString(16).padStart(2, '0').repeat(32);

/**
 * The bug this covers: `ConnectionStatus` only reports 'alone' once every
 * peer is gone, so in a mesh with more than two peers, losing one out of
 * several never showed up as anything at all - the session just quietly sat
 * one peer short forever. `peakPeerCount` (session.ts) exists specifically
 * to notice a drop that status alone can't see.
 */
describe('reconnecting after a partial drop in a >2-peer mesh', () => {
  let mesh: FakeMesh;
  let host: Identity;
  let guestA: Identity;
  let guestB: Identity;
  let makeTransport: ReturnType<typeof vi.fn>;
  let hostSession: GameSession;
  let guestBSession: GameSession;

  beforeEach(() => {
    vi.useFakeTimers();
    mesh = new FakeMesh();
    host = createIdentity('Ada', seed(1));
    guestA = createIdentity('Grace', seed(2));
    guestB = createIdentity('Alan', seed(3));
    makeTransport = vi.fn(mesh.transportFactory);

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

    hostSession = new GameSession({
      identity: host,
      pack: SEED_PACK,
      gameId: game.gameId,
      joinCode: game.joinCode,
      seed: hostLog?.events ?? [],
      gossipIntervalMs: 0,
      makeTransport,
    });
    // guestA's own session isn't otherwise referenced - it exists purely to
    // keep a second peer alive in the mesh so the drop below is a partial
    // one (three peers to two), not a full disconnect.
    new GameSession({
      identity: guestA,
      pack: SEED_PACK,
      gameId: game.gameId,
      joinCode: game.joinCode,
      gossipIntervalMs: 0,
      makeTransport: mesh.transportFactory,
    });
    guestBSession = new GameSession({
      identity: guestB,
      pack: SEED_PACK,
      gameId: game.gameId,
      joinCode: game.joinCode,
      gossipIntervalMs: 0,
      makeTransport: mesh.transportFactory,
    });
    mesh.settle();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('never reconnects while the mesh is fully intact', async () => {
    // Sanity check on the fixture itself before testing the failure path.
    expect(hostSession.snapshot().peerCount).toBe(2);
    await vi.advanceTimersByTimeAsync(60_000);
    expect(makeTransport).toHaveBeenCalledTimes(1);
  });

  it('schedules a reconnect when one of several peers drops, even though status stays connected', async () => {
    expect(hostSession.snapshot().status).toBe('connected');

    await guestBSession.leave();

    // The exact bug: with three peers, losing one still leaves the host
    // with a live peer (guestA), so `status` alone never leaves 'connected'.
    expect(hostSession.snapshot().status).toBe('connected');
    expect(hostSession.snapshot().peerCount).toBe(1);

    // Nothing has reconnected yet - the backoff timer hasn't fired.
    expect(makeTransport).toHaveBeenCalledTimes(1);

    // First backoff step is 1s; give it enough headroom to fire.
    await vi.advanceTimersByTimeAsync(2_000);
    expect(makeTransport).toHaveBeenCalledTimes(2);
  });

  it('keeps retrying (does not reset backoff) while the mesh stays short of its peak', async () => {
    await guestBSession.leave();

    await vi.advanceTimersByTimeAsync(2_000);
    expect(makeTransport).toHaveBeenCalledTimes(2);

    // Still only guestA around - the reconnect didn't restore the peak of
    // two peers, so the next attempt should still be scheduled, not treated
    // as "healed."
    await vi.advanceTimersByTimeAsync(3_000);
    expect(makeTransport).toHaveBeenCalledTimes(3);
  });

  it('stops retrying once the mesh is actually back to its peak size', async () => {
    await guestBSession.leave();
    await vi.advanceTimersByTimeAsync(2_000);
    expect(makeTransport).toHaveBeenCalledTimes(2);

    // guestB rejoins the same room through the mesh directly (simulating
    // their own device reconnecting) - the host should see peerCount reach
    // its peak of two again and stand its own backoff down.
    const rejoined = new GameSession({
      identity: guestB,
      pack: SEED_PACK,
      gameId: hostSession.state?.gameId ?? '',
      joinCode: hostSession.state?.joinCode ?? '',
      gossipIntervalMs: 0,
      makeTransport: mesh.transportFactory,
    });
    mesh.settle();
    expect(hostSession.snapshot().peerCount).toBe(2);

    const callsAtRecovery = makeTransport.mock.calls.length;
    await vi.advanceTimersByTimeAsync(60_000);
    expect(makeTransport).toHaveBeenCalledTimes(callsAtRecovery);

    rejoined.leave();
  });
});
