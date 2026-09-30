# Hoover – web font package
Designed by Gaetan Baehr · Indian Type Foundry (Fontshare) · Licensed under ITF FFL (see LICENSE-FFL.txt)

## Structure
    css/hoover.css   -> @font-face rules (paths point to ../fonts/)
    fonts/           -> .woff2 (primary) + .woff (fallback)

## Use
    <link rel="stylesheet" href="css/hoover.css">
    body { font-family: 'Hoover-Regular', system-ui, sans-serif; }
    h1   { font-family: 'Hoover-Bold', system-ui, sans-serif; }

Available: Hoover-Thin (100), -Light (300), -Regular (400), -Medium (500), -Bold (700).

## Variable font (one file, weights 200–700)
    body { font-family: 'Hoover-Variable', system-ui, sans-serif; font-weight: 400; }
    h1   { font-family: 'Hoover-Variable', system-ui, sans-serif; font-weight: 650; }

Tip: preload the main weight for faster first paint:
    <link rel="preload" href="fonts/Hoover-Regular.woff2" as="font" type="font/woff2" crossorigin>
