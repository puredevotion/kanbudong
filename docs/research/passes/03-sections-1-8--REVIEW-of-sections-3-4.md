## A. Chinese-language content errors — these ship as wrong content

### A1. The U+2EBC block is wrong, and it is wrong in the build gate

> "**⺼ U+2EBC lives in the Kangxi Radicals block** and appears in *no* item string" (§3.3.4)
> "⺼ **U+2EBC lives in the Kangxi Radicals block** and appears in no item string" (§4.3.2 gate 2)

Verified: `U+2EBC ⺼ CJK RADICAL MEAT` is in the **CJK Radicals Supplement** block (U+2E80–U+2EFF). The **Kangxi Radicals** block is U+2F00–U+2FDF; its meat radical is a different codepoint entirely, and U+2F82 — which is where a reader counting from radical 130 would land — is `KANGXI RADICAL MINISTER ⾂`.

This is not pedantry, it is the failure mode the passage exists to prevent. An engineer implementing gate 2 from this sentence writes `pyftsubset --unicodes=U+2F00-2FDF` to "cover the radical block," the assertion for U+2EBC is never satisfied by that range, and the decomposition panel renders tofu — or, per the doc's own worst case, falls back to a face that substitutes 月. The sentence appears three times (§3.3.4, §4.3.2, §4.11 gate 8), so a reader has three chances to internalise the wrong block and none to catch it.

**Should say:** "⺼ U+2EBC lives in the **CJK Radicals Supplement** block (U+2E80–U+2EFF), not in Kangxi Radicals (U+2F00–U+2FDF). Enumerate the codepoint explicitly; never subset by block range."

### A2. The correction contradicts itself about whether ⺼ and 月 look different

> "肉 does not 'flatten to 月' — it has a *distinct bound form*, ⺼"
> "They are **homoglyphs in almost every font** and different codepoints."

Both sentences are in §3.3.4, four lines apart. They cannot both ground the pedagogy. And the resolution matters more than the doc realises: in the PRC 新字形 standard that Noto Sans SC implements, the meat component inside 肝 肠 肚 is drawn *identically* to 月 — two horizontals touching both verticals. The distinct "meat" form with detached/slanted inner strokes is the Kangxi/traditional convention. So the standalone ⺼ glyph the reveal panel renders may show a shape the learner will **never** see inside any character in a Simplified-only bank.

That is a transfer-appropriate-processing violation by §3.2's own argument, committed by the fix to §3.3.4. The doc's absolute rule —

> "**never substitute 月**, which reintroduces the exact error this ruling exists to remove"

— conflates *identity* with *rendering*. Identity: the component is not 月, correct. Rendering: the correct picture of the component as it appears in this product's face may be exactly the 月 shape.

**Should say:** component identity is a stored abstract ID, never a codepoint; the rendered glyph is the actual sub-glyph as it appears in the shipped face for that character (extracted or stored SVG), **primary**, not a fallback. Then assert at build time that the panel glyph and the in-character sub-glyph are the same shape.

### A3. 汆 vs 氽 — the doc commits its own flagship 人/入 error

> "verified to contain all 3,000 HSK 3.0 characters *and* 焗 煲 涮 菌 藕 韭 笋 蒜 姜 葱 炝 烩 **氽** 煨 熘 腌 蕈 蚝 蛏 鲈 鳕 鳝" (§4.3.2)

Verified: `氽 U+6C3D` (tǔn — to float; deep-fry) and `汆 U+6C46` (cuān — to blanch/quick-boil) are different characters. The **cooking method** in that list is 汆 (汆丸子, 汆烫). The doc lists 氽. The two differ by 人 on top versus 入 on top — the precise confusion §3.4 nominates as "**critical**… the canonical beginner error."

A font-coverage verification list that itself contains the canonical beginner error is not a verification list. And the error is invisible: both codepoints are in the subset, so the gate passes.

**Should say:** 汆 (U+6C46). And add to §4.11: the item bank is checked against a homoglyph blacklist (人/入, 己/已/巳, 未/末, 日/曰, 千/干/于, 氽/汆, 戍/戌/戊) at authoring time, with codepoints written into the source, not characters.

### A4. The traditional-variant example is directionally incoherent

> "A one-to-one mapping generates 頭發 for 头发 and 牛肉面 for 牛肉麵."

First half: input 头发 (simplified), wrong output 頭發, correct 頭髮. Frame = *(wrong output, simplified input)*.
Second half: 牛肉麵 is the **correct traditional output**, not the input. Frame = *(wrong output, correct output)*.

The sentence switches frames mid-clause, in the one paragraph in the document about getting a mapping's direction right. An implementer reading it cannot tell whether the table maps simp→trad or trad→simp.

**Should say:** a two-column table with an explicit header — `input (simp) | naive output | correct output`: `头发 | 頭發 | 頭髮`; `牛肉面 | 牛肉面 | 牛肉麵`.

### A5. "Directional-complement signs" — none of the eight is a directional complement

> "**Ship directional-complement signs as atomic whole units** — 入口, 出口, 上车, 下车, 进站, 出站, 过街, 回收"

A directional complement in Mandarin is the V+来/去 construction (出去, 进来, 跑上来). 入口/出口 are verb-noun compounds; 上车/下车/进站/出站/过街 are verb-object; 回收 is a coordinate compound verb. Zero of the eight is a directional complement. In a Chinese-language product, a wrong grammatical label propagates into reveal copy and into the rationale for the `atomic` tag.

