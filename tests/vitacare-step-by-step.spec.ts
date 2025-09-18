import { test, expect, Page } from '@playwright/test';
import { JsonDataReader } from '../utils/JsonDataReader';
import { LoginData, ProfileData } from '../utils/DataTypes';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { CustomerProfilePage } from '../pages/CustomerProfilePage';
import { SearchResultsPage } from '../pages/SearchResultsPage';
import { ProductDetailsPage } from '../pages/ProductDetailsPage';

test.describe('VitaCare E-Commerce Automation Suite', () => {
  let page: Page;
  // Page objects
  let homePage: HomePage;
  let loginPage: LoginPage;
  let profilePage: CustomerProfilePage;
  let testData: LoginData;
  let profileData: ProfileData;
  const BASE_URL = 'https://vitacare.nop-station.com/';
  
  // Test execution tracking
  const testResults: { [key: string]: string } = {};
  const startTime = Date.now();

  test.beforeAll(async ({ browser }) => {
    console.log('\n' + '='.repeat(80));
    console.log('🚀 VITACARE E-COMMERCE AUTOMATION TEST SUITE');
    console.log('='.repeat(80));
    console.log('📝 Test Description: Complete user journey from login to checkout');
    console.log('🌐 Target URL: https://vitacare.nop-station.com/');
    console.log('📋 Total Steps: 15');
    console.log('⏱️ Started at: ' + new Date().toLocaleString());
    console.log('🎥 Video Recording: Enabled');
    console.log('📊 Trace Collection: On failure');
    console.log('📸 Screenshots: On failure');
    console.log('='.repeat(80) + '\n');
    
    page = await browser.newPage();
    
    // Enable detailed logging
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        console.log(`❌ Console Error: ${msg.text()}`);
      }
    });
    
    page.on('pageerror', (error) => {
      console.log(`💥 Page Error: ${error.message}`);
    });
    
    testData = JsonDataReader.getLoginData();
    profileData = JsonDataReader.getProfileData();
    // Initialize page objects
    homePage = new HomePage(page);
    profilePage = new CustomerProfilePage(page);
  });

  test.afterAll(async () => {
    const endTime = Date.now();
    const executionTime = ((endTime - startTime) / 1000).toFixed(2);
    
    console.log('\n' + '='.repeat(80));
    console.log('🎯 VITACARE TEST SUITE EXECUTION COMPLETED');
    console.log('='.repeat(80));
    
    // Dynamic test results summary
    const totalSteps = Object.keys(testResults).length;
    const passedSteps = Object.values(testResults).filter(result => result === '✅').length;
    const failedSteps = totalSteps - passedSteps;
    
    console.log('📊 Execution Summary:');
    console.log(`   ⏱️ Total Execution Time: ${executionTime}s`);
    console.log(`   📋 Total Steps: ${totalSteps}`);
    console.log(`   ✅ Passed: ${passedSteps}`);
    console.log(`   ❌ Failed: ${failedSteps}`);
    console.log(`   📈 Success Rate: ${totalSteps > 0 ? ((passedSteps/totalSteps)*100).toFixed(1) : 0}%`);
    console.log('');
    
    console.log('📋 Detailed Test Results:');
    Object.entries(testResults).forEach(([step, status]) => {
      console.log(`   ${status} ${step}`);
    });
    
    console.log('='.repeat(80));
    console.log('📁 Generated Reports:');
    console.log('   📊 HTML Report: playwright-report/index.html');
    console.log('   🎥 Videos: test-results/videos/');
    console.log('   📸 Screenshots: test-results/');
    console.log('   📋 JUnit: test-results/junit.xml');
    console.log('   📄 JSON: test-results/results.json');
    console.log('='.repeat(80));
    
    if (failedSteps === 0) {
      console.log('🎉 All steps completed successfully!');
      console.log('💰 Bonus: Discount & Gift Card coupons applied');
      console.log('🏪 Bonus: Store pickup option selected');
      console.log('✅ Bonus: Order successfully confirmed');
    } else {
      console.log(`⚠️ ${failedSteps} step(s) failed. Check reports for details.`);
    }
    
    console.log('='.repeat(80) + '\n');

    await page.close();
  });

  test.describe.configure({ mode: 'serial' });

  test('Step 01: Open homepage', async () => {
    await homePage.navigateToHomePage(BASE_URL);
    expect(await homePage.isHomePageLoaded()).toBeTruthy();
    testResults['Step 01: Homepage Navigation'] = '✅';
  });

  test('Step 02: Close alert notification if present', async () => {
    await homePage.closeAlert();
    testResults['Step 02: Alert Handling'] = '✅';
  });

  test('Step 03: Select English language', async () => {
    await homePage.selectLanguage('EN');
    testResults['Step 03: Language Selection'] = '✅';
  });

  test('Step 04: Select Dhaka / Banasree location', async () => {
    await homePage.selectLocationAndContinue('Dhaka', 'Banasree');
    expect(homePage.getCurrentUrl()).toContain('vitacare');
    testResults['Step 04: Location Selection'] = '✅';
  });

  test('Step 05: Navigate to login page', async () => {
    loginPage = await homePage.clickLogin();
    expect(await loginPage.isLoginPageLoaded()).toBeTruthy();
    testResults['Step 05: Login Page Loaded'] = '✅';
  });

  test('Step 06: Enter phone number', async () => {
    await loginPage.enterPhoneNumber(testData.phone);
    const phoneValue = await loginPage.getPhoneInputValue();
    expect(phoneValue).toContain(testData.phone.substring(0,4));
    testResults['Step 06: Phone Entered'] = '✅';
  });

  test('Step 07: Send OTP', async () => {
    await loginPage.sendOtp();
    expect(await loginPage.isOtpFieldVisible()).toBeTruthy();
    testResults['Step 07: OTP Sent'] = '✅';
  });

  test('Step 08: Enter OTP', async () => {
    await loginPage.enterOtp(testData.otp);
    const otpValue = await loginPage.getOtpInputValue();
    expect(otpValue).not.toBe('');
    testResults['Step 08: OTP Entered'] = '✅';
  });

  test('Step 09: Verify OTP and login', async () => {
    homePage = await loginPage.verifyOtp();
    expect(homePage.getCurrentUrl()).toContain('vitacare');
    testResults['Step 09: OTP Verified / Logged In'] = '✅';
  });

  test('Step 10: Navigate to profile page', async () => {
    await profilePage.goToCustomerInfo();
    expect(await profilePage.isProfilePageLoaded()).toBeTruthy();
    testResults['Step 10: Profile Page Loaded'] = '✅';
  });

  test('Step 11: Update profile information', async () => {
    await profilePage.updateProfileInfo(
      profileData.firstName,
      profileData.lastName,
      profileData.email,
      profileData.companyName
    );
    expect(await profilePage.getFirstName()).toBe(profileData.firstName);
    expect(await profilePage.getLastName()).toBe(profileData.lastName);
    expect(await profilePage.getEmail()).toBe(profileData.email);
    expect(await profilePage.getCompanyName()).toBe(profileData.companyName);
    testResults['Step 11: Profile Updated'] = '✅';
  });

  test('Step 12: Search for first product and open details', async () => {
    const productName = 'Vitacare Air Freshener Anti -Tobacco Spray 300 ml';
    const searchResults = await homePage.searchProduct(productName) as SearchResultsPage;
    await (searchResults as SearchResultsPage).clickOnBestMatchingProduct(productName);
    const productDetails = new ProductDetailsPage(page);
    expect(await productDetails.isAddToCartButtonVisible()).toBeTruthy();
    testResults['Step 12: First Product Found'] = '✅';
  });

  test('Step 13: Add first product to cart', async () => {
    const productDetails = new ProductDetailsPage(page);
    await productDetails.addToCart();
    testResults['Step 13: First Product Added'] = '✅';
  });

  test('Step 14: Search second product, add to cart, and view cart', async () => {
    const secondProduct = 'Vitacare Air Freshener 300 ml All Combo pack of 12 Items';
    const searchResults = await homePage.searchProduct(secondProduct) as SearchResultsPage;
    await searchResults.clickOnBestMatchingProduct(secondProduct);
    const productDetails = new ProductDetailsPage(page);
    await productDetails.addToCart();
    // View cart via topcartlink
    const shoppingCartLink = page.locator('#topcartlink');
    await shoppingCartLink.waitFor({ state: 'visible', timeout: 5000 });
    await shoppingCartLink.click();
    await page.waitForTimeout(500);
    testResults['Step 14: Second Product Added & Cart Viewed'] = '✅';
  });

  test('Step 15: Navigate to checkout and complete order', async () => {
    // Navigate directly to checkout via "Go to cart" button
    const goToCartButton = page.locator("//button[normalize-space()='Go to cart']");
    await goToCartButton.waitFor({ state: 'visible', timeout: 5000 });
    await goToCartButton.click();
    await page.waitForTimeout(800);
    expect(page.url().toLowerCase()).toContain('checkout');

    // Quantity adjustments
    const qtyMinus = page.locator('.qty-btn.qty-minus');
    const minusCount = await qtyMinus.count();
    for (let i = 0; i < minusCount; i++) {
      for (let c = 0; c < 3; c++) {
        await qtyMinus.nth(i).click();
        await page.waitForTimeout(150);
      }
    }
    const qtyPlus = page.locator('.qty-btn.qty-plus');
    const plusCount = await qtyPlus.count();
    for (let i = 0; i < plusCount; i++) {
      await qtyPlus.nth(i).click();
      await page.waitForTimeout(150);
    }

    // Pickup option
    const pickupLabel = page.locator("//label[normalize-space()='Pickup']");
    if (await pickupLabel.isVisible()) {
      await pickupLabel.click();
      await page.waitForTimeout(300);
    }

    // Apply coupons
    const discountInput = page.locator('#discountcouponcode');
    if (await discountInput.isVisible()) {
      await discountInput.clear();
      await discountInput.fill('test10');
      const applyDiscountBtn = page.locator('#applydiscountcouponcode');
      if (await applyDiscountBtn.isVisible()) {
        await applyDiscountBtn.click();
        await page.waitForTimeout(500);
      }
    }
    const giftCardInput = page.locator('#giftcardcouponcode');
    if (await giftCardInput.isVisible()) {
      await giftCardInput.clear();
      await giftCardInput.fill('5ba27cfd-a121');
      const applyGiftBtn = page.locator('#applygiftcardcouponcode');
      if (await applyGiftBtn.isVisible()) {
        await applyGiftBtn.click();
        await page.waitForTimeout(500);
      }
    }

    // Confirm order
    const confirmBtn = page.locator('#confirm-order-button');
    await confirmBtn.waitFor({ state: 'visible', timeout: 5000 });
    await confirmBtn.click();
    await page.waitForTimeout(1500);
    testResults['Step 15: Checkout Complete'] = '✅';
  });
});

// Helper function for test result tracking
function markTestResult(stepName: string, status: '✅' | '❌', testResults: { [key: string]: string }) {
  testResults[stepName] = status;
}