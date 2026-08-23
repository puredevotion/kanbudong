import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

/**
 * Kept separate from vite.config.ts's PWA/precache build config on purpose:
 * VitePWA has no business running under jsdom, and this file's only job is
 * component-render smoke testing (see test/*.test.tsx). packages/engine and
 * packages/net stay on their own Node-environment vitest defaults untouched.
 *
 * package.json's "test" script runs this with
 * `NODE_OPTIONS=--no-experimental-webstorage`: modern Node ships its own
 * global `localStorage` (backed by a SQLite file, disabled without
 * `--localstorage-file`), and it shadows jsdom's - vitest's jsdom
 * environment only overrides globals jsdom's own key list expects, so a key
 * Node already defines never gets replaced. Without the flag, every
 * `globalThis.localStorage` access in a test hits Node's stub and throws.
 */
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    include: ['test/**/*.test.{ts,tsx}'],
  },
});
