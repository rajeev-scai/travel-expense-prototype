import React, { useState, useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import AppShell from '../../components/layout/AppShell.jsx';
import { useToast } from '../../contexts/ToastContext.jsx';
import { journeys, CAT_META } from '../../utils/sampleData.js';
import { Fmt } from '../../utils/fmt.js';

const PIN_COLORS      = { valid: '#00d4aa', amber: '#f59e0b', red: '#ef4444' };
const DECISION_COLORS = { pending: null, approved: '#00d4aa', rejected: '#ef4444', flagged: '#f59e0b' };
const DECISION_ICONS  = { pending: null, approved: '✓', rejected: '✕', flagged: '⚑' };

// Unique employees and dates for selector
const EMPLOYEES = [...new Map(journeys.map(j => [j.employee.id, j.employee])).values()];
const initJourney = (raw) => JSON.parse(JSON.stringify(raw));

export default function ApprovalPage() {
  const { show } = useToast();
  const mapRef      = useRef(null);
  const mapInstance = useRef(null);
  const pathLayers  = useRef([]);
  const pinMarkers  = useRef([]);

  const [empId,   setEmpId]   = useState(EMPLOYEES[0].id);
  const [dateKey, setDateKey] = useState(journeys[0].dateKey);

  // Available dates for selected employee
  const availDates = journeys
    .filter(j => j.employee.id === empId)
    .map(j => ({ key: j.dateKey, label: j.date }));

  // Active journey raw object
  const rawJourney = journeys.find(j => j.employee.id === empId && j.dateKey === dateKey)
    || journeys.find(j => j.employee.id === empId)
    || journeys[0];

  const [jny,      setJny]      = useState(() => initJourney(rawJourney));
  const [selected, setSelected] = useState(null);
  const [remarksModal, setRemarksModal] = useState(null);
  const [remarksText,  setRemarksText]  = useState('');

  // When employee or date changes, reload journey and reset map
  useEffect(() => {
    const raw = journeys.find(j => j.employee.id === empId && j.dateKey === dateKey)
      || journeys.find(j => j.employee.id === empId)
      || journeys[0];
    setJny(initJourney(raw));
    setSelected(null);

    // Destroy map so it re-inits with new path
    if (mapInstance.current) {
      mapInstance.current.remove();
      mapInstance.current = null;
      pathLayers.current = [];
      pinMarkers.current = [];
    }
  }, [empId, dateKey]);

  // Fix date when employee changes (keep same date if available, else first)
  const handleEmpChange = (id) => {
    setEmpId(id);
    const datesForEmp = journeys.filter(j => j.employee.id === id).map(j => j.dateKey);
    if (!datesForEmp.includes(dateKey)) setDateKey(datesForEmp[0]);
  };

  const stats = {
    total:    jny.expenses.length,
    approved: jny.expenses.filter(e => e.decision === 'approved').length,
    pending:  jny.expenses.filter(e => e.decision === 'pending').length,
    rejected: jny.expenses.filter(e => e.decision === 'rejected').length,
  };

  /* ── Map init ─────────────────────────────────────────────────── */
  useEffect(() => {
    if (mapInstance.current || !mapRef.current) return;

    const map = L.map(mapRef.current, { zoomControl: true, attributionControl: true });
    mapInstance.current = map;

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap contributors, © CARTO', maxZoom: 19,
    }).addTo(map);

    pathLayers.current = [
      L.polyline(jny.path, { color: '#0f172a', weight: 20, opacity: 0.18, lineJoin: 'round', lineCap: 'round' }).addTo(map),
      L.polyline(jny.path, { color: '#ffffff',  weight: 14, opacity: 0.85, lineJoin: 'round', lineCap: 'round' }).addTo(map),
      L.polyline(jny.path, { color: '#00d4aa',  weight: 9,  opacity: 1.0,  lineJoin: 'round', lineCap: 'round' }).addTo(map),
    ];

    const attIcon = (letter) => L.divIcon({
      className: '', iconSize: [40, 52], iconAnchor: [20, 52],
      html: `<div style="width:40px;height:52px;display:flex;flex-direction:column;align-items:center;">
        <div style="width:40px;height:40px;border-radius:50%;background:#8b5cf6;border:3px solid #fff;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:800;color:#fff;box-shadow:0 6px 18px rgba(139,92,246,0.55);">${letter}</div>
        <div style="width:0;height:0;border-left:7px solid transparent;border-right:7px solid transparent;border-top:12px solid #8b5cf6;"></div>
      </div>`,
    });

    const attLabels = { home: 'H', checkin: '✓', checkout: '✕' };
    jny.attendance.forEach(a => {
      L.marker(a.coords, { icon: attIcon(attLabels[a.type] || 'A') })
        .bindTooltip(`<b>${a.label}</b><br>${a.time}`, { direction: 'top' })
        .addTo(map);
    });

    map.fitBounds(L.latLngBounds(jny.path), { padding: [40, 40] });
    return () => { map.remove(); mapInstance.current = null; };
  }, [jny]);

  /* ── Expense pins ─────────────────────────────────────────────── */
  const refreshPins = useCallback((expenses) => {
    const map = mapInstance.current;
    if (!map) return;
    pinMarkers.current.forEach(m => map.removeLayer(m));
    pinMarkers.current = [];
    expenses.forEach(exp => {
      const baseColor  = DECISION_COLORS[exp.decision] || PIN_COLORS[exp.pin] || '#64748b';
      const alpha      = exp.decision === 'pending' ? 1 : 0.55;
      const innerLabel = DECISION_ICONS[exp.decision] || String(exp.seq);
      const icon = L.divIcon({
        className: '', iconSize: [36, 48], iconAnchor: [18, 48],
        html: `<div style="width:36px;height:48px;display:flex;flex-direction:column;align-items:center;cursor:pointer;opacity:${alpha};">
          <div style="width:36px;height:36px;border-radius:50%;background:${baseColor};border:3px solid #fff;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;color:#fff;box-shadow:0 5px 16px ${baseColor}88;">${innerLabel}</div>
          <div style="width:0;height:0;border-left:7px solid transparent;border-right:7px solid transparent;border-top:12px solid ${baseColor};"></div>
        </div>`,
      });
      const marker = L.marker(exp.coords, { icon });
      marker.on('click', () => setSelected(exp));
      marker.addTo(map);
      pinMarkers.current.push(marker);
    });
  }, []);

  useEffect(() => { refreshPins(jny.expenses); }, [jny.expenses, refreshPins]);

  /* ── Decision helpers ─────────────────────────────────────────── */
  const applyDecision = (expId, decision, remarks = '') => {
    setJny(prev => ({ ...prev, expenses: prev.expenses.map(e => e.id === expId ? { ...e, decision, remarks } : e) }));
    setSelected(null);
  };

  const approveSelected = () => {
    if (!selected || selected.decision !== 'pending') return;
    applyDecision(selected.id, 'approved');
    show(`✓ ${selected.category} ${Fmt.currency(selected.amount)} approved!`, 'success');
  };

  const rejectSelected = () => {
    if (!selected || selected.decision !== 'pending') return;
    setRemarksModal({ action: 'reject', expId: selected.id });
    setRemarksText('');
  };

  const flagSelected = () => {
    if (!selected || selected.decision !== 'pending') return;
    setRemarksModal({ action: 'flag', expId: selected.id });
    setRemarksText('');
  };

  const confirmRemarks = () => {
    if (!remarksText.trim()) { show('Please enter remarks before proceeding.', 'warning'); return; }
    const { action, expId } = remarksModal;
    const exp = jny.expenses.find(e => e.id === expId);
    applyDecision(expId, action === 'reject' ? 'rejected' : 'flagged', remarksText.trim());
    show(`${action === 'reject' ? '✕ Rejected' : '⚑ Flagged'}: ${exp?.category}`, action === 'reject' ? 'error' : 'warning');
    setRemarksModal(null);
  };

  const approveAll = () => {
    const validPending = jny.expenses.filter(e => e.pin === 'valid' && e.decision === 'pending');
    if (!validPending.length) { show('No pending valid expenses to approve.', 'warning'); return; }
    setJny(prev => ({ ...prev, expenses: prev.expenses.map(e => (e.pin === 'valid' && e.decision === 'pending') ? { ...e, decision: 'approved' } : e) }));
    setSelected(null);
    show(`✓ ${validPending.length} valid expense(s) approved!`, 'success');
  };

  const selectedFull = selected ? jny.expenses.find(e => e.id === selected.id) : null;
  const emp = jny.employee;
  const initials = emp.name.split(' ').map(w => w[0]).join('').slice(0, 2);

  return (
    <AppShell title="Journey Review">
      <style>{`
        .claim-item { display:flex;align-items:center;gap:12px;padding:10px 14px;cursor:pointer;transition:background 0.15s;border-bottom:1px solid var(--border);border-left:3px solid transparent; }
        .claim-item:hover { background:var(--bg); }
        .claim-item.active { background:rgba(0,212,170,0.07);border-left-color:var(--accent); }
        .emp-pill { padding:6px 14px;border-radius:20px;font-size:12px;font-weight:600;cursor:pointer;border:1px solid var(--border);background:var(--bg);color:var(--text-muted);transition:all 0.15s; }
        .emp-pill.active { background:var(--accent);color:#0f172a;border-color:var(--accent); }
        .emp-pill:hover:not(.active) { border-color:var(--accent);color:var(--accent); }
        .date-pill { padding:5px 12px;border-radius:16px;font-size:11px;font-weight:600;cursor:pointer;border:1px solid var(--border);background:var(--bg);color:var(--text-muted);transition:all 0.15s; }
        .date-pill.active { background:rgba(0,212,170,0.12);color:var(--accent);border-color:var(--accent); }
        .date-pill:hover:not(.active) { border-color:var(--accent);color:var(--accent); }
      `}</style>

      {/* Selector bar */}
      <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:14, flexWrap:'wrap' }}>
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          <span style={{ fontSize:11, color:'var(--text-muted)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.5px' }}>Employee</span>
          {EMPLOYEES.map(e => (
            <button key={e.id} className={`emp-pill${empId === e.id ? ' active' : ''}`} onClick={() => handleEmpChange(e.id)}>
              {e.name.split(' ')[0]} {e.name.split(' ')[1][0]}.
            </button>
          ))}
        </div>
        <div style={{ width:1, height:24, background:'var(--border)' }} />
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          <span style={{ fontSize:11, color:'var(--text-muted)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.5px' }}>Date</span>
          {availDates.map(d => (
            <button key={d.key} className={`date-pill${dateKey === d.key ? ' active' : ''}`} onClick={() => setDateKey(d.key)}>
              <i className="ri-calendar-line" style={{ marginRight:4 }}></i>{d.label}
            </button>
          ))}
        </div>
        <button className="btn btn-primary btn-sm" style={{ marginLeft:'auto' }} onClick={approveAll}>
          <i className="ri-check-double-line"></i> Approve All Valid
        </button>
      </div>

      {/* Employee summary bar */}
      <div className="card" style={{ marginBottom:14, padding:'12px 16px', display:'flex', alignItems:'center', gap:16, flexWrap:'wrap' }}>
        <div style={{ width:44, height:44, borderRadius:'50%', background:'linear-gradient(135deg,#00d4aa,#0096ff)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, fontWeight:800, color:'#fff', flexShrink:0 }}>{initials}</div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:15, fontWeight:700 }}>{emp.name}</div>
          <div style={{ fontSize:11, color:'var(--text-muted)' }}>ID: {emp.id} · Grade {emp.grade} · {emp.vehicle} · {emp.city}</div>
        </div>
        <div style={{ display:'flex', gap:20, flexWrap:'wrap' }}>
          {[
            { icon:'ri-time-line',    val:`${jny.startTime} – ${jny.endTime}` },
            { icon:'ri-route-line',   val:Fmt.km(jny.totalKm) },
            { icon:'ri-map-pin-line', val:`${jny.stops} Stops` },
          ].map(m => (
            <div key={m.icon} style={{ display:'flex', alignItems:'center', gap:6 }}>
              <i className={m.icon} style={{ color:'var(--accent)', fontSize:14 }}></i>
              <span style={{ fontSize:12, fontWeight:600 }}>{m.val}</span>
            </div>
          ))}
        </div>
        <div style={{ display:'flex', gap:10, flexShrink:0 }}>
          {[
            { label:'Total',    val:stats.total,    color:'var(--text)' },
            { label:'Approved', val:stats.approved, color:'var(--green)' },
            { label:'Pending',  val:stats.pending,  color:'var(--amber)' },
            { label:'Rejected', val:stats.rejected, color:'var(--red)' },
          ].map(s => (
            <div key={s.label} style={{ textAlign:'center', padding:'6px 12px', background:'var(--bg)', borderRadius:8, border:'1px solid var(--border)' }}>
              <div style={{ fontSize:20, fontWeight:800, color:s.color }}>{s.val}</div>
              <div style={{ fontSize:10, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.5px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main split: map + claim list — fills remaining viewport */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:16, height:'calc(100vh - 268px)', minHeight:400 }}>

        {/* Map */}
        <div style={{ position:'relative', borderRadius:'var(--radius)', overflow:'hidden', border:'1px solid var(--border)' }}>
          <div ref={mapRef} style={{ width:'100%', height:'100%' }} />

          {/* Detail overlay */}
          {selectedFull && (
            <div style={{ position:'absolute', bottom:0, left:0, right:0, background:'var(--card)', borderTop:'2px solid var(--accent)', padding:'14px 18px', zIndex:1500, boxShadow:'0 -4px 24px rgba(0,0,0,0.45)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:10, flexWrap:'wrap' }}>
                <div style={{ width:36, height:36, borderRadius:'50%', background:`${CAT_META[selectedFull.category]?.color || '#64748b'}20`, color:CAT_META[selectedFull.category]?.color || '#64748b', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 }}>
                  <i className={CAT_META[selectedFull.category]?.icon || 'ri-receipt-line'}></i>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, fontSize:14 }}>{selectedFull.category}</div>
                  <div style={{ fontSize:12, color:'var(--text-muted)' }}>{selectedFull.time} · {selectedFull.receipt ? '📄 Receipt attached' : '⚠ No receipt'}</div>
                </div>
                <div style={{ fontSize:22, fontWeight:800, color:'var(--accent)' }}>{Fmt.currency(selectedFull.amount)}</div>
                <button onClick={() => setSelected(null)} style={{ background:'none', border:'none', color:'var(--text-muted)', fontSize:18, cursor:'pointer' }}><i className="ri-close-line"></i></button>
              </div>
              <div style={{ fontSize:12, color:'var(--text-muted)', marginBottom:12, padding:'8px 12px', background:'var(--bg)', borderRadius:8, borderLeft:`3px solid ${PIN_COLORS[selectedFull.pin] || '#64748b'}` }}>
                <i className="ri-map-pin-line" style={{ marginRight:6 }}></i>{selectedFull.note}
              </div>
              {selectedFull.decision === 'pending' ? (
                <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                  <button className="btn btn-primary btn-sm" onClick={approveSelected}><i className="ri-check-line"></i> Approve</button>
                  <button className="btn btn-danger btn-sm" onClick={rejectSelected}><i className="ri-close-line"></i> Reject</button>
                  <button className="btn btn-ghost btn-sm" style={{ color:'var(--amber)', borderColor:'var(--amber)' }} onClick={flagSelected}><i className="ri-flag-line"></i> Flag</button>
                </div>
              ) : (
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <span className={`badge ${selectedFull.decision === 'approved' ? 'badge-green' : selectedFull.decision === 'rejected' ? 'badge-red' : 'badge-amber'}`}>
                    {selectedFull.decision.charAt(0).toUpperCase() + selectedFull.decision.slice(1)}
                  </span>
                  {selectedFull.remarks && <span style={{ fontSize:12, color:'var(--text-muted)' }}>— {selectedFull.remarks}</span>}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Claim list */}
        <div className="card" style={{ padding:0, overflow:'hidden', display:'flex', flexDirection:'column' }}>
          <div style={{ padding:'12px 14px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div style={{ fontWeight:600, fontSize:13 }}>Expense Claims</div>
            <span style={{ fontSize:11, color:'var(--text-muted)' }}>{jny.expenses.length} total</span>
          </div>
          <div style={{ flex:1, overflowY:'auto' }}>
            {jny.expenses.map(exp => {
              const catM = CAT_META[exp.category] || {};
              const isActive = selectedFull?.id === exp.id;
              const decisionColor = DECISION_COLORS[exp.decision] || PIN_COLORS[exp.pin] || '#64748b';
              return (
                <div key={exp.id} className={`claim-item${isActive ? ' active' : ''}`} onClick={() => setSelected(exp)}>
                  <div style={{ width:32, height:32, borderRadius:'50%', background:`${catM.color || '#64748b'}20`, color:catM.color || '#64748b', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, flexShrink:0 }}>
                    <i className={catM.icon || 'ri-receipt-line'}></i>
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13, fontWeight:600, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{exp.category}</div>
                    <div style={{ fontSize:11, color:'var(--text-muted)' }}>{exp.time}</div>
                  </div>
                  <div style={{ textAlign:'right', flexShrink:0 }}>
                    <div style={{ fontSize:13, fontWeight:700, color:'var(--accent)' }}>{Fmt.currency(exp.amount)}</div>
                    <div style={{ display:'flex', alignItems:'center', gap:4, justifyContent:'flex-end', marginTop:2 }}>
                      <div style={{ width:7, height:7, borderRadius:'50%', background:decisionColor }}></div>
                      <span style={{ fontSize:10, color:'var(--text-muted)', textTransform:'capitalize' }}>{exp.decision}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ padding:'12px 14px', borderTop:'1px solid var(--border)', fontSize:13, fontWeight:700, display:'flex', justifyContent:'space-between', flexShrink:0 }}>
            <span>Total</span>
            <span style={{ color:'var(--accent)' }}>{Fmt.currency(jny.expenses.reduce((s, e) => s + e.amount, 0))}</span>
          </div>
        </div>
      </div>

      {/* Remarks modal */}
      {remarksModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:3000 }}>
          <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:28, width:440, maxWidth:'90vw', boxShadow:'0 16px 48px rgba(0,0,0,0.5)' }}>
            <div style={{ fontSize:16, fontWeight:700, marginBottom:8 }}>
              {remarksModal.action === 'reject' ? '✕ Reject Expense' : '⚑ Flag Expense'}
            </div>
            <div style={{ fontSize:13, color:'var(--text-muted)', marginBottom:16 }}>Please provide a reason for this decision.</div>
            <textarea className="form-control" rows={3} placeholder="Enter remarks…" value={remarksText} onChange={e => setRemarksText(e.target.value)} style={{ resize:'vertical' }} autoFocus />
            <div style={{ display:'flex', gap:8, marginTop:16, justifyContent:'flex-end' }}>
              <button className="btn btn-ghost btn-sm" onClick={() => setRemarksModal(null)}>Cancel</button>
              <button
                className={`btn btn-sm ${remarksModal.action === 'reject' ? 'btn-danger' : ''}`}
                style={remarksModal.action !== 'reject' ? { background:'rgba(245,158,11,0.15)', color:'var(--amber)', border:'1px solid var(--amber)' } : {}}
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
