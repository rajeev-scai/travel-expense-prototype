import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../../components/layout/AppShell.jsx';
import { useToast } from '../../contexts/ToastContext.jsx';

const COLORS = ['#00d4aa', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4', '#10b981'];

const GRADE_OPTIONS = ['G1', 'G2', 'G3', 'G4', 'G5'];
const GRADE_LABELS  = { G1: 'Junior Executive', G2: 'Executive', G3: 'Senior Executive', G4: 'Manager', G5: 'Senior Manager' };
const TEAM_OPTIONS  = ['Sales', 'Support', 'Tech', 'Finance'];
const MANAGER_OPTIONS = ['Priya Mehta', 'Raj Kumar', 'Ananya Das'];
const CITY_OPTIONS  = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Ahmedabad'];

const initEmployees = [
  { id: 1, name: 'Rahul Sharma', grade: 'G3', team: 'Sales',   manager: 'Priya Mehta', vehicle: ['2W'], city: 'Mumbai',    status: 'active',   lastActive: 'Today 9:02 AM' },
  { id: 2, name: 'Anjali Singh', grade: 'G4', team: 'Sales',   manager: 'Priya Mehta', vehicle: ['4W'], city: 'Delhi',     status: 'active',   lastActive: 'Today 10:15 AM' },
  { id: 3, name: 'Vikram Patel', grade: 'G3', team: 'Support', manager: 'Raj Kumar',   vehicle: ['2W'], city: 'Ahmedabad', status: 'active',   lastActive: 'Today 8:45 AM' },
  { id: 4, name: 'Sneha Nair',   grade: 'G2', team: 'Sales',   manager: 'Priya Mehta', vehicle: ['2W'], city: 'Chennai',   status: 'on-leave', lastActive: '3 days ago' },
  { id: 5, name: 'Arjun Kapoor', grade: 'G4', team: 'Tech',    manager: 'Raj Kumar',   vehicle: ['4W'], city: 'Bangalore', status: 'active',   lastActive: 'Today 11:00 AM' },
];

const emptyForm = { firstName: '', lastName: '', email: '', grade: 'G1', team: 'Sales', manager: 'Priya Mehta', city: 'Mumbai', vehicle: ['2W'] };

export default function UsersPage() {
  const { show } = useToast();
  const navigate = useNavigate();
  const [employees, setEmployees] = useState(initEmployees);
  const [search, setSearch] = useState('');
  const [filterGrade, setFilterGrade] = useState('');
  const [filterTeam, setFilterTeam] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [modal, setModal] = useState(null); // null | { mode: 'add' } | { mode: 'edit', id }
  const [form, setForm] = useState(emptyForm);

  function openAdd() {
    setForm(emptyForm);
    setModal({ mode: 'add' });
  }

  function openEdit(emp) {
    const [firstName, ...rest] = emp.name.split(' ');
    setForm({
      firstName,
      lastName: rest.join(' '),
      email: `${firstName.toLowerCase()}@company.com`,
      grade: emp.grade,
      team: emp.team,
      manager: emp.manager,
      city: emp.city,
      vehicle: Array.isArray(emp.vehicle) ? emp.vehicle : [emp.vehicle],
    });
    setModal({ mode: 'edit', id: emp.id });
  }

  function toggleVehicle(v) {
    setForm(f => ({
      ...f,
      vehicle: f.vehicle.includes(v) ? f.vehicle.filter(x => x !== v) : [...f.vehicle, v],
    }));
  }

  function saveEmployee() {
    const name = `${form.firstName.trim()} ${form.lastName.trim()}`.trim();
    if (!name || !form.email.trim()) { show('Name and email are required.', 'error'); return; }

    if (modal.mode === 'add') {
      const newId = Math.max(...employees.map(e => e.id), 0) + 1;
      setEmployees(prev => [...prev, {
        id: newId, name, grade: form.grade, team: form.team,
        manager: form.manager, vehicle: form.vehicle, city: form.city,
        status: 'active', lastActive: 'Just now',
      }]);
      show('Employee added successfully!', 'success');
    } else {
      setEmployees(prev => prev.map(e => e.id === modal.id
        ? { ...e, name, grade: form.grade, team: form.team, manager: form.manager, vehicle: form.vehicle, city: form.city }
        : e
      ));
      show('Employee updated successfully!', 'success');
    }
    setModal(null);
  }

  const filtered = employees.filter(e => {
    if (filterGrade && e.grade !== filterGrade) return false;
    if (filterTeam && e.team !== filterTeam) return false;
    if (filterStatus === 'active' && e.status !== 'active') return false;
    if (filterStatus === 'on-leave' && e.status !== 'on-leave') return false;
    if (filterStatus === 'offboarded' && e.status !== 'offboarded') return false;
    if (search && !e.name.toLowerCase().includes(search.toLowerCase()) && !e.team.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const vehicleDisplay = v => {
    const list = Array.isArray(v) ? v : [v];
    return list.map((x, i) => (
      <span key={i}>
        <i className={x === '4W' ? 'ri-car-line' : x === 'Taxi' ? 'ri-taxi-line' : 'ri-motorbike-line'} style={{ color: 'var(--accent)', marginRight: 3 }}></i>
        {x}{i < list.length - 1 ? ', ' : ''}
      </span>
    ));
  };

  const isEdit = modal?.mode === 'edit';

  return (
    <AppShell title="Users & Grades" actions={
      <button className="btn btn-primary btn-sm" onClick={openAdd}>
        <i className="ri-user-add-line"></i> Add Employee
      </button>
    }>
      {/* Stats */}
      <div className="stats-grid mb-24" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
        {[
          { icon: 'ri-group-line',        cls: 'teal',  label: 'Total Employees', val: employees.length },
          { icon: 'ri-user-location-line',cls: 'blue',  label: 'Active Today',    val: employees.filter(e => e.status === 'active').length },
          { icon: 'ri-user-settings-line',cls: 'amber', label: 'Managers',        val: employees.filter(e => e.grade === 'G4' || e.grade === 'G5').length },
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
          <select className="form-control" style={{ width: 130 }} value={filterGrade} onChange={e => setFilterGrade(e.target.value)}>
            <option value="">All Grades</option>
            {GRADE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
          <select className="form-control" style={{ width: 130 }} value={filterTeam} onChange={e => setFilterTeam(e.target.value)}>
            <option value="">All Teams</option>
            {TEAM_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
          <select className="form-control" style={{ width: 130 }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="on-leave">On Leave</option>
            <option value="offboarded">Offboarded</option>
          </select>
        </div>
      </div>

      {/* Employees table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">Employee Directory</div>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{employees.length} employees · {filtered.length} shown</span>
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
                    <td>{vehicleDisplay(e.vehicle)}</td>
                    <td>{e.city}</td>
                    <td>
                      <span className={`badge ${e.status === 'active' ? 'badge-green' : 'badge-amber'}`}>
                        {e.status === 'active' ? <><i className="ri-checkbox-blank-circle-fill" style={{ fontSize: 6 }}></i> Active</> : 'On Leave'}
                      </span>
                    </td>
                    <td><span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{e.lastActive}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => openEdit(e)}><i className="ri-edit-line"></i></button>
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

      {/* Add / Edit Employee Modal */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 28, width: 480, maxWidth: '90vw', animation: 'fadeIn 0.2s ease' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ fontSize: 16, fontWeight: 700 }}>
                <i className={isEdit ? 'ri-edit-line' : 'ri-user-add-line'} style={{ color: 'var(--accent)', marginRight: 8 }}></i>
                {isEdit ? 'Edit Employee' : 'Add New Employee'}
              </div>
              <button className="icon-btn" onClick={() => setModal(null)}><i className="ri-close-line"></i></button>
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input className="form-control" placeholder="Amit" value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input className="form-control" placeholder="Kumar" value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" placeholder="amit@company.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Grade</label>
                <select className="form-control" value={form.grade} onChange={e => setForm(f => ({ ...f, grade: e.target.value }))}>
                  {GRADE_OPTIONS.map(g => <option key={g} value={g}>{g} — {GRADE_LABELS[g]}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Team</label>
                <select className="form-control" value={form.team} onChange={e => setForm(f => ({ ...f, team: e.target.value }))}>
                  {TEAM_OPTIONS.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Reporting Manager</label>
                <select className="form-control" value={form.manager} onChange={e => setForm(f => ({ ...f, manager: e.target.value }))}>
                  {MANAGER_OPTIONS.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Base City</label>
                <select className="form-control" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))}>
                  {CITY_OPTIONS.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Vehicle Eligibility</label>
              <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
                {[['2W', 'ri-motorbike-line', '2-Wheeler'], ['4W', 'ri-car-line', '4-Wheeler'], ['Taxi', 'ri-taxi-line', 'Taxi/Cab']].map(([val, icon, lbl]) => (
                  <label key={val} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                    <input type="checkbox" checked={form.vehicle.includes(val)} onChange={() => toggleVehicle(val)} />
                    <i className={icon}></i> {lbl}
                  </label>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
              <button className="btn btn-ghost" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={saveEmployee}>
                <i className="ri-save-line"></i> {isEdit ? 'Save Changes' : 'Add Employee'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
