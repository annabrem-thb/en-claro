// Content QA audit for src/data/vocabulary_{de,en,pl}.js — run via
// `npm run audit:vocabulary`. Complements check-sets.mjs (which only
// validates study-set assignment) and vocabulary.test.js (which validates
// per-item schema shape): this script looks across the whole word database
// for the class of errors those two don't catch — gaps, broken/placeholder
// text, and answer-count anomalies, both within one language and across
// the three.
//
// Content is deliberately NOT parallel/translated across languages (e.g.
// `phonemes` tests each language's own phonics rules with natively-chosen
// words), so a cross-language item-count difference is often correct by
// design, not a bug — those are reported as informational, not as errors
// that fail the run. Only defects that are wrong regardless of language
// design (empty/null fields, leftover placeholder text, broken template
// tokens, duplicate ids) fail the run.
import { wordDatabaseDE } from './src/data/vocabulary_de.js';
import { wordDatabaseEN } from './src/data/vocabulary_en.js';
import { wordDatabasePL } from './src/data/vocabulary_pl.js';

const DATABASES = { de: wordDatabaseDE, en: wordDatabaseEN, pl: wordDatabasePL };
const LANGUAGES = Object.keys(DATABASES);

const PLACEHOLDER_PATTERN =
  /\b(TODO|FIXME|TBD|lorem ipsum|placeholder)\b|x{3,}|\?{3,}/i;
// Vocabulary content is plain prose/words, never interpolated at runtime —
// unlike i18next UI strings, nothing here should ever contain a template
// token. Any of these appearing is either leftover scaffolding from a
// copy-pasted i18next string or a corrupted edit.
const BROKEN_TOKEN_PATTERN = /\{\{|\}\}|\$\{|%s\b|%d\b/;

let hasErrors = false;
const errors = [];
const warnings = [];

function fail(message) {
  errors.push(message);
  hasErrors = true;
}

function warn(message) {
  warnings.push(message);
}

// Walks every string leaf in an item (options[].text, nested hint/question/
// label language maps, etc.) without needing a hand-maintained field list
// per category — the 24 categories' shapes vary too much for that to stay
// accurate, and a generic walk catches a broken field regardless of where
// it's nested.
function walkStrings(value, path, onString) {
  if (typeof value === 'string') {
    onString(value, path);
  } else if (Array.isArray(value)) {
    value.forEach((entry, i) => walkStrings(entry, `${path}[${i}]`, onString));
  } else if (value && typeof value === 'object') {
    for (const [key, entry] of Object.entries(value)) {
      walkStrings(entry, path ? `${path}.${key}` : key, onString);
    }
  }
}

function auditItems() {
  for (const lang of LANGUAGES) {
    for (const [category, items] of Object.entries(DATABASES[lang])) {
      const seenIds = new Set();

      for (const item of items) {
        const loc = `${lang}/${category}#${item.id ?? '?'}`;

        if (item.id === undefined || item.id === null || item.id === '') {
          fail(`${loc}: missing id`);
        } else if (seenIds.has(item.id)) {
          fail(`${lang}/${category}: duplicate id "${item.id}"`);
        } else {
          seenIds.add(item.id);
        }

        for (const [key, fieldValue] of Object.entries(item)) {
          if (fieldValue === null) fail(`${loc} field '${key}': null value`);
        }

        walkStrings(item, '', (str, path) => {
          if (str.trim() === '') {
            fail(`${loc} field '${path}': empty string`);
            return;
          }
          if (PLACEHOLDER_PATTERN.test(str)) {
            fail(`${loc} field '${path}': placeholder text left in content — "${str}"`);
          }
          if (BROKEN_TOKEN_PATTERN.test(str)) {
            fail(`${loc} field '${path}': broken/stray template token — "${str}"`);
          }
        });
      }
    }
  }
}

// Cross-language item-count parity per category — informational: several
// categories are legitimately asymmetric by design (see file header), so
// this is reported for a human to judge, not treated as a hard failure.
function auditCategoryCounts() {
  const allCategories = new Set(LANGUAGES.flatMap((lang) => Object.keys(DATABASES[lang])));
  for (const category of [...allCategories].sort()) {
    const counts = Object.fromEntries(
      LANGUAGES.map((lang) => [lang, (DATABASES[lang][category] || []).length]),
    );
    if (new Set(Object.values(counts)).size > 1) {
      warn(
        `Category '${category}': item count differs across languages (${LANGUAGES.map((l) => `${l}=${counts[l]}`).join(', ')}) — confirm this is intentional (native, non-parallel content), not an unfinished import.`,
      );
    }
  }
}

// Flags items whose `options` array is a different length than the modal
// (most common) length for that category, pooled across all three
// languages — a cheap way to surface a malformed item (e.g. 3 options where
// every sibling item has 4) without hand-coding an expected count per
// category.
function auditOptionCounts() {
  const allCategories = new Set(LANGUAGES.flatMap((lang) => Object.keys(DATABASES[lang])));
  for (const category of allCategories) {
    const lengths = [];
    for (const lang of LANGUAGES) {
      for (const item of DATABASES[lang][category] || []) {
        if (Array.isArray(item.options)) lengths.push(item.options.length);
      }
    }
    if (lengths.length === 0) continue;

    const frequency = lengths.reduce((acc, n) => {
      acc[n] = (acc[n] || 0) + 1;
      return acc;
    }, {});
    const [mode] = Object.entries(frequency).sort((a, b) => b[1] - a[1])[0];
    const modeLength = Number(mode);

    for (const lang of LANGUAGES) {
      for (const item of DATABASES[lang][category] || []) {
        if (Array.isArray(item.options) && item.options.length !== modeLength) {
          warn(
            `${lang}/${category}#${item.id}: has ${item.options.length} answer option(s), most items in this category have ${modeLength}.`,
          );
        }
      }
    }
  }
}

function auditVocabulary() {
  auditItems();
  auditCategoryCounts();
  auditOptionCounts();

  if (warnings.length > 0) {
    console.log(`ℹ️  ${warnings.length} informational finding(s):`);
    warnings.forEach((message) => console.log(`   ${message}`));
  }
  if (errors.length > 0) {
    console.error(`❌ ${errors.length} error(s):`);
    errors.forEach((message) => console.error(`   ${message}`));
  } else {
    console.log('✅ No gaps, duplicate ids, placeholder text, or broken tokens found.');
  }

  process.exitCode = hasErrors ? 1 : 0;
}

auditVocabulary();
