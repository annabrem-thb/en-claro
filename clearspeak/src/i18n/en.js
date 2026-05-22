export default {
  // General & Common
  appTitle: "Context Master",
  introSubtitle: "Build your bridge to fluency.",
  start: "Get Started",
  done: "Done",
  next: "Next",
  skip: "Skip",
  close: "Close",
  on: "ON",
  off: "OFF",
  active: "Active",
  select: "Select",
  equip: "Equip",
  equipped: "Equipped",
  unlocked: "Unlocked",
  buy: "Buy",
  loading: "Loading...",
  noData: "No tasks available in this section.",
  formatNotRecognized: "Exercise format not recognized.",
  profile: "Profile",
  level: "Level",
  quests: "Daily Quests",
  shop: "Theme Shop",
  coins: "Coins",
  navAria: "Exercise areas",
  settingsAria: "Settings",
  coinsAria: "Coins",
  exerciseAria: "Exercise",

  // Feedback / Messages
  successMsg: ["Great job!", "Excellent!", "Awesome!", "Perfect!"],
  errorMsg: ["Let's review this together.", "Let's try that again.", "Almost there, take another look."],
  streakMsg: [
    "{count} in a row! 🔥",
    "{count} hits! 🚀",
    "Awesome streak: {count}! 🌟",
    "Unstoppable: {count}x! 💪"
  ],
  levelUp: "Level Up!",
  hint: "Hint",

  // Voice feedback & TTS
  voice: {
    success: ["Excellent", "Great job", "Awesome", "Spot on"],
    error: ["Let's review this together", "Let's try that again", "Almost there, take another look"],
    streak: [
      "{count} in a row! You are on fire!",
      "Amazing! That's {count} correct answers!",
      "Awesome streak! Keep it up!",
      "Unstoppable! {count} hits in a row!"
    ]
  },
  voiceOptions: "Reader's Voice",
  voiceDesc: "Choose a voice for the voice assistant",
  voiceDefault: "System Default",
  voiceSpeed: "Speech speed",
  slow: "Slower",
  fast: "Faster",
  voicePitch: "Voice pitch",
  pitchLow: "Low",
  pitchHigh: "High",
  testVoice: "Test voice",
  testSentence: "This is a test of the selected voice.",

  // Settings & App Config
  settings: "Settings",
  settingsTitle: "Settings",
  settingsSubtitle: "Context Master · Accessible Gamification",
  settingsBack: "← Back",
  settingsTheme: "Theme",
  settingsAccessibility: "Comfort Options",
  settingsFooter: "Your settings are saved automatically.",
  tabGeneral: "General",
  tabA11y: "Comfort",
  tabVoice: "Voice",
  tabShop: "Shop",
  tabGame: "Game",
  language: "Language",
  languageLabel: "Interface language",
  appMode: "App mode",
  v1Label: "Classic",
  v1Desc: "Exercises without gamification",
  v2Label: "Gamification",
  v2Desc: "Points, coins and rewards",
  
  // Accessibility & Addons
  a11yBase: "Base mode — always active",
  a11yBaseDesc: "Dyslexia-friendly font (OpenDyslexic), increased spacing, soft background",
  a11yAddons: "Comfort personalization options",
  a11yAddonsDesc: "Choose any combination to tailor the app to your needs",
  a11y: {
    LRS: { name: 'Friendly font', desc: 'Dyslexia-friendly font (OpenDyslexic)' },
    Kontrast: { name: 'High contrast', desc: 'Black & white WCAG AAA colours' },
    Motorik: { name: 'Comfort buttons', desc: 'Larger buttons and calm animations' },
    Niedowidzenie: { name: 'Larger text', desc: 'Enlarged font and icons' },
    Daltonizm: { name: 'Safe colours', desc: 'Clear and optimized colour palette' },
    Redukcja: { name: 'Calm screen', desc: 'No flashing or distracting motion' },
    Linijka: { name: 'Focus ruler', desc: 'Highlights a horizontal line under the cursor' },
    Spacing: { name: 'Dyslexia Spacing', desc: 'Increases spacing between letters and words' },
    Desaturacja: { name: 'Soft colours', desc: 'Reduces the intensity of bright colours' },
  },
  inclusive: {
    adaptiveDifficulty: { name: 'Adaptive difficulty', desc: 'Game adjusts pace to the player' },
    bigTargets: { name: 'Large tap targets', desc: 'Buttons min. 56px (motor aid)' },
    noFlash: { name: 'No-flash mode', desc: 'No flickering — epilepsy & motion sensitivity' },
    audioRewards: { name: 'Audio rewards', desc: 'Sound cues alongside visual feedback' },
    extendedTime: { name: 'Extended time', desc: 'No time pressure — 3s instead of 1.5s' },
    voiceAssistant: { name: 'Voice Assistant', desc: 'Automatically reads instructions and options aloud' },
    zenMode: { name: 'Zen Mode', desc: 'Hides distractions (points, progress bars)' },
    bionicReading: { name: 'Bionic Reading', desc: 'Bolds the start of words to guide the eyes' },
    minimalistMode: { name: 'Minimalist View', desc: 'Hides decorative graphics and Lottie animations' },
    muteNotifications: { name: 'Mute Notifications', desc: 'Disables spoken success/error messages and game sounds' },
  },
  profiles: {
    Standard: { name: "Standard", desc: "Default view" },
    LRS: { name: "Friendly Font", desc: "Dyslexia-friendly font" },
    Kontrast: { name: "High Contrast", desc: "Better readability" },
    Motorik: { name: "Comfort buttons", desc: "Larger buttons and calm animations" },
    Niedowidzenie: { name: "Larger Text", desc: "Enlarged font and icons" },
    Daltonizm: { name: "Safe Colours", desc: "Clear and optimized colour palette" },
    Redukcja: { name: "Calm Screen", desc: "No flashing or distracting motion" },
    Bionic: { name: "Bionic Reading", desc: "Bolds word beginnings" },
    Linijka: { name: "Focus Ruler", desc: "Highlights line under cursor" },
    Spacing: { name: "Dyslexia Spacing", desc: "Increases letter and word spacing" },
    Desaturacja: { name: "Soft Colours", desc: "Reduces the intensity of bright colours" }
  },
  accDescriptions: { Standard: "Default View", Kontrast: "High Contrast Mode", LRS: "Friendly Font", Motorik: "Comfort buttons" },

  // Gamification & Rewards
  versionGamified: "GAMIFIED",
  versionGamifiedSub: "Points & rewards",
  versionBase: "BASE",
  versionBaseSub: "No points",
  gamificationTitle: "Inclusive gamification options",
  gamificationDesc: "Adjust the reward system to your needs",
  themeShop: "Theme shop",
  themeShopDesc: "Spend coins on new visual themes",
  earnCoinHint: "You earn 1 coin for each correct answer",
  needMoreCoins: "Not enough coins",
  themes: {
    Natur: { name: "Nature", icon: "🌿", desc: "Green colors, relaxing" },
    Musik: { name: "Music", icon: "🎵", desc: "Purple, dynamic" },
    Kunst: { name: "Art", icon: "🎨", desc: "Amber, creative" },
    Space: { name: "Space", icon: "🚀", desc: "Space depth" },
    Ocean: { name: "Ocean", icon: "🐳", desc: "Ocean calm" }
  },
  themeNames: { Natur: "Nature", Musik: "Music", Kunst: "Art", Space: "Space", Ocean: "Ocean" },
  levelIcons: { Natur: ['🌿', '☘️', '🌳', '🌲', '🏔️'], Musik: ['🎵', '🎶', '🎸', '🎹', '🎼'], Kunst: ['💡', '🎨', '🖌️', '🖼️', '💎'], Space: ['✨', '⭐', '🛰️', '🚀', '🪐'], Ocean: ['💧', '🌊', '🧭', '⚓', '🚢'] },
  progressStages: { Natur: ["Seed", "Stem", "Bud", "Blooming", "Flower"], Musik: ["Sixteenth", "Eighth", "Quarter", "Half", "Instrument"], Kunst: ["Brush", "Palette", "Sketch", "Colors", "Masterpiece"], Space: ["Star", "Comet", "Moon", "Planet", "Rocket"], Ocean: ["Drop", "Fish", "Coral", "Dolphin", "Whale"] },
  garden: "Garden",
  gardenBlooming: "The garden is blooming! Completed goals:",
  gardenEmpty: "Your own ecosystem. It will grow with your every progress.",
  srPlantFeature: "Your journey currently features a",
  srDailyRewards: "It has",
  srRewardsCount: "daily rewards.",
  dailyGoalProgress: "Daily Goal Progress",
  srVisitor: "A friendly visitor has joined you due to your consistent practice.",
  srTrophies: "Thanks to your perseverance, {count} unique objects have appeared in the garden.",
  rewardItems: { Natur: ["💎", "🏆", "💡", "📈", "🎯"], Musik: ["💎", "🏆", "💡", "📈", "🎯"], Kunst: ["💎", "🏆", "💡", "📈", "🎯"], Space: ["💎", "🏆", "💡", "📈", "🎯"], Ocean: ["💎", "🏆", "💡", "📈", "🎯"] },
  
  // Goals & Progress
  dailyGoal: "Daily Goal",
  goal5: "5 min — Quick review",
  goal10: "10 min — Good habit",
  goal15: "15 min — Deep focus",
  goal20: "20 min — Intensive training",
  dailySummary: "Today's Activity",
  exercisesCount: "exercises",
  totalEffort: "Total",
  longestStreak: "Longest daily streak",
  daysCount: "days",
  errorAnalysis: "Error Analysis",
  errorAnalysisSub: "Number of mistakes on individual days",
  exportLogs: "Export data (CSV)",
  exportDesc: "Download NASA-TLX & UEQ survey results",
  noDataToExport: "No data to export",
  feedback: { title: "A moment of reflection", desc: "How would you rate this session? Your feedback helps us adapt the experience.", nasaTitle: "Workload (NASA-TLX)", mental: "Mental Demand", mentalDesc: "How much thinking did the tasks require?", physical: "Effort & Fatigue", physicalDesc: "How tired do you feel after this session?", frustration: "Frustration Level", frustrationDesc: "Did you feel stressed or irritated during the tasks?", low: "Low", high: "High", ueqTitle: "User Experience (UEQ-Short)", ueqAttractiveness: "Attractiveness", ueqAttrLeft: "Unpleasant", ueqAttrRight: "Pleasant", ueqStimulation: "Stimulation", ueqStimLeft: "Boring", ueqStimRight: "Exciting", submit: "Save and continue", skip: "Skip for now" },
  mapTitle: "Challenge Map", choosePath: "Choose your path", nextLevel: "Next Stage", lockedNode: "Locked", completedNode: "Completed", backToMap: "Back to Map", energyTitle: "Cognitive Energy", breakTitle: "Time for a break?", breakDesc: "We noticed you are working intensely. Take a rest in the garden to recharge your energy and avoid fatigue.", takeBreakBtn: "Take a break (+2 💰)", continueBtn: "Keep going",
  
  // Exercises specific
  pillars: { Literacy: "Reading & Writing", Visual: "Vision & Space", Cognitive: "Logic & Memory" },
  pillarIcons: { Literacy: '📖', Visual: '👁️', Cognitive: '🧠' },
  categories: { Phonem: "Word: Sounds", Syllable: "Word: Syllables", Context: "Text: Reading", Graphem: "Writing: Rules", Scrabble: "Writing: Synthesis", LCWC: "Writing: Memory", Dictation: "Writing: Dictation", Tracking: "Vision: Tracking", Clock: "Vision: Clock", Categorization: "Logic: Categories", Sequence: "Logic: Sequences" },
  difficulty: "Difficulty",
  diffLevels: ["Easy", "Medium", "Hard"],
  questLabel: (target, type, pillars) => `Complete ${target} tasks: ${type === 'Any' ? 'Any' : pillars[type] || type}`,
  trackAndMatch: "Follow the highlight and match the direction", orderCorrectly: "Put in the correct order", undo: "Undo", tempoLabel: "Type", normalMode: "Normal", slowMode: "Slow", spellMode: "Spell", readAloud: "Read Aloud", syllablesListen: "Listen to Syllables", check: "Check", delete: "Delete", tapToSpeak: "Tap to Speak", listening: "Listening...", collectedLabel: "Collected", selectCorrect: "Select the correct word:", tapToBuild: "Tap words to build the sequence", listenCarefully: "Listen to the word carefully.", readyToSegment: "I am ready to segment", tapBoxesInstruction: "Tap the boxes as you pronounce each individual sound.", completeExercise: "Complete Exercise", playAudio: "Play audio", lookAndListen: "Look at the word and listen to its pronunciation.", studiedWord: "I have studied the word", sayWordAloud: "Say the word aloud.", breakIntoSounds: "Break it into its individual sounds.", takeYourTime: "Take your time. Feel the shape of the sounds in your mouth before writing.", coverAndWrite: "Cover the word & Write", typeFromMemory: "Type the word from memory.", typeHere: "Type here...", checkSpelling: "Check My Spelling", compareSpelling: "Compare your spelling:", targetWord: "Target Word", yourSpelling: "Your Spelling", spelledCorrectly: "Yes, I spelled it correctly!", tryAgain: "I need to try again", listenToPhonemes: "Listen to the separated sounds.", typeBlendedWord: "Type the word these sounds make.", blendSounds: "I am ready to blend", readParagraph: "Read the following paragraph carefully.", paragraphRead: "I have finished reading", rtSummarize: "Summarize", rtSummarizeDesc: "What was the main idea of this text?", rtQuestion: "Question", rtQuestionDesc: "Ask a question about something unclear or interesting in the text.", rtClarify: "Clarify", rtClarifyDesc: "Identify any confusing words or phrases and explain them.", rtPredict: "Predict", rtPredictDesc: "What do you think will happen next or what is the logical conclusion?", heard: "Heard", voiceInput: "Voice input", speakOptionNumber: "Speak the option number", speakTileNumber: "Speak tile number", speakGapNumber: "Speak gap number to cut", tapAndPronounce: "Tap and pronounce word", skipPronunciation: "Skip pronunciation check", readSentenceAndOptions: "Read sentence and options", removeCut: (pos) => `Remove cut at position ${pos}`, addCut: (pos) => `Add cut at position ${pos}`,
  
  // Footer
  thesisInfo: "Master's Thesis\nAccessible Gamification & Voice Integration\nin a PWA supporting speech therapy\nexercises for Dyslexia",
  tags: { kontrast: "contrast", wzrok: "vision", motor: "motor", dotyk: "touch", zoom: "zoom", kolor: "colour", ruch: "motion", epilepsja: "epilepsy", linijka: "focus" },

  // Voice Assistant - Speech Recognition Commands
  commands: {
    next: ["next", "continue", "go on", "done"],
    check: ["check", "confirm"],
    undo: ["undo", "go back", "delete"],
    skip: ["skip", "i don't know", "pass"],
    hint: ["hint", "help me", "help"]
  },
  affirmations: [
    "Your garden is growing beautifully thanks to your work today.",
    "Every step you take is a step forward. Great effort!",
    "Taking your time is the best way to learn.",
    "You are making steady progress. Keep going at your own pace.",
    "Thank you for showing up today. Your dedication matters."
  ],
  dailyTaskComplete: {
    title: "Excellent Effort Today!",
    desc: "You have completed your daily practice. Your consistency is building strong foundations.",
    chooseReward: "Choose your next reward to grow",
    plantSeed: "Plant Seed & Continue",
    options: {
      oak: { name: "Oak Tree", desc: "A symbol of strength and endurance." },
      rose: { name: "Rose Bush", desc: "A beautiful reward for your focus." },
      bonsai: { name: "Bonsai", desc: "Represents patience and steady growth." }
    }
  },
  reflection: {
    title: "A moment of reflection",
    desc: "There are no grades here. How comfortable did you feel completing this exercise?",
    save: "Save & Water Plant",
    options: {
      difficult: { label: "Difficult", desc: "I need more time" },
      manageable: { label: "Manageable", desc: "I am getting there" },
      easy: { label: "Easy", desc: "I felt confident" }
    }
  }
};