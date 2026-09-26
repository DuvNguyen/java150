import os, json, re

roadmap_dir = '/home/levi/Desktop/Projects/java150/handbook/src/data/spring-boot-roadmap'
md_map = {}
for f in os.listdir(roadmap_dir):
    if f.endswith('.md'):
        m = re.search(r'^(.*?)@(.*)\.md$', f)
        if m:
            slug, nid = m.groups()
            with open(os.path.join(roadmap_dir, f), 'r', encoding='utf-8') as fp:
                md_map[nid] = {
                    'slug': slug,
                    'file': f,
                    'raw': fp.read().strip()
                }

# Modules taxonomy
MODULES_DEF = [
    {
        "id": "module-1-core",
        "title": "1. Spring Framework & Cốt lõi IoC/DI",
        "englishTitle": "Spring Core & Inversion of Control",
        "badge": "Module 1",
        "description": "Nắm vững triết lý cốt lõi của Spring Framework: Inversion of Control (IoC), Dependency Injection (DI), vòng đời và phạm vi của Spring Bean (Bean Lifecycle & Scopes), Spring AOP và hệ thống Annotation chuẩn mực.",
        "topicIds": [
            "jy2heDVZuM6ASCXlI1TDn", # Introduction
            "WGf3W6bdWL0rK0o6O28G2", # Why use Spring?
            "WrUCyVfFNUpHB8jyjjKna", # Terminology
            "yuXN-rD4AyyPYUYOR50L_", # Architecture
            "PlUU_vzFQ3Xx6Z5XREIYP", # Spring IOC
            "C2EQ5J1aJYF9e9Rr2KysT", # Dependency Injection
            "KdN62IpNgPFMndXfLaYa1", # Spring Bean Scope
            "HdCpfGMrMaXxk5QrtYn3X", # Annotations
            "wV1_I_4czMIxpBionvLs4", # Spring AOP
            "OB--nMudscm0p6RqqfA7T"  # Configuration
        ]
    },
    {
        "id": "module-2-boot-internals",
        "title": "2. Spring Boot Internals & Cấu hình",
        "englishTitle": "Spring Boot Architecture & Autoconfiguration",
        "badge": "Module 2",
        "description": "Hiểu rõ cơ chế khởi động thần kỳ của Spring Boot: Starters Dependencies, Autoconfiguration (@Conditional annotations), Embedded Server (Tomcat/Jetty), và giám sát vận hành qua Spring Boot Actuator.",
        "topicIds": [
            "JrH2hiu27PhIO1VtrArMa", # Spring Boot Starters
            "88-h3d7kb-VmUBsnUUXW_", # Autoconfiguration
            "ONb0VnSUMY8JBeW3G2mTp", # Embedded Server
            "N7hd3d_XQtvOgnCqdCFt3"  # Actuators
        ]
    },
    {
        "id": "module-3-web-mvc",
        "title": "3. Spring MVC & RESTful Web APIs",
        "englishTitle": "Spring MVC & Web APIs",
        "badge": "Module 3",
        "description": "Xây dựng RESTful Web API chuẩn doanh nghiệp: Luồng xử lý DispatcherServlet, Controller, Service, Repository, DTO Validation, Global Exception Handling (RFC 7807 Problem Details).",
        "topicIds": [
            "S-BbOoRD7anvoJrprjoKF", # Spring MVC (main topic)
            "QiNWE4sMTao3cVzjt3yPp", # Spring MVC (subtopic)
            "_vS_zdJZegZS6MIKAFyg8", # MVC Architecture
            "35NTx2eO1j02sjy4m6DPq", # Servlet
            "sgA06Tu9Y4cEHtfI8CyLL", # Components
            "Lz0GPMiYzb30iFJdv1dL6"  # JSP Files (Legacy view engine)
        ]
    },
    {
        "id": "module-4-persistence",
        "title": "4. Quản trị Dữ liệu, Hibernate & Spring Data",
        "englishTitle": "Data Persistence & Transactions",
        "badge": "Module 4",
        "description": "Làm chủ tầng lưu trữ dữ liệu trong Java: Hibernate ORM, Entity Lifecycle, Quan hệ bảng (OneToMany/ManyToOne), Dirty Checking, Quản lý giao dịch (@Transactional), Spring Data JPA, JDBC & NoSQL MongoDB.",
        "topicIds": [
            "h5-HnycxfbJgwalSdXTAz", # Hibernate
            "Ijmy0J3VyaeTGXtu2VkkQ", # Entity Lifecycle
            "D4ybyh0ydvl9W2_xUcvZ_", # Relationships
            "H9Z0EvKT_148vD0mR-dUf", # Transactions
            "pvVLbFQoT50vz_VRK4VbJ", # Spring Data
            "6u08QN-pUeFm3o0h5Scfm", # Spring Data JPA
            "dd1A-MyzBs_kNOtVG7f1D", # Spring Data JDBC
            "fy-TphbqkLpR1zvFcr7dg"  # Spring Data MongoDB
        ]
    },
    {
        "id": "module-5-security",
        "title": "5. Bảo mật với Spring Security 6 & OAuth2",
        "englishTitle": "Spring Security & Access Control",
        "badge": "Module 5",
        "description": "Bảo vệ ứng dụng web và API theo chuẩn Spring Security 6 hiện đại: SecurityFilterChain (Lambda DSL), Xác thực Authentication, Phân quyền Authorization, Stateless JWT, OAuth2 Resource Server.",
        "topicIds": [
            "KaUdyVWEiZa6lUDRBlOKt", # Spring Security
            "ssdk2iAt4avhc8B5tnIzQ", # Authentication
            "c7w7Z3Coa81FKa_yAKTse", # Authorization
            "1My7mbdwAbRcJoiA50pWW", # JWT Authentication
            "p7t3RlIIm9U08GFC6azff"  # OAuth2
        ]
    },
    {
        "id": "module-6-testing-microservices",
        "title": "6. Kiểm thử & Kiến trúc Microservices",
        "englishTitle": "Testing & Cloud Microservices",
        "badge": "Module 6",
        "description": "Chiến lược kiểm thử toàn diện (Unit Test, MockMvc, DataJpaTest, @SpringBootTest) và kiến trúc Microservices điện toán đám mây (Spring Cloud Gateway, Cloud Config, Circuit Breaker Resilience4j, OpenFeign, Micrometer Tracing).",
        "topicIds": [
            "7Qqrh_Rz_7uAD49g9sDzi", # Testing
            "5d1BERqTKNJMKiBcqa8Ie", # Mock MVC
            "Nhx2QiSD_4pVWD17lsCbu", # JPA Test
            "p91CaVPh5GMzFU0yEU_hl", # @SpringBootTest Annotation
            "i77NTa0hpGGBjmql9u_CT", # @MockBean Annotation
            "jU_KHoPUSU_HoIKk0ZpRF", # Microservices
            "VWNDYSw83Vzi2UPQprJ5z", # Spring Cloud
            "f-i0NX2KOzCh3JwkaSPFo", # Spring Cloud Gateway
            "9hG3CB8r41bUb_s8-0u73", # Cloud Config
            "kqpSlO--X9-xYxfq1KFVe", # Spring Cloud Circuit Breaker
            "EKSXTMSN2xdaleJ4wOV1A", # Spring Cloud Open Feign
            "6sLE6gb5Y477SmO2GhQIG", # Eureka
            "GsmBGRohWbJ6XOaALFZ8o"  # Micrometer
        ]
    }
]

