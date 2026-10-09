// ============================================================
// Core Java & OOP Comprehensive Learning Track Data
// 10 Topics chuẩn phỏng vấn & công việc thực tế với Citations
// Nguồn chính thống: Effective Java (Joshua Bloch), Java Concurrency in Practice (Brian Goetz),
// Dev.java (Oracle), và OpenJDK 21 Source Code.
// ============================================================

export type OopStatus = 'not-started' | 'in-progress' | 'done';

export interface OopCodeExample {
  title: string;
  code: string;
  explanation: string;
}

export interface OopKeyword {
  keyword: string;
  description: string;
}

export interface OopCitation {
  source: string;
  author: string;
  itemOrChapter: string;
  url?: string;
  keyTakeaway: string;
}

export interface OopPillar {
  id: string;
  order: number;
  category: 'OOP' | 'Advanced Design' | 'Collections' | 'Exceptions & Modern Java' | 'Concurrency';
  name: string;          // Tên tiếng Việt
  nameEn: string;        // Tên tiếng Anh
  tagline: string;       // Một câu mô tả ngắn
  color: string;         // Màu accent riêng của mỗi pillar
  colorLight: string;    // Màu nền nhạt
  description: string;  // Mô tả chi tiết
  citation?: OopCitation; // Trích dẫn nguồn chuẩn
  keywords: OopKeyword[];
  codeExamples: OopCodeExample[];
  exercises: string[];
  commonMistakes: string[];
  prerequisite?: string; // ID của pillar cần học trước
}

