# Forking dohhh into 看不懂

The Mandarin reading game is a **hard fork**, not a shared kernel. That was a
deliberate call: two codebases that never have to agree on anything are simpler
than one kernel with a versioning story between them. The accepted cost is that
dohhh's sync and crypto layer is duplicated, so a future fix there has to be
ported by hand.

This file exists to make that port cheap when it happens, and to make the fork
reproducible rather than a thing that happened once in a session nobody kept.

## Status

**Blocked on one manual step.** The GitHub App serving this session is scoped to
`puredevotion/dohhh`, so it cannot create a repository:

```
POST /user/repos → 403 Resource not accessible by integration
```

Create the empty repo by hand, then everything below is executable.

## Step 0 — create the repository

Create `puredevotion/kanbudong`, empty: no README, no `.gitignore`, no licence.
An auto-initialised repo needs an unrelated-histories merge on first push, which
is a pointless conflict to resolve.

Once it exists, a Claude Code session can attach it with `add_repo` and push
directly. Otherwise push from a local clone.

## Step 1 — take the tree

Fork from `origin/main` at **`3796780`** ("Add moderation, reconnect hardening,
unicode safety, and a security/DoS pass"), plus the design work on
`claude/mandarin-learning-game-yxfz00`.

```bash
git clone git@github.com:puredevotion/dohhh.git kanbudong
cd kanbudong
git checkout claude/mandarin-learning-game-yxfz00
rm -rf .git && git init -b main
git remote add origin git@github.com:puredevotion/kanbudong.git
```

Starting a fresh history is deliberate. dohhh's 18 commits are about a trivia
game; carrying them into a language app makes `git log` a worse tool, and the
provenance that matters is recorded here instead.

## Step 2 — what is kept byte-identical, and why

These files are **not** to be reformatted, re-linted or tidied on the way in.
Keeping them byte-identical means a future dohhh fix applies as a patch instead
of being re-derived by reading two diverged files side by side. Diverge them only
when the Mandarin rules actually force it, and note it here when you do.

Hashes are `git hash-object` at dohhh `3796780`.

| File | Hash at fork |
| --- | --- |
| `packages/engine/src/canonical.ts` | `00ec177c16fc598fc97f42326686f107a30d2d6f` |
| `packages/engine/src/ids.ts` | `2e733ece4750e0b34f44d01986488dd93c989528` |
| `packages/engine/src/rng.ts` | `ad244b4f5ee16eb83e6009caa7d99c0ba093d265` |
| `packages/engine/src/identity.ts` | `11e8087716dc314802da0f5a865549c52bdedf95` |
| `packages/engine/src/joincode.ts` | `2e5ab42166fcb4788df2fa8cddce7e1d65f9cb8a` |
| `packages/engine/src/wordlist.ts` | `45f17331589d6a9c5ac365e6a39a2d4c84a25feb` |
| `packages/engine/src/log.ts` | `a1f7d39c3f8212d39b242dca800cd18702c88df8` |
| `packages/net/src/transport.ts` | `7cbe7baca202923bd0fc31f00b05227bc1ba079f` |

Three more are *almost* identical — they change by exactly one import line when
the package scope is renamed, and by nothing else:

| File | Hash at fork | Divergence |
| --- | --- | --- |
| `packages/net/src/discover.ts` | `ebf9368ea7fa504e2e9fe1bdec164dece437c7e2` | import scope only |
| `packages/net/src/storage.ts` | `433e03daeee83ce8d9e4e3933bef2b5700a67322` | import scope only |
| `packages/net/src/ticket.ts` | `36a2ad5f51f2f41cc72d0cf48cc368bf36f92284` | import scope only |

`packages/engine/src/events.ts` (`6eed849f…`) and `packages/net/src/session.ts`
(`d7622c63…`) **will** diverge structurally: `events.ts` carries the trivia event
union alongside the generic envelope, and `session.ts` hardcodes `reduce()` and
`GameState`. Port fixes to these two by reading, not by patching.

To check drift later:

```bash
git hash-object packages/engine/src/canonical.ts   # compare against the table
```

## Step 3 — rename the scope

23 files reference `@dohhh/`. All of them are either a package name, a workspace
dependency or an import:

```bash
grep -rl '@dohhh/' --include='*.ts' --include='*.tsx' --include='*.json' --include='*.yml' . \
  | grep -v node_modules \
  | xargs sed -i 's|@dohhh/|@kanbudong/|g'
```

Then the human-facing strings, which `sed` should not do blind: the root
`package.json` name and description, `apps/pwa/index.html` title and meta
description, the PWA manifest in `apps/pwa/vite.config.ts`, `README.md`, and the
Cloudflare project name in `apps/pwa/wrangler.jsonc` and
`scripts/deploy-pages.sh`.

## Step 4 — delete the trivia

```bash
git rm -r packages/engine/src/content        # 21 files, 10,731 lines
git rm -r apps/native                        # Expo scaffold; the product is a PWA
```

`packages/engine/src/index.ts` re-exports `SEED_PACK` and `SEED_PACK_HASH`; the
PWA imports `SEED_PACK` in `Play.tsx` and passes a pack into `Session`. The tree
will not typecheck until a replacement pack exists, which is the point — it fails
loudly rather than shipping an empty bank.

`packages/engine/src/categories.ts` holds 23 trivia categories. Replace with the
survival situations from the design document §6.

## Step 5 — what the design document changes, and what it does not

**Do not port dohhh's architecture unexamined.** `docs/DESIGN.md` §6 inverts it:
the scheduler is the product and a match is a *presentation* of it, so the match
engine draws from a due queue. dohhh's reducer treats the match as the thing that
exists. That inversion is the first real piece of work in the new repo and it is
specified, not open.

Three more rulings change inherited behaviour, all specified in the document:

- **Every player answers every item** (§5.1), not only the dealt player.
- **The bet no longer selects the item format** (§3.1) — the scheduler does.
- **The turn passes on rotation, not on error** (§5.1).

`DIFFICULTY_TIERS` in `packages/engine/src/rules.ts` survives as a scoring table
and stops being a difficulty selector.

## Step 6 — get it green, then push

```bash
pnpm install:web
pnpm -r --filter @kanbudong/engine --filter @kanbudong/net --filter @kanbudong/pwa typecheck
pnpm test
pnpm build
git add -A && git commit -m "Fork dohhh into 看不懂"
git push -u origin main
```

`.github/workflows/verify.yml` needs its filters renamed to match.

**Do not carry the Cloudflare Workers Builds integration across.** It is
misconfigured on dohhh — a Workers integration pointed at a Pages project, which
fails on every commit — and connecting the new repo the same way reproduces a red
check that means nothing. Connect it as a **Pages** project, or leave deploys to
`scripts/deploy-pages.sh`.

## Step 7 — close dohhh#1

PR `puredevotion/dohhh#1` is the staging branch for this fork. Once the fork is
pushed, close it **unmerged**. None of it belongs in the trivia app.
