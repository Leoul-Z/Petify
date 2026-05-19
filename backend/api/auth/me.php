<?php

require_once __DIR__ . '/../../bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_response(['error' => 'Method not allowed'], 405);
}

if (empty($_SESSION['user_id'])) {
    json_response(['error' => 'Unauthenticated'], 401);
}
$pdo = get_db();

// Fetch user from DB
$stmt = $pdo->prepare('SELECT id, full_name, email, role FROM users WHERE id = ? LIMIT 1');
$stmt->execute([$_SESSION['user_id']]);
$user = $stmt->fetch();

if (!$user) {
    session_destroy();
    json_response(['error' => 'Unauthenticated'], 401);
}

json_response($user);
