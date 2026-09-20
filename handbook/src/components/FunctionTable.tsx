'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import FormattedText from './FormattedText';
import NoteModal, { getNoteStorageKey, getNoteUpdatedAt } from './NoteModal';

export interface Entry {
  topic?: string;
  method: string;
  syntax: string;
  returns?: string;
  description: string;
}

export type SortOption = 'default' | 'name-asc' | 'name-desc' | 'date-desc' | 'date-asc';

interface Props {
  entries: Entry[];
  topicId: string;
  onRefresh: () => void;
  pageSize?: number;
}

interface ModalState {
  open: boolean;
  mode: 'add' | 'edit';
  rowIndex?: number;
  data: Partial<Entry>;
}

const API = '/api';

export default function FunctionTable({ entries, topicId, onRefresh, pageSize = 20 }: Props) {
  const [modal, setModal] = useState<ModalState>({
    open: false,
    mode: 'add',
    data: {},
  });
  const [toast, setToast] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [openActionMenuIndex, setOpenActionMenuIndex] = useState<number | null>(null);
  const [selectedNoteEntry, setSelectedNoteEntry] = useState<Entry | null>(null);
  const [notesMap, setNotesMap] = useState<Record<string, boolean>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortOption>('default');

  // Reset to page 1 whenever entries count or topic changes
  useEffect(() => {
    setCurrentPage(1);
  }, [entries.length, topicId]);

  // Close action dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (!target.closest('.action-dropdown-wrap')) {
        setOpenActionMenuIndex(null);
        setConfirmDelete(null);
      }
    }
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  // Check localStorage for existing notes for each entry
  const refreshNotesMap = useCallback(() => {
    const map: Record<string, boolean> = {};
    for (const entry of entries) {
      const key = getNoteStorageKey(topicId, entry);
      const note = localStorage.getItem(key);
      if (note && note.trim().length > 0 && note !== '<br>') {
        map[key] = true;
      }
    }
    setNotesMap(map);
  }, [entries, topicId]);

  useEffect(() => {
    refreshNotesMap();
  }, [refreshNotesMap]);

  // Sort entries based on sortBy option
  const sortedEntries = useMemo(() => {
    if (sortBy === 'default') return entries;

    const list = [...entries];
    if (sortBy === 'name-asc') {
      return list.sort((a, b) => a.method.localeCompare(b.method));
    }
    if (sortBy === 'name-desc') {
      return list.sort((a, b) => b.method.localeCompare(a.method));
    }
    if (sortBy === 'date-desc') {
      return list.sort((a, b) => {
        const timeA = getNoteUpdatedAt(topicId, a);
        const timeB = getNoteUpdatedAt(topicId, b);
        return timeB - timeA;
      });
    }
    if (sortBy === 'date-asc') {
      return list.sort((a, b) => {
        const timeA = getNoteUpdatedAt(topicId, a);
        const timeB = getNoteUpdatedAt(topicId, b);
        return timeA - timeB;
      });
    }
    return list;
  }, [entries, sortBy, topicId]);

  const totalPages = Math.ceil(sortedEntries.length / pageSize) || 1;

  // Ensure current page is valid if entries shrink
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedEntries = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedEntries.slice(start, start + pageSize);
  }, [sortedEntries, currentPage, pageSize]);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  }

  function openAdd() {
    setModal({ open: true, mode: 'add', data: {} });
  }

  function openEdit(originalIndex: number) {
    setOpenActionMenuIndex(null);
    setConfirmDelete(null);
    setModal({ open: true, mode: 'edit', rowIndex: originalIndex, data: { ...entries[originalIndex] } });
  }

  function closeModal() {
    setModal({ open: false, mode: 'add', data: {} });
  }

  async function handleSave() {
    if (modal.mode === 'add') {
      await fetch(`${API}/topics/${topicId}/entries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(modal.data),
      });
      showToast('Entry added');
    } else {
      await fetch(`${API}/topics/${topicId}/entries/${modal.rowIndex}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(modal.data),
      });
      showToast('Entry updated');
    }
    closeModal();
    onRefresh();
  }

  async function handleDelete(originalIndex: number) {
    await fetch(`${API}/topics/${topicId}/entries/${originalIndex}`, { method: 'DELETE' });
    setConfirmDelete(null);
    setOpenActionMenuIndex(null);
    showToast('Entry deleted');
    onRefresh();
  }

  function updateField(field: keyof Entry, value: string) {
    setModal((prev) => ({ ...prev, data: { ...prev.data, [field]: value } }));
  }

  const toggleActionMenu = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (openActionMenuIndex === index) {
      setOpenActionMenuIndex(null);
      setConfirmDelete(null);
    } else {
      setOpenActionMenuIndex(index);
      setConfirmDelete(null);
    }
  };

  const handleRowClick = (entry: Entry) => {
    setSelectedNoteEntry(entry);
  };

  const toggleMethodSort = () => {
    if (sortBy === 'default') setSortBy('name-asc');
    else if (sortBy === 'name-asc') setSortBy('name-desc');
    else setSortBy('default');
  };

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, sortedEntries.length);

  return (
    <>
      {/* Table Toolbar with Sort Controls */}
      <div className="table-header-toolbar">
        <div className="sort-group">
          <label htmlFor="table-sort-select">Sort by:</label>
          <select
            id="table-sort-select"
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
          >
            <option value="default">Default order</option>
            <option value="name-asc">Name (A → Z)</option>
            <option value="name-desc">Name (Z → A)</option>
            <option value="date-desc">Date modified (Newest)</option>
            <option value="date-asc">Date modified (Oldest)</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="fn-table-wrap">
        <table className="fn-table">
          <thead>
            <tr>
              <th style={{ width: '100px', whiteSpace: 'nowrap' }}>Topic</th>
              <th
                style={{ width: '130px', whiteSpace: 'nowrap' }}
                className="th-sortable"
                onClick={toggleMethodSort}
                title="Click to sort by method name"
              >
                Method {sortBy === 'name-asc' ? '▲' : sortBy === 'name-desc' ? '▼' : ''}
              </th>
              <th style={{ width: '220px' }}>Syntax</th>
              <th style={{ width: '130px', whiteSpace: 'nowrap' }}>Return</th>
              <th>Description</th>
              <th style={{ width: '56px', textAlign: 'center' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {sortedEntries.length === 0 && (
              <tr>
                <td colSpan={6}>
                  <div className="empty-state">No entries yet. Add one below.</div>
                </td>
              </tr>
            )}
            {paginatedEntries.map((entry, relativeIdx) => {
              const originalIdx = entries.indexOf(entry);
              const noteKey = getNoteStorageKey(topicId, entry);
              const hasNote = Boolean(notesMap[noteKey]);

              return (
                <tr
                  key={originalIdx >= 0 ? originalIdx : relativeIdx}
                  className="row-interactive"
                  onClick={() => handleRowClick(entry)}
                  title="Click row to view / edit personal notes"
                >
                  <td>
                    {entry.topic ? (
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          backgroundColor: '#fff4e8',
                          color: 'var(--color-tertiary)',
                          border: '1px solid var(--color-border)',
                          letterSpacing: '0.02em',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {entry.topic}
                      </span>
                    ) : (
                      <span style={{ color: '#807973' }}>—</span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      {entry.method ? <code>{entry.method}</code> : <span style={{ color: '#807973' }}>—</span>}
                      {hasNote && (
                        <span
                          className="note-indicator-badge"
                          title="Has personal note — click row to view/edit"
                        >
                          !
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    {entry.syntax ? <code>{entry.syntax}</code> : <span style={{ color: '#807973' }}>—</span>}
                  </td>
                  <td>
                    {entry.returns && entry.returns !== '—' ? (
                      <code
                        style={{
                          color: '#6b21a8',
                          backgroundColor: '#f3e8ff',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontSize: '0.8rem',
                          fontWeight: 500,
                        }}
                      >
                        {entry.returns}
                      </code>
                    ) : (
                      <span style={{ color: '#807973' }}>—</span>
                    )}
                  </td>
                  <td>
                    {entry.description ? <FormattedText text={entry.description} /> : <span style={{ color: '#807973' }}>—</span>}
                  </td>
                  <td className="actions" onClick={(e) => e.stopPropagation()} style={{ textAlign: 'center' }}>
                    <div className="action-dropdown-wrap">
                      <button
                        type="button"
                        className={`action-menu-trigger ${openActionMenuIndex === originalIdx ? 'active' : ''}`}
                        onClick={(e) => toggleActionMenu(originalIdx, e)}
                        title="Actions"
                        aria-label="Actions"
                      >
                        ⋮
                      </button>

                      {openActionMenuIndex === originalIdx && (
                        <div className="action-dropdown-menu">
                          <button
                            type="button"
                            className="action-menu-item"
                            onClick={(e) => {
                              e.stopPropagation();
                              openEdit(originalIdx);
                            }}
                          >
                            Edit
                          </button>

                          {confirmDelete === originalIdx ? (
                            <button
                              type="button"
                              className="action-menu-item delete"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(originalIdx);
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
                                setConfirmDelete(originalIdx);
                              }}
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {sortedEntries.length > 0 && (
        <div className="pagination-wrap">
          <div className="pagination-summary">
            Showing {sortedEntries.length === 0 ? 0 : startIndex + 1}–{endIndex} of {sortedEntries.length} {sortedEntries.length === 1 ? 'entry' : 'entries'}
          </div>

          {totalPages > 1 && (
            <div className="pagination-controls">
              <button
                type="button"
                className="pagination-btn"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  type="button"
                  className={`pagination-btn ${currentPage === pageNum ? 'active' : ''}`}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </button>
              ))}

              <button
                type="button"
                className="pagination-btn"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* Add button */}
      <div className="add-row-bar" style={{ marginTop: '16px' }}>
        <button id="add-entry-btn" className="btn btn-primary" onClick={openAdd}>
          Add entry
        </button>
      </div>

      {/* Entry Add / Edit Modal */}
      {modal.open && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2>{modal.mode === 'add' ? 'Add entry' : 'Edit entry'}</h2>
            <div className="form-field">
              <label htmlFor="field-topic">Topic / Data Structure</label>
              <input
                id="field-topic"
                type="text"
                value={modal.data.topic ?? ''}
                onChange={(e) => updateField('topic', e.target.value)}
                placeholder="e.g. ArrayList, HashMap, Arrays, String"
              />
              <span className="hint">Optional</span>
            </div>
            <div className="form-field">
              <label htmlFor="field-method">Method</label>
              <input
                id="field-method"
                type="text"
                value={modal.data.method ?? ''}
                onChange={(e) => updateField('method', e.target.value)}
                placeholder="e.g. add"
              />
              <span className="hint">Optional</span>
            </div>
            <div className="form-field">
              <label htmlFor="field-syntax">Syntax</label>
              <input
                id="field-syntax"
                type="text"
                value={modal.data.syntax ?? ''}
                onChange={(e) => updateField('syntax', e.target.value)}
                placeholder="e.g. list.add(val)"
              />
              <span className="hint">Optional</span>
            </div>
            <div className="form-field">
              <label htmlFor="field-returns">Return Value</label>
              <input
                id="field-returns"
                type="text"
                value={modal.data.returns ?? ''}
                onChange={(e) => updateField('returns', e.target.value)}
                placeholder="e.g. boolean, int, void, V, List<E>"
              />
              <span className="hint">Optional</span>
            </div>
            <div className="form-field">
              <label htmlFor="field-description">Description</label>
              <textarea
                id="field-description"
                rows={3}
                value={modal.data.description ?? ''}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Short explanation..."
              />
              <span className="hint">Optional</span>
            </div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={closeModal}>
                Cancel
              </button>
              <button id="modal-save-btn" className="btn btn-primary" onClick={handleSave}>
                {modal.mode === 'add' ? 'Add' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rich-Text Note Modal with Auto-save */}
      <NoteModal
        isOpen={Boolean(selectedNoteEntry)}
        entry={selectedNoteEntry}
        topicId={topicId}
        onClose={() => setSelectedNoteEntry(null)}
        onNoteChange={() => refreshNotesMap()}
      />

      {/* Toast */}
      {toast && <div className="toast">{toast}</div>}
    </>
  );
}
