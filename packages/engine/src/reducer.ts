import { CATEGORY_IDS } from './categories.js';
import { commitHash, isWellFormedCommitHash } from './commitReveal.js';
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
  IsomorphRecord,
  OtherAnswer,
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
  /**
   * Generic commit-reveal primitive (Phase A of the universal-answer plan).
   * Keyed by a caller-defined `subject` - Phase B keys turn answers by
   * {@link answerSubject} - and then by author, so a `commit/made` lands
   * here until a matching `commit/revealed` moves it into {@link reveals}. A
   * narrower, turn-shaped structure (e.g. living on `ActiveTurn`) was
   * considered and rejected: `ActiveTurn` is cleared to `null` the instant a
   * turn resolves (see `resolve()`), which would erase a commit the very
   * moment a caller might need to check whether it was ever revealed (Phase
   * B's late-reveal handling in the `commit/revealed` case in `apply()`
   * depends on exactly this surviving past resolution).
   */
  readonly pendingCommits: Readonly<Record<string, Readonly<Record<PlayerId, PendingCommit>>>>;
  /** Successfully opened commitments. See {@link pendingCommits}. */
  readonly reveals: Readonly<Record<string, Readonly<Record<PlayerId, Revealed>>>>;
  /**
   * Phase B (universal-answer): `turnIndex` -> the `turn/drawn` nonce for
   * that turn, captured the instant it is dealt and never removed. Grading a
   * `commit/revealed` on the {@link answerSubject} for an already-resolved
   * turn (routine once every seated player may answer - see the
   * `commit/revealed` case in `apply()`) needs the same nonce
   * `presentQuestion` used to shuffle that turn's options, but `ActiveTurn`
   * (which also carries it) is gone the instant the turn resolves. Kept
   * outside `ActiveTurn` for the same reason {@link pendingCommits} is:
   * grading must still work after the thing that produced it is history.
   */
  readonly turnNonces: Readonly<Record<number, string>>;
  /** `turnIndex` -> the question dealt for that turn, captured at `turn/difficulty`. See {@link turnNonces}. */
  readonly turnQuestions: Readonly<Record<number, QuestionId>>;
  /**
   * DESIGN.md §5.1's confer beat: `turnIndex` -> the isomorphic follow-up
   * question picked at `resolve()` time, when `rules.conferBeatEnabled` is on
   * and the resolved question has an `isomorph_group_id` with an available
   * sibling. Kept outside `TurnRecord.isomorph` (which also names this
   * question) for the same reason {@link turnQuestions} is kept outside
   * `ActiveTurn`: grading a late `commit/revealed` on {@link isomorphSubject}
   * needs to look this up the same way regardless of how long ago the turn
   * resolved.
   */
  readonly isomorphQuestions: Readonly<Record<number, QuestionId>>;
}

/** A `commit/made` not yet matched by a valid `commit/revealed`. */
export interface PendingCommit {
  readonly commitHash: string;
  /** The committing event's `at`, for display only - see `SignedEvent.at`. */
  readonly at: number;
}

/** A `commit/revealed` that matched its prior commitment. */
export interface Revealed {
  readonly payload: unknown;
  readonly salt: string;
  /** The revealing event's `at`, for display only - see `SignedEvent.at`. */
  readonly at: number;
}

/** A `subject` longer than this is refused - see the `commit/made` case in `apply()`. */
const MAX_COMMIT_SUBJECT_LENGTH = 200;
/** Mirrors `turn/drawn`'s nonce-length floor: cheap defence against an all-zero salt. */
const MIN_SALT_LENGTH = 8;

/**
 * Phase B's commit-reveal subject for a turn's answer. Prefixed rather than
 * the bare turn index, so a later beat that also wants commit-reveal on the
 * same `turnIndex` (the recall beat's `spoken_attempt`, the confer beat's
 * isomorphic follow-up - both schema-only today, see `isomorph_group_id` in
 * types.ts) gets its own subject namespace instead of colliding with the
 * answer commitment for the same turn.
 */
const ANSWER_SUBJECT_PREFIX = 'answer:';
const ANSWER_SUBJECT_RE = /^answer:(\d+)$/;

