// Import utils
import testContext from '@utils/testContext';

// Import commonTests
import loginCommon from '@commonTests/BO/loginBO';

// Import pages
// Import BO pages
import productSettingsPage from '@pages/BO/shopParameters/productSettings';

import {expect} from 'chai';
import type {BrowserContext, Page} from 'playwright';
import {
  boDashboardPage,
  dataProducts,
  foClassicHomePage,
  foClassicProductPage,
  utilsPlaywright,
} from '@prestashop-core/ui-testing';

const baseContext: string = 'functional_BO_shopParameters_productSettings_productsStock_labelOfInStockProducts';

describe('BO - Shop Parameters - Product Settings : Update label of in-stock products', async () => {
  let browserContext: BrowserContext;
  let page: Page;

  // before and after functions
  before(async function () {
    browserContext = await utilsPlaywright.createBrowserContext(this.browser);
    page = await utilsPlaywright.newTab(browserContext);
  });

  after(async () => {
    await utilsPlaywright.closeBrowserContext(browserContext);
  });

  it('should login in BO', async function () {
    await loginCommon.loginBO(this, page);
  });

  it('should go to \'Shop parameters > Product Settings\' page', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'goToProductSettingsPage', baseContext);

    await boDashboardPage.goToSubMenu(
      page,
      boDashboardPage.shopParametersParentLink,
      boDashboardPage.productSettingsLink,
    );
    await boDashboardPage.closeSfToolBar(page);

    const pageTitle = await productSettingsPage.getPageTitle(page);
    expect(pageTitle).to.contains(productSettingsPage.pageTitle);
  });
  const tests = [
    {args: {label: 'Product is available', labelToCheck: 'Product is available', exist: true}},
    {args: {label: ' ', labelToCheck: '', exist: false}},
  ];

  tests.forEach((test, index: number) => {
    it(`should set '${test.args.label}' in Label of in-stock products input`, async function () {
      await testContext.addContextItem(this, 'testIdentifier', `updateLabelOfInStockProducts_${index}`, baseContext);

      const result = await productSettingsPage.setLabelOfInStockProducts(page, test.args.label);
      expect(result).to.contains(productSettingsPage.successfulUpdateMessage);
    });

    it('should view my shop', async function () {
      await testContext.addContextItem(this, 'testIdentifier', `viewMySHop_${index}`, baseContext);

      page = await productSettingsPage.viewMyShop(page);

      const isHomePage = await foClassicHomePage.isHomePage(page);
      expect(isHomePage, 'Home page was not opened').to.eq(true);
    });

    it('should go to the first product page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', `goToFirstProductPage_${index}`, baseContext);

      await foClassicHomePage.goToProductPage(page, 1);

      const pageTitle = await foClassicProductPage.getPageTitle(page);
      expect(pageTitle.toUpperCase()).to.contains(dataProducts.demo_1.name.toUpperCase());
    });

    it('should check the label of in-stock product in FO product page', async function () {
      await testContext.addContextItem(this, 'testIdentifier', `checkLabelInStock_${index}`, baseContext);

      const isVisible = await foClassicProductPage.isAvailabilityQuantityDisplayed(page);
      expect(isVisible).to.be.equal(test.args.exist);

      const availabilityLabel = await foClassicProductPage.getProductAvailabilityLabel(page);
      expect(availabilityLabel).to.contains(test.args.labelToCheck);
    });

    it('should go back to BO', async function () {
      await testContext.addContextItem(this, 'testIdentifier', `goBackToBo${index}`, baseContext);

      page = await foClassicProductPage.closePage(browserContext, page, 0);

      const pageTitle = await productSettingsPage.getPageTitle(page);
      expect(pageTitle).to.contains(productSettingsPage.pageTitle);
    });
  });
});
