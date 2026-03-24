import React from 'react';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend, Filler } from 'chart.js';
import AppShell from '../../components/layout/AppShell.jsx';
import { useToast } from '../../contexts/ToastContext.jsx';
import { Fmt } from '../../utils/fmt.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend, Filler);

const gridLine = { color: 'rgba(255,255,255,0.05)' };
const tickCfg  = { color: '#8b9dc3', font: { size: 11 } };

const lineData = {
  labels: ['Jan', 'Feb', 'Mar'],
  datasets: [
    { label: 'Travel TA',   data: [38000, 42000, 45000], borderColor: '#00d4aa', backgroundColor: 'rgba(0,212,170,0.1)',  fill: true, tension: 0.4 },
    { label: 'Food/Meals',  data: [22000, 26000, 28000], borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,0.1)', fill: true, tension: 0.4 },
    { label: 'Night Halt',  data: [12000, 15000, 18000], borderColor: '#8b5cf6', backgroundColor: 'rgba(139,92,246,0.1)', fill: true, tension: 0.4 },
    { label: 'Others',      data: [8000,  10000, 12000], borderColor: '#f59e0b', backgroundColor: 'rgba(245,158,11,0.1)', fill: true, tension: 0.4 },
  ],
};
const lineOptions = { responsive: true, plugins: { legend: { labels: { color: '#8b9dc3', font: { size: 11 } } } }, scales: { x: { grid: gridLine, ticks: tickCfg }, y: { grid: gridLine, ticks: { ...tickCfg, callback: v => `₹${v / 1000}K` } } } };

