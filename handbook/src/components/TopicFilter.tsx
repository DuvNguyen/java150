'use client';

interface Props {
  topics: string[];
  selectedTopic: string;
  onSelectTopic: (topic: string) => void;
  counts?: Record<string, number>;
  totalCount?: number;
  label?: string;
}

export default function TopicFilter({
  topics,
  selectedTopic,
  onSelectTopic,
  counts = {},
  totalCount,
  label = 'Filter by Topic / Data Structure:',
}: Props) {
  if (topics.length === 0) return null;

  const isAllSelected = !selectedTopic || selectedTopic.toLowerCase() === 'all';

  return (
    <div className="topic-filter-container" style={{ marginBottom: '16px' }}>
      {label && (
        <div
          style={{
            fontSize: '0.8rem',
            fontFamily: 'var(--font-label)',
            fontWeight: 600,
            color: 'var(--color-secondary)',
            marginBottom: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {label}
        </div>
      )}
      <div
        className="topic-filter-chips"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          alignItems: 'center',
        }}
      >
        <button
          type="button"
          onClick={() => onSelectTopic('')}
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
          <span>All</span>
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

        {topics.map((topic) => {
          const isSelected = selectedTopic.toLowerCase() === topic.toLowerCase();
          const count = counts[topic];

          return (
            <button
              key={topic}
              type="button"
              onClick={() => onSelectTopic(isSelected ? '' : topic)}
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
