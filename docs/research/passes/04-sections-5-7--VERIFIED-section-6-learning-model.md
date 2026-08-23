# 6. The learning model

## 6.1 What an item is

**An item is a span: a one-to-four-character string that a person meets as a unit on a physical surface. The character is not the item. The character is a skill node underneath it.**

_The character alone_ fails on readability, because coverage is not readability and the gap is multiplicative: at 40% character coverage a four-character dish name reads with probability ≈ 0.40⁴ ≈ 2.6%, not 40%; at 75%, ≈ 32%. Over the 12,010-record frequency table on disk (99,950,541 weighted tokens), a 1,200-character bank covers 90.03% of running characters and a 1,500-character bank 93.07% — one character in fourteen unknown on an unseen sign, so a six-character sign is unreadable about 35% of the time; even chance needs ten characters.

_The whole sign_ fails on reuse. 请扫码点单 is a real string on a real table tent, but it recurs as a template, not a retrieval target, and an item that appears once is one the scheduler cannot act on.

The span is both **met** and **reused**: 出口 (chūkǒu), 保质期 (bǎozhìqī), 净含量 (jìnghánliàng), 换乘 (huànchéng), 末班 (mòbān), 会员价 (huìyuánjià), 售罄 (shòuqìng). Each is a thing a person looks at and either does or does not understand — the criterion task, so the item.

Spans come in **two types**, and they are not the same learning problem:

- **`char_span`** — the menu register, where the barrier is _unknown characters_. The core cooking and offal characters are absent from HSK 3.0 bands 1–3: 涮 (shuàn) is corpus rank 5,115, 炖 (dùn) 3,415, 卤 (lǔ) 2,663, 荤 (hūn) 3,302, 煸 (biān) 7,622, 胗 (zhēn) 7,674. It does not generalise to every cooking verb — 烧 is HSK 3, 烤 HSK 4 — so the bank is authored, not band-filtered. The work is acquisition.
- **`opaque_span`** — transit, labels and shopfronts, where _every constituent character is already nominally known_ and the compound is still unreadable. 换乘 is 换 (837) + 乘 (1,238); 净含量 is 净 (1,436) + 含 (853) + 量 (202); 保质期 is 保 (286) + 质 (357) + 期 (214). All top-1,500, all opaque as compounds. The work is parsing, and a decomposition reveal that pretends otherwise teaches an inference rule that misfires on the street.

Both share one schema, state record and scheduler, differing in the reveal and in `transparency` (`transparent | semi | opaque`); an opaque span carries an explicit "this one does not come apart — learn it whole" line rather than a fabricated component story.

**Characters get a second table.** Every span stores `component_char_ids[]`, script-scoped and never shared, because the dependency graph is not isomorphic across scripts — 肠/腸, 脑/腦, 换/換, 净/淨, 质/質 differ in components, not just glyph. When a span resolves, each character receives a **credited exposure at discounted weight**: enough to move a character node, not enough to graduate it alone. This makes the bank compound rather than accumulate — 期 is met inside 保质期 on a yoghurt pot and again inside 星期, one node, two spans — and makes per-player eligibility computable: a span is eligible only when its component characters are introduced _for that player_.

**Component identity is a codepoint, never a substring or a glyph.** The flesh radical ⺼ (U+2EBC, CJK RADICAL MEAT) in 肝 肠 肚 腰 脑 and the moon character 月 (U+6708) in 期 are distinct ids and must never be unified. They render identically in almost every font, so no rule — dependency, distractor selection, reveal highlighting — may match, group or count components by rendered substring. Normalisation is not the hazard (NFC/NFD/NFKC/NFKD all leave U+2EBC unchanged, verified); glyph matching and hand entry are.

Direction is fixed: **sign → meaning (L2 → L1), permanently**. Form similarity hurts; semantic relatedness helps in L2→L1 and turns harmful in L1→L2. There is no production mode. `direction` sits in the key so a future audio mode needs no migration; in v1 it is a constant.

## 6.2 The category set

Five domains, weighted, each subdivided into **scenes**. The scene, not the domain, is what an opposing team deals.

