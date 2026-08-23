# Adversarial product review — Dohhh

**Method:** SVPG-style pre-build risk assault. Four risks, asked in Cagan's
order because that is the order they kill products in:

1. **Value** — will anyone *want* this?
2. **Usability** — can they figure it out, in a pub, half a pint in?
3. **Feasibility** — can it actually be built the way it was specified?
4. **Viability** — does shipping it hurt us?

The reviewer's job here is to be hostile to the brief, not to the engineer.
Every finding ends in a **RULING** that either changed the build or was
explicitly rejected with a reason. Findings that changed nothing and were
rejected are still listed — a review that only records the wins is marketing.

---

## Value risk

### R-13 — "Why would anyone play this instead of the box they already own?" 🔴 unresolved

Trivial Pursuit exists. Kahoot exists. Pub quizzes exist and come with beer. The
brief describes mechanics, not a reason to choose them. State the actual
hypothesis or you are building a toy.

The strongest candidate hypothesis in the brief is the **risk ladder**: the
scoring table (+1/−1, +5/−3, +15/−10) turns a knowledge quiz into a *betting*
game. You are not asked "do you know this", you are asked "how much do you
think you know this". That is genuinely not what Trivial Pursuit does, and it is
the only mechanic here that a board game cannot copy without a redesign.

The 12 categories, the round structure and the name are, by contrast, entirely
derivative and add nothing.

> **RULING:** the risk ladder is the product; everything else is packaging. The
> tier names (`university graduate` / `PhD` / `post-doc`) stay because they
> communicate the bet in one word each — that is a real asset. Recorded as the
> hypothesis M6 playtest must falsify. **Not** fixable in code, so it stays
> open, in writing, at the top of the review.

### R-12 — Content is the product; the code is a content delivery mechanism 🟠 mitigated

A trivia game is 90 % question bank. "Post-doc level" questions must be hard,
*unambiguous*, and defensible to an annoyed professor at the table — that is
expensive expert-authored content, not something scraped. Ship a couple of
hundred questions and your retention curve dies within a few sessions: the
repeats start almost immediately.

> **RULING:** accepted, and the roadmap says so instead of hiding it. Content is
> a versioned, hash-identified **pack** with a documented schema from day one, so
> scale-up and third-party packs need no engine change. M5 (1000+ questions) is
> marked as one of the two milestones that decide whether this is a product.
> The bundled seed bank is labelled a seed bank everywhere it appears. Now 270
> questions across 18 categories, which is more coverage and the same verdict.

### R-1 — One team can play the entire game while everybody else watches 🔴 the worst rule in the brief

The brief: correct answer ⇒ same team gets another question. There is no cap.

Do the arithmetic. A team confident at `professor` needs **10 consecutive
correct answers** to go 0 → 150. At `phd`, 30. A strong team with an actual
expert at the table plausibly runs 10+ in a row. The failure mode is not
"unbalanced" — it is that **the other teams never take a turn**, and a party
game where three of four teams sit silent for twenty minutes is not a party
game. This is worse than a scoring bug: it is a *game with no interaction*.

> **RULING:** implemented spec-faithfully (`maxCorrectStreakPerTurn: null`)
> because the reviewer does not get to redesign the game on a hunch — but the
> lever exists, is documented with this arithmetic next to it, and the lobby
> exposes it. M6's single most important measurement is the observed streak
> distribution. If the median winning streak is > 5, the default flips to 3.

### R-20 — The tiers were authored as one tier wearing three hats 🔴 fixed

Found by inspection after the first bank was written, and it is the most
embarrassing finding in this document because it undoes the product's own
premise. The brief asked for "hard, very hard, and incredibly hard". What got
authored was closer to *general knowledge*, *hard*, and *specialist*: "how many
symphonies did Beethoven write" and "what does HTTP stand for" were sitting in
the same tier that is supposed to represent a graduate degree in the field.

Why it matters more than it sounds. The three tiers are the entire product
(R-13): the interesting decision is how much you bet on yourself. If the cheap
tier is free money for anyone with a general education, nobody ever has a reason
to take the expensive one, the bet collapses, and what is left is a quiz.

> **RULING:** the tiers now carry their audience as a normative field in
> `DIFFICULTY_TIERS`, authored against and asserted in tests: `graduate` is a
> master's in the field, `phd` is a specialist or ten years in it, `professor` is
> twenty years and current with the literature. All sixty graduate questions in
> the original twelve categories were rewritten, and the UI states the audience
> next to each bet rather than leaving players to infer it. **Open caveat:** the
> `professor` tier is uneven by field - see the README - and only playtesting
> tells us whether the new floors are right rather than merely higher.

### R-21 — The bank's coverage was narrower than its category names claimed 🟠 fixed

"History & Civilisations" in practice meant European and Mediterranean history
with one Zheng He question for balance. "Technology & Computing" meant
networking trivia. Neither is a rounding error: a category label that promises
breadth and delivers one region or one sub-field misleads the player choosing to
bet on it.

