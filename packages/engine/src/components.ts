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
 * The component table. Empty of real content on purpose - sourcing a real
 * decomposition dataset is explicitly deferred to Phase 2 planning (Make Me a
 * Hanzi's `dictionary.txt` is LGPL and cannot ship; a replacement has to be
 * regenerated from Unihan + CC-CEDICT). `MEAT_RADICAL` exists only as the
 * regression fixture the §3.3.4 ruling calls for: a component whose
 * `displayGlyph` renders identically to 月 but whose `id` and Kangxi radical
 * are not 月's.
 */
export const MEAT_RADICAL: Component = {
  id: 'kangxi-130-meat',
  displayGlyph: '⺼',
  role: 'semantic',
};

export const COMPONENTS: Readonly<Record<ComponentId, Component>> = {
  [MEAT_RADICAL.id]: MEAT_RADICAL,
};

export function resolveComponent(id: ComponentId): Component | undefined {
  return COMPONENTS[id];
}
