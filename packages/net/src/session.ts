import {
  EventLog,
  packHash,
  PROTOCOL_VERSION,
  reduce,
  roomIdFromJoinCode,
  type ContentPack,
  type GameId,
  type GameState,
  type Identity,
  type InsertResult,
  type SignedEvent,
  type VersionVector,
} from '@kanbudong/engine';

import type { ConnectionStatus, Transport } from './transport.js';
import { CONFIG_ERROR_PREFIX, createTransport } from './transport.js';

/**
 * The sync protocol, in four messages.
 *
 * There is no authority, so the protocol is anti-entropy rather than
 * replication: peers tell each other what they have, ask for what they lack,
 * and gossip what is new. A message that arrives late, twice or out of order
 * costs nothing, because the log sorts and the reducer is pure.
 */
export type SyncMessage =
  /**
   * "Here is everything I have." Sent on join and on a timer. Also doubles as
   * the version handshake: protocol and packHash ride along so a stale peer
   * is a readable refusal at the door (R-11) rather than a desync mid-game -
   * this is the only message a newcomer sees before deciding whether to stay.
   */
  | {
      readonly t: 'have';
      readonly gameId: GameId;
      readonly vector: VersionVector;
      readonly digest: string;
      readonly protocol: number;
      readonly packHash: string;
    }
  /** "Send me what I am missing." */
  | { readonly t: 'want'; readonly gameId: GameId; readonly vector: VersionVector }
  /** New or backfilled events. */
  | { readonly t: 'events'; readonly gameId: GameId; readonly events: readonly SignedEvent[] };

export interface SessionSnapshot {
  readonly state: GameState | null;
  readonly status: ConnectionStatus;
  readonly peerCount: number;
  /** True when a peer reported a log digest we cannot reconcile. */
  readonly diverged: boolean;
  /** True when a peer in the room is speaking a different protocol version or pack. */
  readonly peerVersionMismatch: boolean;
  /**
   * True once any peer has ever joined this session. Distinguishes "alone,
   * still waiting for the first joiner" (the ordinary pre-game state) from
   * "alone, because someone who was here just dropped" - the two look
   * identical from `status` alone, but a UI has every reason to say
   * something different for each.
   */
  readonly everConnected: boolean;
  readonly logSize: number;
}

export type SessionListener = (snapshot: SessionSnapshot) => void;

export interface SessionOptions {
  readonly identity: Identity;
  readonly pack: ContentPack;
  readonly gameId: GameId;
  readonly joinCode: string;
  /** Existing events, e.g. restored from local storage or created by the host. */
  readonly seed?: readonly SignedEvent[];
  /** Milliseconds between unsolicited "have" broadcasts. */
  readonly gossipIntervalMs?: number;
  /** Swappable so tests can run without a network. */
  readonly makeTransport?: typeof createTransport;
}

/** Batch size for backfill, so one peer joining late cannot blow a datachannel. */
const BACKFILL_CHUNK = 40;
/**
 * A hard ceiling on one message's JSON size, on top of the count-based
 * BACKFILL_CHUNK above. Count alone assumes every event is small, which is
 * true for today's event bodies but not guaranteed forever, and practical
 * WebRTC data-channel message-size limits vary by browser (historically as
 * low as the tens of kilobytes on older engines). Splitting further when a
 * chunk actually is large costs nothing when it isn't.
 */
const BACKFILL_MAX_BYTES = 48_000;

/**
 * One game, one mesh, one log.
 *
 * The session owns nothing about presentation and makes no rule decisions: it
 * moves events between peers and hands the reduced state to a listener. Every
 * rule lives in the engine, which is why the same class serves the PWA and the
 * React Native shell.
 */
export class GameSession {
  readonly log: EventLog;
  /**
   * Null only for the instant during construction before the factory returns.
   * The transport reports its status synchronously as it connects, so a handler
   * can fire before this field is assigned - which it does, on every start.
   */
  private transport: Transport | null = null;
  private readonly listeners = new Set<SessionListener>();
  private readonly pack: ContentPack;
  private readonly packHash: string;
  private readonly identity: Identity;
  private status: ConnectionStatus = 'connecting';
  private diverged = false;
  private peerVersionMismatch = false;
  private timer: ReturnType<typeof setInterval> | null = null;
  private cachedState: GameState | null = null;
  private cachedAt = -1;
  private readonly makeTransport: typeof createTransport;
  private readonly roomId: string;
  private readonly joinCode: string;
  private hadPeer = false;
  /**
   * The most peers this session has ever had connected at once. Status alone
   * ('connected'/'alone') is peer-count-blind above zero: in a 3-peer mesh,
   * losing one of three peers still reports 'connected' (peerIds().length
   * is 1, still > 0), so a status-only reconnect trigger never fires for a
   * partial drop - it takes losing *every* peer to be noticed at all. This
   * tracks "how many peers we should have" so a partial drop is detected
   * directly instead of waiting for a full one.
   */
  private peakPeerCount = 0;
  private leaving = false;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private reconnectAttempt = 0;

