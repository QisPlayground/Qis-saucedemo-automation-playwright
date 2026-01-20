import type { Page, Locator } from '@playwright/test';
import { expect } from "@playwright/test";
import pageurl from '../test-data/page-url.json';



export class FormPage2 {
    private readonly cancelButton: Locator;
    private readonly finishButton: Locator;
    private readonly totalLabel: Locator;
    private readonly paymentInfoValue: Locator;


    constructor(public readonly page: Page) {
        this.cancelButton = this.page.getByTestId('cancel');
        this.finishButton = this.page.getByTestId('finish');
        this.totalLabel = this.page.getByTestId('subtotal-label');
        this.paymentInfoValue = this.page.getByTestId('payment-info-label');
    }


    async BackToCart() {  // same as in form1, move to commands
        await this.cancelButton.click();
        await expect(this.page.url()).toContain(pageurl['cart-page']);
    }

    async FinishForm() {
        await this.finishButton.click();
    }

    async GetTotalPrice(): Promise<number> {
        const priceText = (await this.totalLabel.innerText()).trim();
        const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
        if (Number.isNaN(price)) throw new Error(`Cannot parse price from: "${priceText}"`);
        return price;
    }

    async GetPaymentInfo() {
        const text = (await this.paymentInfoValue.innerText()).trim();
    }
    
}