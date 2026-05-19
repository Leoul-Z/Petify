<?php

require_once __DIR__ . '/../../bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['error' => 'Method not allowed'], 405);
}
$body = json_decode(file_get_contents('php://input'), true) ?? [];

$full_name = trim($body['full_name'] ?? '');
$email     = trim($body['email'] ?? '');
$password  = $body['password'] ?? '';
$role      = $body['role'] ?? '';

// Validate
$errors = [];

if ($full_name === '') {
    $errors['full_name'] = 'Full name is required';
}

if ($email === '') {
    $errors['email'] = 'Email is required';
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors['email'] = 'Invalid email format';
}

if ($password === '') {
    $errors['password'] = 'Password is required';
} elseif (strlen($password) < 8) {
    $errors['password'] = 'Password must be at least 8 characters';
}

if (!in_array($role, ['buyer', 'seller'], true)) {
    $errors['role'] = 'Role must be buyer or seller';
}

if (!empty($errors)) {
    json_response(['errors' => $errors], 422);
}

$pdo = get_db();

$stmt = $pdo->prepare('SELECT id FROM users WHERE email = ? LIMIT 1');
$stmt->execute([$email]);
if ($stmt->fetch()) {
    json_response(['error' => 'Email already in use'], 409);
}

// Hash password
$hashed = password_hash($password, PASSWORD_BCRYPT);

// Generate UUID v4
$uuid = sprintf(
    '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
    mt_rand(0, 0xffff), mt_rand(0, 0xffff),
    mt_rand(0, 0xffff),
    mt_rand(0, 0x0fff) | 0x4000,
    mt_rand(0, 0x3fff) | 0x8000,
    mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
);

$stmt = $pdo->prepare(
    'INSERT INTO users (id, full_name, email, password, role) VALUES (?, ?, ?, ?, ?)'
);
$stmt->execute([$uuid, $full_name, $email, $hashed, $role]);

$stmt = $pdo->prepare('SELECT id, full_name, email, role, created_at FROM users WHERE id = ?');
$stmt->execute([$uuid]);
$user = $stmt->fetch();

json_response($user, 201);
