export default {
  // General & Common
  appTitle: "Claro",
  introSubtitle: "Baue deine Brücke zur Sprachkompetenz.",
  start: "Starten",
  done: "Fertig",
  next: "Weiter",
  skip: "Überspringen",
  close: "Schließen",
  on: "EIN",
  off: "AUS",
  active: "Aktiv",
  select: "Auswählen",
  equip: "Auswählen",
  equipped: "Ausgerüstet",
  unlocked: "Freigeschaltet",
  buy: "Kaufen",
  loading: "Lädt...",
  noData: "Keine Daten in diesem Bereich verfügbar.",
  formatNotRecognized: "Übungsformat nicht erkannt.",
  profile: "Profil",
  level: "Stufe",
  quests: "Tagesaufgaben",
  shop: "Themen-Shop",
  coins: "Münzen",
  navAria: "Übungsbereiche",
  settingsAria: "Einstellungen",
  coinsAria: "Münzen",
  exerciseAria: "Übung",

  // Feedback / Messages
  successMsg: ["Ausgezeichnet!", "Klasse!", "Super gemacht!", "Perfekt!"],
  errorMsg: ["Lass uns das gemeinsam ansehen.", "Probieren wir es noch einmal.", "Fast richtig, schau noch mal hin."],
  streakMsg: [
    "{count} in Folge! 🔥",
    "Wahnsinn, {count} Treffer! 🚀",
    "{count}x richtig! 🌟",
    "Tolle Serie: {count}! 💪"
  ],
  levelUp: "Level Aufstieg!",
  hint: "Tipp",

  // Voice feedback & TTS
  voice: {
    success: ["Gut gemacht", "Ausgezeichnet", "Klasse", "Wunderbar"],
    error: ["Lass uns das gemeinsam ansehen", "Probieren wir es noch einmal", "Fast richtig, schau noch mal hin"],
    streak: [
      "{count} in Folge! Du bist nicht zu stoppen!",
      "Wahnsinn! Schon {count} richtige Antworten!",
      "Tolle Serie! Weiter so!",
      "Fantastisch! {count} Treffer nacheinander!"
    ]
  },
  voiceOptions: "Stimme des Sprechers",
  voiceDesc: "Wählen Sie eine Stimme für den Sprachassistenten",
  voiceDefault: "Systemstandard",
  voiceSpeed: "Sprechgeschwindigkeit",
  slow: "Langsamer",
  fast: "Schneller",
  voicePitch: "Tonhöhe",
  pitchLow: "Tief",
  pitchHigh: "Hoch",
  testVoice: "Stimme testen",
  testSentence: "Dies ist ein Test der ausgewählten Stimme.",

  // Settings & App Config
  settings: "Einstellungen",
  settingsTitle: "Einstellungen",
  settingsSubtitle: "SprachFlow · Barrierefreie Gamification",
  settingsBack: "← Zurück",
  settingsTheme: "Thema",
  settingsAccessibility: "Komfort",
  settingsFooter: "Ihre Einstellungen werden automatisch gespeichert.",
  tabGeneral: "Allgemein",
  tabA11y: "Komfort",
  tabVoice: "Stimme",
  tabShop: "Shop",
  tabGame: "Spiel",
  language: "Sprache",
  languageLabel: "Schnittstellensprache",
  appMode: "App-Modus",
  v1Label: "Klassisch",
  v1Desc: "Übungen ohne Gamifizierung",
  v2Label: "Gamifizierung",
  v2Desc: "Punkte, Münzen und Belohnungen",
  
  // Accessibility & Addons
  a11yBase: "Basismodus — immer aktiv",
  a11yBaseDesc: "Legasthenie-freundliche Schrift (OpenDyslexic), größere Abstände, sanfter Hintergrund",
  a11yAddons: "Komfort-Optionen",
  a11yAddonsDesc: "Wähle eine beliebige Kombination, um die App an dich anzupassen",
  a11y: {
    LRS: { name: 'Klare Schrift', desc: 'Legasthenie-freundliche Schrift (OpenDyslexic)' },
    Kontrast: { name: 'Hoher Kontrast', desc: 'Schwarz-weiße WCAG-AAA-Farben' },
    Motorik: { name: 'Komfort-Tasten', desc: 'Vergrößerte Buttons und ruhige Animationen' },
    Niedowidzenie: { name: 'Größerer Text', desc: 'Vergrößerte Schrift und Symbole' },
    Daltonizm: { name: 'Sichere Farben', desc: 'Klare und optimierte Farbpalette' },
    Redukcja: { name: 'Ruhiger Bildschirm', desc: 'Kein Flackern oder ablenkende Bewegungen' },
    Linijka: { name: 'Fokus-Lineal', desc: 'Hebt eine horizontale Linie unter dem Cursor hervor' },
    Spacing: { name: 'Größere Abstände', desc: 'Vergrößert den Abstand zwischen Buchstaben und Wörtern' },
    Desaturacja: { name: 'Sanfte Farben', desc: 'Verringert die Intensität leuchtender Farben' },
  },
  inclusive: {
    adaptiveDifficulty: { name: 'Adaptiver Schwierigkeitsgrad', desc: 'Spiel passt sich dem Tempo an' },
    bigTargets: { name: 'Große Schaltflächen', desc: 'Buttons min. 56px (Motorik-Hilfe)' },
    noFlash: { name: 'Blitz-freier Modus', desc: 'Kein Flackern — Epilepsie & Bewegungsempfindlichkeit' },
    audioRewards: { name: 'Audio-Belohnungen', desc: 'Tonsignale zusätzlich zu visuellen' },
    extendedTime: { name: 'Verlängerte Zeit', desc: 'Kein Zeitdruck — 3s statt 1.5s' },
    voiceAssistant: { name: 'Sprachassistent', desc: 'Liest Anweisungen und Optionen automatisch vor' },
    zenMode: { name: 'Zen-Modus', desc: 'Versteckt Ablenkungen (Punkte, Fortschrittsbalken)' },
    bionicReading: { name: 'Bionisches Lesen', desc: 'Fettet Wortanfänge, erleichtert die Fokussierung' },
    minimalistMode: { name: 'Minimalistische Ansicht', desc: 'Verbirgt dekorative Grafiken und Lottie-Animationen' },
    muteNotifications: { name: 'Benachrichtigungen stumm', desc: 'Deaktiviert gesprochene Erfolgs-/Fehlermeldungen und Töne' },
  },
  profiles: {
    Standard: { name: "Standard", desc: "Normale Ansicht" },
    LRS: { name: "Klare Schrift", desc: "Legasthenie-freundlich" },
    Kontrast: { name: "Hoher Kontrast", desc: "Bessere Lesbarkeit" },
    Motorik: { name: "Komfort-Tasten", desc: "Vergrößerte Buttons und ruhige Animationen" },
    Niedowidzenie: { name: "Größerer Text", desc: "Vergrößerte Schrift und Symbole" },
    Daltonizm: { name: "Sichere Farben", desc: "Klare und optimierte Farbpalette" },
    Redukcja: { name: "Ruhiger Bildschirm", desc: "Kein Flackern oder ablenkende Bewegungen" },
    Bionic: { name: "Bionisches Lesen", desc: "Hebt Wortanfänge hervor" },
    Linijka: { name: "Fokus-Lineal", desc: "Hebt eine horizontale Linie hervor" },
    Spacing: { name: "Größere Abstände", desc: "Erhöht den Zeichen- und Wortabstand" },
    Desaturacja: { name: "Sanfte Farben", desc: "Verringert die Intensität leuchtender Farben" }
  },
  accDescriptions: { Standard: "Standardansicht", Kontrast: "Hoher Kontrastmodus", LRS: "Klare Schrift", Motorik: "Komfort-Tasten" },

  // Gamification & Rewards
  versionGamified: "SPIELERISCH",
  versionGamifiedSub: "Punkte & Belohnungen",
  versionBase: "BASIS",
  versionBaseSub: "Ohne Punkte",
  gamificationTitle: "Inklusive Gamifizierungs-Optionen",
  gamificationDesc: "Passen Sie das Belohnungssystem an Ihre Bedürfnisse an",
  themeShop: "Themen-Shop",
  themeShopDesc: "Münzen für neue visuelle Themen ausgeben",
  earnCoinHint: "Du erhältst 1 Münze für jede richtige Antwort",
  needMoreCoins: "Nicht genug Münzen",
  themes: {
    Natur: { name: "Natur", icon: "🌿", desc: "Grüne Farben, entspannend" },
    Musik: { name: "Musik", icon: "🎵", desc: "Violett, dynamic" },
    Kunst: { name: "Kunst", icon: "🎨", desc: "Bernstein, kreativ" },
    Space: { name: "Weltraum", icon: "🚀", desc: "Kosmische Tiefe" },
    Ocean: { name: "Ozean", icon: "🐳", desc: "Meeresruhe" }
  },
  themeNames: { Natur: "Natur", Musik: "Musik", Kunst: "Kunst", Space: "Weltraum", Ocean: "Ozean" },
  levelIcons: { Natur: ['🌿', '☘️', '🌳', '🌲', '🏔️'], Musik: ['🎵', '🎶', '🎸', '🎹', '🎼'], Kunst: ['💡', '🎨', '🖌️', '🖼️', '💎'], Space: ['✨', '⭐', '🛰️', '🚀', '🪐'], Ocean: ['💧', '🌊', '🧭', '⚓', '🚢'] },
  progressStages: { Natur: ["Keimling", "Stängel", "Knospe", "Blüte", "Blume"], Musik: ["Sechzehntel", "Achtel", "Viertel", "Halbe", "Instrument"], Kunst: ["Pinsel", "Palette", "Skizze", "Farben", "Meisterwerk"], Space: ["Stern", "Komet", "Mond", "Planet", "Rakete"], Ocean: ["Tropfen", "Fisch", "Koralle", "Delfin", "Wal"] },
  garden: "Garten",
  gardenBlooming: "Der Garten blüht! Erreichte Ziele:",
  gardenEmpty: "Dein eigenes Ökosystem. Es wächst mit jedem deiner Fortschritte.",
  srPlantFeature: "Deine Reise beinhaltet aktuell ein(e)",
  srDailyRewards: "Es hat",
  srRewardsCount: "tägliche Belohnungen.",
  dailyGoalProgress: "Tagesziel-Fortschritt",
  srVisitor: "Ein freundlicher Besucher hat sich dir aufgrund deiner beständigen Übung angeschlossen.",
  srTrophies: "Dank deiner Ausdauer sind {count} einzigartige Objekte im Garten erschienen.",
  rewardItems: { Natur: ["💎", "🏆", "💡", "📈", "🎯"], Musik: ["💎", "🏆", "💡", "📈", "🎯"], Kunst: ["💎", "🏆", "💡", "📈", "🎯"], Space: ["💎", "🏆", "💡", "📈", "🎯"], Ocean: ["💎", "🏆", "💡", "📈", "🎯"] },
  
  // Goals & Progress
  dailyGoal: "Tagesziel",
  goal5: "5 Min — Kurze Wiederholung",
  goal10: "10 Min — Gute Gewohnheit",
  goal15: "15 Min — Voller Fokus",
  goal20: "20 Min — Intensives Training",
  dailySummary: "Heutige Aktivität",
  exercisesCount: "Übungen",
  totalEffort: "Gesamt",
  longestStreak: "Längste tägliche Serie",
  daysCount: "Tage",
  errorAnalysis: "Fehleranalyse",
  errorAnalysisSub: "Anzahl der Fehler an einzelnen Tagen",
  exportLogs: "Daten exportieren (CSV)",
  exportDesc: "NASA-TLX & UEQ-Umfrageergebnisse herunterladen",
  noDataToExport: "Keine Daten zum Exportieren",
  feedback: { title: "Ein Moment der Reflexion", desc: "Wie bewerten Sie diese Sitzung? Ihr Feedback hilft uns, die App anzupassen.", nasaTitle: "Arbeitsbelastung (NASA-TLX)", mental: "Geistige Anforderung", mentalDesc: "Wie viel Nachdenken erforderten die Aufgaben?", physical: "Anstrengung & Ermüdung", physicalDesc: "Wie müde fühlen Sie sich nach dieser Sitzung?", frustration: "Frustrationsniveau", frustrationDesc: "Haben Sie sich bei den Aufgaben gestresst oder irritiert gefühlt?", low: "Niedrig", high: "Hoch", ueqTitle: "Nutzererlebnis (UEQ-Short)", ueqAttractiveness: "Attraktivität", ueqAttrLeft: "Unangenehm", ueqAttrRight: "Angenehm", ueqStimulation: "Stimulation", ueqStimLeft: "Langweilig", ueqStimRight: "Spannend", submit: "Speichern und weiter", skip: "Diesmal überspringen" },
  mapTitle: "Herausforderungskarte", choosePath: "Wähle deinen Weg", nextLevel: "Nächste Stufe", lockedNode: "Gesperrt", completedNode: "Abgeschlossen", backToMap: "Zurück zur Karte", energyTitle: "Kognitive Energie", breakTitle: "Zeit für eine Pause?", breakDesc: "Wir haben bemerkt, dass Sie intensiv arbeiten. Ruhen Sie sich im Garten aus, um neue Energie zu tanken.", takeBreakBtn: "Pause machen (+2 💰)", continueBtn: "Weitermachen",
  
  // Exercises specific
  pillars: { Literacy: "Lesen & Schreiben", Visual: "Sehen & Raum", Cognitive: "Logik & Gedächtnis" },
  pillarIcons: { Literacy: '📖', Visual: '👁️', Cognitive: '🧠' },
  categories: { Phonem: "Wort: Laute", Syllable: "Wort: Silben", Context: "Text: Lesen", Graphem: "Schreiben: Regeln", Scrabble: "Schreiben: Synthese", LCWC: "Schreiben: Gedächtnis", Dictation: "Schreiben: Diktat", Tracking: "Sehen: Verfolgung", Clock: "Sehen: Uhrzeit", Categorization: "Logik: Kategorien", Sequence: "Logik: Sequenzen" },
  difficulty: "Schwierigkeitsgrad",
  diffLevels: ["Leicht", "Mittel", "Schwer"],
  questLabel: (target, type, pillars) => `${target} Aufgaben: ${type === 'Any' ? 'Beliebig' : pillars[type] || type}`,
  trackAndMatch: "Folge der Markierung und wähle die Richtung", orderCorrectly: "In die richtige Reihenfolge bringen", undo: "Rückgängig", tempoLabel: "Typ", normalMode: "Normal", slowMode: "Langsam", spellMode: "Buchstabieren", readAloud: "Vorlesen", syllablesListen: "Silben anhören", check: "Prüfen", delete: "Löschen", tapToSpeak: "Tippen zum Sprechen", listening: "Höre zu...", collectedLabel: "Gesammelt", selectCorrect: "Wähle das richtige Wort:", tapToBuild: "Klicke Wörter, um die Reihenfolge zu bilden", listenCarefully: "Hören Sie sich das Wort genau an.", readyToSegment: "Ich bin bereit zum Segmentieren", tapBoxesInstruction: "Tippen Sie auf die Kästchen, während Sie jeden einzelnen Laut aussprechen.", completeExercise: "Übung abschließen", playAudio: "Audio abspielen", lookAndListen: "Schauen Sie sich das Wort an und hören Sie sich die Aussprache an.", studiedWord: "Ich habe das Wort studiert", sayWordAloud: "Sagen Sie das Wort laut.", breakIntoSounds: "Zerlegen Sie es in seine einzelnen Laute.", takeYourTime: "Lassen Sie sich Zeit. Fühlen Sie die Form der Laute im Mund, bevor Sie schreiben.", coverAndWrite: "Wort abdecken & schreiben", typeFromMemory: "Geben Sie das Wort aus dem Gedächtnis ein.", typeHere: "Hier tippen...", checkSpelling: "Meine Rechtschreibung prüfen", compareSpelling: "Vergleichen Sie Ihre Schreibweise:", targetWord: "Zielwort", yourSpelling: "Ihre Schreibweise", spelledCorrectly: "Ja, ich habe es richtig geschrieben!", tryAgain: "Ich muss es noch einmal versuchen", listenToPhonemes: "Hören Sie sich die getrennten Laute an.", typeBlendedWord: "Geben Sie das Wort ein, das diese Laute bilden.", blendSounds: "Ich bin bereit zum Zusammensetzen", readParagraph: "Lesen Sie den folgenden Absatz sorgfältig durch.", paragraphRead: "Ich bin mit dem Lesen fertig", rtSummarize: "Zusammenfassen", rtSummarizeDesc: "Was war die Hauptaussage dieses Textes?", rtQuestion: "Fragen", rtQuestionDesc: "Stellen Sie eine Frage zu etwas Unklarem oder Interessantem im Text.", rtClarify: "Klären", rtClarifyDesc: "Identifizieren Sie verwirrende Wörter oder Phrasen und erklären Sie sie.", rtPredict: "Vorhersagen", rtPredictDesc: "Was denken Sie, was als Nächstes passieren wird oder was ist die logische Schlussfolgerung?", heard: "Gehört", voiceInput: "Spracheingabe", speakOptionNumber: "Sprechen Sie die Optionsnummer", speakTileNumber: "Sprechen Sie die Kachelnummer", speakGapNumber: "Sprechen Sie die Lückennummer zum Schneiden", tapAndPronounce: "Tippen und Wort aussprechen", skipPronunciation: "Ausspracheprüfung überspringen", readSentenceAndOptions: "Satz und Optionen lesen", removeCut: (pos) => `Schnitt an Position ${pos} entfernen`, addCut: (pos) => `Schnitt an Position ${pos} hinzufügen`,
  
  // Footer
  thesisInfo: "Masterarbeit\nBarrierefreie Gamification & Voice-Integration\nin einer PWA zur Unterstützung sprachtherapeutischer\nÜbungen bei LRS",
  tags: { kontrast: "Kontrast", wzrok: "Sehen", motor: "Motorik", dotyk: "Berühren", zoom: "Zoom", kolor: "Farbe", ruch: "Bewegung", epilepsja: "Epilepsie", linijka: "Fokus" },

  // Voice Assistant - Speech Recognition Commands
  commands: {
    next: ["weiter", "nächste", "fortsetzen", "fertig"],
    check: ["prüfen", "bestätigen"],
    undo: ["rückgängig", "zurück", "löschen"],
    skip: ["überspringen", "ich weiß nicht", "weiter"],
    hint: ["tipp", "hilf mir", "hilfe"]
  },
  affirmations: [
    "Dein Garten wächst wunderbar dank deiner heutigen Arbeit.",
    "Jeder Schritt ist ein Fortschritt. Toller Einsatz!",
    "Sich Zeit zu nehmen ist der beste Weg zu lernen.",
    "Du machst stetige Fortschritte. Mach weiter in deinem eigenen Tempo.",
    "Danke, dass du heute hier bist. Dein Engagement zählt."
  ],
  dailyTaskComplete: {
    title: "Hervorragende Leistung heute!",
    desc: "Du hast deine tägliche Übung abgeschlossen. Deine Beständigkeit baut ein starkes Fundament auf.",
    chooseReward: "Wähle deine nächste Belohnung für den Garten",
    plantSeed: "Pflanzen & Weiter",
    options: {
      oak: { name: "Eiche", desc: "Ein Symbol für Kraft und Ausdauer." },
      rose: { name: "Rosenstrauch", desc: "Eine schöne Belohnung für deinen Fokus." },
      bonsai: { name: "Bonsai", desc: "Steht für Geduld und stetiges Wachstum." }
    }
  },
  reflection: {
    title: "Ein Moment der Reflexion",
    desc: "Hier gibt es keine Noten. Wie sicher hast du dich bei dieser Übung gefühlt?",
    save: "Speichern & Pflanze gießen",
    options: {
      difficult: { label: "Schwer", desc: "Ich brauche mehr Zeit" },
      manageable: { label: "Machbar", desc: "Ich mache Fortschritte" },
      easy: { label: "Leicht", desc: "Ich fühle mich sicher" }
    }
  }
};