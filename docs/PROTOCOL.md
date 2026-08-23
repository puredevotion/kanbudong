# Protocol

Wire version: **1** (`PROTOCOL_VERSION`). A mismatch is refused at join time.

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
| `team/created` | a known player, lobby phase | `teamId`, `name` |
| `team/joined` | a known player, lobby phase | `teamId` |
| `team/left` | a known player, lobby phase | `teamId` |
| `game/started` | the host | - |
| `turn/drawn` | a known player **not** on the acting team | `turnIndex`, `nonce` |
| `turn/difficulty` | a member of the acting team | `turnIndex`, `difficulty` |
| `turn/answered` | a member of the acting team | `turnIndex`, `chosenIndex` |
| `turn/timeout` | any known player | `turnIndex` |

An event that fails its authority check lands in `state.rejected` with a reason
and is not applied. Duplicates for a turn already resolved are refused by the
`turnIndex` check, so a peer that fires late costs nothing.

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
