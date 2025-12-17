/**
 * Common Game Testing Helpers
 * Reusable functions for testing Hebrew typing games
 */

const { getEnglishKeyForHebrew } = require('./hebrew-keyboard');

/**
 * Wait for game to be fully loaded and ready
 * @param {import('@playwright/test').Page} page - Playwright page object
 */
async function waitForGameLoad(page) {
  // Wait for body to be visible
  await page.waitForSelector('body', { state: 'visible' });
  
  // Wait for any canvas elements to be rendered
  await page.waitForTimeout(500);
  
  // Check for console errors
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  
  return { errors };
}

/**
 * Click the start/play button to begin the game
 * @param {import('@playwright/test').Page} page - Playwright page object
 */
async function startGame(page) {
  // Look for common start button patterns
  const startButtonSelectors = [
    'text=התחל',
    'text=Start',
    'text=שחק',
    'text=Play',
    'button:has-text("התחל")',
    'button:has-text("Start")',
    '.start-btn',
    '.play-btn',
    '#startBtn',
    '#playBtn'
  ];
  
  for (const selector of startButtonSelectors) {
    try {
      const button = await page.locator(selector).first();
      if (await button.isVisible({ timeout: 1000 })) {
        await button.click();
        await page.waitForTimeout(500); // Wait for game to initialize
        return true;
      }
    } catch (e) {
      continue;
    }
  }
  
  return false;
}

/**
 * Get current score from the game
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @returns {Promise<number>} Current score
 */
async function getScore(page) {
  const scoreSelectors = [
    '.score',
    '#score',
    '[data-testid="score"]',
    'text=/Score:|ניקוד:/i'
  ];
  
  for (const selector of scoreSelectors) {
    try {
      const scoreElement = await page.locator(selector).first();
      if (await scoreElement.isVisible({ timeout: 1000 })) {
        const text = await scoreElement.textContent();
        const match = text.match(/\d+/);
        return match ? parseInt(match[0]) : 0;
      }
    } catch (e) {
      continue;
    }
  }
  
  return 0;
}

/**
 * Get current lives/health from the game
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @returns {Promise<number>} Current lives
 */
async function getLives(page) {
  const livesSelectors = [
    '.lives',
    '#lives',
    '[data-testid="lives"]',
    'text=/Lives:|חיים:/i'
  ];
  
  for (const selector of livesSelectors) {
    try {
      const livesElement = await page.locator(selector).first();
      if (await livesElement.isVisible({ timeout: 1000 })) {
        const text = await livesElement.textContent();
        const match = text.match(/\d+/);
        return match ? parseInt(match[0]) : 3;
      }
    } catch (e) {
      continue;
    }
  }
  
  return 3; // Default
}

/**
 * Check if game over screen is visible
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @returns {Promise<boolean>} True if game over
 */
async function isGameOver(page) {
  const gameOverSelectors = [
    'text=Game Over',
    'text=המשחק נגמר',
    '.game-over',
    '#gameOver',
    'text=/משחק נגמר|game over/i'
  ];
  
  for (const selector of gameOverSelectors) {
    try {
      const element = await page.locator(selector).first();
      if (await element.isVisible({ timeout: 1000 })) {
        return true;
      }
    } catch (e) {
      continue;
    }
  }
  
  return false;
}

/**
 * Press a Hebrew key by finding its English equivalent
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} hebrewLetter - Hebrew letter to type
 */
async function pressHebrewKey(page, hebrewLetter) {
  const englishKey = getEnglishKeyForHebrew(hebrewLetter);
  await page.keyboard.press(englishKey);
  await page.waitForTimeout(100); // Small delay for game to process
}

/**
 * Type a Hebrew word/sentence using English keyboard
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} hebrewText - Hebrew text to type
 */
async function typeHebrewText(page, hebrewText) {
  for (const char of hebrewText) {
    await pressHebrewKey(page, char);
  }
}

/**
 * Switch language in games that support localization
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} language - Language code (he, en, fr)
 */
async function switchLanguage(page, language) {
  const langButton = page.locator(`.lang-btn[data-lang="${language}"]`);
  if (await langButton.isVisible({ timeout: 1000 })) {
    await langButton.click();
    await page.waitForTimeout(300);
    return true;
  }
  return false;
}

/**
 * Check if mobile virtual keyboard is visible
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @returns {Promise<boolean>} True if virtual keyboard is visible
 */
async function hasMobileKeyboard(page) {
  const keyboardSelectors = [
    '.mobile-keyboard',
    '.virtual-keyboard',
    '#mobileKeyboard',
    '.keyboard-container'
  ];
  
  for (const selector of keyboardSelectors) {
    try {
      const keyboard = await page.locator(selector).first();
      if (await keyboard.isVisible({ timeout: 1000 })) {
        return true;
      }
    } catch (e) {
      continue;
    }
  }
  
  return false;
}

/**
 * Measure FPS over a period of time
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {number} duration - Duration in milliseconds
 * @returns {Promise<number>} Average FPS
 */
async function measureFPS(page, duration = 2000) {
  const fps = await page.evaluate((duration) => {
    return new Promise((resolve) => {
      let frameCount = 0;
      let lastTime = performance.now();
      
      function countFrame() {
        frameCount++;
        const elapsed = performance.now() - lastTime;
        
        if (elapsed < duration) {
          requestAnimationFrame(countFrame);
        } else {
          const fps = (frameCount / elapsed) * 1000;
          resolve(fps);
        }
      }
      
      requestAnimationFrame(countFrame);
    });
  }, duration);
  
  return fps;
}

/**
 * Get memory usage of the page
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @returns {Promise<number>} Memory usage in MB
 */
async function getMemoryUsage(page) {
  const metrics = await page.evaluate(() => {
    if (performance.memory) {
      return {
        usedJSHeapSize: performance.memory.usedJSHeapSize,
        totalJSHeapSize: performance.memory.totalJSHeapSize,
      };
    }
    return null;
  });
  
  if (metrics) {
    return metrics.usedJSHeapSize / (1024 * 1024); // Convert to MB
  }
  
  return 0;
}

/**
 * Take a screenshot with a descriptive name
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} name - Screenshot name
 */
async function takeScreenshot(page, name) {
  await page.screenshot({ 
    path: `test-results/screenshots/${name}.png`,
    fullPage: true 
  });
}

/**
 * Wait for element with retry
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} selector - CSS selector
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<boolean>} True if found
 */
async function waitForElement(page, selector, timeout = 5000) {
  try {
    await page.waitForSelector(selector, { timeout, state: 'visible' });
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Check if page has RTL direction
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @returns {Promise<boolean>} True if RTL
 */
async function isRTL(page) {
  const dir = await page.evaluate(() => {
    return document.documentElement.getAttribute('dir') || 
           document.body.getAttribute('dir');
  });
  return dir === 'rtl';
}

/**
 * Get all console messages during test
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @returns {Promise<Array>} Array of console messages
 */
async function captureConsoleLogs(page) {
  const logs = [];
  
  page.on('console', msg => {
    logs.push({
      type: msg.type(),
      text: msg.text(),
      location: msg.location(),
    });
  });
  
  return logs;
}

module.exports = {
  waitForGameLoad,
  startGame,
  getScore,
  getLives,
  isGameOver,
  pressHebrewKey,
  typeHebrewText,
  switchLanguage,
  hasMobileKeyboard,
  measureFPS,
  getMemoryUsage,
  takeScreenshot,
  waitForElement,
  isRTL,
  captureConsoleLogs,
};




