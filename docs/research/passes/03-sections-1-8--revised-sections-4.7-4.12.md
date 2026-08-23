| 滑 — which is §4.7's word-tokenisation issue, not this section's. **Ruling: 小心地滑 illustrates the heteronym field in §3.3.3(14) and the pre-segmentation rule in §4.7; the "a naive generator gets it wrong" claim is transferred to 银行 / 行李寄存, where it is true.** **Never ask for a character's pronunciation in isolation.** [E — strong, computed]

---

## 4.7 Spacing

| Rule | Value | Status |
|---|---|---|
| **No word spacing in the answering loop** | — | **[E — contested, resolved]** Word spacing is a training-only cue absent from every real sign — structurally identical to the tone colour and radical highlighting banned above, and defended with a weaker literature. It is also largely moot: signage targets are 1–4 characters (出口, 火车站, 牛肉面), where segmentation carries almost no information, and the eye-tracking benefit was measured on running prose this app does not contain |
| **No letter-spacing / tracking on hanzi** | 0 | **[J]** — owner: design; grounded in the same rule, since tracking is a segmentation cue by another name and it changes the percept |
| **No per-word background tint** | — | **[E]** it is colour carrying linguistic information (§4.5) |
| Word tokenisation | **Stored pre-segmented at authoring time**, never computed on device; surfaced **only** in the reveal's decomposition panel, where the word is already being taken apart. **This is where 小心地滑 is disposed of** (§4.6.5): 小心 \| 地滑 is authored, never inferred | **[E]** on storage; **[J]** on the surfacing — owner: design |
| Answer row gap | **8 px** | **[J]** — owner: design; test: mis-tap rate against 4 px and 12 px arms. The previous "[E-adjacent]" tag is abolished; nothing sourced this number, it was derived alongside the Parhi row height by adjacency, not by measurement |
| Destructive controls (skip / quit / end game) | **≥ 24 px from any answer option** | **[E]** WCAG 2.2 SC 2.5.8 spacing-based sufficiency at AA |
| Line-height, running hanzi | **1.6–1.8** | **[E]** direction only — Zhu/Su/Dong 2021 (n = 115) found a 12 pt-with-generous-line-spacing optimum; **[J]** on the specific band, owner: design |
| Line-height, single-line prompt | **1.0–1.15**, with explicit padding instead | **[J]** — owner: design |
| Text-spacing overrides | Layout must remain functional under SC 1.4.12 user overrides | **[E]** legal requirement. Substrate boxes are flexible, never fixed-width |
| Reveal pair members | **Same size, same baseline, same neutral ink, side by side** | **[E]** |
| Safe area | `env(safe-area-inset-bottom)` on the sticky option stack | **[E]** |

---

## 4.8 Layout

### 4.8.1 The answering screen

```
┌─────────────────────────────┐
│  top 25%: NOTHING TAPPABLE  │  turn state, silent timer band
│  under time. No corners.    │  [E: thumb-reach model]
├─────────────────────────────┤
│                             │
│   PROMPT: the sign on its   │  hanzi 64–80 px, in its substrate
│   substrate. Upper-middle   │  no pinyin, no component marks,
│   third. Looked at, never   │  no colour on the glyph
│   tapped.                   │
│                             │
├─────────────────────────────┤
│  ▸ option 1   60–64 px      │  three rows, full content width,
│  ▸ option 2   60–64 px      │  8 px gap, bottom ~45%,
│  ▸ option 3   60–64 px      │  sticky + safe-area inset
└─────────────────────────────┘
```

| Element | Value | Status |
|---|---|---|
| Options: **three**, not four | full content width, **60–64 CSS px** height, 8 px gap | **[E]** Rodriguez 2005 for the count, *within assessment efficiency*; **[J]** for importing it into a learning loop (§3.1(7)) — owner: product; test: 3-vs-4 on items-per-round × delayed retention. Height: **Parhi 9.2 mm = 58 CSS px** (n = 20, the one full-text-read study in the cluster); clears WCAG AAA 44×44 simultaneously |
| Options: **stacked full-width, not a 2×2 grid** | bottom **~45%** of viewport, sticky | **[E]** Bergstrom-Lehtovirta & Oulasvirta 2014 thumb-reach model (n = 20, model-fitting, not an outcome experiment) |
| **Minimum interactive height, anywhere** | **58 CSS px** | **[E]** Parhi's 9.2 mm floor, converted. The previous "56–60" was below both cited figures and unsourced at its lower bound; 9.6 mm (the point where error rate stops improving) is 60.5 px, and answer rows sit at 60–64 to clear it |
| Chrome target floor | **24×24 CSS px** (SC 2.5.8, AA) | **[E]** normative |
| Street / walking mode | every target **~88 CSS px** | **[E]** Conradi 2015, 14 mm standing-vs-walking |
| Prompt position | upper-middle third; unconstrained by reach because it is never tapped | **[E]** |
| **One item per screen. No peek or preview of the next item.** | — | **[E]** coherence / extraneous-material removal at the corrected independent estimate g ≈ 0.3 (not 1.00). **The retrieval-support clause is withdrawn** — a preview of the *next* item provides no retrieval support for the current one, so the stated mechanism did not fit the banned artefact. Coherence alone carries it. The retrieval-support argument is retained where it does apply: never display *other items' targets or answers* adjacent to the current one |

