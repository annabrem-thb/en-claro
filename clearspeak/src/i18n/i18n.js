// i18n.js
// Internationalization dictionary containing all UI strings and voice prompts.
// This version includes "Context Master" features and voice feedback.

const translations = {
  de: {
    appTitle: "ContextMaster",
    introSubtitle: "Baue deine Brücke zur Sprachkompetenz.",
    start: "Starten",
    done: "Fertig", // Used in your intro screen
    successMsg: [
      "Ausgezeichnet!",
      "Klasse!",
      "Super gemacht!",
      "Perfekt!"
    ],
    levelUp: "Level Aufstieg!",
    next: "Weiter",
    skip: "Überspringen",
    hint: "Tipp",
    tapToBuild: "Klicke Wörter, um die Reihenfolge zu bilden",
    matchDirection: "Richtung anpassen",
    noData: "Keine Daten in diesem Bereich verfügbar.",
    formatNotRecognized: "Übungsformat nicht erkannt.",
    difficulty: "Schwierigkeitsgrad",
    diffLevels: ["Leicht", "Mittel", "Schwer"],
    pillars: {
      Spelling: "Wörter pflegen",
      Structure: "Sätze nähren",
      Spatial: "Wege anlegen",
      Memory: "Gedächtnis stärken"
    },
    categories: {
      Phonem: "Laute",
      Silben: "Silben",
      Graphem: "Buchstaben",
      Wortbild: "Wortform",
      Seq: "Sequenz",
      Uhrzeit: "Uhr",
      Directions: "Richtungen"
    },
    voice: {
      success: [
        "Gut gemacht", 
        "Ausgezeichnet", 
        "Klasse", 
        "Wunderbar"
      ],
      error: [
        "Lass uns das gemeinsam ansehen", 
        "Probieren wir es noch einmal", 
        "Fast richtig, schau noch mal hin"
      ],
      streak: [
        "{count} in Folge! Du bist nicht zu stoppen!",
        "Wahnsinn! Schon {count} richtige Antworten!",
        "Tolle Serie! Weiter so!",
        "Fantastisch! {count} Treffer nacheinander!"
      ]
    },
    rewardItems: {
      Natur: ["💎", "🏆", "💡", "📈", "🎯"],
      Musik: ["💎", "🏆", "💡", "📈", "🎯"],
      Kunst: ["💎", "🏆", "💡", "📈", "🎯"],
      Space: ["💎", "🏆", "💡", "📈", "🎯"],
      Ocean: ["💎", "🏆", "💡", "📈", "🎯"]
    },
    versionGamified: "SPIELERISCH",
    versionGamifiedSub: "Punkte & Belohnungen",
    versionBase: "BASIS",
    versionBaseSub: "Ohne Punkte",
    settingsBack: "← Zurück",
    settingsTitle: "Einstellungen",
    languageLabel: "Sprache",
    settingsTheme: "Thema",
    settingsAccessibility: "Barrierefreiheit",
    settingsFooter: "Ihre Einstellungen werden automatisch gespeichert.",
    trackAndMatch: "Folge der Markierung und wähle die Richtung",
    orderCorrectly: "In die richtige Reihenfolge bringen",
    undo: "Rückgängig",
    tempoLabel: "Typ",
    normalMode: "Normal",
    slowMode: "Langsam",
    spellMode: "Buchstabieren",
    readAloud: "Vorlesen",
    syllablesListen: "Silben anhören",
    check: "Prüfen",
    delete: "Löschen",
    tapToSpeak: "Tippen zum Sprechen",
    listening: "Höre zu...",
    level: "Level",
    collectedLabel: "Gesammelt",
    loading: "Lädt...",
    errorMsg: [
      "Lass uns das gemeinsam ansehen.", 
      "Probieren wir es noch einmal.", 
      "Fast richtig, schau noch mal hin."
    ],
    selectCorrect: "Wähle das richtige Wort:",
    themes: {
      Natur: { name: "Natur", icon: "🌿", desc: "Grüne Farben, entspannend" },
      Musik: { name: "Musik", icon: "🎵", desc: "Violett, dynamic" },
      Kunst: { name: "Kunst", icon: "🎨", desc: "Bernstein, kreativ" }
    },
    profiles: {
      Standard: { name: "Standard", desc: "Normale Ansicht" },
      LRS: { name: "LRS Modus", desc: "Legasthenie-freundlich" },
      Kontrast: { name: "Hoher Kontrast", desc: "Bessere Lesbarkeit" },
      Motorik: { name: "Motorik", desc: "Große Tasten" }
    },
    levelIcons: {
      Natur: ['🌿', '☘️', '🌳', '🌲', '🏔️'],
      Musik: ['🎵', '🎶', '🎸', '🎹', '🎼'],
      Kunst: ['💡', '🎨', '🖌️', '🖼️', '💎'],
      Space: ['✨', '⭐', '🛰️', '🚀', '🪐'],
      Ocean: ['💧', '🌊', '🧭', '⚓', '🚢'],
    },
    progressStages: {
    Natur: ["Keimling", "Stängel", "Knospe", "Blüte", "Blume"],
    Musik: ["Sechzehntel", "Achtel", "Viertel", "Halbe", "Instrument"],
    Kunst: ["Pinsel", "Palette", "Skizze", "Farben", "Meisterwerk"],
    Space: ["Stern", "Komet", "Mond", "Planet", "Rakete"],
    Ocean: ["Tropfen", "Fisch", "Koralle", "Delfin", "Wal"],
  },  
    shopTitle: "Themen-Shop",
    coins: "Münzen",
    buy: "Kaufen",
    equipped: "Ausgerüstet",
    unlocked: "Freigeschaltet",
    notEnoughCoins: "Nicht genug Münzen!",
  streakMsg: [
    "{count} in Folge! 🔥",
    "Wahnsinn, {count} Treffer! 🚀",
    "{count}x richtig! 🌟",
    "Tolle Serie: {count}! 💪"
  ],
  settings: "Einstellungen",
  language: "Sprache",
  accessibility: "Barrierefreiheit",
  gamification: "Gamification",
  themeShop: "Themen-Shop",
  theme: "Thema",
  on: "EIN",
  off: "AUS",
  select: "Auswählen",
  accDescriptions: {
    Standard: "Standardansicht",
    Kontrast: "Hoher Kontrastmodus",
    LRS: "Schriftart für Legastheniker"
  },
  themeNames: {
    Natur: "Natur",
    Musik: "Musik",
    Kunst: "Kunst",
    Space: "Weltraum",
    Ocean: "Ozean"
  },
  garden: "Garten",
  gardenBlooming: "Der Garten blüht! Erreichte Ziele:",
  gardenEmpty: "Dein eigenes Ökosystem. Es wächst mit jedem deiner Fortschritte.",
  srPlantFeature: "Deine Reise beinhaltet aktuell ein(e)",
  srDailyRewards: "Es hat",
  srRewardsCount: "tägliche Belohnungen.",
  dailyGoalProgress: "Tagesziel-Fortschritt",
  srVisitor: "Ein freundlicher Besucher hat sich dir aufgrund deiner beständigen Übung angeschlossen."
  },
  en: {
    appTitle: "ContextMaster",
    introSubtitle: "Build your bridge to fluency.",
    start: "Get Started",
    done: "Done",
    successMsg: [
      "Great job!", 
      "Excellent!", 
      "Awesome!", 
      "Perfect!"
    ],
    levelUp: "Level Up!",
    next: "Next",
    skip: "Skip",
    hint: "Hint",
    tapToBuild: "Tap words to build the sequence",
    matchDirection: "Match the direction",
    noData: "No tasks available in this section.",
    formatNotRecognized: "Exercise format not recognized.",
    difficulty: "Difficulty",
    diffLevels: ["Easy", "Medium", "Hard"],
    pillars: {
      Spelling: "Tend to Words",
      Structure: "Nurture Sentences",
      Spatial: "Clear the Paths",
      Memory: "Grow Memory"
    },
    categories: {
      Phonem: "Sounds",
      Silben: "Syllables",
      Graphem: "Letters",
      Wortbild: "Word Shape",
      Seq: "Sequence",
      Uhrzeit: "Clock",
      Directions: "Directions"
    },
    voice: {
      success: [
        "Excellent", 
        "Great job", 
        "Awesome", 
        "Spot on"
      ],
      error: [
        "Let's review this together", 
        "Let's try that again", 
        "Almost there, take another look"
      ],
      streak: [
        "{count} in a row! You are on fire!",
        "Amazing! That's {count} correct answers!",
        "Awesome streak! Keep it up!",
        "Unstoppable! {count} hits in a row!"
      ]
    },
    rewardItems: {
      Natur: ["💎", "🏆", "💡", "📈", "🎯"],
      Musik: ["💎", "🏆", "💡", "📈", "🎯"],
      Kunst: ["💎", "🏆", "💡", "📈", "🎯"],
      Space: ["💎", "🏆", "💡", "📈", "🎯"],
      Ocean: ["💎", "🏆", "💡", "📈", "🎯"]
    },
    versionGamified: "GAMIFIED",
    versionGamifiedSub: "Points & rewards",
    versionBase: "BASE",
    versionBaseSub: "No points",
    settingsBack: "← Back",
    settingsTitle: "Settings",
    languageLabel: "Language",
    settingsTheme: "Theme",
    settingsAccessibility: "Accessibility",
    settingsFooter: "Your settings are saved automatically.",
    trackAndMatch: "Follow the highlight and match the direction",
    orderCorrectly: "Put in the correct order",
    undo: "Undo",
    tempoLabel: "Type",
    normalMode: "Normal",
    slowMode: "Slow",
    spellMode: "Spell",
    readAloud: "Read Aloud",
    syllablesListen: "Listen to Syllables",
    check: "Check",
    delete: "Delete",
    tapToSpeak: "Tap to Speak",
    listening: "Listening...",
    level: "Level",
    collectedLabel: "Collected",
    loading: "Loading...",
    errorMsg: [
      "Let's review this together.", 
      "Let's try that again.", 
      "Almost there, take another look."
    ],
    selectCorrect: "Select the correct word:",
    themes: {
      Natur: { name: "Nature", icon: "🌿", desc: "Green colors, relaxing" },
      Musik: { name: "Music", icon: "🎵", desc: "Purple, dynamic" },
      Kunst: { name: "Art", icon: "🎨", desc: "Amber, creative" }
    },
    profiles: {
      Standard: { name: "Standard", desc: "Default view" },
      LRS: { name: "Dyslexia", desc: "Dyslexia-friendly font" },
      Kontrast: { name: "High Contrast", desc: "Better readability" },
      Motorik: { name: "Motor Skills", desc: "Larger buttons" }
    },
    levelIcons: {
      Natur: ['🌿', '☘️', '🌳', '🌲', '🏔️'],
      Musik: ['🎵', '🎶', '🎸', '🎹', '🎼'],
      Kunst: ['💡', '🎨', '🖌️', '🖼️', '💎'],
      Space: ['✨', '⭐', '🛰️', '🚀', '🪐'],
      Ocean: ['💧', '🌊', '🧭', '⚓', '🚢'],
    },
   progressStages: {
    Natur: ["Seed", "Stem", "Bud", "Blooming", "Flower"],
    Musik: ["Sixteenth", "Eighth", "Quarter", "Half", "Instrument"],
    Kunst: ["Brush", "Palette", "Sketch", "Colors", "Masterpiece"],
    Space: ["Star", "Comet", "Moon", "Planet", "Rocket"],
    Ocean: ["Drop", "Fish", "Coral", "Dolphin", "Whale"],
      },
  shopTitle: "Theme Shop",
    coins: "Coins",
    buy: "Buy",
    equipped: "Equipped",
    unlocked: "Unlocked",
    notEnoughCoins: "Not enough coins!",
  streakMsg: [
    "{count} in a row! 🔥",
    "{count} hits! 🚀",
    "Awesome streak: {count}! 🌟",
    "Unstoppable: {count}x! 💪"
  ],
  settings: "Settings",
  language: "Language",
  accessibility: "Accessibility",
  gamification: "Gamification",
  themeShop: "Theme Shop",
  on: "ON",
  off: "OFF",
  select: "Select",

accDescriptions: {
  Standard: "Default View",
  Kontrast: "High Contrast Mode",
  LRS: "Dyslexia Friendly Font"
},

themeNames: {
  Natur: "Nature",
  Musik: "Music",
  Kunst: "Art",
  Space: "Space",
  Ocean: "Ocean"
  },
  garden: "Garden",
  gardenBlooming: "The garden is blooming! Completed goals:",
  gardenEmpty: "Your own ecosystem. It will grow with your every progress.",
  srPlantFeature: "Your journey currently features a",
  srDailyRewards: "It has",
  srRewardsCount: "daily rewards.",
  dailyGoalProgress: "Daily Goal Progress",
  srVisitor: "A friendly visitor has joined you due to your consistent practice."
  },
  pl: {
    appTitle: "ContextMaster",
    introSubtitle: "Zbuduj swój most do biegłości.",
    start: "Rozpocznij",
    successMsg: [
      "Świetnie!", 
      "Doskonale!", 
      "Wspaniale!", 
      "Super!"
    ],
    levelUp: "Nowy Poziom!",
    next: "Dalej",
    skip: "Pomiń",
    hint: "Podpowiedź",
    noData: "Brak zadań w tej sekcji.",
    formatNotRecognized: "Błąd formatu zadania.",
    difficulty: "Poziom trudności",
    diffLevels: ["Łatwy", "Średni", "Trudny"],
    pillars: {
      Spelling: "Pielęgnuj Słowa",
      Structure: "Zadbaj o Zdania",
      Spatial: "Wytyczaj Ścieżki",
      Memory: "Rozwijaj Pamięć"
    },
    voice: {
      success: [
        "Doskonale", 
        "Świetnie", 
        "Wspaniale", 
        "Znakomicie"
      ],
      error: [
        "Przeanalizujmy to razem", 
        "Spróbujmy jeszcze raz", 
        "Prawie dobrze, spójrz jeszcze raz"
      ],
      streak: [
        "{count} z rzędu! Idziesz jak burza!",
        "Niesamowite! To już {count} poprawnych odpowiedzi!",
        "Wspaniała seria! Tak trzymaj!",
        "Rewelacja! {count} trafień bez błędu!"
      ]
    },
    rewardItems: {
      Natur: ["💎", "🏆", "💡", "📈", "🎯"],
      Musik: ["💎", "🏆", "💡", "📈", "🎯"],
      Kunst: ["💎", "🏆", "💡", "📈", "🎯"],
      Space: ["💎", "🏆", "💡", "📈", "🎯"],
      Ocean: ["💎", "🏆", "💡", "📈", "🎯"]
    },
    versionGamified: "GRYWALIZACJA",
    versionGamifiedSub: "Punkty i nagrody",
    versionBase: "PODSTAWA",
    versionBaseSub: "Bez punktów",
    settingsBack: "← Wróć",
    settingsTitle: "Ustawienia",
    languageLabel: "Język",
    settingsTheme: "Motyw",
    settingsAccessibility: "Dostępność",
    settingsFooter: "Twoje ustawienia są zapisywane automatycznie.",
    categories: { 
      Phonem: "Fonemy", 
      Silben: "Sylaby", 
      Graphem: "Grafemy", 
      Wortbild: "Kształt Słowa", 
      Context: "Kontekst" ,
      Uhrzeit: "Zegar",
      Seq: "Sekwencje",
      Directions: "Kierunki",
      Tracking: "Śledzenie Wzrokowe"
    },
    trackAndMatch: "Podążaj za podświetleniem i wskaż kierunek",
    orderCorrectly: "Ułóż w odpowiedniej kolejności",
    undo: "Cofnij",
    tempoLabel: "Typ czytania",
    normalMode: "Normalne",
    slowMode: "Wolne",
    spellMode: "Literowanie",
    readAloud: "Czytaj na głos",
    syllablesListen: "Posłuchaj sylab",
    check: "Sprawdź",
    delete: "Usuń",
    done: "Gotowe",
    tapToSpeak: "Dotknij, aby mówić",
    listening: "Słucham...",
    level: "Poziom",
    collectedLabel: "Zebrane",
    loading: "Wczytywanie...",
    errorMsg: [
      "Przeanalizujmy to razem.", 
      "Spróbujmy jeszcze raz.", 
      "Prawie dobrze, spójrz jeszcze raz."
    ],
    selectCorrect: "Wybierz poprawne słowo:",
    themes: {
      Natur: { name: "Natura", icon: "🌿", desc: "Zielone barwy, relaks" },
      Musik: { name: "Muzyka", icon: "🎵", desc: "Fiolet, dynamika" },
      Kunst: { name: "Sztuka", icon: "🎨", desc: "Bursztyn, kreatywność" }
    },
    profiles: {
      Standard: { name: "Standard", desc: "Widok domyślny" },
      LRS: { name: "Dysleksja", desc: "Czcionka ułatwiająca czytanie" },
      Kontrast: { name: "Wysoki Kontrast", desc: "Lepsza czytelność" },
      Motorik: { name: "Motoryka", desc: "Większe przyciski" }
    },
    levelIcons: {
      Natur: ['🌿', '☘️', '🌳', '🌲', '🏔️'],
      Musik: ['🎵', '🎶', '🎸', '🎹', '🎼'],
      Kunst: ['💡', '🎨', '🖌️', '🖼️', '💎'],
      Space: ['✨', '⭐', '🛰️', '🚀', '🪐'],
      Ocean: ['💧', '🌊', '🧭', '⚓', '🚢'],
    },
  tapToBuild: "Wybierz słowa w odpowiedniej kolejności",
  progressStages: {
    Natur: ["Ziarenko", "Łodyga", "Pąk", "Rozkwit", "Kwiat"],
    Musik: ["Szesnastka", "Ósemka", "Ćwierćnuta", "Półnuta", "Instrument"],
    Kunst: ["Pędzel", "Paleta", "Szkic", "Farby", "Arcydzieło"],
    Space: ["Gwiazda", "Kometa", "Księżyc", "Planeta", "Rakieta"],
    Ocean: ["Kropla", "Ryba", "Koralowiec", "Delfin", "Wieloryb"]
  },
  shopTitle: "Sklep z Motywami",
  coins: "Monety",
  buy: "Kup",
  equipped: "Używany",
  unlocked: "Odblokowany",
  notEnoughCoins: "Za mało monet!",
  streakMsg: [
    "{count} z rzędu! 🔥",
    "Seria {count} trafień! 🚀",
    "Masz już {count}! 🌟",
    "{count}x bezbłędnie! 💪"
  ],

  settings: "Ustawienia",
  language: "Język",
  accessibility: "Dostępność",
  gamification: "Grywalizacja",
  themeShop: "Sklep z Motywami",
  theme: "Motyw",
  on: "WŁĄCZONA",
  off: "WYŁĄCZONA",
  select: "Wybierz",

  accDescriptions: {
    Standard: "Widok domyślny",
    Kontrast: "Tryb wysokiego kontrastu",
    LRS: "Czcionka dla dyslektyków"
  },

  themeNames: {
    Natur: "Natura",
    Musik: "Muzyka",
    Kunst: "Sztuka",
    Space: "Kosmos",
    Ocean: "Ocean"
  },
  garden: "Ogród",
  gardenBlooming: "Ogród rozkwita! Zrealizowane cele:",
  gardenEmpty: "Twój własny ekosystem. Będzie rósł wraz z każdym Twoim postępem.",
  srPlantFeature: "Twoja podróż obecnie zawiera",
  srDailyRewards: "Posiada",
  srRewardsCount: "codziennych nagród.",
  dailyGoalProgress: "Postęp Celu Dziennego",
  srVisitor: "Przyjazny gość dołączył do Ciebie dzięki Twojej regularnej praktyce."
}
};

export const useTranslation = (language) => {
  return translations[language] || translations.de;
};