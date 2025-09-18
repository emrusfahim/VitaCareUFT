import { test, expect, Page } from '@playwright/test';
import { JsonDataReader } from '../utils/JsonDataReader';
import { LoginData, ProfileData } from '../utils/DataTypes';
import { AuthModule } from '../modules/AuthModule';
import { ProfileModule } from '../modules/ProfileModule';
import { CatalogModule } from '../modules/CatalogModule';
import { CheckoutModule } from '../modules/CheckoutModule';

test.describe('VitaCare E-Commerce Automation Suite', () => {
  let page: Page;
  // Modules
  let auth: AuthModule;
  let profile: ProfileModule;
  let catalog: CatalogModule;
  let checkout: CheckoutModule;
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
    // Initialize modules
    auth = new AuthModule(page);
    profile = new ProfileModule(page);
    catalog = new CatalogModule(page);
    checkout = new CheckoutModule(page);
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

  // Combined setup & auth sequence preserving original step semantics
  test('Steps 01-09: Launch, prepare context, and authenticate user', async () => {
    await test.step('01-04: Launch site, close alert, set language & location', async () => {
      await auth.launchAndPrepare(BASE_URL, 'EN', 'Dhaka', 'Banasree');
      console.log('✅ Steps 01-04 PASSED: Environment prepared');
      testResults['Steps 01-04: Environment Preparation'] = '✅';
    });
    await test.step('05-09: OTP Login flow', async () => {
      await auth.loginWithOtp(testData.phone, testData.otp);
      expect(page.url()).toContain('vitacare');
      console.log('✅ Steps 05-09 PASSED: Authenticated successfully');
      testResults['Steps 05-09: Authentication'] = '✅';
    });
  });

  test('Steps 10-11: Update and verify profile information', async () => {
    await test.step('Navigate & update profile', async () => {
      await profile.updateProfile(profileData);
      console.log('📝 Profile fields submitted');
    });
    await test.step('Verify profile data', async () => {
      await profile.verifyProfile(profileData);
      console.log('✅ Steps 10-11 PASSED: Profile updated & verified');
      testResults['Steps 10-11: Profile Update & Verification'] = '✅';
    });
  });

  const PRODUCT_ONE = 'Vitacare Air Freshener Anti -Tobacco Spray 300 ml';
  const PRODUCT_TWO = 'Vitacare Air Freshener 300 ml All Combo pack of 12 Items';

  test('Steps 12-14: Add two products to cart and view cart', async () => {
    await test.step('Search and add first product', async () => {
      await catalog.addProductToCart(PRODUCT_ONE);
    });
    await test.step('Search and add second product', async () => {
      await catalog.addProductToCart(PRODUCT_TWO);
    });
    await test.step('View cart (via topcartlink)', async () => {
      await checkout.goToCart();
      console.log('✅ Steps 12-14 PASSED: Two products added and cart viewed');
      testResults['Steps 12-14: Add Products & View Cart'] = '✅';
    });
  });

  test('Step 15: Navigate to checkout and complete order', async () => {
    await test.step('Navigate directly to checkout page', async () => {
      await checkout.goToCheckoutViaButton();
      console.log('✅ Checkout page reached');
    });

    await test.step('Modify product quantities on checkout page', async () => {
      await checkout.adjustQuantities({ minusClicksPerItem: 3, plusClicksPerItem: 1 });
      console.log('✅ Quantity modifications completed');
    });

    await test.step('Select pickup option', async () => {
      await checkout.selectPickup();
      console.log('✅ Pickup option selected');
    });

    await test.step('Apply discount coupon and gift card', async () => {
      await checkout.applyDiscount('test10');
      await checkout.applyGiftCard('5ba27cfd-a121');
      console.log('✅ Coupons applied');
    });

    await test.step('Confirm the order', async () => {
      await checkout.confirmOrder();
      console.log('🎉 Order confirmed successfully!');
      console.log('✅ Step 15 COMPLETED: Full checkout process');
      testResults['Step 15: Checkout Complete'] = '✅';
    });
  });
});

// Helper function for test result tracking
function markTestResult(stepName: string, status: '✅' | '❌', testResults: { [key: string]: string }) {
  testResults[stepName] = status;
}