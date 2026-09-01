<?php

require_once __DIR__ . '/../../bootstrap.php';

// Only accept POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['error' => 'Method not allowed'], 405);
}

// Read JSON body
$body = json_decode(file_get_contents('php://input'), true) ?? [];

$email    = trim($body['email'] ?? '');
$password = $body['password'] ?? '';

$pdo = get_db();

// Look up user by email
$stmt = $pdo->prepare('SELECT id, full_name, email, password, role FROM users WHERE email = ? LIMIT 1');
$stmt->execute([$email]);
$user = $stmt->fetch();

// Verify credentials
if (!$user || !password_verify($password, $user['password'])) {
    json_response(['error' => 'Invalid email or password'], 401);
}

// Set session
$_SESSION['user_id'] = $user['id'];
$_SESSION['role']    = $user['role'];

json_response([
    'id'        => $user['id'],
    'full_name' => $user['full_name'],
    'email'     => $user['email'],
    'role'      => $user['role'],
]);
