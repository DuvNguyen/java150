'use client';

import React, { useRef, useEffect } from 'react';
import '@mdxeditor/editor/style.css';
import {
  MDXEditor,
  MDXEditorMethods,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  toolbarPlugin,
  BoldItalicUnderlineToggles,
  CodeToggle,
  ListsToggle,
  BlockTypeSelect,
  UndoRedo,
} from '@mdxeditor/editor';

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
  placeholder = 'Nhập ghi chú thuật toán, ý tưởng chính, bẫy / edge cases...',
  height = '300px',
  className = '',
}: Props) {
  const editorRef = useRef<MDXEditorMethods>(null);
  const internalMarkdownRef = useRef<string>(markdown);

  // Handle changes smoothly without re-triggering setMarkdown loop
  const handleChange = (newMarkdown: string) => {
    internalMarkdownRef.current = newMarkdown;
    onChange(newMarkdown);
  };

  // ONLY synchronize when markdown prop changes from an external source (e.g. clicking "+ Chèn mẫu gợi ý")
  useEffect(() => {
    if (markdown !== internalMarkdownRef.current) {
      internalMarkdownRef.current = markdown;
      if (editorRef.current) {
        editorRef.current.setMarkdown(markdown);
      }
    }
  }, [markdown]);

  return (
    <div
      className={`mdx-editor-wrapper ${className}`}
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
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '8px 12px',
        }}
      >
        <MDXEditor
          ref={editorRef}
          markdown={markdown}
          onChange={handleChange}
          placeholder={placeholder}
          contentEditableClassName="mdx-content-editable"
          plugins={[
            headingsPlugin(),
            listsPlugin(),
            quotePlugin(),
            thematicBreakPlugin(),
            markdownShortcutPlugin(),
            toolbarPlugin({
              toolbarContents: () => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
                  <UndoRedo />
                  <BlockTypeSelect />
                  <BoldItalicUnderlineToggles />
                  <CodeToggle />
                  <ListsToggle />
                </div>
              ),
            }),
          ]}
        />
      </div>
    </div>
  );
}
