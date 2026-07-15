describe('Dyslexia PWA - Wirtualny Ogród', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
  });

  it('ładuje aplikację, przechodzi do ogrodu i weryfikuje jego stan startowy', () => {

    cy.visit('/');

    cy.contains(/Gra|Game|Gamified/i).click();
    cy.contains(/Rozpocznij|Start/i).click();

    cy.get('aside').should('be.visible');

    cy.get('nav').contains(/Ogród|Garden/i).click();

    cy.get('#garden-container').should('be.visible');
    cy.contains(/Ziarenko|Seed/i).should('be.visible');

    cy.contains(/Twój własny ekosystem|Your own ecosystem/i).should('be.visible');

    cy.contains(/Cel dzienny|Daily goal/i).should('be.visible');
  });
});