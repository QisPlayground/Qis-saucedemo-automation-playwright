import { test, expect, type Page } from '@playwright/test';

import {LoginPage} from '../POM/login.page';
import {ProductsPage} from '../POM/products.page';
import {FormPage1} from '../POM/form1.page';
import { FormPage2 } from '../POM/form2.page';
import { CartPage } from '../POM/cart.page';
import { ConfirmPage } from '../POM/confirm.page';

import pageurl from '../test-data/page-url.json';
import sceret from '../mysecret.json';
import products from '../test-data/products.json';
import userinfo from '../test-data/userinfo.json';

import {Helper} from '../helper/commands';
import {screenshotOnFailure} from '../helper/screenshotOnFailure';

let helper: Helper;
helper = new Helper();

const shoppinglist = [products.Tshirt, products.backpack];


test.describe('Shopping workflow', () => {
    let loginPage: LoginPage;
    let productsPage: ProductsPage;
    let cartPage: CartPage;
    let formPage1: FormPage1;
    let formPage2: FormPage2;
    let confirmPage: ConfirmPage;

    const product1 = products.backpack;
  
    test.beforeEach(async ({ page }) => {        
        productsPage = new ProductsPage(page);
        loginPage = new LoginPage(page);
        cartPage = new CartPage(page);
        formPage1 = new FormPage1(page);
        formPage2 = new FormPage2(page);
        confirmPage = new ConfirmPage(page);

        await page.goto(pageurl['products-page']);

    });

    test('Buy one product and pay', async ({ page }) => {
        // expect to login successfully
        await loginPage.Login(sceret.username, sceret.password);
        await helper.CheckPageUrl(page, pageurl['products-page']);

        // select products and add to cart
        await productsPage.CheckProductExist(product1);
        // note down product price on the products page
        const priceLabel1 = await helper.GetItemPriceLabel(page, product1);
        const productPrice1 = await helper.GetItemPrice(priceLabel1);
        await productsPage.AddSelectedItem(product1);

        // go to cart and check
        await cartPage.GotoCart();
        await helper.CheckPageUrl(page, pageurl['cart-page']);
        await expect(await cartPage.CheckProductExistInCart(product1)).toBeTruthy();
        // note down product price in the cart
        const priceLabel2 = await helper.GetItemPriceLabel(page, product1);
        const productPrice2 = await helper.GetItemPrice(priceLabel2);
        await helper.ComparePrice(productPrice1, productPrice2);

        // checkout - fill in form
        await cartPage.CheckOut();
        await helper.CheckPageUrl(page, pageurl['form-page1']);
        await formPage1.FillForm(userinfo['valid-info'].firstName, userinfo['valid-info'].lastName, userinfo['valid-info'].postalCode);
        await formPage1.ContinueForm();
        await helper.CheckPageUrl(page, pageurl['form-page2']);

        // checkout - summary
        await expect(await cartPage.CheckProductExistInCart(product1)).toBeTruthy();
        // // note down product price on the checkout page
        const priceLabel3 = await helper.GetItemPriceLabel(page, product1);
        const productPrice3 = await helper.GetItemPrice(priceLabel3);
        await helper.ComparePrice(productPrice2, productPrice3);

        const totalPrice = await formPage2.GetTotalPrice();
        console.log('Item total price is '+totalPrice);
        // check the total price
        await helper.ComparePrice(productPrice1, totalPrice);
        
        // confirm
        await formPage2.FinishForm();
        await helper.CheckPageUrl(page, pageurl['confirm-page']);
        await confirmPage.VerifyComplete();
        await confirmPage.BackToHome();

    });

    test('Buy several products and pay', async ({ page }) => {
        let total_prices_in_cents = 0;

        // expect to login successfully
        await loginPage.Login(sceret.username, sceret.password);
        await helper.CheckPageUrl(page, pageurl['products-page']);

        const len = shoppinglist.length;

        for (let i=0; i<len; i++) {
            // select products in the shopping list and add to cart
            await productsPage.CheckProductExist(shoppinglist[i]);

            // calculate total price of products
            const priceLabel = await helper.GetItemPriceLabel(page, shoppinglist[i]);
            const price = await helper.GetItemPrice(priceLabel);
            const price_to_cents = Math.round(price*100);
            total_prices_in_cents += price_to_cents; 

            // add products to cart
            await productsPage.AddSelectedItem(shoppinglist[i]);
        }

        const total_prices = total_prices_in_cents / 100;
        console.log('products total price should be '+total_prices)

        // go to cart and check
        await cartPage.GotoCart();
        await helper.CheckPageUrl(page, pageurl['cart-page']);

        // check products are added into the cart
        for (let i=0; i<len; i++) {
            await expect(await cartPage.CheckProductExistInCart(shoppinglist[i])).toBeTruthy();
        }
        
        // checkout - fill in form
        await cartPage.CheckOut();
        await helper.CheckPageUrl(page, pageurl['form-page1']);
        await formPage1.FillForm(userinfo['valid-info'].firstName, userinfo['valid-info'].lastName, userinfo['valid-info'].postalCode);
        await formPage1.ContinueForm();
        await helper.CheckPageUrl(page, pageurl['form-page2']);

        // check products are shown in the summary
        for (let i=0; i<len; i++) {
            await expect(await cartPage.CheckProductExistInCart(shoppinglist[i])).toBeTruthy();
        }

        const totalPrice = await formPage2.GetTotalPrice();
        console.log('Item total price is '+totalPrice);
        await helper.ComparePrice(total_prices, totalPrice);
        
        // confirm
        await formPage2.FinishForm();
        await helper.CheckPageUrl(page, pageurl['confirm-page']);
        await confirmPage.VerifyComplete();
        await confirmPage.BackToHome();
    });

    test.afterEach(screenshotOnFailure)

});


