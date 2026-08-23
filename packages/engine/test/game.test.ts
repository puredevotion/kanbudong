import { describe, expect, it } from 'vitest';

import {
  activeQuestion,
  callTimeout,
  CATEGORY_IDS,
  commitAnswer,
  createEvent,
  createIdentity,
  createRng,
  drawTurn,
  EventLog,
  kickPlayer,
  makeEvent,
  randomHex,
  reduce,
  revealAnswer,
  scoreboard,
  SEED_PACK,
  setRoomLocked,
  startCheck,
  startGame,
  type GameState,
} from '../src/index.js';

import { Table } from './table.js';

function twoTeams(rules?: ConstructorParameters<typeof Table>[1]): Table {
  const table = new Table(['Ada', 'Grace', 'Alan', 'Edsger'], rules);
  table.team('Analytical', [0, 1]);
  table.team('Recursive', [2, 3]);
  table.start();
  return table;
}

describe('lobby and the start gate', () => {
  it('refuses to start with fewer than two staffed teams (R-4)', () => {
    const table = new Table(['Ada', 'Grace']);
    // Both players on one team satisfies "at least 2 players" and is not a game.
    table.team('Together', [0, 1]);
    const before = table.state();
    expect(startCheck(before, table.player(0).id).ready).toBe(false);

    table.push(startGame(table.log, table.player(0)));
    const after = table.state();
    expect(after.phase).toBe('lobby');
    expect(after.rejected.some((r) => r.reason.includes('teams with members'))).toBe(true);
  });

  it('refuses a start from anyone but the host', () => {
    const table = new Table(['Ada', 'Grace']);
    table.team('A', [0]);
    table.team('B', [1]);
    table.push(startGame(table.log, table.player(1)));
    expect(table.state().phase).toBe('lobby');
    expect(table.state().rejected.some((r) => r.reason.includes('host'))).toBe(true);
    expect(startCheck(table.state(), table.player(1).id).reason).toMatch(/host/);
  });

  it('starts with two staffed teams and puts the first team up', () => {
    const table = twoTeams();
    const state = table.state();
    expect(state.phase).toBe('playing');
    expect(state.turnOrder).toHaveLength(2);
    expect(state.cursor).toBe(0);
    expect(state.active).toBeNull();
    expect(startCheck(state, table.player(0).id).ready).toBe(false);
  });

  it('leaves an un-teamed player as a spectator', () => {
    const table = new Table(['Ada', 'Grace', 'Bystander']);
    table.team('A', [0]);
    table.team('B', [1]);
    const state = table.state();
    expect(state.spectatorIds).toContain(table.player(2).id);
    expect(state.spectatorIds).not.toContain(table.player(0).id);
  });
});

describe('drawing a question', () => {
  it('will not let the acting team deal its own question (R-10)', () => {
    const table = twoTeams();
    const state = table.state();
    // Player 0 is on the acting team.
    table.push(drawTurn(table.log, table.player(0), state.turnIndex));
    const after = table.state();
    expect(after.active).toBeNull();
    expect(after.rejected.some((r) => r.reason.includes('cannot draw its own'))).toBe(true);
  });

  it('accepts a draw from any opponent and nominates an answerer', () => {
    const table = twoTeams();
    table.draw();
    const active = table.state().active;
    expect(active).not.toBeNull();
    expect(active?.drawnBy).toBe(table.player(2).id);
    expect(active?.nominatedId).toBe(table.player(0).id);
    expect(active?.difficulty).toBeNull();
  });

  it('rotates the nominated answerer within a team across its turns', () => {
    const table = twoTeams();
    table.playTurn('low', false); // team A, nominated player 0
    table.playTurn('low', false); // team B
    table.draw(); // team A again
    expect(table.state().active?.nominatedId).toBe(table.player(1).id);
  });

  it('ignores a second draw for the same turn', () => {
    const table = twoTeams();
    table.draw();
    const first = table.state().active?.nonce;
    table.push(drawTurn(table.log, table.player(3), table.state().turnIndex));
    expect(table.state().active?.nonce).toBe(first);
  });

  it('deals every category once before repeating any (R-6)', () => {
    const table = new Table(['Ada', 'Grace', 'Alan', 'Edsger']);
    table.team('A', [0, 1]);
    table.team('B', [2, 3]);
    table.start();
    const seen: string[] = [];
    // One full bag, however many categories there happen to be: the deck size
    // follows CATEGORIES, so adding one must not break the fairness property.
    for (let i = 0; i < CATEGORY_IDS.length; i += 1) {
      table.draw();
      seen.push(table.pickCategory());
      table.choose('low');
      table.answer(false);
    }
    expect(new Set(seen).size).toBe(CATEGORY_IDS.length);
  });
});

