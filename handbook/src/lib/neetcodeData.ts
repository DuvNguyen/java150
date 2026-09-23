export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface NeetCodeProblem {
  id: string;
  index: number;
  name: string;
  difficulty: Difficulty;
  topicId: string;
  topicName: string;
  leetcodeUrl: string;
  neetcodeUrl: string;
  javaFilePath: string;
}

export interface TopicNeetCodeGroup {
  topicId: string;
  topicName: string;
  problems: NeetCodeProblem[];
}

export const NEETCODE_TOPICS: TopicNeetCodeGroup[] = [
  {
    "topicId": "arrays-hashing",
    "topicName": "Arrays & Hashing",
    "problems": [
      {
        "id": "nc_1",
        "index": 1,
        "name": "Contains Duplicate",
        "difficulty": "Easy",
        "topicId": "arrays-hashing",
        "topicName": "Arrays & Hashing",
        "leetcodeUrl": "https://leetcode.com/problems/contains-duplicate/",
        "neetcodeUrl": "https://neetcode.io/problems/duplicate-integer?list=neetcode150",
        "javaFilePath": "src/Arrays___Hashing/ContainsDuplicate.java"
      },
      {
        "id": "nc_2",
        "index": 2,
        "name": "Valid Anagram",
        "difficulty": "Easy",
        "topicId": "arrays-hashing",
        "topicName": "Arrays & Hashing",
        "leetcodeUrl": "https://leetcode.com/problems/valid-anagram/",
        "neetcodeUrl": "https://neetcode.io/problems/is-anagram?list=neetcode150",
        "javaFilePath": "src/Arrays___Hashing/ValidAnagram.java"
      },
      {
        "id": "nc_3",
        "index": 3,
        "name": "Two Sum",
        "difficulty": "Easy",
        "topicId": "arrays-hashing",
        "topicName": "Arrays & Hashing",
        "leetcodeUrl": "https://leetcode.com/problems/two-sum/",
        "neetcodeUrl": "https://neetcode.io/problems/two-integer-sum?list=neetcode150",
        "javaFilePath": "src/Arrays___Hashing/TwoSum.java"
      },
      {
        "id": "nc_4",
        "index": 4,
        "name": "Group Anagrams",
        "difficulty": "Medium",
        "topicId": "arrays-hashing",
        "topicName": "Arrays & Hashing",
        "leetcodeUrl": "https://leetcode.com/problems/group-anagrams/",
        "neetcodeUrl": "https://neetcode.io/problems/anagram-groups?list=neetcode150",
        "javaFilePath": "src/Arrays___Hashing/GroupAnagrams.java"
      },
      {
        "id": "nc_5",
        "index": 5,
        "name": "Top K Frequent Elements",
        "difficulty": "Medium",
        "topicId": "arrays-hashing",
        "topicName": "Arrays & Hashing",
        "leetcodeUrl": "https://leetcode.com/problems/top-k-frequent-elements/",
        "neetcodeUrl": "https://neetcode.io/problems/top-k-elements-in-list?list=neetcode150",
        "javaFilePath": "src/Arrays___Hashing/TopKFrequentElements.java"
      },
      {
        "id": "nc_6",
        "index": 6,
        "name": "Encode and Decode Strings",
        "difficulty": "Medium",
        "topicId": "arrays-hashing",
        "topicName": "Arrays & Hashing",
        "leetcodeUrl": "https://leetcode.com/problems/encode-and-decode-strings/",
        "neetcodeUrl": "https://neetcode.io/problems/string-encode-and-decode?list=neetcode150",
        "javaFilePath": "src/Arrays___Hashing/EncodeandDecodeStrings.java"
      },
      {
        "id": "nc_7",
        "index": 7,
        "name": "Product of Array Except Self",
        "difficulty": "Medium",
        "topicId": "arrays-hashing",
        "topicName": "Arrays & Hashing",
        "leetcodeUrl": "https://leetcode.com/problems/product-of-array-except-self/",
        "neetcodeUrl": "https://neetcode.io/problems/products-of-array-discluding-self?list=neetcode150",
        "javaFilePath": "src/Arrays___Hashing/ProductofArrayExceptSelf.java"
      },
      {
        "id": "nc_8",
        "index": 8,
        "name": "Valid Sudoku",
        "difficulty": "Medium",
        "topicId": "arrays-hashing",
        "topicName": "Arrays & Hashing",
        "leetcodeUrl": "https://leetcode.com/problems/valid-sudoku/",
        "neetcodeUrl": "https://neetcode.io/problems/valid-sudoku?list=neetcode150",
        "javaFilePath": "src/Arrays___Hashing/ValidSudoku.java"
      },
      {
        "id": "nc_9",
        "index": 9,
        "name": "Longest Consecutive Sequence",
        "difficulty": "Medium",
        "topicId": "arrays-hashing",
        "topicName": "Arrays & Hashing",
        "leetcodeUrl": "https://leetcode.com/problems/longest-consecutive-sequence/",
        "neetcodeUrl": "https://neetcode.io/problems/longest-consecutive-sequence?list=neetcode150",
        "javaFilePath": "src/Arrays___Hashing/LongestConsecutiveSequence.java"
      }
    ]
  },
  {
    "topicId": "two-pointers",
    "topicName": "Two Pointers",
    "problems": [
      {
        "id": "nc_10",
        "index": 10,
        "name": "Valid Palindrome",
        "difficulty": "Easy",
        "topicId": "two-pointers",
        "topicName": "Two Pointers",
        "leetcodeUrl": "https://leetcode.com/problems/valid-palindrome/",
        "neetcodeUrl": "https://neetcode.io/problems/is-palindrome?list=neetcode150",
        "javaFilePath": "src/Two_Pointers/ValidPalindrome.java"
      },
      {
        "id": "nc_11",
        "index": 11,
        "name": "Two Sum II Input Array Is Sorted",
        "difficulty": "Medium",
        "topicId": "two-pointers",
        "topicName": "Two Pointers",
        "leetcodeUrl": "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/",
        "neetcodeUrl": "https://neetcode.io/problems/two-integer-sum-ii?list=neetcode150",
        "javaFilePath": "src/Two_Pointers/TwoSumIIInputArrayIsSorted.java"
      },
      {
        "id": "nc_12",
        "index": 12,
        "name": "3Sum",
        "difficulty": "Medium",
        "topicId": "two-pointers",
        "topicName": "Two Pointers",
        "leetcodeUrl": "https://leetcode.com/problems/3sum/",
        "neetcodeUrl": "https://neetcode.io/problems/three-integer-sum?list=neetcode150",
        "javaFilePath": "src/Two_Pointers/3Sum.java"
      },
      {
        "id": "nc_13",
        "index": 13,
        "name": "Container With Most Water",
        "difficulty": "Medium",
        "topicId": "two-pointers",
        "topicName": "Two Pointers",
        "leetcodeUrl": "https://leetcode.com/problems/container-with-most-water/",
        "neetcodeUrl": "https://neetcode.io/problems/max-water-container?list=neetcode150",
        "javaFilePath": "src/Two_Pointers/ContainerWithMostWater.java"
      },
      {
        "id": "nc_14",
        "index": 14,
        "name": "Trapping Rain Water",
        "difficulty": "Hard",
        "topicId": "two-pointers",
        "topicName": "Two Pointers",
        "leetcodeUrl": "https://leetcode.com/problems/trapping-rain-water/",
        "neetcodeUrl": "https://neetcode.io/problems/trapping-rain-water?list=neetcode150",
        "javaFilePath": "src/Two_Pointers/TrappingRainWater.java"
      }
    ]
  },
  {
    "topicId": "sliding-window",
    "topicName": "Sliding Window",
    "problems": [
      {
        "id": "nc_15",
        "index": 15,
        "name": "Best Time to Buy And Sell Stock",
        "difficulty": "Easy",
        "topicId": "sliding-window",
        "topicName": "Sliding Window",
        "leetcodeUrl": "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
        "neetcodeUrl": "https://neetcode.io/problems/buy-and-sell-crypto?list=neetcode150",
        "javaFilePath": "src/Sliding_Window/BestTimetoBuyAndSellStock.java"
      },
      {
        "id": "nc_16",
        "index": 16,
        "name": "Longest Substring Without Repeating Characters",
        "difficulty": "Medium",
        "topicId": "sliding-window",
        "topicName": "Sliding Window",
        "leetcodeUrl": "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
        "neetcodeUrl": "https://neetcode.io/problems/longest-substring-without-duplicates?list=neetcode150",
        "javaFilePath": "src/Sliding_Window/LongestSubstringWithoutRepeatingCharacters.java"
      },
      {
        "id": "nc_17",
        "index": 17,
        "name": "Longest Repeating Character Replacement",
        "difficulty": "Medium",
        "topicId": "sliding-window",
        "topicName": "Sliding Window",
        "leetcodeUrl": "https://leetcode.com/problems/longest-repeating-character-replacement/",
        "neetcodeUrl": "https://neetcode.io/problems/longest-repeating-substring-with-replacement?list=neetcode150",
        "javaFilePath": "src/Sliding_Window/LongestRepeatingCharacterReplacement.java"
      },
      {
        "id": "nc_18",
        "index": 18,
        "name": "Permutation In String",
        "difficulty": "Medium",
        "topicId": "sliding-window",
        "topicName": "Sliding Window",
        "leetcodeUrl": "https://leetcode.com/problems/permutation-in-string/",
        "neetcodeUrl": "https://neetcode.io/problems/permutation-string?list=neetcode150",
        "javaFilePath": "src/Sliding_Window/PermutationInString.java"
      },
      {
        "id": "nc_19",
        "index": 19,
        "name": "Minimum Window Substring",
        "difficulty": "Hard",
        "topicId": "sliding-window",
        "topicName": "Sliding Window",
        "leetcodeUrl": "https://leetcode.com/problems/minimum-window-substring/",
        "neetcodeUrl": "https://neetcode.io/problems/minimum-window-with-characters?list=neetcode150",
        "javaFilePath": "src/Sliding_Window/MinimumWindowSubstring.java"
      },
      {
        "id": "nc_20",
        "index": 20,
        "name": "Sliding Window Maximum",
        "difficulty": "Hard",
        "topicId": "sliding-window",
        "topicName": "Sliding Window",
        "leetcodeUrl": "https://leetcode.com/problems/sliding-window-maximum/",
        "neetcodeUrl": "https://neetcode.io/problems/sliding-window-maximum?list=neetcode150",
        "javaFilePath": "src/Sliding_Window/SlidingWindowMaximum.java"
      }
    ]
  },
  {
    "topicId": "stack",
    "topicName": "Stack",
    "problems": [
      {
        "id": "nc_21",
        "index": 21,
        "name": "Valid Parentheses",
        "difficulty": "Easy",
        "topicId": "stack",
        "topicName": "Stack",
        "leetcodeUrl": "https://leetcode.com/problems/valid-parentheses/",
        "neetcodeUrl": "https://neetcode.io/problems/validate-parentheses?list=neetcode150",
        "javaFilePath": "src/Stack/ValidParentheses.java"
      },
      {
        "id": "nc_22",
        "index": 22,
        "name": "Min Stack",
        "difficulty": "Medium",
        "topicId": "stack",
        "topicName": "Stack",
        "leetcodeUrl": "https://leetcode.com/problems/min-stack/",
        "neetcodeUrl": "https://neetcode.io/problems/minimum-stack?list=neetcode150",
        "javaFilePath": "src/Stack/MinStack.java"
      },
      {
        "id": "nc_23",
        "index": 23,
        "name": "Evaluate Reverse Polish Notation",
        "difficulty": "Medium",
        "topicId": "stack",
        "topicName": "Stack",
        "leetcodeUrl": "https://leetcode.com/problems/evaluate-reverse-polish-notation/",
        "neetcodeUrl": "https://neetcode.io/problems/evaluate-reverse-polish-notation?list=neetcode150",
        "javaFilePath": "src/Stack/EvaluateReversePolishNotation.java"
      },
      {
        "id": "nc_24",
        "index": 24,
        "name": "Daily Temperatures",
        "difficulty": "Medium",
        "topicId": "stack",
        "topicName": "Stack",
        "leetcodeUrl": "https://leetcode.com/problems/daily-temperatures/",
        "neetcodeUrl": "https://neetcode.io/problems/daily-temperatures?list=neetcode150",
        "javaFilePath": "src/Stack/DailyTemperatures.java"
      },
      {
        "id": "nc_25",
        "index": 25,
        "name": "Car Fleet",
        "difficulty": "Medium",
        "topicId": "stack",
        "topicName": "Stack",
        "leetcodeUrl": "https://leetcode.com/problems/car-fleet/",
        "neetcodeUrl": "https://neetcode.io/problems/car-fleet?list=neetcode150",
        "javaFilePath": "src/Stack/CarFleet.java"
      },
      {
        "id": "nc_26",
        "index": 26,
        "name": "Largest Rectangle In Histogram",
        "difficulty": "Hard",
        "topicId": "stack",
        "topicName": "Stack",
        "leetcodeUrl": "https://leetcode.com/problems/largest-rectangle-in-histogram/",
        "neetcodeUrl": "https://neetcode.io/problems/largest-rectangle-in-histogram?list=neetcode150",
        "javaFilePath": "src/Stack/LargestRectangleInHistogram.java"
      }
    ]
  },
  {
    "topicId": "binary-search",
    "topicName": "Binary Search",
    "problems": [
      {
        "id": "nc_27",
        "index": 27,
        "name": "Binary Search",
        "difficulty": "Easy",
        "topicId": "binary-search",
        "topicName": "Binary Search",
        "leetcodeUrl": "https://leetcode.com/problems/binary-search/",
        "neetcodeUrl": "https://neetcode.io/problems/binary-search?list=neetcode150",
        "javaFilePath": "src/Binary_Search/BinarySearch.java"
      },
      {
        "id": "nc_28",
        "index": 28,
        "name": "Search a 2D Matrix",
        "difficulty": "Medium",
        "topicId": "binary-search",
        "topicName": "Binary Search",
        "leetcodeUrl": "https://leetcode.com/problems/search-a-2d-matrix/",
        "neetcodeUrl": "https://neetcode.io/problems/search-2d-matrix?list=neetcode150",
        "javaFilePath": "src/Binary_Search/Searcha2DMatrix.java"
      },
      {
        "id": "nc_29",
        "index": 29,
        "name": "Koko Eating Bananas",
        "difficulty": "Medium",
        "topicId": "binary-search",
        "topicName": "Binary Search",
        "leetcodeUrl": "https://leetcode.com/problems/koko-eating-bananas/",
        "neetcodeUrl": "https://neetcode.io/problems/eating-bananas?list=neetcode150",
        "javaFilePath": "src/Binary_Search/KokoEatingBananas.java"
      },
      {
        "id": "nc_30",
        "index": 30,
        "name": "Find Minimum In Rotated Sorted Array",
        "difficulty": "Medium",
        "topicId": "binary-search",
        "topicName": "Binary Search",
        "leetcodeUrl": "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/",
        "neetcodeUrl": "https://neetcode.io/problems/find-minimum-in-rotated-sorted-array?list=neetcode150",
        "javaFilePath": "src/Binary_Search/FindMinimumInRotatedSortedArray.java"
      },
      {
        "id": "nc_31",
        "index": 31,
        "name": "Search In Rotated Sorted Array",
        "difficulty": "Medium",
        "topicId": "binary-search",
        "topicName": "Binary Search",
        "leetcodeUrl": "https://leetcode.com/problems/search-in-rotated-sorted-array/",
        "neetcodeUrl": "https://neetcode.io/problems/find-target-in-rotated-sorted-array?list=neetcode150",
        "javaFilePath": "src/Binary_Search/SearchInRotatedSortedArray.java"
      },
      {
        "id": "nc_32",
        "index": 32,
        "name": "Time Based Key Value Store",
        "difficulty": "Medium",
        "topicId": "binary-search",
        "topicName": "Binary Search",
        "leetcodeUrl": "https://leetcode.com/problems/time-based-key-value-store/",
        "neetcodeUrl": "https://neetcode.io/problems/time-based-key-value-store?list=neetcode150",
        "javaFilePath": "src/Binary_Search/TimeBasedKeyValueStore.java"
      },
      {
        "id": "nc_33",
        "index": 33,
        "name": "Median of Two Sorted Arrays",
        "difficulty": "Hard",
        "topicId": "binary-search",
        "topicName": "Binary Search",
        "leetcodeUrl": "https://leetcode.com/problems/median-of-two-sorted-arrays/",
        "neetcodeUrl": "https://neetcode.io/problems/median-of-two-sorted-arrays?list=neetcode150",
        "javaFilePath": "src/Binary_Search/MedianofTwoSortedArrays.java"
      }
    ]
  },
  {
    "topicId": "linked-list",
    "topicName": "Linked List",
    "problems": [
      {
        "id": "nc_34",
        "index": 34,
        "name": "Reverse Linked List",
        "difficulty": "Easy",
        "topicId": "linked-list",
        "topicName": "Linked List",
        "leetcodeUrl": "https://leetcode.com/problems/reverse-linked-list/",
        "neetcodeUrl": "https://neetcode.io/problems/reverse-a-linked-list?list=neetcode150",
        "javaFilePath": "src/Linked_List/ReverseLinkedList.java"
      },
      {
        "id": "nc_35",
        "index": 35,
        "name": "Merge Two Sorted Lists",
        "difficulty": "Easy",
        "topicId": "linked-list",
        "topicName": "Linked List",
        "leetcodeUrl": "https://leetcode.com/problems/merge-two-sorted-lists/",
        "neetcodeUrl": "https://neetcode.io/problems/merge-two-sorted-linked-lists?list=neetcode150",
        "javaFilePath": "src/Linked_List/MergeTwoSortedLists.java"
      },
      {
        "id": "nc_36",
        "index": 36,
        "name": "Linked List Cycle",
        "difficulty": "Easy",
        "topicId": "linked-list",
        "topicName": "Linked List",
        "leetcodeUrl": "https://leetcode.com/problems/linked-list-cycle/",
        "neetcodeUrl": "https://neetcode.io/problems/linked-list-cycle-detection?list=neetcode150",
        "javaFilePath": "src/Linked_List/LinkedListCycle.java"
      },
      {
        "id": "nc_37",
        "index": 37,
        "name": "Reorder List",
        "difficulty": "Medium",
        "topicId": "linked-list",
        "topicName": "Linked List",
        "leetcodeUrl": "https://leetcode.com/problems/reorder-list/",
        "neetcodeUrl": "https://neetcode.io/problems/reorder-linked-list?list=neetcode150",
        "javaFilePath": "src/Linked_List/ReorderList.java"
      },
      {
        "id": "nc_38",
        "index": 38,
        "name": "Remove Nth Node From End of List",
        "difficulty": "Medium",
        "topicId": "linked-list",
        "topicName": "Linked List",
        "leetcodeUrl": "https://leetcode.com/problems/remove-nth-node-from-end-of-list/",
        "neetcodeUrl": "https://neetcode.io/problems/remove-node-from-end-of-linked-list?list=neetcode150",
        "javaFilePath": "src/Linked_List/RemoveNthNodeFromEndofList.java"
      },
      {
        "id": "nc_39",
        "index": 39,
        "name": "Copy List With Random Pointer",
        "difficulty": "Medium",
        "topicId": "linked-list",
        "topicName": "Linked List",
        "leetcodeUrl": "https://leetcode.com/problems/copy-list-with-random-pointer/",
        "neetcodeUrl": "https://neetcode.io/problems/copy-linked-list-with-random-pointer?list=neetcode150",
        "javaFilePath": "src/Linked_List/CopyListWithRandomPointer.java"
      },
      {
        "id": "nc_40",
        "index": 40,
        "name": "Add Two Numbers",
        "difficulty": "Medium",
        "topicId": "linked-list",
        "topicName": "Linked List",
        "leetcodeUrl": "https://leetcode.com/problems/add-two-numbers/",
        "neetcodeUrl": "https://neetcode.io/problems/add-two-numbers?list=neetcode150",
        "javaFilePath": "src/Linked_List/AddTwoNumbers.java"
      },
      {
        "id": "nc_41",
        "index": 41,
        "name": "Find The Duplicate Number",
        "difficulty": "Medium",
        "topicId": "linked-list",
        "topicName": "Linked List",
        "leetcodeUrl": "https://leetcode.com/problems/find-the-duplicate-number/",
        "neetcodeUrl": "https://neetcode.io/problems/find-duplicate-integer?list=neetcode150",
        "javaFilePath": "src/Linked_List/FindTheDuplicateNumber.java"
      },
      {
        "id": "nc_42",
        "index": 42,
        "name": "LRU Cache",
        "difficulty": "Medium",
        "topicId": "linked-list",
        "topicName": "Linked List",
        "leetcodeUrl": "https://leetcode.com/problems/lru-cache/",
        "neetcodeUrl": "https://neetcode.io/problems/lru-cache?list=neetcode150",
        "javaFilePath": "src/Linked_List/LRUCache.java"
      },
      {
        "id": "nc_43",
        "index": 43,
        "name": "Merge K Sorted Lists",
        "difficulty": "Hard",
        "topicId": "linked-list",
        "topicName": "Linked List",
        "leetcodeUrl": "https://leetcode.com/problems/merge-k-sorted-lists/",
        "neetcodeUrl": "https://neetcode.io/problems/merge-k-sorted-linked-lists?list=neetcode150",
        "javaFilePath": "src/Linked_List/MergeKSortedLists.java"
      },
      {
        "id": "nc_44",
        "index": 44,
        "name": "Reverse Nodes In K Group",
        "difficulty": "Hard",
        "topicId": "linked-list",
        "topicName": "Linked List",
        "leetcodeUrl": "https://leetcode.com/problems/reverse-nodes-in-k-group/",
        "neetcodeUrl": "https://neetcode.io/problems/reverse-nodes-in-k-group?list=neetcode150",
        "javaFilePath": "src/Linked_List/ReverseNodesInKGroup.java"
      }
    ]
  },
  {
    "topicId": "trees",
    "topicName": "Trees",
    "problems": [
      {
        "id": "nc_45",
        "index": 45,
        "name": "Invert Binary Tree",
        "difficulty": "Easy",
        "topicId": "trees",
        "topicName": "Trees",
        "leetcodeUrl": "https://leetcode.com/problems/invert-binary-tree/",
        "neetcodeUrl": "https://neetcode.io/problems/invert-a-binary-tree?list=neetcode150",
        "javaFilePath": "src/Trees/InvertBinaryTree.java"
      },
      {
        "id": "nc_46",
        "index": 46,
        "name": "Maximum Depth of Binary Tree",
        "difficulty": "Easy",
        "topicId": "trees",
        "topicName": "Trees",
        "leetcodeUrl": "https://leetcode.com/problems/maximum-depth-of-binary-tree/",
        "neetcodeUrl": "https://neetcode.io/problems/depth-of-binary-tree?list=neetcode150",
        "javaFilePath": "src/Trees/MaximumDepthofBinaryTree.java"
      },
      {
        "id": "nc_47",
        "index": 47,
        "name": "Diameter of Binary Tree",
        "difficulty": "Easy",
        "topicId": "trees",
        "topicName": "Trees",
        "leetcodeUrl": "https://leetcode.com/problems/diameter-of-binary-tree/",
        "neetcodeUrl": "https://neetcode.io/problems/binary-tree-diameter?list=neetcode150",
        "javaFilePath": "src/Trees/DiameterofBinaryTree.java"
      },
      {
        "id": "nc_48",
        "index": 48,
        "name": "Balanced Binary Tree",
        "difficulty": "Easy",
        "topicId": "trees",
        "topicName": "Trees",
        "leetcodeUrl": "https://leetcode.com/problems/balanced-binary-tree/",
        "neetcodeUrl": "https://neetcode.io/problems/balanced-binary-tree?list=neetcode150",
        "javaFilePath": "src/Trees/BalancedBinaryTree.java"
      },
      {
        "id": "nc_49",
        "index": 49,
        "name": "Same Tree",
        "difficulty": "Easy",
        "topicId": "trees",
        "topicName": "Trees",
        "leetcodeUrl": "https://leetcode.com/problems/same-tree/",
        "neetcodeUrl": "https://neetcode.io/problems/same-binary-tree?list=neetcode150",
        "javaFilePath": "src/Trees/SameTree.java"
      },
      {
        "id": "nc_50",
        "index": 50,
        "name": "Subtree of Another Tree",
        "difficulty": "Easy",
        "topicId": "trees",
        "topicName": "Trees",
        "leetcodeUrl": "https://leetcode.com/problems/subtree-of-another-tree/",
        "neetcodeUrl": "https://neetcode.io/problems/subtree-of-a-binary-tree?list=neetcode150",
        "javaFilePath": "src/Trees/SubtreeofAnotherTree.java"
      },
      {
        "id": "nc_51",
        "index": 51,
        "name": "Lowest Common Ancestor of a Binary Search Tree",
        "difficulty": "Medium",
        "topicId": "trees",
        "topicName": "Trees",
        "leetcodeUrl": "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/",
        "neetcodeUrl": "https://neetcode.io/problems/lowest-common-ancestor-in-binary-search-tree?list=neetcode150",
        "javaFilePath": "src/Trees/LowestCommonAncestorofaBinarySearchTree.java"
      },
      {
        "id": "nc_52",
        "index": 52,
        "name": "Binary Tree Level Order Traversal",
        "difficulty": "Medium",
        "topicId": "trees",
        "topicName": "Trees",
        "leetcodeUrl": "https://leetcode.com/problems/binary-tree-level-order-traversal/",
        "neetcodeUrl": "https://neetcode.io/problems/level-order-traversal-of-binary-tree?list=neetcode150",
        "javaFilePath": "src/Trees/BinaryTreeLevelOrderTraversal.java"
      },
      {
        "id": "nc_53",
        "index": 53,
        "name": "Binary Tree Right Side View",
        "difficulty": "Medium",
        "topicId": "trees",
        "topicName": "Trees",
        "leetcodeUrl": "https://leetcode.com/problems/binary-tree-right-side-view/",
        "neetcodeUrl": "https://neetcode.io/problems/binary-tree-right-side-view?list=neetcode150",
        "javaFilePath": "src/Trees/BinaryTreeRightSideView.java"
      },
      {
        "id": "nc_54",
        "index": 54,
        "name": "Count Good Nodes In Binary Tree",
        "difficulty": "Medium",
        "topicId": "trees",
        "topicName": "Trees",
        "leetcodeUrl": "https://leetcode.com/problems/count-good-nodes-in-binary-tree/",
        "neetcodeUrl": "https://neetcode.io/problems/count-good-nodes-in-binary-tree?list=neetcode150",
        "javaFilePath": "src/Trees/CountGoodNodesInBinaryTree.java"
      },
      {
        "id": "nc_55",
        "index": 55,
        "name": "Validate Binary Search Tree",
        "difficulty": "Medium",
        "topicId": "trees",
        "topicName": "Trees",
        "leetcodeUrl": "https://leetcode.com/problems/validate-binary-search-tree/",
        "neetcodeUrl": "https://neetcode.io/problems/valid-binary-search-tree?list=neetcode150",
        "javaFilePath": "src/Trees/ValidateBinarySearchTree.java"
      },
      {
        "id": "nc_56",
        "index": 56,
        "name": "Kth Smallest Element In a Bst",
        "difficulty": "Medium",
        "topicId": "trees",
        "topicName": "Trees",
        "leetcodeUrl": "https://leetcode.com/problems/kth-smallest-element-in-a-bst/",
        "neetcodeUrl": "https://neetcode.io/problems/kth-smallest-integer-in-bst?list=neetcode150",
        "javaFilePath": "src/Trees/KthSmallestElementInaBst.java"
      },
      {
        "id": "nc_57",
        "index": 57,
        "name": "Construct Binary Tree From Preorder And Inorder Traversal",
        "difficulty": "Medium",
        "topicId": "trees",
        "topicName": "Trees",
        "leetcodeUrl": "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/",
        "neetcodeUrl": "https://neetcode.io/problems/binary-tree-from-preorder-and-inorder-traversal?list=neetcode150",
        "javaFilePath": "src/Trees/ConstructBinaryTreeFromPreorderAndInorderTraversal.java"
      },
      {
        "id": "nc_58",
        "index": 58,
        "name": "Binary Tree Maximum Path Sum",
        "difficulty": "Hard",
        "topicId": "trees",
        "topicName": "Trees",
        "leetcodeUrl": "https://leetcode.com/problems/binary-tree-maximum-path-sum/",
        "neetcodeUrl": "https://neetcode.io/problems/binary-tree-maximum-path-sum?list=neetcode150",
        "javaFilePath": "src/Trees/BinaryTreeMaximumPathSum.java"
      },
      {
        "id": "nc_59",
        "index": 59,
        "name": "Serialize And Deserialize Binary Tree",
        "difficulty": "Hard",
        "topicId": "trees",
        "topicName": "Trees",
        "leetcodeUrl": "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/",
        "neetcodeUrl": "https://neetcode.io/problems/serialize-and-deserialize-binary-tree?list=neetcode150",
        "javaFilePath": "src/Trees/SerializeAndDeserializeBinaryTree.java"
      }
    ]
  },
  {
    "topicId": "heap-priority-queue",
    "topicName": "Heap / Priority Queue",
    "problems": [
      {
        "id": "nc_60",
        "index": 60,
        "name": "Kth Largest Element In a Stream",
        "difficulty": "Easy",
        "topicId": "heap-priority-queue",
        "topicName": "Heap / Priority Queue",
        "leetcodeUrl": "https://leetcode.com/problems/kth-largest-element-in-a-stream/",
        "neetcodeUrl": "https://neetcode.io/problems/kth-largest-integer-in-a-stream?list=neetcode150",
        "javaFilePath": "src/Heap___Priority_Queue/KthLargestElementInaStream.java"
      },
      {
        "id": "nc_61",
        "index": 61,
        "name": "Last Stone Weight",
        "difficulty": "Easy",
        "topicId": "heap-priority-queue",
        "topicName": "Heap / Priority Queue",
        "leetcodeUrl": "https://leetcode.com/problems/last-stone-weight/",
        "neetcodeUrl": "https://neetcode.io/problems/last-stone-weight?list=neetcode150",
        "javaFilePath": "src/Heap___Priority_Queue/LastStoneWeight.java"
      },
      {
        "id": "nc_62",
        "index": 62,
        "name": "K Closest Points to Origin",
        "difficulty": "Medium",
        "topicId": "heap-priority-queue",
        "topicName": "Heap / Priority Queue",
        "leetcodeUrl": "https://leetcode.com/problems/k-closest-points-to-origin/",
        "neetcodeUrl": "https://neetcode.io/problems/k-closest-points-to-origin?list=neetcode150",
        "javaFilePath": "src/Heap___Priority_Queue/KClosestPointstoOrigin.java"
      },
      {
        "id": "nc_63",
        "index": 63,
        "name": "Kth Largest Element In An Array",
        "difficulty": "Medium",
        "topicId": "heap-priority-queue",
        "topicName": "Heap / Priority Queue",
        "leetcodeUrl": "https://leetcode.com/problems/kth-largest-element-in-an-array/",
        "neetcodeUrl": "https://neetcode.io/problems/kth-largest-element-in-an-array?list=neetcode150",
        "javaFilePath": "src/Heap___Priority_Queue/KthLargestElementInAnArray.java"
      },
      {
        "id": "nc_64",
        "index": 64,
        "name": "Task Scheduler",
        "difficulty": "Medium",
        "topicId": "heap-priority-queue",
        "topicName": "Heap / Priority Queue",
        "leetcodeUrl": "https://leetcode.com/problems/task-scheduler/",
        "neetcodeUrl": "https://neetcode.io/problems/task-scheduling?list=neetcode150",
        "javaFilePath": "src/Heap___Priority_Queue/TaskScheduler.java"
      },
      {
        "id": "nc_65",
        "index": 65,
        "name": "Design Twitter",
        "difficulty": "Medium",
        "topicId": "heap-priority-queue",
        "topicName": "Heap / Priority Queue",
        "leetcodeUrl": "https://leetcode.com/problems/design-twitter/",
        "neetcodeUrl": "https://neetcode.io/problems/design-twitter-feed?list=neetcode150",
        "javaFilePath": "src/Heap___Priority_Queue/DesignTwitter.java"
      },
      {
        "id": "nc_66",
        "index": 66,
        "name": "Find Median From Data Stream",
        "difficulty": "Hard",
        "topicId": "heap-priority-queue",
        "topicName": "Heap / Priority Queue",
        "leetcodeUrl": "https://leetcode.com/problems/find-median-from-data-stream/",
        "neetcodeUrl": "https://neetcode.io/problems/find-median-in-a-data-stream?list=neetcode150",
        "javaFilePath": "src/Heap___Priority_Queue/FindMedianFromDataStream.java"
      }
    ]
  },
  {
    "topicId": "backtracking",
    "topicName": "Backtracking",
    "problems": [
      {
        "id": "nc_67",
        "index": 67,
        "name": "Subsets",
        "difficulty": "Medium",
        "topicId": "backtracking",
        "topicName": "Backtracking",
        "leetcodeUrl": "https://leetcode.com/problems/subsets/",
        "neetcodeUrl": "https://neetcode.io/problems/subsets?list=neetcode150",
        "javaFilePath": "src/Backtracking/Subsets.java"
      },
      {
        "id": "nc_68",
        "index": 68,
        "name": "Combination Sum",
        "difficulty": "Medium",
        "topicId": "backtracking",
        "topicName": "Backtracking",
        "leetcodeUrl": "https://leetcode.com/problems/combination-sum/",
        "neetcodeUrl": "https://neetcode.io/problems/combination-target-sum?list=neetcode150",
        "javaFilePath": "src/Backtracking/CombinationSum.java"
      },
      {
        "id": "nc_69",
        "index": 69,
        "name": "Combination Sum II",
        "difficulty": "Medium",
        "topicId": "backtracking",
        "topicName": "Backtracking",
        "leetcodeUrl": "https://leetcode.com/problems/combination-sum-ii/",
        "neetcodeUrl": "https://neetcode.io/problems/combination-target-sum-ii?list=neetcode150",
        "javaFilePath": "src/Backtracking/CombinationSumII.java"
      },
      {
        "id": "nc_70",
        "index": 70,
        "name": "Permutations",
        "difficulty": "Medium",
        "topicId": "backtracking",
        "topicName": "Backtracking",
        "leetcodeUrl": "https://leetcode.com/problems/permutations/",
        "neetcodeUrl": "https://neetcode.io/problems/permutations?list=neetcode150",
        "javaFilePath": "src/Backtracking/Permutations.java"
      },
      {
        "id": "nc_71",
        "index": 71,
        "name": "Subsets II",
        "difficulty": "Medium",
        "topicId": "backtracking",
        "topicName": "Backtracking",
        "leetcodeUrl": "https://leetcode.com/problems/subsets-ii/",
        "neetcodeUrl": "https://neetcode.io/problems/subsets-ii?list=neetcode150",
        "javaFilePath": "src/Backtracking/SubsetsII.java"
      },
      {
        "id": "nc_72",
        "index": 72,
        "name": "Generate Parentheses",
        "difficulty": "Medium",
        "topicId": "backtracking",
        "topicName": "Backtracking",
        "leetcodeUrl": "https://leetcode.com/problems/generate-parentheses/",
        "neetcodeUrl": "https://neetcode.io/problems/generate-parentheses?list=neetcode150",
        "javaFilePath": "src/Backtracking/GenerateParentheses.java"
      },
      {
        "id": "nc_73",
        "index": 73,
        "name": "Word Search",
        "difficulty": "Medium",
        "topicId": "backtracking",
        "topicName": "Backtracking",
        "leetcodeUrl": "https://leetcode.com/problems/word-search/",
        "neetcodeUrl": "https://neetcode.io/problems/search-for-word?list=neetcode150",
        "javaFilePath": "src/Backtracking/WordSearch.java"
      },
      {
        "id": "nc_74",
        "index": 74,
        "name": "Palindrome Partitioning",
        "difficulty": "Medium",
        "topicId": "backtracking",
        "topicName": "Backtracking",
        "leetcodeUrl": "https://leetcode.com/problems/palindrome-partitioning/",
        "neetcodeUrl": "https://neetcode.io/problems/palindrome-partitioning?list=neetcode150",
        "javaFilePath": "src/Backtracking/PalindromePartitioning.java"
      },
      {
        "id": "nc_75",
        "index": 75,
        "name": "Letter Combinations of a Phone Number",
        "difficulty": "Medium",
        "topicId": "backtracking",
        "topicName": "Backtracking",
        "leetcodeUrl": "https://leetcode.com/problems/letter-combinations-of-a-phone-number/",
        "neetcodeUrl": "https://neetcode.io/problems/combinations-of-a-phone-number?list=neetcode150",
        "javaFilePath": "src/Backtracking/LetterCombinationsofaPhoneNumber.java"
      },
      {
        "id": "nc_76",
        "index": 76,
        "name": "N Queens",
        "difficulty": "Hard",
        "topicId": "backtracking",
        "topicName": "Backtracking",
        "leetcodeUrl": "https://leetcode.com/problems/n-queens/",
        "neetcodeUrl": "https://neetcode.io/problems/n-queens?list=neetcode150",
        "javaFilePath": "src/Backtracking/NQueens.java"
      }
    ]
  },
  {
    "topicId": "tries",
    "topicName": "Tries",
    "problems": [
      {
        "id": "nc_77",
        "index": 77,
        "name": "Implement Trie Prefix Tree",
        "difficulty": "Medium",
        "topicId": "tries",
        "topicName": "Tries",
        "leetcodeUrl": "https://leetcode.com/problems/implement-trie-prefix-tree/",
        "neetcodeUrl": "https://neetcode.io/problems/implement-prefix-tree?list=neetcode150",
        "javaFilePath": "src/Tries/ImplementTriePrefixTree.java"
      },
      {
        "id": "nc_78",
        "index": 78,
        "name": "Design Add And Search Words Data Structure",
        "difficulty": "Medium",
        "topicId": "tries",
        "topicName": "Tries",
        "leetcodeUrl": "https://leetcode.com/problems/design-add-and-search-words-data-structure/",
        "neetcodeUrl": "https://neetcode.io/problems/design-word-search-data-structure?list=neetcode150",
        "javaFilePath": "src/Tries/DesignAddAndSearchWordsDataStructure.java"
      },
      {
        "id": "nc_79",
        "index": 79,
        "name": "Word Search II",
        "difficulty": "Hard",
        "topicId": "tries",
        "topicName": "Tries",
        "leetcodeUrl": "https://leetcode.com/problems/word-search-ii/",
        "neetcodeUrl": "https://neetcode.io/problems/search-for-word-ii?list=neetcode150",
        "javaFilePath": "src/Tries/WordSearchII.java"
      }
    ]
  },
  {
    "topicId": "graphs",
    "topicName": "Graphs",
    "problems": [
      {
        "id": "nc_80",
        "index": 80,
        "name": "Number of Islands",
        "difficulty": "Medium",
        "topicId": "graphs",
        "topicName": "Graphs",
        "leetcodeUrl": "https://leetcode.com/problems/number-of-islands/",
        "neetcodeUrl": "https://neetcode.io/problems/count-number-of-islands?list=neetcode150",
        "javaFilePath": "src/Graphs/NumberofIslands.java"
      },
      {
        "id": "nc_81",
        "index": 81,
        "name": "Max Area of Island",
        "difficulty": "Medium",
        "topicId": "graphs",
        "topicName": "Graphs",
        "leetcodeUrl": "https://leetcode.com/problems/max-area-of-island/",
        "neetcodeUrl": "https://neetcode.io/problems/max-area-of-island?list=neetcode150",
        "javaFilePath": "src/Graphs/MaxAreaofIsland.java"
      },
      {
        "id": "nc_82",
        "index": 82,
        "name": "Clone Graph",
        "difficulty": "Medium",
        "topicId": "graphs",
        "topicName": "Graphs",
        "leetcodeUrl": "https://leetcode.com/problems/clone-graph/",
        "neetcodeUrl": "https://neetcode.io/problems/clone-graph?list=neetcode150",
        "javaFilePath": "src/Graphs/CloneGraph.java"
      },
      {
        "id": "nc_83",
        "index": 83,
        "name": "Walls And Gates",
        "difficulty": "Medium",
        "topicId": "graphs",
        "topicName": "Graphs",
        "leetcodeUrl": "https://leetcode.com/problems/walls-and-gates/",
        "neetcodeUrl": "https://neetcode.io/problems/islands-and-treasure?list=neetcode150",
        "javaFilePath": "src/Graphs/WallsAndGates.java"
      },
      {
        "id": "nc_84",
        "index": 84,
        "name": "Rotting Oranges",
        "difficulty": "Medium",
        "topicId": "graphs",
        "topicName": "Graphs",
        "leetcodeUrl": "https://leetcode.com/problems/rotting-oranges/",
        "neetcodeUrl": "https://neetcode.io/problems/rotting-fruit?list=neetcode150",
        "javaFilePath": "src/Graphs/RottingOranges.java"
      },
      {
        "id": "nc_85",
        "index": 85,
        "name": "Pacific Atlantic Water Flow",
        "difficulty": "Medium",
        "topicId": "graphs",
        "topicName": "Graphs",
        "leetcodeUrl": "https://leetcode.com/problems/pacific-atlantic-water-flow/",
        "neetcodeUrl": "https://neetcode.io/problems/pacific-atlantic-water-flow?list=neetcode150",
        "javaFilePath": "src/Graphs/PacificAtlanticWaterFlow.java"
      },
      {
        "id": "nc_86",
        "index": 86,
        "name": "Surrounded Regions",
        "difficulty": "Medium",
        "topicId": "graphs",
        "topicName": "Graphs",
        "leetcodeUrl": "https://leetcode.com/problems/surrounded-regions/",
        "neetcodeUrl": "https://neetcode.io/problems/surrounded-regions?list=neetcode150",
        "javaFilePath": "src/Graphs/SurroundedRegions.java"
      },
      {
        "id": "nc_87",
        "index": 87,
        "name": "Course Schedule",
        "difficulty": "Medium",
        "topicId": "graphs",
        "topicName": "Graphs",
        "leetcodeUrl": "https://leetcode.com/problems/course-schedule/",
        "neetcodeUrl": "https://neetcode.io/problems/course-schedule?list=neetcode150",
        "javaFilePath": "src/Graphs/CourseSchedule.java"
      },
      {
        "id": "nc_88",
        "index": 88,
        "name": "Course Schedule II",
        "difficulty": "Medium",
        "topicId": "graphs",
        "topicName": "Graphs",
        "leetcodeUrl": "https://leetcode.com/problems/course-schedule-ii/",
        "neetcodeUrl": "https://neetcode.io/problems/course-schedule-ii?list=neetcode150",
        "javaFilePath": "src/Graphs/CourseScheduleII.java"
      },
      {
        "id": "nc_89",
        "index": 89,
        "name": "Graph Valid Tree",
        "difficulty": "Medium",
        "topicId": "graphs",
        "topicName": "Graphs",
        "leetcodeUrl": "https://leetcode.com/problems/graph-valid-tree/",
        "neetcodeUrl": "https://neetcode.io/problems/valid-tree?list=neetcode150",
        "javaFilePath": "src/Graphs/GraphValidTree.java"
      },
      {
        "id": "nc_90",
        "index": 90,
        "name": "Number of Connected Components In An Undirected Graph",
        "difficulty": "Medium",
        "topicId": "graphs",
        "topicName": "Graphs",
        "leetcodeUrl": "https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/",
        "neetcodeUrl": "https://neetcode.io/problems/count-connected-components?list=neetcode150",
        "javaFilePath": "src/Graphs/NumberofConnectedComponentsInAnUndirectedGraph.java"
      },
      {
        "id": "nc_91",
        "index": 91,
        "name": "Redundant Connection",
        "difficulty": "Medium",
        "topicId": "graphs",
        "topicName": "Graphs",
        "leetcodeUrl": "https://leetcode.com/problems/redundant-connection/",
        "neetcodeUrl": "https://neetcode.io/problems/redundant-connection?list=neetcode150",
        "javaFilePath": "src/Graphs/RedundantConnection.java"
      },
      {
        "id": "nc_92",
        "index": 92,
        "name": "Word Ladder",
        "difficulty": "Hard",
        "topicId": "graphs",
        "topicName": "Graphs",
        "leetcodeUrl": "https://leetcode.com/problems/word-ladder/",
        "neetcodeUrl": "https://neetcode.io/problems/word-ladder?list=neetcode150",
        "javaFilePath": "src/Graphs/WordLadder.java"
      }
    ]
  },
  {
    "topicId": "advanced-graphs",
    "topicName": "Advanced Graphs",
    "problems": [
      {
        "id": "nc_93",
        "index": 93,
        "name": "Network Delay Time",
        "difficulty": "Medium",
        "topicId": "advanced-graphs",
        "topicName": "Advanced Graphs",
        "leetcodeUrl": "https://leetcode.com/problems/network-delay-time/",
        "neetcodeUrl": "https://neetcode.io/problems/network-delay-time?list=neetcode150",
        "javaFilePath": "src/Advanced_Graphs/NetworkDelayTime.java"
      },
      {
        "id": "nc_94",
        "index": 94,
        "name": "Reconstruct Itinerary",
        "difficulty": "Hard",
        "topicId": "advanced-graphs",
        "topicName": "Advanced Graphs",
        "leetcodeUrl": "https://leetcode.com/problems/reconstruct-itinerary/",
        "neetcodeUrl": "https://neetcode.io/problems/reconstruct-flight-path?list=neetcode150",
        "javaFilePath": "src/Advanced_Graphs/ReconstructItinerary.java"
      },
      {
        "id": "nc_95",
        "index": 95,
        "name": "Min Cost to Connect All Points",
        "difficulty": "Medium",
        "topicId": "advanced-graphs",
        "topicName": "Advanced Graphs",
        "leetcodeUrl": "https://leetcode.com/problems/min-cost-to-connect-all-points/",
        "neetcodeUrl": "https://neetcode.io/problems/min-cost-to-connect-points?list=neetcode150",
        "javaFilePath": "src/Advanced_Graphs/MinCosttoConnectAllPoints.java"
      },
      {
        "id": "nc_96",
        "index": 96,
        "name": "Swim In Rising Water",
        "difficulty": "Hard",
        "topicId": "advanced-graphs",
        "topicName": "Advanced Graphs",
        "leetcodeUrl": "https://leetcode.com/problems/swim-in-rising-water/",
        "neetcodeUrl": "https://neetcode.io/problems/swim-in-rising-water?list=neetcode150",
        "javaFilePath": "src/Advanced_Graphs/SwimInRisingWater.java"
      },
      {
        "id": "nc_97",
        "index": 97,
        "name": "Alien Dictionary",
        "difficulty": "Hard",
        "topicId": "advanced-graphs",
        "topicName": "Advanced Graphs",
        "leetcodeUrl": "https://leetcode.com/problems/alien-dictionary/",
        "neetcodeUrl": "https://neetcode.io/problems/foreign-dictionary?list=neetcode150",
        "javaFilePath": "src/Advanced_Graphs/AlienDictionary.java"
      },
      {
        "id": "nc_98",
        "index": 98,
        "name": "Cheapest Flights Within K Stops",
        "difficulty": "Medium",
        "topicId": "advanced-graphs",
        "topicName": "Advanced Graphs",
        "leetcodeUrl": "https://leetcode.com/problems/cheapest-flights-within-k-stops/",
        "neetcodeUrl": "https://neetcode.io/problems/cheapest-flight-path?list=neetcode150",
        "javaFilePath": "src/Advanced_Graphs/CheapestFlightsWithinKStops.java"
      }
    ]
  },
  {
    "topicId": "dynamic-programming-1d",
    "topicName": "1-D Dynamic Programming",
    "problems": [
      {
        "id": "nc_99",
        "index": 99,
        "name": "Climbing Stairs",
        "difficulty": "Easy",
        "topicId": "dynamic-programming-1d",
        "topicName": "1-D Dynamic Programming",
        "leetcodeUrl": "https://leetcode.com/problems/climbing-stairs/",
        "neetcodeUrl": "https://neetcode.io/problems/climbing-stairs?list=neetcode150",
        "javaFilePath": "src/1_D_Dynamic_Programming/ClimbingStairs.java"
      },
      {
        "id": "nc_100",
        "index": 100,
        "name": "Min Cost Climbing Stairs",
        "difficulty": "Easy",
        "topicId": "dynamic-programming-1d",
        "topicName": "1-D Dynamic Programming",
        "leetcodeUrl": "https://leetcode.com/problems/min-cost-climbing-stairs/",
        "neetcodeUrl": "https://neetcode.io/problems/min-cost-climbing-stairs?list=neetcode150",
        "javaFilePath": "src/1_D_Dynamic_Programming/MinCostClimbingStairs.java"
      },
      {
        "id": "nc_101",
        "index": 101,
        "name": "House Robber",
        "difficulty": "Medium",
        "topicId": "dynamic-programming-1d",
        "topicName": "1-D Dynamic Programming",
        "leetcodeUrl": "https://leetcode.com/problems/house-robber/",
        "neetcodeUrl": "https://neetcode.io/problems/house-robber?list=neetcode150",
        "javaFilePath": "src/1_D_Dynamic_Programming/HouseRobber.java"
      },
      {
        "id": "nc_102",
        "index": 102,
        "name": "House Robber II",
        "difficulty": "Medium",
        "topicId": "dynamic-programming-1d",
        "topicName": "1-D Dynamic Programming",
        "leetcodeUrl": "https://leetcode.com/problems/house-robber-ii/",
        "neetcodeUrl": "https://neetcode.io/problems/house-robber-ii?list=neetcode150",
        "javaFilePath": "src/1_D_Dynamic_Programming/HouseRobberII.java"
      },
      {
        "id": "nc_103",
        "index": 103,
        "name": "Longest Palindromic Substring",
        "difficulty": "Medium",
        "topicId": "dynamic-programming-1d",
        "topicName": "1-D Dynamic Programming",
        "leetcodeUrl": "https://leetcode.com/problems/longest-palindromic-substring/",
        "neetcodeUrl": "https://neetcode.io/problems/longest-palindromic-substring?list=neetcode150",
        "javaFilePath": "src/1_D_Dynamic_Programming/LongestPalindromicSubstring.java"
      },
      {
        "id": "nc_104",
        "index": 104,
        "name": "Palindromic Substrings",
        "difficulty": "Medium",
        "topicId": "dynamic-programming-1d",
        "topicName": "1-D Dynamic Programming",
        "leetcodeUrl": "https://leetcode.com/problems/palindromic-substrings/",
        "neetcodeUrl": "https://neetcode.io/problems/palindromic-substrings?list=neetcode150",
        "javaFilePath": "src/1_D_Dynamic_Programming/PalindromicSubstrings.java"
      },
      {
        "id": "nc_105",
        "index": 105,
        "name": "Decode Ways",
        "difficulty": "Medium",
        "topicId": "dynamic-programming-1d",
        "topicName": "1-D Dynamic Programming",
        "leetcodeUrl": "https://leetcode.com/problems/decode-ways/",
        "neetcodeUrl": "https://neetcode.io/problems/decode-ways?list=neetcode150",
        "javaFilePath": "src/1_D_Dynamic_Programming/DecodeWays.java"
      },
      {
        "id": "nc_106",
        "index": 106,
        "name": "Coin Change",
        "difficulty": "Medium",
        "topicId": "dynamic-programming-1d",
        "topicName": "1-D Dynamic Programming",
        "leetcodeUrl": "https://leetcode.com/problems/coin-change/",
        "neetcodeUrl": "https://neetcode.io/problems/coin-change?list=neetcode150",
        "javaFilePath": "src/1_D_Dynamic_Programming/CoinChange.java"
      },
      {
        "id": "nc_107",
        "index": 107,
        "name": "Maximum Product Subarray",
        "difficulty": "Medium",
        "topicId": "dynamic-programming-1d",
        "topicName": "1-D Dynamic Programming",
        "leetcodeUrl": "https://leetcode.com/problems/maximum-product-subarray/",
        "neetcodeUrl": "https://neetcode.io/problems/maximum-product-subarray?list=neetcode150",
        "javaFilePath": "src/1_D_Dynamic_Programming/MaximumProductSubarray.java"
      },
      {
        "id": "nc_108",
        "index": 108,
        "name": "Word Break",
        "difficulty": "Medium",
        "topicId": "dynamic-programming-1d",
        "topicName": "1-D Dynamic Programming",
        "leetcodeUrl": "https://leetcode.com/problems/word-break/",
        "neetcodeUrl": "https://neetcode.io/problems/word-break?list=neetcode150",
        "javaFilePath": "src/1_D_Dynamic_Programming/WordBreak.java"
      },
      {
        "id": "nc_109",
        "index": 109,
        "name": "Longest Increasing Subsequence",
        "difficulty": "Medium",
        "topicId": "dynamic-programming-1d",
        "topicName": "1-D Dynamic Programming",
        "leetcodeUrl": "https://leetcode.com/problems/longest-increasing-subsequence/",
        "neetcodeUrl": "https://neetcode.io/problems/longest-increasing-subsequence?list=neetcode150",
        "javaFilePath": "src/1_D_Dynamic_Programming/LongestIncreasingSubsequence.java"
      },
      {
        "id": "nc_110",
        "index": 110,
        "name": "Partition Equal Subset Sum",
        "difficulty": "Medium",
        "topicId": "dynamic-programming-1d",
        "topicName": "1-D Dynamic Programming",
        "leetcodeUrl": "https://leetcode.com/problems/partition-equal-subset-sum/",
        "neetcodeUrl": "https://neetcode.io/problems/partition-equal-subset-sum?list=neetcode150",
        "javaFilePath": "src/1_D_Dynamic_Programming/PartitionEqualSubsetSum.java"
      }
    ]
  },
  {
    "topicId": "dynamic-programming-2d",
    "topicName": "2-D Dynamic Programming",
    "problems": [
      {
        "id": "nc_111",
        "index": 111,
        "name": "Unique Paths",
        "difficulty": "Medium",
        "topicId": "dynamic-programming-2d",
        "topicName": "2-D Dynamic Programming",
        "leetcodeUrl": "https://leetcode.com/problems/unique-paths/",
        "neetcodeUrl": "https://neetcode.io/problems/count-paths?list=neetcode150",
        "javaFilePath": "src/2_D_Dynamic_Programming/UniquePaths.java"
      },
      {
        "id": "nc_112",
        "index": 112,
        "name": "Longest Common Subsequence",
        "difficulty": "Medium",
        "topicId": "dynamic-programming-2d",
        "topicName": "2-D Dynamic Programming",
        "leetcodeUrl": "https://leetcode.com/problems/longest-common-subsequence/",
        "neetcodeUrl": "https://neetcode.io/problems/longest-common-subsequence?list=neetcode150",
        "javaFilePath": "src/2_D_Dynamic_Programming/LongestCommonSubsequence.java"
      },
      {
        "id": "nc_113",
        "index": 113,
        "name": "Best Time to Buy And Sell Stock With Cooldown",
        "difficulty": "Medium",
        "topicId": "dynamic-programming-2d",
        "topicName": "2-D Dynamic Programming",
        "leetcodeUrl": "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/",
        "neetcodeUrl": "https://neetcode.io/problems/buy-and-sell-crypto-with-cooldown?list=neetcode150",
        "javaFilePath": "src/2_D_Dynamic_Programming/BestTimetoBuyAndSellStockWithCooldown.java"
      },
      {
        "id": "nc_114",
        "index": 114,
        "name": "Coin Change II",
        "difficulty": "Medium",
        "topicId": "dynamic-programming-2d",
        "topicName": "2-D Dynamic Programming",
        "leetcodeUrl": "https://leetcode.com/problems/coin-change-ii/",
        "neetcodeUrl": "https://neetcode.io/problems/coin-change-ii?list=neetcode150",
        "javaFilePath": "src/2_D_Dynamic_Programming/CoinChangeII.java"
      },
      {
        "id": "nc_115",
        "index": 115,
        "name": "Target Sum",
        "difficulty": "Medium",
        "topicId": "dynamic-programming-2d",
        "topicName": "2-D Dynamic Programming",
        "leetcodeUrl": "https://leetcode.com/problems/target-sum/",
        "neetcodeUrl": "https://neetcode.io/problems/target-sum?list=neetcode150",
        "javaFilePath": "src/2_D_Dynamic_Programming/TargetSum.java"
      },
      {
        "id": "nc_116",
        "index": 116,
        "name": "Interleaving String",
        "difficulty": "Medium",
        "topicId": "dynamic-programming-2d",
        "topicName": "2-D Dynamic Programming",
        "leetcodeUrl": "https://leetcode.com/problems/interleaving-string/",
        "neetcodeUrl": "https://neetcode.io/problems/interleaving-string?list=neetcode150",
        "javaFilePath": "src/2_D_Dynamic_Programming/InterleavingString.java"
      },
      {
        "id": "nc_117",
        "index": 117,
        "name": "Longest Increasing Path In a Matrix",
        "difficulty": "Hard",
        "topicId": "dynamic-programming-2d",
        "topicName": "2-D Dynamic Programming",
        "leetcodeUrl": "https://leetcode.com/problems/longest-increasing-path-in-a-matrix/",
        "neetcodeUrl": "https://neetcode.io/problems/longest-increasing-path-in-matrix?list=neetcode150",
        "javaFilePath": "src/2_D_Dynamic_Programming/LongestIncreasingPathInaMatrix.java"
      },
      {
        "id": "nc_118",
        "index": 118,
        "name": "Distinct Subsequences",
        "difficulty": "Hard",
        "topicId": "dynamic-programming-2d",
        "topicName": "2-D Dynamic Programming",
        "leetcodeUrl": "https://leetcode.com/problems/distinct-subsequences/",
        "neetcodeUrl": "https://neetcode.io/problems/count-subsequences?list=neetcode150",
        "javaFilePath": "src/2_D_Dynamic_Programming/DistinctSubsequences.java"
      },
      {
        "id": "nc_119",
        "index": 119,
        "name": "Edit Distance",
        "difficulty": "Medium",
        "topicId": "dynamic-programming-2d",
        "topicName": "2-D Dynamic Programming",
        "leetcodeUrl": "https://leetcode.com/problems/edit-distance/",
        "neetcodeUrl": "https://neetcode.io/problems/edit-distance?list=neetcode150",
        "javaFilePath": "src/2_D_Dynamic_Programming/EditDistance.java"
      },
      {
        "id": "nc_120",
        "index": 120,
        "name": "Burst Balloons",
        "difficulty": "Hard",
        "topicId": "dynamic-programming-2d",
        "topicName": "2-D Dynamic Programming",
        "leetcodeUrl": "https://leetcode.com/problems/burst-balloons/",
        "neetcodeUrl": "https://neetcode.io/problems/burst-balloons?list=neetcode150",
        "javaFilePath": "src/2_D_Dynamic_Programming/BurstBalloons.java"
      },
      {
        "id": "nc_121",
        "index": 121,
        "name": "Regular Expression Matching",
        "difficulty": "Hard",
        "topicId": "dynamic-programming-2d",
        "topicName": "2-D Dynamic Programming",
        "leetcodeUrl": "https://leetcode.com/problems/regular-expression-matching/",
        "neetcodeUrl": "https://neetcode.io/problems/regular-expression-matching?list=neetcode150",
        "javaFilePath": "src/2_D_Dynamic_Programming/RegularExpressionMatching.java"
      }
    ]
  },
  {
    "topicId": "greedy",
    "topicName": "Greedy",
    "problems": [
      {
        "id": "nc_122",
        "index": 122,
        "name": "Maximum Subarray",
        "difficulty": "Medium",
        "topicId": "greedy",
        "topicName": "Greedy",
        "leetcodeUrl": "https://leetcode.com/problems/maximum-subarray/",
        "neetcodeUrl": "https://neetcode.io/problems/maximum-subarray?list=neetcode150",
        "javaFilePath": "src/Greedy/MaximumSubarray.java"
      },
      {
        "id": "nc_123",
        "index": 123,
        "name": "Jump Game",
        "difficulty": "Medium",
        "topicId": "greedy",
        "topicName": "Greedy",
        "leetcodeUrl": "https://leetcode.com/problems/jump-game/",
        "neetcodeUrl": "https://neetcode.io/problems/jump-game?list=neetcode150",
        "javaFilePath": "src/Greedy/JumpGame.java"
      },
      {
        "id": "nc_124",
        "index": 124,
        "name": "Jump Game II",
        "difficulty": "Medium",
        "topicId": "greedy",
        "topicName": "Greedy",
        "leetcodeUrl": "https://leetcode.com/problems/jump-game-ii/",
        "neetcodeUrl": "https://neetcode.io/problems/jump-game-ii?list=neetcode150",
        "javaFilePath": "src/Greedy/JumpGameII.java"
      },
      {
        "id": "nc_125",
        "index": 125,
        "name": "Gas Station",
        "difficulty": "Medium",
        "topicId": "greedy",
        "topicName": "Greedy",
        "leetcodeUrl": "https://leetcode.com/problems/gas-station/",
        "neetcodeUrl": "https://neetcode.io/problems/gas-station?list=neetcode150",
        "javaFilePath": "src/Greedy/GasStation.java"
      },
      {
        "id": "nc_126",
        "index": 126,
        "name": "Hand of Straights",
        "difficulty": "Medium",
        "topicId": "greedy",
        "topicName": "Greedy",
        "leetcodeUrl": "https://leetcode.com/problems/hand-of-straights/",
        "neetcodeUrl": "https://neetcode.io/problems/hand-of-straights?list=neetcode150",
        "javaFilePath": "src/Greedy/HandofStraights.java"
      },
      {
        "id": "nc_127",
        "index": 127,
        "name": "Merge Triplets to Form Target Triplet",
        "difficulty": "Medium",
        "topicId": "greedy",
        "topicName": "Greedy",
        "leetcodeUrl": "https://leetcode.com/problems/merge-triplets-to-form-target-triplet/",
        "neetcodeUrl": "https://neetcode.io/problems/merge-triplets-to-form-target?list=neetcode150",
        "javaFilePath": "src/Greedy/MergeTripletstoFormTargetTriplet.java"
      },
      {
        "id": "nc_128",
        "index": 128,
        "name": "Partition Labels",
        "difficulty": "Medium",
        "topicId": "greedy",
        "topicName": "Greedy",
        "leetcodeUrl": "https://leetcode.com/problems/partition-labels/",
        "neetcodeUrl": "https://neetcode.io/problems/partition-labels?list=neetcode150",
        "javaFilePath": "src/Greedy/PartitionLabels.java"
      },
      {
        "id": "nc_129",
        "index": 129,
        "name": "Valid Parenthesis String",
        "difficulty": "Medium",
        "topicId": "greedy",
        "topicName": "Greedy",
        "leetcodeUrl": "https://leetcode.com/problems/valid-parenthesis-string/",
        "neetcodeUrl": "https://neetcode.io/problems/valid-parenthesis-string?list=neetcode150",
        "javaFilePath": "src/Greedy/ValidParenthesisString.java"
      }
    ]
  },
  {
    "topicId": "intervals",
    "topicName": "Intervals",
    "problems": [
      {
        "id": "nc_130",
        "index": 130,
        "name": "Insert Interval",
        "difficulty": "Medium",
        "topicId": "intervals",
        "topicName": "Intervals",
        "leetcodeUrl": "https://leetcode.com/problems/insert-interval/",
        "neetcodeUrl": "https://neetcode.io/problems/insert-new-interval?list=neetcode150",
        "javaFilePath": "src/Intervals/InsertInterval.java"
      },
      {
        "id": "nc_131",
        "index": 131,
        "name": "Merge Intervals",
        "difficulty": "Medium",
        "topicId": "intervals",
        "topicName": "Intervals",
        "leetcodeUrl": "https://leetcode.com/problems/merge-intervals/",
        "neetcodeUrl": "https://neetcode.io/problems/merge-intervals?list=neetcode150",
        "javaFilePath": "src/Intervals/MergeIntervals.java"
      },
      {
        "id": "nc_132",
        "index": 132,
        "name": "Non Overlapping Intervals",
        "difficulty": "Medium",
        "topicId": "intervals",
        "topicName": "Intervals",
        "leetcodeUrl": "https://leetcode.com/problems/non-overlapping-intervals/",
        "neetcodeUrl": "https://neetcode.io/problems/non-overlapping-intervals?list=neetcode150",
        "javaFilePath": "src/Intervals/NonOverlappingIntervals.java"
      },
      {
        "id": "nc_133",
        "index": 133,
        "name": "Meeting Rooms",
        "difficulty": "Easy",
        "topicId": "intervals",
        "topicName": "Intervals",
        "leetcodeUrl": "https://leetcode.com/problems/meeting-rooms/",
        "neetcodeUrl": "https://neetcode.io/problems/meeting-schedule?list=neetcode150",
        "javaFilePath": "src/Intervals/MeetingRooms.java"
      },
      {
        "id": "nc_134",
        "index": 134,
        "name": "Meeting Rooms II",
        "difficulty": "Medium",
        "topicId": "intervals",
        "topicName": "Intervals",
        "leetcodeUrl": "https://leetcode.com/problems/meeting-rooms-ii/",
        "neetcodeUrl": "https://neetcode.io/problems/meeting-schedule-ii?list=neetcode150",
        "javaFilePath": "src/Intervals/MeetingRoomsII.java"
      },
      {
        "id": "nc_135",
        "index": 135,
        "name": "Minimum Interval to Include Each Query",
        "difficulty": "Hard",
        "topicId": "intervals",
        "topicName": "Intervals",
        "leetcodeUrl": "https://leetcode.com/problems/minimum-interval-to-include-each-query/",
        "neetcodeUrl": "https://neetcode.io/problems/minimum-interval-including-query?list=neetcode150",
        "javaFilePath": "src/Intervals/MinimumIntervaltoIncludeEachQuery.java"
      }
    ]
  },
  {
    "topicId": "math-geometry",
    "topicName": "Math & Geometry",
    "problems": [
      {
        "id": "nc_136",
        "index": 136,
        "name": "Rotate Image",
        "difficulty": "Medium",
        "topicId": "math-geometry",
        "topicName": "Math & Geometry",
        "leetcodeUrl": "https://leetcode.com/problems/rotate-image/",
        "neetcodeUrl": "https://neetcode.io/problems/rotate-matrix?list=neetcode150",
        "javaFilePath": "src/Math___Geometry/RotateImage.java"
      },
      {
        "id": "nc_137",
        "index": 137,
        "name": "Spiral Matrix",
        "difficulty": "Medium",
        "topicId": "math-geometry",
        "topicName": "Math & Geometry",
        "leetcodeUrl": "https://leetcode.com/problems/spiral-matrix/",
        "neetcodeUrl": "https://neetcode.io/problems/spiral-matrix?list=neetcode150",
        "javaFilePath": "src/Math___Geometry/SpiralMatrix.java"
      },
      {
        "id": "nc_138",
        "index": 138,
        "name": "Set Matrix Zeroes",
        "difficulty": "Medium",
        "topicId": "math-geometry",
        "topicName": "Math & Geometry",
        "leetcodeUrl": "https://leetcode.com/problems/set-matrix-zeroes/",
        "neetcodeUrl": "https://neetcode.io/problems/set-zeroes-in-matrix?list=neetcode150",
        "javaFilePath": "src/Math___Geometry/SetMatrixZeroes.java"
      },
      {
        "id": "nc_139",
        "index": 139,
        "name": "Happy Number",
        "difficulty": "Easy",
        "topicId": "math-geometry",
        "topicName": "Math & Geometry",
        "leetcodeUrl": "https://leetcode.com/problems/happy-number/",
        "neetcodeUrl": "https://neetcode.io/problems/non-cyclical-number?list=neetcode150",
        "javaFilePath": "src/Math___Geometry/HappyNumber.java"
      },
      {
        "id": "nc_140",
        "index": 140,
        "name": "Plus One",
        "difficulty": "Easy",
        "topicId": "math-geometry",
        "topicName": "Math & Geometry",
        "leetcodeUrl": "https://leetcode.com/problems/plus-one/",
        "neetcodeUrl": "https://neetcode.io/problems/plus-one?list=neetcode150",
        "javaFilePath": "src/Math___Geometry/PlusOne.java"
      },
      {
        "id": "nc_141",
        "index": 141,
        "name": "Pow(x, n)",
        "difficulty": "Medium",
        "topicId": "math-geometry",
        "topicName": "Math & Geometry",
        "leetcodeUrl": "https://leetcode.com/problems/powx-n/",
        "neetcodeUrl": "https://neetcode.io/problems/pow-x-n?list=neetcode150",
        "javaFilePath": "src/Math___Geometry/Powxn.java"
      },
      {
        "id": "nc_142",
        "index": 142,
        "name": "Multiply Strings",
        "difficulty": "Medium",
        "topicId": "math-geometry",
        "topicName": "Math & Geometry",
        "leetcodeUrl": "https://leetcode.com/problems/multiply-strings/",
        "neetcodeUrl": "https://neetcode.io/problems/multiply-strings?list=neetcode150",
        "javaFilePath": "src/Math___Geometry/MultiplyStrings.java"
      },
      {
        "id": "nc_143",
        "index": 143,
        "name": "Detect Squares",
        "difficulty": "Medium",
        "topicId": "math-geometry",
        "topicName": "Math & Geometry",
        "leetcodeUrl": "https://leetcode.com/problems/detect-squares/",
        "neetcodeUrl": "https://neetcode.io/problems/count-squares?list=neetcode150",
        "javaFilePath": "src/Math___Geometry/DetectSquares.java"
      }
    ]
  },
  {
    "topicId": "bit-manipulation",
    "topicName": "Bit Manipulation",
    "problems": [
      {
        "id": "nc_144",
        "index": 144,
        "name": "Single Number",
        "difficulty": "Easy",
        "topicId": "bit-manipulation",
        "topicName": "Bit Manipulation",
        "leetcodeUrl": "https://leetcode.com/problems/single-number/",
        "neetcodeUrl": "https://neetcode.io/problems/single-number?list=neetcode150",
        "javaFilePath": "src/Bit_Manipulation/SingleNumber.java"
      },
      {
        "id": "nc_145",
        "index": 145,
        "name": "Number of 1 Bits",
        "difficulty": "Easy",
        "topicId": "bit-manipulation",
        "topicName": "Bit Manipulation",
        "leetcodeUrl": "https://leetcode.com/problems/number-of-1-bits/",
        "neetcodeUrl": "https://neetcode.io/problems/number-of-one-bits?list=neetcode150",
        "javaFilePath": "src/Bit_Manipulation/Numberof1Bits.java"
      },
      {
        "id": "nc_146",
        "index": 146,
        "name": "Counting Bits",
        "difficulty": "Easy",
        "topicId": "bit-manipulation",
        "topicName": "Bit Manipulation",
        "leetcodeUrl": "https://leetcode.com/problems/counting-bits/",
        "neetcodeUrl": "https://neetcode.io/problems/counting-bits?list=neetcode150",
        "javaFilePath": "src/Bit_Manipulation/CountingBits.java"
      },
      {
        "id": "nc_147",
        "index": 147,
        "name": "Reverse Bits",
        "difficulty": "Easy",
        "topicId": "bit-manipulation",
        "topicName": "Bit Manipulation",
        "leetcodeUrl": "https://leetcode.com/problems/reverse-bits/",
        "neetcodeUrl": "https://neetcode.io/problems/reverse-bits?list=neetcode150",
        "javaFilePath": "src/Bit_Manipulation/ReverseBits.java"
      },
      {
        "id": "nc_148",
        "index": 148,
        "name": "Missing Number",
        "difficulty": "Easy",
        "topicId": "bit-manipulation",
        "topicName": "Bit Manipulation",
        "leetcodeUrl": "https://leetcode.com/problems/missing-number/",
        "neetcodeUrl": "https://neetcode.io/problems/missing-number?list=neetcode150",
        "javaFilePath": "src/Bit_Manipulation/MissingNumber.java"
      },
      {
        "id": "nc_149",
        "index": 149,
        "name": "Sum of Two Integers",
        "difficulty": "Medium",
        "topicId": "bit-manipulation",
        "topicName": "Bit Manipulation",
        "leetcodeUrl": "https://leetcode.com/problems/sum-of-two-integers/",
        "neetcodeUrl": "https://neetcode.io/problems/sum-of-two-integers?list=neetcode150",
        "javaFilePath": "src/Bit_Manipulation/SumofTwoIntegers.java"
      },
      {
        "id": "nc_150",
        "index": 150,
        "name": "Reverse Integer",
        "difficulty": "Medium",
        "topicId": "bit-manipulation",
        "topicName": "Bit Manipulation",
        "leetcodeUrl": "https://leetcode.com/problems/reverse-integer/",
        "neetcodeUrl": "https://neetcode.io/problems/reverse-integer?list=neetcode150",
        "javaFilePath": "src/Bit_Manipulation/ReverseInteger.java"
      }
    ]
  }
];

export const ALL_NEETCODE_PROBLEMS: NeetCodeProblem[] = NEETCODE_TOPICS.flatMap(t => t.problems);

export const PROBLEMS_BY_TOPIC: Record<string, NeetCodeProblem[]> = NEETCODE_TOPICS.reduce((acc, t) => {
  acc[t.topicId] = t.problems;
  return acc;
}, {} as Record<string, NeetCodeProblem[]>);

export const PROBLEM_BY_ID: Record<string, NeetCodeProblem> = ALL_NEETCODE_PROBLEMS.reduce((acc, p) => {
  acc[p.id] = p;
  return acc;
}, {} as Record<string, NeetCodeProblem>);
