/**
 * The component/radical table and the two decomposition record shapes that
 * sit above it, per DESIGN.md §3.3.3(5)-(6) and the §3.3.4 worked ruling.
 *
 * Component identity is a stable id, never a bare codepoint or a substring
 * match on the rendered glyph. That is not a style preference: the flesh
 * radical in 肝肠肚腰脑肺肾胗 is ⺼ (U+2EBC, CJK RADICAL MEAT), which is a
 * homoglyph of 月 (U+6708, the moon character) in almost every font but a
 * different codepoint with a different Kangxi radical. A regex or `.includes`
 * check on 月 highlights zero of those eight characters and fires instead on
 * 期 inside 保质期 (a best-before date) - see the `MEAT_RADICAL` entry below,
 * whose id is a plain string precisely so nothing can be tempted into
 * grepping the glyph out of it.
 */

export type ComponentId = string;

export type ComponentRole = 'semantic' | 'phonetic' | 'neither';

/**
 * DESIGN.md §1.4 (P24): the phonetic component predicts pronunciation exactly
 * ~17% of the time in the top 1,000 characters and not at all ~35% of the
 * time. `'unverified'` is the only value this phase assigns - it is not a
 * measurement, it is the explicit "nobody has checked this one yet" state a
 * hint must sit in until Phase 2 hand-verifies it against a dictionary.
 * Auto-computing this field is out of scope for this phase by design: a wrong
 * hint delivered as feedback in the resolution moment is worse than none.
 */
export type PhoneticReliability = 'unverified' | 'no-cue' | 'rime-only' | 'segmental' | 'exact';

export interface Component {
  readonly id: ComponentId;
  /** The shape to render. Stored separately from `id` so the identity claim never depends on it. */
  readonly displayGlyph: string;
  readonly role: ComponentRole;
  /** Only meaningful when `role` is `'phonetic'`; absent otherwise. */
  readonly reliability?: PhoneticReliability;
  /**
   * A short gloss of what this component itself represents - the Kangxi
   * radical's traditional meaning for `role: 'semantic'` entries, or the
   * plain character meaning for `role: 'phonetic'` entries (a phonetic
   * component is always a real character with a real meaning, even though
   * that meaning is irrelevant to why it is used here - no fake semantic
   * story is invented for it). Rendered inline in a small UI tile, so this
   * stays a few words, not a sentence.
   */
  readonly meaning: string;
}

/**
 * Character-level decomposition: 河 = 氵 + 可. Kept as a distinct type from
 * {@link WordDecomposition} per the "one boolean cannot express both" ruling -
 * a word coming apart into morphemes and a character coming apart into
 * components are different learning problems with different shapes.
 */
export interface CharacterDecomposition {
  readonly kind: 'character';
  readonly hanzi: string;
  readonly components: readonly { readonly componentId: ComponentId; readonly role: ComponentRole }[];
  /**
   * Which of `components` drives highlighting, per DESIGN.md §3.3.4's
   * instruction to key highlighting off a stored field, never a glyph match.
   */
  readonly semantic_radical?: ComponentId;
}

/** Word-level decomposition: 牛肉 = 牛 + 肉. */
export interface WordDecomposition {
  readonly kind: 'word';
  readonly hanzi: string;
  readonly morphemes: readonly { readonly span: string; readonly gloss: string }[];
}

export type Decomposition = CharacterDecomposition | WordDecomposition;

/**
 * Sourcing decision (Phase 2, DESIGN.md §9.1's decomposition row, superseding
 * the "regenerate from Unihan + CC-CEDICT" option Phase 1 flagged for
 * planning): decompositions are hand-authored in-house, seeded only by Unihan
 * `kRSUnicode` for the semantic radical - `kRSUnicode` is a radical-stroke
 * index, not a component decomposition, so it can seed one field, not
 * synthesize the whole record. Every phonetic-component claim added below is
 * therefore individually verified against known readings before it ships,
 * per §3.3.3(6)'s "never auto-generated."
 */
