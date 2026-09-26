'use client';

import { useState, useEffect } from 'react';
import { NeetCodeProblem } from '@/lib/neetcodeData';
import { SrsProgressItem, SRS } from '@/lib/srs';

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

  useEffect(() => {
    if (problem && isOpen) {
      setNote(currentProgress?.note || '');
      setRating(currentProgress?.lastRating || 'easy');
    }
  }, [problem, isOpen, currentProgress]);

  if (!isOpen || !problem) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(problem, rating, note);
  };

  const getIntervalPreview = (r: 'easy' | 'medium' | 'hard' | 'again') => {
    const preview = SRS.calculateNextReview(currentProgress, r);
    if (r === 'again') return 'Ôn lại ngay hôm nay';
    return `${preview.interval} ngày nữa (${preview.nextReview})`;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-box srs-confirm-modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '620px', width: '95%' }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
          <div>
            <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-label)', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-secondary)' }}>
              Xác Nhận Nắm Vững Bài Toán
            </div>
            <h2 style={{ fontSize: '1.35rem', fontFamily: 'var(--font-display)', color: 'var(--color-primary)', margin: '4px 0 0 0', border: 'none', padding: 0 }}>
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
          <div style={{ marginBottom: '16px' }}>
            <div
              style={{
                backgroundColor: '#fff4e8',
                border: '1px solid var(--color-border)',
                borderLeft: '4px solid var(--color-tertiary)',
                padding: '8px 12px',
                borderRadius: '2px',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                flexWrap: 'wrap'
              }}
            >
              <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-primary)', margin: 0 }}>
                Bạn có chắc chắn đã nắm vững thuật toán bài này?
              </p>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <span className={`diff-badge diff-${problem.difficulty.toLowerCase()}`} style={{ padding: '2px 6px', fontSize: '0.72rem' }}>
                  {problem.difficulty}
                </span>
                <span className="topic-meta-badge" style={{ padding: '2px 6px', fontSize: '0.72rem' }}>{problem.topicName}</span>
                {currentProgress?.repetitions ? (
                  <span className="srs-rep-badge" style={{ padding: '2px 6px', fontSize: '0.72rem' }}>
                    Đã ôn {currentProgress.repetitions} lần
                  </span>
                ) : null}
              </div>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label className="srs-form-label" style={{ fontSize: '0.75rem', marginBottom: '6px' }}>
                Đánh giá mức độ tự tin (Chu kỳ lặp lại ngắt quãng):
              </label>
              <div className="srs-rating-options-grid compact">
                <button
                  type="button"
                  className={`srs-rating-card ${rating === 'easy' ? 'selected easy' : ''}`}
                  onClick={() => setRating('easy')}
                >
                  <div className="rating-title">Easy (Rất tự tin)</div>
                  <div className="rating-desc">Tự làm mượt mà</div>
                  <div className="rating-interval">{getIntervalPreview('easy')}</div>
                </button>

                <button
                  type="button"
                  className={`srs-rating-card ${rating === 'medium' ? 'selected medium' : ''}`}
                  onClick={() => setRating('medium')}
                >
                  <div className="rating-title">Medium (Khá ổn)</div>
                  <div className="rating-desc">Cần củng cố thêm</div>
                  <div className="rating-interval">{getIntervalPreview('medium')}</div>
                </button>

                <button
                  type="button"
                  className={`srs-rating-card ${rating === 'hard' ? 'selected hard' : ''}`}
                  onClick={() => setRating('hard')}
                >
                  <div className="rating-title">Hard (Còn vướng)</div>
                  <div className="rating-desc">Cần xem gợi ý</div>
                  <div className="rating-interval">{getIntervalPreview('hard')}</div>
                </button>

                <button
                  type="button"
                  className={`srs-rating-card ${rating === 'again' ? 'selected again' : ''}`}
                  onClick={() => setRating('again')}
                >
                  <div className="rating-title">Again (Luyện lại)</div>
                  <div className="rating-desc">Chưa tự giải được</div>
                  <div className="rating-interval">Ôn lại hôm nay</div>
                </button>
              </div>
            </div>

            <div style={{ marginTop: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label className="srs-form-label" htmlFor="srs-note-input" style={{ margin: 0 }}>
                  Ghi chú cá nhân (Mẹo nhớ, template code, lỗi sai hay gặp):
                </label>
                <span style={{ fontSize: '0.72rem', color: 'var(--color-secondary)' }}>Có thể kéo dãn ô ghi chú</span>
              </div>
              <textarea
                id="srs-note-input"
                rows={8}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ví dụ:
- Dùng HashMap lưu tần suất, sau đó dùng List[] (Bucket Sort) để gom các phần tử theo tần suất.
- Chú ý khởi tạo ArrayList cho từng bucket vì mặc định mảng là null.
- Duyệt từ cuối mảng bucket về đầu để lấy Top K phần tử lớn nhất..."
                style={{
                  width: '100%',
                  minHeight: '180px',
                  maxHeight: '400px',
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

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingTop: '12px', borderTop: '1px solid var(--color-border-light)' }}>
            <div>
              {onSaveNoteOnly && (
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => onSaveNoteOnly(problem, note)}
                  style={{ fontSize: '0.8rem', padding: '6px 12px' }}
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
  );
}
