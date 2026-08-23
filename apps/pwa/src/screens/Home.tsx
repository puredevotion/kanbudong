import { DEFAULT_RULES, DIFFICULTY_ORDER, DIFFICULTY_TIERS, shortenId } from '@kanbudong/engine';
import { Button, Card, Input, Typography } from '@heroui/react';
import { useEffect, useState, type ReactNode } from 'react';

import { navigate } from '../lib/router.js';
import { useApp } from '../lib/store.js';
import { Screen } from '../ui/atoms.jsx';

export function Home(): ReactNode {
  const identity = useApp((s) => s.identity);
  const rename = useApp((s) => s.rename);
  const deviceLabel = useApp((s) => s.deviceLabel);
  const renameDevice = useApp((s) => s.renameDevice);
  const resume = useApp((s) => s.resume);
  const [resumable, setResumable] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [draftName, setDraftName] = useState('');
  const [editingDevice, setEditingDevice] = useState(false);
  const [draftDevice, setDraftDevice] = useState('');

  useEffect(() => {
    // Probe once, without joining: a stale "continue" button that does nothing
    // is worse than no button.
    let live = true;
    void (async () => {
      const ok = await resumeProbe();
      if (live) setResumable(ok);
    })();
    return () => {
      live = false;
    };
  }, []);

  if (identity === null) return null;

  return (
    <Screen>
      <div className="flex flex-1 flex-col justify-center gap-6 py-8">
        <div>
          <Typography.Paragraph className="text-sm text-muted">
            Signed in as
          </Typography.Paragraph>
          {editingName ? (
            <div className="flex items-center gap-2">
              <Input
                value={draftName}
                onChange={(event) => setDraftName(event.target.value)}
                aria-label="Your name"
                autoComplete="nickname"
                maxLength={24}
                autoFocus
                fullWidth
              />
              <Button
                variant="primary"
                size="sm"
                isDisabled={draftName.trim().length === 0}
                onPress={() => {
                  rename(draftName);
                  setEditingName(false);
                }}
              >
                Save
              </Button>
            </div>
          ) : (
            <button
              type="button"
              className="flex items-center gap-2 text-left"
              onClick={() => {
                setDraftName(identity.username);
                setEditingName(true);
              }}
            >
              <Typography.Heading level={1} className="text-3xl font-semibold tracking-tight">
                {identity.username}
              </Typography.Heading>
              <span className="text-xs text-muted underline">edit</span>
            </button>
          )}
          {editingDevice ? (
            <div className="mt-1 flex items-center gap-2">
              <Input
                value={draftDevice}
                onChange={(event) => setDraftDevice(event.target.value)}
                placeholder="e.g. My phone"
                aria-label="Device label"
                maxLength={24}
                autoFocus
                fullWidth
              />
              <Button
                variant="primary"
                size="sm"
                onPress={() => {
                  renameDevice(draftDevice);
                  setEditingDevice(false);
                }}
              >
                Save
              </Button>
            </div>
          ) : (
            <button
              type="button"
              className="mt-1 flex items-center gap-2 text-left"
              onClick={() => {
                setDraftDevice(deviceLabel ?? '');
                setEditingDevice(true);
              }}
            >
              <p className="font-mono text-xs text-muted">
                device {deviceLabel ?? shortenId(identity.id, 8)}
              </p>
              <span className="text-xs text-muted underline">rename</span>
            </button>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <Button variant="primary" size="lg" fullWidth onPress={() => navigate('/create')}>
            Host a game
          </Button>
          <Button variant="secondary" size="lg" fullWidth onPress={() => navigate('/join')}>
            Join a game
          </Button>
          {resumable && (
            <Button
              variant="ghost"
              fullWidth
              onPress={() => {
                void resume().then((ok) => {
                  if (ok) navigate('/lobby');
                });
              }}
            >
              Rejoin my last game
            </Button>
          )}
        </div>

        <Card variant="secondary">
          <Card.Header>
            <Card.Title className="text-base">How the betting works</Card.Title>
            <Card.Description>
              The tiers are named after who should get them right, and the questions are written to
              that. None of them is general knowledge.
            </Card.Description>
          </Card.Header>
          <Card.Content className="flex flex-col gap-3 text-sm text-default-foreground">
            {DIFFICULTY_ORDER.map((difficulty) => (
              <Row key={difficulty} tier={difficulty} tierInfo={DIFFICULTY_TIERS[difficulty]} />
            ))}
            <p className="mt-1 text-xs text-muted">
              An opposing team deals you a choice of three categories; you choose how hard a question
              to take on it. Right, and you keep the turn. Wrong, and it costs you and moves on. First
              to {DEFAULT_RULES.targetScore} wins outright.
            </p>
          </Card.Content>
        </Card>
      </div>
    </Screen>
  );
}

function Row({
  tier,
  tierInfo,
}: {
  tier: 'low' | 'mid' | 'high';
  tierInfo: { label: string; award: number; penalty: number };
}): ReactNode {
  const colour = {
    low: 'text-tier-low',
    mid: 'text-tier-mid',
    high: 'text-tier-high',
  }[tier];
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className={colour}>{tierInfo.label}</span>
      <span className="font-mono text-sm tabular-nums">
        <span className="text-success">+{tierInfo.award}</span>
        <span className="text-muted"> / </span>
        <span className="text-danger-text">{tierInfo.penalty}</span>
      </span>
    </div>
  );
}

/**
 * Reads the saved-game marker without connecting. `resume()` itself joins a
 * mesh, which is not something a screen should do just to decide whether to
 * render a button.
 *
 * Deliberately does not also require a cached per-game event log: that cache
 * only gets written once a connection has actually backfilled real state,
 * which a joiner (unlike a host, whose own log is populated locally from the
 * moment they create the game) may never have reached if the connection
 * dropped early. `resume()` reconnects over the mesh regardless, so the
 * marker alone is enough to justify offering the button.
 */
async function resumeProbe(): Promise<boolean> {
  try {
    const raw = globalThis.localStorage?.getItem('kanbudong.lastGame.v1');
    if (raw == null) return false;
    const parsed = JSON.parse(raw) as { gameId?: string };
    return typeof parsed.gameId === 'string';
  } catch {
    return false;
  }
}
