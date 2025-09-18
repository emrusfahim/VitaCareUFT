import { Page } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';

export class AuthModule {
  private page: Page;
  private homePage: HomePage;
  private loginPage?: LoginPage;

  constructor(page: Page) {
    this.page = page;
    this.homePage = new HomePage(page);
  }

  async launchAndPrepare(url: string, language: string, city: string, area: string): Promise<HomePage> {
    await this.homePage
      .navigateToHomePage(url)
      .then(() => this.homePage.closeAlert())
      .then(() => this.homePage.selectLanguage(language))
      .then(() => this.homePage.selectLocationAndContinue(city, area));
    return this.homePage;
  }

  async loginWithOtp(phone: string, otp: string): Promise<HomePage> {
    const login = await this.homePage.clickLogin();
    this.loginPage = login; // assign for future use
    await login.enterPhoneNumber(phone);
    await login.sendOtp();
    await login.enterOtp(otp);
    this.homePage = await login.verifyOtp();
    return this.homePage;
  }
}
