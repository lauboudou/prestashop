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

import CategoryPositionExtension from '@components/grid/extension/column/catalog/category-position-extension';
/* eslint-disable */
import DeleteCategoryRowActionExtension from '@components/grid/extension/action/row/category/delete-category-row-action-extension';
import DeleteCategoriesBulkActionExtension from '@components/grid/extension/action/bulk/category/delete-categories-bulk-action-extension';
/* eslint-enable */
import textToLinkRewriteCopier from '@components/text-to-link-rewrite-copier';
import FormSubmitButton from '@components/form-submit-button';
import ShowcaseCard from '@components/showcase-card/showcase-card';
import ShowcaseCardCloseExtension from '@components/showcase-card/extension/showcase-card-close-extension';
import Serp from '@app/utils/serp/index';

const {$} = window;

$(() => {
  const categoriesGrid = new window.prestashop.component.Grid('category');

  categoriesGrid.addExtension(new window.prestashop.component.GridExtensions.FiltersResetExtension());
  categoriesGrid.addExtension(new window.prestashop.component.GridExtensions.SortingExtension());
  categoriesGrid.addExtension(new CategoryPositionExtension(categoriesGrid));
  categoriesGrid.addExtension(new window.prestashop.component.GridExtensions.ExportToSqlManagerExtension());
  categoriesGrid.addExtension(new window.prestashop.component.GridExtensions.ReloadListExtension());
  categoriesGrid.addExtension(new window.prestashop.component.GridExtensions.BulkActionCheckboxExtension());
  categoriesGrid.addExtension(new window.prestashop.component.GridExtensions.SubmitBulkActionExtension());
  categoriesGrid.addExtension(new window.prestashop.component.GridExtensions.SubmitRowActionExtension());
  categoriesGrid.addExtension(new window.prestashop.component.GridExtensions.LinkRowActionExtension());
  categoriesGrid.addExtension(new window.prestashop.component.GridExtensions.AsyncToggleColumnExtension());
  categoriesGrid.addExtension(new DeleteCategoryRowActionExtension());
  categoriesGrid.addExtension(new DeleteCategoriesBulkActionExtension());
  categoriesGrid.addExtension(new window.prestashop.component.GridExtensions.FiltersSubmitButtonEnablerExtension());

  const showcaseCard = new ShowcaseCard('categoriesShowcaseCard');
  showcaseCard.addExtension(new ShowcaseCardCloseExtension());

  window.prestashop.component.initComponents(
    [
      'TranslatableField',
      'TinyMCEEditor',
      'TranslatableInput',
      'TextWithRecommendedLengthCounter',
      'ChoiceTable',
    ],
  );

  const translatorInput = window.prestashop.instance.translatableInput;

  textToLinkRewriteCopier({
    sourceElementSelector: 'input[name^="category[name]"]',
    /* eslint-disable-next-line max-len */
    destinationElementSelector: `${translatorInput.localeInputSelector}:not(.d-none) input[name^="category[link_rewrite]"]`,
  });

  textToLinkRewriteCopier({
    sourceElementSelector: 'input[name^="root_category[name]"]',
    /* eslint-disable-next-line max-len */
    destinationElementSelector: `${translatorInput.localeInputSelector}:not(.d-none) input[name^="root_category[link_rewrite]"]`,
  });

  new Serp(
    {
      container: '#serp-app',
      defaultTitle: 'input[name*="category[name]"]',
      watchedTitle: 'input[name*="category[meta_title]"]',
      defaultDescription: 'textarea[name*="category[description]"]',
      watchedDescription: 'textarea[name*="category[meta_description]"]',
      watchedMetaUrl: 'input[name*="category[link_rewrite]"]',
      multiLanguageInput: `${translatorInput.localeInputSelector}:not(.d-none)`,
      multiLanguageItem: translatorInput.localeItemSelector,
    },
    $('#serp-app').data('category-url'),
  );

  new FormSubmitButton();

  new window.prestashop.component.TaggableField({
    tokenFieldSelector: 'input.js-taggable-field',
    options: {
      createTokensOnBlur: true,
    },
  });

  new window.prestashop.component.ChoiceTree('#category_id_parent');
  new window.prestashop.component.ChoiceTree('#category_shop_association').enableAutoCheckChildren();

  new window.prestashop.component.ChoiceTree('#root_category_id_parent');
  new window.prestashop.component.ChoiceTree('#root_category_shop_association').enableAutoCheckChildren();
});
