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

namespace Tests\Integration\PrestaShopBundle\EventListener\Admin;

use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Bundle\FrameworkBundle\Routing\Router;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Response;
use Tests\Integration\Utility\LoginTrait;

class AccessDeniedListenerTest extends WebTestCase
{
    use LoginTrait;

    protected KernelBrowser $client;
    protected Router $router;

    protected function setUp(): void
    {
        parent::setUp();
        $this->client = self::createClient();
        $this->router = self::$kernel->getContainer()->get('router');
    }

    public function testAccessDenied(): void
    {
        $this->loginUser($this->client);

        $this->client->request('GET', $this->router->generate('test_index'));

        $response = $this->client->getResponse();
        $this->assertEquals(Response::HTTP_FORBIDDEN, $response->getStatusCode());
    }

    public function testValidAccess(): void
    {
        $this->loginUser($this->client);

        $this->client->request('GET', $this->router->generate('test_something_complex'));

        $response = $this->client->getResponse();
        $this->assertEquals(Response::HTTP_OK, $response->getStatusCode());
        $this->assertEquals('ComplexAction', $response->getContent());
    }

    public function testRedirection(): void
    {
        $this->loginUser($this->client);
        $this->client->request('GET', $this->router->generate('test_redirect'));

        $response = $this->client->getResponse();
        $this->assertEquals(Response::HTTP_FOUND, $response->getStatusCode());
        $this->assertStringStartsWith('/tests/something-complex?_token=', $response->headers->get('location'));
        $this->assertStringContainsString('Redirecting to /tests/something-complex', $response->getContent());
    }

    public function testAnonymous(): void
    {
        $this->client->request('GET', $this->router->generate('test_anonymous'));

        $response = $this->client->getResponse();
        $this->assertEquals(Response::HTTP_OK, $response->getStatusCode());
        $this->assertEquals('AnonymousController', $response->getContent());

        $this->client->request('GET', $this->router->generate('test_hard_coded_anonymous'));

        $response = $this->client->getResponse();
        $this->assertEquals(Response::HTTP_OK, $response->getStatusCode());
        $this->assertEquals('AnonymousController', $response->getContent());
    }
}