describe('scoring', () => {
  const cases = [
    { difficulty: 'low', correct: true, delta: 1 },
    { difficulty: 'low', correct: false, delta: -1 },
    { difficulty: 'mid', correct: true, delta: 5 },
    { difficulty: 'mid', correct: false, delta: -3 },
    { difficulty: 'high', correct: true, delta: 15 },
    { difficulty: 'high', correct: false, delta: -10 },
  ] as const;

  for (const testCase of cases) {
    it(`awards ${testCase.delta} for a ${testCase.correct ? 'correct' : 'wrong'} ${testCase.difficulty} answer`, () => {
      const table = twoTeams();
      const teamId = table.state().turnOrder[0] as string;
      table.playTurn(testCase.difficulty, testCase.correct);
      expect(table.state().scores[teamId]).toBe(testCase.delta);
    });
  }

  it('keeps the turn on a correct answer and passes it on a wrong one', () => {
    const table = twoTeams();
    const [teamA, teamB] = table.state().turnOrder;

    table.playTurn('mid', true);
    let state = table.state();
    expect(state.cursor).toBe(0);
    expect(state.streak).toBe(1);
    expect(state.turnIndex).toBe(1);

    table.playTurn('mid', true);
    expect(table.state().streak).toBe(2);
    expect(table.state().scores[teamA as string]).toBe(10);

    table.playTurn('low', false);
    state = table.state();
    expect(state.cursor).toBe(1);
    expect(state.streak).toBe(0);
    expect(state.scores[teamA as string]).toBe(9);
    expect(state.scores[teamB as string]).toBe(0);
  });

  it('lets a score go negative by default, and floors it when asked (R-2)', () => {
    const unbounded = twoTeams();
    const teamId = unbounded.state().turnOrder[0] as string;
    unbounded.playTurn('high', false);
    expect(unbounded.state().scores[teamId]).toBe(-10);

    const floored = twoTeams({ scoreFloor: 0 });
    const flooredTeam = floored.state().turnOrder[0] as string;
    floored.playTurn('high', false);
    expect(floored.state().scores[flooredTeam]).toBe(0);
  });

  it('caps a streak only when the house rule says so (R-1)', () => {
    const spec = twoTeams();
    for (let i = 0; i < 6; i += 1) spec.playTurn('low', true);
    // Spec-faithful: six correct answers, still the same team's turn.
    expect(spec.state().cursor).toBe(0);
    expect(spec.state().streak).toBe(6);

    const capped = twoTeams({ maxCorrectStreakPerTurn: 3 });
    for (let i = 0; i < 3; i += 1) capped.playTurn('low', true);
    expect(capped.state().cursor).toBe(1);
    expect(capped.state().streak).toBe(0);
  });

  /**
   * dohhh could assert 24 draws with no repeat, because its bank held 15
   * questions in every cell. This one grows unevenly from a curriculum and some
   * scene/tier cells hold a single item, so a repeat inside 24 turns is expected
   * rather than a fault.
   *
   * The engine's guarantee was never "no repeats" anyway - it is that a repeat
   * happens only once the candidate pool for that scene and tier is drained, and
   * that when it happens the turn is flagged. Asserting the flag is stricter
   * than counting distinct ids, and it stays true as the bank grows.
   */
  it('repeats a question only when the pool is drained, and says so when it does', () => {
    const table = twoTeams();
    const asked = new Set<string>();
    let repeats = 0;
    for (let i = 0; i < 24; i += 1) {
      table.draw();
      table.pickCategory();
      table.choose('mid');
      const active = table.state().active;
      const id = active?.questionId ?? '';
      if (asked.has(id)) {
        expect(active?.repeat, `${id} came round again without being flagged a repeat`).toBe(true);
        repeats += 1;
      } else {
        expect(active?.repeat).toBe(false);
      }
      asked.add(id);
      table.answer(false);
    }
    // Sanity: the run must actually exercise both branches, or it proves nothing.
    expect(asked.size).toBeGreaterThan(1);
    expect(repeats).toBeLessThan(24);
  });
});

