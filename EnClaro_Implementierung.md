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
├── check-locales.mjs          # CI-Skript: Übersetzungs-Schlüssel-Vollständigkeit
├── check-sets.mjs             # CI-Skript: Konsistenz der A/B-Content-Sets über Sprachen
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
│   ├── utils/                  # IndexedDB-Wrapper, Kontrastprüfung, Voice-Utilities, …
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
| `description` | „Twoja bezstresowa przestrzeń do ćwiczeń językowych." (polnisch, hartkodiert) | `vite.config.js:26` |
| `theme_color` / `background_color` | `#fdfaf6` | `vite.config.js:27-28` |
| `display` | `standalone` | `vite.config.js:29` |
| `orientation` | `portrait` | `vite.config.js:30` |
| `start_url` / `scope` | `/` | `vite.config.js:31-32` |
| `icons` | 192×192 und 512×512 PNG, jeweils `purpose: 'any'` | `vite.config.js:33-46` |

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

Quelle: `supabase/00_survey_schema.sql:5-36`. Einzige Tabelle: `public.ab_study_submissions`.

| Spalte | Typ | Bedeutung |
|---|---|---|
| `id` | `UUID` (PK, `uuid_generate_v4()`) | — |
| `created_at` | `TIMESTAMPTZ`, Default `NOW()` | Server-Zeitstempel des Inserts |
| `app_version` | `TEXT`, `CHECK IN ('basic','gamified')` | A/B-Zweig der jeweiligen Einreichung |
| `participant_id` | `TEXT` | siehe Abschnitt „Personenbezogene Daten" |
| `user_language` | `TEXT` | UI-Sprache zum Zeitpunkt der Einreichung |
| `local_timestamp` | `TIMESTAMPTZ` | client-seitiger Zeitstempel |
| `theme`, `a11y_addons`, `inclusive_options`, `user_difficulty`, `daily_goal` | `TEXT`/`TEXT` (JSON-String)/`SMALLINT` | App-Konfigurationskontext zum Einreichungszeitpunkt |
| `mental_demand`, `physical_demand`, `temporal_demand`, `performance`, `effort`, `frustration` | `SMALLINT` (0–100) | NASA-Raw-TLX-Werte |
| `sus_q01` … `sus_q10` | `SMALLINT` (1–5) | System-Usability-Scale-Antworten |
| `ueq_q01` … `ueq_q08` | `SMALLINT` (1–7) | UEQ-Short-Antworten (User Experience Questionnaire, bipolare Item-Paare) — seit Kurzem ergänzt (`supabase/00_survey_schema.sql:37-41`); Details siehe Abschnitt 11. |
| `garden_motivation`, `badge_motivation`, `game_distraction` | `SMALLINT` (1–5), nullable | Grywalizations-spezifisches Feedback (Garten-/Abzeichen-Motivation, Ablenkung) — nur bei `app_version = 'gamified'` befüllt, bei `'basic'` bewusst `NULL` (`supabase/00_survey_schema.sql:45-47`). |
| `game_element_feedback` | `TEXT`, nullable | Freitext-Antwort zu Spielelementen, optional, max. 500 Zeichen (serverseitig erzwungen, siehe unten); ebenfalls nur für die gamifizierte Bedingung (`supabase/00_survey_schema.sql:48`). |

Zwei auskommentierte Migrationsblöcke dokumentieren nachträgliche Schemaänderungen: `supabase/00_survey_schema.sql:51-69` (`ALTER TABLE ... ADD COLUMN IF NOT EXISTS`) ist eine idempotente Nachrüst-Migration der UEQ-Short-/Grywalizations-Spalten für bereits bestehende Datenbanken, auf die der (nur bei Neuanlage wirksame) `CREATE TABLE IF NOT EXISTS`-Befehl oben keine Wirkung mehr hat; `:71-78` dokumentiert, dass frühere Schema-Versionen zusätzlich `study_group`/`study_phase`-Spalten aus einem inzwischen entfernten Feature (`useStudyModeState.js`, im aktuellen Code nicht mehr vorhanden) angelegt haben könnten — die App schreibt diese Spalten nicht mehr.

### Row Level Security

