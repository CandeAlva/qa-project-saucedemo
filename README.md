# QA Portfolio — SauceDemo E2E Testing

End-to-end testing suite built with **Playwright + TypeScript**, against
the demo application [SauceDemo](https://www.saucedemo.com), designed as
a portfolio project for QA Analyst / QA Automation roles.

## What this project includes

- **Manual test plan** ([`TEST_CASES.md`](./TEST_CASES.md)): 16 test
  cases designed before automating, with preconditions, steps, expected
  result, and priority — the same process used in a real QA cycle.
- **Automated E2E suite** (`/tests`): the same 16 cases, implemented with
  Playwright, using the **Page Object Model** pattern (`/pages`) to keep
  the code maintainable and decoupled from selectors.
- **Business logic coverage, not just UI**: for example, `TC-CHK-04`
  validates that `Total = Subtotal + Tax`, not just that the screen looks
  right.
- **CI configured** with GitHub Actions (`.github/workflows/playwright.yml`):
  tests run automatically on every push, on Chromium, Firefox, and
  WebKit.

## Modules covered

| Module | Cases | Includes negative cases |
|---|---|---|
| Login | 5 | ✅ (locked-out user, invalid credentials, empty fields) |
| Inventory | 5 | ✅ (price sorting validation) |
| Cart | 2 | ✅ |
| Checkout | 4 | ✅ (required field validation and total consistency) |

See full details of each case in [`TEST_CASES.md`](./TEST_CASES.md).

## How to run the project locally

```bash
# 1. Clone the repository
git clone https://github.com/CandeAlva/qa-project-saucedemo.git
cd qa-project-saucedemo

# 2. Install dependencies
npm install

# 3. Install Playwright browsers
npx playwright install

# 4. Run the whole suite
npm test

# Other useful commands:
npm run test:headed   # run with the browser visible
npm run test:ui       # open Playwright's interactive UI mode
npm run report        # open the latest generated HTML report
```

## Project structure

```
├── pages/                  # Page Objects (LoginPage, InventoryPage, CartPage, CheckoutPage)
├── tests/                  # Playwright specs, organized by module
├── .github/workflows/      # CI pipeline
├── TEST_CASES.md           # Manual test plan with coverage matrix
├── playwright.config.ts    # Configuration (multi-browser, screenshots, traces)
└── package.json
```

## Design decisions

- **Page Object Model**: each screen has its own class with its
  selectors and actions, so a UI change only requires touching one file,
  not every test.
- **Negative cases prioritized alongside happy paths**: half of this
  project's cases are error/validation cases, because in a QA role,
  finding where something breaks matters as much as confirming it works.
- **Traceability**: each automated test references the ID of its manual
  test case (`TC-LOGIN-01`, etc.), making it easy to see what covers
  what.

## About this project

Built as part of my portfolio while transitioning into a QA Analyst /
QA Automation Engineer role. You can see more about my background on
[LinkedIn](https://linkedin.com/in/candela-alvarez94).

---

*SauceDemo is a public demo application created by Sauce Labs
specifically for practicing automated testing. It does not represent a
real product and contains no real user data.*