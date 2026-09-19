# String Cheatsheet

| Phương thức | Cú pháp | Mô tả |
| :--- | :--- | :--- |
| `length` | `str.length()` | Độ dài chuỗi |
| `charAt` | `str.charAt(index)` | Lấy ký tự tại vị trí chỉ định |
| `toCharArray`| `str.toCharArray()` | Chuyển chuỗi thành mảng ký tự `char[]` |
| `substring` | `str.substring(from, to)` | Cắt chuỗi từ `from` đến `to-1` |
| `equals` | `str.equals(other)` | So sánh nội dung 2 chuỗi |
| `equalsIgnoreCase`| `str.equalsIgnoreCase(other)`| So sánh không phân biệt hoa/thường |
| `contains` | `str.contains(subStr)` | Kiểm tra có chứa chuỗi con |
| `indexOf` | `str.indexOf(subStr)` | Trả về vị trí đầu tiên tìm thấy (hoặc -1) |
| `split` | `str.split(regex)` | Tách chuỗi thành mảng `String[]` |
| `replace` | `str.replace(oldChar, newChar)`| Thay thế ký tự/chuỗi |
| `trim` | `str.trim()` | Xóa khoảng trắng 2 đầu |
| `toLowerCase`| `str.toLowerCase()` | Chuyển thành chữ thường |
| `toUpperCase`| `str.toUpperCase()` | Chuyển thành chữ hoa |
| `valueOf` | `String.valueOf(val)` | Chuyển các kiểu dữ liệu khác thành String |

### Ví dụ nhanh:
```java
String s = "eat";
char c = s.charAt(0); // 'e'
char[] chars = s.toCharArray();
```
