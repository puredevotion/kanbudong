**Scope note:** I was given the tail of §8 and §§9–12 only. Brief items 3 and 4 reference "five design decisions stated up front" and "the principles in section 1"; those sections were not in the excerpt, so I checked them only where §§9–12 restate or depend on them. Where I say a ruling is motivated, I mean it is motivated by something visible inside §§9–12. I also read the underlying sweep digests in `/tmp/claude-0/-home-user-dohhh/4806d96a-ebd4-5774-9d7d-fe7e365865df/scratchpad/` (`A_04.json`, `A_12.json`, `A_18.json`, `critiques.json`) to check claims of consensus, per brief item 6.

---

## 1. Non-sequiturs

### 1.1 The primary metric is held constant by the scheduler the document adopts. This is the single worst error in the excerpt.

> **"Accuracy on items whose inter-exposure gap crossed ≥7 days and ≥1 sleep, on a substrate/typeface the item has not previously been seen in, aggregated per player over hundreds of attempts."** … "It is free, continuous, and orders of magnitude better powered than any check-in test."

FSRS schedules to a target recall probability. §12.1 states the group objective as `U(i) = −Σ w_p (R_p − 0.85)²` — an explicit instruction to select items whose predicted recall is 0.85. A working scheduler therefore drives delayed accuracy toward 0.85 _regardless of how much the player knows_. A player with 60 durable items and a player with 600 will both score ~0.85 on this metric. The number moves when the scheduler is miscalibrated, and stops moving when it is calibrated. It is a scheduler-diagnostic wearing a learning-metric's clothes, and the document makes it the thing every A/B (§10.2), every tripwire (§10.1) and the falsification rule (§12.2) is judged against.

Worse, the sample is endogenous: _which_ items cross a ≥7-day gap is chosen by the intervention under test. Improve the selection function and you change the denominator, not the numerator.

**What it should say:** the primary metric is a **volume-at-criterion** count — _number of items whose FSRS stability exceeds 21 days, per player, at week 8/16/24_ — with delayed accuracy reported alongside as a **calibration check** (does observed accuracy at scheduled intervals match predicted?). Volume is what "learns Chinese" means and it is what a scheduler cannot pin. Both are free from the same log.

Two smaller defects in the same sentence. "**≥7 days and ≥1 sleep**" is a redundant conjunction — seven days contains seven sleeps — and the second clause is there to sound rigorous, not to bind. And the metric does not filter on `role`: the log has `role (answerer | co_committed | observer | exposure)`, and the digests grade spectator exposure and spectator retrieval as separated by roughly the testing effect itself (g ≈ 0.50, Rowland). Pooling them into one accuracy number mixes two events of very different strength. **Restrict the metric to `answerer` and `co_committed` rows, and report `observer`/`exposure` separately.**

### 1.2 "A within-player pre/post comparison is a real experiment at n ≈ 200 players"

> "Log per player: turns voluntarily initiated, next-turn response latency, abandonment, next-session return — each keyed to whether the **previous** turn was a public failure. A within-player pre/post comparison is a real experiment at n ≈ 200 players, and it answers a question the field has not answered."

It is not an experiment. Public failure is not assigned; it is _caused_ — by item difficulty, by the dealing opponent's choice, by the player's own weakness. The same latent variable that produces the failure produces the slower next turn and the abandonment. Within-player differencing removes stable player traits and removes none of that.

The document knows this. Two paragraphs later, in §10.2, it correctly convicts the framing literature of exactly this error: _"the opposing-processes model was fitted over correlational studies in which goal endorsement was measured, not manipulated."_ It diagnoses the fallacy in someone else's work and commits it in its own measurement plan, using the word "experiment" to do it.

**What it should say:** "an observational within-player contrast, confounded with item difficulty and with the dealer's selection, reported with `θ_i` and prior per-item accuracy as covariates. It is a hypothesis generator, not an answer. The experiment, if we want one, randomises whether the score delta is shown publicly or privately on a given turn."

### 1.3 §10.2's second A/B spends a v1 slot tuning a flat optimum

> "**The spacing coefficient**, measured on **landing-day retention**. Two conditions, neither of them `0.15 × horizon` (P3): pure strength-based intervals, versus strength-based with a trip-date-driven recall-threshold ramp."