| Domain  | Weight | Scenes                                                                                     |
| ------- | ------ | ------------------------------------------------------------------------------------------ |
| Market  | 30%    | shelf-edge price label · weight and unit · packaged-food back panel · checkout and payment |
| Menu    | 30%    | cooking method · animal and cut · heat and flavour · the ordering screen                   |
| Street  | 20%    | shopfront trade · discount and promotion · open or closed · fascia wayfinding              |
| Safety  | 15%    | prohibition · warning · instruction · exit and emergency                                   |
| Transit | 5%     | platform and direction · ticket and fare                                                   |

The weights are counter-intuitive and the app must say why in one line: **the metro is already in English; the noodle shop is not.** Bilingual signage in tier-1 metros and airports is procurement practice, not law — GB/T 30240 is 推荐性, recommended. GB 7718, which requires Chinese on packaged-food labels and forbids foreign text larger than the corresponding Chinese, is mandatory. The supermarket back panel is where no English is coming; transit is where it already arrived. These weights are a v1 guess to be replaced by measured encounter rates; nobody has counted how many signs of each type a visitor needs to read per day.

Scene granularity is forced by the one thing the wager still legitimately does. Betting before the item appears is a **prequestion**: the benefit is large (g ≈ 0.66) but _strictly item-specific_, with none for other material in the same activity. Those studies used texts, lectures and videos, not signage, so what transfers is the commit-before-reveal structure, not the effect size. The dealt category must be narrow enough that anticipating it means anticipating roughly what will be asked. "Weight and price on a market label" works; "Transport" does not. Eighteen scenes at two-to-four per domain keeps the pretest honest.

Each item carries exactly one `scene_id` plus an optional `also_seen_in[]`, used only for retrieval-context tagging, never for dealing. If an item can be reached from three scenes, the deal stops predicting it and the prequestion stops being one.

Safety is over-weighted relative to its share of signage because GB 2894 makes it the one domain where illocutionary force arrives before any character is decoded: red circle with diagonal bar is prohibition, yellow triangle warning, blue filled circle instruction, green square notice. A brand-new player can act correctly on a half-read sign — the right on-ramp, and the right place to seat someone with fifty characters at a table of people with eight hundred.

`scene_id` is orthogonal to `render_variant`, the surface the item was _drawn on_ this presentation, which is what the `contexts.size >= 3` graduation gate counts and what the naked probe strips.

## 6.3 Difficulty

Difficulty is three quantities, and the first discipline is to stop calling all three "difficulty".

**1. Authoring tier (`tier`, static, build-time).** Its only job is cold start, and it is **authored signage utility**, not any inherited band. The rank data kills corpus frequency: a frequency-ordered 1,500-character bank contains 期, 保, 质, 量, 含 and excludes 涮, 炖, 卤, 荤, 煸, 胗 — precisely backwards for a menu. But the 通用规范汉字表 cannot serve as a spine either: 涮, 卤, 荤 are 一级 and 炖, 煸, 胗 二级, the same bands that hold 期, 保, 质, 量, 含, 换, 乘, 净. It is a coverage list of 8,105 characters encoding no signage utility, so it discriminates nothing here. Tier is hand-assigned per item and audited against encounter data; the standard bands are an inventory check only. Quoting coverage percentages in product copy is indefensible regardless: two corpora both called "Chinese character frequency" disagree by five to seven points at rank 1,000 and do not agree on their own top three, and the table on disk is mixed-script, carrying 1,159 traditional forms.

**2. Item difficulty (`θ_i`, learned, shared across players on the device).** FSRS has no item-side mechanism — its difficulty parameter is per player-item from a global constant — so the item side is a two-scalar Elo `(θ_i, n_i)`, updated after every response with `K = 0.4 / (1 + 0.05·n_i)`. This follows Math Garden (Klinkenberg et al. 2011), the production precedent running Elo on players _and_ items at national scale and serving items at a target success probability. The constants are reasonable starting values, not published ones, and must not be presented as literature-derived. `prior_difficulty` and `observed_difficulty` live in separate columns so the prior can be re-fit without destroying evidence.

