# 看不懂 — Implementation Plan

**Status:** v3. **This supersedes the dohhh-era plan in its entirety.** Everything
below the old milestone table (M0–M6, the peer-to-peer trivia game, the 18
knowledge categories, the bet ladder as a scaffolding selector) is retired —
the fork already deleted that content bank (see `docs/FORK.md`); this document
retires the plan that went with it.

**The spec of record is [`docs/DESIGN.md`](./DESIGN.md).** This plan does not
restate DESIGN.md's rulings; it sequences them into buildable phases and
points at exact files. Where this plan and DESIGN.md disagree, DESIGN.md wins
and this file has a bug. Section references (`§6.5`, `§7.7`, …) are
DESIGN.md section numbers, confirmed against the document's actual headings
at time of writing (2026-08-23) — re-check with a heading search
(`grep -n "^#" docs/DESIGN.md`) before trusting one blindly if this plan is
old when you read it.

**Citation conventions in this document:**

- `[DESIGN §n.n]` — a DESIGN.md section. Precise, checked.
- `[RC: "<short paraphrase>"]` — a claim from the research corpus
  (`docs/research/digests.json` / `findings.json`). **The corpus has no
  stable per-finding ID** (`findings.json` is an unindexed array of `{claim,
evidence_strength, detail, ...}` objects) — do not invent one. If a phase
  needs the exact citation, grep `findings.json` for a distinctive phrase
  from the paraphrase given here.
- `[SIMPLIFICATION]` — flags a phase that ships a scoped-down version of a
  full DESIGN.md mechanism, per this repo's CLAUDE.md convention ("say
  explicitly when an implementation is a scoped-down simplification rather
  than the full spec").

**How to use this document if you are an implementing agent:** read the
phase's Goal/Why/Changes/Out-of-scope/Done sections, read the DESIGN.md
sections it cites, read the current state of the files it names (they may
have changed since this plan was written by a later phase), then build.
Do not start a phase whose prerequisites (listed under "Depends on") are not
yet merged. Do not silently expand a phase's scope — if you find you need
something listed as out-of-scope, stop and say so rather than doing it.

---

## 0. Cross-phase ground rules

- **`pnpm verify` (lint → typecheck → test → build) is the done-bar for every
  phase**, not just "looks right" (CLAUDE.md). A phase is not finished until
  it is green.
- **Platform boundary**: `packages/engine` stays free of DOM/RN/Node-specific
  code; `packages/net` stays platform-injected. All of the content-model,
  scheduling, and composition work in this plan belongs in `packages/engine`
  unless a phase says otherwise.
- **No comments restating what code says** — comments only for a non-obvious
  WHY, per CLAUDE.md.
- **Content tuples**: `explanation` strings are player-facing copy. No
  frequency ranks, `§n.n` doc cross-references, or raw IDS decomposition
  strings (⿰⿱⿹) in anything a player reads (CLAUDE.md, reinforced by
  `[DESIGN §3.3.4]`'s ban on shipping U+2EBC or similar codepoints in UI
  copy).
