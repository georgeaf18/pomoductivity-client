import { test, expect } from '@playwright/test';

test.describe('Pomoductivity App', () => {
  test('should load the application', async ({ page }) => {
    await page.goto('/');

    // Check that the page title is correct
    await expect(page).toHaveTitle(/Pomoductivity/);
  });

  test('should have navigation', async ({ page }) => {
    await page.goto('/');

    // Check for navigation elements (timer, settings, history)
    const timerNav = page.locator('a', { hasText: /timer/i });
    const settingsNav = page.locator('a', { hasText: /settings/i });
    const historyNav = page.locator('a', { hasText: /history/i });

    await expect(timerNav).toBeVisible();
    await expect(settingsNav).toBeVisible();
    await expect(historyNav).toBeVisible();
  });

  test('should navigate between pages', async ({ page }) => {
    await page.goto('/');

    // Navigate to settings
    await page.click('a:has-text("Settings")');
    await expect(page).toHaveURL(/.*settings/);
    await expect(page.locator('app-settings')).toBeVisible();

    // Navigate to history
    await page.click('a:has-text("History")');
    await expect(page).toHaveURL(/.*history/);
    await expect(page.locator('app-history')).toBeVisible();

    // Navigate back to timer
    await page.click('a:has-text("Timer")');
    await expect(page).toHaveURL(/.*timer/); // Should be /timer route
    await expect(page.locator('app-timer')).toBeVisible();
  });
});