export const MEAT_RADICAL: Component = {
  id: 'kangxi-130-meat',
  displayGlyph: '⺼',
  role: 'semantic',
  meaning: 'flesh, meat, body part',
};

/**
 * 肝 gān and 干 gān share the same syllable including tone - the rare 'exact'
 * case in the ~17%-of-the-top-1,000 reliability distribution (DESIGN.md
 * §1.4/§3.3.2c), which is why this is the one phonetic hint Phase 2 ships for
 * the organ set rather than leaving every component semantic-only.
 */
export const GAN_PHONETIC: Component = {
  id: 'phonetic-gan',
  displayGlyph: '干',
  role: 'phonetic',
  reliability: 'exact',
  meaning: 'dry; to do',
};

/**
 * 腰 yāo and 要 (yào, yāo, yǎo) share an attested reading including tone -
 * verified against `pinyin-data`'s full reading list for 要, not just its
 * primary yào. The organ-set backfill's original pass noted 要'
 * primary reading is yào and dismissed the yāo reading as "not the
 * character's common reading" without checking it against the exact-match
 * bar the rest of this bank applies - the same class of miss as 份/分 (`FEN_SEMANTIC`) and 饭/反
 * (`FAN_PHONETIC`) before this fix. Make Me a Hanzi classifies 腰/要 as
 * `pictophonetic` (phonetic: "要", semantic: "⺼"), so 腰 now ships both
 * `MEAT_RADICAL` and this phonetic - it is the second exact phonetic hint
 * for the organ set alongside `GAN_PHONETIC`.
 */
export const YAO_PHONETIC: Component = {
  id: 'phonetic-yao',
  displayGlyph: '要',
  role: 'phonetic',
  reliability: 'exact',
  meaning: 'to want; important; to demand',
};

/**
 * 站 zhàn = ⿰立占 (stand + 占). Verified against Make Me a Hanzi's
 * `dictionary.txt` (LGPL-3.0-or-later, gitignored scratch copy fetched by
 * `docs/research/corpus/fetch.sh`, verification-only per DESIGN.md §9.2 —
 * this table itself is hand-authored, nothing here is copied from that file).
 */
export const STAND_SEMANTIC: Component = {
  id: 'kangxi-117-stand',
  displayGlyph: '立',
  role: 'semantic',
  meaning: 'to stand',
};

/**
 * 站 zhàn and 占 zhàn share the same syllable including tone — verified
 * against `pinyin-data` (MIT), the same standard the organ set's 肝/干 hint
 * was checked against. Structure confirmed against the gitignored Make Me a
 * Hanzi scratch copy (see `STAND_SEMANTIC`); not shipped or copied verbatim.
 */
export const ZHAN_PHONETIC: Component = {
  id: 'phonetic-zhan',
  displayGlyph: '占',
  role: 'phonetic',
  reliability: 'exact',
  meaning: 'to occupy, to take up',
};

/** 城 chéng = ⿰土成 (earth + 成). Verified against the same gitignored Make Me a Hanzi scratch copy as `STAND_SEMANTIC`. */
export const EARTH_SEMANTIC: Component = {
  id: 'kangxi-32-earth',
  displayGlyph: '土',
  role: 'semantic',
  meaning: 'earth, soil',
};

/** 城 chéng and 成 chéng share the same syllable including tone — verified against `pinyin-data`, structure against the same scratch copy as `EARTH_SEMANTIC`. */
export const CHENG_PHONETIC: Component = {
  id: 'phonetic-cheng',
  displayGlyph: '成',
  role: 'phonetic',
  reliability: 'exact',
  meaning: 'to become, to succeed',
};

/**
 * 茶 chá = ⿱艹⿱人木 (grass over [person over wood]). Make Me a Hanzi records
 * only the semantic half of this one (`hint: 'plant'`) with no phonetic
 * field at all, so no phonetic claim is made for 茶 anywhere in this bank.
 */
export const GRASS_RADICAL: Component = {
  id: 'kangxi-140-grass',
  displayGlyph: '艹',
  role: 'semantic',
  meaning: 'grass, plant',
};

