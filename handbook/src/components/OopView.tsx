'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { OOP_PILLARS, OopPillar, OopStatus, getOopStatusKey } from '@/lib/oopData';
import CodeBlock from '@/components/CodeBlock';

// ============================================================
// OOP View — Track học 4 tính chất OOP trong Java
// Tuân thủ design system: không dùng emoji, dùng CSS variables
// ============================================================

const STATUS_LABELS: Record<OopStatus, string> = {
  'not-started': 'Chưa học',
  'in-progress':  'Đang học',
  'done':         'Đã nắm',
};

const STATUS_NEXT: Record<OopStatus, OopStatus> = {
  'not-started': 'in-progress',
  'in-progress':  'done',
  'done':         'not-started',
};

// ---- Progress Bar ----
function ProgressBar({ value, total }: { value: number; total: number }) {
  const pct = total === 0 ? 0 : Math.round((value / total) * 100);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div
        style={{
          flex: 1,
          height: '4px',
          borderRadius: '2px',
          backgroundColor: 'var(--color-border)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            backgroundColor: 'var(--color-tertiary)',
            transition: 'width 0.35s ease',
          }}
        />
      </div>
      <span
        style={{
          fontSize: '0.78rem',
          fontFamily: 'var(--font-label)',
          fontWeight: 600,
          color: 'var(--color-secondary)',
          minWidth: '70px',
          textAlign: 'right',
        }}
      >
        {value}/{total} hoàn thành
      </span>
    </div>
  );
}

// ---- Status Badge ----
// Dùng className pattern giống .tab-count-badge trong system
function StatusBadge({
  status,
  onClick,
}: {
  status: OopStatus;
  onClick?: () => void;
}) {
  const styleMap: Record<OopStatus, React.CSSProperties> = {
    'not-started': {
      background: 'var(--color-border-light)',
      color: 'var(--color-secondary)',
      border: '1px solid var(--color-border)',
    },
    'in-progress': {
      background: '#fff4e8',
      color: 'var(--color-tertiary)',
      border: '1px solid var(--color-border)',
    },
    'done': {
      background: '#f0fdf4',
      color: '#166534',
      border: '1px solid #bbf7d0',
    },
  };

  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 10px',
        borderRadius: '12px',
        fontFamily: 'var(--font-label)',
        fontSize: '0.72rem',
        fontWeight: 700,
        cursor: onClick ? 'pointer' : 'default',
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        transition: 'opacity 0.15s',
        whiteSpace: 'nowrap',
        ...styleMap[status],
      }}
      title={onClick ? 'Bấm để chuyển trạng thái' : undefined}
    >
      {STATUS_LABELS[status]}
    </button>
  );
}

// ---- Section Label — dùng pattern .form-field label ----
function SectionLabel({ children, danger }: { children: React.ReactNode; danger?: boolean }) {
  return (
    <div
      style={{
        fontFamily: 'var(--font-label)',
        fontSize: '0.72rem',
        fontWeight: 600,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: danger ? '#b91c1c' : 'var(--color-secondary)',
        marginBottom: '10px',
      }}
    >
      {children}
    </div>
  );
}


// ---- Keyword Row — dùng pattern table-like giống fn-table ----
function KeywordRow({ keyword, description }: { keyword: string; description: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: '12px',
        padding: '8px 12px',
        borderBottom: '1px solid var(--color-border-light)',
        backgroundColor: 'var(--color-surface)',
      }}
    >
      <code
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.83rem',
          color: 'var(--color-primary)',
          backgroundColor: '#ede8e3',
          padding: '1px 6px',
          borderRadius: 'var(--rounded-md)',
          minWidth: '170px',
          flexShrink: 0,
          display: 'inline-block',
        }}
      >
        {keyword}
      </code>
      <span
        style={{
          fontSize: '0.88rem',
          color: 'var(--color-secondary)',
          fontFamily: 'var(--font-body)',
        }}
      >
        {description}
      </span>
    </div>
  );
}

