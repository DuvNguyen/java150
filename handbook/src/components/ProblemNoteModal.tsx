'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { NeetCodeProblem } from '@/lib/neetcodeData';
import { SrsProgressItem, SRS, ANKI_DSA_TEMPLATE } from '@/lib/srs';

const MDXNoteEditor = dynamic(() => import('./MDXNoteEditor'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: '320px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fffdfa',
        border: '1px solid var(--color-border)',
        borderRadius: '3px',
        color: 'var(--color-secondary)',
        fontSize: '0.85rem',
      }}
    >
      Đang tải trình soạn thảo trực quan...
    </div>
  ),
});

interface Props {
  problem: NeetCodeProblem | null;
  currentProgress?: SrsProgressItem;
  isOpen: boolean;
  onClose: () => void;
  onSaveNote: (problem: NeetCodeProblem, note: string) => void;
}

export default function ProblemNoteModal({
  problem,
  currentProgress,
  isOpen,
  onClose,
  onSaveNote,
}: Props) {
  const [note, setNote] = useState('');

  useEffect(() => {
    if (problem && isOpen) {
      setNote(currentProgress?.note || '');
    }
  }, [problem, isOpen, currentProgress]);

  if (!isOpen || !problem) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveNote(problem, note);
  };

  const isDue = SRS.isDue(currentProgress);
  const isMastered = currentProgress?.status === 'mastered' && !isDue;
  const daysUntilDue = currentProgress?.nextReview
    ? SRS.getDaysUntilDue(currentProgress.nextReview)
    : 0;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-box srs-confirm-modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '820px', width: '96%', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: '14px',
            borderBottom: '1px solid var(--color-border)',
            paddingBottom: '10px',
          }}
        >
          <div>
            <div
              style={{
                fontSize: '0.72rem',
                fontFamily: 'var(--font-label)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--color-secondary)',
              }}
            >
              Chỉnh Sửa Ghi Chú Bài Tập
            </div>
            <h2
              style={{
                fontSize: '1.35rem',
                fontFamily: 'var(--font-display)',
                color: 'var(--color-primary)',
                margin: '4px 0 0 0',
                border: 'none',
                padding: 0,
              }}
            >
              {problem.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="modal-close-btn"
            title="Đóng (Esc)"
            aria-label="Đóng"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          {/* Status info bar */}
          <div
            style={{
              backgroundColor: '#fff4e8',
              border: '1px solid var(--color-border)',
              borderLeft: '4px solid var(--color-tertiary)',
              padding: '8px 12px',
              borderRadius: '2px',
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ fontSize: '0.82rem', color: 'var(--color-primary)' }}>
              {isMastered ? (
                <span>
                  Lịch ôn hiện tại: <strong>Sau {daysUntilDue} ngày ({currentProgress?.nextReview})</strong> (Lặp {currentProgress?.repetitions || 1} lần)
                </span>
              ) : isDue ? (
                <span style={{ color: '#b91c1c', fontWeight: 600 }}>
                  Trạng thái: Cần ôn tập hôm nay
                </span>
              ) : (
                <span>Trạng thái: Chưa học</span>
              )}
            </div>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <span
                className={`diff-badge diff-${problem.difficulty.toLowerCase()}`}
                style={{ padding: '2px 6px', fontSize: '0.72rem' }}
              >
                {problem.difficulty}
              </span>
              <span className="topic-meta-badge" style={{ padding: '2px 6px', fontSize: '0.72rem' }}>
                {problem.topicName}
              </span>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '6px',
            }}
          >
            <span
              style={{
                fontSize: '0.76rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--color-secondary)',
                fontWeight: 600,
              }}
            >
              Ghi chú trực quan (WYSIWYG Markdown)
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                type="button"
                onClick={() => {
                  if (!note.trim()) {
                    setNote(ANKI_DSA_TEMPLATE);
                  } else {
                    setNote(note + '\n\n' + ANKI_DSA_TEMPLATE);
                  }
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-primary)',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  padding: 0,
                  textDecoration: 'underline',
                  fontFamily: 'inherit',
                }}
              >
                + Chèn mẫu gợi ý
              </button>
              <span style={{ fontSize: '0.72rem', color: 'var(--color-secondary)' }}>
                {note.length} ký tự
              </span>
            </div>
          </div>

          {/* MDXEditor WYSIWYG Editor */}
          <div style={{ marginBottom: '12px', flex: 1, minHeight: 0 }}>
            <MDXNoteEditor
              markdown={note}
              onChange={setNote}
              height="380px"
              placeholder="Gõ trực tiếp hoặc dùng cú pháp Markdown (# Tiêu đề, **in đậm**, `code`, - danh sách)..."
            />
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px',
              paddingTop: '10px',
              borderTop: '1px solid var(--color-border-light)',
            }}
          >
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="btn btn-primary">
              Lưu ghi chú
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
