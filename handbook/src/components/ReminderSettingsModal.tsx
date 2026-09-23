'use client';

import { useState, useEffect } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReminderSettingsModal({ isOpen, onClose }: Props) {
  const [enabled, setEnabled] = useState(false);
  const [time, setTime] = useState('10:00');
  const [savedTime, setSavedTime] = useState('10:00');
  const [loading, setLoading] = useState(false);

  // Fetch status on modal open
  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    fetch('/api/reminder')
      .then((res) => res.json())
      .then((data) => {
        setEnabled(Boolean(data.enabled && data.active));
        if (data.time) {
          setTime(data.time);
          setSavedTime(data.time);
        }
      })
      .catch((err) => {
        console.error('Failed to load reminder status:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggle = async () => {
    setLoading(true);
    const newStatus = !enabled;
    try {
      const res = await fetch('/api/reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: newStatus ? 'enable' : 'disable',
          time,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setEnabled(newStatus);
        setSavedTime(time);
      }
    } catch (err) {
      console.error('Error toggling reminder:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTime = async () => {
    if (!enabled) return;
    setLoading(true);
    try {
      const res = await fetch('/api/reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_time',
          time,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSavedTime(time);
      }
    } catch (err) {
      console.error('Error saving time:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTestNotification = async () => {
    try {
      fetch('/api/reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'test' }),
      });
    } catch (err) {
      console.error('Error testing notification:', err);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-box"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '540px', width: '92%', borderRadius: 'var(--rounded-md, 2px)' }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: '16px',
            borderBottom: '1px solid var(--color-border)',
            paddingBottom: '12px',
          }}
        >
          <div>
            <div
              style={{
                fontSize: '0.72rem',
                fontFamily: 'var(--font-label)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--color-secondary)',
                fontWeight: 600,
              }}
            >
              Hệ Thống Nhắc Nhở
            </div>
            <h2
              style={{
                fontSize: '1.35rem',
                fontFamily: 'var(--font-display)',
                color: 'var(--color-primary)',
                margin: '4px 0 0 0',
                border: 'none',
                padding: 0,
              }}
            >
              Cài Đặt Thông Báo Desktop
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost btn-sm"
            style={{ fontSize: '1.1rem', padding: '2px 8px', lineHeight: 1 }}
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Main Card with editorial accent border */}
          <div
            style={{
              backgroundColor: '#fff4e8',
              border: '1px solid var(--color-border)',
              borderLeft: '4px solid var(--color-tertiary)',
              padding: '14px 16px',
              borderRadius: 'var(--rounded-md, 2px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
            }}
          >
            <div>
              <div
                style={{
                  fontWeight: 600,
                  color: 'var(--color-primary)',
                  fontSize: '0.98rem',
                  fontFamily: 'var(--font-display)',
                }}
              >
                Tự động nhắc nhở ôn tập (Systemd Timer)
              </div>
              <div
                style={{
                  fontSize: '0.84rem',
                  color: 'var(--color-secondary)',
                  marginTop: '4px',
                  lineHeight: 1.45,
                }}
              >
                Chỉ gửi thông báo khi có bài đến hạn SRS hôm nay. Tự động chạy bù đúng 1 lần nếu mở máy sau giờ hẹn.
              </div>
            </div>

            {/* Custom Switch styled to match palette */}
            <label
              style={{
                position: 'relative',
                display: 'inline-block',
                width: '44px',
                height: '22px',
                flexShrink: 0,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              <input
                type="checkbox"
                checked={enabled}
                onChange={handleToggle}
                disabled={loading}
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <span
                style={{
                  position: 'absolute',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: enabled ? 'var(--color-tertiary)' : 'var(--color-border)',
                  transition: '0.2s',
                  borderRadius: '2px',
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    height: '16px',
                    width: '16px',
                    left: enabled ? '25px' : '3px',
                    bottom: '3px',
                    backgroundColor: '#ffffff',
                    transition: '0.2s',
                    borderRadius: '2px',
                  }}
                />
              </span>
            </label>
          </div>

          {/* Time Configuration if Enabled */}
          {enabled && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                border: '1px solid var(--color-border-light)',
                backgroundColor: 'var(--color-surface)',
                borderRadius: 'var(--rounded-md, 2px)',
              }}
            >
              <div>
                <label
                  htmlFor="reminder-time-input"
                  style={{
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    color: 'var(--color-primary)',
                    fontFamily: 'var(--font-label)',
                    display: 'block',
                  }}
                >
                  Thời gian kích hoạt hàng ngày
                </label>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-secondary)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                  <span>Mặc định 10:00</span>
                  <span>•</span>
                  {time === savedTime ? (
                    <span style={{ color: '#2d6a4f', fontWeight: 600 }}>Đã lưu</span>
                  ) : (
                    <span style={{ color: 'var(--color-tertiary)', fontWeight: 600 }}>Chưa lưu thay đổi</span>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  id="reminder-time-input"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  style={{
                    height: '32px',
                    padding: '0 10px',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--rounded-md, 2px)',
                    fontSize: '0.88rem',
                    fontFamily: 'var(--font-mono)',
                    backgroundColor: '#ffffff',
                    color: 'var(--color-primary)',
                    boxSizing: 'border-box',
                    display: 'inline-flex',
                    alignItems: 'center',
                  }}
                />
                <button
                  type="button"
                  className={time === savedTime ? 'btn btn-ghost' : 'btn btn-primary'}
                  onClick={handleSaveTime}
                  disabled={loading || time === savedTime}
                  style={{
                    height: '32px',
                    padding: '0 14px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxSizing: 'border-box',
                    fontSize: '0.82rem',
                    margin: 0,
                    opacity: time === savedTime ? 0.6 : 1,
                    cursor: time === savedTime ? 'default' : 'pointer',
                  }}
                >
                  Lưu giờ
                </button>
              </div>
            </div>
          )}

          {/* Test Notification Row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 0 0 0',
            }}
          >
            <div style={{ fontSize: '0.86rem', color: 'var(--color-secondary)' }}>
              Kiểm tra popup trên màn hình máy tính:
            </div>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleTestNotification}
              disabled={loading}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
              <span>Gửi thông báo test</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: '20px',
            paddingTop: '12px',
            borderTop: '1px solid var(--color-border-light)',
          }}
        >
          <button type="button" className="btn btn-primary" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
