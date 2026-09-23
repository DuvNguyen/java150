# HashMap Cheatsheet

| Phương thức | Cú pháp | Giá trị trả về | Mô tả |
| :--- | :--- | :--- | :--- |
| `put` | `map.put(key, val)` | `V` (hoặc `null`) | Thêm hoặc ghi đè cặp Key-Value (`O(1)`) |
| `get` | `map.get(key)` | `V` (hoặc `null`) | Lấy giá trị theo Key (trả về `null` nếu không có) (`O(1)`) |
| `getOrDefault` | `map.getOrDefault(key, defaultVal)` | `V` | Lấy giá trị nếu có, ngược lại trả về `defaultVal` (`O(1)`) |
| `putIfAbsent` | `map.putIfAbsent(key, val)` | `V` (hoặc `null`) | Chỉ thêm nếu Key chưa tồn tại (`O(1)`) |
| `computeIfAbsent` | `map.computeIfAbsent(key, k -> new List())` | `V` | Nếu chưa có Key, tự tính toán giá trị mới, lưu vào map và trả về |
| `containsKey` | `map.containsKey(key)` | `boolean` | Kiểm tra Key có tồn tại không (`O(1)`) |
| `containsValue` | `map.containsValue(val)` | `boolean` | Kiểm tra Value có tồn tại không (`O(N)`) |
| `remove` | `map.remove(key)` | `V` (hoặc `null`) | Xóa cặp Key-Value theo Key (`O(1)`) |
| `replace` | `map.replace(key, newVal)` | `V` | Thay thế giá trị nếu Key đã tồn tại |
| `merge` | `map.merge(key, 1, Integer::sum)` | `V` | Gộp hoặc cộng dồn giá trị (tiện đếm tần suất) |
| `keySet` | `map.keySet()` | `Set<K>` | Lấy tập hợp tất cả các Key |
| `values` | `map.values()` | `Collection<V>` | Lấy tập hợp tất cả các Value |
| `entrySet` | `map.entrySet()` | `Set<Map.Entry<K,V>>` | Lấy tập hợp các cặp `Map.Entry<K,V>` để duyệt |
| `forEach` | `map.forEach((k, v) -> ...)` | `void` | Duyệt qua từng cặp Key-Value bằng Lambda |
| `isEmpty` | `map.isEmpty()` | `boolean` | Kiểm tra Map rỗng (`O(1)`) |
| `size` | `map.size()` | `int` | Lấy số lượng phần tử (`O(1)`) |
| `clear` | `map.clear()` | `void` | Xóa sạch toàn bộ phần tử trong Map |

### Ví dụ nhanh:
```java
Map<String, List<String>> anagramMap = new HashMap<>();
// Dùng computeIfAbsent để gom nhóm bài Group Anagrams
anagramMap.computeIfAbsent("aet", k -> new ArrayList<>()).add("eat");
anagramMap.computeIfAbsent("aet", k -> new ArrayList<>()).add("tea");

// Dùng merge hoặc getOrDefault để đếm tần suất
Map<Character, Integer> countMap = new HashMap<>();
for (char c : "anagram".toCharArray()) {
    countMap.put(c, countMap.getOrDefault(c, 0) + 1);
}
```
