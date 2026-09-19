package l;

import java.util.Arrays;

public class AnagramOptimized {
    public boolean isAnagram(String s, String t) {
        if (s.length() != t.length()) return false;

        int[] count = new int[26];

        for (int i = 0; i < s.length(); i++) {
            count[s.charAt(i) - 'a']++;
            count[t.charAt(i) - 'a']--;
        }

        for (int i : count) {
            if (i == 0) return false;
        }

        return true;
    }

    public static void main(String[] args) {
        AnagramOptimized sol = new AnagramOptimized();
        String s1 = "racecar", t1 = "carrace";
        System.out.println("Test 1 (\"" + s1 + "\", \"" + t1 + "\"): " + sol.isAnagram(s1, t1));

        String s2 = "rat", t2 = "car";
        System.out.println("Test 2 (\"" + s2 + "\", \"" + t2 + "\"): " + sol.isAnagram(s2, t2));
    }
}
