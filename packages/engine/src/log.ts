import { sha256Hex } from './canonical.js';
import type { SignedEvent } from './events.js';
import { checkEvent, compareEvents } from './events.js';
import type { GameId, PlayerId } from './types.js';

/**
 * Highest *contiguous* sequence number seen per author.
 *
 * Contiguous, not maximum, and the distinction is the whole protocol: if a
 * broadcast is lost and a later one from the same author arrives, tracking the
 * maximum would advertise seq 2 while seq 1 is still missing, and no peer would
 * ever send it. The gap has to stop the counter or anti-entropy never converges.
 */
export type VersionVector = Readonly<Record<PlayerId, number>>;

export interface InsertResult {
  readonly accepted: boolean;
  /** Why it was refused; `duplicate` is the common, boring case. */
  readonly reason?:
    | 'duplicate'
    | 'malformed'
    | 'wrong-protocol'
    | 'wrong-game'
    | 'bad-id'
    | 'impersonation'
    | 'bad-signature'
    | 'log-full';
}

/**
 * Far above anything a real game produces (a few hundred turns is a long
 * session; each turn is at most a handful of events), and there is no
 * server to rate-limit a hostile peer flooding the room with crypto-valid
 * garbage - every accepted event is permanent, gossiped to every peer, and
 * re-folded on every read. This ceiling is the one piece of client-side
 * self-defense available in a design with no central authority: past it, a
 * flood costs the flooder nothing further to send, but stops costing every
 * other device anything further to store or process.
 */
export const MAX_LOG_EVENTS = 20_000;

/**
 * An append-only, totally-ordered, self-verifying event log.
 *
 * This is the only durable thing in the system: there is no server, so a game
 * *is* the set of logs held by the devices playing it. Two peers holding the
 * same events produce byte-identical state, whatever order the events arrived
 * in, which is what makes {@link reduce} able to be a pure function.
 */
export class EventLog {
  private readonly byId = new Map<string, SignedEvent>();
  private ordered: SignedEvent[] = [];
  private readonly authors = new Map<PlayerId, AuthorState>();
  private maxLamport = 0;

  constructor(readonly gameId: GameId, events: readonly SignedEvent[] = []) {
    for (const event of events) this.insert(event);
  }

  /** Verifies, de-duplicates and inserts in order. Never throws on bad input. */
  insert(event: SignedEvent): InsertResult {
    if (this.byId.has(event.id)) return { accepted: false, reason: 'duplicate' };
    if (this.ordered.length >= MAX_LOG_EVENTS) return { accepted: false, reason: 'log-full' };
    const rejection = checkEvent(event, this.gameId);
    if (rejection !== null) return { accepted: false, reason: rejection };

    this.byId.set(event.id, event);
    insertSorted(this.ordered, event);
    this.recordSeq(event.author, event.seq);
    if (event.lamport > this.maxLamport) this.maxLamport = event.lamport;
    return { accepted: true };
  }

  insertMany(events: readonly SignedEvent[]): { accepted: number; rejected: number } {
    let accepted = 0;
    let rejected = 0;
    for (const event of events) {
      if (this.insert(event).accepted) accepted += 1;
      else rejected += 1;
    }
    return { accepted, rejected };
  }

  has(id: string): boolean {
    return this.byId.has(id);
  }

  get size(): number {
    return this.ordered.length;
  }

  /** Events in total order. Safe to hand to the reducer directly. */
  get events(): readonly SignedEvent[] {
    return this.ordered;
  }

  /** What this peer has, expressed compactly enough to gossip constantly. */
  get vector(): VersionVector {
    const out: Record<PlayerId, number> = {};
    for (const [author, state] of this.authors) out[author] = state.contiguous;
    return out;
  }

  /**
   * Sequence number this device should stamp on its next event. Based on the
   * maximum rather than the contiguous mark, so a gap in our own history (only
   * possible after a partial restore) cannot make us reuse a number.
   */
  nextSeq(author: PlayerId): number {
    return (this.authors.get(author)?.max ?? 0) + 1;
  }

  /**
   * True when some author's history has a hole in it: we hold seq 5 but not
   * seq 3. Worth knowing immediately rather than at the next gossip tick,
   * because a gap means the reducer is working from an incomplete story.
   */
  get hasGaps(): boolean {
    for (const state of this.authors.values()) {
      if (state.contiguous < state.max) return true;
    }
    return false;
  }

  /** Authors whose history has a hole, for diagnostics. */
  gapAuthors(): PlayerId[] {
    const out: PlayerId[] = [];
    for (const [author, state] of this.authors) {
      if (state.contiguous < state.max) out.push(author);
    }
    return out;
  }

  private recordSeq(author: PlayerId, seq: number): void {
    let state = this.authors.get(author);
    if (state === undefined) {
      state = { seen: new Set<number>(), contiguous: 0, max: 0 };
      this.authors.set(author, state);
    }
    state.seen.add(seq);
    if (seq > state.max) state.max = seq;
    while (state.seen.has(state.contiguous + 1)) state.contiguous += 1;
  }

  /** Lamport stamp for a new local event. */
  nextLamport(): number {
    return this.maxLamport + 1;
  }

  /**
   * Everything the holder of `theirs` is missing. This is the whole backfill
   * protocol: peers swap version vectors and each sends what the other lacks.
   */
  eventsMissingFrom(theirs: VersionVector): SignedEvent[] {
    return this.ordered.filter((event) => event.seq > (theirs[event.author] ?? 0));
  }

  /**
   * Digest of the log's contents. Peers gossip this to notice divergence, which
   * in a system with no authority is the only way to find out you disagree.
   */
  digest(): string {
    return sha256Hex(this.ordered.map((event) => event.id).join(''));
  }

  toJSON(): readonly SignedEvent[] {
    return this.ordered;
  }
}

interface AuthorState {
  readonly seen: Set<number>;
  /** Highest n such that every sequence 1..n is present. */
  contiguous: number;
  max: number;
}

function insertSorted(list: SignedEvent[], event: SignedEvent): void {
  // Events usually arrive roughly in order, so scanning from the end beats a
  // full re-sort and, on the common append path, costs one comparison.
  let i = list.length;
  while (i > 0 && compareEvents(list[i - 1] as SignedEvent, event) > 0) i -= 1;
  list.splice(i, 0, event);
}
