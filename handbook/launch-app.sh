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

PID_FILE="/tmp/handbook.pid"
PORT_FILE="/tmp/handbook.port"

get_listening_port_of_pid() {
    local pid="$1"
    local port
    port=$(ss -tulpn 2>/dev/null | grep "pid=$pid," | grep -oP '(?<=:)\d+(?=\s)' | head -n 1)
    if [ -z "$port" ]; then
        local child_pids
        child_pids=$(pgrep -P "$pid" 2>/dev/null)
        for cpid in $child_pids; do
            port=$(ss -tulpn 2>/dev/null | grep "pid=$cpid," | grep -oP '(?<=:)\d+(?=\s)' | head -n 1)
            [ -n "$port" ] && break
        done
    fi
    echo "$port"
}

is_handbook_server_alive() {
    if [ -f "$PID_FILE" ]; then
        local pid
        pid=$(cat "$PID_FILE" 2>/dev/null)
        if [ -n "$pid" ] && kill -0 "$pid" 2>/dev/null; then
            local port
            port=$(cat "$PORT_FILE" 2>/dev/null)
            if [ -z "$port" ]; then
                port=$(get_listening_port_of_pid "$pid")
            fi
            if [ -n "$port" ]; then
                if curl -s -o /dev/null -w "%{http_code}" "http://localhost:$port" 2>/dev/null | grep -E "^[23]" >/dev/null; then
                    PORT="$port"
                    return 0
                fi
            fi
        fi
    fi

    local existing_pid
    existing_pid=$(pgrep -f "node.*handbook.*next dev" | head -n 1)
    if [ -n "$existing_pid" ]; then
        local port
        port=$(get_listening_port_of_pid "$existing_pid")
        if [ -n "$port" ] && curl -s -o /dev/null -w "%{http_code}" "http://localhost:$port" 2>/dev/null | grep -E "^[23]" >/dev/null; then
            echo "$existing_pid" > "$PID_FILE"
            echo "$port" > "$PORT_FILE"
            PORT="$port"
            return 0
        fi
    fi

    return 1
}

if ! is_handbook_server_alive; then
    # Clean up any dead/stale Next.js processes for this project
    pkill -f "node.*handbook.*next dev" 2>/dev/null || true
    sleep 0.2

    # Auto-detect available port starting from 3000
    if [ -f "./node_modules/.bin/detect-port" ]; then
        PORT=$(./node_modules/.bin/detect-port 3000)
    else
        PORT=$(npx --no-install detect-port 3000 2>/dev/null || echo 3000)
    fi

    URL="http://localhost:$PORT"

    # Start Next.js dev server on the detected port
    nohup npm run dev -- -p "$PORT" > /tmp/handbook-dev.log 2>&1 &
    SERVER_PID=$!
    echo "$SERVER_PID" > "$PID_FILE"
    echo "$PORT" > "$PORT_FILE"

    # Wait for server to start (max 20 seconds)
    for i in {1..40}; do
        if curl -s -o /dev/null -w "%{http_code}" "$URL" 2>/dev/null | grep -E "^[23]" >/dev/null; then
            break
        fi
        sleep 0.5
    done
fi

URL="http://localhost:$PORT"

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


