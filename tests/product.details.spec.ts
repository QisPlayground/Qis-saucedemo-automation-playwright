import { test, expect, type Page } from '@playwright/test';

import {ProductsPage} from '../POM/products.page';
import {ProductDetailsPage} from '../POM/product.details.page';
import { CartPage } from '../POM/cart.page';

import pageurl from '../test-data/page-url.json';
import products from '../test-data/products.json'

import {Helper} from '../helper/commands';
import {screenshotOnFailure} from '../helper/screenshotOnFailure';

let helper: Helper;
helper = new Helper();


test.describe('Product details page tests', () => {
    
    let productsPage: ProductsPage;
    let productDetailsPage: ProductDetailsPage;
    let cartPage: CartPage;

    const selected_product = products.Tshirt
    
    test.beforeEach(async ({ page }) => {        
        
        productsPage = new ProductsPage(page);
        productDetailsPage = new ProductDetailsPage(page);
        cartPage = new CartPage(page);

        await page.goto(pageurl['products-page'])
        //await page.goto('https://www.saucedemo.com/inventory.html')

    });

    test('View product details', async ({ page }) => {
        await productsPage.ViewSelectedItem(selected_product);
        await productDetailsPage.VerifyProductDetails(selected_product);
        await productDetailsPage.BackToProductsPage();
        await helper.CheckPageUrl(page, pageurl['products-page'])
    });

    test('Add/Remove product to cart from product details page', async ({ page }) => {
        await productsPage.ViewSelectedItem(selected_product);
        await helper.CheckPageUrl(page, pageurl['products-details-page']);

        // add product to cart
        await productDetailsPage.AddRemoveProduct('Add to cart');
        await cartPage.GotoCart();
        await expect(await cartPage.CheckProductExistInCart(selected_product)).toBeTruthy();

        // go back to product details page and remove
        await cartPage.GotoProductDetails(selected_product);

        await productDetailsPage.AddRemoveProduct('Remove');
        await cartPage.GotoCart();
        await expect(await cartPage.CheckProductExistInCart(selected_product)).toBeFalsy();

    });

    test.afterEach(screenshotOnFailure)

});


