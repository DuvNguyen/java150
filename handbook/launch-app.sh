#!/usr/bin/env bash

# Load NVM & Node environment if available
export NVM_DIR="$HOME/.nvm"
if [ -s "$NVM_DIR/nvm.sh" ]; then
    source "$NVM_DIR/nvm.sh"
fi

# Fallback path if nvm not in standard shell
export PATH="$HOME/.nvm/versions/node/$(ls $HOME/.nvm/versions/node 2>/dev/null | tail -n 1)/bin:$PATH:/usr/local/bin:/usr/bin"

PROJECT_DIR="/home/levi/Desktop/Projects/java150/handbook"
cd "$PROJECT_DIR" || exit 1

PORT=3000
URL="http://localhost:$PORT"

# Check if port is already serving
is_server_running() {
    curl -s -o /dev/null -w "%{http_code}" "$URL" 2>/dev/null | grep -E "^[23]" >/dev/null
}

if ! is_server_running; then
    # Start Next.js dev server in background
    nohup npm run dev > /tmp/handbook-dev.log 2>&1 &
    
    # Wait for server to start (max 20 seconds)
    for i in {1..40}; do
        if is_server_running; then
            break
        fi
        sleep 0.5
    done
fi

# Launch in App Mode (standalone window) using Chrome or default browser
if command -v google-chrome >/dev/null 2>&1; then
    google-chrome --app="$URL" >/dev/null 2>&1 &
elif command -v chromium-browser >/dev/null 2>&1; then
    chromium-browser --app="$URL" >/dev/null 2>&1 &
elif command -v chromium >/dev/null 2>&1; then
    chromium --app="$URL" >/dev/null 2>&1 &
else
    xdg-open "$URL" >/dev/null 2>&1 &
fi
