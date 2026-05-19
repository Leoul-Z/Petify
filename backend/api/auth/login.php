<?php

require_once __DIR__ . '/../../bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['error' => 'Method not allowed'], 405);
}

$body = json_decode(file_get_contents('php://input'), true) ?? [];

$email    = trim($body['email'] ?? '');
$password = $body['password'] ?? '';

$pdo = get_db();

$stmt = $pdo->prepare('SELECT id, full_name, email, password, role FROM users WHERE email = ? LIMIT 1');
$stmt->execute([$email]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user['password'])) {
    json_response(['error' => 'Invalid email or password'], 401);
}

$_SESSION['user_id'] = $user['id'];
$_SESSION['role']    = $user['role'];

json_response([
    'id'        => $user['id'],
    'full_name' => $user['full_name'],
    'email'     => $user['email'],
    'role'      => $user['role'],
]);