- **New dependencies** are an approval checkpoint (CLAUDE.md #2) — every
  phase below that plausibly needs one (an animation library, an FSRS
  implementation, a fonts/subsetting tool) flags it explicitly; the
  implementing agent still has to ask before adding it to `package.json`.
- **Migration stance, stated once up front:** this is a **clean break**, not
  a migration. See §11 below for the full reasoning; every phase that changes
  a stored shape should bump its storage key/version rather than write a
  migrator.

---

## 1. Phase sequencing at a glance

| Phase | Name                                                                                 | Depends on                                              | Risk if skipped/reordered                                                                                                                              |
| ----- | ------------------------------------------------------------------------------------ | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1     | Span & decomposition data model                                                      | —                                                       | Everything downstream (content authoring, UI reveal, scheduler item-state) needs this shape to exist first.                                            |
| 2     | Content migration to the span model + expanded category set                          | 1                                                       | Can't author real menu/market/street content against a model that doesn't exist.                                                                       |
| 3     | Solo scheduler: FSRS-shaped stability/difficulty engine                              | 1                                                       | Needs the per-(player,item,direction) state shape from Phase 1; independent of Phase 2's content growth.                                               |
| 4     | Word/sentence composition layer (span eligibility, transparency-gated decomposition) | 1, 2                                                    | Needs both the schema (1) and real multi-character content (2) to be worth building against.                                                           |
| 5     | Reveal UI: two-stage reveal, component breakdown, 3-option MC                        | 1, 2                                                    | Needs real component data (1/2) to render; changes the answering-loop UI other phases touch.                                                           |
| 6     | Card/category visual expansion + transitions/motion                                  | 5                                                       | Cosmetic layer; benefits from the reveal UI settling first so it isn't reworked twice.                                                                 |
| 7     | Group-session scheduler (`pickItem`, the four hard constraints, morning-after queue) | 3, 4                                                    | The highest-risk, least-evidenced piece (`[DESIGN §6.5]` "no prior art") — sequenced last on purpose so it lands on a stable single-player foundation. |
| 8     | Mnemonic/self-explanation layer (evidence-hedged, optional)                          | 5                                                       | Purely additive; explicitly not load-bearing on the core loop, safe to defer or drop.                                                                  |
| 9     | Measurement/instrumentation + CI content gates                                       | 1–5 (partial dependency; can start once Phase 1/2 land) | Without this, later phases silently regress the ⺼/月 rule, coverage-percentage ban, etc. with no build-time catch.                                    |

Phases 1–5 are the critical path for "the app teaches real characters with a
real scheduler and a real reveal." Phases 6, 8, 9 can run in parallel with
each other once their listed dependencies land; Phase 7 is deliberately last.

---

## 2. Phase 1 — Span & decomposition data model

**Goal:** Replace the flat `[prompt, options, answerIndex, explanation]`
authoring shape's implicit assumptions with a typed schema for spans,
characters, and components, without yet re-authoring content or touching the
scheduler or UI.

**Why:** `packages/engine/src/types.ts`'s own doc comment on `SignFace`
already says this is "a step towards DESIGN.md §6.1's span model, not the
whole of it — there is no `transparency` field and no component table yet."
DESIGN.md §6.1 defines the item as a **span** (1–4 character string met as a
unit on a surface), not the bare character; §3.3.3 requires two _separate_
schema objects for word-level (`牛肉 = 牛+肉`) vs character-level (`河 = 氵+可`)
decomposition ("one boolean cannot express both"); §3.3.4 requires
component identity to be a **stored field**, never a substring/glyph match,
specifically because of the ⺼ (U+2EBC) vs 月 (U+6708) homoglyph trap — the
flesh radical in 肝肠肚腰脑肺肾胗 does not literally occur as a
distinguishable codepoint inside those characters at all, so "highlight ⺼"
can only ever be implemented as a lookup against a stored annotation. The
research corpus independently verifies this is exploitable-if-wrong: a naive
substring/highlight pass would misfire on 期 inside 保质期, a Tier-1 item
`[RC: "flesh radical is ⺼ not 月, naive substring match highlights zero
targets and misfires on 期"]`.

**Depends on:** nothing (first phase).

**Changes — `packages/engine`:**

- `src/types.ts`: extend or replace `SignFace` with a span-shaped type that
  carries at minimum: `hanzi`, `pinyin_citation`, `pinyin_surface` (separate
  fields per `[DESIGN §4.6.5]`/`[RC: "store pinyin_citation and
pinyin_surface as separate per-token fields"]` — post-sandhi vs citation
  form are not interchangeable), `nl`/`en` gloss pair (`[DESIGN §7]`'s
  Dutch/English-from-day-one ruling — both languages, not just `nl`),
  `transparency: 'transparent' | 'semi' | 'opaque'` (`[DESIGN §3.3.3]`), and
  `structure` enum (`left-right | top-bottom | enclosure | atomic`) per
  `[DESIGN §3.3.3]`.
- New module `src/components.ts` (or `decomposition.ts`): a component/radical
  table keyed by a stable component id (never a bare codepoint, so U+2EBC
  can be represented without ever appearing as literal text a search/replace
  could touch) — fields: `id`, `displayGlyph` (the shape to render — may be
  the 月-looking glyph, stored separately from any identity claim about
  which character it "is"), `role: 'semantic' | 'phonetic' | 'neither'`,
  and (for phonetic components only) a `reliability` field (`[DESIGN
§1.4]`/`[RC: "phonetic components predict pronunciation only ~17% exact
match in the top 1,000, gate on a computed reliability field"]`) — do not
  auto-compute reliability in this phase; the field exists and defaults to
  "unverified/no-cue" until Phase 2 hand-verifies each shipped hint.
- New type: `CharacterDecomposition` (character → `components: {componentId,
role}[]`, `semantic_radical` field distinct from the general component
  list per `[DESIGN §3.3.4]`'s explicit instruction to key highlighting off
  a _stored per-item component field_, never a substring/glyph match) —
  separate from `WordDecomposition` (word → `morphemes: {span, gloss}[]`),
  per the "one boolean cannot express both" ruling.
- `src/content/row.ts`: extend the `Row` authoring tuple (or replace it with
  a small named-fields object if the tuple becomes unwieldy — implementer's
  call, but if kept as a tuple, positional growth past ~6 fields is a signal
  to switch) to carry an optional decomposition reference. Do not force
  every row to carry decomposition data — most rows (safety, transit) won't
  have one; opaque compounds get an explicit `transparency: 'opaque'` marker
  instead of an absent field, so "no decomposition" and "decomposition not
  yet authored" are distinguishable states.
- `src/pack.ts`: `validatePack` gains a check that every `componentId`
  referenced by any item resolves in the component table (a dangling
  reference is a build error, not a runtime fallback).

**Changes — `apps/pwa`:** none in this phase. The reveal UI keeps using its
current naive `[...hanzi]` codepoint split (`Play.tsx`'s `Outcome`) until
Phase 5; this phase only makes the data available, it does not wire it up.

**Out of scope for this phase:**

- Re-authoring any of the 16 existing content files to populate the new
  fields (Phase 2).
- Any scheduler change (Phase 3).
- Any UI change (Phase 5).
- Populating `reliability` values or verifying phonetic hints against a
  dictionary — the field exists, its data does not yet.
- Sourcing a real decomposition dataset (Make Me a Hanzi's `dictionary.txt`
  is LGPL and, per the research corpus, cannot ship — `[RC: "Make Me a
Hanzi's dictionary.txt is LGPL and cannot ship, regenerate from
Unihan+CC-CEDICT"]`); this phase defines the shape the data will live in,
  not where the data comes from. Flag the sourcing question for Phase 2's
  planning, don't resolve it here.

**Done/verification:**

- `pnpm verify` green.
- New unit tests in `packages/engine`: a `CharacterDecomposition` for one of
  the organ-set characters (e.g. 肝) round-trips through the schema with its
  `semantic_radical` pointing at a component id whose `displayGlyph` is the
  ⺼-shaped glyph, and a test asserts nothing in the schema or its
  serialization contains a literal substring match rule (i.e. no test or
  code path does `hanzi.includes('⺼')` or similar) — this is the regression
  guard for the ⺼/月 bug class.
- A second test: an opaque compound (e.g. a stand-in for 东西) can be
  represented with `transparency: 'opaque'` and no `components` array,
  without validation failure.

---

## 3. Phase 2 — Content migration to the span model + expanded category set

**Goal:** Re-author existing content against Phase 1's schema, restore the
two missing DESIGN.md-specified categories, and grow content in the
direction DESIGN.md's tier/domain weighting actually specifies — not a full
2,700-item bank in one phase, but enough real, correctly-decomposed content
to make every later phase (scheduler, reveal UI, group session) testable
against real data instead of placeholders.

**Why:** `packages/engine/src/categories.ts`'s own comment says two of
DESIGN.md's 18 scenes (`street-promo` — discount/promotion, `street-way` —
fascia wayfinding) are missing "because the seed bank has no items for them
yet," calling it "a content gap, not a design change." `[DESIGN §6.2]`
specifies 18 scenes across 5 domains at fixed weights (market 30 / menu 30 /
street 20 / safety 15 / transit 5); `[DESIGN §7.7]`'s tier table sizes Tier 0
at ~24 items / ~60 new characters as the only linear, unskippable tier. The
research corpus's HSK finding is directly relevant to what to author: HSK
"gives two thirds of the bricks and almost none of the buildings" — cooking
methods, organ terms, and food-safety/retail vocabulary are the specific
gaps `[RC: "87.9% of a real survival set is absent from HSK 2.0 levels 1-3;
the missing third is specifically cooking methods, organ terms, food-safety
vocabulary"]`.

**Depends on:** Phase 1 (schema must exist).

**Changes — `packages/engine`:**

- `src/categories.ts`: add `street-promo` and `street-way` category
  entries, matching `[DESIGN §6.2]`'s scene list; update the file's own
  comment (which currently documents the gap) once filled.
- `src/content/street-promo.ts`, `src/content/street-way.ts`: new content
  files following the existing per-category file convention.
- All existing `src/content/*.ts` files: re-author rows that describe
  multi-character spans to use the new `CharacterDecomposition` /
  `WordDecomposition` types from Phase 1 where a decomposition genuinely
  exists — **explicitly do not invent a decomposition for opaque items**;
  mark them `transparency: 'opaque'` instead (`[DESIGN §3.3.3]`,
  `[RC: "rendering a bogus decomposition for an opaque word is worse than
showing none"]`). Prioritize the organ/texture set in `menu-animal.ts`
  (肝肠肚腰脑肺肾胗+血舌筋皮) as the flagship worked example for the ⺼/月
  ruling per `[DESIGN §7.1]`'s "the organ and texture set — where ⺼ earns
  its keep."
- Author `tier` as a static, hand-assigned field per `[DESIGN §7.7]` and
  `[DESIGN §6.3]`'s three-way difficulty-quantity separation — **never**
  derive it from `freqRank`/HSK band; those are diagnostic/tiebreaker
  fields only, stored but not used to sort or seed content
  (`[DESIGN §9.2a]`).
- Add `freqRank` as a stored-but-inert diagnostic field per `[DESIGN
§9.2a]`'s ordering signal (1: CTW-derived signage frequency as an
  authoring-order _input_, never shipped as a column per its CC BY-NC-SA
  license; 2: HSK 3.0 band as tiebreaker; 3: 通用规范汉字表 tier as floor;
  4: final order is human judgement) — do not wire it into any runtime
  sort.
- Decide and record (in a short code comment on `components.ts`, not in
  this plan) the actual sourcing path for decomposition data given the
  Make Me a Hanzi LGPL constraint flagged in Phase 1 — this phase is where
  that decision has to be made concrete, since it blocks authoring.

**Out of scope for this phase:**

