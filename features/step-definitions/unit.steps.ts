import { Given, When, Then, Before, After, setDefaultTimeout } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { CustomWorld } from "./world";
import { ENV } from "../../config/env.config";

// -- Timeout ------------------------------------------------------------------
setDefaultTimeout(30_000);

// -- Hooks --------------------------------------------------------------------
Before({ tags: "@unit" }, async function (this: CustomWorld) {
  await this.initApiContext();
});

After({ tags: "@unit" }, async function (this: CustomWorld) {
  await this.disposeApiContext();
});

// -- Given Steps --------------------------------------------------------------
Given("the API base URL is configured", function (this: CustomWorld) {
  // ENV.BASE_URL loaded from .env
});

// -- When Steps ---------------------------------------------------------------

// UNIT-001 -- Register with empty body
When(
  "I send a POST request to {string} with an empty body",
  async function (this: CustomWorld, endpoint: string) {
    const payload = {};
    await this.attach(JSON.stringify(payload, null, 2), "application/json");

    this.response = await this.apiContext.post(`${ENV.BASE_URL}${endpoint}`, {
      data: payload,
    });
  }
);

// UNIT-002 -- Login with missing field
When(
  "I send a POST request to {string} with missing {string} field",
  async function (this: CustomWorld, endpoint: string, missingField: string) {
    const fullPayload: Record<string, string> = {
      tenantKey: ENV.TENANT_KEY,
      username: ENV.TEST_USERNAME,
      password: ENV.TEST_PASSWORD,
    };

    delete fullPayload[missingField];

    await this.attach(JSON.stringify(fullPayload, null, 2), "application/json");

    this.response = await this.apiContext.post(`${ENV.BASE_URL}${endpoint}`, {
      data: fullPayload,
    });
  }
);

// UNIT-003 -- GET without any headers
When(
  "I send a GET request to {string} without any headers",
  async function (this: CustomWorld, endpoint: string) {
    this.response = await this.apiContext.get(`${ENV.BASE_URL}${endpoint}`, {
      headers: {},
    });
  }
);

// UNIT-004 -- GET customer with invalid tenantKey
When(
  "I send a GET request to {string}",
  async function (this: CustomWorld, endpoint: string) {
    this.response = await this.apiContext.get(`${ENV.BASE_URL}${endpoint}`);
  }
);

// UNIT-005 -- POST order with empty items array
When(
  "I send a POST request to {string} with empty items array",
  async function (this: CustomWorld, endpoint: string) {
    const payload = {
      items: [],
      paymentToken: "dummy-token",
    };

    await this.attach(JSON.stringify(payload, null, 2), "application/json");

    this.response = await this.apiContext.post(`${ENV.BASE_URL}${endpoint}`, {
      data: payload,
    });
  }
);

// -- Then Steps ---------------------------------------------------------------

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
