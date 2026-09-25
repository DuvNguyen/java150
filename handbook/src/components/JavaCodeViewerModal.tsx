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

  useEffect(() => {
    if (problem && isOpen) {
      setLoading(true);
      setError('');
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
        style={{ maxWidth: '850px', width: '95%', maxHeight: '88vh', display: 'flex', flexDirection: 'column' }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px', borderBottom: '1px solid var(--color-border)', paddingBottom: '10px' }}>
          <div>
            <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-label)', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-secondary)' }}>
              Java Solution Reference
            </div>
            <h2 style={{ fontSize: '1.35rem', fontFamily: 'var(--font-display)', color: 'var(--color-primary)', margin: '4px 0 0 0', border: 'none', padding: 0 }}>
              {problem.name}
            </h2>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-secondary)', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
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

        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 0' }}>
          {loading ? (
            <p className="loading-text">Đang tải mã nguồn...</p>
          ) : error ? (
            <div style={{ color: 'var(--color-tertiary)', padding: '16px', border: '1px solid var(--color-border)' }}>
              {error}
            </div>
          ) : (
            <CodeBlock code={code} language="java" filename={`${problem.name.replace(/[^a-zA-Z0-9]/g, '')}.java`} />
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--color-border-light)' }}>
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
