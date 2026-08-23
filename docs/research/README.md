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
| `passes/` | All 23 documents the writing agents produced — every draft, every adversarial review, every revision. |
| `corpus/` | Reference data for verifying content, and a fetch script for what could not be committed. |

## `passes/` — the drafts and the reviews

The design document is the last of several passes, and the ones before it are
often more useful than the last when you want to know *why* something reads the
way it does.

Files are named for their place in the pipeline. `draft-` is a first write,
`REVIEW-of-` is an adversary attacking that draft's reasoning, `revised-` is the
result. `VERIFIED-` marks the curriculum passes, which additionally had every
Chinese string checked against the corpus data by script.

**The reviews are the part worth reading.** They attack the step from finding to
recommendation, not the evidence, and they land hits the document then absorbs
silently — a recommendation that does not follow from its citation, a lab result
applied to months of learning, a number presented as derived when nothing supports
it, a ruling bent to rescue a decision that was already built. Where a review
argues something the document does not reflect, the review is not necessarily
wrong; it may just have been overruled without comment.

Two known gaps, recorded rather than hidden. `01-sweeps--synthesis-superseded.md`
is the first synthesis, kept only because it shows what the pipeline produced
before the conclusions workflow replaced it.
`03-sections-1-8--draft-section-8-truncated.md` is what survived when a writing
agent split its output across turns and only the final message was captured —
sections 5 to 7 were lost there and rewritten from scratch in `04-`.

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
