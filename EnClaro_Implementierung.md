# EnClaro — Technische Beschreibung der Implementierung

> Grundlage: Vollständige Analyse des Repositories `dyslexia-pwa` (Arbeitstitel im Code: **„clearspeak"**, Produktname: **„EnClaro"**, `package.json:2`). Alle Aussagen sind aus dem Quellcode verifiziert und mit Dateipfad (ggf. Zeilennummer) belegt. Wo der Code keine eindeutige Aussage zulässt, ist dies explizit als **UNKLAR** gekennzeichnet. Es werden an keiner Stelle Inhalte aus `.env`-Dateien, Schlüssel oder Passwörter wiedergegeben — nur Variablen*namen*.

---

## 1. Tech-Stack

Quelle: `package.json`. Es handelt sich um eine reine Client-Anwendung (React/Vite-SPA) mit einer einzigen serverseitigen Komponente (eine Netlify Function, siehe Abschnitt 5).

### Kernframework & Build

| Paket | Version | Zweck |
|---|---|---|
| `react`, `react-dom` | ^19.2.6 | UI-Framework; funktionale Komponenten mit Hooks, kein Klassen-basierter Code beobachtet. |
| `vite` | ^8.0.12 | Dev-Server und Produktions-Build-Tool (ESM-basiert, `vite.config.js`). |
| `@vitejs/plugin-react` | ^6.0.1 | React-Fast-Refresh/JSX-Transform für Vite. |

Es wird **keine** Zustandsverwaltungsbibliothek (Redux, Zustand, MobX o. ä.) eingesetzt; globaler Zustand läuft ausschließlich über React-`Context` (`src/components/GamificationContext.jsx`, `StudyModeContext.jsx`, `UserSettingsContext.jsx`) in Kombination mit `localStorage`/`IndexedDB`-Persistenz in den zugehörigen Hooks.

### Styling

| Paket | Version | Zweck |
|---|---|---|
| `tailwindcss` | ^4.3.0 | Utility-First-CSS; **CSS-natives** Tailwind-v4-Setup ohne `tailwind.config.js` — Konfiguration liegt direkt in `src/styles/index.css` (`@import 'tailwindcss'`, `:root`-Custom-Properties). |
| `@tailwindcss/postcss` | ^4.3.0 | PostCSS-Plugin für Tailwind v4 (`postcss.config.js`). |
| `tw-animate-css` | ^1.4.0 | Liefert die `animate-in`/`fade-in`/`zoom-in`/`slide-in-from-*`-Utilities, die in der gesamten App für Übergänge genutzt werden (`src/styles/index.css:3-9`) — in Tailwind v4 Core nicht mehr enthalten. |
| `autoprefixer` | ^10.5.0 | Automatische Vendor-Prefixe. |
| `postcss` | ^8.5.15 | CSS-Transformation. |

### Internationalisierung

| Paket | Version | Zweck |
|---|---|---|
| `i18next` | ^26.2.0 | Übersetzungs-Engine. |
| `react-i18next` | ^17.0.8 | React-Bindings für i18next. |

### PWA / Offline

| Paket | Version | Zweck |
|---|---|---|
| `vite-plugin-pwa` | ^1.3.0 | Generiert Web-App-Manifest und Service Worker (Workbox-basiert) zur Build-Zeit; siehe Abschnitt 3. |

### Sprache/Audio

| Paket | Version | Zweck |
|---|---|---|
| `mespeak` | ^2.0.2 | Regelbasierte (eSpeak-Formant-)Sprachsynthese als lokaler TTS-Fallback (`src/workers/ttsWorker.js`), gepatcht via `patches/mespeak+2.0.2.patch` (`patch-package`, `postinstall`-Skript in `package.json:7`). |
| `@huggingface/transformers` | ^4.2.0 | On-Device-Ausführung eines Whisper-Modells (Spracherkennung) im Web Worker (`src/workers/whisperWorker.js`) via Transformers.js/ONNX Runtime Web. |

### Sonstige Laufzeit-Abhängigkeiten

| Paket | Version | Zweck |
|---|---|---|
| `@floating-ui/react` | ^0.27.20 | Positionierung von Overlays **und** Fokus-Management/-Trap für alle Dialoge (`FloatingFocusManager` in `src/components/common/Dialog.jsx`). |
| `lottie-react` | ^2.4.1 | Wiedergabe von Lottie-Animationen (`src/components/LottieAnimation.jsx`). |

### Entwicklung, Qualitätssicherung, Tests

| Paket | Version | Zweck |
|---|---|---|
| `typescript` | ^6.0.3 | Nur Typprüfung (`tsc --noEmit`, `tsconfig.json`); `allowJs: true`, `checkJs: false` — JS-Dateien werden **nicht** typgeprüft, nur die wenigen `.ts`/`.tsx`-Dateien (`src/i18n/config.ts`, `src/components/SurveyComponent.tsx`, `public/survey.ts`, `src/locales/locales.test.ts`). Kompilierung übernimmt ausschließlich Vite/esbuild. |
| `eslint` `^9.39.5` + `@eslint/js` | — | Linting, Flat-Config (`eslint.config.js`). |
| `eslint-plugin-jsx-a11y` | ^6.10.2 | **`strict`**-Regelsatz (nicht `recommended`) — „per project mandate" (`eslint.config.js:23-27`): erzwingt u. a. Alt-Texte, korrekte ARIA-Rollen, Heading-Reihenfolge bereits zur Lint-Zeit. |
| `eslint-plugin-react-hooks`, `eslint-plugin-react`, `eslint-plugin-react-refresh` | — | React-spezifische Lint-Regeln. |
| `vitest` | ^4.1.7 | Unit-/Komponententests (`jsdom`-Umgebung, `vite.config.js:83-89`). |
| `@testing-library/react`, `@testing-library/dom`, `@testing-library/jest-dom` | — | Komponententest-Utilities. |
| `@playwright/test` | ^1.60.0 | End-to-End-Tests (`playwright.config.js`, `tests-playwright/`). |
| `@axe-core/playwright`, `axe-core` | ^4.12.1 / ^4.13.0 | Automatisierte WCAG-Scans in E2E-Tests. |
| `knip` | ^6.32.0 | Erkennung ungenutzten Codes/toter Abhängigkeiten (`npm run lint:knip`, Konfiguration `knip.json` ist aktuell leer `{}`). |
| `prettier` + `prettier-plugin-tailwindcss` + `@trivago/prettier-plugin-sort-imports` + `lint-staged` | — | Codeformatierung inkl. automatischer Tailwind-Klassen- und Import-Sortierung; via Git-Hook optional aktivierbar (`.githooks`, README). |
| `patch-package` | ^8.0.1 | Wendet `patches/mespeak+2.0.2.patch` nach `npm install` an. |
| `rollup-plugin-visualizer` | ^7.0.1 | Bundle-Treemap (`dist/stats.html`), nur bei `npm run build:analyze` (`ANALYZE=true`) aktiv (`vite.config.js:10-19`). |

### Browser-Unterstützung

`browserslist` in `package.json:76-87`: Produktion `>0.2%, not dead, not op_mini all`; Entwicklung jeweils die letzte Chrome-/Firefox-/Safari-Version.

### Backend (isoliert, siehe Abschnitt 5)

