import { Page, expect } from '@playwright/test';

export interface QuantityAdjustOptions {
  minusClicksPerItem?: number;
  plusClicksPerItem?: number;
}

export class CheckoutModule {
  constructor(private page: Page) {}

  async goToCart(): Promise<void> {
    const cartLink = this.page.locator('#topcartlink');
    if (await cartLink.isVisible()) {
      await cartLink.click();
      await this.page.waitForTimeout(500);
    }
  }

  async goToCheckoutViaButton(): Promise<void> {
    const goToCartButton = this.page.locator("//button[normalize-space()='Go to cart']");
    await goToCartButton.waitFor({ state: 'visible', timeout: 5000 });
    await goToCartButton.click();
    await this.page.waitForTimeout(800);
    const currentUrl = this.page.url();
    const checkoutLocatorCount = await this.page.locator('.page-checkout, .checkout-page, #checkout').count();
    const isCheckoutPage = currentUrl.toLowerCase().includes('checkout') ||
      currentUrl.toLowerCase().includes('onepage') ||
      checkoutLocatorCount > 0;
    expect(isCheckoutPage).toBeTruthy();
  }

  async adjustQuantities(options: QuantityAdjustOptions = {}): Promise<void> {
    const { minusClicksPerItem = 3, plusClicksPerItem = 1 } = options;

    const qtyMinusButtons = this.page.locator('.qty-btn.qty-minus');
    const minusCount = await qtyMinusButtons.count();
    for (let i = 0; i < minusCount; i++) {
      for (let c = 0; c < minusClicksPerItem; c++) {
        await qtyMinusButtons.nth(i).click();
        await this.page.waitForTimeout(150);
      }
    }

    const qtyPlusButtons = this.page.locator('.qty-btn.qty-plus');
    const plusCount = await qtyPlusButtons.count();
    for (let i = 0; i < plusCount; i++) {
      for (let c = 0; c < plusClicksPerItem; c++) {
        await qtyPlusButtons.nth(i).click();
        await this.page.waitForTimeout(150);
      }
    }
  }

  async selectPickup(): Promise<void> {
    const pickupLabel = this.page.locator("//label[normalize-space()='Pickup']");
    if (await pickupLabel.isVisible()) {
      await pickupLabel.click();
      await this.page.waitForTimeout(300);
    }
  }

  async applyDiscount(code: string): Promise<void> {
    const discountInput = this.page.locator('#discountcouponcode');
    if (await discountInput.isVisible()) {
      await discountInput.clear();
      await discountInput.fill(code);
      const applyBtn = this.page.locator('#applydiscountcouponcode');
      if (await applyBtn.isVisible()) {
        await applyBtn.click();
        await this.page.waitForTimeout(500);
      }
    }
  }

  async applyGiftCard(code: string): Promise<void> {
    const giftCardInput = this.page.locator('#giftcardcouponcode');
    if (await giftCardInput.isVisible()) {
      await giftCardInput.clear();
      await giftCardInput.fill(code);
      const applyBtn = this.page.locator('#applygiftcardcouponcode');
      if (await applyBtn.isVisible()) {
        await applyBtn.click();
        await this.page.waitForTimeout(500);
      }
    }
  }

  async confirmOrder(): Promise<void> {
    const confirmButton = this.page.locator('#confirm-order-button');
    await confirmButton.waitFor({ state: 'visible', timeout: 5000 });
    await confirmButton.click();
    await this.page.waitForTimeout(1500);
  }
}
