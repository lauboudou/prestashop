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
  <div class="card p-3">
    <PSTree
      ref="domainsTree"
      :model="$store.getters.domainsTree"
      class-name="translationTree"
      :translations="translations"
      :current-item="currentItem"
      v-if="treeReady"
    />
    <PSSpinner v-else />
  </div>
</template>

<script lang="ts">
  import PSTree from '@app/widgets/ps-tree/ps-tree.vue';
  import PSSpinner from '@app/widgets/ps-spinner.vue';
  import {EventEmitter} from '@components/event-emitter';
  import TranslationMixin from '@app/pages/translations/mixins/translate';
  import {defineComponent} from 'vue';

  export default defineComponent({
    props: {
      modal: {
        type: Object,
        required: false,
        default: () => ({}),
      },
      principal: {
        type: Object,
        required: false,
        default: () => ({}),
      },
    },
    mixins: [TranslationMixin],
    computed: {
      treeReady(): boolean {
        return !this.$store.state.sidebarLoading;
      },
      currentItem(): string {
        if (this.$store.getters.currentDomain === '' || typeof this.$store.getters.currentDomain === 'undefined') {
          if (this.$store.getters.domainsTree.length) {
            const domain = this.getFirstDomainToDisplay(this.$store.getters.domainsTree);
            EventEmitter.emit('reduce');
            this.$store.dispatch('updateCurrentDomain', domain);

            if (domain !== '') {
              this.$store.dispatch('getCatalog', {url: (<Record<string, any>>domain).dataValue});
              EventEmitter.emit('setCurrentElement', (<Record<string, any>>domain).full_name);
              return (<Record<string, any>>domain).full_name;
            }

            this.$store.dispatch('updatePrincipalLoading', false);
            return '';
          }
        }

        return this.$store.getters.currentDomain;
      },
      translations(): Record<string, any> {
        return {
          expand: this.trans('sidebar_expand'),
          reduce: this.trans('sidebar_collapse'),
          extra: this.trans('label_missing'),
          extra_singular: this.trans('label_missing_singular'),
        };
      },
    },
    mounted() {
      this.$store.dispatch('getDomainsTree', {
        store: this.$store,
      });
      EventEmitter.on('lastTreeItemClick', (el: any): void => {
        if (this.edited()) {
          this.modal.showModal();
          this.modal.$once('save', () => {
            this.principal.saveTranslations();
            this.itemClick(el);
          });
          this.modal.$once('leave', () => {
            this.itemClick(el);
          });
        } else {
          this.itemClick(el);
        }
      });
    },
    methods: {
      /**
       * Update the domain, retrieve the translations catalog, set the page to 1
       * and reset the modified translations
       * @param {object} el - Domain to set
       */
      itemClick(el: any): void {
        this.$store.dispatch('updateCurrentDomain', el.item);
        this.$store.dispatch('getCatalog', {url: el.item.dataValue});
        this.$store.dispatch('updatePageIndex', 1);
        this.$store.state.modifiedTranslations = [];
      },
      getFirstDomainToDisplay(tree: any): string | Record<string, any> {
        const keys = Object.keys(tree);
        let toDisplay = '';

        for (let i = 0; i < tree.length; i += 1) {
          if (!tree[keys[i]].disable) {
            if (tree[keys[i]].children && tree[keys[i]].children.length > 0) {
              return this.getFirstDomainToDisplay(tree[keys[i]].children);
            }

            toDisplay = tree[keys[i]];
            break;
          }
        }

        return toDisplay;
      },
      /**
       * Check if some translations have been edited
       * @returns {boolean}
       */
      edited: function edited(): boolean {
        return Object.keys(this.$store.state.modifiedTranslations).length > 0;
      },
    },
    components: {
      PSTree,
      PSSpinner,
    },
  });
</script>

<style lang="scss" type="text/scss">
  @import '~@scss/config/_settings.scss';

  .translationTree {
    .tree-name {
      margin-bottom: var(--#{$cdk}size-16);

      &.active {
        font-weight: bold;
      }

      &.extra {
        color: var(--#{$cdk}red-500);
      }
    }

    .tree-extra-label {
      color: var(--#{$cdk}red-500);
      text-transform: uppercase;
      font-size: var(--#{$cdk}size-10);
      margin-left: auto;
    }
    .tree-extra-label-mini {
      background-color: var(--#{$cdk}red-500);
      color: var(--#{$cdk}white);
      padding: 0 var(--#{$cdk}size-8);
      border-radius: var(--#{$cdk}size-12);
      display: inline-block;
      font-size: var(--#{$cdk}size-12);
      height: var(--#{$cdk}size-24);
      margin-left: auto;
    }
    .tree-label {
      &:hover {
        text-decoration: underline;
      }
    }
  }

  .ps-loader {
    $loader-white-height: 20px;
    $loader-line-height: 16px;

    .animated-background {
      height: 144px!important;
      animation-duration: 2s!important;
    }

    .background-masker {
      &.header-left {
        left: 0;
        top: $loader-line-height;
        height: 108px;
        width: 20px;
      }

      &.content-top {
        left: 0;
        top: $loader-line-height;
        height: $loader-white-height;
      }

      &.content-first-end {
        left: 0;
        top: $loader-line-height*2+$loader-white-height;
        height: $loader-white-height;
      }

      &.content-second-end {
        left: 0;
        top: $loader-line-height*3+$loader-white-height*2;
        height: $loader-white-height;
      }

      &.content-third-end {
        left: 0;
        top: $loader-line-height*4+$loader-white-height*3;
        height: $loader-white-height;
      }
    }
  }
</style>
