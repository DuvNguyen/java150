package l;

import java.util.*;

public class bucketSort {
    public int[] solution(int[] nums, int k) {
        // Bước 1: Đếm tần số các phần tử bằng HashMap
        Map<Integer, Integer> seen = new HashMap<>();
        for (int num : nums) {
            seen.put(num, seen.getOrDefault(num, 0) + 1);
        }

        // Bước 2: Khởi tạo mảng danh sách thùng (buckets)
        // Kích thước tối đa của tần số là nums.length
        @SuppressWarnings("unchecked")
        List<Integer>[] buckets = new List[nums.length + 1];

        // Bước 3: Đưa các phần tử vào thùng dựa trên tần số (seen.keySet())
        // TODO: Duyệt qua các key trong seen và thêm vào buckets[frequency]

        // Bước 4: Gom k phần tử xuất hiện nhiều nhất (duyệt ngược từ buckets.length - 1 về 0)
        // TODO: Tạo mảng res độ dài k và lấy ra k phần tử có tần số lớn nhất

        return new int[] {};
    }

    public static void main(String[] args) {
        bucketSort solver = new bucketSort();

        // Test Case 1
        int[] nums1 = {1, 1, 1, 2, 2, 3};
        int k1 = 2;
        System.out.println("--- Test Case 1 ---");
        System.out.println("Input: nums = " + Arrays.toString(nums1) + ", k = " + k1);
        System.out.println("Output: " + Arrays.toString(solver.solution(nums1, k1)));
        System.out.println("Expected: [1, 2]\n");

        // Test Case 2
        int[] nums2 = {7, 7, 7, 8, 8, 9};
        int k2 = 1;
        System.out.println("--- Test Case 2 ---");
        System.out.println("Input: nums = " + Arrays.toString(nums2) + ", k = " + k2);
        System.out.println("Output: " + Arrays.toString(solver.solution(nums2, k2)));
        System.out.println("Expected: [7]");
    }
}
