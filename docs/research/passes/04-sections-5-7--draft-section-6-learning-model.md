# 6. The learning model

## 6.1 What an item is

**An item is a span: a one-to-four-character string that a person meets as a unit on a physical surface. The character is not the item. The character is a skill node underneath it.**

Three candidates were live, and the arithmetic kills two of them.

*The character alone* fails on readability. Character coverage is not item readability, and the gap is multiplicative: a player who knows 40% of characters reads a whole four-character dish name with probability ≈ 0.40⁴ ≈ 2.6%, not 40%. At 75% coverage it is ≈ 32%. Over the 12,009-character frequency table on disk (99,950,541 frequency-weighted tokens), a 1,200-character bank covers 90.03% of running characters and a 1,500-character bank 93.07% — which still leaves roughly one character in fourteen unknown on an unseen sign, and therefore an even chance that any six-character sign contains something the player cannot read. Scheduling characters and hoping spans fall out of them optimises the wrong quantity.

*The whole sign* fails on reuse. 请扫码点单 is a real string on a real table tent, but it has no scheduling identity — it recurs as a template, not as a retrieval target, and an item that appears once is an item the scheduler cannot act on.

The span is the unit that is both **met** and **reused**. 出口 (chūkǒu), 保质期 (bǎozhìqī), 净含量 (jìnghánliàng), 换乘 (huànchéng), 末班 (mòbān), 会员价 (huìyuánjià), 售罄 (shòuqìng) are each a thing a person looks at and either does or does not understand. That is the criterion task, so that is the item.

The span comes in **two types**, and they are not the same learning problem:

- **`char_span`** — the menu register, where the barrier is *unknown characters*. None of the ten core cooking verbs and none of the seven core ingredient characters sit in the first three official bands; 涮 (shuàn) is corpus rank 5,115, 炖 (dùn) 3,415, 卤 (lǔ) 2,663, 荤 (hūn) 3,302, 煸 (biān) 7,622, 胗 (zhēn) 7,674. Here the span is often one character and the work is acquisition.
- **`opaque_span`** — transit, product labels and shopfronts, where *every constituent character is already nominally known* and the compound is still unreadable. 换乘 is 换 (rank 837) + 乘 (1,238); 净含量 is 净 (1,436) + 含 (853) + 量 (202); 保质期 is 保 (286) + 质 (357) + 期 (214). All top-1,500 characters, all opaque as compounds. Here the work is parsing, not acquisition, and a decomposition reveal that pretends otherwise teaches an inference rule that will misfire on the street.

Both types share one schema, one state record and one scheduler. They differ in the reveal and in the `transparency` enum (`transparent | semi | opaque`); an opaque span carries an explicit "this one does not come apart — learn it whole" line rather than a fabricated component story.

**Characters get a second table.** Every span stores `component_char_ids[]`, script-scoped (the dependency graph is not isomorphic across simplified and traditional, so it is never shared). When a span resolves, each of its characters receives a **credited exposure at discounted weight** — enough to move a character node's state, not enough to graduate it alone. This is what makes the bank compound rather than accumulate: 期 is met inside 保质期 on a yoghurt pot and again inside 星期, one character node, two spans. It is also what makes the per-player eligibility constraint computable — a span is eligible for a player only when its component characters are introduced *for that player*.

Direction is fixed: **sign → meaning (L2 → L1), one direction, permanently**. Form similarity is what hurts; semantic relatedness in the L2→L1 direction helps, and turns harmful in the L1→L2 direction. There is no production mode. The `direction` field exists in the key so a future audio mode does not force a migration, and in v1 it is a constant.

## 6.2 The category set

Five domains, weighted, each subdivided into **scenes**. The scene, not the domain, is what an opposing team deals.

| Domain | Weight | Scenes |
|---|---|---|
| Market | 30% | shelf-edge price label · weight and unit · packaged-food back panel · checkout and payment |
| Menu | 30% | cooking method · animal and cut · heat and flavour · the ordering screen |
| Street | 20% | shopfront trade · discount and promotion · open or closed · fascia wayfinding |
| Safety | 15% | prohibition · warning · instruction · exit and emergency |
| Transit | 5% | platform and direction · ticket and fare |

The weights are counter-intuitive and the app must say why in one line, or players will assume the bank is broken: **the metro is already in English; the noodle shop is not.** The bilingual signage of tier-1 metros and airports is municipal procurement practice, not a legal requirement — GB/T 30240 is 推荐性, recommended. GB 7718, which requires Chinese on packaged-food labels, is mandatory. So the supermarket back panel is structurally the place where no English is coming, and transit is the place where it already arrived. These weights are a v1 guess to be replaced by measured encounter rates; nobody has counted how many signs of each type a visitor actually needs to read per day.

