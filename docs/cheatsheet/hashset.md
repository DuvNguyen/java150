# HashSet Cheatsheet

| Phương thức | Cú pháp | Giá trị trả về | Mô tả |
| :--- | :--- | :--- | :--- |
| `add` | `set.add(val)` | `boolean` | Thêm phần tử vào Set; trả về `false` nếu phần tử đã tồn tại (`O(1)`) |
| `contains` | `set.contains(val)` | `boolean` | Kiểm tra phần tử có tồn tại trong Set hay không (`O(1)`) |
| `remove` | `set.remove(val)` | `boolean` | Xóa phần tử khỏi Set; trả về `true` nếu phần tử tồn tại (`O(1)`) |
| `isEmpty` | `set.isEmpty()` | `boolean` | Kiểm tra Set có rỗng hay không (`O(1)`) |
| `size` | `set.size()` | `int` | Lấy số lượng phần tử hiện có trong Set (`O(1)`) |
| `clear` | `set.clear()` | `void` | Xóa sạch toàn bộ phần tử trong Set (`O(N)`) |
| `addAll` | `set.addAll(collection)` | `boolean` | Phép hợp (Union): Thêm tất cả phần tử từ collection khác vào Set |
| `retainAll` | `set.retainAll(collection)` | `boolean` | Phép giao (Intersection): Giữ lại các phần tử cùng xuất hiện trong collection khác |
| `removeAll` | `set.removeAll(collection)` | `boolean` | Phép hiệu (Difference): Xóa các phần tử thuộc collection khác khỏi Set |
| `containsAll` | `set.containsAll(collection)` | `boolean` | Phép tập con (Subset): Kiểm tra Set có chứa mọi phần tử của collection không |
| `iterator` | `set.iterator()` | `Iterator<E>` | Lấy đối tượng `Iterator` để duyệt qua các phần tử |
| `forEach` | `set.forEach(val -> ...)` | `void` | Duyệt qua từng phần tử bằng cú pháp Lambda Expression |
| `toArray` | `set.toArray(new Integer[0])` | `T[]` | Chuyển đổi Set thành mảng thuần `T[]` |
| `toArray` | `set.toArray()` | `Object[]` | Chuyển đổi Set thành mảng `Object[]` |
| `clone` | `set.clone()` | `Object` | Tạo bản sao nông (shallow copy) của HashSet |

### Ví dụ nhanh:
```java
// 1. Khởi tạo HashSet từ Collection hoặc khởi tạo rỗng
Set<Integer> set = new HashSet<>();
Set<Integer> fromList = new HashSet<>(Arrays.asList(1, 2, 2, 3)); // Loại bỏ trùng lặp -> [1, 2, 3]

// 2. Kiểm tra trùng lặp (Contains Duplicate pattern)
boolean hasDuplicate = false;
for (int num : nums) {
    if (!set.add(num)) { // add trả về false nếu đã tồn tại
        hasDuplicate = true;
        break;
    }
}

// 3. Tra cứu nhanh O(1) trong Longest Consecutive Sequence
Set<Integer> numSet = new HashSet<>();
for (int num : nums) numSet.add(num);

int longest = 0;
for (int num : numSet) {
    // Chỉ bắt đầu đếm khi là phần tử đầu của chuỗi
    if (!numSet.contains(num - 1)) {
        int currNum = num;
        int currStreak = 1;
        while (numSet.contains(currNum + 1)) {
            currNum++;
            currStreak++;
        }
        longest = Math.max(longest, currStreak);
    }
}
```
