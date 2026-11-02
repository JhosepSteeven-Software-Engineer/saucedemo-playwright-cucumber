import { After, AfterAll, Before, BeforeAll, Status } from '@cucumber/cucumber';
import { selectors } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { env } from '../config/env';
import { CartPage } from '../pages/CartPage';
import { CheckoutCompletePage } from '../pages/CheckoutCompletePage';
import { CheckoutStepOnePage } from '../pages/CheckoutStepOnePage';
import { CheckoutStepTwoPage } from '../pages/CheckoutStepTwoPage';
import { InventoryPage } from '../pages/InventoryPage';
import { LoginPage } from '../pages/LoginPage';
import { closeBrowser, getBrowser } from './browser';
import type { SauceWorld } from './world';

function ensureReportDirectories(): void {
  for (const dir of ['reports', 'reports/traces', 'reports/screenshots']) {
    mkdirSync(dir, { recursive: true });
  }
}

function safeName(value: string): string {
  return value
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}

BeforeAll(async function () {
  ensureReportDirectories();
  selectors.setTestIdAttribute('data-test');
  await getBrowser();
});

Before(async function (this: SauceWorld) {
  this.browser = await getBrowser();
  this.context = await this.browser.newContext({
    baseURL: env.baseUrl,
    viewport: { width: 1366, height: 768 },
  });
  this.context.setDefaultTimeout(env.defaultTimeout);
  this.context.setDefaultNavigationTimeout(env.defaultTimeout);
  this.page = await this.context.newPage();

  await this.context.tracing.start({ screenshots: true, snapshots: true, sources: true });

  this.loginPage = new LoginPage(this.page);
  this.inventoryPage = new InventoryPage(this.page);
  this.cartPage = new CartPage(this.page);
  this.checkoutStepOnePage = new CheckoutStepOnePage(this.page);
  this.checkoutStepTwoPage = new CheckoutStepTwoPage(this.page);
  this.checkoutCompletePage = new CheckoutCompletePage(this.page);
});

After(async function (this: SauceWorld, scenario) {
  const failed = scenario.result?.status === Status.FAILED;
  const artifactName = `${Date.now()}-${safeName(scenario.pickle.name)}`;

  try {
    if (failed) {
      await this.context.tracing.stop({
        path: join('reports', 'traces', `${artifactName}.zip`),
      });

      const screenshot = await this.page.screenshot({ fullPage: true });
      writeFileSync(join('reports', 'screenshots', `${artifactName}.png`), screenshot);
      this.attach(screenshot, 'image/png');
    } else {
      await this.context.tracing.stop();
    }
  } catch (error) {
    console.warn('No se pudieron guardar las evidencias del escenario:', error);
  } finally {
    await this.context.close();
  }
});

AfterAll(async function () {
  await closeBrowser();
});