RLS ist aktiviert (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY`, `supabase/00_survey_schema.sql:81`) mit zwei Policies:

- `"Allow public read access for charts"`: `SELECT` für Rollen `anon, authenticated`, `USING (true)` — uneingeschränkter Lesezugriff (`:88-89`).
- `"Allow anonymous inserts"`: `INSERT` für Rollen `anon, authenticated`, `WITH CHECK (true)` — uneingeschränkter Schreibzugriff (`:93-94`), zusätzlich per `GRANT SELECT, INSERT` bestätigt (`:97`).

Beide `CREATE POLICY`-Anweisungen sind jeweils einem `DROP POLICY IF EXISTS ...` vorangestellt (`:87, 92`) — Postgres kennt kein `CREATE POLICY IF NOT EXISTS`; ohne dieses `DROP` schlägt ein erneutes Ausführen des gesamten Skripts gegen eine bereits initialisierte Datenbank mit „policy ... already exists" fehl (in der Praxis beobachtet, siehe Abschnitt 12).

**Faktischer Zugriffsweg in diesem Repository:** Die einzige tatsächlich schreibende Komponente, `netlify/functions/submit-survey/index.js:211-220`, verwendet `SUPABASE_SERVICE_ROLE_KEY` (nicht den `anon`-Key) — der `service_role`-Client umgeht RLS grundsätzlich. Da im Frontend kein Supabase-Client mit `anon`-Key existiert, werden die beiden oben genannten `anon`/`authenticated`-Policies durch den im Repository vorhandenen Code **nicht genutzt**; sie wären nur relevant, wenn irgendwo (außerhalb dieses Repos) der `anon`-Key clientseitig eingesetzt würde. UNKLAR, ob dies für ein zukünftiges Dashboard vorgesehen ist — im Code findet sich dazu kein Hinweis.

### Personenbezogene Daten

- `participant_id`: eine über `crypto.randomUUID()` (oder ein `Math.random()`-Fallback) clientseitig generierte, in `localStorage` unter `cfg_participant_id` persistierte Zufalls-ID (`src/components/SurveyComponent.tsx:178-185`) — **kein** Klarname, keine E-Mail-Adresse, kein Geräte-Fingerprinting-Dienst. Es besteht kein Bezug zu einem Nutzerkonto (die App hat kein Login/keine Registrierung).
- Weitere gespeicherte Felder sind ausschließlich Konfigurations-/Antwortdaten (Sprache, Theme, aktivierte Barrierefreiheits-Optionen, Schwierigkeitsgrad, NASA-TLX-/SUS-Werte) — keine Klarnamen, keine Kontaktdaten, keine Standortdaten, keine Audio-/biometrischen Rohdaten (siehe Abschnitt 6 zur lokalen, nicht übertragenen Sprachverarbeitung).
- Es werden keine IP-Adressen oder Geräte-Identifikatoren durch die Anwendung selbst geloggt (serverseitig könnte Netlify selbst Request-Metadaten wie IP-Adressen loggen — das liegt außerhalb der Kontrolle dieses Repositories und ist hier nicht verifizierbar → UNKLAR für Netlify-Plattformebene).
- Eingabevalidierung erfolgt serverseitig in `netlify/functions/submit-survey/index.js:105-180` (`validatePayload`): erzwingt Zahlwerte für alle NASA-TLX-/SUS-Felder, Strings ≤ 500 Zeichen für Text-Felder, Array-Typ für `a11yAddons`, Objekt-Typ für `inclusiveOptions` — verhindert das Einschleusen beliebiger Payload-Strukturen in die Tabelle.

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
- **Tabs (Settings-Modal):** WAI-ARIA-APG-Tabs-Muster mit roving `tabIndex` — nur der aktive Tab ist im normalen Tab-Fokusfluss, Pfeiltasten/`Home`/`End` wechseln zwischen den vier Tabs „Allgemein", „Barrierefreiheit", „Übungen", „Shop" (`src/components/SettingsModal.jsx:656-689`).
- **`<legend><h2>`-Kombination** auf dem Intro-Screen (`src/components/IntroScreen.jsx:247-256` u. a.): ermöglicht sowohl eine per Screenreader-Überschriftennavigation erreichbare `<h2>` als auch eine korrekte `<fieldset>`-Gruppenbeschriftung — Kommentar begründet dies mit einem axe-core-`aria-allowed-role`-Konflikt bei `role="heading"` direkt auf `<legend>`.
- ESLint erzwingt einen `strict`-jsx-a11y-Regelsatz bereits zur Lint-Zeit (`eslint.config.js:23-27`), zusätzlich automatisierte Laufzeit-Prüfung per `@axe-core/playwright` in `tests-playwright/accessibility.spec.js` gegen `wcag2a/wcag2aa/wcag21a/wcag21aa`-Tags (siehe Abschnitt 12).

### Tastaturbedienung

`src/hooks/useKeyboardShortcuts.js`, aktiv nur außerhalb fokusgefangener Dialoge (`enabled: !settingsOpen && !showFeedback && !showSuccess && !showBreakModal`, `App.jsx:673`):

- Ohne Modifier: `ArrowRight`/`Enter` → nächste Aufgabe, `ArrowLeft` → vorherige Aufgabe (außer der Fokus liegt auf einem eigenständig interaktiven Element wie Button/Link oder einem lokalen Arrow-Key-Widget, z. B. `role="radio"`/`slider`/`listbox`).
- Mit Strg/Cmd/Alt: `,` → Einstellungen öffnen; `s` → Umfrage öffnen; **`1`/`2`/`3`** → Literacy/Visual/Cognitive-Tab (immer verfügbar); **`4`** → Garten-Tab, aber **nur wenn der Gamification-Modus aktiv ist** (`NUMBER_KEY_TO_PILLAR_INDEX`, `useKeyboardShortcuts.js:3, 97-99`) — die README-Aussage „Ctrl+1–4 shortcuts" (`README.md:23`) differenziert diese Einschränkung nicht.

### Fokus-Management

- Zentraler Fokus-Trap für alle Dialoge über `@floating-ui/react`s `FloatingFocusManager` (`Dialog.jsx:51`) — bewegt den Fokus beim Öffnen in den Dialog und beim Schließen zurück zum auslösenden Element; Escape/Klick-außerhalb über `useDismiss` (`Dialog.jsx:42`).
- „Skip to main content"-Link mit **manueller** Fokussierung von `#main-content` statt Standard-Anker-Verhalten, da der Hash-Router `#main-content` sonst als unbekanntes Routensegment interpretieren und zum Intro-Screen zurückspringen würde (`App.jsx:783-794`); `<main id="main-content" tabIndex={-1}>` ist das programmatisch fokussierbare Ziel (`App.jsx:861-864`).
- Automatischer Erfolgs-Fokus im Umfrage-Formular: nach erfolgreichem Submit wird der Fokus explizit auf die Erfolgsmeldung gesetzt (`successRef.current?.focus()`, `SurveyComponent.tsx:295-297`), da das Formular durch die Bestätigung komplett ersetzt wird.

### Schriftarten

**Es wird keine dedizierte Dyslexie-Schriftart (z. B. eine tatsächliche OpenDyslexic-Schriftdatei) eingebunden.** Die tatsächliche Font-Stack ist eine System-Sans-Serif-Kette (`Helvetica, Arial, Verdana, sans-serif`, `src/styles/index.css`, `font-family`-Deklaration). Der „LRS"/„Friendly Font"-Modus verändert ausschließlich Abstands-Werte — Zeilenhöhe 1.75, Buchstabenabstand 0.08 em, Wortabstand 0.2 em — als Inline-Styles auf `<html>` (`src/hooks/useUserSettings.js:131-146`). Dies wird explizit durch einen Vitest-Test erzwungen: `src/__tests__/productInvariants.test.js:95-106` prüft programmatisch, dass **kein** Stylesheet unter `src/styles/` den String „OpenDyslexic" enthält.

**Diskrepanz:** Die UI-Übersetzungstexte selbst behaupten weiterhin „Friendly font (OpenDyslexic)" (z. B. `src/locales/de/translation.json:113`, analog in `en`/`pl`); ein Codekommentar in `useUserSettings.js:127-130` bestätigt, dass früher tatsächlich eine OpenDyslexic-Schriftdatei genutzt wurde und dies aus einem inzwischen entfallenen Grund (Kompensation der größeren Zeichenbreite von OpenDyslexic durch reduzierte Basisschriftgröße) entfernt wurde. Der Produktname „OpenDyslexic" in der UI ist damit gegenüber dem tatsächlichen Code veraltet.

### Kontrast

`src/utils/contrastChecker.js` implementiert die WCAG-2.1-Formeln für relative Luminanz und Kontrastverhältnis und prüft gleichzeitig gegen AA (4.5:1/3:1) **und** AAA (7:1/4.5:1). Zwei Einsatzorte:
1. **Statisch (immer aktiv):** `src/__tests__/contrastCompliance.test.js` verifiziert die tatsächlichen Farbwerte aus `src/data/themes.js` und `src/styles/index.css` (Light- **und** Dark-Mode-Variante, siehe `@media (prefers-color-scheme: dark)` in `src/styles/index.css:71`) gegen AAA (7:1) für alle fünf Themes.
2. **Laufzeit, nur Entwicklungsmodus:** `src/hooks/useThemeCSSVariables.js:65-78`, geschützt durch `!import.meta.env?.PROD` — loggt bei AAA-Verstoß eine `console.warn`-Meldung; in Produktion inaktiv.

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

**Sprachassistent im Umfrage-Formular:** `SurveyComponent.tsx` erhält seit Kurzem dieselbe `speak`-Funktion als Prop von `App.jsx` (`App.jsx:1283`, analog zu `IntroScreen`/`SettingsModal`). Bei aktivem `voiceAssistant` (`SurveyComponent.tsx:196`) wird beim Öffnen des Formulars Titel + Kurzbeschreibung vorgelesen (`readIntroAloud`, `:294-304`, gleiches Stagger-Muster wie `SettingsModal.jsx`s `readGeneralTab`), nach jeder NASA-TLX-Regler-Interaktion (bei Loslassen/`keyup`, nicht während des Ziehens, um Sprach-Spam zu vermeiden — `handleNasaCommit`, `:339-…`, verdrahtet über `onMouseUp`/`onTouchEnd`/`onKeyUp`) sowie nach jeder SUS-/UEQ-/Grywalizations-Auswahl (`announce(...)`-Aufrufe in den jeweiligen `onChange`-Handlern) Frage/Item plus gewählter Wert vorgelesen, und beim erfolgreichen Absenden die Erfolgsmeldung (`readSuccessAloud`, `:309-322`).

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

- `growthValue: number` — ein einziger, monoton wachsender Zähler, persistiert in `localStorage['growthValue']` (`useGamificationState.js:16-17, 23-25`).
- `isGamified: boolean` — der Basis/Gamification-Modus-Schalter, persistiert in `localStorage['cfg_gamified']` (`useGamificationState.js:19-21, 27-29`).

Ein Vitest-Test erzwingt dies explizit: `src/__tests__/productInvariants.test.js:128-139` prüft, dass `useGamificationState()` **genau ein** numerisches Feld zurückgibt — es existiert also **keine** zweite Münz-/Punkte-Währung neben `growthValue`.

### Regeln für Wachstum

- `growthValue` wird **ausschließlich bei korrekt gelösten Aufgaben** um 1 erhöht, in `handleSuccess` (`src/hooks/useExerciseSession.js:373-375`) — **nicht** bei Fehlern (`handleError`, `useExerciseSession.js:408-441`, erhöht `growthValue` nicht) und nicht beim Überspringen; der erklärende Kommentar in `useGamificationState.js:5-10` beschreibt dies inzwischen korrekt und verweist explizit auf `handleSuccess`.
- Die visuelle Darstellung des Gartens (`src/components/VirtualGarden.jsx:35-84`) leitet aus `growthValue` eine `growthLevel = Math.floor(growthValue / 5)` ab und wählt daraus ein Icon/einen Namen aus einer 5-stufigen, themen- und (optional) pillar-spezifischen Emoji-Reihe (`themeCategoryVisuals`, `VirtualGarden.jsx:38-64`) bzw. aus den i18n-Schlüsseln `levelIcons`/`progressStages`.
- `POINTS_PER_LEVEL = 5` (identisch definiert in `App.jsx:66` und `VirtualGarden.jsx:15`) treibt die Level-Anzeige (`Math.floor(growthValue / 5) + 1`) und die Fortschritts-Pille (`growthValue % 5`).
- Drei **unterschiedliche** Belohnungs-Intervalle auf demselben `growthValue`-Zähler, jeweils eigenständig im Code definiert (keine gemeinsame Konstante):
  - **Level-Up-Modal** alle **5** Punkte (`newGrowthValue % POINTS_PER_LEVEL === 0`, `App.jsx:393-396`).
  - **„Neuer Baum"-Toast** alle **10** Punkte (`Math.floor(growthValue / 10) > Math.floor(prevGrowthValue / 10)`, `App.jsx:244-258`), inkl. Vibrationsmuster `[50,50,50]`.
  - **Affirmations-Toast** alle **15** Punkte (`points % 15 === 0`, `src/hooks/useAffirmativeNotifications.js:10-15`), zeigt eine zufällige Ermutigungs-Nachricht.
- Feedback-Texte sind bewusst nüchtern gehalten: `productInvariants.test.js:26-86` erzwingt, dass Erfolgs-/Fehler-Feedback-Strings und „neuer Baum"-Texte **kein** Ausrufezeichen und **kein** Emoji enthalten.

### Tagesziel & Fortschritt (kein Streak-Zähler)

- `dailyProgress` wird über `useIndexedDB('daily_progress', 'date', 'cfg_daily_progress')` verwaltet (`App.jsx:222-226`) und pro abgeschlossener Aufgabe (Erfolg **oder** Skip, nur wenn `isGamified`) um 1 Punkt für den aktuellen Tag erhöht (`App.jsx:385-397`).
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

- **Freischaltbedingungen** (alle nur bei `enabled === true`, d. h. `isGamified`, ausgewertet — `useAchievements.js:45-47`): `firstCorrect` (🌱) bei `growthValue >= 1`; `combo3` (🔥) bei `consecutiveCorrect >= 3` (aus `useExerciseSession.js` exponiert); `gardenVisit` (🏁) beim ersten Besuch des Garten-Tabs (`activeTab === 'Garden'`, als `gardenVisited`-Prop aus `App.jsx:468` übergeben). Laut Code-Kommentar (`src/data/achievements.js:7-11`) sind diese Schwellen bewusst so niedrig gewählt, dass sie **innerhalb eines einzigen kurzen geführten Studienblocks** (8/3/4 Aufgaben, Abschnitt 8) erreichbar sind, nicht erst nach Wochen regulärer Nutzung — explizit für die begleitende Studie motiviert.
- **Erkennungslogik:** Wie beim bereits bestehenden `prevIsGamified`-Muster in `App.jsx` läuft die „hat sich das gerade geändert"-Prüfung während des Renderns, nicht in einem `useEffect` (`useAchievements.js:59-85`) — drei `useState`-Flags (`prevGrowthMet`/`prevComboMet`/`prevGardenMet`), bewusst mit `false` statt dem bereits berechneten Wert initialisiert, damit ein wiederkehrender Nutzer, dessen Zustand schon beim ersten Render alle Bedingungen erfüllt, das Abzeichen trotzdem als „gerade freigeschaltet" angezeigt bekommt (der `tryUnlock`-Dedup-Schutz verhindert dabei ein erneutes Freischalten bereits gespeicherter Abzeichen).
- **Persistenz:** `localStorage['cfg_achievements']`, Array bereits freigeschalteter IDs (`useAchievements.js:6, 40-42, 81`) — dauerhaft, kein Reset.
- **Anzeige:** Ein Toast (`src/components/AchievementToast.jsx`), der 6 s sichtbar bleibt (`TOAST_DURATION_MS`, `useAchievements.js:7, 90-94`), gerendert in `App.jsx:1223-1229`, sowie eine dauerhafte „Abzeichen-Ablage" im Garten (`VirtualGarden.jsx:329-370`): alle drei Abzeichen werden immer angezeigt, gesperrte grau/transparent (`opacity-40 grayscale`), freigeschaltete in Theme-Farbe, mit `role="list"`/`role="listitem"` und einem `aria-label`, das Titel und (je nach Status) Beschreibung oder „gesperrt"-Text kombiniert.
- **Bewusste Entwurfsentscheidung gegen einen Übersetzungs-„Freeze"-Bug:** `useAchievements.js` gibt ausschließlich die Abzeichen-**ID** zurück, nicht bereits über `t()` aufgelösten Text (Kommentar `useAchievements.js:16-25`) — da ein bereits beim allerersten Render erfüllter Zustand vor `App.jsx`s eigenem Sprach-Sync-Effekt (`i18n.changeLanguage(settings.language)`) freischalten kann, würde ein dort einmalig aufgelöster String in der zu diesem Zeitpunkt zufälligen i18next-Standardsprache einfrieren und nie mehr aktualisiert werden. `AchievementToast.jsx` löst Titel/Beschreibung stattdessen bei jedem eigenen Render über eine `t`-Prop auf (analog zu `NewTreeToast.jsx`).

### Theme-„Shop"

`SettingsModal.jsx` besitzt einen vierten Tab „Shop" (nur sichtbar wenn `isGamified`, `SettingsModal.jsx:665-667`), der alle fünf Themes aus `src/data/themes.js` (Natur, Musik, Kunst, Space, Ocean) zur freien, sofortigen Auswahl anbietet (`ShopTab`, `SettingsModal.jsx:508-…`) — es gibt **keinen** Freischalt-Mechanismus, keine Kosten und keine Währung; jedes Theme ist jederzeit wählbar. Derselbe `ThemeSwitcher` ist zusätzlich unabhängig vom Gamification-Modus im Intro-Screen und in der Navigationsleiste verfügbar.

---

## 8. A/B-Varianten: Umschaltung Basis- vs. Gamification-Version

Die Umschaltung ist **kein** Build-/Deployment-Flag und **keine** separate Route, sondern vollständig **laufzeitseitig, innerhalb derselben SPA**, über zwei kombinierbare Mechanismen:

### a) Manuelle Umschaltung (freie Nutzung)

`isGamified` (Boolean, `src/hooks/useGamificationState.js`) wird auf dem Intro-Screen explizit gewählt (zwei Buttons „Learning Only"/„Gamified", `src/components/IntroScreen.jsx:620-670`, auf dem zweiten der beiden Intro-Schritte — siehe unten) oder jederzeit später erneut umschaltbar. `isGamified` steuert laut `productInvariants.test.js:88-93` (per Test erzwungen) **ausschließlich das Rendering** — `useExerciseSession.js` referenziert `isGamified` an keiner Stelle, d. h. der eigentliche Übungsablauf (Aufgaben-Auswahl, Fortschritts-Logik, Timing) ist in beiden Modi identisch; nur sichtbare UI-Elemente unterscheiden sich: verfügbare Tabs (`availableTabs = isGamified ? [...PILLARS, 'Garden'] : PILLARS`, `App.jsx:620` und identisch `useKeyboardShortcuts.js:97`), Level-Up-/Baum-/Affirmations-Toasts, der „Shop"-Tab in den Einstellungen, das kognitive-Load-Icon während einer Aufgabe (`App.jsx:1006`).

### b) Geführter Studienmodus (für die Masterarbeits-Studie)

Ein zweiter, unabhängiger Mechanismus in `src/hooks/useStudyModeState.js` implementiert ein **kontrolliertes Within-Subjects-Design** mit randomisierter Reihenfolge:

1. Bei aktivem Studienmodus (`studyModeEnabled`, Standard **an**, sofern kein gespeicherter Wert existiert — begründet damit, dass die meisten Erstbesucher während der Datenerhebung Studienteilnehmer sind, `useStudyModeState.js:33-39`) wird beim allerersten Start per **Münzwurf** (`Math.random() < 0.5`) eine Startreihenfolge `'classicFirst'` oder `'gamifiedFirst'` zugewiesen und in `localStorage['variantOrder']` persistiert (`useStudyModeState.js:76-98`) — überschreibbar über einen URL-Parameter `?order=classicFirst|gamifiedFirst` für kontrolliertes Testen.
2. Der Ablauf gliedert sich in zwei „Blöcke" (`block: 1`/`2`), jeder Block durchläuft nacheinander die drei Pillars Literacy → Visual → Cognitive (`PILLAR_SEQUENCE`, `useStudyModeState.js:11`) mit fester Aufgabenzahl pro Pillar (`TASKS_PER_PILLAR = { Literacy: 8, Visual: 3, Cognitive: 4 }`, `useStudyModeState.js:19`), gefolgt von einer Garten-Ansicht (nur im gamifizierten Block) und einer Umfrage pro Block (`phase`-Zustandsmaschine `'tasks' → 'garden'|'survey' → 'survey' → 'done'`) — NASA-TLX + SUS + UEQ-Short immer, plus drei zusätzliche Grywalizations-Feedback-Items nur im gamifizierten Block (siehe Abschnitt 11).
3. `blockIsGamified` wird aus `variantOrder` und der aktuellen `block`-Nummer abgeleitet (`useStudyModeState.js:147-150`) und in `App.jsx:279-280` **erzwungen** in `isGamified` übertragen (`if (studyMode.isActive && isGamified !== studyMode.blockIsGamified) setIsGamified(studyMode.blockIsGamified)`) — während eines aktiven Studienblocks überschreibt der Studienmodus also den freien Umschalter. (Dieser State-Update-Aufruf während des Renderns einer anderen Komponente ist auch die Ursache einer beobachteten React-Warnung, siehe Abschnitt 12.)
4. **Content-Counterbalancing:** Pro Teilnehmer wird einmalig eine feste Auswahl an Übungs*typen* je Pillar gezogen (`assignExercisePlan()`, `useStudyModeState.js:51-61`) und in `localStorage['studyExercisePlan']` gespeichert, sodass Block 1 und Block 2 exakt dieselben Übungstypen nutzen (gepaarter Vergleich klassisch-vs-gamifiziert pro Typ) statt unabhängig neu zu würfeln.
5. Ein separater, unabhängiger Mechanismus (`src/hooks/useStudySet.js`, `src/data/studySets.js`) erlaubt zusätzlich eine **Content**-Gegenbalancierung über einen URL-Parameter `?set=A|B` (welches konkrete Vokabular-Set genutzt wird) — getrennt von der Varianten-Reihenfolge.

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

`useExerciseSession.js`s `activePillarTasks` (`:153-310`) kombiniert: Nutzer-Opt-outs pro Übungstyp (`activeExercises`, siehe unten), Studienmodus-Einschränkung auf den zugewiesenen Plan (falls aktiv), Schwierigkeitsgrad-Filter (exakter oder ±1-Bereich bei aktivierter adaptiver Schwierigkeit, mit Fallback auf „≤ Schwierigkeit" bzw. „alle" bei leerer Trefferliste), Content-Set-Filter (`belongsToActiveSet`, Abschnitt 8) sowie eine seed-basierte, pro Übungstyp getrennte Durchmischung mit anschließendem Round-Robin-Interleaving, damit kein umfangreicher Übungstyp (z. B. viele Graphem-Items) einen kleineren Typ (z. B. wenige Merkspann-Items) in der Session verdrängt.

### Per-Typ-Abwahl (Übungsmanager)

`src/components/ExerciseToggleManager.jsx` (Settings-Tab „Übungen"): Nutzer können einzelne Übungstypen je Pillar deaktivieren (`activeExercises`-Objekt, Default alle aktiv). Eine eingebaute Regel verhindert, dass innerhalb eines Pillars **alle** Typen gleichzeitig deaktiviert werden (zeigt stattdessen eine Warnung).

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

---

## 11. Datenerhebung für die Studie

### Erhobene Nutzungsdaten (Supabase, serverseitig)

Über `src/components/SurveyComponent.tsx` → `POST /.netlify/functions/submit-survey` → Tabelle `ab_study_submissions` (siehe Abschnitt 4) werden **ausschließlich explizit vom Teilnehmenden ausgefüllte Umfrage-Antworten plus Konfigurationskontext** übertragen — **kein** automatisches Hintergrund-Tracking von Klicks/Interaktionen. Konkret pro Einreichung:

- 6 NASA-Raw-TLX-Werte (mental/physical/temporal demand, performance, effort, frustration; Regler 1–100, Default 50, `SurveyComponent.tsx:211-221`).
- 10 SUS-Werte (`sus01`…`sus10`; 5-stufige Radiobuttons, Default 3, `SurveyComponent.tsx:223-237`).
- 8 UEQ-Short-Werte (`ueq01`…`ueq08`; bipolare Item-Paare, 7-stufig, Default 4, `SurveyComponent.tsx:239-250`) — **seit Kurzem ergänzt**, zuvor war UEQ trotz vorbereiteter Übersetzungstexte (`feedback.ueq.*`) nicht in das Formular eingebunden (siehe „Offene Punkte" für den ursprünglichen Befund).
- Bei gamifizierter Bedingung zusätzlich 3 Grywalizations-spezifische Werte (Garten-/Abzeichen-Motivation, Ablenkung; 5-stufig, Default 3, `SurveyComponent.tsx:253-262`) sowie ein optionales Freitextfeld (max. 500 Zeichen, `gameElementFeedback`) zu den erlebten Spielelementen — bei der Basis-Bedingung wird dieser Teil des Formulars gar nicht gerendert und im Payload weggelassen (`isGamified ? gamificationFeedback : {}`, `SurveyComponent.tsx:423`), sodass die entsprechenden DB-Spalten bewusst `NULL` bleiben statt einen bedeutungslosen Wert zu erhalten. Diese Ergänzung adressiert gezielt die Unterfrage, welche Gamification-Elemente von Teilnehmenden als unterstützend, motivierend oder störend wahrgenommen werden.
- Kontextfelder zum Einreichungszeitpunkt: `participantId` (zufällige, lokal generierte ID), `appVersion` (`'basis'`/`'vollversion'`, abgeleitet aus `isGamified`), `userLanguage`, `theme`, `a11yAddons` (Liste aktiver Barrierefreiheits-Kurzbezeichnungen, aus den booleschen Settings abgeleitet), `inclusiveOptions` (Objekt mit u. a. `adaptiveDifficulty`, `bigTargets`, `noFlash`, `audioRewards`, `extendedTime`, `zenMode`, `bionicReading`, `minimalistMode`, `muteNotifications`, `voiceAssistant`), `userDifficulty`, `dailyGoal`.
- Serverseitig (`netlify/functions/submit-survey/index.js:36-121`, Funktion `buildDbData`) werden einige dieser Werte für die Analyse ins Englische übersetzt (z. B. Theme-Namen, Barrierefreiheits-Kürzel, Sprachnamen) und in die finalen Spaltennamen der Tabelle gemappt (u. a. `ueq01`…`ueq08` → `ueq_q01`…`ueq_q08`, `gardenMotivation`/`badgeMotivation`/`gameDistraction`/`gameElementFeedback` → `garden_motivation`/`badge_motivation`/`game_distraction`/`game_element_feedback`, `:101-117`).

### Erhebungszeitpunkt & Trigger

Die Umfrage wird **nicht** mehr automatisch (z. B. nach X Punkten) eingeblendet — ein Kommentar in `useExerciseSession.js:376-381` bestätigt explizit, dass ein früherer, punktebasierter Auto-Trigger entfernt wurde; die Umfrage wird stattdessen vom Nutzer/von der Studienleitung geöffnet (Button in der Navigation, Tastenkürzel Ctrl/Cmd/Alt+S) **oder** automatisch an den beiden Checkpoints des geführten Studienmodus (Ende von Block 1 und Block 2, siehe Abschnitt 8) präsentiert.

### Lokale, nicht an einen Server übertragene Telemetrie (IndexedDB)

Zusätzlich zur Supabase-Übertragung führt die App lokale Nutzungsprotokolle, die **die Anwendung selbst nie an einen Server sendet** (nur für die eigene Anzeige — z. B. Wochenkalender, Tageszusammenfassung im Garten — verwendet):

- IndexedDB-Store `exercise_history` (`ContextMasterDB`, siehe Abschnitt 7): pro abgeschlossener Aufgabe `{ date, type: <Pillar>, correct: boolean }` (`useExerciseSession.js:385-389, 432-436`).
- IndexedDB-Store `daily_progress`: `{ date, points }` pro Tag.
- Ein optionaler, lokal geführter „Workload-Check-in"-Verlauf (`localStorage['cfg_workload_history']`, `VirtualGarden.jsx:166-176`): Selbstauskunft zu kognitiver Belastung/Fokus (je 1–5), auf die letzten 14 Einträge begrenzt, dient ausschließlich der lokalen adaptiven Schwierigkeitssteuerung, wird **nicht** an Supabase übertragen.
- Der IndexedDB-Store `ux_logs` wird angelegt, aber nirgends beschrieben — toter Code ohne erhobene Daten (siehe Abschnitt 12).

### Offline-Robustheit der Datenerhebung

Wie in Abschnitt 3 beschrieben, werden fehlgeschlagene Survey-Submits über eine Service-Worker-`backgroundSync`-Warteschlange bis zu 24 h automatisch wiederholt (`vite.config.js:52-67`); zusätzlich speichert `SurveyComponent.tsx` einen Entwurf der aktuellen Formularantworten in `localStorage` (Präfix `enclaro:survey:v1:`, pro Checkpoint-ID getrennt), der erst nach bestätigtem serverseitigem Erfolg gelöscht wird (`SurveyComponent.tsx:16-53, 152-154, 259`). Nach zwei gescheiterten Sende­versuchen bietet das Formular einen expliziten „Bypass" an, der die Studien-Ablaufsteuerung dennoch weiterschalten lässt, ohne die (weiterhin lokal gespeicherten) Antworten als eingereicht zu markieren (`SurveyComponent.tsx:269-278`).

### Keine Drittanbieter-Analyse

Es sind keine Drittanbieter-Tracking-/Analyse-SDKs eingebunden (Volltextsuche nach Google Analytics, `gtag`, Sentry, Mixpanel, Amplitude, PostHog, Segment, Hotjar über `src/`, `public/`, `index.html` ergab keinen Treffer).

---

## 12. Tests, Linting, bekannte Probleme/TODOs

### Testarchitektur

- **Unit-/Komponententests (Vitest, `jsdom`):** u. a. `src/components/ExerciseContainer.test.jsx`, `src/components/exercises/GraphemePhonemeMatchExercise.test.jsx`, `src/components/LottieAnimation.test.jsx`, `src/data/studySets.test.js`, `src/data/vocabulary.test.js`, `src/hooks/useAutoReadAloud.test.js`, `src/hooks/useExerciseVoice.test.js`, `src/locales/locales.test.ts`, `src/utils/voiceActivityDetector.test.js`, `src/utils/voiceTranscriptMatcher.test.js`, sowie die Netlify-Function-Tests `netlify/functions/submit-survey/index.test.js`.
- **„Produkt-Invarianten"-Tests** (`src/__tests__/productInvariants.test.js`, `src/__tests__/contrastCompliance.test.js`): bewusst als Regressionsschutz für leicht unbemerkt brechende Produktentscheidungen konzipiert (siehe Zitate in Abschnitt 6/7) — Kommentar im Testfile selbst: „Do not ‚fix' a failure here by loosening the assertion — fix the source it's checking instead." (`productInvariants.test.js:6-7`).
- **End-to-End & Accessibility (Playwright):** `tests-playwright/` — `accessibility.spec.js` (automatisierte axe-core-Scans gegen WCAG 2.1 A/AA für Intro, alle drei Pillar-Ansichten, Settings-Dialog, Survey-Dialog; ein Test für ein „Profile"-Dialog ist bewusst `test.skip`, da die zugehörige Route/Komponente entfernt wurde, siehe unten), `cognitive_break.spec.js`, `first_exercise.spec.js`, `i18n_settings.spec.js`, `long_words_rwd.spec.js`, `responsiveness.spec.js`, `virtual_garden.spec.js`, sowie ein generisches `test-1.spec.ts`. Vier Projekte (Desktop Chrome/Firefox, iPad, iPhone X, `playwright.config.js:16-21`).
- Der axe-Scan schließt gezielt nur die von `@floating-ui/react`s Fokus-Trap eingefügten unsichtbaren Fokus-Wächter-Elemente aus (`[data-floating-ui-focus-guard]`, `accessibility.spec.js:39-53`) — sonst keine deaktivierten Regeln.

### Linting/Formatierung

- ESLint 9 Flat-Config (`eslint.config.js`) mit separaten Regelsätzen für Browser-Code (`globals.browser`), den AudioWorklet (`src/workers/recorderWorklet.js`, eigene Worklet-Globals) und Node-Code (Netlify Functions, Skripte, Konfigurationsdateien).
- `jsx-a11y`-`strict`-Regelsatz „per project mandate" (siehe Abschnitt 6).
- Prettier + `prettier-plugin-tailwindcss` (Klassen-Sortierung) + `@trivago/prettier-plugin-sort-imports` (Import-Sortierung), optional automatisiert über einen Git-Pre-Commit-Hook (`git config core.hooksPath .githooks`, README).
- `knip` zur Erkennung ungenutzten Codes ist eingerichtet, aber mit **leerer** Konfiguration (`knip.json` enthält nur `{}`) — keine projektspezifische Einstellung.

### CI-Pipeline

`.github/workflows/ci.yml`: bei Push/PR auf `main`/`master` nacheinander `npm ci` → `npm run lint` → `npm run typecheck` → `npm run check:locales` → `npm run test:run` (Vitest) → `npx playwright install --with-deps` → `npx playwright test`; Playwright-HTML-Report wird als Artefakt hochgeladen.

### Bekannte Probleme, Inkonsistenzen und tote Codepfade (aus dem Code selbst verifiziert)

- **Kein `TODO`/`FIXME`/`XXX`/`HACK`-Kommentar** an irgendeiner Stelle im projekteigenen Quellcode (`src/`, `netlify/`, `scripts/`) gefunden — offene Punkte sind stattdessen, wie oben zitiert, in ausführlichen erklärenden Kommentaren oder in Tests dokumentiert.
- **`docs/`-Verzeichnis fehlt**, wird aber von mehreren Kommentaren weiterhin referenziert (siehe Abschnitt 2).
- **Fokus-Label des Umfrage-Dialogs verweist zeitweise ins Leere:** Das `Dialog`, das `SurveyComponent.tsx` umschließt, trägt durchgehend `aria-labelledby="survey-title"` (`App.jsx:1251`). Nach erfolgreichem Absenden ersetzt `SurveyComponent.tsx` sein gesamtes Markup durch eine Erfolgsansicht (`:494-508`), die **kein** Element mit `id="survey-title"` mehr enthält — für die rund 2 Sekunden, bis der Dialog automatisch schließt (`onSubmitted`-Timer, `:479`), verweist `aria-labelledby` damit auf eine nicht (mehr) existierende ID. Per axe-core-Scan bestätigt (`aria-dialog-name`, „serious"); besteht bereits vor den in diesem Dokument beschriebenen UEQ-Short-/Achievements-Ergänzungen.
- **Kontrastarme Navigationsbeschriftungen:** Ein Live-axe-core-Scan (Desktop-Sidebar) meldet wiederholt `color-contrast`-Verstöße („serious") für mehrere kleine Beschriftungen in `SidebarNav.jsx` — u. a. das Theme-Label (`id="sidebar-theme-label"`, `:121`) und die `text-[9px]`-Beschriftungen unter den Pillar-Icons (`:190, 250, 315, 359, 395`). Nicht Teil der durch `contrastCompliance.test.js` statisch abgedeckten Theme-Farben (Abschnitt 6) — dort wird nur gegen Kern-Theme-Farben getestet, nicht gegen jede tatsächlich gerenderte Textgröße/-farbe-Kombination.
- **`t('error', …)`-Schlüsselkollision in `SurveyComponent.tsx`:** An zwei Stellen (`:446, 456`) wird beim Fehlschlagen der Übermittlung `t('error', 'Wystąpił błąd komunikacji z serwerem.')` aufgerufen. Ein Top-Level-Schlüssel `error` existiert in keiner Sprachdatei — tatsächlich vorhanden ist nur `voice.error` (ein Array zufälliger gesprochener Ermutigungs-Phrasen, `src/locales/de/translation.json:70-77`), ein anderer Zweck. `t()` löst den nicht existierenden Schlüssel daher nie auf und zeigt **immer** den hartkodierten polnischen Default-Text, unabhängig von der gewählten UI-Sprache. Derselbe Fehlerklasse betraf zuvor auch die Erfolgsmeldung (`t('success', …)` kollidierte mit `voice.success`) — dort wurde er durch einen eigenen Schlüssel `feedback.successHeading` behoben (siehe `SurveyComponent.tsx:503`); der Fehlerfall-Text wurde bislang **nicht** analog korrigiert.
- **React-Warnung „Cannot update a component (`GamificationProvider`) while rendering a different component (`AppContent`)":** in der Browser-Konsole reproduzierbar beobachtet (u. a. beim Öffnen des virtuellen Gartens im Studienmodus). Ursache: `App.jsx:279-280` ruft während des Renderns von `AppContent` (`App.jsx:71`) `setIsGamified(...)` auf — den Setter aus `GamificationContext`, dessen zugehöriger State aber in der separaten `GamificationProvider`-Komponente lebt (`GamificationContext.jsx:4`, eingehängt in `App.jsx:1346-1352`). Das im übrigen Code etablierte „State-Anpassung während des Renderns"-Muster (z. B. `App.jsx:270-274` für `prevIsGamified`) ist laut React nur für den **eigenen** State einer Komponente sanktioniert — das Setzen des States einer *anderen* Komponente während des Renderns (hier: des Providers, aus Sicht von `AppContent`) ist der eigentliche Auslöser dieser Warnung. Funktional bislang ohne beobachtete Fehlfunktion, aber ein von React offiziell nicht unterstütztes Muster — UNKLAR, ob dies unter zukünftigen React-Versionen zu tatsächlichen Bugs führen könnte.
- **Nicht genutzte RLS-Policies:** Die `anon`/`authenticated`-Policies in `supabase/00_survey_schema.sql` (öffentliches `SELECT` **und** `INSERT`) werden von keinem Code in diesem Repository genutzt, da weder ein frontend-seitiger Supabase-Client noch ein `anon`-Key im Repository vorkommen — die einzige schreibende Instanz (die Netlify Function) nutzt den RLS-umgehenden `service_role`-Key (siehe Abschnitt 4).
- **Fehlende Security-Header/Redirects in `netlify.toml`** (siehe Abschnitt 5).
- **Dokumentierte Inhalts-Lücken:** `src/data/vocabulary_de_gaps.md` (auf Polnisch verfasst) listet automatisiert generiert 32 Einträge in den Kategorien `phonemes`/`context`, denen in der deutschen Vokabeldatenbank mehrsprachige `hint`/`question`-Übersetzungen fehlen — laut eigener Aussage ohne Funktionsauswirkung (der Loader lädt ohnehin nur die aktive Sprache), aber relevant für eine sprachvergleichende Auswertung im Rahmen der Masterarbeit.
- **`check-sets.mjs`** dokumentiert zur Laufzeit zusätzlich vorbestehende, nicht 1:1 übereinstimmende Item-ID-Mengen zwischen den drei Sprachdatenbanken für einzelne (Sprache, Pillar)-Kombinationen (wird als „übersprungen", nicht als Fehler behandelt).
- **Entfernte Funktionalität mit Code-Nachwirkungen:** Ein `UserProfileDashboard`-Feature (Route `/#/profile`) wurde vollständig aus `src/` entfernt; der zugehörige Playwright-Test ist als `test.skip` stehen geblieben (`tests-playwright/accessibility.spec.js`, Kommentar dort), und die i18n-Datei `profileDashboard.json` existiert je Sprache weiterhin als ungenutztes Scaffold (laut Kommentar in `src/locales/index.js`).
- **Kein Icon mit `purpose: 'maskable'`** im PWA-Manifest (siehe Abschnitt 3).
- **Keine Prüfung von Interpolations-Platzhaltern** zwischen Sprachen in `check-locales.mjs` (siehe Abschnitt 10).

---

## Zusammenfassung: Offene Punkte und technische Schulden

1. `docs/`-Verzeichnis fehlt trotz fortbestehender Verweise im Code (README, mehrere Kommentare, ein Playwright-Test) — entweder wiederherstellen oder alle Verweise bereinigen.
2. Der Umfrage-`Dialog` behält `aria-labelledby="survey-title"` auch auf der Erfolgsansicht, die kein Element mit dieser ID mehr rendert — für ~2 s vor dem automatischen Schließen zeigt der Dialog auf eine nicht existierende ID (axe-core: `aria-dialog-name`, „serious").
3. Mehrere kleine Navigationsbeschriftungen (Theme-Label, Pillar-Unterbeschriftungen in `SidebarNav.jsx`) fallen bei einem Live-axe-core-Scan durch `color-contrast` („serious") — nicht durch die statischen Theme-Farb-Tests abgedeckt.
4. `t('error', …)` in `SurveyComponent.tsx` löst wegen einer Namenskollision mit `voice.error` nie den beabsichtigten, sprachabhängigen Text auf und zeigt bei fehlgeschlagener Übermittlung immer den hartkodierten polnischen Fallback-Text — unabhängig von der UI-Sprache. Derselbe Fehlerklasse betraf zuvor `t('success', …)`, wurde dort aber bereits durch einen eigenen Schlüssel behoben; der Fehlerfall ist noch offen.
5. React-Warnung „Cannot update a component (`GamificationProvider`) while rendering a different component (`AppContent`)" — `App.jsx` setzt während des eigenen Renderns den State einer anderen (Provider-)Komponente; ein von React nicht sanktioniertes Muster, bislang ohne beobachtete Fehlfunktion.
6. Ungenutzte, öffentlich lesende **und** öffentlich schreibende RLS-Policies (`anon`/`authenticated`) auf einer Tabelle mit Studien-Rohdaten, obwohl der einzige aktive Schreibpfad den RLS-umgehenden `service_role`-Key nutzt — sicherheitsrelevant zu prüfen, falls der `anon`-Key jemals clientseitig exponiert werden sollte.
7. Keine Security-Header (CSP, `X-Frame-Options` etc.) und keine expliziten Redirects in `netlify.toml`.
8. Dokumentierte, mehrsprachige Content-Lücken in `vocabulary_de.js` (32 Einträge ohne vollständige Drei-Sprachen-Abdeckung von `hint`/`question`) sowie vorbestehende Item-ID-Abweichungen zwischen den Sprachdatenbanken (`check-sets.mjs`).
9. Überbleibsel eines entfernten „UserProfileDashboard"-Features (übersprungener Test, ungenutzte `profileDashboard.json`-Übersetzungsdatei).
10. `knip.json` ist konfigurationslos (`{}`) — Potenzial für striktere Dead-Code-Erkennung ungenutzt.
11. Kein PWA-Icon mit `purpose: 'maskable'`.
12. `check-locales.mjs` prüft nur Schlüssel-Existenz, keine Konsistenz von Interpolations-Platzhaltern zwischen Sprachen.
13. Laufzeit-Kontrastprüfung (`useThemeCSSVariables.js`) ist auf den Entwicklungsmodus beschränkt (nur `console.warn`) — keine erzwungene Compliance-Prüfung in Produktion (durch die begleitenden Vitest-Tests jedoch statisch abgedeckt).

*Inzwischen behoben (nicht mehr Teil der offenen Punkte, im Text oben entsprechend aktualisiert): die README-Diskrepanz „Coins and a theme shop", der `growthValue`-Kommentar in `useGamificationState.js`, die „OpenDyslexic"-Erwähnung in den UI-Texten, der tote IndexedDB-Store `ux_logs`, die verwaiste `public/netlify-forms.html` sowie der irreführende Name des Export-Skripts (jetzt `scripts/export-survey-data.js`).*

---

*Hinweis zur Methodik: Diese Beschreibung wurde durch direkte Lektüre der genannten Quelldateien sowie durch mehrere unabhängige, arbeitsteilige Code-Recherchen (mit anschließender Verifikation der zentralen Befunde durch erneutes Lesen der Originaldateien) erstellt. Sämtliche Zahlen, Konstanten und Verhaltensbeschreibungen sind mit Dateipfad referenziert; Aussagen ohne eindeutigen Codebeleg sind als UNKLAR gekennzeichnet.*
