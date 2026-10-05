import json
import os
import re

script_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(script_dir)

json_path = os.path.join(project_root, 'docs', 'neetcode150.json')
with open(json_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

blind75_names = {
    # Arrays & Hashing (8)
    'Contains Duplicate', 'Valid Anagram', 'Two Sum', 'Group Anagrams',
    'Top K Frequent Elements', 'Encode and Decode Strings', 'Product of Array Except Self', 'Longest Consecutive Sequence',
    
    # Two Pointers (3)
    'Valid Palindrome', '3Sum', 'Container With Most Water',
    
    # Sliding Window (4)
    'Best Time to Buy And Sell Stock', 'Longest Substring Without Repeating Characters',
    'Longest Repeating Character Replacement', 'Minimum Window Substring',
    
    # Stack (1)
    'Valid Parentheses',
    
    # Binary Search (2)
    'Find Minimum In Rotated Sorted Array', 'Search In Rotated Sorted Array',
    
    # Linked List (6)
    'Reverse Linked List', 'Merge Two Sorted Lists', 'Reorder List',
    'Remove Nth Node From End of List', 'LinkedList Cycle', 'Merge K Sorted Lists',
    
    # Trees (11)
    'Invert Binary Tree', 'Maximum Depth of Binary Tree', 'Same Tree', 'Subtree of Another Tree',
    'Lowest Common Ancestor of a Binary Search Tree', 'Validate Binary Search Tree',
    'Kth Smallest Element in a BST', 'Construct Binary Tree from Preorder and Inorder Traversal',
    'Binary Tree Level Order Traversal', 'Binary Tree Maximum Path Sum', 'Serialize and Deserialize Binary Tree',
    
    # Tries (3)
    'Implement Trie Prefix Tree', 'Design Add and Search Words Data Structure', 'Word Search II',
    
    # Heap / Priority Queue (1)
    'Find Median from Data Stream',
    
    # Backtracking (2)
    'Combination Sum', 'Word Search',
    
    # Graphs (6)
    'Number of Islands', 'Clone Graph', 'Pacific Atlantic Water Flow', 'Course Schedule',
    'Number of Connected Components In An Undirected Graph', 'Graph Valid Tree',
    
    # Advanced Graphs (1)
    'Alien Dictionary',
    
    # 1-D Dynamic Programming (10)
    'Climbing Stairs', 'House Robber', 'House Robber II', 'Longest Palindromic Substring',
    'Palindromic Substrings', 'Decode Ways', 'Coin Change', 'Maximum Product Subarray',
    'Word Break', 'Longest Increasing Subsequence',
    
    # 2-D Dynamic Programming (2)
    'Unique Paths', 'Longest Common Subsequence',
    
    # Greedy (2)
    'Maximum Subarray', 'Jump Game',
    
    # Intervals (5)
    'Insert Interval', 'Merge Intervals', 'Non-overlapping Intervals', 'Meeting Rooms', 'Meeting Rooms II',
    
    # Math & Geometry (3)
    'Rotate Image', 'Spiral Matrix', 'Set Matrix Zeroes',
    
    # Bit Manipulation (5)
    'Number of 1 Bits', 'Counting Bits', 'Reverse Bits', 'Missing Number', 'Sum of Two Integers'
}

def is_blind75(name):
    norm = name.lower().replace(' ', '').replace('-', '')
    return any(norm == b.lower().replace(' ', '').replace('-', '') for b in blind75_names)

# Topic slug map
topic_slug_map = {
    "Arrays & Hashing": "arrays-hashing",
    "Two Pointers": "two-pointers",
    "Sliding Window": "sliding-window",
    "Stack": "stack",
    "Binary Search": "binary-search",
    "Linked List": "linked-list",
    "Trees": "trees",
    "Heap / Priority Queue": "heap-priority-queue",
    "Backtracking": "backtracking",
    "Tries": "tries",
    "Graphs": "graphs",
    "Advanced Graphs": "advanced-graphs",
    "1-D Dynamic Programming": "dynamic-programming-1d",
    "2-D Dynamic Programming": "dynamic-programming-2d",
    "Greedy": "greedy",
    "Intervals": "intervals",
    "Math & Geometry": "math-geometry",
    "Bit Manipulation": "bit-manipulation"
}

# Update docs/neetcode150.json
for cat, problems in data.items():
    for p_name, p_info in problems.items():
        if is_blind75(p_name):
            p_info['lists'] = ['neetcode150', 'blind75']
        else:
            p_info['lists'] = ['neetcode150']

with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=4, ensure_ascii=False)

