package l;

import java.util.*;

public class GroupAnagrams {
    public List<List<String>> groupAnagrams(String[] strs) {
        List<String> tempList = new ArrayList<>();
        List<String> originalList = new ArrayList<>(Arrays.asList(strs));
        List<List<String>> destList = new ArrayList<>();

        while (!originalList.isEmpty()) {

            String consider = originalList.get(0); // get the first element to consider
            tempList.clear();

            for (String item : originalList) {
                if (!tempList.contains(consider))
                    tempList.add(consider);

                if (isAnagram(consider, item) && !tempList.contains(item))
                    tempList.add(item);
            }
            originalList.removeAll(tempList);
            destList.add(new ArrayList<>(tempList));
            continue;
        }

        return destList;
    }

    public boolean isAnagram(String s, String t) {
        char[] array1 = s.toCharArray();
        char[] array2 = t.toCharArray();

        if (array1.length != array2.length)
            return false;

        Arrays.sort(array1);
        Arrays.sort(array2);

        if (Arrays.equals(array1, array2))
            return true;
        return false;
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
