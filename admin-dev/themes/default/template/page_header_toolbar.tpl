{**
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
 *}

{* retro compatibility *}
{if !isset($title) && isset($page_header_toolbar_title)}
  {assign var=title value=$page_header_toolbar_title}
{/if}
{if isset($page_header_toolbar_btn)}
  {assign var=toolbar_btn value=$page_header_toolbar_btn}
{/if}

<div class="bootstrap">
  <div class="page-head {if isset($current_tab_level) && $current_tab_level == 3}with-tabs{/if}">
    <div class="wrapper clearfix">
    {block name=pageBreadcrumb}
      <ul class="breadcrumb page-breadcrumb">
        {* Container *}
        {if $breadcrumbs2.container.name != ''}
          <li class="breadcrumb-container">
            {$breadcrumbs2.container.name|escape}
          </li>
        {/if}

        {* Current Tab *}
        {if $breadcrumbs2.tab.name != '' && $breadcrumbs2.container.name != $breadcrumbs2.tab.name}
          <li class="breadcrumb-current">
            {if $breadcrumbs2.tab.href != ''}<a href="{$breadcrumbs2.tab.href|escape}">{/if}
              {$breadcrumbs2.tab.name|escape}
              {if $breadcrumbs2.tab.href != ''}</a>{/if}
          </li>
        {/if}

        {* Action *}
        {*if $breadcrumbs2.action.name != ''}
                  <li class="breadcrumb-action">
                      {if $breadcrumbs2.action.href != ''}<a href="{$breadcrumbs2.action.href|escape}">{/if}
                      {$breadcrumbs2.action.name|escape}
                      {if $breadcrumbs2.action.href != ''}</a>{/if}
                  </li>
              {/if*}
      </ul>
    {/block}

    {block name=pageTitle}
      <h1 class="page-title">
        {*if isset($toolbar_btn['back'])}
              <a id="page-header-desc-{$table}{if isset($toolbar_btn['back'].imgclass)}-{$toolbar_btn['back'].imgclass}{/if}" class="page-header-toolbar-back{if isset($toolbar_btn['back'].target) && $toolbar_btn['back'].target} _blank{/if}" {if isset($toolbar_btn['back'].href)}href="{$toolbar_btn['back'].href}"{/if} title="{$toolbar_btn['back'].desc}"{if isset($toolbar_btn['back'].js) && $toolbar_btn['back'].js} onclick="{$toolbar_btn['back'].js}"{/if}>
              </a>
              {/if*}
        {if is_array($title)}{$title|end|strip_tags}{else}{$title|strip_tags}{/if}
      </h1>
    {/block}

    {block name=toolbarBox}
      <div class="page-bar toolbarBox">
        <div class="btn-toolbar">
          <a href="#" class="toolbar_btn dropdown-toolbar navbar-toggle" data-toggle="collapse"
             data-target="#toolbar-nav"><i class="process-icon-dropdown"></i>
            <div>{l s='Menu' d='Admin.Navigation.Menu'}</div>
          </a>
          <ul id="toolbar-nav" class="nav nav-pills pull-right collapse navbar-collapse">
            {hook h='displayDashboardToolbarTopMenu'}
            {foreach from=$toolbar_btn item=btn key=k}
              {if $k != 'back'}
                <li>
                  <a id="page-header-desc-{$table}-{if isset($btn.imgclass)}{$btn.imgclass|escape}{else}{$k}{/if}"
                     class="toolbar_btn {if isset($btn.target) && $btn.target} _blank{/if} pointer"{if isset($btn.href)} href="{$btn.href|escape}"{/if}
                     title="{if isset($btn.help)}{$btn.help}{else}{$btn.desc|escape}{/if}"{if isset($btn.js) && $btn.js} onclick="{$btn.js}"{/if}{if isset($btn.modal_target) && $btn.modal_target} data-target="{$btn.modal_target}" data-toggle="modal"{/if}{if isset($btn.help)} data-toggle="tooltip" data-placement="bottom"{/if}
                    data-role="page-header-desc-{$table}-link">
                    <i
                      class="{if isset($btn.icon)}{$btn.icon|escape}{else}process-icon-{if isset($btn.imgclass)}{$btn.imgclass|escape}{else}{$k}{/if}{/if}{if isset($btn.class)} {$btn.class|escape}{/if}"></i>
                    <div{if isset($btn.force_desc) && $btn.force_desc == true } class="locked"{/if}>{$btn.desc|escape}</div>
                  </a>
                </li>
              {/if}
            {/foreach}
            {if isset($help_link)}
              <li>
                <a class="toolbar_btn btn-help" href="{$help_link|escape}" title="{l s='Help' d='Admin.Global'}">
                  <div>{l s='Help' d='Admin.Global'}</div>
                </a>
              </li>
            {/if}
          </ul>
        </div>
      </div>
    {/block}

    </div>

    {if isset($current_tab_level) && $current_tab_level == 3}
      <div class="page-head-tabs" id="head_tabs">
        <ul class="nav">
        {foreach $tabs as $level_1}
          {foreach $level_1.sub_tabs as $level_2}
            {foreach $level_2.sub_tabs as $level_3}
              {if $level_3.current}
                {foreach $level_3.sub_tabs as $level_4}
                  {if $level_4.active}
                    <li>
                      <a href="{$level_4.href}" id="subtab-{$level_4.class_name}" {if $level_4.current}class="current"{/if} data-submenu="{$level_4.id_tab}">
                        {$level_4.name}
                        <span class="notification-container">
                          <span class="notification-counter"></span>
                        </span>
                      </a>
                    </li>
                  {/if}
                {/foreach}
              {/if}
            {/foreach}
          {/foreach}
        {/foreach}
        </ul>
      </div>
    {/if}
  </div>
  {hook h='displayDashboardTop'}
</div>
