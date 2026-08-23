## 7.1 Menus

A Chinese menu is the one situation in this curriculum where the barrier is _unknown characters_, not opaque compounds. The measurement is unambiguous. Of the thirteen core cooking verbs, the median rank in `charfreq.txt` (99,950,541 tokens, 12,009 distinct characters) is **2,276**; only three — 烧, 爆, 炸 — fall inside the top 1,500, which is the entire bank. Zero of the thirteen appear in HSK 3.0's first 900 characters. Contrast the supermarket set in §7.2: median rank 413, 53 of 57 inside the bank. Menus are a character-acquisition problem; labels are a parsing problem. They need different item types, different difficulty models, and — the point of this section — different justifications for existing at all.

A frequency-ordered 1,500-character bank covers **93.1%** of running text in the corpus and still leaves the learner unable to read 涮 on the hotpot menu they are sitting in front of.

### Cooking methods

The method character is the highest-leverage glyph on the page: it predicts oil, heat, temperature and whether you or the kitchen does the cooking. Nine of the thirteen share 火 or 灬 as their Kangxi radical (炒 爆 炸 煮 烤 焖 炖 烧 煎 — verified against decomposition data), so one component card unlocks most of the strand. 蒸 takes 艹 as its radical but hides 灬 inside 烝; teach it adjacent, not inside, the fire family.

**Ordering: judgement.** Corpus rank would put 涮 last and 烧 first; we order by _how wrong you can go_. Frequency is stored as a tie-breaker field only.

| hanzi | pinyin | English             | Dutch                      | tier | why it earns its place                                                  |
| ----- | ------ | ------------------- | -------------------------- | ---- | ----------------------------------------------------------------------- |
| 炒    | chǎo   | stir-fry            | roerbakken                 | 1    | The default. Rank 1,568 — already outside a frequency bank              |
| 蒸    | zhēng  | steam               | stomen                     | 1    | The safe order: no added oil, mild                                      |
| 烤    | kǎo    | roast, grill        | roosteren, grillen         | 1    | Dry heat, skewers; the whole 烧烤 section                               |
| 炸    | zhá    | deep-fry            | frituren                   | 1    | Heteronym trap: zhà is "explode", zhá is the food                       |
| 煮    | zhǔ    | boil                | koken                      | 1    | Plain and wet — but see 水煮 below                                      |
| 烧    | shāo   | braise in soy       | braiseren                  | 1    | 红烧 is the mildest thing on most menus                                 |
| 炖    | dùn    | long-stew           | stoven                     | 1    | Bones, hours, soupy; rank 3,415                                         |
| 焖    | mèn    | covered braise      | smoren                     | 1    | Absent from HSK 3.0 entirely; rank 3,141                                |
| 煎    | jiān   | pan-fry             | bakken in de pan           | 1    | Distinguishes 煎饺 from 蒸饺 at the dumpling stall                      |
| 爆    | bào    | flash-fry           | flitsbakken                | 1    | Seconds at high heat, usually offal — a warning                         |
| 拌    | bàn    | tossed, dressed     | aanmaken                   | 1    | Almost always **cold**; the one method that changes serving temperature |
| 卤    | lǔ     | master-stock braise | in kruidenbouillon gegaard | 1    | Dark, star anise, served cold, usually organ meat                       |
| 涮    | shuàn  | swish in broth      | kort dompelen              | 1    | This is hotpot: **you** cook it. Rank 5,115                             |

Four compound modifiers override the base method and belong in the same strand, tagged non-compositional: 红烧 hóngshāo (red-braised, sweet-savoury, safe), 清蒸 qīngzhēng (plain-steamed, mild), 干煸 gānbiān (dry-fried Sichuan, chilli-heavy — 干 is gān "dry", not gàn; every automatic pinyin tool gets this wrong), and 水煮 shuǐzhǔ — literally "water-boiled", in fact a pool of chilli oil and Sichuan pepper. 水煮鱼 and 水煮肉片 are the two dishes most often ordered by mistake by people who read the characters correctly and drew the wrong conclusion. Give 水煮, 干煸 and 干锅 the hazard template, not the menu template.

