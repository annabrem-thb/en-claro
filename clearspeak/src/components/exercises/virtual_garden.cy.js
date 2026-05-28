describe('Dyslexia PWA - Wirtualny Ogród', () => {
  beforeEach(() => {
    // Czyszczenie stanu przed każdym testem, aby zacząć od ekranu powitalnego
    cy.clearLocalStorage();
  });

  it('ładuje aplikację, przechodzi do ogrodu i weryfikuje jego stan startowy', () => {
    // 1. Otwarcie aplikacji
    cy.visit('/');

    // 2. Przejście przez ekran powitalny
    // Tym razem wybieramy tryb grywalizacji (Game / Gra / Gamified)
    cy.contains(/Gra|Game|Gamified/i).click();
    cy.contains(/Rozpocznij|Start/i).click();

    // 3. Weryfikacja głównego widoku
    cy.get('aside').should('be.visible');

    // 4. Przejście do Wirtualnego Ogrodu
    // Szukamy przycisku nawigacji kierującego do Ogrodu
    cy.get('nav').contains(/Ogród|Garden/i).click();

    // 5. Weryfikacja widoku ogrodu
    // Upewniamy się, że kontener ogrodu się załadował
    cy.get('#garden-container').should('be.visible');

    // Weryfikacja początkowej nazwy ewolucji rośliny (Dla motywu "Natur" jest to Ziarenko / Seed)
    cy.contains(/Ziarenko|Seed/i).should('be.visible');

    // Weryfikacja komunikatu o pustym ogrodzie / początkowym stanie
    cy.contains(/Twój własny ekosystem|Your own ecosystem/i).should('be.visible');

    // Weryfikacja czy ładuje się kalendarz postępów
    // W VirtualGarden.jsx kalendarz jest oznaczony napisem "Cel dzienny" / "Daily goal"
    cy.contains(/Cel dzienny|Daily goal/i).should('be.visible');
  });
});