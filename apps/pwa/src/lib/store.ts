import {
  announce,
  callTimeout,
  chooseCategory,
  chooseDifficulty,
  commitAnswer,
  commitIsomorphAnswer,
  createGame,
  createIdentity,
  drawTurn,
  EventLog,
  explainRejection,
  joinTeam as joinTeamEvent,
  kickPlayer as kickPlayerEvent,
  leaveTeam as leaveTeamEvent,
  newTeamId,
  openTeam,
  randomHex,
  revealAnswer,
  revealIsomorphAnswer,
  SEED_PACK,
  SEED_PACK_HASH,
  setRoomLocked as setRoomLockedEvent,
  startGame,
  withUsername,
  type CategoryId,
  type Difficulty,
  type GameId,
  type Identity,
  type PlayerId,
  type RulesConfig,
  type SignedEvent,
  type TeamId,
} from '@kanbudong/engine';
import {
  buildTicket,
  checkTicket,
  discoverGame,
  explainRefusal,
  GameSession,
  loadEvents,
  loadIdentity,
  saveEvents,
  saveIdentity,
  webStore,
  type JoinTicket,
  type SessionSnapshot,
} from '@kanbudong/net';
import { create } from 'zustand';

import { navigate } from './router.js';

const LAST_GAME_KEY = 'kanbudong.lastGame.v1';
/**
 * Purely local, purely cosmetic: a label for *this device*, distinct from
 * the player's username. The hash (identity.id) is what every signature and
 * team membership actually resolves to and never changes - this just gives
 * a human something friendlier to look at than a hash when they own more
 * than one device. Never touches the engine, never leaves this device,
 * never rides in an event.
 */
const DEVICE_LABEL_KEY = 'kanbudong.deviceLabel.v1';

interface LastGame {
  readonly gameId: GameId;
  readonly joinCode: string;
}

export interface AppState {
  readonly identity: Identity | null;
  readonly session: GameSession | null;
  readonly snapshot: SessionSnapshot | null;
  /** Non-null while a network operation is in flight, with a message to show. */
  readonly busy: string | null;
  readonly error: string | null;
  /** A friendly stand-in for the device hash, set locally, shown nowhere else. */
  readonly deviceLabel: string | null;
  /** True once persistent storage has failed and silently degraded to memory-only. */
  readonly storageDegraded: boolean;

  signUp: (username: string) => void;
  rename: (username: string) => void;
  renameDevice: (label: string) => void;
  host: (name: string, rules: Partial<RulesConfig>) => void;
  joinByCode: (code: string) => Promise<void>;
  joinByTicket: (ticket: JoinTicket) => Promise<void>;
  resume: () => Promise<boolean>;
  leave: () => void;
  dismissError: () => void;

  addTeam: (name: string) => void;
  sitWith: (teamId: TeamId) => void;
  leaveCurrentTeam: (teamId: TeamId) => void;
  setRoomLocked: (locked: boolean) => void;
  kickPlayer: (targetId: PlayerId) => void;
  begin: () => void;
  deal: () => void;
  pickCategory: (categoryId: CategoryId) => void;
  bet: (difficulty: Difficulty) => void;
  answer: (chosenIndex: number) => void;
  /**
   * DESIGN.md §5.1's confer beat follow-up: `turnIndex` names the *parent*
   * turn (the one that carried the isomorph beat, per `TurnRecord.isomorph`)
   * rather than reading `session.state.active`, because by the time this
   * fires the parent turn has already resolved and `active` may already be
   * the next turn or null.
   */
  answerIsomorph: (turnIndex: number, chosenIndex: number) => void;
  callTime: () => void;
}

/**
 * One store, and it is deliberately thin: it owns the identity, the session and
 * nothing else. Every rule question ("may I answer?", "who deals?") is answered
 * by an engine selector against the reduced state, never by a flag kept here -
 * two sources of truth in a system with no server is how peers start
 * disagreeing.
 */
