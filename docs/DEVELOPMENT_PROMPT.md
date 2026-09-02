# Entwicklungs-Prompt: En Claro (Dyslexia PWA)

> Quellenbasierter Leit-Prompt für die Erstellung, Erweiterung und Anpassung der App.
> Jede Anforderung unten ist an eine Quelle (Seite + Originalzitat, wo verfügbar)
> gebunden und mit dem tatsächlichen Implementierungsstand im Repository abgeglichen.

---

## 0. Hinweis zur Zitierbasis (bitte zuerst lesen)

Diese Datei stützt sich auf zwei unterschiedliche Arten von Quellenzugriff. Das
wird hier offengelegt, damit im Thesis-Text nicht versehentlich Seitenzahlen
für Werke zitiert werden, deren Volltext gar nicht vorlag.

- **Tier A – Volltext mit Seite und Wortlaut verfügbar:**
  1. Yu, Z. (2021). _The effects of gender, educational level, and personality
     on online learning outcomes during the COVID-19 pandemic._
     International Journal of Educational Technology in Higher Education,
     18:14.
  2. Steinfurth, M. (2017). _Kombinierte Web- und Hybrid-App-Entwicklung –
     Adaptierung einer Android-App für die Lehrevaluation im Framework Ionic._
     Masterarbeit, TH Brandenburg.

  Für beide liegt der vollständige, seitenpaginierte Text vor. Alle Zitate
  unten mit „S. …" stammen aus diesen zwei Dokumenten und sind wörtlich.

- **Tier B – nur über das Exposé zugänglich (keine Originalseiten vorhanden):**
  Elo et al. (2024), Dondio et al. (2024), Hyzy et al. (2022), Lin (2024),
  Ning et al. (2025), Deterding et al. (2011). Diese Werke werden im Exposé
  referenziert, ihre PDFs liegen hier aber nicht vor. Die Aussagen unten sind
  daher **wörtliche Zitate aus dem Exposé-Text selbst** (gekennzeichnet mit
  „Exposé, Abschnitt X"), nicht aus der Originalpublikation. Für den
  Thesis-Text müssen aus den Originalquellen noch echte Seitenzahlen
  nachgetragen werden, sobald die PDFs vorliegen.

Regel für jede KI-gestützte Weiterarbeit an diesem Repo: **Keine
Designentscheidung ohne Bezug auf eine der unten stehenden Quellenzeilen
einführen.** Wenn eine neue Anforderung auftaucht, die durch keine der
Quellen gedeckt ist, ist das explizit gegenüber der Nutzerin zu benennen
statt stillschweigend zu ergänzen.

---

## 1. Rolle und Zweck

Du entwickelst **En Claro**, eine barrierefreie Progressive Web App (React +
Vite + `vite-plugin-pwa`, lokal-first via IndexedDB) für sprachtherapeutische
Übungen von **erwachsenen** Menschen mit Lese-Rechtschreibstörung (LRS). Die
App ist der praktische Teil einer Masterarbeit, deren Forschungsfrage lautet:

> „Wie wirkt sich die Integration von Gamification-Elementen in eine
> barrierefreie Progressive Web App (PWA) auf die wahrgenommene Usability,
> die User Experience und die Motivation bei sprachtherapeutischen Übungen
> für Erwachsene mit Lese-Rechtschreibstörung im Vergleich zu einer Version
> ohne Gamification aus?" (Exposé, Abschnitt 1.3)

Jede Änderung am Code muss diese Forschungsfrage unterstützen: Sie muss in
**beiden** Zuständen des `isGamified`-Flags (`src/hooks/useGamificationState.js`,
Z. 49–52) sauber funktionieren, damit der A/B-Vergleich valide bleibt.

---

## 2. Nicht verhandelbare Designprinzipien (mit Quelle + Status)

### 2.1 Erwachsenengerechte Gestaltung statt Kindergrafik

- **Quelle (Tier B):** Exposé, Abschnitt 2.1: „Die Mehrzahl der untersuchten
  therapeutischen Apps richtet sich visuell und konzeptionell primär an
  Schulkinder. Typische Motivationswerkzeuge, die in der Therapie verwendet
  werden, sind: Aufkleber, Punktesysteme, Ranglisten und Übungsmaterialien
  mit für Kinder geeigneten Figuren wie Paw Patrol, Frozen oder Minions
  [Elo et al., 2024]." Und weiter: „Bunte Aufkleber, Belohnungen in Form von
  Süßigkeiten oder Figuren aus Kinderfilmen wirken auf erwachsene Nutzer
  infantil und unpassend."
- **Regel:** Keine Lizenzfiguren, keine Sticker-Metapher, keine
  Kinder-Comicoptik. Belohnungsgrafiken müssen für Erwachsene tragfähig sein
  (Natur/Musik/Kunst/Weltraum/Ozean-Ästhetik, nicht Cartoon-Maskottchen).
- **Status:** ✅ Umgesetzt. `VirtualGarden.jsx` (Z. 28–54) nutzt fünf
  erwachsenengerechte visuelle Themen (Natur, Musik, Kunst, Space, Ocean) mit
  Emoji-Symbolik statt Figuren; kein Sticker- oder Maskottchen-System im
  Code auffindbar.

### 2.2 Non-kompetitive statt kompetitive Gamification

- **Quelle (Tier B):** Exposé, Abschnitt 2.3: „Die meisten Apps setzen auf
  typische Gamification: Punkte, Ranglisten, Timer [Deterding et al., 2011].
  Das ist problematisch, da bereits das Lesen für Menschen mit LRS eine hohe
  kognitive Belastung darstellt. Wenn dann noch ein Countdown tickt, Fehler
  abgestraft werden oder man sich mit anderen vergleichen muss, wird aus
  Übung Stress." Und: „Dondio et al. (2024) zeigen: Leaderboards erhöhen bei
  vulnerablen Gruppen die Angst statt die Motivation."
- **Bestätigung aus Tier A (Yu et al. 2021, S. 5):** In der Literaturbasis
  von Yu et al. wird berichtet, dass Lernende mit „stronger neuroticism could
  more likely negatively evaluate online learning" (Bhagat et al., 2019,
  zitiert in Yu et al. 2021, S. 5). Im eigenen Interviewteil derselben Studie
  sagt eine Testperson mit hoher Neurotizismus-Ausprägung wörtlich:
  „I feel nervous when learning online because I cannot really interact with
  my peers." (Yu et al., 2021, S. 11). Diese Beobachtung stützt unabhängig
  von Dondio et al. dieselbe Design-Konsequenz: Stressoren wie Zeitdruck oder
  Vergleich mit anderen sind für ängstlichere Nutzer:innen kontraproduktiv.
