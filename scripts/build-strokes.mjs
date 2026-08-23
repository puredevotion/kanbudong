#!/usr/bin/env node
/**
 * Extract hanzi-writer stroke/median data for exactly the characters the item
 * bank uses, from the gitignored Make Me a Hanzi scratch copy
 * (docs/research/corpus/fetch.sh's `graphics.txt`, Arphic Public License).
 *
 * Not the full ~9,000-character dataset - only the characters that appear in
 * packages/engine/src/content/**\/*.ts, so this stays small and grows
 * automatically as the bank grows rather than needing manual re-generation
 * for new content.
 *
 * The scratch file is a verification-only fetch (see fetch.sh), so a fresh
 * checkout won't have it yet - this prints a warning and produces no output
 * rather than failing the build, matching every reveal panel's own
 * "render nothing rather than error when data is missing" convention.
 *
 * docs/LICENSING.md's table row on Make Me a Hanzi's stroke graphics: Arphic
 * §2(b) has a "designated place" republish duty for a modified redistribution
 * of the Font, satisfied by shipping ARPHICPL.TXT plus a CHANGES file
 * alongside the data - both copied into the output directory here, verbatim,
 * every run.
 */
import { copyFileSync, existsSync, globSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const GRAPHICS = join(ROOT, 'docs/research/corpus/.scratch/graphics.txt');
const OUT = join(ROOT, 'apps/pwa/public/strokes');
const CJK_RANGES = [
  [0x2e80, 0x2fff],
  [0x3400, 0x9fff],
  [0xf900, 0xfaff],
];

function isCjk(codePoint) {
  return CJK_RANGES.some(([lo, hi]) => codePoint >= lo && codePoint <= hi);
}

function bankCharacters() {
  const chars = new Set();
  const files = globSync(join(ROOT, 'packages/engine/src/content/**/*.ts'));
  for (const file of files) {
    for (const ch of readFileSync(file, 'utf8')) {
      if (isCjk(ch.codePointAt(0))) chars.add(ch);
    }
  }
  return chars;
}

function main() {
  const need = bankCharacters();
  console.log(`bank needs stroke data for up to ${need.size} CJK characters`);

  if (!existsSync(GRAPHICS)) {
    console.warn(
      '  no docs/research/corpus/.scratch/graphics.txt - run docs/research/corpus/fetch.sh ' +
        'first. Skipping: the stroke-order panel will render as absent for every character ' +
        'until this is generated.',
    );
    return;
  }

  const found = {};
  for (const line of readFileSync(GRAPHICS, 'utf8').split('\n')) {
    if (line.trim() === '') continue;
    const entry = JSON.parse(line);
    if (!need.has(entry.character)) continue;
    found[entry.character] = { strokes: entry.strokes, medians: entry.medians };
  }

  const missing = [...need].filter((c) => found[c] === undefined);

  mkdirSync(OUT, { recursive: true });
  writeFileSync(join(OUT, 'data.json'), JSON.stringify(found));
  copyFileSync(join(ROOT, 'docs/licenses/ARPHICPL.TXT'), join(OUT, 'ARPHICPL.TXT'));
  copyFileSync(join(ROOT, 'docs/licenses/hanzi-strokes-CHANGES.md'), join(OUT, 'CHANGES.md'));

  const kb = Buffer.byteLength(JSON.stringify(found)) / 1024;
  console.log(
    `  strokes: ${Object.keys(found).length}/${need.size} characters covered, ${kb.toFixed(1)} KB`,
  );
  if (missing.length > 0) {
    console.log(
      `  no stroke data for ${missing.length} character(s) (not in Make Me a Hanzi's set): ${missing.join('')}`,
    );
  }
}

main();
