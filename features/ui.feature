Feature: WhiteBlue UI - Authentication

  @ui @positive @UI-001
  Scenario: Login page is default landing page
    Given I am on the login page
    Then the login form should be visible
    And the register form should be hidden
    And a link to register should be visible

  @ui @positive @UI-002
  Scenario: Click Register link shows register page
    Given I am on the login page
    When I click the register link
    Then the register form should be visible
    And the login form should be hidden

    @ui @positive @UI-003
  Scenario: Register a new customer
    Given I am on the login page
    When I click the register link
    And I fill the register form with a unique customer
    And I submit the register form
    Then I should be taken to the hardware ordering page

  @ui @positive @UI-004
  Scenario: Login with registered customer
    Given I am on the login page
    When I click the register link
    And I fill the register form with a unique customer
    And I submit the register form
    Then I should be taken to the hardware ordering page
    When I go back to the login page
    And I log in with the same customer credentials
    Then I should be taken to the hardware ordering page