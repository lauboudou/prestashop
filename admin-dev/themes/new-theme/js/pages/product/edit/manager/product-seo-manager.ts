/**
 * Copyright since 2007 PrestaShop SA and Contributors
 * PrestaShop is an International Registered Trademark & Property of PrestaShop SA
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Open Software License (OSL 3.0)
 * that is bundled with this package in the file LICENSE.md.
 * It is also available through the world-wide-web at this URL:
 * https://opensource.org/licenses/OSL-3.0
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to license@prestashop.com so we can send you a copy immediately.
 *
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade PrestaShop to newer
 * versions in the future. If you wish to customize PrestaShop for your
 * needs please refer to https://devdocs.prestashop.com/ for more information.
 *
 * @author    PrestaShop SA and Contributors <contact@prestashop.com>
 * @copyright Since 2007 PrestaShop SA and Contributors
 * @license   https://opensource.org/licenses/OSL-3.0 Open Software License (OSL 3.0)
 */
import Serp from '@app/utils/serp';
import {EventEmitter} from 'events';
import RedirectOptionManager from '@pages/product/edit/manager/redirect-option-manager';
import ProductMap from '@pages/product/product-map';
import TranslatableInput from '@components/translatable-input';

const {$} = window;

export default class ProductSEOManager {
  eventEmitter: EventEmitter;

  $previewButton: JQuery;

  translatableInput: TranslatableInput;

  /**
   * @param {EventEmitter} eventEmitter
   *
   * @returns {{}}
   */
  constructor(eventEmitter: EventEmitter) {
    this.eventEmitter = eventEmitter;
    this.$previewButton = $(ProductMap.footer.previewUrlButton);
    this.translatableInput = window.prestashop.instance.translatableInput;

    this.init();
  }

  /**
   * @private
   */
  private init(): void {
    // Init the product/category search field for redirection target
    new RedirectOptionManager(this.eventEmitter);

    // Init Serp component to preview Search engine display
    const {translatableField} = window.prestashop.instance;
    let previewUrl = this.$previewButton.data('seoUrl');

    if (!previewUrl) {
      previewUrl = '';
    }

    new Serp(
      {
        container: ProductMap.seo.container,
        defaultTitle: ProductMap.seo.defaultTitle,
        watchedTitle: ProductMap.seo.watchedTitle,
        defaultDescription: ProductMap.seo.defaultDescription,
        watchedDescription: ProductMap.seo.watchedDescription,
        watchedMetaUrl: ProductMap.seo.watchedMetaUrl,
        multiLanguageInput: `${this.translatableInput.localeInputSelector}:not(.d-none)`,
        multiLanguageField: `${translatableField.translationFieldSelector}.active`,
      },
      previewUrl,
    );

    new window.prestashop.component.TaggableField({
      tokenFieldSelector: ProductMap.seo.tagFields,
      options: {
        createTokensOnBlur: true,
        delimiter: ',',
        // Tag entity is limited to 32 characters
        maxCharacters: 32,
      },
    });

    // On reset button click we regenerate the friendly url for currently selected locale
    const resetLinkRewriteBtn = document.querySelector<HTMLButtonElement>(ProductMap.seo.resetLinkRewriteBtn)!;
    resetLinkRewriteBtn.addEventListener('click', () => this.resetLinkRewrite());

    // Disable or enable reset button depending on the name input value at init, on language change and on keyup inputs (on name and url inputs)
    this.linkRewriteStateRefresh();
    this.eventEmitter.on('languageSelected', () => this.linkRewriteStateRefresh());
    this.initCallbackOnInputChange(ProductMap.productLocalizedNameInput, () => this.linkRewriteStateRefresh());
    this.initCallbackOnInputChange(ProductMap.productLocalizedLinkRewriteInput, () => this.linkRewriteStateRefresh());

    if (resetLinkRewriteBtn.dataset.automaticChange === '1') {
      this.initCallbackOnInputChange(ProductMap.productLocalizedNameInput, () => this.resetAllLinkRewrites());
    }
  }

  private initCallbackOnInputChange(inputSelector: string, callback: EventListenerOrEventListenerObject): void {
    const inputs = document.querySelectorAll(inputSelector);

    if (inputs) {
      for (let i = 0; i < inputs.length; i += 1) {
        inputs[i].addEventListener('keyup', callback);
      }
    }
  }

  private linkRewriteStateRefresh(): void {
    const resetLinkRewriteBtn = document.querySelector<HTMLButtonElement>(ProductMap.seo.resetLinkRewriteBtn)!;
    // eslint-disable-next-line max-len
    const nameInput = document.querySelector<HTMLInputElement>(`${this.translatableInput.localeInputSelector}:not(.d-none) ${ProductMap.productLocalizedNameInput}`);
    // eslint-disable-next-line max-len
    const linkRewriteInput = document.querySelector<HTMLInputElement>(`${this.translatableInput.localeInputSelector}:not(.d-none) ${ProductMap.productLocalizedLinkRewriteInput}`);

    if (!nameInput || !linkRewriteInput || !resetLinkRewriteBtn) {
      return;
    }

    resetLinkRewriteBtn.disabled = linkRewriteInput.value === window.str2url(nameInput.value);
  }

  private resetLinkRewrite(): void {
    // eslint-disable-next-line max-len
    const nameInput = document.querySelector<HTMLInputElement>(`${this.translatableInput.localeInputSelector}:not(.d-none) ${ProductMap.productLocalizedNameInput}`);
    // eslint-disable-next-line max-len
    const linkRewriteInput = document.querySelector<HTMLInputElement>(`${this.translatableInput.localeInputSelector}:not(.d-none) ${ProductMap.productLocalizedLinkRewriteInput}`);
    const resetLinkRewriteBtn = document.querySelector<HTMLButtonElement>(ProductMap.seo.resetLinkRewriteBtn)!;

    if (!nameInput || !linkRewriteInput || !resetLinkRewriteBtn) {
      console.error('Couldn\'t find product name or link rewrite input');
      return;
    }

    const nameValue = nameInput.value;

    if (!nameValue) {
      return;
    }

    this.updateUrlInput(linkRewriteInput, nameValue);
    resetLinkRewriteBtn.disabled = true;
  }

  private updateUrlInput(linkRewriteInput: HTMLInputElement, nameValue: string): void {
    // eslint-disable-next-line no-param-reassign
    linkRewriteInput.value = window.str2url(nameValue);
    linkRewriteInput.dispatchEvent(new Event('change', {bubbles: true}));
  }

  private resetAllLinkRewrites(): void {
    const nameInputs = document.querySelectorAll<HTMLInputElement>(ProductMap.productLocalizedNameInput);
    nameInputs.forEach((nameInput: HTMLInputElement) => {
      nameInput.parentElement?.classList?.forEach((parentClass:string) => {
        // Search for class mapping js-locale-en, js-locale-fr, ...
        if (parentClass.match(/^js-locale-[a-zA-Z]{2}$/)) {
          const linkRewriteSelector = `.${parentClass} ${ProductMap.productLocalizedLinkRewriteInput}`;
          const linkRewriteInput = document.querySelector<HTMLInputElement>(linkRewriteSelector);

          if (linkRewriteInput) {
            this.updateUrlInput(linkRewriteInput, nameInput.value);
          }
        }
      });
    });

    this.linkRewriteStateRefresh();
  }
}
