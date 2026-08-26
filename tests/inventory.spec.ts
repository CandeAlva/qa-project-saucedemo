import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';

/**
 * TC-INV-01 a TC-INV-04
 * Coverage: add/remove products, cart badge, sort by price.
 */
test.describe('Inventory', () => {
  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login('standard_user', 'secret_sauce');
  });

  test('TC-INV-01: Adding a product updates the cart badge', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await inventory.addProductToCart('Sauce Labs Backpack');

    const count = await inventory.getCartCount();
    expect(count).toBe('1');
  });

  test('TC-INV-02: adding and removing a product leaves the cart empty', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await inventory.addProductToCart('Sauce Labs Backpack');
    await inventory.removeProductFromCart('Sauce Labs Backpack');

    const count = await inventory.getCartCount();
    expect(count).toBeNull();
  });

  test('TC-INV-03: adding multiple products correctly sums the badge', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await inventory.addProductToCart('Sauce Labs Backpack');
    await inventory.addProductToCart('Sauce Labs Bike Light');
    await inventory.addProductToCart('Sauce Labs Bolt T-Shirt');

    const count = await inventory.getCartCount();
    expect(count).toBe('3');
  });

  test('TC-INV-04: sort by price (lowest to highest) returns ascending list', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await inventory.sortBy('lohi');

    const prices = await inventory.getAllPricesAsNumbers();
    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);
  });

  test('TC-INV-05: sort by price (highest to lowest) returns descending list', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await inventory.sortBy('hilo');

    const prices = await inventory.getAllPricesAsNumbers();
    const sorted = [...prices].sort((a, b) => b - a);
    expect(prices).toEqual(sorted);
  });
});
