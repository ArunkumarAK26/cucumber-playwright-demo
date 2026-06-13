import { APIRequestContext } from "@playwright/test";
import { ENV } from "../../config/env.config";

export class BaseApiClient {
  protected context: APIRequestContext;
  protected baseURL: string;

  constructor(context: APIRequestContext) {
    this.context = context;
    this.baseURL = ENV.BASE_URL;
  }
}