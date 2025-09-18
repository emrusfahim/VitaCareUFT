import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  // Locators
  private readonly closeAlertButton: Locator;
  private readonly languageDropdown: Locator;
  private readonly loginLink: Locator;
  private readonly logoutLink: Locator;
  private readonly locationLabel: Locator;
  private readonly cityDropdown: Locator;
  private readonly areaDropdown: Locator;
  private readonly select2ResultsContainer: Locator;
  private readonly select2Option: Locator;
  private readonly continueButton: Locator;
  private readonly searchInput: Locator;
  private readonly searchForm: Locator;
  private readonly cartLink: Locator;

  constructor(page: Page) {
    super(page);
    this.closeAlertButton = page.locator('#close-push-notification');
    this.languageDropdown = page.locator('#customerlanguage');
    this.loginLink = page.locator('#login-link');
    this.logoutLink = page.locator('a.ico-logout');
    this.locationLabel = page.locator('.location-select label, .select-location label, text="Select Location"').first();
    this.cityDropdown = page.locator('#select2-SelectedCityId-container');
    this.areaDropdown = page.locator('#select2-SelectedAreaId-container');
    this.select2ResultsContainer = page.locator('.select2-results__options');
    this.select2Option = page.locator('.select2-results__option');
    this.continueButton = page.locator('#saveButton');
    this.searchInput = page.locator('#small-searchterms');
    this.searchForm = page.locator('#small-search-box-form');
    this.cartLink = page.locator('li[id="topcartlink"] a, a[href="/cart"], .cart-label').first();
  }

  async navigateToHomePage(url: string): Promise<HomePage> {
    await this.page.goto(url, { 
      waitUntil: 'domcontentloaded',  // Don't wait for all resources
      timeout: 60000  // Increase timeout to 60s
    });
    return this;
  }

  async closeAlert(): Promise<HomePage> {
    try {
      console.log('🔔 Attempting to close alert notification...');
      await this.clickElement(this.closeAlertButton);
      console.log('✅ Alert notification closed successfully');
    } catch (error) {
      console.log('ℹ️ No alert notification present to close');
    }
    return this;
  }

  async selectLanguage(language: string): Promise<HomePage> {
    await this.languageDropdown.selectOption({ label: language });
    return this;
  }

  async clickLogin(): Promise<any> {
    await this.clickElement(this.loginLink);
    // Use require() for CommonJS compatibility
    const { LoginPage } = require('./LoginPage');
    return new LoginPage(this.page);
  }

  async selectLocationAndContinue(city: string, area: string): Promise<HomePage> {
    console.log(`📍 Attempting to select location: ${city} / ${area}`);
    try {
      // Try to open location popup
      await this.clickElement(this.locationLabel);
      console.log('✅ Location popup opened successfully');
    } catch (error) {
      console.log('ℹ️ Alternative: trying to click "Select Location" text directly');
      // Alternative: try clicking on "Select Location" text directly
      await this.page.locator('text="Select Location"').first().click();
    }
    
    // City selection
    console.log(`🏙️ Selecting city: ${city}`);
    await this.selectFromSelect2(this.cityDropdown, city);
    
    // Area selection
    console.log(`📌 Selecting area: ${area}`);
    await this.selectFromSelect2(this.areaDropdown, area);
    
    // Continue
    console.log('✅ Clicking continue button...');
    await this.clickElement(this.continueButton);
    
    // Minimal dialog close wait
    await this.page.waitForTimeout(100);
    console.log(`✅ Location selected successfully: ${city} / ${area}`);
    return this;
  }

  private async selectFromSelect2(trigger: Locator, visibleText: string): Promise<void> {
    // Click the container that opens select2 dropdown
    await this.clickElement(trigger);
    
    // Wait for results list
    await this.select2ResultsContainer.waitFor({ state: 'visible' });
    
    const options = this.page.locator('.select2-results__option');
    const count = await options.count();
    
    let found = false;
    for (let i = 0; i < count; i++) {
      const option = options.nth(i);
      const text = await option.textContent();
      if (text?.trim().toLowerCase() === visibleText.toLowerCase()) {
        try {
          await option.click();
        } catch (error) {
          // Fallback using JavaScript click
          await option.evaluate(el => el.click());
        }
        found = true;
        break;
      }
    }
    
    if (!found) {
      throw new Error(`Option not found in select2: ${visibleText}`);
    }
    
    // Brief wait to allow value to set
    await this.page.waitForTimeout(50); // Minimal wait - reduced from 100ms
  }

  async isHomePageLoaded(): Promise<boolean> {
    return await this.page.title().then(title => title.includes('Home page'));
  }

  async isLoggedIn(): Promise<boolean> {
    try {
      return await this.isElementDisplayed(this.logoutLink);
    } catch (error) {
      return false;
    }
  }

  async searchProduct(query: string): Promise<any> {
    await this.searchInput.click();
    await this.searchInput.clear();
    await this.searchInput.fill(query);
    await this.searchInput.press('Enter');
    // Use require() for CommonJS compatibility
    const { SearchResultsPage } = require('./SearchResultsPage');
    return new SearchResultsPage(this.page);
  }

  async viewCart(): Promise<void> {
    // Try clicking the cart link
    try {
      await this.clickElement(this.cartLink);
    } catch (error) {
      // Fallback: navigate directly to cart URL
      await this.page.goto('https://vitacare.nop-station.com/cart');
    }
    // Wait for cart page to load
    await this.page.waitForTimeout(500);
  }
}