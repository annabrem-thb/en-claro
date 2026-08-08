export const wordDatabaseEN = {
  phonemes: [
    {
      id: 1,
      type: 'phoneme',
      word: 'Entrepreneur',
      difficulty: 3,
      phonetic: '/ ˌɒn.trə.prəˈnɜːr /',
      hint: {
        en: 'A person who sets up a business.',
        pl: 'Osoba zakładająca firmę.',
        de: 'Eine Person, die ein Unternehmen gründet.',
      },
    },
    {
      id: 2,
      type: 'phoneme',
      word: 'Paradigm',
      difficulty: 3,
      phonetic: '/ ˈpær.ə.daɪm /',
      hint: {
        en: 'A typical example or pattern of something.',
        pl: 'Typowy przykład lub wzorzec.',
        de: 'Ein typisches Beispiel oder Muster.',
      },
    },
    {
      id: 3,
      type: 'phoneme',
      word: 'Ubiquitous',
      difficulty: 3,
      phonetic: '/ juːˈbɪk.wɪ.təs /',
      hint: {
        en: 'Present, appearing, or found everywhere.',
        pl: 'Wszechobecny.',
        de: 'Allgegenwärtig.',
      },
    },
    {
      id: 4,
      type: 'phoneme',
      word: 'Hierarchy',
      difficulty: 2,
      phonetic: '/ ˈhaɪə.rɑː.ki /',
      hint: {
        en: 'A system in which members are ranked according to status or authority.',
        pl: 'Hierarchia, system rang.',
        de: 'Hierarchie, Rangordnung.',
      },
    },
    {
      id: 5,
      type: 'phoneme',
      word: 'Colleague',
      difficulty: 1,
      phonetic: '/ ˈkɒl.iːɡ /',
      hint: {
        en: 'A person with whom one works in a profession or business.',
        pl: 'Współpracownik.',
        de: 'Kollege.',
      },
    },
    {
      id: 6,
      type: 'phoneme',
      word: 'Bureaucracy',
      difficulty: 3,
      phonetic: '/ bjʊəˈrɒk.rə.si /',
      hint: {
        en: 'Excessively complicated administrative procedure.',
        pl: 'Biurokracja.',
        de: 'Bürokratie.',
      },
    },
    {
      id: 7,
      type: 'phoneme',
      word: 'Conscientious',
      difficulty: 3,
      phonetic: '/ ˌkɒn.ʃiˈen.ʃəs /',
      hint: {
        en: "Wishing to do what is right, especially to do one's work well.",
        pl: 'Sumienny.',
        de: 'Gewissenhaft.',
      },
    },
    {
      id: 8,
      type: 'phoneme',
      word: 'Guarantee',
      difficulty: 2,
      phonetic: '/ ˌɡær.ənˈtiː /',
      hint: {
        en: 'A formal promise or assurance.',
        pl: 'Gwarancja.',
        de: 'Garantie.',
      },
    },
    {
      id: 9,
      type: 'phoneme',
      word: 'Vulnerable',
      difficulty: 2,
      phonetic: '/ ˈvʌl.nər.ə.bəl /',
      hint: {
        en: 'Susceptible to physical or emotional attack or harm.',
        pl: 'Podatny, wrażliwy.',
        de: 'Verwundbar.',
      },
    },
    {
      id: 10,
      type: 'phoneme',
      word: 'Miscellaneous',
      difficulty: 3,
      phonetic: '/ ˌmɪs.əˈleɪ.ni.əs /',
      hint: {
        en: 'Of various types or from different sources.',
        pl: 'Rozmaity, różny.',
        de: 'Verschiedenes.',
      },
    },
    {
      id: 11,
      type: 'phoneme',
      word: 'Queue',
      difficulty: 3,
      phonetic: '/ kjuː /',
      hint: {
        en: 'A line or sequence of people or vehicles.',
        pl: 'Kolejka.',
        de: 'Warteschlange.',
      },
    },
    {
      id: 12,
      type: 'phoneme',
      word: 'Maneuver',
      difficulty: 3,
      phonetic: '/ məˈnuː.vər /',
      hint: {
        en: 'A movement or series of moves requiring skill and care.',
        pl: 'Manewr.',
        de: 'Manöver.',
      },
    },
    {
      id: 13,
      type: 'phoneme',
      word: 'Psychology',
      difficulty: 3,
      phonetic: '/ saɪˈkɒl.ə.dʒi /',
      hint: {
        en: 'Scientific study of the human mind and its functions.',
        pl: 'Psychologia.',
        de: 'Psychologie.',
      },
    },
    {
      id: 14,
      type: 'phoneme',
      word: 'Chaos',
      difficulty: 2,
      phonetic: '/ ˈkeɪ.ɒs /',
      hint: {
        en: 'Complete disorder and confusion.',
        pl: 'Całkowity nieporządek.',
        de: 'Völlige Unordnung.',
      },
    },
  ],
  graphemes: [
    {
      id: 1,
      type: 'grapheme',
      difficulty: 3,
      focus: 'affect vs effect',
      question: {
        en: 'Which word completes: "The new policy will ___ our workflow"?',
        pl: 'Które słowo pasuje: "Nowa polityka ___ na nasz przepływ pracy"?',
        de: 'Welches Wort passt: "Die neue Richtlinie wird unseren Arbeitsablauf ___"?',
      },
      options: [
        {
          text: 'affect',
          isCorrect: true,
          icon: '📉',
        },
        {
          text: 'effect',
          isCorrect: false,
          icon: '❌',
        },
        {
          text: 'afect',
          isCorrect: false,
          icon: '❌',
        },
        {
          text: 'efect',
          isCorrect: false,
          icon: '❌',
        },
      ],
    },
    {
      id: 2,
      type: 'grapheme',
      difficulty: 3,
      focus: 'principal vs principle',
      question: {
        en: 'Which word means "a fundamental truth or proposition"?',
        pl: 'Które słowo oznacza "podstawową prawdę lub zasadę"?',
        de: 'Welches Wort bedeutet "eine grundlegende Wahrheit oder ein Prinzip"?',
      },
      options: [
        {
          text: 'Principle',
          isCorrect: true,
          icon: '📜',
        },
        {
          text: 'Principal',
          isCorrect: false,
          icon: '🏫',
        },
        {
          text: 'Principell',
          isCorrect: false,
          icon: '❌',
        },
        {
          text: 'Prinicpal',
          isCorrect: false,
          icon: '❌',
        },
      ],
    },
    {
      id: 3,
      type: 'grapheme',
      difficulty: 3,
      focus: 'stationery vs stationary',
      question: {
        en: 'Which word refers to office supplies like paper and envelopes?',
        pl: 'Które słowo odnosi się do materiałów biurowych?',
        de: 'Welches Wort bezieht sich auf Büromaterial?',
      },
      options: [
        {
          text: 'Stationery',
          isCorrect: true,
          icon: '✉️',
        },
        {
          text: 'Stationary',
          isCorrect: false,
          icon: '🚗',
        },
        {
          text: 'Stationerry',
          isCorrect: false,
          icon: '❌',
        },
        {
          text: 'Stationarry',
          isCorrect: false,
          icon: '❌',
        },
      ],
    },
    {
      id: 4,
      type: 'grapheme',
      difficulty: 1,
      focus: "their vs there vs they're",
      question: {
        en: 'Which word indicates possession (belonging to them)?',
        pl: 'Które słowo oznacza przynależność (ich)?',
        de: 'Welches Wort zeigt Besitz an (ihr/ihre)?',
      },
      options: [
        {
          text: 'Their',
          isCorrect: true,
          icon: '👥',
        },
        {
          text: 'There',
          isCorrect: false,
          icon: '📍',
        },
        {
          text: "They're",
          isCorrect: false,
          icon: '❌',
        },
        {
          text: 'Thier',
          isCorrect: false,
          icon: '❌',
        },
      ],
    },
    {
      id: 5,
      type: 'grapheme',
      difficulty: 2,
      focus: "its vs it's",
      question: {
        en: 'Which word means "it is"?',
        pl: 'Które słowo jest skrótem od "it is" (to jest)?',
        de: 'Welches Wort bedeutet "es ist"?',
      },
      options: [
        {
          text: "It's",
          isCorrect: true,
          icon: '✨',
        },
        {
          text: 'Its',
          isCorrect: false,
          icon: '❌',
        },
        {
          text: "Its'",
          isCorrect: false,
          icon: '❌',
        },
        {
          text: 'Ites',
          isCorrect: false,
          icon: '❌',
        },
      ],
    },
    {
      id: 6,
      type: 'grapheme',
      difficulty: 3,
      focus: 'complement vs compliment',
      question: {
        en: 'Which word means to politely praise or admire someone?',
        pl: 'Które słowo oznacza prawienie komplementów?',
        de: 'Welches Wort bedeutet, jemandem ein Kompliment zu machen?',
      },
      options: [
        {
          text: 'Compliment',
          isCorrect: true,
          icon: '💬',
        },
        {
          text: 'Complement',
          isCorrect: false,
          icon: '🧩',
        },
        {
          text: 'Complimant',
          isCorrect: false,
          icon: '❌',
        },
        {
          text: 'Complemant',
          isCorrect: false,
          icon: '❌',
        },
      ],
    },
    {
      id: 7,
      type: 'grapheme',
      difficulty: 1,
      focus: 'lose vs loose',
      question: {
        en: 'Which word means to fail to win or to misplace something?',
        pl: 'Które słowo oznacza zgubić coś lub przegrać?',
        de: 'Welches Wort bedeutet, etwas zu verlieren?',
      },
      options: [
        {
          text: 'Lose',
          isCorrect: true,
          icon: '📉',
        },
        {
          text: 'Loose',
          isCorrect: false,
          icon: '👕',
        },
        {
          text: 'Looze',
          isCorrect: false,
          icon: '❌',
        },
        {
          text: 'Loos',
          isCorrect: false,
          icon: '❌',
        },
      ],
    },
    {
      id: 8,
      type: 'grapheme',
      difficulty: 2,
      focus: 'accept vs except',
      question: {
        en: 'Which word means to consent to receive something?',
        pl: 'Które słowo oznacza akceptację lub przyjęcie czegoś?',
        de: 'Welches Wort bedeutet, etwas anzunehmen?',
      },
      options: [
        {
          text: 'Accept',
          isCorrect: true,
          icon: '✅',
        },
        {
          text: 'Except',
          isCorrect: false,
          icon: '🚫',
        },
        {
          text: 'Acept',
          isCorrect: false,
          icon: '❌',
        },
        {
          text: 'Exept',
          isCorrect: false,
          icon: '❌',
        },
      ],
    },
    {
      id: 9,
      type: 'grapheme',
      difficulty: 2,
      focus: 'advise vs advice',
      question: {
        en: 'Which word is a VERB meaning to offer suggestions?',
        pl: 'Które słowo jest CZASOWNIKIEM oznaczającym doradzanie?',
        de: 'Welches Wort ist ein VERB und bedeutet, einen Rat zu geben?',
      },
      options: [
        {
          text: 'Advise',
          isCorrect: true,
          icon: '🗣️',
        },
        {
          text: 'Advice',
          isCorrect: false,
          icon: '📝',
        },
        {
          text: 'Advize',
          isCorrect: false,
          icon: '❌',
        },
        {
          text: 'Advis',
          isCorrect: false,
          icon: '❌',
        },
      ],
    },
    {
      id: 10,
      type: 'grapheme',
      difficulty: 2,
      focus: 'ensure vs insure',
      question: {
        en: 'Which word means to make certain that something will happen?',
        pl: 'Które słowo oznacza upewnienie się, że coś się wydarzy?',
        de: 'Welches Wort bedeutet, sicherzustellen, dass etwas passiert?',
      },
      options: [
        {
          text: 'Ensure',
          isCorrect: true,
          icon: '🔒',
        },
        {
          text: 'Insure',
          isCorrect: false,
          icon: '📄',
        },
        {
          text: 'Enshure',
          isCorrect: false,
          icon: '❌',
        },
        {
          text: 'Inshure',
          isCorrect: false,
          icon: '❌',
        },
      ],
    },
    {
      id: 11,
      type: 'grapheme',
      difficulty: 1,
      focus: 'bare vs bear',
      question: {
        en: 'Which word refers to a large heavy mammal?',
        pl: 'Które słowo oznacza dużego, ciężkiego ssaka?',
        de: 'Welches Wort bezieht sich auf ein großes, schweres Säugetier?',
      },
      options: [
        {
          text: 'Bear',
          isCorrect: true,
          icon: '🐻',
        },
        {
          text: 'Bare',
          isCorrect: false,
          icon: '🦶',
        },
        {
          text: 'Bair',
          isCorrect: false,
          icon: '❌',
        },
        {
          text: 'Beare',
          isCorrect: false,
          icon: '❌',
        },
      ],
    },
    {
      id: 12,
      type: 'grapheme',
      difficulty: 2,
      focus: 'break vs brake',
      question: {
        en: 'Which word means a device for slowing or stopping a moving vehicle?',
        pl: 'Które słowo oznacza urządzenie do hamowania pojazdu?',
        de: 'Welches Wort bedeutet eine Vorrichtung zum Verlangsamen oder Anhalten eines Fahrzeugs?',
      },
      options: [
        {
          text: 'Brake',
          isCorrect: true,
          icon: '🛑',
        },
        {
          text: 'Break',
          isCorrect: false,
          icon: '💔',
        },
        {
          text: 'Braik',
          isCorrect: false,
          icon: '❌',
        },
        {
          text: 'Brak',
          isCorrect: false,
          icon: '❌',
        },
      ],
    },
    {
      id: 13,
      type: 'grapheme',
      difficulty: 4,
      focus: 'silent "k" before "n"',
      question: {
        en: 'The "k" is silent here — you only hear the "n" sound. Which spelling is correct?',
        pl: '"k" jest tu nieme — słychać tylko głoskę "n". Które słowo jest poprawne?',
        de: 'Das "k" ist hier stumm — man hört nur den "n"-Laut. Welche Schreibweise ist richtig?',
      },
      options: [
        {
          text: 'Knee',
          isCorrect: true,
          icon: '🦵',
        },
        {
          text: 'Nee',
          isCorrect: false,
          icon: '❌',
        },
        {
          text: 'Kne',
          isCorrect: false,
          icon: '❌',
        },
        {
          text: 'Neee',
          isCorrect: false,
          icon: '❌',
        },
      ],
    },
    {
      id: 14,
      type: 'grapheme',
      difficulty: 4,
      focus: 'silent "g" before "n"',
      question: {
        en: 'The "g" is silent here too — a common mix-up with silent "k". Which spelling is correct?',
        pl: '"g" jest tu również nieme — częsta pomyłka z niemym "k". Które słowo jest poprawne?',
        de: 'Das "g" ist hier ebenfalls stumm — eine häufige Verwechslung mit dem stummen "k". Welche Schreibweise ist richtig?',
      },
      options: [
        {
          text: 'Gnome',
          isCorrect: true,
          icon: '🧙',
        },
        {
          text: 'Nome',
          isCorrect: false,
          icon: '❌',
        },
        {
          text: 'Knome',
          isCorrect: false,
          icon: '❌',
        },
        {
          text: 'Gknome',
          isCorrect: false,
          icon: '❌',
        },
      ],
    },
    {
      id: 15,
      type: 'grapheme',
      difficulty: 4,
      focus: '"ough" — one spelling, many sounds',
      question: {
        en: 'This is one of the trickiest patterns in English spelling. Which spelling means "believed" (past tense of think)?',
        pl: 'To jeden z najtrudniejszych wzorców w angielskiej pisowni. Które słowo znaczy "pomyślał" (czas przeszły od think)?',
        de: 'Dies ist eines der schwierigsten Muster der englischen Rechtschreibung. Welche Schreibweise bedeutet "dachte" (Vergangenheitsform von think)?',
      },
      options: [
        {
          text: 'Thought',
          isCorrect: true,
          icon: '💭',
        },
        {
          text: 'Thawt',
          isCorrect: false,
          icon: '❌',
        },
        {
          text: 'Thort',
          isCorrect: false,
          icon: '❌',
        },
        {
          text: 'Thourght',
          isCorrect: false,
          icon: '❌',
        },
      ],
    },
    {
      id: 16,
      type: 'grapheme',
      difficulty: 4,
      focus: 'silent "b" after "m"',
      question: {
        en: 'The "b" is silent after "m" at the end of this word. Which spelling is correct?',
        pl: '"b" jest nieme po "m" na końcu tego słowa. Które słowo jest poprawne?',
        de: 'Das "b" ist nach "m" am Wortende stumm. Welche Schreibweise ist richtig?',
      },
      options: [
        {
          text: 'Comb',
          isCorrect: true,
          icon: '🪮',
        },
        {
          text: 'Com',
          isCorrect: false,
          icon: '❌',
        },
        {
          text: 'Coumb',
          isCorrect: false,
          icon: '❌',
        },
        {
          text: 'Comm',
          isCorrect: false,
          icon: '❌',
        },
      ],
    },
    {
      id: 17,
      type: 'grapheme',
      difficulty: 4,
      focus: 'silent "w" before "r"',
      question: {
        en: 'The "w" is silent before "r" here. Which spelling is correct?',
        pl: '"w" jest nieme przed "r". Które słowo jest poprawne?',
        de: 'Das "w" ist hier vor "r" stumm. Welche Schreibweise ist richtig?',
      },
      options: [
        {
          text: 'Wrist',
          isCorrect: true,
          icon: '✋',
        },
        {
          text: 'Rist',
          isCorrect: false,
          icon: '❌',
        },
        {
          text: 'Wriist',
          isCorrect: false,
          icon: '❌',
        },
        {
          text: 'Rrist',
          isCorrect: false,
          icon: '❌',
        },
      ],
    },
    {
      id: 18,
      type: 'grapheme',
      difficulty: 4,
      focus: 'doubling the consonant before "-ing"',
      question: {
        en: 'Which spelling correctly doubles the consonant before adding "-ing"?',
        pl: 'Które słowo poprawnie podwaja spółgłoskę przed dodaniem "-ing"?',
        de: 'Welche Schreibweise verdoppelt den Konsonanten vor "-ing" richtig?',
      },
      options: [
        {
          text: 'Running',
          isCorrect: true,
          icon: '🏃',
        },
        {
          text: 'Runing',
          isCorrect: false,
          icon: '❌',
        },
        {
          text: 'Runnning',
          isCorrect: false,
          icon: '❌',
        },
        {
          text: 'Runeing',
          isCorrect: false,
          icon: '❌',
        },
      ],
    },
    {
      id: 19,
      type: 'grapheme',
      focus: 'rhyme recognition',
      difficulty: 2,
      question: {
        en: 'Which word rhymes with "delegate" (verb)?',
        pl: 'Które słowo rymuje się ze słowem "delegate" (delegować)?',
        de: 'Welches Wort reimt sich auf "delegate" (delegieren)?',
      },
      options: [
        { text: 'Demonstrate', isCorrect: true, icon: '📢' },
        { text: 'Develop', isCorrect: false, icon: '❌' },
        { text: 'Decision', isCorrect: false, icon: '❌' },
        { text: 'Department', isCorrect: false, icon: '❌' },
      ],
    },
    {
      id: 20,
      type: 'grapheme',
      focus: 'rhyme recognition',
      difficulty: 3,
      question: {
        en: 'Which word rhymes with "negotiate"?',
        pl: 'Które słowo rymuje się ze słowem "negotiate" (negocjować)?',
        de: 'Welches Wort reimt sich auf "negotiate" (verhandeln)?',
      },
      options: [
        { text: 'Communicate', isCorrect: true, icon: '💬' },
        { text: 'Negotiation', isCorrect: false, icon: '❌' },
        { text: 'Organize', isCorrect: false, icon: '❌' },
        { text: 'Management', isCorrect: false, icon: '❌' },
      ],
    },
    {
      id: 21,
      type: 'grapheme',
      focus: 'rhyme — subtle similarities',
      difficulty: 4,
      question: {
        en: 'Which word rhymes with "commit"?',
        pl: 'Które słowo rymuje się ze słowem "commit" (zobowiązać się)?',
        de: 'Welches Wort reimt sich auf "commit" (sich verpflichten)?',
      },
      options: [
        { text: 'Permit', isCorrect: true, icon: '✅' },
        { text: 'Comment', isCorrect: false, icon: '❌' },
        { text: 'Complete', isCorrect: false, icon: '❌' },
        { text: 'Compete', isCorrect: false, icon: '❌' },
      ],
    },
    {
      id: 22,
      type: 'grapheme',
      focus: 'phoneme discrimination — initial voicing',
      difficulty: 2,
      question: {
        en: 'Which word starts with a voiceless sound, unlike the others?',
        pl: 'Które słowo zaczyna się głoską bezdźwięczną, inną niż pozostałe?',
        de: 'Welches Wort beginnt mit einem stimmlosen Laut, anders als die übrigen?',
      },
      options: [
        { text: 'Task', isCorrect: true, icon: '✅' },
        { text: 'Deal', isCorrect: false, icon: '❌' },
        { text: 'Goal', isCorrect: false, icon: '❌' },
        { text: 'Budget', isCorrect: false, icon: '❌' },
      ],
    },
    {
      id: 23,
      type: 'grapheme',
      focus: 'phoneme discrimination — initial nasals',
      difficulty: 3,
      question: {
        en: 'Which word does NOT start with a nasal sound (m/n), unlike the others?',
        pl: 'Które słowo NIE zaczyna się głoską nosową (m/n), inaczej niż pozostałe?',
        de: 'Welches Wort beginnt NICHT mit einem Nasallaut (m/n), anders als die übrigen?',
      },
      options: [
        { text: 'Target', isCorrect: true, icon: '✅' },
        { text: 'Market', isCorrect: false, icon: '❌' },
        { text: 'Notice', isCorrect: false, icon: '❌' },
        { text: 'Manage', isCorrect: false, icon: '❌' },
      ],
    },
    {
      id: 24,
      type: 'grapheme',
      focus: 'phoneme discrimination — vowel quality',
      difficulty: 4,
      question: {
        en: 'Which word does NOT contain the short /ɪ/ vowel sound, unlike the others?',
        pl: 'Które słowo NIE zawiera krótkiej samogłoski /ɪ/, inaczej niż pozostałe?',
        de: 'Welches Wort enthält NICHT den kurzen Vokal /ɪ/, anders als die übrigen?',
      },
      options: [
        { text: 'Cloud', isCorrect: true, icon: '✅' },
        { text: 'Chip', isCorrect: false, icon: '❌' },
        { text: 'Disk', isCorrect: false, icon: '❌' },
        { text: 'Link', isCorrect: false, icon: '❌' },
      ],
    },
    {
      id: 25,
      type: 'grapheme',
      difficulty: 1,
      focus: 'concept-to-icon matching — business',
      question: {
        en: 'Which word matches the term "budget"?',
        pl: 'Które słowo pasuje do terminu "budżet"?',
        de: 'Welches Wort passt zum Begriff "Budget"?',
      },
      options: [
        { text: 'Money', isCorrect: true, icon: '💰' },
        { text: 'Collaboration', isCorrect: false, icon: '🤝' },
        { text: 'Growth', isCorrect: false, icon: '📈' },
        { text: 'Deadline', isCorrect: false, icon: '📅' },
      ],
    },
    {
      id: 26,
      type: 'grapheme',
      difficulty: 2,
      focus: 'concept-to-icon matching — medical',
      question: {
        en: 'Which word matches the term "myocardial infarction"?',
        pl: 'Które słowo pasuje do terminu "zawał serca"?',
        de: 'Welches Wort passt zum Begriff "Herzinfarkt"?',
      },
      options: [
        { text: 'Heart', isCorrect: true, icon: '🫀' },
        { text: 'Lungs', isCorrect: false, icon: '🫁' },
        { text: 'Brain', isCorrect: false, icon: '🧠' },
        { text: 'Bone', isCorrect: false, icon: '🦴' },
      ],
    },
    {
      id: 27,
      type: 'grapheme',
      difficulty: 3,
      focus: 'concept-to-icon matching — legal',
      question: {
        en: 'Which word matches the term "lawsuit"?',
        pl: 'Które słowo pasuje do terminu "pozew sądowy"?',
        de: 'Welches Wort passt zum Begriff "Klage"?',
      },
      options: [
        { text: 'Justice', isCorrect: true, icon: '⚖️' },
        { text: 'Document', isCorrect: false, icon: '📄' },
        { text: 'Company', isCorrect: false, icon: '🏢' },
        { text: 'Agreement', isCorrect: false, icon: '🤝' },
      ],
    },
    {
      id: 28,
      type: 'grapheme',
      difficulty: 2,
      focus: 'professional term definitions — medical',
      question: {
        en: 'Which word means abnormally high blood pressure?',
        pl: 'Które słowo oznacza podwyższone ciśnienie krwi?',
        de: 'Welches Wort bedeutet abnormal hoher Blutdruck?',
      },
      options: [
        { text: 'Hypertension', isCorrect: true, icon: '🩺' },
        { text: 'Hypotension', isCorrect: false, icon: '❌' },
        { text: 'Diabetes', isCorrect: false, icon: '❌' },
        { text: 'Migraine', isCorrect: false, icon: '❌' },
      ],
    },
    {
      id: 29,
      type: 'grapheme',
      difficulty: 3,
      focus: 'professional term definitions — legal',
      question: {
        en: 'Which word means the official authority to make legal decisions?',
        pl: 'Które słowo oznacza zakres uprawnień sądu do rozstrzygania spraw?',
        de: 'Welches Wort bedeutet die amtliche Befugnis, Rechtsentscheidungen zu treffen?',
      },
      options: [
        { text: 'Jurisdiction', isCorrect: true, icon: '⚖️' },
        { text: 'Legislation', isCorrect: false, icon: '❌' },
        { text: 'Appeal', isCorrect: false, icon: '❌' },
        { text: 'Clause', isCorrect: false, icon: '❌' },
      ],
    },
    {
      id: 30,
      type: 'grapheme',
      difficulty: 3,
      focus: 'professional term definitions — financial',
      question: {
        en: "Which word means the gradual write-off of an asset's cost over time?",
        pl: 'Które słowo oznacza stopniowe rozliczanie kosztu środka trwałego w czasie?',
        de: 'Welches Wort bedeutet die schrittweise Verteilung der Kosten eines Vermögenswerts über die Zeit?',
      },
      options: [
        { text: 'Amortization', isCorrect: true, icon: '📉' },
        { text: 'Inflation', isCorrect: false, icon: '❌' },
        { text: 'Commission', isCorrect: false, icon: '❌' },
        { text: 'Margin', isCorrect: false, icon: '❌' },
      ],
    },
    {
      id: 31,
      type: 'grapheme',
      difficulty: 2,
      focus: 'hidden words — morphological awareness',
      question: {
        en: 'What word is hidden in "presentation"?',
        pl: 'Jakie słowo jest ukryte w słowie "presentation" (prezentacja)?',
        de: 'Welches Wort ist versteckt in "presentation" (Präsentation)?',
      },
      options: [
        { text: 'Present', isCorrect: true, icon: '🎁' },
        { text: 'Precise', isCorrect: false, icon: '❌' },
        { text: 'Portion', isCorrect: false, icon: '❌' },
        { text: 'Pretend', isCorrect: false, icon: '❌' },
      ],
    },
    {
      id: 32,
      type: 'grapheme',
      difficulty: 3,
      focus: 'hidden words — morphological awareness',
      question: {
        en: 'What word is hidden in "management"?',
        pl: 'Jakie słowo jest ukryte w słowie "management" (zarządzanie)?',
        de: 'Welches Wort ist versteckt in "management" (Management)?',
      },
      options: [
        { text: 'Manage', isCorrect: true, icon: '✅' },
        { text: 'Manner', isCorrect: false, icon: '❌' },
        { text: 'Magnet', isCorrect: false, icon: '❌' },
        { text: 'Mantle', isCorrect: false, icon: '❌' },
      ],
    },
    {
      id: 33,
      type: 'grapheme',
      difficulty: 4,
      focus: 'hidden words — harder morphological analysis',
      question: {
        en: 'What word is hidden in "cardiovascular"?',
        pl: 'Jakie słowo jest ukryte w słowie "cardiovascular" (sercowo-naczyniowy)?',
        de: 'Welches Wort ist versteckt in "cardiovascular" (kardiovaskulär)?',
      },
      options: [
        { text: 'Vascular', isCorrect: true, icon: '🩺' },
        { text: 'Cardinal', isCorrect: false, icon: '❌' },
        { text: 'Vacation', isCorrect: false, icon: '❌' },
        { text: 'Cascade', isCorrect: false, icon: '❌' },
      ],
    },
    {
      id: 34,
      type: 'grapheme',
      difficulty: 2,
      focus: 'deductive reasoning — basic premises',
      question: {
        en: 'Premise 1: "Any project exceeding budget requires executive approval." Premise 2: "Project X exceeded budget." What follows?',
        pl: 'Przesłanka 1: "Każdy projekt przekraczający budżet wymaga zgody zarządu." Przesłanka 2: "Projekt X przekroczył budżet." Co z tego wynika?',
        de: 'Prämisse 1: "Jedes Projekt, das das Budget überschreitet, benötigt die Zustimmung der Geschäftsführung." Prämisse 2: "Projekt X hat das Budget überschritten." Was folgt daraus?',
      },
      options: [
        { text: 'It requires executive approval', isCorrect: true, icon: '✅' },
        { text: 'The project will be cancelled', isCorrect: false, icon: '❌' },
        { text: 'The team will be reprimanded', isCorrect: false, icon: '❌' },
        { text: 'Nothing can be concluded', isCorrect: false, icon: '❌' },
      ],
    },
    {
      id: 35,
      type: 'grapheme',
      difficulty: 3,
      focus: 'deductive reasoning — premise chain',
      question: {
        en: 'Premise 1: "Transactions over $50,000 require an audit." Premise 2: "This transaction is $75,000." Premise 3: "An audit takes at least 5 business days." What can we conclude?',
        pl: 'Przesłanka 1: "Transakcje powyżej 50 000 zł wymagają audytu." Przesłanka 2: "Ta transakcja wynosi 75 000 zł." Przesłanka 3: "Audyt trwa co najmniej 5 dni roboczych." Co możemy stwierdzić?',
        de: 'Prämisse 1: "Transaktionen über 50.000 € erfordern eine Prüfung." Prämisse 2: "Diese Transaktion beträgt 75.000 €." Prämisse 3: "Eine Prüfung dauert mindestens 5 Werktage." Was können wir schließen?',
      },
      options: [
        {
          text: 'The transaction requires an audit taking at least 5 business days',
          isCorrect: true,
          icon: '📋',
        },
        {
          text: 'The transaction will be rejected',
          isCorrect: false,
          icon: '❌',
        },
        { text: 'No audit is required', isCorrect: false, icon: '❌' },
        {
          text: 'Manager approval alone is sufficient',
          isCorrect: false,
          icon: '❌',
        },
      ],
    },
    {
      id: 36,
      type: 'grapheme',
      difficulty: 2,
      focus: 'inductive reasoning — pattern generalization',
      question: {
        en: 'Company A: invested in automation, productivity +20%. Company B: same, +18%. Company C: same, +22%. What pattern do these examples suggest?',
        pl: 'Firma A: inwestycja w automatyzację, produktywność +20%. Firma B: to samo, +18%. Firma C: to samo, +22%. Jaki wzorzec sugerują te przykłady?',
        de: 'Firma A: Investition in Automatisierung, Produktivität +20 %. Firma B: dasselbe, +18 %. Firma C: dasselbe, +22 %. Welches Muster legen diese Beispiele nahe?',
      },
      options: [
        {
          text: 'Automation generally increases productivity by about 18–22%',
          isCorrect: true,
          icon: '📈',
        },
        {
          text: 'Automation has no effect on productivity',
          isCorrect: false,
          icon: '❌',
        },
        {
          text: 'Automation always increases productivity by exactly 20%',
          isCorrect: false,
          icon: '❌',
        },
        {
          text: 'Nothing can be inferred from this data',
          isCorrect: false,
          icon: '❌',
        },
      ],
    },
    {
      id: 37,
      type: 'grapheme',
      difficulty: 3,
      focus: 'inductive reasoning — pattern with exception',
      question: {
        en: 'Market growth: Year 1: +12%, Year 2: +15%, Year 3: -3% (recession), Year 4: +10%, Year 5: +14%. What is the correct conclusion about the trend?',
        pl: 'Wzrost rynku: Rok 1: +12%, Rok 2: +15%, Rok 3: -3% (recesja), Rok 4: +10%, Rok 5: +14%. Jaki jest właściwy wniosek o trendzie?',
        de: 'Marktwachstum: Jahr 1: +12 %, Jahr 2: +15 %, Jahr 3: -3 % (Rezession), Jahr 4: +10 %, Jahr 5: +14 %. Was ist die richtige Schlussfolgerung zum Trend?',
      },
      options: [
        {
          text: 'Growth of about 12–15% annually, with an exception during the recession year',
          isCorrect: true,
          icon: '📊',
        },
        {
          text: 'The market is continuously shrinking',
          isCorrect: false,
          icon: '❌',
        },
        {
          text: 'The trend is completely unpredictable',
          isCorrect: false,
          icon: '❌',
        },
        {
          text: 'Year 3 should be ignored as a data error',
          isCorrect: false,
          icon: '❌',
        },
      ],
    },
    {
      id: 38,
      type: 'grapheme',
      difficulty: 2,
      focus: 'conditional logic — if-then rule',
      question: {
        en: 'Rule: "If fever > 38.5°C AND sore throat present, THEN suspect strep infection." The patient has a fever of 39.2°C and a sore throat. What should be considered?',
        pl: 'Zasada: "Jeśli gorączka > 38,5°C ORAZ ból gardła, TO podejrzewaj infekcję paciorkowcową." Pacjent ma gorączkę 39,2°C i ból gardła. Co należy rozważyć?',
        de: 'Regel: "Wenn Fieber > 38,5 °C UND Halsschmerzen vorliegen, DANN Streptokokken-Infektion vermuten." Der Patient hat 39,2 °C Fieber und Halsschmerzen. Was sollte in Betracht gezogen werden?',
      },
      options: [
        {
          text: 'Strep infection is likely — recommend a throat culture',
          isCorrect: true,
          icon: '🩺',
        },
        {
          text: 'It is definitely a common cold',
          isCorrect: false,
          icon: '❌',
        },
        { text: 'No action is needed', isCorrect: false, icon: '❌' },
        {
          text: 'Antibiotics should be given immediately without testing',
          isCorrect: false,
          icon: '❌',
        },
      ],
    },
    {
      id: 39,
      type: 'grapheme',
      difficulty: 3,
      focus: 'conditional logic — nested rules',
      question: {
        en: 'Rules: (1) If expense < $5K — manager approval. (2) If $5K–$50K — director approval. (3) If vendor is not on the approved list — procurement review required (+5 days). Scenario: $30K expense, new vendor. What is required?',
        pl: 'Zasady: (1) Jeśli wydatek < 5000 zł — zgoda kierownika. (2) Jeśli 5000–50000 zł — zgoda dyrektora. (3) Jeśli dostawca spoza listy zatwierdzonych — wymagany przegląd zakupowy (+5 dni). Scenariusz: wydatek 30 000 zł, nowy dostawca. Co jest wymagane?',
        de: 'Regeln: (1) Wenn Ausgabe < 5.000 € — Zustimmung des Managers. (2) Wenn 5.000–50.000 € — Zustimmung des Direktors. (3) Wenn der Lieferant nicht auf der Freigabeliste steht — Beschaffungsprüfung erforderlich (+5 Tage). Szenario: 30.000 € Ausgabe, neuer Lieferant. Was ist erforderlich?',
      },
      options: [
        {
          text: 'Director approval AND procurement review (+5 days)',
          isCorrect: true,
          icon: '✅',
        },
        { text: 'Manager approval only', isCorrect: false, icon: '❌' },
        { text: 'No approval is required', isCorrect: false, icon: '❌' },
        {
          text: 'Procurement review only, no approval',
          isCorrect: false,
          icon: '❌',
        },
      ],
    },
  ],
  syllables: [
    {
      id: 1,
      type: 'syllable',
      difficulty: 3,
      word: 'Bureaucracy',
      segments: ['Bu', 'reau', 'cra', 'cy'],
      icon: '🏛️',
    },
    {
      id: 2,
      type: 'syllable',
      difficulty: 3,
      word: 'Simultaneously',
      segments: ['Si', 'mul', 'ta', 'ne', 'ous', 'ly'],
      icon: '⚡',
    },
    {
      id: 3,
      type: 'syllable',
      difficulty: 3,
      word: 'Conscientious',
      segments: ['Con', 'sci', 'en', 'tious'],
      icon: '✅',
    },
    {
      id: 4,
      type: 'syllable',
      difficulty: 2,
      word: 'Responsibility',
      segments: ['Re', 'spon', 'si', 'bil', 'i', 'ty'],
      icon: '⚖️',
    },
    {
      id: 5,
      type: 'syllable',
      difficulty: 3,
      word: 'Entrepreneur',
      segments: ['En', 'tre', 'pre', 'neur'],
      icon: '🚀',
    },
    {
      id: 6,
      type: 'syllable',
      difficulty: 2,
      word: 'Organization',
      segments: ['Or', 'ga', 'ni', 'za', 'tion'],
      icon: '🏢',
    },
    {
      id: 7,
      type: 'syllable',
      difficulty: 2,
      word: 'Communication',
      segments: ['Com', 'mu', 'ni', 'ca', 'tion'],
      icon: '💬',
    },
    {
      id: 8,
      type: 'syllable',
      difficulty: 1,
      word: 'Development',
      segments: ['De', 'vel', 'op', 'ment'],
      icon: '📈',
    },
    {
      id: 9,
      type: 'syllable',
      difficulty: 2,
      word: 'Professional',
      segments: ['Pro', 'fes', 'sion', 'al'],
      icon: '👔',
    },
    {
      id: 10,
      type: 'syllable',
      difficulty: 2,
      word: 'Appreciation',
      segments: ['Ap', 'pre', 'ci', 'a', 'tion'],
      icon: '🙏',
    },
    {
      id: 11,
      type: 'syllable',
      difficulty: 3,
      word: 'Unbelievable',
      segments: ['Un', 'be', 'liev', 'a', 'ble'],
      icon: '🤯',
    },
    {
      id: 12,
      type: 'syllable',
      difficulty: 2,
      word: 'Reliability',
      segments: ['Re', 'li', 'a', 'bil', 'i', 'ty'],
      icon: '🤝',
    },
  ],
  scrabble: [
    {
      id: 1,
      type: 'scrabble',
      difficulty: 3,
      word: 'COLLEAGUE',
      scrambled: ['C', 'O', 'L', 'L', 'E', 'A', 'G', 'U', 'E'],
      distractors: ['I', 'N'],
      image: '👥',
    },
    {
      id: 2,
      type: 'scrabble',
      difficulty: 3,
      word: 'GUARANTEE',
      scrambled: ['G', 'U', 'A', 'R', 'A', 'N', 'T', 'E', 'E'],
      distractors: ['O', 'W'],
      image: '🛡️',
    },
    {
      id: 3,
      type: 'scrabble',
      difficulty: 3,
      word: 'ASSESSMENT',
      scrambled: ['A', 'S', 'S', 'E', 'S', 'S', 'M', 'E', 'N', 'T'],
      distractors: ['C', 'R'],
      image: '📊',
    },
    {
      id: 4,
      type: 'scrabble',
      difficulty: 2,
      word: 'COMMITTEE',
      scrambled: ['C', 'O', 'M', 'M', 'I', 'T', 'T', 'E', 'E'],
      distractors: ['N', 'L'],
      image: '🧑‍🤝‍🧑',
    },
    {
      id: 5,
      type: 'scrabble',
      difficulty: 2,
      word: 'SCHEDULE',
      scrambled: ['S', 'C', 'H', 'E', 'D', 'U', 'L', 'E'],
      distractors: ['K', 'A'],
      image: '📅',
    },
    {
      id: 6,
      type: 'scrabble',
      difficulty: 2,
      word: 'STRATEGY',
      scrambled: ['S', 'T', 'R', 'A', 'T', 'E', 'G', 'Y'],
      distractors: ['J', 'I'],
      image: '🎯',
    },
    {
      id: 7,
      type: 'scrabble',
      difficulty: 2,
      word: 'MANAGEMENT',
      scrambled: ['M', 'A', 'N', 'A', 'G', 'E', 'M', 'E', 'N', 'T'],
      distractors: ['O', 'I'],
      image: '💼',
    },
    {
      id: 8,
      type: 'scrabble',
      difficulty: 2,
      word: 'KNOWLEDGE',
      scrambled: ['K', 'N', 'O', 'W', 'L', 'E', 'D', 'G', 'E'],
      distractors: ['C', 'A'],
      image: '🧠',
    },
    {
      id: 9,
      type: 'scrabble',
      difficulty: 2,
      word: 'EXPERIENCE',
      scrambled: ['E', 'X', 'P', 'E', 'R', 'I', 'E', 'N', 'C', 'E'],
      distractors: ['S', 'O'],
      image: '⭐',
    },
    {
      id: 10,
      type: 'scrabble',
      difficulty: 2,
      word: 'LEADERSHIP',
      scrambled: ['L', 'E', 'A', 'D', 'E', 'R', 'S', 'H', 'I', 'P'],
      distractors: ['T', 'O'],
      image: '👑',
    },
    {
      id: 11,
      type: 'scrabble',
      difficulty: 3,
      word: 'AUTHENTIC',
      scrambled: ['A', 'U', 'T', 'H', 'E', 'N', 'T', 'I', 'C'],
      distractors: ['M', 'S'],
      image: '💎',
    },
    {
      id: 12,
      type: 'scrabble',
      difficulty: 3,
      word: 'INDEPENDENT',
      scrambled: ['I', 'N', 'D', 'E', 'P', 'E', 'N', 'D', 'E', 'N', 'T'],
      distractors: ['A', 'U'],
      image: '🦅',
    },
    {
      id: 13,
      type: 'scrabble',
      focus: 'phoneme synthesis — single letters',
      difficulty: 2,
      word: 'REPORT',
      scrambled: ['R', 'E', 'P', 'O', 'R', 'T'],
      distractors: ['N', 'K'],
      image: '📄',
    },
    {
      id: 14,
      type: 'scrabble',
      focus: 'phoneme synthesis — syllables',
      difficulty: 3,
      word: 'MARKET',
      scrambled: ['MAR', 'KET'],
      distractors: ['TAR', 'LET'],
      image: '🏪',
    },
    {
      id: 15,
      type: 'scrabble',
      focus: 'phoneme synthesis — syllables',
      difficulty: 4,
      word: 'MANAGER',
      scrambled: ['MAN', 'AGE', 'R'],
      distractors: ['TAG', 'IS'],
      image: '👔',
    },
  ],
  context: [
    {
      id: 1,
      type: 'context',
      difficulty: 3,
      tags: ['business'],
      sentence_part1: 'The committee needs to',
      sentence_part2: 'the long-term financial risks before proceeding.',
      options: [
        {
          text: 'assess',
          isCorrect: true,
        },
        {
          text: 'access',
          isCorrect: false,
        },
        {
          text: 'asess',
          isCorrect: false,
        },
        {
          text: 'acess',
          isCorrect: false,
        },
      ],
      hint: {
        en: '"Assess" means to evaluate. "Access" means to enter or retrieve.',
        pl: '"Assess" oznacza oceniać. "Access" oznacza dostęp.',
      },
    },
    {
      id: 2,
      type: 'context',
      difficulty: 3,
      tags: ['business'],
      sentence_part1: 'We must ensure that our supply chain remains',
      sentence_part2: 'despite the market volatility.',
      options: [
        {
          text: 'resilient',
          isCorrect: true,
        },
        {
          text: 'resistant',
          isCorrect: false,
        },
        {
          text: 'resiliant',
          isCorrect: false,
        },
        {
          text: 'resistent',
          isCorrect: false,
        },
      ],
      hint: {
        en: '"Resilient" implies bouncing back from adversity. "Resistant" means blocking it entirely.',
        pl: '"Resilient" oznacza odporny, potrafiący się podnieść. "Resistant" to całkowicie blokujący.',
      },
    },
    {
      id: 3,
      type: 'context',
      difficulty: 2,
      tags: ['business'],
      sentence_part1: 'Please',
      sentence_part2: 'that all files are saved on the shared drive.',
      options: [
        {
          text: 'ensure',
          isCorrect: true,
        },
        {
          text: 'insure',
          isCorrect: false,
        },
        {
          text: 'enshure',
          isCorrect: false,
        },
        {
          text: 'inshure',
          isCorrect: false,
        },
      ],
      hint: {
        en: '"Ensure" is to make sure. "Insure" relates to insurance policies.',
        pl: '"Ensure" to upewnić się. "Insure" dotyczy ubezpieczeń.',
      },
    },
    {
      id: 4,
      type: 'context',
      difficulty: 2,
      tags: ['everyday'],
      sentence_part1: 'I will',
      sentence_part2: 'the offer with great pleasure.',
      options: [
        {
          text: 'accept',
          isCorrect: true,
        },
        {
          text: 'except',
          isCorrect: false,
        },
        {
          text: 'acept',
          isCorrect: false,
        },
        {
          text: 'exept',
          isCorrect: false,
        },
      ],
      hint: {
        en: '"Accept" means to receive. "Except" means to exclude.',
        pl: '"Accept" to przyjąć. "Except" to z wyjątkiem.',
      },
    },
    {
      id: 5,
      type: 'context',
      difficulty: 3,
      tags: ['business'],
      sentence_part1: 'What do you',
      sentence_part2: 'from the recent drop in sales?',
      options: [
        {
          text: 'infer',
          isCorrect: true,
        },
        {
          text: 'imply',
          isCorrect: false,
        },
        {
          text: 'inffer',
          isCorrect: false,
        },
        {
          text: 'implie',
          isCorrect: false,
        },
      ],
      hint: {
        en: 'To "infer" is to deduce. To "imply" is to suggest indirectly.',
        pl: '"Infer" to wnioskować. "Imply" to sugerować.',
      },
    },
    {
      id: 6,
      type: 'context',
      difficulty: 2,
      tags: ['business'],
      sentence_part1: 'We will',
      sentence_part2: 'with the presentation after a short break.',
      options: [
        {
          text: 'proceed',
          isCorrect: true,
        },
        {
          text: 'precede',
          isCorrect: false,
        },
        {
          text: 'procede',
          isCorrect: false,
        },
        {
          text: 'preceed',
          isCorrect: false,
        },
      ],
      hint: {
        en: '"Proceed" means to continue. "Precede" means to come before.',
        pl: '"Proceed" to kontynuować. "Precede" to poprzedzać.',
      },
    },
    {
      id: 7,
      type: 'context',
      difficulty: 3,
      tags: ['business'],
      sentence_part1:
        'Unfortunately, his handwriting on the form was completely',
      sentence_part2: '.',
      options: [
        {
          text: 'illegible',
          isCorrect: true,
        },
        {
          text: 'eligible',
          isCorrect: false,
        },
        {
          text: 'illegable',
          isCorrect: false,
        },
        {
          text: 'eligable',
          isCorrect: false,
        },
      ],
      hint: {
        en: '"Illegible" means unreadable. "Eligible" means qualified.',
        pl: '"Illegible" to nieczytelny. "Eligible" to kwalifikujący się.',
      },
    },
    {
      id: 8,
      type: 'context',
      difficulty: 2,
      tags: ['business'],
      sentence_part1: 'The auditor conducted a very',
      sentence_part2: 'review of our accounts.',
      options: [
        {
          text: 'thorough',
          isCorrect: true,
        },
        {
          text: 'through',
          isCorrect: false,
        },
        {
          text: 'thoroughly',
          isCorrect: false,
        },
        {
          text: 'thru',
          isCorrect: false,
        },
      ],
      hint: {
        en: '"Thorough" means complete/detailed. "Through" is a preposition.',
        pl: '"Thorough" to dokładny. "Through" to przez.',
      },
    },
    {
      id: 9,
      type: 'context',
      difficulty: 2,
      tags: ['everyday'],
      sentence_part1: 'She was',
      sentence_part2: 'employed at a marketing agency before joining us.',
      options: [
        {
          text: 'formerly',
          isCorrect: true,
        },
        {
          text: 'formally',
          isCorrect: false,
        },
        {
          text: 'formarly',
          isCorrect: false,
        },
        {
          text: 'formely',
          isCorrect: false,
        },
      ],
      hint: {
        en: '"Formerly" means previously. "Formally" means officially.',
        pl: '"Formerly" to dawniej. "Formally" to formalnie.',
      },
    },
    {
      id: 10,
      type: 'context',
      difficulty: 2,
      tags: ['business'],
      sentence_part1: 'All inquiries regarding payroll should be directed to',
      sentence_part2: '.',
      options: [
        {
          text: 'personnel',
          isCorrect: true,
        },
        {
          text: 'personal',
          isCorrect: false,
        },
        {
          text: 'personel',
          isCorrect: false,
        },
        {
          text: 'personall',
          isCorrect: false,
        },
      ],
      hint: {
        en: '"Personnel" refers to staff. "Personal" means private.',
        pl: '"Personnel" to personel. "Personal" to osobisty.',
      },
    },
    {
      id: 11,
      type: 'context',
      difficulty: 2,
      tags: ['everyday'],
      sentence_part1: 'Make sure',
      sentence_part2: 'ready for the presentation tomorrow.',
      options: [
        {
          text: "you're",
          isCorrect: true,
        },
        {
          text: 'your',
          isCorrect: false,
        },
        {
          text: 'yours',
          isCorrect: false,
        },
        {
          text: 'youre',
          isCorrect: false,
        },
      ],
      hint: {
        en: '"You\'re" is a contraction of "you are".',
        pl: '"You\'re" to skrót od "you are".',
        de: '"You\'re" ist die Abkürzung für "you are".',
      },
    },
    {
      id: 12,
      type: 'context',
      difficulty: 3,
      tags: ['business'],
      sentence_part1: 'The speaker made an',
      sentence_part2: 'to the recent market trends.',
      options: [
        {
          text: 'allusion',
          isCorrect: true,
        },
        {
          text: 'illusion',
          isCorrect: false,
        },
        {
          text: 'alusion',
          isCorrect: false,
        },
        {
          text: 'ilusion',
          isCorrect: false,
        },
      ],
      hint: {
        en: 'An "allusion" is an indirect reference. An "illusion" is a deception.',
        pl: '"Allusion" to aluzja. "Illusion" to iluzja.',
        de: '"Allusion" ist eine Anspielung. "Illusion" ist eine Täuschung.',
      },
    },
    {
      id: 13,
      type: 'context',
      difficulty: 2,
      tags: ['business'],
      sentence_part1: 'The new manager is very',
      sentence_part2: 'about meeting the quarterly deadlines.',
      options: [
        {
          text: 'anxious',
          isCorrect: true,
        },
        {
          text: 'anxous',
          isCorrect: false,
        },
        {
          text: 'anxtious',
          isCorrect: false,
        },
        {
          text: 'ankshous',
          isCorrect: false,
        },
      ],
      hint: {
        en: '"Anxious" comes from anxiety, spelled with x and ious.',
        pl: '"Anxious" (niespokojny) piszemy z x oraz ious.',
        de: '"Anxious" (besorgt) schreibt man mit x und ious.',
      },
    },
    {
      id: 14,
      type: 'context',
      difficulty: 2,
      tags: ['everyday'],
      sentence_part1: 'Please do not',
      sentence_part2: 'to contact me if you have any questions.',
      options: [
        {
          text: 'hesitate',
          isCorrect: true,
        },
        {
          text: 'hezitate',
          isCorrect: false,
        },
        {
          text: 'hesitat',
          isCorrect: false,
        },
        {
          text: 'hesitatee',
          isCorrect: false,
        },
      ],
      hint: {
        en: '"Hesitate" means to pause before saying or doing something.',
        pl: '"Hesitate" oznacza wahać się.',
        de: '"Hesitate" bedeutet zögern.',
      },
    },
    {
      id: 15,
      type: 'context',
      difficulty: 1,
      tags: ['business'],
      sentence_part1: 'Please review the',
      sentence_part2: 'before our call tomorrow.',
      options: [
        { text: 'attachment', isCorrect: true },
        { text: 'attatchment', isCorrect: false },
        { text: 'atachment', isCorrect: false },
        { text: 'attachement', isCorrect: false },
      ],
      hint: {
        en: '"Attachment" — double t, single ch, ends in -ment.',
        pl: 'załącznik — podwójne t, pojedyncze ch, kończy się na -ment.',
      },
    },
    {
      id: 16,
      type: 'context',
      difficulty: 2,
      tags: ['medicine'],
      sentence_part1: 'The patient presents with',
      sentence_part2: 'and reports frequent headaches.',
      options: [
        { text: 'hypertension', isCorrect: true },
        { text: 'hypertention', isCorrect: false },
        { text: 'hipertension', isCorrect: false },
        { text: 'hyperttension', isCorrect: false },
      ],
      hint: {
        en: '"Hypertension" — from Greek "hyper" + "tension", spelled with -sion not -tion.',
        pl: 'nadciśnienie — kończy się na -sion, nie -tion.',
      },
    },
    {
      id: 17,
      type: 'context',
      difficulty: 3,
      tags: ['business'],
      sentence_part1:
        'Under Article 42 of the Labor Law, an employee may receive',
      sentence_part2: 'for occupational health damages.',
      options: [
        { text: 'compensation', isCorrect: true },
        { text: 'compensetion', isCorrect: false },
        { text: 'compensasion', isCorrect: false },
        { text: 'compansation', isCorrect: false },
      ],
      hint: {
        en: '"Compensation" — from "compensate" + -ion, with e not a in the middle syllable.',
        pl: 'odszkodowanie — od "compensate", z e nie a.',
      },
    },
  ],
  clock: [
    {
      id: 1,
      type: 'clock',
      difficulty: 3,
      timeAnalog: 'Seventeen minutes past eight in the evening',
      isNight: true,
      hourRotation: 248,
      minuteRotation: 102,
      options: [
        {
          text: '8:17 PM',
          isCorrect: true,
        },
        {
          text: '8:17 AM',
          isCorrect: false,
        },
        {
          text: '3:40 PM',
          isCorrect: false,
        },
        {
          text: '7:17 PM',
          isCorrect: false,
        },
      ],
    },
    {
      id: 2,
      type: 'clock',
      difficulty: 3,
      timeAnalog: 'Nine minutes to two in the afternoon',
      isNight: false,
      hourRotation: 55,
      minuteRotation: 306,
      options: [
        {
          text: '1:51 PM',
          isCorrect: true,
        },
        {
          text: '1:51 AM',
          isCorrect: false,
        },
        {
          text: '10:05 PM',
          isCorrect: false,
        },
        {
          text: '2:51 PM',
          isCorrect: false,
        },
      ],
    },
    {
      id: 3,
      type: 'clock',
      difficulty: 1,
      timeAnalog: 'Quarter past three in the afternoon',
      isNight: false,
      hourRotation: 98,
      minuteRotation: 90,
      options: [
        {
          text: '3:15 PM',
          isCorrect: true,
        },
        {
          text: '3:15 AM',
          isCorrect: false,
        },
        {
          text: '3:03 PM',
          isCorrect: false,
        },
        {
          text: '4:15 PM',
          isCorrect: false,
        },
      ],
    },
    {
      id: 4,
      type: 'clock',
      difficulty: 1,
      timeAnalog: 'Half past six in the evening',
      isNight: true,
      hourRotation: 195,
      minuteRotation: 180,
      options: [
        {
          text: '6:30 PM',
          isCorrect: true,
        },
        {
          text: '6:30 AM',
          isCorrect: false,
        },
        {
          text: '6:06 PM',
          isCorrect: false,
        },
        {
          text: '7:30 PM',
          isCorrect: false,
        },
      ],
    },
    {
      id: 5,
      type: 'clock',
      difficulty: 1,
      timeAnalog: 'Ten to ten in the morning',
      isNight: false,
      hourRotation: 295,
      minuteRotation: 300,
      options: [
        {
          text: '9:50 AM',
          isCorrect: true,
        },
        {
          text: '9:50 PM',
          isCorrect: false,
        },
        {
          text: '10:50 AM',
          isCorrect: false,
        },
        {
          text: '9:10 AM',
          isCorrect: false,
        },
      ],
    },
    {
      id: 6,
      type: 'clock',
      difficulty: 1,
      timeAnalog: 'Noon',
      isNight: false,
      hourRotation: 0,
      minuteRotation: 0,
      options: [
        {
          text: '12:00 PM',
          isCorrect: true,
        },
        {
          text: '12:00 AM',
          isCorrect: false,
        },
        {
          text: '12:30 PM',
          isCorrect: false,
        },
        {
          text: '6:00 PM',
          isCorrect: false,
        },
      ],
    },
    {
      id: 7,
      type: 'clock',
      difficulty: 1,
      timeAnalog: 'Midnight',
      isNight: true,
      hourRotation: 0,
      minuteRotation: 0,
      options: [
        {
          text: '12:00 AM',
          isCorrect: true,
        },
        {
          text: '12:00 PM',
          isCorrect: false,
        },
        {
          text: '12:12 AM',
          isCorrect: false,
        },
        {
          text: '6:00 AM',
          isCorrect: false,
        },
      ],
    },
    {
      id: 8,
      type: 'clock',
      difficulty: 2,
      timeAnalog: 'Quarter to nine in the evening',
      isNight: true,
      hourRotation: 262,
      minuteRotation: 270,
      options: [
        {
          text: '8:45 PM',
          isCorrect: true,
        },
        {
          text: '8:45 AM',
          isCorrect: false,
        },
        {
          text: '9:45 PM',
          isCorrect: false,
        },
        {
          text: '9:40 PM',
          isCorrect: false,
        },
      ],
    },
    {
      id: 9,
      type: 'clock',
      difficulty: 1,
      timeAnalog: 'Twenty past four in the afternoon',
      isNight: false,
      hourRotation: 130,
      minuteRotation: 120,
      options: [
        {
          text: '4:20 PM',
          isCorrect: true,
        },
        {
          text: '4:20 AM',
          isCorrect: false,
        },
        {
          text: '4:04 PM',
          isCorrect: false,
        },
        {
          text: '8:16 PM',
          isCorrect: false,
        },
      ],
    },
    {
      id: 10,
      type: 'clock',
      difficulty: 1,
      timeAnalog: 'Half past eight in the morning',
      isNight: false,
      hourRotation: 255,
      minuteRotation: 180,
      options: [
        {
          text: '8:30 AM',
          isCorrect: true,
        },
        {
          text: '8:30 PM',
          isCorrect: false,
        },
        {
          text: '6:40 AM',
          isCorrect: false,
        },
        {
          text: '9:30 AM',
          isCorrect: false,
        },
      ],
    },
    {
      id: 11,
      type: 'clock',
      difficulty: 2,
      timeAnalog: 'Quarter to eight in the morning',
      isNight: false,
      hourRotation: 232,
      minuteRotation: 270,
      options: [
        {
          text: '7:45 AM',
          isCorrect: true,
        },
        {
          text: '7:45 PM',
          isCorrect: false,
        },
        {
          text: '8:45 AM',
          isCorrect: false,
        },
        {
          text: '7:09 AM',
          isCorrect: false,
        },
      ],
    },
    {
      id: 12,
      type: 'clock',
      difficulty: 2,
      timeAnalog: 'Twenty past two in the afternoon',
      isNight: false,
      hourRotation: 70,
      minuteRotation: 120,
      options: [
        {
          text: '2:20 PM',
          isCorrect: true,
        },
        {
          text: '2:20 AM',
          isCorrect: false,
        },
        {
          text: '2:04 PM',
          isCorrect: false,
        },
        {
          text: '4:10 PM',
          isCorrect: false,
        },
      ],
    },
    {
      id: 13,
      type: 'clock',
      difficulty: 3,
      timeAnalog: 'Five past eleven at night',
      isNight: true,
      hourRotation: 332,
      minuteRotation: 30,
      options: [
        {
          text: '11:05 PM',
          isCorrect: true,
        },
        {
          text: '11:05 AM',
          isCorrect: false,
        },
        {
          text: '11:01 PM',
          isCorrect: false,
        },
        {
          text: '1:55 AM',
          isCorrect: false,
        },
      ],
    },
    {
      id: 14,
      type: 'clock',
      difficulty: 1,
      timeAnalog: 'Quarter past nine in the morning',
      isNight: false,
      hourRotation: 278,
      minuteRotation: 90,
      options: [
        {
          text: '9:15 AM',
          isCorrect: true,
        },
        {
          text: '9:15 PM',
          isCorrect: false,
        },
        {
          text: '9:03 AM',
          isCorrect: false,
        },
        {
          text: '3:45 AM',
          isCorrect: false,
        },
      ],
    },
    {
      id: 15,
      type: 'clock',
      difficulty: 2,
      timeAnalog: 'Ten to nine in the evening',
      isNight: true,
      hourRotation: 265,
      minuteRotation: 300,
      options: [
        {
          text: '8:50 PM',
          isCorrect: true,
        },
        {
          text: '8:50 AM',
          isCorrect: false,
        },
        {
          text: '9:50 PM',
          isCorrect: false,
        },
        {
          text: '10:40 PM',
          isCorrect: false,
        },
      ],
    },
  ],
  sequences: [
    {
      id: 1,
      type: 'sequence',
      difficulty: 3,
      tags: ['business'],
      instruction: 'Order the steps of a professional negotiation',
      scrambled: [
        'Preparation',
        'Proposing and bargaining',
        'Closing and commitment',
        'Information exchange',
      ],
      correct: [
        'Preparation',
        'Information exchange',
        'Proposing and bargaining',
        'Closing and commitment',
      ],
    },
    {
      id: 2,
      type: 'sequence',
      difficulty: 3,
      instruction: 'Order the software development life cycle (SDLC)',
      scrambled: [
        'Deployment',
        'Design',
        'Requirements Analysis',
        'Testing',
        'Implementation',
      ],
      correct: [
        'Requirements Analysis',
        'Design',
        'Implementation',
        'Testing',
        'Deployment',
      ],
    },
    {
      id: 3,
      type: 'sequence',
      difficulty: 1,
      instruction: 'Order the workdays of the week',
      scrambled: ['Wednesday', 'Monday', 'Thursday', 'Tuesday', 'Friday'],
      correct: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    },
    {
      id: 4,
      type: 'sequence',
      difficulty: 2,
      instruction: 'Order the months of Q4',
      scrambled: ['December', 'October', 'November'],
      correct: ['October', 'November', 'December'],
    },
    {
      id: 5,
      type: 'sequence',
      difficulty: 2,
      tags: ['business'],
      instruction: 'Order these career stages from entry to senior',
      scrambled: ['Manager', 'Intern', 'Director', 'Specialist'],
      correct: ['Intern', 'Specialist', 'Manager', 'Director'],
    },
    {
      id: 6,
      type: 'sequence',
      difficulty: 2,
      tags: ['business'],
      instruction: 'Standard meeting agenda order',
      scrambled: [
        'Any Other Business (AOB)',
        'Welcome and Introductions',
        'Adjournment',
        'Reviewing past minutes',
        'New business',
      ],
      correct: [
        'Welcome and Introductions',
        'Reviewing past minutes',
        'New business',
        'Any Other Business (AOB)',
        'Adjournment',
      ],
    },
    {
      id: 7,
      type: 'sequence',
      difficulty: 1,
      instruction: 'Order the time units from shortest to longest',
      scrambled: ['Hour', 'Second', 'Day', 'Minute'],
      correct: ['Second', 'Minute', 'Hour', 'Day'],
    },
    {
      id: 8,
      type: 'sequence',
      difficulty: 1,
      instruction: 'Order these letters alphabetically',
      scrambled: ['F', 'B', 'D', 'H'],
      correct: ['B', 'D', 'F', 'H'],
    },
    {
      id: 9,
      type: 'sequence',
      difficulty: 2,
      tags: ['business'],
      instruction: 'Order the sales funnel steps',
      scrambled: ['Lead', 'Prospect', 'Customer', 'Visitor'],
      correct: ['Visitor', 'Lead', 'Prospect', 'Customer'],
    },
    {
      id: 10,
      type: 'sequence',
      difficulty: 1,
      instruction: 'Order the numbers from smallest to largest',
      scrambled: ['1000', '10', '100', '10000'],
      correct: ['10', '100', '1000', '10000'],
    },
  ],
  memorySpan: [
    {
      id: 1,
      type: 'memorySpan',
      difficulty: 1,
      instruction:
        'Memorize the order of the words, then recreate it from memory',
      displayItems: ['Budget', 'Team', 'Deadline'],
      correct: ['Budget', 'Team', 'Deadline'],
      scrambled: ['Deadline', 'Budget', 'Team'],
    },
    {
      id: 2,
      type: 'memorySpan',
      difficulty: 2,
      instruction:
        'Memorize the order of the words, then recreate it from memory',
      displayItems: ['Invoice', 'Client', 'Contract', 'Meeting'],
      correct: ['Invoice', 'Client', 'Contract', 'Meeting'],
      scrambled: ['Contract', 'Invoice', 'Meeting', 'Client'],
    },
    {
      id: 3,
      type: 'memorySpan',
      difficulty: 3,
      instruction:
        'Memorize the order of the words, then recreate it from memory',
      displayItems: ['Report', 'Budget', 'Strategy', 'Analysis', 'Rollout'],
      correct: ['Report', 'Budget', 'Strategy', 'Analysis', 'Rollout'],
      scrambled: [
        'Strategy',
        'Recruitment',
        'Rollout',
        'Report',
        'Analysis',
        'Budget',
      ],
    },
  ],
  tracking: [
    {
      id: 1,
      type: 'spatial',
      difficulty: 1,
      instruction: 'Where is the loop of this letter?',
      items: [
        {
          symbol: 'b',
          target: 'right',
        },
        {
          symbol: 'd',
          target: 'left',
        },
        {
          symbol: 'd',
          target: 'left',
        },
        {
          symbol: 'b',
          target: 'right',
        },
      ],
      options: [
        {
          label: 'Left ⬅️',
          value: 'left',
        },
        {
          label: 'Right ➡️',
          value: 'right',
        },
      ],
    },
    {
      id: 2,
      type: 'spatial',
      difficulty: 1,
      instruction: 'Which way does the arrow point?',
      items: [
        {
          symbol: '→',
          target: 'right',
        },
        {
          symbol: '←',
          target: 'left',
        },
        {
          symbol: '→',
          target: 'right',
        },
        {
          symbol: '←',
          target: 'left',
        },
      ],
      options: [
        {
          label: 'Left ⬅️',
          value: 'left',
        },
        {
          label: 'Right ➡️',
          value: 'right',
        },
      ],
    },
    {
      id: 3,
      type: 'spatial',
      difficulty: 2,
      instruction: 'Where is the loop of this letter?',
      items: [
        {
          symbol: 'p',
          target: 'right',
        },
        {
          symbol: 'q',
          target: 'left',
        },
        {
          symbol: 'p',
          target: 'right',
        },
        {
          symbol: 'q',
          target: 'left',
        },
      ],
      options: [
        {
          label: 'Left ⬅️',
          value: 'left',
        },
        {
          label: 'Right ➡️',
          value: 'right',
        },
      ],
    },
    {
      id: 4,
      type: 'spatial',
      difficulty: 1,
      instruction: 'Point to the direction the hand is pointing',
      items: [
        {
          symbol: '👉',
          target: 'right',
        },
        {
          symbol: '👈',
          target: 'left',
        },
        {
          symbol: '👉',
          target: 'right',
        },
        {
          symbol: '👈',
          target: 'left',
        },
      ],
      options: [
        {
          label: 'Left ⬅️',
          value: 'left',
        },
        {
          label: 'Right ➡️',
          value: 'right',
        },
      ],
    },
    {
      id: 5,
      type: 'spatial',
      difficulty: 2,
      instruction: 'Where is the loop of this letter?',
      items: [
        {
          symbol: 'q',
          target: 'left',
        },
        {
          symbol: 'p',
          target: 'right',
        },
        {
          symbol: 'p',
          target: 'right',
        },
        {
          symbol: 'q',
          target: 'left',
        },
      ],
      options: [
        {
          label: 'Left ⬅️',
          value: 'left',
        },
        {
          label: 'Right ➡️',
          value: 'right',
        },
      ],
    },
    {
      id: 6,
      type: 'spatial',
      difficulty: 1,
      instruction: 'Which way does the arrow point?',
      items: [
        {
          symbol: '◁',
          target: 'left',
        },
        {
          symbol: '▷',
          target: 'right',
        },
        {
          symbol: '▷',
          target: 'right',
        },
        {
          symbol: '◁',
          target: 'left',
        },
      ],
      options: [
        {
          label: 'Left ⬅️',
          value: 'left',
        },
        {
          label: 'Right ➡️',
          value: 'right',
        },
      ],
    },
    {
      id: 7,
      type: 'spatial',
      difficulty: 2,
      instruction: 'Find the odd letter out',
      items: [
        {
          symbol: 'm',
          target: 'down',
        },
        {
          symbol: 'w',
          target: 'up',
        },
        {
          symbol: 'w',
          target: 'up',
        },
        {
          symbol: 'm',
          target: 'down',
        },
      ],
      options: [
        {
          label: 'm (down)',
          value: 'down',
        },
        {
          label: 'w (up)',
          value: 'up',
        },
      ],
    },
    {
      id: 8,
      type: 'spatial',
      difficulty: 1,
      instruction: 'Uppercase or lowercase?',
      items: [
        {
          symbol: 'A',
          target: 'up',
        },
        {
          symbol: 'b',
          target: 'down',
        },
        {
          symbol: 'C',
          target: 'up',
        },
        {
          symbol: 'd',
          target: 'down',
        },
      ],
      options: [
        {
          label: 'Uppercase 🔠',
          value: 'up',
        },
        {
          label: 'Lowercase 🔡',
          value: 'down',
        },
      ],
    },
    {
      id: 9,
      type: 'spatial',
      difficulty: 2,
      instruction:
        'Turn signal in the company car — which way are you turning?',
      items: [
        { symbol: '➡️', target: 'right' },
        { symbol: '⬅️', target: 'left' },
        { symbol: '⬅️', target: 'left' },
        { symbol: '➡️', target: 'right' },
        { symbol: '⬅️', target: 'left' },
      ],
      options: [
        { label: 'Left ⬅️', value: 'left' },
        { label: 'Right ➡️', value: 'right' },
      ],
    },
    {
      id: 10,
      type: 'spatial',
      difficulty: 2,
      instruction:
        'GPS arrow on the way to a client — which way does the route go?',
      items: [
        { symbol: '←', target: 'left' },
        { symbol: '→', target: 'right' },
        { symbol: '→', target: 'right' },
        { symbol: '←', target: 'left' },
        { symbol: '→', target: 'right' },
      ],
      options: [
        { label: 'Left ⬅️', value: 'left' },
        { label: 'Right ➡️', value: 'right' },
      ],
    },
    {
      id: 11,
      type: 'spatial',
      difficulty: 3,
      instruction:
        'On the org chart, the arrow shows who a department reports to — which way does it point?',
      items: [
        { symbol: '◁', target: 'left' },
        { symbol: '▷', target: 'right' },
        { symbol: '◁', target: 'left' },
        { symbol: '▷', target: 'right' },
        { symbol: '▷', target: 'right' },
      ],
      options: [
        { label: 'Left ⬅️', value: 'left' },
        { label: 'Right ➡️', value: 'right' },
      ],
    },
    {
      id: 12,
      type: 'spatial',
      difficulty: 3,
      instruction: 'This document marks where to sign — which side is it on?',
      items: [
        { symbol: '➡️', target: 'right' },
        { symbol: '➡️', target: 'right' },
        { symbol: '⬅️', target: 'left' },
        { symbol: '➡️', target: 'right' },
        { symbol: '⬅️', target: 'left' },
      ],
      options: [
        { label: 'Left ⬅️', value: 'left' },
        { label: 'Right ➡️', value: 'right' },
      ],
    },
    {
      id: 13,
      type: 'spatial',
      difficulty: 2,
      instruction: 'Where is the loop of this number — top or bottom?',
      items: [
        { symbol: '6', target: 'down' },
        { symbol: '9', target: 'up' },
        { symbol: '6', target: 'down' },
        { symbol: '9', target: 'up' },
        { symbol: '6', target: 'down' },
      ],
      options: [
        { label: 'Top 🔼', value: 'up' },
        { label: 'Bottom 🔽', value: 'down' },
      ],
    },
  ],
  lcwc: [
    {
      id: 1,
      type: 'lookCoverWriteCheck',
      lcwc: true,
      difficulty: 3,
      word: 'Sustainability',
    },
    {
      id: 2,
      type: 'lookCoverWriteCheck',
      lcwc: true,
      difficulty: 3,
      word: 'Perseverance',
    },
    {
      id: 3,
      type: 'lookCoverWriteCheck',
      lcwc: true,
      difficulty: 2,
      word: 'Accommodation',
    },
    {
      id: 4,
      type: 'lookCoverWriteCheck',
      lcwc: true,
      difficulty: 2,
      word: 'Recommendation',
    },
    {
      id: 5,
      type: 'lookCoverWriteCheck',
      lcwc: true,
      difficulty: 3,
      word: 'Embarrassment',
    },
    {
      id: 6,
      type: 'lookCoverWriteCheck',
      lcwc: true,
      difficulty: 3,
      word: 'Occurrence',
    },
    {
      id: 7,
      type: 'lookCoverWriteCheck',
      lcwc: true,
      difficulty: 2,
      word: 'Necessary',
    },
    {
      id: 8,
      type: 'lookCoverWriteCheck',
      lcwc: true,
      difficulty: 2,
      word: 'Privilege',
    },
    {
      id: 9,
      type: 'lookCoverWriteCheck',
      lcwc: true,
      difficulty: 3,
      word: 'Questionnaire',
    },
    {
      id: 10,
      type: 'lookCoverWriteCheck',
      lcwc: true,
      difficulty: 3,
      word: 'Pronunciation',
    },
    {
      id: 11,
      type: 'lookCoverWriteCheck',
      lcwc: true,
      difficulty: 3,
      word: 'Entrepreneur',
    },
    {
      id: 12,
      type: 'lookCoverWriteCheck',
      lcwc: true,
      difficulty: 3,
      word: 'Simultaneously',
    },
  ],
  categorization: [
    {
      id: 1,
      type: 'categorization',
      difficulty: 3,
      instruction: 'Categorize these cognitive biases',
      buckets: [
        {
          id: 'social',
          label: 'Social Biases',
          icon: '👥',
        },
        {
          id: 'memory',
          label: 'Memory Biases',
          icon: '🧠',
        },
      ],
      items: [
        {
          id: 'i1',
          word: 'Groupthink',
          bucketId: 'social',
        },
        {
          id: 'i2',
          word: 'Hindsight bias',
          bucketId: 'memory',
        },
        {
          id: 'i3',
          word: 'Bandwagon effect',
          bucketId: 'social',
        },
        {
          id: 'i4',
          word: 'Misinformation effect',
          bucketId: 'memory',
        },
      ],
    },
    {
      id: 2,
      type: 'categorization',
      difficulty: 1,
      tags: ['business'],
      instruction: 'Assign words to the correct department',
      buckets: [
        {
          id: 'hr',
          label: 'HR',
          icon: '👥',
        },
        {
          id: 'fin',
          label: 'Finance',
          icon: '💰',
        },
      ],
      items: [
        {
          id: 'i1',
          word: 'Budget',
          bucketId: 'fin',
        },
        {
          id: 'i2',
          word: 'Recruitment',
          bucketId: 'hr',
        },
        {
          id: 'i3',
          word: 'Invoice',
          bucketId: 'fin',
        },
        {
          id: 'i4',
          word: 'Vacations',
          bucketId: 'hr',
        },
      ],
    },
    {
      id: 3,
      type: 'categorization',
      difficulty: 2,
      instruction: 'Assign words to the correct part of speech',
      buckets: [
        {
          id: 'noun',
          label: 'Noun (Thing)',
          icon: '📦',
        },
        {
          id: 'verb',
          label: 'Verb (Action)',
          icon: '🏃',
        },
      ],
      items: [
        {
          id: 'i1',
          word: 'Meeting',
          bucketId: 'noun',
        },
        {
          id: 'i2',
          word: 'Analyze',
          bucketId: 'verb',
        },
        {
          id: 'i3',
          word: 'Decision',
          bucketId: 'noun',
        },
        {
          id: 'i4',
          word: 'Calculate',
          bucketId: 'verb',
        },
      ],
    },
    {
      id: 4,
      type: 'categorization',
      difficulty: 2,
      instruction: 'Assign words to the correct spelling rule',
      buckets: [
        {
          id: 'ie',
          label: 'Spelled with IE',
          icon: '📝',
        },
        {
          id: 'ei',
          label: 'Spelled with EI',
          icon: '📝',
        },
      ],
      items: [
        {
          id: 'i1',
          word: 'Believe',
          bucketId: 'ie',
        },
        {
          id: 'i2',
          word: 'Receive',
          bucketId: 'ei',
        },
        {
          id: 'i3',
          word: 'Achieve',
          bucketId: 'ie',
        },
        {
          id: 'i4',
          word: 'Deceive',
          bucketId: 'ei',
        },
      ],
    },
    {
      id: 5,
      type: 'categorization',
      difficulty: 1,
      instruction: 'Categorize by word type',
      buckets: [
        {
          id: 'adj',
          label: 'Adjective',
          icon: '✨',
        },
        {
          id: 'adv',
          label: 'Adverb',
          icon: '🏃',
        },
      ],
      items: [
        {
          id: 'i1',
          word: 'Quick',
          bucketId: 'adj',
        },
        {
          id: 'i2',
          word: 'Quickly',
          bucketId: 'adv',
        },
        {
          id: 'i3',
          word: 'Happy',
          bucketId: 'adj',
        },
        {
          id: 'i4',
          word: 'Happily',
          bucketId: 'adv',
        },
      ],
    },
    {
      id: 6,
      type: 'categorization',
      difficulty: 2,
      instruction: 'Categorize homophones',
      buckets: [
        {
          id: 'place',
          label: 'Location/Place',
          icon: '📍',
        },
        {
          id: 'pos',
          label: 'Possession',
          icon: '👥',
        },
      ],
      items: [
        {
          id: 'i1',
          word: 'There',
          bucketId: 'place',
        },
        {
          id: 'i2',
          word: 'Their',
          bucketId: 'pos',
        },
        {
          id: 'i3',
          word: 'Here',
          bucketId: 'place',
        },
        {
          id: 'i4',
          word: 'Our',
          bucketId: 'pos',
        },
      ],
    },
    {
      id: 7,
      type: 'categorization',
      difficulty: 3,
      instruction: 'Categorize prefixes and suffixes',
      buckets: [
        {
          id: 'pre',
          label: 'Prefix',
          icon: '⬅️',
        },
        {
          id: 'suf',
          label: 'Suffix',
          icon: '➡️',
        },
      ],
      items: [
        {
          id: 'i1',
          word: 'Un-',
          bucketId: 'pre',
        },
        {
          id: 'i2',
          word: '-ment',
          bucketId: 'suf',
        },
        {
          id: 'i3',
          word: 'Re-',
          bucketId: 'pre',
        },
        {
          id: 'i4',
          word: '-tion',
          bucketId: 'suf',
        },
      ],
    },
    {
      id: 8,
      type: 'categorization',
      difficulty: 1,
      instruction: 'Categorize by double letters',
      buckets: [
        {
          id: 'double',
          label: 'Double Letter',
          icon: '🔠',
        },
        {
          id: 'single',
          label: 'Single Letter',
          icon: '🔡',
        },
      ],
      items: [
        {
          id: 'i1',
          word: 'Apple',
          bucketId: 'double',
        },
        {
          id: 'i2',
          word: 'Banana',
          bucketId: 'single',
        },
        {
          id: 'i3',
          word: 'Letter',
          bucketId: 'double',
        },
        {
          id: 'i4',
          word: 'Word',
          bucketId: 'single',
        },
      ],
    },
    {
      id: 9,
      type: 'categorization',
      difficulty: 2,
      instruction: 'Categorize by business department',
      buckets: [
        {
          id: 'it',
          label: 'IT',
          icon: '💻',
        },
        {
          id: 'sales',
          label: 'Sales',
          icon: '📈',
        },
      ],
      items: [
        {
          id: 'i1',
          word: 'Server',
          bucketId: 'it',
        },
        {
          id: 'i2',
          word: 'Revenue',
          bucketId: 'sales',
        },
        {
          id: 'i3',
          word: 'Database',
          bucketId: 'it',
        },
        {
          id: 'i4',
          word: 'Lead',
          bucketId: 'sales',
        },
      ],
    },
    {
      id: 10,
      type: 'categorization',
      difficulty: 1,
      instruction: 'Categorize by time',
      buckets: [
        {
          id: 'past',
          label: 'Past',
          icon: '⏪',
        },
        {
          id: 'future',
          label: 'Future',
          icon: '⏩',
        },
      ],
      items: [
        {
          id: 'i1',
          word: 'Yesterday',
          bucketId: 'past',
        },
        {
          id: 'i2',
          word: 'Tomorrow',
          bucketId: 'future',
        },
        {
          id: 'i3',
          word: 'Previously',
          bucketId: 'past',
        },
        {
          id: 'i4',
          word: 'Soon',
          bucketId: 'future',
        },
      ],
    },
    {
      id: 11,
      type: 'categorization',
      difficulty: 1,
      instruction: 'Fruit or Vegetable?',
      buckets: [
        {
          id: 'fruit',
          label: 'Fruit',
          icon: '🍎',
        },
        {
          id: 'veg',
          label: 'Vegetable',
          icon: '🥕',
        },
      ],
      items: [
        {
          id: 'i1',
          word: 'Apple',
          bucketId: 'fruit',
        },
        {
          id: 'i2',
          word: 'Carrot',
          bucketId: 'veg',
        },
        {
          id: 'i3',
          word: 'Pear',
          bucketId: 'fruit',
        },
        {
          id: 'i4',
          word: 'Onion',
          bucketId: 'veg',
        },
      ],
    },
    {
      id: 12,
      type: 'categorization',
      difficulty: 2,
      instruction: 'Positive or Negative?',
      buckets: [
        {
          id: 'pos',
          label: 'Positive',
          icon: '👍',
        },
        {
          id: 'neg',
          label: 'Negative',
          icon: '👎',
        },
      ],
      items: [
        {
          id: 'i1',
          word: 'Success',
          bucketId: 'pos',
        },
        {
          id: 'i2',
          word: 'Failure',
          bucketId: 'neg',
        },
        {
          id: 'i3',
          word: 'Profit',
          bucketId: 'pos',
        },
        {
          id: 'i4',
          word: 'Loss',
          bucketId: 'neg',
        },
      ],
    },
  ],
  dictation: [
    {
      id: 1,
      type: 'dictation',
      dictation: true,
      difficulty: 3,
      audioPrompt:
        'Continuous learning is essential in a rapidly evolving professional landscape.',
      correct:
        'Continuous learning is essential in a rapidly evolving professional landscape',
    },
    {
      id: 2,
      type: 'dictation',
      dictation: true,
      difficulty: 1,
      audioPrompt: 'The meeting is scheduled for tomorrow.',
      correct: 'The meeting is scheduled for tomorrow',
    },
    {
      id: 3,
      type: 'dictation',
      dictation: true,
      difficulty: 2,
      audioPrompt: 'Please review the attached document.',
      correct: 'Please review the attached document',
    },
    {
      id: 4,
      type: 'dictation',
      dictation: true,
      difficulty: 2,
      audioPrompt: 'The company has seen significant growth.',
      correct: 'The company has seen significant growth',
    },
    {
      id: 5,
      type: 'dictation',
      dictation: true,
      difficulty: 2,
      audioPrompt: 'We need to update the project timeline.',
      correct: 'We need to update the project timeline',
    },
    {
      id: 6,
      type: 'dictation',
      dictation: true,
      difficulty: 3,
      audioPrompt: 'It is necessary to accommodate their request.',
      correct: 'It is necessary to accommodate their request',
    },
    {
      id: 7,
      type: 'dictation',
      dictation: true,
      difficulty: 2,
      audioPrompt: 'The committee reached a unanimous decision.',
      correct: 'The committee reached a unanimous decision',
    },
    {
      id: 8,
      type: 'dictation',
      dictation: true,
      difficulty: 2,
      audioPrompt: 'Their knowledge of the subject is thorough.',
      correct: 'Their knowledge of the subject is thorough',
    },
    {
      id: 9,
      type: 'dictation',
      dictation: true,
      difficulty: 3,
      audioPrompt: 'The principal addressed the new principle.',
      correct: 'The principal addressed the new principle',
    },
    {
      id: 10,
      type: 'dictation',
      dictation: true,
      difficulty: 2,
      audioPrompt: 'I can definitely recommend this strategy.',
      correct: 'I can definitely recommend this strategy',
    },
    {
      id: 11,
      type: 'dictation',
      dictation: true,
      difficulty: 2,
      audioPrompt: 'The invoice must be paid by Friday.',
      correct: 'The invoice must be paid by Friday',
    },
    {
      id: 12,
      type: 'dictation',
      dictation: true,
      difficulty: 3,
      audioPrompt: 'The results of the analysis were very surprising.',
      correct: 'The results of the analysis were very surprising',
    },
    {
      id: 13,
      type: 'dictation',
      dictation: true,
      focus: 'substitution',
      difficulty: 2,
      instruction: 'Change the sound and give the new word',
      audioPrompt:
        'Change the first sound in the word cat to h. What word do you get?',
      correct: 'hat',
    },
    {
      id: 14,
      type: 'dictation',
      dictation: true,
      focus: 'substitution',
      difficulty: 3,
      instruction: 'Change the sound and give the new word',
      audioPrompt:
        'Change the last sound in the word bat to g. What word do you get?',
      correct: 'bag',
    },
    {
      id: 15,
      type: 'dictation',
      dictation: true,
      focus: 'substitution',
      difficulty: 4,
      instruction: 'Change the sound and give the new word',
      audioPrompt:
        'In the word pin, change the vowel sound to get pan. Say the new word.',
      correct: 'pan',
    },
    {
      id: 16,
      type: 'dictation',
      dictation: true,
      focus: 'deletion',
      difficulty: 2,
      instruction: 'Remove the sound and give the new word',
      audioPrompt:
        'Remove the first sound from the word start. What word do you get?',
      correct: 'tart',
    },
    {
      id: 17,
      type: 'dictation',
      dictation: true,
      focus: 'deletion',
      difficulty: 3,
      instruction: 'Remove the sound and give the new word',
      audioPrompt:
        'Remove the first sound from the word stop. What word do you get?',
      correct: 'top',
    },
    {
      id: 18,
      type: 'dictation',
      dictation: true,
      focus: 'deletion',
      difficulty: 4,
      instruction: 'Remove the sound and give the new word',
      audioPrompt:
        'Remove the sound l from the word clamp. What word do you get?',
      correct: 'camp',
    },
    {
      id: 19,
      type: 'dictation',
      dictation: true,
      focus: 'reversal',
      difficulty: 2,
      instruction: 'Say the word backwards (sound by sound)',
      audioPrompt: 'Say the word level backwards, sound by sound.',
      correct: 'level',
    },
    {
      id: 20,
      type: 'dictation',
      dictation: true,
      focus: 'reversal',
      difficulty: 3,
      instruction: 'Say the word backwards (sound by sound)',
      audioPrompt: 'Say the word top backwards, sound by sound.',
      correct: 'pot',
    },
    {
      id: 21,
      type: 'dictation',
      dictation: true,
      focus: 'reversal',
      difficulty: 4,
      instruction: 'Say the word backwards (sound by sound)',
      audioPrompt: 'Say the word desserts backwards, sound by sound.',
      correct: 'stressed',
    },
    {
      id: 22,
      type: 'dictation',
      dictation: true,
      focus: 'acrostic',
      difficulty: 2,
      instruction: 'Build a word from the first sounds',
      audioPrompt:
        'Take the first sound of each word: pen, igloo, giraffe. What word do they spell?',
      correct: 'pig',
    },
    {
      id: 23,
      type: 'dictation',
      dictation: true,
      focus: 'acrostic',
      difficulty: 3,
      instruction: 'Build a word from the first sounds',
      audioPrompt:
        'Take the first sound of each word: map, elephant, north, umbrella. What word do they spell?',
      correct: 'menu',
    },
    {
      id: 24,
      type: 'dictation',
      dictation: true,
      focus: 'acrostic',
      difficulty: 4,
      instruction: 'Build a word from the first sounds',
      audioPrompt:
        'Take the first sound of each word: apple, umbrella, dog, igloo, tiger. What word do they spell?',
      correct: 'audit',
    },
    {
      id: 25,
      type: 'dictation',
      dictation: true,
      focus: 'counting',
      difficulty: 2,
      instruction: 'Count how many times you hear this sound',
      audioPrompt:
        'How many times do you hear the sound a in the word banana? Give the number.',
      correct: '3',
    },
    {
      id: 26,
      type: 'dictation',
      dictation: true,
      focus: 'counting',
      difficulty: 3,
      instruction: 'Count how many times you hear this sound',
      audioPrompt:
        'How many times do you hear the sound s in the sentence: Simon sat on seven socks? Give the number.',
      correct: '4',
    },
    {
      id: 27,
      type: 'dictation',
      dictation: true,
      focus: 'counting',
      difficulty: 4,
      instruction: 'Count how many times you hear this sound',
      audioPrompt:
        'How many times do you hear the sound t in the sentence: Robert requested a correct format? Give the number.',
      correct: '4',
    },
    {
      id: 28,
      type: 'dictation',
      dictation: true,
      focus: 'wordChain',
      difficulty: 2,
      instruction: 'Give a word starting with the last sound',
      audioPrompt:
        'The word is cat. Give a new word that starts with the last sound of cat.',
      correct: ['table', 'time', 'team', 'task', 'tool'],
    },
    {
      id: 29,
      type: 'dictation',
      dictation: true,
      focus: 'wordChain',
      difficulty: 3,
      instruction: 'Give a word starting with the last sound',
      audioPrompt:
        'The word is plan. Give a new word that starts with the last sound of plan.',
      correct: ['network', 'notice', 'new', 'need', 'next'],
    },
    {
      id: 30,
      type: 'dictation',
      dictation: true,
      focus: 'wordChain',
      difficulty: 4,
      instruction: 'Give a word starting with the last sound',
      audioPrompt:
        'The word is process. Give a new word that starts with the last sound of process.',
      correct: ['system', 'strategy', 'service', 'staff', 'sector'],
    },
    {
      id: 31,
      type: 'dictation',
      dictation: true,
      focus: 'categoryRetrieval',
      difficulty: 2,
      instruction: 'Give a word matching the category and sound',
      audioPrompt: 'Name a profession that begins with the sound m.',
      correct: ['manager', 'mechanic', 'musician', 'meteorologist', 'mediator'],
    },
    {
      id: 32,
      type: 'dictation',
      dictation: true,
      focus: 'categoryRetrieval',
      difficulty: 3,
      instruction: 'Give a word matching the category and sound',
      audioPrompt: 'Name an emotion or state that begins with the sound f.',
      correct: ['frustrated', 'focused', 'flexible', 'fearless', 'fulfilled'],
    },
    {
      id: 33,
      type: 'dictation',
      dictation: true,
      focus: 'categoryRetrieval',
      difficulty: 4,
      instruction: 'Give a word matching the category and sound',
      audioPrompt: 'Name a business term that begins with the sound c.',
      correct: [
        'contract',
        'client',
        'capital',
        'cost',
        'competition',
        'crisis',
      ],
    },
    {
      id: 34,
      type: 'dictation',
      dictation: true,
      focus: 'syllableCount',
      difficulty: 2,
      instruction: 'Count how many syllables you hear in the word',
      audioPrompt:
        'How many syllables does the word budget have? Give the number.',
      correct: '2',
    },
    {
      id: 35,
      type: 'dictation',
      dictation: true,
      focus: 'syllableCount',
      difficulty: 3,
      instruction: 'Count how many syllables you hear in the word',
      audioPrompt:
        'How many syllables does the word management have? Give the number.',
      correct: '3',
    },
    {
      id: 36,
      type: 'dictation',
      dictation: true,
      focus: 'syllableCount',
      difficulty: 4,
      instruction: 'Count how many syllables you hear in the word',
      audioPrompt:
        'How many syllables does the word responsibility have? Give the number.',
      correct: '6',
    },
    {
      id: 37,
      type: 'dictation',
      dictation: true,
      focus: 'audioSpelling',
      difficulty: 2,
      instruction: 'Listen and type the correct spelling of the word',
      audioPrompt: 'Type the correct spelling of the word you hear: schedule.',
      correct: 'schedule',
    },
    {
      id: 38,
      type: 'dictation',
      dictation: true,
      focus: 'audioSpelling',
      difficulty: 3,
      instruction: 'Listen and type the correct spelling of the word',
      audioPrompt: 'Type the correct spelling of the word you hear: necessary.',
      correct: 'necessary',
    },
    {
      id: 39,
      type: 'dictation',
      dictation: true,
      focus: 'audioSpelling',
      difficulty: 4,
      instruction: 'Listen and type the correct spelling of the word',
      audioPrompt: 'Type the correct spelling of the word you hear: liaison.',
      correct: 'liaison',
    },
  ],
  readAloud: [
    {
      id: 1,
      type: 'readAloud',
      readAloud: true,
      difficulty: 1,
      text: 'Today is a very sunny and warm day.',
    },
    {
      id: 2,
      type: 'readAloud',
      readAloud: true,
      difficulty: 1,
      text: 'My little cat likes to sleep on the sofa in the living room.',
    },
    {
      id: 3,
      type: 'readAloud',
      readAloud: true,
      difficulty: 2,
      text: 'I read a very interesting book yesterday evening.',
    },
    {
      id: 4,
      type: 'readAloud',
      readAloud: true,
      difficulty: 2,
      text: 'The meeting with the new client has been rescheduled for tomorrow.',
    },
    {
      id: 5,
      type: 'readAloud',
      readAloud: true,
      difficulty: 3,
      text: 'Modern information technologies are developing at an incredible pace.',
    },
    {
      id: 6,
      type: 'readAloud',
      readAloud: true,
      difficulty: 3,
      text: 'The dedication of the entire team brought spectacular results in the last quarter.',
    },
    {
      id: 7,
      type: 'readAloud',
      readAloud: true,
      difficulty: 1,
      text: 'I drink hot tea with lemon first thing in the morning.',
    },
    {
      id: 8,
      type: 'readAloud',
      readAloud: true,
      difficulty: 2,
      text: 'A walk in the forest helps me relax and completely unwind.',
    },
    {
      id: 9,
      type: 'readAloud',
      readAloud: true,
      difficulty: 3,
      text: 'The implementation schedule for this ambitious project must be approved by the board.',
    },
    {
      id: 10,
      type: 'readAloud',
      readAloud: true,
      difficulty: 2,
      text: 'Every day I try to learn new and useful skills.',
    },
    {
      id: 11,
      type: 'readAloud',
      readAloud: true,
      difficulty: 3,
      text: 'The enterprise recorded an unprecedented increase in revenue within the financial services sector.',
    },
    {
      id: 12,
      type: 'readAloud',
      readAloud: true,
      difficulty: 1,
      text: 'On the weekend, I like to spend time with my family.',
    },
  ],
  diagnostic: [
    {
      id: 'en_diag_1',
      type: 'diagnostic',
      pillar: 'Literacy',
      difficulty: 4,
      focus: 'Diagnostic: Reading & Writing',
      question: {
        en: 'Read the following excerpt from a corporate email. Select the option that contains absolutely no orthographic, semantic, or homophone errors.',
      },
      options: [
        {
          text: "A. The principle reason for the board meeting is to ensure the new policy doesn't effect our profit margins.",
          isCorrect: false,
        },
        {
          text: "B. The principal reason for the broad meeting is to ensure the new policy doesn't affect our profit margins.",
          isCorrect: false,
        },
        {
          text: "C. The principal reason for the board meeting is to ensure the new policy doesn't affect our profit margins.",
          isCorrect: true,
        },
        {
          text: "D. The principal reason for the board meeting is to insure the new policy doesn't affect our profit margens.",
          isCorrect: false,
        },
      ],
    },
    {
      id: 'en_diag_2',
      type: 'diagnostic',
      pillar: 'Visual',
      difficulty: 4,
      focus: 'Diagnostic: Vision & Space',
      question: {
        en: 'Scan the provided data string of client request codes below.\n\n[ TRIAL-FORM-DISCREET | TRAIL-FROM-DISCRETE | TRIAL-FROM-DISCREET | TRAIL-FORM-DISCRETE ]\n\nA client submitted a "TRIAL" request "FROM" a "DISCREET" server. Which of the data clusters matches this exact sequence without any visual metathesis (swapping) or homophone errors?',
      },
      options: [
        {
          text: 'TRAIL-FROM-DISCRETE',
          isCorrect: false,
        },
        {
          text: 'TRIAL-FORM-DISCREET',
          isCorrect: false,
        },
        {
          text: 'TRIAL-FROM-DISCREET',
          isCorrect: true,
        },
        {
          text: 'TRAIL-FORM-DISCRETE',
          isCorrect: false,
        },
      ],
    },
    {
      id: 'en_diag_3',
      type: 'diagnostic',
      pillar: 'Cognitive',
      difficulty: 4,
      focus: 'Diagnostic: Logic & Memory',
      question: {
        en: "Evaluate the logical constraints of the following project deployment schedule:\n\nIf the design phase precedes the testing phase, the launch proceeds on Friday. If testing precedes design, the launch is delayed. The CEO mandates that testing must not precede design, but due to a scheduling error, the development team accidentally swapped the phases.\n\nBased on the CEO's mandate versus the team's actual sequence of actions, what is the ultimate operational outcome?",
      },
      options: [
        {
          text: 'The design phase precedes testing, so the launch proceeds on Friday.',
          isCorrect: false,
        },
        {
          text: 'Testing precedes design, therefore the launch is delayed.',
          isCorrect: true,
        },
        {
          text: 'The launch proceeds seamlessly because the CEO explicitly mandated it.',
          isCorrect: false,
        },
        {
          text: 'The testing phase is completely swapped with the final launch phase.',
          isCorrect: false,
        },
      ],
    },
    {
      id: 'en_diag_4',
      type: 'diagnostic',
      pillar: 'Literacy',
      difficulty: 3,
      focus: 'Diagnostic: Spelling',
      question: {
        en: 'Which of the following is spelled correctly?',
      },
      options: [
        {
          text: 'Accommodate',
          isCorrect: true,
        },
        {
          text: 'Accomodate',
          isCorrect: false,
        },
        {
          text: 'Acommodate',
          isCorrect: false,
        },
        {
          text: 'Acomodate',
          isCorrect: false,
        },
      ],
    },
    {
      id: 'en_diag_5',
      type: 'diagnostic',
      pillar: 'Visual',
      difficulty: 2,
      focus: 'Diagnostic: Visual Discrimination',
      question: {
        en: 'Identify the odd one out in this sequence:\n\n b b b d b b',
      },
      options: [
        {
          text: 'The 3rd letter',
          isCorrect: false,
        },
        {
          text: 'The 4th letter',
          isCorrect: true,
        },
        {
          text: 'The 5th letter',
          isCorrect: false,
        },
        {
          text: 'The 6th letter',
          isCorrect: false,
        },
      ],
    },
    {
      id: 'en_diag_6',
      type: 'diagnostic',
      pillar: 'Cognitive',
      difficulty: 3,
      focus: 'Diagnostic: Working Memory',
      question: {
        en: 'If the meeting is moved from 2 PM to 4 PM, and then delayed by another half hour, what time does it start?',
      },
      options: [
        {
          text: '4:00 PM',
          isCorrect: false,
        },
        {
          text: '4:30 PM',
          isCorrect: true,
        },
        {
          text: '2:30 PM',
          isCorrect: false,
        },
        {
          text: '5:00 PM',
          isCorrect: false,
        },
      ],
    },
    {
      id: 'en_diag_7',
      type: 'diagnostic',
      pillar: 'Literacy',
      difficulty: 2,
      focus: 'Diagnostic: Homophones',
      question: {
        en: 'Choose the correct word: "The dog wagged ___ tail."',
      },
      options: [
        {
          text: 'its',
          isCorrect: true,
        },
        {
          text: "it's",
          isCorrect: false,
        },
        {
          text: "its'",
          isCorrect: false,
        },
        {
          text: 'it',
          isCorrect: false,
        },
      ],
    },
    {
      id: 'en_diag_8',
      type: 'diagnostic',
      pillar: 'Visual',
      difficulty: 3,
      focus: 'Diagnostic: Letter Reversal',
      question: {
        en: 'Which word contains a reversed letter?\n\n m a r k e t i n g \n d e v e l o p m e n t \n s t r a t e q y \n c o m m i t t e e',
      },
      options: [
        {
          text: 'marketing',
          isCorrect: false,
        },
        {
          text: 'development',
          isCorrect: false,
        },
        {
          text: 'strateqy',
          isCorrect: true,
        },
        {
          text: 'committee',
          isCorrect: false,
        },
      ],
    },
    {
      id: 'en_diag_9',
      type: 'diagnostic',
      pillar: 'Cognitive',
      difficulty: 2,
      focus: 'Diagnostic: Categorization',
      question: {
        en: 'Which of the following does NOT belong in a group of financial terms?',
      },
      options: [
        {
          text: 'Budget',
          isCorrect: false,
        },
        {
          text: 'Invoice',
          isCorrect: false,
        },
        {
          text: 'Recruitment',
          isCorrect: true,
        },
        {
          text: 'Revenue',
          isCorrect: false,
        },
      ],
    },
    {
      id: 'en_diag_10',
      type: 'diagnostic',
      pillar: 'Literacy',
      difficulty: 3,
      focus: 'Diagnostic: Syllable Segmentation',
      question: {
        en: 'How many syllables are in the word "Responsibility"?',
      },
      options: [
        {
          text: '4',
          isCorrect: false,
        },
        {
          text: '5',
          isCorrect: false,
        },
        {
          text: '6',
          isCorrect: true,
        },
        {
          text: '7',
          isCorrect: false,
        },
      ],
    },
    {
      id: 'en_diag_11',
      type: 'diagnostic',
      pillar: 'Literacy',
      difficulty: 2,
      focus: 'Diagnostic: Spelling',
      question: {
        en: 'Which word is spelled correctly?',
      },
      options: [
        {
          text: 'Definitely',
          isCorrect: true,
        },
        {
          text: 'Definately',
          isCorrect: false,
        },
        {
          text: 'Definatly',
          isCorrect: false,
        },
        {
          text: 'Defenitely',
          isCorrect: false,
        },
      ],
    },
    {
      id: 'en_diag_12',
      type: 'diagnostic',
      pillar: 'Visual',
      difficulty: 3,
      focus: 'Diagnostic: Shape Recognition',
      question: {
        en: 'Identify the sequence containing the letter "p":',
      },
      options: [
        {
          text: 'q q q q d b',
          isCorrect: false,
        },
        {
          text: 'b d q d b q',
          isCorrect: false,
        },
        {
          text: 'q d b p q d',
          isCorrect: true,
        },
        {
          text: 'b b d q d b',
          isCorrect: false,
        },
      ],
    },
    {
      id: 'en_diag_13',
      type: 'diagnostic',
      pillar: 'Cognitive',
      difficulty: 2,
      focus: 'Diagnostic: Categorization',
      question: {
        en: 'Which of the following is NOT a vegetable?',
      },
      options: [
        {
          text: 'Carrot',
          isCorrect: false,
        },
        {
          text: 'Broccoli',
          isCorrect: false,
        },
        {
          text: 'Tomato',
          isCorrect: true,
        },
        {
          text: 'Spinach',
          isCorrect: false,
        },
      ],
    },
    {
      id: 'en_diag_14',
      type: 'diagnostic',
      pillar: 'Literacy',
      difficulty: 3,
      focus: 'Diagnostic: Synonyms',
      question: {
        en: 'What is a synonym for "Rapid"?',
      },
      options: [
        {
          text: 'Sluggish',
          isCorrect: false,
        },
        {
          text: 'Swift',
          isCorrect: true,
        },
        {
          text: 'Lethargic',
          isCorrect: false,
        },
        {
          text: 'Quiet',
          isCorrect: false,
        },
      ],
    },
    {
      id: 'en_diag_15',
      type: 'diagnostic',
      pillar: 'Cognitive',
      difficulty: 4,
      focus: 'Diagnostic: Deduction',
      question: {
        en: 'If every square is a rectangle, and no rectangle is a circle, then:',
      },
      options: [
        {
          text: 'No square is a circle',
          isCorrect: true,
        },
        {
          text: 'Every rectangle is a square',
          isCorrect: false,
        },
        {
          text: 'Every circle is a square',
          isCorrect: false,
        },
        {
          text: 'Some squares are circles',
          isCorrect: false,
        },
      ],
    },
  ],
};
