/**
 * Core vocabulary. Deliberately free of any platform type: this package is
 * imported by a browser bundle, a React Native bundle and a node test runner,
 * and must compile identically in all three.
 */

import type { Decomposition } from './components.js';

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

/**
 * DESIGN.md §3.3.3(3): whether a multi-character span's parts add up to its
 * meaning. Absent on a {@link SignFace} means "not yet authored", not "opaque" -
 * those are distinguishable states so content review can tell unfinished
 * spans from spans that were deliberately marked non-compositional.
 */
export type Transparency = 'transparent' | 'semi' | 'opaque';

/**
 * DESIGN.md §3.3.3(4): which reveal layout a character's decomposition gets.
 * `atomic` covers both true pictographs/ideographs and the directional-
 * complement signs (入口, 出站) that are never decomposed regardless of origin.
 */
export type CharacterStructure = 'left-right' | 'top-bottom' | 'enclosure' | 'atomic';

/**
 * DESIGN.md §7.7's authored spine: 0-2 are the fixed, hand-ordered sequence,
 * 3 is "not a capability tier" - the unordered scheduler-driven remainder.
 * Always hand-assigned per §6.3(1); never derived from `freqRank` or an HSK
 * band, which discriminate nothing here (a frequency-ordered bank contains
 * 期 保 质 量 含 and excludes 涮 炖 卤 荤 煸 胗 - precisely backwards for a
 * menu). Absent means "not yet placed in the spine," not tier 3 - Phase 2
 * only assigns this where DESIGN.md's curriculum tables give a ruling.
 */
export type Tier = 0 | 1 | 2 | 3;

/**
 * What a sign template actually draws. Held apart from `prompt` because the
 * prompt is a sentence and this is an object on a surface: the renderer needs the
 * characters on their own to set them at display size in the app's own face.
 *
 * A step towards DESIGN.md §6.1's span model. `pinyin` is the field the reveal
 * currently renders; `pinyin_citation`/`pinyin_surface` are separate per
 * DESIGN.md §4.6.5/§3.3.3(14) (citation vs post-sandhi form, e.g. 不 bù vs bú)
 * and are additive so existing content authored against `pinyin` keeps
 * compiling - populating them for real content is Phase 2's job, not this
 * one's.
 */
export interface SignFace {
  /** The span as it appears on the surface. One to four characters. */
  readonly hanzi: string;
  /** Tone-marked, verified against a reference table at build time. */
  readonly pinyin: string;
  /** Dictionary/citation-form pronunciation, before any sandhi is applied. */
  readonly pinyin_citation?: string;
  /** As actually spoken in this span's context, sandhi applied (水饺 shuíjiǎo). */
  readonly pinyin_surface?: string;
  /** Dutch gloss. The English one is the correct answer, so it is not repeated. */
  readonly nl: string;
  /**
   * English gloss, kept separate from the answer text per DESIGN.md §7's
   * "author both gloss languages from day one" ruling. Optional here because
   * the 16 existing content files only authored `nl`; backfilling `en` is
   * Phase 2 content work, not a schema change.
   */
  readonly en?: string;
  readonly transparency?: Transparency;
  /** Meaningful only for a single-character span; unset for a multi-character one. */
  readonly structure?: CharacterStructure;
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
  /** Absent on items that are a question about a sign rather than a sign itself. */
  readonly face?: SignFace;
  /**
   * DESIGN.md §3.3.3(5): word- and character-level decomposition are separate
   * schema objects, "one boolean cannot express both". Most questions have
   * neither - opaque compounds get an explicit `transparency: 'opaque'` marker
   * on `face` instead, so "no decomposition" and "not yet authored" stay
   * distinguishable.
   */
  readonly decomposition?: Decomposition;
  /** DESIGN.md §6.3(1)/§7.7: static, hand-assigned; see {@link Tier}. */
  readonly tier?: Tier;
  /**
   * DESIGN.md §9.2a: CTW-derived signage-frequency rank, stored as an
   * authoring-order *input* and tie-breaker only. Never sorted or seeded on
   * at runtime, and never shipped as its own column with a `CTW` source tag
   * (gate 13) - it lives here purely as the diagnostic §6.3(1) calls for.
   */
  readonly freqRank?: number;
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
