8.2 The secondary instrument: your own attempt log

Free, continuous, and orders of magnitude better powered than any discrete test you can fit in a session.

- **Learning KPI:** accuracy on items whose interval has crossed a **≥7-day** threshold, aggregated over hundreds of items per player.
- **Generalisation KPI:** `unseenCompoundAccuracy` — accuracy on shopfront-head items the player has never seen (§5, Scene H). This measures rule transfer, not recall.
- **Retrievals-to-stable-recall per item** — measure it, then replace the assumed ~6–10 exposures with your measured value (§1.9f).
- **Naked-probe delta** — ~10–15% of presentations render the target character alone, system face, plain ground. If a player's naked-probe accuracy trails their in-object accuracy by more than ~20 points, **the app is teaching plates, not characters, and should say so.**

## 8.3 What the yes/no test can and cannot do

**[MEASURED / arithmetic]** The proposed 60-item instrument (40 real + 20 pseudowords, corrected score = hits/40 − false_alarms/20) has SE ≈ 0.096 at a hit rate of 0.75 and a false-alarm rate of 0.10 — so a single score carries a 95% interval of **±19 points**, and the difference between two sittings has SE ≈ 0.136, i.e. a **minimum detectable change of ≈27 percentage points**. Even at a flattering 0.90/0.05 the MDC is ≈19.

Running it every ten sessions produces a number that moves mostly at random, which is **worse than no number**, because the team will read the noise. Resolving a 10-point change needs ~284 real + 142 pseudowords (~10 minutes); 5 points needs ~1,700 items.

**Ruling:** demote the yes/no test to a **placement instrument** at onboarding (which also supplies the cold-start calibration a mixed-ability table needs) and a coarse band estimate, which is what 60 items can support. Take the outcome signal from the attempt log and the transfer test. If a discrete test is wanted for a hero number, run **one long test (400+ items) twice a season**, not a short one ten times.

Two Chinese-specific problems with the format, both flagged and neither solved:
- **Pseudo-characters are useless** (rejected on sight, collapsing the false-alarm rate the correction divides by). The valid stimulus is a **pseudo-word** — real characters, morphologically well-formed, non-existent. The brief's own example 票冷 fails this: noun+adjective juxtaposition with no licit compound structure. Build them by substituting one character of an attested compound with a frequency-matched character sharing the semantic radical.
- **Deeper: Chinese has no word delimiters, and "is this a word?" is a judgement on which native readers and competing segmentation standards disagree.** The yes/no format imports an assumption about wordhood that Chinese does not supply. **Safer instrument for a reading product: ask about readability of a real string in context** — "can you read this sign?" over cropped photographs, with distractor strings drawn from real signage in an unlocked domain. That measures what the product promises and sidesteps wordhood entirely.

## 8.4 Instrument learning and engagement as two separately-reported metrics

| Family | Metric | Never conflate with |
|---|---|---|
| **Learning** | Transfer-test accuracy at d7/d28; ≥7-day delayed accuracy from the log; retrievals-to-stable-recall | anything below |
| **Engagement** | sessions/week, retrievals/session, streak length, `selfInitiatedOpens` vs `notificationOpens` | anything above |
| **Guardrail** | Post-session anxiety check-in (3 items, 5-point, ~8 s, sampled 1 match in 5) using items drawn from a **validated FNE instrument** (Leary 1983 Brief FNE), **not** a nonexistent FLCAS subscale | — |

**Never accept enjoyment or NPS as evidence that the adversarial mechanic is harmless.** Dewaele & MacIntyre (2014), n≈1,746: foreign language enjoyment and anxiety are distinguishable dimensions at r ≈ −0.36, not −1.0. A session can be simultaneously enjoyable and anxiety-provoking.

## 8.5 Build the experiment harness in week one

Do not ship mechanics on the strength of the published literature; it is bias-prone at exactly the k values (9–19) where bias diagnostics are underpowered, and novelty effects mean cross-sectional studies over-report what a mechanic does in month six.

- Deterministic bucket assignment from a hashed device id.
- Variant recorded on **every attempt event**.
- Evaluate every mechanic against **7-day and 28-day transfer accuracy**, not next-day return.
- **Measure at 8+ weeks** for anything motivational — Hanus & Fox's 16-week design is the reason.

