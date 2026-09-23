# TODO & Ghi Chú Dự Án

## Spaced Repetition (SRS) Reminder

> [!NOTE]
> Khi bạn thiết lập Cron Job hoặc Systemd Timer (chạy ngầm lúc 08:00 sáng mỗi ngày), máy tính Ubuntu sẽ tự động kiểm tra và bắn thông báo nhắc nhở lên màn hình ngay cả khi bạn chưa hề bật app. Khi thấy thông báo có bài đến hạn, bạn mới cần click mở app để ôn tập.

### Các bước thiết lập nhanh:
- **Cronjob**: Chạy `crontab -e` và thêm dòng:
  ```cron
  0 8 * * * DISPLAY=:0 DBUS_SESSION_BUS_ADDRESS=unix:path=/run/user/1000/bus /projects/java150/remind-srs.sh >/dev/null 2>&1
  ```
- **Hoặc Systemd Timer**: Xem chi tiết cài đặt tại [docs/SRS_APP.md](file:///projects/java150/docs/SRS_APP.md#5-thiết-lập-tự-động-thông-báo-desktop-notify-send).
