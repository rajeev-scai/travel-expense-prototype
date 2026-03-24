import React, { useState, useEffect, useRef, useCallback } from 'react';
import AppShell from '../../components/layout/AppShell.jsx';
import { useToast } from '../../contexts/ToastContext.jsx';
import { journey, CAT_META } from '../../utils/sampleData.js';
import { Fmt } from '../../utils/fmt.js';

// Deep-clone journey data so decisions persist within session
const initJourney = () => JSON.parse(JSON.stringify(journey));

const PIN_COLORS = { valid: '#00d4aa', amber: '#f59e0b', red: '#ef4444' };
const DECISION_COLORS = { pending: null, approved: '#00d4aa', rejected: '#ef4444', flagged: '#f59e0b' };
const DECISION_ICONS  = { pending: null, approved: '✓', rejected: '✕', flagged: '⚑' };

export default function ApprovalPage() {
  const { show } = useToast();
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const pathLayers  = useRef([]);
  const pinMarkers  = useRef([]);

  const [jny, setJny] = useState(initJourney);
  const [selected, setSelected] = useState(null);
  const [remarksModal, setRemarksModal] = useState(null); // { action, expId }
  const [remarksText, setRemarksText] = useState('');

  // Stats derived from jny
  const stats = {
    total:    jny.expenses.length,
    approved: jny.expenses.filter(e => e.decision === 'approved').length,
    pending:  jny.expenses.filter(e => e.decision === 'pending').length,
    rejected: jny.expenses.filter(e => e.decision === 'rejected').length,
  };

  /* ── Map initialisation (runs once) ─────────────────────────── */
  useEffect(() => {
    if (mapInstance.current || !mapRef.current) return;
    const L = window.L;
    if (!L) { console.error('Leaflet not loaded'); return; }

    const map = L.map(mapRef.current, { zoomControl: true, attributionControl: true });
    mapInstance.current = map;

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap contributors, © CARTO', maxZoom: 19,
    }).addTo(map);

    // Triple-layer path
    pathLayers.current = [
      L.polyline(journey.path, { color: '#0f172a', weight: 20, opacity: 0.18, lineJoin: 'round', lineCap: 'round' }).addTo(map),
      L.polyline(journey.path, { color: '#ffffff',  weight: 14, opacity: 0.85, lineJoin: 'round', lineCap: 'round' }).addTo(map),
      L.polyline(journey.path, { color: '#00d4aa',  weight: 9,  opacity: 1.0,  lineJoin: 'round', lineCap: 'round' }).addTo(map),
    ];

    // Attendance pins (teardrop, purple)
    const attIcon = (letter) => L.divIcon({
      className: '', iconSize: [40, 52], iconAnchor: [20, 52],
      html: `<div style="width:40px;height:52px;display:flex;flex-direction:column;align-items:center;cursor:pointer;transition:transform 0.18s cubic-bezier(.34,1.56,.64,1);transform-origin:center bottom;">
        <div style="width:40px;height:40px;border-radius:50%;background:#8b5cf6;border:3px solid #fff;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:800;color:#fff;box-shadow:0 6px 18px rgba(139,92,246,0.55);">${letter}</div>
        <div style="width:0;height:0;border-left:7px solid transparent;border-right:7px solid transparent;border-top:12px solid #8b5cf6;"></div>
      </div>`,
    });

    const attLabels = { home: 'H', checkin: '✓', checkout: '✕' };
    journey.attendance.forEach(a => {
      L.marker(a.coords, { icon: attIcon(attLabels[a.type] || 'A') })
        .bindTooltip(`<b>${a.label}</b><br>${a.time}`, { permanent: false, direction: 'top' })
        .addTo(map);
    });

    // Fit map to path
    const bounds = L.latLngBounds(journey.path);
    map.fitBounds(bounds, { padding: [40, 40] });

    return () => { map.remove(); mapInstance.current = null; };
  }, []);

  /* ── Refresh expense pins ────────────────────────────────────── */
  const refreshPins = useCallback((expenses) => {
    const L = window.L;
    const map = mapInstance.current;
    if (!L || !map) return;

    // Remove old expense pins
    pinMarkers.current.forEach(m => map.removeLayer(m));
    pinMarkers.current = [];

    expenses.forEach(exp => {
      const baseColor = DECISION_COLORS[exp.decision] || PIN_COLORS[exp.pin] || '#64748b';
      const alpha = exp.decision === 'pending' ? 1 : 0.55;
      const innerLabel = DECISION_ICONS[exp.decision] || String(exp.seq);

      const icon = L.divIcon({
        className: '', iconSize: [36, 48], iconAnchor: [18, 48],
        html: `<div style="width:36px;height:48px;display:flex;flex-direction:column;align-items:center;cursor:pointer;transition:transform 0.18s cubic-bezier(.34,1.56,.64,1);transform-origin:center bottom;opacity:${alpha};">
          <div style="width:36px;height:36px;border-radius:50%;background:${baseColor};border:3px solid #fff;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;color:#fff;box-shadow:0 5px 16px ${baseColor}88;">${innerLabel}</div>
          <div style="width:0;height:0;border-left:7px solid transparent;border-right:7px solid transparent;border-top:12px solid ${baseColor};"></div>
        </div>`,
      });

      const marker = L.marker(exp.coords, { icon });
      marker._expId = exp.id;
      marker.on('click', () => setSelected(exp));
      marker.addTo(map);
      pinMarkers.current.push(marker);
    });
  }, []);

  useEffect(() => { refreshPins(jny.expenses); }, [jny.expenses, refreshPins]);

  /* ── Decision helpers ───────────────────────────────────────── */
  const applyDecision = (expId, decision, remarks = '') => {
    setJny(prev => {
      const next = { ...prev, expenses: prev.expenses.map(e => e.id === expId ? { ...e, decision, remarks } : e) };
      return next;
    });
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
    setJny(prev => ({
      ...prev,
      expenses: prev.expenses.map(e => (e.pin === 'valid' && e.decision === 'pending') ? { ...e, decision: 'approved', remarks: '' } : e),
    }));
    setSelected(null);
    show(`✓ ${validPending.length} valid expense(s) approved!`, 'success');
  };

  const selectedFull = selected ? jny.expenses.find(e => e.id === selected.id) : null;

  return (
    <AppShell title="Journey Review">
      <style>{`
        .tp-pin:hover { transform: scale(1.4) translateY(-5px) !important; filter: drop-shadow(0 8px 18px rgba(0,0,0,0.32)); }
        .claim-item { display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:8px;cursor:pointer;transition:background 0.15s;border-bottom:1px solid var(--border); }
        .claim-item:hover { background:var(--border); }
        .claim-item.active { background:rgba(0,212,170,0.08);border-left:3px solid var(--accent); }
        .decision-dot { width:8px;height:8px;border-radius:50%;flex-shrink:0; }
      `}</style>

      {/* Employee header */}
      <div className="card" style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
        <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg,#00d4aa,#0096ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 800, color: '#fff', flexShrink: 0 }}>RS</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 700 }}>{jny.employee.name}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>ID: {jny.employee.id} · Grade {jny.employee.grade} · {jny.employee.vehicle} · {jny.employee.city}</div>
        </div>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          {[
            { icon: 'ri-calendar-line', val: jny.date },
            { icon: 'ri-time-line',     val: `${jny.startTime} – ${jny.endTime}` },
            { icon: 'ri-route-line',    val: Fmt.km(jny.totalKm) },
            { icon: 'ri-map-pin-line',  val: `${jny.stops} Stops` },
          ].map(m => (
            <div key={m.icon} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 18, color: 'var(--accent)' }}><i className={m.icon}></i></div>
              <div style={{ fontSize: 12, fontWeight: 600 }}>{m.val}</div>
            </div>
          ))}
        </div>
        {/* Approval stats */}
        <div style={{ display: 'flex', gap: 16, flexShrink: 0 }}>
          {[
            { label: 'Total', val: stats.total,    color: 'var(--text)' },
            { label: 'Approved', val: stats.approved, color: 'var(--green)' },
            { label: 'Pending',  val: stats.pending,  color: 'var(--amber)' },
            { label: 'Rejected', val: stats.rejected, color: 'var(--red)' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center', padding: '8px 12px', background: 'var(--bg)', borderRadius: 8, border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.val}</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
            </div>
          ))}
        </div>
        <button className="btn btn-primary btn-sm" onClick={approveAll}><i className="ri-check-double-line"></i> Approve All Valid</button>
      </div>

      {/* Main split: map + claim list */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, position: 'relative' }}>

        {/* Map */}
        <div style={{ position: 'relative' }}>
          <div ref={mapRef} style={{ height: 520, borderRadius: 'var(--radius)', overflow: 'hidden', border: '1px solid var(--border)' }}></div>

          {/* Detail panel overlays the map */}
          {selectedFull && (
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              background: 'var(--card)', borderTop: '2px solid var(--accent)',
              padding: '16px 20px', zIndex: 1500,
              boxShadow: '0 -4px 24px rgba(0,0,0,0.45)',
              borderBottomLeftRadius: 'var(--radius)', borderBottomRightRadius: 'var(--radius)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10, flexWrap: 'wrap' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${CAT_META[selectedFull.category]?.color || '#64748b'}20`, color: CAT_META[selectedFull.category]?.color || '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                  <i className={CAT_META[selectedFull.category]?.icon || 'ri-receipt-line'}></i>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{selectedFull.category}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{selectedFull.time} · {selectedFull.receipt ? '📄 Receipt attached' : '⚠ No receipt'}</div>
                </div>
                <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--accent)' }}>{Fmt.currency(selectedFull.amount)}</div>
                <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 18, cursor: 'pointer' }}><i className="ri-close-line"></i></button>
              </div>

              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12, padding: '8px 12px', background: 'var(--bg)', borderRadius: 8, borderLeft: `3px solid ${PIN_COLORS[selectedFull.pin] || '#64748b'}` }}>
                <i className="ri-map-pin-line" style={{ marginRight: 6 }}></i>{selectedFull.note}
              </div>

              {selectedFull.decision === 'pending' ? (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <button className="btn btn-primary btn-sm" onClick={approveSelected}><i className="ri-check-line"></i> Approve</button>
                  <button className="btn btn-danger btn-sm" onClick={rejectSelected}><i className="ri-close-line"></i> Reject</button>
                  <button className="btn btn-ghost btn-sm" style={{ color: 'var(--amber)', borderColor: 'var(--amber)' }} onClick={flagSelected}><i className="ri-flag-line"></i> Flag</button>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className={`badge ${selectedFull.decision === 'approved' ? 'badge-green' : selectedFull.decision === 'rejected' ? 'badge-red' : 'badge-amber'}`}>
                    {selectedFull.decision.charAt(0).toUpperCase() + selectedFull.decision.slice(1)}
                  </span>
                  {selectedFull.remarks && <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>— {selectedFull.remarks}</span>}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Claim list */}
        <div className="card" style={{ padding: 0, overflow: 'hidden', maxHeight: 520, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontWeight: 600 }}>Expense Claims</div>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{jny.expenses.length} total</span>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {jny.expenses.map(exp => {
              const catM = CAT_META[exp.category] || {};
              const isActive = selectedFull?.id === exp.id;
              const decisionColor = DECISION_COLORS[exp.decision] || PIN_COLORS[exp.pin] || '#64748b';
              return (
                <div
                  key={exp.id}
                  className={`claim-item${isActive ? ' active' : ''}`}
                  onClick={() => setSelected(exp)}
                  style={{ borderLeft: isActive ? `3px solid var(--accent)` : '3px solid transparent' }}
                >
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: `${catM.color || '#64748b'}20`, color: catM.color || '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>
                    <i className={catM.icon || 'ri-receipt-line'}></i>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{exp.category}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{exp.time}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent)' }}>{Fmt.currency(exp.amount)}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
                      <div className="decision-dot" style={{ background: decisionColor }}></div>
                      <span style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'capitalize' }}>{exp.decision}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', fontSize: 13, fontWeight: 700, display: 'flex', justifyContent: 'space-between' }}>
            <span>Total</span>
            <span style={{ color: 'var(--accent)' }}>{Fmt.currency(jny.expenses.reduce((s, e) => s + e.amount, 0))}</span>
          </div>
        </div>
      </div>

      {/* Remarks modal */}
      {remarksModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000 }}>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 28, width: 440, maxWidth: '90vw', boxShadow: '0 16px 48px rgba(0,0,0,0.5)' }}>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>
              {remarksModal.action === 'reject' ? '✕ Reject Expense' : '⚑ Flag Expense'}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>Please provide a reason for this decision.</div>
            <textarea
              className="form-control"
              rows={3}
              placeholder="Enter remarks…"
              value={remarksText}
              onChange={e => setRemarksText(e.target.value)}
              style={{ resize: 'vertical' }}
              autoFocus
            />
            <div style={{ display: 'flex', gap: 8, marginTop: 16, justifyContent: 'flex-end' }}>
              <button className="btn btn-ghost btn-sm" onClick={() => setRemarksModal(null)}>Cancel</button>
              <button
                className={`btn btn-sm ${remarksModal.action === 'reject' ? 'btn-danger' : ''}`}
                style={remarksModal.action !== 'reject' ? { background: 'rgba(245,158,11,0.15)', color: 'var(--amber)', border: '1px solid var(--amber)' } : {}}
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
