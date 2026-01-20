import type { Page, Locator } from '@playwright/test';
import { expect } from "@playwright/test";
import pageurl from '../test-data/page-url.json'
import {Helper} from '../helper/commands'

let helper: Helper;
helper = new Helper();

export class CartPage {
    private readonly cartLink: Locator;    
    private readonly continueShoppingButton: Locator;
    private readonly checkoutButton: Locator;
    private readonly cartList: Locator;
    private readonly cartItem: Locator;
    private readonly cartItemName: Locator;
    private readonly cartBadge: Locator;
    private readonly addRemoveButton: Locator;


    constructor(public readonly page: Page) {
        this.cartLink = this.page.getByTestId('shopping-cart-link');
        this.continueShoppingButton = this.page.getByTestId('continue-shopping');
        this.checkoutButton = this.page.getByTestId('checkout');
        this.cartList = this.page.getByTestId('cart-list');
        this.cartItem = this.page.getByTestId('inventory-item');
        this.cartItemName = this.page.getByTestId('inventory-item-name');
        this.cartBadge = this.page.getByTestId('shopping-cart-badge')
        this.addRemoveButton = this.page.locator('button[class*="btn_inventory"]');
    }

    async GotoCart() {
        await this.cartLink.click();
        await expect(this.page.url()).toContain('cart');
    }

    
    async ContinueShopping() {
        await this.continueShoppingButton.click();
        await expect(this.page.url()).toContain(pageurl['products-page'])
    }

    async CheckOut() {
        await this.checkoutButton.click();
        await expect(this.page.url()).toContain(pageurl['form-page1'])
    }
   

    async RemoveSelectedItem(index: number) {
        const amount = await this.cartItem.count();
        if (index < amount){
            const item = await this.cartItem.nth(index);
            const button = await item.locator('button[class*="btn_inventory"]');
            await helper.AddRemoveItem(button, 'Remove')
        }

        else {
            console.log('Index '+index+' is greater than items amount '+amount)
        }
    }

    async CheckProductExistInCart(item_name: string) : Promise<boolean> {      
        const matched = this.cartItemName.filter({ hasText: item_name });
        return (await matched.count()) > 0;

    }

    async GotoProductDetails(item_name: string){       
        await this.cartItemName.filter({ hasText: item_name }).click()
        await helper.CheckPageUrl(this.page, pageurl['products-details-page']);

    }
  
    
}