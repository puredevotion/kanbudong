import {
  resolveComponent,
  type CharacterStructure,
  type ComponentRole,
  type ConfusionType,
  type Decomposition,
  type GlossProvenance,
  type LociTile,
  type PhoneticReliability,
  type Question,
  type SelfExplanationCue,
  type Transparency,
} from '@kanbudong/engine';
import HanziWriter, { type CharacterJson } from 'hanzi-writer';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { withGlyphs } from './glyphs.jsx';

/**
 * Player-facing label for each of Dong Chinese's 8 component categories
 * (`packages/engine/src/components.ts`), rendered in the small uppercase tag
 * under a decomposition tile. Kept short - this sits in a `0.65rem` tile
 * footer, not a glossary entry.
 */
const ROLE_LABEL: Readonly<Record<ComponentRole, string>> = {
  meaning: 'meaning',
  sound: 'sound hint',
  iconic: 'picture of its meaning',
  remnant: 'leftover piece, no longer meaningful',
  simplified: 'simplification stand-in',
  deleted: 'dropped from the modern form',
  distinguishing: 'tells this apart from a similar character',
  unknown: '',
};

/**
 * §3.3.3(6)'s "a wrong hint delivered as feedback in the resolution moment is
 * worse than none" applies to this label the same way it applies to
 * `selfExplanation.ts`'s cue gate: a `'sound'` component whose registered
 * `PhoneticReliability` is `'unverified'` or `'no-cue'` makes no real
 * pronunciation claim (e.g. `DOOR_RADICAL`/户 in 所 - a genuine sound
 * component per Dong Chinese, but hù and suǒ share no reading at all), so it
 * must not render the same "sound hint" tag a real pronunciation cue gets.
 */
function roleLabel(role: ComponentRole, reliability: PhoneticReliability | undefined): string {
  if (
    role === 'sound' &&
    (reliability === undefined || reliability === 'unverified' || reliability === 'no-cue')
  ) {
    return 'no pronunciation cue';
  }
  return ROLE_LABEL[role];
}

/**
 * DESIGN.md §5.5: "minimum reveal dwell (~2,000 ms) before Next enables" -
 * engages WCAG SC 2.2.1. The "no timers" setting that must eventually defeat
 * this is scoped out of this phase (see PLAN.md Phase 5's explicit deferral
 * to Phase 6/an accessibility phase).
 */
const REVEAL_DWELL_MS = 2000;

/** DESIGN.md §2.5/§3.3.3(1): the hanzi alone, before anything else joins it. */
const STAGE1_HANZI_ALONE_MS = 800;

/**
 * Has at least {@link REVEAL_DWELL_MS} elapsed since `key` last changed?
 * Re-arms whenever `key` changes, so a new reveal always gets its own dwell.
 */
export function useRevealDwell(key: string | number): boolean {
  const [elapsed, setElapsed] = useState(false);
  const armedFor = useRef<string | number | null>(null);

  useEffect(() => {
    if (armedFor.current === key) return;
    armedFor.current = key;
    setElapsed(false);
    const id = setTimeout(() => setElapsed(true), REVEAL_DWELL_MS);
    return () => clearTimeout(id);
  }, [key]);

  return elapsed;
}

/**
 * DESIGN.md §2.5/§3.3.3(1): stage 1 shows the target hanzi alone for ~800 ms
 * before the correct answer (and, when a lure was chosen, that lure marked
 * wrong) joins it - never the reverse, and never all at once.
 */
export function useStage1HanziAlone(key: string | number): boolean {
  const [alone, setAlone] = useState(true);
  const armedFor = useRef<string | number | null>(null);

  useEffect(() => {
    if (armedFor.current === key) return;
    armedFor.current = key;
    setAlone(true);
    const id = setTimeout(() => setAlone(false), STAGE1_HANZI_ALONE_MS);
    return () => clearTimeout(id);
  }, [key]);

  return alone;
}

/**
 * DESIGN.md §3.3.3(9)/§5.5: the component cue is a separate glyph, never a
 * marking inside the character - so each component renders as its own tile,
 * and the discriminating one is picked out by weight/outline, never colour
 * (§4.5.1). Identity is always the stored `componentId`, resolved through
 * {@link resolveComponent}; nothing here ever compares glyphs or substrings.
 */