The document rejects `0.15 × horizon` and then commits one of its only two v1 A/B slots to the residue of the same finding. `A_18.json` grades this territory explicitly: Cepeda's ridgeline "is deliberately named a ridgeline because it is FLAT near the optimum … precision-tuning gap length buys very little"; "a trip is not a test date … a multi-week period of repeated, in-situ, self-reinforcing exposure"; and "gap SIZE matters and schedule SHAPE does not, so spend nothing on tuning." The document's A/B is a schedule-shape tuning experiment, on a mismatched outcome construct, with a flat expected effect, in a product whose §12.2 concedes the scheduler may barely run. It cannot produce a result.

**What it should say:** drop A/B 2. Give the power to A/B 1. If a second slot is wanted, the only spacing question worth v1 money is the one §12.2 raises: _does anything we do move `days_between_sessions`?_ — solo-surface nudge vs none, outcome = retrievals-at-≥7-day-gap per item per player.

### 1.4 §8 tail: two columns do not buy a distribution channel

> "Two integer columns buy a filtered deck for Dutch secondary students and a distribution wedge into a small, enumerable list of schools."

Tagging is necessary and nowhere near sufficient. Nothing in §§9–12 addresses procurement, teacher accounts, classroom mode, or a durability story a school could accept — §11.2's durable path is "the user exports a JSON file," which is not a thing a Dutch secondary school will operate for 90 pupils. And §9.2 forbids the letters "HSK" in store metadata, which is the exact string that makes the wedge legible to the buyer whose PTA is structurally based on it. The document does not notice that its trademark ruling and its distribution thesis point in opposite directions.

**What it should say:** either "the `vwo_400` column makes a school SKU _possible_; the school channel is out of scope for v1 and unbudgeted," or a paragraph on what the SKU actually requires. And see §7.1 below on minors' data.

---

## 2. Scope violations

### 2.1 The anxiety diagnostic imports a construct from the wrong task and confounds it with difficulty by design

> "**Anxiety / harm** | within-player response latency on opponent-dealt vs self-dealt items | latency inflates on opponent-dealt → the early-warning signal, because **efficiency degrades before effectiveness does** (Attentional Control Theory, Eysenck et al. 2007)"

Opponent-dealt items are _selected adversarially_. An opponent picks the item you are likely to miss. Latency on opponent-dealt items is therefore predicted to inflate by item difficulty alone, with no anxiety anywhere in the causal chain. As written, the diagnostic will trip in a perfectly healthy product and will be read as harm.

The digests separately mark the anxiety-to-reading transfer as a scope problem: `A_18.json` grades the FLCA link "moderate" and notes "its applicability to a private-answer co-located reading game is an inference." ACT is a lab account of anxious individuals' processing efficiency; it does not license "latency inflation = the product is harming players."

**What it should say:** "within-player latency on opponent-dealt vs self-dealt items, **residualised on `θ_i` and on the player's own prior accuracy for that item**, compared to the same player's latency on matched-difficulty self-dealt items. Trips only if the residual is positive. Elo `θ_i` from §11.8 is already stored; use it."

### 2.2 The cross-association remedy applies the form-confusable playbook to the category §12.1 says is uncovered

> §10.1: "`confusion[入口][出口]` crosses a threshold → **stop presenting them as co-options and re-teach the distinguishing component in isolation**"
> §12.1 #2: "A fourth confusion category **no cited study covers** … **Do not assume it behaves like the form-confusable case.**"

Separate-and-isolate _is_ the form-confusable remedy. §10.1 assumes exactly what §12.1 forbids assuming, and it does so in an always-on automatic response with a threshold attached. It is also directly opposed by the contrast rationale that presumably motivates co-presenting them in the first place.

**What it should say:** "the remedy is itself an untested arm. On a tripped threshold, randomise: separate-and-isolate vs increased contrastive presentation. Outcome = delayed discrimination accuracy. This is the cheapest way to answer §12.1 #2."

### 2.3 A design decision is shipped whose _direction_ the document says is unknown

§12.1 #10 lists Higa (1963) as deciding "the **direction** of the antonym effect, which decides whether 入口/出口 is the worst case or the easy one." §10.1 has already specified the remedy for 入口/出口 and the design's "flagship examples" are built on the assumption it is hard. A design cannot be built on a sign that has not been determined. Read Higa before §10.1's diagnostic ships, or make the diagnostic direction-agnostic.

---

## 3. Motivated reasoning toward what already exists