**Six A/Bs the evidence explicitly leaves open, in priority order:**
1. Wager tier on/off, and the tier gate on/off → transfer accuracy.
2. Image-on-reveal vs text-only-on-reveal → delayed recognition. *The literature predicts the image condition loses.*
3. Object-templated vs plain rendering → naked-probe accuracy at 7 days.
4. Variable-typeface exposure vs single-face → transfer accuracy.
5. Gloss language (nl vs en for Dutch users) → 7-day delayed accuracy.
6. Public vs private gloss cost → next-turn latency, next-session return, and abandonment (see §10, Open Question 4).

**One thing to log that costs nothing and answers a question the field has not:** `turns_since_last_public_failure`, plus per-turn `response_latency_ms` and `voluntarily_initiated`. A within-player pre/post comparison of next-turn latency and next-session return is a real experiment at n≈200 players, and **Attentional Control Theory predicts latency inflates before accuracy drops** — so latency is your early-warning metric.

---

# 9. PWA and architecture implications

## 9.1 Fonts — measured, and the recommendation reverses the brief

**[MEASURED]** `@fontsource/noto-sans-sc@5.3.0`, inspected with fontTools:

| Artefact | Size | Coverage |
|---|---|---|
| `chinese-simplified` named subset, weight 400 | **1,142,552 B = 1.09 MB** | 7,946 codepoints / 7,333 hanzi / 8,248 glyphs |
| 97 numbered unicode-range chunks, weight 400 (the **default** `index.css` path) | 2.27 MB total, mean 24 KB | same |
| pyftsubset, 300 hanzi + 121 Latin/punct, woff2 | **44.7 KB** | |
| 600 hanzi | **84.9 KB** | |
| 900 hanzi | **123.5 KB** | |
| **1,200 hanzi** | **164.0 KB** | |
| 2,000 hanzi | 277.4 KB | |
| 3,000 hanzi | 418.6 KB | |

Near-linear at 109–137 bytes/glyph. **Coverage verified: all 3,000 HSK 3.0 characters present; all of 焗 煲 涮 菌 藕 韭 笋 蒜 姜 葱 炝 烩 蕈 蚝 鲈 鳝 present. Tofu risk from the typeface is zero.**

**Recommendation, decisive:**
- **Self-host. Do not use the Google Fonts CSS API** — its ~100 unicode-range chunks require network at render time, and the hosts are blocked in mainland China. Both facts are individually disqualifying for an offline-first PWA sold for use in China.
- **Ship the build-derived subset (~164 KB at 1,200 chars) with a hard build gate**: walk the item bank, emit the exact codepoint set, run `pyftsubset --text-file=bank-chars.txt --flavor=woff2 --layout-features= --no-hinting --desubroutinize`, and **fail CI if any bank codepoint is missing from the produced subset**. Regenerate the subset as part of the content build so the font can never drift from the content.
- **If the bank grows past ~2,500 characters, ship the whole 1.09 MB `chinese-simplified` file instead** and delete the entire missing-glyph risk class. At that point the subset saves ~670 KB, and on an offline-first PWA where a missing glyph is unrecoverable at a restaurant table with no signal, that is cheap insurance.
- One weight (400) plus one heavier (500) for dark mode. Rename the family. Ship `OFL.txt`.
- Separate diacritic-complete Latin face, with the U+01D6–01DC build-time render assertion (§3.2).

**Do not ship stroke-path data** (§7.2) — that is where the megabytes and the copyleft are.

## 9.2 Storage — and the iOS failure that silently deletes a returning user

- **Per-item scheduling state is 16 bytes** (`stability f32`, `difficulty f32`, `last_review f64`). 3,000 characters + 3,000 compounds × 2 directions × 8 local players ≈ 96,000 rows ≈ **1.5 MB in IndexedDB**. Trivially within budget, fully offline.
- **Compute R(t,S) inline at selection time from stored state; never persist a due-date.** A device asleep for three weeks then needs no catch-up job on wake.
- **FSRS-6 forgetting curve, verified from source** (fsrs-rs `inference.rs`, ts-fsrs `algorithm.ts`): `decay_param w[20] = 0.1542`; **exponent = −w[20]**; `FACTOR = 0.9^(1/−w[20]) − 1 = 0.980346`; `R(t,S) = (1 + 0.980346·t/S)^(−0.1542)`, giving R = 0.9 at t = S. Inverse: `I(r,S) = S·(r^(1/−0.1542) − 1)/0.980346`.
  > **Two traps.** The brief printed both `^DECAY` and `^(−DECAY)` in different findings, and paired FSRS-4.5's `FACTOR = 19/81` (correct only for decay 0.5) with FSRS-6's 0.1542. Copying that literally yields `R(10S) = 1.443` — a probability above 1. And **ts-fsrs's own docstring writes `t/(9·S)` while its code uses `t/S`.** Copy the code, not the docstring.