- Hitting the full 2,700-item / 1,500-character bank size (`[DESIGN
§11.0]`) — that is a long-tail authoring effort explicitly described in
  DESIGN.md as "the due-queue long tail," not a single implementation
  phase. Target enough real content to exercise Tier 0 and a meaningful
  slice of Tier 1 (`[DESIGN §7.7]`'s ~24-item / ~110-item tiers) — get
  agreement on the exact target with whoever is reviewing this phase before
  starting; don't silently pick a number.
- Populating `reliability` for every phonetic component across the whole
  bank — verify it for whatever's authored this phase, don't block the
  phase on the full bank.
- Any scheduler or UI change.
- Sentence-level content (explicitly rejected for v1 per `[DESIGN §6.1]`/
  `[DESIGN §9.2]` — no Tatoeba-style sentences, ever, in this product).

**Done/verification:**

- `pnpm verify` green, including `validatePack`'s dangling-reference check
  from Phase 1.
- A CI-style test (can live in `packages/engine`'s existing test suite)
  asserting: no item tagged with a flesh-component (`semantic_radical`
  pointing at the ⺼ component id) exists for a character that doesn't
  actually carry it in a real decomposition source (guards the "reverse
  error" DESIGN.md flags — 能/育/背/散 _do_ carry ⺼, 血/皮/舌 do _not_).
- Manual check: load the pack in the existing Solo/Play screens (even with
  the old naive UI) and confirm nothing crashes on the new fields being
  present-but-unused.

---

## 4. Phase 3 — Solo scheduler: FSRS-shaped stability/difficulty engine

**Goal:** Replace `packages/engine/src/memory.ts`'s hand-tuned heuristic
with an engine that actually implements FSRS-6's retrievability formula and
pretrain-4 parameters (not stock defaults), widens the per-item state to
what a real fit needs, and fixes the grading/exposure-vs-review distinction
DESIGN.md requires. This phase does **not** build the group-session
scheduler (`pickItem`) — that's Phase 7.

**Why:** CLAUDE.md itself flags `packages/engine/src/memory.ts` and
`src/solo.ts` as "simplified stand-ins" for the real §6 spec. The current
file's own header says it approximates FSRS's retrievability curve but
never implements FSRS's real stability update, has no `easy` grade, and
seeds new items from a fixed table rather than a computed value. DESIGN.md
is specific about what's fixed vs. tunable here: **`ts-fsrs` (FSRS-6), not
FSRS-7** (npm latest is one generation behind the benchmark), shipped with
**pretrain-4 parameters, never stock defaults** — "shipping defaults ships
the exact config the literature says is unnecessary" `[DESIGN §11.8]`.
Constants are verbatim: `w[20] = 0.1542`, `FACTOR = 0.980346`,
`R(t,S) = (1 + 0.980346·t/S)^(−0.1542)` — the current code's
`RETRIEVABILITY_DECAY = 0.1542` constant already matches this, which is
worth preserving exactly, not re-deriving. Target retention **R\* = 0.90
everywhere**, selector and scheduler must use the same number
(`[DESIGN §11.8]`: divergence "is a bug and not a tuning choice" — the
current `isDue`'s `target = 0.9` default is correct and must stay
synchronized with wherever Phase 7's group selector reads retention from).
Per-(player, item, **direction**) state should be **16 bytes**:
`stability: f32, difficulty: f32, last_review: f64`, computed inline at
selection time, never persisted as a due date (`[DESIGN §6.4]`) — note the
**direction** component is new versus the current `ItemMemory`, which has
no direction field at all (acceptable for now since `[DESIGN §6.1]`/`[DESIGN
§3.4]` fix direction permanently at sign→meaning with no production mode,
so a single implicit direction may be adequate — flag this as a decision
for the implementing agent to confirm against DESIGN.md's current text
before assuming it's moot). Item-side difficulty is specified as a
**separate two-scalar Elo** `(θ_i, n_i)`, `K = 0.4/(1+0.05·n_i)`
(`[DESIGN §11.8]`, Klinkenberg et al. "Math Garden") — this is explicitly
_not_ the FSRS `difficulty` scalar the current code conflates it with.
Research corpus confirms the systems-cluster recommendation independently:
"FSRS pretrain-4 for the player side, Elo for the item side"
`[RC: "FSRS vs a zero-parameter moving average are within ~0.007 log loss;
do not hand-roll SM-2; recommended FSRS pretrain-4 player side, Elo item
side"]`, and flags the risk that a co-located game may generate too little
per-item history for any of this to matter — instrument
`days_between_sessions` regardless (ties into Phase 9).

**Depends on:** Phase 1 (needs the per-item, per-direction state shape to
exist in the type system, even if direction is a stub for now).

**[SIMPLIFICATION] flag:** this phase ships FSRS-6's retrievability formula
and pretrain-4 constants faithfully, but does **not** ship full per-user
parameter re-fitting (DSR model, ~19 weights fit from review history) —
DESIGN.md itself acknowledges this requires real review data the product
doesn't have yet. Say this explicitly in the module's doc comment, the way
the current file already does, rather than silently landing something
partial and calling it "the FSRS engine."

**Changes — `packages/engine`:**

- Add `ts-fsrs` as a dependency — **this is a new-dependency approval
  checkpoint (CLAUDE.md #2)**; the implementing agent must confirm the
  package version pulls FSRS-6 behavior (not FSRS-7) and get a yes before
  adding it to `package.json`.
- `src/memory.ts`: replace the hand-written `reviewItem`/`retrievability`
  pair with calls into `ts-fsrs` configured with pretrain-4 parameters
  (hard-coded, cited to their source — do not re-derive them). Keep the
  existing exported function names/signatures (`isDue`, `reviewItem`,
  `retrievability`, `elapsedDaysSince`, `gradeFromAnswer`) stable where
  reasonable so `solo.ts` and `soloMemory.ts` don't need a rewrite, but
  widen `ItemMemory` to whatever `ts-fsrs`'s card state actually needs
  (review count, lapse count are likely required — check the library's
  types rather than guessing).
- Add the FSRS `role: 'review' | 'exposure'` distinction to whatever
  records an attempt: pinyin-scaffolded answers, commit-window timeouts,
  and "too-easy" freebies (`R_p > 0.95`, at most once per session) must be
  logged as `exposure` and **never** feed a stability update
  (`[DESIGN §6.3]`, `[DESIGN §6.5]`). The current `gradeFromAnswer` only
  distinguishes `again`/`hard`/`good` from correctness+first-encounter; it
  has no concept of exposure-vs-review at all — this is new, not a rename.
- First-ever-correct sighting stays graded **Hard(2)**, not Good(3) (the
  current code already does this via `isFirstEncounter` — preserve it,
  don't regress it while restructuring).
- New module `src/itemDifficulty.ts` (or similar): the two-scalar Elo
  `(θ_i, n_i)` with `K = 0.4/(1+0.05·n_i)`, stored separately from FSRS's
  per-player `difficulty` — do not let the two difficulty concepts share a
  field or a name; `[DESIGN §6.3]` is explicit that these are two of three
  distinct "difficulty" quantities that must not be conflated (the third,
  authoring `tier`, is Phase 2's job and is already separate).
- `src/solo.ts`: minimal changes to keep compiling against the widened
  `ItemMemory`; do **not** add the `high_confidence_miss` requeue or
  "component-contrast injection" buckets in this phase — those are
  explicitly out of scope below.

**Changes — `apps/pwa`:**

- `src/lib/soloMemory.ts`: bump the storage key version
  (`kanbudong.soloMemory.v1.*` → `.v2.*` or similar) since `ItemMemory`'s
  shape is widening — per this plan's clean-break migration stance (§11
  below), do **not** write a migrator; old `.v1` data is simply
  unreadable by the new code and stays orphaned in `localStorage` (harmless,
  ignorable, or optionally cleared — implementer's call, not required).

**Out of scope for this phase:**

- The group-session scheduler / `pickItem` (Phase 7).
- The `high_confidence_miss` requeue and component-contrast injection
  buckets in `solo.ts` (Phase 7 or a follow-up — DESIGN.md §11.9 names
  these as solo-surface features, but they depend on richer content/state
  than this phase builds).
- Moving `soloMemory.ts` off `localStorage` onto IndexedDB — the codebase
  report flags this as a durability gap but it's orthogonal to the
  scheduling-algorithm fix this phase is about; do not bundle it in.
- The minimum-24h-gap and maximum-gap-for-confusables spacing rules
  (`[DESIGN §1.5]`) — those govern _item selection_, not the per-item
  stability update; they belong with Phase 7's queue-building logic.

**Done/verification:**

- `pnpm verify` green.
- Unit tests: `retrievability` matches the FSRS-6 formula at known
  reference points (e.g. `R(t=S) ≈ 0.9` exactly, per the constants above).
- A test asserting an `exposure`-role review never changes `stability`
  (feed it a scaffolded-answer sequence, assert stability is unchanged
  before/after).
- A test asserting first-ever-correct grades `Hard`, not `Good`.
- Manual check: play a full solo session in `apps/pwa`, confirm items
  still get scheduled and re-appear across a simulated day boundary (can
  fake `now` in a script/test rather than waiting a real day).

---

## 5. Phase 4 — Word/sentence composition layer

**Goal:** Implement span eligibility propagation (a multi-character span is
only eligible once its component characters are individually
introduced-for-that-player) and the discounted-credit mechanism where a
bare character embedded in multiple spans accumulates exposure across all
of them, without graduating from a single span's resolution alone.

**Why:** `[DESIGN §6.1]` states the span is the atomic learning unit, and
that bare characters which only ever appear inside larger spans still get a
`component_char_ids[]` field and a "discounted-weight credited exposure"
whenever a containing span resolves — "enough to move a character node, not
enough to graduate it alone" — the worked example given is 期, met inside
both 保质期 and 星期, crediting one node twice. Eligibility propagates
bottom-up: "a multi-character span is eligible for a given player only once
its component characters have been introduced _for that player_"
(`[DESIGN §6.1]`). The research corpus's coverage-arithmetic finding is the
concrete justification for taking this seriously rather than treating it as
a nice-to-have: 40% character coverage gives ~2.6% chance of reading a
whole 4-character span, not 40% — `[RC: "knowing 40% of characters gives
P(reading a whole 4-character item) ~2.6%, not 40%, argument for bespoke
functional ordering over pure frequency-band seeding"]`. Compound
transparency (Phase 1/2's `transparency` field) gates whether decomposition
is even attempted for a given span, per `[DESIGN §3.3.3]`/`[DESIGN §1.4
P23]`.

**Depends on:** Phase 1 (schema), Phase 2 (real multi-character content to
build eligibility rules against — this is not worth building against
placeholder data).

**Changes — `packages/engine`:**

- New module, e.g. `src/eligibility.ts`: given a player's per-character
  introduction state (which the widened `ItemMemory` from Phase 3 should be
  able to answer — "has this player seen character X at all," distinct
  from "is X due") and a span's `component_char_ids[]`, compute whether the
  span is eligible to be dealt/selected for that player. This is a pure
  function over engine-native types; it does not itself decide _when_ to
  call it — that's the scheduler's job (Phase 3 for solo ordering, Phase 7
  for group dealing).
- Extend the span type from Phase 1 with `component_char_ids: readonly
QuestionId[]` (or character ids, whatever the resolved identifier is —
  check what Phase 1 actually landed) so eligibility has something to
  check.
- Discounted-credit mechanism: when a containing span resolves, each
  component character's memory record gets a partial-weight update — this
  needs a new, explicitly smaller-magnitude path through the Phase 3
  scheduler (not a full review-grade update) so it "moves a character node,
  not enough to graduate it alone." Design this as an additional function
  in `src/memory.ts` or a sibling module rather than overloading
  `reviewItem`'s existing signature — a caller passing a discounted credit
  should not be indistinguishable from a caller reporting a real review.
- Word-level vs. character-level decomposition consumption: this phase is
  where `WordDecomposition` (from Phase 1) actually gets _read_ for the
  first time, to compute `component_char_ids[]` — Phase 1 only defined the
  shape, Phase 2 only populated some of it, this phase is the first
  consumer.

**Out of scope for this phase:**

- Any UI rendering of decomposition (Phase 5).
- The group-session dealing logic that would call `eligibility.ts`
  per-player at deal time (Phase 7) — this phase builds the pure function,
  not its caller in a multiplayer context.
- Sentence-level content — still explicitly rejected for v1
  (`[DESIGN §6.1]`, `[DESIGN §9.2]`); "word/sentence composition" in
  DESIGN.md's own vocabulary tops out at the 1–4 character span, there is
  no sentence layer to build.

**Done/verification:**

- `pnpm verify` green.
- Unit test: a span whose component characters are all "seen" for a given
  player is eligible; a span with an un-introduced component character is
  not.
- Unit test: crediting the same character node via two different
  containing spans (the 期 / 保质期 / 星期 case, or a stand-in) moves the
  node's memory state by less than a full review would, and by a
  consistent amount each time (deterministic, not order-dependent in a way
  that breaks the "credits twice" property DESIGN.md describes).

---

## 6. Phase 5 — Reveal UI: two-stage reveal, component breakdown, 3-option MC

**Goal:** Rebuild the answering-loop and reveal UI to match DESIGN.md's
format rulings: three options (not four), the two-stage reveal, real
component-breakdown rendering (replacing the naive codepoint split), and
the render-time bans (no substring-matched highlighting, no colour-as-
linguistic-information, correct type sizes/faces).

**Why:** `[DESIGN §2.3]`/`[DESIGN §1.2 P6]`: three options, not four —
Rodriguez (2005) meta-analysis, more items per unit time, no psychometric
loss if retained options are effective — "this overrides the inherited
four-option design." Options must stay meaning-side (Dutch/English) at
every tier — the current `Question.options` type in `types.ts` is already
`readonly [string, string, string, string]` (four, untyped as meaning-side
vs hanzi-side) and needs to become a three-tuple. `[DESIGN §2.5]`/`[DESIGN
§5.5]`: two-stage reveal — Stage 1 automatic (~800ms, target hanzi alone →
correct answer + named/marked-wrong lure), Stage 2 explicit tap (every
option glossed, hanzi ≥32px, pinyin, both languages). Component breakdown
is "the reveal's primary optional layer," tap-gated, post-answer only,
never on a timed card (`[DESIGN §3.3]`) — `Play.tsx`'s current `Outcome`
component does a naive `[...face.hanzi].map(...)` codepoint split with its
own comment admitting "glossing each needs a component table the bank does
not carry yet" — Phases 1/2 built that table; this phase is where it gets
consumed. The ⺼/月 highlighting rule is safety-critical here specifically
because this is the phase that would naively reach for a substring/regex
match if it didn't have Phase 1's stored `semantic_radical` field to use
instead (`[DESIGN §3.3.4]`, `[RC: "key highlighting off a stored
decomposition field, never a string match"]`).

**Depends on:** Phase 1 (schema), Phase 2 (real content to render).

**Changes — `packages/engine`:**

- `src/types.ts`: `Question.options` narrows from a 4-tuple to a 3-tuple;
  `answer` narrows from `0|1|2|3` to `0|1|2`.
- `src/content/row.ts`: `Row`'s `options`/`answer` fields follow the same
  narrowing; `rotate()`'s `by = createRng(...).int(4)` becomes `.int(3)`
  and the modulo arithmetic updates accordingly.
- All 16(+2 from Phase 2) `src/content/*.ts` files: every row's options
  array drops from 4 to 3 entries — **this requires picking which
  distractor to cut per item**, and per `[DESIGN §2.3]`'s distractor
  rulings, the cut should preserve the effective competitor and drop
  weak/filler options, not cut mechanically (e.g. always drop index 3).
  This is real per-item authoring judgement, not a mechanical script — flag
  scope with whoever's reviewing before doing this across the whole bank in
  one pass (CLAUDE.md approval-checkpoint #5, "large content-bank
  rewrites").
- Distractor generation: per `[DESIGN §2.3]`, distractor confusability
  should be a function of exposure state (unrelated-but-domain-plausible
  before consolidation, component-sharing/confusable-family after ≥1
  intervening night) and precomputed at build time as a pure function of
  `(item, exposure_count, seed)`. This phase should at minimum introduce
  the `confusion_type` enum (form-confusable / meaning-confusable-visually-
  distinct / both / shared-morpheme) on the schema and wire consolidation
  state (from Phase 3/4) into which distractor set gets used — full
  build-time precomputation of every distractor set for the whole bank can
  be scoped as a fast-follow if it's too large for one phase; say so
  explicitly if deferring it.

**Changes — `apps/pwa`:**

- `src/screens/Play.tsx`: `Outcome` component rewritten to consume the
  Phase 1/4 component/decomposition data instead of `[...face.hanzi]`
  codepoint splitting — render each component with its real
  meaning/role/reliability label, keyed off `semantic_radical`/component
  ids, never a string match. Answer-option rendering drops from 4 buttons
  to 3.
- `src/screens/Solo.tsx`: same 3-option change to its button rendering;
  same reveal restructuring if it currently shares reveal logic with
  `Play.tsx` (check — the codebase report describes them as separate
  screens with separate reveal handling).
- New two-stage reveal state: Stage 1 (automatic, ~800ms dwell, target
  hanzi + correct answer + named-wrong lure) → Stage 2 (explicit tap,
  every option glossed). This is new UI state machine work in whichever
  component currently jumps straight to a single reveal card.
- `src/ui/glyphs.tsx`: extend (or add a sibling module) to render actual
  component highlighting from stored `semantic_radical`/component data —
  replacing its current scope (only the 12 literal IDS structural symbols
  in prose `explanation` strings) with real per-character decomposition
  rendering. Per `[DESIGN §4.5]`, this rendering must never use colour to
  carry linguistic information — highlight by weight/outline/position, not
  hue.
- Minimum reveal dwell before "Next" enables, per `[DESIGN §5.5]` —
  defeatable by a "no timers" setting (`[DESIGN §4.10.3]`, WCAG 2.2.1) —
  this phase should at least add the dwell timer; the "no timers" setting
  itself can be scoped to Phase 6 or a dedicated accessibility phase if
  it's more than a small addition — flag if deferring.

**Out of scope for this phase:**

- The full font/type-size/contrast build-out from `[DESIGN §4.2]`–`§4.5]`
  (stroke-count-based sizing, dark-mode contrast ratios, the diacritic-
  complete pinyin font) — pull in only what's needed to render the new
  reveal content correctly; a full typography pass is its own phase if it
  turns out to be large. Say explicitly if scope crept here.
- Card/category visual templates beyond what already exists in
  `signs.tsx` (Phase 6).
- Animations/transitions (Phase 6) — this phase can use plain
  mount/unmount renders for the two reveal stages; motion is Phase 6's job.
- Precomputing distractor sets for the _entire_ bank at build time (see
  note above — may be deferred as a fast-follow within this phase's own
  scope, but must be flagged, not silently skipped).

**Done/verification:**

- `pnpm verify` green.
- A test asserting no code path renders a component highlight via
  string/regex matching on a hanzi string (grep-based CI check, or a unit
  test that specifically exercises the organ-set characters and asserts
  the highlighted component comes from the stored field).
- Manual Playwright check (per CLAUDE.md's tooling note — headless
  Chromium for PWA changes end-to-end): play through one solo item and one
  multiplayer-style item, confirm 3 options render, confirm Stage 1 reveal
  appears automatically and Stage 2 requires a tap, confirm the organ-set
  worked example (肝 or similar) shows the correct component breakdown.

---

## 7. Phase 6 — Card/category visual expansion + transitions/motion

**Goal:** Give the two missing categories (`street-promo`, `street-way`)
real visual templates, differentiate templates within a domain where
DESIGN.md's content specifics call for it (e.g. the QR/mini-programme
ordering template), and add the smooth transitions/small animations the
user explicitly asked for — scoped to concrete component/file targets, not
a general "add motion" pass.

**Why:** the user's stated ask is a "fun, recognisable (real menus/
storefronts), smooth-transitions-and-small-animations game." The codebase
report confirms `apps/pwa/src/styles.css` has zero `@keyframes`/custom
`transition`/`animation` rules today — all "transition" is Tailwind's
instant hover-state color/border easing, and state changes (question →
reveal, category → tier → question, turn → outcome) are plain conditional
React renders with no mount/unmount transition. DESIGN.md's own visual
rulings bound what's legitimate to animate: `[DESIGN §3.2]` kills
photographic scene fidelity and "deliberately hard to read" as rationales
(perceptual disfluency is a named, retracted myth — `[RC: "perceptual
disfluency... failed 4 experiments plus independent replications... must
go on the design doc's explicit banned-rationales list"]`), but explicitly
licenses typeface-class variation and object-realistic template rendering
built from type+CSS (never a source photograph, for legal reasons —
trademark/GDPR/PIPL exposure). `[DESIGN §7]` names a sixth card template
(QR/mini-programme ordering UI) as exempt from the type-size floor but not
from contrast requirements, requiring matched-foil distractor pairs. The
`[DESIGN §4.10.3]`/`[DESIGN §2.6]` timing rulings bound animation
specifically: never a visible countdown, never stack more than one of
{countdown, live opponent monitoring, public score change} as salient per
item — any added motion for opponent-status or scoring must respect this.

**Depends on:** Phase 5 (reveal UI should settle its structure before
motion is layered on, so transitions aren't built twice).

**[NEW DEPENDENCY flag]:** if the implementing agent wants an animation
library (Framer Motion, react-spring, etc.) rather than hand-rolled CSS
transitions, that's a new-dependency approval checkpoint (CLAUDE.md #2) —
ask first, state what it buys over CSS-only transitions given this is a
PWA with an offline/precache budget (`[DESIGN §11.5]` flags font/asset
budget as load-bearing; a large motion library has a similar
budget-conversation to have).

**Changes — `packages/engine`:**

- `src/categories.ts`: no further change needed if Phase 2 already added
  `street-promo`/`street-way`; if a visual-hint field per category is
  wanted (the codebase report suggests this so `signs.tsx` doesn't
  hardcode a domain→component switch ignoring most of the 18 categories),
  add it here — e.g. `Category.visualTemplate: TemplateId`.

**Changes — `apps/pwa`:**

- `src/ui/signs.tsx`: add template components for `street-promo` (discount/
  promotion fascia) and `street-way` (wayfinding), matching the existing
  pattern (`TransitPlate`, `MenuSection`, `ShopFascia`, `PriceLabel`,
  `SafetyBoard`). Consider whether any of the 16 categories currently
  coarsened to one of 5 domain templates deserve their own — the codebase
  report flags `market-label`/`market-panel`/`market-checkout` as all
  rendering identically today; use judgement on which distinctions are
  worth a new component vs. a parametrized variant of an existing one.
- New template: the QR/mini-programme ordering UI (`[DESIGN §7]`'s "sixth
  card template") — small type is the difficulty by design, but contrast
  requirements still apply; needs matched-foil distractor pairs authored
  alongside it (content work, coordinate with Phase 2/5 authoring).
- `src/styles.css`: add real `@keyframes`/`transition` rules — a card-flip
  or fade for the reveal-stage transition (Phase 5's Stage 1 → Stage 2),
  a subtle enter/exit for category → tier → question in the multiplayer
  flow, and a desaturation effect for the "silent generous window, subtle
  desaturation in final fifth" timing rule (`[DESIGN §4.10.3]`) instead of
  a visible countdown.
- Respect `prefers-reduced-motion` throughout — not explicitly named in
  the reports above, but required by the same accessibility posture
  DESIGN.md takes elsewhere (WCAG references throughout §4.11); treat as
  implied scope, flag if the implementing agent disagrees.

**Out of scope for this phase:**

- Any scheduler, content-model, or reveal-_logic_ change — this phase is
  purely visual/motion on top of what Phase 5 built.
- Photographic/real-image assets — banned outright by `[DESIGN §3.2]` for
  legal reasons (trademark/GDPR/PIPL), not just a stylistic choice; every
  template stays type+CSS in the licensed subset font.
- Sound/audio — `[DESIGN §11.7]` explicitly says "none in v1, fields only."

**Done/verification:**

- `pnpm verify` green.
- Manual Playwright check with screenshots at a few animation keyframes
  (or before/after) for each new transition, confirming no layout shift
  and no violation of the "no visible countdown" / "no colour carries
  linguistic information" rules.
- Manual check with `prefers-reduced-motion: reduce` simulated, confirming
  transitions degrade to instant/no-op rather than breaking.

---

## 8. Phase 7 — Group-session scheduler (`pickItem`, hard constraints, morning-after queue)

**Goal:** Build the multiplayer group-session item-selection mechanism —
DESIGN.md's own admitted highest-risk, least-evidenced component.

**Why:** `[DESIGN §6.5]` — "One item, N schedules" — is named directly in
DESIGN.md as having "no prior art" and being the design's own biggest bet.
Every player answers every dealt item privately (blind simultaneous
commit); one review row per player per round, always. `pickItem(candidates,
players[])` must be a pure, stateless function; candidates are the union of
all seated players' due queues, filtered to the dealt scene, with
**eligibility applied per-player, not group-wide** (group-wide is
"catastrophic" per DESIGN.md's own words — it excludes most of a strong
player's vocabulary). A rotating priority player π gets weighted priority
via `U(i) = −Σ_p w_p·(R_p(i) − 0.90)²` with an asymmetric 3:1 loss
weighting DESIGN.md itself flags as an "unmodelled guess"
(`[DESIGN §11.8]`); softmax-sample over top 8, not argmax. Four **hard,
non-tunable** constraints come from a documented Duolingo production
failure (`[DESIGN §6.5]`, citing the same P37 reference the design-doc
report traces): (1) no item scored twice in one session; (2) no item
leaves LEARNING on same-session corrects; (3) cap consecutive misses at 2,
then force-inject an item at that player's R > 0.95; (4) floor per-player
minimum interval at 1 day. The **morning-after queue** — group-session-
introduced items get written to a `seeded_today` set and pushed to the
front of next day's solo queue — is called "the hinge the whole model
turns on," converting a massed party game into a spaced one. The research
corpus's falsification trigger is directly relevant to sequencing this
phase last: if median multiplayer inter-session gap exceeds 7 days across
the first 100 players over 8 weeks, "the architecture inverts (solo becomes
primary, party game becomes acquisition channel)" (`[DESIGN §12.2]`) — this
is exactly why Phases 1–5 build a solid _solo_ surface first, so that
inversion (if it happens) doesn't strand the product.

**Depends on:** Phase 3 (per-player FSRS state), Phase 4 (eligibility
function — this phase is `eligibility.ts`'s first real multiplayer caller).

**[SIMPLIFICATION] flag, explicit and important:** DESIGN.md itself flags
this whole mechanism as unvalidated ("no prior art," §11.8's 3:1 weighting
is an "unmodelled guess"). This phase should ship it as **designed**, but
the implementing agent should not treat the 3:1 weighting, the softmax
temperature, or the top-8 cutoff as load-bearing constants to defend —
they're DESIGN.md's own best guess pending instrumentation (Phase 9). Land
it, instrument it, expect to revisit.

**Changes — `packages/engine`:**

- New module `src/groupSchedule.ts` (name at implementer's discretion):
  `pickItem(candidates, players[])` as a pure function per the shape
  above. Needs access to: each player's due queue (from Phase 3's
  scheduler), `eligibility.ts` from Phase 4 applied per-player, and a
  rotating-priority-player pointer that's part of the _shared_ game-state
  reducer, not local scheduling state (check where turn rotation currently
  lives in `packages/engine` — the codebase report notes the deal/reducer
  logic "lives elsewhere in `engine`," not in the files already read; find
  it before assuming where π's rotation state belongs).
- Implement the four hard constraints as explicit, named, individually
  testable guards — not inlined into `pickItem`'s scoring math, so each
  one can be unit-tested against the Duolingo-failure scenario it exists
  to prevent.
- Grading rules specific to group sessions: items dealt from someone
  else's queue that are NEW for a given player are graded Hard(2) on
  correct / Again(1) on miss (an "introduction engine," not a review, for
  that player) — this is a new grading path alongside Phase 3's
  first-encounter/exposure rules, not a replacement for them.
- The morning-after queue: a `seeded_today` set written during group
  sessions, consumed by `solo.ts`'s queue-building (`buildSoloQueue`) to
  push those items to the front of the next day's solo session. This is
  the one piece of state that needs to flow from the shared/synced game
  log into the local per-player memory store — check `[DESIGN §11.1]`'s
  "two stores, not one" split before deciding how this crosses that
  boundary; it's explicitly meant to be a narrow, deliberate crossing, not
  a general merge of the two stores.
- Minimum-24h-gap and confusion-set max-gap (5–15 intervening items)
  spacing rules (`[DESIGN §1.5]`) belong in this phase's queue-building,
  not Phase 3's per-item stability update.

**Changes — `apps/pwa`:** whatever UI currently drives category dealing/
turn structure (in `Play.tsx` and the shared reducer it consumes) needs to
call `pickItem` instead of whatever selection exists today — the codebase
report didn't trace this reducer in detail; the implementing agent should
locate it first (likely in `packages/net` or a `packages/engine` reducer
module not covered in the reports above) before planning the integration
in detail. Flag if this turns out to be a bigger rewrite than expected —
DESIGN.md's §2.4/§5.1 turn-structure rulings (blind simultaneous commit,
turn passes on rotation not on error, six-beat sequence) are a separate,
large rebuild of the _inherited_ turn mechanic that this plan has not
sequenced as its own phase; if Phase 7's implementer finds the current
turn reducer still assumes the old dohhh-era "correct keeps turn" logic,
stop and treat that as a prerequisite sub-phase rather than folding an
unscoped rewrite into this one.

**Out of scope for this phase:**

- The full six-beat turn sequence rebuild (deal/bet/item/answer/reveal/
  next) if it isn't already in place — see the flag immediately above.
  This plan does not currently have a dedicated phase for that rebuild;
  note that gap explicitly if it's discovered to still be needed, rather
  than silently absorbing it into Phase 7's scope.
- Tuning the 3:1 weighting or softmax temperature against real player
  data — no such data exists yet; ship the documented guess, don't
  invent a better one without evidence.

**Done/verification:**

- `pnpm verify` green.
- Unit tests for each of the four hard constraints in isolation, each
  constructed to reproduce the specific failure mode it exists to prevent
  (e.g. a test that would show an item scored twice in one session absent
  the guard).
- Unit test: per-player eligibility filtering — construct two players
  with different introduced-character sets, confirm `pickItem`'s candidate
  pool differs correctly per player rather than intersecting/unioning
  incorrectly.
- Unit test: an item introduced in a group session for player A appears
  at the front of player A's next `buildSoloQueue` call the following
  day (the morning-after mechanism).
- Manual multi-device or multi-tab Playwright check: play a short group
  session, confirm blind simultaneous commit (no player sees another's
  live selection), confirm the four constraints hold over a session long
  enough to exercise them.

---

## 9. Phase 8 — Mnemonic / self-explanation layer (evidence-hedged, optional)

**Goal:** Add the one mnemonic-adjacent mechanic the evidence actually
supports (self-explanation / component-cued generation), explicitly **not**
a memory-palace or method-of-loci mechanic, and ship it as optional /
A/B-able rather than load-bearing on the core loop.

**Why — and why this phase is hedged, stated plainly:** the research
corpus's verdict on method of loci is the cleanest kill in the whole
corpus: "flatly excluded, with the strongest and cleanest verdict" — MoL is
evidenced for immediate serial/free recall of word lists and "essentially
nothing else," and the directive is explicit: **"No memory-palace mode, no
'journey' or chain through a set of signs, no spatial layer, no ordered-
route item selection. Item pool is random-access"** `[RC: "No memory-palace
mode, no journey or chain through a set of signs... item pool is
random-access"]`. This rules out most of what a naive reading of "mind-
palace / mnemonic techniques" (the user's own phrase in the task brief)
would suggest building. What _does_ survive: self-explanation is called
"the cheapest well-evidenced intervention available" (g=0.55) but **only**
when it requires generation-or-selection from domain propositions ("which
part told you: [radical]/[phonetic]/[the character it is NOT]") — a
post-hoc strategy-attribution chip is a JOL (judgment of learning), not
self-explanation, and does not get to claim that effect size
`[RC: "self-explanation g=0.55, 69 effect sizes, but only when it requires
generation or selection from domain propositions, never a post-hoc
strategy-attribution chip which is a JOL not self-explanation"]`. Also
note: Chineasy-style invented picture-story mnemonics are a named
reputational liability (`[DESIGN §1.7 #31]`) — every gloss must be marked
`etymological` or `mnemonic-only` against a scholarly source; fabricating
a story for a phono-semantic majority character is a documented failure
mode to avoid, not a feature to build casually.

**Depends on:** Phase 5 (reveal UI — self-explanation is a reveal-time
mechanic).

**Changes — `packages/engine`:**

- Extend the reveal-time schema (from Phase 1/5) with an optional
  self-explanation prompt: a forced-choice or short generation task of the
  form "which part told you [X]" drawing on the item's real component
  data — never a freeform "why do you think this means X" text box with no
  domain proposition to select from, and never framed as a memory-palace
  or spatial mnemonic.
- `etymological` / `mnemonic-only` tagging on any gloss that carries an
  origin story, per `[DESIGN §3.3.3]`'s requirement to mark every such
  gloss against a scholarly reference — this phase should not invent new
  mnemonic glosses; it should only be able to _display_ ones that are
  already tagged, sourced content (a Phase 2/content-authoring concern if
  any get added).

**Changes — `apps/pwa`:**

- A reveal-panel addition (Stage 2, from Phase 5) offering the
  self-explanation prompt where a genuine discriminating cue exists —
  per `[DESIGN §2.5]`, elaboration beyond bare correction is
  **conditional**, mandatory only where a real cue exists (confusables,
  shared components, compound semantics), not a universal fixed-length
  explanation on every item.
- Ship behind whatever the project's existing A/B mechanism is (check
  `[DESIGN §10.2]`'s "two v1 A/B slots" — one is already committed to the
  object-template-rendering question from `[DESIGN §3.2]`'s Decision 2;
  confirm with whoever owns the A/B slate whether this mechanic gets the
  second slot or ships unconditionally as a low-risk additive feature —
  don't assume a slot is free without checking).

**Out of scope for this phase:**

- Anything spatial: no map, no journey, no ordered route through items, no
  "place this character somewhere" interaction of any kind.
- Any claim in UI copy or code comments that this is "using the method of
  loci" or "a memory palace" — the mechanism being built is self-
  explanation, a different, better-evidenced thing; don't blur the two
  even informally.
- Fabricating new mnemonic picture-stories — this phase displays tagged
  content, it doesn't author it.

**Done/verification:**

- `pnpm verify` green.
- Manual check: the self-explanation prompt only appears where the item
  actually has a discriminating cue in its schema (confirm it's absent on
  an item with no meaningful component contrast, e.g. an atomic
  directional sign).
- Code review self-check: grep the diff for "palace," "journey," "loci,"
  "route" — none should appear describing this feature.

---

## 10. Phase 9 — Measurement/instrumentation + CI content gates

**Goal:** Land the build-time assertions and runtime logging DESIGN.md
treats as load-bearing, not optional polish — particularly the ones that
would silently let a later phase regress the ⺼/月 rule, the coverage-
percentage ban, or the exposure-vs-review distinction.

**Why:** `[DESIGN §4.11]`/`[DESIGN §9.3]` specify CI gates as "build gates,
not backlog" — 14+ specific build-time assertions per the design-doc
report's own count, including: CI fails on any highlight expressed as
substring/regex on a character; CI asserts no item containing 期 is tagged
flesh-component; font subset codepoint set must be the union of every item
string _and_ every referenced component id (⺼ appears in no item string,
so naive extraction drops it). `[DESIGN §10]` specifies the primary metric
as volume-at-criterion, a banned-metrics list, and a two-family reporting
rule — none of this exists in code today per the design-doc report's
section 9. `[DESIGN §1.4 P28]`/`[DESIGN §4.5.5]`/`[DESIGN §7.7]`: never
quote a coverage percentage in product copy — report as an enumerable,
verifiable count instead ("you can read 47 of the 120 signs in the metro
set," not "40% coverage").

**Depends on:** Phases 1–5 for there to be something meaningful to gate;
can start once Phase 1/2 land and grow incrementally alongside later
phases rather than waiting for all of them.

**Changes — `packages/engine`:**

- Test/lint-level assertions (wherever this project's existing lint/test
  gating lives — check for an existing CI config before adding a new one):
  no highlighting/dependency/distractor logic expressed as a substring or
  regex match against a hanzi string; every `semantic_radical` reference
  resolves through the stored component table; no item string contains a
  literal U+2EBC or similar non-shipped codepoint (per `[DESIGN §3.3.4]`'s
  ban on putting it in shipped UI copy).
- Attempt-log schema per `[DESIGN §10.1]`: log `chosen_option` (not just
  correct/incorrect) on every attempt, maintain a per-user confusion
  matrix keyed on `(target_item, chosen_item)` per the research corpus's
  directive `[RC: "log chosen_option, not just correct/incorrect, maintain
a per-user confusion matrix — a plain accuracy curve looks healthy while
a pair is being cross-associated"]`.
- `days_between_sessions` instrumentation per `[DESIGN §12.2]`'s
  falsification trigger — this is the single measurement that decides
  whether the whole multiplayer-first architecture is right; get it
  logging early even if nothing consumes it yet.

**Changes — `apps/pwa`:**

- Progress/completion UI: enforce the "signs you can act on" framing
  (`[DESIGN §7.7]`) rather than any percentage — audit whatever session-
  complete or progress screens exist (`Solo.tsx`'s "Session complete"
  card, per the codebase report) for accidental percentage-of-coverage
  language and replace with enumerable counts.
- Mastery display: per `[DESIGN §4.5.5]`, never a per-item mastery
  percentage — ship only the 3 coarse states by shape+fill (NEW/
  LEARNING/SOLID) if/when a mastery indicator is added at all; this phase
  should audit for and prevent the wrong version rather than necessarily
  building the right version from scratch if no mastery UI exists yet.

**Out of scope for this phase:**

- Building a full analytics backend or dashboard — this phase is about
  what gets _logged_ and what CI _gates_, not a reporting UI. `[DESIGN
§10.4]`'s two-family reporting rule can inform a later, separate
  reporting phase if one is ever scoped.
- Any new scheduling or content-model change — this phase should not
  modify behavior, only add checks and logs around existing behavior.

**Done/verification:**

- `pnpm verify` green, and the new CI-style checks actually fail when
  deliberately broken (write a temporary bad test fixture, confirm the
  gate catches it, then remove the fixture) — a gate that's never been
  observed to fail is not verified.
- Manual check: play a session, inspect logged attempt records, confirm
  `chosen_option` and the confusion-matrix-relevant fields are present.

---

## 11. Migration/compatibility note (clean break, stated once)

**This plan is a clean break, not a migration**, for the following
reasons, applying consistently across every phase above:

1. **The content bank is being replaced, not evolved.** `docs/FORK.md`
   already establishes that the entire prior trivia content bank
   (`packages/engine/src/categories.ts`'s 23 trivia categories,
   `packages/engine/src/content/*`'s 21 trivia files) was deleted at fork
   time. There is no trivia player progress to preserve — the current
   16-category Mandarin bank is itself young, seed content authored
   against a schema (the flat 4-option tuple) that Phase 1 replaces
   outright.
2. **Solo progress in `localStorage` is small, device-local, and already
   explicitly "not backed up"** per `soloMemory.ts`'s own comment
   ("Storage blocked or full: the session still plays, it just won't
   remember progress, same degraded mode the rest of the app already
   tolerates") — the product's own stance toward this data is already
   that losing it is tolerable, not catastrophic. Writing a migrator for
   a schema that's about to change twice more (Phases 3 and 4 both widen
   `ItemMemory`) would be throwaway work.
3. **DESIGN.md's own item-state model is a redesign, not a refinement**
   of what exists — per-(player, item, **direction**) 16-byte state, a
   `role: exposure` distinction, a two-scalar item-side Elo, none of which
   the current `ItemMemory` (3 plain scalars) can be mechanically
   upgraded into. A migration script would need to _guess_ values (e.g.
   backfilling `role` for historical reviews that never recorded it) —
   guessing scheduler-relevant history is worse than starting clean, given
   how small the existing dataset is (a handful of solo sessions per
   device, not months of review history).

**Practical consequence for every phase above:** bump the storage key's
version suffix whenever a phase changes what's stored (Phase 3 does this
explicitly); do not write a migrator; let old-version data sit unread in
`localStorage` (harmless) or be cleared (optional, not required). If a
future phase discovers the dataset has grown large enough that this
calculus changes (e.g. after Phase 7 ships and real multiplayer history
accumulates), that's a decision for whoever's planning at that point, not
something to pre-build now against data that doesn't exist yet.

---

## 12. What this plan deliberately does not sequence

For completeness, named here rather than silently absent — these are real
DESIGN.md-specified pieces of work that this plan has not given a phase,
either because they're not blocking the phases above or because scoping
them properly needs a decision this plan isn't positioned to make:

- **The full six-beat turn-structure rebuild** (`[DESIGN §2.4]`/`§5.1]`) —
  flagged as a discovered-scope risk inside Phase 7, not its own phase,
  because the reports available did not trace the current turn reducer in
  enough detail to size this work confidently. Whoever starts Phase 7
  should locate that reducer first and, if it's a large rewrite, propose
  it as its own phase before proceeding.
- **City packs** (`[DESIGN §11.6]`), **audio fields** (`[DESIGN §11.7]`,
  "none in v1"), **stroke-graphics** (`[DESIGN §9.2]`, "licensed out
  entirely for v1"), **held-out test typefaces** (`[DESIGN §9.1]`) — all
  explicitly deferred past v1 by DESIGN.md itself; no phase needed yet.
- **Multi-device WebRTC signalling replacing the banned external hosts**
  (`[DESIGN §11.4]`, `packages/net/src/transport.ts`'s current
  `trystero/nostr` + Cloudflare STUN + two TURN dependency) — DESIGN.md
  rules pass-and-play as v1-primary instead, which sidesteps rather than
  fixes this; if co-located multi-device play becomes a priority, this
  needs its own phase, scoped by someone who has read `PROTOCOL.md`
  alongside `packages/net` in detail.
- **A reporting/dashboard UI for `[DESIGN §10]`'s measurement layer** —
  Phase 9 covers logging and CI gates, not a human-facing report.

### 12.1 Research-corpus gaps found by audit, not yet built

A cross-check of `docs/research/digests.json`/`findings.json` against this
plan (irrespective of what `DESIGN.md` chose to rule on) found the
DESIGN.md-to-plan pipeline solid overall — no dropped _strong_ finding on the
core retrieval mechanism, no folklore quietly readmitted. Three items
DESIGN.md itself calls for were absent from both code and this plan entirely
(not ruled against — just never transcribed):

- **`isomorph_group_id`** `[DESIGN §5.1]` — the confer beat's load-bearing
  follow-up item needs items authored in pairs/triples. **Added to the schema**
  (`Question.isomorph_group_id`, `RowMeta.isomorph_group_id`, a
  `validatePack` check that a group has ≥2 members) ahead of the six-beat
  rebuild and city-pack authoring, so neither has to retrofit it. Still
  unpopulated on any content — Phase D of the six-beat rebuild is what
  actually authors pairs and consumes this field.
- **Confusable-pair scheduling gaps** `[DESIGN §1.2 P39-adjacent]` — a
  min-24h/5–15-intervening-items gap rule for `confusion_type`/
  `confusable_with` pairs. The schema fields already existed
  (`confusion_type`, `confusable_with`, `interference_set` on `Question`) but
  are explicitly "schema-only" per their own doc comment — the scheduling
  _behavior_ (enforcing the gap) is still unbuilt. Not touched by this note;
  flagged here so it isn't lost.
- **Public-failure instrumentation** `[DESIGN §10.2]` — `attemptLog.ts`
  implements the general §10.1 attempt schema well, but the specific
  tripwire fields (`turns_since_last_public_failure`, latency keyed to
  whether the _previous_ turn was a public failure, abandonment, next-session
  return) don't exist yet. Not built by this note — genuine follow-up work,
  smallish and independent of the six-beat rebuild.
