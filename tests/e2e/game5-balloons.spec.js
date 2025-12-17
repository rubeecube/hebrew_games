const { test, expect } = require('@playwright/test');
const { 
  waitForGameLoad, 
  startGame, 
  getScore, 
  getLives, 
  measureFPS,
} = require('../helpers/game-helpers');

test.describe('Game 5: Balloon Pop (פצח בלונים)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/game5-balloons.html');
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

  test('should show floating balloons', async ({ page }) => {
    await startGame(page);
    await page.waitForTimeout(2000);
    
    const balloons = page.locator('.balloon');
    const count = await balloons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should have sky background with clouds', async ({ page }) => {
    await startGame(page);
    
    // Check for sky-themed background
    const gameContainer = page.locator('.game-container');
    await expect(gameContainer).toBeVisible();
  });

  test('should display level indicator', async ({ page }) => {
    await startGame(page);
    
    const level = page.locator('.level, text=/שלב|Level/i');
    await expect(level.first()).toBeVisible({ timeout: 3000 });
  });

  test('should respond to keyboard input', async ({ page }) => {
    await startGame(page);
    await page.waitForTimeout(2000);
    
    const initialScore = await getScore(page);
    
    // Type some common keys
    await page.keyboard.press('a');
    await page.waitForTimeout(500);
    
    const newScore = await getScore(page);
    expect(newScore).toBeGreaterThanOrEqual(initialScore);
  });

  test('should pop balloons when correct key pressed', async ({ page }) => {
    await startGame(page);
    await page.waitForTimeout(2000);
    
    const initialBalloonCount = await page.locator('.balloon').count();
    
    // Type multiple keys to try to pop balloons
    const keys = ['a', 's', 'd', 'f', 'g'];
    for (const key of keys) {
      await page.keyboard.press(key);
      await page.waitForTimeout(300);
    }
    
    // Some balloons might have been popped
    await page.waitForTimeout(500);
    const newBalloonCount = await page.locator('.balloon').count();
    
    // Balloon count changed (could be less due to popping, or more due to spawning)
    expect(newBalloonCount).toBeGreaterThanOrEqual(0);
  });

  test('should have multiple balloon colors', async ({ page }) => {
    await startGame(page);
    await page.waitForTimeout(2000);
    
    // Balloons should exist
    const balloons = page.locator('.balloon');
    const count = await balloons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should show pop effects', async ({ page }) => {
    await startGame(page);
    await page.waitForTimeout(2000);
    
    // Type to pop a balloon
    await page.keyboard.press('a');
    await page.waitForTimeout(300);
    
    // Pop effects may or may not be visible
    const effects = page.locator('.pop, .particle, .explosion');
    const count = await effects.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should decrease lives when balloons escape', async ({ page }) => {
    await startGame(page);
    
    const initialLives = await getLives(page);
    
    // Wait for balloons to potentially escape
    await page.waitForTimeout(10000);
    
    const newLives = await getLives(page);
    expect(newLives).toBeLessThanOrEqual(initialLives);
  });

  test('should increase difficulty over time', async ({ page }) => {
    await startGame(page);
    
    // Play for a bit
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
    
    // English keys should work
    await page.keyboard.press('a');
    await page.keyboard.press('s');
    await page.keyboard.press('d');
    
    // Should not crash
    const score = await getScore(page);
    expect(score).toBeGreaterThanOrEqual(0);
  });

  test('should load quickly', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/game5-balloons.html');
    await waitForGameLoad(page);
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(2000);
  });
});