- **Handlungsempfehlung aus Yu et al. (2021, S. 12–13):** „Teachers could
  design different pedagogical approaches to cater for learners with
  different personalities. For those with strong neuroticism, teachers could
  design some interesting contents to release their negative emotions,
  reduce their stress, and relax them." — Übertragen auf die App: entspannende,
  nicht wertende Inhalte statt Drucksysteme.
- **Regel:** Keine Ranglisten zwischen Nutzer:innen, keine harten Timer, kein
  „Game Over"/Fehler-Bestrafungs-Screen, keine Vergleichsanzeige mit anderen.
  Neue Features dürfen Fehler nicht negativ sanktionieren.
- **Status:** ✅ Weitgehend umgesetzt. `useGamificationState.js` implementiert
  ein Quest-/Coin-System ohne Ranglisten oder Gegner-Vergleich (Z. 3–21,
  57–75); README bestätigt explizit ein „Non-punitive System — rewards
  effort and progress, not just perfection. Mistakes trigger auxiliary
  mechanisms and hints." Kein Leaderboard-Code im Repository gefunden
  (`grep` auf „leaderboard"/„Rangliste" ergebnislos).

### 2.3 Kognitive Entlastung / adaptive Pausen

- **Quelle (Tier A, Yu et al. 2021, S. 12):** „Teachers could design different
  pedagogical approaches to cater for learners with different personalities.
  For those with strong neuroticism, teachers could design some interesting
  contents to release their negative emotions, reduce their stress, and
  relax them." Ergänzend S. 6: „Learners with strong conscientiousness could
  arrange their learning activities in the course of semester, which
  improved their learning outcomes (Teobald et al., 2018)" — spricht für
  Struktur/Routine-Elemente (z. B. Tagesziele) für gewissenhafte Nutzer:innen,
  ohne Zwang für andere.
- **Regel:** Belastungsindikatoren dürfen nicht strafend, sondern müssen
  unterstützend sein (Pausenangebot statt Fehlermeldung); Struktur (Streaks,
  Tagesaufgaben) muss optional/abschaltbar bleiben, nicht verpflichtend.
- **Status:** ✅ Umgesetzt. `useCognitiveLoad.js` trackt Fehlerhäufigkeit und
  Sitzungsdauer, setzt Ampel-Zustände (`green`/`yellow`/`red`, Z. 30–35) und
  löst nach Cooldown eine Pausenmodal aus statt einer Bestrafung (Z. 39–55).
  `DailyChecklist.jsx` bietet optionale Tagesstruktur; die Einstellung
  `settings.cognitiveBreaks` erlaubt das Abschalten der Pausen-Trigger
  (Z. 36).

### 2.4 Naturmetapher / organisches Wachstum als Fortschrittsvisualisierung

- **Quelle (Tier B):** Exposé, Abschnitt 2.3: „Non-kompetitive
  Gamification-Ansätze, die auf personalisiertem Fortschritt basieren, etwa
  Wachstumsmetaphern wie ein virtueller Garten, zeigen in der Literatur
  vielversprechende Ergebnisse. Besonders der Einsatz von Naturbildern
  scheint positive Emotionen zu fördern und kann sich dadurch positiv auf
  die Nutzererfahrung auswirken [Ning et al., 2025]."
- **Regel:** Primäre Fortschrittsmetapher bleibt Wachstum (Garten/Ökosystem),
  nicht Balken-Wettkampf oder Punktezähler als Hauptvisual.
- **Status:** ✅ Umgesetzt als Kernfeature. `VirtualGarden.jsx` (430 Zeilen)
  berechnet ein `growthLevel` aus Punkten (`Math.floor(points / 5)`, Z. 26)
  und rendert stufenweise wachsende Themenvisuals; README listet „Virtual
  Garden — a growing ecosystem rewarding user consistency" als zentrales
  Gamification-Feature.
