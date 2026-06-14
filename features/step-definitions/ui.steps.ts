import { Given, When, Then, Before, After } from "@cucumber/cucumber";
import { CustomWorld } from "./world";
import { LoginPage } from "../../pages/ui/LoginPage";
import { RegisterPage } from "../../pages/ui/RegisterPage";
import { OrderPage } from "../../pages/ui/OrderPage";
import { uniqueUsername, uniqueEmail } from "../../helpers/dataHelper";
import { ENV } from "../../config/env.config";

// ── Hooks ─────────────────────────────────────────────────────────────────
Before({ tags: "@ui" }, async function (this: CustomWorld) {
  await this.initBrowser();
});

After({ tags: "@ui" }, async function (this: CustomWorld) {
  await this.closeBrowser();
});

// ── Given Steps ───────────────────────────────────────────────────────────
Given("I am on the login page", async function (this: CustomWorld) {
  this.loginPage = new LoginPage(this.page);
  await this.loginPage.goto();
});

// ── When Steps ───────────────────────────────────────────────────────────
When("I click the register link", async function (this: CustomWorld) {
  await this.loginPage.clickRegisterLink();
  this.registerPage = new RegisterPage(this.page);
});

When("I fill the register form with a unique customer", async function (this: CustomWorld) {
  const username = uniqueUsername();
  const email = uniqueEmail();
  const password = ENV.TEST_PASSWORD;

  this.uiRegisteredUser = {
    fullName: ENV.TEST_FULL_NAME,
    email,
    username,
    password,
  };

  await this.registerPage.fillRegisterForm(this.uiRegisteredUser);
});

When("I submit the register form", async function (this: CustomWorld) {
  await this.registerPage.submit();
});

When("I go back to the login page", async function (this: CustomWorld) {
  this.loginPage = new LoginPage(this.page);
  await this.loginPage.goto();
});

When("I log in with the same customer credentials", async function (this: CustomWorld) {
  const { username, password } = this.uiRegisteredUser;
  await this.loginPage.fillLoginForm(username, password);
  await this.loginPage.submitLogin();
});

// ── Then Steps ────────────────────────────────────────────────────────────
Then("the login form should be visible", async function (this: CustomWorld) {
  await this.loginPage.expectLoginFormVisible();
});

Then("the register form should be hidden", async function (this: CustomWorld) {
  await this.loginPage.expectRegisterFormHidden();
});

Then("a link to register should be visible", async function (this: CustomWorld) {
  await this.loginPage.expectRegisterLinkVisible();
});

Then("the register form should be visible", async function (this: CustomWorld) {
  await this.loginPage.expectRegisterFormVisible();
});

Then("the login form should be hidden", async function (this: CustomWorld) {
  await this.loginPage.expectLoginFormHidden();
});

Then("I should be taken to the hardware ordering page", async function (this: CustomWorld) {
  const orderPage = new OrderPage(this.page);
  await orderPage.expectCatalogPageVisible();
});