<?php

/**
 * Bootstrap file — include at the top of every PHP API endpoint.
 *
 * Responsibilities:
 *  1. Start the PHP session (once).
 *  2. Emit CORS headers so the Vite dev server (localhost:5173) can talk to
 *     the PHP dev server (localhost:8000) with credentials.
 *  3. Short-circuit OPTIONS preflight requests immediately.
 *  4. Pull in the DB connection helper and the JSON response helper.
 */

// 1. Session
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// 2. CORS headers
header('Access-Control-Allow-Origin: http://localhost:5173');
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