This is the failure mode the brief predicted, and it is present. **Every ruling in §§9–12 that touches something already built resolves in favour of keeping it, and in four cases the stated reason is weaker than the document's own material elsewhere.**

### 3.1 The most expensive, most contested component is retained as the default arm

> §12.1 #3: "**Object templates vs plain rendering** — The most expensive part of the build, and the evidence is genuinely contested … A/B from v1."
> §12.2: "If naked-probe accuracy trails in-object accuracy by more than ~20 points, we will have spent the design budget teaching enamel."

"A/B from v1" sounds neutral and is not. The templates ship as default; the cheap arm is the challenger; the tripwire fires only at a 20-point gap; and A/Bs at this product's n will mostly return "inconclusive," which resolves as _keep_. The burden of proof has been placed on removing the thing already built. For the component the document itself calls the most expensive part of the build on genuinely contested evidence, the burden belongs the other way.

**What it should say:** "Build plain rendering first. Ship templates to 50% of v1 only if the substrate work is already done; otherwise ship templates in v1.1 conditional on the A/B. A null result retires the templates, not the experiment. State the retirement date now."

### 3.2 §12.2 rescues the party game with an engagement claim the digests do not support

> "The party game … is genuinely well-evidenced for engagement (**co-located play produces the highest enjoyment and perceived social presence of any play configuration**)"

`A_04.json`, the digest that generated §11.4's entire transport section, closes its co-located survey with: _"All qualitative/small-n; no controlled learning-outcome study located."_ A qualitative, small-n literature cannot support a superlative across all play configurations. It also cannot support "genuinely well-evidenced," which is the exact phrase the document uses to license _not_ re-examining the party game after conceding that the party game cannot deliver the mechanism the product is built on.

This is the load-bearing sentence of the entire risk section. It appears immediately after the document gives up the learning claim for multiplayer, and its job is to keep the fork. Compounding it: enjoyment and perceived social presence are **self-reported constructs**, and §10.3 bans self-report — "self-reported difficulty · perceived helpfulness · … 'players report they had fun.'" The document holds the learning side to a standard it suspends for the one claim that saves the existing build.

**What it should say:** "Co-located play is reported as highly enjoyable in a qualitative, small-n HCI literature with no controlled learning-outcome study. We accept that as a reason to build it and we do not book it. The engagement claim is measured, from v1, on the same terms as the learning claim: sessions/week, self-initiated opens, and 8-week retention — not on enjoyment ratings, which §10.3 bans."

### 3.3 "Stay a PWA" is a whole-product decision derived from one clause on one asset — and the fix is named in the same sentence

> "CC BY-SA 4.0 §2(a)(5)(B) forbids applying effective technological measures; Arphic PL §5 bars imposing further restrictions on recipients. **Stay a PWA**, or serve gloss and any future stroke assets as separately-fetched, non-DRM'd files."

The second clause fully discharges the first. Everything the licences require is satisfied by keeping the BY-SA gloss out of the DRM'd container — which §9.1 _already mandates_ ("a **separate build artefact** … **Never inlined into the JS bundle**"). The licensing analysis therefore imposes no platform constraint at all, and the document nonetheless leads with a bolded platform ruling that happens to be the platform already built.

**What it should say:** "**Ruling: the gloss layer, and any future stroke assets, must be served as separately-fetched, non-DRM'd files. Given §9.1 this is already true. App Store distribution is therefore open on licensing grounds and must be decided on its own merits.**" Note that the strongest _actual_ argument for the PWA — mainland reachability of app stores — is nowhere in §9.3.

### 3.4 The stroke-data rejection contradicts §12.1 #7 and rests on an invented budget

> §9.2: "**Ship no stroke graphics in v1.** … a 1,200-character bundle is **1.21 MB brotli**, 40% of a 3 MB install budget, **for a skill this user will never perform.**"
> §12.1 #7: "Handwriting is **the best-evidenced Chinese-specific encoding manipulation** … Build it as an explicit experiment or not at all."

Three problems stacked. (a) The 3 MB install budget appears once, is derived from nothing, and is the decisive quantity in a bolded ruling. (b) "A skill this user will never perform" is a claim about the user, not a finding, and it is contradicted 3,000 words later by the document's own open-question list. (c) The real reason not to ship is the Arphic PL, which is stated first and is sufficient — and the byte argument and the user-model argument are stacked on top of it to make the ruling feel overdetermined. Stacking a fabricated number and a contradicted assertion behind a sound argument makes the sound argument look like motivated reasoning too.