/**
 * 炒/炖/烤/烧/焖/爆 = ⿰火X (fire + X), verified against the gitignored Make Me a
 * Hanzi scratch copy - every one of the six is MMH's own `pictophonetic` type
 * with `semantic: '火'`, not an ideographic reading imposed after the fact.
 * The menu-cooking set's fourth left-right fire-radical character, 炸, is
 * deliberately excluded: see the rejection note on `ZHA_PHONETIC`'s would-be
 * pairing below (DESIGN.md §9.1's decomposition row/PLAN.md phonetic-rejection
 * table).
 */
export const FIRE_RADICAL: Component = {
  id: 'kangxi-86-fire',
  displayGlyph: '火',
  role: 'semantic',
  meaning: 'fire',
};

/**
 * 烤 kǎo and 考 kǎo share the same syllable including tone - verified against
 * `pinyin-data`, same 'exact' bar as `GAN_PHONETIC`/`ZHAN_PHONETIC`/`CHENG_PHONETIC`.
 */
export const KAO_PHONETIC: Component = {
  id: 'phonetic-kao',
  displayGlyph: '考',
  role: 'phonetic',
  reliability: 'exact',
  meaning: 'to test, to examine',
};

/** 焖 mèn and 闷 mèn share the same syllable including tone - verified against `pinyin-data`. */
export const MEN_PHONETIC: Component = {
  id: 'phonetic-men',
  displayGlyph: '闷',
  role: 'phonetic',
  reliability: 'exact',
  meaning: 'stuffy; bored, depressed',
};

/** 爆 bào and 暴 bào share the same syllable including tone - verified against `pinyin-data`. */
export const BAO_PHONETIC: Component = {
  id: 'phonetic-bao',
  displayGlyph: '暴',
  role: 'phonetic',
  reliability: 'exact',
  meaning: 'violent, sudden; to expose',
};

/**
 * 煮/煎 = ⿱X灬 (X + fire, the four-dot variant of the same Kangxi radical as
 * `FIRE_RADICAL`) - kept as a distinct component id because the rendered
 * shape differs, same "identity is the id, not the glyph" rule `MEAT_RADICAL`'s
 * doc comment states. Both are MMH `pictophonetic` with `semantic: '灬'`;
 * neither phonetic half (者/前) is an exact-tone match for 煮/煎, so no
 * phonetic claim ships for either.
 */
export const FIRE_DOTS_RADICAL: Component = {
  id: 'kangxi-86-fire-dots',
  displayGlyph: '灬',
  role: 'semantic',
  meaning: 'fire (four-dot form)',
};

/**
 * 汤/涮 = ⿰氵X (water + X), both MMH `pictophonetic` with `semantic: '氵'`.
 * Neither phonetic half (昜/刷) is an exact-tone match, so semantic-only.
 */
export const WATER_RADICAL: Component = {
  id: 'kangxi-85-water',
  displayGlyph: '氵',
  role: 'semantic',
  meaning: 'water',
};

/**
 * 猪 zhū = ⿰犭者 (animal + 者). MMH's own hint for 犭 here is 'animal', not
 * 'dog' - a generic beast radical repurposed for "pig", not a claim that pigs
 * are dogs. 者 (zhě) is not an exact-tone match for zhū, so semantic-only.
 */
export const ANIMAL_RADICAL: Component = {
  id: 'kangxi-94-animal',
  displayGlyph: '犭',
  role: 'semantic',
  meaning: 'dog; animal, beast',
};

/**
 * 饭/饺/馆 = ⿰饣X (food + X), all three MMH `pictophonetic`/`ideographic`
 * with a food-radical semantic half. A prior pass checked all three phonetic
 * halves (反/交/官) against fàn/jiǎo/guǎn and called every one a tone-only
 * near miss - but that checked 反 only against its reading as it appears
 * paired with fǎn, missing that `pinyin-data` lists 反 as a genuine heteronym
 * with TWO readings, fǎn/fàn, so fàn (饭's own reading) is itself one of 反's
 * attested readings, not a mismatch. 饭 therefore ships 反 as `FAN_PHONETIC`
 * (see below), the same correction pattern as 份/分 (`FEN_SEMANTIC`). 交
 * (jiāo only) and 官 (guān only) remain genuine near misses against jiǎo/guǎn
 * - no reading of either matches - so 饺/馆 stay semantic-only.
 */
