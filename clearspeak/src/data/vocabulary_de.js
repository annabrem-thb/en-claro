// vocabularyDE.js — Erwachsene mit Legasthenie — Deutsche Ausgabe v1
// 15 Einträge pro Kategorie
// Schwerpunkte: ie/ei-Verwechslung, ss/ß, dass/das, ä/e/ö/u-Verwechslung,
//   Groß-/Kleinschreibung, stimmhafte Auslautverhärtung (d→t, b→p, g→k),
//   Dehnungs-h, Fremdwörter mit ph/v/qu, Doppelkonsonanten, Komposita.
// Hinweissprachen: DE (primär) / PL / EN

export const wordDatabaseDE = {
  // ─────────────────────────────────────────────────────────────────────────────
  // KATEGORIE: PHONEM
  // Wörter, deren Aussprache bei Legasthenikern zu Leseblockaden führt:
  // Anlautcluster, unbekannte Lautmuster, Fremdwortbetonung.
  // ─────────────────────────────────────────────────────────────────────────────
  phonemes: [
    {
      id: 1,
      difficulty: 2,
      tags: ['business'],
      word: 'Qualifikation',
      phonetic: '/ kvaːlɪfɪkaˈt͡si̯oːn /',
      hints: { de: 'Eignung oder Befähigung für eine Aufgabe' }
    },
    {
      id: 2,
      difficulty: 3,
      tags: ['everyday'],
      word: 'Psychiatrie',
      phonetic: '/ psyçiˈatʁiː /',
      hints: { de: 'Medizinisches Fachgebiet für seelische Erkrankungen' }
    },
    {
      id: 3,
      difficulty: 2,
      tags: ['everyday'],
      word: 'Rhythmus',
      phonetic: '/ ˈʁʏtmʊs /',
      hints: { de: 'Gleichmäßige Abfolge von Tönen oder Bewegungen' }
    },
    {
      id: 4,
      difficulty: 3,
      tags: ['business'],
      word: 'Choreographie',
      phonetic: '/ koʁeoɡʁaˈfiː /',
      hints: { de: 'Erfindung und Einstudierung von Tänzen' }
    },
    {
      id: 5,
      difficulty: 2,
      tags: ['business'],
      word: 'Verantwortung',
      phonetic: '/ fɛˈʁantvɔʁtʊŋ /',
      hints: { de: 'Verpflichtung, für die Folgen einer Handlung einzustehen' }
    },
    {
      id: 6,
      difficulty: 3,
      tags: ['business'],
      word: 'Schlüsselkompetenz',
      phonetic: '/ ˈʃlʏsl̩kɔmpəˌtɛnt͡s /',
      hints: { de: 'Besonders wichtige Fähigkeit im Berufsleben' }
    },
    {
      id: 7,
      difficulty: 2,
      tags: ['everyday'],
      word: 'Beschleunigung',
      phonetic: '/ bəˈʃlɔʏ̯nɪɡʊŋ /',
      hints: { de: 'Prozess, bei dem etwas schneller wird' }
    },
    {
      id: 8,
      difficulty: 2,
      tags: ['business'],
      word: 'Widersprüchlich',
      phonetic: '/ ˈviːdɐʃpʁʏçlɪç /',
      hints: { de: 'Gegensätzlich, nicht übereinstimmend' }
    },
    {
      id: 9,
      difficulty: 1,
      tags: ['everyday'],
      word: 'Baum',
      phonetic: '/ baʊm /',
      hints: { de: 'Große Pflanze mit Stamm und Blättern' }
    },
    {
      id: 10,
      difficulty: 1,
      tags: ['everyday'],
      word: 'Apfel',
      phonetic: '/ ˈapfəl /',
      hints: { de: 'Beliebtes rundes Obst, oft rot oder grün' }
    },
    {
      id: 11,
      difficulty: 3,
      tags: ['everyday'],
      word: 'Portemonnaie',
      phonetic: '/ pɔʁtmɔˈneː /',
      hints: { de: 'Anderes Wort für Geldbeutel (aus dem Französischen)' }
    },
    {
      id: 12,
      difficulty: 3,
      tags: ['business'],
      word: 'Enthusiasmus',
      phonetic: '/ ɛntuzi̯ˈasmʊs /',
      hints: { de: 'Begeisterung oder leidenschaftlicher Eifer' }
    },
    {
      id: 13,
      difficulty: 3,
      tags: ['business'],
      word: 'Ressource',
      phonetic: '/ ʁɛˈsʊʁsə /',
      hints: { de: 'Mittel, Gegebenheit, wie z.B. Rohstoffe oder Personal', en: 'Resource', pl: 'Zasoby' }
    },
    {
      id: 14,
      difficulty: 2,
      tags: ['everyday'],
      word: 'Authentisch',
      phonetic: '/ aʊ̯ˈtɛntɪʃ /',
      hints: { de: 'Echt, nicht gefälscht', en: 'Authentic', pl: 'Autentyczny' }
    }
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  // KATEGORIE: GRAPHEM
  // 15 deutsche Rechtschreibregeln — häufigste Fehlerquellen bei Legasthenikern.
  // ─────────────────────────────────────────────────────────────────────────────
  graphemes: [
    {
      id: 1,
      difficulty: 1,
      focus: 'ie / ei — Verwechslung der Vokalkombinationen',
      questions: {
        de: "Welches Wort wird mit ‚ie' geschrieben? (sprich: langes i)",
        pl: "Które słowo pisze się przez ‚ie'? (wymawia się jako długie i)",
        en: "Which word is written with 'ie'? (pronounced as a long i)",
      },
      options: [
        { text: 'Brief', isCorrect: true, icon: '✉️' },
        { text: 'Klein', isCorrect: false, icon: '🤏' },
        { text: 'Breif', isCorrect: false, icon: '❌' },
        { text: 'Klien', isCorrect: false, icon: '❌' }
      ],
    },
    {
      id: 2,
      difficulty: 1,
      focus: 'dass / das — subordinating conjunction vs. article/pronoun',
      questions: {
        de: "Welches ‚dass' / ‚das' passt? — Ich glaube, ___ er kommt.",
        pl: "Które ‚dass' / ‚das' pasuje? — Wierzę, ___ że on przyjdzie.",
        en: "Which 'dass'/'das' fits? — I believe ___ he is coming.",
      },
      options: [
        { text: 'dass', isCorrect: true, icon: '💬' },
        { text: 'das', isCorrect: false, icon: '❌' },
        { text: 'daß', isCorrect: false, icon: '❌' },
        { text: 'daas', isCorrect: false, icon: '❌' }
      ],
    },
    {
      id: 3,
      difficulty: 1,
      focus: 'ss / ß — nach kurzem Vokal ss, nach langem Vokal/Diphthong ß',
      questions: {
        de: 'Welche Schreibung ist korrekt? — Ich ___e die Straße entlang.',
        pl: 'Która pisownia jest poprawna? — Idę wzdłuż ulicy.',
        en: 'Which spelling is correct? — I walk along the street.',
      },
      options: [
        { text: 'Straße', isCorrect: true, icon: '🛣️' },
        { text: 'Strasse', isCorrect: false, icon: '❌' },
        { text: 'Strase', isCorrect: false, icon: '❌' },
        { text: 'Straze', isCorrect: false, icon: '❌' }
      ],
    },
    {
      id: 4,
      difficulty: 1,
      focus: 'Auslautverhärtung — d → t am Wortende',
      questions: {
        de: "Wie lautet die korrekte Schreibung? (der Plural ist ‚Hunde')",
        pl: "Jak brzmi poprawna pisownia? (liczba mnoga to ‚Hunde')",
        en: "What is the correct spelling? (the plural is 'Hunde')",
      },
      options: [
        { text: 'Hund', isCorrect: true, icon: '🐾' },
        { text: 'Hunt', isCorrect: false, icon: '❌' },
        { text: 'Hunnt', isCorrect: false, icon: '❌' },
        { text: 'Hunnd', isCorrect: false, icon: '❌' }
      ],
    },
    {
      id: 5,
      difficulty: 1,
      focus: 'Auslautverhärtung — b → p am Wortende',
      questions: {
        de: "Wie lautet die korrekte Schreibung? (der Plural ist ‚Diebe')",
        pl: "Jak brzmi poprawna pisownia? (liczba mnoga to ‚Diebe')",
        en: "What is the correct spelling? (the plural is 'Diebe')",
      },
      options: [
        { text: 'Dieb', isCorrect: true, icon: '👤' },
        { text: 'Diep', isCorrect: false, icon: '❌' },
        { text: 'Diip', isCorrect: false, icon: '❌' },
        { text: 'Dihb', isCorrect: false, icon: '❌' }
      ],
    },
    {
      id: 6,
      difficulty: 1,
      focus: 'Auslautverhärtung — g → k am Wortende',
      questions: {
        de: "Wie lautet die korrekte Schreibung? (der Plural ist ‚Tage')",
        pl: "Jak brzmi poprawna pisownia? (liczba mnoga to ‚Tage')",
        en: "What is the correct spelling? (the plural is 'Tage')",
      },
      options: [
        { text: 'Tag', isCorrect: true, icon: '📅' },
        { text: 'Tak', isCorrect: false, icon: '❌' },
        { text: 'Tack', isCorrect: false, icon: '❌' },
        { text: 'Tagg', isCorrect: false, icon: '❌' }
      ],
    },
    {
      id: 7,
      difficulty: 2,
      focus: 'Dehnungs-h — stilles h nach langem Vokal',
      questions: {
        de: "Welche Schreibung des Wortes für ‚Verkehrsmittel auf Schienen' ist korrekt?",
        pl: "Która pisownia słowa oznaczającego ‚środek transportu szynowego' jest poprawna?",
        en: "Which spelling of the word for 'rail transport' is correct?",
      },
      options: [
        { text: 'Bahn', isCorrect: true, icon: '🚂' },
        { text: 'Ban', isCorrect: false, icon: '❌' },
        { text: 'Baan', isCorrect: false, icon: '❌' },
        { text: 'Bann', isCorrect: false, icon: '❌' }
      ],
    },
    {
      id: 8,
      difficulty: 1,
      focus: 'Großschreibung — Substantive groß, Adjektive klein',
      questions: {
        de: 'Was ist korrekt? Der ___ Lehrer erklärte das Thema sehr gut.',
        pl: 'Co jest poprawne? Dobry nauczyciel wyjaśnił temat bardzo dobrze.',
        en: 'What is correct? The good teacher explained the topic very well.',
      },
      options: [
        { text: 'gute', isCorrect: true, icon: '👨‍🏫' },
        { text: 'Gute', isCorrect: false, icon: '❌' },
        { text: 'gutte', isCorrect: false, icon: '❌' },
        { text: 'Gutte', isCorrect: false, icon: '❌' }
      ],
    },
    {
      id: 9,
      difficulty: 2,
      focus: 'v → f-Laut in einheimischen Wörtern',
      questions: {
        de: 'Welches einheimische Wort beginnt mit v, wird aber wie f gesprochen?',
        pl: 'Które rodzime słowo zaczyna się od v, ale wymawia się jak f?',
        en: 'Which native German word starts with v but is pronounced like f?',
      },
      options: [
        { text: 'Vogel', isCorrect: true, icon: '🐦' },
        { text: 'Vase', isCorrect: false, icon: '🪴' },
        { text: 'Fogel', isCorrect: false, icon: '❌' },
        { text: 'Fase', isCorrect: false, icon: '❌' }
      ],
    },
    {
      id: 10,
      difficulty: 2,
      focus: 'ph = f in Fremdwörtern',
      questions: {
        de: 'Welche Schreibung des Fachs für Körperpflege und Medikamente ist korrekt?',
        pl: 'Która pisownia określenia placówki z lekami i produktami do higieny jest poprawna?',
        en: 'Which spelling of the word for the shop selling medicines is correct?',
      },
      options: [
        { text: 'Apotheke', isCorrect: true, icon: '💊' },
        { text: 'Apoteke', isCorrect: false, icon: '❌' },
        { text: 'Appotheke', isCorrect: false, icon: '❌' },
        { text: 'Abotheke', isCorrect: false, icon: '❌' }
      ],
    },
    {
      id: 11,
      difficulty: 2,
      focus: 'tz statt z nach kurzem Vokal',
      questions: {
        de: 'Wie schreibt man das Wort für einen Ort, an dem man sitzt?',
        pl: 'Jak pisze się słowo oznaczające miejsce, gdzie się siedzi?',
        en: 'How do you spell the word for a place where you sit?',
      },
      options: [
        { text: 'Platz', isCorrect: true, icon: '💺' },
        { text: 'Plaz', isCorrect: false, icon: '❌' },
        { text: 'Plahtz', isCorrect: false, icon: '❌' },
        { text: 'Plazz', isCorrect: false, icon: '❌' }
      ],
    },
    {
      id: 12,
      difficulty: 1,
      focus: 'ck statt k nach kurzem Vokal',
      questions: {
        de: 'Wie heißt das Kleidungsstück für den Unterkörper?',
        pl: 'Jak nazywa się część ubrania na dolną część ciała?',
        en: 'What is the word for the piece of clothing for the lower body?',
      },
      options: [
        { text: 'Rock', isCorrect: true, icon: '👗' },
        { text: 'Rok', isCorrect: false, icon: '❌' },
        { text: 'Rokk', isCorrect: false, icon: '❌' },
        { text: 'Rog', isCorrect: false, icon: '❌' }
      ],
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  // KATEGORIE: SILBEN
  // Lange Komposita und Fremdwörter — typische Leseblockaden bei Erwachsenen.
  // ─────────────────────────────────────────────────────────────────────────────
  syllables: [
    {
      id: 1,
      difficulty: 2,
      tags: ['business'],
      word: 'Verantwortung',
      segments: ['Ver', 'ant', 'wor', 'tung'],
      icon: '⚖️',
    },
    {
      id: 2,
      difficulty: 1,
      tags: ['business'],
      word: 'Beschäftigung',
      segments: ['Be', 'schäf', 'ti', 'gung'],
      icon: '💼',
    },
    {
      id: 3,
      difficulty: 2,
      tags: ['business'],
      word: 'Arbeitslosigkeit',
      segments: ['Ar', 'beits', 'lo', 'sig', 'keit'],
      icon: '📉',
    },
    {
      id: 4,
      difficulty: 3,
      tags: ['medicine', 'business'],
      word: 'Krankenversicherung',
      segments: ['Kran', 'ken', 'ver', 'si', 'che', 'rung'],
      icon: '🏥',
    },
    {
      id: 5,
      difficulty: 3,
      word: 'Auseinandersetzung',
      segments: ['Aus', 'ein', 'an', 'der', 'set', 'zung'],
      icon: '🤝',
    },
    {
      id: 6,
      difficulty: 1,
      word: 'Geschwindigkeit',
      segments: ['Ge', 'schwin', 'dig', 'keit'],
      icon: '🚀',
    },
    {
      id: 7,
      difficulty: 2,
      word: 'Wahrscheinlichkeit',
      segments: ['Wahr', 'schein', 'lich', 'keit'],
      icon: '🎲',
    },
    {
      id: 8,
      difficulty: 2,
      word: 'Selbstständigkeit',
      segments: ['Selbst', 'stän', 'dig', 'keit'],
      icon: '🏢',
    },
    {
      id: 9,
      difficulty: 2,
      word: 'Wohngemeinschaft',
      segments: ['Wohn', 'ge', 'mein', 'schaft'],
      icon: '🏠',
    },
    {
      id: 10,
      difficulty: 3,
      word: 'Informationsgesellschaft',
      segments: ['In', 'for', 'ma', 'ti', 'ons', 'ge', 'sell', 'schaft'],
      icon: '💻',
    },
    {
      id: 11,
      difficulty: 3,
      word: 'Unabhängigkeit',
      segments: ['Un', 'ab', 'hän', 'gig', 'keit'],
      icon: '🦅',
    },
    {
      id: 12,
      difficulty: 2,
      word: 'Zuverlässigkeit',
      segments: ['Zu', 'ver', 'läs', 'sig', 'keit'],
      icon: '🤝',
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  // KATEGORIE: WORTBILD (Buchstaben-Scramble)
  // Orthographische Problemwörter für Erwachsene — ie/ei, ss/ß, Umlaute,
  // Fremdwörter, stummes h, Doppelkonsonanten.
  // ─────────────────────────────────────────────────────────────────────────────
  scrabble: [
    {
      id: 1,
      difficulty: 3,
      word: 'RHYTHMUS',
      scrambled: ['R', 'H', 'Y', 'T', 'H', 'M', 'U', 'S'],
      distractors: ['I', 'E'],
      image: '🥁',
    },
    {
      id: 2,
      difficulty: 3,
      tags: ['medicine'],
      word: 'PSYCHOLOGIE',
      scrambled: ['P', 'S', 'Y', 'C', 'H', 'O', 'L', 'O', 'G', 'I', 'E'],
      distractors: ['I', 'S'],
      image: '🧠',
    },
    {
      id: 3,
      difficulty: 2,
      tags: ['business'],
      word: 'VERANTWORTUNG',
      scrambled: [
        'V',
        'E',
        'R',
        'A',
        'N',
        'T',
        'W',
        'O',
        'R',
        'T',
        'U',
        'N',
        'G',
      ],
      distractors: ['F', 'D'],
      image: '⚖️',
    },
    {
      id: 4,
      difficulty: 2,
      word: 'GLEICHGEWICHT',
      scrambled: [
        'G',
        'L',
        'E',
        'I',
        'C',
        'H',
        'G',
        'E',
        'W',
        'I',
        'C',
        'H',
        'T',
      ],
      distractors: ['K', 'F'],
      image: '⚖️',
    },
    {
      id: 5,
      difficulty: 2,
      tags: ['business'],
      word: 'QUALIFIKATION',
      scrambled: [
        'Q',
        'U',
        'A',
        'L',
        'I',
        'F',
        'I',
        'K',
        'A',
        'T',
        'I',
        'O',
        'N',
      ],
      distractors: ['K', 'W'],
      image: '🎓',
    },
    {
      id: 6,
      difficulty: 1,
      word: 'BESCHÄFTIGUNG',
      scrambled: [
        'B',
        'E',
        'S',
        'C',
        'H',
        'Ä',
        'F',
        'T',
        'I',
        'G',
        'U',
        'N',
        'G',
      ],
      distractors: ['E', 'K'],
      image: '💼',
    },
    {
      id: 7,
      difficulty: 2,
      word: 'WAHRSCHEINLICH',
      scrambled: [
        'W',
        'A',
        'H',
        'R',
        'S',
        'C',
        'H',
        'E',
        'I',
        'N',
        'L',
        'I',
        'C',
        'H',
      ],
      distractors: ['R', 'V'],
      image: '🎲',
    },
    {
      id: 8,
      difficulty: 2,
      tags: ['business'],
      word: 'SELBSTSTÄNDIG',
      scrambled: [
        'S',
        'E',
        'L',
        'B',
        'S',
        'T',
        'S',
        'T',
        'Ä',
        'N',
        'D',
        'I',
        'G',
      ],
      distractors: ['E', 'K'],
      image: '🏢',
    },
    {
      id: 9,
      difficulty: 2,
      word: 'ZUSAMMENARBEIT',
      scrambled: [
        'Z',
        'U',
        'S',
        'A',
        'M',
        'M',
        'E',
        'N',
        'A',
        'R',
        'B',
        'E',
        'I',
        'T',
      ],
      distractors: ['S', 'P'],
      image: '🤝',
    },
    {
      id: 10,
      difficulty: 1,
      word: 'GESELLSCHAFT',
      scrambled: ['G', 'E', 'S', 'E', 'L', 'L', 'S', 'C', 'H', 'A', 'F', 'T'],
      distractors: ['Z', 'K'],
      image: '👥',
    },
    {
      id: 11,
      difficulty: 3,
      word: 'AUTHENTISCH',
      scrambled: ['A', 'U', 'T', 'H', 'E', 'N', 'T', 'I', 'S', 'C', 'H'],
      distractors: ['F', 'M'],
      image: '💎',
    },
    {
      id: 12,
      difficulty: 3,
      word: 'BÜROKRATIE',
      scrambled: ['B', 'Ü', 'R', 'O', 'K', 'R', 'A', 'T', 'I', 'E'],
      distractors: ['U', 'C'],
      image: '🏢',
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  // KATEGORIE: KONTEXT
  // 15 Sätze mit Berufswortschatz — jeder testet eine spezifische Regel.
  // ─────────────────────────────────────────────────────────────────────────────
  context: [
    {
      id: 1,
      difficulty: 1,
      tags: ['business'],
      sentence_part1: 'Er glaubt,',
      sentence_part2: 'die neue Regelung rechtzeitig in Kraft tritt.',
      options: [
        { text: 'dass', isCorrect: true },
        { text: 'das', isCorrect: false },
        { text: 'daß', isCorrect: false },
        { text: 'daas', isCorrect: false }
      ],
      hints: {
        de: "‚dass' ist hier eine Konjunktion (Bindewort), man kann es nicht durch dies/jenes ersetzen.",
        en: "'dass' = subordinating conjunction (that); 'das' = article or pronoun (the/which)",
      },
    },
    {
      id: 2,
      difficulty: 1,
      tags: ['everyday', 'business'],
      sentence_part1: 'Bitte unterschreiben Sie',
      sentence_part2: 'Dokument auf Seite drei.',
      options: [
        { text: 'das', isCorrect: true },
        { text: 'dass', isCorrect: false },
        { text: 'daß', isCorrect: false },
        { text: 'daas', isCorrect: false }
      ],
      hints: {
        de: "‚das' ist hier der bestimmte Artikel zu dem Wort Dokument.",
        en: "'das' here = definite article for a neuter noun",
      },
    },
    {
      id: 3,
      difficulty: 1,
      tags: ['business'],
      sentence_part1: 'Das Unternehmen trägt die volle',
      sentence_part2: 'für den entstandenen Schaden.',
      options: [
        { text: 'Verantwortung', isCorrect: true },
        { text: 'verantwortung', isCorrect: false },
        { text: 'Verantvortung', isCorrect: false },
        { text: 'verantvortung', isCorrect: false }
      ],
      hints: {
        de: 'Nomen werden im Deutschen immer großgeschrieben.',
        en: 'All nouns in German are capitalised — Verantwortung is a noun',
      },
    },
    {
      id: 4,
      difficulty: 2,
      sentence_part1: 'Die Konferenz findet morgen in',
      sentence_part2: 'Hauptgebäude statt.',
      options: [
        { text: 'unserem', isCorrect: true },
        { text: 'unserm', isCorrect: false },
        { text: 'unseren', isCorrect: false },
        { text: 'unsrem', isCorrect: false }
      ],
      hints: {
        de: 'Dativ: Die Endung -em muss komplett ausgeschrieben werden (unserem).',
        en: 'Dative masculine/neuter: unserem — the dative ending -em must be complete',
      },
    },
    {
      id: 5,
      difficulty: 1,
      sentence_part1: 'Die neue Regelung',
      sentence_part2: 'alle Mitarbeiterinnen und Mitarbeiter.',
      options: [
        { text: 'betrifft', isCorrect: true },
        { text: 'betrift', isCorrect: false },
        { text: 'betrieft', isCorrect: false },
        { text: 'betriefft', isCorrect: false }
      ],
      hints: {
        de: 'Nach dem kurzen i wird der Konsonant f verdoppelt (ff).',
        en: 'treffen → betreffen → betrifft: the double f comes from the short vowel before it',
      },
    },
    {
      id: 6,
      difficulty: 1,
      sentence_part1: 'Herr Müller hat seinen',
      sentence_part2: 'bereits unterschrieben.',
      options: [
        { text: 'Arbeitsvertrag', isCorrect: true },
        { text: 'Arbeits Vertrag', isCorrect: false },
        { text: 'Arbeits-Vertrag', isCorrect: false },
        { text: 'arbeitvertrag', isCorrect: false }
      ],
      hints: {
        de: 'Zusammengesetzte Nomen (Komposita) werden im Deutschen zusammen geschrieben.',
        en: 'German compound nouns are always written as one word, never separated',
      },
    },
    {
      id: 7,
      difficulty: 1,
      sentence_part1: 'Das Projekt wurde',
      sentence_part2: 'abgeschlossen.',
      options: [
        { text: 'erfolgreich', isCorrect: true },
        { text: 'Erfolgreich', isCorrect: false },
        { text: 'erfolgreih', isCorrect: false },
        { text: 'erfolkreich', isCorrect: false }
      ],
      hints: {
        de: 'Adjektive und Adverbien werden im Deutschen kleingeschrieben.',
        en: 'erfolgreich is an adjective/adverb — adjectives and adverbs are NOT capitalised in German',
      },
    },
    {
      id: 8,
      difficulty: 2,
      sentence_part1: 'Die Bewerberin verfügt über eine hervorragende',
      sentence_part2: 'im Projektmanagement.',
      options: [
        { text: 'Qualifikation', isCorrect: true },
        { text: 'Qualifiqation', isCorrect: false },
        { text: 'Kwalifikation', isCorrect: false },
        { text: 'Qualifikatzion', isCorrect: false }
      ],
      hints: {
        de: 'Die Endung -tion wird immer mit t geschrieben, nie mit q oder z.',
        en: 'Foreign suffix -tion is always written with t (never z or q)',
      },
    },
    {
      id: 9,
      difficulty: 1,
      sentence_part1: 'Das Auto fuhr mit hoher',
      sentence_part2: 'durch die Stadt.',
      options: [
        { text: 'Geschwindigkeit', isCorrect: true },
        { text: 'Geschwindichkeit', isCorrect: false },
        { text: 'Geschwindigkheit', isCorrect: false },
        { text: 'Geschwindigkeid', isCorrect: false }
      ],
      hints: {
        de: 'Die Endung ist -igkeit (geschwind + ig + keit), nicht -ichkeit.',
        en: 'The suffix is -igkeit (from geschwind + ig + keit), not -ichkeit',
      },
    },
    {
      id: 10,
      difficulty: 2,
      tags: ['medicine'],
      sentence_part1: 'Die Krankenversicherung',
      sentence_part2: 'die Kosten für die Operation.',
      options: [
        { text: 'übernimmt', isCorrect: true },
        { text: 'übernimpt', isCorrect: false },
        { text: 'übernimt', isCorrect: false },
        { text: 'übernimmpt', isCorrect: false }
      ],
      hints: {
        de: 'Kommt von nehmen. In der 3. Person Singular wird das m verdoppelt (nimmt).',
        en: 'From nehmen: the m is doubled in the 3rd person singular (nimmt).',
      },
    },
    {
      id: 11,
      difficulty: 2,
      tags: ['business'],
      sentence_part1: 'Wir warten schon',
      sentence_part2: 'drei Stunden auf das Ergebnis.',
      options: [
        { text: 'seit', isCorrect: true },
        { text: 'seid', isCorrect: false },
        { text: 'seidt', isCorrect: false },
        { text: 'seith', isCorrect: false }
      ],
      hints: {
        de: "‚seit' verwendet man bei Zeitangaben (seit wann?). ‚seid' ist ein Verb (ihr seid).",
        en: "'seit' is for time (since), 'seid' is the verb (you are).",
      },
    },
    {
      id: 12,
      difficulty: 3,
      tags: ['everyday'],
      sentence_part1: 'Der Aktivist leistete großen',
      sentence_part2: 'gegen die neuen Pläne.',
      options: [
        { text: 'Widerstand', isCorrect: true },
        { text: 'Wiederstand', isCorrect: false },
        { text: 'Wieder stand', isCorrect: false },
        { text: 'Wider stand', isCorrect: false }
      ],
      hints: {
        de: "‚Wider' bedeutet ‚gegen' (Widerstand = gegen etwas stehen). ‚Wieder' bedeutet ‚nochmal'.",
        en: "'wider' means against, 'wieder' means again.",
      },
    },
    {
      id: 13,
      difficulty: 2,
      tags: ['business'],
      sentence_part1: 'Bitte schicken Sie uns das',
      sentence_part2: 'bis Ende der Woche.',
      options: [
        { text: 'Angebot', isCorrect: true },
        { text: 'Angebott', isCorrect: false },
        { text: 'Angepot', isCorrect: false },
        { text: 'Angeboot', isCorrect: false }
      ],
      hints: {
        de: 'Auslautverhärtung: Man spricht ein [t], schreibt aber ein d (Angebote).',
        en: 'Hardened ending: spoken as [t] but written as d (Angebot -> Angebote).',
      },
    },
    {
      id: 14,
      difficulty: 2,
      tags: ['business'],
      sentence_part1: 'Er hat heute ein wichtiges',
      sentence_part2: 'mit dem Kunden.',
      options: [
        { text: 'Gespräch', isCorrect: true },
        { text: 'Gesprech', isCorrect: false },
        { text: 'Geshpräch', isCorrect: false },
        { text: 'Gespreech', isCorrect: false }
      ],
      hints: {
        de: 'Kommt von "sprechen", daher mit ä.',
        en: 'Derived from "sprechen" (to speak), hence written with ä.',
      },
    }
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  // KATEGORIE: UHR
  // 15 Aufgaben zum Ablesen analoger Uhren.
  // hourRotation und minuteRotation = Grad im Uhrzeigersinn ab 12.
  // ─────────────────────────────────────────────────────────────────────────────
  clock: [
    {
      id: 1,
      difficulty: 1,
      timeAnalog: 'Viertel nach drei am Nachmittag',
      isNight: false,
      hourRotation: 98,
      minuteRotation: 90,
      options: [
        { text: '15:15 Uhr', isCorrect: true },
        { text: '3:15 Uhr', isCorrect: false },
        { text: '15:03 Uhr', isCorrect: false },
        { text: '16:15 Uhr', isCorrect: false },
      ],
    },
    {
      id: 2,
      difficulty: 1,
      timeAnalog: 'Halb sieben am Abend',
      isNight: true,
      hourRotation: 195,
      minuteRotation: 180,
      options: [
        { text: '18:30 Uhr', isCorrect: true },
        { text: '6:30 Uhr', isCorrect: false },
        { text: '18:06 Uhr', isCorrect: false },
        { text: '19:30 Uhr', isCorrect: false },
      ],
    },
    {
      id: 3,
      difficulty: 1,
      timeAnalog: 'Zehn vor zehn am Morgen',
      isNight: false,
      hourRotation: 295,
      minuteRotation: 300,
      options: [
        { text: '9:50 Uhr', isCorrect: true },
        { text: '21:50 Uhr', isCorrect: false },
        { text: '10:50 Uhr', isCorrect: false },
        { text: '9:10 Uhr', isCorrect: false },
      ],
    },
    {
      id: 4,
      difficulty: 1,
      timeAnalog: 'Mittag',
      isNight: false,
      hourRotation: 0,
      minuteRotation: 0,
      options: [
        { text: '12:00 Uhr', isCorrect: true },
        { text: '0:00 Uhr', isCorrect: false },
        { text: '12:30 Uhr', isCorrect: false },
        { text: '6:00 Uhr', isCorrect: false },
      ],
    },
    {
      id: 5,
      difficulty: 1,
      timeAnalog: 'Mitternacht',
      isNight: true,
      hourRotation: 0,
      minuteRotation: 0,
      options: [
        { text: '0:00 Uhr', isCorrect: true },
        { text: '12:00 Uhr', isCorrect: false },
        { text: '0:12 Uhr', isCorrect: false },
        { text: '23:59 Uhr', isCorrect: false },
      ],
    },
    {
      id: 6,
      difficulty: 2,
      timeAnalog: 'Halb eins am Nachmittag',
      isNight: false,
      hourRotation: 15,
      minuteRotation: 180,
      options: [
        { text: '12:30 Uhr', isCorrect: true },
        { text: '0:30 Uhr', isCorrect: false },
        { text: '6:00 Uhr', isCorrect: false },
        { text: '13:30 Uhr', isCorrect: false },
      ],
    },
    {
      id: 7,
      difficulty: 2,
      timeAnalog: 'Viertel vor neun am Abend',
      isNight: true,
      hourRotation: 262,
      minuteRotation: 270,
      options: [
        { text: '20:45 Uhr', isCorrect: true },
        { text: '8:45 Uhr', isCorrect: false },
        { text: '21:15 Uhr', isCorrect: false },
        { text: '21:40 Uhr', isCorrect: false },
      ],
    },
    {
      id: 8,
      difficulty: 1,
      timeAnalog: 'Zwanzig nach vier am Nachmittag',
      isNight: false,
      hourRotation: 130,
      minuteRotation: 120,
      options: [
        { text: '16:20 Uhr', isCorrect: true },
        { text: '4:20 Uhr', isCorrect: false },
        { text: '16:40 Uhr', isCorrect: false },
        { text: '20:16 Uhr', isCorrect: false },
      ],
    },
    {
      id: 9,
      difficulty: 2,
      timeAnalog: 'Fünf nach halb zwölf in der Nacht',
      isNight: true,
      hourRotation: 347,
      minuteRotation: 210,
      options: [
        { text: '23:35 Uhr', isCorrect: true },
        { text: '11:35 Uhr', isCorrect: false },
        { text: '0:35 Uhr', isCorrect: false },
        { text: '19:55 Uhr', isCorrect: false },
      ],
    },
    {
      id: 10,
      difficulty: 1,
      timeAnalog: 'Sechs Uhr abends',
      isNight: true,
      hourRotation: 180,
      minuteRotation: 0,
      options: [
        { text: '18:00 Uhr', isCorrect: true },
        { text: '6:00 Uhr', isCorrect: false },
        { text: '12:30 Uhr', isCorrect: false },
        { text: '19:00 Uhr', isCorrect: false },
      ],
    },
    {
      id: 11,
      difficulty: 2,
      timeAnalog: 'Viertel vor acht am Morgen',
      isNight: false,
      hourRotation: 232,
      minuteRotation: 270,
      options: [
        { text: '7:45 Uhr', isCorrect: true },
        { text: '19:45 Uhr', isCorrect: false },
        { text: '8:45 Uhr', isCorrect: false },
        { text: '7:09 Uhr', isCorrect: false },
      ],
    },
    {
      id: 12,
      difficulty: 2,
      timeAnalog: 'Zwanzig nach zwei am Nachmittag',
      isNight: false,
      hourRotation: 70,
      minuteRotation: 120,
      options: [
        { text: '14:20 Uhr', isCorrect: true },
        { text: '2:20 Uhr', isCorrect: false },
        { text: '14:04 Uhr', isCorrect: false },
        { text: '14:40 Uhr', isCorrect: false },
      ],
    },
    {
      id: 13,
      difficulty: 3,
      timeAnalog: 'Fünf nach elf in der Nacht',
      isNight: true,
      hourRotation: 332,
      minuteRotation: 30,
      options: [
        { text: '23:05 Uhr', isCorrect: true },
        { text: '11:05 Uhr', isCorrect: false },
        { text: '23:01 Uhr', isCorrect: false },
        { text: '5:11 Uhr', isCorrect: false },
      ],
    },
    {
      id: 14,
      difficulty: 1,
      timeAnalog: 'Viertel nach neun am Morgen',
      isNight: false,
      hourRotation: 278,
      minuteRotation: 90,
      options: [
        { text: '9:15 Uhr', isCorrect: true },
        { text: '21:15 Uhr', isCorrect: false },
        { text: '9:03 Uhr', isCorrect: false },
        { text: '3:45 Uhr', isCorrect: false },
      ],
    },
    {
      id: 15,
      difficulty: 2,
      timeAnalog: 'Zehn vor neun am Abend',
      isNight: true,
      hourRotation: 265,
      minuteRotation: 300,
      options: [
        { text: '20:50 Uhr', isCorrect: true },
        { text: '8:50 Uhr', isCorrect: false },
        { text: '21:50 Uhr', isCorrect: false },
        { text: '20:10 Uhr', isCorrect: false },
      ],
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  // KATEGORIE: SEQUENZEN
  // Chronologische Ordnung, Handlungsplanung und auditives Gedächtnis —
  // Berufs- und Alltagswortschatz für Erwachsene.
  // ─────────────────────────────────────────────────────────────────────────────
  sequences: [
    
    // Chronologie & Semantik
    {
      id: 1,
      difficulty: 1,
      instruction: 'Ordne die Wochentage in die richtige Reihenfolge',
      scrambled: ['Mittwoch', 'Montag', 'Freitag', 'Dienstag'],
      distractors: ['Samstag', 'Sonntag'],
      correct: ['Montag', 'Dienstag', 'Mittwoch', 'Freitag'],
    },

    {
      id: 2,
      difficulty: 1,
      instruction: 'Ordne die Monate des zweiten Quartals',
      scrambled: ['Juni', 'April', 'Mai'],
      distractors: ['Juli'],
      correct: ['April', 'Mai', 'Juni'],
    },

    {
      id: 3,
      difficulty: 2,
      tags: ['business'],
      instruction: 'Karrierestufen — niedrigste zuerst',
      scrambled: [
        'Abteilungsleiter',
        'Praktikant',
        'Geschäftsführer',
        'Fachkraft',
      ],
      distractors: ['Rentner'],
      correct: [
        'Praktikant',
        'Fachkraft',
        'Abteilungsleiter',
        'Geschäftsführer',
      ],
    },

    {
      id: 4,
      difficulty: 2,
      tags: ['business'],
      instruction: 'Schritte einer Bewerbung',
      scrambled: [
        'Vorstellungsgespräch',
        'Lebenslauf schreiben',
        'Zusage erhalten',
        'Stelle ausschreiben lesen',
      ],
      distractors: ['Kündigen'],
      correct: [
        'Stelle ausschreiben lesen',
        'Lebenslauf schreiben',
        'Vorstellungsgespräch',
        'Zusage erhalten',
      ],
    },

    {
      id: 5,
      difficulty: 1,
      instruction: 'Beträge vom kleinsten zum größten',
      scrambled: ['1.000.000 €', '500 €', '10.000 €', '75 €'],
      distractors: ['100 €'],
      correct: ['75 €', '500 €', '10.000 €', '1.000.000 €'],
    },

    {
      id: 6,
      difficulty: 2,
      tags: ['everyday', 'business'],
      instruction: 'Schritte beim Abschluss eines Mietvertrags',
      scrambled: [
        'Kaution überweisen',
        'Wohnung besichtigen',
        'Vertrag unterzeichnen',
        'Schlüssel erhalten',
      ],
      distractors: ['Haus verkaufen'],
      correct: [
        'Wohnung besichtigen',
        'Vertrag unterzeichnen',
        'Kaution überweisen',
        'Schlüssel erhalten',
      ],
    },

    {
      id: 7,
      difficulty: 1,
      instruction: 'Zeiteinheiten — kürzeste zuerst',
      scrambled: ['Jahrhundert', 'Sekunde', 'Jahrzehnt', 'Jahr'],
      distractors: ['Monat'],
      correct: ['Sekunde', 'Jahr', 'Jahrzehnt', 'Jahrhundert'],
    },

    {
      id: 8,
      difficulty: 1,
      instruction: 'Bringe die Wörter in die richtige Satzreihenfolge',
      scrambled: [
        'den',
        'hat',
        'rechtzeitig',
        'Bericht',
        'Sie',
        'eingereicht.',
      ],
      distractors: ['hatte', 'morgen'],
      correct: ['Sie', 'hat', 'den', 'Bericht', 'rechtzeitig', 'eingereicht.'],
    },

    {
      id: 9,
      difficulty: 2,
      instruction: 'Phasen eines Projekts (klassisches PM)',
      scrambled: ['Abschluss', 'Planung', 'Durchführung', 'Initiierung'],
      distractors: ['Urlaub'],
      correct: ['Initiierung', 'Planung', 'Durchführung', 'Abschluss'],
    },

    {
      id: 10,
      difficulty: 1,
      instruction: 'Alphabetische Reihenfolge — Berufswörter',
      scrambled: ['Vertrag', 'Rechnung', 'Angebot', 'Protokoll'],
      distractors: ['Zahlung'],
      correct: ['Angebot', 'Protokoll', 'Rechnung', 'Vertrag'],
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  // KATEGORIE: TRACKING
  // Räumliche Schnellentscheidung — Lateralisation, b/d/p/q, Groß-/Kleinbuchstaben,
  // Vokal/Konsonant, gerade/ungerade, Umlaut ja/nein.
  // ─────────────────────────────────────────────────────────────────────────────
  tracking: [
    {
      id: 1,
      difficulty: 1,
      instruction: 'Auf welcher Seite ist der Bauch des Buchstabens?',
      items: [
        { symbol: 'b', target: 'right' },
        { symbol: 'd', target: 'left' },
        { symbol: 'd', target: 'left' },
        { symbol: 'b', target: 'right' },
        { symbol: 'd', target: 'left' },
      ],
      options: [
        { label: 'Links ⬅️', value: 'left' },
        { label: 'Rechts ➡️', value: 'right' },
      ],
    },
    {
      id: 2,
      difficulty: 1,
      instruction: 'In welche Richtung zeigt der Pfeil?',
      items: [
        { symbol: '➡️', target: 'right' },
        { symbol: '⬅️', target: 'left' },
        { symbol: '➡️', target: 'right' },
        { symbol: '➡️', target: 'right' },
        { symbol: '⬅️', target: 'left' },
      ],
      options: [
        { label: 'Links ⬅️', value: 'left' },
        { label: 'Rechts ➡️', value: 'right' },
      ],
    },
    {
      id: 3,
      difficulty: 1,
      instruction: 'Wo ist der Bauch bei diesem Buchstaben?',
      items: [
        { symbol: 'p', target: 'right' },
        { symbol: 'q', target: 'left' },
        { symbol: 'p', target: 'right' },
        { symbol: 'q', target: 'left' },
        { symbol: 'q', target: 'left' },
      ],
      options: [
        { label: 'Links ⬅️', value: 'left' },
        { label: 'Rechts ➡️', value: 'right' },
      ],
    },
      {
      id: 4,
      difficulty: 1,
      instruction: 'In welche Richtung zeigt das Dreieck?',
      items: [
        { symbol: '◁', target: 'left' },
        { symbol: '▷', target: 'right' },
        { symbol: '▷', target: 'right' },
        { symbol: '◁', target: 'left' },
        { symbol: '▷', target: 'right' },
      ],
      options: [
        { label: 'Links ⬅️', value: 'left' },
        { label: 'Rechts ➡️', value: 'right' },
      ],
    },
    {
      id: 5,
      difficulty: 1,
      instruction: 'Lies das Wort und drücke die richtige Richtung',
      items: [
        { symbol: 'RECHTS', target: 'right' },
        { symbol: 'LINKS', target: 'left' },
        { symbol: 'LINKS', target: 'left' },
        { symbol: 'RECHTS', target: 'right' },
        { symbol: 'LINKS', target: 'left' },
      ],
      options: [
        { label: 'Links ⬅️', value: 'left' },
        { label: 'Rechts ➡️', value: 'right' },
      ],
    },
    {
      id: 6,
      difficulty: 1,
      instruction: 'In welche Richtung zeigt das Dreieck?',
      items: [
        { symbol: '◁', target: 'left' },
        { symbol: '▷', target: 'right' },
        { symbol: '▷', target: 'right' },
        { symbol: '◁', target: 'left' },
        { symbol: '▷', target: 'right' },
      ],
      options: [
        { label: 'Links ⬅️', value: 'left' },
        { label: 'Rechts ➡️', value: 'right' },
      ],
    },
    {
      id: 7,
      difficulty: 1,
      instruction: 'Wo ist die eckige Klammer geöffnet?',
      items: [
        { symbol: '[', target: 'right' },
        { symbol: ']', target: 'left' },
        { symbol: '[', target: 'right' },
        { symbol: ']', target: 'left' },
        { symbol: ']', target: 'left' },
      ],
      options: [
        { label: 'Links ⬅️', value: 'left' },
        { label: 'Rechts ➡️', value: 'right' },
      ],
    },
    {
      id: 8,
      difficulty: 1,
      instruction: 'In welche Richtung lehnt der Schrägstrich?',
      items: [
        { symbol: '/', target: 'right' },
        { symbol: '\\', target: 'left' },
        { symbol: '/', target: 'right' },
        { symbol: '\\', target: 'left' },
        { symbol: '/', target: 'right' },
      ],
      options: [
        { label: 'Links (\\) ⬅️', value: 'left' },
        { label: 'Rechts (/) ➡️', value: 'right' },
      ],
        }
  ],

  lcwc: [
    { id: 1, lcwc: true, difficulty: 2, word: 'Rhythmus' },
    { id: 2, lcwc: true, difficulty: 3, word: 'Atmosphäre' },
    { id: 3, lcwc: true, difficulty: 3, word: 'Philosophie' },
    { id: 4, lcwc: true, difficulty: 3, word: 'Portemonnaie' },
    { id: 5, lcwc: true, difficulty: 2, word: 'Katastrophe' },
    { id: 6, lcwc: true, difficulty: 3, word: 'Ingenieur' },
    { id: 7, lcwc: true, difficulty: 2, word: 'Akustik' },
    { id: 8, lcwc: true, difficulty: 3, word: 'Symmetrie' },
    { id: 9, lcwc: true, difficulty: 2, word: 'Charisma' },
    { id: 10, lcwc: true, difficulty: 3, word: 'Schizophrenie' },
    { id: 11, lcwc: true, difficulty: 3, word: 'Ressource' },
    { id: 12, lcwc: true, difficulty: 3, word: 'Ausschreibung' },
    { id: 13, lcwc: true, difficulty: 2, word: 'Bürokratie' }
  ],

  categorization: [
    { id: 1, difficulty: 1, instruction: 'Nomen oder Verb?', buckets: [{ id: 'nomen', label: 'Nomen (Groß)', icon: '📦' }, { id: 'verb', label: 'Verb (Klein)', icon: '🏃' }], items: [{ id: 'i1', word: 'Arbeit', bucketId: 'nomen' }, { id: 'i2', word: 'arbeiten', bucketId: 'verb' }, { id: 'i3', word: 'Spiel', bucketId: 'nomen' }, { id: 'i4', word: 'spielen', bucketId: 'verb' }] },
    { id: 2, difficulty: 2, instruction: 'Wörter mit IE oder EI?', buckets: [{ id: 'ie', label: 'IE (wie langes i)', icon: '🔊' }, { id: 'ei', label: 'EI (wie ai)', icon: '🔊' }], items: [{ id: 'i1', word: 'Brief', bucketId: 'ie' }, { id: 'i2', word: 'klein', bucketId: 'ei' }, { id: 'i3', word: 'Frieden', bucketId: 'ie' }, { id: 'i4', word: 'Stein', bucketId: 'ei' }] },
    { id: 3, difficulty: 2, instruction: 'Wörter mit SS oder ß?', buckets: [{ id: 'ss', label: 'Doppel-S', icon: '📝' }, { id: 'sz', label: 'Eszett (ß)', icon: '📝' }], items: [{ id: 'i1', word: 'Masse', bucketId: 'ss' }, { id: 'i2', word: 'Maße', bucketId: 'sz' }, { id: 'i3', word: 'Fluss', bucketId: 'ss' }, { id: 'i4', word: 'Fuß', bucketId: 'sz' }] },
    { id: 4, difficulty: 1, instruction: 'Männlich (der) oder Weiblich (die)?', buckets: [{ id: 'der', label: 'der (männlich)', icon: '👨' }, { id: 'die', label: 'die (weiblich)', icon: '👩' }], items: [{ id: 'i1', word: 'Baum', bucketId: 'der' }, { id: 'i2', word: 'Blume', bucketId: 'die' }, { id: 'i3', word: 'Tisch', bucketId: 'der' }, { id: 'i4', word: 'Lampe', bucketId: 'die' }] },
    { id: 5, difficulty: 2, instruction: 'Wirtschaft oder Medizin?', buckets: [{ id: 'wir', label: 'Wirtschaft', icon: '💼' }, { id: 'med', label: 'Medizin', icon: '🏥' }], items: [{ id: 'i1', word: 'Rechnung', bucketId: 'wir' }, { id: 'i2', word: 'Rezept', bucketId: 'med' }, { id: 'i3', word: 'Bilanz', bucketId: 'wir' }, { id: 'i4', word: 'Diagnose', bucketId: 'med' }] },
    { id: 6, difficulty: 1, instruction: 'Einzahl oder Mehrzahl?', buckets: [{ id: 'sg', label: 'Einzahl', icon: '1️⃣' }, { id: 'pl', label: 'Mehrzahl', icon: '🔢' }], items: [{ id: 'i1', word: 'Kind', bucketId: 'sg' }, { id: 'i2', word: 'Kinder', bucketId: 'pl' }, { id: 'i3', word: 'Buch', bucketId: 'sg' }, { id: 'i4', word: 'Bücher', bucketId: 'pl' }] },
    { id: 7, difficulty: 2, instruction: 'Vorsilbe oder Nachsilbe?', buckets: [{ id: 'vor', label: 'Vorsilbe', icon: '⬅️' }, { id: 'nach', label: 'Nachsilbe', icon: '➡️' }], items: [{ id: 'i1', word: 'ver-', bucketId: 'vor' }, { id: 'i2', word: '-heit', bucketId: 'nach' }, { id: 'i3', word: 'be-', bucketId: 'vor' }, { id: 'i4', word: '-keit', bucketId: 'nach' }] },
    { id: 8, difficulty: 2, instruction: 'V als F oder W gesprochen?', buckets: [{ id: 'f', label: 'wie F', icon: '🗣️' }, { id: 'w', label: 'wie W', icon: '🗣️' }], items: [{ id: 'i1', word: 'Vater', bucketId: 'f' }, { id: 'i2', word: 'Vase', bucketId: 'w' }, { id: 'i3', word: 'Vogel', bucketId: 'f' }, { id: 'i4', word: 'Vampir', bucketId: 'w' }] },
    { id: 9, difficulty: 1, instruction: 'Vergangenheit oder Zukunft?', buckets: [{ id: 'past', label: 'Vergangenheit', icon: '⏪' }, { id: 'fut', label: 'Zukunft', icon: '⏩' }], items: [{ id: 'i1', word: 'gestern', bucketId: 'past' }, { id: 'i2', word: 'morgen', bucketId: 'fut' }, { id: 'i3', word: 'früher', bucketId: 'past' }, { id: 'i4', word: 'später', bucketId: 'fut' }] },
    { id: 10, difficulty: 2, instruction: 'Positiv oder Negativ?', buckets: [{ id: 'pos', label: 'Positiv', icon: '👍' }, { id: 'neg', label: 'Negativ', icon: '👎' }], items: [{ id: 'i1', word: 'Erfolg', bucketId: 'pos' }, { id: 'i2', word: 'Fehler', bucketId: 'neg' }, { id: 'i3', word: 'Gewinn', bucketId: 'pos' }, { id: 'i4', word: 'Verlust', bucketId: 'neg' }] },
    { id: 11, difficulty: 1, instruction: 'Tiere oder Pflanzen?', buckets: [{ id: 'tier', label: 'Tiere', icon: '🐕' }, { id: 'pflanze', label: 'Pflanzen', icon: '🌿' }], items: [{ id: 'i1', word: 'Hund', bucketId: 'tier' }, { id: 'i2', word: 'Baum', bucketId: 'pflanze' }, { id: 'i3', word: 'Katze', bucketId: 'tier' }, { id: 'i4', word: 'Blume', bucketId: 'pflanze' }] },
    { id: 12, difficulty: 2, tags: ['business'], instruction: 'Abteilung zuordnen', buckets: [{ id: 'hr', label: 'Personal (HR)', icon: '👥' }, { id: 'it', label: 'IT', icon: '💻' }], items: [{ id: 'i1', word: 'Bewerbung', bucketId: 'hr' }, { id: 'i2', word: 'Server', bucketId: 'it' }, { id: 'i3', word: 'Urlaub', bucketId: 'hr' }, { id: 'i4', word: 'Software', bucketId: 'it' }] }
  ],

  dictation: [
    { id: 1, dictation: true, difficulty: 1, audioPrompt: 'Die Besprechung beginnt um zehn Uhr.', correct: 'Die Besprechung beginnt um zehn Uhr' },
    { id: 2, dictation: true, difficulty: 2, audioPrompt: 'Wir müssen den Vertrag unterschreiben.', correct: 'Wir müssen den Vertrag unterschreiben' },
    { id: 3, dictation: true, difficulty: 2, audioPrompt: 'Bitte senden Sie mir die Unterlagen.', correct: 'Bitte senden Sie mir die Unterlagen' },
    { id: 4, dictation: true, difficulty: 2, audioPrompt: 'Das Unternehmen wächst sehr schnell.', correct: 'Das Unternehmen wächst sehr schnell' },
    { id: 5, dictation: true, difficulty: 3, audioPrompt: 'Der Rhythmus der Musik ist schnell.', correct: 'Der Rhythmus der Musik ist schnell' },
    { id: 6, dictation: true, difficulty: 3, audioPrompt: 'Er hat seine Qualifikation bewiesen.', correct: 'Er hat seine Qualifikation bewiesen' },
    { id: 7, dictation: true, difficulty: 2, audioPrompt: 'Das Projekt war äußerst erfolgreich.', correct: 'Das Projekt war äußerst erfolgreich' },
    { id: 8, dictation: true, difficulty: 2, audioPrompt: 'Die Verantwortung liegt beim Chef.', correct: 'Die Verantwortung liegt beim Chef' },
    { id: 9, dictation: true, difficulty: 2, audioPrompt: 'Alle Mitarbeiter müssen teilnehmen.', correct: 'Alle Mitarbeiter müssen teilnehmen' },
    { id: 10, dictation: true, difficulty: 1, audioPrompt: 'Die Entwicklung ist sehr positiv.', correct: 'Die Entwicklung ist sehr positiv' },
    { id: 11, dictation: true, difficulty: 2, audioPrompt: 'Die Rechnung muss bis Freitag bezahlt werden.', correct: 'Die Rechnung muss bis Freitag bezahlt werden' },
    { id: 12, dictation: true, difficulty: 3, audioPrompt: 'Das Ergebnis der Analyse war sehr überraschend.', correct: 'Das Ergebnis der Analyse war sehr überraschend' }
  ],

  diagnostic: [
    { id: 'de_diag_1', pillar: 'Literacy', difficulty: 2, focus: 'Diagnostik: das oder dass', questions: { de: 'Ich hoffe, ___ du kommst.' }, options: [{ text: 'das', isCorrect: false }, { text: 'dass', isCorrect: true }] },
    { id: 'de_diag_2', pillar: 'Literacy', difficulty: 3, focus: 'Diagnostik: ie oder ei', questions: { de: 'Welches Wort ist richtig geschrieben?' }, options: [{ text: 'Brief', isCorrect: true }, { text: 'Breif', isCorrect: false }, { text: 'Brif', isCorrect: false }, { text: 'Brieff', isCorrect: false }] },
    { id: 'de_diag_3', pillar: 'Literacy', difficulty: 2, focus: 'Diagnostik: Großschreibung', questions: { de: 'Welches Wort muss großgeschrieben werden?' }, options: [{ text: 'laufen', isCorrect: false }, { text: 'schnell', isCorrect: false }, { text: 'auto', isCorrect: true }, { text: 'weil', isCorrect: false }] },
    { id: 'de_diag_4', pillar: 'Literacy', difficulty: 3, focus: 'Diagnostik: ss oder ß', questions: { de: 'Welches Wort ist richtig?' }, options: [{ text: 'Strasse', isCorrect: false }, { text: 'Straße', isCorrect: true }, { text: 'Straße', isCorrect: false }, { text: 'Strase', isCorrect: false }] },
    { id: 'de_diag_5', pillar: 'Visual', difficulty: 2, focus: 'Diagnostik: Visuelle Diskriminierung', questions: { de: 'Welcher Buchstabe passt nicht in die Reihe?\n\n p p q p p' }, options: [{ text: 'Der erste', isCorrect: false }, { text: 'Der zweite', isCorrect: false }, { text: 'Der dritte', isCorrect: true }, { text: 'Der vierte', isCorrect: false }] },
    { id: 'de_diag_6', pillar: 'Visual', difficulty: 3, focus: 'Diagnostik: Zahlendreher', questions: { de: 'Welche Zahlenfolge weicht von 5469 ab?' }, options: [{ text: '5469', isCorrect: false }, { text: '5469', isCorrect: false }, { text: '5496', isCorrect: true }, { text: '5469', isCorrect: false }] },
    { id: 'de_diag_7', pillar: 'Cognitive', difficulty: 2, focus: 'Diagnostik: Zeitgefühl', questions: { de: 'Wenn ein Meeting um 14:00 Uhr beginnt und 90 Minuten dauert, wann endet es?' }, options: [{ text: '15:00 Uhr', isCorrect: false }, { text: '15:30 Uhr', isCorrect: true }, { text: '16:00 Uhr', isCorrect: false }, { text: '14:90 Uhr', isCorrect: false }] },
    { id: 'de_diag_8', pillar: 'Cognitive', difficulty: 3, focus: 'Diagnostik: Sequentielles Gedächtnis', questions: { de: 'Welcher Monat folgt direkt auf August?' }, options: [{ text: 'Juli', isCorrect: false }, { text: 'Oktober', isCorrect: false }, { text: 'September', isCorrect: true }, { text: 'November', isCorrect: false }] },
    { id: 'de_diag_9', pillar: 'Cognitive', difficulty: 2, focus: 'Diagnostik: Kategorisierung', questions: { de: 'Welches Wort gehört NICHT zu den Berufen?' }, options: [{ text: 'Lehrer', isCorrect: false }, { text: 'Arzt', isCorrect: false }, { text: 'Bibliothek', isCorrect: true }, { text: 'Ingenieur', isCorrect: false }] },
    { id: 'de_diag_10', pillar: 'Cognitive', difficulty: 3, focus: 'Diagnostik: Logisches Denken', questions: { de: 'Wenn Jan größer als Peter ist, und Peter größer als Michael ist, wer ist am kleinsten?' }, options: [{ text: 'Jan', isCorrect: false }, { text: 'Peter', isCorrect: false }, { text: 'Michael', isCorrect: true }, { text: 'Alle sind gleich groß', isCorrect: false }] }
  ]
};
