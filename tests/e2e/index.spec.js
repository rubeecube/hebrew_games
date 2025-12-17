const { test, expect } = require('@playwright/test');
const { switchLanguage, isRTL } = require('../helpers/game-helpers');

test.describe('Landing Page (index.html)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
  });

  test('should load without errors', async ({ page }) => {
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    
    await page.waitForLoadState('networkidle');
    expect(errors).toHaveLength(0);
  });

  test('should display main title and subtitle', async ({ page }) => {
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('.subtitle')).toBeVisible();
  });

  test('should display all 9 game cards', async ({ page }) => {
    const gameCards = page.locator('.game-card');
    await expect(gameCards).toHaveCount(9);
  });

  test('should have language selector visible', async ({ page }) => {
    await expect(page.locator('.lang-selector')).toBeVisible();
    await expect(page.locator('.lang-btn[data-lang="he"]')).toBeVisible();
    await expect(page.locator('.lang-btn[data-lang="en"]')).toBeVisible();
    await expect(page.locator('.lang-btn[data-lang="fr"]')).toBeVisible();
  });

  test('should switch language to English', async ({ page }) => {
    const success = await switchLanguage(page, 'en');
    expect(success).toBe(true);
    
    // Check that English title is visible
    const title = await page.locator('h1').textContent();
    expect(title).toContain('Hebrew Typing Games');
  });

  test('should switch language to French', async ({ page }) => {
    const success = await switchLanguage(page, 'fr');
    expect(success).toBe(true);
    
    // Check that French title is visible
    const title = await page.locator('h1').textContent();
    expect(title).toContain('Jeux de frappe hébraïque');
  });

  test('should be in RTL mode by default (Hebrew)', async ({ page }) => {
    const rtl = await isRTL(page);
    expect(rtl).toBe(true);
  });

  test('should have working links to all games', async ({ page }) => {
    const gameLinks = [
      'game1-runner.html',
      'game2-car.html',
      'game3-typing.html',
      'game4-falling.html',
      'game5-balloons.html',
      'game6-spaceshooter.html',
      'game7-catcher.html',
      'game7-touchtyping.html',
      'game8-bubbles.html',
    ];

    for (const link of gameLinks) {
      const gameCard = page.locator(`a[href="${link}"]`);
      await expect(gameCard).toBeVisible();
    }
  });

  test('should display game icons and descriptions', async ({ page }) => {
    const firstCard = page.locator('.game-card').first();
    await expect(firstCard.locator('.game-icon')).toBeVisible();
    await expect(firstCard.locator('.game-title')).toBeVisible();
    await expect(firstCard.locator('.game-description')).toBeVisible();
  });

  test('should display difficulty indicators', async ({ page }) => {
    const firstCard = page.locator('.game-card').first();
    const difficultyDots = firstCard.locator('.difficulty-dot');
    await expect(difficultyDots).toHaveCount(3);
  });

  test('should be responsive on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('.lang-selector')).toBeVisible();
    await expect(page.locator('.games-grid')).toBeVisible();
  });

  test('should load localization.js script', async ({ page }) => {
    const scriptLoaded = await page.evaluate(() => {
      return typeof setLanguage === 'function';
    });
    expect(scriptLoaded).toBe(true);
  });
});