const pieData = {
  labels: ['Travel TA', 'Food/Meals', 'Night Halt', 'Tolls', 'BYOD', 'Others'],
  datasets: [{ data: [35, 24, 15, 7, 10, 9], backgroundColor: ['#00d4aa', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#6b7280'], borderWidth: 0, hoverOffset: 4 }],
};
const pieOptions = { responsive: true, cutout: '60%', plugins: { legend: { position: 'right', labels: { color: '#8b9dc3', font: { size: 11 }, boxWidth: 10 } } } };

const stackData = {
  labels: ['Jan', 'Feb', 'Mar'],
  datasets: [
    { label: 'Auto-Approved',   data: [65, 68, 71], backgroundColor: 'rgba(0,212,170,0.8)',  stack: 'a' },
    { label: 'Manual Approved', data: [22, 20, 18], backgroundColor: 'rgba(59,130,246,0.8)', stack: 'a' },
    { label: 'Flagged',         data: [8,  7,  6],  backgroundColor: 'rgba(245,158,11,0.8)', stack: 'a' },
    { label: 'Rejected',        data: [5,  5,  5],  backgroundColor: 'rgba(239,68,68,0.8)',  stack: 'a' },
  ],
};
const stackOptions = { responsive: true, scales: { x: { stacked: true, grid: gridLine, ticks: tickCfg }, y: { stacked: true, grid: gridLine, ticks: { ...tickCfg, callback: v => v + '%' }, max: 100 } }, plugins: { legend: { labels: { color: '#8b9dc3', font: { size: 11 } } } } };

const varValues = [2.1, 4.8, 1.9, 3.2, 6.1];
const varData = {
  labels: ['Rahul S.', 'Anjali S.', 'Vikram P.', 'Sneha N.', 'Arjun K.'],
  datasets: [{
    label: 'GPS vs Odometer Variance %',
    data: varValues,
    backgroundColor: varValues.map(v => v > 5 ? 'rgba(239,68,68,0.7)' : v > 3 ? 'rgba(245,158,11,0.7)' : 'rgba(0,212,170,0.7)'),
    borderRadius: 6,
  }],
};
const varOptions = { responsive: true, plugins: { legend: { display: false } }, scales: { x: { grid: gridLine, ticks: tickCfg }, y: { grid: gridLine, ticks: { ...tickCfg, callback: v => v + '%' }, max: 10 } } };

const spendersData = [
  { name: 'Arjun Kapoor', grade: 'G4', team: 'Tech',    total: 7200, ta: 4200, food: 1800, other: 1200, auto: 82, flags: 1 },
  { name: 'Anjali Singh', grade: 'G4', team: 'Sales',   total: 6800, ta: 3800, food: 2000, other: 1000, auto: 75, flags: 2 },
  { name: 'Rahul Sharma', grade: 'G3', team: 'Sales',   total: 4200, ta: 2800, food: 900,  other: 500,  auto: 88, flags: 0 },
  { name: 'Sneha Nair',   grade: 'G2', team: 'Sales',   total: 3500, ta: 2100, food: 800,  other: 600,  auto: 91, flags: 0 },
  { name: 'Vikram Patel', grade: 'G3', team: 'Support', total: 2100, ta: 1400, food: 500,  other: 200,  auto: 72, flags: 3 },
];

const kpis = [
  { emoji: '💰', val: '₹3.8L', label: 'Total Expense Q1 2026',     trend: '+14% vs Q4 2025',      up: true },
  { emoji: '🤖', val: '71%',   label: 'Auto-Approval Rate',         trend: '+6pp vs Q4 2025',       up: true },
  { emoji: '⏱️', val: '1.8 min', label: 'Avg Submission Time',      trend: '-42% reduction',        up: true },
  { emoji: '🚨', val: '3.2%',  label: 'Fraud Flag Rate',            trend: '-1.8pp improvement',    up: true },
];

export default function AnalyticsPage() {
  const { show } = useToast();
  return (
    <AppShell title="Team Analytics">
      {/* Filter bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
        {[['Q1 2026','Q4 2025','Q3 2025'], ['All Teams','Sales','Support','Tech'], ['All Grades','G1','G2','G3','G4','G5'], ['All Categories','Travel TA','Food/Meals','Night Halt']].map((opts, i) => (
          <select key={i} className="form-control" style={{ width: 140 }}>
            {opts.map(o => <option key={o}>{o}</option>)}
          </select>
        ))}
        <button className="btn btn-primary btn-sm"><i className="ri-filter-line"></i> Apply Filters</button>
        <button className="btn btn-outline btn-sm" style={{ marginLeft: 'auto' }} onClick={() => show('Report exported!', 'success')}><i className="ri-download-2-line"></i> Export CSV</button>
      </div>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        {kpis.map(k => (
          <div key={k.label} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 20 }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{k.emoji}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: k.label.includes('Total') ? 'var(--accent)' : k.label.includes('Auto') ? 'var(--green)' : k.label.includes('Avg') ? 'var(--blue)' : 'var(--red)' }}>{k.val}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{k.label}</div>
            <div style={{ fontSize: 11, marginTop: 6, color: 'var(--green)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <i className="ri-arrow-up-line"></i> {k.trend}
            </div>
          </div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid-2 mb-24">
        <div className="card">
          <div className="card-header">
            <div><div className="card-title">Monthly Spend Trend</div><div className="card-subtitle">Jan – Mar 2026 by category</div></div>
          </div>
          <Line data={lineData} options={lineOptions} height={200} />
        </div>
        <div className="card">
          <div className="card-header">
            <div><div className="card-title">Category Breakdown</div><div className="card-subtitle">% of total spend Q1 2026</div></div>
          </div>
          <Doughnut data={pieData} options={pieOptions} height={200} />
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid-2 mb-24">
        <div className="card">
          <div className="card-header">
            <div><div className="card-title">Auto vs Manual Approval by Month</div></div>
          </div>
          <Bar data={stackData} options={stackOptions} height={200} />
        </div>
        <div className="card">
          <div className="card-header">
            <div><div className="card-title">GPS vs Odometer Variance</div><div className="card-subtitle">Monthly average deviation %</div></div>
          </div>
          <Bar data={varData} options={varOptions} height={200} />
        </div>
      </div>

      {/* Top spenders table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title"><i className="ri-trophy-line" style={{ color: 'var(--amber)', marginRight: 6 }}></i>Top Spenders — Q1 2026</div>
          <button className="btn btn-outline btn-sm" onClick={() => show('Detailed report opened', 'info')}><i className="ri-external-link-line"></i> Full Report</button>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th><th>Employee</th><th>Grade</th><th>Team</th><th>Total</th><th>TA</th><th>Food</th><th>Others</th><th>Auto%</th><th>Flags</th>
              </tr>
            </thead>
            <tbody>
              {spendersData.map((s, i) => {
                const autoColor = s.auto >= 80 ? 'var(--green)' : s.auto >= 70 ? 'var(--amber)' : 'var(--red)';
                return (
                  <tr key={s.name}>
                    <td><strong>{i + 1}</strong></td>
                    <td><strong>{s.name}</strong></td>
                    <td><span className="badge badge-blue">{s.grade}</span></td>
                    <td>{s.team}</td>
                    <td><strong>{Fmt.currency(s.total)}</strong></td>
                    <td>{Fmt.currency(s.ta)}</td>
                    <td>{Fmt.currency(s.food)}</td>
                    <td>{Fmt.currency(s.other)}</td>
                    <td><strong style={{ color: autoColor }}>{s.auto}%</strong></td>
                    <td><span className={`badge ${s.flags > 0 ? 'badge-amber' : 'badge-green'}`}>{s.flags}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
