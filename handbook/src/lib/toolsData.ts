// ============================================================
// Tools & Portfolio Track Data (Git, Docker & Portfolio Blueprint)
// Nguồn chính thống:
// - Pro Git Book (Scott Chacon & Ben Straub - git-scm.com)
// - Docker Official Documentation (docs.docker.com)
// - Docker Curriculum (docker-curriculum.com)
// - Spring PetClinic & RealWorld Backend Specification
// ============================================================

export type ToolStatus = 'not-started' | 'in-progress' | 'done';

export function getToolStatusKey(id: string): string {
  return `tool_status_${id}`;
}

export function getToolNoteKey(id: string): string {
  return `tool_note_${id}`;
}

export interface ToolCitation {
  source: string;
  author: string;
  url: string;
  keyTakeaway: string;
}

export interface DetailedToolCitation {
  id: string;
  title: string;
  author: string;
  type: 'Book' | 'Official Doc' | 'Open Source Specification';
  url: string;
  description: string;
  keyTakeaway: string;
  highlights: string[];
}

export interface ToolGuide {
  id: string;
  order: number;
  title: string;
  category: 'Methodology' | 'Docker' | 'Git' | 'Portfolio Project';
  summary: string;
  citation: ToolCitation;
  steps: {
    heading: string;
    description: string;
    codeOrSnippet?: string;
    filename?: string;
  }[];
  interviewTips: string[];
}