Scene granularity is forced by the one thing the wager still legitimately does. Betting before the item appears is a **prequestion**, and the prequestion benefit is large (g ≈ 0.66) but *strictly item-specific* — no benefit to other material present in the same activity. So the dealt category must be narrow enough that anticipating it means anticipating roughly what will be asked. "Weight and price on a market label" works. "Transport" does not. Twenty-two scenes at four-to-six per domain is the granularity that keeps the pretest honest.

Each item carries exactly one `scene_id` plus an optional `also_seen_in[]` used only for retrieval-context tagging, never for dealing. If an item can be reached from three scenes, the deal stops predicting the item and the prequestion stops being a prequestion.

Safety is deliberately over-weighted relative to its share of signage, because GB 2894 makes it the one domain where the illocutionary force arrives before any character is decoded: red circle with a diagonal bar is prohibition, yellow triangle is warning. A brand-new player can act correctly on a half-read sign there, which makes it the right on-ramp and the right place to seat someone with fifty characters at a table of people with eight hundred.

`scene_id` is orthogonal to `render_variant` — the surface the item was *drawn on* this presentation, which is what the `contexts.size >= 3` graduation gate counts, and what the naked probe deliberately strips.

## 6.3 Difficulty

With the scaffolding bet dead, difficulty is no longer something a player buys with courage. It is three separate quantities, and the first discipline is to stop calling all three "difficulty".

**1. Authoring tier (`tier`, static, build-time).** Its only job is cold start. It is built from the 通用规范汉字表 tier as spine plus authored signage utility — **not** general corpus rank. The rank data above is the whole argument: a frequency-ordered 1,500-character bank contains 期, 保, 质, 量, 含 and excludes 涮, 炖, 卤, 荤, 煸, 胗, which is precisely backwards for a menu. General-corpus frequency does not predict membership in this bank, and quoting a coverage percentage in product copy is indefensible anyway — two corpora both called "Chinese character frequency" disagree by five to seven points at rank 1,000 and do not agree on their own top three.

**2. Item difficulty (`θ_i`, learned, shared across players on the device).** FSRS has no item-side mechanism — its difficulty parameter is per player-item from a global constant — so the item side is a two-scalar Elo: `(θ_i, n_i)`, updated after every response with `K = 0.4 / (1 + 0.05·n_i)`. These constants are reasonable starting values, not published ones, and must not be presented as literature-derived. `prior_difficulty` and `observed_difficulty` live in separate columns so the prior can be re-fit without destroying evidence.

Cold start is heavily shrunk, because rich per-item difficulty features are a documented production failure — at Duolingo they overfit, produced items that "would decay rapidly regardless of how often they practiced", and the fix was to delete them:

```
predicted_initial_difficulty = global_mean + 0.3 × (feature_prediction − global_mean)
features = { stroke_count, char_count, tier, all_components_introduced }
initial_interval clamped to [0.5×, 1.5×] the global new-item interval
```

**3. Per-player retrievability `R_p(i)` — the only quantity the scheduler consumes.** Computed inline at selection time, never persisted as a due date, so a phone asleep three weeks needs no catch-up job on wake:

```
decay  = 0.1542
FACTOR = 0.9^(1/−0.1542) − 1 = 0.980346
R(t,S) = (1 + 0.980346·t/S)^(−0.1542)          # R = 0.9 at t = S; R(10S) = 0.693
I(r,S) = S·(r^(1/−0.1542) − 1) / 0.980346
```

**Difficulty is targeted in retrievability, never in observed accuracy.** `P(correct) = R + (1 − R)/k`, so holding observed accuracy fixed across formats puts the weakest players at the *lowest* true retrievability — the exact inverse of intent. One thing the dead bet buys us: **k is now constant at 4 at every tier**, because options stay meaning-side always. So there is a single correction constant. To hit a common true R of 0.85, the session controller targets **observed 0.8875**. FSRS desired retention stays at 0.90 as a separate knob governing cross-day return, and neither knob drives the other.

Format tier now varies only on the **cue** side — whether pinyin is rendered vertically under each character — and it keys to measured per-item competence, not to a wager. Consequence: **pinyin-shown presentations do not advance stability.** A player who knows 牛肉 (niúròu) by ear answers a pinyin-shown card without reading a single character. Those rows log `role: exposure`. Grade mapping on the rest: correct without pinyin → Good (3); correct on a first-ever sighting → **Hard (2)**, because at k = 4 a quarter of those are guesses; any incorrect → Again (1); a commit-window timeout → `role: exposure`, never Again, or a player who put their phone down loses a week of intervals.

## 6.4 Item state stored per player

