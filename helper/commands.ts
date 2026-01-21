import { Locator, expect, Page } from "@playwright/test";

export class Helper {
    
    async GetButtonText(selector: Locator): Promise<string>{
        const text = await selector.innerText();
        console.log('Text on the button is: '+text);

        return text;
    }
    
    
    async AddRemoveItem(selector: Locator, action: string) {
        // action can be 'Add to cart' or 'Remove'
        
        const text = await this.GetButtonText(selector);

        if (action == text) {
            await selector.click();
            console.log('Button '+text+' is clicked.');
        }
            
        else {
            console.log('Action cannot be done since item is already '+action);
        }            
    }

    async wait(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
    }

    async CheckPageUrl(page: Page, url: string) {
            await expect(page.url()).toContain(url);
    }

    async CheckErrorMessage(page: Page, error: string) {
            const errorMessageBox: Locator = await page.locator('div[class*="error-message-container"]');
            const errorMessage : Locator = await page.getByTestId('error');
            await expect(errorMessageBox).toBeVisible();
            await expect(errorMessage).toContainText(error)
    }


    async ClearErrorMessage(page: Page) {
            const errorMessageBox: Locator = await page.locator('div[class*="error-message-container"]');
            const clearButton: Locator = await page.getByTestId('error-button');   
            await expect(errorMessageBox).toBeVisible();
            await clearButton.click();
    }

    async GetItemsAmount(page: Page) {   
            const amount = await page.getByTestId('inventory-item').count();
            return amount;
    }


    async GetItemPriceLabel(page: Page, item_name: string): Promise<Locator> {
        const priceLabel = await page.getByTestId('inventory-item').filter({ hasText: item_name }).getByTestId('inventory-item-price');
        return priceLabel;
    }

    async GetItemPrice(selector: Locator): Promise<number> {
        const priceText = (await selector.innerText()).trim();
        console.log('Item price is: '+priceText);
        const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
        if (Number.isNaN(price)) throw new Error(`Cannot parse price from: "${priceText}"`);
        return price;
    }
    
    async CalculateItemsPrices(page: Page): Promise<number> {    
        const items = page.getByTestId('inventory-item');
        const amount = await items.count();
        let total_prices_in_cents = 0;

        for (let i=0; i < amount; i++) {
            console.log(i);
            const item = items.nth(i);
            const item_price_label = await item.getByTestId('inventory-item-price');
            const price = await this.GetItemPrice(item_price_label);
            const price_to_cents = Math.round(price*100);
            
            total_prices_in_cents += price_to_cents;            
        }

        const total_prices = total_prices_in_cents / 100;
        return total_prices;
    }

    async ComparePrice(price1: number, price2: number): Promise <boolean> {
        if (price1 == price2) {
            console.log('prices are the same');
            return true;
        }
        else {
            console.log('prices are the different');
            return false;
        }
    }

    async SeedItemInCart(page: Page, i: number) {        
        await page.evaluate((id) => {
            localStorage.setItem('cart-contents', JSON.stringify([id]));}, i);

    }
    

}





