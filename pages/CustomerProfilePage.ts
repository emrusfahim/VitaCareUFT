import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CustomerProfilePage extends BasePage {
  // Profile dropdown / navigation locators (after login)
  private readonly userMenuTrigger: Locator;
  private readonly customerInfoLink: Locator;

  // Profile form locators
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly emailInput: Locator;
  private readonly companyNameInput: Locator;
  private readonly saveButton: Locator;

  constructor(page: Page) {
    super(page);
    this.userMenuTrigger = page.locator('.header-links li.user-dropdown > span');
    this.customerInfoLink = page.locator('li.user-dropdown li.customer-info > a');
    this.firstNameInput = page.locator('#FirstName');
    this.lastNameInput = page.locator('#LastName');
    this.emailInput = page.locator('#Email');
    this.companyNameInput = page.locator('#Company');
    this.saveButton = page.locator('#save-info-button');
  }

  async goToCustomerInfo(): Promise<void> {
    let loaded = false;
    try {
      // Hover over user dropdown span, then click Customer info link
      await this.userMenuTrigger.waitFor({ state: 'visible', timeout: this.timeout });
      await this.userMenuTrigger.hover();
      await this.page.waitForTimeout(300);
      await this.customerInfoLink.waitFor({ state: 'visible', timeout: this.timeout });
      await this.customerInfoLink.click();
      loaded = await this.waitUntilProfileLoaded();
    } catch (error) {
      // Fallback to direct navigation if hover route fails
    }

    if (!loaded) {
      await this.page.goto('https://vitacare.nop-station.com/customer/info');
      loaded = await this.waitUntilProfileLoaded();
    }

    if (!loaded) {
      throw new Error('Customer info page not reachable (likely not logged in or DOM changed).');
    }
  }

  private async waitUntilProfileLoaded(): Promise<boolean> {
    try {
      // Wait for the FirstName field to be visible and interactable
      await this.firstNameInput.waitFor({ state: 'visible', timeout: 20000 });
      await this.firstNameInput.waitFor({ state: 'attached', timeout: 20000 });
      return true;
    } catch (error) {
      // Capture debug information if the field fails to load
      console.log('Debug: Failed to locate FirstName field. Capturing page source and URL.');
      console.log('Current URL:', this.page.url());
      const pageContent = await this.page.content();
      console.log('Page Source length:', pageContent.length);
      return false;
    }
  }

  async updateProfileInfo(firstName: string, lastName: string, email: string, companyName: string): Promise<void> {
    await this.enterText(this.firstNameInput, firstName);
    await this.enterText(this.lastNameInput, lastName);
    await this.enterText(this.emailInput, email);
    await this.enterText(this.companyNameInput, companyName);
    await this.clickElement(this.saveButton);
  }

  async isProfilePageLoaded(): Promise<boolean> {
    return await this.isElementDisplayed(this.firstNameInput);
  }

  async getFirstName(): Promise<string> {
    return await this.getValue(this.firstNameInput);
  }

  async getLastName(): Promise<string> {
    return await this.getValue(this.lastNameInput);
  }

  async getEmail(): Promise<string> {
    return await this.getValue(this.emailInput);
  }

  async getCompanyName(): Promise<string> {
    return await this.getValue(this.companyNameInput);
  }
}