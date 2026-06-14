import { Page, Locator, expect } from "@playwright/test";
import { LoginPageLocators } from "./locators/loginPage.locators";
import { RegisterPageLocators } from "./locators/registerPage.locators";
import { OrderPageLocators } from "./locators/orderPage.locators";

export class LoginPage {
  readonly page: Page;

  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly registerLink: Locator;

  readonly registerUsernameInput: Locator;

  constructor(page: Page) {
    this.page = page;

    this.usernameInput = page.locator(LoginPageLocators.usernameInput);
    this.passwordInput = page.locator(LoginPageLocators.passwordInput);
    this.loginButton   = page.getByRole(
      LoginPageLocators.loginButton.role,
      { name: LoginPageLocators.loginButton.name }
    );
    this.registerLink  = page.locator(LoginPageLocators.registerLink);

    this.registerUsernameInput = page.locator(RegisterPageLocators.usernameInput);
  }

  async goto(): Promise<void> {
    await this.page.goto("/");
  }

  async expectLoginFormVisible(): Promise<void> {
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }

  async expectRegisterFormHidden(): Promise<void> {
    await expect(this.registerUsernameInput).toBeHidden();
  }

  async expectRegisterLinkVisible(): Promise<void> {
    await expect(this.registerLink).toBeVisible();
  }

  // ── New for UI-002 ──────────────────────────────
  async clickRegisterLink(): Promise<void> {
    await this.registerLink.click();
  }

  async expectRegisterFormVisible(): Promise<void> {
    await expect(this.registerUsernameInput).toBeVisible();
  }

  async expectLoginFormHidden(): Promise<void> {
    await expect(this.usernameInput).toBeHidden();
  }

  async fillLoginForm(username: string, password: string): Promise<void> {
  await this.usernameInput.fill(username);
  await this.passwordInput.fill(password);
}

async submitLogin(): Promise<void> {
  await this.loginButton.click();
}

async expectCatalogPageVisible(): Promise<void> {
  await expect(this.page.locator(OrderPageLocators.catalogHeading)).toBeVisible();
}
}