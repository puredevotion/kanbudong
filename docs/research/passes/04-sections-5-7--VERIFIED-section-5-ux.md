All verification is complete. The source runs ~3,800 words, so hitting the 2,000–3,000 limit requires compressing supporting argument while keeping every ruling. Here is the corrected text.

---

# 5. UX specification

## 5.1 The turn as a sequence of beats

Six beats. Three are fixed by evidence; the rest fall out of them.

**1 — Deal (shared, ~10–15 s).** The opposing team picks one of three category cards, named as places rather than taxonomies: *the noodle shop*, *Line 2 to the airport*, *the price gun aisle*. Game fiction, unlike points and leaderboards, has a reliable behavioural-moderation signal, so the fiction lives here where it costs nothing. Granularity is a hard constraint, not a copy preference: **the category card, not the bet, is the prequestion-like cue** — it is the only thing that previews item content before the item renders — and the prequestion benefit (g ≈ 0.66 on prequestioned material) is item-specific, with no reliable spillover within the same activity. "Signs on a subway platform" is prequestion-granular; "Transport" is not, and buys nothing.

**2 — Bet (private, active player only).** Three tiers, committed before the item renders, stored as `bet_tier`. A confidence probe and a social device, not a difficulty selector, and it does not choose the item format (§4). It carries no item content, which is why the granularity argument sits on the category. Its one pedagogic job is hypercorrection routing: an item missed at the top tier enters a `high_confidence_miss` queue drained in the final round.

**3 — Item.** The sign renders at once on every phone. No buzzer, no "who goes first."

**4 — Answer (private, every player, same window).** Co-located group retrieval produces *collaborative inhibition* — the group recalls less than the same people would alone — and the compensating benefit lives in re-exposure after retrieval, not during it. So: **the dealt player carries the wager; everyone answers.** All players commit privately in the same window, each getting a review row against their own scheduler state; only the active player's outcome touches the bet and the team score. This multiplies *logged* retrievals per minute by table size. It is not free: it removes the spectating window entirely (§5.3).

**Shadow items — a different private item per observer — are not shipped in v1.** The vicarious-learning results attach to shared attention on one item, so parallel private work cannot capture that benefit; claiming it does is inference, not finding.

**5 — Reveal (shared).** Correct sign at full size, every option glossed, active player's choice marked (§5.5).

**6 — Next.** The turn passes **on rotation, not on error.** Losing the turn and losing points are two visible penalties on one mistake; keep one.

Two optional beats attach to flagged rounds. A **recall beat** before options appear — sign alone, ~3 s, "say it out loud" — logged as `spoken_attempt`, never scored; placed after the options it is not a retrieval attempt and buys nothing. And a **confer beat** after commits lock: one spoken question to the highest bettor, ~5 s, "why isn't it 入口?" Never typed, which is a pace judgement rather than a finding. Confer rounds are followed immediately by one **isomorphic item answered individually with no discussion**; that beat is the load-bearing part of the clicker result and needs `isomorph_group_id` on the bank.

## 5.2 What may be timed, and what may not

A legal floor, not a preference. WCAG 2.1 SC 2.2.1 (Timing Adjustable, Level A) requires a time limit to be turnable off, adjustable, or extendable; the European Accessibility Act became applicable on 28 June 2025 and pulls EN 301 549 / WCAG 2.1 AA onto a Dutch-published consumer app. The 45/75/120 s bet timers engage it. SC 2.2.1 carries an essential-function exception and a quiz timer is what someone will reach for — **we do not invoke it**; the timer is not essential to reading a sign. A *minimum reveal dwell* blocks advancing rather than limiting a response, so it falls outside 2.2.1 on the letter; it goes anyway.

- **Ship a "no timers" table setting.** On a shared clock a per-player accommodation is itself a public marker, so the setting is chosen at match setup, applies to the whole table, is never attributed, and is not announced. *(The requirement is settled; table-scoping is our inference.)*
- **No auto-advance from the reveal.** Advance on tap; an auto-advance option exists, opt-in, off.

