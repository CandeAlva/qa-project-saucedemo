import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';

/**
 * TC-CART-01 a TC-CART-02
 * Coverage: Added product appears correctly in the cart.
 */
test.describe('Cart', () => {
  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login('standard_user', 'secret_sauce');
  });

  test('TC-CART-01: Added product appears in the cart', async ({ page }) => {
    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);

    await inventory.addProductToCart('Sauce Labs Backpack');
    await inventory.goToCart();

    const itemCount = await cart.getItemCount();
    expect(itemCount).toBe(1);
    await expect(page.locator('.cart_item')).toContainText('Sauce Labs Backpack');
  });

  test('TC-CART-02: empty cart shows no items', async ({ page }) => {
    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);

    await inventory.goToCart();

    const itemCount = await cart.getItemCount();
    expect(itemCount).toBe(0);
  });
});
