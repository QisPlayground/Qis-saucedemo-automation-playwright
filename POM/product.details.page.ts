import type { Page, Locator } from '@playwright/test';
import { expect } from "@playwright/test";
import pageurl from '../test-data/page-url.json'
import {Helper} from '../helper/commands'

let helper: Helper;
helper = new Helper();

export class ProductDetailsPage {
    private readonly backButton: Locator;
    private readonly addRemoveButton: Locator;
    private readonly productName: Locator;
    private readonly productImage: Locator;

    constructor(public readonly page: Page) {
        this.backButton = this.page.getByTestId('back-to-products');
        this.addRemoveButton = this.page.locator('button[class*="btn_inventory"]');
        this.productName = this.page.getByTestId('inventory-item-name');
        this.productImage = this.page.locator('.inventory_details_img');
    }

    
    async BackToProductsPage() {
        await this.backButton.click();
        await expect(this.page.url()).toContain(pageurl['products-page'])
    }

    async AddRemoveProduct(action: string) {
        const button = await this.addRemoveButton;
        await helper.AddRemoveItem(button, action)
    }

    async VerifyProductDetails(item_name: string) {
        await expect(this.productName).toHaveText(item_name);
        await expect(this.productImage).toBeVisible();
        await expect(this.addRemoveButton).toBeVisible();
    }
    
}

