# Protocol

Wire version: **4** (`PROTOCOL_VERSION`). A mismatch is refused at join time -
both at the `have`-message handshake in `packages/net`'s `session.ts` (a
newcomer never even joins the mesh across a mismatch) and, as a second line of
defence for any event that somehow arrives anyway, in `checkEvent`'s
`v === PROTOCOL_VERSION` check (`wrong-protocol`) before the reducer ever sees
it.

## Event envelope

```ts
interface SignedEvent {
  v: number;        // protocol version
  gameId: string;   // "game_" + 10 base32 chars
  author: string;   // "dh_" + 12 base32 chars, == hash of `pub`
  pub: string;      // hex Ed25519 public key
  seq: number;      // per-author, starts at 1, no gaps in a healthy log
  lamport: number;  // total-order key
  at: number;       // author's wall clock, DISPLAY ONLY
  body: GameEventBody;
  id: string;       // sha256 of the canonical signing payload
  sig: string;      // hex Ed25519 signature over the same payload
}
```

`pub` rides on every event so verification is stateless: a peer can check a
signature from a player whose `player/joined` has not arrived yet, which is
routine during backfill.

`at` is never read by the reducer. Clocks are unsynchronised and a lying peer is
free, so anything that branched on it would be both wrong and exploitable.

**Signing payload** is `canonicalJson({v, gameId, author, pub, seq, lamport, at, body})`:
keys sorted, no whitespace, `undefined` dropped. Changing that function is a
protocol break.

### Verification, in order

| Check | Failure |
| --- | --- |
| Shape and ranges | `malformed` |
| `v === PROTOCOL_VERSION` | `wrong-protocol` |
| `gameId` matches the log | `wrong-game` |
| `sha256(payload) === id` | `bad-id` |
| `playerIdFromPublicKey(pub) === author` | `impersonation` |
| Ed25519 verify | `bad-signature` |

## Total order

`(lamport, author, seq, id)`, ascending, string comparison for ids. Every peer
sorts identically, which is what lets the reducer be pure.

## Events

| Type | Author must be | Payload |
| --- | --- | --- |
| `game/created` | first event only; author becomes host | `name`, `joinCode`, `rules`, `packHash` |
| `player/joined` | self-attested | `username` |
| `team/created` | a known player, lobby phase (or `allowLateJoin`) | `teamId`, `name` |
| `team/joined` | a known player, lobby phase (or `allowLateJoin`) | `teamId` |
| `team/left` | a known player, lobby phase | `teamId` |
| `game/started` | the host | - |
| `turn/drawn` | a known player **not** on the acting team | `turnIndex`, `nonce` |
| `turn/category` | a known player **not** on the acting team | `turnIndex`, `categoryId` |
| `turn/difficulty` | a member of the acting team | `turnIndex`, `difficulty` |
| `turn/answered` | a member of the acting team | `turnIndex`, `chosenIndex` |
| `turn/timeout` | any known player | `turnIndex` |
| `room/locked` | the host | `locked` |
| `player/kicked` | the host | `targetId` |
| `commit/made` | a known player | `subject`, `commitHash` |
| `commit/revealed` | a known player, matching a prior `commit/made` | `subject`, `payload`, `salt` |

An event that fails its authority check lands in `state.rejected` with a reason
and is not applied. Duplicates for a turn already resolved are refused by the
`turnIndex` check, so a peer that fires late costs nothing.

### Commit-reveal

