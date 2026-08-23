# 看不懂

*kànbudǒng* — "I look at it and I don't get it." The noise you make in front of a
Chinese sign, which is the problem this is for.

A co-located multiplayer **reading** game. Five people round a table, five phones,
no server and no account. An opposing team deals you a scene — a shelf-edge price
label, the cooking-method column of a menu, a shopfront fascia — and you read what
is on it before anyone tells you what it says.

The goal is narrow on purpose: **function in China quickly.** Read a menu, read a
metro sign, read a supermarket label, know what kind of shop you are standing in
front of. Not conversation, not HSK, not characters for their own sake.

> **Status: forked and building, not yet the game described below.** The engine,
> sync layer and web app run — 121 tests, typecheck, production build. What runs
> today is the inherited trivia loop wearing Mandarin content. The design in
> [`docs/DESIGN.md`](docs/DESIGN.md) is written and specifies a different
> architecture; building it is the work.

## Why the weights are strange

The bank is weighted market 30%, menu 30%, street 20%, safety 15%, **transit 5%**,
which is backwards from every phrasebook. The reason is one line: **the metro is
already in English; the noodle shop is not.**

Bilingual signage in tier-1 metros and airports is procurement practice — GB/T
30240 is 推荐性, *recommended*. GB 7718, which requires Chinese on packaged-food
labels and forbids foreign text set larger than the corresponding Chinese, is
mandatory. The supermarket back panel is where no English is coming.

## What is different from a flashcard app

**The card is the object, not a card.** A price label renders as a price label,
with the price shouting over the character you actually need. A shopfront renders
as a fascia — loud, tightly tracked, gold on red. Two of the five templates are
hard to read because the real ones are, and the design document is explicit that
this is *fidelity*, never a difficulty device: perceptual disfluency does not aid
learning, and the target glyph clears WCAG AA in every treatment.

**An item is a span, not a character.** 出口, 保质期, 换乘, 会员价 — one to four
characters met as a unit on a surface. Coverage is not readability, and the gap is
multiplicative: at 90% character coverage a six-character sign is still unreadable
about a third of the time.

**The breakdown is the screen that teaches.** 牛肉 comes apart into 牛 ox and 肉
meat, then the same move opens 猪肉, 羊肉, 鸡肉, 鸭肉. Morphological awareness is
the largest single contributor to L2 Chinese reading, ahead of vocabulary size, so
that screen is the body of the reveal and nothing advances it but a tap.

## Layout

| Path | What it is |
| --- | --- |
| `packages/engine` | Rules, identity, event log, deterministic reducer, content packs. No DOM, no sockets. |
| `packages/net` | Peer discovery, anti-entropy sync, QR join tickets, local storage. |
| `apps/pwa` | The app you play. Vite + React 19 + HeroUI v3, installable and offline-capable. |
| `docs/DESIGN.md` | The design, from 11 adversarially-reviewed literature sweeps. Long, and the argument for every decision is in it. |
| `docs/FORK.md` | What was inherited from dohhh, what stays byte-identical, and how to port a fix across. |
| `design/cards` | Card design source, published as a Claude Design canvas. |

## Running it

```bash
pnpm install:web
pnpm dev             # http://localhost:5173
pnpm verify          # lint + typecheck + tests + production build
```

Two devices, one game: host on the first phone, join on the second by scanning the
QR code or typing the four words. Camera access needs HTTPS or `localhost`, and so
does peer discovery — Trystero derives its relay topic through `crypto.subtle`,
which browsers expose in secure contexts only. Over plain `http://192.168.x.x`
peers never find each other and the game looks broken rather than merely
camera-less.

## Deploying

`pnpm build` writes a static `apps/pwa/dist/` with no backend, so deploying is
copying a directory — over HTTPS, for the reason above.

```bash
scripts/deploy-pages.sh          # needs CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID
```

This is a Cloudflare **Pages** project. Do not connect the Workers Builds Git
integration to it: wrangler refuses a Workers command in a Pages project, so that
integration fails on every commit forever. dohhh has exactly that misconfiguration
and it is why its PRs carry a permanently red check.

## Provenance

Hard-forked from [dohhh](https://github.com/puredevotion/dohhh), a serverless P2P
trivia game, at `3796780`. The fork was deliberate: two codebases that never have
to agree are simpler than one shared kernel with a versioning story between them.
The cost is a duplicated sync and crypto layer, and
[`docs/FORK.md`](docs/FORK.md) exists to make porting a fix across cheap — it
lists which files are byte-identical, with hashes, and which two will diverge
structurally.

`docs/ARCHITECTURE.md` and `docs/PROTOCOL.md` are inherited and still accurate for
the kernel. `docs/PLAN.md` and `docs/ADVERSARIAL-REVIEW.md` are dohhh's, kept for
the reasoning behind decisions this code still carries.

MIT, like its parent.
