# Prerequisites (Core Foundations) Cheatsheet

| Khái niệm / Cú pháp | Cú pháp Java | Giá trị trả về | Mô tả & Độ phức tạp |
| :--- | :--- | :--- | :--- |
| `Big-O Notation` | $O(1) < O(\log N) < O(N) < O(N \log N) < O(N^2) < O(2^N) < O(N!)$ | — | Độ phức tạp thời gian & không gian chuẩn |
| `Primitive vs Wrapper` | `int` $\leftrightarrow$ `Integer.valueOf(x)`, `char` $\leftrightarrow$ `Character` | `Integer / int` | Ép kiểu ngầm định Auto-boxing / Unboxing |
| `Max/Min Integer` | `Integer.MAX_VALUE`, `Integer.MIN_VALUE` | `int` | $2^{31}-1 \approx 2 \times 10^9$ và $-2^{31}$ |
| `Array Length` | `arr.length` | `int` | Thuộc tính độ dài mảng cố định ($O(1)$) |
| `String Length` | `str.length()` | `int` | Phương thức lấy số ký tự của String ($O(1)$) |
| `List/Collection Size` | `list.size()`, `map.size()`, `set.size()` | `int` | Phương thức lấy kích thước Collection ($O(1)$) |
| `Math.max / min` | `Math.max(a, b)`, `Math.min(a, b)` | `T (số lớn/nhỏ)` | Tìm giá trị lớn nhất / nhỏ nhất |
| `Math.abs / pow / sqrt` | `Math.abs(x)`, `Math.pow(a, b)`, `Math.sqrt(x)` | `double / T` | Trị tuyệt đối, lũy thừa, căn bậc hai |
| `Collections Framework` | `List`, `Set`, `Map`, `Queue`, `Deque` | — | Các giao diện cấu trúc dữ liệu cốt lõi |
| `Type Casting` | `(int) Math.floor(x)`, `(char) ('a' + i)` | `int / char` | Ép kiểu tường minh (explicit cast) |
| `Arrays to String` | `Arrays.toString(arr)` | `String` | Chuyển mảng 1D sang chuỗi dạng `[1, 2, 3]` |
| `Deep Arrays to String` | `Arrays.deepToString(matrix)` | `String` | Chuyển ma trận/mảng nhiều chiều sang chuỗi |
| `Array Copy` | `Arrays.copyOf(arr, len)`, `System.arraycopy(...)` | `T[] / void` | Sao chép mảng với độ phức tạp $O(N)$ |
| `Sort Array` | `Arrays.sort(arr)` (Dual-Pivot Quicksort / TimSort) | `void` | Sắp xếp mảng tại chỗ ($O(N \log N)$) |
| `Sort List` | `Collections.sort(list)` hoặc `list.sort(Comparator)` | `void` | Sắp xếp List ($O(N \log N)$) |
| `Custom Comparator` | `(a, b) -> a[0] - b[0]` hoặc `Integer::compare` | `int` | Hàm so sánh tự định nghĩa (tránh tràn số với `Integer.compare`) |
| `Swap elements` | `int temp = arr[i]; arr[i] = arr[j]; arr[j] = temp;` | `void` | Hoán đổi 2 phần tử trong mảng ($O(1)$) |

### Ví dụ nhanh:
```java
// Khởi tạo và in mảng chuẩn
int[] nums = {3, 1, 4, 1, 5};
Arrays.sort(nums);
System.out.println("Sorted: " + Arrays.toString(nums)); // [1, 1, 3, 4, 5]

// Tránh overflow khi so sánh số nguyên lớn
Comparator<int[]> cmp = (a, b) -> Integer.compare(a[0], b[0]);
```
