import React, { useState } from 'react';
import MobileShell from '../../components/layout/MobileShell.jsx';
import { useToast } from '../../contexts/ToastContext.jsx';

const historyData = [
  // March 2026
  { month: 'March 2026', date: 'Mar 16', id: 'EXP-012', type: 'Food/Meals',    icon: 'ri-restaurant-line', iconBg: 'rgba(245,158,11,0.15)',  iconColor: '#f59e0b', amount: 280,  status: 'auto',    note: 'Café Mumbai Express · Auto-Approved' },
  { month: 'March 2026', date: 'Mar 16', id: 'EXP-011', type: 'Toll',           icon: 'ri-road-line',       iconBg: 'rgba(59,130,246,0.15)',  iconColor: '#3b82f6', amount: 60,   status: 'auto',    note: 'Western Express Hwy · Auto-Approved' },
  { month: 'March 2026', date: 'Mar 16', id: 'EXP-010', type: 'Travel TA',      icon: 'ri-road-map-line',   iconBg: 'rgba(0,212,170,0.15)',   iconColor: '#00d4aa', amount: 420,  status: 'auto',    note: '48.2 km GPS verified · Auto-Approved' },
  { month: 'March 2026', date: 'Mar 15', id: 'EXP-009', type: 'Food/Meals',    icon: 'ri-restaurant-line', iconBg: 'rgba(245,158,11,0.15)',  iconColor: '#f59e0b', amount: 420,  status: 'flagged', note: '5.2 km from activity · Needs review' },
  { month: 'March 2026', date: 'Mar 15', id: 'EXP-008', type: 'Night Halt',    icon: 'ri-hotel-line',      iconBg: 'rgba(139,92,246,0.15)',  iconColor: '#8b5cf6', amount: 1800, status: 'auto',    note: 'Thane · Midnight GPS verified' },
  { month: 'March 2026', date: 'Mar 14', id: 'EXP-007', type: 'Travel TA',      icon: 'ri-road-map-line',   iconBg: 'rgba(0,212,170,0.15)',   iconColor: '#00d4aa', amount: 600,  status: 'auto',    note: '50 km · Auto-Approved' },
  { month: 'March 2026', date: 'Mar 13', id: 'EXP-006', type: 'Misc/Others',   icon: 'ri-more-2-line',     iconBg: 'rgba(100,116,139,0.15)', iconColor: '#6b7280', amount: 200,  status: 'pending', note: 'Awaiting manager review' },
  // February 2026
  { month: 'February 2026', date: 'Feb 28', id: 'EXP-005', type: 'BYOD Internet', icon: 'ri-wifi-line',       iconBg: 'rgba(59,130,246,0.15)', iconColor: '#3b82f6', amount: 500, status: 'auto',     note: 'Monthly flat allowance' },
  { month: 'February 2026', date: 'Feb 20', id: 'EXP-004', type: 'Travel TA',     icon: 'ri-road-map-line',   iconBg: 'rgba(0,212,170,0.15)',  iconColor: '#00d4aa', amount: 380, status: 'auto',     note: '32 km · Auto-Approved' },
  { month: 'February 2026', date: 'Feb 15', id: 'EXP-003', type: 'Food/Meals',   icon: 'ri-restaurant-line', iconBg: 'rgba(245,158,11,0.15)', iconColor: '#f59e0b', amount: 350, status: 'auto',     note: '₹350 meal limit met' },
  { month: 'February 2026', date: 'Feb 10', id: 'EXP-002', type: 'Food/Meals',   icon: 'ri-restaurant-line', iconBg: 'rgba(245,158,11,0.15)', iconColor: '#f59e0b', amount: 620, status: 'rejected', note: 'Exceeded meal limit · Rejected' },
];

const STATUS_BADGE = {
  auto:     { cls: 'badge-green', icon: 'ri-robot-line',  label: 'Auto' },
  pending:  { cls: 'badge-amber', icon: 'ri-time-line',   label: 'Pending' },
  flagged:  { cls: 'badge-amber', icon: 'ri-flag-line',   label: 'Flagged' },
  rejected: { cls: 'badge-red',   icon: 'ri-close-line',  label: 'Rejected' },
};

