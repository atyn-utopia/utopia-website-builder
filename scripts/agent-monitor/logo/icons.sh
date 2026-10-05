#!/usr/bin/env bash
# Rasterise the PWA app icon (../public/brand/logo-app.svg, from build.py) to the
# PNG sizes the manifest and iOS ask for. macOS only: uses Quick Look + sips.
set -euo pipefail
cd "$(dirname "$0")/../public/brand"
tmp=$(mktemp -d)
qlmanage -t -s 512 -o "$tmp" logo-app.svg >/dev/null 2>&1
[ -f "$tmp/logo-app.svg.png" ] || { echo "Quick Look did not render logo-app.svg" >&2; exit 1; }
for size in 512 192 180; do
  cp "$tmp/logo-app.svg.png" "app-$size.png"
  [ "$size" = 512 ] || sips -Z "$size" "app-$size.png" >/dev/null
done
rm -rf "$tmp"
sips -g pixelWidth app-512.png app-192.png app-180.png | grep pixelWidth
