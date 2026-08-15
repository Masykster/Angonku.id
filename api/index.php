<?php

/**
 * Entrypoint for Vercel Serverless Function (vercel-php)
 */

if (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https') {
    $_SERVER['HTTPS'] = 'on';
    $_SERVER['SERVER_PORT'] = 443;
}

require __DIR__ . '/../public/index.php';
