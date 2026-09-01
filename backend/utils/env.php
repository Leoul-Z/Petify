<?php

/**
 * Minimal .env loader — no Composer dependency required.
 * Reads KEY=VALUE pairs and injects them into getenv() / $_ENV / $_SERVER.
 */
function load_env(string $path): void {
    if (!file_exists($path)) return;

    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $line = trim($line);
        // Skip comments and blank lines
        if ($line === '' || str_starts_with($line, '#')) continue;

        [$key, $value] = array_map('trim', explode('=', $line, 2));
        if (!$key) continue;

        // Strip optional surrounding quotes
        $value = trim($value, '"\'');

        putenv("$key=$value");
        $_ENV[$key]    = $value;
        $_SERVER[$key] = $value;
    }
}
