export interface AlgorithmPattern {
  id: string;
  topicId: string;
  title: string;
  complexity: {
    time: string;
    space: string;
  };
  tags: string[];
  description: string;
  code: string;
  notes?: string;
  isCustom?: boolean;
  updatedAt?: number;
}

export const DEFAULT_PATTERNS: Record<string, AlgorithmPattern[]> = {
  'arrays-hashing': [
    {
      id: 'ah-freq-map',
      topicId: 'arrays-hashing',
      title: 'Element Frequency Map (Đếm tần suất xuất hiện)',
      complexity: { time: 'O(N)', space: 'O(N)' },
      tags: ['HashMap', 'Frequency', 'Counting'],
      description: 'Mẫu đếm số lần xuất hiện của các phần tử trong mảng hoặc chuỗi bằng `HashMap` kết hợp `getOrDefault`.',
      code: `// Xây dựng bảng tần suất xuất hiện của các phần tử
Map<Integer, Integer> freqMap = new HashMap<>();
for (int num : nums) {
    freqMap.put(num, freqMap.getOrDefault(num, 0) + 1);
}

// Duyệt qua từng phần tử và tần suất
for (Map.Entry<Integer, Integer> entry : freqMap.entrySet()) {
    int key = entry.getKey();
    int count = entry.getValue();
    System.out.println(key + " xuất hiện " + count + " lần");
}`,
    },
    {
      id: 'ah-two-sum',
      topicId: 'arrays-hashing',
      title: 'Two Sum Pattern (One-Pass Hash Table)',
      complexity: { time: 'O(N)', space: 'O(N)' },
      tags: ['HashMap', 'Two Sum', 'Lookup'],
      description: 'Tìm 2 phần tử có tổng bằng `target` trong 1 lần duyệt bằng cách lưu `target - num` vào HashMap.',
      code: `public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> map = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (map.containsKey(complement)) {
            return new int[] { map.get(complement), i };
        }
        map.put(nums[i], i);
    }
    return new int[] {};
}`,
    },
    {
      id: 'ah-bucket-sort',
      topicId: 'arrays-hashing',
      title: 'Bucket Sort Pattern (Top K Frequent Elements)',
      complexity: { time: 'O(N)', space: 'O(N)' },
      tags: ['Bucket Sort', 'HashMap', 'Top K'],
      description: 'Lấy Top K phần tử có tần suất cao nhất với độ phức tạp tuyến tính `O(N)` thay vì dùng Heap `O(N log K)`.',
      code: `public int[] topKFrequent(int[] nums, int k) {
    Map<Integer, Integer> count = new HashMap<>();
    for (int num : nums) {
        count.put(num, count.getOrDefault(num, 0) + 1);
    }

    // Mảng buckets: index là tần suất (0 đến nums.length)
    List<Integer>[] buckets = new List[nums.length + 1];
    for (int key : count.keySet()) {
        int freq = count.get(key);
        if (buckets[freq] == null) {
            buckets[freq] = new ArrayList<>();
        }
        buckets[freq].add(key);
    }

    int[] result = new int[k];
    int idx = 0;
    // Duyệt ngược từ tần suất cao nhất về thấp nhất
    for (int i = buckets.length - 1; i >= 0 && idx < k; i--) {
        if (buckets[i] != null) {
            for (int num : buckets[i]) {
                result[idx++] = num;
                if (idx == k) return result;
            }
        }
    }
    return result;
}`,
    },
    {
      id: 'ah-prefix-sum',
      topicId: 'arrays-hashing',
      title: 'Prefix Sum Pattern (Mảng cộng dồn)',
      complexity: { time: 'O(N)', space: 'O(N)' },
      tags: ['Prefix Sum', 'Array', 'Range Query'],
      description: 'Tính tổng đoạn `[L, R]` trong `O(1)` sau khi tiền xử lý mảng cộng dồn.',
      code: `// Khởi tạo mảng prefix sum với size N + 1 để xử lý biên 0
int n = nums.length;
int[] prefix = new int[n + 1];
for (int i = 0; i < n; i++) {
    prefix[i + 1] = prefix[i] + nums[i];
}

// Truy vấn tổng từ index L đến R (0-indexed) trong O(1):
// sum(L, R) = prefix[R + 1] - prefix[L]
public int queryRangeSum(int[] prefix, int left, int right) {
    return prefix[right + 1] - prefix[left];
}`,
    },
  ],
  'two-pointers': [
    {
      id: 'tp-converging',
      topicId: 'two-pointers',
      title: 'Opposite Ends Two Pointers (Hai con trỏ đối đầu)',
      complexity: { time: 'O(N)', space: 'O(1)' },
      tags: ['Two Pointers', 'Sorted Array', 'Palindrome'],
      description: 'Mẫu 2 con trỏ từ 2 đầu mảng hội tụ về giữa (áp dụng cho Two Sum sorted, Valid Palindrome, Container With Most Water).',
      code: `public boolean isPalindrome(String s) {
    int left = 0, right = s.length() - 1;
    while (left < right) {
        // Bỏ qua ký tự không hợp lệ nếu cần
        while (left < right && !Character.isLetterOrDigit(s.charAt(left))) left++;
        while (left < right && !Character.isLetterOrDigit(s.charAt(right))) right--;

        if (Character.toLowerCase(s.charAt(left)) != Character.toLowerCase(s.charAt(right))) {
            return false;
        }
        left++;
        right--;
    }
    return true;
}`,
    },
    {
      id: 'tp-slow-fast',
      topicId: 'two-pointers',
      title: 'Slow & Fast Pointers (Xóa phần tử trùng / Ghi đè tại chỗ)',
      complexity: { time: 'O(N)', space: 'O(1)' },
      tags: ['Two Pointers', 'In-place', 'Array'],
      description: 'Con trỏ chậm giữ vị trí ghi đè hợp lệ, con trỏ nhanh quét qua mảng.',
      code: `// Xóa phần tử trùng lặp trong mảng đã sắp xếp
public int removeDuplicates(int[] nums) {
    if (nums.length == 0) return 0;
    int slow = 0;
    for (int fast = 1; fast < nums.length; fast++) {
        if (nums[fast] != nums[slow]) {
            slow++;
            nums[slow] = nums[fast];
        }
    }
    return slow + 1; // Độ dài mảng mới
}`,
    },
  ],
  'sliding-window': [
    {
      id: 'sw-variable',
      topicId: 'sliding-window',
      title: 'Variable-Size Sliding Window (Cửa sổ trượt linh hoạt)',
      complexity: { time: 'O(N)', space: 'O(K)' },
      tags: ['Sliding Window', 'Dynamic Size', 'Subarray'],
      description: 'Mẫu mở rộng con trỏ `right` liên tục và thu hẹp `left` khi vi phạm điều kiện.',
      code: `public int lengthOfLongestSubstring(String s) {
    Set<Character> seen = new HashSet<>();
    int left = 0, maxLen = 0;

    for (int right = 0; right < s.length(); right++) {
        char c = s.charAt(right);
        // Thu hẹp cửa sổ khi bị trùng ký tự
        while (seen.contains(c)) {
            seen.remove(s.charAt(left));
            left++;
        }
        seen.add(c);
        maxLen = Math.max(maxLen, right - left + 1);
    }
    return maxLen;
}`,
    },
  ],
  'binary-search': [
    {
      id: 'bs-standard',
      topicId: 'binary-search',
      title: 'Standard Binary Search Template (Tìm kiếm nhị phân chuẩn)',
      complexity: { time: 'O(log N)', space: 'O(1)' },
      tags: ['Binary Search', 'Divide and Conquer'],
      description: 'Mẫu tìm kiếm nhị phân chuẩn tránh tràn số nguyên với `left + (right - left) / 2`.',
      code: `public int search(int[] nums, int target) {
    int left = 0, right = nums.length - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2; // Tránh tràn số int
        if (nums[mid] == target) {
            return mid;
        } else if (nums[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return -1; // Không tìm thấy
}`,
    },
  ],
  stack: [
    {
      id: 'st-monotonic',
      topicId: 'stack',
      title: 'Monotonic Stack (Next Greater Element / Daily Temperatures)',
      complexity: { time: 'O(N)', space: 'O(N)' },
      tags: ['Stack', 'Monotonic Stack'],
      description: 'Stack duy trì tính đơn điệu để tìm phần tử lớn hơn tiếp theo trong mảng trong `O(N)`.',
      code: `public int[] dailyTemperatures(int[] temperatures) {
    int n = temperatures.length;
    int[] answer = new int[n];
    Deque<Integer> stack = new ArrayDeque<>(); // Lưu index

    for (int i = 0; i < n; i++) {
        while (!stack.isEmpty() && temperatures[i] > temperatures[stack.peek()]) {
            int prevIdx = stack.pop();
            answer[prevIdx] = i - prevIdx;
        }
        stack.push(i);
    }
    return answer;
}`,
    },
  ],
  trees: [
    {
      id: 'tree-bfs',
      topicId: 'trees',
      title: 'Level-Order Traversal (Tree BFS)',
      complexity: { time: 'O(N)', space: 'O(N)' },
      tags: ['Trees', 'BFS', 'Queue'],
      description: 'Duyệt cây theo từng tầng bằng `Queue`.',
      code: `public List<List<Integer>> levelOrder(TreeNode root) {
    List<List<Integer>> result = new ArrayList<>();
    if (root == null) return result;

    Queue<TreeNode> queue = new ArrayDeque<>();
    queue.offer(root);

    while (!queue.isEmpty()) {
        int levelSize = queue.size();
        List<Integer> currentLevel = new ArrayList<>();

        for (int i = 0; i < levelSize; i++) {
            TreeNode node = queue.poll();
            currentLevel.add(node.val);

            if (node.left != null) queue.offer(node.left);
            if (node.right != null) queue.offer(node.right);
        }
        result.add(currentLevel);
    }
    return result;
}`,
    },
  ],
  'heap-priority-queue': [
    {
      id: 'heap-top-k',
      topicId: 'heap-priority-queue',
      title: 'Top K Elements with Min-Heap',
      complexity: { time: 'O(N log K)', space: 'O(K)' },
      tags: ['Heap', 'PriorityQueue', 'Top K'],
      description: 'Tìm K phần tử lớn nhất bằng cách duy trì Min-Heap có kích thước cố định K.',
      code: `public int findKthLargest(int[] nums, int k) {
    // Min-Heap duy trì K phần tử lớn nhất
    PriorityQueue<Integer> minHeap = new PriorityQueue<>();

    for (int num : nums) {
        minHeap.offer(num);
        if (minHeap.size() > k) {
            minHeap.poll(); // Loại bỏ phần tử nhỏ nhất
        }
    }
    return minHeap.peek();
}`,
    },
  ],
  backtracking: [
    {
      id: 'bt-subsets',
      topicId: 'backtracking',
      title: 'Subsets / Combinations Template',
      complexity: { time: 'O(2^N)', space: 'O(N)' },
      tags: ['Backtracking', 'Recursion'],
      description: 'Mẫu quay lui chuẩn: Choose -> Recurse -> Un-choose (Backtrack).',
      code: `public List<List<Integer>> subsets(int[] nums) {
    List<List<Integer>> result = new ArrayList<>();
    backtrack(nums, 0, new ArrayList<>(), result);
    return result;
}

private void backtrack(int[] nums, int start, List<Integer> current, List<List<Integer>> result) {
    result.add(new ArrayList<>(current)); // Lưu trạng thái hiện tại

    for (int i = start; i < nums.length; i++) {
        current.add(nums[i]);                   // 1. Chọn
        backtrack(nums, i + 1, current, result); // 2. Đệ quy
        current.remove(current.size() - 1);     // 3. Quay lui (Undo)
    }
}`,
    },
  ],
  graphs: [
    {
      id: 'graph-grid-dfs',
      topicId: 'graphs',
      title: '2D Grid / Matrix DFS (Number of Islands / Flood Fill)',
      complexity: { time: 'O(M * N)', space: 'O(M * N)' },
      tags: ['Graphs', 'Matrix', 'DFS'],
      description: 'Mẫu duyệt ma trận 4 hướng (lên, xuống, trái, phải) và kiểm tra biên.',
      code: `public int numIslands(char[][] grid) {
    if (grid == null || grid.length == 0) return 0;
    int count = 0;
    int m = grid.length, n = grid[0].length;

    for (int r = 0; r < m; r++) {
        for (int c = 0; c < n; c++) {
            if (grid[r][c] == '1') {
                count++;
                dfs(grid, r, c, m, n);
            }
        }
    }
    return count;
}

private void dfs(char[][] grid, int r, int c, int m, int n) {
    // Kiểm tra tràn biên hoặc đã duyệt
    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] != '1') {
        return;
    }
    grid[r][c] = '0'; // Đánh dấu đã thăm

    // Duyệt 4 hướng lân cận
    dfs(grid, r + 1, c, m, n);
    dfs(grid, r - 1, c, m, n);
    dfs(grid, r, c + 1, m, n);
    dfs(grid, r, c - 1, m, n);
}`,
    },
  ],
  'dynamic-programming-1d': [
    {
      id: 'dp1-tabulation',
      topicId: 'dynamic-programming-1d',
      title: '1D DP Tabulation Template with Space Optimization',
      complexity: { time: 'O(N)', space: 'O(1)' },
      tags: ['DP', 'Tabulation', 'Space Optimization'],
      description: 'Mẫu quy hoạch động 1 chiều tối ưu không gian bộ nhớ từ `O(N)` xuống `O(1)`.',
      code: `// Ví dụ: House Robber / Climbing Stairs
public int rob(int[] nums) {
    if (nums.length == 0) return 0;
    if (nums.length == 1) return nums[0];

    int prev2 = 0; // dp[i - 2]
    int prev1 = 0; // dp[i - 1]

    for (int num : nums) {
        int current = Math.max(prev1, prev2 + num);
        prev2 = prev1;
        prev1 = current;
    }
    return prev1;
}`,
    },
  ],
};
