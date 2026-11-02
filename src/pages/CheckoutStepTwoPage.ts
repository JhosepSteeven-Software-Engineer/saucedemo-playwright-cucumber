import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutStepTwoPage extends BasePage {
  readonly finishButton: Locator;
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;

  constructor(page: Page) {
    super(page);
    this.finishButton = page.getByTestId('finish');
    this.subtotalLabel = page.getByTestId('subtotal-label');
    this.taxLabel = page.getByTestId('tax-label');
    this.totalLabel = page.getByTestId('total-label');
  }

  async getItemNames(): Promise<string[]> {
    return this.page.getByTestId('inventory-item-name').allTextContents();
  }

  async getSubtotal(): Promise<number> {
    return this.getMoney(this.subtotalLabel);
  }

  async getTax(): Promise<number> {
    return this.getMoney(this.taxLabel);
  }

  async getTotal(): Promise<number> {
    return this.getMoney(this.totalLabel);
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
    await this.waitForPath('checkout-complete.html');
  }

  private async getMoney(locator: Locator): Promise<number> {
    await locator.waitFor({ state: 'visible' });
    return this.parseMoney(await locator.textContent());
  }

  private parseMoney(value: string | null): number {
    const match = value?.match(/\$([\d.]+)/);

    if (!match) {
      throw new Error(`No se pudo interpretar el valor monetario: ${value}`);
    }

    return Number(match[1]);
  }
}
