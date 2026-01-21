import { test, expect, type Page } from '@playwright/test';
import {ProductsPage} from '../POM/products.page';
import { SidebarPage } from '../POM/sidebar.page';
import { CartPage } from '../POM/cart.page';

import pageurl from '../test-data/page-url.json';
import products from '../test-data/products.json';
import {Helper} from '../helper/commands';
import {screenshotOnFailure} from '../helper/screenshotOnFailure';

let helper: Helper;
helper = new Helper();


test.describe('Sidebar tests', () => {
    let productsPage: ProductsPage;
    let sidebarPage: SidebarPage;
    let cartPage: CartPage;

    
    test.beforeEach(async ({ page }) => {        
        productsPage = new ProductsPage(page);
        sidebarPage = new SidebarPage(page);
        cartPage = new CartPage(page);

    });

    test('goto All Items', async ({ page }) => {
        await page.goto(pageurl['cart-page'])
        await sidebarPage.OpenSidebar();
        await sidebarPage.AllItems(page);
    });

    test('goto About', async ({ page }) => {
        await page.goto(pageurl['products-page'])
        await sidebarPage.OpenSidebar();
        await sidebarPage.AboutPage(page);

    });

    test('Reset App State', async ({ page }) => {
        await page.goto(pageurl['products-page'])
        await productsPage.AddSelectedItem(products.onesie);
        const number = await cartPage.GetCartBadgeNumber();
        await expect(number).toBeGreaterThan(0);
        await sidebarPage.OpenSidebar();
        await sidebarPage.ResetAppState();
        await expect(page.getByTestId('shopping-cart-badge')).not.toBeVisible();
    });

    test('Logout', async ({ page }) => {
        await page.goto(pageurl['products-page'])
        await sidebarPage.OpenSidebar();
        await sidebarPage.Logout(page);
    });


    test.afterEach(screenshotOnFailure)

});


