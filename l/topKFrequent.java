package l;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/*
    return a int array which contain the key appears the most top down

    hasmap seen <>

    1st get fequency (confused)

    2nd bucket sort - which I would want to call bucket setup
        note: size of the buckets array is nums length + 1, we use the index to be the freq
        some key can have the same freq
    iterate with idx i-- to form each

*/

public class topKFrequent {
  public int[] solution(int[] nums, int k) {
    Map<Integer, Integer> seen = new HashMap<>();

    for (int num : nums) {
      seen.put(num, seen.getOrDefault(num, 0) + 1);
    }

    int max = nums.length + 1;
    List<Integer>[] buckets = new List[max + 1];

    for (int key : seen.keySet()) {
      int freq = seen.get(key);
      if (buckets[freq] == null) {
        buckets[freq] = new ArrayList<>();
      }
      buckets[freq].add(key);
    }

    int idx = 0;
    int[] res = new int[k];
    for (int i = nums.length; i >= 0; i--) {
      if (buckets[i] != null) {
        for (int key : buckets[i]) {
          res[idx++] = key;
          if (k == idx) {
            return res;
          }
        }

      }
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

//