**What it should say:** "Ship no stroke graphics in v1: Arphic PL §2(b) imposes a designated-place publication duty we are not ready to take on, and the bundle cost is 1.21 MB brotli at 1,200 characters. **Note the dependency:** §12.1 #7's finger-trace experiment requires this data. If #7 is to be run, the designated-place repo is a prerequisite and must be scheduled. Whether the user should ever write is a separate question, decided on opportunity cost at equal time, not on bundle size."

### 3.5 The framing decisions are shipped after being graded as an untested hypothesis

> "That 'framing can tip the sign of competition' is **the product's central untested hypothesis, not a finding** … The design decisions it motivates (no red negative numbers, no live losing-order, gain-framed copy) are cheap and harmless either way, so ship them; just do not book the benefit."

"Cheap and harmless either way" is asserted, not shown, and is false for at least one item: removing the live losing-order removes the scoreboard from a competitive game. That is a substantial design cost, not a null. And "do not book the benefit" is a promise with no enforcement — the A/B is third in the queue behind two others, one of which (§1.3 above) cannot produce a result.

**What it should say:** "Ship gain-framed copy and no red negatives; these are genuinely near-zero-cost. **Do not ship the removal of the live order** — that is a real change to a competitive game made on an untested hypothesis; it becomes the A/B. Book nothing."

---

## 4. Internal contradictions

### 4.1 City packs void the guarantee §11.5 calls non-negotiable, break §11.3's determinism rule, and have no provenance entry

> §11.5: "**CI gate 1 (§9.3) is mandatory and non-negotiable** — it is the only thing standing between us and tofu boxes on a customer's phone with no network to recover." Gate 1: "Any **item-bank** codepoint missing from the produced font subset."
> §11.6: "Per-city station-name packs as **separately downloadable bundles** … `city/beijing.json` with ~400 station names."

The font subset is generated from the item bank. City packs are not the item bank. Beijing and Shanghai station names contain 苹 磁 潘 苑 芍 汶 莘 漕 泾 蓝 罗 潭 and dozens more that no 1,500-character survival bank contains. Gate 1 does not see them. The result is the exact failure §11.5 declares the gate exists to prevent: tofu, on a downloaded pack, in-country, with no network to recover.

Two more collisions on the same feature. §11.3 rules that "**Distractor sets are precomputed at build time** … Generating them at runtime is too slow and non-deterministic, and phones will diverge" — and §11.6 generates transit distractors procedurally from a pack that not every phone has installed, which is precisely the divergence §11.3 exists to prevent. And §9.1 claims "all distractor sets with `whyPlausible`" as authored by us; procedural termini have no `whyPlausible`. And §11.6 names no source and no licence for the station data, which CI gate 2 (§9.3) would fail on sight.

**What it should say:** "City packs are part of the codepoint inventory. Gate 1 covers the union of the item bank and every shipped city pack, or each pack ships its own font delta. Transit distractors are precomputed per pack at build time with authored `whyPlausible`. Station-name provenance and licence go in the manifest before the first pack is built."

### 4.2 §11.2's export trigger fires after the event it protects against

> "iOS Safari evicts script-writable storage … after roughly **seven days of non-use** … Offer export at the end of every fifth session and **after any 14-day gap**."

Seven-day eviction, fourteen-day trigger. The prompt fires a week after the data may already be gone. And at the fortnightly cadence §12.2 assumes, "every fifth session" is once per ten weeks.

**What it should say:** "Offer export at the end of **every session** for uninstalled clients, and at the end of every third session for installed ones. Any gap-based trigger must be **shorter than 7 days**, which means it cannot be a gap trigger at all — it must be a scheduled local notification or an on-open prompt."

Related, and unexamined: the memory store is "**never synced to peers**," which makes it single-copy on a device whose OS deletes it, with a manual file as the only backup. The privacy reason given does not support a rule that strong — this is already a P2P system with signed events and stable identities, so an **encrypted-to-owner blob replicated to peers** preserves "no server we run," preserves privacy, and removes the single point of failure. The document does not consider it.

### 4.3 §11.2's absolute is contradicted in §11.4

> §11.2: "Full offline: … **No runtime fetch of any external host.**"
> §11.4 #5: "**Keep the current STUN/TURN path** as a separate, explicitly-labelled cross-network mode."

