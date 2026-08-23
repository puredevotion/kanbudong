import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  // Relative base so the built app runs from any static host or subpath, which
  // keeps deployment to a plain `cp -r dist/`. Note that the host still has to
  // be a secure context: Trystero hashes the room topic through crypto.subtle,
  // so over plain http:// (or file://) peers never even find each other. See
  // "Getting it onto your friends' phones" in the README.
  base: './',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['apple-touch-icon.png'],
      manifest: {
        name: '看不懂 — read the signs',
        short_name: '看不懂',
        description: 'Learn to read Chinese signs. Co-located multiplayer, no server, no account.',
        theme_color: '#18182b',
        background_color: '#18182b',
        display: 'standalone',
        orientation: 'portrait',
        start_url: './',
        scope: './',
        icons: [
          { src: './icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: './icon-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: './icon-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // The whole game is local-first: the bundle and the question pack are
        // all it needs, so precaching them makes the app genuinely offline
        // capable rather than merely installable. `.wasm` covers
        // fsrs-browser's optimizer - without it, the personal-FSRS-fit path
        // would silently stop working the moment the app goes offline.
        // `.json` covers scripts/build-strokes.mjs's generated stroke data -
        // without it, StrokeOrderPanel would need a live network round trip
        // the first time a player opens it offline.
        globPatterns: ['**/*.{js,css,html,png,svg,woff2,wasm,json}'],
        navigateFallback: 'index.html',
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
      },
    }),
  ],
  build: {
    target: 'es2022',
    sourcemap: true,
  },
});
