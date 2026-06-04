#!/usr/bin/env bash
# Render every diagrams-src/*.excalidraw to public/diagrams/*.svg using the
# bundled dependency-free converter (tools/render_svg.py). Run from anywhere:
#   bash render-diagrams.sh
set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"

shopt -s nullglob
for f in "$ROOT"/diagrams-src/*.excalidraw; do
  name="$(basename "$f" .excalidraw)"
  case "$name" in _*) continue ;; esac   # skip _smoketest etc.
  python3 "$ROOT/tools/render_svg.py" "$f" "$ROOT/public/diagrams/$name.svg"
done
echo "✓ diagrams rendered to public/diagrams/"
