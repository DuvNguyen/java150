// Dữ liệu Lộ trình Spring Boot chuẩn hóa từ roadmap.sh và Spring Boot 3.x / Java 21
export type SpringBootStatus = 'not-started' | 'in-progress' | 'done';

export interface InterviewQA {
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

export const SPRING_BOOT_MODULES: SpringBootModule[] = [
  {
    "id": "module-1-core",
    "title": "1. Spring Framework & Cốt lõi IoC/DI",
    "englishTitle": "Spring Core & Inversion of Control",
    "badge": "Module 1",
    "description": "Nắm vững triết lý cốt lõi của Spring Framework: Inversion of Control (IoC), Dependency Injection (DI), vòng đời và phạm vi của Spring Bean (Bean Lifecycle & Scopes), Spring AOP và hệ thống Annotation chuẩn mực.",
    "topics": [
      {
        "id": "jy2heDVZuM6ASCXlI1TDn",
        "slug": "introduction",
        "title": "Giới thiệu Spring Boot",
        "englishTitle": "Introduction to Spring Boot",
        "summary": "Spring Boot là framework xây dựng trên nền Spring nhằm đơn giản hóa việc khởi tạo, cấu hình và triển khai ứng dụng Java cấp doanh nghiệp theo triết lý 'Convention over Configuration'.",
        "estimatedMinutes": 15,
        "originalRoadmapMarkdown": "# Introduction\n \nSpring Boot is an extension of the Spring Framework that simplifies the creation of production-ready Java applications. It removes the need for manual configuration by providing sensible defaults, embedded servers, and auto-configuration based on the libraries present in the classpath. Developers use it to build stand-alone applications and microservices without writing large amounts of boilerplate setup code.\n\nVisit the following resources to learn more:\n\n- [@course@Spring Boot Course](https://spring.academy/courses/spring-boot)\n- [@official@Spring Boot](https://spring.io/projects/spring-boot)\n- [@article@Spring Boot - Introduction](https://www.tutorialspoint.com/spring_boot/spring_boot_introduction.htm)\n- [@article@Introduction to Spring Boot](https://medium.com/adessoturkey/introduction-to-spring-boot-458cb814ec14)\n- [@article@What-is-Spring-Boot?](https://www.ibm.com/topics/java-spring-boot)",
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
          "codeSnippet": "package com.example.demo;\n\nimport org.springframework.boot.SpringApplication;\nimport org.springframework.boot.autoconfigure.SpringBootApplication;\n\n@SpringBootApplication\npublic class DemoApplication {\n    public static void main(String[] args) {\n        SpringApplication.run(DemoApplication.class, args);\n    }\n}"
        },
        "interviewQA": [
          {
            "question": "Sự khác biệt cốt lõi giữa Spring Framework truyền thống và Spring Boot là gì?",
            "answer": "Spring Framework cung cấp các tính năng nền tảng như IoC, AOP, MVC nhưng yêu cầu cấu hình thủ công rất nhiều file XML/Java Config và triển khai trên Web Server ngoài (như standalone Tomcat). Spring Boot giải quyết vấn đề này bằng Autoconfiguration, Starters quản lý dependencies, và tích hợp sẵn Embedded Web Server giúp chạy ứng dụng như một file JAR độc lập (`java -jar`)."
          }
        ]
      },
      {
        "id": "WGf3W6bdWL0rK0o6O28G2",
        "slug": "why-use-spring",
        "title": "Why Use Spring",
        "englishTitle": "Why Use Spring",
        "summary": "Kiến thức và nguyên lý nền tảng của Why Use Spring trong hệ sinh thái Spring Boot.",
        "estimatedMinutes": 20,
        "originalRoadmapMarkdown": "# Why Spring\n\nSpring reduces the complexity of building Java applications by handling object creation, dependency wiring, and configuration through its container. It offers a consistent programming model across web, data access, security, and messaging, so teams do not need to combine unrelated libraries by hand. Companies use it because it scales from small services to large enterprise systems while keeping code testable and loosely coupled.\n\nVisit the following resources to learn more:\n\n- [@official@Why Spring?](https://spring.io/why-spring)\n- [@article@Spring vs Spring Boot: Know The Difference](https://www.interviewbit.com/blog/spring-vs-spring-boot)\n- [@article@A Comparison Between Spring and Spring Boot](https://www.baeldung.com/spring-vs-spring-boot)\n- [@article@Advantages of Spring Boot](https://www.adservio.fr/post/advantages-of-spring-boot)",
        "coreConcepts": [
          {
            "heading": "1. Khái niệm và Vai trò của Why Use Spring",
            "points": [
              "Nắm vững mục đích và bối cảnh sử dụng của Why Use Spring trong ứng dụng Spring Boot.",
              "Hiểu rõ luồng xử lý và cách cấu hình tương thích với Spring Boot 3 và Java 21."
            ]
          }
        ],
        "javaDeepDive": null,
        "interviewQA": [
          {
            "question": "Vai trò chính của Why Use Spring trong Spring Boot là gì?",
            "answer": "Why Use Spring đóng vai trò quan trọng trong việc thiết kế và xây dựng các thành phần của hệ thống Spring Boot chuẩn mực, giúp tối ưu hiệu năng và dễ bảo trì."
          }
        ]
      },
      {
        "id": "WrUCyVfFNUpHB8jyjjKna",
        "slug": "terminology",
        "title": "Terminology",
        "englishTitle": "Terminology",
        "summary": "Kiến thức và nguyên lý nền tảng của Terminology trong hệ sinh thái Spring Boot.",
        "estimatedMinutes": 20,
        "originalRoadmapMarkdown": "# Terminology\n\nSpring Boot terminology includes core concepts such as beans, application context, dependency injection, and auto-configuration. A bean is an object managed by the Spring container, while the application context is the environment that holds and wires these beans together. These terms appear throughout Spring documentation and describe how the framework organizes and manages application components.\n\nVisit the following resources to learn more:\n\n- [@official@Spring Boot](https://spring.io/projects/spring-boot)\n- [@official@Spring Boot - Starter Guide](https://spring.io/quickstart)",
        "coreConcepts": [
          {
            "heading": "1. Khái niệm và Vai trò của Terminology",
            "points": [
              "Nắm vững mục đích và bối cảnh sử dụng của Terminology trong ứng dụng Spring Boot.",
              "Hiểu rõ luồng xử lý và cách cấu hình tương thích với Spring Boot 3 và Java 21."
            ]
          }
        ],
        "javaDeepDive": null,
        "interviewQA": [
          {
            "question": "Vai trò chính của Terminology trong Spring Boot là gì?",
            "answer": "Terminology đóng vai trò quan trọng trong việc thiết kế và xây dựng các thành phần của hệ thống Spring Boot chuẩn mực, giúp tối ưu hiệu năng và dễ bảo trì."
          }
        ]
      },
      {
        "id": "yuXN-rD4AyyPYUYOR50L_",
        "slug": "architecture",
        "title": "Architecture",
        "englishTitle": "Architecture",
        "summary": "Kiến thức và nguyên lý nền tảng của Architecture trong hệ sinh thái Spring Boot.",
        "estimatedMinutes": 20,
        "originalRoadmapMarkdown": "# Architecture\n\nSpring's architecture is built around a container that manages application objects, called beans, and wires their dependencies together. It follows a modular design, split into core modules for dependency injection, data access, web, and testing, so applications can use only the parts they need. Spring Boot builds on top of this architecture by adding auto-configuration and embedded servers, letting applications run with minimal setup.\n\nVisit the following resources to learn more:\n\n- [@article@Spring Boot Architecture – Detailed Explanation](https://www.interviewbit.com/blog/spring-boot-architecture)",
        "coreConcepts": [
          {
            "heading": "1. Khái niệm và Vai trò của Architecture",
            "points": [
              "Nắm vững mục đích và bối cảnh sử dụng của Architecture trong ứng dụng Spring Boot.",
              "Hiểu rõ luồng xử lý và cách cấu hình tương thích với Spring Boot 3 và Java 21."
            ]
          }
        ],
        "javaDeepDive": null,
        "interviewQA": [
          {
            "question": "Vai trò chính của Architecture trong Spring Boot là gì?",
            "answer": "Architecture đóng vai trò quan trọng trong việc thiết kế và xây dựng các thành phần của hệ thống Spring Boot chuẩn mực, giúp tối ưu hiệu năng và dễ bảo trì."
          }
        ]
      },
      {
        "id": "PlUU_vzFQ3Xx6Z5XREIYP",
        "slug": "spring-ioc",
        "title": "Spring IoC Container",
        "englishTitle": "Spring Inversion of Control (IoC)",
        "summary": "IoC (Inversion of Control) chuyển giao quyền kiểm soát khởi tạo và quản lý vòng đời của đối tượng từ lập trình viên sang cho Spring Container (ApplicationContext).",
        "estimatedMinutes": 20,
        "originalRoadmapMarkdown": "# Spring IOC\n\nSpring IOC (Inversion of Control) is the principle behind Spring's container, where the framework, not the application code, controls the creation and lifecycle of objects. The container reads configuration metadata, whether from annotations or XML, to know which beans to create and how to connect them. This approach lets developers focus on business logic while Spring handles object instantiation and wiring.\n\nVisit the following resources to learn more:\n\n- [@article@Spring IoC, Spring Bean Example Tutorial](https://www.digitalocean.com/community/tutorials/spring-ioc-bean-example-tutorial)\n- [@article@Intro to Inversion of Control with Spring](https://www.baeldung.com/inversion-control-and-dependency-injection-in-spring)",
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
          "codeSnippet": "ApplicationContext context = new AnnotationConfigApplicationContext(AppConfig.class);\nPaymentService paymentService = context.getBean(PaymentService.class);\npaymentService.processPayment(100.0);"
        },
        "interviewQA": [
          {
            "question": "Tại sao lại cần Inversion of Control (IoC) trong kiến trúc phần mềm?",
            "answer": "IoC giúp giảm tính phụ thuộc chặt chẽ (Decoupling) giữa các lớp, tăng khả năng tái sử dụng mã nguồn, dễ dàng viết Unit Test bằng cách Mock các dependencies và tuân thủ nguyên lý Dependency Inversion trong SOLID."
          }
        ]
      },
      {
        "id": "C2EQ5J1aJYF9e9Rr2KysT",
        "slug": "dependency-injection",
        "title": "Dependency Injection (DI)",
        "englishTitle": "Dependency Injection Patterns",
        "summary": "Mô hình thiết kế thực thi IoC bằng cách tiêm phụ thuộc vào class thay vì class tự khởi tạo đối tượng bằng từ khóa `new`.",
        "estimatedMinutes": 20,
        "originalRoadmapMarkdown": "# Dependency Injection\n\nSpring Boot uses the Spring Framework's Inversion of Control (IoC) container to manage objects and their dependencies. The IoC container is responsible for creating objects, wiring them together, and managing their lifecycle. When an object is created, its dependencies are also created and injected into the object.\n\nVisit the following resources to learn more:\n\n- [@article@Spring Dependency Injection](https://www.baeldung.com/spring-dependency-injection)\n- [@article@Dependency Injection Using Spring Boot](https://medium.com/edureka/what-is-dependency-injection-5006b53af782)\n- [@video@Understanding Dependency Injection](https://www.youtube.com/watch?v=GB8k2-Egfv0)",
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
          "codeSnippet": "@Service\npublic class OrderService {\n    private final PaymentService paymentService;\n    private final NotificationService notificationService;\n\n    // Khuyến nghị: Constructor Injection (hoặc dùng Lombok @RequiredArgsConstructor)\n    public OrderService(PaymentService paymentService, NotificationService notificationService) {\n        this.paymentService = paymentService;\n        this.notificationService = notificationService;\n    }\n}"
        },
        "interviewQA": [
          {
            "question": "Tại sao Constructor Injection lại là Best Practice so với Field Injection?",
            "answer": "1. Khởi tạo đối tượng toàn vẹn (Immutability với từ khóa `final`). 2. Ngăn ngừa lỗi `NullPointerException` lúc runtime. 3. Dễ dàng viết Unit Test bằng cách khởi tạo class và truyền mock trực tiếp qua constructor mà không cần Reflection."
          }
        ]
      },
      {
        "id": "KdN62IpNgPFMndXfLaYa1",
        "slug": "spring-bean-scope",
        "title": "Spring Bean Scopes & Lifecycle",
        "englishTitle": "Bean Scopes and Lifecycle Callbacks",
        "summary": "Phạm vi tồn tại của Bean trong Spring Container (Singleton, Prototype, Request, Session) và các giai đoạn khởi tạo/hủy của một Bean.",
        "estimatedMinutes": 20,
        "originalRoadmapMarkdown": "# Spring Bean Scope\n\nIn the Spring Framework, a bean is an object that is instantiated, assembled, and managed by the Spring IoC container. One of the key features of the Spring container is its ability to manage the lifecycle of beans, which includes creating, configuring, and destroying beans as necessary. One way the container can control the lifecycle of a bean is by specifying its scope.\n\nVisit the following resources to learn more:\n\n- [@article@Spring - Bean Scopes](https://www.tutorialspoint.com/spring/spring_bean_scopes.htm)\n- [@article@Quick Guide to Spring Bean Scopes](https://www.baeldung.com/spring-bean-scopes)\n- [@article@Spring Bean Scopes](https://www.digitalocean.com/community/tutorials/spring-bean-scopes)",
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
          "codeSnippet": "@Component\npublic class DatabaseConnectionPool {\n\n    @PostConstruct\n    public void init() {\n        System.out.println(\"Bean đã được inject dependencies xong -> Mở kết nối Pool\");\n    }\n\n    @PreDestroy\n    public void cleanup() {\n        System.out.println(\"Ứng dụng chuẩn bị tắt -> Đóng kết nối Pool an toàn\");\n    }\n}"
        },
        "interviewQA": [
          {
            "question": "Điều gì xảy ra nếu inject một Prototype Bean vào một Singleton Bean?",
            "answer": "Vì Singleton Bean chỉ được khởi tạo 1 lần duy nhất khi ứng dụng chạy, nên Prototype Bean cũng chỉ được inject đúng 1 lần vào lúc đó và sẽ không bao giờ được tạo mới ở các lần gọi sau. Để giải quyết, cần sử dụng `@Lookup` method hoặc `ObjectProvider<T>`."
          }
        ]
      },
      {
        "id": "HdCpfGMrMaXxk5QrtYn3X",
        "slug": "annotations",
        "title": "Annotations",
        "englishTitle": "Annotations",
        "summary": "Kiến thức và nguyên lý nền tảng của Annotations trong hệ sinh thái Spring Boot.",
        "estimatedMinutes": 20,
        "originalRoadmapMarkdown": "# Annotations\n\nOAnnotations are metadata markers placed on classes, methods, or fields that tell Spring how to treat a piece of code, such as `@Component` to register a bean or `@Autowired` to inject a dependency. Spring Boot relies heavily on annotations to reduce configuration files, using ones like `@SpringBootApplication` to bootstrap an entire application with sensible defaults. They are processed at startup to wire beans, map requests, and configure behavior without extra boilerplate.\n\nVisit the following resources to learn more:\n\n- [@article@Spring Annotations](https://www.digitalocean.com/community/tutorials/spring-annotations)\n- [@article@Annotations in Spring](https://www.techferry.com/articles/spring-annotations.html)",
        "coreConcepts": [
          {
            "heading": "1. Khái niệm và Vai trò của Annotations",
            "points": [
              "Nắm vững mục đích và bối cảnh sử dụng của Annotations trong ứng dụng Spring Boot.",
              "Hiểu rõ luồng xử lý và cách cấu hình tương thích với Spring Boot 3 và Java 21."
            ]
          }
        ],
        "javaDeepDive": null,
        "interviewQA": [
          {
            "question": "Vai trò chính của Annotations trong Spring Boot là gì?",
            "answer": "Annotations đóng vai trò quan trọng trong việc thiết kế và xây dựng các thành phần của hệ thống Spring Boot chuẩn mực, giúp tối ưu hiệu năng và dễ bảo trì."
          }
        ]
      },
      {
        "id": "wV1_I_4czMIxpBionvLs4",
        "slug": "spring-aop",
        "title": "Spring AOP (Lập trình hướng khía cạnh)",
        "englishTitle": "Aspect-Oriented Programming (AOP)",
        "summary": "Tách biệt các mối quan tâm xuyên suốt (Cross-cutting Concerns) như Logging, Security, Transaction Management ra khỏi nghiệp vụ chính.",
        "estimatedMinutes": 25,
        "originalRoadmapMarkdown": "# Spring AOP\n\nSpring AOP (Aspect-Oriented Programming) lets developers add behavior to existing code without changing it directly, by defining cross-cutting concerns like logging, security, or transaction management as separate aspects. It works by intercepting method calls through proxies and applying the extra logic before, after, or around the original method. Spring uses AOP internally for features such as `@Transactional`, and developers can define their own aspects for reusable functionality.\n\nVisit the following resources to learn more:\n\n- [@article@Spring AOP Tutorial](https://www.simplilearn.com/tutorials/spring-tutorial/spring-aop-aspect-oriented-programming)\n- [@article@AOP with Spring Framework](https://www.tutorialspoint.com/spring/aop_with_spring.htm)\n- [@article@Spring AOP Tutorial](https://howtodoinjava.com/spring-aop-tutorial/)",
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
          "codeSnippet": "@Aspect\n@Component\n@Slf4j\npublic class PerformanceAspect {\n\n    @Around(\"@annotation(LogExecutionTime)\")\n    public Object logTime(ProceedingJoinPoint joinPoint) throws Throwable {\n        long start = System.currentTimeMillis();\n        Object result = joinPoint.proceed();\n        long duration = System.currentTimeMillis() - start;\n        log.info(\"Method {} thực thi trong {} ms\", joinPoint.getSignature().getName(), duration);\n        return result;\n    }\n}"
        },
        "interviewQA": [
          {
            "question": "Spring AOP sử dụng cơ chế gì để can thiệp vào các methods?",
            "answer": "Spring AOP sử dụng cơ chế Dynamic Proxy: Mặc định dùng CGLIB Proxy (tạo subclass kế thừa) hoặc JDK Dynamic Proxy (nếu target class implement interface). Khi gọi method từ bên trong cùng một class (`this.otherMethod()`), Proxy sẽ bị bỏ qua và Aspect không được kích hoạt."
          }
        ]
      },
      {
        "id": "OB--nMudscm0p6RqqfA7T",
        "slug": "configuration",
        "title": "Configuration",
        "englishTitle": "Configuration",
        "summary": "Kiến thức và nguyên lý nền tảng của Configuration trong hệ sinh thái Spring Boot.",
        "estimatedMinutes": 20,
        "originalRoadmapMarkdown": "# Configuration\n\nSpring Core Configuration is the process of configuring the Spring Framework, which involves specifying the various configuration details required for an application to function properly. This can include setting up beans, specifying bean dependencies, configuring aspect-oriented programming (AOP) aspects, and more. Configuration can be done through Java code, XML files, or using annotations in the code.\n\nVisit the following resources to learn more:\n\n- [@official@Spring Framework Documentation](https://docs.spring.io/spring/docs/current/spring-framework-reference/)\n- [@article@\"Spring Configuration\" tutorial](https://www.baeldung.com/project-configuration-with-spring)\n- [@article@\"Spring Framework\" tutorial](https://www.tutorialspoint.com/spring/index.htm)\n- [@video@Spring Configuration | Spring Tutorial For Beginners](https://www.youtube.com/watch?v=fLs_yULL10g)",
        "coreConcepts": [
          {
            "heading": "1. Khái niệm và Vai trò của Configuration",
            "points": [
              "Nắm vững mục đích và bối cảnh sử dụng của Configuration trong ứng dụng Spring Boot.",
              "Hiểu rõ luồng xử lý và cách cấu hình tương thích với Spring Boot 3 và Java 21."
            ]
          }
        ],
        "javaDeepDive": null,
        "interviewQA": [
          {
            "question": "Vai trò chính của Configuration trong Spring Boot là gì?",
            "answer": "Configuration đóng vai trò quan trọng trong việc thiết kế và xây dựng các thành phần của hệ thống Spring Boot chuẩn mực, giúp tối ưu hiệu năng và dễ bảo trì."
          }
        ]
      }
    ]
  },
  {
    "id": "module-2-boot-internals",
    "title": "2. Spring Boot Internals & Cấu hình",
    "englishTitle": "Spring Boot Architecture & Autoconfiguration",
    "badge": "Module 2",
    "description": "Hiểu rõ cơ chế khởi động thần kỳ của Spring Boot: Starters Dependencies, Autoconfiguration (@Conditional annotations), Embedded Server (Tomcat/Jetty), và giám sát vận hành qua Spring Boot Actuator.",
    "topics": [
      {
        "id": "JrH2hiu27PhIO1VtrArMa",
        "slug": "spring-boot-starters",
        "title": "Spring Boot Starters",
        "englishTitle": "Spring Boot Starters Ecosystem",
        "summary": "Tập hợp các bộ mô tả phụ thuộc (dependency descriptors) tiện lợi giúp nhập đầy đủ các thư viện liên quan chỉ với một dòng cấu hình trong pom.xml / build.gradle.",
        "estimatedMinutes": 15,
        "originalRoadmapMarkdown": "# Spring Boot Starters\n\nSpring Boot starters are a set of convenient dependency descriptors that you can include in your application. They provide a variety of functionality, such as security, data access, and web services, and help to minimize the amount of boilerplate code and configuration you need to write.\n\nVisit the following resources to learn more:\n\n- [@article@Intro to Spring Boot Starters](https://www.baeldung.com/spring-boot-starters)",
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
          "codeSnippet": "<dependency>\n    <groupId>org.springframework.boot</groupId>\n    <artifactId>spring-boot-starter-web</artifactId>\n</dependency>\n<dependency>\n    <groupId>org.springframework.boot</groupId>\n    <artifactId>spring-boot-starter-validation</artifactId>\n</dependency>"
        },
        "interviewQA": [
          {
            "question": "Lợi ích của việc dùng Spring Boot Starter so với khai báo từng thư viện riêng lẻ là gì?",
            "answer": "Starters loại bỏ hoàn toàn tình trạng xung đột phiên bản (Dependency Hell / Version Mismatches), tối ưu hóa cấu hình tự động tương thích và giúp file `pom.xml` gọn gàng, dễ bảo trì."
          }
        ]
      },
      {
        "id": "88-h3d7kb-VmUBsnUUXW_",
        "slug": "autoconfiguration",
        "title": "Autoconfiguration & @Conditional",
        "englishTitle": "Autoconfiguration & Conditional Annotations",
        "summary": "Cơ chế tự động dò tìm classpath và tạo các Spring Bean thích hợp mà không cần cấu hình thủ công.",
        "estimatedMinutes": 25,
        "originalRoadmapMarkdown": "# Autoconfiguration\n\nSpring Boot's Autoconfiguration is a powerful and convenient feature that makes it easy to configure beans and other components in your application based on the presence of certain dependencies and properties. It saves developer's time by reducing the need for boilerplate configuration code, and can be fine-tuned through properties and annotations, to provide a fine-grained control over the auto-configurations.\n\nVisit the following resources to learn more:\n\n- [@official@Auto-configuration using Spring Boot](https://docs.spring.io/spring-boot/docs/2.0.x/reference/html/using-boot-auto-configuration.html)",
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
          "codeSnippet": "@AutoConfiguration\npublic class MyServiceAutoConfiguration {\n\n    @Bean\n    @ConditionalOnMissingBean\n    public MyService myService() {\n        return new DefaultMyServiceImpl();\n    }\n}"
        },
        "interviewQA": [
          {
            "question": "Làm thế nào để vô hiệu hóa (disable) một tính năng Autoconfiguration cụ thể trong Spring Boot?",
            "answer": "Có thể loại bỏ bằng thuộc tính `exclude` trong annotation: `@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})` hoặc cấu hình trong `application.properties`: `spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration`."
          }
        ]
      },
      {
        "id": "ONb0VnSUMY8JBeW3G2mTp",
        "slug": "embedded-server",
        "title": "Embedded Server",
        "englishTitle": "Embedded Server",
        "summary": "Kiến thức và nguyên lý nền tảng của Embedded Server trong hệ sinh thái Spring Boot.",
        "estimatedMinutes": 20,
        "originalRoadmapMarkdown": "# Embedded Server\n\nSpring Boot's Embedded Server feature is a convenient and powerful feature that allows you to run a web server directly within your application, without the need to deploy it to a separate standalone web server. This makes it easy to develop, test, and deploy web applications, and it's also lightweight, easy to start and stop, and easy to configure.\n\nVisit the following resources to learn more:\n\n- [@official@Embedded Web Servers ‘How-to’ guides](https://docs.spring.io/spring-boot/docs/2.1.9.RELEASE/reference/html/howto-embedded-web-servers.html)\n- [@article@Embedded Servers in Spring](https://subscription.packtpub.com/book/application-development/9781789132588/3/ch03lvl1sec24/embedded-servers)\n- [@article@What is an Embedded Server? (Spring Boot)](https://www.springboottutorial.com/java-programmer-essentials-what-is-an-embedded-server)",
        "coreConcepts": [
          {
            "heading": "1. Khái niệm và Vai trò của Embedded Server",
            "points": [
              "Nắm vững mục đích và bối cảnh sử dụng của Embedded Server trong ứng dụng Spring Boot.",
              "Hiểu rõ luồng xử lý và cách cấu hình tương thích với Spring Boot 3 và Java 21."
            ]
          }
        ],
        "javaDeepDive": null,
        "interviewQA": [
          {
            "question": "Vai trò chính của Embedded Server trong Spring Boot là gì?",
            "answer": "Embedded Server đóng vai trò quan trọng trong việc thiết kế và xây dựng các thành phần của hệ thống Spring Boot chuẩn mực, giúp tối ưu hiệu năng và dễ bảo trì."
          }
        ]
      },
      {
        "id": "N7hd3d_XQtvOgnCqdCFt3",
        "slug": "actuators",
        "title": "Spring Boot Actuators & Metrics",
        "englishTitle": "Spring Boot Actuators & Production Observability",
        "summary": "Cung cấp các endpoint HTTP/JMX để giám sát trạng thái sức khỏe (Health), cấu hình, bộ nhớ, threads và metrics của ứng dụng trong môi trường Production.",
        "estimatedMinutes": 20,
        "originalRoadmapMarkdown": "# Actuators\n\nActuators are a set of built-in endpoints in Spring Boot that expose information about a running application, such as health status, metrics, environment properties, and active beans. They work as HTTP or JMX endpoints, like `/actuator/health` or `/actuator/metrics`, that can be enabled or disabled individually through configuration. Teams use actuators to monitor and manage applications in production without writing custom monitoring code.\n\nVisit the following resources to learn more:\n\n- [@official@Building a RESTful Web Service with Spring Boot Actuator](https://spring.io/guides/gs/actuator-service/)\n- [@article@What is Spring Boot Actuator](https://www.baeldung.com/spring-boot-actuators)",
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
          "codeSnippet": "management:\n  endpoints:\n    web:\n      exposure:\n        include: health, info, metrics, prometheus\n  endpoint:\n    health:\n      show-details: always"
        },
        "interviewQA": [
          {
            "question": "Tại sao không nên mở toàn bộ Actuator endpoints (`include: '*'`) ra ngoài Internet?",
            "answer": "Vì các endpoint như `/actuator/env`, `/actuator/heapdump`, `/actuator/beans` có thể làm lộ thông tin mật (API keys, database credentials) hoặc gây sập hệ thống (DoS khi dump heap memory). Cần bảo vệ qua Spring Security hoặc chỉ mở nội bộ trong mạng Private."
          }
        ]
      }
    ]
  },
  {
    "id": "module-3-web-mvc",
    "title": "3. Spring MVC & RESTful Web APIs",
    "englishTitle": "Spring MVC & Web APIs",
    "badge": "Module 3",
    "description": "Xây dựng RESTful Web API chuẩn doanh nghiệp: Luồng xử lý DispatcherServlet, Controller, Service, Repository, DTO Validation, Global Exception Handling (RFC 7807 Problem Details).",
    "topics": [
      {
        "id": "S-BbOoRD7anvoJrprjoKF",
        "slug": "spring-mvc",
        "title": "Spring MVC & DispatcherServlet",
        "englishTitle": "Spring MVC Architecture & Request Lifecycle",
        "summary": "Kiến trúc Model-View-Controller xây dựng trên nền tảng Servlet API, điều phối luồng request thông qua DispatcherServlet trung tâm.",
        "estimatedMinutes": 25,
        "originalRoadmapMarkdown": "# Spring MVC\n\nSpring MVC is a web framework built on the Servlet API that implements the Model-View-Controller design pattern to help developers build flexible and loosely coupled web applications. It provides a structured way to handle HTTP requests by using a central DispatcherServlet that routes incoming traffic to appropriate handler methods, which then process data and return a response, such as a rendered HTML view or raw JSON data.\n\nVisit the following resources to learn more:\n\n- [@article@Spring - MVC Framework](https://www.tutorialspoint.com/spring/spring_web_mvc_framework.htm)\n- [@article@Spring MVC Tutorial – Everything You Need To Know](https://www.edureka.co/blog/spring-mvc-tutorial/)",
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
          "codeSnippet": "@RestController\n@RequestMapping(\"/api/v1/users\")\n@Validated\npublic class UserController {\n    private final UserService userService;\n\n    public UserController(UserService userService) {\n        this.userService = userService;\n    }\n\n    @PostMapping\n    public ResponseEntity<UserResponseDto> createUser(@Valid @RequestBody CreateUserRequest request) {\n        UserResponseDto created = userService.create(request);\n        return ResponseEntity.status(HttpStatus.CREATED).body(created);\n    }\n}\n\n// Global Exception Handler\n@RestControllerAdvice\npublic class GlobalExceptionHandler {\n    @ExceptionHandler(ResourceNotFoundException.class)\n    public ProblemDetail handleNotFound(ResourceNotFoundException ex) {\n        ProblemDetail problem = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, ex.getMessage());\n        problem.setTitle(\"Resource Not Found\");\n        return problem;\n    }\n}"
        },
        "interviewQA": [
          {
            "question": "Sự khác biệt giữa `@Controller` và `@RestController` là gì?",
            "answer": "`@RestController` là sự kết hợp của `@Controller` và `@ResponseBody`. Với `@RestController`, mọi method mặc định trả về dữ liệu thô (JSON/XML) được tuần tự hóa qua `HttpMessageConverter` thay vì tìm kiếm template View HTML."
          }
        ]
      },
      {
        "id": "QiNWE4sMTao3cVzjt3yPp",
        "slug": "spring-mvc",
        "title": "Spring Mvc",
        "englishTitle": "Spring Mvc",
        "summary": "Kiến thức và nguyên lý nền tảng của Spring Mvc trong hệ sinh thái Spring Boot.",
        "estimatedMinutes": 20,
        "originalRoadmapMarkdown": "# Spring MVC\n\nSpring MVC is a web framework within Spring that follows the Model-View-Controller pattern to build web applications and REST APIs. A central component called `DispatcherServlet` receives incoming requests and routes them to the appropriate controller, which processes the request and returns a model and view or a JSON response. It handles common web concerns such as URL mapping, form binding, and validation, so developers can focus on writing controller and business logic.\n\nVisit the following resources to learn more:\n\n- [@official@Web MVC framework](https://docs.spring.io/spring-framework/docs/3.2.x/spring-framework-reference/html/mvc.html)\n- [@article@Spring - MVC Framework](https://www.tutorialspoint.com/spring/spring_web_mvc_framework.htm)",
        "coreConcepts": [
          {
            "heading": "1. Khái niệm và Vai trò của Spring Mvc",
            "points": [
              "Nắm vững mục đích và bối cảnh sử dụng của Spring Mvc trong ứng dụng Spring Boot.",
              "Hiểu rõ luồng xử lý và cách cấu hình tương thích với Spring Boot 3 và Java 21."
            ]
          }
        ],
        "javaDeepDive": null,
        "interviewQA": [
          {
            "question": "Vai trò chính của Spring Mvc trong Spring Boot là gì?",
            "answer": "Spring Mvc đóng vai trò quan trọng trong việc thiết kế và xây dựng các thành phần của hệ thống Spring Boot chuẩn mực, giúp tối ưu hiệu năng và dễ bảo trì."
          }
        ]
      },
      {
        "id": "_vS_zdJZegZS6MIKAFyg8",
        "slug": "architecture",
        "title": "Architecture",
        "englishTitle": "Architecture",
        "summary": "Kiến thức và nguyên lý nền tảng của Architecture trong hệ sinh thái Spring Boot.",
        "estimatedMinutes": 20,
        "originalRoadmapMarkdown": "# Architecture\n\nThe Spring MVC (Model-View-Controller) is a web application framework that is part of the Spring Framework. It is designed to make it easy to build web applications using the MVC design pattern.\n\nVisit the following resources to learn more:\n\n- [@article@Overview of Spring MVC Architecture](https://terasolunaorg.github.io/guideline/1.0.1.RELEASE/en/Overview/SpringMVCOverview.html)",
        "coreConcepts": [
          {
            "heading": "1. Khái niệm và Vai trò của Architecture",
            "points": [
              "Nắm vững mục đích và bối cảnh sử dụng của Architecture trong ứng dụng Spring Boot.",
              "Hiểu rõ luồng xử lý và cách cấu hình tương thích với Spring Boot 3 và Java 21."
            ]
          }
        ],
        "javaDeepDive": null,
        "interviewQA": [
          {
            "question": "Vai trò chính của Architecture trong Spring Boot là gì?",
            "answer": "Architecture đóng vai trò quan trọng trong việc thiết kế và xây dựng các thành phần của hệ thống Spring Boot chuẩn mực, giúp tối ưu hiệu năng và dễ bảo trì."
          }
        ]
      },
      {
        "id": "35NTx2eO1j02sjy4m6DPq",
        "slug": "servlet",
        "title": "Servlet",
        "englishTitle": "Servlet",
        "summary": "Kiến thức và nguyên lý nền tảng của Servlet trong hệ sinh thái Spring Boot.",
        "estimatedMinutes": 20,
        "originalRoadmapMarkdown": "# Servlet\n\nA servlet is a Java class that handles requests and generates responses within a web server, following the Java Servlet API. It works by receiving an HTTP request from a servlet container, such as Tomcat, processing it through a `service` method, and writing back a response. Spring MVC builds on top of servlets, using a single central servlet, `DispatcherServlet`, to route requests to application code instead of requiring developers to write servlets directly.\n\nVisit the following resources to learn more:\n\n- [@official@The DispatcherServlet](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-servlet.html)\n- [@article@DispatcherServlet and web.xml in Spring Boot](https://www.baeldung.com/spring-boot-dispatcherservlet-web-xml)",
        "coreConcepts": [
          {
            "heading": "1. Khái niệm và Vai trò của Servlet",
            "points": [
              "Nắm vững mục đích và bối cảnh sử dụng của Servlet trong ứng dụng Spring Boot.",
              "Hiểu rõ luồng xử lý và cách cấu hình tương thích với Spring Boot 3 và Java 21."
            ]
          }
        ],
        "javaDeepDive": null,
        "interviewQA": [
          {
            "question": "Vai trò chính của Servlet trong Spring Boot là gì?",
            "answer": "Servlet đóng vai trò quan trọng trong việc thiết kế và xây dựng các thành phần của hệ thống Spring Boot chuẩn mực, giúp tối ưu hiệu năng và dễ bảo trì."
          }
        ]
      },
      {
        "id": "sgA06Tu9Y4cEHtfI8CyLL",
        "slug": "components",
        "title": "Components",
        "englishTitle": "Components",
        "summary": "Kiến thức và nguyên lý nền tảng của Components trong hệ sinh thái Spring Boot.",
        "estimatedMinutes": 20,
        "originalRoadmapMarkdown": "# Components\n\nThe Spring MVC (Model-View-Controller) framework has several key components that work together to handle the requests and generate the appropriate responses in a web application. There are other supporting components that are used to manage the lifecycle of the application's objects, such as the Spring IoC container and different interceptors that provides additional functionality, such as caching and security.\n\nVisit the following resources to learn more:\n\n- [@official@Web MVC Framework](https://docs.spring.io/spring-framework/docs/3.2.x/spring-framework-reference/html/mvc.html)",
        "coreConcepts": [
          {
            "heading": "1. Khái niệm và Vai trò của Components",
            "points": [
              "Nắm vững mục đích và bối cảnh sử dụng của Components trong ứng dụng Spring Boot.",
              "Hiểu rõ luồng xử lý và cách cấu hình tương thích với Spring Boot 3 và Java 21."
            ]
          }
        ],
        "javaDeepDive": null,
        "interviewQA": [
          {
            "question": "Vai trò chính của Components trong Spring Boot là gì?",
            "answer": "Components đóng vai trò quan trọng trong việc thiết kế và xây dựng các thành phần của hệ thống Spring Boot chuẩn mực, giúp tối ưu hiệu năng và dễ bảo trì."
          }
        ]
      },
      {
        "id": "Lz0GPMiYzb30iFJdv1dL6",
        "slug": "jsp-files",
        "title": "Jsp Files",
        "englishTitle": "Jsp Files",
        "summary": "Kiến thức và nguyên lý nền tảng của Jsp Files trong hệ sinh thái Spring Boot.",
        "estimatedMinutes": 20,
        "originalRoadmapMarkdown": "# JSP Files\n\nJSP (JavaServer Pages) files are templates that mix HTML with Java code to generate dynamic web pages on the server before sending them to the browser. A JSP file is compiled into a servlet the first time it is requested, and its output is combined with data passed from a controller to render the final page. Spring MVC can use JSP as a view technology, though many modern applications favor other templating engines or return JSON instead of server-rendered pages.\n\nVisit the following resources to learn more:\n\n- [@official@Spring MVC: from JSP and Tiles to Thymeleaf](https://spring.io/blog/2012/10/30/spring-mvc-from-jsp-and-tiles-to-thymeleaf/)\n- [@article@Spring Boot With JavaServer Pages (JSP)](https://www.baeldung.com/spring-boot-jsp)",
        "coreConcepts": [
          {
            "heading": "1. Khái niệm và Vai trò của Jsp Files",
            "points": [
              "Nắm vững mục đích và bối cảnh sử dụng của Jsp Files trong ứng dụng Spring Boot.",
              "Hiểu rõ luồng xử lý và cách cấu hình tương thích với Spring Boot 3 và Java 21."
            ]
          }
        ],
        "javaDeepDive": null,
        "interviewQA": [
          {
            "question": "Vai trò chính của Jsp Files trong Spring Boot là gì?",
            "answer": "Jsp Files đóng vai trò quan trọng trong việc thiết kế và xây dựng các thành phần của hệ thống Spring Boot chuẩn mực, giúp tối ưu hiệu năng và dễ bảo trì."
          }
        ]
      }
    ]
  },
  {
    "id": "module-4-persistence",
    "title": "4. Quản trị Dữ liệu, Hibernate & Spring Data",
    "englishTitle": "Data Persistence & Transactions",
    "badge": "Module 4",
    "description": "Làm chủ tầng lưu trữ dữ liệu trong Java: Hibernate ORM, Entity Lifecycle, Quan hệ bảng (OneToMany/ManyToOne), Dirty Checking, Quản lý giao dịch (@Transactional), Spring Data JPA, JDBC & NoSQL MongoDB.",
    "topics": [
      {
        "id": "h5-HnycxfbJgwalSdXTAz",
        "slug": "hibernate",
        "title": "Hibernate",
        "englishTitle": "Hibernate",
        "summary": "Kiến thức và nguyên lý nền tảng của Hibernate trong hệ sinh thái Spring Boot.",
        "estimatedMinutes": 20,
        "originalRoadmapMarkdown": "# Hibernate\n\nHibernate is a Java framework that provides an object-relational mapping to an object-oriented model to the relational database. It means hibernate provides from Java classes to database tables and also provides data querying and retrieval facility.\n\nVisit the following resources to learn more:\n\n- [@article@Difference Between Spring vs Hibernate](https://www.educba.com/spring-vs-hibernate/)\n- [@article@Spring Hibernate Integration Example](https://www.digitalocean.com/community/tutorials/spring-hibernate-integration-example-tutorial)",
        "coreConcepts": [
          {
            "heading": "1. Khái niệm và Vai trò của Hibernate",
            "points": [
              "Nắm vững mục đích và bối cảnh sử dụng của Hibernate trong ứng dụng Spring Boot.",
              "Hiểu rõ luồng xử lý và cách cấu hình tương thích với Spring Boot 3 và Java 21."
            ]
          }
        ],
        "javaDeepDive": null,
        "interviewQA": [
          {
            "question": "Vai trò chính của Hibernate trong Spring Boot là gì?",
            "answer": "Hibernate đóng vai trò quan trọng trong việc thiết kế và xây dựng các thành phần của hệ thống Spring Boot chuẩn mực, giúp tối ưu hiệu năng và dễ bảo trì."
          }
        ]
      },
      {
        "id": "Ijmy0J3VyaeTGXtu2VkkQ",
        "slug": "entity-lifecycle",
        "title": "Entity Lifecycle",
        "englishTitle": "Entity Lifecycle",
        "summary": "Kiến thức và nguyên lý nền tảng của Entity Lifecycle trong hệ sinh thái Spring Boot.",
        "estimatedMinutes": 20,
        "originalRoadmapMarkdown": "# Entity lifecycle\n\nEntity lifecycle describes the different states an object managed by Hibernate can go through: transient, persistent, detached, and removed. A transient entity exists only in memory and is not tracked by Hibernate, while a persistent entity is attached to a session and synchronized with the database. Knowing these states helps developers understand when changes to an object are actually saved, and when it needs to be reattached or merged back into a session.\n\nVisit the following resources to learn more:\n\n- [@article@Hibernate Entity Lifecycle & and its state](https://www.baeldung.com/hibernate-entity-lifecycle)",
        "coreConcepts": [
          {
            "heading": "1. Khái niệm và Vai trò của Entity Lifecycle",
            "points": [
              "Nắm vững mục đích và bối cảnh sử dụng của Entity Lifecycle trong ứng dụng Spring Boot.",
              "Hiểu rõ luồng xử lý và cách cấu hình tương thích với Spring Boot 3 và Java 21."
            ]
          }
        ],
        "javaDeepDive": null,
        "interviewQA": [
          {
            "question": "Vai trò chính của Entity Lifecycle trong Spring Boot là gì?",
            "answer": "Entity Lifecycle đóng vai trò quan trọng trong việc thiết kế và xây dựng các thành phần của hệ thống Spring Boot chuẩn mực, giúp tối ưu hiệu năng và dễ bảo trì."
          }
        ]
      },
      {
        "id": "D4ybyh0ydvl9W2_xUcvZ_",
        "slug": "relationships",
        "title": "Relationships",
        "englishTitle": "Relationships",
        "summary": "Kiến thức và nguyên lý nền tảng của Relationships trong hệ sinh thái Spring Boot.",
        "estimatedMinutes": 20,
        "originalRoadmapMarkdown": "# Relationships\n\nUsing hibernate, if we want to have relationship between two entities, there must exist a foreign key relationship between the tables, we call it as Referential integrity. The main advantage of having relationship between objects is, we can do operation on one object, and the same operation can transfer onto the other object in the database.\n\nVisit the following resources to learn more:\n\n- [@article@Hibernate Relationships In Depth](https://www.java4s.com/hibernate/hibernate-relationships-in-depth/)\n- [@article@Guide to JPA with Hibernate - Relationship Mapping](https://stackabuse.com/a-guide-to-jpa-with-hibernate-relationship-mapping/)\n- [@article@Hibernate Mapping](https://dzone.com/articles/hibernate-mapping)",
        "coreConcepts": [
          {
            "heading": "1. Khái niệm và Vai trò của Relationships",
            "points": [
              "Nắm vững mục đích và bối cảnh sử dụng của Relationships trong ứng dụng Spring Boot.",
              "Hiểu rõ luồng xử lý và cách cấu hình tương thích với Spring Boot 3 và Java 21."
            ]
          }
        ],
        "javaDeepDive": null,
        "interviewQA": [
          {
            "question": "Vai trò chính của Relationships trong Spring Boot là gì?",
            "answer": "Relationships đóng vai trò quan trọng trong việc thiết kế và xây dựng các thành phần của hệ thống Spring Boot chuẩn mực, giúp tối ưu hiệu năng và dễ bảo trì."
          }
        ]
      },
      {
        "id": "H9Z0EvKT_148vD0mR-dUf",
        "slug": "transactions",
        "title": "Quản lý Giao dịch (@Transactional)",
        "englishTitle": "Declarative Transaction Management",
        "summary": "Cơ chế quản lý transaction tự động bằng AOP Proxy, đảm bảo tính nguyên tử (Atomicity) và toàn vẹn dữ liệu cho các thao tác ghi vào cơ sở dữ liệu.",
        "estimatedMinutes": 20,
        "originalRoadmapMarkdown": "# Transactions\n\nA transaction is a group of database operations that are executed as a single unit, so that either all of them succeed or none of them take effect. Spring manages transactions declaratively through the `@Transactional` annotation, which wraps a method in a transaction and rolls back changes if an exception occurs. This keeps data consistent even when multiple related operations, like debiting one account and crediting another, need to happen together.\n\nVisit the following resources to learn more:\n\n- [@official@Hibernate Transactions](https://docs.hibernate.org/orm/current/userguide/html_single/#transactions)\n- [@article@Hibernate Transaction Management](https://www.javaguides.net/2018/12/hibernate-transaction-management-tutorial.html)",
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
          "codeSnippet": "@Service\npublic class BankTransferService {\n\n    @Transactional(rollbackFor = Exception.class)\n    public void transferMoney(Long fromAcc, Long toAcc, BigDecimal amount) {\n        accountRepo.debit(fromAcc, amount);\n        accountRepo.credit(toAcc, amount);\n        auditRepo.save(new AuditLog(\"Transfer success\", fromAcc, toAcc, amount));\n    }\n}"
        },
        "interviewQA": [
          {
            "question": "Tại sao việc gọi một method mang `@Transactional` từ một method khác trong CÙNG MỘT CLASS lại không có tác dụng rollback?",
            "answer": "Vì Spring `@Transactional` hoạt động dựa trên cơ chế AOP Dynamic Proxy. Khi gọi method nội bộ qua con trỏ `this`, lời gọi không đi qua Proxy của Spring, do đó Transaction Interceptor không được kích hoạt. Cách khắc phục: chuyển method sang một `@Service` riêng hoặc inject chính service đó (Self-injection)."
          }
        ]
      },
      {
        "id": "pvVLbFQoT50vz_VRK4VbJ",
        "slug": "spring-data",
        "title": "Spring Data",
        "englishTitle": "Spring Data",
        "summary": "Kiến thức và nguyên lý nền tảng của Spring Data trong hệ sinh thái Spring Boot.",
        "estimatedMinutes": 20,
        "originalRoadmapMarkdown": "# Spring Data\n\nSpring Data is a collection of projects for data access in Spring-based applications. It provides a common interface for working with various types of data stores, including relational databases, NoSQL data stores, and cloud-based data services. The goal of Spring Data is to simplify data access in Spring applications by providing a consistent, high-level repository programming model across different data stores and data access technologies. This can help developers write less boilerplate code and focus on business logic, while still being able to take advantage of the full power of the underlying data store.\n\nVisit the following resources to learn more:\n\n- [@official@Spring Data](https://spring.io/projects/spring-data)\n- [@article@Spring Data – One API To Rule Them All?](https://www.infoq.com/articles/spring-data-intro/)\n- [@article@What is JPA, Spring Data and Spring Data JPA](https://www.amitph.com/jpa-and-spring-data-jpa/)",
        "coreConcepts": [
          {
            "heading": "1. Khái niệm và Vai trò của Spring Data",
            "points": [
              "Nắm vững mục đích và bối cảnh sử dụng của Spring Data trong ứng dụng Spring Boot.",
              "Hiểu rõ luồng xử lý và cách cấu hình tương thích với Spring Boot 3 và Java 21."
            ]
          }
        ],
        "javaDeepDive": null,
        "interviewQA": [
          {
            "question": "Vai trò chính của Spring Data trong Spring Boot là gì?",
            "answer": "Spring Data đóng vai trò quan trọng trong việc thiết kế và xây dựng các thành phần của hệ thống Spring Boot chuẩn mực, giúp tối ưu hiệu năng và dễ bảo trì."
          }
        ]
      },
      {
        "id": "6u08QN-pUeFm3o0h5Scfm",
        "slug": "spring-data-jpa",
        "title": "Spring Data JPA & Hibernate",
        "englishTitle": "Spring Data JPA, Repositories & Hibernate",
        "summary": "Lớp trừu tượng hóa mạnh mẽ trên nền Hibernate/JPA giúp thực hiện CRUD, phân trang, truy vấn động qua Method Name convention và JPQL/Native Query mà không cần viết boilerplate code.",
        "estimatedMinutes": 25,
        "originalRoadmapMarkdown": "# Spring Data JPA\n\nSpring Data JPA is a library that makes it easy to implement Java Persistence API (JPA) based repositories (a fancy word for \"DAO\") for Spring applications. It's an abstraction on top of JPA that allows you to use a simpler and more convenient API for performing CRUD (Create, Read, Update, Delete) operations on databases. Spring Data JPA also provides additional functionality such as pagination, dynamic query generation, and more.\n\nVisit the following resources to learn more:\n\n- [@official@Spring Data JPA](https://spring.io/projects/spring-data-jpa)\n- [@article@Introduction to Spring Data JPA](https://www.baeldung.com/the-persistence-layer-with-spring-data-jpa)",
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
          "codeSnippet": "public interface OrderRepository extends JpaRepository<Order, Long> {\n\n    // Nạp đồng thời OrderItems để tránh N+1 Query\n    @EntityGraph(attributePaths = {\"items\", \"customer\"})\n    Optional<Order> findWithItemsById(Long id);\n\n    @Query(\"SELECT o FROM Order o WHERE o.status = :status\")\n    Page<Order> findByStatusPaged(@Param(\"status\") OrderStatus status, Pageable pageable);\n}"
        },
        "interviewQA": [
          {
            "question": "Vấn đề N+1 Query trong JPA là gì và làm thế nào để giải quyết triệt để?",
            "answer": "N+1 Query xảy ra khi truy vấn 1 danh sách N bản ghi cha (1 query), sau đó vòng lặp truy cập vào quan hệ `@ManyToOne` hoặc `@OneToMany` (Lazy loading) khiến Hibernate bắn thêm N câu query phụ xuống DB. Giải quyết bằng cách: 1. Sử dụng `JOIN FETCH` trong JPQL. 2. Sử dụng `@EntityGraph`. 3. Sử dụng DTO Projection (`SELECT new com.example.OrderDto(...)`)."
          }
        ]
      },
      {
        "id": "dd1A-MyzBs_kNOtVG7f1D",
        "slug": "spring-data-jdbc",
        "title": "Spring Data Jdbc",
        "englishTitle": "Spring Data Jdbc",
        "summary": "Kiến thức và nguyên lý nền tảng của Spring Data Jdbc trong hệ sinh thái Spring Boot.",
        "estimatedMinutes": 20,
        "originalRoadmapMarkdown": "# Spring Data JDBC\n\nSpring Data JDBC is a lightweight alternative to Spring Data JPA that maps Java objects to database tables using plain JDBC instead of a full ORM like Hibernate. It follows a simpler model, where entities are loaded and saved as a whole aggregate without lazy loading or a persistence context to track changes. Developers choose it when they want more predictable SQL behavior and less complexity than a full JPA implementation offers.\n\nVisit the following resources to learn more:\n\n- [@official@Spring Data JDBC](https://spring.io/projects/spring-data-jdbc)\n- [@article@Spring Data JDBC - Reference Documentation](https://docs.spring.io/spring-data/jdbc/docs/current/reference/html/)\n- [@article@Introduction to Spring Data JDBC](https://www.baeldung.com/spring-data-jdbc-intro)",
        "coreConcepts": [
          {
            "heading": "1. Khái niệm và Vai trò của Spring Data Jdbc",
            "points": [
              "Nắm vững mục đích và bối cảnh sử dụng của Spring Data Jdbc trong ứng dụng Spring Boot.",
              "Hiểu rõ luồng xử lý và cách cấu hình tương thích với Spring Boot 3 và Java 21."
            ]
          }
        ],
        "javaDeepDive": null,
        "interviewQA": [
          {
            "question": "Vai trò chính của Spring Data Jdbc trong Spring Boot là gì?",
            "answer": "Spring Data Jdbc đóng vai trò quan trọng trong việc thiết kế và xây dựng các thành phần của hệ thống Spring Boot chuẩn mực, giúp tối ưu hiệu năng và dễ bảo trì."
          }
        ]
      },
      {
        "id": "fy-TphbqkLpR1zvFcr7dg",
        "slug": "spring-data-mongodb",
        "title": "Spring Data Mongodb",
        "englishTitle": "Spring Data Mongodb",
        "summary": "Kiến thức và nguyên lý nền tảng của Spring Data Mongodb trong hệ sinh thái Spring Boot.",
        "estimatedMinutes": 20,
        "originalRoadmapMarkdown": "# Spring Data Mongodb\n\nSpring Data MongoDB is a module that provides an abstraction for working with MongoDB, a document-oriented NoSQL database, using the same repository pattern as other Spring Data modules. It maps Java objects to MongoDB documents and lets developers query data using repository method names or the `MongoTemplate` class for more complex operations. Applications use it to store and retrieve flexible, schema-less data without writing raw MongoDB driver code.\n\nVisit the following resources to learn more:\n\n- [@roadmap@Visit the Dedicated MongoDB Roadmap](https://roadmap.sh/mongodb)\n- [@official@Spring Data MongoDB](https://spring.io/projects/spring-data-mongodb)\n- [@official@Spring Boot Integration with MongoDB Tutorial](https://www.mongodb.com/compatibility/spring-boot)\n- [@article@Introduction to Spring Data MongoDB](https://www.baeldung.com/spring-data-mongodb-tutorial)",
        "coreConcepts": [
          {
            "heading": "1. Khái niệm và Vai trò của Spring Data Mongodb",
            "points": [
              "Nắm vững mục đích và bối cảnh sử dụng của Spring Data Mongodb trong ứng dụng Spring Boot.",
              "Hiểu rõ luồng xử lý và cách cấu hình tương thích với Spring Boot 3 và Java 21."
            ]
          }
        ],
        "javaDeepDive": null,
        "interviewQA": [
          {
            "question": "Vai trò chính của Spring Data Mongodb trong Spring Boot là gì?",
            "answer": "Spring Data Mongodb đóng vai trò quan trọng trong việc thiết kế và xây dựng các thành phần của hệ thống Spring Boot chuẩn mực, giúp tối ưu hiệu năng và dễ bảo trì."
          }
        ]
      }
    ]
  },
  {
    "id": "module-5-security",
    "title": "5. Bảo mật với Spring Security 6 & OAuth2",
    "englishTitle": "Spring Security & Access Control",
    "badge": "Module 5",
    "description": "Bảo vệ ứng dụng web và API theo chuẩn Spring Security 6 hiện đại: SecurityFilterChain (Lambda DSL), Xác thực Authentication, Phân quyền Authorization, Stateless JWT, OAuth2 Resource Server.",
    "topics": [
      {
        "id": "KaUdyVWEiZa6lUDRBlOKt",
        "slug": "spring-security",
        "title": "Spring Security 6 Architecture & JWT",
        "englishTitle": "Spring Security 6 & Stateless JWT Architecture",
        "summary": "Kiến trúc bảo mật hiện đại với SecurityFilterChain, quản lý xác thực phân quyền không trạng thái bằng JSON Web Token (JWT).",
        "estimatedMinutes": 30,
        "originalRoadmapMarkdown": "# Spring security\n\nSpring Security is a framework for securing Java-based applications. It is a powerful and highly customizable authentication and access-control framework that can be easily integrated with a wide variety of applications, including web applications and RESTful web services. Spring Security provides a comprehensive security solution for both authentication and authorization, and it can be used to secure applications at both the web and method level.\n\nVisit the following resources to learn more:\n\n- [@official@Spring Security](https://spring.io/projects/spring-security)\n- [@article@Spring Security: Authentication and Authorization In-Depth](https://www.marcobehler.com/guides/spring-security)",
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
          "codeSnippet": "@Configuration\n@EnableWebSecurity\n@EnableMethodSecurity\npublic class SecurityConfig {\n\n    @Bean\n    public SecurityFilterChain filterChain(HttpSecurity http, JwtAuthFilter jwtAuthFilter) throws Exception {\n        return http\n            .csrf(AbstractHttpConfigurer::disable)\n            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))\n            .authorizeHttpRequests(auth -> auth\n                .requestMatchers(\"/api/v1/auth/**\", \"/actuator/health\").permitAll()\n                .requestMatchers(\"/api/v1/admin/**\").hasRole(\"ADMIN\")\n                .anyRequest().authenticated()\n            )\n            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)\n            .build();\n    }\n}"
        },
        "interviewQA": [
          {
            "question": "Tại sao REST API sử dụng JWT lại nên tắt CSRF (`csrf.disable()`)?",
            "answer": "CSRF (Cross-Site Request Forgery) tấn công dựa trên cơ chế trình duyệt tự động đính kèm Cookie/Session khi gửi request xuyên domain. Với REST API không trạng thái (Stateless), JWT được lưu trữ phía client và gửi thủ công trong HTTP Header `Authorization: Bearer <token>`, trình duyệt không thể tự đính kèm header này nên nguy cơ tấn công CSRF không còn tồn tại."
          }
        ]
      },
      {
        "id": "ssdk2iAt4avhc8B5tnIzQ",
        "slug": "authentication",
        "title": "Authentication",
        "englishTitle": "Authentication",
        "summary": "Kiến thức và nguyên lý nền tảng của Authentication trong hệ sinh thái Spring Boot.",
        "estimatedMinutes": 20,
        "originalRoadmapMarkdown": "# Authentication\n\nSpring Security is a framework for securing Java-based applications. One of its core features is authentication, which is the process of verifying that a user is who they claim to be. Spring Security provides a wide range of options for implementing authentication, including support for traditional username/password-based authentication as well as more modern alternatives such as OAuth and JSON Web Tokens (JWT).\n\nVisit the following resources to learn more:\n\n- [@official@Spring Authentication](https://docs.spring.io/spring-security/reference/features/authentication/index.html)\n- [@official@Spring Security Authentication](https://spring.io/projects/spring-security)\n- [@article@Spring Security Basic Authentication](https://www.baeldung.com/spring-security-basic-authentication)",
        "coreConcepts": [
          {
            "heading": "1. Khái niệm và Vai trò của Authentication",
            "points": [
              "Nắm vững mục đích và bối cảnh sử dụng của Authentication trong ứng dụng Spring Boot.",
              "Hiểu rõ luồng xử lý và cách cấu hình tương thích với Spring Boot 3 và Java 21."
            ]
          }
        ],
        "javaDeepDive": null,
        "interviewQA": [
          {
            "question": "Vai trò chính của Authentication trong Spring Boot là gì?",
            "answer": "Authentication đóng vai trò quan trọng trong việc thiết kế và xây dựng các thành phần của hệ thống Spring Boot chuẩn mực, giúp tối ưu hiệu năng và dễ bảo trì."
          }
        ]
      },
      {
        "id": "c7w7Z3Coa81FKa_yAKTse",
        "slug": "authorization",
        "title": "Authorization",
        "englishTitle": "Authorization",
        "summary": "Kiến thức và nguyên lý nền tảng của Authorization trong hệ sinh thái Spring Boot.",
        "estimatedMinutes": 20,
        "originalRoadmapMarkdown": "# Authorization\n\nSpring Security supports a variety of authentication mechanisms, such as username and password authentication, OAuth2, and more. Once a user is authenticated, Spring Security can then be used to authorize that user's access to specific resources or functionality. There are several annotations that can be used to control access to specific methods or classes.\n\nVisit the following resources to learn more:\n\n- [@official@Spring Authorization](https://docs.spring.io/spring-security/reference/servlet/authorization/index.html)\n- [@article@Advanced authorization in Spring](https://docs.spring.io/spring-security/site/docs/5.2.11.RELEASE/reference/html/authorization.html)\n- [@article@Spring Security: Authentication and Authorization In-Depth](https://www.marcobehler.com/guides/spring-security)",
        "coreConcepts": [
          {
            "heading": "1. Khái niệm và Vai trò của Authorization",
            "points": [
              "Nắm vững mục đích và bối cảnh sử dụng của Authorization trong ứng dụng Spring Boot.",
              "Hiểu rõ luồng xử lý và cách cấu hình tương thích với Spring Boot 3 và Java 21."
            ]
          }
        ],
        "javaDeepDive": null,
        "interviewQA": [
          {
            "question": "Vai trò chính của Authorization trong Spring Boot là gì?",
            "answer": "Authorization đóng vai trò quan trọng trong việc thiết kế và xây dựng các thành phần của hệ thống Spring Boot chuẩn mực, giúp tối ưu hiệu năng và dễ bảo trì."
          }
        ]
      },
      {
        "id": "1My7mbdwAbRcJoiA50pWW",
        "slug": "jwt-authentication",
        "title": "Jwt Authentication",
        "englishTitle": "Jwt Authentication",
        "summary": "Kiến thức và nguyên lý nền tảng của Jwt Authentication trong hệ sinh thái Spring Boot.",
        "estimatedMinutes": 20,
        "originalRoadmapMarkdown": "# JWT Authentication\n\nSpring Security can be used to implement JWT Authentication and Authorization to your APIs. The library provides a JWT-based authentication filter that you can add to your API endpoints. The filter will check the JWT that is included in the request header, and if it is valid, it will set the authentication information in the security context. You can then use the security context to perform authorization checks on the API endpoints.\n\nVisit the following resources to learn more:\n\n- [@article@JWT Token Authentication in Spring](https://springframework.guru/jwt-authentication-in-spring-microservices-jwt-token/)\n- [@article@Spring Security with JWT for REST API](https://www.toptal.com/spring/spring-security-tutorial)\n- [@article@Spring Security - JWT](https://www.tutorialspoint.com/spring_security/spring_security_with_jwt.htm)",
        "coreConcepts": [
          {
            "heading": "1. Khái niệm và Vai trò của Jwt Authentication",
            "points": [
              "Nắm vững mục đích và bối cảnh sử dụng của Jwt Authentication trong ứng dụng Spring Boot.",
              "Hiểu rõ luồng xử lý và cách cấu hình tương thích với Spring Boot 3 và Java 21."
            ]
          }
        ],
        "javaDeepDive": null,
        "interviewQA": [
          {
            "question": "Vai trò chính của Jwt Authentication trong Spring Boot là gì?",
            "answer": "Jwt Authentication đóng vai trò quan trọng trong việc thiết kế và xây dựng các thành phần của hệ thống Spring Boot chuẩn mực, giúp tối ưu hiệu năng và dễ bảo trì."
          }
        ]
      },
      {
        "id": "p7t3RlIIm9U08GFC6azff",
        "slug": "oauth2",
        "title": "Oauth2",
        "englishTitle": "Oauth2",
        "summary": "Kiến thức và nguyên lý nền tảng của Oauth2 trong hệ sinh thái Spring Boot.",
        "estimatedMinutes": 20,
        "originalRoadmapMarkdown": "# OAuth2\n\nSpring Security OAuth2 library provides support for both the authorization code grant type (for web apps) and the implicit grant type (for single-page apps). You can also use Spring Security to protect your resources and to configure your application as an OAuth2 resource server. The OAuth2 authentication process can be complex and time-consuming, but the Spring Security OAuth2 library makes it easy to get started by providing a set of convenient configuration classes and annotations.\n\nVisit the following resources to learn more:\n\n- [@course@Securing a REST API with OAuth 2.0](https://spring.academy/courses/spring-academy-secure-rest-api-oauth2)\n- [@article@OAuth 2 using Spring Boot](https://medium.com/@bubu.tripathy/oauth-2-using-spring-boot-99c17292f228)\n- [@article@Spring Boot - OAuth2 with JWT](https://www.tutorialspoint.com/spring_boot/spring_boot_oauth2_with_jwt.htm)\n- [@article@Spring Security](https://www.tutorialspoint.com/spring_security/spring_security_with_oauth2.htm)\n- [@video@OAuth2 Login Made Easy in Java: A Spring Boot & Spring Security Walkthrough](https://www.youtube.com/watch?v=us0VjFiHogo)",
        "coreConcepts": [
          {
            "heading": "1. Khái niệm và Vai trò của Oauth2",
            "points": [
              "Nắm vững mục đích và bối cảnh sử dụng của Oauth2 trong ứng dụng Spring Boot.",
              "Hiểu rõ luồng xử lý và cách cấu hình tương thích với Spring Boot 3 và Java 21."
            ]
          }
        ],
        "javaDeepDive": null,
        "interviewQA": [
          {
            "question": "Vai trò chính của Oauth2 trong Spring Boot là gì?",
            "answer": "Oauth2 đóng vai trò quan trọng trong việc thiết kế và xây dựng các thành phần của hệ thống Spring Boot chuẩn mực, giúp tối ưu hiệu năng và dễ bảo trì."
          }
        ]
      }
    ]
  },
  {
    "id": "module-6-testing-microservices",
    "title": "6. Kiểm thử & Kiến trúc Microservices",
    "englishTitle": "Testing & Cloud Microservices",
    "badge": "Module 6",
    "description": "Chiến lược kiểm thử toàn diện (Unit Test, MockMvc, DataJpaTest, @SpringBootTest) và kiến trúc Microservices điện toán đám mây (Spring Cloud Gateway, Cloud Config, Circuit Breaker Resilience4j, OpenFeign, Micrometer Tracing).",
    "topics": [
      {
        "id": "7Qqrh_Rz_7uAD49g9sDzi",
        "slug": "testing",
        "title": "Kiểm thử với Spring Boot Test & MockMvc",
        "englishTitle": "Testing: Unit, Slice & Integration Testing",
        "summary": "Chiến lược kiểm thử phần mềm đa tầng: Unit Test nhanh với Mockito, Slice Test với `@WebMvcTest` và Integration Test toàn diện với `@SpringBootTest`.",
        "estimatedMinutes": 25,
        "originalRoadmapMarkdown": "# Testing\n\nSpring provides a set of testing utilities that make it easy to test the various components of a Spring application, including controllers, services, repositories, and other components. It has a rich set of testing annotations, utility classes and other features to aid in unit testing, integration testing and more.\n\nVisit the following resources to learn more:\n\n- [@article@Complete Guide To Spring Testing](https://www.lambdatest.com/blog/spring-testing/)",
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
          "codeSnippet": "@WebMvcTest(UserController.class)\npublic class UserControllerTest {\n\n    @Autowired\n    private MockMvc mockMvc;\n\n    @MockBean\n    private UserService userService;\n\n    @Autowired\n    private ObjectMapper objectMapper;\n\n    @Test\n    void shouldReturn200WhenUserExists() throws Exception {\n        UserDto mockUser = new UserDto(1L, \"Alice\", \"alice@example.com\");\n        Mockito.when(userService.findById(1L)).thenReturn(mockUser);\n\n        mockMvc.perform(get(\"/api/v1/users/1\"))\n               .andExpect(status().isOk())\n               .andExpect(jsonPath(\"$.name\").value(\"Alice\"))\n               .andExpect(jsonPath(\"$.email\").value(\"alice@example.com\"));\n    }\n}"
        },
        "interviewQA": [
          {
            "question": "Sự khác biệt giữa `@Mock` và `@MockBean` là gì?",
            "answer": "`@Mock` là annotation của thư viện Mockito thuần túy, tạo ra mock object mà không can thiệp vào Spring Context (dùng cho Unit Test siêu tốc). `@MockBean` là annotation của Spring Test, nó tạo mock object và ĐẶT VÀO trong Spring ApplicationContext để thay thế Bean thật tương ứng (dùng cho Slice & Integration Test)."
          }
        ]
      },
      {
        "id": "5d1BERqTKNJMKiBcqa8Ie",
        "slug": "mock-mvc",
        "title": "Mock Mvc",
        "englishTitle": "Mock Mvc",
        "summary": "Kiến thức và nguyên lý nền tảng của Mock Mvc trong hệ sinh thái Spring Boot.",
        "estimatedMinutes": 20,
        "originalRoadmapMarkdown": "# Mock MVC\n\nSpring's MockMvc is a class that allows you to test Spring MVC controllers without the need for an actual web server. It is part of the Spring Test module, which provides a set of testing utilities for Spring applications.\n\nVisit the following resources to learn more:\n\n- [@article@Spring MockMVC tutorial](https://zetcode.com/spring/mockmvc/)\n- [@article@Spring Boot MockMVC Example](https://howtodoinjava.com/spring-boot2/testing/spring-boot-mockmvc-example/)\n- [@article@Integration Testing in Spring](https://baeldung.com/integration-testing-in-spring)",
        "coreConcepts": [
          {
            "heading": "1. Khái niệm và Vai trò của Mock Mvc",
            "points": [
              "Nắm vững mục đích và bối cảnh sử dụng của Mock Mvc trong ứng dụng Spring Boot.",
              "Hiểu rõ luồng xử lý và cách cấu hình tương thích với Spring Boot 3 và Java 21."
            ]
          }
        ],
        "javaDeepDive": null,
        "interviewQA": [
          {
            "question": "Vai trò chính của Mock Mvc trong Spring Boot là gì?",
            "answer": "Mock Mvc đóng vai trò quan trọng trong việc thiết kế và xây dựng các thành phần của hệ thống Spring Boot chuẩn mực, giúp tối ưu hiệu năng và dễ bảo trì."
          }
        ]
      },
      {
        "id": "Nhx2QiSD_4pVWD17lsCbu",
        "slug": "jpa-test",
        "title": "Jpa Test",
        "englishTitle": "Jpa Test",
        "summary": "Kiến thức và nguyên lý nền tảng của Jpa Test trong hệ sinh thái Spring Boot.",
        "estimatedMinutes": 20,
        "originalRoadmapMarkdown": "# JPA Test\n\nSpring JPA (Java Persistence API) is a library that makes it easy to work with databases and other data stores in a Spring application. Spring JPA uses the Java Persistence API (JPA) to interact with databases and provides an abstraction layer to work with different data stores.\n\nVisit the following resources to learn more:\n\n- [@article@Testing JPA Queries with Spring Boot and @DataJpaTest](https://reflectoring.io/spring-boot-data-jpa-test/)\n- [@article@@DataJpaTest example for Spring Data Repository Unit Test](https://www.bezkoder.com/spring-boot-unit-test-jpa-repo-datajpatest/)\n- [@article@Testing in Spring Boot](https://www.baeldung.com/spring-boot-testing)",
        "coreConcepts": [
          {
            "heading": "1. Khái niệm và Vai trò của Jpa Test",
            "points": [
              "Nắm vững mục đích và bối cảnh sử dụng của Jpa Test trong ứng dụng Spring Boot.",
              "Hiểu rõ luồng xử lý và cách cấu hình tương thích với Spring Boot 3 và Java 21."
            ]
          }
        ],
        "javaDeepDive": null,
        "interviewQA": [
          {
            "question": "Vai trò chính của Jpa Test trong Spring Boot là gì?",
            "answer": "Jpa Test đóng vai trò quan trọng trong việc thiết kế và xây dựng các thành phần của hệ thống Spring Boot chuẩn mực, giúp tối ưu hiệu năng và dễ bảo trì."
          }
        ]
      },
      {
        "id": "p91CaVPh5GMzFU0yEU_hl",
        "slug": "springboottest-annotation",
        "title": "Springboottest Annotation",
        "englishTitle": "Springboottest Annotation",
        "summary": "Kiến thức và nguyên lý nền tảng của Springboottest Annotation trong hệ sinh thái Spring Boot.",
        "estimatedMinutes": 20,
        "originalRoadmapMarkdown": "# @SpringBootTest annotation\n\n`@SpringBootTest` This annotation is used to create a fully-configured instance of the Spring ApplicationContext for testing. It can be used to test the application's components, including controllers, services, and repositories, in a real application environment.\n\nVisit the following resources to learn more:\n\n- [@official@Annotation Interface SpringBootTest](https://docs.spring.io/spring-boot/docs/current/api/org/springframework/boot/test/context/SpringBootTest.html)\n- [@article@Testing with Spring Boot and @SpringBootTest](https://reflectoring.io/spring-boot-test/)\n- [@article@Testing in Spring Boot](https://www.baeldung.com/spring-boot-testing)",
        "coreConcepts": [
          {
            "heading": "1. Khái niệm và Vai trò của Springboottest Annotation",
            "points": [
              "Nắm vững mục đích và bối cảnh sử dụng của Springboottest Annotation trong ứng dụng Spring Boot.",
              "Hiểu rõ luồng xử lý và cách cấu hình tương thích với Spring Boot 3 và Java 21."
            ]
          }
        ],
        "javaDeepDive": null,
        "interviewQA": [
          {
            "question": "Vai trò chính của Springboottest Annotation trong Spring Boot là gì?",
            "answer": "Springboottest Annotation đóng vai trò quan trọng trong việc thiết kế và xây dựng các thành phần của hệ thống Spring Boot chuẩn mực, giúp tối ưu hiệu năng và dễ bảo trì."
          }
        ]
      },
      {
        "id": "i77NTa0hpGGBjmql9u_CT",
        "slug": "mockbean-annotation",
        "title": "Mockbean Annotation",
        "englishTitle": "Mockbean Annotation",
        "summary": "Kiến thức và nguyên lý nền tảng của Mockbean Annotation trong hệ sinh thái Spring Boot.",
        "estimatedMinutes": 20,
        "originalRoadmapMarkdown": "# @MockBean Annotation\n\n`MockBean` is a Spring annotation that can be used to create a mock implementation of a bean in the Spring application context. When a test is annotated with MockBean, Spring creates a mock implementation of the specified bean and adds it to the application context. The mock bean can then be used to replace the real bean during testing.\n\nVisit the following resources to learn more:\n\n- [@official@Annotation Interface MockBean](https://docs.spring.io/spring-boot/docs/current/api/org/springframework/boot/test/mock/mockito/MockBean.html)\n- [@article@Mockito.mock() vs @Mock vs @MockBean](https://www.baeldung.com/java-spring-mockito-mock-mockbean)\n- [@article@Spring Boot @MockBean Example](https://howtodoinjava.com/spring-boot2/testing/spring-mockbean-annotation/)",
        "coreConcepts": [
          {
            "heading": "1. Khái niệm và Vai trò của Mockbean Annotation",
            "points": [
              "Nắm vững mục đích và bối cảnh sử dụng của Mockbean Annotation trong ứng dụng Spring Boot.",
              "Hiểu rõ luồng xử lý và cách cấu hình tương thích với Spring Boot 3 và Java 21."
            ]
          }
        ],
        "javaDeepDive": null,
        "interviewQA": [
          {
            "question": "Vai trò chính của Mockbean Annotation trong Spring Boot là gì?",
            "answer": "Mockbean Annotation đóng vai trò quan trọng trong việc thiết kế và xây dựng các thành phần của hệ thống Spring Boot chuẩn mực, giúp tối ưu hiệu năng và dễ bảo trì."
          }
        ]
      },
      {
        "id": "jU_KHoPUSU_HoIKk0ZpRF",
        "slug": "microservices",
        "title": "Microservices",
        "englishTitle": "Microservices",
        "summary": "Kiến thức và nguyên lý nền tảng của Microservices trong hệ sinh thái Spring Boot.",
        "estimatedMinutes": 20,
        "originalRoadmapMarkdown": "# Microservices\n\nSpring Microservices is a framework that makes it easier to build and manage microservices-based applications using the Spring Framework. Microservices is an architectural style in which a large application is built as a collection of small, independently deployable services. Each service has a narrowly defined responsibility and communicates with other services through APIs.\n\nVisit the following resources to learn more:\n\n- [@official@Microservices with Spring](https://spring.io/microservices)\n- [@article@Microservices with Spring Boot](https://medium.com/omarelgabrys-blog/microservices-with-spring-boot-intro-to-microservices-part-1-c0d24cd422c3)",
        "coreConcepts": [
          {
            "heading": "1. Khái niệm và Vai trò của Microservices",
            "points": [
              "Nắm vững mục đích và bối cảnh sử dụng của Microservices trong ứng dụng Spring Boot.",
              "Hiểu rõ luồng xử lý và cách cấu hình tương thích với Spring Boot 3 và Java 21."
            ]
          }
        ],
        "javaDeepDive": null,
        "interviewQA": [
          {
            "question": "Vai trò chính của Microservices trong Spring Boot là gì?",
            "answer": "Microservices đóng vai trò quan trọng trong việc thiết kế và xây dựng các thành phần của hệ thống Spring Boot chuẩn mực, giúp tối ưu hiệu năng và dễ bảo trì."
          }
        ]
      },
      {
        "id": "VWNDYSw83Vzi2UPQprJ5z",
        "slug": "spring-cloud",
        "title": "Spring Cloud",
        "englishTitle": "Spring Cloud",
        "summary": "Kiến thức và nguyên lý nền tảng của Spring Cloud trong hệ sinh thái Spring Boot.",
        "estimatedMinutes": 20,
        "originalRoadmapMarkdown": "# Spring Cloud\n\nSpring Cloud is a collection of libraries and tools for building cloud-native applications using the Spring Framework. It provides a set of abstractions and implementations for common patterns and best practices used in cloud-based applications, such as service discovery, configuration management, and circuit breaker patterns, among others.\n\nVisit the following resources to learn more:\n\n- [@official@Spring Cloud](https://spring.io/projects/spring-cloud)\n- [@article@Spring Cloud – Bootstrapping](https://www.baeldung.com/spring-cloud-bootstrapping)",
        "coreConcepts": [
          {
            "heading": "1. Khái niệm và Vai trò của Spring Cloud",
            "points": [
              "Nắm vững mục đích và bối cảnh sử dụng của Spring Cloud trong ứng dụng Spring Boot.",
              "Hiểu rõ luồng xử lý và cách cấu hình tương thích với Spring Boot 3 và Java 21."
            ]
          }
        ],
        "javaDeepDive": null,
        "interviewQA": [
          {
            "question": "Vai trò chính của Spring Cloud trong Spring Boot là gì?",
            "answer": "Spring Cloud đóng vai trò quan trọng trong việc thiết kế và xây dựng các thành phần của hệ thống Spring Boot chuẩn mực, giúp tối ưu hiệu năng và dễ bảo trì."
          }
        ]
      },
      {
        "id": "f-i0NX2KOzCh3JwkaSPFo",
        "slug": "spring-cloud-gateway",
        "title": "Spring Cloud Gateway & Resilience4j",
        "englishTitle": "API Gateway & Circuit Breaker Pattern",
        "summary": "Định tuyến lưu lượng thông minh, rate limiting và bảo vệ hệ thống phân tán trước sự cố sập dây chuyền (Cascading Failures) bằng Circuit Breaker.",
        "estimatedMinutes": 25,
        "originalRoadmapMarkdown": "# Spring Cloud Gateway\n\nSpring Cloud Gateway is a Spring Framework library for building API gateways. An API gateway is a service that acts as an intermediary between an application and a set of microservices. The API gateway is responsible for request routing, composition, and protocol translation, among other things. It can also perform tasks such as authentication, rate limiting, and caching.\n\nVisit the following resources to learn more:\n\n- [@official@Spring Cloud Gateway](https://spring.io/projects/spring-cloud-gateway)\n- [@article@What is Spring Cloud Gateway?](https://tanzu.vmware.com/developer/guides/scg-what-is/)\n- [@article@Exploring the New Spring Cloud Gateway](https://www.baeldung.com/spring-cloud-gateway)",
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
          "codeSnippet": "@Service\n@Slf4j\npublic class OrderServiceClient {\n\n    @CircuitBreaker(name = \"paymentService\", fallbackMethod = \"paymentFallback\")\n    public PaymentResponse callPaymentService(PaymentRequest request) {\n        // Gọi HTTP sang Payment Service\n        return restTemplate.postForObject(\"http://payment-service/api/pay\", request, PaymentResponse.class);\n    }\n\n    // Hàm fallback dự phòng khi Payment Service bị sập hoặc timeout\n    public PaymentResponse paymentFallback(PaymentRequest request, Throwable t) {\n        log.warn(\"Payment Service không khả dụng, kích hoạt fallback: {}\", t.getMessage());\n        return new PaymentResponse(\"PENDING_PAYMENT_RETRY\", \"Hệ thống thanh toán đang bận, sẽ xử lý lại sau.\");\n    }\n}"
        },
        "interviewQA": [
          {
            "question": "Tại sao Circuit Breaker lại quan trọng trong kiến trúc Microservices?",
            "answer": "Khi một downstream service bị quá tải hoặc phản hồi chậm, các upstream services gọi đến sẽ bị nghẽn toàn bộ Thread Pool (Thread Starvation), dẫn đến sập toàn bộ hệ thống (Cascading Failure). Circuit Breaker ngắt mạch sớm (Fail-fast) và kích hoạt Fallback để bảo vệ toàn bộ kiến trúc luôn ổn định."
          }
        ]
      },
      {
        "id": "9hG3CB8r41bUb_s8-0u73",
        "slug": "cloud-config",
        "title": "Cloud Config",
        "englishTitle": "Cloud Config",
        "summary": "Kiến thức và nguyên lý nền tảng của Cloud Config trong hệ sinh thái Spring Boot.",
        "estimatedMinutes": 20,
        "originalRoadmapMarkdown": "# Cloud Config\n\nSpring Cloud Config is a library for managing configuration properties for distributed applications. It allows developers to externalize configuration properties for an application, so that they can be easily changed without modifying the application's code. It also provides a centralized server for storing and managing configuration properties for multiple applications, making it easy to update and rollback configurations across different environments.\n\nVisit the following resources to learn more:\n\n- [@official@Spring Cloud Config](https://spring.io/projects/spring-cloud-config)\n- [@article@Quick Intro to Spring Cloud Configuration](https://www.baeldung.com/spring-cloud-configuration)\n- [@article@Spring Boot - Cloud Configuration Server](https://www.tutorialspoint.com/spring_boot/spring_boot_cloud_configuration_server.htm)",
        "coreConcepts": [
          {
            "heading": "1. Khái niệm và Vai trò của Cloud Config",
            "points": [
              "Nắm vững mục đích và bối cảnh sử dụng của Cloud Config trong ứng dụng Spring Boot.",
              "Hiểu rõ luồng xử lý và cách cấu hình tương thích với Spring Boot 3 và Java 21."
            ]
          }
        ],
        "javaDeepDive": null,
        "interviewQA": [
          {
            "question": "Vai trò chính của Cloud Config trong Spring Boot là gì?",
            "answer": "Cloud Config đóng vai trò quan trọng trong việc thiết kế và xây dựng các thành phần của hệ thống Spring Boot chuẩn mực, giúp tối ưu hiệu năng và dễ bảo trì."
          }
        ]
      },
      {
        "id": "kqpSlO--X9-xYxfq1KFVe",
        "slug": "spring-cloud-circuit-breaker",
        "title": "Spring Cloud Circuit Breaker",
        "englishTitle": "Spring Cloud Circuit Breaker",
        "summary": "Kiến thức và nguyên lý nền tảng của Spring Cloud Circuit Breaker trong hệ sinh thái Spring Boot.",
        "estimatedMinutes": 20,
        "originalRoadmapMarkdown": "# Circuit Breaker\n\nSpring Cloud Circuit Breaker is a library for managing the fault tolerance of microservices-based applications using the Circuit Breaker pattern. The Circuit Breaker pattern is a design pattern that helps to prevent cascading failures and improve the resilience of distributed systems. It does this by introducing a \"circuit breaker\" proxy in front of a service that can detect when the service is unresponsive or has failed, and stop routing traffic to it temporarily, in order to allow the service to recover.\n\nVisit the following resources to learn more:\n\n- [@official@Spring Cloud Circuit Breaker](https://spring.io/projects/spring-cloud-circuitbreaker)\n- [@article@Quick Guide to Spring Cloud Circuit Breaker](https://www.baeldung.com/spring-cloud-circuit-breaker)\n- [@article@Spring Cloud - Circuit Breaker using Hystrix](https://www.tutorialspoint.com/spring_cloud/spring_cloud_circuit_breaker_using_hystrix.htm)",
        "coreConcepts": [
          {
            "heading": "1. Khái niệm và Vai trò của Spring Cloud Circuit Breaker",
            "points": [
              "Nắm vững mục đích và bối cảnh sử dụng của Spring Cloud Circuit Breaker trong ứng dụng Spring Boot.",
              "Hiểu rõ luồng xử lý và cách cấu hình tương thích với Spring Boot 3 và Java 21."
            ]
          }
        ],
        "javaDeepDive": null,
        "interviewQA": [
          {
            "question": "Vai trò chính của Spring Cloud Circuit Breaker trong Spring Boot là gì?",
            "answer": "Spring Cloud Circuit Breaker đóng vai trò quan trọng trong việc thiết kế và xây dựng các thành phần của hệ thống Spring Boot chuẩn mực, giúp tối ưu hiệu năng và dễ bảo trì."
          }
        ]
      },
      {
        "id": "EKSXTMSN2xdaleJ4wOV1A",
        "slug": "spring-cloud-open-feign",
        "title": "Spring Cloud Open Feign",
        "englishTitle": "Spring Cloud Open Feign",
        "summary": "Kiến thức và nguyên lý nền tảng của Spring Cloud Open Feign trong hệ sinh thái Spring Boot.",
        "estimatedMinutes": 20,
        "originalRoadmapMarkdown": "# Spring Cloud OpenFeign\n\nSpring Cloud OpenFeign is a library for creating declarative REST clients in Spring applications. It allows developers to easily make HTTP requests to other microservices or remote services, without having to manually write the low-level code to handle the requests and responses. OpenFeign is built on top of the OpenFeign declarative HTTP client, which is a simple, lightweight library for creating HTTP clients in Java.\n\nVisit the following resources to learn more:\n\n- [@official@Spring Cloud OpenFeign](https://spring.io/projects/spring-cloud-openfeign)\n- [@article@Introduction to Spring Cloud OpenFeign](https://www.baeldung.com/spring-cloud-openfeign)\n- [@article@Simple Implementation of Spring Cloud OpenFeign](https://medium.com/javarevisited/simple-implementation-of-spring-cloud-openfeign-7f022630d01d)",
        "coreConcepts": [
          {
            "heading": "1. Khái niệm và Vai trò của Spring Cloud Open Feign",
            "points": [
              "Nắm vững mục đích và bối cảnh sử dụng của Spring Cloud Open Feign trong ứng dụng Spring Boot.",
              "Hiểu rõ luồng xử lý và cách cấu hình tương thích với Spring Boot 3 và Java 21."
            ]
          }
        ],
        "javaDeepDive": null,
        "interviewQA": [
          {
            "question": "Vai trò chính của Spring Cloud Open Feign trong Spring Boot là gì?",
            "answer": "Spring Cloud Open Feign đóng vai trò quan trọng trong việc thiết kế và xây dựng các thành phần của hệ thống Spring Boot chuẩn mực, giúp tối ưu hiệu năng và dễ bảo trì."
          }
        ]
      },
      {
        "id": "6sLE6gb5Y477SmO2GhQIG",
        "slug": "eureka",
        "title": "Eureka",
        "englishTitle": "Eureka",
        "summary": "Kiến thức và nguyên lý nền tảng của Eureka trong hệ sinh thái Spring Boot.",
        "estimatedMinutes": 20,
        "originalRoadmapMarkdown": "# Eureka\n\nEureka is a service discovery tool from Netflix, integrated into Spring Cloud, that lets microservices register themselves and find other services by name instead of hardcoded addresses. Each service instance registers with a Eureka server on startup and sends periodic heartbeats to confirm it is still available. Other services query the Eureka server to look up healthy instances of a service before making a request, which supports load balancing and failover.\n\nVisit the following resources to learn more:\n\n- [@article@Introduction to Spring Cloud Netflix – Eureka](https://www.baeldung.com/spring-cloud-netflix-eureka)\n- [@article@Spring Boot - Eureka Server](https://www.tutorialspoint.com/spring_boot/spring_boot_eureka_server.htm)\n- [@video@Introducing Spring Cloud EUREKA](https://www.youtube.com/watch?v=1uNo1NrqsX4)",
        "coreConcepts": [
          {
            "heading": "1. Khái niệm và Vai trò của Eureka",
            "points": [
              "Nắm vững mục đích và bối cảnh sử dụng của Eureka trong ứng dụng Spring Boot.",
              "Hiểu rõ luồng xử lý và cách cấu hình tương thích với Spring Boot 3 và Java 21."
            ]
          }
        ],
        "javaDeepDive": null,
        "interviewQA": [
          {
            "question": "Vai trò chính của Eureka trong Spring Boot là gì?",
            "answer": "Eureka đóng vai trò quan trọng trong việc thiết kế và xây dựng các thành phần của hệ thống Spring Boot chuẩn mực, giúp tối ưu hiệu năng và dễ bảo trì."
          }
        ]
      },
      {
        "id": "GsmBGRohWbJ6XOaALFZ8o",
        "slug": "micrometer",
        "title": "Micrometer",
        "englishTitle": "Micrometer",
        "summary": "Kiến thức và nguyên lý nền tảng của Micrometer trong hệ sinh thái Spring Boot.",
        "estimatedMinutes": 20,
        "originalRoadmapMarkdown": "# Micrometer\n\nMicrometer is a vendor-neutral metrics facade for Java and the default metrics library in Spring Boot. It exposes application metrics — timers, gauges, counters, and histograms — through a unified API that can report to backends such as Prometheus, Datadog, or Graphite, and integrates with Spring Boot Actuator.",
        "coreConcepts": [
          {
            "heading": "1. Khái niệm và Vai trò của Micrometer",
            "points": [
              "Nắm vững mục đích và bối cảnh sử dụng của Micrometer trong ứng dụng Spring Boot.",
              "Hiểu rõ luồng xử lý và cách cấu hình tương thích với Spring Boot 3 và Java 21."
            ]
          }
        ],
        "javaDeepDive": null,
        "interviewQA": [
          {
            "question": "Vai trò chính của Micrometer trong Spring Boot là gì?",
            "answer": "Micrometer đóng vai trò quan trọng trong việc thiết kế và xây dựng các thành phần của hệ thống Spring Boot chuẩn mực, giúp tối ưu hiệu năng và dễ bảo trì."
          }
        ]
      }
    ]
  }
];
