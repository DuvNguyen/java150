'use client';

import React from 'react';
import { SpringBootStatus } from '@/lib/springBootData';

export interface SpringGraphNode {
  id: string;
  label: string;
  moduleBadge: string;
  moduleId: string;
  x: number;
  y: number;
}

export interface SpringGraphEdge {
  from: string;
  to: string;
  label?: string;
}

const NODE_W = 160;
const NODE_H = 46;

export const SPRING_BOOT_NODES: SpringGraphNode[] = [
  // Level 0: Module 1 - Core Foundations
  { id: 'jy2heDVZuM6ASCXlI1TDn', label: 'Intro & Architecture', moduleBadge: 'M1', moduleId: 'module-1-core', x: 230, y: 45 },
  { id: 'PlUU_vzFQ3Xx6Z5XREIYP', label: 'Spring IoC Container', moduleBadge: 'M1', moduleId: 'module-1-core', x: 500, y: 45 },
  { id: 'C2EQ5J1aJYF9e9Rr2KysT', label: 'Dependency Injection', moduleBadge: 'M1', moduleId: 'module-1-core', x: 770, y: 45 },

  // Level 1: Module 1 - Core Mechanics & AOP
  { id: 'KdN62IpNgPFMndXfLaYa1', label: 'Bean Scope & Lifecycle', moduleBadge: 'M1', moduleId: 'module-1-core', x: 360, y: 140 },
  { id: 'wV1_I_4czMIxpBionvLs4', label: 'Spring AOP (Aspects)', moduleBadge: 'M1', moduleId: 'module-1-core', x: 640, y: 140 },

  // Level 2: Module 2 - Spring Boot Internals
  { id: 'JrH2hiu27PhIO1VtrArMa', label: 'Starters Ecosystem', moduleBadge: 'M2', moduleId: 'module-2-boot-internals', x: 260, y: 235 },
  { id: '88-h3d7kb-VmUBsnUUXW_', label: 'Autoconfiguration', moduleBadge: 'M2', moduleId: 'module-2-boot-internals', x: 500, y: 235 },
  { id: 'ONb0VnSUMY8JBeW3G2mTp', label: 'Embedded Server', moduleBadge: 'M2', moduleId: 'module-2-boot-internals', x: 740, y: 235 },

  // Level 3: Module 3 - Spring Web MVC & REST
  { id: 'S-BbOoRD7anvoJrprjoKF', label: 'MVC & Dispatcher', moduleBadge: 'M3', moduleId: 'module-3-web-mvc', x: 380, y: 330 },
  { id: '35NTx2eO1j02sjy4m6DPq', label: 'REST Controllers & DTO', moduleBadge: 'M3', moduleId: 'module-3-web-mvc', x: 620, y: 330 },

  // Level 4: Module 4 - Data Persistence & Transactions
  { id: 'h5-HnycxfbJgwalSdXTAz', label: 'Hibernate & ORM', moduleBadge: 'M4', moduleId: 'module-4-persistence', x: 260, y: 425 },
  { id: '6u08QN-pUeFm3o0h5Scfm', label: 'Spring Data JPA', moduleBadge: 'M4', moduleId: 'module-4-persistence', x: 500, y: 425 },
  { id: 'H9Z0EvKT_148vD0mR-dUf', label: 'Transactions (@Tx)', moduleBadge: 'M4', moduleId: 'module-4-persistence', x: 740, y: 425 },

  // Level 5: Module 5 - Security 6 & JWT
  { id: 'KaUdyVWEiZa6lUDRBlOKt', label: 'Spring Security 6', moduleBadge: 'M5', moduleId: 'module-5-security', x: 380, y: 520 },
  { id: '1My7mbdwAbRcJoiA50pWW', label: 'Stateless JWT Auth', moduleBadge: 'M5', moduleId: 'module-5-security', x: 620, y: 520 },

  // Level 6: Module 6 & Ops - Testing, Actuator, Cloud
  { id: '7Qqrh_Rz_7uAD49g9sDzi', label: 'Testing & MockMvc', moduleBadge: 'M6', moduleId: 'module-6-testing-microservices', x: 230, y: 615 },
  { id: 'N7hd3d_XQtvOgnCqdCFt3', label: 'Actuator & Metrics', moduleBadge: 'M2', moduleId: 'module-2-boot-internals', x: 500, y: 615 },
  { id: 'f-i0NX2KOzCh3JwkaSPFo', label: 'Cloud Gateway & Circuit', moduleBadge: 'M6', moduleId: 'module-6-testing-microservices', x: 770, y: 615 },
];

