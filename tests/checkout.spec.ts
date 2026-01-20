import { test, expect, type Page } from '@playwright/test';

import {ProductsPage} from '../POM/products.page';
import {FormPage1} from '../POM/form1.page';
import {FormPage2} from '../POM/form2.page';

import pageurl from '../test-data/page-url.json';
import userinfo from '../test-data/userinfo.json';

import {Helper} from '../helper/commands';
import {screenshotOnFailure} from '../helper/screenshotOnFailure';

let helper: Helper;
helper = new Helper();


test.describe('Checkout tests', () => {
    let productsPage: ProductsPage;
    let formPage1: FormPage1;
    let formPage2: FormPage2;

    
    test.beforeEach(async ({ page }) => {        
        productsPage = new ProductsPage(page);
        formPage1 = new FormPage1(page);
        formPage2 = new FormPage2(page);

    });

    test('Fill form with valid customer info', async ({ page }) => {
        await page.goto(pageurl['form-page1']);
        await formPage1.FillForm(userinfo['valid-info'].firstName, userinfo['valid-info'].lastName, userinfo['valid-info'].postalCode);
        await formPage1.ContinueForm();
        await helper.CheckPageUrl(page, pageurl['form-page2']);

    });

    test('Fill form with missing first name', async ({ page }) => {
        await page.goto(pageurl['form-page1']);
        await formPage1.FillForm('', userinfo['valid-info'].lastName, userinfo['valid-info'].postalCode);
        await formPage1.ContinueForm();
        // page stay in step one 
        await helper.CheckPageUrl(page, pageurl['form-page1']);
        await helper.CheckErrorMessage(page, 'First Name is required');
        
    });

    test('Fill form with missing last name', async ({ page }) => {
        await page.goto(pageurl['form-page1']);
        await formPage1.FillForm(userinfo['valid-info'].firstName, '', userinfo['valid-info'].postalCode);
        await formPage1.ContinueForm();
        // page stay in step one 
        await helper.CheckPageUrl(page, pageurl['form-page1']);
        await helper.CheckErrorMessage(page, 'Last Name is required');
        
    });

    test('Fill form with missing postal code', async ({ page }) => {
        await page.goto(pageurl['form-page1']);
        await formPage1.FillForm(userinfo['valid-info'].firstName, userinfo['valid-info'].lastName, '');
        await formPage1.ContinueForm();
        // page stay in step one 
        await helper.CheckPageUrl(page, pageurl['form-page1']);
        await helper.CheckErrorMessage(page, 'Postal Code is required');
        
    });

    test('Cancel checkout from step 1', async ({ page }) => {
        await page.goto(pageurl['form-page1']);
        await formPage1.BackToCart();
        // page navigate back to cart 
        await helper.CheckPageUrl(page, pageurl['cart-page']);
    });


    test('Cancel checkout from step 2', async ({ page }) => {
        await page.goto(pageurl['form-page2']);
        await formPage2.BackToProductsPage();

    });

    test('Finish Checkout', async ({ page }) => {
        await page.goto(pageurl['form-page2']);
        await formPage2.FinishForm();
    });

    
    test.afterEach(screenshotOnFailure)

});


