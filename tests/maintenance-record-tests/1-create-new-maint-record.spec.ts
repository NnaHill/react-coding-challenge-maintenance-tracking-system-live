import { test, expect } from '@playwright/test';

test('Should create a new maintenance record with valid data', async ({ page }) => {
  test.setTimeout(120000); // Increase timeout to 120 seconds for this test

  // Navigate to the page containing the MaintenanceRecordForm component
  await page.goto('http://localhost:3000/maintenance-record-form');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  console.log('Page loaded');
  // Wait for the form to be loaded
  await page.waitForSelector('form', { state: 'visible' });
  console.log('Form is visible');

  // Wait for the equipment select element and its options
  await page.waitForSelector('select[name="equipmentId"] option[value="1"]', { state: 'attached' });
  console.log('Equipment options loaded');

  // Log the current state of the select element
  const selectContent = await page.$eval('select[name="equipmentId"]', (select) => select.innerHTML);
  console.log('Select element content:', selectContent);

  // Log the available options for debugging
  const options = await page.$eval('select[name="equipmentId"]', (select) => {
    if (select instanceof HTMLSelectElement) {
      return Array.from(select.options).map(option => ({
        value: option.value,
        text: option.textContent
      }));
    }
    return [];
  });
  console.log('Available options:', options);

  // Select the first available option
  const firstOptionValue = await page.$eval('select[name="equipmentId"] option:not(:first-child)', (option) => (option as HTMLOptionElement).value);
  await page.selectOption('select[name="equipmentId"]', firstOptionValue);
  console.log('Equipment selected');

  // Fill in the form fields
  await page.fill('input[name="date"]', '2023-07-15');
  await page.selectOption('select[name="type"]', 'Preventive');
  await page.fill('input[name="technician"]', 'John Doe');
  await page.fill('input[name="hoursSpent"]', '2.5');
  await page.fill('textarea[name="description"]', 'Routine maintenance check and lubrication of moving parts.');
  await page.fill('input[id="partsReplaced"]', 'Air Filter');
  await page.click('button:has-text("Add")');
  await page.selectOption('select[name="priority"]', 'Medium');
  await page.selectOption('select[name="completionStatus"]', 'Complete');
  console.log('Form filled');

  // Submit the form
  console.log('Submitting form...');
  await page.click('button[type="submit"]');
  console.log('Form submitted');

});
