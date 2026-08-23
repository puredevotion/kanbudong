import { joinRoom, selfId } from 'trystero/nostr';
import type { Room } from 'trystero/nostr';

/**
 * The honest version of "no central server".
 *
 * WebRTC cannot introduce two strangers without something in the middle. What
 * this design actually promises is: no server *we* run, no account, and no game
 * state anywhere except on the players' devices. Peer discovery rides public
 * Nostr relays, used only to swap ICE candidates; once the mesh is up, every
 * byte of game traffic is a direct peer connection.
 *
 * The limits of that, stated rather than buried (R-15, R-19):
 *  - STUN-only would leave symmetric NAT and most carrier networks unable to
 *    connect at all, so a TURN relay is configured below as a fallback path
 *    for exactly that case - the in-the-room, shared-Wi-Fi case still
 *    connects directly and never touches it.
 *  - The mesh is O(n^2). Tested to 8 devices. Above ~10 the lobby warns.
 */

export const APP_ID = 'dohhh-mesh-v1';

/**
 * Fallback relay for when direct P2P can't be established - symmetric NAT,
 * most cellular carriers, or players split across different networks
 * entirely (one on Wi-Fi, one on 5G). WebRTC only uses this path when direct
 * and STUN-assisted connection attempts fail, so it costs nothing on a
 * shared network. Two independent free-tier providers, so a browser tries
 * both rather than depending on either one's uptime alone - neither pair is
 * a secret, since a browser-only app has nowhere to keep one and this ships
 * in the client bundle either way.
 *
 * Firefox warns - and measurably slows ICE gathering - once a config holds
 * five or more urls in total. Trystero's own peer.mjs unconditionally
 * prepends four default public STUN servers to whatever `turnConfig` holds
 * (`defaultIceServers.concat(turnConfig ?? [])`), so passing TURN servers via
 * `turnConfig` guarantees crossing that threshold the moment there's even one
 * TURN url - reducing this list's own url count never touched the real
 * cause. Passing a complete `iceServers` list via `rtcConfig` instead avoids
 * that merge entirely (object spread means `rtcConfig` wins), trading the
 * four defaults for one STUN entry plus one url per TURN provider - a UDP
 * primary from one, a TCP/TLS fallback from the other, so restrictive
 * networks that block one transport still have a path through the other.
 */
const ICE_SERVERS: { urls: string; username?: string; credential?: string }[] = [
  { urls: 'stun:stun.cloudflare.com:3478' },
  { urls: 'turn:free.expressturn.com:3478', username: '000000002102686914', credential: '3IKoQJiNR4nqwoGkzwjscX68lC4=' },
  {
    urls: 'turns:global.relay.metered.ca:443?transport=tcp',
    username: '5c0e0a6595f967157b857768',
    credential: 'ssGPvnFuhAjmbsED',
  },
];

/**
 * Trystero derives a "random" 5-relay subset from APP_ID, but that derivation
 * is deterministic - every game this app ever hosts gets the exact same five
 * relays. One of the ones it picked, relay.angor.io, serves a broken
 * self-signed certificate (verified independently of this app), so it's
 * permanently dead weight in that subset. Pin a known-good set explicitly
 * rather than gambling on whatever the hash lands on.
 */
const RELAY_URLS = [
  'wss://relay.damus.io',
  'wss://nos.lol',
  'wss://purplerelay.com',
  'wss://relay02.lnfi.network',
];

export type ConnectionStatus = 'connecting' | 'connected' | 'alone' | 'failed';

/** Prefix on a 'failed' status detail meaning "config-level, never worth retrying." */
export const CONFIG_ERROR_PREFIX = 'config-error: ';

export interface TransportEvents {
  readonly onMessage: (payload: string, fromPeerId: string) => void;
  readonly onPeerJoin: (peerId: string) => void;
  readonly onPeerLeave: (peerId: string) => void;
  readonly onStatus: (status: ConnectionStatus, detail?: string) => void;
}

export interface Transport {
  readonly selfPeerId: string;
  peerIds(): string[];
  /** Broadcast, or send to one peer when `target` is given. */
  send(payload: string, target?: string): void;
  /**
   * Resolves once trystero has actually torn the room down (it sends a
   * leave message and waits ~100ms before evicting its own room-id cache
   * entry). A caller that wants to immediately rejoin the same roomId - as
   * the reconnect logic in GameSession does - must await this first: firing
   * `joinRoom` again before this resolves hands back the exact same cached
   * Room object instead of a fresh one, silently turning "reconnect" into a
   * no-op.
   */
  leave(): Promise<void>;
}

export interface TransportOptions {
  /** Derived from the join code, never the code itself (R-8). */
  readonly roomId: string;
  /**
   * Encrypts the datachannel payloads. The join code is the shared secret the
   * players already exchanged, so it costs nothing to use it.
   */
  readonly password?: string;
  readonly handlers: TransportEvents;
}

/**
 * Join the mesh for one game. Synchronous by design: trystero connects in the
 * background and the caller renders "connecting" until a peer shows up.
 */
export function createTransport(options: TransportOptions): Transport {
  const { handlers } = options;
  let room: Room;
  try {
    room = joinRoom(
      {
        appId: APP_ID,
        relayConfig: { urls: RELAY_URLS },
        rtcConfig: { iceServers: ICE_SERVERS },
        ...(options.password === undefined ? {} : { password: options.password }),
      },
      options.roomId,
      {
        onJoinError: (details) => handlers.onStatus('failed', details.error),
      },
    );
  } catch (error) {
    // Unlike onJoinError below (a relay/handshake-level failure, plausibly
    // transient), joinRoom throwing synchronously means the config itself is
    // bad - the same input fails every time. The CONFIG_ERROR_PREFIX marker
    // lets a caller (GameSession's reconnect logic) recognize this and stop
    // retrying instead of hammering a call that can never succeed.
    const message = error instanceof Error ? error.message : String(error);
    handlers.onStatus('failed', `${CONFIG_ERROR_PREFIX}${message}`);
    return offlineTransport(handlers);
  }

  // Payloads are JSON strings rather than structured objects: one encoding
  // decision, in one place, and message size stays something we can reason
  // about when a datachannel starts complaining.
  const action = room.makeAction<string>('dh', {
    onMessage: (data, context) => handlers.onMessage(data, context.peerId),
  });

  room.onPeerJoin = (peerId) => {
    handlers.onPeerJoin(peerId);
    handlers.onStatus('connected');
  };
  room.onPeerLeave = (peerId) => {
    handlers.onPeerLeave(peerId);
    handlers.onStatus(Object.keys(room.getPeers()).length > 0 ? 'connected' : 'alone');
  };

  handlers.onStatus('connecting');

  return {
    selfPeerId: selfId,
    peerIds: () => Object.keys(room.getPeers()),
    send: (payload, target) => {
      // Fire and forget: a failed send is recovered by the next vector
      // exchange, so there is nothing useful to do with the rejection here.
      void action.send(payload, target === undefined ? undefined : { target }).catch(() => {
        /* the sync loop retries */
      });
    },
    leave: () => room.leave(),
  };
}

/** Stand-in used when the relay cannot be reached, so callers need no null checks. */
function offlineTransport(handlers: TransportEvents): Transport {
  return {
    selfPeerId: selfId,
    peerIds: () => [],
    send: () => {
      handlers.onStatus('failed', 'not connected');
    },
    leave: () => Promise.resolve(),
  };
}
