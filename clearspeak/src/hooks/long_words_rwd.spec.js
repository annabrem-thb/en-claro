import { test, expect } from '@playwright/test';

test.describe('Dyslexia PWA - Ekstremalne Testy RWD (Długie Słowa)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.localStorage.clear());
  });

  test('powinno łamać długie niemieckie słowa w ustawieniach i zapobiegać poziomemu scrollowi', async ({ page, isMobile }) => {
    // Ten test ma największy sens na symulowanych smartfonach (np. iPhone X)
    test.skip(!isMobile, 'Ten test RWD jest przeznaczony dla wąskich ekranów mobilnych');

    await page.goto('/');
    
    // 1. Zmiana języka na niemiecki (DE) na ekranie startowym
    await page.locator('button[lang="de"]').click();
    await page.locator('text=/Nur lernen/i').click();
    await page.locator('text=/Start/i').click();

    // 2. Otwarcie modala ustawień
    await page.locator('nav button[aria-label="Einstellungen"]').click();

    // 3. Przejście do zakładki Głos (Stimme)
    await page.locator('button[role="tab"] >> text="Stimme"').click();

    // 4. Weryfikacja obecności długiego słowa
    await expect(page.locator('text=Sprechgeschwindigkeit')).toBeVisible();

    // 5. KLUCZOWA ASERCJA RWD: Sprawdzamy czy dokument "wylał się" poza ekran
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });

    // Oczekujemy, że szerokość dokumentu NIE przekracza szerokości ekranu
    expect(hasHorizontalScroll).toBe(false);
  });

  test('powinno zapobiegać awarii layoutu przy wstrzyknięciu sztucznego, 63-znakowego słowa', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Ten test RWD jest przeznaczony dla wąskich ekranów mobilnych');

    await page.goto('/');
    await page.locator('text=/Tylko nauka|Study only/i').click();
    await page.locator('text=/Rozpocznij|Start/i').click();
    await expect(page.locator('main')).toBeVisible();

    // Wstrzykujemy absurdalnie długie słowo bezpośrednio do DOM-u za pomocą page.evaluate
    await page.evaluate(() => {
      const mainArea = document.querySelector('main');
      const badWordElement = document.createElement('div');
      badWordElement.textContent = 'Rindfleischetikettierungsüberwachungsaufgabenübertragungsgesetz';
      // Dodajemy klasy odpowiedzialne w Twojej aplikacji za wymuszone łamanie wyrazów
      badWordElement.className = 'text-3xl font-black break-words hyphens-auto w-full';
      mainArea.appendChild(badWordElement);
    });

    // Weryfikujemy stabilność responsywności
    const hasHorizontalScroll = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    expect(hasHorizontalScroll).toBe(false);
  });
});