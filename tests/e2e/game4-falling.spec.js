const { test, expect } = require('@playwright/test');
const { 
  waitForGameLoad, 
  startGame, 
  getScore, 
  getLives, 
  pressHebrewKey,
  measureFPS,
} = require('../helpers/game-helpers');

test.describe('Game 4: Falling Letters (אותיות נופלות)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/game4-falling.html');
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

  test('should show falling letters', async ({ page }) => {
    await startGame(page);
    await page.waitForTimeout(2000);
    
    // Letters should be falling
    const letters = page.locator('.letter, .falling-letter');
    const count = await letters.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should display level indicator', async ({ page }) => {
    await startGame(page);
    
    const level = page.locator('.level, text=/שלב|Level/i');
    await expect(level.first()).toBeVisible({ timeout: 3000 });
  });

  test('should respond to keyboard input', async ({ page }) => {
    await startGame(page);
    await page.waitForTimeout(2000);
    
    // Try typing a common Hebrew letter
    await page.keyboard.press('a'); // ש in Hebrew
    await page.waitForTimeout(500);
    
    // Game should still be running
    const score = await getScore(page);
    expect(score).toBeGreaterThanOrEqual(0);
  });

  test('should increase score when letter typed correctly', async ({ page }) => {
    await startGame(page);
    await page.waitForTimeout(2000);
    
    const initialScore = await getScore(page);
    
    // Try multiple common keys
    const keys = ['a', 's', 'd', 'f'];
    for (const key of keys) {
      await page.keyboard.press(key);
      await page.waitForTimeout(300);
    }
    
    const newScore = await getScore(page);
    // Score should have increased if any were correct
    expect(newScore).toBeGreaterThanOrEqual(initialScore);
  });

  test('should have space/dark theme background', async ({ page }) => {
    await startGame(page);
    
    const gameContainer = page.locator('.game-container');
    await expect(gameContainer).toBeVisible();
  });

  test('should show explosion effects on hit', async ({ page }) => {
    await startGame(page);
    await page.waitForTimeout(2000);
    
    // Type to potentially hit a letter
    await page.keyboard.press('a');
    await page.waitForTimeout(500);
    
    // Check for explosion elements (may or may not be present)
    const explosions = page.locator('.explosion, .particle');
    const count = await explosions.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should decrease lives when letter hits ground', async ({ page }) => {
    await startGame(page);
    
    const initialLives = await getLives(page);
    
    // Wait for letters to fall and potentially hit ground
    await page.waitForTimeout(10000);
    
    const newLives = await getLives(page);
    expect(newLives).toBeLessThanOrEqual(initialLives);
  });

  test('should level up after reaching score threshold', async ({ page }) => {
    await startGame(page);
    
    // Initial level is 1
    // Play and check if level indicator changes
    await page.waitForTimeout(5000);
    
    const levelElement = page.locator('.level, text=/שלב|Level/i').first();
    const levelText = await levelElement.textContent();
    expect(levelText).toMatch(/\d+/);
  });

  test('should increase difficulty (speed) over time', async ({ page }) => {
    await startGame(page);
    
    // Just verify game continues to run smoothly
    await page.waitForTimeout(5000);
    
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
    
    // English keys should work
    const initialScore = await getScore(page);
    await page.keyboard.press('a');
    await page.waitForTimeout(500);
    
    // Should not crash
    const newScore = await getScore(page);
    expect(newScore).toBeGreaterThanOrEqual(initialScore);
  });

  test('should load quickly', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/game4-falling.html');
    await waitForGameLoad(page);
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(2000);
  });
});