**Never score speed.** Time pressure costs accuracy over and above making people faster (d ≈ 0.35), and speed scoring shows no learning advantage over accuracy scoring. That carries the rule alone; the claim that pressure hits high-working-memory players hardest comes from choking work on WM-intensive problem solving, does not transfer cleanly to speeded recognition, and is not relied on. Score correctness only; break ties on total round time — the one admissible use of the clock, disclosed **only on the end screen** so it cannot shape play.

**Do not stack pressures.** At most one of {visible countdown, live opponent monitoring, public score change} may be salient during the answer window. Observation is inherent to a co-located game, so it is the one that stays. The countdown goes: a silent generous window with a subtle desaturation across the final fifth, no ticking digits, no shrinking bar. Score changes are desalienced for the whole answer window; gains may be salient at the reveal only.

**The numbers are placeholders and must be labelled so.** 45/75/120 s are engineering defaults, as are the 5 s / 10 s figures from classroom wait-time research, which do not transfer to a phone recognition item and are deleted. Set the window from our own data: measure the latency distribution of *correct* responses and put it near the 90th percentile — itself a starting choice. **The harder tier must never carry the shorter window.** No timeout penalty on first exposure.

## 5.3 Downtime

Because every player answers every item, the only genuine waiting beat is the deal — 10–15 s of the table watching opponents argue about which category to hand over, which is the social payload and needs no filling.

During another player's *bet* the observer sees one filled dot per player showing **that** they committed, never what or how fast. Presence-of-contribution resolves the tension between social loafing (produced by team scoring without identifiable contribution) and ability attribution (produced by identifiable *magnitude*). Magnitude stays private, on the player's own device, after the match.

Beat 4 leaves no non-active observers, so no window exists for a paired-observation variant. The result it would rest on — two non-active people conferring aloud, solo observers doing substantially worse — comes from observed tutoring dialogue, not quiz items, and that transfer is not established. It survives only in the confer beat.

## 5.4 Session pacing and length

**A match is a round-count band, not a race to a points target.** The band (12–18 scored retrievals per player) is a product choice, not an evidence-derived number. Match length is bounded by four non-tunable scheduler constraints, which the match engine cannot override because the scheduler is the product and the match is a presentation of it:

1. No item is scored twice in one session; a recurrence logs `role: exposure` with no stability update.
2. No item leaves LEARNING on same-session corrects — a correct in a *later* session is required.
3. Consecutive incorrect answers per player are capped at 2; on the third, force-inject an item where that player's retrievability exceeds 0.95. Cap and threshold are conservative product defaults, derived from nothing.
4. Any item's per-player minimum interval is floored at 1 day.

Constraint 1 sets the ceiling: since items come from the *active* player's due queue (§5.8.4), a match cannot outrun the shortest due queue at the table. Constraint 3 is also a public-failure mitigation (§5.8).

**Session length across days is where the product lives.** Spacing is the best-evidenced manipulation in L2 vocabulary learning, and a game played when friends happen to meet is structurally massed; re-queueing at 5 and 15 intervening items is within-session massing dressed as spacing. The solo daily surface is therefore load-bearing, not a degenerate multiplayer case. Instrument `sessions_per_week` and `days_between_sessions` split by mode from the first cohort: if the median multiplayer gap exceeds ~7 days while solo sits under ~3, solo becomes primary and the match an acquisition channel. Both thresholds are pre-registered product choices, written down now so the decision is not relitigated later.

Every session ends on one screen: **the signs you can now read**, as actual signs at real size in their real typefaces. Not a points total, and not a coverage percentage — because **a single percentage cannot be read**, in either direction. Frequency-first study makes character knowledge strongly correlated with character frequency, so naive independence arithmetic is badly wrong: in our corpus the top 1,000 characters cover 87.1% of tokens (about 57% of four-character strings fully known) and the top 2,000 cover 96.0% (about 85%). The two corpora we hold, both called "Chinese character frequency," also disagree on rank 1: ours opens 一 / 是 / 人 with 的 at rank 27, where published lists put 的 first by a wide margin.