### Proteins and staples

**Ordering: corpus-grounded**, then reordered once for a cultural fact the corpus cannot see. 肉 alone on a Chinese menu means **pork**. 肉丝, 肉片, 肉末 with no animal named are all pork. No HSK level teaches this, and it catches vegetarians, Muslims and Jews daily — so 肉 leads despite 鱼 outranking it (452 vs 869).

| hanzi | pinyin | English                     | Dutch                          | tier | why it earns its place                                                                              |
| ----- | ------ | --------------------------- | ------------------------------ | ---- | --------------------------------------------------------------------------------------------------- |
| 肉    | ròu    | meat — by default **pork**  | vlees — standaard varkensvlees | 0    | The single most consequential unmarked default on the page                                          |
| 素    | sù     | vegetarian                  | vegetarisch                    | 0    | But 素 dishes routinely carry 蚝油 or 高汤                                                          |
| 荤    | hūn    | meat-containing             | met vlees                      | 0    | Rank 3,302, absent from HSK 3.0; pairs with 素 as a menu-header opposition                          |
| 鸡    | jī     | chicken                     | kip                            | 1    | Rank 1,249                                                                                          |
| 牛    | niú    | beef                        | rund                           | 1    | Rank 881                                                                                            |
| 猪    | zhū    | pig                         | varken                         | 1    | Rank 1,633 — outside the frequency bank                                                             |
| 羊    | yáng   | lamb, mutton, goat          | lam, schaap, geit              | 1    | Rank 1,340; the Dutch gloss is genuinely three animals                                              |
| 鱼    | yú     | fish                        | vis                            | 1    | Rank 452, the highest-frequency protein                                                             |
| 虾    | xiā    | shrimp, prawn               | garnaal                        | 1    | Rank 2,460; allergen-critical                                                                       |
| 蛋    | dàn    | egg                         | ei                             | 1    | Rank 1,157                                                                                          |
| 饭    | fàn    | cooked rice; also "meal"    | rijst, maaltijd                | 1    | 炒饭, 米饭                                                                                          |
| 面    | miàn   | wheat noodles; also "flour" | tarwenoedels                   | 1    | Rank 76, but the _food_ sense is what's needed. Traditional 麵 appears on calligraphic 麵館 fascias |
| 粉    | fěn    | rice noodles; also "powder" | rijstnoedels                   | 1    | Two readings of one glyph, both on menus                                                            |
| 饺    | jiǎo   | dumpling                    | dumpling                       | 1    | Rank 3,891 — a frequency bank never reaches it                                                      |
| 包    | bāo    | filled steamed bun          | gevuld gestoomd broodje        | 1    | Contrasts with 馒头, which is unfilled                                                              |
| 锅    | guō    | pot                         | pan                            | 1    | 火锅 hotpot, 砂锅 clay pot, 干锅 dry pot                                                            |

### The flavour warnings

**Ordering: judgement, explicitly against the corpus.** 酸 (1,002) and 麻 (1,071) outrank 辣 (1,897), but 辣 is what hurts.

| hanzi | pinyin | English               | Dutch                | tier | why it earns its place                                           |
| ----- | ------ | --------------------- | -------------------- | ---- | ---------------------------------------------------------------- |
| 辣    | là     | chilli-hot            | pittig, heet         | 0    | The one warning that must be readable on day one                 |
| 麻    | má     | numbing, lip-tingling | verdovend, tintelend | 0    | **Not heat.** "Pittig" is wrong. No Dutch or English word exists |
| 咸    | xián   | salty                 | zout                 | 1    | Rank 1,688; Chinese "salty" is saltier                           |
| 酸    | suān   | sour                  | zuur                 | 1    | Rank 1,002; also the pickled-vegetable marker                    |
| 甜    | tián   | sweet                 | zoet                 | 1    | Rank 1,749; 甜 in a savoury dish name means sugar in the sauce   |

