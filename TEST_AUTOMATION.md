# Test Automation Documentation

## Overview

This document describes the comprehensive automated testing framework for the Hebrew Typing Games project. The test suite covers all 9 games with E2E (End-to-End) browser tests and unit tests for helper functions.

## Table of Contents

- [Quick Start](#quick-start)
- [Test Architecture](#test-architecture)
- [Test Coverage](#test-coverage)
- [Running Tests](#running-tests)
- [Test Structure](#test-structure)
- [Writing New Tests](#writing-new-tests)
- [CI/CD Integration](#cicd-integration)
- [Troubleshooting](#troubleshooting)

---

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm (comes with Node.js)
- Python 3 (for local web server)

### Installation

1. **Run the setup script** (recommended):
   ```bash
   ./test-setup.sh
   ```

2. **Or install manually**:
   ```bash
   npm install
   npx playwright install
   ```

### Run All Tests

```bash
npm test
```

This will run both unit tests and E2E tests in sequence.

### View Reports

```bash
npm run test:report
```

Opens the HTML test report in your browser.

---

## Test Architecture

The testing framework uses two main tools:

### 1. Playwright (E2E Tests)
- **Purpose**: End-to-end browser testing
- **Tests**: Game functionality, UI, keyboard input, mobile responsiveness
- **Browsers**: Chrome, Firefox, Safari (WebKit)
- **Location**: `tests/e2e/`

### 2. Jest (Unit Tests)
- **Purpose**: Unit testing for helper functions
- **Tests**: Keyboard mapping, collision detection, score calculations
- **Location**: `tests/unit/`

```
┌─────────────────────────────────────────┐
│         Test Runner (npm test)          │
└────────────┬────────────────────────────┘
             │
     ┌───────┴────────┐
     │                │
┌────▼─────┐    ┌────▼─────┐
│   Jest   │    │Playwright│
│  (Unit)  │    │  (E2E)   │
└────┬─────┘    └────┬─────┘
     │                │
     │                ├─► Chrome
     │                ├─► Firefox
     │                └─► Safari
     │
     └─► Helper Functions
         - Keyboard Mapping
         - Collision Detection
         - Score Calculation
```

---

## Test Coverage

### Games Covered (9 Total)

| Game | File | E2E Tests | Unit Tests | Mobile Tests |
|------|------|-----------|------------|--------------|
| Landing Page | `index.html` | ✅ | N/A | ✅ |
| 1. Run and Jump | `game1-runner.html` | ✅ | ✅ | ✅ |
| 2. Hebrew Car | `game2-car.html` | ✅ | ✅ | ✅ |
| 3. Sentence Typing | `game3-typing.html` | ✅ | ✅ | ✅ |
| 4. Falling Letters | `game4-falling.html` | ✅ | ✅ | ✅ |
| 5. Balloon Pop | `game5-balloons.html` | ✅ | ✅ | ✅ |
| 6. Space Shooter | `game6-spaceshooter.html` | ✅ | ✅ | ✅ |
| 7A. Letter Catcher | `game7-catcher.html` | ✅ | ✅ | ✅ |
| 7B. Touch Typing | `game7-touchtyping.html` | ✅ | ✅ | ✅ |
| 8. Letter Bubbles | `game8-bubbles.html` | ✅ | ✅ | ✅ |

### Test Categories

Each game is tested for:

- **Loading**: Page loads without errors
- **UI Elements**: Start screen, buttons, score display
- **Core Mechanics**: Game logic, scoring, lives system
- **Keyboard Input**: Hebrew and English keyboard mapping
- **Mobile Responsiveness**: Virtual keyboards, touch controls
- **Localization**: Language switching (games 1-5)
- **Performance**: FPS > 30fps, load time < 2s
- **Game Over**: End conditions, results display

---

## Running Tests

### All Tests

```bash
npm test
```

Runs unit tests followed by E2E tests. Duration: ~3-5 minutes.

### E2E Tests Only

```bash
npm run test:e2e
```

Runs Playwright browser tests for all games.

### Unit Tests Only

```bash
npm run test:unit
```

Runs Jest unit tests for helper functions.

### Specific Game

```bash
npm run test:game1    # Test Game 1 (Runner)
npm run test:game2    # Test Game 2 (Car)
npm run test:game3    # Test Game 3 (Typing)
# ... etc
```

### Mobile Tests Only

```bash
npm run test:mobile
```

Runs tests tagged with `@mobile` on mobile viewports.

### Watch Mode (Unit Tests)

```bash
npm run test:unit:watch
```

Automatically re-runs tests when files change.

### Debug Mode

```bash
npm run test:e2e:debug
```

Runs Playwright tests in headed mode with debugging tools.

### View Reports

```bash
npm run test:report
```

Opens the interactive HTML test report.

---

## Test Structure

```
hebrew_game/
├── tests/
│   ├── e2e/                    # Playwright E2E tests
│   │   ├── index.spec.js       # Landing page tests
│   │   ├── game1-runner.spec.js
│   │   ├── game2-car.spec.js
│   │   ├── game3-typing.spec.js
│   │   ├── game4-falling.spec.js
│   │   ├── game5-balloons.spec.js
│   │   ├── game6-spaceshooter.spec.js
│   │   ├── game7-catcher.spec.js
│   │   ├── game7-touchtyping.spec.js
│   │   └── game8-bubbles.spec.js
│   │
│   ├── unit/                   # Jest unit tests
│   │   ├── keyboard-mapping.test.js
│   │   ├── viewport-config.test.js
│   │   ├── collision-detection.test.js
│   │   ├── score-calculation.test.js
│   │   └── setup.js            # Jest setup
│   │
│   ├── helpers/                # Test utilities
│   │   ├── game-helpers.js     # Common test functions
│   │   ├── hebrew-keyboard.js  # Keyboard mapping
│   │   └── viewport-config.js  # Device configurations
│   │
│   └── run-all-tests.js        # Test orchestration script
│
├── test-results/               # Generated test artifacts
│   ├── html-report/            # HTML test report
│   ├── screenshots/            # Failure screenshots
│   ├── videos/                 # Test execution videos
│   ├── coverage/               # Code coverage report
│   └── test-summary.json       # JSON summary
│
├── playwright.config.js        # Playwright configuration
├── jest.config.js              # Jest configuration
├── package.json                # Dependencies & scripts
└── test-setup.sh               # Setup script
```

---

## Writing New Tests

### Adding an E2E Test

Create a new spec file in `tests/e2e/`:

```javascript
const { test, expect } = require('@playwright/test');
const { 
  waitForGameLoad, 
  startGame, 
  getScore,
} = require('../helpers/game-helpers');

test.describe('My New Game', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/my-new-game.html');
    await waitForGameLoad(page);
  });

  test('should load without errors', async ({ page }) => {
    await expect(page.locator('.start-screen')).toBeVisible();
  });

  test('should start game', async ({ page }) => {
    const started = await startGame(page);
    expect(started).toBe(true);
  });

  test('should display score', async ({ page }) => {
    await startGame(page);
    const score = await getScore(page);
    expect(score).toBeGreaterThanOrEqual(0);
  });
});
```

### Adding a Unit Test

Create a new test file in `tests/unit/`:

```javascript
const { myFunction } = require('../helpers/my-helper');

describe('My Helper Function', () => {
  test('should do something', () => {
    const result = myFunction(input);
    expect(result).toBe(expected);
  });

  test('should handle edge cases', () => {
    expect(myFunction(null)).toBe(defaultValue);
  });
});
```

### Using Test Helpers

Common helpers are available in `tests/helpers/game-helpers.js`:

```javascript
// Wait for game to load
await waitForGameLoad(page);

// Start the game
await startGame(page);

// Get game state
const score = await getScore(page);
const lives = await getLives(page);
const isOver = await isGameOver(page);

// Simulate Hebrew typing
await pressHebrewKey(page, 'ש');
await typeHebrewText(page, 'שלום');

// Switch language
await switchLanguage(page, 'en');

// Measure performance
const fps = await measureFPS(page, 2000);
const memory = await getMemoryUsage(page);

// Take screenshot
await takeScreenshot(page, 'my-test-failure');
```

---

## CI/CD Integration

### GitHub Actions (Optional)

Create `.github/workflows/test.yml`:

```yaml
name: Automated Tests

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm install
    
    - name: Install Playwright browsers
      run: npx playwright install --with-deps
    
    - name: Run tests
      run: npm test
    
    - name: Upload test results
      if: always()
      uses: actions/upload-artifact@v3
      with:
        name: test-results
        path: test-results/
    
    - name: Upload test report
      if: always()
      uses: actions/upload-artifact@v3
      with:
        name: playwright-report
        path: playwright-report/
```

### Vercel Deployment Testing

Add to `vercel.json`:

```json
{
  "buildCommand": "npm install && npx playwright install",
  "devCommand": "python3 -m http.server 8080",
  "framework": null,
  "installCommand": "npm install"
}
```

---

## Troubleshooting

### Issue: Tests Won't Run

**Solution**: Install dependencies
```bash
npm install
npx playwright install
```

### Issue: "Port 8080 Already in Use"

**Solution**: Stop existing server or change port in `playwright.config.js`
```bash
# Find process on port 8080
lsof -i :8080
# Kill it
kill -9 <PID>
```

### Issue: Browser Not Found

**Solution**: Install Playwright browsers
```bash
npx playwright install
```

### Issue: Hebrew Keyboard Not Working

**Solution**: Check keyboard mapping in `tests/helpers/hebrew-keyboard.js`. The mapping converts English QWERTY keys to Hebrew letters:
- `a` → `ש`
- `s` → `ד`
- `d` → `ג`
- etc.

### Issue: Tests Timing Out

**Solution**: Increase timeout in test or config:
```javascript
test('my test', async ({ page }) => {
  test.setTimeout(60000); // 60 seconds
  // ... test code
});
```

### Issue: Mobile Tests Failing

**Solution**: Ensure virtual keyboard selectors are correct. Check for:
- `.mobile-keyboard`
- `.virtual-keyboard`
- Device viewport settings in `tests/helpers/viewport-config.js`

### Issue: Flaky Tests

**Common causes and solutions**:

1. **Race conditions**: Add proper waits
   ```javascript
   await page.waitForTimeout(1000);
   await page.waitForSelector('.element', { state: 'visible' });
   ```

2. **Animation interference**: Wait for animations
   ```javascript
   await page.waitForLoadState('networkidle');
   ```

3. **Random game elements**: Use multiple retries
   ```javascript
   await expect(async () => {
     const score = await getScore(page);
     expect(score).toBeGreaterThan(0);
   }).toPass({ timeout: 5000 });
   ```

### Issue: Can't View Test Report

**Solution**: Generate and open report
```bash
npm run test:e2e
npm run test:report
```

If that doesn't work, manually open:
```bash
open test-results/html-report/index.html
```

### Getting Help

1. **Check test output**: Error messages usually indicate the problem
2. **Review screenshots**: `test-results/screenshots/` shows failures
3. **Watch test execution**: Use `npm run test:e2e:headed` to see tests run
4. **Check documentation**: Review this file and inline code comments

---

## Performance Benchmarks

Target performance metrics for tests:

| Metric | Target | Notes |
|--------|--------|-------|
| Total test duration | < 5 minutes | All tests |
| Game load time | < 2 seconds | Per game |
| FPS during gameplay | > 30 fps | Minimum acceptable |
| Memory usage | < 100 MB | Per game page |
| Test failure rate | < 5% | Flaky tests |

---

## Best Practices

### Writing Tests

1. **Keep tests independent**: Each test should work in isolation
2. **Use descriptive names**: Test names should explain what's being tested
3. **Test one thing**: Each test should verify a single behavior
4. **Clean up**: Tests should not leave side effects
5. **Use helpers**: Reuse common functionality from `game-helpers.js`

### Test Organization

1. **Group related tests**: Use `describe()` blocks
2. **Setup in beforeEach**: Initialize common state
3. **Share test data**: Use constants for test values
4. **Tag tests**: Use `@mobile`, `@performance` tags for filtering

### Debugging

1. **Use headed mode**: See what the test sees
2. **Add screenshots**: Capture state at key points
3. **Console output**: Use `console.log()` in tests
4. **Slow down**: Add `slowMo` in Playwright config
5. **Inspector**: Use Playwright inspector for step-by-step debugging

---

## Test Maintenance

### Updating Tests

When games change, update corresponding test files:

1. Find the spec file in `tests/e2e/`
2. Update selectors if UI changed
3. Update expectations if behavior changed
4. Run specific game test to verify: `npm run test:game1`

### Adding New Games

1. Create new spec file: `tests/e2e/gameN-name.spec.js`
2. Add test script to `package.json`:
   ```json
   "test:gameN": "playwright test tests/e2e/gameN-name.spec.js"
   ```
3. Follow existing game test patterns
4. Update this documentation

### Reviewing Test Results

After each test run, review:

1. **Test summary**: Overall pass/fail status
2. **Failed tests**: Screenshots and error messages
3. **Performance**: Load times and FPS
4. **Coverage**: Ensure all features tested

---

## Additional Resources

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Hebrew Keyboard Layout](https://en.wikipedia.org/wiki/Hebrew_keyboard)
- [Project README](./README.md)
- [Manual Testing Checklist](./TESTING.md)

---

## Summary

This automated testing framework provides comprehensive coverage for all Hebrew typing games. With **E2E tests** covering user interactions and **unit tests** ensuring helper functions work correctly, you can confidently deploy and maintain the games.

**Quick commands**:
- Setup: `./test-setup.sh`
- Run all: `npm test`
- View report: `npm run test:report`
- Debug: `npm run test:e2e:debug`

Happy testing! 🧪✨




