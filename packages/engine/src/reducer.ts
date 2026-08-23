import { CATEGORY_IDS } from './categories.js';
import type { GameEventBody, SignedEvent } from './events.js';
import { pickFromPool, presentQuestion, questionById, selectQuestion } from './pack.js';
import { createRng } from './rng.js';
import type { RulesConfig } from './rules.js';
import { DIFFICULTY_TIERS, normalizeRules } from './rules.js';
import type {
  ActiveTurn,
  CategoryId,
  ContentPack,
  Difficulty,
  GameId,
  GamePhase,
  Player,
  PlayerId,
  Question,
  QuestionId,
  Team,
  TeamId,
  TurnRecord,
} from './types.js';

/**
 * Everything a client needs to render, derived from nothing but the log.
 *
 * There is deliberately no `now`, no socket, no "is connected" in here:
 * presence is not log data, so it can never feed a rule. Two peers with the
 * same events agree on this object exactly, which is what lets a game with no
 * server have no referee either.
 */
export interface GameState {
  readonly gameId: GameId;
  readonly name: string;
  readonly joinCode: string;
  readonly hostId: PlayerId;
  readonly packHash: string;
  readonly rules: RulesConfig;
  readonly phase: GamePhase;
  readonly players: Readonly<Record<PlayerId, Player>>;
  readonly teams: readonly Team[];
  /** Players present but not playing: late arrivals, or the un-teamed. */
  readonly spectatorIds: readonly PlayerId[];
  readonly turnOrder: readonly TeamId[];
  readonly scores: Readonly<Record<TeamId, number>>;
  /** Turns each team has been dealt; drives answerer rotation. */
  readonly teamTurns: Readonly<Record<TeamId, number>>;
  readonly turnIndex: number;
  readonly roundIndex: number;
  /** Index into `turnOrder` of the team currently up. */
  readonly cursor: number;
  /** Consecutive correct answers by the team currently holding the turn. */
  readonly streak: number;
  readonly bag: readonly CategoryId[];
  readonly bagCycle: number;
  readonly asked: readonly QuestionId[];
  readonly active: ActiveTurn | null;
  readonly history: readonly TurnRecord[];
  /**
   * Round in which someone first crossed the target. What happens next
   * depends on `rules.finishTheRound`: when true (R-5), the game ends once a
   * *later* round completes, so every team gets the same number of turns;
   * when false (the default), the game ends the instant this round's already
   * in-flight turn resolves - see {@link armEndgameIfCrossed}.
   */
  readonly endgameArmedRound: number | null;
  readonly suddenDeath: boolean;
  readonly winnerTeamId: TeamId | null;
  /** Host-only door lock: blocks brand-new `player/joined`, never an already-known player. */
  readonly locked: boolean;
  /** Players the host has kicked. Every future event from one of these ids is refused. */
  readonly bannedIds: readonly PlayerId[];
  /** Events the reducer refused, with a reason. Surfaced for debugging, not play. */
  readonly rejected: readonly { readonly id: string; readonly reason: string }[];
}

export interface ReduceOptions {
  readonly pack: ContentPack;
}

/** How many categories the dealing side gets to choose among. */
export const CATEGORY_OPTIONS_COUNT = 3;

/**
 * Fold a log into state. Pure, total, and safe against hostile input: an event
 * that breaks a rule is recorded in `rejected` and ignored, never applied and
 * never thrown.
 *
 * Returns `null` until a valid `game/created` has been seen.
 */
export function reduce(events: readonly SignedEvent[], options: ReduceOptions): GameState | null {
  let state: GameState | null = null;
  const rejected: { id: string; reason: string }[] = [];
  // There is no rate limit on how many bad events a hostile peer can send
  // (see MAX_LOG_EVENTS in log.ts for the log-size half of this), and this
  // array gets rebuilt from scratch on every single fold - without a cap, a
  // flood's cost to every other device grows without bound on every render,
  // not just once. Diagnostics only need the recent tail; a client debugging
  // "why didn't my team show up" cares about the last few rejections, not a
  // complete history of a flood.
  const REJECTED_LIMIT = 200;

  for (const event of events) {
    if (state === null) {
      if (event.body.type !== 'game/created') {
        pushRejection(rejected, event.id, `${event.body.type} before game/created`, REJECTED_LIMIT);
        continue;
      }
      state = createState(event, event.body);
      continue;
    }
    const result = apply(state, event, options.pack);
    if (typeof result === 'string') pushRejection(rejected, event.id, result, REJECTED_LIMIT);
    else state = result;
  }

  if (state === null) return null;
  return { ...state, rejected };
}