麻 gets a dedicated card and a sentence rather than a gloss: _this is not heat, it is your mouth going numb._ 麻辣 málà is the combined Sichuan/Chongqing default and may be introduced beside 辣 from day one — they are meaning-confusable but visually distinct, which is the safe confusion class. The heat dial (不辣 / 微辣 / 中辣 / 特辣 / 变态辣) ships as a separate always-accessible point-at-this screen at large type, alongside 不要香菜. Note that 微辣 in Chengdu outranks 特辣 in Shanghai; the scale is local. Note also the sandhi: 不辣 is cited _bù là_, spoken _bú là_ — this is exactly what the item schema's separate `pinyin_citation` and `pinyin_surface` fields are for.

### Qualifiers

**Ordering: judgement, ordered by cost of failure.** 时价 is the most expensive two characters a traveller can fail to read: no price is printed, and you are told the number after you have eaten.

| hanzi | pinyin   | English          | Dutch            | tier | why it earns its place                                                                       |
| ----- | -------- | ---------------- | ---------------- | ---- | -------------------------------------------------------------------------------------------- |
| 时价  | shíjià   | market price     | dagprijs         | 2    | Both characters are common (24, 422); the compound is opaque and absent from every HSK level |
| 大份  | dà fèn   | large portion    | grote portie     | 1    | 份 is rank 742 but reads "share/copy" elsewhere                                              |
| 小份  | xiǎo fèn | small portion    | kleine portie    | 1    | The pair is the item, not the individual characters                                          |
| 例    | lì       | standard portion | standaardportie  | 2    | Rank 691 as "example" — the portion sense is invisible to frequency                          |
| 招牌  | zhāopái  | signature dish   | huisspecialiteit | 2    | Also means "shop sign" — same glyphs, two situations                                         |
| 特色  | tèsè     | house specialty  | specialiteit     | 2    | Confusable with 特价 (§7.2); authored distractor pair                                        |
| 起    | qǐ       | "from" (a price) | vanaf            | 2    | 88元起 means 88 is the floor, not the price                                                  |
| 位    | wèi      | per person       | per persoon      | 2    | Drives 茶位费 and 餐位费, the cover charges                                                  |

### Section headers

**Ordering: corpus-grounded and it happens to match the physical order of the page.**

| hanzi | pinyin   | English                      | Dutch           | tier | why it earns its place                                                                      |
| ----- | -------- | ---------------------------- | --------------- | ---- | ------------------------------------------------------------------------------------------- |
| 凉菜  | liángcài | cold dishes                  | koude gerechten | 1    | Always the first section; 凉 is rank 1,602                                                  |
| 热菜  | rècài    | hot dishes                   | warme gerechten | 1    | 热 rank 475, 菜 rank 847 — both known, the pair still needs teaching                        |
| 汤    | tāng     | soup                         | soep            | 1    | Rank 1,393; single-character header                                                         |
| 主食  | zhǔshí   | staples: rice, noodles, buns | basisgerechten  | 1    | Ordered **last** in China. A Dutch diner expecting bread first is misreading the whole page |
| 饮料  | yǐnliào  | soft drinks                  | frisdrank       | 1    | Distinct from 酒水, which is alcohol                                                        |

### The organ and texture set — where ⺼ earns its keep

Twelve of the twenty-one characters in this set fall outside the 1,500-rank bank; 胗 sits at rank 7,674 with 29 occurrences in a hundred-million-token corpus. By any frequency logic these are unreachable. By the logic of a Western diner reading a Chongqing hotpot order sheet, they are the most consequential glyphs in the whole curriculum — and eight of them share a single component, which is what makes teaching them affordable.

**Ordering: judgement.** Corpus rank is inverted here — 心 (86) and 头 (141) are near-universal, 胗 is near-absent, yet 胗 is the one you need.

