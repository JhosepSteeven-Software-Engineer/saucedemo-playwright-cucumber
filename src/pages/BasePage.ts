import type { Page } from '@playwright/test';

export abstract class BasePage {
  protected constructor(protected readonly page: Page) {}

  async goto(path = '/'): Promise<void> {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
  }

  protected async waitForPath(path: string): Promise<void> {
    await this.page.waitForURL(`**/${path}`);
  }
}
