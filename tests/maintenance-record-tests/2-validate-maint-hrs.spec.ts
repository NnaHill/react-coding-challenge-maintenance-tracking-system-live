import { test, expect } from '@playwright/test';

test.describe('Maintenance Record Form - Hours Spent Validation', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the page containing the MaintenanceRecordForm component
    await page.goto('http://localhost:3000/maintenance-record-form');
    // Wait for the form to be visible
    await page.waitForSelector('form', { state: 'visible' });

    // Wait for equipment options to be populated
    await page.waitForFunction(() => {
      const select = document.querySelector('select[name="equipmentId"]') as HTMLSelectElement;
      return select && select.options.length > 1;
    });

  });

  test('should reject invalid values for hours spent', async ({ page }) => {
    // Fill out other required fields to ensure form submission
    await page.selectOption('select[name="equipmentId"]', { index: 1 });
    await page.fill('input[name="date"]', '2023-07-15');
    await page.fill('input[name="technician"]', 'John Doe');
    await page.fill('textarea[name="description"]', 'Test maintenance description');
  
    // Test with a negative value
    await page.fill('input[name="hoursSpent"]', '-1');
    await page.click('button[type="submit"]');
    await checkForErrorMessage(page);
  
    // Test with a value over 24
    await page.fill('input[name="hoursSpent"]', '25');
    await page.click('button[type="submit"]');
    await checkForErrorMessage(page);
  });
  
  async function checkForErrorMessage(page) {
    await page.waitForSelector('.error-message, .text-red-500, [role="alert"]', { timeout: 5000 });
    await page.waitForTimeout(2000); // Increased wait time
  
    const errorMessages = await page.evaluate(() => {
      const selectors = [
        '.error-message',
        '.text-red-500',
        '[role="alert"]',
        'form .text-red-600',
        'form .invalid-feedback',
        '[data-testid="error-message"]',
        '.form-error',
        '#error-container'
      ];
  
      return selectors.map(selector => {
        const elements = document.querySelectorAll(selector);
        return Array.from(elements).map(el => el.textContent);
      }).flat().filter(Boolean);
    });
  
    console.log('Found error messages:', errorMessages);
  
    const hasExpectedError = errorMessages.some(msg => {
      const lowerMsg = msg.toLowerCase();
      return lowerMsg.includes('hours') && 
             (lowerMsg.includes('invalid') || lowerMsg.includes('between') || 
              lowerMsg.includes('must be') || lowerMsg.includes('not allowed'));
    });
  
    if (!hasExpectedError) {
      console.error('Expected error message not found. Available messages:', errorMessages);
      
      // Log form state
      const formState = await page.evaluate(() => {
        const form = document.querySelector('form');
        if (form) {
          const formData = new FormData(form);
          return Object.fromEntries(formData);
        }
        return null;
      });
      console.log('Form state after submission:', formState);
  
      throw new Error('Expected error message about invalid hours spent was not found');
    } else {
      console.log('Found an error message related to invalid hours');
    }
  }


  test('should reject values over 24 for hours spent', async ({ page }) => {
    // Fill out other required fields to ensure form submission
    await page.selectOption('select[name="equipmentId"]', { index: 1 });
    await page.fill('input[name="date"]', '2023-07-15');
    await page.fill('input[name="technician"]', 'John Doe');
    await page.fill('textarea[name="description"]', 'Test maintenance description');

    // Fill in a value over 24 for hours spent
    await page.fill('input[name="hoursSpent"]', '25');

    // Submit the form
    await page.click('button[type="submit"]');

    // Wait for any potential changes (increase timeout if needed)
    await page.waitForTimeout(3000);

    // Log the entire page content
    const pageContent = await page.content();
    console.log('Full page content after submission:', pageContent);

    // Check for any visible text on the page
    const visibleText = await page.evaluate(() => document.body.innerText);
    console.log('Visible text on the page:', visibleText);

    // Try to find error messages using different selectors
    const errorMessages = await page.evaluate(() => {
      const selectors = [
        '.error-message',
        '.text-red-500',
        '[role="alert"]',
        'form .text-red-600',
        'form .invalid-feedback',
        '[data-testid="error-message"]',
        '.form-error',
        '#error-container'
      ];

      return selectors.map(selector => {
        const elements = document.querySelectorAll(selector);
        return Array.from(elements).map(el => el.textContent);
      }).flat().filter(Boolean);
    });

    console.log('Found error messages:', errorMessages);

    // Check if any error message contains the expected text (case-insensitive and more flexible)
    const hasExpectedError = errorMessages.some(msg => {
      const lowerMsg = msg.toLowerCase();
      return (lowerMsg.includes('hours') || lowerMsg.includes('time')) && 
             (lowerMsg.includes('exceed') || lowerMsg.includes('maximum') || lowerMsg.includes('too high') || lowerMsg.includes('invalid'));
    });

    if (!hasExpectedError) {
      console.error('Expected error message not found. Available messages:', errorMessages);

      // Check if the form was actually submitted
      const currentUrl = page.url();
      console.log('Current URL after submission:', currentUrl);

      // Check for any changes in the form
      const formValues = await page.evaluate(() => {
        const form = document.querySelector('form');
        if (form instanceof HTMLFormElement) {
          const formData = new FormData(form);
          return Object.fromEntries(formData);
        }
        return {};
      });
      console.log('Form values after submission:', formValues);

      throw new Error('Expected error message about hours spent exceeding maximum was not found');
    } else {
      console.log('Found an error message related to excessive hours');
    }
  });




  test('should accept valid values for hours spent', async ({ page }) => {
    // Fill out other required fields to ensure form submission
    await page.selectOption('select[name="equipmentId"]', '1');
    await page.fill('input[name="date"]', '2023-07-15');
    await page.fill('input[name="technician"]', 'John Doe');
    await page.fill('textarea[name="description"]', 'Test maintenance description');

    // Test with a valid value
    await page.fill('input[name="hoursSpent"]', '8.5');

    // Submit the form
    await page.click('button[type="submit"]');

    // Wait for any potential changes (increase timeout if needed)
    await page.waitForTimeout(3000);

    // Log the entire page content for debugging
    const pageContent = await page.content();
    console.log('Full page content after submission:', pageContent);

    // Check for visible text on the page
    const visibleText = await page.evaluate(() => document.body.innerText);
    console.log('Visible text on the page:', visibleText);

    // Check for absence of error messages
    const errorMessages = await page.evaluate(() => {
      const selectors = [
        '.error-message',
        '.text-red-500',
        '[role="alert"]',
        'form .text-red-600',
        'form .invalid-feedback',
        '[data-testid="error-message"]',
        '.form-error',
        '#error-container'
      ];

      return selectors.map(selector => {
        const elements = document.querySelectorAll(selector);
        return Array.from(elements).map(el => el.textContent);
      }).flat().filter(Boolean);
    });

    console.log('Found error messages:', errorMessages);

    // Check if any error message contains text related to hours spent
    const hasHoursSpentError = errorMessages.some(msg => 
      msg.toLowerCase().includes('hours') && 
      (msg.toLowerCase().includes('exceed') || msg.toLowerCase().includes('invalid'))
    );

    expect(hasHoursSpentError).toBeFalsy();

    // Check for a success message or other indication of successful submission
    const successIndicators = await page.evaluate(() => {
      const selectors = [
        '.success-message',
        '[data-testid="success-message"]',
        '.form-success',
        '#success-container'
      ];

      return selectors.map(selector => {
        const elements = document.querySelectorAll(selector);
        return Array.from(elements).map(el => el.textContent);
      }).flat().filter(Boolean);
    });

    console.log('Success indicators found:', successIndicators);

    // Check if any success message is present
    const hasSuccessMessage = successIndicators.length > 0;
    if (!hasSuccessMessage) {
      console.warn('No explicit success message found. This might be expected if the form just clears or the page changes.');
    }

    // You might want to add an additional check here for other indications of successful submission
    // For example, checking if the form has been reset or if you've been redirected to a different page
    const currentUrl = page.url();
    console.log('Current URL after submission:', currentUrl);
  });


  test('should accept decimal values for hours spent', async ({ page }) => {
    // Fill out other required fields
    await page.selectOption('select[name="equipmentId"]', '1');
    await page.fill('input[name="date"]', '2023-07-15');
    await page.fill('input[name="technician"]', 'John Doe');
    await page.fill('textarea[name="description"]', 'Test maintenance description');
  
    // Test with a valid decimal value
    await page.fill('input[name="hoursSpent"]', '3.5');
    
    // Submit the form
    await page.click('button[type="submit"]');
  
    // Wait for any potential changes (increase timeout if needed)
    await page.waitForTimeout(3000);
  
    // Log the entire page content for debugging
    const pageContent = await page.content();
    console.log('Full page content after submission:', pageContent);
  
    // Check for visible text on the page
    const visibleText = await page.evaluate(() => document.body.innerText);
    console.log('Visible text on the page:', visibleText);
  
    // Check for absence of error messages
    const errorMessages = await page.evaluate(() => {
      const selectors = [
        '.error-message',
        '.text-red-500',
        '[role="alert"]',
        'form .text-red-600',
        'form .invalid-feedback',
        '[data-testid="error-message"]',
        '.form-error',
        '#error-container'
      ];
  
      return selectors.map(selector => {
        const elements = document.querySelectorAll(selector);
        return Array.from(elements).map(el => el.textContent);
      }).flat().filter(Boolean);
    });
  
    console.log('Found error messages:', errorMessages);
  
    // Check if any error message contains text related to hours spent
    const hasHoursSpentError = errorMessages.some(msg => 
      msg.toLowerCase().includes('hours') && 
      (msg.toLowerCase().includes('exceed') || msg.toLowerCase().includes('invalid'))
    );
  
    expect(hasHoursSpentError).toBeFalsy();
  
    // Check for a success message or other indication of successful submission
    const successIndicators = await page.evaluate(() => {
      const selectors = [
        '.success-message',
        '[data-testid="success-message"]',
        '.form-success',
        '#success-container'
      ];
  
      return selectors.map(selector => {
        const elements = document.querySelectorAll(selector);
        return Array.from(elements).map(el => el.textContent);
      }).flat().filter(Boolean);
    });
  
    console.log('Success indicators found:', successIndicators);
  
    // Check if any success message is present
    const hasSuccessMessage = successIndicators.length > 0;
    if (!hasSuccessMessage) {
      console.warn('No explicit success message found. This might be expected if the form just clears or the page changes.');
    }
  
    // You might want to add an additional check here for other indications of successful submission
    // For example, checking if the form has been reset or if you've been redirected to a different page
    const currentUrl = page.url();
    console.log('Current URL after submission:', currentUrl);
  });
});
