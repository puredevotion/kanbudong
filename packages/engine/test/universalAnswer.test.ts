import { describe, expect, it } from 'vitest';

import {
  activeQuestion,
  commitAnswer,
  EventLog,
  randomHex,
  reduce,
  revealAnswer,
  SEED_PACK,
  unrevealedCommits,
  type SignedEvent,
} from '../src/index.js';

import { Table } from './table.js';

/**
 * Phase B (universal-answer, DESIGN.md §5.1 beat 4): every seated player may
 * answer the live question privately, but only the active team's first
 * revealed answer touches the bet and the score. These tests exercise that
 * on top of the commit-reveal primitive commitReveal.test.ts already covers
 * generically.
 */
function fourPlayerTable(): Table {
  const table = new Table(['Ada', 'Grace', 'Alan', 'Edsger']);
  table.team('Analytical', [0, 1]);
  table.team('Recursive', [2, 3]);
  table.start();
  return table;
}

describe('universal answer (Phase B)', () => {
  it("lets an opposing player answer without resolving the turn, then the acting team's reveal scores it", () => {
    const table = fourPlayerTable();
    table.draw();
    table.pickCategory();
    table.choose('mid');
    const presented = activeQuestion(table.state(), SEED_PACK);
    if (presented === null) throw new Error('no live question');

    // Player 2 (Recursive - not on the acting team) answers first.
    table.answerAs(2, presented.correctIndex as 0 | 1 | 2);
    expect(table.state().active).not.toBeNull();
    expect(table.state().history).toEqual([]);
    expect(table.state().rejected).toEqual([]);

    // The acting team's own answerer resolves it.
    table.answerAs(table.actorIndex(), presented.correctIndex as 0 | 1 | 2);
    const state = table.state();
    expect(state.active).toBeNull();
    expect(state.history).toHaveLength(1);
    const [record] = state.history;
    expect(record?.correct).toBe(true);
    expect(record?.answererId).toBe(
      table.player(table.actorIndex() === 0 ? 0 : table.actorIndex()).id,
    );
    expect(record?.otherAnswers).toEqual([
      {
        playerId: table.player(2).id,
        chosenIndex: presented.correctIndex,
        chosenText: presented.options[presented.correctIndex],
        correct: true,
      },
    ]);
  });

  it("a teammate's later reveal becomes a review row, not a second score", () => {
    const table = fourPlayerTable();
    table.draw();
    table.pickCategory();
    table.choose('mid');
    const presented = activeQuestion(table.state(), SEED_PACK);
    if (presented === null) throw new Error('no live question');
    const actor = table.actorIndex();
    const teammate = actor === 0 ? 1 : 0;
    const turnIndex = table.state().turnIndex;

    table.answerAs(actor, presented.correctIndex as 0 | 1 | 2, turnIndex);
    const scoreAfterFirst = table.state().scores;

    // The turn already resolved and `state.turnIndex` has moved on - the
    // teammate's reveal must still be stamped for the turn that was live
    // when they saw the question, not whatever is dealing next.
    const wrongIndex = ((presented.correctIndex + 1) % 3) as 0 | 1 | 2;
    table.answerAs(teammate, wrongIndex, turnIndex);

    const state = table.state();
    expect(state.scores).toEqual(scoreAfterFirst);
    expect(state.history).toHaveLength(1);
    expect(state.history[0]?.otherAnswers).toContainEqual({
      playerId: table.player(teammate).id,
      chosenIndex: wrongIndex,
      chosenText: presented.options[wrongIndex],
      correct: false,
    });
    expect(state.rejected).toEqual([]);
  });

  it('rejects a second commit from the same player for the same turn', () => {
    const table = fourPlayerTable();
    table.draw();
    table.pickCategory();
    table.choose('mid');
    table.commitAnswerOnly(2, 0);
    table.commitAnswerOnly(2, 1);
    expect(
      table.state().rejected.some((r) => r.reason === 'already committed for this subject'),
    ).toBe(true);
    expect(unrevealedCommits(table.state(), `answer:${table.state().turnIndex}`)).toEqual([
      table.player(2).id,
    ]);
  });

  it('rejects a commit from a player who already revealed for this turn', () => {
    const table = fourPlayerTable();
    table.draw();
    table.pickCategory();
    table.choose('mid');
    table.answerAs(2, 0);
    table.commitAnswerOnly(2, 1);
    expect(
      table.state().rejected.some((r) => r.reason === 'already revealed for this subject'),
    ).toBe(true);
  });

  it('refuses a reveal whose payload is not a valid option index, and never scores it', () => {
    const table = fourPlayerTable();
    table.draw();
    table.pickCategory();
    table.choose('mid');
    const actor = table.player(table.actorIndex());
    const turnIndex = table.state().turnIndex;
    const salt = randomHex(8);
    table.push(commitAnswer(table.log, actor, turnIndex, 7, salt));
    table.push(revealAnswer(table.log, actor, turnIndex, 7, salt));
    const state = table.state();
    expect(state.active).not.toBeNull();
    expect(state.history).toEqual([]);
    expect(state.rejected.some((r) => r.reason === 'malformed or unresolvable turn answer')).toBe(
      true,
    );
  });

  it("replays identically no matter what order gossip delivers several players' commits and reveals in", () => {
    const table = fourPlayerTable();
    table.draw();
    table.pickCategory();
    table.choose('mid');
    const turnIndex = table.state().turnIndex;

    // Everyone commits, then reveals in a different order than they
    // committed in - a realistic gossip interleaving, not just a replay of
    // the same order twice.
    const salts = [0, 1, 2, 3].map(() => randomHex(8));
    const commits: SignedEvent[] = [0, 1, 2, 3].map((i) =>
      commitAnswer(table.log, table.player(i), turnIndex, (i % 3) as 0 | 1 | 2, salts[i] as string),
    );
    for (const event of commits) table.log.insert(event);

    const revealOrder = [2, 0, 3, 1];
    const reveals: SignedEvent[] = revealOrder.map((i) =>
      revealAnswer(table.log, table.player(i), turnIndex, (i % 3) as 0 | 1 | 2, salts[i] as string),
    );
    for (const event of reveals) table.log.insert(event);

    const canonicalEvents = table.log.events;
    const canonicalState = reduce(canonicalEvents, { pack: SEED_PACK });
    expect(canonicalState?.active).toBeNull();
    expect(canonicalState?.history).toHaveLength(1);
    // Player 0 (Analytical, the acting team) is whichever of {0, 1} the
    // interleaving above happens to resolve on - what matters here is that
    // exactly one of them scored and the other three all show up as review
    // rows, regardless of the order gossip delivered them in.
    expect(canonicalState?.history[0]?.otherAnswers).toHaveLength(3);

    // Two peers who received the exact same events in different arrival
    // orders must fold to the same state - EventLog sorts on insert by
    // (lamport, author, seq), independent of insertion order (see log.ts).
    const forwardLog = new EventLog(table.log.gameId);
    for (const event of canonicalEvents) forwardLog.insert(event);

    const backwardLog = new EventLog(table.log.gameId);
    for (const event of [...canonicalEvents].reverse()) backwardLog.insert(event);

    const forwardState = reduce(forwardLog.events, { pack: SEED_PACK });
    const backwardState = reduce(backwardLog.events, { pack: SEED_PACK });
    expect(backwardState).toEqual(forwardState);
    expect(backwardState).toEqual(canonicalState);
  });
});
