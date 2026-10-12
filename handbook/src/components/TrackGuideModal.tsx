'use client';

import React from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  trackId: 'oop' | 'sql' | 'spring-boot' | 'tools' | 'system-design';
}

const TRACK_GUIDES: Record<
  'oop' | 'sql' | 'spring-boot' | 'tools' | 'system-design',
  {
    title: string;
    subTitle: string;
    slackContext: string;
    promptTemplate: string;
    checklist: { category: string; items: string[] }[];
  }
> = {
  oop: {
    title: 'Core Java & OOP — Hướng Dẫn Prompt & Review',
    subTitle: 'Phương pháp chỉ đạo AI viết OOP và cách thẩm định code chất lượng cao',
    slackContext: 'Áp dụng khi chuyển đổi hoặc xây dựng các Domain Model, Entity, Value Object, DTO và Business Services (như Identity Service hoặc Workspace Service trong Slack).',
    promptTemplate: `Tôi đang phát triển dịch vụ Backend bằng Java 17 và Spring Boot 3.
Hãy thiết kế module quản lý [Tên nghiệp vụ, ví dụ: Workspace Member] theo đúng chuẩn OOP và Clean Code:
1. Data Model & Encapsulation: Thiết kế các Entity và DTO tách biệt. Các trường đều là private, cung cấp getter/setter hoặc dùng record cho DTO không thay đổi.
2. Abstraction & Polymorphism: Tạo Interface cho Service (ví dụ: WorkspaceService) và lớp thực thi (WorkspaceServiceImpl). Áp dụng đa hình nếu có nhiều loại thành viên (Owner, Admin, Member).
3. Collections & Streams: Sử dụng Java Collections (List, Set, Map) và Stream API để lọc hoặc ánh xạ dữ liệu sạch sẽ, không dùng vòng lặp for lồng nhau truyền thống.
4. Error Handling: Tự định nghĩa các Custom Exception kế thừa RuntimeException và xử lý validate rõ ràng. Không nuốt lỗi (không catch rỗng).
5. Code Format: Viết code sạch, có comment giải thích các quyết định thiết kế.`,
    checklist: [
      {
        category: 'Tính Đóng Gói (Encapsulation) & DTO',
        items: [
          'Không bao giờ trả trực tiếp Entity (chứa password hash, private fields) ra Controller. Luôn map sang DTO/Record.',
          'Các class DTO nhận request phải được validate rõ ràng (@NotNull, @NotBlank, @Size).',
          'Sử dụng record (Java 17) cho các DTO bất biến (immutable data).',
        ],
      },
      {
        category: 'Tính Trừu Tượng & Đa Hình (Abstraction & Polymorphism)',
        items: [
          'Tầng Service luôn có Interface riêng để dễ dàng mock khi viết Unit Test.',
          'Tránh dùng quá nhiều if-else / switch-case cho các loại đối tượng khác nhau; hãy cân nhắc áp dụng Strategy Pattern hoặc State Pattern.',
        ],
      },
      {
        category: 'Quản Lý Bộ Nhớ & Luồng (Memory & Collections)',
        items: [
          'Dùng Stream API hợp lý, tránh stream lồng nhau quá sâu làm suy giảm hiệu năng.',
          'Xử lý giá trị có thể null bằng Optional<T> thay vì return null thô.',
          'Tránh sử dụng biến tĩnh static mutable chia sẻ giữa các request vì có thể gây lỗi Race Condition trong môi trường đa luồng (Multi-threading).',
        ],
      },
    ],
  },
  sql: {
    title: 'SQL & Database — Hướng Dẫn Prompt & Review',
    subTitle: 'Phương pháp kiểm soát schema, truy vấn và giao dịch dữ liệu qua AI',
    slackContext: 'Áp dụng cho multi-database PostgreSQL của Slack (identity_db, workspace_db, chat_db) để tránh sập DB và tối ưu truy vấn.',
    promptTemplate: `Tôi đang thiết kế cơ sở dữ liệu PostgreSQL cho [Chức năng, ví dụ: Kênh chat và tin nhắn trong Slack].
Hãy viết script DDL (SQL) và các câu lệnh truy vấn cốt lõi:
1. Bảng & Khóa: Thiết kế bảng 'channels' và 'messages'. Khóa chính id dùng UUID, khóa ngoại channel_id tham chiếu bảng channels với ON DELETE CASCADE hợp lý.
2. Ràng Buộc & Index: Đánh Index cho channel_id và created_at để phục vụ phân trang tin nhắn (Pagination). Trường name có ràng buộc UNIQUE theo từng workspace.
3. Tối Ưu Truy Vấn: Viết câu query lấy 20 tin nhắn mới nhất của một channel cùng thông tin người gửi (JOIN với bảng users). Đảm bảo query dùng Index Scan, không dùng Sequential Scan.
4. Transaction: Viết ví dụ thao tác giao dịch (BEGIN ... COMMIT/ROLLBACK) khi gửi tin nhắn và cập nhật last_active_at của channel.`,
    checklist: [
      {
        category: 'Khóa & Toàn Vẹn Dữ Liệu (Constraints & Keys)',
        items: [
          'Khóa ngoại (Foreign Key) và khóa chính (Primary Key) phải được khai báo tường minh.',
          'Các trường dữ liệu duy nhất (như email, channel name trong workspace) phải có ràng buộc UNIQUE ở cấp độ Database, không chỉ check bằng code Java.',
        ],
      },
      {
        category: 'Tối Ưu Hiệu Năng & Đánh Index',
        items: [
          'Mọi cột thường xuyên xuất hiện trong mệnh đề WHERE, JOIN, ORDER BY phải có Index thích hợp (B-Tree, Composite Index).',
          'Tránh bẫy N+1 Query: Khi dùng Spring Data JPA, kiểm tra AI có dùng JOIN FETCH hoặc @EntityGraph không, tránh vòng lặp query DB hàng trăm lần.',
        ],
      },
      {
        category: 'Giao Dịch Dữ Liệu (ACID & Transaction)',
        items: [
          'Các thao tác cập nhật từ 2 bảng trở lên phải được bọc trong @Transactional.',
          'Hiểu rõ mức độ cô lập (Isolation Level) để tránh Dirty Read hoặc Non-repeatable Read khi có tải đồng thời cao.',
        ],
      },
    ],
  },
  'spring-boot': {
    title: 'Spring Boot — Hướng Dẫn Prompt & Review',
    subTitle: 'Quy chuẩn kiến trúc Controller - Service - Repository và bảo mật',
    slackContext: 'Áp dụng khi biến các microservices NestJS của Slack thành ứng dụng Spring Boot hoàn chỉnh kết nối REST API, JPA và Security.',
    promptTemplate: `Tôi đang xây dựng Spring Boot 3 microservice cho [Tên dịch vụ, ví dụ: Slack Identity Service].
Hãy tạo kiến trúc RESTful API chuẩn:
1. Controller: Skinny Controller, nhận request, validate DTO bằng @Valid và trả về ResponseEntity<ApiResponse<T>> với status HTTP chuẩn.
2. Dependency Injection: Sử dụng Constructor Injection (hoặc @RequiredArgsConstructor của Lombok), tuyệt đối KHÔNG dùng @Autowired trên field.
3. Spring Data JPA: Viết JpaRepository kế thừa, sử dụng Derived Query Methods hoặc @Query JPQL tối ưu.
4. Security & JWT: Tích hợp Spring Security Filter Chain, giải mã JWT token từ Authorization header và set Authentication vào SecurityContext.
5. Global Exception Handler: Dùng @RestControllerAdvice để bắt các ngoại lệ và trả về định dạng JSON lỗi thống nhất.`,
    checklist: [
      {
        category: 'Dependency Injection & Phân Tầng',
        items: [
          'Không dùng @Autowired trên field (Field Injection bị coi là bad practice). Ưu tiên Constructor Injection để dễ Unit Test và đảm bảo Immutability.',
          'Skinny Controller: Controller chỉ làm nhiệm vụ tiếp nhận và trả kết quả. Mọi logic nghiệp vụ và tính toán phải nằm ở Service.',
        ],
      },
      {
        category: 'Bảo Mật & Authentication',
        items: [
          'Mật khẩu phải được băm qua BCryptPasswordEncoder trước khi lưu vào DB. Tuyệt đối không log mật khẩu thô ra terminal/file log.',
          'Các endpoint nhạy cảm phải được bảo vệ bởi Spring Security và kiểm tra quyền hạn hợp lệ.',
        ],
      },
      {
        category: 'Quy Chuẩn REST & Mã Lỗi HTTP',
        items: [
          'Trả về HTTP status codes chuẩn: 201 Created cho POST tạo mới, 204 No Content cho DELETE, 400 Bad Request cho validation, 404 Not Found, 409 Conflict cho dữ liệu trùng.',
          'Có Global Exception Handler (@RestControllerAdvice) để không bao giờ để lộ Stack Trace thô của Java ra phía người dùng.',
        ],
      },
    ],
  },
  tools: {
    title: 'Git, Docker & Triển Khai — Hướng Dẫn Prompt & Review',
    subTitle: 'Đóng gói container, quản lý mã nguồn và tích hợp vào docker-compose',
    slackContext: 'Áp dụng để đưa service Java Spring Boot chạy cùng hạ tầng sẵn có (Postgres, Redis, Kafka) trong docker-compose.yml của dự án Slack.',
    promptTemplate: `Tôi cần triển khai service Java Spring Boot 3 (Maven/Gradle) trong hệ sinh thái Docker của dự án Slack hiện có:
1. Multi-stage Dockerfile: Viết Dockerfile gồm 2 stage:
   - Stage 1: eclipse-temurin:17-jdk để build maven package (cache dependency layer).
   - Stage 2: eclipse-temurin:17-jre để chạy file jar hoàn chỉnh nhằm tối ưu kích thước image và bảo mật.
2. Docker Compose Integration: Viết đoạn cấu hình YAML để thêm service này vào file docker-compose.yml sẵn có của Slack, kết nối vào mạng chung, trỏ biến môi trường DB vào postgres_identity và Redis.
3. Healthcheck: Cấu hình healthcheck kiểm tra endpoint /actuator/health của Spring Boot trước khi các service khác kết nối tới.`,
    checklist: [
      {
        category: 'Tối Ưu Kích Thước & Multi-stage Build',
        items: [
          'Dockerfile phải dùng Multi-stage build. Không để image JDK cồng kềnh chứa toàn bộ mã nguồn trên môi trường chạy production.',
          'Dùng base image JRE hoặc Alpine/Distroless để giảm bề mặt tấn công bảo mật.',
        ],
      },
      {
        category: 'Mạng & Biến Môi Trường (Networking & Env)',
        items: [
          'Không hardcode mật khẩu, cổng hoặc connection string trong code hay Dockerfile. Tất cả phải truyền qua biến môi trường (.env hoặc docker-compose.yml).',
          'Service phải nằm chung Docker network với Database (Postgres) để gọi qua tên container service thay vì localhost.',
        ],
      },
      {
        category: 'Git Flow & Quản Lý Repo',
        items: [
          'File .gitignore phải loại trừ target/, .mvn/, .gradle/, build/, .idea/, file .env cục bộ.',
          'Commit message rõ ràng theo quy chuẩn (feat:, fix:, refactor:, chore:).',
        ],
      },
    ],
  },
  'system-design': {
    title: 'System Design — Hướng Dẫn Prompt & Review',
    subTitle: 'Thiết kế chịu tải cao, caching, message queue và chống nghẽn hệ thống',
    slackContext: 'Áp dụng khi mở rộng hệ thống Slack lên hàng triệu người dùng, tối ưu độ trễ chat và chống bán âm / trùng lặp dữ liệu.',
    promptTemplate: `Tôi đang tối ưu kiến trúc cho hệ thống chat real-time (tương tự Slack) chạy bằng Java Spring Boot:
1. Caching Strategy: Thiết kế cơ chế Cache-Aside với Redis. Cache danh sách channel của user và thông tin profile. Thời gian TTL bao nhiêu? Xử lý Cache Invalidation ra sao khi user đổi tên?
2. Message Queue & Event-driven: Sử dụng Kafka khi user gửi tin nhắn chat. Producer bắn message vào topic 'chat-messages'. Consumer đọc và ghi batch vào DB để tránh nghẽn Database.
3. Concurrency & Race Condition: Phân tích kịch bản 2 người cùng bấm nút tham gia kênh riêng tư cùng lúc. Nên dùng Optimistic Locking (@Version) hay Pessimistic Locking hay Distributed Lock với Redisson?
4. Đánh giá Bottleneck: Phân tích các điểm nghẽn tiềm ẩn và giải pháp mở rộng (Scale Horizontal, Read Replica, Partitioning).`,
    checklist: [
      {
        category: 'Chiến Lược Caching (Redis)',
        items: [
          'Mọi cache lưu trong Redis bắt buộc phải có thời gian sống (TTL), tránh làm tràn bộ nhớ RAM của Redis server.',
          'Có phương án giải quyết Cache Stampede / Thundering Herd khi một key hot bị hết hạn.',
          'Cân nhắc tính nhất quán (Eventual Consistency vs Strong Consistency) giữa Cache và Database.',
        ],
      },
      {
        category: 'Bất Đồng Bộ & Xử Lý Tải (Kafka / Queue)',
        items: [
          'Tách biệt các tác vụ tốn thời gian (gửi email, thông báo push, lưu log) ra khỏi luồng HTTP chính bằng Asynchronous/Message Queue.',
          'Đảm bảo Consumer trong Kafka có cơ chế Idempotent (xử lý trùng lặp) khi một event bị gửi lại (At-least-once delivery).',
        ],
      },
      {
        category: 'Chống Nghẽn & Khóa Dữ Liệu (Locking)',
        items: [
          'Dùng Optimistic Locking (@Version) cho các dữ liệu ít xung đột để tăng thông lượng.',
          'Chỉ dùng Pessimistic Locking hoặc Distributed Lock (Redisson) cho các giao dịch nhạy cảm cao (tiền tệ, số lượng slot giới hạn).',
        ],
      },
    ],
  },
};

