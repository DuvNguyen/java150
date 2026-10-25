package l;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class topKFrequent {
  public int[] solution(int[] nums, int k) {
    // TODO: Cài đặt giải thuật tại đây
    Map<Integer, Integer> seen = new HashMap<>();    
    
    for(int num : nums) {
      seen.put(num, seen.getOrDefault(num, 0) + 1);
    }

    List<Integer>[] buckets = new List[nums.length + 1];
    for(Map.Entry<Integer, Integer> entry : seen.entrySet()) {
      int freq = entry.getValue();
      if(buckets[freq] == null) {
        buckets[freq] = new ArrayList<>();
      }
      buckets[freq].add(entry.getKey()); 
    }

    int[] res = new int[k];
    int idx = 0;
    for (int i = nums.length; i >= 0; i--) {
      if(buckets[i] != null) {
        for(int num : buckets[i]) {
          res[idx++] = num;
          if(idx == k) {
            return res;
          }
        }
      }
    }

    return new int[k];
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
