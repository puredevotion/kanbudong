## 7.3 Transit

A metro sign is read positionally before it is read lexically. Before a player decodes a single character, the plate has already told them most of what they need through geometry, and teaching the geometry first is what converts twelve characters into a working skill. Every Chinese metro station is signed with four object classes, and they are visually distinct enough that a learner can be trained to sort them in under a minute:

1. **The overhead gantry** — dark blue or black, wayfinding arrows, line roundels in the line's own colour, exit letters in white on black tabs. This is the plate that gets you out of the station.
2. **The platform edge / screen door band** — line number, this station, previous and next station, and the crucial `开往 ⟨terminus⟩ 方向` strip that tells you which of two identical-looking platforms you want.
3. **The gateline** — `进站` / `出站`, `安检`, fare-machine fascia, and the paid/unpaid boundary. Errors here cost money.
4. **The wall-mounted timetable panel** — `首末班车时间`, small type, high density, the one plate a visitor reads slowly and standing still.

The curriculum ships these as four object templates before it ships their vocabulary, and the first transit item a player ever sees is a template-identification item, not a character item. **Ordering: judgement.** No corpus tells you that layout precedes lexis; it follows from the fact that the arrows and colours are language-independent and already carry the illocutionary force, so the characters are doing confirmatory work.

The strand splits cleanly by item type, and this split *is* measured. Every character in the metro core sits in the early official bands — 站 站 出 口 入 换 方 向 号 车 all first- or second-band — but the compounds do not: `换乘`, `进站`, `出站`, `首班`, `末班`, `单程`, `开往`, `号线`, `候车`, `检票`, `取票`, `硬座`, `软卧`, `二等座` are all absent from every one of the eleven HSK 3.0 levels, while `安检` and `站台` appear only at band 6 and `车厢` only at 7–9. So transit items are **compound-parsing items, not character-acquisition items**: the player already owns the pieces and the barrier is that the whole is opaque. That is a different card and a different failure mode from the menu strand. **Ordering within the strand: corpus-grounded** — character-level ordering follows corpus rank where nothing else overrides it.

### Metro core

| hanzi | pinyin | English | Dutch | tier | why it earns its place |
|---|---|---|---|---|---|
| 站 | zhàn | station, stop | station, halte | 0 | Rank 531. ⿰立占 — 立 "stand" + 占 zhàn as a clean phonetic, one of the few transparent phonetics in the strand. Also the tail of 加油站, 火车站, 车站. |
| 出口 | chūkǒu | exit | uitgang | 0 | 出 is rank 26, 口 rank 157. Taught as an atomic unit, never decomposed. On a blue or black plate this is just the way out; only the **green** `安全出口` is a fire exit under GB 2894. |
| 入口 | rùkǒu | entrance | ingang | 0 | The 出/入 pair is the highest-value opposition in the whole product. 入 (rank 188) is otherwise rare enough that learners mistake it for 人 — a real foil. |
| 号线 | hào xiàn | line number | lijnnummer | 0 | `4号线` = Line 4. 号 rank 337, 线 rank 378. Absent from every HSK level as a unit; the roundel colour usually renders it redundant, which makes it an easy first win. |
| 换乘 | huànchéng | transfer, change lines | overstappen | 0 | Absent from all eleven HSK levels. 换 = ⿰扌奂; the 奂 series (换 唤 焕) is reliably *huàn*, so the reading is inferable. The single most-needed opaque compound in the strand. |
| 地铁 | dìtiě | metro | metro | 1 | 铁 = ⿰钅失, and 钅 is the anchor for a four-character cluster the player meets across both these sections: 铁 银 铺 锅. Teach the radical here and it pays out in 7.4. |
| 进站 / 出站 | jìnzhàn / chūzhàn | enter / exit the station | station in / station uit | 1 | Ship as a 2×2 grid card with 进/出 as axis labels. Both compounds absent from HSK. 进 = ⿺辶井, introducing 辶 (motion) which recurs in 递, 道, 通. |
| 安检 | ānjiǎn | security check | veiligheidscontrole | 1 | Band 6, but behaviourally Tier 1: bag screening is **mandatory on every Chinese metro**, and a visitor who does not expect it queues wrong. 检 is 11 strokes in simplified — not 17; the traditional 檢 does not ship. |
| 方向 | fāngxiàng | direction | richting | 1 | 方 is rank 55 with six listed readings; here always *fāng*. Needed to parse the platform strip. |
| 票 | piào | ticket | kaartje | 1 | Rank 948. ⿱覀示. Head of 单程票, 检票, 取票, 售票, 补票, 退票 — one character unlocking six compounds is the best ratio in the strand. |
| 开往 | kāi wǎng | bound for | richting, naar | 2 | The characters are trivial (开 rank 91, 往 rank 442); the *terminus name that follows* is the actual information and appears in no wordlist. Generate these procedurally from per-city station packs — three sibling termini from the same network as distractors. |
| 首班 / 末班 | shǒubān / mòbān | first / last service | eerste / laatste rit | 2 | 末 = ⿻木一 and 未 wèi = ⿻一木 — identical strokes, only the relative length differs. This is the strand's best Xepsi-style foil: `未班车` set in the correct timetable-panel styling. 班 = ⿲王刂王 vs 斑 = ⿲王文王 is a second one. |
| 单程票 | dānchéngpiào | single-journey ticket | enkeltje | 2 | 单 has three readings; *dān* here. Note the collision: 单**程** chéng (⿰禾呈) and 换**乘** chéng (⿻禾北) are different characters with the same reading inside one strand — pair them deliberately rather than letting the player discover it as confusion. |
| 站台 | zhàntái | platform | perron | 2 | Band 6. 台 rank 372, four listed readings, *tái* here. |