**Two resolved conflicts, recorded so they are not re-litigated — and one of them was resolved with the wrong argument:**

- The chinese cluster specified **four options in a 2×2 grid at a 48 px target minimum**; the interface cluster specified **three full-width rows at 60–64 px**. **The interface cluster binds on layout and row height** — Parhi's 9.2 mm floor is 58 CSS px, which supports 60–64 over 48 on the chinese cluster's own cited evidence, and the thumb-reach model supports full-width rows over a grid. **It does not bind on option count, and the previous draft's claim that it did is withdrawn:** four rows at 62 px with 8 px gaps occupy **272 px**, and the allocation is ~45% of an 844 px viewport, or **~380 px** — about 108 px of slack. The count rests on Rodriguez alone, at the scope and with the [J] import tag stated in §3.1(7). The chinese cluster's reveal table drops from four rows to three with the count, whichever way the 3-vs-4 A/B lands.
- **"44 px is the accessibility requirement" is a myth, in both directions.** [E] WCAG 2.2 SC 2.5.8 is **24×24 CSS px at AA**; SC 2.5.5 is **44×44 at AAA**; Apple HIG says 44×44 pt; Material says 48×48 dp. Four numbers for four different things, and the fact that the "standards" disagree by nearly 2× is itself evidence none of them is an empirical result. The empirical anchor is Parhi, in physical units, and it lands **larger** than 44 CSS px on most phones. **Write down which number you are meeting and why** — we meet 58 px as the floor and 60–64 px on answer rows, and the reason is Parhi.

### 4.8.2 Interruption and resumption

**[E — strong]** Task-resumption cost grows with the interruption's duration and demand and is mitigated by cues that reinstate the suspended goal; working-memory capacity strongly predicts resumption lag, so the cost falls hardest on the players already most loaded (Monk, Trafton & Boehm-Davis 2008; Altmann & Trafton — lab task-switching, not a phone game).

- Persist full item state — `itemId`, **options in shown order**, `elapsedMs`, selection-in-progress — to IndexedDB on **every `visibilitychange` and every option focus**, not at item boundaries.
- On resume, **never drop the player into a running timer.** Show a **~2 s reinstatement card** (**[J]** duration — owner: design; test: post-resume accuracy against a no-card arm) redisplaying the target and the round context, then **restart the item timer from full**.

### 4.8.3 The two shared surfaces

**Private input, public resolution — a v1 requirement, not a nicety.** [E]

**On the answering player's own device:** the item, the three options, the private commit.

**On the shared/table view during answering:** *"Player 2 is answering"* plus a progress bar. **Never the live selection.** No mid-round *"got it right in 2.1 s"* banner. No spoken-answer item type in v1 — reading, not speaking, is the target skill, so privacy costs nothing competitively.

**On the shared view at resolution:** the correct character and the correction **at full size**. The score delta: small, uncoloured, unanimated, silent.

**Banned from the shared interface entirely:** [E] any per-player accuracy percentage visible to others · any persistent cross-match individual ranking · any "weakest player" label · any live who-is-losing ordering during play · any global leaderboard. Show **team totals only**; the individual breakdown is private, on the player's own device, after the match. A **filled dot per player per round** shows **THAT** they contributed — never how much, never how accurately. (Presence-of-contribution is the effort cue; magnitude is the ability cue.)

**End-of-match screen** leads with an **absolute competence statement for every player** — *"You read 23 characters correctly tonight. 6 were new"* — with win/loss second and smaller. Rank by "characters you can now read" so the bottom player still sees a positive number. **This screen also carries the second entry point to the component layer** (§3.3.1): every item from the match is reachable here with its decomposition open, so the layer's availability never depends on a two-second tap window at the table.

