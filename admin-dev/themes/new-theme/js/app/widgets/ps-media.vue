<!--**
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
 *-->
<template>
  <div class="media">
    <img
      v-if="displayThumb"
      :src="thumbnail"
      class="thumbnail d-flex"
    >
    <div
      v-else
      class="no-img"
    />
    <div class="ml-2 desc media-body">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
  import {defineComponent} from 'vue';

  export default defineComponent({
    props: {
      thumbnail: {
        type: String,
        required: false,
        default: '',
      },
    },
    computed: {
      displayThumb(): boolean {
        return this.thumbnail === '' ? false : !!this.thumbnail;
      },
    },
  });
</script>

<style lang="scss" scoped>
  @import '~@scss/config/_settings.scss';

  .product-title {
    .has-combination & {
      font-weight: 600;
    }
  }
  .thumbnail, .no-img {
    border: 1px solid var(--#{$cdk}primary-400);
    max-width: var(--#{$cdk}size-44);
  }
  .no-img {
    background: var(--#{$cdk}white);
    width: var(--#{$cdk}size-44);
    height: var(--#{$cdk}size-44);
    display: inline-block;
    vertical-align: middle;
  }
  .desc {
    white-space: normal;
  }
</style>
