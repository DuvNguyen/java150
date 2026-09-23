package l;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Problem: Encode and Decode Strings
 * Category: Arrays & Hashing
 * Difficulty: Medium
 * 
 * Design an algorithm to encode a list of strings to a single string.
 * The encoded string is then decoded back to the original list of strings.
 * 
 * Example 1:
 * Input: strs = ["Hello", "World"]
 * Output: ["Hello", "World"]
 * 
 * Example 2:
 * Input: strs = [""]
 * Output: [""]
 * 
 * Constraints:
 * - 0 <= strs.length < 100
 * - 0 <= strs[i].length < 200
 * - strs[i] contains any possible ASCII characters.
 */
public class encodeDecode {

    public String encode(List<String> strs) {

        String res = "";
        for (int i = 0; i < strs.size(); i++) {
            res = res + strs.get(i).length() + "#" + strs.get(i);
            // length + # + word
        }

        return res;
    }

    public List<String> decode(String str) {

        if (str.isEmpty())
            return new ArrayList<>();

        char[] encodedString = str.toCharArray();
        String word = "";
        List<String> res = new ArrayList<>();
        boolean isEmptyArray = true;

        for (char c : encodedString) {
            if (c != '#') {
                isEmptyArray = false;
            }
        }
        if (!isEmptyArray) {
            for (char c : encodedString) {
                if (c == '#') {
                    res.add(word);
                    word = "";
                    continue;
                }
                word = word + c;
            }
            return res;
        }
        res.add("");

        return res;
    }

    public static void main(String[] args) {
        encodeDecode sol = new encodeDecode();

        // Test Case 1
        List<String> tc1 = Arrays.asList("Hello", "World");
        String encoded1 = sol.encode(tc1);
        List<String> decoded1 = sol.decode(encoded1);

        System.out.println("=== Test Case 1 ===");
        System.out.println("Input : " + tc1);
        System.out.println("Encoded : " + encoded1);
        System.out.println("Decoded : " + decoded1);
        System.out.println("Result : " + (tc1.equals(decoded1) ? "PASSED" : "FAILED"));
        System.out.println();

        // Test Case 2
        List<String> tc2 = Arrays.asList("");
        String encoded2 = sol.encode(tc2);
        List<String> decoded2 = sol.decode(encoded2);

        System.out.println("=== Test Case 2 ===");
        System.out.println("Input : " + tc2);
        System.out.println("Encoded : " + encoded2);
        System.out.println("Decoded : " + decoded2);
        System.out.println("Result : " + (tc2.equals(decoded2) ? "PASSED" : "FAILED"));

        // Test Case 3
        List<String> tc3 = Arrays.asList("", "");
        String encoded3 = sol.encode(tc3);
        List<String> decoded3 = sol.decode(encoded3);

        System.out.println("=== Test Case 3 ===");
        System.out.println("Input   : " + tc3);
        System.out.println("Encoded : " + encoded3);
        System.out.println("Decoded : " + decoded3);
        System.out.println("Result  : " + (tc3.equals(decoded3) ? "PASSED" : "FAILED"));

    }
}