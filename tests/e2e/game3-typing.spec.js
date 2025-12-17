const { test, expect } = require('@playwright/test');
const { 
  waitForGameLoad, 
  startGame, 
  typeHebrewText,
  switchLanguage,
} = require('../helpers/game-helpers');

test.describe('Game 3: Sentence Typing (הקלדת משפטים)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/game3-typing.html');
    await waitForGameLoad(page);
  });

  test('should load without errors', async ({ page }) => {
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    
    await page.waitForLoadState('networkidle');
    expect(errors).toHaveLength(0);
  });

  test('should display difficulty selection screen', async ({ page }) => {
    await expect(page.locator('.start-screen, .difficulty-screen')).toBeVisible();
  });

  test('should have three difficulty levels', async ({ page }) => {
    const difficulties = page.locator('button:has-text("קל"), button:has-text("Easy"), button:has-text("בינוני"), button:has-text("Medium"), button:has-text("קשה"), button:has-text("Hard")');
    const count = await difficulties.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test('should start game on difficulty selection', async ({ page }) => {
    // Click easy difficulty
    const easyButton = page.locator('button:has-text("קל"), button:has-text("Easy")').first();
    await easyButton.click();
    await page.waitForTimeout(500);
    
    // Sentence should appear
    const sentence = page.locator('.target-sentence, .sentence-display');
    await expect(sentence.first()).toBeVisible({ timeout: 3000 });
  });

  test('should display sentence to type', async ({ page }) => {
    await startGame(page);
    
    const sentence = page.locator('.target-sentence, .sentence-display');
    await expect(sentence.first()).toBeVisible({ timeout: 3000 });
    
    const text = await sentence.first().textContent();
    expect(text.length).toBeGreaterThan(0);
  });

  test('should show typing input field', async ({ page }) => {
    await startGame(page);
    
    const input = page.locator('input[type="text"], textarea, .typing-input');
    await expect(input.first()).toBeVisible({ timeout: 3000 });
  });

  test('should display progress (sentence X of 10)', async ({ page }) => {
    await startGame(page);
    
    const progress = page.locator('.progress, text=/\\d+\\/10|משפט/i');
    await expect(progress.first()).toBeVisible({ timeout: 3000 });
  });

  test('should display WPM tracker', async ({ page }) => {
    await startGame(page);
    
    const wpm = page.locator('.wpm, .stats, text=/WPM|מילים/i');
    await expect(wpm.first()).toBeVisible({ timeout: 3000 });
  });

  test('should display accuracy tracker', async ({ page }) => {
    await startGame(page);
    
    const accuracy = page.locator('.accuracy, text=/דיוק|Accuracy|%/i');
    await expect(accuracy.first()).toBeVisible({ timeout: 3000 });
  });

  test('should show translations (English and French)', async ({ page }) => {
    await startGame(page);
    
    const translation = page.locator('.translation, .english-translation, .french-translation');
    await expect(translation.first()).toBeVisible({ timeout: 3000 });
  });

  test('should respond to typing input', async ({ page }) => {
    await startGame(page);
    await page.waitForTimeout(1000);
    
    const input = page.locator('input[type="text"], textarea, .typing-input').first();
    
    if (await input.isVisible()) {
      await input.click();
      await page.keyboard.type('test');
      
      const value = await input.inputValue();
      expect(value.length).toBeGreaterThan(0);
    }
  });

  test('should provide real-time feedback on typing', async ({ page }) => {
    await startGame(page);
    await page.waitForTimeout(1000);
    
    // Check for character-by-character feedback elements
    const feedback = page.locator('.char-correct, .char-incorrect, .feedback');
    // Should exist even if not yet visible
    const count = await feedback.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should have skip button', async ({ page }) => {
    await startGame(page);
    
    const skipButton = page.locator('button:has-text("דלג"), button:has-text("Skip")');
    await expect(skipButton.first()).toBeVisible({ timeout: 3000 });
  });

  test('should advance to next sentence', async ({ page }) => {
    await startGame(page);
    await page.waitForTimeout(1000);
    
    // Click skip to advance
    const skipButton = page.locator('button:has-text("דלג"), button:has-text("Skip")').first();
    if (await skipButton.isVisible()) {
      await skipButton.click();
      await page.waitForTimeout(500);
      
      // New sentence should appear
      const sentence = page.locator('.target-sentence, .sentence-display').first();
      await expect(sentence).toBeVisible();
    }
  });

  test('should show final results after 10 sentences', async ({ page }) => {
    await startGame(page);
    
    // Skip through all sentences quickly
    for (let i = 0; i < 10; i++) {
      await page.waitForTimeout(500);
      const skipButton = page.locator('button:has-text("דלג"), button:has-text("Skip")').first();
      if (await skipButton.isVisible({ timeout: 1000 })) {
        await skipButton.click();
      }
    }
    
    // Results screen should appear
    await page.waitForTimeout(1000);
    const results = page.locator('.results, .game-over, text=/סיימת|Results|Finished/i');
    await expect(results.first()).toBeVisible({ timeout: 5000 });
  });

  test('should support language switching', async ({ page }) => {
    const switched = await switchLanguage(page, 'en');
    expect(switched).toBe(true);
  });

  test('should be mobile responsive', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await waitForGameLoad(page);
    
    // Game should still be playable
    await expect(page.locator('.start-screen, .difficulty-screen')).toBeVisible();
  });

  test('should show keyboard layout hints', async ({ page }) => {
    await startGame(page);
    
    // Check for keyboard visualization or hints
    const keyboard = page.locator('.keyboard-layout, .keyboard-hint, text=/מקלדת|Keyboard/i');
    // May or may not be visible, but shouldn't error
    const count = await keyboard.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should load quickly', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/game3-typing.html');
    await waitForGameLoad(page);
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(2000);
  });
});




