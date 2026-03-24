import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useTheme } from '../contexts/ThemeContext.jsx';

const ROLE_DEST = {
  field:   '/mobile/home',
  manager: '/portal/dashboard',
  admin:   '/portal/dashboard',
};

const ROLE_HINTS = {
  field:   '→ Mobile App (Field Users only)',
  manager: '→ Web Portal · Dashboard, Approvals, Analytics',
  admin:   '→ Web Portal · All features including Rule Engine & Users',
};

export default function LoginPage() {
  const { login } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState({ role: 'manager', label: 'Line Manager' });
  const [email, setEmail] = useState('priya.mehta@company.com');
  const [password, setPassword] = useState('demo1234');
  const [showPwd, setShowPwd] = useState(false);

  const doLogin = () => {
    const name = (email || 'demo@company.com').split('@')[0].split('.').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
    login({ name, email, role: selectedRole.role, roleLabel: selectedRole.label });
    navigate(ROLE_DEST[selectedRole.role]);
  };

  const roles = [
    { role: 'field',   label: 'Field User',    sub: 'Mobile App',  icon: 'ri-user-location-line' },
    { role: 'manager', label: 'Manager',        sub: 'Web Portal',  icon: 'ri-group-line' },
    { role: 'admin',   label: 'Admin',          sub: 'Full Access', icon: 'ri-settings-3-line' },
  ];

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', overflow: 'hidden' }}>
      {/* BG mesh */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0,
        background: `radial-gradient(ellipse at 20% 50%, rgba(0,212,170,0.08) 0%, transparent 60%),
                     radial-gradient(ellipse at 80% 20%, rgba(59,130,246,0.06) 0%, transparent 60%),
                     var(--bg)`,
      }} />

      {/* Theme toggle */}
      <button className="icon-btn" onClick={toggle} style={{ position: 'fixed', top: 20, right: 20, zIndex: 100 }}>
        <i className={theme === 'dark' ? 'ri-sun-line' : 'ri-moon-line'}></i>
      </button>

      <div style={{
        position: 'relative', zIndex: 1,
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        maxWidth: 960, width: '100%', minHeight: 560,
        borderRadius: 24, overflow: 'hidden',
        boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
        border: '1px solid var(--border)',
      }}>
        {/* Left: Branding */}
        <div style={{
          background: 'linear-gradient(135deg, #0a1628 0%, #16213e 50%, #0a2a3a 100%)',
          padding: 48, display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', width: 300, height: 300, background: 'radial-gradient(circle, rgba(0,212,170,0.15) 0%, transparent 70%)', top: -80, right: -80 }} />
          <div style={{ position: 'absolute', width: 200, height: 200, background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)', bottom: -40, left: -40 }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'relative', zIndex: 1 }}>
            <div style={{ width: 44, height: 44, background: 'linear-gradient(135deg, #00d4aa, #0096ff)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 800, color: '#fff' }}>T&E</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>Smart <span style={{ color: '#00d4aa' }}>T&E</span></div>
          </div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#fff', lineHeight: 1.3, marginBottom: 14 }}>
              GPS-Powered <span style={{ color: '#00d4aa' }}>Expense</span><br />Management
            </div>
            <div style={{ fontSize: 14, color: '#8b9dc3', lineHeight: 1.6, marginBottom: 28 }}>
              Every claim anchored to a real location. Automate reimbursements, eliminate fraud, and get approvals in seconds — not days.
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                ['ri-map-pin-2-fill',   'Pinned Journey with Breadcrumb Tracking'],
                ['ri-camera-ai-line',   'OCR Bill Capture — Auto-extract Amount & Date'],
                ['ri-robot-line',       '70% Auto-Approved by Rule Engine'],
                ['ri-shield-check-line','Geo-Fence Anti-Fraud Validation'],
              ].map(([icon, text]) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#b0b8c1' }}>
                  <i className={icon} style={{ color: '#00d4aa', fontSize: 16 }}></i> {text}
                </div>
              ))}
            </div>
          </div>

          <div style={{ fontSize: 11, color: '#4a5568', position: 'relative', zIndex: 1 }}>© 2026 Smart T&E Platform · Prototype v1.0</div>
        </div>

        {/* Right: Login form */}
        <div style={{ background: 'var(--sidebar)', padding: 48, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Welcome Back 👋</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 32 }}>Sign in to continue to your workspace</div>

          <div style={{ marginBottom: 8, fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Select Your Role</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 8 }}>
            {roles.map(r => (
              <div
                key={r.role}
                onClick={() => setSelectedRole({ role: r.role, label: r.label })}
                style={{
                  padding: '12px 8px', borderRadius: 10, cursor: 'pointer',
                  textAlign: 'center', transition: 'all 0.2s ease',
                  border: `2px solid ${selectedRole.role === r.role ? '#00d4aa' : 'var(--border)'}`,
                  background: selectedRole.role === r.role ? 'rgba(0,212,170,0.08)' : 'var(--bg)',
                }}
              >
                <i className={r.icon} style={{ fontSize: 22, display: 'block', marginBottom: 6, color: selectedRole.role === r.role ? '#00d4aa' : 'var(--text-muted)' }}></i>
                <span style={{ fontSize: 11, fontWeight: 600, color: selectedRole.role === r.role ? '#00d4aa' : 'var(--text-muted)' }}>{r.label}</span>
                <div style={{ fontSize: 9, color: 'var(--text-dim)', marginTop: 2 }}>{r.sub}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 11, color: 'var(--accent)', marginBottom: 4, minHeight: 16 }}>{ROLE_HINTS[selectedRole.role]}</div>

          <div className="form-group" style={{ marginTop: 16 }}>
            <label className="form-label">Email Address</label>
            <input type="email" className="form-control" placeholder="you@company.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input type={showPwd ? 'text' : 'password'} className="form-control" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)}
                style={{ paddingRight: 40 }}
                onKeyDown={e => e.key === 'Enter' && doLogin()}
              />
              <button onClick={() => setShowPwd(s => !s)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 16 }}>
                <i className={showPwd ? 'ri-eye-off-line' : 'ri-eye-line'}></i>
              </button>
            </div>
          </div>

          <button onClick={doLogin} style={{
            width: '100%', padding: 13, background: '#00d4aa', color: '#0a1628',
            border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 8,
            transition: 'all 0.2s ease',
          }}>
            <i className="ri-login-box-line"></i> Sign In
          </button>

          <div style={{ textAlign: 'center', marginTop: 16, fontSize: 12, color: 'var(--text-dim)' }}>
            Demo prototype · <span style={{ color: '#00d4aa', cursor: 'pointer' }} onClick={doLogin}>Click Sign In</span> with any credentials
          </div>
        </div>
      </div>
    </div>
  );
}
