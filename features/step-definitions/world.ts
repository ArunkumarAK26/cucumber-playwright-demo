import { setWorldConstructor, World, IWorldOptions } from "@cucumber/cucumber";
import { APIRequestContext, APIResponse, request, Browser, BrowserContext, Page, chromium } from "@playwright/test";
import { ENV } from "../../config/env.config";
import { AuthApiClient } from "../../pages/api/AuthApiClient";
import { LoginPage } from "../../pages/ui/LoginPage";
import { RegisterPage } from "../../pages/ui/RegisterPage";
import { OrderPage } from "../../pages/ui/OrderPage";

export interface RegisteredUser {
  tenantKey: string;
  username: string;
  password: string;
}

export interface UiRegisteredUser {
  fullName: string;
  email: string;
  username: string;
  password: string;
}

export interface ICustomWorld extends World {
  // ── API properties ─────────────────────────────
  apiContext: APIRequestContext;
  response: APIResponse;
  registeredUser: RegisteredUser;
  authApiClient: AuthApiClient;
  sessionToken: string;

  // ── UI properties ──────────────────────────────
  browser: Browser;
  context: BrowserContext;
  page: Page;
  loginPage: LoginPage;
  registerPage: RegisterPage;

  orderPage: OrderPage;
  uiRegisteredUser: UiRegisteredUser;
}

export class CustomWorld extends World implements ICustomWorld {
  // ── API properties ─────────────────────────────
  apiContext!: APIRequestContext;
  response!: APIResponse;
  registeredUser!: RegisteredUser;
  authApiClient!: AuthApiClient;
  sessionToken!: string;

  // ── UI properties ──────────────────────────────
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;
  loginPage!: LoginPage;
  registerPage!: RegisterPage;
  orderPage!: OrderPage;
  uiRegisteredUser!: UiRegisteredUser;

  constructor(options: IWorldOptions) {
    super(options);
  }

  // ── API context lifecycle ──────────────────────
  async initApiContext(): Promise<void> {
    this.apiContext = await request.newContext({
      baseURL: ENV.BASE_URL,
      extraHTTPHeaders: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    // ── Initialise API Client (POM) ──────────────────
    this.authApiClient = new AuthApiClient(this.apiContext);
  }

  async disposeApiContext(): Promise<void> {
    await this.apiContext?.dispose();
  }

  // ── Browser lifecycle (UI tests) ───────────────
  async initBrowser(): Promise<void> {
const isCI = process.env.CI === "true" || !!process.env.JENKINS_URL;
    this.browser = await chromium.launch({
      headless: isCI ? true : false,
      slowMo: isCI ? 0 : 500,
    });
    this.context = await this.browser.newContext({ baseURL: ENV.BASE_URL });
    this.page = await this.context.newPage();
  }

  async closeBrowser(): Promise<void> {
    await this.page?.close();
    await this.context?.close();
    await this.browser?.close();
  }
}

setWorldConstructor(CustomWorld);