- **⚠️ iOS Safari evicts script-writable storage — IndexedDB, Cache API, service-worker caches — after ~7 days of non-use for sites not installed to the home screen.** This destroys exactly the returning-user history the churn architecture exists to protect. **Mitigations, all required:** prompt Add to Home Screen on first successful session; make server-side sync (or explicit JSON export/import) the durable store with local as cache, not the reverse; **test the seven-day eviction case explicitly in QA.**
- **Session state persists on every `visibilitychange` and every option focus**, not at item boundaries (§3.7).
- **Screen Wake Lock** for the duration of a session — a 10-minute session on a table with the phone face-up will otherwise sleep repeatedly.

## 9.3 Sync and peer discovery — the constraint the briefs did not cost

**There is no browser API for local peer discovery on iPhones.** WebRTC data channels are universally supported but require out-of-band signalling. Web Bluetooth — the only realistic alternative — is **not implemented in Safari on iOS or macOS at any current version** (caniuse: `n` through iOS 26.5 and Safari 27/TP).

Compounding it: **the default STUN server in nearly every WebRTC tutorial and library is `stun.l.google.com:19302`, which is blocked in mainland China.** A co-located game whose peers cannot discover each other in the country it was built for is a total product failure, not a degradation.

**Ruling — and for a co-located game this is fortunate, because you do not need NAT traversal at all:**
1. **Configure an empty `iceServers` array explicitly.** Never inherit a library default. All phones are on the same LAN or hotspot; **host candidates only.**
2. **Star topology.** One device is the session host, shares a join code by **QR**, peers connect on local-network candidates.
3. **Ship a same-device pass-and-play fallback**, with a "Hand to <name> — tap when ready" interstitial that hides the item until tapped. This is also the only genuinely zero-dependency option.
4. **Make the game state machine transport-agnostic**: a pure reducer over `{playerId, itemId, choice, elapsedMs}` events, with the transport (same-device handoff, `BroadcastChannel`, WebRTC datachannel) swapped underneath. Do not build the rules into the networking layer.
5. **Test with the device in aeroplane mode plus hotspot** — the realistic condition in a Chinese restaurant basement.
6. If a relay is ever needed, **self-host coturn in-region.** Never a Google default.

**Before ship: enumerate every external host the PWA touches at runtime and confirm each is reachable from inside China.** Fonts and STUN are the two the briefs missed; assume there are more.

## 9.4 Audio

**Ship none in v1.** This is a reading product; audio is a multi-megabyte tax on a skill the product does not claim, and the open-corpus licensing is a minefield (§7.2). Common Voice is CC0 but is whole read sentences with no forced alignment — extracting a clean single-word pronunciation is a research project, not a build step.

When audio is added:
- **Pre-render at build time** for the finite item bank using a commercial TTS whose terms grant output rights (Azure, Google, ElevenLabs).
- **Opus at 24 kbps mono**: ~900 items × 1.5 s ≈ **4 MB**, cached in Cache Storage with per-item eviction.
- **Do not rely on the Web Speech API** — the zh-CN voice is frequently absent on iOS Safari and synthesis needs a user gesture, so it fails exactly at a table with mixed phones.
- **Autoplay at reveal only, never during the item** (redundancy). Koh (2024) found learners of the *most* orthographically distant L2 benefit most from reading-while-listening, which is a good argument for adding it in v2, at the reveal.
- If HVPT ever ships: **≥5 distinct talkers per item**, keyed `(item_id, talker_id)`, randomised per presentation, never the same clip twice in a session. That is a ~5× asset multiplier — plan it as a separate, lazily-fetched bundle, not part of the install payload.

## 9.5 Accessibility is a legal constraint, not a preference

