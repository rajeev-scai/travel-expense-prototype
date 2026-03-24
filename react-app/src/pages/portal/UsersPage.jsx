import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../../components/layout/AppShell.jsx';
import { useToast } from '../../contexts/ToastContext.jsx';

const COLORS = ['#00d4aa', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4', '#10b981'];

const employeesExt = [
  { id: 1, name: 'Rahul Sharma', grade: 'G3', team: 'Sales',   manager: 'Priya Mehta', vehicle: '2W', city: 'Mumbai',    status: 'active',   lastActive: 'Today 9:02 AM' },
  { id: 2, name: 'Anjali Singh', grade: 'G4', team: 'Sales',   manager: 'Priya Mehta', vehicle: '4W', city: 'Delhi',     status: 'active',   lastActive: 'Today 10:15 AM' },
  { id: 3, name: 'Vikram Patel', grade: 'G3', team: 'Support', manager: 'Raj Kumar',   vehicle: '2W', city: 'Ahmedabad', status: 'active',   lastActive: 'Today 8:45 AM' },
  { id: 4, name: 'Sneha Nair',   grade: 'G2', team: 'Sales',   manager: 'Priya Mehta', vehicle: '2W', city: 'Chennai',   status: 'on-leave', lastActive: '3 days ago' },
  { id: 5, name: 'Arjun Kapoor', grade: 'G4', team: 'Tech',    manager: 'Raj Kumar',   vehicle: '4W', city: 'Bangalore', status: 'active',   lastActive: 'Today 11:00 AM' },
];

export default function UsersPage() {
  const { show } = useToast();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  const filtered = employeesExt.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.team.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppShell title="Users & Grades" actions={
      <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
        <i className="ri-user-add-line"></i> Add Employee
      </button>
    }>
      {/* Stats */}
      <div className="stats-grid mb-24" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
        {[
          { icon: 'ri-group-line',        cls: 'teal',  label: 'Total Employees', val: 47 },
          { icon: 'ri-user-location-line',cls: 'blue',  label: 'Active Today',    val: 34 },
          { icon: 'ri-user-settings-line',cls: 'amber', label: 'Managers',        val: 8 },
          { icon: 'ri-shield-user-line',  cls: 'teal',  label: 'Admins',          val: 3 },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className={`stat-icon ${s.cls}`}><i className={s.icon}></i></div>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.val}</div>
          </div>
        ))}
      </div>

      {/* Search & filter bar */}
      <div className="card mb-24" style={{ padding: 16 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, position: 'relative', minWidth: 200 }}>
            <i className="ri-search-line" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}></i>
            <input className="form-control" style={{ paddingLeft: 34 }} placeholder="Search employees…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          {[['All Grades','G1','G2','G3','G4','G5'], ['All Teams','Sales','Support','Tech'], ['All Status','Active','On Leave','Offboarded']].map((opts, i) => (
            <select key={i} className="form-control" style={{ width: 130 }}>
              {opts.map(o => <option key={o}>{o}</option>)}
            </select>
          ))}
        </div>
      </div>

      {/* Employees table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">Employee Directory</div>
          <span className="text-muted text-small">47 employees · {filtered.length} shown</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Employee</th><th>Grade</th><th>Team</th><th>Reporting To</th><th>Vehicle</th><th>City</th><th>Status</th><th>Last Active</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e, i) => {
                const initials = e.name.split(' ').map(n => n[0]).join('');
                const color = COLORS[i % COLORS.length];
                return (
                  <tr key={e.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, background: `${color}22`, color }}>{initials}</div>
                        <div>
                          <div style={{ fontWeight: 600 }}>{e.name}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>ID: EMP-00{e.id}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="badge badge-blue">{e.grade}</span></td>
                    <td>{e.team}</td>
                    <td><span style={{ fontSize: 12 }}>{e.manager}</span></td>
                    <td>
                      <i className={e.vehicle === '4W' ? 'ri-car-line' : 'ri-motorbike-line'} style={{ color: 'var(--accent)', marginRight: 4 }}></i>{e.vehicle}
                    </td>
                    <td>{e.city}</td>
                    <td>
                      <span className={`badge ${e.status === 'active' ? 'badge-green' : 'badge-amber'}`}>
                        {e.status === 'active' ? <><i className="ri-checkbox-blank-circle-fill" style={{ fontSize: 6 }}></i> Active</> : 'On Leave'}
                      </span>
                    </td>
                    <td><span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{e.lastActive}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => show('Edit modal would open', 'info')}><i className="ri-edit-line"></i></button>
                        <button className="btn btn-outline btn-sm" onClick={() => navigate('/portal/approval')}><i className="ri-map-pin-2-line"></i></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Employee Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 28, width: 480, maxWidth: '90vw', animation: 'fadeIn 0.2s ease' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ fontSize: 16, fontWeight: 700 }}><i className="ri-user-add-line" style={{ color: 'var(--accent)', marginRight: 8 }}></i>Add New Employee</div>
              <button className="icon-btn" onClick={() => setShowModal(false)}><i className="ri-close-line"></i></button>
            </div>
            <div className="grid-2">
              <div className="form-group"><label className="form-label">First Name</label><input className="form-control" placeholder="Amit" /></div>
              <div className="form-group"><label className="form-label">Last Name</label><input className="form-control" placeholder="Kumar" /></div>
            </div>
            <div className="form-group"><label className="form-label">Email</label><input type="email" className="form-control" placeholder="amit@company.com" /></div>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Grade</label>
                <select className="form-control">
                  {['G1 — Junior Executive','G2 — Executive','G3 — Senior Executive','G4 — Manager','G5 — Senior Manager'].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Team</label>
                <select className="form-control">{['Sales','Support','Tech','Finance'].map(o => <option key={o}>{o}</option>)}</select>
              </div>
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Reporting Manager</label>
                <select className="form-control">{['Priya Mehta','Raj Kumar','Ananya Das'].map(o => <option key={o}>{o}</option>)}</select>
              </div>
              <div className="form-group">
                <label className="form-label">Base City</label>
                <select className="form-control">{['Mumbai','Delhi','Bangalore','Chennai','Ahmedabad'].map(o => <option key={o}>{o}</option>)}</select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => { show('Employee added successfully!', 'success'); setShowModal(false); }}>
                <i className="ri-save-line"></i> Add Employee
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