describe('timeouts (R-3)', () => {
  it('scores a timeout as a wrong answer and passes the turn', () => {
    const table = twoTeams();
    const teamId = table.state().turnOrder[0] as string;
    table.draw();
    table.pickCategory();
    table.choose('high');
    table.timeout(2);
    const state = table.state();
    expect(state.scores[teamId]).toBe(-10);
    expect(state.cursor).toBe(1);
    expect(state.history.at(-1)?.timedOut).toBe(true);
    expect(state.history.at(-1)?.answererId).toBeNull();
  });

  it('can be called before a difficulty is chosen, at the cheapest tier', () => {
    const table = twoTeams();
    const teamId = table.state().turnOrder[0] as string;
    table.draw();
    table.timeout(3);
    expect(table.state().scores[teamId]).toBe(-1);
    expect(table.state().cursor).toBe(1);
  });

  it('may be called by anyone, including the stalling team itself', () => {
    const table = twoTeams();
    table.draw();
    table.pickCategory();
    table.choose('mid');
    table.push(callTimeout(table.log, table.player(0), table.state().turnIndex));
    expect(table.state().cursor).toBe(1);
  });
});

describe('authority', () => {
  it('accepts an answer from someone not on the acting team, but it never resolves the turn (§5.1 beat 4)', () => {
    const table = twoTeams();
    table.draw();
    table.pickCategory();
    table.choose('mid');
    const state = table.state();
    const presented = activeQuestion(state, SEED_PACK);
    // Player 2 is on the opposing (non-acting) team - Phase B lets any known
    // player answer privately, but only the acting team's reveal scores.
    table.answerAs(2, (presented?.correctIndex ?? 0) as 0 | 1 | 2);
    const after = table.state();
    expect(after.active).not.toBeNull();
    expect(after.rejected).toEqual([]);
    expect(after.history).toEqual([]);
  });

  it('refuses an answer reveal for a turn this table never dealt', () => {
    const table = twoTeams();
    table.draw();
    table.pickCategory();
    table.choose('mid');
    const salt = randomHex(8);
    table.push(commitAnswer(table.log, table.player(0), 99, 0, salt));
    table.push(revealAnswer(table.log, table.player(0), 99, 0, salt));
    expect(table.state().active).not.toBeNull();
    expect(
      table.state().rejected.some((r) => r.reason === 'malformed or unresolvable turn answer'),
    ).toBe(true);
  });

  it('refuses an out-of-range option on reveal', () => {
    const table = twoTeams();
    table.draw();
    table.pickCategory();
    table.choose('mid');
    const actor = table.player(table.actorIndex());
    const turnIndex = table.state().turnIndex;
    const salt = randomHex(8);
    table.push(commitAnswer(table.log, actor, turnIndex, 7, salt));
    table.push(revealAnswer(table.log, actor, turnIndex, 7, salt));
    expect(
      table.state().rejected.some((r) => r.reason === 'malformed or unresolvable turn answer'),
    ).toBe(true);
  });

  it('ignores a second difficulty choice for the same turn', () => {
    const table = twoTeams();
    table.draw();
    table.pickCategory();
    table.choose('low');
    table.choose('high');
    expect(table.state().active?.difficulty).toBe('low');
    expect(table.state().rejected.some((r) => r.reason.includes('already chosen'))).toBe(true);
  });
});

