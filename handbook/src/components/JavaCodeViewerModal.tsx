'use client';

import { useState, useEffect } from 'react';
import CodeBlock from './CodeBlock';
import { NeetCodeProblem } from '@/lib/neetcodeData';

interface Props {
  problem: NeetCodeProblem | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function JavaCodeViewerModal({ problem, isOpen, onClose }: Props) {
  const [code, setCode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [activeRecall, setActiveRecall] = useState<boolean>(true);
  const [isRevealed, setIsRevealed] = useState<boolean>(false);

  useEffect(() => {
    if (problem && isOpen) {
      setLoading(true);
      setError('');
      setIsRevealed(false);
      fetch(`/api/code?file=${encodeURIComponent(problem.javaFilePath)}`)
        .then((res) => {
          if (!res.ok) throw new Error('Không thể tải file code.');
          return res.json();
        })
        .then((data) => {
          setCode(data.content || '// Không có nội dung mã nguồn');
        })
        .catch((err) => {
          setError(err.message || 'Lỗi khi tải mã nguồn');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [problem, isOpen]);

  if (!isOpen || !problem) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-box"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '850px',
          width: '95%',
          maxHeight: '88vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: '12px',
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
              Java Solution Reference
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
            <div
              style={{
                fontSize: '0.8rem',
                color: 'var(--color-secondary)',
                marginTop: '2px',
                fontFamily: 'var(--font-mono)',
              }}
            >
              {problem.javaFilePath}
            </div>
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

        {/* Active recall toggle bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '6px 12px',
            backgroundColor: 'var(--color-neutral)',
            border: '1px solid var(--color-border-light)',
            borderRadius: '2px',
            marginBottom: '10px',
            fontSize: '0.8rem',
          }}
        >
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', margin: 0 }}>
            <input
              type="checkbox"
              checked={activeRecall}
              onChange={(e) => setActiveRecall(e.target.checked)}
              style={{ cursor: 'pointer' }}
            />
            <span style={{ color: 'var(--color-primary)', fontWeight: 500 }}>
              Chế độ truy hồi chủ động (Active Recall Mode)
            </span>
          </label>
          <span style={{ fontSize: '0.74rem', color: 'var(--color-secondary)' }}>
            Che mã nguồn để tự kiểm tra tư duy trước
          </span>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 0' }}>
          {loading ? (
            <p className="loading-text">Đang tải mã nguồn...</p>
          ) : error ? (
            <div
              style={{
                color: 'var(--color-tertiary)',
                padding: '16px',
                border: '1px solid var(--color-border)',
              }}
            >
              {error}
            </div>
          ) : activeRecall && !isRevealed ? (
            <div
              style={{
                padding: '24px 20px',
                backgroundColor: '#fffdfa',
                border: '1px dashed var(--color-border)',
                borderRadius: '4px',
                textAlign: 'center',
              }}
            >
              <h3
                style={{
                  fontSize: '1.05rem',
                  fontFamily: 'var(--font-display)',
                  color: 'var(--color-primary)',
                  marginBottom: '14px',
                }}
              >
                Kiểm tra phản xạ tư duy trước khi xem code
              </h3>
              <div
                style={{
                  textAlign: 'left',
                  maxWidth: '540px',
                  margin: '0 auto 20px auto',
                  fontSize: '0.88rem',
                  lineHeight: '1.7',
                  color: 'var(--color-primary)',
                  backgroundColor: '#fff',
                  padding: '14px 18px',
                  border: '1px solid var(--color-border-light)',
                  borderRadius: '3px',
                }}
              >
                <div style={{ marginBottom: '8px' }}>
                  <strong>1. Pattern & Cấu trúc dữ liệu:</strong> Bài này dùng kỹ thuật gì (Two Pointers, Monotonic Stack, Trie, DP...)?
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <strong>2. Ý tưởng cốt lõi (Key Insight):</strong> Điều kiện chuyển trạng thái / pop stack / dịch con trỏ là gì?
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <strong>3. Bẫy & Edge Cases:</strong> Các trường hợp biên nào cần cẩn thận?
                </div>
                <div>
                  <strong>4. Độ phức tạp tối ưu:</strong> Time `O(...)` và Space `O(...)` là bao nhiêu?
                </div>
              </div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setIsRevealed(true)}
                style={{ padding: '8px 24px', fontSize: '0.9rem' }}
              >
                Hiển thị mã nguồn Java (Reveal Solution)
              </button>
            </div>
          ) : (
            <div>
              {activeRecall && isRevealed && (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginBottom: '8px',
                  }}
                >
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setIsRevealed(false)}
                    style={{ fontSize: '0.75rem', padding: '3px 10px' }}
                  >
                    Ẩn lại mã nguồn (Hide Solution)
                  </button>
                </div>
              )}
              <CodeBlock
                code={code}
                language="java"
                filename={`${problem.name.replace(/[^a-zA-Z0-9]/g, '')}.java`}
              />
            </div>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '16px',
            paddingTop: '12px',
            borderTop: '1px solid var(--color-border-light)',
          }}
        >
          <div style={{ display: 'flex', gap: '8px' }}>
            <a
              href={problem.leetcodeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-sm"
            >
              Mở LeetCode
            </a>
            <a
              href={problem.neetcodeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-sm"
            >
              Mở NeetCode
            </a>
          </div>
          <button type="button" className="btn btn-primary" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
