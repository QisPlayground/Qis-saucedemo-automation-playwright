import type { Page, Locator } from '@playwright/test';
import { expect } from "@playwright/test";
import pageurl from '../test-data/page-url.json';

export class LoginPage {
    private readonly usernameBox: Locator;
    private readonly passwordBox: Locator;
    private readonly loginButton: Locator;


    constructor(public readonly page: Page) {
        this.usernameBox = this.page.getByTestId('username');
        this.passwordBox = this.page.getByTestId('password');
        this.loginButton = this.page.getByTestId('login-button');
    }

    async Login(username: string, password: string) {
        await this.page.goto('/');
        await expect(this.page.url()).toEqual(pageurl['login-page']);
        await this.usernameBox.fill(username);
        await this.passwordBox.fill(password);
        await this.loginButton.click();
    }

}