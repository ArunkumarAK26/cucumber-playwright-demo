import { Page, Locator } from "@playwright/test";
import { RegisterPageLocators } from "./locators/registerPage.locators";

export interface RegisterFormData {
  fullName: string;
  email: string;
  username: string;
  password: string;
}

export class RegisterPage {
  readonly page: Page;

  readonly fullNameInput: Locator;
  readonly emailInput: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly registerButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.fullNameInput = page.locator(RegisterPageLocators.fullNameInput);
    this.emailInput    = page.locator(RegisterPageLocators.emailInput);
    this.usernameInput = page.locator(RegisterPageLocators.usernameInput);
    this.passwordInput = page.locator(RegisterPageLocators.passwordInput);
    this.registerButton = page.getByRole(
      RegisterPageLocators.registerButton.role,
      { name: RegisterPageLocators.registerButton.name }
    );
  }

  async fillRegisterForm(data: RegisterFormData): Promise<void> {
    await this.fullNameInput.fill(data.fullName);
    await this.emailInput.fill(data.email);
    await this.usernameInput.fill(data.username);
    await this.passwordInput.fill(data.password);
  }

  async submit(): Promise<void> {
    await this.registerButton.click();
  }
}