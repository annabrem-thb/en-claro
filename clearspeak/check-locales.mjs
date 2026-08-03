import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOCALES_DIR = path.join(__dirname, 'src', 'locales');
const LANGUAGES = ['en', 'pl', 'de'];
const NAMESPACES = ['translation', 'common', 'profile', 'errors', 'feedback', 'survey'];
const BASE_LANG = 'en';

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

async function checkLocales() {
  const dictionaries = {};

  // Load JSON files
  for (const lang of LANGUAGES) {
    // Spłaszczamy obiekt i pobieramy tylko jego klucze
    // Flatten object and retrieve only its keys
    dictionaries[lang] = Object.keys(flattenObject(await loadLanguage(lang)));
  }

  const baseKeys = new Set(dictionaries[BASE_LANG]);
  let hasErrors = false;

  for (const lang of LANGUAGES) {
    if (lang === BASE_LANG) continue;
    
    const targetKeys = new Set(dictionaries[lang]);
    
    const missing = [...baseKeys].filter(key => !targetKeys.has(key));
    if (missing.length > 0) {
      console.error(`❌ Missing keys in ${lang}.json:`, missing);
      hasErrors = true;
    }
  }

  if (!hasErrors) console.log('✅ All JSON files are consistent with the base language!');
}

checkLocales();