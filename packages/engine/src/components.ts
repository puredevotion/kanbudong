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

export const COMPONENTS: Readonly<Record<ComponentId, Component>> = {
  [MEAT_RADICAL.id]: MEAT_RADICAL,
  [GAN_PHONETIC.id]: GAN_PHONETIC,
};

export function resolveComponent(id: ComponentId): Component | undefined {
  return COMPONENTS[id];
}
