# Adversarial review — reasoning, not evidence

Verification note: I re-derived the Unicode and makemeahanzi facts directly (downloaded `dictionary.txt`, 9,574 entries — the count in P22 checks out). Findings below marked **[verified]** are backed by that data, not by memory.

---

## A. Structural defects that void other rulings

**A1. The document's single most important scope caveat points at the wrong principles.**

> "the interface-social evidence (**P24–P34**) comes from a cluster in which exactly one paper was read in full text (Parhi, Karlson & Bederson 2006); the rest is search-abstract or recalled… **magnitudes are provisional**, and the top ~10 sources must be re-read before any number from that block enters a build spec."

P24–P34 are the Chinese content layer and the spacing/scheduler block (phonetic reliability, heteronyms, HSK coverage, Kim & Webb, Cepeda, FSRS). The interface-social cluster is **P39–P55** — Parhi appears at §1.7 #49, inside "From the interface-social digest." So the caveat quarantines in-house computed corpus statistics that were verified this session, and leaves _unquarantined_ exactly the block that carries §2.4's full rebuild (P39, P40, P41) and nine of §2.7's eleven v1 acceptance criteria (P42–P50). The document then does the thing it forbade: §2.7 mitigation 2 declares private input "a v1 requirement" on the strength of Bond & Titus, Uziel and a recalled 2025 CSCW n=85 — all inside the provisional block, all entering a build spec.
**Fix:** change the range to P39–P55, and re-run §2.4 and §2.7 under it, or mark both rulings provisional on their face.

**A2. The P-numbering collides with the §1.7 numbering, and the document mis-resolves it.**

> "(P45 in §1.7 #45; ui-cluster P)" — §2.7
> "evaluation apprehension (P45 in §1.7 / P44)" — §2.6

P45 is Karau & Williams (social loafing). §1.7 #45 is the Bond & Titus audience correction. These are different literatures making different claims, and §2.6 cites the loafing principle for an audience-effects argument. "ui-cluster P" is an unfinished edit that survived to a shipping document. In a text whose stated thesis is _"the single most damaging failure in the source sweeps was an invented number wearing a citation,"_ a live citation collision in the rulings section is disqualifying.
**Fix:** renumber §1.7 as M1–M68 (myths), never reuse "P" and "#" ambiguously, and resolve `ui-cluster P`.

**A3. Wrong internal cross-reference on the colour ban.**

> P20: "This does **not** disturb the absolute ban on colour touching the glyph on a timed card **(P22)**."

The colour ban is **P26**. P22 is the meat radical. Same defect class as A2.

**A4. Dangling reference in a shipping spec.**

> §2.3: "**Family (c), the same-object-class signs that mean something dangerously different, is the highest-value set and should be at least ~40% of distractors.**"

There is no family (a), (b) or (c) anywhere in the document. §2.3 defines "Priority 1" and "Priority 2." A distractor generator cannot be built from this bullet, and the "~40%" is an invented constant of the exact species §1.7 #39 strikes.

---

## B. Motivated reasoning — the same inference, two standards

**B1. The document kills a between-study moderator inference when it favours MC and performs it when it disfavours MC.**

> §1.7 #37: "_Dead twice over. That contrast is a **BETWEEN-STUDY moderator confounded with final-test format**_ — MC-practice studies disproportionately used MC final tests…"
> P5: "Rowland's **final-test-format** moderator: free recall g ≈ 0.79–0.82, cued recall g ≈ 0.70–0.72, **recognition/MC g ≈ 0.36**"
> §2.3: "it is a pace-and-sociability decision that costs **roughly half the retention benefit**"

Identical structure, opposite conclusion, opposite standard. Worse, the arithmetic is a category error. Rowland's _final-test-format_ moderator describes how large the testing effect looks **when your criterion test is that format**. P1 declares the criterion task to be _"meaning-recall from a rendered form, not four-option discrimination."_ Under the document's own criterion, the applicable cell is **cued recall, g ≈ 0.70–0.72** — not 0.36. The MC choice is a _practice_ format, governed by the separate initial-test moderator only. "Weakest cell on both axes" charges the product once for a final-test format it has explicitly disclaimed and once for the practice format it actually chose, then divides 0.36 by 0.72 to manufacture "roughly half."
**It should say:** "Recognition _practice_ produces smaller testing effects than recall practice (Rowland, initial-test moderator). The magnitude of that penalty for a cued-recall criterion is not estimable from the final-test-format moderator and we are not going to invent it. We are buying pace with an unquantified retention cost." The honest version is weaker and less quotable, which is why the false one is there.

**B2. "Best-supported decision in the product" is flatly contradicted by its own grade line.**

> P21: _Strength:_ **moderate**… "Nguyen et al. N=54 Vietnamese learners… no long-delay posttest. Small N."
> P21 _Consequence:_ "**Decision 3 is the best-supported decision in the product.**"

A moderate, N=54, no-delayed-posttest, single-study finding cannot be the best-supported anything in a corpus containing eight **strong** meta-analyses (P1, P3, P4, P5, P6, P16, P31, P52). The document catches this exact move one principle earlier — P17 is annotated "_thinner than 'best-evidenced element in the design' implies_" — and then commits it. Decision 3 is one of the author's own.
**It should say:** "Decomposition is the best-supported _transfer_ mechanism we have for Chinese specifically, on one small study; it is not the best-supported decision in the document."

**B3. Abstract-only gets downgraded; recalled-from-memory stays strong.**

> P30: "_Strength:_ moderate (**downgraded** from the sweep's 'strong': abstract-only, no bias diagnostic)."
> P39: "_Strength:_ **strong**, but **cited from knowledge**: every scholarly host was blocked and the classic sources could not be re-verified this session."

