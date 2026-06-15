import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from 'chart.js';
import AppShell from '../../components/layout/AppShell.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useToast } from '../../contexts/ToastContext.jsx';
import { expenses } from '../../utils/sampleData.js';
import { Fmt } from '../../utils/fmt.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const PIN_COLOR = { valid: 'badge-green', amber: 'badge-amber', red: 'badge-red' };
const STATUS_MAP = {
  'auto-approved': { cls: 'badge-green',  icon: 'ri-robot-line',   label: 'Auto' },
  'pending':       { cls: 'badge-amber',  icon: 'ri-time-line',    label: 'Pending' },
  'flagged':       { cls: 'badge-amber',  icon: 'ri-flag-line',    label: 'Flagged' },
  'manual-review': { cls: 'badge-blue',   icon: 'ri-eye-line',     label: 'Review' },
  'rejected':      { cls: 'badge-red',    icon: 'ri-close-line',   label: 'Rejected' },
};

const teamData = [
  { name: 'Rahul Sharma', initials: 'RS', color: '#00d4aa', spend: 4200,  budget: 8000 },
  { name: 'Anjali Singh', initials: 'AS', color: '#3b82f6', spend: 6800,  budget: 10000 },
  { name: 'Vikram Patel', initials: 'VP', color: '#f59e0b', spend: 2100,  budget: 6000 },
  { name: 'Sneha Nair',   initials: 'SN', color: '#8b5cf6', spend: 3500,  budget: 7000 },
  { name: 'Arjun Kapoor', initials: 'AK', color: '#ef4444', spend: 7200,  budget: 9000 },
];

const activities = [
  { icon: 'ri-map-pin-2-fill',    color: '#00d4aa', msg: <>Rahul Sharma clocked in at <b>Andheri East, Mumbai</b></>,     time: '9:02 AM' },
  { icon: 'ri-file-text-line',    color: '#3b82f6', msg: <>Anjali Singh submitted <b>Food bill ₹380</b> (Auto-approved)</>,  time: '10:15 AM' },
  { icon: 'ri-flag-line',         color: '#f59e0b', msg: <>Vikram Patel expense flagged — <b>bill 5km from activity</b></>, time: '11:30 AM' },
  { icon: 'ri-robot-line',        color: '#00d4aa', msg: <>System auto-approved <b>TA ₹600</b> for Rahul Sharma</>,          time: '12:45 PM' },
  { icon: 'ri-user-location-line',color: '#8b5cf6', msg: <>Sneha Nair logged <b>Client Visit @ Chennai Central</b></>,       time: '2:00 PM' },
  { icon: 'ri-check-double-line', color: '#00d4aa', msg: <>3 expenses batch auto-approved by rule engine</>,                  time: '3:30 PM' },
];

const BAR_COLORS = ['rgba(0,212,170,0.7)', 'rgba(59,130,246,0.7)', 'rgba(139,92,246,0.7)', 'rgba(245,158,11,0.7)', 'rgba(239,68,68,0.7)', 'rgba(100,116,139,0.7)'];
const barDatasets = {
  thisMonth: [42000, 28000, 18000, 8500, 12000, 11980],
  lastMonth: [36000, 24000, 14000, 7200, 10500, 9800],
};
function makeBarData(period) {
  return {
    labels: ['Travel TA', 'Food/Meals', 'Night Halt', 'Tolls', 'BYOD', 'Others'],
    datasets: [{
      label: 'Expenses (₹)',
      data: barDatasets[period],
      backgroundColor: BAR_COLORS,
      borderRadius: 6, borderSkipped: false,
    }],
  };
}
const barData = makeBarData('thisMonth');
const barOptions = {
  responsive: true,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8b9dc3', font: { size: 11 } } },
    y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8b9dc3', font: { size: 11 }, callback: v => `₹${v / 1000}K` } },
  },
};
const doughnutData = {
  labels: ['Auto-Approved', 'Manual Approved', 'Pending', 'Rejected'],
  datasets: [{
    data: [69, 18, 8, 5],
    backgroundColor: ['rgba(0,212,170,0.8)', 'rgba(59,130,246,0.8)', 'rgba(245,158,11,0.8)', 'rgba(239,68,68,0.8)'],
    borderWidth: 0, hoverOffset: 4,
  }],
};
const doughnutOptions = {
  responsive: true, cutout: '65%',
  plugins: { legend: { position: 'bottom', labels: { color: '#8b9dc3', font: { size: 11 }, boxWidth: 10, padding: 8 } } },
};

