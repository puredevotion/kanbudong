import { roomIdFromJoinCode, type GameId } from '@kanbudong/engine';

import { createTransport } from './transport.js';

/**
 * Find the game living behind a join code.
 *
 * The QR path carries the game id in the ticket, but somebody typing four words
 * across a table does not have it - and cannot, because a game id is derived
 * from the host's key. So we join the room and listen: any peer already there
 * greets a newcomer with its version vector, which names the game.
 *
 * This is the only place in the codebase that waits on the network with a
 * timeout, and it is the reason the join screen can say "no game with that
 * code" instead of spinning forever (R-15).
 */
export interface Discovery {
  readonly gameId: GameId;
  readonly protocol: number;
  readonly packHash: string;
}

export interface DiscoverOptions {
  readonly joinCode: string;
  readonly timeoutMs?: number;
  readonly makeTransport?: typeof createTransport;
}

export function discoverGame(options: DiscoverOptions): Promise<Discovery | null> {
  // 5 minutes: generous on purpose. A wrong code fails fast via the 'failed'
  // status below (an unreachable relay), so this ceiling only matters for a
  // *correct* code where the host device just hasn't opened the game yet -
  // someone still setting up, or fetching their phone from another room. The
  // UI's own "still nobody here" messaging (StalledWarning) kicks in well
  // before this at 2 minutes; this is the hard stop behind it, not the thing
  // a player is expected to wait out.
  const timeoutMs = options.timeoutMs ?? 300_000;
  const make = options.makeTransport ?? createTransport;

  return new Promise<Discovery | null>((resolve) => {
    let settled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const finish = (result: Discovery | null): void => {
      if (settled) return;
      settled = true;
      if (timer !== null) clearTimeout(timer);
      transport.leave();
      resolve(result);
    };

    const transport = make({
      roomId: roomIdFromJoinCode(options.joinCode),
      password: options.joinCode,
      handlers: {
        onMessage: (payload) => {
          const discovery = discoveryFrom(payload);
          if (discovery !== null) finish(discovery);
        },
        onPeerJoin: () => undefined,
        onPeerLeave: () => undefined,
        onStatus: (status) => {
          // A relay we cannot reach at all is worth failing fast on, rather
          // than making the player wait out the whole timeout.
          if (status === 'failed') finish(null);
        },
      },
    });

    timer = setTimeout(() => finish(null), timeoutMs);
  });
}

function discoveryFrom(payload: string): Discovery | null {
  try {
    const parsed = JSON.parse(payload) as {
      t?: unknown;
      gameId?: unknown;
      protocol?: unknown;
      packHash?: unknown;
      vector?: unknown;
      digest?: unknown;
    };
    // `want`/`events` gossip also carries a bare `gameId` (session.ts's
    // SyncMessage union), and a live game gossips constantly compared to how
    // rarely it broadcasts `have` - without this, a joiner's probe could
    // catch one of those first, default protocol/packHash to "unknown", and
    // reject a perfectly compatible game as a version mismatch. Requiring
    // the shape only `have` actually has (a vector and a digest) rules that
    // out structurally rather than relying on timing luck.
    if (parsed?.t !== 'have') return null;
    if (typeof parsed.gameId !== 'string' || !parsed.gameId.startsWith('game_')) return null;
    if (typeof parsed.vector !== 'object' || parsed.vector === null) return null;
    if (typeof parsed.digest !== 'string') return null;
    // Older builds never sent these fields; treat that as "unknown version"
    // rather than crashing the discovery so the caller can still surface a
    // readable refusal.
    const protocol = typeof parsed.protocol === 'number' ? parsed.protocol : 0;
    const packHash = typeof parsed.packHash === 'string' ? parsed.packHash : '';
    return { gameId: parsed.gameId, protocol, packHash };
  } catch {
    return null;
  }
}
