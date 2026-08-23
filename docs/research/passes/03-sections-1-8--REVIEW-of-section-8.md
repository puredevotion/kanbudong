The passage under review makes **no claim about the meat radical** — but the repo does, in commit `b775e0c`, and that "correction" is wrong and already committed to three files. That's in section C below. Sections A and B are the reasoning attack and the content audit.

---

## A. Reasoning defects

### A1. The A/B cannot run. Consequences 1, 3 and 9 destroy each other.

> "instrument it as the product's first content A/B, because the literature cannot settle the Dutch–English–Mandarin triad **and your own data can**"
> "**Both glosses appear on the reveal, always** — the rendered one in the body, the other behind a tap."
> "the shared reveal renders the table's host locale"
> "Randomise at the player level at onboarding, keep the toggle available (a player who switches leaves the analysis)"

The entire ruling rests on "your own data can," and the design guarantees it cannot. Every player in both arms sees **both** gloss languages on every reveal — one in the body, one a tap away — and at a mixed table the shared reveal renders in the host's language regardless of assignment. There are no arms. The manipulation collapses to _which of two simultaneously-present glosses is in larger type_, which is not the construct either meta-analysis measured and has no effect size attached to it anywhere.

Then: "a player who switches leaves the analysis" converts an ITT design into per-protocol with differential, outcome-correlated attrition, in a product whose stated primary failure mode is churn. And reason 4 asserts the arms differ in **content quality** — the Dutch column carries hazard qualifiers, units and worked conversions the English column does not — so even a clean contrast would measure authoring effort, not gloss language. The section supplies its own fatal confound and does not notice.

**Should say:** either delete "your own data can" and own the default as judgement, or specify a design that can run — single-language arms with no cross-language reveal, no toggle for enrolled players until the delayed posttest fires, both columns authored to one spec by one author against the same lint rules, ITT with switching logged as an outcome, and a stated MDE. At g = 0.33 that is roughly 145 players **per arm retained to a ≥1-week posttest**; at the smaller effect the section itself predicts, 300–500 per arm. Name the number and name what you do if you never reach it.

### A2. "Four reasons, in order of weight" — and then reason 4 is "the decisive reason."

Flat contradiction on the page. Compounding it: reason 1 is the item the same section calls "**the weakest evidential link in the whole content cluster**," and it is ranked first. Either the list is not ordered by weight, or "decisive" is false, or "weakest link" is false. Fix the ordering or drop the claim that there is one.

### A3. The headline evidence contradicts the majority branch of the ruling.

> "**Default to the user's L1 by locale — Dutch for `nl`, English otherwise.**"

This is not a default to L1. It is a default to **locale**, and for every user outside `nl` — German, French, Spanish, Japanese, Korean — "English otherwise" ships an **L2** gloss: precisely the arm the cited meta-analysis says loses at g = 0.33. The one piece of empirical evidence in the section argues _against_ the branch that will serve most of its users, and the section presents it as support.

Secondary: `nl` locale ≠ Dutch L1 (expats on Dutch-language phones), and there is no `nl-BE` handling — which matters because the crown jewels of reason 4, _pond_ and _ons_, are **Netherlands grocery usage**, weaker in Flanders. A Dutch-language argument is being carried by a Netherlands-specific fact.

**Should say:** "We author two gloss languages because we can afford two. Dutch for `nl-*`, English as the fallback for everyone else — a fallback we know is an L2 for most of them, at an expected cost of about g = 0.33 on the closest available evidence. That cost is accepted, not argued away."

### A4. Reason 2 is a non sequitur, contradicts reason 4, and prices nothing.

> "**The cost of being wrong is small and symmetrical**, because the effect is small."

Effect size is not cost. A small mean is fully compatible with a fat left tail, and **reason 4 asserts exactly that tail**: "pound," which is "**wrong** (454 g)"; "3rd floor… **silently wrong** for a Dutch or British reader." If those rows are true, the cost is asymmetric and reason 2 is false. The two reasons cannot both stand.

The paragraph then slides from _choosing the wrong language_ to _not storing both_ ("retrofitting a second gloss language into a live bank is the expensive version"). That is a different decision, needing no evidence at all, borrowing the appearance of empirical support from a sentence about effect sizes.