## 5.5 Feedback timing and elaboration

**Immediate and adjacent, on every item, without exception.** Batching the reveal to the end of a five-item round has one defence — immediate and delayed feedback cut lure intrusions equally well — but the spacing a delay creates is recoverable through the lapse queue, whereas the pretesting and hypercorrection benefits are not, and hypercorrection needs the correction to land at the moment of surprise. The social protection batching reached for comes instead from the private-input / public-resolution split (§5.8).

Feedback is mandatory, not a setting: lures are produced on ~5% of questions when untested, rising to ~12% a week after testing, and feedback is the documented fix. That ~7-point gap is the cost of running the format **without** feedback — a cost we avoid, not a budget we carry. Log `{itemId, lureId, timestamp}`; re-queue the missed item later in the match and again the next day. Two further constraints are sometimes proposed: immediately re-presenting the item with the lure removed, and forbidding a lure from later serving as another item's correct answer. Neither is supported and neither is refuted; we decline both, and the lure log keeps that call checkable.

**The reveal glosses every option** — a four-row table with each string's meaning, not a green tick on one row. The chosen option is named and marked wrong explicitly when a lure was taken.

**Elaboration is conditional, and the condition is whether a discriminating cue exists.** Elaborated feedback beats knowledge-of-correct-response beats bare verification (roughly d ≈ 0.49 / 0.32 / 0.05), but that advantage concentrates in higher-order outcomes and narrows sharply for the low-order recognition this product is scoped to. So KCR always; elaboration only where a real difference can be named — confusables, shared components, compound semantics. If nothing discriminating can be said the slot stays empty. A fixed explanation on every item is an unvalidated bet, and a fixed word cap on it is invented precision.

**The component cue is a separate glyph, never a marking inside the character.** Colour-coding visually similar hanzi slowed learners down, radical markings inside a character raised response time and lowered accuracy, and a cue present in training but absent at test produced the worst retention and transfer of any condition — and a metro plate carries no cues. So no tint, outline, or coloured sub-glyph region on any hanzi, ever. Where a component is taught it appears beneath the character as its own glyph: 肝 shown as ⺼ + 干.

This is where the stored-field rule bites. 肝 gān, 肠 cháng, 肚 dù, 腰 yāo and 脑 nǎo all take **⺼ (U+2EBC)**; 期 qī takes the **real 月 (U+6708)**, and 期 sits inside 保质期 bǎozhìqī, a Tier-1 supermarket item. In our decomposition data the two are disjoint — 182 characters carry U+2EBC, 33 carry U+6708, none both — so a *raw* substring search for 月 does not over-match the flesh family; it silently **under**-matches, returning nothing for 肝 while appearing to work. The real hazard is the opposite operation: the glyphs are visually identical at reveal size, and any pipeline that normalizes, folds, or shape-matches them sweeps 期 into the flesh family and teaches "flesh + 其" on a rank-214 card. One rule covers both failures: **the reveal reads the component off the item's stored field by exact codepoint equality.** No substring matching, no Unicode normalization, no glyph comparison, plus a bank-load assertion that no stored component field contains U+6708 unless the character genuinely decomposes with it. (Rank 214 is our corpus's number; since the corpora disagree on rank 1, every rank quoted here names its corpus.)

Pinyin at the reveal only, per-character ruby directly beneath each glyph: vertical alignment beats a horizontal string, and adjacent-format layouts scored highest on gains while being the *least* preferred. That licenses ignoring preference data **about this layout choice**, not preference data generally. Audio renders the surface (sandhi) form, not the citation form, or the app plays a T2 while displaying a T3 — the contrast learners from non-tonal L1s, Dutch included, are weakest on. We hold no Dutch-specific tone data.

## 5.6 The two surfaces

**Your phone** carries everything private: your bet, your options, your selection before it locks, your accuracy, your scheduler state, your post-match breakdown. Input happens only here. **The table surface** carries everything public: the dealt category, the sign, the anonymous committed-dot row, the reveal, and the single end-of-match screen — a logical surface rendered identically in the upper region of every device, optionally *promoted* to a propped-up phone in Table mode.

