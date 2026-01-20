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
            console.log('Button'+text+'is clicked.')
        }
            
        else {
            console.log('Action'+action+'cannot be done')
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



}





