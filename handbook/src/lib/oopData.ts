// ============================================================
// OOP Java Learning Track Data
// 4 tính chất của OOP trong Java: Encapsulation → Inheritance
// → Polymorphism → Abstraction
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

export interface OopPillar {
  id: string;
  order: number;
  name: string;          // Tên tiếng Việt
  nameEn: string;        // Tên tiếng Anh
  tagline: string;       // Một câu mô tả ngắn
  color: string;         // Màu accent riêng của mỗi pillar
  colorLight: string;    // Màu nền nhạt
  description: string;  // Mô tả chi tiết
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
    name: 'Tính Đóng Gói',
    nameEn: 'Encapsulation',
    tagline: 'Ẩn dữ liệu bên trong, kiểm soát truy cập từ bên ngoài.',
    color: '#2d7d46',
    colorLight: '#f0faf4',
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
    name: 'Tính Kế Thừa',
    nameEn: 'Inheritance',
    tagline: 'Tái sử dụng code qua quan hệ "is-a" giữa lớp cha và lớp con.',
    color: '#1a5fa8',
    colorLight: '#f0f6ff',
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
    name: 'Tính Đa Hình',
    nameEn: 'Polymorphism',
    tagline: 'Cùng một tên, nhiều hành vi khác nhau tùy theo đối tượng thực sự.',
    color: '#7b2d8b',
    colorLight: '#fdf4ff',
    description: `Polymorphism cho phép xử lý các đối tượng thuộc các class khác nhau thông qua cùng một interface. Có hai loại:

**1. Runtime Polymorphism (Dynamic Dispatch)** — Method được quyết định lúc chạy dựa trên class thực sự của đối tượng. Đây là tính chất mạnh nhất, đạt được qua @Override.

**2. Compile-time Polymorphism (Overloading)** — Nhiều method cùng tên nhưng khác tham số trong cùng class. JVM chọn đúng method lúc compile.`,
    keywords: [
      { keyword: '@Override', description: 'Runtime polymorphism — method được chọn lúc chạy' },
      { keyword: 'overloading', description: 'Compile-time polymorphism — method được chọn lúc compile' },
      { keyword: 'dynamic dispatch', description: 'Cơ chế JVM tìm đúng method override của class con lúc runtime' },
      { keyword: 'upcasting', description: 'Gán object class con vào biến class cha (tự động)' },
      { keyword: 'downcasting', description: 'Ép kiểu từ class cha về class con (phải dùng cast, có thể throw ClassCastException)' },
      { keyword: 'instanceof', description: 'Kiểm tra kiểu thực sự của object trước khi downcast' },
    ],
    codeExamples: [
      {
        title: 'Runtime Polymorphism — Dynamic Dispatch',
        code: `public class Animal {
    public String sound() {
        return "...";
    }
}

public class Dog extends Animal {
    @Override
    public String sound() { return "Woof"; }
}

public class Cat extends Animal {
    @Override
    public String sound() { return "Meow"; }
}

public class Duck extends Animal {
    @Override
    public String sound() { return "Quack"; }
}

// *** ĐÂY LÀ SỨC MẠNH CỦA POLYMORPHISM ***
public class Main {
    public static void main(String[] args) {
        // Upcasting: lưu object con vào biến kiểu cha
        Animal[] animals = { new Dog(), new Cat(), new Duck() };

        for (Animal a : animals) {
            // JVM tự động gọi đúng method của class THỰC SỰ
            // Không cần if-else check type!
            System.out.println(a.sound());
        }
        // Output: Woof, Meow, Quack
    }
}`,
        explanation: 'Không có polymorphism, bạn phải viết: if (a instanceof Dog) ... else if (a instanceof Cat) ... — rất dài và khó mở rộng. Với polymorphism, thêm class Parrot mới không cần sửa vòng lặp.',
      },
      {
        title: 'Compile-time Polymorphism — Overloading',
        code: `public class Calculator {
    // Cùng tên "add" nhưng khác signature
    public int add(int a, int b) {
        return a + b;
    }

    public double add(double a, double b) {
        return a + b;
    }

    public int add(int a, int b, int c) {
        return a + b + c;
    }

    public String add(String a, String b) {
        return a + b;  // concatenation
    }
}

// Downcast an toàn với instanceof
Animal animal = new Dog();  // upcasting

// Pattern matching (Java 16+) — clean hơn
if (animal instanceof Dog dog) {
    dog.bark();  // không cần cast thủ công
}`,
        explanation: 'Overloading ít mạnh hơn Override vì được quyết định lúc compile — compiler chọn method dựa trên kiểu tham số được khai báo, không phải kiểu runtime.',
      },
    ],
    exercises: [
      'Tạo Shape[] gồm Circle, Rectangle, Triangle. Viết hàm printAllAreas(Shape[] shapes) chỉ dùng 1 vòng for và gọi getArea() — không được dùng instanceof.',
      'Tạo class Logger với các overload: log(String msg), log(String msg, Exception e), log(String level, String msg). Hiểu tại sao đây là compile-time chứ không phải runtime.',
      'Giải thích điều gì xảy ra: Animal a = new Dog(); — a.sound() gọi method nào? Tại sao?',
    ],
    commonMistakes: [
      'Nhầm lẫn Overriding (runtime, khác class) với Overloading (compile-time, cùng class khác params).',
      'Override method nhưng đổi return type không tương thích → compile error (Java cho phép covariant return type nhưng không được thu hẹp access modifier).',
      'Downcast không kiểm tra instanceof → ClassCastException lúc runtime.',
      'Khai báo static method là @Override — static method KHÔNG được dispatch theo kiểu runtime (method hiding, không phải overriding).',
    ],
    prerequisite: 'inheritance',
  },
  {
    id: 'abstraction',
    order: 4,
    name: 'Tính Trừu Tượng',
    nameEn: 'Abstraction',
    tagline: 'Định nghĩa "cái gì" (contract) mà không quan tâm "làm thế nào" (implementation).',
    color: '#c2410c',
    colorLight: '#fff7ed',
    description: `Abstraction là nghệ thuật **ẩn đi sự phức tạp** và chỉ phơi ra những gì người dùng cần biết. Trong Java có 2 cơ chế:

**abstract class** — class không thể khởi tạo trực tiếp, có thể có cả method abstract (không có body) lẫn method thường (có body). Dùng khi có **partial implementation** chung.

**interface** — hợp đồng thuần túy (contract), tất cả method đều abstract (trừ default/static method từ Java 8). Dùng khi muốn định nghĩa **khả năng** (can-do) thay vì quan hệ phân cấp.

Đây là nền tảng của mọi Design Pattern và kiến trúc phần mềm tốt.`,
    keywords: [
      { keyword: 'abstract class', description: 'Class không thể new, có thể mix abstract + concrete method' },
      { keyword: 'abstract method', description: 'Method không có body — bắt buộc class con phải implement' },
      { keyword: 'interface', description: 'Contract thuần túy — định nghĩa "khả năng" (Runnable, Comparable...)' },
      { keyword: 'implements', description: 'Class cam kết thực hiện tất cả method của interface' },
      { keyword: 'default method', description: 'Method có body trong interface (Java 8+) — backward compatibility' },
      { keyword: 'functional interface', description: 'Interface chỉ có 1 abstract method — dùng với lambda' },
    ],
    codeExamples: [
      {
        title: 'Abstract class — Template Method Pattern',
        code: `// Abstract class — "cái gì" cần làm + "một phần" cách làm
public abstract class DataProcessor {
    // Template method — định nghĩa flow cố định
    public final void process() {
        readData();    // bước 1
        processData(); // bước 2 — abstract, subclass quyết định
        writeData();   // bước 3
    }

    protected abstract void processData(); // subclass PHẢI implement

    // Concrete methods — chung cho mọi subclass
    protected void readData() {
        System.out.println("Reading data...");
    }

    protected void writeData() {
        System.out.println("Writing results...");
    }
}

// Subclass chỉ cần quyết định "processData" là gì
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
        code: `// Interface định nghĩa "contract" — không quan tâm HOW
public interface Sortable {
    int compareTo(Object other);  // phải implement
}

public interface Printable {
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

// Một class có thể implements NHIỀU interface (khác với extends)
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
}

// Functional interface + Lambda (Java 8+)
@FunctionalInterface
interface Transformer<T> {
    T transform(T input);
}

// Dùng lambda thay vì anonymous class
Transformer<String> upper = s -> s.toUpperCase();
Transformer<Integer> double_ = n -> n * 2;`,
        explanation: 'Interface cho phép "multiple inheritance of type" — một class có thể có nhiều khả năng khác nhau. Đây là cách Java giải quyết vấn đề diamond problem của multiple inheritance.',
      },
    ],
    exercises: [
      'Thiết kế abstract class Shape với abstract getArea(), getPerimeter() và concrete method describe() gọi 2 method trên. Implement cho Circle, Rectangle.',
      'Tạo interface PaymentProcessor với processPayment(double amount): boolean. Implement CreditCardProcessor, PayPalProcessor, CryptoProcessor. Viết hàm checkout(PaymentProcessor p, double amount) — không quan tâm loại payment.',
      'Giải thích sự khác nhau giữa: abstract class Animal { abstract void sound(); } và interface Sound { void sound(); }. Khi nào dùng cái nào?',
      'Tạo functional interface Validator<T> với boolean validate(T value). Dùng lambda tạo ageValidator, emailValidator, passwordValidator.',
    ],
    commonMistakes: [
      'Dùng abstract class khi chỉ cần interface — abstract class tạo coupling chặt hơn (kế thừa chỉ 1 class cha).',
      'Interface có quá nhiều method → vi phạm Interface Segregation Principle. Tách thành interface nhỏ hơn.',
      'Implements interface nhưng để method rỗng (empty body) → breaking the contract silently.',
      'Nhầm lẫn: abstract class có thể có constructor (dùng cho subclass gọi super()), interface thì không.',
    ],
    prerequisite: 'polymorphism',
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
