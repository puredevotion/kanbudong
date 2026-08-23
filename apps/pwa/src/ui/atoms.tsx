import { DIFFICULTY_TIERS, shortenId, type Difficulty } from '@kanbudong/engine';
import type { ConnectionStatus } from '@kanbudong/net';
import { Chip, Typography } from '@heroui/react';
import { useEffect, useState, type ReactNode } from 'react';

/** Page frame. Every screen is a single column that fits a phone in one hand. */
export function Screen({
  title,
  subtitle,
  children,
  aside,
}: {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  aside?: ReactNode;
}): ReactNode {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-5 px-5 pb-44 pt-[max(1.25rem,env(safe-area-inset-top))]">
      {(title !== undefined || aside !== undefined) && (
        <header className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            {title !== undefined && (
              <Typography.Heading level={1} className="text-2xl font-semibold tracking-tight">
                {title}
              </Typography.Heading>
            )}
            {subtitle !== undefined && (
              <Typography.Paragraph className="mt-1 text-sm text-muted">
                {subtitle}
              </Typography.Paragraph>
            )}
          </div>
          {aside}
        </header>
      )}
      {children}
    </main>
  );
}

/** Sticky bottom bar, because the primary action must be reachable by a thumb. */
export function ActionBar({ children }: { children: ReactNode }): ReactNode {
  return (
    <div className="fixed inset-x-0 bottom-0 z-10 border-t border-default-200/40 bg-default-50/80 px-5 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur">
      <div className="mx-auto flex w-full max-w-md flex-col gap-2">{children}</div>
    </div>
  );
}

export function ConnectionPill({
  status,
  peerCount,
  everConnected = false,
}: {
  status: ConnectionStatus;
  peerCount: number;
  /** Distinguishes "still waiting for the first peer" from "someone just dropped." */
  everConnected?: boolean;
}): ReactNode {
  const { colour, label } = describe(status, peerCount, everConnected);
  return (
    <Chip color={colour} variant="soft" size="sm" className="shrink-0">
      {label}
    </Chip>
  );
}

function describe(
  status: ConnectionStatus,
  peerCount: number,
  everConnected: boolean,
): { colour: 'success' | 'warning' | 'danger' | 'default'; label: string } {
  switch (status) {
    case 'connected':
      return { colour: 'success', label: `${peerCount} device${peerCount === 1 ? '' : 's'}` };
    case 'connecting':
      return { colour: 'warning', label: everConnected ? 'Reconnecting' : 'Connecting' };
    case 'alone':
      // Same underlying status either way, but a very different thing to
      // tell a player: a host who has never had a joiner is just waiting;
      // someone who *had* a peer and lost them needs to know that dropped,
      // not that nobody ever showed up.
      return { colour: 'warning', label: everConnected ? 'Reconnecting' : 'Waiting for others' };
    case 'failed':
      // Said plainly rather than spun forever: with no server there is no relay
      // of last resort, and some networks simply will not carry this (R-15).
      return { colour: 'danger', label: 'No connection' };
    default:
      return { colour: 'default', label: status };
  }
}

const TIER_CLASS: Record<Difficulty, string> = {
  low: 'border-tier-low/60 text-tier-low',
  mid: 'border-tier-mid/60 text-tier-mid',
  high: 'border-tier-high/60 text-tier-high',
};

/** The bet, stated as a bet: what you win, what it costs. */
export function TierBadge({ difficulty }: { difficulty: Difficulty }): ReactNode {
  const tier = DIFFICULTY_TIERS[difficulty];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${TIER_CLASS[difficulty]}`}
    >
      {tier.label}
      <span className="tabular-nums opacity-80">
        +{tier.award} / {tier.penalty}
      </span>
    </span>
  );
}

/** A player id, shortened. Present but never prominent (R-17). */
export function PlayerTag({ id, username }: { id: string; username: string }): ReactNode {
  return (
    <span className="inline-flex items-baseline gap-1.5">
      <span className="truncate font-medium">{username}</span>
      <span className="font-mono text-[0.65rem] text-muted">{shortenId(id)}</span>
    </span>
  );
}

export function Notice({
  tone = 'info',
  children,
}: {
  tone?: 'info' | 'warn' | 'danger';
  children: ReactNode;
}): ReactNode {
  const classes = {
    info: 'border-default-300/50 bg-default-100/50 text-default-foreground',
    warn: 'border-warning/40 bg-warning/10 text-warning',
    danger: 'border-danger/40 bg-danger/10 text-danger-text',
  }[tone];
  // A notice that appears after the fact (a refused join, a stalled lobby)
  // is silent to a screen reader unless something marks it as a status
  // message (WCAG 4.1.3) - danger is assertive because it interrupts what
  // the player was doing, the rest can wait for a pause in speech.
  return (
    <div
      role={tone === 'danger' ? 'alert' : 'status'}
      aria-live={tone === 'danger' ? 'assertive' : 'polite'}
      className={`rounded-xl border px-4 py-3 text-sm ${classes}`}
    >
      {children}
    </div>
  );
}

/**
 * "Connecting" that never resolves is the failure the review insisted must not
 * happen silently (R-15): with no server there is no relay of last resort, and
 * some networks - carrier NAT especially - simply will not carry a direct peer
 * connection. After a while of nobody arriving, say so and say what to do.
 */
export function StalledWarning({
  status,
  peerCount,
  everConnected = false,
  afterMs = 120_000,
}: {
  status: ConnectionStatus;
  peerCount: number;
  everConnected?: boolean;
  afterMs?: number;
}): ReactNode {
  const stalled = useElapsed(afterMs) && peerCount === 0 && status !== 'failed';

  if (status === 'failed') {
    return (
      <Notice tone="danger">
        Could not reach any peer-discovery relay. Check this device is online. Dohhh needs one
        brief handshake through public infrastructure before it can talk device-to-device.
      </Notice>
    );
  }
  if (!stalled) return null;
  if (everConnected) {
    return (
      <Notice tone="warn">
        Lost the connection to the other device. Still trying to reconnect automatically - if this
        does not clear up, check you are both still online and on the same network.
      </Notice>
    );
  }
  return (
    <Notice tone="warn">
      Still nobody else here. The usual causes: the others have not opened the game yet, they typed a
      different code, or you are on networks that will not let devices talk directly - mobile data
      especially. Getting everyone onto the same Wi-Fi fixes it.
    </Notice>
  );
}

/** True once `ms` has passed since this hook first mounted with this duration. */
export function useElapsed(ms: number): boolean {
  const [passed, setPassed] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setPassed(true), ms);
    return () => clearTimeout(id);
  }, [ms]);
  return passed;
}