  constructor(options: SessionOptions) {
    this.identity = options.identity;
    this.pack = options.pack;
    this.packHash = packHash(options.pack);
    this.log = new EventLog(options.gameId, options.seed ?? []);
    this.makeTransport = options.makeTransport ?? createTransport;
    this.roomId = roomIdFromJoinCode(options.joinCode);
    this.joinCode = options.joinCode;

    this.transport = this.openTransport();

    const interval = options.gossipIntervalMs ?? 5_000;
    if (interval > 0) {
      this.timer = setInterval(() => this.post(this.have()), interval);
    }
  }

  private openTransport(): Transport {
    return this.makeTransport({
      roomId: this.roomId,
      // The join code is already a shared secret between the players, so using
      // it as the channel password is free confidentiality.
      password: this.joinCode,
      handlers: {
        onMessage: (payload) => this.receive(decodeMessage(payload)),
        onPeerJoin: (peerId) => {
          this.hadPeer = true;
          const current = this.transport?.peerIds().length ?? 0;
          this.peakPeerCount = Math.max(this.peakPeerCount, current);
          // Only stand the backoff down once the mesh is actually back to
          // its best-known size - a join that leaves it still short (one of
          // two peers reconnecting in a 3-peer mesh) should not reset the
          // clock on the peer that's still missing.
          if (current >= this.peakPeerCount) this.cancelReconnect();
          // Introduce ourselves immediately: the newcomer needs the backlog and
          // we may need theirs.
          this.post(this.have(), peerId);
          this.emit();
        },
        onPeerLeave: () => {
          this.emit();
          const current = this.transport?.peerIds().length ?? 0;
          // The status callback below only fires 'alone' once every peer is
          // gone - a mesh that shrinks from three peers to two is still
          // 'connected' by that measure, so a partial drop needs its own
          // trigger rather than waiting on status to notice.
          if (current < this.peakPeerCount) this.scheduleReconnect();
        },
        onStatus: (status, detail) => {
          this.status = status;
          this.emit();
          // A config-level failure (bad appId/roomId) throws the same way on
          // every attempt - retrying it is pure waste, never a fix.
          if (status === 'failed' && detail?.startsWith(CONFIG_ERROR_PREFIX) === true) return;
          // 'alone' is the ordinary state while a host waits for the first
          // joiner - only a drop *after* we've had a live peer, or a hard
          // signaling failure, is worth fighting. Trystero itself does not
          // retry a dead peer connection or a lost relay session on its own
          // (see https://github.com/dmotz/trystero/issues/29), so without
          // this a "bleeped out" mid-game connection just sits dead until a
          // human notices and manually rejoins.
          if (status === 'failed' || (status === 'alone' && this.hadPeer)) {
            this.scheduleReconnect();
          }
        },
      },
    });
  }

  private cancelReconnect(): void {
    if (this.reconnectTimer !== null) clearTimeout(this.reconnectTimer);
    this.reconnectTimer = null;
    this.reconnectAttempt = 0;
  }

