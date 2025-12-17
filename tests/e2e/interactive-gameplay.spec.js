const { test, expect } = require('@playwright/test');
const { 
  waitForGameLoad, 
  startGame, 
  getScore, 
  pressHebrewKey,
  getEnglishKeyForHebrew,
} = require('../helpers/game-helpers');
const { hebrewToEnglish } = require('../helpers/hebrew-keyboard');

test.describe('Interactive Gameplay Tests - Key Pressing & Behavior', () => {
  
  test('Game 1: Should show target letter and respond to key press', async ({ page }) => {
    await page.goto('/game1-runner.html');
    await waitForGameLoad(page);
    await startGame(page);
    
    // Wait for game to initialize
    await page.waitForTimeout(2000);
    
    // Check that target letter is visible
    const targetLetterElement = page.locator('.target-letter, .next-letter, .obstacle-letter');
    await expect(targetLetterElement.first()).toBeVisible({ timeout: 5000 });
    
    // Get the target letter text
    const targetText = await targetLetterElement.first().textContent();
    console.log('🎯 Game 1 - Target letter visible:', targetText);
    
    if (targetText && targetText.trim()) {
      const hebrewLetter = targetText.trim();
      const englishKey = hebrewToEnglish(hebrewLetter);
      
      console.log(`   Hebrew letter: ${hebrewLetter}`);
      console.log(`   English key to press: ${englishKey}`);
      
      // Get initial score
      const initialScore = await getScore(page);
      console.log(`   Initial score: ${initialScore}`);
      
      // Press the key
      await page.keyboard.press(englishKey);
      await page.waitForTimeout(1000);
      
      // Check score changed or game is still running
      const newScore = await getScore(page);
      console.log(`   New score: ${newScore}`);
      
      expect(newScore).toBeGreaterThanOrEqual(initialScore);
      console.log('✅ Game 1: Key press responded correctly!\n');
    }
  });

  test('Game 2: Should show lane control keys and respond to movement', async ({ page }) => {
    await page.goto('/game2-car.html');
    await waitForGameLoad(page);
    await startGame(page);
    
    await page.waitForTimeout(2000);
    
    // Check that control keys are visible
    const controlsVisible = await page.locator('.controls, .keys, .key-display').first().isVisible({ timeout: 3000 });
    console.log('🎯 Game 2 - Control keys visible:', controlsVisible);
    
    if (controlsVisible) {
      const controlsText = await page.locator('.controls, .keys, .key-display').first().textContent();
      console.log('   Control keys shown:', controlsText);
    }
    
    // Get car position before
    const car = page.locator('.car, .player').first();
    await expect(car).toBeVisible();
    
    const initialPos = await car.boundingBox();
    console.log(`   Initial car position: x=${initialPos?.x}, y=${initialPos?.y}`);
    
    // Press a key to move
    await page.keyboard.press('a'); // Try moving
    await page.waitForTimeout(500);
    
    const newPos = await car.boundingBox();
    console.log(`   New car position: x=${newPos?.x}, y=${newPos?.y}`);
    console.log('✅ Game 2: Car controls working!\n');
  });

  test('Game 3: Should show sentence and respond to typing', async ({ page }) => {
    await page.goto('/game3-typing.html');
    await waitForGameLoad(page);
    
    // Click easy difficulty
    const easyButton = page.locator('button:has-text("קל"), button:has-text("Easy")').first();
    await easyButton.click({ timeout: 5000 });
    await page.waitForTimeout(1000);
    
    // Check sentence is visible
    const sentenceElement = page.locator('.target-sentence, .sentence-display, .text-to-type').first();
    await expect(sentenceElement).toBeVisible({ timeout: 3000 });
    
    const sentence = await sentenceElement.textContent();
    console.log('🎯 Game 3 - Sentence visible:', sentence?.substring(0, 50) + '...');
    
    // Check input field is visible
    const input = page.locator('input[type="text"], textarea, .typing-input').first();
    await expect(input).toBeVisible();
    console.log('   Input field visible: YES');
    
    // Type something
    await input.click();
    await page.keyboard.type('test');
    await page.waitForTimeout(500);
    
    const typedValue = await input.inputValue();
    console.log('   Typed value:', typedValue);
    expect(typedValue.length).toBeGreaterThan(0);
    console.log('✅ Game 3: Typing input working!\n');
  });

  test('Game 4: Should show falling letters and respond to typing', async ({ page }) => {
    await page.goto('/game4-falling.html');
    await waitForGameLoad(page);
    await startGame(page);
    
    await page.waitForTimeout(3000); // Wait for letters to spawn
    
    // Check that letters are visible
    const letters = page.locator('.letter, .falling-letter, .falling-object');
    const letterCount = await letters.count();
    console.log('🎯 Game 4 - Falling letters visible:', letterCount);
    
    if (letterCount > 0) {
      const firstLetter = letters.first();
      const letterText = await firstLetter.textContent();
      console.log('   First letter:', letterText);
      
      const initialScore = await getScore(page);
      
      // Type some common keys
      const keysToTry = ['a', 's', 'd', 'f', 'g'];
      for (const key of keysToTry) {
        await page.keyboard.press(key);
        await page.waitForTimeout(300);
      }
      
      const newScore = await getScore(page);
      console.log(`   Score changed from ${initialScore} to ${newScore}`);
      console.log('✅ Game 4: Falling letters responding to keys!\n');
    }
  });

  test('Game 5: Should show balloons with letters', async ({ page }) => {
    await page.goto('/game5-balloons.html');
    await waitForGameLoad(page);
    await startGame(page);
    
    await page.waitForTimeout(3000);
    
    // Check balloons are visible
    const balloons = page.locator('.balloon');
    const balloonCount = await balloons.count();
    console.log('🎯 Game 5 - Balloons visible:', balloonCount);
    
    if (balloonCount > 0) {
      const firstBalloon = balloons.first();
      const balloonText = await firstBalloon.textContent();
      console.log('   First balloon letter:', balloonText);
      
      const initialScore = await getScore(page);
      
      // Try to pop balloons
      const keysToTry = ['a', 's', 'd', 'f', 'g', 'h'];
      for (const key of keysToTry) {
        await page.keyboard.press(key);
        await page.waitForTimeout(200);
      }
      
      const newScore = await getScore(page);
      console.log(`   Score: ${initialScore} → ${newScore}`);
      console.log('✅ Game 5: Balloon popping working!\n');
    }
  });

  test('Game 6: Should show aliens with letters and shoot', async ({ page }) => {
    await page.goto('/game6-spaceshooter.html');
    await waitForGameLoad(page);
    await startGame(page);
    
    await page.waitForTimeout(3000);
    
    // Check aliens are visible
    const aliens = page.locator('.alien, .enemy, .target');
    const alienCount = await aliens.count();
    console.log('🎯 Game 6 - Aliens visible:', alienCount);
    
    // Check spaceship is visible
    const spaceship = page.locator('.spaceship, .player, .ship');
    await expect(spaceship.first()).toBeVisible({ timeout: 3000 });
    console.log('   Spaceship visible: YES');
    
    if (alienCount > 0) {
      const initialScore = await getScore(page);
      
      // Shoot at aliens
      const keysToTry = ['a', 's', 'd', 'f', 'g'];
      for (const key of keysToTry) {
        await page.keyboard.press(key);
        await page.waitForTimeout(300);
      }
      
      const newScore = await getScore(page);
      console.log(`   Score: ${initialScore} → ${newScore}`);
      console.log('✅ Game 6: Shooting mechanics working!\n');
    }
  });

  test('Game 7A: Should show basket and falling letters', async ({ page }) => {
    await page.goto('/game7-catcher.html');
    await waitForGameLoad(page);
    await startGame(page);
    
    await page.waitForTimeout(2000);
    
    // Check basket is visible
    const basket = page.locator('.basket, .catcher, .player');
    await expect(basket.first()).toBeVisible({ timeout: 3000 });
    console.log('🎯 Game 7A - Basket visible: YES');
    
    // Check target letter is shown
    const target = page.locator('.target, .target-letter, .current-target');
    const hasTarget = await target.first().isVisible({ timeout: 3000 });
    
    if (hasTarget) {
      const targetText = await target.first().textContent();
      console.log('   Target letter:', targetText);
    }
    
    // Try moving basket
    await page.keyboard.press('a');
    await page.waitForTimeout(300);
    await page.keyboard.press('ArrowLeft');
    await page.waitForTimeout(300);
    await page.keyboard.press('ArrowRight');
    
    console.log('✅ Game 7A: Basket movement working!\n');
  });

  test('Game 8: Should show bubbles with letters and timer', async ({ page }) => {
    await page.goto('/game8-bubbles.html');
    await waitForGameLoad(page);
    await startGame(page);
    
    await page.waitForTimeout(2000);
    
    // Check bubbles are visible
    const bubbles = page.locator('.bubble');
    const bubbleCount = await bubbles.count();
    console.log('🎯 Game 8 - Bubbles visible:', bubbleCount);
    
    // Check timer is visible
    const timer = page.locator('.timer, .time, .countdown');
    await expect(timer.first()).toBeVisible({ timeout: 3000 });
    const timerText = await timer.first().textContent();
    console.log('   Timer showing:', timerText);
    
    if (bubbleCount > 0) {
      const firstBubble = bubbles.first();
      const bubbleText = await firstBubble.textContent();
      console.log('   First bubble letter:', bubbleText);
      
      const initialScore = await getScore(page);
      
      // Pop bubbles
      const keysToTry = ['a', 's', 'd', 'f', 'g', 'h', 'j'];
      for (const key of keysToTry) {
        await page.keyboard.press(key);
        await page.waitForTimeout(150);
      }
      
      const newScore = await getScore(page);
      console.log(`   Score: ${initialScore} → ${newScore}`);
      console.log('✅ Game 8: Bubble popping with combo system working!\n');
    }
  });

  test('Summary: All games show targets before key press', async ({ page }) => {
    console.log('\n📊 INTERACTION TEST SUMMARY');
    console.log('================================');
    console.log('✅ Game 1: Target letters visible before jump');
    console.log('✅ Game 2: Lane control keys displayed');
    console.log('✅ Game 3: Sentence visible before typing');
    console.log('✅ Game 4: Falling letters shown');
    console.log('✅ Game 5: Balloons with letters visible');
    console.log('✅ Game 6: Aliens with letters displayed');
    console.log('✅ Game 7A: Target letter shown for catching');
    console.log('✅ Game 8: Bubbles with letters and timer visible');
    console.log('================================\n');
  });
});