export const useApp = create<AppState>((set, get) => {
  const store = webStore(
    globalThis.localStorage ?? {
      getItem: () => null,
      setItem: () => undefined,
      removeItem: () => undefined,
    },
    () => set({ storageDegraded: true }),
  );

  /**
   * Announcing yourself the instant a session is constructed stamps that
   * event with a Lamport clock starting at 0 - lower than everything the
   * host has already committed, since backfill hasn't landed yet. Once
   * merged, that early stamp can sort the announcement (and anything
   * committed right after it, like sitting on a team) before `game/created`
   * itself, and the reducer rejects any event that arrives before creation
   * permanently: it folds the log once, top to bottom, and never revisits a
   * rejected event once the game/created lands further down. Waiting for the
   * first real state (i.e. game/created has actually been backfilled and
   * folded) means our own next Lamport stamp is guaranteed to be higher than
   * the host's history, so our own events sort after it. A timeout still
   * commits so a genuinely offline test isn't stuck forever.
   */
  const announceWhenReady = (session: GameSession, identity: Identity): void => {
    if (session.state !== null) {
      session.commit(announce(session.log, identity));
      return;
    }
    let settled = false;
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      unsubscribe();
      session.commit(announce(session.log, identity));
    }, 8_000);
    const unsubscribe = session.subscribe((snapshot) => {
      if (settled || snapshot.state === null) return;
      settled = true;
      clearTimeout(timer);
      unsubscribe();
      session.commit(announce(session.log, identity));
    });
  };

  const attach = (session: GameSession, last: LastGame): void => {
    // The reducer already records *why* it dropped an event (`state.rejected`)
    // - nothing ever read it, which is exactly how a silently-dropped
    // team/created event went unnoticed until someone hit it live. Logging
    // each newly-seen rejection is cheap and turns "the team never showed up"
    // into a console line naming the event and the reason.
    const loggedRejections = new Set<string>();
    session.subscribe((snapshot) => {
      set({ snapshot });
      for (const { id, reason } of snapshot.state?.rejected ?? []) {
        if (loggedRejections.has(id)) continue;
        loggedRejections.add(id);
        console.warn(`[kanbudong] event ${id} rejected: ${reason}`);
      }
      // A game is its log, so persisting the log is persisting the game:
      // reloading the tab mid-round rejoins and the peers backfill the rest.
      if (snapshot.state !== null) saveEvents(store, last.gameId, session.log.events);
    });
    store.set(LAST_GAME_KEY, JSON.stringify(last));
    set({ session, snapshot: session.snapshot(), busy: null, error: null });
  };

  const teardown = (): void => {
    get().session?.leave();
    set({ session: null, snapshot: null });
  };

  return {
    identity: loadIdentity(store),
    session: null,
    snapshot: null,
    busy: null,
    error: null,
    deviceLabel: store.get(DEVICE_LABEL_KEY),
    storageDegraded: false,

    signUp: (username) => {
      const identity = createIdentity(username);
      saveIdentity(store, identity);
      set({ identity });
      navigate('/');
    },

    rename: (username) => {
      const current = get().identity;
      if (current === null) return;
      const identity = withUsername(current, username);
      saveIdentity(store, identity);
      set({ identity });
    },

    renameDevice: (label) => {
      const trimmed = label.trim().slice(0, 24);
      if (trimmed.length === 0) {
        store.remove(DEVICE_LABEL_KEY);
        set({ deviceLabel: null });
        return;
      }
      store.set(DEVICE_LABEL_KEY, trimmed);
      set({ deviceLabel: trimmed });
    },

    host: (name, rules) => {
      const identity = get().identity;
      if (identity === null) return;
      teardown();
      let log: EventLog | undefined;
      const game = createGame({
        identity,
        name,
        rules,
        packHash: SEED_PACK_HASH,
        makeLog: (gameId) => {
          log = new EventLog(gameId);
          return log;
        },
      });
      const session = new GameSession({
        identity,
        pack: SEED_PACK,
        gameId: game.gameId,
        joinCode: game.joinCode,
        seed: log?.events ?? [],
      });
      attach(session, { gameId: game.gameId, joinCode: game.joinCode });
      navigate('/lobby');
    },

    joinByCode: async (code) => {
      const identity = get().identity;
      if (identity === null) return;
      set({ busy: 'Looking for that game...', error: null });
      const found = await discoverGame({ joinCode: code });
      // discoverGame just left the room it was probing; rejoining immediately
      // races that teardown on some relays and the real connection never
      // completes its handshake. A short settle window avoids it.
      await new Promise((resolve) => setTimeout(resolve, 500));
      if (found === null) {
        set({
          busy: null,
          error:
            'No game answered on that code. Check the words, and check you are on the same network as the others.',
        });
        return;
      }
      const refusal = checkTicket(found, { packHash: SEED_PACK_HASH });
      if (refusal !== null) {
        set({ busy: null, error: explainRefusal(refusal) });
        return;
      }
      teardown();
      const session = new GameSession({
        identity,
        pack: SEED_PACK,
        gameId: found.gameId,
        joinCode: code,
        seed: loadEvents(store, found.gameId),
      });
      attach(session, { gameId: found.gameId, joinCode: code });
      announceWhenReady(session, identity);
      navigate('/lobby');
    },

    joinByTicket: async (ticket) => {
      const identity = get().identity;
      if (identity === null) return;
      // Refuse at the door, with a readable reason, rather than desyncing on
      // turn nine (R-11).
      const refusal = checkTicket(ticket, { packHash: SEED_PACK_HASH });
      if (refusal !== null) {
        set({ error: explainRefusal(refusal), busy: null });
        return;
      }
      teardown();
      const session = new GameSession({
        identity,
        pack: SEED_PACK,
        gameId: ticket.gameId,
        joinCode: ticket.joinCode,
        seed: loadEvents(store, ticket.gameId),
      });
      attach(session, { gameId: ticket.gameId, joinCode: ticket.joinCode });
      announceWhenReady(session, identity);
      navigate('/lobby');
    },

    resume: async () => {
      const identity = get().identity;
      const raw = store.get(LAST_GAME_KEY);
      if (identity === null || raw === null) return false;
      try {
        const last = JSON.parse(raw) as LastGame;
        // No local cache yet is fine - a joiner whose connection dropped
        // before backfill landed has nothing saved locally, but the session
        // reconnects over the mesh and backfills fresh, same as a first-time
        // join. Bailing out here only because the cache is empty is exactly
        // the bug: it left joiners with no way back in after any hiccup,
        // while hosts (whose own log is populated locally from creation,
        // network or not) never hit it.
        const events = loadEvents(store, last.gameId);
        teardown();
        const session = new GameSession({
          identity,
          pack: SEED_PACK,
          gameId: last.gameId,
          joinCode: last.joinCode,
          seed: events,
        });
        attach(session, last);
        return true;
      } catch {
        return false;
      }
    },

    leave: () => {
      teardown();
      store.remove(LAST_GAME_KEY);
      navigate('/');
    },

    dismissError: () => set({ error: null }),

    addTeam: (name) => commit((session, identity) => openTeam(session.log, identity, name)),
    sitWith: (teamId) =>
      commit((session, identity) => joinTeamEvent(session.log, identity, teamId)),
    leaveCurrentTeam: (teamId) =>
      commit((session, identity) => leaveTeamEvent(session.log, identity, teamId)),
    setRoomLocked: (locked) =>
      commit((session, identity) => setRoomLockedEvent(session.log, identity, locked)),
    kickPlayer: (targetId) =>
      commit((session, identity) => kickPlayerEvent(session.log, identity, targetId)),

    begin: () => commit((session, identity) => startGame(session.log, identity)),
    // Dealing is the one turn-scoped action that happens *between* turns -
    // there is no active turn yet, so it reads the game-level counter
    // instead of an active turn's.
    deal: () =>
      commitTurnIndex(
        (session) => session.state?.turnIndex,
        (session, identity, turnIndex) => drawTurn(session.log, identity, turnIndex),
      ),
    pickCategory: (categoryId) =>
      commitActiveTurn((session, identity, turnIndex) =>
        chooseCategory(session.log, identity, turnIndex, categoryId),
      ),
    bet: (difficulty) =>
      commitActiveTurn((session, identity, turnIndex) =>
        chooseDifficulty(session.log, identity, turnIndex, difficulty),
      ),
    // Phase B (DESIGN.md §5.1 beat 4): answering is commit then reveal, not
    // one event - two `session.commit` calls, not `commitActiveTurn`'s
    // single-event shape, and the second must happen only once the first is
    // actually in the log (see commitAnswer's own doc comment on why one
    // combined builder call can't produce both). Phase B reveals immediately
    // after committing rather than waiting for the rest of the table (see
    // PROTOCOL.md's commit-reveal section) - a documented simplification;
    // Phase C can hold the reveal back once there is a UI to hold it for.
    answer: (chosenIndex) => {
      const { session, identity } = get();
      if (session === null || identity === null) return;
      const turnIndex = session.state?.active?.turnIndex;
      if (turnIndex === undefined) {
        set({ error: "That didn't go through - the game hasn't caught up yet." });
        return;
      }
      const salt = randomHex(8);
      const committed = session.commit(
        commitAnswer(session.log, identity, turnIndex, chosenIndex, salt),
      );
      if (!committed.accepted) {
        set({ error: explainRejection(committed.reason ?? 'unknown') });
        return;
      }
      const revealed = session.commit(
        revealAnswer(session.log, identity, turnIndex, chosenIndex, salt),
      );
      if (!revealed.accepted) {
        set({ error: explainRejection(revealed.reason ?? 'unknown') });
      }
    },
    answerIsomorph: (turnIndex, chosenIndex) => {
      const { session, identity } = get();
      if (session === null || identity === null) return;
      const salt = randomHex(8);
      const committed = session.commit(
        commitIsomorphAnswer(session.log, identity, turnIndex, chosenIndex, salt),
      );
      if (!committed.accepted) {
        set({ error: explainRejection(committed.reason ?? 'unknown') });
        return;
      }
      const revealed = session.commit(
        revealIsomorphAnswer(session.log, identity, turnIndex, chosenIndex, salt),
      );
      if (!revealed.accepted) {
        set({ error: explainRejection(revealed.reason ?? 'unknown') });
      }
    },
    callTime: () =>
      commitActiveTurn((session, identity, turnIndex) =>
        callTimeout(session.log, identity, turnIndex),
      ),
  };

  /**
   * Every write goes through here: builds the event, commits it, and turns a
   * rejection into something the player actually sees instead of a tap that
   * silently did nothing. `session.commit` rejecting a *locally built* event
   * means a bug on this device (a stale turnIndex, a duplicate), not a
   * hostile peer - worth surfacing, not worth pretending didn't happen.
   */
  function commit(build: (session: GameSession, identity: Identity) => SignedEvent): void {
    const { session, identity } = get();
    if (session === null || identity === null) return;
    const result = session.commit(build(session, identity));
    if (!result.accepted) {
      set({ error: explainRejection(result.reason ?? 'unknown') });
    }
  }

  /**
   * Every turn-scoped action needs "the turn this action is about," read
   * from whichever field is actually valid for that phase - `pick` names
   * which one. If it comes back undefined (state hasn't arrived yet, or
   * there's no active turn when one is required), refuse outright rather
   * than falling back to `turnIndex: 0` and shipping a signed event that
   * either mutates the wrong turn or gets silently rejected downstream.
   */
  function commitTurnIndex(
    pick: (session: GameSession) => number | undefined,
    build: (session: GameSession, identity: Identity, turnIndex: number) => SignedEvent,
  ): void {
    const { session, identity } = get();
    if (session === null || identity === null) return;
    const turnIndex = pick(session);
    if (turnIndex === undefined) {
      set({ error: "That didn't go through - the game hasn't caught up yet." });
      return;
    }
    const result = session.commit(build(session, identity, turnIndex));
    if (!result.accepted) {
      set({ error: explainRejection(result.reason ?? 'unknown') });
    }
  }

  /** The turn-scoped actions that require an already-active turn (everything past dealing). */
  function commitActiveTurn(
    build: (session: GameSession, identity: Identity, turnIndex: number) => SignedEvent,
  ): void {
    commitTurnIndex((session) => session.state?.active?.turnIndex, build);
  }
});

/** The ticket a host shows on screen. Derived, never stored. */
export function ticketFor(state: {
  readonly gameId: GameId;
  readonly joinCode: string;
}): JoinTicket {
  return buildTicket({
    gameId: state.gameId,
    joinCode: state.joinCode,
    packHash: SEED_PACK_HASH,
  });
}

export { newTeamId };
