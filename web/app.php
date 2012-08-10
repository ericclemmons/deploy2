<?php

use Symfony\Component\ClassLoader\ApcClassLoader;
use Symfony\Component\HttpFoundation\Request;

if (isset($_SERVER['HTTP_CLIENT_IP'])
    || isset($_SERVER['HTTP_X_FORWARDED_FOR'])
    || !in_array(@$_SERVER['REMOTE_ADDR'], array(
        '127.0.0.1',
        '::1',
    ))
) {
    $env = 'prod';
} else {
    $env = 'dev';
}

$loader = require_once __DIR__.'/../app/bootstrap.php.cache';

if ($env === 'prod') {
    $loader = new ApcClassLoader('deploy2', $loader);
    $loader->register(true);
}

require_once __DIR__.'/../app/AppKernel.php';

$kernel = new AppKernel($env, $env === 'dev');
$kernel->loadClassCache();

$request    = Request::createFromGlobals();
$response   = $kernel->handle($request);
$response->send();

$kernel->terminate($request, $response);
