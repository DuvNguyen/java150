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
}

export default function SrsConfirmModal({
  problem,
  currentProgress,
  isOpen,
  onClose,
  onConfirm,
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
            className="btn btn-ghost btn-sm"
            style={{ fontSize: '1.2rem', padding: '2px 8px', lineHeight: 1 }}
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
                padding: '12px 16px',
                borderRadius: '2px',
                marginBottom: '16px',
              }}
            >
              <p style={{ fontSize: '0.98rem', fontWeight: 600, color: 'var(--color-primary)', margin: 0 }}>
                Bạn có chắc chắn đã hoàn toàn hiểu sâu thuật toán và cách tiếp cận bài toán này?
              </p>
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px', alignItems: 'center' }}>
                <span className={`diff-badge diff-${problem.difficulty.toLowerCase()}`}>
                  {problem.difficulty}
                </span>
                <span className="topic-meta-badge">{problem.topicName}</span>
                {currentProgress?.repetitions ? (
                  <span className="srs-rep-badge">
                    Đã hoàn thành {currentProgress.repetitions} lần
                  </span>
                ) : null}
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label className="srs-form-label">
                Đánh giá mức độ tự tin (Quyết định chu kỳ lặp lại ngắt quãng):
              </label>
              <div className="srs-rating-options-grid">
                <button
                  type="button"
                  className={`srs-rating-card ${rating === 'easy' ? 'selected easy' : ''}`}
                  onClick={() => setRating('easy')}
                >
                  <div className="rating-title">Easy (Rất tự tin)</div>
                  <div className="rating-desc">Tự làm được, nắm chắc tư duy</div>
                  <div className="rating-interval">Chu kỳ: {getIntervalPreview('easy')}</div>
                </button>

                <button
                  type="button"
                  className={`srs-rating-card ${rating === 'medium' ? 'selected medium' : ''}`}
                  onClick={() => setRating('medium')}
                >
                  <div className="rating-title">Medium (Khá ổn)</div>
                  <div className="rating-desc">Hiểu được nhưng cần củng cố</div>
                  <div className="rating-interval">Chu kỳ: {getIntervalPreview('medium')}</div>
                </button>

                <button
                  type="button"
                  className={`srs-rating-card ${rating === 'hard' ? 'selected hard' : ''}`}
                  onClick={() => setRating('hard')}
                >
                  <div className="rating-title">Hard (Còn vướng)</div>
                  <div className="rating-desc">Phải xem hint / chưa mượt</div>
                  <div className="rating-interval">Chu kỳ: {getIntervalPreview('hard')}</div>
                </button>

                <button
                  type="button"
                  className={`srs-rating-card ${rating === 'again' ? 'selected again' : ''}`}
                  onClick={() => setRating('again')}
                >
                  <div className="rating-title">Again (Luyện lại)</div>
                  <div className="rating-desc">Chưa tự giải được hoàn chỉnh</div>
                  <div className="rating-interval">Chu kỳ: Hôm nay</div>
                </button>
              </div>
            </div>

            <div style={{ marginTop: '16px' }}>
              <label className="srs-form-label" htmlFor="srs-note-input">
                Ghi chú cá nhân (Mẹo nhớ, lỗi sai hay gặp):
              </label>
              <textarea
                id="srs-note-input"
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ví dụ: Sử dụng HashMap lưu độ chênh lệch, chú ý edge case mảng 0 phần tử..."
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '2px',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-neutral)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.92rem',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px', paddingTop: '12px', borderTop: '1px solid var(--color-border-light)' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="btn btn-primary">
              Xác nhận & Lưu tiến độ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