**The paid-area trap.** `付费区` / `非付费区` is the one metro fact that costs real money: crossing the gateline between them re-charges a fare, and stations with exits on both sides of a road often force the choice. It ships as a text-only item — it is not picturable, and a photo of the plate would turn the task into photo-matching.

### Exit lettering

The addressable unit of a Chinese city is the exit letter, and the schemes are mutually incompatible and documented nowhere a traveller looks. Beijing uses **letters with a compass gloss** — `A 西北口`, exit A, northwest. Shanghai and Nanjing use **numbers** — `1号口`, `2号口`. Guangzhou and Shenzhen use letters with numeric subdivisions — A, B1, B2, C. Hong Kong MTR uses letter+number. Chengdu and Xi'an use letters. In every scheme, `口` on an exit tab means *exit*, not *mouth*, and "meet me at C口" is how the meeting actually gets arranged.

This makes 东西南北 a transit item rather than a geography item. **Ordering: corpus-grounded** — 北 (rank 89), 南 (130), 西 (132), 东 (140) are all inside the top 150 and all first-band, so they cost almost nothing and immediately halve the exit-choosing problem in Beijing-style systems. They recur in station and street names (`东单`, `西直门`, `南京路`) and in 中 for *central*.

| hanzi | pinyin | English | Dutch | tier | why it earns its place |
|---|---|---|---|---|---|
| 东 | dōng | east | oost | 1 | Rank 140. Exit tabs, station names, street names. |
| 西 | xī | west | west | 1 | Rank 132. Foil: 酉 in 酒 differs by one stroke — flag it when 酒店 arrives in 7.4. |
| 南 | nán | south | zuid | 1 | Rank 130. |
| 北 | běi | north | noord | 1 | Rank 89 — the most frequent of the four. |

**Floors, and a Dutch-only warning card.** `层` and `楼` count the ground floor as 1, so `3楼` is **de tweede verdieping**, not de derde. B1 and B2 are basement levels. This off-by-one exists for Dutch and other European readers and does not surface in the English gloss at all, which is exactly why the bilingual gloss store earns its keep. Flagged as an unsourced practitioner observation, not a finding.

### Mainline rail

Mainline rail is where the consequences get expensive, and where a visitor's assumptions from European rail are actively wrong.

