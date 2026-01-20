import { Locator, expect, Page } from "@playwright/test";

export class Helper {
    
    async GetButtonText(selector: Locator) {
        const text = await selector.innerText()
        console.log('Text on the button is: '+text)

        return text;
    }
    
    
    async AddRemoveItem(selector: Locator, action: string) {
        // action can be 'Add to cart' or 'Remove'
        
        const text = await this.GetButtonText(selector);

        if (action == text) {
            await selector.click();
            console.log('Button '+text+' is clicked.')
        }
            
        else {
            console.log('Action cannot be done since item is already '+action)
        }            
    }

    async wait(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
    }

    async CheckPageUrl(page: Page, url: string) {
            await expect(page.url()).toContain(url)
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
            return amount
    }


    async GetItemPrice(selector: Locator) {
        const priceText = (await selector.innerText()).trim();
        console.log('Item price is: '+priceText)
        const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
        if (Number.isNaN(price)) throw new Error(`Cannot parse price from: "${priceText}"`);
        return price
    }
    
    async CalculateItemsPrices(page: Page) {    
        const items = page.getByTestId('inventory-item')
        const amount = await items.count();
        let total_prices_in_cents = 0;

        for (let i=0; i < amount; i++) {
            console.log(i)
            const item = items.nth(i)
            const item_price_label = await item.getByTestId('inventory-item-price')
            const price = await this.GetItemPrice(item_price_label)
            const price_to_cents = Math.round(price*100)
            
            total_prices_in_cents += price_to_cents;            
        }

        const total_prices = total_prices_in_cents / 100;
        return total_prices
    }


}





