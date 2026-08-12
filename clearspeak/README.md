# 🧠 EnClaro

> Accessible, gamified Progressive Web App supporting reading, writing, visual, and cognitive exercises for people with dyslexia. Built as part of a Master's thesis.

**🇬🇧 [English](#-english)** · **🇩🇪 [Deutsch](#-deutsch)**

---

## 🇬🇧 English

EnClaro is a fully responsive, accessibility-first (WCAG 2.1 AA) Progressive Web App offering literacy, visual, and cognitive exercises for adults with dyslexia. It works offline, supports Polish, English, and German, and includes an optional gamified mode alongside a plain "learning only" mode.

### ✨ Key Features

**Accessibility & personalization**

- OpenDyslexic-style friendly font, adjustable letter/word spacing, and larger text
- Bionic Reading (bolded word-openings to aid visual fixation)
- High-contrast theme, colorblind-safe palettes, and a desaturated/calm color mode
- "Motorik" mode — enlarged touch targets (56×56px minimum) for motor-impairment support
- Zen Mode / Reduced Motion — disables animation, flashing, and non-essential UI
- Focus Ruler for tracking a line of text while reading
- Full keyboard navigation (Ctrl+1–4 shortcuts) and screen-reader support (semantic HTML, ARIA live regions, focus traps in dialogs)

**Voice assistant**

- Text-to-speech reads instructions, options, and feedback aloud, with adjustable voice/speed/pitch
- Speech-recognition voice input lets learners answer, skip, or check exercises hands-free
- Automatically pauses and switches language mid-session when the UI language changes

**Gamification**

- Virtual Garden — a growing ecosystem that reflects daily progress and streaks
- Coins and a theme shop (Nature, Music, Art, Space, Ocean)
- Cognitive-load tracking that gently suggests a break after a run of mistakes
- A non-gamified "Learning Only" mode for users who prefer a plain interface

**PWA & offline**

- Installable on desktop and mobile, works fully offline via a Service Worker
- Custom install prompt and update banner
- Unintrusive offline-status indicator

### 🧩 Exercise Pillars

- **📖 Literacy** — phonemes, syllables, graphemes/spelling rules, auditory discrimination, vocabulary, Scrabble-style word building, look-cover-write-check, sentence context, dictation, read-aloud, reading comprehension, rhythm
- **👁️ Visual** — clock reading, visual tracking (b/d, p/q-style discrimination), mirror-image recognition, odd-one-out
- **🧩 Cognitive** — categorization (drag-and-drop, tap-to-place), sequencing, memory span, logical reasoning, rhythm memory, melody memory

An unconditional diagnostic pool is interleaved into each pillar for first-time assessment, independent of which exercise types a user has enabled in Settings.

### 🔬 Research instrumentation

For the accompanying thesis study, the app includes a NASA-TLX (cognitive load) and SUS (usability) survey, submitted via a Netlify serverless function to a Supabase (PostgreSQL) table with row-level security, service-role write access, and input validation on the backend.

### 🏗️ Tech Stack

- **Frontend:** React 19, Vite
- **Styling:** Tailwind CSS 4
- **State:** React Context (no Redux)
- **i18n:** i18next — Polish, English, German
- **PWA:** vite-plugin-pwa (Workbox)
- **Local storage:** IndexedDB (progress, telemetry)
- **Backend (survey):** Netlify Functions + Supabase
- **Testing:** Vitest + React Testing Library (unit), Playwright + axe-core (E2E & accessibility)

### 📂 Project Structure

```text
clearspeak/
├── netlify/functions/       # Serverless functions (survey submission → Supabase)
├── src/
│   ├── components/
│   │   ├── common/          # Shared buttons, BionicText, TTSController, Dialog
│   │   ├── exercises/       # One component per exercise type
│   │   ├── App.jsx          # Layout, routing, and session orchestration
│   │   ├── VirtualGarden.jsx
│   │   └── SettingsModal.jsx
│   ├── data/                # Per-language vocabulary/exercise databases
│   ├── hooks/                # Custom hooks (voice, TTS, cognitive load, IndexedDB, ...)
│   ├── i18n/                 # i18next configuration
│   ├── locales/              # Translation JSON per language
│   └── utils/
└── tests-playwright/          # End-to-end and accessibility test suites
```

### 🚀 Getting Started

**Requirements:** Node.js 18+

```bash
git clone <repository-url>
cd clearspeak
npm install
npm run dev        # http://localhost:5173
```

For the survey/Supabase-backed function to resolve locally, run `npx netlify dev` instead of plain `npm run dev` (see `netlify.toml`).

**Build & test**

```bash
npm run build       # production build
npm run test:run    # unit tests (Vitest)
npm run test:e2e     # end-to-end + accessibility tests (Playwright)
npm run lint         # ESLint
npm run typecheck    # TypeScript
```

---

## 🇩🇪 Deutsch

EnClaro ist eine vollständig responsive, barrierefreie (WCAG 2.1 AA) Progressive Web App mit Lese-, Schreib-, visuellen und kognitiven Übungen für Erwachsene mit Legasthenie. Die App funktioniert offline, unterstützt Polnisch, Englisch und Deutsch und bietet neben einem spielerischen Modus auch einen schlichten "Nur Lernen"-Modus.

### ✨ Hauptfunktionen

**Barrierefreiheit & Personalisierung**

- Legasthenie-freundliche Schriftart, einstellbarer Buchstaben-/Wortabstand und größerer Text
- Bionic Reading (fett hervorgehobene Wortanfänge zur besseren visuellen Fixierung)
- Hoher Kontrast, farbenblindsichere Paletten und ein entsättigter/beruhigter Farbmodus
- "Motorik"-Modus — vergrößerte Tippflächen (mindestens 56×56px) für Menschen mit motorischen Einschränkungen
- Zen-Modus / reduzierte Bewegung — deaktiviert Animationen, Blinken und nicht notwendige UI-Elemente
- Lese-Lineal zur Zeilenverfolgung beim Lesen
- Vollständige Tastaturnavigation (Strg+1–4) und Screenreader-Unterstützung (semantisches HTML, ARIA-Live-Regionen, Fokus-Fallen in Dialogen)

**Sprachassistent**

- Text-to-Speech liest Anweisungen, Antwortoptionen und Rückmeldungen vor, mit einstellbarer Stimme/Geschwindigkeit/Tonhöhe
- Spracherkennung ermöglicht freihändiges Antworten, Überspringen oder Prüfen von Übungen
- Pausiert automatisch und wechselt die Sprache, sobald die Oberflächensprache während der Sitzung geändert wird

**Gamification**

- Virtueller Garten — ein wachsendes Ökosystem, das täglichen Fortschritt und Serien widerspiegelt
- Münzen und ein Themen-Shop (Natur, Musik, Kunst, Weltraum, Ozean)
- Erfassung der kognitiven Belastung, die nach einer Reihe von Fehlern sanft eine Pause vorschlägt
- Ein nicht-spielerischer "Nur Lernen"-Modus für Nutzer, die eine schlichte Oberfläche bevorzugen

**PWA & Offline**

- Installierbar auf Desktop und Mobilgeräten, funktioniert dank Service Worker vollständig offline
- Eigene Installationsaufforderung und Update-Banner
- Dezenter Offline-Status-Hinweis

### 🧩 Übungsbereiche

- **📖 Literacy (Lesen & Schreiben)** — Phoneme, Silben, Grapheme/Rechtschreibregeln, auditive Unterscheidung, Wortschatz, Scrabble-artiges Wörterbilden, Look-Cover-Write-Check, Satzkontext, Diktat, Lautlesen, Leseverständnis, Rhythmus
- **👁️ Visuell** — Uhrzeit lesen, visuelle Verfolgung (b/d-, p/q-Unterscheidung), Spiegelbild-Erkennung, "Was passt nicht"
- **🧩 Logik & Gedächtnis** — Kategorisierung (Drag-and-drop bzw. Tippen-zum-Platzieren), Sequenzierung, Merkspanne, logisches Schlussfolgern, Rhythmus-Gedächtnis, Melodie-Gedächtnis

In jeden Bereich ist zusätzlich ein unbedingt aktiver Diagnosepool für die Ersteinschätzung eingebunden — unabhängig davon, welche Übungstypen in den Einstellungen aktiviert sind.

### 🔬 Forschungsinstrumentierung

Für die begleitende Masterarbeit enthält die App eine NASA-TLX-Umfrage (kognitive Belastung) sowie eine SUS-Umfrage (Usability). Die Einsendung erfolgt über eine Netlify-Serverless-Funktion in eine Supabase-Tabelle (PostgreSQL) mit Row-Level-Security, Schreibzugriff nur über den Service-Role-Key und serverseitiger Eingabevalidierung.

### 🏗️ Technologie-Stack

- **Frontend:** React 19, Vite
- **Styling:** Tailwind CSS 4
- **State:** React Context (kein Redux)
- **i18n:** i18next — Polnisch, Englisch, Deutsch
- **PWA:** vite-plugin-pwa (Workbox)
- **Lokaler Speicher:** IndexedDB (Fortschritt, Telemetrie)
- **Backend (Umfrage):** Netlify Functions + Supabase
- **Tests:** Vitest + React Testing Library (Unit), Playwright + axe-core (E2E & Barrierefreiheit)

### 📂 Projektstruktur

```text
clearspeak/
├── netlify/functions/       # Serverless-Funktionen (Umfrageeinsendung → Supabase)
├── src/
│   ├── components/
│   │   ├── common/          # Gemeinsame Buttons, BionicText, TTSController, Dialog
│   │   ├── exercises/       # Eine Komponente pro Übungstyp
│   │   ├── App.jsx          # Layout, Routing und Sitzungssteuerung
│   │   ├── VirtualGarden.jsx
│   │   └── SettingsModal.jsx
│   ├── data/                # Wortschatz-/Übungsdatenbanken je Sprache
│   ├── hooks/                # Eigene Hooks (Sprache, TTS, kognitive Last, IndexedDB, ...)
│   ├── i18n/                 # i18next-Konfiguration
│   ├── locales/              # Übersetzungs-JSON je Sprache
│   └── utils/
└── tests-playwright/          # End-to-End- und Barrierefreiheitstests
```

### 🚀 Lokale Ausführung

**Voraussetzungen:** Node.js 18+

```bash
git clone <repository-url>
cd clearspeak
npm install
npm run dev        # http://localhost:5173
```

Damit die umfrage-/Supabase-gestützte Funktion lokal erreichbar ist, `npx netlify dev` statt des einfachen `npm run dev` ausführen (siehe `netlify.toml`).

**Build & Tests**

```bash
npm run build       # Produktions-Build
npm run test:run    # Unit-Tests (Vitest)
npm run test:e2e     # End-to-End- und Barrierefreiheitstests (Playwright)
npm run lint         # ESLint
npm run typecheck    # TypeScript
```