describe('moderation (kick and lock)', () => {
  it('refuses a lock from anyone but the host', () => {
    const table = twoTeams();
    table.push(setRoomLocked(table.log, table.player(1), true));
    expect(table.state().locked).toBe(false);
    expect(table.state().rejected.some((r) => r.reason.includes('only the host'))).toBe(true);
  });

  it('locks and unlocks for the host', () => {
    const table = twoTeams();
    table.push(setRoomLocked(table.log, table.player(0), true));
    expect(table.state().locked).toBe(true);
    table.push(setRoomLocked(table.log, table.player(0), false));
    expect(table.state().locked).toBe(false);
  });

  it('blocks a brand-new player from joining while locked, but not an already-known one re-announcing', () => {
    const table = twoTeams();
    table.push(setRoomLocked(table.log, table.player(0), true));

    const stranger = createIdentity('Stranger');
    table.push(
      makeEvent(table.log, stranger, { type: 'player/joined', username: stranger.username }),
    );
    expect(table.state().players[stranger.id]).toBeUndefined();
    expect(table.state().rejected.some((r) => r.reason === 'this room is locked')).toBe(true);

    // player(1) is already known (announced in the Table constructor) - a
    // reconnect's re-announcement must go through rather than being treated
    // as a new stranger. Checked by effect (the new username actually
    // landed), not by absence-of-rejection: the stranger's own rejection
    // above stays in `rejected`'s history regardless.
    table.push(
      makeEvent(table.log, table.player(1), { type: 'player/joined', username: 'Grace Renamed' }),
    );
    expect(table.state().players[table.player(1).id]?.username).toBe('Grace Renamed');
  });

  it('refuses a kick from anyone but the host', () => {
    const table = twoTeams();
    const target = table.player(2).id;
    table.push(kickPlayer(table.log, table.player(1), target));
    expect(table.state().bannedIds).not.toContain(target);
    expect(table.state().rejected.some((r) => r.reason.includes('only the host'))).toBe(true);
  });

  it('refuses the host kicking themselves', () => {
    const table = twoTeams();
    table.push(kickPlayer(table.log, table.player(0), table.player(0).id));
    expect(table.state().bannedIds).toHaveLength(0);
    expect(table.state().rejected.some((r) => r.reason.includes('cannot kick themselves'))).toBe(
      true,
    );
  });

  it('removes a kicked player from their team and refuses everything they sign afterward', () => {
    const table = twoTeams();
    const target = table.player(2);
    const targetsTeam = table.state().teams.find((t) => t.memberIds.includes(target.id));
    expect(targetsTeam).not.toBeUndefined();

    table.push(kickPlayer(table.log, table.player(0), target.id));
    const after = table.state();
    expect(after.bannedIds).toContain(target.id);
    expect(after.teams.find((t) => t.id === targetsTeam?.id)?.memberIds).not.toContain(target.id);

    // Everything they sign from here on is refused, including a
    // re-announcement - a kick is not "kicked until your next join."
    table.push(makeEvent(table.log, target, { type: 'player/joined', username: target.username }));
    expect(table.state().rejected.some((r) => r.reason.includes('removed from this game'))).toBe(
      true,
    );
  });
});

describe('the finish line', () => {
  it('completes the round after someone crosses the target (R-5)', () => {
    const table = twoTeams({ targetScore: 150, finishTheRound: true });
    const [teamA, teamB] = table.state().turnOrder;

    // Ten straight high answers: 150 exactly, and the turn never left.
    for (let i = 0; i < 10; i += 1) table.playTurn('high', true);
    let state = table.state();
    expect(state.scores[teamA as string]).toBe(150);
    expect(state.phase).toBe('playing');
    expect(state.endgameArmedRound).toBe(0);

    // Team A finally misses; the turn passes but the game is not over, because
    // team B has not had its turn in this round.
    table.playTurn('low', false);
    state = table.state();
    expect(state.phase).toBe('playing');
    expect(state.cursor).toBe(1);

    table.playTurn('low', false);
    state = table.state();
    expect(state.phase).toBe('finished');
    expect(state.winnerTeamId).toBe(teamA);
    expect(state.scores[teamB as string]).toBe(-1);
    expect(state.active).toBeNull();
  });

  it('ends immediately when finishTheRound is switched off', () => {
    const table = twoTeams({ targetScore: 15, finishTheRound: false });
    const teamA = table.state().turnOrder[0] as string;
    table.playTurn('high', true);
    const state = table.state();
    expect(state.phase).toBe('finished');
    expect(state.winnerTeamId).toBe(teamA);
  });

  it('goes to sudden death on a dead heat, and resolves it', () => {
    const table = twoTeams({ targetScore: 5, finishTheRound: true });
    const [teamA, teamB] = table.state().turnOrder;

    table.playTurn('mid', true); // A: 5, target crossed, endgame armed
    table.playTurn('low', false); // A: 4, turn passes
    table.playTurn('mid', true); // B: 5
    table.playTurn('low', false); // B: 4, round completes -> 4 v 4

    let state = table.state();
    expect(state.phase).toBe('playing');
    expect(state.suddenDeath).toBe(true);
    expect(state.scores[teamA as string]).toBe(4);
    expect(state.scores[teamB as string]).toBe(4);
    expect(state.turnOrder).toHaveLength(2);

    table.playTurn('high', true); // A: 19
    table.playTurn('low', false); // A: 18, turn passes
    table.playTurn('low', false); // B: 3, round completes

    state = table.state();
    expect(state.phase).toBe('finished');
    expect(state.winnerTeamId).toBe(teamA);
    expect(scoreboard(state)[0]?.team.id).toBe(teamA);
  });

  it('refuses further play once finished', () => {
    const table = twoTeams({ targetScore: 15, finishTheRound: false });
    table.playTurn('high', true);
    expect(table.state().phase).toBe('finished');
    table.push(drawTurn(table.log, table.player(2), table.state().turnIndex));
    expect(table.state().rejected.some((r) => r.reason === 'not playing')).toBe(true);
  });
});

