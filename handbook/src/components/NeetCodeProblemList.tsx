'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { NeetCodeProblem, NEETCODE_TOPICS } from '@/lib/neetcodeData';
import { SrsProgressMap, SrsProgressItem, SRS } from '@/lib/srs';
import SrsConfirmModal from './SrsConfirmModal';
import JavaCodeViewerModal from './JavaCodeViewerModal';
import ProblemNoteModal from './ProblemNoteModal';

interface Props {
  problems: NeetCodeProblem[];
  topicId?: string;
  onProgressUpdated?: () => void;
  showTopicColumn?: boolean;
  groupByTopicDefault?: boolean;
}

export default function NeetCodeProblemList({
  problems,
  topicId,
  onProgressUpdated,
  groupByTopicDefault = true,
}: Props) {
  const [progressMap, setProgressMap] = useState<SrsProgressMap>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedTopicNodes, setSelectedTopicNodes] = useState<string[]>([]);
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});

  // Modals state
  const [selectedProblemForReview, setSelectedProblemForReview] = useState<NeetCodeProblem | null>(null);
  const [selectedProblemForNote, setSelectedProblemForNote] = useState<NeetCodeProblem | null>(null);
  const [selectedProblemForCode, setSelectedProblemForCode] = useState<NeetCodeProblem | null>(null);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Fetch SRS progress from API & LocalStorage
  const fetchProgress = useCallback(async () => {
    try {
      const res = await fetch('/api/srs');
      if (res.ok) {
        const data = await res.json();
        setProgressMap(data || {});
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
          setProgressMap(JSON.parse(cached));
        } catch {
          // ignore
        }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (!target.closest('.action-dropdown-wrap')) {
        setOpenActionMenuId(null);
      }
    }
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  // Save updated progress item
  const handleSaveProgress = async (
    problem: NeetCodeProblem,
    rating: 'easy' | 'medium' | 'hard' | 'again',
    note: string
  ) => {
    const current = progressMap[problem.id];
    const updatedItem = SRS.calculateNextReview(current, rating, note);
    updatedItem.id = problem.id;

    const newMap: SrsProgressMap = {
      ...progressMap,
      [problem.id]: updatedItem,
    };

    setProgressMap(newMap);
    setSelectedProblemForReview(null);

    try {
      localStorage.setItem('srs_progress_cache', JSON.stringify(newMap));
      await fetch('/api/srs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [problem.id]: updatedItem }),
      });
      showToast(`Đã lưu tiến độ "${problem.name}" (Ôn lại sau ${updatedItem.interval} ngày)`);
      if (onProgressUpdated) onProgressUpdated();
    } catch (err) {
      console.error('Failed to sync progress:', err);
      showToast('Đã lưu cục bộ');
    }
  };

  // Save only note without altering review intervals or repetitions
  const handleSaveNoteOnly = async (problem: NeetCodeProblem, note: string) => {
    const current = progressMap[problem.id];
    const updatedItem: SrsProgressItem = {
      id: problem.id,
      status: current?.status || 'new',
      lastSolved: current?.lastSolved,
      lastRating: current?.lastRating,
      nextReview: current?.nextReview,
      interval: current?.interval,
      easeFactor: current?.easeFactor,
      repetitions: current?.repetitions,
      note,
      updatedAt: Date.now(),
    };

    const newMap: SrsProgressMap = {
      ...progressMap,
      [problem.id]: updatedItem,
    };

    setProgressMap(newMap);
    setSelectedProblemForNote(null);
    setSelectedProblemForReview(null);

    try {
      localStorage.setItem('srs_progress_cache', JSON.stringify(newMap));
      await fetch('/api/srs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [problem.id]: updatedItem }),
      });
      showToast(`Đã cập nhật ghi chú cho bài "${problem.name}"`);
      if (onProgressUpdated) onProgressUpdated();
    } catch (err) {
      console.error('Failed to sync note:', err);
      showToast('Đã lưu ghi chú cục bộ');
    }
  };

  // Reset a problem progress
  const handleResetProgress = async (problem: NeetCodeProblem) => {
    setOpenActionMenuId(null);
    if (!confirm(`Bạn có chắc muốn đặt lại toàn bộ tiến độ cho bài "${problem.name}"?`)) {
      return;
    }

    const newMap = { ...progressMap };
    delete newMap[problem.id];
    setProgressMap(newMap);

    try {
      localStorage.setItem('srs_progress_cache', JSON.stringify(newMap));
      await fetch('/api/srs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          [problem.id]: {
            id: problem.id,
            status: 'new',
            interval: 0,
            repetitions: 0,
            updatedAt: Date.now(),
          },
        }),
      });
      showToast(`Đã đặt lại tiến độ bài "${problem.name}"`);
      if (onProgressUpdated) onProgressUpdated();
    } catch (err) {
      console.error('Failed to reset progress:', err);
    }
  };

  // Mark as Due immediately
  const handleMarkDueNow = async (problem: NeetCodeProblem) => {
    setOpenActionMenuId(null);
    const todayStr = SRS.getTodayStr();
    const current = progressMap[problem.id] || {
      id: problem.id,
      status: 'mastered',
      easeFactor: SRS.DEFAULT_EASE_FACTOR,
      repetitions: 1,
    };

    const updatedItem: SrsProgressItem = {
      ...current,
      id: problem.id,
      status: 'mastered',
      nextReview: todayStr,
      interval: 0,
      updatedAt: Date.now(),
    };

    const newMap = { ...progressMap, [problem.id]: updatedItem };
    setProgressMap(newMap);

    try {
      localStorage.setItem('srs_progress_cache', JSON.stringify(newMap));
      await fetch('/api/srs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [problem.id]: updatedItem }),
      });
      showToast(`Đã đưa bài "${problem.name}" vào danh sách cần ôn tập hôm nay`);
      if (onProgressUpdated) onProgressUpdated();
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle node expand/collapse state (Default is CLOSED)
  const toggleNodeExpand = (nodeId: string) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [nodeId]: !prev[nodeId],
    }));
  };

  const handleExpandAll = () => {
    const all: Record<string, boolean> = {};
    for (const t of NEETCODE_TOPICS) {
      all[t.topicId] = true;
    }
    setExpandedNodes(all);
  };

  const handleCollapseAll = () => {
    setExpandedNodes({});
  };

  // Filter problems
  const filteredProblems = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return problems.filter((problem) => {
      // Search filter
      if (q) {
        const matchesName = problem.name.toLowerCase().includes(q);
        const matchesTopic = problem.topicName.toLowerCase().includes(q);
        if (!matchesName && !matchesTopic) return false;
      }

      // Topic Nodes multi-selection filter
      if (selectedTopicNodes.length > 0) {
        const pTopicId = problem.topicId.toLowerCase();
        const pTopicName = problem.topicName.toLowerCase();
        const matchesNode = selectedTopicNodes.some(
          (node) => pTopicId === node || pTopicName.includes(node)
        );
        if (!matchesNode) return false;
      }

      // Difficulty filter
      if (selectedDifficulty !== 'all' && problem.difficulty !== selectedDifficulty) {
        return false;
      }

      // Status filter
      const item = progressMap[problem.id];
      const isDue = SRS.isDue(item);
      const isMastered = item?.status === 'mastered' && !isDue;
      const isNew = !item || item.status === 'new' || (!item.lastSolved && !isDue && !isMastered);

      if (selectedStatus === 'due' && !isDue) return false;
      if (selectedStatus === 'mastered' && !isMastered) return false;
      if (selectedStatus === 'new' && !isNew) return false;

      return true;
    });
  }, [problems, searchQuery, selectedTopicNodes, selectedDifficulty, selectedStatus, progressMap]);

  // Group problems by topic node
  const groupedProblems = useMemo(() => {
    const map = new Map<string, { topicId: string; topicName: string; list: NeetCodeProblem[] }>();

    for (const p of filteredProblems) {
      if (!map.has(p.topicId)) {
        map.set(p.topicId, {
          topicId: p.topicId,
          topicName: p.topicName,
          list: [],
        });
      }
      map.get(p.topicId)!.list.push(p);
    }

    return Array.from(map.values());
  }, [filteredProblems]);

  // Dynamic statistics
  const stats = useMemo(() => {
    let dueCount = 0;
    let masteredCount = 0;
    for (const p of problems) {
      const item = progressMap[p.id];
      if (SRS.isDue(item)) {
        dueCount++;
      } else if (item?.status === 'mastered') {
        masteredCount++;
      }
    }
    return {
      total: problems.length,
      due: dueCount,
      mastered: masteredCount,
      new: problems.length - dueCount - masteredCount,
    };
  }, [problems, progressMap]);

  // Available topic node list for quick filter
  const allTopicNodes = useMemo(() => {
    return NEETCODE_TOPICS.map((t) => ({ id: t.topicId, name: t.topicName }));
  }, []);

  const shouldGroupByNode = !topicId && groupByTopicDefault;

  return (
    <div className="neetcode-problem-section">
      {/* Toast Notification */}
      {toastMessage && <div className="toast-notification">{toastMessage}</div>}

      {/* SRS Quick Stats Bar */}
      <div className="srs-summary-strip">
        <div className="srs-stat-pill">
          <span className="srs-pill-label">Tổng bài:</span>
          <span className="srs-pill-value">{stats.total}</span>
        </div>
        <div className={`srs-stat-pill ${stats.due > 0 ? 'highlight-due' : ''}`}>
          <span className="srs-pill-label">Cần ôn hôm nay:</span>
          <span className="srs-pill-value">{stats.due}</span>
        </div>
        <div className="srs-stat-pill">
          <span className="srs-pill-label">Đã nắm vững:</span>
          <span className="srs-pill-value">{stats.mastered}</span>
        </div>
        <div className="srs-stat-pill">
          <span className="srs-pill-label">Chưa học:</span>
          <span className="srs-pill-value">{stats.new}</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="neetcode-controls-bar">
        <div className="neetcode-search-box">
          <input
            type="text"
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm bài tập NeetCode / LeetCode..."
            style={{ width: '100%' }}
          />
        </div>

        <div className="neetcode-filter-group">
          {/* Difficulty Filter */}
          <div className="filter-pill-container">
            <span className="filter-label">Độ khó:</span>
            {(['all', 'Easy', 'Medium', 'Hard'] as const).map((diff) => (
              <button
                key={diff}
                type="button"
                className={`filter-pill ${selectedDifficulty === diff ? 'active' : ''}`}
                onClick={() => setSelectedDifficulty(diff)}
              >
                {diff === 'all' ? 'Tất cả' : diff}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="filter-pill-container">
            <span className="filter-label">Trạng thái:</span>
            {[
              { id: 'all', label: 'Tất cả' },
              { id: 'due', label: `Cần ôn (${stats.due})` },
              { id: 'mastered', label: `Đã nắm (${stats.mastered})` },
              { id: 'new', label: `Mới (${stats.new})` },
            ].map((st) => (
              <button
                key={st.id}
                type="button"
                className={`filter-pill ${selectedStatus === st.id ? 'active' : ''}`}
                onClick={() => setSelectedStatus(st.id)}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* Topic Node multi-filter pills if viewing all problems */}
        {!topicId && (
          <div style={{ marginTop: '4px' }}>
            <div className="filter-pill-container" style={{ gap: '6px' }}>
              <span className="filter-label">Lọc theo Node:</span>
              <button
                type="button"
                className={`filter-pill ${selectedTopicNodes.length === 0 ? 'active' : ''}`}
                onClick={() => setSelectedTopicNodes([])}
              >
                Tất cả các node ({NEETCODE_TOPICS.length})
              </button>
              {allTopicNodes.map((t) => {
                const isSelected = selectedTopicNodes.includes(t.id);
                return (
                  <button
                    key={t.id}
                    type="button"
                    className={`filter-pill ${isSelected ? 'active' : ''}`}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedTopicNodes((prev) => prev.filter((id) => id !== t.id));
                      } else {
                        setSelectedTopicNodes((prev) => [...prev, t.id]);
                      }
                    }}
                  >
                    {t.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Main Table / Grouped Sections */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '48px' }}>
          <span className="loading-text">Đang tải dữ liệu tiến độ...</span>
        </div>
      ) : filteredProblems.length === 0 ? (
        <div
          style={{
            padding: '40px 20px',
            textAlign: 'center',
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: '4px',
            color: 'var(--color-secondary)',
          }}
        >
          Không tìm thấy bài tập nào phù hợp với bộ lọc hiện tại.
        </div>
      ) : shouldGroupByNode ? (
        /* RENDER GROUPED BY NODE (Topic Accordion / Blocks - CLOSED BY DEFAULT) */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginBottom: '4px' }}>
            <button
              type="button"
              onClick={handleExpandAll}
              className="btn btn-ghost btn-sm"
              style={{ fontSize: '0.78rem', padding: '3px 10px' }}
            >
              Mở tất cả các Node
            </button>
            <button
              type="button"
              onClick={handleCollapseAll}
              className="btn btn-ghost btn-sm"
              style={{ fontSize: '0.78rem', padding: '3px 10px' }}
            >
              Thu gọn tất cả
            </button>
          </div>

          {groupedProblems.map((group) => {
            const isExpanded = Boolean(expandedNodes[group.topicId]) || Boolean(searchQuery.trim());
            const topicMasteredCount = group.list.filter(
              (p) => progressMap[p.id]?.status === 'mastered' && !SRS.isDue(progressMap[p.id])
            ).length;
            const topicDueCount = group.list.filter((p) => SRS.isDue(progressMap[p.id])).length;

            return (
              <div
                key={group.topicId}
                style={{
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '4px',
                }}
              >
                {/* Node Section Header */}
                <div
                  style={{
                    padding: '12px 16px',
                    backgroundColor: '#fff4e8',
                    borderBottom: isExpanded ? '1px solid var(--color-border)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    userSelect: 'none',
                  }}
                  onClick={() => toggleNodeExpand(group.topicId)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span
                      style={{
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        color: 'var(--color-tertiary)',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      {isExpanded ? '▼' : '►'}
                    </span>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: '1.05rem',
                        fontFamily: 'var(--font-display)',
                        color: 'var(--color-primary)',
                      }}
                    >
                      {group.topicName}
                    </h3>
                    <span
                      style={{
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: '10px',
                        backgroundColor: '#ede8e3',
                        color: 'var(--color-secondary)',
                      }}
                    >
                      {topicMasteredCount}/{group.list.length} đã hiểu
                    </span>
                    {topicDueCount > 0 && (
                      <span
                        style={{
                          fontSize: '0.76rem',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '10px',
                          backgroundColor: '#fef2f2',
                          color: '#b91c1c',
                          border: '1px solid #fecaca',
                        }}
                      >
                        {topicDueCount} cần ôn hôm nay
                      </span>
                    )}
                  </div>

                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Link
                      href={`/topic/${group.topicId}`}
                      className="btn btn-ghost btn-sm"
                      style={{ fontSize: '0.78rem', padding: '3px 10px' }}
                    >
                      Mở Cheatsheet Cú pháp →
                    </Link>
                  </div>
                </div>

                {/* Table for this Node */}
                {isExpanded && (
                  <div className="table-responsive-wrapper">
                    <table className="problem-table">
                      <thead>
                        <tr>
                          <th style={{ width: '48px', textAlign: 'center' }}>Đã làm</th>
                          <th style={{ width: '50px', textAlign: 'center' }}>#</th>
                          <th>Tên bài tập</th>
                          <th style={{ width: '90px' }}>Độ khó</th>
                          <th style={{ width: '220px' }}>Trạng thái Spaced Repetition</th>
                          <th style={{ width: '56px', textAlign: 'center' }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {group.list.map((problem) =>
                          renderProblemRow(problem, false)
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* RENDER FLAT TABLE (e.g. within single topic page or when filtered) */
        <div className="table-responsive-wrapper" style={{ marginTop: '12px' }}>
          <table className="problem-table">
            <thead>
              <tr>
                <th style={{ width: '48px', textAlign: 'center' }}>Đã làm</th>
                <th style={{ width: '50px', textAlign: 'center' }}>#</th>
                <th>Tên bài tập</th>
                <th style={{ width: '90px' }}>Độ khó</th>
                <th style={{ width: '220px' }}>Trạng thái Spaced Repetition</th>
                <th style={{ width: '56px', textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredProblems.map((problem) => renderProblemRow(problem, false))}
            </tbody>
          </table>
        </div>
      )}

      {/* Srs Confirmation Review Modal */}
      <SrsConfirmModal
        problem={selectedProblemForReview}
        currentProgress={selectedProblemForReview ? progressMap[selectedProblemForReview.id] : undefined}
        isOpen={Boolean(selectedProblemForReview)}
        onClose={() => setSelectedProblemForReview(null)}
        onConfirm={handleSaveProgress}
        onSaveNoteOnly={handleSaveNoteOnly}
      />

      {/* Problem Note Modal (Edit note without changing SRS schedule) */}
      <ProblemNoteModal
        problem={selectedProblemForNote}
        currentProgress={selectedProblemForNote ? progressMap[selectedProblemForNote.id] : undefined}
        isOpen={Boolean(selectedProblemForNote)}
        onClose={() => setSelectedProblemForNote(null)}
        onSaveNote={handleSaveNoteOnly}
      />

      {/* Java Source Viewer Modal */}
      <JavaCodeViewerModal
        problem={selectedProblemForCode}
        isOpen={Boolean(selectedProblemForCode)}
        onClose={() => setSelectedProblemForCode(null)}
      />
    </div>
  );

  // Helper renderer for single problem row with identical FunctionTable kebab design
  function renderProblemRow(problem: NeetCodeProblem, showTopic = false) {
    const item = progressMap[problem.id];
    const isDue = SRS.isDue(item);
    const isMastered = item?.status === 'mastered' && !isDue;
    const daysUntilDue = item?.nextReview ? SRS.getDaysUntilDue(item.nextReview) : 0;
    const isDropdownOpen = openActionMenuId === problem.id;

    return (
      <tr
        key={problem.id}
        className={`problem-row ${isDue ? 'row-due-highlight' : isMastered ? 'row-mastered' : ''}`}
      >
        {/* Checkbox Done */}
        <td
          style={{ textAlign: 'center', cursor: 'pointer' }}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedProblemForReview(problem);
          }}
          title="Bấm để đánh dấu hoàn thành & đánh giá độ hiểu"
        >
          <input
            type="checkbox"
            className="srs-checkbox"
            checked={Boolean(item?.status === 'mastered' && !isDue)}
            onChange={(e) => {
              e.stopPropagation();
              setSelectedProblemForReview(problem);
            }}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedProblemForReview(problem);
            }}
            title="Đánh dấu hoàn thành & thiết lập lịch ôn tập"
          />
        </td>

        {/* Index */}
        <td
          style={{
            textAlign: 'center',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.82rem',
            color: 'var(--color-secondary)',
          }}
        >
          {problem.index}
        </td>

        {/* Problem Name & Links */}
        <td>
          <div className="problem-title-cell">
            <button
              type="button"
              className="problem-name-btn"
              onClick={() => setSelectedProblemForReview(problem)}
            >
              {problem.name}
            </button>
            <div className="problem-external-links">
              <a
                href={problem.leetcodeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ext-link-tag"
                title="Mở trên LeetCode"
              >
                LeetCode
              </a>
              <a
                href={problem.neetcodeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ext-link-tag"
                title="Mở trên NeetCode"
              >
                NeetCode
              </a>
            </div>
            {item?.note && (
              <div
                className="problem-inline-note clickable-note"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedProblemForNote(problem);
                }}
                title="Bấm để chỉnh sửa ghi chú"
                style={{ cursor: 'pointer' }}
              >
                <strong>Ghi chú:</strong> {item.note}
              </div>
            )}
          </div>
        </td>

        {/* Topic Name if enabled */}
        {showTopic && (
          <td style={{ fontSize: '0.86rem', color: 'var(--color-secondary)' }}>
            {problem.topicName}
          </td>
        )}

        {/* Difficulty */}
        <td>
          <span className={`diff-badge diff-${problem.difficulty.toLowerCase()}`}>
            {problem.difficulty}
          </span>
        </td>

        {/* SRS Status */}
        <td>
          {isDue ? (
            <div className="srs-status-pill status-due">
              <span className="srs-due-indicator"></span>
              <span>Đến hạn ôn hôm nay</span>
            </div>
          ) : isMastered ? (
            <div className="srs-status-pill status-mastered">
              <span>
                Ôn sau {daysUntilDue} ngày ({item?.nextReview})
              </span>
              <span className="srs-meta-sub">
                Lặp {item?.repetitions || 1} lần • {item?.lastRating?.toUpperCase()}
              </span>
            </div>
          ) : (
            <div className="srs-status-pill status-new">
              <span>Chưa học</span>
            </div>
          )}
        </td>

        {/* Action Kebab Menu (Identical to FunctionTable) */}
        <td
          className="actions"
          onClick={(e) => e.stopPropagation()}
          style={{ textAlign: 'center', position: 'relative' }}
        >
          <div className="action-dropdown-wrap">
            <button
              type="button"
              className={`action-menu-trigger ${isDropdownOpen ? 'active' : ''}`}
              aria-label="Actions"
              title="Actions"
              onClick={(e) => {
                e.stopPropagation();
                setOpenActionMenuId(isDropdownOpen ? null : problem.id);
              }}
            >
              ⋮
            </button>

            {isDropdownOpen && (
              <div className="action-dropdown-menu">
                <button
                  type="button"
                  className="action-menu-item"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenActionMenuId(null);
                    setSelectedProblemForReview(problem);
                  }}
                >
                  Đánh dấu hoàn thành
                </button>

                <button
                  type="button"
                  className="action-menu-item"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenActionMenuId(null);
                    setSelectedProblemForNote(problem);
                  }}
                >
                  Chỉnh sửa ghi chú
                </button>

                <button
                  type="button"
                  className="action-menu-item"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenActionMenuId(null);
                    setSelectedProblemForCode(problem);
                  }}
                >
                  Xem lời giải Java
                </button>

                <button
                  type="button"
                  className="action-menu-item"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMarkDueNow(problem);
                  }}
                >
                  Lên lịch ôn hôm nay
                </button>

                <div
                  style={{
                    height: '1px',
                    backgroundColor: 'var(--color-border-light)',
                    margin: '4px 0',
                  }}
                />

                <a
                  href={problem.leetcodeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="action-menu-item"
                  style={{ textDecoration: 'none' }}
                  onClick={() => setOpenActionMenuId(null)}
                >
                  Mở trên LeetCode
                </a>

                <a
                  href={problem.neetcodeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="action-menu-item"
                  style={{ textDecoration: 'none' }}
                  onClick={() => setOpenActionMenuId(null)}
                >
                  Mở trên NeetCode
                </a>

                <div
                  style={{
                    height: '1px',
                    backgroundColor: 'var(--color-border-light)',
                    margin: '4px 0',
                  }}
                />

                <button
                  type="button"
                  className="action-menu-item delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleResetProgress(problem);
                  }}
                  style={{ color: '#b91c1c' }}
                >
                  Đặt lại (Chưa làm)
                </button>
              </div>
            )}
          </div>
        </td>
      </tr>
    );
  }
}
