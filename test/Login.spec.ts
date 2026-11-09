
import { test, expect } from '@playwright/test';
import { LoginPage } from '../Pages/LoginPage';
import { getRequiredCredential } from '../data/credentials';

test.describe('Swag Labs Login', () => {
  test('successful login', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate();
    await loginPage.login(
      getRequiredCredential('SWAG_LABS_USERNAME'),
      getRequiredCredential('SWAG_LABS_PASSWORD'),
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

  test('requires a username before login', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate();
    await loginPage.login('', '');

    await expect(loginPage.errorMessage).toContainText('Username is required');
  });

  test('requires a password before login', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate();
    await loginPage.login(getRequiredCredential('SWAG_LABS_USERNAME'), '');

    await expect(loginPage.errorMessage).toContainText('Password is required');
  });

  test('locked out user', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate();
    await loginPage.login(
      getRequiredCredential('SWAG_LABS_LOCKED_OUT_USERNAME'),
      getRequiredCredential('SWAG_LABS_PASSWORD'),
    );

    await expect(loginPage.errorMessage)
      .toContainText('locked out');
  });
});
