#!/usr/bin/env bash
# Builds the Dohhh PWA and publishes it to Cloudflare Pages.
# Requires pnpm and two environment variables:
#
#   CLOUDFLARE_API_TOKEN   scoped to "Account / Cloudflare Pages / Edit"
#   CLOUDFLARE_ACCOUNT_ID
#
# A token minted for DNS edits will NOT work - Pages deploys need their own
# permission, and a wrong-scope token fails with a 403 rather than something
# self-explanatory.
#
# The app needs a real certificate to work at all - Trystero derives its relay
# topic through crypto.subtle, which browsers only expose in a secure context -
# and Pages is the cheapest way to get one. See the README.
#
# If you keep these in a secret store, decrypt into the environment rather than
# teaching this script your store. With sops, for example:
#
#   export CLOUDFLARE_API_TOKEN=$(sops -d --extract '["cloudflare"]["api_token"]' path/to/secrets.yaml)

set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$HERE/.." && pwd)"
PROJECT="${PAGES_PROJECT:-kanbudong}"

for var in CLOUDFLARE_API_TOKEN CLOUDFLARE_ACCOUNT_ID; do
  if [[ -z "${!var:-}" ]]; then
    echo "$var is not set; see the header of this script" >&2
    exit 1
  fi
done

echo "==> verifying before publishing"
# A broken build is worse than no build here: friends' phones auto-update to
# whatever is live, so publishing is not a step to take on an unverified tree.
(cd "$ROOT" && pnpm verify)

echo "==> creating the Pages project if it does not exist"
# `project create` is not idempotent, so tolerate the "already exists" failure
# rather than making the caller special-case the first run.
(cd "$ROOT/apps/pwa" && pnpm dlx wrangler@4 pages project create "$PROJECT" \
  --production-branch main 2>/dev/null) || true

echo "==> publishing"
cd "$ROOT/apps/pwa"
pnpm dlx wrangler@4 pages deploy dist --project-name "$PROJECT" --branch main

cat <<'DONE'

Published. Two things before you send the link round:

  * Open it once yourself and check the padlock. The four-word join code and
    the QR scanner both need the secure context; if the URL is http:// or the
    cert is untrusted, peers will not find each other at all.
  * Do not re-run this mid-session. Devices auto-update, and a device on the
    new question pack will refuse to play one still on the old.
DONE
