#!/bin/bash
# Full deploy script

if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

DECK_IP="${DECK_IP}"
DECK_USER="${DECK_USER:-deck}"

if [ -z "$DECK_IP" ]; then
  echo "Error: DECK_IP is not set. Please create a .env file with DECK_IP or set it in your environment."
  exit 1
fi
PLUGIN_DIR="~/homebrew/plugins/decky-nonsteam-badges"

echo "Building plugin..."
pnpm run build

echo "Stopping plugin loader to clear cache..."
ssh -t ${DECK_USER}@$DECK_IP "sudo systemctl stop plugin_loader"

echo "Deleting old files to force reload..."
ssh ${DECK_USER}@$DECK_IP "rm -rf $PLUGIN_DIR/dist"

echo "Copying files to Steam Deck..."
scp .env ${DECK_USER}@$DECK_IP:$PLUGIN_DIR/
# Copy main files
scp main.py plugin.json package.json .env ${DECK_USER}@$DECK_IP:$PLUGIN_DIR/
# Copy dist directory with proper structure
scp -r dist ${DECK_USER}@$DECK_IP:$PLUGIN_DIR/
# Copy optional directories
scp -r py_modules ${DECK_USER}@$DECK_IP:$PLUGIN_DIR/ 2>/dev/null || true
scp -r assets ${DECK_USER}@$DECK_IP:$PLUGIN_DIR/ 2>/dev/null || true

echo "Starting plugin loader..."
ssh -t ${DECK_USER}@$DECK_IP "sudo systemctl start plugin_loader"

echo "Deploy complete! Check logs on your Steam Deck."
echo "Version deployed: $(grep version package.json | head -1 | awk -F: '{ print $2 }' | sed 's/[", ]//g')"