The **European Accessibility Act** (Directive (EU) 2019/882) has applied since **28 June 2025** to consumer digital services, via **EN 301 549** incorporating **WCAG 2.1 Level AA**. For a Dutch-published consumer app this converts several §3 recommendations into requirements and settles the colour question on legal rather than evidentiary grounds:

| Criterion | Requirement | Where it bites |
|---|---|---|
| **1.4.1 Use of Colour** (A) | Colour never the sole carrier | Kills tone colour-coding independently of Godfroid |
| **1.4.3 / 1.4.6 Contrast** | 4.5:1 AA / 7:1 AAA | Target hanzi at AAA |
| **1.4.4 Resize Text** | Functional at 200% | `rem` sizing; test the answer-row layout at 200% |
| **1.4.12 Text Spacing** | Tolerate user overrides | Card layout must not clip |
| **2.2.1 Timing Adjustable** | User can turn off, adjust or extend a time limit | **The commit window and the 2 s minimum dwell both engage this.** Ship a "no timers" setting. |
| **2.5.8 Target Size (Min)** (AA) | 24 × 24 CSS px | Floor for chrome; answer rows at 64 px clear AAA too |
| **Lang attributes** | — | `lang="zh-Hans"` on every hanzi, `lang="nl"`/`lang="en"` on every gloss — **get this wrong and the app is unusable with a screen reader and non-conformant** |

The `miniapp` tap-target template (§5, Tier 2) renders at 14–16 px deliberately, which violates any target-size guidance. That is defensible because **small targets are the difficulty being taught** — but it must be a documented, deliberate exception with a non-timed accessible alternative, not an accident.

## 9.6 Build-time gates (the whole list, in one place)

CI fails if any of these trip:

1. Any item-bank codepoint missing from the produced font subset.
2. Any item with a null `explanation`, null `gloss.nl`, or null `gloss.en`.
3. Any `explanation` over 20 words / 120 characters.
4. Any column in the emitted bank with no entry in the provenance manifest.
5. Any field traceable to makemeahanzi `dictionary.txt`.
6. Any stored `stroke_count` disagreeing with Unihan `kTotalStrokes`.
7. Any item containing a heteronym without an explicit per-character `reading`.
8. Any item containing 面/干/发/后/里/松/只/几/表/系/术 with a scalar (rather than list, or hand-authored) `trad` field.
9. Any hanzi element without `lang="zh-Hans"`; any gloss without a `lang`.
10. Any `--hanzi-*` token resolving below 28 CSS px.
11. Latin face failing the `ā á ǎ à ē é ě è ī í ǐ ì ō ó ǒ ò ū ú ǔ ù ǖ ǘ ǚ ǜ` render assertion.
12. Any item whose `interference_set` siblings are scheduled within the same acquisition block.

---

# 10. Open questions and the biggest risk

## 10.1 The single most likely way this design is wrong

> **The co-located format is structurally incompatible with the mechanism that produces the learning.**

Spacing is the largest effect available to this product, and it operates on a **days** timescale. It requires that a player practise on Monday, Thursday and the following Tuesday. A co-located party game is played **when people happen to meet** — a dinner, a weekend, a game night. Fortnightly.

If that is what happens:
- The scheduler never runs. FSRS state is dominated by first exposures. **Default-parameter FSRS in a low-history regime is benchmarked *worse* than a zero-parameter moving average** (0.3629 vs 0.3369 Log Loss) — so the architectural complexity buys a benefit that cannot materialise.
- ~6 well-spaced retrievals per item at a 4-week horizon (§1.9f) becomes ~2.
- The trip-date regime selector has nothing to schedule.
- The item bank, the transfer test, the group-selection objective — all correct, all starved.

And then the solo daily surface is **not "a degenerate case of multiplayer"**, as the architecture recommends. It is the product, and the co-located game is the acquisition channel and the reason people install it.

**Falsification test, cheap and early:** instrument `sessions_per_week` and `days_between_sessions` from the very first cohort, split by mode. If the median inter-session gap in multiplayer exceeds ~7 days while solo sits under ~3, invert the architecture: solo daily is the primary path, multiplayer is the social event that seeds and refreshes the bank, and the marketing changes accordingly.

**Second-order version of the same risk:** even within a session, everyone answering every item is what makes retrievals-per-player-per-minute survivable — but it is also what makes the co-located session ~30 retrievals, against a probable requirement of hundreds. The game cannot carry the load alone even at weekly frequency.

