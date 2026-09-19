#!/usr/bin/env bash
set -euo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_FILE="$APP_DIR/noggin-joggin.log"

cd "$APP_DIR"

echo "Pulling latest changes..."
git pull --ff-only

echo "Installing dependencies..."
npm install

echo "Building Noggin Joggin..."
npm run build

echo "Stopping the previous server..."
fuser -k 3000/tcp 2>/dev/null || true
sleep 1

echo "Starting Noggin Joggin on port 3000..."
nohup env PORT=3000 HOST=0.0.0.0 npm start > "$LOG_FILE" 2>&1 &
echo "Noggin Joggin is running. Logs: $LOG_FILE"
