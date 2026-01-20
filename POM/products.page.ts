import type { Page, Locator } from '@playwright/test';
import { expect } from "@playwright/test";
import {Helper} from '../helper/commands';

let helper: Helper;
helper = new Helper();

export class ProductsPage {
    private readonly inventoryItem: Locator;
    private readonly ItemName: Locator;
    private readonly ItemPrice: Locator;
    private readonly addRemoveButton: Locator;
    private readonly sortingButton: Locator;
    private readonly sortingOptions: Locator;

    constructor(public readonly page: Page) {
        this.inventoryItem = this.page.getByTestId('inventory-item');
        this.ItemName = this.page.getByTestId('inventory-item-name');
        this.ItemPrice = this.page.getByTestId('inventory-item-price');
        this.addRemoveButton = this.page.locator('button[class*="btn_inventory"]');
        
        this.sortingButton = this.page.locator('span[class="select_container"]');
        this.sortingOptions = this.page.getByTestId('product-sort-container');
    }


    async CheckProductExist(item_name: string): Promise<Locator> {
        const item = await this.inventoryItem.filter({ hasText: item_name });
        await expect(item).toBeVisible();
        return item
    }

    async ViewSelectedItem(item_name: string) {
        const item = await this.CheckProductExist(item_name);
        await this.page.getByAltText(item_name).click();
        await expect(this.page.url()).toContain('inventory-item.html?id');

    }

    async AddSelectedItem(item_name: string) {
        const item = await this.CheckProductExist(item_name);
        const button = await item.locator('button[class*="btn_inventory"]');
        await helper.AddRemoveItem(button, 'Add to cart');
    }

    async RemoveSelectedItem(item_name: string) {
        const item = await this.CheckProductExist(item_name);
        const button = await item.locator('button[class*="btn_inventory"]');
        await helper.AddRemoveItem(button, 'Remove');
    }

    async SortProducts(option: string) {
        await this.sortingButton.click();
        await this.sortingOptions.getByText(option).click();
    }

    
}