Promotion changes the type scale and almost nothing else. At the 360 mm design viewing distance a prompt hanzi of 64–80 CSS px (at ~6.3 CSS px/mm — never 96 px/inch, never CSS `mm`/`pt`) subtends 97–121 arcmin. Held at ~1 m across a table, holding that angle takes ~2.8×, i.e. **178–222 CSS px** — on a ~64 mm-wide display, 44–55% of the width. About half the screen for one character, which is the point: a promoted table surface shows the sign and nothing else.

Same-device pass-and-play is the zero-dependency fallback; there the two surfaces alternate on one screen. The "Hand to \<name\> — tap when ready" interstitial must also clear the previous player's answer, not merely change the header.

## 5.7 Interruption and resumption

Resumption cost grows with the interruption's duration and demand and is mitigated by cues that reinstate the suspended goal; working-memory capacity predicts resumption lag, so the players most likely to be hurt by a bad resume are those already carrying the most load.

- Persist `{itemId, options in shown order, elapsedMs, bet_tier, selection-in-progress}` to IndexedDB on **every** `visibilitychange` and every option focus — not at item boundaries.
- On resume, never drop a player into a running clock. Show a ~2 s reinstatement card (a product default) redisplaying the target and round context, then restart the item window from full.
- Hold a Screen Wake Lock for the session.
- A dropped peer never blocks a round. The absent player's row logs `role: exposure` with no stability update. **An absence is never scored as an error.**
- The reducer is transport-agnostic over `{playerId, itemId, choice, elapsedMs}`, so same-device handoff, BroadcastChannel and the WebRTC datachannel are swappable and any peer can rebuild state from the append-only event log.
- If the gap crosses the 04:00 local day boundary the match re-deals rather than resuming mid-round, because the scheduler's day changed underneath it.
- Durability is explicit JSON export/import with local storage as cache, not the reverse. WebKit evicts script-writable storage after seven days without interaction, silently deleting a returning player's whole history; a home-screen-installed PWA is exempt, so QA covers both cases and the export prompt surfaces before day seven.

## 5.8 Mitigations for public failure

The mechanic makes you fail in front of opponents who chose your category. Two things first. **We could locate no controlled study of whether public failure in a language-learning game suppresses subsequent participation** — in either direction; absent one, claims here are extrapolation. Second, the mitigations are justified by **retention and attendance**, which we can measure, not by a promised learning gain: whether reducing anxiety improves learning or improving decoding reduces anxiety is a decades-old unresolved exchange, and this framing survives either answer.

**Evidence-backed.**

1. **Private input, public resolution — a v1 requirement.** Answers are entered on the answering player's own device; the shared surface shows "answering" plus committed dots, never a live selection, never "got it right in 2.1 s." Being watched impairs accuracy on complex and novel tasks, and the often-quoted "small effect, 0.3–3% of variance" describes a *passive* audience, not a stake-holding opponent who chose your item. Collaborative inhibition is the stronger and cleaner reason. Reading, not speaking, is the target skill, so privacy costs nothing competitively. **No scored spoken-answer item type in v1**; the recall and confer beats are spoken but unscored, and are not item types.

2. **Simultaneous blind commit; no buzzer; no watching one person retrieve.** Same evidence base (§5.1).

3. **Public task information, private self information.** Feedback is not reliably beneficial: across ~131 papers and ~607 effect sizes the mean is d ≈ 0.41 but roughly **38% of effect sizes are negative**, and the moderator is whether attention goes to the task or the self. A public point loss with no task information attached is close to pure self-level feedback. So on a wrong answer the *shared* surface carries the correct character and the correction at full size; the score change is a small, brief, uncoloured, unanimated, silent tick, specified in rem and meeting **4.5:1 against its background** (WCAG 1.4.3 AA; 3:1 under 1.4.11 for a non-text indicator). Gains may be salient at the reveal only. Losses never.