## 10.2 The four next-most-likely ways it is wrong

**a) The register premise may be shrinking under the product.** In urban China the paper menu has been substantially replaced by a QR code and a WeChat mini-program. The core scenario — standing in front of a printed menu decoding characters — is materially less common in exactly the tier-1 cities a Dutch or English visitor will be in. Transit is already bilingual by standard and practice. That leaves labels and shopfronts carrying most of the weight, and the mini-program register (Tier 2, Scene G) may deserve promotion to Tier 1. **The flip side is a better product than the one scoped:** a scan-to-order menu is *digital text*, which means the app could accept pasted or shared text and gloss it live — a different core loop, and one that needs a decision rather than silence. Validate by photographing the actual environments before authoring 400 items against an assumption.

**b) OCR is the real competitor, and nobody named it.** Pleco's live camera OCR reads a menu today, offline, for free — and Baidu, Youdao and WeChat's built-in scan-translate all work natively in China. The honest positioning is not "we compete with Pleco" but "we sell the ability to not need it". That reorders the domains **in the product's favour**: OCR is strongest on a static printed menu and a shelf label, and weakest on a night-time calligraphic fascia, on a scrollable in-app mini-program you cannot point a second camera at, and in time-pressured social moments where taking out a second phone is not viable. **Reframe the promise around speed without lookup** — "order without stopping", not "read the menu".

**c) The transfer gap may be large enough to invalidate the learning claim.** Every in-app number is measured in the training context. If naked-probe accuracy trails in-object accuracy by more than ~20 points, or transfer-test accuracy trails delayed in-app accuracy by a similar margin, the app is teaching plates. §8.1 exists to catch this; the gap must be reported internally from the first cohort, not discovered at launch.

**d) The whole evidence base is unread.** Two independent agents failed to open a single full text. Eight of the effect sizes quoted here were caught wrong by review; several more are graded on recall alone. The specific verification priorities, in order:
1. **Brunmair & Richter (2019)** — is the "words" category L2 vocabulary pairs or L1 free-recall lists? The entire round architecture rests on it, and the semantic-clustering literature cuts against it.
2. **Ingendahl, Halamish & Undorf (2025)** — a 2025 paper graded "strong" without reading, carrying the g = −0.09 that rules on the wager.
3. **Cepeda et al. (2008)** — the actual gap/RI table at short retention intervals.
4. **Wilson et al. (2019)** — the scope of the 85% derivation.
5. **van der Kleij et al. (2015)** — the low-order vs higher-order moderator, which decides whether the mandatory explanation field is evidence or a bet.
6. **Sailer & Homner (2020)** — whether the "narrative beats points" moderator was significant or a discussion point.
7. **GB 7718-2025** — whether allergen labelling is now mandatory, before any in-app claim.
8. **CTW licence terms** — whether NC blocks a commercial frequency derivation.

Half a day with a library login. Nothing here costing more than a day of engineering should proceed without it.

## 10.3 Genuinely unresolved — no answer exists in the literature

