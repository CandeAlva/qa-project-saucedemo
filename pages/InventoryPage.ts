import { Page, Locator } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly inventoryList: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;
  readonly sortDropdown: Locator;
  readonly inventoryItemNames: Locator;
  readonly inventoryItemPrices: Locator;

  constructor(page: Page) {
    this.page = page;
    this.inventoryList = page.locator('.inventory_list');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartLink = page.locator('.shopping_cart_link');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.inventoryItemNames = page.locator('.inventory_item_name');
    this.inventoryItemPrices = page.locator('.inventory_item_price');
  }

  async addProductToCart(productName: string) {
    const item = this.page.locator('.inventory_item', { hasText: productName });
    await item.getByRole('button', { name: /add to cart/i }).click();
  }

  async removeProductFromCart(productName: string) {
    const item = this.page.locator('.inventory_item', { hasText: productName });
    await item.getByRole('button', { name: /remove/i }).click();
  }

  async getCartCount(): Promise<string | null> {
    if (await this.cartBadge.count() === 0) return null;
    return this.cartBadge.textContent();
  }

  async sortBy(option: string) {
    await this.sortDropdown.selectOption(option);
  }

  async getAllPricesAsNumbers(): Promise<number[]> {
    const texts = await this.inventoryItemPrices.allTextContents();
    return texts.map((t) => parseFloat(t.replace('$', '')));
  }

  async goToCart() {
    await this.cartLink.click();
  }
}
