# String Cheatsheet

| Phương thức | Cú pháp | Giá trị trả về | Mô tả |
| :--- | :--- | :--- | :--- |
| `length` | `str.length()` | `int` | Độ dài chuỗi (`O(1)`) |
| `charAt` | `str.charAt(index)` | `char` | Lấy ký tự tại vị trí chỉ định (`O(1)`) |
| `toCharArray` | `str.toCharArray()` | `char[]` | Chuyển chuỗi thành mảng ký tự `char[]` (`O(N)`) |
| `substring` | `str.substring(from, to)` | `String` | Cắt chuỗi từ `from` đến `to-1` (`O(K)`) |
| `join` | `String.join(delimiter, elements)` | `String` | Nối các chuỗi hoặc mảng/List lại với nhau bằng ký tự phân cách |
| `equals` | `str.equals(other)` | `boolean` | So sánh nội dung 2 chuỗi |
| `equalsIgnoreCase` | `str.equalsIgnoreCase(other)` | `boolean` | So sánh không phân biệt hoa/thường |
| `compareTo` | `str.compareTo(other)` | `int` | So sánh thứ tự từ điển (`0`, `<0`, `>0`) |
| `contains` | `str.contains(subStr)` | `boolean` | Kiểm tra có chứa chuỗi con hay không |
| `startsWith` | `str.startsWith(prefix)` | `boolean` | Kiểm tra chuỗi bắt đầu bằng tiền tố |
| `endsWith` | `str.endsWith(suffix)` | `boolean` | Kiểm tra chuỗi kết thúc bằng hậu tố |
| `indexOf` | `str.indexOf(subStr)` / `str.indexOf(subStr, fromIndex)` | `int` | Trả về vị trí đầu tiên tìm thấy của ký tự hoặc chuỗi con (tùy chọn quét từ `fromIndex`), trả về `-1` nếu không có |
| `lastIndexOf` | `str.lastIndexOf(subStr)` / `str.lastIndexOf(subStr, fromIndex)` | `int` | Trả về vị trí cuối cùng tìm thấy của ký tự hoặc chuỗi con (tùy chọn quét ngược từ `fromIndex`), trả về `-1` nếu không có |
| `isEmpty` | `str.isEmpty()` | `boolean` | Kiểm tra chuỗi rỗng (`length() == 0`) |
| `isBlank` | `str.isBlank()` | `boolean` | Kiểm tra chuỗi rỗng hoặc chỉ chứa khoảng trắng (Java 11+) |
| `split` | `str.split(regex)` | `String[]` | Tách chuỗi thành mảng `String[]` theo biểu thức chính quy |
| `replace` | `str.replace(oldChar, newChar)` | `String` | Thay thế ký tự hoặc chuỗi con |
| `replaceAll` | `str.replaceAll(regex, replacement)` | `String` | Thay thế tất cả các đoạn khớp regex |
| `replaceFirst` | `str.replaceFirst(regex, replacement)` | `String` | Thay thế đoạn khớp regex đầu tiên |
| `trim` | `str.trim()` | `String` | Xóa khoảng trắng ở 2 đầu chuỗi |
| `strip` | `str.strip()` | `String` | Xóa khoảng trắng chuẩn Unicode ở 2 đầu (Java 11+) |
| `toLowerCase` | `str.toLowerCase()` | `String` | Chuyển tất cả ký tự thành chữ thường |
| `toUpperCase` | `str.toUpperCase()` | `String` | Chuyển tất cả ký tự thành chữ hoa |
| `repeat` | `str.repeat(count)` | `String` | Lặp lại chuỗi `count` lần (Java 11+) |
| `concat` | `str.concat(other)` | `String` | Nối chuỗi vào đuôi |
| `valueOf` | `String.valueOf(val)` | `String` | Chuyển các kiểu dữ liệu khác (`int`, `char`, `boolean`, `char[]`) thành String |
| `Integer.parseInt` | `Integer.parseInt(str)` | `int` | Chuyển chuỗi số thành số nguyên nguyên thủy (`int`) |

### Ví dụ nhanh:
```java
// 1. Dùng StringBuilder để nối chuỗi tối ưu (tránh O(N^2) khi cộng chuỗi)
StringBuilder sb = new StringBuilder();
for (String word : Arrays.asList("neet", "code", "150")) {
    sb.append(word.length()).append('#').append(word);
}
String encoded = sb.toString(); // "4#neet4#code3#150"

// 2. Chuyển đổi String và số nguyên
String numStr = "123";
int num = Integer.parseInt(numStr); // 123

// 3. Chuyển đổi và thao tác mảng ký tự
String s = "anagram";
char[] chars = s.toCharArray();
Arrays.sort(chars);
String sortedStr = new String(chars); // "aaagmnr"
```

