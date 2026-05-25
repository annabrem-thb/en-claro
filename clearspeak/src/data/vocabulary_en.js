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
    },
    { 
      id: 11, 
      word: 'Queue', 
      difficulty: 3, 
      phonetic: '/ kjuː /', 
      hints: { en: 'A line or sequence of people or vehicles.', pl: 'Kolejka.', de: 'Warteschlange.' } 
    },
    { 
      id: 12, 
      word: 'Maneuver', 
      difficulty: 3, 
      phonetic: '/ məˈnuː.vər /', 
      hints: { en: 'A movement or series of moves requiring skill and care.', pl: 'Manewr.', de: 'Manöver.' } 
    },
    { 
      id: 13, 
      word: 'Psychology', 
      difficulty: 3, 
      phonetic: '/ saɪˈkɒl.ə.dʒi /', 
      hints: { en: 'Scientific study of the human mind and its functions.', pl: 'Psychologia.', de: 'Psychologie.' } 
    },
    { 
      id: 14, 
      word: 'Chaos', 
      difficulty: 2, 
      phonetic: '/ ˈkeɪ.ɒs /', 
      hints: { en: 'Complete disorder and confusion.', pl: 'Całkowity nieporządek.', de: 'Völlige Unordnung.' } 
    }
  ],

  graphemes: [
    { 
      id: 1, 
      difficulty: 3, 
      focus: 'affect vs effect', 
      questions: { en: 'Which word completes: "The new policy will ___ our workflow"?', pl: 'Które słowo pasuje: "Nowa polityka ___ na nasz przepływ pracy"?', de: 'Welches Wort passt: "Die neue Richtlinie wird unseren Arbeitsablauf ___"?' }, 
      options: [{ text: 'affect', isCorrect: true, icon: '📉' }, { text: 'effect', isCorrect: false, icon: '❌' }, { text: 'afect', isCorrect: false, icon: '❌' }, { text: 'efect', isCorrect: false, icon: '❌' }] 
    },
    { 
      id: 2, 
      difficulty: 3, 
      focus: 'principal vs principle', 
      questions: { en: 'Which word means "a fundamental truth or proposition"?', pl: 'Które słowo oznacza "podstawową prawdę lub zasadę"?', de: 'Welches Wort bedeutet "eine grundlegende Wahrheit oder ein Prinzip"?' }, 
      options: [{ text: 'Principle', isCorrect: true, icon: '📜' }, { text: 'Principal', isCorrect: false, icon: '🏫' }, { text: 'Principell', isCorrect: false, icon: '❌' }, { text: 'Prinicpal', isCorrect: false, icon: '❌' }] 
    },
    { 
      id: 3, 
      difficulty: 3, 
      focus: 'stationery vs stationary', 
      questions: { en: 'Which word refers to office supplies like paper and envelopes?', pl: 'Które słowo odnosi się do materiałów biurowych?', de: 'Welches Wort bezieht sich auf Büromaterial?' }, 
      options: [{ text: 'Stationery', isCorrect: true, icon: '✉️' }, { text: 'Stationary', isCorrect: false, icon: '🚗' }, { text: 'Stationerry', isCorrect: false, icon: '❌' }, { text: 'Stationarry', isCorrect: false, icon: '❌' }] 
    },
    { 
      id: 4, 
      difficulty: 1, 
      focus: 'their vs there vs they\'re', 
      questions: { en: 'Which word indicates possession (belonging to them)?', pl: 'Które słowo oznacza przynależność (ich)?', de: 'Welches Wort zeigt Besitz an (ihr/ihre)?' }, 
      options: [{ text: 'Their', isCorrect: true, icon: '👥' }, { text: 'There', isCorrect: false, icon: '📍' }, { text: 'They\'re', isCorrect: false, icon: '❌' }, { text: 'Thier', isCorrect: false, icon: '❌' }] 
    },
    { 
      id: 5, 
      difficulty: 2, 
      focus: 'its vs it\'s', 
      questions: { en: 'Which word means "it is"?', pl: 'Które słowo jest skrótem od "it is" (to jest)?', de: 'Welches Wort bedeutet "es ist"?' }, 
      options: [{ text: 'It\'s', isCorrect: true, icon: '✨' }, { text: 'Its', isCorrect: false, icon: '❌' }, { text: 'Its\'', isCorrect: false, icon: '❌' }, { text: 'Ites', isCorrect: false, icon: '❌' }] 
    },
    { 
      id: 6, 
      difficulty: 3, 
      focus: 'complement vs compliment', 
      questions: { en: 'Which word means to politely praise or admire someone?', pl: 'Które słowo oznacza prawienie komplementów?', de: 'Welches Wort bedeutet, jemandem ein Kompliment zu machen?' }, 
      options: [{ text: 'Compliment', isCorrect: true, icon: '💬' }, { text: 'Complement', isCorrect: false, icon: '🧩' }, { text: 'Complimant', isCorrect: false, icon: '❌' }, { text: 'Complemant', isCorrect: false, icon: '❌' }] 
    },
    { 
      id: 7, 
      difficulty: 1, 
      focus: 'lose vs loose', 
      questions: { en: 'Which word means to fail to win or to misplace something?', pl: 'Które słowo oznacza zgubić coś lub przegrać?', de: 'Welches Wort bedeutet, etwas zu verlieren?' }, 
      options: [{ text: 'Lose', isCorrect: true, icon: '📉' }, { text: 'Loose', isCorrect: false, icon: '👕' }, { text: 'Looze', isCorrect: false, icon: '❌' }, { text: 'Loos', isCorrect: false, icon: '❌' }] 
    },
    { 
      id: 8, 
      difficulty: 2, 
      focus: 'accept vs except', 
      questions: { en: 'Which word means to consent to receive something?', pl: 'Które słowo oznacza akceptację lub przyjęcie czegoś?', de: 'Welches Wort bedeutet, etwas anzunehmen?' }, 
      options: [{ text: 'Accept', isCorrect: true, icon: '✅' }, { text: 'Except', isCorrect: false, icon: '🚫' }, { text: 'Acept', isCorrect: false, icon: '❌' }, { text: 'Exept', isCorrect: false, icon: '❌' }] 
    },
    { 
      id: 9, 
      difficulty: 2, 
      focus: 'advise vs advice', 
      questions: { en: 'Which word is a VERB meaning to offer suggestions?', pl: 'Które słowo jest CZASOWNIKIEM oznaczającym doradzanie?', de: 'Welches Wort ist ein VERB und bedeutet, einen Rat zu geben?' }, 
      options: [{ text: 'Advise', isCorrect: true, icon: '🗣️' }, { text: 'Advice', isCorrect: false, icon: '📝' }, { text: 'Advize', isCorrect: false, icon: '❌' }, { text: 'Advis', isCorrect: false, icon: '❌' }] 
    },
    { 
      id: 10, 
      difficulty: 2, 
      focus: 'ensure vs insure', 
      questions: { en: 'Which word means to make certain that something will happen?', pl: 'Które słowo oznacza upewnienie się, że coś się wydarzy?', de: 'Welches Wort bedeutet, sicherzustellen, dass etwas passiert?' }, 
      options: [{ text: 'Ensure', isCorrect: true, icon: '🔒' }, { text: 'Insure', isCorrect: false, icon: '📄' }, { text: 'Enshure', isCorrect: false, icon: '❌' }, { text: 'Inshure', isCorrect: false, icon: '❌' }] 
    },
    { 
      id: 11, 
      difficulty: 1, 
      focus: 'bare vs bear', 
      questions: { en: 'Which word refers to a large heavy mammal?', pl: 'Które słowo oznacza dużego, ciężkiego ssaka?', de: 'Welches Wort bezieht sich auf ein großes, schweres Säugetier?' }, 
      options: [{ text: 'Bear', isCorrect: true, icon: '🐻' }, { text: 'Bare', isCorrect: false, icon: '🦶' }, { text: 'Bair', isCorrect: false, icon: '❌' }, { text: 'Beare', isCorrect: false, icon: '❌' }] 
    },
    { 
      id: 12, 
      difficulty: 2, 
      focus: 'break vs brake', 
      questions: { en: 'Which word means a device for slowing or stopping a moving vehicle?', pl: 'Które słowo oznacza urządzenie do hamowania pojazdu?', de: 'Welches Wort bedeutet eine Vorrichtung zum Verlangsamen oder Anhalten eines Fahrzeugs?' }, 
      options: [{ text: 'Brake', isCorrect: true, icon: '🛑' }, { text: 'Break', isCorrect: false, icon: '💔' }, { text: 'Braik', isCorrect: false, icon: '❌' }, { text: 'Brak', isCorrect: false, icon: '❌' }] 
    }
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
    { id: 10, difficulty: 2, word: 'Appreciation', segments: ['Ap', 'pre', 'ci', 'a', 'tion'], icon: '🙏' },
    { id: 11, difficulty: 3, word: 'Unbelievable', segments: ['Un', 'be', 'liev', 'a', 'ble'], icon: '🤯' },
    { id: 12, difficulty: 2, word: 'Reliability', segments: ['Re', 'li', 'a', 'bil', 'i', 'ty'], icon: '🤝' }
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
    { id: 10, difficulty: 2, word: 'LEADERSHIP', scrambled: ['L', 'E', 'A', 'D', 'E', 'R', 'S', 'H', 'I', 'P'], distractors: ['T', 'O'], image: '👑' },
    { id: 11, difficulty: 3, word: 'AUTHENTIC', scrambled: ['A', 'U', 'T', 'H', 'E', 'N', 'T', 'I', 'C'], distractors: ['M', 'S'], image: '💎' },
    { id: 12, difficulty: 3, word: 'INDEPENDENT', scrambled: ['I', 'N', 'D', 'E', 'P', 'E', 'N', 'D', 'E', 'N', 'T'], distractors: ['A', 'U'], image: '🦅' }
  ],

  context: [
    { id: 1, difficulty: 3, tags: ['business'], sentence_part1: 'The committee needs to', sentence_part2: 'the long-term financial risks before proceeding.', options: [{ text: 'assess', isCorrect: true }, { text: 'access', isCorrect: false }, { text: 'asess', isCorrect: false }, { text: 'acess', isCorrect: false }], hints: { en: '"Assess" means to evaluate. "Access" means to enter or retrieve.', pl: '"Assess" oznacza oceniać. "Access" oznacza dostęp.' } },
    { id: 2, difficulty: 3, tags: ['business'], sentence_part1: 'We must ensure that our supply chain remains', sentence_part2: 'despite the market volatility.', options: [{ text: 'resilient', isCorrect: true }, { text: 'resistant', isCorrect: false }, { text: 'resiliant', isCorrect: false }, { text: 'resistent', isCorrect: false }], hints: { en: '"Resilient" implies bouncing back from adversity. "Resistant" means blocking it entirely.', pl: '"Resilient" oznacza odporny, potrafiący się podnieść. "Resistant" to całkowicie blokujący.' } },
    { id: 3, difficulty: 2, tags: ['business'], sentence_part1: 'Please', sentence_part2: 'that all files are saved on the shared drive.', options: [{ text: 'ensure', isCorrect: true }, { text: 'insure', isCorrect: false }, { text: 'enshure', isCorrect: false }, { text: 'inshure', isCorrect: false }], hints: { en: '"Ensure" is to make sure. "Insure" relates to insurance policies.', pl: '"Ensure" to upewnić się. "Insure" dotyczy ubezpieczeń.' } },
    { id: 4, difficulty: 2, tags: ['everyday'], sentence_part1: 'I will', sentence_part2: 'the offer with great pleasure.', options: [{ text: 'accept', isCorrect: true }, { text: 'except', isCorrect: false }, { text: 'acept', isCorrect: false }, { text: 'exept', isCorrect: false }], hints: { en: '"Accept" means to receive. "Except" means to exclude.', pl: '"Accept" to przyjąć. "Except" to z wyjątkiem.' } },
    { id: 5, difficulty: 3, tags: ['business'], sentence_part1: 'What do you', sentence_part2: 'from the recent drop in sales?', options: [{ text: 'infer', isCorrect: true }, { text: 'imply', isCorrect: false }, { text: 'inffer', isCorrect: false }, { text: 'implie', isCorrect: false }], hints: { en: 'To "infer" is to deduce. To "imply" is to suggest indirectly.', pl: '"Infer" to wnioskować. "Imply" to sugerować.' } },
    { id: 6, difficulty: 2, tags: ['business'], sentence_part1: 'We will', sentence_part2: 'with the presentation after a short break.', options: [{ text: 'proceed', isCorrect: true }, { text: 'precede', isCorrect: false }, { text: 'procede', isCorrect: false }, { text: 'preceed', isCorrect: false }], hints: { en: '"Proceed" means to continue. "Precede" means to come before.', pl: '"Proceed" to kontynuować. "Precede" to poprzedzać.' } },
    { id: 7, difficulty: 3, tags: ['business'], sentence_part1: 'Unfortunately, his handwriting on the form was completely', sentence_part2: '.', options: [{ text: 'illegible', isCorrect: true }, { text: 'eligible', isCorrect: false }, { text: 'illegable', isCorrect: false }, { text: 'eligable', isCorrect: false }], hints: { en: '"Illegible" means unreadable. "Eligible" means qualified.', pl: '"Illegible" to nieczytelny. "Eligible" to kwalifikujący się.' } },
    { id: 8, difficulty: 2, tags: ['business'], sentence_part1: 'The auditor conducted a very', sentence_part2: 'review of our accounts.', options: [{ text: 'thorough', isCorrect: true }, { text: 'through', isCorrect: false }, { text: 'thoroughly', isCorrect: false }, { text: 'thru', isCorrect: false }], hints: { en: '"Thorough" means complete/detailed. "Through" is a preposition.', pl: '"Thorough" to dokładny. "Through" to przez.' } },
    { id: 9, difficulty: 2, tags: ['everyday'], sentence_part1: 'She was', sentence_part2: 'employed at a marketing agency before joining us.', options: [{ text: 'formerly', isCorrect: true }, { text: 'formally', isCorrect: false }, { text: 'formarly', isCorrect: false }, { text: 'formely', isCorrect: false }], hints: { en: '"Formerly" means previously. "Formally" means officially.', pl: '"Formerly" to dawniej. "Formally" to formalnie.' } },
    { id: 10, difficulty: 2, tags: ['business'], sentence_part1: 'All inquiries regarding payroll should be directed to', sentence_part2: '.', options: [{ text: 'personnel', isCorrect: true }, { text: 'personal', isCorrect: false }, { text: 'personel', isCorrect: false }, { text: 'personall', isCorrect: false }], hints: { en: '"Personnel" refers to staff. "Personal" means private.', pl: '"Personnel" to personel. "Personal" to osobisty.' } },
    { id: 11, difficulty: 2, tags: ['everyday'], sentence_part1: 'Make sure', sentence_part2: 'ready for the presentation tomorrow.', options: [{ text: 'you\'re', isCorrect: true }, { text: 'your', isCorrect: false }, { text: 'yours', isCorrect: false }, { text: 'youre', isCorrect: false }], hints: { en: '"You\'re" is a contraction of "you are".', pl: '"You\'re" to skrót od "you are".', de: '"You\'re" ist die Abkürzung für "you are".' } },
    { id: 12, difficulty: 3, tags: ['business'], sentence_part1: 'The speaker made an', sentence_part2: 'to the recent market trends.', options: [{ text: 'allusion', isCorrect: true }, { text: 'illusion', isCorrect: false }, { text: 'alusion', isCorrect: false }, { text: 'ilusion', isCorrect: false }], hints: { en: 'An "allusion" is an indirect reference. An "illusion" is a deception.', pl: '"Allusion" to aluzja. "Illusion" to iluzja.', de: '"Allusion" ist eine Anspielung. "Illusion" ist eine Täuschung.' } },
    { id: 13, difficulty: 2, tags: ['business'], sentence_part1: 'The new manager is very', sentence_part2: 'about meeting the quarterly deadlines.', options: [{ text: 'anxious', isCorrect: true }, { text: 'anxous', isCorrect: false }, { text: 'anxtious', isCorrect: false }, { text: 'ankshous', isCorrect: false }], hints: { en: '"Anxious" comes from anxiety, spelled with x and ious.', pl: '"Anxious" (niespokojny) piszemy z x oraz ious.', de: '"Anxious" (besorgt) schreibt man mit x und ious.' } },
    { id: 14, difficulty: 2, tags: ['everyday'], sentence_part1: 'Please do not', sentence_part2: 'to contact me if you have any questions.', options: [{ text: 'hesitate', isCorrect: true }, { text: 'hezitate', isCorrect: false }, { text: 'hesitat', isCorrect: false }, { text: 'hesitatee', isCorrect: false }], hints: { en: '"Hesitate" means to pause before saying or doing something.', pl: '"Hesitate" oznacza wahać się.', de: '"Hesitate" bedeutet zögern.' } }
  ],

  clock: [
    { id: 1, difficulty: 3, timeAnalog: 'Seventeen minutes past eight in the evening', isNight: true, hourRotation: 248, minuteRotation: 102, options: [{ text: '8:17 PM', isCorrect: true }, { text: '8:17 AM', isCorrect: false }, { text: '3:40 PM', isCorrect: false }, { text: '7:17 PM', isCorrect: false }] },
    { id: 2, difficulty: 3, timeAnalog: 'Nine minutes to two in the afternoon', isNight: false, hourRotation: 55, minuteRotation: 306, options: [{ text: '1:51 PM', isCorrect: true }, { text: '1:51 AM', isCorrect: false }, { text: '10:05 PM', isCorrect: false }, { text: '2:51 PM', isCorrect: false }] },
    { id: 3, difficulty: 1, timeAnalog: 'Quarter past three in the afternoon', isNight: false, hourRotation: 98, minuteRotation: 90, options: [{ text: '3:15 PM', isCorrect: true }, { text: '3:15 AM', isCorrect: false }, { text: '3:03 PM', isCorrect: false }, { text: '4:15 PM', isCorrect: false }] },
    { id: 4, difficulty: 1, timeAnalog: 'Half past six in the evening', isNight: true, hourRotation: 195, minuteRotation: 180, options: [{ text: '6:30 PM', isCorrect: true }, { text: '6:30 AM', isCorrect: false }, { text: '6:06 PM', isCorrect: false }, { text: '7:30 PM', isCorrect: false }] },
    { id: 5, difficulty: 1, timeAnalog: 'Ten to ten in the morning', isNight: false, hourRotation: 295, minuteRotation: 300, options: [{ text: '9:50 AM', isCorrect: true }, { text: '9:50 PM', isCorrect: false }, { text: '10:50 AM', isCorrect: false }, { text: '9:10 AM', isCorrect: false }] },
    { id: 6, difficulty: 1, timeAnalog: 'Noon', isNight: false, hourRotation: 0, minuteRotation: 0, options: [{ text: '12:00 PM', isCorrect: true }, { text: '12:00 AM', isCorrect: false }, { text: '12:30 PM', isCorrect: false }, { text: '6:00 PM', isCorrect: false }] },
    { id: 7, difficulty: 1, timeAnalog: 'Midnight', isNight: true, hourRotation: 0, minuteRotation: 0, options: [{ text: '12:00 AM', isCorrect: true }, { text: '12:00 PM', isCorrect: false }, { text: '12:12 AM', isCorrect: false }, { text: '6:00 AM', isCorrect: false }] },
    { id: 8, difficulty: 2, timeAnalog: 'Quarter to nine in the evening', isNight: true, hourRotation: 262, minuteRotation: 270, options: [{ text: '8:45 PM', isCorrect: true }, { text: '8:45 AM', isCorrect: false }, { text: '9:45 PM', isCorrect: false }, { text: '9:40 PM', isCorrect: false }] },
    { id: 9, difficulty: 1, timeAnalog: 'Twenty past four in the afternoon', isNight: false, hourRotation: 130, minuteRotation: 120, options: [{ text: '4:20 PM', isCorrect: true }, { text: '4:20 AM', isCorrect: false }, { text: '4:04 PM', isCorrect: false }, { text: '8:16 PM', isCorrect: false }] },
    { id: 10, difficulty: 1, timeAnalog: 'Half past eight in the morning', isNight: false, hourRotation: 255, minuteRotation: 180, options: [{ text: '8:30 AM', isCorrect: true }, { text: '8:30 PM', isCorrect: false }, { text: '6:40 AM', isCorrect: false }, { text: '9:30 AM', isCorrect: false }] },
    { id: 11, difficulty: 2, timeAnalog: 'Quarter to eight in the morning', isNight: false, hourRotation: 232, minuteRotation: 270, options: [{ text: '7:45 AM', isCorrect: true }, { text: '7:45 PM', isCorrect: false }, { text: '8:45 AM', isCorrect: false }, { text: '7:09 AM', isCorrect: false }] },
    { id: 12, difficulty: 2, timeAnalog: 'Twenty past two in the afternoon', isNight: false, hourRotation: 70, minuteRotation: 120, options: [{ text: '2:20 PM', isCorrect: true }, { text: '2:20 AM', isCorrect: false }, { text: '2:04 PM', isCorrect: false }, { text: '4:10 PM', isCorrect: false }] },
    { id: 13, difficulty: 3, timeAnalog: 'Five past eleven at night', isNight: true, hourRotation: 332, minuteRotation: 30, options: [{ text: '11:05 PM', isCorrect: true }, { text: '11:05 AM', isCorrect: false }, { text: '11:01 PM', isCorrect: false }, { text: '1:55 AM', isCorrect: false }] },
    { id: 14, difficulty: 1, timeAnalog: 'Quarter past nine in the morning', isNight: false, hourRotation: 278, minuteRotation: 90, options: [{ text: '9:15 AM', isCorrect: true }, { text: '9:15 PM', isCorrect: false }, { text: '9:03 AM', isCorrect: false }, { text: '3:45 AM', isCorrect: false }] },
    { id: 15, difficulty: 2, timeAnalog: 'Ten to nine in the evening', isNight: true, hourRotation: 265, minuteRotation: 300, options: [{ text: '8:50 PM', isCorrect: true }, { text: '8:50 AM', isCorrect: false }, { text: '9:50 PM', isCorrect: false }, { text: '10:40 PM', isCorrect: false }] }
  ],

  sequences: [
    { id: 1, difficulty: 3, tags: ['business'], instruction: 'Order the steps of a professional negotiation', scrambled: ['Preparation', 'Proposing and bargaining', 'Closing and commitment', 'Information exchange'], correct: ['Preparation', 'Information exchange', 'Proposing and bargaining', 'Closing and commitment'] },
    { id: 2, difficulty: 3, instruction: 'Order the software development life cycle (SDLC)', scrambled: ['Deployment', 'Design', 'Requirements Analysis', 'Testing', 'Implementation'], correct: ['Requirements Analysis', 'Design', 'Implementation', 'Testing', 'Deployment'] },
    { id: 3, difficulty: 1, instruction: 'Order the workdays of the week', scrambled: ['Wednesday', 'Monday', 'Thursday', 'Tuesday', 'Friday'], correct: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] },
    { id: 4, difficulty: 2, instruction: 'Order the months of Q4', scrambled: ['December', 'October', 'November'], correct: ['October', 'November', 'December'] },
    { id: 5, difficulty: 2, tags: ['business'], instruction: 'Order these career stages from entry to senior', scrambled: ['Manager', 'Intern', 'Director', 'Specialist'], correct: ['Intern', 'Specialist', 'Manager', 'Director'] },
    { id: 6, difficulty: 2, tags: ['business'], instruction: 'Standard meeting agenda order', scrambled: ['Any Other Business (AOB)', 'Welcome and Introductions', 'Adjournment', 'Reviewing past minutes', 'New business'], correct: ['Welcome and Introductions', 'Reviewing past minutes', 'New business', 'Any Other Business (AOB)', 'Adjournment'] },
    { id: 7, difficulty: 1, instruction: 'Order the time units from shortest to longest', scrambled: ['Hour', 'Second', 'Day', 'Minute'], correct: ['Second', 'Minute', 'Hour', 'Day'] },
    { id: 8, difficulty: 1, instruction: 'Order these letters alphabetically', scrambled: ['F', 'B', 'D', 'H'], correct: ['B', 'D', 'F', 'H'] },
    { id: 9, difficulty: 2, tags: ['business'], instruction: 'Order the sales funnel steps', scrambled: ['Lead', 'Prospect', 'Customer', 'Visitor'], correct: ['Visitor', 'Lead', 'Prospect', 'Customer'] },
    { id: 10, difficulty: 1, instruction: 'Order the numbers from smallest to largest', scrambled: ['1000', '10', '100', '10000'], correct: ['10', '100', '1000', '10000'] }
  ],

  tracking: [
    { id: 1, difficulty: 1, instruction: 'Where is the loop of this letter?', items: [{ symbol: 'b', target: 'right' }, { symbol: 'd', target: 'left' }, { symbol: 'd', target: 'left' }, { symbol: 'b', target: 'right' }], options: [{ label: 'Left ⬅️', value: 'left' }, { label: 'Right ➡️', value: 'right' }] },
    { id: 2, difficulty: 1, instruction: 'Which way does the arrow point?', items: [{ symbol: '→', target: 'right' }, { symbol: '←', target: 'left' }, { symbol: '→', target: 'right' }, { symbol: '←', target: 'left' }], options: [{ label: 'Left ⬅️', value: 'left' }, { label: 'Right ➡️', value: 'right' }] },
    { id: 3, difficulty: 2, instruction: 'Where is the loop of this letter?', items: [{ symbol: 'p', target: 'right' }, { symbol: 'q', target: 'left' }, { symbol: 'p', target: 'right' }, { symbol: 'q', target: 'left' }], options: [{ label: 'Left ⬅️', value: 'left' }, { label: 'Right ➡️', value: 'right' }] },
    { id: 4, difficulty: 1, instruction: 'Read the word and point to that direction', items: [{ symbol: 'RIGHT', target: 'right' }, { symbol: 'LEFT', target: 'left' }, { symbol: 'RIGHT', target: 'right' }, { symbol: 'LEFT', target: 'left' }], options: [{ label: 'Left ⬅️', value: 'left' }, { label: 'Right ➡️', value: 'right' }] },
    { id: 5, difficulty: 2, instruction: 'Where is the loop of this letter?', items: [{ symbol: 'q', target: 'left' }, { symbol: 'p', target: 'right' }, { symbol: 'p', target: 'right' }, { symbol: 'q', target: 'left' }], options: [{ label: 'Left ⬅️', value: 'left' }, { label: 'Right ➡️', value: 'right' }] },
    { id: 6, difficulty: 1, instruction: 'Which way does the arrow point?', items: [{ symbol: '◁', target: 'left' }, { symbol: '▷', target: 'right' }, { symbol: '▷', target: 'right' }, { symbol: '◁', target: 'left' }], options: [{ label: 'Left ⬅️', value: 'left' }, { label: 'Right ➡️', value: 'right' }] },
    { id: 7, difficulty: 2, instruction: 'Find the odd letter out', items: [{ symbol: 'm', target: 'down' }, { symbol: 'w', target: 'up' }, { symbol: 'w', target: 'up' }, { symbol: 'm', target: 'down' }], options: [{ label: 'm (down)', value: 'down' }, { label: 'w (up)', value: 'up' }] },
    { id: 8, difficulty: 1, instruction: 'Uppercase or lowercase?', items: [{ symbol: 'A', target: 'up' }, { symbol: 'b', target: 'down' }, { symbol: 'C', target: 'up' }, { symbol: 'd', target: 'down' }], options: [{ label: 'Uppercase 🔠', value: 'up' }, { label: 'Lowercase 🔡', value: 'down' }] }
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
    { id: 10, lcwc: true, difficulty: 3, word: 'Pronunciation' },
    { id: 11, lcwc: true, difficulty: 3, word: 'Entrepreneur' },
    { id: 12, lcwc: true, difficulty: 3, word: 'Simultaneously' }
  ],

  categorization: [
    { id: 1, difficulty: 3, instruction: 'Categorize these cognitive biases', buckets: [{ id: 'social', label: 'Social Biases', icon: '👥' }, { id: 'memory', label: 'Memory Biases', icon: '🧠' }], items: [{ id: 'i1', word: 'Groupthink', bucketId: 'social' }, { id: 'i2', word: 'Hindsight bias', bucketId: 'memory' }, { id: 'i3', word: 'Bandwagon effect', bucketId: 'social' }, { id: 'i4', word: 'Misinformation effect', bucketId: 'memory' }] },
    { id: 2, difficulty: 1, tags: ['business'], instruction: 'Assign words to the correct department', buckets: [{ id: 'hr', label: 'HR', icon: '👥' }, { id: 'fin', label: 'Finance', icon: '💰' }], items: [{ id: 'i1', word: 'Budget', bucketId: 'fin' }, { id: 'i2', word: 'Recruitment', bucketId: 'hr' }, { id: 'i3', word: 'Invoice', bucketId: 'fin' }, { id: 'i4', word: 'Vacations', bucketId: 'hr' }] },
    { id: 3, difficulty: 2, instruction: 'Assign words to the correct part of speech', buckets: [{ id: 'noun', label: 'Noun (Thing)', icon: '📦' }, { id: 'verb', label: 'Verb (Action)', icon: '🏃' }], items: [{ id: 'i1', word: 'Meeting', bucketId: 'noun' }, { id: 'i2', word: 'Analyze', bucketId: 'verb' }, { id: 'i3', word: 'Decision', bucketId: 'noun' }, { id: 'i4', word: 'Calculate', bucketId: 'verb' }] },
    { id: 4, difficulty: 2, instruction: 'Assign words to the correct spelling rule', buckets: [{ id: 'ie', label: 'Spelled with IE', icon: '📝' }, { id: 'ei', label: 'Spelled with EI', icon: '📝' }], items: [{ id: 'i1', word: 'Believe', bucketId: 'ie' }, { id: 'i2', word: 'Receive', bucketId: 'ei' }, { id: 'i3', word: 'Achieve', bucketId: 'ie' }, { id: 'i4', word: 'Deceive', bucketId: 'ei' }] },
    { id: 5, difficulty: 1, instruction: 'Categorize by word type', buckets: [{ id: 'adj', label: 'Adjective', icon: '✨' }, { id: 'adv', label: 'Adverb', icon: '🏃' }], items: [{ id: 'i1', word: 'Quick', bucketId: 'adj' }, { id: 'i2', word: 'Quickly', bucketId: 'adv' }, { id: 'i3', word: 'Happy', bucketId: 'adj' }, { id: 'i4', word: 'Happily', bucketId: 'adv' }] },
    { id: 6, difficulty: 2, instruction: 'Categorize homophones', buckets: [{ id: 'place', label: 'Location/Place', icon: '📍' }, { id: 'pos', label: 'Possession', icon: '👥' }], items: [{ id: 'i1', word: 'There', bucketId: 'place' }, { id: 'i2', word: 'Their', bucketId: 'pos' }, { id: 'i3', word: 'Here', bucketId: 'place' }, { id: 'i4', word: 'Our', bucketId: 'pos' }] },
    { id: 7, difficulty: 3, instruction: 'Categorize prefixes and suffixes', buckets: [{ id: 'pre', label: 'Prefix', icon: '⬅️' }, { id: 'suf', label: 'Suffix', icon: '➡️' }], items: [{ id: 'i1', word: 'Un-', bucketId: 'pre' }, { id: 'i2', word: '-ment', bucketId: 'suf' }, { id: 'i3', word: 'Re-', bucketId: 'pre' }, { id: 'i4', word: '-tion', bucketId: 'suf' }] },
    { id: 8, difficulty: 1, instruction: 'Categorize by double letters', buckets: [{ id: 'double', label: 'Double Letter', icon: '🔠' }, { id: 'single', label: 'Single Letter', icon: '🔡' }], items: [{ id: 'i1', word: 'Apple', bucketId: 'double' }, { id: 'i2', word: 'Banana', bucketId: 'single' }, { id: 'i3', word: 'Letter', bucketId: 'double' }, { id: 'i4', word: 'Word', bucketId: 'single' }] },
    { id: 9, difficulty: 2, instruction: 'Categorize by business department', buckets: [{ id: 'it', label: 'IT', icon: '💻' }, { id: 'sales', label: 'Sales', icon: '📈' }], items: [{ id: 'i1', word: 'Server', bucketId: 'it' }, { id: 'i2', word: 'Revenue', bucketId: 'sales' }, { id: 'i3', word: 'Database', bucketId: 'it' }, { id: 'i4', word: 'Lead', bucketId: 'sales' }] },
    { id: 10, difficulty: 1, instruction: 'Categorize by time', buckets: [{ id: 'past', label: 'Past', icon: '⏪' }, { id: 'future', label: 'Future', icon: '⏩' }], items: [{ id: 'i1', word: 'Yesterday', bucketId: 'past' }, { id: 'i2', word: 'Tomorrow', bucketId: 'future' }, { id: 'i3', word: 'Previously', bucketId: 'past' }, { id: 'i4', word: 'Soon', bucketId: 'future' }] },
    { id: 11, difficulty: 1, instruction: 'Fruit or Vegetable?', buckets: [{ id: 'fruit', label: 'Fruit', icon: '🍎' }, { id: 'veg', label: 'Vegetable', icon: '🥕' }], items: [{ id: 'i1', word: 'Apple', bucketId: 'fruit' }, { id: 'i2', word: 'Carrot', bucketId: 'veg' }, { id: 'i3', word: 'Pear', bucketId: 'fruit' }, { id: 'i4', word: 'Onion', bucketId: 'veg' }] },
    { id: 12, difficulty: 2, instruction: 'Positive or Negative?', buckets: [{ id: 'pos', label: 'Positive', icon: '👍' }, { id: 'neg', label: 'Negative', icon: '👎' }], items: [{ id: 'i1', word: 'Success', bucketId: 'pos' }, { id: 'i2', word: 'Failure', bucketId: 'neg' }, { id: 'i3', word: 'Profit', bucketId: 'pos' }, { id: 'i4', word: 'Loss', bucketId: 'neg' }] }
  ],

  dictation: [
    { id: 1, dictation: true, difficulty: 3, audioPrompt: 'Continuous learning is essential in a rapidly evolving professional landscape.', correct: 'Continuous learning is essential in a rapidly evolving professional landscape' },
    { id: 2, dictation: true, difficulty: 1, audioPrompt: 'The meeting is scheduled for tomorrow.', correct: 'The meeting is scheduled for tomorrow' },
    { id: 3, dictation: true, difficulty: 2, audioPrompt: 'Please review the attached document.', correct: 'Please review the attached document' },
    { id: 4, dictation: true, difficulty: 2, audioPrompt: 'The company has seen significant growth.', correct: 'The company has seen significant growth' },
    { id: 5, dictation: true, difficulty: 2, audioPrompt: 'We need to update the project timeline.', correct: 'We need to update the project timeline' },
    { id: 6, dictation: true, difficulty: 3, audioPrompt: 'It is necessary to accommodate their request.', correct: 'It is necessary to accommodate their request' },
    { id: 7, dictation: true, difficulty: 2, audioPrompt: 'The committee reached a unanimous decision.', correct: 'The committee reached a unanimous decision' },
    { id: 8, dictation: true, difficulty: 2, audioPrompt: 'Their knowledge of the subject is thorough.', correct: 'Their knowledge of the subject is thorough' },
    { id: 9, dictation: true, difficulty: 3, audioPrompt: 'The principal addressed the new principle.', correct: 'The principal addressed the new principle' },
    { id: 10, dictation: true, difficulty: 2, audioPrompt: 'I can definitely recommend this strategy.', correct: 'I can definitely recommend this strategy' },
    { id: 11, dictation: true, difficulty: 2, audioPrompt: 'The invoice must be paid by Friday.', correct: 'The invoice must be paid by Friday' },
    { id: 12, dictation: true, difficulty: 3, audioPrompt: 'The results of the analysis were very surprising.', correct: 'The results of the analysis were very surprising' }
  ],

  diagnostic: [
    {
      id: 'en_diag_1',
      pillar: 'Literacy',
      difficulty: 4,
      focus: 'Diagnostic: Reading & Writing',
      questions: { en: 'Read the following excerpt from a corporate email. Select the option that contains absolutely no orthographic, semantic, or homophone errors.' },
      options: [
        { text: "A. The principle reason for the board meeting is to ensure the new policy doesn't effect our profit margins.", isCorrect: false },
        { text: "B. The principal reason for the broad meeting is to ensure the new policy doesn't affect our profit margins.", isCorrect: false },
        { text: "C. The principal reason for the board meeting is to ensure the new policy doesn't affect our profit margins.", isCorrect: true },
        { text: "D. The principal reason for the board meeting is to insure the new policy doesn't affect our profit margens.", isCorrect: false }
      ]
    },
    {
      id: 'en_diag_2',
      pillar: 'Visual',
      difficulty: 4,
      focus: 'Diagnostic: Vision & Space',
      questions: { en: 'Scan the provided data string of client request codes below.\n\n[ TRIAL-FORM-DISCREET | TRAIL-FROM-DISCRETE | TRIAL-FROM-DISCREET | TRAIL-FORM-DISCRETE ]\n\nA client submitted a "TRIAL" request "FROM" a "DISCREET" server. Which of the data clusters matches this exact sequence without any visual metathesis (swapping) or homophone errors?' },
      options: [
        { text: 'TRAIL-FROM-DISCRETE', isCorrect: false },
        { text: 'TRIAL-FORM-DISCREET', isCorrect: false },
        { text: 'TRIAL-FROM-DISCREET', isCorrect: true },
        { text: 'TRAIL-FORM-DISCRETE', isCorrect: false }
      ]
    },
    {
      id: 'en_diag_3',
      pillar: 'Cognitive',
      difficulty: 4,
      focus: 'Diagnostic: Logic & Memory',
      questions: { en: 'Evaluate the logical constraints of the following project deployment schedule:\n\nIf the design phase precedes the testing phase, the launch proceeds on Friday. If testing precedes design, the launch is delayed. The CEO mandates that testing must not precede design, but due to a scheduling error, the development team accidentally swapped the phases.\n\nBased on the CEO\'s mandate versus the team\'s actual sequence of actions, what is the ultimate operational outcome?' },
      options: [
        { text: 'The design phase precedes testing, so the launch proceeds on Friday.', isCorrect: false },
        { text: 'Testing precedes design, therefore the launch is delayed.', isCorrect: true },
        { text: 'The launch proceeds seamlessly because the CEO explicitly mandated it.', isCorrect: false },
        { text: 'The testing phase is completely swapped with the final launch phase.', isCorrect: false }
      ]
    },
    { id: 'en_diag_4', pillar: 'Literacy', difficulty: 3, focus: 'Diagnostic: Spelling', questions: { en: 'Which of the following is spelled correctly?' }, options: [{ text: 'Accommodate', isCorrect: true }, { text: 'Accomodate', isCorrect: false }, { text: 'Acommodate', isCorrect: false }, { text: 'Acomodate', isCorrect: false }] },
    { id: 'en_diag_5', pillar: 'Visual', difficulty: 2, focus: 'Diagnostic: Visual Discrimination', questions: { en: 'Identify the odd one out in this sequence:\n\n b b b d b b' }, options: [{ text: 'The 3rd letter', isCorrect: false }, { text: 'The 4th letter', isCorrect: true }, { text: 'The 5th letter', isCorrect: false }, { text: 'The 6th letter', isCorrect: false }] },
    { id: 'en_diag_6', pillar: 'Cognitive', difficulty: 3, focus: 'Diagnostic: Working Memory', questions: { en: 'If the meeting is moved from 2 PM to 4 PM, and then delayed by another half hour, what time does it start?' }, options: [{ text: '4:00 PM', isCorrect: false }, { text: '4:30 PM', isCorrect: true }, { text: '2:30 PM', isCorrect: false }, { text: '5:00 PM', isCorrect: false }] },
    { id: 'en_diag_7', pillar: 'Literacy', difficulty: 2, focus: 'Diagnostic: Homophones', questions: { en: 'Choose the correct word: "The dog wagged ___ tail."' }, options: [{ text: 'its', isCorrect: true }, { text: 'it\'s', isCorrect: false }, { text: 'its\'', isCorrect: false }, { text: 'it', isCorrect: false }] },
    { id: 'en_diag_8', pillar: 'Visual', difficulty: 3, focus: 'Diagnostic: Letter Reversal', questions: { en: 'Which word contains a reversed letter?\n\n m a r k e t i n g \n d e v e l o p m e n t \n s t r a t e q y \n c o m m i t t e e' }, options: [{ text: 'marketing', isCorrect: false }, { text: 'development', isCorrect: false }, { text: 'strateqy', isCorrect: true }, { text: 'committee', isCorrect: false }] },
    { id: 'en_diag_9', pillar: 'Cognitive', difficulty: 2, focus: 'Diagnostic: Categorization', questions: { en: 'Which of the following does NOT belong in a group of financial terms?' }, options: [{ text: 'Budget', isCorrect: false }, { text: 'Invoice', isCorrect: false }, { text: 'Recruitment', isCorrect: true }, { text: 'Revenue', isCorrect: false }] },
    { id: 'en_diag_10', pillar: 'Literacy', difficulty: 3, focus: 'Diagnostic: Syllable Segmentation', questions: { en: 'How many syllables are in the word "Responsibility"?' }, options: [{ text: '4', isCorrect: false }, { text: '5', isCorrect: false }, { text: '6', isCorrect: true }, { text: '7', isCorrect: false }] }
  ]
};