export default function DashboardPage() {
  const { isAdmin } = useAuth();
  const { show } = useToast();
  const navigate = useNavigate();
  const [barPeriod, setBarPeriod] = useState('thisMonth');
  const currentBarData = makeBarData(barPeriod);

  return (
    <AppShell title="Dashboard">
      {/* Onboarding strip */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '20px 24px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 0, overflowX: 'auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span className="step-badge completed"><i className="ri-check-line"></i> Completed</span>
          <div style={{ fontSize: 13, fontWeight: 500, paddingRight: 12 }}>Configure Rule Engine</div>
        </div>
        <div style={{ flex: 1, height: 2, background: 'var(--accent)', minWidth: 40 }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span className="step-badge completed"><i className="ri-check-line"></i> Completed</span>
          <div style={{ fontSize: 13, fontWeight: 500, paddingRight: 12 }}>Add Team Members</div>
        </div>
        <div style={{ flex: 1, height: 2, background: 'var(--border)', minWidth: 40 }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span className="step-badge in-progress">In Progress</span>
          <div style={{ fontSize: 13, fontWeight: 500, paddingRight: 12 }}>Review Pending Approvals</div>
        </div>
        <div style={{ marginLeft: 'auto', flexShrink: 0 }}>
          <Link to="/portal/approval" className="btn btn-primary btn-sm"><i className="ri-arrow-right-line"></i> Review Now</Link>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {[
          { icon: 'ri-file-list-3-line', cls: 'teal',  label: 'Total Claims (Mar)',    value: '142',   change: '+18% vs last month',          up: true },
          { icon: 'ri-time-line',        cls: 'amber', label: 'Pending Approval',      value: '23',    change: '5 flagged',                   up: false },
          { icon: 'ri-robot-line',       cls: 'teal',  label: 'Auto-Approved',         value: '98',    change: '69% of total',                up: true },
          { icon: 'ri-close-circle-line',cls: 'red',   label: 'Rejected / Flagged',    value: '8',     change: '3 geo-violations',            up: false },
          { icon: 'ri-money-rupee-circle-line', cls: 'blue', label: 'Total Reimbursed', value: '₹1.2L', change: '₹1,20,480',                  up: true },
          { icon: 'ri-road-map-line',    cls: 'amber', label: 'Total KM Tracked',      value: '4,280', change: 'GPS-verified',                up: true },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className={`stat-icon ${s.cls}`}><i className={s.icon}></i></div>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.value}</div>
            <div className={`stat-change ${s.up ? 'up' : 'down'}`}>
              <i className={s.up ? 'ri-arrow-up-line' : 'ri-arrow-down-line'}></i> {s.change}
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid-2 mb-24">
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Monthly Expense by Category</div>
              <div className="card-subtitle">March 2026</div>
            </div>
            <select className="form-control" style={{ width: 120, padding: '5px 10px', fontSize: 12 }} value={barPeriod} onChange={e => setBarPeriod(e.target.value)}>
              <option value="thisMonth">This Month</option>
              <option value="lastMonth">Last Month</option>
            </select>
          </div>
          <Bar data={currentBarData} options={barOptions} height={200} />
        </div>
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Approval Breakdown</div>
              <div className="card-subtitle">Auto vs Manual vs Flagged</div>
            </div>
          </div>
          <Doughnut data={doughnutData} options={doughnutOptions} height={200} />
        </div>
      </div>

      {/* Claims + Team Spend */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 24 }}>
        <div className="card">
          <div className="card-header">
            <div className="card-title"><i className="ri-file-list-line" style={{ color: 'var(--accent)', marginRight: 6 }}></i>Recent Claims</div>
            <Link to="/portal/approval" className="btn btn-outline btn-sm">View All</Link>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th><th>Employee</th><th>Category</th><th>Amount</th><th>Pin Status</th><th>Status</th><th>Action</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map(e => {
                  const s = STATUS_MAP[e.status] || { cls: 'badge-gray', icon: 'ri-question-line', label: e.status };
                  return (
                    <tr key={e.id}>
                      <td><span style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--text-muted)' }}>{e.id}</span></td>
                      <td><strong>{e.emp}</strong><br /><span className="text-xs text-muted">{e.date}</span></td>
                      <td>{e.category}</td>
                      <td><strong>{Fmt.currency(e.amount)}</strong></td>
                      <td>
                        <span className={`badge ${PIN_COLOR[e.pin] || 'badge-gray'}`}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', display: 'inline-block', marginRight: 4, background: e.pin === 'valid' ? '#00d4aa' : e.pin === 'amber' ? '#f59e0b' : '#ef4444' }}></span>
                          {e.pin === 'valid' ? 'Valid' : e.pin === 'amber' ? 'Deviated' : 'Violation'}
                        </span>
                      </td>
                      <td><span className={`badge ${s.cls}`}><i className={s.icon}></i> {s.label}</span></td>
                      <td>
                        {(e.status === 'pending' || e.status === 'flagged')
                          ? <button className="btn btn-outline btn-sm" onClick={() => navigate('/portal/approval')}>Review</button>
                          : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title"><i className="ri-team-line" style={{ color: 'var(--accent)', marginRight: 6 }}></i>Team Spend</div>
            <span className="badge badge-green">Mar 2026</span>
          </div>
          {teamData.map(m => {
            const pct = Math.round(m.spend / m.budget * 100);
            return (
              <div key={m.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: m.color, background: `${m.color}20` }}>{m.initials}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{m.name}</span>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{Fmt.currency(m.spend)}</span>
                  </div>
                  <div style={{ flex: 1, height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: 3, background: m.color, width: `${pct}%` }}></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions + Activity Feed */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20 }}>
        <div className="card">
          <div className="card-header"><div className="card-title">Quick Actions</div></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[
              { to: '/portal/approval',   icon: 'ri-map-pin-2-line',    label: 'Review Journeys', adminOnly: false },
              { to: '/portal/analytics',  icon: 'ri-bar-chart-2-line',  label: 'Analytics',       adminOnly: false },
              { to: '/portal/rules',      icon: 'ri-settings-3-line',   label: 'Rule Engine',     adminOnly: true  },
              { to: '/portal/users',      icon: 'ri-user-add-line',     label: 'Manage Users',    adminOnly: true  },
              { to: '/mobile/home',       icon: 'ri-smartphone-line',   label: 'Mobile App',      adminOnly: false },
              { action: () => show('Report downloaded!', 'success'), icon: 'ri-download-2-line', label: 'Export Report', adminOnly: false },
            ].filter(qa => !qa.adminOnly || isAdmin()).map(qa => (
              qa.to
                ? <Link key={qa.label} to={qa.to} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: 16, borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg)', cursor: 'pointer', transition: 'all 0.2s ease', textDecoration: 'none', color: 'inherit' }}>
                    <i className={qa.icon} style={{ fontSize: 24, color: 'var(--accent)' }}></i>
                    <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)', textAlign: 'center' }}>{qa.label}</span>
                  </Link>
                : <button key={qa.label} onClick={qa.action} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: 16, borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg)', cursor: 'pointer', transition: 'all 0.2s ease' }}>
                    <i className={qa.icon} style={{ fontSize: 24, color: 'var(--accent)' }}></i>
                    <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)', textAlign: 'center' }}>{qa.label}</span>
                  </button>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title"><i className="ri-activity-line" style={{ color: 'var(--accent)', marginRight: 6 }}></i>Live Activity Feed</div>
            <span className="badge badge-green"><span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00d4aa', display: 'inline-block', marginRight: 4 }}></span>Live</span>
          </div>
          {activities.map((a, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 0', borderBottom: i < activities.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: `${a.color}20`, color: a.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <i className={a.icon}></i>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: 'var(--text)' }}>{a.msg}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{a.time} today</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
