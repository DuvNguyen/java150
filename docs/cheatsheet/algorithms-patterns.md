# Algorithm & Pattern Cheatsheet

| Phương thức / Pattern | Cú pháp | Mô tả |
| :--- | :--- | :--- |
| `Inverse Looping (Bucket)` | `for (int i = nums.length; i >= 0; i--) { if (buckets[i] != null) { for (int num : buckets[i]) { res[idx++] = num; if (idx == k) return res; } } }` | Duyệt ngược các thùng từ tần suất cao nhất về thấp nhất để lấy Top K phần tử ($O(N)$) |
| `Frequency Map` | `seen.put(num, seen.getOrDefault(num, 0) + 1)` | Đếm số lần xuất hiện của từng phần tử trong mảng ($O(1)$ mỗi phần tử) |
| `Two Sum Complement` | `int comp = target - num; if (map.containsKey(comp)) return ...;` | Tra cứu phần tử bù trong bảng băm ($O(1)$) |
| `Character Frequency Array` | `int[] count = new int[26]; count[c - 'a']++;` | Mảng đếm tần suất ký tự thay thế HashMap cho chuỗi chữ thường |
| `Prefix Sum Array` | `prefix[i] = prefix[i - 1] + nums[i]` | Tính tổng tiền tố để truy vấn tổng đoạn con trong $O(1)$ |

### Ví dụ chi tiết:

#### Inverse Looping trong Bucket Sort (Top K Frequent):
```java
for (int i = nums.length; i >= 0; i--) {
    if (buckets[i] != null) {
        for (int num : buckets[i]) {
            res[idx++] = num;
            if (idx == k) {
                return res;
            }
        }
    }
}
```
