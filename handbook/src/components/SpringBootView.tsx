'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  SPRING_BOOT_MODULES,
  SpringBootModule,
  SpringBootTopic,
  SpringBootStatus,
  getSpringBootStatusKey,
  getSpringBootNoteKey,
} from '@/lib/springBootData';
import CodeBlock from '@/components/CodeBlock';
import SpringBootGraph from '@/components/SpringBootGraph';

const STATUS_LABELS: Record<SpringBootStatus, string> = {
  'not-started': 'Chưa học',
  'in-progress': 'Đang học',
  'done': 'Đã nắm vững',
};

const STATUS_NEXT: Record<SpringBootStatus, SpringBootStatus> = {
  'not-started': 'in-progress',
  'in-progress': 'done',
  'done': 'not-started',
};

export default function SpringBootView() {
  const [selectedModuleId, setSelectedModuleId] = useState<string>(SPRING_BOOT_MODULES[0].id);
  const [selectedTopicId, setSelectedTopicId] = useState<string>(SPRING_BOOT_MODULES[0].topics[0].id);
  const [statusMap, setStatusMap] = useState<Record<string, SpringBootStatus>>({});
  const [noteMap, setNoteMap] = useState<Record<string, string>>({});
  const [openQaIndex, setOpenQaIndex] = useState<number | null>(null);
  const [saveNoteSuccess, setSaveNoteSuccess] = useState(false);
  const [showGraph, setShowGraph] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showOriginalMd, setShowOriginalMd] = useState<boolean>(false);

  // Load statuses and notes from localStorage
  useEffect(() => {
    const loadedStatus: Record<string, SpringBootStatus> = {};
    const loadedNotes: Record<string, string> = {};

    SPRING_BOOT_MODULES.forEach((mod) => {
      mod.topics.forEach((t) => {
        try {
          const s = localStorage.getItem(getSpringBootStatusKey(t.id));
          if (s === 'not-started' || s === 'in-progress' || s === 'done') {
            loadedStatus[t.id] = s;
          } else {
            loadedStatus[t.id] = 'not-started';
          }

          const n = localStorage.getItem(getSpringBootNoteKey(t.id));
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
        localStorage.setItem(getSpringBootStatusKey(topicId), next);
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
      localStorage.setItem(getSpringBootNoteKey(topicId), val);
      setSaveNoteSuccess(true);
      setTimeout(() => setSaveNoteSuccess(false), 2000);
    } catch {
      // ignore
    }
  };

  // Compute total progress
  const totalTopics = useMemo(() => {
    return SPRING_BOOT_MODULES.reduce((acc, m) => acc + m.topics.length, 0);
  }, []);

  const doneCount = useMemo(() => {
    return Object.values(statusMap).filter((s) => s === 'done').length;
  }, [statusMap]);

  const inProgressCount = useMemo(() => {
    return Object.values(statusMap).filter((s) => s === 'in-progress').length;
  }, [statusMap]);

  const progressPercent = totalTopics > 0 ? Math.round((doneCount / totalTopics) * 100) : 0;

  // Find active module & topic
  const currentModule = useMemo(() => {
    return SPRING_BOOT_MODULES.find((m) => m.id === selectedModuleId) || SPRING_BOOT_MODULES[0];
  }, [selectedModuleId]);

  const currentTopic = useMemo(() => {
    for (const m of SPRING_BOOT_MODULES) {
      const found = m.topics.find((t) => t.id === selectedTopicId);
      if (found) return found;
    }
    return currentModule.topics[0];
  }, [selectedTopicId, currentModule]);

  // Handle select topic from graph or search
  const handleSelectTopic = (topicId: string, moduleId: string) => {
    setSelectedModuleId(moduleId);
    setSelectedTopicId(topicId);
    setOpenQaIndex(null);
  };

  // Filtered topics when searching
  const searchFilteredTopics = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase().trim();
    const list: { topic: SpringBootTopic; module: SpringBootModule }[] = [];

    SPRING_BOOT_MODULES.forEach((mod) => {
      mod.topics.forEach((t) => {
        if (
          t.title.toLowerCase().includes(q) ||
          t.englishTitle.toLowerCase().includes(q) ||
          t.slug.toLowerCase().includes(q) ||
          t.summary.toLowerCase().includes(q)
        ) {
          list.push({ topic: t, module: mod });
        }
      });
    });
    return list;
  }, [searchQuery]);

  return (
    <div className="system-design-container">
      {/* Track Header & Progress */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <h2
            style={{
              fontSize: '1.45rem',
              fontWeight: 700,
              fontFamily: 'var(--font-display)',
              margin: '0 0 6px 0',
              color: 'var(--color-primary)',
            }}
          >
            Spring Boot 3 & Microservices — Lộ trình Kiến trúc Thực chiến
          </h2>
          <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--color-secondary)' }}>
            Lộ trình 6 modules toàn diện từ roadmap.sh/spring-boot, hiện đại hóa với Spring Boot 3.x, Java 21, Spring Security 6 và Cloud Microservices.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => setShowGraph((prev) => !prev)}
            style={{ border: '1px solid var(--color-border)', borderRadius: '6px' }}
          >
            {showGraph ? 'Ẩn cây lộ trình' : 'Hiện cây lộ trình'}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ marginBottom: '24px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '6px',
            fontSize: '0.84rem',
            color: 'var(--color-secondary)',
          }}
        >
          <span>
            Tiến độ: <strong>{doneCount}/{totalTopics}</strong> hoàn thành ({progressPercent}%)
            {inProgressCount > 0 && <span> — {inProgressCount} đang học</span>}
          </span>
          <span>{totalTopics} Chủ đề chuẩn hóa</span>
        </div>
        <div
          style={{
            width: '100%',
            height: '8px',
            backgroundColor: 'var(--color-surface-hover)',
            borderRadius: '999px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${progressPercent}%`,
              height: '100%',
              backgroundColor: '#137333',
              transition: 'width 0.3s ease',
            }}
          />
        </div>
      </div>

      {/* Interactive Graph */}
      {showGraph && (
        <SpringBootGraph
          selectedTopicId={selectedTopicId}
          statusMap={statusMap}
          onSelectTopic={handleSelectTopic}
        />
      )}

      {/* Search Bar */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Tìm kiếm chủ đề Spring Boot, Annotation, cơ chế (vd: 'IoC', '@Transactional', 'JWT', 'AOP')..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 14px',
            borderRadius: '8px',
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-surface)',
            color: 'var(--color-primary)',
            fontSize: '0.92rem',
          }}
        />
      </div>

      {/* Search results view if search is active */}
      {searchFilteredTopics ? (
        <div style={{ marginBottom: '32px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px',
            }}
          >
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600 }}>
              Tìm thấy {searchFilteredTopics.length} chủ đề phù hợp
            </h3>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setSearchQuery('')}
            >
              Xóa tìm kiếm
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
            {searchFilteredTopics.map(({ topic, module: mod }) => {
              const st = statusMap[topic.id] || 'not-started';
              return (
                <div
                  key={topic.id}
                  onClick={() => {
                    handleSelectTopic(topic.id, mod.id);
                    setSearchQuery('');
                  }}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-surface)',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#990f3d' }}>
                      {mod.badge}
                    </span>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        backgroundColor: st === 'done' ? '#e6f4ea' : st === 'in-progress' ? '#fef7e0' : 'var(--color-surface-hover)',
                        color: st === 'done' ? '#137333' : st === 'in-progress' ? '#b06000' : 'var(--color-secondary)',
                      }}
                    >
                      {STATUS_LABELS[st]}
                    </span>
                  </div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '0.95rem', fontWeight: 600 }}>{topic.title}</h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-secondary)', lineHeight: 1.4 }}>
                    {topic.englishTitle}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      {/* Main 2-Column Layout: Modules & Topics on Left, Content on Right */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '320px 1fr',
          gap: '24px',
          alignItems: 'start',
        }}
        className="system-design-grid"
      >
        {/* Left Column: Module & Topic Nav */}
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
            Mục lục Lộ trình (6 Modules)
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {SPRING_BOOT_MODULES.map((mod) => {
              const isCurrentMod = mod.id === selectedModuleId;
              const modDone = mod.topics.filter((t) => statusMap[t.id] === 'done').length;

              return (
                <div key={mod.id}>
                  <div
                    onClick={() => {
                      setSelectedModuleId(mod.id);
                      setSelectedTopicId(mod.topics[0].id);
                      setOpenQaIndex(null);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      backgroundColor: isCurrentMod ? 'rgba(153, 15, 61, 0.08)' : 'transparent',
                      cursor: 'pointer',
                      fontWeight: isCurrentMod ? 700 : 600,
                      color: isCurrentMod ? '#990f3d' : 'var(--color-primary)',
                      fontSize: '0.88rem',
                    }}
                  >
                    <span>{mod.title}</span>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: modDone === mod.topics.length ? '#137333' : 'var(--color-secondary)',
                      }}
                    >
                      {modDone}/{mod.topics.length}
                    </span>
                  </div>

                  {/* Sub-topics list */}
                  {isCurrentMod && (
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
                      {mod.topics.map((t) => {
                        const isSelectedTopic = t.id === selectedTopicId;
                        const st = statusMap[t.id] || 'not-started';

                        return (
                          <div
                            key={t.id}
                            onClick={() => {
                              setSelectedTopicId(t.id);
                              setOpenQaIndex(null);
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '6px 8px',
                              borderRadius: '6px',
                              backgroundColor: isSelectedTopic ? 'var(--color-surface-hover)' : 'transparent',
                              color: isSelectedTopic ? 'var(--color-primary)' : 'var(--color-secondary)',
                              fontWeight: isSelectedTopic ? 600 : 400,
                              fontSize: '0.82rem',
                              cursor: 'pointer',
                            }}
                          >
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {t.title}
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
        </div>

        {/* Right Column: Topic Detail Content */}
        <div
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: '12px',
            padding: '28px',
          }}
        >
          {/* Topic Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              borderBottom: '1px solid var(--color-border)',
              paddingBottom: '18px',
              marginBottom: '20px',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div>
              <div
                style={{
                  display: 'inline-block',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: '#990f3d',
                  backgroundColor: 'rgba(153, 15, 61, 0.08)',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  marginBottom: '8px',
                }}
              >
                {currentModule.badge} — {currentModule.title}
              </div>
              <h2
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  fontFamily: 'var(--font-display)',
                  margin: '0 0 4px 0',
                  color: 'var(--color-primary)',
                }}
              >
                {currentTopic.title}
              </h2>
              <div style={{ fontSize: '0.9rem', color: 'var(--color-secondary)' }}>
                {currentTopic.englishTitle} • Thời lượng đề xuất: ~{currentTopic.estimatedMinutes} phút
              </div>
            </div>

            {/* Status Toggle Button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                onClick={() => handleToggleStatus(currentTopic.id)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: '1px solid',
                  transition: 'all 0.2s ease',
                  backgroundColor:
                    statusMap[currentTopic.id] === 'done'
                      ? '#e6f4ea'
                      : statusMap[currentTopic.id] === 'in-progress'
                      ? '#fef7e0'
                      : 'var(--color-surface)',
                  borderColor:
                    statusMap[currentTopic.id] === 'done'
                      ? '#137333'
                      : statusMap[currentTopic.id] === 'in-progress'
                      ? '#b06000'
                      : 'var(--color-border)',
                  color:
                    statusMap[currentTopic.id] === 'done'
                      ? '#137333'
                      : statusMap[currentTopic.id] === 'in-progress'
                      ? '#b06000'
                      : 'var(--color-primary)',
                }}
              >
                Trạng thái: {STATUS_LABELS[statusMap[currentTopic.id] || 'not-started']}
              </button>
            </div>
          </div>

          {/* Summary Box */}
          <div
            style={{
              padding: '16px',
              backgroundColor: 'var(--color-surface-hover)',
              borderRadius: '8px',
              marginBottom: '24px',
              borderLeft: '4px solid #990f3d',
            }}
          >
            <h4 style={{ margin: '0 0 6px 0', fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-primary)' }}>
              Tóm tắt cốt lõi (Executive Summary)
            </h4>
            <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--color-secondary)', lineHeight: 1.6 }}>
              {currentTopic.summary}
            </p>
          </div>

          {/* Core Concepts */}
          <div style={{ marginBottom: '28px' }}>
            <h3
              style={{
                fontSize: '1.15rem',
                fontWeight: 700,
                fontFamily: 'var(--font-display)',
                marginBottom: '14px',
                color: 'var(--color-primary)',
              }}
            >
              Nguyên lý & Kiến thức Chuyên sâu
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {currentTopic.coreConcepts.map((concept, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '16px',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                    backgroundColor: 'var(--color-surface)',
                  }}
                >
                  <h4 style={{ margin: '0 0 10px 0', fontSize: '0.98rem', fontWeight: 600, color: '#990f3d' }}>
                    {concept.heading}
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {concept.points.map((pt, pIdx) => (
                      <li key={pIdx} style={{ fontSize: '0.9rem', color: 'var(--color-primary)', lineHeight: 1.6 }}>
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Java 21 / Spring Boot 3 Deep Dive */}
          {currentTopic.javaDeepDive && (
            <div style={{ marginBottom: '28px' }}>
              <h3
                style={{
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  fontFamily: 'var(--font-display)',
                  marginBottom: '10px',
                  color: 'var(--color-primary)',
                }}
              >
                Mã nguồn Thực chiến: {currentTopic.javaDeepDive.title}
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-secondary)', marginBottom: '12px' }}>
                {currentTopic.javaDeepDive.description}
              </p>

              {currentTopic.javaDeepDive.codeSnippet && (
                <CodeBlock
                  code={currentTopic.javaDeepDive.codeSnippet}
                  language="java"
                />
              )}
            </div>
          )}

          {/* Interview Q&A Accordion */}
          {currentTopic.interviewQA && currentTopic.interviewQA.length > 0 && (
            <div style={{ marginBottom: '28px' }}>
              <h3
                style={{
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  fontFamily: 'var(--font-display)',
                  marginBottom: '14px',
                  color: 'var(--color-primary)',
                }}
              >
                Câu hỏi Phỏng vấn Trọng tâm (Interview Q&A)
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {currentTopic.interviewQA.map((qa, idx) => {
                  const isOpen = openQaIndex === idx;
                  return (
                    <div
                      key={idx}
                      style={{
                        border: '1px solid var(--color-border)',
                        borderRadius: '8px',
                        overflow: 'hidden',
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => setOpenQaIndex(isOpen ? null : idx)}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '14px 16px',
                          backgroundColor: isOpen ? 'var(--color-surface-hover)' : 'var(--color-surface)',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          fontWeight: 600,
                          fontSize: '0.92rem',
                          color: 'var(--color-primary)',
                        }}
                      >
                        <span>Q: {qa.question}</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-secondary)', marginLeft: '12px' }}>
                          {isOpen ? '▲ Ẩn đáp án' : '▼ Xem đáp án'}
                        </span>
                      </button>

                      {isOpen && (
                        <div
                          style={{
                            padding: '16px',
                            backgroundColor: 'var(--color-surface)',
                            borderTop: '1px solid var(--color-border)',
                            fontSize: '0.9rem',
                            lineHeight: 1.6,
                            color: 'var(--color-primary)',
                          }}
                        >
                          <strong>Trả lời chuẩn:</strong> {qa.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Original Markdown from Roadmap.sh */}
          {currentTopic.originalRoadmapMarkdown && (
            <div style={{ marginBottom: '28px' }}>
              <button
                type="button"
                onClick={() => setShowOriginalMd((prev) => !prev)}
                className="btn btn-ghost btn-sm"
                style={{
                  border: '1px solid var(--color-border)',
                  borderRadius: '6px',
                  fontSize: '0.82rem',
                  marginBottom: '12px',
                }}
              >
                {showOriginalMd ? 'Ẩn nội dung gốc roadmap.sh' : 'Xem nội dung gốc từ roadmap.sh'}
              </button>

              {showOriginalMd && (
                <div
                  style={{
                    padding: '16px',
                    backgroundColor: 'var(--color-surface-hover)',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border)',
                    fontSize: '0.88rem',
                    lineHeight: 1.6,
                    color: 'var(--color-secondary)',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {currentTopic.originalRoadmapMarkdown}
                </div>
              )}
            </div>
          )}

          {/* Personal Note Editor */}
          <div
            style={{
              paddingTop: '20px',
              borderTop: '1px solid var(--color-border)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-primary)' }}>
                Ghi chú cá nhân (Personal Notes)
              </h4>
              {saveNoteSuccess && (
                <span style={{ fontSize: '0.78rem', color: '#137333', fontWeight: 600 }}>
                  Đã tự động lưu ghi chú
                </span>
              )}
            </div>
            <textarea
              placeholder="Ghi lại các lưu ý thực chiến, bài học hoặc link dự án của bạn cho chủ đề này..."
              value={noteMap[currentTopic.id] || ''}
              onChange={(e) => handleNoteChange(currentTopic.id, e.target.value)}
              rows={4}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-primary)',
                fontSize: '0.88rem',
                lineHeight: 1.5,
                fontFamily: 'inherit',
                resize: 'vertical',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
