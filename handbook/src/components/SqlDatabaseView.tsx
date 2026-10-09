'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  SQL_THEORY_TOPICS,
  LEETCODE_TOP_SQL_50,
  SQL_CITATIONS,
  SqlTheoryTopic,
  SqlProblem,
  SqlStatus,
  getSqlStatusKey,
} from '@/lib/sqlDatabaseData';
import CodeBlock from '@/components/CodeBlock';
import TabsNav from '@/components/TabsNav';
import SqlSolutionModal from '@/components/SqlSolutionModal';
import { useAutoDropdownPosition } from '@/lib/useAutoDropdownPosition';

export default function SqlDatabaseView() {
  const [subTab, setSubTab] = useState<'top50' | 'theory'>('top50');
  const [statuses, setStatuses] = useState<Record<string, SqlStatus>>({});
  const [selectedTheoryId, setSelectedTheoryId] = useState<string>(SQL_THEORY_TOPICS[0].id);
  const [modalProblem, setModalProblem] = useState<SqlProblem | null>(null);

  // States for Theory
  const [theoryNotes, setTheoryNotes] = useState<Record<string, string>>({});
  const [saveNoteSuccess, setSaveNoteSuccess] = useState<boolean>(false);
  const [openQaIndex, setOpenQaIndex] = useState<number | null>(null);

  // States for Citations
  const [citationFilter, setCitationFilter] = useState<string>('all');

  // Filters for Top SQL 50
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Accordion expanded state
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);
  const autoDropdownRef = useAutoDropdownPosition();

  // Load statuses and notes from LocalStorage
  useEffect(() => {
    const loaded: Record<string, SqlStatus> = {};
    const loadedNotes: Record<string, string> = {};

    for (const p of LEETCODE_TOP_SQL_50) {
      const s = localStorage.getItem(getSqlStatusKey(p.id)) as SqlStatus | null;
      loaded[p.id] = s || 'not-started';
    }
    for (const t of SQL_THEORY_TOPICS) {
      const s = localStorage.getItem(getSqlStatusKey(t.id)) as SqlStatus | null;
      loaded[t.id] = s || 'not-started';

      const n = localStorage.getItem(`sql_theory_note_${t.id}`);
      if (n) loadedNotes[t.id] = n;
    }
    setStatuses(loaded);
    setTheoryNotes(loadedNotes);

    // Initialize all categories as expanded by default
    const initExpanded: Record<string, boolean> = {};
    for (const p of LEETCODE_TOP_SQL_50) {
      initExpanded[p.category] = true;
    }
    setExpandedCategories(initExpanded);
  }, []);

  // Close dropdown on outside click
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

  const handleStatusChange = useCallback((id: string, newStatus: SqlStatus) => {
    setStatuses((prev) => {
      const updated = { ...prev, [id]: newStatus };
      try {
        localStorage.setItem(getSqlStatusKey(id), newStatus);
      } catch {
        // ignore
      }
      return updated;
    });
  }, []);

  const handleNoteChange = (theoryId: string, val: string) => {
    setTheoryNotes((prev) => ({ ...prev, [theoryId]: val }));
    try {
      localStorage.setItem(`sql_theory_note_${theoryId}`, val);
      setSaveNoteSuccess(true);
      setTimeout(() => setSaveNoteSuccess(false), 2000);
    } catch {
      // ignore
    }
  };

  // Stats
  const top50Done = LEETCODE_TOP_SQL_50.filter((p) => statuses[p.id] === 'done').length;
  const top50InProgress = LEETCODE_TOP_SQL_50.filter((p) => statuses[p.id] === 'in-progress').length;
  const top50NotStarted = LEETCODE_TOP_SQL_50.length - top50Done - top50InProgress;
  const top50Percent = Math.round((top50Done / LEETCODE_TOP_SQL_50.length) * 100);

  const theoryDone = SQL_THEORY_TOPICS.filter((t) => statuses[t.id] === 'done').length;

  // Categories list
  const categories = useMemo(() => {
    const cats: string[] = [];
    for (const p of LEETCODE_TOP_SQL_50) {
      if (!cats.includes(p.category)) cats.push(p.category);
    }
    return cats;
  }, []);

  // Filtered problems
  const filteredProblems = useMemo(() => {
    return LEETCODE_TOP_SQL_50.filter((p) => {
      const matchCat = categoryFilter === 'all' || p.category === categoryFilter;
      const matchDiff = difficultyFilter === 'all' || p.difficulty === difficultyFilter;
      const matchStatus =
        statusFilter === 'all' ||
        (statuses[p.id] || 'not-started') === statusFilter;
      const matchQuery =
        !searchQuery.trim() ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.leetcodeId.toString().includes(searchQuery.trim()) ||
        p.summary.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchDiff && matchStatus && matchQuery;
    });
  }, [searchQuery, difficultyFilter, statusFilter, categoryFilter, statuses]);

  // Grouped problems by category
  const groupedProblems = useMemo(() => {
    const map = new Map<string, SqlProblem[]>();
    for (const p of filteredProblems) {
      if (!map.has(p.category)) {
        map.set(p.category, []);
      }
      map.get(p.category)!.push(p);
    }
    return Array.from(map.entries()).map(([cat, list]) => ({
      category: cat,
      list,
    }));
  }, [filteredProblems]);

  const toggleCategory = (cat: string) => {
    setExpandedCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  const handleExpandAll = () => {
    const expanded: Record<string, boolean> = {};
    for (const cat of categories) expanded[cat] = true;
    setExpandedCategories(expanded);
  };

  const handleCollapseAll = () => {
    setExpandedCategories({});
  };

  const selectedTheory = SQL_THEORY_TOPICS.find((t) => t.id === selectedTheoryId) ?? SQL_THEORY_TOPICS[0];

  // Reset QA accordion on topic change
  useEffect(() => {
    setOpenQaIndex(null);
  }, [selectedTheoryId]);

  return (
    <div>
      {/* Header — Financial Times Style */}
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-display)', marginBottom: '4px', color: 'var(--color-primary)' }}>
          SQL & Cơ Sở Dữ Liệu Quan Hệ (RDBMS)
        </h2>
        <p style={{ color: 'var(--color-secondary)', fontSize: '0.92rem', margin: 0, fontFamily: 'var(--font-body)' }}>
          Hệ thống câu hỏi LeetCode Top SQL 50, kiến trúc B-Tree Index, các mức độ cô lập giao dịch ACID và chuẩn hóa cơ sở dữ liệu thực chiến.
        </p>
      </div>

      {/* Tabs Navigation */}
      <TabsNav<'top50' | 'theory'>
        activeTab={subTab}
        onChange={(tab) => setSubTab(tab)}
        tabs={[
          {
            id: 'top50',
            label: 'LeetCode Top SQL 50',
            badge: `${top50Done}/${LEETCODE_TOP_SQL_50.length}`,
            badgeStyle: top50Done > 0 ? { background: '#990f3d', color: '#ffffff', fontWeight: 700 } : undefined,
          },
          {
            id: 'theory',
            label: 'Lý Thuyết RDBMS & Index',
            badge: `${theoryDone}/${SQL_THEORY_TOPICS.length}`,
          },
        ]}
        style={{ marginBottom: '20px' }}
      />

      {/* ============================================================ */}
      {/* TAB 1: LEETCODE TOP SQL 50 (COPIED EXACT DESIGN OF JAVA 150) */}
      {/* ============================================================ */}
      {subTab === 'top50' && (
        <div className="neetcode-problem-section">
          {/* Quick Stats Bar */}
          <div className="srs-summary-strip">
            <div className="srs-stat-pill">
              <span className="srs-pill-label">Tổng bài:</span>
              <span className="srs-pill-value">{LEETCODE_TOP_SQL_50.length}</span>
            </div>
            <div className="srs-stat-pill">
              <span className="srs-pill-label">Đã hoàn thành:</span>
              <span className="srs-pill-value">{top50Done} ({top50Percent}%)</span>
            </div>
            <div className="srs-stat-pill">
              <span className="srs-pill-label">Đang làm:</span>
              <span className="srs-pill-value">{top50InProgress}</span>
            </div>
            <div className="srs-stat-pill">
              <span className="srs-pill-label">Chưa làm:</span>
              <span className="srs-pill-value">{top50NotStarted}</span>
            </div>
          </div>

          {/* Controls Bar: Search & Filter Pills */}
          <div className="neetcode-controls-bar">
            {/* Search Input */}
            <div className="neetcode-search-box">
              <input
                type="text"
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm bài tập SQL LeetCode Top 50..."
                style={{ width: '100%' }}
              />
            </div>

            {/* Filter Pills Group */}
            <div className="neetcode-filter-group">
              {/* Difficulty Filter */}
              <div className="filter-pill-container">
                <span className="filter-label">Độ khó:</span>
                {(['all', 'Easy', 'Medium', 'Hard'] as const).map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    className={`filter-pill ${difficultyFilter === diff ? 'active' : ''}`}
                    onClick={() => setDifficultyFilter(diff)}
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
                  { id: 'done', label: 'Đã xong' },
                  { id: 'in-progress', label: 'Đang làm' },
                  { id: 'not-started', label: 'Chưa làm' },
                ].map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    className={`filter-pill ${statusFilter === st.id ? 'active' : ''}`}
                    onClick={() => setStatusFilter(st.id)}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter Pills */}
            <div style={{ marginTop: '4px' }}>
              <div className="filter-pill-container" style={{ gap: '6px' }}>
                <span className="filter-label">Danh mục:</span>
                <button
                  type="button"
                  className={`filter-pill ${categoryFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setCategoryFilter('all')}
                >
                  Tất cả
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`filter-pill ${categoryFilter === cat ? 'active' : ''}`}
                    onClick={() => setCategoryFilter(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Grouped Accordion / Table */}
          {filteredProblems.length === 0 ? (
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
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
              {/* Expand / Collapse all buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginBottom: '4px' }}>
                <button
                  type="button"
                  onClick={handleExpandAll}
                  className="btn btn-ghost btn-sm"
                  style={{ fontSize: '0.78rem', padding: '3px 10px' }}
                >
                  Mở tất cả các nhóm
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
                const isExpanded = Boolean(expandedCategories[group.category]) || Boolean(searchQuery.trim());
                const categoryDoneCount = group.list.filter((p) => statuses[p.id] === 'done').length;

                return (
                  <div
                    key={group.category}
                    style={{
                      backgroundColor: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '4px',
                    }}
                  >
                    {/* Category Header */}
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
                      onClick={() => toggleCategory(group.category)}
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
                          {group.category}
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
                          {categoryDoneCount}/{group.list.length} đã hoàn thành
                        </span>
                      </div>
                    </div>

                    {/* Table for this Category */}
                    {isExpanded && (
                      <div className="table-responsive-wrapper">
                        <table className="problem-table">
                          <thead>
                            <tr>
                              <th style={{ width: '54px', textAlign: 'center' }}>Đã làm</th>
                              <th style={{ width: '60px', textAlign: 'center' }}>#</th>
                              <th>Tên bài tập SQL</th>
                              <th style={{ width: '90px' }}>Độ khó</th>
                              <th style={{ width: '180px' }}>Trạng thái</th>
                              <th style={{ width: '56px', textAlign: 'center' }}>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {group.list.map((problem) => {
                              const status = statuses[problem.id] || 'not-started';
                              const isDropdownOpen = openActionMenuId === problem.id;

                              return (
                                <tr
                                  key={problem.id}
                                  className={`problem-row ${status === 'done' ? 'row-mastered' : ''}`}
                                >
                                  {/* Checkbox Done */}
                                  <td
                                    style={{ textAlign: 'center', cursor: 'pointer' }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleStatusChange(
                                        problem.id,
                                        status === 'done' ? 'not-started' : 'done'
                                      );
                                    }}
                                    title="Bấm để đánh dấu hoàn thành"
                                  >
                                    <input
                                      type="checkbox"
                                      className="srs-checkbox"
                                      checked={status === 'done'}
                                      onChange={() => {
                                        handleStatusChange(
                                          problem.id,
                                          status === 'done' ? 'not-started' : 'done'
                                        );
                                      }}
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                  </td>

                                  {/* LeetCode #ID */}
                                  <td
                                    style={{
                                      textAlign: 'center',
                                      fontFamily: 'var(--font-mono)',
                                      fontSize: '0.8rem',
                                      color: 'var(--color-secondary)',
                                      fontWeight: 600,
                                    }}
                                  >
                                    #{problem.leetcodeId}
                                  </td>

                                  {/* Problem Title & External Link */}
                                  <td>
                                    <div className="problem-title-cell">
                                      <button
                                        type="button"
                                        className="problem-name-btn"
                                        onClick={() => setModalProblem(problem)}
                                        style={{ textAlign: 'left' }}
                                      >
                                        {problem.title}
                                      </button>
                                      <div className="problem-external-links">
                                        <a
                                          href={problem.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="ext-link-tag"
                                          title="Mở đề trên LeetCode"
                                        >
                                          LeetCode
                                        </a>
                                      </div>
                                    </div>
                                  </td>

                                  {/* Difficulty */}
                                  <td>
                                    <span className={`diff-badge diff-${problem.difficulty.toLowerCase()}`}>
                                      {problem.difficulty}
                                    </span>
                                  </td>

                                  {/* Status Pill */}
                                  <td>
                                    {status === 'done' ? (
                                      <div className="srs-status-pill status-mastered">
                                        <span>Đã hoàn thành</span>
                                      </div>
                                    ) : status === 'in-progress' ? (
                                      <div className="srs-status-pill status-due">
                                        <span>Đang làm</span>
                                      </div>
                                    ) : (
                                      <div className="srs-status-pill status-new">
                                        <span>Chưa làm</span>
                                      </div>
                                    )}
                                  </td>

                                  {/* Action Kebab Menu */}
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
                                        <div className="action-dropdown-menu" ref={autoDropdownRef}>
                                          <button
                                            type="button"
                                            className="action-menu-item"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setOpenActionMenuId(null);
                                              setModalProblem(problem);
                                            }}
                                          >
                                            Xem lời giải SQL
                                          </button>

                                          <button
                                            type="button"
                                            className="action-menu-item"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setOpenActionMenuId(null);
                                              handleStatusChange(problem.id, 'done');
                                            }}
                                          >
                                            Đã hoàn thành
                                          </button>

                                          <button
                                            type="button"
                                            className="action-menu-item"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setOpenActionMenuId(null);
                                              handleStatusChange(problem.id, 'in-progress');
                                            }}
                                          >
                                            Đang làm
                                          </button>

                                          <button
                                            type="button"
                                            className="action-menu-item"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setOpenActionMenuId(null);
                                              handleStatusChange(problem.id, 'not-started');
                                            }}
                                          >
                                            Đặt lại
                                          </button>

                                          <a
                                            href={problem.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="action-menu-item"
                                            onClick={() => setOpenActionMenuId(null)}
                                          >
                                            Mở trên LeetCode ↗
                                          </a>
                                        </div>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Modal Solution Viewer */}
          <SqlSolutionModal
            problem={modalProblem}
            isOpen={Boolean(modalProblem)}
            onClose={() => setModalProblem(null)}
            status={modalProblem ? statuses[modalProblem.id] || 'not-started' : 'not-started'}
            onStatusChange={(newSt) => {
              if (modalProblem) handleStatusChange(modalProblem.id, newSt);
            }}
          />
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 2: THEORY (FOLLOW 100% SYSTEM DESIGN VIEW PATTERN) */}
      {/* ============================================================ */}
      {subTab === 'theory' && (
        <div>
          <div className="track-layout-grid system-design-layout-grid">
          {/* LEFT SIDEBAR: Mục lục chủ đề */}
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
              Mục lục Chủ đề
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {SQL_THEORY_TOPICS.map((topic) => {
                const isTopicActive = topic.id === selectedTheoryId;
                const status = statuses[topic.id] || 'not-started';

                return (
                  <div
                    key={topic.id}
                    onClick={() => {
                      setSelectedTheoryId(topic.id);
                      setOpenQaIndex(null);
                    }}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      backgroundColor: isTopicActive ? 'rgba(153, 15, 61, 0.08)' : 'transparent',
                      border: isTopicActive ? '1px solid rgba(153, 15, 61, 0.2)' : '1px solid transparent',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          color: isTopicActive ? '#990f3d' : 'var(--color-secondary)',
                          textTransform: 'uppercase',
                          fontFamily: 'var(--font-label)',
                        }}
                      >
                        Chủ đề #{topic.order}
                      </span>
                      <span
                        style={{
                          fontSize: '0.74rem',
                          fontWeight: 600,
                          color: status === 'done' ? '#059669' : status === 'in-progress' ? 'var(--color-tertiary)' : 'var(--color-secondary)',
                          fontFamily: 'var(--font-label)',
                        }}
                      >
                        {status === 'done' ? 'Đã nắm' : status === 'in-progress' ? 'Đang học' : 'Chưa học'}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: '0.88rem',
                        fontWeight: isTopicActive ? 700 : 600,
                        color: isTopicActive ? '#990f3d' : 'var(--color-primary)',
                        lineHeight: '1.35',
                      }}
                    >
                      {topic.title}
                    </div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--color-secondary)' }}>
                      {topic.englishTitle}
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
                  Chủ đề #{selectedTheory.order}
                </span>
                <h3
                  style={{
                    fontSize: '1.4rem',
                    fontFamily: 'var(--font-display)',
                    margin: '4px 0 2px',
                    color: 'var(--color-primary)',
                  }}
                >
                  {selectedTheory.title}
                </h3>
                <p style={{ color: 'var(--color-secondary)', fontSize: '0.92rem', fontStyle: 'italic', margin: 0, fontFamily: 'var(--font-body)' }}>
                  {selectedTheory.summary}
                </p>
              </div>

              {/* Status Combobox */}
              <div className="status-combobox-wrapper">
                <label htmlFor={`theory-status-${selectedTheory.id}`} className="status-combobox-label">
                  Trạng thái:
                </label>
                <select
                  id={`theory-status-${selectedTheory.id}`}
                  className="status-combobox"
                  value={statuses[selectedTheory.id] || 'not-started'}
                  onChange={(e) => handleStatusChange(selectedTheory.id, e.target.value as SqlStatus)}
                >
                  <option value="not-started">Chưa học</option>
                  <option value="in-progress">Đang học</option>
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
                {selectedTheory.citation.url && (
                  <a
                    href={selectedTheory.citation.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: '0.76rem', color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'underline' }}
                  >
                    Tài liệu gốc ↗
                  </a>
                )}
              </div>
              <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--color-primary)', fontFamily: 'var(--font-display)' }}>
                {selectedTheory.citation.source} — {selectedTheory.citation.author}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-secondary)', fontFamily: 'var(--font-mono)' }}>
                {selectedTheory.citation.itemOrChapter}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-primary)', fontStyle: 'italic', marginTop: '4px', lineHeight: '1.5' }}>
                "{selectedTheory.citation.keyTakeaway}"
              </div>
            </div>

            {/* Core Points */}
            <div>
              <h4
                style={{
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  color: 'var(--color-primary)',
                  marginBottom: '8px',
                  fontFamily: 'var(--font-display)',
                }}
              >
                Khái niệm & Bản chất kỹ thuật
              </h4>
              <ul style={{ paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedTheory.corePoints.map((pt, i) => (
                  <li key={i} style={{ fontSize: '0.9rem', color: 'var(--color-primary)', lineHeight: '1.6', fontFamily: 'var(--font-body)' }}>
                    {pt}
                  </li>
                ))}
              </ul>
            </div>

            {/* SQL Code Example */}
            <div>
              <h4
                style={{
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  color: 'var(--color-primary)',
                  marginBottom: '8px',
                  fontFamily: 'var(--font-display)',
                }}
              >
                Ví dụ truy vấn thực chiến: {selectedTheory.sqlExample.title}
              </h4>
              <CodeBlock code={selectedTheory.sqlExample.query} filename="query.sql" />
              <div
                style={{
                  marginTop: '8px',
                  padding: '10px 14px',
                  backgroundColor: 'var(--color-neutral)',
                  borderRadius: 'var(--rounded-md, 2px)',
                  fontSize: '0.88rem',
                  color: 'var(--color-primary)',
                  lineHeight: '1.55',
                }}
              >
                <strong>Giải thích:</strong> {selectedTheory.sqlExample.explanation}
              </div>
            </div>

            {/* Interview Q&A Accordion */}
            {selectedTheory.interviewQA.length > 0 && (
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
                  {selectedTheory.interviewQA.map((qa, qIdx) => {
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
                              color: 'var(--color-primary)',
                            }}
                          >
                            <strong>Giải thích:</strong> {qa.answer}
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
                  htmlFor={`sql-theory-note-${selectedTheory.id}`}
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
                id={`sql-theory-note-${selectedTheory.id}`}
                rows={4}
                value={theoryNotes[selectedTheory.id] || ''}
                onChange={(e) => handleNoteChange(selectedTheory.id, e.target.value)}
                placeholder="Nhập ghi chú cá nhân, các truy vấn phức tạp, lưu ý phỏng vấn RDBMS..."
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
              Tổng hợp sách giáo trình đại học chuẩn mực, nghiên cứu của chuyên gia hiệu năng cơ sở dữ liệu và hệ thống bài tập phỏng vấn LeetCode.
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
            <strong>Định hướng Học tập & Phỏng vấn:</strong> Luyện tập thuần thục <strong>LeetCode Top SQL 50</strong> giúp phản xạ viết câu lệnh chính xác khi live coding, kết hợp hiểu sâu <em>B-Tree Indexing (Use The Index, Luke!)</em> và <em>ACID Transactions (DDIA)</em> giúp bạn ghi điểm tuyệt đối ở các câu hỏi tối ưu hóa và tranh chấp dữ liệu phân tán.
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '18px' }}>
            {[
              { id: 'all', label: 'Tất cả' },
              { id: 'Study Plan', label: 'Luyện đề' },
              { id: 'Performance Authority', label: 'Tối ưu Index' },
              { id: 'Book', label: 'Sách' },
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
            {SQL_CITATIONS.filter(
              (c) => citationFilter === 'all' || c.type === citationFilter
            ).map((item, idx) => (
              <div
                key={idx}
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
                    {item.type || 'Resource'}
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
                    {item.source} &#8599;
                  </a>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-secondary)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                    {item.itemOrChapter}
                  </div>
                </div>

                {/* Description */}
                {item.description && (
                  <p style={{ fontSize: '0.84rem', color: 'var(--color-secondary)', margin: 0, lineHeight: 1.5, flex: 1 }}>
                    {item.description}
                  </p>
                )}

                {/* Highlights */}
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
      )}
    </div>
  );
}
