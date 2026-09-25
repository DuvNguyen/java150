'use client';

import React from 'react';
import { SystemDesignStatus } from '@/lib/systemDesignData';

export interface SystemGraphNode {
  id: string;
  label: string;
  moduleBadge: string;
  moduleId: string;
  x: number;
  y: number;
}

export interface SystemGraphEdge {
  from: string;
  to: string;
  label?: string;
}

const NODE_W = 160;
const NODE_H = 46;

// 14 Topics Nodes Layout DAG
export const SYSTEM_NODES: SystemGraphNode[] = [
  // Level 0: Foundations
  { id: 'network-protocols', label: 'Network & Protocols', moduleBadge: 'M1', moduleId: 'foundation', x: 380, y: 50 },
  { id: 'architecture-patterns', label: 'Architecture & Scaling', moduleBadge: 'M1', moduleId: 'foundation', x: 620, y: 50 },

  // Level 1: Traffic Management & DB Basics
  { id: 'load-balancing-api-gateway', label: 'Load Balancer & Gateway', moduleBadge: 'M1', moduleId: 'foundation', x: 380, y: 150 },
  { id: 'sql-vs-nosql', label: 'SQL vs NoSQL', moduleBadge: 'M2', moduleId: 'data-storage', x: 620, y: 150 },

  // Level 2: Data Guarantees & Messaging
  { id: 'acid-cap-pacelc', label: 'ACID, CAP & PACELC', moduleBadge: 'M2', moduleId: 'data-storage', x: 500, y: 250 },
  { id: 'message-queues-kafka', label: 'Message Queues & Kafka', moduleBadge: 'M3', moduleId: 'distributed-systems', x: 260, y: 250 },

  // Level 3: Advanced DB Scaling & Distributed Transactions
  { id: 'database-scaling', label: 'Replication & Sharding', moduleBadge: 'M2', moduleId: 'data-storage', x: 620, y: 350 },
  { id: 'distributed-transactions-saga', label: 'Distributed Tx & Saga', moduleBadge: 'M3', moduleId: 'distributed-systems', x: 380, y: 350 },

  // Level 4: Caching & Resilience
  { id: 'caching-strategies', label: 'Caching Strategies', moduleBadge: 'M2', moduleId: 'data-storage', x: 620, y: 450 },
  { id: 'rate-limiting-resilience', label: 'Rate Limiting & Resilience', moduleBadge: 'M3', moduleId: 'distributed-systems', x: 380, y: 450 },

  // Level 5: Interview Framework (Hub)
  { id: 'interview-framework', label: 'Interview 4-Step Framework', moduleBadge: 'M4', moduleId: 'case-studies', x: 500, y: 550 },

  // Level 6: Real-World Case Studies
  { id: 'case-url-shortener', label: 'Case 1: URL Shortener', moduleBadge: 'M4', moduleId: 'case-studies', x: 230, y: 660 },
  { id: 'case-news-feed', label: 'Case 2: News Feed System', moduleBadge: 'M4', moduleId: 'case-studies', x: 500, y: 660 },
  { id: 'case-chat-app', label: 'Case 3: Real-Time Chat', moduleBadge: 'M4', moduleId: 'case-studies', x: 770, y: 660 },
];

export const SYSTEM_EDGES: SystemGraphEdge[] = [
  // Foundations to Gateways & Storage
  { from: 'network-protocols', to: 'load-balancing-api-gateway' },
  { from: 'architecture-patterns', to: 'load-balancing-api-gateway' },
  { from: 'architecture-patterns', to: 'sql-vs-nosql' },

  // Traffic to Messaging & DB Theory
  { from: 'load-balancing-api-gateway', to: 'message-queues-kafka' },
  { from: 'sql-vs-nosql', to: 'acid-cap-pacelc' },

  // DB Theory to Scaling & Distributed Tx
  { from: 'acid-cap-pacelc', to: 'database-scaling' },
  { from: 'message-queues-kafka', to: 'distributed-transactions-saga' },
  { from: 'acid-cap-pacelc', to: 'distributed-transactions-saga' },

  // Advanced to Caching & Resilience
  { from: 'database-scaling', to: 'caching-strategies' },
  { from: 'distributed-transactions-saga', to: 'rate-limiting-resilience' },

  // Towards Interview Framework
  { from: 'caching-strategies', to: 'interview-framework' },
  { from: 'rate-limiting-resilience', to: 'interview-framework' },

  // Framework to Case Studies
  { from: 'interview-framework', to: 'case-url-shortener' },
  { from: 'interview-framework', to: 'case-news-feed' },
  { from: 'interview-framework', to: 'case-chat-app' },
];

interface Props {
  selectedTopicId: string;
  statusMap: Record<string, SystemDesignStatus>;
  onSelectTopic: (topicId: string, moduleId: string) => void;
}