function createState(event: SignedEvent, body: Extract<GameEventBody, { type: 'game/created' }>): GameState {
  return {
    gameId: event.gameId,
    name: body.name,
    joinCode: body.joinCode,
    hostId: event.author,
    packHash: body.packHash,
    rules: normalizeRules(body.rules),
    phase: 'lobby',
    players: {},
    teams: [],
    spectatorIds: [],
    turnOrder: [],
    scores: {},
    teamTurns: {},
    turnIndex: 0,
    roundIndex: 0,
    cursor: 0,
    streak: 0,
    bag: [],
    bagCycle: 0,
    asked: [],
    active: null,
    history: [],
    endgameArmedRound: null,
    suddenDeath: false,
    winnerTeamId: null,
    locked: false,
    bannedIds: [],
    rejected: [],
  };
}

/** Returns the next state, or a rejection reason. */
function apply(state: GameState, event: SignedEvent, pack: ContentPack): GameState | string {
  const body = event.body;
  const author = event.author;

  // Checked before any event-specific rule, and for every event type
  // without exception: a kick is supposed to be final. Letting a banned
  // player's own re-announcement (or anything else they sign) back in
  // through a case-by-case check would make "kicked" mean "kicked until
  // your next player/joined," which is not a ban.
  if (state.bannedIds.includes(author)) return 'you have been removed from this game by the host';

  switch (body.type) {
    case 'game/created':
      return 'duplicate game/created';

    case 'player/joined': {
      const known = state.players[author] !== undefined;
      // The lock only ever stops a *stranger* nobody has seen yet - an
      // already-known player re-announcing (a reconnect, most commonly)
      // is never what "close the door" was meant to block.
      if (state.locked && !known) return 'this room is locked';
      const player: Player = { id: author, username: body.username, publicKey: event.pub };
      const players = { ...state.players, [author]: player };
      const onTeam = state.teams.some((t) => t.memberIds.includes(author));
      const spectatorIds =
        known || onTeam || state.spectatorIds.includes(author)
          ? state.spectatorIds
          : [...state.spectatorIds, author];
      return { ...state, players, spectatorIds };
    }

    case 'team/created': {
      if (state.players[author] === undefined) return 'unknown player';
      if (state.phase !== 'lobby' && !state.rules.allowLateJoin) return 'game already started';
      if (state.teams.some((t) => t.id === body.teamId)) return 'team id taken';
      const team: Team = { id: body.teamId, name: body.name, memberIds: [] };
      return { ...state, teams: [...state.teams, team] };
    }

    case 'team/joined': {
      if (state.players[author] === undefined) return 'unknown player';
      if (state.phase !== 'lobby' && !state.rules.allowLateJoin) return 'game already started';
      if (!state.teams.some((t) => t.id === body.teamId)) return 'no such team';
      const teams = state.teams.map((team) =>
        team.id === body.teamId
          ? { ...team, memberIds: dedupe([...team.memberIds, author]) }
          : { ...team, memberIds: team.memberIds.filter((id) => id !== author) },
      );
      return {
        ...state,
        teams,
        spectatorIds: state.spectatorIds.filter((id) => id !== author),
      };
    }

    case 'team/left': {
      if (state.players[author] === undefined) return 'unknown player';
      if (state.phase !== 'lobby') return 'cannot leave a team mid-game';
      const teams = state.teams.map((team) =>
        team.id === body.teamId ? { ...team, memberIds: team.memberIds.filter((id) => id !== author) } : team,
      );
      return { ...state, teams, spectatorIds: dedupe([...state.spectatorIds, author]) };
    }

    case 'game/started': {
      if (author !== state.hostId) return 'only the host may start';
      if (state.phase !== 'lobby') return 'already started';
      const playing = state.teams.filter((t) => t.memberIds.length > 0);
      // Two players on one team is not a game (R-4).
      if (playing.length < state.rules.minTeams) return `needs ${state.rules.minTeams} teams with members`;
      const turnOrder = playing.map((t) => t.id);
      const scores: Record<TeamId, number> = {};
      const teamTurns: Record<TeamId, number> = {};
      for (const id of turnOrder) {
        scores[id] = 0;
        teamTurns[id] = 0;
      }
      return {
        ...state,
        phase: 'playing',
        turnOrder,
        scores,
        teamTurns,
        turnIndex: 0,
        roundIndex: 0,
        cursor: 0,
        streak: 0,
        bag: [],
        bagCycle: 0,
        active: null,
      };
    }

    case 'turn/drawn': {
      if (state.phase !== 'playing') return 'not playing';
      if (state.active !== null) return 'turn already drawn';
      if (body.turnIndex !== state.turnIndex) return 'stale turn index';
      if (state.players[author] === undefined) return 'unknown player';
      const teamId = currentTeamId(state);
      if (teamId === null) return 'no team up';
      // The acting team may not deal its own question, or it could precompute
      // the nonce and know the question before choosing a difficulty (R-10).
      if (memberOf(state, teamId, author)) return 'the acting team cannot draw its own question';
      if (typeof body.nonce !== 'string' || body.nonce.length < 8) return 'nonce too short';

      const { categoryIds, bag, bagCycle } = peekCategoryOptions(state, CATEGORY_OPTIONS_COUNT);
      const team = teamById(state, teamId);
      const turns = state.teamTurns[teamId] ?? 0;
      const nominatedId =
        team !== undefined && team.memberIds.length > 0
          ? (team.memberIds[turns % team.memberIds.length] as PlayerId)
          : null;

      const active: ActiveTurn = {
        turnIndex: state.turnIndex,
        roundIndex: state.roundIndex,
        teamId,
        nominatedId,
        categoryId: null,
        categoryOptions: categoryIds,
        nonce: body.nonce,
        difficulty: null,
        questionId: null,
        repeat: false,
        drawnBy: author,
      };
      return {
        ...state,
        bag,
        bagCycle,
        active,
        teamTurns: { ...state.teamTurns, [teamId]: turns + 1 },
      };
    }

    case 'turn/category': {
      const active = state.active;
      if (state.phase !== 'playing' || active === null) return 'no active turn';
      if (body.turnIndex !== active.turnIndex) return 'stale turn index';
      if (active.categoryId !== null) return 'category already chosen';
      // Same restriction as turn/drawn (R-10): the side answering the question
      // does not get to pick which one it is.
      if (memberOf(state, active.teamId, author)) return 'the acting team cannot choose its own category';
      if (!active.categoryOptions.includes(body.categoryId)) return 'not one of the offered categories';

      // Only the chosen category leaves the bag - the two offers nobody
      // picked are still owed a turn (R-6), so they stay in place rather
      // than being spent just for having been shown.
      return {
        ...state,
        bag: removeFirst(state.bag, body.categoryId),
        active: { ...active, categoryId: body.categoryId },
      };
    }

    case 'turn/difficulty': {
      const active = state.active;
      if (state.phase !== 'playing' || active === null) return 'no active turn';
      if (body.turnIndex !== active.turnIndex) return 'stale turn index';
      if (active.categoryId === null) return 'no category chosen yet';
      if (active.difficulty !== null) return 'difficulty already chosen';
      if (!memberOf(state, active.teamId, author)) return 'not on the acting team';
      if (DIFFICULTY_TIERS[body.difficulty] === undefined) return 'unknown difficulty';

      const picked = pickQuestion(pack, active.categoryId, body.difficulty, active.nonce, state.asked);
      if (picked.question === null) return 'no question available';
      return {
        ...state,
        active: {
          ...active,
          difficulty: body.difficulty,
          questionId: picked.question.id,
          repeat: picked.repeat,
        },
        asked: dedupe([...state.asked, picked.question.id]),
      };
    }

    case 'turn/answered': {
      const active = state.active;
      if (state.phase !== 'playing' || active === null) return 'no active turn';
      if (body.turnIndex !== active.turnIndex) return 'stale turn index';
      if (active.difficulty === null || active.questionId === null) return 'no question yet';
      if (!memberOf(state, active.teamId, author)) return 'not on the acting team';
      const question = questionById(pack, active.questionId);
      if (question === undefined) return 'question missing from pack';
      const presented = presentQuestion(question, active.nonce);
      if (!Number.isInteger(body.chosenIndex) || body.chosenIndex < 0 || body.chosenIndex > 3) {
        return 'option out of range';
      }
      // Just validated as an integer 0-3 above.
      const chosenIndex = body.chosenIndex as 0 | 1 | 2 | 3;
      return resolve(state, active, {
        answererId: author,
        chosenIndex,
        chosenText: presented.options[chosenIndex] ?? null,
        correct: body.chosenIndex === presented.correctIndex,
        difficulty: active.difficulty,
        timedOut: false,
      });
    }

    case 'turn/timeout': {
      const active = state.active;
      if (state.phase !== 'playing' || active === null) return 'no active turn';
      if (body.turnIndex !== active.turnIndex) return 'stale turn index';
      // Any peer may call time, including a peer on the acting team, because the
      // alternative is a game that waits forever on one locked phone (R-3).
      if (state.players[author] === undefined) return 'unknown player';
      // Timing out before choosing a level still costs something, at the
      // cheapest tier: doing nothing must not be free.
      const difficulty: Difficulty = active.difficulty ?? 'low';
      return resolve(state, active, {
        answererId: null,
        chosenIndex: -1,
        chosenText: null,
        correct: false,
        difficulty,
        timedOut: true,
      });
    }

    case 'room/locked': {
      if (author !== state.hostId) return 'only the host may lock the room';
      if (state.locked === body.locked) return state; // idempotent, nothing to fold
      return { ...state, locked: body.locked };
    }

    case 'player/kicked': {
      if (author !== state.hostId) return 'only the host may kick a player';
      if (body.targetId === state.hostId) return 'the host cannot kick themselves';
      if (state.bannedIds.includes(body.targetId)) return state; // already banned
      // Deliberately not handled: kicking the last member of a team
      // mid-game leaves that team in `turnOrder` with nobody able to act on
      // its turn. Same shape of problem as everyone on a team going
      // permanently offline - not new, and not solved here; a real fix
      // would be a team-elimination mechanic, which is a separate feature.
      const teams = state.teams.map((team) => ({
        ...team,
        memberIds: team.memberIds.filter((id) => id !== body.targetId),
      }));
      return {
        ...state,
        teams,
        spectatorIds: state.spectatorIds.filter((id) => id !== body.targetId),
        bannedIds: [...state.bannedIds, body.targetId],
      };
    }

    default: {
      // Deliberately reports only the type, not the full body: every field in
      // today's event union is public game data, but a rejection reason ends
      // up in console.warn (see store.ts), and there is no reason to make a
      // future event type's contents a de facto logging channel by habit.
      const exhaustive: never = body;
      const unknownType = (exhaustive as { type?: unknown })?.type;
      return `unknown event type ${typeof unknownType === 'string' ? unknownType : '(unreadable)'}`;
    }
  }
}

