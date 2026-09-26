'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  SYSTEM_DESIGN_MODULES,
  SYSTEM_DESIGN_CITATIONS,
  SystemDesignModule,
  SystemDesignTopic,
  SystemDesignStatus,
  SystemDesignCitation,
  getSystemDesignStatusKey,
  getSystemDesignNoteKey,
} from '@/lib/systemDesignData';
import CodeBlock from '@/components/CodeBlock';
import SystemDesignGraph from '@/components/SystemDesignGraph';

const STATUS_LABELS: Record<SystemDesignStatus, string> = {
  'not-started': 'Chưa học',
  'in-progress': 'Đang học',
  'done': 'Đã nắm vững',
};

const STATUS_NEXT: Record<SystemDesignStatus, SystemDesignStatus> = {
  'not-started': 'in-progress',
  'in-progress': 'done',
  'done': 'not-started',
};

export default function SystemDesignView() {
  const [selectedModuleId, setSelectedModuleId] = useState<string>(SYSTEM_DESIGN_MODULES[0].id);
  const [selectedTopicId, setSelectedTopicId] = useState<string>(SYSTEM_DESIGN_MODULES[0].topics[0].id);
  const [statusMap, setStatusMap] = useState<Record<string, SystemDesignStatus>>({});
  const [noteMap, setNoteMap] = useState<Record<string, string>>({});
  const [openQaIndex, setOpenQaIndex] = useState<number | null>(null);
  const [saveNoteSuccess, setSaveNoteSuccess] = useState(false);
  const [showGraph, setShowGraph] = useState<boolean>(true);
  const [citationFilter, setCitationFilter] = useState<string>('all');

  // Load statuses and notes from localStorage
  useEffect(() => {
    const loadedStatus: Record<string, SystemDesignStatus> = {};
    const loadedNotes: Record<string, string> = {};

    SYSTEM_DESIGN_MODULES.forEach((mod) => {
      mod.topics.forEach((t) => {
        try {
          const s = localStorage.getItem(getSystemDesignStatusKey(t.id));
          if (s === 'not-started' || s === 'in-progress' || s === 'done') {
            loadedStatus[t.id] = s;
          } else {
            loadedStatus[t.id] = 'not-started';
          }

          const n = localStorage.getItem(getSystemDesignNoteKey(t.id));
          if (n) {
            loadedNotes[t.id] = n;
          }
        } catch {
          loadedStatus[t.id] = 'not-started';
        }
      });
    });

    setStatusMap(loadedStatus);
    setNoteMap(loadedNotes);
  }, []);

  // Update status handler
  const handleToggleStatus = useCallback((topicId: string) => {
    setStatusMap((prev) => {
      const current = prev[topicId] || 'not-started';
      const next = STATUS_NEXT[current];
      try {
        localStorage.setItem(getSystemDesignStatusKey(topicId), next);
      } catch {
        // ignore
      }
      return { ...prev, [topicId]: next };
    });
  }, []);

  // Note change handler
  const handleNoteChange = (topicId: string, val: string) => {
    setNoteMap((prev) => ({ ...prev, [topicId]: val }));
    try {
      localStorage.setItem(getSystemDesignNoteKey(topicId), val);
      setSaveNoteSuccess(true);
      setTimeout(() => setSaveNoteSuccess(false), 2000);
    } catch {
      // ignore
    }
  };

  // Compute total progress
  const totalTopics = useMemo(() => {
    return SYSTEM_DESIGN_MODULES.reduce((acc, m) => acc + m.topics.length, 0);
  }, []);

  const doneCount = useMemo(() => {
    return Object.values(statusMap).filter((s) => s === 'done').length;
  }, [statusMap]);

  const activeModule = useMemo(() => {
    return SYSTEM_DESIGN_MODULES.find((m) => m.id === selectedModuleId) || SYSTEM_DESIGN_MODULES[0];
  }, [selectedModuleId]);

  const activeTopic = useMemo(() => {
    return activeModule.topics.find((t) => t.id === selectedTopicId) || activeModule.topics[0];
  }, [activeModule, selectedTopicId]);

  // Reset QA accordion when changing topic
  useEffect(() => {
    setOpenQaIndex(null);
  }, [selectedTopicId]);

  const currentTopicStatus = statusMap[activeTopic.id] || 'not-started';

  return (
    <div>
      {/* Header — Đồng bộ 100% với phong cách OopView */}
      <div style={{ marginBottom: '20px' }}>
        <h2
          style={{
            fontSize: '1.4rem',
            fontFamily: 'var(--font-display)',
            marginBottom: '4px',
          }}
        >
          System Design — Kiến Trúc Hệ Thống Chuẩn Lộ Trình
        </h2>
        <p
          style={{
            color: 'var(--color-secondary)',
            fontSize: '0.92rem',
            marginBottom: '14px',
            fontFamily: 'var(--font-body)',
          }}
        >
          Lộ trình 5 modules (Module 0 phương pháp & khung tư duy + 4 modules kỹ thuật chuyên sâu) bám sát kiến trúc thực chiến và roadmap.sh/system-design.
        </p>
        {/* Progress Bar & View Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '240px' }}>
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
                  width: `${totalTopics === 0 ? 0 : Math.round((doneCount / totalTopics) * 100)}%`,
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
              {doneCount}/{totalTopics} hoàn thành
            </span>
          </div>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setShowGraph(!showGraph)}
            style={{
              padding: '4px 12px',
              fontSize: '0.78rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>{showGraph ? 'Ẩn cây lộ trình' : 'Hiện cây lộ trình (DAG Graph)'}</span>
          </button>
        </div>
      </div>

      {/* Interactive Graph Node Tree */}
      {showGraph && (
        <SystemDesignGraph
          selectedTopicId={activeTopic.id}
          statusMap={statusMap}
          onSelectTopic={(tId, mId) => {
            setSelectedModuleId(mId);
            setSelectedTopicId(tId);
          }}
        />
      )}

      {/* Main Grid: Sidebar Modules & Topics + Main Detail Content */}
      <div className="track-layout-grid system-design-layout-grid">
        {/* LEFT SIDEBAR: Modules & Topics Tree */}
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
            }}
          >
            Mục lục Lộ trình ({SYSTEM_DESIGN_MODULES.length} Modules)
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {SYSTEM_DESIGN_MODULES.map((module) => {
              const isModuleActive = module.id === selectedModuleId;
              const moduleDone = module.topics.filter((t) => statusMap[t.id] === 'done').length;

              return (
                <div key={module.id}>
                  <div
                    onClick={() => {
                      setSelectedModuleId(module.id);
                      setSelectedTopicId(module.topics[0].id);
                      setOpenQaIndex(null);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      backgroundColor: isModuleActive ? 'rgba(153, 15, 61, 0.08)' : 'transparent',
                      cursor: 'pointer',
                      fontWeight: isModuleActive ? 700 : 600,
                      color: isModuleActive ? '#990f3d' : 'var(--color-primary)',
                      fontSize: '0.88rem',
                    }}
                  >
                    <span>{module.title}</span>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: moduleDone === module.topics.length ? '#137333' : 'var(--color-secondary)',
                      }}
                    >
                      {moduleDone}/{module.topics.length}
                    </span>
                  </div>

                  {/* Sub-topics list */}
                  {isModuleActive && (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                        marginTop: '6px',
                        marginLeft: '8px',
                        paddingLeft: '10px',
                        borderLeft: '2px solid rgba(153, 15, 61, 0.2)',
                      }}
                    >
                      {module.topics.map((topic) => {
                        const isTopicActive = topic.id === activeTopic.id;
                        const st = statusMap[topic.id] || 'not-started';

                        return (
                          <div
                            key={topic.id}
                            onClick={() => {
                              setSelectedTopicId(topic.id);
                              setOpenQaIndex(null);
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '6px 8px',
                              borderRadius: '6px',
                              backgroundColor: isTopicActive ? 'var(--color-surface-hover)' : 'transparent',
                              color: isTopicActive ? 'var(--color-primary)' : 'var(--color-secondary)',
                              fontWeight: isTopicActive ? 600 : 400,
                              fontSize: '0.82rem',
                              cursor: 'pointer',
                            }}
                          >
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {topic.title}
                            </span>
                            <span
                              style={{
                                width: '7px',
                                height: '7px',
                                borderRadius: '50%',
                                backgroundColor: st === 'done' ? '#137333' : st === 'in-progress' ? '#b06000' : '#cbd5e1',
                                flexShrink: 0,
                                marginLeft: '8px',
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Stats Summary Panel */}
          <div
            style={{
              marginTop: '16px',
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
            <div>{doneCount} / {totalTopics} đã hoàn thành</div>
            <div>{Object.values(statusMap).filter((s) => s === 'in-progress').length} đang học</div>
            <div>{totalTopics - doneCount - Object.values(statusMap).filter((s) => s === 'in-progress').length} chưa bắt đầu</div>
          </div>
        </div>

        {/* RIGHT PANEL: Topic Detail Content */}
        <div
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--rounded-lg)',
            overflow: 'hidden',
          }}
        >
          {/* Header — Đồng bộ style với PillarDetailPanel */}
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
              <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-label)', color: 'var(--color-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>
                {activeModule.title} • {activeTopic.estimatedMinutes} phút đọc
              </div>
              <h2 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', color: 'var(--color-primary)', margin: '4px 0 0 0' }}>
                {activeTopic.title}
                <span style={{ fontSize: '0.85rem', fontFamily: 'var(--font-label)', fontWeight: 400, color: 'var(--color-secondary)', marginLeft: '8px' }}>
                  ({activeTopic.englishTitle})
                </span>
              </h2>
            </div>

            {/* Change Status Button */}
            <button
              type="button"
              onClick={() => handleToggleStatus(activeTopic.id)}
              className="btn btn-secondary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.78rem',
                padding: '6px 12px',
              }}
            >
              <span>Trạng thái:</span>
              <strong
                style={{
                  color:
                    currentTopicStatus === 'done'
                      ? '#059669'
                      : currentTopicStatus === 'in-progress'
                      ? '#d97706'
                      : 'var(--color-primary)',
                }}
              >
                {STATUS_LABELS[currentTopicStatus]}
              </strong>
            </button>
          </div>

          <div style={{ padding: '20px 24px' }}>
            {/* Topic Summary Banner */}
            <div
              style={{
                padding: '12px 16px',
                backgroundColor: 'var(--color-neutral)',
                borderLeft: '4px solid var(--color-tertiary)',
                borderRadius: '2px',
                fontSize: '0.92rem',
                lineHeight: '1.6',
                color: 'var(--color-primary)',
                marginBottom: '20px',
              }}
            >
              {activeTopic.summary}
            </div>

          {/* Core Concepts */}
          <div style={{ marginBottom: '28px' }}>
            <h3
              style={{
                fontSize: '1.15rem',
                fontFamily: 'var(--font-display)',
                color: 'var(--color-primary)',
                marginBottom: '14px',
                borderBottom: '1px solid var(--color-border-light)',
                paddingBottom: '6px',
              }}
            >
              Kiến Thức & Nguyên Lý Cốt Lõi
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {activeTopic.coreConcepts.map((concept, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: 'var(--color-neutral)',
                    padding: '14px 18px',
                    borderRadius: '4px',
                    border: '1px solid var(--color-border-light)',
                  }}
                >
                  <h4
                    style={{
                      fontSize: '0.98rem',
                      fontFamily: 'var(--font-label)',
                      color: 'var(--color-primary)',
                      margin: '0 0 8px 0',
                    }}
                  >
                    {concept.heading}
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {concept.points.map((pt, pIdx) => (
                      <li key={pIdx} style={{ fontSize: '0.9rem', lineHeight: '1.55', color: 'var(--color-body)' }}>
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Java Ecosystem Deep Dive (if available) */}
          {activeTopic.javaDeepDive && (
            <div style={{ marginBottom: '28px' }}>
              <h3
                style={{
                  fontSize: '1.15rem',
                  fontFamily: 'var(--font-display)',
                  color: 'var(--color-primary)',
                  marginBottom: '10px',
                  borderBottom: '1px solid var(--color-border-light)',
                  paddingBottom: '6px',
                }}
              >
                {activeTopic.javaDeepDive.title}
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-secondary)', marginBottom: '12px' }}>
                {activeTopic.javaDeepDive.description}
              </p>

              {activeTopic.javaDeepDive.codeSnippet && (
                <CodeBlock
                  code={activeTopic.javaDeepDive.codeSnippet}
                  language="java"
                  filename="SpringImplementationExample.java"
                />
              )}
            </div>
          )}

          {/* Interview QA Section */}
          <div style={{ marginBottom: '28px' }}>
            <h3
              style={{
                fontSize: '1.15rem',
                fontFamily: 'var(--font-display)',
                color: 'var(--color-primary)',
                marginBottom: '14px',
                borderBottom: '1px solid var(--color-border-light)',
                paddingBottom: '6px',
              }}
            >
              Trọng Tâm Phỏng Vấn (System Design Interview Questions)
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {activeTopic.interviewQA.map((qa, qIdx) => {
                const isOpen = openQaIndex === qIdx;

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
                        Q{qIdx + 1}: {qa.question}
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

                    {isOpen && (
                      <div
                        style={{
                          padding: '14px 16px',
                          borderTop: '1px solid var(--color-border-light)',
                          backgroundColor: '#fafaf9',
                          fontSize: '0.9rem',
                          lineHeight: '1.6',
                          color: 'var(--color-body)',
                        }}
                      >
                        {qa.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Personal Note Box */}
          <div
            style={{
              borderTop: '1px solid var(--color-border-light)',
              paddingTop: '20px',
              marginTop: '20px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label
                htmlFor={`note-${activeTopic.id}`}
                style={{
                  fontFamily: 'var(--font-label)',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  color: 'var(--color-primary)',
                }}
              >
                Ghi chú cá nhân (Lưu tự động vào LocalStorage):
              </label>
              {saveNoteSuccess && (
                <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>
                  Đã lưu ghi chú!
                </span>
              )}
            </div>
            <textarea
              id={`note-${activeTopic.id}`}
              rows={5}
              value={noteMap[activeTopic.id] || ''}
              onChange={(e) => handleNoteChange(activeTopic.id, e.target.value)}
              placeholder="Nhập ghi chú cá nhân, các điểm cần nhớ, kinh nghiệm phỏng vấn cho chủ đề này..."
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
    </div>

      {/* Citations & Authoritative References Section */}
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
            Tài Liệu Tham Khảo & Trích Dẫn Uy Tín
          </h3>
          <p
            style={{
              fontSize: '0.88rem',
              color: 'var(--color-secondary)',
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            Tổng hợp các cuốn sách kinh điển, lộ trình chuẩn mực và bài viết kỹ thuật từ Big Tech được dùng làm cơ sở xây dựng 4 module System Design.
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
          <strong>So sánh với roadmap.sh/system-design:</strong> Trong khi <code>roadmap.sh</code> đóng vai trò như một <em>bách khoa toàn thư kỹ năng (Knowledge Graph)</em> để tra cứu toàn diện các công nghệ, thì mô hình <strong>4 Module Thực Chiến</strong> này được đúc kết theo <em>Data Flow & Khung 4 bước phỏng vấn của Alex Xu</em> (Client/Edge -&gt; Gateway/Routing -&gt; Compute/Services -&gt; Data/Storage Tier) nhằm tối ưu tư duy thiết kế bài toán thực tế.
        </div>

        {/* Filter Pills */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap',
            marginBottom: '18px',
          }}
        >
          {[
            { id: 'all', label: 'Tất cả' },
            { id: 'Book', label: 'Sách (Books)' },
            { id: 'Roadmap', label: 'Lộ trình (Roadmap)' },
            { id: 'Open Source', label: 'Mã nguồn mở' },
            { id: 'Course', label: 'Khóa học (Courses)' },
            { id: 'Engineering Blog', label: 'Engineering Blogs' },
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
          {SYSTEM_DESIGN_CITATIONS.filter(
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
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                }}
              >
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
                    lineHeight: '1.2',
                    display: 'inline-flex',
                    alignItems: 'center',
                    flexShrink: 0,
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
              <p
                style={{
                  fontSize: '0.84rem',
                  fontFamily: 'var(--font-body)',
                  color: 'var(--color-body)',
                  lineHeight: 1.55,
                  margin: 0,
                  flexGrow: 1,
                }}
              >
                {item.description}
              </p>

              {/* Highlights */}
              <div
                style={{
                  marginTop: 'auto',
                  paddingTop: '10px',
                  borderTop: '1px solid var(--color-border-light)',
                }}
              >
                <div
                  style={{
                    fontSize: '0.7rem',
                    fontFamily: 'var(--font-label)',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: 'var(--color-secondary)',
                    marginBottom: '6px',
                  }}
                >
                  Đóng góp & Điểm nhấn cốt lõi:
                </div>
                <ul
                  style={{
                    margin: 0,
                    paddingLeft: '16px',
                    fontSize: '0.78rem',
                    lineHeight: 1.45,
                    color: 'var(--color-secondary)',
                  }}
                >
                  {item.highlights.map((h, hIdx) => (
                    <li key={hIdx} style={{ marginBottom: '3px' }}>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
