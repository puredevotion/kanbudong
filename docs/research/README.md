# The research behind the design

[`../DESIGN.md`](../DESIGN.md) is a condensation. This directory is what it was
condensed from, kept so that any ruling in the document can be traced back to the
evidence — or challenged with it.

| File | What it holds |
| --- | --- |
| `findings.json` | 322 findings from 11 literature sweeps, plus 104 the adversarial reviewers added themselves. Each carries its evidence grade, scope, sources and the design implication it licenses. |
| `corrections.json` | 160 corrections. Each names the original claim, what was wrong with it, the corrected version and the re-graded strength. |
| `digests.json` | The four cluster digests the document was actually written from — settled claims, contested questions, myths, directives, and rulings on the five design decisions. |
| `SOURCES.md` | Every source cited: 574 unique URLs with citation and access level. |

## How much of this reached the document

Honestly: the conclusions did, the trail mostly did not.

- **426 claims** went into the digest step; **240** came out as discrete claims.
  The rest were merged into the 133 directives rather than dropped.
- **574 source URLs** are cited across the research; about **46** appear inline in
  `DESIGN.md` — the ones carrying a ruling.

So a claim in the design document is not the whole of what is known about it. If a
section reads thin, look here before assuming the research was thin.

## Reading the grades

`strong` means replicated or meta-analytic. `moderate` is a solid single study or
a consistent set. `weak` is one small study. `contested` means the literature
genuinely disagrees and the document must say so. **`folklore` means widely
repeated and not supported** — 67 claims ended there, and they are listed in
`DESIGN.md` §1 under *what we will not build on*. Perceptual disfluency as a
learning aid is the one that most nearly shipped.

Memory findings additionally carry `material_type`. **`lab-wordlist` means the
effect was shown on word lists in a laboratory, often at short retention
intervals.** Whether that transfers to learning Chinese over months is usually
unknown, and the reviewers were told to flag every case where a brief presented a
lab result as though it were settled for real learning. Read that field before
leaning on a memory claim.

## Provenance

Two research workflows and one synthesis workflow, 23 agents, no failures. Every
sweep was written by one agent and then attacked by a second whose brief was to
refute it, verify its sources, and research whatever it missed. The critics
rewrote or downgraded 160 claims and contributed 104 of their own, so roughly a
third of the evidence base here came from the adversarial pass rather than the
original sweeps.

Searches were run against Google Scholar, Semantic Scholar, arXiv, PsyArXiv, the
ACL Anthology, the ACM Digital Library, ERIC, PubMed Central and the ISCA archive.
Shadow libraries were not used; where a paper was paywalled the agents looked for
an author preprint or an institutional copy, and where only an abstract was
reachable they marked it `abstract-only` rather than inferring the result.
