// Import FO pages
import {GDPRPersonalDataPage} from '@pages/FO/classic/myAccount/gdprPersonalData';

/**
 * @class
 * @extends FOBasePage
 */
class GDPRPersonalData extends GDPRPersonalDataPage {
  /**
   * @constructs
   * Setting up texts and selectors to use on GDPR personal data page
   */
  constructor() {
    super('hummingbird');

    // Selectors
    this.contactUsHyperLink = 'section.page-content a[href*=\'contact-us\']';
  }
}

export default new GDPRPersonalData();
