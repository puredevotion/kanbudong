# 3. Rulings on the five design decisions

## 3.0 How to read these rulings

Every line below belongs to one of two registers, and the register is stated: **[E] evidence-licensed**, with the source and its scope, or **[J] judgement call**, with an owner and a planned test. This split is itself a directive from the digests — the adversarial pass graded an entire hard-number layer as folklore precisely because it was typographically indistinguishable from the findings layer, and the prediction was explicit: "'≥5 exposures, per Horwitz et al.' will be in the codebase within a week."

Four verdicts were returned per decision, one per cluster, and they do not always agree. Where they diverge I say which one binds and why. Where the divergence is a genuine live disagreement rather than a resolvable one, it is instrumented, not decided.

---

## 3.1 Decision 1 — "The bet is how much scaffolding you give up"

*(+1/−1 shows pinyin and English options; +5/−3 removes pinyin; +15/−10 makes all four options Chinese signs.)*

**Ruling: CONTRADICTED.**

Cluster verdicts: learning-science *unsupported*; chinese *contradicted*, with sub-decision 1b (all-Chinese options) *contradicted*; interface-social *unsupported*, with 1b independently *contradicted*; systems *supported* — but only as a handicapping mechanic, and with three measurement consequences it rules wrong as specified.

Three of four clusters land against it and the fourth supports something the decision does not actually claim. This decision was invented rather than derived, and the evidence does not rescue it. Note carefully what the systems cluster endorsed: "As a HANDICAPPING mechanic it is the right answer" — mixed ability at one table is the hardest problem in a co-located language game, board games solved it with bidding, and an invisible bid is what makes a handicap socially acceptable. That is an endorsement of *betting*. It is not an endorsement of *betting as the scaffolding dial*.

### Why it fails

**(a) The ladder is inverted.** [E — strong] The +15/−10 tier removes the only mechanism that makes multiple choice defensible in this product. MC survives here on transfer-appropriate processing: the criterion task is *see hanzi in the world, know what it means or what to do*, which MC mirrors when the stem is hanzi and the options are meanings in Dutch or English. Make all four options Chinese and the task becomes hanzi-to-hanzi visual matching, solvable by glyph pattern-matching without ever accessing meaning. It simultaneously maximises lure exposure at the tier where the learner is least equipped to reject lures — where the negative suggestion effect is largest and where the exculpatory mechanism (retrieving *why* each alternative is wrong) is absent. The top tier therefore deletes the benefit and amplifies the cost. (Roediger & Marsh 2005; Little, Bjork, Bjork & Angello 2012 — both lab, English prose / general knowledge, short delays; neither run on hanzi.)

**(b) There is no experiment on fading pinyin at all.** [E — the digests state this as an absence of evidence, twice, independently] The scaffolding ladder is an untested design. What *does* exist points elsewhere: PARTIAL on-screen pinyin beat both full pinyin and no pinyin for more experienced learners (Wang & Kalyuga 2010, CHB — expertise reversal for multimedia redundancy, not a phone study). That keys fading to *measured competence on this learner and this character*, not to how brave someone feels at the moment of betting.

**(c) Desirable difficulties reverse.** [E — strong] They reverse for high-element-interactivity material and with expertise. A top-tier bet in a category where the player holds no component knowledge is not a difficulty, it is a coin flip. A difficulty is desirable only if the learner can actually execute the effortful process.

**(d) The "safe" tier carries the transfer risk, and the design never says so.** [E] The +1/−1 tier shows pinyin *and* L1 options — a training-only cue absent from every real menu and metro plate. That is the guidance-reversal configuration the design correctly bans for tone colour and radical highlighting, reintroduced at the bottom rung under a different name. Note the honest limit: the claim that pinyin *actively harms* reading is **not** established. It rests on a handwriting study (Guan et al. 2011) that never ran the contrast, and there is a live counter-literature in which pinyin knowledge positively predicts L2 character reading. The objection is "it does not build the target representation and a better scaffold is available", not "it is harmful."

**(e) A structural conflict nobody flagged.** [E — systems cluster] The bet is chosen *before* the item is seen and *by the player*, so difficulty is self-selected. A pacing controller cannot target a retrievability through a channel the player owns, and a self-selected tier is not random assignment, so outcomes are confounded with player confidence. You cannot have both a player-owned bet and a system-owned difficulty controller working through the same variable.

**(f) The guessing floor invalidates the denomination.** [E — arithmetic identity] P(correct) = R + (1−R)/k. At k=4 the floor is 25%, so the score the bet is denominated in overestimates real reading. Holding observed accuracy at 0.85 gives true R = 0.700 in 2AFC, 0.800 in 4AFC, 0.850 in free recall — the weakest players on the easiest format sit at the *lowest* true retrievability, the exact inverse of intent.

