/**
 * Item-side difficulty (docs/DESIGN.md §6.3, §11.8): a two-scalar Elo,
 * `(theta, n)`, shared across players on the device and updated after every
 * response. This is deliberately not FSRS's per-player `difficulty` scalar
 * in `memory.ts` — §6.3 is explicit that conflating the two is one of the
 * three "difficulty" quantities this codebase must stop calling by the same
 * name (the third, authoring `tier`, is Phase 2's static content field).
 *
 * `K = 0.4 / (1 + 0.05·n)` is verbatim from §6.3/§11.8. The rest of the
 * update — an item's `theta` as a Rasch/Bradley-Terry log-odds difficulty,
 * moved by the gap between the observed outcome and the probability that
 * `theta` predicts — is this module's own reasoned fill of a gap the design
 * document leaves open: §6.3 cites Math Garden for the K constant and the
 * "item Elo" framing but never states the match function against which an
 * item's rating is compared. Math Garden runs Elo on players *and* items
 * simultaneously; this product has no separate per-player Elo ability
 * scalar anywhere else in its data model (the player side is FSRS
 * stability/difficulty, a different quantity per §6.3's own opening line),
 * so there is no player-ability scalar to pair `theta` against. Absent one,
 * `theta` is estimated against a fixed reference ability (a plain one-
 * parameter Rasch fit), which is enough for the item's *relative* ordering
 * inside a tier to be learned from responses — the property `pickItem`
 * (Phase 7) will actually consume — without inventing a second, uncited
 * constant for a player-ability scale. Flagged per §6.3's own admission
 * that "the constants are reasonable starting values, not published ones."
 */

/** Per item, shared across players. `theta` is a log-odds difficulty; higher is harder. */
export interface ItemDifficulty {
  readonly theta: number;
  readonly n: number;
}

/** Cold start: no evidence yet, so the item is exactly as hard as the reference ability. */
export const NEW_ITEM_THETA = 0;

function eloK(n: number): number {
  return 0.4 / (1 + 0.05 * n);
}

/** Probability of a correct answer against the fixed reference ability, given `theta`. */
function expectedCorrect(theta: number): number {
  return 1 / (1 + Math.exp(theta));
}

/**
 * Updates `(theta, n)` from one observed response. `theta` rises (the item
 * is rated harder) when the observed outcome falls short of what the
 * current `theta` predicted, and falls when the item is answered more
 * easily than predicted — the standard Elo update, `K`-scaled by `n` so an
 * item's rating settles as more responses accumulate.
 */
export function updateItemDifficulty(item: ItemDifficulty | null, correct: boolean): ItemDifficulty {
  const theta = item?.theta ?? NEW_ITEM_THETA;
  const n = item?.n ?? 0;
  const outcome = correct ? 1 : 0;
  const nextTheta = theta - eloK(n) * (outcome - expectedCorrect(theta));
  return { theta: nextTheta, n: n + 1 };
}
