# Java Data Structures & Algorithms (Java DSA)

Dự án này là môi trường dành cho việc học tập, nghiên cứu và thực hành **Cấu trúc dữ liệu và Giải thuật (Data Structures & Algorithms - DSA)** bằng ngôn ngữ **Java**.

## Mục tiêu dự án
- Học tập và cài đặt các Cấu trúc dữ liệu (Array, Linked List, Stack, Queue, Tree, Heap, Graph, Hash Table,...).
- Thực hành các Thuật toán (Sorting, Searching, Recursion, Dynamic Programming, Greedy, Graph Algorithms,...).
- Phân tích độ phức tạp thời gian (Time Complexity) và không gian (Space Complexity) Big-O.
- Tối ưu hóa mã nguồn Java và rèn luyện tư duy giải quyết bài toán thuật toán.

## NeetCode 150 Spaced Repetition Dashboard (SRS)

Dự án tích hợp ứng dụng Spaced Repetition kiểu Anki (thuật toán SM-2) giúp theo dõi và nhắc lịch ôn tập lại 150 bài toán phỏng vấn NeetCode 150.

### 1. Khởi chạy nhanh ứng dụng
Ứng dụng sử dụng kỹ thuật Chrome App Mode để hiển thị dưới dạng cửa sổ độc lập (không có thanh địa chỉ hay tab bar trình duyệt):

```bash
bash launch-srs.sh
```

### 2. Tích hợp Shortcut vào Ubuntu Application Menu (Tùy chọn)
Để mở ứng dụng trực tiếp từ danh sách App hoặc ghim vào thanh Dock của Ubuntu:

```bash
mkdir -p ~/.local/share/applications
cp neetcode-srs.desktop ~/.local/share/applications/
chmod +x ~/.local/share/applications/neetcode-srs.desktop
```

### 3. Thông báo nhắc nhở trên Desktop (Ubuntu Notification)
Kiểm tra và bắn thông báo `notify-send` khi có bài tập cần ôn lại hôm nay:

```bash
bash remind-srs.sh
```

- Để tự động nhận thông báo mỗi 08:00 sáng, xem hướng dẫn thiết lập Cronjob hoặc Systemd Timer trong tài liệu [docs/SRS_APP.md](docs/SRS_APP.md).

### 4. Quy tắc Spaced Repetition (Anki SM-2)
- **Hard**: Lặp lại sau `1 ngày`, giảm Ease Factor (`-0.15`).
- **Medium**: Lần đầu lặp lại sau `3 ngày`, các lần sau kéo dài thời gian theo hệ số Ease Factor (`interval = round(interval * easeFactor)`).
- **Easy**: Lần đầu lặp lại sau `7 ngày`, các lần sau kéo dài thời gian theo hệ số Ease Factor (`interval = round(interval * easeFactor)`), tăng Ease Factor (`+0.15`).
- **Again**: Đặt lại chu kỳ về `0 ngày` (hôm nay), giảm Ease Factor (`-0.20`).
