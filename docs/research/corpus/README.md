# Corpus data

Reference data the research used to _verify_ content — pinyin, components,
frequency, simplified/traditional mappings. None of it is shipped in the app
bundle; `DESIGN.md` §9 governs what may be.

## Committed here

| File                                                 | Source                                                                                    | Licence                    |
| ---------------------------------------------------- | ----------------------------------------------------------------------------------------- | -------------------------- |
| `hsk30-chars.txt`, `hsk30-words.txt`                 | [`elkmovie/hsk30`](https://github.com/elkmovie/hsk30) — OCR of the official HSK 3.0 lists | **MIT**, © 2021 Pleco Inc. |
| `opencc-STCharacters.txt`, `opencc-TSCharacters.txt` | [OpenCC](https://github.com/BYVoid/OpenCC)                                                | **Apache-2.0**             |

The HSK files carry an "OCR'ed but not extensively proofread" warning from their
maintainer. Treat them as a band-tagging convenience, not ground truth — and note
`DESIGN.md` §9.1 forbids the letters "HSK" in the UI or store metadata regardless,
on trademark grounds. The band is an internal integer.

## Deliberately not committed

| Data                              | Why not                                                                                                                                                                               | Get it with                             |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| **Make Me a Hanzi** decomposition (`dictionary.txt`) | **LGPL-3.0-or-later.** `DESIGN.md` §9.2 keeps it out of the build environment entirely so the in-house decomposition work stays provably clean. Verification-only, on a scratch copy. | `fetch.sh`                              |
| **pinyin-data**                   | MIT and safe, but 985 KB of reference table that would sit in `docs/` going stale.                                                                                                    | `fetch.sh`                              |
| **Character frequency list**      | No licence header and no recorded provenance in the copy the agents fetched. Committing data whose licence nobody has established is the mistake this table exists to avoid.          | `fetch.sh`, with the caveat noted there |
| **jieba dictionary**              | 5 MB, and a segmentation dictionary rather than research.                                                                                                                             | not needed                              |
| Published paper PDFs              | Copyright. Cite the URL, do not redistribute.                                                                                                                                         | `SOURCES.md`                            |

## The one exception: `graphics.txt` feeds the real build

**`graphics.txt` (Make Me a Hanzi's stroke/median data, Arphic Public
License) is NOT verification-only** — unlike everything else on this page,
`pnpm strokes` (`scripts/build-strokes.mjs`) reads it directly to generate
`apps/pwa`'s shipped stroke-order dataset. `docs/LICENSING.md` documents why:
the user confirmed this app is private-use-only, which the Arphic license's
"designated place" republish duty survives (the license text plus a
`CHANGES.md` ship alongside the generated data, in `docs/licenses/` and
copied into the build output) but the underlying LGPL-vs-in-house-authoring
argument that keeps `dictionary.txt` out of the build entirely does not apply
here — there is no "author 1,500 stroke orders in-house" equivalent. A fresh
checkout needs `fetch.sh` run at least once before `pnpm build`/`pnpm
strokes` will produce real stroke data; without it, the build still succeeds
but the stroke-order panel renders as absent for every character (same
graceful-fallback convention every other reveal panel uses).

## The verification these enable

`pinyin-data` is what every pinyin syllable in the `DESIGN.md` §7 curriculum was
checked against — 95 single-character readings, zero mismatches. Make Me a Hanzi
is what settled that the component in 肝 肠 肚 腰 脑 is **⺼ U+2EBC**, the meat
radical, and not 月 U+6708, the moon. Those are different codepoints that look
identical in almost every font, and a highlighting rule keyed to 月 would have
matched none of the organ characters while firing on 期 — inside 保质期, the
best-before date. That is the class of error this data catches and eyeballing does
not.
