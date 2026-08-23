# 看不懂 — design document, revised under adversarial review

*Scope: this revision covers the tail of §8 and §§9–12 — the portion that was submitted to review. §§1–7 were not in the reviewed excerpt and are not reproduced here; three rulings below (bank size, primary metric, default rendering) contradict text in §§1–7 and are marked as normative until those sections are updated to match.*

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