export default function SystemDesignGraph({
  selectedTopicId,
  statusMap,
  onSelectTopic,
}: Props) {
  const nodeMap = new Map<string, SystemGraphNode>();
  SYSTEM_NODES.forEach((n) => nodeMap.set(n.id, n));

  return (
    <div
      style={{
        width: '100%',
        overflowX: 'auto',
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--rounded-lg)',
        padding: '16px 12px',
        marginBottom: '20px',
      }}
    >
      <svg
        viewBox="0 0 1000 730"
        style={{ width: '100%', maxWidth: '1000px', height: 'auto', display: 'block', margin: '0 auto' }}
      >
        <defs>
          <filter id="sdCardShadow" x="-10%" y="-10%" width="120%" height="130%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#2a2521" floodOpacity="0.06" />
          </filter>

          <linearGradient id="sdEdgeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#d9cfc7" />
            <stop offset="100%" stopColor="#b8aba0" />
          </linearGradient>

          <linearGradient id="sdEdgeGradActive" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#990f3d" />
            <stop offset="100%" stopColor="#c2410c" />
          </linearGradient>

          <marker
            id="sdArrow"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#b8aba0" />
          </marker>
        </defs>

        {/* Edges */}
        {SYSTEM_EDGES.map((edge, i) => {
          const fromNode = nodeMap.get(edge.from);
          const toNode = nodeMap.get(edge.to);
          if (!fromNode || !toNode) return null;

          const x1 = fromNode.x;
          const y1 = fromNode.y + NODE_H / 2;
          const x2 = toNode.x;
          const y2 = toNode.y - NODE_H / 2;
          const midY = (y1 + y2) / 2;

          const isConnectedToSelected =
            edge.from === selectedTopicId || edge.to === selectedTopicId;

          return (
            <path
              key={`edge-${i}`}
              d={`M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`}
              fill="none"
              stroke={isConnectedToSelected ? 'url(#sdEdgeGradActive)' : 'url(#sdEdgeGrad)'}
              strokeWidth={isConnectedToSelected ? 2.4 : 1.6}
              markerEnd="url(#sdArrow)"
            />
          );
        })}

        {/* Nodes */}
        {SYSTEM_NODES.map((node) => {
          const rectX = node.x - NODE_W / 2;
          const rectY = node.y - NODE_H / 2;
          const isSelected = node.id === selectedTopicId;
          const st = statusMap[node.id] || 'not-started';

          const isDone = st === 'done';
          const isInProgress = st === 'in-progress';

          let strokeColor = '#d9cfc7';
          let fillColor = '#fff9f4';
          let textColor = '#33302e';

          if (isSelected) {
            strokeColor = '#990f3d';
            fillColor = '#fff4e8';
            textColor = '#990f3d';
          } else if (isDone) {
            strokeColor = '#a7f3d0';
            fillColor = '#f0fdf4';
            textColor = '#065f46';
          } else if (isInProgress) {
            strokeColor = '#fde68a';
            fillColor = '#fffbeb';
            textColor = '#92400e';
          }

          return (
            <g
              key={node.id}
              onClick={() => onSelectTopic(node.id, node.moduleId)}
              style={{ cursor: 'pointer' }}
            >
              {/* Outer Glow for Selected */}
              {isSelected && (
                <rect
                  x={rectX - 3}
                  y={rectY - 3}
                  width={NODE_W + 6}
                  height={NODE_H + 6}
                  rx={8}
                  ry={8}
                  fill="none"
                  stroke="#990f3d"
                  strokeWidth={1.5}
                  strokeOpacity={0.3}
                />
              )}

              {/* Node Card */}
              <rect
                x={rectX}
                y={rectY}
                width={NODE_W}
                height={NODE_H}
                rx={6}
                ry={6}
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth={isSelected ? 2 : 1.2}
                filter="url(#sdCardShadow)"
                style={{ transition: 'all 0.15s ease' }}
              />

              {/* Module Badge Top-left */}
              <text
                x={rectX + 8}
                y={rectY + 12}
                fontSize={9}
                fontFamily="IBM Plex Sans, sans-serif"
                fontWeight={700}
                fill={isSelected ? '#990f3d' : '#807973'}
                style={{ userSelect: 'none' }}
              >
                {node.moduleBadge}
              </text>

              {/* Status Indicator Top-right */}
              <circle
                cx={rectX + NODE_W - 10}
                cy={rectY + 10}
                r={3.5}
                fill={isDone ? '#059669' : isInProgress ? '#d97706' : '#d1d5db'}
              />

              {/* Main Topic Label */}
              <text
                x={node.x}
                y={node.y + 6}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={11}
                fontFamily="IBM Plex Sans, sans-serif"
                fontWeight={isSelected || isDone ? 700 : 600}
                fill={textColor}
                style={{ userSelect: 'none' }}
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
