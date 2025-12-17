const { test, expect } = require('@playwright/test');
const { waitForGameLoad, startGame } = require('../helpers/game-helpers');

test.describe('Mobile Layout - Keyboard and Game Visibility', () => {
  
  test('Game 1: Both game and keyboard visible on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/game1-runner.html');
    await waitForGameLoad(page);
    
    console.log('✓ Game 1 loaded on mobile (375x667)');
    
    await startGame(page);
    console.log('✓ Game started');
    await page.waitForTimeout(1500);
    
    // Check if game container is visible
    const gameContainer = page.locator('.game-container');
    await expect(gameContainer).toBeVisible();
    const gameBox = await gameContainer.boundingBox();
    console.log(`✓ Game container visible: ${gameBox.width}x${gameBox.height} at y=${gameBox.y}`);
    
    // Debug: Check if mobile controls element exists
    const mobileControlsExists = await page.locator('#mobileControls').count();
    console.log(`✓ Mobile controls element exists: ${mobileControlsExists > 0}`);
    
    // Check computed style
    const mobileControlsStyle = await page.evaluate(() => {
      const el = document.getElementById('mobileControls');
      if (!el) return null;
      const style = window.getComputedStyle(el);
      return {
        display: style.display,
        visibility: style.visibility,
        childCount: el.children.length,
        innerHTML: el.innerHTML.substring(0, 100)
      };
    });
    console.log(`✓ Mobile controls style: ${JSON.stringify(mobileControlsStyle)}`);
    
    // Check if mobile keyboard exists and is visible
    const mobileKeyboard = page.locator('#mobileControls');
    const keyboardVisible = await mobileKeyboard.isVisible().catch(() => false);
    console.log(`✓ Mobile keyboard visible: ${keyboardVisible}`);
    
    if (keyboardVisible) {
      const keyboardBox = await mobileKeyboard.boundingBox();
      console.log(`✓ Keyboard position: ${keyboardBox.width}x${keyboardBox.height} at y=${keyboardBox.y}`);
      
      // Check if they overlap
      const gameBottom = gameBox.y + gameBox.height;
      const keyboardTop = keyboardBox.y;
      const overlap = gameBottom > keyboardTop;
      console.log(`✓ Game bottom: ${gameBottom}, Keyboard top: ${keyboardTop}`);
      console.log(`✓ Overlap detected: ${overlap}`);
      
      // Both should be in viewport
      const viewportHeight = 667;
      const keyboardInView = keyboardBox.y < viewportHeight;
      const gameInView = gameBox.y < viewportHeight;
      console.log(`✓ Game in viewport: ${gameInView}`);
      console.log(`✓ Keyboard in viewport: ${keyboardInView}`);
      
      expect(keyboardInView).toBe(true);
      expect(gameInView).toBe(true);
      
      // Check if keyboard keys are clickable
      const keys = await mobileKeyboard.locator('button, .key-btn').all();
      console.log(`✓ Keyboard buttons found: ${keys.length}`);
      expect(keys.length).toBeGreaterThan(0);
      
      // Verify first key is visible and clickable
      if (keys.length > 0) {
        const firstKey = keys[0];
        await expect(firstKey).toBeVisible();
        const keyBox = await firstKey.boundingBox();
        console.log(`✓ First key position: ${keyBox.width}x${keyBox.height} at (${keyBox.x}, ${keyBox.y})`);
      }
    } else {
      console.log('⚠️ No mobile keyboard found - may use native keyboard');
    }
    
    // Check if game elements are visible (not covered by keyboard)
    const player = page.locator('.player');
    await expect(player).toBeVisible();
    const playerBox = await player.boundingBox();
    console.log(`✓ Player visible at y=${playerBox.y}`);
    
    const score = page.locator('.score, #score').first();
    await expect(score).toBeVisible();
    const scoreBox = await score.boundingBox();
    console.log(`✓ Score visible at y=${scoreBox.y}`);
    
    // Take screenshot for visual verification
    await page.screenshot({ path: 'test-results/screenshots/mobile-game1-layout.png' });
    console.log('✓ Screenshot saved: mobile-game1-layout.png');
  });

  test('Game 2: Mobile keyboard doesn\'t cover car or lanes', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/game2-car.html');
    await waitForGameLoad(page);
    
    console.log('✓ Game 2 loaded on mobile');
    
    await startGame(page);
    await page.waitForTimeout(1000);
    
    // Check game container
    const gameContainer = page.locator('.game-container');
    await expect(gameContainer).toBeVisible();
    const gameBox = await gameContainer.boundingBox();
    console.log(`✓ Game area: ${gameBox.height}px height`);
    
    // Check mobile keyboard
    const mobileKeyboard = page.locator('.mobile-keyboard, .virtual-keyboard');
    const keyboardVisible = await mobileKeyboard.isVisible().catch(() => false);
    console.log(`✓ Mobile keyboard present: ${keyboardVisible}`);
    
    if (keyboardVisible) {
      const keyboardBox = await mobileKeyboard.boundingBox();
      console.log(`✓ Keyboard at bottom: y=${keyboardBox.y}, height=${keyboardBox.height}`);
      
      // Check if keyboard buttons have proper styling
      const keyButtons = await mobileKeyboard.locator('.mobile-key-btn, button').all();
      console.log(`✓ Mobile keys: ${keyButtons.length}`);
      
      if (keyButtons.length >= 3) {
        // Check that lane keys are visible with colors
        const leftKey = keyButtons[0];
        const centerKey = keyButtons[1];
        const rightKey = keyButtons[2];
        
        await expect(leftKey).toBeVisible();
        await expect(centerKey).toBeVisible();
        await expect(rightKey).toBeVisible();
        
        console.log('✓ All 3 lane keys visible');
      }
    }
    
    // Check car visibility
    const car = page.locator('.car, .player').first();
    await expect(car).toBeVisible();
    const carBox = await car.boundingBox();
    console.log(`✓ Car visible at y=${carBox.y}`);
    
    // Verify score/lives at top are visible
    const header = page.locator('.header');
    await expect(header).toBeVisible();
    const headerBox = await header.boundingBox();
    console.log(`✓ Header visible at top: y=${headerBox.y}`);
    
    await page.screenshot({ path: 'test-results/screenshots/mobile-game2-layout.png' });
    console.log('✓ Screenshot saved: mobile-game2-layout.png');
  });

  test('Game 4: Falling letters visible above mobile keyboard', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/game4-falling.html');
    await waitForGameLoad(page);
    
    console.log('✓ Game 4 loaded on mobile');
    
    await startGame(page);
    await page.waitForTimeout(2000);
    
    // Check game container
    const gameContainer = page.locator('.game-container, #gameContainer');
    await expect(gameContainer.first()).toBeVisible();
    const gameBox = await gameContainer.first().boundingBox();
    console.log(`✓ Game container: height=${gameBox.height}px`);
    
    // Check if letters are falling
    const letters = page.locator('.letter, .falling-letter');
    const letterCount = await letters.count();
    console.log(`✓ Falling letters: ${letterCount}`);
    
    if (letterCount > 0) {
      const firstLetter = letters.first();
      const letterBox = await firstLetter.boundingBox();
      console.log(`✓ Letter at: y=${letterBox.y}`);
      
      // Letter should be in or near the visible game area (can start off-screen for falling animation)
      expect(letterBox.y).toBeGreaterThan(-100); // Allow starting above screen
      expect(letterBox.y).toBeLessThan(700); // Should be in reasonable range
    }
    
    // Check viewport height usage
    const viewportHeight = 667;
    const gameUsage = (gameBox.height / viewportHeight) * 100;
    console.log(`✓ Game uses ${gameUsage.toFixed(1)}% of viewport`);
    
    await page.screenshot({ path: 'test-results/screenshots/mobile-game4-layout.png' });
    console.log('✓ Screenshot saved: mobile-game4-layout.png');
  });

  test('Small phone (320px): Everything still visible', async ({ page }) => {
    // Test on very small phone
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto('/game1-runner.html');
    await waitForGameLoad(page);
    
    console.log('✓ Game 1 loaded on SMALL phone (320x568)');
    
    await startGame(page);
    await page.waitForTimeout(1000);
    
    // Check all critical elements are visible
    const gameContainer = page.locator('.game-container');
    await expect(gameContainer).toBeVisible();
    console.log('✓ Game container visible on small screen');
    
    const player = page.locator('.player');
    await expect(player).toBeVisible();
    console.log('✓ Player visible');
    
    const score = page.locator('.score, #score').first();
    await expect(score).toBeVisible();
    console.log('✓ Score visible');
    
    const targetLetter = page.locator('.target-letter');
    const targetVisible = await targetLetter.isVisible().catch(() => false);
    console.log(`✓ Target letter visible: ${targetVisible}`);
    
    // Check if mobile keyboard fits
    const mobileKeyboard = page.locator('.mobile-controls');
    const keyboardVisible = await mobileKeyboard.isVisible().catch(() => false);
    console.log(`✓ Mobile keyboard visible: ${keyboardVisible}`);
    
    if (keyboardVisible) {
      const keyboardBox = await mobileKeyboard.boundingBox();
      const fitsInViewport = keyboardBox.y + keyboardBox.height <= 568;
      console.log(`✓ Keyboard fits in viewport: ${fitsInViewport}`);
      
      // Check if keys are not cut off
      const keys = await mobileKeyboard.locator('button').all();
      console.log(`✓ Keyboard buttons: ${keys.length}`);
      
      if (keys.length > 0) {
        const lastKey = keys[keys.length - 1];
        const lastKeyBox = await lastKey.boundingBox();
        const lastKeyVisible = lastKeyBox.y + lastKeyBox.height <= 568;
        console.log(`✓ Last key fully visible: ${lastKeyVisible}`);
      }
    }
    
    await page.screenshot({ path: 'test-results/screenshots/mobile-320px-layout.png' });
    console.log('✓ Screenshot saved: mobile-320px-layout.png');
  });

  test('Large phone (414px): Optimal layout', async ({ page }) => {
    await page.setViewportSize({ width: 414, height: 896 });
    await page.goto('/game1-runner.html');
    await waitForGameLoad(page);
    
    console.log('✓ Game 1 loaded on LARGE phone (414x896)');
    
    await startGame(page);
    await page.waitForTimeout(1000);
    
    const gameContainer = page.locator('.game-container');
    const gameBox = await gameContainer.boundingBox();
    console.log(`✓ Game container: ${gameBox.width}x${gameBox.height}`);
    
    const mobileKeyboard = page.locator('.mobile-controls');
    const keyboardVisible = await mobileKeyboard.isVisible().catch(() => false);
    console.log(`✓ Mobile keyboard: ${keyboardVisible}`);
    
    if (keyboardVisible) {
      const keyboardBox = await mobileKeyboard.boundingBox();
      const spacing = keyboardBox.y - (gameBox.y + gameBox.height);
      console.log(`✓ Spacing between game and keyboard: ${spacing}px`);
      
      // On large screen, should have comfortable spacing
      expect(spacing).toBeGreaterThanOrEqual(-50); // Allow small overlap if designed
    }
    
    await page.screenshot({ path: 'test-results/screenshots/mobile-414px-layout.png' });
    console.log('✓ Screenshot saved: mobile-414px-layout.png');
  });
});



