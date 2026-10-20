'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import CodeBlock from './CodeBlock';
import MarkdownNoteViewer from './MarkdownNoteViewer';
import { NeetCodeProblem } from '@/lib/neetcodeData';
import type { OnMount } from '@monaco-editor/react';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        color: '#858585',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.85rem',
        backgroundColor: '#1e1e1e',
      }}
    >
      Đang tải Monaco Editor (chuẩn NeetCode)...
    </div>
  ),
});

export interface CodeWorkspaceProblem {
  id: string;
  name: string;
  kind?: 'code' | 'theory';
  difficulty?: string;
  topicId?: string;
  topicName?: string;
  javaFilePath: string;
  description?: string;
  leetcodeUrl?: string;
  neetcodeUrl?: string;
  starterTemplate?: string;
  referenceSolution?: string;
  explanation?: string;
  index?: number;
  lists?: ('neetcode150' | 'blind75')[];
}

interface Props {
  problem: CodeWorkspaceProblem | NeetCodeProblem | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenSrsReview?: (problem: NeetCodeProblem) => void;
}

export default function JavaCodeViewerModal({
  problem,
  isOpen,
  onClose,
  onOpenSrsReview,
}: Props) {
  const workspaceItem = problem ? (problem as CodeWorkspaceProblem) : null;
  const [activeTab, setActiveTab] = useState<'editor' | 'solution'>('editor');
  const [code, setCode] = useState<string>('');
  const [originalCode, setOriginalCode] = useState<string>('');
  const [filePath, setFilePath] = useState<string>('');
  const [fileExists, setFileExists] = useState<boolean>(false);
  const [optimizedCode, setOptimizedCode] = useState<string | null>(null);
  const [reviewMarkdown, setReviewMarkdown] = useState<string | null>(null);
  const [solutionSubTab, setSolutionSubTab] = useState<'reference' | 'review'>('reference');

  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [saveMessage, setSaveMessage] = useState<string>('');
  const [promptMessage, setPromptMessage] = useState<string>('');
  const [ideMessage, setIdeMessage] = useState<string>('');

  const [activeRecall, setActiveRecall] = useState<boolean>(true);
  const [isSolutionRevealed, setIsSolutionRevealed] = useState<boolean>(false);
  const [editorTheme, setEditorTheme] = useState<'vs-dark' | 'light'>('vs-dark');

  // Sync line count
  const lineCount = Math.max(1, (code || '').split('\n').length);
  const hasUnsavedChanges = code !== originalCode;

  // Ref for save function to be called from Monaco shortcuts
  const handleSaveRef = useRef<() => void>(() => {});

  // Fetch problem code on modal open
  useEffect(() => {
    if (!problem || !isOpen) return;

    let ignore = false;

    const fetchCode = async () => {
      setError('');
      setSaveMessage('');
      setIdeMessage('');
      setIsSolutionRevealed(false);
      setActiveTab('editor');
      setLoading(true);

      try {
        const res = await fetch(`/api/code?file=${encodeURIComponent(problem.javaFilePath)}`);
        if (!res.ok) throw new Error('Không thể tải mã nguồn');
        const data = await res.json();
        if (!ignore) {
          const fetchedContent = data.content || '';
          const initialCode = fetchedContent.trim() ? fetchedContent : (workspaceItem?.starterTemplate || fetchedContent);
          setCode(initialCode);
          setOriginalCode(fetchedContent);
          setFilePath(data.file || problem.javaFilePath);
          setFileExists(Boolean(data.exists));
          setOptimizedCode(data.optimizedContent || workspaceItem?.referenceSolution || null);
          setReviewMarkdown(data.reviewMarkdown || workspaceItem?.explanation || null);
          setSolutionSubTab('reference');
          setLoading(false);
        }
      } catch (err: unknown) {
        if (!ignore) {
          const msg = err instanceof Error ? err.message : 'Lỗi khi tải mã nguồn';
          setError(msg);
          setLoading(false);
        }
      }
    };

    fetchCode();

    return () => {
      ignore = true;
    };
  }, [
    problem,
    isOpen,
    workspaceItem?.starterTemplate,
    workspaceItem?.referenceSolution,
    workspaceItem?.explanation,
  ]);

  // Save code to local repo
  const handleSave = useCallback(async () => {
    if (!problem || !filePath) return;
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          file: filePath,
          content: code,
        }),
      });

      if (!res.ok) {
        throw new Error('Lưu thất bại');
      }

      const data = await res.json();
      setOriginalCode(code);
      setFileExists(true);
      const timeStr = new Date().toLocaleTimeString('vi-VN', { hour12: false });
      setSaveMessage(`Đã lưu trực tiếp vào ${data.file || filePath} (${timeStr})`);
      setTimeout(() => setSaveMessage(''), 4500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi khi lưu mã nguồn';
      setError(msg);
    } finally {
      setSaving(false);
    }
  }, [problem, filePath, code]);

  // Launch or focus Antigravity IDE
  const handleOpenInIde = async () => {
    setIdeMessage('Đang mở IDE...');
    try {
      const res = await fetch('/api/ide/open', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setIdeMessage('Đã mở trong Antigravity IDE');
      } else {
        setIdeMessage('Không thể mở Antigravity IDE');
      }
    } catch {
      setIdeMessage('Lỗi kết nối khi gọi IDE');
    }
    setTimeout(() => setIdeMessage(''), 3500);
  };

  // Copy structured prompt for AGY CLI / Agent
  const handleCopyAgyPrompt = async () => {
    const targetFile = filePath || problem?.javaFilePath || 'java-core/Answer.md';
    const isTheory = workspaceItem?.kind === 'theory' || targetFile.endsWith('.md');

    const promptText = isTheory
      ? `Hãy đánh giá và nhận xét câu trả lời lý thuyết của tôi trong file ${targetFile}:
- Đề bài: "${workspaceItem?.description || problem?.name}"
- Kiểm tra tính đầy đủ, chính xác của các luận điểm kỹ thuật trong câu trả lời.
- Chỉ ra các điểm còn thiếu hoặc sai lệch so với chuẩn Java Core / OOP.
- Cung cấp câu trả lời mẫu chuẩn mực, súc tích dành cho phỏng vấn theo quy tắc dự án.`
      : `Hãy review và giải thích mã nguồn Java trong file ${targetFile}:
- Đánh giá tính hợp lệ (Valid) và thực hành tốt nhất (Best Practice)
- Phân tích chi tiết Time Complexity O(...) và Space Complexity O(...)
- Nêu rõ các bẫy / edge cases và đề xuất phương án tối ưu hóa nếu có.`;

    try {
      await navigator.clipboard.writeText(promptText);
      setPromptMessage('Đã sao chép prompt AGY');
      setTimeout(() => setPromptMessage(''), 3000);
    } catch {
      // fallback
    }
  };

  // Keep save ref fresh
  useEffect(() => {
    handleSaveRef.current = handleSave;
  }, [handleSave]);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    // Intercept Ctrl+S / Cmd+S in Monaco
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      handleSaveRef.current();
    });
  };

  if (!isOpen || !problem) return null;

  const isTheory = workspaceItem?.kind === 'theory' || Boolean(filePath && filePath.endsWith('.md'));
  const fileName = filePath ? filePath.split('/').pop() || (isTheory ? 'Answer.md' : 'Solution.java') : `${problem.name.replace(/[^a-zA-Z0-9]/g, '')}.${isTheory ? 'md' : 'java'}`;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-box code-workspace-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--color-border)',
            paddingBottom: '10px',
            marginBottom: '12px',
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
              {isTheory
                ? 'Không gian trả lời lý thuyết & phỏng vấn Java Core'
                : 'Không gian luyện tập & giải thuật Java'}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
              <h2
                style={{
                  fontSize: '1.35rem',
                  fontFamily: 'var(--font-display)',
                  color: 'var(--color-primary)',
                  margin: 0,
                  border: 'none',
                  padding: 0,
                }}
              >
                {problem.name}
              </h2>
              {problem.difficulty && (
                <span className={`diff-badge diff-${problem.difficulty.toLowerCase()}`}>
                  {problem.difficulty}
                </span>
              )}
            </div>
            <div
              style={{
                fontSize: '0.78rem',
                color: 'var(--color-secondary)',
                marginTop: '4px',
                fontFamily: 'var(--font-mono)',
              }}
            >
              Vị trí local: <strong>{filePath || problem.javaFilePath}</strong>
            </div>

            {workspaceItem?.description && (
              <div
                style={{
                  marginTop: '8px',
                  padding: '8px 12px',
                  backgroundColor: 'var(--color-neutral)',
                  border: '1px solid var(--color-border)',
                  borderLeft: '3px solid var(--color-tertiary)',
                  borderRadius: '2px',
                  fontSize: '0.86rem',
                  color: 'var(--color-primary)',
                  fontFamily: 'var(--font-body)',
                  lineHeight: '1.5',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-label)',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    color: 'var(--color-tertiary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    marginRight: '6px',
                  }}
                >
                  Yêu cầu bài tập:
                </span>
                {workspaceItem.description}
              </div>
            )}
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

        {/* NeetCode Style Navigation Tabs */}
        <div className="code-workspace-tabs">
          <div className="code-workspace-tabs-group">
            <button
              type="button"
              className={`code-workspace-tab-btn ${activeTab === 'editor' ? 'active' : ''}`}
              onClick={() => setActiveTab('editor')}
            >
              <span>{isTheory ? 'Soạn câu trả lời' : 'Viết mã nguồn'}</span>
              {hasUnsavedChanges ? (
                <span className="code-workspace-tab-badge">Chưa lưu</span>
              ) : fileExists ? (
                <span className="code-workspace-tab-badge">Repo</span>
              ) : (
                <span className="code-workspace-tab-badge">Mới</span>
              )}
            </button>

            <button
              type="button"
              className={`code-workspace-tab-btn ${activeTab === 'solution' ? 'active' : ''}`}
              onClick={() => setActiveTab('solution')}
            >
              <span>{isTheory ? 'Đáp án tham khảo' : 'Lời giải tham khảo'}</span>
              {reviewMarkdown && (
                <span className="code-workspace-tab-badge">AGY Note</span>
              )}
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {promptMessage && (
              <span style={{ fontSize: '0.78rem', color: 'var(--color-secondary)', fontFamily: 'var(--font-mono)' }}>
                {promptMessage}
              </span>
            )}
            {saveMessage && (
              <span style={{ fontSize: '0.78rem', color: 'var(--color-secondary)', fontFamily: 'var(--font-mono)' }}>
                {saveMessage}
              </span>
            )}
            {ideMessage && (
              <span style={{ fontSize: '0.78rem', color: 'var(--color-tertiary)', fontFamily: 'var(--font-label)', fontWeight: 600 }}>
                {ideMessage}
              </span>
            )}
            {activeTab === 'solution' && (
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', cursor: 'pointer', margin: 0 }}>
                <input
                  type="checkbox"
                  checked={activeRecall}
                  onChange={(e) => setActiveRecall(e.target.checked)}
                />
                <span style={{ color: 'var(--color-secondary)' }}>Truy hồi chủ động</span>
              </label>
            )}
          </div>
        </div>

        {/* Content Pane: Fixed Uniform Height to prevent any modal jumps */}
        <div className="code-workspace-content-pane">
          {loading ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                color: 'var(--color-secondary)',
                fontSize: '0.9rem',
              }}
            >
              Đang tải mã nguồn từ repo...
            </div>
          ) : error ? (
            <div
              style={{
                color: 'var(--color-tertiary)',
                padding: '16px',
                border: '1px solid var(--color-border)',
                borderRadius: '3px',
                backgroundColor: '#fff7f7',
              }}
            >
              {error}
            </div>
          ) : activeTab === 'editor' ? (
            /* TAB 1: CODE EDITOR (Local Repo Target) */
            <div className="code-editor-box">
              {/* Editor Top Bar */}
              <div className="code-editor-header">
                <div className="code-editor-file-tab">
                  <span>{fileName}</span>
                </div>

                <div className="code-editor-meta-info">
                  {hasUnsavedChanges ? (
                    <span className="code-save-status-pill unsaved">
                      Chưa lưu
                    </span>
                  ) : fileExists ? (
                    <span className="code-save-status-pill saved">
                      Đã lưu
                    </span>
                  ) : (
                    <span className="code-save-status-pill new-file">
                      File mới
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => setEditorTheme(editorTheme === 'vs-dark' ? 'light' : 'vs-dark')}
                    style={{
                      background: 'transparent',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--rounded-md, 2px)',
                      padding: '2px 8px',
                      fontSize: '0.7rem',
                      fontFamily: 'var(--font-label)',
                      color: 'var(--color-secondary)',
                      cursor: 'pointer',
                    }}
                    title="Chuyển đổi giao diện Sáng / Tối của Monaco"
                  >
                    {editorTheme === 'vs-dark' ? 'Theme Tối' : 'Theme Sáng'}
                  </button>
                  <span>{lineCount} dòng</span>
                </div>
              </div>

              {/* Editor Body with Monaco Editor (100% like NeetCode) */}
              <div
                className="code-editor-body"
                style={{
                  flex: 1,
                  minHeight: 0,
                  height: '100%',
                  overflow: 'hidden',
                  backgroundColor: editorTheme === 'vs-dark' ? '#1e1e1e' : '#ffffff',
                }}
              >
                <MonacoEditor
                  height="100%"
                  language={isTheory ? 'markdown' : 'java'}
                  value={code}
                  onChange={(val) => setCode(val || '')}
                  theme={editorTheme}
                  onMount={handleEditorDidMount}
                  options={{
                    fontSize: 13,
                    fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace",
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    lineNumbers: 'on',
                    renderLineHighlight: 'all',
                    tabSize: 4,
                    automaticLayout: true,
                    bracketPairColorization: { enabled: true },
                    autoClosingBrackets: 'always',
                    autoClosingQuotes: 'always',
                    formatOnPaste: true,
                    formatOnType: true,
                    padding: { top: 10, bottom: 10 },
                    suggestOnTriggerCharacters: true,
                    quickSuggestions: true,
                    wordWrap: isTheory ? 'on' : 'off',
                    cursorBlinking: 'smooth',
                    smoothScrolling: true,
                  }}
                />
              </div>
            </div>
          ) : (
            /* TAB 2: SEE SOLUTION & AGY REVIEW NOTES */
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {activeRecall && !isSolutionRevealed ? (
                <div
                  style={{
                    padding: '28px 24px',
                    backgroundColor: '#fffdfa',
                    border: '1px dashed var(--color-border)',
                    borderRadius: '4px',
                    textAlign: 'center',
                    margin: 'auto 0',
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
                    {isTheory
                      ? 'Kiểm tra phản xạ tư duy trước khi xem đáp án'
                      : 'Kiểm tra phản xạ tư duy trước khi xem lời giải'}
                  </h3>
                  <div
                    style={{
                      textAlign: 'left',
                      maxWidth: '560px',
                      margin: '0 auto 20px auto',
                      fontSize: '0.88rem',
                      lineHeight: '1.7',
                      color: 'var(--color-primary)',
                      backgroundColor: '#fff',
                      padding: '14px 20px',
                      border: '1px solid var(--color-border-light)',
                      borderRadius: '3px',
                    }}
                  >
                    <div style={{ marginBottom: '8px' }}>
                      <strong>1. Pattern & Cấu trúc dữ liệu:</strong> Bài này dùng kỹ thuật gì (Two Pointers, Monotonic Stack, Trie, DP...)?
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <strong>2. Ý tưởng cốt lõi (Key Insight):</strong> Điều kiện chuyển trạng thái / dịch con trỏ / xử lý hash là gì?
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <strong>3. Bẫy & Edge Cases:</strong> Các trường hợp rỗng, số âm, trùng lặp nào cần lưu ý?
                    </div>
                    <div>
                      <strong>4. Độ phức tạp tối ưu:</strong> Time `O(...)` và Space `O(...)` là bao nhiêu?
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setIsSolutionRevealed(true)}
                    style={{ padding: '8px 26px', fontSize: '0.9rem' }}
                  >
                    {isTheory ? 'Hiển thị đáp án tham khảo & Phân tích' : 'Hiển thị lời giải Java & Phân tích'}
                  </button>
                </div>
              ) : (
                <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {/* Sub tabs if AGY review notes exist */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        type="button"
                        className={`btn btn-sm ${solutionSubTab === 'reference' ? 'btn-primary' : 'btn-ghost'}`}
                        onClick={() => setSolutionSubTab('reference')}
                        style={{ fontSize: '0.78rem', padding: '4px 12px' }}
                      >
                        {isTheory ? 'Đáp án tham khảo' : optimizedCode ? 'Mã nguồn tối ưu' : 'Mã nguồn tham khảo'}
                      </button>
                      {reviewMarkdown && (
                        <button
                          type="button"
                          className={`btn btn-sm ${solutionSubTab === 'review' ? 'btn-primary' : 'btn-ghost'}`}
                          onClick={() => setSolutionSubTab('review')}
                          style={{ fontSize: '0.78rem', padding: '4px 12px' }}
                        >
                          Phân tích & Đánh giá từ AGY
                        </button>
                      )}
                    </div>

                    {activeRecall && isSolutionRevealed && (
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={() => setIsSolutionRevealed(false)}
                        style={{ fontSize: '0.74rem', padding: '3px 10px' }}
                      >
                        Ẩn lại lời giải
                      </button>
                    )}
                  </div>

                  <div style={{ flex: 1, overflowY: 'auto' }}>
                    {solutionSubTab === 'review' && reviewMarkdown ? (
                      <div
                        style={{
                          backgroundColor: '#ffffff',
                          border: '1px solid var(--color-border)',
                          borderRadius: '4px',
                          padding: '18px 22px',
                        }}
                      >
                        <MarkdownNoteViewer content={reviewMarkdown} />
                      </div>
                    ) : isTheory || filePath.endsWith('.md') || (optimizedCode && optimizedCode.trim().startsWith('#')) ? (
                      <div
                        style={{
                          backgroundColor: '#ffffff',
                          border: '1px solid var(--color-border)',
                          borderRadius: '4px',
                          padding: '18px 22px',
                        }}
                      >
                        <MarkdownNoteViewer content={optimizedCode || code} />
                      </div>
                    ) : (
                      <CodeBlock
                        code={optimizedCode || code}
                        language="java"
                        filename={optimizedCode ? `${fileName.replace('.java', '')}Optimized.java` : fileName}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Toolbar & Action Buttons */}
        <div className="code-editor-toolbar">
          <div className="code-editor-toolbar-actions">
            {activeTab === 'editor' ? (
              <>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSave}
                  disabled={saving}
                  style={{ padding: '7px 18px' }}
                  title="Lưu trực tiếp vào file trong repo local (Ctrl+S)"
                >
                  {isTheory ? 'Lưu câu trả lời' : 'Lưu mã nguồn'}
                </button>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleOpenInIde}
                  style={{ padding: '7px 14px' }}
                  title="Mở thư mục dự án trong Antigravity IDE"
                >
                  Mở Antigravity IDE
                </button>

                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={handleCopyAgyPrompt}
                  style={{ padding: '7px 14px' }}
                  title="Sao chép câu lệnh hỏi AGY để phân tích và review"
                >
                  Sao chép prompt AGY
                </button>

                {hasUnsavedChanges && (
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => setCode(originalCode)}
                    style={{ padding: '7px 12px', fontSize: '0.78rem' }}
                    title="Khôi phục lại nội dung trước khi chỉnh sửa"
                  >
                    Hoàn tác
                  </button>
                )}
              </>
            ) : (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setActiveTab('editor')}
                style={{ padding: '7px 16px' }}
              >
                {isTheory ? 'Quay lại câu trả lời' : 'Quay lại soạn thảo'}
              </button>
            )}
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {problem.leetcodeUrl && (
              <a
                href={problem.leetcodeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost btn-sm"
                style={{ fontSize: '0.78rem', padding: '5px 10px' }}
              >
                LeetCode
              </a>
            )}
            {problem.neetcodeUrl && (
              <a
                href={problem.neetcodeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost btn-sm"
                style={{ fontSize: '0.78rem', padding: '5px 10px' }}
              >
                NeetCode
              </a>
            )}
            {onOpenSrsReview && 'lists' in problem && (
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => onOpenSrsReview(problem as NeetCodeProblem)}
                style={{ fontSize: '0.78rem', padding: '5px 12px' }}
                title="Mở đánh giá độ hiểu và lên lịch ôn tập SRS"
              >
                Đánh giá SRS
              </button>
            )}
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={onClose}
              style={{ padding: '5px 14px' }}
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
