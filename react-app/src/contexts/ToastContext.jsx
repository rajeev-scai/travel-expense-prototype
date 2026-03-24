import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

const COLORS = { success: '#00d4aa', error: '#ef4444', warning: '#f59e0b', info: '#3b82f6' };

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const show = useCallback((msg, type = 'info', duration = 3000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div style={{
        position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
        display: 'flex', flexDirection: 'column', gap: 8,
      }}>
        {toasts.map(t => (
          <div key={t.id} style={{
            background: 'var(--card)',
            border: `1px solid ${COLORS[t.type]}`,
            borderLeft: `3px solid ${COLORS[t.type]}`,
            color: 'var(--text)',
            padding: '12px 16px', borderRadius: 8,
            fontSize: 13, fontWeight: 500,
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            animation: 'fadeIn 0.2s ease',
            minWidth: 240, maxWidth: 360,
          }}>
            {t.msg}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