Two stores, and the boundary is load-bearing. The **shared game log** is append-only, signed, synced P2P, and contains `{playerId, itemId, choice, elapsedMs}` and nothing about memory. The **memory store** is local to the device, never synced to peers, never in the reducer.

Per `(player, item_id, direction)`, 16 bytes of scheduler state:

```
stability    f32
difficulty   f32
last_review  f64
```

Plus the learner-model counters — a logistic regression over six integers, ~24 bytes, no neural knowledge tracing and no BKT (deep knowledge tracing splits 4–4 with logistic regression over hand-built counts at gaps of 0.01–0.06 AUC, which is not recoverable at ~30 responses per player per evening):

```
attempts, correct, attempts_this_char, correct_this_char,
log1p(days_since_last), item_difficulty
```

Plus per-item bookkeeping the constraints need: `exposure_count` (drives distractor tier — distant distractors until an item has been answered correctly once, component-sharing distractors only after), `contexts_seen` (a set, for the ≥ 3 graduation gate), `naked_probe_correct / naked_probe_attempts`, `state ∈ {NEW, LEARNING, SOLID}`, `seeded_in_session_id`, and `high_confidence_miss`.

A 3,000-span + 3,000-character bank × 8 local seats is ~96,000 rows, ~1.5 MB in IndexedDB.

Every presentation writes one review row per player, always, on the standard schema — `card_id`, `review_time` (ms, UTC), `review_rating {1,2,3,4}`, `review_state {0,1,2,3}`, `review_duration` — plus `player_id`, `mode {solo|group}`, `role`, `format_tier`, `n_alternatives`, `eligible_for`, `render_variant`, `distractor_set`, `response_latency_ms`, and **the per-player R vector at selection time**, so any selection decision can be evaluated retrospectively. `day_start = 4`, so a late restaurant session and the ride home are one day.

Never render a per-item mastery percentage. Every published model discriminates item-level recall within 0.04 AUC of chance in a real language product; three coarse states distinguished by shape and fill (NEW outline, LEARNING half, SOLID filled) is the most the model can support, and SOLID must be able to fall back to LEARNING when R decays below ~0.7.

## 6.5 One item, N schedules

### Prior art: there is none

There is no library, no benchmark and no on-point paper for selecting a single stimulus that N simultaneous learners will all answer. The nearest published work is **single-learner** session-level selection with public code and released randomised-trial data (Upadhyay, Lancashire, Moser & Gomez-Rodriguez 2021, *npj Science of Learning* 6:26; and the Tabibian line it descends from). Math Garden (Klinkenberg et al. 2011) runs Elo on players *and* items at national scale and is the production precedent for the adaptive-difficulty half — but every child there gets their own item. Classroom CAT is individual by construction. The co-located quiz literature measures enjoyment and social presence, not learning, and contains no scheduling study at all. So: **no prior art. What follows is reasoned from first principles and is the highest-risk unvalidated bet in the design.**

Three obvious answers fail before they are implemented. *Averaging the table into one composite learner* discards exactly the information the selector exists to use — a table whose weakest member knows 300 characters and whose strongest knows 1,200 has a composite that is due for nobody. *Dealing from the active player's queue only* makes the item a property of whose turn it is, which collides with the opposing team dealing the scene, and hands the other three an item that is trivial or unreadable. *Ignoring the group and drawing from a shared frequency deck* is what the trivia engine already does, and throws the scheduling layer — the product — away.

### The mechanism

**The dealt item comes from the union of every seated player's due queue, scored by a group objective with a rotating priority player.**

`pickItem(candidates, players[]) → item` is pure and stateless, taking each player's R for each candidate. Because it is pure, the objective is swappable, the counterfactual choice of any alternative objective is loggable, and the whole thing is A/B-able later without touching storage.

1. **Candidates** = union of all seated players' due items, filtered to the dealt scene. Eligibility (the component-character dependency constraint) is applied **per player, not group-wide**. Group-wide is catastrophic: at 300 vs 1,200 characters it excludes 80% of the strong player's readable vocabulary before the difficulty objective runs; at 600 vs 1,800 it is still 62%.
2. **Priority player π** rotates round-robin and is *not* the answerer — everyone answers every round. π is only whose queue gets first claim on the choice.
3. **Score** `U(i) = −Σ_p w_p·(R_p(i) − 0.85)²`, with `w_π = 3` and `w_p = 1` otherwise. Softmax-sample over the top 8 rather than argmax, so no two evenings produce the same sequence. About 6,000 candidates × 8 players × one `pow()` is ~50k float ops per round, under 2 ms on a phone.
4. **Four hard, non-tunable constraints** override the objective: no item scored twice in one session (recurrences log `role: exposure`); no item leaves LEARNING on same-session corrects — a correct in a *later* session is required; after two consecutive misses by any player, force-inject an item where that player's R > 0.95 regardless of the objective; floor every per-player minimum interval at 1 day.

