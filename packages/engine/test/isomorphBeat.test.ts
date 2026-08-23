import { describe, expect, it } from 'vitest';

import {
  attemptRecordsFromHistory,
  canAnswerIsomorph,
  CATEGORY_IDS,
  chooseCategory,
  chooseDifficulty,
  commitAnswer,
  commitIsomorphAnswer,
  createGame,
  createIdentity,
  createRng,
  drawTurn,
  EventLog,
  hasAnsweredIsomorph,
  isomorphAnsweredPlayerIds,
  isomorphAnswersForTurn,
  isomorphForTurn,
  joinTeam,
  makeEvent,
  openTeam,
  pickFromPool,
  presentQuestion,
  randomHex,
  reduce,
  revealAnswer,
  revealIsomorphAnswer,
  startGame,
  type CategoryId,
  type ContentPack,
  type GameState,
  type Identity,
  type Question,
  type SignedEvent,
} from '../src/index.js';

/**
 * Phase D (DESIGN.md §5.1's confer beat): the isomorphic follow-up item every
 * seated player answers individually, no discussion, once a resolved
 * question carries an `isomorph_group_id` with an available sibling and the
 * table has `rules.conferBeatEnabled` on.
 *
 * A tiny hand-built pack, not SEED_PACK: `pickQuestion`'s fallback tier
 * (reducer.ts) widens to every category at the dealt difficulty the instant
 * the exact (category, difficulty) cell is empty, so a pack holding only the
 * items a test cares about at one difficulty gets dealt regardless of which
 * of the 18 real category ids the bag happens to offer - no need to steer
 * the category bag at all.
 */
function question(id: string, isomorphGroup: string | undefined, answer: 0 | 1 | 2 = 0): Question {
  return {
    id,
    category: 'menu-animal',
    difficulty: 'high',
    prompt: `prompt for ${id}`,
    options: ['right', 'mid', 'wrong'],
    answer,
    explanation: `explanation for ${id}`,
    ...(isomorphGroup === undefined ? {} : { isomorph_group_id: isomorphGroup }),
  };
}

const PACK: ContentPack = {
  id: 'isomorph-test-pack',
  version: '1',
  name: 'Isomorph beat test pack',
  categories: [],
  questions: [
    question('iso-a', 'grp-1'),
    question('iso-b', 'grp-1'),
    // A lone, untagged item at the same tier so "no group id" and "group of
    // one" both stay reachable in the same pool.
    question('lone', undefined),
  ],
};

/** Same shape as test/table.ts's Table, parameterised over the pack so it can use the fixture above instead of SEED_PACK. */
class IsoTable {
  readonly identities: Identity[];
  readonly log: EventLog;
  private clock = 1_700_000_000_000;

  constructor(usernames: readonly string[], rules: { conferBeatEnabled?: boolean } = {}) {
    this.identities = usernames.map((name, index) => createIdentity(name, seedFor(index)));
    const host = this.identities[0] as Identity;
    let created: EventLog | undefined;
    createGame({
      identity: host,
      name: 'Isomorph test game',
      packHash: 'test-hash',
      rules,
      makeLog: (gameId) => {
        created = new EventLog(gameId);
        return created;
      },
      now: this.tick(),
    });
    if (created === undefined) throw new Error('createGame did not build a log');
    this.log = created;
    for (const identity of this.identities.slice(1)) {
      this.push(makeEvent(this.log, identity, { type: 'player/joined', username: identity.username }, this.tick()));
    }
  }

  private tick(): number {
    this.clock += 1_000;
    return this.clock;
  }

  push(event: SignedEvent): SignedEvent {
    const result = this.log.insert(event);
    if (!result.accepted) throw new Error(`log refused an event: ${result.reason}`);
    return event;
  }

  state(): GameState {
    const state = reduce(this.log.events, { pack: PACK });
    if (state === null) throw new Error('no game/created in the log');
    return state;
  }

  player(index: number): Identity {
    const identity = this.identities[index];
    if (identity === undefined) throw new RangeError(`no player ${index}`);
    return identity;
  }

