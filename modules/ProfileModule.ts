import { Page } from '@playwright/test';
import { CustomerProfilePage } from '../pages/CustomerProfilePage';
import { ProfileData } from '../utils/DataTypes';

export class ProfileModule {
  private page: Page;
  private profilePage: CustomerProfilePage;

  constructor(page: Page) {
    this.page = page;
    this.profilePage = new CustomerProfilePage(page);
  }

  async updateProfile(data: ProfileData): Promise<void> {
    await this.profilePage.goToCustomerInfo();
    await this.profilePage.updateProfileInfo(
      data.firstName,
      data.lastName,
      data.email,
      data.companyName
    );
  }

  async verifyProfile(data: ProfileData): Promise<void> {
    const first = await this.profilePage.getFirstName();
    const last = await this.profilePage.getLastName();
    const email = await this.profilePage.getEmail();
    const company = await this.profilePage.getCompanyName();

    if (first !== data.firstName || last !== data.lastName || email !== data.email || company !== data.companyName) {
      throw new Error('Profile verification failed: mismatch in one or more fields');
    }
  }
}
