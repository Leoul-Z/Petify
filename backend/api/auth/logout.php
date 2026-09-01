<?php

require_once __DIR__ . '/../../bootstrap.php';

// Accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['error' => 'Method not allowed'], 405);
}

session_destroy();

json_response(['message' => 'Logged out']);
