package l;

import java.util.Arrays;

public class productOfArrayExceptSelf {

    public int[] productExceptSelf(int[] nums) {
        // TODO: Cài đặt giải thuật của bạn ở đây
        // Lưu ý: Không dùng phép chia (division) và độ phức tạp thời gian O(n)
        // prefix and suffix store the product after and before i 
            int[] prefix = new int[nums.length];
            int[] suffix = new int[nums.length];

        //prefix
        prefix[0] = 1;
        for(int i = 1; i < nums.length; i++) {
            prefix[i] = prefix[i - 1] * nums[i - 1];
        }        



        int n = nums.length;
        suffix[n - 1] = 1;
        for(int i = n - 2; i >= 0; i--) {
            suffix[i] = suffix[i + 1] * nums[i + 1];
        }

        int[] out = new int[nums.length];
        for(int i = 0; i < nums.length; i++) {
            out[i] = prefix[i] * suffix[i];
        }

        return out;
    }

    public static void main(String[] args) {
        productOfArrayExceptSelf solver = new productOfArrayExceptSelf();

        // 5 Test Cases kiểm thử:
        int[][] testInputs = {
            // Test 1: Cơ bản các số dương
            { 1, 2, 4, 6 },

            // Test 2: Có 1 số 0 và số âm
            { -1, 0, 1, 2, 3 },

            // Test 3: Có nhiều hơn một số 0 (kết quả toàn bộ là 0)
            { 0, 4, 0 },

            // Test 4: Mảng có 2 phần tử (kích thước tối thiểu)
            { 2, 3 },

            // Test 5: Các số âm xen kẽ
            { -1, -2, -3, -4 }
        };

        int[][] expectedOutputs = {
            { 48, 24, 12, 8 },
            { 0, -6, 0, 0, 0 },
            { 0, 0, 0 },
            { 3, 2 },
            { -24, -12, -8, -6 }
        };

        int passed = 0;
        for (int i = 0; i < testInputs.length; i++) {
            int[] input = testInputs[i];
            int[] expected = expectedOutputs[i];
            int[] actual = solver.productExceptSelf(input);

            boolean isMatch = Arrays.equals(expected, actual);
            if (isMatch) passed++;

            System.out.println("=== Test Case " + (i + 1) + " ===");
            System.out.println("Input   : " + Arrays.toString(input));
            System.out.println("Expected: " + Arrays.toString(expected));
            System.out.println("Actual  : " + Arrays.toString(actual));
            System.out.println("Result  : " + (isMatch ? "PASSED" : "FAILED"));
            System.out.println();
        }

        System.out.println("Tổng kết: " + passed + "/" + testInputs.length + " test cases passed.");
    }
}
