# Arrays Cheatsheet

| Phương thức | Cú pháp | Giá trị trả về | Mô tả |
| :--- | :--- | :--- | :--- |
| `toString` | `Arrays.toString(arr)` | `String` | Chuyển mảng 1D thành Chuỗi |
| `deepToString` | `Arrays.deepToString(arr2D)` | `String` | Chuyển mảng 2D/nhiều chiều thành Chuỗi |
| `sort` | `Arrays.sort(arr)` | `void` | Sắp xếp mảng tăng dần (`O(N log N)`) |
| `sort(custom)` | `Arrays.sort(arr, (a, b) -> b - a)` | `void` | Sắp xếp với Comparator tùy biến |
| `equals` | `Arrays.equals(arr1, arr2)` | `boolean` | So sánh nội dung 2 mảng 1D (`O(N)`) |
| `deepEquals` | `Arrays.deepEquals(arr1, arr2)` | `boolean` | So sánh nội dung 2 mảng nhiều chiều |
| `fill` | `Arrays.fill(arr, val)` | `void` | Gán tất cả phần tử mảng bằng `val` (`O(N)`) |
| `copyOf` | `Arrays.copyOf(arr, newLen)` | `T[]` | Copy mảng sang mảng mới có độ dài `newLen` |
| `copyOfRange` | `Arrays.copyOfRange(arr, from, to)` | `T[]` | Copy mảng từ vị trí `from` đến `to-1` |
| `asList` | `Arrays.asList(arr/values)` | `List<T>` | Chuyển mảng/phần tử thành `List` kích thước cố định |
| `binarySearch` | `Arrays.binarySearch(arr, key)` | `int` | Tìm kiếm nhị phân trên mảng đã sắp xếp (`O(log N)`) |
| `mismatch` | `Arrays.mismatch(arr1, arr2)` | `int` | Vị trí đầu tiên 2 mảng khác nhau (-1 nếu giống nhau) |
| `compare` | `Arrays.compare(arr1, arr2)` | `int` | So sánh thứ tự từ điển giữa 2 mảng |
| `stream` | `Arrays.stream(arr)` | `IntStream / Stream<T>` | Tạo Stream xử lý mảng (ví dụ: `.sum()`, `.max()`) |

### Ví dụ nhanh:
```java
int[] arr = {3, 1, 2};
Arrays.sort(arr); // [1, 2, 3]
System.out.println(Arrays.toString(arr));

// Tạo mảng fill giá trị mặc định
int[][] memo = new int[m][n];
for (int[] row : memo) Arrays.fill(row, -1);
```