export const SPRING_BOOT_EDGES: SpringGraphEdge[] = [
  // Core connections
  { from: 'jy2heDVZuM6ASCXlI1TDn', to: 'PlUU_vzFQ3Xx6Z5XREIYP' },
  { from: 'PlUU_vzFQ3Xx6Z5XREIYP', to: 'C2EQ5J1aJYF9e9Rr2KysT' },
  { from: 'PlUU_vzFQ3Xx6Z5XREIYP', to: 'KdN62IpNgPFMndXfLaYa1' },
  { from: 'C2EQ5J1aJYF9e9Rr2KysT', to: 'wV1_I_4czMIxpBionvLs4' },

  // Core to Internals
  { from: 'KdN62IpNgPFMndXfLaYa1', to: 'JrH2hiu27PhIO1VtrArMa' },
  { from: 'wV1_I_4czMIxpBionvLs4', to: '88-h3d7kb-VmUBsnUUXW_' },
  { from: '88-h3d7kb-VmUBsnUUXW_', to: 'ONb0VnSUMY8JBeW3G2mTp' },

  // Internals to Web MVC
  { from: 'ONb0VnSUMY8JBeW3G2mTp', to: 'S-BbOoRD7anvoJrprjoKF' },
  { from: 'S-BbOoRD7anvoJrprjoKF', to: '35NTx2eO1j02sjy4m6DPq' },

  // Web MVC to Data Persistence
  { from: '35NTx2eO1j02sjy4m6DPq', to: 'h5-HnycxfbJgwalSdXTAz' },
  { from: 'h5-HnycxfbJgwalSdXTAz', to: '6u08QN-pUeFm3o0h5Scfm' },
  { from: '6u08QN-pUeFm3o0h5Scfm', to: 'H9Z0EvKT_148vD0mR-dUf' },

  // Data to Security
  { from: '35NTx2eO1j02sjy4m6DPq', to: 'KaUdyVWEiZa6lUDRBlOKt' },
  { from: 'KaUdyVWEiZa6lUDRBlOKt', to: '1My7mbdwAbRcJoiA50pWW' },

  // Towards Testing, Ops & Cloud
  { from: '1My7mbdwAbRcJoiA50pWW', to: '7Qqrh_Rz_7uAD49g9sDzi' },
  { from: 'H9Z0EvKT_148vD0mR-dUf', to: 'N7hd3d_XQtvOgnCqdCFt3' },
  { from: 'KaUdyVWEiZa6lUDRBlOKt', to: 'f-i0NX2KOzCh3JwkaSPFo' },
];

interface Props {
  selectedTopicId: string;
  statusMap: Record<string, SpringBootStatus>;
  onSelectTopic: (topicId: string, moduleId: string) => void;
}

export default function SpringBootGraph({
  selectedTopicId,
  statusMap,
  onSelectTopic,
}: Props) {
  const nodeMap = React.useMemo(() => {
    const map = new Map<string, SpringGraphNode>();
    SPRING_BOOT_NODES.forEach((n) => map.set(n.id, n));
    return map;
  }, []);

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
        viewBox="0 0 1000 680"
        style={{ width: '100%', maxWidth: '1000px', height: 'auto', display: 'block', margin: '0 auto' }}
      >
        <defs>
          <filter id="springCardShadow" x="-10%" y="-10%" width="120%" height="130%">
            <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#33302e" floodOpacity="0.05" />
          </filter>

          <marker
            id="springArrow"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#807973" />
          </marker>
        </defs>

        {/* Edges */}
        {SPRING_BOOT_EDGES.map((edge, i) => {
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
              stroke={isConnectedToSelected ? '#990f3d' : '#d9cfc7'}
              strokeWidth={isConnectedToSelected ? 2.2 : 1.4}
              markerEnd="url(#springArrow)"
            />
          );
        })}

        {/* Nodes */}
        {SPRING_BOOT_NODES.map((node) => {
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
                  x={rectX - 2}
                  y={rectY - 2}
                  width={NODE_W + 4}
                  height={NODE_H + 4}
                  rx={3}
                  ry={3}
                  fill="none"
                  stroke="#990f3d"
                  strokeWidth={1.2}
                  strokeOpacity={0.3}
                />
              )}

              {/* Node Card */}
              <rect
                x={rectX}
                y={rectY}
                width={NODE_W}
                height={NODE_H}
                rx={2}
                ry={2}
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth={isSelected ? 1.8 : 1}
                filter="url(#springCardShadow)"
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
                fill={isDone ? '#10b981' : isInProgress ? '#f59e0b' : '#d1d5db'}
              />

              {/* Node Title */}
              <text
                x={rectX + NODE_W / 2}
                y={rectY + 29}
                textAnchor="middle"
                fontSize={11}
                fontFamily="IBM Plex Sans, sans-serif"
                fontWeight={isSelected ? 700 : 500}
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