**(g) Do not stack pressures.** [E — moderate] Time pressure costs accuracy at d ≈ 0.35 over and above making people faster, and hits difficult items and high-ability players hardest (Journal of Intelligence 2023, Raven's Matrices — not L2 reading).

### What replaces it

1. **The bet becomes a points stake and a handicap. Nothing else.** It stops being defended as a learning intervention. [E]
2. **Response format is a function of the scheduler, never of the wager.** Adaptive difficulty moves entirely to *item selection*: opponents choose the CATEGORY, the engine chooses the ITEM within an Elo band of the target player, targeting ~75% success (Klinkenberg et al. 2011, Math Garden — arithmetic, Dutch schoolchildren, national scale; production-proven, not L2, not co-located). This replaces the invented "≥5 prior exposures" gate, which was graded folklore. [E — moderate]
3. **Meaning-side options stay in Dutch/English at every tier**, so the criterion task is constant across tiers. [E]
4. **Escalate difficulty by raising retrieval demand, never by changing what is retrieved:** remove pinyin, raise distractor competitiveness within the visual-neighbour and situational-neighbour sets (gated on consolidation — see §3.4), use harder real substrates, or drop to a two-option forced discrimination against the single best confusable. [E]
5. **Scaffolding fades on measured per-item competence**, not on courage: full ruby for an item's first ~3 exposures, then partial ruby on only the characters that item's error history flags weak, then none. Store `exposureCount` and `perCharacterErrorRate`. The **~3** is [J]. The *shape* is [E — Wang & Kalyuga].
6. **Ship the pinyin-to-component scaffold swap as a flagged A/B, graded weak.** [E — the digests are explicit that nobody has run this contrast]
7. **Three options, not four.** [E — strong] Rodriguez (2005), random-effects meta-analysis over 80 years: three options optimal, more items per unit time with no psychometric loss — *but only if the retained options are the effective ones*. Random removal reduces difficulty, discrimination and reliability. This is the single strongest psychometric claim in play, it lowers the guess floor from 25% to 33%… no: it *raises* it to 33%, and that is the price. It buys more items per round, full-width thumb-zone rows, and less lure exposure. **Note the knock-on:** the chinese cluster's reveal directive specifies a *four*-row table because it assumed four options. It becomes a three-row table. The chinese cluster's 2×2 grid layout dies with it.
8. **Preserve the two things around the bet that are real.** Committing before the reveal is a **pretest/prequestion**: g = 0.66, classroom/instructional, *strictly item-specific* (no benefit for other material in the same activity), and it requires corrective feedback to exist at all. [E — strong] Consequences: narrow the dealt category to prequestion granularity — "signs on a subway platform", "weight and price on a market label", never "Transport" — and never leave a bet unresolved. And keep scoring such that guessing stays attractive: a wrong guess before feedback is productive. The confidence value routes feedback via **hypercorrection**: persist `bet_tier` and `was_correct`, and drain a `high_confidence_miss` queue in the session's final round. Be honest in the doc that this is within-session massed repetition defended on hypercorrection grounds only, never as good scheduling. [E — moderate]
9. **Logging and scheduling:** log +1/−1 (fully scaffolded / 2-alternative) outcomes with `role: exposure` and do not advance FSRS stability on them. Store `format_tier` and `n_alternatives` on every review row. Express any accuracy target in retrievability, never in observed accuracy: to hit true R = 0.85, target observed 0.925 in 2AFC, 0.8875 in 4AFC, 0.85 in free entry. [E — strong, arithmetic]
10. **Never let the harder tier carry the shorter timer.** [E]
11. **Grey unearned tiers with an explicit "unlock by…" line** rather than hiding them; gate the top tier on per-category component mastery. [J]

### Rationales deleted from the design document

The dopaminergic-curiosity "neural warrant"; the memory-palace "explicit binding" analogy; "MC beats recall" (the g = 0.70 vs 0.48 contrast is a between-study moderator confounded with final-test format — Rowland's moderator puts recognition/MC at g ≈ 0.36 against free recall 0.79–0.82, so the mechanic sits in the weakest cell on both axes); and the Duolingo 112–141 hours anchor (Spanish and French, no Mandarin data, retracted).

---

## 3.2 Decision 2 — "Items render as the physical object they appear on"

*(Station plate, printed menu section with prices, shopfront fascia, shelf-edge price label, hazard board — two treatments deliberately hard to read because real ones are.)*

**Ruling: SUPPORTED for transfer. UNSUPPORTED as a memory intervention. The "deliberately hard to read" clause is CONTRADICTED and is struck.**

Cluster verdicts: learning-science *supported* — but on a different mechanism than the design assumed, and "the mechanism determines the spec"; interface-social *unsupported* as a memory intervention, with 2b *contradicted*; systems *no-evidence* on the pedagogy but *contradicts* the obvious implementation.

This decision was also invented. What survives is narrower than what was proposed, and the rationale change is not cosmetic — it changes the build.

### What is dead

**Context reinstatement is dead as a rationale.** [E — strong] Environmental context-dependent memory pools at d ≈ 0.28 (93 effect sizes / 75 studies); a 2026 meta-analysis gives g = 0.32; it is attenuated or eliminated by outshining when strong semantic cues exist; and Godden & Baddeley found a substantial effect for free **recall** (1975) and essentially **none for recognition** (1980). This product is recognition throughout. The flagship demonstration failed replication. Separately, the rendering is not environmental context at all — it sits *inside* the stimulus at both study and test.

**Picture superiority / dual coding is retracted as applied.** [E] It compares memory for items *studied as pictures* against items *studied as words*. Here the to-be-remembered item is an orthographic form in every condition; photographing it onto an enamel plate changes the surround, not the stimulus format. And picture superiority is eliminated when physical distinctiveness is equated, so Paivio's explanation is not even the leading account.

**"Deliberately hard to read" is folklore.** [E — strong negative, flagged independently by three agents across two workflows] Sans Forgetica failed in four experiments plus independent replications (Taylor, Sanson et al. 2020); Wetzler, Pyke & Werner 2021 replicated the null; Meyer, Frederick et al. 2015 found large-sample nulls for problem solving. Difficulty that helps comes from **retrieval demand**; difficulty from degrading the pixels does not. There is also legal exposure: a deliberately low-contrast or degraded target glyph fails WCAG 1.4.3, which under the EAA is not a style debate.

### What survives, and what it licenses

**Transfer-appropriate processing plus encoding specificity.** [E — strong] The effective retrieval cue is *the character form as it will be met*. A learner who only ever encodes 出口 as clean black Song on white has encoded a different stimulus from a white-on-green backlit plate.

**Typeface class is the part that genuinely varies in the wild.** [E] Mainland shopfronts, menus and packaging use 楷体, 隶书, 行书, 宋/明, condensed and expanded Hei, neon and hand-painted forms freely; only transit and road signage is standardised. CTW's annotation schema carries a dedicated **`wordart`** attribute precisely because decorative display lettering is prevalent enough in real street-view Chinese text to need its own class.

**Perceptual variability is a cheap default, not a validated mechanic.** [E — moderate, heavily scoped] Pelzl (2025): variable-typeface training in a logographic script was *slower* on the familiar typeface and *faster* on a novel one — but n = 190, 24 characters, six exposures, **single session, no delayed test**, effects of one-to-two words of accuracy and a few hundred ms of RT. The "at least three typefaces per word" numeric floor is struck as invented.

### The documented risk

**Masonheimer, Drum & Ehri (1984, n = 102):** confident environmental-print "reading" is driven by the whole visual gestalt rather than the letters, and did not predict decontextualised word reading. Applied here: a learner who has only met 出口 in enamel-blue metro styling may be recognising the plate, and may fail on 出 in 出发, 出租, 出售, 支出. Neumann et al. (2011) report mixed or null incremental effects for environmental print once general print knowledge is controlled. **This is the most expensive part of the design and the evidence is genuinely contested — instrument it from v1.** [E]

### Required changes

1. **Every template is built from type and CSS in the licensed subset font. Never from a source photograph.** [E] Menu layout and typography, dish photography, package artwork and shopfront logos are protected expression carrying live trademarks, and a Dutch controller collecting them engages GDPR and PIPL. In-situ photographs frequently contain identifiable people. Legal review *before* content authoring, not after.
2. **Fidelity of the SIGN matters; fidelity of the SCENE buys nothing and costs retention.** [E — strong] Typeface, stroke weight, spacing, contrast, substrate and real colour inversions: yes. Photographic street backgrounds, atmospheric gradients, steam off the bowl, crowds, perspective warp: no. These are **seductive details**, and the effect is *stronger under limited study time* — exactly the condition a timed, socially watched card creates (Rey 2012; Sundararajan & Adesope 2020, meta-analytic). **One test per pixel: does it constrain the meaning of the target?** The ¥ and the number on a price label pass — they make 斤 a unit. The station plate's arrow passes. Ambience fails.
3. **"Deliberately hard to read" is rewritten as:** a hard-to-read treatment ships **only** when it faithfully reproduces signage the player will actually encounter — a weathered fascia, a grimy label, a low-contrast neon — and **never as a difficulty manipulation**. The target glyph clears the contrast floor in every treatment (§4.4). "Perceptual disfluency" goes on the banned-rationales list so it cannot return in six months.
4. **Vary typeface CLASS per object template** — heiti/sans for transit and hazard, songti/serif for printed menus, heavy display for fascias, condensed sans for price labels — rather than chasing photographic fidelity. [E]
5. **Schedule rule: "do not repeat the substrate this item was last seen on", across its own repeat exposures.** [E] **Drop** the enforced within-round substrate non-repetition rule: a round of maximally distinct items is a pure list in which distinctiveness effects disappear, and real signage is substrate-homogeneous within a category, so the rule trains against the very percept the TAP argument says to match.
6. **Forced transfer** (already binding from §9–12, restated here as the reason it exists): `contexts: Set<TemplateId>` with graduation gated on `contexts.size >= 3`; a naked probe at 10–15% of presentations; the naked-probe-minus-in-object delta reported internally from the first cohort, with **>20 points meaning the app is teaching plates**. Add a **wrong-object probe** (出口 in the fascia template instead of the transit plate) and an **Xepsi-style foil** — a visually near-identical wrong character in the *correct* object styling. [E]
7. **Add `render_variant` to the attempt record** so variability-trained items can be compared against single-face items. Instrument the object-vs-plain A/B from v1. [E]
8. **Photographs, if any, go on the reveal side only, never co-present with the prompt hanzi**, and are never mandatory. Add `picturable: bool`: a large share of the signage domain is not picturable (禁止, 请勿, 优惠, 注意, 小心, 免费, 营业中, 暂停服务), and for those, a photo *of the sign* turns the task into photo-to-photo matching, which inflates in-app scores and does not transfer. [E — the overshadowing mechanism is a hypothesis to instrument; the picturable split is unambiguous either way]
9. **Rebalance the domain pillars away from transit.** [E on the mechanism, J on the weights] Metro signage is systematically bilingual and romanised — a learner who cannot read 换乘 will read "Transfer" printed underneath it. Meanwhile GB 7718 is a *mandatory* standard requiring Chinese on food labels and capping foreign type at no larger than the Chinese, so product labels are functionally Chinese-only, and shopfront fascias are unregulated and overwhelmingly Chinese-only outside tourist strips. Proposed v1 weights **market 30 / menu 30 / street 20 / safety 15 / transit 5** are a **[J] guess with no empirical basis in encounter frequency** — nobody has measured how many signs of each type a visitor reads per day — to be replaced by measured encounter rates. Put a one-line justification in the app ("the metro is already in English; the noodle shop is not"), because the ordering is counter-intuitive and players will otherwise think the bank is broken.
10. **Surface the traditional counterpart on the reveal for high-divergence signage characters** (门/門, 车/車, 面/麵, 药/藥, 饭/飯, 银/銀) in the shopfront-fascia template only. [E] Chinese language law permits 繁体字 for calligraphic and handwritten shop signs, and fascias exploit that constantly. Store `tradVariants[]` as a **nullable list plus a word-level override table**, never a single nullable column: 277 of 4,013 simplified characters map to two or more traditional forms, concentrated in exactly this domain (面→麵/麪 vs 面, 发→發/髮, 干→乾/幹/干, 后→後/后, 里→裏/裡/里, 松→鬆/松). A one-to-one mapping generates 頭發 for 头发 and 牛肉面 for 牛肉麵.

---

## 3.3 Decision 3 — "The component breakdown is the main teaching surface"

*(Promoted to the body of the reveal, advanced only by an explicit tap: 牛肉 → 牛 + 肉; swap the head for 猪/羊/鸡/鸭肉; then 肉 flattens to 月, giving 肝 肠 肚 腰 脑.)*

**Ruling: SUPPORTED on placement. "Main teaching surface" is an over-claim and is demoted to "the reveal's primary optional layer". The worked example's 月 claim is CONTRADICTED — see the sub-ruling in §3.3.4.**

All four clusters support it. Learning-science calls it "the best-supported decision in the product, and the only element with evidence for GENERALISING to unseen items." This is the one decision that was derived rather than invented, and it shows.

### 3.3.1 Why the placement is right

Explicit radical instruction works **as content** and transfers to untaught characters: a three-week course covering orthographic knowledge plus ≥7 radicals/week produced gains in phonetic-radical awareness, semantic-radical awareness and orthographic knowledge, with learners transferring the strategy to infer meanings of **untaught** characters containing **untaught** semantic radicals (Nguyen et al. 2017, n = 54, quasi-experimental; Chen et al. 2013, N = 129, 3 weeks). It was demonstrated using precisely a four-option contrastive format holding one component constant and varying the meaning-bearing one — exactly the 肉 → 肝/肠/肚/腰/脑 move. Morphological awareness is the largest single contributor to L2 Chinese reading, outranking working-memory capacity. [E — moderate]

Decorating the glyph **at recognition time** hurts: radical colour markings increased RT and decreased accuracy, and stroke-order animations decreased accuracy; neither affected character-*meaning* matching (Hou & Jiang 2022, N = 40 alphabetic-L1, abstract-only). Colour coding independently slowed absolute beginners (Li, Shi & Wang 2025, N = 183, abstract-only). [E — moderate]

Teaching the system as content works; annotating the character during a timed recognition round does not. **A tap-gated post-answer reveal surface is the resolution of that apparent contradiction**, and the explicit tap is correct for an independent reason: it keeps reference material off the integration path.

### 3.3.2 Why "main teaching surface" over-claims

**(a) The compositional path does not cover the early bank.** [E — strong, computed in-session over makemeahanzi × frequency] In the top 1,000 characters: 53.1% pictophonetic, 37.8% ideographic, 9.1% pictographic. Pictophonetic share by frequency band: ranks 1–100 = 28.8%, 101–300 = 37.7%, 301–600 = 53.0%, 601–1000 = 66.3%, whole dictionary = 77.1%. In the literal first 50 characters only 12/50 are pictophonetic — 一 是 人 了 不 大 中 国 do not decompose into meaning + sound. **Roughly 47% of the core bank needs a non-compositional path.** The widely quoted "~80–85% of characters are phono-semantic" is a whole-script figure and is a myth as applied here.

**(b) The two-slot meaning/sound card describes far less than claimed.** [E — strong] Top-level ⿰ (left-right) is 30.0% of the top 100, 40.0% of the top 600, 44.8% of the top 1,000. The intersection a two-slot card honestly describes — left-right **and** phonetic — is **13.0% of the top 100, 24.2% of the top 600, 30.7% of the top 1,000.** Hsiao & Shillcock's ~72% is 72% *of phonograms*, not of all characters; the denominator was swapped. Semantic-component-on-the-left within left-right phonetic compounds is 89.9% dictionary-wide but only 76.8% in ranks 1–300.

**(c) The phonetic half is a design bet, not a finding.** [E — strong, computed] In the top 1,000 (n = 438 scored): exact match including tone **16.9%**, segmental-only 21.7%, rime-only 26.0%, **no cue at all 35.4%**. The hint is fully right about one time in six and useless about one time in three. Reliability roughly doubles between the top 1,000 and the full dictionary — so the feature is worth more at intermediate level than at beginner level, the opposite of where it would naturally be surfaced.

**(d) The reveal card is heading for overload.** Component tree + confusable + image + pinyin + audio + score delta + say-it-aloud prompt is seven competing elements in a few seconds of party-game reveal.

**(e) Radical awareness develops with exposure.** Alphabetic-L1 learners process hanzi holistically at first, so front-loading 40–60 radicals teaches meaningless shapes.

### 3.3.3 Required changes

1. **Demote to "the reveal's primary optional layer."** Element budget by integration load: **one target, one decomposition, one contrast** — everything else behind the tap. Justified by element interactivity, split attention and redundancy (Sweller; Mayer) plus expertise reversal, **not** by Cowan's ~4-chunk limit, which is graded folklore as applied here (a screen whose elements all remain visible imposes essentially no storage demand — the display *is* the memory). [E]
2. **The reveal card thins out as the item's accuracy record improves.** [E — expertise reversal]
3. **`transparency` enum per multi-character item** (transparent | semi | opaque): 牛肉 and 出口 branch to a component gloss; 东西 and 麻烦 get an explicit "this one does not decompose — learn it whole." **Never render a bogus decomposition.** [E]
4. **`structure` enum per character**, and select the reveal layout from it. Never render a meaning/sound split for a character that is not a left-right phono-semantic compound. Budget at least four layouts: left-right, top-bottom, enclosure, atomic/unanalysable. [E]
5. **Split the schema:** `word_decomposition` (morphemes + gloss) and `character_decomposition` (semantic component, phonetic component, transparency of each). 牛肉 = 牛 + 肉 is word-level; 河 = 氵 + 可 is character-level; one boolean cannot express both. [E]
6. **Per-component `role`** (semantic | phonetic | neither) **plus a computed reliability field.** Suppress the phonetic hint entirely for the ~35% no-cue set; never let copy imply a rule. The cue field is TYPED — `semantic_radical | contrast_character | position_in_compound | phonetic_hint` — with `phonetic_hint` optional and **individually hand-verified, never auto-generated**: a wrong hint delivered as "elaborated feedback" in the protected resolution moment is worse than no elaboration. [E]
7. **Mark every gloss `etymological` or `mnemonic-only`** against a scholarly reference, and label it in the UI. Most characters are phono-semantic, so any system supplying a picture-story for every character is fabricating for the majority; repeating Chineasy-style false etymologies is a known reputational liability. [E]
8. **Ship a non-compositional path**: pictographic/ideographic origin, or an explicit "no useful decomposition, learn this whole" state, with `isCompositional` (出口 yes; 保质期, 时价, 招牌, 方便面 no). Report the split honestly in the progress display: *"you can work out 61 of these; 44 you have to memorise."* [E]
9. **Render the breakdown SPATIALLY inside a square frame** (left/right, top/bottom, enclosure) rather than as a linear "出 + 口" string — justified by positional regularity being implicitly acquired by CSL learners, **not** by neuroimaging (the fMRI-of-expert-readers justification is struck). [E — moderate]
10. **The decomposition unit is components (2–5 per character), never strokes.** Chunking is what makes a character fit in working memory; strokes add elements without adding structure. No stroke-order animation anywhere in the answering loop (and none in v1 at all, per §9–12's Arphic Public License ruling). [E]
11. **Sequencing:** meet a component inside a whole sign **before** naming it. Store `component_first_seen_at` per user per component to drive the "you have seen 肉 before" callback. Reserve the component-contrast card type for items already consolidated. Introduce the component layer as a second pass after ~50–100 characters of whole-form exposure (**~50–100 is [J]**). **Do not let the radical layer gate the scheduler** — store the fields from item one, they cost nothing, just do not let them block presentation. [E]
12. **Ship directional-complement signs as atomic whole units** — 入口, 出口, 上车, 下车, 进站, 出站, 过街, 回收 — tagged `atomic`, never decomposed into a complement analysis. Signage is a subjectless, function-word-free telegraphic register. [E]
13. **Provenance gate (from §9–12, restated because it binds this decision):** decompositions are authored in-house; Unihan `kRSUnicode` seeds the semantic radical only; makemeahanzi is LGPL and stays out of the build entirely. CI fails on any field traceable to `dictionary.txt`. Derive `strokeCount` from Unihan `kTotalStrokes` and assert at build time — every hand-authored stroke count in the source sweeps was wrong.
14. **Reading is a property of a token in context, not of a character.** Add `reading: [{char, pinyin}]` and `has_variant_reading`; CI-fail on any heteronym without an explicit per-character reading. 39.4% of Tier-1 characters carry more than one Unihan reading; 行 is háng in 银行 but xíng in 行李寄存; 地 is dì in 小心地滑 but *de* as an adverbial marker. **Never ask for a character's pronunciation in isolation.** [E — strong, computed]

### 3.3.4 Worked sub-ruling: the 月 / ⺼ correction

**The unlock names the wrong character, and it fails silently.**

**The fact.** [E — strong, verified independently in-session against makemeahanzi, 9,574 entries] The component in **肝 肠 肚 腰 脑 肺 肾 胗** is **⺼, U+2EBC, CJK RADICAL MEAT, Kangxi radical 130 (肉)**. It is **not** 月, U+6708, the moon character, Kangxi radical 74. **期** and **朋** carry the real 月 U+6708. They are homoglyphs in almost every font and different codepoints.

**Why it is not a typo but a build defect.** A string match or regex on 月 to apply the component accent colour highlights **zero** of the five characters in the worked example, and fires instead on **期** — which sits inside **保质期** (best-before date), a Tier-1 supermarket item. The rule as stated would teach a learner that a shelf-life label contains a body part. It produces no error, no exception, no failing test: it silently teaches the wrong thing.

**Three corrections to the card, which otherwise stays.**

1. **Teach the component as ⺼ (U+2EBC).** Key all highlighting off a **stored per-item component field**, never off a substring match on any character. This is not advice; it is the only implementation that is correct.
2. **Fix the prose.** 肉 does not "flatten to 月" — it has a *distinct bound form*, ⺼, which is a different codepoint with a different Kangxi radical. The looser gloss also misfires on 期 朗 服 有 望, where the component is the moon or a graphic merger.
3. **Fix the exception list**, which was wrong twice. **血, 皮 and 舌 do NOT carry it** (their radicals are 血, 皮 and 舌 respectively; 舌 is ⿱千口). **筋** carries it inside 肋 (⿱⺮肋, where 肋 = ⿰⺼力) but takes **⺮ (bamboo)** as its Kangxi radical.

**What stays as-is.** The 牛肉 → 猪肉/羊肉/鸡肉/鸭肉 head-swap is clean, is semantic compounding, is a paradigm rather than a mnemonic, and makes no claim about pronunciation. Keep it verbatim.

**Extend the same pattern to the two other high-yield clusters this bank actually has.** [E — verified in-session against makemeahanzi radical counts]

- **火/灬** — the radical of **9 of the 13 core cooking methods**: 炒 爆 炸 煮 烤 焖 炖 烧 煎. (蒸 contains 灬 inside 烝.) This is the highest-value radical for menu reading in the entire bank.
- **饣** — 43 common characters (饭 饿 馆 饺 饼 饮 馒 饥 饱 饲 …), against **12** for 食, which are mostly traditional or rare (食 飧 飨 餍 餐 餮 饔 饕). **A learner taught "食 is the food radical" will not recognise it in 饭馆 or 饺子** — precisely the words the product targets. 餐 does contain 食, but as a bottom component, so it does not rescue the choice. The same trap applies across 讠/言, 钅/金, 纟/糸, 见/見: validate the whole onboarding radical list against **simplified component forms**, never dictionary or traditional head forms.

**Two further corrections to the radical onboarding list, from the same source:** **男 is not a radical at all** (it is 田 + 力 and indexes under one of those), and **页** (from 頁, head) yields 顶 顺 须 顾 颈 项 领 颜 额 题 — essentially zero menu or signage payoff.

**Build gates this correction generates.**

- CI fails on any highlight rule expressed as a substring or regex match on a character rather than a component id.
- CI asserts that no item containing 期 (保质期, 生产日期) is tagged with the flesh component.
- **The font subset's codepoint set must be the union of every item string AND every component id referenced by any decomposition record.** U+2EBC lives in the Kangxi Radicals block and appears in *no* item string, so a naive extraction over the bank's text will drop it — and the decomposition panel will then render tofu, or worse, fall back to a face that substitutes 月. Assert U+2EBC's presence in the produced subset explicitly. If Noto Sans SC's Kangxi Radicals coverage turns out to be incomplete, render the component from a stored glyph reference — **never substitute 月**, which reintroduces the exact error this ruling exists to remove.

---

## 3.4 Decision 4 — "A confusable is shown beside the target on resolution"

*(入口 beside 出口, 公斤 beside 斤, 麻 beside 辣.)*

**Ruling: SUPPORTED — but for a narrower claim than the decision states, covering one of its three worked examples, and only with four dependencies encoded. The underlying question is genuinely contested and must be instrumented, not argued.**

Cluster verdicts: learning-science *supported*, "and the answer is IT DEPENDS — on four variables"; chinese *supported* with three scope corrections; interface-social *supported*, conditional on consolidation state; systems *no-evidence* (defers the pedagogy) but binds three implementation constraints.

This decision was invented rather than derived, and "supported" is doing less work than it looks. Read what is actually supported.

### What the evidence covers

**One study, on point:** simultaneous **paired presentation** of visually similar characters improved discrimination of subtle stroke differences in **absolute beginners with non-tonal L1s** (Li, Shi & Wang 2025, N = 183, **abstract-only, no full text read in any cluster**). The same experiment found colour coding *slowed* them. Characters differing by an **added stroke** (日/白) were easier than **identical-stroke** pairs (人/入). [E — moderate]

**Interleaving supplies the mechanism and the meta-analytic weight:** interleaving helps most for inductive learning of **visually similar** categories, via discriminative contrast, and least for expository text (Brunmair & Richter 2019). Visually confusable hanzi are the paradigm case of the moderator that makes interleaving work — though the meta-analysis is not on hanzi. [E — strong]

**Independently, the panel is the required mitigation for a cost the design never named.** Taking a multiple-choice test increases later production of the **lures** as answers: 5% when not previously tested, rising to **12% a week after testing** (Roediger & Marsh 2005; English prose, university samples). Immediate corrective feedback is the established fix, and immediate and delayed feedback are **equally effective at cutting lure intrusions** (Butler & Roediger 2008). Budget **~7 percentage points of lure intrusion as the price of MC**; the net effect is still positive. Showing the confusable beside the target on resolution does both jobs at once. [E — strong]

### What the evidence does not cover — do not let this slide

**The three named examples are three different problems, and the cited mechanism covers only one.**

- **入口/出口** — form-and-meaning antonym pair sharing a character. The strongest case, and it is core signage vocabulary the adversary independently nominated as a confusion that causes real failure. But see below: *the antonym direction is itself contested*.
- **公斤/斤** — an arithmetic/semantic trap with **no form similarity**. It is justified by *consequence*, not by the discrimination literature. Do not cite Li & Shi for it.
- **麻/辣** — a semantic contrast with **no form similarity at all**. The digests call it "the easy one." Do not present it as an instance of the same principle.

**The antonym case may be the easy cell, not the hard one.** [E — genuinely contested] Intralist-similarity work puts antonyms among the worst; but the similarity/difficulty function may be **non-monotonic** — strongly pre-associated response sets (antonyms, strong free associates) can be learned relatively easily because the pre-existing association mediates, while *moderately* similar sets (coordinates, connotative-only similarity) are the damaging ones. On that reading 入口/出口 falls in the **easy** cell and 麻/辣 is the harder one. The same 1963 study is cited with **opposite valences in two places in the same brief**, and nobody in the evidence chain has read the primary paper. **Ruling: do not treat 入口/出口 as the maximal-interference case, and do not present staged introduction as a prediction derived from classical transfer theory — it is a precaution.**

**The interference-vs-contrast question is unresolved.** [E — contested, both clusters] Interference: shared cue + antagonistic responses is the classical maximum-damage structure; form similarity *always* increased confusion errors in L2 vocabulary; MC lures are later misremembered as correct. Contrast: juxtaposition is the active ingredient in interleaving, temporal separation destroys it, and paired presentation improved beginner discrimination. The bridge is broken either way: the classical work describes learning two *new* competing responses to a shared cue in list-to-list transfer, not discriminating one new sign from another in a recognition task **with the cue physically present**.

**A silent side-by-side does not work.** [E — moderate] Pairing pays off only if the distinguishing component is given **meaning**; learners do not encode a confusable contrast unless attention is explicitly directed to the critical difference **in words** (Chang et al., N = 66, immediate + 1 week). Identification training with feedback beats same/different training.

**One helpful direction fact.** [E — moderate] The game tests L2→L1 comprehension, the direction in which **semantic relatedness among the options HELPS**. Form similarity is the real hazard. So four semantically related *meanings* among the options is fine; four orthographically near-identical *signs* during a sign's first appearances is not. And **never add a production mode** (write/type the Chinese for "exit") — that is the L1→L2 direction where relatedness turns harmful.

### Required changes: the four dependencies

**(1) WHERE.** The pair belongs in the **post-resolution panel**. Confusable distractors in the *options* are gated on the target's `consolidated` bit. First appearances get semantically and visually **unrelated** (but domain-plausible) distractors. Once **both** members are consolidated, the confusable moves into the options and the pair is scheduled tight and alternating. Note this makes "ban random unrelated distractors" wrong as a blanket rule. [E]

**(2) WHEN.** Never introduce both members of a form-confusable pair as new items in the same session. The sibling becomes eligible only once the first is **consolidated across a night** (correct on a retrieval after at least one intervening sleep). Schedule confusion-set members tight (5–15 intervening items, **[J] magnitude**) while keeping **≥24h between correct repetitions of the same item**. The scheduler needs both a **minimum gap** (same item) and a **maximum gap** (within confusion set). Prioritise **added-stroke** pairs early over **identical-stroke** pairs, which are measurably harder. [E]

**(3) WHICH.** A **`confusion_type` enum with four values, not a boolean**, plus a confusion **family** tag so the reveal copy can differ:
- *form-confusable* (公斤/斤 containment, 人/入) — staged introduction;
- *meaning-confusable-visually-distinct* (麻/辣) — freely from day one;
- *both*;
- *shared-morpheme* (出口/入口, 门口/窗口) — **a fourth category no cited study covers**, where the shared 口 is a genuine shared meaning that can be *taught*, so it plausibly behaves more like the weak semantic case. **That is a hypothesis. Instrument it.** [E]

Keep **`interference_set`** (items that must NOT be scheduled in the same acquisition block) as a **separate field** from **`confusable_with`** (items shown together at resolution). They are opposite operations and fusing them is how you build an interference generator by accident. [E]

**(4) HOW.** Render both members **simultaneously, side by side, same size, same baseline, same neutral ink.** Adjacency alone is insufficient: every form-confusable pair requires **one authored, meaning-bearing formula for the distinguishing component as required content**, not flavour text — *"出 = feet stepping out of an enclosure; 入 = a wedge entering."* Feedback must be **corrective, not verdictive**: name the specific lure the player chose and say what is true of the target and false of that lure. [E]

### Further binding constraints

- **The reveal is a table, not a green tick.** One row per option (three rows, per §3.1): hanzi at ≥32px, pinyin, **English and Dutch** gloss, and a one-clause note on where you would actually meet it — *"冷冻 = vriezer, staat op diepvriesproducten — niet hetzelfde als 冷藏."* The correct row gets the accent bar; **wrong rows stay fully legible**, never greyed to the point of being skimmed past. [E]
- **Determinism.** The engine is a deterministic reducer over a shared event log, so confusable and distractor sets are **precomputed at build time** and derived as a pure function of `(item, exposure_count, seed)`. Runtime generation is too slow and non-deterministic, and phones will diverge. Build a component-incidence index (component → characters, character → components) at build time from Unihan `kRSUnicode` plus the in-house decomposition table. [E]
- **Reading collisions.** Pairing logic must never pair two items sharing a character with different readings as though they were the same item — 磨 mó against 磨 mò is a schema bug waiting to be authored. 公斤/斤 is safe only because 斤 is monophonic. [E]
- **Two distractor generators, not one priority list.** Priority 1 = **visual neighbours** from component decomposition / stroke-edit distance. Priority 2 = **situational neighbours** from the domain corpus for that scene. The original spec's flagship example was wrong: **药店 and 酒店 share no component at all** (艹+约 vs 氵+酉) — they are priority 2, and an implementer following the spec builds the wrong generator. [E]
- **Pair-balanced testing.** Retrieving one member of a competing pair suppresses the other by **≈8.7 percentage points** (RIF, strong, lab-wordlist, minutes to a day). When any member of a confusable family is in the active deck, mark **all** members due-soon. A deck that quizzes 出口 and never 入口 is actively degrading 入口. [E]
- **Log `{itemId, lureId, timestamp}` on every chosen-lure event** and force a corrective re-test within 24h. **Do NOT** immediately re-present the item with the lure removed — that is massed repetition of a now-trivial two-option item, and Butler & Roediger attribute the repair to *corrective feedback*, not to immediate re-testing. **Do NOT** forbid reusing a lure as another item's correct answer: in a menu domain the confusable set **is** the syllabus (牛肉 is the correct answer for one item and the ideal distractor for 羊肉 and 猪肉), so a no-reuse rule either forces weak filler — destroying Rodriguez's three-option result — or fragments the confusable set across sessions, which prohibits interleaving. [E]
- **Set content.** Priority pairs for a China travel reader: **人/入 (critical — 入口 misread as 人口 is the canonical beginner error and sits at the centre of the flagship metro scene)**, 出口/入口, 推/拉, 冷藏/冷冻, 生产日期/保质期, 禁止/请勿, 男/女, 素/荤, 硬座/软卧, 去结算/取消, 提交订单/加入购物车, plus the pure visual set 大/太/犬/夫, 日/白/百/自, 千/干/于, 未/末, 己/已/巳, 天/夭, 士/土, 出/山, 田/由/甲, 我/找. **Drop** the classic teaching-list pairs 夭 and 巳 and 曰/犬 — they never appear on consumer signage. [E]
- **Warn the team in advance:** interleaving lowers self-rated session satisfaction, and an A/B on satisfaction will kill it wrongly. No learning-relevant feature may be killed or shipped on self-reported difficulty or perceived helpfulness. [E — strong]

### Colour-marking the discriminating component

**Genuinely contested and NOT resolved by the general no-colour rule.** Against: colour coding slowed learners in the one Chinese-specific study; radical markings raised RT and lowered accuracy. For: that is an **RT main effect at test, not a learning outcome** — slower responding is equally consistent with more careful feature-checking — and against it stands the meta-analytically supported **signalling principle** (Schneider et al. 2018), which is the standard way to implement "direct attention to the critical difference", which the same evidence demands two findings later.

**Ruling:** it is an **A/B, tested on delayed discrimination accuracy, never on RT**; **reveal panel only, never on a timed card**; **at most one simultaneous highlight**; **default OFF**. Neither ship it by default nor prohibit the affordance. This does not disturb §3.5 — keeping colour off the glyph on the *timed card* survives on redundancy and WCAG grounds regardless of how this resolves.

---

## 3.5 Decision 5 — "Tone colour sits on the pinyin, never on the character"

**Ruling: split. The "never on the character" half is SUPPORTED and generalises. The "tone colour on the pinyin" half is UNSUPPORTED and does not ship in v1.**

Cluster verdicts on 5a (never on the character): *supported* / *supported* / *supported* / *supported* — unanimous, and two clusters say it should be stated **more strongly** than the design states it. On 5b (colour on the pinyin): learning-science *unsupported*, chinese *no-evidence*, interface-social *unsupported*, systems *supported only in the sense that the placement is harmless*.

### 5a — the load-bearing half

**Supported, and it costs nothing.** Colour and extra visual salience applied to the glyph hurt L2 character recognition: radical colour markings increased RT and decreased accuracy; stroke-order animations decreased accuracy; colour coding independently slowed absolute beginners, interpreted as visual overload. A second visual code on the form competes with the orthographic representation the product exists to build (redundancy effect). Independently, a cue present in training but absent at test produced the **worst retention and transfer of any condition** (Skulmowski 2022, guidance reversal, n = 125 / n = 107, anatomical visualisation — transfer by analogy, not a hanzi study). [E — moderate]

**Generalise it, and say it in the design system rather than only in the tone section:** *no tint, highlight, outline or coloured sub-glyph region on any hanzi, ever, anywhere in the answering loop.* Hanzi render as a **single solid ink colour on a plain ground** during any timed recognition round. Colour is reserved for scoring, turn state, player identity and progress. Component colour is permitted only in the lesson and the reveal, subject to §3.4's A/B. Make the ban explicit **because a designer will otherwise reintroduce tone-colouring as an industry norm** — it is the default in Pleco, Hanping, Skritter and Dong Chinese.

### 5b — the decorative half

**Unsupported. Do not ship it by default in v1.**

**The reference study.** Godfroid, Lin & Ryu (2017), Language Learning 67(4) — n = 303, three-week randomised training with a delayed posttest. Colour-mediated tone training **worked** (~11% item-learning, ~12% system-learning gains) but sat **slightly behind pitch contours and tone numbers**, and crucially **dual-cue methods did not beat single-cue methods.** Pinyin already carries tone in its diacritic. **Tone colour on pinyin is exactly the dual-cue configuration that bought nothing** — an added channel with added cost and no measured gain. [E]

**Do not over-read it in the other direction either.** "Godfroid proves colour is harmful" is an over-read. It shows colour is **not necessary**, not that it hurts. [E — this is listed as a myth in its own right]

**No controlled trial of Mandarin tone colour coding in a reading interface could be located at all**, and the palettes in the wild are **mutually incompatible across apps** — which is itself evidence the practice is convention, not result. Godfroid trained auditory tone **perception**, not glyph tinting in a reading interface, so the transfer is not direct. [E]

**Two further problems specific to this product.**

- **Legal/accessibility, and this settles it regardless of how the pedagogy reads.** WCAG 2.1 SC 1.4.1 *Use of Colour* (Level A) prohibits colour as the sole carrier of information, binding via EN 301 549 under the European Accessibility Act, applicable since **28 June 2025** for a Dutch-published consumer app. Standard four-tone palettes are red/green/blue/purple; **red-green is the failing pair for ~8% of males and ~0.5% of females of Northern European ancestry** — i.e. the Dutch user base. [E — strong; standards and epidemiology, not experiment]
- **Transfer.** Real signage carries no tone colour anywhere, so the cue is **guaranteed absent at the criterion task**, in a product whose criterion task is silent visual recognition. [E]

### Required changes

1. **No tone colour anywhere in v1.** Not on the character, not on the pinyin. Colour carries no linguistic information anywhere in the product. Reserve colour for interface chrome. Justify it by WCAG 1.4.1 + EAA + CVD prevalence + guidance-reversal transfer — legal and accessibility grounds that hold regardless of how the learning evidence reads. [E]
2. **If tone is ever displayed, carry it redundantly** in shape or number as well as colour, never colour alone — and **prefer a contour glyph with the turning point marked** over a colour swatch. The timing of the F0 turning point (near onset for T2, mid for T3) is the discriminating cue non-tonal-L1 learners actually fail to use; L2 listeners lean on duration instead. **Do not draw the four tones as symmetric icons.** [E — moderate; Zou, Caspers & Chen on Dutch L1 learners specifically, abstract-only]
3. **Do not let it grow into a tone-drilling subsystem.** That would import the phonological-difficulty gradient into a game that currently escapes it. If tone ever needs a real channel, the evidenced route is **high-variability phonetic training with multiple talkers and immediate feedback**, not colour. [E]
4. **T2/T3 is the dominant error for Dutch and English L1 adults, and it is categorical, not audibility-limited.** Never let a T2/T3 discrimination gate progress; exclude the T2↔T3 swap from any pinyin distractor pool for the first 200 items. [E — moderate]
5. **Spend the pinyin budget on rendering quality instead** — that is the real risk. See §4.6, which is where this decision actually cashes out.
6. **Keep the separable segments/tone data model** independently of any colour decision, and store `pinyin_citation` and `pinyin_surface` as separate per-token fields with an explicit neutral-tone state. Third-tone sandhi applies in 水饺, 米粉, 老板, 两碗, 九点; 不 → bú before T4 (不是, 不要, 不对); 一 → yì/yí by following tone (一点, 一起, 一个) — and 一 and 不 are frequency ranks 1 and 5. **Render surface form whenever audio plays**, or the app displays a T3 while playing a T2 on exactly the items where the learner is weakest, actively training the confusion the tone design exists to prevent. (No audio ships in v1, so this is a **field** requirement now and a **render** requirement later.) Note 好吃 is T3+T1 — only allophonic half-third lowering applies, so it does **not** motivate a stored surface-tone field. [E — strong]
7. **Ask the prior question in the design doc, once, and answer it:** this is a reading product whose criterion task involves no tone at all. **v1 ships no tone channel as a thing to be learned.** Pinyin appears as a pronunciation aid on the reveal, and that is all it is.

---

## 3.6 Banned-rationales list

Placed in the design document as a standing list, because these are the arguments a team that has absorbed the vocabulary will regenerate in six months:

**perceptual disfluency** (make it hard to read so they remember it) · **Krashen's affective filter** (unfalsifiable; a reviewer with SLA training will discount the surrounding argument — use Attentional Control Theory and latency inflation instead) · **tone colour on characters** · **"MC beats recall"** · **the Ebbinghaus forgetting curve** and "you forget 50% within an hour" · **learning styles** · **10,000 hours** · **the bizarreness effect** · **the method of loci as a product feature** · **dual coding / picture superiority as a justification for photorealistic rendering** · **Cowan's ~4 chunks as a licence for a hard element cap on a screen whose elements all remain visible** · **the Duolingo 112–141 hours anchor** (Spanish and French only) · **"players report they had fun" as a safety signal** (enjoyment and anxiety are distinguishable dimensions at r ≈ −0.36; a session can be both) · **"cooperation beats competition" as settled fact with a usable magnitude** (the sign is safe, the point estimates are allegiance-contaminated) · **any physical size converted at 96 CSS px per inch.**

---

# 4. UI specification

Every number below is tagged **[E]** evidence-licensed, with the source and its scope, or **[J]** judgement call, with the reasoning and — where one is needed — the test that would settle it. Nothing here is presented as derived when it was invented.

One standing caveat, from the digests themselves and inherited by everything in §4.2: **across the interface cluster's two sweeps and two critiques, exactly one paper was read in full text** (Parhi, Karlson & Bederson 2006). No effect size in that cluster has been checked against a results section. Directions are usable; magnitudes are provisional. The legibility literature specifically (Cai/Chi/You 2001; Liu & Yu 2016; Huang/Rau/Liu 2009) is 10–25 years old, desktop and VR, and predates high-DPI phones. **Every pixel figure in §4.2 is a starting point for an in-house legibility test on target devices, not a spec.** No study reports them.

---

## 4.1 Units: the conversion constant, and why every earlier number was wrong

**[E — strong; arithmetic and standards, recomputed in-session]**

Phones render approximately **160 CSS px per physical inch** — Android `dp` = 1/160 in, iOS `pt` ≈ 1/163 in — not the 96/inch that CSS Values and Units Level 4 §6.2 fixes as a *nominal, explicitly non-physical* ratio.

> **6.3 CSS px per millimetre.**

Every physical and angular figure in the original interface sweep was off by ~1.67×, **in the unsafe direction**. Repaired: the 42-arcmin preferred-size finding is **28 CSS px**, not 17. Tested 12 pt running text is **~27 CSS px**, not 16–17. Parhi's 9.2 mm discrete-tap floor is **58 CSS px**. Conradi's walking-safe 14 mm is **88 CSS px**.

**Rules:**
- **Never use CSS `mm`, `in`, `pt` or `cm` for physical sizing.** They are nominal.
- Every hard size in this document was regenerated from 6.3 CSS px/mm.
- **All type sizes ship as `rem` against a root of 16 px**, defined in custom properties, so they survive 200% OS text scaling (WCAG SC 1.4.4 — a single 1.25× in-app toggle does **not** discharge it). Never set a `px` `font-size` on text.
- Two independent type scales: `--latin-base: 1rem` (16 px) and `--hanzi-base`, roughly 2–3× that. [E — the two-scale requirement; the ratio is [J]]

**Design viewing distance: 360 mm.** [E] Bababekova & Rosenfield report a mean of 36.2 ± 7.1 cm for phone text; Lan 33.95 ± 5.9; Boccardo 36.1 ± 7.2. All angular figures below are computed at 360 mm, where **1 CSS px ≈ 1.516 arcmin**.

---

## 4.2 Hanzi type sizes

### 4.2.1 The type scale

| Role | rem | CSS px | arcmin @360 mm | Status |
|---|---|---|---|---|
| **Absolute floor** — any glyph the learner must discriminate | 1.75 | **28** | 42.4 | **[E]** 42-arcmin preferred-size finding, re-derived at the corrected ratio |
| Running-text hanzi (reveal notes, gloss context) | 1.75 | **28** | 42.4 | **[E]** tested 12 pt optimum = ~27 CSS px, rounded up to the floor |
| Reveal-table option hanzi | 2.0 | **32** | 48.5 | **[E-anchored / J magnitude]** — the ≥32 px minimum is the chinese cluster's directive at *high* confidence; the floor beneath it is evidence-licensed |
| Answer-option hanzi (in-loop) | 2.5–3.0 | **40–48** | 60.6–72.8 | **[J band, [E] floor]** — comfortably above the 42-arcmin preferred size; the band itself is a design choice |
| **Prompt hanzi** (the target being read) | 4.0–5.0 | **64–80** | 97–121 | **[J band, [E] floor]** |
| Street / walking mode, every element | — | ×1.4 min | — | **[E]** Conradi 14 mm = 88 CSS px for touch; type scaled to match |

**Why the prompt is this large.** Chinese readers need roughly **1.7–2.0× the ETDRS acuity size** Latin readers need at equivalent legibility. [E — direction reliable, magnitude approximate]

### 4.2.2 Minimums as a function of stroke complexity — the ruling

**There is no per-character font-size formula, and the one that was proposed is retracted.**

**[E — high confidence]** The **+0.25 arcmin per stroke** compensation slope is **struck**. Three reasons, and all three bind: (a) the slope was unverifiable; (b) the multiplicative formula built on it did not actually implement it (+12% where the slope implies +20%); (c) it is a **category error** — it derives from a **6-observer acuity-threshold study** (Zhang et al. 2007, IOVS), and threshold-derived compensation does not transfer to a display running 5–10× above threshold.

**What complexity actually binds** [E — Wang, He & Legge 2014, trigram visual-span method extended to Chinese, replicated across age groups]: visual span for Chinese shrinks as complexity rises, with the **product of span size and complexity roughly invariant** (~10 cycles at 1.2°). **Complexity costs how many characters you take in per fixation. It does not license a per-character size formula.**

**Therefore:**

1. **Set one generous global size, safe for the most complex character in the bank, and stop.** [E]
2. **Spend the complexity variable on chunking** (§4.8) and on **stroke width** (below), not on size arithmetic.
3. **One bounded concession, and it is a single step, not a slope.** [E threshold / J magnitude] Stroke *width* becomes the binding constraint above roughly **15 strokes** (Liu & Yu 2016; Cai, Chi & You 2001 — direction reliable, magnitude approximate, neither paper retrieved). So: if a build-time `strokeCount` derived from Unihan `kTotalStrokes` is **≥ 15**, the item renders **one step up the type scale and at weight 500**. One step. Never a continuous function of stroke count.

**The characters in this bank that trip it**, verified in-session against makemeahanzi: **警 19, 藏 17, 燥 17, 糖 16, 醋 15**. Just below the threshold and unaffected: 辣 14, 蒸 13, 酱 13. [E — strong]

**The characters that must NOT trip it, and why this matters:** the original sweep's clinching examples of maximum complexity — **檢 續 醬 鹹 餃 質 藥 攤 邊** — are **traditional forms** that do not belong in a Simplified-only product outside the fascia variant rendering. Their simplified counterparts are far lighter: **检 is 11, 质 8, 边 5, 咸 9, 饺 9, 摊 13, 药 9.** A hand-picked complexity list leaked a traditional stroke count into a simplified product's worked example of its own hardest case. **`strokeCount` is derived programmatically and asserted at build time. There is no hand-picked list.** [E — strong]

### 4.2.3 Weight

- **Floor: 400. Never 300, Light or Thin, anywhere, at any size.** [E] Stroke width is the binding constraint on complex glyphs.
- **500 in dark mode** and on any inverted-polarity substrate (§4.4). [J magnitude, [E] mechanism]
- **500 for `strokeCount` ≥ 15** items. [J]
- **Never synthesise bold or condensed.** Synthetic bold thickens strokes non-uniformly and closes counters on dense glyphs — it converts a legibility aid into a legibility defect on exactly the characters that need it. Ship real weights or don't ship the treatment. [J, grounded in the stroke-width finding]

---

## 4.3 Faces

### 4.3.1 The stack

**Hanzi — `"KBD Sans SC"`** (a renamed subset of **Noto Sans SC**), weights **400** and **500**. **[E — strong, both licence files read verbatim]** Noto Sans SC and Source Han Sans are the same typeface under two licences, and only one is safe to subset: **Source Han Sans carries the Reserved Font Name "Source"** (also an Adobe trademark); **Noto CJK declares no RFN at all.** **Subsetting counts as modification under OFL 1.1**, which is exactly what an RFN constrains. Give the subset a distinct internal family name so no trademark question can arise. Ship `OFL.txt` beside it and list it in `/licences`.

**Hanzi serif — `"KBD Serif SC"`** (Noto Serif SC 400), for the printed-menu template. **[E]** A Hei/gothic face at bold weight in positive contrast is the most legible on-screen Chinese; Ming/Song is the least (Dobres et al. 2016, glance-based legibility). **So Hei is the default for the prompt the learner must discriminate** — but legibility and transfer pull apart here, and the resolution is to **vary the face across repeated exposures, not to soften the prompt face**. One countervailing result to note honestly: Ming beat Hei on a traditional-Chinese phone study **at 10 pt only** (Huang 2019).

**Fascia/display** — a heavier weight (700) of the sans, plus a genuinely condensed or hand-painted face if a licensed one is available. Do not fake it.

**Latin and pinyin — a separate, diacritic-complete Latin face**, self-hosted (Noto Sans, Source Sans or Inter). **This is not a style preference; see §4.6.** [E]

**There is no teaching-folklore justification available for Kai.** [E] "Kai is better for learners because it shows stroke shape" has **no controlled test that could be located.** All typeface evidence in existence is legibility for *native* readers; **no study exists testing whether any typeface aids acquisition of character FORM by learners.** Do not write that claim into the doc.

### 4.3.2 Delivery, and the build gates

**[E — all measured in-session with fontTools/pyftsubset]**

- **Never a Google Fonts `<link>` or the CSS API.** Disqualified twice: it needs network at render time, and its hosts are unreachable from mainland China. It also serves CJK as ~100 lazily-fetched `unicode-range` chunks, which cannot be coherently service-worker precached.
- **Self-host, subset at build time from the item bank's own character inventory**, so the font can never drift from the content. Precache in the service worker.
- **Measured, linear at 109–137 bytes/glyph:** 300 hanzi → 44.7 KB; 600 → 84.9 KB; 900 → 123.5 KB; **1,200 → 164.0 KB**; 2,000 → 277.4 KB; 3,000 → 418.6 KB (woff2, `--layout-features=` stripped, `--no-hinting`, plus 121 Latin/punctuation codepoints).
- **At the §9–12 fixed bank of 1,500 characters:** ~**205 KB per face** by linear extension; **three faces ≈ 615 KB**. **[E derivation from measured linearity — re-measure at content lock, do not treat as a spec.]**
- **The tofu risk comes from your own codepoint-extraction step, not from the typeface.** The named `chinese-simplified` subset (1.09 MB, 7,946 codepoints) was verified to contain all 3,000 HSK 3.0 characters *and* 焗 煲 涮 菌 藕 韭 笋 蒜 姜 葱 炝 烩 氽 煨 熘 腌 蕈 蚝 蛏 鲈 鳕 鳝. **Typeface risk is zero. Extraction risk is real.**

**Build gates that fail CI:**
1. Any item-bank codepoint missing from the produced subset.
2. **The subset's codepoint set is the union of every item string AND every component id referenced by any decomposition record.** ⺼ **U+2EBC lives in the Kangxi Radicals block and appears in no item string** — a naive extraction over bank text will drop it, and the decomposition panel will render tofu or fall back to a face that substitutes 月, reintroducing the §3.3.4 error. Assert U+2EBC explicitly.
3. The Latin face's diacritic coverage (§4.6).
4. Locale-independent glyph forms: assert the app's own face is used for 直 骨 每 令 画 and never a system CJK fallback, which renders Japanese glyph forms on a JP-locale device.

---

## 4.4 Polarity and contrast

### 4.4.1 Polarity

**Default: positive polarity — dark text on a light ground.** [E — **moderate**, downgraded from strong by the critique] Positive polarity is more legible than negative and **the advantage grows as characters shrink** (Piepenbrock, Mayr & Buchner 2014, *Human Factors* 56(5); 2013, *Ergonomics*). **But the mechanism is pupil contraction, so the effect is ambient-light dependent** — and the polarity corpus is bright-office LCD proofreading of Latin text with no ambient-illumination moderator. This product's criterion environments are a dim restaurant and a night metro platform.

**Therefore: honour `prefers-color-scheme`. Do not force light.** Dark is a **first-class path**, not a degraded one:

| Dark-mode adjustment | Value | Status |
|---|---|---|
| Hanzi size | **+15%** over the light-mode step | **[J]** |
| Hanzi weight | 400 → **500** | **[J] magnitude, [E] mechanism** (stroke width is the binding constraint) |
| Target-character foreground | **≈9:1** against the ground (#B8B8B8-class) | **[J]** — the digest's number; chrome stays dimmer |
| Ground | **neutral or blue-shifted grey** | **[E-adjacent]** |
| Ground — **prohibited** | **red-tinted (#1F0F0F)** | **[E]** — it collides with red error feedback. The 6.11:1 arithmetic for #949494 on #1F0F0F was verified correct but is **thin for stroke-level discrimination by a learner** |

### 4.4.2 Contrast — and the WCAG position, stated plainly

**The legal floor is not optional and it is not a style debate.** [E — strong] Directive (EU) 2019/882 (the European Accessibility Act) has been **applicable since 28 June 2025** to consumer digital services, via EN 301 549 v3.2.1 incorporating **WCAG 2.1 Level AA**. For a Dutch-published consumer app the binding success criteria are: **1.4.1** Use of Colour · **1.4.3** Contrast (Minimum) · **1.4.4** Resize Text · **1.4.12** Text Spacing · **2.2.1** Timing Adjustable · **2.5.8** Target Size (Minimum).

**The position this spec takes, and it is stricter than WCAG requires:**

> **The target glyph clears 4.5:1 in every treatment, in both polarities, regardless of its rendered size. In dark mode it clears 7:1.**

**Why stricter, and this is a [J] with reasoning.** WCAG's "large scale text" exemption drops SC 1.4.3 AA to **3:1** at ≥24 CSS px (or ≥18.66 px bold). That threshold was defined for Latin text, where size and internal detail scale together. **It does not describe a 19-stroke 警 at 28 px**, whose internal strokes are finer than any feature in 28 px Latin, and whose reader is a beginner performing stroke-level discrimination rather than a native reader performing whole-word recognition. Taking the exemption would be conformant and wrong. We do not take it. **This is a judgement call, owned by design, and it is the reason the "deliberately hard to read" treatments died** (§3.2) rather than being tuned.

**Consequences:**
- Every substrate template is contrast-tested against its own target glyph at build time, not eyeballed.
- "Authentically weathered" and "authentically low-contrast neon" treatments render the *substrate* with wear and keep the *glyph* above the floor. Fidelity is to the sign's typography, colour inversion and grime — **never to its illegibility**.
- No opacity-based dimming of any hanzi, ever. Wrong rows on the reveal are not greyed to the point of being skimmed past. [E]

### 4.4.3 The substrate exception

**A faithfully reproduced sign's own colour is CONTENT, not app colour, and it overrides the app's polarity.** [E — moderate; GB 2894 is a mandatory GB standard, GB/T 10001 recommended; **the standard texts were not retrievable and the hex values are approximations — verify before ship**]

China's public safety signage is a four-category colour-and-shape system, so the illocutionary force arrives **before any character is decoded**:

| Category | Form | Meaning |
|---|---|---|
| 禁止 prohibition | **red** circle with diagonal bar | do not |
| 警告 warning | **yellow** equilateral triangle, black border | danger |
| 指令 mandatory | **blue** filled circle | you must |
| 提示 notice | **green** square | information / safety |

**Render the real geometry at correct proportions and never recolour these to fit the app's chrome: the colour IS the content.** Note also that the emergency exit sign is green and reads **安全出口**, not 出口 — 出口 on a blue or black plate is just the way out of the station.

The same applies to the real inversions the templates reproduce: white-on-green exit, white-on-red hazard, black-on-yellow price tag. These are not decisions; they are the stimulus.

---

## 4.5 Colour

### 4.5.1 The rule

> **No colour carries linguistic information anywhere in this product.**
> **No part of any hanzi is ever tinted, highlighted, outlined or given a coloured sub-glyph region, in the answering loop, for any reason.**

**[E — moderate on the learning evidence; strong on the legal ground, which alone settles it.]** Hou & Jiang 2022 (N = 40, radical markings raised RT and lowered recognition accuracy; stroke animations lowered accuracy); Li, Shi & Wang 2025 (N = 183, colour coding slowed absolute beginners — visual overload); Skulmowski 2022 (a cue present in training and absent at test produced the worst retention and transfer of any condition). All abstract-only. **WCAG 1.4.1 + EAA + ~8% male / ~0.5% female CVD** settles it regardless of how those read.

### 4.5.2 What colour is for

Interface chrome only: **correct/incorrect · player identity · turn state · progress.** And **every one of those must also carry a shape or text channel** — colour is never the sole carrier (SC 1.4.1, Level A).

**Feedback asymmetry, and it is a requirement:** [E — strong] point **gains** may be salient; point **losses** must be **small, uncoloured, unanimated, silent**. Kluger & DeNisi (1996, ~131 papers, ~607 effect sizes): mean d ≈ 0.41 but **roughly 38% of feedback effect sizes are negative**, and the moderator is whether attention goes to the **task** or to the **self**. A public point loss carrying no task information is close to pure self-level feedback. **No red negative numbers anywhere.** On a wrong answer, the shared view carries **the correct character and the correction at full size**; the score delta is a small uncoloured tick. Public task information, private self information.

### 4.5.3 The three permitted exceptions

1. **The sign's own colour** (§4.4.3). Content, not chrome.
2. **One highlight on the discriminating component, in the reveal panel only** — never on a timed card, at most one simultaneous highlight, **default OFF**, shipped as an A/B tested on **delayed discrimination accuracy, never on RT** (§3.4).
3. **Nothing else.**

### 4.5.4 Tone colour

**Not shipped in v1** — not on the character, not on the pinyin. Full ruling in §3.5. If it ever ships, it is an off-by-default preference that **never combines with a contour glyph** (dual cues add cost with no gain), is fadeable, and carries tone redundantly in shape or numeral.

### 4.5.5 Mastery display

**Never render a per-item mastery percentage or a strength bar.** [E — strong] Every published spaced-repetition model discriminates item-level recall near chance in a real language-learning product (all within 0.04 AUC of chance in Duolingo's own published table). **A precise wrong number is a visible lie.**

Three coarse states, **distinguished by shape and fill, not by colour**: **NEW** (outline chip) · **LEARNING** (half-filled) · **SOLID** (filled) — where SOLID silently falls back to LEARNING as retrievability decays, surfaced as *"3 characters need a refresh."* Aggregate progress at deck level only.

**And never in the UI or in store metadata:** any CEFR letter, the letters "HSK", any "Level N" label (trademark — binding from §9–12), or any coverage percentage. Progress is expressed as **signs you can act on**: *"you can read 47 of the 120 signs in the metro set."* Never *"you can now read ~40% of what's on the wall"* — token coverage is not sign comprehension, and on a four-character sign 40% token coverage means essentially zero complete signs readable. [E]

---

## 4.6 Ruby and pinyin

This is where §3.5's ruling cashes out, and it is the part the research sweeps missed.

### 4.6.1 The problem

**[E — arithmetic, verifiable]** At a 48 px hanzi with 0.45em ruby, the information-bearing tone diacritic is a **2–3 px mark**. And many system CJK fallback faces render Latin-with-diacritics from a *different*, poorly-hinted fallback, with **ü frequently substituted or mis-stacked**. The channel that carries the entire tone distinction is, at typical ruby sizes, three pixels rendered by a face nobody chose.

### 4.6.2 Specification

| Property | Value | Status |
|---|---|---|
| Placement | **Per-character, directly beneath each glyph, baseline-aligned to that glyph's box** — chū under 出, kǒu under 口 | **[E]** Lee & Kalyuga 2011, *Language Learning* 61(4): vertical per-character format beat the conventional horizontal format; attributed to eliminating split attention. Verified by adversarial check |
| **Never** | `chūkǒu` as a single romanised string beside or under the word | **[E]** same source |
| Size | **≥ 0.5em of the hanzi**, with an **absolute floor of 20 CSS px** (1.25rem) | **[E-anchored]** ratio and floor from the interface directive at *high* confidence; **the 20 is [J]** |
| Resulting sizes | prompt 64–80 px → ruby **32–40 px**; reveal rows 40–48 px → ruby **20–24 px** (at the floor) | derived |
| Face | **A separate, diacritic-complete Latin face**, self-hosted — Noto Sans, Source Sans or Inter. **Never the CJK face's Latin, never a system fallback** | **[E]** |
| Gloss placement | Attached to **the whole word, directly under the pinyin row**, never off to the side | **[E]** same split-attention argument |

### 4.6.3 Build-time render assertions

**[E — required, high confidence]** Assert that **all** of the following render from the intended face, at the ruby size, on a 1× and a 2× raster:

```
ā á ǎ à   ē é ě è   ī í ǐ ì   ō ó ǒ ò   ū ú ǔ ù   ǖ ǘ ǚ ǜ
```

The ü series (U+01D6–U+01DC among others) is **routinely dropped by naive subsetting** and is load-bearing here — 绿 lǜ, 女 nǚ, 旅 lǚ are all in the bank. A missing ǚ does not throw; it silently substitutes.

### 4.6.4 Safari, and the fallback layout

**Verify `ruby-position` in Safari.** [E — named explicitly as a required check] **Do not let the layout depend on `<ruby>` rendering correctly.** Ship the pinyin row as a **CSS grid sharing the same column template as the hanzi row**, with `<ruby>` as a progressive enhancement. The grid produces identical per-character alignment, tolerates SC 1.4.12 text-spacing overrides, and cannot collide with the line above. `<rt>` inherits the grid column. This costs nothing and removes a whole class of platform-specific breakage.

### 4.6.5 Where pinyin appears at all

**Never on a timed prompt.** [E — the guidance-reversal argument in §3.1(d), applied consistently]

- **Tier-0 introduction (untimed, single-player, no betting):** full ruby.
- **Reveal:** competence-faded ruby — **full for an item's first ~3 exposures** (**[J]**), then **partial ruby on only the characters that item's error history flags weak** (**[E]** — Wang & Kalyuga's expertise reversal: partial beat both full and none for more experienced learners), then none. Store `exposureCount` and `perCharacterErrorRate`.
- **Timed prompt:** none. Ever.
- The pinyin-to-component-hint scaffold swap ships as **a flagged A/B, graded weak**.

**Content constraints that bind the render:** pinyin is keyed to **(token, word-context)**, never generated per character on device; `has_variant_reading` flags heteronyms; CI fails on any heteronym without an explicit per-character reading. A naive per-character generator gets **小心地滑** — the most famous sign in China — wrong. **Never ask for a character's pronunciation in isolation.** [E — strong, computed]

---

## 4.7 Spacing

| Rule | Value | Status |
|---|---|---|
| **No word spacing in the answering loop** | — | **[E — contested, resolved]** Word spacing is a training-only cue absent from every real sign — structurally identical to the tone colour and radical highlighting banned above, and defended with a weaker literature. It is also largely moot: signage targets are 1–4 characters (出口, 火车站, 牛肉面), where segmentation carries almost no information, and the eye-tracking benefit was measured on running prose this app does not contain |
| **No letter-spacing / tracking on hanzi** | 0 | **[J]**, grounded in the same rule — tracking is a segmentation cue by another name and it changes the percept |
| **No per-word background tint** | — | **[E]** it is colour carrying linguistic information (§4.5) |
| Word tokenisation | **Stored pre-segmented at authoring time**, never computed on device; surfaced **only** in the reveal's decomposition panel, where the word is already being taken apart | **[E]** on storage; **[J]** on the surfacing |
| Answer row gap | **8 px** | **[E-adjacent]**, derived alongside the Parhi row height |
| Destructive controls (skip / quit / end game) | **≥ 24 px from any answer option** | **[E]** WCAG 2.2 SC 2.5.8 spacing-based sufficiency at AA |
| Line-height, running hanzi | **1.6–1.8** | **[E-anchored, magnitude approximate]** — Zhu/Su/Dong 2021 (n = 115) found a 12 pt-with-generous-line-spacing optimum |
| Line-height, single-line prompt | **1.0–1.15**, with explicit padding instead | **[J]** |
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
| Options: **three**, not four | full content width, **60–64 CSS px** height, 8 px gap | **[E — strong]** Rodriguez 2005 for the count; **Parhi 9.2 mm = 58 CSS px** for the height (n = 20, the one full-text-read study in the cluster); clears WCAG AAA 44×44 simultaneously |
| Options: **stacked full-width, not a 2×2 grid** | bottom **~45%** of viewport, sticky | **[E]** Bergstrom-Lehtovirta & Oulasvirta 2014 thumb-reach model (n = 20, model-fitting, not an outcome experiment) |
| Minimum interactive height, anywhere | **56–60 CSS px** | **[E]** Parhi; error rate stops improving above 9.6 mm for discrete taps |
| Chrome target floor | **24×24 CSS px** (SC 2.5.8, AA) | **[E]** normative |
| Street / walking mode | every target **~88 CSS px** | **[E]** Conradi 2015, 14 mm standing-vs-walking |
| Prompt position | upper-middle third; unconstrained by reach because it is never tapped | **[E]** |
| **One item per screen. No peek or preview of the next item.** | — | **[E]** coherence/extraneous-material removal at the corrected independent estimate g ≈ 0.3 (not 1.00), plus the retrieval-support argument: adjacent on-screen items reduce the difficulty of the retrieval attempt |

**Two resolved conflicts, recorded so they are not re-litigated:**

- The chinese cluster specified **four options in a 2×2 grid at a 48 px target minimum**; the interface cluster specified **three full-width rows at 60–64 px**. **The interface cluster binds.** Rodriguez (2005) is a random-effects meta-analysis over 80 years of measurement research and is the strongest single psychometric claim in the corpus; and Parhi's own 9.2 mm empirical floor is **58 CSS px**, which supports 60–64 over 48 on the chinese cluster's own cited evidence. The chinese cluster's reveal table drops from four rows to three with it.
- **"44 px is the accessibility requirement" is a myth, in both directions.** [E] WCAG 2.2 SC 2.5.8 is **24×24 CSS px at AA**; SC 2.5.5 is **44×44 at AAA**; Apple HIG says 44×44 pt; Material says 48×48 dp. Four numbers for four different things, and the fact that the "standards" disagree by nearly 2× is itself evidence none of them is an empirical result. The empirical anchor is Parhi, in physical units, and it lands **larger** than 44 CSS px on most phones. **Write down which number you are meeting and why** — we meet 60–64 px and the reason is Parhi.

### 4.8.2 Interruption and resumption

**[E — strong]** Task-resumption cost grows with the interruption's duration and demand and is mitigated by cues that reinstate the suspended goal; working-memory capacity strongly predicts resumption lag, so the cost falls hardest on the players already most loaded (Monk, Trafton & Boehm-Davis 2008; Altmann & Trafton).

- Persist full item state — `itemId`, **options in shown order**, `elapsedMs`, selection-in-progress — to IndexedDB on **every `visibilitychange` and every option focus**, not at item boundaries.
- On resume, **never drop the player into a running timer.** Show a **~2 s reinstatement card** (**[J]** duration) redisplaying the target and the round context, then **restart the item timer from full**.

### 4.8.3 The two shared surfaces

**Private input, public resolution — a v1 requirement, not a nicety.** [E]

**On the answering player's own device:** the item, the three options, the private commit.

**On the shared/table view during answering:** *"Player 2 is answering"* plus a progress bar. **Never the live selection.** No mid-round *"got it right in 2.1 s"* banner. No spoken-answer item type in v1 — reading, not speaking, is the target skill, so privacy costs nothing competitively.

**On the shared view at resolution:** the correct character and the correction **at full size**. The score delta: small, uncoloured, unanimated, silent.

**Banned from the shared interface entirely:** [E] any per-player accuracy percentage visible to others · any persistent cross-match individual ranking · any "weakest player" label · any live who-is-losing ordering during play · any global leaderboard. Show **team totals only**; the individual breakdown is private, on the player's own device, after the match. A **filled dot per player per round** shows **THAT** they contributed — never how much, never how accurately. (Presence-of-contribution is the effort cue; magnitude is the ability cue.)

**End-of-match screen** leads with an **absolute competence statement for every player** — *"You read 23 characters correctly tonight. 6 were new"* — with win/loss second and smaller. Rank by "characters you can now read" so the bottom player still sees a positive number.

---

## 4.9 Information density

### 4.9.1 Chunking — this is where complexity is spent

**[E]** Cap a single reading target at:

- **6–8 hanzi** for low-complexity items;
- **4–6 hanzi** when build-time `meanStrokes` exceeds **12**;
- **`meanStrokes > 12` → one line, larger type, no gloss on the same line.**

Running-text hanzi capped at **2–3 lines per card**. (Derived from the visual-span invariance finding; the specific caps are **[J]** magnitudes on an **[E]** mechanism.)

### 4.9.2 The reveal card

**Budget by integration load, not by a chunk-count constant:**

> **One target. One decomposition. One contrast. Everything else behind the explicit tap.**

**[E]** — element interactivity, split attention and redundancy (Sweller; Mayer) plus expertise reversal. **Explicitly not justified by Cowan's ~4**, which is graded folklore as applied to a screen whose elements all remain visible.

**The one discriminating feature shown is TRUE OF THIS ITEM AND FALSE OF THE LURE THE PLAYER ACTUALLY CHOSE.** [E]

**Sequence on reveal:** [E on the order, **[J]** on the durations]
1. **The hanzi alone, large, nothing else — ~800 ms.** This gives the glyph an unshared encoding window before any competing cue lands. Picture overshadowing is documented even when the picture appears as *feedback after the response* (Solman & Wu 1995) — which is precisely the configuration otherwise proposed.
2. Then the gloss text.
3. Then any image (reveal-side only, never mandatory, never for non-picturable items).
4. Audio, if it ever ships, autoplays here — **post-answer, never simultaneous with the item.**

**The table:** one row per option (three rows). Each row: **hanzi ≥32 px · pinyin · English AND Dutch gloss · one clause on where you would actually meet it.** Correct row gets the accent bar. **Wrong rows stay fully legible.** [E]

**Minimum dwell ~2,000 ms before Next enables.** **[J]** — and it engages **SC 2.2.1**, so it must be defeatable by the "no timers" setting.

**The card thins out as the item's accuracy record improves.** [E — expertise reversal]

### 4.9.3 The two documented small-type exceptions

Two templates deliberately violate the 28 px floor, and both are **documented, deliberate accessibility exceptions** rather than oversights:

- **The QR / mini-programme template** — a phone-inside-a-phone rendering a Chinese ordering UI at realistic density with tappable buttons. The task is not *"what does this character mean"* but *"tap the button that adds this to your cart without ordering it."* **Small type IS the difficulty being taught**, and the pairs that matter — 去结算 vs 取消, 提交订单 vs 加入购物车 — are transactional, not orthographic.
- **The ingredient-list template** — grey paragraph text at real label density, with a scan-and-find task (*"is there soy in this?"*), not a recognition task.

**Conditions on both, all required:**
1. **Floor of 16 CSS px** (**[J]** — chosen as the smallest size at which a 19-stroke glyph plausibly resolves on a 2× display; **verify on target devices before ship, this is exactly the kind of number no study reports**).
2. **Never timed**, and a non-timed accessible alternative always available.
3. **Excluded from the naked probe**, and logged with `role: exposure` — **they never advance FSRS stability**.
4. **The target glyph still clears 4.5:1.** Small, yes. Low-contrast, no.
5. Requires `interaction: 'choice' | 'tap-target'` plus a hit-region spec in the item schema — **add it now rather than retrofitting.**

### 4.9.4 The naked probe — one implementation correction

§9–12 fixes the naked probe at **10–15% of presentations, target character alone, plain ground**, with a **>20-point** in-object-minus-naked gap meaning the app is teaching plates. That stands unchanged.

**One implementation note that preserves its intent:** the probe must **not** render from the system CJK fallback. On a Japanese-locale device that fallback renders **直 骨 每 令 画** in Japanese glyph forms, and the probe would then measure locale glyph-form robustness rather than plate-independence. **Render the naked probe in one of the bank's own faces, chosen as one not recently used for this item, on a plain ground with no substrate.** The point of the probe is the absence of the plate, not the presence of an uncontrolled face.

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
| **More than one highlight** in the reveal panel | Visual-load cap on the §3.4 A/B | **[J]** |
| **More than one of** {visible countdown, live opponent monitoring, public score change} salient on any item | Do not stack pressures. Since observation is inherent to a co-located game, **the visible countdown is the one to remove** | **[E — moderate]** Beilock & Carr; worry occupies the same WM the effortful strategy needs |
| Both members of a **form-confusable pair introduced as new items in the same session** | §3.4(2) | **[E]** |
| A **confusable in the options** before both members are consolidated | §3.4(1) | **[E]** |
| Word-spacing, tracking or segmentation tint **and the answering loop** | §4.7 | **[E]** |
| A **preview of the next item** and the current item | §4.8.1 | **[E]** |
| **Citation pinyin and natural audio** on a sandhi item | The app would display a T3 while playing a T2 on exactly the items where the learner is weakest | **[E — strong]** |

### 4.10.2 MAY co-occur

- The target on its substrate **+** the meaning **+** the one discriminating feature true of this item and false of the chosen lure. (That is the whole integration path. Nothing else joins it.)
- The prompt **+** three answer rows.
- On the reveal: both members of a confusable pair, **simultaneously, same size, same baseline, same neutral ink** — with the discriminator **named in words**. Adjacency alone does not work.
- On the reveal: per-character ruby beneath each glyph **+** the whole-word gloss beneath the ruby row.
- Substrate colour, geometry and the price/arrow/¥ that **constrain the meaning of the target** — these pass the seductive-details test.

### 4.10.3 Timing controls

**[E — legal requirement, SC 2.2.1 Timing Adjustable]** The inherited 45 s / 75 s / 120 s bet windows and the reveal dwell both engage it directly.

- Ship a **"no timers" setting** that turns off, adjusts or extends every limit.
- **Never award points for speed.** Score correctness only; break ties on total round time. [E — the Kahoot review finds no learning advantage from speed scoring]
- Use a **silent, generous window with a subtle desaturation in its final fifth** — no ticking digits, no shrinking bar until then. Visual timers reduce anticipatory anxiety without changing performance.
- **No timeout penalty on an item's first exposure.**
- Set the real window from the product's own data: ship the generous default, measure the latency distribution of correct responses, set the window near the **90th percentile**. The 5 s / 10 s figures inherited from wait-time research are struck — that corpus is 1970s–80s observation of *teacher pause duration in oral classroom discourse*, and there is no oral discourse, no teacher and no turn-taking norm in a silent tap on a phone.

---

## 4.11 Accessibility as build gates, not backlog

**[E — legal, strong]** All of the following fail CI, not a review:

1. `lang="zh-Hans"` on **every** hanzi element; `lang="nl"` / `lang="en"` on **every** gloss. Without these the app is unusable with VoiceOver/TalkBack — they will not select a Mandarin voice — and it is non-conformant.
2. **Every type size in `rem`**, verified functional at **200% OS text scaling** (SC 1.4.4). A single in-app 1.25× toggle does not discharge this.
3. Layout tolerant of **SC 1.4.12 text-spacing overrides**.
4. **4.5:1** on every target glyph in every treatment and both polarities; **7:1** in dark mode (§4.4.2).
5. **Colour never the sole carrier** of any distinction (SC 1.4.1).
6. **24×24 CSS px** chrome target floor; answer rows **60–64**.
7. A **"no timers"** setting reachable from the game screen.
8. The **diacritic render assertion** (§4.6.3) and the **font subset codepoint assertion** including **U+2EBC** (§4.3.2).
9. `strokeCount` derived from Unihan `kTotalStrokes`, asserted — no hand-authored counts.
10. No item containing 期 tagged with the flesh component (§3.3.4).

---

## 4.12 Numbers deliberately not specified, and why

Recorded so nobody invents them later and attributes them to this document:

**≥5 prior exposures before an opponent may deal** · **≤20-word explanations** · **≤14 px score delta / ≥17 px explanation text** · **correction within 300 ms** · **no screen idle >2 s** · **8–12 minute matches** · **≥40 scored retrievals per 10-minute session** · **a 60/40 content-vs-game-feel budget split** · **re-queue at 5 and 15 intervening items** · **1-match-in-5 anxiety sampling** · **a 3-row leaderboard** · **at least three typefaces per word** · **at most four chunks on the resolution screen** · **retire an item after 4 successful retrievals** · **a ~1.5–2 s anticipation beat**.

**None of these appears in, or is derivable from, any cited source.** Every one was an invented product decision wearing a citation. The px values additionally need restating in rem with a stated contrast ratio or they fail SC 1.4.3 and 1.4.4 on arrival. Where this document needed a number in one of these slots, it is tagged **[J]**, it has an owner, and it has a test.