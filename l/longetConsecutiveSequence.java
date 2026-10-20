package l;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

public class longetConsecutiveSequence {

    public int longestConsecutive(int[] nums) {
        // TODO: Cài đặt thuật toán tìm độ dài chuỗi liên tiếp dài nhất với độ phức tạp
        // O(N)
        Set<Integer> set = new HashSet<>();
        for (int num : nums) {
            set.add(num);
        }

        int[] filtered = new int[set.size()];
        int idx = 0;
        for (int num : set) {
            filtered[idx] = num;
            idx++;
        }

        // if we use sort -> it will be n2. Bucket sort?
        int temp;
        for (int i = 0; i < nums.length; i++) {
            for (int j = i; j < nums.length; j++) {
                if (filtered[i] < filtered[i + 1]) {
                    temp = filtered[i];
                    filtered[i] = filtered[i + 1];
                    filtered[i + 1] = temp;
                }
            }
        }

        System.out.println(filtered);

        return 0;
    }

    public static void main(String[] args) {
        longetConsecutiveSequence solver = new longetConsecutiveSequence();

        // Test case 1: Cơ bản (Ví dụ 1 từ đề bài)
        int[] nums1 = { 2, 20, 4, 10, 3, 4, 5 };
        System.out.println("Test 1:");
        System.out.println("Input:    " + Arrays.toString(nums1));
        System.out.println("Output:   " + solver.longestConsecutive(nums1));
        System.out.println("Expected: 4\n"); // Dãy: [2, 3, 4, 5]

        // Test case 2: Chứa số trùng lặp và số 0 (Ví dụ 2 từ đề bài)
        int[] nums2 = { 0, 3, 2, 5, 4, 6, 1, 1 };
        System.out.println("Test 2:");
        System.out.println("Input:    " + Arrays.toString(nums2));
        System.out.println("Output:   " + solver.longestConsecutive(nums2));
        System.out.println("Expected: 7\n"); // Dãy: [0, 1, 2, 3, 4, 5, 6]

        // Test case 3: Mảng rỗng (Trường hợp biên kích thước 0)
        int[] nums3 = {};
        System.out.println("Test 3:");
        System.out.println("Input:    " + Arrays.toString(nums3));
        System.out.println("Output:   " + solver.longestConsecutive(nums3));
        System.out.println("Expected: 0\n");

        // Test case 4: Dãy chứa cả số âm và số dương
        int[] nums4 = { 9, 1, 4, 7, 3, -1, 0, 5, 8, -2, 6 };
        System.out.println("Test 4:");
        System.out.println("Input:    " + Arrays.toString(nums4));
        System.out.println("Output:   " + solver.longestConsecutive(nums4));
        System.out.println("Expected: 7\n"); // Dãy: [3, 4, 5, 6, 7, 8, 9] (độ dài 7)
    }
}
