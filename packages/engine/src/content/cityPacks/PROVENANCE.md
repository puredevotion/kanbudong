# City-pack provenance manifest

DESIGN.md §11.6 correction 4 / §9.3 gate 2: "No pack is built before its
source and licence are in the provenance manifest." This is that manifest
for the two city packs built so far. No such manifest file existed anywhere
in the repo before this one — `docs/DESIGN.md`, `docs/LICENSING.md` and
`docs/PLAN.md` all specify the requirement in prose but none of them, nor
any script under `scripts/`, implemented gate 2's actual check. This file is
the first instance of the convention; a future gate-2 script should read
entries in this shape.

## Shenzhen Metro (`transit-shenzhen`, `packages/engine/src/content/cityPacks/shenzhen.ts`)

| Field | Value |
|---|---|
| Source | Public knowledge of the Shenzhen Metro system map (Lines 1, 2, 3, 4, 5, 7) — general reference knowledge of a public transit network's station names, not a scraped dataset or a single cited document. |
| Licence | Station names are facts (place names/proper nouns) — not a copyrightable expression under any jurisdiction's copyright law, so no licence attaches to the names themselves. This differs from the Wikidata/OSM sourcing DESIGN.md §11.6/§12.1 #14 anticipated for a data-driven pipeline; this pack was hand-authored from confident general knowledge, not pulled from either dataset, because no live network fetch was available in the authoring environment. |
| Confidence | 55 stations. Every entry is one the author (an LLM authoring this content) holds high confidence in as a real, correctly-named, correctly-spelled station on the line stated. Stations recalled with any doubt about exact characters, line assignment, or existence were left out rather than guessed — per this task's instruction that a wrong station name in a "real signage" product is a correctness bug, not a style nit. |
| Date | 2026-08-23. |
| Known gap | Not the ~400-station figure DESIGN.md's §11.6 prose uses — that figure was written against Beijing/Shanghai/Chengdu-scale coverage. Shenzhen's newer lines (6, 8, 9, 10, 11, 12, 14, 16, 20 and later extensions) are entirely excluded: the author has materially lower confidence in station names on lines opened more recently, so none were authored rather than risk unverifiable entries. |
| Distractors | Precomputed, static literal data in `shenzhen.ts` (no runtime generation). Both wrong options per item are themselves real Shenzhen Metro stations from this same 55-station list, preferentially same-line siblings. Every distractor carries an authored `distractorRationale` entry (DESIGN.md §11.6 correction 3 / §9.1). |

## Singapore MRT (`transit-singapore`, `packages/engine/src/content/cityPacks/singapore.ts`)

| Field | Value |
|---|---|
| Source | Public knowledge of the Singapore MRT system (North South, East West, North East, Circle and Downtown Lines) and each station's official Chinese name, as printed on platform signage and rolling stock. |
| Licence | Same reasoning as Shenzhen: station names are facts/proper nouns, not copyrightable expression. Not sourced from Wikidata or OpenStreetMap directly (no live fetch available); both remain the preferred sources named in `docs/LICENSING.md` for any future re-derivation or expansion of this pack. |
| Confidence | 49 stations. Same "leave it out rather than guess" standard as Shenzhen. Several stations the author could not confidently name in Chinese (particularly some West Region East West Line extensions, and several Circle Line stations whose Chinese names the author could not distinguish with confidence from a neighbour's) were deliberately excluded. |
| Date | 2026-08-23. |
| Known gap | Not all six MRT lines are represented (Thomson-East Coast Line and the Bukit Panjang/Sengkang/Punggol LRT systems are entirely excluded) for the same confidence reason. |
| Distractors | Same precomputed/static/authored-`distractorRationale` treatment as Shenzhen, drawn from this same 49-station list, preferentially same-line siblings. |

## Codepoint delta (DESIGN.md §11.6 correction 1 / gate 1)

`scripts/build-fonts.py`'s `bank_characters()` already globs
`packages/engine/src/content/**/*.ts` recursively, so placing these two city
pack files under `packages/engine/src/content/cityPacks/` means the existing
gate-1 script picks their characters up automatically on the next
`pnpm fonts:subset` run — no script change was needed to bring them inside
gate 1's *scope*. What follows is the actual delta for whoever runs that
build next, computed by diffing this pack's CJK codepoints (`U+2E80–U+2FFF`,
`U+3400–U+9FFF`, `U+F900–U+FAFF`, matching `bank_characters()`'s own ranges)
against every other file already in `packages/engine/src/content/`.

**137 codepoints are new** beyond the existing ~316-character bank (the
existing count is measured from the current source tree, not the "1,500
characters" DESIGN.md's §11.6 prose describes as a future target size). All
137 fall inside the ordinary CJK Unified Ideographs block (`U+4E00–U+9FFF`)
that every Noto Sans/Serif SC source file is generated from — none are in
the CJK Extension blocks, CJK Compatibility Ideographs, or CJK Radicals
Supplement, so none are expected to be missing from Noto Sans/Serif SC. This
is a build-time confidence statement, not a substitute for actually running
`pyftsubset` — that must still happen before ship, since "expected to be
covered" is exactly the claim gate 1 exists to verify rather than assume.

```
上下世东丹丽义之乌乐乡佛侨兀兰刹前剧劳北华南印厝厦后园固国圳坊塔塞士多女娜子学宏宝宫少尼展山岗岭岸峇巴布年庙府度廊强惹戍戎拉政文斯新明机村林桃桥梅梧槽欧歌武民沙波泰洛海淡深港湖湾滨燕狮田申界畔皇益碧福科窑立竹索纬纽维罗老耶联节茂荷莱莲葛蔡蛇蜜裕西诺贸达那邦金镇阿顿香鲁麦黄龙
```

Full per-character codepoints are reproducible by re-running the diff this
manifest was generated from:

```python
import glob
def chars_in(paths):
    s = set()
    for p in paths:
        for ch in open(p, encoding='utf-8').read():
            cp = ord(ch)
            if 0x2E80 <= cp <= 0x2FFF or 0x3400 <= cp <= 0x9FFF or 0xF900 <= cp <= 0xFAFF:
                s.add(ch)
    return s
existing = chars_in(p for p in glob.glob('packages/engine/src/content/**/*.ts', recursive=True) if 'cityPacks' not in p)
city = chars_in(glob.glob('packages/engine/src/content/cityPacks/*.ts'))
print(sorted(city - existing, key=ord))
```

## What is NOT in scope of this manifest

Neither pack's *delivery* is built — see the header comment in
`packages/engine/src/content/cityPacks/index.ts` for the full list of what
"downloadable, selected at onboarding" (DESIGN.md §11.6) still needs before
either pack can actually reach a player: a pack registry/selector in
`apps/pwa/src`, ticket-schema support for a non-`SEED_PACK` pack hash, and
splitting `scripts/build-fonts.py`'s font output into a per-pack delta file
rather than one merged subset (today's script still emits one file per face
covering the union, which works but does not yet produce the separately
quotable "~20-40 KB JSON plus ~85 KB font delta" DESIGN.md's §11.6 correction
1 describes per pack).
