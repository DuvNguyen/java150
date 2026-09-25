'use client';

import { useMemo } from 'react';

interface Props {
  topics: string[];
  selectedTopic?: string;
  selectedTopics?: string[];
  onSelectTopic?: (topic: string) => void;
  onSelectTopics?: (topics: string[]) => void;
  counts?: Record<string, number>;
  totalCount?: number;
  label?: string;
}

export default function TopicFilter({
  topics,
  selectedTopic = '',
  selectedTopics,
  onSelectTopic,
  onSelectTopics,
  counts = {},
  totalCount,
  label = 'Lọc theo chủ đề / thẻ (Có thể chọn nhiều thẻ):',
}: Props) {
  if (topics.length === 0) return null;

  // Normalize selected list
  const activeList = useMemo(() => {
    if (selectedTopics !== undefined) {
      return selectedTopics.map((s) => s.toLowerCase().trim()).filter(Boolean);
    }
    if (selectedTopic && selectedTopic.toLowerCase() !== 'all') {
      return selectedTopic.split(',').map((s) => s.toLowerCase().trim()).filter(Boolean);
    }
    return [];
  }, [selectedTopics, selectedTopic]);

  const isAllSelected = activeList.length === 0;

  const handleToggleTopic = (topic: string) => {
    const topicLower = topic.toLowerCase().trim();
    let nextList: string[];

    if (activeList.includes(topicLower)) {
      // Uncheck
      nextList = activeList.filter((t) => t !== topicLower);
    } else {
      // Check
      nextList = [...activeList, topicLower];
    }

    if (onSelectTopics) {
      onSelectTopics(nextList);
    }
    if (onSelectTopic) {
      onSelectTopic(nextList.join(','));
    }
  };

  const handleClearAll = () => {
    if (onSelectTopics) {
      onSelectTopics([]);
    }
    if (onSelectTopic) {
      onSelectTopic('');
    }
  };

  return (
    <div className="topic-filter-container" style={{ marginBottom: '16px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '8px',
        }}
      >
        {label && (
          <div
            style={{
              fontSize: '0.78rem',
              fontFamily: 'var(--font-label)',
              fontWeight: 600,
              color: 'var(--color-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {label}
          </div>
        )}
        {activeList.length > 0 && (
          <button
            type="button"
            onClick={handleClearAll}
            className="btn btn-ghost btn-sm"
            style={{ padding: '2px 8px', fontSize: '0.75rem', color: 'var(--color-secondary)' }}
          >
            Xóa chọn lọc
          </button>
        )}
      </div>

      <div
        className="topic-filter-chips"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          alignItems: 'center',
        }}
      >
        {/* All Button */}
        <button
          type="button"
          onClick={handleClearAll}
          className={`topic-chip ${isAllSelected ? 'active' : ''}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '0.82rem',
            fontFamily: 'var(--font-label)',
            fontWeight: isAllSelected ? 700 : 500,
            cursor: 'pointer',
            border: isAllSelected
              ? '1.5px solid var(--color-tertiary)'
              : '1px solid var(--color-border)',
            backgroundColor: isAllSelected ? '#990f3d' : 'var(--color-surface)',
            color: isAllSelected ? '#ffffff' : 'var(--color-primary)',
            transition: 'all 0.15s ease',
            boxShadow: isAllSelected ? '0 2px 4px rgba(153, 15, 61, 0.2)' : 'none',
          }}
        >
          <span>Tất cả (All)</span>
          {totalCount !== undefined && (
            <span
              style={{
                fontSize: '0.72rem',
                opacity: isAllSelected ? 0.9 : 0.6,
                padding: '1px 6px',
                borderRadius: '10px',
                backgroundColor: isAllSelected ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.06)',
              }}
            >
              {totalCount}
            </span>
          )}
        </button>

        {/* Individual Topic Chips */}
        {topics.map((topic) => {
          const isSelected = activeList.includes(topic.toLowerCase().trim());
          const count = counts[topic];

          return (
            <button
              key={topic}
              type="button"
              onClick={() => handleToggleTopic(topic)}
              className={`topic-chip ${isSelected ? 'active' : ''}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '0.82rem',
                fontFamily: 'var(--font-label)',
                fontWeight: isSelected ? 700 : 500,
                cursor: 'pointer',
                border: isSelected
                  ? '1.5px solid var(--color-tertiary)'
                  : '1px solid var(--color-border)',
                backgroundColor: isSelected ? '#990f3d' : 'var(--color-surface)',
                color: isSelected ? '#ffffff' : 'var(--color-primary)',
                transition: 'all 0.15s ease',
                boxShadow: isSelected ? '0 2px 4px rgba(153, 15, 61, 0.2)' : 'none',
              }}
            >
              <span>{topic}</span>
              {count !== undefined && (
                <span
                  style={{
                    fontSize: '0.72rem',
                    opacity: isSelected ? 0.9 : 0.6,
                    padding: '1px 6px',
                    borderRadius: '10px',
                    backgroundColor: isSelected ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.06)',
                  }}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
