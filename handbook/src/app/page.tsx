'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import TreeGraph from '@/components/TreeGraph';
import SearchBar from '@/components/SearchBar';
import TopicFilter from '@/components/TopicFilter';
import FormattedText from '@/components/FormattedText';
import NoteModal, { getNoteStorageKey } from '@/components/NoteModal';
import NeetCodeProblemList from '@/components/NeetCodeProblemList';
import ReminderSettingsModal from '@/components/ReminderSettingsModal';
import { Entry } from '@/components/FunctionTable';
import { ALL_NEETCODE_PROBLEMS } from '@/lib/neetcodeData';
import { SrsProgressMap, SRS } from '@/lib/srs';

interface SearchResultGroup {
  topicId: string;
  topicName: string;
  entries: Entry[];
}

export default function HomePage() {
  const [activeMainView, setActiveMainView] = useState<'roadmap' | 'neetcode-all' | 'neetcode-due'>('roadmap');
  const [query, setQuery] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [results, setResults] = useState<SearchResultGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedNote, setSelectedNote] = useState<{ entry: Entry; topicId: string } | null>(null);
  const [notesMap, setNotesMap] = useState<Record<string, boolean>>({});
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);

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
      <div className="tree-page-intro" style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1>Java DSA & NeetCode 150 Platform</h1>
          <p>Lộ trình DSA, cẩm nang tra cứu cú pháp Java và hệ thống ôn tập lặp lại ngắt quãng (Spaced Repetition).</p>
        </div>
        <button
          type="button"
          onClick={() => setIsReminderModalOpen(true)}
          className="btn btn-secondary btn-sm"
          title="Cài đặt thông báo nhắc nhở desktop"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.85rem',
            padding: '6px 12px',
            borderRadius: '4px',
            fontWeight: 500,
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          <span>Nhắc nhở Desktop</span>
        </button>
      </div>

      {/* Due Banner if problems are due */}
      {srsStats.due > 0 && activeMainView !== 'neetcode-due' && (
        <div className="due-banner">
          <div className="due-banner-text">
            <h3>Lịch ôn tập hôm nay ({srsStats.due} bài đến hạn)</h3>
            <p>
              Bạn có <strong>{srsStats.due}</strong> bài toán DSA cần ôn tập lại hôm nay theo chu kỳ Spaced Repetition để củng cố trí nhớ dài hạn.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setActiveMainView('neetcode-due')}
          >
            Bắt đầu ôn tập ngay
          </button>
        </div>
      )}

      {/* Main View Navigation Tabs */}
      <div className="topic-tabs-nav" style={{ marginTop: '12px', marginBottom: '20px' }}>
        <button
          type="button"
          className={`topic-tab-item ${activeMainView === 'roadmap' ? 'active' : ''}`}
          onClick={() => setActiveMainView('roadmap')}
        >
          <span>Roadmap & Cú pháp</span>
        </button>

        <button
          type="button"
          className={`topic-tab-item ${activeMainView === 'neetcode-all' ? 'active' : ''}`}
          onClick={() => setActiveMainView('neetcode-all')}
        >
          <span>NeetCode 150 (Tất cả)</span>
          <span className="tab-count-badge">{srsStats.mastered} / {srsStats.total}</span>
        </button>

        <button
          type="button"
          className={`topic-tab-item ${activeMainView === 'neetcode-due' ? 'active' : ''}`}
          onClick={() => setActiveMainView('neetcode-due')}
        >
          <span>Ôn tập hôm nay</span>
          {srsStats.due > 0 ? (
            <span
              className="tab-count-badge"
              style={{ background: '#990f3d', color: '#ffffff', fontWeight: 700 }}
            >
              {srsStats.due}
            </span>
          ) : (
            <span className="tab-count-badge">0</span>
          )}
        </button>
      </div>

      {/* VIEW 1: Roadmap & Syntax search */}
      {activeMainView === 'roadmap' && (
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
      {activeMainView === 'neetcode-all' && (
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
      {activeMainView === 'neetcode-due' && (
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
                onClick={() => setActiveMainView('neetcode-all')}
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
      />
    </main>
  );
}
