'use client';

import { useEffect, useState, useCallback, use, useMemo } from 'react';
import Link from 'next/link';
import SearchBar from '@/components/SearchBar';
import FunctionTable, { Entry } from '@/components/FunctionTable';
import PrerequisitesGrid from '@/components/PrerequisitesGrid';
import TopicFilter from '@/components/TopicFilter';
import PatternManager from '@/components/PatternManager';
import { DEFAULT_PATTERNS } from '@/lib/patterns';

const API = '/api';

interface TopicData {
  topic: { id: string; name: string };
  entries: Entry[];
}

export default function TopicPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState<TopicData | null>(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [activeTab, setActiveTab] = useState<'syntax' | 'patterns'>('syntax');

  const fetchTopic = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/topics/${id}`);
      const json: TopicData = await res.json();
      setData(json);
      setQuery('');
      setSelectedTopic('');
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTopic();
  }, [fetchTopic]);

  // Extract unique subtopics/topics present in the entries
  const availableTopics = useMemo(() => {
    if (!data?.entries) return [];
    const set = new Set<string>();
    for (const e of data.entries) {
      if (e.topic && e.topic.trim()) {
        set.add(e.topic.trim());
      }
    }
    return Array.from(set);
  }, [data?.entries]);

  // Filter entries based on both query and selectedTopic
  const filteredEntries = useMemo(() => {
    if (!data?.entries) return [];
    const q = query.toLowerCase().trim();
    const sel = selectedTopic.toLowerCase().trim();

    return data.entries.filter((entry) => {
      // Topic filter check
      if (sel && sel !== 'all') {
        const topicVal = entry.topic?.toLowerCase() ?? '';
        if (topicVal !== sel && !topicVal.includes(sel)) {
          return false;
        }
      }

      // Query search check
      if (q) {
        const matches =
          (entry.topic && entry.topic.toLowerCase().includes(q)) ||
          entry.method.toLowerCase().includes(q) ||
          entry.syntax.toLowerCase().includes(q) ||
          entry.description.toLowerCase().includes(q);
        if (!matches) return false;
      }

      return true;
    });
  }, [data?.entries, query, selectedTopic]);

  // Dynamic counts for each topic badge under current search query
  const topicCounts = useMemo(() => {
    if (!data?.entries) return {};
    const q = query.toLowerCase().trim();
    const counts: Record<string, number> = {};

    for (const topic of availableTopics) {
      const topicLower = topic.toLowerCase();
      const count = data.entries.filter((entry) => {
        const topicVal = entry.topic?.toLowerCase() ?? '';
        const matchesTopic = topicVal === topicLower || topicVal.includes(topicLower);
        if (!matchesTopic) return false;
        if (!q) return true;
        return (
          topicVal.includes(q) ||
          entry.method.toLowerCase().includes(q) ||
          entry.syntax.toLowerCase().includes(q) ||
          entry.description.toLowerCase().includes(q)
        );
      }).length;
      counts[topic] = count;
    }

    return counts;
  }, [data?.entries, availableTopics, query]);

  // Count of items matching query across all topics
  const totalMatchingQueryCount = useMemo(() => {
    if (!data?.entries) return 0;
    const q = query.toLowerCase().trim();
    if (!q) return data.entries.length;
    return data.entries.filter(
      (e) =>
        (e.topic && e.topic.toLowerCase().includes(q)) ||
        e.method.toLowerCase().includes(q) ||
        e.syntax.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q),
    ).length;
  }, [data?.entries, query]);

  // Pattern count estimation for the tab badge
  const patternCount = useMemo(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(`patterns_data_${id}`);
        if (saved) {
          return JSON.parse(saved).length;
        }
      } catch {
        // ignore
      }
    }
    return DEFAULT_PATTERNS[id]?.length || 0;
  }, [id]);

  const handleSearch = useCallback((q: string) => {
    setQuery(q);
  }, []);

  const handleSelectTopic = useCallback((topic: string) => {
    setSelectedTopic(topic);
  }, []);

  const handleResetFilters = useCallback(() => {
    setQuery('');
    setSelectedTopic('');
  }, []);

  if (loading) return <main className="page-container"><p className="loading-text">Loading...</p></main>;

  if (!data) return (
    <main className="page-container">
      <p className="loading-text">Topic not found.</p>
      <Link href="/">Back to roadmap</Link>
    </main>
  );

  const hasActiveFilters = Boolean(query.trim() || selectedTopic);

  return (
    <main className="page-container">
      <nav className="breadcrumb">
        <Link href="/">Roadmap</Link>
        <span>/</span>
        <span>{data.topic.name}</span>
      </nav>

      <div className="topic-header" style={{ marginBottom: '16px', paddingBottom: '12px' }}>
        <h1>{data.topic.name}</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {activeTab === 'syntax' ? (
            <>
              <p className="entry-count" style={{ margin: 0 }}>
                {filteredEntries.length} of {data.entries.length} {data.entries.length === 1 ? 'entry' : 'entries'}
                {query ? ` matching "${query}"` : ''}
                {selectedTopic ? ` in ${selectedTopic}` : ''}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="btn btn-ghost btn-sm"
                  style={{ padding: '2px 8px', fontSize: '0.75rem' }}
                >
                  Reset filters
                </button>
              )}
            </>
          ) : (
            <p className="entry-count" style={{ margin: 0 }}>
              Reusable algorithms & pattern templates
            </p>
          )}
        </div>
      </div>

      {/* NeetCode Style Prerequisites Card Grid */}
      <PrerequisitesGrid topicId={id} />

      {/* Topic Tabs Navigation */}
      <div className="topic-tabs-nav">
        <button
          type="button"
          className={`topic-tab-item ${activeTab === 'syntax' ? 'active' : ''}`}
          onClick={() => setActiveTab('syntax')}
        >
          <span>Syntax & Methods</span>
          <span className="tab-count-badge">{data.entries.length}</span>
        </button>

        <button
          type="button"
          className={`topic-tab-item ${activeTab === 'patterns' ? 'active' : ''}`}
          onClick={() => setActiveTab('patterns')}
        >
          <span>Algorithms & Patterns</span>
          <span className="tab-count-badge">{patternCount}</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'syntax' ? (
        <div style={{ marginTop: '12px' }}>
          <SearchBar
            onSearch={handleSearch}
            initialValue={query}
            placeholder={`Search syntax or methods in ${data.topic.name}...`}
          />

          {availableTopics.length > 1 && (
            <TopicFilter
              topics={availableTopics}
              selectedTopic={selectedTopic}
              onSelectTopic={handleSelectTopic}
              counts={topicCounts}
              totalCount={totalMatchingQueryCount}
              label="Filter by topic / data structure"
            />
          )}

          <FunctionTable
            entries={filteredEntries}
            topicId={id}
            onRefresh={fetchTopic}
          />
        </div>
      ) : (
        <PatternManager topicId={id} topicName={data.topic.name} />
      )}
    </main>
  );
}