Cold start is heavily shrunk, because rich per-item difficulty features are a documented production failure: at Duolingo, lexeme-tag features acquired large negative weights, students complained of items decaying too fast, the paper attributes this to feature-based overfitting despite L2 regularisation, and the shipped fix was to delete those features (HLR-lex). One post-mortem at one company, not a controlled test — it licenses caution, not a law.

```
predicted_initial_difficulty = global_mean + 0.3 × (feature_prediction − global_mean)
features = { stroke_count, char_count, tier, all_components_introduced }
initial_interval clamped to [0.5×, 1.5×] the global new-item interval
```

**3. Per-player retrievability `R_p(i)` — the only quantity the scheduler consumes.** Computed inline at selection time, never persisted as a due date, so a phone asleep three weeks needs no catch-up job:

```
decay  = 0.1542
FACTOR = 0.9^(1/−0.1542) − 1 = 0.980346
R(t,S) = (1 + 0.980346·t/S)^(−0.1542)          # R = 0.9 at t = S; R(10S) = 0.693
I(r,S) = S·(r^(1/−0.1542) − 1) / 0.980346
```

**Difficulty is targeted in retrievability, never in observed accuracy.** `P(correct) = R + (1 − R)/k`, so if k varies by format, holding observed accuracy fixed drives true R down wherever k is smallest — putting the weakest players at the _lowest_ true retrievability, the inverse of intent. **k is constant at 4 at every tier**, because options stay meaning-side always, so there is one correction constant and the inversion cannot arise. To hit a common true R of 0.85 the session controller targets **observed 0.8875**. FSRS desired retention stays at 0.90 as a separate knob governing cross-day return; neither drives the other.

Format tier varies only on the **cue** side — whether pinyin is rendered vertically under each character — keyed to measured per-item competence, not to a wager. Consequence: **pinyin-shown presentations do not advance stability.** A player who knows 牛肉 (niúròu) by ear answers a pinyin-shown card without reading a character; those rows log `role: exposure`. Otherwise: correct without pinyin → Good (3); correct on a first-ever sighting → **Hard (2)**, because at k = 4 an item with no memory strength is answered correctly by chance a quarter of the time, making a first correct weak evidence; any incorrect → Again (1); a commit-window timeout → `role: exposure`, never Again, or a player who put their phone down loses a week of intervals.

## 6.4 Item state stored per player

Two stores, and the boundary is load-bearing. The **shared game log** is append-only, signed, synced P2P, and holds `{playerId, itemId, choice, elapsedMs}` and nothing about memory. The **memory store** is local to the device, never synced, never in the reducer.

Per `(player, item_id, direction)`, 16 bytes of scheduler state:

```
stability    f32
difficulty   f32
last_review  f64
```

Plus learner-model counters — a logistic regression over six features, four counts and two continuous, ~24 bytes, no neural knowledge tracing and no BKT:

```
attempts, correct, attempts_this_char, correct_this_char,
log1p(days_since_last), item_difficulty
```

Deep knowledge tracing splits 4–4 against logistic regression over hand-built counts at gaps of 0.01–0.06 AUC, on a benchmark that is mostly maths tutoring systems plus one Spanish vocabulary set, so it transfers here only loosely. The local argument decides it: a gap that small is unrecoverable at ~30 responses per player per evening.

Plus per-item bookkeeping: `exposure_count` (drives distractor tier — distant distractors until an item has been answered correctly once, component-sharing distractors only after, matched on component id), `contexts_seen` (a set, for the ≥ 3 gate), `naked_probe_correct / naked_probe_attempts`, `state ∈ {NEW, LEARNING, SOLID}`, `seeded_in_session_id`, `high_confidence_miss`.

A 3,000-span + 3,000-character bank × 8 local seats is 48,000 rows. At 40 bytes of numeric state per row plus bookkeeping and IndexedDB overhead, budget low single-digit MB.

Every presentation writes one review row per player, always, on the standard schema — `card_id`, `review_time` (ms, UTC), `review_rating {1,2,3,4}`, `review_state {0,1,2,3}`, `review_duration` — plus `player_id`, `mode {solo|group}`, `role`, `format_tier`, `n_alternatives`, `eligible_for`, `render_variant`, `distractor_set`, `response_latency_ms`, and **the per-player R vector at selection time**, so any selection decision can be evaluated retrospectively. `day_start = 4`, so a late restaurant session and the ride home are one day.