| hanzi | pinyin | English              | Dutch                    | tier | why it earns its place                                         |
| ----- | ------ | -------------------- | ------------------------ | ---- | -------------------------------------------------------------- |
| 肠    | cháng  | intestine            | darm                     | 2    | 肥肠, 大肠. Rank 1,512 — one place outside the bank            |
| 肚    | dǔ     | tripe, stomach       | pens, maag               | 2    | 毛肚 on every hotpot sheet. Read **dù** it means "belly"       |
| 肝    | gān    | liver                | lever                    | 2    | 猪肝, 鹅肝                                                     |
| 腰    | yāo    | kidney               | nier                     | 2    | 腰花. Also means "waist" — the same glyph, two situations      |
| 肺    | fèi    | lung                 | long                     | 2    | 夫妻肺片 contains no lung nowadays                             |
| 肾    | shèn   | kidney               | nier                     | 2    | Rank 2,131                                                     |
| 脑    | nǎo    | brain                | hersenen                 | 2    | 脑花. Rank 909 — high frequency, wrong sense                   |
| 胗    | zhēn   | gizzard              | spiermaag                | 2    | Rank 7,674. The clearest single case for a functional syllabus |
| 血    | xuè    | blood, as a set curd | bloed, als gestolde koek | 2    | 鸭血, 毛血旺. Does **not** carry ⺼                            |
| 舌    | shé    | tongue               | tong                     | 2    | 牛舌. Does **not** carry ⺼                                    |
| 筋    | jīn    | tendon               | pees                     | 2    | Kangxi radical is ⺮; ⺼ hides one level down, inside 肋       |
| 皮    | pí     | skin, crackling      | huid, zwoerd             | 2    | 猪皮, 皮蛋. Does **not** carry ⺼                              |

Teach ⺼ (U+2EBC, Kangxi 130, meat) as one component card **before** 肠 肚 肝 腰 脑 肺 肾 胗. It is not 月 (U+6708, moon) and the two are homoglyphs in almost every font, including our subset. Verified against decomposition data: all eight organ characters carry U+2EBC; 期 朋 服 有 望 朗 carry U+6708. A substring match on 月 highlights **none** of the eight and fires instead on 期 — which sits inside 保质期 and 生产日期, both Tier-1 supermarket items. It fails silently and teaches the opposite of the truth.

The reverse error is just as real and is the reason highlighting must key off a stored per-item component field rather than any match at all. 能 (rank **61**), 育 (444), 背 (767) and 散 (875) all carry ⺼ in their decomposition — and 散 sits inside 散装, a §7.2 shelf term. A naive ⺼ highlighter paints "meat" onto the most common character in the supermarket strand and onto 能. Store the component; never derive it.

### The QR-code reality

Most of the above is now read on a phone, not on paper. Table service in urban China routes through a 扫码点餐 mini-programme: the physical menu, where it survives, is decorative. This changes the item format, not the content. A sixth card template renders a phone inside the phone — a scrollable Chinese ordering UI at realistic 14–16px density with tappable regions — and the task shifts from "what does this character mean" to "tap the button that adds this to your cart without ordering it." Small type is correct here because small type _is_ the difficulty; this is the one template exempt from the readability floor applied elsewhere, and even here the target glyph clears WCAG AA.

Two pairs carry all the risk: 去结算 (proceed to checkout) against 取消 (cancel), and 提交订单 (submit — irreversible) against 加入购物车 (add to cart — reversible). 备注 bèizhù is the free-text field where 不要香菜 goes. 售罄 shòuqìng, 起送 qǐsòng and 去结算 are absent from every HSK level. Roughly 25 items, `interaction: 'tap-target'`, hit-regions in the schema from the start rather than retrofitted.

Two honest caveats. The QR shift is practitioner-derived market observation, not a literature claim — it needs a field check before it drives more than one template. And this template is the _only_ place where character reading genuinely beats camera OCR, because a mini-programme running on your own screen cannot be photographed by a second phone. That is a promotion argument, not a demotion one.

---

## 7.2 Supermarket and convenience

The supermarket strand inverts everything above. Take the 57 characters spanning store names, checkout, money, weights, label fields and promotions: median corpus rank **413**, 53 of 57 inside the 1,500-character bank, 45 of 57 in HSK 3.0's first three levels, and **none** absent from HSK 3.0 altogether. Only 扫 (1,625), 仓 (2,049), 账 (2,178) and 冻 (2,205) fall outside the bank.

