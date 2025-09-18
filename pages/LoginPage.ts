import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  // Locators
  private readonly phoneInput: Locator;
  private readonly sendOtpButton: Locator;
  private readonly otpInput: Locator;
  private readonly verifyOtpButton: Locator;

  constructor(page: Page) {
    super(page);
    this.phoneInput = page.locator('#otp_login_Phone');
    this.sendOtpButton = page.locator('#btnOtpSendPopup');
    this.otpInput = page.locator('#otp_login_Otp');
    this.verifyOtpButton = page.locator('#btnVerifyOtpPopup');
  }

  async enterPhoneNumber(phoneNumber: string): Promise<LoginPage> {
    await this.enterText(this.phoneInput, phoneNumber);
    return this;
  }

  async sendOtp(): Promise<LoginPage> {
    await this.clickElement(this.sendOtpButton);
    // wait for OTP input section to appear (becomes clickable when shown)
    await this.otpInput.waitFor({ state: 'visible', timeout: this.timeout });
    return this;
  }

  async enterOtp(otp: string): Promise<LoginPage> {
    await this.enterText(this.otpInput, otp);
    return this;
  }

  async verifyOtp(): Promise<any> {
    const { HomePage } = await import('./HomePage');
    await this.clickElement(this.verifyOtpButton);
    return new HomePage(this.page);
  }

  async isLoginPageLoaded(): Promise<boolean> {
    return await this.isElementDisplayed(this.phoneInput);
  }

  async isOtpFieldVisible(): Promise<boolean> {
    return await this.isElementDisplayed(this.otpInput);
  }

  async getPhoneInputValue(): Promise<string> {
    return await this.getValue(this.phoneInput);
  }

  async getOtpInputValue(): Promise<string> {
    return await this.getValue(this.otpInput);
  }
}