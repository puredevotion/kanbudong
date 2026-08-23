import { DEFAULT_RULES, type RulesConfig } from '@kanbudong/engine';
import { Button, Card, Input, Switch } from '@heroui/react';
import { useState, type ReactNode } from 'react';

import { navigate } from '../lib/router.js';
import { useApp } from '../lib/store.js';
import { ActionBar, Notice, Screen } from '../ui/atoms.jsx';

/**
 * House rules, exposed rather than hidden.
 *
 * Every switch here is an argument the adversarial review had and recorded: the
 * defaults are spec-faithful, and the levers exist because a group that hits the
 * failure mode should be able to fix its own game without waiting for a release.
 */
export function Create(): ReactNode {
  const host = useApp((s) => s.host);
  const identity = useApp((s) => s.identity);
  const [name, setName] = useState('');
  const [capStreak, setCapStreak] = useState(false);
  const [floorScore, setFloorScore] = useState(false);
  const [target, setTarget] = useState(String(DEFAULT_RULES.targetScore));

  const parsedTarget = Number.parseInt(target, 10);
  const targetOk = Number.isFinite(parsedTarget) && parsedTarget >= 5 && parsedTarget <= 1000;

  const rules: Partial<RulesConfig> = {
    targetScore: targetOk ? parsedTarget : DEFAULT_RULES.targetScore,
    maxCorrectStreakPerTurn: capStreak ? 3 : null,
    scoreFloor: floorScore ? 0 : null,
  };

  return (
    <Screen
      title='Host a game'
      subtitle={`You will be the host, ${identity?.username ?? 'you'}. Others scan your code to join.`}
    >
      <Card>
        <Card.Header>
          <Card.Title>Name the game</Card.Title>
          <Card.Description>Shown to anyone who scans your code.</Card.Description>
        </Card.Header>
        <Card.Content>
          <Input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder='Thursday night'
            aria-label='Game name'
            maxLength={40}
            fullWidth
          />
        </Card.Content>
      </Card>

      <Card>
        <Card.Header>
          <Card.Title>Target score</Card.Title>
          <Card.Description>
            46 is the standard. Whoever crosses it first wins outright - no waiting for the round to
            finish, no equal-turns fairness rule.
          </Card.Description>
        </Card.Header>
        <Card.Content>
          <Input
            value={target}
            onChange={(event) => setTarget(event.target.value)}
            inputMode='numeric'
            aria-label='Target score'
            fullWidth
          />
          {!targetOk && (
            <p className='mt-2 text-xs text-danger-text'>Pick a number between 5 and 1000.</p>
          )}
        </Card.Content>
      </Card>

      <Card>
        <Card.Header>
          <Card.Title>House rules</Card.Title>
          <Card.Description>Both off is the game exactly as specified.</Card.Description>
        </Card.Header>
        <Card.Content className='flex flex-col gap-4'>
          <Switch isSelected={capStreak} onChange={setCapStreak}>
            <div className='flex flex-col'>
              <span className='text-sm font-medium'>Pass the turn after 3 in a row</span>
              <span className='text-xs text-muted'>
                Without this, a team that keeps answering correctly keeps the turn forever - which
                can mean one team plays the whole game while everyone watches.
              </span>
            </div>
          </Switch>
          <Switch isSelected={floorScore} onChange={setFloorScore}>
            <div className='flex flex-col'>
              <span className='text-sm font-medium'>Never go below zero</span>
              <span className='text-xs text-muted'>
                Kinder, but it makes the high-level question a free bet, which is the whole tension
                gone.
              </span>
            </div>
          </Switch>
        </Card.Content>
      </Card>

      <Notice>
        You need at least two teams with a player each before the game can start. Two people on one
        team is not a game.
      </Notice>

      <ActionBar>
        <Button
          variant='primary'
          size='lg'
          fullWidth
          isDisabled={!targetOk}
          onPress={() => host(name.trim().length === 0 ? '看不懂' : name.trim(), rules)}
        >
          Open the lobby
        </Button>
        <Button variant='ghost' fullWidth onPress={() => navigate('/')}>
          Back
        </Button>
      </ActionBar>
    </Screen>
  );
}
