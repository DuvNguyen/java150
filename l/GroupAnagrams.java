package l;

import java.util.*;

public class GroupAnagrams {

    public List<List<String>> groupAnagrams(String[] strs) {
        // TODO: Cài đặt giải thuật của bạn ở đây
        // hashmap key: pattern, value the list contains same kind

        Map<String, List<String>> anagramBucket = new HashMap<>();

        for (String s : strs) {
            int[] count = new int[26];
            for (char c : s.toCharArray()) {
                count[c - 'a']++;
            }
            String key = Arrays.toString(count);
            if (anagramBucket.get(key) == null) {
                anagramBucket.put(key, new ArrayList<>());
            }
            anagramBucket.get(key).add(s);
        }

        return new ArrayList<>(anagramBucket.values());
    }

    public static void main(String[] args) {
        GroupAnagrams sol = new GroupAnagrams();
        String[] strs = { "eat", "tea", "tan", "ate", "nat", "bat" };
        System.out.println("Input: " + Arrays.toString(strs));
        System.out.println("Output: " + sol.groupAnagrams(strs));
    }
}