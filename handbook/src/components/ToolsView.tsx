'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  TOOLS_GUIDES,
  DETAILED_TOOL_CITATIONS,
  ToolGuide,
  ToolStatus,
  DetailedToolCitation,
  getToolStatusKey,
  getToolNoteKey,
} from '@/lib/toolsData';
import CodeBlock from '@/components/CodeBlock';

export default function ToolsView() {
  const [selectedId, setSelectedId] = useState<string>(TOOLS_GUIDES[0].id);
  const [statusMap, setStatusMap] = useState<Record<string, ToolStatus>>({});
  const [noteMap, setNoteMap] = useState<Record<string, string>>({});
  const [openQaIndex, setOpenQaIndex] = useState<number | null>(null);
  const [saveNoteSuccess, setSaveNoteSuccess] = useState<boolean>(false);
  const [citationFilter, setCitationFilter] = useState<string>('all');

  // Load status and notes
  useEffect(() => {
    const loadedStatus: Record<string, ToolStatus> = {};
    const loadedNotes: Record<string, string> = {};

    TOOLS_GUIDES.forEach((guide) => {
      try {
        const s = localStorage.getItem(getToolStatusKey(guide.id)) as ToolStatus | null;
        loadedStatus[guide.id] = s || 'not-started';
        const n = localStorage.getItem(getToolNoteKey(guide.id));
        if (n) loadedNotes[guide.id] = n;
      } catch {
        loadedStatus[guide.id] = 'not-started';
      }
    });

    setStatusMap(loadedStatus);
    setNoteMap(loadedNotes);
  }, []);

  const handleStatusChange = useCallback((guideId: string, nextStatus: ToolStatus) => {
    setStatusMap((prev) => {
      try {
        localStorage.setItem(getToolStatusKey(guideId), nextStatus);
      } catch {
        // ignore
      }
      return { ...prev, [guideId]: nextStatus };
    });
  }, []);

  const handleNoteChange = (guideId: string, val: string) => {
    setNoteMap((prev) => ({ ...prev, [guideId]: val }));
    try {
      localStorage.setItem(getToolNoteKey(guideId), val);
      setSaveNoteSuccess(true);
      setTimeout(() => setSaveNoteSuccess(false), 2000);
    } catch {
      // ignore
    }
  };

  const selectedGuide = TOOLS_GUIDES.find((g) => g.id === selectedId) ?? TOOLS_GUIDES[0];
  const doneCount = Object.values(statusMap).filter((s) => s === 'done').length;

  // Reset QA accordion when switching guide
  useEffect(() => {
    setOpenQaIndex(null);
  }, [selectedId]);

  return (
    <div>
      {/* Header — Đồng bộ System Design & Financial Times */}
      <div style={{ marginBottom: '20px' }}>
        <h2
          style={{
            fontSize: '1.45rem',
            fontFamily: 'var(--font-display)',
            marginBottom: '4px',
            color: 'var(--color-primary)',
          }}
        >
          Công Cụ (Git & Docker) & Dự Án Portfolio Backend
        </h2>
        <p
          style={{
            color: 'var(--color-secondary)',
            fontSize: '0.92rem',
            marginBottom: '14px',
            fontFamily: 'var(--font-body)',
          }}
        >
          Lộ trình từ nền tảng Fundamentals, phương pháp học, thao tác Git & Docker thực chiến đến bộ tiêu chuẩn 6 trụ cột của một repository backend hoàn chỉnh.
        </p>

        {/* Progress bar & Stats */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', maxWidth: '420px' }}>
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
                width: `${Math.round((doneCount / TOOLS_GUIDES.length) * 100)}%`,
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
              minWidth: '85px',
              textAlign: 'right',
            }}
          >
            {doneCount}/{TOOLS_GUIDES.length} hoàn thành
          </span>
        </div>
      </div>

      {/* Main Grid: Sidebar Mục lục bên trái + Panel chi tiết bên phải */}
      <div className="track-layout-grid system-design-layout-grid">
        {/* LEFT SIDEBAR: Mục lục hướng dẫn */}
        <div
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: '12px',
            padding: '16px',
            position: 'sticky',
            top: '20px',
            maxHeight: 'calc(100vh - 40px)',
            overflowY: 'auto',
          }}
        >
          <h3
            style={{
              fontSize: '0.92rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              color: 'var(--color-secondary)',
              margin: '0 0 12px 4px',
              fontFamily: 'var(--font-label)',
            }}
          >
            Mục lục Chuyên đề
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {TOOLS_GUIDES.map((guide) => {
              const isGuideActive = guide.id === selectedId;
              const status = statusMap[guide.id] || 'not-started';

              return (
                <div
                  key={guide.id}
                  onClick={() => {
                    setSelectedId(guide.id);
                    setOpenQaIndex(null);
                  }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    backgroundColor: isGuideActive ? 'rgba(153, 15, 61, 0.08)' : 'transparent',
                    border: isGuideActive ? '1px solid rgba(153, 15, 61, 0.2)' : '1px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        color: isGuideActive ? '#990f3d' : 'var(--color-secondary)',
                        textTransform: 'uppercase',
                        fontFamily: 'var(--font-label)',
                      }}
                    >
                      {guide.category} • #{guide.order}
                    </span>
                    <span
                      style={{
                        fontSize: '0.74rem',
                        fontWeight: 600,
                        color: status === 'done' ? '#059669' : status === 'in-progress' ? 'var(--color-tertiary)' : 'var(--color-secondary)',
                        fontFamily: 'var(--font-label)',
                      }}
                    >
                      {status === 'done' ? 'Đã nắm' : status === 'in-progress' ? 'Đang làm' : 'Chưa học'}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: '0.88rem',
                      fontWeight: isGuideActive ? 700 : 600,
                      color: isGuideActive ? '#990f3d' : 'var(--color-primary)',
                      lineHeight: '1.35',
                    }}
                  >
                    {guide.title}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT DETAIL PANEL */}
        <div
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: '12px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '22px',
          }}
        >
          {/* Header + Status Combobox */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <span
                style={{
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  color: 'var(--color-tertiary)',
                  textTransform: 'uppercase',
                  fontFamily: 'var(--font-label)',
                  letterSpacing: '0.06em',
                }}
              >
                {selectedGuide.category} • Chuyên Đề #{selectedGuide.order}
              </span>
              <h3
                style={{
                  fontSize: '1.4rem',
                  fontFamily: 'var(--font-display)',
                  margin: '4px 0 2px',
                  color: 'var(--color-primary)',
                }}
              >
                {selectedGuide.title}
              </h3>
              <p style={{ color: 'var(--color-secondary)', fontSize: '0.92rem', fontStyle: 'italic', margin: 0, fontFamily: 'var(--font-body)' }}>
                {selectedGuide.summary}
              </p>
            </div>

            {/* Status Combobox */}
            <div className="status-combobox-wrapper">
              <label htmlFor={`tool-status-${selectedGuide.id}`} className="status-combobox-label">
                Trạng thái:
              </label>
              <select
                id={`tool-status-${selectedGuide.id}`}
                className="status-combobox"
                value={statusMap[selectedGuide.id] || 'not-started'}
                onChange={(e) => handleStatusChange(selectedGuide.id, e.target.value as ToolStatus)}
              >
                <option value="not-started">Chưa học</option>
                <option value="in-progress">Đang làm</option>
                <option value="done">Đã nắm vững</option>
              </select>
            </div>
          </div>

          {/* Authoritative Citation Banner */}
          <div
            style={{
              padding: '14px 16px',
              backgroundColor: '#fffdfa',
              border: '1px solid var(--color-border)',
              borderLeft: '4px solid var(--color-tertiary)',
              borderRadius: 'var(--rounded-md, 2px)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: 'var(--color-tertiary)',
                  textTransform: 'uppercase',
                  fontFamily: 'var(--font-label)',
                  letterSpacing: '0.08em',
                }}
              >
                Nguồn chính thống (Authoritative Citation)
              </span>
              {selectedGuide.citation.url && (
                <a
                  href={selectedGuide.citation.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: '0.76rem', color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'underline' }}
                >
                  Tài liệu gốc ↗
                </a>
              )}
            </div>
            <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--color-primary)', fontFamily: 'var(--font-display)' }}>
              {selectedGuide.citation.source} — {selectedGuide.citation.author}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-primary)', fontStyle: 'italic', marginTop: '4px', lineHeight: '1.5' }}>
              "{selectedGuide.citation.keyTakeaway}"
            </div>
          </div>

          {/* Steps & Hands-on Code Blocks */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            {selectedGuide.steps.map((step, idx) => (
              <div key={idx}>
                <h4
                  style={{
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    color: 'var(--color-primary)',
                    marginBottom: '8px',
                    fontFamily: 'var(--font-display)',
                  }}
                >
                  {step.heading}
                </h4>
                <p
                  style={{
                    fontSize: '0.9rem',
                    color: 'var(--color-secondary)',
                    margin: '0 0 10px 0',
                    lineHeight: '1.6',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  {step.description}
                </p>
                {step.codeOrSnippet && (
                  <CodeBlock code={step.codeOrSnippet} filename={step.filename || 'code'} />
                )}
              </div>
            ))}
          </div>

          {/* Interview Tips Accordion */}
          {selectedGuide.interviewTips.length > 0 && (
            <div style={{ borderTop: '1px solid var(--color-border-light)', paddingTop: '20px' }}>
              <h4
                style={{
                  fontSize: '1.1rem',
                  fontFamily: 'var(--font-display)',
                  color: 'var(--color-primary)',
                  marginBottom: '12px',
                }}
              >
                Trọng Tâm Phỏng Vấn
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {selectedGuide.interviewTips.map((tip, qIdx) => {
                  const isOpen = openQaIndex === qIdx;
                  const parts = tip.split('->');
                  const question = parts[0]?.replace('Phỏng vấn: ', '').replace(/"/g, '').trim() || tip;
                  const answer = parts[1]?.trim() || '';

                  return (
                    <div
                      key={qIdx}
                      style={{
                        border: '1px solid var(--color-border)',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        backgroundColor: 'var(--color-surface)',
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => setOpenQaIndex(isOpen ? null : qIdx)}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '12px',
                          padding: '12px 16px',
                          backgroundColor: isOpen ? '#fbf8f3' : 'transparent',
                          border: 'none',
                          textAlign: 'left',
                          cursor: 'pointer',
                        }}
                      >
                        <span style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--color-primary)' }}>
                          Q{qIdx + 1}: {question}
                        </span>
                        <span
                          style={{
                            fontSize: '0.76rem',
                            fontFamily: 'var(--font-label)',
                            color: 'var(--color-tertiary)',
                            fontWeight: 700,
                            minWidth: '75px',
                            textAlign: 'right',
                          }}
                        >
                          {isOpen ? 'Ẩn đáp án' : 'Xem đáp án'}
                        </span>
                      </button>

                      {isOpen && answer && (
                        <div
                          style={{
                            padding: '14px 16px',
                            borderTop: '1px solid var(--color-border-light)',
                            backgroundColor: '#fafaf9',
                            fontSize: '0.9rem',
                            lineHeight: '1.6',
                            color: 'var(--color-primary)',
                          }}
                        >
                          <strong>Giải thích:</strong> {answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Personal Note Box */}
          <div style={{ borderTop: '1px solid var(--color-border-light)', paddingTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label
                htmlFor={`tool-note-${selectedGuide.id}`}
                style={{
                  fontFamily: 'var(--font-label)',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  color: 'var(--color-primary)',
                }}
              >
                Ghi chú cá nhân:
              </label>
              {saveNoteSuccess && (
                <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>
                  Đã lưu ghi chú!
                </span>
              )}
            </div>
            <textarea
              id={`tool-note-${selectedGuide.id}`}
              rows={4}
              value={noteMap[selectedGuide.id] || ''}
              onChange={(e) => handleNoteChange(selectedGuide.id, e.target.value)}
              placeholder="Nhập ghi chú cá nhân, các lệnh git/docker hay quên, lưu ý phỏng vấn..."
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '3px',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-neutral)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.88rem',
                lineHeight: '1.6',
                resize: 'vertical',
                boxSizing: 'border-box',
              }}
            />
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* FOOTER SECTION: TÀI LIỆU NGUỒN GỐC (TÍCH HỢP DƯỚI CÙNG NHƯ SYSTEM DESIGN) */}
      {/* ============================================================ */}
      <div
        style={{
          marginTop: '32px',
          padding: '24px',
          borderRadius: '4px',
          border: '1px solid var(--color-border)',
          backgroundColor: '#fffdfa',
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span
              style={{
                fontSize: '0.72rem',
                fontFamily: 'var(--font-label)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                padding: '2px 8px',
                borderRadius: '2px',
                backgroundColor: 'var(--color-neutral)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-secondary)',
                fontWeight: 700,
              }}
            >
              Citations & Knowledge Sources
            </span>
          </div>
          <h3
            style={{
              fontSize: '1.25rem',
              fontFamily: 'var(--font-display)',
              color: 'var(--color-primary)',
              margin: '6px 0 4px 0',
            }}
          >
            Tài Liệu Tham Khảo & Trích Dẫn
          </h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--color-secondary)', margin: 0, lineHeight: 1.5 }}>
            Tổng hợp cẩm nang chính thức, sách gốc và tiêu chuẩn kỹ thuật quốc tế được dùng làm kim chỉ nam thực hành và chuẩn bị hồ sơ ứng tuyển.
          </p>
        </div>

        {/* Comparison Callout Box */}
        <div
          style={{
            padding: '12px 16px',
            backgroundColor: '#fef8f0',
            border: '1px solid #fde68a',
            borderLeft: '4px solid #f59e0b',
            borderRadius: '2px',
            marginBottom: '20px',
            fontSize: '0.85rem',
            lineHeight: 1.6,
            color: '#78350f',
          }}
        >
          <strong>Tiêu chuẩn Đánh giá Kỹ thuật:</strong> Trong các buổi phỏng vấn backend, nhà tuyển dụng đánh giá cao khả năng làm việc nhóm qua <em>Git Workflow chuẩn chỉ</em> (không merge commit rác, hiểu rõ rebase) và kỹ năng đóng gói <em>Docker Multi-stage tối ưu dung lượng</em>. Một repository sạch sẽ theo mẫu <strong>RealWorld Backend Specification</strong> là minh chứng thuyết phục nhất cho năng lực thực chiến.
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '18px' }}>
          {[
            { id: 'all', label: 'Tất cả' },
            { id: 'Book', label: 'Sách' },
            { id: 'Official Doc', label: 'Tài liệu chính thức' },
            { id: 'Open Source Specification', label: 'Tiêu chuẩn mã nguồn mở' },
          ].map((tab) => {
            const isActive = citationFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setCitationFilter(tab.id)}
                style={{
                  padding: '5px 12px',
                  fontSize: '0.76rem',
                  fontFamily: 'var(--font-label)',
                  fontWeight: isActive ? 700 : 600,
                  letterSpacing: '0.04em',
                  borderRadius: '2px',
                  border: isActive ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                  backgroundColor: isActive ? 'var(--color-primary)' : 'var(--color-surface)',
                  color: isActive ? '#ffffff' : 'var(--color-primary)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Citations Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '16px',
            alignItems: 'stretch',
          }}
        >
          {DETAILED_TOOL_CITATIONS.filter(
            (c) => citationFilter === 'all' || c.type === citationFilter
          ).map((item) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '16px 18px',
                borderRadius: '2px',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-surface)',
                gap: '10px',
                height: '100%',
                boxSizing: 'border-box',
              }}
            >
              {/* Type badge & Author */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                <span
                  style={{
                    fontSize: '0.68rem',
                    fontFamily: 'var(--font-label)',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    padding: '3px 8px',
                    borderRadius: '2px',
                    backgroundColor: 'var(--color-neutral)',
                    color: 'var(--color-primary)',
                    border: '1px solid var(--color-border)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item.type}
                </span>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--color-secondary)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    textAlign: 'right',
                    flex: 1,
                  }}
                >
                  {item.author}
                </span>
              </div>

              {/* Title & Link */}
              <div>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: '0.94rem',
                    fontWeight: 700,
                    fontFamily: 'var(--font-display)',
                    color: 'var(--color-primary)',
                    textDecoration: 'none',
                    lineHeight: 1.35,
                    display: 'inline-block',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                  onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
                >
                  {item.title} &#8599;
                </a>
              </div>

              {/* Description */}
              <p style={{ fontSize: '0.84rem', color: 'var(--color-secondary)', margin: 0, lineHeight: 1.5, flex: 1 }}>
                {item.description}
              </p>

              {/* Key Highlights */}
              {item.highlights && item.highlights.length > 0 && (
                <div
                  style={{
                    backgroundColor: 'var(--color-neutral)',
                    padding: '8px 10px',
                    borderRadius: '2px',
                    border: '1px solid var(--color-border-light)',
                  }}
                >
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-primary)', marginBottom: '4px' }}>
                    Điểm mấu chốt:
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    {item.highlights.map((hl, hIdx) => (
                      <li key={hIdx} style={{ fontSize: '0.78rem', color: 'var(--color-primary)', lineHeight: 1.4 }}>
                        {hl}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Key Takeaway */}
              <div
                style={{
                  padding: '8px 10px',
                  backgroundColor: '#fffdfa',
                  borderLeft: '3px solid var(--color-tertiary)',
                  fontSize: '0.8rem',
                  fontStyle: 'italic',
                  color: 'var(--color-primary)',
                  lineHeight: 1.45,
                }}
              >
                "{item.keyTakeaway}"
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
