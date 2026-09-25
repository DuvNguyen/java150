export type SystemDesignStatus = 'not-started' | 'in-progress' | 'done';

export interface InterviewQA {
  question: string;
  answer: string;
}

export interface SystemDesignTopic {
  id: string;
  title: string;
  englishTitle: string;
  summary: string;
  estimatedMinutes: number;
  coreConcepts: {
    heading: string;
    points: string[];
  }[];
  javaDeepDive?: {
    title: string;
    description: string;
    codeSnippet?: string;
  };
  interviewQA: InterviewQA[];
}

export interface SystemDesignModule {
  id: string;
  title: string;
  englishTitle: string;
  badge: string;
  description: string;
  topics: SystemDesignTopic[];
}

export function getSystemDesignStatusKey(topicId: string): string {
  return `system_design_status_${topicId}`;
}

export function getSystemDesignNoteKey(topicId: string): string {
  return `system_design_note_${topicId}`;
}

export const SYSTEM_DESIGN_MODULES: SystemDesignModule[] = [
  {
    id: 'foundation',
    title: '1. Nền tảng hệ thống & Mạng',
    englishTitle: 'System Foundation & Networking',
    badge: 'Module 1',
    description: 'Nắm vững các giao thức mạng cốt lõi (TCP/UDP, HTTP, gRPC), mô hình kiến trúc cơ bản, chiến lược mở rộng và cân bằng tải traffic.',
    topics: [
      {
        id: 'network-protocols',
        title: 'Mạng & Giao thức truyền thông',
        englishTitle: 'Network & Communication Protocols',
        summary: 'Hiểu rõ mô hình OSI/TCP-IP, sự khác biệt giữa TCP vs UDP, tiến hóa từ HTTP/1.1 sang HTTP/2/3 và ứng dụng của WebSockets, gRPC trong Microservices.',
        estimatedMinutes: 25,
        coreConcepts: [
          {
            heading: 'TCP vs UDP (Transport Layer)',
            points: [
              'TCP (Transmission Control Protocol): Hướng kết nối (Connection-oriented), thực hiện 3-way handshake (SYN, SYN-ACK, ACK), đảm bảo tin cậy (Reliable), thứ tự gói tin (In-order), và kiểm soát tắc nghẽn (Congestion control). Phù hợp cho Web, APIs, Truyền file, Database.',
              'UDP (User Datagram Protocol): Không kết nối (Connectionless), truyền gói tin độc lập (Datagrams), tốc độ cực nhanh nhưng có thể mất gói tin hoặc sai thứ tự. Phù hợp cho Video streaming, Voice call (VoIP), Gaming trực tuyến, DNS lookup.',
            ],
          },
          {
            heading: 'HTTP Evolution (HTTP/1.1 -> HTTP/2 -> HTTP/3)',
            points: [
              'HTTP/1.1: Mặc định bật Keep-Alive (tái sử dụng TCP connection), nhưng gặp vấn đề Head-of-Line (HoL) Blocking ở tầng Application (chỉ xử lý tuần tự từng request trên một kết nối).',
              'HTTP/2: Sử dụng Binary Framing, hỗ trợ Multiplexing (gửi nhiều request/response đồng thời trên 1 TCP connection duy nhất), nén Header bằng HPACK, và Server Push. Vẫn bị HoL Blocking ở tầng TCP.',
              'HTTP/3: Chạy trên giao thức QUIC (dựa trên UDP), giải quyết triệt để HoL Blocking ở mọi tầng, chuyển vùng mạng (0-RTT connection resumption) mượt mà mà không cần bắt tay lại.',
            ],
          },
          {
            heading: 'Real-time: WebSockets vs SSE vs Long Polling',
            points: [
              'Long Polling: Client gửi request, Server giữ kết nối cho đến khi có dữ liệu hoặc timeout rồi mới trả về. Chi phí overhead cao do phải thiết lập lại HTTP connection liên tục.',
              'Server-Sent Events (SSE): Kết nối 1 chiều (Server -> Client) trên nền HTTP chuẩn. Lý tưởng cho Bảng giá chứng khoán, Live Notifications, AI Streaming (như ChatGPT).',
              'WebSockets: Kết nối 2 chiều (Full-duplex, Bidirectional) bền vững sau bước Handshake HTTP Upgrade. Phù hợp cho Chat App, Multiplayer Game, Bảng vẽ tương tác.',
            ],
          },
          {
            heading: 'gRPC & Protocol Buffers',
            points: [
              'gRPC là framework RPC mã nguồn mở của Google, mặc định chạy trên HTTP/2.',
              'Sử dụng Protocol Buffers (Protobuf) làm ngôn ngữ định nghĩa interface (IDL) và cơ chế tuần tự hóa dữ liệu (Serialization) dạng nhị phân cực kỳ nhỏ gọn và nhanh gấp nhiều lần so với JSON.',
              'Hỗ trợ 4 kiểu giao tiếp: Unary (1-1), Server Streaming, Client Streaming, Bidirectional Streaming. Chuẩn giao tiếp nội bộ hàng đầu giữa các Microservices backend.',
            ],
          },
        ],
        javaDeepDive: {
          title: 'Hiện thực hóa trong Java / Spring Boot',
          description: 'Spring Boot 3 / Spring Framework 6 hỗ trợ mạnh mẽ cả WebSockets (Spring WebSocket STOMP) và gRPC thông qua thư viện grpc-spring-boot-starter.',
          codeSnippet: `// 1. Ví dụ Server-Sent Events (SSE) trong Spring Boot Controller
@RestController
@RequestMapping("/api/stream")
public class SseNotificationController {

    @GetMapping(value = "/stock-prices", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<StockPrice> streamStockPrices() {
        return Flux.interval(Duration.ofSeconds(1))
                   .map(sequence -> new StockPrice("AAPL", 180 + Math.random() * 5, Instant.now()));
    }
}

// 2. Định nghĩa Protobuf (.proto) cho gRPC Service
syntax = "proto3";
service UserService {
  rpc GetUserProfile (UserRequest) returns (UserResponse);
}
message UserRequest {
  string user_id = 1;
}
message UserResponse {
  string user_id = 1;
  string full_name = 2;
  string email = 3;
}`,
        },
        interviewQA: [
          {
            question: 'Khi nào nên chọn WebSockets thay vì Server-Sent Events (SSE)?',
            answer: 'Chọn SSE khi ứng dụng chỉ cần luồng dữ liệu 1 chiều từ Server xuống Client (như thông báo realtime, stream token AI, dashboard biểu đồ). Chọn WebSockets khi cần truyền nhận dữ liệu 2 chiều liên tục với độ trễ tối thiểu (như ứng dụng Chat, game nhiều người chơi, bảng tương tác collaborative). SSE đơn giản hơn vì hoạt động trực tiếp trên HTTP tiêu chuẩn và tự động hỗ trợ Reconnect.',
          },
          {
            question: 'Tại sao gRPC lại nhanh và hiệu quả hơn REST API qua JSON?',
            answer: '1. Định dạng nhị phân: Protobuf mã hóa dữ liệu thành byte stream nhị phân, kích thước payload nhỏ hơn nhiều so với chuỗi văn bản JSON. 2. Parsing tốc độ cao: CPU phân tích cú pháp Protobuf nhanh hơn nhiều so với việc parse chuỗi JSON. 3. Giao thức HTTP/2: Tận dụng multiplexing, header compression, và streaming tích hợp sẵn.',
          },
        ],
      },
      {
        id: 'architecture-patterns',
        title: 'Mô hình Kiến trúc & Mở rộng (Scaling)',
        englishTitle: 'Architecture Patterns & Scaling Strategies',
        summary: 'So sánh Monolithic vs Microservices, chiến lược Vertical vs Horizontal Scaling, và nguyên tắc thiết kế dịch vụ không trạng thái (Stateless Services).',
        estimatedMinutes: 20,
        coreConcepts: [
          {
            heading: 'Monolithic vs Microservices',
            points: [
              'Monolithic Architecture: Toàn bộ module logic, business và database truy cập nằm chung trong một ứng dụng duy nhất. Dễ phát triển ban đầu, dễ test end-to-end, nhưng khó scale độc lập, rủi ro Single Point of Failure (SPOF) cho toàn hệ thống khi một module crash.',
              'Microservices Architecture: Chia hệ thống thành các dịch vụ độc lập, nhỏ gọn, giao tiếp qua HTTP REST/gRPC hoặc Message Broker. Mỗi service có database riêng (Database-per-service). Khả năng scale linh hoạt và độc lập giữa các team, nhưng phức tạp trong việc quản lý phân tán (Distributed Tracing, Eventual Consistency, DevOps).',
            ],
          },
          {
            heading: 'Vertical Scaling vs Horizontal Scaling',
            points: [
              'Vertical Scaling (Scale-up): Tăng cấu hình phần cứng của 1 server duy nhất (thêm CPU, RAM, ổ SSD NVMe). Ưu điểm: Đơn giản, không cần đổi kiến trúc code. Nhược điểm: Giới hạn trần phần cứng, chi phí tăng theo hàm mũ, có downtime khi nâng cấp.',
              'Horizontal Scaling (Scale-out): Tăng số lượng máy chủ (nodes) chạy song song và phân phối tải qua Load Balancer. Ưu điểm: Khả năng mở rộng vô hạn, độ sẵn sàng cao (High Availability). Yêu cầu: Ứng dụng phải được thiết kế dạng Stateless.',
            ],
          },
          {
            heading: 'Stateless vs Stateful Architecture',
            points: [
              'Stateless Service: Máy chủ không lưu trữ phiên đăng nhập (session) hoặc trạng thái của client trên bộ nhớ local. Mọi request đều mang đủ thông tin xác thực (vd: JWT) hoặc lưu session tập trung tại Redis. Nhờ đó, bất kỳ máy chủ nào trong pool cũng có thể phục vụ request.',
              'Stateful Service: Máy chủ lưu giữ trạng thái client trong RAM (vd: HttpSession trong bộ nhớ). Gây khó khăn lớn cho việc Horizontal Scaling, buộc phải dùng Sticky Sessions ở Load Balancer.',
            ],
          },
        ],
        interviewQA: [
          {
            question: 'Làm thế nào để chuyển đổi một ứng dụng Stateful sang Stateless?',
            answer: '1. Tách State ra khỏi Application Server: Chuyển dữ liệu session, giỏ hàng hoặc cache cục bộ vào một Data Store dùng chung (như Redis hoặc Memcached). 2. Sử dụng Stateless Authentication: Dùng JWT (JSON Web Token) tự chứa thông tin xác thực và chữ ký số thay vì lưu session ID trong bộ nhớ máy chủ. 3. Lưu trữ file tĩnh/ảnh tải lên trên Cloud Object Storage (như AWS S3, MinIO) thay vì ổ đĩa local của server.',
          },
        ],
      },
      {
        id: 'load-balancing-api-gateway',
        title: 'Cân bằng tải & API Gateway',
        englishTitle: 'Load Balancing & API Gateway',
        summary: 'Các thuật toán phân phối tải (Round Robin, Consistent Hashing), phân biệt Layer 4 vs Layer 7 Load Balancing, và vai trò trung tâm của API Gateway.',
        estimatedMinutes: 25,
        coreConcepts: [
          {
            heading: 'Thuật toán Cân bằng tải (Load Balancing Algorithms)',
            points: [
              'Round Robin: Phân phối tuần tự từng request tới từng server. Biến thể Weighted Round Robin gán trọng số theo năng lực của máy chủ.',
              'Least Connections: Chuyển request đến server đang có ít kết nối mở nhất. Rất hiệu quả khi các request có thời gian xử lý chênh lệch lớn.',
              'IP Hash: Băm địa chỉ IP của Client để luôn định tuyến cùng 1 client tới cùng 1 server (phù hợp cho ứng dụng cần session gắn kết).',
              'Consistent Hashing: Ánh xạ cả Server và Data/Client Key lên một vòng tròn băm (Hash Ring). Khi thêm hoặc bớt 1 server, chỉ một phần nhỏ (K/N) dữ liệu cần dịch chuyển, đây là nền tảng cốt lõi của DynamoDB, Cassandra, Memcached clusters.',
            ],
          },
          {
            heading: 'Layer 4 vs Layer 7 Load Balancing',
            points: [
              'Layer 4 (Transport Layer): Định tuyến dựa trên IP và Port (TCP/UDP). Không giải mã gói tin HTTP, tốc độ xử lý cực cao, bảo mật vì không cần giải mã SSL/TLS.',
              'Layer 7 (Application Layer): Định tuyến thông minh dựa trên nội dung HTTP (URL path, Cookies, Headers, HTTP Method). Cho phép định tuyến `/api/users` đến User Service và `/api/orders` đến Order Service.',
            ],
          },
          {
            heading: 'API Gateway vs Reverse Proxy',
            points: [
              'Reverse Proxy (vd: Nginx, HAProxy): Đứng trước các server để cân bằng tải, SSL Termination, nén gzip, và caching nội dung tĩnh.',
              'API Gateway (vd: Spring Cloud Gateway, Kong, Envoy): Đóng vai trò điểm vào duy nhất (Single Point of Entry) cho toàn bộ Microservices. Chịu trách nhiệm: Authentication/Authorization, Rate Limiting, Request Routing, SSL Termination, Metrics & Distributed Tracing, Circuit Breaking.',
            ],
          },
        ],
        javaDeepDive: {
          title: 'Spring Cloud Gateway trong Java Ecosystem',
          description: 'Spring Cloud Gateway xây dựng trên nền Reactive Netty và Project Reactor, cung cấp cơ chế định tuyến bất đồng bộ non-blocking hiệu năng cao.',
          codeSnippet: `// Cấu hình Route trong application.yml của Spring Cloud Gateway
spring:
  cloud:
    gateway:
      routes:
        - id: user-service-route
          uri: lb://USER-SERVICE
          predicates:
            - Path=/api/v1/users/**
          filters:
            - name: RequestRateLimiter
              args:
                redis-rate-limiter.replenishRate: 10
                redis-rate-limiter.burstCapacity: 20`,
        },
        interviewQA: [
          {
            question: 'Consistent Hashing giải quyết vấn đề gì trong Distributed Caching?',
            answer: 'Với hàm băm truyền thống `hash(key) % N`, khi số lượng server N thay đổi, hầu như 100% key sẽ bị map sang vị trí mới, gây ra Cache Storm làm sập Database. Consistent Hashing ánh xạ key và server lên một vòng tròn 360 độ (Hash Ring), khi N thay đổi chỉ có trung bình K/N key bị dịch chuyển, bảo vệ hệ thống luôn ổn định.',
          },
        ],
      },
    ],
  },
  {
    id: 'data-storage',
    title: '2. Quản trị Dữ liệu & Lưu trữ',
    englishTitle: 'Data Engineering & Storage Layer',
    badge: 'Module 2',
    description: 'Chuyên sâu về cơ sở dữ liệu SQL vs NoSQL, nguyên lý ACID vs BASE, định lý CAP/PACELC, kỹ thuật mở rộng Database (Replication, Sharding) và chiến lược Caching đỉnh cao.',
    topics: [
      {
        id: 'sql-vs-nosql',
        title: 'Cơ sở dữ liệu: SQL vs NoSQL & Phân loại',
        englishTitle: 'Databases: SQL vs NoSQL Taxonomy',
        summary: 'So sánh chuyên sâu mô hình dữ liệu quan hệ (RDBMS) và 4 họ NoSQL (Key-Value, Document, Wide-Column, Graph), hiểu rõ trường hợp sử dụng tối ưu.',
        estimatedMinutes: 20,
        coreConcepts: [
          {
            heading: 'SQL Databases (RDBMS)',
            points: [
              'Ví dụ: PostgreSQL, MySQL, Oracle.',
              'Đặc điểm: Cấu trúc dữ liệu có lược đồ cứng (Strict Schema), tổ chức dạng bảng có quan hệ (Foreign Keys), hỗ trợ truy vấn phức tạp bằng cú pháp SQL chuẩn (JOIN, Aggregations).',
              'Đảm bảo ACID chặt chẽ, mở rộng theo chiều dọc (Vertical) là chủ yếu, khó mở rộng ngang khi có nhiều quan hệ JOIN phân tán.',
            ],
          },
          {
            heading: '4 Họ Cơ sở dữ liệu NoSQL',
            points: [
              'Key-Value (Redis, Memcached, DynamoDB): Lưu cặp khóa-giá trị siêu nhanh, truy vấn O(1). Dùng cho Caching, Session store, Leaderboard.',
              'Document Store (MongoDB, Couchbase): Dữ liệu lưu dưới dạng JSON/BSON linh hoạt, schema linh động (Schema-less). Dùng cho E-commerce Product Catalogs, CMS, User Profiles.',
              'Wide-Column Store (Apache Cassandra, ScyllaDB, HBase): Tổ chức theo hàng và cột linh hoạt, tối ưu cho ghi cực nhanh và truy vấn lượng dữ liệu khổng lồ theo thời gian (Time-series, IoT data, Analytics logs).',
              'Graph Database (Neo4j, AWS Neptune): Tối ưu hóa cho các mối quan hệ phức tạp giữa các node (nút) và edge (cạnh). Dùng cho Mạng xã hội, Fraud Detection (Phát hiện gian lận), Recommendation Engine.',
            ],
          },
        ],
        interviewQA: [
          {
            question: 'Khi nào bạn sẽ chọn MongoDB thay vì PostgreSQL và ngược lại?',
            answer: 'Chọn PostgreSQL khi: Dữ liệu có cấu trúc rõ ràng, cần tính toàn vẹn giao dịch tài chính tuyệt đối (ACID), cần JOIN nhiều bảng phức tạp. Chọn MongoDB khi: Dữ liệu bán cấu trúc (Semi-structured), schema thay đổi thường xuyên, cần tốc độ phát triển nhanh với tài liệu JSON lồng nhau, hoặc cần mở rộng lưu trữ phân tán tự động (Auto-sharding).',
          },
        ],
      },
      {
        id: 'acid-cap-pacelc',
        title: 'Tính toàn vẹn Dữ liệu: ACID, CAP & PACELC',
        englishTitle: 'Data Guarantees: ACID, CAP & PACELC Theorems',
        summary: 'Nắm vững các thuộc tính ACID của SQL và bản chất không thể phá vỡ của định lý CAP trong mạng phân tán, mô hình BASE và định lý PACELC.',
        estimatedMinutes: 25,
        coreConcepts: [
          {
            heading: 'Thuộc tính ACID trong RDBMS',
            points: [
              'Atomicity (Nguyên tử): Giao dịch là một khối thống nhất - thành công tất cả hoặc hủy bỏ hoàn toàn (All-or-Nothing).',
              'Consistency (Nhất quán): Dữ liệu chuyển từ một trạng thái hợp lệ này sang một trạng thái hợp lệ khác, không vi phạm các ràng buộc (Constraints).',
              'Isolation (Cô lập): Các giao dịch chạy đồng thời không can thiệp lẫn nhau. Các cấp độ cô lập: Read Uncommitted -> Read Committed -> Repeatable Read -> Serializable.',
              'Durability (Bền vững): Một khi giao dịch đã Commit, dữ liệu sẽ được lưu an toàn vĩnh viễn trên ổ cứng (qua Write-Ahead Log - WAL) ngay cả khi mất điện.',
            ],
          },
          {
            heading: 'Định lý CAP (CAP Theorem)',
            points: [
              'Trong một hệ thống phân tán, chỉ có thể thỏa mãn tối đa 2 trong 3 yếu tố: Consistency (Tính nhất quán), Availability (Tính khả dụng), Partition Tolerance (Khả năng chịu phân vùng mạng).',
              'Vì trong thực tế mạng Internet luôn có thể bị đứt/chậm (Partition P luôn xảy ra), một hệ thống phân tán thực tế BẮT BUỘC phải lựa chọn giữa CP (ưu tiên nhất quán, tạm dừng phục vụ nếu mất liên lạc) hoặc AP (ưu tiên khả dụng, trả về dữ liệu có thể cũ).',
              'Ví dụ CP: HBase, MongoDB (với strong read), ZooKeeper. Ví dụ AP: Cassandra, CouchDB, DynamoDB.',
            ],
          },
          {
            heading: 'Định lý PACELC & Mô hình BASE',
            points: [
              'PACELC Theorem: Mở rộng từ CAP. Nếu có Partition (P), chọn giữa Availability (A) vs Consistency (C). Else (E - khi mạng bình thường), chọn giữa Latency (L) vs Consistency (C).',
              'BASE Model (NoSQL): Basically Available (Khả dụng cơ bản), Soft state (Trạng thái mềm, có thể thay đổi theo thời gian mà không cần input), Eventual consistency (Tính nhất quán cuối cùng).',
            ],
          },
        ],
        interviewQA: [
          {
            question: 'Tại sao trong hệ thống phân tán không thể có hệ thống đồng thời thỏa mãn CA (Consistency & Availability)?',
            answer: 'Vì trong môi trường phân tán thực tế, Partition (sự cố đứt kết nối mạng giữa các node) là điều không thể tránh khỏi. Nếu mạng bị ngắt (P), để đảm bảo Consistency (C), các node không thể đồng bộ dữ liệu với nhau sẽ phải từ chối ghi/đọc, tức là mất Availability (A). Ngược lại, nếu vẫn tiếp tục cho ghi (để giữ A), dữ liệu giữa các node sẽ bị sai lệch, tức là mất Consistency (C). Do đó hệ thống CA thuần túy chỉ tồn tại trên 1 node đơn lẻ.',
          },
        ],
      },
      {
        id: 'database-scaling',
        title: 'Mở rộng Database: Replication, Sharding & Indexing',
        englishTitle: 'Database Scaling: Replication, Sharding & Indexing',
        summary: 'Kỹ thuật nhân bản cơ sở dữ liệu (Master-Slave), phân mảnh ngang (Sharding), cơ chế hoạt động của Indexing B-Tree và LSM-Tree.',
        estimatedMinutes: 25,
        coreConcepts: [
          {
            heading: 'Database Replication (Nhân bản)',
            points: [
              'Master-Slave (Primary-Replica): Node Master xử lý toàn bộ thao tác Ghi (Write/Update/Delete), sau đó đồng bộ (Sync hoặc Async) sang các node Read Replicas (chỉ phục vụ Đọc). Tăng vọt thông lượng đọc (Read Throughput).',
              'Replication Lag: Độ trễ khi Replica đồng bộ dữ liệu từ Master. Có thể gây ra hiện tượng người dùng vừa đăng bài nhưng F5 lại chưa thấy (giải quyết bằng Read-your-own-writes consistency).',
            ],
          },
          {
            heading: 'Database Sharding & Partitioning',
            points: [
              'Sharding là kỹ thuật chia một database lớn thành nhiều database nhỏ độc lập (gọi là Shards) nằm trên các máy chủ vật lý khác nhau.',
              'Sharding Strategy: Range-based (theo khoảng ID hoặc thời gian), Hash-based (theo `hash(user_id) % N`), Directory-based (bảng tra cứu lookup table).',
              'Thách thức của Sharding: Khó thực hiện JOIN giữa các Shards (Cross-shard joins), giao dịch phân tán (Distributed Transactions), và Re-sharding khi dữ liệu tăng đột biến.',
            ],
          },
          {
            heading: 'Database Indexing (B-Tree vs LSM-Tree)',
            points: [
              'B-Tree / B+ Tree: Cấu trúc cây cân bằng tự sắp xếp, tối ưu hóa cho đọc ngẫu nhiên O(log N) và quét theo dải (Range scan). Phổ biến trong PostgreSQL, MySQL InnoDB.',
              'LSM-Tree (Log-Structured Merge-tree): Ghi dữ liệu vào RAM (MemTable) và append vào log (WAL), sau đó flush tuần tự xuống đĩa thành các file SSTable. Tốc độ Ghi cực nhanh, tối ưu cho Write-heavy workload (vd: Cassandra, RocksDB).',
            ],
          },
        ],
        interviewQA: [
          {
            question: 'Làm thế nào để xử lý bài toán "Hot Partition / Hot Key" khi Sharding Database?',
            answer: '1. Chọn Sharding Key tốt: Tránh dùng các key có tính quy tụ cao (như Country, Status, hoặc Timestamp). Thay vào đó dùng Hash của User ID hoặc Compound Key. 2. Thêm Salt (Salting Key): Nối thêm một số ngẫu nhiên (ví dụ `user_123_salt_01`) để phân tán các bản ghi cùng key sang nhiều shard khác nhau. 3. Kết hợp Caching phân tán phía trước để giảm tải trực tiếp vào DB.',
          },
        ],
      },
      {
        id: 'caching-strategies',
        title: 'Chiến lược Caching & Các sự cố kinh điển',
        englishTitle: 'Distributed Caching Strategies & Incident Patterns',
        summary: 'Mô hình Cache-Aside, Write-Through, Write-Back, các thuật toán thu hồi bộ nhớ (LRU/LFU) và phương pháp xử lý Cache Penetration, Cache Breakdown, Cache Avalanche.',
        estimatedMinutes: 25,
        coreConcepts: [
          {
            heading: 'Các chiến lược Caching (Caching Patterns)',
            points: [
              'Cache-Aside (Lazy Loading): Ứng dụng tự kiểm tra Cache, nếu Miss thì đọc từ DB rồi tự ghi vào Cache. Đơn giản, chỉ cache dữ liệu thực sự cần thiết, nhưng có độ trễ ở lần truy cập đầu tiên.',
              'Read-Through & Write-Through: Ứng dụng chỉ giao tiếp với Cache. Cache đứng giữa chịu trách nhiệm tự đọc/ghi đồng bộ xuống Database. Đảm bảo tính nhất quán cao nhưng tăng độ trễ ghi.',
              'Write-Back (Write-Behind): Ứng dụng ghi ngay vào Cache và nhận response ngay lập tức. Sau đó Cache ghi bất đồng bộ (async batch) xuống Database. Tốc độ ghi cực nhanh, nhưng có nguy cơ mất dữ liệu nếu Cache server crash trước khi kịp flush.',
            ],
          },
          {
            heading: 'Chính sách thu hồi Cache (Eviction Policies)',
            points: [
              'LRU (Least Recently Used): Loại bỏ phần tử có thời gian truy cập lâu nhất. Thuật toán phổ biến nhất (cài đặt bằng Doubly Linked List + HashMap).',
              'LFU (Least Frequently Used): Loại bỏ phần tử có tần suất truy cập ít nhất.',
              'FIFO (First In First Out): Loại bỏ phần tử vào đầu tiên.',
            ],
          },
          {
            heading: '3 Sự cố Caching kinh điển & Cách giải quyết',
            points: [
              '1. Cache Penetration: Hacker liên tục truy vấn các key KHÔNG HỀ TỒN TẠI cả trong Cache lẫn DB. Request xuyên thẳng xuống DB gây nghẽn. -> Giải pháp: Bloom Filter phía trước hoặc Cache giá trị null với TTL ngắn.',
              '2. Cache Breakdown (Hotspot Key): Một key cực "hot" vừa hết hạn TTL (expired), hàng triệu request đồng thời ập xuống DB cùng lúc để load lại. -> Giải pháp: Dùng Distributed Mutex Lock (chỉ cho 1 request xuống DB load) hoặc Logical Expiration (cập nhật cache nền trước khi hết hạn).',
              '3. Cache Avalanche: Hàng ngàn key đồng loạt hết hạn tại cùng một thời điểm, hoặc Cache Cluster bị sập, khiến toàn bộ traffic đổ dồn xuống DB. -> Giải pháp: Thêm khoảng thời gian ngẫu nhiên vào TTL (Jitter: `base_ttl + random(0, 300s)`) và triển khai Redis Cluster Multi-master.',
            ],
          },
        ],
        javaDeepDive: {
          title: 'Spring Cache & RedisTemplate trong Java',
          description: 'Spring Boot hỗ trợ trừu tượng hóa Caching qua các annotation `@Cacheable`, `@CachePut`, `@CacheEvict` kết hợp với Redis.',
          codeSnippet: `@Service
public class ProductService {

    // Cache-Aside pattern tự động với Spring Cache
    @Cacheable(value = "products", key = "#id", unless = "#result == null")
    public ProductDto getProductById(Long id) {
        log.info("Cache Miss! Truy vấn Database cho Product id: {}", id);
        return productRepository.findById(id)
                .map(this::mapToDto)
                .orElse(null);
    }

    // Xóa cache khi cập nhật dữ liệu
    @CacheEvict(value = "products", key = "#productDto.id")
    public void updateProduct(ProductDto productDto) {
        productRepository.save(mapToEntity(productDto));
    }
}`,
        },
        interviewQA: [
          {
            question: 'Bloom Filter hoạt động như thế nào để ngăn chặn Cache Penetration?',
            answer: 'Bloom Filter là một cấu trúc dữ liệu xác suất (Probabilistic Data Structure) cực kỳ tiết kiệm bộ nhớ sử dụng mảng bit và nhiều hàm băm. Nó có thể xác nhận chắc chắn 100% nếu một phần tử KHÔNG TỒN TẠI trong tập dữ liệu. Nhờ đó hệ thống có thể từ chối ngay lập tức request không hợp lệ mà không cần truy cập Cache hay Database.',
          },
        ],
      },
    ],
  },
  {
    id: 'distributed-systems',
    title: '3. Hệ thống phân tán & Bất đồng bộ',
    englishTitle: 'Distributed Systems & Asynchronous Processing',
    badge: 'Module 3',
    description: 'Message Queues (RabbitMQ) vs Event Streaming (Kafka), mô hình Saga cho Distributed Transactions, thuật toán đồng thuận (Raft/Paxos), Distributed Lock và Rate Limiting.',
    topics: [
      {
        id: 'message-queues-kafka',
        title: 'Message Queues & Event Streaming (Kafka vs RabbitMQ)',
        englishTitle: 'Message Brokers & Event Streaming',
        summary: 'Phân biệt Message Queue truyền thống (RabbitMQ) và Log-based Distributed Streaming (Apache Kafka), đảm bảo xử lý Exactly-once và Idempotency.',
        estimatedMinutes: 25,
        coreConcepts: [
          {
            heading: 'RabbitMQ (Message Queue) vs Apache Kafka (Event Stream)',
            points: [
              'RabbitMQ (Smart Broker, Dumb Consumer): Broker theo dõi trạng thái tin nhắn (ACK, NACK), hỗ trợ định tuyến linh hoạt qua Exchanges (Direct, Fanout, Topic). Sau khi Consumer xử lý xong và ACK, tin nhắn sẽ bị xóa khỏi hàng đợi.',
              'Apache Kafka (Dumb Broker, Smart Consumer): Bản chất là một Append-only Distributed Commit Log được chia thành nhiều Partitions. Kafka lưu trữ message trên đĩa theo thời gian (Retention Period) bất kể đã đọc hay chưa. Consumer tự lưu trữ vị trí con trỏ đọc (Offset). Băng thông xử lý hàng triệu message/giây.',
            ],
          },
          {
            heading: 'Mô hình Đảm bảo phân phát tin nhắn (Delivery Guarantees)',
            points: [
              'At-most-once (Tối đa 1 lần): Message có thể bị mất nhưng không bao giờ bị xử lý trùng lặp.',
              'At-least-once (Ít nhất 1 lần): Đảm bảo message không bao giờ mất, nhưng có thể bị gửi lại nhiều lần nếu mạng chập chờn. Đây là mô hình chuẩn mực trong thực tế.',
              'Exactly-once (Chính xác 1 lần): Khó nhất, kết hợp giữa Transactional Producer/Consumer và thiết kế Consumer có tính Bất biến (Idempotent Consumer).',
            ],
          },
          {
            heading: 'Tính bất biến (Idempotency) trong Consumer',
            points: [
              'Một thao tác được gọi là Idempotent nếu thực hiện 1 lần hay 100 lần thì kết quả cuối cùng đối với hệ thống vẫn hoàn toàn giống nhau.',
              'Giải pháp: Mỗi event mang một `unique_message_id`. Consumer trước khi xử lý sẽ lưu ID vào Redis hoặc Database (Unique Constraint / Optimistic Lock). Nếu gặp lại ID đã tồn tại thì bỏ qua.',
            ],
          },
        ],
        javaDeepDive: {
          title: 'Spring for Apache Kafka trong Java',
          description: 'Sử dụng `@KafkaListener` kết hợp cơ chế kiểm soát Offset thủ công (Manual Acknowledgment) để đảm bảo không mất mát dữ liệu.',
          codeSnippet: `@Component
@Slf4j
public class OrderEventConsumer {

    @Autowired
    private IdempotencyService idempotencyService;

    @KafkaListener(topics = "orders.created", groupId = "inventory-group")
    public void processOrderCreated(
            ConsumerRecord<String, OrderEvent> record,
            Acknowledgment ack) {
        
        String messageId = record.value().getEventId();
        
        // Kiểm tra Idempotency chống trùng lặp
        if (!idempotencyService.tryAcquireLock(messageId)) {
            log.warn("Bỏ qua message trùng lặp: {}", messageId);
            ack.acknowledge();
            return;
        }

        try {
            // Xử lý trừ kho hàng hóa
            processInventory(record.value());
            ack.acknowledge(); // Commit offset sau khi xử lý thành công
        } catch (Exception e) {
            log.error("Xử lý thất bại, chuyển vào Dead Letter Queue (DLQ)", e);
        }
    }
}`,
        },
        interviewQA: [
          {
            question: 'Làm thế nào để đảm bảo thứ tự xử lý message (Message Ordering) trong Kafka?',
            answer: 'Kafka đảm bảo thứ tự nghiêm ngặt BÊN TRONG MỘT PARTITION. Để đảm bảo các sự kiện của cùng 1 đối tượng được xử lý đúng thứ tự, Producer cần gửi message kèm theo Message Key (ví dụ `key = orderId`). Kafka sẽ dùng thuật toán băm key để đưa tất cả các event có cùng key vào chung một Partition duy nhất.',
          },
        ],
      },
      {
        id: 'distributed-transactions-saga',
        title: 'Giao dịch phân tán & Saga Pattern',
        englishTitle: 'Distributed Transactions & The Saga Pattern',
        summary: 'Tại sao Two-Phase Commit (2PC) không phù hợp cho Microservices, và cách thiết kế Saga Pattern (Orchestration vs Choreography) kèm bù trừ giao dịch (Compensating Transactions).',
        estimatedMinutes: 25,
        coreConcepts: [
          {
            heading: 'Vấn đề Dual-Write & Giới hạn của Two-Phase Commit (2PC)',
            points: [
              'Vấn đề Dual-Write: Khi cần lưu dữ liệu vào Database và bắn thông báo lên Message Queue, nếu một trong hai bước fail, dữ liệu sẽ bị bất nhất.',
              'Two-Phase Commit (2PC): Dùng bộ điều phối (Coordinator) qua 2 pha: Prepare và Commit. Nhược điểm: Blocking toàn bộ tài nguyên (giữ khóa Lock), làm tăng độ trễ nghiêm trọng và biến Coordinator thành SPOF. Không phù hợp với Microservices hiện đại.',
            ],
          },
          {
            heading: 'Saga Pattern (Mô hình chuỗi giao dịch cục bộ)',
            points: [
              'Chia một giao dịch lớn thành chuỗi các Local Transactions độc lập trên từng service.',
              'Compensating Transaction (Giao dịch bù trừ): Nếu một bước trong chuỗi bị lỗi (vd: Thanh toán thất bại), hệ thống sẽ kích hoạt các giao dịch đảo ngược theo thứ tự ngược lại (vd: Mở lại khóa tồn kho, Hoàn tiền).',
            ],
          },
          {
            heading: 'Choreography vs Orchestration Saga',
            points: [
              'Choreography (Tự điều phối): Các service lắng nghe sự kiện của nhau qua Message Broker và tự động thực hiện bước tiếp theo. Không có điểm điều khiển trung tâm, phù hợp cho quy trình đơn giản (2-4 bước).',
              'Orchestration (Bộ điều phối tập trung): Có một service chuyên trách (Saga Orchestrator) ra lệnh tuần tự cho từng service con và quản lý trạng thái luồng. Dễ theo dõi, dễ debug và quản lý các luồng phức tạp.',
            ],
          },
          {
            heading: 'Transactional Outbox Pattern',
            points: [
              'Để giải quyết triệt để lỗi Dual-Write: Thay vì bắn Kafka trực tiếp, service lưu cả nghiệp vụ chính và Event vào cùng một Database trong cùng 1 Local Transaction (bảng `outbox_table`).',
              'Một tiến trình riêng biệt (như Debezium với Change Data Capture - CDC hoặc Polling Publisher) sẽ đọc từ bảng Outbox để bắn lên Kafka an toàn 100%.',
            ],
          },
        ],
        interviewQA: [
          {
            question: 'Sự khác biệt giữa Rollback trong ACID và Compensating Transaction trong Saga là gì?',
            answer: 'Rollback trong ACID đưa dữ liệu trở về trạng thái vật lý trước đó như thể giao dịch chưa từng diễn ra (nhờ Undo Log). Trong khi đó, Compensating Transaction trong Saga là một giao dịch nghiệp vụ MỚI được thực hiện để bù đắp hoặc đảo ngược ngữ nghĩa của giao dịch trước đó (ví dụ: giao dịch trước là "Trừ tiền", giao dịch bù trừ là "Cộng tiền hoàn trả"), vì dữ liệu của bước trước đã được Commit công khai vào database của service đó rồi.',
          },
        ],
      },
      {
        id: 'rate-limiting-resilience',
        title: 'Rate Limiting & Khả năng chịu lỗi (Resilience)',
        englishTitle: 'Rate Limiting Algorithms & System Resilience',
        summary: 'Các thuật toán giới hạn tần suất (Token Bucket, Leaky Bucket, Sliding Window) và các mẫu thiết kế chịu lỗi (Circuit Breaker, Retry, Bulkhead).',
        estimatedMinutes: 20,
        coreConcepts: [
          {
            heading: 'Thuật toán Giới hạn tần suất (Rate Limiting Algorithms)',
            points: [
              'Token Bucket: Bucket chứa tối đa N token. Token được thêm vào đều đặn theo thời gian. Mỗi request tiêu thụ 1 token. Cho phép chấp nhận các đợt lưu lượng tăng đột biến ngắn hạn (Traffic Bursts). Thuật toán phổ biến nhất (dùng trong AWS, Stripe API).',
              'Leaky Bucket: Request đi vào thùng như nước và rò rỉ ra ngoài theo một tốc độ cố định mượt mà (Smooth rate). Giúp làm phẳng lưu lượng mạng.',
              'Sliding Window Log: Lưu timestamp của từng request trong Redis Sorted Set (ZSET). Chính xác tuyệt đối nhưng tốn nhiều bộ nhớ.',
              'Sliding Window Counter: Kết hợp Fixed Window của block trước và block hiện tại theo tỉ lệ trọng số thời gian. Vừa tiết kiệm RAM vừa độ chính xác cao.',
            ],
          },
          {
            heading: 'Mẫu thiết kế Chịu lỗi (Resilience Patterns)',
            points: [
              'Circuit Breaker (Ngắt mạch): Theo dõi tỉ lệ lỗi. Gồm 3 trạng thái: Closed (Bình thường) -> Open (Ngắt mạch, trả fallback lỗi ngay lập tức mà không gọi service đích đang chết) -> Half-Open (Cho phép một vài request thử nghiệm qua để kiểm tra service đã hồi phục chưa).',
              'Retry with Exponential Backoff & Jitter: Thử lại các lỗi tạm thời (Transient errors) với thời gian chờ tăng theo cấp số nhân kèm độ trễ ngẫu nhiên để tránh hiện tượng thắt cổ chai.',
              'Bulkhead: Cô lập các Thread Pool hoặc tài nguyên cho từng dịch vụ riêng biệt, ngăn chặn việc 1 service bị treo làm cạn kiệt tài nguyên của toàn bộ hệ thống.',
            ],
          },
        ],
        interviewQA: [
          {
            question: 'Tại sao Circuit Breaker lại quan trọng trong kiến trúc Microservices?',
            answer: 'Trong Microservices, các dịch vụ gọi lồng nhau. Nếu một Service C ở cuối chuỗi bị chậm hoặc chết, các thread ở Service B và Service A sẽ bị block chờ timeout, nhanh chóng dẫn đến cạn kiệt Thread Pool của toàn bộ các tầng phía trên (Cascading Failure). Circuit Breaker phát hiện lỗi và ngắt mạch ngay lập tức (Fail-fast), bảo vệ toàn bộ hệ thống khỏi sụp đổ dây chuyền.',
          },
        ],
      },
    ],
  },
  {
    id: 'case-studies',
    title: '4. Case Studies & Khung phỏng vấn',
    englishTitle: 'Case Studies & Real-World System Design',
    badge: 'Module 4',
    description: 'Nắm vững Framework phỏng vấn System Design 4 bước chuẩn và thực hành thiết kế 4 bài toán kinh điển: URL Shortener, Distributed Rate Limiter, News Feed System và Real-time Chat App.',
    topics: [
      {
        id: 'interview-framework',
        title: 'Khung phỏng vấn System Design 4 bước chuẩn',
        englishTitle: 'The 4-Step System Design Interview Framework',
        summary: 'Quy trình giải quyết bất kỳ bài toán thiết kế hệ thống nào trong 45 phút phỏng vấn tại các tập đoàn công nghệ lớn (Big Tech).',
        estimatedMinutes: 20,
        coreConcepts: [
          {
            heading: 'Bước 1: Hiểu rõ phạm vi & Yêu cầu (Scope the Requirements - 5-7 phút)',
            points: [
              'Yêu cầu chức năng (Functional Requirements): Người dùng có thể làm được những gì cụ thể? (vd: Tạo link rút gọn, click link chuyển hướng).',
              'Yêu cầu phi chức năng (Non-Functional Requirements): Tính sẵn sàng (99.99%), độ trễ thấp (<100ms), tính nhất quán dữ liệu, quy mô người dùng (DAU, MAU).',
            ],
          },
          {
            heading: 'Bước 2: Ước lượng tài nguyên (Capacity Estimation - 5 phút)',
            points: [
              'Lưu lượng truy cập (Traffic / QPS): Tính toán Read QPS và Write QPS (Read/Write Ratio).',
              'Dung lượng lưu trữ (Storage Estimation): Tính toán kích thước dữ liệu cần lưu trữ trong 5 năm.',
              'Băng thông (Bandwidth / Network): Dung lượng Inbound / Outbound mỗi giây.',
              'Bộ nhớ RAM cho Cache (Memory Estimation): Áp dụng nguyên lý Pareto 80/20 (20% dữ liệu hot tạo ra 80% traffic).',
            ],
          },
          {
            heading: 'Bước 3: Thiết kế mức tổng quan (High-Level Design - 10-15 phút)',
            points: [
              'Vẽ sơ đồ luồng dữ liệu (Architecture Block Diagram): Client -> CDN / Load Balancer -> API Gateway -> Backend Services -> Database & Cache Cluster.',
              'Định nghĩa API Signatures (RESTful endpoints, Request/Response payload).',
              'Thiết kế lược đồ Database (Database Schema, Tables/Collections, Primary Keys).',
            ],
          },
          {
            heading: 'Bước 4: Đi sâu vào chi tiết & Nút thắt (Deep Dive & Bottlenecks - 15-20 phút)',
            points: [
              'Đi sâu vào các thành phần cốt lõi nhất của bài toán.',
              'Giải quyết các điểm lỗi đơn lẻ (Single Point of Failure - SPOF).',
              'Tối ưu hóa Caching, DB Replication, Data Partitioning, Concurrency control, Race conditions.',
            ],
          },
        ],
        interviewQA: [
          {
            question: 'Tại sao việc đặt câu hỏi làm rõ yêu cầu ở Bước 1 lại quan trọng nhất trong buổi phỏng vấn?',
            answer: 'Các bài toán System Design thường cố tình được đưa ra rất chung chung và mơ hồ. Người phỏng vấn không chỉ đánh giá kiến thức kỹ thuật mà quan trọng hơn là khả năng tư duy phân tích của bạn. Việc làm rõ phạm vi giúp tránh việc thiết kế thừa thãi các tính năng không cần thiết, xác định đúng trọng tâm (Read-heavy hay Write-heavy), và thể hiện phong cách làm việc chuyên nghiệp của một Senior Engineer.',
          },
        ],
      },
      {
        id: 'case-url-shortener',
        title: 'Case 1: Thiết kế hệ thống Rút gọn URL (TinyURL / Bitly)',
        englishTitle: 'Case Study: Design a URL Shortener Service',
        summary: 'Thuật toán mã hóa Base62 vs MD5 băm, kiến trúc phân tán tạo ID duy nhất (Snowflake), thiết kế Caching và mở rộng DB hàng tỉ link.',
        estimatedMinutes: 30,
        coreConcepts: [
          {
            heading: '1. Yêu cầu & Ước lượng (Requirements & Estimation)',
            points: [
              'Functional: Nhập Long URL -> Trả về Short URL 7 ký tự; Truy cập Short URL -> Redirect 301/302 sang Long URL gốc; Đặt TTL cho link.',
              'Non-functional: Độ trễ chuyển hướng cực thấp (<20ms), tính sẵn sàng cao (High Availability 99.99%), link không thể trùng lặp.',
              'Capacity: 100M link mới/tháng -> Write QPS ~ 40 request/s. Tỉ lệ Read:Write = 100:1 -> Read QPS ~ 4,000 request/s. 5 năm cần lưu ~3TB dữ liệu.',
            ],
          },
          {
            heading: '2. Thuật toán tạo URL ngắn (Base62 Encoding)',
            points: [
              'Bộ ký tự Base62 gồm [0-9, a-z, A-Z] (62 ký tự). Với chuỗi dài 7 ký tự, số lượng URL khả dụng là 62^7 = ~3.5 nghìn tỷ URLs.',
              'Cách 1: Băm MD5/SHA256 của Long URL -> lấy 7 ký tự đầu. Nhược điểm: Có thể bị trùng mã băm (Hash Collision), cần query DB kiểm tra lại.',
              'Cách 2 (Khuyên dùng): Sử dụng Unique Global ID Generator (Twitter Snowflake hoặc Range-based ID Worker như ZooKeeper) sinh ID số nguyên dạng 64-bit -> Chuyển đổi ID đó sang chuỗi Base62. Đảm bảo 100% không bao giờ trùng lặp.',
            ],
          },
          {
            heading: '3. Mã trạng thái HTTP Redirect: 301 vs 302',
            points: [
              '301 Moved Permanently: Trình duyệt của người dùng sẽ Cache lại URL đích, các lần sau truy cập sẽ không gửi request về máy chủ nữa. Tiết kiệm tải server nhưng không thể thu thập Analytics số lượt click.',
              '302 Found (Temporary Redirect): Mọi lần click đều bắt buộc phải gửi request về hệ thống rút gọn URL trước khi chuyển tiếp. Phù hợp khi cần ghi log thống kê (Analytics tracking).',
            ],
          },
        ],
        interviewQA: [
          {
            question: 'Database nào phù hợp nhất để lưu trữ URL Shortener và vì sao?',
            answer: 'NoSQL Key-Value Store hoặc Wide-Column DB (như DynamoDB, Cassandra hoặc MongoDB) là lựa chọn tối ưu vì: 1. Mô hình dữ liệu cực kỳ đơn giản (chỉ gồm `short_key` làm Partition Key ánh xạ tới `long_url`, `user_id`, `created_at`). 2. Không cần quan hệ JOIN phức tạp hay ACID đa bảng. 3. Dễ dàng mở rộng ngang (Horizontal Scaling) khi dung lượng dữ liệu và QPS tăng cao.',
          },
        ],
      },
      {
        id: 'case-news-feed',
        title: 'Case 2: Thiết kế Bảng tin Mạng xã hội (News Feed - Twitter/Facebook)',
        englishTitle: 'Case Study: Design a Social Network News Feed System',
        summary: 'So sánh Fan-out on Write (Push Model) vs Fan-out on Read (Pull Model), kiến trúc Hybrid cho người nổi tiếng (Celebrity Problem), và kiến trúc Cache đa tầng.',
        estimatedMinutes: 35,
        coreConcepts: [
          {
            heading: '1. Kiến trúc Feed Publishing & Feed Generation',
            points: [
              'Feed Publishing: Khi user đăng bài viết, bài viết được lưu vào DB và đẩy tới bảng tin của tất cả bạn bè/followers.',
              'News Feed Generation: Khi user mở app, hệ thống tổng hợp và sắp xếp các bài viết từ bạn bè theo thứ tự thời gian hoặc thuật toán xếp hạng (Ranking).',
            ],
          },
          {
            heading: '2. Fan-out on Write (Push) vs Fan-out on Read (Pull)',
            points: [
              'Fan-out on Write (Push Model): Khi đăng bài, hệ thống ghi ngay ID bài viết vào Cache Feed của tất cả followers. Ưu điểm: Tốc độ đọc bảng tin siêu nhanh O(1). Nhược điểm: Tốn tài nguyên khi người dùng có hàng triệu followers (Celebrity Problem).',
              'Fan-out on Read (Pull Model): Bảng tin chỉ được tạo khi user mở app (kéo bài từ tất cả bạn bè về rồi sắp xếp). Ưu điểm: Đăng bài rất nhanh, không tốn tài nguyên cho user không hoạt động. Nhược điểm: Tốc độ tải bảng tin chậm khi user theo dõi nhiều người.',
              'Hybrid Model (Tối ưu chuẩn thực tế): Áp dụng Push cho người dùng thông thường (<10,000 followers). Với người nổi tiếng (KOL / Celebrity như Cristiano Ronaldo), bài viết của họ sẽ được Pull về và gộp vào feed khi người hâm mộ mở app.',
            ],
          },
        ],
        interviewQA: [
          {
            question: 'Làm thế nào để lưu trữ News Feed Cache của từng user trong Redis?',
            answer: 'Dùng cấu trúc dữ liệu Redis Sorted Set (ZSET). Trong đó: `key = feed:user_id`, `value = post_id`, và `score = timestamp_dang_bai`. Khi người dùng cuộn trang, ứng dụng chỉ cần dùng lệnh `ZREVRANGEBYSCORE` để lấy danh sách bài viết mới nhất cực kỳ nhanh chóng với độ phức tạp O(log N + M).',
          },
        ],
      },
      {
        id: 'case-chat-app',
        title: 'Case 3: Thiết kế Ứng dụng Chat thời gian thực (WhatsApp / Messenger)',
        englishTitle: 'Case Study: Design a Real-Time Chat System',
        summary: 'Kiến trúc kết nối WebSocket Gateway hai chiều, duy trì trạng thái Online/Offline Presence, và đảm bảo gửi tin nhắn tuần tự (Message Ordering & Delivery Status).',
        estimatedMinutes: 35,
        coreConcepts: [
          {
            heading: '1. Luồng truyền tin nhắn 1-1 (One-on-One Chat Flow)',
            points: [
              'User A gửi tin nhắn qua kết nối WebSocket tới WebSocket Server 1.',
              'WebSocket Server 1 đẩy tin nhắn vào Message Queue / Service xử lý để lưu tin nhắn vào DB bền vững (Cassandra / HBase).',
              'Service tra cứu trong Redis Session Store xem User B đang duy trì kết nối WebSocket ở WebSocket Server nào (vd: Server 2).',
              'Tin nhắn được chuyển tới WebSocket Server 2 để đẩy trực tiếp xuống thiết bị của User B theo thời gian thực.',
              'Nếu User B đang Offline, hệ thống gửi Notification qua Apple APNs hoặc Google FCM.',
            ],
          },
          {
            heading: '2. Trạng thái tin nhắn (Delivery Status) & Online Presence',
            points: [
              '3 Trạng thái tin nhắn kinh điển: Sent (Đã gửi tới server) -> Delivered (Đã tới thiết bị người nhận) -> Read (Người nhận đã mở xem).',
              'Quản lý Online Presence: Thiết bị Client gửi tín hiệu Heartbeat định kỳ (vd: mỗi 5s) lên Redis với TTL = 10s. Nếu quá 10s không nhận được heartbeat, user tự động chuyển trạng thái sang Offline.',
            ],
          },
        ],
        interviewQA: [
          {
            question: 'Tại sao Cassandra hoặc HBase lại được chọn để lưu trữ lịch sử tin nhắn Chat thay vì MySQL?',
            answer: '1. Đặc thù Chat là Write-heavy (hàng tỉ tin nhắn mới mỗi ngày) và đọc các tin nhắn gần đây nhất. Cassandra sử dụng LSM-Tree cho tốc độ ghi cực nhanh. 2. Dữ liệu chat không bao giờ bị cập nhật (Immutable data). 3. Dễ dàng Partition theo `conversation_id` kết hợp Clustering Key là `message_id/created_at` giúp truy vấn phân trang tin nhắn cũ siêu tốc.',
          },
        ],
      },
    ],
  },
];
