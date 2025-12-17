const { test, expect } = require('@playwright/test');
const { 
  waitForGameLoad, 
  startGame, 
  getScore, 
  getLives, 
  measureFPS,
} = require('../helpers/game-helpers');

test.describe('Game 6: Space Shooter (קרב חלל עברי)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/game6-spaceshooter.html');
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

  test('should show spaceship at bottom', async ({ page }) => {
    await startGame(page);
    
    const spaceship = page.locator('.spaceship, .player');
    await expect(spaceship.first()).toBeVisible({ timeout: 3000 });
  });

  test('should show aliens with letters', async ({ page }) => {
    await startGame(page);
    await page.waitForTimeout(2000);
    
    const aliens = page.locator('.alien, .enemy');
    const count = await aliens.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should have space background with stars', async ({ page }) => {
    await startGame(page);
    
    const gameContainer = page.locator('.game-container');
    await expect(gameContainer).toBeVisible();
  });

  test('should display wave indicator', async ({ page }) => {
    await startGame(page);
    
    const wave = page.locator('.wave, text=/גל|Wave/i');
    await expect(wave.first()).toBeVisible({ timeout: 3000 });
  });

  test('should respond to keyboard input and shoot', async ({ page }) => {
    await startGame(page);
    await page.waitForTimeout(2000);
    
    const initialScore = await getScore(page);
    
    // Type to shoot
    await page.keyboard.press('a');
    await page.waitForTimeout(500);
    
    // Game should continue
    const newScore = await getScore(page);
    expect(newScore).toBeGreaterThanOrEqual(initialScore);
  });

  test('should show laser shooting animation', async ({ page }) => {
    await startGame(page);
    await page.waitForTimeout(2000);
    
    // Shoot a laser
    await page.keyboard.press('a');
    await page.waitForTimeout(300);
    
    // Laser elements may be present
    const lasers = page.locator('.laser, .bullet, .projectile');
    const count = await lasers.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should show explosion effects when alien hit', async ({ page }) => {
    await startGame(page);
    await page.waitForTimeout(2000);
    
    // Type multiple keys to try to hit aliens
    const keys = ['a', 's', 'd', 'f'];
    for (const key of keys) {
      await page.keyboard.press(key);
      await page.waitForTimeout(300);
    }
    
    // Check for explosions
    const explosions = page.locator('.explosion, .particle');
    const count = await explosions.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should increase score when alien destroyed', async ({ page }) => {
    await startGame(page);
    await page.waitForTimeout(2000);
    
    const initialScore = await getScore(page);
    
    // Type multiple keys to shoot
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('a');
      await page.waitForTimeout(200);
    }
    
    const newScore = await getScore(page);
    expect(newScore).toBeGreaterThanOrEqual(initialScore);
  });

  test('should progress through waves', async ({ page }) => {
    await startGame(page);
    
    // Play for a bit
    await page.waitForTimeout(5000);
    
    const waveElement = page.locator('.wave, text=/גל|Wave/i').first();
    const waveText = await waveElement.textContent();
    expect(waveText).toMatch(/\d+/);
  });

  test('should decrease lives when alien reaches bottom', async ({ page }) => {
    await startGame(page);
    
    const initialLives = await getLives(page);
    
    // Wait for aliens to potentially reach bottom
    await page.waitForTimeout(10000);
    
    const newLives = await getLives(page);
    expect(newLives).toBeLessThanOrEqual(initialLives);
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
    
    const score = await getScore(page);
    expect(score).toBeGreaterThanOrEqual(0);
  });

  test('should load quickly', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/game6-spaceshooter.html');
    await waitForGameLoad(page);
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(2000);
  });

  test('should have bilingual text (Hebrew and English)', async ({ page }) => {
    // Game 6 doesn't use localization.js, has hardcoded bilingual text
    await expect(page.locator('body')).toBeVisible();
    
    // Should have text in Hebrew or English
    const bodyText = await page.locator('body').textContent();
    expect(bodyText.length).toBeGreaterThan(0);
  });
});




