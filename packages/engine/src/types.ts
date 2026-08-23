/**
 * Core vocabulary. Deliberately free of any platform type: this package is
 * imported by a browser bundle, a React Native bundle and a node test runner,
 * and must compile identically in all three.
 */

/** `dh_` + 12 lowercase base32 chars, derived from an Ed25519 public key. */
export type PlayerId = string;
/** `team_` + 6 lowercase base32 chars. */
export type TeamId = string;
/** `game_` + 10 lowercase base32 chars. */
export type GameId = string;
export type CategoryId = string;
export type QuestionId = string;

/**
 * The bet. Names are the product (see ADVERSARIAL-REVIEW R-13): a player is not
 * asked "do you know this" but "how much do you think you know this".
 */
export type Difficulty = 'low' | 'mid' | 'high';

export interface Category {
  readonly id: CategoryId;
  readonly name: string;
  /** Single glyph used as the category's face in the UI. */
  readonly glyph: string;
}

export interface Question {
  readonly id: QuestionId;
  readonly category: CategoryId;
  readonly difficulty: Difficulty;
  readonly prompt: string;
  /** Authored order; the presented order is shuffled per turn nonce. */
  readonly options: readonly [string, string, string, string];
  /** Index into `options` of the correct answer, in authored order. */
  readonly answer: 0 | 1 | 2 | 3;
  /**
   * Shown to everyone once the answer resolves. This is the mechanism by which
   * a disputed post-doc question becomes an argument with the explanation
   * rather than an argument across the table (R-18).
   */
  readonly explanation: string;
}

export interface ContentPack {
  readonly id: string;
  readonly version: string;
  readonly name: string;
  readonly categories: readonly Category[];
  readonly questions: readonly Question[];
}

export interface Player {
  readonly id: PlayerId;
  readonly username: string;
  /** Hex-encoded Ed25519 public key. `id` is a hash of this. */
  readonly publicKey: string;
}

export interface Team {
  readonly id: TeamId;
  readonly name: string;
  readonly memberIds: readonly PlayerId[];
}

/** One resolved question, kept for the recap screen and for auditing scores. */
export interface TurnRecord {
  readonly turnIndex: number;
  readonly roundIndex: number;
  readonly teamId: TeamId;
  /** Who actually submitted. Any member of the acting team may. */
  readonly answererId: PlayerId | null;
  readonly categoryId: CategoryId;
  readonly difficulty: Difficulty;
  readonly questionId: QuestionId;
  /** Index into the *presented* option order; -1 for a timeout. */
  readonly chosenIndex: 0 | 1 | 2 | 3 | -1;
  /**
   * The actual text of the chosen option, captured at resolution time. Null
   * for a timeout (nothing was chosen). Recomputing this later from
   * chosenIndex alone would need the per-turn nonce that seeded the
   * presented shuffle order, which nothing else keeps around once the turn
   * is history - storing the text directly avoids that dependency entirely.
   */
  readonly chosenText: string | null;
  readonly correct: boolean;
  readonly delta: number;
  readonly timedOut: boolean;
}

/** The live question, between `turn/drawn` and its resolution. */
export interface ActiveTurn {
  readonly turnIndex: number;
  readonly roundIndex: number;
  readonly teamId: TeamId;
  /**
   * Whose go it is, by rotation within the team, so a four-person team does not
   * become one person playing. Advisory: any team member may submit, because
   * enforcing it would let one locked phone stall the game.
   */
  readonly nominatedId: PlayerId | null;
  /** Null until the dealing side picks one of {@link categoryOptions}. */
  readonly categoryId: CategoryId | null;
  /** The choices offered to the dealing side, drawn from the bag at deal time. */
  readonly categoryOptions: readonly CategoryId[];
  /** Hex nonce published by the drawer; the question is a function of it. */
  readonly nonce: string;
  readonly difficulty: Difficulty | null;
  readonly questionId: QuestionId | null;
  /** True when the pool was exhausted and this question has been asked before. */
  readonly repeat: boolean;
  /** Author of the `turn/drawn` event, for the "dealt by" line in the UI. */
  readonly drawnBy: PlayerId;
}

export type GamePhase = 'lobby' | 'playing' | 'finished';
