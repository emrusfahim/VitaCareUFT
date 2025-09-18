import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductDetailsPage extends BasePage {
  readonly addToCartButton: Locator;
  readonly addToCartPopup: Locator;
  readonly closePopupButton: Locator;
  readonly productTitle: Locator;
  readonly productDetailsContainer: Locator;

  constructor(page: Page) {
    super(page);
    this.addToCartButton = page.locator('[id*="add-to-cart-button"]:not([onclick*="catalog"])').first();
    this.addToCartPopup = page.locator('#bar-notification .content').first();
    this.closePopupButton = page.locator('//span[@title="Close"]');
    this.productTitle = page.locator('h1, .product-name, .product-title, [data-testid="product-title"]');
    this.productDetailsContainer = page.locator('.product-details, .product-info, .product-page, .page-body, .content-wrapper');
  }

  async isProductDetailsPageLoaded(expectedProductName?: string): Promise<boolean> {
    try {
      // Minimal wait for speed
      await this.page.waitForTimeout(500); // Reduced from 1000ms
      
      // If a specific product name is expected, try to find it in the page content
      if (expectedProductName) {
        // Check for key parts of the product name
        const productKeywords = expectedProductName.toLowerCase().split(' ').slice(0, 3); // First 3 words
        const bodyText = await this.page.locator('body').textContent() || '';
        const pageTitle = await this.page.title();
        
        const hasKeywords = productKeywords.some(keyword => 
          bodyText.toLowerCase().includes(keyword) || 
          pageTitle.toLowerCase().includes(keyword)
        );
        
        if (hasKeywords) {
          return true;
        }
      }
      
      // Check if we have an add to cart button (indicating a product page)
      const hasAddToCart = await this.addToCartButton.isVisible({ timeout: 1000 }).catch(() => false); // Ultra-fast timeout
      
      // Check URL for product indicators
      const url = this.page.url();
      const isProductUrl = url.includes('product') || url.includes('item') || url.includes('/p/');
      
      return hasAddToCart || isProductUrl;
      
    } catch (error) {
      console.log('Error checking product details page:', error);
      return false;
    }
  }

  async addToCart(): Promise<void> {
    try {
      // Wait for add to cart button to be visible and clickable
      await this.addToCartButton.waitFor({ state: 'visible', timeout: 5000 }); // Ultra-fast timeout
      
      // Click the add to cart button
      await this.addToCartButton.click();
      
      // Try to handle popup quickly
      try {
        // Try to wait for popup with minimal timeout
        await this.addToCartPopup.waitFor({ state: 'visible', timeout: 1500 }); // Very fast popup timeout
        
        // If popup appears, try to close it quickly
        try {
          await this.closePopupButton.click({ timeout: 1000 }); // Fast close timeout
        } catch (closeError) {
          // Quick fallback: press Escape
          await this.page.keyboard.press('Escape');
        }
        
        // Don't wait for popup to disappear - continue immediately
        
      } catch (popupError) {
        // No popup detected - continue immediately
        console.log('No popup detected, continuing...');
      }
      
      // Minimal wait for any updates
      await this.page.waitForTimeout(200); // Reduced from 500ms
      
    } catch (error) {
      console.log('Error in addToCart:', error);
      throw error;
    }
  }

  async isAddToCartButtonVisible(): Promise<boolean> {
    return await this.addToCartButton.isVisible();
  }

  async isPopupVisible(): Promise<boolean> {
    return await this.addToCartPopup.isVisible();
  }

  async waitForPopupToAppear(): Promise<void> {
    await this.addToCartPopup.waitFor({ state: 'visible', timeout: this.timeout });
  }

  async closePopup(): Promise<void> {
    await this.closePopupButton.click();
    await this.addToCartPopup.waitFor({ state: 'hidden', timeout: this.timeout });
  }

  async getProductTitle(): Promise<string> {
    return await this.productTitle.first().textContent() || '';
  }
}