**Should say:** "Ship short verb-object and verb-noun signage compounds as atomic whole units."

### A6. The 食/饣 count doesn't match its own list, and buries the one character that matters

> "**饣** — 43 common characters … against **12** for 食, which are mostly traditional or rare (食 飧 飨 餍 餐 餮 饔 饕)."

The parenthesis lists **eight**, not twelve, with no ellipsis (unlike the 饣 list, which has one). Either the count is wrong or four characters are missing. And "mostly traditional or rare" is false of the set as scoped for *this* product: 餐 is in 餐厅, 早餐, 午餐, 晚餐, 中餐, 西餐, 自助餐 — it is on more menu headers and fascias than most of the 饣 set. The doc dismisses it in half a sentence ("does not rescue the choice") without noting it is Tier-1 vocabulary for the exact domain being argued about.

### A7. 页 is written off using a payoff test the document's own §4.9.3 fails

> "**页** (from 頁, head) yields 顶 顺 须 顾 颈 项 领 颜 额 题 — **essentially zero menu or signage payoff**."

§4.9.3 ships a mini-programme checkout template with real transactional Chinese. That surface contains 余额 (balance), 领取 (claim), 领取优惠券, 订单 (not 页, but adjacent), 问题. 领 and 额 are unavoidable there. "Essentially zero payoff" is a claim about a bank that the same document defines to include a payment UI.

### A8. Smaller Chinese points, all verified

- **药店/酒店 is miscategorised by the doc's own taxonomy.** > "**药店 and 酒店 share no component at all** (艹+约 vs 氵+酉) — they are priority 2." The *characters* 药/酒 share nothing, correct. But the **words** share 店 outright. Under §3.4(3) that is `shared-morpheme`, the fourth category the doc invents. The document spends §3.3.3.5 insisting word-level and character-level decomposition are different fields and then analyses a word pair at character level and files it in the wrong bucket.
- **The confusable set contradicts itself in one sentence.** > "plus the pure visual set 大/太/**犬**/夫, 日/白/百/自, 千/干/于, 未/末, 己/已/**巳**, 天/**夭** … **Drop** the classic teaching-list pairs **夭** and **巳** and **曰/犬**". 夭, 巳 and 犬 are kept and dropped in consecutive sentences. Separately, "曰/犬" is not a confusable pair in any script — 曰 (yuē) and 犬 (quǎn) share nothing. It reads as a mangling of the two real pairs 曰/日 and 犬/大.
- **筋's radical is named in the wrong register.** > "**筋** carries it inside 肋 (⿱⺮肋, where 肋 = ⿰⺼力) but takes **⺮ (bamboo)** as its Kangxi radical." The decomposition is right (肋 lèi = rib; 筋 indexes under 竹 with 6 residual strokes). But ⺮ is U+2EAE `CJK RADICAL BAMBOO`; the *Kangxi radical* is 竹 / U+2F75. The paragraph whose thesis is "bound form and head form are different codepoints and confusing them is a build defect" confuses bound form and head form.
- **男 gets a hedge in a passage that bans hedges.** > "**男 is not a radical at all** (it is 田 + 力 and **indexes under one of those**)." It indexes under 田, kRSUnicode 102.2. A document that CI-fails hand-authored stroke counts should not write "one of those."
- **"9 of the 13 core cooking methods"** — the 13 are never enumerated. The doc's §3.3.2(b) case against Hsiao & Shillcock is *precisely* that a ratio with an unstated denominator is not a finding. Same move, two pages later, in the doc's own voice.
- **The 小心地滑 example is misfiled.** > "A naive per-character generator gets **小心地滑** — the most famous sign in China — wrong." The problem in 小心地滑 is **segmentation** (小心|地滑 vs 小心地|滑), which is §4.7's word-tokenisation issue, not §4.6.5's heteronym issue. And a naive generator emitting the citation reading dì gets this sign *right*; the failure is in the other direction (慢慢地走). The doc's flagship heteronym example is not a heteronym failure.
- **Correct and worth saying so:** 猪/羊/鸡/鸭肉, 肝 肠 肚 腰 脑 肺 肾 胗, 保质期/生产日期, 行 háng/xíng in 银行/行李寄存, 舌 = ⿱千口, 血/皮/舌 taking their own radicals, 蒸 containing 灬 inside 烝, the nine 火/灬 cooking methods, the T3-sandhi set (水饺 米粉 老板 两碗 九点), 不 → bú before T4, 一 → yì/yí, 好吃 as T3+T1 needing no stored surface field, 安全出口 vs 出口, the GB 2894 four-category colour/shape system, the 麻/辣 and 公斤/斤 analyses, and the many-to-one variant set (面→麵/麪, 发→發/髮, 干→乾/幹/干, 后→後/后, 里→裏/裡/里, 松→鬆/松). Those are right.

---

## B. The [E]/[J] apparatus fails on its own terms — this is the structural failure

§3.0 makes one promise:

> "Every line below belongs to one of two registers, and the register is stated: **[E] evidence-licensed, with the source and its scope**, or **[J] judgement call, with an owner and a planned test**."

Three ways the promise is broken, each of which reopens the exact folklore channel the split was built to close.

### B1. A third register was invented and never defined

