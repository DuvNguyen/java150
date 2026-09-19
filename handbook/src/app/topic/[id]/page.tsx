'use client';

import { useEffect, useState, useCallback, use } from 'react';
import Link from 'next/link';
import SearchBar from '@/components/SearchBar';
import FunctionTable, { Entry } from '@/components/FunctionTable';
import PrerequisitesGrid from '@/components/PrerequisitesGrid';

const API = '/api';

interface TopicData {
  topic: { id: string; name: string };
  entries: Entry[];
}

export default function TopicPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState<TopicData | null>(null);
  const [filtered, setFiltered] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  const fetchTopic = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/topics/${id}`);
      const json: TopicData = await res.json();
      setData(json);
      setFiltered(json.entries);
      setQuery('');
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTopic();
  }, [fetchTopic]);

  const handleSearch = useCallback(
    async (q: string) => {
      setQuery(q);
      if (!q.trim()) {
        setFiltered(data?.entries ?? []);
        return;
      }
      const res = await fetch(`${API}/topics/${id}/search?q=${encodeURIComponent(q)}`);
      const entries: Entry[] = await res.json();
      setFiltered(entries);
    },
    [id, data],
  );

  if (loading) return <main className="page-container"><p className="loading-text">Loading...</p></main>;

  if (!data) return (
    <main className="page-container">
      <p className="loading-text">Topic not found.</p>
      <Link href="/">Back to roadmap</Link>
    </main>
  );

  return (
    <main className="page-container">
      <nav className="breadcrumb">
        <Link href="/">Roadmap</Link>
        <span>/</span>
        <span>{data.topic.name}</span>
      </nav>

      <div className="topic-header" style={{ marginBottom: '16px', paddingBottom: '12px' }}>
        <h1>{data.topic.name}</h1>
        <p className="entry-count">
          {filtered.length} {filtered.length === 1 ? 'entry' : 'entries'}
          {query ? ` matching "${query}"` : ''}
        </p>
      </div>

      {/* NeetCode Style Prerequisites Card Grid */}
      <PrerequisitesGrid topicId={id} />

      {/* Syntax Cheatsheet Section */}
      <div style={{ marginTop: '24px' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '12px', fontFamily: 'var(--font-display)' }}>
          Java Syntax & Methods Reference
        </h2>
        <SearchBar onSearch={handleSearch} />

        <FunctionTable
          entries={filtered}
          topicId={id}
          onRefresh={fetchTopic}
        />
      </div>
    </main>
  );
}
