
import { test, expect } from '@playwright/test';
import { LoginPage } from '../Pages/LoginPage';

test.describe('Swag Labs Login', () => {
  test('successful login', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate();
    await loginPage.login(
      'standard_user',
      'secret_sauce'
    );
    await loginPage.verifySuccessfulLogin();
  });

  test('invalid login', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate();
    await loginPage.login(
      'invalid_user',
      'wrong_password'
    );

    await expect(loginPage.errorMessage).toBeVisible();
  });

  test('locked out user', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate();
    await loginPage.login(
      'locked_out_user',
      'secret_sauce'
    );

    await expect(loginPage.errorMessage)
      .toContainText('locked out');
  });
});
