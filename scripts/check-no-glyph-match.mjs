#!/usr/bin/env node
// DESIGN.md §3.3.4/§5.5, PLAN.md Phase 5 "Done/verification" and Phase 9's
// "no highlighting/dependency/distractor logic expressed as a substring or
// regex match against a hanzi string": a component highlight, or a span's
// dependency on its component characters, must be keyed off a stored id
// field by exact equality, never off a substring, regex or glyph match
// against a hanzi string - that is exactly the bug that would highlight zero
// of 肝肠肚腰脑肺肾胗 and fire instead on 期 inside 保质期.
// `packages/engine/test/decomposition.test.ts` covers the content layer;
// this covers the render/dependency layers with the grep-based gate the plan
// calls for, kept as a plain script rather than a vitest test so
// `packages/engine` (platform-free, no `@types/node`) never has to import
// `node:fs` to check a sibling package's source.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const CJK = '[⺀-⿟㐀-鿿]';
const stringMatchOnGlyph = new RegExp(`\\.(includes|indexOf)\\(\\s*['"]${CJK}`, 'u');
const regexOnGlyph = new RegExp(`new RegExp\\([^)]*${CJK}|/[^/]*${CJK}[^/]*/[a-z]*\\.test\\(`, 'u');

const targets = [
  {
    path: '../apps/pwa/src/ui/reveal.tsx',
    label: 'reveal.tsx',
    mustContain: 'componentId === decomposition.semantic_radical',
    mustContainMessage:
      'reveal.tsx no longer keys its highlight off the stored componentId field by exact equality',
  },
  {
    // Span eligibility (docs/DESIGN.md §6.1): a multi-character span's
    // dependency on its component characters must resolve through the
    // pack-derived `component_char_ids` ids, never by matching the span's
    // own hanzi string against its components' hanzi strings.
    path: '../packages/engine/src/eligibility.ts',
    label: 'eligibility.ts',
    mustContain: 'ids.every((id) => isIntroduced(id))',
    mustContainMessage:
      'eligibility.ts no longer keys span dependency off stored component_char_ids by exact equality',
  },
];

const problems = [];
for (const { path, label, mustContain, mustContainMessage } of targets) {
  const source = readFileSync(fileURLToPath(new URL(path, import.meta.url)), 'utf8');
  if (stringMatchOnGlyph.test(source)) {
    problems.push(
      `${label} matches a hanzi string with .includes()/.indexOf() to decide a highlight or dependency`,
    );
  }
  if (regexOnGlyph.test(source)) {
    problems.push(`${label} runs a regex against a hanzi/decomposition string to find a component`);
  }
  if (!source.includes(mustContain)) {
    problems.push(mustContainMessage);
  }
}

if (problems.length > 0) {
  for (const p of problems) console.error(`✗ ${p}`);
  process.exit(1);
}
console.log('✓ highlighting and span-dependency logic key off stored id fields only');
