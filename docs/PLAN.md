# Dohhh — Plan

**Status:** v2, revised after the adversarial product review in
[`ADVERSARIAL-REVIEW.md`](./ADVERSARIAL-REVIEW.md). Every ruling marked
**[R-n]** below traces back to a finding in that document. Read the review
before arguing with a decision here — the argument is probably already in it.

---

## 1. What we are building

A peer-to-peer trivia game for people **in the same room**. Two or more teams
take turns; a team is dealt a random category, picks how hard it wants the
question to be, and gets scored asymmetrically for its bravery. First to 150
wins.

There is no game server. Every install is a node. A game exists only as a
replicated, signed event log held by the devices playing it.

### 1.1 Rules (normative)

| Concept | Rule |
| --- | --- |
| Identity | Pick a username at first launch. The device generates an Ed25519 keypair; the public key hashes to a permanent player id (`tp_` + 12 base32 chars). Usernames are decoration and need not be unique — the id is the identity. |
| Teams | 1..N players per team. A game needs **≥ 2 teams** to start **[R-4]**, not just ≥ 2 players. No upper bound on teams or players. |
| Turn order | Teams in join order, round-robin. Within a team the app *nominates* a different member each time that team is up, so a four-person team gives everyone a go. Nomination is advisory, not enforced: any member may submit, because enforcing it would let one locked phone stall the game. |
| Category | Drawn from 12 categories using a **shuffled bag**, not independent random draws **[R-6]** — the bag reshuffles when empty, so you cannot get Chemistry four turns running. |
| Difficulty | After the category is revealed, the team picks one of three tiers. Each tier is defined by *who should get it right*, and the bank is authored to that: `graduate` means a master's degree in the field, `phd` means a specialist or ten years in it, `professor` means twenty years and current with the literature. None of the three is general knowledge. |
| Scoring | `graduate` +1 / −1 · `phd` +5 / −3 · `professor` +15 / −10 |
| Correct answer | Same team keeps the turn: new category, new difficulty choice. |
| Wrong answer | Score penalty, turn passes to the next team. |
| Timeout | Counts as a wrong answer **[R-3]**. 45 s / 75 s / 120 s by tier. Without this a P2P game hangs forever on one person's dead battery. |
| Win | A team reaching ≥ 150 does not end the game instantly — the **round finishes** so every team has had equal turns **[R-5]**. Highest score then wins; a tie goes to sudden death (`professor` question, first correct answer takes it). |
| Score floor | None. A team can go negative. This is spec-faithful and dangerous; see **[R-2]**. Configurable via `rules.scoreFloor`. |
| Repeats | A question is never asked twice in one game. |

### 1.2 Configurable house rules

The engine ships spec-faithful defaults and exposes the levers the review
argued about, so a group can fix its own game without a new build:

```ts
{
  targetScore: 150,
  scoreFloor: null,                 // [R-2] set to 0 to stop death spirals
  maxCorrectStreakPerTurn: null,    // [R-1] set to 3 to stop one-team-plays-everything
  finishTheRound: true,             // [R-5]
  allowLateJoin: false,             // [R-9] late arrivals spectate until the next game
  answerTimeoutMs: { graduate: 45_000, phd: 75_000, professor: 120_000 },
}
```

---

## 2. Architecture

### 2.1 The stack contradiction, resolved

The brief asks for React Native **and** HeroUI **and** a PWA. HeroUI is a
React-DOM + Tailwind library; it does not render in React Native. Pretending
otherwise would produce a codebase that satisfies the words and ships nothing
**[R-7]**.

Resolution: **one headless core, two thin shells.**

```
packages/engine   pure TypeScript. Rules, scoring, RNG, event log, reducer,
                  identity, word codes, question bank. No DOM, no RN, no I/O.
                  This is where the game actually lives.

packages/net      P2P transport + sync protocol + QR join tickets.
                  Platform APIs are injected, so it runs in a browser and
                  under React Native.

apps/pwa          Vite + React 19 + HeroUI v3 + vite-plugin-pwa.
                  THE SHIPPING SURFACE. Installable, offline-capable,
                  works on any phone by opening a URL — which is what a
                  scan-a-QR-code-in-a-pub game needs.

apps/native       Expo / React Native shell over the same engine + net,
                  using RN primitives (no HeroUI). Tier 2: exists so store
                  distribution is a build target, not a rewrite.
```

