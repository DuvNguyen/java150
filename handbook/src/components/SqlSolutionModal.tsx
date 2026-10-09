'use client';

import React from 'react';
import { SqlProblem, SqlStatus } from '@/lib/sqlDatabaseData';
import CodeBlock from '@/components/CodeBlock';

interface Props {
  problem: SqlProblem | null;
  isOpen: boolean;
  onClose: () => void;
  status: SqlStatus;
  onStatusChange: (status: SqlStatus) => void;
}

export default function SqlSolutionModal({
  problem,
  isOpen,
  onClose,
  status,
  onStatusChange,
}: Props) {
  if (!isOpen || !problem) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-box"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '820px',
          width: '95%',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'var(--color-surface, #FFF9F4)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--rounded-lg, 4px)',
          padding: 0,
          overflow: 'hidden',
          boxShadow: '0 8px 30px rgba(51, 48, 46, 0.15)',
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '16px 20px',
            backgroundColor: '#fff4e8',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: 'var(--color-secondary)',
                }}
              >
                LeetCode #{problem.leetcodeId}
              </span>
              <span
                className={`diff-badge diff-${problem.difficulty.toLowerCase()}`}
                style={{ fontSize: '0.72rem' }}
              >
                {problem.difficulty}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-label)',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  color: 'var(--color-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                • {problem.category}
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
              {problem.title}
            </h2>
          </div>

          {/* Close button — Flat minimal according to AGENTS.md & design.md */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '1.4rem',
              lineHeight: 1,
              color: 'var(--color-secondary)',
              cursor: 'pointer',
              padding: '4px 8px',
              transition: 'color 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--color-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--color-secondary)';
            }}
          >
            ✕
          </button>
        </div>

        {/* Modal Body — Fixed uniform scrollable container */}
        <div
          style={{
            padding: '20px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
            flex: 1,
          }}
        >
          {/* Top Action & Status bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              paddingBottom: '12px',
              borderBottom: '1px solid var(--color-border-light)',
            }}
          >
            <a
              href={problem.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            >
              Mở bài trên LeetCode ↗
            </a>

            <div className="status-combobox-wrapper">
              <label htmlFor="modal-sql-status-select" className="status-combobox-label">
                Trạng thái:
              </label>
              <select
                id="modal-sql-status-select"
                className="status-combobox"
                value={status}
                onChange={(e) => onStatusChange(e.target.value as SqlStatus)}
              >
                <option value="not-started">Chưa làm</option>
                <option value="in-progress">Đang làm</option>
                <option value="done">Đã hoàn thành</option>
              </select>
            </div>
          </div>

          {/* Problem Summary */}
          <div>
            <div
              style={{
                fontFamily: 'var(--font-label)',
                fontSize: '0.72rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--color-secondary)',
                marginBottom: '4px',
              }}
            >
              Tóm tắt đề bài & Yêu cầu logic
            </div>
            <div
              style={{
                padding: '12px 14px',
                backgroundColor: 'var(--color-neutral, #FFF1E5)',
                border: '1px solid var(--color-border-light)',
                borderRadius: 'var(--rounded-md, 2px)',
                fontSize: '0.92rem',
                color: 'var(--color-primary)',
                lineHeight: '1.6',
              }}
            >
              {problem.summary}
            </div>
          </div>

          {/* SQL Solution Code */}
          <div>
            <div
              style={{
                fontFamily: 'var(--font-label)',
                fontSize: '0.72rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--color-tertiary)',
                marginBottom: '6px',
              }}
            >
              Lời giải SQL Chuẩn (PostgreSQL / MySQL)
            </div>
            <CodeBlock code={problem.solutionSql} filename="solution.sql" />
          </div>

          {/* Detailed Explanation */}
          <div>
            <div
              style={{
                fontFamily: 'var(--font-label)',
                fontSize: '0.72rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--color-secondary)',
                marginBottom: '6px',
              }}
            >
              Phân tích kỹ thuật & Lưu ý tối ưu
            </div>
            <div
              style={{
                padding: '14px 16px',
                backgroundColor: 'var(--color-surface, #FFF9F4)',
                border: '1px solid var(--color-border)',
                borderLeft: '4px solid var(--color-tertiary)',
                borderRadius: 'var(--rounded-md, 2px)',
                fontSize: '0.9rem',
                color: 'var(--color-primary)',
                lineHeight: '1.65',
              }}
            >
              {problem.explanation}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '12px 20px',
            backgroundColor: 'var(--color-neutral, #FFF1E5)',
            borderTop: '1px solid var(--color-border)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '8px',
          }}
        >
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={onClose}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
