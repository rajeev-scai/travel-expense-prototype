import React, { useState } from 'react';
import MobileShell from '../../components/layout/MobileShell.jsx';
import { Fmt } from '../../utils/fmt.js';

const history = [
  { id: 'EXP-007', date: '2026-03-15', category: 'Travel (TA)', amount: 420,  status: 'auto-approved', icon: 'ri-car-line',        color: '#3b82f6' },
  { id: 'EXP-008', date: '2026-03-15', category: 'Food/Meals',  amount: 280,  status: 'auto-approved', icon: 'ri-restaurant-line', color: '#f97316' },
  { id: 'EXP-009', date: '2026-03-15', category: 'Toll',        amount: 60,   status: 'pending',       icon: 'ri-road-map-line',   color: '#06b6d4' },
  { id: 'EXP-010', date: '2026-03-14', category: 'Food/Meals',  amount: 950,  status: 'flagged',       icon: 'ri-restaurant-line', color: '#f97316' },
  { id: 'EXP-011', date: '2026-03-13', category: 'Fuel',        amount: 900,  status: 'auto-approved', icon: 'ri-gas-station-line', color: '#eab308' },
  { id: 'EXP-012', date: '2026-03-13', category: 'Travel (TA)', amount: 600,  status: 'auto-approved', icon: 'ri-car-line',         color: '#3b82f6' },
  { id: 'EXP-013', date: '2026-03-12', category: 'Night Halt',  amount: 1800, status: 'approved',      icon: 'ri-hotel-line',       color: '#8b5cf6' },
];

const STATUS = {
  'auto-approved': { cls: 'badge-green',  icon: 'ri-robot-line',  label: 'Auto' },
  'approved':      { cls: 'badge-green',  icon: 'ri-check-line',  label: 'Approved' },
  'pending':       { cls: 'badge-amber',  icon: 'ri-time-line',   label: 'Pending' },
  'flagged':       { cls: 'badge-amber',  icon: 'ri-flag-line',   label: 'Flagged' },
  'rejected':      { cls: 'badge-red',    icon: 'ri-close-line',  label: 'Rejected' },
};

export default function HistoryPage() {
  const [filter, setFilter] = useState('all');

  const filtered = history.filter(e => filter === 'all' || e.status === filter || (filter === 'approved' && e.status === 'auto-approved'));

  const total    = history.reduce((s, e) => s + e.amount, 0);
  const approved = history.filter(e => e.status === 'auto-approved' || e.status === 'approved').reduce((s, e) => s + e.amount, 0);
  const pending  = history.filter(e => e.status === 'pending' || e.status === 'flagged').reduce((s, e) => s + e.amount, 0);

  return (
    <MobileShell>
      <div style={{ padding: '60px 16px 12px', background: 'linear-gradient(180deg, var(--bg2) 0%, var(--bg) 100%)' }}>
        <div style={{ fontSize: 18, fontWeight: 800 }}><i className="ri-history-line" style={{ color: 'var(--accent)', marginRight: 8 }}></i>Expense History</div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>March 2026</div>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', margin: '0 16px 16px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
        {[['Total', Fmt.currency(total), 'var(--text)'], ['Approved', Fmt.currency(approved), 'var(--green)'], ['Pending', Fmt.currency(pending), 'var(--amber)']].map(([l, v, c], i) => (
          <div key={l} style={{ padding: '14px 10px', textAlign: 'center', borderRight: i < 2 ? '1px solid var(--border)' : 'none' }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: c }}>{v}</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 6, padding: '0 16px', marginBottom: 14, overflowX: 'auto' }}>
        {[['all', 'All'], ['approved', 'Approved'], ['pending', 'Pending'], ['flagged', 'Flagged']].map(([key, label]) => (
          <button key={key} onClick={() => setFilter(key)} style={{ padding: '6px 14px', borderRadius: 20, border: `1px solid ${filter === key ? 'var(--accent)' : 'var(--border)'}`, background: filter === key ? 'rgba(0,212,170,0.1)' : 'var(--card)', color: filter === key ? 'var(--accent)' : 'var(--text-muted)', fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap', cursor: 'pointer' }}>
            {label}
          </button>
        ))}
      </div>

      {/* Expense list */}
      <div style={{ margin: '0 16px 24px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
        {filtered.length === 0 && (
          <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>No expenses found.</div>
        )}
        {filtered.map((e, i) => {
          const s = STATUS[e.status] || STATUS.pending;
          return (
            <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none', cursor: 'pointer' }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, flexShrink: 0, background: `${e.color}20`, color: e.color }}><i className={e.icon}></i></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{e.category}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                  {Fmt.dateShort(e.date)} · <span style={{ fontSize: 10 }} className={`badge ${s.cls}`}><i className={s.icon}></i> {s.label}</span>
                </div>
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: (e.status === 'auto-approved' || e.status === 'approved') ? 'var(--accent)' : 'var(--text)' }}>
                {Fmt.currency(e.amount)}
              </div>
            </div>
          );
        })}
      </div>
    </MobileShell>
  );
}