Say "no runtime fetch of any external host **in the co-located path**; the cross-network mode is the one documented exception and is labelled as such in the UI." As written the absolute is false and the CI gate that would enforce it does not exist (see §7.3).

### 4.4 §12.2 assumes the number §10.4 forbids assuming

> §10.4: "retrievals-to-stable-recall per item (**measure it; do not assume 6–10**)."
> §12.2: "**Six** well-spaced retrievals per item collapse to two."

Four paragraphs apart, and the sentence that violates the rule is the one carrying the emotional weight of the document's central risk argument. "Two" is unexplained as well. The digests separately flag this territory as containing mutually unsatisfiable exposure prescriptions.

**What it should say:** "Whatever the true retrievals-to-stable-recall figure is, a fortnightly cadence delivers a small integer of them per item per season, and the ratio between the massed and spaced cases is what the falsification instrument measures."

### 4.5 §10.3's replacement instrument is banned twice by the same document

> "Better still for a reading product: ask about **readability of a real string in context** ('can you read this sign?') **over cropped real signage**"

§9.2: "**Never the source photograph.** Photographs are internal reference, kept out of the repo and the bundle." Cropped real signage is a photograph. And "can you read this sign?" is a **yes/no self-rating** — the top entry on §10.3's own banned list, three paragraphs above.

**What it should say:** "over held-out signs **transcribed and set in typefaces used nowhere in the product**, with the player required to **produce the meaning** (select from four glosses), never to rate their own readability."

### 4.6 §9.1 and §9.2 disagree about where decomposition data comes from — with a licence consequence

> §9.1: "Everything else | **Authored by us** … all decomposition glosses"
> §9.2: "**Regenerate the equivalent decomposition and radical data from Unihan (permissive) + CC-CEDICT (BY-SA)**"

If any decomposition data derives from CC-CEDICT it is BY-SA and must live in the quarantined artefact §9.1 built for exactly this purpose — not in the "authored by us" column and not in the JS bundle. The tables must agree, and gate 2's manifest must record which is which. Separately: `kRSUnicode` is a radical-stroke index, not a component decomposition; the replacement plan needs to name the actual file it will use, because gate 3 depends on it.

### 4.7 §10.1 grants itself the exception §9.2 just refused

> "Source the held-out set from CTW, which makes it **reproducible and publishable**, and which removes the main cost objection to building it — subject to the NC constraint of §9.2."

§9.2: "**Ship no artefact derived from the annotations** unless a commercial grant is obtained." A published benchmark set whose membership is defined by CTW annotations is an artefact derived from the annotations. And "publishable" is the justification offered for choosing CTW at all, so the reason depends on the thing forbidden.

**What it should say:** "Source internally from CTW under route (b). The held-out set is **not published** until §12.1 #8 closes. Reproducibility is deferred, not claimed."

### 4.8 §11.3 says "the one place" and then immediately adds a second

> "This is **the one place** the reducer's purity is preserved by _recording_ a decision rather than deriving it." Four lines later: "the **dealt player's** exposure count … **rides in the event**."

Beyond the bookkeeping error, the substantive point is unexamined: the log is Ed25519-signed and the reducer deterministic so that peers cannot cheat. Moving `pickItem` and the tier selection onto the dealing device converts a verifiable computation into an unverifiable assertion, **in a competitive scored game**. A modified client deals itself easy items and no peer can detect it. The document should say so and rule — accept it (the threat model is friends at a table) or bound it (peers verify that the dealt item is a member of the eligible set, which is derivable from public state even when the ranking is not).

### 4.9 Two placement instruments at onboarding, neither budgeted

§10.1 puts the ~120-sign pre-test block in Tier-0 onboarding "where it doubles as the cold-start calibration." §10.3 keeps the 60-item yes/no check "as a **placement instrument at onboarding**." That is two cold-start tests before the first game. Pick one. Given §10.3's own analysis, pick the sign block.

---

## 5. False precision

Apply the document's closing rule to the document and it fails: _"If a line has neither mark, it is prose and should not be cited."_ The following unmarked numbers are cited elsewhere in the document as if established.