Never render a per-item mastery percentage. In the only large-scale published comparison in a real language product (Settles & Meeder 2016, Duolingo), every scheduler tested ranked item-level recall at AUC 0.510–0.542 against 0.500 chance, the best of them Leitner at 0.542. Three coarse states by shape and fill (NEW outline, LEARNING half, SOLID filled) is the most that supports, and SOLID must fall back to LEARNING when R decays below ~0.7. Aggregate progress shows at deck level only, where averaging over ~100 items makes the estimate defensible.

## 6.5 One item, N schedules

### Prior art: none we could find

There is no library, benchmark or on-point paper for selecting a single stimulus that N simultaneous learners all answer. The nearest published work is **single-learner** session-level selection with public code and released trial data (Upadhyay, Lancashire, Moser & Gomez-Rodriguez 2021, _npj Science of Learning_ 6:26, and the Tabibian line behind it). Math Garden is the precedent for the adaptive-difficulty half, but every child there gets their own item; classroom CAT is individual by construction; the co-located quiz literature measures enjoyment, not learning. So: **no prior art. What follows is reasoned from first principles and is the highest-risk unvalidated bet in the design.**

Three obvious answers fail before implementation. _Averaging the table into one composite learner_ discards the information the selector exists to use: a table whose weakest member knows 300 characters and whose strongest 1,200 has a composite due for nobody. _Dealing from the active player's queue only_ makes the item a property of whose turn it is, colliding with the opposing team dealing the scene. _Drawing from a shared frequency deck_ is what the trivia engine already does, and throws the product away.

### The mechanism

**The dealt item comes from the union of every seated player's due queue, scored by a group objective with a rotating priority player.**

`pickItem(candidates, players[]) → item` is pure and stateless, taking each player's R for each candidate. Being pure, the objective is swappable, the counterfactual choice of any alternative loggable, and the whole thing A/B-able without touching storage.

1. **Candidates** = union of all seated players' due items, filtered to the dealt scene. Eligibility is applied **per player, not group-wide**. Group-wide is catastrophic: assuming the weaker player's characters are a subset of the stronger's, a 300-vs-1,200 table excludes 75% of the strong player's known characters before the difficulty objective runs, and 600-vs-1,800 excludes 67%. On spans it is worse, because span readability is multiplicative in its characters.
2. **Priority player π** rotates round-robin and is _not_ the answerer — everyone answers every round. π is only whose queue gets first claim.
3. **Score** `U(i) = −Σ_p w_p·(R_p(i) − 0.85)²`, with `w_π = 3` and `w_p = 1` otherwise. Softmax-sample over the top 8 rather than argmax, so no two evenings produce the same sequence. Worst case is the whole 3,000-span bank × 8 players ≈ 24k `pow()` calls, well under 2 ms on a phone; scene filtering makes the real candidate set a fraction of that.
4. **Four hard, non-tunable constraints** override the objective: no item scored twice in one session (recurrences log `role: exposure`); no item leaves LEARNING on same-session corrects — a correct in a _later_ session is required; after two consecutive misses by any player, force-inject an item where that player's R > 0.95; floor every per-player minimum interval at 1 day.

The priority player makes a guarantee pure averaging cannot: over an eight-round band with four players, each gets two rounds where their own queue dominates — "two of these were picked for you."

### What the non-priority players get

Under blind simultaneous commit **there are no non-acting players** — everyone answers every item privately on their own phone, one review row per player per round. This makes per-player scheduling possible, and is independently required: an opponent who _chose your item_ and holds a stake in your failure is not the passive audience whose effect is small. Mere-presence effects are tiny; evaluation apprehension plus outcome interdependence is a different condition the reassuring number does not cover. So: what does a player get from an item not due for them?

