import { Given, Then, When, type DataTable } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { getUser } from '../data/users';
import type { SauceWorld } from '../support/world';

Given('I am logged in as {string}', async function (this: SauceWorld, username: string) {
  const user = getUser(username);
  await this.loginPage.goto();
  await this.loginPage.login(user.username, user.password);
  await expect(this.page).toHaveURL(/inventory\.html/);
});

Given(
  'I have added the following products to the cart:',
  async function (this: SauceWorld, dataTable: DataTable) {
    for (const productName of dataTable.raw().flat()) {
      await this.inventoryPage.addProduct(productName.trim());
    }
  },
);

When(
  'I add the product {string} to the cart',
  async function (this: SauceWorld, productName: string) {
    await this.inventoryPage.addProduct(productName);
  },
);

Then('the cart badge should show {int}', async function (this: SauceWorld, expectedCount: number) {
  await expect.poll(() => this.inventoryPage.getCartBadgeCount()).toBe(expectedCount);
});

When('I open the cart', async function (this: SauceWorld) {
  await this.inventoryPage.openCart();
});

Then('the cart should contain:', async function (this: SauceWorld, dataTable: DataTable) {
  const expectedProducts = dataTable
    .raw()
    .flat()
    .map((productName) => productName.trim());

  await expect.poll(() => this.cartPage.getItemNames()).toEqual(expectedProducts);
});

When(
  'I remove the product {string} from the cart',
  async function (this: SauceWorld, productName: string) {
    await this.cartPage.removeProduct(productName);
  },
);

Then('the cart should be empty', async function (this: SauceWorld) {
  await expect.poll(() => this.cartPage.getItemNames()).toHaveLength(0);
});
