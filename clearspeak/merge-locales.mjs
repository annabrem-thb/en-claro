import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CORE_LOCALES_DIR = path.join(__dirname, 'src', 'i18n-core', 'locales');
const HOOKS_LOCALES_DIR = path.join(__dirname, 'src', 'hooks');
const LANGUAGES = ['en', 'pl', 'de'];

function mergeDeep(target, source) {
  const result = { ...target };
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = mergeDeep(result[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
}

async function mergeLocales() {
  for (const lang of LANGUAGES) {
    try {
      const corePath = path.join(CORE_LOCALES_DIR, `${lang}.json`);
      const hooksPath = path.join(HOOKS_LOCALES_DIR, `${lang}.json`);

      // Odczyt plików
      const coreContent = await fs.readFile(corePath, 'utf-8');
      const hooksContent = await fs.readFile(hooksPath, 'utf-8');

      const coreJson = JSON.parse(coreContent);
      const hooksJson = JSON.parse(hooksContent);

      // Głębokie scalenie
      const mergedJson = mergeDeep(coreJson, hooksJson);

      // Zapis do głównego pliku w i18n-core
      await fs.writeFile(corePath, JSON.stringify(mergedJson, null, 2), 'utf-8');
      
      console.log(`✅ Pomyślnie scalono i zaktualizowano plik: ${lang}.json`);
    } catch (error) {
      console.error(`❌ Błąd podczas scalania ${lang}:`, error.message);
    }
  }
}

mergeLocales();