// Each language's dictionary now lives in its own module (pl.js/en.js/de.js)
// instead of being merged here — see src/i18n/config.ts for why: only the
// default language and the fallback language need to be in the app's
// critical-path bundle at all, and only Vite-level `import()` on separate
// modules (not a single file merging every language's JSON) gives the
// bundler anything to split into a separate, lazily-fetched chunk.

// Dynamically imports one language's dictionary — for whichever language(s)
// config.ts doesn't need synchronously at boot (currently just German; 'pl'
// and 'en' are imported statically there instead, so they're guaranteed
// present before the first render with no async gap where `t()` would have
// nothing to return — routing them through here too would just make Vite
// bundle them into the same chunk twice, since a module that's both
// statically and dynamically imported can't be split out).
export function loadLanguageDictionary(language) {
  if (language === 'de') return import('./de.js').then((m) => m.default());
  return Promise.reject(new Error(`No lazy loader for language: ${language}`));
}