export const TOOLS_GUIDES: ToolGuide[] = [
  {
    id: 'tools-methodology',
    order: 0,
    title: 'Phương Pháp Học & Khung Tư Duy Cho Backend Developer',
    category: 'Methodology',
    summary: 'Hiểu rõ bản chất vì sao lập trình viên Backend bắt buộc phải thành thạo Git & Docker, cách tư duy theo luồng dữ liệu và lộ trình học từ con số 0 đến tự tin phỏng vấn.',
    citation: {
      source: 'The Pragmatic Programmer & Pro Git',
      author: 'David Thomas, Andrew Hunt & Scott Chacon',
      url: 'https://git-scm.com/book/en/v2/Getting-Started-About-Version-Control',
      keyTakeaway: 'Đừng học vẹt câu lệnh. Hãy nắm vững mô hình ذه mental models: Git là đồ thị lịch sử trạng thái (DAG Snapshot), còn Docker là buồng cách ly tiến trình (Process Isolation).'
    },
    steps: [
      {
        heading: '1. Mental Model của Git: Cỗ máy thời gian dựa trên Ảnh Chụp (Snapshots)',
        description: 'Các hệ thống cũ (SVN, CVS) lưu trữ sự thay đổi dưới dạng danh sách các bản vá (Delta-based change sets). Ngược lại, Git coi dữ liệu như một chuỗi các ảnh chụp toàn bộ trạng thái (Snapshots) của thư mục dự án theo thời gian. Nếu file không đổi, Git chỉ trỏ con trỏ (pointer) đến file cũ đã lưu trước đó, giúp tốc độ rẽ nhánh và chuyển đổi commit diễn ra tức thì trong mili-giây.',
      },
      {
        heading: '2. Mental Model của Docker: Hộp đóng gói tiến trình, không phải Máy Ảo (VM)',
        description: 'Nhiều người mới thường sợ hãi Docker vì nghĩ nó nặng nề như cài đặt VMware hay VirtualBox. Hãy nhớ: Docker KHÔNG tạo ra hệ điều hành mới. Docker chỉ là một tiến trình (Process) bình thường trên hệ điều hành Linux của bạn, nhưng được bọc trong 2 "bức tường bảo vệ" của nhân Linux: Namespaces (cô lập những gì tiến trình nhìn thấy: tiến trình khác, ổ đĩa, card mạng) và Cgroups (giới hạn tài nguyên tiến trình được dùng: tối đa bao nhiêu RAM, CPU).',
      },
      {
        heading: '3. Lộ trình 3 bước học từ con số 0 để vượt qua vòng phỏng vấn Backend',
        description: `Lộ trình học chuẩn thực chiến:
1. Giai đoạn 1 (Cơ bản): Gõ thuần thục các lệnh CLI sinh tồn của Git (status, add, commit, log) và Docker (run, ps, logs, exec, volume, port mapping). Dùng Docker để tự bật PostgreSQL và Redis trên máy tính cá nhân thay vì cài trực tiếp.
2. Giai đoạn 2 (Thực chiến dự án): Viết Dockerfile Multi-stage đóng gói ứng dụng Spring Boot 3 gọn nhẹ (~150MB) và docker-compose.yml kết nối App + Database trong 1 lệnh duy nhất. Nắm vững Git Rebase và cách gỡ Conflict.
3. Giai đoạn 3 (Portfolio & Phỏng vấn): Tích hợp GitHub Actions CI tự động chạy test, viết README tiếng Anh chuẩn và tự tin trả lời các câu hỏi phỏng vấn hóc búa về Volume, Port mapping và Golden Rule of Rebase.`,
      }
    ],
    interviewTips: [
      'Phỏng vấn: "Tại sao công ty yêu cầu bạn phải biết Docker thay vì chỉ cần cài Java và PostgreSQL trực tiếp lên máy tính?" -> "Docker giải quyết triệt để vấn đề kinh điển \'It works on my machine\'. Môi trường dev của em, test của tester, và production của DevOps sẽ giống hệt nhau 100% nhờ cùng 1 Docker image. Không còn rủi ro lệch phiên bản JDK, sai múi giờ hay khác biệt hệ điều hành."',
      'Phỏng vấn: "Tư duy lưu trữ của Git khác gì các hệ thống VCS cũ như SVN?" -> "SVN lưu trữ các bản vá chênh lệch (Delta-based change sets), còn Git lưu trữ chuỗi các ảnh chụp toàn bộ trạng thái (Snapshots) dưới dạng cây định hướng không chu trình (DAG) được băm bằng SHA-1."'
    ]
  },
  {
    id: 'docker-fundamentals',
    order: 1,
    title: 'Docker Fundamentals: Khái Niệm Cốt Lõi, Port Mapping & CLI Cho Người Mới',
    category: 'Docker',
    summary: 'Giải thích bình dân, dễ hiểu nhất: Phân biệt Máy ảo vs Container, Image vs Container, cơ chế Port Mapping (-p), Volume lưu trữ dữ liệu (-v) và bộ lệnh CLI sống còn.',
    citation: {
      source: 'Docker Official Documentation (Get Started Guide)',
      author: 'Docker Inc. Community Education',
      url: 'https://docs.docker.com/get-started/overview/',
      keyTakeaway: 'Image là bản thiết kế chỉ đọc (Class); Container là thực thể sống đang chạy được sinh ra từ Image (Object). Container có tính chất tạm thời (Ephemeral), muốn giữ dữ liệu phải dùng Volume.'
    },
    steps: [
      {
        heading: '1. Phân biệt rõ Máy Ảo (VM) vs Docker Container',
        description: `• Máy Ảo (Virtual Machine - VM):
  - Phải cài đặt cả một Hệ điều hành khách (Guest OS) riêng biệt (Windows/Ubuntu nặng hàng chục GB).
  - Chạy qua lớp ảo hóa phần cứng Hypervisor.
  - Khởi động chậm (vài phút), tốn hàng GB RAM chỉ để chạy hệ điều hành.

• Docker Container:
  - Chia sẻ chung nhân hệ điều hành (Shared Host OS Kernel).
  - Không cần Guest OS, chỉ đóng gói mã nguồn + môi trường runtime JRE/NodeJS.
  - Khởi động siêu tốc trong vài trăm mili-giây, tiêu tốn rất ít RAM và CPU.`,
      },
      {
        heading: '2. Image vs Container: Bản thiết kế (Blueprint) vs Ngôi nhà đang ở (Instance)',
        description: `• Image (Hình ảnh / Bản thiết kế): Là một gói nén chỉ đọc (read-only layers) chứa mọi thứ cần thiết để chạy ứng dụng (code, libraries, JDK, dependencies). Hãy liên tưởng Image giống như file cài đặt .exe, file .iso hoặc Class trong Java.
• Container (Thùng chứa / Tiến trình sống): Là một instance đang chạy thực tế được sinh ra từ Image. Một Image có thể tạo ra 10 Container cùng lúc. Khi bạn tắt Container, Image gốc vẫn nguyên vẹn. Hãy liên tưởng Container giống như Object được khởi tạo từ Class bằng từ khóa new.`,
      },
      {
        heading: '3. Bộ lệnh CLI sống còn mà Backend Developer phải gõ hàng ngày',
        description: 'Hãy thực hành chạy ngay một cơ sở dữ liệu PostgreSQL 16 thật trên máy tính của bạn bằng 1 dòng lệnh duy nhất:',
        codeOrSnippet: `# 1. Khởi chạy PostgreSQL container chạy ngầm
docker run -d \\
  --name my-postgres \\
  -p 5432:5432 \\
  -e POSTGRES_USER=postgres_user \\
  -e POSTGRES_PASSWORD=mysecretpassword \\
  -e POSTGRES_DB=dev_db \\
  postgres:16-alpine

# GIẢI THÍCH TỪNG CỜ (FLAGS):
# -d (Detached): Chạy ngầm trong background, giải phóng terminal
# --name: Đặt tên dễ nhớ thay vì Docker sinh tên ngẫu nhiên
# -p 5432:5432 (Port Mapping): Cổng_Máy_Thật:Cổng_Trong_Container
# -e (Environment Variable): Truyền mật khẩu, user cho database
# postgres:16-alpine: Tên Image nhẹ (~40MB) tải từ Docker Hub

# 2. Xem danh sách container đang chạy
docker ps

# 3. Xem cả container đã tắt
docker ps -a

# 4. Xem log theo thời gian thực (Kỹ năng debug số 1)
docker logs -f my-postgres

# 5. Chui vào bên trong container để gõ lệnh psql
docker exec -it my-postgres psql -U postgres_user -d dev_db

# 6. Dừng, bật lại hoặc xóa container
docker stop my-postgres
docker start my-postgres
docker rm -f my-postgres`,
        filename: 'bash'
      },
      {
        heading: '4. Port Mapping (-p) & Volume (-v): Bí quyết không bị mất dữ liệu',
        description: `• Port Mapping (-p host_port:container_port):
Container nằm trong mạng riêng cô lập. Nếu chỉ chạy container mà không có -p 5432:5432, thì ứng dụng Spring Boot trên máy tính (IntelliJ) của bạn kết nối vào localhost:5432 sẽ bị báo lỗi "Connection Refused". -p mở một đường ống dẫn truyền từ cổng máy thật vào cổng container.

• Volume (-v volume_name:container_path):
Bản chất Container là Ephemeral (tạm thời). Khi bạn chạy lệnh docker rm -f my-postgres, toàn bộ dữ liệu bảng và dòng bạn vừa tạo sẽ BỐC HƠI HOÀN TOÀN!
Để dữ liệu sống mãi, ta dùng Named Volume:`,
        codeOrSnippet: `# Chạy Postgres kèm Named Volume lưu trữ dữ liệu vĩnh viễn trên máy thật
docker run -d \\
  --name my-postgres-safe \\
  -p 5432:5432 \\
  -e POSTGRES_PASSWORD=mysecretpassword \\
  -v pgdata_vol:/var/lib/postgresql/data \\
  postgres:16-alpine

# Dù sau này bạn có xoá container: docker rm -f my-postgres-safe
# Rồi tạo lại container mới với cùng volume: -v pgdata_vol:/var/lib/postgresql/data
# Toàn bộ dữ liệu database cũ vẫn còn nguyên vẹn 100%!`,
        filename: 'bash'
      }
    ],
    interviewTips: [
      'Phỏng vấn: "Container khác gì máy ảo (Virtual Machine - VM)?" -> "VM cần cài cả một hệ điều hành khách (Guest OS) hoàn chỉnh và chạy qua phần mềm ảo hóa Hypervisor, tốn hàng chục GB ổ đĩa và vài GB RAM để khởi động mất vài phút. Trong khi Docker Container chia sẻ chung Linux Kernel của máy chủ Host, chỉ cô lập tài nguyên qua Linux Namespaces (cô lập Process, Network, Mount) và Cgroups (giới hạn CPU, RAM), nên khởi động chỉ mất vài trăm mili-giây và cực kỳ nhẹ."',
      'Phỏng vấn: "Tại sao khi chạy docker run cần flag -p 8080:8080?" -> "Vì container chạy trong không gian mạng cô lập (isolated network namespace). Nếu không map port (-p host_port:container_port), máy chủ bên ngoài không thể truy cập được ứng dụng web bên trong container qua localhost."',
      'Phỏng vấn: "Điều gì xảy ra với dữ liệu ghi trong container khi container bị tắt hoặc xóa nếu không dùng volume?" -> "Tất cả dữ liệu ghi trên writable layer của container sẽ bị xóa sạch khi container bị xóa (destroy). Muốn dữ liệu DB tồn tại lâu dài bắt buộc phải dùng Named Volume hoặc Bind Mount."'
    ]
  },
  {
    id: 'git-fundamentals',
    order: 2,
    title: 'Git Fundamentals: 3 Vùng Làm Việc, Vòng Đời File & Lệnh Cơ Bản',
    category: 'Git',
    summary: 'Nắm chắc 3 vùng làm việc (Working Tree, Staging Area, Local Repo), hiểu rõ trạng thái file và các lệnh gõ tay hàng ngày mà không sợ hỏng code.',
    citation: {
      source: 'Pro Git Book (2nd Edition)',
      author: 'Scott Chacon & Ben Straub',
      url: 'https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository',
      keyTakeaway: 'Nắm chắc 3 trạng thái file: Modified (đã sửa ở Working Tree), Staged (đã đánh dấu ở Staging Area) và Committed (đã lưu an toàn trong Repository).'
    },
    steps: [
      {
        heading: '1. Ba vùng làm việc cốt lõi của Git (The Three States)',
        description: `• Working Tree (Thư mục làm việc): Nơi chứa các file bạn đang gõ code trực tiếp trên IDE. Các file sửa ở đây mang trạng thái Modified (chưa được lưu vào lịch sử).
• Staging Area / Index (Vùng dàn dựng / Bàn đóng gói): Nơi bạn gom và chọn lọc các thay đổi muốn đóng gói cho lần lưu tiếp theo qua lệnh git add. File ở đây mang trạng thái Staged.
• Local Repository / HEAD (Kho lưu trữ cục bộ): Nơi lưu trữ vĩnh viễn các snapshot commit trong thư mục ẩn .git. File ở đây mang trạng thái Committed.`,
      },
      {
        heading: '2. Các lệnh Git cơ bản gõ tay hàng ngày',
        description: 'Quy trình chuẩn cho mỗi lần làm việc:',
        codeOrSnippet: `# 1. Khởi tạo Git repository trong thư mục dự án
git init

# 2. Kiểm tra trạng thái các file (Gõ lệnh này thường xuyên nhất!)
git status

# 3. So sánh chi tiết từng dòng thay đổi trước khi add
git diff

# 4. Đưa file vào Staging Area (chuẩn bị commit)
git add src/main/java/com/example/UserService.java
# Hoặc đưa toàn bộ thay đổi vào Staging:
git add .

# 5. So sánh những file ĐÃ ĐƯỢC add vào Staging xem có đúng không
git diff --staged

# 6. Tạo commit có thông điệp rõ ràng chuẩn Conventional Commits
git commit -m "feat(user): add findById repository method"

# 7. Xem lịch sử commit dạng cây đẹp mắt, ngắn gọn
git log --oneline --graph --decorate -n 10`,
        filename: 'bash'
      },
      {
        heading: '3. Tấm khiên bảo vệ .gitignore: Những gì KHÔNG ĐƯỢC PHÉP commit',
        description: 'Lập trình viên Java mới thường mắc sai lầm nghiêm trọng là commit cả thư mục target/ hoặc mật khẩu lên GitHub.',
        codeOrSnippet: `# File .gitignore chuẩn cho dự án Spring Boot / Java:

# 1. Thư mục build sinh tự động (rất nặng, có thể tự sinh lại)
target/
build/
*.class
*.jar
*.war

# 2. Cấu hình cá nhân của IDE
.idea/
*.iml
.vscode/
.settings/
.project/

# 3. Mật khẩu, biến môi trường và log nhạy cảm (TUYỆT ĐỐI KHÔNG COMMIT!)
.env
*.log
application-secret.yml
credentials.json`,
        filename: '.gitignore'
      }
    ],
    interviewTips: [
      'Phỏng vấn: "Staging Area (Index) trong Git sinh ra để làm gì? Tại sao không commit thẳng từ Working Directory?" -> "Staging Area đóng vai trò như một bàn đóng gói bưu phẩm. Nó cho phép lập trình viên chia nhỏ các thay đổi thành các commit logic nguyên tử (atomic commits). Ví dụ bạn sửa 5 file, nhưng 3 file thuộc tính năng đăng nhập, 2 file thuộc sửa lỗi giao diện, bạn có thể staging 3 file trước để commit riêng, sau đó mới staging 2 file còn lại."',
      'Phỏng vấn: "Sự khác biệt giữa git diff và git diff --staged là gì?" -> "git diff hiển thị sự khác biệt giữa Working Directory và Staging Area (những gì bạn đã sửa nhưng chưa git add). Còn git diff --staged hiển thị sự khác biệt giữa Staging Area và commit gần nhất (những gì bạn đã git add và chuẩn bị commit)."'
    ]
  },
  {
    id: 'git-workflow-conflicts',
    order: 3,
    title: 'Git Workflow, Feature Branch, Rebase & Giải Quyết Conflict',
    category: 'Git',
    summary: 'Quy trình phân nhánh chuẩn doanh nghiệp, phân biệt Merge vs Rebase và kịch bản từng bước gỡ conflict khi làm việc nhóm.',
    citation: {
      source: 'Pro Git Book (2nd Edition)',
      author: 'Scott Chacon & Ben Straub (Chương 2: Git Basics & Chương 3: Git Branching)',
      url: 'https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging',
      keyTakeaway: 'Rebase viết lại lịch sử commit thành một đường thẳng sạch đẹp; Merge bảo toàn lịch sử gốc. Không bao giờ rebase trên các nhánh public/shared (Golden Rule of Rebase).'
    },
    steps: [
      {
        heading: '1. Quy trình tạo nhánh tính năng và cập nhật nhánh chính',
        description: 'Luôn tạo branch mới từ main/develop mới nhất trước khi code tính năng.',
        codeOrSnippet: `# Cập nhật nhánh main mới nhất từ remote
git checkout main
git pull origin main

# Tạo nhánh tính năng mới
git checkout -b feature/auth-jwt-refresh-token

# Code và commit có ý nghĩa (Conventional Commits)
git add .
git commit -m "feat(auth): implement refresh token rotation mechanism"`,
        filename: 'bash'
      },
      {
        heading: '2. Đồng bộ nhánh với main bằng Rebase (Tránh tạo merge commit rác)',
        description: 'Khi nhánh main có người khác vừa merge code vào, ta rebase nhánh feature lên trên đỉnh của main mới nhất.',
        codeOrSnippet: `# Đứng tại nhánh feature
git fetch origin
git rebase origin/main

# Nếu có CONFLICT xảy ra:
# Git sẽ dừng lại ở commit bị xung đột và báo danh sách file bị conflict
git status`,
        filename: 'bash'
      },
      {
        heading: '3. Các bước xử lý Conflict thủ công từng bước',
        description: 'Mở file có đánh dấu <<<<<<< HEAD và >>>>>>> branch, sửa code giữ lại phiên bản đúng, lưu file và tiếp tục rebase.',
        codeOrSnippet: `# Sau khi đã sửa thủ công các file conflict trong IDE:
git add src/main/java/com/example/UserService.java

# Tiếp tục rebase (KHÔNG chạy git commit!)
git rebase --continue

# Nếu muốn huỷ hoàn toàn quá trình rebase quay về trạng thái cũ:
# git rebase --abort

# Push lên remote (nếu đã rebase thì dùng force-with-lease an toàn):
git push --force-with-lease origin feature/auth-jwt-refresh-token`,
        filename: 'bash'
      }
    ],
    interviewTips: [
      'Phỏng vấn: "Tại sao nên dùng git push --force-with-lease thay vì git push -f?" -> "force-with-lease kiểm tra xem remote có commit mới của đồng nghiệp mà bạn chưa pull về không; nếu có nó sẽ từ chối push để không ghi đè mất code của đồng đội."',
      'Phỏng vấn: "Giải thích git cherry-pick là gì?" -> "Nhặt chính xác 1 commit từ branch này áp dụng sang branch khác mà không cần merge cả nhánh."'
    ]
  },
  {
    id: 'docker-spring-postgres',
    order: 4,
    title: 'Dockerfile Multi-stage & docker-compose Chạy App + PostgreSQL',
    category: 'Docker',
    summary: 'Đóng gói ứng dụng Spring Boot 3 / Java 21 siêu nhẹ (~150MB) bằng Multi-stage build và thiết lập mạng bridge chạy cùng PostgreSQL.',
    citation: {
      source: 'Docker Official Documentation',
      author: 'Docker Inc. (Containerize a Java application)',
      url: 'https://docs.docker.com/language/java/run-containers/',
      keyTakeaway: 'Multi-stage build tách biệt giai đoạn build (cần Maven/JDK nặng) và giai đoạn chạy runtime (chỉ cần JRE nhẹ), giảm 80% kích thước image và tăng bảo mật.'
    },
    steps: [
      {
        heading: '1. Multi-stage Dockerfile cho Spring Boot Java 21',
        description: 'Sử dụng base image Eclipse Temurin 21 Alpine tối ưu dung lượng và bảo mật (non-root user).',
        codeOrSnippet: `# STAGE 1: Build source code với Maven
FROM maven:3.9.6-eclipse-temurin-21-alpine AS builder
WORKDIR /build

# Tận dụng Docker layer cache cho dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy mã nguồn và đóng gói JAR
COPY src ./src
RUN mvn clean package -DskipTests

# STAGE 2: Runtime image siêu nhẹ
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Tạo non-root user để tăng tính bảo mật
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Copy file jar từ stage builder sang
COPY --from=builder /build/target/*.jar app.jar

# Khai báo port và khởi chạy
EXPOSE 8080
ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]`,
        filename: 'Dockerfile'
      },
      {
        heading: '2. docker-compose.yml chạy đồng thời App + PostgreSQL + Volume',
        description: 'Cấu hình mạng bridge, biến môi trường, healthcheck và volume lưu trữ dữ liệu vĩnh viễn.',
        codeOrSnippet: `version: '3.8'

services:
  postgres-db:
    image: postgres:16-alpine
    container_name: postgres-db
    restart: always
    environment:
      POSTGRES_DB: backend_db
      POSTGRES_USER: postgres_user
      POSTGRES_PASSWORD: supersecretpassword
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres_user -d backend_db"]
      interval: 5s
      timeout: 5s
      retries: 5

  backend-app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: spring-backend-app
    restart: on-failure
    ports:
      - "8080:8080"
    environment:
      SPRING_PROFILES_ACTIVE: prod
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres-db:5432/backend_db
      SPRING_DATASOURCE_USERNAME: postgres_user
      SPRING_DATASOURCE_PASSWORD: supersecretpassword
    depends_on:
      postgres-db:
        condition: service_healthy

volumes:
  postgres_data:
    driver: local`,
        filename: 'docker-compose.yml'
      }
    ],
    interviewTips: [
      'Phỏng vấn: "Tại sao trong docker-compose URL kết nối DB là jdbc:postgresql://postgres-db:5432 mà không phải localhost?" -> "Vì trong Docker network nội bộ, các container giao tiếp qua Service Name / Container Name nhờ cơ chế Embedded DNS của Docker."',
      'Phỏng vấn: "Flag -XX:+UseContainerSupport có ý nghĩa gì?" -> "Giúp JVM đọc đúng giới hạn CPU và RAM được cấp phát cho Container thay vì đọc toàn bộ tài nguyên của máy chủ Host."'
    ]
  },
  {
    id: 'portfolio-backend-blueprint',
    order: 5,
    title: 'Checklist Xây Dựng Dự Án Backend Portfolio Chuẩn Tuyển Dụng',
    category: 'Portfolio Project',
    summary: 'Bộ tiêu chuẩn 6 trụ cột của một repository backend hoàn chỉnh trên GitHub ghi điểm tuyệt đối với nhà tuyển dụng.',
    citation: {
      source: 'Spring PetClinic & RealWorld Backend Specification',
      author: 'Spring Team / Gothinkster Open Source Community',
      url: 'https://github.com/gothinkster/spring-boot-realworld-example-app',
      keyTakeaway: 'Nhà tuyển dụng không tìm kiếm một dự án quá phức tạp, họ tìm kiếm một dự án CLEAN: Có kiến trúc phân tầng rõ ràng, test coverage tốt, Dockerfile chạy ngay và README tiếng Anh chuyên nghiệp.'
    },
    steps: [
      {
        heading: 'Checklist 6 Trụ Cột của Repository Backend Hoàn Chỉnh',
        description: 'Đảm bảo repository của bạn tích hợp đủ các thành phần sau trước khi đính kèm CV:',
        codeOrSnippet: `[x] 1. Cấu trúc Clean / Layered Architecture:
    - controller/ (REST endpoints, validation @Valid)
    - service/ (Business logic, interface + impl)
    - repository/ (Spring Data JPA)
    - model/entity/ & dto/ (Request/Response DTOs riêng biệt, không lộ Entity)
    - exception/ (@RestControllerAdvice xử lý lỗi tập trung)
    - config/ (SecurityConfig, OpenApiConfig, DatabaseConfig)

[x] 2. Cơ sở dữ liệu:
    - PostgreSQL thật kết nối qua Docker.
    - Dùng Flyway / Liquibase quản lý migration các bảng thay vì ddl-auto=update.
    - Thiết kế bảng đạt chuẩn 3NF, có đánh index và foreign key đầy đủ.

[x] 3. Bảo mật:
    - Spring Security 6 stateless (SessionCreationPolicy.STATELESS).
    - JWT Authentication + Refresh Token rotation.
    - Phân quyền theo vai trò (@PreAuthorize("hasRole('ADMIN')")).

[x] 4. Kiểm thử tự động (Test Suite):
    - Unit Test: JUnit 5 + Mockito cho tầng Service (tối thiểu 70% coverage logic).
    - Integration Test: MockMvc kiểm tra Controller endpoints chính.

[x] 5. DevOps & Containerization:
    - Dockerfile Multi-stage build.
    - docker-compose.yml khởi chạy toàn bộ hệ thống bằng 1 lệnh: docker compose up -d.
    - GitHub Actions CI (tự động chạy mvn test khi có PR).

[x] 6. README.md bằng tiếng Anh chuyên nghiệp:
    - Giới thiệu tổng quan tính năng sản phẩm.
    - Sơ đồ kiến trúc (Architecture Diagram) & Sơ đồ CSDL (ERD).
    - Hướng dẫn cài đặt & chạy thử (Quickstart với Docker).
    - API Documentation (Tích hợp link Swagger UI: http://localhost:8080/swagger-ui.html).`,
        filename: 'CHECKLIST.md'
      }
    ],
    interviewTips: [
      'Khi giới thiệu dự án với người phỏng vấn: Trình bày theo mô hình STAR (Situation -> Task -> Action -> Result). Nêu rõ thách thức gặp phải (ví dụ: tối ưu N+1 query, bảo mật refresh token) và cách bạn giải quyết.'
    ]
  }
];