| hanzi | pinyin | English | Dutch | tier | why it earns its place |
|---|---|---|---|---|---|
| 高铁 | gāotiě | high-speed rail (G) | hogesnelheidstrein | 2 | Band 4. Distinguishes G from D (`动车`) services, which differ in price and seat classes. |
| 火车 | huǒchē | train | trein | 2 | Band 1, ranks 438/371 — the easiest item in the strand, kept as an anchor. |
| 候车 | hòuchē | wait for the train | wachten op de trein | 2 | Absent from HSK. `候车室` is where you are held; Chinese stations gate you into a waiting hall, not onto a platform. |
| 检票 | jiǎnpiào | ticket check | kaartcontrole | 2 | Absent from HSK. **`检票时间` gates close a few minutes before departure and do not reopen** — the single commonest way a visitor misses a Chinese train, and the reason this item is scored as consequential. |
| 车厢 | chēxiāng | carriage, coach | rijtuig, wagon | 2 | Band 7–9, corpus rank 2,537 — well outside a top-1500-by-frequency bank, and in regardless. 厢 = ⿸厂相; the 厂 cluster (厅 厕 厢) is a cheap set. |
| 身份证 | shēnfènzhèng | ID card | identiteitsbewijs | 2 | Band 3. Ships with its exception: foreigners use a **passport** `护照`, which is why the automatic gates reject you and you go to `人工窗口`. |
| 取票 | qǔpiào | collect a printed ticket | ticket ophalen | 2 | Absent from HSK. 取 = ⿰耳又, rank 327. |

**The seat grid ships as one 2×2 card.** Four characters, eight readable signs — the best items-unlocked-per-character ratio in the curriculum:

| hanzi | pinyin | English | Dutch | tier | why it earns its place |
|---|---|---|---|---|---|
| 硬 | yìng | hard | hard | 2 | ⿰石更. Axis label. |
| 软 | ruǎn | soft | zacht | 2 | ⿰车欠 — 车 as a radical, tying back to 火车. |
| 座 | zuò | seat | zitplaats | 2 | ⿸广坐, rank 696. Also 座位号, 二等座, 让座. |
| 卧 | wò | berth, sleeper | slaapplaats | 2 | ⿰臣卜, rank 2,085. Axis label. |

Yielding 硬座 / 软座 / 硬卧 (open six-berth bay, three tiers) / 软卧 (closed four-berth compartment), plus the high-speed ladder 二等座 → 一等座 → 商务座. One correction carries into the gloss: **`无座` is priced as `硬座` on conventional trains but at the full `二等座` fare on G and D services** — you pay second class and stand. Split the gloss by train class. Flagged for verification against 12306 fare rules before content lock.

**Domain weight: 5% of the bag. Ordering: judgement, and deliberately low.** Tier-1 metros, HSR stations and airports are the most heavily bilingual environments in China, so the marginal payoff per item is lower here than anywhere else in the product — the strand exists because the failure modes (wrong platform, closed gate, wrong fare zone) are unusually expensive, not because the reading is unusually necessary.

## 7.4 Shopfronts

Chinese business names are head-final compounds. The **last** character carries the category and the earlier characters specialise it. That is a structural fact about Chinese nominal compounding, not a corpus artefact, and it produces the one strand in the entire curriculum where a player can correctly answer an item that is not in the bank.

So the strand is ordered **heads first — ordering: judgement, resting on a well-supported structural fact.** Learn eight tail morphemes and you can classify a fascia you have never seen. Learn eight business names instead and you can classify eight fascias.

| hanzi | pinyin | English | Dutch | tier | why it earns its place |
|---|---|---|---|---|---|
| 店 | diàn | shop | winkel | 1 | ⿸广占 — the same 占 phonetic as 站, and 广 recurs in 座, 库, 厂房. Tail of 药店, 书店, 花店, 便利店, 水果店, 眼镜店. Highest-yield head. |
| 铺 | pù | shop (older, smaller) | winkeltje | 1 | ⿰钅甫. Reads *pù* here, not *pū*. The 甫 series (铺 捕 浦) is a usable phonetic set. |
| 行 | háng | trade house | handelshuis | 1 | Rank 37 with five listed readings, and **in a business name it is *háng*, not *xíng*** — 银行, 车行, 商行. This is the exact heteronym sloppy sources get wrong; the reading is stored per item, not per character. |
| 馆 | guǎn | establishment, house of | gelegenheid | 1 | ⿰饣官 — 饣 is the food radical (43 characters, versus 12 for 食), so 馆 predicts *food* far more often than not: 面馆, 饭馆, 茶馆. But also 宾馆, 图书馆, 博物馆 — the head narrows, it does not decide. |
| 城 | chéng | large retail complex | markthal, centrum | 1 | ⿰土成. 美食城, 家具城, 电脑城 — a "city" of one product type. Rank 150; the character is easy, the shop sense is not. |
| 场 | chǎng | venue, ground | terrein, plein | 1 | Rank 175, two readings, *chǎng* here. 停车场, 广场, 市场, 商场. |
| 中心 | zhōngxīn | centre | centrum | 1 | Two-character head. 购物中心, 服务中心, 社区卫生服务中心. |
| 市场 | shìchǎng | market | markt | 1 | 菜市场 is the wet market — where the supermarket strand's produce vocabulary actually gets used. |

