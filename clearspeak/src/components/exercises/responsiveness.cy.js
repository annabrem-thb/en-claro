describe('Dyslexia PWA - Testy Responsywności (RWD)', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
  });

  // Definiujemy urządzenia, na których chcemy przetestować aplikację
  const viewports = ['iphone-x', 'ipad-2', 'macbook-13'];

  viewports.forEach((viewport) => {
    it(`powinno poprawnie wyświetlać główny interfejs na urządzeniu: ${viewport}`, () => {
      // Zmiana rozmiaru okna przeglądarki na konkretne urządzenie
      cy.viewport(viewport);
      cy.visit('/');

      // Przechodzimy przez ekran startowy (Intro)
      cy.contains(/Tylko nauka|Study only/i).should('be.visible').click();
      cy.contains(/Rozpocznij|Start/i).click();

      // Główny kontener aplikacji musi być zawsze widoczny
      cy.get('main').should('be.visible');

      // Sprawdzamy zachowanie nawigacji w zależności od rozmiaru ekranu
      if (viewport === 'iphone-x') {
        // Na małym ekranie boczny pasek 'aside' powinien być ukryty (klasa hidden)
        cy.get('aside').should('not.be.visible');
        
        // Na małym ekranie dolna nawigacja 'nav' powinna być widoczna
        cy.get('nav').should('be.visible');
      } else {
        // Na tabletach (w poziomie) i desktopach boczny pasek powinien być widoczny
        cy.get('aside').should('be.visible');
        
        // Dolna nawigacja mobilna powinna być ukryta (np. przez brak renderowania lub klasę hidden)
        cy.get('nav').should('not.be.visible');
      }
    });
  });

  it('powinno umożliwiać nawigację między zakładkami na ekranie mobilnym', () => {
    // Symulujemy ekran mobilny
    cy.viewport('iphone-x');
    cy.visit('/');

    // Przechodzimy przez intro
    cy.contains(/Tylko nauka|Study only/i).should('be.visible').click();
    cy.contains(/Rozpocznij|Start/i).click();

    // Upewniamy się, że dolny pasek nawigacji jest widoczny na telefonie
    cy.get('nav').should('be.visible');

    // Domyślnie pierwsza zakładka (Literacy) powinna być aktywna
    cy.get('nav').find('button').eq(0).should('have.attr', 'aria-current', 'page');

    // Kliknięcie w drugą zakładkę (Visual - Wzrok i Przestrzeń) i weryfikacja
    cy.get('nav').find('button').eq(1).click();
    cy.get('nav').find('button').eq(1).should('have.attr', 'aria-current', 'page');
    cy.get('nav').find('button').eq(0).should('not.have.attr', 'aria-current');

    // Kliknięcie w trzecią zakładkę (Cognitive - Logika i Pamięć) i weryfikacja
    cy.get('nav').find('button').eq(2).click();
    cy.get('nav').find('button').eq(2).should('have.attr', 'aria-current', 'page');
  });
});