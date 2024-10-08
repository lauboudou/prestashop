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
  <div class="dropzone-window">
    <div class="dropzone-window-header row">
      <div class="dropzone-window-header-left">
        <p
          class="dropzone-window-number"
          v-html="
            $t('window.selectedFiles', { 'filesNb': selectedFiles.length })
          "
        />
      </div>
      <div class="dropzone-window-header-right">
        <i
          class="material-icons"
          data-toggle="pstooltip"
          :data-original-title="$t('window.zoom')"
          @click="$emit('openGallery')"
        >search</i>
        <i
          class="material-icons"
          data-toggle="pstooltip"
          :data-original-title="$t('window.replaceSelection')"
          @click="openFileManager"
          v-if="selectedFile"
        >find_replace</i>
        <i
          class="material-icons"
          data-toggle="pstooltip"
          :data-original-title="$t('window.delete')"
          @click.stop="$emit('removeSelection')"
        >delete</i>
        <i
          class="material-icons"
          data-toggle="pstooltip"
          :data-original-title="$t('window.close')"
          @click="$emit('unselectAll')"
        >close</i>
      </div>
    </div>

    <p
      class="dropzone-window-select"
      @click="$emit('selectAll')"
      v-if="files.length > 0 && selectedFiles.length !== files.length"
    >
      {{ $t('window.selectAll') }}
    </p>
    <p
      class="dropzone-window-unselect"
      v-if="selectedFiles.length === files.length"
      @click="$emit('unselectAll')"
    >
      {{ $t('window.unselectAll') }}
    </p>

    <div
      class="dropzone-window-checkbox"
      v-if="selectedFile !== null && selectedFile.isAssociatedToCurrentShop"
    >
      <div
        class="md-checkbox"
        :data-toggle="showCoverTooltip"
        :data-original-title="$t('window.cantDisableCover')"
      >
        <label>
          <input
            id="is-cover-checkbox"
            type="checkbox"
            :disabled="isCover"
            :checked="isCover"
            @change.prevent.stop="coverChanged"
          >
          <i class="md-checkbox-control" />
          {{ $t('window.useAsCover') }}
        </label>
      </div>
      <div
        class="md-checkbox"
        v-if="isMultiStoreActive && (isCover || coverData)"
      >
        <label>
          <input
            id="apply-to-all-stores-checkbox"
            type="checkbox"
            @change="applyToAllStoresChanged"
          >
          <i class="md-checkbox-control" />
          {{ $t('window.applyToAllStores') }}
        </label>
      </div>
    </div>

    <input
      type="file"
      class="dropzone-window-filemanager"
      @change.prevent.stop="watchFiles"
    >

    <div
      class="dropzone-window-label"
      v-if="selectedFile !== null"
    >
      <label
        for="caption-textarea"
        class="control-label"
      >{{
        $t('window.caption')
      }}</label>
      <div
        class="dropdown"
        v-if="locales.length > 1"
      >
        <button
          class="btn btn-outline-secondary btn-sm dropdown-toggle js-locale-btn"
          type="button"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
          id="product_dropzone_lang"
        >
          {{ selectedLocale.iso_code }}
        </button>
        <div
          class="dropdown-menu dropdown-menu-right locale-dropdown-menu"
          aria-labelledby="form_invoice_prefix"
        >
          <span
            v-for="locale in locales"
            :key="locale.name"
            class="dropdown-item js-locale-item"
            :data-locale="locale.iso_code"
          >
            {{ locale.name }}
          </span>
        </div>
      </div>
    </div>

    <textarea
      id="caption-textarea"
      name="caption-textarea"
      class="form-control"
      v-if="selectedFile !== null"
      v-model="captionValue[selectedLocale.id_lang]"
      @change.prevent.stop="prevent"
      @keyup.prevent.stop="prevent"
    />

    <div
      class="dropzone-window-button-container"
      v-if="selectedFile"
    >
      <button
        type="button"
        class="btn btn-primary save-image-settings"
        @click="$emit('saveSelectedFile', captionValue, coverData, this.getShopIdForFileSaving)"
      >
        <span v-if="!loading">
          {{ $t('window.saveImage') }}
        </span>
        <span
          class="spinner-border spinner-border-sm"
          v-if="loading"
          role="status"
          aria-hidden="true"
        />
      </button>
    </div>
  </div>
</template>

