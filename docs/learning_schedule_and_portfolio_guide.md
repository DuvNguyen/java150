# Lộ Trình Học & Chiến Lược Xây Dựng Portfolio Backend

Tài liệu này tổng hợp chiến lược phân bổ thời gian học tập hàng ngày cho người đi làm/thực tập và định hướng xây dựng Portfolio chuẩn mực để ứng tuyển vị trí Backend Developer (Java / Spring Boot).

---

## Phần 1: Chiến Lược Học Tập Hàng Ngày Cho Người Đi Thực Tập

### 1. Bối cảnh & Thách thức
- **Thời gian trong ngày**: Đi thực tập / làm việc ban ngày (ví dụ làm landing page, frontend, thao tác web).
- **Thời gian tự học buổi tối**: 1 đến 2 tiếng.
- **Vấn đề thường gặp**: Khối lượng kiến thức Backend rất rộng (DSA, Core Java, SQL, Spring Boot, Git/Docker, System Design), nếu không có kế hoạch rõ ràng sẽ dễ bị ngợp, học lan man hoặc kiệt sức (burnout).

### 2. Nguyên tắc phân bổ thời gian (Time-boxing 60 - 45 - 15)
Với quỹ thời gian **2 tiếng mỗi tối** (ví dụ từ 20:00 đến 22:00):

1. **Khối 1 (45 - 60 phút đầu - Não tỉnh táo nhất)**: **Luyện tập phản xạ (Problem Solving)**
   - Giải đúng **1 bài DSA (Neetcode)** hoặc **2 bài SQL (LeetCode Top SQL 50)**.
   - *Nguyên tắc 45 phút*: Tự suy nghĩ tối đa 30-45 phút. Nếu bế tắc, mở Handbook xem gợi ý/lời giải chuẩn, ghi chú pattern vào hệ thống SRS rồi chuyển việc. Tuyệt đối không ngồi ngâm 1 bài cả đêm.
2. **Khối 2 (45 - 50 phút tiếp theo - Chiều sâu kiến thức)**: **Nạp 1 Chuyên đề Backend**
   - Học 1 chủ đề nhỏ trong Handbook (ví dụ: Collections Internals, B-Tree Index, Dockerfile multi-stage, Transaction Isolation).
3. **Khối 3 (15 phút cuối - Đóng gói kiến thức)**: **Ghi chú & Review**
   - Viết 3-5 gạch đầu dòng vào ô *Ghi chú cá nhân* trên Handbook.
   - Xem nhanh flashcard/SRS của những bài ngày hôm trước.

### 3. Lịch học 7 ngày mẫu (Tuần hoàn 2 nhịp)

| Thứ | Khối 1: Problem Solving (45-60 phút) | Khối 2: Backend Domain (45-50 phút) | Mục Tiêu Đầu Ra |
| :--- | :--- | :--- | :--- |
| **Thứ 2** | **DSA**: 1 bài Array / Hashing / Two Pointers | **Core Java**: HashMap internals, equals() & hashCode() | Hiểu cơ chế bucket, băm, hash collision |
| **Thứ 3** | **SQL Top 50**: 2 bài Select / Basic Joins | **SQL & Database**: B-Tree Index, Clustered vs Non-Clustered | Hiểu bản chất Index Range Scan và tìm kiếm `O(log N)` |
| **Thứ 4** | **DSA**: 1 bài Sliding Window / Stack | **Git & Docker**: Docker Fundamentals, Image vs Container | Chạy Postgres container qua `docker run` với `-p` và `-v` |
| **Thứ 5** | **SQL Top 50**: 2 bài Aggregation (GROUP BY, HAVING) | **SQL & Database**: ACID & 4 Transaction Isolation Levels | Nắm vững Dirty Read, Non-repeatable Read, Phantom Read |
| **Thứ 6** | **DSA**: 1 bài Binary Search / Linked List | **Spring Boot**: Bean Lifecycle, IoC/DI, @Transactional | Nắm vững Bean Scopes và cơ chế Transaction |
| **Thứ 7** | **Thực hành Portfolio (90 - 120 phút)** | Viết Dockerfile Multi-stage + docker-compose cho dự án mẫu | Có repo Backend chạy `docker compose up` thành công |
| **Chủ Nhật** | **Review nhẹ nhàng (60 phút)** | Mở Handbook rà soát lại các câu hỏi *Trọng Tâm Phỏng Vấn* | Tự trả lời miệng các câu hỏi phỏng vấn tuần qua |

### 4. Tận dụng công việc thực tập ban ngày
- **Biến Git thành phản xạ**: Thực hành ngay trên công ty: tạo branch chuẩn (`feature/...`), dùng `git rebase` để giữ lịch sử commit gọn gàng, viết commit theo chuẩn *Conventional Commits* (`feat:`, `fix:`).
- **Quan sát Network & API**: Khi giao diện landing page gọi API, mở tab **Network (DevTools)** quan sát Headers, HTTP Status Codes (200, 400, 401, 500) và format JSON. Đây chính là những gì tầng Controller / API Gateway phía Backend đảm nhận.

