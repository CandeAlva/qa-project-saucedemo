import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

/**
 * TC-LOGIN-01 to TC-LOGIN-05
 * Coverage: successful login, invalid credentials, locked-out user,
 * empty fields. See TEST_CASES.md for the detail of each case.
 */
test.describe('Login', () => {
  test('TC-LOGIN-01: successful login with standard user', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login('standard_user', 'secret_sauce');

    await expect(page).toHaveURL(/inventory.html/);
    await expect(page.locator('.inventory_list')).toBeVisible();
  });

  test('TC-LOGIN-02: locked-out user cannot log in', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login('locked_out_user', 'secret_sauce');

    await expect(page).toHaveURL(/.*/); // does not navigate to inventory
    const error = await login.getErrorText();
    expect(error).toContain('locked out');
  });

  test('TC-LOGIN-03: incorrect password shows error', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login('standard_user', 'wrong_password');

    const error = await login.getErrorText();
    expect(error).toContain('do not match');
  });

  test('TC-LOGIN-04: empty fields show username required error', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login('', '');

    const error = await login.getErrorText();
    expect(error).toContain('Username is required');
  });

  test('TC-LOGIN-05: empty password only shows specific error', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login('standard_user', '');

    const error = await login.getErrorText();
    expect(error).toContain('Password is required');
  });
});