/** The `commit/made`/`commit/revealed` subject for `turnIndex`'s answer (DESIGN.md §5.1 beat 4). */
export function answerSubject(turnIndex: number): string {
  return `${ANSWER_SUBJECT_PREFIX}${turnIndex}`;
}

/** Inverse of {@link answerSubject}; `null` for any subject that is not one (including a future beat's own subject). */
export function parseAnswerSubject(subject: string): number | null {
  const match = ANSWER_SUBJECT_RE.exec(subject);
  if (match === null) return null;
  const turnIndex = Number(match[1]);
  return Number.isSafeInteger(turnIndex) ? turnIndex : null;
}

const ISOMORPH_SUBJECT_PREFIX = 'isomorph:';
const ISOMORPH_SUBJECT_RE = /^isomorph:(\d+)$/;

/**
 * The `commit/made`/`commit/revealed` subject for `turnIndex`'s confer-beat
 * follow-up item (DESIGN.md §5.1's isomorphic item, "answered individually
 * with no discussion"). A distinct prefix from {@link answerSubject}, per
 * Phase A/B's own design intent: same generic commit-reveal primitive, a
 * separate subject namespace so the two never collide on the same turnIndex.
 */
export function isomorphSubject(turnIndex: number): string {
  return `${ISOMORPH_SUBJECT_PREFIX}${turnIndex}`;
}

