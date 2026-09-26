'use client';

import { useState, useEffect } from 'react';
import { NeetCodeProblem } from '@/lib/neetcodeData';
import { SrsProgressItem, SRS } from '@/lib/srs';

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
        style={{ maxWidth: '640px', width: '95%' }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: '16px',
            borderBottom: '1px solid var(--color-border)',
            paddingBottom: '12px',
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

        <form onSubmit={handleSubmit}>
          {/* Status info bar */}
          <div
            style={{
              backgroundColor: '#fff4e8',
              border: '1px solid var(--color-border)',
              borderLeft: '4px solid var(--color-tertiary)',
              padding: '10px 12px',
              borderRadius: '2px',
              marginBottom: '14px',
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
              fontSize: '0.78rem',
              color: 'var(--color-secondary)',
              marginBottom: '10px',
              lineHeight: 1.5,
            }}
          >
            Lưu ý: Chỉnh sửa ghi chú tại đây chỉ cập nhật nội dung ghi nhớ, <strong>không làm thay đổi hoặc kéo giãn</strong> chu kỳ và lịch ôn tập Spaced Repetition của bạn.
          </div>

          <div style={{ marginBottom: '16px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '6px',
              }}
            >
              <label
                className="srs-form-label"
                htmlFor="problem-note-textarea"
                style={{ margin: 0, fontSize: '0.82rem' }}
              >
                Nội dung ghi chú cá nhân:
              </label>
              <span style={{ fontSize: '0.72rem', color: 'var(--color-secondary)' }}>
                {note.length} ký tự
              </span>
            </div>
            <textarea
              id="problem-note-textarea"
              rows={9}
              autoFocus
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ghi chú thuật toán, ý tưởng chính, bẫy / edge cases hoặc template lời giải cho bài này..."
              style={{
                width: '100%',
                minHeight: '200px',
                maxHeight: '450px',
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

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px',
              paddingTop: '12px',
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