> **RULING:** six categories added where the gap was real and the specialist
> literature is genuinely separate - Central Asian history, East Asian
> development, finance and structured products, economics and financial history,
> semiconductors and lithography, and software engineering and algorithms. The
> category deck is no longer a fixed twelve; the bag sizes itself from
> `CATEGORIES`, so this cost no engine change.

---

## Usability risk

### R-17 — Nobody wants to be assigned an ID 🟡 fixed

"Create an account by choosing a username, which gets assigned a unique id" is a
database schema, not an onboarding flow. Users do not care about their id and
showing it makes the app feel like a bank.

> **RULING:** the id is generated (it is load-bearing — it is a public key hash
> and it is what signatures resolve to) but demoted in the UI to small muted
> text under the username, framed as "your device fingerprint". One screen, one
> text field, one button.

### R-3 — There is no timer, so one dead battery hangs the game forever 🔴 fixed

Unspecified in the brief. In a P2P game with no server there is no referee to
skip a stalled player: if the acting team's phone locks, every other device
waits indefinitely. This is a *liveness* bug, not a UX nicety.

> **RULING:** answer timeouts are mandatory, not optional. 45 / 75 / 120 s by
> tier. A timeout is a **wrong answer**: penalty applied, turn passes. Any peer
> may propose the timeout event; the reducer accepts the first valid one, so the
> game advances even if the stalled device never comes back.

### R-6 — "Randomly sampled" produces streaks that read as broken 🟡 fixed

Independent uniform draws from 12 categories give the same category twice in a
row ~8 % of the time and cluster visibly over a 40-turn game. Players do not
experience that as randomness, they experience it as a bug and complain.

> **RULING:** shuffled bag (12-card deck, reshuffle on exhaust). Still random,
> feels fair, and is deterministic across peers for free.

### R-5 — The finish line is unfair to whoever sits late in the turn order 🟠 fixed

"Until 150 points are met" plus instant termination means the team that goes
first gets strictly more turns. In a 4-team game the last team can lose having
had one fewer turn than the winner. That is the kind of unfairness a group
notices immediately and never forgives.

> **RULING:** `finishTheRound: true` by default. Crossing 150 arms the endgame;
> the round completes so every team has had equal turns; highest score wins.
> Ties go to sudden death on a `professor` question.

### R-2 — Unbounded negative scores create unrecoverable players 🟠 accepted with a lever

Two failed `professor` bets is −20. From −20 with `graduate` answers at +1 you
are 170 correct answers from winning: mathematically alive, psychologically
finished. A player who cannot win stops playing but keeps sitting there, which
is the worst state a party game can put someone in.

> **RULING:** **rejected as a default change.** The brief specifies the penalty
> and the sting is the whole point of the risk ladder — capping it at 0 makes
> `professor` a free bet and destroys R-13's hypothesis. `rules.scoreFloor` is
> configurable and documented. This is the reviewer losing an argument on
> purpose: the mechanic's teeth are load-bearing.

### R-4 — "At least 2 players" is the wrong invariant once teams exist 🟡 fixed

Two players who both join the same team satisfy "≥ 2 players" and produce a game
with one team, no opponent, and a turn order of length 1.

> **RULING:** the start gate is **≥ 2 teams with ≥ 1 present member each**.

### R-9 — Late joins silently corrupt turn order 🟡 fixed

A player scanning the QR code on turn 14 either mutates the turn order
mid-round (unfair, and different peers may apply it at different points) or has
to be told no.

> **RULING:** `allowLateJoin: false`. Late arrivals join as spectators — they
> replay the log and watch — and are eligible for the next game. Honest and
> deterministic.

### R-18 — "Incredibly hard" questions get *disputed*, and disputes need somewhere to go 🟠 partially fixed

At post-doc level, a meaningful share of questions are arguably wrong or
ambiguous, and the argument at the table is more expensive than the points.
Free-text answers make it worse: no offline adjudicator exists.

> **RULING:** multiple choice with 4 options, so correctness is decidable on
> device with no referee, and **every question carries a one-line explanation**
> shown after the answer, so the table argues with the explanation rather than
> with each other. A dispute/flag mechanism is deferred, not solved.

---

## Feasibility risk

### R-7 — React Native + HeroUI + PWA is not a stack, it is three wishes 🔴 fixed

HeroUI is React-DOM and Tailwind. It does not render in React Native. Any plan
claiming all three in one tree is either about to ship `react-native-web` with
two competing styling systems, or is lying.

> **RULING:** headless-core split. `packages/engine` is pure TypeScript with no
> platform imports and holds all the rules; `apps/pwa` (React + HeroUI +
> vite-plugin-pwa) is the shipping surface; `apps/native` is an Expo shell over
> the same engine using RN primitives, scoped explicitly as tier 2. All three
> words in the brief are satisfied without any of them being a lie. The PWA is
> named as primary because a game you join by scanning a QR code cannot afford
> an App Store install in the middle of the invitation.

### R-19 — "No maximum players" is false; a WebRTC mesh is O(n²) 🟠 fixed

Full-mesh peer connections: 8 players = 28 connections, 20 players = 190. Mobile
Safari falls over well before 20, and every event is gossiped to every peer.
"No maximum" is not a feature, it is an untested claim.

