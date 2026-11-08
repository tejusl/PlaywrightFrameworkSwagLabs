import { expect, test as base, type Page } from '@playwright/test';
import { LoginPage } from '../Pages/LoginPage';

type AppFixtures = {
    authenticatedPage: Page;
};

export const test = base.extend<AppFixtures>({
    authenticatedPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await loginPage.navigate();
        await loginPage.login('standard_user', 'secret_sauce');
        await loginPage.verifySuccessfulLogin();

        await use(page);
    },
});

export { expect };
