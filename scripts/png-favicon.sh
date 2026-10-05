#!/usr/bin/env bash
# Install a favicon PNG (from Lylia / Codex) into a Next.js app dir, as-is.
#
#   scripts/png-favicon.sh <favicon.png> <project>/app
#
# Writes:
#   app/icon.svg        the PNG, resized to 256px and embedded in an SVG
#                       wrapper — not traced. The wizard's `favicon` check
#                       requires app/icon.svg on template sites.
#   app/apple-icon.png  180px PNG — Safari and iOS ignore SVG favicons.
#
# Resizes with macOS `sips`, which keeps PNG as PNG (alpha intact). Never
# converts the format.
set -euo pipefail

if [ $# -ne 2 ]; then
  echo "usage: $0 <favicon.png> <project>/app" >&2
  exit 2
fi
src=$1
app=$2

file "$src" | grep -q 'PNG image data.*RGBA' || { echo "$src is not an RGBA PNG" >&2; exit 1; }
[ -d "$app" ] || { echo "$app is not a directory" >&2; exit 1; }
command -v sips >/dev/null || { echo "sips not found (macOS only)" >&2; exit 1; }

tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT

# -z H W forces a square; the favicon brief asks for a square canvas anyway.
sips -s format png -z 256 256 "$src" --out "$tmp/icon-256.png" >/dev/null
sips -s format png -z 180 180 "$src" --out "$app/apple-icon.png" >/dev/null

b64=$(base64 < "$tmp/icon-256.png" | tr -d '\n')
cat > "$app/icon.svg" <<SVG
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256"><image width="256" height="256" href="data:image/png;base64,${b64}"/></svg>
SVG

echo "$app/icon.svg ($(wc -c < "$app/icon.svg" | tr -d ' ') bytes)"
echo "$app/apple-icon.png"