export const DETAILED_TOOL_CITATIONS: DetailedToolCitation[] = [
  {
    id: 'pro-git',
    title: 'Pro Git Book (2nd Edition)',
    author: 'Scott Chacon & Ben Straub',
    type: 'Book',
    url: 'https://git-scm.com/book/en/v2',
    description: 'Cuốn cẩm nang chuẩn mực và toàn diện nhất thế giới về Git được duy trì bởi cộng đồng Git Core. Hướng dẫn chi tiết từ Git Plumbing, phân nhánh, giải quyết xung đột đến kỹ thuật Rebase.',
    keyTakeaway: 'Rebase viết lại lịch sử commit thành một đường thẳng sạch đẹp; Merge bảo toàn lịch sử gốc. Không bao giờ rebase trên các nhánh public/shared (Golden Rule of Rebase).',
    highlights: [
      'Quy tắc Vàng (Golden Rule of Rebase): Chỉ rebase trên nhánh cục bộ cá nhân.',
      'Kỹ thuật gỡ Conflict từng bước với git rebase --continue và git rebase --abort.',
      'Sử dụng git push --force-with-lease thay cho -f để bảo vệ commit của đồng đội.'
    ]
  },
  {
    id: 'docker-docs',
    title: 'Docker Official Documentation (Containerizing Java)',
    author: 'Docker Inc. Engineering Team',
    type: 'Official Doc',
    url: 'https://docs.docker.com/language/java/run-containers/',
    description: 'Tài liệu hướng dẫn chính thức từ Docker về quy trình đóng gói và tối ưu hóa ứng dụng Java / Spring Boot 3 trên môi trường Container production-ready.',
    keyTakeaway: 'Multi-stage build tách biệt giai đoạn build (cần Maven/JDK nặng) và giai đoạn chạy runtime (chỉ cần JRE nhẹ), giảm 80% kích thước image và tăng bảo mật.',
    highlights: [
      'Multi-stage build: Maven build stage -> Minimal JRE runtime container.',
      'Chạy dưới non-root user (appuser) để hạn chế tối đa rủi ro bảo mật leo thang đặc quyền.',
      'Tối ưu tham số JVM Container: -XX:+UseContainerSupport và -XX:MaxRAMPercentage=75.0.'
    ]
  },
  {
    id: 'spring-realworld',
    title: 'RealWorld Specification & Spring PetClinic Backend',
    author: 'Spring Core Team & Gothinkster Community',
    type: 'Open Source Specification',
    url: 'https://github.com/gothinkster/spring-boot-realworld-example-app',
    description: 'Dự án mẫu mực chuẩn hóa kiến trúc backend thực chiến cấp doanh nghiệp, thể hiện cách tổ chức code Clean Layered Architecture, Security JWT, Validation và tự động hóa CI/CD.',
    keyTakeaway: 'Nhà tuyển dụng không tìm kiếm một dự án quá phức tạp, họ tìm kiếm một dự án CLEAN: Có kiến trúc phân tầng rõ ràng, test coverage tốt, Dockerfile chạy ngay và README tiếng Anh chuyên nghiệp.',
    highlights: [
      'Checklist 6 trụ cột của một repository GitHub gây ấn tượng mạnh với Lead phỏng vấn.',
      'Tách biệt Request/Response DTOs với Entity để ngăn rò rỉ dữ liệu nhạy cảm.',
      'Quản lý migration database bằng Flyway thay vì hibernate ddl-auto tự sinh.'
    ]
  }
];
