# Licensing — what's gated, why, and what changed

`docs/DESIGN.md` §9 ("Content sourcing and licensing") worked out a licensing
position for **看不懂 as a distributed product** — something shipped to an app
store or a public audience under commercial or quasi-commercial assumptions.
This document is the private-use variant: **the user has confirmed 看不懂 is
for private use (self + friends, deployed on a personal Cloudflare Pages URL,
not distributed as a product) and is personally taking ownership of the
licensing position from here.** Where this file says a gate is lifted, that is
this decision, not a re-derivation of the underlying law — see "What private
use does and doesn't change" below before treating everything as clear.

Everything in this file traces back to `docs/DESIGN.md` §9.1–§9.3. Read that
section for the full reasoning; this is the action-oriented summary.

## Gates DESIGN.md held closed, now open by this decision

| Asset                                                                   | License                                                                                                                                                                                     | What DESIGN.md §9.2 forbade                                                                                      | What's now unblocked                                                                                                                                             | Still worth checking                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Make Me a Hanzi** (`dictionary.txt`, decomposition + stroke graphics) | `dictionary.txt`: LGPL-3.0-or-later. Graphics/`hanzi-writer-data`: **Arphic Public License**                                                                                                | Kept out of the build entirely; decompositions hand-authored and only verified against a gitignored scratch copy | May be used directly as a shipped data source for character decomposition and stroke order/animation                                                             | Arphic §2(b) has a "designated place" _publish_ duty if you modify and redistribute the graphics — for a private deploy with no public repo of the modified asset, this is a much smaller ask than DESIGN.md's commercial framing assumed, but it's still a copyleft term, not a permissive one. If the source ever goes in a public GitHub repo, that repo arguably **is** the designated place, and keeping `ARPHICPL.TXT` + a `CHANGES` file alongside the data satisfies it cheaply. |
| **CTW signage-frequency annotations**                                   | CC BY-NC-SA 4.0                                                                                                                                                                             | No `signage_frequency` column ships; internal authoring-order use only; held-out set never published             | May ship a signage-frequency-derived ordering column, and reuse held-out annotated signs as an in-app test set                                                   | The NC term is about _commercial_ use, which is exactly the term this decision is leaning on ("private use") — this is the cleanest of the unblocked items. ShareAlike (SA) still technically wants derivative works alike-licensed if ever redistributed publicly.                                                                                                                                                                                                                      |
| **Frequency lists** (SUBTLEX-CH, Jun Da MTSU, BCC)                      | Mixed/unclear — see DESIGN.md §9.2 for the per-source detail (SUBTLEX-CH is CC BY only via one specific PLoS mirror; Jun Da is research/education-only; BCC has no stated license anywhere) | Do not bundle any of the three; do not quote them in product copy                                                | May use one (or blend) directly to populate `freqRank`                                                                                                           | This is the one you specifically said you'd track. Jun Da's "no commercial grant" term is arguably fine for private use; SUBTLEX-CH's CC BY needs attribution even privately if you ever show anyone the source list. Worth recording _which_ list ended up populating `freqRank` and from where, in case this ever stops being private.                                                                                                                                                 |
| **HSK band / "HSK Level N" in UI**                                      | HSK word/band lists: MIT (via the `elkmovie/hsk30` transcription). The blocker was **trademark**, not the list's license                                                                    | DESIGN.md banned the literal string "HSK", the logo, and "HSK Level N" from UI/store metadata                    | Fine to show "HSK Level N" in a private app's UI — trademark exposure is about public-facing commercial use (store listings, marketing) which doesn't apply here | If this ever gets a public store listing, put this string back behind a flag first.                                                                                                                                                                                                                                                                                                                                                                                                      |
| **City-pack station names**                                             | Wikidata (CC0, clean) vs OpenStreetMap (ODbL, share-alike on the derived database)                                                                                                          | No pack ships until sourced with a provenance manifest entry                                                     | ODbL's share-alike duty is much less consequential for a database that's never redistributed as a database — may use OSM directly for a personal city pack       | If you ever hand a copy of the built pack file to someone else, that's a "distribution" of an ODbL-derived database and share-alike could apply to the pack file itself, not just the app.                                                                                                                                                                                                                                                                                               |

## Not actually unblocked by "private use" — different kind of constraint

These aren't primarily about commercial-vs-private distribution terms, so the
private-use decision doesn't move them on its own:

- **Photographs of real menus/fascias/packages/labels.** The GDPR/PIPL
  concern is about _processing personal data_ (a person's face in frame) and
  _trademark/protected-expression_ in the photographed material, not about
  who you distribute the result to. A private app run only by you doesn't
  need a DPO record, but "no identifiable person in frame" and "strip EXIF/GPS
  at intake" are still just good practice if you ever take these photos
  yourself. Nothing currently in the repo uses real photos — this only
  matters if you start capturing your own reference photography.
- **Forvo audio / CSMSC-derived TTS checkpoints / MagicData.** Forvo's terms
  forbid _durable caching and redistribution_ outright, which an offline PWA
  needs to do to function at all — this doesn't have a private-use carve-out
  in Forvo's own terms. CSMSC/MagicData's non-commercial and ND terms are
  more forgiving for private use, but no audio pipeline exists in the repo
  yet regardless — this is a "when you build it" question, not a currently
  gated one.
- **Tatoeba sentences.** Ruled out primarily because the _register_ is wrong
  (textbook sentences, not signage) — not primarily a licensing call. Still
  not recommended even with licensing off the table.
- **`kMandarin`/`kFrequency`/`kGradeLevel` fields from Unihan.** These were
  excluded for _data-quality_ reasons (deprecated, small 1990s sources), not
  licensing. Still shouldn't be used for pinyin or ordering.

## What private use does and doesn't change, structurally

- **Copyleft terms (LGPL, Arphic, ODbL's share-alike, CC BY-SA)** are
  triggered by _distribution_, and a Cloudflare Pages URL that friends open in
  a browser is a form of distribution, even if it isn't a commercial product.
  "Private use" here is closer to "small, non-commercial, known audience"
  than "never leaves your own machine." That's a reasonable place to accept
  more risk, and it's the basis of this decision — but it is not the same as
  "these licenses no longer apply."
- **Trademark and NC (non-commercial) terms** track commercial use much more
  directly, so the private/non-commercial framing does the most real work on
  the CTW and HSK-string items above.
- **GDPR/PIPL and other personal-data law** track _processing personal data_,
  which doesn't have a "private hobby project" exemption in the way copyleft
  licenses have a "no distribution, no obligation" shape. Nothing in this
  repo currently processes anyone's photo or biometric data, so this is
  dormant, not resolved — revisit if a photography pipeline is ever built.

## What to track going forward

Whichever frequency list, decomposition source, or annotation set actually
gets used, please record **which one, from where, and under what license**
somewhere durable (even just a comment at the top of the content file that
uses it) — DESIGN.md's own §9.3 gate 2 exists because "a column with no
recorded provenance" is exactly the failure mode that turns into a real
problem later, private-use or not.
