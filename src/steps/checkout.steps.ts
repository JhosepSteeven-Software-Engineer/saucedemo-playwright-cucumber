import { Then, When, type DataTable } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import type { SauceWorld } from '../support/world';

When('I proceed to checkout', async function (this: SauceWorld) {
  await this.cartPage.checkout();
});

When(
  'I fill the checkout information with:',
  async function (this: SauceWorld, dataTable: DataTable) {
    const data = dataTable.hashes()[0];

    if (!data) {
      throw new Error('La tabla de datos de checkout esta vacia');
    }

    await this.checkoutStepOnePage.fillInformation(
      data.firstName ?? '',
      data.lastName ?? '',
      data.postalCode ?? '',
    );
  },
);

When('I continue to the order overview', async function (this: SauceWorld) {
  await this.checkoutStepOnePage.continueToOverview();
});

Then('the order overview should contain:', async function (this: SauceWorld, dataTable: DataTable) {
  const expectedProducts = dataTable
    .raw()
    .flat()
    .map((productName) => productName.trim());

  await expect.poll(() => this.checkoutStepTwoPage.getItemNames()).toEqual(expectedProducts);
});

Then('the order total should equal the subtotal plus tax', async function (this: SauceWorld) {
  const [subtotal, tax, total] = await Promise.all([
    this.checkoutStepTwoPage.getSubtotal(),
    this.checkoutStepTwoPage.getTax(),
    this.checkoutStepTwoPage.getTotal(),
  ]);

  expect(total).toBeCloseTo(subtotal + tax, 2);
});

When('I finish the purchase', async function (this: SauceWorld) {
  await this.checkoutStepTwoPage.finish();
});

Then('I should see the order confirmation', async function (this: SauceWorld) {
  await expect(this.page).toHaveURL(/checkout-complete\.html/);
  await expect(this.checkoutCompletePage.completeHeader).toHaveText('Thank you for your order!');
});

Then(
  'I should see the checkout error {string}',
  async function (this: SauceWorld, expectedMessage: string) {
    await expect(this.checkoutStepOnePage.errorMessage).toContainText(expectedMessage);
  },
);

Then('I should remain on the checkout information page', async function (this: SauceWorld) {
  await expect(this.page).toHaveURL(/checkout-step-one\.html/);
});
