'use client';

import { useState, useEffect } from 'react';

export interface PrerequisiteItem {
  title: string;
  course: string;
}

export const TOPIC_PREREQUISITES_MAP: Record<string, PrerequisiteItem[]> = {
  'arrays-hashing': [
    { title: 'Dynamic Arrays', course: 'Data Structures & Algorithms for Beginners' },
    { title: 'Hash Usage', course: 'Data Structures & Algorithms for Beginners' },
    { title: 'Hash Implementation', course: 'Data Structures & Algorithms for Beginners' },
    { title: 'Prefix Sums', course: 'Advanced Algorithms' },
  ],
  'two-pointers': [
    { title: 'Two Pointers', course: 'Data Structures & Algorithms for Beginners' },
    { title: 'Arrays & Strings', course: 'Core Foundations' },
  ],
  stack: [
    { title: 'Stacks', course: 'Data Structures & Algorithms for Beginners' },
    { title: 'Monotonic Stack', course: 'Advanced Algorithms' },
  ],
  'binary-search': [
    { title: 'Search Array', course: 'Data Structures & Algorithms for Beginners' },
    { title: 'Search Range', course: 'Data Structures & Algorithms for Beginners' },
  ],
  'sliding-window': [
    { title: 'Sliding Window Fixed', course: 'Data Structures & Algorithms for Beginners' },
    { title: 'Sliding Window Variable', course: 'Data Structures & Algorithms for Beginners' },
  ],
  'linked-list': [
    { title: 'Singly Linked Lists', course: 'Data Structures & Algorithms for Beginners' },
    { title: 'Doubly Linked Lists', course: 'Data Structures & Algorithms for Beginners' },
    { title: 'Fast and Slow Pointers', course: 'Data Structures & Algorithms for Beginners' },
  ],
  trees: [
    { title: 'Binary Tree Traversal', course: 'Data Structures & Algorithms for Beginners' },
    { title: 'Binary Search Tree', course: 'Data Structures & Algorithms for Beginners' },
    { title: 'Depth-First Search (DFS)', course: 'Data Structures & Algorithms for Beginners' },
    { title: 'Breadth-First Search (BFS)', course: 'Data Structures & Algorithms for Beginners' },
  ],
  tries: [
    { title: 'Trie Implementation', course: 'Advanced Algorithms' },
    { title: 'Trie Prefix Search', course: 'Advanced Algorithms' },
  ],
  backtracking: [
    { title: 'Tree Maze & Recursion', course: 'Data Structures & Algorithms for Beginners' },
    { title: 'Subsets & Permutations', course: 'Advanced Algorithms' },
    { title: 'Combinations', course: 'Advanced Algorithms' },
  ],
  'heap-priority-queue': [
    { title: 'Heap Properties', course: 'Data Structures & Algorithms for Beginners' },
    { title: 'Push & Pop Operations', course: 'Data Structures & Algorithms for Beginners' },
    { title: 'Heapify', course: 'Data Structures & Algorithms for Beginners' },
    { title: 'Two Heaps Pattern', course: 'Advanced Algorithms' },
  ],
  graphs: [
    { title: 'Matrix DFS & BFS', course: 'Data Structures & Algorithms for Beginners' },
    { title: 'Adjacency List', course: 'Data Structures & Algorithms for Beginners' },
    { title: 'Connected Components', course: 'Advanced Algorithms' },
  ],
  'dynamic-programming-1d': [
    { title: '1D Memoization (Top-Down)', course: 'Data Structures & Algorithms for Beginners' },
    { title: '1D Dynamic Programming (Bottom-Up)', course: 'Data Structures & Algorithms for Beginners' },
    { title: '0/1 Knapsack', course: 'Advanced Algorithms' },
  ],
  intervals: [
    { title: 'Interval Overlaps & Sorting', course: 'Core Foundations' },
    { title: 'Meeting Rooms Pattern', course: 'Advanced Algorithms' },
  ],
  greedy: [
    { title: 'Greedy Choice Property', course: 'Advanced Algorithms' },
    { title: 'Kadane\'s Algorithm', course: 'Advanced Algorithms' },
  ],
  'advanced-graphs': [
    { title: 'Dijkstra\'s Shortest Path', course: 'Advanced Algorithms' },
    { title: 'Prim\'s Minimum Spanning Tree', course: 'Advanced Algorithms' },
    { title: 'Kruskal\'s & Union-Find (Disjoint Set)', course: 'Advanced Algorithms' },
    { title: 'Topological Sort', course: 'Advanced Algorithms' },
  ],
  'dynamic-programming-2d': [
    { title: '2D Memoization & Grid Paths', course: 'Data Structures & Algorithms for Beginners' },
    { title: '2D Dynamic Programming (Bottom-Up)', course: 'Data Structures & Algorithms for Beginners' },
    { title: 'Longest Common Subsequence', course: 'Advanced Algorithms' },
  ],
  'bit-manipulation': [
    { title: 'Bitwise AND, OR, XOR, NOT', course: 'Data Structures & Algorithms for Beginners' },
    { title: 'Bit Shifts (<<, >>, >>>)', course: 'Data Structures & Algorithms for Beginners' },
    { title: 'Counting Bits & Masking', course: 'Advanced Algorithms' },
  ],
  'math-geometry': [
    { title: 'Greatest Common Divisor (GCD)', course: 'Advanced Algorithms' },
    { title: 'Fast Exponentiation', course: 'Advanced Algorithms' },
    { title: 'Matrix Rotation & Spiral', course: 'Core Foundations' },
  ],
  prerequisites: [
    { title: 'Big-O & Complexity Analysis', course: 'Core Foundations' },
    { title: 'Primitive vs Reference Types', course: 'Java Essentials' },
    { title: 'Collections Framework Overview', course: 'Java Essentials' },
    { title: 'Recursion & Call Stack', course: 'Core Foundations' },
  ],
};

