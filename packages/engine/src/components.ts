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
 * 菜 cài = ⿱艹采 (grass over 采), MMH's own `pictophonetic` type: semantic 艹,
 * phonetic 采. Found via an independent Dong Chinese cross-check (a third
 * verification source alongside MMH and pinyin-data) after 份/价 exposed the
 * "only checked the primary reading" miss class - 采's own primary reading is
 * cǎi, but `pinyin-data` lists a second reading, cài, an exact match to 菜.
 * A second Dong-Chinese-suggested candidate (炒/少) was checked and rejected:
 * 炒 is chǎo, 少 is shǎo/shào - same rime and tone as one of 少's readings but
 * a different initial (ch- vs sh-), not the same syllable, so no match.
 */
export const CAI_PHONETIC: Component = {
  id: 'phonetic-cai',
  displayGlyph: '采',
  role: 'phonetic',
  reliability: 'exact',
  meaning: 'to pick, to gather',
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

/**
 * 炒 chǎo and 少 (shǎo, shào) share the rime (-ao) and 少's `shǎo` reading
 * shares the tone too, but the initial differs (ch- vs sh-) - not the same
 * syllable, so this fails the `'exact'` bar every other phonetic component in
 * this table met. It is real and structurally correct (MMH: pictophonetic,
 * semantic 火, phonetic 少) and was wrongly dropped entirely on a first pass
 * that only checked for an exact match. `PhoneticReliability` has a
 * `'rime-only'` tier for exactly this shape (shared final + tone, different
 * initial) - DESIGN.md §1.4/§3.3.2c's own P24 finding expects most real
 * phonetic components to land in the non-exact tiers, not to be exact or
 * absent. Ships honestly as `'rime-only'`, not silently upgraded to `'exact'`.
 */
export const SHAO_PHONETIC: Component = {
  id: 'phonetic-shao',
  displayGlyph: '少',
  role: 'phonetic',
  reliability: 'rime-only',
  meaning: 'few, little',
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

/**
 * Mnemonic-only decomposition-gap audit (Aug 2026, the 价 bug's aftermath):
 * every component below closes a gap the same class of bug left in some
 * other `glossProvenance: 'mnemonic-only'` item - a mnemonic naming real
 * structural pieces with no `decomposition` field to back it, or (for the
 * phonetic additions) an exact-reading match a prior pass missed by only
 * checking a candidate's primary reading, the same miss class `FAN_PHONETIC`/
 * `FEN_SEMANTIC`/`YAO_PHONETIC` document. Every entry verified against the
 * gitignored Make Me a Hanzi scratch copy and `pinyin-data`'s full reading
 * lists, same process as every earlier phase in this file.
 */

/** 市 shì = ⿱亠巾 (亠, "lid/cover" shape + 巾, "cloth"). MMH gives no etymology prose, but the decomposition tree and radical agree cleanly on 巾. */
export const CLOTH_RADICAL: Component = {
  id: 'kangxi-50-cloth',
  displayGlyph: '巾',
  role: 'semantic',
  meaning: 'cloth, turban',
};

/** 千 qiān = ⿱丿十 (丿 + 十, "ten"). MMH assigns no etymology prose, but the radical (十) matches the tree's own bottom component. */
export const TEN_RADICAL: Component = {
  id: 'kangxi-24-ten',
  displayGlyph: '十',
  role: 'semantic',
  meaning: 'ten',
};

/** 码 mǎ = ⿰石马 (石, "stone" + 马). MMH's own pictophonetic classification: semantic 石, phonetic 马. */
export const STONE_RADICAL: Component = {
  id: 'kangxi-112-stone',
  displayGlyph: '石',
  role: 'semantic',
  meaning: 'stone',
};

/** 码 mǎ and 马 mǎ share the same syllable including tone - verified against `pinyin-data`, the 'exact' bar every phonetic hint in this table is held to. */
export const MA_PHONETIC: Component = {
  id: 'phonetic-ma',
  displayGlyph: '马',
  role: 'phonetic',
  reliability: 'exact',
  meaning: 'horse',
};

/** 碗 wǎn and 宛 (wǎn, yuān, yǔn, yù) share an attested reading including tone - `pinyin-data`'s full list for 宛, not just a single primary reading. MMH classifies 碗/宛 as pictophonetic (semantic 石, phonetic 宛). */
export const WAN_PHONETIC: Component = {
  id: 'phonetic-wan',
  displayGlyph: '宛',
  role: 'phonetic',
  reliability: 'exact',
  meaning: 'as if; graceful',
};

/** 百 bǎi = ⿱一白 (一, "one" + 白). MMH's own pictophonetic classification: semantic 一, phonetic 白 - but 白's readings (bái, bó) don't match bǎi, so no phonetic claim ships. */
export const ONE_RADICAL: Component = {
  id: 'kangxi-1-one',
  displayGlyph: '一',
  role: 'semantic',
  meaning: 'one',
};

/** 特 tè = ⿰牛寺 (牛, "ox" + 寺). MMH's own pictophonetic classification: semantic 牛, phonetic 寺 (sì, not a match for tè). */
export const OX_RADICAL: Component = {
  id: 'kangxi-93-ox',
  displayGlyph: '牛',
  role: 'semantic',
  meaning: 'ox, cattle',
};

/** 杯 bēi = ⿰木不 (木, "wood" + 不). MMH's own pictophonetic classification: semantic 木, phonetic 不 (bù/fǒu/fōu/fū/bú, none a match for bēi). Reused for 检's ⿰木佥. */
export const WOOD_RADICAL: Component = {
  id: 'kangxi-75-wood',
  displayGlyph: '木',
  role: 'semantic',
  meaning: 'wood, tree',
};

/** 瓶 píng = ⿰并瓦 (瓦, "pottery" + 并). MMH's own pictophonetic classification: semantic 瓦, phonetic 并 (bìng/bīng, neither a match for píng). */
export const POTTERY_RADICAL: Component = {
  id: 'kangxi-98-pottery',
  displayGlyph: '瓦',
  role: 'semantic',
  meaning: 'pottery, tile',
};

/** 张 zhāng = ⿰弓长 (弓, "bow" + 长). MMH's own pictophonetic classification: semantic 弓, phonetic 长 (zhǎng/cháng, neither a match for zhāng). */
export const BOW_RADICAL: Component = {
  id: 'kangxi-57-bow',
  displayGlyph: '弓',
  role: 'semantic',
  meaning: 'bow',
};

/** 冷 lěng = ⿰冫令 (冫, "ice" + 令). MMH's own pictophonetic classification: semantic 冫, phonetic 令 (lìng/líng/lǐng/lián, none a match for lěng). */
export const ICE_RADICAL: Component = {
  id: 'kangxi-15-ice',
  displayGlyph: '冫',
  role: 'semantic',
  meaning: 'ice',
};

/** 装 zhuāng = ⿱壮衣 (衣, "clothes" + 壮). MMH's own pictophonetic classification: semantic 衣, phonetic 壮 (zhuàng, tone-only near miss for zhuāng). */
export const CLOTHES_RADICAL: Component = {
  id: 'kangxi-145-clothes',
  displayGlyph: '衣',
  role: 'semantic',
  meaning: 'clothes',
};

/** 分 fēn = ⿱八刀 (八 + 刀, "knife"). MMH's own ideographic hint: "pieces being further subdivided with a knife". */
export const KNIFE_RADICAL: Component = {
  id: 'kangxi-18-knife',
  displayGlyph: '刀',
  role: 'semantic',
  meaning: 'knife',
};

/**
 * 重 zhòng = ⿻千里 (千, "thousand" + 里, "village; distance unit"). MMH's own
 * ideographic hint: "a burden carried for a thousand 千 miles 里". 千 itself is
 * not a Kangxi radical (it is 丿 over 十, the actual radical `TEN_RADICAL`
 * already ships) - this component's id deliberately does not claim a
 * "kangxi-" number, the same "whole compound character used as its own
 * semantic component" pattern `FEN_SEMANTIC` uses for 分 inside 份.
 */
export const THOUSAND_RADICAL: Component = {
  id: 'component-thousand',
  displayGlyph: '千',
  role: 'semantic',
  meaning: 'thousand',
};

/** See `THOUSAND_RADICAL` - the other half of 重's ideographic pair, and MMH's own radical assignment for 重. */
export const VILLAGE_RADICAL: Component = {
  id: 'kangxi-166-village',
  displayGlyph: '里',
  role: 'semantic',
  meaning: 'village; a unit of distance (~500 m)',
};

/**
 * 证 zhèng = ⿰讠正 (讠, "speech" + 正). MMH's own ideographic hint names both
 * roles in prose ("to speak 讠 the truth 正; 正 also provides the
 * pronunciation"). Reused for 请's ⿰讠青.
 */
export const SPEECH_RADICAL: Component = {
  id: 'kangxi-149-speech',
  displayGlyph: '讠',
  role: 'semantic',
  meaning: 'speech, words',
};

/** 证 zhèng and 正 (zhèng, zhēng) share an attested reading including tone - `pinyin-data`'s full list for 正, not just a single primary reading. */
export const ZHENG_PHONETIC: Component = {
  id: 'phonetic-zheng',
  displayGlyph: '正',
  role: 'phonetic',
  reliability: 'exact',
  meaning: 'correct, upright',
};

/** 请 qǐng's phonetic half, 青 (qīng/jīng), is not a tone-or-syllable match for qǐng, so 请 ships semantic-only via the reused `SPEECH_RADICAL`. */

/** 警 jǐng = ⿱敬言 (言, the full "speech" radical, kept distinct from `SPEECH_RADICAL`'s reduced 讠 shape - same "identity is the id, not the glyph" rule `FIRE_DOTS_RADICAL` states). Phonetic half 敬 (jìng) is a tone-only near miss for jǐng, so semantic-only. */
export const SPEECH_RADICAL_FULL: Component = {
  id: 'kangxi-149-speech-full',
  displayGlyph: '言',
  role: 'semantic',
  meaning: 'speech, words',
};

/** 惠 huì = ⿱叀心 (心, the full "heart" radical, kept distinct from `HEART_RADICAL`'s reduced 忄 shape). MMH's own pictophonetic classification: semantic 心, phonetic 叀. */
export const HEART_RADICAL_FULL: Component = {
  id: 'kangxi-61-heart-full',
  displayGlyph: '心',
  role: 'semantic',
  meaning: 'heart, mind',
};

/** 惠 huì and 叀 (zhuān, huì) share an attested reading including tone - `pinyin-data`'s full list for 叀, not just its more common zhuān reading. */
export const HUI_PHONETIC: Component = {
  id: 'phonetic-hui',
  displayGlyph: '叀',
  role: 'phonetic',
  reliability: 'exact',
  meaning: 'specialized, single-minded',
};

/**
 * 院 yuàn = ⿰阝完 (阝 + 完). This 阝 sits on the LEFT of its character - the
 * mound/hill radical (阜, Kangxi 170) - a different Kangxi radical from
 * `CITY_RADICAL`'s RIGHT-side 阝 (邑, Kangxi 163) used in 邮, even though both
 * render as the identical U+961D glyph. Kept as a distinct component id for
 * exactly the reason `MEAT_RADICAL`'s doc comment gives for ⺼/月: identity is
 * the id, never the glyph. Phonetic half 完 (wán/kuān) is not a match for
 * yuàn, so semantic-only.
 */
export const MOUND_RADICAL: Component = {
  id: 'kangxi-170-mound',
  displayGlyph: '阝',
  role: 'semantic',
  meaning: 'mound, hill; place, institution',
};

/**
 * 厅 tīng = ⿸厂丁. MMH's own etymology names the semantic role 广 ("spacious"),
 * not the literal 厂 shown in the decomposition tree - the simplified glyph's
 * shell shape coincides with 厂 without carrying 厂's own meaning, so the
 * etymology's explicit `semantic` field is trusted over the bare tree.
 * Reused for 店's ⿸广占. Phonetic half 丁 (dīng/zhēng) is not a match for
 * tīng, so semantic-only.
 */
export const BUILDING_RADICAL: Component = {
  id: 'kangxi-53-building',
  displayGlyph: '广',
  role: 'semantic',
  meaning: 'building, shelter',
};

/** 所 suǒ = ⿰户斤 (户, "door" + 斤, "axe"). MMH's own ideographic hint: "an axe 斤 swung at a door 户" - both components are real, independent meanings, the same two-meaningful-parts pattern `FEN_SEMANTIC`'s doc comment documents for 份. */
export const DOOR_RADICAL: Component = {
  id: 'kangxi-63-door',
  displayGlyph: '户',
  role: 'semantic',
  meaning: 'door',
};

/** See `DOOR_RADICAL` - the other half of 所's ideographic pair. */
export const AXE_RADICAL: Component = {
  id: 'kangxi-69-axe',
  displayGlyph: '斤',
  role: 'semantic',
  meaning: 'axe',
};

/** 开 kāi = ⿱一廾 (廾, "two hands"). MMH's own ideographic hint: "hands 廾 lifting the latch of a door" - 一 here stands for the latch, not its literal meaning "one", so only 廾 is added. */
export const TWO_HANDS_RADICAL: Component = {
  id: 'kangxi-55-two-hands',
  displayGlyph: '廾',
  role: 'semantic',
  meaning: 'two hands together',
};

/**
 * 间 jiān = ⿵门日 (门, "gate/door" + 日, reused from `SUN_RADICAL`). MMH's own
 * ideographic hint names both as real, independent meanings ("the sun 日
 * shining through a doorway 门") - the same two-meaningful-parts pattern as
 * `DOOR_RADICAL`/`AXE_RADICAL` for 所.
 */
export const GATE_RADICAL: Component = {
  id: 'kangxi-169-gate',
  displayGlyph: '门',
  role: 'semantic',
  meaning: 'gate, door',
};

/** 问 wèn's own 门 is claimed by MMH as the PHONETIC half (mén, not a match for wèn) rather than semantic - so 问 ships only the reused `MOUTH_RADICAL`, and this 门 usage stays confined to `GATE_RADICAL` for 间. */

/** 起 qǐ = ⿺走己 (走, "walk/run" + 己). MMH's own pictophonetic classification: semantic 走, phonetic 己. */
export const RUN_RADICAL: Component = {
  id: 'kangxi-156-run',
  displayGlyph: '走',
  role: 'semantic',
  meaning: 'to walk, to run',
};

/** 起 qǐ and 己 (jǐ, qǐ) share an attested reading including tone - `pinyin-data`'s full list for 己, not just its more common jǐ reading. */
export const QI_PHONETIC: Component = {
  id: 'phonetic-qi',
  displayGlyph: '己',
  role: 'phonetic',
  reliability: 'exact',
  meaning: 'self',
};

/** 提 tí = ⿰扌是 (扌, reused from `HAND_RADICAL` + 是). MMH's own pictophonetic classification: semantic 扌, phonetic 是. */
/** 提 tí and 是 (shì, tí) share an attested reading including tone - `pinyin-data`'s full list for 是, not just its far more common shì reading. */
export const TI_PHONETIC: Component = {
  id: 'phonetic-ti',
  displayGlyph: '是',
  role: 'phonetic',
  reliability: 'exact',
  meaning: 'to be; right, correct',
};

/** 指 zhǐ = ⿰扌旨 (扌, reused from `HAND_RADICAL` + 旨). MMH's own ideographic hint: "to point 旨 by hand 扌; 旨 also provides the pronunciation" - and 旨 zhǐ shares zhǐ's exact syllable and tone. */
export const ZHI_PHONETIC: Component = {
  id: 'phonetic-zhi',
  displayGlyph: '旨',
  role: 'phonetic',
  reliability: 'exact',
  meaning: 'purport, aim',
};

/** 禁 jìn = ⿱林示 (示, "altar" + 林). MMH's own pictophonetic classification: semantic 示, phonetic 林 (lín, not a match for jìn). */
export const ALTAR_RADICAL: Component = {
  id: 'kangxi-113-altar',
  displayGlyph: '示',
  role: 'semantic',
  meaning: 'altar, spirit',
};

/** 辣 là = ⿰辛束 (辛, "bitter, hardship" + 束). MMH's own pictophonetic classification: semantic 辛, phonetic 束 (shù, not a match for là). */
export const BITTER_RADICAL: Component = {
  id: 'kangxi-160-bitter',
  displayGlyph: '辛',
  role: 'semantic',
  meaning: 'bitter, spicy; hardship',
};

/** 酸 suān = ⿰酉夋 (酉, "wine vessel" + 夋). MMH's own ideographic hint: "wine 酉 aged too long; 夋 also provides the pronunciation" - but 夋 (qūn) is not a match for suān. */
export const WINE_RADICAL: Component = {
  id: 'kangxi-164-wine',
  displayGlyph: '酉',
  role: 'semantic',
  meaning: 'wine vessel',
};

/** 甜 tián = ⿰舌甘 (甘, "sweet" + 舌, reused from menu-animal's 舌 item). MMH's own ideographic hint: "something tasty 甘 to the tongue 舌" - both components real, independent meanings. MMH's own radical assignment is 甘. */
export const SWEET_RADICAL: Component = {
  id: 'kangxi-99-sweet',
  displayGlyph: '甘',
  role: 'semantic',
  meaning: 'sweet, tasty',
};

/** See `SWEET_RADICAL` - the other half of 甜's ideographic pair. */
export const TONGUE_RADICAL: Component = {
  id: 'kangxi-135-tongue',
  displayGlyph: '舌',
  role: 'semantic',
  meaning: 'tongue',
};

/** 料 liào = ⿰米斗 (斗, "dipper, to measure" + 米). MMH's own radical assignment is 斗; its ideographic hint: "a hand measuring 斗 a cup of rice 米". */
export const DIPPER_RADICAL: Component = {
  id: 'kangxi-68-dipper',
  displayGlyph: '斗',
  role: 'semantic',
  meaning: 'dipper; to measure',
};

/** 亿 yì = ⿰亻乙 (亻, reused from `PERSON_RADICAL` + 乙). MMH's own pictophonetic classification: semantic 亻, phonetic 乙. */
/** 亿 yì and 乙 (yǐ, yì, jué) share an attested reading including tone - `pinyin-data`'s full list for 乙, not just its more common yǐ reading. */
export const YI_PHONETIC: Component = {
  id: 'phonetic-yi',
  displayGlyph: '乙',
  role: 'phonetic',
  reliability: 'exact',
  meaning: 'second (of the ten heavenly stems)',
};

/** 例 lì = ⿰亻列 (亻, reused from `PERSON_RADICAL` + 列). MMH's own pictophonetic classification: semantic 亻, phonetic 列. */
/** 例 lì and 列 (liè, lì) share an attested reading including tone - `pinyin-data`'s full list for 列, not just its more common liè reading. */
export const LIE_PHONETIC: Component = {
  id: 'phonetic-lie',
  displayGlyph: '列',
  role: 'phonetic',
  reliability: 'exact',
  meaning: 'row, file; to arrange',
};

/** 位 wèi = ⿰亻立 (亻, reused from `PERSON_RADICAL` + 立, reused from `STAND_SEMANTIC`). MMH's own ideographic hint: "the place where a person 亻 stands 立" - both real, independent meanings. */

/** 注 zhù = ⿰氵主 (氵, reused from `WATER_RADICAL` + 主). MMH's own pictophonetic classification: semantic 氵, phonetic 主. */
/** 注 zhù and 主 (zhǔ, zhù) share an attested reading including tone - `pinyin-data`'s full list for 主, not just its more common zhǔ reading. */
export const ZHU_PHONETIC: Component = {
  id: 'phonetic-zhu',
  displayGlyph: '主',
  role: 'phonetic',
  reliability: 'exact',
  meaning: 'host, main, lord',
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
  [CAI_PHONETIC.id]: CAI_PHONETIC,
  [FIRE_RADICAL.id]: FIRE_RADICAL,
  [KAO_PHONETIC.id]: KAO_PHONETIC,
  [SHAO_PHONETIC.id]: SHAO_PHONETIC,
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
  [CLOTH_RADICAL.id]: CLOTH_RADICAL,
  [TEN_RADICAL.id]: TEN_RADICAL,
  [STONE_RADICAL.id]: STONE_RADICAL,
  [MA_PHONETIC.id]: MA_PHONETIC,
  [WAN_PHONETIC.id]: WAN_PHONETIC,
  [ONE_RADICAL.id]: ONE_RADICAL,
  [OX_RADICAL.id]: OX_RADICAL,
  [WOOD_RADICAL.id]: WOOD_RADICAL,
  [POTTERY_RADICAL.id]: POTTERY_RADICAL,
  [BOW_RADICAL.id]: BOW_RADICAL,
  [ICE_RADICAL.id]: ICE_RADICAL,
  [CLOTHES_RADICAL.id]: CLOTHES_RADICAL,
  [KNIFE_RADICAL.id]: KNIFE_RADICAL,
  [THOUSAND_RADICAL.id]: THOUSAND_RADICAL,
  [VILLAGE_RADICAL.id]: VILLAGE_RADICAL,
  [SPEECH_RADICAL.id]: SPEECH_RADICAL,
  [ZHENG_PHONETIC.id]: ZHENG_PHONETIC,
  [SPEECH_RADICAL_FULL.id]: SPEECH_RADICAL_FULL,
  [HEART_RADICAL_FULL.id]: HEART_RADICAL_FULL,
  [HUI_PHONETIC.id]: HUI_PHONETIC,
  [MOUND_RADICAL.id]: MOUND_RADICAL,
  [BUILDING_RADICAL.id]: BUILDING_RADICAL,
  [DOOR_RADICAL.id]: DOOR_RADICAL,
  [AXE_RADICAL.id]: AXE_RADICAL,
  [TWO_HANDS_RADICAL.id]: TWO_HANDS_RADICAL,
  [GATE_RADICAL.id]: GATE_RADICAL,
  [RUN_RADICAL.id]: RUN_RADICAL,
  [QI_PHONETIC.id]: QI_PHONETIC,
  [TI_PHONETIC.id]: TI_PHONETIC,
  [ZHI_PHONETIC.id]: ZHI_PHONETIC,
  [ALTAR_RADICAL.id]: ALTAR_RADICAL,
  [BITTER_RADICAL.id]: BITTER_RADICAL,
  [WINE_RADICAL.id]: WINE_RADICAL,
  [SWEET_RADICAL.id]: SWEET_RADICAL,
  [TONGUE_RADICAL.id]: TONGUE_RADICAL,
  [DIPPER_RADICAL.id]: DIPPER_RADICAL,
  [YI_PHONETIC.id]: YI_PHONETIC,
  [LIE_PHONETIC.id]: LIE_PHONETIC,
  [ZHU_PHONETIC.id]: ZHU_PHONETIC,
};

export function resolveComponent(id: ComponentId): Component | undefined {
  return COMPONENTS[id];
}
