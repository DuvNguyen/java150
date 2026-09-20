package l;

import java.util.Arrays;

public class bucketSort {
    // Thuật toán Bucket Sort chỉ sử dụng mảng int[] cơ bản
    public int[] solution(int[] array) {
        if (array == null || array.length <= 1) {
            return array;
        }

        // Bước 1: Tìm giá trị lớn nhất (max) trong mảng
        // TODO: Duyệt qua mảng array để tìm giá trị max

        // Bước 2: Khởi tạo mảng thùng (buckets) kiểu int[] cơ bản với kích thước (max + 1)
        // TODO: Khởi tạo int[] buckets = new int[max + 1]

        // Bước 3: Đếm số lần xuất hiện của từng giá trị trong mảng
        // TODO: Duyệt mảng array và tăng số lần xuất hiện trong mảng buckets

        // Bước 4: Duyệt mảng buckets và điền các giá trị đã sắp xếp trở lại mảng array
        // TODO: Đổ các phần tử từ buckets trở lại mảng array

        return array;
    }

    public static void main(String[] args) {
        bucketSort solver = new bucketSort();

        // Test Case 1
        int[] array1 = {4, 2, 2, 8, 3, 3, 1};
        System.out.println("--- Test Case 1 ---");
        System.out.println("Input:    " + Arrays.toString(array1));
        System.out.println("Output:   " + Arrays.toString(solver.solution(array1)));
        System.out.println("Expected: [1, 2, 2, 3, 3, 4, 8]\n");

        // Test Case 2
        int[] array2 = {5, 1, 0, 3, 2};
        System.out.println("--- Test Case 2 ---");
        System.out.println("Input:    " + Arrays.toString(array2));
        System.out.println("Output:   " + Arrays.toString(solver.solution(array2)));
        System.out.println("Expected: [0, 1, 2, 3, 5]");
    }
}