describe('convergence', () => {
  it('produces identical state from any arrival order', () => {
    const table = twoTeams();
    for (let i = 0; i < 8; i += 1) table.playTurn(i % 2 === 0 ? 'mid' : 'low', i % 3 !== 0);
    const canonical = table.state();
    expect(table.log.size).toBeGreaterThan(20);

    const rng = createRng('arrival-order');
    for (let trial = 0; trial < 20; trial += 1) {
      const shuffled = rng.shuffle(table.log.events);
      const replica = new EventLog(table.log.gameId);
      replica.insertMany(shuffled);
      expect(replica.digest()).toBe(table.log.digest());
      const state = reduce(replica.events, { pack: SEED_PACK }) as GameState;
      expect(state).toEqual(canonical);
    }
  });

  it('reports which events a peer is missing', () => {
    const table = twoTeams();
    table.playTurn('mid', true);

    const behind = new EventLog(table.log.gameId);
    behind.insertMany(table.log.events.slice(0, 4));
    const missing = table.log.eventsMissingFrom(behind.vector);
    expect(missing.length).toBeGreaterThan(0);

    behind.insertMany(missing);
    expect(behind.digest()).toBe(table.log.digest());
    expect(table.log.eventsMissingFrom(behind.vector)).toEqual([]);
  });

  it('returns null until a game/created is present', () => {
    expect(reduce([], { pack: SEED_PACK })).toBeNull();
  });

  /**
   * The reducer folds the log once, top to bottom, and never revisits a
   * rejected event once game/created lands further down - by design (R-11:
   * one pass, no retries). That means a peer who stamps its own event from a
   * Lamport clock that has not yet caught up to the host's history (e.g. a
   * fresh EventLog, before any backfill has arrived) can produce an event
   * that sorts *before* game/created forever, once merged - no amount of
   * further backfill fixes it, because the event's lamport is fixed at
   * signing time. This is why the app must wait for its own `state !== null`
   * before committing anything, rather than announcing itself the instant a
   * session is constructed.
   */
  it('permanently drops an event stamped before its author had backfilled game/created', () => {
    const table = new Table(['Host']);
    const latecomer = createIdentity('Latecomer');

    // What store.ts used to do: stamp an announcement from a brand new,
    // empty local log (lamport 0) before any backfill had landed.
    const staleAnnounce = createEvent({
      identity: latecomer,
      gameId: table.log.gameId,
      seq: 1,
      lamport: 0,
      body: { type: 'player/joined', username: latecomer.username },
    });

    // reduce() trusts its input is already in total order - normally that
    // order comes from EventLog.events (sorted on insert), never from a bare
    // array concatenation - so route the merge through a real log, exactly
    // as a receiving peer would.
    const replica = new EventLog(table.log.gameId);
    replica.insertMany([...table.log.events, staleAnnounce]);
    const state = reduce(replica.events, { pack: SEED_PACK });

    expect(state).not.toBeNull();
    expect(state?.players[latecomer.id]).toBeUndefined();
    expect(state?.rejected.some((r) => r.id === staleAnnounce.id)).toBe(true);

    // Backfilling everything else in the world does not resurrect it: the
    // event's own lamport stamp is what put it before game/created, and that
    // never changes.
    const laterState = reduce(replica.events, { pack: SEED_PACK });
    expect(laterState?.players[latecomer.id]).toBeUndefined();
  });
});
