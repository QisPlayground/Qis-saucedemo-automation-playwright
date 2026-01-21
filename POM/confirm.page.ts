import type { Page, Locator } from '@playwright/test';
import { expect } from "@playwright/test";
import pageurl from '../test-data/page-url.json';



export class ConfirmPage {
    private readonly title: Locator;
    private readonly backButton: Locator;
    private readonly completeHeader: Locator;


    constructor(public readonly page: Page) {
        this.title = this.page.getByTestId('title');
        this.backButton = this.page.getByTestId('back-to-products');
        this.completeHeader = this.page.getByTestId('complete-header');
    }


    async BackToHome() {  // same as in form1, move to commands
        await this.backButton.click();
        await expect(this.page.url()).toContain(pageurl['products-page']);
    }

    async VerifyComplete() {
        await expect(this.title).toHaveText('Checkout: Complete!');
        await expect(this.completeHeader).toHaveText('Thank you for your order!');
    }
    
}