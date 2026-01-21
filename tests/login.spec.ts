import { test} from '@playwright/test';
import {LoginPage} from '../POM/login.page';
import pageurl from '../test-data/page-url.json';
import users from '../test-data/users.json';
import invalid_password from '../test-data/invalid-passwords.json';
import sceret from '../mysecret.json'
import {Helper} from '../helper/commands';
import {screenshotOnFailure} from '../helper/screenshotOnFailure';

let helper: Helper;
helper = new Helper();


test.describe('Login tests', () => {
    let loginPage: LoginPage;
    //const password = process.env.AADPASSWORD as string;
    const password = sceret.password;
    
    test.beforeEach(async ({ page }) => {        
        loginPage = new LoginPage(page);
    });

    test('Login with standard_user', async ({ page }) => {
        // expect to login successfully
        await loginPage.Login(users.standard_user, password);
        await helper.CheckPageUrl(page, pageurl['products-page'])
        await page.waitForURL(pageurl["products-page"])

    });

    test('Login with locked_out_user', async ({ page }) => {
        // expect error box to show up with message
        await loginPage.Login(users.locked_out_user, password);
        await helper.CheckErrorMessage(page, 'this user has been locked out')
        await helper.ClearErrorMessage(page)
    });

    test('Login with problem_user', async ({ page }) => {
        // login successfully
        await loginPage.Login(users.problem_user, password);
        await helper.CheckPageUrl(page, pageurl['products-page'])
    });

    test('Login with performance_glitch_user', async ({ page }) => {
        // slow response
        await loginPage.Login(users.performance_glitch_user, password);
        await helper.CheckPageUrl(page, pageurl['products-page'])
    });

    test('Login with error_user', async ({ page }) => {
        // login successfuly
        await loginPage.Login(users.error_user, password);
        await helper.CheckPageUrl(page, pageurl['products-page'])
    });

    test('Login with visual_user', async ({ page }) => {
        // login successfuly
        await loginPage.Login(users.visual_user, password);
        await helper.CheckPageUrl(page, pageurl['products-page'])
    });

    test('Login with non_exist_user', async ({ page }) => {
        // expect error message
        await loginPage.Login(users.non_exist_user, password);
        await helper.CheckErrorMessage(page, 'Username and password do not match')
        await helper.ClearErrorMessage(page)
    });

    test('Login standard_user with wrong password', async ({ page }) => {
        // expect error message
        await loginPage.Login(users.standard_user, invalid_password.digitals);
        await helper.CheckErrorMessage(page, 'Username and password do not match')
        await helper.ClearErrorMessage(page)
    });

    test('Login without username', async ({ page }) => {
        // expect error message
        await loginPage.Login('', password);
        await helper.CheckErrorMessage(page, 'Username is required')
        await helper.ClearErrorMessage(page)
    });

    test('Login standard_user without password', async ({ page }) => {
        // expect error message
        await loginPage.Login(users.standard_user, '');
        await helper.CheckErrorMessage(page, 'Password is required')
        await helper.ClearErrorMessage(page)
    });

    test.afterEach(screenshotOnFailure)

});


