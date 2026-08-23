/**
 * PLAN.md Phase 8 follow-up ("loci hedge"), explicitly NOT the same bet as
 * `selfExplanation.ts`: method-of-loci's evidence base is lab-wordlist and
 * ordered-list recall, not meaning-retrieval-from-a-sign, so it does not
 * obviously transfer to this game's criterion task and is not shipped as a
 * validated mechanic. It exists only because some players already use
 * loci-style imagery on their own and report it working for them, and a
 * character's authored `CharacterDecomposition` already IS a small fixed
 * positional structure - two components sitting in a stored `structure`
 * (left-right, top-bottom). Reusing that costs nothing beyond what Phase 2
 * already authored, so this hands back two named positions rather than
 * inventing a spatial layout for content that has none.
 *
 * Scoped exactly as narrowly as `selfExplanation.ts`: a two-component
 * `CharacterDecomposition` with a `structure` this code can turn into an
 * honest pair of named positions. Any other shape - one component, three or
 * more, `enclosure`/`atomic`/unset structure - yields no prompt rather than
 * a guessed layout.
 */

import type { ComponentId, ComponentRole } from './components.js';
import type { CharacterStructure, Question } from './types.js';

export type LociPosition = 'left' | 'right' | 'top' | 'bottom';

export interface LociTile {
  readonly componentId: ComponentId;
  readonly role: ComponentRole;
  readonly position: LociPosition;
}

function positionsFor(
  structure: CharacterStructure | undefined,
): readonly [LociPosition, LociPosition] | undefined {
  if (structure === 'left-right') return ['left', 'right'];
  if (structure === 'top-bottom') return ['top', 'bottom'];
  return undefined;
}

/**
 * The fixed two-position "room" for a question's decomposition, or
 * `undefined` when there is not an honest one: fewer or more than two
 * authored components, or a structure this code has no two-slot layout for.
 */
export function lociTiles(question: Question): readonly LociTile[] | undefined {
  if (question.decomposition?.kind !== 'character') return undefined;
  const { components } = question.decomposition;
  if (components.length !== 2) return undefined;
  const positions = positionsFor(question.face?.structure);
  if (positions === undefined) return undefined;
  return components.map(({ componentId, role }, i) => ({
    componentId,
    role,
    position: positions[i] as LociPosition,
  }));
}

/** Whether this question has a loci-style prompt to offer at all - the UI's gate to render one. */
export function hasLociMnemonicPrompt(question: Question): boolean {
  return lociTiles(question) !== undefined;
}
