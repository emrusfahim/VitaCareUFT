import { Page } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { SearchResultsPage } from '../pages/SearchResultsPage';
import { ProductDetailsPage } from '../pages/ProductDetailsPage';

export class CatalogModule {
  private page: Page;
  private homePage: HomePage;

  constructor(page: Page) {
    this.page = page;
    this.homePage = new HomePage(page);
  }

  async searchAndOpenProduct(productName: string): Promise<ProductDetailsPage> {
    const searchResults: SearchResultsPage = await this.homePage.searchProduct(productName);
    await searchResults.clickOnBestMatchingProduct(productName);
    return new ProductDetailsPage(this.page);
  }

  async addProductToCart(productName: string): Promise<void> {
    const productDetails = await this.searchAndOpenProduct(productName);
    await productDetails.addToCart();
  }

  async addMultipleProducts(products: string[]): Promise<void> {
    for (const p of products) {
      await this.addProductToCart(p);
    }
  }
}
