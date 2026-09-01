# install-php.ps1 — Downloads and sets up PHP 8.3 without admin rights

$phpDir = "C:\php"
$zipPath = "$env:TEMP\php.zip"

Write-Host "Finding latest PHP 8.3 NTS x64 for Windows..." -ForegroundColor Cyan

# Scrape the releases page to find the real filename
$page = (New-Object Net.WebClient).DownloadString('https://windows.php.net/downloads/releases/')
$match = [regex]::Match($page, 'php-8\.3\.\d+-nts-Win32-vs16-x64\.zip')
if (-not $match.Success) {
    Write-Host "ERROR: Could not find PHP 8.3 download link." -ForegroundColor Red
    exit 1
}

$filename = $match.Value
$url = "https://windows.php.net/downloads/releases/$filename"
Write-Host "Downloading: $url" -ForegroundColor Cyan

(New-Object Net.WebClient).DownloadFile($url, $zipPath)
Write-Host "Download complete. Extracting to $phpDir..." -ForegroundColor Cyan

if (Test-Path $phpDir) { Remove-Item $phpDir -Recurse -Force }
Expand-Archive -Path $zipPath -DestinationPath $phpDir -Force

# Setup php.ini with required extensions
$ini = "$phpDir\php.ini"
Copy-Item "$phpDir\php.ini-development" $ini

# Enable required extensions
(Get-Content $ini) `
    -replace ';extension=pdo_pgsql', 'extension=pdo_pgsql' `
    -replace ';extension=pgsql',     'extension=pgsql' `
    -replace ';extension=openssl',   'extension=openssl' `
    -replace ';extension=mbstring',  'extension=mbstring' `
    | Set-Content $ini

Write-Host "PHP installed to $phpDir" -ForegroundColor Green

# Add to current session PATH
$env:PATH = "C:\php;$env:PATH"

# Persist to user PATH
$userPath = [Environment]::GetEnvironmentVariable('PATH', 'User')
if ($userPath -notlike '*C:\php*') {
    [Environment]::SetEnvironmentVariable('PATH', "C:\php;$userPath", 'User')
    Write-Host "Added C:\php to your user PATH (restart terminal to take effect)" -ForegroundColor Yellow
}

Write-Host ""
php -v
Write-Host ""
Write-Host "All done! PHP is ready." -ForegroundColor Green
Write-Host "Now run: php seed.php (from the backend folder)" -ForegroundColor Cyan