/** Inverse of {@link isomorphSubject}; `null` for any subject that is not one. */
export function parseIsomorphSubject(subject: string): number | null {
  const match = ISOMORPH_SUBJECT_RE.exec(subject);
  if (match === null) return null;
  const turnIndex = Number(match[1]);
  return Number.isSafeInteger(turnIndex) ? turnIndex : null;
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
    pendingCommits: {},
    reveals: {},
    turnNonces: {},
    turnQuestions: {},
    isomorphQuestions: {},
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
        turnNonces: { ...state.turnNonces, [state.turnIndex]: body.nonce },
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
        turnQuestions: { ...state.turnQuestions, [active.turnIndex]: picked.question.id },
      };
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
      return resolve(
        state,
        active,
        {
          answererId: null,
          chosenIndex: -1,
          chosenText: null,
          correct: false,
          difficulty,
          timedOut: true,
          at: event.at,
        },
        pack,
      );
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

    case 'commit/made': {
      if (state.players[author] === undefined) return 'unknown player';
      if (
        typeof body.subject !== 'string' ||
        body.subject.length === 0 ||
        body.subject.length > MAX_COMMIT_SUBJECT_LENGTH
      ) {
        return 'malformed commit subject';
      }
      if (!isWellFormedCommitHash(body.commitHash)) return 'malformed commit hash';
      if (state.pendingCommits[body.subject]?.[author] !== undefined) {
        return 'already committed for this subject';
      }
      if (state.reveals[body.subject]?.[author] !== undefined) {
        return 'already revealed for this subject';
      }
      return {
        ...state,
        pendingCommits: {
          ...state.pendingCommits,
          [body.subject]: {
            ...state.pendingCommits[body.subject],
            [author]: { commitHash: body.commitHash, at: event.at },
          },
        },
      };
    }

    case 'commit/revealed': {
      if (state.players[author] === undefined) return 'unknown player';
      if (typeof body.subject !== 'string' || body.subject.length === 0) return 'malformed commit subject';
      const pending = state.pendingCommits[body.subject]?.[author];
      if (pending === undefined) return 'no matching commit for this subject';
      if (typeof body.salt !== 'string' || body.salt.length < MIN_SALT_LENGTH) return 'salt too short';
      // Honesty-assuming secrecy (see commitReveal.ts and the commit/made
      // doc comment in events.ts): this only proves the payload+salt being
      // broadcast now matches what this author committed to earlier. It
      // cannot prove the commit itself was made without having looked ahead
      // - there is no server to have hidden the payload from its own author.
      // What every *other* peer gets is the same guarantee R-10's drawer
      // nonce gives: cheating costs "modify your own client", not "read the
      // wire".
      if (commitHash(body.payload, body.salt) !== pending.commitHash) return 'commitment hash mismatch';

      const afterReveal: GameState = {
        ...state,
        pendingCommits: {
          ...state.pendingCommits,
          [body.subject]: withoutKey(state.pendingCommits[body.subject] ?? {}, author),
        },
        reveals: {
          ...state.reveals,
          [body.subject]: {
            ...state.reveals[body.subject],
            [author]: { payload: body.payload, salt: body.salt, at: event.at },
          },
        },
      };

      // Phase D (confer beat): a subject matching `isomorphSubject()`'s shape
      // grades against the turn's isomorphic follow-up item instead of its
      // main question, and - unlike every branch below - never resolves
      // anything or touches score/streak/bet. See DESIGN.md §5.1's "load-
      // bearing... but never scored" framing and `resolve()`'s isomorph setup.
      const isomorphTurnIndex = parseIsomorphSubject(body.subject);
      if (isomorphTurnIndex !== null) {
        const gradedIsomorph = gradeIsomorphAnswerPayload(pack, state, isomorphTurnIndex, body.payload);
        if (gradedIsomorph === null) return 'malformed or unresolvable isomorph answer';
        const isomorphAnswer: OtherAnswer = { playerId: author, ...gradedIsomorph };
        return {
          ...afterReveal,
          history: afterReveal.history.map((record) =>
            record.turnIndex === isomorphTurnIndex && record.isomorph !== null
              ? { ...record, isomorph: { ...record.isomorph, answers: [...record.isomorph.answers, isomorphAnswer] } }
              : record,
          ),
        };
      }

      // Below here is Phase B (universal-answer): `commit/made`/`commit/revealed`
      // stay fully generic (see above and commitReveal.ts) - only a subject
      // matching `answerSubject()`'s shape ever reaches this branch, so a
      // future beat minting its own subject on the same primitive is
      // unaffected. See DESIGN.md §5.1 beat 4.
      const turnIndex = parseAnswerSubject(body.subject);
      if (turnIndex === null) return afterReveal;

      const graded = gradeAnswerPayload(pack, state, turnIndex, body.payload);
      // Same posture the old `turn/answered` took on `chosenIndex` out of
      // range: an answer-shaped commitment whose revealed payload does not
      // actually grade (wrong shape, or a turn this table never dealt) is
      // refused outright rather than accepted as an empty no-op - the hash
      // matching only proves the payload was fixed before reveal, never that
      // its contents mean anything.
      if (graded === null) return 'malformed or unresolvable turn answer';

      const active = state.active;
      if (active !== null && active.turnIndex === turnIndex && memberOf(state, active.teamId, author)) {
        // The acting team carries the wager (§5.1 beat 4): the *first*
        // acting-team reveal to land resolves the turn, exactly as the old
        // single-submitter `turn/answered` did. `active` is cleared the
        // instant `resolve()` runs, so any further acting-team reveal for
        // this same subject necessarily falls through to the branch below
        // instead - no separate "already resolved" flag needed.
        if (active.difficulty === null) return 'no question yet';
        return resolve(
          afterReveal,
          active,
          {
            answererId: author,
            chosenIndex: graded.chosenIndex,
            chosenText: graded.chosenText,
            correct: graded.correct,
            difficulty: active.difficulty,
            timedOut: false,
            at: event.at,
          },
          pack,
        );
      }

      // Not the resolving reveal: either a bystander answering while the
      // turn is still open (their entry already sits in `afterReveal.reveals`
      // and `resolve()` above folds it into `otherAnswers` once the acting
      // team's own reveal lands), or this turn already resolved and this
      // reveal arrived late - patch the existing `TurnRecord` in place so a
      // late gossip order never loses an answer.
      const otherAnswer: OtherAnswer = { playerId: author, ...graded };
      return {
        ...afterReveal,
        history: afterReveal.history.map((record) =>
          record.turnIndex === turnIndex
            ? { ...record, otherAnswers: [...record.otherAnswers, otherAnswer] }
            : record,
        ),
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
  readonly chosenIndex: 0 | 1 | 2 | -1;
  readonly chosenText: string | null;
  readonly correct: boolean;
  readonly difficulty: Difficulty;
  readonly timedOut: boolean;
  readonly at: number;
}

/**
 * The shape a `commit/revealed` payload must have to grade as a turn answer -
 * the same contract the old `turn/answered.chosenIndex` field carried,
 * moved here now that the field lives inside an otherwise-opaque
 * `commit/revealed.payload`.
 */
function parseAnswerPayload(payload: unknown): { chosenIndex: 0 | 1 | 2 } | null {
  if (typeof payload !== 'object' || payload === null) return null;
  const chosenIndex = (payload as { chosenIndex?: unknown }).chosenIndex;
  if (!Number.isInteger(chosenIndex) || (chosenIndex as number) < 0 || (chosenIndex as number) > 2) {
    return null;
  }
  return { chosenIndex: chosenIndex as 0 | 1 | 2 };
}

/**
 * Grades a `commit/revealed` payload against `turnIndex`'s dealt question,
 * using {@link GameState.turnNonces}/{@link GameState.turnQuestions} rather
 * than `ActiveTurn` so this works identically whether the turn is still live
 * or long since resolved (see the `commit/revealed` case in `apply()`).
 * `null` covers both "not a well-formed answer payload" and "this table
 * never dealt that turn" - a caller rejects either the same way an
 * out-of-range `chosenIndex` was always rejected outright, not stored as a
 * meaningless success.
 */
function gradeAnswerPayload(
  pack: ContentPack,
  state: GameState,
  turnIndex: number,
  payload: unknown,
): Omit<OtherAnswer, 'playerId'> | null {
  const parsed = parseAnswerPayload(payload);
  if (parsed === null) return null;
  const nonce = state.turnNonces[turnIndex];
  const questionId = state.turnQuestions[turnIndex];
  if (nonce === undefined || questionId === undefined) return null;
  const question = questionById(pack, questionId);
  if (question === undefined) return null;
  const presented = presentQuestion(question, nonce);
  const chosenIndex = parsed.chosenIndex;
  return {
    chosenIndex,
    chosenText: presented.options[chosenIndex] ?? null,
    correct: chosenIndex === presented.correctIndex,
  };
}

/**
 * Grades a `commit/revealed` payload against `turnIndex`'s isomorph-beat
 * follow-up question (see {@link GameState.isomorphQuestions}), reusing the
 * turn's own answer nonce ({@link GameState.turnNonces}) to shuffle its
 * options - a different question id produces a different shuffle regardless,
 * so reusing the nonce namespace costs nothing. `null` when this turn never
 * got an isomorph follow-up (rule off, no sibling, wrong subject for this
 * turnIndex) or the payload is not answer-shaped.
 */
function gradeIsomorphAnswerPayload(
  pack: ContentPack,
  state: GameState,
  turnIndex: number,
  payload: unknown,
): Omit<OtherAnswer, 'playerId'> | null {
  const parsed = parseAnswerPayload(payload);
  if (parsed === null) return null;
  const nonce = state.turnNonces[turnIndex];
  const questionId = state.isomorphQuestions[turnIndex];
  if (nonce === undefined || questionId === undefined) return null;
  const question = questionById(pack, questionId);
  if (question === undefined) return null;
  const presented = presentQuestion(question, nonce);
  const chosenIndex = parsed.chosenIndex;
  return {
    chosenIndex,
    chosenText: presented.options[chosenIndex] ?? null,
    correct: chosenIndex === presented.correctIndex,
  };
}

/**
 * Picks `question`'s isomorph-beat follow-up: a sibling sharing its
 * `isomorph_group_id`, chosen deterministically from the turn's own nonce so
 * every peer resolves the same item with no extra event. `null` when the
 * question carries no group id or no sibling exists (DESIGN.md §5.1 needs the
 * bank to author pairs/triples; `validatePack` in pack.ts enforces >=2
 * members per group, but a lone new item mid-authoring should degrade to "no
 * follow-up this turn," never a stuck game).
 */
function pickIsomorph(pack: ContentPack, question: Question, nonce: string): Question | null {
  if (question.isomorph_group_id === undefined) return null;
  const siblings = pack.questions.filter(
    (q) => q.isomorph_group_id === question.isomorph_group_id && q.id !== question.id,
  );
  if (siblings.length === 0) return null;
  return createRng(nonce, 'isomorph', question.id).pick(siblings);
}

/**
 * Every seated player's graded answer for `turnIndex` other than
 * `excludeAuthor` (the one whose reveal is resolving the turn, or `null` on
 * a timeout where nobody's outcome is the scoring one). Reads
 * {@link GameState.reveals} directly rather than re-deriving from events, so
 * a bystander who revealed before the resolving answer landed (any order is
 * possible - see the replay-determinism test) is picked up automatically.
 */
function gatherOtherAnswers(
  state: GameState,
  pack: ContentPack,
  turnIndex: number,
  excludeAuthor: PlayerId | null,
): OtherAnswer[] {
  const revealed = state.reveals[answerSubject(turnIndex)] ?? {};
  const out: OtherAnswer[] = [];
  for (const [playerId, entry] of Object.entries(revealed)) {
    if (playerId === excludeAuthor) continue;
    const graded = gradeAnswerPayload(pack, state, turnIndex, entry.payload);
    // Already validated when this reveal was first accepted (see
    // `commit/revealed` in `apply()`) - null here would mean the pack
    // changed under a live game, which nothing in this codebase does.
    if (graded === null) continue;
    out.push({ playerId, ...graded });
  }
  return out;
}

/** Score it, record it, then either keep the turn or pass it on. */
function resolve(state: GameState, active: ActiveTurn, res: Resolution, pack: ContentPack): GameState {
  const tier = DIFFICULTY_TIERS[res.difficulty];
  const delta = res.correct ? tier.award : tier.penalty;
  const previous = state.scores[active.teamId] ?? 0;
  const raw = previous + delta;
  const score = state.rules.scoreFloor === null ? raw : Math.max(state.rules.scoreFloor, raw);

  // DESIGN.md §5.1's confer beat: eligible only with the table setting on, a
  // real question dealt (never on a pre-difficulty timeout), and a sibling
  // sharing its isomorph_group_id in the pack (see pickIsomorph). Computed
  // here rather than at draw time - the confer beat is a reaction to *this*
  // outcome, not a thing scheduled in advance.
  const dealtQuestion = active.questionId === null ? undefined : questionById(pack, active.questionId);
  const isomorphQuestion =
    state.rules.conferBeatEnabled && dealtQuestion !== undefined
      ? pickIsomorph(pack, dealtQuestion, active.nonce)
      : null;
  const isomorph: IsomorphRecord | null =
    isomorphQuestion === null ? null : { questionId: isomorphQuestion.id, answers: [] };

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
    at: res.at,
    otherAnswers: gatherOtherAnswers(state, pack, active.turnIndex, res.answererId),
    isomorph,
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
    isomorphQuestions:
      isomorphQuestion === null
        ? state.isomorphQuestions
        : { ...state.isomorphQuestions, [active.turnIndex]: isomorphQuestion.id },
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

/** A shallow copy of `record` with `key` dropped, leaving everything else in place. */
function withoutKey<V>(record: Readonly<Record<string, V>>, key: string): Record<string, V> {
  return Object.fromEntries(Object.entries(record).filter(([k]) => k !== key));
}

/**
 * Authors who committed for `subject` but have not (yet) revealed.
 *
 * This primitive has no concept of a deadline - "too late" is a call only a
 * caller with turn-shaped context can make (a turn resolving, a timeout
 * event, a wall-clock budget are all candidates and none of them belong in a
 * generic reducer). This just exposes the raw fact so that rule can be built
 * on top of it: Phase B's answered-or-forfeited logic reads this instead of
 * this file growing an opinion about what a turn is.
 */
export function unrevealedCommits(state: GameState, subject: string): readonly PlayerId[] {
  return Object.keys(state.pendingCommits[subject] ?? {});
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