`[E-adjacent]` (§4.4.1 ground colour, §4.7 answer-row gap), `[E-anchored]` (§4.2.1, §4.6.2 ×2), `[E-anchored, magnitude approximate]` (§4.7), `[E-anchored / J magnitude]` (§4.2.1). None appears in §3.0. There are five registers, not two.

`[E-adjacent]` means, operationally, "I could not source this but it feels evidenced." That is the definition of the layer §3.0 says was graded folklore. **The undefined middle tier is the new folklore slot, and it is where the 8 px answer-row gap and the dark-mode ground colour already live.**

### B2. [E] is being conferred by internal cross-reference

> "**Forced transfer** (already binding from §9–12…): `contexts: Set<TemplateId>` with graduation gated on `contexts.size >= 3`; a naked probe at 10–15% of presentations; … with **>20 points meaning the app is teaching plates**. **[E]**"

Three bare numbers — 3, 10–15%, 20 — tagged [E], sourced to a section of this same document. A cross-reference is not a source and does not carry a scope. If §9–12 tagged them [J], §3.2 has laundered them to [E]; if §9–12 tagged them [E], the citation belongs here. Either way, this is "≥5 exposures, per Horwitz et al." with the fabricated author replaced by a section number — the same mechanism, harder to audit, because the reader has no external object to check.

### B3. §4.12 bans a number that §3.4 ships

> §4.12, banned as invented: "**re-queue at 5 and 15 intervening items**"
> §3.4(2), shipped: "Schedule confusion-set members tight (**5–15 intervening items**, **[J]** magnitude)"

The same two numbers, in the same slot, declared folklore in one section and shipped in another. Tagging it `[J]` does not rescue it: §3.0 requires [J] to carry *an owner and a planned test*, and §3.4(2) carries neither. The [J] tag is being used as a laundering device for exactly the numbers §4.12 exists to kill.

The same pattern hits §4.12's ban on "at most four chunks on the resolution screen" versus §4.9.2's "One target. One decomposition. One contrast" — a three-element cap. The doc's stated reason for killing Cowan is:

> "a screen whose elements all remain visible imposes essentially no storage demand — the display *is* the memory"

If that argument is sound, it also destroys any *numeric display cap*, including 1+1+1, because element interactivity constrains how many elements must be **simultaneously integrated**, not how many may be **displayed**. Sweller and Mayer are substituted for Cowan and the number survives untouched. **The cap was retained and only its citation changed.** That is a restatement presented as a derivation.

### B4. Untagged lines in a document whose thesis is that every line is tagged

§3.3.2(d) "The reveal card is heading for overload" — no tag. §3.3.2(e) "Radical awareness develops with exposure" — no tag. §3.4 "公斤/斤 … is justified by *consequence*, not by the discrimination literature" — "consequence" is neither [E] nor [J]. §3.5(4) "for the first **200 items**" — a bare number with no register at all.

---

## C. Rulings that do not follow from their findings

### C1. §3.1 — "CONTRADICTED" is a headline the section refutes

The ruling is **CONTRADICTED**. Then:

- §3.1(1) keeps the bet ("a points stake and a handicap").
- §3.1(10) "Never let the harder **tier** carry the shorter timer" — tiers survive.
- §3.1(11) "Grey unearned **tiers**… gate the top tier on per-category component mastery" — tiers survive and are gated.
- §4.10.3 "The inherited **45 s / 75 s / 120 s bet windows**" — three tiers, three timers, still in the spec.

A ruling of CONTRADICTED that leaves the mechanic, the tier ladder and three per-tier timers standing is a ruling on the *rationale*, not on the decision. §3.2 handles the identical situation honestly ("What survives is narrower than what was proposed"). §3.1 does not, and the asymmetry is not accidental: §3.1 is one of the three invented decisions.

**Should say:** "**SUPPORTED** as a wagering and handicapping mechanic (systems cluster). **CONTRADICTED** as a scaffolding dial: response format is decoupled from the wager. The tier ladder survives as a stake ladder only."

### C2. §3.1(f) argues against a design §3.1(7) already deleted, and omits the shipped format

> "Holding observed accuracy at 0.85 gives true R = 0.700 in 2AFC, 0.800 in 4AFC, 0.850 in free recall — the weakest players on the easiest format sit at the *lowest* true retrievability, the exact inverse of intent."
> "to hit true R = 0.85, target observed 0.925 in 2AFC, 0.8875 in 4AFC, 0.85 in free entry."

Arithmetic verified correct for k=2 and k=4. **k=3 is absent from both tables, and k=3 is the format this document ships** (§3.1(7), §4.8.1, §4.9.2). The missing values are R = **0.775** (from observed 0.85) and observed **0.900** (for true R = 0.85).

Worse: argument (f) depends on *k varying across tiers*. §3.1(7) fixes k = 3 everywhere. With k constant, the guessing floor is constant, the tier-vs-retrievability inversion disappears, and (f) no longer argues against anything. The document runs an argument against a configuration it has already removed, and computes it to four significant figures in the two formats it will never use.

### C3. §3.1(2) violates §3.1(9) seven lines later

> (2) "the engine chooses the ITEM within an Elo band of the target player, **targeting ~75% success** (Klinkenberg et al. 2011, Math Garden…)"
> (9) "**Express any accuracy target in retrievability, never in observed accuracy**"

