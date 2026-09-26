# StringBuilder Cheatsheet

| Phương thức | Cú pháp | Giá trị trả về | Mô tả |
| :--- | :--- | :--- | :--- |
| `new` | `new StringBuilder()` | `StringBuilder` | Khởi tạo bộ đệm chuỗi có thể thay đổi (Mutable) với dung lượng mặc định 16 ký tự |
| `new(capacity)` | `new StringBuilder(capacity)` | `StringBuilder` | Khởi tạo với dung lượng ước tính ban đầu (tối ưu hiệu năng, tránh cấp phát lại) |
| `new(str)` | `new StringBuilder(str)` | `StringBuilder` | Khởi tạo chứa sẵn nội dung của chuỗi `str` |
| `append` | `sb.append(val)` | `StringBuilder` | Nối thêm chuỗi/ký tự/số/boolean vào cuối (`O(1)` amortized) |
| `charAt` | `sb.charAt(index)` | `char` | Lấy ký tự tại vị trí chỉ định (`O(1)`) |
| `setCharAt` | `sb.setCharAt(index, ch)` | `void` | Ghi đè/đổi ký tự tại vị trí chỉ định (`O(1)`) |
| `deleteCharAt` | `sb.deleteCharAt(index)` | `StringBuilder` | Xóa 1 ký tự tại vị trí chỉ định (`O(N)`) - Thường dùng khi backtrack |
| `delete` | `sb.delete(start, end)` | `StringBuilder` | Xóa đoạn ký tự từ vị trí `start` đến `end-1` (`O(N)`) |
| `insert` | `sb.insert(offset, val)` | `StringBuilder` | Chèn chuỗi/ký tự/số vào vị trí chỉ định (`O(N)`) |
| `replace` | `sb.replace(start, end, str)` | `StringBuilder` | Thay thế đoạn từ `start` đến `end-1` bằng chuỗi `str` (`O(N)`) |
| `reverse` | `sb.reverse()` | `StringBuilder` | Đảo ngược chuỗi trực tiếp tại chỗ (in-place) (`O(N)`) |
| `length` | `sb.length()` | `int` | Độ dài hiện tại của chuỗi ký tự (`O(1)`) |
| `setLength` | `sb.setLength(newLength)` | `void` | Đặt lại độ dài chuỗi; `sb.setLength(0)` giúp reset nhanh để tái sử dụng (`O(1)`) |
| `substring` | `sb.substring(start)` / `sb.substring(start, end)` | `String` | Cắt chuỗi con từ `start` đến `end-1` (`O(K)`) |
| `indexOf` | `sb.indexOf(str)` / `sb.indexOf(str, fromIndex)` | `int` | Tìm vị trí xuất hiện đầu tiên của chuỗi con (tùy chọn quét từ `fromIndex`), trả về `-1` nếu không có |
| `lastIndexOf` | `sb.lastIndexOf(str)` / `sb.lastIndexOf(str, fromIndex)` | `int` | Tìm vị trí xuất hiện cuối cùng của chuỗi con (tùy chọn quét ngược từ `fromIndex`), trả về `-1` nếu không có |
| `toString` | `sb.toString()` | `String` | Chuyển đổi bộ đệm `StringBuilder` thành `String` hoàn chỉnh (`O(N)`) |

### Ví dụ nhanh:
```java
// 1. Nối chuỗi trong vòng lặp đạt O(N) (tránh O(N^2) của phép cộng String thông thường)
StringBuilder sb = new StringBuilder();
for (String word : Arrays.asList("neet", "code", "150")) {
    sb.append(word.length()).append('#').append(word);
}
String encoded = sb.toString(); // "4#neet4#code3#150"

// 2. Đảo ngược chuỗi (in-place)
String original = "hello";
String reversed = new StringBuilder(original).reverse().toString(); // "olleh"

// 3. Sử dụng khi Backtracking (append và deleteCharAt)
StringBuilder path = new StringBuilder();
path.append('a');
// ... đệ quy khám phá ...
path.deleteCharAt(path.length() - 1); // backtrack hoàn tác bước đi
```
