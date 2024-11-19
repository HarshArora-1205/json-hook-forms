import { test, expect } from '@playwright/test';

test.describe('JSON Forms Generator', () => {
  test('should render the JSON editor and form preview', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await expect(page.locator('h1')).toHaveText('JSON HOOK FORMS');
    await expect(page.locator('.monaco-editor')).toBeVisible();
    await expect(page.getByText('No Preview')).toBeVisible();
  });

  test('should generate a form based on valid JSON input', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    const validJson = JSON.stringify({
      "formTitle": "Test Form",
      "formDescription": "This is a test form",
      "fields": [
        {
          "id": "name",
          "type": "text",
          "label": "Name",
          "required": true
        },
        {
          "id": "email",
          "type": "email",
          "label": "Email",
          "required": true,
          "validation": {
            "pattern": "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
            "message": "Please enter a valid email address"
          }
        },
        {
          "id": "age",
          "type": "number",
          "label": "Age",
          "required": true,
          "validation": {
            "min": 0,
            "max": 120
          }
        },
        {
          "id": "size",
          "type": "select",
          "label": "T-Shirt Size",
          "required": true,
          "options": [
            { "value": "s", "label": "Small" },
            { "value": "m", "label": "Medium" },
            { "value": "l", "label": "Large" }
          ]
        },
        {
          "id": "interests",
          "type": "checkbox",
          "label": "Interests",
          "required": false,
          "options": [
            { "value": "sports", "label": "Sports" },
            { "value": "music", "label": "Music" },
            { "value": "reading", "label": "Reading" }
          ]
        },
        {
          "id": "newsletter",
          "type": "switch",
          "label": "Subscribe to newsletter",
          "required": false
        }
      ]
    });
    await page.locator('textarea').fill(validJson);
    await expect(page.locator('h2')).toHaveText('Test Form');

    await expect(page.locator('label:has-text("Name")')).toBeVisible();
    await expect(page.locator('label:has-text("Email")')).toBeVisible();
    await expect(page.locator('label:has-text("Age")')).toBeVisible();
    await expect(page.locator('label:has-text("T-Shirt Size")')).toBeVisible();
    await expect(page.locator('label:has-text("Interests")')).toBeVisible();
    await expect(page.locator('label:has-text("Subscribe to newsletter")')).toBeVisible();
  });
  
  test('should show error for invalid JSON', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.locator('.monaco-editor textarea').fill('{"invalid": "json"');
    await expect(page.getByText('Schema validation error')).toBeVisible();
  });

  test('should submit form with valid data', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    const validJson = JSON.stringify({
      "formTitle": "Test Form",
      "formDescription": "This is a test form",
      "fields": [
        {
          "id": "name",
          "type": "text",
          "label": "Name",
          "required": true
        },
        {
          "id": "email",
          "type": "email",
          "label": "Email",
          "required": true,
          "validation": {
            "pattern": "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
            "message": "Please enter a valid email address"
          }
        }
      ]
    });
    await page.locator('.monaco-editor textarea').fill(validJson);
    await page.getByLabel('Name').fill('John Doe');
    await page.getByLabel('Email').fill('john@example.com');
    await page.getByRole('button', { name: 'Submit' }).click();
    await page.waitForSelector('text=Form Submitted Successfully', { timeout: 5000 });

  });

  test('should show validation errors for invalid form submission', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    const validJson = JSON.stringify({
      "formTitle": "Test Form",
      "formDescription": "This is a test form",
      "fields": [
        {
          "id": "name",
          "type": "text",
          "label": "Name",
          "required": true
        },
        {
          "id": "email",
          "type": "email",
          "label": "Email",
          "required": true,
          "validation": {
            "pattern": "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
            "message": "Please enter a valid email address"
          }
        }
      ]
    });
    await page.locator('.monaco-editor textarea').fill(validJson);
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByText('Name is required')).toBeVisible();
    await expect(page.getByText('Please enter a valid email address')).toBeVisible();
  });
});
