import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { getUser } from '../data/users';
import type { SauceWorld } from '../support/world';

Given('I am on the login page', async function (this: SauceWorld) {
  await this.loginPage.goto();
  await expect(this.page).toHaveURL(/saucedemo\.com\/?$/);
});

When('I log in as {string}', async function (this: SauceWorld, username: string) {
  const user = getUser(username);
  await this.loginPage.login(user.username, user.password);
});

When(
  'I log in as {string} with password {string}',
  async function (this: SauceWorld, username: string, password: string) {
    await this.loginPage.login(username, password);
  },
);

Then('I should see the products page', async function (this: SauceWorld) {
  await expect(this.page).toHaveURL(/inventory\.html/);
  await expect(this.inventoryPage.pageTitle).toHaveText('Products');
});

Then('I should see the error {string}', async function (this: SauceWorld, expectedMessage: string) {
  await expect(this.loginPage.errorMessage).toContainText(expectedMessage);
});

Then('I should remain on the login page', async function (this: SauceWorld) {
  await expect(this.page).toHaveURL(/saucedemo\.com\/?$/);
});