The engine is ~100% of the rules and 0% of the pixels. That is the only reason
two front-ends is a sane thing to say out loud.

### 2.2 "No central server", stated honestly

WebRTC cannot introduce two strangers to each other without *something* in the
middle. What we can promise is: **no server we operate, no account, no game
state anywhere but the players' devices.**

Peer discovery rides [Trystero](https://github.com/dmotz/trystero) over public
Nostr relays / BitTorrent trackers / MQTT brokers — public infrastructure used
only to swap ICE candidates. Once the mesh is up, all game traffic is direct
WebRTC datachannels. The room id is `base32(sha256("dohhh:v1:" + code))`, so
the join code never appears in plaintext on a public relay **[R-8]**.

This is written down in [`ARCHITECTURE.md`](./ARCHITECTURE.md) as a known
dependency, not buried. If public relays are unreachable the app says so
instead of hanging.

### 2.3 Convergence without an authority

Every action is an event, signed by its author, carrying a per-author sequence
number and a Lamport clock. Peers gossip events; each peer inserts them into a
totally-ordered log (`lamport`, then `authorId`, then `seq`) and re-runs a
**pure reducer**. Same log ⇒ same state, on every device, in any arrival order.

Authority is per-event-type and derived from state, not elected:

- the **host** (game creator) may open and start a game;
- any member of the acting team may pick a difficulty and answer;
- the **drawer** — lowest-id online player *not* on the acting team — draws the
  question by publishing a random nonce **[R-10]**. The question is
  `f(nonce, difficulty)`, so the answering device cannot precompute what it will
  be asked, even though the algorithm is public and the bundle is on its disk;
- any peer may propose a **timeout**; the reducer accepts the first valid one.

Events failing their authority check are dropped, not applied. Protocol details
in [`PROTOCOL.md`](./PROTOCOL.md).

### 2.4 Joining

- **QR code:** the host displays a compact join ticket (game id, room code, host
  id, name, engine + content-pack version). Another phone scans it. This is the
  primary path — it is the one that feels like a party game.
- **Word code:** four lowercase words from a 1024-word list, e.g.
  `amber-otter-glass-tide`. 40 bits of entropy, speakable across a table,
  typeable without a keyboard fight.

Both resolve to the same room. A ticket whose content-pack hash differs from
yours is refused at the door with a readable error, rather than desyncing on
turn nine **[R-11]**.

---

## 3. Content

18 categories × 3 tiers × 15 questions, bundled. Multiple choice, 4 options, seeded distractor
shuffling, one explanation per question so the group learns something when it
loses 10 points.

Content ships as a **pack**: a versioned JSON-ish module with a stable content
hash. Peers compare hashes at join time. Packs are the extension point — a
group can ship its own without touching the engine.

Eighteen categories: History & Civilisations · Central Asian History · East
Asian Development · Geography & Earth Systems · Literature & Poetry · Visual
Arts & Architecture · Music & Performing Arts · Film & Television · Physics &
Astronomy · Chemistry & Materials · Biology & Medicine · Mathematics & Logic ·
Technology & Computing · Semiconductors & Lithography · Software Engineering &
Algorithms · Finance & Structured Products · Economics & Financial History ·
Sport & Games.

The deck size is not fixed in code: the bag is however many categories exist,
so adding one is a line in `categories.ts` plus a content file.

810 questions. Content, not code, is the long pole of a trivia game **[R-12]**,
and the authoring conventions that keep it honest are enforced by tests rather
than by good intentions: the correct option is written first and rotated at
build time, explanations never refer to an option by position, and the bank is
gated on how often "pick the longest option" would win.

---

## 4. Milestones

| # | Milestone | Contents | State |
| --- | --- | --- | --- |
| M0 | Plan + review | this document, the adversarial review | done |
| M1 | Engine | identity, codes, RNG, events, reducer, scoring, bank, tests | done |
| M2 | Net | trystero transport, gossip, backfill, tickets | done |
| M3 | PWA | onboarding → lobby → game → results, installable | done |
| M4 | Native shell | Expo scaffold on shared engine + net | scaffold |
| M5 | Content scale-up | past 1000 questions, pack authoring tooling, per-tier calibration review | in progress |
| M6 | Playtest | 6 humans, one pub, measure the [R-1] streak problem | not started |

M5 and M6 are the ones that decide whether this is a product. M1–M4 only decide
whether it is possible.
