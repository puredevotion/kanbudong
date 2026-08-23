# House rules — 看不懂

Baseline for Claude Code sessions in this repo, adapted from kithl's
`AGENTS.md` pattern: one canonical file, explicit approval checkpoints instead
of vague "check with me," and a communication contract that doesn't drift
session to session.

## Communication

- Be concise. State results and decisions directly.
- When summarising a batch of changes, use bullets — each one says *why* a
  change was made, not just what changed.
- Don't narrate errors made or approaches abandoned mid-task. Report the end
  state; the git history and this session's transcript already hold the rest.

## Code

- Match this repo's existing style: engine/net/pwa packages stay
  platform-free where they already are (no DOM/RN/Node-specific code leaking
  into `packages/engine` or `packages/net`).
- No comments unless the WHY is non-obvious — a hidden constraint, a subtle
  invariant, a workaround. Never restate what the code already says.
- `pnpm verify` (lint → typecheck → test → build) is the bar. Green before
  calling anything done, not just "looks right."
- Latest stable toolchain/deps by default; don't downgrade to dodge a
  warning without saying why.

## Tooling

- `pnpm` for all workspace commands, never bare `npm`/`yarn`.
- `oxlint` is the linter; don't suppress a finding without a one-line why.
- Playwright (headless Chromium) for verifying PWA changes end-to-end when a
  browser check matters; the Android emulator (`adb`) is available for
  on-device rendering checks, but its bundled WebView test harness doesn't
  reliably accept synthetic input — use it for visual/rendering confirmation,
  not interaction testing.
- Content lives in `packages/engine/src/content/*.ts` as `[prompt, options,
  answerIndex, explanation]` tuples (see `content/row.ts`). Explanations are
  player-facing copy, not authoring notes — no frequency ranks, doc
  cross-references (`§7.x`), or raw IDS decomposition strings (⿰⿱⿹) in
  anything a player reads.

## Approval checkpoints — always ask first, never assume

1. **Deploying to Cloudflare Pages** (`scripts/deploy-pages.sh`) — this is
   the live URL real people may be using. Confirm before running it, unless
   the request that turn was explicitly "ship this" / "deploy."
2. **New dependencies** — nothing added to `package.json` without saying
   what it's for and getting a yes first.
3. **Anything touching `.env.deploy-secrets` or other secrets** — read for
   context freely; never print a full token/key value into chat, and never
   commit it.
4. **Destructive git** (`push --force`, `reset --hard`, deleting branches) —
   per the global git-safety rules; this repo adds nothing stricter.
5. **Large content-bank rewrites** (rewording many `explanation` strings,
   changing scoring/difficulty tiers, adding/removing questions) — fine to
   execute once scope is agreed (as with the jargon-cleanup pass), but confirm
   scope first when it's not obvious from the request how far it should
   reach.

## Design-doc awareness

`docs/DESIGN.md`, `docs/PROTOCOL.md`, and `docs/FORK.md` are load-bearing —
they specify inversions the code doesn't implement yet (e.g. the §6 span/Elo
scheduler is still a simplified stand-in, see `packages/engine/src/memory.ts`
and `src/solo.ts`). When a request touches something the design doc has an
opinion on, check it before improvising, and say explicitly when an
implementation is a scoped-down simplification rather than the full spec.
