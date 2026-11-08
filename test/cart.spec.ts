import { expect, test } from '../fixtures/fixtures';
import { CartPage } from '../Pages/CartPage';
import { InventoryPage } from '../Pages/InventoryPage';
import { allProducts, products } from '../data/products';

test.describe('Swag Labs Cart', () => {
    test('displays all products on the inventory page', async ({ authenticatedPage }) => {
        const inventoryPage = new InventoryPage(authenticatedPage);

        await inventoryPage.expectProductsDisplayed(allProducts.map(({ name }) => name));
    });

    test('adds a single product to the cart', async ({ authenticatedPage }) => {
        const inventoryPage = new InventoryPage(authenticatedPage);

        await inventoryPage.addProductToCart(products.backpack);
        await inventoryPage.expectCartCount(1);
    });

    test('adds multiple products to the cart', async ({ authenticatedPage }) => {
        const inventoryPage = new InventoryPage(authenticatedPage);

        await inventoryPage.addProductToCart(products.backpack);
        await inventoryPage.addProductToCart(products.bikeLight);
        await inventoryPage.addProductToCart(products.onesie);

        await inventoryPage.expectCartCount(3);
    });

    test('shows the correct cart badge count', async ({ authenticatedPage }) => {
        const inventoryPage = new InventoryPage(authenticatedPage);

        await inventoryPage.addProductToCart(products.backpack);
        await inventoryPage.addProductToCart(products.bikeLight);

        await inventoryPage.expectCartCount(2);
    });

    test('navigates to the cart page', async ({ authenticatedPage }) => {
        const inventoryPage = new InventoryPage(authenticatedPage);
        const cartPage = new CartPage(authenticatedPage);

        await inventoryPage.addProductToCart(products.backpack);
        await inventoryPage.openCart();

        await cartPage.expectCartPageDisplayed();
    });

    test('shows product names and prices in the cart', async ({ authenticatedPage }) => {
        const inventoryPage = new InventoryPage(authenticatedPage);
        const cartPage = new CartPage(authenticatedPage);

        await inventoryPage.addProductToCart(products.backpack);
        await inventoryPage.addProductToCart(products.bikeLight);
        await inventoryPage.openCart();

        await cartPage.expectProductInCart(products.backpack);
        await cartPage.expectProductInCart(products.bikeLight);
    });

    test('removes a product from the cart', async ({ authenticatedPage }) => {
        const inventoryPage = new InventoryPage(authenticatedPage);
        const cartPage = new CartPage(authenticatedPage);

        await inventoryPage.addProductToCart(products.backpack);
        await inventoryPage.addProductToCart(products.bikeLight);
        await inventoryPage.openCart();
        await cartPage.removeProduct(products.backpack);

        await expect(cartPage.cartItems).toHaveCount(1);
        await cartPage.expectProductInCart(products.bikeLight);
    });

    test('updates the cart count after removing a product', async ({ authenticatedPage }) => {
        const inventoryPage = new InventoryPage(authenticatedPage);
        const cartPage = new CartPage(authenticatedPage);

        await inventoryPage.addProductToCart(products.backpack);
        await inventoryPage.addProductToCart(products.bikeLight);
        await inventoryPage.openCart();
        await cartPage.removeProduct(products.bikeLight);

        await cartPage.expectCartCount(1);
    });

    test('continues shopping and returns to the inventory page', async ({ authenticatedPage }) => {
        const inventoryPage = new InventoryPage(authenticatedPage);
        const cartPage = new CartPage(authenticatedPage);

        await inventoryPage.openCart();
        await cartPage.continueShopping();

        await expect(authenticatedPage).toHaveURL(/\/inventory\.html$/);
        await inventoryPage.expectProductsDisplayed(allProducts.map(({ name }) => name));
    });

    test('is empty after removing all products', async ({ authenticatedPage }) => {
        const inventoryPage = new InventoryPage(authenticatedPage);
        const cartPage = new CartPage(authenticatedPage);

        await inventoryPage.addProductToCart(products.backpack);
        await inventoryPage.addProductToCart(products.bikeLight);
        await inventoryPage.openCart();
        await cartPage.removeProduct(products.backpack);
        await cartPage.removeProduct(products.bikeLight);

        await cartPage.expectCartEmpty();
    });
});