interface Resolution {
  readonly answererId: PlayerId | null;
  readonly chosenIndex: 0 | 1 | 2 | 3 | -1;
  readonly chosenText: string | null;
  readonly correct: boolean;
  readonly difficulty: Difficulty;
  readonly timedOut: boolean;
}

/** Score it, record it, then either keep the turn or pass it on. */
function resolve(state: GameState, active: ActiveTurn, res: Resolution): GameState {
  const tier = DIFFICULTY_TIERS[res.difficulty];
  const delta = res.correct ? tier.award : tier.penalty;
  const previous = state.scores[active.teamId] ?? 0;
  const raw = previous + delta;
  const score = state.rules.scoreFloor === null ? raw : Math.max(state.rules.scoreFloor, raw);

  const record: TurnRecord = {
    turnIndex: active.turnIndex,
    roundIndex: active.roundIndex,
    teamId: active.teamId,
    answererId: res.answererId,
    // A timeout can land before the dealer ever picked a category (R-3: any
    // peer may call time rather than let a stalled turn wait forever).
    categoryId: active.categoryId ?? '',
    difficulty: res.difficulty,
    questionId: active.questionId ?? '',
    chosenIndex: res.chosenIndex,
    chosenText: res.chosenText,
    correct: res.correct,
    delta,
    timedOut: res.timedOut,
  };

  const streak = res.correct ? state.streak + 1 : 0;
  const capped =
    state.rules.maxCorrectStreakPerTurn !== null && streak >= state.rules.maxCorrectStreakPerTurn;
  // Spec-faithful: a correct answer returns the turn to the same team, without
  // limit, unless a house rule caps it (R-1).
  const keepTurn = res.correct && !capped;

  let next: GameState = {
    ...state,
    scores: { ...state.scores, [active.teamId]: score },
    history: [...state.history, record],
    streak: keepTurn ? streak : 0,
    turnIndex: state.turnIndex + 1,
    active: null,
  };

  next = armEndgameIfCrossed(next);
  if (!keepTurn) next = advanceCursor(next);
  return maybeFinish(next);
}

