# Hướng Dẫn Sử Dụng Herdr & Điều Phối Đa Agent (Multi-Agent Orchestration)

## 1. Herdr Là Gì?

**Herdr** (lấy cảm hứng từ từ *"herding"* – chăn dắt/điều phối) là một công cụ **Terminal Multiplexer (bộ ghép kênh terminal)** mã nguồn mở được viết bằng ngôn ngữ **Rust**, thiết kế chuyên biệt để **quản lý, giám sát và điều phối đồng thời nhiều AI Coding Agents** (như Claude Code, Codex, Copilot CLI, Cursor Agent, Aider, OpenCode,...).

### Điểm nổi bật:
- **Agent-Aware (Nhận biết trạng thái Agent)**: Tự động phát hiện và phân loại trạng thái thời gian thực của từng agent (`working`, `blocked`, `done`, `idle`).
- **Duy trì phiên nền (Persistence)**: Chạy dưới dạng daemon nền, không bị mất phiên làm việc khi gập laptop hoặc ngắt kết nối SSH.
- **Tương thích cao (Zero-wrapper)**: Chạy trực tiếp các công cụ CLI hiện có mà không cần can thiệp mã nguồn.
- **Hỗ trợ Agent-to-Agent Delegation**: Cung cấp Socket API & CLI cho phép các agent tự động gọi và điều phối lẫn nhau.

---

## 2. So Sánh Herdr Với Các Công Cụ Khác

| Tiêu chí | `tmux` / `screen` truyền thống | Framework AI (AutoGen, LangGraph) | Herdr |
| :--- | :--- | :--- | :--- |
| **Mục đích** | Chia terminal, giữ session | Xây dựng luồng AI trong code | Quản lý & điều phối dàn AI CLI Agents |
| **Cấp độ hoạt động** | Tầng Terminal thuần túy | Tầng In-process code (Python/TS) | Tầng Process & Hệ điều hành |
| **Nhận diện trạng thái AI** | Không (chỉ hiển thị văn bản) | Quản lý qua State Graph | Tự động phát hiện `working`, `blocked`, `done` |
| **Giao tiếp Agent** | Không hỗ trợ | Function call, Object memory | Unix Socket API, Terminal I/O, CLI commands |
| **Can thiệp của con người** | Phím tắt thủ công | Khó can thiệp giữa chừng | Có thể tương tác hoặc duyệt lệnh tại từng pane |

---

## 3. Cách Cài Đặt & Khởi Động

### Cài đặt nhanh:
```bash
curl -fsSL https://herdr.dev/install.sh | sh
```

### Khởi chạy phiên làm việc:
```bash
herdr
```

---

## 4. Cơ Chế Điều Phối Agent-to-Agent (Agent Này Điều Khiển Agent Khác)

Có 2 phương pháp chính để thiết lập điều phối đa agent trong Herdr:

### Cách 1: Sử dụng trực tiếp Herdr Socket CLI

Herdr cung cấp Unix Socket nội bộ và CLI. Bất kỳ Agent nào có quyền thực thi lệnh shell (bash) đều có thể tương tác với các pane/tab khác.

#### Các lệnh CLI chính:
- **Tạo agent/pane mới**:
  ```bash
  herdr pane create --name <TÊN_PANE> --command "<LỆNH_CHẠY_AGENT>"
  ```
- **Gửi lệnh/prompt sang pane khác**:
  ```bash
  herdr pane send --target <TÊN_PANE> "<NỘI_DUNG_PROMPT>"
  ```
- **Kiểm tra trạng thái pane**:
  ```bash
  herdr pane status --target <TÊN_PANE>
  # Kết quả: "working", "blocked", "done", hoặc "idle"
  ```
- **Đọc kết quả đầu ra từ pane**:
  ```bash
  herdr pane capture --target <TÊN_PANE> --lines <SỐ_DÒNG>
  ```

#### Luồng hoạt động mẫu:
1. **Khởi tạo Agent phụ (Spawn)**:
   ```bash
   herdr pane create --name "tester" --command "claude -p 'Viết unit test cho src/TwoSum.java'"
   ```
2. **Theo dõi trạng thái (Poll/Monitor)**:
   ```bash
   herdr pane status --target "tester"
   ```
3. **Lấy kết quả khi hoàn thành (Capture)**:
   ```bash
   herdr pane capture --target "tester" --lines 100
   ```

---

### Cách 2: Sử dụng Framework `herdr-orch` (Dành cho dự án lớn)

`herdr-orch` là framework điều phối phân tầng dựa trên cơ chế lưu trạng thái bằng file (file-based persistence), giúp bảo toàn ngữ cảnh và phân công vai trò chuyên biệt.

#### Mô hình phân cấp vai trò:

```
                  ┌──────────────────────┐
                  │ Orchestrator (Lead)  │
                  └──────────┬───────────┘
                             │ (Giao việc)
            ┌────────────────┴────────────────┐
            ▼                                 ▼
   ┌─────────────────┐               ┌─────────────────┐
   │ Planner / Spec  │               │ Operator (Code) │
   └────────┬────────┘               └────────┬────────┘
            │                                 │
            └───────────────┬─────────────────┘
                            ▼
                  ┌───────────────────┐
                  │ Reviewer / Gate   │
                  └───────────────────┘
```

1. **Planner (Lập kế hoạch)**: Phân rã mục tiêu lớn thành các sub-task cụ thể.
2. **Operator (Thực thi)**: Đảm nhận viết code hoặc xử lý tính năng trên từng branch độc lập.
3. **Reviewer (Kiểm duyệt)**: Chạy test, kiểm tra diff, phản hồi lỗi cho Operator hoặc phê duyệt trước khi báo cáo về Lead.
4. **Khôi phục ngữ cảnh (Context Recovery)**: Nếu agent bị ngắt kết nối hoặc hết token, trạng thái được lưu lại để agent mới có thể tiếp tục công việc ngay lập tức.
