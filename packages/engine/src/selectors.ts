import { categoryById } from './categories.js';
import { usernamesConfusable } from './identity.js';
import type { PresentedQuestion } from './pack.js';
import { presentQuestion, questionById } from './pack.js';
import type { GameState } from './reducer.js';
import { currentTeamId } from './reducer.js';
import { DIFFICULTY_TIERS } from './rules.js';
import type { Category, ContentPack, PlayerId, Team, TeamId, TurnRecord } from './types.js';

/**
 * Read-only views over {@link GameState}. Kept here rather than in a component
 * so the PWA and the React Native shell answer "whose turn is it" the same way.
 */

export function teamOf(state: GameState, playerId: PlayerId): Team | undefined {
  return state.teams.find((team) => team.memberIds.includes(playerId));
}

export function teamById(state: GameState, teamId: TeamId): Team | undefined {
  return state.teams.find((team) => team.id === teamId);
}

export function actingTeam(state: GameState): Team | undefined {
  const id = currentTeamId(state);
  return id === null ? undefined : teamById(state, id);
}

/** True when this device's player is on the team currently up. */
export function isActingPlayer(state: GameState, playerId: PlayerId): boolean {
  const id = currentTeamId(state);
  return id !== null && (teamById(state, id)?.memberIds.includes(playerId) ?? false);
}

/** True once the host has kicked this player - every future event from them is refused. */
export function isBanned(state: GameState, playerId: PlayerId): boolean {
  return state.bannedIds.includes(playerId);
}

/** Host-only: whether this device may lock the room or kick another player. */
export function canModerate(state: GameState, playerId: PlayerId): boolean {
  return playerId === state.hostId;
}

export interface ConfusablePair {
  readonly a: PlayerId;
  readonly b: PlayerId;
}

/**
 * Every pair of currently-known players whose names would look the same at
 * a glance ("who actually said that" - see {@link usernamesConfusable}).
 * Usernames are decoration, not identity (R-17), so this is advisory only:
 * nothing here blocks anything, it just gives a host something to react to
 * that a byte-for-byte string comparison would silently miss.
 */
export function confusablePlayerPairs(state: GameState): ConfusablePair[] {
  const ids = Object.keys(state.players);
  const pairs: ConfusablePair[] = [];
  for (let i = 0; i < ids.length; i += 1) {
    for (let j = i + 1; j < ids.length; j += 1) {
      const a = ids[i] as PlayerId;
      const b = ids[j] as PlayerId;
      if (usernamesConfusable(state.players[a]?.username ?? '', state.players[b]?.username ?? '')) {
        pairs.push({ a, b });
      }
    }
  }
  return pairs;
}

/**
 * True when this device may deal the next question: the turn is undrawn and the
 * player is not on the acting team (R-10). Any qualifying peer may draw, so a
 * missing opponent cannot stall the round.
 */
export function canDraw(state: GameState, playerId: PlayerId): boolean {
  if (state.phase !== 'playing' || state.active !== null) return false;
  if (state.players[playerId] === undefined) return false;
  return !isActingPlayer(state, playerId);
}

/**
 * True when this device may pick one of the dealt category options: the
 * category is undrawn and the player is not on the acting team, mirroring
 * canDraw (R-10) - the side answering never picks its own category.
 */
export function canChooseCategory(state: GameState, playerId: PlayerId): boolean {
  const active = state.active;
  if (state.phase !== 'playing' || active === null) return false;
  if (active.categoryId !== null) return false;
  if (state.players[playerId] === undefined) return false;
  return !isActingPlayer(state, playerId);
}

export function canChooseDifficulty(state: GameState, playerId: PlayerId): boolean {
  const active = state.active;
  if (state.phase !== 'playing' || active === null) return false;
  if (active.categoryId === null || active.difficulty !== null) return false;
  return isActingPlayer(state, playerId);
}

export function canAnswer(state: GameState, playerId: PlayerId): boolean {
  const active = state.active;
  if (state.phase !== 'playing' || active === null) return false;
  if (active.difficulty === null || active.questionId === null) return false;
  return isActingPlayer(state, playerId);
}

