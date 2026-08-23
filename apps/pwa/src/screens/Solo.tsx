import {
  buildSoloQueue,
  confusablesFor,
  discriminatingCues,
  gradeFromAnswer,
  hasSelfExplanationPrompt,
  lociTiles,
  nextSoloItem,
  presentQuestion,
  reviewItem,
  SEED_PACK,
  siblingsSharingComponent,
  SOLO_SESSION_TARGET_RETRIEVALS,
  type PresentedQuestion,
  type Question,
  type QuestionId,
} from '@kanbudong/engine';
import { Button, Card, Typography } from '@heroui/react';
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

import { recordSoloAttempt } from '../lib/attemptLog.js';
import { currentFsrsParameters, maybeRefitFsrsParameters } from '../lib/fsrsRefit.js';
import { recordMnemonicPromptUsed } from '../lib/mnemonicPromptLog.js';
import { navigate } from '../lib/router.js';
import { recordSessionStart } from '../lib/sessionLog.js';
import { getItemMemory, loadAllMemory, putItemMemory } from '../lib/soloMemory.js';
import { useApp } from '../lib/store.js';
import { ActionBar, Screen } from '../ui/atoms.jsx';
import {
  ConfusablePanel,
  DecompositionPanel,
  ExplanationPanel,
  LociMnemonicPrompt,
  SelfExplanationPrompt,
  SiblingsPanel,
  StrokeOrderPanel,
  useRevealDwell,
  useStage1HanziAlone,
} from '../ui/reveal.jsx';
import { Sign, templateFor } from '../ui/signs.jsx';

/**
 * The solo daily surface (docs/DESIGN.md §11.9). No opponent, no bet tiers, no
 * public reveal, no score, no streak — a fixed short review session drawn
 * from this device's own due queue. This is the primary path §12.2 expects
 * most learning to happen on; the party game is how people find the bank and
 * why they come back to a table.
 */