export const OOP_PILLARS: OopPillar[] = [
  {
    id: 'encapsulation',
    order: 1,
    category: 'OOP',
    name: 'Tính Đóng Gói',
    nameEn: 'Encapsulation',
    tagline: 'Ẩn dữ liệu bên trong, kiểm soát truy cập từ bên ngoài.',
    color: '#2d7d46',
    colorLight: '#f0faf4',
    citation: {
      source: 'Effective Java (3rd Edition)',
      author: 'Joshua Bloch',
      itemOrChapter: 'Item 15: Minimize the accessibility of classes and members',
      url: 'https://docs.oracle.com/javase/tutorial/java/javaOO/accesscontrol.html',
      keyTakeaway: 'Ẩn giấu chi tiết cài đặt (information hiding) giúp giảm coupling, tăng tốc độ phát triển và cho phép tối ưu hoá mà không ảnh hưởng client.'
    },
    description: `Encapsulation là cơ chế **bảo vệ dữ liệu** của đối tượng bằng cách ẩn đi các chi tiết triển khai bên trong và chỉ cho phép truy cập thông qua các phương thức được kiểm soát (getter/setter).

Đây là tính chất nền tảng nhất — bạn đã vô tình dùng nó mỗi khi khai báo field là private. Mục tiêu: ngăn code bên ngoài thay đổi trực tiếp dữ liệu nội bộ, tránh lỗi khó debug.`,
    keywords: [
      { keyword: 'private', description: 'Chỉ truy cập được trong cùng class' },
      { keyword: 'public', description: 'Truy cập từ bất kỳ đâu' },
      { keyword: 'protected', description: 'Truy cập trong cùng package + class con' },
      { keyword: 'package-private', description: 'Không có modifier — truy cập trong cùng package' },
      { keyword: 'getter / setter', description: 'Phương thức để đọc / ghi field private một cách kiểm soát' },
    ],
    codeExamples: [
      {
        title: 'Ví dụ cơ bản: BankAccount',
        code: `public class BankAccount {
    // private — không ai được đụng trực tiếp
    private double balance;
    private String owner;

    public BankAccount(String owner, double initialBalance) {
        this.owner = owner;
        // Validate ngay khi khởi tạo
        if (initialBalance < 0) throw new IllegalArgumentException("Balance cannot be negative");
        this.balance = initialBalance;
    }

    // Getter — chỉ đọc, không sửa
    public double getBalance() {
        return balance;
    }

    // Không có setter cho balance — chỉ sửa qua deposit/withdraw
    public void deposit(double amount) {
        if (amount <= 0) throw new IllegalArgumentException("Amount must be positive");
        balance += amount;
    }

    public boolean withdraw(double amount) {
        if (amount <= 0 || amount > balance) return false;
        balance -= amount;
        return true;
    }
}`,
        explanation: 'Lưu ý: KHÔNG có setBalance() — người dùng chỉ được deposit/withdraw, không thể set balance tùy tiện. Đây là sức mạnh của Encapsulation: kiểm soát nghiệp vụ qua phương thức.',
      },
      {
        title: 'Khi nào KHÔNG cần getter/setter?',
        code: `// Record đơn giản — dữ liệu không có logic nghiệp vụ
// Java 14+: dùng record thay cho class boilerplate
public record Point(int x, int y) {}

// Hoặc nếu class chỉ là "data bag" nội bộ trong package
// Có thể dùng package-private thay vì private + getter
class InternalConfig {
    int timeout = 30;    // package-private, OK nếu chỉ dùng nội bộ
    String host = "localhost";
}`,
        explanation: 'Không phải lúc nào cũng cần private + getter/setter. Nếu class là data holder thuần túy không có invariant cần bảo vệ, có thể đơn giản hóa.',
      },
    ],
    exercises: [
      'Tạo class Student với name, age, gpa. Đảm bảo gpa luôn trong [0.0, 4.0]. Nếu ai set gpa < 0 hoặc > 4.0 → throw IllegalArgumentException.',
      'Tạo class Temperature với field celsius (private). Cung cấp getter getCelsius(), getFahrenheit(), getKelvin(). Chỉ có setter setCelsius() — tự động tính các đơn vị còn lại.',
      'Giải thích tại sao String trong Java là immutable (không có setter) — đây cũng là một dạng Encapsulation cực đoan.',
    ],
    commonMistakes: [
      'Tạo getter/setter cho mọi field mà không suy nghĩ → vô nghĩa, như không có private vậy.',
      'Setter không validate dữ liệu → Encapsulation bị phá vỡ về mặt logic dù đúng về syntax.',
      'Return trực tiếp mutable object từ getter (ví dụ: return một List nội bộ) → caller có thể sửa nó từ bên ngoài.',
    ],
  },
  {
    id: 'inheritance',
    order: 2,
    category: 'OOP',
    name: 'Tính Kế Thừa',
    nameEn: 'Inheritance',
    tagline: 'Tái sử dụng code qua quan hệ "is-a" giữa lớp cha và lớp con.',
    color: '#1a5fa8',
    colorLight: '#f0f6ff',
    citation: {
      source: 'Effective Java (3rd Edition)',
      author: 'Joshua Bloch',
      itemOrChapter: 'Item 18: Favor composition over inheritance',
      url: 'https://docs.oracle.com/javase/tutorial/java/IandI/subclasses.html',
      keyTakeaway: 'Inheritance phá vỡ encapsulation nếu class cha thay đổi chi tiết triển khai. Chỉ dùng khi có quan hệ is-a thực sự, còn lại ưu tiên Composition.'
    },
    description: `Inheritance cho phép class con (subclass) **kế thừa** các field và method từ class cha (superclass), giúp tái sử dụng code và tạo ra hệ thống phân cấp có tổ chức.

Câu hỏi then chốt trước khi dùng inheritance: **"Lớp con có phải là (is-a) lớp cha không?"** — Ví dụ: Dog is-a Animal ✓, Car is-a Vehicle ✓. Nếu quan hệ là "has-a" (Car has-a Engine) → dùng Composition thay vì Inheritance.`,
    keywords: [
      { keyword: 'extends', description: 'Class con kế thừa từ class cha (Java chỉ cho extends 1 class)' },
      { keyword: 'super()', description: 'Gọi constructor của class cha từ class con' },
      { keyword: 'super.method()', description: 'Gọi phương thức class cha đã bị override' },
      { keyword: 'final class', description: 'Không cho phép kế thừa (vd: String, Integer)' },
      { keyword: 'protected', description: 'Cho phép class con truy cập field/method dù khác package' },
      { keyword: '@Override', description: 'Annotation báo rằng method này ghi đè method của class cha' },
    ],
    codeExamples: [
      {
        title: 'Ví dụ: Animal → Dog → GuideDog',
        code: `// Class cha (Superclass)
public class Animal {
    protected String name;
    protected int age;

    public Animal(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public void eat() {
        System.out.println(name + " is eating");
    }

    public String describe() {
        return name + " (age " + age + ")";
    }
}

// Class con (Subclass) — Dog IS-A Animal
public class Dog extends Animal {
    private String breed;

    public Dog(String name, int age, String breed) {
        super(name, age);  // BẮT BUỘC gọi super() trước
        this.breed = breed;
    }

    // Override phương thức của Animal
    @Override
    public String describe() {
        return super.describe() + ", breed: " + breed;
    }

    // Thêm method riêng của Dog
    public void bark() {
        System.out.println(name + " says: Woof!");
    }
}

// Kế thừa nhiều cấp (multilevel)
public class GuideDog extends Dog {
    private String owner;

    public GuideDog(String name, int age, String breed, String owner) {
        super(name, age, breed);  // gọi constructor của Dog
        this.owner = owner;
    }

    @Override
    public String describe() {
        return super.describe() + ", guides: " + owner;
    }
}`,
        explanation: 'Java chỉ hỗ trợ single inheritance (1 class chỉ extends 1 class cha). Khi tạo GuideDog, thứ tự gọi constructor là: GuideDog() → Dog() → Animal() → Object().',
      },
      {
        title: 'Composition vs Inheritance — khi nào dùng cái nào?',
        code: `// SAI: Car extends Engine? — Car is NOT an Engine
// Car HAS-A Engine → dùng Composition

// COMPOSITION (ưu tiên hơn)
public class Car {
    private Engine engine;  // has-a relationship
    private String model;

    public Car(String model, int horsepower) {
        this.model = model;
        this.engine = new Engine(horsepower);  // tạo Engine bên trong
    }

    public void start() {
        engine.start();  // delegation
    }
}

// INHERITANCE (dùng khi is-a rõ ràng)
public class ElectricCar extends Car {
    private int batteryLevel;

    // ElectricCar IS-A Car → OK
}`,
        explanation: 'Rule of thumb: ưu tiên Composition over Inheritance (một trong những nguyên tắc của Design Patterns). Inheritance tạo coupling chặt giữa class cha và con — thay đổi class cha có thể phá vỡ class con.',
      },
    ],
    exercises: [
      'Tạo hệ thống Shape → Circle, Rectangle, Triangle. Mỗi shape có getArea() và getPerimeter(). Shape có printInfo() dùng hai method trên.',
      'Tạo Employee → Manager → CEO. Manager có thêm List<Employee> directReports. CEO không override lương mà có bonus riêng.',
      'Tại sao String là final class? Thử tưởng tượng điều gì xảy ra nếu ai đó extends String và override equals().',
    ],
    commonMistakes: [
      'Dùng Inheritance chỉ để tái sử dụng code dù không có quan hệ is-a → nên dùng Composition.',
      'Không gọi super() ở dòng đầu tiên trong constructor con → compile error hoặc logic sai.',
      'Override method nhưng quên @Override → nếu signature sai thì thực ra là overloading, không phải overriding.',
      'Truy cập field private của class cha trực tiếp từ class con → không được, phải qua getter/setter (hoặc dùng protected).',
    ],
    prerequisite: 'encapsulation',
  },
  {
    id: 'polymorphism',
    order: 3,
    category: 'OOP',
    name: 'Tính Đa Hình',
    nameEn: 'Polymorphism',
    tagline: 'Cùng một tên, nhiều hành vi khác nhau tùy theo đối tượng thực sự.',
    color: '#7b2d8b',
    colorLight: '#fdf4ff',
    citation: {
      source: 'Effective Java (3rd Edition)',
      author: 'Joshua Bloch',
      itemOrChapter: 'Item 52: Use overloading judiciously',
      url: 'https://docs.oracle.com/en/java/javase/21/language/pattern-matching-instanceof.html',
      keyTakeaway: 'Lựa chọn method overloading được quyết định tĩnh lúc compile, trong khi overriding được quyết định động lúc runtime. Tránh overload các method có cùng số tham số dễ gây nhầm lẫn.'
    },
    description: `Polymorphism cho phép xử lý các đối tượng thuộc các class khác nhau thông qua cùng một interface. Có hai loại:

**1. Runtime Polymorphism (Dynamic Dispatch)** — Method được quyết định lúc chạy dựa trên class thực sự của đối tượng. Đây là tính chất mạnh nhất, đạt được qua @Override.

**2. Compile-time Polymorphism (Overloading)** — Nhiều method cùng tên nhưng khác tham số trong cùng class. JVM chọn đúng method lúc compile.`,
    keywords: [
      { keyword: '@Override', description: 'Runtime polymorphism — method được chọn lúc chạy' },
      { keyword: 'overloading', description: 'Compile-time polymorphism — method được chọn lúc compile' },
      { keyword: 'dynamic dispatch', description: 'Cơ chế JVM tìm đúng method tại runtime qua vtable' },
      { keyword: 'upcasting', description: 'Ép kiểu ngầm định: Animal a = new Dog() — an toàn 100%' },
      { keyword: 'downcasting', description: 'Ép kiểu tường minh: Dog d = (Dog) a — rủi ro ClassCastException' },
      { keyword: 'instanceof', description: 'Kiểm tra kiểu thực sự trước khi downcasting (Java 16+: pattern matching)' },
    ],
    codeExamples: [
      {
        title: 'Runtime Polymorphism: Thanh toán đa kênh',
        code: `// Interface chung
public interface PaymentMethod {
    void pay(double amount);
}

public class CreditCardPayment implements PaymentMethod {
    private String cardNumber;
    public CreditCardPayment(String cardNumber) { this.cardNumber = cardNumber; }

    @Override
    public void pay(double amount) {
        System.out.println("Paid $" + amount + " via Credit Card ending in " + cardNumber.substring(cardNumber.length() - 4));
    }
}

public class MomoPayment implements PaymentMethod {
    private String phoneNumber;
    public MomoPayment(String phoneNumber) { this.phoneNumber = phoneNumber; }

    @Override
    public void pay(double amount) {
        System.out.println("Paid $" + amount + " via MoMo account " + phoneNumber);
    }
}

// Code sử dụng — KHÔNG cần biết loại thanh toán cụ thể
public class CheckoutService {
    // Nhận interface — hoạt động với BẤT KỲ PaymentMethod nào
    public void processOrder(double total, PaymentMethod payment) {
        System.out.println("Processing order...");
        payment.pay(total);  // Runtime Polymorphism: gọi đúng method của class thực sự!
        System.out.println("Order completed.");
    }
}`,
        explanation: 'Nếu ngày mai thêm CryptoPayment, CheckoutService KHÔNG cần sửa một dòng code nào (tuân thủ Open/Closed Principle trong SOLID).',
      },
      {
        title: 'Java 16+ Pattern Matching for instanceof',
        code: `// Cách cũ: instanceof rồi cast thủ công (dễ lỗi)
public void handleOld(Object obj) {
    if (obj instanceof String) {
        String s = (String) obj; // phải cast lại
        System.out.println(s.toLowerCase());
    }
}

// Java 16+: Pattern Matching — tự động cast
public void handleModern(Object obj) {
    if (obj instanceof String s) {
        // s đã là String, dùng được luôn!
        System.out.println(s.toLowerCase());
    } else if (obj instanceof List<?> list && !list.isEmpty()) {
        System.out.println("List with " + list.size() + " items");
    }
}`,
        explanation: 'Pattern matching cho instanceof giúp code ngắn hơn và loại bỏ hoàn toàn rủi ro ClassCastException khi cast thủ công.',
      },
    ],
    exercises: [
      'Tạo interface NotificationSender với send(String message, String recipient). Implement EmailSender, SmsSender, SlackSender. Viết hàm notifyAll(List<NotificationSender> senders, String msg, String to).',
      'Giải thích kết quả của: Animal a = new Dog(); a.eat(); — điều gì xảy ra nếu Animal không có method eat() nhưng Dog có?',
      'Viết hàm tính tổng diện tích của List<Shape> mà không cần dùng instanceof (gợi ý: Shape có getArea()).',
    ],
    commonMistakes: [
      'Dùng if (obj instanceof Dog) ... else if (obj instanceof Cat) ... thay vì polymorphism → phá vỡ tính đa hình, khó mở rộng.',
      'Nhầm lẫn giữa Overriding (cùng signature, khác class) và Overloading (cùng tên, khác tham số, cùng hoặc khác class).',
      'Downcast bừa bãi mà không kiểm tra bằng instanceof → lỗi ClassCastException lúc runtime.',
    ],
    prerequisite: 'inheritance',
  },
  {
    id: 'abstraction',
    order: 4,
    category: 'OOP',
    name: 'Tính Trừu Tượng',
    nameEn: 'Abstraction',
    tagline: 'Chỉ hiển thị "làm cái gì", ẩn đi "làm như thế nào".',
    color: '#c46210',
    colorLight: '#fffbf5',
    citation: {
      source: 'Effective Java (3rd Edition)',
      author: 'Joshua Bloch',
      itemOrChapter: 'Item 20: Prefer interfaces to abstract classes',
      url: 'https://docs.oracle.com/javase/tutorial/java/IandI/abstract.html',
      keyTakeaway: 'Interface cho phép xây dựng các hệ thống không phân cấp cứng nhắc. Class có thể implements nhiều interface, hỗ trợ mixin và tiến hoá an toàn.'
    },
    description: `Abstraction là việc **tập trung vào những gì đối tượng làm** (giao diện bên ngoài) thay vì **cách nó làm** (chi tiết bên trong).

Java hỗ trợ Abstraction qua hai công cụ:
- **Abstract Class**: Lớp chưa hoàn thiện, có thể chứa cả abstract method (chưa có body) và concrete method (đã có body). Dùng khi các class con có bản chất chung sâu sắc.
- **Interface**: Hợp đồng hoàn toàn (trước Java 8), chỉ định nghĩa các method mà class triển khai phải có. Từ Java 8+ có thêm \`default\` và \`static\` method.`,
    keywords: [
      { keyword: 'abstract class', description: 'Class không thể tạo instance trực tiếp bằng new' },
      { keyword: 'abstract method', description: 'Method không có body ({}), bắt buộc class con phải override' },
      { keyword: 'interface', description: 'Hợp đồng định nghĩa các method — class implements' },
      { keyword: 'default method', description: 'Method có sẵn implementation trong interface (Java 8+)' },
      { keyword: 'static method', description: 'Method tiện ích trong interface, gọi qua InterfaceName.method()' },
      { keyword: 'implements', description: 'Từ khóa để class triển khai interface (có thể implements nhiều)' },
    ],
    codeExamples: [
      {
        title: 'Abstract Class: Template Method Pattern',
        code: `// Template Method Pattern: xương sống quy trình
public abstract class DataProcessor {
    // Template method — final để không ai override được thứ tự
    public final void process() {
        readData();
        processData();  // bước trừu tượng — mỗi con tự làm
        writeData();
    }

    protected void readData() {
        System.out.println("Reading raw data from source...");
    }

    // Abstract method: BẮT BUỘC subclass phải tự định nghĩa
    protected abstract void processData();

    protected void writeData() {
        System.out.println("Writing results...");
    }
}

public class CsvProcessor extends DataProcessor {
    @Override
    protected void processData() {
        System.out.println("Parsing CSV format...");
    }
}

public class JsonProcessor extends DataProcessor {
    @Override
    protected void processData() {
        System.out.println("Parsing JSON format...");
    }
}`,
        explanation: 'Template Method Pattern — abstract class định nghĩa khung (skeleton), subclass điền vào chỗ trống. Đây là cách abstraction tạo ra "plugin point".',
      },
      {
        title: 'Interface — Định nghĩa khả năng (Capability)',
        code: `public interface Printable {
    void print();
}

public interface Saveable {
    void save(String path);
    void load(String path);

    // default method — backward compatible
    default void backup() {
        save("backup_" + System.currentTimeMillis());
    }
}

// Một class có thể implements NHIỀU interface
public class Document implements Printable, Saveable, Comparable<Document> {
    private String content;

    @Override
    public void print() { System.out.println(content); }

    @Override
    public void save(String path) { /* write to file */ }

    @Override
    public void load(String path) { /* read from file */ }

    @Override
    public int compareTo(Document other) {
        return this.content.compareTo(other.content);
    }
}`,
        explanation: 'Interface cho phép "multiple inheritance of type" — một class có thể có nhiều khả năng khác nhau. Đây là cách Java giải quyết vấn đề diamond problem của multiple inheritance.',
      },
    ],
    exercises: [
      'Thiết kế abstract class Shape với abstract getArea(), getPerimeter() và concrete method describe() gọi 2 method trên. Implement cho Circle, Rectangle.',
      'Tạo interface PaymentProcessor với processPayment(double amount): boolean. Implement CreditCardProcessor, PayPalProcessor. Viết hàm checkout(PaymentProcessor p, double amount).',
      'Giải thích sự khác nhau giữa: abstract class Animal { abstract void sound(); } và interface Sound { void sound(); }. Khi nào dùng cái nào?',
    ],
    commonMistakes: [
      'Dùng abstract class khi chỉ cần interface — abstract class tạo coupling chặt hơn (kế thừa chỉ 1 class cha).',
      'Interface có quá nhiều method → vi phạm Interface Segregation Principle. Tách thành interface nhỏ hơn.',
      'Implements interface nhưng để method rỗng (empty body) → breaking the contract silently.',
      'Nhầm lẫn: abstract class có thể có constructor (dùng cho subclass gọi super()), interface thì không.',
    ],
    prerequisite: 'polymorphism',
  },
  {
    id: 'interface-vs-abstract',
    order: 5,
    category: 'Advanced Design',
    name: 'Interface vs Abstract Class & Contract',
    nameEn: 'Interface vs Abstract Class & Contract',
    tagline: 'Khi nào dùng Interface, khi nào dùng Abstract Class và bản chất hợp đồng thiết kế.',
    color: '#0e7490',
    colorLight: '#ecfeff',
    citation: {
      source: 'Effective Java (3rd Edition)',
      author: 'Joshua Bloch',
      itemOrChapter: 'Item 20: Prefer interfaces to abstract classes & Item 21: Design interfaces for posterity',
      url: 'https://dev.java/learn/interfaces/default-methods/',
      keyTakeaway: 'Interface định nghĩa capability ("can-do") và cho phép đa kế thừa kiểu. Abstract Class định nghĩa danh tính ("is-a") chia sẻ trạng thái nội bộ. Từ Java 8 default method, Interface có thể cung cấp hành vi mặc định nhưng không thể lưu trữ state.'
    },
    description: `Câu hỏi kinh điển số 1 trong các buổi phỏng vấn Java Core: **"So sánh Interface và Abstract Class?"**

- **Bản chất cốt lõi**:
  - **Interface**: Đại diện cho **Capability (Khả năng - CAN-DO)**. Ví dụ: \`Comparable\`, \`Serializable\`, \`AutoCloseable\`. Một class có thể thực hiện nhiều hành vi cùng lúc.
  - **Abstract Class**: Đại diện cho **Identity (Bản sắc - IS-A)**. Ví dụ: \`Animal\`, \`BaseEntity\`, \`AbstractList\`. Chia sẻ cấu trúc dữ liệu nội bộ (fields, constructors).

- **Từ Java 8 đến Java 21**:
  - Interface có \`default method\` và \`static method\` (Java 8), \`private method\` (Java 9).
  - Tuy nhiên: Interface **KHÔNG THỂ có state (instance variables)** và **KHÔNG CÓ constructor**. Tất cả biến trong interface mặc định là \`public static final\`.`,
    keywords: [
      { keyword: 'default method', description: 'Method có thân hàm trong Interface giúp mở rộng mà không làm hỏng class cũ' },
      { keyword: 'private method in interface', description: 'Tái sử dụng code giữa các default method nội bộ (Java 9+)' },
      { keyword: 'diamond problem', description: 'Xung đột khi 2 interface có cùng default method signature → bắt buộc override' },
      { keyword: 'skeletal implementation', description: 'Mẫu kết hợp Interface + Abstract Class (vd: List và AbstractList)' },
      { keyword: 'sealed interface/class', description: 'Giới hạn danh sách các class được phép kế thừa/triển khai (Java 17+)' },
    ],
    codeExamples: [
      {
        title: 'Mẫu Skeletal Implementation (Effective Java Item 20)',
        code: `// 1. Interface định nghĩa public API contract
public interface IntStack {
    void push(int val);
    int pop();
    int peek();
    boolean isEmpty();
    int size();
}

// 2. Abstract Class (Skeletal) hiện thực hoá các logic tiện ích chung
public abstract class AbstractIntStack implements IntStack {
    @Override
    public boolean isEmpty() {
        return size() == 0;
    }

    @Override
    public String toString() {
        return "Stack[size=" + size() + "]";
    }
}

// 3. Concrete Class chỉ cần cài đặt các phương thức đặc thù
public class ArrayIntStack extends AbstractIntStack {
    private int[] elements = new int[16];
    private int top = 0;

    @Override
    public void push(int val) {
        if (top == elements.length) elements = java.util.Arrays.copyOf(elements, top * 2);
        elements[top++] = val;
    }

    @Override
    public int pop() {
        if (isEmpty()) throw new java.util.NoSuchElementException();
        return elements[--top];
    }

    @Override
    public int peek() {
        if (isEmpty()) throw new java.util.NoSuchElementException();
        return elements[top - 1];
    }

    @Override
    public int size() {
        return top;
    }
}`,
        explanation: 'Đây là cách JDK xây dựng Collection Framework: Collection (Interface) → AbstractCollection (Skeletal) → ArrayList (Concrete). Khách hàng có thể implements interface trực tiếp hoặc extends abstract class để code nhanh hơn.',
      },
      {
        title: 'Giải quyết xung đột Default Method trong đa interface',
        code: `interface Walkable {
    default void move() { System.out.println("Walking..."); }
}

interface Runnable {
    default void move() { System.out.println("Running..."); }
}

// Bắt buộc phải Override vì Java không biết chọn move() của ai
public class Athlete implements Walkable, Runnable {
    @Override
    public void move() {
        // Tự chọn 1 trong 2 hoặc định nghĩa lại hoàn toàn
        Walkable.super.move(); // gọi cụ thể của Walkable
        System.out.println("Then speeding up!");
    }
}`,
        explanation: 'Quy tắc xung đột của Java: Class luôn thắng Interface. Nếu 2 interface ngang hàng có cùng method, class thực thi BẮT BUỘC phải override và tự quyết định.',
      },
    ],
    exercises: [
      'Giải thích tại sao Interface không được phép có constructor?',
      'Thiết kế kiến trúc Logger: Interface Logger có info(), warn(), error(). AbstractLogger cài đặt formatTimestamp(). FileLogger và ConsoleLogger ghi ra file/màn hình.',
      'Tìm hiểu Sealed Classes trong Java 17: Tại sao nó giúp kiểm soát thiết kế hướng đối tượng tốt hơn so với final/package-private thông thường?',
    ],
    commonMistakes: [
      'Nghĩ rằng Interface và Abstract Class giống hệt nhau sau khi có default method → Bỏ quên rằng Interface không thể chứa non-static field và constructor.',
      'Định nghĩa constant trong Interface để class con implements lấy biến dùng chung (Anti-pattern: Constant Interface). Nên dùng enum hoặc class tiện ích final private constructor.',
    ],
    prerequisite: 'abstraction',
  },
  {
    id: 'equals-and-hashcode',
    order: 6,
    category: 'Advanced Design',
    name: 'Hợp Đồng equals() & hashCode()',
    nameEn: 'equals() & hashCode() Contract',
    tagline: 'Quy tắc vàng so sánh đối tượng và chìa khoá vận hành của Hash Collections.',
    color: '#059669',
    colorLight: '#ecfdf5',
    citation: {
      source: 'Effective Java (3rd Edition)',
      author: 'Joshua Bloch',
      itemOrChapter: 'Item 10: Obey the general contract when overriding equals & Item 11: Always override hashCode when you override equals',
      url: 'https://docs.oracle.com/javase/tutorial/java/IandI/objectclass.html',
      keyTakeaway: 'Nếu hai đối tượng bằng nhau theo equals(), hashCode() của chúng BẮT BUỘC phải bằng nhau. Vi phạm quy tắc này sẽ làm hỏng hoàn toàn HashMap, HashSet và HashTable.'
    },
    description: `Trong Java, mọi class đều kế thừa từ \`java.lang.Object\`. Mặc định của \`Object\`:
- \`equals(Object o)\`: So sánh địa chỉ ô nhớ (\`==\`).
- \`hashCode()\`: Trả về số nguyên sinh ra từ địa chỉ ô nhớ.

Khi bạn muốn hai đối tượng có cùng thuộc tính được coi là bằng nhau (Logical Equality - ví dụ: 2 tài khoản cùng \`id\` hoặc cùng \`email\`), bạn **bắt buộc phải override cả 2 phương thức**.

**Hợp đồng (Contract) 4 điều kiện của equals()**:
1. **Phản xạ (Reflexive)**: \`x.equals(x) == true\`.
2. **Đối xứng (Symmetric)**: \`x.equals(y) == true\` thì \`y.equals(x) == true\`.
3. **Bắc cầu (Transitive)**: \`x.equals(y) == true\` và \`y.equals(z) == true\` thì \`x.equals(z) == true\`.
4. **Nhất quán (Consistent)**: Không thay đổi nếu thuộc tính không đổi.
5. So sánh với \`null\` luôn trả về \`false\` (\`x.equals(null) == false\`).`,
    keywords: [
      { keyword: 'logical equality', description: 'Bằng nhau về mặt giá trị/nghiệp vụ (khác với reference equality ==)' },
      { keyword: 'Objects.hash(...)', description: 'Hàm tiện ích chuẩn trong java.util.Objects sinh hash code an toàn' },
      { keyword: 'hash bucket collision', description: 'Nhiều đối tượng khác nhau nhưng có cùng hashCode() rơi vào cùng 1 bucket' },
      { keyword: 'identityHashCode', description: 'Hàm lấy hashCode gốc của Object dựa trên memory address' },
    ],
    codeExamples: [
      {
        title: 'Cài đặt chuẩn mực equals & hashCode theo Joshua Bloch',
        code: `import java.util.Objects;

public final class User {
    private final long id;
    private final String email;
    private final String name;

    public User(long id, String email, String name) {
        this.id = id;
        this.email = email;
        this.name = name;
    }

    @Override
    public boolean equals(Object o) {
        // 1. Kiểm tra chính bản thân (tối ưu tốc độ)
        if (this == o) return true;

        // 2. Kiểm tra null và so sánh chính xác class (tránh lỗi kế thừa)
        if (o == null || getClass() != o.getClass()) return false;

        // 3. Ép kiểu an toàn
        User user = (User) o;

        // 4. So sánh các trường nghiệp vụ định danh (significant fields)
        return id == user.id && Objects.equals(email, user.email);
    }

    @Override
    public int hashCode() {
        // Bắt buộc dùng cùng các trường đã dùng trong equals()
        return Objects.hash(id, email);
    }
}`,
        explanation: 'Quy tắc: Những trường nào xuất hiện trong equals() thì PHẢI xuất hiện trong hashCode(). Dùng Objects.equals() giúp an toàn với trường có giá trị null.',
      },
      {
        title: 'Hậu quả tai hại khi quên override hashCode()',
        code: `import java.util.HashMap;
import java.util.Map;

class BrokenUser {
    String id;
    BrokenUser(String id) { this.id = id; }
    // Chỉ override equals mà KHÔNG override hashCode!
    @Override public boolean equals(Object o) {
        return (o instanceof BrokenUser other) && this.id.equals(other.id);
    }
}

public class Main {
    public static void main(String[] args) {
        Map<BrokenUser, String> map = new HashMap<>();
        BrokenUser u1 = new BrokenUser("LEVI_01");
        map.put(u1, "VIP User");

        // u2 có cùng nội dung id với u1 -> equals() trả về true!
        BrokenUser u2 = new BrokenUser("LEVI_01");
        System.out.println("u1.equals(u2): " + u1.equals(u2)); // true

        // NHƯNG khi get bằng u2:
        System.out.println("Value in map: " + map.get(u2)); // NULL! Thất bại!
    }
}`,
        explanation: 'Giải thích: Vì u1 và u2 có hashCode() khác nhau (do lấy mặc định từ Object), HashMap tìm u2 ở sai bucket và kết luận không có phần tử, dẫn đến trả về null dù 2 object bằng nhau về equals().',
      },
    ],
    exercises: [
      'Giải thích tại sao trong equals() nên dùng `getClass() != o.getClass()` thay vì `o instanceof User` khi class có khả năng bị kế thừa?',
      'Tại sao các trường làm key trong HashMap nên là immutable (ví dụ: final String, final Long)? Điều gì xảy ra nếu sửa thuộc tính của key sau khi đã put vào HashMap?',
      'Thử dùng Java 14 record (vd: record User(long id, String email) {}). Tại sao record tự động sinh equals và hashCode hoàn hảo?',
    ],
    commonMistakes: [
      'Chỉ override equals() mà quên hashCode() → làm hỏng toàn bộ HashSet và HashMap.',
      'Dùng tham số sai kiểu: public boolean equals(User o) thay vì equals(Object o) → đây là Overloading chứ KHÔNG phải Overriding!',
      'Đưa các trường ngẫu nhiên, timestamp hoặc mutable state vào hashCode() dẫn đến giá trị băm bị thay đổi liên tục.',
    ],
    prerequisite: 'interface-vs-abstract',
  },
  {
    id: 'generics',
    order: 7,
    category: 'Advanced Design',
    name: 'Java Generics & Type Erasure',
    nameEn: 'Java Generics & Type Erasure',
    tagline: 'An toàn kiểu dữ liệu lúc compile, cơ chế Type Erasure và nguyên lý PECS.',
    color: '#4f46e5',
    colorLight: '#eef2ff',
    citation: {
      source: 'Effective Java (3rd Edition)',
      author: 'Joshua Bloch',
      itemOrChapter: 'Item 26: Don\'t use raw types & Item 31: Use bounded wildcards to increase API flexibility (PECS)',
      url: 'https://dev.java/learn/generics/wildcards/',
      keyTakeaway: 'Nguyên lý PECS: Producer Extends, Consumer Super. Wildcard ? extends T dùng khi bạn chỉ đọc dữ liệu từ collection. Wildcard ? super T dùng khi bạn ghi dữ liệu vào collection.'
    },
    description: `Java Generics (ra mắt từ Java 5) mang lại **Compile-time Type Safety** (bắt lỗi kiểu dữ liệu ngay khi biên dịch thay vì đợi ném \`ClassCastException\` lúc chạy).

**1. Type Erasure (Xoá kiểu khi biên dịch)**:
Để đảm bảo tương thích ngược (Backward Compatibility) với các phiên bản Java 1.4 cũ hơn, JVM không lưu trữ kiểu Generic lúc runtime. Trình biên dịch sẽ xoá thông tin kiểu (thay \`T\` bằng \`Object\` hoặc Bound trên cùng của nó) và chèn các phép ép kiểu tự động (implicit casting).
Hệ quả: Bạn không thể viết \`new T()\`, không thể tạo \`new T[10]\`, và không thể dùng \`instanceof List<String>\`.

**2. Nguyên tắc PECS (Producer Extends, Consumer Super)**:
- \`List<? extends Number>\`: Producer (chỉ lấy ra đọc), chứa các phần tử con của Number. Không được phép thêm phần tử mới (trừ \`null\`).
- \`List<? super Integer>\`: Consumer (ghi nhận vào), chứa kiểu cha của Integer. Cho phép thêm \`Integer\` vào danh sách an toàn.`,
    keywords: [
      { keyword: 'Type Erasure', description: 'Cơ chế xoá bỏ tham số generic tại thời điểm biên dịch thành Object' },
      { keyword: 'PECS Rule', description: 'Producer Extends, Consumer Super — quy tắc thiết kế API generic linh hoạt' },
      { keyword: 'Raw Types', description: 'Dùng List thay vì List<T> — nguy hiểm, mất tính an toàn kiểu' },
      { keyword: 'Bounded Type Parameter', description: '<T extends Comparable<T>> giới hạn kiểu thoả mãn điều kiện' },
      { keyword: 'Covariance vs Invariance', description: 'Mảng là covariant (String[] is Object[]), Generic là invariant (List<String> is NOT List<Object>)' },
    ],
    codeExamples: [
      {
        title: 'Ứng dụng nguyên lý PECS trong thiết kế API',
        code: `import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

public class GenericsDemo {
    // PRODUCER EXTENDS: src đóng vai trò cung cấp dữ liệu -> dùng ? extends E
    // CONSUMER SUPER: dest đóng vai trò nhận dữ liệu ghi vào -> dùng ? super E
    public static <E> void copy(List<? extends E> src, List<? super E> dest) {
        for (E item : src) {
            dest.add(item); // Hoàn toàn hợp lệ!
        }
    }

    public static void main(String[] args) {
        List<Integer> integers = List.of(1, 2, 3);
        List<Number> numbers = new ArrayList<>();

        // Copy từ List<Integer> sang List<Number> hoàn toàn mượt mà nhờ PECS
        copy(integers, numbers);
        System.out.println(numbers); // [1, 2, 3]
    }
}`,
        explanation: 'Nếu viết public static <E> void copy(List<E> src, List<E> dest) thì hàm sẽ báo lỗi biên dịch vì List<Integer> không phải là List<Number> (Generics là invariant).',
      },
      {
        title: 'Generic Repository Pattern mẫu',
        code: `public interface BaseRepository<T, ID> {
    T findById(ID id);
    List<T> findAll();
    T save(T entity);
    void deleteById(ID id);
}

// Bounded Type: T phải có getId() thông qua interface Entity
public interface Identifiable<ID> {
    ID getId();
}

public class MemoryRepository<T extends Identifiable<ID>, ID> implements BaseRepository<T, ID> {
    private final java.util.Map<ID, T> storage = new java.util.concurrent.ConcurrentHashMap<>();

    @Override
    public T save(T entity) {
        storage.put(entity.getId(), entity);
        return entity;
    }

    @Override
    public T findById(ID id) {
        return storage.get(id);
    }

    @Override
    public List<T> findAll() {
        return new ArrayList<>(storage.values());
    }

    @Override
    public void deleteById(ID id) {
        storage.remove(id);
    }
}`,
        explanation: 'Spring Data JPA sử dụng triết lý này: JpaRepository<User, Long> kế thừa CrudRepository<T, ID>.',
      },
    ],
    exercises: [
      'Giải thích tại sao mã nguồn List<String> và List<Integer> khi gọi getClass() lúc runtime đều trả về java.util.ArrayList.class?',
      'Viết hàm generic max(List<T> list) trả về phần tử lớn nhất với ràng buộc <T extends Comparable<T>>.',
      'Tại sao không thể khởi tạo trực tiếp: T item = new T(); hoặc T[] array = new T[10];? Nêu cách giải quyết (truyền Class<T> clazz).',
    ],
    commonMistakes: [
      'Dùng raw type: List list = new ArrayList(); → mất kiểm tra kiểu, dễ crash ClassCastException.',
      'Nhầm lẫn mảng và Generic: Mảng hỗ trợ Covariant nhưng ném ArrayStoreException lúc chạy, Generic là Invariant an toàn lúc compile.',
      'Cố gắng thêm phần tử vào List<? extends Number> list.add(10) → Compile error vì compiler không thể biết kiểu chính xác lúc chạy.',
    ],
    prerequisite: 'equals-and-hashcode',
  },
  {
    id: 'collections-internals',
    order: 8,
    category: 'Collections',
    name: 'Collections Internals (HashMap & List Deep Dive)',
    nameEn: 'Collections Internals Deep Dive',
    tagline: 'Mổ xẻ cơ chế mảng bucket, Treeify, Rehashing của HashMap và so sánh cấu trúc dữ liệu.',
    color: '#b91c1c',
    colorLight: '#fef2f2',
    citation: {
      source: 'OpenJDK 21 Source Code & Baeldung',
      author: 'OpenJDK java.util.HashMap / Baeldung Deep Dive',
      itemOrChapter: 'java.util.HashMap.java (Node<K,V>[] table, TREEIFY_THRESHOLD = 8)',
      url: 'https://github.com/openjdk/jdk/blob/master/src/java.base/share/classes/java/util/HashMap.java#L206',
      keyTakeaway: 'HashMap trong Java 8+ sử dụng mảng bucket kết hợp Singly Linked List và Red-Black Tree. Khi số node trong 1 bucket đạt ngưỡng >= 8 và dung lượng mảng >= 64, bucket sẽ được Treeify thành cây Đỏ-Đen để bảo toàn độ phức tạp O(log N).'
    },
    description: `Collections Framework là trọng tâm bắt buộc của mọi bài phỏng vấn Java Backend.

**1. Cơ chế nội tại của HashMap (Bắt buộc phải thuộc)**:
- **Cấu trúc dữ liệu**: Mảng \`Node<K,V>[] table\` (kích thước mặc định ban đầu \`DEFAULT_INITIAL_CAPACITY = 16\`).
- **Cách tính vị trí bucket**:
  - \`hash = (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16)\` (Kỹ thuật XOR tán nhuyễn bít).
  - \`index = (table.length - 1) & hash\` (Nhanh hơn phép chia lấy dư \`%\` rất nhiều vì dung lượng luôn là luỹ thừa của 2).
- **Xử lý va chạm (Hash Collision)**:
  - Ban đầu va chạm liên kết thành **Singly Linked List** (\`O(N)\` trong trường hợp tệ nhất).
  - **Treeify Threshold**: Khi số phần tử trong 1 bucket **>= 8** VÀ tổng capacity mảng **>= 64**, danh sách liên kết được chuyển thành **Red-Black Tree** (\`TreeNode<K,V>\`), giảm độ phức tạp từ \`O(N)\` xuống **\`O(log N)\`**.
  - **Untreeify**: Khi số phần tử trong cây giảm xuống **<= 6**, nó tự động chuyển ngược lại thành Linked List.
- **Tải trọng và Resize (Rehashing)**:
  - \`DEFAULT_LOAD_FACTOR = 0.75\`.
  - Khi \`size > capacity * 0.75\` (vd: 16 * 0.75 = 12), HashMap tạo mảng mới gấp đôi (\`newCap = oldCap << 1\`) và thực hiện Rehashing.

**2. So sánh các Collections cốt lõi**:
- \`ArrayList\` (Mảng động, mảng liên tục, truy cập \`O(1)\`, thêm cuối \`O(1) amortized\`, resize 1.5x) vs \`LinkedList\` (Danh sách liên kết đôi, tốn bộ nhớ con trỏ, chèn đầu/cuối \`O(1)\`, truy cập theo index \`O(N)\`).
- \`HashSet\`: Thực chất bên trong là một \`HashMap\` với key là phần tử và value là một \`PRESENT\` dummy object.
- \`TreeMap\`: Dựa trên **Red-Black Tree**, các phần tử luôn được sắp xếp theo \`Comparable\` hoặc \`Comparator\`, truy cập \`O(log N)\`.`,
    keywords: [
      { keyword: 'bucket array', description: 'Mảng Node<K,V>[] bên trong HashMap' },
      { keyword: 'TREEIFY_THRESHOLD = 8', description: 'Ngưỡng chuyển danh sách liên kết thành Red-Black Tree' },
      { keyword: 'loadFactor = 0.75', description: 'Tỉ lệ cân bằng tối ưu giữa bộ nhớ và thời gian tra cứu' },
      { keyword: 'bitwise AND index calculation', description: '(n - 1) & hash thay thế phép toán modulo' },
      { keyword: 'ConcurrentHashMap', description: 'Bản nâng cấp thread-safe dùng CAS + synchronized trên từng bucket' },
    ],
    codeExamples: [
      {
        title: 'Mô phỏng cơ chế băm và tính index của HashMap',
        code: `public class HashMapInternalsSimulation {
    public static void main(String[] args) {
        String key = "JAVA_BACKEND";
        int capacity = 16; // 2^4

        // 1. Lấy hashCode gốc
        int h = key.hashCode();

        // 2. Perturbation function: trộn bít cao xuống bít thấp
        int hash = h ^ (h >>> 16);

        // 3. Tính index trong mảng table
        int index = (capacity - 1) & hash;

        System.out.println("Key: " + key);
        System.out.println("HashCode: " + h);
        System.out.println("Tán nhuyễn hash: " + hash);
        System.out.println("Index bucket: " + index + " (trong dải 0-" + (capacity - 1) + ")");
    }
}`,
        explanation: 'Nhờ dung lượng luôn là luỹ thừa của 2 (16, 32, 64), phép toán (capacity - 1) & hash hoạt động tương đương phép chia lấy dư nhưng tốc độ xử lý nhanh hơn hàng chục lần ở cấp độ CPU.',
      },
      {
        title: 'Cách khởi tạo dung lượng tối ưu cho HashMap để tránh Resize',
        code: `// SAI: Tạo mặc định khi biết trước có 1,000 phần tử
Map<String, User> badMap = new java.util.HashMap<>();
// Sẽ phải resize 7 lần: 16 -> 32 -> 64 -> 128 -> 256 -> 512 -> 1024 -> 2048! Tốn tài nguyên!

// ĐÚNG: Khởi tạo với initialCapacity tính theo công thức: expectedSize / 0.75 + 1
int expectedCount = 1000;
int initialCapacity = (int) Math.ceil(expectedCount / 0.75f);
Map<String, User> goodMap = new java.util.HashMap<>(initialCapacity);
// HashMap KHÔNG BAO GIỜ bị resize trong suốt vòng đời nạp 1,000 phần tử!`,
        explanation: 'Đây là câu hỏi phỏng vấn tối ưu hoá hiệu năng bộ nhớ: Khi biết trước số lượng bản ghi, luôn chỉ định initial capacity = size / 0.75f + 1.',
      },
    ],
    exercises: [
      'Tại sao Java 8 lại chọn ngưỡng TREEIFY_THRESHOLD = 8 và UNTREEIFY_THRESHOLD = 6 mà không phải là 7?',
      'Tại sao HashMap không thread-safe? Điều gì xảy ra nếu 2 thread cùng put() vào HashMap cùng lúc trong Java 7 (Infinite Loop) và Java 8 (Data Loss)?',
      'So sánh điểm khác nhau giữa HashMap và ConcurrentHashMap (Cách ConcurrentHashMap dùng CAS và khoá phân tán Node lock thay cho Collections.synchronizedMap).',
    ],
    commonMistakes: [
      'Nghĩ rằng LinkedList luôn nhanh hơn ArrayList khi thêm/xóa phần tử. Thực tế LinkedList phải duyệt O(N) tìm vị trí trước khi xóa, và tốn cache-miss CPU.',
      'Sử dụng mutable key trong HashMap và thay đổi giá trị thuộc tính khiến không thể tra cứu lại phần tử.',
    ],
    prerequisite: 'generics',
  },
  {
    id: 'exceptions-and-modern-java',
    order: 9,
    category: 'Exceptions & Modern Java',
    name: 'Exceptions & Modern Java (Stream API & Optional)',
    nameEn: 'Exceptions & Modern Java Features',
    tagline: 'Xử lý ngoại lệ chuẩn mực, Stream API, Lambda và xoá sổ NullPointerException với Optional.',
    color: '#0891b2',
    colorLight: '#ecfeff',
    citation: {
      source: 'Dev.java (Oracle) & Effective Java',
      author: 'Oracle Java 21 Documentation / Joshua Bloch',
      itemOrChapter: 'Item 55: Return optionals judiciously & Item 45: Use streams judiciously',
      url: 'https://dev.java/learn/api/streams/intermediate-operation/',
      keyTakeaway: 'Checked Exception chỉ dùng khi người gọi có thể khắc phục được lỗi. Try-with-resources là bắt buộc để giải phóng tài nguyên. Stream API mang phong cách lập trình hàm (functional) giúp code ngắn gọn và dễ bảo trì.'
    },
    description: `**1. Hệ thống phân cấp ngoại lệ (Exception Hierarchy)**:
- \`Throwable\` là gốc:
  - \`Error\` (vd: \`OutOfMemoryError\`, \`StackOverflowError\`): Sự cố nghiêm trọng của JVM, ứng dụng không nên cố gắng catch.
  - \`Exception\`:
    - **Checked Exception** (kế thừa \`Exception\` trừ \`RuntimeException\` - vd: \`IOException\`, \`SQLException\`): Trình biên dịch bắt buộc phải có \`try-catch\` hoặc khai báo \`throws\`.
    - **Unchecked Exception** (kế thừa \`RuntimeException\` - vd: \`NullPointerException\`, \`IllegalArgumentException\`): Lỗi do lập trình viên, không bắt buộc khai báo.
- **\`try-with-resources\`**: Tự động đóng các tài nguyên mở (file, connection, stream) cài đặt interface \`AutoCloseable\`.

**2. Modern Java (Stream API & Optional)**:
- **Stream API**: Xử lý tập hợp dữ liệu theo phong cách Declarative (Khai báo). Gồm 3 giai đoạn:
  1. *Khởi tạo* (\`collection.stream()\`).
  2. *Thao tác trung gian (Intermediate Operations - Lazy Evaluation)*: \`filter\`, \`map\`, \`flatMap\`, \`distinct\`, \`sorted\`.
  3. *Thao tác kết thúc (Terminal Operations)*: \`collect\`, \`forEach\`, \`reduce\`, \`count\`.
- **Optional<T>**: Container chứa giá trị có thể tồn tại hoặc \`empty\`. Thay thế hoàn toàn việc trả về \`null\` ở tầng Service/Repository.`,
    keywords: [
      { keyword: 'Checked vs Unchecked', description: 'Checked bắt buộc xử lý lúc compile, Unchecked là lỗi logic runtime' },
      { keyword: 'try-with-resources', description: 'Quản lý tài nguyên tự động với AutoCloseable, tránh rò rỉ bộ nhớ (leak)' },
      { keyword: 'Lazy Evaluation', description: 'Thao tác trung gian của Stream chỉ chạy khi gặp Terminal Operation' },
      { keyword: 'flatMap', description: 'Làm phẳng cấu trúc Stream lồng nhau (1-to-N mapping)' },
      { keyword: 'Optional.orElseGet(...)', description: 'Khởi tạo fallback lười (lazy), tối ưu hơn orElse(...) tạo sẵn object' },
    ],
    codeExamples: [
      {
        title: 'try-with-resources chuẩn mực với AutoCloseable',
        code: `import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

public class ResourceManagement {
    public static String readFirstLine(String path) throws IOException {
        // Tự động đóng br dù có ngoại lệ xảy ra hay không
        try (BufferedReader br = new BufferedReader(new FileReader(path))) {
            return br.readLine();
        }
        // br.close() được gọi tự động ở đây! Không cần khối finally thủ công!
    }
}`,
        explanation: 'try-with-resources an toàn hơn khối finally truyền thống vì bảo toàn được ngoại lệ gốc nếu hàm close() cũng ném ra ngoại lệ phụ (suppressed exception).',
      },
      {
        title: 'Thực chiến Stream API & Optional trong Java Backend',
        code: `import java.util.*;
import java.util.stream.Collectors;

record Order(String id, double total, String status, List<String> items) {}

public class StreamApiDemo {
    public static void main(String[] args) {
        List<Order> orders = List.of(
            new Order("O1", 150.0, "COMPLETED", List.of("Laptop", "Mouse")),
            new Order("O2", 50.0, "PENDING", List.of("Keyboard")),
            new Order("O3", 300.0, "COMPLETED", List.of("Monitor", "Cable"))
        );

        // 1. Lọc đơn hoàn thành, lấy tổng tiền theo từng đơn và sắp xếp
        List<Double> highValueTotals = orders.stream()
            .filter(o -> "COMPLETED".equals(o.status()))
            .map(Order::total)
            .filter(total -> total > 100.0)
            .sorted(Comparator.reverseOrder())
            .toList();

        System.out.println("High value totals: " + highValueTotals); // [300.0, 150.0]

        // 2. Gom nhóm danh sách sản phẩm phẳng (flatMap)
        Set<String> uniqueItems = orders.stream()
            .flatMap(o -> o.items().stream())
            .collect(Collectors.toSet());

        System.out.println("Unique items: " + uniqueItems);

        // 3. Optional xử lý an toàn
        Optional<Order> highestOrder = orders.stream()
            .max(Comparator.comparingDouble(Order::total));

        String result = highestOrder
            .map(o -> "Top order: " + o.id() + " with $" + o.total())
            .orElse("No orders found");
        System.out.println(result);
    }
}`,
        explanation: 'Stream API kết hợp Record và Method Reference giúp code ngắn gọn, đọc như một câu văn mô tả nghiệp vụ và loại bỏ hoàn toàn các vòng lặp for lồng nhau.',
      },
    ],
    exercises: [
      'So sánh Optional.orElse() và Optional.orElseGet(). Tại sao orElseGet() tối ưu hiệu năng hơn khi giá trị fallback phải gọi hàm nặng?',
      'Viết câu lệnh Stream API gom nhóm danh sách nhân viên theo Department và tính lương trung bình của từng Department (Collectors.groupingBy & Collectors.averagingDouble).',
      'Tại sao không bao giờ nên dùng Optional làm trường (field) trong Entity class hoặc làm tham số của method?',
    ],
    commonMistakes: [
      'Catch Exception chung chung (catch (Exception e)) và nuốt lỗi (empty catch block) làm mất dấu vết sự cố.',
      'Dùng stream() cho các phép toán quá đơn giản trên mảng nhỏ gây overhead hiệu năng.',
      'Gọi optional.get() trực tiếp mà không kiểm tra isPresent() hoặc dùng orElse() → vẫn văng NoSuchElementException tương tự NullPointerException.',
    ],
    prerequisite: 'collections-internals',
  },
  {
    id: 'multithreading-and-concurrency',
    order: 10,
    category: 'Concurrency',
    name: 'Đa Luồng & Đồng Thời (Concurrency Core)',
    nameEn: 'Multithreading & Concurrency Core',
    tagline: 'Thread pool, ExecutorService, đồng bộ hoá dữ liệu và bất đồng bộ với CompletableFuture.',
    color: '#9333ea',
    colorLight: '#faf5ff',
    citation: {
      source: 'Java Concurrency in Practice',
      author: 'Brian Goetz (Java Language Architect)',
      itemOrChapter: 'Chapter 2: Thread Safety & Chapter 8: Applying Thread Pools',
      url: 'https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/ThreadPoolExecutor.html',
      keyTakeaway: 'Viết code đa luồng an toàn (thread-safe) cốt lõi là quản lý quyền truy cập vào Mutable Shared State. Không bao giờ tự tạo Thread thủ công trong ứng dụng production, luôn sử dụng ExecutorService (Thread Pool).'
    },
    description: `Multithreading là điểm phân hoá rõ rệt nhất giữa Junior và Mid/Senior Java Developer.

**1. Vòng đời Thread & Cách tạo Thread**:
- Vòng đời: \`NEW\` → \`RUNNABLE\` → \`BLOCKED\` / \`WAITING\` / \`TIMED_WAITING\` → \`TERMINATED\`.
- \`Runnable\` (không trả về kết quả, không throw checked exception) vs \`Callable<V>\` (trả về kết quả kiểu \`V\`, có thể throw \`Exception\`).

**2. Thread Pool & ExecutorService**:
- Không dùng \`new Thread()\` vì chi phí cấp phát bộ nhớ của hệ điều hành (~1MB stack memory mỗi thread) rất đắt đỏ.
- \`ThreadPoolExecutor\`: Gồm \`corePoolSize\`, \`maximumPoolSize\`, \`workQueue\`, \`keepAliveTime\` và \`RejectedExecutionHandler\`.

**3. Cơ chế đồng bộ hoá (Synchronization & Memory Model)**:
- **Race Condition**: Xảy ra khi nhiều thread cùng đọc-ghi một biến dùng chung mà không đồng bộ.
- **\`synchronized\`**: Khoá mức monitor lock (intrinsic lock), đảm bảo tính nguyên tử (Atomicity) và khả năng nhìn thấy (Visibility).
- **\`volatile\`**: Đảm bảo **Visibility** (mọi thread đọc trực tiếp từ Main Memory, không dùng CPU cache), nhưng **KHÔNG** đảm bảo tính nguyên tử cho phép toán phức hợp như \`count++\`.
- **\`AtomicInteger / AtomicLong\`**: Sử dụng kỹ thuật phần cứng **CAS (Compare-And-Swap)** không cần khoá (lock-free), hiệu năng cực cao.

**4. Bất đồng bộ với \`CompletableFuture\`**:
- Xây dựng pipeline bất đồng bộ non-blocking (\`supplyAsync\`, \`thenApply\`, \`thenCombine\`, \`allOf\`).`,
    keywords: [
      { keyword: 'Thread Pool Executor', description: 'Quản lý tái sử dụng luồng, kiểm soát tài nguyên hệ thống' },
      { keyword: 'CAS (Compare-And-Swap)', description: 'Chỉ thị phần cứng CPU cập nhật nguyên tử không cần lock' },
      { keyword: 'volatile', description: 'Đảm bảo tính nhìn thấy (visibility) trên bộ nhớ RAM giữa các lõi CPU' },
      { keyword: 'Deadlock', description: 'Tình trạng 2 hay nhiều luồng chờ lẫn nhau giữ tài nguyên không thể tiếp tục' },
      { keyword: 'CompletableFuture', description: 'Mô hình lập trình bất đồng bộ Reactive-like hiện đại trong Java' },
    ],
    codeExamples: [
      {
        title: 'Sử dụng ThreadPoolExecutor chuẩn mực trong ứng dụng',
        code: `import java.util.concurrent.*;

public class ThreadPoolDemo {
    public static void main(String[] args) throws Exception {
        // Cấu hình rõ ràng tham số, không dùng Executors.newFixedThreadPool() tùy tiện (dễ OOM queue)
        int corePoolSize = 4;
        int maxPoolSize = 8;
        long keepAliveTime = 60L;
        BlockingQueue<Runnable> queue = new ArrayBlockingQueue<>(100);

        ExecutorService executor = new ThreadPoolExecutor(
            corePoolSize,
            maxPoolSize,
            keepAliveTime,
            TimeUnit.SECONDS,
            queue,
            new ThreadPoolExecutor.CallerRunsPolicy() // Chính sách khi hàng đợi đầy
        );

        // Giao việc trả về Future
        Future<String> future = executor.submit(() -> {
            Thread.sleep(1000);
            return "Dữ liệu xử lý thành công từ " + Thread.currentThread().getName();
        });

        System.out.println("Làm công việc khác ở main thread...");
        String result = future.get(2, TimeUnit.SECONDS); // chờ tối đa 2s
        System.out.println("Kết quả: " + result);

        executor.shutdown(); // Luôn tắt pool khi kết thúc
    }
}`,
        explanation: 'Sử dụng ArrayBlockingQueue có giới hạn (bounded queue) và CallerRunsPolicy giúp bảo vệ hệ thống không bị tràn bộ nhớ (OutOfMemoryError) khi lưu lượng tăng đột biến.',
      },
      {
        title: 'Bất đồng bộ đa nguồn với CompletableFuture',
        code: `import java.util.concurrent.CompletableFuture;

public class CompletableFuturePipeline {
    public static void main(String[] args) {
        // 1. Gọi song song lấy thông tin người dùng và lịch sử đơn hàng
        CompletableFuture<String> userFuture = CompletableFuture.supplyAsync(() -> {
            simulateDelay(500);
            return "User: Levi";
        });

        CompletableFuture<Double> balanceFuture = CompletableFuture.supplyAsync(() -> {
            simulateDelay(700);
            return 1250.50;
        });

        // 2. Kết hợp kết quả khi cả hai hoàn thành (Parallel Execution)
        CompletableFuture<String> combined = userFuture.thenCombine(balanceFuture, (user, balance) -> {
            return user + " | Số dư: $" + balance;
        });

        System.out.println(combined.join()); // User: Levi | Số dư: $1250.5
    }

    private static void simulateDelay(long ms) {
        try { Thread.sleep(ms); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
    }
}`,
        explanation: 'thenCombine cho phép chạy 2 tác vụ I/O song song độc lập và ghép nối kết quả khi cả 2 hoàn thành, rút ngắn tổng thời gian phản hồi từ 500ms + 700ms = 1200ms xuống chỉ còn ~700ms.',
      },
    ],
    exercises: [
      'Tại sao biến volatile boolean running = true; phù hợp cho cờ dừng (stop flag), nhưng biến volatile int count = 0; không an toàn cho count++ đa luồng?',
      'Bốn điều kiện dẫn đến Deadlock (Coffman conditions) là gì? Nêu cách phòng ngừa Deadlock phổ biến nhất (khoá theo thứ tự cố định).',
      'Virtual Threads (Project Loom) trong Java 21 khác gì so với Platform Threads truyền thống?',
    ],
    commonMistakes: [
      'Dùng Executors.newCachedThreadPool() tạo vô hạn thread hoặc newFixedThreadPool() với LinkedBlockingQueue vô hạn dẫn đến OutOfMemoryError.',
      'Gọi Thread.stop() (bị deprecated) thay vì dùng Thread.interrupt() và cơ chế cờ hiệu.',
      'Quên gọi executor.shutdown() khiến JVM không thể tắt ứng dụng.',
    ],
    prerequisite: 'exceptions-and-modern-java',
  },
];

// Helper: get pillar by id
export function getOopPillar(id: string): OopPillar | undefined {
  return OOP_PILLARS.find((p) => p.id === id);
}

// LocalStorage key helper
export const OOP_STORAGE_KEY_PREFIX = 'oop_status_';
export function getOopStatusKey(pillarId: string): string {
  return `${OOP_STORAGE_KEY_PREFIX}${pillarId}`;
}