Math Garden's ~75% is an **observed accuracy** target in arithmetic. At k=3, observed 0.75 corresponds to true R = **0.625**. The scheduler is therefore instructed to hold learners at R ≈ 0.63 while the same numbered list tells FSRS to advance stability from those trials — and FSRS's own tuning target is R ≈ 0.9. Nobody reconciles the two. Rule (9) is correct; it is broken by rule (2) in the same list, and the doc's own identity makes the violation computable.

**Should say:** "target true R ≈ 0.75, i.e. observed **0.833** at k = 3 (Klinkenberg's ~75% is observed accuracy in a non-MC arithmetic task and must be converted before use)."

### C4. §3.1(7) — Rodriguez is recruited, then violated, and the layout argument doesn't bind

> "**Three options, not four.** [E — strong] Rodriguez (2005)… three options optimal… — *but only if the retained options are the effective ones*. Random removal reduces difficulty, discrimination and reliability."

§3.4 then defines the distractor generators as visual neighbours and situational neighbours — i.e. the **most** effective distractors available. Going 4→3 there removes an effective option, which is the condition Rodriguez says degrades the item. And §3.4(1) mandates that first appearances get "semantically and visually **unrelated** (but domain-plausible) distractors" — weak distractors, two of them, in a three-option item. The doc's own closing bullet says weak filler is "destroying Rodriguez's three-option result." **§3.1(7) and §3.4(1) are mutually destructive and neither notices.**

Meanwhile §4.8.1 says "**The interface cluster binds**" and justifies it with Parhi's 58 px row height. Row height does not constrain option count. Four rows at 62 px with 8 px gaps = **272 px**; the doc's own allocation is "bottom **~45%** of viewport" = **380 px** on a 844 px phone. The layout has ~108 px of slack. **The thumb-zone argument does not require dropping to three options**, so the entire weight rests on Rodriguez — whose stated precondition the design then violates.

Also: Rodriguez is a meta-analysis of **assessment efficiency** (items per unit testing time, psychometric properties of a test). Importing it as a *learning* result into a spaced-repetition loop is a scope jump the doc flags meticulously for every other citation ("lab, English prose, short delays"; "arithmetic, Dutch schoolchildren") and not at all for this one — the one it calls "the single strongest psychometric claim in play."

And this ships an authoring error as prose:

> "it lowers the guess floor from 25% to 33%… no: it *raises* it to 33%, and that is the price."

Delete the self-correction. State 1/3 = 33.3%, and state the consequence: every retrievability target and every FSRS input changes.

### C5. §3.2 — the one surviving [E] is the only one with no source

Every cited mechanism is killed: context reinstatement (d ≈ 0.28, recognition null, failed replication), picture superiority, perceptual disfluency. What is left standing, and what licenses the entire substrate-rendering programme:

> "**Transfer-appropriate processing plus encoding specificity.** [E — strong] The effective retrieval cue is *the character form as it will be met*."

No source. No scope. §3.0 defines [E] as "with the source and its scope." **The single most consequential [E] in §3.2 is the only one that carries neither** — in the section ruling on one of the three author-invented decisions.

The reasoning defect underneath is sharper. The doc uses the recall/recognition dissociation to kill context reinstatement:

> "Godden & Baddeley found a substantial effect for free **recall** (1975) and essentially **none for recognition** (1980). This product is recognition throughout."

**Encoding specificity is the same principle.** If the recognition null voids context reinstatement, it voids the encoding-specificity half of the surviving argument too. The doc escapes by reclassifying:

> "the rendering is not environmental context at all — it sits *inside* the stimulus at both study and test."

But that reclassification is fatal in the other direction, and the doc never follows it through: if the plate is *inside the stimulus*, then the app is training the compound stimulus glyph+plate, and Masonheimer is not a "documented risk" to instrument — **it is the mechanism section's own prediction.** §3.2 files as a contested side-risk the thing its own framing entails.

**Should say:** "**SUPPORTED** for typeface-class variation, on stimulus-variability grounds (Pelzl 2025, heavily scoped). **[J], instrumented from v1**, for substrate and object rendering: the surviving argument is TAP applied to a compound stimulus, which predicts the Masonheimer failure as its default outcome rather than as a risk."

### C6. §3.2's "deliberately hard to read is struck" — it is not struck, it is re-licensed

> Ruling: "The 'deliberately hard to read' clause is **CONTRADICTED and is struck**."
> Change 3: "a hard-to-read treatment ships **only** when it faithfully reproduces signage the player will actually encounter — a weathered fascia, a grimy label, a low-contrast neon"
> §4.4.2: "The target glyph clears **4.5:1** in every treatment"

A treatment whose target glyph clears 4.5:1 is not hard to read. So either the clause is struck (and change 3 describes ordinary substrate fidelity, and should say so without the phrase) or it survives under a new name and a designer will ship "authentically low-contrast neon" at 4.5:1 and call it fidelity. The phrase "hard-to-read treatment" should not appear anywhere after the ruling.

**Evasion:** the section header names "**two treatments deliberately hard to read because real ones are**" and never identifies them or disposes of them individually. Which two? What happens to each? A ruling was asked for on two specific artefacts and a general principle was returned.

### C7. §3.3 — the derived decision gets the harshest scrutiny; the invented ones get the generous headlines

§3.0 warns: "three of the five design decisions were invented by the author, so check every 'supported' ruling for real support rather than restatement." The document then does the inverse.

