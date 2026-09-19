# ArrayList Cheatsheet

| Phương thức | Cú pháp | Mô tả |
| :--- | :--- | :--- |
| `add` | `list.add(val)` | Thêm vào cuối danh sách |
| `add(idx)` | `list.add(index, val)` | Chèn vào vị trí chỉ định |
| `get` | `list.get(index)` | Lấy phần tử theo vị trí ($O(1)$) |
| `set` | `list.set(index, val)` | Sửa giá trị tại vị trí chỉ định |
| `remove(idx)`| `list.remove(index)` | Xóa theo vị trí |
| `remove(obj)`| `list.remove(Object)` | Xóa phần tử xuất hiện đầu tiên |
| `removeAll` | `list.removeAll(collection)` | Xóa tất cả phần tử thuộc danh sách khác |
| `contains` | `list.contains(val)` | Kiểm tra có chứa phần tử ($O(N)$) |
| `indexOf` | `list.indexOf(val)` | Tìm vị trí đầu tiên xuất hiện |
| `size` | `list.size()` | Số lượng phần tử |
| `clear` | `list.clear()` | Xóa rỗng danh sách |
| `sort` | `list.sort(Comparator.naturalOrder())` | Sắp xếp danh sách |
| `subList` | `list.subList(from, to)` | Cắt danh sách con (`from` $\rightarrow$ `to-1`) |

### Ví dụ nhanh:
```java
List<String> list = new ArrayList<>(List.of("a", "b"));
list.add("c");
list.remove("a");
```
