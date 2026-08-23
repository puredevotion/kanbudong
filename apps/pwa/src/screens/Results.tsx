import { finalStandings, streakHistogram, type GameState } from '@kanbudong/engine';
import { Button, Card, Chip } from '@heroui/react';
import type { ReactNode } from 'react';

import { useApp } from '../lib/store.js';
import { ActionBar, Notice, Screen } from '../ui/atoms.jsx';

export function Results(): ReactNode {
  const snapshot = useApp((s) => s.snapshot);
  const leave = useApp((s) => s.leave);
  const state = snapshot?.state ?? null;
  if (state === null) return null;

  const standings = finalStandings(state);
  const winner = standings.find((row) => row.team.id === state.winnerTeamId);

  return (
    <Screen
      title={winner === undefined ? 'Game over' : `${winner.team.name} win`}
      subtitle={
        state.suddenDeath
          ? 'Settled in sudden death.'
          : `${state.roundIndex} rounds, ${state.history.length} questions.`
      }
    >
      <div className='flex flex-col gap-2'>
        {standings.map((row) => (
          <div
            key={row.team.id}
            className={`flex items-baseline justify-between gap-3 rounded-xl border px-4 py-3 ${
              row.team.id === state.winnerTeamId
                ? 'border-success/60 bg-success/10'
                : 'border-default-200/30'
            }`}
          >
            <span className='flex min-w-0 items-baseline gap-2'>
              <span className='font-mono text-xs text-muted'>{row.rank}</span>
              <span className='truncate font-medium'>{row.team.name}</span>
              {row.team.id === state.winnerTeamId && (
                <Chip color='success' variant='soft' size='sm'>
                  winner
                </Chip>
              )}
            </span>
            <span className='font-mono tabular-nums'>{row.score}</span>
          </div>
        ))}
      </div>

      <StreakReport state={state} />

      <Card variant='secondary'>
        <Card.Header>
          <Card.Title className='text-base'>Every question</Card.Title>
        </Card.Header>
        <Card.Content className='flex max-h-72 flex-col gap-1.5 overflow-y-auto text-sm'>
          {state.history.map((record) => (
            <div key={record.turnIndex} className='flex items-baseline justify-between gap-3'>
              <span className='min-w-0 truncate text-muted'>
                {state.teams.find((t) => t.id === record.teamId)?.name ?? 'team'} -{' '}
                {record.categoryId} <span className='text-muted'>({record.difficulty})</span>
              </span>
              <span
                className={`font-mono tabular-nums ${
                  record.delta > 0 ? 'text-success' : 'text-danger-text'
                }`}
              >
                {record.delta > 0 ? `+${record.delta}` : record.delta}
              </span>
            </div>
          ))}
        </Card.Content>
      </Card>

      <ActionBar>
        <Button variant='primary' size='lg' fullWidth onPress={leave}>
          Done
        </Button>
      </ActionBar>
    </Screen>
  );
}

/**
 * The measurement the whole roadmap turns on.
 *
 * The rule that a correct answer returns the turn to the same team has no cap,
 * so a strong team can in principle play the entire game while everyone else
 * watches. Rather than guess, the app reports the streak distribution after
 * every game: if the winning streaks are routinely long, the default changes.
 */
function StreakReport({ state }: { state: GameState }): ReactNode {
  const histogram = streakHistogram(state);
  const runs = Object.entries(histogram)
    .map(([length, count]) => ({ length: Number(length), count }))
    .filter((entry) => entry.length > 0)
    .sort((a, b) => b.length - a.length);
  const longest = runs[0]?.length ?? 0;

  if (longest === 0) return null;

  return (
    <Card variant='secondary'>
      <Card.Header>
        <Card.Title className='text-base'>Streaks</Card.Title>
        <Card.Description>Longest unbroken run of correct answers: {longest}.</Card.Description>
      </Card.Header>
      <Card.Content>
        {longest >= 6 ? (
          <Notice tone='warn'>
            One team held the turn for {longest} questions in a row. If that keeps happening, turn
            on &quot;pass the turn after 3 in a row&quot; when hosting - otherwise the other teams
            spend the game watching.
          </Notice>
        ) : (
          <p className='text-sm text-muted'>The turn moved around, which is what you want.</p>
        )}
      </Card.Content>
    </Card>
  );
}
