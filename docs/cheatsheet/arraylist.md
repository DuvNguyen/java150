# ArrayList Cheatsheet

| Phương thức | Cú pháp | Giá trị trả về | Mô tả |
| :--- | :--- | :--- | :--- |
| `add` | `list.add(val)` | `boolean` | Thêm vào cuối danh sách |
| `add(idx)` | `list.add(index, val)` | `void` | Chèn vào vị trí chỉ định |
| `get` | `list.get(index)` | `E` | Lấy phần tử theo vị trí ($O(1)$) |
| `set` | `list.set(index, val)` | `E` (giá trị cũ) | Sửa giá trị tại vị trí chỉ định |
| `remove(idx)` | `list.remove(index)` | `E` (phần tử bị xóa) | Xóa theo vị trí |
| `remove(obj)` | `list.remove(Object)` | `boolean` | Xóa phần tử xuất hiện đầu tiên |
| `removeAll` | `list.removeAll(collection)` | `boolean` | Xóa tất cả phần tử thuộc danh sách khác |
| `contains` | `list.contains(val)` | `boolean` | Kiểm tra có chứa phần tử ($O(N)$) |
| `indexOf` | `list.indexOf(val)` | `int` | Tìm vị trí đầu tiên xuất hiện (-1 nếu không thấy) |
| `size` | `list.size()` | `int` | Số lượng phần tử |
| `clear` | `list.clear()` | `void` | Xóa rỗng danh sách |
| `sort` | `list.sort(Comparator.naturalOrder())` | `void` | Sắp xếp danh sách tại chỗ |
| `subList` | `list.subList(from, to)` | `List<E>` | Cắt danh sách con (`from` $\rightarrow$ `to-1`) |

### Ví dụ nhanh:
```java
List<String> list = new ArrayList<>(List.of("a", "b"));
list.add("c");
list.remove("a");
```
