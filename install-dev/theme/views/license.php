<?php
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
?>

<!-- License agreement -->
<h2 id="licenses-agreement"><?php echo $this->translator->trans('License Agreements', [], 'Install'); ?></h2>
<p><strong><?php echo $this->translator->trans('To enjoy the many features that are offered for free by PrestaShop, please read the license terms below. PrestaShop core is licensed under OSL 3.0, while the modules and themes are licensed under AFL 3.0.', [], 'Install'); ?></strong></p>
<div class="infosLicense">
    <?php echo $this->getTemplate('license_content'); ?>
</div>

<div class="checkLicense">
    <input type="checkbox" id="set_license" class="required" name="licence_agrement" value="1" style="margin-top: 2px;" <?php if ($this->session->licence_agrement) { ?>checked="checked"<?php } ?> />
    <div>
        <label for="set_license">
            <strong><?php echo $this->translator->trans('I agree to the above terms and conditions.', [], 'Install'); ?></strong>
        </label>
    </div>
</div>
<div class="infosBlock">
    <h4><?php echo $this->translator->trans('Privacy note', [], 'Install'); ?></h4>
    <p>
        <?php echo $this->translator->trans(
            'Some project modules may submit public and technical information about your store to the PrestaShop Project for analytics purposes. To learn more and make an informed choice, read %link%.',
            [
                '%link%' => '<a href="https://www.prestashop-project.org/data-transparency/" target="_blank">' .
                    $this->translator->trans('this article', [], 'Install')
                    . '</a>'
            ],
            'Install'
        ); ?>
    </p>
</div>
