// ============================================================
// SQL & Database Track Data (LeetCode Top SQL 50 + RDBMS Core)
// Nguồn chính thống:
// - LeetCode Top SQL 50 (Study Plan)
// - Use The Index, Luke! (Markus Winand)
// - Designing Data-Intensive Applications (Martin Kleppmann - Ch. 3 & 7)
// - Database System Concepts (Silberschatz, Korth, Sudarshan)
// ============================================================

export type SqlStatus = 'not-started' | 'in-progress' | 'done';

export interface SqlCitation {
  source: string;
  author: string;
  type?: 'Study Plan' | 'Performance Authority' | 'Book' | 'Standard Spec';
  itemOrChapter: string;
  url?: string;
  description?: string;
  keyTakeaway: string;
  highlights?: string[];
}

export interface SqlTheoryTopic {
  id: string;
  order: number;
  title: string;
  englishTitle: string;
  summary: string;
  citation: SqlCitation;
  corePoints: string[];
  sqlExample: {
    title: string;
    query: string;
    explanation: string;
  };
  interviewQA: {
    question: string;
    answer: string;
  }[];
}

export interface SqlProblem {
  id: string;
  leetcodeId: number;
  title: string;
  slug: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: 'Select' | 'Basic Joins' | 'Basic Aggregate Functions' | 'Sorting and Grouping' | 'Advanced Select and Joins' | 'Subqueries' | 'Advanced String / Regex / Clause';
  summary: string;
  solutionSql: string;
  explanation: string;
  url: string;
}