4. **The engine, not the opponent, picks the item.** Opponents choose the category; the item is drawn from the target player's due queue within a retrievability band, which makes the dealing mechanic safe by construction rather than by a rule someone must remember. Corollary: **confusable distractors are gated on consolidation state** — domain-plausible but non-confusable options on a sign's first appearances, competitive confusables only once both members of the pair are consolidated. The mechanism that makes competitive lures beneficial requires knowledge the learner already holds; deploy it earlier and you are running a coin flip in public.

5. **The 2-strike floor** (§5.4, constraint 3; both numbers ours). The most direct anti-humiliation device in the system, and it lives in the scheduler where the match cannot override it.

6. **Competence before comparison, for everyone.** It is losing, not competing, that undermines intrinsic motivation, and giving losers explicit competence feedback restores motivation to levels comparable with winners. Every end screen leads with an absolute statement ("You read 23 characters correctly tonight. 6 were new"); win/loss is second and smaller. Streak credit is competence-contingent, never competition-contingent.

7. **Latency as the harm tripwire.** Anxiety degrades processing *efficiency* before *effectiveness* — latency inflates before accuracy drops. Alert on within-player latency inflation on opponent-dealt items relative to self-dealt ones. And **never accept enjoyment as the safety signal**: enjoyment and anxiety are distinguishable dimensions (r ≈ −0.36), so a session can be both fun and harmful. (Also: never write "affective filter" here; a reviewer with SLA training will discount the surrounding argument.)

**Never on the shared surface.** Any per-player accuracy percentage; any live selection before reveal; any named response time; any "weakest player" label; any persistent cross-match ranking; any global leaderboard; any streak-loss notification.

**Never ranked continuously.** No live standings, no who-is-losing ordering, no running position indicator. Competitive salience is high at match setup and on the single end screen, near zero in between. The end screen ranks by "characters you can now read," so the bottom player still sees a positive number.

**Judgement, not evidence.**

- **The contribution dot** — one filled dot per player per round showing *that* they contributed, never how much. It resolves the loafing/attribution tension rather than trading one harm for the other, but the resolution is reasoned, not tested.
- **Improvement-based team contribution** — a clipped function of `correct_this_round − personal_rolling_baseline` rather than raw correctness, which otherwise makes the beginner a liability. The *direction* is well-supported; the magnitudes quoted for cooperative-over-competitive structures are allegiance-contested and unusable as planning numbers.
- **Rotation instead of error-passing** (§5.1 beat 6), and **table-scoped timing accommodation** (§5.2).
- **Gain-framed copy and no red negative numbers.** Whether framing can tip competition from harmful to beneficial is the product's central untested hypothesis, not a finding — the model behind it was fitted over correlational studies where goals were measured, not manipulated. Cheap and harmless either way, so ship them; just do not book the benefit. This is the **first** thing to A/B test, outcome = next-turn latency and next-session return.

**Make it answerable.** Store `turns_since_last_public_failure` on every attempt row, alongside `voluntarily_initiated`, next-turn latency, abandonment, and next-session return. A within-player pre/post contrast is **quasi-experimental, not an experiment** — no random assignment, confounded with time-on-product and improving skill. Worth running as a screen, and n ≈ 200 players gives roughly 80% power for a paired effect of d ≈ 0.2 (n = 196, α = .05, two-sided). Causal claims wait for the randomised framing test above.

---

## Corrections applied

