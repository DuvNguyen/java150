package l;

import java.util.Arrays;

public class productOfArrayExceptSelf {
    public int[] productExceptSelf(int[] nums) {
        int[] output = new int[nums.length];
        int product = 1;

        int count0 = 0;
        for (int num : nums) {
            if (num == 0) {
                count0++;
                if (count0 > 1) {
                    return new int[nums.length];
                }
                continue;
            }
            product = product * num;
        }

        for (int i = 0; i < output.length; i++) {
            if (count0 == 1 && nums[i] != 0) {
                output[i] = 0;
                continue;
            }

            if (nums[i] == 0 && count0 == 1) {
                output[i] = product;
                continue;
            }

            output[i] = product / nums[i];
        }

        return output;
    }

    public static void main(String[] args) {
        productOfArrayExceptSelf solver = new productOfArrayExceptSelf();

        // Test case 1: Cơ bản (các số dương)
        int[] nums1 = { 1, 2, 4, 6 };
        System.out.println("Test 1:");
        System.out.println("Input:    " + Arrays.toString(nums1));
        System.out.println("Output:   " + Arrays.toString(solver.productExceptSelf(nums1)));
        System.out.println("Expected: [48, 24, 12, 8]\n");

        // Test case 2: Có 1 số 0 và số âm
        int[] nums2 = { -1, 0, 1, 2, 3 };
        System.out.println("Test 2:");
        System.out.println("Input:    " + Arrays.toString(nums2));
        System.out.println("Output:   " + Arrays.toString(solver.productExceptSelf(nums2)));
        System.out.println("Expected: [0, -6, 0, 0, 0]\n");

        // Test case 3: Có nhiều hơn một số 0 (toàn bộ kết quả sẽ là 0)
        int[] nums3 = { 0, 4, 0 };
        System.out.println("Test 3:");
        System.out.println("Input:    " + Arrays.toString(nums3));
        System.out.println("Output:   " + Arrays.toString(solver.productExceptSelf(nums3)));
        System.out.println("Expected: [0, 0, 0]\n");

        // Test case 4: Mảng có 2 phần tử (kích thước tối thiểu theo ràng buộc)
        int[] nums4 = { 2, 3 };
        System.out.println("Test 4:");
        System.out.println("Input:    " + Arrays.toString(nums4));
        System.out.println("Output:   " + Arrays.toString(solver.productExceptSelf(nums4)));
        System.out.println("Expected: [3, 2]\n");

        // Test case 5: Các số âm xen kẽ
        int[] nums5 = { -1, -2, -3, -4 };
        System.out.println("Test 5:");
        System.out.println("Input:    " + Arrays.toString(nums5));
        System.out.println("Output:   " + Arrays.toString(solver.productExceptSelf(nums5)));
        System.out.println("Expected: [-24, -12, -8, -6]\n");
    }
}