export const FOOD_RADICAL: Component = {
  id: 'kangxi-184-food',
  displayGlyph: '饣',
  role: 'semantic',
  meaning: 'food, to eat',
};

/**
 * 饭 fàn and 反 (fǎn, fàn) share an attested reading including tone -
 * verified against `pinyin-data`'s full reading list for 反, not just its
 * primary fǎn - the same 'exact' bar as `GAN_PHONETIC`/`FEN_SEMANTIC`'s
 * correction. Make Me a Hanzi classifies 饭/反 as `pictophonetic` (phonetic:
 * "反", semantic: "饣"), so this ships as a genuine phonetic component, not
 * an ideographic pairing like 份/分.
 */
export const FAN_PHONETIC: Component = {
  id: 'phonetic-fan',
  displayGlyph: '反',
  role: 'phonetic',
  reliability: 'exact',
  meaning: 'to reverse, to oppose',
};

/**
 * 拌/折 = ⿰扌X (hand + X). 拌 bàn and 半 bàn share the same syllable including
 * tone - verified against `pinyin-data`, the 'exact' case. 折's phonetic half,
 * 斤 (jīn), is not a tone-or-syllable match for zhé, so 折 ships semantic-only.
 */
export const HAND_RADICAL: Component = {
  id: 'kangxi-64-hand',
  displayGlyph: '扌',
  role: 'semantic',
  meaning: 'hand',
};

/** 拌 bàn and 半 bàn share the same syllable including tone - verified against `pinyin-data`. */
export const BAN_PHONETIC: Component = {
  id: 'phonetic-ban',
  displayGlyph: '半',
  role: 'phonetic',
  reliability: 'exact',
  meaning: 'half',
};

/**
 * 锅/铺 = ⿰钅X (metal + X). 锅 guō and 呙 guō share the same syllable
 * including tone - verified against `pinyin-data`. 铺's phonetic half, 甫
 * (fǔ), is not a tone-or-syllable match for pù, so 铺 ships semantic-only.
 */
export const METAL_RADICAL: Component = {
  id: 'kangxi-167-metal',
  displayGlyph: '钅',
  role: 'semantic',
  meaning: 'metal, gold',
};

/** 锅 guō and 呙 guō share the same syllable including tone - verified against `pinyin-data`. */
export const GUO_PHONETIC: Component = {
  id: 'phonetic-guo',
  displayGlyph: '呙',
  role: 'phonetic',
  reliability: 'exact',
  meaning: 'a surname',
};

/**
 * 粉 fěn = ⿰米分 (grain + 分). MMH's own hint for 米 is 'grain', not just
 * "rice" - 分 (fēn) is a tone-only near miss for fěn, not an exact match, so
 * semantic-only.
 */
export const GRAIN_RADICAL: Component = {
  id: 'kangxi-119-grain',
  displayGlyph: '米',
  role: 'semantic',
  meaning: 'rice, grain',
};

/**
 * 份 fèn = ⿰亻分 (person + 分). Make Me a Hanzi classifies this pairing
 * `ideographic`, not pictophonetic - its own etymology hint is "the lot or
 * portion 分 allotted to a man 亻." A prior pass checked 分 only against its
 * primary reading (fēn) against fèn, called it a tone-only near miss, and
 * dropped it entirely - missing that `pinyin-data` lists 分 as a genuine
 * heteronym with THREE readings, fēn/fèn/fén, so fèn is itself one of 分's
 * attested readings, not a mismatch. 份 therefore ships both components as
 * semantic (per MMH's own ideographic classification), not one semantic/one
 * rejected-phonetic.
 */
