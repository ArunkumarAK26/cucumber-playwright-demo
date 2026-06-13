import { Given, When, Then, Before, After, setDefaultTimeout } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { ENV } from "../../config/env.config";
import { CustomWorld } from "./world";
import { buildRegisterBody, buildLoginBody, uniqueUsername, uniqueEmail } from "../../helpers/dataHelper";

// ── Timeout ───────────────────────────────────────────────────────────────────
setDefaultTimeout(30_000);

// ── Hooks ─────────────────────────────────────────────────────────────────────
Before({ tags: "@api" }, async function (this: CustomWorld) {
  await this.initApiContext();
});

After({ tags: "@api" }, async function (this: CustomWorld) {
  await this.disposeApiContext();
});

// ── Given Steps ───────────────────────────────────────────────────────────────

Given("the API base URL is configured", function (this: CustomWorld) {
  console.log(`🌐 Running tests against: ${ENV.BASE_URL}`);
  console.log(`🌐 Running tests against: ${ENV.BASE_URL}`);
});

Given(
  "a customer is already registered for tenant {string}",
  async function (this: CustomWorld, tenantKey: string) {
    const username = uniqueUsername();
    const email    = uniqueEmail();
    const password = ENV.TEST_PASSWORD;

    const res = await this.authApiClient.register(
      buildRegisterBody(username, email)
    );

    const body = await res.json();
    await this.attach(JSON.stringify(body, null, 2), "application/json");

    expect(
      res.status(),
      `Precondition failed: registration returned ${res.status()} - ${JSON.stringify(body)}`
    ).toBe(201);

    this.registeredUser = { tenantKey, username, password };
  }
);

// ── When Steps ────────────────────────────────────────────────────────────────

// API-001 — register a new customer
When(
  "I send a POST request to {string} with new customer details for tenant {string}",
  async function (this: CustomWorld, endpoint: string, tenantKey: string) {
    const username = uniqueUsername();
    const email    = uniqueEmail();
    const password = ENV.TEST_PASSWORD;

    this.registeredUser = { tenantKey, username, password };

    const payload = buildRegisterBody(username, email);
    await this.attach(JSON.stringify(payload, null, 2), "application/json");

    this.response = await this.authApiClient.register(payload);
  }
);

// API-002 — duplicate registration
When(
  "I send a POST request to {string} with the same customer details",
  async function (this: CustomWorld, endpoint: string) {
    const { username } = this.registeredUser;
    const email = ENV.TEST_EMAIL;

    const payload = buildRegisterBody(username, email);
    await this.attach(JSON.stringify(payload, null, 2), "application/json");

    this.response = await this.authApiClient.register(payload);
  }
);

// API-003 — valid login
When(
  "I send a POST request to {string} with valid credentials",
  async function (this: CustomWorld, endpoint: string) {
    const { username, password } = this.registeredUser;

    const payload = buildLoginBody(username, password);
    await this.attach(JSON.stringify(payload, null, 2), "application/json");

    this.response = await this.authApiClient.login(payload);
  }
);

// API-004 — invalid password
When(
  "I send a POST request to {string} with an invalid password",
  async function (this: CustomWorld, endpoint: string) {
    const { username } = this.registeredUser;

    const payload = buildLoginBody(username, "WrongPassword!99");
    await this.attach(JSON.stringify(payload, null, 2), "application/json");

    this.response = await this.authApiClient.login(payload);
  }
);

// ── Then Steps ────────────────────────────────────────────────────────────────

Then(
  "the response status code should be {int}",
  async function (this: CustomWorld, expectedStatus: number) {
    const actualStatus = this.response.status();
    await this.attach(
      `Expected: ${expectedStatus} | Actual: ${actualStatus}`,
      "text/plain"
    );
    expect(actualStatus).toBe(expectedStatus);
  }
);

Then(
  "the response body should contain a {string} field",
  async function (this: CustomWorld, fieldName: string) {
    const body = await this.response.json();
    await this.attach(JSON.stringify(body, null, 2), "application/json");
    expect(body, `Expected field "${fieldName}" in response`).toHaveProperty(fieldName);
  }
);

Then(
  "the token value should not be empty",
  async function (this: CustomWorld) {
    const body = await this.response.json();
    const token = body.sessionToken ?? body.token;
    await this.attach(`Token: ${token}`, "text/plain");
    expect(typeof token).toBe("string");
    expect(token.trim().length).toBeGreaterThan(0);
  }
);

// API-001 — password/hash not exposed
Then(
  "the response body should not contain {string}",
  async function (this: CustomWorld, forbiddenField: string) {
    const raw = await this.response.text();
    await this.attach(raw, "application/json");
    expect(raw).not.toContain(`"${forbiddenField}"`);
  }
);

// API-002 — duplicate error
Then(
  "the response body should indicate a duplicate user error",
  async function (this: CustomWorld) {
    const body = await this.response.json();
    await this.attach(JSON.stringify(body, null, 2), "application/json");
    expect(body).toHaveProperty("error");
    expect(body).toHaveProperty("details");
    expect(body.details).toContain("already exists");
  }
);

// API-004 — login rejected
Then(
  "the response body should indicate login was rejected",
  async function (this: CustomWorld) {
    const body = await this.response.json();
    await this.attach(JSON.stringify(body, null, 2), "application/json");
    expect(body).toHaveProperty("error");
    expect(body).toHaveProperty("details");
    expect(body.details).toContain("Invalid username or password");
  }
);