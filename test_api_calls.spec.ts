import { test, expect } from '@playwright/test';

test('test API functionality', async ({ page }) => {
  const url = 'https://reliable-wheel-digest-plate.trycloudflare.com';
  
  // Capture all console messages and errors
  const consoleMessages: string[] = [];
  const errors: string[] = [];
  
  page.on('console', msg => {
    const text = msg.text();
    consoleMessages.push(`[${msg.type()}] ${text}`);
    if (msg.type() === 'error') {
      console.log(`❌ Console Error: ${text}`);
      errors.push(text);
    }
  });
  
  page.on('pageerror', error => {
    console.log(`❌ Page Error: ${error.message}`);
    errors.push(error.message);
  });
  
  // Monitor network requests
  page.on('request', request => {
    if (request.url().includes('gemini') || request.url().includes('api')) {
      console.log(`📤 API Request: ${request.method()} ${request.url()}`);
    }
  });
  
  page.on('response', response => {
    if (response.url().includes('gemini') || response.url().includes('api')) {
      console.log(`📥 API Response: ${response.status()} ${response.url()}`);
    }
  });
  
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(3000);
  
  console.log('\n=== Checking for Errors ===');
  const apiKeyErrors = errors.filter(e => e.includes('API_KEY') || e.includes('environment'));
  if (apiKeyErrors.length > 0) {
    console.log('⚠️  API Key Issues Found:');
    apiKeyErrors.forEach(e => console.log(`   - ${e}`));
  }
  
  // Try to fill in the form
  console.log('\n=== Testing Form Interaction ===');
  const topicInput = page.locator('input[placeholder*="Lost love"], textarea').first();
  const isVisible = await topicInput.isVisible();
  console.log(`Form input visible: ${isVisible}`);
  
  if (isVisible) {
    await topicInput.fill('Test song about the ocean');
    console.log('✓ Filled topic input');
    
    // Look for generate button
    const generateBtn = page.locator('button').filter({ hasText: /Generate|Create/ }).first();
    const btnExists = await generateBtn.count() > 0;
    console.log(`Generate button found: ${btnExists}`);
    
    if (btnExists && await generateBtn.isVisible()) {
      console.log('Clicking generate button...');
      await generateBtn.click();
      
      // Wait and watch for API calls
      await page.waitForTimeout(5000);
      
      console.log('\n=== Console Messages (last 20) ===');
      consoleMessages.slice(-20).forEach(msg => console.log(msg));
    }
  }
  
  await page.screenshot({ path: 'test-api-debug.png', fullPage: true });
  console.log('\n✓ Debug screenshot saved: test-api-debug.png');
});
