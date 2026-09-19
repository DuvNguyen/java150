package l;

import java.util.Arrays;

public class Anagram {
    public boolean isAnagram(String s, String t) {
        if (s.toCharArray().length != t.toCharArray().length)
            return false;

        char[] arrayS = s.toCharArray();
        char[] arrayT = t.toCharArray();

        // iterate each character to get the freq

        int[] countS = new int[26];
        int[] countT = new int[26];

        for (int i = 0; i < arrayS.length; i++) {
            countS[arrayS[i] - 'a']++;
            countT[arrayT[i] - 'a']++;
        }

        if (Arrays.toString(countS).equals(Arrays.toString(countT)))
            return true;

        return false;
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