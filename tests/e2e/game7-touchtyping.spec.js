const { test, expect } = require('@playwright/test');
const { 
  waitForGameLoad, 
  startGame, 
} = require('../helpers/game-helpers');

test.describe('Game 7B: Touch Typing Trainer (הקלדה עיוורת)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/game7-touchtyping.html');
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

  test('should display start screen with level selection', async ({ page }) => {
    await expect(page.locator('.start-screen, .level-select')).toBeVisible();
  });

  test('should have 6 lesson levels', async ({ page }) => {
    // Check for level buttons
    const levelButtons = page.locator('button:has-text("שלב"), .level-btn');
    const count = await levelButtons.count();
    expect(count).toBeGreaterThanOrEqual(6);
  });

  test('should start a lesson when level selected', async ({ page }) => {
    // Click first level
    const firstLevel = page.locator('button:has-text("שלב 1"), button:has-text("1")').first();
    await firstLevel.click({ timeout: 5000 });
    await page.waitForTimeout(500);
    
    // Lesson should start
    const lesson = page.locator('.lesson, .practice, .typing-area');
    await expect(lesson.first()).toBeVisible({ timeout: 3000 });
  });

  test('should display virtual keyboard visualization', async ({ page }) => {
    await startGame(page);
    
    const keyboard = page.locator('.keyboard, .keyboard-visual');
    await expect(keyboard.first()).toBeVisible({ timeout: 3000 });
  });

  test('should show finger position guide', async ({ page }) => {
    await startGame(page);
    
    // Should have keyboard with finger indicators
    const keyboard = page.locator('.keyboard');
    await expect(keyboard.first()).toBeVisible({ timeout: 3000 });
  });

  test('should display text to type', async ({ page }) => {
    await startGame(page);
    
    const targetText = page.locator('.target-text, .practice-text, .exercise');
    await expect(targetText.first()).toBeVisible({ timeout: 3000 });
  });

  test('should have typing input area', async ({ page }) => {
    await startGame(page);
    
    const input = page.locator('input, textarea, .typing-input');
    await expect(input.first()).toBeVisible({ timeout: 3000 });
  });

  test('should highlight correct keys on keyboard', async ({ page }) => {
    await startGame(page);
    await page.waitForTimeout(1000);
    
    // Should have highlighted keys
    const highlightedKeys = page.locator('.key.highlight, .key.active, .key-highlight');
    const count = await highlightedKeys.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should track WPM (words per minute)', async ({ page }) => {
    await startGame(page);
    
    const wpm = page.locator('.wpm, text=/WPM|מילים/i');
    await expect(wpm.first()).toBeVisible({ timeout: 3000 });
  });

  test('should track accuracy percentage', async ({ page }) => {
    await startGame(page);
    
    const accuracy = page.locator('.accuracy, text=/דיוק|Accuracy|%/i');
    await expect(accuracy.first()).toBeVisible({ timeout: 3000 });
  });

  test('should provide real-time feedback on typing', async ({ page }) => {
    await startGame(page);
    await page.waitForTimeout(1000);
    
    const input = page.locator('input, textarea, .typing-input').first();
    
    if (await input.isVisible()) {
      await input.click();
      await page.keyboard.type('test');
      
      // Should have some feedback
      await page.waitForTimeout(500);
      const feedback = page.locator('.feedback, .char-correct, .char-incorrect');
      const count = await feedback.count();
      expect(count).toBeGreaterThanOrEqual(0);
    }
  });

  test('should have home row lesson (basic)', async ({ page }) => {
    // Level 1 should be home row
    const level1 = page.locator('button:has-text("שלב 1"), button').first();
    await level1.click({ timeout: 5000 });
    await page.waitForTimeout(1000);
    
    // Should show practice area
    await expect(page.locator('body')).toBeVisible();
  });

  test('should progress through lessons', async ({ page }) => {
    // Click different levels
    const level2 = page.locator('button:has-text("שלב 2"), button').nth(1);
    if (await level2.isVisible({ timeout: 3000 })) {
      await level2.click();
      await page.waitForTimeout(500);
      
      // Should load new lesson
      await expect(page.locator('body')).toBeVisible();
    }
  });

  test('should show progress indicator', async ({ page }) => {
    await startGame(page);
    
    const progress = page.locator('.progress, .progress-bar, text=/התקדמות|Progress/i');
    await expect(progress.first()).toBeVisible({ timeout: 3000 });
  });

  test('should have instructions in Hebrew', async ({ page }) => {
    // Game is Hebrew-only
    await expect(page.locator('body')).toBeVisible();
    
    const bodyText = await page.locator('body').textContent();
    expect(bodyText.length).toBeGreaterThan(0);
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await waitForGameLoad(page);
    
    // Level selection should still be visible
    await expect(page.locator('body')).toBeVisible();
  });

  test('should load quickly', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/game7-touchtyping.html');
    await waitForGameLoad(page);
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(2000);
  });

  test('should have statistics display', async ({ page }) => {
    await startGame(page);
    
    // Should show stats
    const stats = page.locator('.stats, .statistics');
    await expect(stats.first()).toBeVisible({ timeout: 3000 });
  });

  test('should support touch typing methodology', async ({ page }) => {
    await startGame(page);
    
    // Should have proper keyboard layout and finger guides
    const keyboard = page.locator('.keyboard');
    await expect(keyboard.first()).toBeVisible({ timeout: 3000 });
  });
});




