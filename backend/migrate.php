<?php

require_once __DIR__ . '/utils/env.php';
load_env(__DIR__ . '/.env');
require_once __DIR__ . '/config/db.php';

$pdo = get_db();

echo "Running schema migrations...\n\n";

$sql = file_get_contents(__DIR__ . '/schema.sql');

try {
    $pdo->exec($sql);
    echo "✓ Tables created successfully!\n";
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}

echo "\nMigration complete. You can now run: php seed.php\n";
