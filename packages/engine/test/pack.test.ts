import { describe, expect, it } from 'vitest';

import {
  CATEGORIES,
  CATEGORY_IDS,
  createRng,
  DIFFICULTY_ORDER,
  DIFFICULTY_TIERS,
  expand,
  packHash,
  packStats,
  presentQuestion,
  questionById,
  SEED_PACK,
  SEED_PACK_HASH,
  selectQuestion,
  validatePack,
  type Question,
} from '../src/index.js';

describe('seed pack', () => {
  it('is structurally valid', () => {
    expect(validatePack(SEED_PACK)).toEqual([]);
  });

  /**
   * The invariant that matters is not a fixed bank size - it is that the bag can
   * never deal a category the pack cannot answer. dohhh could assert an exact
   * count because its bank was authored 15-per-cell; this one grows unevenly
   * from a curriculum, so assert the property instead of the number.
   */
  it('can answer every category it is willing to deal, at every tier', () => {
    const stats = packStats(SEED_PACK);
    expect(CATEGORY_IDS.length).toBeGreaterThan(0);
    for (const category of CATEGORY_IDS) {
      for (const difficulty of DIFFICULTY_ORDER) {
        expect(
          stats.byCategory[category]?.[difficulty] ?? 0,
          `${category} has nothing at ${difficulty}, so dealing it would stall the turn`,
        ).toBeGreaterThan(0);
      }
    }
    expect(stats.thinnest.count).toBeGreaterThan(0);
  });

  /**
   * 19 of 48 cells hold exactly one question, so those scenes repeat immediately
   * at that tier. That is a property of bridge content generated from a
   * curriculum, not of the engine, and it is invisible until someone plays it -
   * hence asserting it.
   *
   * This bound was 14. It was raised deliberately, once, and the reason is worth
   * recording because the rule attached to it said never to raise it: splitting
   * the Safety domain into its four GB 2894 categories (prohibition, warning,
   * instruction, notice) spread the same items over more scenes. That split was
   * not optional - the previous arrangement drew 禁止 "forbidden" on a yellow
   * WARNING board, teaching the colour convention backwards, when colour is the
   * one thing a player can act on before decoding a single character.
   *
   * So: correctness bought thinness, knowingly. Tighten this as the bank grows.
   * Raising it again needs a reason of the same weight, written here.
   */
  it('records how thin the thinnest cells still are', () => {
    const stats = packStats(SEED_PACK);
    let singletons = 0;
    for (const category of CATEGORY_IDS) {
      for (const difficulty of DIFFICULTY_ORDER) {
        if ((stats.byCategory[category]?.[difficulty] ?? 0) === 1) singletons += 1;
      }
    }
    expect(singletons).toBeLessThanOrEqual(19);
  });

  it('has unique category ids, names and glyphs', () => {
    expect(new Set(CATEGORIES.map((c) => c.id)).size).toBe(CATEGORIES.length);
    expect(new Set(CATEGORIES.map((c) => c.name)).size).toBe(CATEGORIES.length);
    // Glyphs are a display detail, but a duplicate would make two categories
    // indistinguishable wherever one is used as a badge.
    expect(new Set(CATEGORIES.map((c) => c.glyph)).size).toBe(CATEGORIES.length);
  });

  it('has a prompt, three distinct options and an explanation everywhere', () => {
    for (const question of SEED_PACK.questions) {
      expect(question.prompt.length).toBeGreaterThan(10);
      expect(question.options).toHaveLength(3);
      expect(new Set(question.options).size).toBe(3);
      expect(question.explanation.length).toBeGreaterThan(10);
    }
  });

  it('spreads the presented answer position evenly across the pack', () => {
    // Authored position is irrelevant - presentQuestion always shuffles - so
    // what has to be uniform is where the answer actually lands on screen.
    const counts = new Array<number>(3).fill(0);
    for (const question of SEED_PACK.questions) {
      const index = presentQuestion(question, 'fixed-nonce-for-audit').correctIndex;
      counts[index] = (counts[index] ?? 0) + 1;
    }
    const expected = SEED_PACK.questions.length / 3;
    for (const count of counts) {
      expect(count).toBeGreaterThan(expected * 0.6);
      expect(count).toBeLessThan(expected * 1.4);
    }
  });

  it('spreads the answer evenly across the three stored positions', () => {
    // The authoring convention is "correct option first", so the raw content is
    // almost entirely index 0. `expand` rotates it out. Without that, anything
    // reading the pack directly - a custom client, an inspection, an export -
    // sees a bank that looks rigged even though play is unaffected.
    const counts = new Array<number>(3).fill(0);
    for (const question of SEED_PACK.questions) {
      counts[question.answer] = (counts[question.answer] ?? 0) + 1;
    }
    const expected = SEED_PACK.questions.length / 3;
    for (const count of counts) {
      expect(count).toBeGreaterThan(expected * 0.7);
      expect(count).toBeLessThan(expected * 1.3);
    }
  });

  it('rotates without changing which option is correct', () => {
    // The rotation is only safe if it is meaning-preserving, so assert it
    // directly rather than trusting the arithmetic.
    const chunk = {
      low: [['Prompt?', ['right', 'w1', 'w2'], 0, 'because'] as const],
      mid: [['Prompt?', ['w1', 'right', 'w2'], 1, 'because'] as const],
      high: [['Prompt?', ['w1', 'w2', 'right'], 2, 'because'] as const],
    };
    for (const question of expand('menu-cooking', chunk)) {
      expect(question.options[question.answer]).toBe('right');
      expect([...question.options].sort()).toEqual(['right', 'w1', 'w2']);
    }
  });

  it('never explains an answer by its position', () => {
    // Options are shuffled per turn, so "the second option is..." is not merely
    // fragile - it is already wrong for every player who reads it.
    const positional = /\b(first|second|third|fourth|last|latter)\s+(option|options|answer|statement|condition)\b/i;
    const offenders = SEED_PACK.questions
      .filter((question) => positional.test(question.explanation))
      .map((question) => question.id);
    expect(offenders).toEqual([]);
  });

  it('does not let "pick the longest option" beat the game', () => {
    // The one content bias that survives shuffling, and the one that matters:
    // if the correct answer is reliably the wordiest, a player who knows
    // nothing can profit at the low tier and the whole betting mechanic
    // (R-13) collapses. Chance is ~33 per cent (three options, per
    // DESIGN.md §2.3/§1.2 P6).
    //
    // This gate has now caught the same authoring habit twice - writing the
    // justification into the correct option rather than into `explanation` -
    // once at 56 per cent on the original twelve categories and again at 56 per
    // cent when six more were added. It is a ratchet: tighten it when the bank
    // improves, never loosen it to make a commit pass.
    let longestWins = 0;
    for (const question of SEED_PACK.questions) {
      const lengths = question.options.map((option) => option.length);
      if (lengths[question.answer] === Math.max(...lengths)) longestWins += 1;
    }
    const rate = longestWins / SEED_PACK.questions.length;
    // Break-even for the exploit is award/(award+|penalty|) per DIFFICULTY_TIERS -
    // 50 per cent at low, 37.5 at mid, 40 at high - independent of option count,
    // so anything at or above ~37.5 per cent is profitable for a player who knows
    // nothing. Phase 5's three-option cut raised chance itself from 25 to ~33 per
    // cent; ~35 per cent measured sits between the two and still clears every
    // tier's break-even.
    expect(rate).toBeLessThan(0.36);
  });

  it('states who each tier is aimed at, because the bank is authored against it', () => {
    // Calibration is content, and content drifts. The first pass at this bank
    // put "how many symphonies did Beethoven write" in the same tier as a
    // question about swap conventions, which flattens three bets into one.
    for (const difficulty of DIFFICULTY_ORDER) {
      const tier = DIFFICULTY_TIERS[difficulty];
      expect(tier.audience.length).toBeGreaterThan(40);
      expect(tier.blurb.length).toBeGreaterThan(10);
      expect(tier.blurb.length).toBeLessThan(60);
    }
  });
});

