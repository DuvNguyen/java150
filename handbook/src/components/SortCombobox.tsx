'use client';

import { useState, useRef, useEffect } from 'react';
import { SortOption } from './FunctionTable';

interface Props {
  value: SortOption;
  onChange: (val: SortOption) => void;
  options?: { value: SortOption; label: string }[];
}

const DEFAULT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'default', label: 'Default order' },
  { value: 'name-asc', label: 'Name (A → Z)' },
  { value: 'name-desc', label: 'Name (Z → A)' },
  { value: 'date-desc', label: 'Date modified (Newest)' },
  { value: 'date-asc', label: 'Date modified (Oldest)' },
];

export default function SortCombobox({
  value,
  onChange,
  options = DEFAULT_OPTIONS,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  return (
    <div className="custom-combobox-wrap" ref={containerRef}>
      <span className="combobox-label">Sort by:</span>

      <div className="combobox-dropdown-container">
        {/* Custom Pill Trigger Button */}
        <button
          type="button"
          className={`combobox-trigger-btn ${isOpen ? 'active' : ''} ${value !== 'default' ? 'has-value' : ''}`}
          onClick={() => setIsOpen((prev) => !prev)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span className="combobox-selected-text">{selectedOption.label}</span>
          <span className="combobox-arrow">{isOpen ? '▴' : '▾'}</span>
        </button>

        {/* Custom Animated Dropdown Menu */}
        {isOpen && (
          <div className="combobox-menu" role="listbox">
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className={`combobox-menu-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                >
                  <span>{option.label}</span>
                  {isSelected && <span className="combobox-check">●</span>}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
