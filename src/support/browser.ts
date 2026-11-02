import { chromium, type Browser } from '@playwright/test';
import { env } from '../config/env';

let browser: Browser | undefined;

export async function getBrowser(): Promise<Browser> {
  if (!browser) {
    browser = await chromium.launch({
      headless: env.headless,
      args: ['--disable-dev-shm-usage'],
    });
  }

  return browser;
}

export async function closeBrowser(): Promise<void> {
  if (browser) {
    await browser.close();
    browser = undefined;
  }
}