### 5. Kỷ luật duy trì năng lượng
- **Đều đặn quan trọng hơn khối lượng**: 1.5 tiếng mỗi ngày x 6 ngày/tuần hiệu quả hơn nhiều so với việc dồn 9 tiếng vào cuối tuần.
- **Khi quá mệt**: Bỏ qua các bài toán DSA hóc búa; chỉ mở Handbook đọc 1 bài lý thuyết trong 15 phút hoặc làm 1 bài SQL Easy. Giữ nhịp liên tục để không bị đứt đoạn thói quen.

---

## Phần 2: Bản Chất & Chiến Lược Xây Dựng Portfolio Backend

### 1. Portfolio Backend là gì?
- **Khác biệt với Frontend**: Frontend cần giao diện trực quan, đẹp mắt để nhìn thấy ngay. Backend không đánh giá qua giao diện, mà thông qua **Repository GitHub đạt chuẩn kỹ thuật (Proof of Work)**.
- **Tiêu chí đánh giá của Tech Lead / Nhà tuyển dụng**:
  - Cách tổ chức source code (Layered Architecture / Clean Architecture, phân chia Controller - Service - Repository - DTO).
  - Thiết kế cơ sở dữ liệu (Data Modeling, chuẩn hóa 3NF, đánh Index đúng chỗ, ràng buộc khóa ngoại).
  - Kỹ thuật xử lý lỗi tập trung (`@RestControllerAdvice`) và validation dữ liệu (`jakarta.validation`).
  - Năng lực viết Unit Test / Integration Test độc lập (JUnit 5 + Mockito).
  - Khả năng đóng gói hạ tầng: Người khác clone repo về chỉ cần gõ duy nhất lệnh `docker compose up` là toàn bộ hệ thống (App + Database PostgreSQL) hoạt động hoàn hảo.

### 2. Hai giá trị cốt lõi của Portfolio khi đi xin việc
1. **Vượt qua vòng lọc CV**:
   - Thay vì chỉ liệt kê các từ khóa chung chung (*"Em biết Java, Spring Boot, Docker"*), một link GitHub chứa dự án Backend hoàn chỉnh, có tài liệu Swagger UI và Dockerfile tối ưu sẽ đưa CV vào nhóm ứng viên nổi bật có năng lực thực chiến.
2. **Làm chủ buổi phỏng vấn (Dẫn dắt cuộc hội thoại)**:
   - Khi không có dự án thực tế, người phỏng vấn sẽ hỏi lý thuyết rộng và khó đoán.
   - Khi có dự án chuẩn trong Portfolio, người phỏng vấn sẽ tập trung vào chính những gì bạn đã làm:
     - *"Tại sao bảng này em đánh Index ở cột `created_at`?"*
     - *"Làm thế nào em giải quyết lỗi N+1 khi query danh sách bài viết kèm tác giả?"*
     - *"Dockerfile multi-stage của em giúp giảm dung lượng image từ bao nhiêu xuống bao nhiêu?"*
   - Bạn sẽ ở thế chủ động hoàn toàn vì được nói về chính sản phẩm do tay mình làm ra.

### 3. Tiêu Chuẩn 6 Trụ Cột Cho 1 Dự Án Backend Hoàn Chỉnh (Chất Lượng Hơn Số Lượng)
Chỉ cần **MỘT** dự án chất lượng cao (tham khảo chuẩn *RealWorld Backend Specification*):

- **Trụ cột 1: Nghiệp vụ & API RESTful chuẩn**:
  - CRUD hoàn chỉnh (Authentication JWT, User Profile, Quản lý tài nguyên, Bình luận/Đơn hàng).
  - Tách bạch DTO (Request/Response) và Entity; dùng HTTP Status Codes chuẩn xác (200, 201, 400, 401, 403, 404, 409).
- **Trụ cột 2: Thiết kế CSDL & Tối ưu JPA/Hibernate**:
  - Chuẩn hóa quan hệ 1-1, 1-N, N-N trên PostgreSQL; có file migration (`schema.sql` hoặc Flyway).
  - Tránh lỗi N+1 Query bằng `JOIN FETCH` hoặc `@EntityGraph`.
- **Trụ cột 3: Xử lý ngoại lệ tập trung & Validation**:
  - Dùng `@RestControllerAdvice` kết hợp `@ExceptionHandler` để trả về định dạng lỗi chuẩn `{ timestamp, status, message, errors }`.
  - Validate dữ liệu đầu vào bằng `@Valid`, `@NotBlank`, `@Size`, `@Email`.
- **Trụ cột 4: Kiểm thử tự động (Unit Test)**:
  - Viết Unit Test cho tầng nghiệp vụ Service sử dụng JUnit 5 + Mockito (`@ExtendWith(MockitoExtension.class)`, `@Mock`, `@InjectMocks`).
- **Trụ cột 5: Đóng gói Docker & Orchestration**:
  - `Dockerfile` Multi-stage build (tách tầng build Gradle/Maven và tầng runtime Eclipse Temurin JRE) để nén dung lượng image.
  - `docker-compose.yml` chạy song song Spring Boot và PostgreSQL, cấu hình volume lưu trữ dữ liệu và biến môi trường chuẩn.
- **Trụ cột 6: Tài liệu hóa & README chuyên nghiệp**:
  - Hướng dẫn cài đặt và chạy trong 3 bước ngắn gọn.
  - Tích hợp Swagger UI (`/swagger-ui.html`) để người xem có thể test trực tiếp các endpoint.
