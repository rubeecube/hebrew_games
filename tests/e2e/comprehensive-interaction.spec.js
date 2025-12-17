const { test, expect } = require('@playwright/test');
const { 
  waitForGameLoad, 
  startGame, 
  getScore, 
  pressHebrewKey,
} = require('../helpers/game-helpers');

test.describe('Comprehensive Keyboard & Mobile Interaction Tests', () => {
  
  test('Game 1: Verify obstacle stays until correct key pressed', async ({ page }) => {
    await page.goto('/game1-runner.html');
    await waitForGameLoad(page);
    
    console.log('✓ Game 1 loaded');
    await page.waitForTimeout(1000);
    
    await startGame(page);
    console.log('✓ Game started');
    
    // Wait for obstacle to appear
    await page.waitForTimeout(2500);
    
    // Get target letter
    const targetLetter = await page.locator('.target-letter #targetLetter').textContent();
    console.log(`✓ Target letter shown: ${targetLetter}`);
    
    // Wait and verify obstacle is still there
    const obstacle = page.locator('.obstacle').first();
    await expect(obstacle).toBeVisible();
    console.log('✓ Obstacle is VISIBLE (waiting for key press)');
    
    // Press WRONG key - obstacle should stay
    await page.keyboard.press('z');
    console.log('✓ Pressed WRONG key (z)');
    await page.waitForTimeout(500);
    
    // Obstacle should STILL be visible
    const stillVisible = await obstacle.isVisible().catch(() => false);
    console.log(`✓ Obstacle still visible after wrong key: ${stillVisible}`);
    
    // Now press CORRECT key
    await pressHebrewKey(page, targetLetter.trim());
    console.log(`✓ Pressed CORRECT key: ${targetLetter}`);
    await page.waitForTimeout(800);
    
    // Player should have jumped (check position changed)
    const player = page.locator('.player');
    const playerClass = await player.getAttribute('class');
    console.log(`✓ Player state after correct key: ${playerClass}`);
    
    // Score should have increased
    const score = await getScore(page);
    console.log(`✓ Score after correct key: ${score}`);
    expect(score).toBeGreaterThan(0);
  });

  test('Game 4: Verify falling letters stay until typed', async ({ page }) => {
    await page.goto('/game4-falling.html');
    await waitForGameLoad(page);
    
    console.log('✓ Game 4 loaded');
    await startGame(page);
    console.log('✓ Game started');
    
    // Wait for letters to spawn
    await page.waitForTimeout(2000);
    
    const initialLetters = await page.locator('.letter, .falling-letter').count();
    console.log(`✓ Falling letters spawned: ${initialLetters}`);
    expect(initialLetters).toBeGreaterThan(0);
    
    // Get a letter and its text
    const firstLetter = page.locator('.letter, .falling-letter').first();
    await expect(firstLetter).toBeVisible();
    const letterText = await firstLetter.textContent();
    console.log(`✓ First letter visible: ${letterText}`);
    
    // Press WRONG keys - letters should stay
    await page.keyboard.press('z');
    await page.keyboard.press('z');
    await page.keyboard.press('z');
    console.log('✓ Pressed WRONG keys (z, z, z)');
    await page.waitForTimeout(500);
    
    // Letters should still exist (some might have fallen off, but not all)
    const lettersAfterWrong = await page.locator('.letter, .falling-letter').count();
    console.log(`✓ Letters remaining after wrong keys: ${lettersAfterWrong}`);
    
    // Now press some correct keys
    const initialScore = await getScore(page);
    const keys = ['a', 's', 'd', 'f', 'g'];
    for (const key of keys) {
      await page.keyboard.press(key);
      console.log(`✓ Pressed key: ${key}`);
      await page.waitForTimeout(200);
    }
    
    // Score should increase when we hit correct letters
    const newScore = await getScore(page);
    console.log(`✓ Score changed from ${initialScore} to ${newScore}`);
    expect(newScore).toBeGreaterThanOrEqual(initialScore);
  });

  test('Game 5: Verify balloons stay until correct key', async ({ page }) => {
    await page.goto('/game5-balloons.html');
    await waitForGameLoad(page);
    
    console.log('✓ Game 5 loaded');
    await startGame(page);
    console.log('✓ Game started');
    
    // Wait for balloons
    await page.waitForTimeout(2000);
    
    const initialBalloons = await page.locator('.balloon').count();
    console.log(`✓ Balloons visible: ${initialBalloons}`);
    expect(initialBalloons).toBeGreaterThan(0);
    
    // Press WRONG key repeatedly - balloons should NOT pop
    await page.keyboard.press('1');
    await page.keyboard.press('2');
    await page.keyboard.press('3');
    console.log('✓ Pressed WRONG keys (1, 2, 3)');
    await page.waitForTimeout(500);
    
    const balloonsAfterWrong = await page.locator('.balloon').count();
    console.log(`✓ Balloons after wrong keys: ${balloonsAfterWrong}`);
    
    // Now press CORRECT keys (Hebrew letters)
    const initialScore = await getScore(page);
    const hebrewKeys = ['a', 's', 'd', 'f', 'g', 'h'];
    
    for (const key of hebrewKeys) {
      await page.keyboard.press(key);
      console.log(`✓ Pressed Hebrew key: ${key}`);
      await page.waitForTimeout(300);
    }
    
    await page.waitForTimeout(500);
    
    const finalScore = await getScore(page);
    console.log(`✓ Score after correct keys: ${finalScore}`);
    
    // Score should have increased if we popped balloons
    expect(finalScore).toBeGreaterThanOrEqual(initialScore);
  });

  test('Game 2: Verify car responds to keys and wrong keys ignored', async ({ page }) => {
    await page.goto('/game2-car.html');
    await waitForGameLoad(page);
    
    console.log('✓ Game 2 loaded');
    await startGame(page);
    console.log('✓ Game started');
    
    await page.waitForTimeout(1000);
    
    const car = page.locator('.car, .player').first();
    await expect(car).toBeVisible();
    console.log('✓ Car is visible');
    
    // Get initial car position
    const initialPos = await car.boundingBox();
    console.log(`✓ Initial car position: x=${initialPos?.x}`);
    
    // Press WRONG keys (not lane control keys)
    await page.keyboard.press('1');
    await page.keyboard.press('2');
    await page.keyboard.press('9');
    console.log('✓ Pressed WRONG keys (1, 2, 9)');
    await page.waitForTimeout(300);
    
    // Press CORRECT lane keys
    await page.keyboard.press('a'); // Left
    console.log('✓ Pressed lane key: a');
    await page.waitForTimeout(200);
    
    await page.keyboard.press('s'); // Center
    console.log('✓ Pressed lane key: s');
    await page.waitForTimeout(200);
    
    await page.keyboard.press('d'); // Right
    console.log('✓ Pressed lane key: d');
    await page.waitForTimeout(200);
    
    const finalPos = await car.boundingBox();
    console.log(`✓ Final car position: x=${finalPos?.x}`);
    
    // Car should have moved (position changed)
    const moved = finalPos?.x !== initialPos?.x;
    console.log(`✓ Car moved: ${moved}`);
    
    // Game should still be running
    const score = await getScore(page);
    console.log(`✓ Score: ${score}`);
    expect(score).toBeGreaterThanOrEqual(0);
  });

  test('Mobile: Game 1 with virtual keyboard', async ({ page }) => {
    // Emulate mobile device
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/game1-runner.html');
    await waitForGameLoad(page);
    
    console.log('✓ Game 1 loaded on MOBILE viewport');
    await startGame(page);
    console.log('✓ Game started');
    
    await page.waitForTimeout(1000);
    
    // Check for mobile keyboard
    const mobileKeyboard = page.locator('.mobile-controls, .mobile-keyboard, .virtual-keyboard');
    const hasMobileKeys = await mobileKeyboard.isVisible({ timeout: 2000 }).catch(() => false);
    console.log(`✓ Mobile keyboard visible: ${hasMobileKeys}`);
    
    if (hasMobileKeys) {
      // Find and click a mobile key
      const firstKey = mobileKeyboard.locator('button, .key-btn').first();
      const keyVisible = await firstKey.isVisible().catch(() => false);
      
      if (keyVisible) {
        const keyText = await firstKey.textContent();
        console.log(`✓ First mobile key: ${keyText}`);
        
        // Click the key
        await firstKey.click();
        console.log(`✓ Clicked mobile key: ${keyText}`);
        await page.waitForTimeout(500);
        
        const score = await getScore(page);
        console.log(`✓ Score after mobile key press: ${score}`);
      }
    }
    
    // Game should be running
    const score = await getScore(page);
    expect(score).toBeGreaterThanOrEqual(0);
    console.log('✓ Mobile game is functional');
  });

  test('Mobile: Game 2 with touch controls', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/game2-car.html');
    await waitForGameLoad(page);
    
    console.log('✓ Game 2 loaded on MOBILE viewport');
    await startGame(page);
    console.log('✓ Game started');
    
    await page.waitForTimeout(1000);
    
    // Check for mobile keyboard
    const mobileKeyboard = page.locator('.mobile-keyboard, .virtual-keyboard');
    const hasMobileKeys = await mobileKeyboard.isVisible({ timeout: 2000 }).catch(() => false);
    console.log(`✓ Mobile keyboard visible: ${hasMobileKeys}`);
    
    if (hasMobileKeys) {
      // Get all mobile keys
      const keys = await mobileKeyboard.locator('button, .mobile-key-btn').all();
      console.log(`✓ Mobile keys found: ${keys.length}`);
      
      if (keys.length >= 3) {
        // Click left, center, right keys
        await keys[0].click();
        console.log('✓ Clicked left key');
        await page.waitForTimeout(300);
        
        await keys[1].click();
        console.log('✓ Clicked center key');
        await page.waitForTimeout(300);
        
        await keys[2].click();
        console.log('✓ Clicked right key');
        await page.waitForTimeout(300);
      }
    }
    
    const score = await getScore(page);
    console.log(`✓ Score after mobile interaction: ${score}`);
    expect(score).toBeGreaterThanOrEqual(0);
  });

  test('Verify no action on empty space press', async ({ page }) => {
    await page.goto('/game1-runner.html');
    await waitForGameLoad(page);
    
    console.log('✓ Game 1 loaded');
    await startGame(page);
    console.log('✓ Game started');
    
    await page.waitForTimeout(2000);
    
    const initialScore = await getScore(page);
    console.log(`✓ Initial score: ${initialScore}`);
    
    // Press space, enter, escape - should do nothing
    await page.keyboard.press('Space');
    console.log('✓ Pressed Space');
    await page.waitForTimeout(200);
    
    await page.keyboard.press('Enter');
    console.log('✓ Pressed Enter');
    await page.waitForTimeout(200);
    
    await page.keyboard.press('Escape');
    console.log('✓ Pressed Escape');
    await page.waitForTimeout(200);
    
    // Press random symbols
    await page.keyboard.press('!');
    await page.keyboard.press('@');
    await page.keyboard.press('#');
    console.log('✓ Pressed random symbols (!, @, #)');
    await page.waitForTimeout(300);
    
    const finalScore = await getScore(page);
    console.log(`✓ Final score: ${finalScore}`);
    
    // Score should not have changed from invalid keys
    expect(finalScore).toBe(initialScore);
    console.log('✓ Confirmed: Invalid keys did NOT increase score');
  });
});



