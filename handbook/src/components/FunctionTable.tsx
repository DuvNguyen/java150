'use client';

import { useState } from 'react';
import FormattedText from './FormattedText';

export interface Entry {
  topic?: string;
  method: string;
  syntax: string;
  description: string;
}

interface Props {
  entries: Entry[];
  topicId: string;
  onRefresh: () => void;
}

interface ModalState {
  open: boolean;
  mode: 'add' | 'edit';
  rowIndex?: number;
  data: Partial<Entry>;
}

const API = '/api';

export default function FunctionTable({ entries, topicId, onRefresh }: Props) {
  const [modal, setModal] = useState<ModalState>({
    open: false,
    mode: 'add',
    data: {},
  });
  const [toast, setToast] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  }

  function openAdd() {
    setModal({ open: true, mode: 'add', data: {} });
  }

  function openEdit(index: number) {
    setModal({ open: true, mode: 'edit', rowIndex: index, data: { ...entries[index] } });
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

  async function handleDelete(index: number) {
    await fetch(`${API}/topics/${topicId}/entries/${index}`, { method: 'DELETE' });
    setConfirmDelete(null);
    showToast('Entry deleted');
    onRefresh();
  }

  function updateField(field: keyof Entry, value: string) {
    setModal((prev) => ({ ...prev, data: { ...prev.data, [field]: value } }));
  }

  return (
    <>
      {/* Table */}
      <div className="fn-table-wrap">
        <table className="fn-table">
          <thead>
            <tr>
              <th style={{ width: '130px' }}>Topic</th>
              <th>Method</th>
              <th>Syntax</th>
              <th>Description</th>
              <th style={{ width: '130px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.length === 0 && (
              <tr>
                <td colSpan={5}>
                  <div className="empty-state">No entries yet. Add one below.</div>
                </td>
              </tr>
            )}
            {entries.map((entry, i) => (
              <tr key={i}>
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
                  {entry.method ? <code>{entry.method}</code> : <span style={{ color: '#807973' }}>—</span>}
                </td>
                <td>
                  {entry.syntax ? <code>{entry.syntax}</code> : <span style={{ color: '#807973' }}>—</span>}
                </td>
                <td>{entry.description ? <FormattedText text={entry.description} /> : <span style={{ color: '#807973' }}>—</span>}</td>
                <td className="actions">
                  {confirmDelete === i ? (
                    <>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(i)}>
                        Confirm
                      </button>
                      <button className="btn btn-ghost btn-sm" onClick={() => setConfirmDelete(null)}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(i)}>
                        Edit
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => setConfirmDelete(i)}>
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add button */}
      <div className="add-row-bar">
        <button id="add-entry-btn" className="btn btn-primary" onClick={openAdd}>
          Add entry
        </button>
      </div>

      {/* Modal */}
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

      {/* Toast */}
      {toast && <div className="toast">{toast}</div>}
    </>
  );
}
