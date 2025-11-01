import { test, expect } from '@playwright/test';

test.describe('Timer Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the page to fully load and timer to be visible
    await page.waitForSelector('.display-1', { state: 'visible' });
  });

  test('should display the timer component', async ({ page }) => {
    await expect(page.locator('app-timer')).toBeVisible();
    await expect(page.locator('.display-1')).toBeVisible();
  });

  test('should display timer controls', async ({ page }) => {
    // Check that control buttons are visible
    await expect(page.getByRole('button', { name: 'Start timer' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Reset timer' })).toBeVisible();
  });

  test('should display session type buttons', async ({ page }) => {
    // Check that session type buttons are visible
    await expect(page.getByRole('button', { name: 'Focus' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Short Break' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Long Break' })).toBeVisible();
  });

  test('should show session count', async ({ page }) => {
    // Check that session count is displayed
    await expect(page.locator('text=/Sessions completed:/i')).toBeVisible();
  });
});
