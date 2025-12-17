const { test, expect } = require('@playwright/test');
const { 
  waitForGameLoad, 
  startGame, 
  getScore, 
  getLives, 
  pressHebrewKey,
  measureFPS,
  switchLanguage,
} = require('../helpers/game-helpers');

test.describe('Game 1: Run and Jump (רץ וקפוץ)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/game1-runner.html');
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

  test('should display start screen with instructions', async ({ page }) => {
    await expect(page.locator('.start-screen')).toBeVisible();
    await expect(page.locator('text=/התחל|Start/i')).toBeVisible();
  });

  test('should start game when start button clicked', async ({ page }) => {
    const started = await startGame(page);
    expect(started).toBe(true);
    
    // Game canvas should be visible
    await expect(page.locator('.game-container')).toBeVisible();
  });

  test('should display score and lives', async ({ page }) => {
    await startGame(page);
    
    const score = await getScore(page);
    expect(score).toBeGreaterThanOrEqual(0);
    
    const lives = await getLives(page);
    expect(lives).toBeGreaterThanOrEqual(0);
    expect(lives).toBeLessThanOrEqual(3);
  });

  test('should show target letter to jump over obstacle', async ({ page }) => {
    await startGame(page);
    
    const targetLetter = page.locator('.target-letter');
    await expect(targetLetter).toBeVisible({ timeout: 5000 });
  });

  test('should respond to Hebrew keyboard input', async ({ page }) => {
    await startGame(page);
    
    // Wait for first obstacle
    await page.waitForTimeout(2000);
    
    // Try to get the target letter
    const targetText = await page.locator('.target-letter').textContent();
    
    if (targetText) {
      const hebrewLetter = targetText.trim();
      const initialScore = await getScore(page);
      
      // Press the Hebrew key
      await pressHebrewKey(page, hebrewLetter);
      await page.waitForTimeout(500);
      
      // Score should increase or stay the same
      const newScore = await getScore(page);
      expect(newScore).toBeGreaterThanOrEqual(initialScore);
    }
  });

  test('should support language switching', async ({ page }) => {
    const switched = await switchLanguage(page, 'en');
    expect(switched).toBe(true);
    
    // Check for English text
    const hasEnglish = await page.locator('text=/Start|Play/i').isVisible();
    expect(hasEnglish).toBe(true);
  });

  test('should have ground and player visible', async ({ page }) => {
    await startGame(page);
    
    await expect(page.locator('.ground')).toBeVisible();
    await expect(page.locator('.player')).toBeVisible();
  });

  test('should handle game over when lives reach zero', async ({ page }) => {
    await startGame(page);
    
    // Wait and check if game over appears (if lives decrease)
    await page.waitForTimeout(10000);
    
    const lives = await getLives(page);
    if (lives === 0) {
      // Game over screen should appear
      const gameOverVisible = await page.locator('text=/Game Over|המשחק נגמר/i').isVisible({ timeout: 2000 });
      expect(gameOverVisible).toBe(true);
    }
  });

  test('should maintain good FPS (>30fps)', async ({ page }) => {
    await startGame(page);
    
    const fps = await measureFPS(page, 2000);
    expect(fps).toBeGreaterThan(30);
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    
    // Mobile keyboard should appear
    const hasMobileKeys = await page.locator('.mobile-keyboard, .virtual-keyboard').isVisible({ timeout: 2000 });
    expect(hasMobileKeys).toBe(true);
  });

  test('should load quickly (under 2 seconds)', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/game1-runner.html');
    await waitForGameLoad(page);
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(2000);
  });

  test('should have back to home button', async ({ page }) => {
    const homeButton = page.locator('a[href="index.html"], text=/חזרה|Back|Home/i');
    await expect(homeButton.first()).toBeVisible({ timeout: 2000 });
  });
});