`commit/made` and `commit/revealed` are a generic primitive, not specific to
turns or answers - they exist so a future feature (universal-answer, DESIGN.md
§5.1's six-beat turn, not yet wired to this) can let more than one player
answer privately in the same window without every peer seeing every answer
the instant it is signed, which is otherwise unavoidable: every event gossips
in clear to every peer immediately (see Sync below), and today's only reason
an answer is "private" is that `turn/answered`'s authority check lets just one
side submit at all.

- `subject` is whatever the caller wants to key commitments by - a string, not
  a `turnIndex`, so this file's reducer code carries no turn-shaped opinions.
- `commitHash` (from `commitHash(payload, salt)` in `commitReveal.ts`) is
  `sha256(canonicalJson({ payload, salt }))`, reusing the same canonical-JSON
  and hashing helpers every other hash in this protocol goes through.
- A `commit/revealed` is applied only if a `commit/made` from the **same
  author**, for the **same subject**, is still pending (not yet revealed), and
  recomputing `commitHash(payload, salt)` from the reveal's own fields matches
  that commit's `commitHash` exactly. Anything else - no prior commit, a
  different author's commit, a wrong `salt`, a tampered `payload` - is dropped
  like any other authority failure, per the convention above.
- At most one live commit per `(subject, author)`: a second `commit/made` for
  a pair that already has a pending or already-revealed commit is refused.
- **Honesty-assuming secrecy, not cryptographic secrecy.** There is no server
  to keep a payload from the client that authored it - a modified client can
  always inspect its own not-yet-revealed commitment before choosing what to
  reveal, the same way a modified client could always grind against its own
  copy of the content bank in R-10. Committing first does not make that
  impossible; it raises the cost from "read the wire" (every other peer's
  vantage point) to "modify your own client" (an attack on your own honesty,
  not the protocol), and it lets every *other* peer verify after the fact that
  a payload was fixed before it was revealed.
- **Forfeiture is not this primitive's job.** A commit that is never revealed
  just stays pending; nothing here expires it. `unrevealedCommits(state,
  subject)` in `reducer.ts` exposes which authors still have a pending commit
  for a subject, so a caller with turn-shaped context (a timeout firing, a
  turn resolving) can decide what "too late" means and treat an unrevealed
  commit as forfeited on its own terms. This file deliberately has no timeout
  duration or turn-phase check baked into it.

### Why the acting team cannot draw its own question

The question is `f(nonce, category, difficulty)` and the whole bank is on every
device, so any nonce the answering team controls is a nonce it can grind against
the bank before choosing a tier. Requiring an opponent to publish the nonce
raises "cheat" from "read your own disk" to "collude with the team you are
playing against". Full anti-cheat is impossible in this topology; this is the
part that is achievable and cheap.

## Sync (anti-entropy)

```ts
type SyncMessage =
  | { t: 'have';   gameId: string; vector: VersionVector; digest: string }
  | { t: 'want';   gameId: string; vector: VersionVector }
  | { t: 'events'; gameId: string; events: SignedEvent[] }
```

Payloads are JSON strings on one trystero action (`dh`). Messages for another
`gameId` are ignored silently: the relay room is public, so anything can turn up.

- **`have`** on peer join (targeted) and every 5 s (broadcast). The sender ships
  anything the recipient lacks and asks for anything it lacks itself.
- **`want`** when behind, and immediately on noticing a gap.
- **`events`** in chunks of 40, so one late joiner cannot blow a datachannel.

`VersionVector` maps author to **highest contiguous** sequence number. Contiguous
is the whole point: with maximum, a lost broadcast is never recovered because the
gap is invisible in the advertisement.

**Divergence** is when vectors agree and digests do not. No amount of backfill
fixes that, so the UI says so rather than playing on.

## Join tickets

```
dh1.game_abcdefghij.amber-otter-glass-tide.ca4131af381d9cd0
```

`dh<ticketVersion> . gameId . joinCode . packHash[0..16) [ . p<protocol> ]`

About sixty characters, URL-safe, no base64. The first version of this was
base64'd JSON with the host id and game name in it - roughly 250 characters,
which produced a QR symbol dense enough to be a fight to scan. Everything
dropped is discoverable from peers once connected; everything kept is needed
before connecting. The protocol suffix is emitted only when it is not 1.

Encoded in the QR as `https://<origin>/#/join?t=<ticket>` so a phone with
nothing installed still lands somewhere useful, and in the fragment so no server
ever sees it.

## Join codes and rooms

Four words from a frozen 1024-word list: exactly 40 bits, bijective with an
integer. The word list is protocol, not content - reordering it changes what
every existing code decodes to.

```
roomId = base32(sha256("dohhh:v1:room:" + code))[0..26)
```

The code never reaches public infrastructure, and the same code is used as the
datachannel password.

## Discovery

A player typing four words does not know the game id and cannot: it is derived
from the host's key. So `discoverGame(code)` joins the room, waits for any peer's
greeting, reads `gameId` out of it, and leaves. Eight-second timeout, so the UI
can say "no game answered on that code" instead of spinning.
