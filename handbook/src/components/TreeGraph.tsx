'use client';

import Link from 'next/link';

interface NodeData {
  id: string;
  label: string;
  x: number;
  y: number;
  isPrereq?: boolean;
}

interface EdgeData {
  from: string;
  to: string;
  isPrereqEdge?: boolean;
}

const NODE_W = 150;
const NODE_H = 44;

// 19 topics with NeetCode 150 DAG layout + Prerequisites foundation
const NODES: NodeData[] = [
  // Prerequisites (Foundation)
  { id: 'prerequisites', label: 'Prerequisites', x: 500, y: 40, isPrereq: true },

  // Row 0
  { id: 'arrays-hashing', label: 'Arrays & Hashing', x: 500, y: 125 },

  // Row 1
  { id: 'two-pointers', label: 'Two Pointers', x: 370, y: 210 },
  { id: 'stack', label: 'Stack', x: 630, y: 210 },

  // Row 2
  { id: 'binary-search', label: 'Binary Search', x: 200, y: 295 },
  { id: 'sliding-window', label: 'Sliding Window', x: 370, y: 295 },
  { id: 'linked-list', label: 'Linked List', x: 540, y: 295 },

  // Row 3
  { id: 'trees', label: 'Trees', x: 370, y: 380 },

  // Row 4
  { id: 'tries', label: 'Tries', x: 130, y: 465 },
  { id: 'backtracking', label: 'Backtracking', x: 450, y: 465 },
  { id: 'dynamic-programming-1d', label: '1-D Dynamic Programming', x: 770, y: 465 },

  // Row 5
  { id: 'heap-priority-queue', label: 'Heap / Priority Queue', x: 290, y: 550 },
  { id: 'graphs', label: 'Graphs', x: 610, y: 550 },
  { id: 'bit-manipulation', label: 'Bit Manipulation', x: 870, y: 550 },

  // Row 6
  { id: 'intervals', label: 'Intervals', x: 130, y: 635 },
  { id: 'greedy', label: 'Greedy', x: 290, y: 635 },
  { id: 'advanced-graphs', label: 'Advanced Graphs', x: 450, y: 635 },
  { id: 'dynamic-programming-2d', label: '2-D Dynamic Programming', x: 690, y: 635 },

  // Row 7
  { id: 'math-geometry', label: 'Math & Geometry', x: 780, y: 720 },
];

const EDGES: EdgeData[] = [
  // From Prerequisites
  { from: 'prerequisites', to: 'arrays-hashing', isPrereqEdge: true },

  // From Arrays & Hashing
  { from: 'arrays-hashing', to: 'two-pointers' },
  { from: 'arrays-hashing', to: 'stack' },

  // From Two Pointers
  { from: 'two-pointers', to: 'binary-search' },
  { from: 'two-pointers', to: 'sliding-window' },
  { from: 'two-pointers', to: 'linked-list' },

  // Into Trees
  { from: 'binary-search', to: 'trees' },
  { from: 'sliding-window', to: 'trees' },
  { from: 'linked-list', to: 'trees' },

  // From Trees
  { from: 'trees', to: 'tries' },
  { from: 'trees', to: 'backtracking' },
  { from: 'trees', to: 'dynamic-programming-1d' },

  // From Backtracking
  { from: 'backtracking', to: 'heap-priority-queue' },
  { from: 'backtracking', to: 'graphs' },

  // From Heap / Priority Queue
  { from: 'heap-priority-queue', to: 'intervals' },
  { from: 'heap-priority-queue', to: 'greedy' },
  { from: 'heap-priority-queue', to: 'advanced-graphs' },

  // From Graphs
  { from: 'graphs', to: 'advanced-graphs' },
  { from: 'graphs', to: 'dynamic-programming-2d' },

  // From 1-D Dynamic Programming
  { from: 'dynamic-programming-1d', to: 'dynamic-programming-2d' },
  { from: 'dynamic-programming-1d', to: 'bit-manipulation' },

  // Into Math & Geometry
  { from: 'dynamic-programming-2d', to: 'math-geometry' },
  { from: 'bit-manipulation', to: 'math-geometry' },
];

const nodeMap = new Map<string, NodeData>(NODES.map((n) => [n.id, n]));

