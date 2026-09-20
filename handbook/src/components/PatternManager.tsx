'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import CodeBlock from './CodeBlock';
import FormattedText from './FormattedText';
import { AlgorithmPattern, DEFAULT_PATTERNS } from '@/lib/patterns';

interface Props {
  topicId: string;
  topicName: string;
}

interface ModalState {
  open: boolean;
  mode: 'add' | 'edit';
  pattern: Partial<AlgorithmPattern>;
}

export default function PatternManager({ topicId, topicName }: Props) {
  const [patterns, setPatterns] = useState<AlgorithmPattern[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [modal, setModal] = useState<ModalState>({
    open: false,
    mode: 'add',
    pattern: {},
  });
  const [toast, setToast] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const storageKey = `patterns_data_${topicId}`;

  // Load patterns from localStorage + default patterns
  const loadPatterns = useCallback(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setPatterns(JSON.parse(saved));
      } else {
        const defaults = DEFAULT_PATTERNS[topicId] || [];
        setPatterns(defaults);
        localStorage.setItem(storageKey, JSON.stringify(defaults));
      }
    } catch {
      setPatterns(DEFAULT_PATTERNS[topicId] || []);
    }
  }, [storageKey, topicId]);

  useEffect(() => {
    loadPatterns();
  }, [loadPatterns]);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  }

  // Save patterns to localStorage
  const savePatternsToStorage = (newList: AlgorithmPattern[]) => {
    setPatterns(newList);
    try {
      localStorage.setItem(storageKey, JSON.stringify(newList));
    } catch {
      // ignore
    }
  };

  // Extract all unique tags
  const availableTags = useMemo(() => {
    const set = new Set<string>();
    for (const p of patterns) {
      if (p.tags) {
        p.tags.forEach((t) => set.add(t.trim()));
      }
    }
    return Array.from(set).sort();
  }, [patterns]);

  // Filter patterns by search query and tag
  const filteredPatterns = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const tag = selectedTag.toLowerCase().trim();

    return patterns.filter((p) => {
      // Tag filter
      if (tag && tag !== 'all') {
        const hasTag = p.tags?.some((t) => t.toLowerCase() === tag);
        if (!hasTag) return false;
      }

      // Search query
      if (q) {
        const inTitle = p.title.toLowerCase().includes(q);
        const inDesc = p.description.toLowerCase().includes(q);
        const inCode = p.code.toLowerCase().includes(q);
        const inTags = p.tags?.some((t) => t.toLowerCase().includes(q));
        if (!inTitle && !inDesc && !inCode && !inTags) return false;
      }

      return true;
    });
  }, [patterns, searchQuery, selectedTag]);

  // Modal open handlers
  const openAdd = () => {
    setModal({
      open: true,
      mode: 'add',
      pattern: {
        topicId,
        title: '',
        complexity: { time: 'O(N)', space: 'O(1)' },
        tags: [],
        description: '',
        code: `// Algorithm / Pattern template in Java
public void solve() {
    // Write your reusable logic here
}`,
      },
    });
  };

  const openEdit = (pattern: AlgorithmPattern) => {
    setModal({
      open: true,
      mode: 'edit',
      pattern: { ...pattern },
    });
  };

  const closeModal = () => {
    setModal({ open: false, mode: 'add', pattern: {} });
  };

  const handleSaveModal = () => {
    const { pattern, mode } = modal;
    if (!pattern.title || !pattern.title.trim()) {
      alert('Please enter a pattern title');
      return;
    }

    if (mode === 'add') {
      const newPattern: AlgorithmPattern = {
        id: `custom-${Date.now()}`,
        topicId,
        title: pattern.title.trim(),
        complexity: {
          time: pattern.complexity?.time || 'O(N)',
          space: pattern.complexity?.space || 'O(1)',
        },
        tags: pattern.tags || [],
        description: pattern.description || '',
        code: pattern.code || '',
        isCustom: true,
        updatedAt: Date.now(),
      };
      const updated = [newPattern, ...patterns];
      savePatternsToStorage(updated);
      showToast('Algorithm pattern added');
    } else {
      const updated = patterns.map((p) => {
        if (p.id === pattern.id) {
          return {
            ...p,
            title: pattern.title!.trim(),
            complexity: {
              time: pattern.complexity?.time || p.complexity.time,
              space: pattern.complexity?.space || p.complexity.space,
            },
            tags: pattern.tags || p.tags,
            description: pattern.description ?? p.description,
            code: pattern.code ?? p.code,
            updatedAt: Date.now(),
          };
        }
        return p;
      });
      savePatternsToStorage(updated);
      showToast('Algorithm pattern updated');
    }

    closeModal();
  };

  const handleDelete = (id: string) => {
    const updated = patterns.filter((p) => p.id !== id);
    savePatternsToStorage(updated);
    setConfirmDeleteId(null);
    showToast('Pattern deleted');
  };

  const handleResetDefaults = () => {
    if (confirm('Reset to default algorithm patterns for this topic? Any custom patterns added will be replaced.')) {
      const defaults = DEFAULT_PATTERNS[topicId] || [];
      savePatternsToStorage(defaults);
      showToast('Reset to default patterns');
    }
  };

  return (
    <div className="pattern-manager-container" style={{ marginTop: '20px' }}>
      {/* Search & Actions Bar */}
      <div className="pattern-toolbar">
        <div className="pattern-search-wrap">
          <input
            type="text"
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search algorithms & patterns in ${topicName}...`}
            style={{ padding: '10px 14px', fontSize: '0.92rem' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-primary" onClick={openAdd}>
            Add pattern
          </button>
          <button
            className="btn btn-ghost btn-sm"
            onClick={handleResetDefaults}
            title="Restore default templates"
          >
            Reset defaults
          </button>
        </div>
      </div>

      {/* Tags Filter */}
      {availableTags.length > 0 && (
        <div style={{ margin: '14px 0', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-secondary)' }}>
            Tags:
          </span>
          <button
            type="button"
            onClick={() => setSelectedTag('')}
            className={`topic-chip ${!selectedTag ? 'active' : ''}`}
            style={{
              padding: '4px 10px',
              borderRadius: '16px',
              fontSize: '0.78rem',
              fontWeight: !selectedTag ? 700 : 500,
              cursor: 'pointer',
              border: !selectedTag ? '1.5px solid var(--color-tertiary)' : '1px solid var(--color-border)',
              backgroundColor: !selectedTag ? '#990f3d' : 'var(--color-surface)',
              color: !selectedTag ? '#ffffff' : 'var(--color-primary)',
            }}
          >
            All ({patterns.length})
          </button>

          {availableTags.map((tag) => {
            const isSelected = selectedTag.toLowerCase() === tag.toLowerCase();
            const count = patterns.filter((p) => p.tags?.some((t) => t.toLowerCase() === tag.toLowerCase())).length;
            return (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(isSelected ? '' : tag)}
                className={`topic-chip ${isSelected ? 'active' : ''}`}
                style={{
                  padding: '4px 10px',
                  borderRadius: '16px',
                  fontSize: '0.78rem',
                  fontWeight: isSelected ? 700 : 500,
                  cursor: 'pointer',
                  border: isSelected ? '1.5px solid var(--color-tertiary)' : '1px solid var(--color-border)',
                  backgroundColor: isSelected ? '#990f3d' : 'var(--color-surface)',
                  color: isSelected ? '#ffffff' : 'var(--color-primary)',
                }}
              >
                {tag} ({count})
              </button>
            );
          })}
        </div>
      )}

      {/* Pattern Cards List */}
      {filteredPatterns.length === 0 ? (
        <div
          style={{
            padding: '40px 20px',
            textAlign: 'center',
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: '8px',
            margin: '20px 0',
          }}
        >
          <p style={{ color: 'var(--color-secondary)' }}>
            No patterns found {searchQuery ? `matching "${searchQuery}"` : ''}.
          </p>
          <button className="btn btn-secondary btn-sm" onClick={openAdd} style={{ marginTop: '12px' }}>
            Add first pattern template
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '16px' }}>
          {filteredPatterns.map((pat) => (
            <div
              key={pat.id}
              className="pattern-card"
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 2px 6px rgba(51, 48, 46, 0.04)',
              }}
            >
              {/* Pattern Header */}
              <div
                style={{
                  padding: '14px 18px',
                  backgroundColor: '#fff4e8',
                  borderBottom: '1px solid var(--color-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '10px',
                }}
              >
                <div>
                  <h3
                    style={{
                      fontSize: '1.15rem',
                      fontFamily: 'var(--font-display)',
                      margin: 0,
                      color: 'var(--color-primary)',
                    }}
                  >
                    {pat.title}
                  </h3>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
                    {/* Complexity badges */}
                    <span className="complexity-badge time" title="Time Complexity">
                      Time: <code>{pat.complexity.time}</code>
                    </span>
                    <span className="complexity-badge space" title="Space Complexity">
                      Space: <code>{pat.complexity.space}</code>
                    </span>

                    {/* Tags */}
                    {pat.tags?.map((t) => (
                      <span key={t} className="pattern-tag-pill">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => openEdit(pat)}
                  >
                    Edit
                  </button>

                  {confirmDeleteId === pat.id ? (
                    <>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(pat.id)}
                      >
                        Confirm
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={() => setConfirmDeleteId(null)}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => setConfirmDeleteId(pat.id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>

              {/* Pattern Description */}
              {pat.description && (
                <div style={{ padding: '12px 18px', borderBottom: '1px solid var(--color-border-light)', fontSize: '0.92rem' }}>
                  <FormattedText text={pat.description} />
                </div>
              )}

              {/* VS Code Dark+ Java Code Block */}
              <div style={{ padding: '14px 18px', backgroundColor: '#181615' }}>
                <CodeBlock code={pat.code} language="java" filename={`${pat.title.replace(/[^a-zA-Z0-9]/g, '')}.java`} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Pattern Modal */}
      {modal.open && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '780px' }}>
            <h2>{modal.mode === 'add' ? 'Add Algorithm Pattern' : 'Edit Algorithm Pattern'}</h2>

            <div className="form-field">
              <label htmlFor="field-pat-title">Pattern Title *</label>
              <input
                id="field-pat-title"
                type="text"
                value={modal.pattern.title ?? ''}
                onChange={(e) => setModal((prev) => ({ ...prev, pattern: { ...prev.pattern, title: e.target.value } }))}
                placeholder="e.g. Two Sum Pattern (One-Pass Hash Table)"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-field">
                <label htmlFor="field-pat-time">Time Complexity</label>
                <input
                  id="field-pat-time"
                  type="text"
                  value={modal.pattern.complexity?.time ?? ''}
                  onChange={(e) =>
                    setModal((prev) => ({
                      ...prev,
                      pattern: {
                        ...prev.pattern,
                        complexity: {
                          time: e.target.value,
                          space: prev.pattern.complexity?.space || 'O(1)',
                        },
                      },
                    }))
                  }
                  placeholder="e.g. O(N), O(N log K)"
                />
              </div>

              <div className="form-field">
                <label htmlFor="field-pat-space">Space Complexity</label>
                <input
                  id="field-pat-space"
                  type="text"
                  value={modal.pattern.complexity?.space ?? ''}
                  onChange={(e) =>
                    setModal((prev) => ({
                      ...prev,
                      pattern: {
                        ...prev.pattern,
                        complexity: {
                          time: prev.pattern.complexity?.time || 'O(N)',
                          space: e.target.value,
                        },
                      },
                    }))
                  }
                  placeholder="e.g. O(1), O(N)"
                />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="field-pat-tags">Tags (comma-separated)</label>
              <input
                id="field-pat-tags"
                type="text"
                value={modal.pattern.tags?.join(', ') ?? ''}
                onChange={(e) => {
                  const tagArr = e.target.value
                    .split(',')
                    .map((t) => t.trim())
                    .filter(Boolean);
                  setModal((prev) => ({ ...prev, pattern: { ...prev.pattern, tags: tagArr } }));
                }}
                placeholder="e.g. HashMap, Two Pointers, Top K"
              />
            </div>

            <div className="form-field">
              <label htmlFor="field-pat-desc">Description & When to Use</label>
              <textarea
                id="field-pat-desc"
                rows={2}
                value={modal.pattern.description ?? ''}
                onChange={(e) => setModal((prev) => ({ ...prev, pattern: { ...prev.pattern, description: e.target.value } }))}
                placeholder="Key idea, edge cases, invariants..."
              />
            </div>

            <div className="form-field">
              <label htmlFor="field-pat-code">Java Code Template *</label>
              <textarea
                id="field-pat-code"
                rows={9}
                value={modal.pattern.code ?? ''}
                onChange={(e) => setModal((prev) => ({ ...prev, pattern: { ...prev.pattern, code: e.target.value } }))}
                style={{ fontFamily: 'var(--font-mono)', fontSize: '0.88rem', lineHeight: 1.5, tabSize: 4 }}
                placeholder="// Java code snippet..."
                spellCheck={false}
              />
            </div>

            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={closeModal}>
                Cancel
              </button>
              <button id="pat-save-btn" className="btn btn-primary" onClick={handleSaveModal}>
                {modal.mode === 'add' ? 'Add Pattern' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
