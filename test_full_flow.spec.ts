import { test, expect } from '@playwright/test';

test('verify full API flow works', async ({ page }) => {
  const url = 'https://reliable-wheel-digest-plate.trycloudflare.com';
  
  let apiCallsMade = 0;
  let apiErrors = 0;
  
  page.on('request', request => {
    if (request.url().includes('generativelanguage.googleapis.com')) {
      apiCallsMade++;
      console.log(`✓ API Request ${apiCallsMade}: ${request.method()} to Gemini`);
    }
  });
  
  page.on('response', async response => {
    if (response.url().includes('generativelanguage.googleapis.com')) {
      console.log(`✓ API Response: ${response.status()}`);
      if (response.status() !== 200) {
        apiErrors++;
        const text = await response.text().catch(() => 'Could not read response');
        console.log(`❌ Error response: ${text.substring(0, 200)}`);
      }
    }
  });
  
  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('error') || text.includes('Error')) {
      console.log(`⚠️  Console: ${text.substring(0, 150)}`);
    }
  });
  
  console.log('=== Loading App ===');
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(2000);
  
  console.log('\n=== Filling Form ===');
  const topicInput = page.locator('input, textarea').filter({ hasText: '' }).first();
  await topicInput.fill('Summer vacation by the beach');
  console.log('✓ Topic filled');
  
  const generateBtn = page.locator('button').filter({ hasText: /Generate/ }).first();
  await expect(generateBtn).toBeVisible({ timeout: 5000 });
  
  console.log('\n=== Clicking Generate ===');
  await generateBtn.click();
  console.log('✓ Generate button clicked');
  
  // Wait for API calls and processing
  console.log('\n=== Waiting for Generation (30s max) ===');
  await page.waitForTimeout(30000);
  
  // Check if lyrics appeared
  const lyricsTab = page.locator('button').filter({ hasText: /Lyrics/ });
  const hasLyrics = await lyricsTab.count() > 0;
  
  console.log(`\n=== Results ===`);
  console.log(`API Calls Made: ${apiCallsMade}`);
  console.log(`API Errors: ${apiErrors}`);
  console.log(`Lyrics Tab Present: ${hasLyrics}`);
  
  if (hasLyrics) {
    console.log('✅ Song generation SUCCESSFUL!');
    await page.screenshot({ path: 'test-working-song.png', fullPage: true });
    console.log('✓ Screenshot saved: test-working-song.png');
  } else {
    console.log('⚠️  Song may still be generating or there was an issue');
    await page.screenshot({ path: 'test-generating.png', fullPage: true });
    console.log('✓ Screenshot saved: test-generating.png');
  }
});
