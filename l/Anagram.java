package l;

import java.util.Arrays;

public class Anagram {
    public boolean isAnagram(String s, String t) {
        if (s.length() != t.length())
            return false;

        int[] res = new int[26];
        for (int i = 0; i < s.length(); i++) {
            res[s.charAt(i) - 'a']++;
            res[t.charAt(i) - 'a']--;
        }

        for (int num : res) {
            if (num > 0)
                return false;
        }

        return true;
    }

    public static void main(String[] args) {
        Anagram sol = new Anagram();

        // Test case 1
        String s1 = "racecar", t1 = "carrace";
        System.out.println("Test 1 (\"" + s1 + "\", \"" + t1 + "\"): " + sol.isAnagram(s1, t1));

        // Test case 2
        String s2 = "rat", t2 = "car";
        System.out.println("Test 2 (\"" + s2 + "\", \"" + t2 + "\"): " + sol.isAnagram(s2, t2));
    }
}

/*
 * - sort
 * - length compare
 * - built-in compare function
 */