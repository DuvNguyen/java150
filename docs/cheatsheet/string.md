# String Cheatsheet

| Phương thức | Cú pháp | Giá trị trả về | Mô tả |
| :--- | :--- | :--- | :--- |
| `length` | `str.length()` | `int` | Độ dài chuỗi ($O(1)$) |
| `charAt` | `str.charAt(index)` | `char` | Lấy ký tự tại vị trí chỉ định ($O(1)$) |
| `toCharArray` | `str.toCharArray()` | `char[]` | Chuyển chuỗi thành mảng ký tự `char[]` |
| `substring` | `str.substring(from, to)` | `String` | Cắt chuỗi từ `from` đến `to-1` |
| `equals` | `str.equals(other)` | `boolean` | So sánh nội dung 2 chuỗi |
| `equalsIgnoreCase` | `str.equalsIgnoreCase(other)` | `boolean` | So sánh không phân biệt hoa/thường |
| `contains` | `str.contains(subStr)` | `boolean` | Kiểm tra có chứa chuỗi con |
| `indexOf` | `str.indexOf(subStr)` | `int` | Trả về vị trí đầu tiên tìm thấy (hoặc -1) |
| `split` | `str.split(regex)` | `String[]` | Tách chuỗi thành mảng `String[]` |
| `replace` | `str.replace(oldChar, newChar)` | `String` | Thay thế ký tự/chuỗi |
| `trim` | `str.trim()` | `String` | Xóa khoảng trắng 2 đầu |
| `toLowerCase` | `str.toLowerCase()` | `String` | Chuyển thành chữ thường |
| `toUpperCase` | `str.toUpperCase()` | `String` | Chuyển thành chữ hoa |
| `valueOf` | `String.valueOf(val)` | `String` | Chuyển các kiểu dữ liệu khác thành String |

### Ví dụ nhanh:
```java
String s = "eat";
char c = s.charAt(0); // 'e'
char[] chars = s.toCharArray();
```
