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

declare(strict_types=1);

namespace PrestaShop\PrestaShop\Adapter\Carrier\CommandHandler;

use PrestaShop\PrestaShop\Adapter\Carrier\Repository\CarrierRepository;
use PrestaShop\PrestaShop\Core\CommandBus\Attributes\AsCommandHandler;
use PrestaShop\PrestaShop\Core\Domain\Carrier\Command\ToggleCarrierIsFreeCommand;
use PrestaShop\PrestaShop\Core\Domain\Carrier\CommandHandler\ToggleCarrierIsFreeHandlerInterface;
use PrestaShop\PrestaShop\Core\Domain\Carrier\Exception\CannotToggleCarrierIsFreeStatusException;
use PrestaShop\PrestaShop\Core\Domain\Carrier\Exception\CarrierException;
use PrestaShopException;

#[AsCommandHandler]
class ToggleCarrierIsFreeHandler implements ToggleCarrierIsFreeHandlerInterface
{
    public function __construct(
        private readonly CarrierRepository $carrierRepository
    ) {
    }

    /**
     * {@inheritdoc}
     */
    public function handle(ToggleCarrierIsFreeCommand $command)
    {
        $carrier = $this->carrierRepository->get($command->getCarrierId());

        try {
            $carrier->setFieldsToUpdate(['is_free' => true]);
            $carrier->is_free = !(bool) $carrier->is_free;

            if (false === $carrier->update()) {
                throw new CannotToggleCarrierIsFreeStatusException(sprintf('Unable to toggle is-free status of carrier with id "%d"', $command->getCarrierId()->getValue()));
            }
        } catch (PrestaShopException $e) {
            throw new CarrierException(sprintf('An error occurred when toggling is-free status of carrier with id "%d"', $command->getCarrierId()->getValue()), 0, $e);
        }
    }
}
