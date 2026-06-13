import { setWorldConstructor, World, IWorldOptions } from "@cucumber/cucumber";
import { APIRequestContext, APIResponse, request } from "@playwright/test";
import { ENV } from "../../config/env.config";
import { AuthApiClient } from "../../pages/api/AuthApiClient";

export interface RegisteredUser {
  tenantKey: string;
  username: string;
  password: string;
}

export interface ICustomWorld extends World {
  apiContext: APIRequestContext;
  response: APIResponse;
  registeredUser: RegisteredUser;
  authApiClient: AuthApiClient;
}

export class CustomWorld extends World implements ICustomWorld {
  apiContext!: APIRequestContext;
  response!: APIResponse;
  registeredUser!: RegisteredUser;
  authApiClient!: AuthApiClient;

  constructor(options: IWorldOptions) {
    super(options);
  }

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
}

setWorldConstructor(CustomWorld);