| Number                                | Where                                               | Status                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ------------------------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **3 MB install budget**               | §9.2, decisive in the stroke-data ruling            | **Invention.** Appears once, derived from nothing, never reconciled with §11.7's ~5 MB audio plan (which would be 167% of it)                                                                                                                                                                                                                                                                                                                                                                                 |
| **"~2,000–2,500 crossover"**          | §11.5, decisive in the subset ruling                | **Invention, and contradicted by the measured table on the same page.** The full `chinese-simplified` woff2 is 1,142,552 B for 7,946 codepoints = 144 B/codepoint; the subsets run 109–137 B/glyph. The curves do not cross until ~7,900 characters, i.e. the whole file. At 3,000 characters the subset is 418.6 KB vs 1,116 KB — still a 2.7× win. **Correct statement: "subsetting wins at every bank size we could plausibly ship."** The ruling is right; the reason given is wrong by a factor of three |
| **n ≈ 200 players**                   | §10.1 and §12.1 #5                                  | **Invention**, in the same document that demoted an instrument on an explicit SE computation. No effect size, no ICC, no attrition assumption                                                                                                                                                                                                                                                                                                                                                                 |
| **~20-point template gap**            | §10.1 table (unmarked), cited in §12.1 #3 and §12.2 | **Invention**, and methodologically wrong as specified: a 20-point gap at 90% in-object accuracy is a different animal from 20 points at 50%. Specify on a logit scale, or as a within-player contrast with a CI                                                                                                                                                                                                                                                                                              |
| **0.85 in `U(i)`**                    | §12.1 #1                                            | Unmarked, inside a formula, presented as reasoned. FSRS's own default is 0.90. Also: a squared loss treats early and late symmetrically, which is wrong — early is cheap, late loses the item                                                                                                                                                                                                                                                                                                                 |
| **"six-feature logistic regression"** | §11.8                                               | The six features are never named. Precision about a thing with no content                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **24,000 rows ≈ 400 KB**              | §11.1                                               | Arithmetic self-consistent (3,000 × 8 × 16 B), but wrong twice. The key is stated as **per-(player, item, direction)** and the row count drops the direction — 48,000 rows, not 24,000. And IndexedDB does not store 16-byte structs; with keys, structured-clone framing and index entries the real figure is 10–20× higher. The number is offered as reassurance, which is what makes being wrong expensive                                                                                                 |
| **Bank size**                         | Everywhere                                          | **Never fixed.** §9.2 costs stroke data at 1,200 characters; §11.1 sizes storage at "1,800-character + 1,200-word"; §11.5 targets "~1,500–1,800" and prices the decision at 1,500; §11.7 budgets audio at 1,200 items. Four decisions depend on a quantity the document never states. **Fix it in §1 and propagate.**                                                                                                                                                                                         |

**Correct arithmetic, for the record,** so the criticism is not read as blanket: §10.3's SE chain is right (0.096 → 0.136 → ≈27 points; ≈19 at 0.90/0.05; ~282 real + 141 pseudo for 10 points; ~1,700 for 5). §11.5's subset table is internally consistent at 132–138 B/glyph. §11.7's Opus figure is right (24 kbps × 1.5 s × 1,200 = 5.4 MB). §9.2's stroke figure is right (1,200 × 3,368 B → 1.21 MB brotli at 30%).

One caveat on §10.3: **≈27 points is the flattering convention.** 1.96·SE\_diff is the threshold for calling a difference significant; detecting a change with 80% power needs (1.96 + 0.84)·SE\_diff ≈ **38 points**. The document's argument survives either way and is stronger with the honest number — use it.

---

## 6. Evasion, and claims of consensus the digests do not support

**6.1 §10.3 demotes the check-in and then reinstates it without saying what decision it drives.** "Run **one long test (400+ items) twice a season**" resolves ~10 points at 400 items — by the document's own formula. What decision changes on a 10-point band, given that §10.1 claims the attempt log is "orders of magnitude better powered"? None is named. **Rule: kill it as an outcome instrument entirely; keep a short form as placement only.**

**6.2 §9.2's photography row manages disclosure instead of ruling.** "**Drop the 'we photographed 200 real menus in Chengdu' line** — it converts a private research practice into a public admission for no benefit." If the practice is lawful, saying so is not an admission. If it is not, silence does not cure it. The brief asked for a ruling and got media training. **Rule on whether the photography happened, whether it may continue, and on what lawful basis; the marketing line follows from the answer.**