interface Props {
  topicId: string;
}

export default function PrerequisitesGrid({ topicId }: Props) {
  const items = TOPIC_PREREQUISITES_MAP[topicId] || [];
  const [isMounted, setIsMounted] = useState(false);
  const [checkedMap, setCheckedMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setIsMounted(true);
    try {
      const saved = localStorage.getItem(`prereqs_${topicId}`);
      if (saved) {
        setCheckedMap(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, [topicId]);

  if (items.length === 0) return null;

  const completedCount = isMounted ? items.filter((item) => checkedMap[item.title]).length : 0;

  function toggleItem(title: string) {
    setCheckedMap((prev) => {
      const next = { ...prev, [title]: !prev[title] };
      try {
        localStorage.setItem(`prereqs_${topicId}`, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }

  return (
    <div
      style={{
        margin: '20px 0 28px 0',
        padding: '20px',
        borderRadius: '8px',
        backgroundColor: '#fff9f4',
        border: '1px solid var(--color-border)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h3
            style={{
              fontSize: '1rem',
              fontWeight: 600,
              fontFamily: 'var(--font-label)',
              color: 'var(--color-primary)',
              margin: 0,
            }}
          >
            Prerequisites
          </h3>
          <span
            style={{
              fontSize: '0.78rem',
              fontWeight: 600,
              color: 'var(--color-secondary)',
              fontFamily: 'var(--font-mono)',
              background: '#ede8e3',
              padding: '2px 8px',
              borderRadius: '12px',
            }}
          >
            {completedCount} / {items.length}
          </span>
        </div>
        <span style={{ fontSize: '0.75rem', color: 'var(--color-secondary)' }}>
          Check items as you master them
        </span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '12px',
          alignItems: 'stretch',
        }}
      >
        {items.map((item) => {
          const isDone = isMounted && !!checkedMap[item.title];
          return (
            <div
              key={item.title}
              onClick={() => toggleItem(item.title)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%',
                minHeight: '78px',
                padding: '12px 14px',
                borderRadius: '6px',
                backgroundColor: isDone ? '#fff2e6' : '#ffffff',
                border: isDone ? '1px solid var(--color-tertiary)' : '1px solid var(--color-border)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                userSelect: 'none',
                boxSizing: 'border-box',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '8px',
                  marginBottom: '8px',
                }}
              >
                <span
                  style={{
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    fontFamily: 'var(--font-label)',
                    color: isDone ? 'var(--color-tertiary)' : 'var(--color-primary)',
                    textDecoration: isDone ? 'line-through' : 'none',
                    lineHeight: 1.35,
                    flex: 1,
                  }}
                >
                  {item.title}
                </span>
                <input
                  type="checkbox"
                  checked={isDone}
                  readOnly
                  style={{
                    cursor: 'pointer',
                    accentColor: 'var(--color-tertiary)',
                    marginTop: '2px',
                    flexShrink: 0,
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 500,
                  color: '#4f46e5',
                  fontFamily: 'var(--font-label)',
                  marginTop: 'auto',
                }}
              >
                {item.course}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