---

## 4.9 Information density

### 4.9.1 Chunking — this is where complexity is spent

**[E]** on the mechanism (visual-span invariance, Wang/He/Legge 2014); **[J]** on every cap below — owner: design; test: on-device reading of the longest items in the bank.

- **6–8 hanzi** for low-complexity items;
- **4–6 hanzi** when build-time `meanStrokes` exceeds **12**;
- **`meanStrokes > 12` → one line, larger type, no gloss on the same line.**

Running-text hanzi capped at **2–3 lines per card**.

### 4.9.2 The reveal card

**Budget by integration load, not by a chunk-count constant:**

> **One target. One decomposition. One contrast. Everything else behind the explicit tap.**

**[E]** on the mechanism — element interactivity, split attention and redundancy (Sweller; Mayer) plus expertise reversal. **[J]** on the number three — owner: design; test: reveal comprehension and naked-probe delta against a two-element and a four-element card. **Explicitly not justified by Cowan's ~4**, which is graded folklore as applied to a screen whose elements all remain visible.

*The disagreement, stated so it is visible:* the review argues that if "the display is the memory" defeats Cowan, it defeats any numeric display cap including 1+1+1, and that only the citation changed. The number is authored and is now tagged accordingly — but the object being capped genuinely changed, from **items held in store** to **elements that must be integrated simultaneously to understand the correction**, which is why this document permits an unbounded tap-revealed layer that a Cowan storage cap would have forbidden. A cap on the integration path and a cap on the display are different rules that happen to share an integer.

**The one discriminating feature shown is TRUE OF THIS ITEM AND FALSE OF THE LURE THE PLAYER ACTUALLY CHOSE.** [E]

**Sequence on reveal:** [E on the order, **[J]** on the durations — owner: design]
1. **The hanzi alone, large, nothing else — ~800 ms.** This gives the glyph an unshared encoding window before any competing cue lands. Picture overshadowing is documented even when the picture appears as *feedback after the response* (Solman & Wu 1995) — which is precisely the configuration otherwise proposed. Test: naked-probe delta across 0 / 800 / 1600 ms arms.
2. Then the gloss text.
3. Then any image (reveal-side only, never mandatory, never for non-picturable items).
4. Audio, if it ever ships, autoplays here — **post-answer, never simultaneous with the item.**

**The table:** one row per option (three rows). Each row: **hanzi ≥32 px · pinyin · English AND Dutch gloss · one clause on where you would actually meet it.** Correct row gets the accent bar. **Wrong rows stay fully legible.** [E]

**Minimum dwell ~2,000 ms before Next enables.** **[J]** — owner: design; test: tap-open rate and next-session accuracy across dwell arms — and it engages **SC 2.2.1**, so it must be defeatable by the "no timers" setting.

**The card thins out as the item's accuracy record improves.** [E — expertise reversal]

### 4.9.3 The two documented small-type exceptions

Two templates deliberately violate the 28 px floor, and both are **documented, deliberate accessibility exceptions** rather than oversights:

- **The QR / mini-programme template** — a phone-inside-a-phone rendering a Chinese ordering UI at realistic density with tappable buttons, e.g. 去结算 vs 取消, 提交订单 vs 加入购物车, 余额, 领取优惠券.
- **The ingredient-list template** — grey paragraph text at real label density, with a scan-and-find task (*"is there soy in this?"*), not a recognition task.

**The horn, taken.** The previous draft licensed these by asserting the task "is not *what does this character mean*" but *"tap the button that adds this to your cart"* — which is a relabel, not an argument, and it was doing the work of protecting a template the design already wanted. **Ruling: these templates teach transactional discrimination in situ, which is a real and separate skill, and they are not scored as reading.** That is the horn: they are in a reading product as *situational rehearsal*, not as *orthographic training*, and the price of that is four conditions plus one new one.

*Against the review, whose two halves of this objection are in tension:* it argues both that "you cannot tap the right button without discriminating the characters" and that 提交订单 vs 加入购物车 is gestalt-solvable by length and silhouette. The second refutes the first — you *can* tap correctly without reading, which is exactly the defect — and the fix is not to relabel the task but to remove the gestalt route.

