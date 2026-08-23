import { describe, expect, it } from 'vitest';

import {
  attemptRecordsFromHistory,
  buildConfusionMatrix,
  computeCrossedASleepPeriod,
  resolveChosenItem,
  roleForTurn,
  type AttemptRecord,
  type ContentPack,
  type Question,
  type TurnRecord,
} from '../src/index.js';

const EXIT: Question = {
  id: 'exit',
  category: 'street-way',
  difficulty: 'low',
  prompt: '出口',
  options: ['exit', 'entrance', 'toilet'],
  answer: 0,
  explanation: 'exit',
  confusable_with: ['entrance'],
};

const ENTRANCE: Question = {
  id: 'entrance',
  category: 'street-way',
  difficulty: 'low',
  prompt: '入口',
  options: ['entrance', 'exit', 'toilet'],
  answer: 0,
  explanation: 'entrance',
  confusable_with: ['exit'],
};

const PACK: ContentPack = {
  id: 'test.confusion',
  version: '0.0.0',
  name: 'confusion test',
  categories: [{ id: 'street-way', name: 'Street way', glyph: '路' }],
  questions: [EXIT, ENTRANCE],
};

describe('resolveChosenItem', () => {
  it('finds the confusable item whose own option text was chosen', () => {
    expect(resolveChosenItem(PACK, EXIT, 'entrance')).toBe('entrance');
  });

  it('does not resolve against items outside confusable_with, even on a text match', () => {
    // 'toilet' is shared by both options arrays but neither question lists the
    // other as its confusable partner for that word, so this must stay null.
    const noRelation: Question = { ...EXIT, confusable_with: [] };
    expect(resolveChosenItem(PACK, noRelation, 'toilet')).toBeNull();
  });

  it('returns null for a timeout or an option no confusable item carries', () => {
    expect(resolveChosenItem(PACK, EXIT, null)).toBeNull();
    expect(resolveChosenItem(PACK, EXIT, 'nonsense')).toBeNull();
  });
});

describe('computeCrossedASleepPeriod', () => {
  const DAY = 86_400_000;

  it('is null with no prior review', () => {
    expect(computeCrossedASleepPeriod(null, Date.now())).toBeNull();
  });

  it('is false inside the same day, true a day or more later', () => {
    const now = Date.now();
    expect(computeCrossedASleepPeriod(now, now + DAY / 2)).toBe(false);
    expect(computeCrossedASleepPeriod(now, now + DAY)).toBe(true);
  });
});

describe('buildConfusionMatrix', () => {
  it('counts only wrong answers with a resolved chosen item', () => {
    const attempts: AttemptRecord[] = [
      {
        playerId: 'p1',
        mode: 'solo',
        role: 'answerer',
        targetItem: 'exit',
        chosenOption: 'entrance',
        chosenItem: 'entrance',
        correct: false,
        timestamp: 0,
        crossedASleepPeriod: null,
      },
      {
        playerId: 'p1',
        mode: 'solo',
        role: 'answerer',
        targetItem: 'exit',
        chosenOption: 'entrance',
        chosenItem: 'entrance',
        correct: false,
        timestamp: 1,
        crossedASleepPeriod: null,
      },
      // Correct answer: must not appear in the matrix even though chosenItem
      // could in principle resolve.
      {
        playerId: 'p1',
        mode: 'solo',
        role: 'answerer',
        targetItem: 'exit',
        chosenOption: 'exit',
        chosenItem: null,
        correct: true,
        timestamp: 2,
        crossedASleepPeriod: null,
      },
      // Wrong, but the distractor was not a known confusable - not a
      // cross-association, so it must not pollute the matrix either.
      {
        playerId: 'p1',
        mode: 'solo',
        role: 'answerer',
        targetItem: 'exit',
        chosenOption: 'toilet',
        chosenItem: null,
        correct: false,
        timestamp: 3,
        crossedASleepPeriod: null,
      },
    ];
    const matrix = buildConfusionMatrix(attempts);
    expect(matrix.get('exit')?.get('entrance')).toBe(2);
    expect(matrix.get('exit')?.size).toBe(1);
  });
});

describe('group attempt records from history', () => {
  const baseRecord: TurnRecord = {
    turnIndex: 0,
    roundIndex: 0,
    teamId: 'team_a',
    answererId: 'p1',
    categoryId: 'street-way',
    difficulty: 'low',
    questionId: 'exit',
    chosenIndex: 1,
    chosenText: 'entrance',
    correct: false,
    delta: -1,
    timedOut: false,
    at: 1_700_000_000_000,
    otherAnswers: [],
    isomorph: null,
  };

  it('assigns answerer to whoever submitted, resolves chosen_item, and carries the event timestamp', () => {
    const [record] = attemptRecordsFromHistory(PACK, [baseRecord], 'p1', 'team_a');
    expect(record).toMatchObject({
      mode: 'group',
      role: 'answerer',
      targetItem: 'exit',
      chosenOption: 'entrance',
      chosenItem: 'entrance',
      correct: false,
      timestamp: 1_700_000_000_000,
      crossedASleepPeriod: null,
    });
  });

  it('assigns co_committed to a teammate who did not answer, and observer otherwise', () => {
    expect(roleForTurn(baseRecord, 'p2', 'team_a')).toBe('co_committed');
    expect(roleForTurn(baseRecord, 'p3', 'team_b')).toBe('observer');
  });

  it('skips timeouts - nothing was chosen, so there is no chosen_option to log', () => {
    const timeout: TurnRecord = { ...baseRecord, answererId: null, chosenIndex: -1, chosenText: null, timedOut: true };
    expect(attemptRecordsFromHistory(PACK, [timeout], 'p1', 'team_a')).toEqual([]);
  });

  it('grades a non-answerer from their own revealed answer, not the acting team\'s', () => {
    // p2 is on the acting team but did not resolve the turn (p1 did) - per
    // DESIGN.md §5.1 beat 4 p2 still privately answered, correctly, even
    // though the team's own outcome (baseRecord) was wrong.
    const withBystander: TurnRecord = {
      ...baseRecord,
      otherAnswers: [{ playerId: 'p2', chosenIndex: 0, chosenText: 'exit', correct: true }],
    };
    const [record] = attemptRecordsFromHistory(PACK, [withBystander], 'p2', 'team_a');
    expect(record).toMatchObject({
      playerId: 'p2',
      role: 'co_committed',
      chosenOption: 'exit',
      // 'exit' is one of EXIT's own confusable partner's (ENTRANCE) option
      // texts, so resolveChosenItem resolves it there even though p2 got it
      // right - that resolution rule is orthogonal to this test's point.
      chosenItem: 'entrance',
      correct: true,
    });
  });

  it('produces no row for a player who never revealed an answer this turn', () => {
    expect(attemptRecordsFromHistory(PACK, [baseRecord], 'p3', 'team_b')).toEqual([]);
  });
});