Decision 3 is the one it calls "derived rather than invented" — and §3.3.2 hands it five defeaters: ~47% of the core bank has no compositional path; the two-slot card honestly describes **13.0%** of the top 100; the phonetic hint is exactly right **16.9%** of the time and useless **35.4%** of the time; the reveal card is overloaded; radical awareness needs prior exposure. Decisions 1, 2 and 4 — all invented — get CONTRADICTED-but-retained, SUPPORTED-on-an-uncited-claim, and SUPPORTED-covering-zero-examples respectively.

And §3.3's [E] carries a scope violation the doc flags nowhere:

> "a **three-week course** covering orthographic knowledge plus ≥7 radicals/week produced gains… (Nguyen et al. 2017, n = 54, quasi-experimental; Chen et al. 2013, N = 129, 3 weeks)"

Two three-week explicit-instruction curricula licence **"a tap-gated post-answer reveal surface"** in a party game. The doc even concedes the gap and then closes it rhetorically:

> "**A tap-gated post-answer reveal surface is the resolution of that apparent contradiction**"

That is an assertion, not a finding. No study of tap-gated post-answer component reveals exists in the evidence chain. It should be **[J], owner, test = tap-open rate**.

Which raises the omission that could kill the feature outright: §4.9.2 gives the reveal **~800 ms** of hanzi-alone plus a **~2,000 ms** minimum dwell, in a co-located game where the table sees "Player 2 is answering." **The best-supported layer in the product is gated behind a voluntary tap inside a ~2 s socially-observed window, and the document never asks whether anyone will press it.** If tap rate is 8%, the "primary optional layer" is dead content and §3.3's whole evidence base is irrelevant to the shipped product.

### C8. §3.3.3 contains a direct, unimplementable contradiction about 出口

> (3) "`transparency` enum … **牛肉 and 出口 branch to a component gloss**"
> (8) "`isCompositional` (**出口 yes**; 保质期, 时价, 招牌, 方便面 no)"
> (12) "Ship … 入口, **出口**, 上车 … tagged `atomic`, **never decomposed**"

Three numbered required changes in one list. Two say 出口 decomposes and gets a component gloss; one says it is atomic and never decomposed. An implementer cannot satisfy all three.

Separately, (8)'s non-compositional list is wrong on its own terms: **方便面** = 方便 (convenient) + 面 (noodles) is the textbook transparent compound, and **保质期** = 保质 + 期 is close behind. Both are marked `isCompositional: no`. This is the word-level/character-level conflation that §3.3.3(5) exists to forbid, committed in the examples for §3.3.3(8).

And (11)'s callback text — "**you have seen 肉 before**" — asserts the identity between 肉 and ⺼ that §3.3.4 spends a full sub-ruling denying. The prose was fixed in one place and left standing in another.

### C9. §3.4 — the ruling headline says "one of three"; the body says zero

> "**SUPPORTED** … covering **one of its three worked examples**"

Body: 公斤/斤 — "no form similarity… Do not cite Li & Shi for it." 麻/辣 — "no form similarity at all… Do not present it as an instance of the same principle." 入口/出口 — "**do not treat 入口/出口 as the maximal-interference case**," and §3.4(3) files it as `shared-morpheme`, "**a fourth category no cited study covers**."

Zero of three are cleanly in scope. The headline overstates by one, which is the difference between "we have a validated mechanic with two out-of-scope extras" and "we have an abstract-only beginner study and three examples none of which it covers."

**Should say:** "**SUPPORTED** for form-confusable pairs in absolute beginners, on one abstract-only study (Li, Shi & Wang 2025) plus an off-hanzi interleaving meta-analysis. **None of the three worked examples is cleanly in scope.** Ship the panel as the MC-lure mitigation, which is separately evidenced, and instrument the discrimination claim."

**Evasion:** having ruled that 麻/辣 and 公斤/斤 are not instances of the principle, the document never says whether they ship. A ruling was requested on the decision as stated; two-thirds of it is left in limbo.

### C10. §3.4 voids the classical literature and then imports RIF, which needs the same structure

> "the classical work describes learning two *new* competing responses to a shared cue in list-to-list transfer, not discriminating one new sign from another in a recognition task **with the cue physically present**."

Correct, and well argued. Then:

> "Retrieving one member of a competing pair suppresses the other by **≈8.7 percentage points** (RIF, strong, lab-wordlist, minutes to a day). … **A deck that quizzes 出口 and never 入口 is actively degrading 入口.**"

Retrieval-induced forgetting requires competitive retrieval from a shared cue — precisely the structure the previous paragraph declared inapplicable "with the cue physically present." It is measured on lab word-lists over **minutes to a day**; the doc's own scheduler enforces "**≥24h between correct repetitions**" and the product's retention interval is months. Same evidence class, opposite treatment, and the direction of the inconsistency is the one that adds a scheduler feature.

And ≈8.7 percentage points is quoted to one decimal as a magnitude to design against, five paragraphs after the doc says magnitudes are provisional.

**Should say:** "RIF predicts a *direction* — asymmetric deck coverage may suppress the untested sibling — but it is lab-wordlist, minutes-to-a-day, competitive-retrieval, and the cue-present objection above applies with equal force. **[J]**: mark family members due-soon; test on delayed accuracy for the untested sibling. Drop the point estimate."

### C11. §3.4's lure budget prices a quantity this product never measures

> "5% when not previously tested, rising to **12% a week after testing**… **Budget ~7 percentage points of lure intrusion as the price of MC**"

