public class Anagram {
    public boolean isAnagram(String s, String t) {
        if (s.length() != t.length()) {
            return false;
        }
        
        int[] count = new int[26];
        for(int i = 0; i < s.length(); i++) {
            count[s.charAt(i) - 'a']++;
            count[t.charAt(i) - 'a']--;
        }

        for(int num : count) {
            if(num != 0) {
                return false;
            }
        }
        return true;
    }

    public static void main(String[] args) {
        Anagram solution = new Anagram();

        // Test case 1
        String s1 = "anagram";
        String t1 = "nagaram";
        System.out.println("Test 1: " + solution.isAnagram(s1, t1) + " (Expected: true)");

        // Test case 2
        String s2 = "rat";
        String t2 = "car";
        System.out.println("Test 2: " + solution.isAnagram(s2, t2) + " (Expected: false)");

        // Test case 3
        String s3 = "a";
        String t3 = "ab";
        System.out.println("Test 3: " + solution.isAnagram(s3, t3) + " (Expected: false)");
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
