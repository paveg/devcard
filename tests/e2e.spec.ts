import { expect, test } from '@playwright/test';

test('DevCard Landing Page', async ({ page }) => {
  await page.goto('/');

  // Check title
  await expect(page).toHaveTitle(/DevCard - GitHub Readme Stats/);

  // Check header
  const heading = page.getByRole('heading', { name: 'DevCard', level: 1 });
  await expect(heading).toBeVisible();

  // Check inputs
  const usernameInput = page.getByPlaceholder('octocat'); // Based on my previous code edits
  await expect(usernameInput).toBeVisible();

  // Check for the cards
  await expect(page.getByText('Stats Card')).toBeVisible();
  await expect(page.getByText('Top Languages')).toBeVisible();
  await expect(page.getByText('Repository Pin')).toBeVisible();

  // Check theme selector
  await expect(page.getByText('Available Themes')).toBeVisible();
});
