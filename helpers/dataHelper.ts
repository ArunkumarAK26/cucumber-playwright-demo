import { ENV } from "../config/env.config";
import { RegisterPayload } from "../pages/api/AuthApiClient";

// ── Username & Email Generators ───────────────────────────────────────────────
export function uniqueUsername(): string {
  return `${ENV.TEST_USERNAME}_${Date.now()}`;
}

export function uniqueEmail(): string {
  const [base, domain] = ENV.TEST_EMAIL.split("@");
  return `${base}_${Date.now()}@${domain}`;
}

// ── Request Body Builders ─────────────────────────────────────────────────────
export function buildRegisterBody(
  username: string,
  email: string
): RegisterPayload {
  return {
    tenantKey:  ENV.TENANT_KEY,
    tenantName: ENV.TENANT_NAME,
    fullName:   ENV.TEST_FULL_NAME,
    email:      email,
    username:   username,
    password:   ENV.TEST_PASSWORD,
  };
}

export function buildLoginBody(
  username: string,
  password: string
) {
  return {
    tenantKey: ENV.TENANT_KEY,
    username:  username,
    password:  password,
  };
}