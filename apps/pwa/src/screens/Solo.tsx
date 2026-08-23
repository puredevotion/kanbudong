import {
  buildSoloQueue,
  gradeFromAnswer,
  nextSoloItem,
  presentQuestion,
  reviewItem,
  SEED_PACK,
  SOLO_SESSION_TARGET_RETRIEVALS,
  type PresentedQuestion,
  type Question,
  type QuestionId,
} from '@kanbudong/engine';
import { Button, Card, Typography } from '@heroui/react';
import { useEffect, useMemo, useState, type ReactNode } from 'react';

import { recordSoloAttempt } from '../lib/attemptLog.js';
import { navigate } from '../lib/router.js';
import { recordSessionStart } from '../lib/sessionLog.js';
import { getItemMemory, loadAllMemory, putItemMemory } from '../lib/soloMemory.js';
import { useApp } from '../lib/store.js';
import { ActionBar, Screen } from '../ui/atoms.jsx';
import { DecompositionPanel, useRevealDwell, useStage1HanziAlone } from '../ui/reveal.jsx';

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
  const [stage2, setStage2] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);

  const playerId = identity?.id ?? null;

  // DESIGN.md §12.2's falsification instrument - logged on every solo open,
  // deduped to once per calendar day by sessionLog.ts itself.
  useEffect(() => {
    if (playerId !== null) recordSessionStart(playerId, 'solo');
  }, [playerId]);

  // Session snapshot taken once: a session should not re-sort mid-way because
  // an earlier answer in the same session changed what's "due".
  const queue = useMemo(() => {
    if (playerId === null) return null;
    return buildSoloQueue(SEED_PACK, loadAllMemory(playerId), Date.now());
  }, [playerId]);

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

  if (playerId === null || queue === null) return null;

  if (done || current === null) {
    return (
      <Screen title="Session complete">
        <Card>
          <Card.Content className="flex flex-col gap-2 py-6 text-center">
            <Typography.Paragraph className="text-sm text-muted">
              {reviewed === 0
                ? "Nothing was due — you're caught up."
                : `You reviewed ${reviewed} item${reviewed === 1 ? '' : 's'}.`}
            </Typography.Paragraph>
          </Card.Content>
        </Card>
        <ActionBar>
          <Button variant="primary" size="lg" fullWidth onPress={() => navigate('/')}>
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
    const updated = reviewItem(priorMemory, grade, Date.now());
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
    setStage2(false);
    setShowBreakdown(false);
  };

  return (
    <Screen
      title="Practice"
      subtitle={`${reviewed + 1} of up to ${SOLO_SESSION_TARGET_RETRIEVALS}`}
    >
      {presentedQuestion !== null && (
        <Card key={presentedQuestion.question.id} className="anim-enter">
          <Card.Header>
            <Card.Title className="text-xl">{presentedQuestion.question.prompt}</Card.Title>
          </Card.Header>
          <Card.Content className="flex flex-col gap-2">
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
                  size="lg"
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
        <Card className="anim-reveal" variant={reveal.correct ? 'secondary' : 'tertiary'}>
          <Card.Content className="flex flex-col gap-2 text-sm">
            {/* Stage 1: the target hanzi alone, then the correction - nothing else. */}
            {current.face !== undefined && (
              <div className="font-han text-center text-[3rem] font-medium leading-none">
                {current.face.hanzi}
              </div>
            )}
            {!hanziAlone && (
              <p
                className={reveal.correct ? 'font-medium text-success' : 'font-medium text-danger-text'}
              >
                {reveal.correct ? 'Correct' : 'Not quite'}
              </p>
            )}
            {!reveal.correct && !hanziAlone && presentedQuestion !== null && (
              <p>
                <span className="text-muted">You said: </span>
                <span className="font-medium text-danger-text">
                  {presentedQuestion.options[reveal.chosenIndex]} — wrong
                </span>
              </p>
            )}

            {!hanziAlone && !stage2 && (
              <Button variant="ghost" size="sm" fullWidth onPress={() => setStage2(true)}>
                Show every option
              </Button>
            )}

            {!hanziAlone && stage2 && presentedQuestion !== null && (
              <div className="anim-fade-in flex flex-col gap-2">
                {current.options.map((option, i) => {
                  const isCorrect = i === current.answer;
                  const isChosenWrong =
                    !isCorrect && presentedQuestion.options[reveal.chosenIndex] === option;
                  return (
                    <div
                      key={option}
                      className={`rounded-xl border px-3 py-2 ${
                        isCorrect
                          ? 'border-l-4 border-l-success border-default-200/40'
                          : 'border-default-200/40'
                      }`}
                    >
                      <span className={isChosenWrong ? 'font-medium text-danger-text' : ''}>
                        {option}
                      </span>
                      {isChosenWrong && <span className="text-danger-text"> — wrong</span>}
                    </div>
                  );
                })}

                {(current.decomposition !== undefined || current.face?.transparency === 'opaque') && (
                  <>
                    {!showBreakdown ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        fullWidth
                        onPress={() => setShowBreakdown(true)}
                      >
                        See how it&apos;s made
                      </Button>
                    ) : (
                      <div className="anim-fade-in">
                        <DecompositionPanel
                          decomposition={current.decomposition}
                          transparency={current.face?.transparency}
                          structure={current.face?.structure}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {!hanziAlone && <p className="text-muted">{current.explanation}</p>}
          </Card.Content>
        </Card>
      )}

      <ActionBar>
        {reveal === null ? (
          <Button variant="ghost" fullWidth onPress={() => navigate('/')}>
            Stop for now
          </Button>
        ) : (
          <Button variant="primary" size="lg" fullWidth isDisabled={!dwellElapsed} onPress={advance}>
            Next
          </Button>
        )}
      </ActionBar>
    </Screen>
  );
}