function armEndgameIfCrossed(state: GameState): GameState {
  if (state.endgameArmedRound !== null) return state;
  const reached = state.turnOrder.some((id) => (state.scores[id] ?? 0) >= state.rules.targetScore);
  if (!reached) return state;
  if (!state.rules.finishTheRound) {
    // Instant termination: the first team over the line wins outright, and the
    // teams later in the order got fewer turns. Off by default for that reason.
    return { ...state, endgameArmedRound: state.roundIndex - 1 };
  }
  return { ...state, endgameArmedRound: state.roundIndex };
}

function advanceCursor(state: GameState): GameState {
  const cursor = state.cursor + 1;
  if (cursor < state.turnOrder.length) return { ...state, cursor };
  return { ...state, cursor: 0, roundIndex: state.roundIndex + 1 };
}

function maybeFinish(state: GameState): GameState {
  if (state.endgameArmedRound === null) return state;
  if (state.roundIndex <= state.endgameArmedRound) return state;

  const leaders = leadingTeams(state);
  if (leaders.length === 1) {
    return { ...state, phase: 'finished', winnerTeamId: leaders[0] ?? null, active: null };
  }
  // Dead heat: keep playing, but only the tied teams, and re-check after each
  // further round. A shared first place is not a result.
  return {
    ...state,
    suddenDeath: true,
    turnOrder: leaders,
    cursor: 0,
    streak: 0,
    endgameArmedRound: state.roundIndex,
  };
}

