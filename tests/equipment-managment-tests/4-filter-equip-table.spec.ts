import { test, expect } from '@playwright/test';

test('Should filter equipment table based on search input', async ({ page }) => {
  // Navigate to the page containing the EquipmentTable component
  await page.goto('http://localhost:3000/equipment-table');

  // Wait for the table to be visible
  await page.waitForSelector('table');

  // Get the initial number of rows in the table
  const initialRowCount = await page.locator('table tbody tr').count();

  // Test cases with different search terms
  const testCases = [
    { searchTerm: 'Machine A', expectedInResult: true },
    { searchTerm: 'Floor 1', expectedInResult: true },
    { searchTerm: 'NonexistentTerm', expectedInResult: false },
    { searchTerm: 'Machining', expectedInResult: true },
  ];

  for (const { searchTerm, expectedInResult } of testCases) {
    // Clear the search input and enter the new search term
    await page.fill('input[placeholder="Search all columns..."]', '');
    await page.fill('input[placeholder="Search all columns..."]', searchTerm);

    // Wait for the table to update
    await page.waitForTimeout(500); // Adjust this if needed based on your application's behavior

    // Count the number of visible rows after filtering
    const filteredRowCount = await page.locator('table tbody tr:visible').count();

    // Verify that the number of rows has changed (unless searching for a term that doesn't exist)
    if (expectedInResult) {
      expect(filteredRowCount).toBeGreaterThan(0);
      expect(filteredRowCount).toBeLessThan(initialRowCount);
    } else {
      expect(filteredRowCount).toBe(0);
    }

    // Check if the filtered results contain the search term
    if (expectedInResult) {
      const cellsWithSearchTerm = await page.locator(`table tbody tr:visible :text-matches("${searchTerm}", "i")`).count();
      expect(cellsWithSearchTerm).toBeGreaterThan(0);
    }
  }

  // Clear the search input and verify that all rows are displayed again
  await page.fill('input[placeholder="Search all columns..."]', '');
  await page.waitForTimeout(500); // Adjust this if needed

  const finalRowCount = await page.locator('table tbody tr').count();
  expect(finalRowCount).toBe(initialRowCount);
});