**Conditions, all required:**
1. **Floor of 16 CSS px** (**[J]** — owner: design; chosen as the smallest size at which a 19-stroke glyph plausibly resolves on a 2× display; **verify on target devices before ship, this is exactly the kind of number no study reports**).
2. **Never timed**, and a non-timed accessible alternative always available.
3. **Excluded from the naked probe**, and logged with `role: exposure` — **they never advance FSRS stability**.
4. **The target glyph still clears 4.5:1.** Small, yes. Low-contrast, no.
5. Requires `interaction: 'choice' | 'tap-target'` plus a hit-region spec in the item schema — **add it now rather than retrofitting.**
6. **New: every button pair must be length- and silhouette-matched, and every character in these templates must also appear at the 28 px floor elsewhere in the bank.** 提交订单 vs 加入购物车 differ in length and shape and are therefore solvable without reading; they ship only against a matched foil (提交订单 vs 提交评价, 去结算 vs 去支付). Unmatched pairs are cut. Without this condition the template demonstrably teaches shape at 16 px, excluded from the probe, and nothing in the product would catch it.

### 4.9.4 The naked probe — one implementation correction

§9–12 fixes the naked probe at **10–15% of presentations, target character alone, plain ground**, with a **>20-point** in-object-minus-naked gap meaning the app is teaching plates. **The mechanism stands; the three numbers are [J], not [E]** (§3.2(6)) — they appear in §9–12, which is a cross-reference and not a source. Owner: learning; test: the first-cohort delta distribution sets the real threshold.

**Two implementation notes that preserve its intent:**

- The probe must **not** render from the system CJK fallback. On a Japanese-locale device that fallback renders **直 骨 每 令 画** in Japanese glyph forms, and the probe would then measure locale glyph-form robustness rather than plate-independence. **Render the naked probe in one of the bank's own faces, chosen as one not recently used for this item, on a plain ground with no substrate.** The point of the probe is the absence of the plate, not the presence of an uncontrolled face.
- **Safety-pillar items take the probe at the top of the band and with the sign geometry removed** (§4.4.3), because for that pillar the geometry, not the substrate, is the overshadowing cue.

---

## 4.10 Simultaneity: what may share a screen, and what must never

### 4.10.1 MUST NOT co-occur

| Never together | Why | Status |
|---|---|---|
| A hanzi **and any colour on that glyph** | §4.5.1 | **[E]** + legal |
| A hanzi **and component markings**, on any timed card | Radical markings raised RT and lowered accuracy | **[E]** |
| A hanzi **and a stroke-order animation** | Lowered recognition accuracy; and no stroke graphics ship in v1 at all (§9–12, Arphic licence) | **[E]** |
| The **prompt hanzi and an image/photograph** | Picture overshadowing — the learner encodes the picture-meaning association and never processes the character form | **[E — hypothesis to instrument, but the split is cheap either way]** |
| The **prompt hanzi and pinyin**, inside a timed retrieval | Guidance reversal (§3.1d, §4.6.5) | **[E]** |
| **More than one highlight** in the reveal panel | Visual-load cap on the §3.4 A/B | **[J]** — owner: design |
| **More than one of** {visible countdown, live opponent monitoring, public score change} salient on any item | Do not stack pressures. Since observation is inherent to a co-located game, **the visible countdown is the one to remove** | **[E — moderate]** Beilock & Carr; worry occupies the same WM the effortful strategy needs |
| Both members of a **form-confusable pair introduced as new items in the same session** | §3.4(2) | **[E]** |
| A **confusable in the options** before both members are consolidated | §3.4(1) | **[E]** |
| Word-spacing, tracking or segmentation tint **and the answering loop** | §4.7 | **[E]** |
| A **preview of the next item** and the current item | §4.8.1 | **[E]** coherence |
| **Citation pinyin and natural audio** on a sandhi item | The app would display a T3 while playing a T2 on exactly the items where the learner is weakest | **[E — strong]** |
| **Safety-sign geometry and the naked probe** for a safety item | The geometry answers the question before the characters (§4.4.3) | **[E]** |

### 4.10.2 MAY co-occur

- The target on its substrate **+** the meaning **+** the one discriminating feature true of this item and false of the chosen lure. (That is the whole integration path. Nothing else joins it.)
- The prompt **+** three answer rows.
- On the reveal: both members of a confusable pair, **simultaneously, same size, same baseline, same neutral ink** — with the discriminator **named in words**. Adjacency alone does not work.
- On the reveal: per-character ruby beneath each glyph **+** the whole-word gloss beneath the ruby row.
- Substrate colour, geometry and the price/arrow/¥ that **constrain the meaning of the target** — these pass the seductive-details test.

### 4.10.3 Timing controls

