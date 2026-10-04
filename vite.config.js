import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import { defaultExclude } from 'vitest/config';

export default defineConfig({
  plugins: [
    react(),
    // Bundle-composition treemap, written to dist/stats.html. Only enabled
    // via `npm run build:analyze` (ANALYZE=true) — it's a one-off inspection
    // tool, not something every CI build should pay to generate.
    globalThis.process?.env?.ANALYZE &&
      visualizer({
        filename: 'dist/stats.html',
        gzipSize: true,
        brotliSize: true,
        template: 'treemap',
      }),
      // 'autoUpdate': a new service worker activates and reloads the page
      // automatically as soon as it's installed, instead of waiting for a
      // user to notice and click a "new version available" banner. That
      // banner only renders once past the intro/consent screens (see
      // App.jsx), so a participant sitting on the study-mode toggle or the
      // consent screen right after a deploy had no way to trigger it —
      // they could silently keep running stale cached code for an entire
      // guided-study session, which is exactly the kind of cross-
      // participant inconsistency an A/B study can't tolerate.
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', '**/*.json'],
      manifest: {
        name: 'En-Claro',
        short_name: 'En-Claro',
        // App UI is multilingual (de/en/pl) with no per-language manifest
        // (browsers don't support that without server-side content
        // negotiation on Accept-Language) — English here reaches the
        // broadest audience rather than defaulting to one target language.
        description: 'Your stress-free space for language exercises.',
        lang: 'en',
        dir: 'ltr',
        theme_color: '#fdfaf6',
        background_color: '#fdfaf6',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: 'logo192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'logo512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
        ],
      },
      workbox: {
        globPatterns: [
          '**/*.{js,css,html,ico,png,svg,json,woff,woff2,mp3,wav,ogg,m4a}',
        ],
        runtimeCaching: [
          {
            // Survey submissions must reach Supabase even if the network drops
            // mid-session; queue and retry instead of losing the response.
            urlPattern: /\/\.netlify\/functions\/submit-survey/,
            handler: 'NetworkOnly',
            method: 'POST',
            options: {
              backgroundSync: {
                name: 'survey-submission-queue',
                options: {
                  maxRetentionTime: 24 * 60, // retry for up to 24 hours
                },
              },
            },
          },
        ],
      },
    }),
  ],
  // The Whisper worker (src/workers/whisperWorker.js) imports
  // @huggingface/transformers, which relies on dynamic ESM imports for its
  // onnxruntime-web backend — incompatible with Vite's default IIFE worker
  // output, and esbuild's dev-server pre-bundler chokes on those same
  // dynamic imports unless the package is excluded from optimizeDeps.
  worker: {
    format: 'es',
  },
  optimizeDeps: {
    exclude: ['@huggingface/transformers'],
  },
  test: {
    environment: 'jsdom',
    globals: true,
    // Playwright specs live in tests-playwright/ and use @playwright/test,
    // not vitest — exclude them so vitest doesn't try (and fail) to collect them.
    exclude: [...defaultExclude, 'tests-playwright/**'],
  },
});
