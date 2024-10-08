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

class SqlManagerPage {
  constructor() {
    const requestSqlGrid = new window.prestashop.component.Grid('sql_request');
    requestSqlGrid.addExtension(new window.prestashop.component.GridExtensions.ReloadListExtension());
    requestSqlGrid.addExtension(new window.prestashop.component.GridExtensions.ExportToSqlManagerExtension());
    requestSqlGrid.addExtension(new window.prestashop.component.GridExtensions.FiltersResetExtension());
    requestSqlGrid.addExtension(new window.prestashop.component.GridExtensions.SortingExtension());
    requestSqlGrid.addExtension(new window.prestashop.component.GridExtensions.LinkRowActionExtension());
    requestSqlGrid.addExtension(new window.prestashop.component.GridExtensions.SubmitGridActionExtension());
    requestSqlGrid.addExtension(new window.prestashop.component.GridExtensions.SubmitBulkActionExtension());
    requestSqlGrid.addExtension(new window.prestashop.component.GridExtensions.SubmitRowActionExtension());
    requestSqlGrid.addExtension(new window.prestashop.component.GridExtensions.BulkActionCheckboxExtension());
    requestSqlGrid.addExtension(new window.prestashop.component.GridExtensions.FiltersSubmitButtonEnablerExtension());

    $(document).on('change', '.js-db-tables-select', () => this.reloadDbTableColumns(),
    );
    $(document).on('click', '.js-add-db-table-to-query-btn', (event: JQueryEventObject) => this.addDbTableToQuery(event),
    );
    $(document).on('click', '.js-add-db-table-column-to-query-btn', (event: JQueryEventObject) => {
      this.addDbTableColumnToQuery(event);
    });
  }

  /**
   * Reload database table columns
   */
  reloadDbTableColumns() {
    const $selectedOption = $('.js-db-tables-select').find('option:selected');
    const $table = $('.js-table-columns');

    $.ajax($selectedOption.data('table-columns-url')).then((response) => {
      $('.js-table-alert').addClass('d-none');

      const {columns} = response;

      $table.removeClass('d-none');
      $table.find('tbody').empty();

      columns.forEach((column: Record<string, any>) => {
        const $row = $('<tr>')
          .append($('<td>').html(column.name))
          .append($('<td>').html(column.type))
          .append(
            $('<td>')
              .addClass('text-right')
              .append(
                $('<button>')
                  .addClass(
                    'btn btn-sm btn-outline-secondary js-add-db-table-column-to-query-btn',
                  )
                  .attr('data-column', column.name)
                  .html($table.data('action-btn')),
              ),
          );

        $table.find('tbody').append($row);
      });
    });
  }

  /**
   * Add selected database table name to SQL query input
   *
   * @param event
   */
  addDbTableToQuery(event: JQueryEventObject): void {
    const $selectedOption = $('.js-db-tables-select').find('option:selected');

    if ($selectedOption.length === 0) {
      alert($(event.target).data('choose-table-message'));

      return;
    }

    this.addToQuery(<string>$selectedOption.val());
  }

  /**
   * Add table column to SQL query input
   *
   * @param event
   */
  addDbTableColumnToQuery(event: JQueryEventObject): void {
    this.addToQuery($(event.target).data('column'));
  }

  /**
   * Add data to SQL query input
   *
   * @param {String} data
   */
  addToQuery(data: string): void {
    const $queryInput = $('#sql_request_sql');
    $queryInput.val(`${$queryInput.val()} ${data}`);
  }
}

$(() => {
  new SqlManagerPage();
});
