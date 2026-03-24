import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useTheme } from '../../contexts/ThemeContext.jsx';

const NAV = [
  { to: '/mobile/home',       icon: 'ri-home-4-fill',      label: 'Home' },
  { to: '/mobile/trip',       icon: 'ri-route-line',        label: 'Journey' },
  { to: '/mobile/expense',    icon: 'ri-camera-line',       label: 'Expense' },
  { to: '/mobile/history',    icon: 'ri-history-line',      label: 'History' },
];

export default function MobileShell({ children }) {
  const { logout } = useAuth();
  const { theme, toggle } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div style={{ background: 'var(--bg)', padding: '20px 0', minHeight: '100vh' }}>
      {/* Top bar above the frame */}
      <div style={{ textAlign: 'center', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
        <button className="icon-btn" onClick={toggle} title="Theme">
          <i className={theme === 'dark' ? 'ri-sun-line' : 'ri-moon-line'}></i>
        </button>
        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Mobile App Preview</span>
        <Link to="/portal/dashboard" style={{ fontSize: 12, color: 'var(--accent)' }}>→ Web Portal</Link>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingBottom: 40 }}>
        <div style={{
          width: 390, minHeight: 844,
          background: 'var(--bg2)', borderRadius: 44,
          border: '2px solid var(--border)',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          display: 'flex', flexDirection: 'column',
          position: 'relative',
        }}>
          {/* Notch */}
          <div style={{ position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)', width: 120, height: 30, background: 'var(--bg2)', borderRadius: '0 0 20px 20px', zIndex: 10 }} />

          {/* Status bar */}
          <div style={{ height: 44, background: 'var(--bg2)', display: 'flex', alignItems: 'center', padding: '0 24px', justifyContent: 'space-between', fontSize: 12, fontWeight: 600 }}>
            <span>9:41</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <i className="ri-signal-wifi-fill"></i>
              <i className="ri-battery-fill" style={{ color: 'var(--accent)' }}></i>
            </div>
          </div>

          {/* Content area */}
          <div style={{ flex: 1, overflowY: 'auto', background: 'var(--bg)' }}>
            {children}
          </div>

          {/* Bottom nav */}
          <div style={{ background: 'var(--sidebar)', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '10px 0 20px', height: 72 }}>
            {NAV.map(n => (
              <Link key={n.to} to={n.to} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, color: location.pathname === n.to ? 'var(--accent)' : 'var(--text-muted)', fontSize: 10, padding: '4px 12px', borderRadius: 8, textDecoration: 'none' }}>
                <i className={n.icon} style={{ fontSize: 20 }}></i>
                <span>{n.label}</span>
              </Link>
            ))}
            <button onClick={handleLogout} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, color: 'var(--red)', fontSize: 10, padding: '4px 12px', background: 'none', border: 'none', cursor: 'pointer' }}>
              <i className="ri-logout-box-r-line" style={{ fontSize: 20 }}></i>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