print("Updated docs/neetcode150.json with lists field.")

# Generate handbook/src/lib/neetcodeData.ts
topics_ts = []
global_idx = 0
blind75_count = 0

for category, problems in data.items():
    slug = topic_slug_map.get(category, re.sub(r'[^a-zA-Z0-9]', '-', category).lower())
    prob_list = []
    
    cat_dir_name = re.sub(r'[^a-zA-Z0-9]', '_', category).strip('_')
    
    for p_name, p_info in problems.items():
        global_idx += 1
        b75 = is_blind75(p_name)
        if b75:
            blind75_count += 1
        
        file_basename = re.sub(r'[^a-zA-Z0-9]', '', p_name)
        java_path = f"src/{cat_dir_name}/{file_basename}.java"
        
        lists = ["neetcode150", "blind75"] if b75 else ["neetcode150"]
        
        prob_list.append({
            "id": f"nc_{global_idx}",
            "index": global_idx,
            "name": p_name,
            "difficulty": p_info.get("difficulty", "Medium"),
            "topicId": slug,
            "topicName": category,
            "leetcodeUrl": p_info.get("url", "#"),
            "neetcodeUrl": p_info.get("nurl", "#"),
            "javaFilePath": java_path,
            "lists": lists
        })
    
    topics_ts.append({
        "topicId": slug,
        "topicName": category,
        "problems": prob_list
    })

ts_content = f"""export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type TrackList = 'blind75' | 'neetcode150' | 'all';

export interface NeetCodeProblem {{
  id: string;
  index: number;
  name: string;
  difficulty: Difficulty;
  topicId: string;
  topicName: string;
  leetcodeUrl: string;
  neetcodeUrl: string;
  javaFilePath: string;
  lists: ('neetcode150' | 'blind75')[];
}}

export interface TopicNeetCodeGroup {{
  topicId: string;
  topicName: string;
  problems: NeetCodeProblem[];
}}

export const NEETCODE_TOPICS: TopicNeetCodeGroup[] = {json.dumps(topics_ts, indent=2, ensure_ascii=False)};

export const ALL_NEETCODE_PROBLEMS: NeetCodeProblem[] = NEETCODE_TOPICS.flatMap(t => t.problems);

export const BLIND_75_PROBLEMS: NeetCodeProblem[] = ALL_NEETCODE_PROBLEMS.filter(p => p.lists.includes('blind75'));

export const PROBLEMS_BY_TOPIC: Record<string, NeetCodeProblem[]> = NEETCODE_TOPICS.reduce((acc, t) => {{
  acc[t.topicId] = t.problems;
  return acc;
}}, {{}} as Record<string, NeetCodeProblem[]>);

export const PROBLEM_BY_ID: Record<string, NeetCodeProblem> = ALL_NEETCODE_PROBLEMS.reduce((acc, p) => {{
  acc[p.id] = p;
  return acc;
}}, {{}} as Record<string, NeetCodeProblem>);

export function filterProblemsByTrack(problems: NeetCodeProblem[], track: TrackList): NeetCodeProblem[] {{
  if (track === 'all') return problems;
  return problems.filter(p => p.lists.includes(track));
}}
"""

ts_file_path = os.path.join(project_root, 'handbook', 'src', 'lib', 'neetcodeData.ts')
with open(ts_file_path, 'w', encoding='utf-8') as f:
    f.write(ts_content)

print(f"Generated handbook/src/lib/neetcodeData.ts with {global_idx} problems ({blind75_count} in Blind 75).")
