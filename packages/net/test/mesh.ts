import type { Transport, TransportEvents, TransportOptions } from '../src/transport.js';

/**
 * An in-process mesh, so the sync protocol can be tested without a relay.
 *
 * Deliveries are queued rather than immediate and drained explicitly, which is
 * what makes it possible to test the thing that actually goes wrong in the
 * field: messages arriving late, out of order, or after a peer has already
 * moved on.
 */
export class FakeMesh {
  private readonly nodes = new Map<string, TransportEvents>();
  private readonly rooms = new Map<string, Set<string>>();
  private queue: { readonly to: string; readonly from: string; readonly payload: string }[] = [];
  private nextId = 0;

  /** Drop-in replacement for `createTransport`. */
  transportFactory = (options: TransportOptions): Transport => {
    const peerId = `peer-${this.nextId++}`;
    const roomId = options.roomId;
    this.nodes.set(peerId, options.handlers);
    const room = this.rooms.get(roomId) ?? new Set<string>();
    this.rooms.set(roomId, room);

    // Tell the newcomer about everyone, and everyone about the newcomer, the
    // same way a relay would - and mirror transport.ts's real
    // onPeerJoin/onPeerLeave handlers by re-deriving 'connected'/'alone'
    // from room size on every change, not just once at creation. Without
    // this, a session's `status` here would never reflect peers arriving
    // or leaving after its own construction, which is not how the real
    // transport behaves.
    // The newcomer joins the room *before* anyone is notified, so that a
    // handler calling back into `peerIds()` from inside `onPeerJoin` (as
    // GameSession's reconnect logic does) sees the newcomer already
    // counted - matching real WebRTC peer bookkeeping, where a connection
    // is established before the join callback fires, not after.
    const existingPeers = [...room];
    room.add(peerId);
    for (const existing of existingPeers) {
      this.nodes.get(existing)?.onPeerJoin(peerId);
      this.nodes.get(existing)?.onStatus('connected');
      options.handlers.onPeerJoin(existing);
    }
    options.handlers.onStatus(room.size > 1 ? 'connected' : 'alone');

    return {
      selfPeerId: peerId,
      peerIds: () => [...room].filter((id) => id !== peerId),
      send: (payload, target) => {
        const targets = target === undefined ? [...room].filter((id) => id !== peerId) : [target];
        for (const to of targets) this.queue.push({ to, from: peerId, payload });
      },
      leave: async () => {
        room.delete(peerId);
        this.nodes.delete(peerId);
        for (const other of room) {
          this.nodes.get(other)?.onPeerLeave(peerId);
          this.nodes.get(other)?.onStatus(room.size > 0 ? 'connected' : 'alone');
        }
      },
    };
  };

  /** Deliver everything currently queued, repeatedly, until the mesh is quiet. */
  settle(maxRounds = 50): number {
    let rounds = 0;
    while (this.queue.length > 0 && rounds < maxRounds) {
      const batch = this.queue;
      this.queue = [];
      for (const message of batch) {
        this.nodes.get(message.to)?.onMessage(message.payload, message.from);
      }
      rounds += 1;
    }
    return rounds;
  }

  /** Throw away everything in flight, simulating a partition. */
  drop(): number {
    const dropped = this.queue.length;
    this.queue = [];
    return dropped;
  }

  get inFlight(): number {
    return this.queue.length;
  }
}