  team(name: string, playerIndexes: readonly number[]): void {
    const owner = this.player(playerIndexes[0] ?? 0);
    const created = this.push(openTeam(this.log, owner, name));
    if (created.body.type !== 'team/created') throw new Error('expected team/created');
    for (const index of playerIndexes) this.push(joinTeam(this.log, this.player(index), created.body.teamId));
  }

  start(): void {
    this.push(startGame(this.log, this.player(0)));
  }

  drawerIndex(): number {
    const state = this.state();
    for (let i = 0; i < this.identities.length; i += 1) {
      const id = this.player(i).id;
      const acting = state.turnOrder[state.cursor];
      const onActingTeam = state.teams.find((t) => t.id === acting)?.memberIds.includes(id) ?? false;
      if (state.players[id] !== undefined && !onActingTeam) return i;
    }
    throw new Error('nobody may draw');
  }

  actorIndex(): number {
    const state = this.state();
    const acting = state.turnOrder[state.cursor];
    for (let i = 0; i < this.identities.length; i += 1) {
      if (state.teams.find((t) => t.id === acting)?.memberIds.includes(this.player(i).id) ?? false) return i;
    }
    throw new Error('no acting player');
  }

  /** Deal, pick whichever category is offered first, and bet `difficulty`. */
  dealAt(difficulty: 'low' | 'mid' | 'high'): void {
    const turnIndex = this.state().turnIndex;
    this.push(drawTurn(this.log, this.player(this.drawerIndex()), turnIndex));
    this.finishDeal(turnIndex, difficulty);
  }

  /** Same as {@link dealAt}, but with a caller-chosen nonce - lets a test pin down exactly which pack item gets dealt. */
  dealWithNonce(nonce: string, difficulty: 'low' | 'mid' | 'high'): void {
    const turnIndex = this.state().turnIndex;
    this.push(makeEvent(this.log, this.player(this.drawerIndex()), { type: 'turn/drawn', turnIndex, nonce }));
    this.finishDeal(turnIndex, difficulty);
  }

  private finishDeal(turnIndex: number, difficulty: 'low' | 'mid' | 'high'): void {
    const options = this.state().active?.categoryOptions ?? [];
    const categoryId = options[0];
    if (categoryId === undefined) throw new Error('no category options');
    this.push(chooseCategory(this.log, this.player(this.drawerIndex()), turnIndex, categoryId));
    this.push(chooseDifficulty(this.log, this.player(this.actorIndex()), turnIndex, difficulty));
  }

  answerAs(playerIndex: number, chosenIndex: 0 | 1 | 2, turnIndex = this.state().turnIndex): void {
    const player = this.player(playerIndex);
    const salt = randomHex(8);
    this.push(commitAnswer(this.log, player, turnIndex, chosenIndex, salt));
    this.push(revealAnswer(this.log, player, turnIndex, chosenIndex, salt));
  }

  answerIsomorphAs(playerIndex: number, chosenIndex: 0 | 1 | 2, turnIndex: number): void {
    const player = this.player(playerIndex);
    const salt = randomHex(8);
    this.push(commitIsomorphAnswer(this.log, player, turnIndex, chosenIndex, salt));
    this.push(revealIsomorphAnswer(this.log, player, turnIndex, chosenIndex, salt));
  }
}

/**
 * `pickQuestion` (reducer.ts, not exported) tries the exact (category,
 * difficulty) cell first and only falls back to a same-tier, any-category
 * pool - seeded by the *literal string* `'fallback'` rather than the
 * category - once that cell is empty. Every fixture question shares category
 * `menu-animal`, but the bag almost always offers one of the other 17 real
 * category ids first (see `finishDeal`, which always picks `options[0]`), so
 * the fallback branch is what actually runs in these tests - this predicts
 * exactly which branch the reducer takes, deterministically, so a
 * brute-forced nonce for one branch is never applied to the other.
 */
function firstOfferedCategory(gameId: string): CategoryId {
  return createRng(gameId, 'bag', 0).shuffle(CATEGORY_IDS)[0] as CategoryId;
}

