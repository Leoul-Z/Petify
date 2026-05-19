<?php
/**
 * Petify Marketplace — Seed Script
 *
 * Inserts sample users and listings for demo/development purposes.
 *
 * Usage:
 *   php backend/seed.php
 *
 * Requirements:
 *   - MySQL database 'petify' must exist (run backend/schema.sql first)
 *   - DB credentials must be configured in backend/config/db.php
 */

require_once __DIR__ . '/config/db.php';

$pdo = get_db();

echo "Seeding Petify database...\n\n";

//  Helper: generate UUID v4 
function uuid(): string {
    return sprintf(
        '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        mt_rand(0, 0xffff), mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0x0fff) | 0x4000,
        mt_rand(0, 0x3fff) | 0x8000,
        mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
    );
}

//  Seller users 
$sellers = [
    [
        'id'        => uuid(),
        'full_name' => 'Alice Petersen',
        'email'     => 'alice@example.com',
        'password'  => password_hash('password123', PASSWORD_BCRYPT),
        'role'      => 'seller',
    ],
    [
        'id'        => uuid(),
        'full_name' => 'Bob Furlong',
        'email'     => 'bob@example.com',
        'password'  => password_hash('password123', PASSWORD_BCRYPT),
        'role'      => 'seller',
    ],
];

$insertUser = $pdo->prepare(
    'INSERT IGNORE INTO users (id, full_name, email, password, role)
     VALUES (:id, :full_name, :email, :password, :role)'
);

foreach ($sellers as $seller) {
    $insertUser->execute($seller);
    echo "  Seller: {$seller['full_name']} <{$seller['email']}>\n";
}

echo "\n";

//  Sample listings 

$listings = [
    [
        'id'          => uuid(),
        'seller_id'   => $sellers[0]['id'],
        'name'        => 'Buddy',
        'species'     => 'Dog',
        'breed'       => 'Golden Retriever',
        'age_months'  => 8,
        'price_usd'   => 450.00,
        'description' => 'Buddy is a playful and affectionate Golden Retriever puppy. He loves fetch and cuddles.',
        'photo_url'   => null,
        'status'      => 'active',
    ],
    [
        'id'          => uuid(),
        'seller_id'   => $sellers[0]['id'],
        'name'        => 'Luna',
        'species'     => 'Cat',
        'breed'       => 'Siamese',
        'age_months'  => 5,
        'price_usd'   => 280.00,
        'description' => 'Luna is a curious and vocal Siamese kitten. She gets along well with other cats.',
        'photo_url'   => null,
        'status'      => 'active',
    ],
    [
        'id'          => uuid(),
        'seller_id'   => $sellers[1]['id'],
        'name'        => 'Max',
        'species'     => 'Dog',
        'breed'       => 'Beagle',
        'age_months'  => 12,
        'price_usd'   => 350.00,
        'description' => 'Max is a friendly and energetic Beagle. He is house-trained and loves long walks.',
        'photo_url'   => null,
        'status'      => 'active',
    ],
    [
        'id'          => uuid(),
        'seller_id'   => $sellers[1]['id'],
        'name'        => 'Cleo',
        'species'     => 'Rabbit',
        'breed'       => 'Holland Lop',
        'age_months'  => 3,
        'price_usd'   => 120.00,
        'description' => 'Cleo is a gentle Holland Lop rabbit with floppy ears. Perfect for a calm household.',
        'photo_url'   => null,
        'status'      => 'active',
    ],
];

$insertListing = $pdo->prepare(
    'INSERT IGNORE INTO listings (id, seller_id, name, species, breed, age_months, price_usd, description, photo_url, status)
     VALUES (:id, :seller_id, :name, :species, :breed, :age_months, :price_usd, :description, :photo_url, :status)'
);

foreach ($listings as $listing) {
    $insertListing->execute($listing);
    echo "  Listing: {$listing['name']} ({$listing['species']}, {$listing['breed']}) — \${$listing['price_usd']}\n";
}

echo "\nSeed complete!\n";
echo "\nDemo credentials (password: password123):\n";
echo "  Seller 1: alice@example.com\n";
echo "  Seller 2: bob@example.com\n";
