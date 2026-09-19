# HashMap Cheatsheet

| Phương thức | Cú pháp | Mô tả |
| :--- | :--- | :--- |
| `put` | `map.put(key, val)` | Thêm/Ghi đè cặp Key-Value |
| `get` | `map.get(key)` | Lấy giá trị (trả về `null` nếu không có) |
| `getOrDefault` | `map.getOrDefault(key, defaultVal)` | Lấy giá trị hoặc trả về giá trị mặc định |
| `putIfAbsent` | `map.putIfAbsent(key, val)` | Chỉ thêm nếu Key chưa tồn tại |
| `containsKey` | `map.containsKey(key)` | Kiểm tra Key có tồn tại ($O(1)$) |
| `containsValue` | `map.containsValue(val)` | Kiểm tra Value có tồn tại ($O(N)$) |
| `remove` | `map.remove(key)` | Xóa cặp Key-Value theo Key |
| `keySet` | `map.keySet()` | Lấy tập hợp tất cả các Key |
| `values` | `map.values()` | Lấy tập hợp tất cả các Value |
| `entrySet` | `map.entrySet()` | Lấy tập hợp các cặp `Map.Entry<K,V>` |
| `isEmpty` | `map.isEmpty()` | Kiểm tra Map rỗng |
| `size` | `map.size()` | Lấy số lượng phần tử |
| `clear` | `map.clear()` | Xóa sạch Map |

### Ví dụ nhanh:
```java
Map<String, Integer> map = new HashMap<>();
map.put("a", 1);
map.putIfAbsent("a", 2); // Bị bỏ qua vì "a" đã có
int val = map.getOrDefault("b", 0); // 0
```
