<?php

require_once __DIR__ . '/../../bootstrap.php';

$method = $_SERVER['REQUEST_METHOD'];

// ─── POST: create order (auth + buyer role required) ──────────────────────────
if ($method === 'POST') {
    // Require authentication
    if (empty($_SESSION['user_id'])) {
        json_response(['error' => 'Unauthenticated'], 401);
    }

    // Require buyer role
    if (($_SESSION['role'] ?? '') !== 'buyer') {
        json_response(['error' => 'Forbidden'], 403);
    }

    $body       = json_decode(file_get_contents('php://input'), true) ?? [];
    $listing_id = trim($body['listing_id'] ?? '');

    if ($listing_id === '') {
        json_response(['error' => 'listing_id is required'], 422);
    }

    $pdo = get_db();

    // Fetch the listing
    $stmt = $pdo->prepare('SELECT * FROM listings WHERE id = ?');
    $stmt->execute([$listing_id]);
    $listing = $stmt->fetch();

    if (!$listing) {
        json_response(['error' => 'Not found'], 404);
    }

    if ($listing['status'] !== 'active') {
        json_response(['error' => 'Listing is not available'], 400);
    }

    // Simulate payment — always succeeds unless ?fail=1 is passed (for testing)
    $payment_success = !(isset($_GET['fail']) && $_GET['fail'] === '1');

    if (!$payment_success) {
        json_response(['ok' => false, 'error' => 'Payment failed']);
    }

    // Generate UUID v4
    $order_id = sprintf(
        '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        mt_rand(0, 0xffff), mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0x0fff) | 0x4000,
        mt_rand(0, 0x3fff) | 0x8000,
        mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
    );

    // Insert order
    $stmt = $pdo->prepare(
        'INSERT INTO orders (id, buyer_id, seller_id, listing_id, pet_name, price_usd, status)
         VALUES (?, ?, ?, ?, ?, ?, \'confirmed\')'
    );
    $stmt->execute([
        $order_id,
        $_SESSION['user_id'],
        $listing['seller_id'],
        $listing_id,
        $listing['name'],
        $listing['price_usd'],
    ]);

    // Mark listing as sold
    $stmt = $pdo->prepare("UPDATE listings SET status = 'sold' WHERE id = ?");
    $stmt->execute([$listing_id]);

    // Return the created order
    $stmt = $pdo->prepare('SELECT * FROM orders WHERE id = ?');
    $stmt->execute([$order_id]);
    $order = $stmt->fetch();

    json_response($order, 201);
}

// ─── GET: buyer's order history (auth + buyer role required) ──────────────────
if ($method === 'GET') {
    // Require authentication
    if (empty($_SESSION['user_id'])) {
        json_response(['error' => 'Unauthenticated'], 401);
    }

    // Require buyer role
    if (($_SESSION['role'] ?? '') !== 'buyer') {
        json_response(['error' => 'Forbidden'], 403);
    }

    $pdo = get_db();

    $stmt = $pdo->prepare(
        'SELECT orders.*, listings.photo_url
         FROM orders
         LEFT JOIN listings ON orders.listing_id = listings.id
         WHERE orders.buyer_id = ?
         ORDER BY orders.created_at DESC'
    );
    $stmt->execute([$_SESSION['user_id']]);
    $orders = $stmt->fetchAll();

    json_response($orders);
}

// ─── Method not allowed ────────────────────────────────────────────────────────
json_response(['error' => 'Method not allowed'], 405);
