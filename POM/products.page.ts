import type { Page, Locator } from '@playwright/test';
import { expect } from "@playwright/test";
import {Helper} from '../helper/commands'

let helper: Helper;
helper = new Helper();

export class ProductsPage {
    private readonly inventoryItem: Locator;
    private readonly ItemName: Locator;
    private readonly ItemPrice: Locator;
    private readonly addRemoveButton: Locator;
    private readonly cartLink: Locator;
    private readonly sortingButton: Locator;
    private readonly sortingOptions: Locator;

    constructor(public readonly page: Page) {
/*         this.inventoryItem = this.page.locator('div[data-test="inventory-item"]');
        this.ItemName = this.page.locator('div[data-test="inventory-item-name"]');;
        this.ItemPrice = this.page.locator('div[data-test="inventory-item-price"]');
        this.addButton = this.page.locator('button[class*="btn_inventory"]');
        this.cartLink = this.page.locator('a[data-test="shopping-cart-link"]');
        this.menuButton = this.page.getByRole('button', { name: 'Open Menu' });
        this.sortingButton = this.page.locator('span[class="select_container"]');
        this.sortingOptions = this.page.locator('select[data-test="product-sort-container"]'); */

        this.inventoryItem = this.page.getByTestId('inventory-item');
        this.ItemName = this.page.getByTestId('inventory-item-name');
        this.ItemPrice = this.page.getByTestId('inventory-item-price');
        this.addRemoveButton = this.page.locator('button[class*="btn_inventory"]');
        this.cartLink = this.page.getByTestId('shopping-cart-link');
        this.sortingButton = this.page.locator('span[class="select_container"]');
        this.sortingOptions = this.page.getByTestId('product-sort-container');
    }

    async GotoCart() {
        await this.cartLink.click();
        await expect(this.page.url()).toContain('cart');
    }

    async CheckProductExist(item_name: string) {
        const item = await this.inventoryItem.filter({ hasText: item_name });
        await expect(item).toBeVisible();
        return item
    }

    async ViewSelectedItem(item_name: string) {
        const item = await this.CheckProductExist(item_name);
        await item.locator('.inventory_item_img').click();
        await expect(this.page.url()).toContain('inventory-item.html?id');

    }

    async AddSelectedItem(item_name: string) {
        const item = await this.CheckProductExist(item_name);
        const button = await item.locator('button[class*="btn_inventory"]');
        await helper.AddRemoveItem(button, 'Add to cart')
    }

    async RemoveSelectedItem(item_name: string) {
        const item = await this.CheckProductExist(item_name);
        const button = await item.locator('button[class*="btn_inventory"]');
        await helper.AddRemoveItem(button, 'Remove')
    }

    async SortProducts(option: string) {
        await this.sortingButton.click();
        await this.sortingOptions.getByText(option).click();
    }

    
}