// vocabularyEN.js — Adult Dyslexia Support App — English Edition v1
// 15 items per category
// Focus: English spelling traps most common in dyslexic adults:
//   silent letters, -ough cluster, double consonants, homophones,
//   -ie/-ei rule, affect/effect, their/there/they're, -tion/-sion,
//   irregular stress, visual word shape (scrabble).
// Hint languages: EN (primary) / PL / DE

export const wordDatabaseEN = {
  // ─────────────────────────────────────────────────────────────────────────────
  // CATEGORY: PHONEME
  // Words whose pronunciation is radically different from their spelling —
  // the #1 source of reading breakdowns for dyslexic adults in English.
  // ─────────────────────────────────────────────────────────────────────────────
  phonemes: [
    {
      id: 1,
      difficulty: 2,
      tags: ['business'],
      instruction: 'Choose the correct spelling based on the pronunciation:',
      phonetic: '/ ˌɒn.trə.prəˈnɜːr /',
      options: [
        { text: 'Entrepreneur', isCorrect: true },
        { text: 'Entreprener', isCorrect: false }
      ]
    },
    {
      id: 2,
      difficulty: 1,
      tags: ['business'],
      instruction: 'Identify the word from its phonetic transcription:',
      phonetic: '/ ˈkɜː.nəl /',
      options: [
        { text: 'Colonel', isCorrect: true },
        { text: 'Kernel', isCorrect: false }
      ]
    },
    {
      id: 3,
      difficulty: 2,
      tags: ['everyday'],
      instruction: 'Select the correct written form:',
      phonetic: '/ ˈkwaɪər /',
      options: [
        { text: 'Choir', isCorrect: true },
        { text: 'Quire', isCorrect: false }
      ]
    },
    {
      id: 4,
      difficulty: 2,
      tags: ['business'],
      instruction: 'Which word matches the pronunciation?',
      phonetic: '/ det /',
      options: [
        { text: 'Debt', isCorrect: true },
        { text: 'Det', isCorrect: false }
      ]
    },
    {
      id: 5,
      difficulty: 3,
      tags: ['business'],
      instruction: 'Find the correct spelling:',
      phonetic: '/ ˈsʌt.əl /',
      options: [
        { text: 'Subtle', isCorrect: true },
        { text: 'Suttle', isCorrect: false }
      ]
    },
    {
      id: 6,
      difficulty: 2,
      tags: ['everyday'],
      instruction: 'Match sound to text:',
      phonetic: '/ ˈwenz.deɪ /',
      options: [
        { text: 'Wednesday', isCorrect: true },
        { text: 'Wensday', isCorrect: false }
      ]
    },
    {
      id: 7,
      difficulty: 3,
      tags: ['medicine'],
      instruction: 'Choose the correct medical term:',
      phonetic: '/ njuːˈməʊ.ni.ə /',
      options: [
        { text: 'Pneumonia', isCorrect: true },
        { text: 'Numonia', isCorrect: false }
      ]
    },
    {
      id: 8,
      difficulty: 3,
      tags: ['business'],
      instruction: 'Select the accurate spelling:',
      phonetic: '/ rɪˈsiːt /',
      options: [
        { text: 'Receipt', isCorrect: true },
        { text: 'Receit', isCorrect: false }
      ]
    },
    {
      id: 9,
      difficulty: 2,
      tags: ['everyday'],
      instruction: 'Find the word:',
      phonetic: '/ bjʊˈrɒk.rə.si /',
      options: [
        { text: 'Bureaucracy', isCorrect: true },
        { text: 'Burocracy', isCorrect: false }
      ]
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  // CATEGORY: GRAPHEME
  // The most commonly confused word pairs and spelling rules for dyslexic adults.
  // Each item has a clear focus rule, a question, and two options.
  // ─────────────────────────────────────────────────────────────────────────────
  graphemes: [
    {
      id: 1,
      difficulty: 1,
      focus: "there / their / they're",
      questions: {
        en: "Which word means 'belonging to them'?",
        pl: "Które słowo oznacza 'należący do nich'?",
        de: "Welches Wort bedeutet 'ihnen gehörend'?",
      },
      options: [
        { text: 'Their', isCorrect: true, icon: '👥' },
        { text: 'There', isCorrect: false, icon: '📍' },
      ],
    },
    {
      id: 2,
      difficulty: 2,
      focus: 'affect (verb) / effect (noun)',
      questions: {
        en: "Which word completes: 'The medicine had a positive ___ on her recovery'?",
        pl: "Które słowo pasuje: 'Lek miał pozytywny ___ na jej powrót do zdrowia'?",
        de: "Welches Wort passt: 'Das Medikament hatte einen positiven ___ auf ihre Erholung'?",
      },
      options: [
        { text: 'Effect', isCorrect: true, icon: '💊' },
        { text: 'Affect', isCorrect: false, icon: '❌' },
      ],
    },
    {
      id: 3,
      difficulty: 1,
      focus: 'lose (verb) / loose (adjective)',
      questions: {
        en: "Which word means 'not tight' or 'not firmly fixed'?",
        pl: "Które słowo oznacza 'nieciasny' lub 'niepewnie zamocowany'?",
        de: "Welches Wort bedeutet 'nicht fest' oder 'locker befestigt'?",
      },
      options: [
        { text: 'Loose', isCorrect: true, icon: '🔩' },
        { text: 'Lose', isCorrect: false, icon: '❌' },
      ],
    },
    {
      id: 4,
      difficulty: 1,
      focus: 'then (time) / than (comparison)',
      questions: {
        en: "Which word completes: 'She earns more ___ her colleague'?",
        pl: "Które słowo pasuje: 'Zarabia więcej ___ jej kolega'?",
        de: "Welches Wort passt: 'Sie verdient mehr ___ ihr Kollege'?",
      },
      options: [
        { text: 'Than', isCorrect: true, icon: '⚖️' },
        { text: 'Then', isCorrect: false, icon: '❌' },
      ],
    },
    {
      id: 5,
      difficulty: 2,
      focus: "-ie / -ei rule: 'i before e except after c'",
      questions: {
        en: 'Which spelling is correct? (after the letter c, use ei)',
        pl: 'Która pisownia jest poprawna? (po literze c piszemy ei)',
        de: "Welche Schreibweise ist korrekt? (nach 'c' schreibt man ei)",
      },
      options: [
        { text: 'Receive', isCorrect: true, icon: '📬' },
        { text: 'Recieve', isCorrect: false, icon: '❌' },
      ],
    },
    {
      id: 6,
      difficulty: 2,
      focus: 'necessary — one collar, two socks (1×c, 2×s)',
      questions: {
        en: "Which spelling of 'needed / required' is correct?",
        pl: "Która pisownia słowa 'potrzebny / wymagany' jest poprawna?",
        de: "Welche Schreibweise von 'nötig / erforderlich' ist korrekt?",
      },
      options: [
        { text: 'Necessary', isCorrect: true, icon: '✅' },
        { text: 'Neccessary', isCorrect: false, icon: '❌' },
      ],
    },
    {
      id: 7,
      difficulty: 3,
      focus: 'accommodate — double c AND double m',
      questions: {
        en: "Which spelling means 'to provide lodging or space for'?",
        pl: "Która pisownia oznacza 'zapewnić nocleg lub miejsce'?",
        de: "Welche Schreibweise bedeutet 'Unterkunft oder Platz bereitstellen'?",
      },
      options: [
        { text: 'Accommodate', isCorrect: true, icon: '🏨' },
        { text: 'Acommodate', isCorrect: false, icon: '❌' },
      ],
    },
    {
      id: 8,
      difficulty: 2,
      focus: "separate — there is 'a rat' in sep-a-rat-e",
      questions: {
        en: "Which spelling means 'to divide or keep apart'?",
        pl: "Która pisownia oznacza 'dzielić lub trzymać osobno'?",
        de: "Welche Schreibweise bedeutet 'trennen oder auseinanderhalten'?",
      },
      options: [
        { text: 'Separate', isCorrect: true, icon: '↔️' },
        { text: 'Seperate', isCorrect: false, icon: '❌' },
      ],
    },
    {
      id: 9,
      difficulty: 2,
      focus: "definitely — contains 'finite', never 'definitly'",
      questions: {
        en: "Which spelling means 'without doubt; certainly'?",
        pl: "Która pisownia oznacza 'bez wątpienia; z pewnością'?",
        de: "Welche Schreibweise bedeutet 'ohne Zweifel; sicher'?",
      },
      options: [
        { text: 'Definitely', isCorrect: true, icon: '💯' },
        { text: 'Definitly', isCorrect: false, icon: '❌' },
      ],
    },
    {
      id: 10,
      difficulty: 2,
      focus: 'stationary (not moving) / stationery (paper & envelopes)',
      questions: {
        en: 'Which word means writing materials — pens, paper, envelopes?',
        pl: 'Które słowo oznacza materiały piśmiennicze — długopisy, papier, koperty?',
        de: 'Welches Wort bezeichnet Schreibwaren — Stifte, Papier, Umschläge?',
      },
      options: [
        { text: 'Stationery', isCorrect: true, icon: '✉️' },
        { text: 'Stationary', isCorrect: false, icon: '🚗' },
      ],
    },
    {
      id: 11,
      difficulty: 2,
      focus: 'complement (completes) / compliment (praise)',
      questions: {
        en: "Which word means 'to say something nice about someone'?",
        pl: "Które słowo oznacza 'powiedzieć coś miłego o kimś'?",
        de: "Welches Wort bedeutet 'jemandem etwas Schönes sagen'?",
      },
      options: [
        { text: 'Compliment', isCorrect: true, icon: '😊' },
        { text: 'Complement', isCorrect: false, icon: '❌' },
      ],
    },
    {
      id: 12,
      difficulty: 2,
      focus: 'principal (main/head) / principle (rule/belief)',
      questions: {
        en: "Which word means 'a fundamental rule or moral belief'?",
        pl: "Które słowo oznacza 'podstawową zasadę lub przekonanie moralne'?",
        de: "Welches Wort bedeutet 'eine grundlegende Regel oder moralische Überzeugung'?",
      },
      options: [
        { text: 'Principle', isCorrect: true, icon: '📜' },
        { text: 'Principal', isCorrect: false, icon: '🏫' },
      ],
    },
    {
      id: 13,
      difficulty: 3,
      focus: 'embarrass — double r AND double s',
      questions: {
        en: "Which spelling means 'to cause someone to feel awkward or ashamed'?",
        pl: "Która pisownia oznacza 'sprawić, że ktoś czuje się niezręcznie lub zawstydzony'?",
        de: "Welche Schreibweise bedeutet 'jemanden in Verlegenheit bringen'?",
      },
      options: [
        { text: 'Embarrass', isCorrect: true, icon: '😳' },
        { text: 'Embarass', isCorrect: false, icon: '❌' },
      ],
    },
    {
      id: 14,
      difficulty: 1,
      focus: 'desert (dry land) / dessert (sweet course)',
      questions: {
        en: 'Which word means the sweet course eaten after a main meal?',
        pl: 'Które słowo oznacza słodkie danie podawane po daniu głównym?',
        de: 'Welches Wort bezeichnet den süßen Gang nach dem Hauptgang?',
      },
      options: [
        { text: 'Dessert', isCorrect: true, icon: '🍰' },
        { text: 'Desert', isCorrect: false, icon: '🏜️' },
      ],
    },
    {
      id: 15,
      difficulty: 2,
      focus: 'practice (noun, UK) / practise (verb, UK)',
      questions: {
        en: "Which spelling is the VERB form: 'She needs to ___ every day'?",
        pl: "Która pisownia to CZASOWNIK: 'Musi ___ codziennie'?",
        de: "Welche Schreibweise ist das VERB: 'Sie muss jeden Tag ___'?",
      },
      options: [
        { text: 'Practise', isCorrect: true, icon: '🎸' },
        { text: 'Practice', isCorrect: false, icon: '❌' },
      ],
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  // CATEGORY: SYLLABLES
  // Professional adult vocabulary — words commonly mis-stressed or mis-read.
  // ─────────────────────────────────────────────────────────────────────────────
  syllables: [
    {
      id: 1,
      difficulty: 3,
      word: 'Extraordinary',
      segments: ['Ex', 'traor', 'di', 'na', 'ry'],
      icon: '🌟',
    },
    {
      id: 2,
      difficulty: 2,
      tags: ['business'],
      word: 'Communication',
      segments: ['Com', 'mu', 'ni', 'ca', 'tion'],
      icon: '📡',
    },
    {
      id: 3,
      difficulty: 2,
      word: 'Determination',
      segments: ['De', 'ter', 'mi', 'na', 'tion'],
      icon: '💪',
    },
    {
      id: 4,
      difficulty: 3,
      word: 'Accommodation',
      segments: ['Ac', 'com', 'mo', 'da', 'tion'],
      icon: '🏨',
    },
    {
      id: 5,
      difficulty: 2,
      word: 'Responsibility',
      segments: ['Re', 'spon', 'si', 'bil', 'i', 'ty'],
      icon: '⚖️',
    },
    {
      id: 6,
      difficulty: 3,
      tags: ['business'],
      word: 'Entrepreneurship',
      segments: ['En', 'tre', 'pre', 'neur', 'ship'],
      icon: '🚀',
    },
    {
      id: 7,
      difficulty: 3,
      word: 'Bureaucracy',
      segments: ['Bu', 'reau', 'cra', 'cy'],
      icon: '🏛️',
    },
    {
      id: 8,
      difficulty: 2,
      word: 'Psychological',
      segments: ['Psy', 'cho', 'log', 'i', 'cal'],
      icon: '🧠',
    },
    {
      id: 9,
      difficulty: 2,
      word: 'Approximately',
      segments: ['Ap', 'prox', 'i', 'mate', 'ly'],
      icon: '🔢',
    },
    {
      id: 10,
      difficulty: 2,
      word: 'Misunderstanding',
      segments: ['Mis', 'un', 'der', 'stand', 'ing'],
      icon: '🤔',
    },
    {
      id: 11,
      difficulty: 3,
      word: 'Confidentiality',
      segments: ['Con', 'fi', 'den', 'ti', 'al', 'i', 'ty'],
      icon: '🔒',
    },
    {
      id: 12,
      difficulty: 3,
      word: 'Simultaneously',
      segments: ['Si', 'mul', 'ta', 'ne', 'ous', 'ly'],
      icon: '⚡',
    },
    {
      id: 13,
      difficulty: 3,
      tags: ['medicine'],
      word: 'Pharmaceutical',
      segments: ['Phar', 'ma', 'ceu', 'ti', 'cal'],
      icon: '💊',
    },
    {
      id: 14,
      difficulty: 3,
      tags: ['medicine'],
      word: 'Cardiovascular',
      segments: ['Car', 'di', 'o', 'vas', 'cu', 'lar'],
      icon: '❤️',
    },
    {
      id: 15,
      difficulty: 3,
      word: 'Conscientious',
      segments: ['Con', 'sci', 'en', 'tious'],
      icon: '✅',
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  // CATEGORY: WORTBILD (Word Image / Scrabble)
  // Classic English spelling nightmares — double letters, silent letters, -ough.
  // ─────────────────────────────────────────────────────────────────────────────
  scrabble: [
    {
      id: 1,
      difficulty: 2,
      word: 'RHYTHM',
      scrambled: ['R', 'H', 'Y', 'T', 'H', 'M'],
      distractors: ['I', 'E'],
      image: '🥁',
    },
    {
      id: 2,
      difficulty: 3,
      word: 'COLONEL',
      scrambled: ['C', 'O', 'L', 'O', 'N', 'E', 'L'],
      distractors: ['R', 'A'],
      image: '🎖️',
    },
    {
      id: 3,
      difficulty: 2,
      tags: ['business', 'everyday'],
      word: 'NECESSARY',
      scrambled: ['N', 'E', 'C', 'E', 'S', 'S', 'A', 'R', 'Y'],
      distractors: ['C'],
      image: '✅',
    },
    {
      id: 4,
      difficulty: 3,
      word: 'ACCOMMODATE',
      scrambled: ['A', 'C', 'C', 'O', 'M', 'M', 'O', 'D', 'A', 'T', 'E'],
      distractors: ['M', 'C'],
      image: '🏨',
    },
    {
      id: 5,
      difficulty: 2,
      word: 'SEPARATE',
      scrambled: ['S', 'E', 'P', 'A', 'R', 'A', 'T', 'E'],
      distractors: ['E', 'E'],
      image: '↔️',
    },
    {
      id: 6,
      difficulty: 2,
      word: 'DEFINITELY',
      scrambled: ['D', 'E', 'F', 'I', 'N', 'I', 'T', 'E', 'L', 'Y'],
      distractors: ['A', 'E'],
      image: '💯',
    },
    {
      id: 7,
      difficulty: 3,
      word: 'EMBARRASS',
      scrambled: ['E', 'M', 'B', 'A', 'R', 'R', 'A', 'S', 'S'],
      distractors: ['R', 'S'],
      image: '😳',
    },
    {
      id: 8,
      difficulty: 2,
      tags: ['medicine'],
      word: 'PSYCHOLOGY',
      scrambled: ['P', 'S', 'Y', 'C', 'H', 'O', 'L', 'O', 'G', 'Y'],
      distractors: ['I', 'S'],
      image: '🧠',
    },
    {
      id: 9,
      difficulty: 3,
      tags: ['business'],
      word: 'BUREAUCRACY',
      scrambled: ['B', 'U', 'R', 'E', 'A', 'U', 'C', 'R', 'A', 'C', 'Y'],
      distractors: ['O', 'K'],
      image: '🏛️',
    },
    {
      id: 10,
      difficulty: 3,
      word: 'CONSCIENTIOUS',
      scrambled: [
        'C',
        'O',
        'N',
        'S',
        'C',
        'I',
        'E',
        'N',
        'T',
        'I',
        'O',
        'U',
        'S',
      ],
      distractors: ['S', 'C'],
      image: '✅',
    },
    {
      id: 11,
      difficulty: 3,
      word: 'WORCESTERSHIRE',
      scrambled: [
        'W',
        'O',
        'R',
        'C',
        'E',
        'S',
        'T',
        'E',
        'R',
        'S',
        'H',
        'I',
        'R',
        'E',
      ],
      distractors: ['H', 'C'],
      image: '🧂',
    },
    {
      id: 12,
      difficulty: 2,
      word: 'YACHT',
      scrambled: ['Y', 'A', 'C', 'H', 'T'],
      distractors: ['O', 'U'],
      image: '⛵',
    },
    {
      id: 13,
      difficulty: 1,
      word: 'RECEIPT',
      scrambled: ['R', 'E', 'C', 'E', 'I', 'P', 'T'],
      distractors: ['I', 'S'],
      image: '🧾',
    },
    {
      id: 14,
      difficulty: 1,
      word: 'WEDNESDAY',
      scrambled: ['W', 'E', 'D', 'N', 'E', 'S', 'D', 'A', 'Y'],
      distractors: ['N', 'Z'],
      image: '📅',
    },
    {
      id: 15,
      difficulty: 3,
      tags: ['business'],
      word: 'ENTREPRENEUR',
      scrambled: ['E', 'N', 'T', 'R', 'E', 'P', 'R', 'E', 'N', 'E', 'U', 'R'],
      distractors: ['A', 'O'],
      image: '💼',
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  // CATEGORY: CONTEXT
  // 15 sentences using adult vocabulary — professional, medical, everyday.
  // Each tests a specific confusion pair or spelling rule.
  // ─────────────────────────────────────────────────────────────────────────────
  context: [
    {
      id: 1,
      difficulty: 1,
      tags: ['business'],
      sentence_part1: 'Please ensure all invoices are filed in',
      sentence_part2: 'designated folders.',
      options: [
        { text: 'their', isCorrect: true },
        { text: 'there', isCorrect: false },
      ],
      hints: { en: 'Possessive pronoun — belonging to them (not a place)' },
    },
    {
      id: 2,
      difficulty: 2,
      tags: ['business'],
      sentence_part1: 'The new policy will',
      sentence_part2: 'all employees starting from next month.',
      options: [
        { text: 'affect', isCorrect: true },
        { text: 'effect', isCorrect: false },
      ],
      hints: {
        en: "VERB — to have an impact on; 'effect' is usually the noun",
      },
    },
    {
      id: 3,
      difficulty: 1,
      sentence_part1: 'We cannot',
      sentence_part2: 'this contract under any circumstances.',
      options: [
        { text: 'lose', isCorrect: true },
        { text: 'loose', isCorrect: false },
      ],
      hints: {
        en: "VERB — to fail to keep something; 'loose' is an adjective (not tight)",
      },
    },
    {
      id: 4,
      difficulty: 2,
      tags: ['medicine'],
      sentence_part1: 'The medication had a significant',
      sentence_part2: 'on her blood pressure readings.',
      options: [
        { text: 'effect', isCorrect: true },
        { text: 'affect', isCorrect: false },
      ],
      hints: {
        en: "NOUN — the result or outcome; 'affect' is usually the verb",
      },
    },
    {
      id: 5,
      difficulty: 2,
      tags: ['business', 'everyday'],
      sentence_part1: 'It is',
      sentence_part2: 'to submit your tax return before the deadline.',
      options: [
        { text: 'necessary', isCorrect: true },
        { text: 'neccessary', isCorrect: false },
      ],
      hints: { en: "One 'c', two 's' — think: one Collar, two Socks" },
    },
    {
      id: 6,
      difficulty: 3,
      sentence_part1: 'The hotel can',
      sentence_part2: 'up to two hundred conference delegates.',
      options: [
        { text: 'accommodate', isCorrect: true },
        { text: 'acommodate', isCorrect: false },
      ],
      hints: { en: "Double 'c' AND double 'm' — both consonants are doubled" },
    },
    {
      id: 7,
      difficulty: 2,
      sentence_part1: 'We need to',
      sentence_part2: 'the personal data from the financial records.',
      options: [
        { text: 'separate', isCorrect: true },
        { text: 'seperate', isCorrect: false },
      ],
      hints: { en: "Remember the 'rat' inside: sep-A-RAT-e" },
    },
    {
      id: 8,
      difficulty: 2,
      sentence_part1: 'She',
      sentence_part2: 'did not mean to cause any offence.',
      options: [
        { text: 'definitely', isCorrect: true },
        { text: 'definitly', isCorrect: false },
      ],
      hints: { en: "'Definite' + '-ly' — the root word must stay complete" },
    },
    {
      id: 9,
      difficulty: 2,
      sentence_part1: 'The office supplies budget covers',
      sentence_part2: '— paper, pens and envelopes.',
      options: [
        { text: 'stationery', isCorrect: true },
        { text: 'stationary', isCorrect: false },
      ],
      hints: { en: 'stationERy = papER and pen; stationARy = stands stAy' },
    },
    {
      id: 10,
      difficulty: 2,
      sentence_part1: 'I would like to',
      sentence_part2: 'you on your outstanding presentation.',
      options: [
        { text: 'compliment', isCorrect: true },
        { text: 'complement', isCorrect: false },
      ],
      hints: {
        en: 'complIment = saying something nIce; complEment = complEtes something',
      },
    },
    {
      id: 11,
      difficulty: 2,
      sentence_part1: 'Our company works on the',
      sentence_part2: 'that all employees deserve equal opportunities.',
      options: [
        { text: 'principle', isCorrect: true },
        { text: 'principal', isCorrect: false },
      ],
      hints: {
        en: 'principLE = a ruLE; principAL = the main person (like a school principAL)',
      },
    },
    {
      id: 12,
      difficulty: 3,
      sentence_part1: 'It can',
      sentence_part2: 'someone greatly to be criticised in public.',
      options: [
        { text: 'embarrass', isCorrect: true },
        { text: 'embarass', isCorrect: false },
      ],
      hints: {
        en: "Double 'r' AND double 's' — the word is Really Really aSSociated with stress",
      },
    },
    {
      id: 13,
      difficulty: 1,
      sentence_part1: 'For',
      sentence_part2: 'please use the covered parking area on the left.',
      options: [
        { text: 'your', isCorrect: true },
        { text: "you're", isCorrect: false },
      ],
      hints: { en: "YOUR = belonging to you; YOU'RE = you are (contraction)" },
    },
    {
      id: 14,
      difficulty: 3,
      tags: ['business'],
      sentence_part1: 'The research was conducted',
      sentence_part2: 'in three different countries.',
      options: [
        { text: 'simultaneously', isCorrect: true },
        { text: 'simultaniously', isCorrect: false },
      ],
      hints: {
        en: "The root is 'simultaneous' — keep the full root before adding '-ly'",
      },
    },
    {
      id: 15,
      difficulty: 2,
      sentence_part1: 'You need to',
      sentence_part2: 'the piano for at least thirty minutes each day.',
      options: [
        { text: 'practise', isCorrect: true },
        { text: 'practice', isCorrect: false },
      ],
      hints: {
        en: 'UK English: practISE = verb (like adviSE); practICE = noun (like advICE)',
      },
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  // CATEGORY: CLOCK
  // 15 analogue clock reading tasks.
  // hourRotation and minuteRotation = degrees clockwise from 12.
  // ─────────────────────────────────────────────────────────────────────────────
  clock: [
    {
      id: 1,
      difficulty: 1,
      timeAnalog: 'Quarter past three',
      isNight: false,
      hourRotation: 98,
      minuteRotation: 90,
      options: [
        { text: '3:15 AM', isCorrect: false },
        { text: '3:15 PM', isCorrect: true },
        { text: '3:45 PM', isCorrect: false },
        { text: '2:45 PM', isCorrect: false },
      ],
    },
    {
      id: 2,
      difficulty: 1,
      timeAnalog: 'Half past six in the evening',
      isNight: true,
      hourRotation: 195,
      minuteRotation: 180,
      options: [
        { text: '6:30 PM', isCorrect: true },
        { text: '6:30 AM', isCorrect: false },
        { text: '7:30 PM', isCorrect: false },
        { text: '6:00 PM', isCorrect: false },
      ],
    },
    {
      id: 3,
      difficulty: 1,
      timeAnalog: 'Ten to ten in the morning',
      isNight: false,
      hourRotation: 295,
      minuteRotation: 300,
      options: [
        { text: '9:50 AM', isCorrect: true },
        { text: '10:10 AM', isCorrect: false },
        { text: '9:50 PM', isCorrect: false },
        { text: '10:50 AM', isCorrect: false },
      ],
    },
    {
      id: 4,
      difficulty: 1,
      timeAnalog: 'Noon',
      isNight: false,
      hourRotation: 0,
      minuteRotation: 0,
      options: [
        { text: '12:00 PM', isCorrect: true },
        { text: '12:00 AM', isCorrect: false },
        { text: '12:30 PM', isCorrect: false },
        { text: '6:00 PM', isCorrect: false },
      ],
    },
    {
      id: 5,
      difficulty: 1,
      timeAnalog: 'Midnight',
      isNight: true,
      hourRotation: 0,
      minuteRotation: 0,
      options: [
        { text: '12:00 AM', isCorrect: true },
        { text: '12:00 PM', isCorrect: false },
        { text: '11:59 PM', isCorrect: false },
        { text: '1:00 AM', isCorrect: false },
      ],
    },
    {
      id: 6,
      difficulty: 2,
      timeAnalog: 'Half past twelve in the afternoon',
      isNight: false,
      hourRotation: 15,
      minuteRotation: 180,
      options: [
        { text: '12:30 PM', isCorrect: true },
        { text: '12:30 AM', isCorrect: false },
        { text: '1:30 PM', isCorrect: false },
        { text: '11:30 AM', isCorrect: false },
      ],
    },
    {
      id: 7,
      difficulty: 2,
      timeAnalog: 'Quarter to nine in the evening',
      isNight: true,
      hourRotation: 262,
      minuteRotation: 270,
      options: [
        { text: '8:45 PM', isCorrect: true },
        { text: '8:45 AM', isCorrect: false },
        { text: '9:15 PM', isCorrect: false },
        { text: '9:45 PM', isCorrect: false },
      ],
    },
    {
      id: 8,
      difficulty: 1,
      timeAnalog: 'Twenty past four in the afternoon',
      isNight: false,
      hourRotation: 130,
      minuteRotation: 120,
      options: [
        { text: '4:20 PM', isCorrect: true },
        { text: '4:20 AM', isCorrect: false },
        { text: '4:40 PM', isCorrect: false },
        { text: '5:20 PM', isCorrect: false },
      ],
    },
    {
      id: 9,
      difficulty: 2,
      timeAnalog: 'Five and twenty to midnight',
      isNight: true,
      hourRotation: 347,
      minuteRotation: 210,
      options: [
        { text: '11:35 PM', isCorrect: true },
        { text: '11:35 AM', isCorrect: false },
        { text: '11:25 PM', isCorrect: false },
        { text: '12:35 AM', isCorrect: false },
      ],
    },
    {
      id: 10,
      difficulty: 1,
      timeAnalog: "Six o'clock in the evening",
      isNight: true,
      hourRotation: 180,
      minuteRotation: 0,
      options: [
        { text: '6:00 PM', isCorrect: true },
        { text: '6:00 AM', isCorrect: false },
        { text: '7:00 PM', isCorrect: false },
        { text: '6:18 PM', isCorrect: false },
      ],
    },
    {
      id: 11,
      difficulty: 2,
      timeAnalog: 'Five to half past nine in the evening',
      isNight: true,
      hourRotation: 283,
      minuteRotation: 150,
      options: [
        { text: '9:25 PM', isCorrect: true },
        { text: '9:25 AM', isCorrect: false },
        { text: '9:35 PM', isCorrect: false },
        { text: '10:25 PM', isCorrect: false },
      ],
    },
    {
      id: 12,
      difficulty: 1,
      timeAnalog: 'Quarter past eleven in the morning',
      isNight: false,
      hourRotation: 338,
      minuteRotation: 90,
      options: [
        { text: '11:15 AM', isCorrect: true },
        { text: '11:15 PM', isCorrect: false },
        { text: '10:45 AM', isCorrect: false },
        { text: '11:45 AM', isCorrect: false },
      ],
    },
    {
      id: 13,
      difficulty: 1,
      timeAnalog: 'Ten to five in the morning',
      isNight: false,
      hourRotation: 145,
      minuteRotation: 300,
      options: [
        { text: '4:50 AM', isCorrect: true },
        { text: '4:50 PM', isCorrect: false },
        { text: '5:10 AM', isCorrect: false },
        { text: '4:40 AM', isCorrect: false },
      ],
    },
    {
      id: 14,
      difficulty: 1,
      timeAnalog: 'Half past eight in the morning',
      isNight: false,
      hourRotation: 255,
      minuteRotation: 180,
      options: [
        { text: '8:30 AM', isCorrect: true },
        { text: '8:30 PM', isCorrect: false },
        { text: '9:30 AM', isCorrect: false },
        { text: '7:30 AM', isCorrect: false },
      ],
    },
    {
      id: 15,
      difficulty: 1,
      timeAnalog: 'Twenty-five past one at night',
      isNight: true,
      hourRotation: 43,
      minuteRotation: 150,
      options: [
        { text: '1:25 AM', isCorrect: true },
        { text: '1:25 PM', isCorrect: false },
        { text: '1:35 AM', isCorrect: false },
        { text: '12:25 AM', isCorrect: false },
      ],
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  // CATEGORY: SEQUENCES
  // Chronological ordering, procedural memory, and auditory span — adult context.
  // ─────────────────────────────────────────────────────────────────────────────
  sequences: [
    // Working memory warm-up
    {
      id: 'mem_span_1',
      difficulty: 1,
      instruction: 'Remember the order — now reverse it!',
      displayItems: ['📋', '💰', '✅'],
      correct: ['✅', '💰', '📋'],
      scrambled: ['📋', '💰', '✅'],
      displayTime: 3000,
    },

    // Chronology & Semantics
    {
      id: 1,
      difficulty: 1,
      instruction: 'Put the weekdays in order',
      scrambled: ['Wednesday', 'Monday', 'Friday', 'Tuesday'],
      correct: ['Monday', 'Tuesday', 'Wednesday', 'Friday'],
    },

    {
      id: 2,
      difficulty: 1,
      instruction: 'Order the months of the second quarter',
      scrambled: ['June', 'April', 'May'],
      correct: ['April', 'May', 'June'],
    },

    {
      id: 3,
      difficulty: 2,
      tags: ['business'],
      instruction: 'Order these career levels — lowest first',
      scrambled: ['Director', 'Intern', 'Manager', 'Senior Analyst'],
      correct: ['Intern', 'Senior Analyst', 'Manager', 'Director'],
    },

    {
      id: 4,
      difficulty: 2,
      tags: ['business'],
      instruction: 'Stages of writing a formal report',
      scrambled: [
        'Distribute report',
        'Draft content',
        'Research topic',
        'Review and edit',
      ],
      correct: [
        'Research topic',
        'Draft content',
        'Review and edit',
        'Distribute report',
      ],
    },

    {
      id: 5,
      difficulty: 1,
      instruction: 'Put these amounts in order — smallest first',
      scrambled: ['£1,000,000', '£500', '£10,000', '£75'],
      correct: ['£75', '£500', '£10,000', '£1,000,000'],
    },

    {
      id: 6,
      difficulty: 2,
      tags: ['business', 'everyday'],
      instruction: 'Steps to apply for a mortgage',
      scrambled: [
        'Make monthly repayments',
        'Submit application',
        'Receive offer letter',
        'Sign contracts',
      ],
      correct: [
        'Submit application',
        'Receive offer letter',
        'Sign contracts',
        'Make monthly repayments',
      ],
    },

    {
      id: 7,
      difficulty: 1,
      instruction: 'Units of time — shortest to longest',
      scrambled: ['Century', 'Second', 'Decade', 'Year'],
      correct: ['Second', 'Year', 'Decade', 'Century'],
    },

    {
      id: 8,
      difficulty: 1,
      instruction: 'Arrange the words into a correct sentence',
      scrambled: ['the', 'submitted', 'on time.', 'proposal', 'She'],
      correct: ['She', 'submitted', 'the', 'proposal', 'on time.'],
    },

    {
      id: 9,
      difficulty: 2,
      instruction: 'Stages of a job interview process',
      scrambled: [
        'Receive job offer',
        'Submit CV',
        'Attend interview',
        'Complete online test',
      ],
      correct: [
        'Submit CV',
        'Complete online test',
        'Attend interview',
        'Receive job offer',
      ],
    },

    {
      id: 10,
      difficulty: 1,
      instruction: 'Alphabetical order — professional terms',
      scrambled: ['Revenue', 'Policy', 'Contract', 'Invoice'],
      correct: ['Contract', 'Invoice', 'Policy', 'Revenue'],
    },

    // Auditory sequences
    {
      id: 11,
      difficulty: 3,
      instruction: 'Listen and arrange the numbers in the order you heard them',
      audioPrompt: 'Seven. Three. Nine. One.',
      scrambled: ['1', '9', '7', '3'],
      correct: ['7', '3', '9', '1'],
    },

    {
      id: 12,
      difficulty: 3,
      instruction: 'Listen and arrange the words you heard',
      audioPrompt: 'Invoice, budget, report, meeting.',
      scrambled: ['Report', 'Invoice', 'Meeting', 'Budget'],
      correct: ['Invoice', 'Budget', 'Report', 'Meeting'],
    },

    {
      id: 13,
      difficulty: 3,
      instruction: 'Listen to the instruction and arrange the steps',
      audioPrompt:
        'First save the document, then attach it to the email, and finally press send.',
      scrambled: ['Press send', 'Save the document', 'Attach to email'],
      correct: ['Save the document', 'Attach to email', 'Press send'],
    },

    {
      id: 14,
      difficulty: 3,
      instruction: 'Listen and spell out the letters you heard',
      audioPrompt: 'C. O. N. T. R. A. C. T.',
      scrambled: ['T', 'O', 'N', 'C', 'C', 'A', 'R', 'T'],
      correct: ['C', 'O', 'N', 'T', 'R', 'A', 'C', 'T'],
    },

    {
      id: 15,
      difficulty: 2,
      instruction: 'Arrange these historical periods — oldest first',
      scrambled: [
        'Industrial Revolution',
        'Middle Ages',
        'Information Age',
        'Renaissance',
      ],
      correct: [
        'Middle Ages',
        'Renaissance',
        'Industrial Revolution',
        'Information Age',
      ],
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  // CATEGORY: TRACKING
  // Rapid spatial decision-making — lateralisation, b/d/p/q reversal,
  // uppercase/lowercase, vowel/consonant, odd/even — all with adult framing.
  // ─────────────────────────────────────────────────────────────────────────────
  tracking: [
    {
      id: 1,
      difficulty: 1,
      instruction: 'Which side is the bump on this letter?',
      items: [
        { symbol: 'b', target: 'right' },
        { symbol: 'd', target: 'left' },
        { symbol: 'd', target: 'left' },
        { symbol: 'b', target: 'right' },
        { symbol: 'd', target: 'left' },
      ],
      options: [
        { label: 'Left ⬅️', value: 'left' },
        { label: 'Right ➡️', value: 'right' },
      ],
    },
    {
      id: 2,
      difficulty: 1,
      instruction: 'Which direction is the arrow pointing?',
      items: [
        { symbol: '→', target: 'right' },
        { symbol: '←', target: 'left' },
        { symbol: '→', target: 'right' },
        { symbol: '→', target: 'right' },
        { symbol: '←', target: 'left' },
      ],
      options: [
        { label: 'Left ⬅️', value: 'left' },
        { label: 'Right ➡️', value: 'right' },
      ],
    },
    {
      id: 3,
      difficulty: 1,
      instruction: 'Where is the bump on this letter?',
      items: [
        { symbol: 'p', target: 'right' },
        { symbol: 'q', target: 'left' },
        { symbol: 'p', target: 'right' },
        { symbol: 'q', target: 'left' },
        { symbol: 'q', target: 'left' },
      ],
      options: [
        { label: 'Left ⬅️', value: 'left' },
        { label: 'Right ➡️', value: 'right' },
      ],
    },
    {
      id: 4,
      difficulty: 1,
      instruction: 'Which direction is the hand pointing?',
      items: [
        { symbol: '👈', target: 'left' },
        { symbol: '👉', target: 'right' },
        { symbol: '👈', target: 'left' },
        { symbol: '👈', target: 'left' },
        { symbol: '👉', target: 'right' },
      ],
      options: [
        { label: 'Left ⬅️', value: 'left' },
        { label: 'Right ➡️', value: 'right' },
      ],
    },
    {
      id: 5,
      difficulty: 1,
      instruction: 'Read the word and press the correct direction',
      items: [
        { symbol: 'RIGHT', target: 'right' },
        { symbol: 'LEFT', target: 'left' },
        { symbol: 'LEFT', target: 'left' },
        { symbol: 'RIGHT', target: 'right' },
        { symbol: 'LEFT', target: 'left' },
      ],
      options: [
        { label: 'Left ⬅️', value: 'left' },
        { label: 'Right ➡️', value: 'right' },
      ],
    },
    {
      id: 6,
      difficulty: 1,
      instruction: 'Which way does the triangle point?',
      items: [
        { symbol: '◁', target: 'left' },
        { symbol: '▷', target: 'right' },
        { symbol: '▷', target: 'right' },
        { symbol: '◁', target: 'left' },
        { symbol: '▷', target: 'right' },
      ],
      options: [
        { label: 'Left ⬅️', value: 'left' },
        { label: 'Right ➡️', value: 'right' },
      ],
    },
    {
      id: 7,
      difficulty: 1,
      instruction: 'Thumb up or thumb down?',
      items: [
        { symbol: '👍', target: 'up' },
        { symbol: '👎', target: 'down' },
        { symbol: '👍', target: 'up' },
        { symbol: '👍', target: 'up' },
        { symbol: '👎', target: 'down' },
      ],
      options: [
        { label: 'Up ⬆️', value: 'up' },
        { label: 'Down ⬇️', value: 'down' },
      ],
    },
    {
      id: 8,
      difficulty: 1,
      instruction: 'Where is the bracket open?',
      items: [
        { symbol: '[', target: 'right' },
        { symbol: ']', target: 'left' },
        { symbol: '[', target: 'right' },
        { symbol: ']', target: 'left' },
        { symbol: ']', target: 'left' },
      ],
      options: [
        { label: 'Left ⬅️', value: 'left' },
        { label: 'Right ➡️', value: 'right' },
      ],
    },
    {
      id: 9,
      difficulty: 1,
      instruction: 'Which direction is the vertical arrow pointing?',
      items: [
        { symbol: '↑', target: 'up' },
        { symbol: '↓', target: 'down' },
        { symbol: '↑', target: 'up' },
        { symbol: '↑', target: 'up' },
        { symbol: '↓', target: 'down' },
      ],
      options: [
        { label: 'Up ⬆️', value: 'up' },
        { label: 'Down ⬇️', value: 'down' },
      ],
    },
    {
      id: 10,
      difficulty: 1,
      instruction: 'Which way does the diagonal line lean?',
      items: [
        { symbol: '/', target: 'right' },
        { symbol: '\\', target: 'left' },
        { symbol: '/', target: 'right' },
        { symbol: '\\', target: 'left' },
        { symbol: '/', target: 'right' },
      ],
      options: [
        { label: 'Left (\\) ⬅️', value: 'left' },
        { label: 'Right (/) ➡️', value: 'right' },
      ],
    },
    {
      id: 11,
      difficulty: 1,
      instruction: 'Capital or lower-case letter?',
      items: [
        { symbol: 'A', target: 'up' },
        { symbol: 'a', target: 'down' },
        { symbol: 'B', target: 'up' },
        { symbol: 'b', target: 'down' },
        { symbol: 'A', target: 'up' },
      ],
      options: [
        { label: 'Capital 🔠', value: 'up' },
        { label: 'Lower 🔡', value: 'down' },
      ],
    },
    {
      id: 12,
      difficulty: 1,
      instruction: 'Odd or even number?',
      items: [
        { symbol: '4', target: 'left' },
        { symbol: '7', target: 'right' },
        { symbol: '2', target: 'left' },
        { symbol: '9', target: 'right' },
        { symbol: '6', target: 'left' },
      ],
      options: [
        { label: 'Even ⬅️', value: 'left' },
        { label: 'Odd ➡️', value: 'right' },
      ],
    },
    {
      id: 13,
      difficulty: 1,
      instruction: 'Vowel or consonant?',
      items: [
        { symbol: 'E', target: 'up' },
        { symbol: 'K', target: 'down' },
        { symbol: 'A', target: 'up' },
        { symbol: 'R', target: 'down' },
        { symbol: 'I', target: 'up' },
      ],
      options: [
        { label: 'Vowel ⬆️', value: 'up' },
        { label: 'Consonant ⬇️', value: 'down' },
      ],
    },
    {
      id: 14,
      difficulty: 1,
      instruction: 'Does this letter have an accent or special mark?',
      items: [
        { symbol: 'é', target: 'right' },
        { symbol: 'e', target: 'left' },
        { symbol: 'ü', target: 'right' },
        { symbol: 'u', target: 'left' },
        { symbol: 'â', target: 'right' },
      ],
      options: [
        { label: 'Plain ⬅️', value: 'left' },
        { label: 'Accented ➡️', value: 'right' },
      ],
    },
    {
      id: 15,
      difficulty: 1,
      instruction: 'Arabic numeral or Roman numeral?',
      items: [
        { symbol: 'V', target: 'right' },
        { symbol: '5', target: 'left' },
        { symbol: 'X', target: 'right' },
        { symbol: '10', target: 'left' },
        { symbol: 'I', target: 'right' },
      ],
      options: [
        { label: 'Arabic ⬅️', value: 'left' },
        { label: 'Roman ➡️', value: 'right' },
      ],
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  // CATEGORY: LOOK, COVER, WRITE, CHECK (LCWC)
  // ─────────────────────────────────────────────────────────────────────────────
  lcwc: [
    { id: 1, lcwc: true, difficulty: 1, word: 'Development' },
    { id: 2, lcwc: true, difficulty: 2, word: 'Management' },
    { id: 3, lcwc: true, difficulty: 3, word: 'Entrepreneur' },
    { id: 4, lcwc: true, difficulty: 2, word: 'Investment' },
    { id: 5, lcwc: true, difficulty: 1, word: 'Schedule' },
    { id: 6, lcwc: true, difficulty: 3, word: 'Accommodation' },
    { id: 7, lcwc: true, difficulty: 3, word: 'Bureaucracy' },
    { id: 8, lcwc: true, difficulty: 3, word: 'Conscientious' },
    { id: 9, lcwc: true, difficulty: 2, word: 'Simultaneously' },
    { id: 10, lcwc: true, difficulty: 3, word: 'Embarrassment' },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  // CATEGORY: VISUAL CATEGORIZATION
  // ─────────────────────────────────────────────────────────────────────────────
  categorization: [
    {
      id: 1,
      difficulty: 1,
      tags: ['business'],
      instruction: 'Categorize the professional terms into the correct departments',
      buckets: [
        { id: 'hr', label: 'Human Resources', icon: '👥' },
        { id: 'fin', label: 'Finance', icon: '💰' }
      ],
      items: [
        { id: 'i1', word: 'Budget', bucketId: 'fin' },
        { id: 'i2', word: 'Recruitment', bucketId: 'hr' },
        { id: 'i3', word: 'Invoice', bucketId: 'fin' },
        { id: 'i4', word: 'Onboarding', bucketId: 'hr' }
      ]
    },
    {
      id: 2,
      difficulty: 2,
      instruction: 'Group the words by their spelling rule',
      buckets: [
        { id: 'db', label: 'Double Consonant', icon: '🔠' },
        { id: 'sl', label: 'Silent Letter', icon: '🤫' }
      ],
      items: [
        { id: 'i1', word: 'Embarrass', bucketId: 'db' },
        { id: 'i2', word: 'Rhythm', bucketId: 'sl' },
        { id: 'i3', word: 'Accommodate', bucketId: 'db' },
        { id: 'i4', word: 'Subtle', bucketId: 'sl' }
      ]
    },
    {
      id: 3,
      difficulty: 1,
      instruction: 'Sort these words into Nouns or Verbs',
      buckets: [
        { id: 'noun', label: 'Noun (Thing)', icon: '📦' },
        { id: 'verb', label: 'Verb (Action)', icon: '🏃' }
      ],
      items: [
        { id: 'i1', word: 'Management', bucketId: 'noun' },
        { id: 'i2', word: 'Execute', bucketId: 'verb' },
        { id: 'i3', word: 'Strategy', bucketId: 'noun' },
        { id: 'i4', word: 'Analyze', bucketId: 'verb' }
      ]
    },
    {
      id: 4,
      difficulty: 2,
      instruction: 'Categorize by the silent letter',
      buckets: [
        { id: 'sw', label: 'Silent W', icon: '🤫' },
        { id: 'sk', label: 'Silent K', icon: '🤫' }
      ],
      items: [
        { id: 'i1', word: 'Knight', bucketId: 'sk' },
        { id: 'i2', word: 'Wrist', bucketId: 'sw' },
        { id: 'i3', word: 'Knowledge', bucketId: 'sk' },
        { id: 'i4', word: 'Wreck', bucketId: 'sw' }
      ]
    }
  ]
};
