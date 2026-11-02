@checkout @regression
Feature: Checkout
  As a Sauce Demo customer
  I want to complete the purchase of my products
  So that I can receive the order confirmation

  Background:
    Given I am logged in as "standard_user"
    And I have added the following products to the cart:
      | Sauce Labs Backpack    |
      | Sauce Labs Bike Light  |

  @smoke
  Scenario: Complete a purchase successfully
    When I open the cart
    And I proceed to checkout
    And I fill the checkout information with:
      | firstName | lastName | postalCode |
      | Jhosep    | Huamani  | 15001      |
    And I continue to the order overview
    Then the order overview should contain:
      | Sauce Labs Backpack    |
      | Sauce Labs Bike Light  |
    And the order total should equal the subtotal plus tax
    When I finish the purchase
    Then I should see the order confirmation

  Scenario: Checkout requires a postal code
    When I open the cart
    And I proceed to checkout
    And I fill the checkout information with:
      | firstName | lastName | postalCode |
      | Jhosep    | Huamani  |            |
    And I continue to the order overview
    Then I should see the checkout error "Error: Postal Code is required"
    And I should remain on the checkout information page
