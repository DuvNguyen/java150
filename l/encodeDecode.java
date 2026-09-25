package l;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class encodeDecode {

    // Hàm mã hóa: [độ_dài] + '#' + [nội_dung_từ]
    public String encode(List<String> strs) {
        StringBuilder sb = new StringBuilder();
        for (String s : strs) {
            sb.append(s.length()).append('#').append(s);
        }
        return sb.toString();
    }

    // Hàm giải mã: đọc độ dài trước dấu '#' rồi cắt đúng số ký tự tương ứng
    public List<String> decode(String str) {
        List<String> res = new ArrayList<>();
        int i = 0;

        while (i < str.length()) {
            // Bước 1: Tìm vị trí dấu '#' phân cách bắt đầu từ con trỏ i
            int j = str.indexOf('#', i);

            // Bước 2: Đọc số lượng ký tự của từ (độ dài)
            int length = Integer.parseInt(str.substring(i, j));

            // Bước 3: Cắt lấy đúng 'length' ký tự nội dung từ vị trí (j + 1)
            String word = str.substring(j + 1, j + 1 + length);
            res.add(word);

            // Bước 4: Nhảy con trỏ i tới điểm bắt đầu của từ tiếp theo
            i = j + 1 + length;
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