1. **Group item selection with N simultaneous learners on one shared stimulus.** No library, no benchmark, no directly-on-point paper. The nearest published work is *single-learner session-level* selection (Tabibian et al. 2019, PNAS; Upadhyay et al. 2021, npj Science of Learning — the latter a randomised field trial with released data). Read both; treat the group extension as the open part, which it is. Keep `pickItem` pure and stateless so the objective can be swapped and the counterfactual logged.
2. **Does public failure suppress subsequent participation in an L2 game?** Nobody has tested it. The inference chain (FLCA → willingness to communicate → Kahoot self-report) is adjacent literatures, not a controlled test. **You can answer this in-product at n≈200** with the logging in §8.5, and it would be a genuine contribution.
3. **Is the gloss cost better public or private?** The brief's signature mechanic — "make the gloss cost points, in public" — directly contradicts its own finding that public punishment ends a game night, and the predictable failure is that a beginner stops requesting glosses and starts guessing, converting a retrieval attempt into a coin flip while the score still moves. **Ruling for v1: cost yes, visibility no.** Ship the public variant behind a flag, default OFF for any table containing a first-time player, and A/B it first.
4. **Dutch L1 specifically.** No study of Dutch–English bilinguals learning Mandarin exists. No Dutch-specific character-acquisition research exists. The only Dutch-specific work located is on tone perception. The gloss-language rule (§6.3) is the weakest-evidenced decision in this document and the one your own A/B can settle fastest.
5. **Optimal round length for a co-located learning game.** The 30-round / ~10-minute figure is assembled from microlearning (weak), spacing (about between-session gaps, not within-session length) and time-pressure evidence. It is a synthesis, not a measured optimum.
6. **Whether object-realistic card templates help or induce logo-style recognition** (Masonheimer, Drum & Ehri 1984). This is the most expensive part of the visual design and the evidence is genuinely contested. Instrument the naked probe from v1 rather than adding it later.
7. **CJK legibility on modern high-DPI phones.** Every source is 15–25 years old and predates retina displays. The §3.1 type scale is engineering judgement corrected for the units error; **validate it with a physical test using the actual subset font on the oldest supported phone, in a dim room, before locking it into the design system.**
8. **Phonetic-series predictiveness.** **[MEASURED]** In the top 1,000 characters a phonetic component predicts the full reading (segments + tone) only ~**17%** of the time and gives no cue at all ~**35%** of the time — reliability roughly doubles by the full dictionary (~34% exact), because the head of the frequency distribution is where the phonetics have eroded most. So the "order the bank by phonetic series" recommendation is a **design bet, not a finding**, and it is worth *more* at intermediate level than at beginner level — the opposite of where it would be surfaced. **Run the three-way test (exact / segmental-only / no cue) over your own 1,200 characters before committing content-authoring weeks. If exact + segmental is below ~50%, the effort belongs in the semantic-component column instead.** Related and equally decision-relevant: only ~53% of the top 1,000 are phono-semantic compounds at all (vs ~80% script-wide), only ~45% are left-right, and only ~31% are both — so a two-slot meaning/sound card is a **conditional layout selected off a stored structure enum, never the default.**

---

## Appendix — the twelve decisions that gate everything else

| # | Decision | Ruling | Reversible? |
|---|---|---|---|
| 1 | Content spine | **Own signage/menu/label corpus, ordered by domain frequency.** HSK band and 通用规范汉字表 tier as blended secondary signals, never as the primary key. | Expensive |
| 2 | Item schema | Two decomposition fields; `reading` per (char, word); `trad` as a **list**; `interference_set` ≠ `confusion_set`; non-nullable `explanation`. | **Cheap now, very expensive later** |
| 3 | Script | **Simplified only in v1.** Store traditional as a list. Segment the bank: transit may assume Hei; shopfronts may not. | Expensive |
| 4 | Scheduler | ts-fsrs FSRS-6, **pretrain-4**, per (player, item, direction). No optimiser. **No neural knowledge tracing — decision written down with citations attached.** | Cheap |
| 5 | The bet | Keep as a **difficulty commitment**. Replace pinyin scaffold with component/context. Gate tier on exposure. Discount grade by tier. Timers 12/15/20 s. | Cheap |
| 6 | Answering | **3 options.** Private, simultaneous, blind commit. Everyone answers every item. No streak-keeps-turn. | Moderate |
| 7 | Resolution | Task-level public, self-level private. Hanzi alone 800 ms → gloss → photo. 2 s minimum dwell. Score delta ≤14 px, uncoloured. | Cheap |
| 8 | Colour | **Never on linguistic content.** Chrome only. Light default, `prefers-color-scheme` honoured, AAA on target hanzi. | Cheap |
| 9 | Units | **160 CSS px/inch.** 28 px hanzi floor, 44 px options, 72 px prompt, 64 px answer rows. | Cheap |
| 10 | Fonts | Self-hosted Noto Sans SC subset (~164 KB @1,200 chars) with a CI gate. Never Google Fonts. Renamed family. | Cheap |
| 11 | Transport | Host candidates only, empty `iceServers`, QR join, star topology, pass-and-play fallback. Transport-agnostic reducer. | **Expensive if wrong** |
| 12 | Measurement | Held-out transfer test on unseen real signage at d7/d28, reported beside the in-app number. Experiment harness in week one. | Cheap now |

**Ship no audio, no handwriting, no stroke graphics, no tone, no leaderboard, no CEFR claim, no coverage percentage, and no efficiency claim in v1.** Each of those is either unevidenced, legally encumbered, multi-megabyte, or all three — and every one of them is a decision you can defend with a citation from this document.