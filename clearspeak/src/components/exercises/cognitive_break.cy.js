describe('Dyslexia PWA - Przerwy Kognitywne', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
  });
  it('powinno wyświetlić powiadomienie "Czas na przerwę?" po wystąpieniu zmęczenia (serii błędów)', () => {
    cy.visit('/');
    cy.contains(/Tylko nauka|Study only/i)
      .should('be.visible')
      .click();
    cy.contains(/Rozpocznij|Start/i).click();
    cy.get('[role="status"]').should('be.visible');
    for (let i = 0; i < 5; i++) {
      cy.get('main').within(() => {
        cy.get('button')
          .not(':contains("🎤")')
          .not(':contains("🛑")')
          .eq(0)
          .click({ force: true });
      });
      cy.wait(2e3);
    }
    cy.contains(/Czas na przerwę\?|Time for a break\?/i).should('be.visible');
    cy.contains(/Odpoczywam|Rest/i)
      .should('be.visible')
      .click();
  });
});
