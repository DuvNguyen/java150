'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import CodeBlock from './CodeBlock';
import FormattedText from './FormattedText';
import { AlgorithmPattern, DEFAULT_PATTERNS, UseCaseItem } from '@/lib/patterns';

interface Props {
  topicId: string;
  topicName: string;
}

interface ModalState {
  open: boolean;
  mode: 'add' | 'edit';
  pattern: Partial<AlgorithmPattern>;
}

type SubTabType = 'idea' | 'pseudo' | 'usecases' | 'code';
type CardTabType = 'code' | 'pseudo' | 'idea' | 'usecases';

export default function PatternManager({ topicId, topicName }: Props) {
  const [patterns, setPatterns] = useState<AlgorithmPattern[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
  const [modal, setModal] = useState<ModalState>({
    open: false,
    mode: 'add',
    pattern: {},
  });
  const [modalSubTab, setModalSubTab] = useState<SubTabType>('idea');
  const [previewCodeInModal, setPreviewCodeInModal] = useState(false);
  const [cardTabs, setCardTabs] = useState<Record<string, CardTabType>>({});
  const [toast, setToast] = useState('');
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [newTagInput, setNewTagInput] = useState('');
  const [tagManagerOpen, setTagManagerOpen] = useState(false);
  const [editingTagOriginal, setEditingTagOriginal] = useState<string | null>(null);
  const [editingTagName, setEditingTagName] = useState('');
  const [newTopicTagInput, setNewTopicTagInput] = useState('');
  const [customTags, setCustomTags] = useState<string[]>([]);

  const storageKey = `patterns_data_${topicId}`;
  const customTagsStorageKey = `topic_tags_custom_${topicId}`;

  // Close action dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (!target.closest('.action-dropdown-wrap')) {
        setOpenActionMenuId(null);
        setConfirmDeleteId(null);
      }
    }
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  // Load custom tags from localStorage
  useEffect(() => {
    try {
      const savedTags = localStorage.getItem(customTagsStorageKey);
      if (savedTags) {
        setCustomTags(JSON.parse(savedTags));
      }
    } catch {
      // ignore
    }
  }, [customTagsStorageKey]);

  // Load patterns from localStorage + default patterns
  const loadPatterns = useCallback(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed: AlgorithmPattern[] = JSON.parse(saved);
        // Merge useCases from defaults if pattern came from defaults but didn't have useCases saved earlier
        const defaults = DEFAULT_PATTERNS[topicId] || [];
        const merged = parsed.map((p) => {
          if (!p.useCases || p.useCases.length === 0) {
            const defMatch = defaults.find((d) => d.id === p.id);
            if (defMatch?.useCases) {
              return { ...p, useCases: defMatch.useCases };
            }
          }
          return p;
        });
        setPatterns(merged);
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

  // Save custom tags to localStorage
  const saveCustomTagsToStorage = (newList: string[]) => {
    setCustomTags(newList);
    try {
      localStorage.setItem(customTagsStorageKey, JSON.stringify(newList));
    } catch {
      // ignore
    }
  };

  // Extract all unique tags (from patterns + custom tags with case-insensitive deduplication)
  const availableTags = useMemo(() => {
    const map = new Map<string, string>();
    for (const p of patterns) {
      if (p.tags) {
        p.tags.forEach((t) => {
          const trimmed = t.trim();
          if (trimmed) {
            const lower = trimmed.toLowerCase();
            if (!map.has(lower)) {
              map.set(lower, trimmed);
            }
          }
        });
      }
    }
    for (const t of customTags) {
      const trimmed = t.trim();
      if (trimmed) {
        const lower = trimmed.toLowerCase();
        if (!map.has(lower)) {
          map.set(lower, trimmed);
        }
      }
    }
    return Array.from(map.values()).sort((a, b) =>
      a.localeCompare(b, undefined, { sensitivity: 'base' })
    );
  }, [patterns, customTags]);

  // Tag helper functions for modal (Strict case-insensitivity: Sort = sort)
  const handleAddTagToModal = (tagToAdd?: string) => {
    const raw = (tagToAdd ?? newTagInput).trim();
    if (!raw) return;

    // Treat case-insensitively: check if already in modal tags
    const currentTags = modal.pattern.tags || [];
    const isAlreadyPresent = currentTags.some(
      (t) => t.trim().toLowerCase() === raw.toLowerCase()
    );
    if (isAlreadyPresent) {
      setNewTagInput('');
      return;
    }

    // Match existing canonical casing if found in availableTags, else use raw input
    const existingMatch = availableTags.find(
      (t) => t.toLowerCase() === raw.toLowerCase()
    );
    const canonicalTag = existingMatch || raw;

    setModal((prev) => ({
      ...prev,
      pattern: {
        ...prev.pattern,
        tags: [...(prev.pattern.tags || []), canonicalTag],
      },
    }));
    setNewTagInput('');
  };

  const handleRemoveTagFromModal = (tagToRemove: string) => {
    setModal((prev) => ({
      ...prev,
      pattern: {
        ...prev.pattern,
        tags: (prev.pattern.tags || []).filter(
          (t) => t.trim().toLowerCase() !== tagToRemove.trim().toLowerCase()
        ),
      },
    }));
  };

  const handleToggleTagInModal = (tag: string) => {
    const currentTags = modal.pattern.tags || [];
    const exists = currentTags.some(
      (t) => t.trim().toLowerCase() === tag.trim().toLowerCase()
    );
    if (exists) {
      handleRemoveTagFromModal(tag);
    } else {
      handleAddTagToModal(tag);
    }
  };

  // Use Case handlers for modal
  const handleAddUseCaseRow = () => {
    setModal((prev) => ({
      ...prev,
      pattern: {
        ...prev.pattern,
        useCases: [
          ...(prev.pattern.useCases || []),
          { title: '', whenToUse: '', complexity: '', example: '' },
        ],
      },
    }));
  };

  const handleUpdateUseCaseRow = (index: number, field: keyof UseCaseItem, value: string) => {
    setModal((prev) => {
      const list = [...(prev.pattern.useCases || [])];
      list[index] = { ...list[index], [field]: value };
      return {
        ...prev,
        pattern: {
          ...prev.pattern,
          useCases: list,
        },
      };
    });
  };

  const handleRemoveUseCaseRow = (index: number) => {
    setModal((prev) => {
      const list = (prev.pattern.useCases || []).filter((_, i) => i !== index);
      return {
        ...prev,
        pattern: {
          ...prev.pattern,
          useCases: list,
        },
      };
    });
  };

  // Create new tag globally from Tag Manager
  const handleCreateTopicTag = () => {
    const raw = newTopicTagInput.trim();
    if (!raw) return;

    const exists = availableTags.some((t) => t.toLowerCase() === raw.toLowerCase());
    if (exists) {
      showToast(`Tag "${raw}" already exists`);
      setNewTopicTagInput('');
      return;
    }

    const updated = [...customTags, raw];
    saveCustomTagsToStorage(updated);
    setNewTopicTagInput('');
    showToast(`Created tag "${raw}"`);
  };

  // Global tag management (rename & delete across all patterns and custom tags)
  const handleRenameTag = (oldTag: string, newTagName: string) => {
    const trimmed = newTagName.trim();
    if (!trimmed || trimmed.toLowerCase() === oldTag.toLowerCase()) {
      setEditingTagOriginal(null);
      return;
    }

    // Update in patterns
    const updatedPatterns = patterns.map((p) => {
      if (!p.tags || p.tags.length === 0) return p;
      const hasOld = p.tags.some((t) => t.toLowerCase() === oldTag.toLowerCase());
      if (!hasOld) return p;

      const newTags: string[] = [];
      p.tags.forEach((t) => {
        const isTarget = t.toLowerCase() === oldTag.toLowerCase();
        const tagToPush = isTarget ? trimmed : t;
        if (!newTags.some((x) => x.toLowerCase() === tagToPush.toLowerCase())) {
          newTags.push(tagToPush);
        }
      });

      return {
        ...p,
        tags: newTags,
        updatedAt: Date.now(),
      };
    });
    savePatternsToStorage(updatedPatterns);

    // Update in customTags
    const updatedCustomTags = customTags.map((t) =>
      t.toLowerCase() === oldTag.toLowerCase() ? trimmed : t
    );
    saveCustomTagsToStorage(updatedCustomTags);

    // Update in current open modal pattern if applicable
    if (modal.open && modal.pattern.tags) {
      setModal((prev) => ({
        ...prev,
        pattern: {
          ...prev.pattern,
          tags: prev.pattern.tags?.map((t) =>
            t.toLowerCase() === oldTag.toLowerCase() ? trimmed : t
          ),
        },
      }));
    }

    if (selectedTag.toLowerCase() === oldTag.toLowerCase()) {
      setSelectedTag(trimmed);
    }
    setEditingTagOriginal(null);
    showToast(`Renamed tag "${oldTag}" -> "${trimmed}"`);
  };

  const handleDeleteTagGlobally = (tagToDelete: string) => {
    if (confirm(`Delete tag "${tagToDelete}" completely from all patterns in this topic?`)) {
      // Remove from patterns
      const updatedPatterns = patterns.map((p) => {
        if (!p.tags) return p;
        return {
          ...p,
          tags: p.tags.filter((t) => t.toLowerCase() !== tagToDelete.toLowerCase()),
          updatedAt: Date.now(),
        };
      });
      savePatternsToStorage(updatedPatterns);

      // Remove from customTags
      const updatedCustom = customTags.filter(
        (t) => t.toLowerCase() !== tagToDelete.toLowerCase()
      );
      saveCustomTagsToStorage(updatedCustom);

      // Remove from current open modal if present
      if (modal.open && modal.pattern.tags) {
        setModal((prev) => ({
          ...prev,
          pattern: {
            ...prev.pattern,
            tags: prev.pattern.tags?.filter(
              (t) => t.toLowerCase() !== tagToDelete.toLowerCase()
            ),
          },
        }));
      }

      if (selectedTag.toLowerCase() === tagToDelete.toLowerCase()) {
        setSelectedTag('');
      }
      showToast(`Deleted tag "${tagToDelete}"`);
    }
  };

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
        const inPseudo = p.pseudoCode ? p.pseudoCode.toLowerCase().includes(q) : false;
        const inCode = p.code.toLowerCase().includes(q);
        const inTags = p.tags?.some((t) => t.toLowerCase().includes(q));
        if (!inTitle && !inDesc && !inPseudo && !inCode && !inTags) return false;
      }

      return true;
    });
  }, [patterns, searchQuery, selectedTag]);

  const allExpanded = useMemo(() => {
    return filteredPatterns.length > 0 && filteredPatterns.every((p) => expandedIds[p.id]);
  }, [filteredPatterns, expandedIds]);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleToggleAll = () => {
    if (allExpanded) {
      setExpandedIds({});
    } else {
      const next: Record<string, boolean> = {};
      filteredPatterns.forEach((p) => {
        next[p.id] = true;
      });
      setExpandedIds(next);
    }
  };

  // Modal open handlers
  const openAdd = () => {
    setModalSubTab('idea');
    setPreviewCodeInModal(false);
    setNewTagInput('');
    setModal({
      open: true,
      mode: 'add',
      pattern: {
        topicId,
        title: '',
        complexity: { time: 'O(N)', space: 'O(1)' },
        tags: [],
        description: '',
        useCases: [],
        pseudoCode: `1. Initialize data structures
2. Traverse input elements:
     Process state and check invariants
3. Return computed result`,
        code: `// Algorithm / Pattern template in Java
public void solve() {
    // Write your reusable logic here
}`,
      },
    });
  };

  const openEdit = (pattern: AlgorithmPattern) => {
    setModalSubTab('idea');
    setPreviewCodeInModal(false);
    setNewTagInput('');
    setModal({
      open: true,
      mode: 'edit',
      pattern: {
        ...pattern,
        useCases: pattern.useCases ? [...pattern.useCases] : [],
      },
    });
  };

  const closeModal = () => {
    setNewTagInput('');
    setModal({ open: false, mode: 'add', pattern: {} });
  };

  const handleSaveModal = () => {
    const { pattern, mode } = modal;
    if (!pattern.title || !pattern.title.trim()) {
      alert('Please enter a pattern title');
      return;
    }

    // Deduplicate tags case-insensitively
    const sanitizedTags = (pattern.tags || [])
      .map((t) => t.trim())
      .filter(Boolean)
      .filter(
        (tag, index, self) =>
          self.findIndex((t) => t.toLowerCase() === tag.toLowerCase()) === index
      );

    const sanitizedUseCases = (pattern.useCases || [])
      .filter((uc) => uc.title?.trim() || uc.whenToUse?.trim())
      .map((uc) => ({
        title: uc.title?.trim() || 'Trường hợp sử dụng',
        whenToUse: uc.whenToUse?.trim() || '',
        complexity: uc.complexity?.trim() || '',
        example: uc.example?.trim() || '',
      }));

    if (mode === 'add') {
      const newPattern: AlgorithmPattern = {
        id: `custom-${Date.now()}`,
        topicId,
        title: pattern.title.trim(),
        complexity: {
          time: pattern.complexity?.time || 'O(N)',
          space: pattern.complexity?.space || 'O(1)',
        },
        tags: sanitizedTags,
        description: pattern.description || '',
        useCases: sanitizedUseCases,
        pseudoCode: pattern.pseudoCode || '',
        code: pattern.code || '',
        isCustom: true,
        updatedAt: Date.now(),
      };
      const updated = [newPattern, ...patterns];
      savePatternsToStorage(updated);
      setExpandedIds((prev) => ({ ...prev, [newPattern.id]: true }));
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
            tags: sanitizedTags,
            description: pattern.description ?? p.description,
            useCases: sanitizedUseCases,
            pseudoCode: pattern.pseudoCode ?? p.pseudoCode,
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
      setExpandedIds({});
      showToast('Reset to default patterns');
    }
  };

  const setCardActiveTab = (id: string, tab: CardTabType) => {
    setCardTabs((prev) => ({ ...prev, [id]: tab }));
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

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          {filteredPatterns.length > 0 && (
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={handleToggleAll}
              title={allExpanded ? 'Collapse all patterns' : 'Expand all patterns'}
            >
              {allExpanded ? 'Collapse all' : 'Expand all'}
            </button>
          )}

          <button className="btn btn-primary btn-sm" onClick={openAdd}>
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

          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => setTagManagerOpen(true)}
            title="Manage all topic tags"
            style={{ fontSize: '0.74rem', padding: '3px 10px', marginLeft: 'auto' }}
          >
            Manage tags
          </button>
        </div>
      )}

      {/* Pattern Cards List (Minimized / Collapsed by default) */}
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px' }}>
          {filteredPatterns.map((pat) => {
            const isExpanded = Boolean(expandedIds[pat.id]);
            const activeCardTab = cardTabs[pat.id] || 'code';
            const isMenuOpen = openActionMenuId === pat.id;

            return (
              <div
                key={pat.id}
                className={`pattern-card ${isExpanded ? 'expanded' : 'collapsed'}`}
                style={{ zIndex: isMenuOpen ? 50 : undefined }}
              >
                {/* Collapsible Pattern Header */}
                <div
                  className="pattern-card-header"
                  onClick={() => toggleExpand(pat.id)}
                  title={isExpanded ? 'Click to minimize' : 'Click to expand'}
                >
                  <div className="pattern-card-title-group">
                    <button
                      type="button"
                      className="pattern-expand-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleExpand(pat.id);
                      }}
                      title={isExpanded ? 'Minimize' : 'Expand'}
                    >
                      {isExpanded ? '−' : '+'}
                    </button>

                    <div>
                      <h3 className="pattern-card-title">{pat.title}</h3>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', flexWrap: 'wrap' }}>
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
                  </div>

                  {/* Action Dropdown Menu */}
                  <div
                    className="action-dropdown-wrap"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      className={`action-menu-trigger ${openActionMenuId === pat.id ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenActionMenuId(openActionMenuId === pat.id ? null : pat.id);
                        setConfirmDeleteId(null);
                      }}
                      title="Actions"
                      aria-label="Actions"
                    >
                      ⋮
                    </button>

                    {openActionMenuId === pat.id && (
                      <div className="action-dropdown-menu">
                        <button
                          type="button"
                          className="action-menu-item"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenActionMenuId(null);
                            openEdit(pat);
                          }}
                        >
                          Edit
                        </button>

                        {confirmDeleteId === pat.id ? (
                          <button
                            type="button"
                            className="action-menu-item delete"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(pat.id);
                            }}
                            style={{ fontWeight: 700, color: '#b91c1c' }}
                          >
                            Confirm delete
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="action-menu-item delete"
                            onClick={(e) => {
                              e.stopPropagation();
                              setConfirmDeleteId(pat.id);
                            }}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Expanded Body with Subtabs */}
                {isExpanded && (
                  <div className="pattern-card-body" style={{ animation: 'fadeIn 0.15s ease' }}>
                    {/* Subtabs Navigation on Card */}
                    <div className="card-subtabs-nav">
                      <button
                        type="button"
                        className={`card-subtab-btn ${activeCardTab === 'code' ? 'active' : ''}`}
                        onClick={() => setCardActiveTab(pat.id, 'code')}
                      >
                        Java Implementation
                      </button>
                      {pat.pseudoCode && (
                        <button
                          type="button"
                          className={`card-subtab-btn ${activeCardTab === 'pseudo' ? 'active' : ''}`}
                          onClick={() => setCardActiveTab(pat.id, 'pseudo')}
                        >
                          Pseudo Code
                        </button>
                      )}
                      {pat.description && (
                        <button
                          type="button"
                          className={`card-subtab-btn ${activeCardTab === 'idea' ? 'active' : ''}`}
                          onClick={() => setCardActiveTab(pat.id, 'idea')}
                        >
                          Idea & Strategy
                        </button>
                      )}
                      <button
                        type="button"
                        className={`card-subtab-btn ${activeCardTab === 'usecases' ? 'active' : ''}`}
                        onClick={() => setCardActiveTab(pat.id, 'usecases')}
                      >
                        Use Cases {pat.useCases && pat.useCases.length > 0 ? `(${pat.useCases.length})` : ''}
                      </button>
                    </div>

                    {/* Card Tab Content */}
                    {activeCardTab === 'code' && (
                      <div style={{ padding: '14px 18px', backgroundColor: '#ffffff' }}>
                        <CodeBlock code={pat.code} language="java" filename={`${pat.title.replace(/[^a-zA-Z0-9]/g, '')}.java`} />
                      </div>
                    )}

                    {activeCardTab === 'pseudo' && pat.pseudoCode && (
                      <div style={{ padding: '16px 20px', backgroundColor: '#ffffff' }}>
                        <pre
                          style={{
                            margin: 0,
                            padding: '14px 18px',
                            backgroundColor: '#faf8f5',
                            border: '1px solid #e2ded9',
                            borderRadius: '6px',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.92rem',
                            fontWeight: 500,
                            lineHeight: 1.65,
                            color: '#000000',
                            whiteSpace: 'pre-wrap',
                          }}
                        >
                          {pat.pseudoCode}
                        </pre>
                      </div>
                    )}

                    {activeCardTab === 'idea' && pat.description && (
                      <div style={{ padding: '16px 20px', backgroundColor: '#ffffff', fontSize: '0.95rem', lineHeight: 1.65 }}>
                        <FormattedText text={pat.description} />
                      </div>
                    )}

                    {activeCardTab === 'usecases' && (
                      <div style={{ padding: '16px 20px', backgroundColor: '#ffffff' }}>
                        {pat.useCases && pat.useCases.length > 0 ? (
                          <div className="fn-table-wrap">
                            <table className="fn-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                              <thead>
                                <tr>
                                  <th style={{ width: '25%', padding: '10px 14px' }}>Trường hợp / Tình huống</th>
                                  <th style={{ width: '38%', padding: '10px 14px' }}>Đặc điểm & Khi nào áp dụng</th>
                                  <th style={{ width: '15%', padding: '10px 14px' }}>Độ phức tạp</th>
                                  <th style={{ width: '22%', padding: '10px 14px' }}>Ví dụ / Bài toán</th>
                                </tr>
                              </thead>
                              <tbody>
                                {pat.useCases.map((uc, i) => (
                                  <tr key={i} style={{ borderBottom: '1px solid var(--color-border-light)' }}>
                                    <td style={{ fontWeight: 600, color: 'var(--color-primary)', padding: '10px 14px' }}>
                                      <FormattedText text={uc.title} />
                                    </td>
                                    <td style={{ fontSize: '0.9rem', lineHeight: 1.55, padding: '10px 14px' }}>
                                      <FormattedText text={uc.whenToUse} />
                                    </td>
                                    <td style={{ padding: '10px 14px' }}>
                                      {uc.complexity ? (
                                        <span className="complexity-badge time">
                                          <code>{uc.complexity}</code>
                                        </span>
                                      ) : (
                                        <span style={{ color: 'var(--color-secondary)', fontSize: '0.8rem' }}>-</span>
                                      )}
                                    </td>
                                    <td style={{ fontSize: '0.88rem', color: 'var(--color-secondary)', padding: '10px 14px' }}>
                                      <FormattedText text={uc.example || '-'} />
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div
                            style={{
                              padding: '24px',
                              textAlign: 'center',
                              backgroundColor: 'var(--color-surface)',
                              borderRadius: '6px',
                              border: '1px dashed var(--color-border)',
                            }}
                          >
                            <p style={{ color: 'var(--color-secondary)', fontSize: '0.9rem', margin: 0 }}>
                              Chưa có trường hợp sử dụng cụ thể nào được lưu cho thuật toán này.
                            </p>
                            <button
                              type="button"
                              className="btn btn-secondary btn-sm"
                              onClick={() => {
                                openEdit(pat);
                                setModalSubTab('usecases');
                              }}
                              style={{ marginTop: '10px' }}
                            >
                              + Thêm Use Cases
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add Button at Bottom of Patterns List */}
      <div className="add-row-bar" style={{ marginTop: '16px' }}>
        <button id="add-pattern-btn-bottom" className="btn btn-primary" onClick={openAdd}>
          Add entry
        </button>
      </div>

      {/* Add / Edit Pattern Modal with Subtabs */}
      {modal.open && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '820px', width: '92vw' }}>
            <h2 style={{ marginBottom: '14px' }}>
              {modal.mode === 'add' ? 'Add Algorithm Pattern' : 'Edit Algorithm Pattern'}
            </h2>

            {/* General Metadata Fields */}
            <div className="form-field" style={{ marginBottom: '12px' }}>
              <label htmlFor="field-pat-title">Pattern Title *</label>
              <input
                id="field-pat-title"
                type="text"
                value={modal.pattern.title ?? ''}
                onChange={(e) => setModal((prev) => ({ ...prev, pattern: { ...prev.pattern, title: e.target.value } }))}
                placeholder="e.g. Two Sum Pattern (One-Pass Hash Table)"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
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
                  placeholder="e.g. O(N), O(log N)"
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

            {/* Tag Management inside Modal */}
            <div className="form-field" style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '4px' }}>
                <label htmlFor="field-pat-tag-input" style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                  Tags
                </label>
                <span style={{ fontSize: '0.74rem', color: 'var(--color-secondary)' }}>
                  Case-insensitive (e.g. <code>Sort = sort</code>)
                </span>
              </div>

              <div className="modal-tags-box">
                {/* Active selected tags on this pattern */}
                <div className="modal-selected-tags">
                  {modal.pattern.tags && modal.pattern.tags.length > 0 ? (
                    modal.pattern.tags.map((t) => (
                      <span key={t} className="modal-tag-pill">
                        {t}
                        <button
                          type="button"
                          className="modal-tag-pill-remove"
                          onClick={() => handleRemoveTagFromModal(t)}
                          title={`Remove tag ${t}`}
                          aria-label={`Remove tag ${t}`}
                        >
                          ✕
                        </button>
                      </span>
                    ))
                  ) : (
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-secondary)', fontStyle: 'italic' }}>
                      No tags added yet. Type below to create a new tag or click an existing tag to assign.
                    </span>
                  )}
                </div>

                {/* Tag Input with Enter / Comma / Button handling */}
                <div className="modal-tag-input-row">
                  <input
                    id="field-pat-tag-input"
                    type="text"
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ',') {
                        e.preventDefault();
                        handleAddTagToModal();
                      }
                    }}
                    placeholder="Type tag name and press Enter to add..."
                  />
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleAddTagToModal()}
                    disabled={!newTagInput.trim()}
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    + Add Tag
                  </button>
                </div>

                {/* Available Topic Tags Suggestions / Quick Selector */}
                {availableTags.length > 0 && (
                  <div className="modal-tag-suggestions">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '2px' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--color-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>
                        Topic Tags:
                      </span>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={() => setTagManagerOpen(true)}
                        style={{ fontSize: '0.72rem', padding: '1px 7px', color: 'var(--color-tertiary)' }}
                        title="Manage, rename or delete tags in this topic"
                      >
                        Manage / Delete Tags
                      </button>
                    </div>
                    {availableTags
                      .filter((t) => !newTagInput.trim() || t.toLowerCase().includes(newTagInput.trim().toLowerCase()))
                      .map((t) => {
                        const isSelected = modal.pattern.tags?.some(
                          (tag) => tag.toLowerCase() === t.toLowerCase()
                        );
                        return (
                          <button
                            key={t}
                            type="button"
                            className={`modal-tag-chip-btn ${isSelected ? 'selected' : ''}`}
                            onClick={() => handleToggleTagInModal(t)}
                            title={isSelected ? `Click to unassign ${t}` : `Click to assign ${t}`}
                          >
                            {isSelected ? `✓ ${t}` : `+ ${t}`}
                          </button>
                        );
                      })}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Subtabs Navigation */}
            <div className="modal-subtabs-nav">
              <button
                type="button"
                className={`modal-subtab-btn ${modalSubTab === 'idea' ? 'active' : ''}`}
                onClick={() => setModalSubTab('idea')}
              >
                Idea & Strategy
              </button>

              <button
                type="button"
                className={`modal-subtab-btn ${modalSubTab === 'pseudo' ? 'active' : ''}`}
                onClick={() => setModalSubTab('pseudo')}
              >
                Pseudo Code
              </button>

              <button
                type="button"
                className={`modal-subtab-btn ${modalSubTab === 'usecases' ? 'active' : ''}`}
                onClick={() => setModalSubTab('usecases')}
              >
                Use Cases {modal.pattern.useCases?.length ? `(${modal.pattern.useCases.length})` : ''}
              </button>

              <button
                type="button"
                className={`modal-subtab-btn ${modalSubTab === 'code' ? 'active' : ''}`}
                onClick={() => setModalSubTab('code')}
              >
                Java Implementation
              </button>
            </div>

            {/* Modal Subtab 1: Idea & Strategy */}
            {modalSubTab === 'idea' && (
              <div className="modal-tab-pane">
                <div className="form-field">
                  <label htmlFor="field-pat-desc">Idea, Intuition & When to Use</label>
                  <textarea
                    id="field-pat-desc"
                    rows={8}
                    value={modal.pattern.description ?? ''}
                    onChange={(e) => setModal((prev) => ({ ...prev, pattern: { ...prev.pattern, description: e.target.value } }))}
                    placeholder="Mô tả ý tưởng cốt lõi, điều kiện biên (edge cases), bất biến (invariants), khi nào nên áp dụng pattern này..."
                    style={{ lineHeight: 1.6 }}
                  />
                </div>
              </div>
            )}

            {/* Modal Subtab 2: Pseudo Code */}
            {modalSubTab === 'pseudo' && (
              <div className="modal-tab-pane">
                <div className="form-field">
                  <label htmlFor="field-pat-pseudo">Pseudo Code / Step-by-Step Logic</label>
                  <textarea
                    id="field-pat-pseudo"
                    rows={8}
                    value={modal.pattern.pseudoCode ?? ''}
                    onChange={(e) => setModal((prev) => ({ ...prev, pattern: { ...prev.pattern, pseudoCode: e.target.value } }))}
                    placeholder={`1. Step one: Initialize data structures\n2. Step two: Loop through elements\n3. Step three: Return result`}
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '0.92rem', fontWeight: 500, lineHeight: 1.6 }}
                    spellCheck={false}
                  />
                </div>
              </div>
            )}

            {/* Modal Subtab 3: Use Cases */}
            {modalSubTab === 'usecases' && (
              <div className="modal-tab-pane">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div>
                    <label style={{ fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--color-secondary)' }}>
                      Trường hợp sử dụng & Bài toán mẫu (Use Cases)
                    </label>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-secondary)', margin: 0 }}>
                      Ghi chú các tình huống áp dụng thuật toán. Sẽ hiển thị dưới dạng bảng trực quan.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={handleAddUseCaseRow}
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    + Thêm trường hợp
                  </button>
                </div>

                {(!modal.pattern.useCases || modal.pattern.useCases.length === 0) ? (
                  <div
                    style={{
                      padding: '24px',
                      textAlign: 'center',
                      backgroundColor: '#ffffff',
                      borderRadius: '6px',
                      border: '1px dashed var(--color-border)',
                    }}
                  >
                    <p style={{ color: 'var(--color-secondary)', fontSize: '0.88rem', margin: 0 }}>
                      Chưa có trường hợp sử dụng nào. Hãy bấm nút bên dưới để thêm ghi chú trường hợp đầu tiên.
                    </p>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={handleAddUseCaseRow}
                      style={{ marginTop: '10px' }}
                    >
                      + Thêm trường hợp (Use Case)
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {modal.pattern.useCases.map((uc, index) => (
                      <div
                        key={index}
                        style={{
                          padding: '12px 14px',
                          backgroundColor: '#ffffff',
                          border: '1px solid var(--color-border)',
                          borderRadius: '6px',
                          position: 'relative',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--color-tertiary)' }}>
                            Trường hợp #{index + 1}
                          </span>
                          <button
                            type="button"
                            className="btn btn-ghost btn-sm"
                            onClick={() => handleRemoveUseCaseRow(index)}
                            title="Xóa trường hợp này"
                            style={{ padding: '1px 6px', color: '#b91c1c', fontSize: '0.78rem' }}
                          >
                            ✕ Xóa
                          </button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '10px', marginBottom: '8px' }}>
                          <div className="form-field" style={{ margin: 0 }}>
                            <label style={{ fontSize: '0.72rem', marginBottom: '3px' }}>Tên trường hợp / Tình huống *</label>
                            <input
                              type="text"
                              value={uc.title}
                              onChange={(e) => handleUpdateUseCaseRow(index, 'title', e.target.value)}
                              placeholder="Ví dụ: Mảng số nguyên dải hẹp (0-100)"
                              style={{ fontSize: '0.85rem', padding: '6px 10px' }}
                            />
                          </div>

                          <div className="form-field" style={{ margin: 0 }}>
                            <label style={{ fontSize: '0.72rem', marginBottom: '3px' }}>Độ phức tạp (Complexity)</label>
                            <input
                              type="text"
                              value={uc.complexity ?? ''}
                              onChange={(e) => handleUpdateUseCaseRow(index, 'complexity', e.target.value)}
                              placeholder="e.g. Time: O(N + max) | Space: O(max)"
                              style={{ fontSize: '0.85rem', padding: '6px 10px' }}
                            />
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '10px' }}>
                          <div className="form-field" style={{ margin: 0 }}>
                            <label style={{ fontSize: '0.72rem', marginBottom: '3px' }}>Khi nào áp dụng & Đặc điểm nhận diện</label>
                            <textarea
                              rows={2}
                              value={uc.whenToUse}
                              onChange={(e) => handleUpdateUseCaseRow(index, 'whenToUse', e.target.value)}
                              placeholder="Mô tả khi nào nên dùng, điều kiện dữ liệu..."
                              style={{ fontSize: '0.85rem', padding: '6px 10px', lineHeight: 1.4 }}
                            />
                          </div>

                          <div className="form-field" style={{ margin: 0 }}>
                            <label style={{ fontSize: '0.72rem', marginBottom: '3px' }}>Ví dụ bài toán / LeetCode mẫu</label>
                            <textarea
                              rows={2}
                              value={uc.example ?? ''}
                              onChange={(e) => handleUpdateUseCaseRow(index, 'example', e.target.value)}
                              placeholder="e.g. Top K Frequent Elements (LeetCode 347)"
                              style={{ fontSize: '0.85rem', padding: '6px 10px', lineHeight: 1.4 }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Modal Subtab 4: Java Implementation */}
            {modalSubTab === 'code' && (
              <div className="modal-tab-pane">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label htmlFor="field-pat-code" style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                    Java Code Template *
                  </label>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => setPreviewCodeInModal(!previewCodeInModal)}
                    style={{ fontSize: '0.78rem', padding: '2px 8px' }}
                  >
                    {previewCodeInModal ? 'Edit Code' : 'Preview VS Code Theme'}
                  </button>
                </div>

                {previewCodeInModal ? (
                  <div style={{ marginBottom: '14px' }}>
                    <CodeBlock
                      code={modal.pattern.code || '// Empty code'}
                      language="java"
                      filename={`${(modal.pattern.title || 'Solution').replace(/[^a-zA-Z0-9]/g, '')}.java`}
                    />
                  </div>
                ) : (
                  <div className="form-field">
                    <textarea
                      id="field-pat-code"
                      rows={10}
                      value={modal.pattern.code ?? ''}
                      onChange={(e) => setModal((prev) => ({ ...prev, pattern: { ...prev.pattern, code: e.target.value } }))}
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.92rem',
                        fontWeight: 500,
                        lineHeight: 1.6,
                        tabSize: 4,
                        backgroundColor: '#ffffff',
                      }}
                      placeholder="// Java code snippet..."
                      spellCheck={false}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Modal Actions Footer */}
            <div className="modal-actions" style={{ marginTop: '18px' }}>
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

      {/* Global Tag Manager Modal */}
      {tagManagerOpen && (
        <div className="modal-overlay" onClick={() => setTagManagerOpen(false)} style={{ zIndex: 350 }}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px', width: '92vw' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Manage Topic Tags</h2>
              <button
                type="button"
                className="note-close-btn"
                onClick={() => setTagManagerOpen(false)}
                title="Close"
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: '0.84rem', color: 'var(--color-secondary)', marginBottom: '14px' }}>
              Tags are case-insensitive (<code>Sort = sort</code>). Create, rename, or delete tags across all algorithm patterns in this topic.
            </p>

            {/* Create new tag in Tag Manager */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <input
                type="text"
                value={newTopicTagInput}
                onChange={(e) => setNewTopicTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleCreateTopicTag();
                  }
                }}
                placeholder="Create new topic tag..."
                style={{
                  flex: 1,
                  padding: '7px 12px',
                  fontSize: '0.88rem',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--rounded-sm)',
                  backgroundColor: '#ffffff',
                }}
              />
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handleCreateTopicTag}
                disabled={!newTopicTagInput.trim()}
                style={{ whiteSpace: 'nowrap' }}
              >
                + Create Tag
              </button>
            </div>

            <div style={{ maxHeight: '340px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', paddingRight: '4px' }}>
              {availableTags.length === 0 ? (
                <p style={{ color: 'var(--color-secondary)', fontStyle: 'italic', fontSize: '0.88rem', textAlign: 'center', padding: '20px 0' }}>
                  No tags found in this topic yet.
                </p>
              ) : (
                availableTags.map((tag) => {
                  const count = patterns.filter((p) => p.tags?.some((t) => t.toLowerCase() === tag.toLowerCase())).length;
                  const isEditing = editingTagOriginal === tag;

                  return (
                    <div
                      key={tag}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 12px',
                        backgroundColor: 'var(--color-surface)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '4px',
                        gap: '8px',
                      }}
                    >
                      {isEditing ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1 }}>
                          <input
                            type="text"
                            value={editingTagName}
                            onChange={(e) => setEditingTagName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleRenameTag(tag, editingTagName);
                              if (e.key === 'Escape') setEditingTagOriginal(null);
                            }}
                            style={{
                              padding: '4px 8px',
                              fontSize: '0.85rem',
                              border: '1px solid var(--color-tertiary)',
                              borderRadius: '3px',
                              flex: 1,
                              backgroundColor: '#ffffff',
                            }}
                            autoFocus
                          />
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={() => handleRenameTag(tag, editingTagName)}
                            style={{ padding: '3px 8px' }}
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            className="btn btn-ghost btn-sm"
                            onClick={() => setEditingTagOriginal(null)}
                            style={{ padding: '3px 8px' }}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--color-primary)' }}>
                              {tag}
                            </span>
                            <span
                              style={{
                                fontSize: '0.72rem',
                                padding: '1px 6px',
                                borderRadius: '10px',
                                backgroundColor: '#ede8e3',
                                color: 'var(--color-secondary)',
                                fontWeight: 600,
                              }}
                            >
                              {count} pattern{count !== 1 ? 's' : ''}
                            </span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <button
                              type="button"
                              className="btn btn-ghost btn-sm"
                              onClick={() => {
                                setEditingTagOriginal(tag);
                                setEditingTagName(tag);
                              }}
                              style={{ padding: '2px 8px', fontSize: '0.75rem' }}
                            >
                              Rename
                            </button>
                            <button
                              type="button"
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDeleteTagGlobally(tag)}
                              style={{ padding: '2px 8px', fontSize: '0.75rem' }}
                            >
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => setTagManagerOpen(false)}
              >
                Done
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


