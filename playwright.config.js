import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests-playwright',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    // The production build (served in CI) registers the PWA service worker,
    // which handles fetches itself so page.route() never sees them — e.g. the
    // intercepted survey POST. Tests don't exercise offline behaviour.
    serviceWorkers: 'block',
  },
  // Definiujemy projekty dla różnych urządzeń. 
  // Playwright uruchomi testy dla każdego z nich osobno.
  projects: [
    { name: 'Desktop Chrome', use: { ...devices['Desktop Chrome'] } },
    { name: 'Desktop Firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'Tablet (iPad)', use: { ...devices['iPad (gen 7)'] } },
    { name: 'Mobile (iPhone X)', use: { ...devices['iPhone X'] } },
  ],
  webServer: {
    // CI serves the production build (faster, no on-demand compilation);
    // locally the dev server is kept for hot reload.
    command: process.env.CI
      ? 'npm run build && npx vite preview --port 5173 --strictPort'
      : 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});