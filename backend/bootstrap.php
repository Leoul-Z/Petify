<?php

// 0. Load environment variables from .env
require_once __DIR__ . '/utils/env.php';
load_env(__DIR__ . '/.env');

// 1. Session
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// 2. CORS headers — add your Render frontend URL to FRONTEND_URL env var
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowed = array_filter([
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    getenv('FRONTEND_URL') ?: '', // e.g. https://petify.onrender.com
]);
if (in_array($origin, $allowed)) {
    header('Access-Control-Allow-Origin: ' . $origin);
}
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// 3. Handle OPTIONS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// 4. Core helpers
require_once __DIR__ . '/config/db.php';
require_once __DIR__ . '/utils/response.php';
