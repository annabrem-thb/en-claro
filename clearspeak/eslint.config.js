import js from '@eslint/js';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';

export default defineConfig([
  // `.netlify` is Netlify CLI's local dev build/serve cache (already
  // git-ignored, see .gitignore) — generated output, not source, same as
  // `dist`. ESLint 10 apparently auto-ignored dot-directories by default;
  // ESLint 9 does not, so this needs to be explicit or `netlify dev`'s
  // transpiled function bundles get linted as if they were real source
  // files.
  globalIgnores(['dist', '.netlify']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      // `strict` (not `recommended`) per project mandate: catches missing
      // alt text, invalid/misused ARIA roles, non-interactive elements with
      // interactive handlers, and heading-order issues at lint time, before
      // they ever reach the axe-core runtime/E2E layers.
      jsxA11y.flatConfigs.strict,
    ],
    // Narrow, surgical addition (not `react.configs.flat.recommended`,
    // which would pull in a couple dozen unrelated opinionated rules):
    // core `no-unused-vars` under ESLint 9.x stopped recognizing
    // `<SomeComponent />` JSX usage as a "read" of the imported
    // `SomeComponent` identifier — verified by A/B testing this exact repo
    // against ESLint 10.x with a matching @eslint/js, where the same files
    // lint clean. `react/jsx-uses-vars` is the standard, minimal fix: it
    // reports nothing itself, it only marks JSX-tag-referenced imports as
    // used so `no-unused-vars` stops flagging every component actually
    // used exclusively via JSX (which, in this codebase, is most of them).
    plugins: { react },
    rules: {
      'react/jsx-uses-vars': 'error',
    },
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  // AudioWorkletProcessor globals (registerProcessor, sampleRate, ...)
  // aren't part of the standard `browser` global set the block above uses —
  // this file runs in the separate AudioWorkletGlobalScope, not the window.
  {
    files: ['src/workers/recorderWorklet.js'],
    languageOptions: {
      globals: {
        ...globals.worker,
        AudioWorkletProcessor: 'readonly',
        registerProcessor: 'readonly',
        sampleRate: 'readonly',
      },
    },
  },
]);
