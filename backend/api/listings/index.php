<?php

require_once __DIR__ . '/../../bootstrap.php';

$method = $_SERVER['REQUEST_METHOD'];

// ─── GET: public listing search ───────────────────────────────────────────────
if ($method === 'GET') {
    $pdo = get_db();

    $search    = isset($_GET['search'])    ? trim($_GET['search'])    : null;
    $species   = isset($_GET['species'])   ? trim($_GET['species'])   : null;
    $min_price = isset($_GET['min_price']) ? $_GET['min_price']       : null;
    $max_price = isset($_GET['max_price']) ? $_GET['max_price']       : null;

    $sql    = "SELECT * FROM listings WHERE status = 'active'";
    $params = [];

    if ($search !== null && $search !== '') {
        $sql     .= " AND (name LIKE ? OR breed LIKE ?)";
        $like     = '%' . $search . '%';
        $params[] = $like;
        $params[] = $like;
    }

    if ($species !== null && $species !== '') {
        $sql     .= " AND species = ?";
        $params[] = $species;
    }

    if ($min_price !== null && $min_price !== '') {
        $sql     .= " AND price_usd >= ?";
        $params[] = (float) $min_price;
    }

    if ($max_price !== null && $max_price !== '') {
        $sql     .= " AND price_usd <= ?";
        $params[] = (float) $max_price;
    }

    $sql .= " ORDER BY created_at DESC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $listings = $stmt->fetchAll();

    json_response($listings);
}

// ─── POST: create listing (auth + seller role required) ───────────────────────
if ($method === 'POST') {
    // Require authentication
    if (empty($_SESSION['user_id'])) {
        json_response(['error' => 'Unauthenticated'], 401);
    }

    // Require seller role
    if (($_SESSION['role'] ?? '') !== 'seller') {
        json_response(['error' => 'Forbidden'], 403);
    }

    $raw  = file_get_contents('php://input');
    $body = json_decode($raw, true, 512, JSON_BIGINT_AS_STRING) ?? [];

    if (json_last_error() !== JSON_ERROR_NONE) {
        json_response(['error' => 'Invalid JSON body: ' . json_last_error_msg()], 400);
    }

    $name        = trim($body['name']        ?? '');
    $species     = trim($body['species']     ?? '');
    $breed       = trim($body['breed']       ?? '');
    $age_months  = $body['age_months']  ?? null;
    $price_usd   = $body['price_usd']   ?? null;
    $description = trim($body['description'] ?? '');
    $photo_url   = $body['photo_url']   ?? '';  // do NOT trim — base64 must not be modified

    // Validate required fields
    $errors = [];

    if ($name === '') {
        $errors['name'] = 'Name is required';
    }

    if ($species === '') {
        $errors['species'] = 'Species is required';
    }

    if ($breed === '') {
        $errors['breed'] = 'Breed is required';
    }

    if ($age_months === null || $age_months === '') {
        $errors['age_months'] = 'Age (months) is required';
    } elseif (!is_numeric($age_months) || (int) $age_months != $age_months || (int) $age_months <= 0) {
        $errors['age_months'] = 'Age must be a positive integer';
    }

    if ($price_usd === null || $price_usd === '') {
        $errors['price_usd'] = 'Price is required';
    } elseif (!is_numeric($price_usd) || (float) $price_usd <= 0) {
        $errors['price_usd'] = 'Price must be a positive number';
    }

    if (!empty($errors)) {
        json_response(['errors' => $errors], 422);
    }

    // Generate UUID v4
    $uuid = sprintf(
        '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        mt_rand(0, 0xffff), mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0x0fff) | 0x4000,
        mt_rand(0, 0x3fff) | 0x8000,
        mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
    );

    $pdo = get_db();

    $stmt = $pdo->prepare(
        'INSERT INTO listings (id, seller_id, name, species, breed, age_months, price_usd, description, photo_url, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, \'active\')'
    );
    $stmt->execute([
        $uuid,
        $_SESSION['user_id'],
        $name,
        $species,
        $breed,
        (int) $age_months,
        (float) $price_usd,
        $description !== '' ? $description : null,
        $photo_url   !== '' ? $photo_url   : null,
    ]);

    // Return the created listing
    $stmt = $pdo->prepare('SELECT * FROM listings WHERE id = ?');
    $stmt->execute([$uuid]);
    $listing = $stmt->fetch();

    json_response($listing, 201);
}

// ─── Method not allowed ────────────────────────────────────────────────────────
json_response(['error' => 'Method not allowed'], 405);

