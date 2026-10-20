import { OopPillar } from './oopData';

export type ExerciseKind = 'code' | 'theory';

export interface OopExercisePracticeItem {
  id: string;
  name: string;
  kind: ExerciseKind;
  pillarId: string;
  pillarName: string;
  exerciseIndex: number;
  fileName: string;
  javaFilePath: string;
  description: string;
  starterTemplate: string;
  referenceSolution: string;
  explanation: string;
}

export function detectExerciseKind(text: string): ExerciseKind {
  const t = text.trim().toLowerCase();
  if (
    t.startsWith('giải thích') ||
    t.startsWith('tại sao') ||
    t.startsWith('so sánh') ||
    t.startsWith('tìm hiểu') ||
    t.startsWith('bốn điều kiện') ||
    t.includes('khi nào dùng') ||
    t.includes('điều gì xảy ra nếu') ||
    t.includes('khác gì so với') ||
    t.includes('giải thích sự khác nhau')
  ) {
    return 'theory';
  }
  return 'code';
}

// Special curated metadata & solutions for exercises
const CURATED_EXERCISES: Record<
  string,
  {
    kind: ExerciseKind;
    fileName: string;
    starterTemplate: string;
    referenceSolution: string;
    explanation: string;
  }
> = {
  // Encapsulation - Bài 1: Student (Code)
  'encapsulation_0': {
    kind: 'code',
    fileName: 'Student.java',
    starterTemplate: `package javacore;

public class Student {
    private String name;
    private int age;
    private double gpa;

    // TODO: Viết constructor kiểm tra gpa trong khoảng [0.0, 4.0]
    public Student(String name, int age, double gpa) {
        this.name = name;
        this.age = age;
        setGpa(gpa);
    }

    // TODO: Cung cấp getter và setter
    public double getGpa() {
        return gpa;
    }

    public void setGpa(double gpa) {
        // Nếu gpa < 0 hoặc > 4.0 -> throw IllegalArgumentException
        this.gpa = gpa;
    }

    public static void main(String[] args) {
        // Viết code kiểm tra tại đây
    }
}
`,
    referenceSolution: `package javacore;

public class Student {
    private String name;
    private int age;
    private double gpa;

    public Student(String name, int age, double gpa) {
        this.name = name;
        setAge(age);
        setGpa(gpa);
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        if (age < 0) {
            throw new IllegalArgumentException("Tuổi không được là số âm: " + age);
        }
        this.age = age;
    }

    public double getGpa() {
        return gpa;
    }

    public void setGpa(double gpa) {
        if (gpa < 0.0 || gpa > 4.0) {
            throw new IllegalArgumentException("GPA phải nằm trong khoảng [0.0, 4.0], nhận được: " + gpa);
        }
        this.gpa = gpa;
    }

    @Override
    public String toString() {
        return String.format("Student{name='%s', age=%d, gpa=%.2f}", name, age, gpa);
    }

    public static void main(String[] args) {
        // 1. Tạo đối tượng hợp lệ
        Student s = new Student("Nguyen Van A", 20, 3.8);
        System.out.println("Khoi tao thanh cong: " + s);

        // 2. Kiem tra validation khi set GPA sai
        try {
            s.setGpa(4.5);
        } catch (IllegalArgumentException e) {
            System.out.println("Bat ngoai le dung chuan: " + e.getMessage());
        }
    }
}
`,
    explanation: `Tính đóng gói (Encapsulation) yêu cầu mọi biến trạng thái (state) nhạy cảm phải được bảo vệ bởi các bất biến (invariants).
- Việc ném IllegalArgumentException ngay tại setter đảm bảo đối tượng luôn ở trạng thái hợp lệ (Fail-Fast principle).
- Tránh việc gán trực tiếp field công khai làm dữ liệu bị biến đổi bất hợp lệ ở runtime.`,
  },

  // Encapsulation - Bài 2: Temperature (Code)
  'encapsulation_1': {
    kind: 'code',
    fileName: 'Temperature.java',
    starterTemplate: `package javacore;

public class Temperature {
    private double celsius;

    public Temperature(double celsius) {
        this.celsius = celsius;
    }

    // TODO: getCelsius(), getFahrenheit(), getKelvin()
    // Chỉ có setter setCelsius() - tự động tính các đơn vị còn lại

    public static void main(String[] args) {
        // Test chuyen doi do C, F, K
    }
}
`,
    referenceSolution: `package javacore;

public class Temperature {
    private double celsius;

    public Temperature(double celsius) {
        setCelsius(celsius);
    }

    public double getCelsius() {
        return celsius;
    }

    public void setCelsius(double celsius) {
        if (celsius < -273.15) {
            throw new IllegalArgumentException("Nhiệt độ không thể thấp hơn độ không tuyệt đối (-273.15 C): " + celsius);
        }
        this.celsius = celsius;
    }

    public double getFahrenheit() {
        return (celsius * 9.0 / 5.0) + 32.0;
    }

    public double getKelvin() {
        return celsius + 273.15;
    }

    public static void main(String[] args) {
        Temperature temp = new Temperature(25.0);
        System.out.println("Celsius: " + temp.getCelsius() + " C");
        System.out.println("Fahrenheit: " + temp.getFahrenheit() + " F");
        System.out.println("Kelvin: " + temp.getKelvin() + " K");

        temp.setCelsius(100.0);
        System.out.println("Sau khi set 100 C -> Fahrenheit: " + temp.getFahrenheit() + " F");
    }
}
`,
    explanation: `Encapsulation không có nghĩa là mỗi field phải có một cặp getter/setter đối xứng.
- Bằng cách chỉ lưu một field nguồn gốc (celsius) và tính toán động Fahrenheit và Kelvin khi được gọi, ta đảm bảo không bao giờ xảy ra tình trạng dữ liệu không nhất quán (inconsistent state).`,
  },

  // Encapsulation - Bài 3: Immutable String (Theory)
  'encapsulation_2': {
    kind: 'theory',
    fileName: 'ImmutableString.md',
    starterTemplate: `# Câu hỏi: Tại sao String trong Java là Immutable (không có setter)?
<!-- Đây là một dạng Encapsulation cực đoan. Hãy trình bày các luận điểm chính dưới đây -->

## 1. Bản chất tính bất biến (Immutability) của String trong Java
- 

## 2. Bốn lý do thiết kế cốt lõi:
### a. Tối ưu bộ nhớ (String Constant Pool)
- 

### b. An toàn và bảo mật hệ thống (Security)
- 

### c. An toàn đa luồng (Thread-Safety)
- 

### d. Tối ưu hóa bảng băm (HashCode Caching)
- 
`,
    referenceSolution: `## Đáp án tham khảo: Tại sao String trong Java là Immutable?

### 1. Bản chất Encapsulation cực đoan:
String là một đối tượng bất biến hoàn toàn:
- Class \`String\` được khai báo \`final\` (không thể bị kế thừa để override phương thức).
- Mảng lưu trữ ký tự bên trong (\`byte[] value\`) được khai báo \`private final\`.
- Không cung cấp bất kỳ phương thức setter nào; mọi phương thức biến đổi như \`concat()\`, \`substring()\`, \`replace()\` đều trả về một đối tượng String **mới**.

---

### 2. Bốn lý do thiết kế cốt lõi:

1. **String Constant Pool (Tối ưu bộ nhớ Heap):**
   - Java tái sử dụng các chuỗi ký tự trùng nhau thông qua String Pool. Nếu String là mutable, việc một biến thay đổi giá trị sẽ làm sai lệch dữ liệu của tất cả các biến khác đang cùng trỏ tới chuỗi đó trong pool.

2. **Bảo mật hệ thống (Security):**
   - String được dùng rộng rãi để chứa các thông tin nhạy cảm: tên người dùng, mật khẩu, URL kết nối cơ sở dữ liệu, đường dẫn file, cổng mạng socket.
   - Nếu String có thể thay đổi, kẻ tấn công có thể thay đổi tham số sau khi bước kiểm tra xác thực (Validation) đã hoàn tất.

3. **An toàn đa luồng (Thread-Safety):**
   - Vì trạng thái không bao giờ thay đổi sau khi khởi tạo, các đối tượng String có thể được chia sẻ an toàn giữa nhiều luồng chạy đồng thời mà **không cần bất kỳ cơ chế đồng bộ hóa (\`synchronized\`) nào**, loại bỏ hoàn toàn nguy cơ Race Condition.

4. **Tối ưu hóa bảng băm (HashCode Caching):**
   - Mã băm \`hashCode()\` của String chỉ cần tính toán một lần duy nhất lúc cần và được lưu (cache) lại.
   - Đây là nền tảng giúp String trở thành kiểu dữ liệu lý tưởng nhất để làm \`Key\` trong \`HashMap\` và phần tử trong \`HashSet\`. Nếu key bị sửa đổi sau khi đã đưa vào map, việc tra cứu sẽ bị hỏng hoàn toàn.
`,
    explanation: `Tính bất biến (Immutability) là đỉnh cao của Encapsulation: khi đối tượng không thể bị biến đổi sau khi sinh ra, nó đảm bảo tính toàn vẹn trạng thái (State Integrity) tuyệt đối trong toàn bộ vòng đời ứng dụng.`,
  },
};