const STATUS_COLOR = { auto: 'var(--accent)', pending: 'var(--text)', flagged: 'var(--amber)', rejected: 'var(--red)' };

const FILTERS = [
  ['all', 'All'],
  ['auto', 'Approved'],
  ['pending', 'Pending'],
  ['flagged', 'Flagged'],
  ['rejected', 'Rejected'],
];

export default function HistoryPage() {
  const { show } = useToast();
  const [filter, setFilter] = useState('all');

  const marchData  = historyData.filter(e => e.month === 'March 2026');
  const approvedCount = marchData.filter(e => e.status === 'auto').length;
  const pendingCount  = marchData.filter(e => e.status === 'pending' || e.status === 'flagged').length;
  const marchTotal    = marchData.reduce((s, e) => s + e.amount, 0);

  const filtered = filter === 'all' ? historyData : historyData.filter(e => e.status === filter);

  // Group by month
  const grouped = [];
  let lastMonth = '';
  filtered.forEach(e => {
    if (e.month !== lastMonth) { grouped.push({ type: 'header', month: e.month }); lastMonth = e.month; }
    grouped.push({ type: 'row', ...e });
  });

  return (
    <MobileShell>
      {/* Top Bar */}
      <div style={{ padding: '60px 16px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ fontSize: 16, fontWeight: 700, flex: 1 }}>Expense History</div>
        <button style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text)', cursor: 'pointer', fontSize: 16 }}>
          <i className="ri-filter-3-line"></i>
        </button>
      </div>

      {/* Summary strip — counts not amounts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, margin: '0 16px 14px' }}>
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 12, textAlign: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--accent)' }}>₹{marchTotal.toLocaleString('en-IN')}</div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 3 }}>March Total</div>
        </div>
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 12, textAlign: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--green)' }}>{approvedCount}</div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 3 }}>Approved</div>
        </div>
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 12, textAlign: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--amber)' }}>{pendingCount}</div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 3 }}>Pending</div>
        </div>
      </div>

      {/* Filter pills */}
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', padding: '0 16px 12px', scrollbarWidth: 'none' }}>
        {FILTERS.map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            style={{
              padding: '5px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap',
              border: `1px solid ${filter === key ? 'var(--accent)' : 'var(--border)'}`,
              background: filter === key ? 'rgba(0,212,170,0.1)' : 'var(--bg)',
              color: filter === key ? 'var(--accent)' : 'var(--text-muted)',
              cursor: 'pointer',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* History list with month grouping */}
      <div style={{ marginBottom: 24 }}>
        {grouped.length === 0 && (
          <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>No expenses found.</div>
        )}
        {grouped.map((item, idx) => {
          if (item.type === 'header') {
            return (
              <div key={`hdr-${item.month}`} style={{ padding: '8px 16px', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', background: 'var(--bg2, var(--bg))' }}>
                {item.month}
              </div>
            );
          }
          const s = STATUS_BADGE[item.status] || STATUS_BADGE.pending;
          const amountColor = STATUS_COLOR[item.status] || 'var(--text)';
          const note = item.note || '';
          const noteShort = note.length > 30 ? note.slice(0, 30) + '…' : note;
          return (
            <div
              key={item.id}
              onClick={() => show(`${item.id}: ${item.type} detail view`, 'info')}
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: '1px solid var(--border)', cursor: 'pointer' }}
            >
              <div style={{ width: 40, height: 40, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0, background: item.iconBg, color: item.iconColor }}>
                <i className={item.icon}></i>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{item.type}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{item.date} · {noteShort}</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: amountColor }}>{item.status === 'rejected' ? '-' : ''}₹{item.amount}</div>
                <div style={{ marginTop: 3 }}>
                  <span className={`badge ${s.cls}`} style={{ fontSize: 9 }}><i className={s.icon}></i> {s.label}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </MobileShell>
  );
}
