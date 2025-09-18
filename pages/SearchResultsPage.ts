import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class SearchResultsPage extends BasePage {
  // Locators
  private readonly productTitles: Locator;

  constructor(page: Page) {
    super(page);
    this.productTitles = page.locator('.product-title');
  }

  async isProductDisplayed(productName: string): Promise<boolean> {
    await this.productTitles.first().waitFor({ state: 'visible', timeout: this.timeout });
    
    const products = this.productTitles;
    const count = await products.count();
    
    for (let i = 0; i < count; i++) {
      const product = products.nth(i);
      const text = await product.textContent();
      if (text?.toLowerCase() === productName.toLowerCase()) {
        return true;
      }
    }
    return false;
  }

  async clickOnProductTitle(productName: string): Promise<void> {
    await this.productTitles.first().waitFor({ state: 'visible', timeout: this.timeout });
    
    const products = this.productTitles;
    const count = await products.count();
    
    for (let i = 0; i < count; i++) {
      const product = products.nth(i);
      const text = await product.textContent();
      if (text?.toLowerCase() === productName.toLowerCase()) {
        await product.click();
        return;
      }
    }
    throw new Error(`Product with name '${productName}' not found in search results.`);
  }

  async getAllProductTitles(): Promise<string[]> {
    await this.productTitles.first().waitFor({ state: 'visible', timeout: this.timeout });
    
    const products = this.productTitles;
    const count = await products.count();
    const titles: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const product = products.nth(i);
      const text = await product.textContent();
      if (text && text.trim()) {
        titles.push(text.trim());
      }
    }
    
    return titles;
  }

  async findBestMatchingProduct(searchTerm: string): Promise<string | null> {
    const allProducts = await this.getAllProductTitles();
    console.log(`Found ${allProducts.length} products in search results:`);
    allProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product}`);
    });
    
    // First try exact match (case insensitive)
    const exactMatch = allProducts.find(product => 
      product.toLowerCase() === searchTerm.toLowerCase()
    );
    
    if (exactMatch) {
      console.log(`✅ Found exact match: ${exactMatch}`);
      return exactMatch;
    }
    
    // Try partial match - find product that contains most words from search term
    const searchWords = searchTerm.toLowerCase().split(' ').filter(word => word.length > 2);
    let bestMatch = null;
    let highestScore = 0;
    
    for (const product of allProducts) {
      const productLower = product.toLowerCase();
      let score = 0;
      
      for (const word of searchWords) {
        if (productLower.includes(word)) {
          score++;
        }
      }
      
      if (score > highestScore && score > 0) {
        highestScore = score;
        bestMatch = product;
      }
    }
    
    if (bestMatch) {
      console.log(`✅ Found best match: ${bestMatch} (score: ${highestScore}/${searchWords.length})`);
      return bestMatch;
    }
    
    console.log(`❌ No matching product found for: ${searchTerm}`);
    return null;
  }

  async clickOnBestMatchingProduct(searchTerm: string): Promise<void> {
    const bestMatch = await this.findBestMatchingProduct(searchTerm);
    
    if (!bestMatch) {
      throw new Error(`No matching product found for search term: ${searchTerm}`);
    }
    
    await this.clickOnProductTitle(bestMatch);
  }
}