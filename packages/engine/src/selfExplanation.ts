/**
 * PLAN.md Phase 8 / DESIGN.md §2.5 & §3.3.3(6): the one mnemonic-adjacent
 * mechanic the evidence actually supports is self-explanation that requires
 * *generation-or-selection from domain propositions* ("which part told you:
 * radical/phonetic/the character it is NOT") - never a post-hoc
 * strategy-attribution chip, which is a JOL and does not carry the g=0.55
 * self-explanation effect. This module only ever reads propositions back out
 * of a question's already-authored `decomposition`/`confusable_with` fields;
 * it never invents a cue, and a question with fewer than two genuine
 * propositions to choose between yields no prompt at all.
 */

import { resolveComponent, type ComponentId } from './components.js';
import type { Question, QuestionId } from './types.js';

export type SelfExplanationCueKind = 'semantic_radical' | 'phonetic_hint' | 'contrast_character';

export interface SelfExplanationCue {
  readonly kind: SelfExplanationCueKind;
  readonly componentId?: ComponentId;
  readonly contrastQuestionId?: QuestionId;
}

/**
 * The domain propositions a player could genuinely pick between for this
 * question, drawn only from stored fields. A `phonetic_hint` proposition is
 * withheld for an unverified or no-cue component (§3.3.3(6): a wrong hint
 * delivered as feedback in the resolution moment is worse than none).
 */
export function discriminatingCues(question: Question): readonly SelfExplanationCue[] {
  const cues: SelfExplanationCue[] = [];

  if (question.decomposition?.kind === 'character') {
    for (const { componentId, role } of question.decomposition.components) {
      // `'iconic'` satisfies the same "which part told you the meaning?"
      // proposition as `'meaning'` - a genuine pictograph is a stronger
      // meaning-carrier, not a weaker one, so it is not treated as a lesser
      // case. No other role (sound/remnant/simplified/deleted/distinguishing/
      // unknown) makes a meaning claim a player could pick.
      if (role === 'meaning' || role === 'iconic') {
        cues.push({ kind: 'semantic_radical', componentId });
      } else if (role === 'sound') {
        const reliability = resolveComponent(componentId)?.reliability;
        if (reliability !== undefined && reliability !== 'unverified' && reliability !== 'no-cue') {
          cues.push({ kind: 'phonetic_hint', componentId });
        }
      }
    }
  }

  for (const contrastQuestionId of question.confusable_with ?? []) {
    cues.push({ kind: 'contrast_character', contrastQuestionId });
  }

  return cues;
}

/**
 * A forced choice needs at least two propositions on offer, or it is not a
 * choice - this is the gate that keeps the prompt off atomic signs and
 * single-component characters with nothing to contrast against.
 */
export function hasSelfExplanationPrompt(question: Question): boolean {
  return discriminatingCues(question).length >= 2;
}
