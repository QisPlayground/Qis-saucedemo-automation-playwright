import { test, expect, type Page } from '@playwright/test';

import {ProductsPage} from '../POM/products.page';
import {FormPage1} from '../POM/form1.page';
import { CartPage } from '../POM/cart.page';

import pageurl from '../test-data/page-url.json';
import {Helper} from '../helper/commands';
import {screenshotOnFailure} from '../helper/screenshotOnFailure';

let helper: Helper;
helper = new Helper();


test.describe('Cart tests', () => {
    let productsPage: ProductsPage;
    let cartPage: CartPage;
    let formPage1: FormPage1;

    
    test.beforeEach(async ({ page }) => {        
        productsPage = new ProductsPage(page);
        cartPage = new CartPage(page);
        formPage1 = new FormPage1(page);

    });

    test('Remove item from cart', async ({ page }) => {
        
        // Ensure fully navigated to the app shell
        await page.goto(pageurl['products-page']);

        // Seed one item in cart: product id 4
        await page.evaluate(() => {
            localStorage.setItem('cart-contents', JSON.stringify([4]));
        });

        await page.goto(pageurl['cart-page'])

        await expect(page.getByTestId('inventory-item')).toHaveCount(1);

        const removebutton = await page.getByRole('button', { name: 'Remove' }).first();
        await removebutton.click();

        await expect(page.getByTestId('inventory-item')).toHaveCount(0);

    });

    test('Continue shopping', async ({ page }) => {
        await page.goto(pageurl['cart-page'])
        await cartPage.ContinueShopping();
        await helper.CheckPageUrl(page, pageurl['products-page']);
    });

    test('Checkout', async ({ page }) => {
        await page.goto(pageurl['cart-page'])
        await cartPage.CheckOut();
        await helper.CheckPageUrl(page, pageurl['form-page1']);
    });



    test.afterEach(screenshotOnFailure)

});


