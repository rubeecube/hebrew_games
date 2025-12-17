# Quick Start Guide - Automated Testing

## 🚀 Get Started in 3 Steps

### 1. Install Dependencies
```bash
./test-setup.sh
```

OR manually:
```bash
npm install
npx playwright install
```

### 2. Run Tests
```bash
npm test
```

### 3. View Results
```bash
npm run test:report
```

---

## 📋 Common Commands

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests (unit + E2E) |
| `npm run test:e2e` | Run E2E tests only |
| `npm run test:unit` | Run unit tests only |
| `npm run test:game1` | Test specific game (1-8) |
| `npm run test:mobile` | Run mobile tests only |
| `npm run test:report` | Open HTML report |
| `npm run test:e2e:debug` | Debug mode (headed browser) |

---

## 📊 What Gets Tested

✅ All 9 games + landing page  
✅ Loading & performance  
✅ Game mechanics & scoring  
✅ Hebrew & English keyboard input  
✅ Mobile responsiveness  
✅ Localization (language switching)  
✅ FPS & memory usage  

---

## 📁 Key Files

- **[TEST_AUTOMATION.md](TEST_AUTOMATION.md)** - Full documentation
- **package.json** - Test scripts & dependencies
- **playwright.config.js** - E2E test configuration
- **jest.config.js** - Unit test configuration
- **tests/e2e/** - Browser tests for each game
- **tests/unit/** - Unit tests for helpers
- **tests/helpers/** - Shared test utilities

---

## 🐛 Troubleshooting

**Tests won't run?**
```bash
npm install
npx playwright install
```

**Port 8080 in use?**
```bash
lsof -i :8080
kill -9 <PID>
```

**Need more help?**  
See [TEST_AUTOMATION.md](TEST_AUTOMATION.md) for detailed troubleshooting.

---

## 📈 Test Results

After running tests, find results in:

- `test-results/html-report/` - Interactive HTML report
- `test-results/screenshots/` - Failure screenshots
- `test-results/videos/` - Test execution videos
- `test-results/coverage/` - Code coverage report
- `test-results/test-summary.json` - JSON summary

---

## 🎯 Next Steps

1. **Run the tests**: `npm test`
2. **Check the report**: `npm run test:report`
3. **Fix any failures**: Review screenshots and error messages
4. **Set up CI/CD**: Add to GitHub Actions (see TEST_AUTOMATION.md)

---

For full documentation, see **[TEST_AUTOMATION.md](TEST_AUTOMATION.md)**




