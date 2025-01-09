import { test, expect } from '@playwright/test';

test('Filter maintenance records by date range', async ({ page }) => {
  // Navigate to the page with the MaintenanceRecordsTable
  await page.goto('http://localhost:3000/maintenance-records-table');

  // Wait for the table to be visible
  await page.waitForSelector('table');

  // Log the page content for debugging
  console.log('Page content:', await page.content());

  // Wait for and check if the date inputs are present
  const startDateInput = await page.waitForSelector('#start-date', { state: 'visible' });
  const endDateInput = await page.waitForSelector('#end-date', { state: 'visible' });

  expect(startDateInput).toBeTruthy();
  expect(endDateInput).toBeTruthy();

  // Set the start date
  await startDateInput.fill('2023-01-01');

  // Set the end date
  await endDateInput.fill('2023-06-30');

  // Wait for the table to update
  await page.waitForTimeout(500);

  // Check if the table contains only records within the specified date range
  const rows = await page.$$('tbody tr');
  for (const row of rows) {
    const dateCell = await row.$('td:nth-child(2)');
    if (dateCell) {
      const dateText = await dateCell.innerText();
      const recordDate = new Date(dateText);
      expect(recordDate.getTime()).toBeGreaterThanOrEqual(new Date('2023-01-01').getTime());
      expect(recordDate.getTime()).toBeLessThanOrEqual(new Date('2023-06-30').getTime());
    }
  }

  // Verify that records outside the date range are not displayed
  const outsideDateRecord = await page.$$('text=2023-07-25');
  expect(outsideDateRecord).toHaveLength(0);
});