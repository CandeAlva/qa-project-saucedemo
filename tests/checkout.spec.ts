import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

/**
 * TC-CHK-01 to TC-CHK-04
 * Coverage: full purchase flow, required field validation,
 * and verification that subtotal + tax == total (critical business case).
 */
test.describe('Checkout', () => {
  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login('standard_user', 'secret_sauce');

    const inventory = new InventoryPage(page);
    await inventory.addProductToCart('Sauce Labs Backpack');
    await inventory.addProductToCart('Sauce Labs Bike Light');
    await inventory.goToCart();
  });

  test('TC-CHK-01: completes the purchase with valid data', async ({ page }) => {
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);

    await cart.goToCheckout();
    await checkout.fillInfoAndContinue('Candela', 'Alvarez', '1234');
    await checkout.finish();

    await expect(checkout.completeHeader).toHaveText(/Thank you/i);
  });

  test('TC-CHK-02: missing first name shows error', async ({ page }) => {
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);

    await cart.goToCheckout();
    await checkout.fillInfoAndContinue('', 'Alvarez', '1234');

    const error = await checkout.getErrorText();
    expect(error).toContain('First Name is required');
  });

  test('TC-CHK-03: missing postal code shows error', async ({ page }) => {
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);

    await cart.goToCheckout();
    await checkout.fillInfoAndContinue('Candela', 'Alvarez', '');

    const error = await checkout.getErrorText();
    expect(error).toContain('Postal Code is required');
  });

  test('TC-CHK-04: Total is equal exactly subtotal + tax', async ({ page }) => {
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);

    await cart.goToCheckout();
    await checkout.fillInfoAndContinue('Candela', 'Alvarez', '1234');

    const subtotalText = await checkout.summarySubtotal.textContent();
    const taxText = await checkout.summaryTax.textContent();
    const totalText = await checkout.summaryTotal.textContent();

    const subtotal = checkout.parseAmount(subtotalText);
    const tax = checkout.parseAmount(taxText);
    const total = checkout.parseAmount(totalText);

    // Business rule check: the total must equal exactly subtotal + tax,
    // with a minimal tolerance for floating-point rounding.
    expect(total).toBeCloseTo(subtotal + tax, 2);
  });
});
