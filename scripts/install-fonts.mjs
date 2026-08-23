#!/usr/bin/env node
/**
 * Copy the FULL simplified-Chinese faces into the app's static assets.
 *
 * Deliberately not subsetted. A subset has to be rebuilt every time the item bank
 * gains a character, and the bank is going to gain characters constantly — a
 * build step that breaks when you add a word is a tax on the thing we most want
 * to be cheap. These files cover all 7,946 codepoints in the simplified subset,
 * so any character we ever add just works.
 *
 * Self-hosted rather than linked from the Google Fonts CSS API, because that API
 * returns ~100 unicode-range rules and the browser fetches only the ranges it
 * renders. A service worker can then only cache them on demand, so characters the
 * player has not seen yet would not render offline — which is exactly the
 * situation this app is for. One file per face, precached once, works on a plane.
 *
 * The subsetting path still exists as `pnpm fonts:subset` (scripts/build-fonts.py)
 * if payload ever matters more than convenience. It cuts 3.7 MB to about 210 KB.
 */
import { copyFileSync, mkdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'apps/pwa/public/fonts');
const NM = join(ROOT, 'apps/pwa/node_modules');

const FACES = [
  [
    '@fontsource/noto-sans-sc',
    'noto-sans-sc-chinese-simplified-400-normal.woff2',
    'han-sans-400.woff2',
  ],
  [
    '@fontsource/noto-sans-sc',
    'noto-sans-sc-chinese-simplified-700-normal.woff2',
    'han-sans-700.woff2',
  ],
  [
    '@fontsource/noto-serif-sc',
    'noto-serif-sc-chinese-simplified-700-normal.woff2',
    'han-serif-700.woff2',
  ],
];

mkdirSync(OUT, { recursive: true });
let total = 0;
for (const [pkg, file, out] of FACES) {
  const src = join(NM, pkg, 'files', file);
  const dst = join(OUT, out);
  copyFileSync(src, dst);
  const kb = statSync(dst).size / 1024;
  total += kb;
  console.log(`  ${out.padEnd(20)} ${kb.toFixed(0)} KB`);
}
copyFileSync(join(NM, '@fontsource/noto-sans-sc/LICENSE'), join(OUT, 'OFL.txt'));
console.log(
  `fonts: ${(total / 1024).toFixed(1)} MB, full simplified coverage, precached by the service worker`,
);
