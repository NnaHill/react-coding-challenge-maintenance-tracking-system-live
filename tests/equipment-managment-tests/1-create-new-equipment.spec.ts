import { test, expect } from '@playwright/test';

test('Should create new equipment with valid data', async ({ page }) => {
  // Navigate to the equipment form page
  await page.goto('http://localhost:3000/equipment-form');

  // Wait for the form to be visible and interactive
  await page.waitForSelector('form', { state: 'visible' });

  // Fill out the form with valid data
  await page.fill('input[name="name"]', 'Test Machine');
  await page.fill('input[name="location"]', 'Test Location');

  // Select a valid department option
  await page.selectOption('select[name="department"]', 'Machining');

  await page.fill('input[name="model"]', 'Test Model');
  await page.fill('input[name="serialNumber"]', 'TEST123');
  await page.fill('input[name="installDate"]', '2023-01-01');
  await page.selectOption('select[name="status"]', 'Operational');

  // Submit the form
  await page.click('button[type="submit"]');
});

