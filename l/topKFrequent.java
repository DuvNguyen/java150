package l;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

public class topKFrequent {
    public int[] solution(int[] nums, int k) {
        Map<Integer, Integer> seen = new HashMap<>();

        int max = nums.length + 1;
        int[] bucket = new int[max + 1];
        for (int x = 0; x < max; x++) {
            bucket[nums[x]]++;
        }

        int[] res = new int[k];

        return res;
    }

    public static void main(String[] args) {
        topKFrequent solver = new topKFrequent();

        // Test case 1
        int[] nums1 = { 1, 2, 2, 3, 3, 3 };
        int k1 = 2;
        System.out.println("--- Test Case 1 ---");
        System.out.println("Input: nums = " + Arrays.toString(nums1) + ", k = " + k1);
        System.out.println("Output: " + Arrays.toString(solver.solution(nums1, k1)));
        System.out.println("Expected: [2, 3] (hoặc [3, 2])\n");

        // Test case 2
        int[] nums2 = { 7, 7, 7, 8, 8, 9 };
        int k2 = 1;
        System.out.println("--- Test Case 2 ---");
        System.out.println("Input: nums = " + Arrays.toString(nums2) + ", k = " + k2);
        System.out.println("Output: " + Arrays.toString(solver.solution(nums2, k2)));
        System.out.println("Expected: [7]");
    }
}
