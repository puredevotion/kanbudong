import type { Difficulty } from './types.js';

export interface DifficultyTier {
  readonly id: Difficulty;
  /** How the bet is described to a human. */
  readonly label: string;
  /**
   * Who is expected to get this right. This is the authoring contract, and it
   * is normative: a question a general low would get is NOT a `low`
   * question, it is a mis-filed one.
   */
  readonly audience: string;
  /** The same thing, short enough to sit under a button. */
  readonly blurb: string;
  readonly award: number;
  readonly penalty: number;
  readonly timeoutMs: number;
}

/**
 * The scoring table from the brief, verbatim, plus the calibration the tiers
 * are authored against.
 *
 * The calibration matters more than it looks. The brief asked for "hard, very
 * hard, and incredibly hard"; the first pass at this bank drifted toward
 * general knowledge - "how many symphonies did Beethoven write" sitting in the
 * same tier as a question about swap conventions - which flattens three
 * distinct bets into one easy one and quietly removes the reason to ever pick
 * `low`. All three floors are now specialist floors.
 */
export const DIFFICULTY_TIERS: Readonly<Record<Difficulty, DifficultyTier>> = {
  low: {
    id: 'low',
    label: 'Safe',
    audience: 'The default stake. Take it when you are not sure and want the turn to keep moving.',
    blurb: 'A point either way',
    award: 1,
    penalty: -1,
    timeoutMs: 45_000,
  },
  mid: {
    id: 'mid',
    label: 'Fair',
    audience: 'You think you have this one. Costs three if you are wrong.',
    blurb: 'Worth five, costs three',
    award: 5,
    penalty: -3,
    timeoutMs: 75_000,
  },
  high: {
    id: 'high',
    label: '看不懂',
    audience: 'You are certain. Named for what you say when you are not.',
    blurb: 'Fifteen if you read it, ten if you do not',
    award: 15,
    penalty: -10,
    timeoutMs: 120_000,
  },
};

export const DIFFICULTY_ORDER: readonly Difficulty[] = ['low', 'mid', 'high'];

export interface RulesConfig {
  readonly targetScore: number;
  /**
   * `null` keeps the brief's unbounded negatives. Set to 0 to stop a team
   * being mathematically alive but psychologically finished (R-2) — rejected
   * as a default on purpose: capping it makes `high` a free bet.
   */
  readonly scoreFloor: number | null;
  /**
   * `null` is spec-faithful: a correct answer always returns the turn to the
   * same team, forever. See R-1 for why this is the most dangerous line in the
   * brief, and set it to 3 if a playtest confirms it.
   */
  readonly maxCorrectStreakPerTurn: number | null;
  /** Crossing the target arms the endgame; the round then completes (R-5). */
  readonly finishTheRound: boolean;
  /** Arrivals after `game/started` spectate rather than mutate turn order (R-9). */
  readonly allowLateJoin: boolean;
  /** Minimum teams, not players — two players on one team is not a game (R-4). */
  readonly minTeams: number;
  /**
   * DESIGN.md §5.1's recall beat: sign alone for ~3s with "say it out loud"
   * before options render. The design doc gives no concrete rule for which
   * rounds get "flagged" for this - §11.1's later ruling drops `spoken_attempt`
   * from the review-log schema entirely ("self-marked, so it is never a
   * learning metric") - so this ships as an opt-in table setting rather than
   * a per-round trigger this codebase would have to invent. Purely a local UX
   * beat: no wire event, no engine state, see apps/pwa/src/screens/Play.tsx.
   */
  readonly recallBeatEnabled: boolean;
  /**
   * DESIGN.md §5.1's confer beat and its isomorphic follow-up item. Same
   * opt-in posture as {@link recallBeatEnabled} - "flagged rounds" has no
   * concrete trigger rule in the document, so this is a table-wide setting.
   * Unlike the recall beat, the follow-up item is real engine state (see
   * `TurnRecord.isomorph` in types.ts and `resolve()` in reducer.ts).
   */
  readonly conferBeatEnabled: boolean;
}

export const DEFAULT_RULES: RulesConfig = {
  targetScore: 46,
  scoreFloor: null,
  maxCorrectStreakPerTurn: null,
  finishTheRound: false,
  allowLateJoin: false,
  minTeams: 2,
  recallBeatEnabled: false,
  conferBeatEnabled: false,
};

/**
 * Sane bounds on a host-authored target score. This is a wire-boundary value
 * (it rides in `game/created`), not just a UI form field, so a hand-crafted
 * event with `targetScore: 0` or a negative number must not be able to arm
 * the endgame on turn one, and `targetScore: Infinity` must not be able to
 * produce a divide-by-zero in the progress bar.
 */
const MIN_TARGET_SCORE = 1;
const MAX_TARGET_SCORE = 100_000;

/** Peers must agree on rules exactly, so unknown keys are dropped, not merged. */
export function normalizeRules(input: Partial<RulesConfig> | undefined): RulesConfig {
  const r = input ?? {};
  return {
    targetScore: clamp(
      numberOr(r.targetScore, DEFAULT_RULES.targetScore),
      MIN_TARGET_SCORE,
      MAX_TARGET_SCORE,
    ),
    scoreFloor:
      r.scoreFloor === null || r.scoreFloor === undefined
        ? DEFAULT_RULES.scoreFloor
        : clamp(numberOr(r.scoreFloor, 0), -MAX_TARGET_SCORE, MAX_TARGET_SCORE),
    maxCorrectStreakPerTurn:
      r.maxCorrectStreakPerTurn === null || r.maxCorrectStreakPerTurn === undefined
        ? DEFAULT_RULES.maxCorrectStreakPerTurn
        : Math.max(1, Math.floor(Number(r.maxCorrectStreakPerTurn))),
    finishTheRound: r.finishTheRound ?? DEFAULT_RULES.finishTheRound,
    allowLateJoin: r.allowLateJoin ?? DEFAULT_RULES.allowLateJoin,
    minTeams: Math.max(2, numberOr(r.minTeams, DEFAULT_RULES.minTeams)),
    recallBeatEnabled: r.recallBeatEnabled ?? DEFAULT_RULES.recallBeatEnabled,
    conferBeatEnabled: r.conferBeatEnabled ?? DEFAULT_RULES.conferBeatEnabled,
  };
}

function numberOr(value: unknown, fallback: number): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