/**
 * Brute-forces a `turn/drawn` nonce that makes `pickQuestion` land on
 * `targetId` for this specific table - deterministic once `gameId` (and
 * thus which category the bag offers first) is fixed. `turn/drawn`'s own
 * reducer check refuses anything under 8 chars ("nonce too short"), hence
 * the fixed prefix.
 */
function findNonceFor(gameId: string, targetId: string): string {
  const usesExactCell = firstOfferedCategory(gameId) === 'menu-animal';
  for (let i = 0; i < 2000; i += 1) {
    const nonce = `iso-nonce-${i}`;
    const rng = usesExactCell ? createRng(nonce, 'menu-animal', 'high') : createRng(nonce, 'fallback', 'high');
    const { question: picked } = pickFromPool(PACK.questions, [], rng);
    if (picked?.id === targetId) return nonce;
  }
  throw new Error(`no nonce found that deals ${targetId}`);
}

function seedFor(index: number): string {
  return (index + 1).toString(16).padStart(2, '0').repeat(32);
}

function fourPlayerTable(conferBeatEnabled: boolean): IsoTable {
  const table = new IsoTable(['Ada', 'Grace', 'Alan', 'Edsger'], { conferBeatEnabled });
  table.team('Analytical', [0, 1]);
  table.team('Recursive', [2, 3]);
  table.start();
  return table;
}

