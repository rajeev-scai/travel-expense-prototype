import React, { useState, useMemo, useRef, useEffect } from 'react';
import AppShell from '../../components/layout/AppShell.jsx';
import { useToast } from '../../contexts/ToastContext.jsx';
import { allExpenses, employees, CAT_META } from '../../utils/sampleData.js';
import { Fmt } from '../../utils/fmt.js';

const PIN_COLORS  = { valid: '#00d4aa', amber: '#f59e0b', red: '#ef4444' };
const DEC_COLORS  = { pending: 'var(--amber)', approved: 'var(--green)', rejected: 'var(--red)', flagged: 'var(--amber)' };
const DEC_CLASSES = { pending: 'badge-amber', approved: 'badge-green', rejected: 'badge-red', flagged: 'badge-amber' };

function decisionLabel(d) {
  return { pending: 'Pending', approved: 'Approved', rejected: 'Rejected', flagged: 'Flagged' }[d] || d;
}

export default function ExpensesPage() {
  const { show } = useToast();
  const [data, setData] = useState(() => allExpenses.map(e => ({ ...e })));
  const [filterEmp, setFilterEmp]     = useState('');
  const [filterCat, setFilterCat]     = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [searchText, setSearchText]   = useState('');
  const [selected, setSelected]       = useState(new Set());
  const [collapsed, setCollapsed]     = useState({});
  const [remarksModal, setRemarksModal] = useState(null); // { action, ids, context }
  const [remarksText, setRemarksText] = useState('');

  // Filter
  const filtered = useMemo(() => data.filter(e => {
    if (filterEmp && e.emp !== filterEmp) return false;
    if (filterCat && e.category !== filterCat) return false;
    if (filterStatus && e.decision !== filterStatus) return false;
    if (searchText) {
      const q = searchText.toLowerCase();
      if (!e.emp.toLowerCase().includes(q) && !e.category.toLowerCase().includes(q) && !e.id.toLowerCase().includes(q)) return false;
    }
    return true;
  }), [data, filterEmp, filterCat, filterStatus, searchText]);

  // Group by category
  const groups = useMemo(() => {
    const g = {};
    filtered.forEach(e => { (g[e.category] = g[e.category] || []).push(e); });
    return g;
  }, [filtered]);

  // Summary stats
  const summary = useMemo(() => ({
    total:    data.length,
    pending:  data.filter(e => e.decision === 'pending').length,
    approved: data.filter(e => e.decision === 'approved').length,
    rejected: data.filter(e => e.decision === 'rejected').length,
    flagged:  data.filter(e => e.decision === 'flagged').length,
    amount:   data.filter(e => e.decision === 'pending').reduce((s, e) => s + e.amount, 0),
  }), [data]);

  // Apply decision to IDs
  const applyDecision = (ids, decision, remarks = '') => {
    setData(prev => prev.map(e => ids.includes(e.id) && e.decision === 'pending' ? { ...e, decision, remarks } : e));
    setSelected(prev => { const n = new Set(prev); ids.forEach(id => n.delete(id)); return n; });
  };

  const openRemarks = (action, ids, context = '') => {
    setRemarksModal({ action, ids, context });
    setRemarksText('');
  };

  const confirmRemarks = () => {
    if (!remarksText.trim()) { show('Please enter remarks.', 'warning'); return; }
    const { action, ids } = remarksModal;
    applyDecision(ids, action === 'reject' ? 'rejected' : 'flagged', remarksText.trim());
    show(`${action === 'reject' ? 'Rejected' : 'Flagged'} ${ids.length} expense(s)`, action === 'reject' ? 'error' : 'warning');
    setRemarksModal(null);
  };

  // Bulk actions (from selected set)
  const bulkApprove = () => {
    const ids = [...selected].filter(id => data.find(e => e.id === id)?.decision === 'pending');
    if (!ids.length) { show('No pending expenses selected.', 'warning'); return; }
    applyDecision(ids, 'approved');
    show(`✓ Approved ${ids.length} expense(s)`, 'success');
  };
  const bulkReject = () => {
    const ids = [...selected].filter(id => data.find(e => e.id === id)?.decision === 'pending');
    if (!ids.length) { show('No pending expenses selected.', 'warning'); return; }
    openRemarks('reject', ids, `${ids.length} selected expenses`);
  };

  // Category actions
  const catApproveValid = (cat) => {
    const ids = (groups[cat] || []).filter(e => e.pin === 'valid' && e.decision === 'pending').map(e => e.id);
    if (!ids.length) { show('No pending valid expenses in this category.', 'warning'); return; }
    applyDecision(ids, 'approved');
    show(`✓ Approved ${ids.length} valid ${cat} expense(s)`, 'success');
  };
  const catRejectAll = (cat) => {
    const ids = (groups[cat] || []).filter(e => e.decision === 'pending').map(e => e.id);
    if (!ids.length) { show('No pending expenses in this category.', 'warning'); return; }
    openRemarks('reject', ids, `all pending ${cat} expenses`);
  };

  const toggleSelect = (id, checked) => {
    setSelected(prev => { const n = new Set(prev); checked ? n.add(id) : n.delete(id); return n; });
  };
  const toggleGroup = (cat, checked) => {
    const ids = (groups[cat] || []).map(e => e.id);
    setSelected(prev => { const n = new Set(prev); ids.forEach(id => checked ? n.add(id) : n.delete(id)); return n; });
  };
  const toggleAll = (checked) => {
    setSelected(checked ? new Set(filtered.map(e => e.id)) : new Set());
  };

  const categories = useMemo(() => [...new Set(data.map(e => e.category))].sort(), [data]);
  const empNames   = useMemo(() => [...new Set(data.map(e => e.emp))].sort(), [data]);

  const selectedPending = [...selected].filter(id => data.find(e => e.id === id)?.decision === 'pending');

  return (
    <AppShell title="Expense Claims">
      <style>{`
        .exp-table tr:hover td { background: rgba(255,255,255,0.02); }
        .group-header { background: var(--bg2); border-radius: 8px; padding: 10px 14px; display:flex; align-items:center; gap:10px; cursor:pointer; user-select:none; }
        .group-header:hover { background: rgba(255,255,255,0.04); }
        .cat-badge { display:inline-flex;align-items:center;gap:6px;padding:4px 10px;border-radius:12px;font-size:12px;font-weight:600; }
      `}</style>

      {/* Summary stats */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(5,1fr)', marginBottom: 20 }}>
        {[
          { icon: 'ri-file-list-3-line', cls: 'teal',  label: 'Total Claims',    val: summary.total },
          { icon: 'ri-time-line',        cls: 'amber', label: 'Pending Review',  val: summary.pending },
          { icon: 'ri-check-line',       cls: 'teal',  label: 'Approved',        val: summary.approved },
          { icon: 'ri-close-line',       cls: 'red',   label: 'Rejected',        val: summary.rejected },
          { icon: 'ri-money-rupee-circle-line', cls: 'blue', label: 'Pending Amount', val: Fmt.currency(summary.amount) },
        ].map(s => (
          <div key={s.label} className="stat-card" style={{ padding: 14 }}>
            <div className={`stat-icon ${s.cls}`} style={{ width: 32, height: 32, fontSize: 14 }}><i className={s.icon}></i></div>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value" style={{ fontSize: 22 }}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* Filters + bulk toolbar */}
      <div className="card" style={{ marginBottom: 20, padding: '14px 16px' }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: '1 1 180px' }}>
            <i className="ri-search-line" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 14 }}></i>
            <input className="form-control" style={{ paddingLeft: 32 }} placeholder="Search employee, category, ID…" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </div>
          <select className="form-control" style={{ flex: '0 0 150px' }} value={filterEmp} onChange={e => setFilterEmp(e.target.value)}>
            <option value="">All Employees</option>
            {empNames.map(n => <option key={n} value={n}>{n}</option>)}
          </select>
          <select className="form-control" style={{ flex: '0 0 150px' }} value={filterCat} onChange={e => setFilterCat(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select className="form-control" style={{ flex: '0 0 140px' }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="flagged">Flagged</option>
          </select>
          {selectedPending.length > 0 && (
            <div style={{ display: 'flex', gap: 8, marginLeft: 'auto', alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{selectedPending.length} pending selected</span>
              <button className="btn btn-primary btn-sm" onClick={bulkApprove}><i className="ri-check-double-line"></i> Approve</button>
              <button className="btn btn-danger btn-sm" onClick={bulkReject}><i className="ri-close-line"></i> Reject</button>
            </div>
          )}
        </div>
      </div>

      {/* Category groups */}
      {Object.keys(groups).length === 0 && (
        <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 40 }}>
          <i className="ri-filter-off-line" style={{ fontSize: 32, marginBottom: 8, display: 'block' }}></i>
          No expenses match the current filters.
        </div>
      )}

      {Object.entries(groups).map(([cat, exps]) => {
        const catM    = CAT_META[cat] || {};
        const isOpen  = !collapsed[cat];
        const groupIds = exps.map(e => e.id);
        const allSelected   = groupIds.every(id => selected.has(id));
        const someSelected  = groupIds.some(id => selected.has(id)) && !allSelected;
        const pendingCount  = exps.filter(e => e.decision === 'pending').length;
        const totalAmt      = exps.reduce((s, e) => s + e.amount, 0);

        return (
          <div key={cat} className="card" style={{ marginBottom: 16, padding: 0, overflow: 'hidden' }}>
            {/* Group header */}
            <div className="group-header" onClick={() => setCollapsed(prev => ({ ...prev, [cat]: !prev[cat] }))}>
              <input type="checkbox" checked={allSelected} ref={el => { if (el) el.indeterminate = someSelected; }}
                onChange={e => { e.stopPropagation(); toggleGroup(cat, e.target.checked); }}
                onClick={e => e.stopPropagation()}
                style={{ width: 15, height: 15, accentColor: 'var(--accent)', flexShrink: 0 }}
              />
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: catM.bg || 'var(--border)', color: catM.color || 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0 }}>
                <i className={catM.icon || 'ri-receipt-line'}></i>
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ fontWeight: 700, fontSize: 14 }}>{cat}</span>
                <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 10 }}>{exps.length} claims · {Fmt.currency(totalAmt)}</span>
                {pendingCount > 0 && <span className="badge badge-amber" style={{ marginLeft: 8, fontSize: 10 }}>{pendingCount} pending</span>}
              </div>
              {pendingCount > 0 && (
                <div style={{ display: 'flex', gap: 6, marginRight: 8 }} onClick={e => e.stopPropagation()}>
                  <button className="btn btn-sm btn-primary" onClick={() => catApproveValid(cat)}><i className="ri-check-line"></i> Approve Valid</button>
                  <button className="btn btn-sm btn-danger" onClick={() => catRejectAll(cat)}><i className="ri-close-line"></i> Reject All</button>
                </div>
              )}
              <i className={`ri-arrow-${isOpen ? 'up' : 'down'}-s-line`} style={{ color: 'var(--text-muted)', fontSize: 18 }}></i>
            </div>

            {/* Expense rows */}
            {isOpen && (
              <div className="table-wrap">
                <table className="exp-table">
                  <thead>
                    <tr>
                      <th style={{ width: 32 }}>
                        <input type="checkbox" checked={allSelected} ref={el => { if (el) el.indeterminate = someSelected; }}
                          onChange={e => toggleGroup(cat, e.target.checked)}
                          style={{ width: 14, height: 14, accentColor: 'var(--accent)' }}
                        />
                      </th>
                      <th>ID</th><th>Employee</th><th>Date</th><th>Amount</th><th>Pin</th><th>Note</th><th>Status</th><th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exps.map(exp => (
                      <tr key={exp.id}>
                        <td>
                          <input type="checkbox" checked={selected.has(exp.id)} onChange={e => toggleSelect(exp.id, e.target.checked)}
                            style={{ width: 14, height: 14, accentColor: 'var(--accent)' }}
                          />
                        </td>
                        <td><span style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--text-muted)' }}>{exp.id}</span></td>
                        <td style={{ fontWeight: 600 }}>{exp.emp}</td>
                        <td>{Fmt.dateShort(exp.date)}</td>
                        <td><strong style={{ color: 'var(--accent)' }}>{Fmt.currency(exp.amount)}</strong></td>
                        <td>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12 }}>
                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: PIN_COLORS[exp.pin] || '#64748b', display: 'inline-block' }}></span>
                            {exp.pin === 'valid' ? 'Valid' : exp.pin === 'amber' ? 'Deviated' : 'Violation'}
                          </span>
                        </td>
                        <td style={{ fontSize: 11, color: 'var(--text-muted)', maxWidth: 180, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{exp.note || '—'}</td>
                        <td>
                          <span className={`badge ${DEC_CLASSES[exp.decision] || 'badge-gray'}`}>{decisionLabel(exp.decision)}</span>
                          {exp.remarks && <div style={{ fontSize: 10, color: 'var(--text-dim)', marginTop: 2 }}>{exp.remarks}</div>}
                        </td>
                        <td>
                          {exp.decision === 'pending' ? (
                            <div style={{ display: 'flex', gap: 4 }}>
                              <button className="btn btn-sm btn-primary" style={{ padding: '4px 8px', fontSize: 11 }} onClick={() => { applyDecision([exp.id], 'approved'); show('Approved!', 'success'); }}><i className="ri-check-line"></i></button>
                              <button className="btn btn-sm btn-danger" style={{ padding: '4px 8px', fontSize: 11 }} onClick={() => openRemarks('reject', [exp.id], exp.category)}><i className="ri-close-line"></i></button>
                              <button className="btn btn-sm btn-ghost" style={{ padding: '4px 8px', fontSize: 11, color: 'var(--amber)' }} onClick={() => openRemarks('flag', [exp.id], exp.category)}><i className="ri-flag-line"></i></button>
                            </div>
                          ) : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })}

      {/* Remarks modal */}
      {remarksModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000 }}>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 28, width: 440, maxWidth: '90vw', boxShadow: '0 16px 48px rgba(0,0,0,0.5)' }}>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>
              {remarksModal.action === 'reject' ? '✕ Reject Expense' : '⚑ Flag Expense'}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 14 }}>
              Action applies to: <strong>{remarksModal.context}</strong>
            </div>
            <textarea className="form-control" rows={3} placeholder="Enter reason / remarks…"
              value={remarksText} onChange={e => setRemarksText(e.target.value)}
              style={{ resize: 'vertical' }} autoFocus
            />
            <div style={{ display: 'flex', gap: 8, marginTop: 16, justifyContent: 'flex-end' }}>
              <button className="btn btn-ghost btn-sm" onClick={() => setRemarksModal(null)}>Cancel</button>
              <button
                className={`btn btn-sm ${remarksModal.action === 'reject' ? 'btn-danger' : ''}`}
                style={remarksModal.action !== 'reject' ? { background: 'rgba(245,158,11,0.15)', color: 'var(--amber)', border: '1px solid rgba(245,158,11,0.5)' } : {}}
                onClick={confirmRemarks}
              >
                Confirm {remarksModal.action === 'reject' ? 'Rejection' : 'Flag'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
