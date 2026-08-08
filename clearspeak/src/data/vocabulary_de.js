export const wordDatabaseDE = {
  phonemes: [
    {
      id: 1,
      type: 'phoneme',
      difficulty: 2,
      tags: ['business'],
      word: 'Qualifikation',
      phonetic: '/ kvaːlɪfɪkaˈt͡si̯oːn /',
      hint: {
        de: 'Eignung oder Befähigung für eine Aufgabe',
      },
    },
    {
      id: 2,
      type: 'phoneme',
      difficulty: 3,
      tags: ['everyday'],
      word: 'Psychiatrie',
      phonetic: '/ psyçiˈatʁiː /',
      hint: {
        de: 'Medizinisches Fachgebiet für seelische Erkrankungen',
      },
    },
    {
      id: 3,
      type: 'phoneme',
      difficulty: 2,
      tags: ['everyday'],
      word: 'Rhythmus',
      phonetic: '/ ˈʁʏtmʊs /',
      hint: {
        de: 'Gleichmäßige Abfolge von Tönen oder Bewegungen',
      },
    },
    {
      id: 4,
      type: 'phoneme',
      difficulty: 3,
      tags: ['business'],
      word: 'Choreographie',
      phonetic: '/ koʁeoɡʁaˈfiː /',
      hint: {
        de: 'Erfindung und Einstudierung von Tänzen',
      },
    },
    {
      id: 5,
      type: 'phoneme',
      difficulty: 2,
      tags: ['business'],
      word: 'Verantwortung',
      phonetic: '/ fɛˈʁantvɔʁtʊŋ /',
      hint: {
        de: 'Verpflichtung, für die Folgen einer Handlung einzustehen',
      },
    },
    {
      id: 6,
      type: 'phoneme',
      difficulty: 3,
      tags: ['business'],
      word: 'Schlüsselkompetenz',
      phonetic: '/ ˈʃlʏsl̩kɔmpəˌtɛnt͡s /',
      hint: {
        de: 'Besonders wichtige Fähigkeit im Berufsleben',
      },
    },
    {
      id: 7,
      type: 'phoneme',
      difficulty: 2,
      tags: ['everyday'],
      word: 'Beschleunigung',
      phonetic: '/ bəˈʃlɔʏ̯nɪɡʊŋ /',
      hint: {
        de: 'Prozess, bei dem etwas schneller wird',
      },
    },
    {
      id: 8,
      type: 'phoneme',
      difficulty: 2,
      tags: ['business'],
      word: 'Widersprüchlich',
      phonetic: '/ ˈviːdɐʃpʁʏçlɪç /',
      hint: {
        de: 'Gegensätzlich, nicht übereinstimmend',
      },
    },
    {
      id: 9,
      type: 'phoneme',
      difficulty: 1,
      tags: ['everyday'],
      word: 'Baum',
      phonetic: '/ baʊm /',
      hint: {
        de: 'Große Pflanze mit Stamm und Blättern',
      },
    },
    {
      id: 10,
      type: 'phoneme',
      difficulty: 1,
      tags: ['everyday'],
      word: 'Apfel',
      phonetic: '/ ˈapfəl /',
      hint: {
        de: 'Beliebtes rundes Obst, oft rot oder grün',
      },
    },
    {
      id: 11,
      type: 'phoneme',
      difficulty: 3,
      tags: ['everyday'],
      word: 'Portemonnaie',
      phonetic: '/ pɔʁtmɔˈneː /',
      hint: {
        de: 'Anderes Wort für Geldbeutel (aus dem Französischen)',
      },
    },
    {
      id: 12,
      type: 'phoneme',
      difficulty: 3,
      tags: ['business'],
      word: 'Enthusiasmus',
      phonetic: '/ ɛntuzi̯ˈasmʊs /',
      hint: {
        de: 'Begeisterung oder leidenschaftlicher Eifer',
      },
    },
    {
      id: 13,
      type: 'phoneme',
      difficulty: 3,
      tags: ['business'],
      word: 'Ressource',
      phonetic: '/ ʁɛˈsʊʁsə /',
      hint: {
        de: 'Mittel, Gegebenheit, wie z.B. Rohstoffe oder Personal',
        en: 'Resource',
        pl: 'Zasoby',
      },
    },
    {
      id: 14,
      type: 'phoneme',
      difficulty: 2,
      tags: ['everyday'],
      word: 'Authentisch',
      phonetic: '/ aʊ̯ˈtɛntɪʃ /',
      hint: {
        de: 'Echt, nicht gefälscht',
        en: 'Authentic',
        pl: 'Autentyczny',
      },
    },
  ],
  graphemes: [
    {
      id: 1,
      type: 'grapheme',
      difficulty: 1,
      focus: 'ie / ei — Verwechslung der Vokalkombinationen',
      question: {
        de: "Welches Wort wird mit ‚ie' geschrieben? (sprich: langes i)",
        pl: "Które słowo pisze się przez ‚ie'? (wymawia się jako długie i)",
        en: "Which word is written with 'ie'? (pronounced as a long i)",
      },
      options: [
        {
          text: 'Brief',
          isCorrect: true,
          icon: '✉️',
        },
        {
          text: 'Klein',
          isCorrect: false,
          icon: '🤏',
        },
        {
          text: 'Breif',
          isCorrect: false,
          icon: '❌',
        },
        {
          text: 'Klien',
          isCorrect: false,
          icon: '❌',
        },
      ],
    },
    {
      id: 2,
      type: 'grapheme',
      difficulty: 1,
      focus: 'dass / das — subordinating conjunction vs. article/pronoun',
      question: {
        de: "Welches ‚dass' / ‚das' passt? — Ich glaube, ___ er kommt.",
        pl: "Które ‚dass' / ‚das' pasuje? — Wierzę, ___ że on przyjdzie.",
        en: "Which 'dass'/'das' fits? — I believe ___ he is coming.",
      },
      options: [
        {
          text: 'dass',
          isCorrect: true,
          icon: '💬',
        },
        {
          text: 'das',
          isCorrect: false,
          icon: '❌',
        },
        {
          text: 'daß',
          isCorrect: false,
          icon: '❌',
        },
        {
          text: 'daas',
          isCorrect: false,
          icon: '❌',
        },
      ],
    },
    {
      id: 3,
      type: 'grapheme',
      difficulty: 1,
      focus: 'ss / ß — nach kurzem Vokal ss, nach langem Vokal/Diphthong ß',
      question: {
        de: 'Welche Schreibung ist korrekt? — Ich ___e die Straße entlang.',
        pl: 'Która pisownia jest poprawna? — Idę wzdłuż ulicy.',
        en: 'Which spelling is correct? — I walk along the street.',
      },
      options: [
        {
          text: 'Straße',
          isCorrect: true,
          icon: '🛣️',
        },
        {
          text: 'Strasse',
          isCorrect: false,
          icon: '❌',
        },
        {
          text: 'Strase',
          isCorrect: false,
          icon: '❌',
        },
        {
          text: 'Straze',
          isCorrect: false,
          icon: '❌',
        },
      ],
    },
    {
      id: 4,
      type: 'grapheme',
      difficulty: 1,
      focus: 'Auslautverhärtung — d → t am Wortende',
      question: {
        de: "Wie lautet die korrekte Schreibung? (der Plural ist ‚Hunde')",
        pl: "Jak brzmi poprawna pisownia? (liczba mnoga to ‚Hunde')",
        en: "What is the correct spelling? (the plural is 'Hunde')",
      },
      options: [
        {
          text: 'Hund',
          isCorrect: true,
          icon: '🐾',
        },
        {
          text: 'Hunt',
          isCorrect: false,
          icon: '❌',
        },
        {
          text: 'Hunnt',
          isCorrect: false,
          icon: '❌',
        },
        {
          text: 'Hunnd',
          isCorrect: false,
          icon: '❌',
        },
      ],
    },
    {
      id: 5,
      type: 'grapheme',
      difficulty: 1,
      focus: 'Auslautverhärtung — b → p am Wortende',
      question: {
        de: "Wie lautet die korrekte Schreibung? (der Plural ist ‚Diebe')",
        pl: "Jak brzmi poprawna pisownia? (liczba mnoga to ‚Diebe')",
        en: "What is the correct spelling? (the plural is 'Diebe')",
      },
      options: [
        {
          text: 'Dieb',
          isCorrect: true,
          icon: '👤',
        },
        {
          text: 'Diep',
          isCorrect: false,
          icon: '❌',
        },
        {
          text: 'Diip',
          isCorrect: false,
          icon: '❌',
        },
        {
          text: 'Dihb',
          isCorrect: false,
          icon: '❌',
        },
      ],
    },
    {
      id: 6,
      type: 'grapheme',
      difficulty: 1,
      focus: 'Auslautverhärtung — g → k am Wortende',
      question: {
        de: "Wie lautet die korrekte Schreibung? (der Plural ist ‚Tage')",
        pl: "Jak brzmi poprawna pisownia? (liczba mnoga to ‚Tage')",
        en: "What is the correct spelling? (the plural is 'Tage')",
      },
      options: [
        {
          text: 'Tag',
          isCorrect: true,
          icon: '📅',
        },
        {
          text: 'Tak',
          isCorrect: false,
          icon: '❌',
        },
        {
          text: 'Tack',
          isCorrect: false,
          icon: '❌',
        },
        {
          text: 'Tagg',
          isCorrect: false,
          icon: '❌',
        },
      ],
    },
    {
      id: 7,
      type: 'grapheme',
      difficulty: 2,
      focus: 'Dehnungs-h — stilles h nach langem Vokal',
      question: {
        de: "Welche Schreibung des Wortes für ‚Verkehrsmittel auf Schienen' ist korrekt?",
        pl: "Która pisownia słowa oznaczającego ‚środek transportu szynowego' jest poprawna?",
        en: "Which spelling of the word for 'rail transport' is correct?",
      },
      options: [
        {
          text: 'Bahn',
          isCorrect: true,
          icon: '🚂',
        },
        {
          text: 'Ban',
          isCorrect: false,
          icon: '❌',
        },
        {
          text: 'Baan',
          isCorrect: false,
          icon: '❌',
        },
        {
          text: 'Bann',
          isCorrect: false,
          icon: '❌',
        },
      ],
    },
    {
      id: 8,
      type: 'grapheme',
      difficulty: 1,
      focus: 'Großschreibung — Substantive groß, Adjektive klein',
      question: {
        de: 'Was ist korrekt? Der ___ Lehrer erklärte das Thema sehr gut.',
        pl: 'Co jest poprawne? Dobry nauczyciel wyjaśnił temat bardzo dobrze.',
        en: 'What is correct? The good teacher explained the topic very well.',
      },
      options: [
        {
          text: 'gute',
          isCorrect: true,
          icon: '👨‍🏫',
        },
        {
          text: 'Gute',
          isCorrect: false,
          icon: '❌',
        },
        {
          text: 'gutte',
          isCorrect: false,
          icon: '❌',
        },
        {
          text: 'Gutte',
          isCorrect: false,
          icon: '❌',
        },
      ],
    },
    {
      id: 9,
      type: 'grapheme',
      difficulty: 2,
      focus: 'v → f-Laut in einheimischen Wörtern',
      question: {
        de: 'Welches einheimische Wort beginnt mit v, wird aber wie f gesprochen?',
        pl: 'Które rodzime słowo zaczyna się od v, ale wymawia się jak f?',
        en: 'Which native German word starts with v but is pronounced like f?',
      },
      options: [
        {
          text: 'Vogel',
          isCorrect: true,
          icon: '🐦',
        },
        {
          text: 'Vase',
          isCorrect: false,
          icon: '🪴',
        },
        {
          text: 'Fogel',
          isCorrect: false,
          icon: '❌',
        },
        {
          text: 'Fase',
          isCorrect: false,
          icon: '❌',
        },
      ],
    },
    {
      id: 10,
      type: 'grapheme',
      difficulty: 2,
      focus: 'ph = f in Fremdwörtern',
      question: {
        de: 'Welche Schreibung des Fachs für Körperpflege und Medikamente ist korrekt?',
        pl: 'Która pisownia określenia placówki z lekami i produktami do higieny jest poprawna?',
        en: 'Which spelling of the word for the shop selling medicines is correct?',
      },
      options: [
        {
          text: 'Apotheke',
          isCorrect: true,
          icon: '💊',
        },
        {
          text: 'Apoteke',
          isCorrect: false,
          icon: '❌',
        },
        {
          text: 'Appotheke',
          isCorrect: false,
          icon: '❌',
        },
        {
          text: 'Abotheke',
          isCorrect: false,
          icon: '❌',
        },
      ],
    },
    {
      id: 11,
      type: 'grapheme',
      difficulty: 2,
      focus: 'tz statt z nach kurzem Vokal',
      question: {
        de: 'Wie schreibt man das Wort für einen Ort, an dem man sitzt?',
        pl: 'Jak pisze się słowo oznaczające miejsce, gdzie się siedzi?',
        en: 'How do you spell the word for a place where you sit?',
      },
      options: [
        {
          text: 'Platz',
          isCorrect: true,
          icon: '💺',
        },
        {
          text: 'Plaz',
          isCorrect: false,
          icon: '❌',
        },
        {
          text: 'Plahtz',
          isCorrect: false,
          icon: '❌',
        },
        {
          text: 'Plazz',
          isCorrect: false,
          icon: '❌',
        },
      ],
    },
    {
      id: 12,
      type: 'grapheme',
      difficulty: 1,
      focus: 'ck statt k nach kurzem Vokal',
      question: {
        de: 'Wie heißt das Kleidungsstück für den Unterkörper?',
        pl: 'Jak nazywa się część ubrania na dolną część ciała?',
        en: 'What is the word for the piece of clothing for the lower body?',
      },
      options: [
        {
          text: 'Rock',
          isCorrect: true,
          icon: '👗',
        },
        {
          text: 'Rok',
          isCorrect: false,
          icon: '❌',
        },
        {
          text: 'Rokk',
          isCorrect: false,
          icon: '❌',
        },
        {
          text: 'Rog',
          isCorrect: false,
          icon: '❌',
        },
      ],
    },
    {
      id: 13,
      type: 'grapheme',
      difficulty: 4,
      focus: 'eu / äu — gleicher Laut, andere Schreibung je nach Wortstamm',
      question: {
        de: '"äu" schreibt man, wenn ein verwandtes Wort mit "au" existiert (Haus → Häuser). Welche Schreibweise ist richtig?',
        pl: '"äu" piszemy, gdy istnieje pokrewne słowo z "au" (Haus → Häuser). Które słowo jest poprawne?',
        en: 'You write "äu" when a related word with "au" exists (Haus → Häuser). Which spelling is correct?',
      },
      options: [
        {
          text: 'Häuser',
          isCorrect: true,
          icon: '🏘️',
        },
        {
          text: 'Heuser',
          isCorrect: false,
          icon: '❌',
        },
        {
          text: 'Häuzer',
          isCorrect: false,
          icon: '❌',
        },
        {
          text: 'Heusser',
          isCorrect: false,
          icon: '❌',
        },
      ],
    },
    {
      id: 14,
      type: 'grapheme',
      difficulty: 4,
      focus: 'sp am Wortanfang — gesprochen "schp", geschrieben "sp"',
      question: {
        de: 'Am Wortanfang spricht man "schp", schreibt aber "sp". Welche Schreibweise ist richtig?',
        pl: 'Na początku wyrazu wymawiamy "szp", ale piszemy "sp". Które słowo jest poprawne?',
        en: 'At the start of a word you say "schp" but write "sp". Which spelling is correct?',
      },
      options: [
        {
          text: 'Spinne',
          isCorrect: true,
          icon: '🕷️',
        },
        {
          text: 'Schpinne',
          isCorrect: false,
          icon: '❌',
        },
        {
          text: 'Spienne',
          isCorrect: false,
          icon: '❌',
        },
        {
          text: 'Schbinne',
          isCorrect: false,
          icon: '❌',
        },
      ],
    },
    {
      id: 15,
      type: 'grapheme',
      difficulty: 4,
      focus: 'st am Wortanfang — gesprochen "scht", geschrieben "st"',
      question: {
        de: 'Am Wortanfang spricht man "scht", schreibt aber "st". Welche Schreibweise ist richtig?',
        pl: 'Na początku wyrazu wymawiamy "szt", ale piszemy "st". Które słowo jest poprawne?',
        en: 'At the start of a word you say "scht" but write "st". Which spelling is correct?',
      },
      options: [
        {
          text: 'Straße',
          isCorrect: true,
          icon: '🛣️',
        },
        {
          text: 'Schtraße',
          isCorrect: false,
          icon: '❌',
        },
        {
          text: 'Straase',
          isCorrect: false,
          icon: '❌',
        },
        {
          text: 'Schtrase',
          isCorrect: false,
          icon: '❌',
        },
      ],
    },
    {
      id: 16,
      type: 'grapheme',
      difficulty: 4,
      focus: 'ä statt e — wenn ein verwandtes Wort mit a existiert',
      question: {
        de: 'Man schreibt "ä", wenn ein verwandtes Wort mit "a" existiert (Wort → Wörter). Welche Schreibweise ist richtig?',
        pl: 'Piszemy "ä", gdy istnieje pokrewne słowo z "a" (Wort → Wörter). Które słowo jest poprawne?',
        en: 'You write "ä" when a related word with "a" exists (Wort → Wörter). Which spelling is correct?',
      },
      options: [
        {
          text: 'Wörter',
          isCorrect: true,
          icon: '📖',
        },
        {
          text: 'Werter',
          isCorrect: false,
          icon: '❌',
        },
        {
          text: 'Wörtar',
          isCorrect: false,
          icon: '❌',
        },
        {
          text: 'Woerter',
          isCorrect: false,
          icon: '❌',
        },
      ],
    },
    {
      id: 17,
      type: 'grapheme',
      difficulty: 4,
      focus: 'zusammengesetzte Wörter — Komposita immer zusammenschreiben',
      question: {
        de: 'Zusammengesetzte Wörter schreibt man im Deutschen immer zusammen, nie getrennt. Welche Schreibweise ist richtig?',
        pl: 'Wyrazy złożone piszemy w niemieckim zawsze razem, nigdy osobno. Które słowo jest poprawne?',
        en: 'Compound words in German are always written as one word, never separately. Which spelling is correct?',
      },
      options: [
        {
          text: 'Handschuh',
          isCorrect: true,
          icon: '🧤',
        },
        {
          text: 'Hand Schuh',
          isCorrect: false,
          icon: '❌',
        },
        {
          text: 'Handt schuh',
          isCorrect: false,
          icon: '❌',
        },
        {
          text: 'Hantschuh',
          isCorrect: false,
          icon: '❌',
        },
      ],
    },
    {
      id: 18,
      type: 'grapheme',
      difficulty: 4,
      focus: 'ai statt ei — seltenes Muster in Fremdwörtern',
      question: {
        de: 'In manchen Wörtern schreibt man "ai" statt des häufigeren "ei". Welche Schreibweise ist richtig?',
        pl: 'W niektórych słowach piszemy "ai" zamiast częstszego "ei". Które słowo jest poprawne?',
        en: 'In some words you write "ai" instead of the more common "ei". Which spelling is correct?',
      },
      options: [
        {
          text: 'Mais',
          isCorrect: true,
          icon: '🌽',
        },
        {
          text: 'Meis',
          isCorrect: false,
          icon: '❌',
        },
        {
          text: 'Maiss',
          isCorrect: false,
          icon: '❌',
        },
        {
          text: 'Meiss',
          isCorrect: false,
          icon: '❌',
        },
      ],
    },
    {
      id: 19,
      type: 'grapheme',
      focus: 'Reime erkennen',
      difficulty: 2,
      question: {
        de: 'Welches Wort reimt sich auf "Vertrag"?',
        pl: 'Które słowo rymuje się ze słowem "Vertrag" (umowa)?',
        en: 'Which word rhymes with "Vertrag" (contract)?',
      },
      options: [
        { text: 'Antrag', isCorrect: true, icon: '📋' },
        { text: 'Bericht', isCorrect: false, icon: '❌' },
        { text: 'Projekt', isCorrect: false, icon: '❌' },
        { text: 'Rabatt', isCorrect: false, icon: '❌' },
      ],
    },
    {
      id: 20,
      type: 'grapheme',
      focus: 'Reime erkennen',
      difficulty: 3,
      question: {
        de: 'Welches Wort reimt sich auf "Organisation"?',
        pl: 'Które słowo rymuje się ze słowem "Organisation" (organizacja)?',
        en: 'Which word rhymes with "Organisation"?',
      },
      options: [
        { text: 'Situation', isCorrect: true, icon: '🗂️' },
        { text: 'Diskussion', isCorrect: false, icon: '❌' },
        { text: 'Direktor', isCorrect: false, icon: '❌' },
        { text: 'Rechnung', isCorrect: false, icon: '❌' },
      ],
    },
    {
      id: 21,
      type: 'grapheme',
      focus: 'Reime — subtile Ähnlichkeiten',
      difficulty: 4,
      question: {
        de: 'Welches Wort reimt sich auf "Kollege"?',
        pl: 'Które słowo rymuje się ze słowem "Kollege" (kolega)?',
        en: 'Which word rhymes with "Kollege" (colleague)?',
      },
      options: [
        { text: 'Pflege', isCorrect: true, icon: '🩹' },
        { text: 'Kollegin', isCorrect: false, icon: '❌' },
        { text: 'Erfolg', isCorrect: false, icon: '❌' },
        { text: 'Vertrag', isCorrect: false, icon: '❌' },
      ],
    },
    {
      id: 22,
      type: 'grapheme',
      focus: 'phonemische Diskrimination — Stimmhaftigkeit',
      difficulty: 2,
      question: {
        de: 'Welches Wort beginnt mit einem stimmlosen Laut, anders als die übrigen?',
        pl: 'Które słowo zaczyna się głoską bezdźwięczną, inną niż pozostałe?',
        en: 'Which word starts with a voiceless sound, unlike the others?',
      },
      options: [
        { text: 'Plan', isCorrect: true, icon: '✅' },
        { text: 'Bericht', isCorrect: false, icon: '❌' },
        { text: 'Gebiet', isCorrect: false, icon: '❌' },
        { text: 'Diagramm', isCorrect: false, icon: '❌' },
      ],
    },
    {
      id: 23,
      type: 'grapheme',
      focus: 'phonemische Diskrimination — Nasale im Anlaut',
      difficulty: 3,
      question: {
        de: 'Welches Wort beginnt NICHT mit einem Nasallaut (m/n), anders als die übrigen?',
        pl: 'Które słowo NIE zaczyna się głoską nosową (m/n), inaczej niż pozostałe?',
        en: 'Which word does NOT start with a nasal sound (m/n), unlike the others?',
      },
      options: [
        { text: 'Vertrag', isCorrect: true, icon: '✅' },
        { text: 'Markt', isCorrect: false, icon: '❌' },
        { text: 'Notiz', isCorrect: false, icon: '❌' },
        { text: 'Meeting', isCorrect: false, icon: '❌' },
      ],
    },
    {
      id: 24,
      type: 'grapheme',
      focus: 'phonemische Diskrimination — v als f-Laut vs. v-Laut',
      difficulty: 4,
      question: {
        de: 'Bei welchem Wort wird das "V" als /v/ gesprochen, anders als bei den übrigen (dort als /f/)?',
        pl: 'W którym słowie literę "V" wymawia się jako /v/, inaczej niż w pozostałych (tam jako /f/)?',
        en: 'In which word is the "V" pronounced /v/, unlike the others (pronounced /f/)?',
      },
      options: [
        { text: 'Vase', isCorrect: true, icon: '✅' },
        { text: 'Vertrag', isCorrect: false, icon: '❌' },
        { text: 'Vorschlag', isCorrect: false, icon: '❌' },
        { text: 'Verkauf', isCorrect: false, icon: '❌' },
      ],
    },
    {
      id: 25,
      type: 'grapheme',
      difficulty: 2,
      focus: 'Homophone — Wahl vs. Wal',
      question: {
        de: 'Welches Wort passt: "Die ___ des neuen Vorstands findet nächste Woche statt"?',
        pl: 'Które słowo pasuje: "___ nowego zarządu odbędzie się w przyszłym tygodniu"?',
        en: 'Which word fits: "The ___ of the new board takes place next week"?',
      },
      options: [
        { text: 'Wahl', isCorrect: true, icon: '🗳️' },
        { text: 'Wal', isCorrect: false, icon: '❌' },
        { text: 'Whal', isCorrect: false, icon: '❌' },
        { text: 'Waal', isCorrect: false, icon: '❌' },
      ],
    },
    {
      id: 26,
      type: 'grapheme',
      difficulty: 3,
      focus: 'Homophone — Seite vs. Saite',
      question: {
        de: 'Welches Wort passt: "Bitte schlagen Sie das Dokument auf ___ 5 auf"?',
        pl: 'Które słowo pasuje: "Proszę otworzyć dokument na ___ 5"?',
        en: 'Which word fits: "Please open the document to ___ 5"?',
      },
      options: [
        { text: 'Seite', isCorrect: true, icon: '📄' },
        { text: 'Saite', isCorrect: false, icon: '❌' },
        { text: 'Seyte', isCorrect: false, icon: '❌' },
        { text: 'Zeite', isCorrect: false, icon: '❌' },
      ],
    },
    {
      id: 27,
      type: 'grapheme',
      difficulty: 4,
      focus: 'Homophone — Lehre vs. Leere',
      question: {
        de: 'Welches Wort passt: "Nach der ___ übernahm er eine Vollzeitstelle im Unternehmen"?',
        pl: 'Które słowo pasuje: "Po zakończeniu ___ zatrudniono go na pełen etat w firmie"?',
        en: 'Which word fits: "After the ___ he took a full-time position at the company"?',
      },
      options: [
        { text: 'Lehre', isCorrect: true, icon: '🎓' },
        { text: 'Leere', isCorrect: false, icon: '❌' },
        { text: 'Lere', isCorrect: false, icon: '❌' },
        { text: 'Löhre', isCorrect: false, icon: '❌' },
      ],
    },
    {
      id: 28,
      type: 'grapheme',
      difficulty: 1,
      focus: 'Begriff-zu-Icon-Zuordnung — Wirtschaft',
      question: {
        de: 'Welches Wort passt zum Begriff "Budget"?',
        pl: 'Które słowo pasuje do terminu "budżet"?',
        en: 'Which word matches the term "budget"?',
      },
      options: [
        { text: 'Geld', isCorrect: true, icon: '💰' },
        { text: 'Zusammenarbeit', isCorrect: false, icon: '🤝' },
        { text: 'Wachstum', isCorrect: false, icon: '📈' },
        { text: 'Frist', isCorrect: false, icon: '📅' },
      ],
    },
    {
      id: 29,
      type: 'grapheme',
      difficulty: 2,
      focus: 'Begriff-zu-Icon-Zuordnung — Medizin',
      question: {
        de: 'Welches Wort passt zum Begriff "Herzinfarkt"?',
        pl: 'Które słowo pasuje do terminu "zawał serca"?',
        en: 'Which word matches the term "heart attack"?',
      },
      options: [
        { text: 'Herz', isCorrect: true, icon: '🫀' },
        { text: 'Lunge', isCorrect: false, icon: '🫁' },
        { text: 'Gehirn', isCorrect: false, icon: '🧠' },
        { text: 'Knochen', isCorrect: false, icon: '🦴' },
      ],
    },
    {
      id: 30,
      type: 'grapheme',
      difficulty: 3,
      focus: 'Begriff-zu-Icon-Zuordnung — Recht',
      question: {
        de: 'Welches Wort passt zum Begriff "Klage"?',
        pl: 'Które słowo pasuje do terminu "pozew sądowy"?',
        en: 'Which word matches the term "lawsuit"?',
      },
      options: [
        { text: 'Gerechtigkeit', isCorrect: true, icon: '⚖️' },
        { text: 'Dokument', isCorrect: false, icon: '📄' },
        { text: 'Firma', isCorrect: false, icon: '🏢' },
        { text: 'Vertrag', isCorrect: false, icon: '🤝' },
      ],
    },
    {
      id: 31,
      type: 'grapheme',
      difficulty: 2,
      focus: 'Definitionen von Fachbegriffen — Medizin',
      question: {
        de: 'Welches Wort bedeutet abnormal hoher Blutdruck?',
        pl: 'Które słowo oznacza podwyższone ciśnienie krwi?',
        en: 'Which word means abnormally high blood pressure?',
      },
      options: [
        { text: 'Hypertonie', isCorrect: true, icon: '🩺' },
        { text: 'Hypotonie', isCorrect: false, icon: '❌' },
        { text: 'Diabetes', isCorrect: false, icon: '❌' },
        { text: 'Migräne', isCorrect: false, icon: '❌' },
      ],
    },
    {
      id: 32,
      type: 'grapheme',
      difficulty: 3,
      focus: 'Definitionen von Fachbegriffen — Recht',
      question: {
        de: 'Welches Wort bedeutet die amtliche Befugnis, Rechtsentscheidungen zu treffen?',
        pl: 'Które słowo oznacza zakres uprawnień sądu do rozstrzygania spraw?',
        en: 'Which word means the official authority to make legal decisions?',
      },
      options: [
        { text: 'Gerichtsbarkeit', isCorrect: true, icon: '⚖️' },
        { text: 'Gesetzgebung', isCorrect: false, icon: '❌' },
        { text: 'Berufung', isCorrect: false, icon: '❌' },
        { text: 'Klausel', isCorrect: false, icon: '❌' },
      ],
    },
    {
      id: 33,
      type: 'grapheme',
      difficulty: 3,
      focus: 'Definitionen von Fachbegriffen — Finanzen',
      question: {
        de: 'Welches Wort bedeutet die schrittweise Verteilung der Kosten eines Vermögenswerts über die Zeit?',
        pl: 'Które słowo oznacza stopniowe rozliczanie kosztu środka trwałego w czasie?',
        en: "Which word means the gradual write-off of an asset's cost over time?",
      },
      options: [
        { text: 'Abschreibung', isCorrect: true, icon: '📉' },
        { text: 'Inflation', isCorrect: false, icon: '❌' },
        { text: 'Provision', isCorrect: false, icon: '❌' },
        { text: 'Marge', isCorrect: false, icon: '❌' },
      ],
    },
    {
      id: 34,
      type: 'grapheme',
      difficulty: 2,
      focus: 'versteckte Wörter — morphologisches Bewusstsein',
      question: {
        de: 'Welches Wort ist versteckt in "Bürokratie"?',
        pl: 'Jakie słowo jest ukryte w słowie "Bürokratie" (biurokracja)?',
        en: 'What word is hidden in "Bürokratie" (bureaucracy)?',
      },
      options: [
        { text: 'Büro', isCorrect: true, icon: '🏢' },
        { text: 'Bürger', isCorrect: false, icon: '❌' },
        { text: 'Kratie', isCorrect: false, icon: '❌' },
        { text: 'Krawatte', isCorrect: false, icon: '❌' },
      ],
    },
    {
      id: 35,
      type: 'grapheme',
      difficulty: 3,
      focus: 'versteckte Wörter — morphologisches Bewusstsein',
      question: {
        de: 'Welches Wort ist versteckt in "Verantwortung"?',
        pl: 'Jakie słowo jest ukryte w słowie "Verantwortung" (odpowiedzialność)?',
        en: 'What word is hidden in "Verantwortung" (responsibility)?',
      },
      options: [
        { text: 'Antwort', isCorrect: true, icon: '💬' },
        { text: 'Wortung', isCorrect: false, icon: '❌' },
        { text: 'Verant', isCorrect: false, icon: '❌' },
        { text: 'Wartung', isCorrect: false, icon: '❌' },
      ],
    },
    {
      id: 36,
      type: 'grapheme',
      difficulty: 4,
      focus: 'versteckte Wörter — schwierigere morphologische Analyse',
      question: {
        de: 'Welches Wort ist versteckt in "Unternehmensberatung"?',
        pl: 'Jakie słowo jest ukryte w słowie "Unternehmensberatung" (doradztwo biznesowe)?',
        en: 'What word is hidden in "Unternehmensberatung" (business consulting)?',
      },
      options: [
        { text: 'Beratung', isCorrect: true, icon: '💼' },
        { text: 'Bericht', isCorrect: false, icon: '❌' },
        { text: 'Vertrag', isCorrect: false, icon: '❌' },
        { text: 'Meinung', isCorrect: false, icon: '❌' },
      ],
    },
    {
      id: 37,
      type: 'grapheme',
      difficulty: 2,
      focus: 'deduktives Schlussfolgern — einfache Prämissen',
      question: {
        de: 'Prämisse 1: "Jedes Projekt, das das Budget überschreitet, benötigt die Zustimmung der Geschäftsführung." Prämisse 2: "Projekt X hat das Budget überschritten." Was folgt daraus?',
        pl: 'Przesłanka 1: "Każdy projekt przekraczający budżet wymaga zgody zarządu." Przesłanka 2: "Projekt X przekroczył budżet." Co z tego wynika?',
        en: 'Premise 1: "Any project exceeding budget requires executive approval." Premise 2: "Project X exceeded budget." What follows?',
      },
      options: [
        {
          text: 'Es benötigt die Zustimmung der Geschäftsführung',
          isCorrect: true,
          icon: '✅',
        },
        { text: 'Das Projekt wird abgebrochen', isCorrect: false, icon: '❌' },
        { text: 'Das Team wird gerügt', isCorrect: false, icon: '❌' },
        {
          text: 'Es kann nichts geschlossen werden',
          isCorrect: false,
          icon: '❌',
        },
      ],
    },
    {
      id: 38,
      type: 'grapheme',
      difficulty: 3,
      focus: 'deduktives Schlussfolgern — Prämissenkette',
      question: {
        de: 'Prämisse 1: "Transaktionen über 50.000 € erfordern eine Prüfung." Prämisse 2: "Diese Transaktion beträgt 75.000 €." Prämisse 3: "Eine Prüfung dauert mindestens 5 Werktage." Was können wir schließen?',
        pl: 'Przesłanka 1: "Transakcje powyżej 50 000 zł wymagają audytu." Przesłanka 2: "Ta transakcja wynosi 75 000 zł." Przesłanka 3: "Audyt trwa co najmniej 5 dni roboczych." Co możemy stwierdzić?',
        en: 'Premise 1: "Transactions over $50,000 require an audit." Premise 2: "This transaction is $75,000." Premise 3: "An audit takes at least 5 business days." What can we conclude?',
      },
      options: [
        {
          text: 'Die Transaktion erfordert eine mindestens 5-tägige Prüfung',
          isCorrect: true,
          icon: '📋',
        },
        {
          text: 'Die Transaktion wird abgelehnt',
          isCorrect: false,
          icon: '❌',
        },
        {
          text: 'Es ist keine Prüfung erforderlich',
          isCorrect: false,
          icon: '❌',
        },
        {
          text: 'Die Zustimmung des Managers allein genügt',
          isCorrect: false,
          icon: '❌',
        },
      ],
    },
    {
      id: 39,
      type: 'grapheme',
      difficulty: 2,
      focus: 'induktives Schlussfolgern — Mustergeneralisierung',
      question: {
        de: 'Firma A: Investition in Automatisierung, Produktivität +20 %. Firma B: dasselbe, +18 %. Firma C: dasselbe, +22 %. Welches Muster legen diese Beispiele nahe?',
        pl: 'Firma A: inwestycja w automatyzację, produktywność +20%. Firma B: to samo, +18%. Firma C: to samo, +22%. Jaki wzorzec sugerują te przykłady?',
        en: 'Company A: invested in automation, productivity +20%. Company B: same, +18%. Company C: same, +22%. What pattern do these examples suggest?',
      },
      options: [
        {
          text: 'Automatisierung erhöht die Produktivität meist um etwa 18–22 %',
          isCorrect: true,
          icon: '📈',
        },
        {
          text: 'Automatisierung hat keinen Effekt auf die Produktivität',
          isCorrect: false,
          icon: '❌',
        },
        {
          text: 'Automatisierung erhöht die Produktivität immer um genau 20 %',
          isCorrect: false,
          icon: '❌',
        },
        {
          text: 'Aus diesen Daten lässt sich nichts ableiten',
          isCorrect: false,
          icon: '❌',
        },
      ],
    },
    {
      id: 40,
      type: 'grapheme',
      difficulty: 3,
      focus: 'induktives Schlussfolgern — Muster mit Ausnahme',
      question: {
        de: 'Marktwachstum: Jahr 1: +12 %, Jahr 2: +15 %, Jahr 3: -3 % (Rezession), Jahr 4: +10 %, Jahr 5: +14 %. Was ist die richtige Schlussfolgerung zum Trend?',
        pl: 'Wzrost rynku: Rok 1: +12%, Rok 2: +15%, Rok 3: -3% (recesja), Rok 4: +10%, Rok 5: +14%. Jaki jest właściwy wniosek o trendzie?',
        en: 'Market growth: Year 1: +12%, Year 2: +15%, Year 3: -3% (recession), Year 4: +10%, Year 5: +14%. What is the correct conclusion about the trend?',
      },
      options: [
        {
          text: 'Wachstum von etwa 12–15 % jährlich, mit Ausnahme des Rezessionsjahres',
          isCorrect: true,
          icon: '📊',
        },
        {
          text: 'Der Markt schrumpft kontinuierlich',
          isCorrect: false,
          icon: '❌',
        },
        {
          text: 'Der Trend ist völlig unvorhersehbar',
          isCorrect: false,
          icon: '❌',
        },
        {
          text: 'Jahr 3 sollte als Datenfehler ignoriert werden',
          isCorrect: false,
          icon: '❌',
        },
      ],
    },
    {
      id: 41,
      type: 'grapheme',
      difficulty: 2,
      focus: 'bedingte Logik — Wenn-Dann-Regel',
      question: {
        de: 'Regel: "Wenn Fieber > 38,5 °C UND Halsschmerzen vorliegen, DANN Streptokokken-Infektion vermuten." Der Patient hat 39,2 °C Fieber und Halsschmerzen. Was sollte in Betracht gezogen werden?',
        pl: 'Zasada: "Jeśli gorączka > 38,5°C ORAZ ból gardła, TO podejrzewaj infekcję paciorkowcową." Pacjent ma gorączkę 39,2°C i ból gardła. Co należy rozważyć?',
        en: 'Rule: "If fever > 38.5°C AND sore throat present, THEN suspect strep infection." The patient has a fever of 39.2°C and a sore throat. What should be considered?',
      },
      options: [
        {
          text: 'Eine Streptokokken-Infektion ist wahrscheinlich — Rachenabstrich empfehlen',
          isCorrect: true,
          icon: '🩺',
        },
        { text: 'Es ist sicher eine Erkältung', isCorrect: false, icon: '❌' },
        { text: 'Es ist nichts zu unternehmen', isCorrect: false, icon: '❌' },
        {
          text: 'Sofort Antibiotika ohne Test verabreichen',
          isCorrect: false,
          icon: '❌',
        },
      ],
    },
    {
      id: 42,
      type: 'grapheme',
      difficulty: 3,
      focus: 'bedingte Logik — verschachtelte Regeln',
      question: {
        de: 'Regeln: (1) Wenn Ausgabe < 5.000 € — Zustimmung des Managers. (2) Wenn 5.000–50.000 € — Zustimmung des Direktors. (3) Wenn der Lieferant nicht auf der Freigabeliste steht — Beschaffungsprüfung erforderlich (+5 Tage). Szenario: 30.000 € Ausgabe, neuer Lieferant. Was ist erforderlich?',
        pl: 'Zasady: (1) Jeśli wydatek < 5000 zł — zgoda kierownika. (2) Jeśli 5000–50000 zł — zgoda dyrektora. (3) Jeśli dostawca spoza listy zatwierdzonych — wymagany przegląd zakupowy (+5 dni). Scenariusz: wydatek 30 000 zł, nowy dostawca. Co jest wymagane?',
        en: 'Rules: (1) If expense < $5K — manager approval. (2) If $5K–$50K — director approval. (3) If vendor is not on the approved list — procurement review required (+5 days). Scenario: $30K expense, new vendor. What is required?',
      },
      options: [
        {
          text: 'Zustimmung des Direktors UND Beschaffungsprüfung (+5 Tage)',
          isCorrect: true,
          icon: '✅',
        },
        { text: 'Nur Zustimmung des Managers', isCorrect: false, icon: '❌' },
        { text: 'Keine Zustimmung erforderlich', isCorrect: false, icon: '❌' },
        {
          text: 'Nur Beschaffungsprüfung, keine Zustimmung',
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
      difficulty: 2,
      tags: ['business'],
      word: 'Verantwortung',
      segments: ['Ver', 'ant', 'wor', 'tung'],
      icon: '⚖️',
    },
    {
      id: 2,
      type: 'syllable',
      difficulty: 1,
      tags: ['business'],
      word: 'Beschäftigung',
      segments: ['Be', 'schäf', 'ti', 'gung'],
      icon: '💼',
    },
    {
      id: 3,
      type: 'syllable',
      difficulty: 2,
      tags: ['business'],
      word: 'Arbeitslosigkeit',
      segments: ['Ar', 'beits', 'lo', 'sig', 'keit'],
      icon: '📉',
    },
    {
      id: 4,
      type: 'syllable',
      difficulty: 3,
      tags: ['medicine', 'business'],
      word: 'Krankenversicherung',
      segments: ['Kran', 'ken', 'ver', 'si', 'che', 'rung'],
      icon: '🏥',
    },
    {
      id: 5,
      type: 'syllable',
      difficulty: 3,
      word: 'Auseinandersetzung',
      segments: ['Aus', 'ein', 'an', 'der', 'set', 'zung'],
      icon: '🤝',
    },
    {
      id: 6,
      type: 'syllable',
      difficulty: 1,
      word: 'Geschwindigkeit',
      segments: ['Ge', 'schwin', 'dig', 'keit'],
      icon: '🚀',
    },
    {
      id: 7,
      type: 'syllable',
      difficulty: 2,
      word: 'Wahrscheinlichkeit',
      segments: ['Wahr', 'schein', 'lich', 'keit'],
      icon: '🎲',
    },
    {
      id: 8,
      type: 'syllable',
      difficulty: 2,
      word: 'Selbstständigkeit',
      segments: ['Selbst', 'stän', 'dig', 'keit'],
      icon: '🏢',
    },
    {
      id: 9,
      type: 'syllable',
      difficulty: 2,
      word: 'Wohngemeinschaft',
      segments: ['Wohn', 'ge', 'mein', 'schaft'],
      icon: '🏠',
    },
    {
      id: 10,
      type: 'syllable',
      difficulty: 3,
      word: 'Informationsgesellschaft',
      segments: ['In', 'for', 'ma', 'ti', 'ons', 'ge', 'sell', 'schaft'],
      icon: '💻',
    },
    {
      id: 11,
      type: 'syllable',
      difficulty: 3,
      word: 'Unabhängigkeit',
      segments: ['Un', 'ab', 'hän', 'gig', 'keit'],
      icon: '🦅',
    },
    {
      id: 12,
      type: 'syllable',
      difficulty: 2,
      word: 'Zuverlässigkeit',
      segments: ['Zu', 'ver', 'läs', 'sig', 'keit'],
      icon: '🤝',
    },
  ],
  scrabble: [
    {
      id: 1,
      type: 'scrabble',
      difficulty: 3,
      word: 'RHYTHMUS',
      scrambled: ['R', 'H', 'Y', 'T', 'H', 'M', 'U', 'S'],
      distractors: ['I', 'E'],
      image: '🥁',
    },
    {
      id: 2,
      type: 'scrabble',
      difficulty: 3,
      tags: ['medicine'],
      word: 'PSYCHOLOGIE',
      scrambled: ['P', 'S', 'Y', 'C', 'H', 'O', 'L', 'O', 'G', 'I', 'E'],
      distractors: ['I', 'S'],
      image: '🧠',
    },
    {
      id: 3,
      type: 'scrabble',
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
      type: 'scrabble',
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
      type: 'scrabble',
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
      type: 'scrabble',
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
      type: 'scrabble',
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
      type: 'scrabble',
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
      type: 'scrabble',
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
      type: 'scrabble',
      difficulty: 1,
      word: 'GESELLSCHAFT',
      scrambled: ['G', 'E', 'S', 'E', 'L', 'L', 'S', 'C', 'H', 'A', 'F', 'T'],
      distractors: ['Z', 'K'],
      image: '👥',
    },
    {
      id: 11,
      type: 'scrabble',
      difficulty: 3,
      word: 'AUTHENTISCH',
      scrambled: ['A', 'U', 'T', 'H', 'E', 'N', 'T', 'I', 'S', 'C', 'H'],
      distractors: ['F', 'M'],
      image: '💎',
    },
    {
      id: 12,
      type: 'scrabble',
      difficulty: 3,
      word: 'BÜROKRATIE',
      scrambled: ['B', 'Ü', 'R', 'O', 'K', 'R', 'A', 'T', 'I', 'E'],
      distractors: ['U', 'C'],
      image: '🏢',
    },
    {
      id: 13,
      type: 'scrabble',
      focus: 'phonemische Synthese — einzelne Buchstaben',
      difficulty: 2,
      word: 'BERICHT',
      scrambled: ['B', 'E', 'R', 'I', 'C', 'H', 'T'],
      distractors: ['N', 'K'],
      image: '📄',
    },
    {
      id: 14,
      type: 'scrabble',
      focus: 'phonemische Synthese — Silben',
      difficulty: 3,
      word: 'MARKT',
      scrambled: ['MAR', 'KT'],
      distractors: ['TAR', 'LE'],
      image: '🏪',
    },
    {
      id: 15,
      type: 'scrabble',
      focus: 'phonemische Synthese — Silben',
      difficulty: 4,
      word: 'VERTRAG',
      scrambled: ['VER', 'TRAG'],
      distractors: ['TAG', 'IS'],
      image: '📝',
    },
  ],
  context: [
    {
      id: 1,
      type: 'context',
      difficulty: 1,
      tags: ['business'],
      sentence_part1: 'Er glaubt,',
      sentence_part2: 'die neue Regelung rechtzeitig in Kraft tritt.',
      options: [
        {
          text: 'dass',
          isCorrect: true,
        },
        {
          text: 'das',
          isCorrect: false,
        },
        {
          text: 'daß',
          isCorrect: false,
        },
        {
          text: 'daas',
          isCorrect: false,
        },
      ],
      hint: {
        de: "‚dass' ist hier eine Konjunktion (Bindewort), man kann es nicht durch dies/jenes ersetzen.",
        en: "'dass' = subordinating conjunction (that); 'das' = article or pronoun (the/which)",
      },
    },
    {
      id: 2,
      type: 'context',
      difficulty: 1,
      tags: ['everyday', 'business'],
      sentence_part1: 'Bitte unterschreiben Sie',
      sentence_part2: 'Dokument auf Seite drei.',
      options: [
        {
          text: 'das',
          isCorrect: true,
        },
        {
          text: 'dass',
          isCorrect: false,
        },
        {
          text: 'daß',
          isCorrect: false,
        },
        {
          text: 'daas',
          isCorrect: false,
        },
      ],
      hint: {
        de: "‚das' ist hier der bestimmte Artikel zu dem Wort Dokument.",
        en: "'das' here = definite article for a neuter noun",
      },
    },
    {
      id: 3,
      type: 'context',
      difficulty: 1,
      tags: ['business'],
      sentence_part1: 'Das Unternehmen trägt die volle',
      sentence_part2: 'für den entstandenen Schaden.',
      options: [
        {
          text: 'Verantwortung',
          isCorrect: true,
        },
        {
          text: 'verantwortung',
          isCorrect: false,
        },
        {
          text: 'Verantvortung',
          isCorrect: false,
        },
        {
          text: 'verantvortung',
          isCorrect: false,
        },
      ],
      hint: {
        de: 'Nomen werden im Deutschen immer großgeschrieben.',
        en: 'All nouns in German are capitalised — Verantwortung is a noun',
      },
    },
    {
      id: 4,
      type: 'context',
      difficulty: 2,
      sentence_part1: 'Die Konferenz findet morgen in',
      sentence_part2: 'Hauptgebäude statt.',
      options: [
        {
          text: 'unserem',
          isCorrect: true,
        },
        {
          text: 'unserm',
          isCorrect: false,
        },
        {
          text: 'unseren',
          isCorrect: false,
        },
        {
          text: 'unsrem',
          isCorrect: false,
        },
      ],
      hint: {
        de: 'Dativ: Die Endung -em muss komplett ausgeschrieben werden (unserem).',
        en: 'Dative masculine/neuter: unserem — the dative ending -em must be complete',
      },
    },
    {
      id: 5,
      type: 'context',
      difficulty: 1,
      sentence_part1: 'Die neue Regelung',
      sentence_part2: 'alle Mitarbeiterinnen und Mitarbeiter.',
      options: [
        {
          text: 'betrifft',
          isCorrect: true,
        },
        {
          text: 'betrift',
          isCorrect: false,
        },
        {
          text: 'betrieft',
          isCorrect: false,
        },
        {
          text: 'betriefft',
          isCorrect: false,
        },
      ],
      hint: {
        de: 'Nach dem kurzen i wird der Konsonant f verdoppelt (ff).',
        en: 'treffen → betreffen → betrifft: the double f comes from the short vowel before it',
      },
    },
    {
      id: 6,
      type: 'context',
      difficulty: 1,
      sentence_part1: 'Herr Müller hat seinen',
      sentence_part2: 'bereits unterschrieben.',
      options: [
        {
          text: 'Arbeitsvertrag',
          isCorrect: true,
        },
        {
          text: 'Arbeits Vertrag',
          isCorrect: false,
        },
        {
          text: 'Arbeits-Vertrag',
          isCorrect: false,
        },
        {
          text: 'arbeitvertrag',
          isCorrect: false,
        },
      ],
      hint: {
        de: 'Zusammengesetzte Nomen (Komposita) werden im Deutschen zusammen geschrieben.',
        en: 'German compound nouns are always written as one word, never separated',
      },
    },
    {
      id: 7,
      type: 'context',
      difficulty: 1,
      sentence_part1: 'Das Projekt wurde',
      sentence_part2: 'abgeschlossen.',
      options: [
        {
          text: 'erfolgreich',
          isCorrect: true,
        },
        {
          text: 'Erfolgreich',
          isCorrect: false,
        },
        {
          text: 'erfolgreih',
          isCorrect: false,
        },
        {
          text: 'erfolkreich',
          isCorrect: false,
        },
      ],
      hint: {
        de: 'Adjektive und Adverbien werden im Deutschen kleingeschrieben.',
        en: 'erfolgreich is an adjective/adverb — adjectives and adverbs are NOT capitalised in German',
      },
    },
    {
      id: 8,
      type: 'context',
      difficulty: 2,
      sentence_part1: 'Die Bewerberin verfügt über eine hervorragende',
      sentence_part2: 'im Projektmanagement.',
      options: [
        {
          text: 'Qualifikation',
          isCorrect: true,
        },
        {
          text: 'Qualifiqation',
          isCorrect: false,
        },
        {
          text: 'Kwalifikation',
          isCorrect: false,
        },
        {
          text: 'Qualifikatzion',
          isCorrect: false,
        },
      ],
      hint: {
        de: 'Die Endung -tion wird immer mit t geschrieben, nie mit q oder z.',
        en: 'Foreign suffix -tion is always written with t (never z or q)',
      },
    },
    {
      id: 9,
      type: 'context',
      difficulty: 1,
      sentence_part1: 'Das Auto fuhr mit hoher',
      sentence_part2: 'durch die Stadt.',
      options: [
        {
          text: 'Geschwindigkeit',
          isCorrect: true,
        },
        {
          text: 'Geschwindichkeit',
          isCorrect: false,
        },
        {
          text: 'Geschwindigkheit',
          isCorrect: false,
        },
        {
          text: 'Geschwindigkeid',
          isCorrect: false,
        },
      ],
      hint: {
        de: 'Die Endung ist -igkeit (geschwind + ig + keit), nicht -ichkeit.',
        en: 'The suffix is -igkeit (from geschwind + ig + keit), not -ichkeit',
      },
    },
    {
      id: 10,
      type: 'context',
      difficulty: 2,
      tags: ['medicine'],
      sentence_part1: 'Die Krankenversicherung',
      sentence_part2: 'die Kosten für die Operation.',
      options: [
        {
          text: 'übernimmt',
          isCorrect: true,
        },
        {
          text: 'übernimpt',
          isCorrect: false,
        },
        {
          text: 'übernimt',
          isCorrect: false,
        },
        {
          text: 'übernimmpt',
          isCorrect: false,
        },
      ],
      hint: {
        de: 'Kommt von nehmen. In der 3. Person Singular wird das m verdoppelt (nimmt).',
        en: 'From nehmen: the m is doubled in the 3rd person singular (nimmt).',
      },
    },
    {
      id: 11,
      type: 'context',
      difficulty: 2,
      tags: ['business'],
      sentence_part1: 'Wir warten schon',
      sentence_part2: 'drei Stunden auf das Ergebnis.',
      options: [
        {
          text: 'seit',
          isCorrect: true,
        },
        {
          text: 'seid',
          isCorrect: false,
        },
        {
          text: 'seidt',
          isCorrect: false,
        },
        {
          text: 'seith',
          isCorrect: false,
        },
      ],
      hint: {
        de: "‚seit' verwendet man bei Zeitangaben (seit wann?). ‚seid' ist ein Verb (ihr seid).",
        en: "'seit' is for time (since), 'seid' is the verb (you are).",
      },
    },
    {
      id: 12,
      type: 'context',
      difficulty: 3,
      tags: ['everyday'],
      sentence_part1: 'Der Aktivist leistete großen',
      sentence_part2: 'gegen die neuen Pläne.',
      options: [
        {
          text: 'Widerstand',
          isCorrect: true,
        },
        {
          text: 'Wiederstand',
          isCorrect: false,
        },
        {
          text: 'Wieder stand',
          isCorrect: false,
        },
        {
          text: 'Wider stand',
          isCorrect: false,
        },
      ],
      hint: {
        de: "‚Wider' bedeutet ‚gegen' (Widerstand = gegen etwas stehen). ‚Wieder' bedeutet ‚nochmal'.",
        en: "'wider' means against, 'wieder' means again.",
      },
    },
    {
      id: 13,
      type: 'context',
      difficulty: 2,
      tags: ['business'],
      sentence_part1: 'Bitte schicken Sie uns das',
      sentence_part2: 'bis Ende der Woche.',
      options: [
        {
          text: 'Angebot',
          isCorrect: true,
        },
        {
          text: 'Angebott',
          isCorrect: false,
        },
        {
          text: 'Angepot',
          isCorrect: false,
        },
        {
          text: 'Angeboot',
          isCorrect: false,
        },
      ],
      hint: {
        de: 'Auslautverhärtung: Man spricht ein [t], schreibt aber ein d (Angebote).',
        en: 'Hardened ending: spoken as [t] but written as d (Angebot -> Angebote).',
      },
    },
    {
      id: 14,
      type: 'context',
      difficulty: 2,
      tags: ['business'],
      sentence_part1: 'Er hat heute ein wichtiges',
      sentence_part2: 'mit dem Kunden.',
      options: [
        {
          text: 'Gespräch',
          isCorrect: true,
        },
        {
          text: 'Gesprech',
          isCorrect: false,
        },
        {
          text: 'Geshpräch',
          isCorrect: false,
        },
        {
          text: 'Gespreech',
          isCorrect: false,
        },
      ],
      hint: {
        de: 'Kommt von "sprechen", daher mit ä.',
        en: 'Derived from "sprechen" (to speak), hence written with ä.',
      },
    },
    {
      id: 15,
      type: 'context',
      difficulty: 1,
      tags: ['business'],
      sentence_part1: 'Bitte prüfen Sie den',
      sentence_part2: 'zu dieser E-Mail.',
      options: [
        { text: 'Anhang', isCorrect: true },
        { text: 'Anhagn', isCorrect: false },
        { text: 'Annhang', isCorrect: false },
        { text: 'Anhagng', isCorrect: false },
      ],
      hint: {
        de: '"Anhang" — ein n, endet auf -hang.',
        en: 'attachment — one n, ends in -hang.',
      },
    },
    {
      id: 16,
      type: 'context',
      difficulty: 2,
      tags: ['medicine'],
      sentence_part1: 'Der Patient leidet seit Jahren an',
      sentence_part2: 'und Kopfschmerzen.',
      options: [
        { text: 'Hypertonie', isCorrect: true },
        { text: 'Hypertonnie', isCorrect: false },
        { text: 'Hyperthonie', isCorrect: false },
        { text: 'Hipertonie', isCorrect: false },
      ],
      hint: {
        de: '"Hypertonie" — aus dem Griechischen, mit y und einfachem t.',
        en: 'hypertension — from Greek, spelled with y and single t.',
      },
    },
    {
      id: 17,
      type: 'context',
      difficulty: 3,
      tags: ['business'],
      sentence_part1:
        'Gemäß Artikel 42 des Arbeitsrechts kann ein Arbeitnehmer eine',
      sentence_part2: 'für gesundheitliche Berufsschäden erhalten.',
      options: [
        { text: 'Entschädigung', isCorrect: true },
        { text: 'Endschädigung', isCorrect: false },
        { text: 'Entschädiegung', isCorrect: false },
        { text: 'Entschädigunk', isCorrect: false },
      ],
      hint: {
        de: '"Entschädigung" — beginnt mit "Ent-" (nicht "End-").',
        en: 'compensation — starts with "Ent-" (not "End-").',
      },
    },
  ],
  clock: [
    {
      id: 1,
      type: 'clock',
      difficulty: 1,
      timeAnalog: 'Viertel nach drei am Nachmittag',
      isNight: false,
      hourRotation: 98,
      minuteRotation: 90,
      options: [
        {
          text: '15:15 Uhr',
          isCorrect: true,
        },
        {
          text: '3:15 Uhr',
          isCorrect: false,
        },
        {
          text: '15:03 Uhr',
          isCorrect: false,
        },
        {
          text: '16:15 Uhr',
          isCorrect: false,
        },
      ],
    },
    {
      id: 2,
      type: 'clock',
      difficulty: 1,
      timeAnalog: 'Halb sieben am Abend',
      isNight: true,
      hourRotation: 195,
      minuteRotation: 180,
      options: [
        {
          text: '18:30 Uhr',
          isCorrect: true,
        },
        {
          text: '6:30 Uhr',
          isCorrect: false,
        },
        {
          text: '18:06 Uhr',
          isCorrect: false,
        },
        {
          text: '19:30 Uhr',
          isCorrect: false,
        },
      ],
    },
    {
      id: 3,
      type: 'clock',
      difficulty: 1,
      timeAnalog: 'Zehn vor zehn am Morgen',
      isNight: false,
      hourRotation: 295,
      minuteRotation: 300,
      options: [
        {
          text: '9:50 Uhr',
          isCorrect: true,
        },
        {
          text: '21:50 Uhr',
          isCorrect: false,
        },
        {
          text: '10:50 Uhr',
          isCorrect: false,
        },
        {
          text: '9:10 Uhr',
          isCorrect: false,
        },
      ],
    },
    {
      id: 4,
      type: 'clock',
      difficulty: 1,
      timeAnalog: 'Mittag',
      isNight: false,
      hourRotation: 0,
      minuteRotation: 0,
      options: [
        {
          text: '12:00 Uhr',
          isCorrect: true,
        },
        {
          text: '0:00 Uhr',
          isCorrect: false,
        },
        {
          text: '12:30 Uhr',
          isCorrect: false,
        },
        {
          text: '6:00 Uhr',
          isCorrect: false,
        },
      ],
    },
    {
      id: 5,
      type: 'clock',
      difficulty: 1,
      timeAnalog: 'Mitternacht',
      isNight: true,
      hourRotation: 0,
      minuteRotation: 0,
      options: [
        {
          text: '0:00 Uhr',
          isCorrect: true,
        },
        {
          text: '12:00 Uhr',
          isCorrect: false,
        },
        {
          text: '0:12 Uhr',
          isCorrect: false,
        },
        {
          text: '23:59 Uhr',
          isCorrect: false,
        },
      ],
    },
    {
      id: 6,
      type: 'clock',
      difficulty: 2,
      timeAnalog: 'Halb eins am Nachmittag',
      isNight: false,
      hourRotation: 15,
      minuteRotation: 180,
      options: [
        {
          text: '12:30 Uhr',
          isCorrect: true,
        },
        {
          text: '0:30 Uhr',
          isCorrect: false,
        },
        {
          text: '6:00 Uhr',
          isCorrect: false,
        },
        {
          text: '13:30 Uhr',
          isCorrect: false,
        },
      ],
    },
    {
      id: 7,
      type: 'clock',
      difficulty: 2,
      timeAnalog: 'Viertel vor neun am Abend',
      isNight: true,
      hourRotation: 262,
      minuteRotation: 270,
      options: [
        {
          text: '20:45 Uhr',
          isCorrect: true,
        },
        {
          text: '8:45 Uhr',
          isCorrect: false,
        },
        {
          text: '21:15 Uhr',
          isCorrect: false,
        },
        {
          text: '21:40 Uhr',
          isCorrect: false,
        },
      ],
    },
    {
      id: 8,
      type: 'clock',
      difficulty: 1,
      timeAnalog: 'Zwanzig nach vier am Nachmittag',
      isNight: false,
      hourRotation: 130,
      minuteRotation: 120,
      options: [
        {
          text: '16:20 Uhr',
          isCorrect: true,
        },
        {
          text: '4:20 Uhr',
          isCorrect: false,
        },
        {
          text: '16:40 Uhr',
          isCorrect: false,
        },
        {
          text: '20:16 Uhr',
          isCorrect: false,
        },
      ],
    },
    {
      id: 9,
      type: 'clock',
      difficulty: 2,
      timeAnalog: 'Fünf nach halb zwölf in der Nacht',
      isNight: true,
      hourRotation: 347,
      minuteRotation: 210,
      options: [
        {
          text: '23:35 Uhr',
          isCorrect: true,
        },
        {
          text: '11:35 Uhr',
          isCorrect: false,
        },
        {
          text: '0:35 Uhr',
          isCorrect: false,
        },
        {
          text: '19:55 Uhr',
          isCorrect: false,
        },
      ],
    },
    {
      id: 10,
      type: 'clock',
      difficulty: 1,
      timeAnalog: 'Sechs Uhr abends',
      isNight: true,
      hourRotation: 180,
      minuteRotation: 0,
      options: [
        {
          text: '18:00 Uhr',
          isCorrect: true,
        },
        {
          text: '6:00 Uhr',
          isCorrect: false,
        },
        {
          text: '12:30 Uhr',
          isCorrect: false,
        },
        {
          text: '19:00 Uhr',
          isCorrect: false,
        },
      ],
    },
    {
      id: 11,
      type: 'clock',
      difficulty: 2,
      timeAnalog: 'Viertel vor acht am Morgen',
      isNight: false,
      hourRotation: 232,
      minuteRotation: 270,
      options: [
        {
          text: '7:45 Uhr',
          isCorrect: true,
        },
        {
          text: '19:45 Uhr',
          isCorrect: false,
        },
        {
          text: '8:45 Uhr',
          isCorrect: false,
        },
        {
          text: '7:09 Uhr',
          isCorrect: false,
        },
      ],
    },
    {
      id: 12,
      type: 'clock',
      difficulty: 2,
      timeAnalog: 'Zwanzig nach zwei am Nachmittag',
      isNight: false,
      hourRotation: 70,
      minuteRotation: 120,
      options: [
        {
          text: '14:20 Uhr',
          isCorrect: true,
        },
        {
          text: '2:20 Uhr',
          isCorrect: false,
        },
        {
          text: '14:04 Uhr',
          isCorrect: false,
        },
        {
          text: '14:40 Uhr',
          isCorrect: false,
        },
      ],
    },
    {
      id: 13,
      type: 'clock',
      difficulty: 3,
      timeAnalog: 'Fünf nach elf in der Nacht',
      isNight: true,
      hourRotation: 332,
      minuteRotation: 30,
      options: [
        {
          text: '23:05 Uhr',
          isCorrect: true,
        },
        {
          text: '11:05 Uhr',
          isCorrect: false,
        },
        {
          text: '23:01 Uhr',
          isCorrect: false,
        },
        {
          text: '5:11 Uhr',
          isCorrect: false,
        },
      ],
    },
    {
      id: 14,
      type: 'clock',
      difficulty: 1,
      timeAnalog: 'Viertel nach neun am Morgen',
      isNight: false,
      hourRotation: 278,
      minuteRotation: 90,
      options: [
        {
          text: '9:15 Uhr',
          isCorrect: true,
        },
        {
          text: '21:15 Uhr',
          isCorrect: false,
        },
        {
          text: '9:03 Uhr',
          isCorrect: false,
        },
        {
          text: '3:45 Uhr',
          isCorrect: false,
        },
      ],
    },
    {
      id: 15,
      type: 'clock',
      difficulty: 2,
      timeAnalog: 'Zehn vor neun am Abend',
      isNight: true,
      hourRotation: 265,
      minuteRotation: 300,
      options: [
        {
          text: '20:50 Uhr',
          isCorrect: true,
        },
        {
          text: '8:50 Uhr',
          isCorrect: false,
        },
        {
          text: '21:50 Uhr',
          isCorrect: false,
        },
        {
          text: '20:10 Uhr',
          isCorrect: false,
        },
      ],
    },
  ],
  sequences: [
    {
      id: 1,
      type: 'sequence',
      difficulty: 1,
      instruction: 'Ordne die Wochentage in die richtige Reihenfolge',
      scrambled: ['Mittwoch', 'Montag', 'Freitag', 'Dienstag'],
      distractors: ['Samstag', 'Sonntag'],
      correct: ['Montag', 'Dienstag', 'Mittwoch', 'Freitag'],
    },
    {
      id: 2,
      type: 'sequence',
      difficulty: 1,
      instruction: 'Ordne die Monate des zweiten Quartals',
      scrambled: ['Juni', 'April', 'Mai'],
      distractors: ['Juli'],
      correct: ['April', 'Mai', 'Juni'],
    },
    {
      id: 3,
      type: 'sequence',
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
      type: 'sequence',
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
      type: 'sequence',
      difficulty: 1,
      instruction: 'Beträge vom kleinsten zum größten',
      scrambled: ['1.000.000 €', '500 €', '10.000 €', '75 €'],
      distractors: ['100 €'],
      correct: ['75 €', '500 €', '10.000 €', '1.000.000 €'],
    },
    {
      id: 6,
      type: 'sequence',
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
      type: 'sequence',
      difficulty: 1,
      instruction: 'Zeiteinheiten — kürzeste zuerst',
      scrambled: ['Jahrhundert', 'Sekunde', 'Jahrzehnt', 'Jahr'],
      distractors: ['Monat'],
      correct: ['Sekunde', 'Jahr', 'Jahrzehnt', 'Jahrhundert'],
    },
    {
      id: 8,
      type: 'sequence',
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
      type: 'sequence',
      difficulty: 2,
      instruction: 'Phasen eines Projekts (klassisches PM)',
      scrambled: ['Abschluss', 'Planung', 'Durchführung', 'Initiierung'],
      distractors: ['Urlaub'],
      correct: ['Initiierung', 'Planung', 'Durchführung', 'Abschluss'],
    },
    {
      id: 10,
      type: 'sequence',
      difficulty: 1,
      instruction: 'Alphabetische Reihenfolge — Berufswörter',
      scrambled: ['Vertrag', 'Rechnung', 'Angebot', 'Protokoll'],
      distractors: ['Zahlung'],
      correct: ['Angebot', 'Protokoll', 'Rechnung', 'Vertrag'],
    },
    {
      id: 11,
      type: 'sequence',
      difficulty: 2,
      tags: ['business'],
      instruction: 'Ablauf eines Standard-Meetings',
      scrambled: [
        'Zusammenfassung',
        'Begrüßung',
        'Verabschiedung',
        'Themenbesprechung',
      ],
      distractors: ['Mittagspause'],
      correct: [
        'Begrüßung',
        'Themenbesprechung',
        'Zusammenfassung',
        'Verabschiedung',
      ],
    },
  ],
  memorySpan: [
    {
      id: 1,
      type: 'memorySpan',
      difficulty: 1,
      instruction:
        'Merke dir die Reihenfolge der Wörter und gib sie dann aus dem Gedächtnis wieder',
      displayItems: ['Budget', 'Team', 'Frist'],
      correct: ['Budget', 'Team', 'Frist'],
      scrambled: ['Frist', 'Budget', 'Team'],
    },
    {
      id: 2,
      type: 'memorySpan',
      difficulty: 2,
      instruction:
        'Merke dir die Reihenfolge der Wörter und gib sie dann aus dem Gedächtnis wieder',
      displayItems: ['Rechnung', 'Kunde', 'Vertrag', 'Besprechung'],
      correct: ['Rechnung', 'Kunde', 'Vertrag', 'Besprechung'],
      scrambled: ['Vertrag', 'Rechnung', 'Besprechung', 'Kunde'],
    },
    {
      id: 3,
      type: 'memorySpan',
      difficulty: 3,
      instruction:
        'Merke dir die Reihenfolge der Wörter und gib sie dann aus dem Gedächtnis wieder',
      displayItems: ['Bericht', 'Budget', 'Strategie', 'Analyse', 'Einführung'],
      correct: ['Bericht', 'Budget', 'Strategie', 'Analyse', 'Einführung'],
      scrambled: [
        'Strategie',
        'Rekrutierung',
        'Einführung',
        'Bericht',
        'Analyse',
        'Budget',
      ],
    },
  ],
  tracking: [
    {
      id: 1,
      type: 'spatial',
      difficulty: 1,
      instruction: 'Auf welcher Seite ist der Bauch des Buchstabens?',
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
        {
          symbol: 'd',
          target: 'left',
        },
      ],
      options: [
        {
          label: 'Links ⬅️',
          value: 'left',
        },
        {
          label: 'Rechts ➡️',
          value: 'right',
        },
      ],
    },
    {
      id: 2,
      type: 'spatial',
      difficulty: 1,
      instruction: 'In welche Richtung zeigt der Pfeil?',
      items: [
        {
          symbol: '➡️',
          target: 'right',
        },
        {
          symbol: '⬅️',
          target: 'left',
        },
        {
          symbol: '➡️',
          target: 'right',
        },
        {
          symbol: '➡️',
          target: 'right',
        },
        {
          symbol: '⬅️',
          target: 'left',
        },
      ],
      options: [
        {
          label: 'Links ⬅️',
          value: 'left',
        },
        {
          label: 'Rechts ➡️',
          value: 'right',
        },
      ],
    },
    {
      id: 3,
      type: 'spatial',
      difficulty: 1,
      instruction: 'Wo ist der Bauch bei diesem Buchstaben?',
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
        {
          symbol: 'q',
          target: 'left',
        },
      ],
      options: [
        {
          label: 'Links ⬅️',
          value: 'left',
        },
        {
          label: 'Rechts ➡️',
          value: 'right',
        },
      ],
    },
    {
      id: 4,
      type: 'spatial',
      difficulty: 1,
      instruction: 'In welche Richtung zeigt das Dreieck?',
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
        {
          symbol: '▷',
          target: 'right',
        },
      ],
      options: [
        {
          label: 'Links ⬅️',
          value: 'left',
        },
        {
          label: 'Rechts ➡️',
          value: 'right',
        },
      ],
    },
    {
      id: 5,
      type: 'spatial',
      difficulty: 1,
      instruction: 'Zeige die Richtung, in die die Hand zeigt',
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
          label: 'Links ⬅️',
          value: 'left',
        },
        {
          label: 'Rechts ➡️',
          value: 'right',
        },
      ],
    },
    {
      id: 6,
      type: 'spatial',
      difficulty: 1,
      instruction: 'In welche Richtung zeigt das Dreieck?',
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
        {
          symbol: '▷',
          target: 'right',
        },
      ],
      options: [
        {
          label: 'Links ⬅️',
          value: 'left',
        },
        {
          label: 'Rechts ➡️',
          value: 'right',
        },
      ],
    },
    {
      id: 7,
      type: 'spatial',
      difficulty: 1,
      instruction: 'Wo ist die eckige Klammer geöffnet?',
      items: [
        {
          symbol: '[',
          target: 'right',
        },
        {
          symbol: ']',
          target: 'left',
        },
        {
          symbol: '[',
          target: 'right',
        },
        {
          symbol: ']',
          target: 'left',
        },
        {
          symbol: ']',
          target: 'left',
        },
      ],
      options: [
        {
          label: 'Links ⬅️',
          value: 'left',
        },
        {
          label: 'Rechts ➡️',
          value: 'right',
        },
      ],
    },
    {
      id: 8,
      type: 'spatial',
      difficulty: 1,
      instruction: 'In welche Richtung lehnt der Schrägstrich?',
      items: [
        {
          symbol: '/',
          target: 'right',
        },
        {
          symbol: '\\',
          target: 'left',
        },
        {
          symbol: '/',
          target: 'right',
        },
        {
          symbol: '\\',
          target: 'left',
        },
        {
          symbol: '/',
          target: 'right',
        },
      ],
      options: [
        {
          label: 'Links (\\) ⬅️',
          value: 'left',
        },
        {
          label: 'Rechts (/) ➡️',
          value: 'right',
        },
      ],
    },
    {
      id: 9,
      type: 'spatial',
      difficulty: 2,
      instruction: 'Blinker im Dienstwagen — in welche Richtung biegst du ab?',
      items: [
        { symbol: '➡️', target: 'right' },
        { symbol: '⬅️', target: 'left' },
        { symbol: '⬅️', target: 'left' },
        { symbol: '➡️', target: 'right' },
        { symbol: '⬅️', target: 'left' },
      ],
      options: [
        { label: 'Links ⬅️', value: 'left' },
        { label: 'Rechts ➡️', value: 'right' },
      ],
    },
    {
      id: 10,
      type: 'spatial',
      difficulty: 2,
      instruction: 'GPS-Pfeil auf dem Weg zum Kunden — wohin führt die Route?',
      items: [
        { symbol: '←', target: 'left' },
        { symbol: '→', target: 'right' },
        { symbol: '→', target: 'right' },
        { symbol: '←', target: 'left' },
        { symbol: '→', target: 'right' },
      ],
      options: [
        { label: 'Links ⬅️', value: 'left' },
        { label: 'Rechts ➡️', value: 'right' },
      ],
    },
    {
      id: 11,
      type: 'spatial',
      difficulty: 3,
      instruction:
        'Im Organigramm zeigt der Pfeil, wem eine Abteilung unterstellt ist — in welche Richtung zeigt er?',
      items: [
        { symbol: '◁', target: 'left' },
        { symbol: '▷', target: 'right' },
        { symbol: '◁', target: 'left' },
        { symbol: '▷', target: 'right' },
        { symbol: '▷', target: 'right' },
      ],
      options: [
        { label: 'Links ⬅️', value: 'left' },
        { label: 'Rechts ➡️', value: 'right' },
      ],
    },
    {
      id: 12,
      type: 'spatial',
      difficulty: 3,
      instruction:
        'In diesem Dokument markiert der Pfeil die Unterschriftsstelle — auf welcher Seite ist sie?',
      items: [
        { symbol: '➡️', target: 'right' },
        { symbol: '➡️', target: 'right' },
        { symbol: '⬅️', target: 'left' },
        { symbol: '➡️', target: 'right' },
        { symbol: '⬅️', target: 'left' },
      ],
      options: [
        { label: 'Links ⬅️', value: 'left' },
        { label: 'Rechts ➡️', value: 'right' },
      ],
    },
    {
      id: 13,
      type: 'spatial',
      difficulty: 1,
      instruction: 'Großbuchstabe oder Kleinbuchstabe?',
      items: [
        { symbol: 'A', target: 'up' },
        { symbol: 'b', target: 'down' },
        { symbol: 'C', target: 'up' },
        { symbol: 'd', target: 'down' },
      ],
      options: [
        { label: 'Groß 🔠', value: 'up' },
        { label: 'Klein 🔡', value: 'down' },
      ],
    },
    {
      id: 14,
      type: 'spatial',
      difficulty: 2,
      instruction: 'Wo ist die Schlaufe dieser Ziffer — oben oder unten?',
      items: [
        { symbol: '6', target: 'down' },
        { symbol: '9', target: 'up' },
        { symbol: '6', target: 'down' },
        { symbol: '9', target: 'up' },
        { symbol: '6', target: 'down' },
      ],
      options: [
        { label: 'Unten 🔽', value: 'down' },
        { label: 'Oben 🔼', value: 'up' },
      ],
    },
  ],
  lcwc: [
    {
      id: 1,
      type: 'lookCoverWriteCheck',
      lcwc: true,
      difficulty: 2,
      word: 'Rhythmus',
    },
    {
      id: 2,
      type: 'lookCoverWriteCheck',
      lcwc: true,
      difficulty: 3,
      word: 'Atmosphäre',
    },
    {
      id: 3,
      type: 'lookCoverWriteCheck',
      lcwc: true,
      difficulty: 3,
      word: 'Philosophie',
    },
    {
      id: 4,
      type: 'lookCoverWriteCheck',
      lcwc: true,
      difficulty: 3,
      word: 'Portemonnaie',
    },
    {
      id: 5,
      type: 'lookCoverWriteCheck',
      lcwc: true,
      difficulty: 2,
      word: 'Katastrophe',
    },
    {
      id: 6,
      type: 'lookCoverWriteCheck',
      lcwc: true,
      difficulty: 3,
      word: 'Ingenieur',
    },
    {
      id: 7,
      type: 'lookCoverWriteCheck',
      lcwc: true,
      difficulty: 2,
      word: 'Akustik',
    },
    {
      id: 8,
      type: 'lookCoverWriteCheck',
      lcwc: true,
      difficulty: 3,
      word: 'Symmetrie',
    },
    {
      id: 9,
      type: 'lookCoverWriteCheck',
      lcwc: true,
      difficulty: 2,
      word: 'Charisma',
    },
    {
      id: 10,
      type: 'lookCoverWriteCheck',
      lcwc: true,
      difficulty: 3,
      word: 'Schizophrenie',
    },
    {
      id: 11,
      type: 'lookCoverWriteCheck',
      lcwc: true,
      difficulty: 3,
      word: 'Ressource',
    },
    {
      id: 12,
      type: 'lookCoverWriteCheck',
      lcwc: true,
      difficulty: 3,
      word: 'Ausschreibung',
    },
    {
      id: 13,
      type: 'lookCoverWriteCheck',
      lcwc: true,
      difficulty: 2,
      word: 'Bürokratie',
    },
  ],
  categorization: [
    {
      id: 1,
      type: 'categorization',
      difficulty: 1,
      instruction: 'Nomen oder Verb?',
      buckets: [
        {
          id: 'nomen',
          label: 'Nomen (Groß)',
          icon: '📦',
        },
        {
          id: 'verb',
          label: 'Verb (Klein)',
          icon: '🏃',
        },
      ],
      items: [
        {
          id: 'i1',
          word: 'Arbeit',
          bucketId: 'nomen',
        },
        {
          id: 'i2',
          word: 'arbeiten',
          bucketId: 'verb',
        },
        {
          id: 'i3',
          word: 'Spiel',
          bucketId: 'nomen',
        },
        {
          id: 'i4',
          word: 'spielen',
          bucketId: 'verb',
        },
      ],
    },
    {
      id: 2,
      type: 'categorization',
      difficulty: 2,
      instruction: 'Wörter mit IE oder EI?',
      buckets: [
        {
          id: 'ie',
          label: 'IE (wie langes i)',
          icon: '🔊',
        },
        {
          id: 'ei',
          label: 'EI (wie ai)',
          icon: '🔊',
        },
      ],
      items: [
        {
          id: 'i1',
          word: 'Brief',
          bucketId: 'ie',
        },
        {
          id: 'i2',
          word: 'klein',
          bucketId: 'ei',
        },
        {
          id: 'i3',
          word: 'Frieden',
          bucketId: 'ie',
        },
        {
          id: 'i4',
          word: 'Stein',
          bucketId: 'ei',
        },
      ],
    },
    {
      id: 3,
      type: 'categorization',
      difficulty: 2,
      instruction: 'Wörter mit SS oder ß?',
      buckets: [
        {
          id: 'ss',
          label: 'Doppel-S',
          icon: '📝',
        },
        {
          id: 'sz',
          label: 'Eszett (ß)',
          icon: '📝',
        },
      ],
      items: [
        {
          id: 'i1',
          word: 'Masse',
          bucketId: 'ss',
        },
        {
          id: 'i2',
          word: 'Maße',
          bucketId: 'sz',
        },
        {
          id: 'i3',
          word: 'Fluss',
          bucketId: 'ss',
        },
        {
          id: 'i4',
          word: 'Fuß',
          bucketId: 'sz',
        },
      ],
    },
    {
      id: 4,
      type: 'categorization',
      difficulty: 1,
      instruction: 'Männlich (der) oder Weiblich (die)?',
      buckets: [
        {
          id: 'der',
          label: 'der (männlich)',
          icon: '👨',
        },
        {
          id: 'die',
          label: 'die (weiblich)',
          icon: '👩',
        },
      ],
      items: [
        {
          id: 'i1',
          word: 'Baum',
          bucketId: 'der',
        },
        {
          id: 'i2',
          word: 'Blume',
          bucketId: 'die',
        },
        {
          id: 'i3',
          word: 'Tisch',
          bucketId: 'der',
        },
        {
          id: 'i4',
          word: 'Lampe',
          bucketId: 'die',
        },
      ],
    },
    {
      id: 5,
      type: 'categorization',
      difficulty: 2,
      instruction: 'Wirtschaft oder Medizin?',
      buckets: [
        {
          id: 'wir',
          label: 'Wirtschaft',
          icon: '💼',
        },
        {
          id: 'med',
          label: 'Medizin',
          icon: '🏥',
        },
      ],
      items: [
        {
          id: 'i1',
          word: 'Rechnung',
          bucketId: 'wir',
        },
        {
          id: 'i2',
          word: 'Rezept',
          bucketId: 'med',
        },
        {
          id: 'i3',
          word: 'Bilanz',
          bucketId: 'wir',
        },
        {
          id: 'i4',
          word: 'Diagnose',
          bucketId: 'med',
        },
      ],
    },
    {
      id: 6,
      type: 'categorization',
      difficulty: 1,
      instruction: 'Einzahl oder Mehrzahl?',
      buckets: [
        {
          id: 'sg',
          label: 'Einzahl',
          icon: '1️⃣',
        },
        {
          id: 'pl',
          label: 'Mehrzahl',
          icon: '🔢',
        },
      ],
      items: [
        {
          id: 'i1',
          word: 'Kind',
          bucketId: 'sg',
        },
        {
          id: 'i2',
          word: 'Kinder',
          bucketId: 'pl',
        },
        {
          id: 'i3',
          word: 'Buch',
          bucketId: 'sg',
        },
        {
          id: 'i4',
          word: 'Bücher',
          bucketId: 'pl',
        },
      ],
    },
    {
      id: 7,
      type: 'categorization',
      difficulty: 2,
      instruction: 'Vorsilbe oder Nachsilbe?',
      buckets: [
        {
          id: 'vor',
          label: 'Vorsilbe',
          icon: '⬅️',
        },
        {
          id: 'nach',
          label: 'Nachsilbe',
          icon: '➡️',
        },
      ],
      items: [
        {
          id: 'i1',
          word: 'ver-',
          bucketId: 'vor',
        },
        {
          id: 'i2',
          word: '-heit',
          bucketId: 'nach',
        },
        {
          id: 'i3',
          word: 'be-',
          bucketId: 'vor',
        },
        {
          id: 'i4',
          word: '-keit',
          bucketId: 'nach',
        },
      ],
    },
    {
      id: 8,
      type: 'categorization',
      difficulty: 2,
      instruction: 'V als F oder W gesprochen?',
      buckets: [
        {
          id: 'f',
          label: 'wie F',
          icon: '🗣️',
        },
        {
          id: 'w',
          label: 'wie W',
          icon: '🗣️',
        },
      ],
      items: [
        {
          id: 'i1',
          word: 'Vater',
          bucketId: 'f',
        },
        {
          id: 'i2',
          word: 'Vase',
          bucketId: 'w',
        },
        {
          id: 'i3',
          word: 'Vogel',
          bucketId: 'f',
        },
        {
          id: 'i4',
          word: 'Vampir',
          bucketId: 'w',
        },
      ],
    },
    {
      id: 9,
      type: 'categorization',
      difficulty: 1,
      instruction: 'Vergangenheit oder Zukunft?',
      buckets: [
        {
          id: 'past',
          label: 'Vergangenheit',
          icon: '⏪',
        },
        {
          id: 'fut',
          label: 'Zukunft',
          icon: '⏩',
        },
      ],
      items: [
        {
          id: 'i1',
          word: 'gestern',
          bucketId: 'past',
        },
        {
          id: 'i2',
          word: 'morgen',
          bucketId: 'fut',
        },
        {
          id: 'i3',
          word: 'früher',
          bucketId: 'past',
        },
        {
          id: 'i4',
          word: 'später',
          bucketId: 'fut',
        },
      ],
    },
    {
      id: 10,
      type: 'categorization',
      difficulty: 2,
      instruction: 'Positiv oder Negativ?',
      buckets: [
        {
          id: 'pos',
          label: 'Positiv',
          icon: '👍',
        },
        {
          id: 'neg',
          label: 'Negativ',
          icon: '👎',
        },
      ],
      items: [
        {
          id: 'i1',
          word: 'Erfolg',
          bucketId: 'pos',
        },
        {
          id: 'i2',
          word: 'Fehler',
          bucketId: 'neg',
        },
        {
          id: 'i3',
          word: 'Gewinn',
          bucketId: 'pos',
        },
        {
          id: 'i4',
          word: 'Verlust',
          bucketId: 'neg',
        },
      ],
    },
    {
      id: 11,
      type: 'categorization',
      difficulty: 1,
      instruction: 'Tiere oder Pflanzen?',
      buckets: [
        {
          id: 'tier',
          label: 'Tiere',
          icon: '🐕',
        },
        {
          id: 'pflanze',
          label: 'Pflanzen',
          icon: '🌿',
        },
      ],
      items: [
        {
          id: 'i1',
          word: 'Hund',
          bucketId: 'tier',
        },
        {
          id: 'i2',
          word: 'Baum',
          bucketId: 'pflanze',
        },
        {
          id: 'i3',
          word: 'Katze',
          bucketId: 'tier',
        },
        {
          id: 'i4',
          word: 'Blume',
          bucketId: 'pflanze',
        },
      ],
    },
    {
      id: 12,
      type: 'categorization',
      difficulty: 2,
      tags: ['business'],
      instruction: 'Abteilung zuordnen',
      buckets: [
        {
          id: 'hr',
          label: 'Personal (HR)',
          icon: '👥',
        },
        {
          id: 'it',
          label: 'IT',
          icon: '💻',
        },
      ],
      items: [
        {
          id: 'i1',
          word: 'Bewerbung',
          bucketId: 'hr',
        },
        {
          id: 'i2',
          word: 'Server',
          bucketId: 'it',
        },
        {
          id: 'i3',
          word: 'Urlaub',
          bucketId: 'hr',
        },
        {
          id: 'i4',
          word: 'Software',
          bucketId: 'it',
        },
      ],
    },
  ],
  dictation: [
    {
      id: 1,
      type: 'dictation',
      dictation: true,
      difficulty: 1,
      audioPrompt: 'Die Besprechung beginnt um zehn Uhr.',
      correct: 'Die Besprechung beginnt um zehn Uhr',
    },
    {
      id: 2,
      type: 'dictation',
      dictation: true,
      difficulty: 2,
      audioPrompt: 'Wir müssen den Vertrag unterschreiben.',
      correct: 'Wir müssen den Vertrag unterschreiben',
    },
    {
      id: 3,
      type: 'dictation',
      dictation: true,
      difficulty: 2,
      audioPrompt: 'Bitte senden Sie mir die Unterlagen.',
      correct: 'Bitte senden Sie mir die Unterlagen',
    },
    {
      id: 4,
      type: 'dictation',
      dictation: true,
      difficulty: 2,
      audioPrompt: 'Das Unternehmen wächst sehr schnell.',
      correct: 'Das Unternehmen wächst sehr schnell',
    },
    {
      id: 5,
      type: 'dictation',
      dictation: true,
      difficulty: 3,
      audioPrompt: 'Der Rhythmus der Musik ist schnell.',
      correct: 'Der Rhythmus der Musik ist schnell',
    },
    {
      id: 6,
      type: 'dictation',
      dictation: true,
      difficulty: 3,
      audioPrompt: 'Er hat seine Qualifikation bewiesen.',
      correct: 'Er hat seine Qualifikation bewiesen',
    },
    {
      id: 7,
      type: 'dictation',
      dictation: true,
      difficulty: 2,
      audioPrompt: 'Das Projekt war äußerst erfolgreich.',
      correct: 'Das Projekt war äußerst erfolgreich',
    },
    {
      id: 8,
      type: 'dictation',
      dictation: true,
      difficulty: 2,
      audioPrompt: 'Die Verantwortung liegt beim Chef.',
      correct: 'Die Verantwortung liegt beim Chef',
    },
    {
      id: 9,
      type: 'dictation',
      dictation: true,
      difficulty: 2,
      audioPrompt: 'Alle Mitarbeiter müssen teilnehmen.',
      correct: 'Alle Mitarbeiter müssen teilnehmen',
    },
    {
      id: 10,
      type: 'dictation',
      dictation: true,
      difficulty: 1,
      audioPrompt: 'Die Entwicklung ist sehr positiv.',
      correct: 'Die Entwicklung ist sehr positiv',
    },
    {
      id: 11,
      type: 'dictation',
      dictation: true,
      difficulty: 2,
      audioPrompt: 'Die Rechnung muss bis Freitag bezahlt werden.',
      correct: 'Die Rechnung muss bis Freitag bezahlt werden',
    },
    {
      id: 12,
      type: 'dictation',
      dictation: true,
      difficulty: 3,
      audioPrompt: 'Das Ergebnis der Analyse war sehr überraschend.',
      correct: 'Das Ergebnis der Analyse war sehr überraschend',
    },
    {
      id: 13,
      type: 'dictation',
      dictation: true,
      focus: 'substitution',
      difficulty: 2,
      instruction: 'Ändere den Laut und nenne das neue Wort',
      audioPrompt:
        'Ändere den ersten Laut im Wort Haus zu M. Welches Wort entsteht?',
      correct: 'Maus',
    },
    {
      id: 14,
      type: 'dictation',
      dictation: true,
      focus: 'substitution',
      difficulty: 3,
      instruction: 'Ändere den Laut und nenne das neue Wort',
      audioPrompt:
        'Ändere den letzten Laut im Wort Ball zu D. Welches Wort entsteht?',
      correct: 'Bad',
    },
    {
      id: 15,
      type: 'dictation',
      dictation: true,
      focus: 'substitution',
      difficulty: 4,
      instruction: 'Ändere den Laut und nenne das neue Wort',
      audioPrompt:
        'Ändere im Wort Hand den Vokal, sodass Hund entsteht. Sag das neue Wort.',
      correct: 'Hund',
    },
    {
      id: 16,
      type: 'dictation',
      dictation: true,
      focus: 'deletion',
      difficulty: 2,
      instruction: 'Entferne den Laut und nenne das neue Wort',
      audioPrompt:
        'Entferne den Laut R aus dem Wort Brand. Welches Wort entsteht?',
      correct: 'Band',
    },
    {
      id: 17,
      type: 'dictation',
      dictation: true,
      focus: 'deletion',
      difficulty: 3,
      instruction: 'Entferne den Laut und nenne das neue Wort',
      audioPrompt:
        'Entferne den Laut L aus dem Wort Schlaf. Welches Wort entsteht?',
      correct: 'Schaf',
    },
    {
      id: 18,
      type: 'dictation',
      dictation: true,
      focus: 'deletion',
      difficulty: 4,
      instruction: 'Entferne den Laut und nenne das neue Wort',
      audioPrompt:
        'Entferne den Laut R aus dem Wort Strand. Welches Wort entsteht?',
      correct: 'Stand',
    },
    {
      id: 19,
      type: 'dictation',
      dictation: true,
      focus: 'reversal',
      difficulty: 2,
      instruction: 'Sprich das Wort rückwärts (Laut für Laut)',
      audioPrompt: 'Sprich das Wort Bob rückwärts, Laut für Laut.',
      correct: 'Bob',
    },
    {
      id: 20,
      type: 'dictation',
      dictation: true,
      focus: 'reversal',
      difficulty: 3,
      instruction: 'Sprich das Wort rückwärts (Laut für Laut)',
      audioPrompt: 'Sprich das Wort Not rückwärts, Laut für Laut.',
      correct: 'Ton',
    },
    {
      id: 21,
      type: 'dictation',
      dictation: true,
      focus: 'reversal',
      difficulty: 4,
      instruction: 'Sprich das Wort rückwärts (Laut für Laut)',
      audioPrompt: 'Sprich das Wort Regal rückwärts, Laut für Laut.',
      correct: 'Lager',
    },
    {
      id: 22,
      type: 'dictation',
      dictation: true,
      focus: 'acrostic',
      difficulty: 2,
      instruction: 'Bilde ein Wort aus den Anfangslauten',
      audioPrompt:
        'Nimm den ersten Laut jedes Wortes: Haus, Uhr, Tisch. Welches Wort ergibt das?',
      correct: 'Hut',
    },
    {
      id: 23,
      type: 'dictation',
      dictation: true,
      focus: 'acrostic',
      difficulty: 3,
      instruction: 'Bilde ein Wort aus den Anfangslauten',
      audioPrompt:
        'Nimm den ersten Laut jedes Wortes: Rad, Ofen, Sonne, Elefant. Welches Wort ergibt das?',
      correct: 'Rose',
    },
    {
      id: 24,
      type: 'dictation',
      dictation: true,
      focus: 'acrostic',
      difficulty: 4,
      instruction: 'Bilde ein Wort aus den Anfangslauten',
      audioPrompt:
        'Nimm den ersten Laut jedes Wortes: Buch, Elefant, Regal, Uhr, Fenster. Welches Wort ergibt das?',
      correct: 'Beruf',
    },
    {
      id: 25,
      type: 'dictation',
      dictation: true,
      focus: 'counting',
      difficulty: 2,
      instruction: 'Zähle, wie oft du diesen Laut hörst',
      audioPrompt:
        'Wie oft hörst du den Laut A im Wort Banane? Nenne die Zahl.',
      correct: '2',
    },
    {
      id: 26,
      type: 'dictation',
      dictation: true,
      focus: 'counting',
      difficulty: 3,
      instruction: 'Zähle, wie oft du diesen Laut hörst',
      audioPrompt:
        'Wie oft hörst du den Laut M im Satz: Mein Onkel mag Musik? Nenne die Zahl.',
      correct: '3',
    },
    {
      id: 27,
      type: 'dictation',
      dictation: true,
      focus: 'counting',
      difficulty: 4,
      instruction: 'Zähle, wie oft du diesen Laut hörst',
      audioPrompt:
        'Wie oft hörst du den Laut F im Satz: Der Vertrag erfordert professionelle Erfahrung? Nenne die Zahl.',
      correct: '4',
    },
    {
      id: 28,
      type: 'dictation',
      dictation: true,
      focus: 'wordChain',
      difficulty: 2,
      instruction: 'Nenne ein Wort, das mit dem letzten Laut beginnt',
      audioPrompt:
        'Das Wort ist Markt. Nenne ein neues Wort, das mit dem letzten Laut von Markt beginnt.',
      correct: ['Tisch', 'Team', 'Termin', 'Thema', 'Total'],
    },
    {
      id: 29,
      type: 'dictation',
      dictation: true,
      focus: 'wordChain',
      difficulty: 3,
      instruction: 'Nenne ein Wort, das mit dem letzten Laut beginnt',
      audioPrompt:
        'Das Wort ist Plan. Nenne ein neues Wort, das mit dem letzten Laut von Plan beginnt.',
      correct: ['Netzwerk', 'Notiz', 'Nachricht', 'Name', 'Norm'],
    },
    {
      id: 30,
      type: 'dictation',
      dictation: true,
      focus: 'wordChain',
      difficulty: 4,
      instruction: 'Nenne ein Wort, das mit dem letzten Laut beginnt',
      audioPrompt:
        'Das Wort ist Prozess. Nenne ein neues Wort, das mit dem letzten Laut von Prozess beginnt.',
      correct: ['System', 'Strategie', 'Service', 'Stab', 'Sektor'],
    },
    {
      id: 31,
      type: 'dictation',
      dictation: true,
      focus: 'categoryRetrieval',
      difficulty: 2,
      instruction: 'Nenne ein passendes Wort zur Kategorie und zum Laut',
      audioPrompt: 'Nenne einen Beruf, der mit dem Laut M beginnt.',
      correct: ['Manager', 'Mechaniker', 'Musiker', 'Maler', 'Metzger'],
    },
    {
      id: 32,
      type: 'dictation',
      dictation: true,
      focus: 'categoryRetrieval',
      difficulty: 3,
      instruction: 'Nenne ein passendes Wort zur Kategorie und zum Laut',
      audioPrompt:
        'Nenne ein Gefühl oder einen Zustand, der mit dem Laut F beginnt.',
      correct: ['frustriert', 'fokussiert', 'flexibel', 'froh', 'fleißig'],
    },
    {
      id: 33,
      type: 'dictation',
      dictation: true,
      focus: 'categoryRetrieval',
      difficulty: 4,
      instruction: 'Nenne ein passendes Wort zur Kategorie und zum Laut',
      audioPrompt:
        'Nenne einen Wirtschaftsbegriff, der mit dem Laut K beginnt.',
      correct: [
        'Kunde',
        'Kapital',
        'Kosten',
        'Konkurrenz',
        'Krise',
        'Kontrakt',
      ],
    },
    {
      id: 34,
      type: 'dictation',
      dictation: true,
      focus: 'syllableCount',
      difficulty: 2,
      instruction: 'Zähle, wie viele Silben du im Wort hörst',
      audioPrompt: 'Wie viele Silben hat das Wort Projekt? Nenne die Zahl.',
      correct: '2',
    },
    {
      id: 35,
      type: 'dictation',
      dictation: true,
      focus: 'syllableCount',
      difficulty: 3,
      instruction: 'Zähle, wie viele Silben du im Wort hörst',
      audioPrompt:
        'Wie viele Silben hat das Wort Verantwortung? Nenne die Zahl.',
      correct: '4',
    },
    {
      id: 36,
      type: 'dictation',
      dictation: true,
      focus: 'syllableCount',
      difficulty: 4,
      instruction: 'Zähle, wie viele Silben du im Wort hörst',
      audioPrompt:
        'Wie viele Silben hat das Wort Unternehmensberatung? Nenne die Zahl.',
      correct: '7',
    },
    {
      id: 37,
      type: 'dictation',
      dictation: true,
      focus: 'audioSpelling',
      difficulty: 2,
      instruction: 'Höre zu und schreibe die richtige Schreibweise des Wortes',
      audioPrompt:
        'Schreibe die richtige Schreibweise des gehörten Wortes: Rechnung.',
      correct: 'Rechnung',
    },
    {
      id: 38,
      type: 'dictation',
      dictation: true,
      focus: 'audioSpelling',
      difficulty: 3,
      instruction: 'Höre zu und schreibe die richtige Schreibweise des Wortes',
      audioPrompt:
        'Schreibe die richtige Schreibweise des gehörten Wortes: Voraussetzung.',
      correct: 'Voraussetzung',
    },
    {
      id: 39,
      type: 'dictation',
      dictation: true,
      focus: 'audioSpelling',
      difficulty: 4,
      instruction: 'Höre zu und schreibe die richtige Schreibweise des Wortes',
      audioPrompt:
        'Schreibe die richtige Schreibweise des gehörten Wortes: Verhältnismäßigkeit.',
      correct: 'Verhältnismäßigkeit',
    },
  ],
  readAloud: [
    {
      id: 1,
      type: 'readAloud',
      readAloud: true,
      difficulty: 1,
      text: 'Heute ist ein sehr sonniger und warmer Tag.',
    },
    {
      id: 2,
      type: 'readAloud',
      readAloud: true,
      difficulty: 1,
      text: 'Meine kleine Katze schläft gerne auf dem Sofa im Wohnzimmer.',
    },
    {
      id: 3,
      type: 'readAloud',
      readAloud: true,
      difficulty: 2,
      text: 'Gestern Abend habe ich ein sehr interessantes Buch gelesen.',
    },
    {
      id: 4,
      type: 'readAloud',
      readAloud: true,
      difficulty: 2,
      text: 'Das Treffen mit dem neuen Kunden wurde auf morgen verschoben.',
    },
    {
      id: 5,
      type: 'readAloud',
      readAloud: true,
      difficulty: 3,
      text: 'Moderne Informationstechnologien entwickeln sich in einem unglaublichen Tempo.',
    },
    {
      id: 6,
      type: 'readAloud',
      readAloud: true,
      difficulty: 3,
      text: 'Das Engagement des gesamten Teams brachte im letzten Quartal spektakuläre Ergebnisse.',
    },
    {
      id: 7,
      type: 'readAloud',
      readAloud: true,
      difficulty: 1,
      text: 'Gleich morgens trinke ich heißen Tee mit Zitrone.',
    },
    {
      id: 8,
      type: 'readAloud',
      readAloud: true,
      difficulty: 2,
      text: 'Ein Spaziergang im Wald hilft mir, mich zu entspannen und völlig abzuschalten.',
    },
    {
      id: 9,
      type: 'readAloud',
      readAloud: true,
      difficulty: 3,
      text: 'Der Umsetzungsplan für dieses ehrgeizige Projekt muss vom Vorstand genehmigt werden.',
    },
    {
      id: 10,
      type: 'readAloud',
      readAloud: true,
      difficulty: 2,
      text: 'Jeden Tag versuche ich, neue und nützliche Fähigkeiten zu erlernen.',
    },
    {
      id: 11,
      type: 'readAloud',
      readAloud: true,
      difficulty: 3,
      text: 'Das Unternehmen verzeichnete einen beispiellosen Umsatzanstieg im Finanzdienstleistungssektor.',
    },
    {
      id: 12,
      type: 'readAloud',
      readAloud: true,
      difficulty: 1,
      text: 'Am Wochenende verbringe ich gerne Zeit mit meiner Familie.',
    },
  ],
  diagnostic: [
    {
      id: 'de_diag_1',
      type: 'diagnostic',
      pillar: 'Literacy',
      difficulty: 2,
      focus: 'Diagnostik: das oder dass',
      question: {
        de: 'Ich hoffe, ___ du kommst.',
      },
      options: [
        {
          text: 'das',
          isCorrect: false,
        },
        {
          text: 'dass',
          isCorrect: true,
        },
      ],
    },
    {
      id: 'de_diag_2',
      type: 'diagnostic',
      pillar: 'Literacy',
      difficulty: 3,
      focus: 'Diagnostik: ie oder ei',
      question: {
        de: 'Welches Wort ist richtig geschrieben?',
      },
      options: [
        {
          text: 'Brief',
          isCorrect: true,
        },
        {
          text: 'Breif',
          isCorrect: false,
        },
        {
          text: 'Brif',
          isCorrect: false,
        },
        {
          text: 'Brieff',
          isCorrect: false,
        },
      ],
    },
    {
      id: 'de_diag_3',
      type: 'diagnostic',
      pillar: 'Literacy',
      difficulty: 2,
      focus: 'Diagnostik: Großschreibung',
      question: {
        de: 'Welches Wort muss großgeschrieben werden?',
      },
      options: [
        {
          text: 'laufen',
          isCorrect: false,
        },
        {
          text: 'schnell',
          isCorrect: false,
        },
        {
          text: 'auto',
          isCorrect: true,
        },
        {
          text: 'weil',
          isCorrect: false,
        },
      ],
    },
    {
      id: 'de_diag_4',
      type: 'diagnostic',
      pillar: 'Literacy',
      difficulty: 3,
      focus: 'Diagnostik: ss oder ß',
      question: {
        de: 'Welches Wort ist richtig?',
      },
      options: [
        {
          text: 'Strasse',
          isCorrect: false,
        },
        {
          text: 'Straße',
          isCorrect: true,
        },
        {
          text: 'Strass',
          isCorrect: false,
        },
        {
          text: 'Strase',
          isCorrect: false,
        },
      ],
    },
    {
      id: 'de_diag_5',
      type: 'diagnostic',
      pillar: 'Visual',
      difficulty: 2,
      focus: 'Diagnostik: Visuelle Diskriminierung',
      question: {
        de: 'Welcher Buchstabe passt nicht in die Reihe?\n\n p p q p p',
      },
      options: [
        {
          text: 'Der erste',
          isCorrect: false,
        },
        {
          text: 'Der zweite',
          isCorrect: false,
        },
        {
          text: 'Der dritte',
          isCorrect: true,
        },
        {
          text: 'Der vierte',
          isCorrect: false,
        },
      ],
    },
    {
      id: 'de_diag_6',
      type: 'diagnostic',
      pillar: 'Visual',
      difficulty: 3,
      focus: 'Diagnostik: Zahlendreher',
      question: {
        de: 'Welche Zahlenfolge weicht von 5469 ab?',
      },
      options: [
        {
          text: '5469',
          isCorrect: false,
        },
        {
          text: '5469',
          isCorrect: false,
        },
        {
          text: '5496',
          isCorrect: true,
        },
        {
          text: '5469',
          isCorrect: false,
        },
      ],
    },
    {
      id: 'de_diag_7',
      type: 'diagnostic',
      pillar: 'Cognitive',
      difficulty: 2,
      focus: 'Diagnostik: Zeitgefühl',
      question: {
        de: 'Wenn ein Meeting um 14:00 Uhr beginnt und 90 Minuten dauert, wann endet es?',
      },
      options: [
        {
          text: '15:00 Uhr',
          isCorrect: false,
        },
        {
          text: '15:30 Uhr',
          isCorrect: true,
        },
        {
          text: '16:00 Uhr',
          isCorrect: false,
        },
        {
          text: '14:90 Uhr',
          isCorrect: false,
        },
      ],
    },
    {
      id: 'de_diag_8',
      type: 'diagnostic',
      pillar: 'Cognitive',
      difficulty: 3,
      focus: 'Diagnostik: Sequentielles Gedächtnis',
      question: {
        de: 'Welcher Monat folgt direkt auf August?',
      },
      options: [
        {
          text: 'Juli',
          isCorrect: false,
        },
        {
          text: 'Oktober',
          isCorrect: false,
        },
        {
          text: 'September',
          isCorrect: true,
        },
        {
          text: 'November',
          isCorrect: false,
        },
      ],
    },
    {
      id: 'de_diag_9',
      type: 'diagnostic',
      pillar: 'Cognitive',
      difficulty: 2,
      focus: 'Diagnostik: Kategorisierung',
      question: {
        de: 'Welches Wort gehört NICHT zu den Berufen?',
      },
      options: [
        {
          text: 'Lehrer',
          isCorrect: false,
        },
        {
          text: 'Arzt',
          isCorrect: false,
        },
        {
          text: 'Bibliothek',
          isCorrect: true,
        },
        {
          text: 'Ingenieur',
          isCorrect: false,
        },
      ],
    },
    {
      id: 'de_diag_10',
      type: 'diagnostic',
      pillar: 'Cognitive',
      difficulty: 3,
      focus: 'Diagnostik: Logisches Denken',
      question: {
        de: 'Wenn Jan größer als Peter ist, und Peter größer als Michael ist, wer ist am kleinsten?',
      },
      options: [
        {
          text: 'Jan',
          isCorrect: false,
        },
        {
          text: 'Peter',
          isCorrect: false,
        },
        {
          text: 'Michael',
          isCorrect: true,
        },
        {
          text: 'Alle sind gleich groß',
          isCorrect: false,
        },
      ],
    },
    {
      id: 'de_diag_11',
      type: 'diagnostic',
      pillar: 'Literacy',
      difficulty: 2,
      focus: 'Diagnostik: v oder f',
      question: {
        de: 'Welches Wort ist richtig geschrieben?',
      },
      options: [
        {
          text: 'Vogel',
          isCorrect: true,
        },
        {
          text: 'Fogel',
          isCorrect: false,
        },
        {
          text: 'Phogel',
          isCorrect: false,
        },
        {
          text: 'Wogel',
          isCorrect: false,
        },
      ],
    },
    {
      id: 'de_diag_12',
      type: 'diagnostic',
      pillar: 'Visual',
      difficulty: 3,
      focus: 'Diagnostik: Buchstabendreher',
      question: {
        de: 'Finde die korrekte Schreibweise:',
      },
      options: [
        {
          text: 'Maschine',
          isCorrect: true,
        },
        {
          text: 'Mashcine',
          isCorrect: false,
        },
        {
          text: 'Mascihne',
          isCorrect: false,
        },
        {
          text: 'Machsine',
          isCorrect: false,
        },
      ],
    },
    {
      id: 'de_diag_13',
      type: 'diagnostic',
      pillar: 'Cognitive',
      difficulty: 2,
      focus: 'Diagnostik: Wortgruppen',
      question: {
        de: 'Welches Wort ist KEIN Obst?',
      },
      options: [
        {
          text: 'Apfel',
          isCorrect: false,
        },
        {
          text: 'Birne',
          isCorrect: false,
        },
        {
          text: 'Karotte',
          isCorrect: true,
        },
        {
          text: 'Banane',
          isCorrect: false,
        },
      ],
    },
    {
      id: 'de_diag_14',
      type: 'diagnostic',
      pillar: 'Literacy',
      difficulty: 3,
      focus: 'Diagnostik: Synonyme',
      question: {
        de: 'Was ist ein Synonym für "schnell"?',
      },
      options: [
        {
          text: 'Langsam',
          isCorrect: false,
        },
        {
          text: 'Rasant',
          isCorrect: true,
        },
        {
          text: 'Träge',
          isCorrect: false,
        },
        {
          text: 'Ruhig',
          isCorrect: false,
        },
      ],
    },
    {
      id: 'de_diag_15',
      type: 'diagnostic',
      pillar: 'Cognitive',
      difficulty: 4,
      focus: 'Diagnostik: Logik',
      question: {
        de: 'Wenn alle Katzen Tiere sind, und alle Tiere atmen, dann...',
      },
      options: [
        {
          text: 'atmen alle Katzen',
          isCorrect: true,
        },
        {
          text: 'sind alle Tiere Katzen',
          isCorrect: false,
        },
        {
          text: 'atmen nur Katzen',
          isCorrect: false,
        },
        {
          text: 'sind einige Tiere keine Katzen',
          isCorrect: false,
        },
      ],
    },
  ],
};