- **Konsistenz-Fix:** Die Wachstums-Icons, Trophäen und „Besucher" waren
  bereits pro Thema (Natur/Musik/Kunst/Space/Ocean) unterschiedlich, aber die
  Karten-Chrome des Gartens (Hintergrund/Rahmen in `VirtualGarden.jsx`
  sowie `WeeklyCalendar.jsx`, inkl. des „heute"-Rings) war fest
  weiß/slate/indigo — unabhängig vom gewählten Thema, im Widerspruch zum
  Rest der App (z. B. der Rahmen der Übungsfläche in `App.jsx` nutzt bereits
  `themeStyles.border`). Behoben durch Wiederverwendung derselben
  `themeStyles.border`-Klassen plus einem neuen `themeStyles.ring`-Eintrag
  pro Thema in `App.jsx`s `THEMES`-Objekt — der Garten fühlt sich jetzt als
  Teil des gewählten Themas an, nicht nur seine Icons.

### 2.5 Barrierefreiheit als Kernanforderung, nicht Zusatzfunktion

- **Quelle (Tier B):** Exposé, Abschnitt 2.3: „Bei Menschen mit
  Sprach- und Kommunikationsstörungen können außerdem starre Formulierungen
  und feste Dialogstrukturen eine zusätzliche Hürde darstellen und die
  kognitive Belastung weiter erhöhen [Lin, 2024]. Sprachgesteuerte
  Schnittstellen könnten hier eine spürbare Entlastung bringen."
- **Ergänzend (Tier A, Steinfurth 2017, S. 16):** Aus den acht Kernbedingungen
  des dort untersuchten Systems: „Das EdL-System muss so gestaltet sein,
  dass es für Studierende wie für Lehrende leicht zugänglich ist." — als
  Präzedenzfall dafür, dass Zugänglichkeit als _Systembedingung_ und nicht
  als optionales Add-on formuliert werden sollte.
- **Regel:** Jede neue UI-Komponente muss mit Tastatur bedienbar sein,
  ausreichenden Kontrast bieten, und darf Farbe nicht als einzigen
  Informationskanal nutzen (siehe 2.7).
- **Status:** ✅ Sehr weit umgesetzt. `src/styles/a11y.css` (109 Zeilen)
  implementiert daten-attributgesteuerte Overrides für: Fokus-Kontrast
  (Z. 12–16), motorische Zielgrößen ≥56 px (Z. 24–33), farbfehlsichtige
  Palette (Z. 41–75), reduzierte Bewegung (Z. 77–94), Desaturierung
  (Z. 102–104) und Minimalmodus (Z. 106–109). Die frühere OpenDyslexic-
  Schriftart wurde vollständig entfernt (keine Font-Umschaltung mehr,
  siehe `useUserSettings.js`); die LRS-Voreinstellung setzt seither nur
  noch Zeilenhöhe/Buchstaben-/Wortabstand als sechs anpassbare
  Design-Token (`--line-height`, `--letter-spacing`, `--word-spacing`,
  `--font-size-exercise`, `--font-size-ui`, `--paragraph-spacing`), nicht
  mehr als CSS-Regel hier. Bionic Reading ist eine JS-Komponente
  (`BionicText`), keine `data-a11y-*`-Regel. Farbkontrast ist zusätzlich
  über einen echten 7:1-AAA-Test abgesichert (`src/utils/
  contrastChecker.js`'s `checkContrast()`, geprüft in
  `src/__tests__/contrastCompliance.test.js`), nicht nur per
  Konsolenwarnung. Zusätzlich automatisierte WCAG-2.1-AA-Prüfung via
  `@axe-core/playwright` in `tests-playwright/accessibility.spec.js` sowie
  ein manuelles Screenreader-Protokoll in
  `docs/screen-reader-walkthrough.md`.

### 2.6 Sprachgesteuerte / TTS-gestützte Interaktion

- **Quelle (Tier B):** Exposé, Abschnitt 2.3 (Lin, 2024): siehe 2.5 –
  „Sprachgesteuerte Schnittstellen könnten hier eine spürbare Entlastung
  bringen."
- **Status:** ⚠️ Teilweise umgesetzt, TTS-Seite deutlich ausgebaut.
  `common/TTSController.jsx`, `common/AccessibleTTS.jsx`,
  `hooks/useGlobalTTS.js`, `hooks/useExerciseVoice.jsx` sowie
  `hooks/useTTSSafariFix.jsx` implementieren Text-to-Speech inkl.
  Buchstabierhilfen. Bis vor Kurzem musste die Vorlesefunktion in jeder
  Übung **manuell** per Button angetippt werden — genau die Art
  „zusätzlicher Hürde", vor der Lin (2024) laut Exposé warnt. Mit
  `hooks/useAutoReadAloud.js` liest die App jetzt Frage/Anweisung und
  Antwortoptionen **automatisch vor**, sobald `voiceAssistant` aktiv ist
  (0,5 s Verzögerung, damit sie nicht die Erfolgsmeldung der vorherigen
  Antwort überspricht) — in allen 18 Übungstypen eingebunden
  (`GraphemeExercise.jsx`, `SyllableExercise.jsx`, `PhonemeExercise.jsx`,
  `ContextExercise.jsx`, `ScrabbleExercise.jsx`, `ClockExercise.jsx`,
  `SequenceExercise.jsx`, `SpatialExercise.jsx`,
  `VisualCategorization.jsx`, `ReadAloudExercise.jsx`,
  `DictationExercise.jsx`, `GraphemePhonemeMatchExercise.jsx`,
  `ReadingComprehensionExercise.jsx`, `RhythmMemoryExercise.jsx`,
  `RhythmTapExercise.jsx`, `MelodyMemoryExercise.jsx`,
  `MemorySpanExercise.jsx` — nur in der Abfragephase, nicht in der
  Merkphase, sonst würde die Antwort verraten —, `LookCoverWriteCheck.jsx`
  — nur in der „look"-Phase). Bei
  `DictationExercise.jsx` erzwingt App.jsx's `isVoiceException`-Mechanismus
  (Z. 382–389) ohnehin schon `voiceAssistant = true` unabhängig von der
  Einstellung, da dort das Audio selbst die Aufgabenstellung ist, nicht nur
  ein optionales Vorlesen von bereits sichtbarem Text — das automatische
  Abspielen greift dort also praktisch immer. Löst außerdem erneut,
  aktiviert man den Assistenten mitten in einer Frage, sofort aus („bei
  Aktivierung", wörtliche Nutzeranforderung). Abgedeckt durch
  `hooks/useAutoReadAloud.test.js` (6 Tests).
  Auf ausdrücklichen Nutzerwunsch („Einstellungen usw. sollen auch
  vorgelesen werden, sowie die Startseite, was das für eine App ist, in
  allen Sprachen") erweitert auf zwei weitere Screens, die zuvor nur
  reaktive Klick-Bestätigungen hatten, keine automatische Vorlesefunktion:
  `IntroScreen.jsx` liest beim Erscheinen (bzw. sofort, wenn der Assistent
  mitten auf dem Screen aktiviert wird) App-Titel, Untertitel und den
  Browser-Hinweis vor. `SettingsModal.jsx` liest pro Tab beim Öffnen/
  Wechseln automatisch vor: General-Tab (Sprache, App-Modus mit den zwei
  Optionen), A11y-Tab (Tab-Name + die Namen aller 9 Komfort- und 5
  inklusiven Optionen — nur die Namen, nicht die längeren Beschreibungen,
  sonst wird die Vorlesezeit zu lang), Shop-Tab (Münzstand + Themennamen).
  Da alle verwendeten Textbausteine bereits existierende, in allen drei
  Sprachen (de/en/pl) gepflegte i18next-Keys sind, funktioniert dies ohne
  neue Übersetzungsarbeit automatisch in allen unterstützten Sprachen.
  `SettingsModal.jsx` erhielt dafür erstmals eine `speak`-Prop von
  `App.jsx` (vorher nicht durchgereicht).
  Sprach**erkennung** (Voice-Command-Eingabe) wird im README als Feature
  genannt („Voice command support enabling hands-free task completion"),
  sollte aber weiterhin vor der Nutzerstudie gegen die konkrete
  Lin-(2024)-Argumentation (starre Dialogstrukturen vermeiden) geprüft
  werden — insbesondere, ob Formulierungen flexibel genug für Nutzer:innen
  mit Sprach-/Kommunikationsbeeinträchtigung sind.

### 2.7 Farbkodiertes Feedback nur als Zusatzkanal, nie exklusiv

- **Quelle (Tier A, Steinfurth 2017, S. 46):** „Die Studierenden sollen
  sofort anhand der Farbe des Antwort-Buttons erkennen, ob es sich um eine
  positive (grün), neutrale (grau-blau) oder negative (rot) Wertung handelt."
  — dieses Muster ist funktional wertvoll, birgt aber laut WCAG ein Risiko,
  wenn Farbe der einzige Kanal ist.
- **Regel:** Farbliche Bewertungsskalen (grün/rot) müssen durch Form, Symbol
  oder Text redundant gemacht werden, damit die vorhandene
  `a11y-color`-Umschaltung (`a11y.css`, Z. 63–96) tatsächlich ausreicht.
- **Status:** ⚠️ Prüfen bei jeder neuen Übungskomponente. Die
  Colorblind-Safe-Palette existiert bereits (a11y.css Z. 63–96); bei neuen
  Answer-Button-Gruppen (z. B. in `exercises/*.jsx`) ist zu verifizieren,
  dass zusätzlich zur Farbe ein Icon/eine Textlabel-Unterscheidung vorhanden
  ist.

### 2.8 Datenschutz / lokal-first bei sensiblen Gesundheitsdaten

- **Regel (aus Zielgruppen- und Themenkontext, LRS-Diagnosedaten sind
  sensible Gesundheitsdaten):** Trainings- und Fortschrittsdaten dürfen nicht
  ungefragt an Drittserver übertragen werden.
- **Status:** ✅ Umgesetzt. Trainingsdaten liegen lokal in IndexedDB
  (`utils/indexedDB.js`, `hooks/useIndexedDB.js`). Supabase
  (`@supabase/supabase-js` in `package.json`) wird ausschließlich in
  `netlify/functions/submit-survey/index.js` für ein separates,
  freiwilliges Umfrage-Formular verwendet — **nicht** für Übungs- oder
  Fortschrittsdaten. Diese Trennung sollte bei jeder Erweiterung beibehalten
  werden.

### 2.9 Plattformunabhängigkeit / Offline-Fähigkeit als PWA

- **Quelle (Tier A, Steinfurth 2017, S. 7 f.):** „Ziel der geplanten Arbeit
  ist die Entwicklung einer Client-Applikation … die sich sowohl auf den
  beiden wichtigsten Mobilplattformen Android und iOS, als auch im
  Webrowser auf den Computern der Studierenden ausführen lässt." Und
  S. 9: „Hybrid-Apps sind Web-Apps, die in einem plattformspezifischen
  nativen WebView-Container eingebettet sind … Deshalb lautet das
  Versprechen von Hybrid App-Frameworks: „Write once, run anywhere"."
- **Einordnung:** Steinfurth (2017) kombiniert Cordova/Ionic-Hybrid-App und
  separate Web-App aus einer Codebasis, weil 2017 native Gerätefunktionen
  (Kamera, QR-Scan) im Browser noch unzuverlässig waren (S. 56–58, dort
  mussten für Kamera und QR-Scanner in der Web-Variante eigene
  Implementierungen über die _Media Capture and Stream API_ gebaut werden,
  weil das Cordova-Kamera-Plugin „im Browser … eine als Platzhalter
  fungierende Vorschauansicht" lieferte, S. 56). Für En Claro ist dieses
  Problem durch modernere Browser-APIs und den PWA-only-Ansatz (kein
  Cordova-Wrapper) weitgehend entschärft, sollte aber bei Kamera-/
  Audioaufnahme-Funktionen (z. B. Diktier-Übungen) im Hinterkopf behalten
  werden: **immer zuerst gegen echte Zielgeräte/-browser testen, bevor eine
  native-API-Abhängigkeit als sicher angenommen wird.**
- **Status:** ✅ Umgesetzt. `vite.config.js` bindet `vite-plugin-pwa`
  (inkl. `manifest`- und `workbox`-Konfiguration) ein; `PwaUpdateBanner.jsx`
  und `OfflineIndicator.jsx` sind vorhanden; README bestätigt „works
  without an internet connection (Service Worker)".

### 2.10 Responsive Layout, mobile-first

- **Quelle (Tier A, Steinfurth 2017, S. 44):** „Da die Nutzung einer
  Mobil-App auf einem Laptop akzeptabler erscheint als die Nutzung einer
  Desktop-Anwendung auf dem Smartphone, soll das mobile Konzept als
  vorranging behandelt werden, wenn sich keine Optimierung auf beide
  Konzepte realisieren lässt." Ergänzend S. 30: „Da die
  Layout-Gestaltung von Hybrid-Apps auf Technologien des responsive web
  design (RWD) aufbaut, passt sich die Benutzeroberfläche der App an die
  verschiedenen Bildschirmgrößen an."
- **Regel:** Neue Screens zuerst für Smartphone-Breite entwerfen, dann für
  größere Viewports erweitern (z. B. Split-View), nie umgekehrt.
- **Status:** ✅ Tailwind-CSS-basiertes responsives Layout vorhanden
  (`@tailwindcss/vite` in `package.json`); `BottomNav.jsx` (mobil) neben
  `SidebarNav.jsx` (größere Viewports) deutet auf ein bereits
  implementiertes Split-Layout-Muster hin, wie es Steinfurth (S. 44 f.) für
  Tablet/Desktop vorschlägt.

### 2.11 Nutzerzentrierter, iterativer Entwicklungsprozess

- **Quelle (Tier A, Steinfurth 2017, S. 12):** „Der Entwicklungsprozess …
  orientiert sich am Modell des Feature Driven Development (FDD, nach Coad,
  Lefebvre, & De Luca, 1999). … Zusätzlich werden … Elemente des
  Benutzerzentrierten Designs eingebracht (User Centered Design, UCD, nach
  Norman & Draper, 1986), wie eine initiale Benutzerstudie, Usability
  Befragungen nach der Fertigstellung einzelner Features und eine
  abschließende Evaluation des Gesamtprojekts."
- **Regel für die KI-Zusammenarbeit:** Größere Features in klar abgrenzbare
  „Feature Sets" zerlegen (analog Steinfurth, Kap. 3.5), pro Feature Set
  einzeln testbar machen, statt monolithische Änderungen vorzuschlagen.

---

## 3. Evaluations- und Studienmethodik (Kapitel „Vorgehensweise" im Exposé)

### 3.1 Blindvergleich als Präzedenzfall für das A/B-Design

- **Quelle (Tier A, Steinfurth 2017, S. 67):** „Zur Untersuchung der
  Fragestellung wurde ein Blindvergleich der Web-App, der Hybrid-App und der
  bestehenden nativen Android-App durchgeführt. Den Probanden wurde also
  nicht eröffnet, welche Art von App sie gerade testen. Dies sollte
  sicherstellen, dass das Ergebnis nicht durch Erwartungen oder mögliche
  Vorurteile (wie: „Hybrid-Apps sind generell langsam") verfälscht wird."
- **Ursprüngliche Konsequenz:** Der `isGamified`-Umschalter in
  `SettingsModal.jsx` ist eine **bewusste Selbstwahl** durch die Nutzer:in,
  keine geblindete/randomisierte Zuweisung – für die eigentliche A/B-Studie
  (Exposé, Abschnitt 5) genau genommen nicht ausreichend, da Selbstwahl zu
  Selektionsverzerrung führt.
- **Status:** ❌ Bewusst nicht umgesetzt (zurückgebaut). Ein randomisierter/
  geblindeter Studienmodus (`useStudyMode.js` + `StudyModePanel` in
  `SettingsModal.jsx`, inkl. `studyGroup`/`studyPhase`-Feldern in
  `SurveyComponent.tsx` und `ab_study_submissions`) wurde einmal implementiert
  und auf ausdrücklichen Wunsch wieder vollständig entfernt. Die App nutzt
  aktuell wieder ausschließlich den einfachen, selbstgewählten
  `isGamified`-Umschalter — ohne Phasen-UI, ohne Gruppenzuweisung.
- **Wichtiger Hinweis:** Die Selektionsverzerrung durch Selbstwahl (siehe
  oben) besteht damit weiterhin. Falls die eigentliche Nutzerstudie eine
  kontrollierte Zuweisung braucht, muss dafür vor der Datenerhebung eine
  eigene Lösung besprochen werden — die zurückgebaute Counterbalancing-Logik
  war ohnehin eine eigene Entwicklungsentscheidung ohne Zitatgrundlage aus
  Exposé oder Steinfurth (2017), siehe die vorherige Fassung dieses
  Abschnitts in der Git-Historie dieser Datei.

> **Korrekturhinweis (nachträglich):** Die ursprüngliche Fassung dieses
> Abschnitts (3.2/3.3) hat den Implementierungsstand **falsch** eingeschätzt,
> weil die erste Code-Durchsicht nur `.jsx`/`.js`-Dateien durchsucht hat und
> `SurveyComponent.tsx` sowie `src/server/00_survey_schema.sql` dabei
> übersehen wurden. Beide Instrumente (NASA-Raw-TLX vollständig, SUS
> vollständig) sind tatsächlich bereits implementiert — siehe unten. Diese
> Korrektur bleibt hier stehen, damit nachvollziehbar ist, wo die erste
> Einschätzung irrte.

### 3.2 NASA-TLX zur Erhebung kognitiver Last

- **Quelle (Exposé, Abschnitt 5, „Beabsichtigte Vorgehensweise"):**
  „NASA Raw TLX — Zur Messung der kognitiven Belastung und Frustration."
- **Status:** ✅ Vollständig umgesetzt (korrigiert). `SurveyComponent.tsx`
  (Z. 10–45, `NASA_SCALES`) implementiert alle sechs Raw-TLX-Subskalen als
  1–100-Regler: _Mental Demand_, _Physical Demand_, _Temporal Demand_,
  _Performance_, _Effort_, _Frustration_ (Z. 67–74, `NasaTlxPayload` aus
  `public/survey.ts`, Z. 6–12). Damit ist das Instrument methodisch
  vollständiger als der ursprüngliche `FeedbackCollector.jsx`
  (nur 3 von 6 Subskalen, 1–5-Skala statt 1–100) — letzterer wird laut
  `grep` nirgends mehr importiert/gerendert und ist **totes UI**
  (Vorgänger-Komponente, ersetzt durch `SurveyComponent.tsx`). Getriggert
  wird der Survey-Dialog alle 10 erreichten Punkte, in **beiden**
  `isGamified`-Zuständen (`hooks/useExerciseSession.js` Z. 282 und Z. 288–290),
  also als wiederholte Messung während der Nutzung, nicht nur einmalig am
  Ende — das ist eine methodische Designentscheidung, die im Methodenkapitel
  der Thesis explizit benannt werden sollte (wiederholte Messung vs. der
  einmaligen Abschlussbefragung bei Steinfurth 2017, S. 67 f.).

### 3.3 System Usability Scale (SUS) und Benchmarking

- **Quelle (Exposé, Abschnitt 5):** „System Usability Scale (SUS) — Zur
  objektiven Bewertung der Benutzerfreundlichkeit." Ergänzend zitiert der
  Steinfurth-Präzedenzfall (Tier A, S. 68) eine analoge, selbstentwickelte
  5er-Rating-Befragung nach dem Blindtest.
- **Status:** ✅ Vollständig umgesetzt (korrigiert). `SurveyComponent.tsx`
  (Z. 47–58, `SUS_SCALES`) implementiert alle zehn Standard-SUS-Items als
  5-Punkt-Radiogruppen mit „Strongly Disagree"/„Strongly Agree"-Ankern
  (Z. 264–319; `SusPayload` in `public/survey.ts`, Z. 33–37). Persistiert
  wird in einer dedizierten Supabase-Tabelle `ab_study_submissions`
  (`src/server/00_survey_schema.sql`, Z. 5–33) mit eigenen Spalten
  `sus_q01`…`sus_q10`, `app_version` (`'basic'`/`'gamified'`) sowie den
  a11y-Einstellungen zum Übermittlungszeitpunkt — die A/B-Zuordnung ist also
  bereits pro Datensatz mitgeschrieben.
- **Hinweis (Tier B):** Für die Einordnung der SUS-Rohwerte gegen
  publizierte Benchmarks für Gesundheits-/Therapie-Apps sollte Hyzy et al.
  (2022) herangezogen werden; auch hierfür liegt aktuell nur der
  Bibliographie-Eintrag ohne Volltext vor.

### 3.4 Kritischer Datenintegritäts-Bug in der Erhebungskette (gefunden + behoben)

Bei der Verifikation von 3.2/3.3 wurde ein Feldnamen-Mismatch zwischen
Frontend-Payload und Backend-Mapping entdeckt, der dazu geführt hätte, dass
**alle 10 SUS-Antworten und 3 der 6 NASA-TLX-Subskalen** bei jeder einzelnen
Einsendung als `NULL` in der Datenbank gelandet wären — für genau die Metrik,
auf der die zentrale Forschungsfrage der Thesis beruht.

- **Ursache:** `SurveyComponent.tsx` (Z. 148–150) sendet die Rohdaten per
  Objekt-Spread (`...nasaScores, ...susScores`), also mit den Feldnamen aus
  `public/survey.ts`: `mentalDemand`, `physicalDemand`, `temporalDemand`,
  `performance`, `effort`, `frustration` sowie `sus01`…`sus10`.
  `netlify/functions/submit-survey/index.js` las davor jedoch
  `payload.mental`, `payload.physical`, `payload.temporal` sowie
  `payload.sus_q01`…`payload.sus_q10` — Feldnamen, die im tatsächlichen
  Payload nicht existieren. Nur `performance`, `effort` und `frustration`
  stimmten zufällig überein.
- **Fix:** `netlify/functions/submit-survey/index.js` (Z. 76–94) liest jetzt
  `payload.mentalDemand` / `payload.physicalDemand` / `payload.temporalDemand`
  sowie `payload.sus01`…`payload.sus10`, mit Kommentar im Code, der die
  Diskrepanz und ihre Herkunft dokumentiert. Verifiziert per Testaufruf mit
  Beispielpayload (keine `undefined`-Werte mehr im resultierenden `dbData`).
- **Konsequenz:** Falls vor diesem Fix bereits echte Studiendaten erhoben
  wurden, sind deren `sus_q01`–`sus_q10`, `mental_demand`, `physical_demand`
  und `temporal_demand`-Spalten in `ab_study_submissions` wahrscheinlich
  `NULL` und für die SUS-/TLX-Auswertung unbrauchbar. **Vor der eigentlichen
  Nutzerstudie unbedingt mit einer echten End-to-End-Einsendung (nicht nur
  lokal) verifizieren, dass in Supabase korrekt befüllte Zeilen ankommen.**
- **Offener Punkt:** Für diese Erhebungskette existiert kein automatisierter
  Test (`netlify/functions/submit-survey/` hat kein Test-File). Ein
  Regressionstest, der `handler()` mit einem Beispielpayload aufruft und die
  resultierende `dbData`-Struktur prüft, würde einen Rückfall in denselben
  Fehler zuverlässig verhindern.

---

## 4. Statusmatrix (Kurzüberblick)

| Anforderung                                     | Quelle                                                 | Status                                                                     | Fundstelle im Code                                                      |
| ----------------------------------------------- | ------------------------------------------------------ | -------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Erwachsenengerechte Bildsprache                 | Exposé 2.1 (Elo et al. 2024)                           | ✅                                                                         | `VirtualGarden.jsx` Z. 28–54                                            |
| Keine Ranglisten/Timer/Bestrafung               | Exposé 2.3 (Dondio et al. 2024, Deterding et al. 2011) | ✅                                                                         | `useGamificationState.js`, README                                       |
| Stressarme Inhalte für ängstliche Nutzer        | Yu et al. 2021, S. 5, 11, 12–13                        | ✅                                                                         | `useCognitiveLoad.js` Z. 30–55                                          |
| Wachstumsmetapher statt Wettkampf               | Exposé 2.3 (Ning et al. 2025)                          | ✅                                                                         | `VirtualGarden.jsx` Z. 26                                               |
| Barrierefreiheit als Systemanforderung          | Exposé 2.3 (Lin 2024); Steinfurth 2017, S. 16          | ✅                                                                         | `styles/a11y.css`, `tests-playwright/accessibility.spec.js`             |
| Sprachsteuerung/TTS ohne starre Dialoge         | Exposé 2.3 (Lin 2024)                                  | ⚠️ (TTS jetzt automatisch bei Aktivierung, Spracherkennung noch zu prüfen) | `useAutoReadAloud.js`, `TTSController.jsx`, `useExerciseVoice.jsx`      |
| Farbe nie exklusiver Feedback-Kanal             | Steinfurth 2017, S. 46                                 | ⚠️ (pro Übung prüfen)                                                      | `a11y.css` Z. 63–96                                                     |
| Lokal-first / Datensparsamkeit                  | Zielgruppenschutz (sensible Gesundheitsdaten)          | ✅                                                                         | `utils/indexedDB.js`; Supabase nur in `netlify/functions/submit-survey` |
| Offline-fähige PWA, plattformunabhängig         | Steinfurth 2017, S. 7 f., 9                            | ✅                                                                         | `vite.config.js` (`vite-plugin-pwa`), `PwaUpdateBanner.jsx`             |
| Responsive, mobile-first                        | Steinfurth 2017, S. 30, 44                             | ✅                                                                         | `BottomNav.jsx` / `SidebarNav.jsx`, Tailwind                            |
| Iterativer, featureweise testbarer Prozess      | Steinfurth 2017, S. 12                                 | ✅ (Praxis)                                                                | Git-Historie, modulare Hooks                                            |
| Geblindete/randomisierte A/B-Zuweisung          | Steinfurth 2017, S. 67 (Grundidee)                     | ❌ (implementiert, dann auf Wunsch zurückgebaut)                           | siehe 3.1                                                               |
| NASA-Raw-TLX vollständig (6 Subskalen)          | Exposé Abschnitt 5                                     | ✅ (korrigiert)                                                            | `SurveyComponent.tsx` Z. 10–45, 67–74                                   |
| SUS-Fragebogen (10 Items)                       | Exposé Abschnitt 5                                     | ✅ (korrigiert)                                                            | `SurveyComponent.tsx` Z. 47–58, 264–319; `00_survey_schema.sql`         |
| Erhebungsdaten kommen unverfälscht in der DB an | —                                                      | ✅ (Bug gefunden + gefixt)                                                 | `netlify/functions/submit-survey/index.js` Z. 76–94, siehe 3.4          |

---

## 5. Arbeitsanweisungen für die KI bei Erstellung/Erweiterung/Anpassung

1. **Vor jeder neuen Gamification-Komponente:** gegen Prinzip 2.2 prüfen –
   kein sozialer Vergleich, kein harter Timer, keine Bestrafungsmechanik.
   Bei Unsicherheit lieber die non-punitive Variante wählen, wie sie in
   `useGamificationState.js` bereits etabliert ist.
2. **Vor jeder UI-Änderung:** `tests-playwright/accessibility.spec.js`
   (axe-core, WCAG 2.1 A/AA, siehe Kommentar Z. 4–11 der Datei) muss grün
   bleiben; bei sinnvollem Anlass das manuelle Protokoll in
   `docs/screen-reader-walkthrough.md` ergänzen.
3. **Bei neuen Übungstypen (`exercises/*.jsx`):** beide Zustände von
   `isGamified` implementieren und testen, damit der A/B-Vergleich der
   Thesis nicht durch inkonsistente Feature-Verfügbarkeit verzerrt wird.
4. **Bei farbcodiertem Feedback:** immer redundante Kennzeichnung (Icon/Form/
   Text) gemäß Prinzip 2.7 ergänzen, nicht nur Farbe.
5. **Bei neuen Texten/UI-Strings:** alle drei Sprachen (`de`, `en`, `pl`)
   synchron halten (`check-locales.mjs`, `locales.test.ts`); keine
   kindliche Ansprache, siehe Prinzip 2.1.
6. **Bei Datenerhebung/Telemetrie:** neue Datenpunkte standardmäßig lokal in
   IndexedDB halten; nur mit expliziter, informierter Einwilligung und über
   den bestehenden, getrennten Survey-Pfad (Netlify Function) an einen
   Server senden, siehe Prinzip 2.8.
7. **Bei Kamera-/Audiofunktionen:** vor Annahme einer Browser-API-Verfügbarkeit
   auf Ziel-Endgeräten real testen; siehe Warnung zu Steinfurth (2017,
   S. 56–58) unter Prinzip 2.9.
8. **Bei größeren Features:** in Feature-Sets zerlegen und einzeln
   review-/testbar machen (Prinzip 2.11), nicht als ein monolithischer
   Patch.

---

## 6. Offene Punkte / nächste Schritte (aus der Methodik noch nicht umgesetzt)

- [x] **Fehlende Aufgabenstellungen ergänzt** (auf Nutzerwunsch, „Scrabble
      usw."): `ScrabbleExercise.jsx`, `ClockExercise.jsx` und
      `SyllableExercise.jsx` hatten **gar keine** sichtbare Instruktion, was zu
      tun ist — nur Bild/Wort/Kacheln ohne Kontext. `PhonemeExercise.jsx` und
      `DictationExercise.jsx` zeigten nur einen Kategorienamen („Phonemes" /
      „Dictation") statt einer Handlungsanweisung. Neue i18n-Keys
      `scrabbleInstruction`, `clockInstruction`, `syllableInstruction`,
      `phonemeInstruction` (de/en/pl) plus Wiederverwendung des bereits
      vorhandenen, aber bis dahin nirgends verdrahteten Keys `listenCarefully`
      für Dictation. Instruktionen werden sowohl sichtbar angezeigt als auch —
      wo sinnvoll ohne bei jedem Replay lästig zu wiederholen — in die
      `useAutoReadAloud`-Vorlesefunktion aufgenommen.
      **Korrektur (Audit vom 2026-08-17):** Der ursprüngliche Eintrag hier
      behauptete, `MemorySpanExercise.jsx` sei toter Code. Das war falsch:
      die Komponente ist in `ExerciseContainer.jsx`s `EXERCISE_COMPONENTS`
      unter `memorySpan: MemorySpanExercise` verdrahtet, und
      `vocabulary_en.js`/`vocabulary_de.js`/`vocabulary_pl.js` enthalten
      jeweils einen `memorySpan`-Block mit passenden `type: 'memorySpan'`-
      Einträgen — für echte Nutzer:innen also durchaus erreichbar. Eine
      separate `*Instruction`-i18n-Key-Ergänzung war hier trotzdem nicht
      nötig: jeder Vokabular-Eintrag trägt bereits ein eigenes
      `instruction`-Feld, das sowohl sichtbar angezeigt als auch (nur in der
      Abfragephase, siehe 2.6) automatisch vorgelesen wird.
- [x] ~~SUS-Fragebogen ergänzen~~ — **bereits vorhanden** in
      `SurveyComponent.tsx` (siehe 3.3). Ursprünglich fälschlich als fehlend
      geführt.
- [x] ~~NASA-Raw-TLX vervollständigen~~ — **bereits vollständig** (6 von 6
      Subskalen) in `SurveyComponent.tsx` (siehe 3.2). Ursprünglich fälschlich
      als unvollständig geführt.
- [x] **Datenintegritäts-Bug in `submit-survey`** — gefunden und gefixt
      (siehe 3.4): Feldnamen-Mismatch hatte SUS- und Teile der TLX-Daten auf dem
      Weg zur Datenbank verworfen.
- [x] **`FeedbackCollector.jsx` entfernt** (samt `FeedbackCollector.test.jsx`)
      — bestätigt totes UI, kein Import mehr im Repo, vollständig durch
      `SurveyComponent.tsx` ersetzt (die eine Obermenge seiner Funktionalität
      abdeckt: 6 statt 3 NASA-TLX-Subskalen, plus SUS). Falls doch noch ein
      leichtgewichtiges Zwischenfeedback ohne vollen SUS-Block gewünscht wird,
      müsste das bewusst neu gebaut werden — nicht aus der Git-Historie
      reaktivieren, da es die falschen (unvollständigen) TLX-Skalen hatte.
- [ ] **End-to-End-Verifikation der Erhebungskette:** eine echte Testeinsendung
      gegen die deployte Netlify-Function/Supabase-Instanz fahren und prüfen,
      dass `ab_study_submissions` korrekt befüllte `sus_q01`–`sus_q10` und
      `mental_demand`/`physical_demand`/`temporal_demand` enthält — insbesondere
      falls vor dem Fix in 3.4 bereits Testdaten gesammelt wurden.
- [x] **Regressionstest für `netlify/functions/submit-survey/index.js`**
      ergänzt: `buildDbData()` als reine, testbare Funktion aus dem Handler
      extrahiert (I/O unverändert) und mit 10 Vitest-Fällen abgedeckt
      (`index.test.js`), inkl. eines Falls, der nachweislich fehlschlägt, wenn
      der Feldnamen-Mismatch aus 3.4 wieder eingeführt wird (manuell gegen eine
      Scratch-Kopie mit den alten Feldnamen verifiziert).
- [x] **Geblindeter/randomisierter Studienmodus** implementiert, dann auf
      ausdrücklichen Wunsch wieder vollständig zurückgebaut (`useStudyMode.js`
      gelöscht, `SettingsModal.jsx`/`SurveyComponent.tsx`/Schema revertiert).
      App nutzt wieder ausschließlich den einfachen Selbstwahl-Toggle. Siehe 3.1
      — die Selektionsverzerrung durch Selbstwahl bleibt damit ungelöst offen.
- [x] **Profile-Feature entfernt:** `ProfileModal.jsx` (Radar-Chart der
      eigenen NASA-TLX-Werte, CSV-Export der lokalen `ux_logs`) samt Routing
      (`useHashRoute.js`), Nav-Buttons (`BottomNav.jsx`, `SidebarNav.jsx`) und
      Tastenkürzel (`Ctrl+P` in `useKeyboardShortcuts.js`) auf ausdrücklichen
      Wunsch entfernt. `recharts` (einziger Konsument) dadurch komplett aus
      `package.json` entfernt — siehe `docs/bundle-size.md` für die
      Bundle-Größen vorher/nachher.
- [ ] **Sprachsteuerung gegen Lin (2024) prüfen:** Voice-Command-Flows auf
      starre vs. flexible Formulierungen hin überprüfen, sobald das
      Originalpaper vorliegt (aktuell Tier B, keine Seitenzahl verfügbar).
- [ ] **Fehlende Original-PDFs nachreichen** für Elo et al. (2024),
      Dondio et al. (2024), Hyzy et al. (2022), Lin (2024), Ning et al. (2025)
      und Deterding et al. (2011), um die Tier-B-Zitate im finalen Thesis-Text
      durch primärquellen-genaue Seitenangaben zu ersetzen.

---

## 7. Vollständiges Quellenverzeichnis dieser Datei

**Tier A (Volltext, Seite + Zitat verifiziert):**

- Yu, Z. (2021). The effects of gender, educational level, and personality
  on online learning outcomes during the COVID-19 pandemic. _International
  Journal of Educational Technology in Higher Education_, 18(14).
  https://doi.org/10.1186/s41239-021-00252-3
- Steinfurth, M. (2017). _Kombinierte Web- und Hybrid-App-Entwicklung –
  Adaptierung einer Android-App für die Lehrevaluation im Framework Ionic_
  [Masterarbeit]. Technische Hochschule Brandenburg.

**Tier B (nur via Exposé-Paraphrase, Original nicht vorliegend):**

- Elo, C.; Ihalainen, T.; Vihriälä, T.; Virkki, J. (2024). The Gamification
  Elements Speech-Language Pathologists Use to Motivate Children for Speech
  Therapy Training. In: _Games and Learning Alliance, GALA 2023_, LNCS 14475.
- Dondio, P.; Almo, A.; Amaral, M.; Tibebe, E.; Rocha, M.; Brennan, A. (2024).
  Not (Only) a Matter of Position: Player Traits Which Influence the
  Experience with the Leaderboard in a Digital Maths Game. In: _Games and
  Learning Alliance, GALA 2023_, LNCS 14475.
- Hyzy, M. et al. (2022). System Usability Scale Benchmarking for Digital
  Health Apps: Meta-analysis. _JMIR mHealth and uHealth_, 10(8), e37290.
- Lin, K. R. (2024). Towards Inclusive Voice User Interfaces: A Systematic
  Review of Voice Technology Usability for Users with Communication
  Disabilities. In: _HCI International 2024 Posters_, CCIS 2115.
- Ning, P.; DeWitt, D.; Chin, H. L.; Wang, H. (2025). Effects of Viewing
  Digital Environment Images on College Students' Positive Emotions, Nature
  Relatedness, and Environmental Preference. _On the Horizon_, 33(1).
- Deterding, S.; Dixon, D.; Khaled, R.; Nacke, L. (2011). From Game Design
  Elements to Gamefulness: Defining "Gamification". _Proceedings of the
  15th International Academic MindTrek Conference_, 9–15.
