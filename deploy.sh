#!/bin/bash
# Full deploy script

if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

DECK_IP="${DECK_IP}"
DECK_USER="${DECK_USER:-deck}"
DECK_USER_HOME="/home/${DECK_USER}"
PLUGIN_NAME="decky-nonsteam-badges"

if [ -z "$DECK_IP" ]; then
  echo "Error: DECK_IP is not set. Please create a .env file with DECK_IP or set it in your environment."
  exit 1
fi

if [ -z "$DECK_PASS" ]; then
  echo "Error: DECK_PASS is not set. Please create a .env file with DECK_PASS or set it in your environment."
  exit 1
fi

echo "Building plugin..."
pnpm run build

echo "Stopping plugin loader to clear cache..."
ssh -t ${DECK_USER}@$DECK_IP "sudo systemctl stop plugin_loader"

# Ensure permissions
echo "Ensuring permissions..."
# We need to make sure the folder is writable by deck, or remove it entirely
ssh -t deck@$DECK_IP "echo $DECK_PASS | sudo -S rm -rf $DECK_USER_HOME/homebrew/plugins/$PLUGIN_NAME && echo $DECK_PASS | sudo -S mkdir -p $DECK_USER_HOME/homebrew/plugins/$PLUGIN_NAME && echo $DECK_PASS | sudo -S chown -R deck:deck $DECK_USER_HOME/homebrew/plugins/$PLUGIN_NAME"

echo "Copying dist files to Steam Deck..."
scp -r dist deck@$DECK_IP:$DECK_USER_HOME/homebrew/plugins/$PLUGIN_NAME/
scp -r py_modules deck@$DECK_IP:$DECK_USER_HOME/homebrew/plugins/$PLUGIN_NAME/
scp -r assets deck@$DECK_IP:$DECK_USER_HOME/homebrew/plugins/$PLUGIN_NAME/
scp plugin.json deck@$DECK_IP:$DECK_USER_HOME/homebrew/plugins/$PLUGIN_NAME/
scp package.json deck@$DECK_IP:$DECK_USER_HOME/homebrew/plugins/$PLUGIN_NAME/
scp .env deck@$DECK_IP:$DECK_USER_HOME/homebrew/plugins/$PLUGIN_NAME/
scp main.py deck@$DECK_IP:$DECK_USER_HOME/homebrew/plugins/$PLUGIN_NAME/

echo "Starting plugin loader..."
ssh -t ${DECK_USER}@$DECK_IP "sudo systemctl start plugin_loader"

echo "Deploy complete! Check logs on your Steam Deck."
echo "Version deployed: $(grep version package.json | head -1 | awk -F: '{ print $2 }' | sed 's/[", ]//g')"
