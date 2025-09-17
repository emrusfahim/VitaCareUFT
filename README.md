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
- For Allure report rendering, ensure Java is available on PATH (Allure CLI requires Java). If not, install Java 8+.# VitaCareUFT
# VitaCareUFT
