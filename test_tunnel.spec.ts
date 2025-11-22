import { test, expect } from '@playwright/test';

test('verify cloudflare tunnel', async ({ page }) => {
  const tunnelUrl = 'https://packing-workshop-congratulations-trainers.trycloudflare.com';
  
  console.log(`Testing Cloudflare tunnel: ${tunnelUrl}`);
  
  // Navigate to tunnel
  await page.goto(tunnelUrl, { waitUntil: 'networkidle', timeout: 30000 });
  
  // Take screenshot of initial page
  await page.screenshot({ path: 'cf_step1_initial.png', fullPage: true });
  console.log('Screenshot 1: Initial page captured');
  
  // Wait for app to fully load
  await page.waitForTimeout(3000);
  
  // Take final screenshot
  await page.screenshot({ path: 'cf_step2_final_app.png', fullPage: true });
  console.log('Screenshot 2: Final app state');
  
  // Check for app title
  const title = await page.title();
  console.log(`Page title: "${title}"`);
  
  // Check for specific app elements
  const bodyText = await page.textContent('body');
  console.log(`Body content length: ${bodyText?.length || 0} characters`);
  
  // Look for app-specific elements
  const hasRoot = await page.locator('#root').count() > 0;
  console.log(`Has #root element: ${hasRoot}`);
  
  const hasInputForm = await page.locator('text=Generate').count() > 0;
  console.log(`Has Generate button: ${hasInputForm}`);
  
  // Check if we see the actual app or an error
  const pageContent = await page.content();
  const hasError = pageContent.toLowerCase().includes('error') || 
                   pageContent.toLowerCase().includes('cannot') ||
                   pageContent.toLowerCase().includes('failed');
  
  console.log(`Page contains error keywords: ${hasError}`);
  
  // Final verification
  expect(title).toContain('Suno');
  expect(hasRoot).toBe(true);
});
