import { test, expect, type Page } from '@playwright/test';

import {ProductsPage} from '../POM/products.page';
import { CartPage } from '../POM/cart.page';

import pageurl from '../test-data/page-url.json';
import products from '../test-data/products.json';

import {Helper} from '../helper/commands';
import {screenshotOnFailure} from '../helper/screenshotOnFailure';

let helper: Helper;
helper = new Helper();


test.describe('Products page tests', () => {
    let productsPage: ProductsPage;
    let cartPage: CartPage;

    const product = products.bike_light;

    test.beforeEach(async ({ page }) => {        
        productsPage = new ProductsPage(page);
        cartPage = new CartPage(page);
        await page.goto(pageurl['products-page'])

    });

    test('Add/Remove item to cart', async ({ page }) => {
        await productsPage.CheckProductExist(product);
        await productsPage.AddSelectedItem(product);

        // go to cart and check product exist in the cart
        await cartPage.GotoCart();
        await helper.CheckPageUrl(page, pageurl['cart-page']);
        await expect(await cartPage.CheckProductExistInCart(product)).toBeTruthy();

        // go back to products page
        await page.goto(pageurl['products-page']);
        await productsPage.RemoveSelectedItem(product);

        // go to cart and check product disappear from the cart
        await cartPage.GotoCart();
        await helper.CheckPageUrl(page, pageurl['cart-page']);
        await expect(await cartPage.CheckProductExistInCart(product)).toBeFalsy();

    });

    test('Sorting by name', async ({ page }) => {

    });

    test('Sorting by price', async ({ page }) => {

    });



    test.afterEach(screenshotOnFailure)

});


