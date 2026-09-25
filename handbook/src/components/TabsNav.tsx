'use client';

import React, { useEffect, useRef, useCallback } from 'react';

export interface TabItem<T extends string = string> {
  id: T;
  label: string;
  badge?: React.ReactNode;
  badgeStyle?: React.CSSProperties;
  badgeClassName?: string;
  disabled?: boolean;
}

export interface TabsNavProps<T extends string = string> {
  tabs: TabItem<T>[];
  activeTab: T;
  onChange: (tabId: T) => void;
  enableShortcuts?: boolean;
  showShortcutHints?: boolean;
  rightAction?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function TabsNav<T extends string = string>({
  tabs,
  activeTab,
  onChange,
  enableShortcuts = true,
  showShortcutHints = false,
  rightAction,
  className = '',
  style,
}: TabsNavProps<T>) {
  // Lưu lịch sử các tab đã xem (MRU - Most Recently Used) để chuyển qua lại 2 tab gần nhất
  const recentTabsRef = useRef<T[]>([activeTab]);

  useEffect(() => {
    recentTabsRef.current = [
      activeTab,
      ...recentTabsRef.current.filter((id) => id !== activeTab),
    ].slice(0, 10);
  }, [activeTab]);

  const toggleRecentTab = useCallback(() => {
    const history = recentTabsRef.current;
    if (history.length >= 2) {
      const targetId = history[1];
      const targetTab = tabs.find((t) => t.id === targetId);
      if (targetTab && !targetTab.disabled) {
        onChange(targetTab.id);
        return;
      }
    }
    // Nếu chưa có tab trước đó, chuyển sang tab kế tiếp
    const currentIndex = tabs.findIndex((t) => t.id === activeTab);
    const nextIndex = currentIndex === 0 ? 1 : 0;
    if (tabs[nextIndex] && !tabs[nextIndex].disabled) {
      onChange(tabs[nextIndex].id);
    }
  }, [tabs, activeTab, onChange]);

  useEffect(() => {
    if (!enableShortcuts) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Bỏ qua khi đang nhập liệu trong input/textarea/editor
      const activeEl = document.activeElement;
      const isTyping =
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          (activeEl as HTMLElement).isContentEditable);

      if (isTyping) return;

      // 1. Phím tắt chuyển qua lại 2 tab gần nhất: Ctrl + Q hoặc bấm phím 'Q' trực tiếp
      const isQ = e.key === 'q' || e.key === 'Q' || e.code === 'KeyQ';
      if (isQ && !e.shiftKey) {
        e.preventDefault();
        e.stopPropagation();
        toggleRecentTab();
        return;
      }

      // 2. Phím số 1, 2, 3, 4... bấm trực tiếp để đổi tab tức thì
      if (!e.ctrlKey && !e.metaKey && !e.altKey && !e.shiftKey) {
        let keyNum: number | null = null;
        const digitMatch = e.code.match(/^Digit([1-9])$/);
        if (digitMatch) {
          keyNum = parseInt(digitMatch[1], 10);
        } else {
          const parsed = parseInt(e.key, 10);
          if (!isNaN(parsed)) keyNum = parsed;
        }

        if (keyNum !== null && keyNum >= 1 && keyNum <= tabs.length) {
          const targetTab = tabs[keyNum - 1];
          if (targetTab && !targetTab.disabled) {
            e.preventDefault();
            e.stopPropagation();
            onChange(targetTab.id);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => {
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
    };
  }, [tabs, enableShortcuts, toggleRecentTab, onChange]);

  return (
    <div
      className={`topic-tabs-nav ${className}`.trim()}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        ...style,
      }}
      role="tablist"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        {tabs.map((tab, index) => {
          const isActive = tab.id === activeTab;
          const shortcutNum = index + 1;

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              disabled={tab.disabled}
              className={`topic-tab-item ${isActive ? 'active' : ''}`}
              onClick={() => onChange(tab.id)}
              title={enableShortcuts && index < 9 ? `Phím tắt: ${shortcutNum}` : undefined}
            >
              <span>{tab.label}</span>

              {tab.badge !== undefined && tab.badge !== null && (
                <span
                  className={`tab-count-badge ${tab.badgeClassName || ''}`.trim()}
                  style={tab.badgeStyle}
                >
                  {tab.badge}
                </span>
              )}

              {showShortcutHints && enableShortcuts && index < 9 && (
                <span className="tab-shortcut-hint">
                  {shortcutNum}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {rightAction && (
        <div style={{ display: 'inline-flex', alignItems: 'center', marginLeft: 'auto', paddingBottom: '4px' }}>
          {rightAction}
        </div>
      )}
    </div>
  );
}
