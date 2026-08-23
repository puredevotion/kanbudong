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
};

/** 城 chéng = ⿰土成 (earth + 成). Verified against the same gitignored Make Me a Hanzi scratch copy as `STAND_SEMANTIC`. */
export const EARTH_SEMANTIC: Component = {
  id: 'kangxi-32-earth',
  displayGlyph: '土',
  role: 'semantic',
};

/** 城 chéng and 成 chéng share the same syllable including tone — verified against `pinyin-data`, structure against the same scratch copy as `EARTH_SEMANTIC`. */
export const CHENG_PHONETIC: Component = {
  id: 'phonetic-cheng',
  displayGlyph: '成',
  role: 'phonetic',
  reliability: 'exact',
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
};

/** 焖 mèn and 闷 mèn share the same syllable including tone - verified against `pinyin-data`. */
export const MEN_PHONETIC: Component = {
  id: 'phonetic-men',
  displayGlyph: '闷',
  role: 'phonetic',
  reliability: 'exact',
};

/** 爆 bào and 暴 bào share the same syllable including tone - verified against `pinyin-data`. */
export const BAO_PHONETIC: Component = {
  id: 'phonetic-bao',
  displayGlyph: '暴',
  role: 'phonetic',
  reliability: 'exact',
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
};

/**
 * 汤/涮 = ⿰氵X (water + X), both MMH `pictophonetic` with `semantic: '氵'`.
 * Neither phonetic half (昜/刷) is an exact-tone match, so semantic-only.
 */
export const WATER_RADICAL: Component = {
  id: 'kangxi-85-water',
  displayGlyph: '氵',
  role: 'semantic',
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
};

/**
 * 饭/饺/馆 = ⿰饣X (food + X), all three MMH `pictophonetic`/`ideographic`
 * with a food-radical semantic half. None of the three phonetic halves
 * (反/交/官) is an exact-tone match for 饭/饺/馆 - each is a near miss on tone
 * only (fǎn/fàn, jiāo/jiǎo, guān/guǎn), logged as such rather than shipped.
 */
export const FOOD_RADICAL: Component = {
  id: 'kangxi-184-food',
  displayGlyph: '饣',
  role: 'semantic',
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
};

/** 拌 bàn and 半 bàn share the same syllable including tone - verified against `pinyin-data`. */
export const BAN_PHONETIC: Component = {
  id: 'phonetic-ban',
  displayGlyph: '半',
  role: 'phonetic',
  reliability: 'exact',
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
};

/** 锅 guō and 呙 guō share the same syllable including tone - verified against `pinyin-data`. */
export const GUO_PHONETIC: Component = {
  id: 'phonetic-guo',
  displayGlyph: '呙',
  role: 'phonetic',
  reliability: 'exact',
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
};

export const COMPONENTS: Readonly<Record<ComponentId, Component>> = {
  [MEAT_RADICAL.id]: MEAT_RADICAL,
  [GAN_PHONETIC.id]: GAN_PHONETIC,
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
  [HAND_RADICAL.id]: HAND_RADICAL,
  [BAN_PHONETIC.id]: BAN_PHONETIC,
  [METAL_RADICAL.id]: METAL_RADICAL,
  [GUO_PHONETIC.id]: GUO_PHONETIC,
  [GRAIN_RADICAL.id]: GRAIN_RADICAL,
};

export function resolveComponent(id: ComponentId): Component | undefined {
  return COMPONENTS[id];
}