function extractClassNameFromText(text: string, fallback: string): string {
  const match = text.match(/class\s+([A-Za-z0-9_]+)/i) || text.match(/interface\s+([A-Za-z0-9_]+)/i);
  if (match && match[1]) {
    return match[1];
  }
  return fallback;
}

export function getOopExercisePracticeItem(
  pillar: OopPillar,
  index: number
): OopExercisePracticeItem {
  const exerciseText = pillar.exercises[index] || `Bài tập ${index + 1}`;
  const key = `${pillar.id}_${index}`;
  const curated = CURATED_EXERCISES[key];

  if (curated) {
    return {
      id: `oop_${pillar.id}_${index}`,
      name: `${curated.fileName.replace(/\.(java|md)$/, '')} (${pillar.name})`,
      kind: curated.kind,
      pillarId: pillar.id,
      pillarName: pillar.name,
      exerciseIndex: index,
      fileName: curated.fileName,
      javaFilePath: `java-core/${curated.fileName}`,
      description: exerciseText,
      starterTemplate: curated.starterTemplate,
      referenceSolution: curated.referenceSolution,
      explanation: curated.explanation,
    };
  }

  // Automatic detection for all other pillar exercises
  const kind = detectExerciseKind(exerciseText);

  if (kind === 'theory') {
    const safeTitle = `${pillar.id}_ly_thuyet_${index + 1}`;
    const fileName = `${safeTitle}.md`;

    const theoryTemplate = `# Câu hỏi lý thuyết:
> ${exerciseText}

## Câu trả lời của bạn:
<!-- Soạn thảo câu trả lời, phân tích logic hoặc đưa ví dụ minh họa tại đây -->
`;

    return {
      id: `oop_${pillar.id}_${index}`,
      name: `Lý thuyết bài ${index + 1} (${pillar.name})`,
      kind: 'theory',
      pillarId: pillar.id,
      pillarName: pillar.name,
      exerciseIndex: index,
      fileName,
      javaFilePath: `java-core/${fileName}`,
      description: exerciseText,
      starterTemplate: theoryTemplate,
      referenceSolution: `## Hướng dẫn & Điểm mấu chốt:\n\n- **Đề bài:** ${exerciseText}\n\n- **Khái niệm cốt lõi:** Chủ đề ${pillar.name} trong Java chuẩn.\n- **Nguyên lý cần nhấn mạnh:** Xem xét dưới góc độ thiết kế hướng đối tượng (OOP), quản lý bộ nhớ Heap/Stack và an toàn đa luồng.`,
      explanation: `Câu hỏi lý thuyết phỏng vấn về ${pillar.name}. Hãy trả lời gãy gọn, đi sâu vào bản chất thiết kế và tác động hiệu năng / kiến trúc của Java.`,
    };
  }

  // Generic Code exercise
  const defaultBase = `${pillar.id.replace(/-/g, '_')}_bai_${index + 1}`;
  const className = extractClassNameFromText(exerciseText, defaultBase);
  const fileName = `${className}.java`;

  const genericTemplate = `package javacore;

public class ${className} {
    /**
     * Đề bài:
     * ${exerciseText}
     */

    public static void main(String[] args) {
        System.out.println("Thực thi bài tập: ${className}");
        // Cài đặt giải pháp của bạn tại đây
    }
}
`;

  return {
    id: `oop_${pillar.id}_${index}`,
    name: `${className} (${pillar.name})`,
    kind: 'code',
    pillarId: pillar.id,
    pillarName: pillar.name,
    exerciseIndex: index,
    fileName,
    javaFilePath: `java-core/${fileName}`,
    description: exerciseText,
    starterTemplate: genericTemplate,
    referenceSolution: genericTemplate,
    explanation: `Bài tập lập trình thuộc chủ đề: ${pillar.name}. Hãy áp dụng các nguyên lý lập trình hướng đối tượng (OOP) và thực hành Clean Code Java để giải quyết.`,
  };
}
