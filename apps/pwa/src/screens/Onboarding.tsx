import { Button, Card, Input, Typography } from '@heroui/react';
import { useState, type ReactNode } from 'react';

import { useApp } from '../lib/store.js';
import { Screen } from '../ui/atoms.jsx';

/**
 * The entire sign-up: one field, one button.
 *
 * The brief said "create an account by choosing a username, which gets assigned
 * a unique id". The id is real and load-bearing - it is a hash of a keypair this
 * device generates and it is what every signature resolves to - but showing it
 * to a player at sign-up would make a party game feel like a bank (R-17), so it
 * appears afterwards, small, as a device fingerprint.
 */
export function Onboarding(): ReactNode {
  const signUp = useApp((s) => s.signUp);
  const [username, setUsername] = useState('');
  const ready = username.trim().length > 0;

  return (
    <Screen>
      <div className="flex flex-1 flex-col justify-center gap-8 py-10">
        <div className="text-center">
          <div className="mx-auto mb-6 h-20 w-20 rounded-full border-4 border-tier-low/70 p-2">
            <div className="h-full w-full rounded-full border-4 border-tier-mid/70 p-1.5">
              <div className="h-full w-full rounded-full border-4 border-tier-high/80" />
            </div>
          </div>
          <Typography.Heading level={1} className="text-3xl font-semibold tracking-tight">
            看不懂
          </Typography.Heading>
          <Typography.Paragraph className="mx-auto mt-3 max-w-xs text-sm text-muted">
            Eighteen categories. Three levels of nerve. Fifteen points if you are right about the
            hard one, ten off if you are not - and you choose the level before you see the
            question.
          </Typography.Paragraph>
        </div>

        <Card>
          <Card.Header>
            <Card.Title>Pick a name</Card.Title>
            <Card.Description>
              However your friends know you. It does not have to be unique.
            </Card.Description>
          </Card.Header>
          <Card.Content className="flex flex-col gap-3">
            <Input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Ada"
              aria-label="Your name"
              autoComplete="nickname"
              maxLength={24}
              fullWidth
            />
            <Button
              variant="primary"
              size="lg"
              fullWidth
              isDisabled={!ready}
              onPress={() => signUp(username)}
            >
              Start playing
            </Button>
          </Card.Content>
        </Card>

        <p className="text-center text-xs text-muted">
          Nothing is sent to a server. Your key stays on this device.
        </p>
      </div>
    </Screen>
  );
}