The document's preamble says "Grades are carried over from the digests unchanged. Nothing here is upgraded." Retaining **strong** for a claim that could not be verified _is_ an upgrade relative to its evidential state, and P39 is the sole load-bearing support for §2.4 — the largest engineering change in the document.
**Fix:** P39 → **moderate, unverified this session**, and mark §2.4's verdict provisional on it.

**B4. Booking an effect size for a manipulation you have declined to implement.**

> §1.7 #42 kills reason chips: "_That mechanic is not self-explanation. Every study in the pool prompts learners to **GENERATE** an explanation…_"
> P51/§2.5 keeps: "one spoken prompt at the reveal… ~5 seconds, spoken to the table, never typed, never scored" — and calls it "the cheapest **well-evidenced** thing in the whole corpus" at g = 0.55.

Bisra et al. pools written, individual, prompted, often trained self-explanation on expository text and worked examples. Five unscored seconds of table talk addressed to one player drops every moderator in the pool. If #42's test is correct, it disqualifies this too. Keep the beat — it is cheap and plausible — but grade it **weak, analogy**, and stop printing 0.55 next to it.

**B5. The scheduler-selection-bias objection, made against someone else's benchmark and then built into the product's own primary metric.**

> P35 scope: "recall-_prediction_ calibration on Anki logs that were themselves generated under SM-2-derived scheduling (**selection bias; intervals not randomised**)."
> P38 consequence: "Outcome signal = **accuracy on items whose interval has crossed a ≥7-day threshold**, aggregated over hundreds of items."

Which items reach a ≥7-day interval is decided by the scheduler, and the scheduler sends _easy_ items there. The composition of that sample shifts as the learner improves, so the metric moves for reasons unrelated to learning — the identical confound, unflagged, in the document's own outcome definition. It also contradicts P52, which admits only "**delayed accuracy at ≥1 week, ideally on transfer items** — real signage the player has never seen."
**Fix:** define the outcome as a fixed, scheduler-independent probe set at a fixed interval, or state plainly that the attempt log gives a _trend under selection_ and cannot answer "are they learning."

---

## C. Non-sequiturs

**C1. A wager is not a prequestion. This is the document's own "explicit binding" error.**

> §2.2 Verdict: "**As a PRETEST it HELPS.**" … "committing before the reveal is a pretest with real support (P9)"
> P9: "the prequestion effect is large but **strictly item-specific**. g = 0.66 **for the information the question targeted**, with no evidence of benefit for other material."

The bet commits a _stake_, before the item is seen, with no answer attempted. The prequestion literature measures the benefit of attempting an **answer** to a question naming specific information. There is no question, no attempted answer, and nothing item-specific in a wager. §1.7 #6 kills the "explicit binding" rationale because it "shares only the English word 'explicit'" — here "commit" is doing exactly the same equivocation between _committing to a bet_ and _committing to an answer_, one section later.
**It should say:** the bet is a confidence signal for feedback routing (P10) and a handicapping device; the _pretest_ is the separate meaning-recall beat §2.3 introduces before options render — and that beat is currently unscored and analysis-only. **The one mechanic that implements the mechanism the verdict rests on is the one the design refuses to score.**

**C2. Narrowing the category does not create prequestion granularity.**

> P9: "narrow the dealt category to **prequestion granularity** ('signs on a subway platform'… never 'Transport')."

"Signs on a subway platform" is a set of dozens of items. Item-specificity means the benefit accrues _only_ to the targeted information. Going from 200 candidate items to 40 does not convert a category label into a question. The recommendation restates the design and borrows g = 0.66 for it.

**C3. §2.1's HELPS verdict has no evidence about the mechanic under review.**

> "**Verdict: HELPS — conditionally**… Two independent mechanisms make an opponent-chosen item a good idea."

Neither mechanism (P9, P10) has anything to do with _who chose the item_. After the document's own fix — "Opponents choose the CATEGORY; the engine chooses the ITEM" within an Elo band — the opponent's residual contribution is picking a label off a menu, for which zero evidence is offered. Compare the discipline §2.6 applies to a mechanic the author wants to kill: "_This ruling is an inference from adjacent findings, not a finding about score races; label it as a decision, not a finding._" That sentence belongs verbatim at the top of §2.1 and is absent.
**Verdict should be:** NEUTRAL for learning; a social/engagement decision, bounded by competence.

**C4. Deleting an invented constant is not the same as deleting the constraint it encoded.**

> §2.1: "**Delete the '≥5 prior exposures' gate.** It is folklore (§1.7 #39) and it is also **worse than the thing that replaces it**."

Elo targets _difficulty_; an exposure floor targets _familiarity with this specific item_. They are not substitutes — an item can be perfectly Elo-calibrated and never have been seen by this player, which is precisely the "coin flip" P54 forbids and precisely what P13's consolidation gate exists to prevent. The correct move is the one P30 already states: "**Measure retrievals-to-stable-recall from the log; do not assume 6–10.**" Keep the gate, replace the invented integer with a measured one. As written, the document throws out a constraint because a number attached to it was fabricated.

**C5. "Safe by construction" is not licensed by a moderate grade in a different domain.**

> P49 _Scope:_ "Math Garden — arithmetic, Dutch schoolchildren, national scale. **Not L2, not co-located.**"
> §2.1: "this makes the opponent-dealing mechanic **safe by construction**"

Should be "**bounded**, on an inference from one production system in another domain."

**C6. Tulving & Thomson does not license excluding the scene.**

> P2: "Encoding specificity licenses the character form as it will be met — **and nothing about the surrounding scene.**"

Encoding specificity is the principle that cues present at encoding aid retrieval; applied naively it argues _for_ scene fidelity. The stimulus/context split that actually kills the scene comes from §1.7 #10 (environmental context d ≈ 0.28, eliminated for recognition, divers replication failed) plus P3. As written, P2 is a restatement of Decision 2 wearing Tulving & Thomson's citation, and the tie-breaking evidence is never named.
**Fix:** ground the sign/scene asymmetry in #10 + P3 and demote P2 to the weaker claim it supports (render the form as it will be met).

