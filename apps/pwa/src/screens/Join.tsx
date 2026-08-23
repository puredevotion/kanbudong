import { completeWord, isValidJoinCode, WORDS_PER_CODE } from '@kanbudong/engine';
import { parseScanned } from '@kanbudong/net';
import { Button, Card, Input, Spinner } from '@heroui/react';
import { useEffect, useState, type ReactNode } from 'react';

import { navigate, useRoute } from '../lib/router.js';
import { useApp } from '../lib/store.js';
import { ActionBar, Notice, Screen } from '../ui/atoms.jsx';
import { QrCamera } from '../ui/qr.jsx';

export function Join(): ReactNode {
  const route = useRoute();
  const joinByCode = useApp((s) => s.joinByCode);
  const joinByTicket = useApp((s) => s.joinByTicket);
  const busy = useApp((s) => s.busy);
  const error = useApp((s) => s.error);
  const dismissError = useApp((s) => s.dismissError);
  const identity = useApp((s) => s.identity);

  const [words, setWords] = useState<string[]>(() => new Array(WORDS_PER_CODE).fill(''));
  const [mode, setMode] = useState<'scan' | 'type'>('scan');

  // A scanned QR code opens the app straight at this route with the ticket in
  // the fragment, so honour it without making the player press anything.
  const ticketParam = route.params.get('t');
  useEffect(() => {
    if (ticketParam === null || identity === null) return;
    const ticket = parseScanned(ticketParam);
    if (ticket !== null) void joinByTicket(ticket);
  }, [ticketParam, identity, joinByTicket]);

  const code = words.map((w) => w.trim().toLowerCase()).join('-');
  const codeReady = isValidJoinCode(code);

  return (
    <Screen title="Join a game" subtitle="Scan the host's code, or type the four words.">
      <div className="flex gap-2">
        <Button
          variant={mode === 'scan' ? 'primary' : 'ghost'}
          size="sm"
          fullWidth
          onPress={() => setMode('scan')}
        >
          Scan a code
        </Button>
        <Button
          variant={mode === 'type' ? 'primary' : 'ghost'}
          size="sm"
          fullWidth
          onPress={() => setMode('type')}
        >
          Type the words
        </Button>
      </div>

      {error !== null && (
        <Notice tone="danger">
          <div className="flex flex-col gap-2">
            <span>{error}</span>
            <Button variant="ghost" size="sm" onPress={dismissError}>
              Try again
            </Button>
          </div>
        </Notice>
      )}

      {busy !== null && (
        <div className="flex items-center gap-3 rounded-xl border border-default-200/40 px-4 py-3">
          <Spinner size="sm" />
          <span className="text-sm text-default-foreground">{busy}</span>
        </div>
      )}

      {mode === 'scan' ? (
        <QrCamera
          onScan={(text) => {
            const ticket = parseScanned(text);
            if (ticket !== null) void joinByTicket(ticket);
          }}
        />
      ) : (
        <Card>
          <Card.Header>
            <Card.Title>Four words</Card.Title>
            <Card.Description>
              Ask the host to read them out. Order matters; capitals do not.
            </Card.Description>
          </Card.Header>
          <Card.Content className="flex flex-col gap-3">
            {words.map((word, index) => (
              <WordField
                key={index}
                position={index + 1}
                value={word}
                onChange={(next) =>
                  setWords((current) => current.map((w, i) => (i === index ? next : w)))
                }
              />
            ))}
          </Card.Content>
        </Card>
      )}

      <ActionBar>
        {mode === 'type' && (
          <Button
            variant="primary"
            size="lg"
            fullWidth
            isDisabled={!codeReady || busy !== null}
            onPress={() => void joinByCode(code)}
          >
            {codeReady ? 'Join this game' : 'Enter all four words'}
          </Button>
        )}
        <Button variant="ghost" fullWidth onPress={() => navigate('/')}>
          Back
        </Button>
      </ActionBar>
    </Screen>
  );
}

/**
 * One word, with completions. Typing four dictionary words on a phone keyboard
 * is the failure point of every code-based join flow, so each field offers the
 * matching words as soon as two letters are in.
 */
function WordField({
  position,
  value,
  onChange,
}: {
  position: number;
  value: string;
  onChange: (next: string) => void;
}): ReactNode {
  const matches = value.trim().length >= 2 ? completeWord(value, 4) : [];
  const exact = matches.length === 1 && matches[0] === value.trim().toLowerCase();

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <span className="w-4 shrink-0 text-center font-mono text-xs text-muted">
          {position}
        </span>
        <Input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="word"
          aria-label={`Word ${position} of the join code`}
          autoComplete="off"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          fullWidth
        />
      </div>
      {matches.length > 0 && !exact && (
        <div className="ml-6 flex flex-wrap gap-1.5">
          {matches.map((match) => (
            <Button key={match} variant="ghost" size="sm" onPress={() => onChange(match)}>
              {match}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
