# 5. UX specification

## 5.1 The turn as a sequence of beats

A turn is six beats. The sequencing is not arbitrary: three of the six are fixed by evidence, and the rest fall out of them.

**1 — Deal (shared, ~10–15 s).** The opposing team is shown three category cards and picks one. Categories are named as places, not as taxonomies: _the noodle shop_, _Line 2 to the airport_, _the price gun aisle_. Game fiction is one of only two gamification elements that reliably moderate behavioural outcomes (points and leaderboards are not), so the fiction lives here, where it costs nothing, rather than being sprayed over the retrieval loop. Category granularity is a hard constraint, not a copy preference: the bet is a prequestion, and the prequestion benefit (g ≈ 0.66) is strictly item-specific — no spillover to other material in the same activity. "Signs on a subway platform" and "weight and price on a market label" are prequestion-granular. "Transport" is not, and buys nothing.

**2 — Bet (private, active player only).** Three tiers, committed before the item renders. The bet is stored as `bet_tier` and is a confidence probe and a social device — it is not a difficulty selector and does not choose the item format (§4). Its one pedagogic job is hypercorrection routing: an item missed at the highest tier enters a `high_confidence_miss` queue drained in the final round.

**3 — Item (all devices simultaneously).** The sign renders at once on every phone. No buzzer, no "who goes first."

**4 — Answer (private, every player, same window).** This is the beat the inherited engine gets wrong. Co-located group retrieval produces _collaborative inhibition_ — the group recalls less than the same people would alone — and the compensating benefit lives in re-exposure after retrieval, not during it. Turn-taking where three people watch one person retrieve is therefore the one shape to avoid. Resolution: **the dealt player carries the wager; everyone answers.** Every player commits privately in the same window and gets a review row logged against their own scheduler state. Only the active player's outcome touches the round's bet and the team score. This costs nothing and multiplies scored retrievals per minute by the table size.

Note what this is _not_. Giving each observer a **different, private** item during someone else's turn — a "shadow item" — is a documented myth: it forecloses the vicarious benefit rather than capturing it, and if you ship it you must defend it on retrieval-practice grounds alone. Everyone answering the _same_ item is a different thing, and it is the shape the classroom-response-system literature actually supports.

**5 — Reveal (shared).** Correct sign at full size, every option glossed, active player's choice marked. Detail in §5.5.

**6 — Next.** The turn passes **on rotation, not on error.** Losing the turn and losing points are two visible penalties attached to one person's mistake in front of the table; keep one.

Two optional beats attach to rounds flagged for them. A **recall beat** before the options appear — sign alone, ~3 s, "say it out loud" — logged as `spoken_attempt` and never scored; placed after the options it is not a retrieval attempt and buys nothing. And a **confer beat** after commits lock and before reveal: one spoken question to the highest bettor, ~5 s, "why isn't it 入口?" Never typed — typed self-explanation kills party-game pace. Rounds carrying a confer beat are followed immediately by one **isomorphic item answered individually with no discussion**; that last beat is the load-bearing part of the clicker result and needs `isomorph_group_id` on the bank.

## 5.2 What may be timed, and what may not

There is a legal floor here, not a preference. WCAG 2.1 SC 2.2.1 (Timing Adjustable, Level A) requires that a time limit can be turned off, adjusted, or extended; the European Accessibility Act became applicable on 28 June 2025 and pulls EN 301 549 / WCAG 2.1 AA onto a Dutch-published consumer app. The inherited 45/75/120 s bet timers and _any minimum reveal dwell_ engage it. So:

- **Ship a "no timers" table setting.** In a shared-clock co-located game a per-player accommodation is itself a public marker — the one person whose clock is longer is visibly the one who needed it. So the setting is chosen at match setup and applies to the whole table, is never attributed to a player, and is not announced. _(Judgement: the accessibility requirement is settled; making it table-scoped to avoid outing the player is our inference.)_
- **No auto-advance from the reveal.** Advance on tap. An auto-advance option exists but is opt-in and off.

Beyond the legal floor, three empirical constraints:

**Never score speed.** Time pressure costs accuracy over and above making people faster (d ≈ 0.35), hits difficult items and high-working-memory players hardest, and speed scoring in quiz games shows no learning advantage over accuracy scoring. Score correctness only; break ties on total round time — a tiebreak on already-correct answers is the one admissible use of the clock.

**Do not stack pressures.** At most one of {visible countdown, live opponent monitoring, public score change} may be salient on any item. Observation is inherent to a co-located game and cannot be removed, so the visible countdown is the one that goes: a silent generous window with a subtle desaturation across the final fifth, no ticking digits, no bar that shrinks from the start.