export const FEN_SEMANTIC: Component = {
  id: 'kangxi-18-fen-portion',
  displayGlyph: '分',
  role: 'semantic',
  meaning: 'to divide; a portion, a share',
};

/**
 * Rest-of-bank decomposition/mnemonic pass (Aug 2026, DESIGN.md §9.1 coverage
 * push): components for the remaining still-undecomposed single characters in
 * market-checkout/market-panel/menu-animal/street-open, verified against the
 * gitignored Make Me a Hanzi scratch copy.
 */

/** 号 hào = ⿱口丂 (口, "mouth" + 丂). 丂's readings (kǎo/qiǎo/yú) are not a tone-or-syllable match for hào, so semantic-only. */
export const MOUTH_RADICAL: Component = {
  id: 'kangxi-30-mouth',
  displayGlyph: '口',
  role: 'semantic',
  meaning: 'mouth',
};

/** 双 shuāng = ⿰又又, two of the same "again/hand" radical side by side - MMH's own ideographic hint. Same component listed twice; no phonetic half to claim. */
export const AGAIN_RADICAL: Component = {
  id: 'kangxi-29-again',
  displayGlyph: '又',
  role: 'semantic',
  meaning: 'again; right hand',
};

/**
 * 素 sù = ⿱龶糸 ("silk thread hanging off a tree" per MMH). 糸 is the
 * traditional/standalone form of the same silk radical rendered as 纟 in
 * `SILK_RADICAL` (结's component) - kept as a separate id because the
 * rendered shape differs, the same "identity is the id, not the glyph" rule
 * `FIRE_DOTS_RADICAL` states for 火/灬.
 */
export const SILK_RADICAL_FULL: Component = {
  id: 'kangxi-120-silk-full',
  displayGlyph: '糸',
  role: 'semantic',
  meaning: 'silk, thread',
};

/** 鸡 jī = ⿰又鸟 ("another kind of bird" per MMH's ideographic hint). 鸟 is the recognizable semantic half; 又 (yòu) is not a tone-or-syllable match for jī, so semantic-only. */
export const BIRD_RADICAL: Component = {
  id: 'kangxi-196-bird',
  displayGlyph: '鸟',
  role: 'semantic',
  meaning: 'bird',
};

/**
 * 虫 chóng ("insect/worm" radical), shared by 虾 (⿰虫下, phonetic 下 xià not
 * an exact match for xiā) and 蛋 (⿱疋虫, phonetic 延 yán not an exact match
 * for dàn) - both semantic-only.
 */
export const INSECT_RADICAL: Component = {
  id: 'kangxi-142-insect',
  displayGlyph: '虫',
  role: 'semantic',
  meaning: 'insect, worm',
};

/** 筋 jīn = ⿱⺮肋 ("bamboo-like tendons" per MMH's ideographic hint). ⺮ is the recognizable semantic half; MMH records no separate phonetic component. */
export const BAMBOO_RADICAL: Component = {
  id: 'kangxi-118-bamboo',
  displayGlyph: '⺮',
  role: 'semantic',
  meaning: 'bamboo',
};

/** 时 shí = ⿰日寸 (日, "sun/day" + 寸). MMH's own entry names 日 as the semantic half and records no phonetic component for this character, so semantic-only. */
export const SUN_RADICAL: Component = {
  id: 'kangxi-72-sun',
  displayGlyph: '日',
  role: 'semantic',
  meaning: 'sun, day',
};

/**
 * 包 bāo = ⿹勹巳. MMH's own ideographic hint says 勹 ("wrap, swaddle") "also
 * provides the pronunciation" - and unlike 快's 夬 (rejected, wrong tone),
 * 勹's own reading is bāo, an exact match. No separate semantic component is
 * claimed: 巳 is not a recognizable radical anywhere else in this table, and
 * MMH itself does not name a `semantic` field for this entry (only `hint`
 * prose), so this ships as the one component actually verified - the
 * phonetic half - rather than inventing a semantic pairing MMH does not
 * support.
 */