<script lang="ts">
  import {PSDropzoneFile} from '@pages/product/image/dropzone/Dropzone.vue';
  import ProductMap from '@pages/product/product-map';
  import {defineComponent, PropType} from 'vue';

  const DropzoneMap = ProductMap.dropzone;

  export default defineComponent({
    name: 'DropzoneWindow',
    props: {
      selectedFiles: {
        type: Array as PropType<Array<PSDropzoneFile>>,
        default: () => [],
      },
      files: {
        type: Array,
        default: () => [],
      },
      locales: {
        type: Array as PropType<Array<Record<string, any>>>,
        required: true,
      },
      isMultiStoreActive: {
        type: Boolean,
        required: true,
      },
      selectedLocale: {
        type: Object,
        default: () => {},
      },
      loading: {
        type: Boolean,
        default: false,
      },
      shopId: {
        type: null,
        required: true,
      },
    },
    data(): {
      captionValue: KeyStringRecord,
      coverData: boolean | string,
      applyToAllStores: boolean,
    } {
      return {
        captionValue: {},
        coverData: false,
        applyToAllStores: false,
      };
    },
    watch: {
      /**
       * We need to watch selected files to manage multilang
       * of only one file or multiple files then the value is sent
       * on save.
       */
      selectedFiles(value: Array<PSDropzoneFile>): void {
        if (value.length > 1) {
          this.captionValue = {};
          this.locales.forEach((locale) => {
            this.captionValue[locale.id_lang] = '';
          });
        } else if (this.selectedFile) {
          this.captionValue = this.selectedFile.legends;
          this.coverData = this.selectedFile.is_cover;
        }
      },
    },
    computed: {
      selectedFile(): PSDropzoneFile | null {
        return this.selectedFiles.length === 1 ? <PSDropzoneFile> this.selectedFiles[0] : null;
      },
      isCover(): boolean {
        return !!(this.selectedFile && this.selectedFile.is_cover);
      },
      showCoverTooltip(): boolean | string {
        if (this.isCover) {
          return 'pstooltip';
        }

        return false;
      },
      getShopIdForFileSaving(): number | null {
        if (!this.selectedFile || !this.selectedFile.isAssociatedToCurrentShop || this.applyToAllStores) {
          return null;
        }

        return this.shopId;
      },
    },
    mounted() {
      window.prestaShopUiKit.initToolTips();
      // We set the intial value of the first item in order to use the computed
      if (this.selectedFile) {
        this.captionValue = this.selectedFile.legends;
        this.coverData = this.selectedFile.is_cover;
      }
    },
    updated() {
      window.prestaShopUiKit.initToolTips();
    },
    methods: {
      /**
       * Watch file change and send an event to the smart component
       */
      watchFiles(event: Event): void {
        this.$emit('replacedFile', event);
      },
      /**
       * Used to open the native file manager
       */
      openFileManager(): void {
        const fileInput = <HTMLInputElement> document.querySelector(DropzoneMap.windowFileManager);
        fileInput?.click();
      },
      /**
       * Cache cover data
       */
      coverChanged(event: Event): void {
        if ((<HTMLInputElement> event.target)?.value) {
          this.coverData = (<HTMLInputElement> event.target).value;
          this.applyToAllStores = false;
        }
      },
      applyToAllStoresChanged(event: Event): void {
        if ((<HTMLInputElement> event.target)?.value) {
          this.applyToAllStores = true;
        }
      },
      prevent(event: Event): void {
        event.preventDefault();
        event.stopPropagation();
      },
    },
  });
</script>

<style lang="scss" type="text/scss">
@import '~@scss/config/_settings.scss';
@import '~@scss/config/_bootstrap.scss';

.product-page {
  .dropzone-window {
    width: 45%;
    flex-shrink: 0;
    background-color: var(--#{$cdk}primary-200);
    align-self: stretch;
    padding: var(--#{$cdk}size-16);
    min-width: var(--#{$cdk}size-320);

    &-filemanager {
      display: none;
    }

    &-label {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: var(--#{$cdk}size-8);

      label {
        margin-bottom: 0;
      }

      .dropdown {
        > button {
          padding-right: var(--#{$cdk}size-4);
        }

        &-item {
          cursor: pointer;
        }
      }
    }

    textarea {
      margin-bottom: var(--#{$cdk}size-16);
    }

    &-button {
      &-container {
        display: flex;
        justify-content: flex-end;
      }
    }

    &-checkbox {
      margin-bottom: var(--#{$cdk}size-16);

      label {
        font-size: var(--#{$cdk}size-14);
      }
    }

    &-select,
    &-unselect {
      font-weight: 600;
      font-size: var(--#{$cdk}size-16);
      color: var(--#{$cdk}primary-800);
      cursor: pointer;
      margin-top: var(--#{$cdk}size-8);

      &:hover {
        text-decoration: underline;
      }
    }

    &-number {
      font-size: var(--#{$cdk}size-16);

      span {
        color: var(--#{$cdk}primary-800);
        font-weight: 600;
      }
    }

    &-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 var(--#{$cdk}size-16);

      p {
        margin-bottom: 0;
      }

      .material-icons {
        cursor: pointer;
        color: var(--#{$cdk}primary-500);
        transition: 0.25s ease-out;
        font-size: var(--#{$cdk}size-24);
        margin: 0 var(--#{$cdk}size-4);

        &:last-child {
          margin-right: 0;
        }

        &:first-child {
          margin-left: 0;
        }

        &:hover {
          color: var(--#{$cdk}primary-800);
        }
      }
    }

    @include media-breakpoint-down(sm) {
      width: 100%;
      min-width: 100%;
    }
  }
}
</style>
