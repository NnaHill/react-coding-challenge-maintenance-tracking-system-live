import { test, expect } from '@playwright/test';

test.describe('Equipment Form Validation', () => {
  test('should show validation errors for invalid equipment data', async ({ page }) => {
    // Navigate to the page containing the EquipmentForm
    await page.goto('http://localhost:3000/equipment-form');

    // Fill in the form with invalid data
    await page.fill('#name', 'A'); // Too short
    await page.fill('#location', ''); // Empty
    await page.selectOption('#department', 'Machining');
    await page.fill('#model', ''); // Empty
    await page.fill('#serialNumber', 'Invalid@123'); // Contains non-alphanumeric characters
    await page.fill('#installDate', '2025-01-10'); // Future date
    await page.selectOption('#status', 'Operational');

    // Submit the form
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000); // Wait for 3 seconds

    // Wait for error messages to appear
    await page.waitForTimeout(1000); // Add a small delay
    // Check for validation error messages
    await expect(page.locator('text=Name must be at least 3 characters')).toBeVisible();
    await expect(page.locator('text=Location is required')).toBeVisible();
    await expect(page.locator('text=Model is required')).toBeVisible();
    await expect(page.locator('text=Serial Number must be alphanumeric')).toBeVisible();

    // For the install date, let's check for multiple possible error messages
    // In your Playwright test file
    await expect(page.getByTestId('installDate-error')).toBeVisible({ timeout: 15000 });
    // Verify that the form was not submitted successfully
    await expect(page.locator('text=Form submitted:')).not.toBeVisible();

    // Log all visible error messages for debugging
    const errorMessages = await page.locator('.text-red-500').allTextContents();
    console.log('Actual error messages:', errorMessages);
  });

});