The second-tier task on this strand is **generative**: show a fascia the player has never seen — 电脑城, 花店, 修车行 — and ask what *kind* of place it is, answerable from the head alone. Log `unseenCompoundAccuracy` as a separate metric from recall accuracy. It measures generalisation, and it is the only place in the product where that measurement is available for free.

### Services you may need in a hurry

**Ordering: judgement, on consequence.** Corpus rank actively disagrees here and is overruled — 厕 sits at rank 3,107, outside a top-1500-by-frequency bank entirely, and it is a day-one item. Eight of the 44 shopfront characters fall outside the top 1,500 by general-corpus frequency (诊 邮 厕 宾 餐 锅 咖 啡). The bank is a survival bank; general frequency is a filter on it, never the selection rule.

| hanzi | pinyin | English | Dutch | tier | why it earns its place |
|---|---|---|---|---|---|
| 厕所 | cèsuǒ | toilet (blunt) | wc | 0 | 厕 = ⿸厂则, and the 则 series (厕 侧 测) all read *cè*. 所 = ⿰户斤, rank 100. |
| 洗手间 | xǐshǒujiān | washroom (polite) | toilet | 0 | Band 1, all three characters top-160. The register difference from 厕所 is the taught content, not the reading. 卫生间 is the third variant. |
| 药店 | yàodiàn | pharmacy | apotheek | 1 | 药 = ⿱艹约, 9 strokes in simplified (the 17-stroke 藥 does not ship). **Green cross** livery — the visual cue arrives before the characters. `药房` is the same thing. |
| 医院 | yīyuàn | hospital | ziekenhuis | 1 | 院 = ⿰阝完, with 阝 on the **left** (mound). Contrast 邮 below. `急诊` is A&E. |
| 银行 | yínháng | bank | bank | 1 | The 行 = *háng* exemplar. 银 = ⿰钅艮; the 艮 series (银 根 很 跟) is a good phonetic-family teaching set. 中国银行 is the branch that reliably changes foreign currency. |
| 邮局 | yóujú | post office | postkantoor | 1 | 邮 = ⿰由阝, with 阝 on the **right** (settlement) — a different component from the 阝 in 院 despite identical rendering. Store the component per item; never match by substring. **Green** livery, 中国邮政. |
| 派出所 | pàichūsuǒ | local police station | politiebureau | 1 | Absent from every HSK level. Where a lost passport is reported. 公安局 is the bureau above it; 出入境管理 is where visa extensions happen. |
| 快递 | kuàidì | courier, parcel point | pakketpunt | 1 | Band 4. 递 = ⿺辶弟, 弟 *dì* giving 递 *dì* — a fully transparent phonetic, rare enough to be worth showing. Real fascias read 顺丰, 中通, 圆通, 菜鸟驿站. |
| 加油站 | jiāyóuzhàn | petrol station | tankstation | 1 | Band 4. Reuses 站 from 7.3 in a completely different sense — a natural `contexts` entry for the graduation gate. 中石化, 中石油. |
| 停车场 | tíngchēchǎng | car park | parkeerplaats | 1 | Band 2. Reuses 场 and 车. Signed **P**; 地下车库 for underground. |
| 诊所 | zhěnsuǒ | clinic | huisartsenpraktijk | 2 | Band 7–9, rank 1,906. 诊 = ⿰讠㐱 — 讠 recurs in 证, 话, 语. |
| 理发 | lǐfà | barber, hairdresser | kapper | 2 | **发 reads *fà* here, not *fā*** — a stored per-item reading. Also the traditional-variant lint case: 理发 → 理**髮**, not 理發. `美发`, likewise *měifà*. |
| 洗衣 | xǐyī | laundry | wasserij | 2 | Absent from HSK. `干洗` is dry cleaning. Reuses 洗 from 洗手间. |

