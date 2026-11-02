import {
  World,
  setDefaultTimeout,
  setWorldConstructor,
  type IWorldOptions,
} from '@cucumber/cucumber';
import type { Browser, BrowserContext, Page } from '@playwright/test';
import { CartPage } from '../pages/CartPage';
import { CheckoutCompletePage } from '../pages/CheckoutCompletePage';
import { CheckoutStepOnePage } from '../pages/CheckoutStepOnePage';
import { CheckoutStepTwoPage } from '../pages/CheckoutStepTwoPage';
import { InventoryPage } from '../pages/InventoryPage';
import { LoginPage } from '../pages/LoginPage';

export class SauceWorld extends World {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;
  loginPage!: LoginPage;
  inventoryPage!: InventoryPage;
  cartPage!: CartPage;
  checkoutStepOnePage!: CheckoutStepOnePage;
  checkoutStepTwoPage!: CheckoutStepTwoPage;
  checkoutCompletePage!: CheckoutCompletePage;

  constructor(options: IWorldOptions) {
    super(options);
  }
}

setDefaultTimeout(30000);
setWorldConstructor(SauceWorld);