export default function TreeGraph() {
  return (
    <div className="tree-scroll" style={{ width: '100%', overflowX: 'auto', textAlign: 'center' }}>
      <svg
        viewBox="0 0 1000 765"
        style={{
          width: '100%',
          maxWidth: '1000px',
          height: 'auto',
          display: 'inline-block',
          verticalAlign: 'middle',
        }}
      >
        <defs>
          <linearGradient id="edgeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#c7bcb4" />
            <stop offset="100%" stopColor="#d9cfc7" />
          </linearGradient>
          <linearGradient id="prereqGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#990f3d" />
            <stop offset="100%" stopColor="#b31448" />
          </linearGradient>
          <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="125%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#33302e" floodOpacity="0.06" />
          </filter>
        </defs>

        {/* Connections */}
        {EDGES.map((edge, i) => {
          const fromNode = nodeMap.get(edge.from);
          const toNode = nodeMap.get(edge.to);
          if (!fromNode || !toNode) return null;

          const x1 = fromNode.x;
          const y1 = fromNode.y + NODE_H / 2;
          const x2 = toNode.x;
          const y2 = toNode.y - NODE_H / 2;
          const midY = (y1 + y2) / 2;

          return (
            <path
              key={`edge-${i}`}
              d={`M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`}
              fill="none"
              stroke={edge.isPrereqEdge ? '#990f3d' : 'url(#edgeGrad)'}
              strokeWidth={edge.isPrereqEdge ? 2 : 1.8}
              strokeDasharray={edge.isPrereqEdge ? '4 3' : undefined}
            />
          );
        })}

        {/* Topic Nodes */}
        {NODES.map((node) => {
          const rectX = node.x - NODE_W / 2;
          const rectY = node.y - NODE_H / 2;

          if (node.isPrereq) {
            return (
              <Link key={node.id} href={`/topic/${node.id}`}>
                <g style={{ cursor: 'pointer' }}>
                  <rect
                    x={rectX}
                    y={rectY}
                    width={NODE_W}
                    height={NODE_H}
                    rx={22}
                    ry={22}
                    fill="#fff4e8"
                    stroke="#990f3d"
                    strokeWidth={1.8}
                    filter="url(#cardShadow)"
                    style={{ transition: 'all 0.2s ease' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.fill = '#990f3d';
                      const text = e.currentTarget.parentElement?.querySelector('text');
                      if (text) text.setAttribute('fill', '#ffffff');
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.fill = '#fff4e8';
                      const text = e.currentTarget.parentElement?.querySelector('text');
                      if (text) text.setAttribute('fill', '#990f3d');
                    }}
                  />
                  <text
                    x={node.x}
                    y={node.y + 1}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={12}
                    fontFamily="IBM Plex Sans, sans-serif"
                    fontWeight={700}
                    letterSpacing="0.03em"
                    fill="#990f3d"
                    style={{ cursor: 'pointer', userSelect: 'none', transition: 'fill 0.2s ease' }}
                  >
                    ✦ Prerequisites
                  </text>
                </g>
              </Link>
            );
          }

          return (
            <Link key={node.id} href={`/topic/${node.id}`}>
              <g style={{ cursor: 'pointer' }} className="node-group">
                <rect
                  x={rectX}
                  y={rectY}
                  width={NODE_W}
                  height={NODE_H}
                  rx={6}
                  ry={6}
                  fill="#fff9f4"
                  stroke="#d9cfc7"
                  strokeWidth={1.2}
                  filter="url(#cardShadow)"
                  style={{ transition: 'all 0.2s ease' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.stroke = '#990f3d';
                    e.currentTarget.style.strokeWidth = '1.8';
                    e.currentTarget.style.fill = '#ffffff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.stroke = '#d9cfc7';
                    e.currentTarget.style.strokeWidth = '1.2';
                    e.currentTarget.style.fill = '#fff9f4';
                  }}
                />
                <text
                  x={node.x}
                  y={node.y + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={12}
                  fontFamily="IBM Plex Sans, sans-serif"
                  fontWeight={600}
                  fill="#33302e"
                  style={{ cursor: 'pointer', userSelect: 'none' }}
                >
                  {node.label.length > 20 ? node.label.slice(0, 18) + '…' : node.label}
                </text>
              </g>
            </Link>
          );
        })}
      </svg>
    </div>
  );
}
