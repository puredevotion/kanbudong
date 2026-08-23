#!/usr/bin/env bash
# Fetch the reference data that is not committed. Verification only — none of this
# belongs in the app bundle. See README.md for why each is excluded.
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
OUT="${1:-$HERE/.scratch}"
mkdir -p "$OUT"

echo "==> pinyin-data (MIT) — authoritative pinyin with tone marks"
curl -fsSL -o "$OUT/pinyin.txt" \
  https://raw.githubusercontent.com/mozillazg/pinyin-data/master/pinyin.txt

echo "==> Make Me a Hanzi (LGPL-3.0-or-later) — component decomposition"
echo "    Verification only. Do NOT import into the build; DESIGN.md §9.2 explains."
curl -fsSL -o "$OUT/dictionary.txt" \
  https://raw.githubusercontent.com/skishore/makemeahanzi/master/dictionary.txt

cat <<'NOTE'

Not fetched: a character frequency list.

The copy used during the research carried no licence header and no recorded
provenance, so it is not reproduced here. If you need frequency data, pick a
source with a stated licence and record which one — SUBTLEX-CH and Jun Da's list
are the usual candidates, and DESIGN.md §6.3 notes that two lists both called
"Chinese character frequency" can disagree by five to seven points at rank 1,000
and not even agree on their own top three. Which list you used is part of the
claim.
NOTE
