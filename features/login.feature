@login @regression
Feature: Login
  As a Sauce Demo customer
  I want to authenticate in the store
  So that I can access the products and buy them

  @smoke
  Scenario: Login with valid credentials
    Given I am on the login page
    When I log in as "standard_user"
    Then I should see the products page

  Scenario: Login with an invalid password
    Given I am on the login page
    When I log in as "standard_user" with password "wrong_password"
    Then I should see the error "Epic sadface: Username and password do not match any user in this service"
    And I should remain on the login page

  Scenario: Login with a locked out user
    Given I am on the login page
    When I log in as "locked_out_user"
    Then I should see the error "Epic sadface: Sorry, this user has been locked out."
    And I should remain on the login page

  Scenario Outline: Login with empty credentials
    Given I am on the login page
    When I log in as "<username>" with password "<password>"
    Then I should see the error "<message>"

    Examples:
      | username      | password | message                            |
      |               |          | Epic sadface: Username is required |
      | standard_user |          | Epic sadface: Password is required |
