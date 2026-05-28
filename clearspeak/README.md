# 🧠 En Claro (Dyslexia PWA)

> **Accessible Gamification and Voice Integration in a PWA supporting speech therapy exercises for individuals with dyslexia.**
> Project developed as part of a Master's Thesis.

En Claro is a fully responsive, accessible (WCAG compliant), and gamification-based Progressive Web App (PWA). It was designed to provide a safe space for developing linguistic, visual, and cognitive skills for individuals with dyslexia and other learning difficulties.

---

## ✨ Key Features

### 🛠️ Inclusivity and Accessibility (A11y)
The app allows for deep personalization of the interface to meet specific perceptual and motor needs:
- **Friendly Font (OpenDyslexic)** - default font supporting fluent reading.
- **Bionic Reading** - bolding the beginnings of words to facilitate visual fixation.
- **High Contrast (WCAG AAA)** and **Safe Colors** for individuals with color blindness.
- **Comfort Buttons (Motorik)** - enlarged clickable areas for individuals with fine motor skill impairments.
- **Zen Mode & Calm Screen** - disables animations, flashes, and unnecessary interface elements to reduce sensory overload.
- **Focus Ruler** - a tool that assists in tracking text while reading.

### 🗣️ Voice Assistant (TTS & Speech Recognition)
- Built-in Text-to-Speech (TTS) support that reads commands, options, and provides spelling hints.
- Voice command support enabling hands-free task completion.
- Dynamic adjustment of voice speed and pitch.

### 🎮 Gamification Mechanics
- **Virtual Garden** - a growing ecosystem rewarding user consistency.
- **Non-punitive System** - rewards effort and progress, not just perfection. Mistakes trigger auxiliary mechanisms and hints.
- **Theme Shop** - currency earned in exercises (Coins) can be exchanged for new, friendly visual environments (Nature, Music, Art, Space, Ocean).
- **Cognitive Energy** - an intelligent system tracking user effort and suggesting breaks to rest (Cognitive Breaks).

### 📱 PWA & Offline Mode
- The application works without an internet connection (Service Worker).
- Can be installed on mobile and desktop devices (Add to Home Screen).
- Automatic notifications about new content updates.

---

## 🧩 Educational Pillars and Exercises

The system divides training into three main pillars:

1. **📖 Literacy (Reading & Writing)**
   - *Writing: Memory (Look-Cover-Write-Check)* - memorizing the visual form of a word.
   - *Writing: Synthesis (Scrabble)* - forming words from scrambled letters.
   - *Writing: Rules (Grapheme)* - spelling exercises (e.g., rz/ż, ó/u) with hints.
   - *Writing: Dictation* - phonemic hearing training.
   - *Text: Reading (Context)* - inserting words into the appropriate sentence context.

2. **👁️ Visual and Spatial (Visual)**
   - *Visual: Tracking* - visual discrimination and directionality training (e.g., b/d, p/q).
   - *Visual: Clock* - reading time from an analog clock.

3. **🧩 Logic and Memory (Cognitive)**
   - *Logic: Categorization* - accessible drag & drop (tap-to-drop) module for mind mapping.
   - *Logic: Sequences* - ordering processes and sentences.
   - *Memory: Memory Span* - working memory training with audio support.
   - *Word: Syllables* - segmentation and analysis of word structure.
   - *Word: Phonemes* - phonetic reading.

---

## 🏗️ Architecture and Tech Stack

- **Frontend:** React, Vite
- **Styling:** Tailwind CSS
- **State Management:** React Context API, Redux (for selected subsystems)
- **Internationalization (i18n):** `i18next` (available languages: PL, EN, DE)
- **PWA:** `vite-plugin-pwa` (Workbox)
- **Local Data:** IndexedDB (saving progress and UX survey telemetry logs)
- **Testing:** 
  - Unit: *Vitest* + *React Testing Library*
  - End-to-End (E2E): *Cypress* (integrated with GitHub Actions CI/CD)

---

## 📂 Directory Structure

```text
src/
├── assets/                 # Lottie animations, icons, graphics
├── components/
│   ├── common/             # Generic buttons, BionicText, TTSController
│   ├── exercises/          # Main components for 11 exercise types
│   ├── __tests__/          # Vitest unit tests
│   ├── App.jsx             # Main router and layout management
│   ├── VirtualGarden.jsx   # Virtual garden module (Gamification)
│   └── SettingsModal.jsx   # Central accessibility personalization panel
├── data/                   # Vocabulary databases for respective languages
├── hooks/                  # Custom hooks (e.g., useSafeTimeouts, useExerciseVoice)
├── i18n/                   # i18next translation configuration
├── utils/                  # Helper functions (e.g., IndexedDB, spelling hints)
└── ...
```

---

## 🚀 Uruchomienie projektu lokalnie

### Wymagania
- Node.js (wersja 18+)
- npm / yarn

### Instalacja

1. Sklonuj repozytorium:
   ```bash
   git clone <adres-repozytorium>
   cd clearspeak
   ```

2. Zainstaluj zależności:
   ```bash
   npm install
   ```

3. Uruchom serwer deweloperski:
   ```bash
   npm run dev
   ```
   Aplikacja będzie dostępna pod adresem: `http://localhost:5173`

### Budowanie i Testowanie

- **Wersja produkcyjna (PWA):**
  ```bash
  npm run build
  ```
- **Uruchomienie testów jednostkowych (Vitest):**
  ```bash
  npm run test
  ```
- **Uruchomienie testów E2E (Cypress):**
  ```bash
  npx cypress open
  ```

---

## 📊 Analityka i Badania UX
Aplikacja wyposażona jest w bezinwazyjny moduł zbierania logów. W oparciu o ankiety **NASA-TLX** (obciążenie poznawcze) oraz **UEQ-Short** (doświadczenie użytkownika), dane zapisywane są bezpiecznie w pamięci przeglądarki (IndexedDB) z możliwością eksportu do pliku CSV z poziomu profilu, celem wsparcia badań naukowych.

---

*Zaprojektowano z 💚 dla edukacji włączającej.*