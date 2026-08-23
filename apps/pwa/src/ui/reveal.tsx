import {
  resolveComponent,
  type CharacterStructure,
  type ConfusionType,
  type Decomposition,
  type LociTile,
  type Question,
  type SelfExplanationCue,
  type Transparency,
} from '@kanbudong/engine';
import { useEffect, useRef, useState, type ReactNode } from 'react';

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
        <p className="text-xs text-muted">
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
            className="grow rounded-xl border border-border bg-surface px-3 py-3 text-center"
          >
            <div className="font-han text-[2rem] font-medium leading-none">{m.span}</div>
            <div className="mt-1.5 text-xs text-muted">{m.gloss}</div>
          </div>
        ))}
      </div>
    );
  }

  if (structure === 'atomic') {
    return (
      <p className="text-xs text-muted">
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
            <div className="font-han text-[2rem] font-medium leading-none">
              {component?.displayGlyph ?? '?'}
            </div>
            <div className="mt-1.5 text-[0.65rem] uppercase tracking-wide text-muted">
              {role === 'semantic' ? 'meaning' : role === 'phonetic' ? 'sound hint' : ''}
            </div>
          </div>
        );
      })}
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
    <div className="flex flex-col gap-1.5">
      <p className="text-[0.65rem] uppercase tracking-wide text-muted">The same move again</p>
      <div className="flex gap-2">
        {siblings.map((sibling) => (
          <div
            key={sibling.id}
            className="grow rounded-xl border border-border bg-surface px-3 py-3 text-center"
          >
            <div className="font-han text-[1.7rem] font-medium leading-none">
              {sibling.face?.hanzi ?? '?'}
            </div>
            <div className="mt-1.5 text-[0.65rem] text-muted">
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
    <div className="rounded-xl border border-border bg-surface px-3 py-3">
      <p className="text-[0.65rem] uppercase tracking-wide text-muted">
        Don&apos;t confuse this with{confusionType !== undefined ? ` — ${CONFUSION_LABEL[confusionType]}` : ''}
      </p>
      <div className="mt-2 flex gap-2">
        {confusables.map((confusable) => (
          <div
            key={confusable.id}
            className="grow rounded-xl border border-border px-3 py-3 text-center"
          >
            <div className="font-han text-[1.7rem] font-medium leading-none">
              {confusable.face?.hanzi ?? '?'}
            </div>
            <div className="mt-1.5 text-[0.65rem] text-muted">
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
    <div className="rounded-xl border border-border bg-surface px-3 py-3">
      <p className="text-xs text-muted">Which part told you what this means?</p>
      <div className="mt-2 flex gap-2">
        {options.map((cue) => {
          const component = resolveComponent(cue.componentId as string);
          const isPicked = picked === cue.componentId;
          const revealCorrect = picked !== null && cue.kind === 'semantic_radical';
          const revealWrong = picked !== null && isPicked && cue.kind === 'phonetic_hint';
          return (
            <button
              key={cue.componentId}
              type="button"
              disabled={picked !== null}
              onClick={() => {
                setPicked(cue.componentId as string);
                onPicked?.();
              }}
              className={`grow rounded-xl border px-3 py-3 text-center ${
                revealCorrect ? 'border-2 border-foreground' : 'border-border'
              }`}
            >
              <div className="font-han text-[2rem] font-medium leading-none">
                {component?.displayGlyph ?? '?'}
              </div>
              {picked !== null && (
                <div className="mt-1.5 text-[0.65rem] uppercase tracking-wide text-muted">
                  {cue.kind === 'semantic_radical' ? 'meaning - this one' : 'sound, not meaning'}
                </div>
              )}
              {revealWrong && <div className="mt-0.5 text-[0.65rem] text-danger-text">not this one</div>}
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
    <div className="rounded-xl border border-border bg-surface px-3 py-3">
      <p className="text-xs text-muted">
        Some people remember shapes better as a small scene. Picture this one as a two-part room.
      </p>
      <div className={`mt-2 flex gap-2 ${isRow ? '' : 'flex-col'}`}>
        {tiles.map((tile) => {
          const component = resolveComponent(tile.componentId);
          return (
            <div
              key={tile.componentId}
              className="grow rounded-xl border border-border bg-surface px-3 py-3 text-center"
            >
              <div className="font-han text-[2rem] font-medium leading-none">
                {component?.displayGlyph ?? '?'}
              </div>
              <div className="mt-1.5 text-[0.65rem] uppercase tracking-wide text-muted">
                {tile.position} spot &middot;{' '}
                {tile.role === 'semantic' ? 'always the same kind of furniture' : 'what the room sounds like'}
              </div>
            </div>
          );
        })}
      </div>
      {!pictured ? (
        <button
          type="button"
          onClick={() => {
            setPictured(true);
            onUsed?.();
          }}
          className="mt-2 w-full rounded-xl border border-border px-3 py-2 text-[0.65rem] uppercase tracking-wide text-muted"
        >
          I pictured it
        </button>
      ) : (
        <p className="mt-2 text-[0.65rem] uppercase tracking-wide text-muted">noted</p>
      )}
    </div>
  );
}
