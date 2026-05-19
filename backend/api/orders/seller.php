<?php

require_once __DIR__ . '/../../bootstrap.php';

$method = $_SERVER['REQUEST_METHOD'];

// ─── GET: seller's order history (auth + seller role required) ────────────────
if ($method === 'GET') {
    // Require authentication
    if (empty($_SESSION['user_id'])) {
        json_response(['error' => 'Unauthenticated'], 401);
    }

    // Require seller role
    if (($_SESSION['role'] ?? '') !== 'seller') {
        json_response(['error' => 'Forbidden'], 403);
    }

    $pdo = get_db();

    $stmt = $pdo->prepare(
        'SELECT orders.*, users.full_name AS buyer_name
         FROM orders
         JOIN users ON orders.buyer_id = users.id
         WHERE orders.seller_id = ?
         ORDER BY orders.created_at DESC'
    );
    $stmt->execute([$_SESSION['user_id']]);
    $orders = $stmt->fetchAll();

    json_response($orders);
}

// ─── Method not allowed ────────────────────────────────────────────────────────
json_response(['error' => 'Method not allowed'], 405);

