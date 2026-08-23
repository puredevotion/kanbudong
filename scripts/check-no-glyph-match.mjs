#!/usr/bin/env node
// DESIGN.md §3.3.4/§5.5, PLAN.md Phase 5 "Done/verification": a component
// highlight must be keyed off the stored `semantic_radical`/`componentId`
// field by exact equality, never off a substring, regex or glyph match
// against a hanzi string - that is exactly the bug that would highlight zero
// of 肝肠肚腰脑肺肾胗 and fire instead on 期 inside 保质期.
// `packages/engine/test/decomposition.test.ts` covers the content layer;
// this covers the render layer (`apps/pwa/src/ui/reveal.tsx`) with the
// grep-based gate the plan calls for, kept as a plain script rather than a
// vitest test so `packages/engine` (platform-free, no `@types/node`) never
// has to import `node:fs` to check a sibling package's source.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const target = fileURLToPath(new URL('../apps/pwa/src/ui/reveal.tsx', import.meta.url));
const source = readFileSync(target, 'utf8');

const CJK = '[⺀-⿟㐀-鿿]';
const stringMatchOnGlyph = new RegExp(`\\.(includes|indexOf)\\(\\s*['"]${CJK}`, 'u');
const regexOnGlyph = new RegExp(`new RegExp\\([^)]*${CJK}|/[^/]*${CJK}[^/]*/[a-z]*\\.test\\(`, 'u');

const problems = [];
if (stringMatchOnGlyph.test(source)) {
  problems.push('reveal.tsx matches a hanzi string with .includes()/.indexOf() to decide a highlight');
}
if (regexOnGlyph.test(source)) {
  problems.push('reveal.tsx runs a regex against a hanzi/decomposition string to find a component');
}
if (!source.includes('componentId === decomposition.semantic_radical')) {
  problems.push('reveal.tsx no longer keys its highlight off the stored componentId field by exact equality');
}

if (problems.length > 0) {
  for (const p of problems) console.error(`✗ ${p}`);
  process.exit(1);
}
console.log('✓ reveal panel keys component highlighting off stored fields only');
