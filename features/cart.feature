@cart @regression
Feature: Shopping cart
  As a Sauce Demo customer
  I want to manage the products in my cart
  So that I can review my purchase before paying

  Background:
    Given I am logged in as "standard_user"

  @smoke
  Scenario: Add a single product to the cart
    When I add the product "Sauce Labs Backpack" to the cart
    Then the cart badge should show 1
    And I open the cart
    Then the cart should contain:
      | Sauce Labs Backpack |

  Scenario: Add multiple products to the cart
    When I add the product "Sauce Labs Backpack" to the cart
    And I add the product "Sauce Labs Bike Light" to the cart
    Then the cart badge should show 2
    And I open the cart
    Then the cart should contain:
      | Sauce Labs Backpack    |
      | Sauce Labs Bike Light  |

  Scenario: Remove a product from the cart
    When I add the product "Sauce Labs Backpack" to the cart
    And I open the cart
    And I remove the product "Sauce Labs Backpack" from the cart
    Then the cart should be empty
