'use client';

import { useState, useCallback } from 'react';

interface Props {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export default function SearchBar({ onSearch, placeholder = 'Search method, syntax, or description...' }: Props) {
  const [value, setValue] = useState('');

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      setValue(v);
      // debounce 200ms
      const timer = setTimeout(() => onSearch(v), 200);
      return () => clearTimeout(timer);
    },
    [onSearch],
  );

  return (
    <div className="search-wrap">
      <input
        id="search-input"
        className="search-input"
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        autoComplete="off"
        spellCheck={false}
      />
    </div>
  );
}
