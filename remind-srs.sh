#!/usr/bin/env bash

# Script kiểm tra tiến độ Spaced Repetition và gửi thông báo Desktop trên Ubuntu
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROGRESS_FILE="$PROJECT_DIR/srs_progress.json"

# Thiết lập biến môi trường hiển thị cho Desktop Session nếu chạy từ cron/systemd
export DISPLAY="${DISPLAY:-:0}"
export DBUS_SESSION_BUS_ADDRESS="${DBUS_SESSION_BUS_ADDRESS:-unix:path=/run/user/$(id -u)/bus}"

if [ ! -f "$PROGRESS_FILE" ]; then
    echo "Chưa tìm thấy file tiến độ srs_progress.json."
    exit 0
fi

# Chạy Python script kiểm tra số bài đến hạn
COUNT=$(python3 -c "
import json
from datetime import datetime

try:
    with open('$PROGRESS_FILE', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    today = datetime.now().strftime('%Y-%m-%d')
    due_count = 0
    for pid, pdata in data.items():
        if pdata.get('status') == 'mastered' and pdata.get('nextReview', '') <= today:
            due_count += 1
    print(due_count)
except Exception as e:
    print(0)
")

if [ "$COUNT" -gt 0 ]; then
    echo "Phát hiện $COUNT bài tập cần ôn tập hôm nay."
    if command -v notify-send >/dev/null 2>&1; then
        notify-send "NeetCode 150 SRS" "Hôm nay bạn có $COUNT bài toán DSA cần ôn tập lại!" -i dialog-information -u normal
    fi
else
    echo "Không có bài tập nào cần ôn tập hôm nay."
fi
