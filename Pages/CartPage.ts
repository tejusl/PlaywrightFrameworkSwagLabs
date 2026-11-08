import { expect, Locator, Page } from '@playwright/test';
import type { Product } from '../data/products';

export class CartPage {
    readonly page: Page;
    readonly cartItems: Locator;
    readonly cartBadge: Locator;
    readonly continueShoppingButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.cartItems = page.getByTestId('inventory-item');
        this.cartBadge = page.getByTestId('shopping-cart-badge');
        this.continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping' });
    }

    async expectCartPageDisplayed() {
        await expect(this.page).toHaveURL(/\/cart\.html$/);
        await expect(this.page.getByTestId('title')).toHaveText('Your Cart');
    }

    async expectCartCount(count: number) {
        if (count === 0) {
            await expect(this.cartBadge).toBeHidden();
            return;
        }

        await expect(this.cartBadge).toHaveText(String(count));
    }

    async expectProductInCart(product: Product) {
        const item = this.getCartItem(product);
        await expect(item).toHaveCount(1);
        await expect(item.getByTestId('inventory-item-name')).toHaveText(product.name);
        await expect(item.getByTestId('inventory-item-price')).toHaveText(product.price);
    }

    async removeProduct(product: Product) {
        await this.getCartItem(product).getByRole('button', { name: 'Remove' }).click();
    }

    async continueShopping() {
        await this.continueShoppingButton.click();
    }

    async expectCartEmpty() {
        await expect(this.cartItems).toHaveCount(0);
        await this.expectCartCount(0);
    }

    private getCartItem(product: Product) {
        return this.cartItems.filter({
            has: this.page.getByText(product.name, { exact: true }),
        });
    }
}