# Topic details metadata
TOPIC_DETAILS = {
    "jy2heDVZuM6ASCXlI1TDn": {
        "title": "Giới thiệu Spring Boot",
        "englishTitle": "Introduction to Spring Boot",
        "summary": "Spring Boot là framework xây dựng trên nền Spring nhằm đơn giản hóa việc khởi tạo, cấu hình và triển khai ứng dụng Java cấp doanh nghiệp theo triết lý 'Convention over Configuration'.",
        "estimatedMinutes": 15,
        "coreConcepts": [
            {
                "heading": "Triết lý và Mục tiêu của Spring Boot",
                "points": [
                    "Đơn giản hóa cấu hình: Loại bỏ hoàn toàn cấu hình XML cồng kềnh truyền thống bằng cấu hình tự động (Autoconfiguration) và Java Annotations.",
                    "Sẵn sàng cho Production (Production-Ready): Tích hợp sẵn Embedded Tomcat/Jetty server, Health check, Metrics và quản trị cấu hình qua application.yml.",
                    "Hệ sinh thái Starter POMs: Tự động gom các thư viện phụ thuộc tương thích vào một dependency duy nhất."
                ]
            }
        ],
        "javaDeepDive": {
            "title": "Cấu trúc một ứng dụng Spring Boot 3 chuẩn",
            "description": "Điểm khởi đầu của mọi ứng dụng Spring Boot với annotation `@SpringBootApplication` kết hợp `@Configuration`, `@EnableAutoConfiguration` và `@ComponentScan`.",
            "codeSnippet": """package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DemoApplication {
    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }
}"""
        },
        "interviewQA": [
            {
                "question": "Sự khác biệt cốt lõi giữa Spring Framework truyền thống và Spring Boot là gì?",
                "answer": "Spring Framework cung cấp các tính năng nền tảng như IoC, AOP, MVC nhưng yêu cầu cấu hình thủ công rất nhiều file XML/Java Config và triển khai trên Web Server ngoài (như standalone Tomcat). Spring Boot giải quyết vấn đề này bằng Autoconfiguration, Starters quản lý dependencies, và tích hợp sẵn Embedded Web Server giúp chạy ứng dụng như một file JAR độc lập (`java -jar`)."
            }
        ]
    },
    "PlUU_vzFQ3Xx6Z5XREIYP": {
        "title": "Spring IoC Container",
        "englishTitle": "Spring Inversion of Control (IoC)",
        "summary": "IoC (Inversion of Control) chuyển giao quyền kiểm soát khởi tạo và quản lý vòng đời của đối tượng từ lập trình viên sang cho Spring Container (ApplicationContext).",
        "estimatedMinutes": 20,
        "coreConcepts": [
            {
                "heading": "Cơ chế hoạt động của IoC Container",
                "points": [
                    "BeanFactory vs ApplicationContext: ApplicationContext là giao diện nâng cao mở rộng từ BeanFactory, hỗ trợ nạp cấu hình tự động, AOP, sự kiện quốc tế hóa và tích hợp môi trường.",
                    "Quản lý Bean: Khởi tạo, cấu hình các phụ thuộc và tiêu hủy đối tượng khi ứng dụng tắt."
                ]
            }
        ],
        "javaDeepDive": {
            "title": "ApplicationContext trong Java",
            "description": "Truy xuất Bean từ ApplicationContext.",
            "codeSnippet": """ApplicationContext context = new AnnotationConfigApplicationContext(AppConfig.class);
PaymentService paymentService = context.getBean(PaymentService.class);
paymentService.processPayment(100.0);"""
        },
        "interviewQA": [
            {
                "question": "Tại sao lại cần Inversion of Control (IoC) trong kiến trúc phần mềm?",
                "answer": "IoC giúp giảm tính phụ thuộc chặt chẽ (Decoupling) giữa các lớp, tăng khả năng tái sử dụng mã nguồn, dễ dàng viết Unit Test bằng cách Mock các dependencies và tuân thủ nguyên lý Dependency Inversion trong SOLID."
            }
        ]
    },
    "C2EQ5J1aJYF9e9Rr2KysT": {
        "title": "Dependency Injection (DI)",
        "englishTitle": "Dependency Injection Patterns",
        "summary": "Mô hình thiết kế thực thi IoC bằng cách tiêm phụ thuộc vào class thay vì class tự khởi tạo đối tượng bằng từ khóa `new`.",
        "estimatedMinutes": 20,
        "coreConcepts": [
            {
                "heading": "3 Hình thức Tiêm phụ thuộc trong Spring",
                "points": [
                    "Constructor Injection (Thực hành tốt nhất - Best Practice): Đảm bảo các phụ thuộc bắt buộc không bị `null`, giúp class mang tính bất biến (Immutable) và dễ viết Unit Test.",
                    "Setter Injection: Dùng cho các phụ thuộc không bắt buộc (Optional dependencies).",
                    "Field Injection (`@Autowired` trên field): KHÔNG khuyến khích vì gây khó khăn khi viết Unit Test mà không có Spring Context và vi phạm tính đóng gói."
                ]
            }
        ],
        "javaDeepDive": {
            "title": "Constructor Injection chuẩn trong Spring Boot 3",
            "description": "Từ Spring 4.3+, class có 1 constructor duy nhất không cần khai báo annotation `@Autowired`.",
            "codeSnippet": """@Service
public class OrderService {
    private final PaymentService paymentService;
    private final NotificationService notificationService;

    // Khuyến nghị: Constructor Injection (hoặc dùng Lombok @RequiredArgsConstructor)
    public OrderService(PaymentService paymentService, NotificationService notificationService) {
        this.paymentService = paymentService;
        this.notificationService = notificationService;
    }
}"""
        },
        "interviewQA": [
            {
                "question": "Tại sao Constructor Injection lại là Best Practice so với Field Injection?",
                "answer": "1. Khởi tạo đối tượng toàn vẹn (Immutability với từ khóa `final`). 2. Ngăn ngừa lỗi `NullPointerException` lúc runtime. 3. Dễ dàng viết Unit Test bằng cách khởi tạo class và truyền mock trực tiếp qua constructor mà không cần Reflection."
            }
        ]
    },
    "KdN62IpNgPFMndXfLaYa1": {
        "title": "Spring Bean Scopes & Lifecycle",
        "englishTitle": "Bean Scopes and Lifecycle Callbacks",
        "summary": "Phạm vi tồn tại của Bean trong Spring Container (Singleton, Prototype, Request, Session) và các giai đoạn khởi tạo/hủy của một Bean.",
        "estimatedMinutes": 20,
        "coreConcepts": [
            {
                "heading": "Các phạm vi Bean (Bean Scopes)",
                "points": [
                    "Singleton (Mặc định): Chỉ có 1 instance duy nhất được tạo trong Spring IoC Container. Yêu cầu Bean phải là Stateless để đảm bảo Thread-safe.",
                    "Prototype: Mỗi lần inject hoặc gọi `getBean()` sẽ tạo ra một instance mới hoàn toàn.",
                    "Web Scopes: Request (mỗi HTTP request 1 bean), Session (mỗi HTTP session 1 bean), Application (toàn bộ ServletContext)."
                ]
            }
        ],
        "javaDeepDive": {
            "title": "Vòng đời của Bean với `@PostConstruct` và `@PreDestroy`",
            "description": "Hook vào vòng đời khởi tạo và dọn dẹp tài nguyên (Jakarta EE / Spring Boot 3).",
            "codeSnippet": """@Component
public class DatabaseConnectionPool {

    @PostConstruct
    public void init() {
        System.out.println("Bean đã được inject dependencies xong -> Mở kết nối Pool");
    }

    @PreDestroy
    public void cleanup() {
        System.out.println("Ứng dụng chuẩn bị tắt -> Đóng kết nối Pool an toàn");
    }
}"""
        },
        "interviewQA": [
            {
                "question": "Điều gì xảy ra nếu inject một Prototype Bean vào một Singleton Bean?",
                "answer": "Vì Singleton Bean chỉ được khởi tạo 1 lần duy nhất khi ứng dụng chạy, nên Prototype Bean cũng chỉ được inject đúng 1 lần vào lúc đó và sẽ không bao giờ được tạo mới ở các lần gọi sau. Để giải quyết, cần sử dụng `@Lookup` method hoặc `ObjectProvider<T>`."
            }
        ]
    },
    "wV1_I_4czMIxpBionvLs4": {
        "title": "Spring AOP (Lập trình hướng khía cạnh)",
        "englishTitle": "Aspect-Oriented Programming (AOP)",
        "summary": "Tách biệt các mối quan tâm xuyên suốt (Cross-cutting Concerns) như Logging, Security, Transaction Management ra khỏi nghiệp vụ chính.",
        "estimatedMinutes": 25,
        "coreConcepts": [
            {
                "heading": "Các khái niệm cốt lõi trong AOP",
                "points": [
                    "Aspect: Module đóng gói khía cạnh xuyên suốt (vd: LoggingAspect).",
                    "JoinPoint: Điểm trong luồng thực thi chương trình (như gọi một method).",
                    "Pointcut: Biểu thức xác định JoinPoint nào sẽ áp dụng Aspect (vd: `execution(* com.example.service.*.*(..))`).",
                    "Advice: Hành động thực thi tại Pointcut: `@Before`, `@After`, `@AfterReturning`, `@AfterThrowing`, `@Around`."
                ]
            }
        ],
        "javaDeepDive": {
            "title": "Ví dụ tạo Aspect đo thời gian thực thi (Execution Time)",
            "description": "Sử dụng `@Around` Advice để benchmark method trong Spring.",
            "codeSnippet": """@Aspect
@Component
@Slf4j
public class PerformanceAspect {

    @Around("@annotation(LogExecutionTime)")
    public Object logTime(ProceedingJoinPoint joinPoint) throws Throwable {
        long start = System.currentTimeMillis();
        Object result = joinPoint.proceed();
        long duration = System.currentTimeMillis() - start;
        log.info("Method {} thực thi trong {} ms", joinPoint.getSignature().getName(), duration);
        return result;
    }
}"""
        },
        "interviewQA": [
            {
                "question": "Spring AOP sử dụng cơ chế gì để can thiệp vào các methods?",
                "answer": "Spring AOP sử dụng cơ chế Dynamic Proxy: Mặc định dùng CGLIB Proxy (tạo subclass kế thừa) hoặc JDK Dynamic Proxy (nếu target class implement interface). Khi gọi method từ bên trong cùng một class (`this.otherMethod()`), Proxy sẽ bị bỏ qua và Aspect không được kích hoạt."
            }
        ]
    },
    "JrH2hiu27PhIO1VtrArMa": {
        "title": "Spring Boot Starters",
        "englishTitle": "Spring Boot Starters Ecosystem",
        "summary": "Tập hợp các bộ mô tả phụ thuộc (dependency descriptors) tiện lợi giúp nhập đầy đủ các thư viện liên quan chỉ với một dòng cấu hình trong pom.xml / build.gradle.",
        "estimatedMinutes": 15,
        "coreConcepts": [
            {
                "heading": "Các Starter phổ biến nhất",
                "points": [
                    "`spring-boot-starter-web`: Tích hợp Spring MVC, REST, Jackson JSON, và Embedded Tomcat.",
                    "`spring-boot-starter-data-jpa`: Tích hợp Hibernate ORM, Spring Data JPA, và HikariCP Connection Pool.",
                    "`spring-boot-starter-security`: Tích hợp Spring Security và bộ lọc xác thực cơ bản.",
                    "`spring-boot-starter-validation`: Tích hợp Hibernate Validator cho DTO validation."
                ]
            }
        ],
        "javaDeepDive": {
            "title": "Cấu hình Starter trong pom.xml",
            "description": "Khai báo starter mà không cần chỉ định version nhờ `spring-boot-starter-parent`.",
            "codeSnippet": """<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>"""
        },
        "interviewQA": [
            {
                "question": "Lợi ích của việc dùng Spring Boot Starter so với khai báo từng thư viện riêng lẻ là gì?",
                "answer": "Starters loại bỏ hoàn toàn tình trạng xung đột phiên bản (Dependency Hell / Version Mismatches), tối ưu hóa cấu hình tự động tương thích và giúp file `pom.xml` gọn gàng, dễ bảo trì."
            }
        ]
    },
    "88-h3d7kb-VmUBsnUUXW_": {
        "title": "Autoconfiguration & @Conditional",
        "englishTitle": "Autoconfiguration & Conditional Annotations",
        "summary": "Cơ chế tự động dò tìm classpath và tạo các Spring Bean thích hợp mà không cần cấu hình thủ công.",
        "estimatedMinutes": 25,
        "coreConcepts": [
            {
                "heading": "Nguyên lý Autoconfiguration",
                "points": [
                    "Các annotation điều kiện: `@ConditionalOnClass` (nếu thư viện có trong classpath), `@ConditionalOnMissingBean` (chỉ tạo nếu người dùng chưa tự định nghĩa), `@ConditionalOnProperty` (dựa trên cấu hình trong yaml).",
                    "Cơ chế SPI: Được nạp thông qua file `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports` trong Spring Boot 3."
                ]
            }
        ],
        "javaDeepDive": {
            "title": "Tự viết Custom Autoconfiguration",
            "description": "Sử dụng `@ConditionalOnMissingBean` để người dùng có thể linh hoạt override.",
            "codeSnippet": """@AutoConfiguration
public class MyServiceAutoConfiguration {

    @Bean
    @ConditionalOnMissingBean
    public MyService myService() {
        return new DefaultMyServiceImpl();
    }
}"""
        },
        "interviewQA": [
            {
                "question": "Làm thế nào để vô hiệu hóa (disable) một tính năng Autoconfiguration cụ thể trong Spring Boot?",
                "answer": "Có thể loại bỏ bằng thuộc tính `exclude` trong annotation: `@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})` hoặc cấu hình trong `application.properties`: `spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration`."
            }
        ]
    },
    "N7hd3d_XQtvOgnCqdCFt3": {
        "title": "Spring Boot Actuators & Metrics",
        "englishTitle": "Spring Boot Actuators & Production Observability",
        "summary": "Cung cấp các endpoint HTTP/JMX để giám sát trạng thái sức khỏe (Health), cấu hình, bộ nhớ, threads và metrics của ứng dụng trong môi trường Production.",
        "estimatedMinutes": 20,
        "coreConcepts": [
            {
                "heading": "Các Endpoints quan trọng của Actuator",
                "points": [
                    "`/actuator/health`: Kiểm tra trạng thái UP/DOWN của ứng dụng, DB, Redis, RabbitMQ.",
                    "`/actuator/metrics`: Đo lường CPU, RAM Heap, JVM Threads, HTTP Request Latency.",
                    "`/actuator/env`: Xem các biến môi trường và properties cấu hình.",
                    "`/actuator/loggers`: Xem và đổi log level (INFO -> DEBUG) trực tiếp lúc runtime mà không cần restart server."
                ]
            }
        ],
        "javaDeepDive": {
            "title": "Cấu hình mở Actuator Endpoints trong application.yml",
            "description": "Mở endpoint health và metrics an toàn.",
            "codeSnippet": """management:
  endpoints:
    web:
      exposure:
        include: health, info, metrics, prometheus
  endpoint:
    health:
      show-details: always"""
        },
        "interviewQA": [
            {
                "question": "Tại sao không nên mở toàn bộ Actuator endpoints (`include: '*'`) ra ngoài Internet?",
                "answer": "Vì các endpoint như `/actuator/env`, `/actuator/heapdump`, `/actuator/beans` có thể làm lộ thông tin mật (API keys, database credentials) hoặc gây sập hệ thống (DoS khi dump heap memory). Cần bảo vệ qua Spring Security hoặc chỉ mở nội bộ trong mạng Private."
            }
        ]
    },
    "S-BbOoRD7anvoJrprjoKF": {
        "title": "Spring MVC & DispatcherServlet",
        "englishTitle": "Spring MVC Architecture & Request Lifecycle",
        "summary": "Kiến trúc Model-View-Controller xây dựng trên nền tảng Servlet API, điều phối luồng request thông qua DispatcherServlet trung tâm.",
        "estimatedMinutes": 25,
        "coreConcepts": [
            {
                "heading": "Luồng đi của một HTTP Request trong Spring MVC",
                "points": [
                    "1. Client gửi request -> Filter Chain -> `DispatcherServlet` (Front Controller).",
                    "2. `DispatcherServlet` tra cứu `HandlerMapping` để tìm Controller và Method tương ứng.",
                    "3. `HandlerAdapter` gọi method trong Controller, xử lý data binding và validation.",
                    "4. Controller gọi Service -> Repository -> trả về DTO / ResponseEntity.",
                    "5. `HttpMessageConverter` (như Jackson) chuyển đổi đối tượng Java thành JSON payload trả về cho Client."
                ]
            }
        ],
        "javaDeepDive": {
            "title": "REST Controller chuẩn với Global Exception Handling (RFC 7807)",
            "description": "Xử lý lỗi tập trung bằng Problem Details chuẩn trong Spring Boot 3.",
            "codeSnippet": """@RestController
@RequestMapping("/api/v1/users")
@Validated
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<UserResponseDto> createUser(@Valid @RequestBody CreateUserRequest request) {
        UserResponseDto created = userService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
}

// Global Exception Handler
@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(ResourceNotFoundException.class)
    public ProblemDetail handleNotFound(ResourceNotFoundException ex) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, ex.getMessage());
        problem.setTitle("Resource Not Found");
        return problem;
    }
}"""
        },
        "interviewQA": [
            {
                "question": "Sự khác biệt giữa `@Controller` và `@RestController` là gì?",
                "answer": "`@RestController` là sự kết hợp của `@Controller` và `@ResponseBody`. Với `@RestController`, mọi method mặc định trả về dữ liệu thô (JSON/XML) được tuần tự hóa qua `HttpMessageConverter` thay vì tìm kiếm template View HTML."
            }
        ]
    },
    "6u08QN-pUeFm3o0h5Scfm": {
        "title": "Spring Data JPA & Hibernate",
        "englishTitle": "Spring Data JPA, Repositories & Hibernate",
        "summary": "Lớp trừu tượng hóa mạnh mẽ trên nền Hibernate/JPA giúp thực hiện CRUD, phân trang, truy vấn động qua Method Name convention và JPQL/Native Query mà không cần viết boilerplate code.",
        "estimatedMinutes": 25,
        "coreConcepts": [
            {
                "heading": "Các tính năng nổi bật của Spring Data JPA",
                "points": [
                    "Repository Interfaces: Kế thừa `JpaRepository<T, ID>` để có sẵn các phương thức CRUD, Paging & Sorting.",
                    "Derived Query Methods: Tự động sinh SQL từ tên hàm (vd: `findByEmailAndStatus(String email, Status s)`).",
                    "`@Query`: Viết JPQL hoặc Native SQL cho các truy vấn phức tạp.",
                    "Khắc phục N+1 Problem: Sử dụng `JOIN FETCH` hoặc `@EntityGraph` để nạp dữ liệu quan hệ chỉ trong 1 truy vấn SQL duy nhất."
                ]
            }
        ],
        "javaDeepDive": {
            "title": "Spring Data JPA Repository với `@EntityGraph` chống N+1",
            "description": "Nạp Entity cha cùng danh sách con chỉ với 1 câu lệnh SELECT duy nhất.",
            "codeSnippet": """public interface OrderRepository extends JpaRepository<Order, Long> {

    // Nạp đồng thời OrderItems để tránh N+1 Query
    @EntityGraph(attributePaths = {"items", "customer"})
    Optional<Order> findWithItemsById(Long id);

    @Query("SELECT o FROM Order o WHERE o.status = :status")
    Page<Order> findByStatusPaged(@Param("status") OrderStatus status, Pageable pageable);
}"""
        },
        "interviewQA": [
            {
                "question": "Vấn đề N+1 Query trong JPA là gì và làm thế nào để giải quyết triệt để?",
                "answer": "N+1 Query xảy ra khi truy vấn 1 danh sách N bản ghi cha (1 query), sau đó vòng lặp truy cập vào quan hệ `@ManyToOne` hoặc `@OneToMany` (Lazy loading) khiến Hibernate bắn thêm N câu query phụ xuống DB. Giải quyết bằng cách: 1. Sử dụng `JOIN FETCH` trong JPQL. 2. Sử dụng `@EntityGraph`. 3. Sử dụng DTO Projection (`SELECT new com.example.OrderDto(...)`)."
            }
        ]
    },
    "H9Z0EvKT_148vD0mR-dUf": {
        "title": "Quản lý Giao dịch (@Transactional)",
        "englishTitle": "Declarative Transaction Management",
        "summary": "Cơ chế quản lý transaction tự động bằng AOP Proxy, đảm bảo tính nguyên tử (Atomicity) và toàn vẹn dữ liệu cho các thao tác ghi vào cơ sở dữ liệu.",
        "estimatedMinutes": 20,
        "coreConcepts": [
            {
                "heading": "Thuộc tính quan trọng của `@Transactional`",
                "points": [
                    "Propagation: `REQUIRED` (mặc định - tham gia transaction hiện có hoặc tạo mới), `REQUIRES_NEW` (luôn tạo transaction độc lập mới và tạm dừng transaction cha).",
                    "Rollback Rules: Mặc định chỉ rollback khi gặp `RuntimeException` và `Error`, KHÔNG tự rollback khi gặp checked exceptions (trừ khi khai báo `rollbackFor = Exception.class`).",
                    "`readOnly = true`: Tối ưu hiệu năng cho truy vấn đọc, Hibernate sẽ bỏ qua cơ chế Dirty Checking snapshot."
                ]
            }
        ],
        "javaDeepDive": {
            "title": "Sử dụng `@Transactional` an toàn trong Service",
            "description": "Khai báo `rollbackFor` và `readOnly` chuẩn mực.",
            "codeSnippet": """@Service
public class BankTransferService {

    @Transactional(rollbackFor = Exception.class)
    public void transferMoney(Long fromAcc, Long toAcc, BigDecimal amount) {
        accountRepo.debit(fromAcc, amount);
        accountRepo.credit(toAcc, amount);
        auditRepo.save(new AuditLog("Transfer success", fromAcc, toAcc, amount));
    }
}"""
        },
        "interviewQA": [
            {
                "question": "Tại sao việc gọi một method mang `@Transactional` từ một method khác trong CÙNG MỘT CLASS lại không có tác dụng rollback?",
                "answer": "Vì Spring `@Transactional` hoạt động dựa trên cơ chế AOP Dynamic Proxy. Khi gọi method nội bộ qua con trỏ `this`, lời gọi không đi qua Proxy của Spring, do đó Transaction Interceptor không được kích hoạt. Cách khắc phục: chuyển method sang một `@Service` riêng hoặc inject chính service đó (Self-injection)."
            }
        ]
    },
    "KaUdyVWEiZa6lUDRBlOKt": {
        "title": "Spring Security 6 Architecture & JWT",
        "englishTitle": "Spring Security 6 & Stateless JWT Architecture",
        "summary": "Kiến trúc bảo mật hiện đại với SecurityFilterChain, quản lý xác thực phân quyền không trạng thái bằng JSON Web Token (JWT).",
        "estimatedMinutes": 30,
        "coreConcepts": [
            {
                "heading": "Kiến trúc SecurityFilterChain trong Spring Boot 3",
                "points": [
                    "Cấu hình Lambda DSL: Loại bỏ hoàn toàn cú pháp cũ `authorizeRequests()`, thay bằng `authorizeHttpRequests(auth -> auth...)`.",
                    "Stateless Session: Cấu hình `SessionCreationPolicy.STATELESS` cho REST API.",
                    "JWT Filter: Intercept request, trích xuất Bearer token từ Header `Authorization`, validate chữ ký số và nạp thông tin vào `SecurityContextHolder`."
                ]
            }
        ],
        "javaDeepDive": {
            "title": "Cấu hình SecurityFilterChain trong Spring Boot 3 / Spring Security 6",
            "description": "Cấu hình phân quyền chuẩn mực với Lambda DSL.",
            "codeSnippet": """@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, JwtAuthFilter jwtAuthFilter) throws Exception {
        return http
            .csrf(AbstractHttpConfigurer::disable)
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/v1/auth/**", "/actuator/health").permitAll()
                .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }
}"""
        },
        "interviewQA": [
            {
                "question": "Tại sao REST API sử dụng JWT lại nên tắt CSRF (`csrf.disable()`)?",
                "answer": "CSRF (Cross-Site Request Forgery) tấn công dựa trên cơ chế trình duyệt tự động đính kèm Cookie/Session khi gửi request xuyên domain. Với REST API không trạng thái (Stateless), JWT được lưu trữ phía client và gửi thủ công trong HTTP Header `Authorization: Bearer <token>`, trình duyệt không thể tự đính kèm header này nên nguy cơ tấn công CSRF không còn tồn tại."
            }
        ]
    },
    "7Qqrh_Rz_7uAD49g9sDzi": {
        "title": "Kiểm thử với Spring Boot Test & MockMvc",
        "englishTitle": "Testing: Unit, Slice & Integration Testing",
        "summary": "Chiến lược kiểm thử phần mềm đa tầng: Unit Test nhanh với Mockito, Slice Test với `@WebMvcTest` và Integration Test toàn diện với `@SpringBootTest`.",
        "estimatedMinutes": 25,
        "coreConcepts": [
            {
                "heading": "Các cấp độ Testing trong Spring Boot",
                "points": [
                    "Unit Test (Mockito): Test logic nghiệp vụ thuần túy của Service, mock toàn bộ Repository.",
                    "Slice Test (`@WebMvcTest`): Chỉ khởi động tầng Web Controller và Filter, mock tầng Service bằng `@MockBean`.",
                    "Data Slice Test (`@DataJpaTest`): Chỉ khởi động tầng JPA và database nhúng (H2 / Testcontainers).",
                    "Integration Test (`@SpringBootTest`): Khởi động toàn bộ Spring Context và kiểm thử luồng thực thi từ đầu đến cuối (End-to-End)."
                ]
            }
        ],
        "javaDeepDive": {
            "title": "Slice Test Controller với MockMvc trong Spring Boot 3",
            "description": "Kiểm tra endpoint API mà không cần khởi động toàn bộ server thật.",
            "codeSnippet": """@WebMvcTest(UserController.class)
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void shouldReturn200WhenUserExists() throws Exception {
        UserDto mockUser = new UserDto(1L, "Alice", "alice@example.com");
        Mockito.when(userService.findById(1L)).thenReturn(mockUser);

        mockMvc.perform(get("/api/v1/users/1"))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.name").value("Alice"))
               .andExpect(jsonPath("$.email").value("alice@example.com"));
    }
}"""
        },
        "interviewQA": [
            {
                "question": "Sự khác biệt giữa `@Mock` và `@MockBean` là gì?",
                "answer": "`@Mock` là annotation của thư viện Mockito thuần túy, tạo ra mock object mà không can thiệp vào Spring Context (dùng cho Unit Test siêu tốc). `@MockBean` là annotation của Spring Test, nó tạo mock object và ĐẶT VÀO trong Spring ApplicationContext để thay thế Bean thật tương ứng (dùng cho Slice & Integration Test)."
            }
        ]
    },
    "f-i0NX2KOzCh3JwkaSPFo": {
        "title": "Spring Cloud Gateway & Resilience4j",
        "englishTitle": "API Gateway & Circuit Breaker Pattern",
        "summary": "Định tuyến lưu lượng thông minh, rate limiting và bảo vệ hệ thống phân tán trước sự cố sập dây chuyền (Cascading Failures) bằng Circuit Breaker.",
        "estimatedMinutes": 25,
        "coreConcepts": [
            {
                "heading": "Nguyên lý hoạt động Circuit Breaker",
                "points": [
                    "CLOSED (Bình thường): Mọi request đều được gửi đến downstream service.",
                    "OPEN (Ngắt mạch): Khi tỷ lệ lỗi vượt ngưỡng (vd: >50%), ngắt mạch ngay lập tức và trả về Fallback response mà không gửi request sang service đang bị lỗi.",
                    "HALF-OPEN (Thử nghiệm): Cho phép một số ít request đi qua để thăm dò xem downstream service đã phục hồi chưa."
                ]
            }
        ],
        "javaDeepDive": {
            "title": "Cấu hình Circuit Breaker với Resilience4j trong Java",
            "description": "Áp dụng annotation `@CircuitBreaker` với hàm fallback dự phòng.",
            "codeSnippet": """@Service
@Slf4j
public class OrderServiceClient {

    @CircuitBreaker(name = "paymentService", fallbackMethod = "paymentFallback")
    public PaymentResponse callPaymentService(PaymentRequest request) {
        // Gọi HTTP sang Payment Service
        return restTemplate.postForObject("http://payment-service/api/pay", request, PaymentResponse.class);
    }

    // Hàm fallback dự phòng khi Payment Service bị sập hoặc timeout
    public PaymentResponse paymentFallback(PaymentRequest request, Throwable t) {
        log.warn("Payment Service không khả dụng, kích hoạt fallback: {}", t.getMessage());
        return new PaymentResponse("PENDING_PAYMENT_RETRY", "Hệ thống thanh toán đang bận, sẽ xử lý lại sau.");
    }
}"""
        },
        "interviewQA": [
            {
                "question": "Tại sao Circuit Breaker lại quan trọng trong kiến trúc Microservices?",
                "answer": "Khi một downstream service bị quá tải hoặc phản hồi chậm, các upstream services gọi đến sẽ bị nghẽn toàn bộ Thread Pool (Thread Starvation), dẫn đến sập toàn bộ hệ thống (Cascading Failure). Circuit Breaker ngắt mạch sớm (Fail-fast) và kích hoạt Fallback để bảo vệ toàn bộ kiến trúc luôn ổn định."
            }
        ]
    }
}

