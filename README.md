# 🧪 Automation test for saucedemo shopping website

This repository contains automated end‑to‑end tests for the https://www.saucedemo.com/ sample e‑commerce website provided by Sauce Labs.

SauceDemo simulates a real online shopping experience including login, browsing products, adding items to the cart, and completing a mock checkout.

## ⚙️ Tech Stack

The test framework is built with **TypeScript** using **Microsoft Playwright**.

### Playwright

*Playwright* Test is an end-to-end test framework for modern web apps. It bundles test runner, assertions, isolation, parallelization and rich tooling.

Compare to *Cypress*, *Playwright* has more powerful architecture and broader language support, which fits for multi-tab or multi-domain testing. 

Moreover, we can config a setup as project dependency, to fix the authentication problem.

To use *Playwright*, we need **Playwright Test for VSCode** extension, and install it as below:

`npm init playwright@latest`

## 📁 Project structure

The project has folder structure as below: 

    . 
    ├── helper/ 						# Reusable utility functions 
    ├── POM/ 							# Page Object Model classes 
    ├── tests/ 							# Main test suite 
    ├── test-data/ 						# Input data for tests (e.g., negative cases) 
    ├── .auth/ 							# Auto-generated auth state (ignored) 
    ├── saucedemo.setup.ts 				# Login + auth token generator 
    ├── playwright.config.ts 			# Global test configuration 
    ├── playwright-report/ 				# HTML reports (ignored) 
    ├── test-results/ 					# Screenshots/videos on failure (ignored) 
    └── mysecret.json 					# Local credentials (ignored)


#### playwright.config.ts file

Centralized configuration for browsers, timeouts, test directory, retries, projects, environment variables, and global setup/teardown logic.

#### saucedemo.setup.ts file and .auth folder

* Performs a login before the test suite runs.
* Stores authentication state in *.auth/*.
* Ensures all other tests start in an authenticated session.
* The *mysecret.json* file contains test credentials and **should not be committed**.

#### helper folder

Contains helper utilities used across multiple tests. This avoids code duplication and simplifies maintenance.

#### test-data folder

Stores all test input data, such as invalid credentials or form validation datasets.

Separating test logic from test data makes the suite more scalable and easier to maintain.

#### POM folder

Each webpage has its own POM file containing:

* Locators for page elements
* Actions and methods used in tests

This improves maintainability — if a selector changes, you only update it once.

#### tests folder

Contains the actual test scripts. Each file corresponds to a specific page.

*workflow.spec.ts* covers the complete shopping path from login to pay.

#### playwright-report and test-results folders

* playwright-report/ – HTML reports generated after test runs
* test-results/ – Screenshots or traces when a test fails

Both are ignored in version control.

## 🧭 Test Scenarios

In this project, the tests are organized by related pages.

### Login

- Login using different SauceDemo user types
- Negative tests (missing username/password, invalid credentials)

### Products page

  - Add & Remove product item from product page, and verify in the cart

### Product details page

- Validate product information and back to products page
- Add & Remove the product item from details page, and verify in the cart

### Cart

- Remove product item from the cart and verify (with seeded item in the cart as precondition)
- Back to products page
- Go to checkout

### Checkout

- Fill form with valid user info
- Form validation, negative tests with missing data
- Cancel checkout on step 1
- Cancel checkout on step 2
- Finish checkout

### Sidebar

Test the options in the sidebar menu:
- All Items: navigate to products page
- About: navigate to About page in another domain
- Reset App State: clear the cart
- Logout

### Workflow

The workflow test is the most important part of shopping website. In this test, it should cover not only functionalities but also business concern from a user perspective.

1️⃣ Buy one product and pay

In this test, it simulates a realistic user journey as login, add one item to the cart, fill the form, checkout and confirm. 
In addition, it checks the price consistency accross the products page, the cart, and the checkout summary. 

2️⃣ Buy multiple products and pay

This test is similar as the previous one, but more extendable. 

And it collects the products prices from the products page, calculates the sum, and compares the sum with the total price in the checkout summary, to make sure the user pay correct amount.

## ▶️ How to Run the Tests

Install dependencies: 

`npm install`

Run all tests:

`npx  playwright  test`

Run tests in UI mode: 

`npx playwright test --ui`

> Note: Run it from the project root, so it can show all testing projects with dependencies. 

View the last HTML report:

`npx playwright show-report`

## 📌 Areas for Improvement (Backlog)

- Add additional test scenarios:
    - Product sorting tests
    - More workflow variations
- Improve error handling & custom error messaging
- Add documentation for all test cases