  private scheduleReconnect(): void {
    if (this.leaving || this.reconnectTimer !== null) return;
    // Capped exponential backoff: fast enough to catch a brief blip, slow
    // enough not to hammer a genuinely dead relay or TURN server.
    const delayMs = Math.min(30_000, 1_000 * 2 ** this.reconnectAttempt);
    this.reconnectAttempt += 1;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      if (this.leaving) return;
      // trystero caches one Room per (appId, roomId) and only evicts it once
      // its own leave() resolves (a leave message round-trip plus a fixed
      // ~100ms grace wait). Calling joinRoom again before that lands hands
      // back the exact same cached Room object rather than a fresh one -
      // silently turning this into a no-op that never actually
      // renegotiates anything. Awaiting first is what makes this a real
      // reconnect rather than a relabeled do-nothing.
      const dying = this.transport;
      this.transport = null;
      void (dying?.leave() ?? Promise.resolve()).finally(() => {
        if (this.leaving) return;
        this.transport = this.openTransport();
      });
    }, delayMs);
  }

  subscribe(listener: SessionListener): () => void {
    this.listeners.add(listener);
    listener(this.snapshot());
    return () => this.listeners.delete(listener);
  }

  get state(): GameState | null {
    if (this.cachedAt !== this.log.size) {
      this.cachedState = reduce(this.log.events, { pack: this.pack });
      this.cachedAt = this.log.size;
    }
    return this.cachedState;
  }

  snapshot(): SessionSnapshot {
    return {
      state: this.state,
      status: this.status,
      peerCount: this.transport?.peerIds().length ?? 0,
      diverged: this.diverged,
      peerVersionMismatch: this.peerVersionMismatch,
      everConnected: this.hadPeer,
      logSize: this.log.size,
    };
  }

  /**
   * Apply a locally produced event and tell everyone. Returns the log's own
   * {@link InsertResult} rather than a bare boolean - a rejection here means
   * a bug on this device rather than a hostile peer, and a caller that wants
   * to tell a player *why* their tap didn't do anything needs the reason,
   * not just a yes/no.
   */
  commit(event: SignedEvent): InsertResult {
    const result = this.log.insert(event);
    if (!result.accepted) return result;
    this.post({ t: 'events', gameId: this.log.gameId, events: [event] });
    this.emit();
    return result;
  }

  /** Everything this peer holds, for anti-entropy. */
  private have(): SyncMessage {
    return {
      t: 'have',
      gameId: this.log.gameId,
      vector: this.log.vector,
      digest: this.log.digest(),
      protocol: PROTOCOL_VERSION,
      packHash: this.packHash,
    };
  }

  private post(message: SyncMessage, target?: string): void {
    this.transport?.send(JSON.stringify(message), target);
  }

  private receive(message: SyncMessage | null): void {
    // A peer in the same relay room but a different game is not an error worth
    // surfacing; it just is not ours. Neither is unparseable traffic: the room
    // id is public, so anything at all can turn up on the channel.
    if (message === null || message.gameId !== this.log.gameId) return;

    switch (message.t) {
      case 'have': {
        // A version-skewed peer (reconnecting after a mid-session deploy, or
        // just a bug) got past the join-time ticket check by definition -
        // that check only runs once, before the mesh forms. Exchanging
        // events with one anyway would surface only as a later, unexplained
        // digest mismatch; refusing to sync with it here instead makes the
        // cause visible immediately.
        if (message.protocol !== PROTOCOL_VERSION || message.packHash !== this.packHash) {
          this.peerVersionMismatch = true;
          this.emit();
          return;
        }
        const missingForThem = this.log.eventsMissingFrom(message.vector);
        if (missingForThem.length > 0) this.sendEvents(missingForThem);
        const weMayBeBehind = this.isBehind(message.vector);
        if (weMayBeBehind) {
          this.post({ t: 'want', gameId: this.log.gameId, vector: this.log.vector });
        }
        // Same vector but a different digest means genuine divergence, which no
        // amount of backfill fixes. Surface it rather than playing on.
        this.diverged = !weMayBeBehind && missingForThem.length === 0 && message.digest !== this.log.digest();
        this.emit();
        return;
      }
      case 'want': {
        const missing = this.log.eventsMissingFrom(message.vector);
        if (missing.length > 0) this.sendEvents(missing);
        return;
      }
      case 'events': {
        if (!Array.isArray(message.events)) return;
        const { accepted } = this.log.insertMany(message.events);
        if (accepted > 0) {
          this.diverged = false;
          this.emit();
        }
        // Receiving seq 5 while seq 3 is still missing means an earlier
        // broadcast was lost. Ask now rather than waiting for the next gossip
        // tick: the reducer is working from an incomplete story until it lands.
        if (this.log.hasGaps) {
          this.post({ t: 'want', gameId: this.log.gameId, vector: this.log.vector });
        }
        return;
      }
      default:
        return;
    }
  }

  private sendEvents(events: readonly SignedEvent[]): void {
    for (let i = 0; i < events.length; i += BACKFILL_CHUNK) {
      for (const batch of splitByByteSize(events.slice(i, i + BACKFILL_CHUNK), BACKFILL_MAX_BYTES)) {
        this.post({ t: 'events', gameId: this.log.gameId, events: batch });
      }
    }
  }

  private isBehind(theirs: VersionVector): boolean {
    const mine = this.log.vector;
    for (const [author, seq] of Object.entries(theirs)) {
      if ((mine[author] ?? 0) < seq) return true;
    }
    return false;
  }

  private emit(): void {
    const snapshot = this.snapshot();
    for (const listener of this.listeners) listener(snapshot);
  }

  get selfId(): string {
    return this.identity.id;
  }

  leave(): void {
    this.leaving = true;
    this.cancelReconnect();
    if (this.timer !== null) clearInterval(this.timer);
    this.timer = null;
    void this.transport?.leave();
    this.listeners.clear();
  }
}

/** Regroups `events` into batches whose JSON size stays under `maxBytes`, splitting single oversized events into their own batch rather than dropping them. */
function splitByByteSize(events: readonly SignedEvent[], maxBytes: number): SignedEvent[][] {
  const batches: SignedEvent[][] = [];
  let current: SignedEvent[] = [];
  let currentSize = 2; // '[' + ']'
  for (const event of events) {
    const size = JSON.stringify(event).length + 1; // +1 for the joining comma
    if (current.length > 0 && currentSize + size > maxBytes) {
      batches.push(current);
      current = [];
      currentSize = 2;
    }
    current.push(event);
    currentSize += size;
  }
  if (current.length > 0) batches.push(current);
  return batches;
}

function decodeMessage(payload: string): SyncMessage | null {
  try {
    const parsed = JSON.parse(payload) as Partial<SyncMessage>;
    if (typeof parsed !== 'object' || parsed === null) return null;
    if (parsed.t !== 'have' && parsed.t !== 'want' && parsed.t !== 'events') return null;
    if (typeof parsed.gameId !== 'string') return null;
    return parsed as SyncMessage;
  } catch {
    return null;
  }
}
