import js from '@eslint/js';
import jsxA11y from 'eslint-plugin-jsx-a11y';
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
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
]);