**The numbers are placeholders, and must be labelled as such.** 45/75/120 s are engineering defaults, not findings; so are the 5 s / 10 s figures derived from classroom wait-time research, which do not transfer to a phone recognition item and are deleted. The window is set from the product's own data: measure the latency distribution of _correct_ responses and put the window near its 90th percentile. And whatever the bet-to-timer mapping ends up being, **the harder tier must never carry the shorter window.** No timeout penalty on an item's first exposure.

## 5.3 Downtime

Downtime is most of a co-located game, and the honest design answer is to have almost none of it. Because every player answers every item (§5.1 beat 4), the only genuine waiting beat is the deal — 10–15 s in which the whole table watches an opposing team argue about which category to hand over, which is the social payload of the format and needs no filling.

What the observer sees during another player's _bet_ is the anonymous state of the table: a filled dot per player indicating **that** they have committed, never what they chose and never how fast. Presence-of-contribution is the effort cue that resolves the tension between social loafing (which team scoring without identifiable contribution produces) and ability attribution (which identifiable _magnitude_ produces). Magnitude stays private, on the player's own device, after the match.

If a paired-observation variant is ever trialled, the benefit attaches specifically to two non-active players conferring aloud about the active player's item — solo observers did substantially worse. That is the confer beat, not a private side-quest.

## 5.4 Session pacing and length

**A match is a round-count band, not a race to a points target.** The band (12–18 scored retrievals per player is our starting choice) is a product decision, not an evidence-derived number — the "8–12 minute match" and "≥40 retrievals per 10-minute session" figures circulating in the inherited spec have nothing behind them and should not be quoted. What genuinely bounds match length are the four non-tunable scheduler constraints, which the match engine cannot override because the scheduler is the product and the match is a presentation of it:

1. No item is scored twice in one session; a recurrence logs `role: exposure` with no stability update.
2. No item advances out of LEARNING on same-session corrects — a correct in a _later_ session is required.
3. Consecutive incorrect answers per player are capped at 2; on the third, force-inject an item where that player's retrievability exceeds 0.95, regardless of the group objective.
4. Any item's per-player minimum interval is floored at 1 day.

Constraint 1 sets the ceiling: a match cannot outrun the shortest due queue at the table. Constraint 3 is also a public-failure mitigation and reappears in §5.8.

**Session length across days is where the product actually lives.** Spacing is the best-evidenced manipulation in L2 vocabulary learning, and a game played when friends happen to meet is structurally massed; re-queueing at 5 and 15 intervening items is within-session massing dressed as spacing. The solo daily surface is therefore load-bearing, not a degenerate multiplayer case. Instrument `sessions_per_week` and `days_between_sessions` split by mode from the first cohort: if the median multiplayer gap exceeds ~7 days while solo sits under ~3, the architecture inverts — solo becomes the primary path and the match becomes an acquisition channel.

Every session, both modes, ends on one screen: **the signs you can now read**, rendered as actual signs at real size in their real typefaces. Not a points total, not a coverage percentage — coverage arithmetic is brutal and misleading (knowing 40% of characters gives roughly a 2.6% chance of reading a four-character dish name), and two corpora both called "Chinese character frequency" disagree on their top three.

## 5.5 Feedback timing and elaboration

**Immediate and adjacent, on every item, without exception.** This reverses the earlier recommendation to batch the reveal to the end of a five-item round. Batching is defensible on one axis only — immediate and delayed feedback are equally effective at cutting multiple-choice lure intrusions, and delay may help retention of correct answers — but the spacing that a delay incidentally creates is recoverable through the lapse queue, whereas the pretesting and hypercorrection benefits are not recoverable any other way. Hypercorrection needs the correction to land at the moment of surprise. The social protection that batching was reaching for is delivered instead by the private-input / public-resolution split (§5.8).

Feedback is mandatory, not a setting: multiple-choice lures are produced on ~5% of questions when untested, rising to ~12% a week after testing, and feedback is the documented fix. Budget ~7 points of lure intrusion as the price of the format; the net remains positive. Log `{itemId, lureId, timestamp}` and re-queue the missed item later in the match and again the next day. Do **not** immediately re-present the item with the lure removed, and do **not** forbid reusing a lure as another item's correct answer — both are folklore.

**The reveal glosses every option, not just the right one.** A four-row table with each string's meaning, not a green tick on one row. The chosen option is named and marked wrong explicitly when a lure was taken.

**Elaboration is conditional, and the condition is whether a discriminating cue exists.** Elaborated feedback beats knowledge-of-correct-response beats bare verification (roughly d ≈ 0.49 / 0.32 / 0.05), but that advantage is concentrated in higher-order outcomes and narrows sharply for the low-order recognition this product is scoped to. So: KCR always — it is cheap and well-supported. Elaboration only where a real difference can be named (confusables, shared components, compound semantics). If nothing discriminating can be said, the slot stays empty; a fixed explanation on every item is an unvalidated product bet, and a fixed word cap on it is invented precision.

