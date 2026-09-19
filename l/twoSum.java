package l;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

public class twoSum {
    public static void main(String[] args) {
        int[] nums = { 2, 7, 11, 15 };
        int target = 9;

        int[] result = twoSum(nums, target);
        System.out.println("Mảng ban đầu: " + Arrays.toString(nums));
        System.out.println("Target: " + target);
        System.out.println("Chỉ số hai số có tổng bằng target: " + Arrays.toString(result));
    }

    public static int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> seen = new HashMap<>();

        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];

            if (seen.containsKey(complement)) {
                return new int[] { seen.get(complement), i };
            }

            seen.put(nums[i], i);
        }

        return new int[] {};
    }
}
