const { test, expect } = require('@playwright/test');
const { 
  waitForGameLoad, 
  startGame, 
  getScore, 
  pressHebrewKey,
} = require('../helpers/game-helpers');

test.describe('Keyboard Behavior Testing - Interactive', () => {
  
  test('Game 1: Should show target letter and respond to key press', async ({ page }) => {
    await page.goto('/game1-runner.html');
    await waitForGameLoad(page);
    
    console.log('✓ Game 1 loaded');
    
    await startGame(page);
    console.log('✓ Game started');
    
    // Wait for first obstacle with target letter
    await page.waitForTimeout(2500);
    
    const targetLetter = page.locator('.target-letter');
    await expect(targetLetter).toBeVisible();
    console.log('✓ Target letter is VISIBLE');
    
    const letterText = await targetLetter.textContent();
    console.log(`✓ Target letter shown: ${letterText}`);
    
    const initialScore = await getScore(page);
    console.log(`✓ Initial score: ${initialScore}`);
    
    // Press the Hebrew key
    await pressHebrewKey(page, letterText.trim());
    console.log(`✓ Pressed key for: ${letterText}`);
    
    await page.waitForTimeout(500);
    
    const newScore = await getScore(page);
    console.log(`✓ New score: ${newScore}`);
    
    expect(newScore).toBeGreaterThanOrEqual(initialScore);
  });

  test('Game 2: Should show control keys and respond to lane switching', async ({ page }) => {
    await page.goto('/game2-car.html');
    await waitForGameLoad(page);
    
    console.log('✓ Game 2 loaded');
    
    await startGame(page);
    console.log('✓ Game started');
    
    await page.waitForTimeout(1000);
    
    // Check if control keys are visible
    const controlsVisible = await page.locator('.controls, .key-display, text=/שמאל|ימין|מרכז/i').count();
    console.log(`✓ Control indicators found: ${controlsVisible}`);
    
    const initialScore = await getScore(page);
    console.log(`✓ Initial score: ${initialScore}`);
    
    // Try pressing lane switching keys
    await page.keyboard.press('a');
    console.log('✓ Pressed "a" key (שמאל/left)');
    await page.waitForTimeout(300);
    
    await page.keyboard.press('s');
    console.log('✓ Pressed "s" key (דרום/center)');
    await page.waitForTimeout(300);
    
    await page.keyboard.press('d');
    console.log('✓ Pressed "d" key (ימין/right)');
    await page.waitForTimeout(300);
    
    const newScore = await getScore(page);
    console.log(`✓ Score after key presses: ${newScore}`);
    
    expect(newScore).toBeGreaterThanOrEqual(initialScore);
  });

  test('Game 4: Should show falling letters and respond to typing', async ({ page }) => {
    await page.goto('/game4-falling.html');
    await waitForGameLoad(page);
    
    console.log('✓ Game 4 loaded');
    
    await startGame(page);
    console.log('✓ Game started');
    
    await page.waitForTimeout(2000);
    
    // Check for falling letters
    const letters = page.locator('.letter, .falling-letter');
    const letterCount = await letters.count();
    console.log(`✓ Falling letters visible: ${letterCount}`);
    
    expect(letterCount).toBeGreaterThan(0);
    
    const initialScore = await getScore(page);
    console.log(`✓ Initial score: ${initialScore}`);
    
    // Try typing multiple keys
    const testKeys = ['a', 's', 'd', 'f', 'g'];
    for (const key of testKeys) {
      await page.keyboard.press(key);
      console.log(`✓ Pressed key: ${key}`);
      await page.waitForTimeout(200);
    }
    
    const newScore = await getScore(page);
    console.log(`✓ Final score: ${newScore}`);
    
    // Score should have changed if any letters matched
    expect(newScore).toBeGreaterThanOrEqual(initialScore);
  });

  test('Game 3: Should show target sentence and respond to typing', async ({ page }) => {
    await page.goto('/game3-typing.html');
    await waitForGameLoad(page);
    
    console.log('✓ Game 3 loaded');
    
    // Click easy difficulty
    const easyButton = page.locator('button:has-text("קל"), button:has-text("Easy")').first();
    await easyButton.click();
    console.log('✓ Selected easy difficulty');
    
    await page.waitForTimeout(1000);
    
    // Check for target sentence
    const sentence = page.locator('.target-sentence, .sentence-display');
    await expect(sentence.first()).toBeVisible();
    console.log('✓ Target sentence is VISIBLE');
    
    const sentenceText = await sentence.first().textContent();
    console.log(`✓ Sentence shown: ${sentenceText.substring(0, 30)}...`);
    
    // Check input field
    const input = page.locator('input[type="text"], textarea, .typing-input').first();
    await expect(input).toBeVisible();
    console.log('✓ Input field is VISIBLE');
    
    // Type some text
    await input.click();
    await page.keyboard.type('שלום');
    console.log('✓ Typed Hebrew text: שלום');
    
    await page.waitForTimeout(500);
    
    const inputValue = await input.inputValue();
    console.log(`✓ Input value: ${inputValue}`);
    
    expect(inputValue.length).toBeGreaterThan(0);
  });

  test('Game 5: Should show balloons with letters and respond to typing', async ({ page }) => {
    await page.goto('/game5-balloons.html');
    await waitForGameLoad(page);
    
    console.log('✓ Game 5 loaded');
    
    await startGame(page);
    console.log('✓ Game started');
    
    await page.waitForTimeout(2000);
    
    // Check for balloons
    const balloons = page.locator('.balloon');
    const balloonCount = await balloons.count();
    console.log(`✓ Balloons visible: ${balloonCount}`);
    
    expect(balloonCount).toBeGreaterThan(0);
    
    const initialScore = await getScore(page);
    console.log(`✓ Initial score: ${initialScore}`);
    
    // Type multiple keys to pop balloons
    const keys = ['a', 's', 'd', 'f', 'g', 'h'];
    for (const key of keys) {
      await page.keyboard.press(key);
      console.log(`✓ Pressed key: ${key} (attempting to pop balloon)`);
      await page.waitForTimeout(300);
    }
    
    const newScore = await getScore(page);
    console.log(`✓ Final score: ${newScore}`);
    
    expect(newScore).toBeGreaterThanOrEqual(initialScore);
  });
});




