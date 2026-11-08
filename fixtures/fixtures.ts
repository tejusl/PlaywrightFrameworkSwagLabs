import { expect, test as base, type Page } from '@playwright/test';
import { LoginPage } from '../Pages/LoginPage';
import { getRequiredCredential } from '../data/credentials';

type AppFixtures = {
    authenticatedPage: Page;
};

export const test = base.extend<AppFixtures>({
    authenticatedPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await loginPage.navigate();
        await loginPage.login(
            getRequiredCredential('SWAG_LABS_USERNAME'),
            getRequiredCredential('SWAG_LABS_PASSWORD'),
        );
        await loginPage.verifySuccessfulLogin();

        await use(page);
    },
});

export { expect };
