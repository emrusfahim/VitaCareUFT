# VitaCare Playwright TypeScript Test Automation

This project has been converted from a Maven-based Java Selenium JUnit test project to a modern Playwright TypeScript test automation framework.

## Project Structure

```
├── pages/                     # Page Object Model classes
│   ├── BasePage.ts           # Base page with common functionality
│   ├── HomePage.ts           # Homepage page object
│   ├── LoginPage.ts          # Login page object
│   ├── CustomerProfilePage.ts # Customer profile page object
│   ├── SearchResultsPage.ts  # Search results page object
│   └── ProductDetailsPage.ts # Product details page object
├── tests/                    # Test files
│   └── vitacare-step-by-step.spec.ts # Main test suite
├── utils/                    # Utility classes and helpers
│   ├── DataTypes.ts          # TypeScript interfaces for data
│   └── JsonDataReader.ts     # JSON data reading utility
├── testdata/                 # Test data files
│   ├── login-data.json       # Login test data
│   └── profile-data.json     # Profile test data
├── playwright.config.ts      # Playwright configuration
├── package.json              # Node.js dependencies and scripts
└── tsconfig.json             # TypeScript configuration
```

## Features

- **Page Object Model**: Clean separation of page logic and test logic
- **TypeScript**: Strong typing for better code maintainability
- **Playwright**: Modern browser automation with excellent debugging capabilities
- **HTML Reporting**: Rich default Playwright HTML reports with screenshots and test details
- **Cross-Browser Testing**: Support for Chromium, Firefox, and WebKit
- **JSON Test Data**: External data files for easy test data management

## Setup and Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Install Playwright browsers:**
   ```bash
   npm run install:browsers
   ```

## Running Tests

### Basic Test Execution
```bash
# Run all tests
npm test

# Run tests in headed mode (with browser UI)
npm run test:headed

# Run tests in debug mode
npm run test:debug

# Run tests with Playwright UI mode
npm run test:ui

# Run tests only on Chromium
npm run test:chromium
```

### With HTML Reporting
```bash
# Run tests and show HTML report
npm run test:report

# Show last generated report
npm run show-report
```

This will:
1. Execute all tests
2. Automatically open the Playwright HTML report in your browser

## Test Steps Covered

The test suite covers the complete VitaCare workflow:

1. **Step 01**: Open homepage
2. **Step 02**: Close alert notification if present
3. **Step 03**: Select English language
4. **Step 04**: Select Dhaka / Banasree location
5. **Step 05**: Navigate to login page
6. **Step 06**: Enter phone number
7. **Step 07**: Send OTP
8. **Step 08**: Enter OTP
9. **Step 09**: Verify OTP and login
10. **Step 10**: Navigate to profile page
11. **Step 11**: Update profile information
12. **Step 12**: Search for product and verify its presence
13. **Step 13**: Verify product details page

## Configuration

### Test Data
Test data is stored in JSON files under `testdata/`:
- `login-data.json`: Contains phone number and OTP
- `profile-data.json`: Contains profile information for updates

### Playwright Configuration
Key configuration in `playwright.config.ts`:
- Base URL: `https://vitacare.nop-station.com/`
- Browsers: Chromium, Firefox, WebKit
- Timeouts: 30 seconds for actions and navigation
- Reporting: Default Playwright HTML reports
- Screenshots and videos on failure

## Differences from Original Java/Selenium Project

### Improvements
- **Modern Tooling**: Playwright offers better debugging, auto-waiting, and built-in assertions
- **TypeScript**: Better IDE support, compile-time error checking, and refactoring
- **Simplified Setup**: No need for WebDriverManager or manual driver management
- **Better Reporting**: Rich HTML reports with automatic screenshot capture
- **Cross-Browser**: Easy testing across multiple browsers

### Migration Details
- **JUnit → Playwright Test**: Test framework conversion with proper step organization
- **Selenium WebDriver → Playwright**: Modern browser automation with auto-waiting
- **Java Page Objects → TypeScript Page Objects**: Converted all page classes with proper typing
- **Maven → npm**: Modern Node.js package management
- **Java Assertions → Playwright Expect**: More readable and powerful assertions

