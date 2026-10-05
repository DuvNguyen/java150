'use client';

import React from 'react';
import katex from 'katex';

interface Props {
  content: string;
  className?: string;
  maxHeight?: string;
  height?: string;
  compact?: boolean;
}

export default function MarkdownNoteViewer({
  content,
  className = '',
  maxHeight,
  height,
  compact = false,
}: Props) {
  if (!content || !content.trim()) {
    if (compact) return null;
    return (
      <div
        style={{
          padding: '24px 16px',
          textAlign: 'center',
          color: 'var(--color-secondary)',
          fontStyle: 'italic',
          fontSize: '0.86rem',
          backgroundColor: 'var(--color-neutral)',
          border: '1px dashed var(--color-border)',
          borderRadius: '3px',
          height: height || 'auto',
          maxHeight: maxHeight || '380px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxSizing: 'border-box',
        }}
      >
        Chưa có nội dung ghi chú. Nhấn vào mục &quot;Soạn thảo&quot; hoặc &quot;+ Chèn mẫu gợi ý&quot; để bắt đầu.
      </div>
    );
  }

  // Parse inline elements (KaTeX, Code, Bold, Italic)
  const renderInline = (text: string): React.ReactNode => {
    // Regex for: $math$, `code`, **bold**, *italic*
    const regex = /(\$[^$]+\$|`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g;
    const parts = text.split(regex);

    return parts.map((part, idx) => {
      if (!part) return null;

      // KaTeX math: $...$
      if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
        const rawMath = part.slice(1, -1).trim();
        try {
          const html = katex.renderToString(rawMath, {
            displayMode: false,
            throwOnError: false,
          });
          return (
            <span
              key={idx}
              className="math-inline"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch {
          return <span key={idx} className="math-fallback">{rawMath}</span>;
        }
      }

      // Inline code: `...`
      if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
        return (
          <code
            key={idx}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: compact ? '0.78em' : '0.85em',
              backgroundColor: '#fff',
              border: '1px solid var(--color-border)',
              padding: '1px 5px',
              borderRadius: '3px',
              color: 'var(--color-primary)',
            }}
          >
            {part.slice(1, -1)}
          </code>
        );
      }

      // Bold: **...**
      if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
        return <strong key={idx}>{part.slice(2, -2)}</strong>;
      }

      // Italic: *...*
      if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
        return <em key={idx}>{part.slice(1, -1)}</em>;
      }

      return <React.Fragment key={idx}>{part}</React.Fragment>;
    });
  };

  // Split lines into structured markdown blocks
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let currentList: { type: 'ul' | 'ol'; items: string[] } | null = null;
  let inCodeBlock = false;
  let codeBlockLines: string[] = [];

  const flushList = () => {
    if (currentList) {
      if (currentList.type === 'ul') {
        elements.push(
          <ul
            key={`list-${elements.length}`}
            style={{
              margin: compact ? '2px 0 4px 14px' : '6px 0 12px 18px',
              padding: 0,
              lineHeight: compact ? '1.45' : '1.65',
              fontSize: compact ? '0.80rem' : '0.88rem',
              color: 'var(--color-primary)',
            }}
          >
            {currentList.items.map((it, i) => (
              <li key={i} style={{ marginBottom: compact ? '2px' : '4px' }}>
                {renderInline(it)}
              </li>
            ))}
          </ul>
        );
      } else {
        elements.push(
          <ol
            key={`list-${elements.length}`}
            style={{
              margin: compact ? '2px 0 4px 14px' : '6px 0 12px 20px',
              padding: 0,
              lineHeight: compact ? '1.45' : '1.65',
              fontSize: compact ? '0.80rem' : '0.88rem',
              color: 'var(--color-primary)',
            }}
          >
            {currentList.items.map((it, i) => (
              <li key={i} style={{ marginBottom: compact ? '2px' : '4px' }}>
                {renderInline(it)}
              </li>
            ))}
          </ol>
        );
      }
      currentList = null;
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // Code block toggle: ```
    if (trimmed.startsWith('```')) {
      if (inCodeBlock) {
        // End code block
        elements.push(
          <pre
            key={`code-${elements.length}`}
            style={{
              backgroundColor: '#2d3748',
              color: '#f7fafc',
              padding: compact ? '6px 10px' : '10px 14px',
              borderRadius: '4px',
              overflowX: 'auto',
              fontSize: compact ? '0.76rem' : '0.82rem',
              fontFamily: 'var(--font-mono)',
              margin: compact ? '4px 0 6px 0' : '8px 0 12px 0',
              lineHeight: '1.4',
            }}
          >
            <code>{codeBlockLines.join('\n')}</code>
          </pre>
        );
        codeBlockLines = [];
        inCodeBlock = false;
      } else {
        flushList();
        inCodeBlock = true;
      }
      return;
    }

    if (inCodeBlock) {
      codeBlockLines.push(line);
      return;
    }

    // Heading 3: ###
    if (trimmed.startsWith('### ')) {
      flushList();
      const title = trimmed.replace(/^###\s+/, '');
      if (compact) {
        elements.push(
          <div key={`h3-${index}`} style={{ margin: '6px 0 2px 0' }}>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                fontFamily: 'var(--font-label)',
                color: 'var(--color-tertiary)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                backgroundColor: 'rgba(180, 83, 9, 0.08)',
                padding: '1px 6px',
                borderRadius: '3px',
                display: 'inline-block',
              }}
            >
              {renderInline(title)}
            </span>
          </div>
        );
      } else {
        elements.push(
          <div
            key={`h3-${index}`}
            style={{
              margin: elements.length === 0 ? '0 0 8px 0' : '16px 0 8px 0',
              paddingBottom: '4px',
              borderBottom: '1px solid var(--color-border-light)',
            }}
          >
            <span
              style={{
                fontSize: '0.92rem',
                fontWeight: 700,
                fontFamily: 'var(--font-display)',
                color: 'var(--color-tertiary)',
                letterSpacing: '0.01em',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              {renderInline(title)}
            </span>
          </div>
        );
      }
      return;
    }

    // Heading 2: ##
    if (trimmed.startsWith('## ')) {
      flushList();
      const title = trimmed.replace(/^##\s+/, '');
      elements.push(
        <h4
          key={`h2-${index}`}
          style={{
            fontSize: compact ? '0.86rem' : '1rem',
            fontFamily: 'var(--font-display)',
            color: 'var(--color-primary)',
            margin: compact ? '8px 0 4px 0' : '18px 0 8px 0',
            borderBottom: compact ? 'none' : '1px solid var(--color-border)',
            paddingBottom: compact ? '0' : '4px',
          }}
        >
          {renderInline(title)}
        </h4>
      );
      return;
    }

    // Heading 1: #
    if (trimmed.startsWith('# ')) {
      flushList();
      const title = trimmed.replace(/^#\s+/, '');
      elements.push(
        <h3
          key={`h1-${index}`}
          style={{
            fontSize: compact ? '0.92rem' : '1.15rem',
            fontFamily: 'var(--font-display)',
            color: 'var(--color-primary)',
            margin: compact ? '8px 0 4px 0' : '18px 0 10px 0',
          }}
        >
          {renderInline(title)}
        </h3>
      );
      return;
    }

    // Unordered List: - or *
    if (/^[-*]\s+/.test(trimmed)) {
      const itemText = trimmed.replace(/^[-*]\s+/, '');
      if (!currentList || currentList.type !== 'ul') {
        flushList();
        currentList = { type: 'ul', items: [itemText] };
      } else {
        currentList.items.push(itemText);
      }
      return;
    }

    // Ordered List: 1. 2.
    if (/^\d+\.\s+/.test(trimmed)) {
      const itemText = trimmed.replace(/^\d+\.\s+/, '');
      if (!currentList || currentList.type !== 'ol') {
        flushList();
        currentList = { type: 'ol', items: [itemText] };
      } else {
        currentList.items.push(itemText);
      }
      return;
    }

    // Blockquote: >
    if (trimmed.startsWith('>')) {
      flushList();
      const quoteText = trimmed.replace(/^>\s*/, '');
      elements.push(
        <blockquote
          key={`quote-${index}`}
          style={{
            margin: compact ? '4px 0' : '8px 0',
            padding: compact ? '4px 10px' : '8px 14px',
            borderLeft: '3px solid var(--color-tertiary)',
            backgroundColor: '#fff7ed',
            fontSize: compact ? '0.80rem' : '0.86rem',
            fontStyle: 'italic',
            color: 'var(--color-primary)',
          }}
        >
          {renderInline(quoteText)}
        </blockquote>
      );
      return;
    }

    // Empty line
    if (!trimmed) {
      flushList();
      return;
    }

    // Regular paragraph
    flushList();
    elements.push(
      <p
        key={`p-${index}`}
        style={{
          margin: compact ? '2px 0 4px 0' : '0 0 8px 0',
          lineHeight: compact ? '1.5' : '1.65',
          fontSize: compact ? '0.82rem' : '0.88rem',
          color: 'var(--color-primary)',
        }}
      >
        {renderInline(line)}
      </p>
    );
  });

  flushList();

  return (
    <div
      className={`markdown-note-viewer ${className} ${compact ? 'compact' : ''}`}
      style={{
        padding: compact ? '4px 2px' : '14px 18px',
        backgroundColor: compact ? 'transparent' : '#fffdfa',
        border: compact ? 'none' : '1px solid var(--color-border)',
        borderRadius: '3px',
        height: height || 'auto',
        maxHeight: maxHeight || (compact ? '180px' : '380px'),
        overflowY: 'auto',
        boxSizing: 'border-box',
      }}
    >
      {elements}
    </div>
  );
}
