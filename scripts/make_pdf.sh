#!/usr/bin/env bash
# Build assets/cv.pdf from the site (Chrome headless, A4, continuous pages).
# Usage: scripts/make_pdf.sh        (set CHROME=/path/to/chrome to override)
set -euo pipefail
cd "$(dirname "$0")/.."

CHROME="${CHROME:-}"
if [ -z "$CHROME" ]; then
  for c in "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" google-chrome google-chrome-stable chromium chromium-browser; do
    if [ -x "$c" ] || command -v "$c" >/dev/null 2>&1; then CHROME="$c"; break; fi
  done
fi
[ -n "$CHROME" ] || { echo "Chrome not found; set CHROME=/path/to/chrome" >&2; exit 1; }

python3 scripts/build_data.py

PORT=$(python3 -c 'import socket; s = socket.socket(); s.bind(("127.0.0.1", 0)); print(s.getsockname()[1])')
python3 -m http.server "$PORT" --bind 127.0.0.1 >/dev/null 2>&1 &
SERVER=$!
trap 'kill "$SERVER" 2>/dev/null || true' EXIT
sleep 1

"$CHROME" --headless=new --disable-gpu ${CI:+--no-sandbox} --no-pdf-header-footer \
  --virtual-time-budget=10000 --print-to-pdf=assets/cv.pdf "http://127.0.0.1:$PORT/index.html" 2>&1 | grep -E "written|rror" | grep -v -E "CVDisplayLink|task_policy" || true
[ -s assets/cv.pdf ] || { echo "PDF was not created" >&2; exit 1; }
echo "assets/cv.pdf ready ($(wc -c < assets/cv.pdf) bytes)"
