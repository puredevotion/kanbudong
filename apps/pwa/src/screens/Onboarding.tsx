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
          <div className="mx-auto mb-6 w-fit overflow-hidden rounded-[3px] shadow-[0_12px_26px_-10px_rgba(0,0,0,0.6)]">
            <div className="bg-[oklch(0.42_0.13_250)] px-3 py-1 text-center">
              <span className="text-[0.6rem] font-semibold tracking-[0.18em] text-white/85">METRO</span>
            </div>
            <div className="bg-[#f4f4f2] px-5 py-3">
              <span className="font-han text-[2.6rem] font-medium leading-none tracking-[0.04em] text-[#14140f]">
                出口
              </span>
            </div>
          </div>
          <Typography.Heading level={1} className="font-han text-3xl font-semibold tracking-tight">
            看不懂
          </Typography.Heading>
          <Typography.Paragraph className="mx-auto mt-1 max-w-xs text-sm text-muted">
            <span className="italic">kànbudǒng</span> &mdash; &ldquo;I look at it and I don&rsquo;t get it.&rdquo;
          </Typography.Paragraph>
          <Typography.Paragraph className="mx-auto mt-3 max-w-xs text-sm text-muted">
            Learn to read the signs. Menus, metro, price labels, shopfronts &mdash; the things you
            actually have to read, on the objects you actually meet them on.
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