And "cheap" is unpriced. Consequence 8 seeds from **CC-CEDICT, which is English-only**; DESIGN.md §9.1 already files "all Dutch glosses" under _authored by us_. So `gloss: {nl, en}` "on every item from day one" means hand-authoring the entire Dutch column, and the section states neither N nor hours while calling the decision cheap. §9.1 costed 1,500 decompositions at two person-weeks. Do the same arithmetic here.

### A5. Reason 3 misuses both L3 theories, and "on its own terms" is false.

> "**The theoretical argument for English is defeated on its own terms** by psychotypological distance."

The L2 Status Factor and the Typological Primacy Model are models of **initial-state morphosyntactic transfer** in L3 acquisition. Neither predicts anything about which language a _translation equivalent_ is printed in. Nobody transfers a grammar when they read "pond" under 斤. The argument for English and its refutation are both category errors — the section built a straw man out of the wrong literature and then knocked it down with a rival model from the same wrong literature. A competing model is also not "its own terms."

**Should say:** "L3 transfer theory is silent here. It concerns morphosyntax, not lexical translation equivalents. Both models are sometimes invoked in this space; neither bears on this decision."

### A6. The dissent is cited, never adjudicated, then silently overruled.

> "And one 2025 dissent reports both gloss languages at medium effect and argues learner preference can decide."

Then nothing. Consequence 9 later rules: "it may not be settled on **preference**, perceived helpfulness or in-session accuracy." The section overrules a source it cited without saying so — in a section that opens by promising the opposite ("first, because this is contested and the digests say so explicitly"). Preference-based selection has a real mechanism for a churn-limited product (engagement → continued exposure), and it deserves a sentence of engagement or an explicit overrule with a reason.

### A7. The section's own evidence predicts its own A/B will find nothing — and it quotes half the moderator.

> "clearest for **beginners** and on immediate posttests"
> reason 1: "points hardest at beginners — exactly this population"

The beginners moderator is quoted as support; the immediate-posttest moderator is dropped. That second half is a **warning**: an effect concentrated on immediate tests is the signature of a support effect that does not survive delay. Consequence 9's only admissible metric is "delayed accuracy at ≥1 week." So the sentence in reason 1 predicts that consequence 9 measures nothing — which consequence 9 half-concedes ("expect a small effect or none") without connecting it back. Selective moderator use, from a source the section itself grades "abstract-only."

Also: "Two glossing meta-analyses **agree on direction**" is presented as corroboration. Twenty-six studies and forty-two studies drawn from the same small primary literature are not independent; overlapping meta-analyses re-analysing shared primaries corroborate far less than that sentence implies. Say "two meta-analyses over a heavily overlapping primary literature."

### A8. "看不懂 has no text — it is context-free isolated cards" is contradicted three paragraphs later.

The whole basis for voiding the glossing literature is that "**a gloss is met WHILE READING A TEXT**, where sentence context constrains the choice," and this app has none. But consequence 3 requires "the confusable table's 'where you would meet it' clause," and consequence 4 requires "a 'where you meet it' clause on every member of a `confusable_with` set." The design _does_ supply context, on the answer side, which is where the gloss lives. Either the cards are context-free and lint rule 4 is wasted, or they are not and the argument voiding the meta-analyses is overstated. Pick one.

### A9. The "multiple-choice gloss" sentence swaps referents and does no work.

> "it is confounded with an added retrieval demand anyway (a multiple-choice gloss is a gloss plus a test)"

In the glossing literature a "multiple-choice gloss" is a gloss **format** — the reader selects the contextually correct sense from two or three offered. It is not the app's multiple-choice answer rows. Whichever is meant, the sentence cannot bear on the L1-vs-L2 contrast: both arms share the same format, so format cannot confound language. Delete it or name the referent.

Meanwhile consequence 1 gives away something the argument never confronts — "Each phone renders **the option rows** in that player's own locale." If the glosses _are_ the answer options, they are not glosses at all; they are the response set in a forced-choice recognition test. The transported evidence is further from the target than the section admits, and the section's own consequences prove it.

### A10. Reason 4's table is the author's invention, has no denominator, and its last row refutes it.