export const WRAP_PHONETIC: Component = {
  id: 'phonetic-bao-wrap',
  displayGlyph: '勹',
  role: 'phonetic',
  reliability: 'exact',
  meaning: 'to wrap, to embrace',
};

/**
 * Word-decomposition eligibility backfill (Aug 2026, DESIGN.md §9.1): 收/银/
 * 结/账/洗/药/邮/局/快/递/停/地/铁 are the standalone characters authored so
 * `deriveComponentCharIds` (eligibility.ts) can resolve the ten word items
 * that previously named these morphemes with no matching single-character
 * item in the pack - see the audit note in content/index.ts. Every one below
 * is verified against the gitignored Make Me a Hanzi scratch copy, same
 * process as every earlier radical set on this page.
 */

/** 收 shōu = ⿰丩攵 (丩 jiū + 攵, "tap/rap" radical). 丩 is not a tone-or-syllable match for shōu, so semantic-only. */
export const TAP_RADICAL: Component = {
  id: 'kangxi-66-tap',
  displayGlyph: '攵',
  role: 'semantic',
  meaning: 'to tap, rap, knock',
};

/**
 * 结 jié = ⿰纟吉 (silk radical + 吉). 吉's own reading is jí - same tone as
 * jié but a different syllable (ji vs jie), so it fails the exact-match bar
 * this bank holds phonetic hints to and 结 ships semantic-only.
 */
export const SILK_RADICAL: Component = {
  id: 'kangxi-120-silk',
  displayGlyph: '纟',
  role: 'semantic',
  meaning: 'silk, thread',
};

/** 账 zhàng = ⿰贝长 (贝, "shell" - the money radical - + 长). 长 is read zhǎng/cháng, neither an exact match for zhàng, so semantic-only. */
export const SHELL_RADICAL: Component = {
  id: 'kangxi-154-shell',
  displayGlyph: '贝',
  role: 'semantic',
  meaning: 'shell, cowrie (money)',
};

/**
 * 邮 yóu = ⿰由阝 (由 + 阝, the "right-ear" 邑/place radical, Kangxi 163). Held
 * as a distinct component id from any future "left-ear" 阝 (阜/mound, Kangxi
 * 170) precisely because the two are homoglyphs with different Kangxi
 * radicals occupying the same glyph slot - the same trap `MEAT_RADICAL`'s
 * doc comment names for ⺼/月, not assumed to be safe here just because no
 * left-ear character has been authored yet.
 */
export const CITY_RADICAL: Component = {
  id: 'kangxi-163-city-right-ear',
  displayGlyph: '阝',
  role: 'semantic',
  meaning: 'city, settlement',
};

/** 邮 yóu and 由 yóu share the same syllable including tone - verified against `pinyin-data`, the same 'exact' bar as `ZHAN_PHONETIC`/`GUO_PHONETIC`. */
export const YOU_PHONETIC: Component = {
  id: 'phonetic-you',
  displayGlyph: '由',
  role: 'phonetic',
  reliability: 'exact',
  meaning: 'from, via; reason',
};

/** 递 dì = ⿺辶弟 (辶, "walk" radical + 弟). Structure is a lower-left partial enclosure, distinct from the ⿰ left-right pairs above. */
export const WALK_RADICAL: Component = {
  id: 'kangxi-162-walk',
  displayGlyph: '辶',
  role: 'semantic',
  meaning: 'to walk, to move',
};

/** 递 dì and 弟 dì share the same syllable including tone - verified against `pinyin-data`; this bank's own street-trade.ts explanation for 快递 already named this pairing before the component existed. */
export const DI_PHONETIC: Component = {
  id: 'phonetic-di',
  displayGlyph: '弟',
  role: 'phonetic',
  reliability: 'exact',
  meaning: 'younger brother',
};

/** 停 tíng = ⿰亻亭 (人/亻, "person" radical + 亭). */
export const PERSON_RADICAL: Component = {
  id: 'kangxi-9-person',
  displayGlyph: '亻',
  role: 'semantic',
  meaning: 'person',
};

