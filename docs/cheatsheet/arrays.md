# Arrays Cheatsheet

| Phương thức | Cú pháp | Giá trị trả về | Mô tả |
| :--- | :--- | :--- | :--- |
| `toString` | `Arrays.toString(arr)` | `String` | Chuyển mảng 1D thành Chuỗi đẹp mắt |
| `deepToString` | `Arrays.deepToString(arr2D)` | `String` | Chuyển mảng 2D/nhiều chiều thành Chuỗi |
| `sort` | `Arrays.sort(arr)` | `void` | Sắp xếp mảng ($O(N \log N)$) |
| `equals` | `Arrays.equals(arr1, arr2)` | `boolean` | So sánh nội dung 2 mảng 1D |
| `deepEquals` | `Arrays.deepEquals(arr1, arr2)` | `boolean` | So sánh nội dung 2 mảng nhiều chiều |
| `fill` | `Arrays.fill(arr, val)` | `void` | Gán tất cả phần tử mảng bằng `val` |
| `copyOf` | `Arrays.copyOf(arr, newLen)` | `T[]` | Copy mảng sang mảng mới có độ dài `newLen` |
| `copyOfRange` | `Arrays.copyOfRange(arr, from, to)` | `T[]` | Copy mảng từ vị trí `from` đến `to-1` |
| `asList` | `Arrays.asList(arr/values)` | `List<T>` | Chuyển mảng/phần tử thành `List` cố định |
| `binarySearch` | `Arrays.binarySearch(arr, key)` | `int` | Tìm kiếm nhị phân (trả về index hoặc số âm) |

### Ví dụ nhanh:
```java
int[] arr = {3, 1, 2};
Arrays.sort(arr); // [1, 2, 3]
System.out.println(Arrays.toString(arr));
```
