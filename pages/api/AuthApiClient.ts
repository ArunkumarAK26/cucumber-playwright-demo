import { APIResponse } from "@playwright/test";
import { BaseApiClient } from "./BaseApiClient";

export interface RegisterPayload {
  tenantKey: string;
  tenantName: string;
  fullName: string;
  email: string;
  username: string;
  password: string;
}

export interface LoginPayload {
  tenantKey: string;
  username: string;
  password: string;
}

export class AuthApiClient extends BaseApiClient {

  // API-001 & API-002 — Register
  async register(payload: RegisterPayload): Promise<APIResponse> {
    return await this.context.post(`${this.baseURL}/api/register`, {
      data: payload,
    });
  }

  // API-003 & API-004 — Login
  async login(payload: LoginPayload): Promise<APIResponse> {
    return await this.context.post(`${this.baseURL}/api/login`, {
      data: payload,
    });
  }
}