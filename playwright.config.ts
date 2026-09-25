/**
 * Browser acceptance-test configuration.
 * @remarks The Angular development server is started automatically for each test run.
 * @author Marlon Packard Viza Quispe
 */
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests',
  workers: 2,
  reporter: 'list',
  use: { baseURL: 'http://127.0.0.1:4200', screenshot: 'only-on-failure' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm start -- --host 127.0.0.1',
    url: 'http://127.0.0.1:4200',
    reuseExistingServer: !process.env['CI'],
    timeout: 90000,
  },
});
