import { Page, Locator, expect } from "@playwright/test";
import { OrderPageLocators } from "./locators/orderPage.locators";

export class OrderPage {
  readonly page: Page;
  readonly catalogHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.catalogHeading = page.locator(OrderPageLocators.catalogHeading);
  }

  async expectCatalogPageVisible(): Promise<void> {
    await expect(this.catalogHeading).toBeVisible();
  }
}