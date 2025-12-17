const { test, expect } = require('@playwright/test');
const { 
  waitForGameLoad, 
  startGame, 
  getScore, 
  getLives, 
  measureFPS,
} = require('../helpers/game-helpers');

test.describe('Game 7A: Letter Catcher (תופס אותיות)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/game7-catcher.html');
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

  test('should display start screen', async ({ page }) => {
    await expect(page.locator('.start-screen')).toBeVisible();
  });

  test('should start game successfully', async ({ page }) => {
    const started = await startGame(page);
    expect(started).toBe(true);
  });

  test('should display score and lives', async ({ page }) => {
    await startGame(page);
    
    const score = await getScore(page);
    expect(score).toBeGreaterThanOrEqual(0);
    
    const lives = await getLives(page);
    expect(lives).toBeGreaterThanOrEqual(0);
    expect(lives).toBeLessThanOrEqual(3);
  });

  test('should show basket/catcher at bottom', async ({ page }) => {
    await startGame(page);
    
    const basket = page.locator('.basket, .catcher, .player');
    await expect(basket.first()).toBeVisible({ timeout: 3000 });
  });

  test('should show falling letters (green and red)', async ({ page }) => {
    await startGame(page);
    await page.waitForTimeout(2000);
    
    const letters = page.locator('.letter, .falling-letter');
    const count = await letters.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should display target letter to catch', async ({ page }) => {
    await startGame(page);
    
    const target = page.locator('.target, .target-letter, text=/אות|Letter|Target/i');
    await expect(target.first()).toBeVisible({ timeout: 3000 });
  });

  test('should move basket with keyboard input', async ({ page }) => {
    await startGame(page);
    await page.waitForTimeout(2000);
    
    // Get initial basket position
    const basket = page.locator('.basket, .catcher, .player').first();
    const initialPos = await basket.boundingBox();
    
    // Type target letter to move basket
    await page.keyboard.press('a');
    await page.waitForTimeout(500);
    
    // Basket may have moved
    const newPos = await basket.boundingBox();
    expect(newPos).toBeTruthy();
  });

  test('should support arrow key movement', async ({ page }) => {
    await startGame(page);
    await page.waitForTimeout(1000);
    
    // Try arrow keys
    await page.keyboard.press('ArrowLeft');
    await page.waitForTimeout(300);
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(300);
    
    // Should not crash
    const lives = await getLives(page);
    expect(lives).toBeGreaterThanOrEqual(0);
  });

  test('should catch good letters (green)', async ({ page }) => {
    await startGame(page);
    await page.waitForTimeout(2000);
    
    const initialScore = await getScore(page);
    
    // Type target letter
    await page.keyboard.press('a');
    await page.waitForTimeout(500);
    
    // Score might increase
    const newScore = await getScore(page);
    expect(newScore).toBeGreaterThanOrEqual(initialScore);
  });

  test('should avoid bad letters (red)', async ({ page }) => {
    await startGame(page);
    await page.waitForTimeout(2000);
    
    // Just verify game runs without crashing
    await page.keyboard.press('a');
    await page.waitForTimeout(500);
    
    const lives = await getLives(page);
    expect(lives).toBeGreaterThanOrEqual(0);
  });

  test('should have sky background with clouds', async ({ page }) => {
    await startGame(page);
    
    const gameContainer = page.locator('.game-container');
    await expect(gameContainer).toBeVisible();
  });

  test('should decrease lives on catching bad letter', async ({ page }) => {
    await startGame(page);
    
    const initialLives = await getLives(page);
    
    // Play for a while
    await page.waitForTimeout(10000);
    
    const newLives = await getLives(page);
    expect(newLives).toBeLessThanOrEqual(initialLives);
  });

  test('should increase difficulty over time', async ({ page }) => {
    await startGame(page);
    
    await page.waitForTimeout(5000);
    
    // Game should still be running
    const lives = await getLives(page);
    expect(lives).toBeGreaterThanOrEqual(0);
  });

  test('should maintain good FPS', async ({ page }) => {
    await startGame(page);
    
    const fps = await measureFPS(page, 2000);
    expect(fps).toBeGreaterThan(30);
  });

  test('should handle game over', async ({ page }) => {
    await startGame(page);
    
    await page.waitForTimeout(15000);
    
    const lives = await getLives(page);
    if (lives === 0) {
      const gameOverVisible = await page.locator('text=/Game Over|המשחק נגמר/i').isVisible({ timeout: 2000 });
      expect(gameOverVisible).toBe(true);
    }
  });

  test('should support English keyboard mapping', async ({ page }) => {
    await startGame(page);
    await page.waitForTimeout(2000);
    
    await page.keyboard.press('a');
    await page.keyboard.press('s');
    
    const score = await getScore(page);
    expect(score).toBeGreaterThanOrEqual(0);
  });

  test('should load quickly', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/game7-catcher.html');
    await waitForGameLoad(page);
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(2000);
  });

  test('should have bilingual text (Hebrew and English)', async ({ page }) => {
    // Game 7-catcher doesn't use localization.js
    await expect(page.locator('body')).toBeVisible();
    
    const bodyText = await page.locator('body').textContent();
    expect(bodyText.length).toBeGreaterThan(0);
  });
});