describe('pack hashing', () => {
  it('is stable and order independent', () => {
    expect(packHash(SEED_PACK)).toBe(SEED_PACK_HASH);
    const reordered = { ...SEED_PACK, questions: [...SEED_PACK.questions].reverse() };
    expect(packHash(reordered)).toBe(SEED_PACK_HASH);
  });

  it('ignores cosmetic metadata but not semantics', () => {
    expect(packHash({ ...SEED_PACK, name: 'Renamed', version: '9.9.9' })).toBe(SEED_PACK_HASH);

    const first = SEED_PACK.questions[0] as Question;
    const edited: Question = { ...first, options: ['a', 'b', 'c'] };
    const changed = { ...SEED_PACK, questions: [edited, ...SEED_PACK.questions.slice(1)] };
    expect(packHash(changed)).not.toBe(SEED_PACK_HASH);
  });
});

describe('question selection', () => {
  it('is deterministic in the nonce', () => {
    const input = {
      pack: SEED_PACK,
      category: 'menu-cooking',
      difficulty: 'mid',
      nonce: 'deadbeefdeadbeef',
      exclude: [],
    } as const;
    expect(selectQuestion(input).question?.id).toBe(selectQuestion(input).question?.id);
  });

  it('varies with the nonce, so the answerer cannot precompute', () => {
    const ids = new Set<string>();
    for (let i = 0; i < 40; i += 1) {
      const picked = selectQuestion({
        pack: SEED_PACK,
        category: 'market-panel',
        difficulty: 'mid',
        nonce: `nonce-${i}`,
        exclude: [],
      });
      if (picked.question !== null) ids.add(picked.question.id);
    }
    expect(ids.size).toBeGreaterThan(1);
  });

  it('never repeats while fresh questions remain', () => {
    const asked: string[] = [];
    for (let i = 0; i < 5; i += 1) {
      const picked = selectQuestion({
        pack: SEED_PACK,
        category: 'market-panel',
        difficulty: 'mid',
        nonce: `n-${i}`,
        exclude: asked,
      });
      expect(picked.question).not.toBeNull();
      expect(picked.repeat).toBe(false);
      asked.push(picked.question?.id ?? '');
    }
    expect(new Set(asked).size).toBe(5);
  });

  it('flags a repeat rather than stalling once the pool is drained', () => {
    const all = SEED_PACK.questions
      .filter((q) => q.category === 'market-panel' && q.difficulty === 'mid')
      .map((q) => q.id);
    const picked = selectQuestion({
      pack: SEED_PACK,
      category: 'market-panel',
      difficulty: 'mid',
      nonce: 'drained',
      exclude: all,
    });
    expect(picked.question).not.toBeNull();
    expect(picked.repeat).toBe(true);
  });

  it('returns nothing for a category the pack does not cover', () => {
    const picked = selectQuestion({
      pack: SEED_PACK,
      category: 'underwater-basket-weaving',
      difficulty: 'mid',
      nonce: 'x'.repeat(16),
      exclude: [],
    });
    expect(picked.question).toBeNull();
  });
});

describe('option presentation', () => {
  it('shuffles deterministically and tracks the correct index', () => {
    for (const question of SEED_PACK.questions.slice(0, 30)) {
      const shown = presentQuestion(question, 'nonce-1234');
      expect(shown.options).toHaveLength(3);
      expect(new Set(shown.options).size).toBe(3);
      expect(shown.options[shown.correctIndex]).toBe(question.options[question.answer]);
      // Same nonce, same order: every device must show the same three buttons.
      expect(presentQuestion(question, 'nonce-1234').options).toEqual(shown.options);
    }
  });

  it('moves the correct answer around across nonces', () => {
    const question = questionById(SEED_PACK, 'market-panel-mid-1') as Question;
    const positions = new Set<number>();
    const rng = createRng('positions');
    for (let i = 0; i < 60; i += 1) {
      positions.add(presentQuestion(question, `n${rng.uint32()}`).correctIndex);
    }
    expect(positions.size).toBeGreaterThan(2);
  });
});