`netlify/functions/submit-survey/package.json:13-15` führt eine **eigene** Dependency `@supabase/supabase-js` (^2.106.1) — bewusst getrennt vom Haupt-Bundle gehalten (Kommentar `netlify.toml:24-27`), damit dieser Server-Code nicht ins Frontend-Bundle gelangt. Im Root-`package.json` ist `@supabase/supabase-js` **nicht** gelistet; das Frontend besitzt keinen eigenen Supabase-Client (verifiziert per Volltextsuche über `src/` und `public/` — kein Treffer für „supabase" außerhalb eines Kommentars in `src/components/SurveyComponent.tsx:190`).

---

## 2. Projektstruktur

Verzeichnisbaum (2 Ebenen, projektrelevante Verzeichnisse; `node_modules/`, `.git/`, Build-Artefakte wie `dist/`, `.netlify/`, `test-results/`, `playwright-report/` ausgeklammert):

```
.
├── audit-vocabulary.mjs       # manuelles QA-Skript: Übungsdaten-Vollständigkeit/-Integrität (nicht in CI)
├── check-locales.mjs          # CI-Skript: Übersetzungs-Schlüssel-Vollständigkeit
├── check-sets.mjs             # manuelles Skript: Konsistenz der A/B-Content-Sets über Sprachen (nicht in CI)
├── eslint.config.js
├── index.html                 # Vite-Einstiegspunkt
├── knip.json
├── netlify.toml
├── package.json
├── playwright.config.js
├── postcss.config.js
├── scripts/
│   ├── export-survey-data.js   # manueller CSV-Export der Supabase-Umfragedaten (bis vor Kurzem: export-netlify-forms.js — siehe Abschnitt 12)
│   └── export-survey-workflow.yml.example
├── src/
│   ├── components/
│   │   ├── common/             # geteilte UI-Bausteine (Dialog, TTS, BionicText, ThemeSwitcher, …)
│   │   ├── exercises/          # eine Komponente je Übungstyp (19 Dateien)
│   │   ├── App.jsx             # zentrale Orchestrierung: Session, Navigation, Provider-Verkabelung
│   │   ├── GamificationContext.jsx / StudyModeContext.jsx / UserSettingsContext.jsx
│   │   ├── VirtualGarden.jsx, SettingsModal.jsx, SurveyComponent.tsx, IntroScreen.jsx, AchievementToast.jsx, …
│   ├── data/                   # Vokabular-/Übungsdatenbanken je Sprache, Themes, Exercise-Registry, achievements.js (Badge-Registry)
│   ├── hooks/                  # 26 Custom Hooks (Zustand, TTS/STT, IndexedDB, Gamification, Study Mode, Achievements, …)
│   ├── i18n/
│   │   └── config.ts           # i18next-Initialisierung
│   ├── locales/                # Übersetzungs-JSON je Sprache (de/, en/, pl/) + Merge-Module
│   ├── styles/                 # index.css (Tailwind-Einstieg, Design-Tokens), a11y.css (data-a11y-*-Regeln)
│   ├── utils/                  # IndexedDB-Wrapper, Kontrastprüfung, Voice-Utilities, Studien-Overrides (`studyOverrides.js`), …
│   ├── workers/                # Web Worker: whisperWorker.js, ttsWorker.js; AudioWorklet: recorderWorklet.js
│   └── __tests__/               # repo-weite Invarianten-/Kontrast-Tests
├── netlify/
│   └── functions/submit-survey/  # einzige serverseitige Funktion (siehe Abschnitt 5)
├── supabase/
│   └── 00_survey_schema.sql    # SQL-Schema + RLS-Policies für die Studien-Tabelle
├── public/                     # statische Assets, Icons, survey.ts (TS-Typen)
├── tests-playwright/           # E2E- und Accessibility-Suiten
└── .github/workflows/ci.yml    # CI-Pipeline
```

**Hinweis:** Das README (`README.md:75/189/303`) referenziert ein Verzeichnis `docs/` mit Entwicklungsnotizen; dieses existiert im aktuellen Arbeitsstand **nicht mehr** (`ls docs` → „No such file or directory"). Laut Git-Historie wurden Dateien wie `docs/COMPLIANCE_AUDIT.md`, `docs/bundle-size.md` und `docs/screen-reader-walkthrough.md` zu einem früheren Zeitpunkt gelöscht; mehrere Codekommentare verweisen weiterhin auf sie (z. B. `tests-playwright/accessibility.spec.js:9`, `App.jsx`-Kommentar zu `docs/bundle-size.md`). Das ist als offener Punkt in Abschnitt „Technische Schulden" vermerkt.

---

## 3. PWA

### Web App Manifest

Es existiert **keine statische** `.webmanifest`-Datei im Repository; das Manifest wird zur Build-Zeit von `vite-plugin-pwa` aus der Konfiguration in `vite.config.js:20-47` generiert.

| Feld | Wert | Quelle |
|---|---|---|
| `name` / `short_name` | `EnClaro` | `vite.config.js:24-25` |
| `description` | „Your stress-free space for language exercises." (Englisch) | `vite.config.js:30` |
| `lang` / `dir` | `en` / `ltr` | `vite.config.js:31-32` |
| `theme_color` / `background_color` | `#fdfaf6` | `vite.config.js:33-34` |
| `display` | `standalone` | `vite.config.js:35` |
| `orientation` | `portrait` | `vite.config.js:36` |
| `start_url` / `scope` | `/` | `vite.config.js:37-38` |
| `icons` | 192×192 und 512×512 PNG, jeweils `purpose: 'any'` | `vite.config.js:39-52` |

`description` war ursprünglich hartkodiert Polnisch, unabhängig von der tatsächlich gewählten App-Sprache; `lang`/`dir` fehlten ganz, sodass `vite-plugin-pwa` mangels Angabe intern `lang: "en"` einsetzte (verifiziert im gebauten `dist/manifest.webmanifest`) — eine Inkonsistenz (englisches `lang`-Feld, polnische `description`). Da ein einzelnes statisches Manifest technisch keine Sprache „des jeweiligen Nutzers" abbilden kann (das würde serverseitige Content-Negotiation nach `Accept-Language` erfordern, die hier nicht existiert), wurde als Kompromiss ein sprachneutraler, englischer Text gewählt — erreicht das breiteste Publikum, statt eine der drei UI-Sprachen zu bevorzugen. Aus demselben Grund wurden die Meta-Tags in `index.html` (`description`, `og:description`, `twitter:description`, jeweils dreifach identisch, `index.html:7-9, 17-19, 26-28`) von Polnisch auf denselben englischen Text umgestellt.

`includeAssets: ['favicon.ico', 'apple-touch-icon.png', '**/*.json']` (`vite.config.js:22`) bindet zusätzlich diese Dateien ins Precaching ein, unabhängig vom Manifest.

**Anmerkung:** Es ist kein Icon mit `purpose: 'maskable'` definiert (nur `'any'`) — für adaptive Icons auf Android suboptimal, aber nicht install-blockierend.

### Service Worker / Caching-Strategie

Bibliothek: **Workbox**, über `vite-plugin-pwa` (`registerType: 'prompt'`, `vite.config.js:21`) eingebunden.

- **Precaching (App-Shell/Offline-Grundlage):** `workbox.globPatterns` (`vite.config.js:49-51`) cached beim Build alle `.js/.css/.html/.ico/.png/.svg/.json/.woff/.woff2/.mp3/.wav/.ogg/.m4a`-Dateien — also das komplette Vite-Build-Output inkl. Audio-Assets. Dadurch ist die App nach dem ersten Laden vollständig offline nutzbar (kein weiteres `runtimeCaching` für Navigations-/Asset-Requests definiert, d. h. es greift Workbox' Standard-Precache-Antwortverhalten).
- **Runtime-Caching-Regel (die einzige explizit definierte):** POST-Requests an `/\.netlify\/functions\/submit-survey/` (`vite.config.js:55-67`) verwenden den Handler `NetworkOnly` mit einem `backgroundSync`-Plugin (`name: 'survey-submission-queue'`, `maxRetentionTime: 24 * 60` Minuten = 24 h). Damit werden NASA-TLX-/SUS-Umfrage­einsendungen, die offline oder bei Netzwerkfehler nicht durchkommen, in eine Warteschlange gelegt und bis zu 24 h lang automatisch erneut versucht, statt verloren zu gehen — laut Kommentar `vite.config.js:53-55` explizit motiviert durch die Studien-Datenerhebung.
- **Update-UX:** `registerType: 'prompt'` bedeutet **kein automatisches Update** des Service Workers. `src/components/App.jsx` nutzt `useRegisterSW` aus `virtual:pwa-register/react`; `needRefresh` steuert `PwaUpdateBanner.jsx`, das dem Nutzer zwei Aktionen anbietet: „Update" (`updateServiceWorker(true)`) oder „Later" (Banner schließen) — kein erzwungenes Reload.

### Installierbarkeit

- iOS/Safari: `index.html:11-14` setzt `apple-mobile-web-app-title`, `apple-mobile-web-app-capable`, `apple-mobile-web-app-status-bar-style` sowie einen `apple-touch-icon`-Link, da iOS das Web-App-Manifest für die „Zum Home-Bildschirm"-Funktion nur eingeschränkt nutzt.
- Android/Desktop-Chrome: natives `beforeinstallprompt`-Event wird abgefangen und aufgehoben (`src/hooks/useUserSettings.js:148-152`), der Installations-Dialog wird stattdessen über einen **eigenen** Button ausgelöst (`installPwa()`, `useUserSettings.js:167-174`, exponiert als `canInstallPwa`/`installPwa`). Bereits-installiert-Status wird synchron über `window.matchMedia('(display-mode: standalone)')` ermittelt (`useUserSettings.js:94-99`) sowie über das `appinstalled`-Event aktualisiert (`useUserSettings.js:153-156`).
- `index.html:32-44` enthält iOS-spezifisches CSS für „nativeres" App-Verhalten (Unterdrückung von Callout-Menü, Text-Markierung und Overscroll-„Gummiband"-Effekt außerhalb von Eingabefeldern).

---

## 4. Supabase

### Genutzte Dienste

Ausschließlich die **Postgres-Datenbank** über die PostgREST-Schnittstelle (via `@supabase/supabase-js`, ausschließlich serverseitig in `netlify/functions/submit-survey/index.js` und im Wartungsskript `scripts/export-netlify-forms.js`, letzteres über rohe HTTPS-Requests an `${SUPABASE_URL}/rest/v1/...` ohne das SDK). **Supabase Auth und Supabase Storage werden nicht verwendet** — keine entsprechenden Aufrufe im gesamten Repository gefunden. Das Frontend (`src/`) besitzt keinen eigenen Supabase-Client.

### Tabelle & Spalten

Quelle: `supabase/00_survey_schema.sql:5-54`. Einzige Tabelle: `public.ab_study_submissions`.

| Spalte | Typ | Bedeutung |
|---|---|---|
| `id` | `UUID` (PK, `uuid_generate_v4()`) | — |
| `created_at` | `TIMESTAMPTZ`, Default `NOW()` | Server-Zeitstempel des Inserts |
| `app_version` | `TEXT`, `CHECK IN ('basic','gamified')` | A/B-Zweig der jeweiligen Einreichung |
| `participant_id` | `TEXT` | siehe Abschnitt „Personenbezogene Daten" |
| `user_language` | `TEXT` | UI-Sprache zum Zeitpunkt der Einreichung |
| `local_timestamp` | `TIMESTAMPTZ` | client-seitiger Zeitstempel |
| `theme`, `a11y_addons`, `inclusive_options`, `user_difficulty`, `daily_goal` | `TEXT`/`TEXT` (JSON-String)/`SMALLINT` | App-Konfigurationskontext zum Einreichungszeitpunkt. Im geführten Studium wird `adaptiveDifficulty` in `inclusive_options` mit dem *wirksamen* Wert `false` gespeichert (siehe Abschnitt 8), nicht mit der gespeicherten Präferenz. |
| `variant_order` | `TEXT`, nullable | Start-Bedingung des Teilnehmenden (`'classicFirst'`/`'gamifiedFirst'`, d. h. welche Variante Block 1 hatte) — ergänzt in `supabase/00_survey_schema.sql:24`; `NULL`, wenn der Teilnehmende keine Studien-Reihenfolge besitzt. |
| `block` | `SMALLINT` (1 oder 2), nullable | Welchen geführten Block diese Umfrage abschließt (`:25`); `NULL` bei einer manuell geöffneten Umfrage. Zusammen mit `variant_order` lässt sich daraus Bedingung **und** Inhaltsset (Block 1 = Set A, Block 2 = Set B, Abschnitt 8) je Einreichung ableiten. |
| `mental_demand`, `physical_demand`, `temporal_demand`, `performance`, `effort`, `frustration` | `SMALLINT` (0–100, in Schritten von 5) | NASA-Raw-TLX-Werte |
| `sus_q01` … `sus_q10` | `SMALLINT` (1–5) | System-Usability-Scale-Antworten |
| `ueq_q01` … `ueq_q08` | `SMALLINT` (1–7) | UEQ-Short-Antworten (User Experience Questionnaire, bipolare Item-Paare) — seit Kurzem ergänzt (`supabase/00_survey_schema.sql:42-46`); Details siehe Abschnitt 11. |
| `garden_motivation`, `badge_motivation`, `game_distraction` | `SMALLINT` (1–5), nullable | Grywalizations-spezifisches Feedback (Garten-/Abzeichen-Motivation, Ablenkung) — nur bei `app_version = 'gamified'` befüllt, bei `'basic'` bewusst `NULL` (`supabase/00_survey_schema.sql:48-52`). |
| `game_element_feedback` | `TEXT`, nullable | Freitext-Antwort zu Spielelementen, optional, max. 500 Zeichen (serverseitig erzwungen, siehe unten); ebenfalls nur für die gamifizierte Bedingung (`supabase/00_survey_schema.sql:53`). |

Drei auskommentierte Migrationsblöcke dokumentieren nachträgliche Schemaänderungen: `supabase/00_survey_schema.sql:57-74` (`ALTER TABLE ... ADD COLUMN IF NOT EXISTS`) ist eine idempotente Nachrüst-Migration der UEQ-Short-/Grywalizations-Spalten für bereits bestehende Datenbanken, auf die der (nur bei Neuanlage wirksame) `CREATE TABLE IF NOT EXISTS`-Befehl oben keine Wirkung mehr hat; `:76-82` ergänzt analog `variant_order`/`block` — **diese Migration muss vor dem Deployment der zugehörigen Funktionsversion in Supabase ausgeführt werden**, da PostgREST einen Insert mit einer nicht existierenden Spalte ablehnt und damit jede Einreichung mit einem 500 scheitern würde; `:84-91` dokumentiert, dass frühere Schema-Versionen zusätzlich `study_group`/`study_phase`-Spalten aus einem inzwischen entfernten Feature (`useStudyModeState.js`, im aktuellen Code nicht mehr vorhanden) angelegt haben könnten — die App schreibt diese Spalten nicht mehr.

### Row Level Security

RLS ist aktiviert (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY`, `supabase/00_survey_schema.sql:100`) — bewusst **ohne** Policy für `anon`/`authenticated`: Mit aktivem RLS und ohne Policy können diese Rollen weder Zeilen lesen noch schreiben; nur der RLS-umgehende `service_role`-Key hat Zugriff. Frühere Versionen der Datei legten zusätzlich eine öffentliche `SELECT`-Policy („Allow public read access for charts"), eine öffentliche `INSERT`-Policy sowie `GRANT SELECT, INSERT ... TO anon, authenticated` an — Letzteres hätte die rohen Studiendaten für jeden mit der (öffentlichen) Projekt-URL und dem `anon`-Key lesbar gemacht. Alle drei sind entfernt.

Die Datei enthält stattdessen `DROP POLICY IF EXISTS` für beide früheren Policies sowie `REVOKE ALL ON public.ab_study_submissions FROM anon, authenticated` (`:108-110`). Das Löschen der `CREATE POLICY`-Anweisungen aus der Datei ändert eine bereits initialisierte Datenbank nicht — erst das (beliebig oft wiederholbare) Ausführen der Datei bzw. dieser drei Anweisungen im Supabase-SQL-Editor entfernt die Policies dort tatsächlich. **Die Live-Datenbank wurde durch die Dateiänderung nicht angefasst.**

**Faktischer Zugriffsweg in diesem Repository:** Die einzige schreibende Komponente, `netlify/functions/submit-survey/index.js:307-318`, verwendet `SUPABASE_SERVICE_ROLE_KEY`, ebenso das Export-Skript `scripts/export-survey-data.js` (liest per `service_role`) — beide umgehen RLS grundsätzlich. Ein `anon`-Key kommt im Repository nirgends vor (Volltextsuche über `src/`, `netlify/`, `scripts/`, `public/`, `netlify.toml`, `.github/`), das Frontend besitzt keinen Supabase-Client. Die Policy-Entfernung ändert daher nichts am Verhalten dieses Codes; ein **außerhalb** des Repositories liegendes Dashboard, das den `anon`-Key zum Lesen nutzt, würde dagegen nicht mehr funktionieren.

### Personenbezogene Daten

- `participant_id`: eine über `crypto.randomUUID()` (oder ein `Math.random()`-Fallback) clientseitig generierte, in `localStorage` unter `cfg_participant_id` persistierte Zufalls-ID (`src/components/SurveyComponent.tsx:484-491`) — **kein** Klarname, keine E-Mail-Adresse, kein Geräte-Fingerprinting-Dienst. Es besteht kein Bezug zu einem Nutzerkonto (die App hat kein Login/keine Registrierung).
- Weitere gespeicherte Felder sind ausschließlich Konfigurations-/Antwortdaten (Sprache, Theme, aktivierte Barrierefreiheits-Optionen, Schwierigkeitsgrad, NASA-TLX-/SUS-Werte) — keine Klarnamen, keine Kontaktdaten, keine Standortdaten, keine Audio-/biometrischen Rohdaten (siehe Abschnitt 6 zur lokalen, nicht übertragenen Sprachverarbeitung).
- Es werden keine IP-Adressen oder Geräte-Identifikatoren durch die Anwendung selbst geloggt (serverseitig könnte Netlify selbst Request-Metadaten wie IP-Adressen loggen — das liegt außerhalb der Kontrolle dieses Repositories und ist hier nicht verifizierbar → UNKLAR für Netlify-Plattformebene).
- Eingabevalidierung erfolgt serverseitig in `netlify/functions/submit-survey/index.js:169-278` (`validatePayload`): erzwingt Zahlwerte für alle NASA-TLX-/SUS-/UEQ-/Grywalizations-Felder, Strings ≤ 500 Zeichen für Text-Felder, Array-Typ für `a11yAddons`, Objekt-Typ für `inclusiveOptions`, einen **bekannten** `appVersion`-Wert (siehe Abschnitt 11), `variantOrder` ∈ {`classicFirst`, `gamifiedFirst`} und `block` ∈ {1, 2} (ein `block` ohne `variantOrder` wird abgelehnt) — verhindert das Einschleusen beliebiger Payload-Strukturen in die Tabelle.

---

## 5. Netlify

Quelle: `netlify.toml`.

```toml
[build]
  command = "npm run build"
  publish = "dist"
  functions = "netlify/functions"

[dev]
  command = "npm run dev"
  targetPort = 5173
  port = 8888
  publish = "dist"
  functions = "netlify/functions"
  autoLaunch = false

[functions]
  node_bundler = "esbuild"

[[plugins]]
  package = "@netlify/plugin-functions-install-core"
```

- **Build-Befehl:** `npm run build` (→ `vite build`), Publish-Verzeichnis `dist/`.
- **Funktionen:** einzige Funktion unter `netlify/functions/submit-survey/`, gebündelt mit `esbuild`. Das Plugin `@netlify/plugin-functions-install-core` installiert die eigene `package.json` der Funktion während des Netlify-Builds (Kommentar `netlify.toml:24-27` erklärt, dass Netlify Build diese Funktions-eigenen Dependencies sonst nicht automatisch installiert).
- **`[dev]`-Block:** notwendig, damit `/.netlify/functions/*` lokal erreichbar ist — ein reiner `vite`-Dev-Server (Port 5173) kennt diese Route nicht; `netlify dev` (Port 8888) proxyt zu Vite und bedient zusätzlich die Funktion lokal (Kommentar `netlify.toml:6-12`).
- **Redirects:** Es existiert **keine** `[[redirects]]`-Sektion in `netlify.toml` und keine `public/_redirects`-Datei (Dateisuche ergebnislos). Für eine Single-Page-App mit Hash-Routing (siehe Abschnitt 8/Navigation) ist ein History-API-Fallback-Redirect nicht zwingend erforderlich, da alle Routen-Zustände über `#/...`-Fragmente abgebildet werden (`src/hooks/useHashRoute.js`), die serverseitig nie aufgelöst werden müssen.
- **Security-Header:** Es existiert **keine** `[[headers]]`-Sektion in `netlify.toml` und keine `public/_headers`-Datei (Dateisuche ergebnislos). Es werden also keine expliziten Security-Header (CSP, `X-Frame-Options`, `Strict-Transport-Security` etc.) über die Netlify-Konfiguration gesetzt — dies ist ein offener Punkt (siehe „Technische Schulden").

---

## 6. Barrierefreiheit

### ARIA & semantisches Markup

Kein anwendungsspezifisches ARIA-Framework, sondern konsequente Wiederverwendung weniger zentraler Komponenten, die ARIA-Attribute einmal korrekt implementieren:

- **Dialoge:** ausschließlich über `src/components/common/Dialog.jsx`, das `role="dialog"` (via `useRole` aus `@floating-ui/react`), `aria-modal="true"` sowie `aria-labelledby`/`aria-label` setzt (`Dialog.jsx:42-43, 61-63`). Genutzt u. a. von `SettingsModal.jsx`, `SurveyComponent.tsx`, `MicHelpModal.jsx`, `LocalVoiceConsentModal.jsx`, dem Workload-Check-in in `VirtualGarden.jsx:389-395`.
- **Statusmeldungen:** `role="status"` + `aria-live="polite"` für nicht-dringende Rückmeldungen (z. B. `VirtualGarden.jsx:288-290` Bildschirmleser-Live-Region, `LevelUpModal.jsx:27-29`, `SurveyComponent.tsx:303-304` Erfolgs-Bestätigung); `role="alert"`/`aria-live="assertive"` für dringende Updates (z. B. PWA-Update-Banner).
- **Radiogruppen mit Pfeiltasten-Navigation:** z. B. der Workload-Check-in in `VirtualGarden.jsx:415-443` (`role="radiogroup"`, `aria-labelledby`, roving `tabIndex`, Pfeiltasten zyklisch über `handleRatingKeyDown`, `VirtualGarden.jsx:214-226`) sowie die SUS-Bewertungsskalen in `SurveyComponent.tsx:427-453`.
- **Tabs (Settings-Modal):** WAI-ARIA-APG-Tabs-Muster mit roving `tabIndex` — nur der aktive Tab ist im normalen Tab-Fokusfluss, Pfeiltasten/`Home`/`End` wechseln zwischen den vier Tabs „Allgemein", „Barrierefreiheit", „Übungen", „Shop" (`src/components/SettingsModal.jsx:670-703`).
- **`<legend><h2>`-Kombination** auf dem Intro-Screen (`src/components/IntroScreen.jsx:247-256` u. a.): ermöglicht sowohl eine per Screenreader-Überschriftennavigation erreichbare `<h2>` als auch eine korrekte `<fieldset>`-Gruppenbeschriftung — Kommentar begründet dies mit einem axe-core-`aria-allowed-role`-Konflikt bei `role="heading"` direkt auf `<legend>`.
- ESLint erzwingt einen `strict`-jsx-a11y-Regelsatz bereits zur Lint-Zeit (`eslint.config.js:23-27`), zusätzlich automatisierte Laufzeit-Prüfung per `@axe-core/playwright` in `tests-playwright/accessibility.spec.js` gegen `wcag2a/wcag2aa/wcag21a/wcag21aa`-Tags (siehe Abschnitt 12).
- **Statusmeldungen der Umfrage:** Eine fehlgeschlagene Übermittlung war bis vor Kurzem eine reine Sicht-Änderung ohne programmatische Ankündigung (im Gegensatz zur mit `role="status"` versehenen Erfolgsmeldung, `SurveyComponent.tsx:624-631`). Behoben durch `role="alert"` auf dem Fehler-Banner (`:1108`). Ein zweites `role="alert"`-Banner (`:1098`) meldet, dass unbeantwortete Pflichtfragen die Übermittlung blockieren (siehe Abschnitt 11, „Formularverhalten").
- **Pflichtfragen-Semantik der Umfrage:** Die SUS-/UEQ-/Grywalizations-Bewertungen sind echte `role="radiogroup"`-Gruppen mit `aria-required="true"`; nach einem blockierten Absenden tragen unbeantwortete Gruppen zusätzlich `aria-invalid="true"` und einen per `aria-describedby` verknüpften Textfehler („Diese Frage ist noch unbeantwortet.", mit ⚠-Symbol und stärkerem Rahmen, also nicht nur farblich); der Fokus springt auf das erste unbeantwortete Item (`focusItem`, `SurveyComponent.tsx:447-452`). Die NASA-TLX-Regler (`aria-required` ist auf `role=slider` nicht erlaubt) werden stattdessen über eine sichtbare Anleitung („Regler bewegen oder Enter drücken …", `id="nasa-instructions"`, per `aria-describedby` verknüpft) und über `aria-valuetext` = „Noch nicht beantwortet" im unbeantworteten Zustand erklärt. Verifiziert per Live-`axe-core`-Scan im Anfangs- **und** im Fehlerzustand: 0 Verstöße.
- **`<h1>` fehlte unterhalb 1024 px Breite:** Der einzige `<h1>` der App war die Marke „EnClaro" in `SidebarNav.jsx`, in einem `hidden … lg:flex`-Container — auf Telefon-/Tablet-Breite per `display: none` vollständig aus dem Accessibility-Tree entfernt, sodass die meisten mobilen Nutzenden nie eine `<h1>`-Überschrift zum Navigieren hatten. Behoben durch zwei Änderungen: (1) „EnClaro" wurde von `<h1>` zu `<p>` herabgestuft (`SidebarNav.jsx:113`) — es handelt sich um die Wortmarke, nicht um die eigentliche Seitenüberschrift; (2) ein immer vorhandenes, visuell verstecktes `<h1 className="sr-only">` innerhalb von `#main-content` (`App.jsx:906`) zeigt stattdessen den Namen der aktuell aktiven Ansicht — denselben Text, der bereits für `useDocumentTitle` berechnet wird (`documentTitleSegment`, s. o.).

### Tastaturbedienung

`src/hooks/useKeyboardShortcuts.js`, aktiv nur außerhalb fokusgefangener Dialoge (`enabled: !settingsOpen && !showFeedback && !showSuccess && !showBreakModal`, `App.jsx:706`):

- Ohne Modifier: `ArrowRight`/`Enter` → nächste Aufgabe, `ArrowLeft` → vorherige Aufgabe (außer der Fokus liegt auf einem eigenständig interaktiven Element wie Button/Link oder einem lokalen Arrow-Key-Widget, z. B. `role="radio"`/`slider`/`listbox`).
- Mit Strg/Cmd/Alt: `,` → Einstellungen öffnen; `s` → Umfrage öffnen; **`1`/`2`/`3`** → Literacy/Visual/Cognitive-Tab (immer verfügbar); **`4`** → Garten-Tab, aber **nur wenn der Gamification-Modus aktiv ist** (`NUMBER_KEY_TO_PILLAR_INDEX`, `useKeyboardShortcuts.js:3, 97-99`) — die README-Aussage „Ctrl+1–4 shortcuts" (`README.md:23`) differenziert diese Einschränkung nicht.
- **Von einem WCAG-Audit aufgeworfene, bislang nicht behobene Konflikte** (WCAG 2.1.4 Character Key Shortcuts): Strg/Cmd+`1`–`4` kollidiert in Chrome/Firefox/Edge/Safari mit dem browsereigenen „zu Tab N wechseln"-Kürzel und dürfte dort faktisch wirkungslos sein; die modifikatorlosen `ArrowLeft`/`ArrowRight` bergen ein Konfliktrisiko mit dem Lesemodus-Navigationsschema von NVDA/JAWS. Es existiert zudem **keine** Einstellung, um die Tastaturkürzel zu deaktivieren oder umzubelegen.

### Fokus-Management

- Zentraler Fokus-Trap für alle Dialoge über `@floating-ui/react`s `FloatingFocusManager` (`Dialog.jsx:51`) — bewegt den Fokus beim Öffnen in den Dialog und beim Schließen zurück zum auslösenden Element; Escape/Klick-außerhalb über `useDismiss` (`Dialog.jsx:42`).
- „Skip to main content"-Link mit **manueller** Fokussierung von `#main-content` statt Standard-Anker-Verhalten, da der Hash-Router `#main-content` sonst als unbekanntes Routensegment interpretieren und zum Intro-Screen zurückspringen würde (`App.jsx:817-828`); `<main id="main-content" tabIndex={-1}>` ist das programmatisch fokussierbare Ziel (`App.jsx:895-900`).
- Automatischer Erfolgs-Fokus im Umfrage-Formular: nach erfolgreichem Submit wird der Fokus explizit auf die Erfolgsmeldung gesetzt (`successRef.current?.focus()`, `SurveyComponent.tsx:620-622`), da das Formular durch die Bestätigung komplett ersetzt wird.
- **Fokus bei Ansichtswechsel innerhalb der SPA:** Ein WCAG-Audit stellte fest, dass der Hash-Router (`useHashRoute.js`) beim Wechsel zwischen Literacy/Visual/Cognitive/Garden ausschließlich `activeTab`-State synchronisiert, ohne Fokus zu bewegen oder etwas anzukündigen — für Screenreader-Nutzende ein stiller Ansichtswechsel. Behoben durch einen `useEffect` in `App.jsx:311-324`, der bei jeder `activeTab`-Änderung (außer beim allerersten Render, per `isFirstTabRender`-Ref abgefangen) `#main-content` erneut fokussiert; Settings/Umfrage sind bewusst **nicht** in den Effekt-Dependencies enthalten, da deren eigener `FloatingFocusManager`-Trap (siehe oben) sonst mit dieser Refokussierung kollidieren würde.

### Schriftarten

**Es wird keine dedizierte Dyslexie-Schriftart (z. B. eine tatsächliche OpenDyslexic-Schriftdatei) eingebunden.** Die tatsächliche Font-Stack ist eine System-Sans-Serif-Kette (`Helvetica, Arial, Verdana, sans-serif`, `src/styles/index.css`, `font-family`-Deklaration). Der „LRS"/„Friendly Font"-Modus verändert ausschließlich Abstands-Werte — Zeilenhöhe 1.75, Buchstabenabstand 0.08 em, Wortabstand 0.2 em — als Inline-Styles auf `<html>` (`src/hooks/useUserSettings.js:131-146`). Dies wird explizit durch einen Vitest-Test erzwungen: `src/__tests__/productInvariants.test.js:95-106` prüft programmatisch, dass **kein** Stylesheet unter `src/styles/` den String „OpenDyslexic" enthält.

**Diskrepanz:** Die UI-Übersetzungstexte selbst behaupten weiterhin „Friendly font (OpenDyslexic)" (z. B. `src/locales/de/translation.json:113`, analog in `en`/`pl`); ein Codekommentar in `useUserSettings.js:127-130` bestätigt, dass früher tatsächlich eine OpenDyslexic-Schriftdatei genutzt wurde und dies aus einem inzwischen entfallenen Grund (Kompensation der größeren Zeichenbreite von OpenDyslexic durch reduzierte Basisschriftgröße) entfernt wurde. Der Produktname „OpenDyslexic" in der UI ist damit gegenüber dem tatsächlichen Code veraltet.

### Kontrast

`src/utils/contrastChecker.js` implementiert die WCAG-2.1-Formeln für relative Luminanz und Kontrastverhältnis und prüft gleichzeitig gegen AA (4.5:1/3:1) **und** AAA (7:1/4.5:1). Zwei Einsatzorte:
1. **Statisch (immer aktiv):** `src/__tests__/contrastCompliance.test.js` verifiziert die tatsächlichen Farbwerte aus `src/data/themes.js` und `src/styles/index.css` (Light- **und** Dark-Mode-Variante, siehe `@media (prefers-color-scheme: dark)` in `src/styles/index.css:71`) gegen AAA (7:1) für alle fünf Themes.
2. **Laufzeit, nur Entwicklungsmodus:** `src/hooks/useThemeCSSVariables.js:65-78`, geschützt durch `!import.meta.env?.PROD` — loggt bei AAA-Verstoß eine `console.warn`-Meldung; in Produktion inaktiv.

Beide Mechanismen decken nur die zentralen Theme-/Basis-Textfarben ab, nicht jede tatsächlich gerenderte Text-Größe/-Farbe-Kombination einer einzelnen Komponente. Ein Live-`axe-core`-Scan von `SidebarNav.jsx` (außerhalb der sechs von `tests-playwright/accessibility.spec.js` abgedeckten Ansichten, siehe Abschnitt 12) deckte genau diese Lücke auf: drei Farbpaare unter dem AA-Minimum (4.5:1) — gemessen `4.41:1`, `4.17:1` und `3.02:1` — für `text-slate-500`/`text-slate-600` auf dem Sidebar-Hintergrund `#fdfaf6` (betraf das Theme-Label, die vier nicht-ausgewählten Theme-Namen im `ThemeSwitcher` sowie mehrere Pillar-/Survey-/Settings-Beschriftungen). Behoben durch Anhebung um jeweils eine Tailwind-Stufe (`text-slate-600`→`text-slate-700`, `text-slate-500`→`text-slate-600`, `SidebarNav.jsx`, `ThemeSwitcher.jsx:83`) — erneut per Live-`axe-core`-Scan auf `0` Kontrastverstöße verifiziert, sowohl im Normal- als auch im Hochkontrast-Modus.

### Einstellungen (Design-Tokens)

Sechs stufenlos einstellbare CSS-Custom-Properties, verwaltet in `src/hooks/useUserSettings.js` und als Inline-Styles auf `<html>` gesetzt (`useUserSettings.js:112-120`): `--font-size-exercise` (Standard 16 px, Cap 32 px), `--font-size-ui` (16 px, Cap 28 px), `--line-height` (1.5, Cap 2.2), `--letter-spacing` (0 em, Cap 0.24 em), `--word-spacing` (0 em, Cap 0.32 em), `--paragraph-spacing` (0 em, Cap 3.0 em). Boolesche Einstellungen (Kontrast, Motorik, Farbmodus, Bewegungsreduktion, Desaturierung, Minimalismus, …) werden als `data-a11y-<key>="true"`-Attribute auf `<html>` gespiegelt (`useUserSettings.js:103-109`) und dort per CSS-Attributselektor in `src/styles/a11y.css` ausgewertet:

- `[data-a11y-contrast='true']`: grüner 5 px-Fokusring (`a11y.css:13-16`), erzwungene `color: inherit` für `<b>/<strong>`.
- `[data-a11y-motorik='true']`: Mindestgröße 56×56 px für Buttons/Links/Checkboxen/Radios/Selects (`a11y.css:25-33`) — entspricht der im README genannten Motorik-Mindestgröße.
- `[data-a11y-color='true']` („Daltonizm"/Safe Colors): ersetzt Tailwinds grüne/smaragdgrüne/rote Farbpalette durch eine blau/orange-basierte Palette (`a11y.css:41-75`) — kombiniert mit einer zweiten, unabhängigen Farbenblind-sicheren Palette (Wong 2011) für Theme-Akzent-/Erfolgs-/Fehlerfarben in `src/hooks/useThemeCSSVariables.js:8-23`.
- `[data-a11y-motion='true']` („Redukcja"/Calm screen): setzt `animation-duration`/`transition-duration` auf `0.001ms` und `scroll-behavior: auto` (`a11y.css:78-94`) — das ist der CSS-seitige Umsetzungsort der „reduzierten Animation" (siehe unten).
- `[data-a11y-desaturation='true']`: `filter: saturate(0.45)` auf `<html>` (`a11y.css:102-104`).
- `[data-a11y-minimalist='true']`: blendet alle Elemente mit Klasse `.decorative-graphic` aus (`a11y.css:107-109`).

Zusätzlich existiert eine separate `zenMode`-Einstellung (u. a. Unterdrückung von Vibrationsfeedback, siehe unten), die **nicht** über `data-a11y-*`/CSS läuft, sondern direkt an einzelne Komponenten/Hooks durchgereicht wird.

### `prefers-reduced-motion`

Wird **nur beim allerersten App-Start** als Vorbelegung gelesen: `getDefaultSettings()` seedet `motion: window.matchMedia('(prefers-reduced-motion: reduce)').matches` (`useUserSettings.js:70-79`) — sobald der Nutzer den Schalter „Calm screen" einmal manuell setzt, gewinnt dieser gespeicherte Wert bei jedem künftigen Laden. Es gibt **keine** fortlaufend reagierende `@media (prefers-reduced-motion)`-Regel direkt in `a11y.css`/`index.css` (Volltextsuche ergab nur die zwei Treffer in `useUserSettings.js` selbst) — die Bewegungsreduktion läuft stattdessen über das oben beschriebene `data-a11y-motion`-Attribut, nicht über eine live auf OS-Änderungen reagierende Media Query.

### Sprachausgabe (TTS)

Zwei Engines, beide vollständig clientseitig:

1. **Web Speech API** (`SpeechSynthesis`/`SpeechSynthesisUtterance`) als primärer Pfad, `src/hooks/useGlobalTTS.js` — wählt per Heuristik die beste verfügbare Systemstimme für die aktuelle Sprache.
2. **meSpeak** (npm-Paket `mespeak`) als Fallback, läuft im Web Worker `src/workers/ttsWorker.js`, angesteuert über `src/hooks/useLocalTTS.js`. Die Umschaltung erfolgt in `App.jsx`, das prüft, ob der Browser gar keine oder keine passende Systemstimme für die aktuelle Sprache meldet (u. a. relevant für Desktop-Firefox, das keine eigenen Stimmen mitbringt) — betroffene Nutzer sehen zusätzlich `src/components/VoiceFallbackBanner.jsx`. Laut Kommentar (`src/hooks/useLocalTTS.js:10-15`) ersetzte meSpeak ein früheres neuronales VITS-Modell, das 25–90 s Latenz pro Klick hatte; meSpeak liefert unter 1 s bei „klassisch robotisch" klingender Sprache und ca. 4–5 MB statt ca. 110 MB Downloadgröße.

**Sprachassistent im Umfrage-Formular:** `SurveyComponent.tsx` erhält seit Kurzem dieselbe `speak`-Funktion als Prop von `App.jsx` (`App.jsx:1326`, analog zu `IntroScreen`/`SettingsModal`). Bei aktivem `voiceAssistant` (`SurveyComponent.tsx:240`) wird beim Öffnen des Formulars Titel + Kurzbeschreibung vorgelesen (`readIntroAloud`, `:386-397`, gleiches Stagger-Muster wie `SettingsModal.jsx`s `readGeneralTab`), nach jeder NASA-TLX-Regler-Interaktion (bei Loslassen/Enter/Navigationstaste, nicht während des Ziehens, um Sprach-Spam zu vermeiden — `handleNasaCommit`, `:436-445`, verdrahtet über `onMouseUp`/`onTouchEnd`/`onKeyDown`/`onKeyUp`) sowie nach jeder SUS-/UEQ-/Grywalizations-Auswahl (`announce(...)`-Aufrufe in den jeweiligen `onChange`-Handlern) Frage/Item plus gewählter Wert vorgelesen, und beim erfolgreichen Absenden die Erfolgsmeldung (`readSuccessAloud`, `:401-414`). Ein bloßes Landen per Tab auf einem Regler löst weder eine Antwort noch eine Ansage aus (`SLIDER_NAVIGATION_KEYS`, `:49`).

**`aria-valuetext` auf NASA-TLX-/Design-Token-Reglern:** Die Regler (echte `<input type="range">`, native Tastaturbedienung bereits vorher gegeben) hatten zuvor keinen `aria-valuetext`, sodass ein Screenreader nur die nackte Zahl ansagte — verschärft dadurch, dass die Endpunkt-Beschriftungen „Niski"/„Wysoki" per `aria-hidden="true"` explizit unterdrückt waren. Behoben: `aria-hidden` von den Endpunkt-Labels entfernt, stattdessen per `aria-describedby={`${scale.id}-anchors`}` mit dem Regler verknüpft, zusätzlich `aria-valuetext` (`SurveyComponent.tsx:738-775`): `„<Wert> / 100"` bei beantwortetem, „Noch nicht beantwortet" bei unbeantwortetem Regler. Dieselbe Korrektur (`aria-describedby` + `aria-valuetext={`${value}${unit}`}`) auch für die sechs Design-Token-Regler in `SettingsModal.jsx`s `SettingSlider` (`:110-121`).

**Hinweis zu Sprachassistent vs. eigenem Screenreader:** Ein WCAG-Audit wies darauf hin, dass `speak()` und die `aria-live`-Regionen bei Richtig/Falsch-Feedback (`useExerciseSession.js:356-372, 423-431`) sowie beim Umfrage-Erfolg (`SurveyComponent.tsx:414`) auf dasselbe Ereignis reagieren, aber mit **unterschiedlichem** Text — für Nutzende, die gleichzeitig den eigenen Screenreader **und** diesen App-eigenen Sprachassistenten aktiviert haben, potenziell zwei überlappende, widersprüchliche Sprachausgaben. Bislang nicht behoben — siehe „Offene Punkte".

### Spracherkennung / Voice-Input

- **Nativ (bevorzugt):** Web Speech API `SpeechRecognition`/`webkitSpeechRecognition`, nur in Chromium-Browsern verfügbar (`src/utils/voiceCapabilities.js`, `src/hooks/useExerciseVoice.jsx`).
- **Fallback:** ein **on-device** ausgeführtes Whisper-Modell (`onnx-community/whisper-tiny`, mehrsprachig) über `@huggingface/transformers`, ausgeführt im Web Worker `src/workers/whisperWorker.js` mit `device: 'wasm'`. `fp32`-Gewichte statt quantisiert werden aus Kompatibilitätsgründen mit einem onnxruntime-web-Bug erzwungen (Kommentar `whisperWorker.js:33-40`).
- **Keine Übertragung von Audiodaten an einen Server:** Die aufgenommenen Audiodaten (resampled auf 16 kHz) werden per `postMessage` direkt an den lokalen Worker übergeben, der die Erkennung lokal ausführt; es findet sich kein `fetch`/`XMLHttpRequest`-Aufruf mit Audio-Payload. Einzige Netzwerkaktivität ist der einmalige Download der Whisper-Modellgewichte (ca. 150 MB) beim ersten Gebrauch, nicht die eigentliche Audioverarbeitung — im UI explizit kommuniziert (`src/components/common/LocalVoiceConsentModal.jsx`: „It runs entirely on this device — nothing is uploaded.").
- Ein eigener `AudioWorkletProcessor` (`src/workers/recorderWorklet.js`) berechnet block­weise den RMS-Pegel für eine einfache Stille-/Aktivitätserkennung.

### Focus Ruler (Lese-Lineal)

`src/hooks/useReadingRuler.js`: ein der Maus-/Touch-Position folgender horizontaler Positionsindikator (sichtbar nur innerhalb der Textkarte) **plus** eine tastaturgesteuerte Alternative über `ArrowUp`/`ArrowDown` (24-px-Schritte, deaktiviert bei fokussierten Eingabefeldern).

### Haptisches Feedback & Zen-Modus

`src/hooks/useHapticFeedback.js`: dünner Wrapper um `navigator.vibrate(pattern)`, der bei aktivem `zenMode` **komplett unterdrückt** wird (`!zenMode`-Bedingung). Damit ist Zen-Modus die zentrale Stelle, an der nicht-essenzielle sensorische Stimulation (Vibration) abgeschaltet wird — visuelle Toasts (`NewTreeToast`, `AffirmationToast`) sind laut Code **nicht** an `zenMode` gekoppelt, sondern nur an die separate `noFlash`/`motion`-Einstellung (betrifft nur deren Einblend-Animation, nicht ihre grundsätzliche Sichtbarkeit).

---

## 7. Gamification: Logik des virtuellen Gartens

### Zustandsmodell

Der gesamte Gamification-Zustand besteht laut `src/hooks/useGamificationState.js` aus **genau zwei** Werten:

- `growthValue: number` — ein einziger, monoton wachsender Zähler, persistiert in `localStorage['growthValue']` (`useGamificationState.js:21-22, 28-30`). Der zurückgegebene `setGrowthValue` ist ein **gebundener** Setter: er ignoriert Aufrufe, solange `isGamified` falsch ist (`useGamificationState.js:36-42`) — im klassischen Modus bewegt sich der Zähler also nie.
- `isGamified: boolean` — der Basis/Gamification-Modus-Schalter, persistiert in `localStorage['cfg_gamified']` (`useGamificationState.js:24-26, 32-34`).

Ein Vitest-Test erzwingt dies explizit: `src/__tests__/productInvariants.test.js:128-139` prüft, dass `useGamificationState()` **genau ein** numerisches Feld zurückgibt — es existiert also **keine** zweite Münz-/Punkte-Währung neben `growthValue`. Das Bindungsverhalten des Setters (kein Wachstum im klassischen Modus, Wachstum nach Umschalten, erneutes Einfrieren nach Zurückschalten) deckt `src/hooks/useGamificationState.test.js` ab.

### Regeln für Wachstum

- `growthValue` wird **ausschließlich bei korrekt gelösten Aufgaben und nur im gamifizierten Modus** um 1 erhöht: `handleSuccess` (`src/hooks/useExerciseSession.js:373-375`) ruft `setGrowthValue` auf, dessen Setter selbst an `isGamified` gebunden ist (`useGamificationState.js:36-42`) — **nicht** bei Fehlern (`handleError`, `useExerciseSession.js:408-441`) und **nicht** beim Überspringen (`handleSkip`, `App.jsx:533-537`, ruft `notifyUnitCompleted(growthValue, { pointEarned: false })` ohne Zähleränderung). Die Bindung liegt bewusst im State-Hook und nicht in `useExerciseSession.js`, weil ein Invarianten-Test (`productInvariants.test.js:88-93`) verlangt, dass dieser Hook `isGamified` nie referenziert (identischer Übungsablauf in beiden Bedingungen). Der erklärende Kommentar steht in `useGamificationState.js:5-15`. *(Frühere Fassungen dieses Dokuments und des Kommentars behaupteten „nicht beim Überspringen", obwohl `handleSkip` den Zähler bis zu dieser Änderung tatsächlich erhöhte.)*
- Die visuelle Darstellung des Gartens (`src/components/VirtualGarden.jsx:35-84`) leitet aus `growthValue` eine `growthLevel = Math.floor(growthValue / 5)` ab und wählt daraus ein Icon/einen Namen aus einer 5-stufigen, themen- und (optional) pillar-spezifischen Emoji-Reihe (`themeCategoryVisuals`, `VirtualGarden.jsx:38-64`) bzw. aus den i18n-Schlüsseln `levelIcons`/`progressStages`.
- `POINTS_PER_LEVEL = 5` (identisch definiert in `App.jsx:67` und `VirtualGarden.jsx:15`) treibt die Level-Anzeige (`Math.floor(growthValue / 5) + 1`) und die Fortschritts-Pille (`growthValue % 5`).
- Drei **unterschiedliche** Belohnungs-Intervalle auf demselben `growthValue`-Zähler, jeweils eigenständig im Code definiert (keine gemeinsame Konstante):
  - **Level-Up-Modal** alle **5** Punkte (`pointEarned && newGrowthValue % POINTS_PER_LEVEL === 0`, `App.jsx:413`; ein Überspringen löst es nicht erneut aus, auch wenn der Zähler gerade auf einem Vielfachen von 5 steht).
  - **„Neuer Baum"-Toast** alle **10** Punkte (`Math.floor(growthValue / 10) > Math.floor(prevGrowthValue / 10)`, `App.jsx:245-262`), inkl. Vibrationsmuster `[50,50,50]`.
  - **Affirmations-Toast** alle **15** Punkte (`points % 15 === 0`, `src/hooks/useAffirmativeNotifications.js:10-15`), zeigt eine zufällige Ermutigungs-Nachricht.
- Feedback-Texte sind bewusst nüchtern gehalten: `productInvariants.test.js:26-86` erzwingt, dass Erfolgs-/Fehler-Feedback-Strings und „neuer Baum"-Texte **kein** Ausrufezeichen und **kein** Emoji enthalten.

### Tagesziel & Fortschritt (kein Streak-Zähler)

- `dailyProgress` wird über `useIndexedDB('daily_progress', 'date', 'cfg_daily_progress')` verwaltet (`App.jsx:223-227`) und pro abgeschlossener Aufgabe (Erfolg **oder** Skip, nur wenn `isGamified`) um 1 Punkt für den aktuellen Tag erhöht (`handleUnitCompleted`, `App.jsx:401-419`). Ein Skip zählt also zum Tagesziel, aber nicht zum Wachstum des Gartens.
- `WeeklyCalendar.jsx` zeigt die letzten 7 Tage und markiert `isGoalMet = dailyProgress[date]?.points >= dailyGoal` (einstellbares Tagesziel, Standard 5, `useUserSettings.js:56`).
- Es existiert **kein** eigenständiger „Streak"-Zähler (aufeinanderfolgende Zieltage) im Code — eine Suche nach „streak" im gesamten `src`-Verzeichnis findet nur beiläufige Kommentar-Erwähnungen, keine funktionale Implementierung.

### Speicherung des Fortschritts

- `growthValue`, `isGamified`: `localStorage` (siehe oben).
- `dailyProgress`: **IndexedDB**-Datenbank `ContextMasterDB` (Version 1), Objekt-Store `daily_progress` (`keyPath: 'date'`, `src/utils/indexedDB.js:1-36`), mit automatischer einmaliger Migration alter `localStorage`-Daten (`cfg_daily_progress`) beim ersten Laden (`src/hooks/useIndexedDB.js`).
- Jede abgeschlossene Aufgabe wird zusätzlich als Einzeleintrag in den IndexedDB-Store `exercise_history` geschrieben (`{ date, type: <Pillar>, correct: boolean }`, `useExerciseSession.js:385-389, 432-436`) — Grundlage für die „Tages-Zusammenfassung" im Garten (`VirtualGarden.jsx:86-118`) und für die Studien-Datenerhebung (Abschnitt 11).
- Ein dritter IndexedDB-Store, `ux_logs` (`keyPath: 'timestamp'`), wird beim Öffnen der Datenbank angelegt (`src/utils/indexedDB.js:22-23`), aber **an keiner Stelle im Code beschrieben** (Volltextsuche nach „ux_logs" außerhalb dieser Definition ergebnislos) — toter Code (siehe „Technische Schulden").

### Kompetitive Elemente

**Es gibt keine kompetitiven Elemente.** Weder Bestenliste/Leaderboard noch Mehrspieler-/Vergleichsfunktionen noch ein Social-/Freundessystem sind im Code vorhanden (Volltextsuche nach „leaderboard", „ranking", „multiplayer", „compet*" ergab ausschließlich Vokabular-Übungsinhalte, keine App-Funktionalität). Die einzige „Belohnungs-Ökonomie" ist der freie Theme-Wechsel (siehe unten) — kein Münz-/Freischalt-System trotz README-Erwähnung von „Coins" (siehe „Technische Schulden").

### Erfolgsabzeichen (Achievements)

Ergänzend zum kontinuierlichen `growthValue`-Zähler existiert ein zweites, diskretes Gamification-Element: drei permanente Abzeichen, verwaltet in `src/hooks/useAchievements.js` und registriert in `src/data/achievements.js:12-31`.

- **Freischaltbedingungen** (alle nur bei `enabled === true`, d. h. `isGamified`, ausgewertet — `useAchievements.js:45-47`): `firstCorrect` (🌱) bei `growthValue >= 1`; `combo3` (🔥) bei `consecutiveCorrect >= 3` (aus `useExerciseSession.js` exponiert); `gardenVisit` (🏁) beim ersten Besuch des Garten-Tabs (`activeTab === 'Garden'`, als `gardenVisited`-Prop aus `App.jsx:501` übergeben). Laut Code-Kommentar (`src/data/achievements.js:7-11`) sind diese Schwellen bewusst so niedrig gewählt, dass sie **innerhalb eines einzigen kurzen geführten Studienblocks** (8/3/4 Aufgaben, Abschnitt 8) erreichbar sind, nicht erst nach Wochen regulärer Nutzung — explizit für die begleitende Studie motiviert.
- **Erkennungslogik:** Wie beim bereits bestehenden `prevIsGamified`-Muster in `App.jsx` läuft die „hat sich das gerade geändert"-Prüfung während des Renderns, nicht in einem `useEffect` (`useAchievements.js:59-85`) — drei `useState`-Flags (`prevGrowthMet`/`prevComboMet`/`prevGardenMet`), bewusst mit `false` statt dem bereits berechneten Wert initialisiert, damit ein wiederkehrender Nutzer, dessen Zustand schon beim ersten Render alle Bedingungen erfüllt, das Abzeichen trotzdem als „gerade freigeschaltet" angezeigt bekommt (der `tryUnlock`-Dedup-Schutz verhindert dabei ein erneutes Freischalten bereits gespeicherter Abzeichen).
- **Persistenz:** `localStorage['cfg_achievements']`, Array bereits freigeschalteter IDs (`useAchievements.js:6, 40-42, 81`) — dauerhaft, kein Reset.
- **Anzeige:** Ein Toast (`src/components/AchievementToast.jsx`), der 6 s sichtbar bleibt (`TOAST_DURATION_MS`, `useAchievements.js:7, 90-94`), gerendert in `App.jsx:1263-1269`, sowie eine dauerhafte „Abzeichen-Ablage" im Garten (`VirtualGarden.jsx:329-370`): alle drei Abzeichen werden immer angezeigt, gesperrte grau/transparent (`opacity-40 grayscale`), freigeschaltete in Theme-Farbe, mit `role="list"`/`role="listitem"` und einem `aria-label`, das Titel und (je nach Status) Beschreibung oder „gesperrt"-Text kombiniert.
- **Bewusste Entwurfsentscheidung gegen einen Übersetzungs-„Freeze"-Bug:** `useAchievements.js` gibt ausschließlich die Abzeichen-**ID** zurück, nicht bereits über `t()` aufgelösten Text (Kommentar `useAchievements.js:16-25`) — da ein bereits beim allerersten Render erfüllter Zustand vor `App.jsx`s eigenem Sprach-Sync-Effekt (`i18n.changeLanguage(settings.language)`) freischalten kann, würde ein dort einmalig aufgelöster String in der zu diesem Zeitpunkt zufälligen i18next-Standardsprache einfrieren und nie mehr aktualisiert werden. `AchievementToast.jsx` löst Titel/Beschreibung stattdessen bei jedem eigenen Render über eine `t`-Prop auf (analog zu `NewTreeToast.jsx`).

### Theme-„Shop"

`SettingsModal.jsx` besitzt einen vierten Tab „Shop" (nur sichtbar wenn `isGamified`, `SettingsModal.jsx:665-667`), der alle fünf Themes aus `src/data/themes.js` (Natur, Musik, Kunst, Space, Ocean) zur freien, sofortigen Auswahl anbietet (`ShopTab`, `SettingsModal.jsx:508-…`) — es gibt **keinen** Freischalt-Mechanismus, keine Kosten und keine Währung; jedes Theme ist jederzeit wählbar. Derselbe `ThemeSwitcher` ist zusätzlich unabhängig vom Gamification-Modus im Intro-Screen und in der Navigationsleiste verfügbar.

**Theme-Auswahl in `ThemeSwitcher.jsx` (Startbildschirm/Navigationsleiste):** Zeigt statt eines reinen Farbpunkts (`hex`-Feld je Theme) je ein zum Theme passendes Emoji (`icon`-Feld in `src/data/themes.js:28,38,48,58,68` — 🌿/🎵/🎨/🚀/🐳, identisch zu den bereits zuvor in `SettingsModal.jsx`s Shop-Tab genutzten Emojis) — visuell unterscheidbarer als ein reiner Farbunterschied und zusätzlich zur bereits vorhandenen sichtbaren Textbeschriftung (siehe Abschnitt „ARIA & semantisches Markup").

---

## 8. A/B-Varianten: Umschaltung Basis- vs. Gamification-Version

Die Umschaltung ist **kein** Build-/Deployment-Flag und **keine** separate Route, sondern vollständig **laufzeitseitig, innerhalb derselben SPA**, über zwei kombinierbare Mechanismen:

### a) Manuelle Umschaltung (freie Nutzung)

`isGamified` (Boolean, `src/hooks/useGamificationState.js`) wird auf dem Intro-Screen explizit gewählt (zwei Buttons „Learning Only"/„Gamified", `src/components/IntroScreen.jsx:620-670`, auf dem zweiten der beiden Intro-Schritte — siehe unten) oder jederzeit später erneut umschaltbar. `isGamified` steuert laut `productInvariants.test.js:88-93` (per Test erzwungen) **ausschließlich das Rendering und die Freigabe des `growthValue`-Zählers im State-Hook** — `useExerciseSession.js` referenziert `isGamified` an keiner Stelle, d. h. der eigentliche Übungsablauf (Aufgaben-Auswahl, Fortschritts-Logik, Timing) ist in beiden Modi identisch; nur sichtbare UI-Elemente unterscheiden sich: verfügbare Tabs (`availableTabs = isGamified ? [...PILLARS, 'Garden'] : PILLARS`, `App.jsx:653` und identisch `useKeyboardShortcuts.js:97`), Level-Up-/Baum-/Affirmations-Toasts, der „Shop"-Tab in den Einstellungen, das kognitive-Load-Icon während einer Aufgabe (`App.jsx:1006`) — sowie, dass der Wachstumszähler nur im gamifizierten Modus überhaupt zählt (Abschnitt 7).

### b) Geführter Studienmodus (für die Masterarbeits-Studie)

Ein zweiter, unabhängiger Mechanismus in `src/hooks/useStudyModeState.js` implementiert ein **kontrolliertes Within-Subjects-Design** mit randomisierter Reihenfolge:

1. Bei aktivem Studienmodus (`studyModeEnabled`, Standard **an**, sofern kein gespeicherter Wert existiert — begründet damit, dass die meisten Erstbesucher während der Datenerhebung Studienteilnehmer sind, `useStudyModeState.js:35-40`) wird beim allerersten Start per **Münzwurf** (`Math.random() < 0.5`) eine Startreihenfolge `'classicFirst'` oder `'gamifiedFirst'` zugewiesen und in `localStorage['variantOrder']` persistiert (`useStudyModeState.js:84-105`) — überschreibbar über einen URL-Parameter `?order=classicFirst|gamifiedFirst` für kontrolliertes Testen.
2. Der Ablauf gliedert sich in zwei „Blöcke" (`block: 1`/`2`), jeder Block durchläuft nacheinander die drei Pillars Literacy → Visual → Cognitive (`PILLAR_SEQUENCE`, `useStudyModeState.js:12`) mit fester Aufgabenzahl pro Pillar (`TASKS_PER_PILLAR = { Literacy: 8, Visual: 3, Cognitive: 4 }`, `useStudyModeState.js:21`), gefolgt von einer Garten-Ansicht (nur im gamifizierten Block) und einer Umfrage pro Block (`phase`-Zustandsmaschine `'tasks' → 'garden'|'survey' → 'survey' → 'done'`) — NASA-TLX + SUS + UEQ-Short immer, plus drei zusätzliche Grywalizations-Feedback-Items nur im gamifizierten Block (siehe Abschnitt 11).
3. `blockIsGamified` wird aus `variantOrder` und der aktuellen `block`-Nummer abgeleitet (`isBlockGamified`, `useStudyModeState.js:50-52`, verwendet in `:155`) und in `App.jsx:280-281` **erzwungen** in `isGamified` übertragen (`if (studyMode.isActive && isGamified !== studyMode.blockIsGamified) setIsGamified(studyMode.blockIsGamified)`) — während eines aktiven Studienblocks überschreibt der Studienmodus also den freien Umschalter. (Dieser State-Update-Aufruf während des Renderns einer anderen Komponente ist auch die Ursache einer beobachteten React-Warnung, siehe Abschnitt 12.)
4. **Übungstypen-Plan (gepaarter Vergleich):** Pro Teilnehmer wird einmalig eine feste Auswahl an Übungs*typen* je Pillar gezogen (`assignExercisePlan()`, `useStudyModeState.js:59-69`) und in `localStorage['studyExercisePlan']` gespeichert, sodass Block 1 und Block 2 exakt dieselben Übungstypen nutzen (gepaarter Vergleich klassisch-vs-gamifiziert pro Typ) statt unabhängig neu zu würfeln. Die Ziehung erfolgt aus `STUDY_PLAN_EXERCISE_PILLARS` (`src/data/exerciseTypes.js:91-97`) — `STUDY_EXERCISE_PILLARS` ohne `comprehension` und `graphemePhoneme` (Begründung in Abschnitt 9, „A/B-Sets im geführten Studium"); Literacy hat damit 10 statt 12 Kandidaten (8 werden gezogen). Bereits gespeicherte Pläne von Teilnehmenden, die vor dieser Änderung starteten, bleiben unverändert.
5. **Inhaltsset je Block (Content-Counterbalancing):** Block 1 zieht seine Aufgaben aus Set A, Block 2 aus Set B (`studySetForBlock`, `src/data/studySets.js:28-30`; im Hook als `blockStudySet` exponiert, `useStudyModeState.js:225`; in `App.jsx:480` an `useExerciseSession` übergeben) — ein Teilnehmender sieht in Block 2 also nie dieselben Items wie in Block 1 (vorher waren die Items beider Blöcke bei gleichem Plan und gleichem Seed identisch, weil `setPillarTab` `idx`/`cycle` beim Pillar-Wechsel auf 0 zurücksetzt, `App.jsx:542`). Da `variantOrder` per Münzwurf 50/50 vergeben wird, ist jede Kombination „Bedingung × Set" über alle Teilnehmenden gleich häufig (klassisch+A/klassisch+B/gamifiziert+A/gamifiziert+B); per Vitest belegt (`src/data/studySets.test.js`). **Nicht** trennbar ist Set von Block-Position (A liegt immer in Block 1) — dafür bräuchte es eine zweite, unabhängige Randomisierung. Der frühere, unabhängige Geräte-Lock über den URL-Parameter `?set=A|B` (`src/hooks/useStudySet.js`, `src/data/studySets.js`) gilt nur noch **außerhalb** des geführten Studiums; im Studium wird er ignoriert.
6. **Feste Schwierigkeit:** `adaptiveDifficulty` ist für die gesamte Dauer des geführten Studiums ausgeschaltet (`applyStudyOverrides`, `src/utils/studyOverrides.js`, angewendet in `App.jsx:447-449`), da adaptive Schwierigkeit die gezeigten Items von der individuellen Leistung abhängig macht und die Blöcke sich sonst nicht nur in der Gamification-Bedingung unterscheiden würden. Die gespeicherte Nutzerpräferenz bleibt unberührt und gilt danach wieder; der Schalter in den Einstellungen ist während des Studiums gesperrt und zeigt „aus" (`SettingsModal.jsx:440-460`), die Umfrage speichert den *wirksamen* Wert. Nicht abgedeckt: `userDifficulty` selbst kann der Teilnehmende weiterhin manuell ändern.

Der Studienmodus lässt sich auf dem Intro-Screen ein-/ausschalten (`role="switch"`, `IntroScreen.jsx:556-587`); ist er aktiv, entfällt die manuelle Modus-Wahl (`studyModeActive ? <Anzeige des aktuellen Blocks> : <freie Auswahl>`, `IntroScreen.jsx:610-670`).

**Zweistufiger Intro-Screen:** Der Startbildschirm ist in zwei Schritte aufgeteilt (`const [step, setStep] = useState(1)`, `IntroScreen.jsx:167`): Schritt 1 enthält die Sprachauswahl sowie ein Raster mit Komfort-/Barrierefreiheits-Werkzeugen (LRS-Schrift, Bionic Reading, Lese-Lineal, Sprachassistent, Kontrast, Safe Colors, Soft Colors, Motorik, Reduced Motion, Zen-Modus — `IntroScreen.jsx:260-511`); Schritt 2 enthält den Studienmodus-Schalter, die Modus-Wahl (Classic/Gamified bzw. die Blockanzeige bei aktivem Studienmodus) und die Theme-Auswahl (`IntroScreen.jsx:513-717`). Beide Schritte teilen sich dieselbe Vorlese-Logik (`StepAutoRead`-Hilfskomponente, remountet über `key={step}`, `IntroScreen.jsx:783-…`, nutzt dasselbe `useAutoReadAloud`-Muster wie an anderer Stelle in der App) sowie einen gemeinsamen Footer mit „Zurück"/„Weiter"/„Start"-Buttons (`IntroScreen.jsx:739-779`).

**Zusammengefasst:** Es handelt sich um **ein** Deployment (kein separater Build, kein Query-Flag zur Feature-Aktivierung, kein Server-Redirect), bei dem der A/B-Zustand vollständig client-seitig in React State/`localStorage` geführt und für die begleitende Studie durch eine randomisierte, gegenbalancierte Ablaufsteuerung ergänzt wird.

---

## 9. Übungen

### Übungstypen

`src/data/exerciseTypes.js:18-43` definiert die kanonische Registrierung, gruppiert in drei „Pillars":

- **Literacy** (13 Typen): `phonemes, syllables, graphemes, auditory, vocabulary, scrabble, lcwc, context, dictation, readAloud, comprehension, rhythm, graphemePhoneme`
- **Visual** (4 Typen): `clock, tracking, mirrorImage, oddOneOut`
- **Cognitive** (6 Typen): `categorization, sequences, memorySpan, logicalReasoning, rhythmMemory, melodyMemory`

Zusätzlich ein pillar-übergreifender **Diagnose-Pool** (`diagnostic`), der unabhängig von den nutzerseitigen An-/Abwahl-Einstellungen immer aktiv ist (`exerciseTypes.js:14-17`) und über ein `pillar`-Feld pro Aufgabe den drei Pillars zugeordnet wird.

Vier Typen (`tracking, rhythm, rhythmMemory, melodyMemory`) sind aus dem geführten Studienmodus ausgeschlossen (`EXCLUDED_FROM_STUDY`, `exerciseTypes.js:60-65`), bleiben aber in der freien Nutzung verfügbar.

### Routing Aufgabentyp → Komponente

`src/components/ExerciseContainer.jsx` verwendet eine **Lookup-Tabelle** (kein `switch`), die das Feld `task.type` (nicht identisch mit dem DB-Schlüssel aus `exerciseTypes.js` — z. B. routet der DB-Schlüssel `lcwc` auf `type: 'lookCoverWriteCheck'`, `tracking` auf `type: 'spatial'`) auf eine Komponente unter `src/components/exercises/` abbildet, u. a.: `phoneme → PhonemeExercise`, `grapheme`/`diagnostic → GraphemeExercise`, `graphemePhoneme → GraphemePhonemeMatchExercise`, `syllable → SyllableExercise`, `scrabble → ScrabbleExercise`, `context → ContextExercise`, `clock → ClockExercise`, `sequence → SequenceExercise`, `spatial → SpatialExercise`, `categorization → VisualCategorization`, `memorySpan → MemorySpanExercise`, `dictation → DictationExercise`, `readAloud → ReadAloudExercise`, `comprehension → ReadingComprehensionExercise`, `rhythmTap/rhythmMemory/melodyMemory → RhythmTapExercise/RhythmMemoryExercise/MelodyMemoryExercise`. `lookCoverWriteCheck` wird gesondert vor der Lookup-Tabelle behandelt, da diese Komponente einen abweichenden `onSelfEvaluate`-Callback statt `onSuccess`/`onError` benötigt. Ein Kommentar im Code dokumentiert, dass dieses explizite Type-Dispatch ein früheres, fehleranfälliges Duck-Typing-Verfahren ablöste.

### Datenmodell

Aufgaben liegen als Arrays unter Top-Level-Schlüsseln je Sprachdatei (`src/data/vocabulary_en.js`, `vocabulary_de.js`, `vocabulary_pl.js`, exportiert als `wordDatabaseEN`/`wordDatabaseDE`/`wordDatabasePL`). Es gibt **kein einheitliches Aufgaben-Interface** — gemeinsam sind nur `id`, `type`, `difficulty` (1–4, optional, Default 1) und optional `set` (`'A'`/`'B'`, siehe Abschnitt 8). Typ-spezifische Felder variieren stark, Beispiele aus `vocabulary_en.js`:

- **phoneme:** `{ id, set, type: 'phoneme', word, difficulty, phonetic, hint: { en, pl, de } }`
- **grapheme:** `{ id, set, type: 'grapheme', difficulty, focus, question: { en, pl, de }, options: [{ text, isCorrect, icon }, …] }`
- **diagnostic:** wie grapheme, zusätzlich `pillar`, `id` als String (`'en_diag_1'`), kein `set`-Feld.
- **categorization:** `{ id, set, type: 'categorization', difficulty, instruction, buckets: [{ id, label, icon }], items: [{ id, word, bucketId }] }`
- **dictation:** `{ id, set, type: 'dictation', dictation: true, difficulty, audioPrompt, correct }` (`correct` kann String oder Array sein — Mehrfachlösungen).
- **graphemePhoneme:** `{ id, set, type: 'graphemePhoneme', difficulty, grapheme, phoneme, distractors: [] }`.

### Feedback bei Fehlern

Feedback ist **zentralisiert**, nicht pro Übungskomponente dupliziert: jede Komponente meldet nur `onSuccess()`/`onError()` (verdrahtet aus `useExerciseSession.js`s `handleSuccess`/`handleError` via `App.jsx` → `ExerciseContainer.jsx` → einzelne Komponente) und rendert selbst **kein** eigenes Richtig/Falsch-Banner. `useExerciseSession.js` übernimmt zentral:

- Anzeige eines `role="status"`/`aria-live="polite"`-Banners mit regelbezogenem Text (`t('feedback.correctWithRule'/'incorrectWithRule', { rule: task.focus })`, falls die Aufgabe ein `focus`-Feld trägt, sonst generisches `feedback.correct`/`feedback.incorrect`) — gerendert zentral in `App.jsx`.
- Optionale, zufällig aus einer Liste gewählte gesprochene Rückmeldung (`t('voice.success'/'voice.error')`), nur wenn sowohl `voiceAssistant` als auch nicht `muteNotifications` aktiv sind.
- Optionaler Erfolgs-Sound (Web-Audio-API-Oszillator-Töne, themenspezifisch unterschiedliche Frequenzfolgen, `useExerciseSession.js:11-62`), nur wenn `audioRewards` aktiv.
- **Adaptive Schwierigkeit** (wenn `adaptiveDifficulty` aktiv): nach 5 aufeinanderfolgenden korrekten Antworten wird der Schwierigkeitsgrad automatisch um 1 erhöht (Max. 4, `useExerciseSession.js:345-354`); nach 2 aufeinanderfolgenden Fehlern automatisch um 1 gesenkt (Min. 1, `useExerciseSession.js:412-419`).
- Automatischer Übergang zur nächsten Aufgabe nach fixer Verzögerung (1500 ms, bzw. 3000 ms bei aktivierter „Extended Time"-Einstellung), unabhängig vom Gamification-Modus (`useExerciseSession.js:382-384`).
- Einzelne Komponenten können zusätzliche, typ-spezifische visuelle Ergänzungen zeigen (z. B. `ClockExercise.jsx` hebt nach einem Fehler die korrekte Antwort zusätzlich optisch hervor), ersetzen aber nicht das zentrale Feedback.

### Content-/Schwierigkeits-Filterung

`useExerciseSession.js`s `activePillarTasks` (`:153-310`) kombiniert: Nutzer-Opt-outs pro Übungstyp (`activeExercises`, siehe unten), Studienmodus-Einschränkung auf den zugewiesenen Plan (falls aktiv), Schwierigkeitsgrad-Filter (exakter oder ±1-Bereich bei aktivierter adaptiver Schwierigkeit, mit Fallback auf „≤ Schwierigkeit" bzw. „alle" bei leerer Trefferliste), Content-Set-Filter (`belongsToActiveSet`, Abschnitt 8 — das aktive Set stammt im geführten Studium aus dem Block, sonst aus dem `?set=`-Gerätelock) sowie eine seed-basierte, pro Übungstyp getrennte Durchmischung mit anschließendem Round-Robin-Interleaving, damit kein umfangreicher Übungstyp (z. B. viele Graphem-Items) einen kleineren Typ (z. B. wenige Merkspann-Items) in der Session verdrängt.

### Per-Typ-Abwahl (Übungsmanager)

`src/components/ExerciseToggleManager.jsx` (Settings-Tab „Übungen"): Nutzer können einzelne Übungstypen je Pillar deaktivieren (`activeExercises`-Objekt, Default alle aktiv). Eine eingebaute Regel verhindert, dass innerhalb eines Pillars **alle** Typen gleichzeitig deaktiviert werden (zeigt stattdessen eine Warnung).

### A/B-Sets im geführten Studium: Abdeckung

Weil Block 1 aus Set A und Block 2 aus Set B zieht (Abschnitt 8), muss jeder im Studienplan mögliche Übungstyp in **beiden** Sets Items auf der Studien-Schwierigkeit besitzen — diese ist `userDifficulty = 2` (Standard, `useUserSettings.js:57`; adaptive Schwierigkeit ist im Studium aus). Eine skriptgestützte Zählung je Sprachdatei ergab (hier `vocabulary_de.js`; Items je Set insgesamt / davon Schwierigkeit 2, `A/B`):

| Pillar | Übungstyp | gesamt A/B | Schwierigkeit 2 A/B |
|---|---|---|---|
| Literacy | phonemes / syllables / scrabble | 10/10 | 6/4 · 6/4 · 6/3 |
| Literacy | graphemes | 10/10 | 4/1 |
| Literacy | auditory / lcwc | 10/10 | 5/2 · 7/1 |
| Literacy | vocabulary | 7/8 | 4/2 |
| Literacy | context | 10/10 | 2/7 |
| Literacy | dictation / readAloud | 23/23 · 12/12 | 12/10 · 2/5 |
| Literacy | **comprehension** | 5/5 | **5/0** |
| Literacy | **graphemePhoneme** (Studium nutzt nur ungerade IDs) | **6/0** | **4/0** |
| Visual | clock / mirrorImage / oddOneOut | 10/10 · 4/4 · 3/4 | 5/3 · 1/2 · 1/1 |
| Cognitive | categorization / sequences / memorySpan / logicalReasoning | 10/10 (je) | 6/5 · 6/3 · 2/5 · 7/4 |

`vocabulary_en.js` und `vocabulary_pl.js` zeigen dasselbe Muster mit denselben zwei Lücken. Bei `comprehension` liegen alle Set-B-Items auf einer anderen Schwierigkeit als 2; bei `graphemePhoneme` liegen alle im Studium zulässigen (ungeraden) IDs in Set A. Blieben beide im Plan, fehlten sie in Block 2 (weniger Aufgabentypen als Aufgaben pro Block, Items würden sich wiederholen) — bei zufällig 8 aus 12 Literacy-Typen wäre das für rund 91 % der Teilnehmenden der Fall gewesen. Sie sind deshalb **nur aus dem Studienplan** ausgeschlossen (`EXCLUDED_FROM_STUDY_PLAN`, `src/data/exerciseTypes.js:91`); in der freien Nutzung bleiben sie unverändert verfügbar. Die Alternative wäre eine inhaltliche Nachpflege der `set`-Zuordnung (z. B. ungerade `graphemePhoneme`-IDs abwechselnd A/B) — eine Content-Entscheidung, die nicht automatisch getroffen wurde.

Zwei Folgen der dünnen Schwierigkeit-2-Bestände: Bei Typen mit nur einem Item in einem Set (z. B. `lcwc`/`graphemes` in Set B, alle Visual-Typen) sehen **alle** Teilnehmenden in diesem Block dasselbe Item — konsistent für den Vergleich zwischen Teilnehmenden, aber ohne Variation. Und die Bestände beider Sets sind auf Schwierigkeit 2 teils stark ungleich groß.

Abgesichert ist das durch `src/data/studySets.test.js` (u. a. je Sprache × Pillar-Typ × Set mindestens ein Item auf Schwierigkeit 2 sowie genug Typen pro Pillar, um einen Block zu füllen) und `src/hooks/useExerciseSession.studySets.test.js` (Block 1/Set A und Block 2/Set B liefern für denselben Plan dieselben Typen, aber keine gemeinsamen Items, für `de`/`en`/`pl` × alle drei Pillars). Ein Datenänderungs-Fehler bricht damit den Testlauf statt still einen Block zu verkürzen.

### Content-Qualitätssicherung (linguistischer Review)

Eine inhaltliche QA-Prüfung (Stichprobe über ~110–180 Items je Sprache in den linguistisch relevanten Kategorien `phonemes`/`syllables`/`context`/`dictation`/`graphemes`/`scrabble`/`categorization`/`comprehension`, kombiniert mit einem vollständigen strukturellen Scan aller drei Datenbanken über `audit-vocabulary.mjs`, siehe Abschnitt 10) deckte vier konkrete Fehler auf, die inzwischen behoben sind:

- **`auditory` (Englisch) war zu 35 % unvollständig:** 13 von 20 erwarteten Items (`vocabulary_en.js`), während Deutsch und Polnisch je 20 vollständige, durchgehend nummerierte Items besaßen. Die Lücke entstand, weil ein gemeinsam für alle drei Sprachen angelegter Content-Batch (Commit `338e011`) für Englisch mittendrin abbrach — nachweisbar u. a. daran, dass das inhaltliche Set-A/B-Gegenbalancierungs-Verhältnis (siehe Abschnitt 8) für Englisch **unausgeglichen** war (8 vs. 5 Items) statt der garantierten 10 vs. 10 für Deutsch/Polnisch — ein direkter, messbarer Störfaktor für die Studiendaten, nicht nur eine inhaltliche Lücke. Behoben durch Ergänzung von sieben neu verfassten, sprachnativen Items (zwei Reim-, zwei Phonem-Diskriminations-, drei Homophon-Aufgaben — council/counsel, complement/compliment, waive/wave — `vocabulary_en.js:1037-1162`), wodurch das Set-A/B-Verhältnis nun ebenfalls 10/10 beträgt.
- **`dictation` (Englisch), Item-ID 15:** Die Aufgabenstellung verriet die gesuchte Antwort bereits im Anweisungstext („change the vowel sound to get **pan**"), wodurch die eigentliche Aufgabe (das neue Wort selbst zu benennen) hinfällig wurde. Behoben durch Umformulierung ohne Preisgabe des Zielworts (`vocabulary_en.js:5688`).
- **`syllables` (Deutsch), Item-ID 17 „Herausforderung":** Fehlerhafte Sprechsilbentrennung (`He-raus-for-de-rung` statt korrekt `Her-aus-for-de-rung` — „her-" bleibt laut Duden als Partikel zusammen). Relevant, weil dieses Feld nicht nur Anzeige-, sondern **Bewertungsdaten** ist: `SyllableExercise.jsx:88-97`s `checkAnswer()` vergleicht die tatsächlichen Klickpositionen der Nutzenden exakt gegen die aus `segments` abgeleiteten Soll-Trennstellen — die App akzeptierte bis zur Korrektur also nur die linguistisch falsche Trennung als „richtig" (`vocabulary_de.js:1695`).
- **`syllables` (Polnisch), Item-ID 9 „Rzeczpospolita":** Derselbe Fehlertyp (`Rzecz-pos-po-li-ta` statt korrekt `Rzecz-po-spo-li-ta`, „po-spo-li-ta" nach dem Prinzip des maximalen Onsets), mit derselben Konsequenz für die Bewertungslogik (`vocabulary_pl.js:1824`).

---

## 10. Mehrsprachigkeit

### Bibliothek & Sprachen

`i18next` + `react-i18next` (`src/i18n/config.ts`). Unterstützte Sprachen: **Deutsch (`de`), Englisch (`en`), Polnisch (`pl`)** — konsistent belegt in `src/hooks/useUserSettings.js:6` (`SUPPORTED_LANGUAGES`), `src/components/IntroScreen.jsx:14-18`, `check-locales.mjs:9`. Standardsprache `lng: 'pl'`, Fallback `fallbackLng: 'en'` (`src/i18n/config.ts:25-26`). Keine RTL-Unterstützung und keine Hinweise auf weitere geplante Sprachen im Code (Volltextsuche nach „rtl"/„dir=\"rtl\"" ergebnislos).

### Ladeverhalten (Performance-Optimierung)

Nur Polnisch (aktive Standardsprache) und Englisch (Fallback-Sprache) werden **synchron** beim App-Start gebündelt (`buildTranslationEN()`, `buildTranslationPL()`, `src/i18n/config.ts:17-18`). Deutsch wird **dynamisch nachgeladen** (`import('./de.js')`, `src/locales/index.js`) und per `i18n.addResourceBundle('de', 'translation', ..., true, true)` (`src/i18n/config.ts:37-46`) nachträglich registriert — begründet mit einer von Lighthouse „Reduce unused JavaScript" bemängelten ~23 KB JSON-Nutzlast für Besucher, die nie Deutsch wählen.

### Struktur der Übersetzungen

Pro Sprache existieren ein Merge-Modul (`src/locales/en.js`, `de.js`, `pl.js`) sowie ein Unterordner mit sechs JSON-Namespace-Dateien: `translation.json`, `common.json`, `errors.json`, `feedback.json`, `profileDashboard.json`, `survey.json`. Jedes Merge-Modul baut daraus **ein** Objekt, das i18next als einzigen Namespace `translation` erhält:

- `translation.json` wird **flach** in das Root-Objekt gespreadet — seine Top-Level-Schlüssel (z. B. `appTitle`, `start`, verschachteltes `intro: {...}`) sind direkt über `t('appTitle')` erreichbar.
- `common.json`, `errors.json`, `feedback.json`, `profileDashboard.json`, `survey.json` landen dagegen jeweils **verschachtelt** unter einem gleichnamigen Unterschlüssel (`t('feedback.correct')`, `t('common.save')` usw.).

Ein Codekommentar (`src/i18n/config.ts:51-56`) begründet den Verzicht auf eine typisierte i18next-Ressourcen-Deklaration explizit damit, dass diese Mischung aus Punkt-Pfaden und Namespace-Präfixen kein einheitliches TypeScript-Schema zulässt.

### Validierung (CI)

`check-locales.mjs` (ausgeführt in `npm run check:locales`, Teil von `.github/workflows/ci.yml`) lädt alle drei Sprachen nach demselben Merge-Schema, flacht sie zu Punkt-Pfaden ab und vergleicht `pl`/`de` gegen `en` als Referenz auf fehlende Schlüssel. Eine Plural-Sonderbehandlung nutzt `Intl.PluralRules(lang, { type: 'cardinal' })`, um pro Sprache nur die tatsächlich von deren CLDR-Regeln benötigten Plural-Suffixe (`zero/one/two/few/many/other`) als Pflicht zu werten (verhindert Falsch-Positive, z. B. für Polnisch). **Nicht geprüft** wird die Konsistenz von Interpolations-Platzhaltern (`{{var}}`) zwischen Sprachen — nur die Existenz der Schlüssel selbst.

Ein zweites Skript, `check-sets.mjs`, prüft zusätzlich die Konsistenz der A/B-Content-Set-Zuweisung (`task.set`) über die drei Sprachdatenbanken hinweg und protokolliert bekannte, vorbestehende ID-Abweichungen als „übersprungen" statt als Fehler.

Zusätzlich zur Supabase-Übertragung führt die App lokale Nutzungsprotokolle, die **die Anwendung selbst nie an einen Server sendet** (nur für die eigene Anzeige — z. B. Wochenkalender, Tageszusammenfassung im Garten — verwendet):

Nicht per Skript, sondern per Vitest geprüft wird die Abdeckung der A/B-Sets im Studienplan (`src/data/studySets.test.js`, Abschnitt 9). Die UEQ-S-Wortwahl (Abschnitt 11) ist dagegen nur eine Datenänderung in den `feedback.json`-Dateien; `check-locales.mjs` prüft Schlüssel, nicht den Wortlaut.

---

## 11. Datenerhebung für die Studie

### Erhobene Nutzungsdaten (Supabase, serverseitig)

Über `src/components/SurveyComponent.tsx` → `POST /.netlify/functions/submit-survey` → Tabelle `ab_study_submissions` (siehe Abschnitt 4) werden **ausschließlich explizit vom Teilnehmenden ausgefüllte Umfrage-Antworten plus Konfigurationskontext** übertragen — **kein** automatisches Hintergrund-Tracking von Klicks/Interaktionen. Konkret pro Einreichung:

- 6 NASA-Raw-TLX-Werte (mental/physical/temporal demand, performance, effort, frustration; Regler 0–100 in Schritten von 5, **ohne Vorbelegung**, `NASA_SCALES` `SurveyComponent.tsx:95-130`, Regler `:738-775`).
- 10 SUS-Werte (`sus01`…`sus10`; 5-stufige Radiobuttons, **ohne Vorbelegung**, `SUS_SCALES` `SurveyComponent.tsx:132-143`).
- 8 UEQ-Short-Werte (`ueq01`…`ueq08`; bipolare Item-Paare in der Standardreihenfolge des UEQ-S — vier pragmatische, vier hedonische —, 7-stufig, **ohne Vorbelegung**, `UEQ_SCALES` `SurveyComponent.tsx:147-192`). Die deutschen und polnischen Wortpaare entsprechen den offiziellen Fassungen von ueq-online.org (`UEQS_Items.pdf`; `src/locales/{de,pl}/feedback.json:24-39`), die englische war bereits offiziell. Vorher wich die deutsche Fassung in vier von acht Paaren ab (Hinderlich, Klar, Erfinderisch, Gewöhnlich/Führend statt behindernd, übersichtlich, originell, herkömmlich/neuartig — offenbar aus dem Englischen rückübersetzt), die polnische in fünf. Die offizielle polnische Fassung übersetzt „leading edge" mit „skrajny" (eigentlich „extrem/randständig"); sie wurde wie vorgegeben übernommen. Die App zeigt den ersten Buchstaben groß (Darstellung, nicht Wortlaut). Zuvor war UEQ trotz vorbereiteter Übersetzungstexte (`feedback.ueq.*`) gar nicht in das Formular eingebunden.
- Bei gamifizierter Bedingung zusätzlich 3 Grywalizations-spezifische Werte (Garten-/Abzeichen-Motivation, Ablenkung; 5-stufig, **ohne Vorbelegung**, `GAMIFICATION_SCALES` `SurveyComponent.tsx:197-204`) sowie ein optionales Freitextfeld (max. 500 Zeichen, `gameElementFeedback`) zu den erlebten Spielelementen — bei der Basis-Bedingung wird dieser Teil des Formulars gar nicht gerendert, ist nicht Pflicht und wird im Payload weggelassen (`isGamified ? (gamificationFeedback as ...) : {}`, `SurveyComponent.tsx:542`), sodass die entsprechenden DB-Spalten bewusst `NULL` bleiben statt einen bedeutungslosen Wert zu erhalten. Diese Ergänzung adressiert gezielt die Unterfrage, welche Gamification-Elemente von Teilnehmenden als unterstützend, motivierend oder störend wahrgenommen werden.
- Kontextfelder zum Einreichungszeitpunkt: `participantId` (zufällige, lokal generierte ID), `appVersion` (`'basis'`/`'vollversion'`, abgeleitet aus `isGamified`, `SurveyComponent.tsx:493`), **`variantOrder`** (Startbedingung des Teilnehmenden, falls vorhanden) und **`block`** (1/2, nur für eine Umfrage, die einen geführten Block abschließt; `:545-546`, aus `App.jsx:1317-1319`), `userLanguage`, `theme`, `a11yAddons` (Liste aktiver Barrierefreiheits-Kurzbezeichnungen, aus den booleschen Settings abgeleitet), `inclusiveOptions` (Objekt mit u. a. `adaptiveDifficulty` — im geführten Studium mit dem wirksamen Wert `false` —, `bigTargets`, `noFlash`, `audioRewards`, `extendedTime`, `zenMode`, `bionicReading`, `minimalistMode`, `muteNotifications`, `voiceAssistant`), `userDifficulty`, `dailyGoal`.
- Serverseitig (`netlify/functions/submit-survey/index.js:64-148`, Funktion `buildDbData`) werden einige dieser Werte für die Analyse ins Englische übersetzt (z. B. Theme-Namen, Barrierefreiheits-Kürzel, Sprachnamen) und in die finalen Spaltennamen der Tabelle gemappt (u. a. `ueq01`…`ueq08` → `ueq_q01`…`ueq_q08`, `gardenMotivation`/`badgeMotivation`/`gameDistraction`/`gameElementFeedback` → `garden_motivation`/`badge_motivation`/`game_distraction`/`game_element_feedback`, `variantOrder`/`block` → `variant_order`/`block`, `:84-85`). **`appVersion` wird streng aufgelöst** (`resolveAppVersion`, `:41-62`): `vollversion`/`gamified` → `gamified`, `basis`/`basic` → `basic`; jeder andere Wert wirft einen Fehler, statt (wie früher) still als `basic` abgelegt zu werden — ein falsch einsortierter Datensatz wäre für das A/B-Design unsichtbar geblieben. Nur die ältere Payload-Form ohne `appVersion` mit einem echten booleschen `isGamified` wird noch als Rückfall akzeptiert. `validatePayload` prüft dieselbe Regel vorab und antwortet mit 400 statt mit einer Einfügung unter geratener Bedingung.

### Formularverhalten: keine Vorbelegung, Pflichtfragen

- **Kein Item ist vorbelegt.** Jede Bewertung startet als `null` (Typ `Answers<T>`, `SurveyComponent.tsx:33-47`); zuvor standen NASA-TLX-Regler auf 50, SUS auf 3, UEQ auf 4 und die Grywalizations-Items auf 3, sodass ein nie berührtes Item von einer bewussten Antwort nicht zu unterscheiden war.
- **Absenden ist blockiert, solange etwas offen ist** (`missingIds`, `:341-352`; `handleSubmit`, `:470-481`): Nur das Freitextfeld ist optional, die drei Grywalizations-Items sind nur in der gamifizierten Bedingung Pflicht. Ein blockierter Versuch zeigt eine Zusammenfassung (`role="alert"`), markiert jedes unbeantwortete Item mit Rahmen, ⚠-Symbol und Text, und setzt den Fokus auf das erste — Barrierefreiheitsdetails in Abschnitt 6.
- **Regler ohne leeren Zustand:** Ein natives `<input type="range">` kann nicht leer sein. Bis zur ersten Interaktion zeigt der Regler daher „–" statt einer Zahl, ist grau und meldet per `aria-valuetext` „Noch nicht beantwortet". Als Antwort zählt: Loslassen von Maus/Touch, eine Navigationstaste (Pfeile/Home/End/Bild auf/ab) oder Enter/Leertaste (damit ist auch der Mittelwert 50 bewusst wählbar, obwohl dabei kein `change`-Ereignis entsteht). Die Prüfung ist `=== null`, nicht „falsy": `0` ist eine gültige NASA-TLX-Antwort. Enter auf einem Regler löst kein Absenden des Formulars aus.
- **Entwurfsspeicherung:** Der Schlüssel-Präfix ist jetzt `enclaro:survey:v2:` (`SurveyComponent.tsx:31`). Ein v1-Entwurf lässt sich nicht von „nie berührt" unterscheiden (alle Werte waren vorbelegt) und wird deshalb ignoriert.
- Getestet durch `src/components/SurveyComponent.test.tsx` (Anfangszustand, blockiertes Absenden inkl. Fokus/`aria-*`, Loslassen und Enter als Antwort, Tab zählt nicht, `0` wird gesendet, Pflicht der Grywalizations-Items) sowie per Live-Browser mit `axe-core` im Anfangs- und Fehlerzustand.

### Erhebungszeitpunkt & Trigger

Die Umfrage wird **nicht** mehr automatisch (z. B. nach X Punkten) eingeblendet — ein Kommentar in `useExerciseSession.js:376-381` bestätigt explizit, dass ein früherer, punktebasierter Auto-Trigger entfernt wurde; die Umfrage wird stattdessen vom Nutzer/von der Studienleitung geöffnet (Button in der Navigation, Tastenkürzel Ctrl/Cmd/Alt+S) **oder** automatisch an den beiden Checkpoints des geführten Studienmodus (Ende von Block 1 und Block 2, siehe Abschnitt 8) präsentiert.

### Lokale, nicht an einen Server übertragene Telemetrie (IndexedDB)

Zusätzlich zur Supabase-Übertragung führt die App lokale Nutzungsprotokolle, die **die Anwendung selbst nie an einen Server sendet** (nur für die eigene Anzeige — z. B. Wochenkalender, Tageszusammenfassung im Garten — verwendet):

- IndexedDB-Store `exercise_history` (`ContextMasterDB`, siehe Abschnitt 7): pro abgeschlossener Aufgabe `{ date, type: <Pillar>, correct: boolean }` (`useExerciseSession.js:385-389, 432-436`).
- IndexedDB-Store `daily_progress`: `{ date, points }` pro Tag.
- Ein optionaler, lokal geführter „Workload-Check-in"-Verlauf (`localStorage['cfg_workload_history']`, `VirtualGarden.jsx:166-176`): Selbstauskunft zu kognitiver Belastung/Fokus (je 1–5), auf die letzten 14 Einträge begrenzt, dient ausschließlich der lokalen adaptiven Schwierigkeitssteuerung, wird **nicht** an Supabase übertragen.
- Der IndexedDB-Store `ux_logs` wird angelegt, aber nirgends beschrieben — toter Code ohne erhobene Daten (siehe Abschnitt 12).

### Offline-Robustheit der Datenerhebung

Wie in Abschnitt 3 beschrieben, werden fehlgeschlagene Survey-Submits über eine Service-Worker-`backgroundSync`-Warteschlange bis zu 24 h automatisch wiederholt (`vite.config.js:52-67`); zusätzlich speichert `SurveyComponent.tsx` einen Entwurf der aktuellen Formularantworten in `localStorage` (Präfix `enclaro:survey:v2:`, pro Checkpoint-ID getrennt), der erst nach bestätigtem serverseitigem Erfolg gelöscht wird (`SurveyComponent.tsx:20-95, 319-325, 580`). Nach zwei gescheiterten Sende­versuchen bietet das Formular einen expliziten „Bypass" an, der die Studien-Ablaufsteuerung dennoch weiterschalten lässt, ohne die (weiterhin lokal gespeicherten) Antworten als eingereicht zu markieren (`SurveyComponent.tsx:601-603`).

### Keine Drittanbieter-Analyse

Es sind keine Drittanbieter-Tracking-/Analyse-SDKs eingebunden (Volltextsuche nach Google Analytics, `gtag`, Sentry, Mixpanel, Amplitude, PostHog, Segment, Hotjar über `src/`, `public/`, `index.html` ergab keinen Treffer).

---

## 12. Tests, Linting, bekannte Probleme/TODOs

### Testarchitektur

- **Unit-/Komponententests (Vitest, `jsdom`):** u. a. `src/components/ExerciseContainer.test.jsx`, `src/components/exercises/GraphemePhonemeMatchExercise.test.jsx`, `src/components/LottieAnimation.test.jsx`, `src/components/SurveyComponent.test.tsx` (Pflichtfragen/keine Vorbelegung, Abschnitt 11), `src/data/studySets.test.js` (A/B-Set-Logik und -Abdeckung, Abschnitt 9), `src/data/vocabulary.test.js`, `src/hooks/useAutoReadAloud.test.js`, `src/hooks/useExerciseVoice.test.js`, `src/hooks/useGamificationState.test.js` (Wachstums-Bindung an `isGamified`), `src/hooks/useExerciseSession.studySets.test.js` (Block 1/Block 2 ziehen disjunkte Items), `src/locales/locales.test.ts`, `src/utils/studyOverrides.test.js`, `src/utils/voiceActivityDetector.test.js`, `src/utils/voiceTranscriptMatcher.test.js`, sowie die Netlify-Function-Tests `netlify/functions/submit-survey/index.test.js` (36 Tests, u. a. `variant_order`/`block`, strenge `appVersion`-Auflösung). Stand dieses Dokuments: 18 Testdateien, 721 Tests, alle grün.
- **„Produkt-Invarianten"-Tests** (`src/__tests__/productInvariants.test.js`, `src/__tests__/contrastCompliance.test.js`): bewusst als Regressionsschutz für leicht unbemerkt brechende Produktentscheidungen konzipiert (siehe Zitate in Abschnitt 6/7) — Kommentar im Testfile selbst: „Do not ‚fix' a failure here by loosening the assertion — fix the source it's checking instead." (`productInvariants.test.js:6-7`).
- **End-to-End & Accessibility (Playwright):** `tests-playwright/` — `accessibility.spec.js` (automatisierte axe-core-Scans gegen WCAG 2.1 A/AA für Intro, alle drei Pillar-Ansichten, Settings-Dialog, Survey-Dialog; ein Test für ein „Profile"-Dialog ist bewusst `test.skip`, da die zugehörige Route/Komponente entfernt wurde, siehe unten), `cognitive_break.spec.js`, `first_exercise.spec.js`, `i18n_settings.spec.js`, `long_words_rwd.spec.js`, `responsiveness.spec.js`, `virtual_garden.spec.js`, sowie ein generisches `test-1.spec.ts`. Vier Projekte (Desktop Chrome/Firefox, iPad, iPhone X, `playwright.config.js:16-21`).
- Der axe-Scan schließt gezielt nur die von `@floating-ui/react`s Fokus-Trap eingefügten unsichtbaren Fokus-Wächter-Elemente aus (`[data-floating-ui-focus-guard]`, `accessibility.spec.js:39-53`) — sonst keine deaktivierten Regeln.

### Linting/Formatierung

- ESLint 9 Flat-Config (`eslint.config.js`) mit separaten Regelsätzen für Browser-Code (`globals.browser`), den AudioWorklet (`src/workers/recorderWorklet.js`, eigene Worklet-Globals) und Node-Code (Netlify Functions, Skripte, Konfigurationsdateien).
- `jsx-a11y`-`strict`-Regelsatz „per project mandate" (siehe Abschnitt 6).
- Prettier + `prettier-plugin-tailwindcss` (Klassen-Sortierung) + `@trivago/prettier-plugin-sort-imports` (Import-Sortierung), optional automatisiert über einen Git-Pre-Commit-Hook (`git config core.hooksPath .githooks`, README).
- `knip` zur Erkennung ungenutzten Codes ist eingerichtet, aber mit **leerer** Konfiguration (`knip.json` enthält nur `{}`) — keine projektspezifische Einstellung.

### CI-Pipeline

`.github/workflows/ci.yml`: bei Push/PR auf `main`/`master` nacheinander `npm ci` → **`npm ci` mit `working-directory: netlify/functions/submit-survey`** (siehe unten) → `npm run lint` → `npm run typecheck` → `npm run check:locales` → `npm run test:run` (Vitest) → `npx playwright install --with-deps` → `npx playwright test`; Playwright-HTML-Report wird als Artefakt hochgeladen. `check:sets` und `audit:vocabulary` sind **nicht** Teil der CI-Pipeline (nur manuell ausführbar).

**Behobene CI-Lücke:** `netlify/functions/submit-survey/` besitzt eine **eigene**, bewusst vom Root getrennte `package.json`/`package-lock.json` (Abschnitt 1) mit eigenem, `.gitignore`-tem `node_modules/`. Lokal war dieses Verzeichnis bereits installiert, weshalb `netlify/functions/submit-survey/index.test.js` (das über `require('./index.js')` transitiv `@supabase/supabase-js` benötigt) lokal anstandslos lief — in einem frischen CI-Checkout jedoch nicht, da `npm ci` am Repo-Root dieses separate Verzeichnis nie installierte (`Cannot find module '@supabase/supabase-js'`, 0 ausgeführte Tests in dieser Datei, beobachtet in einem echten CI-Lauf). Behoben durch einen zusätzlichen `npm ci`-Schritt mit `working-directory: netlify/functions/submit-survey` vor dem Lint-Schritt — verifiziert durch Simulation eines frischen Checkouts (lokales `node_modules/` entfernt, neu installiert, alle 24 Tests dieser Datei sowie die vollständige 579-Tests-Suite liefen danach erneut grün).

### Bekannte Probleme, Inkonsistenzen und tote Codepfade (aus dem Code selbst verifiziert)

- **Kein `TODO`/`FIXME`/`XXX`/`HACK`-Kommentar** an irgendeiner Stelle im projekteigenen Quellcode (`src/`, `netlify/`, `scripts/`) gefunden — offene Punkte sind stattdessen, wie oben zitiert, in ausführlichen erklärenden Kommentaren oder in Tests dokumentiert.
- **`docs/`-Verzeichnis fehlt**, wird aber von mehreren Kommentaren weiterhin referenziert (siehe Abschnitt 2).
- **Fokus-Label des Umfrage-Dialogs verweist zeitweise ins Leere:** Das `Dialog`, das `SurveyComponent.tsx` umschließt, trägt durchgehend `labelledBy="survey-title"` (`App.jsx:1291`). Nach erfolgreichem Absenden ersetzt `SurveyComponent.tsx` sein gesamtes Markup durch eine Erfolgsansicht (`:624-631`), die **kein** Element mit `id="survey-title"` mehr enthält — für die rund 2 Sekunden, bis der Dialog automatisch schließt (`onSubmitted`-Timer, `:610`), verweist `aria-labelledby` damit auf eine nicht (mehr) existierende ID. Per axe-core-Scan bestätigt (`aria-dialog-name`, „serious"); weiterhin **nicht behoben** (auch das im Rahmen des WCAG-Audits unten beschriebene Fokus-/Kontrast-/`h1`-Bündel hat dies bewusst nicht mit angefasst, um den Fix-Umfang eng zu halten).
- **Von einem WCAG-2.1/2.2-Audit aufgedeckte, bislang nicht behobene Befunde** (Methodik: automatisierte `axe-core`-Scans **plus** fünf arbeitsteilige, fokussierte Code-Recherchen je WCAG-Themenblock, mit anschließender Verifikation zentraler Befunde per Live-Browser-Test — nicht nur statische Vermutung):
  - **Fehlende Überschriften-Hierarchie:** Alle 18 Übungs-Titel sind `<h3>` ohne dazwischenliegendes `<h2>` (z. B. `PhonemeExercise.jsx:125` u. v. a.); `SettingsModal.jsx`s Shop-Tab (`:543`) und `VisualCategorization.jsx` (`:343`) springen zusätzlich von `<h2>` auf `<h4>`.
  - **Ladezustände nicht in `aria-live`:** `SkeletonLoader.jsx` (Suspense-Fallback beim Laden von Garten/Settings) ist `aria-hidden="true"` ohne Text-Alternative; der Fortschrittsbalken beim Herunterladen des lokalen Sprachmodells (`LocalVoiceConsentModal.jsx:55`) sowie der TTS-„lädt"-Zwischenzustand (`TTSController.jsx:84-92`) sind ebenfalls nicht in einer Live-Region.
  - **Punkte-/Fortschritts-Zähler ohne `aria-live`:** `ProgressPill.jsx:33-40`, `WeeklyCalendar.jsx:84-99` — Änderungen werden nicht angekündigt.
  - **Tastaturkürzel-Konflikte** (siehe Abschnitt 6, „Tastaturbedienung").
  - **Erzwungene Portrait-Orientierung im PWA-Manifest** (`orientation: 'portrait'`, `vite.config.js:36`, WCAG 1.3.4) — betrifft nur installierte PWAs unter Android (iOS ignoriert dieses Manifest-Feld); nichts an der Anwendung erfordert zwingend Hochformat.
  - **Bereichsregler-Tastknopf unterhalb der Mindest-Zielgröße:** Der native `<input type="range">`-„Thumb" (NASA-TLX-Regler, Design-Token-Regler) hat keine eigene CSS-Größenangabe und bleibt damit beim Browser-Standard (~12–20 px) — auch der „Motorik"-Modus (`[data-a11y-motorik='true']`, Abschnitt 6), der Buttons/Links/Checkboxen/Radios auf 56×56 px vergrößert, erfasst `input[type=range]` **nicht** (`a11y.css:25-33`).
  - **Korrektheits-Signal nur farblich/visuell:** `LookCoverWriteCheck.jsx` (Vergleichsansicht, ca. `:210-232`) zeigt Richtig/Falsch nur über ein `aria-hidden`-Emoji (✅/❌) neben einer allgemeinen Beschriftung „Your Spelling" — kein Textäquivalent für Screenreader-Nutzende.
  - **Möglicher Sprachassistent-/Screenreader-Konflikt** (siehe Abschnitt 6, „Sprachausgabe (TTS)").
  - **Keine Barrierefreiheitserklärung** im Repository auffindbar (weder README noch eigene Seite/Route noch Kontaktangabe) — UNKLAR, ob dies für eine Masterarbeits-Anwendung (kein öffentlicher Träger) überhaupt gefordert ist.
  - **Test-Abdeckungslücke als Ursache:** Bezeichnend ist, dass die *behobenen* Befunde (Kontrast in `SidebarNav.jsx`, fehlende Fokus-Ankündigung beim Umfrage-Fehler) exakt dort lagen, wo `tests-playwright/accessibility.spec.js` **nicht** scannt — der bestehende Test deckt sechs feste Ansichten ab (Abschnitt 12), nie `SidebarNav`/`BottomNav` eigenständig und nie den Fehlerzustand nach fehlgeschlagenem Umfrage-Submit. Eine Erweiterung des Testfiles um genau diese beiden Fälle würde künftige Regressionen dieser Art automatisch abfangen.
- **RLS-Policies entfernt — Live-Datenbank noch anzupassen:** Die früheren öffentlichen `SELECT`-/`INSERT`-Policies und der `GRANT` an `anon`/`authenticated` sind aus `supabase/00_survey_schema.sql` gestrichen (Abschnitt 4). Weil das Ändern der Datei eine bestehende Datenbank nicht berührt, bleiben sie dort bestehen, bis die Datei (oder die drei Anweisungen `DROP POLICY IF EXISTS` ×2, `REVOKE ALL`) im Supabase-SQL-Editor ausgeführt wird; das ließ sich aus dem Repository heraus nicht durchführen oder verifizieren. Ebenso muss die `variant_order`/`block`-Migration vor dem Deployment der Funktion laufen.
- **Fehlende Security-Header/Redirects in `netlify.toml`** (siehe Abschnitt 5).
- **React-Warnung „Cannot update a component (`GamificationProvider`) while rendering a different component (`AppContent`)":** in der Browser-Konsole reproduzierbar beobachtet (u. a. beim Öffnen des virtuellen Gartens im Studienmodus). Ursache: `App.jsx:280-281` ruft während des Renderns von `AppContent` `setIsGamified(...)` auf — den Setter aus `GamificationContext`, dessen zugehöriger State aber in der separaten `GamificationProvider`-Komponente lebt (`GamificationContext.jsx:4`, eingehängt in `App.jsx:1389-1395`). Das im übrigen Code etablierte „State-Anpassung während des Renderns"-Muster (z. B. `App.jsx:271-276` für `prevIsGamified`) ist laut React nur für den **eigenen** State einer Komponente sanktioniert — das Setzen des States einer *anderen* Komponente während des Renderns ist der eigentliche Auslöser. Funktional bislang ohne beobachtete Fehlfunktion, aber ein von React offiziell nicht unterstütztes Muster.
- **Mehrsprachige Content-Lücken bei `hint`/`question`-Metadaten, breiter als bisher dokumentiert:** `src/data/vocabulary_de_gaps.md` (auf Polnisch verfasst) listet 32 Einträge in `vocabulary_de.js` (Kategorien `phonemes`/`context`) ohne vollständige Drei-Sprachen-`hint`/`question`-Abdeckung. Ein vollständiger, skriptgestützter Scan aller drei Datenbanken (im Rahmen der in Abschnitt 9 beschriebenen Content-QA) zeigte, dass dieselbe Lückenklasse **auch** `vocabulary_en.js` (16 von 20 `context`-Items ohne `de`-Übersetzung) und `vocabulary_pl.js` (alle 23 `context`-Items ohne `de`-Übersetzung) betrifft — bislang nirgends dokumentiert. Ohne Funktionsauswirkung (der Loader lädt ohnehin nur die aktive Sprache), aber relevant für eine sprachvergleichende Auswertung im Rahmen der Masterarbeit. Ein einzelner, inzwischen behobener Duplikat-Fund (`vocabulary_pl.js`s `syllables`-Kategorie: „Odpowiedzialność" identisch unter ID 2 **und** 15) gehörte zur selben Prüfung, ist aber inhaltlich unabhängig von den fehlenden Übersetzungen.
- **`check-sets.mjs`** dokumentiert zur Laufzeit zusätzlich vorbestehende, nicht 1:1 übereinstimmende Item-ID-Mengen zwischen den drei Sprachdatenbanken für einzelne (Sprache, Pillar)-Kombinationen (wird als „übersprungen", nicht als Fehler behandelt) — seit der in Abschnitt 9 beschriebenen Content-QA ist bekannt, dass diese Abweichungen bei den betroffenen Kategorien (`context`, `dictation`, `graphemes`, `phonemes`, `scrabble`, alle mit Mehrbestand in `vocabulary_pl.js`) durchweg **inhaltlich vollständige, absichtlich sprachnative Zusatz-Items** sind, keine unfertigen Imports — mit der einen bereits oben genannten Ausnahme des Duplikats.
- **Entfernte Funktionalität mit Code-Nachwirkungen:** Ein `UserProfileDashboard`-Feature (Route `/#/profile`) wurde vollständig aus `src/` entfernt; der zugehörige Playwright-Test ist als `test.skip` stehen geblieben (`tests-playwright/accessibility.spec.js`, Kommentar dort), und die i18n-Datei `profileDashboard.json` existiert je Sprache weiterhin als ungenutztes Scaffold (laut Kommentar in `src/locales/index.js`).
- **Studienplan-Ausschluss und Set-Design — offene Entscheidungen** (Abschnitt 8/9): (1) `comprehension` und `graphemePhoneme` sind aus dem geführten Studienplan ausgeschlossen, weil Set B für sie auf Schwierigkeit 2 leer ist; alternativ ließe sich die `set`-Zuordnung inhaltlich nachpflegen. (2) Bereits vor dieser Änderung gespeicherte Studienpläne (`localStorage['studyExercisePlan']`) können die beiden Typen noch enthalten — für diese Teilnehmenden fehlen sie in Block 2. (3) Set und Block-Position sind konfundiert (A immer in Block 1); trennbar wäre das nur mit einer zweiten Randomisierung. (4) `userDifficulty` bleibt während des Studiums manuell änderbar und verändert dann die Aufgabenpools beider Blöcke.
- **Keine Versionskennung der Umfrage in der Datenbank:** Wortlaut der UEQ-S-Paare (de/pl), NASA-TLX-Skala (0–100, Schritt 5) und das Entfallen der Vorbelegungen verändern die Erhebung; Einreichungen davor und danach sind nicht ohne Weiteres vergleichbar, und es gibt keine Spalte, die das kennzeichnet (nur `created_at`).
- **Kein Icon mit `purpose: 'maskable'`** im PWA-Manifest (siehe Abschnitt 3).
- **Keine Prüfung von Interpolations-Platzhaltern** zwischen Sprachen in `check-locales.mjs`, ebenso wenig in `audit-vocabulary.mjs` (siehe Abschnitt 10).

---

## Zusammenfassung: Offene Punkte und technische Schulden

1. `docs/`-Verzeichnis fehlt trotz fortbestehender Verweise im Code (README, mehrere Kommentare, ein Playwright-Test) — entweder wiederherstellen oder alle Verweise bereinigen.
2. **Betrieb (nicht aus dem Repository ausführbar):** In Supabase die Migration `variant_order`/`block` **vor** dem Deployment der neuen Funktionsversion ausführen und die Policy-Entfernung (`DROP POLICY IF EXISTS` ×2, `REVOKE ALL`) auf die Live-Datenbank anwenden; andernfalls scheitern Einreichungen bzw. bleibt der öffentliche Lesezugriff bestehen.
3. Studienplan: `comprehension`/`graphemePhoneme` ausgeschlossen (Set B leer auf Schwierigkeit 2) — Content-Entscheidung offen; bereits gespeicherte alte Pläne bleiben unverändert; Set und Block-Position sind konfundiert; `userDifficulty` ist während des Studiums manuell änderbar.
4. Keine Versionskennung der Umfrage in der DB — Erhebungen vor/nach der Änderung von UEQ-Wortlaut, NASA-Skala und Vorbelegung nicht ohne Weiteres vergleichbar.
5. Der Umfrage-`Dialog` behält `labelledBy="survey-title"` auch auf der Erfolgsansicht, die kein Element mit dieser ID mehr rendert — für ~2 s vor dem automatischen Schließen zeigt der Dialog auf eine nicht existierende ID (axe-core: `aria-dialog-name`, „serious").
6. Fehlende Überschriften-Hierarchie in allen 18 Übungskomponenten (`<h3>` ohne `<h2>` darüber) sowie zwei zusätzliche `<h2>`→`<h4>`-Sprünge (Settings-Shop-Tab, `VisualCategorization.jsx`).
7. Mehrere dynamische Inhalte ohne `aria-live`-Ankündigung: Ladezustände (Skeleton-Loader, Sprachmodell-Download-Fortschritt, TTS-„lädt"), Punkte-/Fortschritts-Zähler.
8. Tastaturkürzel-Konflikte (Strg+1–4 vs. Browser-Tab-Wechsel; modifikatorlose Pfeiltasten vs. NVDA/JAWS-Lesemodus) sowie keine Möglichkeit, Kürzel zu deaktivieren/umzubelegen.
9. PWA-Manifest erzwingt `orientation: 'portrait'` — betrifft installierte PWAs unter Android.
10. Bereichsregler-Tastknöpfe (NASA-TLX-/Design-Token-Regler) unterhalb der WCAG-2.5.8-Mindestgröße, vom „Motorik"-Modus nicht mit abgedeckt.
11. `LookCoverWriteCheck.jsx`s Richtig/Falsch-Signal ist rein farblich/emoji-basiert ohne Textäquivalent.
12. Möglicher Doppel-Sprachausgabe-Konflikt zwischen eigenem Sprachassistenten und einem parallel aktiven Screenreader (gleiches Ereignis, unterschiedlicher Text).
13. Keine auffindbare Barrierefreiheitserklärung im Repository.
14. `tests-playwright/accessibility.spec.js` deckt `SidebarNav`/`BottomNav` nicht eigenständig und den Umfrage-Fehlerzustand nicht ab — genau dort lagen die inzwischen behobenen Kontrast-/`aria-live`-Befunde.
15. React-Warnung „Cannot update a component (`GamificationProvider`) while rendering a different component (`AppContent`)" — `App.jsx` setzt während des eigenen Renderns den State einer anderen (Provider-)Komponente; ein von React nicht sanktioniertes Muster, bislang ohne beobachtete Fehlfunktion.
16. Keine Security-Header (CSP, `X-Frame-Options` etc.) und keine expliziten Redirects in `netlify.toml`.
17. Mehrsprachige `hint`/`question`-Metadaten-Lücken, nachweislich in allen drei Sprachdatenbanken (bislang nur für Deutsch dokumentiert, siehe `vocabulary_de_gaps.md`) — ohne Funktionsauswirkung, aber relevant für die sprachvergleichende Auswertung der Masterarbeit.
18. Überbleibsel eines entfernten „UserProfileDashboard"-Features (übersprungener Test, ungenutzte `profileDashboard.json`-Übersetzungsdatei).
19. `knip.json` ist konfigurationslos (`{}`) — Potenzial für striktere Dead-Code-Erkennung ungenutzt.
20. Kein PWA-Icon mit `purpose: 'maskable'`.
21. `check-locales.mjs` und `audit-vocabulary.mjs` prüfen nur Schlüssel-Existenz bzw. Struktur, keine Konsistenz von Interpolations-Platzhaltern zwischen Sprachen.
22. Laufzeit-Kontrastprüfung (`useThemeCSSVariables.js`) ist auf den Entwicklungsmodus beschränkt (nur `console.warn`) — keine erzwungene Compliance-Prüfung in Produktion (durch die begleitenden Vitest-Tests jedoch statisch abgedeckt).

*Inzwischen behoben (nicht mehr Teil der offenen Punkte, im Text oben entsprechend aktualisiert): die README-Diskrepanz „Coins and a theme shop", der `growthValue`-Kommentar in `useGamificationState.js`, die „OpenDyslexic"-Erwähnung in den UI-Texten, der tote IndexedDB-Store `ux_logs`, die verwaiste `public/netlify-forms.html`, der irreführende Name des Export-Skripts (jetzt `scripts/export-survey-data.js`), die `SidebarNav`-Kontrastverstöße, die `t('error', …)`-Schlüsselkollision (analog zur bereits zuvor behobenen `t('success', …)`-Kollision), die fehlende Fokus-/Live-Region-Ankündigung bei Ansichtswechsel bzw. Umfrage-Fehler, das fehlende `<h1>` unterhalb 1024 px, der fehlende `aria-valuetext` auf den NASA-TLX-/Design-Token-Reglern, die fehlende CI-Installation der eigenständigen Netlify-Function-Dependencies, vier konkrete Content-Fehler in den Übungsdaten (unvollständige `auditory`-Kategorie Englisch, antwortverratende Diktat-Aufgabe Englisch, zwei fehlerhafte Sprechsilbentrennungen Deutsch/Polnisch — siehe Abschnitt 9) sowie — im Repository, nicht in der Live-Datenbank — die öffentlichen RLS-Policies (Punkt 2), das Wachstum des Gartenzählers auch im klassischen Modus und beim Überspringen, identische Items in Block 1 und Block 2 des geführten Studiums, adaptive Schwierigkeit als Störfaktor im Studium, vorbelegte Umfrage-Antworten, die von der offiziellen Fassung abweichende deutsche/polnische UEQ-S-Wortwahl, das stille Ablegen unbekannter `appVersion`-Werte als `basic` und das Fehlen von `variant_order`/`block` in den Datensätzen.*

---

*Hinweis zur Methodik: Diese Beschreibung wurde durch direkte Lektüre der genannten Quelldateien sowie durch mehrere unabhängige, arbeitsteilige Code-Recherchen (mit anschließender Verifikation der zentralen Befunde durch erneutes Lesen der Originaldateien) erstellt. Sämtliche Zahlen, Konstanten und Verhaltensbeschreibungen sind mit Dateipfad referenziert; Aussagen ohne eindeutigen Codebeleg sind als UNKLAR gekennzeichnet.*