The learner already knows every brick. What defeats them is that 净, 含 and 量 are ranks 1,436, 853 and 202, and 净含量 still means nothing. This strand is authored as compound-parsing and cloze items, not character-acquisition items — the same split the menu strand refuses.

### Store and checkout

**Ordering: corpus-grounded.**

| hanzi  | pinyin     | English           | Dutch                    | tier | why it earns its place                                      |
| ------ | ---------- | ----------------- | ------------------------ | ---- | ----------------------------------------------------------- |
| 超市   | chāoshì    | supermarket       | supermarkt               | 1    | Both characters top-1000; the compound is the shopfront     |
| 便利店 | biànlìdiàn | convenience store | buurtwinkel              | 1    | 便 is biàn here, pián in 便宜 — a per-string pinyin case    |
| 收银台 | shōuyíntái | checkout          | kassa                    | 1    | Overhead lane signs shorten to bare 收银                    |
| 结账   | jiézhàng   | settle up, pay    | afrekenen                | 1    | 账 at 2,178 is one of only four out-of-bank characters here |
| 扫码   | sǎomǎ      | scan the QR code  | scannen, QR-code scannen | 1    | The universal payment verb; rank 1,625 for 扫               |

### Money, and the 斤 trap

**Ordering: judgement, and this is the one unskippable block in the strand.**

斤 is a **catty: exactly 500 g**. Loose produce, meat and fish are priced 元/斤 almost everywhere in China. A shelf reading 牛肉 32.8元/斤 is 65.6 元per kilo — double what a European brain computes, in the expensive direction, every single time. 斤 sits at corpus rank 1,370: inside our bank, but only just, and it is HSK level 2 as a bare character with no mention anywhere of what it weighs. Knowing the glyph and not the arithmetic is worse than not knowing the glyph.

| hanzi | pinyin | English                 | Dutch             | tier | why it earns its place                                       |
| ----- | ------ | ----------------------- | ----------------- | ---- | ------------------------------------------------------------ |
| 元    | yuán   | yuan (written)          | yuan              | 0    | Rank 211; the printed currency unit                          |
| 块    | kuài   | yuan (spoken)           | yuan (spreektaal) | 0    | Rank 815; what you hear, never what you read                 |
| 斤    | jīn    | catty = 500 g           | catty = 500 gram  | 0    | The single highest-value arithmetic fact in the app          |
| 两    | liǎng  | 50 g, one tenth of a 斤 | 50 gram           | 1    | Rank 113 as "two" — the unit sense is invisible to frequency |
| 克    | kè     | gram                    | gram              | 1    | Rank 406; the honest unit, printed on packaged goods         |
| 千克  | qiānkè | kilogram = 2 斤         | kilogram          | 1    | Also written 公斤; both forms appear on the same shelf       |

Ships as `itemType: 'compute'` with a generator so the numbers randomise: _牛肉 32.8元/斤 — what does a kilo cost?_ with 65.6 / 32.8 / 16.4 / 328 as options. The price-label template renders the numeral huge and the unit character small, because that is the real reading condition — the whole difficulty is that 斤 is eight pixels next to a forty-pixel number. Note that 斤 and 公斤 are a form-confusable pair and must not enter as new items in the same session.

### The label block

Chinese food labels do not print an expiry date. They print a production date and a _duration_, and you add them yourself.

**Ordering: judgement, ordered by consequence.** By corpus rank this block would open with 进口 (80/157) and bury 冷冻 (2,205); by consequence it opens with the date pair.

