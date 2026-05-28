describe('Dyslexia PWA - Pierwsze uruchomienie i ćwiczenie', () => {
  beforeEach(() => {
    // Czyszczenie stanu przed każdym testem (Local Storage),
    // aby zawsze zaczynać od IntroScreen.
    cy.clearLocalStorage();
  });

  it('ładuje aplikację, przechodzi przez ekran powitalny i próbuje rozwiązać pierwsze ćwiczenie', () => {
    // 1. Otwarcie aplikacji
    cy.visit('/');

    // 2. Weryfikacja ekranu powitalnego (IntroScreen)
    // Szukamy głównego tytułu (BionicText może renderować go z tagami <b>, 
    // więc sprawdzamy, czy kontener zawiera odpowiedni tekst)
    cy.contains(/EnClaro/i).should('be.visible');
    
    // Wybór trybu "Tylko nauka" (aby uprościć i przyspieszyć test)
    cy.contains(/Tylko nauka|Learning Only/i).click();
    
    // Weryfikacja aktywacji przycisku i kliknięcie "Rozpocznij"
    cy.contains(/Rozpocznij|Start/i).click();

    // 3. Weryfikacja załadowania głównego widoku aplikacji
    // Sprawdzamy, czy pasek boczny oraz obszar ćwiczeń wyrenderowały się poprawnie
    cy.get('aside').should('be.visible');
    cy.get('section').should('be.visible');

    // Upewniamy się, że wczytały się dane z bazy, czyli brak komunikatu o błędzie formatu
    cy.contains(/Brak zadań|No data/i).should('not.exist');
    cy.contains(/Błąd formatu|Format not recognized/i).should('not.exist');

    // 4. Interakcja z pierwszym ćwiczeniem
    // Ponieważ nie wiemy z góry, na jakie ćwiczenie z puli trafimy (losowanie z seedem),
    // ograniczamy interakcję do głównego kontenera opcji.
    cy.get('section').within(() => {
      // Wyszukujemy wszystkie interaktywne przyciski odpowiedzi
      // (pomijamy te z ikonami sterowania głosem, jak mikrofon 🎤 czy 🛑)
      cy.get('button')
        .not(':contains("🎤")')
        .not(':contains("🛑")')
        .not(':contains("🔊")')
        .last() // Zazwyczaj opcje wyboru są na samym końcu kontenera
        .click({ force: true });
    });

    // 5. Weryfikacja stabilności
    // Niezależnie od tego, czy trafiliśmy w prawidłową, czy złą odpowiedź, aplikacja nie może się zawiesić.
    cy.get('body').should('not.contain', 'Wystąpił błąd.');
  });
});