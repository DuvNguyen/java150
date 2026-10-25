class Solution {
    public boolean isAnagram(String s, String t) {
        if (s.length() != t.length()) {
            return false;
        }
        
        s.toCharArray();
        t.toCharArray();
        
        int[] count = new int[26];
        for(int i = 0; i < s.length(); i++) {
            count[s[i] - 'a']++;
            count[t[i] - 'a']--;
        }

        for(int num : count) {
            if(num != 0) {
                return false;
            }
        }
        return true;
    }
}

/*
count is an array to store the freqency of the char in String s

if their lengh is diff -> not anagram

loop the char: 
for s-> inscrease the freq
with t: if char of t same to char of s -> minus to to freq


if the final count is zero then they are anagrams
*/