export function activeCategory(state: GameState): Category | undefined {
  const categoryId = state.active?.categoryId;
  return categoryId == null ? undefined : categoryById(categoryId);
}

export function activeQuestion(state: GameState, pack: ContentPack): PresentedQuestion | null {
  const active = state.active;
  if (active === null || active.questionId === null) return null;
  const question = questionById(pack, active.questionId);
  if (question === undefined) return null;
  return presentQuestion(question, active.nonce);
}

/**
 * Milliseconds allowed for the current step, from the tier table. `null`
 * before a difficulty is chosen - there is no tier to time yet, and
 * defaulting to one tier's duration would hand a caller a number that looks
 * meaningful but isn't (a countdown UI built against it would show a real
 * but wrong number rather than "not timed yet").
 */
export function activeTimeoutMs(state: GameState): number | null {
  const difficulty = state.active?.difficulty;
  return difficulty == null ? null : DIFFICULTY_TIERS[difficulty].timeoutMs;
}

export interface ScoreRow {
  readonly team: Team;
  readonly score: number;
  readonly rank: number;
  readonly isActing: boolean;
  readonly isLeader: boolean;
  /** 0..1 progress toward the target, clamped for the progress bar. */
  readonly progress: number;
}

export function scoreboard(state: GameState): ScoreRow[] {
  const acting = currentTeamId(state);
  const ids = state.turnOrder.length > 0 ? state.turnOrder : state.teams.map((t) => t.id);
  const rows = ids
    .map((id) => ({ id, score: state.scores[id] ?? 0 }))
    .sort((a, b) => b.score - a.score || (a.id < b.id ? -1 : 1));
  const best = rows[0]?.score ?? 0;
  return rows.flatMap((row, index) => {
    const team = teamById(state, row.id);
    if (team === undefined) return [];
    return [
      {
        team,
        score: row.score,
        rank: index + 1,
        isActing: row.id === acting,
        isLeader: row.score === best && state.turnOrder.length > 0,
        progress: Math.max(0, Math.min(1, row.score / state.rules.targetScore)),
      },
    ];
  });
}

export interface StartCheck {
  readonly ready: boolean;
  readonly reason: string | null;
}

/** Why the start button is disabled, in words a human can act on. */
export function startCheck(state: GameState, playerId: PlayerId): StartCheck {
  if (state.phase !== 'lobby') return { ready: false, reason: 'The game has already started.' };
  if (playerId !== state.hostId) return { ready: false, reason: 'Only the host can start the game.' };
  const staffed = state.teams.filter((team) => team.memberIds.length > 0);
  if (staffed.length < state.rules.minTeams) {
    return {
      ready: false,
      reason: `Needs ${state.rules.minTeams} teams with at least one player each - ${staffed.length} so far.`,
    };
  }
  return { ready: true, reason: null };
}

/**
 * The results-screen standings. Currently identical to {@link scoreboard} -
 * kept as its own named export because "final standings" and "live
 * scoreboard" are a different question to a caller even when today's answer
 * happens to be the same rows, and a results screen wanting to diverge later
 * (e.g. sorting ties differently once the game is over) has somewhere to do
 * it without touching the live-game selector.
 */
export function finalStandings(state: GameState): ScoreRow[] {
  return scoreboard(state);
}

export function historyForTeam(state: GameState, teamId: TeamId): TurnRecord[] {
  return state.history.filter((record) => record.teamId === teamId);
}

/**
 * Observed streak length per turn, which is the single number the R-1 playtest
 * exists to measure: if the median winning streak is above five, one team is
 * playing the whole game.
 */
export function streakHistogram(state: GameState): Record<number, number> {
  const counts: Record<number, number> = {};
  let run = 0;
  for (const record of state.history) {
    if (record.correct) {
      run += 1;
      continue;
    }
    counts[run] = (counts[run] ?? 0) + 1;
    run = 0;
  }
  if (run > 0) counts[run] = (counts[run] ?? 0) + 1;
  return counts;
}
