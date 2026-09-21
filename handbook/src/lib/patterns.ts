export interface UseCaseItem {
  id?: string;
  title: string;
  whenToUse: string;
  complexity?: string;
  example?: string;
}

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
  pseudoCode?: string;
  code: string;
  useCases?: UseCaseItem[];
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
      description: 'Dùng bảng băm `HashMap` kết hợp `getOrDefault()` để đếm số lần xuất hiện của từng phần tử trong một lần duyệt `O(N)`. Thích hợp cho các bài kiểm tra mảng đảo ký tự (Anagram), tìm phần tử chiếm đa số, hoặc gom nhóm (Group Anagrams).',
      pseudoCode: `1. Initialize freqMap = empty HashMap
2. For each element 'num' in array:
     freqMap[num] = freqMap.getOrDefault(num, 0) + 1
3. Traverse freqMap entries (key, count) to process or query frequency`,
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
      useCases: [
        {
          title: 'Kiểm tra chuỗi đảo ký tự (Anagrams)',
          whenToUse: 'Hai chuỗi có cùng số lượng các ký tự hay không. Tăng đếm cho chuỗi 1 và giảm đếm cho chuỗi 2.',
          complexity: 'Time: O(N) | Space: O(K)',
          example: 'Valid Anagram (LeetCode 242)',
        },
        {
          title: 'Gom nhóm chuỗi đảo (Group Anagrams)',
          whenToUse: 'Gom nhóm các từ có cùng tập ký tự bằng cách dùng chữ ký tần suất hoặc chuỗi đã sort làm khóa HashMap.',
          complexity: 'Time: O(N * K) | Space: O(N * K)',
          example: 'Group Anagrams (LeetCode 49)',
        },
        {
          title: 'Tìm phần tử chiếm đa số / xuất hiện duy nhất',
          whenToUse: 'Duyệt bảng tần suất để tìm phần tử có count > N/2 hoặc count == 1.',
          complexity: 'Time: O(N) | Space: O(N)',
          example: 'Majority Element (LeetCode 169), Single Number',
        },
      ],
    },
    {
      id: 'ah-two-sum',
      topicId: 'arrays-hashing',
      title: 'Two Sum Pattern (One-Pass Hash Table)',
      complexity: { time: 'O(N)', space: 'O(N)' },
      tags: ['HashMap', 'Two Sum', 'Lookup'],
      description: 'Tìm 2 phần tử có tổng bằng `target` trong 1 lần duyệt. Khi xét phần tử `x`, ta tra cứu xem phần bù `complement = target - x` đã từng xuất hiện trước đó trong HashMap hay chưa. Nếu có trả về chỉ số ngay lập tức.',
      pseudoCode: `1. Initialize map = empty HashMap (stores number -> index)
2. For i from 0 to nums.length - 1:
     complement = target - nums[i]
     If complement exists in map:
         Return [map.get(complement), i]
     Else:
         map.put(nums[i], i)
3. Return empty array if no pair found`,
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
      useCases: [
        {
          title: 'Tìm 2 số có tổng bằng Target',
          whenToUse: 'Mảng chưa sắp xếp, cần tìm vị trí/giá trị 2 số có tổng xác định trong một lần duyệt O(N).',
          complexity: 'Time: O(N) | Space: O(N)',
          example: 'Two Sum (LeetCode 1)',
        },
        {
          title: 'Tra cứu phần bù & Hiệu (Difference Lookup)',
          whenToUse: 'Kiểm tra xem tồn tại x sao cho x + k = y hoặc x - y = k trong mảng hay không.',
          complexity: 'Time: O(N) | Space: O(N)',
          example: 'K-diff Pairs in an Array (LeetCode 532)',
        },
      ],
    },
    {
      id: 'ah-bucket-sort',
      topicId: 'arrays-hashing',
      title: 'Bucket Sort Pattern (Top K Frequent Elements)',
      complexity: { time: 'O(N)', space: 'O(N)' },
      tags: ['Bucket Sort', 'HashMap', 'Top K'],
      description: 'Đạt độ phức tạp thời gian tuyến tính `O(N)` bằng cách dùng mảng các danh sách (buckets), trong đó chỉ số index đại diện cho tần suất xuất hiện (tối đa bằng `N`).',
      pseudoCode: `1. Count frequencies using a HashMap: map[num] -> count
2. Create buckets array of size (N + 1) where buckets[freq] = list of numbers
3. Populate buckets with elements grouped by their frequency
4. Iterate from highest frequency (N down to 0):
     Add elements from buckets[i] into result until result has K elements
5. Return result`,
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
      useCases: [
        {
          title: 'Top K phần tử có tần suất cao nhất',
          whenToUse: 'Thay vì dùng Heap O(N log K), gom nhóm theo tần suất (index 0 đến N) để đạt thời gian tuyến tính O(N).',
          complexity: 'Time: O(N) | Space: O(N)',
          example: 'Top K Frequent Elements (LeetCode 347)',
        },
        {
          title: 'Mảng số nguyên dải hẹp (Counting / Direct Bucket)',
          whenToUse: 'Dữ liệu số nguyên không âm có giá trị max nhỏ (0-100, tuổi 0-120, mã ASCII 0-255). Tránh dùng khi max quá lớn gây tràn bộ nhớ.',
          complexity: 'Time: O(N + max) | Space: O(max)',
          example: 'Sort Colors (LeetCode 75), Sort Array by Parity',
        },
        {
          title: 'Sắp xếp chuỗi theo tần suất ký tự',
          whenToUse: 'Gom các ký tự có cùng số lần xuất hiện vào bucket tương ứng rồi nối chuỗi từ bucket lớn nhất.',
          complexity: 'Time: O(N) | Space: O(N)',
          example: 'Sort Characters By Frequency (LeetCode 451)',
        },
        {
          title: 'Số thực phân bố đều trong khoảng [0, 1)',
          whenToUse: 'Chia dải [0, 1) thành N thùng con, đưa số vào từng thùng rồi ghép lại theo thứ tự.',
          complexity: 'Time: O(N) trung bình | Space: O(N)',
          example: 'Bucket Sort trên số thực phân bố đều',
        },
      ],
    },
    {
      id: 'ah-prefix-sum',
      topicId: 'arrays-hashing',
      title: 'Prefix Sum Pattern (Mảng cộng dồn)',
      complexity: { time: 'O(N)', space: 'O(N)' },
      tags: ['Prefix Sum', 'Array', 'Range Query'],
      description: 'Tiền tính toán mảng cộng dồn `prefix[i] = nums[0] + ... + nums[i-1]` để trả lời các truy vấn tính tổng đoạn con bất kỳ `sum(L, R)` trong `O(1)`.',
      pseudoCode: `1. Create prefix array of size (N + 1) with prefix[0] = 0
2. For i from 0 to N - 1:
     prefix[i + 1] = prefix[i] + nums[i]
3. Query sum from left to right (0-indexed):
     queryRangeSum(left, right) = prefix[right + 1] - prefix[left]`,
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
      useCases: [
        {
          title: 'Truy vấn tổng đoạn con liên tiếp nhiều lần',
          whenToUse: 'Mảng tĩnh (không cập nhật), cần trả lời nhiều câu hỏi tính tổng subarray từ L đến R trong O(1).',
          complexity: 'Time: O(1) mỗi truy vấn | Space: O(N)',
          example: 'Range Sum Query - Immutable (LeetCode 303)',
        },
        {
          title: 'Đếm số lượng mảng con có tổng bằng K',
          whenToUse: 'Kết hợp Prefix Sum với HashMap lưu tần suất prefixSum. Kiểm tra prefixSum - K đã từng xuất hiện chưa.',
          complexity: 'Time: O(N) | Space: O(N)',
          example: 'Subarray Sum Equals K (LeetCode 560)',
        },
      ],
    },
  ],
  'two-pointers': [
    {
      id: 'tp-converging',
      topicId: 'two-pointers',
      title: 'Opposite Ends Two Pointers (Hai con trỏ đối đầu)',
      complexity: { time: 'O(N)', space: 'O(1)' },
      tags: ['Two Pointers', 'Sorted Array', 'Palindrome'],
      description: 'Đặt hai con trỏ tại 2 đầu (`left = 0`, `right = N - 1`) và di chuyển hội tụ về giữa dựa trên điều kiện bài toán.',
      pseudoCode: `1. left = 0, right = length - 1
2. While left < right:
     Skip invalid characters if needed
     If s[left] != s[right]: return false
     left++, right--
3. Return true`,
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
      description: 'Con trỏ chậm `slow` theo dõi vị trí phần tử duy nhất cuối cùng, con trỏ nhanh `fast` quét tìm các phần tử mới để ghi đè.',
      pseudoCode: `1. If array is empty, return 0
2. slow = 0
3. For fast from 1 to N - 1:
     If nums[fast] != nums[slow]:
         slow++
         nums[slow] = nums[fast]
4. Return slow + 1`,
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
      description: 'Mở rộng biên phải `right` để nạp phần tử vào cửa sổ. Khi điều kiện bị vi phạm (ví dụ trùng ký tự hoặc tổng quá lớn), co biên trái `left` cho đến khi cửa sổ hợp lệ trở lại.',
      pseudoCode: `1. left = 0, maxLen = 0, state = empty Set/Map
2. For right from 0 to s.length - 1:
     While condition is violated by adding s[right]:
         Remove s[left] from state
         left++
     Add s[right] to state
     maxLen = max(maxLen, right - left + 1)
3. Return maxLen`,
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
      description: 'Tìm kiếm trên không gian tìm kiếm đơn điệu đã sắp xếp. Dùng công thức `left + (right - left) / 2` để tránh hiện tượng tràn số nguyên (integer overflow).',
      pseudoCode: `1. left = 0, right = length - 1
2. While left <= right:
     mid = left + (right - left) / 2
     If nums[mid] == target: Return mid
     Else if nums[mid] < target: left = mid + 1
     Else: right = mid - 1
3. Return -1 (not found)`,
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
      description: 'Duy trì Stack chứa các chỉ số theo thứ tự giảm dần hoặc tăng dần giá trị để tìm phần tử lớn hơn / nhỏ hơn gần nhất trong `O(N)`.',
      pseudoCode: `1. Initialize empty Stack to store indices
2. Initialize answer array of size N filled with default (e.g. 0)
3. For i from 0 to N - 1:
     While stack is not empty AND current element > element at stack.peek():
         prevIdx = stack.pop()
         answer[prevIdx] = i - prevIdx
     stack.push(i)
4. Return answer`,
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
      description: 'Duyệt cây theo từng tầng từ trên xuống dưới bằng hàng đợi `Queue`. Đo `levelSize = queue.size()` để xử lý trọn vẹn một tầng trong vòng lặp.',
      pseudoCode: `1. If root is null, return empty list
2. Initialize queue with root
3. While queue is not empty:
     levelSize = queue.size()
     levelList = empty list
     Repeat levelSize times:
         node = queue.poll()
         levelList.add(node.val)
         If node.left exists: queue.offer(node.left)
         If node.right exists: queue.offer(node.right)
     result.add(levelList)
4. Return result`,
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
      description: 'Tìm K phần tử lớn nhất bằng Min-Heap giới hạn kích thước tối đa là K. Khi heap vượt quá K, loại bỏ phần tử nhỏ nhất ở đỉnh heap.',
      pseudoCode: `1. Initialize Min-Heap (PriorityQueue<Integer>)
2. For each number in nums:
     minHeap.offer(number)
     If minHeap.size() > K:
         minHeap.poll()
3. The top of the heap is the K-th largest element (minHeap.peek())`,
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
      description: 'Khuôn mẫu quay lui 3 bước: Chọn phần tử (Choose) -> Gọi đệ quy nhánh tiếp theo (Explore) -> Hoàn tác phần tử (Un-choose / Backtrack).',
      pseudoCode: `function backtrack(start, currentList, result):
    1. result.add(copy of currentList)
    2. For i from start to nums.length - 1:
         currentList.add(nums[i])          // 1. Choose
         backtrack(i + 1, currentList)     // 2. Explore
         currentList.removeLast()          // 3. Undo`,
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
      description: 'Duyệt loang trên ma trận 2 chiều theo 4 hướng (trên, dưới, trái, phải). Đánh dấu các ô đã thăm ngay khi duyệt để tránh lặp vô tận.',
      pseudoCode: `function dfs(r, c):
    If (r, c) out of bounds OR grid[r][c] != '1':
        Return
    grid[r][c] = '0'  // Mark visited
    dfs(r + 1, c)     // Down
    dfs(r - 1, c)     // Up
    dfs(r, c + 1)     // Right
    dfs(r, c - 1)     // Left`,
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
      description: 'Quy hoạch động 1 chiều tối ưu không gian bộ nhớ từ mảng `dp[N]` xuống 2 biến tạm `prev1` và `prev2` khi trạng thái chỉ phụ thuộc vào 2 bước liền trước.',
      pseudoCode: `1. Handle base cases (N == 0, N == 1)
2. prev2 = 0, prev1 = 0
3. For each num in nums:
     current = max(prev1, prev2 + num)
     prev2 = prev1
     prev1 = current
4. Return prev1`,
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
