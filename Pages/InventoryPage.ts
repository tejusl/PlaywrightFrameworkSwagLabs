import { expect, Locator, Page } from '@playwright/test';
import type { Product } from '../data/products';

export class InventoryPage {
    readonly page: Page;
    readonly inventoryItems: Locator;
    readonly productNames: Locator;
    readonly cartBadge: Locator;
    readonly cartLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.inventoryItems = page.getByTestId('inventory-item');
        this.productNames = page.getByTestId('inventory-item-name');
        this.cartBadge = page.getByTestId('shopping-cart-badge');
        this.cartLink = page.getByTestId('shopping-cart-link');
    }

    async expectProductsDisplayed(expectedNames: readonly string[]) {
        await expect(this.inventoryItems).toHaveCount(expectedNames.length);
        await expect(this.productNames).toHaveText([...expectedNames]);
    }

    async addProductToCart(product: Product) {
        const productItem = this.inventoryItems.filter({
            has: this.page.getByText(product.name, { exact: true }),
        });
        await productItem.getByRole('button', { name: 'Add to cart' }).click();
    }

    async expectCartCount(count: number) {
        if (count === 0) {
            await expect(this.cartBadge).toBeHidden();
            return;
        }

        await expect(this.cartBadge).toHaveText(String(count));
    }

    async openCart() {
        await this.cartLink.click();
    }
}