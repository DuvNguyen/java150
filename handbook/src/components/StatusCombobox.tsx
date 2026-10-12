'use client';

import { useState, useRef, useEffect } from 'react';
import { useAutoDropdownPosition } from '@/lib/useAutoDropdownPosition';

export interface StatusOption<T extends string = string> {
  value: T;
  label: string;
}

interface Props<T extends string> {
  value: T;
  onChange: (val: T) => void;
  label?: string;
  options?: StatusOption<T>[];
  className?: string;
}

export default function StatusCombobox<T extends string>({
  value,
  onChange,
  label = 'Trạng thái:',
  options = [
    { value: 'not-started' as T, label: 'Chưa học' },
    { value: 'in-progress' as T, label: 'Đang học' },
    { value: 'done' as T, label: 'Đã nắm' },
  ],
  className = '',
}: Props<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoDropdownRef = useAutoDropdownPosition();

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
  const hasValue = value !== 'not-started';

  return (
    <div className={`custom-combobox-wrap ${className}`} ref={containerRef}>
      {label && <span className="combobox-label">{label}</span>}

      <div className="combobox-dropdown-container">
        {/* Custom Pill / Chip Trigger Button */}
        <button
          type="button"
          className={`combobox-trigger-btn ${isOpen ? 'active' : ''} ${hasValue ? 'has-value' : ''}`}
          onClick={() => setIsOpen((prev) => !prev)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span className="combobox-selected-text">
            {selectedOption ? selectedOption.label : value}
          </span>
          <span className="combobox-arrow">{isOpen ? '▴' : '▾'}</span>
        </button>

        {/* Custom Animated Dropdown Menu */}
        {isOpen && (
          <div className="combobox-menu" ref={autoDropdownRef} role="listbox">
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
