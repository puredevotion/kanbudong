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

import { navigate } from '../lib/router.js';
import { getItemMemory, loadAllMemory, putItemMemory } from '../lib/soloMemory.js';
import { useApp } from '../lib/store.js';
import { ActionBar, Screen } from '../ui/atoms.jsx';

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

  const playerId = identity?.id ?? null;

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
    const isFirstEncounter = getItemMemory(playerId, current.id) === null;
    const grade = gradeFromAnswer(correct, isFirstEncounter);
    const updated = reviewItem(getItemMemory(playerId, current.id), grade, Date.now());
    putItemMemory(playerId, current.id, updated);
    setReveal({ chosenIndex, correct });
  };

  const advance = (): void => {
    setPresented((prev) => new Set(prev).add(current.id));
    setReviewed((n) => n + 1);
    setCurrent(null);
    setReveal(null);
  };

  return (
    <Screen
      title="Practice"
      subtitle={`${reviewed + 1} of up to ${SOLO_SESSION_TARGET_RETRIEVALS}`}
    >
      {presentedQuestion !== null && (
        <Card>
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
        <Card variant={reveal.correct ? 'secondary' : 'tertiary'}>
          <Card.Content className="flex flex-col gap-2 text-sm">
            <p className={reveal.correct ? 'font-medium text-success' : 'font-medium text-danger-text'}>
              {reveal.correct ? 'Correct' : 'Not quite'}
            </p>
            <p className="text-muted">{current.explanation}</p>
          </Card.Content>
        </Card>
      )}

      <ActionBar>
        {reveal === null ? (
          <Button variant="ghost" fullWidth onPress={() => navigate('/')}>
            Stop for now
          </Button>
        ) : (
          <Button variant="primary" size="lg" fullWidth onPress={advance}>
            Next
          </Button>
        )}
      </ActionBar>
    </Screen>
  );
}
