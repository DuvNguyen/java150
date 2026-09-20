# HashMap Cheatsheet

| Phương thức | Cú pháp | Giá trị trả về | Mô tả |
| :--- | :--- | :--- | :--- |
| `put` | `map.put(key, val)` | `V` (hoặc `null`) | Thêm/Ghi đè cặp Key-Value |
| `get` | `map.get(key)` | `V` (hoặc `null`) | Lấy giá trị (trả về `null` nếu không có) |
| `getOrDefault` | `map.getOrDefault(key, defaultVal)` | `V` | Lấy giá trị hoặc trả về giá trị mặc định |
| `putIfAbsent` | `map.putIfAbsent(key, val)` | `V` (hoặc `null`) | Chỉ thêm nếu Key chưa tồn tại |
| `containsKey` | `map.containsKey(key)` | `boolean` | Kiểm tra Key có tồn tại ($O(1)$) |
| `containsValue` | `map.containsValue(val)` | `boolean` | Kiểm tra Value có tồn tại ($O(N)$) |
| `remove` | `map.remove(key)` | `V` (hoặc `null`) | Xóa cặp Key-Value theo Key |
| `keySet` | `map.keySet()` | `Set<K>` | Lấy tập hợp tất cả các Key |
| `values` | `map.values()` | `Collection<V>` | Lấy tập hợp tất cả các Value |
| `entrySet` | `map.entrySet()` | `Set<Map.Entry<K,V>>` | Lấy tập hợp các cặp `Map.Entry<K,V>` |
| `isEmpty` | `map.isEmpty()` | `boolean` | Kiểm tra Map rỗng |
| `size` | `map.size()` | `int` | Lấy số lượng phần tử |
| `clear` | `map.clear()` | `void` | Xóa sạch Map |

### Ví dụ nhanh:
```java
Map<String, Integer> map = new HashMap<>();
map.put("a", 1);
map.putIfAbsent("a", 2); // Bị bỏ qua vì "a" đã có
int val = map.getOrDefault("b", 0); // 0
```
