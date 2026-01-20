import type { Page, Locator } from '@playwright/test';
import { expect } from "@playwright/test";
import pageurl from '../test-data/page-url.json';

export class SidebarPage {
    private readonly menuButton: Locator;
    private readonly allItems: Locator;
    private readonly about: Locator;
    private readonly logout: Locator;
    private readonly resetAppState: Locator;
    private readonly closeButton: Locator;

    constructor(public readonly page: Page) {
        this.menuButton = this.page.getByRole('button', { name: 'Open Menu' });
        this.allItems = this.page.getByTestId('inventory-sidebar-link');
        this.about = this.page.getByTestId('about-sidebar-link');;
        this.logout = this.page.getByTestId('logout-sidebar-link');
        this.resetAppState = this.page.getByTestId('reset-sidebar-link');
        this.closeButton = this.page.getByRole('button', { name: 'Close Menu' });
    }

    async OpenSidebar() {
        await this.menuButton.click();
        await expect(this.menuButton).not.toBeVisible();
    }

    async Logout() {
        await this.OpenSidebar();
        await this.logout.click();
        await expect(this.page.url).toBe(pageurl['login-page']);
    }

    async CloseSidebar() {
        await expect(this.menuButton).not.toBeVisible();
        await this.closeButton.click();
        await expect(this.closeButton).not.toBeVisible();
    }

    
}