export function DecompositionPanel({
  decomposition,
  transparency,
  structure,
}: {
  decomposition: Decomposition | undefined;
  transparency: Transparency | undefined;
  structure: CharacterStructure | undefined;
}): ReactNode {
  if (decomposition === undefined) {
    if (transparency === 'opaque') {
      return (
        <p className='text-xs text-muted'>
          This one does not come apart into its pieces' meanings - learn it as a whole word.
        </p>
      );
    }
    return null;
  }

  if (decomposition.kind === 'word') {
    return (
      <div className={structure === 'top-bottom' ? 'flex flex-col gap-2' : 'flex gap-2'}>
        {decomposition.morphemes.map((m, i) => (
          <div
            key={`${m.span}-${i}`}
            className='grow rounded-xl border border-border bg-surface px-3 py-3 text-center'
          >
            <div className='font-han text-[2rem] font-medium leading-none'>{m.span}</div>
            <div className='mt-1.5 text-xs text-muted'>{m.gloss}</div>
          </div>
        ))}
      </div>
    );
  }

  if (structure === 'atomic') {
    return (
      <p className='text-xs text-muted'>
        This character does not decompose into taught components - learn it whole.
      </p>
    );
  }

  return (
    <div className={structure === 'top-bottom' ? 'flex flex-col gap-2' : 'flex gap-2'}>
      {decomposition.components.map(({ componentId, role }, i) => {
        const component = resolveComponent(componentId);
        // Exact componentId equality only, per §3.3.4 - never a substring or
        // glyph match against the character being decomposed.
        const isDiscriminating = componentId === decomposition.semantic_radical;
        return (
          <div
            key={`${componentId}-${i}`}
            className={`grow rounded-xl border bg-surface px-3 py-3 text-center ${
              isDiscriminating ? 'border-2 border-foreground' : 'border-border'
            }`}
          >
            <div className='font-han text-[2rem] font-medium leading-none'>
              {component?.displayGlyph ?? '?'}
            </div>
            {component?.meaning !== undefined && (
              <div className='mt-1 text-xs leading-snug'>{component.meaning}</div>
            )}
            <div className='mt-1.5 text-[0.65rem] uppercase tracking-wide text-muted'>
              {roleLabel(role, component?.reliability)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

const STROKE_DATA_URL = '/strokes/data.json';
let strokeDataPromise: Promise<Readonly<Record<string, CharacterJson>>> | null = null;

/**
 * Fetches scripts/build-strokes.mjs's build-time-generated, per-bank-
 * character subset of Make Me a Hanzi's stroke data (docs/LICENSING.md's
 * Arphic gate is what unblocked this) once per page load and caches the
 * result module-wide, so mounting several {@link StrokeOrderPanel}s in one
 * session (solo review after solo review) never re-fetches. Resolves to `{}`
 * on any failure - missing data is the same "render nothing" case as a
 * character Make Me a Hanzi never covered.
 */
function loadStrokeData(): Promise<Readonly<Record<string, CharacterJson>>> {
  strokeDataPromise ??= fetch(STROKE_DATA_URL)
    .then((res) => (res.ok ? (res.json() as Promise<Record<string, CharacterJson>>) : {}))
    .catch(() => ({}));
  return strokeDataPromise;
}

/**
 * One character's animated stroke order, mounted only once the panel above
 * is actually revealed - `HanziWriter.create` is handed the bundled
 * `CharacterJson` directly via `charDataLoader` rather than letting the
 * library fetch its own default (CDN-hosted, and this app must work
 * offline). Loops rather than plays once, since this sits inside an
 * already-tap-gated panel a player lingers on by choice.
 */
/** Each glyph's loop starts this much later than the previous one, so a word's characters draw in sequence rather than all at once. */
const STROKE_STAGGER_MS = 600;

function StrokeOrderGlyph({
  character,
  data,
  index,
}: {
  character: string;
  data: CharacterJson;
  index: number;
}): ReactNode {
  const targetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (targetRef.current === null) return;
    const writer = HanziWriter.create(targetRef.current, character, {
      width: 96,
      height: 96,
      padding: 6,
      showOutline: true,
      charDataLoader: (_char, onLoad) => onLoad(data),
    });
    const timer = setTimeout(() => void writer.loopCharacterAnimation(), index * STROKE_STAGGER_MS);
    return () => clearTimeout(timer);
  }, [character, data, index]);

  return <div ref={targetRef} className='rounded-xl border border-border bg-surface' />;
}

/**
 * DESIGN.md §3.3.1 (Hou & Jiang 2022): stroke-order animation shown during
 * timed recognition decreases accuracy - the same resolution
 * `DecompositionPanel`/`SelfExplanationPrompt` already use for that finding
 * applies here identically, so this never renders anywhere but inside the
 * already-tap-gated breakdown. One more explicit tap (matching
 * `SiblingsPanel`'s convention) reveals every distinct character in `hanzi`,
 * in the order it appears - a multi-character word gets one glyph per
 * character rather than a picker, mirroring how `DecompositionPanel`'s word
 * tiles already lay out per-character.
 *
 * Renders nothing - not even the toggle - if the generated dataset covers
 * none of `hanzi`'s characters, the same graceful-absence convention every
 * other panel here follows.
 */
export function StrokeOrderPanel({ hanzi }: { hanzi: string | undefined }): ReactNode {
  const [coverage, setCoverage] = useState<Readonly<Record<string, CharacterJson>> | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void loadStrokeData().then((data) => {
      if (!cancelled) setCoverage(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (hanzi === undefined || coverage === null) return null;
  const chars = [...new Set(hanzi)].filter((c) => coverage[c] !== undefined);
  if (chars.length === 0) return null;

  if (!shown) {
    return (
      <button
        type='button'
        onClick={() => setShown(true)}
        className='w-full rounded-xl border border-border px-3 py-2 text-[0.65rem] uppercase tracking-wide text-muted'
      >
        See how it&apos;s written
      </button>
    );
  }

  return (
    <div className='anim-fade-in flex flex-wrap justify-center gap-2'>
      {chars.map((c, i) => (
        <StrokeOrderGlyph key={c} character={c} data={coverage[c] as CharacterJson} index={i} />
      ))}
    </div>
  );
}

/**
 * The reveal's factual gloss or (for `glossProvenance: 'mnemonic-only'`
 * items) invented memory-aid story, promoted to its own bordered block at a
 * clearly larger size than the surrounding prose - it was previously one
 * `text-sm` paragraph indistinguishable from incidental copy. Mnemonic-only
 * content gets a "Memory aid" heading and an accent border so a player learns
 * to recognise "this one's invented, not a fact" at a glance, on top of the
 * existing small provenance tag (kept verbatim, just no longer the only cue).
 */
export function ExplanationPanel({
  explanation,
  glossProvenance,
}: {
  explanation: string;
  glossProvenance: GlossProvenance | undefined;
}): ReactNode {
  const isMnemonic = glossProvenance === 'mnemonic-only';
  return (
    <div
      className={`rounded-xl border px-4 py-3.5 ${
        isMnemonic ? 'border-tier-mid/40 bg-tier-mid/5' : 'border-border bg-surface'
      }`}
    >
      {isMnemonic && (
        <p className='mb-1.5 text-[0.65rem] uppercase tracking-wide text-tier-mid'>Memory aid</p>
      )}
      <p className='text-lg leading-snug'>{withGlyphs(explanation)}</p>
      {glossProvenance !== undefined && (
        <p className='mt-1.5 text-[0.65rem] uppercase tracking-wide text-muted/70'>
          ({glossProvenance === 'etymological' ? 'etymological' : 'mnemonic, not history'})
        </p>
      )}
    </div>
  );
}

/**
 * design/cards/README.md "the same move again": step 3 of the breakdown -
 * other real pack items built the same way as the one just studied, glyph
 * plus gloss each, "almost no new load". Purely presentational: the caller
 * resolves `siblings` via `siblingsSharingComponent(pack, question)` before
 * rendering, so this component never touches the pack itself. Renders
 * nothing when there is nothing to show, same convention as
 * {@link DecompositionPanel}.
 */
export function SiblingsPanel({ siblings }: { siblings: readonly Question[] }): ReactNode {
  if (siblings.length === 0) return null;
  return (
    <div className='flex flex-col gap-1.5'>
      <p className='text-[0.65rem] uppercase tracking-wide text-muted'>The same move again</p>
      <div className='flex gap-2'>
        {siblings.map((sibling) => (
          <div
            key={sibling.id}
            className='grow rounded-xl border border-border bg-surface px-3 py-3 text-center'
          >
            <div className='font-han text-[1.7rem] font-medium leading-none'>
              {sibling.face?.hanzi ?? '?'}
            </div>
            <div className='mt-1.5 text-[0.65rem] text-muted'>
              {sibling.face?.en ?? sibling.face?.nl ?? ''}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const CONFUSION_LABEL: Readonly<Record<ConfusionType, string>> = {
  form: 'looks almost identical',
  'meaning-visually-distinct': 'easy to mix up the meaning of',
  both: 'similar in both shape and meaning',
  'shared-morpheme': 'built from the same characters, opposite meaning',
};

/**
 * design/cards/README.md "the confusable" - step 4 of the breakdown. Shown
 * unconditionally rather than gated on both items' FSRS consolidation state
 * per the doc comment on `Question.confusable_with` ("once both members are
 * consolidated"): implementing that gate would mean threading per-player
 * memory state into the reveal UI, a bigger architectural change than this
 * panel warrants. Flagged as follow-up, not done here.
 *
 * Purely presentational, same contract as {@link SiblingsPanel}: the caller
 * resolves `confusables` via `confusablesFor(pack, question)`.
 */
export function ConfusablePanel({
  confusables,
  confusionType,
}: {
  confusables: readonly Question[];
  confusionType: ConfusionType | undefined;
}): ReactNode {
  if (confusables.length === 0) return null;
  return (
    <div className='rounded-xl border border-border bg-surface px-3 py-3'>
      <p className='text-[0.65rem] uppercase tracking-wide text-muted'>
        Don&apos;t confuse this with
        {confusionType !== undefined ? ` — ${CONFUSION_LABEL[confusionType]}` : ''}
      </p>
      <div className='mt-2 flex gap-2'>
        {confusables.map((confusable) => (
          <div
            key={confusable.id}
            className='grow rounded-xl border border-border px-3 py-3 text-center'
          >
            <div className='font-han text-[1.7rem] font-medium leading-none'>
              {confusable.face?.hanzi ?? '?'}
            </div>
            <div className='mt-1.5 text-[0.65rem] text-muted'>
              {confusable.face?.en ?? confusable.face?.nl ?? ''}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * PLAN.md Phase 8 / DESIGN.md §2.5 & §3.3.3(6): self-explanation only earns
 * its evidenced effect (g=0.55) when the player generates or selects a
 * domain proposition, not when they are simply shown the labelled tree - so
 * this asks "which part carries the meaning?" before either tile is
 * labelled, rather than restating {@link DecompositionPanel}'s callout.
 * Scoped to the one pairing real content ships (a semantic_radical cue next
 * to a hand-verified phonetic_hint cue, e.g. 肝's ⺼ beside 干); any other
 * cue combination renders nothing rather than guess at an unsupported shape.
 * Never scored: this is a self-check, not part of the graded loop (§2.5).
 */
export function SelfExplanationPrompt({
  cues,
  onPicked,
}: {
  cues: readonly SelfExplanationCue[];
  /** Fires once, the first time the player picks either tile - for Phase 9's mnemonic-prompt-usage log, not scoring. */
  onPicked?: () => void;
}): ReactNode {
  const [picked, setPicked] = useState<string | null>(null);
  const semantic = cues.find((c) => c.kind === 'semantic_radical');
  const phonetic = cues.find((c) => c.kind === 'phonetic_hint');

  if (semantic?.componentId === undefined || phonetic?.componentId === undefined) return null;

  const options = [semantic, phonetic] as const;

  return (
    <div className='rounded-xl border border-border bg-surface px-3 py-3'>
      <p className='text-xs text-muted'>Which part told you what this means?</p>
      <div className='mt-2 flex gap-2'>
        {options.map((cue) => {
          const component = resolveComponent(cue.componentId as string);
          const isPicked = picked === cue.componentId;
          const revealCorrect = picked !== null && cue.kind === 'semantic_radical';
          const revealWrong = picked !== null && isPicked && cue.kind === 'phonetic_hint';
          return (
            <button
              key={cue.componentId}
              type='button'
              disabled={picked !== null}
              onClick={() => {
                setPicked(cue.componentId as string);
                onPicked?.();
              }}
              className={`grow rounded-xl border px-3 py-3 text-center ${
                revealCorrect ? 'border-2 border-foreground' : 'border-border'
              }`}
            >
              <div className='font-han text-[2rem] font-medium leading-none'>
                {component?.displayGlyph ?? '?'}
              </div>
              {picked !== null && component?.meaning !== undefined && (
                <div className='mt-1 text-xs leading-snug'>{component.meaning}</div>
              )}
              {picked !== null && (
                <div className='mt-1.5 text-[0.65rem] uppercase tracking-wide text-muted'>
                  {cue.kind === 'semantic_radical' ? 'meaning - this one' : 'sound, not meaning'}
                </div>
              )}
              {revealWrong && (
                <div className='mt-0.5 text-[0.65rem] text-danger-text'>not this one</div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * PLAN.md's "loci hedge" - see `lociMnemonic.ts` for why this is deliberately
 * NOT shipped as a validated mechanic the way {@link SelfExplanationPrompt}
 * is: method-of-loci's evidence is lab-wordlist/ordered-list recall, not
 * meaning-retrieval-from-a-sign. It exists purely because some players
 * already use loci-style imagery on their own and find it works; this reuses
 * the two authored components as fixed named positions rather than building
 * any spatial UI. Entirely optional and never scored, same as the prompt
 * above - a player who ignores the button loses nothing.
 */
export function LociMnemonicPrompt({
  tiles,
  onUsed,
}: {
  tiles: readonly LociTile[];
  /** Fires once, when the player taps through - for Phase 9's mnemonic-prompt-usage log, not scoring. */
  onUsed?: () => void;
}): ReactNode {
  const [pictured, setPictured] = useState(false);
  const first = tiles[0];
  if (first === undefined) return null;
  const isRow = first.position === 'left' || first.position === 'right';

  return (
    <div className='rounded-xl border border-border bg-surface px-3 py-3'>
      <p className='text-xs text-muted'>
        Some people remember shapes better as a small scene. Picture this one as a two-part room.
      </p>
      <div className={`mt-2 flex gap-2 ${isRow ? '' : 'flex-col'}`}>
        {tiles.map((tile) => {
          const component = resolveComponent(tile.componentId);
          return (
            <div
              key={tile.componentId}
              className='grow rounded-xl border border-border bg-surface px-3 py-3 text-center'
            >
              <div className='font-han text-[2rem] font-medium leading-none'>
                {component?.displayGlyph ?? '?'}
              </div>
              {component?.meaning !== undefined && (
                <div className='mt-1 text-xs leading-snug'>{component.meaning}</div>
              )}
              <div className='mt-1.5 text-[0.65rem] uppercase tracking-wide text-muted'>
                {tile.position} spot &middot;{' '}
                {tile.role === 'meaning' || tile.role === 'iconic'
                  ? 'always the same kind of furniture'
                  : tile.role === 'sound' &&
                      component?.reliability !== undefined &&
                      component.reliability !== 'unverified' &&
                      component.reliability !== 'no-cue'
                    ? 'what the room sounds like'
                    : 'an odd detail in the room'}
              </div>
            </div>
          );
        })}
      </div>
      {!pictured ? (
        <button
          type='button'
          onClick={() => {
            setPictured(true);
            onUsed?.();
          }}
          className='mt-2 w-full rounded-xl border border-border px-3 py-2 text-[0.65rem] uppercase tracking-wide text-muted'
        >
          I pictured it
        </button>
      ) : (
        <p className='mt-2 text-[0.65rem] uppercase tracking-wide text-muted'>noted</p>
      )}
    </div>
  );
}
