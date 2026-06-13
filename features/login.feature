@api @auth
Feature: Auth API - Registration and Login

  @smoke @positive @API-001
  Scenario: Register a new customer for tenant whiteblue
    Given the API base URL is configured
    When I send a POST request to "/api/register" with new customer details for tenant "whiteblue"
    Then the response status code should be 201
    And the response body should contain a "sessionToken" field
    And the token value should not be empty
    And the response body should not contain "password"
    And the response body should not contain "hash"

  @negative @API-002
  Scenario: Duplicate registration for same tenant and username returns 400
    Given the API base URL is configured
    And a customer is already registered for tenant "whiteblue"
    When I send a POST request to "/api/register" with the same customer details
    Then the response status code should be 400
    And the response body should indicate a duplicate user error

  @smoke @positive @API-003
  Scenario: Login with valid credentials returns 200 and session token
    Given the API base URL is configured
    And a customer is already registered for tenant "whiteblue"
    When I send a POST request to "/api/login" with valid credentials
    Then the response status code should be 200
    And the response body should contain a "sessionToken" field
    And the token value should not be empty

  @negative @API-004
  Scenario: Login with invalid password returns 400 and rejection message
    Given the API base URL is configured
    And a customer is already registered for tenant "whiteblue"
    When I send a POST request to "/api/login" with an invalid password
    Then the response status code should be 400
    And the response body should indicate login was rejected
