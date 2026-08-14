import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOCALES_DIR = path.join(__dirname, 'src', 'locales');
const LANGUAGES = ['en', 'pl', 'de'];
const NAMESPACES = ['translation', 'common', 'profileDashboard', 'errors', 'feedback', 'survey'];
const BASE_LANG = 'en';
const PLURAL_SUFFIXES = ['zero', 'one', 'two', 'few', 'many', 'other'];

// Function to "flatten" nested objects for easy key comparison, e.g., "a11y.LRS.name"
function flattenObject(obj, parentPrefix = '', result = {}) {
  for (const key in obj) {
    const propName = parentPrefix ? `${parentPrefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      flattenObject(obj[key], propName, result);
    } else {
      result[propName] = obj[key];
    }
  }
  return result;
}

async function loadLanguage(lang) {
  const merged = {};
  for (const ns of NAMESPACES) {
    const filePath = path.join(LOCALES_DIR, lang, `${ns}.json`);
    try {
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const json = JSON.parse(fileContent);
      if (ns === 'translation') {
        Object.assign(merged, json);
      } else {
        merged[ns] = json;
      }
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
      // Namespace file doesn't exist for this language — treated as fully missing below.
    }
  }
  return merged;
}

// i18next resolves a plural key ("exercisesCount") into locale-specific
// suffixed forms ("exercisesCount_one", "_few", "_many", ...). Which suffixes
// are actually reachable is a property of the *target* language's CLDR plural
// rules, not the base language's — e.g. Polish integers only ever resolve to
// one/few/many, never other (that category exists in CLDR only for
// non-integer quantities, which this app never passes as a count). Assuming
// every language needs the same suffix set as the base language is exactly
// the bug: it makes correctly-pluralised Polish look incomplete. Instead,
// probe each language's Intl.PluralRules across a range of real integers to
// find the suffixes it can actually produce, and only require those.
function pluralBaseKey(key) {
  for (const suffix of PLURAL_SUFFIXES) {
    if (key.endsWith(`_${suffix}`)) {
      return key.slice(0, -(suffix.length + 1));
    }
  }
  return null;
}

function requiredPluralSuffixes(lang) {
  const rules = new Intl.PluralRules(lang, { type: 'cardinal' });
  const suffixes = new Set();
  for (let n = 0; n <= 200; n++) suffixes.add(rules.select(n));
  return suffixes;
}

async function checkLocales() {
  const dictionaries = {};
  const flatByLang = {};

  for (const lang of LANGUAGES) {
    const flat = flattenObject(await loadLanguage(lang));
    flatByLang[lang] = flat;
    dictionaries[lang] = Object.keys(flat);
  }

  const baseKeys = new Set(dictionaries[BASE_LANG]);
  const basePluralBases = new Set(
    [...baseKeys].map(pluralBaseKey).filter(Boolean),
  );
  let hasErrors = false;

  for (const lang of LANGUAGES) {
    if (lang === BASE_LANG) continue;

    const targetKeys = new Set(dictionaries[lang]);
    const required = requiredPluralSuffixes(lang);

    const missing = [...baseKeys].filter((key) => {
      if (targetKeys.has(key)) return false;
      const base = pluralBaseKey(key);
      if (base && basePluralBases.has(base)) {
        // Plural-suffixed key: only a real gap if this language's own CLDR
        // rules actually need this suffix for integer counts.
        const suffix = key.slice(base.length + 1);
        return required.has(suffix);
      }
      return true;
    });

    if (missing.length > 0) {
      console.error(`❌ Missing keys in ${lang}.json:`, missing);
      hasErrors = true;
    }
  }

  if (!hasErrors) console.log('✅ All JSON files are consistent with the base language!');
  process.exitCode = hasErrors ? 1 : 0;
}

checkLocales();
