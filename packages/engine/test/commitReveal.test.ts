import { describe, expect, it } from 'vitest';

import {
  commitHash,
  makeCommit,
  makeReveal,
  reduce,
  SEED_PACK,
  unrevealedCommits,
} from '../src/index.js';

import { Table } from './table.js';

/**
 * The commit-reveal primitive is generic and unwired (Phase A) - no turn
 * exists to hang these events off, so these tests exercise it directly
 * against a lobby-phase table rather than a played game.
 */
function twoPlayers(): Table {
  return new Table(['Ada', 'Grace']);
}

describe('commit-reveal primitive', () => {
  it('accepts a valid commit followed by a matching reveal', () => {
    const table = twoPlayers();
    const ada = table.player(0);
    const salt = 'ada-salt-1';
    const payload = { chosenIndex: 2 };
    const hash = commitHash(payload, salt);

    table.push(makeCommit(table.log, ada, 'turn-0', hash));
    let state = table.state();
    expect(state.pendingCommits['turn-0']?.[ada.id]?.commitHash).toBe(hash);
    expect(state.reveals['turn-0']?.[ada.id]).toBeUndefined();
    expect(unrevealedCommits(state, 'turn-0')).toEqual([ada.id]);

    table.push(makeReveal(table.log, ada, 'turn-0', payload, salt));
    state = table.state();
    expect(state.pendingCommits['turn-0']?.[ada.id]).toBeUndefined();
    expect(state.reveals['turn-0']?.[ada.id]).toEqual({ payload, salt, at: expect.any(Number) });
    expect(unrevealedCommits(state, 'turn-0')).toEqual([]);
    expect(state.rejected).toEqual([]);
  });

  it('rejects a reveal with the wrong salt', () => {
    const table = twoPlayers();
    const ada = table.player(0);
    const payload = { chosenIndex: 1 };
    const hash = commitHash(payload, 'real-salt');

    table.push(makeCommit(table.log, ada, 'turn-0', hash));
    table.push(makeReveal(table.log, ada, 'turn-0', payload, 'wrong-salt'));

    const state = table.state();
    expect(state.pendingCommits['turn-0']?.[ada.id]?.commitHash).toBe(hash);
    expect(state.reveals['turn-0']?.[ada.id]).toBeUndefined();
    expect(state.rejected.some((r) => r.reason.includes('commitment hash mismatch'))).toBe(true);
  });

  it('rejects a reveal with a tampered payload, same salt', () => {
    const table = twoPlayers();
    const ada = table.player(0);
    const hash = commitHash({ chosenIndex: 0 }, 'consistent-salt');

    table.push(makeCommit(table.log, ada, 'turn-0', hash));
    table.push(makeReveal(table.log, ada, 'turn-0', { chosenIndex: 1 }, 'consistent-salt'));

    const state = table.state();
    expect(state.reveals['turn-0']?.[ada.id]).toBeUndefined();
    expect(state.rejected.some((r) => r.reason.includes('commitment hash mismatch'))).toBe(true);
  });

  it('rejects a reveal with no prior commit', () => {
    const table = twoPlayers();
    const ada = table.player(0);

    table.push(makeReveal(table.log, ada, 'turn-0', { chosenIndex: 0 }, 'some-salt'));

    const state = table.state();
    expect(state.reveals['turn-0']?.[ada.id]).toBeUndefined();
    expect(state.rejected.some((r) => r.reason.includes('no matching commit'))).toBe(true);
  });

  it('rejects a reveal from a different author than the committer', () => {
    const table = twoPlayers();
    const ada = table.player(0);
    const grace = table.player(1);
    const payload = { chosenIndex: 0 };
    const salt = 'ada-only-salt';
    const hash = commitHash(payload, salt);

    table.push(makeCommit(table.log, ada, 'turn-0', hash));
    // Grace never committed for turn-0, so this has no matching commit under
    // her own author id even though the hash and payload are exactly Ada's.
    table.push(makeReveal(table.log, grace, 'turn-0', payload, salt));

    const state = table.state();
    expect(state.reveals['turn-0']?.[grace.id]).toBeUndefined();
    expect(state.pendingCommits['turn-0']?.[ada.id]?.commitHash).toBe(hash);
    expect(state.rejected.some((r) => r.reason.includes('no matching commit'))).toBe(true);
  });

  it('rejects a second commit for the same subject and author', () => {
    const table = twoPlayers();
    const ada = table.player(0);
    const first = commitHash('a', 'salt-one');
    const second = commitHash('b', 'salt-two');

    table.push(makeCommit(table.log, ada, 'turn-0', first));
    table.push(makeCommit(table.log, ada, 'turn-0', second));

    const state = table.state();
    expect(state.pendingCommits['turn-0']?.[ada.id]?.commitHash).toBe(first);
    expect(state.rejected.some((r) => r.reason.includes('already committed'))).toBe(true);
  });

  it('rejects a commit for a subject+author pair that already revealed', () => {
    const table = twoPlayers();
    const ada = table.player(0);
    const payload = 'final answer';
    const salt = 'only-salt-that-counts';
    const hash = commitHash(payload, salt);

    table.push(makeCommit(table.log, ada, 'turn-0', hash));
    table.push(makeReveal(table.log, ada, 'turn-0', payload, salt));
    table.push(makeCommit(table.log, ada, 'turn-0', commitHash('other', 'other-salt')));

    const state = table.state();
    expect(state.reveals['turn-0']?.[ada.id]).toEqual({ payload, salt, at: expect.any(Number) });
    expect(state.pendingCommits['turn-0']?.[ada.id]).toBeUndefined();
    expect(state.rejected.some((r) => r.reason.includes('already revealed'))).toBe(true);
  });

  it('lets two different authors each commit and reveal for the same subject independently', () => {
    const table = twoPlayers();
    const ada = table.player(0);
    const grace = table.player(1);
    const adaPayload = { pick: 'ada' };
    const gracePayload = { pick: 'grace' };
    const adaHash = commitHash(adaPayload, 'ada-salt');
    const graceHash = commitHash(gracePayload, 'grace-salt');

    table.push(makeCommit(table.log, ada, 'turn-0', adaHash));
    table.push(makeCommit(table.log, grace, 'turn-0', graceHash));
    table.push(makeReveal(table.log, grace, 'turn-0', gracePayload, 'grace-salt'));

    const state = table.state();
    expect(unrevealedCommits(state, 'turn-0')).toEqual([ada.id]);
    expect(state.reveals['turn-0']?.[grace.id]).toEqual({
      payload: gracePayload,
      salt: 'grace-salt',
      at: expect.any(Number),
    });
    expect(state.pendingCommits['turn-0']?.[ada.id]?.commitHash).toBe(adaHash);
  });

  it('leaves an unrevealed commit in place forever - forfeiture is a caller decision, not a timeout this primitive enforces', () => {
    const table = twoPlayers();
    const ada = table.player(0);
    table.push(makeCommit(table.log, ada, 'turn-0', commitHash('x', 'salt-x')));

    const state = table.state();
    // No event type exists here to expire it; unrevealedCommits is the hook
    // a caller-defined rule (e.g. Phase B's turn timeout) would consult.
    expect(unrevealedCommits(state, 'turn-0')).toEqual([ada.id]);
  });

  it('replays deterministically regardless of processing the log twice', () => {
    const table = twoPlayers();
    const ada = table.player(0);
    const grace = table.player(1);
    table.push(makeCommit(table.log, ada, 'turn-0', commitHash('a', 'salt-a')));
    table.push(makeCommit(table.log, grace, 'turn-0', commitHash('b', 'salt-b')));
    table.push(makeReveal(table.log, ada, 'turn-0', 'a', 'salt-a'));
    // A stray reveal that will be rejected - determinism must hold for
    // rejections too, not just successful applications.
    table.push(makeReveal(table.log, grace, 'turn-0', 'wrong', 'salt-b'));

    const events = table.log.events;
    const first = reduce(events, { pack: SEED_PACK });
    const second = reduce([...events], { pack: SEED_PACK });
    expect(second).toEqual(first);
  });
});
