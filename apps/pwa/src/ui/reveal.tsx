import {
  resolveComponent,
  type CharacterStructure,
  type Decomposition,
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