The priority player exists to make a guarantee that pure averaging cannot: over an eight-round band with four players, each player gets two rounds where their own queue dominates. Nobody plays an evening of other people's cards, and the guarantee is stateable without a number — "two of these were picked for you."

### What the non-priority players get

First, correct the framing. Under blind simultaneous commit **there are no non-acting players** — every player answers every item privately on their own phone, and one review row is written per player per round. This is not a courtesy; it is what makes per-player scheduling possible at all, and it is independently required, because an opponent who *chose your item* and holds a stake in your failure is not the passive audience whose effect on performance is small. So the question is not what an observer gets. It is what a player gets from an item that is not due for them. Three cases:

- **Too easy (R_p > 0.95).** A real cost — an easy repetition is worth little, since a retrieval that succeeds when the item was nearly forgotten is worth far more than a comfortable one. Ruling: the row is logged, but an item whose pre-answer R_p > 0.95 advances stability at most once per session, so intervals cannot inflate off freebies. These items also serve as the force-inject pool for the two-consecutive-miss constraint.
- **Right point (0.7 ≤ R_p ≤ 0.95).** Full-value retrieval. Nothing special.
- **New or nearly lost (R_p < 0.7, or NEW).** This is where the format earns something solo cannot. The item resolves publicly, with the component breakdown as the largest block on the reveal and one confusable beside it — 入口 beside 出口, 荤 beside 素, 期 (⿰其月, real 月) beside 肝 (⿰⺼干, the flesh radical ⺼ U+2EBC). A wrong guess followed by corrective feedback is *productive*, and a first encounter has to happen somewhere. Ruling: an item dealt from someone else's queue that is NEW for player p **enters p's schedule as a completed first review**, graded Hard on a correct and Again on a miss, with initial stability from the pretrain-4 fit.

That is the honest answer, and it is a design claim, not a finding: **the group session is a review session for the priority player and an introduction engine for everyone else.** Its job is to seed items and to pay the social cost of first encounters in the one format that stages them well. The solo session's job is to space them.

Two guardrails. Never show what other players picked — seeing another player's wrong answer implants it, which is a correctness argument for hiding per-player errors, not a comfort argument. Only an anonymous filled-dot count showing *that* each player committed, which is the effort cue, never the magnitude, which is the ability cue.

The claim is falsifiable from the log from the first cohort: do group-seeded items reach a ≥ 7-day delayed correct at the same rate as items first met solo? If they trail, the introduction-engine claim is wrong and the weights collapse to `w_π` only.

### Reconciling solo and group

**There is one schedule. There is no such thing as multiplayer progress.** The group session writes into the same local per-player memory store as the solo session, through the same grade mapping and the same four constraints. This falls out of the store boundary that already exists: the shared signed log is the *game*; the private memory store is the *product*. Three things make it work.

**Identity is the device.** With no accounts, the phone that joins a table binds its local `player_id` to that seat. A guest playing on someone else's phone in pass-and-play gets an ephemeral seat writing to a scratch store, offered as a JSON export at the end and otherwise discarded. A guest's schedule is never silently merged into the host's.

**The constraints are mode-blind.** Same-session and same-day rules apply across modes: a restaurant round and the solo review on the ride home fall inside one day boundary (`day_start = 4`) and count as one session for the LEARNING-graduation rule. This is what stops a group evening from inflating intervals on an item a player has just met four times under social pressure.

**The morning-after queue.** The group session writes a `seeded_today` set, and the solo scheduler puts those items at the *front* of the next day's queue. The second exposure of a newly introduced item should fall after a night, not later the same evening — "recognised in session" and "integrated" are demonstrably different states. This single rule is what converts a structurally massed party game into a spaced one, and it is the hinge the whole model turns on.

The two modes are not redundant, because they carry opposite scheduling constraints. Same-item repetition needs a **minimum** gap (≥ 24h). Confusion sets need a **maximum** gap — confusable items interleaved tightly, 5–15 intervening items, never split across sessions, which is the manipulation with the strongest support for exactly this material. A group session is the only place a confusion set can be walked tightly under shared attention; solo is where the ≥ 24h spacing happens. So the schema needs both `confusion_set_id` and `isomorph_group_id`, and the scheduler needs both bounds.

Finally, the falsification test that governs everything above: instrument `sessions_per_week` and `days_between_sessions` split by mode from the first cohort. **If the median multiplayer gap exceeds ~7 days while solo sits under ~3, invert the architecture** — solo daily becomes the primary path and the group session becomes purely the acquisition channel and introduction engine. That is precisely the role this section has already assigned it, which is the point of specifying it this way: the inversion costs a router change, not a rewrite.