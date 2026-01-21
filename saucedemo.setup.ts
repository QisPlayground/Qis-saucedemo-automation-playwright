import { test, expect } from "@playwright/test";
import {LoginPage} from './POM/login.page';
import pageurl from './test-data/page-url.json';
import sceret from './mysecret.json'

const authFile = "./.auth/standard-user-auth.json";

test("Login", async ({ page }) => {

    let login_page;

    login_page = new LoginPage(page);

    await login_page.Login(sceret.username, sceret.password);

    await page.waitForURL(pageurl["products-page"])

    // Save the state of the webpage - meaning we are logged in
    await page.context().storageState({ path: authFile });
});