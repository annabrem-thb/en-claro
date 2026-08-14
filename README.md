# 🧠 EnClaro

> Accessible, gamified Progressive Web App supporting reading, writing, visual, and cognitive exercises for people with dyslexia. Built as part of a Master's thesis.

**🇬🇧 [English](#-english)** · **🇩🇪 [Deutsch](#-deutsch)** · **🇵🇱 [Polski](#-polski)**

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
- On Chromium browsers this uses the native Web Speech API; on browsers without it (Firefox, Safari, ...), the app offers an on-device Whisper model (via Transformers.js) as a fallback — downloaded once, entirely local, no audio ever leaves the device
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
.
├── netlify/functions/        # Serverless functions (survey submission → Supabase)
├── supabase/                 # Supabase (PostgreSQL) schema for the survey table
├── scripts/                  # Maintainer scripts (e.g. exporting survey data to CSV)
├── docs/                     # Development notes (bundle size, screen-reader walkthrough, ...)
├── src/
│   ├── components/
│   │   ├── common/           # Shared buttons, BionicText, TTSController, Dialog
│   │   ├── exercises/        # One component per exercise type
│   │   ├── App.jsx           # Layout, routing, and session orchestration
│   │   ├── VirtualGarden.jsx
│   │   └── SettingsModal.jsx
│   ├── data/                 # Per-language vocabulary/exercise databases
│   ├── hooks/                 # Custom hooks (voice, TTS, cognitive load, IndexedDB, ...)
│   ├── i18n/                  # i18next configuration
│   ├── locales/                # Translation JSON per language
│   ├── workers/                # Web Workers (local Whisper ASR, mic recorder AudioWorklet)
│   └── utils/
└── tests-playwright/           # End-to-end and accessibility test suites
```

### 🚀 Getting Started

**Requirements:** Node.js 18+

```bash
git clone <repository-url>
cd dyslexia-pwa
npm install
npm run dev        # http://localhost:5173
```

Optional but recommended: enable the pre-commit formatting hook (Prettier via lint-staged) once per clone:

```bash
git config core.hooksPath .githooks
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
- In Chromium-Browsern wird die native Web Speech API genutzt; in Browsern ohne diese (Firefox, Safari, ...) bietet die App als Fallback ein lokal laufendes Whisper-Modell (via Transformers.js) — einmalig heruntergeladen, vollständig lokal, keine Audiodaten verlassen das Gerät
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
.
├── netlify/functions/         # Serverless-Funktionen (Umfrageeinsendung → Supabase)
├── supabase/                  # Supabase-(PostgreSQL-)Schema für die Umfragetabelle
├── scripts/                   # Wartungsskripte (z. B. Umfragedaten-Export als CSV)
├── docs/                      # Entwicklungsnotizen (Bundle-Größe, Screenreader-Walkthrough, ...)
├── src/
│   ├── components/
│   │   ├── common/            # Gemeinsame Buttons, BionicText, TTSController, Dialog
│   │   ├── exercises/         # Eine Komponente pro Übungstyp
│   │   ├── App.jsx            # Layout, Routing und Sitzungssteuerung
│   │   ├── VirtualGarden.jsx
│   │   └── SettingsModal.jsx
│   ├── data/                  # Wortschatz-/Übungsdatenbanken je Sprache
│   ├── hooks/                  # Eigene Hooks (Sprache, TTS, kognitive Last, IndexedDB, ...)
│   ├── i18n/                   # i18next-Konfiguration
│   ├── locales/                 # Übersetzungs-JSON je Sprache
│   ├── workers/                 # Web Worker (lokales Whisper-ASR, Mikrofon-AudioWorklet)
│   └── utils/
└── tests-playwright/            # End-to-End- und Barrierefreiheitstests
```

### 🚀 Lokale Ausführung

**Voraussetzungen:** Node.js 18+

```bash
git clone <repository-url>
cd dyslexia-pwa
npm install
npm run dev        # http://localhost:5173
```

Optional, aber empfohlen: den Pre-Commit-Formatierungs-Hook (Prettier via lint-staged) einmal pro Clone aktivieren:

```bash
git config core.hooksPath .githooks
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

---

## 🇵🇱 Polski

EnClaro to w pełni responsywna, zaprojektowana z myślą o dostępności (WCAG 2.1 AA) progresywna aplikacja webowa (PWA) oferująca ćwiczenia czytania, pisania, wzrokowe i poznawcze dla dorosłych z dysleksją. Działa offline, obsługuje język polski, angielski i niemiecki, i zawiera opcjonalny tryb grywalizacji obok trybu "tylko nauka".

### ✨ Kluczowe funkcje

**Dostępność i personalizacja**

- Czcionka przyjazna osobom z dysleksją (w stylu OpenDyslexic), regulowane odstępy między literami/słowami oraz większy tekst
- Bionic Reading (pogrubione początki słów wspomagające fiksację wzroku)
- Motyw wysokiego kontrastu, palety bezpieczne dla osób z zaburzeniami rozpoznawania barw oraz stonowany/spokojny tryb kolorystyczny
- Tryb "Motoryka" — powiększone obszary dotykowe (min. 56×56px) dla osób z ograniczeniami motorycznymi
- Tryb Zen / ograniczony ruch — wyłącza animacje, migotanie i zbędne elementy interfejsu
- Linijka skupienia (Focus Ruler) do śledzenia linii tekstu podczas czytania
- Pełna nawigacja klawiaturą (skróty Ctrl+1–4) i wsparcie czytników ekranu (semantyczny HTML, regiony ARIA live, pułapki fokusu w oknach dialogowych)

**Asystent głosowy**

- Synteza mowy (TTS) odczytuje instrukcje, opcje i informacje zwrotne na głos, z regulowanym głosem/tempem/wysokością
- Rozpoznawanie mowy pozwala odpowiadać, pomijać lub sprawdzać ćwiczenia bez użycia rąk
- W przeglądarkach opartych na Chromium wykorzystywane jest natywne Web Speech API; w przeglądarkach bez tego wsparcia (Firefox, Safari, ...) aplikacja oferuje jako rozwiązanie zastępcze lokalny model Whisper (przez Transformers.js) — pobierany jednorazowo, działający w pełni lokalnie, żadne dane audio nie opuszczają urządzenia
- Automatycznie pauzuje i przełącza język w trakcie sesji, gdy zmienia się język interfejsu

**Grywalizacja**

- Wirtualny Ogród — rozwijający się ekosystem odzwierciedlający codzienne postępy i serie
- Monety i sklep z motywami (Natura, Muzyka, Sztuka, Kosmos, Ocean)
- Śledzenie obciążenia poznawczego, które delikatnie sugeruje przerwę po serii błędów
- Niegrywalizowany tryb "Tylko nauka" dla użytkowników preferujących prosty interfejs

**PWA i offline**

- Możliwość instalacji na komputerze i urządzeniach mobilnych, pełne działanie offline dzięki Service Workerowi
- Własny monit instalacyjny i baner aktualizacji
- Dyskretny wskaźnik statusu offline

### 🧩 Filary ćwiczeń

- **📖 Umiejętność czytania i pisania** — fonemy, sylaby, grafemy/zasady ortografii, dyskryminacja słuchowa, słownictwo, budowanie słów w stylu Scrabble, look-cover-write-check, kontekst zdaniowy, dyktando, czytanie na głos, rozumienie tekstu, rytm
- **👁️ Wzrokowe** — odczytywanie zegara, śledzenie wzrokowe (rozróżnianie typu b/d, p/q), rozpoznawanie odbicia lustrzanego, "co nie pasuje"
- **🧩 Poznawcze** — kategoryzacja (przeciągnij i upuść, dotknij, aby umieścić), sekwencjonowanie, zakres pamięci, rozumowanie logiczne, pamięć rytmu, pamięć melodii

Do każdego filaru dołączona jest bezwarunkowa pula diagnostyczna do wstępnej oceny, niezależnie od tego, które typy ćwiczeń użytkownik włączył w ustawieniach.

### 🔬 Instrumentarium badawcze

Na potrzeby towarzyszącego badania w ramach pracy magisterskiej aplikacja zawiera ankiety NASA-TLX (obciążenie poznawcze) i SUS (użyteczność), przesyłane za pomocą funkcji serverless Netlify do tabeli Supabase (PostgreSQL) z zabezpieczeniami na poziomie wierszy (row-level security), zapisem wyłącznie przez klucz service-role oraz walidacją danych po stronie serwera.

### 🏗️ Stos technologiczny

- **Frontend:** React 19, Vite
- **Stylowanie:** Tailwind CSS 4
- **Stan:** React Context (bez Reduxa)
- **i18n:** i18next — polski, angielski, niemiecki
- **PWA:** vite-plugin-pwa (Workbox)
- **Pamięć lokalna:** IndexedDB (postępy, telemetria)
- **Backend (ankieta):** Netlify Functions + Supabase
- **Testy:** Vitest + React Testing Library (jednostkowe), Playwright + axe-core (E2E i dostępność)

### 📂 Struktura projektu

```text
.
├── netlify/functions/        # Funkcje serverless (przesyłanie ankiety → Supabase)
├── supabase/                 # Schemat Supabase (PostgreSQL) dla tabeli ankiety
├── scripts/                  # Skrypty dla opiekunów projektu (np. eksport danych ankiety do CSV)
├── docs/                     # Notatki deweloperskie (rozmiar paczki, przewodnik po czytniku ekranu, ...)
├── src/
│   ├── components/
│   │   ├── common/           # Wspólne przyciski, BionicText, TTSController, Dialog
│   │   ├── exercises/        # Jeden komponent na typ ćwiczenia
│   │   ├── App.jsx           # Układ, routing i orkiestracja sesji
│   │   ├── VirtualGarden.jsx
│   │   └── SettingsModal.jsx
│   ├── data/                 # Bazy słownictwa/ćwiczeń dla każdego języka
│   ├── hooks/                 # Własne hooki (głos, TTS, obciążenie poznawcze, IndexedDB, ...)
│   ├── i18n/                  # Konfiguracja i18next
│   ├── locales/                # Pliki JSON tłumaczeń dla każdego języka
│   ├── workers/                # Web Workery (lokalne ASR Whisper, AudioWorklet mikrofonu)
│   └── utils/
└── tests-playwright/           # Zestawy testów end-to-end i dostępności
```

### 🚀 Pierwsze kroki

**Wymagania:** Node.js 18+

```bash
git clone <repository-url>
cd dyslexia-pwa
npm install
npm run dev        # http://localhost:5173
```

Opcjonalnie, ale zalecane: włączenie pre-commitowego hooka formatowania (Prettier przez lint-staged) jednorazowo dla każdego klona:

```bash
git config core.hooksPath .githooks
```

Aby funkcja ankiety oparta na Supabase działała lokalnie, uruchom `npx netlify dev` zamiast zwykłego `npm run dev` (patrz `netlify.toml`).

**Build i testy**

```bash
npm run build       # build produkcyjny
npm run test:run    # testy jednostkowe (Vitest)
npm run test:e2e     # testy end-to-end i dostępności (Playwright)
npm run lint         # ESLint
npm run typecheck    # TypeScript
```