**The component cue is a separate glyph, never a marking inside the character.** Colour-coding visually similar hanzi slowed learners down, radical markings inside a character raised response time and lowered accuracy, and a cue present in training but absent at test produced the worst retention and transfer of any condition — and a metro plate carries no cues. So no tint, outline, or coloured sub-glyph region on any hanzi, ever. Where a component is taught, it appears beneath the character as its own glyph: 肝 shown as ⺼ + 干. This is exactly where the stored-field rule bites — 肝 gān and 腰 yāo take ⺼ (U+2EBC), 期 qī takes the real 月, and 期 sits inside 保质期 bǎozhìqī, a Tier-1 supermarket item. The reveal reads the component off the item's stored field; a substring match would teach the wrong thing on a high-frequency card (期 is rank 214 in the corpus).

Pinyin at the reveal only, per-character ruby directly beneath each glyph — vertical alignment beats a horizontal string, and adjacent-format layouts scored highest on gains while being the _least_ preferred, so player preference surveys about layout are ignored. Audio renders the surface (sandhi) form, not the citation form, or the app plays a T2 while displaying a T3 on precisely the contrast Dutch beginners are weakest on.

## 5.6 The two surfaces

**Your phone** carries everything private: your bet, your options, your selection before it locks, your own accuracy, your own scheduler state, your post-match breakdown. Input happens only here.

**The table surface** carries everything public: the dealt category, the sign, the anonymous committed-dot row, the reveal, and the single end-of-match screen. It is a logical surface rendered identically in the upper region of every device, and optionally _promoted_ to a dedicated propped-up phone in Table mode.

Promotion changes the type scale and almost nothing else. At the 360 mm design viewing distance a prompt hanzi of 64–80 CSS px (at ~6.3 CSS px/mm — never 96 px/inch, never CSS `mm`/`pt`) subtends 97–121 arcmin. Held at ~1 m across a table, holding that angle requires ~2.8×, i.e. **178–222 CSS px**. That is most of a phone's width, which is the point: a promoted table surface shows the sign and nothing else. Everything that will not survive that scale-up belongs on the phone.

Same-device pass-and-play is the zero-dependency fallback, and there the two surfaces alternate on one screen. The "Hand to \<name\> — tap when ready" interstitial must therefore also clear the previous player's answer, not merely change the header.

## 5.7 Interruption and resumption

Resumption cost grows with the interruption's duration and demand, and is mitigated by cues that reinstate the suspended goal; working-memory capacity strongly predicts resumption lag — which means the players most likely to be hurt by a bad resume are the ones already carrying the most load.

- Persist `{itemId, options in shown order, elapsedMs, bet_tier, selection-in-progress}` to IndexedDB on **every** `visibilitychange` and every option focus — not at item boundaries.
- On resume, never drop a player into a running clock. Show a ~2 s reinstatement card redisplaying the target and the round context, then restart the item window from full.
- Hold a Screen Wake Lock for the session.
- A dropped peer never blocks a round. The window closes when it closes; the absent player's row logs `role: exposure` with no stability update. **An absence is never scored as an error** — that is both correct measurement and a public-failure mitigation.
- The reducer is transport-agnostic over `{playerId, itemId, choice, elapsedMs}`, so same-device handoff, BroadcastChannel and the WebRTC datachannel are swappable and any peer can rebuild state from the signed log.
- If the gap crosses the 04:00 local day boundary the match does not resume mid-round; it re-deals, because the scheduler's day has changed underneath it.
- Durability is explicit JSON export/import with local storage as cache, not the reverse. The seven-day iOS storage-eviction case gets its own QA test; it is the failure that silently deletes a returning player's entire history.

## 5.8 Mitigations for public failure

The mechanic makes you fail in front of opponents who chose your category. Two things must be said before the mitigations. First, **there is no controlled study of whether public failure in a language-learning game suppresses subsequent participation** — in either direction. Anyone claiming otherwise is extrapolating. Second, the mitigations below are justified by **retention and attendance**, which the product can measure, not by a promised learning gain: whether reducing anxiety improves learning or improving decoding reduces anxiety is a decades-old unresolved exchange, and the defensible framing survives either answer.

**Evidence-backed.**