> **RULING:** no artificial cap in the engine (the brief wins), but the lobby
> warns above 10 connected devices, the number is documented, and
> `ARCHITECTURE.md` records host-relay star topology as the known fix if
> playtests need it. Claim demoted from "unlimited" to "tested to 8".

### R-15 — WebRTC without TURN fails on exactly the network you will demo on 🟠 documented

STUN-only peer connections fail behind symmetric NAT and on many carrier
networks. No TURN server exists here by definition — a relay is a server.

> **RULING:** the in-the-room case (shared Wi-Fi / local network) is the target
> and works. Cellular-only groups may fail to connect; the app must **say that
> plainly** rather than spinning forever, so connection state is surfaced in the
> lobby with a real error path. Recorded as a hard limit of "no server", not a
> bug to be fixed later.

### R-10 — Every device has the question bank *and* the seed, so the answerer can precompute 🟠 fixed

With no server, the bank is on disk and any deterministic derivation from a
public game seed can be run ahead of time by the team about to be asked. A
modified client wins every `professor` bet.

> **RULING:** the question is not derived from the game seed alone. The
> **drawer** — the lowest-id online player *not* on the acting team — publishes a
> fresh random nonce at turn start, and the question is `f(nonce, difficulty)`.
> The answering device cannot precompute what it will be asked. Full anti-cheat
> against a modified client is impossible in this topology and we say so; this
> raises the cost from trivial to needing a colluding opponent.

### R-11 — Divergent content packs desync the game on turn nine 🟡 fixed

Two devices on different app versions derive different questions from the same
nonce and each believes the other is cheating.

> **RULING:** join tickets carry the content-pack hash and the protocol version.
> Mismatch is refused **at the door** with a readable message, not discovered
> mid-game.

### R-8 — Four-word codes on public relays are squattable 🟡 fixed

A 1024-word list gives 40 bits — fine against guessing. But if the code is the
public-relay topic in plaintext, anyone watching public infrastructure sees the
codes being used and can join or squat rooms.

> **RULING:** the relay room id is `base32(sha256("dohhh:v1:" + code))`. The
> code never appears on public infrastructure. Knowing the room id does not
> yield the code, and all game events are signed, so a squatter can occupy a
> room but cannot forge a score.

---

## Viability risk

### R-14 — The name was close enough to invite a letter from Hasbro 🟢 resolved

The original name paired "Triviant Pursuit" with twelve categories and a
round-based board-game structure - a similarity a trademark holder's counsel
would find in one search, and one that gets more expensive the longer it stands.
Flagged here rather than decided, because a rename is a business call.

> **RULING:** renamed to **Dohhh**. The Trivial Pursuit exposure is gone
> entirely, and the new name is a better fit besides: it is the noise a player
> makes when a fifteen-point bet fails, which is the moment the whole design is
> built around.
>
> The residual risk is not zero and should not be presented as such. *D'oh* is
> strongly associated with The Simpsons, and Twentieth Century Fox has asserted
> trademark rights over it in merchandising classes. It is materially smaller
> than what it replaces: the spelling is altered, the sector is unrelated, and
> the underlying word is a lexicalised interjection with its own OED entry
> rather than a coined mark. Worth one opinion from someone qualified before any
> paid distribution; not worth blocking development over.
>
> On the spelling question - accent or not, `o` or `u` - no accent and no `u`.
> `dôhhh` reads as French, phone keyboards do not offer `ô` easily, and an
> accented character in a domain, a package name or a store search field costs
> more than it conveys. The rename touched 35 files and took one pass, which is
> the claim this ruling made when the risk was first raised.

### R-16 — No moderation surface, and custom packs are arbitrary content 🟡 accepted

There is no server, so there is no reporting, no moderation and no takedown.
Custom content packs mean a group can load anything into a game their kids might
be playing.

> **RULING:** accepted for the in-person, small-group, no-strangers threat model
> — which is genuinely different from a public lobby, and is the model the QR
> code implies. Documented as an explicit non-goal. It becomes a real problem the
> moment anyone proposes public matchmaking, and that proposal should be refused
> until this is answered.

---

## Scorecard

| Risk | Verdict |
| --- | --- |
| Value | **Weakest link.** The risk ladder is a real insight; the rest of the brief is a clone. R-13 and R-1 are unproven and only a playtest settles them, and R-20 shows how easily the ladder can be flattened by careless authoring. |
| Usability | Addressable, and mostly addressed. R-3 and R-5 were outright bugs in the brief. |
| Feasibility | Buildable once R-7's contradiction is resolved honestly. "No server" and "no maximum players" both needed downgrading from marketing to engineering. |
| Viability | R-14 resolved by the rename to Dohhh, with a smaller residual risk stated rather than hidden. Everything else is inside the in-person threat model. |

**Recommendation:** build M1–M4 (they are cheap and they de-risk everything
technical), then **stop and playtest before writing question 181**. The open
questions are behavioural — does the risk ladder actually make people bet, and
does R-1 hand one team the whole game — and no further engineering answers
either of them.