**C7. Rodriguez is a psychometrics result being spent as a learning result.**

> P6 _Scope:_ "random-effects meta-analysis over 80 years of **general educational measurement** — not L2, not hanzi."
> P6 _Consequence:_ "**drop to three.** It buys more items per round, frees the width for 60–64 CSS px full-bleed answer rows in the thumb zone, and cuts lure exposure — **three benefits from one change.**"

Rodriguez says three options are as good _as measurement_. Nothing in it addresses which format produces more learning from retrieval practice. Two of the three "benefits" are also unearned: dropping an option frees vertical **height**, not width (width is only freed if you were in a 2×2 grid — never stated); and "60–64 CSS px" is an invented spec number in the document that bans invented spec numbers (§1.7 #39, #49). Finally, k=3 increases guessing relative to k=4 — which P8 treats as serious enough to exclude 2AFC from stability updates entirely — and the document never asks where the line is.

---

## D. Internal contradictions

**D1. P8 bans observed-accuracy targets; §2.1 and §2.7 then set one.**

> P8: "**specify every pacing target in retrievability, never in observed accuracy**"
> §2.1 / §2.7 mit. 1: "drawn within an Elo band of the target player, **targeting ~75% success** (P49)"

Math Garden's Elo is fit on observed correctness; ~75% success _is_ an observed-accuracy target. On three options that is R = (0.75 − ⅓)/(1 − ⅓) = **0.625** — a retrievability target the document never chose and would probably reject. Two of seven rulings violate P8 in their headline condition.

**D2. P31 mandates persisting a due date; P35 forbids it.**

> P31: "`nextDueAt` **persists per item across matches and devices**"
> P35: "compute R inline at selection and **never persist a due date**"

**D3. P28 and P36 specify opposite hero metrics.**

> P36: "**never show a player a numeric strength or mastery percentage for an item**… Aggregate only at deck level."
> P28: "Report what the user can verify: '**you can read 47 of the 120 signs in the metro set.**'"
> §2.6: "**The hero number** is a table target in the product's own currency"

47/120 is a mastery percentage with a false-precision integer on the front. If it is the _predicted_ readable set it is banned by P36; if it is the _historically correct_ set it ignores forgetting and is a lie by a different route. The document never says which, and it is the number the whole product is built around. Also note P28 opens with "**Never print a coverage percentage in product copy**" and closes by printing one.

**D4. Observer exposures: P40 advances scheduling state on events P8 and P37 say must not.**

> P8: "Do not feed fully-scaffolded or 2-alternative outcomes into stability updates at all — log them `role: exposure`."
> P37(1): "recurrences log `role: exposure` **with no stability update**"
> P40 / §2.4: "let observer exposures **advance scheduling state at a discounted weight**"

An observed item is not a retrieval _by that player_ — it is a weaker event than a 2AFC guess, which is already excluded. Worse, P39 says observation during another player's retrieval is where _inhibition_ lives, so §2.4 is inflating stability on the events its own central finding says suppress memory. And "discounted weight" is a knob with no value, no derivation and no test, in a document that demands "owner + rationale + planned test."
**Fix:** observer records are `role: exposure`, weight zero, logged for analysis only. P40's stated worry — "a player who watched thirty items and answered six is modelled as having seen six" — is not a bug. They _retrieved_ six.

**D5. §2.2 decouples the stake from the scaffolding and then re-couples it two bullets later.**

> "**Decouple the stake from the scaffolding.** The bet stakes points only."
> …"A low rung might **buy a semantic-component hint**"; "**gate the top rung by competence**… with unearned tiers greyed"

If a rung buys a hint, the stake controls the format again. And greyed tiers publish per-player competence to the table, which §2.7 mit. 5 bans — unless bids are private, in which case the document's other claim collapses:

**D6. The bid must be visible to work as a handicap and invisible to be safe.**

> §2.2: "the best available handicapping device for mixed ability at one table — **a bid invisible to the table** is what makes a handicap socially acceptable."

A handicap nobody can see is not a social handicap; it is a private scoring multiplier. Pick one and say which.

**D7. The self-explanation prompt destroys bid privacy and stages a public failure.**

> P51 / §2.5: "one spoken prompt at the reveal on the confusable pair, **addressed to the highest bettor**"

This publicly identifies who bet highest, and on a wrong answer publicly identifies the player who bet high and lost — the exact configuration §2.7 exists to suppress, delivered by §2.5.

**D8. §2.5's element budget is violated by the bullet two lines above it.**

> "**Every option glossed** — hanzi at ≥32 px, pinyin, English _and_ Dutch, and a one-clause note on where you would actually meet it."
> "**Element budget by integration load**… **one target, one decomposition, one contrast.** Everything else behind an explicit tap."

Three fully glossed rows is 15+ elements. And P12 has just ruled that "a universal fixed-length explanation on every item is an **unvalidated product bet, not an evidence mandate**" — §2.5 then mandates something far heavier than a fixed-length explanation, as an acceptance criterion, while its verdict paragraph still calls elaboration "a bet." Also: P4 forbids any "'browse the character' or 'study the list' screen in the main loop," and §2.5 mandates a fully glossed study table with a **2,000 ms minimum dwell** on every item.

**D9. P19 says instrument it; §2.3 decides it on argument.**

> P19: "**Instrument this rather than deciding it on argument.**"
> §2.3: "unrelated-but-domain-plausible on first appearances; component-sharing and confusable-family **only after the item is consolidated across a night**"; "**Never** introduce both members of a form-confusable pair as new items in the same session."

Shipped as hard rules with no flag and no A/B. P20 (the other CONTESTED item) _was_ honoured as an A/B. The inconsistency runs in the direction of the author's preferred architecture. Worse: the consolidation gate overrides the one Chinese-specific, beginner-specific study in the corpus — P17 tested "N=183 non-tonal-L1 learners **with no prior Chinese**" and found simultaneous pairing _helps_ — using two extrapolations (P13 lab-prose, never run on Chinese; P32 lab-wordlist, spoken L1, "never tested on a logographic L2") as the override. P13's consequence nonetheless asserts it in bold as "**a pure function of the item's exposure state**." Maximum confidence sits on the weakest chain in the document.

**D10. Enjoyment is inadmissible as safety evidence and admissible as a shipping justification.**

> P46: "'**Players report they had fun' is not evidence the mechanic is safe**"
> P52: "no learning-relevant feature may be killed or shipped on… **session satisfaction**"
> P53: "**this is also why the co-located format earns its place**: co-located play produces the highest enjoyment and perceived social presence of any configuration"

"Earns its place" is a shipping justification resting on satisfaction. P53's own fence — "Claim engagement, never learning" — does not save it, because P52's rule is about _shipping decisions_, not about claims.

**D11. Raising the recall threshold IS shortening the gap.**

> P33: "use the trip date to raise the **recall threshold** as it approaches, **never to shorten the gap directly**."

With R(t,S) = (1 + 0.980346·t/S)^(−0.1542), raising target R shortens t monotonically. This is the same operation computed differently, presented as an alternative to itself. Anyone implementing `ts-fsrs` finds this in ten minutes.
**It should say:** "express trip-proximity as a rise in target retention, so the shortening is bounded by the model rather than by a hand-written multiplier" — which is a real and defensible reason, and is not what the sentence claims.

**D12. Fixed round count + due-queue-only + no-repeats-in-session are jointly unsatisfiable.**

> §2.6: "**Replace 'first to N points' with a fixed round count drawn from the due queue.**"
> P31: "the match engine draws from a **due queue, never a per-match item list**"
> P37(1): "**no item scored twice in one session**"

A player with five due items in a twenty-round match needs fifteen non-due items, which cannot be repeats. The only remaining source is new introductions — colliding with P32's overnight gate, P13's exposure-state distractor policy and P31's own "never a per-match item list." No fallback is specified. This is the first thing that will break in implementation.

---

## E. False precision

**E1. The 2AFC guessing figure is wrong by a factor of three, inside a passage graded "arithmetic identity, solved numerically."**

> P8: "At that operating point roughly **half** of all 2AFC 'correct' responses are guesses."

At observed 0.85 with k=2, R = 0.700 (the document's own number), so guessed-correct = (1 − 0.70)/2 = 0.15, out of 0.85 correct = **17.6%**. "Roughly half" is true at observed accuracy ≈ 0.67, not 0.85.

**E2. P8 is not an identity, and its assumption is one the design deliberately violates.**

P(correct) = R + (1−R)/k is a _high-threshold model_ assuming uniform random guessing among k options. §2.3 mandates maximally competitive distractors and P6 invokes "the negative suggestion effect scales with the number of plausible lures" — i.e. guessing is _worse_ than 1/k by design. Grading this **strong / arithmetic identity** is the exact move the document polices everywhere else.
**Fix:** grade it **moderate, model-dependent**, state the assumption, and note that competitive lures bias recovered R downward.

**E3. Two four-significant-figure integers with no derivation, carrying a design ruling twice.**

> P49 / §2.1: "**1,451 eligible words rather than 7,330** under a group-wide constraint — **80%** of the strong player's readable vocabulary excluded"

No corpus, no word list, no coverage rule, no formula. The 80% is derived from two unsourced integers (1 − 1451/7330 = 80.2%). 1,451 words from a 300-character head implies ~4.8 fully-covered multi-character words per character, which is not plausible for any standard list. The scenario (300 vs 1,200 in a 1,500-character bank) is also chosen to maximise the gap. This is the preamble's own failure mode — "an invented number wearing a citation" — in the principle that replaces the invented "≥5 exposures" gate.

**E4. A manufactured constant presented as a budget.**

> P7: "budget **~7 percentage points** of lure intrusion as the price of MC; **the net is still positive**."

12% − 5% is the difference between _previously-tested_ and _untested_ items in Roediger & Marsh — not a net cost of adopting MC, which would require the counterfactual intrusion rate under the alternative format. And "the net is still positive" is asserted with no arithmetic anywhere in the document.

**E5. "Roughly two-thirds survives" (§2.7).** Three components are not commensurable units. This is arithmetic theatre over a list of length three, in the ruling the document calls the hardest.

**E6. "~426 items" (P38)** carries three significant figures on a calculation whose p, α, power and hit/false-alarm correction are never stated; at p = 0.5, α = .05, power = .80 the figure is 392. The document knows how to show this work and doesn't.

**E7. The invented-constant register does not cover the document's own constants.** §1.7 #19 and #39 strike a list of fabricated numbers. The rulings then introduce: "60–64 CSS px", "hanzi at ≥32 px", "~40% of distractors", "~3 s" recall beat, "~800 ms" hanzi-alone, "~2,000 ms" reveal dwell, "full ruby for ~3 exposures", "R > 0.95" force-inject, "cap consecutive incorrect at 2", "n≈200 players". Two are direct re-entries of struck items: **"~5 seconds" for the spoken prompt** (#44 strikes "the 5 s and 10 s numbers have no source at all") and **"~3 exposures"** (#19 strikes "suppress the mnemonic from exposure 3" and "≥3 renderings before consolidated" as invented). The banned-rationales register will not survive contact with a document that reoffends in its own rulings section.

**E8. Cross-meta-analysis effect sizes lined up with ">" signs — the document's own #17 error, in its flagship decision rule.**

> P4: "retrieval-with-feedback (**≈0.5**, strong) **>** self-explanation with domain prompts (**≈0.55**, strong) **>** gamification wrapper (≈0.5, contested) **>** game-vs-non-game (≈0.33) **>** competition (≈0, null)"

The ordering contradicts the numbers it prints — 0.5 is placed above 0.55 — and the axis is never named. Five g's from five meta-analyses with different comparison conditions, outcomes and controls are not commensurable; §1.7 #17 strikes a multiplier for exactly this ("a ratio of two unrelated denominators") and #18 strikes a threshold rule for treating effect sizes as interchangeable. P4 also claims retrieval "**dwarfs** every social and game-shell effect examined" while its own list puts gamification at ≈0.5, i.e. equal.

---

## F. Evasion and silent omission

**F1. §2.7 does not return the verdict the section promised.**

> Section 2 header: "Each gets a verdict — **helps learning / hurts learning / neutral**."
> §2.7: "**Verdict: DEFENSIBLE IN TWO OF ITS THREE COMPONENTS**"

"Defensible" is a different axis. Given P50 — "there is **NO** controlled study… Any claim that it does — or that it doesn't — is currently an inference" — the honest verdict is **UNKNOWN, not assessable on available evidence, shipped as a monitored bet**. Converting an evidential void into "roughly two-thirds survives" is the precise move the document was written to stop. §2.2 also fails to return one of the three.

**F2. FSRS: the headline is falsified by the numbers three sentences later, and the recommendation is the third-best of four.**

> P35: "**FSRS massively outperforms anything a team would hand-roll**… FSRS-6 full **0.3456**. But default-parameter FSRS-6 is **0.3661**, benchmarked _below_ a **zero-parameter moving average (0.3369)**… the four-parameter middle path… scores **0.3548**."
> Consequence: "**ship pretrain-4**"

Lower log loss is better. The document's own ordering is: moving average **0.3369** < FSRS-6 full 0.3456 < pretrain-4 0.3548 < default 0.3661. The zero-parameter baseline — the definition of something a team hand-rolls in an afternoon — **beats every FSRS configuration listed, including the one recommended**. The text presents this as if only the _default_ were so beaten. Either the headline is wrong or the recommendation is; the document never notices.
**Also omitted:** FSRS pretrain requires the user's own review history. At launch every user is on defaults — the configuration the document says must never ship. There is no stated cold-start policy, no threshold at which pretrain engages, and no story for the first N reviews.

**F3. The conclusion that most threatens the design is never considered.**

> P31: "**the scheduling layer, not the match engine, is the product**… the solo daily surface is load-bearing, not a degenerate case of multiplayer."

An equally licensed reading of the same finding is: _this product cannot be the primary learning vehicle and should be positioned as a supplement to a spaced solo tool._ The document rules that out by asserting the opposite and never names it. A section that opens by promising "several things are deliberately uncomfortable" owes this one a paragraph.

**F4. The criterion task has no corresponding build requirement.**

P1 fixes the criterion as _"in an unfamiliar display typeface."_ §1.7 #19 strikes "at least THREE typefaces per word" as invented — and puts **nothing** in its place. §1.7 #1 notes in passing that "Varying realistic typefaces is variability, not degradation — a different manipulation," ungraded and uncited. So the product's single defining task property has no policy: how many faces, which, how selected, when introduced. This is the largest silent omission in the document.

**F5. WCAG absolutism is applied everywhere except where it bites.**

> P26: "**no tint, highlight, outline or coloured sub-glyph region on any hanzi on a timed card, ever**… **The EAA settles it regardless of how the pedagogy reads.**"
> P2: "Fidelity of the **sign** — typeface, stroke weight, spacing, contrast, substrate, **the real colour inversions** — earns its budget."

Two problems. (a) **The legal claim is wrong.** SC 1.4.1 forbids colour as the **sole** carrier of information. A discriminating component marked by colour _and_ position/label/outline satisfies 1.4.1. The EAA therefore does not settle it — which the document tacitly concedes at P20, where colour-marking on the resolution panel is left open as an A/B. If 1.4.1 really settled it, P20 would be closed. (b) The one place the constraint genuinely bites — realistic renderings of real Chinese signage, much of which fails AA contrast — is never addressed. Whether rendered signs are "essential images of text" under 1.4.5 is the actual question and it is not asked.

**F6. The experimentation programme is oversubscribed by an order of magnitude and this is never said.**

"The product's first A/B" is named twice for different things (P42's framing copy; §2.7 mit. 11's public-gloss variant). Add P20's colour marking, §2.5's image-on-reveal, §2.3's shared-morpheme instrumentation, P19's scheduling gap, §2.1's dealing-rule flag, P17's "hypothesis to instrument", and the confusion-type split. Against this, P50 offers "a within-player pre/post comparison is **a real experiment at n≈200 players**" — for _one_ question, with no power calculation, in a document that performs a power calculation for the yes/no instrument. Nothing marked "instrument it" will be resolved, and the document should say which three questions get the budget.

**F7. Immediate feedback is bought without the honesty applied to MC.**

> §2.5: "the spacing benefit is recoverable through the lapse queue while the **pretesting and hypercorrection benefits are not recoverable any other way**."

Neither P9 nor P10 requires _immediate_ feedback — both require _corrective_ feedback. P10's own scope runs to "about a week." The document has just conceded delayed feedback is better for retention of correct answers, then invents a necessity to avoid saying "we chose immediate feedback for party-game pacing, at a cost." That is the §2.3 sentence the document is proud of, withheld where it is equally true.

**F8. §2.4 misapplies the collaborative-inhibition paradigm.**

> "**It is the collaborative-inhibition configuration by construction** (P39). Three players watching one player retrieve suppresses retrieval for all three."

Collaborative inhibition compares a **collaborating group producing one recall output** against a nominal group of pooled individuals; the mechanism is retrieval-strategy disruption during _shared_ recall of a _shared_ list. Three people silently watching one person answer a single multiple-choice item is not that paradigm — it is an audience/observer condition, which is P40's literature and which finds _benefits_ under some configurations. The document has the right conclusion (blind simultaneous commit) and cites the wrong mechanism for it, on a principle it also could not verify (B3). The correct support is P44 + P11 + P40's contagion result, all of which it already has.

---

## G. Chinese-language content — verified against the cited data

**G1. P22's core codepoint claim is CORRECT. [verified]** All eight organ characters carry ⺼ U+2EBC in makemeahanzi (`肝 ⿰⺼干`, `肠 ⿰⺼昜`, `肚 ⿰⺼土`, `腰 ⿰⺼要`, `脑 ⿰⺼⿱亠凶`, `肺 ⿰⺼巿`, `肾 ⿱⿰？又⺼`, `胗 ⿰⺼㐱`); 期朋朗服有望 carry 月 U+6708. Entry count is 9,574 as stated. U+2EBC is CJK RADICAL MEAT, Kangxi 130; U+6708 is the moon ideograph, Kangxi 74. **Do not weaken this paragraph.** Everything below is what surrounds it.

**G2. "期 朋 朗 服 有 望 carry the real 月" is false for three of six, and the document is teaching false etymology.**

- **有** — historically 又 (hand) + **肉** (meat): a hand holding meat. It is filed under radical 74 by Kangxi _convention_; the component is the meat one.
- **服** — the left element is historically **舟** (boat), not moon and not meat.
- **朋** — strings of cowrie shells; neither moon nor meat.

Only 期, 朗, 望 are genuine moon. The document frames the contrast semantically ("**月 U+6708 (moon…)**") and its consequence is about _teaching_ ("teaching that a shelf-life label contains a body part") — so under its own framing three of its six positive examples are wrong. This is the Chineasy-style false etymology §1.7 #31 bans, committed in the principle titled "**The verified component fact this app must not get wrong.**"
**It should say:** "期 朗 望 carry the moon. 有, 服 and 朋 carry U+6708 as a _radical-index artefact_ — historically 肉, 舟 and a shell-string respectively — and must be marked `etymological: false` so no gloss is ever generated for them."

**G3. The far more dangerous direction — false positives on ⺼ — is never checked. [verified]** 182 characters in the cited dataset carry ⺼. §2.2's proposed UI string is _"⺼ = body part, so this is something off an animal."_ That gloss is **false** for, among others:

- **能** (néng, "can/able") — `⿰⿱厶⺼⿱匕匕`, a bear pictograph. HSK 1. The single highest-frequency ⺼-bearing character in the language.
- **肯** (kěn, "willing") — `⿱止⺼`
- **胡** — `⿰古⺼`, purely phonetic in **胡萝卜** (carrot) and **胡椒** (pepper): both market/menu items, both Tier-1
- **育** (yù) — `⿱⿱亠厶⺼`
- **祭** (jì) — `⿱⿰⺼寸示`

The document checked the false-negative direction (organ characters missed) and the false-positive-on-月 direction (期 inside 保质期). It never checked false-positive-on-⺼, which is the one that fires on HSK-1 vocabulary and on two produce items. The symmetry was demanded by its own argument.

**G4. The "verified" dataset is internally inconsistent, and P22's verification therefore does not transfer. [verified]**

- **朐** (dried meat) — `radical=月`, `semantic=月`, `hint='moon'`. A meat character labelled moon.
- **炙** (zhì, broil — literally meat over fire; **炙烤** is menu vocabulary) — `⿱月火`, `phonetic=月`. The top is 肉, and it is semantic, not phonetic. Wrong twice.
- **臍** — `⿰月齊`, `semantic=月`, `hint='flesh'`: the record contradicts itself, and its simplified twin **脐** uses `⿰⺼齐`. The same morpheme encoded two ways in one file.
- **肴** — `radical=⺼` but `decomposition=⿱乂有` contains no ⺼ at all. The two fields the design proposes to key off disagree.

**G5. And the dataset that was verified is the one §9–12 excludes from the build.**

> P22: "verified independently this session against Make Me a Hanzi (9,574 entries)"
> P22, same paragraph: "**decompositions are authored in-house**… makemeahanzi — LGPL on `dictionary.txt`, Arphic on the graphics — **stays out of the build entirely**."

So the shipping component field is a hand-authored artefact that has been verified against **nothing**. P22 licenses confidence in a file that will not exist in the product.
**It should say:** "makemeahanzi is the _reference_ for a one-time audit; the shipping field is hand-authored and requires its own CI assertion — every character whose stored component is ⺼ must carry an explicit `gloss_applies: true|false` flag, defaulting false."

**G6. The "naive regex" failure mode is true only under an unstated premise, and false under the obvious reading.**

> "A naive regex highlights zero of the eight organ characters and **fires instead on 期**"

Over _rendered text_, `/月/` matches neither — 肝 is U+809D and 期 is U+671F, single codepoints with no substrings. The claim is true only over **decomposition strings from a source that distinguishes the two**, which is a data-provenance assumption, not a Unicode fact. **[verified]**: over makemeahanzi decompositions, `/月/` matches 33 characters including 期 and 0 of the 182 ⺼ characters — so the claim holds _for that file_. Against a source that unifies on 月 (many IDS datasets do), the failure inverts: it would fire on all eight organ characters _and_ on 期. Say which.

**G7. 肾 breaks the highlight template, and carries an unencodable placeholder. [verified]** `肾 = ⿱⿰？又⺼` — the meat component is at the **bottom**, not the left, and the record contains a literal `？` (U+FF1F) for an unencodable component. Same for 有 (`⿸？月`) and 皮 (`⿸？攴`). Any pipeline seeded from this file inherits a `？` component on one of the eight flagship characters.

**G8. ⺮ is not a Kangxi radical, and the sentence mixes two incompatible sources. [verified]**

> "筋 carries it inside 肋 but **takes ⺮ as its Kangxi radical**."

⺮ is U+2EAE, **CJK RADICAL BAMBOO**, in the CJK Radicals **Supplement** block. Kangxi radical 118 is 竹 U+7AF9, or ⽵ U+2F75 in the Kangxi Radicals block. Unihan `kRSUnicode` for 筋 is `118.6`. The sentence quotes makemeahanzi's `radical` field and calls it "Kangxi radical" — in the same paragraph that says "Unihan `kRSUnicode` seeds the semantic radical only." Two conventions, silently merged, in the paragraph about not merging conventions.
**Fix:** "筋 contains ⺼ inside 肋 but is filed under 竹 (Kangxi 118, `kRSUnicode` 118.6); makemeahanzi's `radical` field renders that as ⺮ U+2EAE."

**G9. The encoding is asymmetric, which is _how_ the drift in G4 happens. [verified]** If the design wants an explicit moon/meat component field, the symmetric pair is **⺝ U+2E9D (CJK RADICAL MOON)** vs **⺼ U+2EBC (CJK RADICAL MEAT)**. Using the radical-supplement form on the meat side and the bare ideograph 月 U+6708 on the moon side is precisely the asymmetry that produced `臍 semantic=月 hint='flesh'`. The document does not mention U+2E9D exists.

**G10. 药店 and 酒店 obviously share a component — the whole second character.**

> §1.7 #48: "**药店 and 酒店 share NO component** (艹+约 vs 氵+酉)"
> §2.3: "药店/酒店 — which share **no** component and are priority 2, not 1"

They share **店**. The parenthesis decomposes only the first characters. This is the document's single worked example for its top-priority distractor rule, and it is wrong in the same sentence that corrects someone else's worked example. (Separately: 酒店 in the mainland is _hotel_, not liquor shop, so the situational pairing with 药店 needs a stated gloss or it teaches the wrong contrast.)
**It should say:** "药 and 酒 share no component; 药店 and 酒店 share 店 — which is exactly why they are situational, not visual, neighbours, and why compound-level and character-level confusability need separate fields."

**G11. Four of six "does not decompose" examples decompose transparently — and it is a unit-of-analysis slide.**

> P23: "**东西, 麻烦, 保质期, 时价, 招牌, 方便面** get an explicit '**this one does not decompose — learn it whole.**'"
> P29: "换乘, 末班, 净含量, **保质期** are built from high-frequency characters whose **combined meaning is opaque**"

**保质期** = 保 (preserve) + 质 (quality) + 期 (period) — one of the most transparent three-character compounds in the register. **时价** = 时 (current) + 价 (price). **方便面** = 方便 (convenient) + 面 (noodle). **招牌** = 招 + 牌 ≈ "hung sign." Only 东西 and 麻烦 are genuinely non-compositional. Routing 保质期 and 时价 to "learn it whole" denies learners the exact compositional inference P21 says is the transfer engine.

The deeper defect: P23 opens on **character-internal** decomposition ("meaning+sound decomposition," phono-semantic compounds, ~53% of the top 1,000) and closes on **word-internal** composition (出口, 牛肉, 方便面). These are different units. §1.7 #23 and #24 both diagnose exactly this as a "**unit-of-analysis error**" in someone else's claim. P23 commits it in the paragraph that cites #23.
**Fix:** two independent fields — `char_transparency` (does this _character_ decompose into meaning+sound) and `word_transparency` (is this _word_'s meaning recoverable from its characters) — and re-sort the examples: 东西 and 麻烦 are opaque _words_; 保质期 and 时价 are transparent words made of characters some of which are opaque.

**G12. The exemplar gloss is a mistranslation.**

> §2.5: "'**冷冻 = vriezer**, staat op diepvriesproducten — niet hetzelfde als 冷藏'"

**冷冻** is "frozen / to freeze" (a state or process). _Vriezer_ is the appliance — that is **冷冻室 / 冷冻柜**. The document's single worked example of a correct, disambiguating, register-aware gloss mistranslates a Tier-1 supermarket label into Dutch. Should be **"冷冻 = diepvries / ingevroren"**, with 冷藏 = _gekoeld_.

**G13. The -ün correction overcorrects and omits the fact it should supply.**

> §1.7 #36: "'-ün is an elided-vowel rime' — **-ün is not a pinyin spelling at all**; jun/qun/xun/yun is /yn/ with no elided vowel"

The substantive point is right: jun is /tɕyn/, not ⟨ju-en⟩. But **ün is a pinyin rime** — it appears as such in the 汉语拼音方案 韵母表 (ü, üe, üan, ün); what happens after j/q/x/y is that the umlaut is _dropped in spelling_, not that the rime doesn't exist. And the correction never names the actual elided-vowel rimes, which is what an authoring pipeline needs: **-iu = -iou** (六 liù), **-ui = -uei** (对 duì), **-un = -uen** (论 lùn, 春 chūn). A correction that identifies an error and withholds the replacement fact is half a correction, in a document whose thesis is that half-corrections propagate.

**G14. 无座 is under-specified to the point of being untestable.**

> "无座 is _not_ the same price as a hard seat on G/D services."

G/D services have no 硬座 class at all, so the sentence is trivially true and teaches nothing. The fact worth stating: on conventional K/T/Z services 无座 is priced as 硬座; on G/D there is no 硬座 and 无座 is priced against 二等座. Say that or drop it.

**G15. 鸡爪 contradicts P25's own storage model.**

> "凤爪 is **fèngzhǎo**, not fèngzhuǎ; **鸡爪 is jīzhǎo**"

Correct by 现代汉语词典 (爪 zhuǎ is restricted to 爪子/爪儿). But 鸡爪(子) jīzhuǎ(zi) is the dominant spoken mainland form, and P25 has just mandated storing `pinyin_citation` and `pinyin_surface` separately for exactly this class. Ruling a single "correct" reading here contradicts the model three principles earlier.

**G16. Everything else checked out.** 蔬 15 / 警 19 / 齿 8 vs 齒 15; 出 5, 入 2, 女 3, 男 7; 检 11, 续 11, 酱 13, 咸 9, 饺 9, 质 8, 药 9, 摊 13, 边 5; 请 10 = 讠(2)+青(8) vs 請 15 = 言(7)+青(8) **[verified in dataset]**; 饣 vs 食; 男 = 田+力 and not a radical; 火/灬 across 炒爆炸煮烤焖炖烧煎 (9 of 9); 行 háng/xíng, 地 dì/de, 便 biàn/pián, 菌 jūn/jùn; 水饺 shuǐjiǎo→shuíjiǎo, 不 bù→bú, 一 yī→yì/yí; 干 → 乾/幹 and 干煸; 面/麵館; GB/T 30240 as 推荐性; the subjectless-sign lint reversal (禁止吸烟, 小心地滑, 请勿触摸, 卖完了); 里脊 lǐji; the visual-neighbour sets (人/入/八, 大/太/犬/夫, 日/白/百/自, 未/末, 己/已/巳, 千/干/于, 我/找, 天/夭). Tone marks are correct throughout.

**G17. One factual overreach in P30.**

> "**Mandarin offers no cognates to Dutch or English**, so every item is a pure arbitrary paired associate — form, sound and meaning all novel."

False as stated, and false precisely in the product's domain: 咖啡 kāfēi, 巧克力 qiǎokèlì, 沙发 shāfā, 三明治 sānmíngzhì, 汉堡 hànbǎo, 可乐 kělè, 披萨 pīsà, 的士 dīshì, 卡 kǎ. These are menu and shopfront items with real sound-meaning support for a Dutch speaker (koffie, chocolade, sofa, hamburger). The true and defensible claim is "**no orthographic** transfer." The consequence — "budget far more exposures per item" — should carry an exception: flag the phonetic-loan subset as an onramp rather than budgeting it like 保质期.

---

## The three changes that would most improve this text

**1. Fix P5/§2.3 — the MC cost calculation — and apply §1.7 #37's standard symmetrically.** The "costs roughly half the retention benefit" figure is manufactured by reading a _final-test-format_ moderator as if it described the _practice_ format, then dividing 0.36 by 0.72. Under the document's own criterion task (P1: meaning-recall, not four-option discrimination) the applicable cell is cued recall, g ≈ 0.70–0.72. The document already kills this exact inference at §1.7 #37, where it favours MC. Replace the number with the honest sentence — _"recognition practice produces smaller testing effects than recall practice; the magnitude for our criterion is not estimable from this moderator, and we are not inventing it"_ — and then sweep the same asymmetry out of P21 ("best-supported decision" vs a moderate/N=54 grade), P39 (strong on a claim that could not be verified, while P30 was downgraded for being abstract-only), P51 (booking g = 0.55 for a manipulation §1.7 #42's own test disqualifies), and §2.1 (a HELPS verdict for a mechanic no cited finding examines). This is one edit repeated five times, and it is the difference between a document that grades evidence and a document that grades evidence against decisions it did not write.

**2. Make the ⺼ paragraph survive contact with the shipping artefact.** P22's codepoint claim is correct and verified — keep it. But it currently licenses confidence in a file the build excludes (LGPL/Arphic), it teaches false etymology for 有, 服 and 朋, it never checks the false-positive-on-⺼ direction where the damage actually lands (能 HSK-1, 肯, 胡萝卜, 胡椒, 育, 祭), it calls ⺮ U+2EAE a "Kangxi radical," it inherits `？` placeholders and a bottom-position ⺼ in 肾, and the source it verified against is itself inconsistent (朐 labelled moon; 炙 with 月 as _phonetic_; 臍 vs 脐 encoded two ways; 肴's `radical` and `decomposition` disagreeing). Rewrite the consequence as three build assertions: (a) the shipping component field is hand-authored and CI-asserted per item, never inherited; (b) every ⺼-bearing character carries an explicit `meat_gloss_applies: true|false`, defaulting **false**, so 能 and 胡萝卜 cannot be glossed by accident; (c) every 月-bearing character carries `moon_gloss_applies`, false for 有, 服, 朋. Then fix 药店/酒店 (they share 店), 保质期/时价/方便面/招牌 (transparent, not "learn it whole"), 冷冻 ("diepvries", not "vriezer"), and the -ün correction (name -iou/-uei/-uen).

**3. Return real verdicts, resolve the four hard contradictions, and cut the experiment list to three.** §2.7's "roughly two-thirds survives" and §2.2's four-way split are not the verdicts the section promised; given P50 the answer is **UNKNOWN, shipped as a monitored bet**, and saying so costs nothing the document has not already conceded. Then resolve, in the text: P8's retrievability rule vs the ~75%-observed Elo target used in two rulings (R = 0.625 at k=3); P31's `nextDueAt` vs P35's "never persist a due date"; P36's ban on numeric mastery vs P28's "47 of the 120 signs" hero number; and P8/P37's zero-weight exposure rule vs P40's "discounted weight" on observer records. Fix the caveat range (P24–P34 → P39–P55) so it constrains the block it was written for, note that the FSRS section's own numbers put a zero-parameter moving average ahead of every configuration it recommends, and name the **three** questions that get experimental budget at n≈200 — because the document currently names two different "first A/Bs" and eight further things to instrument, which is how a research programme becomes a backlog nobody reads.
