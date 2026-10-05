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
        height: '350px',
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
  onConfirm: (
    problem: NeetCodeProblem,
    rating: 'easy' | 'medium' | 'hard' | 'again',
    note: string
  ) => void;
  onSaveNoteOnly?: (problem: NeetCodeProblem, note: string) => void;
}

export default function SrsConfirmModal({
  problem,
  currentProgress,
  isOpen,
  onClose,
  onConfirm,
  onSaveNoteOnly,
}: Props) {
  const [rating, setRating] = useState<'easy' | 'medium' | 'hard' | 'again'>('easy');
  const [note, setNote] = useState('');
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    if (problem && isOpen) {
      setNote(currentProgress?.note || '');
      setRating(currentProgress?.lastRating || 'easy');
      setShowHelp(false);
    }
  }, [problem, isOpen, currentProgress]);

  if (!isOpen || !problem) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(problem, rating, note);
  };

  const getShortInterval = (r: 'easy' | 'medium' | 'hard' | 'again') => {
    const preview = SRS.calculateNextReview(currentProgress, r, undefined, problem.difficulty);
    if (r === 'again') return 'Hôm nay';
    return `+${preview.interval}d`;
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div
          className="modal-box srs-confirm-modal"
          onClick={(e) => e.stopPropagation()}
          style={{ maxWidth: '840px', width: '96%', maxHeight: '92vh', display: 'flex', flexDirection: 'column' }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
            <div>
              <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-label)', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-secondary)' }}>
                Xác Nhận Nắm Vững Bài Toán
              </div>
              <h2 style={{ fontSize: '1.30rem', fontFamily: 'var(--font-display)', color: 'var(--color-primary)', margin: '2px 0 0 0', border: 'none', padding: 0 }}>
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
            {/* Header minimal info bar */}
            <div
              style={{
                backgroundColor: '#fff4e8',
                border: '1px solid var(--color-border)',
                borderLeft: '4px solid var(--color-tertiary)',
                padding: '6px 12px',
                borderRadius: '2px',
                marginBottom: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '10px',
                flexWrap: 'wrap'
              }}
            >
              <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--color-primary)' }}>
                Nắm vững thuật toán và ghi nhớ các bẫy quan trọng
              </span>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <span className={`diff-badge diff-${problem.difficulty.toLowerCase()}`} style={{ padding: '2px 6px', fontSize: '0.70rem', height: '20px' }}>
                  {problem.difficulty}
                </span>
                <span className="topic-meta-badge" style={{ padding: '2px 6px', fontSize: '0.70rem' }}>{problem.topicName}</span>
                {currentProgress?.repetitions ? (
                  <span className="srs-rep-badge" style={{ padding: '2px 6px', fontSize: '0.70rem' }}>
                    Lặp {currentProgress.repetitions} lần
                  </span>
                ) : null}
              </div>
            </div>

            {/* Minimized Rating Options Bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '10px',
                padding: '6px 10px',
                backgroundColor: 'var(--color-neutral)',
                border: '1px solid var(--color-border-light)',
                borderRadius: '3px',
                gap: '8px',
                flexWrap: 'wrap',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-primary)' }}>
                  Đánh giá:
                </span>
                <button
                  type="button"
                  onClick={() => setShowHelp(true)}
                  title="Xem tiêu chuẩn chọn mức độ"
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    border: '1px solid var(--color-border)',
                    backgroundColor: '#fff',
                    color: 'var(--color-secondary)',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    padding: 0,
                    lineHeight: 1,
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  ?
                </button>
              </div>

              {/* Compact Pill Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setRating('easy')}
                  style={{
                    border: rating === 'easy' ? '1.5px solid var(--color-primary)' : '1px solid var(--color-border)',
                    backgroundColor: rating === 'easy' ? '#fff' : 'transparent',
                    color: 'var(--color-primary)',
                    fontWeight: rating === 'easy' ? 700 : 500,
                    fontSize: '0.78rem',
                    padding: '4px 10px',
                    borderRadius: '14px',
                    cursor: 'pointer',
                    boxShadow: rating === 'easy' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                  }}
                >
                  Rất tự tin <span style={{ opacity: 0.75, fontSize: '0.72rem' }}>({getShortInterval('easy')})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRating('medium')}
                  style={{
                    border: rating === 'medium' ? '1.5px solid var(--color-primary)' : '1px solid var(--color-border)',
                    backgroundColor: rating === 'medium' ? '#fff' : 'transparent',
                    color: 'var(--color-primary)',
                    fontWeight: rating === 'medium' ? 700 : 500,
                    fontSize: '0.78rem',
                    padding: '4px 10px',
                    borderRadius: '14px',
                    cursor: 'pointer',
                    boxShadow: rating === 'medium' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                  }}
                >
                  Khá ổn <span style={{ opacity: 0.75, fontSize: '0.72rem' }}>({getShortInterval('medium')})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRating('hard')}
                  style={{
                    border: rating === 'hard' ? '1.5px solid var(--color-primary)' : '1px solid var(--color-border)',
                    backgroundColor: rating === 'hard' ? '#fff' : 'transparent',
                    color: 'var(--color-primary)',
                    fontWeight: rating === 'hard' ? 700 : 500,
                    fontSize: '0.78rem',
                    padding: '4px 10px',
                    borderRadius: '14px',
                    cursor: 'pointer',
                    boxShadow: rating === 'hard' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                  }}
                >
                  Còn vướng <span style={{ opacity: 0.75, fontSize: '0.72rem' }}>({getShortInterval('hard')})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRating('again')}
                  style={{
                    border: rating === 'again' ? '1.5px solid var(--color-tertiary)' : '1px solid var(--color-border)',
                    backgroundColor: rating === 'again' ? '#fff0eb' : 'transparent',
                    color: rating === 'again' ? 'var(--color-tertiary)' : 'var(--color-primary)',
                    fontWeight: rating === 'again' ? 700 : 500,
                    fontSize: '0.78rem',
                    padding: '4px 10px',
                    borderRadius: '14px',
                    cursor: 'pointer',
                    boxShadow: rating === 'again' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                  }}
                >
                  Luyện lại <span style={{ opacity: 0.75, fontSize: '0.72rem' }}>(Hôm nay)</span>
                </button>
              </div>
            </div>

            {/* Note Editor Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span
                style={{
                  fontSize: '0.74rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'var(--color-secondary)',
                  fontWeight: 600,
                }}
              >
                Ghi chú cá nhân (WYSIWYG Markdown)
              </span>
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
            </div>

            {/* MDXEditor WYSIWYG Editor with Maximized Height */}
            <div style={{ marginBottom: '8px', flex: 1, minHeight: 0 }}>
              <MDXNoteEditor
                markdown={note}
                onChange={setNote}
                height="350px"
                placeholder="Gõ trực tiếp hoặc dùng cú pháp Markdown..."
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', paddingTop: '8px', borderTop: '1px solid var(--color-border-light)' }}>
              <div>
                {onSaveNoteOnly && (
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => onSaveNoteOnly(problem, note)}
                    style={{ fontSize: '0.8rem', padding: '5px 12px' }}
                  >
                    Chỉ lưu ghi chú
                  </button>
                )}
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" className="btn btn-secondary" onClick={onClose}>
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary">
                  Xác nhận & Lưu tiến độ
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Help Guidelines Modal Dialog */}
      {showHelp && (
        <div
          className="modal-overlay"
          style={{ zIndex: 1100, backgroundColor: 'rgba(0, 0, 0, 0.45)' }}
          onClick={() => setShowHelp(false)}
        >
          <div
            className="modal-box"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '500px',
              width: '90%',
              padding: '18px 22px',
              borderRadius: '4px',
              backgroundColor: '#fffdfa',
              border: '1px solid var(--color-border)',
              boxShadow: '0 10px 25px rgba(0,0,0,0.18)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '12px',
                borderBottom: '1px solid var(--color-border)',
                paddingBottom: '8px',
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: '1.02rem',
                  fontFamily: 'var(--font-display)',
                  color: 'var(--color-primary)',
                }}
              >
                Tiêu Chuẩn Đánh Giá Mức Độ Tự Tin
              </h3>
              <button
                type="button"
                onClick={() => setShowHelp(false)}
                className="modal-close-btn"
                title="Đóng (Esc)"
                aria-label="Đóng"
              >
                ✕
              </button>
            </div>

            <div style={{ fontSize: '0.85rem', lineHeight: '1.65', color: 'var(--color-primary)' }}>
              <div style={{ marginBottom: '8px' }}>
                <strong style={{ color: '#15803d' }}>• Rất tự tin:</strong> Nhìn ra ngay cách tối ưu trong 2 phút, code trơn tru dưới 10 phút.
              </div>
              <div style={{ marginBottom: '8px' }}>
                <strong style={{ color: '#0369a1' }}>• Khá ổn:</strong> Tự giải được trong 15-25 phút, pass tất cả test cases.
              </div>
              <div style={{ marginBottom: '8px' }}>
                <strong style={{ color: '#b45309' }}>• Còn vướng:</strong> Mất &gt; 35 phút, vướng edge cases hoặc cần xem gợi ý nhỏ.
              </div>
              <div style={{ marginBottom: '12px' }}>
                <strong style={{ color: '#b91c1c' }}>• Luyện lại:</strong> Hoàn toàn quên ý tưởng / không tự code được, cần học lại hôm nay.
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--color-border-light)', paddingTop: '10px' }}>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => setShowHelp(false)}
                style={{ padding: '4px 16px', fontSize: '0.82rem' }}
              >
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