# Now let's generate full typescript data
def generate_ts():
    lines = []
    lines.append("// Dữ liệu Lộ trình Spring Boot chuẩn hóa từ roadmap.sh và Spring Boot 3.x / Java 21")
    lines.append("export type SpringBootStatus = 'not-started' | 'in-progress' | 'done';\n")
    
    lines.append("""export interface InterviewQA {
  question: string;
  answer: string;
}

export interface SpringBootTopic {
  id: string;
  slug: string;
  title: string;
  englishTitle: string;
  summary: string;
  estimatedMinutes: number;
  originalRoadmapMarkdown?: string;
  coreConcepts: {
    heading: string;
    points: string[];
  }[];
  javaDeepDive?: {
    title: string;
    description: string;
    codeSnippet?: string;
  } | null;
  interviewQA: InterviewQA[];
}

export interface SpringBootModule {
  id: string;
  title: string;
  englishTitle: string;
  badge: string;
  description: string;
  topics: SpringBootTopic[];
}

export function getSpringBootStatusKey(topicId: string): string {
  return `spring_boot_status_${topicId}`;
}

export function getSpringBootNoteKey(topicId: string): string {
  return `spring_boot_note_${topicId}`;
}
""")

    modules_data = []
    for mod in MODULES_DEF:
        m_id = mod["id"]
        m_title = mod["title"]
        m_eng = mod["englishTitle"]
        m_badge = mod["badge"]
        m_desc = mod["description"]
        
        topics = []
        for tid in mod["topicIds"]:
            md_info = md_map.get(tid, {})
            slug = md_info.get("slug", tid)
            raw_md = md_info.get("raw", "")
            
            # Format fallback title from slug
            clean_title = slug.replace("-", " ").title()
            
            detail = TOPIC_DETAILS.get(tid, {})
            title = detail.get("title", clean_title)
            eng_title = detail.get("englishTitle", clean_title)
            summary = detail.get("summary", f"Kiến thức và nguyên lý nền tảng của {clean_title} trong hệ sinh thái Spring Boot.")
            est_min = detail.get("estimatedMinutes", 20)
            core_concepts = detail.get("coreConcepts", [
                {
                    "heading": f"1. Khái niệm và Vai trò của {clean_title}",
                    "points": [
                        f"Nắm vững mục đích và bối cảnh sử dụng của {clean_title} trong ứng dụng Spring Boot.",
                        "Hiểu rõ luồng xử lý và cách cấu hình tương thích với Spring Boot 3 và Java 21."
                    ]
                }
            ])
            java_deep_dive = detail.get("javaDeepDive", None)
            qa = detail.get("interviewQA", [
                {
                    "question": f"Vai trò chính của {clean_title} trong Spring Boot là gì?",
                    "answer": f"{clean_title} đóng vai trò quan trọng trong việc thiết kế và xây dựng các thành phần của hệ thống Spring Boot chuẩn mực, giúp tối ưu hiệu năng và dễ bảo trì."
                }
            ])
            
            topics.append({
                "id": tid,
                "slug": slug,
                "title": title,
                "englishTitle": eng_title,
                "summary": summary,
                "estimatedMinutes": est_min,
                "originalRoadmapMarkdown": raw_md,
                "coreConcepts": core_concepts,
                "javaDeepDive": java_deep_dive,
                "interviewQA": qa
            })
            
        modules_data.append({
            "id": m_id,
            "title": m_title,
            "englishTitle": m_eng,
            "badge": m_badge,
            "description": m_desc,
            "topics": topics
        })
        
    lines.append(f"export const SPRING_BOOT_MODULES: SpringBootModule[] = {json.dumps(modules_data, ensure_ascii=False, indent=2)};\n")
    
    with open('/home/levi/Desktop/Projects/java150/handbook/src/lib/springBootData.ts', 'w', encoding='utf-8') as f:
        f.write("\n".join(lines))
        
    print("Generated handbook/src/lib/springBootData.ts successfully!")

generate_ts()