describe('confer beat isomorph follow-up (Phase D)', () => {
  it('is absent when the table has the rule off, even with a tagged sibling pair available', () => {
    const table = fourPlayerTable(false);
    table.dealAt('high');
    table.answerAs(table.actorIndex(), 0);
    const state = table.state();
    const [record] = state.history;
    expect(record?.isomorph).toBeNull();
    expect(isomorphForTurn(state, PACK, 0)).toBeNull();
  });

  it('is absent when the resolved item has no isomorph_group_id sibling, even with the rule on', () => {
    const table = fourPlayerTable(true);
    // 'lone' carries no isomorph_group_id at all - pin the deal to it with a
    // brute-forced nonce rather than leaving which of the pool's 3 items
    // gets dealt to chance.
    table.dealWithNonce(findNonceFor(table.log.gameId, 'lone'), 'high');
    expect(table.state().active?.questionId).toBe('lone');
    table.answerAs(table.actorIndex(), 0);
    expect(table.state().history[0]?.isomorph).toBeNull();
  });

  it('picks the sibling item, lets every seated player answer it individually, and touches neither score nor streak', () => {
    const table = fourPlayerTable(true);
    const turnIndex = table.state().turnIndex;
    table.dealWithNonce(findNonceFor(table.log.gameId, 'iso-a'), 'high');
    const dealtQuestionId = table.state().active?.questionId;
    expect(['iso-a', 'iso-b']).toContain(dealtQuestionId);

    const scoreBefore = table.state().scores;
    table.answerAs(table.actorIndex(), 0); // correct: option 0 is `answer` on every fixture question
    const resolved = table.state();
    const record = resolved.history.find((r) => r.turnIndex === turnIndex);
    expect(record?.isomorph).not.toBeNull();
    const isomorphQuestionId = record?.isomorph?.questionId;
    // The follow-up is the *other* member of the group, never the same item twice.
    expect(isomorphQuestionId).not.toBe(dealtQuestionId);
    expect(['iso-a', 'iso-b']).toContain(isomorphQuestionId);
    expect(record?.isomorph?.answers).toEqual([]);

    const presented = isomorphForTurn(resolved, PACK, turnIndex);
    expect(presented).not.toBeNull();
    expect(presented?.question.id).toBe(isomorphQuestionId);

    // Every seated player answers individually - not just the acting team.
    expect(canAnswerIsomorph(resolved, table.player(0).id, turnIndex)).toBe(true);
    for (let i = 0; i < 4; i += 1) {
      const correctIndex = presented?.correctIndex as 0 | 1 | 2;
      const chosen = (i % 2 === 0 ? correctIndex : ((correctIndex + 1) % 3)) as 0 | 1 | 2;
      table.answerIsomorphAs(i, chosen, turnIndex);
    }

    const after = table.state();
    expect(hasAnsweredIsomorph(after, table.player(0).id, turnIndex)).toBe(true);
    expect(canAnswerIsomorph(after, table.player(0).id, turnIndex)).toBe(false);
    expect(isomorphAnsweredPlayerIds(after, turnIndex)).toHaveLength(4);

    const answers = isomorphAnswersForTurn(after, turnIndex);
    expect(answers).toHaveLength(4);
    expect(answers.filter((a) => a.correct)).toHaveLength(2);

    // The main turn's own correct answer did score (scoreBefore != resolved's
    // scores); the load-bearing invariant is that nothing changes *again*
    // once the isomorph beat's four answers land on top of that.
    expect(resolved.scores).not.toEqual(scoreBefore);
    expect(after.scores).toEqual(resolved.scores);
    expect(after.streak).toEqual(resolved.streak);
  });

  it('accepts a late isomorph reveal after the turn is already history, same as a bystander turn answer', () => {
    const table = fourPlayerTable(true);
    const turnIndex = table.state().turnIndex;
    table.dealWithNonce(findNonceFor(table.log.gameId, 'iso-a'), 'high');
    table.answerAs(table.actorIndex(), 0);

    // Deal and resolve a second turn before anyone answers the first turn's
    // isomorph follow-up - replay order must not matter. What this second
    // turn deals is irrelevant to this test, so a random nonce is fine here.
    table.dealAt('high');
    table.answerAs(table.actorIndex(), 0);

    table.answerIsomorphAs(2, 0, turnIndex);
    const state = table.state();
    expect(isomorphAnswersForTurn(state, turnIndex)).toHaveLength(1);
    expect(isomorphAnswersForTurn(state, turnIndex)[0]?.playerId).toBe(table.player(2).id);
  });

  it('refuses an isomorph-shaped commit for a turn that never got a follow-up', () => {
    // `log.insert` only runs wire-level checks (signature, version, structural
    // shape - see checkEvent) - whether a *reducer* accepts an event only
    // shows up in `GameState.rejected` once the log is folded, so that is
    // what this test reads, not the log's own insert result.
    const table = fourPlayerTable(false);
    table.dealAt('high');
    table.answerAs(table.actorIndex(), 0);
    const turnIndex = 0;
    const salt = randomHex(8);
    const commitEvent = commitIsomorphAnswer(table.log, table.player(1), turnIndex, 0, salt);
    table.push(commitEvent); // commit/made is subject-agnostic (Phase A) - it always succeeds
    const revealEvent = revealIsomorphAnswer(table.log, table.player(1), turnIndex, 0, salt);
    table.push(revealEvent); // structurally well-formed, so the log itself accepts it

    const rejected = table.state().rejected;
    expect(rejected.some((r) => r.id === revealEvent.id && r.reason === 'malformed or unresolvable isomorph answer')).toBe(
      true,
    );
    expect(isomorphAnswersForTurn(table.state(), turnIndex)).toEqual([]);
  });

  it('feeds each player\'s isomorph answer into their own FSRS review log as role "answerer", excluded from the parent turn\'s scoring role', () => {
    const table = fourPlayerTable(true);
    const turnIndex = table.state().turnIndex;
    table.dealWithNonce(findNonceFor(table.log.gameId, 'iso-a'), 'high');
    const actor = table.actorIndex();
    const teammate = actor === 0 ? 1 : 0;
    table.answerAs(actor, 0);

    const resolved = table.state();
    const isomorphQuestionId = resolved.history[0]?.isomorph?.questionId as string;
    const presented = presentQuestion(
      PACK.questions.find((q) => q.id === isomorphQuestionId) as Question,
      resolved.turnNonces[turnIndex] as string,
    );
    table.answerIsomorphAs(teammate, presented.correctIndex as 0 | 1 | 2, turnIndex);

    const finalState = table.state();
    const records = attemptRecordsFromHistory(PACK, finalState.history, table.player(teammate).id, null);
    const isomorphRecord = records.find((r) => r.targetItem === isomorphQuestionId);
    expect(isomorphRecord).toMatchObject({
      role: 'answerer',
      targetItem: isomorphQuestionId,
      correct: true,
    });
  });
});