### Eating, drinking, sleeping — and the 酒店 / 饭店 trap

This is the band where the head-final rule, which works everywhere else, breaks. It is worth teaching the exception explicitly rather than letting a player build false confidence in the generative task.

`酒` means alcohol. `酒店` does **not** mean a bar or a bottle shop — it means a hotel, usually a larger one. `饭` means cooked rice, a meal. `饭店` means **either a restaurant or a hotel**, and which one is not recoverable from the characters; it is recoverable from the building. `宾馆` takes the 馆 head that mostly predicts food, and is a hotel. Meanwhile `茶馆` and `面馆` do take 馆 in the food sense. So the hospitality band is exactly where a confident head-reader walks into a lobby looking for lunch.

Ship this as a three-item confusion set with the three fascias side by side, tagged as a known-exception card, and let the generative probe explicitly exclude it from `unseenCompoundAccuracy` — otherwise the metric punishes the player for a rule the language itself breaks.

| hanzi | pinyin | English | Dutch | tier | why it earns its place |
|---|---|---|---|---|---|
| 酒店 | jiǔdiàn | hotel (larger) | hotel | 2 | 酒 = ⿰氵酉, radical of record 酉 (fermented). Foil: 洒 sǎ = ⿰氵西 — 酉 versus 西 is one stroke. |
| 宾馆 | bīnguǎn | hotel (mid-range) | hotel | 2 | Band 5. 宾 = ⿱宀兵, rank 1,630. `招待所` is basic and often refuses foreigners; `民宿` is a homestay; `客栈` an inn. |
| 饭店 | fàndiàn | restaurant **or** hotel | restaurant of hotel | 2 | The trap item. Band 1 characters, ambiguous compound. |
| 餐厅 | cāntīng | restaurant | restaurant | 2 | Band 5. 餐 = ⿱⿰歺又食 (the 食 form, not 饣); 厅 = ⿸厂丁, the 厂 cluster again. Unambiguous where 饭店 is not. |
| 小吃 | xiǎochī | snacks, cheap eats | snackbar | 2 | Band 4. Not a head — a specialiser that appears alone on a fascia. The cheapest hot food in China is behind this sign. |
| 面馆 | miànguǎn | noodle shop | noedelzaak | 2 | Absent from HSK. Traditional-variant lint case: 面馆 → 麵館, never 面館. `米粉` for rice noodles. |
| 火锅 | huǒguō | hotpot | hotpot | 2 | Band 7–9. 锅 = ⿰钅呙 — 钅 again, fourth appearance across the two sections (铁 银 铺 锅). `烧烤` for evening skewers, `串串` for skewer hotpot. |
| 咖啡 | kāfēi | coffee | koffie | 2 | Band 3, but ranks 2,620 and 2,581 — a pure loanword pair, both 口-radical phonetic borrowings, carrying no meaning in their components. Teach as a two-character unit and say why the radical trick fails here. |
| 茶 | chá | tea | thee | 2 | ⿱艹⿱人木, rank 851, band 1. `茶楼` is a teahouse, `奶茶` bubble tea. |

**Fascias are the one place traditional characters legitimately appear.** Mainland language law permits 繁体字 in enumerated cases including handwritten and calligraphic shop signs, and fascias favour exactly that lettering. The fascia object template therefore renders a heavy display or brush face and may show the traditional variant, and it is the only template in the product allowed to. Because variant mapping is word-level rather than character-level, a single traditional column would silently produce 理發 and 面館; the lint rule flags any item containing 面 干 发 后 里 松 只 几 表 系 术 for manual review.

**Domain weight: 20% of the bag. Ordering: judgement.** Shopfront fascias are unregulated for language and overwhelmingly Chinese-only outside tourist strips — unlike transit, there is no bilingual fallback — but the weights themselves have no empirical basis, since nobody has measured how many signs of each type a visitor reads per day. Treat as a v1 guess and instrument it.