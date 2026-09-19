# Arrays Cheatsheet (`java.util.Arrays`)

| Phương thức | Cú pháp | Mô tả |
| :--- | :--- | :--- |
| `toString` | `Arrays.toString(arr)` | Chuyển mảng 1D thành Chuỗi đẹp mắt |
| `deepToString`| `Arrays.deepToString(arr2D)` | Chuyển mảng 2D/nhiều chiều thành Chuỗi |
| `sort` | `Arrays.sort(arr)` | Sắp xếp mảng ($O(N \log N)$) |
| `equals` | `Arrays.equals(arr1, arr2)` | So sánh nội dung 2 mảng 1D |
| `deepEquals` | `Arrays.deepEquals(arr1, arr2)`| So sánh nội dung 2 mảng nhiều chiều |
| `fill` | `Arrays.fill(arr, val)` | Gán tất cả phần tử mảng bằng `val` |
| `copyOf` | `Arrays.copyOf(arr, newLen)` | Copy mảng sang mảng mới có độ dài `newLen` |
| `copyOfRange` | `Arrays.copyOfRange(arr, from, to)` | Copy mảng từ vị trí `from` đến `to-1` |
| `asList` | `Arrays.asList(arr/values)` | Chuyển mảng/phần tử thành `List` cố định |
| `binarySearch`| `Arrays.binarySearch(arr, key)` | Tìm kiếm nhị phân (mảng phải được sort trước) |

### Ví dụ nhanh:
```java
int[] arr = {3, 1, 2};
Arrays.sort(arr); // [1, 2, 3]
System.out.println(Arrays.toString(arr));
```
