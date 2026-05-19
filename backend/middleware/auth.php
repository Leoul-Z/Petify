<?php

/**
 * Auth middleware helper.
 * Ensures a valid session exists. If not, sends a 401 JSON response and exits.
 * Call require_once this file at the top of any protected endpoint.
 */

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (empty($_SESSION['user_id'])) {
    json_response(['error' => 'Unauthenticated'], 401);
}
