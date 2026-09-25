'use client';

import { useState, useMemo, useEffect } from 'react';
import { ALL_NEETCODE_PROBLEMS, NeetCodeProblem } from '@/lib/neetcodeData';
import { SrsProgressMap, SRS } from '@/lib/srs';
import SrsConfirmModal from './SrsConfirmModal';
import JavaCodeViewerModal from './JavaCodeViewerModal';

interface Props {
  srsProgress: SrsProgressMap;
  onProgressUpdated?: () => void;
}

const WEEKDAYS = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];

export default function SrsCalendarView({ srsProgress, onProgressUpdated }: Props) {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [reviewProblem, setReviewProblem] = useState<NeetCodeProblem | null>(null);
  const [codeProblem, setCodeProblem] = useState<NeetCodeProblem | null>(null);
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);

  const todayStr = useMemo(() => SRS.getTodayStr(), []);

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

  // Map problems by nextReview date
  const problemsByDate = useMemo(() => {
    const map: Record<string, NeetCodeProblem[]> = {};
    for (const p of ALL_NEETCODE_PROBLEMS) {
      const item = srsProgress[p.id];
      if (item && item.status === 'mastered' && item.nextReview) {
        if (!map[item.nextReview]) {
          map[item.nextReview] = [];
        }
        map[item.nextReview].push(p);
      }
    }
    return map;
  }, [srsProgress]);

  // Tất cả các bài bị quá hạn từ các ngày trước hôm nay
  const overdueProblemsWithDate = useMemo(() => {
    const list: Array<{ problem: NeetCodeProblem; originalDate: string }> = [];
    for (const [dateStr, pList] of Object.entries(problemsByDate)) {
      if (dateStr < todayStr) {
        for (const p of pList) {
          list.push({ problem: p, originalDate: dateStr });
        }
      }
    }
    list.sort((a, b) => a.originalDate.localeCompare(b.originalDate));
    return list;
  }, [problemsByDate, todayStr]);

  // Current view Year & Month
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  // Month navigation
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleGoToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(todayStr);
  };

  // Generate calendar days matrix
  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    // Convert JS Sunday (0) to Monday-first (0 = Mon, ..., 6 = Sun)
    let startDayOfWeek = firstDayOfMonth.getDay() - 1;
    if (startDayOfWeek === -1) startDayOfWeek = 6;

    const daysInMonth = lastDayOfMonth.getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days: Array<{
      dateStr: string;
      dayNumber: number;
      isCurrentMonth: boolean;
      isToday: boolean;
      isPast: boolean;
      problems: NeetCodeProblem[];
    }> = [];

    // Previous month padding
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i;
      const prevDate = new Date(year, month - 1, d);
      const prevMonthStr = String(prevDate.getMonth() + 1).padStart(2, '0');
      const prevDayStr = String(d).padStart(2, '0');
      const dateStr = `${prevDate.getFullYear()}-${prevMonthStr}-${prevDayStr}`;
      days.push({
        dateStr,
        dayNumber: d,
        isCurrentMonth: false,
        isToday: dateStr === todayStr,
        isPast: dateStr < todayStr,
        problems: problemsByDate[dateStr] || [],
      });
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const mStr = String(month + 1).padStart(2, '0');
      const dStr = String(d).padStart(2, '0');
      const dateStr = `${year}-${mStr}-${dStr}`;
      days.push({
        dateStr,
        dayNumber: d,
        isCurrentMonth: true,
        isToday: dateStr === todayStr,
        isPast: dateStr < todayStr,
        problems: problemsByDate[dateStr] || [],
      });
    }

    // Next month padding to fill complete weeks (42 cells = 6 rows)
    const remaining = 42 - days.length;
    for (let d = 1; d <= remaining; d++) {
      const nextDate = new Date(year, month + 1, d);
      const nextMonthStr = String(nextDate.getMonth() + 1).padStart(2, '0');
      const nextDayStr = String(d).padStart(2, '0');
      const dateStr = `${nextDate.getFullYear()}-${nextMonthStr}-${nextDayStr}`;
      days.push({
        dateStr,
        dayNumber: d,
        isCurrentMonth: false,
        isToday: dateStr === todayStr,
        isPast: dateStr < todayStr,
        problems: problemsByDate[dateStr] || [],
      });
    }

    return days;
  }, [year, month, todayStr, problemsByDate]);

  // Count scheduled problems in current month
  const totalInMonth = useMemo(() => {
    return calendarDays
      .filter((d) => d.isCurrentMonth)
      .reduce((sum, d) => sum + d.problems.length, 0);
  }, [calendarDays]);

  const handleSaveProgress = async (
    problem: NeetCodeProblem,
    rating: 'easy' | 'medium' | 'hard' | 'again',
    note: string
  ) => {
    const current = srsProgress[problem.id];
    const updatedItem = SRS.calculateNextReview(current, rating, note);
    updatedItem.id = problem.id;

    try {
      await fetch('/api/srs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [problem.id]: updatedItem }),
      });
      setReviewProblem(null);
      if (onProgressUpdated) onProgressUpdated();
    } catch (err) {
      console.error('Failed to update progress from calendar:', err);
    }
  };

  const monthNames = [
    'Tháng 1',
    'Tháng 2',
    'Tháng 3',
    'Tháng 4',
    'Tháng 5',
    'Tháng 6',
    'Tháng 7',
    'Tháng 8',
    'Tháng 9',
    'Tháng 10',
    'Tháng 11',
    'Tháng 12',
  ];

  // Helper render problem row in strict Financial Times design system format
  const renderProblemCard = (problem: NeetCodeProblem, options?: { isMissed?: boolean; originalDate?: string }) => {
    const item = srsProgress[problem.id];
    const isDropdownOpen = openActionMenuId === problem.id;

    // Difficulty styling matching Financial Times editorial palette
    const diffStyle =
      problem.difficulty === 'Easy'
        ? { background: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-secondary)' }
        : problem.difficulty === 'Medium'
        ? { background: 'var(--color-neutral)', borderColor: 'var(--color-secondary)', color: 'var(--color-primary)' }
        : { background: '#fff0eb', borderColor: 'var(--color-tertiary)', color: 'var(--color-tertiary)' };

    return (
      <div
        key={problem.id}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px',
          backgroundColor: 'var(--color-surface)',
          borderTop: '1px solid var(--color-border)',
          borderRight: '1px solid var(--color-border)',
          borderBottom: '1px solid var(--color-border)',
          borderLeft: options?.isMissed || options?.originalDate
            ? '3px solid var(--color-tertiary)'
            : '3px solid var(--color-secondary)',
          borderRadius: 'var(--rounded-md, 2px)',
          gap: '12px',
          boxSizing: 'border-box',
        }}
      >
        {/* Left: Metadata & Title - perfectly aligned */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', flex: 1, minWidth: 0 }}>
          {options?.isMissed && (
            <span
              style={{
                height: '22px',
                padding: '0 8px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxSizing: 'border-box',
                borderRadius: 'var(--rounded-md, 2px)',
                fontFamily: 'var(--font-label)',
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                backgroundColor: '#fff0eb',
                border: '1px solid var(--color-tertiary)',
                color: 'var(--color-tertiary)',
              }}
            >
              Lỡ hẹn
            </span>
          )}

          {options?.originalDate && !options?.isMissed && (
            <span
              style={{
                height: '22px',
                padding: '0 8px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxSizing: 'border-box',
                borderRadius: 'var(--rounded-md, 2px)',
                fontFamily: 'var(--font-label)',
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                backgroundColor: '#fff0eb',
                border: '1px solid var(--color-tertiary)',
                color: 'var(--color-tertiary)',
              }}
            >
              Từ {options.originalDate}
            </span>
          )}

          {/* Difficulty Tag - unified 22px height */}
          <span
            style={{
              height: '22px',
              padding: '0 8px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxSizing: 'border-box',
              borderRadius: 'var(--rounded-md, 2px)',
              fontFamily: 'var(--font-label)',
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              backgroundColor: diffStyle.background,
              border: `1px solid ${diffStyle.borderColor}`,
              color: diffStyle.color,
            }}
          >
            {problem.difficulty}
          </span>

          {/* Problem Name */}
          <span
            style={{
              fontWeight: 600,
              fontFamily: 'var(--font-body)',
              fontSize: '0.94rem',
              color: options?.isMissed ? 'var(--color-tertiary)' : 'var(--color-primary)',
              textDecoration: options?.isMissed ? 'line-through' : 'none',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              lineHeight: 1.3,
            }}
          >
            {problem.name}
          </span>

          {/* Topic Tag - unified 22px height */}
          <span
            style={{
              height: '22px',
              padding: '0 8px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxSizing: 'border-box',
              borderRadius: 'var(--rounded-md, 2px)',
              fontFamily: 'var(--font-label)',
              fontSize: '0.72rem',
              fontWeight: 600,
              backgroundColor: 'var(--color-neutral)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-secondary)',
            }}
          >
            {problem.topicName}
          </span>

          {/* Repetition Tag - unified 22px height */}
          {item?.repetitions ? (
            <span
              style={{
                height: '22px',
                padding: '0 8px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxSizing: 'border-box',
                borderRadius: 'var(--rounded-md, 2px)',
                fontFamily: 'var(--font-label)',
                fontSize: '0.72rem',
                fontWeight: 600,
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-secondary)',
              }}
            >
              Lần {item.repetitions}
            </span>
          ) : null}
        </div>

        {/* Right: Square Kebab Menu Button (Identical 22px height & width) */}
        <div
          className="action-dropdown-wrap"
          onClick={(e) => e.stopPropagation()}
          style={{ position: 'relative', flexShrink: 0, display: 'inline-flex', alignItems: 'center' }}
        >
          <button
            type="button"
            className={`action-menu-trigger ${isDropdownOpen ? 'active' : ''}`}
            aria-label="Actions"
            title="Thao tác"
            onClick={(e) => {
              e.stopPropagation();
              setOpenActionMenuId(isDropdownOpen ? null : problem.id);
            }}
            style={{
              width: '22px',
              height: '22px',
              padding: 0,
              boxSizing: 'border-box',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.95rem',
              lineHeight: 1,
              borderRadius: 'var(--rounded-md, 2px)',
              border: '1px solid var(--color-border)',
              backgroundColor: isDropdownOpen ? '#fff4e8' : 'var(--color-surface)',
              color: isDropdownOpen ? 'var(--color-tertiary)' : 'var(--color-secondary)',
              cursor: 'pointer',
            }}
          >
            ⋮
          </button>

          {isDropdownOpen && (
            <div
              className="action-dropdown-menu"
              style={{
                top: 'calc(100% + 4px)',
                right: 0,
                minWidth: '160px',
                zIndex: 100,
                borderRadius: 'var(--rounded-md, 2px)',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-surface)',
              }}
            >
              <button
                type="button"
                className="action-menu-item"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenActionMenuId(null);
                  setReviewProblem(problem);
                }}
              >
                Đánh giá SRS
              </button>

              {problem.javaFilePath && (
                <button
                  type="button"
                  className="action-menu-item"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenActionMenuId(null);
                    setCodeProblem(problem);
                  }}
                >
                  Xem code Java
                </button>
              )}

              {problem.leetcodeUrl && (
                <a
                  href={problem.leetcodeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="action-menu-item"
                  onClick={() => setOpenActionMenuId(null)}
                >
                  Mở LeetCode
                </a>
              )}

              {problem.neetcodeUrl && (
                <a
                  href={problem.neetcodeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="action-menu-item"
                  onClick={() => setOpenActionMenuId(null)}
                >
                  Mở NeetCode
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
      {/* Overdue Alert Bar if past problems exist */}
      {overdueProblemsWithDate.length > 0 && (
        <div
          style={{
            padding: '10px 14px',
            backgroundColor: 'var(--color-surface)',
            borderTop: '1px solid var(--color-border)',
            borderRight: '1px solid var(--color-border)',
            borderBottom: '1px solid var(--color-border)',
            borderLeft: '4px solid var(--color-tertiary)',
            borderRadius: 'var(--rounded-md, 2px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px',
          }}
        >
          <div>
            <div style={{ fontWeight: 700, color: 'var(--color-tertiary)', fontSize: '0.88rem', fontFamily: 'var(--font-label)', letterSpacing: '0.02em' }}>
              Có {overdueProblemsWithDate.length} bài toán quá hạn từ các ngày trước
            </div>
            <p style={{ margin: '2px 0 0 0', fontSize: '0.84rem', color: 'var(--color-secondary)' }}>
              Các bài lỡ hẹn đã được gạch ở ngày cũ và tự động dồn sang ngày hôm nay ({todayStr}) để bạn ôn tập bù.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={handleGoToday}
            style={{ fontSize: '0.78rem', padding: '4px 12px', borderRadius: 'var(--rounded-md, 2px)' }}
          >
            Xem lịch hôm nay
          </button>
        </div>
      )}

      {/* Calendar Header Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
          padding: '10px 16px',
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--rounded-md, 2px)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h2
            style={{
              margin: 0,
              fontSize: '1.25rem',
              fontFamily: 'var(--font-display)',
              color: 'var(--color-primary)',
            }}
          >
            {monthNames[month]} / {year}
          </h2>
          <span
            style={{
              fontSize: '0.72rem',
              fontFamily: 'var(--font-label)',
              padding: '2px 8px',
              backgroundColor: 'var(--color-neutral)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--rounded-md, 2px)',
              color: 'var(--color-secondary)',
              fontWeight: 600,
            }}
          >
            {totalInMonth} bài trong tháng
          </span>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handleGoToday}
            style={{ height: '26px', padding: '0 10px', fontSize: '0.78rem', borderRadius: 'var(--rounded-md, 2px)' }}
          >
            Hôm nay
          </button>
          <div style={{ display: 'flex', gap: '2px' }}>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={handlePrevMonth}
              title="Tháng trước"
              style={{ height: '26px', width: '26px', padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--rounded-md, 2px)', border: '1px solid var(--color-border)' }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={handleNextMonth}
              title="Tháng sau"
              style={{ height: '26px', width: '26px', padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--rounded-md, 2px)', border: '1px solid var(--color-border)' }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Main Calendar Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--rounded-md, 2px)',
          backgroundColor: 'var(--color-surface)',
          overflow: 'hidden',
          width: '100%',
        }}
      >
        {/* Weekday Headers */}
        {WEEKDAYS.map((w, idx) => (
          <div
            key={w}
            style={{
              padding: '8px 6px',
              textAlign: 'center',
              fontFamily: 'var(--font-label)',
              fontSize: '0.72rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: idx >= 5 ? 'var(--color-tertiary)' : 'var(--color-secondary)',
              backgroundColor: 'var(--color-neutral)',
              borderTop: 'none',
              borderLeft: 'none',
              borderBottom: '1px solid var(--color-border)',
              borderRight: idx < 6 ? '1px solid var(--color-border-light)' : 'none',
            }}
          >
            {w}
          </div>
        ))}

        {/* Days Cells */}
        {calendarDays.map((d, idx) => {
          const isSelected = selectedDate === d.dateStr;
          const colIndex = idx % 7;
          const isPastMissed = d.isPast && d.problems.length > 0;

          const displayedProblemsForToday = d.isToday
            ? [
                ...d.problems.map((p) => ({ problem: p, isOverdueMoved: false, originalDate: d.dateStr })),
                ...overdueProblemsWithDate.map((item) => ({ problem: item.problem, isOverdueMoved: true, originalDate: item.originalDate })),
              ]
            : d.problems.map((p) => ({ problem: p, isOverdueMoved: false, originalDate: d.dateStr }));

          const totalItemsCount = displayedProblemsForToday.length;

          return (
            <div
              key={d.dateStr + '_' + idx}
              onClick={() => setSelectedDate(d.dateStr)}
              style={{
                minHeight: '95px',
                padding: '6px 6px',
                backgroundColor: isSelected
                  ? '#fff0eb'
                  : d.isToday
                  ? 'var(--color-surface)'
                  : isPastMissed
                  ? '#fff5f5'
                  : d.isCurrentMonth
                  ? 'var(--color-surface)'
                  : 'var(--color-neutral)',
                opacity: d.isCurrentMonth ? 1 : 0.45,
                borderTop: isSelected ? '2px solid var(--color-tertiary)' : '2px solid transparent',
                borderRight: colIndex < 6 ? '1px solid var(--color-border-light)' : '1px solid transparent',
                borderBottom: idx < 35 ? '1px solid var(--color-border-light)' : '1px solid transparent',
                borderLeft: '1px solid transparent',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '3px',
                transition: 'background-color 0.15s ease',
              }}
            >
              {/* Day Number Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-label)',
                    fontSize: '0.8rem',
                    fontWeight: d.isToday ? 700 : 500,
                    fontVariantNumeric: 'tabular-nums',
                    color: d.isToday ? '#ffffff' : isPastMissed ? 'var(--color-tertiary)' : 'var(--color-primary)',
                    backgroundColor: d.isToday ? 'var(--color-tertiary)' : 'transparent',
                    width: '20px',
                    height: '20px',
                    borderRadius: 'var(--rounded-md, 2px)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {d.dayNumber}
                </span>

                {isPastMissed ? (
                  <span
                    style={{
                      fontSize: '0.66rem',
                      fontFamily: 'var(--font-label)',
                      fontWeight: 700,
                      color: 'var(--color-tertiary)',
                      backgroundColor: '#fff0eb',
                      border: '1px solid var(--color-tertiary)',
                      padding: '0 4px',
                      height: '18px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      borderRadius: 'var(--rounded-md, 2px)',
                    }}
                    title="Lỡ hẹn - Đã dồn sang hôm nay"
                  >
                    {d.problems.length} lỡ hẹn
                  </span>
                ) : totalItemsCount > 0 ? (
                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontFamily: 'var(--font-label)',
                      fontWeight: 700,
                      color: d.isToday ? 'var(--color-tertiary)' : 'var(--color-secondary)',
                    }}
                  >
                    {totalItemsCount} bài
                  </span>
                ) : null}
              </div>

              {/* Problems pills preview */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '2px' }}>
                {displayedProblemsForToday.slice(0, 2).map(({ problem: p, isOverdueMoved }) => {
                  if (isPastMissed) {
                    return (
                      <div
                        key={p.id}
                        title={`[Lỡ hẹn ngày ${d.dateStr}] ${p.name} - Đã chuyển sang hôm nay`}
                        style={{
                          fontSize: '0.68rem',
                          fontFamily: 'var(--font-body)',
                          padding: '1px 4px',
                          borderRadius: 'var(--rounded-md, 2px)',
                          backgroundColor: '#fff5f5',
                          border: '1px solid var(--color-tertiary)',
                          color: 'var(--color-tertiary)',
                          textDecoration: 'line-through',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          lineHeight: 1.2,
                          opacity: 0.85,
                        }}
                      >
                        {p.name}
                      </div>
                    );
                  }

                  if (isOverdueMoved) {
                    return (
                      <div
                        key={p.id}
                        title={`[Quá hạn dồn sang] ${p.name} (${p.difficulty})`}
                        style={{
                          fontSize: '0.68rem',
                          fontFamily: 'var(--font-body)',
                          padding: '1px 4px',
                          borderRadius: 'var(--rounded-md, 2px)',
                          backgroundColor: '#fff0eb',
                          border: '1px solid var(--color-tertiary)',
                          color: 'var(--color-tertiary)',
                          fontWeight: 600,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          lineHeight: 1.2,
                        }}
                      >
                        [Nợ] {p.name}
                      </div>
                    );
                  }

                  return (
                    <div
                      key={p.id}
                      title={`${p.name} (${p.difficulty}) - ${p.topicName}`}
                      style={{
                        fontSize: '0.68rem',
                        fontFamily: 'var(--font-body)',
                        padding: '1px 4px',
                        borderRadius: 'var(--rounded-md, 2px)',
                        backgroundColor: 'var(--color-surface)',
                        border: '1px solid var(--color-border)',
                        color: 'var(--color-primary)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        lineHeight: 1.2,
                      }}
                    >
                      {p.name}
                    </div>
                  );
                })}

                {totalItemsCount > 2 && (
                  <div
                    style={{
                      fontSize: '0.65rem',
                      fontFamily: 'var(--font-label)',
                      color: isPastMissed ? 'var(--color-tertiary)' : 'var(--color-secondary)',
                      fontWeight: 600,
                      paddingLeft: '2px',
                    }}
                  >
                    + {totalItemsCount - 2} bài nữa...
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Day Problem List Drawer / Panel */}
      {selectedDate && (
        <div
          style={{
            padding: '14px 16px',
            backgroundColor: 'var(--color-surface)',
            borderTop: '1px solid var(--color-border)',
            borderRight: '1px solid var(--color-border)',
            borderBottom: '1px solid var(--color-border)',
            borderLeft: '4px solid var(--color-tertiary)',
            borderRadius: 'var(--rounded-md, 2px)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px',
              borderBottom: '1px solid var(--color-border-light)',
              paddingBottom: '8px',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: '0.7rem',
                  fontFamily: 'var(--font-label)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--color-secondary)',
                  fontWeight: 600,
                }}
              >
                Chi Tiết Lịch Ôn Tập
              </div>
              <h3
                style={{
                  margin: '2px 0 0 0',
                  fontSize: '1.1rem',
                  fontFamily: 'var(--font-display)',
                  color: 'var(--color-primary)',
                }}
              >
                Ngày {selectedDate} {selectedDate === todayStr && '(Hôm nay)'}
              </h3>
            </div>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setSelectedDate(null)}
              style={{ fontSize: '0.76rem', padding: '3px 8px', borderRadius: 'var(--rounded-md, 2px)' }}
            >
              Đóng chi tiết
            </button>
          </div>

          {/* Trường hợp: Xem ngày quá khứ */}
          {selectedDate < todayStr && (
            <div>
              {(problemsByDate[selectedDate] || []).length === 0 ? (
                <div style={{ color: 'var(--color-secondary)', fontSize: '0.88rem', padding: '6px 0' }}>
                  Không có bài toán nào được lên lịch vào ngày này.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div
                    style={{
                      padding: '6px 10px',
                      backgroundColor: 'var(--color-neutral)',
                      borderTop: '1px solid var(--color-border)',
                      borderRight: '1px solid var(--color-border)',
                      borderBottom: '1px solid var(--color-border)',
                      borderLeft: '3px solid var(--color-tertiary)',
                      borderRadius: 'var(--rounded-md, 2px)',
                      fontSize: '0.82rem',
                      color: 'var(--color-primary)',
                      marginBottom: '4px',
                    }}
                  >
                    Các bài tập dưới đây đã bị <strong style={{ color: 'var(--color-tertiary)' }}>lỡ hẹn</strong> vào ngày {selectedDate} và đã được tự động chuyển sang danh sách <strong>Hôm nay ({todayStr})</strong>.
                  </div>

                  {(problemsByDate[selectedDate] || []).map((problem) =>
                    renderProblemCard(problem, { isMissed: true })
                  )}
                </div>
              )}
            </div>
          )}

          {/* Trường hợp: Xem ngày hôm nay */}
          {selectedDate === todayStr && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Danh sách bài nợ từ quá khứ */}
              {overdueProblemsWithDate.length > 0 && (
                <div>
                  <div
                    style={{
                      fontSize: '0.82rem',
                      fontFamily: 'var(--font-label)',
                      fontWeight: 700,
                      color: 'var(--color-tertiary)',
                      marginBottom: '6px',
                      letterSpacing: '0.02em',
                    }}
                  >
                    Bài tập quá hạn dồn từ ngày trước ({overdueProblemsWithDate.length} bài)
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {overdueProblemsWithDate.map(({ problem, originalDate }) =>
                      renderProblemCard(problem, { originalDate })
                    )}
                  </div>
                </div>
              )}

              {/* Danh sách bài của đúng ngày hôm nay */}
              <div>
                <div
                  style={{
                    fontSize: '0.82rem',
                    fontFamily: 'var(--font-label)',
                    fontWeight: 700,
                    color: 'var(--color-primary)',
                    marginBottom: '6px',
                    letterSpacing: '0.02em',
                  }}
                >
                  Bài tập đúng hạn hôm nay ({(problemsByDate[todayStr] || []).length} bài)
                </div>

                {(problemsByDate[todayStr] || []).length === 0 ? (
                  <div style={{ color: 'var(--color-secondary)', fontSize: '0.88rem', padding: '4px 0' }}>
                    {overdueProblemsWithDate.length === 0
                      ? 'Tất cả các bài đã được ôn luyện xong! Không có bài nào cần làm hôm nay.'
                      : 'Không có thêm bài mới đúng hạn hôm nay.'}
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {(problemsByDate[todayStr] || []).map((problem) => renderProblemCard(problem))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Trường hợp: Xem ngày trong tương lai */}
          {selectedDate > todayStr && (
            <div>
              {(problemsByDate[selectedDate] || []).length === 0 ? (
                <div style={{ color: 'var(--color-secondary)', fontSize: '0.88rem', padding: '4px 0' }}>
                  Chưa có bài toán nào được lên lịch vào ngày này.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {(problemsByDate[selectedDate] || []).map((problem) => renderProblemCard(problem))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* SRS Review Modal */}
      {reviewProblem && (
        <SrsConfirmModal
          isOpen={Boolean(reviewProblem)}
          problem={reviewProblem}
          currentProgress={srsProgress[reviewProblem.id]}
          onClose={() => setReviewProblem(null)}
          onConfirm={handleSaveProgress}
        />
      )}

      {/* Java Code Modal */}
      {codeProblem && (
        <JavaCodeViewerModal
          isOpen={Boolean(codeProblem)}
          problem={codeProblem}
          onClose={() => setCodeProblem(null)}
        />
      )}
    </div>
  );
}
