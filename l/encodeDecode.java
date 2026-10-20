package l;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class encodeDecode {

    // Encodes a list of strings to a single string.
    public String encode(List<String> strs) {
        // TODO: Cài đặt giải thuật encode của bạn ở đây
        if(strs.isEmpty()) {
            return "";
        }

        StringBuilder res = new StringBuilder();
        for(String s : strs) {
            res.append(s.length()).append("#").append(s);
        }

        return res.toString();
    }

    // Decodes a single string to a list of strings.
    public List<String> decode(String str) {
        // TODO: Cài đặt giải thuật decode của bạn ở đây
        List<String> res = new ArrayList<>();
        
        int idx = 0;
        while (idx < str.length()) {
            int j = str.indexOf("#", idx);
            int start = j + 1;
            int length = Integer.parseInt(str.substring(idx, j));
            int end = start + length;
            res.add(str.substring(start, end));
            idx = end;
        }

        return res;
    }

    public static void main(String[] args) {
        encodeDecode sol = new encodeDecode();

        // 5 Test Cases kiểm thử các trường hợp từ cơ bản đến edge cases:
        List<List<String>> testCases = Arrays.asList(
            // Test Case 1: Các từ thông thường
            Arrays.asList("neet", "code", "love", "you"),

            // Test Case 2: Danh sách chỉ chứa chuỗi rỗng
            Arrays.asList(""),

            // Test Case 3: Danh sách rỗng hoàn toàn
            Arrays.asList(),

            // Test Case 4: Chứa ký tự phân cách đặc biệt, dấu '#', số và khoảng trắng
            Arrays.asList("neet#123", "4#code", "hello world", "###"),

            // Test Case 5: Nhiều chuỗi rỗng liên tiếp kết hợp từ
            Arrays.asList("", "a", "", "", "bc", "")
        );

        int passed = 0;
        for (int i = 0; i < testCases.size(); i++) {
            List<String> input = testCases.get(i);
            String encoded = sol.encode(input);
            List<String> decoded = sol.decode(encoded);

            boolean isMatch = input.equals(decoded);
            if (isMatch) passed++;

            System.out.println("=== Test Case " + (i + 1) + " ===");
            System.out.println("Input   : " + input);
            System.out.println("Encoded : " + encoded);
            System.out.println("Decoded : " + decoded);
            System.out.println("Result  : " + (isMatch ? "PASSED" : "FAILED"));
            System.out.println();
        }

        System.out.println("Tổng kết: " + passed + "/" + testCases.size() + " test cases passed.");
    }
}