1. **§5.5, the substring hazard was stated backwards.** Verified against the decomposition data: 肝 肠 肚 腰 脑 all decompose ⿰⺼X with **⺼ U+2EBC** (radical field U+2EBC too); 期 is ⿰其月 with the **real 月 U+6708**. The sets are disjoint — 182 characters carry U+2EBC, 33 carry U+6708, zero carry both — so a substring search for 月 *under*-matches (returns nothing for 肝), it does not over-match. Rewritten to name the actual failure (normalization or shape-folding sweeping 期 into the flesh family) and to mandate exact-codepoint equality plus a bank-load assertion. Nothing in the text now keys highlighting off a substring match on 月.
2. **§5.4, the 2.6% coverage figure is deleted.** 0.4⁴ assumes knowledge is uncorrelated with frequency; frequency-first study makes that false. Recomputed from the shipped corpus: top 1,000 characters = 87.1% of tokens (≈57% of four-character strings), top 2,000 = 96.0% (≈85%), top 40% of types = 4,804 characters = 99.7% of tokens. The figure understated learner progress by about two orders of magnitude. The recommendation survives, re-argued on uninterpretability.
3. **§5.1, "the bet is a prequestion" corrected to the category card.** The bet carries no item content, as beat 2 itself says, so it cannot be the prequestion. The granularity constraint now follows from its cited finding. "Strictly item-specific / no spillover" softened to "no reliable spillover."
4. **§5.5, the "~7 points of lure intrusion" budget removed.** 12% − 5% is the cost of running *without* feedback, which the same paragraph mandates. An avoided cost had been booked as an accepted loss.
5. **§5.2 / §5.8.3, the at-most-one-pressure rule contradicted "gains may be salient."** Reconciled: observation is the one salient pressure during the answer window; gains move to the reveal.
6. **§5.1, "documented myth" rewritten as a ruling.** No such evidentiary category exists and the foreclosure claim is a mechanism inference; shadow items are now ruled out of v1, dropping the "defend it on retrieval-practice grounds" hedge. "Costs nothing" removed — it costs the spectating window.
7. **§5.2, the high-working-memory claim demoted.** It comes from WM-intensive problem solving, not speeded recognition, and it contradicted §5.7. "Never score speed" now rests on the accuracy cost alone.
8. **§5.8, "a real experiment at n ≈ 200" corrected.** A pre/post has no random assignment; it is quasi-experimental. n ≈ 200 is licensed only at a target of d ≈ 0.2 (n = 196, α = .05, two-sided), now stated.
9. **§5.6, "most of a phone's width" corrected to 44–55%.** The angular arithmetic verified: 64–80 CSS px at 6.3 px/mm and 360 mm = 97.0–121.2 arcmin; ×2.778 = 178–222 CSS px.
10. **Bare numbers now name their source.** 期 rank 214 verified, but the corpus opens 一 / 是 / 人 with 的 at rank 27, so ranks are corpus-relative and attributed. The 0.95 floor, 2-strike cap, 90th-percentile window, ~7/~3-day thresholds and 2 s card are labelled product defaults, per the section's own standard.
11. **§5.2, SC 2.2.1's essential-function exception named and explicitly declined**, closing the obvious counter-argument; the minimum reveal dwell reclassified as outside 2.2.1 but removed on other grounds.
12. **§5.3, the paired-observation variant contradicted beat 4**, which leaves no observers; it now survives only in the confer beat, with the tutoring-dialogue transfer flagged as unestablished.
13. **Smaller fixes.** "One of only two gamification elements" — the second was never named, so the count is dropped. "Both are folklore" softened to unsupported-and-unrefuted, declined, kept checkable via the lure log. Preference-survey dismissal narrowed to the layout question. "Dutch beginners are weakest" generalised to non-tonal L1s. "Signed log" → append-only, no signing scheme existing. iOS eviction gains the installed-PWA exemption. §5.8.1 reconciled with the unscored recall/confer beats. "No controlled study" → "we could locate none." "A stated contrast ratio" now states it (4.5:1; 3:1 non-text). Supporting argument was compressed throughout to meet the length limit; no ruling was dropped.

**Verified and left unchanged:** 肝 gān, 肠 cháng, 肚 dù, 腰 yāo, 脑 nǎo, 期 qī, 入口 rùkǒu, 保质期 bǎozhìqī (保 bǎo / 质 zhì / 期 qī) — every pinyin syllable and tone mark correct; 肝 = ⺼ + 干 correct; all cited hanzi are correct simplified forms, and the document makes no simplified/traditional claims to check. The visual-angle arithmetic, the 131 papers / 607 effect sizes / d ≈ 0.41 / ~38% negative figures, the d ≈ 0.49 / 0.32 / 0.05 ordering, the 28 June 2025 EAA date, and SC 2.2.1's Level A designation all check out.