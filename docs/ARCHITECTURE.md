# Architecture

## The one-paragraph version

`packages/engine` is the game: pure TypeScript, no DOM, no React Native, no
sockets, no clock. `packages/net` moves signed events between devices.
`apps/pwa` draws pixels with HeroUI. `apps/native` draws pixels with React
Native. A game is a replicated, append-only, signed event log, and state is a
pure function of that log.

```
        apps/pwa (React + HeroUI + PWA)      apps/native (Expo / RN)
                     |                                |
                     +----------------+---------------+
                                      |
                             packages/net
                    trystero transport, anti-entropy sync,
                       QR join tickets, local storage
                                      |
                            packages/engine
             identity, join codes, seeded RNG, event log, reducer,
                       scoring, selectors, content packs
```

Dependencies point one way only. The engine imports nothing from net; net
imports nothing from either app; neither app imports the other. `packages/engine`
has three runtime dependencies (`@noble/curves`, `@noble/hashes`, `@scure/base`)
and no platform imports at all, which is why the same rules can be trusted to
produce the same answer in a browser, in Hermes and in a node test runner.

## Why the split exists

The brief asked for React Native **and** HeroUI **and** a PWA. HeroUI is
React-DOM plus Tailwind; it does not render under React Native. The options were
to fake it, to pick one and ignore the brief, or to make the disagreement
structural. See [`ADVERSARIAL-REVIEW.md`](./ADVERSARIAL-REVIEW.md) R-7.

Structural won: the rules moved down into a headless package and each surface
became a shell over it. The engine is 100% of the rules and 0% of the pixels,
which is the only thing that makes two front-ends defensible rather than merely
expensive.

The PWA is primary. A game you join by pointing a camera at someone's phone
cannot ask for an App Store install in the middle of the invitation.

## What "no central server" actually means

**True:** no server we run, no account, no matchmaking, no telemetry, and no
copy of a game anywhere but on the players' devices. All game traffic is direct
WebRTC datachannels between peers.

**Also true:** WebRTC cannot introduce two devices to each other unaided. Peer
discovery rides [Trystero](https://github.com/dmotz/trystero) over public Nostr
relays, which carry ICE candidates and nothing else. The relay topic is
`base32(sha256("dohhh:v1:" + code))` rather than the code, so a join code
never appears on public infrastructure, and the datachannel is encrypted with the
join code as the shared secret.

Consequences we accept and surface rather than hide:

| Limit | Why | What the app does |
| --- | --- | --- |
| STUN-only, no TURN | A relay is a server, and we said there isn't one | Symmetric NAT and some carrier networks will not connect. The lobby says so after 15 s instead of spinning forever. |
| Full mesh, O(n^2) | Every peer holds a connection to every other | No cap in the engine, tested to 8 devices, lobby warns above 10. Host-relay star topology is the known fix if playtests demand it. |
| Public relays | Somebody has to carry the handshake | If none are reachable, the app says that, plainly. |

## Convergence without an authority

Every action is a `SignedEvent`: an Ed25519 signature over a canonical JSON
payload, carrying the author's public key, a per-author sequence number and a
Lamport clock. Peers gossip events; each peer sorts them into one total order
(`lamport`, `authorId`, `seq`, `id`) and re-runs `reduce()`, which is pure.
Identical logs therefore produce identical state on every device, in any arrival
order - a property the test suite asserts by shuffling a real log twenty times
and comparing the result.

Authority is derived from state, never elected and never voted on:

- **host** - opens and starts the game;
- **acting team** - picks a difficulty and answers;
- **drawer** - any peer *not* on the acting team publishes the turn nonce. First
  valid one in total order wins;
- **anyone** - may propose a timeout.

Events failing their check are recorded in `state.rejected` and dropped. Nothing
throws, because a hostile peer must not be able to crash a game.

Two properties do the heavy lifting:

1. **Identity is self-certifying.** A player id is a hash of a public key, so an
   event claiming to be from someone else fails without consulting any registry.
2. **Presence is not log data.** `GameState` contains no `now` and no
   "connected", so no rule can ever depend on something peers might disagree
   about. Timers live in the UI; the *consequence* of a timer is an event.

## Anti-entropy

Peers exchange version vectors (`have`), request gaps (`want`) and ship events
(`events`). Three message types, no acknowledgements, no retry queues, no
leader.

The subtlety worth knowing about: a version vector records each author's highest
**contiguous** sequence number, not their maximum. Tracking the maximum looks
identical until a broadcast is lost - then a peer advertises seq 2 while seq 1 is
missing and nothing ever re-sends it. A gap has to stop the counter. On top of
that, receiving an event that *creates* a gap triggers an immediate `want`, so
repair happens in milliseconds rather than at the next gossip tick. Both
behaviours have tests, and both were found by tests rather than by reasoning.

## Determinism

Everything a peer must derive identically runs through `createRng(...seedParts)`
(xoshiro128** seeded by SHA-256). `Math.random()` and `Date.now()` appear nowhere
downstream of a game event.

- **Category:** a shuffled bag of all categories, seeded by the game id, so the
  same category cannot come up four turns running. The deck is sized from
  `CATEGORIES`, not hard-coded, which is why going from twelve categories to
  eighteen touched no engine logic.
- **Question:** seeded by the **drawer's nonce**, which is why the answering
  device cannot precompute what it will be asked even though the algorithm is
  public and the whole bank is on its disk.
- **Option order:** seeded by nonce plus question id, so every device shows the
  same four buttons in the same order and an answer index means one thing.

## Storage

A game is its log, so persisting the log persists the game: reload the tab
mid-round and the app rejoins, then peers backfill anything missed. The
`KeyValueStore` interface has three methods; the web implementation wraps
`localStorage` and degrades to memory when a private-mode browser throws on
write.

## Content packs

Questions are a versioned pack with a content hash over the semantics (prompts,
options, answers) and not the file, so reordering questions or renaming a pack
does not invalidate a game in progress but editing an answer does. Join tickets
carry the first 16 hex characters of that hash; a mismatch is refused at the
door with a readable message rather than discovered on turn nine.