/** 停 tíng and 亭 tíng share the same syllable including tone - verified against `pinyin-data`. */
export const TING_PHONETIC: Component = {
  id: 'phonetic-ting',
  displayGlyph: '亭',
  role: 'phonetic',
  reliability: 'exact',
  meaning: 'pavilion',
};

/**
 * 快 kuài = ⿰忄夬 (心/忄, "heart" radical + 夬). MMH's own etymology calls 夬
 * "decisive" and notes it "also provides the pronunciation," but 夬's actual
 * readings (guài, jué) are not a tone-or-syllable match for kuài, so no
 * phonetic claim ships - the same near-miss discipline as 站/占-style
 * rejections elsewhere in this table.
 */
export const HEART_RADICAL: Component = {
  id: 'kangxi-61-heart',
  displayGlyph: '忄',
  role: 'semantic',
  meaning: 'heart, mind',
};

export const COMPONENTS: Readonly<Record<ComponentId, Component>> = {
  [MEAT_RADICAL.id]: MEAT_RADICAL,
  [GAN_PHONETIC.id]: GAN_PHONETIC,
  [YAO_PHONETIC.id]: YAO_PHONETIC,
  [STAND_SEMANTIC.id]: STAND_SEMANTIC,
  [ZHAN_PHONETIC.id]: ZHAN_PHONETIC,
  [EARTH_SEMANTIC.id]: EARTH_SEMANTIC,
  [CHENG_PHONETIC.id]: CHENG_PHONETIC,
  [GRASS_RADICAL.id]: GRASS_RADICAL,
  [FIRE_RADICAL.id]: FIRE_RADICAL,
  [KAO_PHONETIC.id]: KAO_PHONETIC,
  [MEN_PHONETIC.id]: MEN_PHONETIC,
  [BAO_PHONETIC.id]: BAO_PHONETIC,
  [FIRE_DOTS_RADICAL.id]: FIRE_DOTS_RADICAL,
  [WATER_RADICAL.id]: WATER_RADICAL,
  [ANIMAL_RADICAL.id]: ANIMAL_RADICAL,
  [FOOD_RADICAL.id]: FOOD_RADICAL,
  [FAN_PHONETIC.id]: FAN_PHONETIC,
  [HAND_RADICAL.id]: HAND_RADICAL,
  [BAN_PHONETIC.id]: BAN_PHONETIC,
  [METAL_RADICAL.id]: METAL_RADICAL,
  [GUO_PHONETIC.id]: GUO_PHONETIC,
  [GRAIN_RADICAL.id]: GRAIN_RADICAL,
  [FEN_SEMANTIC.id]: FEN_SEMANTIC,
  [TAP_RADICAL.id]: TAP_RADICAL,
  [SILK_RADICAL.id]: SILK_RADICAL,
  [SHELL_RADICAL.id]: SHELL_RADICAL,
  [CITY_RADICAL.id]: CITY_RADICAL,
  [YOU_PHONETIC.id]: YOU_PHONETIC,
  [WALK_RADICAL.id]: WALK_RADICAL,
  [DI_PHONETIC.id]: DI_PHONETIC,
  [PERSON_RADICAL.id]: PERSON_RADICAL,
  [TING_PHONETIC.id]: TING_PHONETIC,
  [HEART_RADICAL.id]: HEART_RADICAL,
  [MOUTH_RADICAL.id]: MOUTH_RADICAL,
  [AGAIN_RADICAL.id]: AGAIN_RADICAL,
  [SILK_RADICAL_FULL.id]: SILK_RADICAL_FULL,
  [BIRD_RADICAL.id]: BIRD_RADICAL,
  [INSECT_RADICAL.id]: INSECT_RADICAL,
  [BAMBOO_RADICAL.id]: BAMBOO_RADICAL,
  [SUN_RADICAL.id]: SUN_RADICAL,
  [WRAP_PHONETIC.id]: WRAP_PHONETIC,
};

export function resolveComponent(id: ComponentId): Component | undefined {
  return COMPONENTS[id];
}
