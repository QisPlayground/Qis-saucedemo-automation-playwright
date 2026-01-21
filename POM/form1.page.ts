import type { Page, Locator } from '@playwright/test';
import { expect } from "@playwright/test";
import pageurl from '../test-data/page-url.json';

export class FormPage1 {
    private readonly firstName: Locator;
    private readonly lastName: Locator;
    private readonly postalCode: Locator;
    private readonly cancelButton: Locator;
    private readonly continueButton: Locator;
    private readonly errorMessageBox: Locator;
    private readonly errorMessage: Locator;
    private readonly clearButton: Locator;


    constructor(public readonly page: Page) {
        this.firstName = this.page.getByTestId('firstName');
        this.lastName = this.page.getByTestId('lastName');
        this.postalCode = this.page.getByTestId('postalCode');
        this.cancelButton = this.page.getByTestId('cancel');
        this.continueButton = this.page.getByTestId('continue')
        this.errorMessageBox = this.page.locator('div[class*="error-message-container"]');
        this.errorMessage = this.page.getByTestId('error');
        this.clearButton = this.page.getByTestId('error-button');
    }

    
    async FillForm(firstName: string, lastName: string, postalCode: string) {
        await this.firstName.fill(firstName);
        await this.lastName.fill(lastName);
        await this.postalCode.fill(postalCode);
    }

    async BackToCart() {
        await this.cancelButton.click();
        await expect(this.page.url()).toContain(pageurl['cart-page']);
    }

    async ContinueForm() {
        await this.continueButton.click();
    }
    
}