**[E — legal requirement, SC 2.2.1 Timing Adjustable]** The stake-tier bet windows and the reveal dwell both engage it directly.

- Ship a **"no timers" setting** that turns off, adjusts or extends every limit.
- **Never award points for speed, and never break ties on it.** Score correctness only. **The previous draft banned speed scoring and then restored it as "break ties on total round time"**, which makes speed instrumentally valuable and reinstates exactly the pressure §3.1(g) prices at d ≈ 0.35 and §4.10.1 removes the visible countdown to avoid. **Ties break on fewest lure selections; if still tied, the round is a draw.** [E — the Kahoot review finds no learning advantage from speed scoring]
- Use a **silent, generous window with a subtle desaturation in its final fifth** — no ticking digits, no shrinking bar until then. Visual timers reduce anticipatory anxiety without changing performance.
- **No timeout penalty on an item's first exposure.**
- **The inherited 45 s / 75 s / 120 s bet windows are struck** and moved to §4.12.2 as invented numbers. They cannot coexist with the rule below, and the previous draft printed both in the same subsection. Set the real window from the product's own data: ship one generous default, measure the latency distribution of correct responses, set the window near the **90th percentile**, then derive the three stake-tier windows from that measurement rather than from the inherited triple.
- The 5 s / 10 s figures inherited from wait-time research are struck — that corpus is 1970s–80s observation of *teacher pause duration in oral classroom discourse*, and there is no oral discourse, no teacher and no turn-taking norm in a silent tap on a phone.

---

## 4.11 Accessibility as build gates, not backlog

**[E — legal, strong]** All of the following fail CI, not a review:

1. `lang="zh-Hans"` on **every** hanzi element; `lang="nl"` / `lang="en"` on **every** gloss. Without these the app is unusable with VoiceOver/TalkBack — they will not select a Mandarin voice — and it is non-conformant.
2. **Every type size in `rem`**, verified functional at **200% OS text scaling** (SC 1.4.4), **with the reflow behaviour of §4.2.4 rather than a clamp.** A single in-app 1.25× toggle does not discharge this.
3. Layout tolerant of **SC 1.4.12 text-spacing overrides**.
4. **4.5:1** on every target glyph in every treatment and both polarities; **7:1** in dark mode (§4.4.2).
5. **Colour never the sole carrier** of any distinction (SC 1.4.1).
6. **58 CSS px** minimum interactive height anywhere; **24×24 CSS px** chrome target floor; answer rows **60–64**.
7. A **"no timers"** setting reachable from the game screen.
8. The **diacritic render assertion** (§4.6.3) and the **font subset codepoint assertion**, enumerated codepoint by codepoint and never by block range, **including U+2EBC — CJK Radicals Supplement, U+2E80–U+2EFF** (§4.3.2).
9. `strokeCount` derived from Unihan `kTotalStrokes`, asserted — no hand-authored counts, and no hand-authored list of which characters exceed the ≥15 threshold.
10. **No highlight, contrast or component rule anywhere matches a character literal; every item whose string contains a 月-shaped component carries an explicit per-component record** (§3.3.4). The narrower "no item containing 期 tagged with the flesh component" is retained beneath this as a cheap regression check, but it is not the gate — it tested one symptom in one character and would have passed forever while 朗, 服, 有 or 望 shipped wrong.
11. **Homoglyph blacklist** over the item bank at authoring time, with source written as escaped codepoints (§4.3.2 gate 3).
12. **Component-panel glyph identity:** the glyph rendered in the decomposition panel is the same shape as the sub-glyph in the shipped face for that character (§3.3.4 correction 2).

---

## 4.12 Numbers: the ones not specified, and the ones this document invented

### 4.12.1 Deliberately not specified

Recorded so nobody invents them later and attributes them to this document:

**≥5 prior exposures before an opponent may deal** · **≤20-word explanations** · **≤14 px score delta / ≥17 px explanation text** · **correction within 300 ms** · **no screen idle >2 s** · **8–12 minute matches** · **≥40 scored retrievals per 10-minute session** · **a 60/40 content-vs-game-feel budget split** · **1-match-in-5 anxiety sampling** · **a 3-row leaderboard** · **at least three typefaces per word** · **at most four chunks on the resolution screen** (banned as a *Cowan-justified* cap; the three-element integration budget in §4.9.2 is a different rule with a different object and is tagged [J]) · **retire an item after 4 successful retrievals** · **a ~1.5–2 s anticipation beat** · **the 45 s / 75 s / 120 s bet windows** · **the +0.25 arcmin-per-stroke slope** · **the 1.7–2.0× ETDRS ratio as a sizing justification** · **≈8.7 points of RIF suppression** · **~7 points of lure-intrusion budget** · **the 5 s / 10 s wait-time figures**.

