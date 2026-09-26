'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Link from 'next/link';
import TreeGraph from '@/components/TreeGraph';
import SearchBar from '@/components/SearchBar';
import TopicFilter from '@/components/TopicFilter';
import FormattedText from '@/components/FormattedText';
import NoteModal, { getNoteStorageKey } from '@/components/NoteModal';
import NeetCodeProblemList from '@/components/NeetCodeProblemList';
import OopView from '@/components/OopView';
import SystemDesignView from '@/components/SystemDesignView';
import SpringBootView from '@/components/SpringBootView';
import ReminderSettingsModal from '@/components/ReminderSettingsModal';
import SrsCalendarView from '@/components/SrsCalendarView';
import { Entry } from '@/components/FunctionTable';
import { ALL_NEETCODE_PROBLEMS } from '@/lib/neetcodeData';
import { SrsProgressMap, SRS } from '@/lib/srs';
import TabsNav, { TabItem } from '@/components/TabsNav';

interface SearchResultGroup {
  topicId: string;
  topicName: string;
  entries: Entry[];
}

export default function HomePage() {
  const [activeTrack, setActiveTrack] = useState<'dsa' | 'oop' | 'system-design' | 'spring-boot'>('dsa');
  const [activeMainView, setActiveMainView] = useState<'roadmap' | 'neetcode-all' | 'neetcode-due' | 'calendar'>('roadmap');
  const [query, setQuery] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [results, setResults] = useState<SearchResultGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedNote, setSelectedNote] = useState<{ entry: Entry; topicId: string } | null>(null);
  const [notesMap, setNotesMap] = useState<Record<string, boolean>>({});
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [shortcutsEnabled, setShortcutsEnabled] = useState(true);

  // Lưu trữ vị trí scroll của từng tab để tự động khôi phục khi chuyển qua lại (kể cả phím Q)
  const scrollPositionsRef = useRef<Record<string, number>>({});
  const activeMainViewRef = useRef(activeMainView);

  const handleTabChange = useCallback((newTab: 'roadmap' | 'neetcode-all' | 'neetcode-due' | 'calendar') => {
    // 1. Lưu lại tọa độ scroll hiện tại của tab đang đứng
    scrollPositionsRef.current[activeMainViewRef.current] = window.scrollY;

    // 2. Cập nhật tab mới
    setActiveMainView(newTab);
    activeMainViewRef.current = newTab;

    // 3. Khôi phục lại đúng vị trí scroll của tab đích
    const targetScroll = scrollPositionsRef.current[newTab] || 0;
    requestAnimationFrame(() => {
      window.scrollTo({ top: targetScroll, behavior: 'instant' });
    });
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('handbook_shortcuts_enabled');
      if (saved !== null) {
        setShortcutsEnabled(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  // SRS Global State
  const [srsProgress, setSrsProgress] = useState<SrsProgressMap>({});
  const [srsLoading, setSrsLoading] = useState(true);

  const fetchSrsData = useCallback(async () => {
    try {
      const res = await fetch('/api/srs');
      if (res.ok) {
        const data = await res.json();
        setSrsProgress(data || {});
        try {
          localStorage.setItem('srs_progress_cache', JSON.stringify(data));
        } catch {
          // ignore
        }
      }
    } catch {
      const cached = localStorage.getItem('srs_progress_cache');
      if (cached) {
        try {
          setSrsProgress(JSON.parse(cached));
        } catch {
          // ignore
        }
      }
    } finally {
      setSrsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSrsData();
  }, [fetchSrsData]);

  // Derive Due and Mastered count
  const srsStats = useMemo(() => {
    let dueCount = 0;
    let masteredCount = 0;
    for (const p of ALL_NEETCODE_PROBLEMS) {
      const item = srsProgress[p.id];
      if (SRS.isDue(item)) {
        dueCount++;
      } else if (item?.status === 'mastered') {
        masteredCount++;
      }
    }
    return {
      total: ALL_NEETCODE_PROBLEMS.length,
      due: dueCount,
      mastered: masteredCount,
      new: ALL_NEETCODE_PROBLEMS.length - dueCount - masteredCount,
    };
  }, [srsProgress]);

  // Due problems list
  const dueProblems = useMemo(() => {
    return ALL_NEETCODE_PROBLEMS.filter((p) => SRS.isDue(srsProgress[p.id]));
  }, [srsProgress]);

  // Refresh notes map
  const refreshNotesMap = useCallback(() => {
    const map: Record<string, boolean> = {};
    for (const group of results) {
      for (const entry of group.entries) {
        const key = getNoteStorageKey(group.topicId, entry);
        const note = localStorage.getItem(key);
        if (note && note.trim().length > 0 && note !== '<br>') {
          map[key] = true;
        }
      }
    }
    setNotesMap(map);
  }, [results]);

  useEffect(() => {
    refreshNotesMap();
  }, [refreshNotesMap]);

  // Fetch search results when query or selectedTopics changes
  useEffect(() => {
    if (!query.trim() && selectedTopics.length === 0) {
      setResults([]);
      setLoading(false);
      return;
    }

    let isCancelled = false;
    setLoading(true);

    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    if (selectedTopics.length > 0) params.set('topic', selectedTopics.join(','));

    fetch(`/api/search?${params.toString()}`)
      .then((res) => res.json())
      .then((data: SearchResultGroup[]) => {
        if (!isCancelled) {
          setResults(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setResults([]);
          setLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [query, selectedTopics]);

  // Derived search filter results
  const [unfilteredResults, setUnfilteredResults] = useState<SearchResultGroup[]>([]);
  useEffect(() => {
    if (!query.trim()) {
      setUnfilteredResults([]);
      return;
    }

    let isCancelled = false;
    fetch(`/api/search?q=${encodeURIComponent(query.trim())}`)
      .then((res) => res.json())
      .then((data: SearchResultGroup[]) => {
        if (!isCancelled) {
          setUnfilteredResults(data);
        }
      })
      .catch(() => {
        if (!isCancelled) setUnfilteredResults([]);
      });

    return () => {
      isCancelled = true;
    };
  }, [query]);

  // Extract available topic & subtopic names for filter chips
  const { availableTopics, topicCounts, totalCount } = useMemo(() => {
    const source = unfilteredResults.length > 0 ? unfilteredResults : results;
    const topicMap = new Map<string, number>();
    let total = 0;

    for (const group of source) {
      for (const entry of group.entries) {
        total++;
        const topicName = entry.topic?.trim() || group.topicName;
        topicMap.set(topicName, (topicMap.get(topicName) || 0) + 1);
      }
    }

    const topics = Array.from(topicMap.keys()).sort();
    const counts: Record<string, number> = {};
    topicMap.forEach((count, name) => {
      counts[name] = count;
    });

    return { availableTopics: topics, topicCounts: counts, totalCount: total };
  }, [unfilteredResults, results]);

  const handleSearch = useCallback((q: string) => {
    setQuery(q);
  }, []);

  const handleSelectTopics = useCallback((topics: string[]) => {
    setSelectedTopics(topics);
  }, []);

  const handleReset = useCallback(() => {
    setQuery('');
    setSelectedTopics([]);
    setResults([]);
  }, []);

  const isSearchActive = Boolean(query.trim() || selectedTopics.length > 0);

  return (
    <main className="page-container">
      {/* Page Header */}
      <div className="tree-page-intro" style={{ marginBottom: '16px' }}>
        <h1>Java Learning Platform</h1>
        <p>Nền tảng học lập trình Java toàn diện: DSA (NeetCode 150), OOP (4 tính chất), System Design, Spring Boot.</p>
      </div>

      {/* === TRACK SELECTOR — dùng CSS classes từ design system === */}
      <div className="track-selector">
        {(
          [
            { id: 'dsa', label: 'Java DSA', sub: 'NeetCode 150 + Cú pháp' },
            { id: 'oop', label: 'Java OOP', sub: '4 tính chất cốt lõi' },
            { id: 'system-design', label: 'System Design', sub: 'Roadmap 4 Modules' },
            { id: 'spring-boot', label: 'Spring Boot', sub: 'Roadmap 6 Modules' },
          ] as { id: 'dsa' | 'oop' | 'system-design' | 'spring-boot'; label: string; sub: string; disabled?: boolean }[]
        ).map((track) => (
          <button
            key={track.id}
            type="button"
            disabled={track.disabled}
            onClick={() => !track.disabled && setActiveTrack(track.id)}
            className={`track-selector-btn${activeTrack === track.id ? ' active' : ''}`}
          >
            <div className="track-selector-label">{track.label}</div>
            <div className="track-selector-sub">{track.sub}</div>
          </button>
        ))}
      </div>


      {/* DSA Sub-tabs — chỉ hiện trong track DSA */}
      {activeTrack === 'dsa' && (
        <TabsNav<'roadmap' | 'neetcode-all' | 'neetcode-due' | 'calendar'>
          activeTab={activeMainView}
          onChange={handleTabChange}
          enableShortcuts={shortcutsEnabled && !isReminderModalOpen && !selectedNote}
          style={{ marginTop: '12px', marginBottom: '20px' }}
          rightAction={
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
              {/* Nút noti đến hạn ôn tập */}
              {srsStats.due > 0 && activeMainView !== 'neetcode-due' && (
                <button
                  type="button"
                  className="due-noti-btn"
                  onClick={() => handleTabChange('neetcode-due')}
                  title={`${srsStats.due} bài đến hạn ôn tập hôm nay`}
                  aria-label="Xem bài đến hạn ôn tập"
                >
                  {/* Bell SVG */}
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                  </svg>
                  <span className="due-noti-badge">{srsStats.due}</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsReminderModalOpen(true)}
                className="settings-gear-btn"
                title="Cài đặt hệ thống & Phím tắt"
                aria-label="Cài đặt"
              >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
              </button>
            </div>
          }
          tabs={[
            {
              id: 'roadmap',
              label: 'Roadmap & Cú pháp',
            },
            {
              id: 'neetcode-all',
              label: 'NeetCode 150 (Tất cả)',
              badge: `${srsStats.mastered} / ${srsStats.total}`,
            },
            {
              id: 'neetcode-due',
              label: 'Ôn tập hôm nay',
              badge: srsStats.due > 0 ? srsStats.due : 0,
              badgeStyle: srsStats.due > 0 ? { background: '#990f3d', color: '#ffffff', fontWeight: 700 } : undefined,
            },
            {
              id: 'calendar',
              label: 'Lịch ôn tập',
            },
          ]}
        />
      )}

      {/* ======================================== */}
      {/* OOP TRACK */}
      {activeTrack === 'oop' && (
        <div style={{ marginTop: '20px' }}>
          <OopView />
        </div>
      )}

      {/* ======================================== */}
      {/* SYSTEM DESIGN TRACK */}
      {activeTrack === 'system-design' && (
        <div style={{ marginTop: '20px' }}>
          <SystemDesignView />
        </div>
      )}

      {/* ======================================== */}
      {/* SPRING BOOT TRACK */}
      {activeTrack === 'spring-boot' && (
        <div style={{ marginTop: '20px' }}>
          <SpringBootView />
        </div>
      )}

      {/* ======================================== */}
      {/* DSA TRACK VIEWS */}
      {/* VIEW 1: Roadmap & Syntax search */}
      {activeTrack === 'dsa' && activeMainView === 'roadmap' && (
        <>
          {/* Global Search Bar */}
          <div style={{ marginBottom: '24px' }}>
            <SearchBar
              onSearch={handleSearch}
              initialValue={query}
              placeholder="Tìm kiếm phương thức, cú pháp hoặc từ khóa (ví dụ: 'put', 'bfs', 'getOrDefault')..."
            />

            {/* Topic Filter Chips when searching or results exist */}
            {isSearchActive && availableTopics.length > 0 && (
              <TopicFilter
                topics={availableTopics}
                selectedTopics={selectedTopics}
                onSelectTopics={handleSelectTopics}
                counts={topicCounts}
                totalCount={totalCount}
                label="Lọc kết quả theo chủ đề / cấu trúc dữ liệu (Chọn nhiều thẻ)"
              />
            )}
          </div>

          {/* Search Results Display */}
          {isSearchActive ? (
            <div className="search-results-section" style={{ marginBottom: '40px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '16px',
                  paddingBottom: '8px',
                  borderBottom: '1px solid var(--color-border)',
                }}
              >
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', margin: 0 }}>
                    Kết quả tìm kiếm
                  </h2>
                  <p style={{ fontSize: '0.88rem', color: 'var(--color-secondary)', margin: '4px 0 0 0' }}>
                    Tìm thấy {results.reduce((acc, g) => acc + g.entries.length, 0)} mục
                    {query ? ` với từ khóa "${query}"` : ''}
                    {selectedTopics.length > 0 ? ` trong [${selectedTopics.join(', ')}]` : ''}
                  </p>
                </div>
                <button
                  onClick={handleReset}
                  className="btn btn-ghost btn-sm"
                  style={{ padding: '6px 12px' }}
                >
                  Quay lại Roadmap
                </button>
              </div>

              {loading ? (
                <p className="loading-text">Đang tìm kiếm...</p>
              ) : results.length === 0 ? (
                <div
                  style={{
                    padding: '40px 20px',
                    textAlign: 'center',
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                  }}
                >
                  <p style={{ fontSize: '1.05rem', color: 'var(--color-secondary)' }}>
                    Không tìm thấy kết quả nào phù hợp với từ khóa {query ? `"${query}"` : ''}.
                  </p>
                  <button
                    onClick={handleReset}
                    className="btn btn-secondary btn-sm"
                    style={{ marginTop: '12px' }}
                  >
                    Xóa bộ lọc tìm kiếm
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {results.map((group) => (
                    <div
                      key={group.topicId}
                      style={{
                        backgroundColor: 'var(--color-surface)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '8px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          padding: '12px 16px',
                          backgroundColor: '#fff4e8',
                          borderBottom: '1px solid var(--color-border)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Link
                          href={`/topic/${group.topicId}`}
                          style={{
                            fontWeight: 700,
                            fontSize: '1rem',
                            fontFamily: 'var(--font-label)',
                            color: 'var(--color-tertiary)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                          }}
                        >
                          <span>{group.topicName}</span>
                          <span style={{ fontSize: '0.8rem' }}>→</span>
                        </Link>
                        <span
                          style={{
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            color: 'var(--color-secondary)',
                          }}
                        >
                          {group.entries.length} kết quả
                        </span>
                      </div>

                      <div className="fn-table-wrap" style={{ border: 'none', borderRadius: 0 }}>
                        <table className="fn-table">
                          <thead>
                            <tr>
                              <th style={{ width: '100px', whiteSpace: 'nowrap' }}>Topic</th>
                              <th style={{ width: '130px', whiteSpace: 'nowrap' }}>Method</th>
                              <th style={{ width: '220px' }}>Syntax</th>
                              <th style={{ width: '130px', whiteSpace: 'nowrap' }}>Return</th>
                              <th>Description</th>
                            </tr>
                          </thead>
                          <tbody>
                            {group.entries.map((entry, idx) => {
                              const noteKey = getNoteStorageKey(group.topicId, entry);
                              const hasNote = Boolean(notesMap[noteKey]);

                              return (
                                <tr
                                  key={idx}
                                  className="row-interactive"
                                  onClick={() => setSelectedNote({ entry, topicId: group.topicId })}
                                  title="Bấm để xem/sửa ghi chú cá nhân"
                                >
                                  <td>
                                    {entry.topic ? (
                                      <span
                                        style={{
                                          display: 'inline-block',
                                          padding: '2px 8px',
                                          borderRadius: '4px',
                                          fontSize: '0.75rem',
                                          fontWeight: 600,
                                          backgroundColor: '#fff4e8',
                                          color: 'var(--color-tertiary)',
                                          border: '1px solid var(--color-border)',
                                          whiteSpace: 'nowrap',
                                        }}
                                      >
                                        {entry.topic}
                                      </span>
                                    ) : (
                                      <span style={{ color: '#807973' }}>—</span>
                                    )}
                                  </td>
                                  <td>
                                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                      {entry.method ? <code>{entry.method}</code> : <span style={{ color: '#807973' }}>—</span>}
                                      {hasNote && (
                                        <span
                                          className="note-indicator-badge"
                                          title="Có ghi chú cá nhân"
                                        >
                                          !
                                        </span>
                                      )}
                                    </div>
                                  </td>
                                  <td>
                                    {entry.syntax ? <code>{entry.syntax}</code> : <span style={{ color: '#807973' }}>—</span>}
                                  </td>
                                  <td>
                                    {entry.returns && entry.returns !== '—' ? (
                                      <code
                                        style={{
                                          color: '#6b21a8',
                                          backgroundColor: '#f3e8ff',
                                          padding: '2px 6px',
                                          borderRadius: '4px',
                                          fontSize: '0.8rem',
                                          fontWeight: 500,
                                        }}
                                      >
                                        {entry.returns}
                                      </code>
                                    ) : (
                                      <span style={{ color: '#807973' }}>—</span>
                                    )}
                                  </td>
                                  <td>
                                    {entry.description ? (
                                      <FormattedText text={entry.description} />
                                    ) : (
                                      <span style={{ color: '#807973' }}>—</span>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <TreeGraph />
          )}
        </>
      )}

      {/* VIEW 2: All NeetCode 150 Problems */}
      {activeTrack === 'dsa' && activeMainView === 'neetcode-all' && (
        <div>
          <div style={{ marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-display)', marginBottom: '4px' }}>
              NeetCode 150 Problem Checklist
            </h2>
            <p style={{ color: 'var(--color-secondary)', fontSize: '0.92rem' }}>
              Danh sách đầy đủ 150 bài toán nền tảng phân chia theo 18 chủ đề, hỗ trợ lặp lại ngắt quãng và ghi chú.
            </p>
          </div>
          <NeetCodeProblemList
            problems={ALL_NEETCODE_PROBLEMS}
            showTopicColumn={true}
            onProgressUpdated={fetchSrsData}
          />
        </div>
      )}

      {/* VIEW 3: Due Today Problems */}
      {activeTrack === 'dsa' && activeMainView === 'neetcode-due' && (
        <div>
          <div style={{ marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-display)', marginBottom: '4px' }}>
              Danh Sách Cần Ôn Tập Hôm Nay
            </h2>
            <p style={{ color: 'var(--color-secondary)', fontSize: '0.92rem' }}>
              Các bài toán đã đến hạn ôn tập lặp lại ngắt quãng hôm nay ({SRS.getTodayStr()}).
            </p>
          </div>
          {dueProblems.length === 0 ? (
            <div
              style={{
                padding: '48px 24px',
                textAlign: 'center',
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
              }}
            >
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--color-primary)', marginBottom: '8px' }}>
                Tất cả bài tập đã được ôn luyện xong!
              </h3>
              <p style={{ color: 'var(--color-secondary)', fontSize: '0.95rem' }}>
                Hôm nay bạn không có bài nào quá hạn hoặc cần ôn tập. Hãy tiếp tục giải thêm bài mới!
              </p>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                style={{ marginTop: '16px' }}
                onClick={() => handleTabChange('neetcode-all')}
              >
                Xem danh sách 150 bài
              </button>
            </div>
          ) : (
            <NeetCodeProblemList
              problems={dueProblems}
              showTopicColumn={true}
              onProgressUpdated={fetchSrsData}
            />
          )}
        </div>
      )}

      {/* VIEW 4: Calendar SRS Schedule */}
      {activeTrack === 'dsa' && activeMainView === 'calendar' && (
        <div>
          <div style={{ marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-display)', marginBottom: '4px' }}>
              Lịch Ôn Tập SRS (Spaced Repetition)
            </h2>
            <p style={{ color: 'var(--color-secondary)', fontSize: '0.92rem' }}>
              Theo dõi và quản lý lịch trình ôn tập các bài toán NeetCode 150 theo từng ngày.
            </p>
          </div>
          <SrsCalendarView
            srsProgress={srsProgress}
            onProgressUpdated={fetchSrsData}
          />
        </div>
      )}

      {/* Note Modal from Search results */}
      {selectedNote && (
        <NoteModal
          isOpen={Boolean(selectedNote)}
          entry={selectedNote.entry}
          topicId={selectedNote.topicId}
          onClose={() => setSelectedNote(null)}
          onNoteChange={() => refreshNotesMap()}
        />
      )}

      {/* Reminder Settings Modal */}
      <ReminderSettingsModal
        isOpen={isReminderModalOpen}
        onClose={() => setIsReminderModalOpen(false)}
        shortcutsEnabled={shortcutsEnabled}
        onToggleShortcuts={setShortcutsEnabled}
      />
    </main>
  );
}