| hanzi    | pinyin         | English                       | Dutch             | tier | why it earns its place                                                             |
| -------- | -------------- | ----------------------------- | ----------------- | ---- | ---------------------------------------------------------------------------------- |
| 生产日期 | shēngchǎn rìqī | production date               | productiedatum    | 1    | All four characters rank 28–214; the field is still unreadable without instruction |
| 保质期   | bǎozhìqī       | shelf life, as a **duration** | houdbaarheidsduur | 1    | 保质期12个月 is not a date. Contains 期 — the 月 homoglyph trap                    |
| 净含量   | jìnghánliàng   | net content                   | netto-inhoud      | 1    | 量 is liàng, not liáng — pinyin is a property of the string                        |
| 冷藏     | lěngcáng       | refrigerate, 0–4 °C           | gekoeld bewaren   | 1    | Authored distractor for 冷冻 — same first character, opposite instruction          |
| 冷冻     | lěngdòng       | freeze, −18 °C                | diepvries         | 1    | Getting this pair wrong ruins the food either way                                  |
| 进口     | jìnkǒu         | imported                      | geïmporteerd      | 1    | Rank 80/157; on a metro sign the same glyphs mean "entrance"                       |
| 散装     | sǎnzhuāng      | loose, sold by weight         | los, per gewicht  | 2    | Flags that 元/斤 applies. 散 carries ⺼ — a highlighter false positive             |
| 称重     | chēngzhòng     | weigh here                    | hier afwegen      | 2    | You must weigh produce and get a barcode sticker **before** the till               |

Also: 见包装 / 见瓶身 / 见喷码 ("see the packaging / the bottle / the inkjet code") send you hunting for the date elsewhere on the item. Date formats vary freely — 20260822, 2026/08/22, 2026.08.22, 26 08 22 — so the compute item generates all four. GB 7718 mandates Chinese on packaged food and caps the size of foreign-language type, which is why this is the one domain with genuinely no English fallback, and why it is weighted at roughly 30% of the item bag.

### Promotions

| hanzi    | pinyin         | English                              | Dutch                                  | tier | why it earns its place                                                                                  |
| -------- | -------------- | ------------------------------------ | -------------------------------------- | ---- | ------------------------------------------------------------------------------------------------------- |
| 特价     | tèjià          | special price                        | aanbieding                             | 0    | Rank 213/422; confusable with 特色 (§7.1) and 特产                                                      |
| 买一送一 | mǎi yī sòng yī | buy one get one free                 | 1+1 gratis                             | 1    | Every character in the top 900. Absent from every HSK level. Sandhi: spoken _mǎi yí sòng yī_            |
| 会员价   | huìyuánjià     | members' price                       | ledenprijs                             | 1    | Displayed as if it were the price; needs a scanned app account                                          |
| 折       | zhé            | discount as the fraction you **pay** | korting, uitgedrukt als wat je betaalt | 0    | 打八折 = pay 80%, i.e. 20% off. A European reading "8折" as "80% off" errs badly in the wrong direction |

### Where the corpus and the situation disagree — the whole argument

Across both sections, roughly thirty characters that a table needs fall outside the 1,500-character bank a frequency ordering would build. Named: 炒 烤 蒸 煎 煮 拌 卤 焖 炖 涮 · 肠 肚 肝 舌 筋 肾 肺 胗 · 猪 虾 锅 饺 粥 · 咸 甜 辣 · 凉 · 扫 账 冻. Thirty characters is **two per cent** of the bank. That is the entire cost of the disagreement, and it buys the difference between a learner who can read the hotpot order sheet and one who cannot.

The disagreement runs in both directions, and both directions are instructive. 胗 (rank 7,674) and 涮 (5,115) are corpus-invisible and situationally unmissable. 能 (rank 61), 期 (214) and 主 (48) are corpus-dominant and situationally near-useless at Tier 0–1 — and 能 and 散 are precisely the characters that break a naive meat-radical highlighter. Frequency is not merely a weak ordering key for this product; at the top of the list it is actively misleading about what the learner will meet.

So: `freqRank` is stored on every item as a tie-breaker and a diagnostic. It never seeds the bank and it never sorts it. Every ordering above is stamped corpus-grounded or judgement, and where the two conflict the situation wins — because the criterion task is not reading Chinese prose, it is standing in front of a shelf label with eight-pixel type and working out what a kilo costs.
