# Algorithm & Pattern Cheatsheet

| Phương thức / Pattern | Cú pháp | Mô tả |
| :--- | :--- | :--- |
| `Bucket Sort (Top K Frequent)` | `for (int key : seen.keySet()) { int freq = seen.get(key); if (buckets[freq] == null) buckets[freq] = new ArrayList<>(); buckets[freq].add(key); }` | Phân phối các phần tử vào mảng thùng `List<Integer>[]` theo tần suất xuất hiện ($O(N)$) |
| `Inverse Looping (Bucket)` | `for (int i = nums.length; i >= 0; i--) { if (buckets[i] != null) { for (int num : buckets[i]) { res[idx++] = num; if (idx == k) return res; } } }` | Duyệt ngược các thùng từ tần suất cao nhất về thấp nhất để lấy Top K phần tử ($O(N)$) |
| `Frequency Map` | `seen.put(num, seen.getOrDefault(num, 0) + 1)` | Đếm số lần xuất hiện của từng phần tử trong mảng ($O(1)$ mỗi phần tử) |
| `Two Sum Complement` | `int comp = target - num; if (map.containsKey(comp)) return ...;` | Tra cứu phần tử bù trong bảng băm ($O(1)$) |
| `Character Frequency Array` | `int[] count = new int[26]; count[c - 'a']++;` | Mảng đếm tần suất ký tự thay thế HashMap cho chuỗi chữ thường |
| `Prefix Sum Array` | `prefix[i] = prefix[i - 1] + nums[i]` | Tính tổng tiền tố để truy vấn tổng đoạn con trong $O(1)$ |

### Ví dụ chi tiết:

#### 1. Xếp phần tử vào thùng theo tần suất (Bucket Sort Top K Frequent):
```java
// Khởi tạo mảng các thùng: List<Integer>[] buckets = new List[nums.length + 1];
for (int key : seen.keySet()) {
    int freq = seen.get(key);
    if (buckets[freq] == null) {
        buckets[freq] = new ArrayList<>();
    }
    buckets[freq].add(key);
}
```

#### 2. Duyệt ngược lấy Top K phần tử (Inverse Looping):
```java
// int[] res = new int[k]; int idx = 0;
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
