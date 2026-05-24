export const wordDatabaseEN = {
  phonemes: [
    { 
      id: 1, 
      word: 'Entrepreneur', 
      difficulty: 3, 
      phonetic: '/ ˌɒn.trə.prəˈnɜːr /', 
      hints: { en: 'A person who sets up a business.', pl: 'Osoba zakładająca firmę.', de: 'Eine Person, die ein Unternehmen gründet.' } 
    },
    { 
      id: 2, 
      word: 'Paradigm', 
      difficulty: 3, 
      phonetic: '/ ˈpær.ə.daɪm /', 
      hints: { en: 'A typical example or pattern of something.', pl: 'Typowy przykład lub wzorzec.', de: 'Ein typisches Beispiel oder Muster.' } 
    },
    { 
      id: 3, 
      word: 'Ubiquitous', 
      difficulty: 3, 
      phonetic: '/ juːˈbɪk.wɪ.təs /', 
      hints: { en: 'Present, appearing, or found everywhere.', pl: 'Wszechobecny.', de: 'Allgegenwärtig.' } 
    },
    { 
      id: 4, 
      word: 'Hierarchy', 
      difficulty: 2, 
      phonetic: '/ ˈhaɪə.rɑː.ki /', 
      hints: { en: 'A system in which members are ranked according to status or authority.', pl: 'Hierarchia, system rang.', de: 'Hierarchie, Rangordnung.' } 
    },
    { 
      id: 5, 
      word: 'Colleague', 
      difficulty: 1, 
      phonetic: '/ ˈkɒl.iːɡ /', 
      hints: { en: 'A person with whom one works in a profession or business.', pl: 'Współpracownik.', de: 'Kollege.' } 
    },
    { 
      id: 6, 
      word: 'Bureaucracy', 
      difficulty: 3, 
      phonetic: '/ bjʊəˈrɒk.rə.si /', 
      hints: { en: 'Excessively complicated administrative procedure.', pl: 'Biurokracja.', de: 'Bürokratie.' } 
    },
    { 
      id: 7, 
      word: 'Conscientious', 
      difficulty: 3, 
      phonetic: '/ ˌkɒn.ʃiˈen.ʃəs /', 
      hints: { en: 'Wishing to do what is right, especially to do one\'s work well.', pl: 'Sumienny.', de: 'Gewissenhaft.' } 
    },
    { 
      id: 8, 
      word: 'Guarantee', 
      difficulty: 2, 
      phonetic: '/ ˌɡær.ənˈtiː /', 
      hints: { en: 'A formal promise or assurance.', pl: 'Gwarancja.', de: 'Garantie.' } 
    },
    { 
      id: 9, 
      word: 'Vulnerable', 
      difficulty: 2, 
      phonetic: '/ ˈvʌl.nər.ə.bəl /', 
      hints: { en: 'Susceptible to physical or emotional attack or harm.', pl: 'Podatny, wrażliwy.', de: 'Verwundbar.' } 
    },
    { 
      id: 10, 
      word: 'Miscellaneous', 
      difficulty: 3, 
      phonetic: '/ ˌmɪs.əˈleɪ.ni.əs /', 
      hints: { en: 'Of various types or from different sources.', pl: 'Rozmaity, różny.', de: 'Verschiedenes.' } 
    }
  ],

  segmenting: [
    { id: 1, type: 'segmenting', word: 'Hierarchy', phonemes: ['h', 'i', 'e', 'r', 'a', 'r', 'c', 'h', 'y'], audioUrl: '/audio/en_hierarchy.mp3', difficulty: 3 },
    { id: 2, type: 'segmenting', word: 'Strategy', phonemes: ['s', 't', 'r', 'a', 't', 'e', 'g', 'y'], audioUrl: '/audio/en_strategy.mp3', difficulty: 2 }
  ],

  graphemes: [
    { 
      id: 1, 
      difficulty: 3, 
      focus: 'affect vs effect', 
      questions: { en: 'Which word completes: "The new policy will ___ our workflow"?', pl: 'Które słowo pasuje: "Nowa polityka ___ na nasz przepływ pracy"?', de: 'Welches Wort passt: "Die neue Richtlinie wird unseren Arbeitsablauf ___"?' }, 
      options: [{ text: 'affect', isCorrect: true, icon: '📉' }, { text: 'effect', isCorrect: false, icon: '❌' }] 
    },
    { 
      id: 2, 
      difficulty: 3, 
      focus: 'principal vs principle', 
      questions: { en: 'Which word means "a fundamental truth or proposition"?', pl: 'Które słowo oznacza "podstawową prawdę lub zasadę"?', de: 'Welches Wort bedeutet "eine grundlegende Wahrheit oder ein Prinzip"?' }, 
      options: [{ text: 'Principle', isCorrect: true, icon: '📜' }, { text: 'Principal', isCorrect: false, icon: '🏫' }] 
    },
    { 
      id: 3, 
      difficulty: 3, 
      focus: 'stationery vs stationary', 
      questions: { en: 'Which word refers to office supplies like paper and envelopes?', pl: 'Które słowo odnosi się do materiałów biurowych?', de: 'Welches Wort bezieht sich auf Büromaterial?' }, 
      options: [{ text: 'Stationery', isCorrect: true, icon: '✉️' }, { text: 'Stationary', isCorrect: false, icon: '🚗' }] 
    },
    { 
      id: 4, 
      difficulty: 1, 
      focus: 'their vs there vs they\'re', 
      questions: { en: 'Which word indicates possession (belonging to them)?', pl: 'Które słowo oznacza przynależność (ich)?', de: 'Welches Wort zeigt Besitz an (ihr/ihre)?' }, 
      options: [{ text: 'Their', isCorrect: true, icon: '👥' }, { text: 'There', isCorrect: false, icon: '📍' }, { text: 'They\'re', isCorrect: false, icon: '❌' }] 
    },
    { 
      id: 5, 
      difficulty: 2, 
      focus: 'its vs it\'s', 
      questions: { en: 'Which word means "it is"?', pl: 'Które słowo jest skrótem od "it is" (to jest)?', de: 'Welches Wort bedeutet "es ist"?' }, 
      options: [{ text: 'It\'s', isCorrect: true, icon: '✨' }, { text: 'Its', isCorrect: false, icon: '❌' }] 
    },
    { 
      id: 6, 
      difficulty: 3, 
      focus: 'complement vs compliment', 
      questions: { en: 'Which word means to politely praise or admire someone?', pl: 'Które słowo oznacza prawienie komplementów?', de: 'Welches Wort bedeutet, jemandem ein Kompliment zu machen?' }, 
      options: [{ text: 'Compliment', isCorrect: true, icon: '💬' }, { text: 'Complement', isCorrect: false, icon: '🧩' }] 
    },
    { 
      id: 7, 
      difficulty: 1, 
      focus: 'lose vs loose', 
      questions: { en: 'Which word means to fail to win or to misplace something?', pl: 'Które słowo oznacza zgubić coś lub przegrać?', de: 'Welches Wort bedeutet, etwas zu verlieren?' }, 
      options: [{ text: 'Lose', isCorrect: true, icon: '📉' }, { text: 'Loose', isCorrect: false, icon: '👕' }] 
    },
    { 
      id: 8, 
      difficulty: 2, 
      focus: 'accept vs except', 
      questions: { en: 'Which word means to consent to receive something?', pl: 'Które słowo oznacza akceptację lub przyjęcie czegoś?', de: 'Welches Wort bedeutet, etwas anzunehmen?' }, 
      options: [{ text: 'Accept', isCorrect: true, icon: '✅' }, { text: 'Except', isCorrect: false, icon: '🚫' }] 
    },
    { 
      id: 9, 
      difficulty: 2, 
      focus: 'advise vs advice', 
      questions: { en: 'Which word is a VERB meaning to offer suggestions?', pl: 'Które słowo jest CZASOWNIKIEM oznaczającym doradzanie?', de: 'Welches Wort ist ein VERB und bedeutet, einen Rat zu geben?' }, 
      options: [{ text: 'Advise', isCorrect: true, icon: '🗣️' }, { text: 'Advice', isCorrect: false, icon: '📝' }] 
    },
    { 
      id: 10, 
      difficulty: 2, 
      focus: 'ensure vs insure', 
      questions: { en: 'Which word means to make certain that something will happen?', pl: 'Które słowo oznacza upewnienie się, że coś się wydarzy?', de: 'Welches Wort bedeutet, sicherzustellen, dass etwas passiert?' }, 
      options: [{ text: 'Ensure', isCorrect: true, icon: '🔒' }, { text: 'Insure', isCorrect: false, icon: '📄' }] 
    },
    { 
      id: 11, 
      difficulty: 3, 
      focus: 'ough vs uff', 
      questions: { en: 'Which ending completes: "The sea was very r___ today during the storm"?', pl: 'Która końcówka pasuje: "The sea was very r___ today" (Morze było dziś wzburzone)?', de: 'Welche Endung passt: "The sea was very r___ today" (Das Meer war heute rau)?' }, 
      options: [{ text: 'ough', isCorrect: true, icon: '🌊' }, { text: 'uff', isCorrect: false, icon: '❌' }] 
    }
  ],

  blending: [
    { id: 1, type: 'blending', targetWord: 'Assessment', phonemesAudioUrl: '/audio/en_assessment.mp3', difficulty: 3 },
    { id: 2, type: 'blending', targetWord: 'Hypothesis', phonemesAudioUrl: '/audio/en_hypothesis.mp3', difficulty: 3 }
  ],

  syllables: [
    { id: 1, difficulty: 3, word: 'Bureaucracy', segments: ['Bu', 'reau', 'cra', 'cy'], icon: '🏛️' },
    { id: 2, difficulty: 3, word: 'Simultaneously', segments: ['Si', 'mul', 'ta', 'ne', 'ous', 'ly'], icon: '⚡' },
    { id: 3, difficulty: 3, word: 'Conscientious', segments: ['Con', 'sci', 'en', 'tious'], icon: '✅' },
    { id: 4, difficulty: 2, word: 'Responsibility', segments: ['Re', 'spon', 'si', 'bil', 'i', 'ty'], icon: '⚖️' },
    { id: 5, difficulty: 3, word: 'Entrepreneur', segments: ['En', 'tre', 'pre', 'neur'], icon: '🚀' },
    { id: 6, difficulty: 2, word: 'Organization', segments: ['Or', 'ga', 'ni', 'za', 'tion'], icon: '🏢' },
    { id: 7, difficulty: 2, word: 'Communication', segments: ['Com', 'mu', 'ni', 'ca', 'tion'], icon: '💬' },
    { id: 8, difficulty: 1, word: 'Development', segments: ['De', 'vel', 'op', 'ment'], icon: '📈' },
    { id: 9, difficulty: 2, word: 'Professional', segments: ['Pro', 'fes', 'sion', 'al'], icon: '👔' },
    { id: 10, difficulty: 2, word: 'Appreciation', segments: ['Ap', 'pre', 'ci', 'a', 'tion'], icon: '🙏' }
  ],

  spelling: [
    { id: 1, type: 'spelling', word: 'Accommodate', audioUrl: '/audio/en_accommodate.mp3', difficulty: 3 },
    { id: 2, type: 'spelling', word: 'Embarrassment', audioUrl: '/audio/en_embarrassment.mp3', difficulty: 3 }
  ],

  scrabble: [
    { id: 1, difficulty: 3, word: 'COLLEAGUE', scrambled: ['C', 'O', 'L', 'L', 'E', 'A', 'G', 'U', 'E'], distractors: ['I', 'N'], image: '👥' },
    { id: 2, difficulty: 3, word: 'GUARANTEE', scrambled: ['G', 'U', 'A', 'R', 'A', 'N', 'T', 'E', 'E'], distractors: ['O', 'W'], image: '🛡️' },
    { id: 3, difficulty: 3, word: 'ASSESSMENT', scrambled: ['A', 'S', 'S', 'E', 'S', 'S', 'M', 'E', 'N', 'T'], distractors: ['C', 'R'], image: '📊' },
    { id: 4, difficulty: 2, word: 'COMMITTEE', scrambled: ['C', 'O', 'M', 'M', 'I', 'T', 'T', 'E', 'E'], distractors: ['N', 'L'], image: '🧑‍🤝‍🧑' },
    { id: 5, difficulty: 2, word: 'SCHEDULE', scrambled: ['S', 'C', 'H', 'E', 'D', 'U', 'L', 'E'], distractors: ['K', 'A'], image: '📅' },
    { id: 6, difficulty: 2, word: 'STRATEGY', scrambled: ['S', 'T', 'R', 'A', 'T', 'E', 'G', 'Y'], distractors: ['J', 'I'], image: '🎯' },
    { id: 7, difficulty: 2, word: 'MANAGEMENT', scrambled: ['M', 'A', 'N', 'A', 'G', 'E', 'M', 'E', 'N', 'T'], distractors: ['O', 'I'], image: '💼' },
    { id: 8, difficulty: 2, word: 'KNOWLEDGE', scrambled: ['K', 'N', 'O', 'W', 'L', 'E', 'D', 'G', 'E'], distractors: ['C', 'A'], image: '🧠' },
    { id: 9, difficulty: 2, word: 'EXPERIENCE', scrambled: ['E', 'X', 'P', 'E', 'R', 'I', 'E', 'N', 'C', 'E'], distractors: ['S', 'O'], image: '⭐' },
    { id: 10, difficulty: 2, word: 'LEADERSHIP', scrambled: ['L', 'E', 'A', 'D', 'E', 'R', 'S', 'H', 'I', 'P'], distractors: ['T', 'O'], image: '👑' }
  ],

  reciprocal: [
    { 
      id: 1, 
      type: 'reciprocal', 
      paragraph: 'Adults with dyslexia often possess strong problem-solving skills and can excel in creative and big-picture thinking. While working memory and processing speed may pose challenges, their perceptual reasoning is frequently a distinct asset in professional environments.',
      difficulty: 3 
    },
    { 
      id: 2, 
      type: 'reciprocal', 
      paragraph: 'In modern corporate structures, fostering psychological safety is critical. When employees feel safe to take interpersonal risks without fear of retribution, team innovation and overall productivity significantly increase.',
      difficulty: 3 
    }
  ],

  context: [
    { id: 1, difficulty: 3, tags: ['business'], sentence_part1: 'The committee needs to', sentence_part2: 'the long-term financial risks before proceeding.', options: [{ text: 'assess', isCorrect: true }, { text: 'access', isCorrect: false }], hints: { en: '"Assess" means to evaluate. "Access" means to enter or retrieve.', pl: '"Assess" oznacza oceniać. "Access" oznacza dostęp.' } },
    { id: 2, difficulty: 3, tags: ['business'], sentence_part1: 'We must ensure that our supply chain remains', sentence_part2: 'despite the market volatility.', options: [{ text: 'resilient', isCorrect: true }, { text: 'resistant', isCorrect: false }], hints: { en: '"Resilient" implies bouncing back from adversity. "Resistant" means blocking it entirely.', pl: '"Resilient" oznacza odporny, potrafiący się podnieść. "Resistant" to całkowicie blokujący.' } },
    { id: 3, difficulty: 2, tags: ['business'], sentence_part1: 'Please', sentence_part2: 'that all files are saved on the shared drive.', options: [{ text: 'ensure', isCorrect: true }, { text: 'insure', isCorrect: false }], hints: { en: '"Ensure" is to make sure. "Insure" relates to insurance policies.', pl: '"Ensure" to upewnić się. "Insure" dotyczy ubezpieczeń.' } },
    { id: 4, difficulty: 2, tags: ['everyday'], sentence_part1: 'I will', sentence_part2: 'the offer with great pleasure.', options: [{ text: 'accept', isCorrect: true }, { text: 'except', isCorrect: false }], hints: { en: '"Accept" means to receive. "Except" means to exclude.', pl: '"Accept" to przyjąć. "Except" to z wyjątkiem.' } },
    { id: 5, difficulty: 3, tags: ['business'], sentence_part1: 'What do you', sentence_part2: 'from the recent drop in sales?', options: [{ text: 'infer', isCorrect: true }, { text: 'imply', isCorrect: false }], hints: { en: 'To "infer" is to deduce. To "imply" is to suggest indirectly.', pl: '"Infer" to wnioskować. "Imply" to sugerować.' } },
    { id: 6, difficulty: 2, tags: ['business'], sentence_part1: 'We will', sentence_part2: 'with the presentation after a short break.', options: [{ text: 'proceed', isCorrect: true }, { text: 'precede', isCorrect: false }], hints: { en: '"Proceed" means to continue. "Precede" means to come before.', pl: '"Proceed" to kontynuować. "Precede" to poprzedzać.' } },
    { id: 7, difficulty: 3, tags: ['business'], sentence_part1: 'Unfortunately, his handwriting on the form was completely', sentence_part2: '.', options: [{ text: 'illegible', isCorrect: true }, { text: 'eligible', isCorrect: false }], hints: { en: '"Illegible" means unreadable. "Eligible" means qualified.', pl: '"Illegible" to nieczytelny. "Eligible" to kwalifikujący się.' } },
    { id: 8, difficulty: 2, tags: ['business'], sentence_part1: 'The auditor conducted a very', sentence_part2: 'review of our accounts.', options: [{ text: 'thorough', isCorrect: true }, { text: 'through', isCorrect: false }], hints: { en: '"Thorough" means complete/detailed. "Through" is a preposition.', pl: '"Thorough" to dokładny. "Through" to przez.' } },
    { id: 9, difficulty: 2, tags: ['everyday'], sentence_part1: 'She was', sentence_part2: 'employed at a marketing agency before joining us.', options: [{ text: 'formerly', isCorrect: true }, { text: 'formally', isCorrect: false }], hints: { en: '"Formerly" means previously. "Formally" means officially.', pl: '"Formerly" to dawniej. "Formally" to formalnie.' } },
    { id: 10, difficulty: 2, tags: ['business'], sentence_part1: 'All inquiries regarding payroll should be directed to', sentence_part2: '.', options: [{ text: 'personnel', isCorrect: true }, { text: 'personal', isCorrect: false }], hints: { en: '"Personnel" refers to staff. "Personal" means private.', pl: '"Personnel" to personel. "Personal" to osobisty.' } },
    { id: 11, difficulty: 2, tags: ['everyday', 'sports'], sentence_part1: 'She grabbed her racket to play', sentence_part2: '.', options: [{ text: 'badminton', isCorrect: true }, { text: 'dadminton', isCorrect: false }], hints: { en: 'Look closely at the very first letter. The circle goes to the right side, like a belly: "b".', pl: 'Zwróć uwagę na pierwszą literę. Brzuszek litery "b" jest po prawej stronie.', de: 'Achte auf den ersten Buchstaben. Der Bauch vom "b" zeigt nach rechts.' } }
  ],

  clock: [
    { id: 1, difficulty: 3, timeAnalog: 'Seventeen minutes past eight in the evening', isNight: true, hourRotation: 248, minuteRotation: 102, options: [{ text: '8:17 PM', isCorrect: true }, { text: '8:17 AM', isCorrect: false }, { text: '7:17 PM', isCorrect: false }, { text: '8:43 PM', isCorrect: false }] },
    { id: 2, difficulty: 3, timeAnalog: 'Nine minutes to two in the afternoon', isNight: false, hourRotation: 55, minuteRotation: 306, options: [{ text: '1:51 PM', isCorrect: true }, { text: '1:51 AM', isCorrect: false }, { text: '2:51 PM', isCorrect: false }, { text: '2:09 PM', isCorrect: false }] },
    { id: 3, difficulty: 1, timeAnalog: 'Quarter past three', isNight: false, hourRotation: 98, minuteRotation: 90, options: [{ text: '3:15', isCorrect: true }, { text: '3:45', isCorrect: false }, { text: '4:15', isCorrect: false }] },
    { id: 4, difficulty: 1, timeAnalog: 'Half past six in the evening', isNight: true, hourRotation: 195, minuteRotation: 180, options: [{ text: '6:30 PM', isCorrect: true }, { text: '6:30 AM', isCorrect: false }, { text: '7:30 PM', isCorrect: false }] },
    { id: 5, difficulty: 1, timeAnalog: 'Ten to ten in the morning', isNight: false, hourRotation: 295, minuteRotation: 300, options: [{ text: '9:50 AM', isCorrect: true }, { text: '10:10 AM', isCorrect: false }, { text: '9:10 AM', isCorrect: false }] },
    { id: 6, difficulty: 1, timeAnalog: 'Noon', isNight: false, hourRotation: 0, minuteRotation: 0, options: [{ text: '12:00 PM', isCorrect: true }, { text: '12:00 AM', isCorrect: false }, { text: '12:30 PM', isCorrect: false }] },
    { id: 7, difficulty: 1, timeAnalog: 'Midnight', isNight: true, hourRotation: 0, minuteRotation: 0, options: [{ text: '12:00 AM', isCorrect: true }, { text: '12:00 PM', isCorrect: false }, { text: '11:59 PM', isCorrect: false }] },
    { id: 8, difficulty: 2, timeAnalog: 'Quarter to nine in the evening', isNight: true, hourRotation: 262, minuteRotation: 270, options: [{ text: '8:45 PM', isCorrect: true }, { text: '9:45 PM', isCorrect: false }, { text: '8:15 PM', isCorrect: false }] },
    { id: 9, difficulty: 1, timeAnalog: 'Twenty past four in the afternoon', isNight: false, hourRotation: 130, minuteRotation: 120, options: [{ text: '4:20 PM', isCorrect: true }, { text: '4:40 PM', isCorrect: false }, { text: '5:20 PM', isCorrect: false }] },
    { id: 10, difficulty: 1, timeAnalog: 'Half past eight in the morning', isNight: false, hourRotation: 255, minuteRotation: 180, options: [{ text: '8:30 AM', isCorrect: true }, { text: '9:30 AM', isCorrect: false }, { text: '8:00 AM', isCorrect: false }] }
  ],

  sequences: [
    { id: 1, difficulty: 3, tags: ['business'], instruction: 'Order the steps of a professional negotiation', scrambled: ['Preparation', 'Proposing and bargaining', 'Closing and commitment', 'Information exchange'], correct: ['Preparation', 'Information exchange', 'Proposing and bargaining', 'Closing and commitment'] },
    { id: 2, difficulty: 3, instruction: 'Order the software development life cycle (SDLC)', scrambled: ['Deployment', 'Design', 'Requirements Analysis', 'Testing', 'Implementation'], correct: ['Requirements Analysis', 'Design', 'Implementation', 'Testing', 'Deployment'] },
    { id: 3, difficulty: 1, instruction: 'Order the workdays of the week', scrambled: ['Wednesday', 'Monday', 'Thursday', 'Tuesday', 'Friday'], correct: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] },
    { id: 4, difficulty: 2, instruction: 'Order the months of Q4', scrambled: ['December', 'October', 'November'], correct: ['October', 'November', 'December'] },
    { id: 5, difficulty: 2, tags: ['business'], instruction: 'Order these career stages from entry to senior', scrambled: ['Manager', 'Intern', 'Director', 'Specialist'], correct: ['Intern', 'Specialist', 'Manager', 'Director'] },
    { id: 6, difficulty: 2, tags: ['business'], instruction: 'Standard meeting agenda order', scrambled: ['Any Other Business (AOB)', 'Welcome and Introductions', 'Adjournment', 'Reviewing past minutes', 'New business'], correct: ['Welcome and Introductions', 'Reviewing past minutes', 'New business', 'Any Other Business (AOB)', 'Adjournment'] }
  ],

  tracking: [
    { id: 1, difficulty: 1, instruction: 'Where is the loop of this letter?', items: [{ symbol: 'b', target: 'right' }, { symbol: 'd', target: 'left' }, { symbol: 'd', target: 'left' }, { symbol: 'b', target: 'right' }], options: [{ label: 'Left ⬅️', value: 'left' }, { label: 'Right ➡️', value: 'right' }] },
    { id: 2, difficulty: 1, instruction: 'Which way does the arrow point?', items: [{ symbol: '→', target: 'right' }, { symbol: '←', target: 'left' }, { symbol: '→', target: 'right' }, { symbol: '←', target: 'left' }], options: [{ label: 'Left ⬅️', value: 'left' }, { label: 'Right ➡️', value: 'right' }] },
    { id: 3, difficulty: 2, instruction: 'Where is the loop of this letter?', items: [{ symbol: 'p', target: 'right' }, { symbol: 'q', target: 'left' }, { symbol: 'p', target: 'right' }, { symbol: 'q', target: 'left' }], options: [{ label: 'Left ⬅️', value: 'left' }, { label: 'Right ➡️', value: 'right' }] },
    { id: 4, difficulty: 1, instruction: 'Which direction is the finger pointing?', items: [{ symbol: '👈', target: 'left' }, { symbol: '👉', target: 'right' }, { symbol: '👉', target: 'right' }, { symbol: '👈', target: 'left' }], options: [{ label: 'Left ⬅️', value: 'left' }, { label: 'Right ➡️', value: 'right' }] },
    { id: 5, difficulty: 1, instruction: 'Read the word and point to that direction', items: [{ symbol: 'RIGHT', target: 'right' }, { symbol: 'LEFT', target: 'left' }, { symbol: 'RIGHT', target: 'right' }, { symbol: 'LEFT', target: 'left' }], options: [{ label: 'Left ⬅️', value: 'left' }, { label: 'Right ➡️', value: 'right' }] }
  ],

  lcwc: [
    { id: 1, lcwc: true, difficulty: 3, word: 'Sustainability' },
    { id: 2, lcwc: true, difficulty: 3, word: 'Perseverance' },
    { id: 3, lcwc: true, difficulty: 2, word: 'Accommodation' },
    { id: 4, lcwc: true, difficulty: 2, word: 'Recommendation' },
    { id: 5, lcwc: true, difficulty: 3, word: 'Embarrassment' },
    { id: 6, lcwc: true, difficulty: 3, word: 'Occurrence' },
    { id: 7, lcwc: true, difficulty: 2, word: 'Necessary' },
    { id: 8, lcwc: true, difficulty: 2, word: 'Privilege' },
    { id: 9, lcwc: true, difficulty: 3, word: 'Questionnaire' },
    { id: 10, lcwc: true, difficulty: 3, word: 'Pronunciation' }
  ],

  categorization: [
    { id: 1, difficulty: 3, instruction: 'Categorize these cognitive biases', buckets: [{ id: 'social', label: 'Social Biases', icon: '👥' }, { id: 'memory', label: 'Memory Biases', icon: '🧠' }], items: [{ id: 'i1', word: 'Groupthink', bucketId: 'social' }, { id: 'i2', word: 'Hindsight bias', bucketId: 'memory' }, { id: 'i3', word: 'Bandwagon effect', bucketId: 'social' }, { id: 'i4', word: 'Misinformation effect', bucketId: 'memory' }] },
    { id: 2, difficulty: 1, tags: ['business'], instruction: 'Assign words to the correct department', buckets: [{ id: 'hr', label: 'HR', icon: '👥' }, { id: 'fin', label: 'Finance', icon: '💰' }], items: [{ id: 'i1', word: 'Budget', bucketId: 'fin' }, { id: 'i2', word: 'Recruitment', bucketId: 'hr' }, { id: 'i3', word: 'Invoice', bucketId: 'fin' }, { id: 'i4', word: 'Vacations', bucketId: 'hr' }] },
    { id: 3, difficulty: 2, instruction: 'Assign words to the correct part of speech', buckets: [{ id: 'noun', label: 'Noun (Thing)', icon: '📦' }, { id: 'verb', label: 'Verb (Action)', icon: '🏃' }], items: [{ id: 'i1', word: 'Meeting', bucketId: 'noun' }, { id: 'i2', word: 'Analyze', bucketId: 'verb' }, { id: 'i3', word: 'Decision', bucketId: 'noun' }, { id: 'i4', word: 'Calculate', bucketId: 'verb' }] }
  ],

  dictation: [
    { id: 1, dictation: true, difficulty: 3, audioPrompt: 'Continuous learning is essential in a rapidly evolving professional landscape.', correct: 'Continuous learning is essential in a rapidly evolving professional landscape' },
    { id: 2, dictation: true, difficulty: 1, audioPrompt: 'The meeting is scheduled for tomorrow.', correct: 'The meeting is scheduled for tomorrow' },
    { id: 3, dictation: true, difficulty: 2, audioPrompt: 'Please review the attached document.', correct: 'Please review the attached document' },
    { id: 4, dictation: true, difficulty: 2, audioPrompt: 'The company has seen significant growth.', correct: 'The company has seen significant growth' },
    { id: 5, dictation: true, difficulty: 2, audioPrompt: 'We need to update the project timeline.', correct: 'We need to update the project timeline' }
  ]
};