export default function TrackGuideModal({ isOpen, onClose, trackId }: Props) {
  const guide = TRACK_GUIDES[trackId];

  if (!isOpen || !guide) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1100 }}>
      <div
        className="modal-box"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '740px',
          width: '95%',
          borderRadius: 'var(--rounded-md, 4px)',
          height: '82vh',
          display: 'flex',
          flexDirection: 'column',
          padding: '24px',
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--color-border)',
            paddingBottom: '14px',
            marginBottom: '16px',
            flexShrink: 0,
          }}
        >
          <div>
            <div
              style={{
                fontSize: '0.72rem',
                fontFamily: 'var(--font-label)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--color-tertiary)',
                fontWeight: 700,
                marginBottom: '4px',
              }}
            >
              Cẩm Nang Thực Chiến • Prompt & Code Review
            </div>
            <h2
              style={{
                fontSize: '1.25rem',
                fontFamily: 'var(--font-display)',
                color: 'var(--color-primary)',
                margin: 0,
                padding: 0,
                border: 'none',
              }}
            >
              {guide.title}
            </h2>
            <p
              style={{
                fontSize: '0.84rem',
                color: 'var(--color-secondary)',
                margin: '4px 0 0 0',
              }}
            >
              {guide.subTitle}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="modal-close-btn"
            title="Đóng"
            aria-label="Đóng modal"
            style={{ fontSize: '1.25rem', padding: '4px 8px' }}
          >
            ✕
          </button>
        </div>

        {/* Modal Content Scrollable Area */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            paddingRight: '6px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          {/* Slack Project Application Context */}
          <div
            style={{
              padding: '12px 16px',
              borderRadius: 'var(--rounded-md)',
              backgroundColor: '#fff4e8',
              border: '1px solid #ffd4a8',
            }}
          >
            <div
              style={{
                fontSize: '0.78rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                color: 'var(--color-tertiary)',
                marginBottom: '4px',
                fontFamily: 'var(--font-label)',
                letterSpacing: '0.05em',
              }}
            >
              Liên Hệ Thực Tế Với Dự Án Slack
            </div>
            <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--color-primary)', lineHeight: 1.5 }}>
              {guide.slackContext}
            </p>
          </div>

          {/* Section 1: Prompt Template */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '8px',
              }}
            >
              <h3
                style={{
                  fontSize: '0.95rem',
                  fontFamily: 'var(--font-label)',
                  fontWeight: 700,
                  color: 'var(--color-primary)',
                  margin: 0,
                }}
              >
                1. Mẫu Prompt Chuẩn Kiến Trúc Cho AI
              </h3>
              <button
                type="button"
                className="btn-ghost"
                onClick={() => copyToClipboard(guide.promptTemplate)}
                style={{
                  fontSize: '0.75rem',
                  padding: '3px 10px',
                  borderRadius: 'var(--rounded-md)',
                  cursor: 'pointer',
                }}
              >
                Sao chép Prompt
              </button>
            </div>
            <pre
              style={{
                backgroundColor: '#f6f3ee',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--rounded-md)',
                padding: '14px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.82rem',
                color: 'var(--color-primary)',
                whiteSpace: 'pre-wrap',
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              {guide.promptTemplate}
            </pre>
          </div>

          {/* Section 2: Code Review Checklist */}
          <div>
            <h3
              style={{
                fontSize: '0.95rem',
                fontFamily: 'var(--font-label)',
                fontWeight: 700,
                color: 'var(--color-primary)',
                margin: '0 0 12px 0',
              }}
            >
              2. Checklist Thẩm Định Code (Review Checklist)
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {guide.checklist.map((group, gIdx) => (
                <div
                  key={gIdx}
                  style={{
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--rounded-md)',
                    backgroundColor: 'var(--color-surface)',
                    padding: '12px 14px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      color: 'var(--color-tertiary)',
                      fontFamily: 'var(--font-label)',
                      marginBottom: '8px',
                    }}
                  >
                    {group.category}
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {group.items.map((item, iIdx) => (
                      <li
                        key={iIdx}
                        style={{
                          fontSize: '0.84rem',
                          color: 'var(--color-primary)',
                          lineHeight: 1.45,
                        }}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