export const SQL_CITATIONS: SqlCitation[] = [
  {
    source: 'LeetCode Top SQL 50',
    author: 'LeetCode Editorial Curated Study Plan',
    type: 'Study Plan',
    itemOrChapter: '50 Essential Interview Problems for Software Engineers',
    url: 'https://leetcode.com/studyplan/top-sql-50/',
    description: 'Bộ giáo trình luyện tập thực hành truy vấn SQL chuẩn quốc tế được tuyển chọn từ các câu hỏi phỏng vấn thực tế của Google, Amazon, Meta.',
    keyTakeaway: 'Bộ 50 câu hỏi truy vấn bao phủ 95% các mẫu bài toán SQL xuất hiện trong các buổi phỏng vấn backend.',
    highlights: [
      'Phủ trọn 7 nhóm truy vấn: Joins, Aggregate Functions, Grouping, Subqueries, Regex.',
      'Rèn luyện tư duy xử lý dữ liệu NULL, tối ưu LEFT JOIN và phân trang.',
      'Bộ test case khắt khe kiểm tra các trường hợp biên (Edge Cases).'
    ]
  },
  {
    source: 'Use The Index, Luke!',
    author: 'Markus Winand (SQL Performance Authority)',
    type: 'Performance Authority',
    itemOrChapter: 'Anatomy of an Index: The B-Tree & Doubly Linked Leaf Nodes',
    url: 'https://use-the-index-luke.com/sql/anatomy/the-tree',
    description: 'Tài liệu kinh điển về tối ưu hóa hiệu năng SQL và cấu trúc lưu trữ chỉ mục (B-Tree Index) độc lập với từng hệ quản trị cơ sở dữ liệu.',
    keyTakeaway: 'Index là cấu trúc dữ liệu cân bằng (B-Tree). Tốc độ tìm kiếm tăng vọt nhờ sắp xếp sẵn, nhưng chi phí ghi (INSERT/UPDATE/DELETE) tăng lên do phải duy trì cây.',
    highlights: [
      'Giải phẫu B-Tree: Node gốc, node trung gian và leaf nodes liên kết đôi.',
      'Quy tắc Leftmost Prefix trong Composite Index và các trường hợp mất Index.',
      'Index Range Scan: Tối ưu khoảng tìm kiếm thay vì dùng hàm bọc cột.'
    ]
  },
  {
    source: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann (Cambridge University / O\'Reilly)',
    type: 'Book',
    itemOrChapter: 'Chapter 7: Transactions & Weak Isolation Levels',
    url: 'https://dataintensive.net/',
    description: 'Cuốn sách chuẩn mực phân tích bản chất của tính toàn vẹn dữ liệu, các cấp độ cô lập giao dịch và hiện tượng xung đột trong hệ thống phân tán.',
    keyTakeaway: 'ACID và Transaction Isolation Levels là cốt lõi của tính toàn vẹn dữ liệu. Hiểu rõ Dirty Read, Non-repeatable Read và Phantom Read để chọn đúng mức độ cô lập.',
    highlights: [
      'Bản chất ACID: Atomicity, Consistency, Isolation, Durability.',
      '4 mức độ cô lập: Read Uncommitted, Read Committed, Repeatable Read, Serializable.',
      'Giải pháp chống Race Condition: SELECT FOR UPDATE và Snapshot Isolation.'
    ]
  },
  {
    source: 'Database System Concepts (7th Edition)',
    author: 'Silberschatz, Korth, Sudarshan',
    type: 'Book',
    itemOrChapter: 'Relational Database Design & Normalization (1NF, 2NF, 3NF, BCNF)',
    url: 'https://en.wikipedia.org/wiki/Database_normalization#Normal_forms',
    description: 'Giáo trình khoa học máy tính chuẩn mực thế giới về cơ sở dữ liệu quan hệ, lý thuyết phụ thuộc hàm (Functional Dependency) và các dạng chuẩn hóa.',
    keyTakeaway: 'Chuẩn hoá loại bỏ dị thường cập nhật (Update Anomaly) và dư thừa dữ liệu. Trong thực tế, thiết kế nhắm tới 3NF và cân nhắc Denormalization có kiểm soát cho hệ thống đọc nhiều.',
    highlights: [
      'Dạng chuẩn 1 (1NF): Giá trị nguyên tố (Atomic values), không lồng danh sách.',
      'Dạng chuẩn 2 (2NF): Loại bỏ phụ thuộc một phần vào Composite Key.',
      'Dạng chuẩn 3 (3NF): Loại bỏ phụ thuộc bắc cầu (Transitive Dependency).'
    ]
  }
];

export const SQL_THEORY_TOPICS: SqlTheoryTopic[] = [
  {
    id: 'joins-and-aggregations',
    order: 1,
    title: 'Các Loại JOIN, GROUP BY & HAVING',
    englishTitle: 'Mastering SQL Joins, GROUP BY & HAVING',
    summary: 'Phân biệt bản chất đại số quan hệ giữa INNER, LEFT, RIGHT, FULL OUTER JOIN và phân định ranh giới giữa WHERE vs HAVING.',
    citation: {
      source: 'PostgreSQL 16 Official Documentation',
      author: 'PostgreSQL Global Development Group',
      itemOrChapter: 'Chapter 7: Queries - Table Expressions & Grouping',
      url: 'https://www.postgresql.org/docs/current/queries-table-expressions.html#QUERIES-GROUP',
      keyTakeaway: 'WHERE lọc dòng trước khi gom nhóm (Row-level filter). HAVING lọc sau khi kết quả đã được tính toán bởi hàm tổng hợp (Aggregate-level filter).'
    },
    corePoints: [
      'INNER JOIN: Chỉ trả về các bản ghi thoả mãn điều kiện kết nối ở cả 2 bảng.',
      'LEFT JOIN: Giữ toàn bộ bản ghi của bảng bên trái, nếu bảng bên phải không có dữ liệu tương ứng thì điền NULL. Kỹ thuật bắt phần tử chưa từng phát sinh quan hệ: LEFT JOIN ... WHERE right.id IS NULL.',
      'GROUP BY: Gom các dòng có cùng giá trị trên các cột được chỉ định thành 1 dòng duy nhất để tính toán tổng hợp (COUNT, SUM, AVG, MIN, MAX).',
      'HAVING: Bắt buộc dùng khi điều kiện lọc dựa trên kết quả của hàm tổng hợp (ví dụ: HAVING COUNT(*) > 5).'
    ],
    sqlExample: {
      title: 'Tìm khách hàng đã đặt trên 3 đơn hàng và có tổng chi tiêu > $500',
      query: `SELECT 
    c.customer_id,
    c.customer_name,
    COUNT(o.order_id) AS total_orders,
    SUM(o.amount) AS total_spent
FROM customers c
INNER JOIN orders o ON c.customer_id = o.customer_id
WHERE o.status = 'COMPLETED' -- Lọc trước khi gom nhóm
GROUP BY c.customer_id, c.customer_name
HAVING COUNT(o.order_id) >= 3 AND SUM(o.amount) > 500.0 -- Lọc sau khi gom nhóm
ORDER BY total_spent DESC;`,
      explanation: 'WHERE o.status = "COMPLETED" loại bỏ đơn chưa thanh toán trước khi tính SUM. HAVING lọc điều kiện sau khi đã COUNT và SUM xong.'
    },
    interviewQA: [
      {
        question: 'Điểm khác biệt cốt lõi giữa WHERE và HAVING là gì? Có thể dùng HAVING thay cho WHERE được không?',
        answer: 'WHERE lọc từng dòng đơn lẻ trước khi tập hợp dữ liệu được gom nhóm (trước GROUP BY) và không thể sử dụng hàm tổng hợp (aggregate functions như SUM, COUNT). HAVING lọc trên các nhóm sau khi GROUP BY đã thực thi. Về cú pháp, HAVING có thể lọc các cột không aggregate nếu chúng nằm trong GROUP BY, nhưng sẽ làm giảm hiệu năng nghiêm trọng vì không tận dụng được Index sớm như WHERE.'
      }
    ]
  },
  {
    id: 'indexing-and-performance',
    order: 2,
    title: 'B-Tree Index, Clustered vs Non-Clustered & Tối Ưu',
    englishTitle: 'B-Tree Indexing & Query Optimization',
    summary: 'Bản chất vật lý của B-Tree Index, so sánh Clustered Index vs Secondary Index và những trường hợp Index bị vô hiệu hoá.',
    citation: {
      source: 'Use The Index, Luke!',
      author: 'Markus Winand',
      itemOrChapter: 'Anatomy of an Index: Leaf Nodes, Tree Traversal & Range Scans',
      url: 'https://use-the-index-luke.com/sql/where-clause/searching-for-ranges',
      keyTakeaway: 'Index không làm câu lệnh SQL chạy nhanh hơn một cách kỳ diệu; nó chỉ giúp Database Engine tránh Full Table Scan bằng cách thu hẹp phạm vi quét dữ liệu (Index Range Scan).'
    },
    corePoints: [
      'Cấu trúc B-Tree: Cây cân bằng tự duy trì với độ phức tạp tìm kiếm O(log N). Các node lá (leaf nodes) là danh sách liên kết đôi hỗ trợ range query (<, >, BETWEEN) cực nhanh.',
      'Clustered Index: Dữ liệu vật lý của toàn bộ bảng được sắp xếp theo đúng thứ tự của Index này (thường là Primary Key). Một bảng chỉ có duy nhất 1 Clustered Index.',
      'Non-Clustered Index (Secondary Index): Cây Index riêng biệt mà node lá chứa con trỏ trỏ về dòng dữ liệu thực tế (hoặc trỏ về Clustered Key).',
      'Quy tắc Leftmost Prefix trong Composite Index: Index (A, B, C) chỉ có tác dụng khi câu lệnh WHERE có sử dụng A, hoặc A và B, hoặc A, B, C. Nếu chỉ WHERE B thì Index hoàn toàn vô dụng.',
      'Các trường hợp làm mất Index: Dùng hàm trên cột (WHERE YEAR(created_at) = 2024), toán tử LIKE "%abc", ép kiểu ngầm định (implicit casting).'
    ],
    sqlExample: {
      title: 'Tối ưu hoá câu query để tận dụng Index Range Scan',
      query: `-- SAI: Dùng hàm bọc cột khiến Database Engine phải tính toán từng dòng -> Full Table Scan
SELECT * FROM users WHERE YEAR(created_at) = 2024;

-- ĐÚNG: Giữ nguyên cột index, chuyển đổi hằng số so sánh -> Index Range Scan cực nhanh!
SELECT * FROM users 
WHERE created_at >= '2024-01-01 00:00:00' 
  AND created_at <  '2025-01-01 00:00:00';`,
      explanation: 'Khi cột created_at được đánh B-Tree Index, việc so sánh trực tiếp khoảng thời gian giúp DB Engine nhảy thẳng tới node lá đầu tiên của năm 2024 và quét tuần tự đến hết năm 2024, bỏ qua hàng triệu dòng khác.'
    },
    interviewQA: [
      {
        question: 'Tại sao không nên đánh Index trên mọi cột trong bảng?',
        answer: '1. Tốn dung lượng ổ đĩa và bộ nhớ RAM (để giữ index trong buffer pool). 2. Làm chậm nghiêm trọng các thao tác ghi (INSERT, UPDATE, DELETE) vì mỗi lần thay đổi dữ liệu, database phải cập nhật lại cấu trúc cân bằng của B-Tree và thực hiện phân tách node (page split). 3. Với các cột có độ phân tán thấp (Low Cardinality - ví dụ: gender với 2 giá trị M/F), Optimizer thường bỏ qua Index và quét thẳng toàn bảng.'
      }
    ]
  },
  {
    id: 'acid-and-transactions',
    order: 3,
    title: 'ACID & 4 Mức Độ Cô Lập Giao Dịch (Isolation Levels)',
    englishTitle: 'ACID Guarantees & Transaction Isolation Levels',
    summary: 'Nguyên lý ACID, 4 mức độ cô lập từ Read Uncommitted đến Serializable, và 3 hiện tượng xung đột dữ liệu kinh điển.',
    citation: {
      source: 'Designing Data-Intensive Applications',
      author: 'Martin Kleppmann',
      itemOrChapter: 'Chapter 7: Transactions - Read Committed, Snapshot Isolation and Repeatable Read',
      url: 'https://www.postgresql.org/docs/current/transaction-iso.html',
      keyTakeaway: 'Serializable là mức cô lập hoàn hảo nhất nhưng trả giá bằng hiệu năng. Hầu hết các hệ thống thực tế dùng Read Committed (Postgres) hoặc Repeatable Read (MySQL InnoDB).'
    },
    corePoints: [
      'Atomicity (Nguyên tử): Tất cả hoặc không có gì (All or Nothing). Nếu 1 thao tác thất bại, toàn bộ transaction được ROLLBACK.',
      'Consistency (Nhất quán): Dữ liệu luôn tuân thủ các ràng buộc toàn vẹn (Constraints, Foreign Keys, Triggers).',
      'Isolation (Cô lập): Các transaction chạy đồng thời không được can thiệp lẫn nhau gây sai lệch dữ liệu.',
      'Durability (Bền vững): Một khi đã COMMIT thành công, dữ liệu được ghi vào WAL/Redo log và không bị mất ngay cả khi server mất điện đột ngột.',
      '3 hiện tượng xung đột:',
      '  - Dirty Read: Transaction A đọc dữ liệu chưa commit của Transaction B (nếu B rollback thì A đọc dữ liệu rác).',
      '  - Non-repeatable Read: Transaction A đọc cùng 1 dòng 2 lần nhưng nhận kết quả khác nhau vì Transaction B đã UPDATE dòng đó ở giữa.',
      '  - Phantom Read: Transaction A chạy câu query khoảng (range query) 2 lần nhưng lần 2 xuất hiện thêm các dòng mới do Transaction B INSERT vào.'
    ],
    sqlExample: {
      title: 'Thiết lập Isolation Level trong giao dịch tài chính',
      query: `-- Chuyển tiền an toàn giữa 2 tài khoản
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
BEGIN TRANSACTION;

-- Kiểm tra số dư và khoá dòng để tránh Race Condition
SELECT balance FROM accounts WHERE account_id = 1 FOR UPDATE;

UPDATE accounts SET balance = balance - 100 WHERE account_id = 1;
UPDATE accounts SET balance = balance + 100 WHERE account_id = 2;

COMMIT;`,
      explanation: 'SELECT ... FOR UPDATE thiết lập Exclusive Lock (Pessimistic Locking) ngăn không cho bất kỳ giao dịch nào khác sửa hoặc trừ tiền tài khoản 1 cho đến khi transaction kết thúc.'
    },
    interviewQA: [
      {
        question: 'PostgreSQL và MySQL InnoDB mặc định dùng mức Isolation Level nào? Và chúng ngăn chặn được những lỗi gì?',
        answer: 'PostgreSQL mặc định dùng Read Committed (chỉ đọc dữ liệu đã commit, ngăn được Dirty Read nhưng vẫn có thể bị Non-repeatable Read và Phantom Read). MySQL InnoDB mặc định dùng Repeatable Read (ngăn được cả Dirty Read và Non-repeatable Read; đặc biệt InnoDB sử dụng cơ chế Next-Key Locking (kết hợp Index Record Lock và Gap Lock) để ngăn chặn phần lớn hiện tượng Phantom Read).'
      }
    ]
  },
  {
    id: 'normalization-vs-denormalization',
    order: 4,
    title: 'Chuẩn Hoá 1NF-3NF & Tư Duy Phi Chuẩn Hoá (Denormalization)',
    englishTitle: 'Database Normalization (1NF, 2NF, 3NF) vs Real-world Denormalization',
    summary: 'Quy tắc chuẩn hoá loại bỏ dị thường cập nhật và cách áp dụng tư duy thực tế: khi nào cố tình phi chuẩn hoá để tối ưu hệ thống.',
    citation: {
      source: 'Database System Concepts (7th Edition)',
      author: 'Silberschatz, Korth, Sudarshan',
      itemOrChapter: 'Chapter 8: Relational Database Design & Functional Dependencies',
      url: 'https://en.wikipedia.org/wiki/Third_normal_form',
      keyTakeaway: 'Chuẩn hoá 3NF là tiêu chuẩn vàng cho hệ thống ghi OLTP. Nhưng trong kiến trúc phân tán hoặc các tác vụ đọc nhiều (read-heavy), Denormalization có chủ đích là vũ khí tối thượng để tránh JOIN tốn kém.'
    },
    corePoints: [
      '1NF (Chuẩn 1): Mỗi cột chỉ chứa giá trị nguyên tố (Atomic Value) — không lưu danh sách, mảng hoặc chuỗi phân tách bởi dấu phẩy trong 1 ô.',
      '2NF (Chuẩn 2): Đã đạt 1NF và mọi thuộc tính không khóa phải phụ thuộc hoàn toàn vào toàn bộ Khóa chính (No Partial Dependency — loại bỏ trường hợp phụ thuộc 1 phần vào composite primary key).',
      '3NF (Chuẩn 3): Đã đạt 2NF và không có thuộc tính không khóa nào phụ thuộc bắc cầu vào Khóa chính (No Transitive Dependency — ví dụ: A -> B và B -> C thì phải tách B, C thành bảng riêng).',
      'Denormalization trong thực tế:',
      '  - Hệ thống E-commerce: Lưu sẵn total_amount và customer_name trong bảng orders thay vì phải JOIN với users và SUM từ order_items mỗi lần hiển thị lịch sử đơn.',
      '  - Đánh đổi: Tăng tốc độ đọc x10 lần, nhưng đánh đổi bằng việc tốn dung lượng và phải đồng bộ cập nhật cẩn thận khi dữ liệu nguồn thay đổi.'
    ],
    sqlExample: {
      title: 'Minh họa Chuẩn 3NF và Denormalization có kiểm soát',
      query: `-- Thiết kế chuẩn 3NF: Bảng orders không lưu customer_name và total_amount
CREATE TABLE customers (
    customer_id BIGINT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL
);

CREATE TABLE orders (
    order_id BIGINT PRIMARY KEY,
    customer_id BIGINT REFERENCES customers(customer_id),
    created_at TIMESTAMP NOT NULL,
    -- Denormalization có kiểm soát: Lưu trước total_amount để tối ưu đọc
    cached_total_amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00
);

CREATE TABLE order_items (
    item_id BIGINT PRIMARY KEY,
    order_id BIGINT REFERENCES orders(order_id),
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);`,
      explanation: 'Việc giữ cached_total_amount trong bảng orders là kỹ thuật Denormalization kinh điển trong thực tế, giúp câu lệnh xem danh sách đơn hàng của người dùng không cần JOIN và GROUP BY bảng order_items.'
    },
    interviewQA: [
      {
        question: 'Khi đi làm thực tế, bạn có ngồi phân tích 1NF, 2NF, 3NF từng bước với bảng 30 cột không? Trả lời phỏng vấn thế nào cho chuyên nghiệp?',
        answer: 'Thực tế kỹ sư không chứng minh toán học từng NF mà thiết kế dựa trên Thực thể nghiệp vụ (Domain Modeling: mỗi đối tượng là 1 bảng, liên kết bằng Foreign Key). Thiết kế đó hầu như mặc định đã đạt 3NF. Khi phỏng vấn, hãy trả lời: "Tôi dùng 3NF làm quy tắc kiểm tra (sanity check) để tránh dư thừa và dị thường cập nhật. Tuy nhiên, ở các bảng có tần suất đọc cực cao (Read-Heavy), tôi chủ động áp dụng Denormalization có kiểm soát để giảm thiểu chi phí JOIN nhiều bảng".'
      }
    ]
  }
];

export const LEETCODE_TOP_SQL_50: SqlProblem[] = [
  {
    id: 'sql-1757',
    leetcodeId: 1757,
    title: 'Recyclable and Low Fat Products',
    slug: 'recyclable-and-low-fat-products',
    difficulty: 'Easy',
    category: 'Select',
    summary: 'Tìm ID các sản phẩm vừa low fat vừa recyclable.',
    solutionSql: `SELECT product_id 
FROM Products 
WHERE low_fats = 'Y' AND recyclable = 'Y';`,
    explanation: 'Sử dụng mệnh đề WHERE kết hợp toán tử logic AND để lọc 2 điều kiện đồng thời.',
    url: 'https://leetcode.com/problems/recyclable-and-low-fat-products/'
  },
  {
    id: 'sql-584',
    leetcodeId: 584,
    title: 'Find Customer Referee',
    slug: 'find-customer-referee',
    difficulty: 'Easy',
    category: 'Select',
    summary: 'Tìm khách hàng không được giới thiệu bởi người có ID = 2 (chú ý giá trị NULL).',
    solutionSql: `SELECT name 
FROM Customer 
WHERE referee_id != 2 OR referee_id IS NULL;`,
    explanation: 'Bẫy phỏng vấn kinh điển về Three-Valued Logic trong SQL: Phép so sánh referee_id != 2 sẽ trả về UNKNOWN đối với các dòng có referee_id là NULL. Do đó BẮT BUỘC phải thêm điều kiện OR referee_id IS NULL.',
    url: 'https://leetcode.com/problems/find-customer-referee/'
  },
  {
    id: 'sql-595',
    leetcodeId: 595,
    title: 'Big Countries',
    slug: 'big-countries',
    difficulty: 'Easy',
    category: 'Select',
    summary: 'Tìm các quốc gia có diện tích ít nhất 3,000,000 km² hoặc dân số ít nhất 25,000,000.',
    solutionSql: `SELECT name, population, area 
FROM World 
WHERE area >= 3000000 OR population >= 25000000;`,
    explanation: 'Mệnh đề WHERE với toán tử OR lọc theo ngưỡng diện tích hoặc dân số.',
    url: 'https://leetcode.com/problems/big-countries/'
  },
  {
    id: 'sql-1148',
    leetcodeId: 1148,
    title: 'Article Views I',
    slug: 'article-views-i',
    difficulty: 'Easy',
    category: 'Select',
    summary: 'Tìm các tác giả tự đọc bài viết của chính mình, sắp xếp ID tăng dần.',
    solutionSql: `SELECT DISTINCT author_id AS id 
FROM Views 
WHERE author_id = viewer_id 
ORDER BY id ASC;`,
    explanation: 'Dùng WHERE author_id = viewer_id, kết hợp DISTINCT để loại bỏ trùng lặp nếu tác giả xem bài nhiều lần.',
    url: 'https://leetcode.com/problems/article-views-i/'
  },
  {
    id: 'sql-1683',
    leetcodeId: 1683,
    title: 'Invalid Tweets',
    slug: 'invalid-tweets',
    difficulty: 'Easy',
    category: 'Select',
    summary: 'Tìm ID các tweet có độ dài nội dung vượt quá 15 ký tự.',
    solutionSql: `SELECT tweet_id 
FROM Tweets 
WHERE LENGTH(content) > 15;`,
    explanation: 'Sử dụng hàm độ dài chuỗi LENGTH(content) trong MySQL / PostgreSQL.',
    url: 'https://leetcode.com/problems/invalid-tweets/'
  },
  {
    id: 'sql-1378',
    leetcodeId: 1378,
    title: 'Replace Employee ID With The Unique Identifier',
    slug: 'replace-employee-id-with-the-unique-identifier',
    difficulty: 'Easy',
    category: 'Basic Joins',
    summary: 'Hiển thị mã định danh duy nhất (unique ID) của nhân viên, nếu không có hiển thị null.',
    solutionSql: `SELECT u.unique_id, e.name 
FROM Employees e 
LEFT JOIN EmployeeUNI u ON e.id = u.id;`,
    explanation: 'Dùng LEFT JOIN để giữ lại toàn bộ nhân viên kể cả những người chưa có trong bảng EmployeeUNI (khi đó unique_id tự động nhận giá trị NULL).',
    url: 'https://leetcode.com/problems/replace-employee-id-with-the-unique-identifier/'
  },
  {
    id: 'sql-1068',
    leetcodeId: 1068,
    title: 'Product Sales Analysis I',
    slug: 'product-sales-analysis-i',
    difficulty: 'Easy',
    category: 'Basic Joins',
    summary: 'Lấy tên sản phẩm, năm bán và giá bán cho từng đơn hàng trong Sales.',
    solutionSql: `SELECT p.product_name, s.year, s.price 
FROM Sales s 
INNER JOIN Product p ON s.product_id = p.product_id;`,
    explanation: 'INNER JOIN kết nối bảng Sales và Product qua khóa ngoại product_id.',
    url: 'https://leetcode.com/problems/product-sales-analysis-i/'
  },
  {
    id: 'sql-1581',
    leetcodeId: 1581,
    title: 'Customer Who Visited but Did Not Make Any Transactions',
    slug: 'customer-who-visited-but-did-not-make-any-transactions',
    difficulty: 'Easy',
    category: 'Basic Joins',
    summary: 'Tìm khách hàng ghé thăm cửa hàng nhưng không phát sinh bất kỳ giao dịch nào và đếm số lần.',
    solutionSql: `SELECT v.customer_id, COUNT(v.visit_id) AS count_no_trans 
FROM Visits v 
LEFT JOIN Transactions t ON v.visit_id = t.visit_id 
WHERE t.transaction_id IS NULL 
GROUP BY v.customer_id;`,
    explanation: 'Mẫu truy vấn kinh điển: LEFT JOIN kết hợp WHERE right_table.id IS NULL để lọc ra các bản ghi không có quan hệ, sau đó gom nhóm theo customer_id.',
    url: 'https://leetcode.com/problems/customer-who-visited-but-did-not-make-any-transactions/'
  },
  {
    id: 'sql-197',
    leetcodeId: 197,
    title: 'Rising Temperature',
    slug: 'rising-temperature',
    difficulty: 'Easy',
    category: 'Basic Joins',
    summary: 'Tìm ID các ngày có nhiệt độ cao hơn ngày hôm trước liền kề.',
    solutionSql: `SELECT w1.id 
FROM Weather w1 
INNER JOIN Weather w2 
  ON w1.recordDate = w2.recordDate + INTERVAL '1 day' 
WHERE w1.temperature > w2.temperature;`,
    explanation: 'Kỹ thuật Self Join (tự kết nối với chính mình) với điều kiện ngày w1 bằng ngày w2 cộng thêm 1 ngày, so sánh w1.temperature > w2.temperature.',
    url: 'https://leetcode.com/problems/rising-temperature/'
  },
  {
    id: 'sql-1661',
    leetcodeId: 1661,
    title: 'Average Time of Process per Machine',
    slug: 'average-time-of-process-per-machine',
    difficulty: 'Easy',
    category: 'Basic Joins',
    summary: 'Tính thời gian xử lý trung bình của từng máy dựa trên timestamp start và end.',
    solutionSql: `SELECT 
    a1.machine_id, 
    ROUND(AVG(a2.timestamp - a1.timestamp)::numeric, 3) AS processing_time 
FROM Activity a1 
JOIN Activity a2 
  ON a1.machine_id = a2.machine_id 
 AND a1.process_id = a2.process_id 
 AND a1.activity_type = 'start' 
 AND a2.activity_type = 'end' 
GROUP BY a1.machine_id;`,
    explanation: 'Self Join để đưa dòng start và end của cùng 1 process vào cùng 1 dòng, trừ timestamp và dùng AVG().',
    url: 'https://leetcode.com/problems/average-time-of-process-per-machine/'
  },
  {
    id: 'sql-577',
    leetcodeId: 577,
    title: 'Employee Bonus',
    slug: 'employee-bonus',
    difficulty: 'Easy',
    category: 'Basic Joins',
    summary: 'Tìm tên và tiền thưởng của nhân viên có thưởng < 1000 hoặc không có thưởng.',
    solutionSql: `SELECT e.name, b.bonus 
FROM Employee e 
LEFT JOIN Bonus b ON e.empId = b.empId 
WHERE b.bonus < 1000 OR b.bonus IS NULL;`,
    explanation: 'Dùng LEFT JOIN và bắt điều kiện b.bonus < 1000 OR b.bonus IS NULL (vì nhân viên không có thưởng thì b.bonus là NULL).',
    url: 'https://leetcode.com/problems/employee-bonus/'
  },
  {
    id: 'sql-1280',
    leetcodeId: 1280,
    title: 'Students and Examinations',
    slug: 'students-and-examinations',
    difficulty: 'Easy',
    category: 'Basic Joins',
    summary: 'Đếm số lần mỗi học sinh tham gia kỳ thi từng môn học (kể cả số lần bằng 0).',
    solutionSql: `SELECT 
    s.student_id, 
    s.student_name, 
    sub.subject_name, 
    COUNT(e.student_id) AS attended_exams 
FROM Students s 
CROSS JOIN Subjects sub 
LEFT JOIN Examinations e 
  ON s.student_id = e.student_id AND sub.subject_name = e.subject_name 
GROUP BY s.student_id, s.student_name, sub.subject_name 
ORDER BY s.student_id, sub.subject_name;`,
    explanation: 'CROSS JOIN giữa Students và Subjects để tạo ra tất cả các cặp học sinh - môn học có thể có, sau đó LEFT JOIN với Examinations và COUNT(e.student_id).',
    url: 'https://leetcode.com/problems/students-and-examinations/'
  },
  {
    id: 'sql-570',
    leetcodeId: 570,
    title: 'Managers with at Least 5 Direct Reports',
    slug: 'managers-with-at-least-5-direct-reports',
    difficulty: 'Medium',
    category: 'Basic Joins',
    summary: 'Tìm tên các quản lý có ít nhất 5 nhân viên cấp dưới trực tiếp báo cáo.',
    solutionSql: `SELECT m.name 
FROM Employee e 
INNER JOIN Employee m ON e.managerId = m.id 
GROUP BY m.id, m.name 
HAVING COUNT(e.id) >= 5;`,
    explanation: 'Self-join nối bảng nhân viên với chính quản lý của họ, gom nhóm theo quản lý và dùng HAVING COUNT(e.id) >= 5.',
    url: 'https://leetcode.com/problems/managers-with-at-least-5-direct-reports/'
  },
  {
    id: 'sql-1934',
    leetcodeId: 1934,
    title: 'Confirmation Rate',
    slug: 'confirmation-rate',
    difficulty: 'Medium',
    category: 'Basic Joins',
    summary: 'Tính tỉ lệ xác nhận tài khoản của từng người dùng (số lần confirmed / tổng số yêu cầu, làm tròn 2 chữ số).',
    solutionSql: `SELECT 
    s.user_id, 
    ROUND(COALESCE(AVG(CASE WHEN c.action = 'confirmed' THEN 1.0 ELSE 0.0 END), 0.0), 2) AS confirmation_rate 
FROM Signups s 
LEFT JOIN Confirmations c ON s.user_id = c.user_id 
GROUP BY s.user_id;`,
    explanation: 'CASE WHEN chuyển đổi action = "confirmed" thành 1 và các trường hợp khác thành 0. Hàm AVG tính trực tiếp tỉ lệ xác nhận.',
    url: 'https://leetcode.com/problems/confirmation-rate/'
  },
  {
    id: 'sql-620',
    leetcodeId: 620,
    title: 'Not Boring Movies',
    slug: 'not-boring-movies',
    difficulty: 'Easy',
    category: 'Basic Aggregate Functions',
    summary: 'Tìm các bộ phim có ID số lẻ và mô tả không phải là "boring", sắp xếp rating giảm dần.',
    solutionSql: `SELECT * 
FROM Cinema 
WHERE id % 2 = 1 AND description != 'boring' 
ORDER BY rating DESC;`,
    explanation: 'Dùng phép modulo id % 2 = 1 để kiểm tra số lẻ và ORDER BY rating DESC.',
    url: 'https://leetcode.com/problems/not-boring-movies/'
  },
  {
    id: 'sql-1251',
    leetcodeId: 1251,
    title: 'Average Selling Price',
    slug: 'average-selling-price',
    difficulty: 'Easy',
    category: 'Basic Aggregate Functions',
    summary: 'Tính giá bán trung bình của từng sản phẩm dựa trên các khoảng thời gian giá và số lượng bán.',
    solutionSql: `SELECT 
    p.product_id, 
    COALESCE(ROUND(SUM(p.price * u.units)::numeric / NULLIF(SUM(u.units), 0), 2), 0) AS average_price 
FROM Prices p 
LEFT JOIN UnitsSold u 
  ON p.product_id = u.product_id 
 AND u.purchase_date BETWEEN p.start_date AND p.end_date 
GROUP BY p.product_id;`,
    explanation: 'LEFT JOIN với điều kiện purchase_date BETWEEN start_date AND end_date, sau đó tính SUM(price * units) / SUM(units) an toàn bằng NULLIF tránh chia cho 0.',
    url: 'https://leetcode.com/problems/average-selling-price/'
  },
  {
    id: 'sql-1075',
    leetcodeId: 1075,
    title: 'Project Employees I',
    slug: 'project-employees-i',
    difficulty: 'Easy',
    category: 'Basic Aggregate Functions',
    summary: 'Tính số năm kinh nghiệm trung bình của nhân viên tham gia từng dự án.',
    solutionSql: `SELECT 
    p.project_id, 
    ROUND(AVG(e.experience_years)::numeric, 2) AS average_years 
FROM Project p 
INNER JOIN Employee e ON p.employee_id = e.employee_id 
GROUP BY p.project_id;`,
    explanation: 'JOIN giữa Project và Employee, gom nhóm theo project_id và dùng AVG() làm tròn 2 chữ số.',
    url: 'https://leetcode.com/problems/project-employees-i/'
  },
  {
    id: 'sql-1633',
    leetcodeId: 1633,
    title: 'Percentage of Users Attended a Contest',
    slug: 'percentage-of-users-attended-a-contest',
    difficulty: 'Easy',
    category: 'Basic Aggregate Functions',
    summary: 'Tính phần trăm người dùng đăng ký từng cuộc thi, sắp xếp giảm dần.',
    solutionSql: `SELECT 
    contest_id, 
    ROUND(COUNT(user_id) * 100.0 / (SELECT COUNT(*) FROM Users), 2) AS percentage 
FROM Register 
GROUP BY contest_id 
ORDER BY percentage DESC, contest_id ASC;`,
    explanation: 'Dùng subquery (SELECT COUNT(*) FROM Users) để lấy tổng số người dùng của toàn hệ thống làm mẫu số tính phần trăm.',
    url: 'https://leetcode.com/problems/percentage-of-users-attended-a-contest/'
  },
  {
    id: 'sql-1211',
    leetcodeId: 1211,
    title: 'Queries Quality and Percentage',
    slug: 'queries-quality-and-percentage',
    difficulty: 'Easy',
    category: 'Basic Aggregate Functions',
    summary: 'Tính chất lượng truy vấn (AVG(rating/position)) và phần trăm đánh giá kém (rating < 3).',
    solutionSql: `SELECT 
    query_name, 
    ROUND(AVG(rating::numeric / position), 2) AS quality, 
    ROUND(AVG(CASE WHEN rating < 3 THEN 100.0 ELSE 0.0 END), 2) AS poor_query_percentage 
FROM Queries 
WHERE query_name IS NOT NULL 
GROUP BY query_name;`,
    explanation: 'AVG(rating / position) tính chất lượng, kết hợp CASE WHEN rating < 3 THEN 100 ELSE 0 tính phần trăm chất lượng kém.',
    url: 'https://leetcode.com/problems/queries-quality-and-percentage/'
  },
  {
    id: 'sql-1193',
    leetcodeId: 1193,
    title: 'Monthly Transactions I',
    slug: 'monthly-transactions-i',
    difficulty: 'Medium',
    category: 'Basic Aggregate Functions',
    summary: 'Thống kê tổng số giao dịch, số giao dịch thành công, tổng tiền theo từng tháng và quốc gia.',
    solutionSql: `SELECT 
    TO_CHAR(trans_date, 'YYYY-MM') AS month, 
    country, 
    COUNT(*) AS trans_count, 
    COUNT(CASE WHEN state = 'approved' THEN 1 END) AS approved_count, 
    SUM(amount) AS trans_total_amount, 
    COALESCE(SUM(CASE WHEN state = 'approved' THEN amount ELSE 0 END), 0) AS approved_total_amount 
FROM Transactions 
GROUP BY TO_CHAR(trans_date, 'YYYY-MM'), country;`,
    explanation: 'Dùng TO_CHAR(trans_date, "YYYY-MM") để trích xuất tháng, kết hợp COUNT và SUM có điều kiện CASE WHEN.',
    url: 'https://leetcode.com/problems/monthly-transactions-i/'
  },
  {
    id: 'sql-1174',
    leetcodeId: 1174,
    title: 'Immediate Food Delivery II',
    slug: 'immediate-food-delivery-ii',
    difficulty: 'Medium',
    category: 'Basic Aggregate Functions',
    summary: 'Tính phần trăm đơn hàng giao ngay (immediate) trong số các đơn hàng đầu tiên của tất cả khách hàng.',
    solutionSql: `SELECT 
    ROUND(AVG(CASE WHEN order_date = customer_pref_delivery_date THEN 100.0 ELSE 0.0 END), 2) AS immediate_percentage 
FROM Delivery 
WHERE (customer_id, order_date) IN (
    SELECT customer_id, MIN(order_date) 
    FROM Delivery 
    GROUP BY customer_id
);`,
    explanation: 'Subquery lấy đơn hàng đầu tiên (MIN(order_date)) của từng khách hàng, sau đó so sánh order_date == customer_pref_delivery_date.',
    url: 'https://leetcode.com/problems/immediate-food-delivery-ii/'
  },
  {
    id: 'sql-550',
    leetcodeId: 550,
    title: 'Game Play Analysis IV',
    slug: 'game-play-analysis-iv',
    difficulty: 'Medium',
    category: 'Basic Aggregate Functions',
    summary: 'Tính tỉ lệ người chơi đăng nhập lại vào ngày ngay sau ngày đăng nhập đầu tiên.',
    solutionSql: `SELECT 
    ROUND(COUNT(DISTINCT a.player_id)::numeric / (SELECT COUNT(DISTINCT player_id) FROM Activity), 2) AS fraction 
FROM Activity a 
INNER JOIN (
    SELECT player_id, MIN(event_date) AS first_login 
    FROM Activity 
    GROUP BY player_id
) first_log 
  ON a.player_id = first_log.player_id 
 AND a.event_date = first_log.first_login + INTERVAL '1 day';`,
    explanation: 'Tìm ngày first_login của từng player, sau đó JOIN với Activity ở ngày first_login + 1 ngày và chia cho tổng số player.',
    url: 'https://leetcode.com/problems/game-play-analysis-iv/'
  },
  {
    id: 'sql-2356',
    leetcodeId: 2356,
    title: 'Number of Unique Subjects Taught by Each Teacher',
    slug: 'number-of-unique-subjects-taught-by-each-teacher',
    difficulty: 'Easy',
    category: 'Sorting and Grouping',
    summary: 'Đếm số môn học phân biệt (distinct) mà mỗi giáo viên phụ trách.',
    solutionSql: `SELECT teacher_id, COUNT(DISTINCT subject_id) AS cnt 
FROM Teacher 
GROUP BY teacher_id;`,
    explanation: 'COUNT(DISTINCT subject_id) loại bỏ trùng lặp nếu giáo viên dạy cùng 1 môn ở nhiều phòng ban khác nhau.',
    url: 'https://leetcode.com/problems/number-of-unique-subjects-taught-by-each-teacher/'
  },
  {
    id: 'sql-1141',
    leetcodeId: 1141,
    title: 'User Activity for the Past 30 Days I',
    slug: 'user-activity-for-the-past-30-days-i',
    difficulty: 'Easy',
    category: 'Sorting and Grouping',
    summary: 'Đếm số người dùng hoạt động mỗi ngày trong khoảng 30 ngày kết thúc vào 2019-07-27.',
    solutionSql: `SELECT activity_date AS day, COUNT(DISTINCT user_id) AS active_users 
FROM Activity 
WHERE activity_date BETWEEN '2019-06-28' AND '2019-07-27' 
GROUP BY activity_date;`,
    explanation: 'Lọc khoảng thời gian 30 ngày bằng BETWEEN và đếm COUNT(DISTINCT user_id) theo từng ngày.',
    url: 'https://leetcode.com/problems/user-activity-for-the-past-30-days-i/'
  },
  {
    id: 'sql-1070',
    leetcodeId: 1070,
    title: 'Product Sales Analysis III',
    slug: 'product-sales-analysis-iii',
    difficulty: 'Medium',
    category: 'Sorting and Grouping',
    summary: 'Lấy thông tin bán hàng trong năm đầu tiên mở bán của từng sản phẩm.',
    solutionSql: `SELECT product_id, year AS first_year, quantity, price 
FROM Sales 
WHERE (product_id, year) IN (
    SELECT product_id, MIN(year) 
    FROM Sales 
    GROUP BY product_id
);`,
    explanation: 'Dùng cặp khóa (product_id, year) IN (SELECT product_id, MIN(year) GROUP BY product_id) để lấy chính xác các dòng của năm đầu tiên.',
    url: 'https://leetcode.com/problems/product-sales-analysis-iii/'
  },
  {
    id: 'sql-596',
    leetcodeId: 596,
    title: 'Classes More Than 5 Students',
    slug: 'classes-more-than-5-students',
    difficulty: 'Easy',
    category: 'Sorting and Grouping',
    summary: 'Tìm các lớp học có ít nhất 5 sinh viên theo học.',
    solutionSql: `SELECT class 
FROM Courses 
GROUP BY class 
HAVING COUNT(student) >= 5;`,
    explanation: 'GROUP BY theo class và lọc bằng HAVING COUNT(student) >= 5.',
    url: 'https://leetcode.com/problems/classes-more-than-5-students/'
  },
  {
    id: 'sql-1729',
    leetcodeId: 1729,
    title: 'Find Followers Count',
    slug: 'find-followers-count',
    difficulty: 'Easy',
    category: 'Sorting and Grouping',
    summary: 'Đếm số lượng người theo dõi (followers) của từng user, sắp xếp theo user_id.',
    solutionSql: `SELECT user_id, COUNT(follower_id) AS followers_count 
FROM Followers 
GROUP BY user_id 
ORDER BY user_id ASC;`,
    explanation: 'GROUP BY user_id và đếm số lượng follower_id.',
    url: 'https://leetcode.com/problems/find-followers-count/'
  },
  {
    id: 'sql-619',
    leetcodeId: 619,
    title: 'Biggest Single Number',
    slug: 'biggest-single-number',
    difficulty: 'Easy',
    category: 'Sorting and Grouping',
    summary: 'Tìm số lớn nhất chỉ xuất hiện đúng 1 lần duy nhất trong bảng (nếu không có trả về null).',
    solutionSql: `SELECT MAX(num) AS num 
FROM (
    SELECT num 
    FROM MyNumbers 
    GROUP BY num 
    HAVING COUNT(num) = 1
) singles;`,
    explanation: 'Subquery lọc các số chỉ xuất hiện 1 lần qua HAVING COUNT(num) = 1, bọc ngoài bằng MAX() để tự động trả về NULL nếu danh sách rỗng.',
    url: 'https://leetcode.com/problems/biggest-single-number/'
  },
  {
    id: 'sql-1045',
    leetcodeId: 1045,
    title: 'Customers Who Bought All Products',
    slug: 'customers-who-bought-all-products',
    difficulty: 'Medium',
    category: 'Sorting and Grouping',
    summary: 'Tìm khách hàng đã mua toàn bộ các sản phẩm có trong danh mục Product.',
    solutionSql: `SELECT customer_id 
FROM Customer 
GROUP BY customer_id 
HAVING COUNT(DISTINCT product_key) = (SELECT COUNT(*) FROM Product);`,
    explanation: 'So sánh số sản phẩm phân biệt mà khách đã mua với tổng số sản phẩm trong bảng Product.',
    url: 'https://leetcode.com/problems/customers-who-bought-all-products/'
  },
  {
    id: 'sql-1731',
    leetcodeId: 1731,
    title: 'The Number of Employees Which Report to Each Employee',
    slug: 'the-number-of-employees-which-report-to-each-employee',
    difficulty: 'Easy',
    category: 'Advanced Select and Joins',
    summary: 'Tìm các quản lý, đếm số nhân viên dưới quyền và tính tuổi trung bình của họ.',
    solutionSql: `SELECT 
    m.employee_id, 
    m.name, 
    COUNT(e.employee_id) AS reports_count, 
    ROUND(AVG(e.age)) AS average_age 
FROM Employees m 
JOIN Employees e ON m.employee_id = e.reports_to 
GROUP BY m.employee_id, m.name 
ORDER BY m.employee_id;`,
    explanation: 'Self-join giữa Manager (m) và Subordinate (e), tính COUNT và AVG(e.age).',
    url: 'https://leetcode.com/problems/the-number-of-employees-which-report-to-each-employee/'
  },
  {
    id: 'sql-1789',
    leetcodeId: 1789,
    title: 'Primary Department for Each Employee',
    slug: 'primary-department-for-each-employee',
    difficulty: 'Easy',
    category: 'Advanced Select and Joins',
    summary: 'Tìm phòng ban chính của mỗi nhân viên (hoặc cờ primary_flag = "Y" hoặc là phòng ban duy nhất họ thuộc về).',
    solutionSql: `SELECT employee_id, department_id 
FROM Employee 
WHERE primary_flag = 'Y' 
   OR employee_id IN (
       SELECT employee_id 
       FROM Employee 
       GROUP BY employee_id 
       HAVING COUNT(department_id) = 1
   );`,
    explanation: 'Lấy những dòng có primary_flag = "Y" HOẶC những nhân viên chỉ thuộc về đúng 1 phòng ban duy nhất.',
    url: 'https://leetcode.com/problems/primary-department-for-each-employee/'
  },
  {
    id: 'sql-610',
    leetcodeId: 610,
    title: 'Triangle Judgement',
    slug: 'triangle-judgement',
    difficulty: 'Easy',
    category: 'Advanced Select and Joins',
    summary: 'Kiểm tra 3 đoạn thẳng x, y, z có thể tạo thành 1 tam giác hay không (Yes/No).',
    solutionSql: `SELECT x, y, z, 
    CASE 
        WHEN x + y > z AND x + z > y AND y + z > x THEN 'Yes' 
        ELSE 'No' 
    END AS triangle 
FROM Triangle;`,
    explanation: 'Áp dụng bất đẳng thức tam giác: tổng hai cạnh bất kỳ phải lớn hơn cạnh còn lại.',
    url: 'https://leetcode.com/problems/triangle-judgement/'
  },
  {
    id: 'sql-180',
    leetcodeId: 180,
    title: 'Consecutive Numbers',
    slug: 'consecutive-numbers',
    difficulty: 'Medium',
    category: 'Advanced Select and Joins',
    summary: 'Tìm tất cả các số xuất hiện liên tiếp ít nhất 3 lần trong bảng Logs.',
    solutionSql: `SELECT DISTINCT l1.num AS ConsecutiveNums 
FROM Logs l1 
JOIN Logs l2 ON l1.id = l2.id - 1 AND l1.num = l2.num 
JOIN Logs l3 ON l1.id = l3.id - 2 AND l1.num = l3.num;`,
    explanation: 'Self join 3 bảng Logs với id, id+1, id+2 và num bằng nhau, hoặc sử dụng Window Function LEAD/LAG.',
    url: 'https://leetcode.com/problems/consecutive-numbers/'
  },
  {
    id: 'sql-1164',
    leetcodeId: 1164,
    title: 'Product Price at a Given Date',
    slug: 'product-price-at-a-given-date',
    difficulty: 'Medium',
    category: 'Advanced Select and Joins',
    summary: 'Tìm giá của tất cả các sản phẩm vào ngày 2019-08-16 (nếu chưa đổi giá thì giá mặc định là 10).',
    solutionSql: `SELECT p.product_id, 
    COALESCE(latest.new_price, 10) AS price 
FROM (SELECT DISTINCT product_id FROM Products) p 
LEFT JOIN (
    SELECT product_id, new_price 
    FROM Products 
    WHERE (product_id, change_date) IN (
        SELECT product_id, MAX(change_date) 
        FROM Products 
        WHERE change_date <= '2019-08-16' 
        GROUP BY product_id
    )
) latest ON p.product_id = latest.product_id;`,
    explanation: 'Lấy lần đổi giá gần nhất (MAX(change_date) <= "2019-08-16"), nếu không có dùng COALESCE fallback về giá mặc định 10.',
    url: 'https://leetcode.com/problems/product-price-at-a-given-date/'
  },
  {
    id: 'sql-1204',
    leetcodeId: 1204,
    title: 'Last Person to Fit in the Bus',
    slug: 'last-person-to-fit-in-the-bus',
    difficulty: 'Medium',
    category: 'Advanced Select and Joins',
    summary: 'Tìm người cuối cùng có thể bước lên xe buýt mà tổng trọng lượng không vượt quá 1000 kg.',
    solutionSql: `SELECT person_name 
FROM (
    SELECT person_name, 
           SUM(weight) OVER (ORDER BY turn) AS running_weight 
    FROM Queue
) sub 
WHERE running_weight <= 1000 
ORDER BY running_weight DESC 
LIMIT 1;`,
    explanation: 'Sử dụng Window Function SUM(weight) OVER (ORDER BY turn) để tính tổng luỹ kế, sau đó lọc <= 1000 và lấy dòng cuối cùng (LIMIT 1).',
    url: 'https://leetcode.com/problems/last-person-to-fit-in-the-bus/'
  },
  {
    id: 'sql-1907',
    leetcodeId: 1907,
    title: 'Count Salary Categories',
    slug: 'count-salary-categories',
    difficulty: 'Medium',
    category: 'Advanced Select and Joins',
    summary: 'Đếm số tài khoản thuộc từng phân khúc lương: Low Salary, Average Salary, High Salary (kể cả nhóm có 0 tài khoản).',
    solutionSql: `SELECT 'Low Salary' AS category, COUNT(*) AS accounts_count FROM Accounts WHERE income < 20000 
UNION ALL 
SELECT 'Average Salary' AS category, COUNT(*) AS accounts_count FROM Accounts WHERE income BETWEEN 20000 AND 50000 
UNION ALL 
SELECT 'High Salary' AS category, COUNT(*) AS accounts_count FROM Accounts WHERE income > 50000;`,
    explanation: 'Dùng UNION ALL giữa 3 câu SELECT độc lập để đảm bảo cả 3 hạng mục luôn xuất hiện trong kết quả kể cả khi COUNT(*) = 0.',
    url: 'https://leetcode.com/problems/count-salary-categories/'
  },
  {
    id: 'sql-1978',
    leetcodeId: 1978,
    title: 'Employees Whose Manager Left the Company',
    slug: 'employees-whose-manager-left-the-company',
    difficulty: 'Easy',
    category: 'Subqueries',
    summary: 'Tìm nhân viên có lương < $30000 và người quản lý của họ đã rời công ty (không còn tồn tại trong bảng).',
    solutionSql: `SELECT employee_id 
FROM Employees 
WHERE salary < 30000 
  AND manager_id IS NOT NULL 
  AND manager_id NOT IN (SELECT employee_id FROM Employees) 
ORDER BY employee_id;`,
    explanation: 'Dùng NOT IN (SELECT employee_id FROM Employees) kết hợp kiểm tra manager_id IS NOT NULL để phát hiện quản lý không còn tồn tại.',
    url: 'https://leetcode.com/problems/employees-whose-manager-left-the-company/'
  },
  {
    id: 'sql-626',
    leetcodeId: 626,
    title: 'Exchange Seats',
    slug: 'exchange-seats',
    difficulty: 'Medium',
    category: 'Subqueries',
    summary: 'Đổi chỗ ngồi của hai sinh viên liền kề (1 với 2, 3 với 4). Nếu tổng số lẻ thì sinh viên cuối cùng giữ nguyên chỗ.',
    solutionSql: `SELECT 
    CASE 
        WHEN id % 2 = 1 AND id = (SELECT COUNT(*) FROM Seat) THEN id 
        WHEN id % 2 = 1 THEN id + 1 
        ELSE id - 1 
    END AS id, 
    student 
FROM Seat 
ORDER BY id ASC;`,
    explanation: 'Biến đổi id bằng CASE WHEN: số lẻ tăng 1 (trừ người cuối cùng khi tổng lẻ), số chẵn giảm 1, sau đó ORDER BY id ASC.',
    url: 'https://leetcode.com/problems/exchange-seats/'
  },
  {
    id: 'sql-1341',
    leetcodeId: 1341,
    title: 'Movie Rating',
    slug: 'movie-rating',
    difficulty: 'Medium',
    category: 'Subqueries',
    summary: 'Tìm người dùng đánh giá nhiều phim nhất và bộ phim có điểm trung bình cao nhất vào tháng 2/2020.',
    solutionSql: `(SELECT u.name AS results 
 FROM MovieRating mr 
 JOIN Users u ON mr.user_id = u.user_id 
 GROUP BY u.user_id, u.name 
 ORDER BY COUNT(mr.movie_id) DESC, u.name ASC 
 LIMIT 1) 
UNION ALL 
(SELECT m.title AS results 
 FROM MovieRating mr 
 JOIN Movies m ON mr.movie_id = m.movie_id 
 WHERE TO_CHAR(mr.created_at, 'YYYY-MM') = '2020-02' 
 GROUP BY m.movie_id, m.title 
 ORDER BY AVG(mr.rating) DESC, m.title ASC 
 LIMIT 1);`,
    explanation: 'Ghép 2 truy vấn con bằng UNION ALL, mỗi truy vấn ORDER BY và LIMIT 1.',
    url: 'https://leetcode.com/problems/movie-rating/'
  },
  {
    id: 'sql-1321',
    leetcodeId: 1321,
    title: 'Restaurant Growth',
    slug: 'restaurant-growth',
    difficulty: 'Medium',
    category: 'Subqueries',
    summary: 'Tính tổng doanh thu và trung bình cộng di động trong 7 ngày liên tiếp (Moving Average).',
    solutionSql: `WITH DailySales AS (
    SELECT visited_on, SUM(amount) AS daily_amount 
    FROM Customer 
    GROUP BY visited_on
)
SELECT 
    d1.visited_on, 
    SUM(d2.daily_amount) AS amount, 
    ROUND(AVG(d2.daily_amount), 2) AS average_amount 
FROM DailySales d1 
JOIN DailySales d2 
  ON d2.visited_on BETWEEN d1.visited_on - INTERVAL '6 day' AND d1.visited_on 
GROUP BY d1.visited_on 
HAVING COUNT(d2.visited_on) = 7 
ORDER BY d1.visited_on;`,
    explanation: 'Gom nhóm doanh thu theo ngày trước qua CTE DailySales, sau đó Self Join khoảng 7 ngày liên tiếp và kiểm tra HAVING COUNT = 7.',
    url: 'https://leetcode.com/problems/restaurant-growth/'
  },
  {
    id: 'sql-602',
    leetcodeId: 602,
    title: 'Friend Requests II: Who Has the Most Friends',
    slug: 'friend-requests-ii-who-has-the-most-friends',
    difficulty: 'Medium',
    category: 'Subqueries',
    summary: 'Tìm người có tổng số bạn bè nhiều nhất (cả gửi lời mời và nhận lời mời).',
    solutionSql: `WITH AllFriendships AS (
    SELECT requester_id AS id FROM RequestAccepted 
    UNION ALL 
    SELECT accepter_id AS id FROM RequestAccepted
)
SELECT id, COUNT(*) AS num 
FROM AllFriendships 
GROUP BY id 
ORDER BY num DESC 
LIMIT 1;`,
    explanation: 'Gộp requester_id và accepter_id bằng UNION ALL, sau đó GROUP BY id, đếm COUNT(*) và lấy TOP 1.',
    url: 'https://leetcode.com/problems/friend-requests-ii-who-has-the-most-friends/'
  },
  {
    id: 'sql-585',
    leetcodeId: 585,
    title: 'Investments in 2016',
    slug: 'investments-in-2016',
    difficulty: 'Medium',
    category: 'Subqueries',
    summary: 'Tính tổng giá trị đầu tư tiv_2016 của các khách hàng có cùng giá trị tiv_2015 với ít nhất 1 người khác và toạ độ vị trí địa lý là độc nhất.',
    solutionSql: `SELECT ROUND(SUM(tiv_2016)::numeric, 2) AS tiv_2016 
FROM Insurance 
WHERE tiv_2015 IN (
    SELECT tiv_2015 
    FROM Insurance 
    GROUP BY tiv_2015 
    HAVING COUNT(*) > 1
) 
AND (lat, lon) IN (
    SELECT lat, lon 
    FROM Insurance 
    GROUP BY lat, lon 
    HAVING COUNT(*) = 1
);`,
    explanation: 'Sử dụng 2 subquery lọc: tiv_2015 xuất hiện > 1 lần VÀ cặp toạ độ (lat, lon) chỉ xuất hiện đúng 1 lần.',
    url: 'https://leetcode.com/problems/investments-in-2016/'
  },
  {
    id: 'sql-185',
    leetcodeId: 185,
    title: 'Department Top Three Salaries',
    slug: 'department-top-three-salaries',
    difficulty: 'Hard',
    category: 'Subqueries',
    summary: 'Tìm những nhân viên nhận mức lương nằm trong top 3 mức lương cao nhất của từng phòng ban.',
    solutionSql: `WITH RankedSalaries AS (
    SELECT 
        d.name AS Department, 
        e.name AS Employee, 
        e.salary AS Salary, 
        DENSE_RANK() OVER (PARTITION BY e.departmentId ORDER BY e.salary DESC) AS rnk 
    FROM Employee e 
    JOIN Department d ON e.departmentId = d.id
)
SELECT Department, Employee, Salary 
FROM RankedSalaries 
WHERE rnk <= 3;`,
    explanation: 'Bài toán kinh điển phỏng vấn: Dùng Window Function DENSE_RANK() OVER (PARTITION BY departmentId ORDER BY salary DESC). DENSE_RANK không bỏ qua thứ hạng khi có người cùng mức lương (ví dụ: rank 1, 2, 2, 3), sau đó lọc rnk <= 3.',
    url: 'https://leetcode.com/problems/department-top-three-salaries/'
  },
  {
    id: 'sql-1667',
    leetcodeId: 1667,
    title: 'Fix Names in a Table',
    slug: 'fix-names-in-a-table',
    difficulty: 'Easy',
    category: 'Advanced String / Regex / Clause',
    summary: 'Chuẩn hoá tên người dùng: Chữ cái đầu viết hoa, các chữ cái còn lại viết thường.',
    solutionSql: `SELECT 
    user_id, 
    CONCAT(UPPER(SUBSTRING(name, 1, 1)), LOWER(SUBSTRING(name, 2))) AS name 
FROM Users 
ORDER BY user_id;`,
    explanation: 'Kết hợp UPPER(SUBSTRING(name, 1, 1)) và LOWER(SUBSTRING(name, 2)) qua hàm CONCAT().',
    url: 'https://leetcode.com/problems/fix-names-in-a-table/'
  },
  {
    id: 'sql-1527',
    leetcodeId: 1527,
    title: 'Patients With a Condition',
    slug: 'patients-with-a-condition',
    difficulty: 'Easy',
    category: 'Advanced String / Regex / Clause',
    summary: 'Tìm bệnh nhân có mã bệnh bắt đầu bằng DIAB1 (có thể là từ đầu tiên hoặc từ phía sau dấu cách).',
    solutionSql: `SELECT patient_id, patient_name, conditions 
FROM Patients 
WHERE conditions LIKE 'DIAB1%' OR conditions LIKE '% DIAB1%';`,
    explanation: 'Lọc bằng LIKE: "DIAB1%" (ở vị trí đầu chuỗi) HOẶC "% DIAB1%" (ở vị trí sau khoảng trắng giữa các mã).',
    url: 'https://leetcode.com/problems/patients-with-a-condition/'
  },
  {
    id: 'sql-196',
    leetcodeId: 196,
    title: 'Delete Duplicate Emails',
    slug: 'delete-duplicate-emails',
    difficulty: 'Easy',
    category: 'Advanced String / Regex / Clause',
    summary: 'Xoá các email trùng lặp khỏi bảng Person, chỉ giữ lại bản ghi có ID nhỏ nhất.',
    solutionSql: `DELETE FROM Person p1 
USING Person p2 
WHERE p1.email = p2.email AND p1.id > p2.id;`,
    explanation: 'Self delete: Xoá dòng p1 nếu tồn tại dòng p2 có cùng email nhưng có id nhỏ hơn.',
    url: 'https://leetcode.com/problems/delete-duplicate-emails/'
  },
  {
    id: 'sql-176',
    leetcodeId: 176,
    title: 'Second Highest Salary',
    slug: 'second-highest-salary',
    difficulty: 'Medium',
    category: 'Advanced String / Regex / Clause',
    summary: 'Tìm mức lương cao thứ hai trong bảng Employee (nếu không có trả về null).',
    solutionSql: `SELECT (
    SELECT DISTINCT salary 
    FROM Employee 
    ORDER BY salary DESC 
    LIMIT 1 OFFSET 1
) AS SecondHighestSalary;`,
    explanation: 'Bọc câu SELECT DISTINCT salary ORDER BY salary DESC LIMIT 1 OFFSET 1 bên trong một subquery để tự động trả về NULL nếu bảng chỉ có 1 mức lương duy nhất.',
    url: 'https://leetcode.com/problems/second-highest-salary/'
  },
  {
    id: 'sql-1484',
    leetcodeId: 1484,
    title: 'Group Sold Products By The Date',
    slug: 'group-sold-products-by-the-date',
    difficulty: 'Easy',
    category: 'Advanced String / Regex / Clause',
    summary: 'Đếm số lượng và nối tên các sản phẩm bán được theo từng ngày, sắp xếp theo tên.',
    solutionSql: `SELECT 
    sell_date, 
    COUNT(DISTINCT product) AS num_sold, 
    STRING_AGG(DISTINCT product, ',' ORDER BY product) AS products 
FROM Activities 
GROUP BY sell_date 
ORDER BY sell_date;`,
    explanation: 'Sử dụng hàm gộp chuỗi STRING_AGG trong PostgreSQL (hoặc GROUP_CONCAT trong MySQL).',
    url: 'https://leetcode.com/problems/group-sold-products-by-the-date/'
  },
  {
    id: 'sql-1327',
    leetcodeId: 1327,
    title: 'List the Products Ordered in a Period',
    slug: 'list-the-products-ordered-in-a-period',
    difficulty: 'Easy',
    category: 'Advanced String / Regex / Clause',
    summary: 'Tìm các sản phẩm có tổng số lượng đặt mua >= 100 trong tháng 2/2020.',
    solutionSql: `SELECT p.product_name, SUM(o.unit) AS unit 
FROM Products p 
JOIN Orders o ON p.product_id = o.product_id 
WHERE TO_CHAR(o.order_date, 'YYYY-MM') = '2020-02' 
GROUP BY p.product_id, p.product_name 
HAVING SUM(o.unit) >= 100;`,
    explanation: 'Lọc tháng 2/2020 và gom nhóm tính tổng SUM(o.unit) >= 100 qua mệnh đề HAVING.',
    url: 'https://leetcode.com/problems/list-the-products-ordered-in-a-period/'
  },
  {
    id: 'sql-1517',
    leetcodeId: 1517,
    title: 'Find Users With Valid E-Mails',
    slug: 'find-users-with-valid-e-mails',
    difficulty: 'Easy',
    category: 'Advanced String / Regex / Clause',
    summary: 'Tìm người dùng có email hợp lệ theo định dạng domain @leetcode.com và tiền tố ký tự chuẩn.',
    solutionSql: `SELECT * 
FROM Users 
WHERE mail ~ '^[A-Za-z][A-Za-z0-9_.-]*@leetcode\\.com$';`,
    explanation: 'Sử dụng toán tử Regex ~ trong PostgreSQL (hoặc REGEXP trong MySQL) để kiểm tra tiền tố bắt đầu bằng chữ cái và kết thúc chuẩn domain.',
    url: 'https://leetcode.com/problems/find-users-with-valid-e-mails/'
  }
];

export const SQL_STORAGE_KEY_PREFIX = 'sql_status_';
export function getSqlStatusKey(problemOrTopicId: string): string {
  return `${SQL_STORAGE_KEY_PREFIX}${problemOrTopicId}`;
}