12 − 5 = 7, arithmetically fine. But the measured outcome is **production of lures as answers** on a later recall test, in English prose, with university samples. §3.4 rules: "**never add a production mode**." The product has no test at which the measured quantity can occur. A 7-point budget for an outcome that cannot be observed in this product is false precision wearing a real citation.

What plausibly transfers is increased lure *familiarity* in a recognition task — a different, unmeasured quantity with no number attached. Say that instead.

### C12. §3.5(2) applies an auditory-perception finding to a visual mark that §3.5(7) abolishes

> "**prefer a contour glyph with the turning point marked** over a colour swatch. The timing of the F0 turning point (near onset for T2, mid for T3) is the discriminating cue non-tonal-L1 learners actually fail to use; L2 listeners lean on duration instead. [E — moderate; Zou, Caspers & Chen on Dutch L1 learners specifically, abstract-only]"

Three problems stacked:
1. **Scope violation of exactly the named kind.** This is a finding about where **listeners** fail to attend in an **acoustic** signal, used to specify the shape of a **printed mark** in a **silent reading** product. The doc scopes it as "abstract-only" and "Dutch L1" and omits the one scope note that matters: *auditory perception, not visual encoding*.
2. **It specifies a thing the same section abolishes.** §3.5(7): "**v1 ships no tone channel as a thing to be learned.**" §4.5.4: "Not shipped in v1."
3. §3.5(4) then constrains an object that does not exist: "**exclude the T2↔T3 swap from any pinyin distractor pool for the first 200 items**" — but §4.6.5 confines pinyin to the reveal and §3.5(7) says pinyin "appears as a pronunciation aid on the reveal, and that is all it is." **There is no pinyin distractor pool.** Plus "200" carries no register at all.

---

## D. Contradictions that make §4 unimplementable as written

### D1. §4.2.1 sizes the prompt with the reasoning §4.2.2 strikes

> §4.2.2: "it is a **category error** — it derives from a **6-observer acuity-threshold study** (Zhang et al. 2007, IOVS), and **threshold-derived compensation does not transfer to a display running 5–10× above threshold.**"
> §4.2.1: "**Why the prompt is this large.** Chinese readers need roughly **1.7–2.0× the ETDRS acuity size** Latin readers need at equivalent legibility."

ETDRS is an acuity chart. The 1.7–2.0× ratio is threshold-derived. It is the sole stated justification for the 64–80 px prompt, and it is struck one subsection later by name. Same page, opposite rulings, both [E].

### D2. §4.2.2 rule 1 contradicts §4.2.2 rule 3

> "1. **Set one generous global size, safe for the most complex character in the bank, and stop.** [E]"
> "3. … if a build-time `strokeCount` … is **≥ 15**, the item renders **one step up the type scale and at weight 500**."

Rule 3 makes size a function of stroke count. Rule 1 says do not. Calling rule 3 "one bounded concession" does not dissolve the contradiction; it means rule 1 is wrong as stated and should read "size is not a *continuous* function of stroke count; one threshold step is permitted."

### D3. The ≥15-stroke list is contradicted by §4.3.2, and both claim in-session verification

> §4.2.2: "**The characters in this bank that trip it**, verified in-session against makemeahanzi: **警 19, 藏 17, 燥 17, 糖 16, 醋 15**." **[E — strong]**
> §4.3.2: "verified to contain … 藕 韭 笋 蒜 … 蕈 蚝 蛏 鲈 **鳕 鳝**" **[E]**

鳕 (~19), 鳝 (~20), 藕 (~19), 蕈 (~16) are all ≥15 and all in the bank by §4.3.2's own verification. So is **餐** (16) — unavoidable in 餐厅 on a menu-and-fascia product — and **罐** (23, 罐头), **蘑** (19, 蘑菇), **糕** (16, 蛋糕), **熟** (15, 熟食), **额** (15, 余额 on the checkout template).

A five-item list presented as exhaustive ("the characters in this bank that trip it") is contradicted twenty paragraphs later by the same document. Whichever list is right, **both are [E — strong] and both claim in-session verification**, which means one of the two verifications did not happen. And the consequence is silent: the ≥15 rule under-fires and the heaviest glyphs in the bank render at the base step.

**Should say:** delete the list. The document's own rule already covers it — "`strokeCount` is derived programmatically and asserted at build time. **There is no hand-picked list.**" A hand-picked list of which characters trip the automated gate is the same defect one level up.

### D4. Four size multipliers, no composition rule, and a CI gate that they break

Dark mode **+15%** (§4.4.1) · `strokeCount ≥ 15` **+1 step** (§4.2.2) · street mode **×1.4** (§4.2.1) · **200% OS text scaling**, which §4.11 gate 2 **fails CI on**.

No order of operations, no cap, no interaction rule. An 80 px prompt in dark mode, street mode, on a ≥15-stroke item, at 200% OS scale exceeds 250 CSS px for a single glyph — a four-character sign will not fit on any phone. Either the gate fails or the layout breaks, and the document does not say which, or which multipliers compose and which are alternatives.

### D5. §4.1 and §4.4.2 use two different pt→px ratios, both [E — strong]

> §4.1: "**Never use CSS `mm`, `in`, `pt` or `cm` for physical sizing.** They are nominal." (160 CSS px/in ⇒ 18 pt = **40 CSS px**)
> §4.4.2: "the exemption drops SC 1.4.3 AA to 3:1 at **≥24 CSS px** (or ≥18.66 px bold)"

