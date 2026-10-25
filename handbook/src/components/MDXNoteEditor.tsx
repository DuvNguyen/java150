'use client';

import React, { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import MarkdownNoteViewer from './MarkdownNoteViewer';
import type { OnMount } from '@monaco-editor/react';

// Dynamically import Monaco Editor to avoid Next.js SSR issues
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fffdfa',
        color: 'var(--color-secondary)',
        fontSize: '0.85rem',
        fontFamily: 'var(--font-mono)',
      }}
    >
      Đang tải trình soạn thảo Monaco...
    </div>
  ),
});

interface Props {
  markdown: string;
  onChange: (markdown: string) => void;
  placeholder?: string;
  height?: string;
  className?: string;
}

export default function MDXNoteEditor({
  markdown,
  onChange,
  height = '340px',
  className = '',
}: Props) {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editorRef = useRef<any>(null);
  const internalValueRef = useRef<string>(markdown);

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;
  };

  // Only update Monaco editor programmatically when external value changes (e.g. clicking "+ Chèn mẫu gợi ý")
  useEffect(() => {
    if (markdown !== internalValueRef.current) {
      internalValueRef.current = markdown;
      if (editorRef.current && editorRef.current.getValue() !== markdown) {
        editorRef.current.setValue(markdown);
      }
    }
  }, [markdown]);

  const handleEditorChange = (val: string | undefined) => {
    const nextVal = val || '';
    internalValueRef.current = nextVal;
    onChange(nextVal);
  };

  // Helper to insert formatting in Monaco Editor without losing cursor or selection
  const insertFormatting = (
    prefix: string,
    suffix: string = '',
    defaultText: string = '',
    isLinePrefix: boolean = false
  ) => {
    const editor = editorRef.current;
    if (!editor) {
      const next = markdown
        ? `${markdown}\n${prefix}${defaultText}${suffix}`
        : `${prefix}${defaultText}${suffix}`;
      internalValueRef.current = next;
      onChange(next);
      return;
    }

    const selection = editor.getSelection();
    const model = editor.getModel();
    if (!selection || !model) return;

    if (isLinePrefix) {
      const startLine = selection.startLineNumber;
      const endLine = selection.endLineNumber;
      const edits = [];
      for (let line = startLine; line <= endLine; line++) {
        edits.push({
          range: {
            startLineNumber: line,
            startColumn: 1,
            endLineNumber: line,
            endColumn: 1,
          },
          text: prefix,
          forceMoveMarkers: true,
        });
      }
      editor.executeEdits('toolbar', edits);
      internalValueRef.current = editor.getValue();
      onChange(internalValueRef.current);
      editor.focus();
      return;
    }

    const selectedText = model.getValueInRange(selection);
    const replacement = selectedText
      ? `${prefix}${selectedText}${suffix}`
      : `${prefix}${defaultText}${suffix}`;

    editor.executeEdits('toolbar', [
      {
        range: selection,
        text: replacement,
        forceMoveMarkers: true,
      },
    ]);
    internalValueRef.current = editor.getValue();
    onChange(internalValueRef.current);
    editor.focus();
  };

  return (
    <div
      className={`monaco-markdown-wrapper ${className}`}
      style={{
        border: '1px solid var(--color-border)',
        borderRadius: '3px',
        backgroundColor: '#fffdfa',
        display: 'flex',
        flexDirection: 'column',
        height,
        minHeight: height,
        maxHeight: height,
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {/* Top Toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '4px 8px',
          backgroundColor: 'var(--color-neutral)',
          borderBottom: '1px solid var(--color-border-light)',
          flexWrap: 'wrap',
          gap: '6px',
        }}
      >
        {/* Left: Quick Formatting Tools */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '3px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => insertFormatting('**', '**', 'chữ đậm')}
            title="In đậm (Bold)"
            disabled={activeTab === 'preview'}
            className="md-tool-btn"
            style={{ fontWeight: 700 }}
          >
            B
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('*', '*', 'chữ nghiêng')}
            title="In nghiêng (Italic)"
            disabled={activeTab === 'preview'}
            className="md-tool-btn"
            style={{ fontStyle: 'italic' }}
          >
            I
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('`', '`', 'code')}
            title="Mã nội dòng (Inline Code)"
            disabled={activeTab === 'preview'}
            className="md-tool-btn"
          >
            {'</>'}
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('```java\n', '\n```', '// Code')}
            title="Khối mã (Code block)"
            disabled={activeTab === 'preview'}
            className="md-tool-btn"
          >
            {'{ }'}
          </button>

          <span style={{ width: '1px', height: '14px', backgroundColor: 'var(--color-border)', margin: '0 2px' }} />

          <button
            type="button"
            onClick={() => insertFormatting('### ', '', 'Tiêu đề mục', true)}
            title="Tiêu đề mục (Heading 3)"
            disabled={activeTab === 'preview'}
            className="md-tool-btn"
            style={{ fontWeight: 700 }}
          >
            H3
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('- ', '', 'Ý chính', true)}
            title="Danh sách gạch đầu dòng"
            disabled={activeTab === 'preview'}
            className="md-tool-btn"
          >
            • List
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('1. ', '', 'Bước thực hiện', true)}
            title="Danh sách số thứ tự"
            disabled={activeTab === 'preview'}
            className="md-tool-btn"
          >
            1. List
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('- [ ] ', '', 'Nhiệm vụ', true)}
            title="Hộp kiểm (Checklist)"
            disabled={activeTab === 'preview'}
            className="md-tool-btn"
            style={{ fontSize: '0.73rem' }}
          >
            [✓]
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('> ', '', 'Trích dẫn / Quy tắc', true)}
            title="Khối trích dẫn (>)"
            disabled={activeTab === 'preview'}
            className="md-tool-btn"
          >
            “ Quote
          </button>
        </div>

        {/* Right: Switch Mode Tabs (Soạn thảo vs Xem trước) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2px',
            backgroundColor: '#ebe5db',
            padding: '2px',
            borderRadius: '4px',
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('edit')}
            style={{
              padding: '2px 9px',
              fontSize: '0.74rem',
              fontWeight: activeTab === 'edit' ? 700 : 500,
              backgroundColor: activeTab === 'edit' ? '#fff' : 'transparent',
              color: activeTab === 'edit' ? 'var(--color-primary)' : 'var(--color-secondary)',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer',
              boxShadow: activeTab === 'edit' ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
              fontFamily: 'inherit',
              transition: 'all 0.15s ease',
            }}
          >
            Soạn thảo
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            style={{
              padding: '2px 9px',
              fontSize: '0.74rem',
              fontWeight: activeTab === 'preview' ? 700 : 500,
              backgroundColor: activeTab === 'preview' ? '#fff' : 'transparent',
              color: activeTab === 'preview' ? 'var(--color-primary)' : 'var(--color-secondary)',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer',
              boxShadow: activeTab === 'preview' ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
              fontFamily: 'inherit',
              transition: 'all 0.15s ease',
            }}
          >
            Xem trước
          </button>
        </div>
      </div>

      {/* Editor / Preview Content Area (Strictly Identical Height to Prevent Layout Shifts) */}
      <div
        style={{
          flex: 1,
          height: '100%',
          overflow: 'hidden',
          position: 'relative',
          backgroundColor: '#fffdfa',
        }}
      >
        {activeTab === 'edit' ? (
          <div style={{ height: '100%', width: '100%' }}>
            <MonacoEditor
              height="100%"
              language="markdown"
              defaultValue={markdown}
              onChange={handleEditorChange}
              theme="light"
              onMount={handleEditorDidMount}
              options={{
                fontSize: 13,
                fontFamily: "'JetBrains Mono', 'Fira Code', Menlo, Monaco, Consolas, monospace",
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                wordWrap: 'on',
                lineNumbers: 'off',
                glyphMargin: false,
                folding: false,
                lineDecorationsWidth: 6,
                lineNumbersMinChars: 0,
                renderLineHighlight: 'none',
                padding: { top: 8, bottom: 8 },
                overviewRulerLanes: 0,
                hideCursorInOverviewRuler: true,
                scrollbar: {
                  vertical: 'auto',
                  horizontal: 'hidden',
                  verticalScrollbarSize: 8,
                },
                suggestOnTriggerCharacters: false,
                quickSuggestions: false,
                autoClosingBrackets: 'never',
                autoClosingQuotes: 'never',
                autoSurround: 'never',
              }}
            />
          </div>
        ) : (
          <div
            style={{
              height: '100%',
              overflowY: 'auto',
              padding: '12px 16px',
              boxSizing: 'border-box',
              backgroundColor: '#fffdfa',
            }}
          >
            <MarkdownNoteViewer content={markdown} />
          </div>
        )}
      </div>

      <style jsx>{`
        .md-tool-btn {
          border: 1px solid transparent;
          background: transparent;
          color: var(--color-primary);
          padding: 3px 6px;
          border-radius: 3px;
          cursor: pointer;
          font-size: 0.76rem;
          line-height: 1.2;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s ease;
          font-family: inherit;
        }
        .md-tool-btn:hover:not(:disabled) {
          background-color: #fff;
          border-color: var(--color-border);
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }
        .md-tool-btn:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