> "**A case where the obvious Dutch gloss over-narrows and must be corrected.** Dutch is not automatically better; it is better **when authored**."

That is correct — and it kills the other nine rows. If authoring fixes 无障碍, authoring also fixes 斤 ("500 g — **not** a pound, which is 454 g"), 3楼 ("floor 3 in Chinese counting = two above ground level"), 折 and 辣, all in English. Every hazard in the table is a hazard of _lazy glossing_, not of English. The residual Dutch advantage is _pond_ and _ons_: a familiarity-and-arithmetic saving on two items. That is real and it is small. It is not "the decisive reason."

> "**The decisive reason is domain-specific and nobody in the research raised it**"

"Nobody raised it" is offered as a credential. It is equally a statement that the claim is **untested** — and it is the author's own invention, so it earns more scrutiny, not the decisive slot. Ten hand-picked rows with no denominator do not establish "this bank is dense with unit, quantity and floor-numbering traps."

**Should say:** give the count. "Of the N items in the v1 bank, K carry a unit, quantity or ordinal-numbering trap where a Dutch everyday word maps exactly and English has none: [list]. K/N = x%." If x is 2%, "dense with" is false and reason 4 is a footnote. If x is 15%, you have an argument. Assert density, then count it.

### A11. The 3楼 row's Dutch gloss is the _more_ dangerous one, in the situation the item exists for.

> "**'de tweede verdieping'** … The Dutch gloss **forces** it to be handled."

It does not. It hands the learner correct arithmetic and wrong behaviour: they are standing in a Chinese lift and must press **3**. "Tweede verdieping" is a number that is on no button in the building. Both glosses need the action: _"verdieping 3 in Chinese telling — bij ons de 2e verdieping. In de lift druk je op 3."_ Tag `hazard` on both columns, not only the English one.

### A12. REGRESSION — this passage reinstates three positions the document already withdrew.

**(a) The school wedge.** The passage: "Two columns for a wedge into a small, enumerable list of Dutch schools." DESIGN.md §8 (tail) rules the opposite, explicitly, as a change under review: "**[D] Ruling: the school channel is out of scope for v1 and unbudgeted**… the earlier claim that they did was a category error." §8 also names the exact conflict this passage omits — "**The trademark ruling and the wedge point in opposite directions.** §9.2 forbids the letters 'HSK' in store metadata, and 'HSK' is the exact string that makes the deck legible to a buyer whose PTA is built on it" — and the GDPR **Art. 8 / UAVG-16** minors' obligation, which §8 records the earlier draft "never raised." This passage states both consequence 6 and consequence 7 and drops the conflict between them. That is a regression presenting itself as inheritance.

