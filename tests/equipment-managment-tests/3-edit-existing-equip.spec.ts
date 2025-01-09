import { test, expect } from '@playwright/test';

test('Should edit existing equipment status from equipment table', async ({ page }) => {
  // Navigate to the page containing the EquipmentTable component
  await page.goto('http://localhost:3000/equipment-table');

  // Wait for the table to be visible
  await page.waitForSelector('table');

  // Select the first row in the table
  const firstRowCheckbox = await page.locator('table tbody tr:first-child input[type="checkbox"]');
  await firstRowCheckbox.check();

  // Verify that the checkbox is checked
  expect(await firstRowCheckbox.isChecked()).toBeTruthy();

  // Get the current status of the first row
  const initialStatus = await page.locator('table tbody tr:first-child td:nth-child(8)').textContent();

  // Choose a new status that's different from the current one
  const newStatus = initialStatus === 'Operational' ? 'Maintenance' : 'Operational';

  // Select the new status from the dropdown
  await page.selectOption('#status-update', newStatus);

  // Wait for any potential updates (you might need to adjust this based on your actual implementation)
  await page.waitForTimeout(1000);

  // Verify that the status has been updated in the table
  const updatedStatus = await page.locator('table tbody tr:first-child td:nth-child(8)').textContent();
  expect(updatedStatus).toBe(newStatus);

  // Verify that the checkbox has been unchecked after the update
  expect(await firstRowCheckbox.isChecked()).toBeFalsy();

  // Optional: Verify that a success message is displayed (if implemented)
  // await expect(page.locator('.success-message')).toBeVisible();
});