24 and 18.66 are 18 pt and 14 pt bold at **96 px/in** — the nominal ratio §4.1 just banned. §4.4.2 is in fact correct (WCAG's thresholds are defined in CSS px, with 1 pt = 1.333 px), but §4.1 has removed the reader's ability to know that, and the document never reconciles them. One sentence fixes it: "**WCAG's px thresholds are CSS px and are unaffected by §4.1; §4.1 governs physical sizing only.**" Without it, a careful implementer computes the large-text threshold as 40 px and quietly changes the contrast regime for the whole app.

### D6. §4.10.3 bans speed scoring and then reintroduces it as a tiebreak

> "**Never award points for speed.** Score correctness only; **break ties on total round time.**"

A tiebreak on total round time makes speed instrumentally valuable and restores exactly the pressure §3.1(g) prices at d ≈ 0.35 and §4.10.1 removes the visible countdown to avoid. If speed must not matter, break ties on fewest lure selections, or declare a draw.

Same subsection keeps three numbers it has already superseded: "the **inherited 45 s / 75 s / 120 s** bet windows" survive alongside "**set the window near the 90th percentile**" of measured latency. Delete the inherited numbers; they are §4.12 candidates sitting inside §4.10.

### D7. §4.5.5 uses a model it has just declared uninformative

> "**Every published spaced-repetition model discriminates item-level recall near chance** in a real language-learning product (all within 0.04 AUC of chance…). **A precise wrong number is a visible lie.**"
> "…where **SOLID silently falls back to LEARNING as retrievability decays**, surfaced as *'3 characters need a refresh.'*"

The fallback and the count are driven by the same near-chance item-level retrievability estimate. So is FSRS scheduling throughout §3.1(9) and §4.9.3. Either the model is informative enough to schedule with and to state coarsely, or it is not. The document reaches the right rule — item-level AUC near chance is compatible with useful aggregate calibration, which is exactly why deck-level and coarse states are defensible — and never states the reason, leaving the rule undefended against the first reviewer who reads the AUC sentence literally and asks why FSRS is in the build at all.

### D8. Two smaller ones

- §4.8.1: "Minimum interactive height, anywhere: **56–60 CSS px** [E] Parhi; error rate stops improving above 9.6 mm." 9.6 mm = **60.5 px**; the cited floor is 9.2 mm = **58 px**. **56 is below both** and unsourced, and §4.11 gate 6 will be implemented at 56. Set it at 58.
- §4.8.1: "plus the **retrieval-support argument**: adjacent on-screen items reduce the difficulty of the retrieval attempt" — offered as the reason to ban a *preview of the next item*. A next-item preview provides no retrieval support for the current item. The stated mechanism does not fit the banned artefact; coherence alone does the work.

---

## E. False precision

- **The arcmin column in §4.2.1 (42.4 / 48.5 / 60.6–72.8 / 97–121).** Verified internally consistent, and indefensible to one decimal. It rests on two nominal assumptions: 160 CSS px/in (real devices bucket roughly 140–180; an iPhone 15 Pro is ~153) and a 360 mm viewing distance whose own cited SD is **±71 mm**. At ±1 SD of distance alone, 28 px spans **35.5–52.9 arcmin**. Reporting 42.4 arcmin in the section that exists to punish false precision is the document's own trap closing on it. Report ranges or delete the column.
- **§4.1's constant is the same category error with a better number.** "Phones render approximately 160 CSS px per physical inch" is not a fact about phones; it is Android's nominal `dp` definition, which real densities bucket around. The doc's conclusions survive — use generous sizes, stop doing per-character arcmin arithmetic — but it should say so: "6.3 px/mm is a **design assumption with a ±15% device spread**, not a measurement," rather than "[E — strong; arithmetic and standards]."
- **≈8.7 percentage points** (RIF, §3.4) — one decimal on a lab-wordlist effect being applied across a scope gap of months.
- **~7 percentage points** of lure intrusion (§3.4) — budgeted for an outcome the product cannot produce.
- **0.8875** (§3.1(9)) — four significant figures for k = 4, a format this document does not ship, with k = 3 absent.
- **"43 common characters" for 饣 against "12" for 食** — where the 食 list has eight members.
- **"9 of the 13 core cooking methods"** — denominator never enumerated.

---

## F. Silent omissions

1. **§3.2 has three cluster verdicts, not four.** §3.0: "Four verdicts were returned per decision, one per cluster." §3.2 lists learning-science, interface-social, systems. **The chinese cluster is missing** — on the decision about rendering Chinese signage, the one whose evidence section is full of chinese-cluster material (楷体/隶书/行书, GB 7718, CTW `wordart`, 繁体字 on fascias). Either it abstained, in which case say so, or its verdict was dropped.
2. **§3.2(9) puts transit at 5% while every worked example in the document is transit.** §3.4: "人/入 … sits at the centre of the **flagship metro scene**." §4.4.3's worked example is a station plate. §3.2's TAP example is 出口 on a metro plate. §4.6.2's ruby example is 出口. A 5% pillar cannot be the flagship scene. And the rebalance argument is one-sided: bilingual metro signage is also the only place a learner gets **free in-situ corrective feedback** on a wrong reading, which is an argument *for* front-loading it in a product that provides no feedback after the session. That counter-consideration is never raised.
3. **§4.4.3 contradicts §3.2(8)'s non-picturable list.** §3.2(8) lists **禁止** as non-picturable; §4.4.3 says the prohibition sign is a red circle with a diagonal bar, so that "the illocutionary force arrives **before any character is decoded**." That is a picture, and more than that it is the overshadowing hazard §3.2(8) is about. **The safety pillar (15% of the bank) may be systematically unlearnable-by-character because the geometry answers the question first.** Neither section notices the other.
4. **§4.9.3 licenses the small-type exception by relabeling the task.** "The task is not *'what does this character mean'* but *'tap the button that adds this to your cart'*… **Small type IS the difficulty being taught**, and the pairs that matter — 去结算 vs 取消, 提交订单 vs 加入购物车 — are **transactional, not orthographic**." You cannot tap the right button without discriminating the characters; asserting otherwise is restatement. And 提交订单 vs 加入购物车 differ in length and silhouette, so *that* pair is gestalt-solvable — which proves the template teaches shape, at 16 px, excluded from the naked probe. Either it teaches reading (28 px floor applies) or it does not (why is it in a reading product). The doc takes neither horn.
5. **The document never states, in one place, what a v1 item looks like.** §3.1(4) escalates to "a **two-option** forced discrimination"; §3.1(9) logs the bottom tier as "**2-alternative**"; §4.8.1 hard-codes "**Options: three, not four**" with a three-row diagram; §4.9.2 fixes the reveal at "one row per option (**three rows**)". Whether a pinyin option pool exists is left undetermined across §3.1, §3.5(4) and §4.6.5. Three sections each partially specify the item and they do not compose.
6. **§4.11 gate 10 is narrower than the defect it was written for.** "No item containing **期** tagged with the flesh component." §3.3.4 itself names **期 朗 服 有 望** as misfires. The gate tests one symptom in one character and will pass forever while the next 朗 or 服 ships wrong. §3.3.4's own gate 1 — no highlight rule may reference a character literal — is the real fix; gate 10 is theatre beside it. Replace with: *every item whose string contains a 月-shaped component must carry an explicit per-component record; no rule may match on a character literal.*
7. **进口 is missing from the confusable set** — it is a real entrance sign, shares 口 with 出口, shares 进 with 进站, and additionally means "import." In "the flagship metro scene," its absence from a set that includes 硬座/软卧 is hard to explain.

---

## The three changes that would most improve this text

**1. Fix the three shipping-content errors in §3.3.4 and §4.3.2, then make the correction structural rather than lexical.** U+2EBC is in the **CJK Radicals Supplement** (U+2E80–U+2EFF), **not** the Kangxi Radicals block — stated wrongly three times, including inside the build gate written to prevent exactly this class of bug, where it produces a subset range that silently drops the codepoint. 氽 must be **汆 U+6C46**; the doc's own font-verification list contains the 人/入 error it calls the canonical beginner error. And resolve the contradiction inside the correction itself — "a *distinct bound form*" versus "**homoglyphs in almost every font**" — by ruling that **component identity is a stored abstract ID and the rendered glyph is the actual sub-glyph from the shipped face**, so the panel can never teach a shape that does not occur in the bank. Then widen §4.11 gate 10 from "no item containing 期" to "no rule matches a character literal; every 月-shaped component carries an explicit record."

**2. Repair the [E]/[J] apparatus, because it is currently the folklore channel it was built to close.** Abolish `[E-adjacent]` and `[E-anchored]` — five registers is two registers plus a place to hide. Forbid conferring [E] by internal cross-reference: `contexts.size >= 3`, the 10–15% probe rate and the >20-point threshold are tagged [E] and sourced only to §9–12, which is the "≥5 exposures, per Horwitz et al." mechanism with a section number in place of the fabricated author. Enforce §3.0's own requirement that every [J] carry **an owner and a test** — §3.4(2)'s "5–15 intervening items" has neither, and §4.12 bans those exact numbers, so the tag is laundering rather than disclosing. Add §4.12 entries for the numbers this document itself invented under cover of [J]: ~3 exposures, ~50–100 characters, 5–15 intervening items, 200 items, ~800 ms, ~2,000 ms.

**3. Re-issue the four rulings so the headline matches the body, and admit that the derived decision was scrutinised harder than the invented ones.** §3.1 is **SUPPORTED as a stake-and-handicap mechanic, CONTRADICTED as a scaffolding dial** — "CONTRADICTED" is false when the tiers, the gating and three per-tier timers all survive. §3.2 is **SUPPORTED for typeface-class variation; [J], instrumented, for substrate rendering** — the surviving TAP claim is the section's only uncited [E], and its own framing ("inside the stimulus at both study and test") *predicts* Masonheimer rather than merely risking it. §3.4 covers **zero** of its three worked examples cleanly, not one, and the panel's real licence is the MC-lure mitigation, which is separately evidenced. And §3.3's three-week classroom curricula do not licence a tap-gated reveal inside a ~2 s socially-observed window — that is **[J]**, and its test is tap-open rate, because if nobody taps, the best-supported layer in the product ships dead. While re-issuing: fix the k=3 arithmetic (true R = **0.775** from observed 0.85; observed **0.900** for true R = 0.85), convert Klinkenberg's observed 75% to observed **0.833** at k=3 before feeding FSRS, and resolve §3.1(7) against §3.4(1) — four 62 px rows fit in 272 px of the 380 px allocated, so Parhi does not force three options, and Rodriguez's own precondition forbids the weak-distractor first appearances the design mandates.