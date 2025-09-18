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

To remove generated files (reports, test results, traces, videos):
```bash
npm run clean:windows
```

This removes transient artifacts (e.g., `playwright-report/`, `test-results/`, traces, videos) so the repository stays lean.

### Removed Example / Boilerplate Files

The default Playwright scaffold example specs were removed to keep the suite focused:
- `e2e/example.spec.ts`
- `tests-examples/demo-todo-app.spec.ts`

These were Playwright sample/demo tests and not related to VitaCare business flows. If you need the originals again you can regenerate them by running:
```bash
npx playwright init temp-scaffold
```
…and then copy any sample back if desired.

### Regenerating Reports & Artifacts
After a clean, just run:
```bash
npx playwright test
npx playwright show-report
```
Or use the convenience script (includes multi-reporter configuration with HTML, JUnit, JSON, line):
```bash
npm run vitacare
```

### Artifact Locations
- HTML report: `playwright-report/`
- Test run outputs (videos, traces, screenshots): `test-results/`
- JUnit XML: `junit-result.xml` (inside report output or root depending on config)
- JSON summary: `results.json`

These are intentionally ignored by Git and regenerated per run.

## 📊 Reporting & Artifacts

Enhanced reporters are configured (HTML, JUnit XML, JSON, line). Videos are retained on failures; traces captured on first retry. A summary object aggregates pass/fail metrics at suite end.

Run with full artifact capture:
```bash
npm run test:full
```

Open the latest HTML report anytime:
```bash
npx playwright show-report
```

For CI systems you can consume `junit-result.xml` and `results.json` for build annotations and dashboards.