## Troubleshooting

### Common Issues
1. **Browser not installed**: Run `npm run install:browsers`
2. **Test data not found**: Ensure JSON files are in the `testdata/` directory
3. **Timeout errors**: Check network connectivity and increase timeouts if needed

### Debug Mode
Use debug mode for step-by-step test execution:
```bash
npm run test:debug
```

This opens the Playwright Inspector for interactive debugging.

## Maintenance

- Update test data in JSON files as needed
- Add new page objects following the existing pattern
- Extend tests by adding new steps to the spec file
- Update locators in page objects if the application changes

## Clean Up

To remove generated files:
```bash
npm run clean
```

This removes test results, reports, and other generated directories.

## 📊 Default Playwright HTML Reports

The project uses Playwright's built-in HTML reporting which provides:
- **Rich test results** with screenshots and videos
- **Timeline view** showing test execution flow  
- **Error details** with stack traces and screenshots
- **Test artifacts** (videos, traces, screenshots) embedded
- **Filtering and search** capabilities
- **Automatic browser opening** after test completion

The HTML report will automatically open in your browser after running `npm run test:report` or can be viewed anytime with `npm run show-report`.
=======
# VitaCare Playwright (TypeScript)

This project is a Playwright + TypeScript test automation project for VitaCare e-commerce website.

## Project structure

- `pages/` — Playwright Page Objects for UI interactions
- `tests/` — Playwright test files 
- `data/` — Test data JSON files (login, profile data)
- `playwright.config.ts` — Playwright configuration with HTML reporter
- `package.json` — Scripts and dependencies
- `tsconfig.json` — TypeScript configuration

## Test Coverage

The main test (`vitacare.spec.ts`) covers:
1. **Onboarding**: Homepage navigation, language selection, location setup
2. **Authentication**: Login via OTP
3. **Profile Management**: Update customer profile information
4. **Product Flow**: Search product, verify details, modify quantity, add to cart

## Install and run (Windows PowerShell)

If you see an execution policy error when running npm, you have two options:
- Start PowerShell as Administrator and run: `Set-ExecutionPolicy -Scope CurrentUser Bypass`
- Or use the PowerShell flag per command: `powershell -ExecutionPolicy Bypass -Command "npm i"`

Steps:

1. Install dependencies

```powershell
# Option A: Regular (if policy allows)
npm install

# Option B: With policy bypass
powershell -ExecutionPolicy Bypass -Command "npm install"
```

2. Install Playwright browsers (one-time)

```powershell
npx playwright install
```

3. Run tests

```powershell
# Run tests headlessly
npx playwright test

# Run tests with browser visible
npx playwright test --headed

# Run specific test file
npx playwright test tests/vitacare.spec.ts

# Open HTML report after test run
npx playwright show-report

# Run tests and automatically open report
npm run test:report
```

## Video Recording

Tests automatically record full-screen videos when running with browser visible. Videos are saved in WebM format in the `test-results` directory for each test run.

## Notes

- Tests are executed in a single serial spec using `test.step(...)` to preserve the original JUnit test order and semantics.
- All locators were extracted and mapped from the original Java Page Objects:
  - HomePage: `#close-push-notification`, `#customerlanguage`, `#login-link`, `a.ico-logout`, select2 containers, search input
  - LoginPage: `#otp_login_Phone`, `#btnOtpSendPopup`, `#otp_login_Otp`, `#btnVerifyOtpPopup`
  - CustomerProfilePage: menu + form inputs and save button
  - SearchResultsPage: `.product-title`
  - ProductDetailsPage: `#main .product-name h1`
- Test data is read from `data/login-data.json` and `data/profile-data.json`.

## Removing old Java/Maven files

A convenience script exists to clean legacy artifacts:

```powershell
npm run clean
```

If preferred, you can also delete these manually in the IDE: `pom.xml`, `src/`, and `target/`.

## Troubleshooting

- If TypeScript shows missing types for Node or Playwright, ensure `npm install` completed successfully and `@types/node` and `@playwright/test` are installed.
- For Allure report rendering, ensure Java is available on PATH (Allure CLI requires Java). If not, install Java 8+.
