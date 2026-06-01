describe('Dyslexia PWA - Przerwy Kognitywne', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
  });

  it('powinno wyświetlić powiadomienie "Czas na przerwę?" po wystąpieniu zmęczenia (serii błędów)', () => {
    cy.visit('/');

    // 1. Przechodzimy przez ekran powitalny
    cy.contains(/Tylko nauka|Study only/i).should('be.visible').click();
    cy.contains(/Rozpocznij|Start/i).click();

    // 2. Upewniamy się, że pasek energii poznawczej jest widoczny w UI
    cy.get('[role="status"]').should('be.visible');

    // 3. Symulujemy serię błędów, aby wywołać modal (zakładamy 4-5 prób)
    // Skrypt klika w pierwszy interaktywny przycisk na ekranie ćwiczenia
    for (let i = 0; i < 5; i++) {
      cy.get('main').within(() => {
        // Szukamy przycisków opcji, pomijając przyciski sterowania głosem (TTS/Mikrofon)
        cy.get('button').not(':contains("🎤")').not(':contains("🛑")').eq(0).click({ force: true });
      });
      
      // Czekamy na przetworzenie błędu i odblokowanie interfejsu (uwzględniając czas timeoutów z useSafeTimeouts)
      cy.wait(2000); 
    }

    // 4. Weryfikujemy, czy po zmęczeniu poznawczym modal na pewno się pojawił
    cy.contains(/Czas na przerwę\?|Time for a break\?/i).should('be.visible');
    
    // 5. Sprawdzamy, czy użytkownik może kliknąć "Odpoczywam", aby zamknąć powiadomienie
    cy.contains(/Odpoczywam|Rest/i).should('be.visible').click();
  });
});