1. **Private input, public resolution — a v1 requirement.** Answers are entered on the answering player's own device. The shared surface shows "answering" plus committed dots, never a live selection, never "got it right in 2.1 s." Being watched impairs accuracy on complex and novel tasks; the often-quoted "small effect, 0.3–3% of variance" describes a _passive_ audience, not a stake-holding opponent who chose your item, and the small average hides opposite-signed subgroups. Collaborative inhibition is the stronger and cleaner reason. Reading, not speaking, is the target skill, so privacy costs nothing competitively. **No spoken-answer item type in v1** — the modality is recognition-and-selection.

2. **Simultaneous blind commit; no buzzer; no watching one person retrieve.** Same evidence base (§5.1).

3. **Public task information, private self information.** Feedback is not reliably beneficial: across ~131 papers and ~607 effect sizes the mean is d ≈ 0.41 but roughly **38% of effect sizes are negative**, and the moderator is whether attention goes to the task or to the self. A public point loss with no task information attached is close to pure self-level feedback. So on a wrong answer the _shared_ surface carries the correct character and the correction at full size; the score change is a small, brief, uncoloured, unanimated, silent tick, specified in rem with a stated contrast ratio. Point _gains_ may be salient; point _losses_ must not.

4. **The engine, not the opponent, picks the item.** Opponents choose the category; the item is drawn from the target player's due queue within a retrievability band. The invented "≥5 prior exposures before an opponent may deal" gate is deleted and replaced by this, which makes the dealing mechanic safe by construction rather than by a rule someone has to remember. Note the corollary: **confusable distractors are gated on consolidation state** — domain-plausible but non-confusable options on a sign's first appearances, competitive confusables only once both members of the pair are consolidated. The mechanism that makes competitive lures beneficial requires knowledge the learner already holds; deploy it before that and you are running a coin flip in public.

5. **The 2-strike floor.** Cap consecutive incorrect answers per player at two; on the third, force-inject an item at retrievability > 0.95 regardless of the group objective. This is the single most direct anti-humiliation device in the system and it lives in the scheduler, where it cannot be overridden by the match.

6. **Competence before comparison, for everyone.** It is losing, not competing, that undermines intrinsic motivation — and giving losers explicit competence feedback restores motivation to levels comparable with winners. Every player's end screen leads with an absolute statement ("You read 23 characters correctly tonight. 6 were new"); win/loss is second and smaller. Streak credit is awarded for retrievals attempted, competence-contingent, never competition-contingent.

7. **Latency as the harm tripwire.** Anxiety degrades processing _efficiency_ before _effectiveness_ — latency inflates before accuracy drops. Alert on within-player latency inflation on opponent-dealt items relative to self-dealt ones. And **never accept enjoyment as the safety signal**: enjoyment and anxiety are distinguishable dimensions (r ≈ −0.36), so a session can be both fun and harmful. (Also: never write "affective filter" in this document; a reviewer with SLA training will discount the surrounding argument.)

**Never displayed on the shared surface.** Any per-player accuracy percentage. Any live selection before reveal. Any named response time. Any "weakest player" label. Any persistent cross-match ranking of individuals. Any global leaderboard. Any streak-loss or you're-about-to-lose-it notification.

**Never ranked continuously.** No live standings during play, no who-is-losing ordering, no running position indicator. Competitive salience is high at match setup and on the single end-of-match screen, and near zero during the retrievals in between — the item loop should be as neutral and task-focused as a flashcard. The end screen is ranked by "characters you can now read," so the bottom player still sees a positive number.

**Judgement, not evidence.**

- **The contribution dot** — one filled dot per player per round showing _that_ they contributed, never how much. This resolves the real tension between social loafing and ability attribution rather than trading one harm for the other, but the resolution is reasoned, not tested.
- **Improvement-based team contribution** — contribution as a clipped function of `correct_this_round − personal_rolling_baseline`, rather than raw correctness, which makes the beginner a liability and reproduces exactly the condition under which competitive structures do their documented damage. The _direction_ is well-supported; the effect magnitudes quoted for cooperative-over-competitive structures are allegiance-contested and unusable as planning numbers.
- **Rotation instead of error-passing** the turn (§5.1 beat 6).
- **Table-scoped timing accommodation** (§5.2), so the accommodation is not itself a public marker.
- **Gain-framed copy and no red negative numbers.** Whether framing can tip competition from harmful to beneficial is the product's central untested hypothesis, not a finding — the model behind it was fitted over correlational studies where goals were measured, not manipulated. The changes are cheap and harmless either way, so ship them; just do not book the benefit. This is the **first** thing to A/B test, outcome = next-turn latency and next-session return.

**Make it answerable.** Store `turns_since_last_public_failure` as a field on every attempt row, alongside `voluntarily_initiated`, next-turn response latency, abandonment, and next-session return. Then the question this section could not answer from the literature becomes a query rather than a data-collection project, and a within-player pre/post comparison is a real experiment at n ≈ 200 players.
