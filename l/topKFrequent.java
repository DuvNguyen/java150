package l;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

public class topKFrequent {
    public int[] solution(int[] nums, int k) {
        Map<Integer, Integer> seen = new HashMap<>();

        for (int num : nums) {
            seen.put(num, seen.getOrDefault(num, 0) + 1);
        }

        int[] freq = new int[seen.size()];
        int i = 0;
        for (int key : seen.keySet()) {
            freq[i] = key;
            i++;
        }

        int temp;
        for (int x = 0; x < freq.length; x++) {
            for (int y = x + 1; y < freq.length; y++) {
                if (seen.get(freq[x]) < seen.get(freq[y])) {
                    temp = freq[x];
                    freq[x] = freq[y];
                    freq[y] = temp;
                }
            }
        }

        int[] res = new int[k];

        for (int x = 0; x < k; x++) {
            res[x] = freq[x];
        }

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
