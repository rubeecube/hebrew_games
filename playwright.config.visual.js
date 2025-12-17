const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests/e2e',
  timeout: 60000,
  use: {
    baseURL: 'http://localhost:8080',
    trace: 'on', // Always record trace
    video: 'on', // Always record video
    screenshot: 'on',
    headless: true, // Must be headless on WSL2
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'python3 -m http.server 8080',
    url: 'http://localhost:8080',
    reuseExistingServer: true,
    timeout: 120000,
  },
});