- **Too easy (R_p > 0.95).** A real cost — a retrieval that succeeds when the item was nearly forgotten is worth far more than a comfortable one. Ruling: log the row, but an item whose pre-answer R_p > 0.95 advances stability at most once per session, so intervals cannot inflate off freebies. These also serve as the force-inject pool.
- **Right point (0.7 ≤ R_p ≤ 0.95).** Full-value retrieval. Nothing special.
- **New or nearly lost (R_p < 0.7, or NEW).** Here the format earns something solo cannot. The item resolves publicly, component breakdown as the largest block on the reveal, one confusable beside it — 入口 beside 出口, 荤 beside 素, 期 (⿰其月, component 月 U+6708) beside 肝 (⿰⺼干, flesh radical ⺼ U+2EBC). A wrong guess followed by corrective feedback is _productive_, and a first encounter has to happen somewhere. Ruling: an item dealt from someone else's queue that is NEW for player p **enters p's schedule as a completed first review**, graded Hard on a correct and Again on a miss, initial stability from the pretrain-4 fit.

That is a design claim, not a finding: **the group session is a review session for the priority player and an introduction engine for everyone else.** Its job is to seed items and pay the social cost of first encounters; the solo session's job is to space them.

Two guardrails. Never show what other players picked — seeing another player's wrong answer implants it, and people later reproduce others' errors as their own memories. That is a correctness argument, not a comfort argument. Show only an anonymous filled-dot count that each player committed: the effort cue, never the magnitude, which is the ability cue.

The claim is falsifiable from the first cohort's log: do group-seeded items reach a ≥ 7-day delayed correct at the same rate as items first met solo? If they trail, the introduction-engine claim is wrong and the weights collapse to `w_π` only.

### Reconciling solo and group

**There is one schedule. There is no such thing as multiplayer progress.** The group session writes into the same local per-player memory store as solo, through the same grade mapping and the same four constraints. The shared signed log is the _game_; the private memory store is the _product_. Three things make it work.

**Identity is the device.** With no accounts, the phone that joins a table binds its local `player_id` to that seat. A guest on someone else's phone in pass-and-play gets an ephemeral seat writing to a scratch store, offered as a JSON export at the end and otherwise discarded — never silently merged into the host's.

**The constraints are mode-blind.** Same-session and same-day rules apply across modes: a restaurant round and the solo review on the ride home fall inside one day boundary (`day_start = 4`) and count as one session for LEARNING graduation. This stops a group evening inflating intervals on an item met four times under social pressure.

**The morning-after queue.** The group session writes a `seeded_today` set, and the solo scheduler puts those items at the _front_ of the next day's queue. The second exposure of a newly introduced item should fall after a night, not later the same evening. This single rule converts a structurally massed party game into a spaced one, and it is the hinge the whole model turns on.

The modes are not redundant, because they carry opposite constraints. Same-item repetition needs a **minimum** gap (≥ 24h). Confusion sets plausibly need a **maximum** gap — confusable items close together but not adjacent, 5–15 intervening items, never split across sessions. **This is a bet, and the meta-analytic evidence does not endorse it for word-like material.** The one large interleaving meta-analysis (59 studies, 238 effect sizes, 158 samples) gives overall g = 0.42, paintings g = 0.67, mathematics g = 0.34, and **words g = −0.39, a reliable advantage for blocking.** The case for tight scheduling rests instead on the discrimination-contrast argument: 未/末 is a visual category-induction problem, closer to the paintings cell than the paired-associate words cell. That is a hypothesis about which cell character forms fall into, and it ships instrumented — A/B tight-contrast against blocked-then-spaced on confusion-set members, read on the ≥ 7-day delayed correct rate. If words wins, confusion sets get the same ≥ 24h minimum as everything else. A group session is the only place a confusion set can be walked tightly under shared attention; solo is where the ≥ 24h spacing happens. Either way the schema needs both `confusion_set_id` and `isomorph_group_id`, and the scheduler both bounds.

Finally, the falsification test governing everything above: instrument `sessions_per_week` and `days_between_sessions` split by mode from the first cohort. **If the median multiplayer gap exceeds ~7 days while solo sits under ~3, invert the architecture** — solo daily becomes the primary path and the group session becomes purely the acquisition channel and introduction engine. That is the role this section has already assigned it: the inversion costs a router change, not a rewrite.

## Corrections applied

