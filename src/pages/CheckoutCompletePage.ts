import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutCompletePage extends BasePage {
  readonly completeHeader: Locator;

  constructor(page: Page) {
    super(page);
    this.completeHeader = page.getByTestId('complete-header');
  }

  async getConfirmationText(): Promise<string> {
    return (await this.completeHeader.textContent())?.trim() ?? '';
  }
}