function leadingTeams(state: GameState): TeamId[] {
  let best = Number.NEGATIVE_INFINITY;
  for (const id of state.turnOrder) best = Math.max(best, state.scores[id] ?? 0);
  return state.turnOrder.filter((id) => (state.scores[id] ?? 0) === best);
}

/**
 * Shuffled bag rather than independent draws, so the same category cannot come
 * up four turns running and read as a broken generator (R-6).
 *
 * Offering three options is a *peek*, not a draw: nothing leaves the bag here.
 * A category that gets shown but not picked still owes the deck a turn, so it
 * stays exactly where it was - only turn/category (the actual pick) removes
 * anything. This function only ever appends a fresh shuffle when the lookahead
 * runs short, never replaces what's already queued, so an in-progress cycle
 * is never cut short by a peek.
 */
function peekCategoryOptions(
  state: GameState,
  count: number,
): { categoryIds: CategoryId[]; bag: CategoryId[]; bagCycle: number } {
  let bag = state.bag.slice();
  let bagCycle = state.bagCycle;
  while (bag.length < count) {
    bag = [...bag, ...createRng(state.gameId, 'bag', bagCycle).shuffle(CATEGORY_IDS)];
    bagCycle += 1;
  }
  const categoryIds: CategoryId[] = [];
  for (const id of bag) {
    if (categoryIds.length >= count) break;
    if (!categoryIds.includes(id)) categoryIds.push(id);
  }
  return { categoryIds, bag, bagCycle };
}

/** Drop the first occurrence of `id`, leaving everything else in place. */
function removeFirst(bag: readonly CategoryId[], id: CategoryId): CategoryId[] {
  const index = bag.indexOf(id);
  if (index === -1) return bag.slice();
  return [...bag.slice(0, index), ...bag.slice(index + 1)];
}

/**
 * Question choice with graceful degradation: exact cell, then the same tier in
 * any category, then anything. A long game must not be able to hard-stall on an
 * exhausted pool.
 */
function pickQuestion(
  pack: ContentPack,
  category: CategoryId,
  difficulty: Difficulty,
  nonce: string,
  asked: readonly QuestionId[],
): { question: Question | null; repeat: boolean } {
  const exact = selectQuestion({ pack, category, difficulty, nonce, exclude: asked });
  if (exact.question !== null) return exact;

  // The exact (category, tier) cell is empty - widen to the same tier across
  // every category rather than stalling. pickFromPool still prefers a fresh
  // question and only repeats one if that pool is exhausted too.
  const sameTier = pack.questions.filter((q) => q.difficulty === difficulty);
  return pickFromPool(sameTier, asked, createRng(nonce, 'fallback', difficulty));
}

export function currentTeamId(state: GameState): TeamId | null {
  return state.turnOrder[state.cursor] ?? null;
}

function teamById(state: GameState, teamId: TeamId): Team | undefined {
  return state.teams.find((t) => t.id === teamId);
}

function memberOf(state: GameState, teamId: TeamId, playerId: PlayerId): boolean {
  return teamById(state, teamId)?.memberIds.includes(playerId) ?? false;
}

function dedupe<T>(items: readonly T[]): T[] {
  return [...new Set(items)];
}

/** Keeps only the most recent `limit` rejections - see `reduce`'s REJECTED_LIMIT. */
function pushRejection(
  rejected: { id: string; reason: string }[],
  id: string,
  reason: string,
  limit: number,
): void {
  rejected.push({ id, reason });
  if (rejected.length > limit) rejected.splice(0, rejected.length - limit);
}