**None of these appears in, or is derivable from, any cited source.** Every one was an invented product decision wearing a citation. The px values additionally need restating in rem with a stated contrast ratio or they fail SC 1.4.3 and 1.4.4 on arrival.

### 4.12.2 Invented, retained as [J] — with owner and test

Added because §4.12 previously banned "re-queue at 5 and 15 intervening items" while §3.4(2) shipped "5–15 intervening items," and because a [J] tag with no owner and no test is a laundering device rather than a disclosure. Every number this document generated is listed here. Any [J] number not in this table does not ship.

| Number | Where | Owner | Test |
|---|---|---|---|
| **~3 exposures** of full ruby before fading | §3.1(5), §4.6.5 | learning | per-character error rate after fade vs a 5-exposure arm |
| **~50–100 characters** before the component layer opens | §3.3.3(11) | learning | component-contrast accuracy at introduction vs a 25-character arm |
| **5–15 intervening items** within a confusion set | §3.4(2) | scheduler | 7-day delayed discrimination accuracy, 5–15 vs 30–60 arms |
| **≥24h** minimum gap between correct repetitions | §3.4(2) | scheduler | retention at 30 days vs a 12h-minimum arm |
| **200 items** for the T2↔T3 distractor exclusion | §3.5(4) | learning | dormant — the object it constrains does not exist in v1 |
| **~800 ms** hanzi-alone reveal window | §4.9.2 | design | naked-probe delta across 0 / 800 / 1600 ms arms |
| **~2,000 ms** minimum reveal dwell | §4.9.2 | design | tap-open rate and next-session accuracy across dwell arms |
| **~2 s** resumption reinstatement card | §4.8.2 | design | post-resume accuracy vs no card |
| **contexts.size >= 3** for graduation | §3.2(6) | learning | vs a 2-context arm on the naked-probe delta |
| **10–15%** naked-probe rate | §3.2(6), §4.9.4 | learning | probe-delta variance at 5% / 10% / 20% |
| **>20 points** probe gap = "teaching plates" | §3.2(6), §4.9.4 | learning | first-cohort delta distribution sets the real threshold |
| **Three options** (importing Rodriguez into a learning loop) | §3.1(7), §4.8.1 | product | 3-vs-4 on items-per-round × delayed retention |
| **True R ≈ 0.75** Elo-band selection target | §3.1(2) | scheduler | session accuracy and next-session retention vs a single-controller arm |
| **market 30 / menu 30 / street 20 / safety 15 / transit 5**, and the transit-heavy onboarding split | §3.2(9) | content | measured encounter rates; retention by pillar |
| **16 px** small-type floor | §4.9.3 | design | on-device legibility at 2× |
| **8 px** answer-row gap | §4.7 | design | mis-tap rate vs 4 px and 12 px |
| **+15%** dark-mode size; **weight 500** dark and ≥15 strokes; **≈9:1** dark foreground | §4.2.3, §4.4.1 | design | on-device legibility, dark vs light, at the ≥15-stroke tail |
| **64–80 px** prompt band; **40–48 px** in-loop options; **32 px** reveal-row minimum | §4.2.1 | design | on-device legibility at the ≥15-stroke tail |
| **≥0.5em / 20 px** ruby floor | §4.6.2 | design | diacritic legibility at 1× and 2× |
| **6–8 / 4–6 hanzi** chunk caps; **1.6–1.8** and **1.0–1.15** line-heights | §4.7, §4.9.1 | design | on-device reading of the bank's longest items |
| **One target / one decomposition / one contrast** | §4.9.2 | design | reveal comprehension and naked-probe delta vs 2- and 4-element cards |
| **30%** tap-open-rate threshold below which the component layer is dead content | §3.3.1 | learning | first-cohort tap-open rate |
| **<5%** option-selection rate flagging a non-functioning distractor | §3.1(7), §3.4(1) | scheduler | per-option selection rates by competence band |
| **6.30 CSS px/mm** design constant (±15% device spread) | §4.1 | design | on-device measurement across the device matrix |
| **The 13-item cooking-method inventory** | §3.3.4 | content | menu-corpus frequency check |

Where this document needed a number in one of these slots, it is tagged **[J]**, it appears in this table, it has an owner, and it has a test. Nothing else does.