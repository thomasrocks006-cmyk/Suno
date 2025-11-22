import { test, expect } from '@playwright/test';

test('test app renders', async ({ page }) => {
  console.log('Navigating to app...');
  try {
    await page.goto('http://localhost:5173', { timeout: 10000 });
    console.log('Page loaded.');
    
    // Take a screenshot
    await page.screenshot({ path: 'proof_of_life.png' });
    console.log('Screenshot taken.');

    // Check for title
    const title = await page.title();
    console.log(`Page title: ${title}`);
    
    // Check for specific element
    const bodyText = await page.textContent('body');
    console.log('Body text length:', bodyText?.length);

  } catch (e) {
    console.error('Error accessing page:', e);
    // Try to take a screenshot of the error state
    await page.screenshot({ path: 'error_state.png' });
    throw e;
  }
});
