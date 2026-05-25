import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Odtworzenie __dirname w ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Tablica z językami, które chcemy zmigrować
const languages = ['pl', 'de', 'en'];

// Ścieżki do folderów na podstawie Twojego kontekstu:
// - Pobieramy dane z: src/i18n/*.js
// - Zapisujemy do: src/i18n-core/locales/*.json (zgodnie z importami w Twoim i18n.js)
const SOURCE_DIR = path.join(__dirname, 'src', 'i18n');
const TARGET_DIR = path.join(__dirname, 'src', 'i18n-core', 'locales');

async function migrate() {
  // Upewnij się, że folder docelowy istnieje
  await fs.mkdir(TARGET_DIR, { recursive: true });

  for (const lang of languages) {
    try {
      // Dynamiczny import plików .js. 
      // Zwróć uwagę, że do importu po ścieżce absolutnej dodajemy "file://"
      const modulePath = `file://${path.join(SOURCE_DIR, `${lang}.js`)}`;
      const module = await import(modulePath);
      const dictionary = module.default;

      // Konwersja do JSON. 
      // JSON.stringify automatycznie pomija funkcje co zapobiega błędom!
      const jsonString = JSON.stringify(dictionary, null, 2);

      const targetPath = path.join(TARGET_DIR, `${lang}.json`);
      await fs.writeFile(targetPath, jsonString, 'utf-8');

      console.log(`✅ Pomyślnie utworzono ${lang}.json w ${TARGET_DIR}`);
    } catch (error) {
      console.error(`❌ Błąd podczas konwersji ${lang}.js:`, error.message);
    }
  }
}

migrate();
