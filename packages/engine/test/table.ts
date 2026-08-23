import {
  activeQuestion,
  answerTurn,
  callTimeout,
  chooseCategory,
  chooseDifficulty,
  createGame,
  createIdentity,
  drawTurn,
  EventLog,
  isActingPlayer,
  joinTeam,
  makeEvent,
  openTeam,
  reduce,
  SEED_PACK,
  SEED_PACK_HASH,
  startGame,
  type CategoryId,
  type Difficulty,
  type GameState,
  type Identity,
  type RulesConfig,
  type SignedEvent,
  type TeamId,
} from '../src/index.js';

/**
 * A whole game around one table, driven synchronously.
 *
 * Tests need to play hundreds of turns deterministically, so identities come
 * from fixed seeds and events are stamped from a counter rather than the clock.
 * Nothing here touches the network: the engine cannot tell the difference
 * between this and four phones in a pub, which is exactly the point.
 */
export class Table {
  readonly identities: Identity[];
  readonly log: EventLog;
  readonly joinCode: string;
  private clock = 1_700_000_000_000;

  constructor(usernames: readonly string[], rules?: Partial<RulesConfig>) {
    this.identities = usernames.map((name, index) => createIdentity(name, seedFor(index)));
    const host = this.identities[0] as Identity;
    let created: EventLog | undefined;
    const game = createGame({
      identity: host,
      name: 'Test game',
      packHash: SEED_PACK_HASH,
      ...(rules === undefined ? {} : { rules }),
      makeLog: (gameId) => {
        created = new EventLog(gameId);
        return created;
      },
      now: this.tick(),
    });
    if (created === undefined) throw new Error('createGame did not build a log');
    this.log = created;
    this.joinCode = game.joinCode;
    for (const identity of this.identities.slice(1)) this.announce(identity);
  }

  private tick(): number {
    this.clock += 1_000;
    return this.clock;
  }

  /** Insert an event, failing loudly if the log itself refuses it. */
  push(event: SignedEvent): SignedEvent {
    const result = this.log.insert(event);
    if (!result.accepted) throw new Error(`log refused an event: ${result.reason}`);
    return event;
  }

  announce(identity: Identity): SignedEvent {
    return this.push(
      makeEvent(
        this.log,
        identity,
        { type: 'player/joined', username: identity.username },
        this.tick(),
      ),
    );
  }

  state(): GameState {
    const state = reduce(this.log.events, { pack: SEED_PACK });
    if (state === null) throw new Error('no game/created in the log');
    return state;
  }

  player(index: number): Identity {
    const identity = this.identities[index];
    if (identity === undefined) throw new RangeError(`no player ${index}`);
    return identity;
  }

  /** Create a team and put the listed players on it. */
  team(name: string, playerIndexes: readonly number[]): TeamId {
    const owner = this.player(playerIndexes[0] ?? 0);
    const created = this.push(openTeam(this.log, owner, name));
    if (created.body.type !== 'team/created') throw new Error('expected team/created');
    const teamId = created.body.teamId;
    for (const index of playerIndexes) this.push(joinTeam(this.log, this.player(index), teamId));
    return teamId;
  }

  start(): void {
    this.push(startGame(this.log, this.player(0)));
  }

  /** A player who is allowed to deal the current question. */
  drawerIndex(): number {
    const state = this.state();
    for (let i = 0; i < this.identities.length; i += 1) {
      const id = this.player(i).id;
      if (state.players[id] !== undefined && !isActingPlayer(state, id)) return i;
    }
    throw new Error('nobody may draw: every known player is on the acting team');
  }

  /** A player on the acting team. */
  actorIndex(): number {
    const state = this.state();
    for (let i = 0; i < this.identities.length; i += 1) {
      if (isActingPlayer(state, this.player(i).id)) return i;
    }
    throw new Error('no acting player');
  }

  draw(): void {
    this.push(drawTurn(this.log, this.player(this.drawerIndex()), this.state().turnIndex));
  }

  /** Pick the first of the three offered categories, by whoever may deal. */
  pickCategory(): CategoryId {
    const state = this.state();
    const options = state.active?.categoryOptions ?? [];
    const categoryId = options[0];
    if (categoryId === undefined) throw new Error('no category options to pick from');
    this.push(chooseCategory(this.log, this.player(this.drawerIndex()), state.turnIndex, categoryId));
    return categoryId;
  }

  choose(difficulty: Difficulty): void {
    this.push(
      chooseDifficulty(this.log, this.player(this.actorIndex()), this.state().turnIndex, difficulty),
    );
  }

  /** Answer the live question, deliberately right or wrong. */
  answer(correct: boolean): void {
    const state = this.state();
    const presented = activeQuestion(state, SEED_PACK);
    if (presented === null) throw new Error('no live question to answer');
    const chosen = correct ? presented.correctIndex : (presented.correctIndex + 1) % 4;
    this.push(answerTurn(this.log, this.player(this.actorIndex()), state.turnIndex, chosen));
  }

  timeout(byIndex = 0): void {
    this.push(callTimeout(this.log, this.player(byIndex), this.state().turnIndex));
  }

  /** One complete turn: deal, pick a category, bet, answer. */
  playTurn(difficulty: Difficulty, correct: boolean): void {
    this.draw();
    this.pickCategory();
    this.choose(difficulty);
    this.answer(correct);
  }
}

// Deterministic 32-byte secret keys, so a failing test fails the same way twice.
function seedFor(index: number): string {
  return (index + 1).toString(16).padStart(2, '0').repeat(32);
}
