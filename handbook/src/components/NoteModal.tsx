'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Entry } from './FunctionTable';

interface Props {
  isOpen: boolean;
  entry: Entry | null;
  topicId: string;
  onClose: () => void;
  onNoteChange?: (hasNote: boolean) => void;
}

export function getNoteStorageKey(topicId: string, entry: Entry): string {
  const methodKey = (entry.method || '').trim().replace(/[^a-zA-Z0-9_-]/g, '_');
  const syntaxKey = (entry.syntax || '').trim().replace(/[^a-zA-Z0-9_-]/g, '_');
  return `fn_note_${topicId}_${methodKey}_${syntaxKey}`;
}

export function getNoteUpdatedAt(topicId: string, entry: Entry): number {
  if (typeof window === 'undefined') return 0;
  const key = getNoteStorageKey(topicId, entry);
  const val = localStorage.getItem(`${key}_updatedAt`);
  return val ? parseInt(val, 10) : 0;
}

export default function NoteModal({ isOpen, entry, topicId, onClose, onNoteChange }: Props) {
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'idle'>('idle');
  const [lastSavedTime, setLastSavedTime] = useState<string>('');
  const editorRef = useRef<HTMLDivElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load existing note when opening modal
  useEffect(() => {
    if (!isOpen || !entry) return;

    const storageKey = getNoteStorageKey(topicId, entry);
    const savedContent = localStorage.getItem(storageKey) || '';

    if (editorRef.current) {
      editorRef.current.innerHTML = savedContent;
    }

    setSaveStatus(savedContent ? 'saved' : 'idle');
  }, [isOpen, entry, topicId]);

  // Handle auto-saving to localStorage with debounce
  const handleInput = useCallback(() => {
    if (!entry) return;
    setSaveStatus('saving');

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      if (!editorRef.current || !entry) return;
      const html = editorRef.current.innerHTML;
      const text = editorRef.current.innerText.trim();
      const storageKey = getNoteStorageKey(topicId, entry);
      const now = new Date();

      if (text.length > 0 && html !== '<br>') {
        localStorage.setItem(storageKey, html);
        localStorage.setItem(`${storageKey}_updatedAt`, String(now.getTime()));
        onNoteChange?.(true);
      } else {
        localStorage.removeItem(storageKey);
        localStorage.removeItem(`${storageKey}_updatedAt`);
        onNoteChange?.(false);
      }

      setSaveStatus('saved');
      setLastSavedTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      );
    }, 400);
  }, [entry, topicId, onNoteChange]);

  // Execute rich text formatting commands
  const execCmd = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
    }
    handleInput();
  };

  const insertCodeBlock = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);
    const selectedText = range.toString() || '// Your Java code here...';

    const pre = document.createElement('pre');
    pre.className = 'note-code-block';
    const code = document.createElement('code');
    code.textContent = selectedText;
    pre.appendChild(code);

    range.deleteContents();
    range.insertNode(pre);

    range.setStartAfter(pre);
    range.setEndAfter(pre);
    selection.removeAllRanges();
    selection.addRange(range);

    if (editorRef.current) editorRef.current.focus();
    handleInput();
  };

  if (!isOpen || !entry) return null;

  return (
    <div className="note-modal-overlay" onClick={onClose}>
      <div className="note-modal-box" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="note-modal-header">
          <div className="note-title-wrap">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span className="note-topic-badge">{entry.topic || topicId}</span>
              <h2 className="note-title">
                <code>{entry.method}</code> Note
              </h2>
            </div>
            <div className="note-syntax-sub">
              <code>{entry.syntax}</code>
              {entry.returns && (
                <span className="note-return-badge">
                  Returns: <code>{entry.returns}</code>
                </span>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Auto-save status */}
            <div className="autosave-status">
              {saveStatus === 'saving' && (
                <span className="saving-text">Saving...</span>
              )}
              {saveStatus === 'saved' && (
                <span className="saved-text">
                  Saved {lastSavedTime && <span style={{ opacity: 0.7 }}>({lastSavedTime})</span>}
                </span>
              )}
              {saveStatus === 'idle' && (
                <span style={{ color: 'var(--color-secondary)', fontSize: '0.78rem' }}>
                  Auto-save enabled
                </span>
              )}
            </div>

            <button
              onClick={onClose}
              className="note-close-btn"
              title="Close (Esc)"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Rich Text Editor Toolbar */}
        <div className="rich-editor-toolbar">
          <div className="toolbar-group">
            <button
              type="button"
              className="toolbar-btn"
              onClick={() => execCmd('bold')}
              title="Bold (Ctrl+B)"
            >
              <strong>B</strong>
            </button>
            <button
              type="button"
              className="toolbar-btn"
              onClick={() => execCmd('italic')}
              title="Italic (Ctrl+I)"
            >
              <em>I</em>
            </button>
            <button
              type="button"
              className="toolbar-btn"
              onClick={() => execCmd('underline')}
              title="Underline (Ctrl+U)"
            >
              <u>U</u>
            </button>
            <button
              type="button"
              className="toolbar-btn"
              onClick={() => execCmd('strikeThrough')}
              title="Strikethrough"
            >
              <s>S</s>
            </button>
          </div>

          <div className="toolbar-divider" />

          <div className="toolbar-group">
            <button
              type="button"
              className="toolbar-btn"
              onClick={() => execCmd('formatBlock', '<h3>')}
              title="Heading"
            >
              H3
            </button>
            <button
              type="button"
              className="toolbar-btn"
              onClick={() => execCmd('formatBlock', '<p>')}
              title="Paragraph"
            >
              P
            </button>
          </div>

          <div className="toolbar-divider" />

          <div className="toolbar-group">
            <button
              type="button"
              className="toolbar-btn"
              onClick={() => execCmd('insertUnorderedList')}
              title="Bullet list"
            >
              Bullet
            </button>
            <button
              type="button"
              className="toolbar-btn"
              onClick={() => execCmd('insertOrderedList')}
              title="Numbered list"
            >
              Number
            </button>
          </div>

          <div className="toolbar-divider" />

          <div className="toolbar-group">
            <button
              type="button"
              className="toolbar-btn"
              onClick={() => execCmd('formatBlock', '<blockquote>')}
              title="Quote"
            >
              Quote
            </button>
            <button
              type="button"
              className="toolbar-btn"
              onClick={insertCodeBlock}
              title="Code block"
            >
              Code
            </button>
            <button
              type="button"
              className="toolbar-btn"
              onClick={() => execCmd('removeFormat')}
              title="Clear formatting"
            >
              Clear
            </button>
          </div>
        </div>

        {/* ContentEditable Area */}
        <div
          ref={editorRef}
          className="rich-editor-content"
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          data-placeholder="Write your personal notes, edge cases, DSA tricks, examples, or reminders for this function here... (auto-saves like Google Docs)"
        />

        {/* Footer */}
        <div className="note-modal-footer">
          <span style={{ fontSize: '0.75rem', color: 'var(--color-secondary)' }}>
            Tip: Changes are automatically saved to your browser. You can format text using the toolbar or keyboard shortcuts.
          </span>
          <button className="btn btn-primary btn-sm" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