// ---- Pillar Detail Panel ----
function PillarDetailPanel({
  pillar,
  status,
  onStatusChange,
}: {
  pillar: OopPillar;
  status: OopStatus;
  onStatusChange: (status: OopStatus) => void;
}) {
  return (
    <div
      style={{
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--rounded-lg)',
        backgroundColor: 'var(--color-surface)',
        overflow: 'hidden',
      }}
    >
      {/* Header — giống .note-modal-header */}
      <div
        style={{
          padding: '16px 20px',
          backgroundColor: '#fff4e8',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '16px',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            {/* Số thứ tự — plain text label, không dùng colored circle */}
            <span
              style={{
                fontFamily: 'var(--font-label)',
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--color-tertiary)',
              }}
            >
              Tính chất {pillar.order}/4
            </span>
          </div>
          <h2
            style={{
              margin: 0,
              fontSize: '1.25rem',
              fontFamily: 'var(--font-display)',
              color: 'var(--color-primary)',
            }}
          >
            {pillar.name}
            <span
              style={{
                fontSize: '0.85rem',
                fontFamily: 'var(--font-label)',
                fontWeight: 400,
                color: 'var(--color-secondary)',
                marginLeft: '8px',
              }}
            >
              ({pillar.nameEn})
            </span>
          </h2>
          <p
            style={{
              margin: '4px 0 0',
              fontSize: '0.9rem',
              color: 'var(--color-secondary)',
              fontFamily: 'var(--font-body)',
              fontStyle: 'italic',
            }}
          >
            {pillar.tagline}
          </p>
        </div>
        <StatusBadge status={status} onClick={() => onStatusChange(STATUS_NEXT[status])} />
      </div>

      {/* Body */}
      <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* Description */}
        <div
          style={{
            padding: '14px 16px',
            backgroundColor: 'var(--color-neutral)',
            border: '1px solid var(--color-border-light)',
            borderRadius: 'var(--rounded-md)',
            lineHeight: '1.75',
          }}
        >
          {pillar.description.split('\n\n').map((para, i) => (
            <p
              key={i}
              style={{
                margin: i === 0 ? 0 : '10px 0 0',
                fontSize: '0.92rem',
                color: 'var(--color-primary)',
                fontFamily: 'var(--font-body)',
              }}
              dangerouslySetInnerHTML={{
                __html: para
                  .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                  .replace(
                    /`(.+?)`/g,
                    '<code style="background:#ede8e3;padding:1px 5px;border-radius:2px;font-family:var(--font-mono);font-size:0.84em">$1</code>',
                  ),
              }}
            />
          ))}
        </div>

        {/* Keywords */}
        <section>
          <SectionLabel>Từ khóa quan trọng</SectionLabel>
          <div
            style={{
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--rounded-lg)',
              overflow: 'hidden',
            }}
          >
            {pillar.keywords.map((kw, i) => (
              <div
                key={kw.keyword}
                style={{ borderTop: i === 0 ? 'none' : '1px solid var(--color-border-light)' }}
              >
                <KeywordRow keyword={kw.keyword} description={kw.description} />
              </div>
            ))}
          </div>
        </section>

        {/* Code Examples */}
        <section>
          <SectionLabel>Ví dụ Code</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {pillar.codeExamples.map((ex, i) => (
              <div key={i}>
                <p
                  style={{
                    fontFamily: 'var(--font-label)',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    color: 'var(--color-primary)',
                    marginBottom: '8px',
                  }}
                >
                  {ex.title}
                </p>
                <CodeBlock code={ex.code} filename="Example.java" />
                {/* Explanation — giống blockquote trong rich-editor */}
                <div
                  style={{
                    marginTop: '8px',
                    padding: '8px 12px',
                    borderLeft: '3px solid var(--color-tertiary)',
                    backgroundColor: '#fff9f4',
                    fontSize: '0.85rem',
                    color: 'var(--color-secondary)',
                    fontStyle: 'italic',
                    lineHeight: '1.65',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  {ex.explanation}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Exercises */}
        <section>
          <SectionLabel>Bài tập thực hành</SectionLabel>
          <ol
            style={{
              paddingLeft: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              margin: 0,
            }}
          >
            {pillar.exercises.map((ex, i) => (
              <li
                key={i}
                style={{
                  fontSize: '0.9rem',
                  lineHeight: '1.65',
                  color: 'var(--color-primary)',
                  fontFamily: 'var(--font-body)',
                }}
              >
                {ex}
              </li>
            ))}
          </ol>
        </section>

        {/* Common Mistakes */}
        <section>
          <SectionLabel danger>Lỗi thường gặp</SectionLabel>
          <ul
            style={{
              paddingLeft: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              margin: 0,
            }}
          >
            {pillar.commonMistakes.map((m, i) => (
              <li
                key={i}
                style={{
                  fontSize: '0.88rem',
                  color: '#7f1d1d',
                  lineHeight: '1.65',
                  fontFamily: 'var(--font-body)',
                }}
              >
                {m}
              </li>
            ))}
          </ul>
        </section>

        {/* Actions */}
        <div
          style={{
            paddingTop: '16px',
            borderTop: '1px solid var(--color-border-light)',
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
          }}
        >
          {status !== 'done' && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => onStatusChange('done')}
            >
              Đánh dấu đã nắm
            </button>
          )}
          {status === 'not-started' && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => onStatusChange('in-progress')}
            >
              Bắt đầu học
            </button>
          )}
          {status === 'done' && (
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => onStatusChange('not-started')}
            >
              Đặt lại trạng thái
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ---- Pillar List Item — dùng pattern giống topic-tab-item ----
function PillarListItem({
  pillar,
  status,
  isSelected,
  isLocked,
  onClick,
}: {
  pillar: OopPillar;
  status: OopStatus;
  isSelected: boolean;
  isLocked: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={isLocked ? undefined : onClick}
      disabled={isLocked}
      style={{
        width: '100%',
        textAlign: 'left',
        padding: '12px 14px',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--rounded-lg)',
        backgroundColor: isSelected ? '#fff4e8' : 'var(--color-surface)',
        borderColor: isSelected ? 'var(--color-tertiary)' : 'var(--color-border)',
        cursor: isLocked ? 'not-allowed' : 'pointer',
        opacity: isLocked ? 0.45 : 1,
        transition: 'all 0.15s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}
    >
      {/* Số thứ tự — plain, không dùng màu custom */}
      <span
        style={{
          fontFamily: 'var(--font-label)',
          fontSize: '0.72rem',
          fontWeight: 700,
          color: isSelected ? 'var(--color-tertiary)' : 'var(--color-secondary)',
          minWidth: '16px',
          flexShrink: 0,
        }}
      >
        {pillar.order}.
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: 'var(--font-label)',
            fontSize: '0.88rem',
            fontWeight: 600,
            color: isSelected ? 'var(--color-tertiary)' : 'var(--color-primary)',
            marginBottom: '2px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {pillar.name}
          {isLocked && (
            <span
              style={{
                marginLeft: '6px',
                fontSize: '0.68rem',
                fontWeight: 600,
                color: 'var(--color-secondary)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              — Khóa
            </span>
          )}
        </div>
        <div
          style={{
            fontFamily: 'var(--font-label)',
            fontSize: '0.72rem',
            color: 'var(--color-secondary)',
          }}
        >
          {pillar.nameEn}
        </div>
      </div>
      <StatusBadge status={status} />
    </button>
  );
}

// ---- Main OopView ----
export default function OopView() {
  const [statuses, setStatuses] = useState<Record<string, OopStatus>>({});
  const [selectedId, setSelectedId] = useState<string>(OOP_PILLARS[0].id);

  // Load từ localStorage
  useEffect(() => {
    const loaded: Record<string, OopStatus> = {};
    for (const p of OOP_PILLARS) {
      const saved = localStorage.getItem(getOopStatusKey(p.id)) as OopStatus | null;
      loaded[p.id] = saved || 'not-started';
    }
    setStatuses(loaded);
  }, []);

  const handleStatusChange = useCallback((pillarId: string, newStatus: OopStatus) => {
    setStatuses((prev) => {
      const updated = { ...prev, [pillarId]: newStatus };
      try {
        localStorage.setItem(getOopStatusKey(pillarId), newStatus);
      } catch {
        // ignore
      }
      return updated;
    });
  }, []);

  const doneCount = OOP_PILLARS.filter((p) => statuses[p.id] === 'done').length;
  const inProgressCount = OOP_PILLARS.filter((p) => statuses[p.id] === 'in-progress').length;

  const selectedPillar = OOP_PILLARS.find((p) => p.id === selectedId) ?? OOP_PILLARS[0];

  const isLocked = useCallback(
    (pillar: OopPillar): boolean => {
      if (!pillar.prerequisite) return false;
      return statuses[pillar.prerequisite] !== 'done';
    },
    [statuses],
  );

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <h2
          style={{
            fontSize: '1.4rem',
            fontFamily: 'var(--font-display)',
            marginBottom: '4px',
          }}
        >
          Java OOP — 4 Tính Chất Nền Tảng
        </h2>
        <p
          style={{
            color: 'var(--color-secondary)',
            fontSize: '0.92rem',
            marginBottom: '14px',
            fontFamily: 'var(--font-body)',
          }}
        >
          Học theo thứ tự từ 1 đến 4. Hoàn thành mỗi tính chất để mở khóa tính chất tiếp theo.
        </p>
        <ProgressBar value={doneCount} total={OOP_PILLARS.length} />
      </div>

      {/* Layout: Sidebar + Detail */}
      <div className="track-layout-grid oop-layout-grid">
        {/* Sidebar */}
        <div className="track-layout-sidebar oop-sidebar">
          {OOP_PILLARS.map((pillar) => (
            <PillarListItem
              key={pillar.id}
              pillar={pillar}
              status={statuses[pillar.id] || 'not-started'}
              isSelected={pillar.id === selectedId}
              isLocked={isLocked(pillar)}
              onClick={() => setSelectedId(pillar.id)}
            />
          ))}

          {/* Stats — giống .entry-count pattern */}
          <div
            style={{
              marginTop: '6px',
              padding: '10px 14px',
              border: '1px solid var(--color-border-light)',
              borderRadius: 'var(--rounded-lg)',
              fontFamily: 'var(--font-label)',
              fontSize: '0.75rem',
              color: 'var(--color-secondary)',
              lineHeight: '1.8',
              letterSpacing: '0.02em',
            }}
          >
            <div>{doneCount} / {OOP_PILLARS.length} đã hoàn thành</div>
            {inProgressCount > 0 && <div>{inProgressCount} đang học</div>}
            <div>{OOP_PILLARS.length - doneCount - inProgressCount} chưa bắt đầu</div>
          </div>
        </div>

        {/* Detail Panel */}
        <PillarDetailPanel
          pillar={selectedPillar}
          status={statuses[selectedPillar.id] || 'not-started'}
          onStatusChange={(s) => handleStatusChange(selectedPillar.id, s)}
        />
      </div>
    </div>
  );
}
