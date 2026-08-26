# Test Plan — SauceDemo

This document details the test cases designed for the
[SauceDemo](https://www.saucedemo.com) application, prior to automation
with Playwright. Each case is identified with the same ID as its
corresponding automated test in `/tests`.

**Environment:** https://www.saucedemo.com
**Available test users:** `standard_user`, `locked_out_user`, `problem_user`, `performance_glitch_user` (password: `secret_sauce` for all)
**Manual Test Plan** https://docs.google.com/spreadsheets/d/1mwWZ2KASddXGxdRd4Xx9a9XsmTq2Dk6v0vliwiZQHgo/edit?usp=sharing
---

## Module: Login

| ID | Test Case | Precondition | Steps | Expected Result | Priority |
|---|---|---|---|---|---|
| TC-LOGIN-01 | Successful login with standard user | On the login screen | 1. Enter `standard_user` / `secret_sauce`. 2. Click Login. | Redirects to `/inventory.html` and the product list is displayed. | High |
| TC-LOGIN-02 | Locked-out user cannot log in | On the login screen | 1. Enter `locked_out_user` / `secret_sauce`. 2. Click Login. | Does not navigate. An error message is shown indicating the user is locked out. | High |
| TC-LOGIN-03 | Incorrect password | On the login screen | 1. Enter `standard_user` / an incorrect password. 2. Click Login. | An invalid credentials error message is shown. | High |
| TC-LOGIN-04 | Empty fields | On the login screen | 1. Leave username and password empty. 2. Click Login. | Error "Username is required" is shown. | Medium |
| TC-LOGIN-05 | Only password left empty | On the login screen | 1. Enter a valid username, leave password empty. 2. Click Login. | Error "Password is required" is shown. | Medium |

## Module: Inventory

| ID | Test Case | Precondition | Steps | Expected Result | Priority |
|---|---|---|---|---|---|
| TC-INV-01 | Adding a product updates the badge | Logged in | 1. Click "Add to cart" on a product. | The cart badge shows "1". | High |
| TC-INV-02 | Removing a product empties the cart | Logged in, product added | 1. Click "Remove" on the added product. | The cart badge disappears. | Medium |
| TC-INV-03 | Badge sums multiple products | Logged in | 1. Add 3 different products. | The badge shows "3". | High |
| TC-INV-04 | Sort by price ascending | Logged in | 1. Select "Price (low to high)". | The price list is sorted from lowest to highest. | Medium |
| TC-INV-05 | Sort by price descending | Logged in | 1. Select "Price (high to low)". | The price list is sorted from highest to lowest. | Medium |

## Module: Cart

| ID | Test Case | Precondition | Steps | Expected Result | Priority |
|---|---|---|---|---|---|
| TC-CART-01 | Added product appears in the cart | Logged in | 1. Add a product. 2. Go to the cart. | The product appears listed with its correct name. | High |
| TC-CART-02 | Empty cart shows no items | Logged in, no products added | 1. Go to the cart. | The item list is empty (0 items). | Low |

## Module: Checkout

| ID | Test Case | Precondition | Steps | Expected Result | Priority |
|---|---|---|---|---|---|
| TC-CHK-01 | Complete purchase with valid data | Products in the cart | 1. Go to checkout. 2. Fill in first name, last name, postal code. 3. Continue. 4. Finish. | The confirmation screen is shown ("Thank you for your order"). | High |
| TC-CHK-02 | Missing first name | Products in the cart, on checkout | 1. Leave "First Name" empty. 2. Fill in the rest. 3. Continue. | Error "First Name is required" is shown. | High |
| TC-CHK-03 | Missing postal code | Products in the cart, on checkout | 1. Leave "Postal Code" empty. 2. Fill in the rest. 3. Continue. | Error "Postal Code is required" is shown. | High |
| TC-CHK-04 | Total consistency (subtotal + tax) | Products in the cart, checkout completed | 1. Fill in checkout data. 2. Review the order summary. | `Total = Subtotal + Tax`, with no rounding difference greater than 0.01. | High (critical business rule) |

---

## Coverage matrix

| Module | Happy path cases | Negative / edge cases | Automated |
|---|---|---|---|
| Login | 1 | 4 | ✅ |
| Inventory | 3 | 2 | ✅ |
| Cart | 1 | 1 | ✅ |
| Checkout | 1 | 3 | ✅ |

**Total: 16 test cases, 100% automated with Playwright.**

## Defects / observations found during test design

> Note: SauceDemo is a demo app intentionally maintained with particular
> behaviors on some users (e.g. `problem_user`, `visual_user`) to serve as
> a practice ground. They are documented here as an example of the
> reporting process, not as real production bugs.

| ID | Description | Steps to Reproduce | Severity | Status |
|---|---|---|---|---|
| BUG-01 | With the `problem_user` account, product images fail to load correctly (all show the same image). | 1. Log in with `problem_user`. 2. View the inventory list. | Medium | Reported (expected behavior of the demo environment) |

## Known limitations / out of scope

SauceDemo is a demo application, not a real e-commerce backend, so
certain edge cases that would be relevant in a production system
couldn't be meaningfully tested here:

- **Negative or zero item quantities**: SauceDemo has no quantity
  selector on the inventory page (each product can only be added once),
  so cases like adding a negative quantity or exceeding available stock
  don't apply.
- **Stock accuracy**: there's no way to verify whether the inventory
  displayed matches real backend stock, since SauceDemo has no visible
  stock count or backend to compare against — this would be a relevant
  test in a real e-commerce system (e.g., checking for overselling when
  stock hits zero).
- **Pricing/tax rule changes over time**: the tax calculation is fixed
  and not configurable, so cases like regional tax rules or currency
  changes aren't testable here.

These are noted to be transparent about scope, not treated as gaps in
this project — they're the kind of cases I'd expect to test on a real
production e-commerce system, where they'd apply.