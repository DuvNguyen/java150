package l;

import java.util.*;

import javax.swing.plaf.ListUI;

public class GroupAnagrams {

    public List<List<String>> groupAnagrams(String[] strs) {
        // String key pattern
        // freq array 26 element

        Map<String, List<String>> res = new HashMap<>();

        for (String s : strs) {
            int[] count = new int[26];
            for (char c : s.toCharArray()) {
                count[c - 'a']++;
            }
            String keyPattern = Arrays.toString(count);
            if (res.get(keyPattern) == null) {
                res.put(keyPattern, new ArrayList<>());
            }
            res.get(keyPattern).add(s);
        }

        return new ArrayList<>(res.values());
    }

    public static void main(String[] args) {
        GroupAnagrams sol = new GroupAnagrams();
        String[] strs = { "eat", "tea", "tan", "ate", "nat", "bat" };
        System.out.println("Input: " + Arrays.toString(strs));
        System.out.println("Output: " + sol.groupAnagrams(strs));
    }
}

/*
 * input: string array
 * -> output: sublists which is the same anagrams
 * 
 * need a function which boolean the anagram
 * store in hashmap <String, String>
 * 
 * 
 * init hashmap iterate in that haspmap if ana assign new value by current array
 * append. Or assign the whole new array
 * 
 * 
 * hashmap seen:
 * 
 * loop strs ->
 * check x, if
 * put in the value
 * 
 */

// This solved the problem but fail the time limit