**6.3 "The only open licensing item" (§12.1 #8) is false by §9.2's own table** — Tatoeba's per-sentence corpus licence "could not be verified," and §11.6's city packs have no named source at all. Closure claimed over two items the document itself left open.

**6.4 §12.2's falsification rule has three escape hatches built in.**

> "**If the median multiplayer inter-session gap exceeds 7 days while the solo gap sits under 3, the architecture inverts**"

(a) The trigger is **conjunctive**, so the worst realistic case — multiplayer at 20 days, solo at 3.5 — does not fire it. (b) It compares two **different self-selected populations**, so even the descriptive claim is confounded. (c) There is **no date, no n and no window**, in a rule whose entire purpose is that it "cannot be argued about later." A rule with no n and no date can be argued about indefinitely; it will be.

**What it should say:** "**If the median multiplayer inter-session gap exceeds 7 days across the first 100 players observed for 8 weeks, the architecture inverts.** The solo gap is irrelevant to whether the party game can deliver spacing and is not part of the trigger. Decision date: [week 12]. Owner: [name]." And define what "inverts" means operationally — the document never does.

**6.5 §11.8 bans four models in one line with no reason for any of them,** including half-life regression, which is the model `A_18.json` explicitly recommends in place of deep knowledge tracing. FSRS very likely supersedes it — but the document does not say so, and this is the one paragraph in the architecture section with no argument in it at all.

---

## 7. Silent omissions

**7.1 The school channel and minors' data.** §8 proposes Dutch secondary pupils as a distribution wedge. §9.2 raises GDPR for a person appearing in a menu photograph and never raises **Art. 8 / children's data** for the channel the document is actually proposing to sell into. That is the larger exposure by a wide margin, and it is absent.

**7.2 What orders the item bank.** §9.1 forbids `kFrequency` and `kGradeLevel`; §9.2 refuses SUBTLEX-CH, Jun Da and BCC and notes they disagree by 5–7 points at rank 1,000. Three ordering signals ruled out and no winner named. The answer is presumably CTW-derived signage frequency (permitted as an internal research input) with HSK band as tiebreaker — which is defensible and is the right answer for a _signage_ product. **Say it.** It is the single highest-leverage content decision in the build and it is currently implicit.

**7.3 A CI gate for the thing the document calls total product failure.** Ten gates protect the licensing position. Zero protect the offline guarantee. §11.4 #8 makes external-host enumeration a manual pre-ship step, and §11.2 makes "no runtime fetch of any external host" an absolute. **Gate 11: the built service worker and bundle contain no absolute URL outside the allowlist. Gate 12: `makemeahanzi` and `hanzi-writer-data` absent from the lockfile.** Which raises —

**7.4 Gate 3 is unimplementable as written.** "Any field traceable to `makemeahanzi/dictionary.txt`" cannot be checked by inspecting output; you can only diff against the source, which requires keeping the LGPL file in the build environment — the thing you are avoiding. **Restate as: every field carries a `source` tag, the tag set is closed, `makemeahanzi` is not in it, and the package is absent from the lockfile.** As specified, the most legally load-bearing gate in the list is theatre. (Gate 4 is near-tautological too — `strokeCount` is sourced from Unihan — unless its purpose is catching hand edits, in which case say so; and `kTotalStrokes` can carry two values, so scalar equality will false-positive.)

**7.5 Local-network reality.** §11.4 asserts "**For a co-located game you need no NAT traversal at all** — all phones are on the same LAN or hotspot." Restaurant, hotel and café Wi-Fi routinely run **AP/client isolation**, which blocks host-candidate connectivity between phones on the same SSID. The QA instruction — "**Test in aeroplane mode plus hotspot**" — tests the case that works. **Add: test on an AP-isolated guest network; detect the failure and fall back to pass-and-play automatically rather than hanging in ICE.**

**7.6 The signalling channel is not specified, and §11.4 is titled as if it were.** Dropping STUN/TURN removes traversal. Discovery and signalling are separate problems, and "Star topology, one session host, join code by QR — **as today**" inherits `trystero/nostr`, an external host, which §11.4 has just declared must go. A QR code carries the offer; **nothing in the document says how the answer gets back to the host.** That is the difference between working and not working in the Chengdu basement the section is written for. Specify it: scan-back QR, a `BroadcastChannel`/local-transport handshake, or accept pass-and-play as the only true zero-dependency mode and say so plainly.

**7.7 Observers and memory contagion.** The digests grade collaborative inhibition **strong** (Weldon & Bellinger 1997; Rajaram & Pereira-Pasarin 2010) and note that seeing a peer's wrong answer _implants_ it — described as upgrading "hide other players' errors" from a comfort feature to a **correctness requirement**. §10.1 and §12.1 #5 frame public failure purely as an engagement and anxiety question. The learning half is never asked, and the log already has the columns to answer it: `role`, `chosen_option`, and the subsequent per-item accuracy of every observer. **Add the diagnostic: does an observer's later error rate on item _i_ rise after observing a specific wrong `chosen_option` for _i_? It is free and it is the more consequential half of the question.**

**7.8 §11.1 specifies `spoken_attempt`** in a v1 with no audio, no speech input and no ASR anywhere in the document. Either name the producer or drop the column.

**7.9 §10.4 names d28 and then never uses it.** "transfer accuracy at d7 and d28" appears in the reporting list and in no metric, no A/B outcome and no tripwire — every decision in §10 runs on d7 or on landing day. This is the document's own warning, turned inward: it convicts the field's most-cited result of reading a next-day number as a learning result, and then makes every one of its own decisions on the shortest interval it has. **At least one decision gate must run at d28.**

**7.10 §10.1's secondary metric will not measure what it claims, and cannot be defended at its n.** It is single-arm pre/post with no control, so it confounds the app with the trip, the final-week cram, a class, a partner, and practice on the held-out set. Its denominator is _players who both take the trip and open the app on arrival_ — a tiny, maximally self-selected slice of a fortnightly party game's installs, and the document that computed an SE to two decimal places for the check-in computes nothing here. Its blocks are "matched on required-character count," which is not what makes a sign hard. And because §9.2 forbids photographs, the signs are transcribed into our own font — removing exactly the typographic, chromatic and environmental variability that made it a transfer test. **It should say: "a descriptive within-player change score on a self-selected subsample, reported with its denominator, matched on required-character _identity_ not count, rendered in held-out typefaces, and explicitly not a causal estimate."** Calling it "the only outcome measure in this product category that is not self-reported" is true and irrelevant: not self-reported is not the same as valid.

---

## The three changes that would most improve the document

**1. Replace the primary metric in §10.1 with volume-at-criterion, and demote delayed accuracy to a calibration check.** As written, the metric every A/B, every tripwire and the falsification rule reports against is held near-constant by the FSRS target and the 0.85 in the group objective, and its sample is chosen by the intervention under test. Nothing downstream in §10 or §12 can be trusted until this is fixed, because everything downstream inherits it. Same log, same cost: _count of items whose stability exceeds 21 days, per player, at weeks 8/16/24_, restricted to `answerer` and `co_committed` rows.

**2. Reverse the burden of proof on the object templates, and rewrite the last paragraph of §12.2.** The most expensive component in the build is retained as the default arm on evidence the document itself calls genuinely contested, protected by a tripwire that fires only at a 20-point gap — while the sentence that keeps the party game after its learning claim is surrendered ("genuinely well-evidenced for engagement … the highest enjoyment and perceived social presence of any play configuration") upgrades a literature the source digest describes as _"All qualitative/small-n; no controlled learning-outcome study located"_, and does it with a self-reported construct that §10.3 bans. Ship the cheap arm as default with a stated retirement date for the expensive one, and downgrade the engagement sentence to what the evidence carries. While you are in there, apply the same test to the other three keep-what-exists rulings: "Stay a PWA" (§9.3, where the fix is named in the same sentence), the stroke-data rejection (§9.2, invented budget plus a user-model claim §12.1 #7 contradicts), and the framing decisions shipped after being graded an untested hypothesis (§10.2).

**3. Specify the solo daily surface or withdraw the commitment.** §12.2 calls it "the one structural commitment this document asks for beyond the fork" and "where the product's best-evidenced mechanism lives" — and then §§9–11 specify nothing for it. No UI, no session shape, no item selection beyond "`pickItem` degrades to the single-player case for free," and not one metric of its own: opponent-dealt vs self-dealt, public failure, `co_committed`, bet tiers and the group objective are all group-shaped and none apply. The document concedes that the party game cannot deliver spacing, names the surface that can, and leaves it as a sentence. That gap is how the inversion in §12.2 becomes a year-two discovery rather than a v1 hedge — which is precisely the outcome the section was written to prevent.
