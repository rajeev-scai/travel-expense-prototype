import React from 'react';
import { Link } from 'react-router-dom';
import MobileShell from '../../components/layout/MobileShell.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';

const recentExpenses = [
  { icon: 'ri-road-map-line',   bg: 'rgba(0,212,170,0.15)',  color: 'var(--accent)',  type: 'Travel TA — 18.4 km',     badge: 'Auto-Approved', badgeCls: 'badge-green', time: 'Just now',  amount: '₹160', credit: true },
  { icon: 'ri-restaurant-line', bg: 'rgba(245,158,11,0.15)', color: '#f59e0b',        type: 'Lunch · Café Mumbai',     badge: 'Auto-Approved', badgeCls: 'badge-green', time: '1:20 PM',   amount: '₹280', credit: true },
  { icon: 'ri-road-line',       bg: 'rgba(59,130,246,0.15)', color: '#3b82f6',        type: 'Toll · Western Express',  badge: 'Pending',       badgeCls: 'badge-amber', time: '11:05 AM',  amount: '₹60',  credit: false },
];

export default function MobileHomePage() {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] || 'Rahul';
  const lastName  = user?.name?.split(' ')[1] || 'Sharma';

  return (
    <MobileShell>
      {/* Header */}
      <div style={{ padding: '60px 20px 16px', background: 'linear-gradient(180deg, var(--bg2) 0%, var(--bg) 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Good morning,</div>
            <div style={{ fontSize: 20, fontWeight: 800, marginTop: 2 }}>{firstName} <span style={{ color: 'var(--accent)' }}>{lastName}</span> 👋</div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button className="icon-btn" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}><i className="ri-notification-3-line"></i></button>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,var(--accent),#3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff' }}>
              {(user?.name || 'RS').split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
          </div>
        </div>
      </div>

      {/* Attendance card */}
      <div style={{ margin: '0 16px 16px', background: 'linear-gradient(135deg, #0f3460, #16213e)', border: '1px solid rgba(0,212,170,0.3)', borderRadius: 16, padding: 16, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: 150, height: 150, background: 'radial-gradient(circle, rgba(0,212,170,0.15) 0%, transparent 70%)', right: -30, top: -30 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 8px var(--accent)', animation: 'pulse 2s infinite' }}></div>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)' }}>CLOCKED IN</div>
          <span style={{ marginLeft: 'auto', fontSize: 11, color: '#8b9dc3' }}><i className="ri-map-pin-line"></i> Andheri East</span>
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>9:02 AM</div>
        <div style={{ fontSize: 11, color: '#8b9dc3', marginTop: 2 }}>Monday, 16 March 2026</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginTop: 14 }}>
          {[['18.4', 'km Today', 'var(--accent)'], ['2', 'Activities', '#fff'], ['₹650', 'Claimed', '#fff']].map(([val, lbl, col]) => (
            <div key={lbl} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: col }}>{val}</div>
              <div style={{ fontSize: 10, color: '#8b9dc3', marginTop: 2 }}>{lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, margin: '0 16px 16px' }}>
        {[
          { to: '/mobile/attendance', bg: 'rgba(0,212,170,0.15)',  color: 'var(--accent)', icon: 'ri-map-pin-2-fill', label: 'Check Out' },
          { to: '/mobile/expense',    bg: 'rgba(59,130,246,0.15)', color: '#3b82f6',       icon: 'ri-camera-line',    label: 'Add Expense' },
          { to: '/mobile/trip',       bg: 'rgba(139,92,246,0.15)', color: '#8b5cf6',       icon: 'ri-route-line',     label: 'My Journey' },
          { to: '/mobile/history',    bg: 'rgba(245,158,11,0.15)', color: '#f59e0b',       icon: 'ri-history-line',   label: 'History' },
        ].map(a => (
          <Link key={a.to} to={a.to} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: '12px 6px', cursor: 'pointer', textDecoration: 'none', color: 'inherit', transition: 'all 0.2s' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, background: a.bg, color: a.color }}><i className={a.icon}></i></div>
            <span style={{ fontSize: 10, fontWeight: 600, textAlign: 'center', color: 'var(--text-muted)' }}>{a.label}</span>
          </Link>
        ))}
      </div>

      {/* Today's Route */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', marginBottom: 10 }}>
        <div style={{ fontSize: 14, fontWeight: 700 }}>Today's Route</div>
        <Link to="/mobile/trip" style={{ fontSize: 12, color: 'var(--accent)', textDecoration: 'none' }}>View Map →</Link>
      </div>
      <div style={{ margin: '0 16px 16px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          {[['#8b5cf6', 'Andheri East · 9:02 AM'], ['#3b82f6', 'Zomato HQ · 10:30'], ['var(--accent)', 'Now Here']].map(([color, label], i) => (
            <React.Fragment key={label}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: color, flexShrink: 0 }}></div>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', flex: 1 }}>{label}</div>
              {i < 2 && <div style={{ flex: 1, height: 2, borderTop: '2px dashed var(--border)' }}></div>}
            </React.Fragment>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid var(--border)' }}>
          {[['18.4 km', 'GPS Tracked', 'var(--accent)'], ['2 h 38 m', 'On Road', 'var(--text)'], ['2', 'Visits', '#3b82f6']].map(([v, l, c]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: c }}>{v}</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{l}</div>
            </div>
          ))}
          <div style={{ textAlign: 'center' }}>
            <span className="badge badge-green" style={{ fontSize: 10 }}><i className="ri-robot-line"></i> Auto ₹160</span>
          </div>
        </div>
      </div>

      {/* Today's Expenses */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', marginBottom: 10 }}>
        <div style={{ fontSize: 14, fontWeight: 700 }}>Today's Expenses</div>
        <Link to="/mobile/history" style={{ fontSize: 12, color: 'var(--accent)', textDecoration: 'none' }}>See All →</Link>
      </div>
      <div style={{ background: 'var(--card)', margin: '0 16px 16px', borderRadius: 14, border: '1px solid var(--border)', overflow: 'hidden' }}>
        {recentExpenses.map((e, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: i < recentExpenses.length - 1 ? '1px solid var(--border)' : 'none', cursor: 'pointer' }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0, background: e.bg, color: e.color }}><i className={e.icon}></i></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{e.type}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                <span className={`badge ${e.badgeCls}`} style={{ fontSize: 10 }}>{e.badge}</span> · {e.time}
              </div>
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: e.credit ? 'var(--accent)' : 'var(--text)' }}>{e.amount}</div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{ padding: '0 16px 24px' }}>
        <Link to="/mobile/expense" style={{ display: 'block', background: 'var(--accent)', color: '#0a1628', textAlign: 'center', padding: 14, borderRadius: 14, fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
          <i className="ri-add-circle-fill"></i> Add New Expense
        </Link>
      </div>
    </MobileShell>
  );
}
