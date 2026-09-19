package l;

import java.util.HashMap;
import java.util.Map;

public class frequency {
    public static void main(String[] args) {
        String s = "hello";
        Map<Character, Integer> freq = new HashMap<>(); // init
        for (char c : s.toCharArray()) {
            freq.put(c, freq.getOrDefault(c, 0) + 1);
        }
        System.out.println(freq);
    }
}
