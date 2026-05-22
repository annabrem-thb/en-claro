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
    }
  ],

  blending: [
    { id: 1, type: 'blending', targetWord: 'Assessment', phonemesAudioUrl: '/audio/en_assessment.mp3', difficulty: 3 },
    { id: 2, type: 'blending', targetWord: 'Hypothesis', phonemesAudioUrl: '/audio/en_hypothesis.mp3', difficulty: 3 }
  ],

  syllables: [
    { id: 1, difficulty: 3, word: 'Bureaucracy', segments: ['Bu', 'reau', 'cra', 'cy'], icon: '🏛️' },
    { id: 2, difficulty: 3, word: 'Simultaneously', segments: ['Si', 'mul', 'ta', 'ne', 'ous', 'ly'], icon: '⚡' },
    { id: 3, difficulty: 3, word: 'Conscientious', segments: ['Con', 'sci', 'en', 'tious'], icon: '✅' }
  ],

  spelling: [
    { id: 1, type: 'spelling', word: 'Accommodate', audioUrl: '/audio/en_accommodate.mp3', difficulty: 3 },
    { id: 2, type: 'spelling', word: 'Embarrassment', audioUrl: '/audio/en_embarrassment.mp3', difficulty: 3 }
  ],

  scrabble: [
    { id: 1, difficulty: 3, word: 'COLLEAGUE', scrambled: ['C', 'O', 'L', 'L', 'E', 'A', 'G', 'U', 'E'], distractors: ['I', 'N'], image: '👥' },
    { id: 2, difficulty: 3, word: 'GUARANTEE', scrambled: ['G', 'U', 'A', 'R', 'A', 'N', 'T', 'E', 'E'], distractors: ['O', 'W'], image: '🛡️' }
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
    { id: 2, difficulty: 3, tags: ['business'], sentence_part1: 'We must ensure that our supply chain remains', sentence_part2: 'despite the market volatility.', options: [{ text: 'resilient', isCorrect: true }, { text: 'resistant', isCorrect: false }], hints: { en: '"Resilient" implies bouncing back from adversity. "Resistant" means blocking it entirely.', pl: '"Resilient" oznacza odporny, potrafiący się podnieść. "Resistant" to całkowicie blokujący.' } }
  ],

  clock: [
    { id: 1, difficulty: 3, timeAnalog: 'Seventeen minutes past eight in the evening', isNight: true, hourRotation: 248, minuteRotation: 102, options: [{ text: '8:17 PM', isCorrect: true }, { text: '8:17 AM', isCorrect: false }, { text: '7:17 PM', isCorrect: false }, { text: '8:43 PM', isCorrect: false }] },
    { id: 2, difficulty: 3, timeAnalog: 'Nine minutes to two in the afternoon', isNight: false, hourRotation: 55, minuteRotation: 306, options: [{ text: '1:51 PM', isCorrect: true }, { text: '1:51 AM', isCorrect: false }, { text: '2:51 PM', isCorrect: false }, { text: '2:09 PM', isCorrect: false }] }
  ],

  sequences: [
    { id: 1, difficulty: 3, tags: ['business'], instruction: 'Order the steps of a professional negotiation', scrambled: ['Preparation', 'Proposing and bargaining', 'Closing and commitment', 'Information exchange'], correct: ['Preparation', 'Information exchange', 'Proposing and bargaining', 'Closing and commitment'] },
    { id: 2, difficulty: 3, instruction: 'Order the software development life cycle (SDLC)', scrambled: ['Deployment', 'Design', 'Requirements Analysis', 'Testing', 'Implementation'], correct: ['Requirements Analysis', 'Design', 'Implementation', 'Testing', 'Deployment'] }
  ],

  tracking: [
    { id: 1, difficulty: 3, instruction: 'Identify the orientation of the symbol', items: [{ symbol: 'p', target: 'right' }, { symbol: 'q', target: 'left' }, { symbol: 'd', target: 'left' }, { symbol: 'b', target: 'right' }], options: [{ label: 'Left-facing ⬅️', value: 'left' }, { label: 'Right-facing ➡️', value: 'right' }] }
  ],

  lcwc: [
    { id: 1, lcwc: true, difficulty: 3, word: 'Sustainability' },
    { id: 2, lcwc: true, difficulty: 3, word: 'Perseverance' }
  ],

  categorization: [
    { id: 1, difficulty: 3, instruction: 'Categorize these cognitive biases', buckets: [{ id: 'social', label: 'Social Biases', icon: '👥' }, { id: 'memory', label: 'Memory Biases', icon: '🧠' }], items: [{ id: 'i1', word: 'Groupthink', bucketId: 'social' }, { id: 'i2', word: 'Hindsight bias', bucketId: 'memory' }, { id: 'i3', word: 'Bandweight effect', bucketId: 'social' }, { id: 'i4', word: 'Misinformation effect', bucketId: 'memory' }] }
  ],

  dictation: [
    { id: 1, dictation: true, difficulty: 3, audioPrompt: 'Continuous learning is essential in a rapidly evolving professional landscape.', correct: 'Continuous learning is essential in a rapidly evolving professional landscape' }
  ]
};
