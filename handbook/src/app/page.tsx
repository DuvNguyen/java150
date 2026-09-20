'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import TreeGraph from '@/components/TreeGraph';
import SearchBar from '@/components/SearchBar';
import TopicFilter from '@/components/TopicFilter';
import FormattedText from '@/components/FormattedText';
import NoteModal, { getNoteStorageKey } from '@/components/NoteModal';
import { Entry } from '@/components/FunctionTable';

interface SearchResultGroup {
  topicId: string;
  topicName: string;
  entries: Entry[];
}

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [results, setResults] = useState<SearchResultGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedNote, setSelectedNote] = useState<{ entry: Entry; topicId: string } | null>(null);
  const [notesMap, setNotesMap] = useState<Record<string, boolean>>({});

  // Refresh notes map
  const refreshNotesMap = useCallback(() => {
    const map: Record<string, boolean> = {};
    for (const group of results) {
      for (const entry of group.entries) {
        const key = getNoteStorageKey(group.topicId, entry);
        const note = localStorage.getItem(key);
        if (note && note.trim().length > 0 && note !== '<br>') {
          map[key] = true;
        }
      }
    }
    setNotesMap(map);
  }, [results]);

  useEffect(() => {
    refreshNotesMap();
  }, [refreshNotesMap]);

  // Fetch search results when query or selectedTopic changes
  useEffect(() => {
    if (!query.trim() && !selectedTopic) {
      setResults([]);
      setLoading(false);
      return;
    }

    let isCancelled = false;
    setLoading(true);

    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    if (selectedTopic && selectedTopic !== 'all') params.set('topic', selectedTopic);

    fetch(`/api/search?${params.toString()}`)
      .then((res) => res.json())
      .then((data: SearchResultGroup[]) => {
        if (!isCancelled) {
          setResults(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setResults([]);
          setLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [query, selectedTopic]);

  // When searching with query, derive all available topics/subtopics from the search results (without topic filter)
  // or fetch from active results to allow narrowing down
  const [unfilteredResults, setUnfilteredResults] = useState<SearchResultGroup[]>([]);
  useEffect(() => {
    if (!query.trim()) {
      setUnfilteredResults([]);
      return;
    }

    let isCancelled = false;
    fetch(`/api/search?q=${encodeURIComponent(query.trim())}`)
      .then((res) => res.json())
      .then((data: SearchResultGroup[]) => {
        if (!isCancelled) {
          setUnfilteredResults(data);
        }
      })
      .catch(() => {
        if (!isCancelled) setUnfilteredResults([]);
      });

    return () => {
      isCancelled = true;
    };
  }, [query]);

  // Extract available topic & subtopic names for filter chips
  const { availableTopics, topicCounts, totalCount } = useMemo(() => {
    const source = unfilteredResults.length > 0 ? unfilteredResults : results;
    const topicMap = new Map<string, number>();
    let total = 0;

    for (const group of source) {
      for (const entry of group.entries) {
        total++;
        const topicName = entry.topic?.trim() || group.topicName;
        topicMap.set(topicName, (topicMap.get(topicName) || 0) + 1);
      }
    }

    const topics = Array.from(topicMap.keys()).sort();
    const counts: Record<string, number> = {};
    topicMap.forEach((count, name) => {
      counts[name] = count;
    });

    return { availableTopics: topics, topicCounts: counts, totalCount: total };
  }, [unfilteredResults, results]);

  const handleSearch = useCallback((q: string) => {
    setQuery(q);
  }, []);

  const handleSelectTopic = useCallback((topic: string) => {
    setSelectedTopic(topic);
  }, []);

  const handleReset = useCallback(() => {
    setQuery('');
    setSelectedTopic('');
    setResults([]);
  }, []);

  const isSearchActive = Boolean(query.trim() || selectedTopic);

  return (
    <main className="page-container">
      <div className="tree-page-intro" style={{ marginBottom: '20px' }}>
        <h1>DSA Roadmap</h1>
        <p>Click a topic node or search syntax, methods, and topics across the handbook.</p>
      </div>

      {/* Global Search Bar */}
      <div style={{ marginBottom: '24px' }}>
        <SearchBar
          onSearch={handleSearch}
          initialValue={query}
          placeholder="Search method, syntax, or keyword (e.g., 'put', 'bfs', 'getOrDefault')..."
        />

        {/* Topic Filter Chips when searching or results exist */}
        {isSearchActive && availableTopics.length > 0 && (
          <TopicFilter
            topics={availableTopics}
            selectedTopic={selectedTopic}
            onSelectTopic={handleSelectTopic}
            counts={topicCounts}
            totalCount={totalCount}
            label="Filter search results by topic / data structure"
          />
        )}
      </div>

      {/* Search Results Display */}
      {isSearchActive ? (
        <div className="search-results-section" style={{ marginBottom: '40px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
              paddingBottom: '8px',
              borderBottom: '1px solid var(--color-border)',
            }}
          >
            <div>
              <h2 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', margin: 0 }}>
                Search Results
              </h2>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-secondary)', margin: '4px 0 0 0' }}>
                Found {results.reduce((acc, g) => acc + g.entries.length, 0)} matching items
                {query ? ` for "${query}"` : ''}
                {selectedTopic ? ` in topic "${selectedTopic}"` : ''}
              </p>
            </div>
            <button
              onClick={handleReset}
              className="btn btn-ghost btn-sm"
              style={{ padding: '6px 12px' }}
            >
              Back to Roadmap
            </button>
          </div>

          {loading ? (
            <p className="loading-text">Searching...</p>
          ) : results.length === 0 ? (
            <div
              style={{
                padding: '40px 20px',
                textAlign: 'center',
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
              }}
            >
              <p style={{ fontSize: '1.05rem', color: 'var(--color-secondary)' }}>
                No results found {query ? `for "${query}"` : ''} {selectedTopic ? `in "${selectedTopic}"` : ''}.
              </p>
              <button
                onClick={handleReset}
                className="btn btn-secondary btn-sm"
                style={{ marginTop: '12px' }}
              >
                Clear search & filter
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {results.map((group) => (
                <div
                  key={group.topicId}
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      padding: '12px 16px',
                      backgroundColor: '#fff4e8',
                      borderBottom: '1px solid var(--color-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Link
                      href={`/topic/${group.topicId}`}
                      style={{
                        fontWeight: 700,
                        fontSize: '1rem',
                        fontFamily: 'var(--font-label)',
                        color: 'var(--color-tertiary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <span>{group.topicName}</span>
                      <span style={{ fontSize: '0.8rem' }}>→</span>
                    </Link>
                    <span
                      style={{
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        color: 'var(--color-secondary)',
                      }}
                    >
                      {group.entries.length} {group.entries.length === 1 ? 'match' : 'matches'}
                    </span>
                  </div>

                  <div className="fn-table-wrap" style={{ border: 'none', borderRadius: 0 }}>
                    <table className="fn-table">
                      <thead>
                        <tr>
                          <th style={{ width: '100px', whiteSpace: 'nowrap' }}>Topic</th>
                          <th style={{ width: '130px', whiteSpace: 'nowrap' }}>Method</th>
                          <th style={{ width: '220px' }}>Syntax</th>
                          <th style={{ width: '130px', whiteSpace: 'nowrap' }}>Return</th>
                          <th>Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {group.entries.map((entry, idx) => {
                          const noteKey = getNoteStorageKey(group.topicId, entry);
                          const hasNote = Boolean(notesMap[noteKey]);

                          return (
                            <tr
                              key={idx}
                              className="row-interactive"
                              onClick={() => setSelectedNote({ entry, topicId: group.topicId })}
                              title="Click to view/edit personal note"
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
                                {entry.description ? (
                                  <FormattedText text={entry.description} />
                                ) : (
                                  <span style={{ color: '#807973' }}>—</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <TreeGraph />
      )}

      {/* Note Modal from Search results */}
      {selectedNote && (
        <NoteModal
          isOpen={Boolean(selectedNote)}
          entry={selectedNote.entry}
          topicId={selectedNote.topicId}
          onClose={() => setSelectedNote(null)}
          onNoteChange={() => refreshNotesMap()}
        />
      )}
    </main>
  );
}
