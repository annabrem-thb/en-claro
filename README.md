# En-Claro

> Accessible Progressive Web App with reading, writing, visual, and cognitive exercises for adults with dyslexia, with an optional gamified mode. Built for a Master's thesis that compares a plain and a gamified version of the app.

[English](#english) · [Deutsch](#deutsch) · [Polski](#polski)

---

## English

En-Claro is a responsive Progressive Web App (PWA) with literacy, visual, and cognitive exercises for adults with dyslexia. It is available in Polish, English, and German (the interface starts in the browser's language) and can be used in a plain "learning only" mode or in a gamified mode with a virtual garden. The app was designed to meet WCAG 2.1 AA and is checked with automated axe-core tests.

### Features

**Accessibility and personalization**

All options are off by default and can be combined freely in Settings.

- Reading spacing preset plus sliders for UI text size (up to 28 px), exercise text size (up to 32 px), line height, letter spacing, word spacing, and paragraph spacing
- Bionic Reading (bold word beginnings)
- High contrast, colorblind-safe colors, and a desaturated color mode
- Motor-skills mode with enlarged touch targets (at least 56 x 56 px), plus an option for big targets and extended time (slower speech)
- Zen mode, reduced motion, and a "no flashing" option
- Focus ruler for following a line of text
- Keyboard operation (Arrow keys and Enter for the next exercise; Ctrl/Cmd/Alt + 1-4 for the exercise areas and the garden, + `,` for Settings, + `S` for the survey) and screen-reader support (semantic landmarks, ARIA live regions, focus traps in dialogs, skip link)

**Voice**

- Text-to-speech reads instructions, options, and feedback aloud, with adjustable voice, speed, pitch, and volume. If the browser has no system voices (for example desktop Firefox), the app falls back to the bundled meSpeak engine.
- Voice input lets learners answer, skip, or check exercises. Chromium browsers use the native Web Speech API, which, depending on the browser vendor, may send the recording to an online service. Other browsers can use an on-device Whisper model (Transformers.js) after the user consents; the audio stays on the device, but the model files are downloaded once from third-party hosts (Hugging Face and jsDelivr).

**Gamification (optional)**

- Virtual garden that grows with correct answers: a level-up message every 5 points and a new tree every 10 points
- Daily goal (5, 10, 15, or 20 minutes) with a weekly calendar, a few achievement badges, and a "share progress" button
- Five freely selectable color themes (Nature, Music, Art, Space, Ocean)
- Optional break suggestion after a run of mistakes, with a cognitive-energy indicator
- A plain "learning only" mode without any of these elements

**PWA and offline**

- Installable on desktop and mobile (custom install button in the navigation)
- The app shell, exercises, and vocabulary are precached by a Service Worker and work offline; updates install automatically
- Offline indicator. Voice input with Whisper needs a connection for the first model download, and survey submissions are queued and retried for up to 24 hours (Background Sync).

### Exercises

All exercise types can be switched off individually in Settings. An initial diagnostic pool stays active.

- **Literacy:** phonemes, syllables, graphemes and spelling rules, grapheme-phoneme matching, auditory discrimination, vocabulary, Scrabble-style word building, look-cover-write-check, sentence context, dictation, read-aloud, reading comprehension, rhythm
- **Visual:** clock reading, visual tracking, mirror-image recognition, odd-one-out
- **Cognitive:** categorization, sequencing, memory span, logical reasoning, rhythm memory, melody memory

### Study mode and research instrumentation

The app contains the instruments of the thesis study. On first start, the study mode is switched on (it can be turned off in the introduction):

1. **Consent screen** once before the first block (age confirmation and consent to storage and analysis of the answers; no names or contact data are collected).
2. **Two exercise blocks** of 15 tasks each (8 literacy, 3 visual, 4 cognitive): one without and one with game elements. The starting order is assigned by a coin flip and remembered on the device (`?order=classicFirst` or `?order=gamifiedFirst` overrides it). Block 1 and block 2 use different content sets (A and B). In the gamified block, a garden stop comes before the survey.
3. **A questionnaire after each block:** NASA-RTLX (6 sliders, 0-100), SUS (10 items), UEQ-S (8 item pairs), two items on concentration and perseverance, and, after the gamified block only, feedback on the garden and badges. The questionnaire after block 2 also asks four questions about the person (dyslexia status, work in speech therapy, age group, first language), each with a "no answer" option.

Answers are sent with a random identifier to a Netlify Function (`submit-survey`), which validates the payload and writes it to the Supabase table `ab_study_submissions`. Row Level Security is enabled without a public policy, so only the function and the export script (service-role key) can access the table. Unsent answers are kept in the browser, and an emergency bypass appears after repeated failures.

### Tech stack

- **Frontend:** React 19, Vite 8, Tailwind CSS 4, TypeScript for the survey component
- **State and storage:** React Context (no Redux), `localStorage`, IndexedDB
- **i18n:** i18next (Polish, English, German)
- **PWA:** vite-plugin-pwa (Workbox, `generateSW`)
- **Voice:** Web Speech API, meSpeak, Transformers.js (Whisper) in Web Workers
- **UI components:** `@floating-ui/react` (dialogs, focus management), Lottie
- **Backend (survey):** Netlify Functions + Supabase (PostgreSQL)
- **Testing:** Vitest + React Testing Library (unit), Playwright + axe-core (end-to-end and accessibility)

### Project structure

```text
.
├── netlify/functions/submit-survey/  # Serverless function: validates and stores survey answers
├── supabase/                         # SQL schema for the survey table
├── scripts/                          # export-survey-data.js (CSV export), workflow example
├── public/                           # Icons, robots.txt, survey payload types
├── src/
│   ├── components/
│   │   ├── common/                   # Dialog, BionicText, TTS and voice controls, ...
│   │   ├── exercises/                # One component per exercise type
│   │   ├── App.jsx                   # Layout, routing, session orchestration
│   │   ├── SurveyComponent.tsx       # Questionnaires
│   │   ├── StudyConsentScreen.jsx    # Consent screen of the study mode
│   │   ├── VirtualGarden.jsx
│   │   └── SettingsModal.jsx
│   ├── data/                         # Vocabulary and exercise data per language, study sets, themes
│   ├── hooks/                        # Settings, gamification, study mode, voice, TTS, IndexedDB, ...
│   ├── i18n/                         # i18next configuration
│   ├── locales/                      # Translations per language (de, en, pl)
│   ├── workers/                      # Web Workers: Whisper, meSpeak, recorder worklet
│   ├── styles/                       # Design tokens and accessibility overrides
│   └── utils/
├── tests-playwright/                 # End-to-end and accessibility tests
├── check-locales.mjs, check-sets.mjs, audit-vocabulary.mjs   # Data consistency checks
└── patches/                          # Patch for meSpeak (applied on npm install)
```

### Getting started

**Requirements:** Node.js 20.19+ or 22.12+ (required by Vite 8)

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

The survey function needs Supabase credentials. Copy `.env.example` to `.env` and fill in `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (never commit them), then run `npx netlify dev` instead of `npm run dev` so that `/.netlify/functions/*` resolves locally (see `netlify.toml`). Create the table with `supabase/00_survey_schema.sql`.

| Command                             | Purpose                                                                        |
| ----------------------------------- | ------------------------------------------------------------------------------ |
| `npm run build` / `npm run preview` | Production build / local preview                                               |
| `npm run test:run`                  | Unit tests (Vitest)                                                            |
| `npm run test:e2e`                  | End-to-end and accessibility tests (Playwright)                                |
| `npm run lint`, `npm run typecheck` | ESLint, TypeScript                                                             |
| `npm run check:locales`             | Checks that all languages have the same translation keys                       |
| `npm run check:sets`                | Checks the content sets A/B of the study                                       |
| `npm run audit:vocabulary`          | Audits the vocabulary data                                                     |
| `npm run export:survey`             | Exports survey data to CSV (needs the service-role key; the CSV is gitignored) |
| `npm run build:analyze`             | Production build with a bundle treemap                                         |

### Known limitations

- The keyboard shortcuts with Ctrl/Cmd/Alt + number keys can collide with browser shortcuts, and they cannot be switched off.
- With an active screen reader and the voice assistant at the same time, some feedback is announced twice.
- WCAG 2.1 AA is a design goal that is tested automatically; the app has not been formally audited for conformance.

---

## Deutsch

En-Claro ist eine responsive Progressive Web App (PWA) mit Lese-, Schreib-, visuellen und kognitiven Übungen für Erwachsene mit Legasthenie. Sie ist auf Polnisch, Englisch und Deutsch verfügbar (die Oberfläche startet in der Sprache des Browsers) und lässt sich in einem schlichten „Nur Lernen“-Modus oder in einem spielerischen Modus mit virtuellem Garten nutzen. Die App ist auf WCAG 2.1 AA ausgelegt und wird mit automatisierten axe-core-Tests geprüft.

### Funktionen

**Barrierefreiheit und Personalisierung**

Alle Optionen sind standardmäßig aus und lassen sich in den Einstellungen frei kombinieren.

- Voreinstellung für mehr Leseabstand sowie Regler für Textgröße der Oberfläche (bis 28 px) und der Übungen (bis 32 px), Zeilenhöhe, Buchstaben-, Wort- und Absatzabstand
- Bionic Reading (fett hervorgehobene Wortanfänge)
- Hoher Kontrast, farbenblindsichere Farben und ein entsättigter Farbmodus
- Motorik-Modus mit vergrößerten Tippflächen (mindestens 56 x 56 px), dazu die Optionen „Große Ziele“ und „Mehr Zeit“ (langsamere Sprachausgabe)
- Zen-Modus, reduzierte Bewegung und die Option „Kein Blinken“
- Lese-Lineal zum Verfolgen einer Textzeile
- Tastaturbedienung (Pfeiltasten und Enter für die nächste Übung; Strg/Cmd/Alt + 1-4 für die Übungsbereiche und den Garten, + `,` für die Einstellungen, + `S` für die Umfrage) und Screenreader-Unterstützung (semantische Landmarken, ARIA-Live-Regionen, Fokusfallen in Dialogen, Skip-Link)

**Sprache**

- Text-to-Speech liest Anweisungen, Antwortoptionen und Rückmeldungen vor, mit einstellbarer Stimme, Geschwindigkeit, Tonhöhe und Lautstärke. Hat der Browser keine Systemstimmen (zum Beispiel Firefox am Desktop), nutzt die App die mitgelieferte meSpeak-Engine.
- Spracheingabe ermöglicht es, Übungen zu beantworten, zu überspringen oder zu prüfen. Chromium-Browser nutzen die native Web Speech API, die die Aufnahme je nach Hersteller an einen Online-Dienst senden kann. Andere Browser können nach Einwilligung ein lokal laufendes Whisper-Modell (Transformers.js) nutzen; das Audio bleibt auf dem Gerät, die Modelldateien werden aber einmalig von Drittanbietern (Hugging Face und jsDelivr) geladen.

**Gamification (optional)**

- Virtueller Garten, der mit richtigen Antworten wächst: alle 5 Punkte eine Level-Meldung, alle 10 Punkte ein neuer Baum
- Tagesziel (5, 10, 15 oder 20 Minuten) mit Wochenkalender, einigen Abzeichen und einer Schaltfläche „Fortschritt teilen“
- Fünf frei wählbare Farbthemen (Natur, Musik, Kunst, Weltraum, Ozean)
- Optionaler Pausenvorschlag nach einer Fehlerserie, mit Anzeige der kognitiven Energie
- Ein schlichter „Nur Lernen“-Modus ohne diese Elemente

**PWA und Offline**

- Installierbar auf Desktop und Mobilgeräten (eigene Installationsschaltfläche in der Navigation)
- App-Oberfläche, Übungen und Wortschatz werden von einem Service Worker vorab gespeichert und funktionieren offline; Updates werden automatisch installiert
- Offline-Hinweis. Die Spracheingabe mit Whisper braucht für den ersten Modell-Download eine Verbindung; Umfrage-Einsendungen werden bis zu 24 Stunden in einer Warteschlange gehalten und erneut versucht (Background Sync).

### Übungen

Alle Übungstypen lassen sich in den Einstellungen einzeln abschalten. Ein anfänglicher Diagnosepool bleibt aktiv.

- **Lesen und Schreiben:** Phoneme, Silben, Grapheme und Rechtschreibregeln, Laut-Buchstaben-Zuordnung, auditive Unterscheidung, Wortschatz, Scrabble-artiges Wörterbilden, Look-Cover-Write-Check, Satzkontext, Diktat, Lautlesen, Leseverständnis, Rhythmus
- **Visuell:** Uhrzeit lesen, visuelle Verfolgung, Spiegelbild-Erkennung, „Was passt nicht“
- **Logik und Gedächtnis:** Kategorisierung, Sequenzierung, Merkspanne, logisches Schlussfolgern, Rhythmus-Gedächtnis, Melodie-Gedächtnis

### Studienmodus und Forschungsinstrumente

Die App enthält die Instrumente der Studie zur Masterarbeit. Beim ersten Start ist der Studienmodus eingeschaltet (er lässt sich in der Einführung ausschalten):

1. **Einwilligungsbildschirm** einmalig vor dem ersten Block (Altersbestätigung und Einwilligung in Speicherung und Auswertung der Antworten; Namen und Kontaktdaten werden nicht erfasst).
2. **Zwei Übungsblöcke** mit je 15 Aufgaben (8 Lesen und Schreiben, 3 visuell, 4 Logik und Gedächtnis): einer ohne und einer mit Spielelementen. Die Startreihenfolge wird per Münzwurf zugewiesen und auf dem Gerät gespeichert (`?order=classicFirst` oder `?order=gamifiedFirst` überschreibt sie). Block 1 und Block 2 nutzen verschiedene Inhaltssätze (A und B). Im Block mit Spielelementen folgt vor der Umfrage ein Halt im Garten.
3. **Ein Fragebogen nach jedem Block:** NASA-RTLX (6 Regler, 0-100), SUS (10 Aussagen), UEQ-S (8 Begriffspaare), zwei Aussagen zu Konzentration und Durchhaltevermögen und, nur nach dem Block mit Spielelementen, eine Rückmeldung zu Garten und Abzeichen. Der Fragebogen nach Block 2 fragt zusätzlich vier Angaben zur Person ab (Lese-Rechtschreibstörung, Tätigkeit in der Logopädie, Altersgruppe, Erstsprache), jeweils mit der Option „Keine Angabe“.

Die Antworten werden mit einer zufälligen Kennung an eine Netlify Function (`submit-survey`) gesendet, die den Payload validiert und in die Supabase-Tabelle `ab_study_submissions` schreibt. Row Level Security ist ohne öffentliche Policy aktiv, sodass nur die Function und das Export-Skript (Service-Role-Key) auf die Tabelle zugreifen. Nicht gesendete Antworten bleiben im Browser erhalten; nach wiederholten Fehlern erscheint eine Notfall-Umgehung.

### Technologie-Stack

- **Frontend:** React 19, Vite 8, Tailwind CSS 4, TypeScript für die Umfragekomponente
- **State und Speicher:** React Context (kein Redux), `localStorage`, IndexedDB
- **i18n:** i18next (Polnisch, Englisch, Deutsch)
- **PWA:** vite-plugin-pwa (Workbox, `generateSW`)
- **Sprache:** Web Speech API, meSpeak, Transformers.js (Whisper) in Web Workern
- **UI-Bausteine:** `@floating-ui/react` (Dialoge, Fokusführung), Lottie
- **Backend (Umfrage):** Netlify Functions + Supabase (PostgreSQL)
- **Tests:** Vitest + React Testing Library (Unit), Playwright + axe-core (E2E und Barrierefreiheit)

### Projektstruktur

```text
.
├── netlify/functions/submit-survey/  # Serverless-Funktion: validiert und speichert Umfrageantworten
├── supabase/                         # SQL-Schema für die Umfragetabelle
├── scripts/                          # export-survey-data.js (CSV-Export), Workflow-Beispiel
├── public/                           # Icons, robots.txt, Typen des Umfrage-Payloads
├── src/
│   ├── components/
│   │   ├── common/                   # Dialog, BionicText, TTS- und Sprachsteuerung, ...
│   │   ├── exercises/                # Eine Komponente pro Übungstyp
│   │   ├── App.jsx                   # Layout, Routing, Sitzungssteuerung
│   │   ├── SurveyComponent.tsx       # Fragebögen
│   │   ├── StudyConsentScreen.jsx    # Einwilligungsbildschirm des Studienmodus
│   │   ├── VirtualGarden.jsx
│   │   └── SettingsModal.jsx
│   ├── data/                         # Wortschatz- und Übungsdaten je Sprache, Studiensets, Themes
│   ├── hooks/                        # Einstellungen, Gamification, Studienmodus, Sprache, TTS, IndexedDB, ...
│   ├── i18n/                         # i18next-Konfiguration
│   ├── locales/                      # Übersetzungen je Sprache (de, en, pl)
│   ├── workers/                      # Web Worker: Whisper, meSpeak, Recorder-Worklet
│   ├── styles/                       # Design-Tokens und Barrierefreiheits-Overrides
│   └── utils/
├── tests-playwright/                 # End-to-End- und Barrierefreiheitstests
├── check-locales.mjs, check-sets.mjs, audit-vocabulary.mjs   # Konsistenzprüfungen der Daten
└── patches/                          # Patch für meSpeak (wird bei npm install angewendet)
```

### Lokale Ausführung

**Voraussetzungen:** Node.js 20.19+ oder 22.12+ (von Vite 8 verlangt)

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

Die Umfrage-Function benötigt Supabase-Zugangsdaten. `.env.example` nach `.env` kopieren und `SUPABASE_URL` sowie `SUPABASE_SERVICE_ROLE_KEY` eintragen (niemals committen), dann `npx netlify dev` statt `npm run dev` ausführen, damit `/.netlify/functions/*` lokal erreichbar ist (siehe `netlify.toml`). Die Tabelle wird mit `supabase/00_survey_schema.sql` angelegt.

| Befehl                              | Zweck                                                                                                       |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `npm run build` / `npm run preview` | Produktions-Build / lokale Vorschau                                                                         |
| `npm run test:run`                  | Unit-Tests (Vitest)                                                                                         |
| `npm run test:e2e`                  | End-to-End- und Barrierefreiheitstests (Playwright)                                                         |
| `npm run lint`, `npm run typecheck` | ESLint, TypeScript                                                                                          |
| `npm run check:locales`             | Prüft, ob alle Sprachen dieselben Übersetzungsschlüssel haben                                               |
| `npm run check:sets`                | Prüft die Inhaltssätze A/B der Studie                                                                       |
| `npm run audit:vocabulary`          | Prüft die Wortschatzdaten                                                                                   |
| `npm run export:survey`             | Exportiert Umfragedaten als CSV (braucht den Service-Role-Key; die CSV ist per `.gitignore` ausgeschlossen) |
| `npm run build:analyze`             | Produktions-Build mit Bundle-Treemap                                                                        |

### Bekannte Einschränkungen

- Die Tastaturkürzel mit Strg/Cmd/Alt + Zifferntasten können mit Browser-Kürzeln kollidieren und lassen sich nicht abschalten.
- Bei gleichzeitig aktivem Screenreader und Sprachassistent werden manche Rückmeldungen doppelt angesagt.
- WCAG 2.1 AA ist ein Entwurfsziel, das automatisiert getestet wird; eine formale Konformitätsprüfung hat nicht stattgefunden.

---

## Polski

En-Claro to responsywna progresywna aplikacja webowa (PWA) z ćwiczeniami czytania, pisania, wzrokowymi i poznawczymi dla dorosłych z dysleksją. Jest dostępna po polsku, angielsku i niemiecku (interfejs startuje w języku przeglądarki) i można jej używać w prostym trybie „tylko nauka” albo w trybie z grywalizacją i wirtualnym ogrodem. Aplikacja została zaprojektowana zgodnie z WCAG 2.1 AA i jest sprawdzana automatycznymi testami axe-core.

### Funkcje

**Dostępność i personalizacja**

Wszystkie opcje są domyślnie wyłączone i można je dowolnie łączyć w ustawieniach.

- Ustawienie zwiększonych odstępów oraz suwaki rozmiaru tekstu interfejsu (do 28 px) i ćwiczeń (do 32 px), wysokości linii, odstępów między literami, słowami i akapitami
- Bionic Reading (pogrubione początki słów)
- Wysoki kontrast, kolory bezpieczne dla osób z zaburzeniami widzenia barw i tryb o zmniejszonym nasyceniu
- Tryb motoryczny z powiększonymi obszarami dotyku (min. 56 x 56 px), a do tego opcje „Duże elementy” i „Więcej czasu” (wolniejsza synteza mowy)
- Tryb Zen, ograniczony ruch i opcja „Bez migotania”
- Linijka skupienia do śledzenia linii tekstu
- Obsługa klawiatury (strzałki i Enter dla następnego ćwiczenia; Ctrl/Cmd/Alt + 1-4 dla obszarów ćwiczeń i ogrodu, + `,` dla ustawień, + `S` dla ankiety) oraz wsparcie czytników ekranu (semantyczne punkty orientacyjne, regiony ARIA live, pułapki fokusu w oknach dialogowych, link „przejdź do treści”)

**Głos**

- Synteza mowy odczytuje instrukcje, opcje odpowiedzi i informacje zwrotne, z regulowanym głosem, tempem, wysokością i głośnością. Gdy przeglądarka nie ma głosów systemowych (np. Firefox na komputerze), aplikacja używa dołączonego silnika meSpeak.
- Wprowadzanie głosowe pozwala odpowiadać, pomijać i sprawdzać ćwiczenia. Przeglądarki oparte na Chromium używają natywnego Web Speech API, które, zależnie od producenta przeglądarki, może wysyłać nagranie do usługi online. Inne przeglądarki mogą po wyrażeniu zgody użyć lokalnego modelu Whisper (Transformers.js); dźwięk zostaje na urządzeniu, ale pliki modelu są jednorazowo pobierane z zewnętrznych hostów (Hugging Face i jsDelivr).

**Grywalizacja (opcjonalna)**

- Wirtualny ogród rosnący wraz z poprawnymi odpowiedziami: komunikat o nowym poziomie co 5 punktów i nowe drzewo co 10 punktów
- Cel dzienny (5, 10, 15 lub 20 minut) z kalendarzem tygodnia, kilkoma odznakami i przyciskiem „udostępnij postęp”
- Pięć dowolnie wybieralnych motywów kolorystycznych (Natura, Muzyka, Sztuka, Kosmos, Ocean)
- Opcjonalna propozycja przerwy po serii błędów, ze wskaźnikiem energii poznawczej
- Prosty tryb „tylko nauka” bez tych elementów

**PWA i tryb offline**

- Możliwość instalacji na komputerze i urządzeniach mobilnych (własny przycisk instalacji w nawigacji)
- Powłoka aplikacji, ćwiczenia i słownictwo są zapisywane z wyprzedzeniem przez Service Worker i działają offline; aktualizacje instalują się automatycznie
- Wskaźnik braku połączenia. Wprowadzanie głosowe z Whisper wymaga połączenia przy pierwszym pobraniu modelu, a wysyłane ankiety trafiają do kolejki i są ponawiane przez maksymalnie 24 godziny (Background Sync).

### Ćwiczenia

Każdy typ ćwiczeń można wyłączyć osobno w ustawieniach. Początkowa pula diagnostyczna pozostaje aktywna.

- **Czytanie i pisanie:** fonemy, sylaby, grafemy i zasady ortografii, dopasowanie dźwięku do litery, rozróżnianie słuchowe, słownictwo, układanie słów w stylu Scrabble, look-cover-write-check, kontekst zdaniowy, dyktando, czytanie na głos, rozumienie tekstu, rytm
- **Wzrokowe:** odczytywanie zegara, śledzenie wzrokowe, rozpoznawanie odbicia lustrzanego, „co nie pasuje”
- **Poznawcze:** kategoryzacja, sekwencjonowanie, zakres pamięci, rozumowanie logiczne, pamięć rytmu, pamięć melodii

### Tryb badania i instrumenty badawcze

Aplikacja zawiera instrumenty badania do pracy magisterskiej. Przy pierwszym uruchomieniu tryb badania jest włączony (można go wyłączyć we wprowadzeniu):

1. **Ekran zgody** jednorazowo przed pierwszym blokiem (potwierdzenie wieku i zgoda na zapisanie i analizę odpowiedzi; imiona i dane kontaktowe nie są zbierane).
2. **Dwa bloki ćwiczeń** po 15 zadań (8 z czytania i pisania, 3 wzrokowe, 4 poznawcze): jeden bez, a drugi z elementami gry. Kolejność startową ustala rzut monetą i zapamiętuje urządzenie (`?order=classicFirst` lub `?order=gamifiedFirst` ją nadpisuje). Blok 1 i blok 2 używają różnych zestawów treści (A i B). W bloku z elementami gry przed ankietą następuje przystanek w ogrodzie.
3. **Ankieta po każdym bloku:** NASA-RTLX (6 suwaków, 0-100), SUS (10 stwierdzeń), UEQ-S (8 par określeń), dwa stwierdzenia o koncentracji i wytrwałości oraz, tylko po bloku z elementami gry, opinia o ogrodzie i odznakach. Ankieta po bloku 2 pyta dodatkowo o cztery dane o osobie (dysleksja, praca w logopedii, grupa wiekowa, pierwszy język), każde z opcją „brak odpowiedzi”.

Odpowiedzi trafiają z losowym identyfikatorem do funkcji Netlify (`submit-survey`), która waliduje dane i zapisuje je w tabeli Supabase `ab_study_submissions`. Row Level Security jest włączone bez publicznej polityki, więc do tabeli mają dostęp tylko funkcja i skrypt eksportu (klucz service-role). Niewysłane odpowiedzi zostają w przeglądarce, a po powtarzających się błędach pojawia się awaryjne obejście.

### Stos technologiczny

- **Frontend:** React 19, Vite 8, Tailwind CSS 4, TypeScript dla komponentu ankiety
- **Stan i pamięć:** React Context (bez Reduxa), `localStorage`, IndexedDB
- **i18n:** i18next (polski, angielski, niemiecki)
- **PWA:** vite-plugin-pwa (Workbox, `generateSW`)
- **Głos:** Web Speech API, meSpeak, Transformers.js (Whisper) w Web Workerach
- **Komponenty UI:** `@floating-ui/react` (okna dialogowe, zarządzanie fokusem), Lottie
- **Backend (ankieta):** Netlify Functions + Supabase (PostgreSQL)
- **Testy:** Vitest + React Testing Library (jednostkowe), Playwright + axe-core (E2E i dostępność)

### Struktura projektu

```text
.
├── netlify/functions/submit-survey/  # Funkcja serverless: waliduje i zapisuje odpowiedzi ankiety
├── supabase/                         # Schemat SQL tabeli ankiety
├── scripts/                          # export-survey-data.js (eksport CSV), przykład workflow
├── public/                           # Ikony, robots.txt, typy danych ankiety
├── src/
│   ├── components/
│   │   ├── common/                   # Dialog, BionicText, sterowanie TTS i głosem, ...
│   │   ├── exercises/                # Jeden komponent na typ ćwiczenia
│   │   ├── App.jsx                   # Układ, routing, orkiestracja sesji
│   │   ├── SurveyComponent.tsx       # Ankiety
│   │   ├── StudyConsentScreen.jsx    # Ekran zgody trybu badania
│   │   ├── VirtualGarden.jsx
│   │   └── SettingsModal.jsx
│   ├── data/                         # Słownictwo i dane ćwiczeń dla każdego języka, zestawy badania, motywy
│   ├── hooks/                        # Ustawienia, grywalizacja, tryb badania, głos, TTS, IndexedDB, ...
│   ├── i18n/                         # Konfiguracja i18next
│   ├── locales/                      # Tłumaczenia dla każdego języka (de, en, pl)
│   ├── workers/                      # Web Workery: Whisper, meSpeak, worklet nagrywania
│   ├── styles/                       # Tokeny projektowe i nadpisania dostępności
│   └── utils/
├── tests-playwright/                 # Testy end-to-end i dostępności
├── check-locales.mjs, check-sets.mjs, audit-vocabulary.mjs   # Kontrole spójności danych
└── patches/                          # Łatka dla meSpeak (stosowana przy npm install)
```

### Pierwsze kroki

**Wymagania:** Node.js 20.19+ lub 22.12+ (wymagane przez Vite 8)

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

Funkcja ankiety wymaga danych dostępowych do Supabase. Skopiuj `.env.example` do `.env` i uzupełnij `SUPABASE_URL` oraz `SUPABASE_SERVICE_ROLE_KEY` (nigdy ich nie commituj), a potem uruchom `npx netlify dev` zamiast `npm run dev`, aby `/.netlify/functions/*` działało lokalnie (patrz `netlify.toml`). Tabelę tworzy się plikiem `supabase/00_survey_schema.sql`.

| Polecenie                           | Zastosowanie                                                                              |
| ----------------------------------- | ----------------------------------------------------------------------------------------- |
| `npm run build` / `npm run preview` | Build produkcyjny / lokalny podgląd                                                       |
| `npm run test:run`                  | Testy jednostkowe (Vitest)                                                                |
| `npm run test:e2e`                  | Testy end-to-end i dostępności (Playwright)                                               |
| `npm run lint`, `npm run typecheck` | ESLint, TypeScript                                                                        |
| `npm run check:locales`             | Sprawdza, czy wszystkie języki mają te same klucze tłumaczeń                              |
| `npm run check:sets`                | Sprawdza zestawy treści A/B badania                                                       |
| `npm run audit:vocabulary`          | Sprawdza dane słownictwa                                                                  |
| `npm run export:survey`             | Eksportuje dane ankiety do CSV (wymaga klucza service-role; plik CSV jest w `.gitignore`) |
| `npm run build:analyze`             | Build produkcyjny z mapą zawartości paczki                                                |

### Znane ograniczenia

- Skróty klawiszowe z Ctrl/Cmd/Alt i cyframi mogą kolidować ze skrótami przeglądarki i nie da się ich wyłączyć.
- Przy jednoczesnie włączonym czytniku ekranu i asystencie głosowym część komunikatów jest odczytywana dwa razy.
- WCAG 2.1 AA jest celem projektowym testowanym automatycznie; formalnego audytu zgodności nie przeprowadzono.
