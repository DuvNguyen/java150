package l;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class encodeDecode {

    public String encode(List<String> strs) {
        StringBuilder res = new StringBuilder();
        for (String str : strs) {
            res.append(str.length()).append('#').append(str);
        }
        return res.toString();
    }

    public List<String> decode(String str) {
        List<String> res = new ArrayList<>();
        int i = 0;
        while (i < str.length()) {
            int j = str.indexOf('#', i);
            int length = Integer.parseInt(str.substring(i, j));
            int start = j + 1;
            int end = start + length;
            res.add(str.substring(start, end));
            i = end;
        }
        return res;
    }

    public static void main(String[] args) {
        encodeDecode sol = new encodeDecode();

        // Test Case 1: Các từ thông thường
        List<String> tc1 = Arrays.asList("Hello", "World");
        String encoded1 = sol.encode(tc1);
        List<String> decoded1 = sol.decode(encoded1);

        System.out.println("=== Test Case 1 ===");
        System.out.println("Input   : " + tc1);
        System.out.println("Encoded : " + encoded1);
        System.out.println("Decoded : " + decoded1);
        System.out.println("Result  : " + (tc1.equals(decoded1) ? "PASSED" : "FAILED"));
        System.out.println();

        // Test Case 2: Chuỗi rỗng
        List<String> tc2 = Arrays.asList("");
        String encoded2 = sol.encode(tc2);
        List<String> decoded2 = sol.decode(encoded2);

        System.out.println("=== Test Case 2 ===");
        System.out.println("Input   : " + tc2);
        System.out.println("Encoded : " + encoded2);
        System.out.println("Decoded : " + decoded2);
        System.out.println("Result  : " + (tc2.equals(decoded2) ? "PASSED" : "FAILED"));
        System.out.println();

        // Test Case 3: Chứa ký tự đặc biệt và dấu '#'
        List<String> tc3 = Arrays.asList("neet#123", "4#code", "");
        String encoded3 = sol.encode(tc3);
        List<String> decoded3 = sol.decode(encoded3);

        System.out.println("=== Test Case 3 ===");
        System.out.println("Input   : " + tc3);
        System.out.println("Encoded : " + encoded3);
        System.out.println("Decoded : " + decoded3);
        System.out.println("Result  : " + (tc3.equals(decoded3) ? "PASSED" : "FAILED"));
    }
}
