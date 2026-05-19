<?php

require_once __DIR__ . '/../../bootstrap.php';

$method = $_SERVER['REQUEST_METHOD'];
$id     = trim($_GET['id'] ?? '');

if ($id === '') {
    json_response(['error' => 'Missing listing id'], 400);
}

$pdo = get_db();

if ($method === 'GET') {
    $stmt = $pdo->prepare('SELECT * FROM listings WHERE id = ?');
    $stmt->execute([$id]);
    $listing = $stmt->fetch();

    if (!$listing) {
        json_response(['error' => 'Not found'], 404);
    }

    json_response($listing);
}

if ($method === 'PUT') {
    // Require authentication
    if (empty($_SESSION['user_id'])) {
        json_response(['error' => 'Unauthenticated'], 401);
    }

    $stmt = $pdo->prepare('SELECT * FROM listings WHERE id = ?');
    $stmt->execute([$id]);
    $listing = $stmt->fetch();

    if (!$listing) {
        json_response(['error' => 'Not found'], 404);
    }

    if ($listing['seller_id'] !== $_SESSION['user_id']) {
        json_response(['error' => 'Forbidden'], 403);
    }

    $body = json_decode(file_get_contents('php://input'), true, 512, JSON_BIGINT_AS_STRING) ?? [];

    // Merge incoming fields over existing values
    $name        = isset($body['name'])        ? trim($body['name'])        : $listing['name'];
    $species     = isset($body['species'])     ? trim($body['species'])     : $listing['species'];
    $breed       = isset($body['breed'])       ? trim($body['breed'])       : $listing['breed'];
    $age_months  = isset($body['age_months'])  ? $body['age_months']        : $listing['age_months'];
    $price_usd   = isset($body['price_usd'])   ? $body['price_usd']         : $listing['price_usd'];
    $description = isset($body['description']) ? trim($body['description']) : $listing['description'];
    $photo_url   = isset($body['photo_url'])   ? $body['photo_url']         : $listing['photo_url'];

    $stmt = $pdo->prepare(
        'UPDATE listings
         SET name = ?, species = ?, breed = ?, age_months = ?, price_usd = ?,
             description = ?, photo_url = ?, updated_at = NOW()
         WHERE id = ?'
    );
    $stmt->execute([
        $name,
        $species,
        $breed,
        (int) $age_months,
        (float) $price_usd,
        $description,
        $photo_url,
        $id,
    ]);

    // Return updated listing
    $stmt = $pdo->prepare('SELECT * FROM listings WHERE id = ?');
    $stmt->execute([$id]);
    $updated = $stmt->fetch();

    json_response($updated);
}

if ($method === 'DELETE') {
    // Require authentication
    if (empty($_SESSION['user_id'])) {
        json_response(['error' => 'Unauthenticated'], 401);
    }

    $stmt = $pdo->prepare('SELECT * FROM listings WHERE id = ?');
    $stmt->execute([$id]);
    $listing = $stmt->fetch();

    if (!$listing) {
        json_response(['error' => 'Not found'], 404);
    }

    if ($listing['seller_id'] !== $_SESSION['user_id']) {
        json_response(['error' => 'Forbidden'], 403);
    }

    $stmt = $pdo->prepare("UPDATE listings SET status = 'deleted' WHERE id = ?");
    $stmt->execute([$id]);

    $stmt = $pdo->prepare(
        "UPDATE orders SET status = 'cancelled' WHERE listing_id = ? AND status = 'confirmed'"
    );
    $stmt->execute([$id]);

    json_response(['message' => 'Listing deleted']);
}

json_response(['error' => 'Method not allowed'], 405);

