'use client';

import { useCallback } from 'react';

/**
 * Hook to automatically adjust dropdown position to open upward (drop-up)
 * if opening downward would cause it to collide with or overflow the viewport bottom edge.
 */
export function useAutoDropdownPosition() {
  const dropdownRef = useCallback((node: HTMLElement | null) => {
    if (!node) return;

    // Reset drop-up class first to measure natural downward layout
    node.classList.remove('drop-up');

    // Measure bounding box relative to viewport
    const rect = node.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

    // If bottom edge exceeds viewport (with 12px safety padding), flip upwards
    if (rect.bottom > viewportHeight - 12) {
      node.classList.add('drop-up');
    }
  }, []);

  return dropdownRef;
}
