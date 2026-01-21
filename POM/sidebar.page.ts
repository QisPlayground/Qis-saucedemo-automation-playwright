import type { Page, Locator } from '@playwright/test';
import { expect } from "@playwright/test";
import pageurl from '../test-data/page-url.json';

import {Helper} from '../helper/commands';

let helper: Helper;
helper = new Helper();

export class SidebarPage {
    private readonly sidebar: Locator;
    private readonly menuButton: Locator;
    private readonly allItems: Locator;
    private readonly about: Locator;
    private readonly logout: Locator;
    private readonly resetAppState: Locator;
    private readonly closeButton: Locator;

    constructor(public readonly page: Page) {
        this.sidebar = this.page.locator('.bm-menu-wrap')
        this.menuButton = this.page.getByRole('button', { name: 'Open Menu' });
        this.allItems = this.page.getByTestId('inventory-sidebar-link');
        this.about = this.page.getByTestId('about-sidebar-link');
        this.logout = this.page.getByTestId('logout-sidebar-link');
        this.resetAppState = this.page.getByTestId('reset-sidebar-link');
        this.closeButton = this.page.getByRole('button', { name: 'Close Menu' });
    }

    async OpenSidebar() {
        await this.menuButton.click();
        await expect(this.sidebar).toBeVisible();
    }

    async AllItems(page: Page) {
        await this.allItems.click();
        await helper.CheckPageUrl(page, pageurl['products-page']);
    }

    async AboutPage(page: Page) {
        await this.about.click();
        await helper.CheckPageUrl(page, pageurl['about-page']);
    }

    async ResetAppState() {
        await this.resetAppState.click();
        await expect(this.page.getByTestId('shopping-cart-badge')).not.toBeVisible();
    }

    async Logout(page: Page) {
        await this.logout.click();
        await helper.CheckPageUrl(page, pageurl['login-page']);
    }

    async CloseSidebar() {
        await expect(this.menuButton).not.toBeVisible();
        await this.closeButton.click();
        await expect(this.closeButton).not.toBeVisible();
    }

    
}