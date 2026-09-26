package l;

import java.util.*;

public class GroupAnagrams {
    public List<List<String>> groupAnagrams(String[] strs) {
        // get the freq array -> create key with that array.
        // use that key put if absent to the List of that key
        Map<String, List<String>> res = new HashMap<>();
        
        for(String s : strs) {
            int[] template = new int[26];
            for (char c : s.toCharArray()) {
                template[c - 'a']++; 
            }


            String key = Arrays.toString(key);
            res.putIfAbsent(key,   String key = template);
        } 


        return new ArrayList<>();
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