**(b) "Stay a PWA."** The passage: "**Stay a PWA, or serve gloss assets as separately-fetched non-DRM'd files.**" DESIGN.md §9.3: "The earlier text derived a whole-product platform decision ('**Stay a PWA**') from a licence clause whose remedy was named in the same sentence… **Ruling: … licensing does not by itself decide the platform.** … **the argument for the PWA is architectural and geographic, not legal.**" The passage labels this "binding from §9–12." It is the exact inference §9–12 withdrew. And it drops the reason §9.3 _does_ give (a FairPlay `.ipa` forces a first-run network fetch, colliding with §11.2's offline guarantee and mainland reachability).

**(c) Field-name drift.** The passage says `hsk_band`; §8 and §9.2a say **`hsk3_band`**. A CI gate cannot check a column whose name changes between sections.

Also: "the 400-character figure and the schoolexamen-only structure are **the load-bearing parts**." Nothing in consequence 6 uses the schoolexamen-only structure. Delete the word or show the load.

### A13. The licence pin cite is wrong, and ShareAlike is not "discharged once."

> "BY-SA 4.0 **§2(a)(5)(B)** forbids applying effective technological measures"

In **CC BY-SA 4.0**, §2(a)(5) runs A "Offer from the Licensor – Licensed Material", B "**Additional offer from the Licensor – Adapted Material**" (the ShareAlike-specific Adapter's-License offer), **C "No downstream restrictions"** — and C is what contains "or apply any Effective Technological Measures to." §2(a)(5)(B) in BY-**SA** says nothing about DRM. The error is inherited from plain **CC BY 4.0**, which has no Adapter's-License clause, so "No downstream restrictions" sits at 2(a)(5)(B) there. Correct cite: **§2(a)(5)(C)**. Fix it here and at `docs/DESIGN.md:99`, and re-check against whichever version the pinned CC-CEDICT build declares — BY-SA 3.0's equivalent is §4(a), a third numbering.

> "published in the repo so the ShareAlike obligation is **discharged once at build time**"

It is not. §3(a) attribution and §3(b) ShareAlike are conditions on **every distribution** of the adapted material. The people owed attribution, the licence URI and the Adapter's License are the people who receive the **app**, not the people who visit GitHub. §9.3's in-app `/licences` route is what actually satisfies this; gate 14 protects the bundle boundary, not the notice duty. Say both.

**Silently omitted:** **sui generis database rights.** CC-CEDICT is a database and the publisher is in the EU. BY-SA 4.0 **§4** addresses database rights directly and provides that extracting a substantial portion triggers §3(b) ShareAlike. For a Dutch publisher that is a more live clause than the DRM one. The passage discusses DRM at length and §4 not at all.

### A14. Numbers with no derivation — in a passage that ends by forbidding exactly that.

The closing paragraph is the best writing here — "do not plan against a borrowed number," "project no total-hours figure at all," the FSI Category IV comparator with its aptitude-screened-diplomat caveat. Then the same passage invents four unsourced numbers:

- "Cap gloss length at **~120 characters**." Derived from nothing — and it binds unequally. Dutch runs 10–20% longer than English in translation, and the Dutch column is the one this section says must carry hazard qualifiers, units and worked conversions. The 素 gloss plus a "where you meet it" clause plus a conversion will not fit. Set the cap in **rendered lines at the shipping type size**, per language, with a reason.
- "a **three-week** gap must not reset progress" — why three?
- "a **60-second** 'what you still know' review" — why sixty?
- "≥1 week" is at least conventional, but it is asserted.

And the passage does the thing it bans: "**Budget far more exposures per item** than a Spanish or German app would, and **size the bank accordingly**" is a planning instruction derived from the inference the next paragraph rules inadmissible. "Size the bank accordingly" is either meaningless without a number or smuggles the banned number back in. Replace with: "Do not size the bank against a retrieval count. Size v1 by coverage of the signage inventory; let `retrievals_to_stable_recall` (§6.6) set the scheduler, not the bank."

### A15. "Mandarin offers **no cognates** to Dutch or English" is false, and falsest in this bank's own domain.

Food and drink is exactly where Chinese phonetic loans cluster: 咖啡 kāfēi, 巧克力 qiǎokèlì, 沙拉 shālā, 三明治 sānmíngzhì, 汉堡 hànbǎo, 吐司 tǔsī, 布丁 bùdīng, 咖喱 gālí, 披萨 pīsà, 可乐 kělè — and **啤酒 píjiǔ**, where 啤 is a phonetic borrowing of _beer/bier_, i.e. closer to Dutch than anything else in the bank. "Form, sound and meaning all novel" is wrong for every one of these. Scope the claim to what is true — **the script carries zero transfer** — and note that semantic transparency (电脑, 火车) starts paying only after a few hundred characters. Then take the free win the design gives up: flag `phonetic_loan` and schedule those items cheaper.

### A16. Consequence 2 overstates the law and specifies a gate that its own examples defeat.

> "Without them the app is **unusable** with a screen reader and non-conformant under EN 301 549."

Non-conformant is right (WCAG 3.1.2 Language of Parts, AA, incorporated by EN 301 549 clause 9). **Unusable is not** — a missing `lang` degrades voice selection and pronunciation; many engines script-detect. And EN 301 549 binds through the Web Accessibility Directive (public sector) and the EAA (Directive (EU) 2019/882) for covered services; a free consumer game may fall outside both. Make the accessibility case on its merits and state the hook accurately, or a build gate rests on a compliance claim that may not apply.

The cross-reference to gate 7 is correct — `docs/DESIGN.md:86` does read "Any hanzi element without `lang="zh-Hans"`, or any gloss without a `lang` attribute." But **the gate as worded passes this passage's own hazard glosses.** `"vegetarisch — maar niet betrouwbaar: vaak 蚝油 of 高汤"` is a single `lang="nl"` element containing bare hanzi that is in no element of its own — so there is no "hanzi element" to fail, and the string is exactly the 3.1.2 violation the gate exists to catch. Restate it as a **codepoint** rule: any CJK codepoint (U+3400–U+4DBF, U+4E00–U+9FFF and extensions) whose nearest ancestor `lang` is not `zh-*`. And pinyin needs `lang="zh-Latn-pinyin"`.

### A17. Silent omissions

- **Pinyin.** An entire content ruling on Mandarin glossing that never decides whether pinyin appears, tone marks or numbers, prompt side or reveal only. That is a _larger_ content decision than gloss language — pinyin on the prompt side is a known crutch that suppresses character learning — and `gloss: {nl, en}` has no slot for it. Gate 8 already asserts the Latin face renders `ǖ ǘ ǚ ǜ`, so the build assumes pinyin exists; this section does not.
- **Traditional characters.** Gate 6 exists for scalar `trad` fields; the gloss schema has no `trad` story.
- **Which side the gloss sits on**, and the test direction (recognition 汉字→meaning vs production meaning→汉字). This changes what "gloss" even denotes here.
- **A gloss style guide.** The Dutch column mixes noun phrases ("pond"), second-person sentences ("je betaalt 80%") and meta-commentary ("Er is geen Nederlands woord voor"). If the gloss carries the hazard, register consistency is load-bearing and lint rule 4 does not cover it.
- **The HSK absolutism is asserted, not argued.** "The letters 'HSK' never appear in UI or store metadata" is stronger than trade mark law requires — referential use to indicate a product's intended purpose is broadly permitted (EUTMR Art. 14(1)(c)), subject to honest practices and no implied affiliation. §8 already records the cost of the absolute rule. Argue it or scope it.
- **The A/B has no stopping rule, no pre-registered analysis, and no answer to "what if it comes back null."**

---

## B. The Chinese content

**Correct as written:** 斤 = 500 g (PRC 市斤, standardised 1959) and a pound is 453.6 g; 两 = 50 g = ⅒ 斤; 3楼 = ground-floor-is-1, hence Dutch _tweede verdieping_; 打折 means you pay n×10%; 麻 má is the 花椒 numbing/tingling sensation and is distinct from 辣 là; 蚝油 háoyóu (oyster sauce) and 高汤 gāotāng (stock) are precisely the two things that break a nominally 素 dish; 饭店 genuinely covers both restaurant and hotel; 无障碍 is broader than _rolstoeltoegankelijk_; 能量 is the kJ line on a GB 28050 label and Dutch labels do carry kJ+kcal (EU 1169/2011); all five pointing-card sentences are grammatical and idiomatic; and the Dutch glosses are grammatical throughout.

**Wrong or under-specified:**

**B1. 斤 and 两 are mainland-only — and the row that calls itself "the single strongest instance" carries no `hazard` tag.** 1 台斤 (Taiwan) = 600 g, so 1 两 = 37.5 g; the Hong Kong catty is 604.8 g. "1 斤 = 1 pond" is exact _in the PRC_. Ship it unqualified and it fails silently the moment the learner is in Taipei — the same failure mode 3楼 is tagged `hazard` for. Gloss: _"pond (500 g) — op het vasteland. In Taiwan 600 g."_

**B2. 折's Dutch gloss hard-codes a number that is not in the character.** "je betaalt 80% — dus 20% korting" is the gloss for **八折**, not for 折. 七五折 = pay 75%. As written the bank teaches "折 = 20% off," which is wrong on every other discount sign. It must read: _"n折 = je betaalt n×10% van de prijs. 8折 = 80% betalen = 20% korting; 7,5折 = 75%."_ The English is wrong for the same reason and "discount" is not the fix.

**B3. "Dutch _pittig_ is tighter" is backwards — the one comparative claim in the table that inverts.** _Pittig_ is at least as broad as "spicy": _pittige kaas_ is mature cheese, a _pittig karakter_ is a forceful person. The tight Dutch words for chilli heat are _heet_ and _scherp_. 辣 belongs in the "neither language rescues it" column, not the Dutch-wins column. Gloss: _"scherp/heet van chilipeper — niet 'pittig' in de kaas-zin."_

**B4. 麻: "_no English word_" is false.** English food writing has a standard gloss — **numbing** (as in _mala_) — and Dutch has _verdovend_ / _tintelend_. The honest claim is "no single _everyday_ word in either language," which is what the row's own remedy already assumes. The Dutch gloss also omits the one fact that makes 麻 learnable — the cause — and "dit is geen hitte" is odd Dutch (_hitte_ is weather-heat). Better: _"niet scherp — je mond gaat tintelen en verdoven. Komt van Sichuanpeper (花椒). Geen Nederlands woord voor."_ Then 麻辣 málà becomes teachable as a compound rather than two mysteries.

**B5. `no_single_word_equivalent` over-fires on at least three of its twelve members.** 时价 → Dutch **dagprijs** (one everyday word); English "market price" is the term of art printed on English menus. 无座 → Dutch **staanplaats** (one everyday word); English "standing ticket." 鲜 → **umami** works in both languages in a food register. Lint rule 4 would _reject the correct gloss_ for these three. Fix the list, or rename the flag to what you actually mean — `requires_explanatory_clause` — because "no single word exists" and "a single word is not enough here" are different claims and the rule enforces the second.

While there: 时价 vs **市价 shìjià** is a live form-confusable and belongs in a `confusable_with` set; so do 涮 shuàn / 刷 shuā and 拌 bàn / 伴 bàn / 绊 bàn.

**B6. 无座 is a rail-ticket term in a bank otherwise made of menus, labels and signage.** Either transit is in scope (the §11.6 city packs suggest it is) or this row is an orphan. Say which.

**B7. The peanut card is medically under-specified, and it is the one card that can hurt someone.** 我对花生过敏 covers the nut and not the oil, and Chinese kitchens cook in 花生油. It must read **我对花生过敏，包括花生油**. This card, not 3楼, is the strongest `hazard` in the section. Related: 我不吃猪肉 is correct, but a learner avoiding pork for religious reasons wants **清真 qīngzhēn**.

**B8. 能量's conversion is ambiguous in the notation it chose.** "÷ 4,184 voor kcal" is correct Dutch decimal notation for 4.184 — and it collides with the fact that 4184 is also the number of _joules_ per kcal, so a reader parsing it as an integer gets the right answer with the wrong model. Write _"÷ 4,2 ≈ kcal"_ or _"1 kcal = 4,184 kJ."_

**B9. 素's gloss names the problem and not the fix.** Add the word that actually gets a vegetarian dish in China: **斋 zhāi** (Buddhist vegetarian, stricter — excludes the 五辛 too). 斋 is already in the bank's own list; connect them.

**B10. The section prints no pinyin at all.** For the record: 斤 jīn · 两 liǎng · 楼 lóu · 折 zhé · 辣 là · 麻 má · 能量 néngliàng · 素 sù · 饭店 fàndiàn · 无障碍 wúzhàng'ài · 蚝油 háoyóu · 高汤 gāotāng · 满减 mǎnjiǎn · 时价 shíjià · 无座 wúzuò · 荤 hūn · 斋 zhāi · 涮 shuàn · 卤 lǔ · 拌 bàn · 鲜 xiān · 香 xiāng. Note **无障碍 = wúzhàng'ài** — the apostrophe is mandatory or it reads _zhan-gai_. That is a missing lint rule (any syllable beginning a/o/e after another syllable takes ’). And the product name is **看不懂 kànbudǒng** — 不 is neutral-toned in the potential complement, not _bù_.

---

## C. The ⺼ U+2EBC / 月 U+6708 ruling

**Not in this passage.** It is in the repo, from commit **`b775e0c` "Correct the meat radical: it is ⺼ U+2EBC, not 月 U+6708"**, which edited `/home/user/dohhh/design/cards/README.md`, `/home/user/dohhh/design/cards/canvas.json` and `/home/user/dohhh/design/cards/Breakdown.dc.html`. **The "correction" is wrong. It reverted a statement that was right.**

The claim:

> "The component in 肝 肠 肚 腰 脑 肺 肾 胗 is **⺼, U+2EBC, Kangxi radical 130 'meat'** — the bound form of 肉. **月 U+6708 is the moon, a different character that happens to be a homoglyph in almost every font.**"

Checked directly:

```
U+2EBC '⺼'  name='CJK RADICAL MEAT'            category=So  decomposition=''
U+6708 '月'  name='CJK UNIFIED IDEOGRAPH-6708'  category=Lo  decomposition=''
U+2F81 '⾁'  name='KANGXI RADICAL MEAT'         category=So  decomposition='<compat> 8089' (肉)
肝 = U+809D, one code point.   '月' in '肝' -> False    '⺼' in '肝' -> False
保质期 = U+4FDD U+8D28 U+671F.  '月' in it   -> False
```

1. **U+2EBC is not "Kangxi radical 130."** It is in the **CJK Radicals Supplement** (U+2E80–U+2EFF). Kangxi radical 130 is **⾁ U+2F81**, in the Kangxi Radicals block — and that one, not U+2EBC, carries the compatibility mapping to 肉. Two different blocks, two different purposes, conflated.
2. **Neither code point occurs inside 肝.** 肝 is a single unified ideograph, U+809D. Encoded Chinese text contains no component code points, so "the component **is** U+2EBC" is not a true statement about anything the app will ever hold in a string. It is true only as the annotation convention of a _decomposition database_ — and the commit admits the source: "Verified against Make Me a Hanzi." That project's IDS strings use ⺼ for meat and 月 for moon. A convention, not a fact about Unicode, and not universal across IDS sources.
3. **The hazard the commit invents cannot occur.** "never a substring match on 月, because 期 sits inside 保质期… the naive rule would have taught that a shelf-life label contains a body part." A substring match for 月 against 保质期 returns **nothing**: 期 is U+671F and contains no U+6708. The rule can only fire against a _decomposition string_ — and if that source is Make Me a Hanzi, then by the commit's own paragraph 期 is annotated 月 and the organs ⺼, so the naive rule is **safe there**. A shipping constraint built on a failure mode that exists in neither implementation.
4. **§9.1 bans the source it was verified against.** DESIGN.md: "`makemeahanzi/dictionary.txt` — **LGPL-3.0-or-later**, not MIT… **Keep `makemeahanzi` out of the build environment entirely**," and gate 3 requires it be absent from the lockfile and the build image. A content ruling verified against a banned source is a provenance problem on top of a correctness one.
5. **The commit's "real 月" list is wrong on half its members.** "期 朋 朗 服 有 望 carry the real 月." 期 qī, 朗 lǎng, 望 wàng — yes, moon. **服 fú** — the left element is a corrupted **舟** (boat; Shuowen 从舟), neither moon nor meat. **朋 péng** — two strings of cowries/jade, neither. **有 yǒu** — modern paleography reads 又 (hand) + **肉** (meat), the _opposite_ of the commit's claim, while Kangxi and Unihan `kRSUnicode` file it under radical **74 (月)**; contested at best, and contested in the direction that breaks the list. And this passage supplies its own counterexample: **能** in 能量 has a 月-shaped element that is neither moon nor meat — it is the residue of a bear pictograph (whence 熊). Any learner-facing rule of the form "月 on the left means meat" is wrong on roughly a third of common characters.
6. **The commit ships U+2EBC into copy, and it is a Symbol, not a Letter.** `Breakdown.dc.html` now renders `&#11964;` inside `<span class="han">`. U+2EBC is category **So**, has no NFKC folding, and lives in a block no CJK font subset built from a hanzi list will contain — a live **gate 1** risk ("any codepoint … missing from the subset of every face that renders it"), unsearchable, un-typeable by IME, and the wrong thing to hand a screen reader under `lang="zh-Hans"` in a document that makes `lang` a build gate.

**What it should say:**

> **⺼ and 月 are the same shape in a simplified-Chinese font. The distinction is a font and etymology matter, not a code point one.** In encoded text there is nothing to choose: 肝 is U+809D, one character, containing neither U+6708 nor U+2EBC. The meat radical (Kangxi 130, from 肉) and the moon radical (Kangxi 74) are drawn identically in mainland type; Japanese and some traditional faces separate them — one more reason `lang` is a build gate. **Never put U+2EBC in shipped copy**: it is a radical-chart symbol (category So), outside our subsets, unsearchable and un-typeable. Write 肉 in prose, show the bound shape as 月, and record which one it is in a stored `semantic_radical` field seeded from Unihan `kRSUnicode` — which §9.1 already provides.
>
> **The teaching rule is the real content ruling, and it is the one that must not ship wrong.** "月 on the left means the body" is false for 服 (boat), 朋 (cowries), 能 (bear) and arguably 有, while 期/朗/望 are genuine moons. So the organ card teaches the **set** — 肝 肠 肚 腰 脑 肺 肾 胗 — and never the **rule**, and it carries the honesty line this project already committed to: when you cannot see it, it is not there.

Keep 保质期 — not as a substring hazard, but as the ideal **counterexample card**: a shelf-life label whose 期 looks like the organ component and is not.

---

## The three changes that would most improve this text

_(The three passages that revert §8's school-channel ruling, §9.3's "licensing does not decide the platform" ruling, and the `hsk3_band` field name are not on this list only because they are deletions rather than changes. Cut them.)_

**1. Kill or rebuild the A/B, and stop letting it carry the ruling.** "Your own data can" is the load-bearing justification for the entire section, and as specified the data cannot: consequences 1 and 3 put both gloss languages on every reveal in both arms, consequence 9's exclusion rule breaks ITT under the churn the section itself names as the primary failure mode, and reason 4 guarantees the arms differ in authoring quality rather than language. Either delete the promise and own the default as judgement, or specify single-language arms, one authoring spec for both columns, ITT with switching logged as an outcome, and a stated MDE with the retained-player count it requires — while acknowledging that reason 1's own moderator ("clearest… on immediate posttests") predicts the ≥1-week metric will return null.

**2. Rewrite the ruling as what it actually is — a two-language authoring budget — and make reason 4 countable.** "Default to the user's L1 by locale" is a **locale** default that ships an **L2** gloss to everyone outside `nl`: the arm the section's own g = 0.33 says loses. Say that plainly and accept the cost, add `nl-*` prefix matching and a note that the _pond_/_ons_ argument is NL grocery usage rather than Dutch-language usage, and price the hand-authored Dutch column (CC-CEDICT is English-only, so "cheap" is unpriced labour). Then give K/N — the number of bank items with a unit, quantity or ordinal-numbering trap where Dutch maps exactly and English does not — and demote reason 4 from "decisive" to whatever K/N supports, remembering that the table's own last row already concedes the hazards are fixed by **authoring**, not by **language**.

**3. Revert `b775e0c` and fix the content that ships wrong.** ⺼ U+2EBC is a radical-chart symbol in the CJK Radicals Supplement, not "Kangxi radical 130"; it appears inside no encoded hanzi; the 保质期 substring hazard cannot occur in either implementation; 服/朋/能/有 break the "real 月" list; and shipping U+2EBC risks gate 1 and the accessibility gate the same document mandates. In the same pass: 折's gloss must be _n折 = je betaalt n×10%_, not a hard-coded 80%; 斤/两 must be tagged mainland-only (台斤 600 g, 两 37.5 g); the peanut card must read **我对花生过敏，包括花生油**; 麻's gloss must name 花椒; "pittig is tighter" must go; 时价/无座/鲜 must come off `no_single_word_equivalent`; and CC BY-SA 4.0's DRM clause is **§2(a)(5)(C)**, not (B) — the (B) numbering belongs to CC BY 4.0, which has no Adapter's-License clause pushing it down — which also needs fixing at `/home/user/dohhh/docs/DESIGN.md:99`.

Sources for the licence check: [CC BY-SA 4.0 legal code](https://creativecommons.org/licenses/by-sa/4.0/legalcode.en) · [Wikimedia Foundation mirror](https://foundation.wikimedia.org/wiki/Legal:Text_of_the_Creative_Commons_Attribution-ShareAlike_4.0_International_License) · [SPDX CC-BY-SA-4.0](https://spdx.org/licenses/CC-BY-SA-4.0.html)