export function Solo(): ReactNode {
  const identity = useApp((s) => s.identity);
  const [presented, setPresented] = useState<ReadonlySet<QuestionId>>(new Set());
  const [current, setCurrent] = useState<Question | null>(null);
  const [reviewed, setReviewed] = useState(0);
  const [reveal, setReveal] = useState<{ chosenIndex: number; correct: boolean } | null>(null);
  const [done, setDone] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [showSiblings, setShowSiblings] = useState(false);
  const [mnemonicMode, setMnemonicMode] = useState<'self_explanation' | 'loci'>('self_explanation');

  const playerId = identity?.id ?? null;

  // DESIGN.md §12.2's falsification instrument - logged on every solo open,
  // deduped to once per calendar day by sessionLog.ts itself.
  useEffect(() => {
    if (playerId !== null) recordSessionStart(playerId, 'solo');
  }, [playerId]);

  // Loaded once per session, same as the queue snapshot below: a personal
  // fit landing mid-session (see maybeRefitFsrsParameters) should not change
  // which w this session's due/overdue math is using partway through.
  const w = useMemo(() => (playerId === null ? null : currentFsrsParameters(playerId)), [playerId]);

  // Session snapshot taken once: a session should not re-sort mid-way because
  // an earlier answer in the same session changed what's "due".
  const queue = useMemo(() => {
    if (playerId === null || w === null) return null;
    return buildSoloQueue(SEED_PACK, loadAllMemory(playerId), Date.now(), new Set(), w);
  }, [playerId, w]);

  const presentedQuestion = useMemo<PresentedQuestion | null>(() => {
    if (current === null) return null;
    return presentQuestion(current, `solo-${current.id}-${reviewed}`);
  }, [current, reviewed]);

  useEffect(() => {
    if (queue === null || current !== null || done) return;
    const next = nextSoloItem(queue, presented);
    if (next === null || reviewed >= SOLO_SESSION_TARGET_RETRIEVALS) {
      setDone(true);
    } else {
      setCurrent(next);
    }
  }, [queue, current, done, presented, reviewed]);

  // DESIGN.md §2.5/§5.5: stage 1's hanzi-alone dwell and the minimum reveal
  // dwell both count from the moment a reveal appears, not from when the
  // question was shown - "none" while there is no reveal keeps both hooks
  // unarmed without making their call conditional (rules of hooks).
  const revealArmKey = current !== null && reveal !== null ? `${current.id}-${reviewed}` : 'none';
  const hanziAlone = useStage1HanziAlone(revealArmKey);
  const dwellElapsed = useRevealDwell(revealArmKey);

  const siblings = useMemo(
    () => (current === null ? [] : siblingsSharingComponent(SEED_PACK, current)),
    [current],
  );
  const confusables = useMemo(
    () => (current === null ? [] : confusablesFor(SEED_PACK, current)),
    [current],
  );

  const showSelfExplain = useMemo(
    () => current !== null && hasSelfExplanationPrompt(current),
    [current],
  );
  const tiles = useMemo(() => (current === null ? undefined : lociTiles(current)), [current]);
  const showLoci = tiles !== undefined;

  // DESIGN.md §10's instrumentation ruling: log exactly one outcome per
  // reveal that actually offered a mnemonic prompt, defaulting to 'none' so
  // "shown and ignored" is distinguishable from "never shown" - see
  // packages/engine/src/mnemonicPromptLog.ts. Solo has no per-turn Outcome
  // component to key a mount/unmount effect on (unlike Play.tsx), so this is
  // keyed on `revealArmKey` instead: that key goes back to 'none' the moment
  // `advance()` clears `current`/`reveal`, which is exactly when a reveal closes.
  const breakdownOpenedRef = useRef(false);
  const mnemonicKindRef = useRef<'self_explanation' | 'loci' | 'none'>('none');
  useEffect(() => {
    return () => {
      if (
        playerId !== null &&
        current !== null &&
        breakdownOpenedRef.current &&
        (showSelfExplain || showLoci)
      ) {
        recordMnemonicPromptUsed(playerId, current.id, mnemonicKindRef.current);
      }
      breakdownOpenedRef.current = false;
      mnemonicKindRef.current = 'none';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revealArmKey]);

  // Fired once the session-complete screen is about to render, never mid-
  // session: `maybeRefitFsrsParameters` is a WASM optimizer pass that must
  // not compete with an active review for the main thread (it hops to a
  // Worker regardless, but this keeps the trigger point honest too).
  useEffect(() => {
    if (playerId !== null && done) void maybeRefitFsrsParameters(playerId);
  }, [playerId, done]);

  if (playerId === null || queue === null) return null;

  if (done || current === null) {
    return (
      <Screen title='Session complete'>
        <Card>
          <Card.Content className='flex flex-col gap-2 py-6 text-center'>
            <Typography.Paragraph className='text-sm text-muted'>
              {reviewed === 0
                ? "Nothing was due — you're caught up."
                : `You reviewed ${reviewed} item${reviewed === 1 ? '' : 's'}.`}
            </Typography.Paragraph>
          </Card.Content>
        </Card>
        <ActionBar>
          <Button variant='primary' size='lg' fullWidth onPress={() => navigate('/')}>
            Done
          </Button>
        </ActionBar>
      </Screen>
    );
  }

  const submit = (chosenIndex: number): void => {
    if (reveal !== null || presentedQuestion === null) return;
    const correct = chosenIndex === presentedQuestion.correctIndex;
    const priorMemory = getItemMemory(playerId, current.id);
    const isFirstEncounter = priorMemory === null;
    const grade = gradeFromAnswer(correct, isFirstEncounter);
    const updated = reviewItem(priorMemory, grade, Date.now(), 'review', w ?? undefined);
    if (updated !== null) putItemMemory(playerId, current.id, updated);
    // DESIGN.md §10.1: "log chosen_option, not just correct/incorrect" -
    // recorded before the FSRS grade so a confusion-matrix read can still
    // tell what was actually tapped, distractor text included.
    recordSoloAttempt(playerId, {
      questionId: current.id,
      chosenText: presentedQuestion.options[chosenIndex] ?? null,
      correct,
      priorLastReview: priorMemory?.lastReview ?? null,
    });
    setReveal({ chosenIndex, correct });
  };

  const advance = (): void => {
    setPresented((prev) => new Set(prev).add(current.id));
    setReviewed((n) => n + 1);
    setCurrent(null);
    setReveal(null);
    setRevealed(false);
    setShowSiblings(false);
    setMnemonicMode('self_explanation');
  };

  return (
    <Screen
      title='Practice'
      subtitle={`${reviewed + 1} of up to ${SOLO_SESSION_TARGET_RETRIEVALS}`}
    >
      {presentedQuestion !== null && (
        <Card key={presentedQuestion.question.id} className='anim-enter'>
          <Card.Content className='flex flex-col gap-4 pt-4'>
            {presentedQuestion.question.face !== undefined && (
              <Sign
                template={templateFor(presentedQuestion.question.category)}
                category={presentedQuestion.question.category}
                hanzi={presentedQuestion.question.face.hanzi}
                context={presentedQuestion.question.face.context}
              />
            )}
            <Card.Title className='text-xl'>{presentedQuestion.question.prompt}</Card.Title>
          </Card.Content>
          <Card.Content className='flex flex-col gap-2'>
            {presentedQuestion.options.map((option, index) => {
              const isChosen = reveal?.chosenIndex === index;
              const isCorrectOption = reveal !== null && index === presentedQuestion.correctIndex;
              const variant =
                reveal === null
                  ? 'secondary'
                  : isCorrectOption
                    ? 'primary'
                    : isChosen
                      ? 'tertiary'
                      : 'secondary';
              return (
                <Button
                  key={option}
                  variant={variant}
                  size='lg'
                  fullWidth
                  isDisabled={reveal !== null}
                  onPress={() => submit(index)}
                >
                  {option}
                </Button>
              );
            })}
          </Card.Content>
        </Card>
      )}

      {reveal !== null && (
        <Card className='anim-reveal' variant={reveal.correct ? 'secondary' : 'tertiary'}>
          <Card.Content className='flex flex-col gap-2 text-sm'>
            {/* Stage 1: the target hanzi alone, then the correction - nothing else. */}
            {current.face !== undefined && (
              <div className='font-han text-center text-[3rem] font-medium leading-none'>
                {current.face.hanzi}
              </div>
            )}
            {!hanziAlone && (
              <p
                className={
                  reveal.correct ? 'font-medium text-success' : 'font-medium text-danger-text'
                }
              >
                {reveal.correct ? 'Correct' : 'Not quite'}
              </p>
            )}
            {!hanziAlone && current.face !== undefined && (
              <p className='text-muted'>
                {current.face.pinyin}
                {current.face.nl !== undefined && ` · ${current.face.nl}`}
                {current.face.en !== undefined && ` (${current.face.en})`}
              </p>
            )}
            {!reveal.correct && !hanziAlone && presentedQuestion !== null && (
              <p>
                <span className='text-muted'>You said: </span>
                <span className='font-medium text-danger-text'>
                  {presentedQuestion.options[reveal.chosenIndex]} — wrong
                </span>
              </p>
            )}

            {!hanziAlone && !revealed && (
              <Button
                variant='ghost'
                size='sm'
                fullWidth
                onPress={() => {
                  breakdownOpenedRef.current = true;
                  setRevealed(true);
                }}
              >
                Show the breakdown
              </Button>
            )}

            {!hanziAlone && revealed && presentedQuestion !== null && (
              <div className='anim-fade-in flex flex-col gap-2'>
                {(current.decomposition !== undefined ||
                  current.face?.transparency === 'opaque') && (
                  <div className='anim-fade-in flex flex-col gap-2'>
                    <DecompositionPanel
                      decomposition={current.decomposition}
                      transparency={current.face?.transparency}
                      structure={current.face?.structure}
                    />

                    <StrokeOrderPanel hanzi={current.face?.hanzi} />

                    {showSelfExplain && showLoci && (
                      <div className='flex gap-3 text-[0.65rem] uppercase tracking-wide text-muted'>
                        <button
                          type='button'
                          onClick={() => setMnemonicMode('self_explanation')}
                          className={
                            mnemonicMode === 'self_explanation'
                              ? 'font-semibold text-foreground'
                              : ''
                          }
                        >
                          which part means it
                        </button>
                        <button
                          type='button'
                          onClick={() => setMnemonicMode('loci')}
                          className={mnemonicMode === 'loci' ? 'font-semibold text-foreground' : ''}
                        >
                          picture it instead
                        </button>
                      </div>
                    )}
                    {showSelfExplain && (mnemonicMode === 'self_explanation' || !showLoci) && (
                      <SelfExplanationPrompt
                        cues={discriminatingCues(current)}
                        onPicked={() => {
                          mnemonicKindRef.current = 'self_explanation';
                        }}
                      />
                    )}
                    {showLoci && (mnemonicMode === 'loci' || !showSelfExplain) && (
                      <LociMnemonicPrompt
                        tiles={tiles}
                        onUsed={() => {
                          mnemonicKindRef.current = 'loci';
                        }}
                      />
                    )}

                    {confusables.length > 0 && (
                      <ConfusablePanel
                        confusables={confusables}
                        confusionType={current.confusion_type}
                      />
                    )}

                    {siblings.length > 0 &&
                      (!showSiblings ? (
                        <Button
                          variant='ghost'
                          size='sm'
                          fullWidth
                          onPress={() => setShowSiblings(true)}
                        >
                          See the same move again
                        </Button>
                      ) : (
                        <div className='anim-fade-in'>
                          <SiblingsPanel siblings={siblings} />
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}

            {!hanziAlone && (
              <ExplanationPanel
                explanation={current.explanation}
                glossProvenance={current.glossProvenance}
              />
            )}
          </Card.Content>
        </Card>
      )}

      <ActionBar>
        {reveal === null ? (
          <Button variant='ghost' fullWidth onPress={() => navigate('/')}>
            Stop for now
          </Button>
        ) : (
          <Button
            variant='primary'
            size='lg'
            fullWidth
            isDisabled={!dwellElapsed}
            onPress={advance}
          >
            Next
          </Button>
        )}
      </ActionBar>
    </Screen>
  );
}
