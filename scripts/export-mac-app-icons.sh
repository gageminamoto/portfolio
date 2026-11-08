#!/usr/bin/env bash
# Export the real macOS app icons for the homepage tools row.
#
# Run on a Mac that has the apps installed:
#   bash scripts/export-mac-app-icons.sh
#
# Writes public/tools/<slug>.png (256px, includes Apple's icon shadow). The
# homepage picks each file up automatically; tools without a file keep the
# drawn mock-up. Commit the PNGs.
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p public/tools

SIZE=256
# "App name:slug" — the name as it appears in /Applications, and the slug from lib/mac-apps.ts.
APPS=(
  "Figma:figma"
  "Paper:paper"
  "Linear:linear"
  "Raycast:raycast"
  "Granola:granola"
  "Grok:grok-bot"
)

for entry in "${APPS[@]}"; do
  app="${entry%%:*}"
  slug="${entry##*:}"
  bundle="/Applications/$app.app"
  [ -d "$bundle" ] || bundle="$HOME/Applications/$app.app"
  if [ ! -d "$bundle" ]; then
    echo "skip   $app (not installed)"
    continue
  fi

  out="public/tools/$slug.png"
  icon_name=$(defaults read "$bundle/Contents/Info" CFBundleIconFile 2>/dev/null || true)
  icns="$bundle/Contents/Resources/${icon_name%.icns}.icns"

  if [ -n "$icon_name" ] && [ -f "$icns" ]; then
    sips -s format png -Z "$SIZE" "$icns" --out "$out" >/dev/null
  else
    # Icon lives in an asset catalog; render the Finder thumbnail instead.
    tmp=$(mktemp -d)
    qlmanage -t -s "$SIZE" -o "$tmp" "$bundle" >/dev/null 2>&1
    mv "$tmp"/*.png "$out"
    rm -rf "$tmp"
  fi
  echo "wrote  $out"
done