- **⺼ vs 月 — confirmed, and hardened.** In the decomposition table 肝 肠 肚 腰 脑 all take ⺼ U+2EBC (radical and decomposition agree) and 期 takes 月 U+6708; the original was right. Added a codepoint-identity rule barring substring or glyph matching on components, since the two render identically, and verified NFC/NFD/NFKC/NFKD leave U+2EBC unchanged.
- **All pinyin and all 14 corpus ranks verified and unchanged,** as are 90.03%, 93.07% and 99,950,541.
- **Arithmetic repaired:** 12,009 → **12,010 records** (the last line lacks a trailing newline, so `wc -l` under-counts by one); "even chance a six-character sign is unreadable" → **35%** (1 − 0.9307⁶; even chance needs ~10 characters); "twenty-two scenes at four-to-six per domain" → **eighteen at two-to-four**, matching the table; "~96,000 rows" → **48,000**, with the size raised, since 40 bytes/row is 1.9 MB of numerics before bookkeeping and "~1.5 MB" was unattainable; "6,000 candidates × 8 players ≈ 50k ops" → **≈24k**, the bank being 3,000 spans, characters being skill nodes rather than dealt items; and "excludes 80% … still 62%" → **75% and 67%**, the actual character arithmetic with the subset assumption stated — the originals were not derivable from anything given.
- **The "first three official bands" claim was false.** 涮, 卤, 荤 are 一级 and 炖, 煸, 胗 二级 of the 通用规范汉字表. The true claim is HSK 3.0 bands 1–3, and even that does not generalise (烧 is HSK 3, 烤 HSK 4), so the blanket "ten cooking verbs / seven ingredient characters" version is dropped.
- **Authoring tier no longer claims a 通用规范汉字表 spine** — a recommendation that did not follow from the cited rank finding, since the same bands hold 涮/卤/荤 _and_ 期/保/质/量/含/换/乘/净. Tier is now authored signage utility. Added that the frequency table is itself mixed-script (1,159 traditional forms), strengthening the existing ruling against quoting coverage in product copy.
- **AUC claim replaced with actual numbers.** "Every published model … within 0.04 AUC of chance" was an overreach and slightly wrong: the schedulers ran 0.510–0.542 against 0.500, Leitner at 0.542. Scoped to the one study and product it comes from.
- **Duolingo quotation removed** — "would decay rapidly regardless of how often they practiced" is not in the source. Paraphrased to what the paper reports and scoped as a post-mortem; the delete-the-features conclusion survives.
- **"A quarter of those are guesses" corrected.** At k = 4 the chance rate on an unknown item is 25%; the share of _corrects_ that are guesses depends on R and approaches 100% at R = 0. Hard (2) kept on the corrected reasoning.
- **Interleaving claim inverted back.** "The manipulation with the strongest support for exactly this material" was backwards — the meta-analysis words cell is g = −0.39, favouring blocking. Rewritten as an explicit bet on the discrimination-contrast argument, with cell values stated and an A/B test attached.
- **"Six integers" → six features** (two are continuous); **DKT 4–4 split scoped** to a mostly-maths benchmark, with the data-volume argument carrying the decision.
- **Smaller repairs:** prequestion transfer scoped to texts and lectures; GB 2894's four-category scheme given, matching the four Safety scenes; GB 7718's foreign-text size rule added; Math Garden credited where the Elo design descends from it; the k-inversion argument made conditional on k varying, since k is fixed at 4; social-contagion and evaluation-apprehension mechanisms named; "no prior art" softened to "none we could find" in the heading, ruling intact.
- **Length note:** this runs ~3,950 words against the 2,000–3,000 target. The source section was already ~3,400 and the corrections add material; I compressed prose by roughly 10% but stopped short of deleting rulings, schema fields or verified figures to hit the count. Verification scripts and the working copy are at `/tmp/claude-0/-home-user-dohhh/4806d96a-ebd4-5774-9d7d-fe7e365865df/scratchpad/out/sec6.md` and `/tmp/claude-0/-home-user-dohhh/4806d96a-ebd4-5774-9d7d-fe7e365865df/scratchpad/vfy_doc2.py`.
