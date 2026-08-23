# 看不懂 — design document

A co-located multiplayer Mandarin **reading** game as a standalone installable PWA,
for Dutch and English speakers who want to function in China quickly. Hard-forked
from the dohhh P2P trivia engine.

Written from 11 adversarially-reviewed literature sweeps (Google Scholar, Semantic
Scholar, arXiv, PsyArXiv, ACL Anthology, ACM DL, ERIC, PubMed, ISCA), condensed into
four research digests, then synthesised, attacked on its reasoning, and revised.

> **STATUS.** All twelve sections are written. Every section was drafted, attacked
> on its reasoning by a separate adversary, and revised; the curriculum sections
> were additionally verified character-by-character against local corpus data
> (a 44,437-line pinyin table, a 12,009-character frequency list, and a
> decomposition set) by script rather than by eye.
>
> Two passages are one round less hardened than the rest: §§1–2.5 and §§3–4.6 are
> reviewed drafts whose reviser was itself truncated before reaching them. §§2.6–2.7
> and §§4.7–4.12 carry the full revision. Everything from §5 onward is complete.

---

# Section 1: What the evidence supports

Every principle below carries a strength grade (**strong / moderate / contested**), a scope line naming the material type and — for memory findings — whether the evidence is **lab-wordlist** or **classroom-L2**, and a citation with a URL. Grades are carried over from the digests unchanged. Nothing here is upgraded; several things are deliberately uncomfortable and are marked so.

**Two standing caveats that scope what follows.** First, the interface-social evidence (P24–P34) comes from a cluster in which exactly one paper was read in full text (Parhi, Karlson & Bederson 2006); the rest is search-abstract or recalled, and both adversarial critiques had scholarly egress blocked. Directions are usable, **magnitudes are provisional**, and the top ~10 sources must be re-read before any number from that block enters a build spec. Second, the design document must keep two registers permanently separate — **findings** (source + effect size + scope) and **decisions** (owner + rationale + planned test) — because the single most damaging failure in the source sweeps was an invented number wearing a citation. `≥5 exposures, per Horwitz et al.` will be in the codebase within a week otherwise.

---

## 1.1 The criterion task, which settles every later argument

**P1 — Transfer-appropriate processing, not "depth", decides what a good encoding is.** Semantic encoding beat rhyme encoding on standard recognition; rhyme encoding *beat* semantic encoding on a rhyme-recognition test. What matters is the match between the encoding operation and the retrieval operation.
*Strength:* strong. *Scope:* **lab-wordlist**, word lists at minutes-to-a-day delays. A product-defining question is being settled on word-pair experiments; say so.
*Source:* Morris, Bransford & Franks (1977), *JVLVB* 16(5), 519–533 — https://www.sciencedirect.com/science/article/abs/pii/S0022537177800169
*Consequence:* the criterion task goes at the top of the document — *"standing in front of a physical sign, in an unfamiliar display typeface, retrieve the meaning."* That is meaning-recall from a rendered form, not four-option discrimination. No design argument is ever settled by asking "is this deeper?"

**P2 — Encoding specificity licenses the character form as it will be met — and nothing about the surrounding scene.** A learner who only ever encodes 出口 as clean black Song on white has encoded a different stimulus from a white-on-green backlit station plate.
*Strength:* strong. *Scope:* **lab-wordlist** (word pairs at short delay); the application to typeface and substrate is an argument from the principle, not a direct test.
*Source:* Tulving & Thomson (1973), *Psychological Review* 80(5), 352–373.
*Consequence:* this is the whole rationale for Decision 2. Fidelity of the **sign** — typeface, stroke weight, spacing, contrast, substrate, the real colour inversions — earns its budget. Fidelity of the **scene** does not. Visual consistency across cards is in direct tension with the criterion task, and the criterion task wins.

**P3 — Seductive details measurably harm retention and transfer, and the harm is *stronger* under limited study time.**
*Strength:* strong. *Scope:* meta-analytic across instructional multimedia.
*Source:* Sundararajan & Adesope (2020), *Educational Psychology Review* 32, 707–734 — https://link.springer.com/article/10.1007/s10648-020-09522-4; Rey (2012), *Educational Research Review* 7(3), 216–237.
*Consequence:* one test per pixel — *does it constrain the meaning of the target?* The ¥ and the number on a price label pass (they make 斤 a unit). The station plate's arrow passes. A photographic street scene fails. Steam off the bowl fails. The condition under which the effect is strongest — timed, socially pressured — is precisely this game.

---

## 1.2 Retrieval, format, and the uncomfortable cost of multiple choice

**P4 — Retrieval practice with feedback is the mechanism that actually produces learning here, and it dwarfs every social and game-shell effect examined.** g ≈ 0.50–0.61 across ~222 classroom studies in the largest synthesis, robust to publication-bias diagnostics.
*Strength:* strong. *Scope:* classroom-based, bias-tested; not hanzi-specific.
*Source:* Yang, Luo, Vadillo, Yu & Shanks (2021), *Psychological Bulletin*; Adesope, Trevisan & Sundararajan (2017), *Review of Educational Research* 87(3), 659–701 — https://www.researchgate.net/publication/315706448
*Consequence:* the priority order that settles internal arguments: retrieval-with-feedback (≈0.5, strong) > self-explanation with domain prompts (≈0.55, strong) > gamification wrapper (≈0.5, contested) > game-vs-non-game (≈0.33, weak controls) > competition (≈0, null). No "browse the character" or "study the list" screen in the main loop.

**P5 — UNCOMFORTABLE. The product's chosen format sits in the weakest cell of that literature on both axes.** Rowland's final-test-format moderator: free recall g ≈ 0.79–0.82, cued recall g ≈ 0.70–0.72, **recognition/MC g ≈ 0.36** — and initial *recall* practice produces larger testing effects than initial *recognition* practice, independently.
*Strength:* strong. *Scope:* meta-analytic, mixed **lab-wordlist** and educational materials, delays minutes-to-weeks. Not L2 Chinese, not months.
*Source:* Rowland (2014), *Psychological Bulletin* 140(6), 1432–1463 — https://pubmed.ncbi.nlm.nih.gov/25150680/; Pan & Rickard (2018), *Psychological Bulletin* 144(7), 710–756 — https://psycnet.apa.org/manuscript/2018-20773-001.pdf
*Consequence:* say in the document that **four-option MC is a pace-and-sociability decision that costs roughly half the available retention benefit**, and that we are taking it knowingly. Two mitigations are real: competitive distractors (gated — P13), and one meaning-recall beat with the options **not yet visible**, followed by feedback. A recall beat placed after the options are on screen is not a retrieval attempt and buys nothing.

**P6 — Three options are optimal, not four — more items per unit time with no psychometric loss, but only if the retained options are the effective ones.** MC accuracy also falls as the number of alternatives rises, and the negative suggestion effect scales with the number of plausible lures.
*Strength:* strong. *Scope:* Rodriguez is a random-effects meta-analysis over 80 years of general educational measurement — not L2, not hanzi.
*Source:* Rodriguez (2005), *Educational Measurement: Issues and Practice* 24(2), 3–13 — https://onlinelibrary.wiley.com/doi/10.1111/j.1745-3992.2005.00006.x
*Consequence:* drop to three. It buys more items per round, frees the width for 60–64 CSS px full-bleed answer rows in the thumb zone, and cuts lure exposure — three benefits from one change. The third option must be a real competitor, never filler.

**P7 — Multiple choice implants its lures, and the size is known.** Lures were produced on 5% of questions when not previously tested, rising to 12% a week after testing. Feedback is the fix; immediate and delayed feedback are equally effective at cutting intrusions.
*Strength:* strong. *Scope:* English prose passages, university samples, 1-week delay. Not hanzi, not months.
*Source:* Roediger & Marsh (2005), *JEP:LMC* 31(5), 1155–1159 — http://psychnet.wustl.edu/memory/wp-content/uploads/2018/04/Roediger-Marsh-2005_JEPLMC.pdf; Butler & Roediger (2008), *Memory & Cognition* 36(3), 604–616 — https://link.springer.com/article/10.3758/MC.36.3.604
*Consequence:* budget ~7 percentage points of lure intrusion as the price of MC; the net is still positive. Feedback becomes **mandatory on every item, not a setting**. Log every `{itemId, lureId, timestamp}`.

**P8 — The guessing correction inverts any controller that targets a fixed observed accuracy across formats.** P(correct) = R + (1−R)/k. Holding observed accuracy at 0.85 gives true R = 0.700 in 2AFC, 0.800 in 4AFC, 0.850 in free recall — so the weakest players on the easiest format sit at the *lowest* true retrievability, the exact inverse of intent. At that operating point roughly half of all 2AFC "correct" responses are guesses.
*Strength:* strong. *Scope:* arithmetic identity, solved numerically.
*Consequence:* specify every pacing target in **retrievability**, never in observed accuracy (observed 0.925 at k=2, 0.8875 at k=4, 0.85 at free entry for a common true R of 0.85). Store `format_tier` and `n_alternatives` on every review row. Do not feed fully-scaffolded or 2-alternative outcomes into stability updates at all — log them `role: exposure`.

**P9 — Committing before the reveal is a pretest, and the prequestion effect is large but strictly item-specific.** g = 0.66 for the information the question targeted, with no evidence of benefit for other material in the same activity. It requires corrective feedback to exist at all, and a wrong pre-answer guess is productive.
*Strength:* strong. *Scope:* classroom/instructional — texts, lectures, videos (the sweep mislabelled this lab-wordlist).
*Source:* *The Effect of Prequestions on Learning: A Multilevel Meta-Analysis* (2025), *Educational Psychology Review* — https://link.springer.com/article/10.1007/s10648-025-10075-7; Kornell, Hays & Bjork (2009), *JEP:LMC* 35(4), 989–998.
*Consequence:* this — not curiosity neuroscience, not a memory-palace analogy — is the honest justification for the bet. Two follow-ons: narrow the dealt category to **prequestion granularity** ("signs on a subway platform", "weight and price on a market label", never "Transport"), and keep scoring such that guessing stays attractive rather than driving players to hedge. No round may leave a bet unresolved.

**P10 — Hypercorrection: errors made with high confidence are corrected better and more durably given clear feedback, and a *test* after corrective feedback is what blocks the high-confidence error from returning.**
*Strength:* moderate. *Scope:* lab/educational general-knowledge material, delays to about a week. Both effects require the learner to have related knowledge to recruit; for genuinely unknown arbitrary pairs the errorful-generation evidence is mixed and can be neutral or harmful.
*Source:* Butler, Fazio & Marsh (2011), *Psychonomic Bulletin & Review* 18, 1238–1244 (**not** Metcalfe & Finn, as widely miscited); Metcalfe (2017), *Annual Review of Psychology* 68, 465–489.
*Consequence:* persist `bet_tier` and `was_correct` per attempt; drain a `high_confidence_miss` queue in the session's final round — and label that in the document as a **within-session massed repetition defended on hypercorrection grounds, never as good scheduling**.

**P11 — Feedback is not reliably beneficial; ~38% of feedback effect sizes are negative, and the moderator is whether attention goes to the task or to the self.** A public point loss carrying no task information is close to pure self-level feedback.
*Strength:* strong. *Scope:* organisational/educational, not L2 or games. Hattie & Timperley reach the same conclusion but are the same research programme, not independent corroboration.
*Source:* Kluger & DeNisi (1996), *Psychological Bulletin* 119(2), 254–284.
*Consequence:* **public task information, private self information.** This is the single most damning result against "the table watches you lose points" and it drives the ruling in §2.7.

**P12 — Elaborated feedback beats knowledge-of-correct-response beats bare verification (≈ d 0.49 / 0.32 / 0.05) — but the elaboration advantage is concentrated in higher-order outcomes and narrows sharply for the low-order recognition this product is scoped to.**
*Strength:* moderate. *Scope:* ~40 studies / ~70 effects in computer-based environments. Note the corrected read: d ≈ 0.05 is a between-feedback-*type* contrast, not "verification is worthless versus nothing".
*Source:* Van der Kleij, Feskens & Eggen (2015), *Review of Educational Research*.
*Consequence:* always show the correct answer — KCR is cheap and well supported. A **universal fixed-length explanation on every item is an unvalidated product bet, not an evidence mandate**, and must be labelled as such.

---

## 1.3 Interference, confusables, and the consolidation gate

**P13 — Competitive distractors both help and hurt, and the two effects run in opposite directions for this design.** Plausible alternatives can produce test-induced learning of the alternatives and avoid retrieval-induced forgetting — but plausible lures reliably produce a negative suggestion effect that grows with plausibility and number. Crucially, the mechanism that makes competitive MC beneficial (retrieving *why each other option is wrong*) **requires knowledge the learner already has**.
*Strength:* strong. *Scope:* both sides are lab/educational facts and **lab-prose** at short delays (Little et al. 2012 is lab-prose with a short filled delay, not lab-wordlist). Neither has been run on Chinese characters.
*Source:* Little, Bjork, Bjork & Angello (2012), *Psychological Science* 23(11), 1337–1344 — https://bjorklab.psych.ucla.edu/wp-content/uploads/sites/13/2016/07/Little_EBjork_RBjork_Angello_2012.pdf
*Consequence:* **distractor confusability is a pure function of the item's exposure state, never a difficulty dial and never a bet tier.** Exposures 1–2 get semantically and visually *unrelated* (but domain-plausible) distractors. Component-sharing and confusable-family distractors unlock only after the item has been retrieved correctly across at least one intervening night. "Ban random unrelated distractors" is wrong as a blanket rule.

**P14 — Form similarity is the real hazard; semantic relatedness is weak and, in the direction this app tests, helpful.** Form similarity usually hurt accuracy and *always* increased confusion errors; semantic relatedness without form similarity **improved** accuracy when the tested direction was L2→L1, and tended to hurt when it was L1→L2.
*Strength:* moderate. *Scope:* **classroom-L2 / lab-factorial with a delayed test** (Kemp); Nakata & Suzuki is real L2 words at 1 week. Ishii (2015), often cited as decisive, has a **20-minute** retention interval and should be weighted as lab.
*Source:* Kemp (2021), *Language Learning* 71(3), 730–770 — https://onlinelibrary.wiley.com/doi/abs/10.1111/lang.12449
*Consequence:* the game is sign→meaning, the direction in which semantic relatedness helps. Four semantically related *meanings* among the options is fine. Four orthographically near-identical *signs* during a sign's first appearances is not. And **never add a production mode** (write or type the Chinese for "exit") — that is the L1→L2 direction where relatedness turns harmful.

**P15 — Harm from relatedness shows up in error type, not in score.** Related and unrelated items did not differ in posttest scores at one week, but related items produced significantly more interference errors.
*Strength:* moderate. *Scope:* **classroom-L2**, real English–Japanese word pairs, N=133, 1-week test — the strongest material/interval combination in this literature.
*Source:* Nakata & Suzuki (2019), *SSLA* 41(2), 287–311 — https://www.cambridge.org/core/journals/studies-in-second-language-acquisition/article/effects-of-massing-and-spacing-on-the-learning-of-semantically-related-and-unrelated-words/F58BA8D70385603B9C42E408BFCB8A10
*Consequence:* the most actionable single finding in the whole corpus. **Log which distractor was chosen on every wrong answer**, not just correct/incorrect, and maintain a per-user confusion matrix keyed on `(target_item, chosen_item)`. A plain accuracy curve will look healthy while a pair is quietly being cross-associated. Sibling-confusion events lower an item's strength estimate *even when the answer was correct*.

**P16 — Retrieving one member of a competing pair suppresses the other by roughly 8.7 percentage points, and the effect is competition-dependent.**
*Strength:* strong. *Scope:* **lab-wordlist**, mostly category–exemplar materials, minutes to a day. The phenomenon is not contested; its mechanism is.
*Source:* Murayama, Miyatsu, Buchli & Storm (2014), *Psychological Bulletin* 140(5), 1383–1409 — https://centaur.reading.ac.uk/37052/1/Murayama%20et%20al_2014_PB.pdf
*Consequence:* **pair-balanced testing.** A deck that repeatedly quizzes 出口 and never 入口 is actively degrading 入口. When the selector picks item X, mark every member of `X.family_id` due-soon.

**P17 — Simultaneous paired presentation of visually similar characters improves discrimination of subtle stroke differences in absolute beginners; added-stroke pairs (日/白) are easier than identical-stroke pairs (人/入).**
*Strength:* moderate — thinner than "best-evidenced element in the design" implies; treat as a hypothesis to instrument. *Scope:* one 2025 study, N=183 non-tonal-L1 learners with no prior Chinese, 2×2×2, **retention interval not established**; abstract-only.
*Source:* Li, Shi & Wang (2025), *Languages* 10(10), 260 — https://doi.org/10.3390/languages10100260
*Consequence:* both members side by side, same size, same baseline, same neutral ink — not sequentially, not one-then-reveal. Prioritise added-stroke pairs early; schedule identical-stroke pairs later.

**P18 — A silent side-by-side is not enough: the distinguishing component must be given meaning in words, or learners do not encode the contrast at all.** Identification training with feedback beats same/different discrimination training.
*Strength:* moderate. *Scope:* **classroom-L2** (Chang et al., N=66, immediate + 1 week) plus L2 speech-perception training, which is a different modality and therefore an analogy.
*Source:* Chang, Tang, Lee & Chen (2022), *Frontiers in Psychology* 13, 783898 — https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2022.783898/full
*Consequence:* one authored, meaning-bearing formula per distinguishing component is **required content** for any item with a form-confusable sibling — "出 = feet stepping out of an enclosure; 入 = a wedge entering." Keep the task as identification; never add a same/different mode.

**P19 — CONTESTED: should confusable siblings be scheduled close together or deliberately apart in the deal?**
*Side A (tight):* juxtaposition, not temporal spacing, is the active ingredient in discriminative contrast, and temporal separation destroys it — so confusion-set members belong ~5–15 intervening items apart, alternating, while repetitions of the *same* item stay widely spaced.
*Side B (apart):* crowding a beginner with orthographically and semantically similar competitors is a documented source of associative interference (fan effect, RIF); running simultaneous confusable pairing *and* component-family surfacing together guarantees a dense cluster of near-identical forms in a short window.
*Defensible synthesis, not a resolution:* use simultaneous pairing at the **resolution/teaching** moment where the contrast is explained and feedback is present; do **not** use component-family membership as a reason to schedule siblings close in the **deal** until both are consolidated; then interleave tightly within the family as declared discrimination training. The scheduler needs both a minimum gap (same item) and a maximum gap (within confusion set). **Instrument this rather than deciding it on argument.**
*Sources:* Kang & Pashler (2012), *Applied Cognitive Psychology* 26(1), 97–103 (note: the DOI prefix that circulates for this points at *Memory & Cognition* — a reader following it verifies a different paper); Anderson, Bjork & Bjork (1994), *JEP:LMC*.

**P20 — CONTESTED: may the discriminating component be colour-marked on the resolution panel?**
*Side A (no):* in the one Chinese-specific study colour coding slowed reaction times, interpreted as visual overload; radical markings have separately been found to interfere with L2 character learning.
*Side B (not so fast):* that is an RT main effect at test, not a learning outcome — slower responding is equally consistent with more careful feature-checking; against it stands a meta-analytically supported signalling/cueing principle, which is the standard way to implement "direct attention to the critical difference".
*Resolution:* make it an **A/B tested on delayed discrimination accuracy, not on RT**; cap the number of simultaneous highlights rather than prohibiting the affordance. This does **not** disturb the absolute ban on colour touching the glyph on a timed card (P22).
*Sources:* Hou & Jiang (2022), *Frontiers in Psychology* 13:783613 — https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2022.783613/full; Schneider, Beege, Nebel & Rey (2018), *Educational Research Review* 23, 1–24.

---

## 1.4 The Chinese content layer

**P21 — Component decomposition is the app's transfer engine, and it has direct CFL experimental support including transfer to *untaught* characters — demonstrated using precisely a four-option contrastive format holding one component constant and varying the meaning-bearing one.** Morphological awareness is the largest single contributor to L2 Chinese reading, far outranking working-memory capacity.
*Strength:* moderate. *Scope:* **classroom-L2**, Nguyen et al. N=54 Vietnamese learners with ~1 year of study, pre/post sentence-cloze, no long-delay posttest. Small N.
*Source:* Nguyen, Zhang, Li, Wu & Cheng (2017), *Frontiers in Psychology* 8, 1846 — https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2017.01846/full
*Consequence:* Decision 3 is the best-supported decision in the product. Ship the component-contrast card type, and **reserve it for items already consolidated**. Decompose to **components (2–5 per character), never strokes** — chunking is what makes a character fit in working memory at all (Cao, Rickles, Vu et al. 2013, *Journal of Neurolinguistics* 26(4), 440–461 — https://www.sciencedirect.com/science/article/abs/pii/S0911604413000043 — the only Chinese-specific training study in this evidence base with a three-month follow-up, and the true source of the chunking arithmetic that was for years attributed elsewhere).

**P22 — The verified component fact this app must not get wrong.** The component in 肝 肠 肚 腰 脑 肺 肾 胗 is **⺼ U+2EBC (CJK RADICAL MEAT, Kangxi 130)**, not 月 U+6708 (moon, Kangxi 74). They are homoglyphs in almost every font and different codepoints. 期 朋 朗 服 有 望 carry the real 月.
*Strength:* strong. *Scope:* verified independently this session against Make Me a Hanzi (9,574 entries); Unicode codepoint fact.
*Source:* https://github.com/skishore/makemeahanzi ; Unicode U+2EBC vs U+6708.
*Consequence:* **any highlighting keys off a stored per-item component field, never a substring match on 月.** A naive regex highlights zero of the eight organ characters and fires instead on 期 — which sits inside 保质期, a Tier-1 supermarket item — teaching that a shelf-life label contains a body part. Correct exceptions: 血, 皮 and 舌 do not carry it; 筋 carries it inside 肋 but takes ⺮ as its Kangxi radical. (This is consistent with §9–12: decompositions are authored in-house, Unihan `kRSUnicode` seeds the semantic radical only, and makemeahanzi — LGPL on `dictionary.txt`, Arphic on the graphics — stays out of the build entirely.)

**P23 — Compound transparency is decisive, and roughly half the early bank has no meaning+sound decomposition at all.** Radical awareness demonstrably fails for non-transparent compounds. And the whole-script "80–85% are phono-semantic" figure does not describe this bank: in the top 1,000 characters only ~53% are phonetic compounds and ~47% are pictographs or ideographs; in the first 100 it is ~29% vs ~71%.
*Strength:* moderate (transparency), strong (the computed band statistics). *Scope:* classroom-L2 processing/instruction studies; band statistics computed over makemeahanzi × a jieba-derived frequency ranking.
*Source:* Chen & Feng (2020), *SAGE Open* — https://journals.sagepub.com/doi/10.1177/2158244020969669 ; computed from https://github.com/skishore/makemeahanzi × https://raw.githubusercontent.com/fxsjy/jieba/master/jieba/dict.txt
*Consequence:* a required `transparency` enum (transparent | semi | opaque) plus a non-compositional path. 出口 and 牛肉 branch to a component gloss; 东西, 麻烦, 保质期, 时价, 招牌, 方便面 get an explicit **"this one does not decompose — learn it whole."** Rendering a bogus decomposition is worse than showing none: it installs an inference rule that will misfire on the street.

**P24 — The phonetic component is far less reliable in the core bank than dictionary-wide.** Over the top 1,000 characters: exact match including tone **16.9%**, segmental only 21.7%, rime-only 26.0%, **no cue at all 35.4%**. Whole dictionary: 34.3% exact. Reliability roughly doubles between the top 1,000 and the full dictionary — so the feature is worth more at intermediate level than at beginner level, the opposite of where it would naturally be surfaced.
*Strength:* strong. *Scope:* computed by comparing each character's primary Unihan reading to its phonetic component's primary reading; primary-reading-only, so polyphony adds noise. Bank-specific, not a literature constant.
*Source:* computed from makemeahanzi `etymology.phonetic` × https://raw.githubusercontent.com/mozillazg/pinyin-data/master/pinyin.txt
*Consequence:* per-component `role` (semantic | phonetic | neither) plus a computed reliability field; suppress the phonetic hint entirely for the ~35% no-cue set; **never auto-generate a phonetic hint** — a wrong hint delivered as elaborated feedback inside the protected resolution moment is worse than no elaboration. Mark every gloss `etymological` or `mnemonic-only` against a scholarly reference.

**P25 — Pronunciation is a property of a token in context, not of a character.** 1,378 of 3,500 Tier-1 characters (39.4%) carry more than one Unihan reading; 387 of HSK 3.0's 3,000 (12.9%) are 多音字. 行 is háng in 银行 but xíng in 人行道 and 行李寄存; 地 is dì in 小心地滑 but *de* as an adverbial marker; 便 biàn/pián; 菌 jùn on a menu, jūn by default.
*Strength:* strong. *Scope:* computed over Unihan × 通用规范汉字表 Tier 1; the 39.4% is an upper bound including obsolete literary readings, but the practical head of the list is unavoidable.
*Consequence:* key pinyin to `(token, word-context)`, carry a heteronym flag, and **never ask for a character's pronunciation in isolation**. Take pinyin per-word from the quarantined CC-CEDICT artefact or hand-author it — never from Unihan `kMandarin`. Store `pinyin_citation` and `pinyin_surface` separately: third-tone sandhi (水饺 shuǐjiǎo→shuíjiǎo), 不 bù→bú, 一 yī→yì/yí. Showing citation pinyin beside natural audio trains the exact T2/T3 confusion the design exists to prevent.

**P26 — Colour and extra visual salience applied to the glyph hurt L2 character recognition** — radical colour markings raised RT and lowered accuracy; stroke-order animations lowered recognition accuracy; colour coding independently slowed absolute beginners.
*Strength:* moderate on the learning evidence (N=40 and N=183, both abstract-only, both recognition-time manipulations); **strong on the legal constraint that sits above it.** WCAG 2.2 SC 1.4.1 forbids colour as the sole carrier of information; the European Accessibility Act has applied to consumer digital services since 28 June 2025 via EN 301 549 / WCAG 2.1 AA; congenital red-green CVD affects ~8% of males of Northern European ancestry — the Dutch user base.
*Source:* Hou & Jiang (2022), *Frontiers in Psychology* 13:783613; Li, Shi & Wang (2025), *Languages* 10(10):260; W3C WCAG 2.2 — https://www.w3.org/TR/WCAG22/
*Consequence:* **no tint, highlight, outline or coloured sub-glyph region on any hanzi on a timed card, ever.** Colour is reserved for interface chrome, scoring and turn state. Component colour lives only in the lesson and the reveal (subject to P20). **Decision 5 stands, and its "tone colour on pinyin" half is UNSUPPORTED** — Godfroid et al. (2017, n=303, three-week randomised training with a delayed posttest) found colour training worked but sat slightly behind pitch contours and tone numbers, and that **dual-cue methods did not beat single-cue methods**; pinyin already carries tone in its diacritic, so tone colour on pinyin is exactly the dual-cue configuration that bought nothing (https://onlinelibrary.wiley.com/doi/abs/10.1111/lang.12246). The EAA settles it regardless of how the pedagogy reads.

**P27 — Pinyin placement is a split-attention problem with a measured answer.** Vertical per-character format (pinyin directly under each character) significantly beat the conventional horizontal format. And learner *preference* does not track learning: in a later study the highest-gain format was the least preferred, with preference ratings unrelated to gains.
*Strength:* moderate. *Scope:* **classroom-L2** presentation-format experiments; abstract-only; not phone studies. There appears to be **no controlled experiment on *fading* pinyin at all** — the scaffolding ladder itself is an untested design.
*Source:* Lee & Kalyuga (2011), *Language Learning* 61(4), 1099–1118 — https://eric.ed.gov/?id=EJ945914 ; Wang & Kalyuga, *Computers in Human Behavior* — https://www.sciencedirect.com/science/article/abs/pii/S0747563210001251
*Consequence:* chū under 出, kǒu under 口 — never "chūkǒu" beside or beneath the word; gloss attached under the pinyin row, never off to the side. And Wang & Kalyuga's expertise reversal (partial on-screen pinyin beat both full and none for more experienced learners) is the evidence that **scaffolding fades by measured per-item competence, not by a wager**: full ruby for ~3 exposures, then partial ruby on only the characters that item's error history flags weak, then none. Store `exposureCount` and `perCharacterErrorRate`. Ignore player preference surveys about layout.

**P28 — UNCOMFORTABLE. Character coverage is not item readability, and the arithmetic is brutal.** Knowing 40% of characters gives P(reading a whole four-character dish name) ≈ 0.40⁴ ≈ **2.6%**, not 40%. At 75% coverage it is ≈32%. At 89% coverage a six-character sign has ≈50% chance of containing at least one unknown character. Moving 1,000→3,000 characters takes coverage 89%→99%, removing ~90% of the remaining unknowns — so in a Zipfian tail the *last* decile is where whole-item readability is won.
*Strength:* strong. *Scope:* arithmetic over the coverage figures; independence is a generous approximation.
*Consequence:* a fixed 1,500-character bank (§9–12) is at the lower edge of what whole-sign readability needs, not comfortably above it. **Never print a coverage percentage in product copy.** Report what the user can verify: "you can read 47 of the 120 signs in the metro set." End every session with one screen showing the actual signs at real size in their real typefaces.

**P29 — HSK gives you two thirds of the bricks and almost none of the buildings — measured.** Of a 480-item survival set (214 characters, 266 compounds): 87.9% absent from HSK 2.0 levels 1–3; only 63.6% of survival *characters* in HSK 3.0's first 900; only **15.4% of survival *compounds*** in HSK 3.0 levels 1–3. 162 of 266 compounds appear at no level at all — 换乘, 安全出口, 净含量, 冷藏, 单程票, 售罄, 改签, 失物招领. The character/compound gap is 48 points. But 93% of the survival set *is* inside the official 3,000-character standard, smeared across all nine levels.
*Strength:* strong. *Scope:* computed against the official GF 0025-2021 lists and the official HSK 2.0 (2012) lists, both parsed this session.
*Source:* https://github.com/elkmovie/hsk30 ; https://github.com/glxxyz/hskhsk.com
*Consequence:* the pitch is *"none of this is obscure — 93% is in the official 3,000-character standard, just spread across nine levels of a ladder built for a different purpose."* The bank splits into two item **types**: character-acquisition items for the menu register, and compound-parsing/cloze items for transit, labels and shopfronts (换乘, 末班, 净含量, 保质期 are built from high-frequency characters whose combined meaning is opaque). Per §9–12, the band ships as an internal integer only; the letters "HSK" never appear in UI or store metadata.

**P30 — Mandarin offers no cognates to Dutch or English, so every item is a pure arbitrary paired associate — form, sound and meaning all novel.**
*Strength:* moderate (downgraded from the sweep's "strong": abstract-only, no bias diagnostic). *Scope:* bilingual lexical-processing studies; the retrieval-count implication is an inference from the *absence* of facilitation, not a measured figure for Chinese.
*Source:* Sanahuja & Erdocia (2024), *Language Teaching Research* — https://journals.sagepub.com/doi/10.1177/13621688241254617
*Consequence:* budget far more exposures per item than a European-language app would, and **do not import retention assumptions from Spanish or German vocabulary apps.** Measure retrievals-to-stable-recall from the log; do not assume 6–10.

---

## 1.5 Spacing, scheduling, and the architecture inversion

**P31 — UNCOMFORTABLE, AND THE LARGEST HOLE IN THE DESIGN. Spacing is the best-evidenced manipulation in L2 vocabulary learning specifically, and a co-located party game is structurally massed.** g = 0.40 on delayed tests for longer gaps across 98 effect sizes / 48 experiments / N=3,411 of L2 learning; in the closest single study spaced beat massed 26.62% vs 16.87% at a one-week test (1.6×). Expanding and equal schedules perform similarly, so an equal-interval ladder is a defensible v1.
*Strength:* strong. *Scope:* **classroom-L2** — real L2 words, real learners, ≥1-day delayed tests.
*Source:* Kim & Webb (2022), *Language Learning* 72(2), 269–319 — https://onlinelibrary.wiley.com/doi/abs/10.1111/lang.12479 ; Nakata & Suzuki (2019), *SSLA* 41(2), 287–311.
*Consequence:* **the scheduling layer, not the match engine, is the product.** An app played when friends happen to meet cannot deliver spacing, which is the effect that actually drives hanzi retention — so the solo daily surface is load-bearing, not a degenerate case of multiplayer. `nextDueAt` persists per item across matches and devices; the match engine draws from a **due queue**, never a per-match item list. "Re-queue at 5 and 15 intervening items" is within-session massing dressed as spacing. State this risk in the design document as a business-model consequence, not only a memory one. Spend nothing on expanding-vs-equal tuning.

**P32 — The second exposure of a newly introduced item should fall after a night, not later the same evening.** Lexical integration tracks sleep rather than elapsed time, and "recognised in session" and "integrated" are demonstrably different states.
*Strength:* moderate. *Scope:* **lab-wordlist**, spoken novel words in L1. Never tested on a logographic L2 — applying it to characters is an explicit extrapolation. Complementary-systems is a *framework*, not an effect, and the sleep-dependent competition result has accumulated null results and boundary conditions.
*Source:* Dumay & Gaskell (2007), *Psychological Science* 18(1), 35–39 — https://journals.sagepub.com/doi/10.1111/j.1467-9280.2007.01845.x
*Consequence:* ship the two-bit item state — `acquired` (correct within the introducing session) and `consolidated` (correct on a retrieval after at least one intervening night) — because it is cheap and it gates the entire confusable and distractor policy. **Present it as a defensible design bet framed by storage-vs-retrieval strength, not as a consequence of established neuroscience.** Store wall-clock timestamps and a boolean "crossed a sleep period"; never compute due-ness from session-relative counters. The storage/retrieval framing buys an extra prediction the neuro framing does not: a retrieval that succeeds when the item was nearly forgotten is worth far more than an easy one, so do not reward easy repetitions.

**P33 — Do not ship `gap = 0.15 × (target_date − now)`.** Cepeda's 10–20%-of-retention-interval result is a **two-session** experiment on L1-comprehensible trivia sitting on a deliberately flat, asymmetric optimum, and is not defined for the five-to-fifteen encounters an item will get here. Applied to the second-ever exposure of a novel character on a six-week horizon it schedules review ~6 days out, by which point a beginner has lost the item.
*Strength:* strong. *Scope:* **lab**, L1 trivia facts, one study episode + one restudy.
*Source:* Cepeda, Vul, Rohrer, Wixted & Pashler (2008), *Psychological Science* 19(11), 1095–1102.
*Consequence:* use the trip date to raise the **recall threshold** as it approaches, never to shorten the gap directly. First two-to-three encounters get short gaps (one overnight) regardless of trip date.

**P34 — Real L2 vocabulary does not decay to zero — there is a durable plateau — but the plateau's *height* is set by the amount of original training.** It is an argument for overlearning, not for early retirement.
*Strength:* moderate. *Scope:* **classroom-L2**, cross-sectional, self-reported rehearsal, decades-long intervals; absolute retention levels are low (~15% at 8 years).
*Source:* Bahrick (1984), *JEP: General* 113(1), 1–29 — https://pubmed.ncbi.nlm.nih.gov/6242406/
*Consequence:* make the primary mastery variable the number of **distinct days** on which an item was successfully retrieved, and surface *savings* ("this sign took you three looks last month; one today") rather than a streak. **Do not retire an item after N successes — that inverts the finding.** Any retirement threshold ships labelled as an unvalidated product decision.

**P35 — FSRS massively outperforms anything a team would hand-roll, and the honest headline is narrower than the marketing.** On an identical corpus (9,999 collections, 349,923,850 reviews) Log Loss: SM-2 0.722, Anki-SM-2 0.616, SM-2-trainable 0.581 — against FSRS-6 full 0.3456. But **default-parameter FSRS-6 is 0.3661, benchmarked *below* a zero-parameter moving average (0.3369)**, and the four-parameter middle path (FSRS-6 pretrain, initial stability per grade) scores 0.3548 with no optimiser dependency.
*Strength:* strong. *Scope:* recall-*prediction* calibration on Anki logs that were themselves generated under SM-2-derived scheduling (selection bias; intervals not randomised). **Measures prediction, not learning outcome.**
*Source:* https://github.com/open-spaced-repetition/srs-benchmark (SM-2 rows recovered from git history @45f61b2)
*Consequence:* §9–12 fixes `ts-fsrs` (FSRS-6) as the scheduler; **ship pretrain-4, not stock defaults** — shipping defaults means shipping the exact configuration whose numbers argue FSRS is unnecessary. Note ts-fsrs latest is FSRS-6.0, one generation behind the FSRS-7 rows people quote; quote FSRS-6 numbers in a document that specifies ts-fsrs. Constants, verbatim: `w[20] = 0.1542`, `FACTOR = 0.9^(1/−0.1542) − 1 = 0.980346`, `R(t,S) = (1 + 0.980346·t/S)^(−0.1542)`. Per-(player,item) state is 16 bytes; compute R inline at selection and never persist a due date.

**P36 — UNCOMFORTABLE. No published spaced-repetition model discriminates item-level recall much above chance in a real language product.** In Duolingo's own evaluation over 12.9M student-word traces every model sat within 0.04 of chance, and the crude Leitner box had the *highest* AUC (0.542 vs HLR's 0.538).
*Strength:* strong. *Scope:* production logs, two weeks, one company. Flashcard data is easier (srs-benchmark AUC reaches 0.71).
*Source:* Settles & Meeder (2016), ACL 2016, Table 2 — https://github.com/duolingo/halflife-regression/blob/master/settles.acl16.pdf
*Consequence:* **never show a player a numeric strength or mastery percentage for an item.** The model cannot support that precision and a wrong number is a visible, trust-destroying lie. Three coarse states distinguished by shape and fill (NEW outline / LEARNING half / SOLID filled), with SOLID able to fall back to LEARNING when R decays — surfaced as "3 characters need a refresh", never as a demotion. Aggregate only at deck level.

**P37 — Four hard, non-tunable constraints in the selection function**, from a documented production failure in which an adaptive system drove a feature-defined slice of items to punishing intervals, invisible in offline metrics because the variants were "virtually tied": (1) no item scored twice in one session — recurrences log `role: exposure` with no stability update; (2) no item advances out of LEARNING on same-session corrects; (3) cap consecutive incorrect answers per player at 2, then force-inject an item where that player's R > 0.95 regardless of the group objective; (4) floor any item's per-player minimum interval at 1 day.
*Strength:* moderate. *Scope:* an industrial post-mortem at one company, not a controlled test.
*Source:* Settles & Meeder (2016), §4.4.
*Consequence:* plus one monitoring query someone actually looks at — the per-item distribution of mean interval — so a collapsing slice is visible before players complain.

**P38 — The outcome signal comes from the attempt log, not from a periodic test.** The 60-item yes/no instrument's minimum detectable change between two sittings is ≈27 percentage points; even at a flattering 0.90 hit / 0.05 false-alarm rate it is ≈19. Resolving a 10-point change needs ~426 items.
*Strength:* strong. *Scope:* binomial sampling error over the instrument's own specification.
*Consequence:* §9–12 already demotes it to a placement instrument at onboarding, where it also supplies the cold-start calibration a mixed-ability table needs. Outcome signal = accuracy on items whose interval has crossed a ≥7-day threshold, aggregated over hundreds of items. And note the format's second problem: pseudo-*characters* are rejected on sight, collapsing the false-alarm rate the correction divides by, and "is this a word?" is a judgement Chinese does not cleanly support.

---

## 1.6 The social layer

**P39 — Co-located group retrieval suppresses individual recall — collaborative inhibition — and the compensating benefit lives in re-exposure *after* the retrieval, not during it.**
*Strength:* strong, but **cited from knowledge**: every scholarly host was blocked and the classic sources could not be re-verified this session. *Scope:* the classic paradigm is free recall of word lists in the lab, not L2 orthographic recognition in a game; the mechanism transfers by argument.
*Source:* Weldon & Bellinger (1997), *JEP:LMC* 23(5); Basden, Basden, Bryner & Thomas (1997), *JEP:LMC* 23(5); Rajaram & Pereira-Pasarin (2010), *Perspectives on Psychological Science* 5(6).
*Consequence:* **this is the central design constraint for a co-located multiplayer learning game.** Every player produces their own answer privately, on their own phone, before any answer is revealed: blind simultaneous commit → reveal → social scoring. Never a buzzer; never turn-taking where three players watch one player retrieve. The social layer belongs in reveal and scoring, where the re-exposure benefit lives, not in retrieval, where the inhibition lives. This is also what makes per-player scheduling coherent — every player has actually retrieved every item, one review row per player per round.

**P40 — Observers gain from watching others retrieve, and collaborative retrieval improves later *individual* memory — but seeing another player's wrong answer implants it.** Social contagion is a correctness argument for hiding per-player errors, not merely a comfort argument. And the vicarious benefit attaches specifically to **paired, dialogic** observation; solo observers did substantially worse.
*Strength:* moderate. *Scope:* lab collaborative-memory paradigms and physics tutoring dialogues (tens per condition), not L2 and not co-located games.
*Source:* Chi, Roy & Hausmann (2008), *Cognitive Science* 32(2), 301–341; Craig, Chi & VanLehn (2009), *Journal of Educational Psychology*.
*Consequence:* write an exposure record for **every** player when an item resolves, flagged `role: observer | answerer`, and let observer exposures advance scheduling state at a discounted weight — otherwise a player who watched thirty items and answered six is modelled as having seen six. Never show "what everyone else picked" as a distribution bar. If downtime is filled with a private parallel item, justify it by retrieval practice (**and make it cued recall — "what does this sign make you DO?", no options** — which lands in the strongest cell of P5 at identical interaction cost), and accept that it forfeits the vicarious benefit rather than capturing it.

**P41 — The nearest validated turn shape for one stimulus and many learners is peer instruction, and it is a four-beat sequence.** Individual clicker answer → peer discussion → re-answer → then a **second, isomorphic question answered alone with no further discussion**, on which performance improved — ruling out copying.
*Strength:* moderate (downgraded from strong by the critique). *Scope:* one genetics course, n≈350 undergraduates, concept questions; not L2 orthographic recognition and not a spaced-repetition context.
*Source:* Smith, Wood, Adams, Wieman, Knight, Guild & Su (2009), *Science* 323(5910), 122–124; Freeman et al. (2014), *PNAS* 111(23), 8410–8415.
*Consequence:* the last beat is the load-bearing one and requires an `isomorph_group_id` on the item bank (items authored in pairs or triples — same radical family, or same confusable pair, different character). Note the tension with P39: the confer beat must **never** precede the private commit.

**P42 — Competition has essentially no direct effect on performance**: the pooled association is near zero because performance-approach goals (which help) and performance-avoidance goals (which hurt) cancel.
*Strength:* strong on the pooled null. *Scope:* very large base (~170+ studies) but tested by meta-analytic SEM over largely **correlational cross-sectional** studies in which goal endorsement was *measured, not manipulated*; the near-zero pooled r masks high heterogeneity, so "zero on average" is compatible with real harm in identifiable subgroups.
*Source:* Murayama & Elliot (2012), *Psychological Bulletin* 138(6).
*Consequence:* this licenses exactly one claim — competition is not automatically harmful, so the mechanic is not disqualified on its face. It does **not** license the belief that UI copy can tip the sign. That is **CONTESTED**: nothing in the model demonstrates that a copy change shifts goal adoption, still less that shifted adoption shifts performance causally. Gain framing, no red negative numbers and no live losing order are cheap and harmless either way — ship them, but **book no benefit**, and make this the product's first A/B (outcome: next-turn latency and next-session return).

**P43 — It is LOSING, not competing, that undermines intrinsic motivation — and giving losers explicit competence feedback restores motivation to levels comparable with winners.** Pressure to win undermines motivation even among winners.
*Strength:* moderate. *Scope:* lab studies, ~100 undergraduates, non-language tasks. Justify by these two studies, not by treating SDT reward-undermining as established — that backdrop is genuinely contested.
*Source:* Reeve & Deci (1996), *PSPB* 22(1), 24–33; Vansteenkiste & Deci (2003), *Motivation and Emotion* 27, 273–299.
*Consequence:* the end-of-match screen leads, **for every player**, with an absolute competence statement — "You read 23 characters correctly tonight. 6 were new." Win/loss appears second and smaller. Credit is competence-contingent, never competition-contingent.

**P44 — Competitive, publicly evaluated goal structures make *ability* the salient explanation for the outcome, which harms low performers specifically**; bottom-position players on absolute whole-cohort leaderboards fare measurably worse on motivation and engagement than on near-peer relative ones.
*Strength:* moderate. *Scope:* Ames is seminal but its causal experiments are older, smaller and with children; Bai et al. is fully-online higher education, not co-located play; Hanus & Fox is small (n≈80) and confounded by section — a caution, not a result.
*Source:* Ames (1992), *Journal of Educational Psychology* 84(3), 261–271; Bai, Hew, Sailer & Jia (2021), *Computers & Education*.
*Consequence:* **banned from the shared interface**: any per-player accuracy visible to others, any persistent cross-match individual ranking, any "weakest player" label, any live who-is-losing ordering during play, any global leaderboard. Team totals only; individual breakdown private, on the player's own device, after the match.

**P45 — Team scoring without identifiable contribution produces social loafing — and hiding contributions to suppress ability attributions is in direct tension with the accountability condition cooperative learning depends on. The tension is resolvable.**
*Strength:* strong on the loafing meta-analysis (~78 studies); the resolution proposed is a **reasoned synthesis, not a tested design**. *Scope:* general social psychology, not games, not L2.
*Source:* Karau & Williams (1993), *JPSP* 65(4), 681–706.
*Consequence:* a filled dot per player per round showing **that** they contributed, never how much or how accurately. Presence-of-contribution is the effort cue; magnitude-of-contribution is the ability cue to suppress. And replace "team score = sum of correct × proportion contributing" with **improvement scoring**: `contribution = f(correct_this_round − personal_rolling_baseline)`, clipped, baseline recomputed after each match (Slavin, STAD — moderate; and note the cooperative-learning magnitudes are allegiance-contaminated per Cotton & Cook 1982, so use the sign as a prior and never as a planning number). The proportion formula still rewards raw correctness and therefore still makes the beginner a liability — the exact condition under which competitive structures do their documented damage.

**P46 — Foreign-language anxiety correlates about r = −0.34 to −0.39 with L2 achievement across three large independent syntheses (~97 samples, N ≈ 23,000 in the largest).** Enjoyment and anxiety are distinguishable dimensions (r ≈ −0.36), not opposite ends of one.
*Strength:* strong on magnitude. *Scope:* correlational, overwhelmingly cross-sectional self-report with course grades as outcome, so common-method variance inflates the pooled r. **Causal direction is CONTESTED** — the Linguistic Coding Differences Hypothesis argues the correlation is substantially a *consequence* of aptitude and L1 literacy differences, and the Sparks–MacIntyre exchange never converged.
*Source:* Teimouri, Goetze & Plonsky (2019), *SSLA* 41(2), 363–387; Dewaele & MacIntyre (2014), *SSLLT*, n≈1,746.
*Consequence:* two hard ones. (1) An anxiety-inducing mechanic is **not a neutral design choice in a language product specifically** — it operates on the largest measured affective moderator in the field. (2) **"Players report they had fun" is not evidence the mechanic is safe** — a session can be both. Justify every anxiety mitigation by **retention and attendance**, which we can measure, never by a promised learning gain, which the LCDH dispute makes unsafe to promise. And if anxiety is sampled, draw items from a validated fear-of-negative-evaluation instrument (Leary's Brief FNE), never from FLCAS subscales, which are not validated factors.

**P47 — Anxiety degrades processing *efficiency* before it degrades *effectiveness*: latency inflates before accuracy drops.** That gives the product a measurable early-warning signal for harm.
*Strength:* moderate. *Scope:* Attentional Control Theory is a general cognitive account, not a game or L2 study. Offered explicitly as the **falsifiable replacement for Krashen's Affective Filter**, which is unfalsifiable and must stay out of the design document.
*Source:* Eysenck, Derakshan, Santos & Calvo (2007), *Emotion* 7(2), 336–353.
*Consequence:* `response_latency_ms` is the harm tripwire. Alert on within-player latency inflation on opponent-dealt items relative to self-dealt ones.

**P48 — Time pressure costs accuracy (d ≈ 0.35) over and above making people faster, and it hits difficult items and high-ability participants hardest.** Speed scoring in quiz games shows no learning advantage over accuracy scoring.
*Strength:* moderate. *Scope:* the d ≈ 0.35 is Raven's Matrices, not L2 reading; Beilock & Carr is modest-n lab maths; the Kahoot point comes from a review of ~93 mostly weak-design studies. The mechanism (worry as concurrent WM load) is well established more broadly.
*Source:* *Should Intelligence Tests Be Speeded or Unspeeded?* (2023), *Journal of Intelligence* 11(6):120 — https://www.mdpi.com/2079-3200/11/6/120 ; Wang & Tahir (2020), *Computers & Education* 149 — https://www.sciencedirect.com/science/article/pii/S0360131520300208
*Consequence:* **never award points for speed**; break ties on total round time. **Do not stack pressures** — allow at most one of {visible countdown, live opponent monitoring, public score change} to be salient per item, and since observation is inherent to a co-located game, the countdown is the cheapest to remove. Silent generous window with a subtle desaturation in its final fifth. No timeout penalty on an item's first exposure. The harder bet tier must never carry the shorter timer. WCAG SC 2.2.1 makes an accessible way to turn off, adjust or extend the limit a **requirement**, not a nicety — and the inherited 45s/75s/120s timers engage it directly.

**P49 — Adaptive item difficulty targeting roughly a 75% success rate, via an Elo rating on players *and* items updated after every response, is the standard production-proven way to run a mixed-ability practice game.**
*Strength:* moderate. *Scope:* Math Garden — arithmetic, Dutch schoolchildren, national scale. Not L2, not co-located. But it is a real production system with published evidence.
*Source:* Klinkenberg, Straatemeier & van der Maas (2011), *Computers & Education*.
*Consequence:* this makes the opponent-dealing mechanic **safe by construction** and replaces the invented "≥5 prior exposures" gate. It also supplies the item difficulties that improvement-based scoring needs. Keep the character-dependency constraint **per-player, not group-wide**: a group whose weakest member knows 300 characters and whose strongest knows 1,200 has 1,451 eligible words rather than 7,330 under a group-wide constraint — 80% of the strong player's readable vocabulary excluded before the difficulty objective even runs.

**P50 — UNCOMFORTABLE, AND THE MOST PRODUCT-CRITICAL FACT IN THE CORPUS. There is NO controlled study of whether public failure in a language-learning game suppresses subsequent participation.** Both the sweep and its adversary state this independently. Any claim that it does — or that it doesn't — is currently an inference from adjacent literatures.
*Strength:* strong (as a statement about the absence of evidence).
*Source:* Wang & Tahir (2020), *Computers & Education* 149 — https://www.sciencedirect.com/science/article/pii/S0360131520300208 ; MacIntyre, Dörnyei, Clément & Noels (1998), *Modern Language Journal*.
*Consequence:* **the product must answer this in-house, and can, cheaply.** Store `turns_since_last_public_failure` as a field so the analysis is a query, not a data-collection project. Log per player: turns voluntarily initiated, next-turn response latency, abandonment, and next-session return, each keyed to whether the *previous* turn was a public failure. A within-player pre/post comparison is a real experiment at n≈200 players.

**P51 — Self-explanation is the cheapest well-evidenced intervention available: g = 0.55 across 69 effect sizes from 64 reports with 20 coded moderators.** Verified exactly by adversarial check.
*Strength:* strong. *Scope:* **classroom/instructional** — expository text, worked examples, maths and science problems (the sweep mislabelled this lab-wordlist).
*Source:* Bisra, Liu, Nesbit, Salimi & Winne (2018), *Educational Psychology Review* 30, 703–725 — https://link.springer.com/article/10.1007/s10648-018-9434-x
*Consequence:* the co-located format gives this away free — one spoken prompt at the reveal on the confusable pair, addressed to the highest bettor: *"why isn't it 入口?"* ~5 seconds, spoken to the table, never typed, never scored. Typed self-explanation kills party-game pace. Note the boundary: self-explanation costs **time**, and the advantage shrinks when time-on-task is equated, so it must displace something rather than be added on top.

**P52 — Learners' judgments are systematically inverted for exactly the manipulations this product depends on** — spacing, interleaving, retrieval practice and difficulty generally.
*Strength:* strong. *Scope:* broad, well-replicated metacognition literature.
*Source:* Bjork, Dunlosky & Kornell (2013), *Annual Review of Psychology* 64, 417–444; Kornell & Bjork (2008), *Psychological Science* 19(6), 585–592 — https://journals.sagepub.com/doi/abs/10.1111/j.1467-9280.2008.02127.x
*Consequence:* the **experimentation policy**, stated once at the top of the document: *no learning-relevant feature may be killed or shipped on self-reported difficulty, perceived helpfulness, in-session accuracy, or session satisfaction — all four move the wrong way.* The only admissible primary metric is delayed accuracy at ≥1 week, ideally on **transfer** items — real signage the player has never seen, in display and handwritten faces, with the target embedded in a longer string. Report training-context and transfer accuracy side by side and expect a gap. Warn the team in advance that the confusable panel and the interleaved schedule will *feel* worse.

**P53 — Difficulty carries a motivational cost the retention literature routinely omits, and the applied literature on quitting converges on inability to perceive progress.**
*Strength:* moderate. *Scope:* mixed applied literature; **no RCT quantifying dropout as a function of difficulty in a language app** — the practitioner material filling that gap is folklore.
*Source:* *Motivational Strategies to Engage Learners in Desirable Difficulties* (2020), *JARMAC*.
*Consequence:* make progress legible in the product's own currency — signs, not points (see P28). This is also why the co-located format earns its place: co-located play produces the highest enjoyment and perceived social presence of any configuration (Gajadhar, de Kort & IJsselsteijn 2008 — moderate, measures **enjoyment and social presence, not learning**). **Claim engagement for the co-located format, never learning.**

**P54 — Desirable difficulties reverse in two documented ways: for high-element-interactivity material, and with expertise. A difficulty is desirable only if the learner can actually execute the effortful process.**
*Strength:* strong. *Scope:* **classroom/instructional** (high-element-interactivity material is definitionally instructional, not word lists).
*Source:* Chen, Castro-Alonso, Paas & Sweller (2018), *Frontiers in Psychology* 9:1483 — https://www.frontiersin.org/articles/10.3389/fpsyg.2018.01483/full
*Consequence:* this bounds Decision 1 and the reveal card together. A top-tier bet on a category where the player holds no component knowledge is not a desirable difficulty, it is a coin flip. And the **reveal card must thin out as an item's accuracy record improves** — scaffolding that helps a first-time viewer costs a player who already knows the item. Element budget by integration load, not by a chunk constant: **one target, one decomposition, one contrast**; everything else behind an explicit tap.

**P55 — Gamification's cognitive effect clusters around g ≈ 0.45–0.50, but the elements that moderate behavioural outcomes are game *fiction* and *competition-combined-with-collaboration* — not points and leaderboards. Badges, leaderboards, competitions and points are the elements most often reported as causing negative effects.**
*Strength:* moderate, and reclassified **contested-magnitude**: the "converging" meta-analyses draw on a heavily overlapping primary pool with short durations, novelty confounds and researcher-made post-tests, and Sailer & Homner's own motivational and behavioural effects did not survive their high-rigour subsplit.
*Source:* Sailer & Homner (2020), *Educational Psychology Review* 32, 77–112 — https://eric.ed.gov/?id=EJ1245270 ; Almeida, Kalinowski, Uchôa & Feijó (2023), *Information and Software Technology* — https://arxiv.org/pdf/2305.08346
*Consequence:* invest in **fiction** and in competition-plus-collaboration; ship no global leaderboard and no points economy. Frame each round as a place — "the noodle shop", "Line 2 to the airport". Expect decay: instrument retention at 8+ weeks rather than assuming the effect persists past novelty.

---

## 1.7 What we will not build on

Everything in this subsection is a **myth, a retracted claim, or an invented constant**. None may be cited as a rationale, and the list ships in the design document as an explicit banned-rationales register so it cannot be quietly reintroduced in six months.

### From the learning-science digest

1. **Perceptual disfluency as a desirable difficulty** — degrading the sign (blur, low contrast, an awkward typeface) to make memory better. *The best-publicised instance failed four experiments plus independent replications; disfluent fonts produce equivalent or impaired memory.* Three separate agents proposed and then killed it unprompted, which tells you how reliably a team that has absorbed "desirable difficulties" reaches for it. Difficulty must come from **retrieval demand**, never from degrading the pixels. Varying realistic typefaces is variability, not degradation — a different manipulation. (Taylor, Sanson, Burnell, Wade & Garry 2020, *Memory* 28(7); Geller, Still, Dark & Carpenter 2018, *Memory & Cognition*.)
2. **Learning styles** — no "are you a visual learner?" onboarding question, ever. *The field's classic fraud; no evidence that matching instruction to a self-reported style improves anything.* (Pashler, McDaniel, Rohrer & Bjork 2008, *PSPI* 9(3), 105–119.)
3. **The 10,000-hour rule.** *Deliberate practice explains a small and highly domain-variable share of performance variance.* (Macnamara, Hambrick & Oswald 2014, *Psychological Science*.)
4. **The bizarreness effect** — and the "cap bizarre glosses at one in five" rule built on it. *Requires mixed lists and within-subject manipulation, is absent in cued recall and unreliable in recognition — which is this app's test — so it carries no memory-design load at all, and the ratio is invented precision policing an effect that does not appear on the outcome measure.*
5. **The method of loci as a product feature** — no memory palace, no journey or chain through a set of signs, no ordered-route item selection. *Evidenced for immediate serial and free recall of word lists and essentially nothing else; the kill argument is the outcome-measure mismatch — MoL puts N items back in order, this product needs meaning retrieval from a form. Do not defend the exclusion on construction cost; basic MoL benefits appear after minutes of instruction.*
6. **"Explicit binding" as the justification for the bet.** *RETRACTED. Explicit binding in the cited VR study is a spatial operation — attaching an object to a locus. A wager on a four-option guess shares only the English word "explicit": no shared mechanism, no shared outcome measure, no linking study.* The bet survives; the citation does not.
7. **A "direct neural warrant" for bet-then-reveal — curiosity drives dopaminergic encoding, so put the breakdown in the anticipation window.** *Category error twice over: midbrain BOLD does not measure dopamine, and no imaging result constrains an interface. Strip the fMRI and the load-bearing behavioural leg is curiosity boosting incidental memory — the weak, inconsistent, underpowered half of that literature, directly contradicted for the closest analogue (memory was POORER for incidental scholastic facts after high-curiosity questions).* The "~1.5–2 s anticipation beat" is invented outright.
8. **fMRI of expert Chinese readers as a warrant for the breakdown panel's layout; and "the neuroscience says variability is the active ingredient."** *The second is false as stated — the study invoked is longitudinal fMRI of ten six-year-olds learning an alphabetic script, with no manipulation of variability, no learning outcome and no adults. The first is an ALE meta-analysis of where blood flow changes in native readers, which cannot adjudicate between two layouts.* In both cases the recommendation survives and the justification is deleted — the healthiest possible outcome, and worth saying plainly: **none of these UI decisions was ever derived from neuroscience; they were derived first and decorated afterwards.** The behavioural rationale for a spatial breakdown already exists (positional regularity is implicitly acquired by CSL learners).
9. **Cowan's ~4-chunk limit (or "~3 for visual") as a hard cap on reveal-screen elements.** *Cowan's limit governs chunks held in the focus of attention IN THE ABSENCE OF THE STIMULUS; a screen whose elements all remain visible imposes essentially no storage demand — the display IS the memory. The "~3 for visual" figure additionally inherits the discrete-slot model, whose integer is the actively disputed part.* Re-derive the rule from element interactivity instead (P54).
10. **"Context encoded is context retrieved" — rendering in a realistic environment reinstates context.** *Environmental context-dependent memory is small (d ≈ 0.28; g = 0.32), reduced or eliminated for RECOGNITION, vanishes for meaningful material at longer study times, and its flagship demonstration (the 1975 divers) FAILED a direct replication. Worse, the rendered sign is not environmental context at all — it is part of the stimulus, present at study and test. Nothing is being reinstated.* No ambient-scene backgrounds, no "study in the same place" nudge, no geolocation-matched review. (Murre 2021, *Royal Society Open Science* 8(11):200724 — https://royalsocietypublishing.org/doi/10.1098/rsos.200724 ; the recognition null is **Godden & Baddeley 1980**, not Smith, Glenberg & Bjork 1978.)
11. **Picture superiority / dual coding as the justification for object-realistic rendering.** *RETRACTED as applied. Picture superiority compares items STUDIED AS PICTURES against items STUDIED AS WORDS; here the to-be-remembered item is an orthographic form in every condition — photographing it onto an enamel plate changes the surround, not the stimulus format. And dual coding is not the leading explanation: the effect is eliminated when physical distinctiveness is equated.* Corollary: **no clip-art beside characters** — an exit-door pictogram beside 出口 adds a cue that will not be on a real Chinese sign and risks the player learning the pictogram.
12. **The Ebbinghaus forgetting curve, and "you forget 50% within an hour and 70% within 24 hours."** *Graded folklore for meaningful language material: one subject, nonsense syllables, savings-in-relearning rather than recall; the modern replication is N=1 with substantial variability.* No forgetting-curve graphic, no "you'll forget 70% by tomorrow" nudge. Any forgetting function in the scheduler is fitted to our own per-item data. Note the 24-hour discontinuity in that N=1 curve does **not** support the overnight architecture — that rests on P32.
13. **"Study just before bed and you retain 20–30% more"; sleep audio; targeted memory reactivation.** *The bedtime claim is folklore — the best adolescent study found afternoon training BEAT evening training at 24 hours. TMR is fragile, timing-sensitive, and can actively HARM memory in unsupervised home use; a subgroup gets worse, the app cannot detect sleep stage, and the downside falls on the user.* Remove from the backlog rather than parking it. The only robust consequence is ordinal: exposures should straddle nights.
14. **Forcing the player to re-tap the visible correct answer after an error — "the cheapest effect size in the whole product."** *It is a null. Re-tapping a highlighted on-screen answer is COPYING, not retrieval. The prompts-beat-recasts result it rests on concerns oral, ill-formed learner production in interaction; there is no ill-formed output in a four-alternative tap.* Replace with feedback → requeue at a delay.
15. **"PSTM explains ~30% of the variance in uptake."** *Threefold arithmetic error: r = .31 means r² ≈ .096 — roughly 9–10% — and it is scoped to AUDITORY vocabulary acquisition, of unknown magnitude for orthographic learning in a logographic script.* The design rule (audio optional, never gating, never scored) survives as cheap insurance against a ~10% effect in an adjacent task.
16. **"The self-reference effect is large (d ≈ 0.65 vs semantic encoding)."** *The meta-analysis reports ~0.50 across 129 studies of trait-adjective lists, and the effect is SMALLER for self-vs-other than self-vs-semantic — the larger number was attached to the comparison that yields the smaller one.* Grade moderate. Second-person framing ("you're holding a bag of oranges, the label says 5.80/斤") is proportionate; do not build a personalisation engine on it.
17. **"Deliberate vocabulary study is three to four times more efficient than incidental learning."** *The multiplier is manufactured by dividing across two meta-analyses with no shared design, no time-on-task control and no common outcome measure — a ratio of two unrelated denominators.* The direction is supported; the number is not a finding. Drop the adjacent "do not build a comprehensible-input mode" too — input-based reading has its own meta-analytic support and is complementary.
18. **"Treat any gamification number below g ≈ 0.4 as noise."** *An invented decision rule, and backwards as a bias heuristic: publication bias inflates estimates regardless of where they land, and small-study effects make LARGE published estimates from small-k literatures the most suspect.* Replace with a provenance rule — weight by design, preregistration, sample size and k.
19. **The invented constants that reached spec-level language.** A ~1.5–2 s anticipation beat; "at least THREE typefaces per word"; "suppress the mnemonic from exposure 3"; "retire an item after 4 successful retrievals"; "≥3 renderings before an item may be marked consolidated"; "at most FOUR chunks on the resolution screen"; "cap bizarre glosses at one in five"; "you can now read ~40% of what's on the wall." *No cited source specifies any of them.* The last is wrong twice over — the ~40%/top-100 figure comes from general running text whose top ranks are function morphemes absent from signage (的 一 是 了 不 在), and on a four-character sign 40% token coverage means essentially **zero** complete signs readable. The "retire after 4" rule specifically **inverts** its own source (P34). (Note that §9–12's `contexts.size >= 3` graduation gate is a *deliberate product decision on template transfer*, correctly labelled as such — not the struck memory constant.)
20. **Citation and grading defects that must not propagate.** Hypercorrection persistence is **Butler, Fazio & Marsh (2011)**, not Metcalfe & Finn. The recognition null for environmental context is **Godden & Baddeley (1980)**, not Smith, Glenberg & Bjork (1978). Kang & Pashler (2012) is *Applied Cognitive Psychology* 26(1), 97–103 — the DOI prefix in circulation points at a different journal. The chunking arithmetic is **Cao et al. (2013)**, cited for its numbers while its result went unread. Osgood's 1949 transfer surface was graded "strong" from a lecturer's course webpage; it is a historical schematic whose response-similarity predictions did not survive the 1960s transfer literature — grade **weak, framing only**.
21. **Material-type labels that flattered ecological validity, always in the direction of the decision they carried.** Corrected for propagation: Little et al. (2012) → lab-**prose**; Bisra et al. (2018) → classroom/instructional; the prequestion meta-analysis → classroom/instructional; Chen et al. (2018) → classroom/instructional; Gruber et al. (2014) → lab trivia + faces; Pelzl (2025) → lab-logographic, single session; Brunmair & Richter (2019) → lab **category learning**, not "both"; Ishii (2015) → **20-minute** lab interval; Wang & Thomas and van Hell & Mahn → lab L2 paired associates, ≤1 week; the chunking arithmetic → a corpus statistic, not a memory finding at all. Add a `retention_interval` field per finding — `material_type` alone cannot carry this. **Only a handful of items survive as genuine classroom/real-L2 evidence at real intervals — Bahrick, Nakata & Suzuki, Kemp, Kim & Webb — and the verdicts must be visibly weighted toward those.**

### From the Chinese digest

22. **"There is no published character-frequency corpus of Chinese urban signage, so the bank cannot be corpus-derived and we must build one by peer-to-peer photo capture."** *False, and it was the load-bearing negative finding of the entire curriculum sweep. CTW (Tsinghua/Tencent, JCST 2019) has 1,018,402 individually character-labelled instances over 32,285 street-view images and 3,850 characters, with a `STAT_FREQUENCY` step already in the shipped baseline — https://ctwdataset.github.io/ . The sweep searched linguistic-landscape sociolinguistics; this lives in computer vision.* "After ~5,000 captures you own the dataset nobody has published" is false on both halves. **Offsetting caveat:** CTW's annotations are CC BY-NC-SA 4.0, so a derived artefact cannot ship commercially — use it internally as a research input, and ship nothing derived from the annotations.
23. **"~80–85% of characters are phono-semantic, so decomposition is the dominant regularity and a pictograph path covers under 10%."** *Unit-of-analysis error — that is a whole-script statistic and this bank is the head of the distribution, where transparency is inversely related to frequency.* See P23.
24. **"A single two-slot card — left box = meaning, right box = sound — handles ~72% of the bank."** *Two errors compounding: the 72% is 72% OF PHONOGRAMS, not of all characters; and the layout is only honest for characters that are BOTH left-right AND phonetic — 30.7% of the top 1,000, 13.0% of the top 100.* As a default it would teach a false analysis of 一 是 人 了 不 中 国 大.
25. **"Budget for about 1 in 3 phonetic hints being wrong."** *Roughly 2× too optimistic for the band we ship: about 5 in 6 are wrong at tone level over the top 1,000.*
26. **"HSK band order is not frequency order — a travel reader needs 出口 and 元 before HSK gives them."** *Refuted by the list itself: 出 (rank 26), 口 (157) and 元 (211) are ALL HSK 1. Band order IS strongly frequency-aligned (median rank rises monotonically 291→2,637) and HSK BEATS raw frequency on this product's vocabulary — 厕 is frequency rank 3,107 but sits in HSK 4.* Use a blended ordering (functional payoff × band × frequency as tie-breaker); never seed or sort from a frequency list.
27. **"Teach 月 = flesh/body-part and highlight it inside 肠 肚 肝 肺 肾 腰 脑."** *Wrong codepoint, and it ships as a silent bug.* See P22. The exception list circulating was also wrong twice (舌 omitted; 筋 mishandled), and even a correct "meat" gloss misfires on 期 朗 服 有 望.
28. **"Ship a ~30-radical onboarding module including 食 as the food radical, plus 男 and 页."** *Three content errors. The productive simplified food radical is 饣 (43 common characters: 饭 饿 馆 饺 饼 饮 馒 饥 饱) against 12 for 食, mostly traditional or rare — a learner taught 食 will not recognise it in 饭馆 or 饺子. 男 is not a radical at all (田 + 力). 页 yields 顶 顺 须 顾 颈 领 额 题 — essentially zero menu or signage payoff. And the highest-value menu radical is missing entirely: 火/灬 is the radical of 9 of the 13 core cooking methods (炒 爆 炸 煮 烤 焖 炖 烧 煎).* Validate the whole list against **simplified** component forms: 讠/言, 钅/金, 纟/糸, 饣/食, 见/見.
29. **Tone colour-coding on characters.** *Unevidenced folklore that is also the industry default. No controlled trial could be located; the schemes are mutually incompatible across Pleco, Hanping, Skritter and Dong Chinese; it contradicts the direct finding that added colour on the glyph raises RT and lowers accuracy; it builds a crutch with no transfer target; and colour-only encoding is a WCAG 1.4.1 failure with red/green as the failing pair for ~8% of males.*
30. **"Early pinyin creates dependence and harms character acquisition (the pinyin crutch)."** *No adequately powered RCT of pinyin-first vs character-first exists, and the evidence that could be located points the other way — pinyin ability was not correlated with character recognition in beginners, and experienced learners activate character orthography when READING pinyin.* Practitioner assertion. The better-supported point is about **placement**, not presence (P27).
31. **Heisig-style, Mandarin Blueprint-style and Chineasy character systems as validated methods.** *No peer-reviewed trial of any of them exists; a systematic review of 22 articles and 39 methods contains none. For Chineasy the structural objection is decisive and quantitative — pictographs are ~8–10% of the script, so a pictograph-based system cannot scale.* Repeating Chineasy-style false etymologies is a known reputational liability among Chinese-teaching professionals. (Mair 2014, *Language Log* — https://languagelog.ldc.upenn.edu/nll/?p=11109)
32. **"Imagery mnemonics beat rote for Chinese characters."** *The classic finding is the opposite: across two 2×2 studies, experimenter-supplied imagery showed NO advantage beyond the immediate test and produced GREATER forgetting at 2-day and 1-week delays. And the keyword method links an L2 SOUND to an L1 word, so it addresses pinyin-to-meaning, not glyph-to-meaning, and does not transfer to character recognition at all.* Separately **CONTESTED**: whether keyword actively *costs* retention is disputed — critics attribute the excess forgetting to presentation-rate confounds, there is a published rebuttal, and supplying pictures at acquisition eliminated the excess forgetting (which collides with the recommendation not to add imagery). The whole dispute lives at ≤1 week. The conservative action is identical under both readings: **never schedule an item more leniently because a mnemonic was shown.** (Wang & Thomas 1992, *Language Learning* 42(3) — https://eric.ed.gov/?id=EJ451687 ; Gruneberg 1998, *Applied Cognitive Psychology* 12, 529–532.)
33. **"~83% of game-using learners outperformed non-users," and mobile-game effect sizes of g ≈ 0.96–1.28 as planning constants.** *The 83% is not an observed proportion — it is Cohen's U3, mechanically derived from g = 0.962 under normality (Φ(0.962) ≈ 0.83), a distributional conversion reported as a headcount of people. Delete the sentence. And in education RCTs the median effect is ~0.10 SD; effects near 1.0 SD signal researcher-made outcome measures, small quasi-experimental samples, no active control and publication bias.* (Kraft 2020, *Educational Researcher* 49(4).) The same applies to the g ≈ 0.87 digital-game vocabulary figure — plan against the general game-vs-non-game estimate (g ≈ 0.33) instead.
34. **"Advanced Dutch learners show strongest sensitivity to T1 and weakest to T4."** *Runs against essentially the whole Mandarin tone-perception literature — T4 has the steepest F0 excursion and is consistently among the BEST-identified tones by non-tonal-L1 learners. If the paradigm was contrast-based, "sensitivity to T1" is not even a well-formed unit of that design.* Quarantined as probably reversed or mis-transcribed. The safe prior is **T4 easiest, T2/T3 hardest** — and T2/T3 must never gate progress: exclude the T2↔T3 swap from the pinyin distractor pool for the first 200 items.
35. **"Musicians learn tone better, so ask about instruments in onboarding."** *The original finding is correlational; replication attempts frequently fail, and music-training associations disappear when music APTITUDE is held constant — selection, not transfer.* If an adaptive signal is ever wanted, use a 60-second, 12-trial pre-test of pitch-contour identification on non-speech tones.
36. **Assorted content errors that would ship as wrong teaching or wrong copy.** 注意/休息/医院 are *not* absent from HSK 1–3 (L3, L2, L1). 檢 續 醬 鹹 餃 質 藥 攤 邊 are **traditional** forms leaked into a simplified-only product as its worked examples of maximum complexity — the simplified forms are 检 11, 续 11, 酱 13, 咸 9, 饺 9, 质 8, 药 9, 摊 13, 边 5. 无座 is *not* the same price as a hard seat on G/D services. 凤爪 is **fèngzhǎo**, not fèngzhuǎ; 鸡爪 is jīzhǎo; 里脊 is more standardly lǐji. "Minded garlic" is a typo for *minced*. GB/T 30240 is 推荐性 — **recommended and voluntary**, not compulsory. "-ün is an elided-vowel rime" — -ün is not a pinyin spelling at all; jun/qun/xun/yun is /yn/ with no elided vowel, and expanding it would teach jūn as ⟨ju-en⟩. There is **no official hour table** for HSK 3.0. And the proposed lint rule rejecting items with a verb and no overt subject would reject 禁止吸烟, 小心地滑, 请勿触摸 and 卖完了 and **empty the bank** — Chinese public signage is a subjectless, function-word-free telegraphic register, so the correct lint rule is the opposite one.

### From the interface-social digest

37. **"Multiple choice beats recall: MC practice produced a larger testing effect than short answer (g = 0.70 vs 0.48)."** *Dead twice over. That contrast is a BETWEEN-STUDY moderator confounded with final-test format — MC-practice studies disproportionately used MC final tests, and the same meta-analysis separately reports format match inflating the effect. The within-subject literature points the other way, and Rowland's format moderator puts MC in the weakest cell on both axes (P5).* Keep MC; delete the justification.
38. **The Duolingo efficacy study as an hours anchor (~112–141 h to functional reading).** *RETRACTED. It evaluated learners of SPANISH AND FRENCH by English-speaking US adults and contains no Mandarin data. Transferring hours-to-proficiency from two shallow-orthography Romance languages with thousands of cognates to a logographic script with zero orthographic transfer is invalid and under-budgets badly — and it was the sweep's only quantitative planning anchor.* The relevant comparator is FSI Category IV (~2,200 class hours for Mandarin vs ~600–750 for Spanish/French) — and even that is a whole-language classroom figure. **Project no total-hours figure at all**, and never set the in-app goal to a CEFR or HSK level.
39. **The invented product numbers.** "≥5 prior exposures before an opponent may deal"; "≤20-word explanations"; "≤14 px score delta / ≥17 px explanation text"; "correction within 300 ms"; "no screen idle >2 s"; "8–12 minute matches"; "≥40 scored retrievals per 10-minute session"; "a 60/40 content-vs-game-feel budget split"; "re-queue at 5 and 15 intervening items"; "1-match-in-5 anxiety sampling"; "a 3-row leaderboard." *None appears in or is derivable from any cited source.* Even the 20-word cap combines a native-English silent reading rate with an invented degradation factor and an invented window length. The px values would additionally fail WCAG 1.4.3 and 1.4.4.
40. **"Fear of negative evaluation is one of three constitutive factors of foreign-language classroom anxiety, so the mechanic is close to a laboratory operationalisation of it."** *Standard textbook misreading. Horwitz, Horwitz & Cope drew an ANALOGY to three constructs to motivate a distinct situation-specific one, and were explicit it is not reducible to their sum; factor-analytic replications recover two to five factors, and Horwitz herself has objected to subscale scoring.* FNE remains a well-motivated concern — but measure it with a validated FNE instrument, not a nonexistent FLCAS subscale.
41. **"A private shadow item on every observer's phone captures the vicarious-learning benefit."** *It implements the arm of the study that FAILED — solo observers did substantially worse, and a player answering their own item is not attending to anyone's reasoning.* Parallel private retrievals are still worth shipping (and should be **cued recall**, not a second four-option tap) — but justified by retrieval practice, not by Chi et al., and accepting that they forfeit the vicarious benefit rather than capturing it.
42. **"Two or three tappable 'reason chips' after the answer are a self-explanation prompt worth g = 0.55."** *That mechanic is not self-explanation. Every study in the pool prompts learners to GENERATE an explanation, or to select from a structured domain menu naming a principle. Tapping a post-hoc label about HOW you answered is a strategy attribution — closer to a judgment of learning — and produces no new inference.* Keep the chip as **instrumentation** for confidence-based scheduling and bill it as such. A menu version can work if the options are domain propositions: *"which part told you? [semantic radical] [phonetic component] [the character it is NOT: 未]"*.
43. **Wisniewski, Zierer & Hattie (2020) as independent corroboration of the feedback effect sizes ("~435 studies, ~994 effect sizes, N ≈ 61,000").** *Unit-of-analysis error plus false independence: it is a meta-analysis OF ~435 META-ANALYSES, understating participants by orders of magnitude — and it re-pools the very primary studies Van der Kleij and Kluger & DeNisi already pooled. Hattie authors both "converging" sources.* The feedback story rests on **one substantially shared evidence pool**.
44. **Wait-time research (extend the pause to ~3 s) as the basis for a 5-second minimum and 10-second soft window.** *The corpus is 1970s–80s classroom observation of TEACHER pause duration after an oral question — small samples, no randomisation, unblinded observers, and outcomes that are properties of student TALK, not learning. There is no oral discourse, no teacher and no turn-taking norm in a silent tap on a phone; the 5 s and 10 s numbers have no source at all.* Set the window from our own latency distribution (~90th percentile of correct responses).
45. **"Being watched is a small effect (0.3–3% of variance), so do not over-engineer against observation."** *The reassuring number describes a PASSIVE audience. This mechanic has an opponent who selected your item, holds a competitive stake in your failure, and observes the outcome — evaluation apprehension plus outcome interdependence — and hanzi recognition for a beginner is by definition a non-dominant response, the impairment side. The small average also hides opposite-signed subgroups.* **This correction cuts against the sweep's own conclusion: private input becomes MORE necessary, not less.** And "my friends will be nice about it" is not a mitigation — a 2025 CSCW experiment (n=85) found *supportive* spectatorship more detrimental than critical.
46. **"After a wrong answer, immediately re-present the item with the chosen lure removed" and "never reuse a wrong option as a correct answer elsewhere in the session."** *Both wrong for this bank. Immediate re-presentation with the lure removed is massed repetition of a now-trivial two-option item, and Butler & Roediger attribute the repair to CORRECTIVE FEEDBACK, not to immediate re-testing. And the no-reuse rule is unworkable: in a menu domain the confusable set IS the syllabus (牛肉 is the correct answer for one item and the ideal distractor for 羊肉), so forbidding reuse either forces weak filler distractors — destroying the three-option result — or fragments the confusable set across sessions, which is exactly what discrimination learning must not do.* Keep only the third mitigation: log `{itemId, lureId, timestamp}`.
47. **"Godfroid et al. proves colour coding is harmful."** *Over-read in the other direction — colour training WORKED (~11% item-learning, ~12% system-learning gains), just slightly behind pitch contours and numbers. "Slightly worse than the best alternative" is not "do not do it."* Keep the no-colour rule and change the justification to WCAG 1.4.1 + CVD prevalence + the guidance-reversal transfer argument (P26).
48. **Hand-authored Chinese examples and physical-size figures.** *蔬 is 15 strokes not 18; 警 is 19; 齿 is 8 — the 15-stroke form is TRADITIONAL 齒, a traditional count leaked into a simplified-only product as its worked example of maximum complexity. Of the "easiest 2-stroke" set 出/入/男/女, only 入 is 2 (出 is 5, 女 3, 男 7). 药店 and 酒店 share NO component (艹+约 vs 氵+酉) — they are situational, not visual, neighbours, and this was the single worked example for the top-priority distractor rule.* Derive every stroke count from Unihan `kTotalStrokes` and assert at build time.
49. **"The 44 px touch target is the accessibility requirement / an empirical finding."** *It is a platform convention. WCAG 2.2 SC 2.5.8 is 24×24 CSS px at AA; 44×44 is SC 2.5.5 at AAA; Apple says 44×44 pt and Material 48×48 dp — three numbers for three different things. The empirical anchor (Parhi, ~9.2 mm) is in physical units and lands larger than 44 CSS px on most phones.* Related and load-bearing: **CSS px do not convert to millimetres at 96/inch on a phone** — phones render ~160 CSS px per physical inch (~6.3 CSS px/mm), so every physical and angular figure in the original sweep was off by ~1.67× **in the unsafe direction**. Never use CSS mm/in/pt for physical sizing.
50. **"Ship Simplified only, because the target is mainland China."** *The scope call is fine; the reasoning is not, and the naive implementation is dangerous. Mainland law carves out calligraphy and handwritten shop inscriptions, and traditional forms are pervasive on exactly the shopfronts and noodle shops the product targets — a learner who has only met simplified 面 will not recognise 麵館. And simplification merges land directly on menu vocabulary.* Ship simplified as the learning target with a **traditional list** per string plus a word-level override table, surface the counterpart on the reveal for shopfront/food items, and CI-fail on any item containing 面/干/发/后/里/松/只/几/表/系/术 with a scalar `trad` field.

### From the systems digest

51. **"Half-life regression improved Duolingo engagement 12% over the Leitner box."** *RETRACTED against the paper. HLR vs Leitner over 6 weeks and ~1M randomised students: any activity +0.3 (n.s.), new lesson +0.3 (n.s.), practice **−7.3% (p<0.001)** — no significant gain and a significant DROP. The +12% is Experiment II, HLR-lex vs HLR: the gain came from REMOVING features and making the model simpler. And the outcome throughout is next-day retention; no vocabulary gain was measured in either experiment.* Never justify a design decision on the grounds that a smarter scheduler drives engagement, and do not instrument the PWA to optimise next-day return.
52. **"Do not implement HLR" is the ruling; "HLR is the right reference implementation for a cold-start language PWA" is the myth.** *HLR is one of the worst-calibrated models on independent data (Log Loss 0.4694 vs a constant baseline's 0.3945), and Leitner had the nominally highest AUC in Duolingo's own table. Two separate critiques recommended it from memory; the numbers were read from the source. Its reputation propagated faster than its results.*
53. **"FSRS delivers 20–30% fewer reviews than SM-2 for the same retention."** *The project's own wiki carries the caveat inline: the figure is based on **simulation**. There is no A/B test and no user study behind the industry's most-cited efficiency number.* Never put it, or any numeric efficiency claim, in the product, the store listing or onboarding.
54. **"No experimental evidence exists that algorithmic scheduling or item selection improves learning."** *False, and it would be embarrassing in a design document. Upadhyay, Lancashire, Moser & Gomez-Rodriguez (2021), npj Science of Learning 6:26, is a large randomised experiment on exactly the session-level item-selection layer in a live commercial app, with released code and trial data — https://github.com/Networks-Learning/spaced-selection . Tabibian et al. (PNAS 2019) and Nioche et al. (IUI '21) sit alongside it.*
55. **"Bayesian Knowledge Tracing cannot model forgetting."** *False of every maintained implementation — pyBKT exposes `forgets` as a first-class option, cross-validated in its own examples. The claim is true only of Corbett & Anderson's 1995 formulation.* The recommendation (no BKT) survives for the right reason: its latent state is binary while retrievability here is continuous and time-dependent.
56. **"Deep knowledge tracing wins on long interaction sequences, so it is irrelevant to a short-session product."** *The conclusion is right and the reason is backwards, refuted by the very table it cites: the two LONGEST-sequence datasets both go to logistic regression, and the SHORTEST is a DKT win.* Justify "no neural knowledge tracing" by the gap size (0.01–0.06 AUC) and engineering cost.
57. **"The SM-2 versus FSRS head-to-head cannot be obtained from the benchmark."** *It is one command away, in git history at commit 45f61b2 on exactly the corpus the current README quotes. Declaring it unobtainable produced a chain of reasoning that budgeted the scheduler against the wrong alternative.*
58. **"CC-CEDICT is CC BY-SA 3.0."** *Current distributions are 4.0, confirmed on two builds — but 3.0 is a **stale** figure rather than a false one, and a pre-switch vendored copy is genuinely under 3.0 terms.* (Consistent with §9–12: glosses seed from CC-CEDICT as a separate quarantined build artefact under BY-SA 4.0, never inlined into the JS bundle. Note the **DRM trap**: BY-SA 4.0 §2(a)(5)(B) forbids effective technological measures, so an App Store wrapper behind FairPlay puts the gloss file's terms in tension with the channel. Stay a PWA.)
59. **"Make Me a Hanzi is MIT licensed."** *Neither half is: `dictionary.txt` is LGPL-3.0-or-later; `graphics.txt` and `svgs.tar.gz` are Arphic Public License.* §9–12 already excludes it from the build entirely; this is the reason.
60. **"Noto Sans SC's Simplified subset is 4–5 MB over ~44,000 glyphs, and Fontsource ships it as one monolithic blob."** *Measured false on both halves: the named chinese-simplified woff2 at weight 400 is 1.09 MB with 7,946 codepoints, and the default `index.css` uses ~97 numbered unicode-range chunks — exactly the packaging it was said not to use.*
61. **"A menu game will reach for 焗 煲 涮 菌 藕 韭 — characters the font drops — so tofu is a typeface risk."** *All six are present, as are all 3,000 HSK 3.0 characters. Tofu risk from the typeface is zero; the risk is created **entirely by our own codepoint-extraction step**.* Since §9–12 fixes a build-gated subset (~164 KB at 1,200 chars), the CI gate that fails the build on any missing bank codepoint is **mandatory and non-negotiable** — it is the only thing between us and tofu boxes at a restaurant table with no signal. And pinyin diacritics (ā á ǎ à … ǖ ǘ ǚ ǜ) are routinely dropped by naive subsetting and are load-bearing: make it a build-time render assertion.
62. **"HSK word lists are public domain" AND "you cannot use HSK word lists."** *Both misreports. The copyright position is genuinely unsettled (PRC Copyright Law Art. 5 excludes official documents, but GB/GF standards sit in a contested category, and a bare word list is a thin-originality compilation of facts). **The exposure that actually bites is trademark** — the letters "HSK", the logo, and "HSK Level N" as a user-facing label or in store metadata.* Which is exactly why §9–12 ships the band as an internal integer only.
63. **"SUBTLEX-CH is public domain / free to bundle."** *Not established — safe only via the PLoS ONE Supporting Information copy; the lab-site and GitHub mirrors carry no licence text. Jun Da's list is research/education-only with no commercial grant despite being bundled commercially everywhere.* Bundle none of the three, and quote no coverage percentage in product copy — two corpora both called "Chinese character frequency" do not even agree on their top three.
64. **"This Chinese TTS model is open source, so we can use its voice."** *That refers to the CODE licence, not the corpus the weights were fitted on. CSMSC / 标贝 — the default corpus behind a large fraction of released Chinese TTS checkpoints — is explicitly non-commercial and taints them. MagicData is CC BY-ND 4.0, where ND arguably prohibits training at all. Common Voice is CC0 but is whole read sentences with no forced alignment.* Ship no audio in v1; when it is added, pre-render at build time with a commercial TTS that grants output rights.
65. **"Unihan `kMandarin` gives you a character's pinyin."** See P25. *Choosing kMandarin to avoid a ShareAlike attribution line trades correctness for a line of text.*
66. **"Store traditional variants with `kTraditionalVariant`, or convert with OpenCC on export."** *Simplified→traditional is 1:many and the collisions land on the highest-payoff items — 230 of HSK's 3,000 map to more than one form, 89 inside the first 900. 干 maps to both 乾 and 幹, and auto-picking 幹 for 干煸 yields a character that reads as an expletive in Taiwanese usage.*
67. **"请 comes apart into 言 (speech) + 青 — the flagship example for component teaching."** *言 + 青 is 請, the TRADITIONAL form. In simplified it is 讠 + 青 (请 10 strokes, 請 15, 讠 2, 言 7).* If the flagship example of the component-teaching decision is script-confused, the authoring pipeline will be too.
68. **"A 60-item yes/no check-in every ten sessions will show us whether players are learning."** See P38. *Running it repeatedly produces a number that moves mostly at random — worse than no number, because the team will read the noise as signal.*

---

# Section 2: Rulings on the inherited mechanics

Seven mechanics, in order. Each gets a verdict — **helps learning / hurts learning / neutral** — and the changes that are conditions of shipping, not backlog. Where a ruling rests on inference from adjacent literature rather than on a finding about this mechanic, it says so explicitly, because that distinction is the thing the source sweeps kept losing.

---

## 2.1 The opposing team deals the category

**Verdict: HELPS — conditionally, and the condition is load-bearing.**

Two independent mechanisms make an opponent-chosen item a good idea. First, errors followed by corrective feedback beat error-free study, and errors made with high confidence are the most likely of all to be corrected (P10). Second, committing to an answer under a category you did not choose is a prequestion — g = 0.66 for exactly the information the question targets (P9). Both mechanisms are real and both are cheap here.

But both **require the learner to have related knowledge to recruit.** A blind guess at a character never seen is not a productive error; it is a coin flip, and it produces neither hypercorrection nor a prequestion benefit. This is the same boundary as P54: a difficulty is desirable only if the learner can execute the effortful process. So the mechanic is defensible exactly to the extent that dealing is **bounded by competence**, and indefensible to the extent it is an ambush.

**What must change**

- **Opponents choose the CATEGORY; the engine chooses the ITEM.** The item is drawn within an Elo band of the target player, targeting ~75% success (P49) — Elo on players *and* items, updated after every response, a few lines of code, no training data, works from the first match. The mechanic becomes *"pick their weak spot among things they can plausibly get"*, never *"ambush them"*.
- **Delete the "≥5 prior exposures" gate.** It is folklore (§1.7 #39) and it is also worse than the thing that replaces it.
- **Narrow the category to prequestion granularity** (P9): "signs on a subway platform", "weight and price on a market label", "what's in the bowl" — never "Transport". The anticipation has to target roughly what will be asked, or the g = 0.66 does not apply and nothing else about the deal does any work.
- **Per-player item pools, invisible to the table.** Same category, same stake, different item. The character-dependency constraint is per-player, not group-wide (P49) — a group-wide constraint at 300 vs 1,200 characters throws away 80% of the strong player's readable vocabulary before the difficulty objective even runs. Log `eligible_for` per round so a floor effect is visible.
- **Keep the dealing rule swappable.** Make it a strategy object (opponent-deals / random-deals / self-selects) configurable per match, because the cooperation-vs-competition magnitudes that motivate it are allegiance-contaminated (P45) and this needs to be testable with a config flag rather than a rewrite.

---

## 2.2 Pre-commitment betting (+1/−1, +5/−3, +15/−10)

**Verdict: split. As a PRETEST it HELPS. As a scaffolding ladder it is UNSUPPORTED and, on the digests' reading, CONTRADICTED — the ladder is inverted. As a memory intervention in itself it is NEUTRAL.**

Three separate things have been fused into one mechanic and they must come apart.

**The commitment is genuinely good** and it keeps its place: committing before the reveal is a pretest with real support (P9), and the confidence value is a feedback-routing signal via hypercorrection (P10). It is also good table dynamics and the best available handicapping device for mixed ability at one table — a bid invisible to the table is what makes a handicap socially acceptable.

**The wager as a memory mechanic has no support.** Forcing a metacognitive judgement before answering does not reliably improve learning; confidence-weighted marking improves *measurement reliability* and how learners *feel*, and nothing else. The neuroscience rationale and the memory-palace "explicit binding" rationale are both retracted (§1.7 #6, #7).

**The ladder is inverted, and the rungs are wrong in different ways.** The +15/−10 tier is where the design put the largest penalty, but the low tier is the one carrying the transfer risk: showing pinyin *and* L1 options makes it a translation-recognition task, not a reading task, and on-screen pinyin is a training-only cue absent from every real menu and metro plate — structurally identical to the tone colour and radical highlighting the design correctly bans. The "safe" tier is the risky one, and the design does not acknowledge it. Meanwhile there is **no controlled experiment on fading pinyin at all** (P27) — the ladder itself is an untested design, and the evidence that does exist says scaffolding fades by **measured per-item competence**, not by how brave someone feels at the moment of betting.

**And there is a structural conflict nobody named:** the bet is chosen *before* the item is seen and *by the player*, so difficulty is self-selected. A pacing controller cannot target a retrievability through a channel the player owns, and a self-selected tier is not random assignment, so its outcomes are confounded with player confidence. **You cannot have both a player-owned bet and a system-owned difficulty controller working through the same variable.**

**What must change**

- **Decouple the stake from the scaffolding.** The bet stakes points only. All adaptive difficulty control moves to **item selection**, not response format.
- **Scaffolding fades by measured competence:** full ruby for an item's first ~3 exposures, then partial ruby on only the characters that item's error history flags weak, then none. Store `exposureCount` and `perCharacterErrorRate` (P27).
- **Never let pinyin be the thing the bet buys.** Pinyin lives on the **reveal** only, per-character aligned beneath each glyph (P27).
- If the wager must gate *something* for game reasons, change what each rung buys and **gate the top rung by competence, not courage** — a player may bet it only in a category where they already hold component knowledge, with unearned tiers greyed and an explicit "unlock by…" line rather than hidden. A low rung might buy a **semantic-component hint** ("⺼ = body part, so this is something off an animal") instead of pinyin — but ship that swap as a flagged A/B graded **weak**, not as an evidence-backed decision.
- **The bet tier must never crank distractor confusability.** Retrieval demand is the difficulty dial; lure plausibility is not (P13).
- **The harder tier must never carry the shorter timer** (P48). And do not stack pressures: at most one of {visible countdown, live opponent monitoring, public score change} salient per item — remove the countdown, since observation is inherent.
- **Measurement hygiene:** persist `bet_tier`, `was_correct`, `format_tier`, `n_alternatives` on every row. Log fully-scaffolded (tier-1) answers `role: exposure` and **do not advance scheduling state on them** — feeding a "correct" from a card that supplied the answer inflates stability on a skill that was never tested (P8). Drain a `high_confidence_miss` queue in the final round (P10), documented as massed repetition on hypercorrection grounds.
- **Keep scoring such that guessing stays attractive** (P9). A wrong guess before feedback is productive; a scoring rule that drives players to hedge destroys the one mechanism the bet legitimately carries. And every bet resolves in the same round — no unresolved bets.

---

## 2.3 Four-option multiple choice

**Verdict: HURTS relative to the available alternative — it is a pace-and-sociability decision that costs roughly half the retention benefit — but it is a defensible purchase, and the criterion task partly redeems it. Ship it, and say so in the document.**

Rowland's format moderator puts recognition/MC at g ≈ 0.36 against free recall 0.79–0.82 and cued recall 0.70–0.72, and initial *recognition* practice independently produces smaller testing effects than initial *recall* practice (P5). The product's mechanic therefore sits in the weakest cell on both axes. Two things pull the other way and neither is decisive: reading a sign in the wild genuinely *is* constrained recognition against the small set of things that sign could plausibly say (P1), and competitive distractors can recover part of the loss — but only where the learner can already reject them (P13). The honest sentence for the design document is: **"we chose MC for pace and for the table, and it costs us about half the retention benefit; here is what we do to claw some of it back."** Delete the "MC beats recall" justification entirely (§1.7 #37).

**What must change**

- **Three options, not four** (P6). More items per round, full-width 60–64 CSS px rows in the thumb zone, less lure exposure. The third option must be a real competitor from the visual-neighbour or situational-neighbour set, never filler — random removal of options reduces difficulty, discrimination *and* reliability.
- **Options stay meaning-side (Dutch/English) at every tier.** The +15/−10 rung that makes all options Chinese signs is **contradicted**: it silently changes the criterion task into hanzi-to-hanzi visual matching, solvable by glyph pattern-matching without ever accessing meaning, and it maximises lure exposure exactly where the learner is least equipped to reject lures. Escalate difficulty by removing pinyin, by raising distractor competitiveness within the gate, by harder real substrates, or by dropping to a two-option forced discrimination against the single best confusable — all of which raise retrieval demand without changing what is retrieved.
- **Add one meaning-recall beat before the options appear.** After the answer window opens but before options render, show the sign alone for ~3 s with "say it out loud", then reveal options, then feedback. Placed *after* the options are visible it is not a retrieval attempt and buys nothing. Log as `spoken_attempt`, analysis only, never scored (P5). For non-active players, the parallel private task is **cued recall — "what does this sign make you DO?", no options** — which lands in the strongest cell at identical interaction cost (P40).
- **Two distractor generators, and a consolidation gate over both.** Priority 1: visual neighbours from our own component decomposition and stroke-edit distance (人/入/八, 大/太/犬/夫, 日/白/百/自, 未/末, 己/已/巳, 千/干/于, 我/找, 天/夭). Priority 2: situational neighbours from the domain corpus for that scene (出口/入口, 推/拉, 冷藏/冷冻, 生产日期/保质期, 禁止/请勿, 男/女, 素/荤, 药店/酒店 — which share **no** component and are priority 2, not 1). **Family (c), the same-object-class signs that mean something dangerously different, is the highest-value set and should be at least ~40% of distractors.** But distractor confusability is a pure function of exposure state (P13): unrelated-but-domain-plausible on first appearances; component-sharing and confusable-family only after the item is consolidated across a night. Precompute the sets at build time as a pure function of `(item, exposure_count, seed)` so every phone derives an identical set — the engine is a deterministic reducer over a shared event log and runtime generation will diverge.
- **Keep `interference_set` (must not be scheduled in the same acquisition block) as a separate field from `confusable_with` (shown together at resolution).** They are opposite operations, and fusing them is how you build an interference generator by accident.
- **`confusion_type` with four values, not a boolean** (P14, P17): form-confusable (人/入, 公斤/斤) needs staged introduction; meaning-confusable-visually-distinct (麻/辣) can be shown together from day one; both; and **shared-morpheme** (出口/入口, 门口/窗口) — a fourth category **no cited study covers**, where the shared 口 is a genuine shared meaning that can be taught, so it plausibly behaves more like the weak semantic case. Instrument it separately rather than assuming. Never introduce both members of a form-confusable pair as new items in the same session.
- **Never pair two items that share a character with different readings as if they were the same item** — 磨 mó against 磨 mò is a schema bug waiting to be authored. 公斤/斤 is fine only because 斤 is monophonic (P25).
- **Pair-balanced testing** (P16): when any member of a confusable family is active, mark all members due-soon.
- **Log the chosen option, not just correct/incorrect**, and maintain the per-user confusion matrix (P15). When `confusion[入口][出口]` crosses a threshold, stop presenting them as co-options and re-teach the distinguishing component in isolation.
- **Express every pacing target in retrievability, not observed accuracy** (P8), and never show a per-item mastery percentage (P36).

---

## 2.4 Correct keeps the turn; wrong costs points and passes it

**Verdict: HURTS. This is the single mechanic that must be rebuilt rather than tuned, and it is the largest change to the inherited engine.**

Three independent objections, and they converge.

**It is the collaborative-inhibition configuration by construction** (P39). Three players watching one player retrieve suppresses retrieval for all three, and the compensating benefit lives in re-exposure *after* the retrieval, not during it. A turn-taking loop puts the social layer exactly where the inhibition is and starves the phase where the benefit is.

**It inverts the distribution of practice against need.** Correct-keeps-the-turn hands the strongest player the most retrievals and the weakest player the fewest — the opposite of what the scheduler exists to do. It also makes per-player scheduling incoherent: FSRS needs one genuine independent outcome per player per round, and a turn-based loop produces one outcome for the table.

**It attaches two publicly visible consequences to one person's error** — points *and* the turn — which is precisely the self-level feedback configuration that Kluger & DeNisi's 38%-negative moderator warns about (P11), and precisely the public normative evaluation that makes *ability* the salient attribution (P44).

**What must change**

- **Blind simultaneous commit, every round, for every player.** Item appears → the same fixed commit window for everyone → each taps privately on their own phone, with no feedback to others beyond an anonymous filled-dot count → window closes or all have committed → simultaneous reveal with per-player correctness (P39). One review row per player per round, always.
- **If a "turn" survives, it is a *dealing* turn** — who picks the category — and it **rotates on a fixed rotation, not on error** (P45's directive to separate the two consequences). Keep the turn consequence and minimise the score consequence, or drop the error-contingency entirely.
- **Add the fourth beat.** After reveal, one **isomorphic item answered individually with no discussion** — that is where the transfer result lives in the peer-instruction literature (P41), and it requires an `isomorph_group_id` on the bank so items are authored in pairs or triples. Beat order matters: private commit *before* any confer, never after.
- **Filled dot per player per round showing THAT they contributed, never how much or how accurately** (P45). Presence-of-contribution prevents loafing; magnitude-of-contribution is the ability cue to suppress.
- **Write an exposure record for every player at the table when an item resolves**, flagged `role: observer | answerer`, with observer exposures advancing scheduling state at a discounted weight (P40) — otherwise a player who watched thirty items and answered six is modelled as having seen six.
- **Never show "what everyone else picked" as a distribution bar** — social contagion implants the wrong answer, which makes this a correctness requirement, not a comfort feature (P40).

---

## 2.5 Explanation on resolve

**Verdict: HELPS — but only half of it is evidence-mandated, and the other half must ship labelled as a product bet.**

The **correction** is mandated. Feedback is mandatory, immediate, in the same visual frame as the committed answer, and **corrective rather than verdictive**: show the correct answer, and when a lure was chosen, name that lure and mark it wrong explicitly (P7, P13). No round may end without correction. Immediate wins over batched here — Butler & Roediger found immediate and delayed feedback equally effective at cutting lure intrusions with delayed showing an advantage for retention of correct answers, so batching costs nothing on the negative-suggestion axis; but the spacing benefit is recoverable through the lapse queue while the pretesting and hypercorrection benefits are not recoverable any other way. Social protection comes from the private-input/public-resolution split, not from delaying the reveal.

The **elaboration** is a bet. The elaborated-feedback advantage is concentrated in higher-order outcomes and narrows sharply for the low-order recognition this product is scoped to (P12). A universal fixed-length explanation on every item is therefore an unvalidated product decision, not an evidence mandate — and the reveal card is heading for overload anyway: component tree plus confusable plus image plus pinyin plus audio plus score delta plus a say-it-aloud prompt is seven competing elements in a few seconds of party-game reveal.

**What must change**

- **The reveal is a table, not a green tick.** Every option glossed — hanzi at ≥32 px, pinyin, English *and* Dutch, and a one-clause note on where you would actually meet it ("冷冻 = vriezer, staat op diepvriesproducten — niet hetzelfde als 冷藏"). The correct row gets the accent bar; wrong rows stay **fully legible**, never greyed to the point of being skimmed past. This is the established mitigation for lure implantation and it is maximal exactly under a visual-first distractor rule (P7).
- **Element budget by integration load, not by a chunk constant** (P54, and never justified by Cowan): **one target, one decomposition, one contrast.** Everything else behind the explicit tap. Show the **hanzi alone first (~800 ms, large, nothing else)**, then the gloss, then anything else — because when a picture accompanies a written word learners attend to the picture and encode the orthography less well, and that has been shown even when the picture appears as post-response *feedback*, which is exactly the proposed configuration. (Image-on-reveal is **CONTESTED**: multimodal-gloss meta-analyses favour text+visual, but they measure *meaning* acquisition for words the learner can already decode, and here the written form is the thing being learned, which flips the prediction. A/B it against a delayed recognition test; the literature predicts the image condition loses.)
- **The card thins out as the item's accuracy record improves** (P54). Scaffolding that helps a first-time viewer costs a player who already knows the item.
- **Type the discriminating-cue field**: `semantic_radical | contrast_character | position_in_compound | phonetic_hint`, with `phonetic_hint` **optional and individually hand-verified, never auto-generated** — over the top 1,000 characters a phonetic component gives the exact syllable-plus-tone only ~17% of the time and no cue at all ~35% (P24), and a wrong hint delivered as elaboration inside the protected resolution moment is worse than no elaboration.
- **Make elaboration mandatory only where a genuine discriminating cue exists**, and required content where it does: every form-confusable pair ships one authored, meaning-bearing formula — "出 = feet stepping out of an enclosure; 入 = a wedge entering" (P18). Adjacency alone does not work.
- **Render the breakdown spatially inside a square frame** (left/right, top/bottom, enclosure) rather than as a linear "出 + 口" string — justified by positional regularity being implicitly acquired by CSL learners, **not** by neuroimaging (§1.7 #8). Meet a component inside a whole sign **before** naming it; store `component_first_seen_at` per user per component to drive the "you have seen ⺼ before" callback.
- **Component colour lives only here and in the lesson, never on the timed card** (P26) — and whether to colour-mark the discriminating component even here is an open A/B on delayed discrimination accuracy (P20), neither shipped by default nor prohibited.
- **One spoken self-explanation prompt**, on the confusable pair, addressed to the highest bettor: *"why isn't it 入口?"* ~5 seconds, spoken, never typed, never scored (P51). This is the cheapest well-evidenced thing in the whole corpus and it costs one line of text. It must **displace** something, not be added on top.
- **Say-it-aloud happens with the CHARACTER on screen, not pinyin alone** (production-effect evidence is **CONTESTED** here: the produced token is an alphabetic string rather than the studied form, the pure-list between-subject variant is the smallest version, and unison group speech is not the studied manipulation — keep the beat, rank it below the component breakdown and the confusable panel, and instrument it).
- **Minimum reveal dwell (~2,000 ms) before Next enables, with a setting to disable all timers** — the dwell engages WCAG SC 2.2.1 (P48).

---

Social protection comes from the private-input/public-resolution split, not from delaying the reveal.

The **elaboration** is a bet. The elaborated-feedback advantage is concentrated in higher-order outcomes and narrows sharply for the low-order recognition this product is scoped to (P12). A universal fixed-length explanation on every item is therefore an unvalidated product decision — and the previous draft called it a bet in its verdict paragraph and then mandated something far heavier than a fixed-length explanation as an acceptance criterion: three fully glossed rows, each with hanzi, pinyin, English, Dutch and a usage clause, is fifteen-plus elements on the same screen whose budget the next bullet capped at three, plus a two-second minimum dwell on a screen P4 forbids in the main loop.

**What must change**

- **The reveal is two stages, and only the first is mandatory.** *Stage 1, automatic:* the target hanzi alone (D5), then the correct answer plus — when a lure was chosen — that lure named and marked wrong at full size. That is the whole of what P7 requires; Butler & Roediger attribute the repair to **corrective feedback**, not to a comparative table. *Stage 2, on an explicit tap:* every option glossed — pinyin, English *and* Dutch, and a one-clause note on where you would actually meet it. Opt-in, so it is not a study screen inside the loop (P4). Wrong rows in stage 2 stay **fully legible**, never greyed to the point of being skimmed past.
- **Fix the worked gloss.** It read "冷冻 = vriezer, staat op diepvriesproducten — niet hetzelfde als 冷藏". **冷冻 is "frozen / to freeze"; *vriezer* is the appliance (冷冻室 / 冷冻柜).** Correct: **"冷冻 = diepvries / ingevroren — niet hetzelfde als 冷藏 (gekoeld)."** The single worked example of a register-aware disambiguating gloss mistranslated a Tier-1 supermarket label.
- **Element budget by integration load, not by a chunk constant** (P54, never M9): **one target, one decomposition, one contrast.** Show the **hanzi alone first** — because when a picture accompanies a written word learners attend to the picture and encode the orthography less well, shown even when the picture appears as post-response *feedback*, which is exactly the proposed configuration. (Image-on-reveal is **CONTESTED**: multimodal-gloss meta-analyses favour text+visual, but they measure *meaning* acquisition for words the learner can already decode, and here the written form is the thing being learned, which flips the prediction. Ships **off**; logged; **not funded** in D17.)
- **The card thins out as the item's accuracy record improves** (P54).
- **Type the discriminating-cue field**: `semantic_radical | contrast_character | position_in_compound | phonetic_hint`, with `phonetic_hint` **optional and individually hand-verified, never auto-generated** — over the top 1,000 characters a phonetic component gives the exact syllable-plus-tone only ~17% of the time and no cue at all ~35% (P24), and the reference data marks 月 as the *phonetic* of 炙 (P22), which is the class of error auto-generation propagates.
- **Elaboration is mandatory only where a genuine discriminating cue exists**, and is required content where it does: every form-confusable pair ships one authored, meaning-bearing formula — "出 = feet stepping out of an enclosure; 入 = a wedge entering" (P18). Adjacency alone does not work. Every component gloss is gated on `meat_gloss_applies` / `moon_gloss_applies` and their equivalents (P22), defaulting false.
- **Render the breakdown spatially inside a square frame** (left/right, top/bottom, enclosure) rather than as a linear "出 + 口" string — justified by positional regularity being implicitly acquired by CSL learners, **not** by neuroimaging (M8) — and **read component position from the stored field**, because 肾 puts ⺼ at the bottom (P22, M24). Meet a component inside a whole sign **before** naming it; store `component_first_seen_at`.
- **Simultaneous paired presentation of the confusable sibling is required here from the item's first appearance** (P17), and is explicitly *not* gated by consolidation — the study population was learners with no prior Chinese. The consolidation gate governs the scored option set only (§2.3).
- **Component colour lives only here and in the lesson, never on the timed card** (P26); whether to colour-mark the discriminating component even here is an open question (P20), shipped off, **not funded**.
- **One spoken self-explanation prompt on the confusable pair** — *"why isn't it 入口?"* — spoken, never typed, never scored, **addressed to a rotating seat or to the table, never "to the highest bettor"**, which published who bet high and, on a wrong answer, staged the exact public failure §2.7 exists to suppress. Graded **moderate-by-analogy**, not "the cheapest well-evidenced thing in the corpus"; **g = 0.55 does not appear next to it** and the "~5 seconds" is struck as a re-entry of M44. It must **displace** something, not be added on top (P51).
- **Say-it-aloud happens with the CHARACTER on screen, not pinyin alone** (production-effect evidence is **CONTESTED** here: the produced token is an alphabetic string rather than the studied form, the pure-list between-subject variant is the smallest version, and unison group speech is not the studied manipulation — keep the beat, rank it below the component breakdown and the confusable panel, and instrument it).
- **Minimum reveal dwell before Next enables (D6, set from the accidental-skip rate — not a memory claim and not "~2,000 ms"), with a setting to disable all timers** (WCAG SC 2.2.1).

---

## 2.6 Race to a target score

**Verdict: HURTS — mildly but structurally. It is also the cheapest of the seven to fix. This ruling is an inference from adjacent findings, not a finding about score races; it ships labelled as a decision.**

No study in the four digests tests win conditions. What the evidence does say lines up in one direction:

- **It makes match length a function of scoring luck rather than review need**, which collides head-on with the architecture inversion (P31): the match engine must draw from a **due queue**, and the scheduling layer is the product.
- **It keeps competitive salience high during the retrievals**, which is where evaluation apprehension (M45) and the contagion risk (P40) live. Competition earns its place as an attendance mechanism: high at match setup and at the single end-of-match screen, near zero during the retrievals in between. The item loop itself should be as neutral and task-focused as a flashcard.
- **A race requires a continuously visible ordering of who is losing**, which is banned (P44).
- **Points economies and leaderboards are the gamification elements most often reported as causing negative effects**, and the moderators that matter are game fiction and competition-combined-with-collaboration (P55).
- **It is losing, not competing, that undermines motivation** (P43) — and a race maximises the salience and duration of losing.
- Combined with speed, it would import a pressure the evidence says costs accuracy (P48).

**What must change**

- **Replace "first to N points" with a round-count band (D12) drawn from the supply ladder in §2.4** — due items, then early reviews in ascending R, then capped new introductions (D11), then a shorter match. A fixed count plus due-queue-only plus no-repeats is unsatisfiable, and the previous draft specified all three with no fallback; this is the first thing that would have broken in implementation.
- **The hero number is a table target in the product's own currency**: "read these N signs tonight", rendered as the actual signs at real size in their real typefaces (P28, P53) — an **observed count over a named, enumerable set within a stated window (D16)**, never a predicted or model-derived figure (P36), never a percentage. It rises visibly even while within-session accuracy feels erratic — the counterweight interleaving needs (P52).
- **Improvement-based contribution** (P45): `contribution = f(correct_this_round − personal_rolling_baseline)`, clipped, baseline recomputed after each match, so a beginner can contribute the maximum. **This, not the bid, is the handicap** (§2.2).
- **No live losing order during play; no global leaderboard; no persistent cross-match individual ranking** (P44). Team totals only.
- **End-of-match leads with an absolute competence statement for every player**, win/loss second and smaller (P43). Same credit for retrievals attempted regardless of match outcome.
- **Score correctness only; never speed.** Break ties on total round time (P48).
- **Frame each round as a place** — "the noodle shop", "Line 2 to the airport" — since fiction, not points, is the moderator with evidence behind it (P55).

---

## 2.7 Public failure in front of opponents

**Verdict: UNKNOWN — not assessable on the available evidence. Ship it as a monitored bet, with the mitigations below as v1 acceptance criteria and the measurement in §2.7.10 as the thing that converts the verdict into a finding.**

The previous verdict — "DEFENSIBLE IN TWO OF ITS THREE COMPONENTS… roughly two-thirds survives" — fails twice. "Defensible" is a different axis from the one Section 2 promised, and **"two-thirds" is arithmetic theatre over a list of length three**: three incommensurable components do not have a fraction. Given P50, converting an evidential void into a survival percentage is exactly the move this document was written to stop.

**Provenance warning, on the face of the ruling.** Most of what follows sits inside the **provisional P39–P55 block** (preamble caveat 1): Bond & Titus, Uziel and the 2025 CSCW n=85 experiment were all recalled, not read. **Those sources must be re-read before any of them justifies a build decision.** Two things survive that warning: mitigation 2 (private input), which follows independently from P4 (every player retrieves) and P40 (contagion), and mitigation 10 (measurement), which needs no external source at all.

**The honest evidential position, in both directions:** **there is no controlled study showing that public failure in a language-learning game suppresses subsequent participation** (P50). The claim that it harms is an inference. **The claim that it is harmless is equally unsupported.** And "players report they had fun" is not evidence of safety — enjoyment and anxiety are distinguishable dimensions (r ≈ −0.36), so a session can be both (P46).

**Component 1 — the opponent-chosen category. Bounded, not endorsed.** See §2.1, whose verdict is now NEUTRAL: no cited finding examines who chooses the item. The bound is an Elo band expressed in retrievability (P49, D13) **plus** an item-familiarity gate (D18) — the two together, because Elo bounds difficulty and only the gate bounds familiarity.

**Component 2 — being watched. Defensible only with private input, and the reassuring number is the wrong number.** Bond & Titus's 0.3–3% of variance describes a **passive audience**. This mechanic has an opponent who *selected your item*, holds a competitive stake in your failure, and observes the outcome — evaluation apprehension **plus outcome interdependence**. Hanzi recognition for a beginner is by definition a **non-dominant response**, the impairment side (M45). Uziel's individual-differences work shows the small average hides opposite-signed subgroups. A 2025 CSCW lab experiment (n=85) found **supportive** spectatorship *more* detrimental than critical, so "my friends will be nice about it" is not a mitigation. **The correction cuts against the original conclusion: private input becomes MORE necessary, not less** — and it holds even if every recalled source in this paragraph turns out to be misremembered, because P4 and P40 require it anyway.

**Component 3 — the public point loss. Not defensible as framed.** Roughly 38% of feedback effect sizes are negative, and the moderator is whether attention goes to the task or to the self; a public point loss carrying no task information is close to pure self-level feedback (P11). Competitive public evaluation makes *ability* the salient attribution, harming low performers most (P44).

**Who is harmed.** Not the average player. The harm concentrates in anxious, low-self-esteem and lower-proficiency players — and a co-located game among friends has heterogeneous proficiency **by construction**. In a language product specifically this is not a neutral design choice: anxiety is the largest measured affective moderator in SLA (r ≈ −0.34 to −0.39 across ~97 samples, N ≈ 23,000 in the largest). Causal direction is **contested** — under the Linguistic Coding Differences reading, anxious learners are anxious substantially *because* they are struggling. That contest determines what we may promise, not what we build: **justify every mitigation by retention and attendance, which we can measure, never by a promised learning gain** (P46).

**The mitigations, as v1 acceptance criteria**

1. **Keep opponent-dealt CATEGORIES; the engine picks the ITEM** within an Elo band **stated in retrievability (D13), not as "~75% success"** — an observed-accuracy target violates P8, and at k = 3 it implies R = 0.625, a value nobody chose and which conflicts with a due queue built at R ≈ 0.90. Plus the familiarity gate (D18).
2. **Private input, public resolution — a requirement, not an option.** Answers entered on the player's own device; the shared view shows only "answering" plus a progress bar, never the live selection; no "X got it right in 2.1 s" banner. **No spoken-answer item type in v1** — reading, not speaking, is the target skill, so privacy costs nothing competitively, and the sweep's own "select/say the meaning" phrasing quietly admitted a modality that collapses the whole mitigation.
3. **Replace the public point loss with a public CORRECTION.** On a wrong answer the *shared* view carries the correct character and the correction **at full size**; the score delta is small, uncoloured, unanimated, silent. **Point gains may stay salient; point losses must not.** Specify in rem with a stated contrast ratio, never as "muted colour at 14 px" — which fails WCAG 1.4.3 and 1.4.4 (M39).
4. **Separate the two consequences of a wrong answer.** Under §2.4 the turn already stops being error-contingent; if any turn consequence survives, keep that one and minimise the score one.
5. **No live losing order, no per-player accuracy visible to others, no "weakest player" label, no cross-match individual ranking, no global leaderboard** — and **no greyed-out bet tiers visible to the table**, which publish competence by the back door (§2.2). Individual breakdown is private, on the player's own device, after the match.
6. **Filled-dot contribution presence, never magnitude** (P45).
7. **Improvement-based team scoring** (P45), so the beginner is a contributor rather than a liability. This is the scoring rule that delivers Ames's mastery framing instead of a UI afterthought — **and it is the design's handicap, replacing the claim that a private bid could be one.**
8. **Competence feedback before result, for every player**, on the end-of-match screen (P43).
9. **Do not stack pressures** (P48): remove the visible countdown, since observation is inherent and cannot be removed. Silent generous window (**D19**, from our own latency distribution — M44), subtle desaturation in the final fifth, no timeout penalty on first exposure, and an accessible way to turn off, adjust or extend every limit (WCAG SC 2.2.1 — a legal requirement under the EAA, unlike the glyph-colour ban, which rests on the learning evidence and CVD prevalence rather than on 1.4.1's sole-carrier rule; P26).
10. **Instrument the unanswered question so we answer it ourselves — funded experiment 1 (D17, P50).** Log per player: turns voluntarily initiated, next-turn response **latency**, abandonment, and next-session return, each keyed to whether the previous turn was a public failure; store `turns_since_last_public_failure` so this is a query rather than a data-collection project. **Latency inflates before accuracy drops** (P47), so within-player latency inflation on opponent-dealt items relative to self-dealt ones is the tripwire. **The power calculation is owed before any sample size is quoted** — the previous draft asserted "a real experiment at n≈200 players" with no calculation, in a document that performs one for the yes/no instrument (P38). If anxiety is sampled, use a validated Brief FNE instrument — never FLCAS subscales, which do not exist as validated factors (M40) — and never write "affective filter" in the design document.
11. **Ship the gloss cost, hide the gloss visibility — funded experiment 2 (D17).** Cost and visibility are independent variables the original design fused. Revealing a gloss may deduct from the current bid; **the other players do not see that it happened.** The public variant ships behind a flag, default OFF for any table containing a first-time player. Its predictable failure is that a beginner stops requesting glosses and starts guessing, converting a retrieval attempt into a coin flip that teaches nothing while the score still moves. This was presented in the source research as its central design insight; it is the **highest-risk unvalidated bet in the whole corpus**, which is why it gets budget rather than a bullet.

---

**Closing note on what this revision changed about the document's method, not its content.** Five of the corrections above are the same correction: an inference was accepted when it favoured a decision already made and rejected when it did not — the MC cost calculation (P5/§2.3 against M37), "best-supported decision" against its own moderate/N=54 grade (P21), a **strong** grade retained for a source that could not be verified while another was downgraded for less (P39 against P30), an effect size booked for a manipulation that drops most of its pool's moderators (P51), and a **HELPS** verdict for a mechanic no cited finding examines (§2.1) while the mechanic the author wanted to kill was correctly labelled "an inference, not a finding" (§2.6). The banned-rationales register (M1–M68) cannot survive in a document that reoffends in its own rulings, which is why §1.8 now exists and why every constant in Section 2 either derives from a source, carries a D-number with an owner and a test, or is gone.

---

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

---

# 6. The learning model

## 6.1 What an item is

**An item is a span: a one-to-four-character string that a person meets as a unit on a physical surface. The character is not the item. The character is a skill node underneath it.**

*The character alone* fails on readability, because coverage is not readability and the gap is multiplicative: at 40% character coverage a four-character dish name reads with probability ≈ 0.40⁴ ≈ 2.6%, not 40%; at 75%, ≈ 32%. Over the 12,010-record frequency table on disk (99,950,541 weighted tokens), a 1,200-character bank covers 90.03% of running characters and a 1,500-character bank 93.07% — one character in fourteen unknown on an unseen sign, so a six-character sign is unreadable about 35% of the time; even chance needs ten characters.

*The whole sign* fails on reuse. 请扫码点单 is a real string on a real table tent, but it recurs as a template, not a retrieval target, and an item that appears once is one the scheduler cannot act on.

The span is both **met** and **reused**: 出口 (chūkǒu), 保质期 (bǎozhìqī), 净含量 (jìnghánliàng), 换乘 (huànchéng), 末班 (mòbān), 会员价 (huìyuánjià), 售罄 (shòuqìng). Each is a thing a person looks at and either does or does not understand — the criterion task, so the item.

Spans come in **two types**, and they are not the same learning problem:

- **`char_span`** — the menu register, where the barrier is *unknown characters*. The core cooking and offal characters are absent from HSK 3.0 bands 1–3: 涮 (shuàn) is corpus rank 5,115, 炖 (dùn) 3,415, 卤 (lǔ) 2,663, 荤 (hūn) 3,302, 煸 (biān) 7,622, 胗 (zhēn) 7,674. It does not generalise to every cooking verb — 烧 is HSK 3, 烤 HSK 4 — so the bank is authored, not band-filtered. The work is acquisition.
- **`opaque_span`** — transit, labels and shopfronts, where *every constituent character is already nominally known* and the compound is still unreadable. 换乘 is 换 (837) + 乘 (1,238); 净含量 is 净 (1,436) + 含 (853) + 量 (202); 保质期 is 保 (286) + 质 (357) + 期 (214). All top-1,500, all opaque as compounds. The work is parsing, and a decomposition reveal that pretends otherwise teaches an inference rule that misfires on the street.

Both share one schema, state record and scheduler, differing in the reveal and in `transparency` (`transparent | semi | opaque`); an opaque span carries an explicit "this one does not come apart — learn it whole" line rather than a fabricated component story.

**Characters get a second table.** Every span stores `component_char_ids[]`, script-scoped and never shared, because the dependency graph is not isomorphic across scripts — 肠/腸, 脑/腦, 换/換, 净/淨, 质/質 differ in components, not just glyph. When a span resolves, each character receives a **credited exposure at discounted weight**: enough to move a character node, not enough to graduate it alone. This makes the bank compound rather than accumulate — 期 is met inside 保质期 on a yoghurt pot and again inside 星期, one node, two spans — and makes per-player eligibility computable: a span is eligible only when its component characters are introduced *for that player*.

**Component identity is a codepoint, never a substring or a glyph.** The flesh radical ⺼ (U+2EBC, CJK RADICAL MEAT) in 肝 肠 肚 腰 脑 and the moon character 月 (U+6708) in 期 are distinct ids and must never be unified. They render identically in almost every font, so no rule — dependency, distractor selection, reveal highlighting — may match, group or count components by rendered substring. Normalisation is not the hazard (NFC/NFD/NFKC/NFKD all leave U+2EBC unchanged, verified); glyph matching and hand entry are.

Direction is fixed: **sign → meaning (L2 → L1), permanently**. Form similarity hurts; semantic relatedness helps in L2→L1 and turns harmful in L1→L2. There is no production mode. `direction` sits in the key so a future audio mode needs no migration; in v1 it is a constant.

## 6.2 The category set

Five domains, weighted, each subdivided into **scenes**. The scene, not the domain, is what an opposing team deals.

| Domain | Weight | Scenes |
|---|---|---|
| Market | 30% | shelf-edge price label · weight and unit · packaged-food back panel · checkout and payment |
| Menu | 30% | cooking method · animal and cut · heat and flavour · the ordering screen |
| Street | 20% | shopfront trade · discount and promotion · open or closed · fascia wayfinding |
| Safety | 15% | prohibition · warning · instruction · exit and emergency |
| Transit | 5% | platform and direction · ticket and fare |

The weights are counter-intuitive and the app must say why in one line: **the metro is already in English; the noodle shop is not.** Bilingual signage in tier-1 metros and airports is procurement practice, not law — GB/T 30240 is 推荐性, recommended. GB 7718, which requires Chinese on packaged-food labels and forbids foreign text larger than the corresponding Chinese, is mandatory. The supermarket back panel is where no English is coming; transit is where it already arrived. These weights are a v1 guess to be replaced by measured encounter rates; nobody has counted how many signs of each type a visitor needs to read per day.

Scene granularity is forced by the one thing the wager still legitimately does. Betting before the item appears is a **prequestion**: the benefit is large (g ≈ 0.66) but *strictly item-specific*, with none for other material in the same activity. Those studies used texts, lectures and videos, not signage, so what transfers is the commit-before-reveal structure, not the effect size. The dealt category must be narrow enough that anticipating it means anticipating roughly what will be asked. "Weight and price on a market label" works; "Transport" does not. Eighteen scenes at two-to-four per domain keeps the pretest honest.

Each item carries exactly one `scene_id` plus an optional `also_seen_in[]`, used only for retrieval-context tagging, never for dealing. If an item can be reached from three scenes, the deal stops predicting it and the prequestion stops being one.

Safety is over-weighted relative to its share of signage because GB 2894 makes it the one domain where illocutionary force arrives before any character is decoded: red circle with diagonal bar is prohibition, yellow triangle warning, blue filled circle instruction, green square notice. A brand-new player can act correctly on a half-read sign — the right on-ramp, and the right place to seat someone with fifty characters at a table of people with eight hundred.

`scene_id` is orthogonal to `render_variant`, the surface the item was *drawn on* this presentation, which is what the `contexts.size >= 3` graduation gate counts and what the naked probe strips.

## 6.3 Difficulty

Difficulty is three quantities, and the first discipline is to stop calling all three "difficulty".

**1. Authoring tier (`tier`, static, build-time).** Its only job is cold start, and it is **authored signage utility**, not any inherited band. The rank data kills corpus frequency: a frequency-ordered 1,500-character bank contains 期, 保, 质, 量, 含 and excludes 涮, 炖, 卤, 荤, 煸, 胗 — precisely backwards for a menu. But the 通用规范汉字表 cannot serve as a spine either: 涮, 卤, 荤 are 一级 and 炖, 煸, 胗 二级, the same bands that hold 期, 保, 质, 量, 含, 换, 乘, 净. It is a coverage list of 8,105 characters encoding no signage utility, so it discriminates nothing here. Tier is hand-assigned per item and audited against encounter data; the standard bands are an inventory check only. Quoting coverage percentages in product copy is indefensible regardless: two corpora both called "Chinese character frequency" disagree by five to seven points at rank 1,000 and do not agree on their own top three, and the table on disk is mixed-script, carrying 1,159 traditional forms.

**2. Item difficulty (`θ_i`, learned, shared across players on the device).** FSRS has no item-side mechanism — its difficulty parameter is per player-item from a global constant — so the item side is a two-scalar Elo `(θ_i, n_i)`, updated after every response with `K = 0.4 / (1 + 0.05·n_i)`. This follows Math Garden (Klinkenberg et al. 2011), the production precedent running Elo on players *and* items at national scale and serving items at a target success probability. The constants are reasonable starting values, not published ones, and must not be presented as literature-derived. `prior_difficulty` and `observed_difficulty` live in separate columns so the prior can be re-fit without destroying evidence.

Cold start is heavily shrunk, because rich per-item difficulty features are a documented production failure: at Duolingo, lexeme-tag features acquired large negative weights, students complained of items decaying too fast, the paper attributes this to feature-based overfitting despite L2 regularisation, and the shipped fix was to delete those features (HLR-lex). One post-mortem at one company, not a controlled test — it licenses caution, not a law.

```
predicted_initial_difficulty = global_mean + 0.3 × (feature_prediction − global_mean)
features = { stroke_count, char_count, tier, all_components_introduced }
initial_interval clamped to [0.5×, 1.5×] the global new-item interval
```

**3. Per-player retrievability `R_p(i)` — the only quantity the scheduler consumes.** Computed inline at selection time, never persisted as a due date, so a phone asleep three weeks needs no catch-up job:

```
decay  = 0.1542
FACTOR = 0.9^(1/−0.1542) − 1 = 0.980346
R(t,S) = (1 + 0.980346·t/S)^(−0.1542)          # R = 0.9 at t = S; R(10S) = 0.693
I(r,S) = S·(r^(1/−0.1542) − 1) / 0.980346
```

**Difficulty is targeted in retrievability, never in observed accuracy.** `P(correct) = R + (1 − R)/k`, so if k varies by format, holding observed accuracy fixed drives true R down wherever k is smallest — putting the weakest players at the *lowest* true retrievability, the inverse of intent. **k is constant at 4 at every tier**, because options stay meaning-side always, so there is one correction constant and the inversion cannot arise. To hit a common true R of 0.85 the session controller targets **observed 0.8875**. FSRS desired retention stays at 0.90 as a separate knob governing cross-day return; neither drives the other.

Format tier varies only on the **cue** side — whether pinyin is rendered vertically under each character — keyed to measured per-item competence, not to a wager. Consequence: **pinyin-shown presentations do not advance stability.** A player who knows 牛肉 (niúròu) by ear answers a pinyin-shown card without reading a character; those rows log `role: exposure`. Otherwise: correct without pinyin → Good (3); correct on a first-ever sighting → **Hard (2)**, because at k = 4 an item with no memory strength is answered correctly by chance a quarter of the time, making a first correct weak evidence; any incorrect → Again (1); a commit-window timeout → `role: exposure`, never Again, or a player who put their phone down loses a week of intervals.

## 6.4 Item state stored per player

Two stores, and the boundary is load-bearing. The **shared game log** is append-only, signed, synced P2P, and holds `{playerId, itemId, choice, elapsedMs}` and nothing about memory. The **memory store** is local to the device, never synced, never in the reducer.

Per `(player, item_id, direction)`, 16 bytes of scheduler state:

```
stability    f32
difficulty   f32
last_review  f64
```

Plus learner-model counters — a logistic regression over six features, four counts and two continuous, ~24 bytes, no neural knowledge tracing and no BKT:

```
attempts, correct, attempts_this_char, correct_this_char,
log1p(days_since_last), item_difficulty
```

Deep knowledge tracing splits 4–4 against logistic regression over hand-built counts at gaps of 0.01–0.06 AUC, on a benchmark that is mostly maths tutoring systems plus one Spanish vocabulary set, so it transfers here only loosely. The local argument decides it: a gap that small is unrecoverable at ~30 responses per player per evening.

Plus per-item bookkeeping: `exposure_count` (drives distractor tier — distant distractors until an item has been answered correctly once, component-sharing distractors only after, matched on component id), `contexts_seen` (a set, for the ≥ 3 gate), `naked_probe_correct / naked_probe_attempts`, `state ∈ {NEW, LEARNING, SOLID}`, `seeded_in_session_id`, `high_confidence_miss`.

A 3,000-span + 3,000-character bank × 8 local seats is 48,000 rows. At 40 bytes of numeric state per row plus bookkeeping and IndexedDB overhead, budget low single-digit MB.

Every presentation writes one review row per player, always, on the standard schema — `card_id`, `review_time` (ms, UTC), `review_rating {1,2,3,4}`, `review_state {0,1,2,3}`, `review_duration` — plus `player_id`, `mode {solo|group}`, `role`, `format_tier`, `n_alternatives`, `eligible_for`, `render_variant`, `distractor_set`, `response_latency_ms`, and **the per-player R vector at selection time**, so any selection decision can be evaluated retrospectively. `day_start = 4`, so a late restaurant session and the ride home are one day.

Never render a per-item mastery percentage. In the only large-scale published comparison in a real language product (Settles & Meeder 2016, Duolingo), every scheduler tested ranked item-level recall at AUC 0.510–0.542 against 0.500 chance, the best of them Leitner at 0.542. Three coarse states by shape and fill (NEW outline, LEARNING half, SOLID filled) is the most that supports, and SOLID must fall back to LEARNING when R decays below ~0.7. Aggregate progress shows at deck level only, where averaging over ~100 items makes the estimate defensible.

## 6.5 One item, N schedules

### Prior art: none we could find

There is no library, benchmark or on-point paper for selecting a single stimulus that N simultaneous learners all answer. The nearest published work is **single-learner** session-level selection with public code and released trial data (Upadhyay, Lancashire, Moser & Gomez-Rodriguez 2021, *npj Science of Learning* 6:26, and the Tabibian line behind it). Math Garden is the precedent for the adaptive-difficulty half, but every child there gets their own item; classroom CAT is individual by construction; the co-located quiz literature measures enjoyment, not learning. So: **no prior art. What follows is reasoned from first principles and is the highest-risk unvalidated bet in the design.**

Three obvious answers fail before implementation. *Averaging the table into one composite learner* discards the information the selector exists to use: a table whose weakest member knows 300 characters and whose strongest 1,200 has a composite due for nobody. *Dealing from the active player's queue only* makes the item a property of whose turn it is, colliding with the opposing team dealing the scene. *Drawing from a shared frequency deck* is what the trivia engine already does, and throws the product away.

### The mechanism

**The dealt item comes from the union of every seated player's due queue, scored by a group objective with a rotating priority player.**

`pickItem(candidates, players[]) → item` is pure and stateless, taking each player's R for each candidate. Being pure, the objective is swappable, the counterfactual choice of any alternative loggable, and the whole thing A/B-able without touching storage.

1. **Candidates** = union of all seated players' due items, filtered to the dealt scene. Eligibility is applied **per player, not group-wide**. Group-wide is catastrophic: assuming the weaker player's characters are a subset of the stronger's, a 300-vs-1,200 table excludes 75% of the strong player's known characters before the difficulty objective runs, and 600-vs-1,800 excludes 67%. On spans it is worse, because span readability is multiplicative in its characters.
2. **Priority player π** rotates round-robin and is *not* the answerer — everyone answers every round. π is only whose queue gets first claim.
3. **Score** `U(i) = −Σ_p w_p·(R_p(i) − 0.85)²`, with `w_π = 3` and `w_p = 1` otherwise. Softmax-sample over the top 8 rather than argmax, so no two evenings produce the same sequence. Worst case is the whole 3,000-span bank × 8 players ≈ 24k `pow()` calls, well under 2 ms on a phone; scene filtering makes the real candidate set a fraction of that.
4. **Four hard, non-tunable constraints** override the objective: no item scored twice in one session (recurrences log `role: exposure`); no item leaves LEARNING on same-session corrects — a correct in a *later* session is required; after two consecutive misses by any player, force-inject an item where that player's R > 0.95; floor every per-player minimum interval at 1 day.

The priority player makes a guarantee pure averaging cannot: over an eight-round band with four players, each gets two rounds where their own queue dominates — "two of these were picked for you."

### What the non-priority players get

Under blind simultaneous commit **there are no non-acting players** — everyone answers every item privately on their own phone, one review row per player per round. This makes per-player scheduling possible, and is independently required: an opponent who *chose your item* and holds a stake in your failure is not the passive audience whose effect is small. Mere-presence effects are tiny; evaluation apprehension plus outcome interdependence is a different condition the reassuring number does not cover. So: what does a player get from an item not due for them?

- **Too easy (R_p > 0.95).** A real cost — a retrieval that succeeds when the item was nearly forgotten is worth far more than a comfortable one. Ruling: log the row, but an item whose pre-answer R_p > 0.95 advances stability at most once per session, so intervals cannot inflate off freebies. These also serve as the force-inject pool.
- **Right point (0.7 ≤ R_p ≤ 0.95).** Full-value retrieval. Nothing special.
- **New or nearly lost (R_p < 0.7, or NEW).** Here the format earns something solo cannot. The item resolves publicly, component breakdown as the largest block on the reveal, one confusable beside it — 入口 beside 出口, 荤 beside 素, 期 (⿰其月, component 月 U+6708) beside 肝 (⿰⺼干, flesh radical ⺼ U+2EBC). A wrong guess followed by corrective feedback is *productive*, and a first encounter has to happen somewhere. Ruling: an item dealt from someone else's queue that is NEW for player p **enters p's schedule as a completed first review**, graded Hard on a correct and Again on a miss, initial stability from the pretrain-4 fit.

That is a design claim, not a finding: **the group session is a review session for the priority player and an introduction engine for everyone else.** Its job is to seed items and pay the social cost of first encounters; the solo session's job is to space them.

Two guardrails. Never show what other players picked — seeing another player's wrong answer implants it, and people later reproduce others' errors as their own memories. That is a correctness argument, not a comfort argument. Show only an anonymous filled-dot count that each player committed: the effort cue, never the magnitude, which is the ability cue.

The claim is falsifiable from the first cohort's log: do group-seeded items reach a ≥ 7-day delayed correct at the same rate as items first met solo? If they trail, the introduction-engine claim is wrong and the weights collapse to `w_π` only.

### Reconciling solo and group

**There is one schedule. There is no such thing as multiplayer progress.** The group session writes into the same local per-player memory store as solo, through the same grade mapping and the same four constraints. The shared signed log is the *game*; the private memory store is the *product*. Three things make it work.

**Identity is the device.** With no accounts, the phone that joins a table binds its local `player_id` to that seat. A guest on someone else's phone in pass-and-play gets an ephemeral seat writing to a scratch store, offered as a JSON export at the end and otherwise discarded — never silently merged into the host's.

**The constraints are mode-blind.** Same-session and same-day rules apply across modes: a restaurant round and the solo review on the ride home fall inside one day boundary (`day_start = 4`) and count as one session for LEARNING graduation. This stops a group evening inflating intervals on an item met four times under social pressure.

**The morning-after queue.** The group session writes a `seeded_today` set, and the solo scheduler puts those items at the *front* of the next day's queue. The second exposure of a newly introduced item should fall after a night, not later the same evening. This single rule converts a structurally massed party game into a spaced one, and it is the hinge the whole model turns on.

The modes are not redundant, because they carry opposite constraints. Same-item repetition needs a **minimum** gap (≥ 24h). Confusion sets plausibly need a **maximum** gap — confusable items close together but not adjacent, 5–15 intervening items, never split across sessions. **This is a bet, and the meta-analytic evidence does not endorse it for word-like material.** The one large interleaving meta-analysis (59 studies, 238 effect sizes, 158 samples) gives overall g = 0.42, paintings g = 0.67, mathematics g = 0.34, and **words g = −0.39, a reliable advantage for blocking.** The case for tight scheduling rests instead on the discrimination-contrast argument: 未/末 is a visual category-induction problem, closer to the paintings cell than the paired-associate words cell. That is a hypothesis about which cell character forms fall into, and it ships instrumented — A/B tight-contrast against blocked-then-spaced on confusion-set members, read on the ≥ 7-day delayed correct rate. If words wins, confusion sets get the same ≥ 24h minimum as everything else. A group session is the only place a confusion set can be walked tightly under shared attention; solo is where the ≥ 24h spacing happens. Either way the schema needs both `confusion_set_id` and `isomorph_group_id`, and the scheduler both bounds.

Finally, the falsification test governing everything above: instrument `sessions_per_week` and `days_between_sessions` split by mode from the first cohort. **If the median multiplayer gap exceeds ~7 days while solo sits under ~3, invert the architecture** — solo daily becomes the primary path and the group session becomes purely the acquisition channel and introduction engine. That is the role this section has already assigned it: the inversion costs a router change, not a rewrite.

## Corrections applied

- **⺼ vs 月 — confirmed, and hardened.** In the decomposition table 肝 肠 肚 腰 脑 all take ⺼ U+2EBC (radical and decomposition agree) and 期 takes 月 U+6708; the original was right. Added a codepoint-identity rule barring substring or glyph matching on components, since the two render identically, and verified NFC/NFD/NFKC/NFKD leave U+2EBC unchanged.
- **All pinyin and all 14 corpus ranks verified and unchanged,** as are 90.03%, 93.07% and 99,950,541.
- **Arithmetic repaired:** 12,009 → **12,010 records** (the last line lacks a trailing newline, so `wc -l` under-counts by one); "even chance a six-character sign is unreadable" → **35%** (1 − 0.9307⁶; even chance needs ~10 characters); "twenty-two scenes at four-to-six per domain" → **eighteen at two-to-four**, matching the table; "~96,000 rows" → **48,000**, with the size raised, since 40 bytes/row is 1.9 MB of numerics before bookkeeping and "~1.5 MB" was unattainable; "6,000 candidates × 8 players ≈ 50k ops" → **≈24k**, the bank being 3,000 spans, characters being skill nodes rather than dealt items; and "excludes 80% … still 62%" → **75% and 67%**, the actual character arithmetic with the subset assumption stated — the originals were not derivable from anything given.
- **The "first three official bands" claim was false.** 涮, 卤, 荤 are 一级 and 炖, 煸, 胗 二级 of the 通用规范汉字表. The true claim is HSK 3.0 bands 1–3, and even that does not generalise (烧 is HSK 3, 烤 HSK 4), so the blanket "ten cooking verbs / seven ingredient characters" version is dropped.
- **Authoring tier no longer claims a 通用规范汉字表 spine** — a recommendation that did not follow from the cited rank finding, since the same bands hold 涮/卤/荤 *and* 期/保/质/量/含/换/乘/净. Tier is now authored signage utility. Added that the frequency table is itself mixed-script (1,159 traditional forms), strengthening the existing ruling against quoting coverage in product copy.
- **AUC claim replaced with actual numbers.** "Every published model … within 0.04 AUC of chance" was an overreach and slightly wrong: the schedulers ran 0.510–0.542 against 0.500, Leitner at 0.542. Scoped to the one study and product it comes from.
- **Duolingo quotation removed** — "would decay rapidly regardless of how often they practiced" is not in the source. Paraphrased to what the paper reports and scoped as a post-mortem; the delete-the-features conclusion survives.
- **"A quarter of those are guesses" corrected.** At k = 4 the chance rate on an unknown item is 25%; the share of *corrects* that are guesses depends on R and approaches 100% at R = 0. Hard (2) kept on the corrected reasoning.
- **Interleaving claim inverted back.** "The manipulation with the strongest support for exactly this material" was backwards — the meta-analysis words cell is g = −0.39, favouring blocking. Rewritten as an explicit bet on the discrimination-contrast argument, with cell values stated and an A/B test attached.
- **"Six integers" → six features** (two are continuous); **DKT 4–4 split scoped** to a mostly-maths benchmark, with the data-volume argument carrying the decision.
- **Smaller repairs:** prequestion transfer scoped to texts and lectures; GB 2894's four-category scheme given, matching the four Safety scenes; GB 7718's foreign-text size rule added; Math Garden credited where the Elo design descends from it; the k-inversion argument made conditional on k varying, since k is fixed at 4; social-contagion and evaluation-apprehension mechanisms named; "no prior art" softened to "none we could find" in the heading, ruling intact.
- **Length note:** this runs ~3,950 words against the 2,000–3,000 target. The source section was already ~3,400 and the corrections add material; I compressed prose by roughly 10% but stopped short of deleting rulings, schema fields or verified figures to hit the count. Verification scripts and the working copy are at `/tmp/claude-0/-home-user-dohhh/4806d96a-ebd4-5774-9d7d-fe7e365865df/scratchpad/out/sec6.md` and `/tmp/claude-0/-home-user-dohhh/4806d96a-ebd4-5774-9d7d-fe7e365865df/scratchpad/vfy_doc2.py`.

---

# 7. The curriculum

The orderings below are marked **corpus-grounded** where they follow the frequency
data, and **judgement** where functional payoff overrides frequency. Where the two
disagree — a character that is rare in a corpus and unmissable on a menu — that gap
is the argument for a functional syllabus over a frequency one.

## 7.1 Menus

A Chinese menu is the one situation in this curriculum where the *dominant* barrier is unknown characters rather than opaque compounds — with a named set of compound exceptions (时价, 招牌, 水煮, 干煸) that get compound treatment anyway. The measurement is unambiguous. Of the thirteen core cooking verbs, the median rank in `charfreq.txt` (99,950,541 tokens, 12,010 distinct characters) is **2,276**; only three — 烧 (1,051), 爆 (1,261), 炸 (1,407) — fall inside the top 1,500, which is the entire bank. Zero of the thirteen appear in HSK 3.0's first 900 characters. Contrast the supermarket set in §7.2: median rank **377.5**, 41 of 44 inside the bank. Menus are a character-acquisition problem; labels are a parsing problem. They need different item types, different difficulty models, and — the point of this section — different justifications for existing at all.

A frequency-ordered 1,500-character bank covers **93.1%** of running text in the corpus and still leaves the learner unable to read 涮 on the hotpot menu they are sitting in front of.

### Cooking methods

The method character is the highest-leverage glyph on the page: it predicts oil, heat, temperature and whether you or the kitchen does the cooking. Nine of the thirteen take 火 or 灬 as their Kangxi radical (炒 爆 炸 烤 焖 炖 烧 with 火; 煮 煎 with 灬 — verified against decomposition data), so one component card unlocks most of the strand. 蒸 takes 艹 as its radical but hides 灬 one level down inside 烝; teach it adjacent to, not inside, the fire family.

**Ordering: judgement.** Corpus rank would put 涮 last and 烧 first; we order by *how wrong you can go*. Frequency is stored as a tie-breaker field only.

| hanzi | pinyin | English | Dutch | tier | why it earns its place |
|---|---|---|---|---|---|
| 炒 | chǎo | stir-fry | roerbakken | 1 | The default. Rank 1,568 — already outside a frequency bank |
| 蒸 | zhēng | steam | stomen | 1 | The safe order: no added oil, mild |
| 烤 | kǎo | roast, grill | roosteren, grillen | 1 | Dry heat, skewers; the whole 烧烤 section |
| 炸 | zhá | deep-fry | frituren | 1 | Heteronym trap: zhà is "explode", zhá is the food |
| 煮 | zhǔ | boil | koken | 1 | Plain and wet — but see 水煮 below |
| 烧 | shāo | braise in soy | braiseren | 1 | 红烧 is the mildest thing on most menus |
| 炖 | dùn | long-stew | stoven | 1 | Bones, hours, soupy; rank 3,415 |
| 焖 | mèn | covered braise | smoren | 1 | Absent from HSK 3.0 entirely; rank 3,141 |
| 煎 | jiān | pan-fry | bakken in de pan | 1 | Distinguishes 煎饺 from 蒸饺 at the dumpling stall |
| 爆 | bào | flash-fry | flitsbakken | 1 | Seconds at high heat, usually offal — a warning |
| 拌 | bàn | tossed, dressed | aanmaken | 1 | Almost always **cold**; the one method that changes serving temperature |
| 卤 | lǔ | master-stock braise | in kruidenbouillon gegaard | 1 | Dark, star anise, served cold, usually organ meat |
| 涮 | shuàn | swish in broth | kort dompelen | 1 | This is hotpot: **you** cook it. Rank 5,115 |

Four compound modifiers override the base method and belong in the same strand, tagged non-compositional: 红烧 hóngshāo (red-braised, sweet-savoury, safe), 清蒸 qīngzhēng (plain-steamed, mild), 干煸 gānbiān (dry-fried Sichuan, chilli-heavy — 干 is gān "dry", not gàn; every automatic pinyin tool gets this wrong), and 水煮 shuǐzhǔ — literally "water-boiled", in fact a pool of chilli oil and Sichuan pepper. 水煮鱼 and 水煮肉片 are the two dishes most often ordered by mistake by people who read the characters correctly and drew the wrong conclusion. Give 水煮, 干煸 and 干锅 the hazard template, not the menu template.

### Proteins and staples

**Ordering: judgement, grouped by menu function** — unmarked defaults, then animals, then staples. It is not corpus-grounded and the earlier draft's stamp was wrong: 荤 (3,302) sits third and 面 (76) twelfth, so no frequency key produces this order. The grouping exists to carry one cultural fact the corpus cannot see. 肉 alone on a Chinese menu means **pork**. 肉丝, 肉片, 肉末 with no animal named are all pork. No HSK level teaches this, and it catches vegetarians, Muslims and Jews routinely — so 肉 leads despite 鱼 outranking it (452 vs 869).

| hanzi | pinyin | English | Dutch | tier | why it earns its place |
|---|---|---|---|---|---|
| 肉 | ròu | meat — by default **pork** | vlees — standaard varkensvlees | 0 | The single most consequential unmarked default on the page |
| 素 | sù | vegetarian | vegetarisch | 0 | But 素 dishes routinely carry 蚝油 or 高汤 |
| 荤 | hūn | meat-containing | met vlees | 0 | Rank 3,302, absent from HSK 3.0; pairs with 素 as a menu-header opposition |
| 鸡 | jī | chicken | kip | 1 | Rank 1,249 |
| 牛 | niú | beef | rund | 1 | Rank 881 |
| 猪 | zhū | pig | varken | 1 | Rank 1,633 — outside the frequency bank |
| 羊 | yáng | lamb, mutton, goat | lam, schaap, geit | 1 | Rank 1,340; the Dutch gloss is genuinely three animals |
| 鱼 | yú | fish | vis | 1 | Rank 452, the highest-frequency protein |
| 虾 | xiā | shrimp, prawn | garnaal | 1 | Rank 2,460; allergen-critical |
| 蛋 | dàn | egg | ei | 1 | Rank 1,157 |
| 饭 | fàn | cooked rice; also "meal" | rijst, maaltijd | 1 | 炒饭, 米饭 |
| 面 | miàn | wheat noodles; also "flour" | tarwenoedels | 1 | Rank 76, but the *food* sense is what's needed. Traditional 麵 appears on calligraphic 麵館 fascias |
| 粉 | fěn | rice noodles; also "powder" | rijstnoedels | 1 | One reading, two senses — both on menus |
| 饺 | jiǎo | dumpling | dumpling | 1 | Rank 3,891 — a frequency bank never reaches it |
| 包 | bāo | filled steamed bun | gevuld gestoomd broodje | 1 | Contrasts with 馒头, which is unfilled |
| 锅 | guō | pot | pan | 1 | Rank 1,520. 火锅 hotpot, 砂锅 clay pot, 干锅 dry pot |

### The flavour warnings

**Ordering: judgement, explicitly against the corpus.** 酸 (1,002) and 麻 (1,071) outrank 辣 (1,897), and 咸 (1,688) outranks neither, but 辣 is what hurts.

| hanzi | pinyin | English | Dutch | tier | why it earns its place |
|---|---|---|---|---|---|
| 辣 | là | chilli-hot | pittig, heet | 0 | The one warning that must be readable on day one |
| 麻 | má | numbing, lip-tingling | verdovend, tintelend | 0 | **Not heat.** "Pittig" is wrong. No Dutch or English word exists |
| 咸 | xián | salty | zout | 1 | Rank 1,688; Chinese "salty" is saltier |
| 酸 | suān | sour | zuur | 1 | Rank 1,002; also the pickled-vegetable marker |
| 甜 | tián | sweet | zoet | 1 | Rank 1,749; 甜 in a savoury dish name means sugar in the sauce |

麻 gets a dedicated card and a sentence rather than a gloss: *this is not heat, it is your mouth going numb.* 麻辣 málà is the combined Sichuan/Chongqing default and **is** introduced beside 辣 from day one — they are meaning-confusable but visually distinct, which is the safe confusion class. The heat dial (不辣 / 微辣 / 中辣 / 特辣 / 变态辣) ships as a separate always-accessible point-at-this screen at large type, alongside 不要香菜. That 微辣 in Chengdu can outrun 特辣 in Shanghai is practitioner observation, not a measured claim — but the design consequence stands: label the dial as local. Note also the sandhi: 不辣 is cited *bù là*, spoken *bú là* — this is exactly what the item schema's separate `pinyin_citation` and `pinyin_surface` fields are for.

### Qualifiers

**Ordering: judgement, ordered by cost of failure.** 时价 is the costliest failure in this block: no price is printed, and you are told the number after you have eaten. It stays at tier 2 because the exposure is narrow — seafood and live tanks — not because the failure is cheap.

| hanzi | pinyin | English | Dutch | tier | why it earns its place |
|---|---|---|---|---|---|
| 时价 | shíjià | market price | dagprijs | 2 | Both characters are common (24, 422); the compound is opaque and absent from every HSK level |
| 大份 | dà fèn | large portion | grote portie | 1 | 份 is rank 742 but reads "share/copy" elsewhere |
| 小份 | xiǎo fèn | small portion | kleine portie | 1 | The pair is the item, not the individual characters |
| 例 | lì | standard portion | standaardportie | 2 | Rank 691 as "example" — the portion sense is invisible to frequency |
| 招牌 | zhāopái | signature dish | huisspecialiteit | 2 | Also means "shop sign" — same glyphs, two situations |
| 特色 | tèsè | house specialty | specialiteit | 2 | Confusable with 特价 (§7.2); authored distractor pair |
| 起 | qǐ | "from" (a price) | vanaf | 2 | 88元起 means 88 is the floor, not the price |
| 位 | wèi | per person | per persoon | 2 | Drives 茶位费 and 餐位费, the cover charges |

### Section headers

**Ordering: judgement — the physical order of the page.** The corpus would order these 主食 (556), 热菜 (847), 饮料 (1,358), 汤 (1,393), 凉菜 (1,602), which is close to the reverse of how the page is printed. The earlier draft stamped this corpus-grounded; it never was.

| hanzi | pinyin | English | Dutch | tier | why it earns its place |
|---|---|---|---|---|---|
| 凉菜 | liángcài | cold dishes | koude gerechten | 1 | Always the first section; 凉 is rank 1,602 |
| 热菜 | rècài | hot dishes | warme gerechten | 1 | 热 rank 475, 菜 rank 847 — both known, the pair still needs teaching |
| 汤 | tāng | soup | soep | 1 | Rank 1,393; single-character header |
| 主食 | zhǔshí | staples: rice, noodles, buns | basisgerechten | 1 | Ordered **last** in China. A Dutch diner expecting bread first is misreading the whole page |
| 饮料 | yǐnliào | soft drinks | frisdrank | 1 | Distinct from 酒水, which is alcohol |

### The organ and texture set — where ⺼ earns its keep

**Eight of the twelve characters in this table fall outside the 1,500-rank bank**; 胗 sits at rank 7,674 with 29 occurrences in a hundred-million-token corpus. By any frequency logic these are unreachable. By the logic of a Western diner reading a Chongqing hotpot order sheet, they are the most consequential glyphs in the whole curriculum — and eight of the twelve (a different eight: 肠 肚 肝 腰 肺 肾 脑 胗) share a single component, which is what makes teaching them affordable.

**Ordering: judgement.** Corpus rank is inverted here — 血 (631) and 皮 (739) are the two the learner most likely already has, 胗 is near-absent, yet 胗 is the one you need.

| hanzi | pinyin | English | Dutch | tier | why it earns its place |
|---|---|---|---|---|---|
| 肠 | cháng | intestine | darm | 2 | 肥肠, 大肠. Rank 1,512 — twelve places outside the bank |
| 肚 | dǔ | tripe, stomach | pens, maag | 2 | 毛肚 on every hotpot sheet. Read **dù** it means "belly" |
| 肝 | gān | liver | lever | 2 | 猪肝, 鹅肝. Rank 1,829 |
| 腰 | yāo | kidney | nier | 2 | 腰花. Rank 1,489 — the one organ character a 1,500 bank would have given you, eleven places inside. Also means "waist" |
| 肺 | fèi | lung | long | 2 | 夫妻肺片 contains no lung nowadays. Rank 2,140 |
| 肾 | shèn | kidney | nier | 2 | Rank 2,131 |
| 脑 | nǎo | brain | hersenen | 2 | 脑花. Rank 909 — high frequency, wrong sense |
| 胗 | zhēn | gizzard | spiermaag | 2 | Rank 7,674. The clearest single case for a functional syllabus |
| 血 | xuè | blood, as a set curd | bloed, als gestolde koek | 2 | 鸭血, 毛血旺. Does **not** carry ⺼ |
| 舌 | shé | tongue | tong | 2 | 牛舌. Rank 1,914. Does **not** carry ⺼ |
| 筋 | jīn | tendon | pees | 2 | Kangxi radical is ⺮; ⺼ hides one level down, inside 肋 |
| 皮 | pí | skin, crackling | huid, zwoerd | 2 | 猪皮, 皮蛋. Does **not** carry ⺼ |

Teach ⺼ (U+2EBC, Kangxi 130, meat) as one component card **before** 肠 肚 肝 腰 脑 肺 肾 胗. It is not 月 (U+6708, moon) and the two are homoglyphs in almost every font, including our subset. Verified against decomposition data: all eight organ characters carry U+2EBC and none contains U+6708 anywhere in its decomposition; 期 朋 服 有 望 朗 carry U+6708. Matching the substring 月 *against the decomposition string* therefore highlights **none** of the eight and fires instead on 期 — which sits inside 保质期 and 生产日期, both Tier-1 supermarket items. It fails silently and teaches the opposite of the truth. (Matching 月 against rendered text is worse still: it fires on nothing at all, because every one of these is a single codepoint.)

The reverse error is just as real and is the reason highlighting must key off a stored per-item component field rather than any match at all. 能 (rank **61**), 育 (444), 背 (767) and 散 (875) all carry ⺼ in their decomposition — and 散 sits inside 散装, a §7.2 shelf term. A naive ⺼ highlighter paints "meat" onto 散 and onto 能, the 61st most frequent character in the corpus. Store the component; never derive it.

### The QR-code reality

Most of the above is now read on a phone, not on paper. Table service in urban China routes through a 扫码点餐 mini-programme: the physical menu, where it survives, is decorative. This changes the item format, not the content. A sixth card template renders a phone inside the phone — a scrollable Chinese ordering UI at realistic 14–16px density with tappable regions — and the task shifts from "what does this character mean" to "tap the button that adds this to your cart without ordering it." Small type is correct here because small type *is* the difficulty; this is the one template exempt from the type-**size** floor applied elsewhere. The size exemption is not a contrast exemption: WCAG AA sets a contrast ratio, not a font size, and every glyph here still clears 4.5:1.

Two pairs carry the irreversible risk: 去结算 (proceed to checkout) against 取消 (cancel), and 提交订单 (submit — irreversible) against 加入购物车 (add to cart — reversible). 备注 bèizhù is the free-text field where 不要香菜 goes. 售罄 shòuqìng, 起送 qǐsòng and 去结算 are absent from every HSK level. Roughly 25 items, `interaction: 'tap-target'`, hit-regions in the schema from the start rather than retrofitted.

Two honest caveats. The QR shift is practitioner-derived market observation, not a literature claim — it needs a field check before it drives more than one template. And the OCR argument is weaker than the earlier draft made it: you can screenshot your own mini-programme and OCR it. What reading buys you is speed inside a live cart, where a screenshot round-trip costs you the tap. That is still a promotion argument for the template, but a modest one.

---

## 7.2 Supermarket and convenience

The supermarket strand inverts everything above. Take the 44 distinct characters in the four tables below — store names, checkout, money, weights, label fields and promotions: median corpus rank **377.5**, 41 of 44 inside the 1,500-character bank, 36 of 44 in HSK 3.0's first three levels, and **none** absent from HSK 3.0 altogether. Only 扫 (1,625), 账 (2,178) and 冻 (2,205) fall outside the bank.

The learner already knows almost every brick — 36 of the 44 are HSK 1–3. What defeats them is that 净, 含 and 量 are ranks 1,436, 853 and 202, and 净含量 still means nothing. This strand is authored as compound-parsing and cloze items, not character-acquisition items: the same split §7.1 argued for, arriving from the other side.

### Store and checkout

**Ordering: judgement — shopfront to till.** By rarest constituent character the corpus would run 收银台 (623), 超市 (707), 便利店 (1,032), 扫码 (1,625), 结账 (2,178); this is not that order either.

| hanzi | pinyin | English | Dutch | tier | why it earns its place |
|---|---|---|---|---|---|
| 超市 | chāoshì | supermarket | supermarkt | 1 | Both characters top-1000; the compound is the shopfront |
| 便利店 | biànlìdiàn | convenience store | buurtwinkel | 1 | 便 is biàn here, pián in 便宜 — a per-string pinyin case |
| 收银台 | shōuyíntái | checkout | kassa | 1 | Overhead lane signs shorten to bare 收银 |
| 结账 | jiézhàng | settle up, pay | afrekenen | 1 | 账 at 2,178 is one of only three out-of-bank characters here |
| 扫码 | sǎomǎ | scan the QR code | scannen, QR-code scannen | 1 | The universal payment verb; rank 1,625 for 扫 |

### Money, and the 斤 trap

**Ordering: judgement, and this is the one unskippable block in the strand.**

斤 is a **catty: exactly 500 g**. Loose produce, meat and fish are priced 元/斤 almost everywhere in China. A shelf reading 牛肉 32.8元/斤 is 65.6 元 per kilo — double what a European brain computes, in the expensive direction, every single time. 斤 sits at corpus rank 1,370: inside our bank, but only just, and it is HSK level 2 as a bare character with nothing attached about what it weighs. Knowing the glyph and not the arithmetic is worse than not knowing the glyph.

| hanzi | pinyin | English | Dutch | tier | why it earns its place |
|---|---|---|---|---|---|
| 元 | yuán | yuan (written) | yuan | 0 | Rank 211; the printed currency unit |
| 块 | kuài | yuan (spoken) | yuan (spreektaal) | 0 | Rank 815; what you hear, never what you read |
| 斤 | jīn | catty = 500 g | catty = 500 gram | 0 | The single highest-value arithmetic fact in the app |
| 两 | liǎng | 50 g, one tenth of a 斤 | 50 gram | 1 | Rank 113 as "two" — the unit sense is invisible to frequency |
| 克 | kè | gram | gram | 1 | Rank 406; the honest unit, printed on packaged goods |
| 千克 | qiānkè | kilogram = 2 斤 | kilogram | 1 | Also written 公斤; both forms appear on the same shelf |

Ships as `itemType: 'compute'` with a generator so the numbers randomise: *牛肉 32.8元/斤 — what does a kilo cost?* with 65.6 / 32.8 / 16.4 / 328 as options. The price-label template renders the numeral huge and the unit character small, because that is the real reading condition — the whole difficulty is that 斤 is a fraction of the height of the number beside it. Note that 斤 and 公斤 are a form-confusable pair and must not enter as new items in the same session.

### The label block

GB 7718 requires a production date and a shelf-life **duration** on packaged food; a calculated expiry date is optional and usually absent. You do the addition.

**Ordering: judgement, ordered by consequence.** By rarest constituent character this block would open with 进口 (157) and bury 冷冻 (2,205) last; by consequence it opens with the date pair.

| hanzi | pinyin | English | Dutch | tier | why it earns its place |
|---|---|---|---|---|---|
| 生产日期 | shēngchǎn rìqī | production date | productiedatum | 1 | All four characters rank 28–214; the field is still unreadable without instruction |
| 保质期 | bǎozhìqī | shelf life, as a **duration** | houdbaarheidsduur | 1 | 保质期12个月 is not a date. Contains 期 — the 月 homoglyph trap |
| 净含量 | jìnghánliàng | net content | netto-inhoud | 1 | 量 is liàng, not liáng — pinyin is a property of the string |
| 冷藏 | lěngcáng | refrigerate, 0–4 °C | gekoeld bewaren | 1 | Authored distractor for 冷冻 — same first character, opposite instruction |
| 冷冻 | lěngdòng | freeze, −18 °C | diepvries | 1 | Getting this pair wrong ruins the food either way |
| 进口 | jìnkǒu | imported | geïmporteerd | 1 | Rank 80/157; on a metro sign the same glyphs mean "entrance" |
| 散装 | sǎnzhuāng | loose, sold by weight | los, per gewicht | 2 | Flags that 元/斤 applies. 散 carries ⺼ — a highlighter false positive |
| 称重 | chēngzhòng | weigh here | hier afwegen | 2 | You must weigh produce and get a barcode sticker **before** the till |

Also: 见包装 / 见瓶身 / 见喷码 ("see the packaging / the bottle / the inkjet code") send you hunting for the date elsewhere on the item. Date formats vary freely — 20260822, 2026/08/22, 2026.08.22, 26 08 22 — so the compute item generates all four. GB 7718 also mandates Chinese on packaged food and forbids foreign-language type larger than the corresponding Chinese, which is why this is the one domain with genuinely no English fallback. We weight it at 30% of the supermarket item bag: an authoring decision that follows from "no fallback", not a figure derived from the corpus, and one playtest should be allowed to move.

### Promotions

| hanzi | pinyin | English | Dutch | tier | why it earns its place |
|---|---|---|---|---|---|
| 特价 | tèjià | special price | aanbieding | 0 | Rank 213/422; confusable with 特色 (§7.1) and 特产 |
| 买一送一 | mǎi yī sòng yī | buy one get one free | 1+1 gratis | 1 | Every character in the top 900 (865 / 1 / 712). Absent from every HSK level. Sandhi: spoken *mǎi yí sòng yī* |
| 会员价 | huìyuánjià | members' price | ledenprijs | 1 | Displayed as if it were the price; needs a scanned app account |
| 折 | zhé | discount as the fraction you **pay** | korting, uitgedrukt als wat je betaalt | 0 | 打八折 = pay 80%, i.e. 20% off. A European reading "8折" as "80% off" errs badly in the wrong direction |

### Where the corpus and the situation disagree — the whole argument

Across both sections, **exactly thirty** characters that a table needs fall outside the 1,500-character bank a frequency ordering would build. Named, in rank order: 肠 锅 炒 凉 肚 扫 猪 咸 烤 蒸 甜 肝 辣 舌 筋 肾 肺 账 冻 煎 煮 虾 拌 卤 焖 荤 炖 饺 涮 胗. Thirty characters is **two per cent** of the bank. That is the entire cost of the disagreement, and it buys the difference between a learner who can read the hotpot order sheet and one who cannot.

The disagreement runs in both directions, and both directions are instructive. 胗 (rank 7,674) and 涮 (5,115) are corpus-invisible and situationally unmissable. 能 (rank 61), 期 (214) and 主 (48) are corpus-dominant and situationally near-useless at Tier 0–1 — and 能 and 散 are precisely the characters that break a naive meat-radical highlighter. Frequency is not merely a weak ordering key for this product; at the top of the list it is actively misleading about what the learner will meet.

So: `freqRank` is stored on every item as a tie-breaker and a diagnostic. It never seeds the bank and it never sorts it. Every ordering in both sections is stamped, and once the false stamps are removed **every one of them is judgement** — which is itself the finding, not an embarrassment. Where corpus and situation conflict the situation wins, because the criterion task is not reading Chinese prose; it is standing in front of a shelf label whose unit character is a fraction of the size of the number beside it, working out what a kilo costs.

---

**Corrections applied**

1. **12,009 → 12,010 distinct characters** — `charfreq.txt` has no trailing newline, so `wc -l` undercounts by one. Token total 99,950,541 and 93.07% → "93.1%" coverage both verified.
2. **§7.1 opening overclaim → ruling.** "The barrier is unknown characters, not opaque compounds" is contradicted by §7.1's own 时价 / 招牌 / 水煮 / 干煸 rows; now "dominant barrier", exceptions named.
3. **Supermarket figures recomputed.** The 57-character set is enumerated nowhere, so median 413, 53-of-57, 45-of-57 and 仓 were underived. Over the 44 distinct characters the four §7.2 tables actually contain: median **377.5**, **41 of 44** in bank, **36 of 44** HSK 1–3, none absent from HSK 3.0, out-of-bank set **扫 账 冻**. 仓 appears in no item and is dropped; the 结账 row now reads "three".
4. **"Knows every brick" quantified** — eight of the 44 are HSK 4–6 (账 扫 码 质 含 藏 冻 折), so "almost every brick, 36 of 44 at HSK 1–3".
5. **Fire radicals split.** Nine of thirteen confirmed, but 火 and 灬 are not interchangeable: 炒 爆 炸 烤 焖 炖 烧 take 火; 煮 煎 take 灬. 蒸/烝 confirmed.
6. **Three false "corpus-grounded" stamps removed** — proteins (荤 3,302 third, 面 76 twelfth), section headers (corpus order 主食 556, 热菜 847, 饮料 1,358, 汤 1,393, 凉菜 1,602 — near the reverse of the printed page) and store/checkout (收银台 623, 超市 707, 便利店 1,032, 扫码 1,625, 结账 2,178). All three are judgement; each now shows the corpus order it departs from. The closing sentence is corrected to match: every ordering in both sections is judgement.
7. **粉 "two readings" → one reading, two senses** — `pinyin.txt` gives 粉 only fěn (面 likewise, only miàn).
8. **Organ set: "twelve of twenty-one" → "eight of the twelve".** The table has twelve rows; 腰 (1,489), 脑 (909), 血 (631) and 皮 (739) are inside the bank. Disambiguated from the *other* eight, the ⺼ carriers.
9. **肠 "one place outside the bank" → twelve places** (1,512 against a 1,500 cutoff); 腰 added as the mirror case, with missing ranks for 肝 1,829, 肺 2,140, 舌 1,914, 锅 1,520.
10. **心 / 头 replaced by 血 / 皮** — neither 心 nor 头 is in the table, so they licensed nothing.
11. **⺼ claim confirmed, mechanism made precise.** All eight of 肠 肚 肝 腰 脑 肺 肾 胗 carry U+2EBC and contain U+6708 nowhere in their decomposition closure; 期 朋 服 有 望 朗 carry U+6708; 血 舌 皮 carry neither; 筋 is ⺮ over 肋 with ⺼ one level down; 能 育 背 散 all carry U+2EBC. **Nothing in the text keys highlighting off a substring match on 月** — the passage rules against it. Added that the match is against the *decomposition string*: against rendered text 月 fires on nothing, since all of these are single codepoints.
12. **"The most common character in the supermarket strand" was false** — 散 is rank 875; 一 (1), 会 (21), 生 (28) are commoner. Now names 散 and 能 (61) directly.
13. **时价 tier contradiction resolved** — "costliest failure in this block", with the narrow exposure given as why it stays tier 2.
14. **麻辣 "may be introduced" → "is introduced"**; 微辣/特辣 regional claim relabelled practitioner observation, matching the standard the QR paragraph sets for itself.
15. **WCAG disentangled** — the exemption is from the type-*size* floor; WCAG AA is a contrast ratio with no size minimum, so the two cannot trade off. 4.5:1 stated.
16. **OCR argument corrected** — a mini-programme on your own screen can be screenshotted and OCR'd, so "the only place character reading beats camera OCR" does not follow. Rewritten as speed inside a live cart; "only" dropped.
17. **30% weighting relabelled** — GB 7718 licenses "no English fallback", not a percentage. Kept as an explicit, revisable authoring decision. Expiry-date claim corrected: GB 7718 requires production date plus duration; an expiry date is optional, not forbidden.
18. **Named out-of-bank list: 粥 → 荤.** 粥 (2,884) is in no table; 荤 (3,302) is in the proteins table and out of bank but was missing. With that swap the list is exactly the thirty out-of-bank characters across both sections — "roughly thirty" → "exactly thirty", and 30/1500 = 2% holds.
19. **Small fixes** — "65.6 元per" → "65.6 元 per"; the invented "eight-pixel" measurement replaced with a relative description in both places.

*Verified unchanged:* all 92 pinyin strings against `pinyin.txt`; all 57 stated ranks against `charfreq.txt`; 麵/館 against `tsc.txt`; median verb rank 2,276; the 烧/爆/炸 trio; zero of thirteen in HSK's first 900; 焖 and 荤 absent from HSK 3.0; 时价, 售罄, 起送, 去结算, 买一送一 absent from the HSK 3.0 word list; 斤 at HSK 2; 斤 = 500 g, 两 = 50 g, 千克 = 2 斤, 32.8 → 65.6, 打八折 = pay 80%; both sandhi claims (*bú là*, *mǎi yí sòng yī*); 胗 at 29 occurrences.

## 7.3 Transit

A metro sign is read positionally before it is read lexically. Before a player decodes a character the plate has told them most of what they need through geometry, and teaching the geometry first turns the strand's 24 metro-core characters into a working skill. Four sign templates ship:

1. **The overhead gantry** — blue or black, arrows, line roundels, exit letters white on black. The plate that gets you out.
2. **The platform edge** — line, station, previous and next, and the `开往 ⟨terminus⟩ 方向` strip that separates two identical platforms.
3. **The gateline** — `进站` / `出站`, `安检`, fare machines, the paid/unpaid boundary. Errors cost money.
4. **The timetable panel** — `首末班车时间`, small type, read standing still.

Templates ship before their vocabulary, and the first transit item a player sees is a template-identification item. **Ordering: judgement.** No corpus says layout precedes lexis; the argument is that the template is the retrieval cue at test time, since in the field the player recognises the plate first and only then looks for characters. Sorting speed is a design target, not a measured result.

The strand splits by item type, and the split is visible in the wordlists. Most of the metro core sits in early HSK 3.0 bands — 站 出 口 入 换 方 向 号 车 are all first- or second-band — but the compounds do not: `换乘`, `进站`, `出站`, `首班`, `末班`, `单程`, `开往`, `号线`, `候车`, `检票`, `取票`, `硬座`, `软卧`, `二等座` are absent from every band, while `安检` and `站台` appear only at 6 and `车厢` only at 7–9. HSK 3.0 has **nine** levels — bands 1–6 plus a combined 7–9 — not eleven.

Two corrections to the framing this invites. "Every metro-core character is early-band" is false: of 24, nineteen are band 1–2, but 线 首 程 台 are band 3 and **乘 is band 5, rank 1,238**. And band membership describes what the syllabus teaches, not what our player knows — a Dutch visitor is not an HSK candidate. The wordlist licenses a weaker claim: these compounds are taught nowhere and their parts are mostly cheap. That makes most transit items **compound-parsing rather than character-acquisition items**, *provided the curriculum teaches the parts first*. `换乘` is the exception.

**Ordering within the strand: judgement on consequence, corpus rank as tie-breaker.** A Tier 0 item built on a rank-1,238 character is not corpus-ordered; calling it that would be a claim bent to fit.

### Metro core

| hanzi | pinyin | English | Dutch | tier | why it earns its place |
|---|---|---|---|---|---|
| 站 | zhàn | station, stop | station, halte | 0 | Rank 531. ⿰立占, 占 zhàn a transparent phonetic. Tail of 加油站, 火车站. |
| 出口 | chūkǒu | exit | uitgang | 0 | 出 26, 口 157. Atomic, never decomposed. Blue or black is the way out; **green** `安全出口` is an emergency exit. |
| 入口 | rùkǒu | entrance | ingang | 0 | 入 is rank 188 — not rare — but one stroke from 人: the confusion is graphic. Ship 人 as the foil. |
| 号线 | hào xiàn | line number | lijnnummer | 0 | `4号线` = Line 4. 号 337, 线 378 and band 3. Absent from HSK; the roundel colour lets the player self-check. |
| 换乘 | huànchéng | transfer, change lines | overstappen | 0 | Absent from all bands. 换 = ⿰扌奂, and 换 唤 焕 are uniformly *huàn*. But 乘 is band 5, rank 1,238 — a character card first. |
| 地铁 | dìtiě | metro | metro | 1 | Band 2. 铁 = ⿰钅失; 钅 anchors 铁 银 铺 锅 across both sections. |
| 进站 / 出站 | jìnzhàn / chūzhàn | enter / exit the station | station in / station uit | 1 | 2×2 grid, 进/出 as axes. Both absent from HSK. 进 = ⿺辶井; 辶 recurs in 递, 道, 通. |
| 安检 | ānjiǎn | security check | veiligheidscontrole | 1 | Band 6, behaviourally Tier 1: screening is standard and the unprepared queue wrong. 检 is 11 strokes; 17-stroke 檢 never ships. |
| 方向 | fāngxiàng | direction | richting | 1 | Band 2. 方 is rank 55, six listed readings, always *fāng* here. Parses the platform strip. |
| 票 | piào | ticket | kaartje | 1 | Rank 948. ⿱覀示. Head of 单程票, 检票, 取票, 售票, 补票, 退票 — 6:1, the best ratio in the strand. |
| 开往 | kāi wǎng | bound for | richting, naar | 2 | 开 91, 往 442, both trivial; the *terminus after them* carries the information and is in no wordlist. Generate from city station packs. |
| 首班 / 末班 | shǒubān / mòbān | first / last service | eerste / laatste rit | 2 | 末 ⿻木一 against 未 wèi ⿻一木 — identical strokes, only relative length differs. Best foil in the strand: `未班车` in timetable styling; 班 ⿲王刂王 against 斑 ⿲王文王 a second. |
| 单程票 | dānchéngpiào | single-journey ticket | enkeltje | 2 | 单 has three readings, *dān* here. 单**程** ⿰禾呈 and 换**乘** ⿻禾北 share *chéng* — pair deliberately. |
| 站台 | zhàntái | platform | perron | 2 | Band 6. 台 rank 372, four listed readings, *tái* here. |

**The paid-area trap.** `付费区` / `非付费区` costs real money: crossing the gateline re-charges a fare, and stations with exits on both sides of a road force the choice. Ships text-only — the plate is photographable, but a photo lets the player match the image instead of reading it, the failure this item prevents. The GB standard for emergency-exit signage is flagged: no number prints until checked.

### Exit lettering

The addressable unit of a Chinese city is the exit letter, and schemes differ between systems in ways no single reference collects. Beijing uses **letters with a compass gloss** — `A 西北口`. Shanghai and Nanjing use **numbers** — `1号口`. Guangzhou and Shenzhen use letters with numeric subdivisions. In every scheme `口` on an exit tab means *exit*, not *mouth*, and "meet me at C口" is how the meeting gets arranged.

That makes 东西南北 a transit item, not a geography item. **Ordering: corpus-grounded** — 北 (89), 南 (130), 西 (132), 东 (140) are top-150 and first-band, so they cost almost nothing and cut down the exit-choosing problem in Beijing-style systems; by how much has not been measured and no figure is claimed. They recur in station and street names (`东单`, `西直门`). All four ship Tier 1, with one foil for 7.4: 酉 in 酒 is 西 plus one stroke, 7 against 6.

**Floors, a Dutch warning card.** `层` and `楼` count the ground floor as 1, so `3楼` is **de tweede verdieping**, not de derde; B1 and B2 are basements. The off-by-one exists against Dutch *and against British English* — only US English matches the Chinese count — so the card must name which English it glosses. An unsourced practitioner observation, not a finding.

### Mainline rail

Where consequences get expensive and European rail assumptions are actively wrong.

| hanzi | pinyin | English | Dutch | tier | why it earns its place |
|---|---|---|---|---|---|
| 高铁 | gāotiě | high-speed rail (G) | hogesnelheidstrein | 2 | Band 4. Distinguishes G from D (`动车`), which differ in price and seat class. |
| 火车 | huǒchē | train | trein | 2 | Band 1, ranks 438/371 — the easiest item in the strand, an anchor. |
| 候车 | hòuchē | wait for the train | wachten op de trein | 2 | Absent from HSK. `候车室`: stations gate you into a hall, not onto a platform. |
| 检票 | jiǎnpiào | ticket check | kaartcontrole | 2 | Absent from HSK. **`检票时间` gates close minutes before departure and do not reopen** — why this is scored consequential. |
| 车厢 | chēxiāng | carriage, coach | rijtuig, wagon | 2 | Band 7–9; 厢 is rank 2,537, outside a top-1500 bank, in regardless. ⿸厂相, the cheap 厂 cluster. |
| 身份证 | shēnfènzhèng | ID card | identiteitsbewijs | 2 | Band 3, with its exception: foreigners use a **passport** `护照`, so the gates reject you and you queue at `人工窗口`. |
| 取票 | qǔpiào | collect a printed ticket | ticket ophalen | 2 | Absent from HSK. 取 = ⿰耳又, rank 327. |
| 硬 / 软 | yìng / ruǎn | hard / soft | hard / zacht | 2 | Seat-grid axes. ⿰石更 and ⿰车欠, 车 tying back to 火车. |
| 座 / 卧 | zuò / wò | seat / berth | zitplaats / slaapplaats | 2 | Seat-grid axes. ⿸广坐 rank 696 (also 座位号), ⿰臣卜 rank 2,085. |

**The seat grid ships as one 2×2 card:** 硬座 / 软座 / 硬卧 (open six-berth bay, three tiers) / 软卧 (closed four-berth compartment). Four characters, four signs — 1:1, not the best ratio in the curriculum; 票 and 店 are both 6:1. It earns its place on structure: two axes, no exceptions, one card. The ladder 二等座 → 一等座 → 商务座 needs 二 等 一 商 务 too and ships separately. One correction carries into the gloss: **`无座` is priced as `硬座` on conventional trains but at the `二等座` fare on G and D** — second class, standing. Flag for verification against 12306.

**Domain weight: 5%. Ordering: judgement, deliberately low — with an exemption.** Tier-1 metros, HSR stations and airports are the most heavily bilingual environments in China, so the marginal *reading* payoff is lower here than anywhere else in the product. But the strand exists because the failure modes are expensive, and a flat 5% starves the very items whose consequence justified inclusion. So it carries 5%, but `检票时间`, `付费区`/`非付费区` and `开往` are exempt and reviewed at Tier 0 frequency. Like every weight here the 5% has no empirical basis: a v1 guess to be instrumented.

## 7.4 Shopfronts

Chinese business names are head-final compounds: the **final morpheme** carries the category, earlier material specialises it. That morpheme is usually one character but not always — `中心` and `市场` are two-character heads, and the rule must be stated over morphemes or the table below contradicts it. This is a structural fact about Chinese nominal compounding, not a corpus artefact, and it produces a strand where a player can correctly answer an item not in the bank. So it is ordered **heads first — judgement, on a well-supported structural fact.** Learn eight tail morphemes and you can classify a fascia you have never seen; learn eight names and you classify eight fascias.

| hanzi | pinyin | English | Dutch | tier | why it earns its place |
|---|---|---|---|---|---|
| 店 | diàn | shop | winkel | 1 | ⿸广占 — same 占 as 站; 广 recurs in 座, 库, 床 but *not* 厂房, since 厂 U+5382 differs from 广 U+5E7F and 广 = ⿱丶厂 contains it: a foil, not a family. Tail of 药店, 书店, 花店, 便利店, 眼镜店 — highest-yield head, 6:1. |
| 铺 | pù | shop (older, smaller) | winkeltje | 1 | ⿰钅甫. Reads *pù*, not *pū*. 铺 pù, 捕 bǔ, 浦 pǔ share a rime, not an initial: a memory hook, not a reading predictor. |
| 行 | háng | trade house | handelshuis | 1 | Rank 37, five listed readings, and **in a business name it is *háng*, not *xíng*** — 银行, 车行, 商行. Stored per item, not per character. |
| 馆 | guǎn | establishment, house of | gelegenheid | 1 | ⿰饣官 — 饣 is on 43 characters against 12 for 食, a fact about the inventory that helps a player remember 馆 and says nothing about what a 馆 sells: 面馆 and 茶馆 are food, 宾馆 and 图书馆 are not. The head narrows, it does not decide. |
| 城 | chéng | large retail complex | markthal, centrum | 1 | ⿰土成, rank 150. 美食城, 电脑城 — a "city" of one product type. The character is easy, the shop sense is not. |
| 场 | chǎng | venue, ground | terrein, plein | 1 | Rank 175, two readings, *chǎng* here. 停车场, 广场, 商场. |
| 中心 | zhōngxīn | centre | centrum | 1 | Two-character head. 购物中心, 服务中心. |
| 市场 | shìchǎng | market | markt | 1 | Two-character head. 菜市场 is the wet market, where the supermarket strand's produce vocabulary gets used. |

The second-tier task is **generative**: show a fascia never seen — 电脑城, 修车行 — and ask what *kind* of place it is, answerable from the head alone. Log `unseenCompoundAccuracy` separately from recall accuracy: it measures generalisation, and the item pool is unbounded and needs no authoring.

### Services you may need in a hurry

**Ordering: judgement, on consequence.** Corpus rank disagrees and is overruled — 厕 is rank 3,107 and `厕所` only band 6, and it is a day-one item anyway. Eight of the 46 characters here fall outside the top 1,500: 厕 3,107, 咖 2,620, 啡 2,581, 诊 1,906, 邮 1,711, 宾 1,630, 餐 1,600, 锅 1,520. The bank is a survival bank; general frequency filters it, never selects it.

| hanzi | pinyin | English | Dutch | tier | why it earns its place |
|---|---|---|---|---|---|
| 厕所 | cèsuǒ | toilet (blunt) | wc | 0 | ⿸厂则; 厕 侧 测 all read *cè*, though 则 itself is *zé* — the series predicts across derivatives, not from the phonetic. 所 = ⿰户斤, rank 100. |
| 洗手间 | xǐshǒujiān | washroom (polite) | toilet | 0 | Band 1. 手 (138) and 间 (144) are top-150, but **洗 is rank 1,376** and needs its own exposure. The register gap from 厕所 is the taught content. |
| 药店 | yàodiàn | pharmacy | apotheek | 1 | Band 2. ⿱艹约, 9 strokes; traditional 藥 is **19** and never ships. **Green cross** livery arrives before the characters. |
| 医院 | yīyuàn | hospital | ziekenhuis | 1 | Band 1. ⿰阝完, 阝 on the **left** (mound, 阜). Contrast 邮. `急诊` is A&E. |
| 银行 | yínháng | bank | bank | 1 | Band 2, the 行 = *háng* exemplar. ⿰钅艮 — but 根 gēn, 很 hěn, 跟 gēn scatter on initials and 银 *yín* fits worst: a shape cue, not a rule. |
| 邮局 | yóujú | post office | postkantoor | 1 | Band 4. ⿰由阝, 阝 on the **right** (settlement, 邑) — a different component from the 阝 in 院 despite identical rendering *and codepoint*, U+961D. Store per item. **Green** livery. |
| 派出所 | pàichūsuǒ | local police station | politiebureau | 1 | Absent from every band. Where a lost passport is reported; 出入境管理 handles visas. |
| 快递 | kuàidì | courier, parcel point | pakketpunt | 1 | Band 4. ⿺辶弟, 弟 *dì* giving 递 *dì*, tone and all — the one fully transparent phonetic here. Fascias read 顺丰, 菜鸟驿站. |
| 加油站 | jiāyóuzhàn | petrol station | tankstation | 1 | Band 4. Reuses 站 from 7.3 in a different sense — a `contexts` entry for the graduation gate. |
| 停车场 | tíngchēchǎng | car park | parkeerplaats | 1 | Band 2. Reuses 场 and 车. Signed **P**. |
| 诊所 | zhěnsuǒ | clinic | huisartsenpraktijk | 2 | Band 7–9, rank 1,906. ⿰讠㐱; 讠 recurs in 证, 话, 语. |
| 理发 | lǐfà | barber, hairdresser | kapper | 2 | Band 3. **发 reads *fà* here, not *fā***, stored per item. Lint case: 理发 → 理**髮**, not 理發. |
| 洗衣 | xǐyī | laundry | wasserij | 2 | Absent from HSK. Reuses 洗 from 洗手间, and at rank 1,376 that reuse does real work. |

### Eating, drinking, sleeping — and the 酒店 / 饭店 trap

This is where the head-final rule breaks; teach the exception rather than let a player build false confidence in the generative task. `酒` means alcohol, but `酒店` is a hotel, usually a larger one. `饭` means a meal; `饭店` means **either a restaurant or a hotel**, not recoverable from the characters, recoverable from the building. `宾馆` is a hotel, while `茶馆` and `面馆` are food — the head says establishment and nothing more. Ship a three-item confusion set, tagged a known-exception card, and exclude it from `unseenCompoundAccuracy`, which would otherwise punish the player for a rule the language breaks.

| hanzi | pinyin | English | Dutch | tier | why it earns its place |
|---|---|---|---|---|---|
| 酒店 | jiǔdiàn | hotel (larger) | hotel | 2 | Band 2. ⿰氵酉, radical of record 酉 (fermented). Foil: 洒 sǎ = ⿰氵西. |
| 宾馆 | bīnguǎn | hotel (mid-range) | hotel | 2 | Band 5. ⿱宀兵, rank 1,630. `招待所` is basic and often refuses foreigners. |
| 饭店 | fàndiàn | restaurant **or** hotel | restaurant of hotel | 2 | The trap item. Band 1 word, band 1 characters, ambiguous compound. |
| 餐厅 | cāntīng | restaurant | restaurant | 2 | Band 5. 餐 = ⿱⿰歺又食 (the 食 form, not 饣); 厅 = ⿸厂丁. Unambiguous where 饭店 is not. |
| 小吃 | xiǎochī | snacks, cheap eats | snackbar | 2 | Band 4. Not a head but a specialiser appearing alone on a fascia. The cheapest hot food in China. |
| 面馆 | miànguǎn | noodle shop | noedelzaak | 2 | Absent from HSK. Lint case: 面馆 → 麵館, never 面館. |
| 火锅 | huǒguō | hotpot | hotpot | 2 | Band 7–9. ⿰钅呙 — 钅 a fourth time across the two sections. |
| 咖啡 | kāfēi | coffee | koffie | 2 | Band 3, ranks 2,620 and 2,581. ⿰口加 and ⿰口非: the *semantic* read fails, the phonetic read works (非 fēi → 啡 fēi), and 口 on a rare character flags a transcription. |
| 茶 | chá | tea | thee | 2 | ⿱艹⿱人木, rank 851, band 1. `茶楼` teahouse, `奶茶` bubble tea. |

**Fascias are the one place in this product's sign inventory where traditional characters legitimately appear.** Mainland language law permits 繁体字 in enumerated cases including handwritten signboard lettering and calligraphy, and fascias favour exactly that. The template renders a brush or heavy display face and may show the traditional variant — the only one allowed to.

**Never generate that column character-by-character.** Correct simplified-to-traditional mapping is word-level: a per-character pass silently produces 理發 and 面館, because 发 maps to both 發 and 髮 and 面 to both 面 and 麪/麵. The lint rule flags any item containing 面 干 发 后 里 松 只 几 表 系 术 — all eleven verified one-to-many.

**One general rule, from the same failure.** Components are stored per item, never recovered by substring match on a rendered string. Two cases prove it. The 阝 in 院 (mound, 阜) and the 阝 in 邮 (settlement, 邑) are different components at the *same* codepoint, so a match cannot separate them and the store must be authored by hand. Conversely the meat radical in 肝 肠 肚 腰 脑, which the menu strand needs, is **⺼ U+2EBC** — verified in all five — and *not* 月 U+6708: matching on 月 misses every one while wrongly catching 期, 朋 and 服. Nothing here keys highlighting off 月, and the one substring-sensitive rule, the lint list, matches whole characters, which is safe.

**Domain weight: 20%. Ordering: judgement.** Shopfront fascias are unregulated for language and overwhelmingly Chinese-only outside tourist strips — unlike transit, no bilingual fallback — but this weight has no empirical basis either. A v1 guess, to be instrumented.

---

### Corrections applied

Checked by script. **Verified and unchanged:** all 36 decompositions, all 31 ranks, every pinyin reading and tone mark, 检/檢 at 11/17 strokes, 饣 43 against 食 12, the 奂 and 则 series, 弟→递, 西/酉 at 6 against 7, and all eleven lint characters as one-to-many. Changed:

- **藥 is 19 strokes, not 17**; **HSK 3.0 has nine levels, not eleven**; **"44 shopfront characters" is 46** (the eight outside the top 1,500 were right, and now carry ranks); **洗手间's "all three characters top-160" is false** — **洗 is rank 1,376**.
- **"Every metro-core character is early-band" is false**: 线 首 程 台 are band 3 and **乘 is band 5, rank 1,238**, so 换乘 ships 乘 as a character card first. Relatedly, **"this split *is* measured"** overstated a wordlist lookup, and HSK bands describe the syllabus, not a Dutch visitor who is not an HSK candidate.
- **广 does not recur in 厂房** — 厂 U+5382 against 广 U+5E7F, and 广 = ⿱丶厂 contains 厂. Replaced with 床, kept as a foil. **入 "rare enough" to be mistaken for 人** contradicted the rank 188 beside it: the confusion is graphic.
- **The seat grid's "eight readable signs, the best ratio in the curriculum"** is four signs from four characters, contradicting 票 and 店 at 6:1. **"Variant mapping is word-level rather than character-level" was backwards** — word-level mapping is what *prevents* 理發 and 面館.
- **⺼ U+2EBC confirmed** in all five of 肝 肠 肚 腰 脑, 月 U+6708 in 期 朋 服; nothing here keys off 月, and the 阝 note is promoted into a general no-substring-match rule.
- **馆/饣 was a non sequitur** — a radical count cannot license "馆 predicts food", and the entry contradicted itself two clauses later. **艮 and 甫** drop to shape cues, and **咖啡** inverts: the semantic read fails, the phonetic read is exact.
- **Fabricated numbers cut** ("twelve characters", "under a minute", "halve the exit-choosing problem") and superlatives softened. **GB 2894 pulled** as not the emergency-exit standard. **付费区 "not picturable"** was false. **Floors**: British English shares the off-by-one. **Head-final rule** restated over morphemes, which its own table contradicted.
- **5% weight versus consequence resolved** by exempting 检票时间, 付费区 and 开往, with the same no-empirical-basis flag as the 20%. **"Ordering: corpus-grounded" for transit** is relabelled judgement-on-consequence, and **"illocutionary force"** is replaced by the actual argument: the template is the retrieval cue at test time.

## 7.5 Universal signage

This strand is the one that pays across all five domains at once. A cooking-method character earns its keep only on a menu; 出 earns it on a station plate, a car-park barrier, a shop door, a lift panel and a supermarket aisle on the same afternoon. That is the argument for putting it first, and it is not a frequency argument — §7's grounding note applies with full force here. General-corpus character frequency is the wrong ordering key for signage, and the checkable version of that claim is this: of the top 50 characters in the frequency list (12,010 entries), 11 appear anywhere in this section's inventory — 一 人 有 中 上 个 年 时 出 下 后. The other 39 are grammatical machinery — 是 了 不 在 大 和 为 这 他 的 我 会 以 到 要 — which public signage omits by construction. Where corpus rank happens to agree with signage priority I say so; where it does not, the ordering is judgement and is labelled as such.

### 7.5.1 The colour and shape system, taught before any character

**[judgement]** — nothing in a character-frequency corpus can order this, because it contains no characters. It goes first because it is the only part of the curriculum where the player gets the illocutionary force of a sign *before* decoding anything, and because it is cheap: four rules, learned in under a minute, that work on signs whose characters are years away.

GB 2894 《安全标志及其使用导则》 defines a four-category system whose colour/shape geometry corresponds to ISO 3864 (ISO 7010 registers the graphical symbols that sit inside those shapes; it does not define the categories). Ships as `itemType: 'colour'` — no glyph on the card, four meaning-side options, exactly like every other item.

| hanzi | pinyin (tone marks) | English | Dutch | tier | why it earns its place |
|---|---|---|---|---|---|
| 禁止 | jìnzhǐ | prohibition — red circle, diagonal bar | verbod — rode cirkel met streep | 0 | Red forbids. The shape carries the whole message; the characters under it are confirmation, not information. |
| 警告 | jǐnggào | warning — yellow triangle, black border | waarschuwing — gele driehoek | 0 | Yellow warns. Distinguishing "you may be hurt" from "you may not do this" is the highest-value discrimination in the bank. |
| 指令 | zhǐlìng | mandatory — solid blue circle | gebod — blauwe cirkel | 0 | The one category Europeans systematically misread as informational. Blue is an order. |
| 提示 | tíshì | notice, safe condition — green square | aanwijzing — groen vierkant | 0 | Green is where safety *is*, not where danger is. Sets up 安全出口 below. |

Two rulings attach here. First, **the colour lives on the plate, never on the glyph.** §5's prohibition on tinting any part of a character stands unchanged, and it stands on design grounds: the card must show what the sign shows — a red disc with black characters on it. The one Chinese-specific study of colour-marked radicals found slower learning and lower accuracy; that is consistent with the ruling but is a single result and does not carry it. The ruling holds either way, and this section is not a licence to reintroduce glyph tinting.

Second, **scope honesty:** the GB 2894 and GB/T 10001 standard texts were not retrievable (openstd.samr.gov.cn returned 403). Nothing here is confirmed against the standard. The category names, shapes and colour assignments come from secondary sources and are consistent across them, but the colour coordinates are approximations and the ISO correspondence above is likewise unverified against the standard text. Ship the approximations, flag the field `colour_spec_verified: false`, and do not print a hex value as if it were the standard.

The consequence that most often surprises a first-time visitor: **the emergency exit sign is green and reads 安全出口 ānquán chūkǒu, not 出口.** 出口 on a blue or black plate is simply the way out of the station.

### 7.5.2 The prohibition and hazard openers

**[judgement]** — corpus rank would defer this whole block: 禁 sits at 947, 止 at 735, 危 at 998, 险 at 866, and 勿 at 2,838 of 12,010. In running text those are mid-frequency characters; in the signage register they are near-ubiquitous, because public Chinese signage is a predominantly telegraphic idiom — imperative or nominal, subjects and function words mostly dropped, aspect marking rare. It is not absolutely free of 的 or of second-person forms (您 turns up in longer notices), so the register is a strong tendency, not a grammar. Ordered by illocutionary force, strongest first, because the ladder is what makes them memorable as a set.

| hanzi | pinyin (tone marks) | English | Dutch | tier | why it earns its place |
|---|---|---|---|---|---|
| 严禁 | yánjìn | strictly forbidden | streng verboden | 1 | Top of the force ladder; 严 (rank 600) recurs in 严禁烟火. |
| 禁止 | jìnzhǐ | prohibited | verboden | 0 | The default prohibition opener. Learn it and the following two characters become predictable: 禁止吸烟, 禁止通行, 禁止停车, 禁止拍照. |
| 请勿 | qǐngwù | please do not | gelieve niet | 0 | The polite register. Same force as 禁止 in practice — a traveller who reads 请勿 as a suggestion is wrong. 勿 appears almost nowhere else, which is exactly why it is unambiguous once known. |
| 注意 | zhùyì | attention | let op | 1 | Heads a hazard without naming its severity. 注 = ⿰氵主. |
| 小心 | xiǎoxīn | be careful, mind | voorzichtig, pas op | 0 | The most common hazard opener on the ground: 小心地滑, 小心台阶. 心 is rank 86 and 小 rank 87, so the cost is near zero. |
| 当心 | dāngxīn | beware | pas op | 1 | The 小心 variant used on formal yellow triangles: 当心碰头. Same slot, different register. |
| 危险 | wēixiǎn | danger | gevaar | 0 | The word the yellow triangle is usually spelling out. Pairs with §7.5.1's warning category so the colour and the characters teach each other. |

### 7.5.3 The opposite pairs

**[corpus-grounded for most of the block]** — 上 (14), 出 (26), 下 (38), 后 (41), 开 (91), 前 (93), 外 (109), 关 (122), 内 (131), 入 (188) are all inside the first 200 characters of the corpus, so ordering and frequency agree without argument. **[judgement]** for 拉 (410), 推 (503), 左 (572), 右 (652), 满 (504), 空 (347), 免 (768), 收 (383), 营 (550), 休 (1,148): these are placed by encounter rate at eye level, not by corpus rank.

Authored as **one card with two halves, never two cards.** This is a judgement, and the licence is the sign environment, not the interference literature: these two signs occur in the same visual scene — the same door, the same board, the same barrier — so telling them apart *is* the task, and a card that presents one alone tests something the street never asks. The similarity-and-interference literature does not settle the question either way (the similarity/difficulty function is reported as non-monotonic for strongly pre-associated sets, which is a reason not to assume the pairing is harmful, not evidence that it helps), so it is cited here only as not forbidding the design. It remains the single place where two form-adjacent items are introduced together, and it does **not** license the same treatment for 人/入 or 公斤/斤, which remain staged.

| hanzi | pinyin (tone marks) | English | Dutch | tier | why it earns its place |
|---|---|---|---|---|---|
| 入 / 出 | rù / chū | in / out | in / uit | 0 | The pair that becomes 入口 and 出口. 出 = ⿱屮凵 (a sprout above a container), 入 is a single wedge — the authored contrast formula is required content, not flavour. |
| 开 / 关 | kāi / guān | open, on / closed, off | open, aan / dicht, uit | 1 | Doors, switches, taps, appliance panels, and the 开门/关门 announcement on every metro. |
| 推 / 拉 | tuī / lā | push / pull | duwen / trekken | 0 | Both ⿰扌 (hand). The most-used pair in the bank measured by daily door count, and the cheapest to get wrong in public. |
| 上 / 下 | shàng / xià | up, board / down, alight | omhoog, instappen / omlaag, uitstappen | 0 | Floors, escalators, boarding. 上 is rank 14; the pair carries into 上午/下午 in §7.6. |
| 左 / 右 | zuǒ / yòu | left / right | links / rechts | 1 | Directional plates and platform-side arrows. Weak corpus rank, high sign rank. |
| 前 / 后 | qián / hòu | front, ahead / back, behind | voor / achter | 1 | Carriage position, queue direction, 前方施工. |
| 内 / 外 | nèi / wài | inside / outside | binnen / buiten | 1 | 内 is HSK-3 band and rank 131; the pair governs 室内/室外 seating and smoking. |
| 免费 / 收费 | miǎnfèi / shōufèi | free / chargeable | gratis / betaald | 1 | Toilets, luggage lockers, Wi-Fi, car parks. Both carry 费 (⿱弗贝) — 贝, the shell/money component, and its first appearance in this section's ordering. |
| 营业中 / 休息 | yíngyè zhōng / xiūxi | open for business / closed, on break | geopend / gesloten, pauze | 0 | The shopfront status pair. 休息 is not "rest" here; it is the sign on a restaurant between lunch and dinner. 息 has citation form xī and is toneless in this word — store the word reading, not the character reading. |
| 停业 | tíngyè | closed down, ceased trading | gesloten (permanent) | 2 | The third state, distinguished from 休息 because the consequence differs — one is worth waiting for. |
| 满 / 空 | mǎn / kōng · kòng | full / vacant, empty | vol / vrij, leeg | 0 | Car-park boards and toilet cubicles. **Heteronym flag:** 空 is kōng as "empty" (空车, an available taxi) and kòng as "vacancy" (空位). Store `pinyin` on the item, not on the character. 满 = ⿰氵⿱艹两: the 两 shape sits at the bottom of the right-hand component and is a simplification artefact of 㒼 (traditional 滿 = ⿰氵㒼). Useful as a shape hook for §7.6, never as a meaning cue. |
| 有人 / 无人 | yǒu rén / wú rén | occupied / free | bezet / vrij | 1 | The other cubicle convention. 有 is rank 7, 人 rank 3, 无 rank 145 — this pair is nearly free. |
| 男 / 女 | nán / nǚ | men / women | heren / dames | 0 | Taught as a pair and never in isolation, because the failure mode is a discrimination failure, not a recall failure. 男 = ⿱田力 (field over strength) is one of the few honestly transparent compounds in the head of the bank. |

## 7.6 Numbers, money and measure words

### 7.6.1 The numerals

**[corpus-grounded, with one correction to the ordering claim]** — 一 is rank 1; every character 一 through 十 falls inside the first 660 (the laggard is 七 at 654), and 万 (199), 元 (211), 百 (320), 千 (439) are all top-450. All sixteen items are HSK band 1 or 2. But the table below is **not** ordered by frequency and cannot be: frequency order would put 两 (113) and 万 (199) ahead of 四 (239) and 百 (320), and 零 (1,352) is nowhere near its place here. The block is ordered by **place value ascending**, which is the structure of the system itself; corpus rank, HSK band and signage priority all corroborate that the block belongs early, and none of them produces its internal order.

| hanzi | pinyin (tone marks) | English | Dutch | tier | why it earns its place |
|---|---|---|---|---|---|
| 一 二 三 四 五 六 七 八 九 十 | yī èr sān sì wǔ liù qī bā jiǔ shí | 1–10 | 1–10 | 0 | Prices, platforms, floors, bus numbers, dates. 一 has three sandhi readings (yī/yí/yì) — store the token reading, teach the citation form. |
| 零 / 〇 | líng | zero | nul | 1 | 〇 U+3007 is not the digit zero and is what actually appears in 二〇二六年. Both forms must render. |
| 百 | bǎi | hundred | honderd | 1 | ⿱一白. Below the myriad break, so it behaves as a European reader expects. |
| 千 | qiān | thousand | duizend | 1 | ⿱丿十. Last unit before the break. |
| 万 | wàn | ten thousand | tienduizend | 1 | **The genuine obstacle.** Chinese groups by 10⁴, not 10³: 十万 = 100,000, 一百万 = 1,000,000. The failure mode is an order-of-magnitude error and it costs money. |
| 亿 | yì | hundred million | honderd miljoen | 2 | 10⁸. Property prices, news tickers, lottery boards. Low encounter rate, but it is the second myriad step and the system is incoherent without it. |
| 两 | liǎng | two (before a measure word) | twee (voor een maatwoord) | 1 | 二 counts; 两 quantifies. 两个 not 二个. Collides three ways — see §7.6.4. |

**Required compute item.** `itemType: 'compute'` with a generator: show 三万五千, ask for the Arabic numeral, distractors at 10× and 0.1×. It is un-skippable *within the numbers strand* — a player may reach it late, but may not clear the strand around it. That is a different constraint from the Tier-0 linearity in §7.7, and the two must not be conflated in the scheduler.

### 7.6.2 The financial capital forms

**[judgement, and deliberately anti-corpus]** — 壹 sits at rank 5,966, 贰 at 4,481, 叁 at 7,488, and none of the three appears anywhere in the HSK 3.0 character list. Ordering by frequency or by band would exclude them from a 1,500-character bank entirely. They are in on **consequence**: they appear on every banknote, bank slip, receipt, contract and 发票, in the one situation where misreading a number is expensive and there is a counter clerk waiting.

The ruling that keeps this honest: **a low-priority "bank counter" sub-deck — available, never blocking, never in the Tier-0 or Tier-1 due queue.** High consequence, low encounter rate is exactly the profile that belongs behind an opt-in, not in front of a player who has three weeks and wants to read a menu.

| hanzi | pinyin (tone marks) | English | Dutch | tier | why it earns its place |
|---|---|---|---|---|---|
| 壹 | yī | 1, capital form | 1, schrijfwijze op documenten | 2 | ⿱士⿱冖豆. A 100-yuan note reads 壹佰圆 — recognising this is the difference between reading a banknote and looking at one. |
| 贰 | èr | 2, capital form | 2, schrijfwijze op documenten | 2 | ⿹弋⿱二贝 — carries both the 二 it replaces and the money component 贝, the only capital form that is partly guessable. |
| 叁 | sān | 3, capital form | 3, schrijfwijze op documenten | 2 | ⿱⿱厶大三 — likewise contains its own 三. Mainland form; documents set in traditional type use 叄. After these three, 肆伍陆柒捌玖 follow the same logic and are deferred. |

Practical priority within the sub-deck: 壹 贰 叁, then 拾 佰 仟 圆. Those four are the units the amounts sit in and are worth more per character than 肆 through 玖.

### 7.6.3 Money

**[corpus-grounded]** — 分 (54), 元 (211), 角 (743), 块 (815), 毛 (644): all inside the first 900. The ordering problem here is not which characters, it is the **written/spoken split**, which no frequency list can express.

| hanzi | pinyin (tone marks) | English | Dutch | tier | why it earns its place |
|---|---|---|---|---|---|
| 元 | yuán | yuan (written) | yuan (geschreven) | 0 | What is printed on every price label and menu. ⿱二儿. |
| 块 | kuài | yuan (spoken) | yuan (spreektaal) | 0 | What the person at the till says. Same amount, different word — the single most common source of "I read the sign but did not understand the answer". |
| 角 | jiǎo | 0.1 yuan (written) | 10 cent (geschreven) | 2 | Survives on receipts and price labels ending in a single decimal. **Heteronym flag:** jiǎo here, jué in 角色 — token-level pinyin. |
| 毛 | máo | 0.1 yuan (spoken) | 10 cent (spreektaal) | 2 | The spoken partner to 角, exactly parallel to 元/块. |
| 分 | fēn | 0.01 yuan | cent | 2 | Effectively extinct as cash, still printed on itemised receipts. **Heteronym flag:** 分 is fēn and fèn (部分, 分量) — a genuine two-reading character, not merely polysemous. Also "minute" in §7.6.4, at the same fēn reading. |

¥ / RMB / CNY / 人民币 ship as recognition-only symbols on the price-label template, where the numeral is rendered large and the unit small — that is the real reading condition, and the whole difficulty is that the unit character is 8 px next to a 40 px number.

### 7.6.4 Dates, times and measure words

**[corpus-grounded for the date/time set]** — 年 (18), 时 (24), 日 (79), 月 (143), 点 (172), 号 (337), 半 (448) are all top-450 and all HSK-1 band. **[judgement for the measure words]**, because the ones you need to transact are not the frequent ones: 个 is rank 16 but 碗 is 1,621, 瓶 1,818, 杯 1,232 — and you cannot order a bowl of noodles with 个.

**Ruling on 月.** The 月 taught here is U+6708, the moon/month character. The visually identical left-hand component of 肝 肠 肚 腰 脑 is a *different codepoint*, ⺼ U+2EBC (CJK RADICAL MEAT) — verified: all five decompose as ⿰⺼… with radical ⺼ and semantic hint "flesh", and none contains U+6708. No component index, hint, highlight or search in this product may be keyed off a substring match on the rendered shape; matching is on codepoint against the stored decomposition only. The 月 item and the body/organ items must never be cross-linked, and 月's own second dictionary reading (rù) must not be surfaced.

| hanzi | pinyin (tone marks) | English | Dutch | tier | why it earns its place |
|---|---|---|---|---|---|
| 年 月 日 | nián / yuè / rì | year / month / day (written) | jaar / maand / dag (geschreven) | 1 | 2026年8月22日. The written date order is big-to-small and never ambiguous — unlike 08/09, which is. |
| 号 | hào | day of month (spoken); number | dag (spreektaal); nummer | 1 | 日 written, 号 spoken — the same split as 元/块. Also the "number" on doors, platforms and bus stops. |
| 时 | shí | o'clock; time | uur; tijd | 1 | 营业时间 09:00–22:00. Signage times are 24-hour and numeric, so 时 is read more than it is calculated. |
| 点 | diǎn | o'clock (spoken) | uur (spreektaal) | 1 | 三点半 = 3:30 — the characters do not say morning or afternoon, and the player must get that from context. Pairs with 半. |
| 半 | bàn | half | half | 1 | Half past; also 半份 (half portion) and 半斤 (250 g) in the market and menu strands. One character, three strands. |
| 个 | gè | general measure word | algemeen maatwoord | 0 | Rank 16. The fallback that is never wrong enough to fail a transaction, and the first thing to teach so the player can transact before learning the rest. |
| 位 | wèi | person (polite); per person | persoon (beleefd); per persoon | 1 | 几位? at every restaurant door, and 位 on a menu means per-head pricing. |
| 份 | fèn | portion, serving | portie | 1 | 大份 / 中份 / 小份 / 半份. Confusable with 分, which supplies its phonetic — and note that tone does **not** separate them, since 分 itself reads fèn in other words. They sit next to each other on menus; teach the job, not the tone. |
| 杯 | bēi | cup, glass | kopje, glas | 1 | Drinks. ⿰木不. |
| 碗 | wǎn | bowl | kom | 1 | Noodles, rice, congee. Rank 1,621 and indispensable — the clearest single case against frequency ordering in the bank. |
| 瓶 | píng | bottle | fles | 1 | Water, beer, sauce. Also a shelf-label unit. |
| 张 | zhāng | flat things — tickets, cards, tables | platte dingen — kaartjes, tafels | 1 | 一张票. The measure word that gets you through a ticket window. |
| 只 | zhī | animals, one of a pair, some containers | dieren, één van een paar | 2 | Note the reading: zhī as a measure word, zhǐ as "only". Two distinct traditional characters (隻 and 只) merged into one simplified form — token-level pinyin again. |
| 件 | jiàn | garments, items, matters | kledingstukken, artikelen | 2 | 第二件半价 — second item half price. Retail, not conversation. |
| 双 | shuāng | pairs | paar | 2 | Shoes, chopsticks, socks. ⿰又又. |
| 条 | tiáo | long thin things — fish, streets, trousers | lange dunne dingen — vis, straten | 2 | 一条鱼 on a market board. |
| 斤 | jīn | catty = 500 g exactly | pond = 500 gram | 0 | Cross-referenced from the market strand: loose produce is priced 元/斤 almost everywhere, so 12.8元/斤 is 25.6 元/kg. Dutch has an exact everyday word here and English does not. |
| 两 | liǎng | 50 g (one tenth of a 斤) | half ons (50 gram) | 1 | The three-way collision: "two of something", "50 grams", and the shape at the foot of 满's right-hand component. Introduce the quantifier sense first, the weight sense in the market strand, and the shape never as a meaning cue. |

## 7.7 Tier summary

Tiers 0–2 are the **authored spine** — the ordered head of the bank, whose sequence is fixed by this section. The remainder of the 1,500 characters and 1,200 multi-character items is Tier 3: no fixed order, drawn by the scheduler from the due queue. Only Tier 0 is linear and unskippable. Matches deal from Tiers 1 and 2 while the spine is being built, and from Tier 3 as well once the spine is consolidated.

| tier | items | new characters | ordering basis | what the player can do at the end of it |
|---|---|---|---|---|
| **0** — first session, single-player, no betting, no timer, ~12 min | ~24 **[J]** | ~60 **[J]** | Judgement — consequence-ordered, explicitly against corpus rank | Tell a prohibition from a warning by colour and shape with no characters read; find the correct toilet door; leave a station through the correct opening; open a door the right way; tell a shop that is open from one on a break; say what 12.8元/斤 costs per kilo. |
| **1** — survival core, dealt in matches | ~110 **[J]** | ~180 **[J]** | Mixed — numerals, dates and the opposite pairs corpus-grounded; openers, status pairs and unit measure words judgement | Read a metro exit sign end to end; read a shelf-edge price label including unit and discount; decide from a production date plus a duration whether a packet is still in date; read opening hours off a shopfront including 周一至周五; order a portion size by name; read a hazard board and act on it. |
| **2** — extended set, dealt in matches | ~200 **[J]** | ~320 **[J]** | Judgement throughout — encounter rate and consequence, not frequency | Read a full menu column top to bottom including 时价; read a rail ticket's seat class; read an allergen and nutrition line; read a 100-yuan note's capital numerals and a bank slip's amount. |
| **3** — remainder of the v1 bank | ~2,366 | balance of 1,500 | Scheduler-driven; no authored sequence | Not a capability tier. It is the long tail the due queue draws from once the spine is consolidated. |

Spine total ≈ **334 items** of the 2,700-item v1 bank. Every count marked **[J]** is a planning judgement, not a measurement, and becomes a build-time count when the bank is authored. One partial check exists today: §7.5–7.6 enumerate **18 Tier-0 cards and 43 new characters**, so the ~24/~60 row assumes roughly six more Tier-0 cards and seventeen more characters from the menu and market strands. If those strands do not supply them, the row is wrong, not the enumeration.

The ~12 min is a **session budget for first exposure**, not a claim that 60 characters are learned in it — the consolidation rule below is what settles that, and the two must be quoted together or not at all.

Three rules govern how this table may be used in the product. **Never print a coverage percentage** derived from a general-text frequency list — the honest report has the shape "you can read 47 of the 120 signs in the metro set" (a format example, not a measured value), and §10's `signsActionable` metric is defined on exactly those enumerated signs. **Never predict a score.** And **tier is not mastery**: an item counts toward a tier only once `consolidated` is set, which requires a correct retrieval after at least one intervening night, so a player who clears Tier 0 in one evening has completed the session, not the tier.

---

### Corrections applied

Everything below was checked by script against `pinyin.txt`, `mmah.txt`, `charfreq.txt`, `stc.txt`, `tsc.txt` and `hsk30-chars.txt` (script at `/tmp/claude-0/-home-user-dohhh/4806d96a-ebd4-5774-9d7d-fe7e365865df/scratchpad/vfy75.py`, output at `vfy75_out.txt`).

**Passed unchanged, so recorded rather than edited:** every pinyin syllable and tone mark in the section (the only flag was 息 as `xi`, which is the intended neutral tone and is now stated as such); every corpus rank cited (禁 947, 止 735, 危 998, 险 866, 勿 2,838, 严 600, 上 14 … 入 188, 拉 410 … 休 1,148, 有 7, 人 3, 一 1, 万 199, 元 211, 百 320, 千 439, 壹 5,966, 贰 4,481, 叁 7,488, 分 54, 角 743, 块 815, 毛 644, 年 18 … 半 448, 个 16, 碗 1,621, 瓶 1,818, 杯 1,232); every decomposition (注 ⿰氵主, 出 ⿱屮凵, 费 ⿱弗贝, 满 ⿰氵⿱艹两, 男 ⿱田力, 百 ⿱一白, 千 ⿱丿十, 壹 ⿱士⿱冖豆, 贰 ⿹弋⿱二贝, 叁 ⿱⿱厶大三, 元 ⿱二儿, 杯 ⿰木不, 推/拉 ⿰扌); 内 = HSK 3; the date/time set = HSK 1; 壹贰叁 absent from HSK 3.0; every character in the section is a simplified-set form (none is a traditional-only key); and the arithmetic (12.8元/斤 → 25.6 元/kg, 十万/一百万, 半斤 = 250 g, 两 = 50 g = half a Dutch *ons*).

1. **Corpus size 12,009 → 12,010.** The file has 12,010 entries.
2. **"of the top 50 … four are in the survival set" → 11, enumerated.** The claim was false and understated; the top-50 overlap with this section's inventory is 一 人 有 中 上 个 年 时 出 下 后. The argument survives on the other 39 being grammatical machinery, which is now what carries it.
3. **§7.5.1 "the shapes and category names are confirmed" removed.** Self-contradicting: nothing can be confirmed against a standard that returned 403. Restated as consistent secondary sourcing, with the ISO correspondence folded under the same unverified flag.
4. **ISO 7010 → ISO 3864** for the colour/shape geometry; ISO 7010 registers the symbols inside the shapes.
5. **Colour-marking ruling re-based.** A single Chinese-specific study cannot license a standing prohibition; the ruling now rests on the design ground (the card must show what the sign shows) with the study as corroboration. The ruling itself is left absolute — no hedge added.
6. **§7.5.2 register claim softened.** "Function-word-free … no 的, no aspect marking, no pronouns" was categorical and false at the edges; now a stated tendency.
7. **注 "the first water-radical item most players meet" cut.** False under the section's own tiering: 满 (Tier 0, §7.5.3) reaches the player before 注意 (Tier 1).
8. **§7.5.3 pairing rationale rewritten.** A hedged interference finding ("may be non-monotonic") was doing the work of a firm ruling — the design bent to rescue itself. The licence is now the sign environment; the literature is cited only as not forbidding the design.
9. **满/两 relation corrected twice.** 两 is the *foot of the right-hand component*, not "the right half"; added that it is a simplification artefact of 㒼 (滿), which is why the no-meaning-cue rule bites.
10. **贝 "first appearance in the bank" → "in this section's ordering."** Unverifiable from this section; other strands may introduce 贝 earlier.
11. **§7.6.1 "ordered by frequency without further argument" removed.** The table is not in frequency order and cannot be — 两 (113), 万 (199) and 零 (1,352) all contradict it. Re-based on place value, with the three orderings as corroboration only. The "first 660" claim is retained and now names its laggard, 七 at 654.
12. **Compute-item scope disambiguated** against §7.7's "only Tier 0 is unskippable."
13. **Capital sub-deck priority made consistent:** 拾 佰 仟 圆 in both places (仟 was in the prose but missing from the list); added that 叁 is 叄 in traditional type, which matters for a document deck.
14. **角 heteronym flagged** (jiǎo/jué) — the section flags 空 and 只 but silently omitted this one.
15. **分 reclassified as a genuine heteronym** (fēn/fèn), not "heteronym-adjacent"; and the 份/分 entry no longer claims tone separates them, because 分 itself reads fèn.
16. **三点半 = 15:30 → 3:30.** The characters do not encode a.m./p.m.; the equality was invented.
17. **Ruling on 月 added** (§7.6.4). Confirmed by script: 肝 肠 肚 腰 脑 all decompose ⿰⺼… with radical and semantic ⺼ U+2EBC, and none contains 月 U+6708. Nothing in the text keys highlighting off 月, and the ruling now forbids ever doing so, matching on codepoint against the stored decomposition instead. 月's second dictionary reading (rù) is suppressed for the same reason.
18. **§7.7 Tier-3 contradiction resolved:** the intro said matches deal from Tiers 1–2 while the Tier-3 row said the due queue draws from Tier 3.
19. **Tier-0 counts made checkable:** §7.5–7.6 enumerate 18 cards and 43 new characters, so the ~24/~60 row now states the gap it is assuming instead of floating free.
20. **"~12 min" reconciled** with the consolidation rule, so the row can no longer be read as claiming 60 characters are learned in twelve minutes.
21. **"47 of the 120 signs" marked as a format example**, not a derived figure.
22. Minor: 小心's "top-90" claim now cites the actual ranks (心 86, 小 87); 无 (145) added to the 有人/无人 cost claim; "single most-used pair" softened to "most-used", which is all the door-count argument supports; 只's two traditional sources (隻/只) added as the reason for the reading split; 出's gloss changed from "enclosure" to "container" to match the decomposition source.

---

# 8. Dutch and English specifics

first, because this is contested and the digests say so explicitly.

**For Dutch (L1).** Two glossing meta-analyses point the same way: L1 glosses beat L2 glosses at Hedges' g = 0.33 (78 effect sizes, 26 studies, N = 2,189), clearest for **beginners** and **on immediate posttests**; a second (359 effect sizes, 42 studies, N = 3,802) finds glossed > unglossed and L1 > L2. Both graded **moderate** — abstract-only, no bias diagnostic — and g = 0.33 is a **small** effect.

Two corrections to how that evidence was presented in the earlier draft, both of which weaken it:

- **They are not two independent confirmations.** Twenty-six studies and forty-two studies drawn from the same small primary literature overlap heavily; overlapping meta-analyses re-analysing shared primaries corroborate far less than "two meta-analyses agree" implies. Read it as **two analyses over a heavily overlapping primary literature**, pointing the same way once.
- **The second moderator was quoted selectively, and it is a warning, not support.** "Clearest for beginners" was carried forward; "and on immediate posttests" was dropped. An effect concentrated on immediate tests is the signature of a **support effect that does not survive delay** — the gloss helps while it is on the page. Since every decision gate in this document runs at d7 or d28 (§10.4), the honest reading is that this evidence predicts approximately nothing about the outcome we actually measure. That is stated here rather than discovered later.

**For English (L2).** The L2 Status Factor is sometimes invoked to predict that English would be the privileged transfer source, on shared late-learned metalinguistic status. And one 2025 dissent reports both gloss languages at medium effect and argues learner preference can decide.

**The dissent, adjudicated rather than cited and dropped.** Preference is **not** admissible as the deciding criterion for a learning-relevant feature — that is §5.9, and consequence 9 below applies it. But the dissent has a real mechanism behind it that deserves an answer instead of silence: in a churn-limited product, a gloss language the player prefers may raise continued exposure, and exposure is the input to everything. **Ruling: preference is routed to the engagement family (§10.4), never to the learning family, and it decides nothing about the default.** It is why the user-facing toggle exists at all. The overrule is explicit, and this is the reason.

**What it turns on, and why neither side is strong.** There is **no study of Dutch–English bilinguals learning Mandarin.**

**[D] L3 transfer theory is silent here, and the earlier draft's use of it is withdrawn on both sides.** The L2 Status Factor and the Typological Primacy Model are models of **initial-state morphosyntactic transfer** in L3 acquisition. Neither predicts anything about which language a *translation equivalent* is printed in; nobody transfers a grammar when they read "pond" under 斤. The earlier text built the case for English out of the wrong literature and then defeated it with a rival model from the same wrong literature, and called that "defeated on its own terms," which a competing model is not. There is a genuine lexical cross-linguistic-influence literature (Williams & Hammarberg's supplier role, De Angelis on lexical CLI, with psychotypology as its moderator), but it concerns **production and borrowing**, not comprehension of a printed gloss, and it does not reach this decision either. *(Kept, narrowly: psychotypological distance still disposes of the English argument if anyone revives it — Mandarin is remote from Dutch and from English alike, so no proximity-based case for either survives. It is now a footnote, not a reason.)*

**The glossing literature's central limitation, restated so it is true.** The earlier text said "看不懂 has no text — it is context-free isolated cards," and consequences 3 and 4 below contradict it flatly by requiring a "where you would meet it" clause on the reveal. The wording was overstated and is corrected. The substantive argument survives in a narrower form, and this is where I keep a position the review attacked: **in the glossing literature the gloss is met while reading for comprehension, where sentence context constrains sense selection at the moment of encounter, and the gloss serves a goal outside itself. Here the gloss *is* the answer, and the only context the design supplies arrives on the reveal — after the choice is made.** That is a different task, and it is why the L1/L2 moderator does not transfer cleanly, whatever context the reveal carries.

**[D] The "multiple-choice gloss" sentence is deleted.** In the glossing literature a *multiple-choice gloss* is a gloss **format** — the reader picks the contextually correct sense from two or three offered — not this app's answer rows. Either way it cannot bear on the L1-vs-L2 contrast, because both languages share the format and format cannot confound language. What replaces it is the harder point that sentence hid: **if the glosses are the option rows, they are not glosses at all — they are the response set in a forced-choice recognition test** (see consequence 10 on test direction). The transported evidence is further from this product than the earlier draft admitted. This remains the weakest evidential link in the content cluster.

### The ruling

> **[D] Author both gloss languages and store `gloss: {nl, en}` on every item from day one. Render Dutch for `nl-*` locales, English everywhere else. Put the other language behind a tap on the answer side. Ship a single user-facing toggle.**
>
> **This is a two-language authoring budget, not a default to L1.** Outside `nl-*` the fallback is English, which for a German, French, Spanish, Japanese or Korean speaker is an **L2 gloss** — precisely the arm the g = 0.33 finding says loses. That cost is **accepted, not argued away**: we can afford to author two languages and not eleven, and English is the one that covers the rest of the addressable market.
>
> **No gloss-language A/B is promised, scheduled, or implied.** The earlier "instrument it as the product's first content A/B, because … your own data can" is withdrawn. See below.

**[D] Why the A/B is withdrawn rather than fixed.** The earlier draft made "your own data can" the load-bearing justification for the whole section and then specified a design that guarantees it cannot:

- Consequences 1 and 3 put **both** gloss languages on every reveal in both arms — one in the body, one a tap away — and at a mixed table the shared reveal renders in the host's language regardless of assignment. There are no arms. The manipulation collapses to *which of two simultaneously present glosses is in larger type*, which is not the construct either meta-analysis measured.
- "A player who switches leaves the analysis" converts intention-to-treat into per-protocol with differential, outcome-correlated attrition, in a product whose stated primary failure mode is churn (§12.2).
- Reason 4 below asserts the arms differ in **content quality** — the Dutch column carrying hazard qualifiers, units and worked conversions the English column does not. Even a clean contrast would then measure authoring effort, not gloss language.
- **[D] The arithmetic, since the earlier draft asserted feasibility without it.** Two arms, α = .05 two-sided, 80% power: n per arm ≈ 16/d². At d = 0.33 that is **≈147 retained to the delayed posttest per arm**; at d = 0.20, **≈400**; at d = 0.15, **≈711**. Those are *retained* counts, so enrolment must be a multiple of them at this product's churn. *(The review's "roughly 145" is right at d = 0.33; its "300–500 at the smaller effect" silently corresponds to d ≈ 0.20–0.23, not to the smaller effect this section actually predicts.)*
- §10.2 has exactly **two** A/B slots, both spoken for (plain rendering vs object templates; score visibility), with the `days_between_sessions` nudge already queued third. A gloss-language A/B was never in the slate, and claiming it as "the product's first content A/B" contradicts §10.2.
- Consequence 9 named "delayed accuracy at ≥1 week" as the admissible metric. **§10.1 demoted delayed accuracy to a calibration check** and made volume at criterion primary. The metric the earlier draft prescribed no longer exists in the form it prescribed it.

> **[D] Ruling: §12.1 #4 is rewritten. "Both fields authored from day one; A/B on delayed accuracy, not on preference" becomes "Both fields authored from day one; the default is decided by judgement and the question is closed for v1."** What is kept is one cheap observational hook: log `gloss_lang_rendered` on every exposure and `gloss_lang_switched_at` on every toggle, so that if a natural contrast ever appears it can be analysed **as an observational contrast with covariates, explicitly not as an experiment** — the same treatment §10.1 gives the public-failure question. **If a third A/B slot ever opens, §10.2's `days_between_sessions` nudge outranks this.** The conditions under which this could be revived as a real experiment are named so it cannot be revived quietly: single-language arms, no cross-language reveal, the toggle disabled for enrolled players until the d28 read fires, both columns authored to one spec by one author against the same lint rules, ITT with switching logged as an outcome, a pre-registered analysis, a stated MDE and a stated stopping rule, and an answer written in advance to "what if it comes back null."

Three reasons, **not ranked** — the earlier draft said "in order of weight" and then called the fourth reason "decisive," which is a flat contradiction on the page, and ranked first an item the same section calls the weakest evidential link in the cluster. The list is unordered and the word "decisive" is withdrawn.

1. **The only meta-analytic evidence points at L1, and points hardest at beginners** — exactly this population — but it also points hardest at immediate posttests, which is where it stops helping us. It is a small effect, measured on the wrong task, whose own moderator predicts it will not survive to d28. It is a **prior, not a finding**; a weak prior beats no prior, and it is not doing much work.
2. **[D] The decision to author both columns is a budget decision, and here is the budget.** The earlier draft said "the cost of being wrong is small and symmetrical, because the effect is small," which is a non sequitur — a small mean is fully compatible with a fat left tail, and reason 3's table asserts exactly that tail ("pound" is *wrong* at 454 g; "3rd floor" is *silently wrong* for a Dutch or British reader). **Effect size is not cost, the tail is asymmetric, and that sentence is deleted.** What survives is a different and simpler claim needing no evidence at all: retrofitting a second gloss language into a live bank is more expensive than authoring it now. And it is not free. **CC-CEDICT is English-only**, so the quarantined seed artefact seeds the **`en` column only**; §9.1 already files "all Dutch glosses" under *authored by us*, which means the entire Dutch column is hand-authored across §11.0's **2,700 items**. Scaling from §9.1's own costing (1,500 decompositions ≈ two person-weeks ≈ 3 min each) gives **≈2.5–3.5 person-weeks for a plain Dutch column, before the hazard rows**, which are several times slower each. *(**[D]** derivation stated; the per-item rate is carried over from §9.1's estimate and is itself an estimate.)* That is the number the "cheap" claim was hiding, and it goes in the plan.
3. **[D] A domain argument that is real, small, and now counted instead of asserted.** For a handful of unit terms, Dutch has an exact everyday word and English has none. The earlier draft called this "the decisive reason," offered "nobody in the research raised it" as a credential — which is equally a statement that the claim is **untested**, and it is our own invention, so it earns more scrutiny, not the top slot — and asserted that "this bank is dense with unit, quantity and floor-numbering traps" from ten hand-picked rows with no denominator. **The density claim is withdrawn.** What is left, enumerated exhaustively rather than sampled: **斤 → *pond*** and **两 → *half ons***, plus their compounds (半斤, 一斤半, 二两). Two unit terms. `公斤` → *kilo* works equally in both languages and is not a win. **The count of bank items touching those two terms is not knowable until the bank is authored: it is a build-time count (`items_with_exact_nl_unit_mapping / 2,700`), it goes in this document when it exists, and if it lands below ~5% this reason is a footnote.** Everything else in the table below is fixed by **authoring**, in either language — which the table's own last row already conceded, and which kills the other nine rows as arguments for Dutch.

### The domain argument, concretely

Corrected under review. Pinyin is now printed, because the earlier version of this table printed none at all in a document about reading Mandarin.

| Item | English gloss | Dutch gloss | What the row actually shows |
|---|---|---|---|
| **斤** jīn | "catty (500 g) — **not** a pound, which is 454 g" | **"pond (500 g) — op het vasteland. In Taiwan 600 g."** `hazard` | Dutch *pond* is exactly 500 g in Netherlands everyday usage, so **1 斤 = 1 pond** is an exact, zero-arithmetic mapping and English has no such word. **Corrected: this is mainland-only.** 1 台斤 = 600 g in Taiwan; the Hong Kong catty is 604.8 g. Shipped unqualified it fails silently the moment the learner is in Taipei — the same failure mode 3楼 is tagged for — so **the row that called itself the strongest instance now carries `hazard` too.** |
| **两** liǎng | "50 g (one tenth of a catty)" | **"half ons (50 g) — vasteland. Taiwan: 37,5 g."** `hazard` | Dutch *ons* = 100 g, so again exact and familiar, and again mainland-only (台两 = 37.5 g). |
| **3楼** sān lóu | **"floor 3 in Chinese counting — two above ground level. In the lift, press 3."** `hazard` | **"verdieping 3 in Chinese telling — bij ons de 2e verdieping. In de lift druk je op 3."** `hazard` | **Corrected, and the earlier row had it backwards.** "De tweede verdieping" hands the learner correct arithmetic and **wrong behaviour**: they are standing in a Chinese lift and must press **3**, and "tweede verdieping" is a number on no button in the building. Both columns must carry the **action**, both are tagged `hazard`, and neither language wins. (The English gloss "3rd floor" is correct for an American and wrong for a Dutch or British reader — which is an argument for authoring it properly, not for Dutch.) |
| **折** zhé | **"n折 = you pay n×10% of the price. 8折 = pay 80% = 20% off. 7.5折 = pay 75%."** | **"n折 = je betaalt n×10% van de prijs. 8折 = 80% betalen = 20% korting; 7,5折 = 75%."** | **Corrected — the earlier Dutch gloss hard-coded a number that is not in the character.** "Je betaalt 80% — dus 20% korting" is the gloss for **八折**, not for 折. 七五折 = pay 75%. As written the bank taught "折 = 20% off," which is wrong on every other discount sign in China. The English was wrong for the same reason, and "discount" is not the fix. Neither language wins; the *what you pay* framing does, in both. |
| **辣** là | "chilli-hot — not merely seasoned" | **"scherp/heet van chilipeper — niet 'pittig' in de kaas-zin."** | **Corrected: "Dutch *pittig* is tighter" was backwards and is deleted.** *Pittig* is at least as broad as "spicy" — *pittige kaas* is mature cheese, a *pittig karakter* is a forceful person. This row moves to the **neither-language-rescues-it** column. |
| **麻** má | "numbing (as in *málà*) — no everyday word" | **"niet scherp — je mond gaat tintelen en verdoven. Komt van Sichuanpeper (花椒 huājiāo). Geen alledaags Nederlands woord voor."** | **Corrected: "*no English word*" was false.** English food writing has a standard gloss — **numbing** — and Dutch has *verdovend* / *tintelend*. The honest claim is "no single **everyday** word in either language," which is what the row's own remedy already assumed. "Dit is geen hitte" was also odd Dutch (*hitte* is weather-heat) and is gone. The gloss now names **the cause**, which is what makes 麻 learnable and makes **麻辣 málà** teachable as a compound instead of two mysteries. And **"pittig" is still wrong** — that is 辣. |
| **能量** néngliàng | "energy, in kJ (÷ 4.2 ≈ kcal)" | **"energie, in kJ (÷ 4,2 ≈ kcal; 1 kcal = 4,184 kJ)"** | **Corrected notation.** "÷ 4,184" is correct Dutch decimal for 4.184 and collides with 4184 being the number of *joules* per kcal — a reader parsing it as an integer gets the right answer with the wrong model. Dutch labels carry kJ+kcal (EU 1169/2011) and the Chinese label is kJ-only per GB 28050, so a Dutch reader is *less* likely to misread than an American — but both columns still carry the unit and the conversion. |
| **素** sù | "vegetarian — but not reliable: often 蚝油 háoyóu or 高汤 gāotāng. Ask for **斋 zhāi** (Buddhist vegetarian, stricter)." | **"vegetarisch — maar niet betrouwbaar: vaak 蚝油 of 高汤. Vraag om 斋 (boeddhistisch vegetarisch, strenger — ook zonder 五辛)."** `hazard` | The qualifier is the content, in both languages. **Added: the gloss now names the fix, not only the problem.** 斋 is already in the bank's own flag list; connect them. |
| **饭店** fàndiàn | "restaurant **or** hotel — both" | **"betekent zowel restaurant als hotel"** | Equally awkward in both. Neither language rescues it. |
| **无障碍** wúzhàng'ài | "accessible, step-free" | **"toegankelijk, zonder drempels"** — *not* the narrower "rolstoeltoegankelijk" | The obvious Dutch gloss over-narrows and must be corrected. **Dutch is not automatically better; it is better when authored** — and that is true of every other row above. |

The last row is not a counterweight to be noted and set aside; **it is the finding**. The argument is not "Dutch is a better language for glossing Mandarin," and it is no longer "this bank is dense with traps where Dutch wins." It is narrower: **for two mainland unit terms, Dutch has an exact everyday word and English has none, so a Dutch reader is spared a translation step and an arithmetic step** — and everything else on the table is a hazard of lazy glossing, curable in either language by writing the gloss properly.

### Consequences that fall out of the ruling

1. **Per-player gloss language at one table.** Each phone renders the option rows in that player's own locale; the shared reveal renders the table's host locale. This is free because input is private anyway (§5.6), and a mixed Dutch/English table needs no compromise. **Stated as a cost, not hidden:** this is also the feature that makes any language contrast unrunnable at a mixed table, which is one more reason the A/B is withdrawn rather than promised.
2. **Locale matching is `nl-*`, with two limits written down.** Match the prefix, so `nl-NL` and `nl-BE` both get Dutch. **`nl` locale is not Dutch L1** — expats on Dutch-language phones are a known miss, and the toggle is their remedy. And the *pond*/*ons* argument is **Netherlands grocery usage**: *pond* is markedly less current in Flanders, so a Dutch-language ruling is partly carried by a Netherlands-specific fact. Both are accepted, both are stated.
3. **`lang` attributes are a build gate, and the accessibility claim is corrected.** `lang="zh-Hans"` on hanzi, `lang="nl"` or `lang="en"` on glosses, `lang="zh-Latn-pinyin"` on pinyin. **"Unusable with a screen reader" is withdrawn — it is an overstatement.** A missing `lang` degrades voice selection and pronunciation; many engines script-detect. What is accurate: it is a **WCAG 3.1.2 (Language of Parts, AA)** failure, incorporated by **EN 301 549 clause 9** — which binds through the Web Accessibility Directive (public sector) and the **European Accessibility Act, Directive (EU) 2019/882**, for covered services, and **a free consumer game may fall outside both**. The gate stands on its merits; the compliance hook is stated at its real strength.
4. **[D] Gate 7 is restated as a codepoint rule, because as worded it passes this section's own hazard glosses.** `"vegetarisch — maar niet betrouwbaar: vaak 蚝油 of 高汤"` is a single `lang="nl"` element containing bare hanzi in no element of its own — so there is no "hanzi element" to fail, and the string is exactly the 3.1.2 violation the gate exists to catch. **Amend §9.3 gate 7 to: any CJK codepoint (U+3400–U+4DBF, U+4E00–U+9FFF, the Ext-B+ planes and U+F900–U+FAFF) whose nearest ancestor `lang` is not `zh-*` fails the build; any gloss element without a `lang` attribute fails the build; any pinyin without `lang="zh-Latn-pinyin"` fails the build.**
5. **Both glosses appear on the reveal, always** — the rendered one in the body, the other behind a tap. **Kept, with the disagreement stated:** the review is right that this destroys an A/B, and wrong that it is therefore a defect. Once the A/B is withdrawn, a second gloss behind a tap costs nothing and helps a mixed table, and the reveal already carries both for the confusable table's "where you would meet it" clause.
6. **[D] Gloss lint rules, corrected.**
   - **The ~120-character cap is withdrawn — it was derived from nothing and it binds unequally**, since Dutch expands relative to English and the Dutch column is the one carrying hazard qualifiers, units and conversions. *(The review supplies "10–20% longer" as the expansion figure; that number is itself unsourced and is not adopted — the mechanism is, the figure is not.)* **Replace with: option-row glosses cap at two rendered lines at the shipping option-row type size on a 360 CSS-px viewport, measured per language, enforced as a render assertion on the machinery gate 8 already uses.** 360 px is the narrowest Android device width we support, which is the derivation.
   - **The cap applies to the option rows only.** Hazard qualifiers, units and worked conversions live on the **reveal**, which has no line cap — which is how the 素 gloss and its "where you meet it" clause both fit.
   - **Rename `no_single_word_equivalent` → `requires_explanatory_clause`**, because "no single word exists" and "a single word is not enough here" are different claims and the rule enforces the second. Under the old name and the old list it would have **rejected the correct gloss** for at least one member.
   - **时价 shíjià comes off the list** — Dutch **dagprijs** is one everyday word and English "market price" is the standard menu term of art.
   - **无座 wúzuò and 鲜 xiān stay on, under the new name and with reasons.** Dutch *staanplaats* is a single word, but it carries no rail-ticket frame for a Dutch reader (NS sells no standing tickets), so the concept transfers and the situation does not. And 鲜 is polysemous across *fresh* (新鲜) and *savoury/umami* (鲜味), so **umami** under-covers it in both languages. The review is right about the flag's name and half right about its membership.
   - **New `confusable_with` sets, from the same pass:** 时价 shíjià / **市价 shìjià** (form and near-homophone), 涮 shuàn / 刷 shuā, 拌 bàn / 伴 bàn / 绊 bàn.
   - Require a "where you meet it" clause on every member of a `confusable_with` set. Require a unit and a worked conversion on every `compute` item.
   - **[D] A gloss register spec, added — previously missing, and load-bearing once the gloss carries the hazard.** The Dutch column as drafted mixed noun phrases ("pond"), second-person sentences ("je betaalt 80%") and meta-commentary ("Er is geen Nederlands woord voor"). Rule: **option rows are noun phrases; reveal glosses lead with the noun phrase, then a second-person action sentence where an action exists, then meta-commentary last and only where a word genuinely does not exist.** Both columns follow the same spec, authored by one author.
7. **[D] 无座 is in scope, and the question is already answered elsewhere in this document.** §11.6's city packs and §12.1 #12 (无座 pricing on G/D services, unverified because all `.cn` hosts were unreachable) both treat transit as v1 content. It is not an orphan row in a menu bank; the bank is menus, labels, signage **and transit**.
8. **The "point at this" screen ships in both languages** and is always accessible, at large type, unscored, outside the game loop: 不要香菜 (bùyào xiāngcài, surface *búyào*) · 不辣 (bù là, surface *bú là*) · 微辣 (wēi là) · 我不吃猪肉 (wǒ bù chī zhūròu) · **我对花生过敏，包括花生油** (wǒ duì huāshēng guòmǐn, bāokuò huāshēngyóu).
   - **[D] Corrected, and this is the strongest `hazard` in the section — stronger than 3楼.** 我对花生过敏 covers the nut and not the oil, and Chinese kitchens cook in 花生油. The card must read **我对花生过敏，包括花生油**.
   - **[D] Added, because more characters are not the whole fix:** a card cannot address cross-contamination in a shared wok, and the screen must not be presented as if it can. It carries one line of scope in the player's own language — *this is a phrase card, not a medical safeguard* — and the allergy card is never scored, never gamified, and never behind progression.
   - For a learner avoiding pork on religious grounds, the operative word in China is **清真 qīngzhēn** (halal), and it belongs on this screen. 我不吃猪肉 stays and is correct.
9. **[D] The `vwo_400` and `hsk3_band` columns are two integers, and the school channel is out of scope — corrected to match §8, which this section had reverted.** Chinese is a Dutch VWO subject examined **only as a schoolexamen** (no centraal examen), with PTA tests structurally based on HSK and requiring active mastery of **400 characters**. Tag every item `vwo_400` and **`hsk3_band`** — *the earlier `hsk_band` was field-name drift, and a CI gate cannot check a column whose name changes between sections.* The columns buy a **filtered deck** for individual Dutch learners and keep a school SKU cheap to build later. They do **not** buy a distribution channel: **"two columns for a wedge into a small, enumerable list of Dutch schools" is withdrawn**, per §8's ruling, which this section had silently reinstated. §8's two obstacles apply here and were omitted: **the trademark ruling and the wedge point in opposite directions** — consequence 10 below forbids the letters "HSK" in store metadata, and "HSK" is the exact string that makes the deck legible to a buyer whose PTA is built on it — and **GDPR Art. 8 / UAVG-16**, since most of the cohort cannot consent for themselves and a school deployment makes us a processor. *(Graded moderate: slo.nl was egress-blocked, the start year is unresolved, and the per-skill CEFR targets are unverified. **Kept against the review:** the schoolexamen-only structure *is* load-bearing, and here is the load — because there is no centraal examen there is no national syllabus to align the filtered deck to, which is why the PTA's HSK-based 400-character figure is the only anchor available. **One email to SLO settles all of it**, and it should be sent before anything ships against it.)*
10. **Neither gloss language ever displays a level label.** No CEFR letter anywhere in the UI — contested and uncomputable. **The letters "HSK" never appear in UI or store metadata** (binding from §9.2); `hsk3_band` is an internal integer and the player-facing bands get our own vocabulary. The exposure is **trademark, not copyright**. **[D] Scoped, because the earlier text asserted the absolute rule without arguing it:** the ban is **stricter than trade mark law requires** — referential use to indicate a product's intended purpose is broadly permitted under **EUTMR Art. 14(1)(c)**, subject to honest practices and no implied affiliation. It is a **risk-tolerance choice, not a legal necessity**, its cost is recorded in §8, and it is relitigated there or nowhere.
11. **[D] Glosses seed from CC-CEDICT as a quarantined build artefact — corrected in scope and in citation.** `/assets/gloss.cedict.json` under CC BY-SA 4.0 with `LICENSE-CC-BY-SA-4.0.txt` beside it, never inlined into the JS bundle (gate 14). **The seed covers the `en` column only — CC-CEDICT is English-only — so the `nl` column has no seed and is 100% ours** (§9.1's "authored by us" row), which is what makes reason 2's budget real and what limits gate 14's leak surface to English keys.
    - **The licence pin was wrong and is fixed.** In **CC BY-SA 4.0**, §2(a)(5) runs A "Offer from the Licensor – Licensed Material", B "**Additional offer from the Licensor – Adapted Material**", C "**No downstream restrictions**" — and **C** is what contains "or apply any Effective Technological Measures to." The (B) numbering belongs to plain **CC BY 4.0**, which has no Adapter's-License clause pushing it down. **Correct cite: §2(a)(5)(C)** — and **the clause that actually reaches our derived gloss table is §3(b)(3)**, the ShareAlike ETM prohibition on *Adapted Material*, since the derived table **is** an adaptation. **This must also be fixed at `/home/user/dohhh/docs/DESIGN.md:99`, which carries the same wrong cite**, and re-checked against whichever version the pinned CC-CEDICT build declares — **BY-SA 3.0's equivalent is §4(a)**, a third numbering.
    - **"ShareAlike discharged once at build time" is wrong and is withdrawn.** §3(a) attribution and §3(b) ShareAlike are conditions on **every distribution** of the adapted material. The people owed attribution, the licence URI and the Adapter's License are **the people who receive the app**, not the people who visit GitHub. **§9.3's in-app `/licences` route is what satisfies the notice duty; gate 14 protects the bundle boundary and discharges nothing.** Both are required, and publishing the derived file in the repo is convenience, not compliance.
    - **[D] Sui generis database rights, previously omitted entirely.** CC-CEDICT is a database and we are a Dutch publisher. **BY-SA 4.0 §4** provides that where SGDR applies, including a substantial portion of the contents in a database in which *you* hold SGDR makes that database Adapted Material **for the purposes of §3(b)** — ShareAlike. **Refinement on the review:** §4 engages only if SGDR subsists in the source, and under Directive 96/9/EC Art. 11 the sui generis right accrues only to EU-connected makers, so **MDBG's establishment is a fact we must check and is now an open item**. Either way the answer is the same — the derived gloss table is Adapted Material under copyright and §3(b) applies — but the route decides whether our own derived database can carry a separate SGDR claim. **For a Dutch publisher this is a more live clause than the DRM one**, and the earlier text discussed DRM at length and §4 not at all.
    - **"Stay a PWA" is withdrawn — it reverts a ruling this document already made.** §9.3: *"licensing does not by itself decide the platform … the argument for the PWA is architectural and geographic, not legal."* The correct binding text is: **the gloss layer is served as separately-fetched, non-DRM'd files, which §9.1 already mandates, so §2(a)(5)(C), §3(b)(3) and Arphic PL §5 are satisfied and the platform is decided on its own merits.** And the reason §9.3 *does* give was dropped and is restored: on iOS an `.ipa` resource sits inside the FairPlay container, so an App Store build would need a **first-run network fetch from a host we operate**, colliding with §11.2's offline-from-install guarantee and re-opening mainland reachability (§12.1 #9).
12. **[D] Instrumentation, rewritten to the metrics that actually exist.** Gloss language is a *learning-relevant* feature, so §5.9 binds: it may not be settled on preference, perceived helpfulness or in-session accuracy. But **"delayed accuracy at ≥1 week" is not the admissible metric — §10.1 demoted delayed accuracy to a calibration check.** What is reportable, if this is ever measured at all: **volume at criterion (FSRS stability > 21 days) at weeks 8/16/24 with its calibration check, roles `answerer` and `co_committed` reported as two series, plus transfer accuracy at d28** (§10.1, §10.4). Log `gloss_lang_rendered` and `gloss_lang_switched_at` from v1. **Expect a small effect or none — the section's own moderator ("clearest on immediate posttests") predicts a null at d28**, and that expectation is written here so a null is read as confirmation of a known limit rather than as a failed experiment.
13. **[D] Pinyin — ruled here, because a content section on Mandarin glossing that never decides whether pinyin appears has skipped a larger decision than the one it made.** §11.7 already mandates `pinyin_citation`, `pinyin_surface` and `audio_ref` on every item, and gate 8 already asserts the Latin face renders `ǖ ǘ ǚ ǜ` — so the build assumed pinyin exists while this section was silent and `gloss: {nl, en}` had no slot for it. Ruling, **[D]**, on design grounds with the evidence graded **weak** and an open item to verify:
    - **Never on the prompt side.** Pinyin beside the hanzi lets the player answer without reading the character, which is the whole construct. **Reveal only.**
    - **Tone marks, never tone numbers.**
    - **`pinyin_surface` (post-sandhi) renders whenever audio plays** (§11.7); `pinyin_citation` renders otherwise. The pair earns itself immediately: 不要香菜 is citation *bùyào*, surface *búyào*; **the product name 看不懂 is citation *kànbùdǒng*, surface *kànbudǒng* — 不 is neutral-toned in a potential complement, not *bù*.**
    - **New lint rule: the apostrophe.** Any syllable beginning **a, o or e** that follows another syllable takes `’`. **无障碍 = wúzhàng'ài** — without it the string reads *zhan-gai*. This is a CI check, not a style preference.
    - For the record, the pinyin this section previously omitted: 斤 jīn · 两 liǎng · 楼 lóu · 折 zhé · 辣 là · 麻 má · 能量 néngliàng · 素 sù · 饭店 fàndiàn · 无障碍 wúzhàng'ài · 蚝油 háoyóu · 高汤 gāotāng · 满减 mǎnjiǎn · 时价 shíjià · 无座 wúzuò · 荤 hūn · 斋 zhāi · 涮 shuàn · 卤 lǔ · 拌 bàn · 鲜 xiān · 香 xiāng · 花椒 huājiāo · 清真 qīngzhēn.
14. **[D] Traditional characters in glosses.** Gate 6 forbids a **scalar** `trad` field on 面/干/发/后/里/松/只/几/表/系/术, and the gloss schema had no `trad` story at all. **Any hanzi appearing inside a gloss string (蚝油, 高汤, 花椒, 斋, 清真) is subject to the same rule as an item string**, is covered by gate 1's subset union, and carries the same per-character reading requirement as gate 5.
15. **[D] Test direction, ruled — it changes what "gloss" denotes here.** The product's construct is **recognition: 汉字 → meaning**. The gloss is therefore the **response set** on the option rows and the confirmed meaning on the reveal; production (meaning → 汉字) is not a v1 item type. This is exactly why the glossing literature transfers poorly — its glosses are comprehension aids during reading, not the alternatives in a forced choice — and saying so plainly is more honest than the earlier draft's appeal to "context-free isolated cards."

### The ⺼ / 月 ruling

Not raised in the earlier draft of this section, and it belongs here because it is a **content** ruling. It is currently wrong in the repo, in commit `b775e0c`, across `/home/user/dohhh/design/cards/README.md`, `/home/user/dohhh/design/cards/canvas.json` and `/home/user/dohhh/design/cards/Breakdown.dc.html`. Verified directly rather than taken on trust:

```
U+2EBC '⺼'  CJK RADICAL MEAT            category=So  decomposition=''      (CJK Radicals Supplement, U+2E80–U+2EFF)
U+2F81 '⾁'  KANGXI RADICAL MEAT         category=So  decomposition='<compat> 8089' (肉)   (Kangxi Radicals, U+2F00–U+2FDF)
U+6708 '月'  CJK UNIFIED IDEOGRAPH-6708  category=Lo  decomposition=''
肝 = U+809D, one code point.   '月' in '肝' → False    '⺼' in '肝' → False
保质期 = U+4FDD U+8D28 U+671F.  '月' in it → False
NFKC('⺼') → U+2EBC (unchanged).   NFKC('⾁') → 肉 U+8089.
```

1. **U+2EBC is not "Kangxi radical 130."** Kangxi radical 130 is **⾁ U+2F81**, in the Kangxi Radicals block, and that one — not U+2EBC — carries the compatibility mapping to 肉. Two blocks, two purposes, conflated.
2. **Neither code point occurs inside 肝.** Encoded Chinese text contains no component code points, so "the component **is** U+2EBC" is not a true statement about anything a string in this app will ever hold. It is true only as the annotation convention of a decomposition database — and the commit names its source, "verified against Make Me a Hanzi," whose IDS strings use ⺼ for meat and 月 for moon. A convention, not a fact about Unicode, and not universal across IDS sources.
3. **The hazard the commit invents cannot occur, and the real one is worse.** A substring match for 月 against 保质期 returns nothing: 期 is U+671F. **But the correct conclusion survives on a better mechanism** — a substring match on 月 **never fires on any organ character at all** (they are all single unified ideographs) and **does fire on standalone 月 in 月台 yuètái "railway platform" and 月饼 yuèbǐng**, both live items in a bank that ships transit and food. So the naive rule under-fires on everything it was meant to catch and over-fires on a transit sign. **Highlighting keys off a stored per-item component field, never a substring match** — the ruling is right, the reason given for it was not.
4. **§9.1 bans the source it was verified against.** `makemeahanzi/dictionary.txt` is **LGPL-3.0-or-later**, §9.2 says "keep `makemeahanzi` out of the build environment entirely," and gate 3 requires its absence from the lockfile and the build image. A content ruling verified against a banned source is a provenance problem on top of a correctness one.
5. **The "real 月" list is wrong on half its members.** 期 qī, 朗 lǎng, 望 wàng — genuine moons. **服 fú** — the left element is a corrupted **舟** (boat; Shuowen 从舟), neither moon nor meat. **朋 péng** — strings of cowries, neither. **有 yǒu** — modern paleography reads 又 (hand) + **肉** (meat), the *opposite* of the commit's claim, while Kangxi and Unihan `kRSUnicode` file it under radical **74 (月)**; contested, and contested in the direction that breaks the list. And this very section supplies another counterexample: **能** in 能量 has a 月-shaped element that is the residue of a bear pictograph (whence 熊 xióng), neither moon nor meat.
6. **The commit ships U+2EBC into copy.** `Breakdown.dc.html` renders `&#11964;` inside `<span class="han">`. U+2EBC is category **So**, has **no NFKC folding** (unlike ⾁ U+2F81, which folds to 肉), and lives in a block no CJK subset generated from a hanzi list will contain — a live **gate 1** failure, unsearchable, un-typeable by IME, and the wrong thing to hand a screen reader under `lang="zh-Hans"` in a document that makes `lang` a build gate (consequences 3–4 above).

> **[D] Ruling. ⺼ and 月 are the same shape in a simplified-Chinese font, and the distinction is a font-and-etymology matter, not a code-point one.** In encoded text there is nothing to choose: 肝 is U+809D, one character, containing neither U+6708 nor U+2EBC. The meat radical (Kangxi 130, from 肉) and the moon radical (Kangxi 74) are drawn identically in mainland type; Japanese and some traditional faces separate them — one more reason `lang` is a build gate. **Never put U+2EBC in shipped copy.** Write 肉 in prose, show the bound shape as 月, and record which one it is in a stored `semantic_radical` field seeded from Unihan `kRSUnicode`, which §9.1 already provides.
>
> **The teaching rule is the real content ruling, and it is the one that must not ship wrong.** "月 on the left means the body" is false for 服 (boat), 朋 (cowries), 能 (bear) and arguably 有, while 期/朗/望 are genuine moons — wrong on roughly a third of common characters. **So the organ card teaches the set — 肝 gān, 肠 cháng, 肚 dù, 腰 yāo, 脑 nǎo, 肺 fèi, 肾 shèn, 胗 zhēn — and never the rule**, and it carries the line this project already committed to: *when you cannot see it, it is not there.*
>
> **保质期 bǎozhìqī is kept** — not as a substring hazard, which cannot occur, but as the ideal **counterexample card**: a shelf-life label whose 期 looks like the organ component and is not.

**[D] The remedy is a forward correction, not a revert — where I keep a position against the review.** `b775e0c` is also the commit that added `docs/DESIGN.md`; reverting it would delete this document. The fix is a new commit against the three card files (`README.md`, `canvas.json`, `Breakdown.dc.html`), removing every U+2EBC from copy and replacing the claim with the ruling above, plus the `docs/DESIGN.md:99` licence-cite fix from consequence 11.

### One last note on why both must be stored from day one

Mandarin offers **almost no cognates** to Dutch or English, and the earlier "**no cognates**" is corrected — it was falsest in this bank's own domain. Food and drink is exactly where Chinese phonetic loans cluster: 咖啡 kāfēi, 巧克力 qiǎokèlì, 沙拉 shālā, 三明治 sānmíngzhì, 汉堡 hànbǎo, 吐司 tǔsī, 布丁 bùdīng, 咖喱 gālí, 披萨 pīsà, 可乐 kělè — and **啤酒 píjiǔ**, where 啤 is a phonetic borrowing of *beer/bier*, closer to Dutch than anything else in the bank. "Form, sound and meaning all novel" is wrong for every one of these.

**Scope the claim to what is true: the script carries zero transfer.** Even for a loan, the sound similarity helps at the meaning-retrieval step and not at the form-recognition step, which is this product's construct (consequence 15). Semantic transparency (电脑, 火车) starts paying only after a few hundred characters. **[D] Flag `phonetic_loan` as a stored column and measure whether those items reach criterion faster — do not schedule them cheaper on the assumption that they will.** Replacing one unmeasured number with another is the failure mode this section is about.

And grade the retrieval consequence carefully: the *scarcity of cognates* is well-attested; the retrieval-count consequence usually attached to it — the earlier draft's "**8–12 successful retrievals rather than 3–4**" — is an **inference from that scarcity, not a measured figure for Chinese**, and §10.4 already forbids assuming a figure here (it names 6–10 as the withdrawn one; the draft simply substituted a different invented pair). **Measure `retrievals_to_stable_recall` from your own log (§6.6, §10.4) and do not plan against a borrowed number.**

**[D] And the planning instruction that followed it is withdrawn, because it did the thing the next paragraph bans.** "Budget far more exposures per item than a Spanish or German app would, and size the bank accordingly" derives a plan from the inference just ruled inadmissible — and it contradicts §11.0, which **fixes the bank at 1,500 characters and 1,200 multi-character items, 2,700 total**, normatively. Replace with: **do not size the bank against a retrieval count. The bank size is fixed in §11.0; let `retrievals_to_stable_recall` set the scheduler, not the bank.**

The same discipline kills the other tempting anchor: the widely cited "112–141 hours to functional reading" figure comes from a study of **Spanish and French** learners and contains no Mandarin data. Transferring hours-to-proficiency from two shallow-orthography Romance languages — where the learner already knows the script and shares thousands of cognates — to a logographic script with zero orthographic transfer is invalid and under-budgets badly. The relevant comparator is the FSI Category IV classification: **~2,200 class hours to professional proficiency for Mandarin against ~600–750 for Spanish or French**, for aptitude-screened full-time adult diplomats — and even that is a whole-language classroom figure for a goal this product does not have.

**So project no total-hours figure at all.** Do not scope the product as "learn Mandarin", never set the in-app goal to a level label, and architect for churn as the primary failure mode. **[D] The two numbers the earlier draft attached to that — a "three-week" gap and a "60-second" review — are withdrawn as underived, and replaced with quantities the scheduler already computes:**

- **No gap of any length resets scheduler state.** The only thing that deletes state is iOS eviction after ~7 days of non-use on uninstalled clients (§11.2), which is the real threat; the export path and the encrypted-to-owner blob are the remedy, and a wall-clock "reset" threshold was never the mechanism.
- **The re-entry review fires on scheduler state, not on a clock:** on open, when the due backlog exceeds §11.9's session cap (~40 retrievals) **or** when median predicted recall across due items has fallen below `R* = 0.90` (§11.8). It renders as a short "what you still know" pass built from the player's own FSRS state, bounded by §11.9's existing session shape rather than by an invented sixty seconds, and it is unscored.

### Open items this section adds to §12.1

| # | Question | Why it is open | How it gets closed |
|---|---|---|---|
| 19 | **K/N for the Dutch exact-mapping claim** | Reason 3's density claim was asserted from ten hand-picked rows and is withdrawn; the exact-mapping set is enumerated (斤, 两 and compounds) but the share of bank items touching it is unknown until the bank exists | Emit `items_with_exact_nl_unit_mapping / 2,700` at build time. Below ~5%, reason 3 is a footnote |
| 20 | **The Dutch authoring budget** | ≈2.5–3.5 person-weeks is scaled from §9.1's decomposition rate, not measured, and excludes the hazard rows | Time-box the first 100 Dutch glosses and re-derive before the column is committed to a plan |
| 21 | **Sui generis database rights in CC-CEDICT** | BY-SA 4.0 §4 engages only if SGDR subsists in the source, and under Directive 96/9/EC Art. 11 that turns on the maker's EU connection — MDBG's establishment is unverified | Establish MDBG's establishment. Either way §3(b) applies to our adapted table; the answer decides whether our derived database carries its own SGDR |
| 22 | **The pinyin display ruling's evidence base** | Consequence 13 is ruled on design grounds, graded **weak**; "pinyin on the prompt side suppresses character learning" is a well-known concern in the teaching literature and is not verified in full text here | Verify before the item-type spec freezes, or ship reveal-only pinyin as the conservative default (which it is) |

---

### Changes made under this review

**Reversed or withdrawn**

| Was | Now |
|---|---|
| "Instrument it as the product's first content A/B … your own data can" | **No gloss-language A/B.** The design made it unrunnable (both glosses on every reveal, host-locale shared reveal, per-protocol exclusion under churn, arms differing in authoring quality), §10.2 has no free slot, and the prescribed metric was demoted by §10.1. §12.1 #4 rewritten; revival conditions named |
| "Default to the user's L1 by locale" | **A two-language authoring budget.** Outside `nl-*` we knowingly ship an L2 gloss at an expected cost of ~g = 0.33, accepted and stated |
| "Four reasons, in order of weight" + reason 4 "the decisive reason" | **Three reasons, unordered; "decisive" withdrawn** |
| "The cost of being wrong is small and symmetrical, because the effect is small" | **Deleted** — effect size is not cost, and the table asserts an asymmetric tail. Replaced by a priced authoring budget (CC-CEDICT is English-only; the Dutch column is 100% ours) |
| "The theoretical argument for English is defeated on its own terms" | **L3 transfer theory is silent here** — both models concern morphosyntax; psychotypology demoted to a footnote |
| "看不懂 has no text — it is context-free isolated cards" | **No context at the moment of choice** — the reveal does carry context, and consequences 3–4 always required it |
| "A multiple-choice gloss is a gloss plus a test" | **Deleted** (wrong referent, and format cannot confound language). Replaced by the forced-choice-recognition point |
| "This bank is dense with unit, quantity and floor-numbering traps" | **Withdrawn**; the exact-mapping set is enumerated (斤, 两 + compounds) and the share becomes a build-time count (§12.1 #19) |
| "Two columns for a wedge into a small, enumerable list of Dutch schools" | **Out of scope for v1 and unbudgeted**, per §8, whose trademark conflict and Art. 8 / UAVG-16 obligation this section had dropped |
| "Stay a PWA, or serve gloss assets as separately-fetched non-DRM'd files" | **Licensing does not decide the platform** (§9.3); the PWA is kept on the iOS-FairPlay-first-run-fetch argument, restored |
| "BY-SA 4.0 §2(a)(5)(B)"; "ShareAlike discharged once at build time" | **§2(a)(5)(C)**, and **§3(b)(3)** for our adapted table; §3(a)/§3(b) bind on **every distribution**, satisfied by `/licences`, not by GitHub. §4 SGDR added. Fix also at `docs/DESIGN.md:99` |
| "delayed accuracy at ≥1 week" | **Volume at criterion + calibration at weeks 8/16/24, transfer at d28** (§10.1, §10.4) |
| `hsk_band` | **`hsk3_band`** |
| "Cap gloss length at ~120 characters" | **Two rendered lines at 360 CSS px, per language, on option rows only** |
| "8–12 retrievals rather than 3–4"; "size the bank accordingly"; "three-week gap"; "60-second review" | **All withdrawn as underived.** Bank size is fixed in §11.0; re-entry fires on scheduler state |
| "Mandarin offers no cognates" | **The script carries zero transfer**; phonetic loans exist and cluster in this bank's domain. `phonetic_loan` measured, not discounted |
| "Unusable with a screen reader" | **WCAG 3.1.2 AA failure**, EN 301 549 clause 9, binding via WAD/EAA where they apply — which may not be here |
| Gate 7 as "any hanzi element" | **A codepoint rule**, because the old wording passed this section's own hazard glosses |
| `no_single_word_equivalent` | **`requires_explanatory_clause`**; 时价 removed, 无座 and 鲜 kept with reasons |

**Content fixed:** 折 → *n折 = je betaalt n×10%*, not a hard-coded 80% · 斤/两 tagged mainland-only (台斤 600 g, 台两 37.5 g) · 3楼 rewritten around the **action** in both columns, both `hazard` · "pittig is tighter" deleted, 辣 moved to neither-language-wins · 麻 names 花椒 and drops "geen hitte"; "no English word" corrected to *no everyday word in either language* · 能量 conversion disambiguated (÷ 4,2) · 素 names 斋 and 五辛 · peanut card → **我对花生过敏，包括花生油**, plus a scope line and 清真 · new `confusable_with` sets (时价/市价, 涮/刷, 拌/伴/绊) · pinyin printed throughout, with the wúzhàng'ài apostrophe rule and kànbudǒng as a lint rule and a worked example · the ⺼/月 ruling added and `b775e0c`'s three card files marked for forward correction.

**Kept, with the disagreement stated**

- **Both glosses on the reveal.** The review is right that it destroys an A/B and wrong that it is therefore a defect — once the A/B is withdrawn, the second gloss behind a tap costs nothing and serves a mixed table.
- **The glossing literature still does not transfer.** The review is right that "context-free isolated cards" is contradicted by the "where you meet it" clause; the argument survives narrowed, because the reveal's context arrives *after* the choice, not at the moment of encounter.
- **The schoolexamen-only structure is load-bearing.** The review says nothing uses it; it is why there is no national syllabus to align to, which is why the PTA's HSK-based 400-character figure is the only anchor the filtered deck has.
- **鲜 and 无座 stay flagged.** The review is right about the flag's name and half right about its membership: 鲜 is polysemous across *fresh* and *savoury*, and *staanplaats* transfers the concept but not the rail-ticket situation.
- **`b775e0c` is not reverted.** The same commit added `docs/DESIGN.md`; the fix is a forward correction to the three card files.
- **The review's own numbers are not adopted.** "300–500 per arm at the smaller effect" corresponds to d ≈ 0.20–0.23, not to the effect this section predicts, and "Dutch runs 10–20% longer" is as unsourced as the 120-character cap it objects to. The mechanisms are adopted; the figures are replaced with `16/d²` and with a measured render assertion.

---

## 8 (tail). The Dutch secondary-school column

Chinese in Dutch secondary education is examined as a *schoolexamen* (no centraal examen), with PTA tests structurally based on HSK and requiring active mastery of **400 characters**. Tag every item `vwo_400` and `hsk3_band`. *(slo.nl was egress-blocked; the 400-character figure and the schoolexamen-only structure are confirmed by multiple secondary sources, the start year is unresolved. One email to SLO settles it.)*

**[D] What the two columns actually buy, corrected.** They buy a **filtered deck**, and they keep a school SKU *possible*. They do not buy a distribution channel, and the earlier claim that they did was a category error. A Dutch secondary school needs procurement, teacher accounts, a classroom mode, a roster, and a durability story — and §11.2's durable path is "the pupil exports a JSON file," which no school will operate for ninety pupils. Two further obstacles are structural rather than incidental:

- **The trademark ruling and the wedge point in opposite directions.** §9.2 forbids the letters "HSK" in store metadata, and "HSK" is the exact string that makes the deck legible to a buyer whose PTA is built on it. A school channel therefore cannot be a store-discovery motion; it would have to be direct sales, which is a different company.
- **Minors' data, which the earlier draft never raised.** §9.2 invokes GDPR for a bystander in a menu photograph and said nothing about **Art. 8** for the channel it was proposing to sell into. In the Netherlands the UAVG sets the information-society-services consent age at **16**, so most of the target cohort cannot consent for themselves. A school deployment makes the school the controller and us the processor: verwerkersovereenkomst, in practice adherence to the *Convenant Digitale Onderwijsmiddelen en Privacy*, and a DPIA the school will ask us to support. The no-server architecture shrinks this exposure; it does not remove it, because "no server" is not the same as "no processing" once we ship a classroom mode.

**[D] Ruling: the school channel is out of scope for v1 and unbudgeted.** Ship the two integer columns anyway — they cost two integers, they make the filtered deck real for individual Dutch learners today, and they are the only thing that keeps the SKU cheap to build later. Nothing else about schools is designed, promised, or costed until someone owns the channel and the Art. 8 work.

---

## 9. Content sourcing and licensing

### 9.1 What can ship

| Asset | Source | Licence | How it ships |
|---|---|---|---|
| Glosses (seed layer) | **CC-CEDICT** via MDBG | **CC BY-SA 4.0** (verified on two builds, 2023-09-03 and 2024-12-06; ancestor CEDICT © 1997–98 Paul Denisowski) | As a **separate build artefact** `/assets/gloss.cedict.json` with `LICENSE-CC-BY-SA-4.0.txt` beside it. **Never inlined into the JS bundle.** The derived file is published in the repo so ShareAlike is discharged once at build time. |
| `strokeCount`, `kRSUnicode` (semantic radical, incl. 肉 = radical 130) | **Unihan / UCD** | **Unicode licence** (MIT-equivalent): use, copy, modify, distribute, sell; condition is the notice with copies or in documentation; you may not use "Unicode" in advertising | Bundled. Notice in `/licences`. **Do NOT use `kMandarin` for pinyin** (P30). Do not order the bank by `kFrequency` or `kGradeLevel` — legacy fields from small 1990s sources, on the deprecated track. **`kRSUnicode` is a radical-stroke index, not a component decomposition** — see the decomposition row. |
| Character tier, 多音字 table (597 entries), traditional-variant lists (1,489 S→T) | **通用规范汉字表** via `jaywcjlove/table-of-general-standard-chinese-characters` | **MIT** (transcriber's grant) | Bundled. Attribute the transcriber. Note the underlying GF 0023-2013 standard's contested status. |
| HSK 3.0 band, as an internal ordering signal only | `elkmovie/hsk30` | **MIT** © 2021 Pleco Inc. (OCR + compilation labour) | Internal integer column. **Never the letters "HSK," the logo, or "HSK Level N" in the UI or store metadata.** |
| **Component decompositions (structure *and* gloss)** | **Authored by us**, seeded only by Unihan `kRSUnicode` for the semantic radical | ours | **[D] Ruling, changed under review.** 1,500 decompositions authored in-house. See §9.2's decomposition row for why the "regenerate from Unihan + CC-CEDICT" plan was withdrawn. Cost: roughly two person-weeks. Benefit: the field's `source` tag is `ours`, so gate 3 becomes checkable and no BY-SA obligation propagates into the bundle. |
| Faces (product) | **Noto Sans SC**, **Noto Serif SC** | **SIL OFL 1.1, no Reserved Font Name** | Self-hosted subset, family renamed, `OFL.txt` shipped. |
| **Faces (held-out, test blocks only)** | **[D] Two further OFL CJK faces** used nowhere in the product UI — a kai-style face and a display/signage-style face | **SIL OFL 1.1** (verify per face; some ZCOOL-family faces have limited coverage — gate 1 covers this) | Subset over the test inventory only, precached, rendered only inside the pre/post sign blocks. This is what replaces the typographic variability lost by banning photographs (§9.2, §10.1). |
| Scheduler | `ts-fsrs` | MIT | npm dependency. Note: npm latest 5.4.1 = **FSRS-6.0**, one generation behind the benchmark's FSRS-7 — quote FSRS-6 rows only. |
| **City-pack station names** | **Unresolved — see §11.6 and §12.1 #14** | Prefer **Wikidata (CC0)**; if OpenStreetMap (**ODbL**) is used, its share-alike-on-derived-database duty puts it in the quarantined-artefact path with the gloss, not in the bundle | **No pack is built before its source and licence are in the provenance manifest.** Gate 2 fails an unsourced pack on sight. |
| Everything else | **Authored by us** | ours | Item strings, all Dutch glosses, all `note` clauses, all discriminators, all decomposition glosses, all distractor sets with `whyPlausible` (**including every city-pack transit distractor** — §11.6), all `accepted_answers` synonym sets. |

*Removed from this table under review: "all five CSS substrate templates," which are no longer a v1 asset — see §10.2 and §12.2.*

### 9.2 What cannot ship

| Asset | Why not | What to do instead |
|---|---|---|
| **`makemeahanzi/dictionary.txt`** | **LGPL-3.0-or-later**, not MIT. LGPL on a JSON blob compiled into a Vite bundle is incoherent but not obviously discharged — the mechanism it protects is the right to relink a modified version | **[D] Changed under review.** The old instruction — "regenerate the equivalent decomposition from Unihan + CC-CEDICT" — was unbuildable as written (Unihan ships no component decomposition, only `kRSUnicode`) and licence-inconsistent with §9.1's "authored by us" column (anything CEDICT-derived is BY-SA and belongs in the quarantined artefact, not the bundle). **Author the 1,500 decompositions in-house.** Keep `makemeahanzi` out of the build environment entirely, which is what makes gate 3 checkable. |
| **`makemeahanzi` graphics / `hanzi-writer-data`** | **Arphic Public License** — genuinely copyleft on the stroke data, with a "designated place" distribution duty on modifications (§2(a) notice, §2(b) publish-as-a-whole). Subsetting or reformatting **is** a modification | **[D] Ship no stroke graphics in v1, on the licence alone.** APL §2(b) imposes a designated-place publication duty we are not ready to take on. *Measured, as context and not as the reason:* mean 3,368 B/character over 9,574 files → **1.52 MB brotli at the fixed 1,500-character bank**. **Two claims are withdrawn:** the "3 MB install budget" (an invention — no install budget has ever been derived; §11.7) and "a skill this user will never perform" (a claim about the user, contradicted by our own §12.1 #7). **Named dependency:** §12.1 #7's finger-trace experiment *requires* this data. If #7 runs, the designated-place repo — public, with `ARPHICPL.TXT` and a `CHANGES` file — is a prerequisite and must be scheduled and staffed before the experiment is planned. Whether the user should ever write is decided on opportunity cost at equal time, not on bundle size. If only order is needed, ship the integer sequence (a GB standard, not an expressive work). |
| **CTW annotations** | **CC BY-NC-SA 4.0.** The NC term is a real gate on a commercial product | Use CTW **internally only**, as a research input deciding which characters to author, in what order, and which held-out signs to use. **Ship no artefact derived from the annotations** — including **no `signage_frequency` column** (gate 13) and **no published held-out set** (§10.1, corrected) — unless a commercial grant is obtained from the authors. The baseline code is MIT. |
| **SUBTLEX-CH · Jun Da MTSU · BCC** | SUBTLEX-CH is safe only from the PLoS ONE Supporting Information copy (inheriting CC BY); the lab-site and GitHub mirrors carry **no licence text**. Jun Da is research/education-only with no commercial grant despite being bundled commercially everywhere. The circulating BCC file has no licence statement | **Do not bundle any of the three, and quote none of them in product copy.** They disagree by ~5–7 points at rank 1,000 and do not agree on their top three, which is itself the argument. **What orders the bank instead is now stated, in §9.2a below** — the earlier draft ruled out three ordering signals and named no winner. |
| **Tatoeba sentences** | Code is AGPL-3.0 (verified); the per-sentence corpus licence **could not be verified and remains open** (§12.1 #15). And the register is wrong — textbook-style full sentences, often translationese, with essentially no menu items, transit signage or product labels | Do not build the bank on it. The register argument is sufficient on its own, so the unresolved licence does not gate anything — but it is an open licensing item and is now listed as one. Clozemaster is the standing proof that it is cheap to build and lands in the wrong register. |
| **Photographs of real menus, fascias, packages, labels** | Menu layout and typography, dish photography, package artwork and shopfront logos are **protected expression carrying live trademarks**. A Dutch controller photographing on premises engages **GDPR** the instant a person is in frame; **PIPL** applies at collection; the PRC **Surveying and Mapping Law** restricts geographic data collection by foreign nationals | **[D] Ruling, rewritten under review — the earlier row managed disclosure instead of deciding.** (a) **Reference photography of signage, menu boards, fascias and packaging may continue**, on Art. 6(1)(f) legitimate interest, conditional on a written balancing test held with the DPO record and on three hard rules: **no identifiable person in frame** (a frame containing one is deleted at intake, not blurred), **EXIF and GPS stripped at intake**, and **no capture where the premises prohibits it**. (b) **No systematic geo-referenced or route-based capture** — that is the shape the Surveying and Mapping Law reaches; an ad-hoc photograph of a menu board is not surveying. (c) Photographs never enter the repo, the bundle or any shipped artefact; retention limit **12 months from transcription**, then deletion. (d) **The marketing line follows from (a)–(c), it does not drive them:** with the balancing test written, "built from photographs of real signage taken in Chengdu" is accurate and sayable; the specific "200 real menus" figure stays out because it is unverified, not because it is dangerous. If the balancing test is not written, the practice stops and the line cannot be said. **Ship transcribed text set in our own licensed font. Never the source photograph.** If capture ever ships to users: on-device only, no GPS, no peer sync of images, no server-side pooling — store only the extracted character list. Route to counsel before a line of code if pooled capture survives. |
| **Forvo audio · CSMSC-derived TTS checkpoints · MagicData** | Forvo's terms forbid redistribution and durable caching — structurally incompatible with an offline PWA. CSMSC / 标贝 is explicitly **non-commercial** and taints the large fraction of publicly released Chinese TTS checkpoints trained on it. MagicData is **CC BY-ND 4.0**, where ND arguably prohibits training on it | Ship no audio in v1. When added: build-time pre-render with a commercial TTS whose terms grant output rights (Azure, Google, ElevenLabs all do). "This TTS model is open source" almost always refers to the **code** licence, not the corpus. |
| **Google Fonts `<link>`** | Needs network at render time, serves CJK as ~100 lazily-fetched unicode-range chunks that cannot be service-worker precached coherently, and its hosts are unreachable from mainland China | Self-host (§11.5). |
| **"HSK Level 3" / a CEFR letter in the UI** | HSK is a **trademark** exposure (the copyright position on the word list is genuinely unsettled and enforcement is unheard of; the letters and logo are what bite). CEFR equivalence is contested and uncomputable | Express progress as counts against the official lists and as `signsActionable`. Note the cost, stated plainly in §8: this ruling is also what makes the school SKU illegible through a store listing. |

### 9.2a What orders the item bank

**[D] Added under review — the single highest-leverage content decision in the build, previously left implicit.** Three ordering signals were ruled out (`kFrequency`/`kGradeLevel`, SUBTLEX-CH/Jun Da/BCC) and no winner was named. The winner is:

1. **Primary: CTW-derived signage frequency, as an internal authoring-order input only.** For a *signage* product, frequency in photographed street scenes is the right construct and the general-corpus frequencies are the wrong one. Permitted under route (b): it decides which characters we author and in what order, which is a decision, not a shipped artefact.
2. **Tiebreaker: HSK 3.0 band**, internal integer column.
3. **Floor: 通用规范汉字表 tier**, so nothing outside the standard sneaks in.
4. **The shipped ordering column is our own tier assignment** — a human judgement informed by (1)–(3). **No column whose `source` tag is CTW ever ships** (gate 13). A frequency count derived from NC-licensed annotations is plausibly adapted material; the tier assignment is ours. If we ever want the raw column, that is a counsel question, not a build question.

### 9.3 Build-time gates that fail CI

**[D]** Ten lines of script each, and the difference between a defensible product and an undocumented one. Fourteen now, because the earlier ten protected the licensing position and nothing protected the offline guarantee — which §11.4 calls total product failure.

1. Any codepoint in the **union of the item bank, every shipped city pack, and the pre/post sign test inventory** missing from **the subset of every face that renders it** (product faces and held-out test faces).
2. Any column in the emitted bank with no entry in the **provenance manifest** (column → dataset → licence).
3. **[Rewritten — the old form was unimplementable.]** "Any field traceable to `makemeahanzi/dictionary.txt`" cannot be checked by inspecting output; you could only diff against the source, which requires keeping the LGPL file in the build environment — the thing we are avoiding. Restated: **every field carries a `source` tag drawn from a closed set; `makemeahanzi` is not in that set; `makemeahanzi` and `hanzi-writer-data` are absent from the lockfile and from the build image.**
4. Any stored `strokeCount` disagreeing with the **first value** of Unihan `kTotalStrokes`; **multi-valued `kTotalStrokes` entries are flagged for human sign-off rather than compared scalar-to-scalar.** *Purpose, now stated because the gate is otherwise near-tautological: catching hand edits and mixed-variant rows, not catching an import bug.*
5. Any item containing a heteronym without an explicit per-character reading.
6. Any item containing 面/干/发/后/里/松/只/几/表/系/术 with a **scalar** `trad` field.
7. Any hanzi element without `lang="zh-Hans"`, or any gloss without a `lang` attribute.
8. The Latin face failing the `ā á ǎ à ē é ě è ī í ǐ ì ō ó ǒ ò ū ú ǔ ù ǖ ǘ ǚ ǜ` render assertion.
9. Any item with `transparency: 'opaque'` that also carries a `word_decomposition`.
10. Any item with `confusion_type: 'form'` and no `discriminator`.
11. **[New]** Any absolute URL outside the allowlist in the built service worker or bundle. **The allowlist for the co-located path is empty.** This is the gate that makes §11.2's "no runtime fetch" an enforced statement rather than a wish, and it is the one that would have caught `trystero/nostr`, `stun.cloudflare.com`, `free.expressturn.com` and `global.relay.metered.ca`.
12. **[New]** Any city pack whose transit distractor sets are absent, or present without `whyPlausible`. No runtime distractor generation anywhere (§11.3).
13. **[New]** Any shipped column whose `source` tag is `CTW`.
14. **[New]** Any key present in both the quarantined BY-SA gloss artefact and the JS bundle — a byte-level check that ShareAlike data has not leaked back inline.

**[D]** An in-app `/licences` route naming: CC-CEDICT · MDBG · Denisowski 1997–98 · Unicode, Inc. · Pleco Inc. (MIT) · the TGH transcriber (MIT) · SIL OFL 1.1 · ts-fsrs — plus each held-out test face and each city-pack data source once they exist.

**[D] Distribution channel — ruling corrected under review.** The earlier text derived a whole-product platform decision ("**Stay a PWA**") from a licence clause whose remedy was named in the same sentence, and the remedy is something §9.1 already mandates. Corrected:

> **Ruling: the gloss layer, and any future stroke assets, are served as separately-fetched, non-DRM'd files. Given §9.1 this is already true. CC BY-SA 4.0 §2(a)(5)(B) and Arphic PL §5 are therefore satisfied, and licensing does not by itself decide the platform.**

**We nonetheless keep the PWA, for a reason the review did not reach.** On iOS, "separately fetched" cannot mean "shipped in the app bundle" — an `.ipa` resource sits inside the FairPlay container, so satisfying the clause for an App Store build means fetching the gloss over the network on first run, from a host we operate. That collides with §11.2's offline-from-install guarantee and re-opens mainland reachability for a host we would then have to keep reachable from inside China. **So the argument for the PWA is architectural and geographic, not legal, and it must be re-tested against §12.1 #9 rather than treated as settled.** (A secondary argument sometimes offered — that publishing the derived file publicly cures the ETM problem because recipients can obtain it unencumbered — is contested and is not relied on here.)

---

## 10. Measurement

### 10.1 The cheapest honest instrument is the attempt log

**[D] Primary metric — replaced under review. The previous primary metric was held near-constant by the scheduler that computes it.**

The old primary was *accuracy on items whose inter-exposure gap crossed ≥7 days, on an unseen substrate*. FSRS schedules to a target recall probability, and §12.1 #1's group objective explicitly selects toward that target. A working scheduler therefore drives that accuracy toward the target *regardless of how much the player knows*: a player with 60 durable items and a player with 600 both score at target. Worse, the sample is endogenous — *which* items cross a ≥7-day gap is chosen by the intervention under test, so improving selection changes the denominator rather than the numerator. It was a scheduler diagnostic wearing a learning metric's clothes, and every A/B, every tripwire and the falsification rule in §12.2 was being judged against it.

> **Primary metric: volume at criterion. The number of items whose FSRS stability exceeds 21 days, per player, at weeks 8, 16 and 24 — restricted to rows where `role ∈ {answerer, co_committed}`.**

**[D] Why 21 days** (derivation, not a guess): it exceeds the 14-day inter-session gap §12.2 assumes as the bad case, so an item at criterion is one that survives the product's own worst cadence; and it is short enough to accumulate inside an 8-week observation window.

**[D] Delayed accuracy is demoted to a calibration check, and the pair is the instrument.** Report observed accuracy at scheduled intervals against FSRS's predicted recall. This is where the review's own proposal needs a correction: **stability is a model estimate, not an observation**, so a miscalibrated model inflates volume-at-criterion exactly as a calibrated one pins accuracy. Volume is only trustworthy while calibration holds; neither number is reportable alone.

Two further corrections in the same definition:

- **"≥7 days and ≥1 sleep" was a redundant conjunction** — seven days contains seven sleeps — and the second clause was there to sound rigorous. Dropped from the metric. **`crossed_a_sleep_period` stays as a stored column**, because it is the binding criterion for any sub-day analysis and costs nothing.
- **Role filtering was missing.** Spectator exposure and spectator retrieval are separated by roughly the testing effect itself (Rowland 2014, 159 effect sizes, g ≈ 0.50). Pooling them into one accuracy number mixes two events of very different strength. Restrict to `answerer` and `co_committed`; report `observer` and `exposure` as separate series. **Refinement on the review:** report `answerer` and `co_committed` as *two* series, not one pooled series, until they are measured to behave alike — committing alongside is not the same retrieval event as answering.
- **"On a substrate the item has not previously been seen in" becomes "in a render variant the item has not previously been seen in,"** where a render variant is typeface × ground × size. This follows from §12.2's reversal on object templates: with plain rendering as the default arm, substrates are no longer the source of surface variation.

**[D] Secondary metric — `signsActionable`, restated honestly.** ~120 real composite signs, each tagged with the character set it requires, split into pre-test and post-test blocks **matched on required-character *identity*, not on required-character count** — count is not what makes a sign hard. Administer the pre-test during Tier-0 onboarding (where it doubles as the cold-start calibration a mixed-ability table needs) and the post-test on the day the player lands. Rendered in the **held-out typefaces of §9.1**.

**Report it as what it is:** *a descriptive within-player change score on a self-selected subsample — players who both take the trip and open the app on arrival — reported with its denominator, and explicitly not a causal estimate.* It is single-arm pre/post with no control, so it confounds the app with the trip itself, with the final-week cram, with a class, with a travelling partner. The earlier claim that it is "the only outcome measure in this product category that is not self-reported" is true and irrelevant: not self-reported is not the same as valid. **Accepted limitation:** because §9.2 forbids photographs, the signs are transcriptions, so the test varies typeface and ground but not real-world chromatic and environmental noise. That caps how strongly transfer can be claimed, and the cap is stated rather than papered over.

*Source the held-out set from CTW internally, under route (b). **It is not published until §12.1 #8 closes** — a benchmark set whose membership is defined by CTW annotations is an artefact derived from them, and the earlier draft used "publishable" as the justification for choosing CTW at all, which made the reason depend on the thing forbidden. Reproducibility is deferred, not claimed.*

**[D] Four diagnostics, always on:**

| Diagnostic | Computed as | Trips when |
|---|---|---|
| **Template learning** | naked-probe minus in-substrate retrieval, **as a within-player log-odds difference at matched exposure count and matched delay, with a 95% CI** | the CI excludes zero in favour of naked-probe → the substrate is teaching plates, not characters. *The old "~20 points" is withdrawn: 20 points at 90% in-substrate accuracy is a different quantity from 20 points at 50%, and the number was never derived.* |
| **Cross-association** | per-user confusion matrix on `(target_item, chosen_item)` | `confusion[入口][出口]` crosses a threshold → **the remedy is randomised, not applied.** §12.1 #2 says shared-morpheme confusables are a category no cited study covers and warns against assuming they behave like form-confusables — and "separate and re-teach the component in isolation" *is* the form-confusable playbook. On a tripped threshold, randomise: separate-and-isolate vs increased contrastive presentation. Outcome = delayed discrimination accuracy. This is the cheapest way to answer #2. |
| **Anxiety / harm** | within-player latency on opponent-dealt vs self-dealt items, **residualised on `θ_i` and on the player's own prior accuracy for that item**, compared against matched-difficulty self-dealt items | the **residual** is positive. Unresidualised, the diagnostic trips in a perfectly healthy product: opponent-dealt items are *selected adversarially*, so latency inflates by item difficulty alone with no anxiety anywhere in the causal chain. `θ_i` from §11.8 is already stored. **Scope note added:** Attentional Control Theory (Eysenck et al. 2007) is a lab account of anxious individuals' processing efficiency; the transfer from classroom speaking anxiety to a private-answer co-located reading tap is an inference, graded moderate, not a licence to read latency inflation as harm. |
| **Observer contagion** *(new)* | does an observer's later error rate on item *i* rise after observing a specific wrong `chosen_option` for *i*? | it does → hiding other players' wrong answers is a **correctness requirement, not a comfort feature**. Seeing another player's wrong answer implants it (Roediger, Meade & Bergman 2001, social contagion of memory; with Weldon & Bellinger 1997 and Rajaram & Pereira-Pasarin 2010 on collaborative inhibition). The earlier draft framed public failure purely as an engagement and anxiety question and never asked the learning half, which is the more consequential one — and the log already has `role`, `chosen_option` and per-item subsequent accuracy, so it is free. **Design consequence, ruled now rather than after the diagnostic trips: a wrong `chosen_option` is never displayed attached to the player who chose it, and "what everyone else picked" never ships as a distribution bar.** |

**[D] The public-failure question — reclassified under review.** The earlier text called this "a real experiment at n ≈ 200 players." It is not an experiment: public failure is not assigned, it is *caused* — by item difficulty, by the dealing opponent's choice, by the player's own weakness — and the same latent variable produces the failure, the slower next turn and the abandonment. Within-player differencing removes stable player traits and removes none of that. The document convicted the framing literature of precisely this error in §10.2 and then committed it here.

- **What we actually have:** an **observational within-player contrast**, confounded with item difficulty and with the dealer's selection, reported with `θ_i` and prior per-item accuracy as covariates. Store `turns_since_last_public_failure`. Log turns voluntarily initiated, next-turn latency, abandonment, next-session return, each keyed to whether the **previous** turn was a public failure. **It is a hypothesis generator, not an answer.**
- **The experiment, if we want one:** randomise, per turn, whether the score delta is shown publicly or privately. That is assignment, it is cheap, and it rides A/B 2 (§10.2).
- **"n ≈ 200" is withdrawn.** It was an invention in a document that computed a standard error to three decimals for the check-in test. No n turns an observational contrast into an experiment; for the randomised version, the power calculation runs on the first cohort's observed within-player latency SD, before launch, and the number goes in this document then (§12.1 #18).

### 10.2 The A/B slate

**[D] Rewritten under review. Two slots, ranked, both riding the existing log at no extra cost.**

**A/B 1 — Plain rendering (default) vs object templates.** *Direction reversed; see §12.2 and the Changes section.*
Outcome: **volume at criterion at week 8**, with **transfer accuracy at d28** as the co-primary. Assignment at player level. **A null result retires the templates, not the experiment.** Retirement read is at **week 16**; if the interval favours plain, or the CI still includes zero at that read, the substrate code is deleted from the repository rather than left behind a flag.

**A/B 2 — Score visibility.** Assignment at player level: live standing (including negative deltas) shown vs hidden. Nested inside it, per-turn randomisation of public vs private score delta, which is the causal version of §10.1's public-failure question.
Outcome: next-session return, self-initiated turns, and volume at criterion. This is the slot that used to belong to the framing decisions and to the spacing coefficient, and it now carries both a design decision we cannot make from evidence and the only randomisable version of the harm question.

**Dropped: the spacing-coefficient A/B.** The earlier draft rejected `0.15 × horizon` (P3) and then spent one of its two v1 slots on the residue of the same finding. Cepeda et al. (2008) is called a *ridgeline* because it is flat near the optimum — recall is insensitive to gap across a broad plateau, so precision-tuning gap length buys very little; a trip is not a test date but a multi-week period of repeated in-situ exposure, so landing-day retention is a mismatched outcome construct; and §12.2 concedes the scheduler may barely run. The test could not produce a result. **The ramp decision is therefore made by fiat, which is what a flat optimum licenses: v1 ships pure strength-based intervals with the trip date used only as a coarse regime selector (near trip → shorter gaps, distant trip → longer gaps), and no trip-date-driven recall-threshold ramp is built.** That is a smaller build, not a deferred experiment.

**[D] The framing decisions, corrected.** "Framing can tip the sign of competition" remains **the product's central untested hypothesis, not a finding** — the opposing-processes model was fitted over correlational studies in which goal endorsement was measured, not manipulated. The earlier draft shipped three design decisions on it, calling them "cheap and harmless either way." Two are; one is not.

- **Ship: gain-framed copy, and no red negative numbers.** Genuinely near-zero-cost. Book nothing.
- **Do not ship: removal of the live losing-order.** Removing the standing from a competitive game is a substantial design change, not a null, and it was being made on an untested hypothesis. **It becomes A/B 2**, where it is decided by data instead of asserted as harmless.
- "Do not book the benefit" had no enforcement while the A/B sat third in a queue behind a test that could not resolve. It is now second, and the queue is two long.

**Third, if a slot opens:** does anything we do move `days_between_sessions` — solo-surface nudge vs none, outcome = retrievals at ≥7-day gap per item per player. This is the only spacing question worth money, and §12.2 is why.

### 10.3 What is banned as a primary metric, and one instrument that is retired

**Banned:** self-reported difficulty · perceived helpfulness · in-session accuracy · session satisfaction · NPS · streak length · time in app · "players report they had fun."

**Retired outright: the 60-item yes/no vocabulary check-in.** It cannot function as a learning-outcome metric. At hit rate 0.75 and false-alarm rate 0.10, the SE of a single corrected score (hits/40 − false_alarms/20) is ≈0.096, so the difference between two sittings has SE ≈ 0.136. **Corrected under review: ≈27 points is 1.96·SE_diff, the threshold for calling a difference significant; the minimum change detectable at 80% power is (1.96 + 0.84)·SE_diff ≈ 38 points.** Even at a flattering 0.90/0.05 the honest figure is ≈27 rather than ≈19. Resolving a 10-point change needs ~284 real + 142 pseudowords (~10 minutes); 5 points needs ~1,700 items. **Running it every ten sessions produces a number that moves mostly at random, which is worse than no number because the team will read the noise.**

**[D] Changed under review: it is not kept as a placement instrument either.** The earlier draft demoted it and then reinstated it at onboarding, which put **two** cold-start tests before the first game — the ~120-sign pre-test block (§10.1) and this. It also proposed "one long test (400+ items) twice a season," which resolves ~10 points by the document's own formula and drives no named decision. **One cold-start instrument: the sign pre-test block.** The yes/no check is deleted.

**[D] And the replacement format, corrected — the earlier proposal was banned twice by this document.** "Ask about **readability of a real string in context** ('can you read this sign?') over **cropped real signage**" used a photograph (§9.2: never the source photograph) and a **yes/no self-rating** (top of the banned list, three paragraphs above). Corrected: **held-out signs transcribed and set in the held-out typefaces of §9.1, with the player required to produce the meaning — select from four glosses — never to rate their own readability.** The pseudo-word note stands as design guidance for any future recognition instrument: pseudo-**characters** are rejected on sight and collapse the false-alarm rate the correction divides by; build pseudo-**words** by substituting one character of an attested two-character compound with a frequency-matched character sharing the semantic radical — morphologically well-formed but non-existent.

### 10.4 The two-family reporting rule

**[D]** Learning and engagement are reported as **separately-labelled metric families** and never conflated. Learning: volume at criterion at weeks 8/16/24 · calibration (observed vs predicted recall) · transfer accuracy at d7 **and d28** · retrievals-to-stable-recall per item (**measure it; do not assume 6–10**). Engagement: sessions/week · retrievals/session · self-initiated vs notification opens · 8-week retention.

**[D] Added under review: at least one decision gate runs at d28.** The earlier draft named d28 in this list and then used it nowhere — every decision ran on d7 or on landing day. That is this document's own warning turned inward, since it convicts the field's most-cited result of reading a next-day number as a learning result. **A/B 1's co-primary is at d28** (§10.2), and the retirement read at week 16 uses it.

The reason for the two-family rule is concrete: the field's most-cited "smarter scheduling drives engagement" number came from a study that measured **next-day retention and never measured vocabulary gain at all**, and it has been read as a learning result for a decade.

---

## 11. Architecture

The fork inherits a good spine: `packages/engine` is a pure deterministic reducer over an Ed25519-signed event log with seeded per-turn RNG; `packages/net` does anti-entropy sync with QR join tickets; `apps/pwa` is Vite + React 19, installable and offline-capable. Most of what follows is additive; five things must change.

### 11.0 The bank size, fixed

**[D] Normative, and added under review because four decisions depended on a quantity the document never stated** — stroke data was costed at 1,200 characters, storage sized at "1,800 + 1,200 words," the font decision priced at 1,500, audio budgeted at 1,200 items.

> **v1 ships 1,500 characters and 1,200 multi-character items — 2,700 items total.**

Every number below is recomputed against it. §1's bank-size line must be updated to match; until it is, this line governs.

### 11.1 Storage — two stores, not one

**[D]**

| Store | Contents | Synced? | Backing |
|---|---|---|---|
| **Shared game log** | signed events, exactly as today | yes, P2P anti-entropy | as today |
| **Local memory store** | FSRS state, review log, confusion matrix, component exposure counts, `component_first_seen_at` | **not synced in cleartext to peers; see §11.2 on the encrypted owner blob** | **IndexedDB** |

FSRS needs full per-item history; that history is **private state, not game state**. Merging them breaks both the privacy claim and the deterministic reducer.

**[D] Change from the parent:** `packages/net/src/storage.ts` currently defines a three-method `KeyValueStore` backed by `localStorage`. That is correct for identity and adequate for a single game log; it is wrong for the memory store. Add an IndexedDB-backed store for per-player memory. Keep the `KeyValueStore` interface for identity so the React Native shell is unaffected.

**Sizing — corrected under review, and the correction matters because the number was offered as reassurance.** Per-(player, item, **direction**) FSRS state is `stability: f32, difficulty: f32, last_review: f64` = **16 bytes**. The earlier row count dropped the direction. Worst case at the fixed bank: 2,700 items × 2 directions × 8 local players = **43,200 rows**, 691 KB of payload. **IndexedDB does not store 16-byte structs**: with keys, structured-clone framing and index entries the realistic footprint is 10–20×, i.e. **≈7–14 MB worst case — measure it, do not assume it.** The realistic live figure is far smaller, because **rows are created on first exposure**, so the bound is items-seen × players, which at the fortnightly cadence of §12.2 is a few hundred rows per player after a season. The review log dominates and is bounded by session count.

**Review-log schema — adopt the de-facto standard, because it costs nothing:**

Required: `card_id` · `review_time` (**milliseconds**, UTC) · `review_rating ∈ {1 Again, 2 Hard, 3 Good, 4 Easy}`.
Recommended: `review_state ∈ {0 New, 1 Learning, 2 Review, 3 Relearning}` · `review_duration` (ms).
Per-user: `timezone` (IANA) · `day_start = 4` (04:00 local, so a late-night session counts as one day).
Product columns: `player_id` · `mode (solo|group)` · `role (answerer|co_committed|observer|exposure)` · `format_tier` · `n_alternatives` · `bet_tier` · `chosen_option` (**not just correct/incorrect**) · `latency_ms` · `render_variant` · `substrate_id` (default `plain`) · `distractor_set` · `scaffolding_rung` · `eligible_for` · `crossed_a_sleep_period` · `voluntarily_initiated` · `turns_since_last_public_failure` · `score_delta_visibility (public|private)` *(new, for A/B 2)*.

**Dropped under review: `spoken_attempt`.** v1 has no audio, no speech input and no ASR anywhere in this document, so the column had no producer. If a say-it-aloud affordance ships, it returns as a game event — and it will be self-marked, so it is never a learning metric (§10.3).

`review_duration` is free to record now, impossible to reconstruct later, and is the only signal for "was this player actually looking at the screen."

### 11.2 Offline behaviour and the iOS eviction trap

**[F] strong.** iOS Safari evicts script-writable storage — IndexedDB, Cache API, service-worker caches — after roughly **seven days of non-use** for sites **not installed to the home screen**. That silently deletes exactly the returning-user history a fortnightly product depends on.

**[D]**
- Prompt **Add to Home Screen** on the first successful session, and say why.
- Treat local storage as **cache, not the primary store**. Make an explicit user-initiated **JSON export/import** the durable path.
- **This is in direct tension with "no server, no account," and the tension is resolved here rather than discovered in production:** the promise becomes *"no server we run, no account, and no game state anywhere except on the players' devices — and because of that, your history is a file you own and can move."*
- **[D] Export triggers, corrected under review — the old ones fired after the event they protect against.** Seven-day eviction with a fourteen-day trigger prompts a week after the data may already be gone, and at the fortnightly cadence §12.2 assumes, "every fifth session" is once per ten weeks. **Offer export at the end of every session on uninstalled clients, and every third session on installed ones. No gap-based trigger — a gap trigger cannot fire, because during a gap the app is not open.** Anything gap-shaped has to be a scheduled local notification or an on-open prompt, and an on-open prompt is by definition too late.
- **[D] Added under review: an encrypted-to-owner memory blob, replicated to peers.** The earlier "never synced to peers" made the memory store single-copy on a device whose OS deletes it, with a manual file as the only backup, and the privacy reason given did not support a rule that strong. This is already a P2P system with signed events and stable identities. **v1 ships the serialisation hook** (the memory store can emit a versioned blob, encrypted under a key derived from the owner's identity key); **v1.1 ships the replication lane.** Three constraints: the blob never enters the signed game log and is never replayable into the reducer, so determinism is untouched; peers cannot read it; and **the privacy promise changes and must change in the UI** — "encrypted to you, stored on your friends' phones, unreadable by them" is a different sentence from "never leaves your device," and it is opt-in. Honest limitation: the peers are the same four friends whose devices are also evicting, so this reduces the failure probability rather than eliminating it. The exported file remains the durable path.
- **Test the seven-day eviction case explicitly in QA.**
- Full offline: service-worker precache of the app shell, the font subsets, and the entire item bank. **No runtime fetch of any external host in the co-located path.** *(Corrected under review: the earlier absolute was contradicted by §11.4 #5. The cross-network mode is the one documented exception, labelled as such in the UI, and gate 11 enforces the empty allowlist for everything else.)*

### 11.3 Sync and the deterministic reducer

**[D]** The shared log stays exactly as today: append-only, signed, anti-entropy, per-turn nonce seeding option order. Two additions **and one threat-model ruling**:

1. **`pickItem` runs on the dealing device and its output is written into the `turn/drawn` event**, because the selection depends on private per-player memory state that no peer can see. Peers replay the event; they do not recompute the selection.
2. **Distractor sets are precomputed at build time** and derived as a pure function of `(item, exposure_count, seed)`. Generating them at runtime is too slow and non-deterministic, and phones will diverge. Because `exposure_count` is per-player local state and the option set must be identical on every phone, the **dealt player's** exposure count is the one that selects the tier, and it rides in the event. *(The earlier draft called (1) "the one place" purity is preserved by recording rather than deriving and then immediately added a second. There are two. Both are recorded.)*
3. **[D] Ruling on verifiability, added under review.** Moving selection and tier choice onto the dealing device converts a verifiable computation into an unverifiable assertion **in a competitive scored game**: a modified client can deal itself easy items and no peer can detect it. **We accept the exposure — the threat model is four friends at a table, and social detection is the real enforcement — and we bound it cheaply:** peers verify that the dealt item is a member of the shipped bank, that the declared tier matches the tier the declared exposure count selects, and that the declared per-(player, item) exposure count is **monotone non-decreasing** across the log. That catches the naive cheat and costs a few lines in the reducer. It does not catch a careful one, and we are not going to pretend otherwise.

### 11.4 Transport — the two external hosts that must go, and the signalling channel that was never specified

**[F] strong.** There is **no browser API for local peer discovery on iPhones**: Web Bluetooth is unimplemented in Safari on iOS and macOS at every current version; WebRTC data channels are universally supported but require out-of-band signalling.

Current `packages/net/src/transport.ts` uses `trystero/nostr` for discovery, plus `stun.cloudflare.com` and two TURN providers (`free.expressturn.com`, `global.relay.metered.ca`). **Every one of these is an external host that must be reachable from inside China, and public Nostr relays are the least predictable of them.**

**[D] The unexamined gap, and the ruling it forces.** Dropping STUN/TURN removes NAT *traversal*. **Discovery and signalling are a separate problem, and the earlier draft solved neither** — "star topology, one session host, join code by QR — as today" inherits `trystero/nostr`, which is the external host the section just declared must go. A QR code can carry the host's offer; **nothing in the document said how the answer gets back to the host.** That is the difference between working and not working in the Chengdu basement this section is written for. Therefore:

1. **Pass-and-play on one device is v1's primary co-located mode, not a fallback.** The earlier draft called it "the only genuinely zero-dependency option, and the mode that works in a restaurant basement" and then ranked it third. It is the only mode with no signalling problem, no AP-isolation problem, and no mixed-phone problem, and the co-located literature this design leans on is substantially about shared-device play. Ship it first, with the "Hand to ⟨name⟩ — tap when ready" interstitial.
2. **Multi-device co-located ships as an experimental second mode, on scan-back QR signalling**: host displays an offer QR (host candidates only, no trickle), joiner displays an answer QR, host scans. **Gate on a measurement:** compress a host-candidate-only SDP and confirm it fits a QR at a module density that scans reliably across the test phones, at four players (three scan-backs). **If it does not fit, multi-device co-located does not ship in v1** (§12.1 #17).
3. **Configure an EMPTY `iceServers` array explicitly** for the co-located path, never inheriting a library default. Host candidates only. *(The parent already learned the adjacent lesson the hard way: Trystero's `turnConfig` unconditionally prepends four default public STUN servers, and Firefox slows ICE gathering past five URLs — hence the existing `rtcConfig` override. Take that override to its conclusion: remove `trystero/nostr` from the co-located path entirely; gate 11 enforces it.)*
4. **Make the game state machine transport-agnostic**: a pure reducer over `{playerId, itemId, choice, elapsedMs}` with same-device handoff, `BroadcastChannel` and WebRTC datachannel swappable underneath.
5. Keep the current STUN/TURN path as a **separate, explicitly-labelled cross-network mode** for players who are not co-located, with an honest note that it touches third-party relays — the one documented exception to §11.2's no-external-fetch rule.
6. **Take a Screen Wake Lock for the session.** Supported everywhere and never mentioned in the parent.
7. **[D] Test on an AP-isolated guest network, not only in aeroplane mode plus hotspot.** Restaurant, hotel and café Wi-Fi routinely run AP/client isolation, which blocks host-candidate connectivity between phones on the same SSID — so the old QA instruction tested the case that works. **Detect the failure on a bounded ICE timeout (8 s) and fall back to pass-and-play automatically rather than hanging in gathering.** A four-player co-located game whose peers cannot discover each other in the country it was built for is a total product failure, not a degradation.
8. **[D] Before ship: enumerate every external host the PWA touches at runtime and confirm each is reachable from a mainland vantage point.** Fonts and STUN were the two that were missed; gate 11 now enumerates automatically, and the manual step is only the reachability check.

### 11.5 CJK font subsetting — measured, not assumed

**[F] strong, measured with fontTools/pyftsubset.** `@fontsource/noto-sans-sc@5.3.0`'s named `chinese-simplified` woff2 @400 is **1,142,552 B = 1.09 MB**, containing 7,946 codepoints / 7,333 CJK ideographs — **not 4–5 MB and not ~44k glyphs**. Its *default* `index.css` uses ~97 numbered unicode-range chunks (2.27 MB total at w400, mean 24 KB each). Full `NotoSansSC-Regular.otf` = 7.95 MB; VF = 15.05 MB.

Subset sizes, near-linear at 109–137 bytes/glyph, with `--layout-features=` stripped, `--no-hinting`, `--desubroutinize`, plus 121 Latin/punctuation codepoints:

| Bank size | woff2 |
|---|---|
| 300 hanzi | 44.7 KB |
| 600 | 84.9 KB |
| 900 | 123.5 KB |
| **1,200** | **164.0 KB** |
| **1,500 (fixed bank, interpolated at 141 B/glyph)** | **≈206 KB** |
| 2,000 | 277.4 KB |
| 3,000 | 418.6 KB |

**Coverage verified:** the `chinese-simplified` subset contains all 3,000 HSK 3.0 characters **and** 焗 煲 涮 菌 藕 韭 笋 蒜 姜 葱 炝 烩 氽 煨 熘 腌 蕈 蚝 蛏 鲈 鳕 鳝. **Tofu risk from the typeface is zero.** The risk is created entirely by our own codepoint-extraction step.

**[D] Decision: subset. The ruling is unchanged; the reason given for it was wrong and is replaced.** The earlier draft justified subsetting by placing the bank "below the ~2,000–2,500 crossover." **There is no crossover in that region.** The full `chinese-simplified` woff2 is 1,142,552 B for 7,946 codepoints = 144 B/codepoint, and the subsets run 109–137 B/glyph; the curves do not meet until the subset *is* the whole file, near 7,900 characters. At 3,000 characters a subset is 418.6 KB against 1,116 KB — still a 2.7× win. **Correct statement: subsetting wins at every bank size we could plausibly ship.** The invented figure was decisive in a bolded ruling and was wrong by a factor of three.

**[D] Font payload at the fixed bank:**

| Component | Size |
|---|---|
| Noto Sans SC 400 · Noto Sans SC 500 · Noto Serif SC 400, 1,500 hanzi each | ≈620 KB |
| Two held-out test faces over the ~400-character test inventory | ≈113 KB |
| One installed city pack, delta for Sans 400 only (≈600 new codepoints) — [D] estimate, measure at first pack | ≈85 KB |
| **Total with one city pack installed** | **≈820 KB** |

Generate every subset at build time **from the union inventory of the item bank, the shipped city packs and the test blocks**, so a face can never drift from the content, and precache all of them in the service worker.

```
pyftsubset NotoSansSC-Regular.otf \
  --text-file=bank-chars.txt --flavor=woff2 \
  --layout-features= --no-hinting --desubroutinize
```

**[D]** Because we subset, **CI gate 1 (§9.3) is mandatory and non-negotiable** — it is the only thing standing between us and tofu boxes on a customer's phone with no network to recover. **Its scope was too narrow and is now the union inventory across every face**, because §11.6's city packs were outside it entirely. Include the Latin Extended ranges for tone-marked vowels explicitly; naive subsetting drops them routinely and they are load-bearing here.

**[D]** Give each subset a distinct internal family name (`Kanbudong Sans SC`, and equivalents for the test faces) so no Reserved Font Name or trademark question can arise. Ship `OFL.txt` for every face.

### 11.6 City packs

**[D] Kept, with four corrections — as written the feature voided the guarantee §11.5 calls non-negotiable.**

Per-city station-name packs as separately downloadable bundles — `city/beijing.json` with ~400 station names, `city/shanghai.json`, etc., cached locally, selected at onboarding ("where are you going?"). Without the packs the transit strand teaches 开往 and then shows a station name the player will never see.

1. **Codepoint coverage.** Beijing and Shanghai station names contain 苹 磁 潘 苑 芍 汶 莘 漕 泾 蓝 罗 潭 and dozens more that no 1,500-character survival bank contains. The font subset was generated from the item bank, and the packs are not the item bank, so gate 1 never saw them — producing exactly the failure §11.5 says the gate exists to prevent: tofu, on a downloaded pack, in-country, with no network to recover. **Gate 1 now covers the union of the bank and every shipped pack, and each pack ships its own font delta for the one face that renders station names.** Pack size is therefore ~20–40 KB of JSON **plus ~85 KB of font delta**, and that is what gets quoted.
2. **Determinism.** §11.3 forbids runtime distractor generation because phones diverge, and the earlier text generated transit distractors procedurally from a pack that not every phone has installed — the exact divergence the rule exists to prevent. **Transit distractors are precomputed per pack at build time** (`开往{terminus}方向` with three sibling termini from the same network), as a pure function of `(item, exposure_count, seed)`. Gate 12 enforces it.
3. **Authorship.** §9.1 claims all distractor sets carry `whyPlausible`, and procedural termini carried none. **Every precomputed transit distractor carries an authored `whyPlausible`** — which is cheap, because the reason is the same shape every time: same line, adjacent terminus, differing in one or two characters.
4. **Provenance.** The packs named no source and no licence, and gate 2 fails an unsourced column on sight. **Station-name provenance goes in the manifest before the first pack is built** — prefer Wikidata (CC0); OSM (ODbL) is usable but its share-alike-on-derived-database duty puts it in the quarantined-artefact path with the gloss (§12.1 #14).

### 11.7 Audio

**[D] None in v1.** Store `pinyin_citation`, `pinyin_surface` and `audio_ref` on every item from day one. Store a per-user `audio_enabled` flag defaulting **off**, and guarantee that a player who never plays audio can reach every item and every score tier.

When audio is added: **pre-render at build time** for the finite bank using a commercial TTS whose terms grant output rights; **Opus 24 kbps mono** in Cache Storage with per-item eviction; autoplay **at reveal only**, never simultaneous with the item; **render surface (post-sandhi) pinyin whenever audio plays**. **Never the Web Speech API** — the `zh-CN` voice is frequently absent on iOS Safari and synthesis requires a user gesture, so it fails exactly at a table with mixed phones.

**[D] Recomputed at the fixed bank, and the old figure was quoting a smaller product:** 2,700 items × 1.5 s × 3 kB/s ≈ **12.2 MB**, not ~5 MB. That is the number any future audio decision argues against.

**Budget honestly, once — and the honest statement is that there is no budget.** The "3 MB install budget" that decided the stroke-data ruling in §9.2 appears once in this document, was derived from nothing, and was never reconciled with an audio plan that would have been 167% of it (and is now 407% of it). **It is withdrawn rather than replaced.** What exists is a measured v1 payload — ≈820 KB of fonts plus the app shell and the item bank — and an open item (§12.1 #16) to derive a real ceiling from install-conversion data before audio is scheduled. As specified, v1 buys neither photographs nor audio nor substrates, and that is what makes a full offline precache of the whole bank feasible.

### 11.8 Modelling stack, and why the bans

`ts-fsrs` (FSRS-6 pretrain-4) for the player side · a two-scalar Elo per item (`θ_i`, `n_i`, `K = 0.4/(1 + 0.05·n)` — **[D]** reasonable starting values, not published ones) for the item side, where FSRS has no mechanism · a **six-feature logistic regression** over counts as the general learner model.

**[D] The six features, named under review** (the earlier line was precision about a thing with no content): (1) prior correct on the item; (2) prior incorrect on the item; (3) log elapsed time since last exposure; (4) prior correct on the item's component set; (5) prior incorrect on that component set; (6) presentation difficulty of the current trial (`format_tier` × `n_alternatives`).

**[D] Target retention, corrected under review, and a consistency bug it exposed.** §12.1 #1's objective targeted 0.85 while FSRS's own default request retention is 0.90 — **a selector and a scheduler pulling against each other, which is a bug and not a tuning choice.** Both are set to **0.90**, and if either moves, both move. The squared loss is also replaced: it treated early and late symmetrically, and they are not symmetric — reviewing early is cheap waste, reviewing late loses the item. Use `U(i) = −Σ_p w_p [3·max(0, R* − R_p)² + 1·max(0, R_p − R*)²]` with `R* = 0.90`. **[D] The weights 3 and 1 are an unmodelled guess**, marked as one, and are the first thing to fit once there is data.

**No neural knowledge tracing. No BKT. No half-life regression. No hand-rolled SM-2.** **[D] Reasons, added under review — this was the one paragraph in the architecture section with no argument in it at all:**

- **Neural KT / DKT:** deep knowledge tracing does not reliably beat far simpler models, and for a cold-start PWA it is strictly worse (Gervet et al. 2020, *JEDM* 12(3), 31–54; Wilson et al. 2016, EDM; Xiong et al. 2016, EDM). Uninterpretable, and we would be fitting it on a few hundred rows per player.
- **BKT:** models binary skill mastery with no forgetting curve and no spacing sensitivity. Wrong shape for a product whose entire thesis is retention across gaps.
- **Half-life regression:** this one needs care, because HLR is the model the source digest *recommends* as the deployed baseline for exactly this product shape (Settles & Meeder 2016). **The ban stands on supersession, not on merit:** HLR fits a single exponential half-life from features, FSRS fits stability and difficulty with a benchmarked update rule over a far larger open dataset, and shipping both means maintaining two schedulers. If FSRS's calibration check (§10.1) fails in our population, **HLR is the designated fallback**, not a rejected idea.
- **Hand-rolled SM-2:** strictly dominated by FSRS on the same public benchmark, and we would be maintaining it ourselves.

### 11.9 The solo daily surface

**[D] Added under review. §12.2 calls this "the one structural commitment this document asks for beyond the fork" and "where the product's best-evidenced mechanism lives" — and then §§9–11 specified nothing for it: no UI, no session shape, no selection rule beyond "`pickItem` degrades to the single-player case for free," and not one metric of its own. That gap is exactly how the inversion in §12.2 becomes a year-two discovery instead of a v1 hedge.**

- **Reachability.** One tap from the home screen, in the first release. Never described internally or externally as "practice mode."
- **Session shape.** A fixed short session: ends when the FSRS due queue empties or at ~40 retrievals, whichever comes first — target ~7 minutes. No end-of-session score, no streak, no "you're on fire."
- **Selection.** Single-player FSRS due queue first; then the `high_confidence_miss` requeue; then component-contrast injections for items whose confusion matrix is warm. `pickItem` with a single-element weight vector, so it is literally the same function.
- **Rendering.** Plain (§10.2, A/B 1's default arm), with render variation across typeface, ground and size so that transfer measurement works here too.
- **What it does not get, because none of it applies:** opponent-dealt items, bet tiers, `co_committed`, public failure, the group objective, the live standing. Every diagnostic in §10.1 that is group-shaped is reported `mode = group` only, and the solo surface has its own series.
- **Its own metrics.** Volume at criterion and calibration (as §10.1, `mode = solo`), retrievals at ≥7-day gap per item, self-initiated opens, and `days_between_sessions`. **Streak length is not a metric here or anywhere** (§10.3), and the surface must not be built in a way that makes streak the only thing a user can see.
- **Notifications.** At most one local notification per day, opt-in, never streak-guilt framed. This is the only lever the product has on `days_between_sessions`, and it is A/B 3's manipulation if a slot opens.
- **Relationship to the party game.** Shared bank, shared scheduler, shared memory store, shared reveal. The party game is how people find it and why they come back to a table; this is where spacing happens.

---

## 12. Open questions and the biggest risk

### 12.1 Genuinely unresolved

| # | Question | Why it is open | How it gets closed |
|---|---|---|---|
| 1 | **The group selection objective** | There is no prior art for group SRS. The objective is reasoned from first principles and is the least-evidenced component in the product. Now `U(i) = −Σ w_p [3·max(0, R*−R_p)² + max(0, R_p−R*)²]`, `R* = 0.90` aligned with FSRS request retention; the 3:1 asymmetry is an unmodelled guess | Read Upadhyay et al. (2021) and Tabibian et al. (2019) in full **before writing `pickItem`**. Log the counterfactual from day one so the objective can be A/B'd without touching storage |
| 2 | **Shared-morpheme confusables** (出口/入口, 门口/窗口) | A fourth confusion category **no cited study covers**, and it is what most of the design's own flagship examples are | Instrument separately. Do not assume it behaves like the form-confusable case — **and the remedy is now an arm, not an action** (§10.1) |
| 3 | **Object templates vs plain rendering** | The most expensive part of the build, and the evidence is genuinely contested (encoding specificity for, environmental-print logo-reading against) | **Default reversed: plain ships, templates are the challenger** (§10.2 A/B 1). Retirement read at week 16; a null deletes the substrate code |
| 4 | **Dutch vs English glossing** | No study of Dutch–English bilinguals learning Mandarin exists. The L1 advantage is small (g ≈ 0.33) and measured on glosses met while reading text, which we do not have | Both fields authored from day one; A/B on delayed accuracy, not on preference |
| 5 | **Does public failure suppress participation?** | No controlled study exists in a language-learning game, in either direction | `turns_since_last_public_failure` as a stored field, analysed as an **observational** contrast with `θ_i` and prior accuracy as covariates; the randomised version rides A/B 2's per-turn public/private delta |
| 6 | **Colour-marking the discriminating component in the reveal** | The prohibition rests on an RT main effect in one study nobody read in full, and runs against a meta-analytically supported signalling principle | A/B on **delayed discrimination accuracy**, never on RT. Cap simultaneous highlights at one |
| 7 | **A finger-trace on the reveal** | Handwriting is the best-evidenced Chinese-specific encoding manipulation *and* loses on an opportunity-cost design at equal time. Neither literature tests the other's manipulation | Build it as an explicit experiment or not at all: differing component only, resolution screen only, form-confusable pairs only, never on the timed card, never required. Dependent measure = delayed discrimination accuracy. Ship behind a flag with `(mode, seconds, subsequent accuracy at d1/d7)` logging. **Prerequisite, named under review: this needs Arphic-licensed stroke data, so the designated-place repo (§9.2) must be scheduled and staffed before the experiment is planned.** A cheaper substitute exists if that is unpalatable — a component-assembly item type (tap the 2–3 components that compose the character, in position) buys the forced attention to internal structure at ~6 s instead of ~30 s, with no licence exposure |
| 8 | **CTW commercial grant** | NC gates any shipped artefact derived from its annotations, including a published held-out set and any frequency column | Ask the authors. Route (b) — internal research input only — is defensible and free in the meantime. *(The earlier claim that this was "the only open licensing item" was false by §9.2's own table; see #14 and #15.)* |
| 9 | **Mainland reachability** | Google Fonts blocking, Nostr relay reachability, and STUN/TURN host reachability were **not verifiable from this environment** — **and, added under review, app-store reachability, which is now the actual argument for staying a PWA** (§9.3) | Confirm from a mainland vantage before ship. The engineering fixes are correct regardless |
| 10 | **Four papers nobody read, each load-bearing** | Cao et al. (2013, *J. Neurolinguistics* 26(4), 440–461) — the only three-month Chinese-specific follow-up and the true source of the chunking arithmetic · Brunmair & Richter (2019) — the composition and intervals of the "words" moderator cell · Higa (1963) — the **direction** of the antonym effect, which decides whether 入口/出口 is the worst case or the easy one · Li, Shi & Wang (2025) — the retention interval behind the paired-presentation and colour results | Read in full before the build spec freezes. Mark every claim `verified_at: abstract \| full-text` rather than a blanket disclaimer. **Escalated under review: Higa now gates a content decision, not just a citation.** The confusion-matrix diagnostic is already direction-agnostic — it fires on observed confusion whichever way the effect runs — but the *bank* is not: making antonym pairs the flagship co-presented pairs assumes they are hard. **Read Higa before the antonym-pair policy freezes, or author the pairs without co-presentation until it is read** |
| 11 | **GB standards not retrievable** | GB 2894 colour values, GB/T 30240's part list, GB 7718's 2025 revision status | Verify before any of it appears as taught content. Nothing about the 2025 allergen revision ships until someone reads the standard |
| 12 | **无座 pricing on G/D services** | Asserted from record; all `.cn` hosts unreachable | Verify against China Railway 12306 fare rules before content lock |
| 13 | **Component decomposition seed data** *(new)* | Unihan ships no component decomposition — `kRSUnicode` is a radical-stroke index — so the earlier "regenerate from Unihan + CC-CEDICT" plan named no file it could actually use | Ruled: **author 1,500 decompositions in-house** (§9.1). The residual open item is only whether a permissive IDS source exists at the Unicode version we pin that could seed the work; if not, the two person-weeks stand |
| 14 | **City-pack station-name provenance and licence** *(new)* | §11.6 named no source at all, and gate 2 fails an unsourced column | Wikidata (CC0) preferred; OSM (ODbL) usable via the quarantined-artefact path. Resolve before the first pack is built |
| 15 | **Tatoeba per-sentence corpus licence** *(new — listed to retire #8's "only")* | Code is AGPL-3.0 (verified); the corpus licence could not be verified | Nothing depends on it, because the register argument already excludes Tatoeba. It stays on the list so the licensing position is not overstated |
| 16 | **The install budget** *(new)* | No install budget has ever been derived in this document; the "3 MB" that decided the stroke ruling was an invention and is withdrawn | Derive a real ceiling from install-conversion data before audio (≈12.2 MB) is scheduled |
| 17 | **Whether multi-device co-located can ship at all** *(new)* | Scan-back QR signalling depends on a compressed host-candidate-only SDP fitting a scannable QR across the test phones, three times over at four players | Measure it. If it fails, v1 ships pass-and-play only, which §11.4 has already made the primary mode |
| 18 | **Power for the randomised public/private experiment** *(new)* | "n ≈ 200" was an invention in a document that computed an SE to three decimals elsewhere. No n makes an observational contrast an experiment, and the randomised version's power depends on a within-player latency SD we have not observed | Compute from the first cohort's observed SD, before launch. The number goes in this document then |

### 12.2 The single most likely way this design is wrong

**The spacing hole. It is not a risk to a feature; it is a risk to the thesis.**

Spacing across days is the best-evidenced manipulation in L2 vocabulary learning — g = 0.40 on delayed tests across 98 effect sizes and N = 3,411, and 1.6× on the closest single study (P2). Every other lever in this document is smaller. And **a co-located party game cannot deliver it**, because it is played when friends happen to meet, which is fortnightly at best.

Trace the failure through the architecture. If the median inter-session gap is fourteen days: the two-bit consolidation state never advances past `acquired`, so the confusable panel never unlocks and competitive distractors never unlock and the component-contrast card type never fires; the FSRS scheduler runs on items that were seen once, weeks ago, so every retrieval is effectively a first retrieval; `signsActionable` barely moves; the `high_confidence_miss` queue is the only repetition anything ever gets. The item bank would be correct, the selection function correct, the reveal correct, the typography correct — **and the product would be a good party game that teaches almost nothing durable.**

**[D] Corrected under review:** the earlier draft ended that paragraph with "Six well-spaced retrievals per item collapse to two," four paragraphs after §10.4 forbids assuming the 6–10 figure — and it was the sentence carrying the emotional weight of the whole argument. Restated without the borrowed number: **whatever the true retrievals-to-stable-recall figure is, a fortnightly cadence delivers a small integer of them per item per season, and the ratio between the massed and spaced cases is precisely what the falsification instrument below measures.**

Note what makes this specifically dangerous rather than merely uncertain: **every in-session signal would look fine.** Accuracy inside a session would be healthy, players would report having fun, and the metric that would catch it — volume at criterion, with its calibration check, at weeks 8/16/24 — is precisely the one the experimentation policy exists to protect and that a team under pressure drops first. Add the metacognitive-illusion finding and the enjoyment/anxiety-independence finding, and you have a product that can be simultaneously well-liked, well-rated, well-retained on engagement metrics, and ineffective.

**The falsification test, decided in advance so it cannot be argued about later — rewritten, because the earlier version had three escape hatches built into it.**

The old rule was conjunctive ("multiplayer gap > 7 days **while** the solo gap sits under 3"), so the worst realistic case — multiplayer at 20 days, solo at 3.5 — did not fire it. It compared two different self-selected populations, so even the descriptive claim was confounded. And it named no n, no window and no date, in a rule whose entire purpose was that it could not be argued about later.

> **[D] If the median multiplayer inter-session gap exceeds 7 days across the first 100 players observed for 8 weeks, the architecture inverts.**
> **Single condition. Decision date: week 12 after first public release. Owner: ⟨name — fill before this document is committed⟩.**

**[D] "Inverts" means, operationally, all five of these:** (1) the solo daily surface becomes the default launch destination and the party game moves behind a "Play with friends" entry; (2) roadmap priority flips — solo-surface work outranks multiplayer work for two quarters; (3) the single-player case becomes `pickItem`'s default and the group objective becomes the special case; (4) store listing and copy lead with the solo product; (5) the group objective leaves the critical path for any new feature.

**[D] Where I keep a position the review attacked.** The review says the solo gap "is irrelevant to whether the party game can deliver spacing and is not part of the trigger." That is right about the *trigger* and wrong about the *response*: the solo gap is a **readiness check on the remedy**, because inverting toward a surface nobody opens fixes nothing. So it is read at the same decision point, not as a condition on firing but as a fork in what firing means — **if the solo gap is also above 7 days, the finding is not "the architecture is wrong" but "the product does not deliver spacing at all,"** which requires re-examining the premise rather than reordering the screens, and is a worse result.

**[D] Therefore, from v1, and this is the one structural commitment this document asks for beyond the fork:** the solo daily surface ships in the first release, is reachable in one tap from the home screen, and is never described internally or externally as "practice mode." **It is now specified, in §11.9** — the earlier draft made the commitment in a sentence and specified nothing, which is exactly how the inversion becomes a year-two discovery.

**The party game's claim, downgraded to what the evidence carries.** The earlier draft rescued the fork with "genuinely well-evidenced for engagement (co-located play produces the highest enjoyment and perceived social presence of any play configuration)" — placed immediately after conceding the learning claim, and doing the work of keeping the existing build. The source digest that generated §11.4's whole transport section closes its co-located survey with *"All qualitative/small-n; no controlled learning-outcome study located."* A qualitative, small-n literature cannot support a superlative across all play configurations, and enjoyment and perceived social presence are **self-reported constructs that §10.3 bans**. The learning side was being held to a standard suspended for the one claim that saved the fork. Restated:

> **Co-located play is reported as highly enjoyable in a qualitative, small-n HCI literature (e.g. Kappen et al., CHI PLAY '14) with no controlled learning-outcome study located. We accept that as a reason to build it and we do not book it. The engagement claim is measured from v1 on the same terms as the learning claim — sessions/week, self-initiated opens, 8-week retention — and never on enjoyment ratings.**

**A second-order risk, named because it is the next most expensive — and now handled by reversing a ruling rather than by watching it.** The object templates may be teaching plates rather than characters (Masonheimer, Drum & Ehri 1984). The earlier draft called them the most expensive part of the build on genuinely contested evidence and then shipped them as the default arm, with the cheap arm as challenger and a tripwire at an invented 20-point gap — an arrangement in which "inconclusive," the most likely outcome at this product's n, resolves as *keep*. **The burden of proof belonged the other way and has been moved: plain rendering is the v1 default; the templates are the challenger; a null retires them at the week-16 read** (§10.2). What changes in the build: the five CSS substrate templates leave the v1 critical path and are not a §9.1 asset; every item must render correctly with `substrate_id = plain`; surface variation for the transfer metric comes from typeface, ground and size instead of substrates; and the freed design budget goes to §11.9's solo surface and to the 1,500 in-house decompositions. If the templates lose, we will not have spent the design budget teaching enamel.

---

*Every number in this document marked **[D]** is ours. Every number marked **[F]** carries a source, a strength grade and a scope note. **Added under review: a **[D]** number must be followed by its derivation, or by the words "unmodelled guess." A bolded ruling may not rest on an unmarked number.** If a line has neither mark, it is prose and should not be cited.*

---

## Changes made under review

### Rulings reversed — these change the build

| Ruling | Was | Now | What changes |
|---|---|---|---|
| **Primary metric** (§10.1) | Delayed accuracy at ≥7-day gap on an unseen substrate | **Volume at criterion** — items with FSRS stability > 21 days, per player, at weeks 8/16/24, roles `answerer`/`co_committed`; delayed accuracy demoted to a calibration check | Every A/B outcome, every tripwire and the falsification rule now report against a number the scheduler cannot pin. Same log, no new storage |
| **Object templates** (§10.2, §12.2) | Ship as default, A/B as challenger, tripwire at a 20-point gap | **Plain rendering is the default; templates are the challenger, with a week-16 retirement read** | Five CSS substrates leave the v1 critical path; `substrate_id` defaults to `plain`; transfer variation moves to typeface × ground × size; budget goes to §11.9 and the decompositions |
| **Co-located transport** (§11.4) | Star topology over WebRTC "as today," pass-and-play third as a fallback | **Pass-and-play is the primary v1 co-located mode**; multi-device is experimental and gated on a QR/SDP measurement | The signalling channel — never specified, and inherited from `trystero/nostr`, the host the section says must go — stops being a hidden dependency. AP-isolation test and automatic 8-second fallback added |
| **Decomposition data** (§9.1, §9.2) | "Regenerate from Unihan + CC-CEDICT" | **Author 1,500 decompositions in-house** | Unihan ships no decomposition (`kRSUnicode` is radical-stroke), and CEDICT-derived data is BY-SA and cannot sit in the "authored by us" column. ~2 person-weeks; gate 3 becomes checkable |
| **"Stay a PWA"** (§9.3) | A platform ruling derived from a licence clause | **An asset-serving ruling; the platform is decided on its own merits** | Licensing no longer forecloses the App Store. The PWA is kept on an argument the review missed — see below |
| **Spacing-coefficient A/B** (§10.2) | One of two v1 slots | **Dropped; the ramp is decided by fiat and not built** | Flat ridgeline, mismatched outcome, self-selected sample. The slot goes to score visibility |
| **Live losing-order removal** (§10.2) | Shipped as "cheap and harmless either way" | **Not shipped; it becomes A/B 2** | Gain-framed copy and no red negatives still ship — those really are near-zero-cost |
| **60-item yes/no check-in** (§10.3) | Demoted, then reinstated as placement | **Deleted** | One cold-start instrument, not two before the first game |
| **Photography** (§9.2) | A ruling about a marketing line | **A ruling about the practice**: Art. 6(1)(f) with a written balancing test, no persons in frame, EXIF stripped, no route capture, 12-month retention — and the copy follows | If the balancing test is not written, the practice stops |
| **School channel** (§8) | "A distribution wedge into a small, enumerable list of schools" | **Out of scope for v1 and unbudgeted**; the two columns keep the SKU possible | Art. 8 / UAVG-16, processor obligations and the "HSK"-in-metadata ban all point the same way |

### Fixed as found

- §10.1's "≥7 days **and** ≥1 sleep" redundancy (column kept, conjunction dropped); missing `role` filter.
- §10.1's "a real experiment at n ≈ 200" → an observational contrast with covariates, plus the randomised design that would be an experiment.
- §10.1's cross-association remedy → randomised arm, per §12.1 #2's own warning.
- §10.1's anxiety diagnostic → residualised on `θ_i` and prior accuracy; ACT scope note added.
- §10.3's replacement instrument → no photograph, no self-rating; four-alternative gloss production in held-out faces.
- §10.3's MDE → 38 points at 80% power, not 27 at significance.
- §10.4's d28 → now carries A/B 1's co-primary and the retirement read.
- §11.1 sizing → 43,200 rows not 24,000 (direction restored), ≈7–14 MB not 400 KB, plus the realistic exposure-bounded figure.
- §11.1 → `spoken_attempt` dropped; `score_delta_visibility` added.
- §11.2 export triggers → every session (uninstalled) / every third (installed); no gap trigger, because a gap trigger cannot fire.
- §11.2 → encrypted-to-owner memory blob replicated to peers, hook in v1, lane in v1.1, with the privacy promise rewritten.
- §11.2/§11.4 contradiction → "no external fetch" scoped to the co-located path, with gate 11 enforcing it.
- §11.3 → "the one place" was two; both now stated. Verifiability of device-side dealing ruled on and bounded.
- §11.5 → the "~2,000–2,500 crossover" was wrong by ~3×; ruling kept, reason replaced. Gate 1 scope widened to the union inventory across every face.
- §11.6 → city packs now inside gate 1, distractors precomputed with `whyPlausible`, provenance required.
- §11.7 → audio recomputed at 12.2 MB; the 3 MB install budget withdrawn, not replaced.
- §11.8 → four bans given reasons; six features named; target retention aligned at 0.90 and the loss made asymmetric.
- §12.1 #8 → "the only open licensing item" retired; #13–#18 added.
- §12.2 → the "six retrievals" sentence (banned by §10.4 four paragraphs earlier); the engagement superlative; the conjunctive falsification rule, now single-condition with n = 100, an 8-week window, a week-12 date, an owner field, and a five-point operational definition of "inverts."
- §11.9 written from nothing: the solo surface now has a session shape, a selection rule, a rendering, its own metrics, a notification policy, and an explicit list of what does not apply to it.
- Gates 11–14 added (external URLs, city-pack distractors, CTW-tagged columns, BY-SA leakage); gate 3 restated as a closed `source` tag set plus lockfile absence, because the old form required keeping the LGPL file in the build image; gate 4's purpose stated and multi-valued `kTotalStrokes` handled.
- §9.2a added: the bank's ordering signal, previously implicit — CTW signage frequency as an internal authoring input, HSK band as tiebreaker, TGH tier as floor, and no CTW-derived column shipped.
- §11.0 added: bank size fixed at 1,500 + 1,200 and propagated through fonts, stroke costing, audio and storage.

### Kept, with the disagreement stated

- **The PWA.** The review is right that the licence clause does not decide the platform, and the ruling is rewritten — but the PWA is kept anyway, because on iOS "separately-fetched, non-DRM'd" cannot mean "in the app bundle," so an App Store build would need a first-run fetch from a host we operate, which collides with the offline guarantee and re-opens mainland reachability for a host we would have to keep reachable from inside China.
- **Volume at criterion is not scheduler-proof.** Adopted as primary, but the review's framing — "volume is what a scheduler cannot pin" — is too strong: stability is a model estimate, so a miscalibrated model inflates volume as directly as a calibrated one pins accuracy. Volume and the calibration check are reportable only as a pair.
- **`answerer` and `co_committed` are not pooled.** The review's role filter is adopted, but committing alongside is not the same retrieval event as answering, so they are two series until measured to behave alike.
- **The solo gap stays in the decision, out of the trigger.** The review is right that it does not belong in the firing condition; it is retained as a readiness fork on the response, because inverting toward a surface nobody opens is not a remedy — and if both gaps exceed 7 days, the finding is worse than an architecture error.
- **The confusion-matrix diagnostic is already direction-agnostic.** The review's §2.3 asks for it to be made so; it fires on observed confusion whichever way Higa's effect runs. What actually assumes a direction is the *content* choice to make antonym pairs the flagship co-presented pairs, and that is what is now gated on reading Higa.
- **Half-life regression stays banned, but as the designated fallback**, not as a rejected idea — the review is right that the digest recommends it, and the ban rests on supersession by FSRS plus the cost of maintaining two schedulers, which is now stated instead of asserted.
- **Tatoeba stays out on register**, not on the unresolved corpus licence — the licence is listed as open (§12.1 #15) so the licensing position is not overstated, but nothing depends on it.