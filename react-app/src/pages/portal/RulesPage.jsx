import React, { useState } from 'react';
import AppShell from '../../components/layout/AppShell.jsx';
import { useToast } from '../../contexts/ToastContext.jsx';
import { grades } from '../../utils/sampleData.js';

const TABS = ['TA Rules', 'Meal Limits', 'Night Halt', 'Geo-Fence', 'Auto-Approve', 'Grade Matrix'];

const taRules = [
  { id: 1, name: 'Two-Wheeler TA Rate', grade: 'G1–G2', rate: '₹2.50–₹3.00/km', vehicle: '2W', status: 'active', gpsRequired: true },
  { id: 2, name: 'Four-Wheeler TA Rate', grade: 'G3–G4', rate: '₹4.00–₹6.00/km', vehicle: '4W', status: 'active', gpsRequired: true },
  { id: 3, name: 'Senior Manager TA', grade: 'G5', rate: '₹8.00/km', vehicle: '4W', status: 'active', gpsRequired: true },
  { id: 4, name: 'Taxi Reimbursement', grade: 'G4+', rate: 'Actual (cap ₹2000/trip)', vehicle: 'Taxi', status: 'active', gpsRequired: false },
];

const mealLimits = [
  { grade: 'G1', tier1: 150, tier2: 120, night: false },
  { grade: 'G2', tier1: 200, tier2: 160, night: true  },
  { grade: 'G3', tier1: 300, tier2: 250, night: true  },
  { grade: 'G4', tier1: 500, tier2: 400, night: true  },
  { grade: 'G5', tier1: 700, tier2: 600, night: true  },
];

const geoRules = [
  { id: 1, name: 'Activity Geo-fence Radius', value: '500m', desc: 'Max distance bill location can be from a GPS activity pin', status: 'active' },
  { id: 2, name: 'Amber Flag Radius',          value: '2km',  desc: 'Flag for manual review if bill is 500m–2km from activity', status: 'active' },
  { id: 3, name: 'Red Flag / Auto-Reject',     value: '>5km', desc: 'Auto-reject if bill is more than 5km from any activity',    status: 'active' },
  { id: 4, name: 'Home-base Exclusion Zone',   value: '1km',  desc: 'Expenses submitted within 1km of home are rejected',       status: 'active' },
];

const autoRules = [
  { id: 1, rule: 'GPS-verified TA within grade rate', action: 'Auto-Approve',   confidence: 98 },
  { id: 2, rule: 'Meal bill within grade limit + valid pin', action: 'Auto-Approve', confidence: 94 },
  { id: 3, rule: 'Toll with FASTag record on route', action: 'Auto-Approve', confidence: 99 },
  { id: 4, rule: 'Bill >1.5x grade limit',           action: 'Flag for Review', confidence: 88 },
  { id: 5, rule: 'Bill location >2km from activity', action: 'Amber Flag',    confidence: 91 },
  { id: 6, rule: 'No GPS activity in 4hr window',    action: 'Manual Review', confidence: 85 },
];

const tierMatrix = [
  { city: 'Mumbai', tier: 1 }, { city: 'Delhi NCR', tier: 1 }, { city: 'Bangalore', tier: 1 },
  { city: 'Hyderabad', tier: 1 }, { city: 'Chennai', tier: 1 }, { city: 'Pune', tier: 2 },
  { city: 'Ahmedabad', tier: 2 }, { city: 'Kolkata', tier: 1 }, { city: 'Jaipur', tier: 2 },
  { city: 'Surat', tier: 2 },
];

const confidenceColor = (v) => v >= 95 ? '#00d4aa' : v >= 85 ? '#f59e0b' : '#ef4444';

export default function RulesPage() {
  const { show } = useToast();
  const [activeTab, setActiveTab] = useState(0);
  const [toggles, setToggles] = useState({});

  const toggle = (key, defaultVal = true) => {
    setToggles(prev => ({ ...prev, [key]: !(prev[key] ?? defaultVal) }));
  };
  const isOn = (key, defaultVal = true) => toggles[key] ?? defaultVal;

  return (
    <AppShell title="Rule Engine" actions={
      <button className="btn btn-primary btn-sm" onClick={() => show('Rules saved!', 'success')}>
        <i className="ri-save-line"></i> Save Changes
      </button>
    }>
      {/* Stats */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginBottom: 24 }}>
        {[
          { icon: 'ri-robot-line',     cls: 'teal',  label: 'Auto-Approval Rate',  val: '71%' },
          { icon: 'ri-shield-line',    cls: 'blue',  label: 'Rules Active',        val: '24' },
          { icon: 'ri-flag-line',      cls: 'amber', label: 'Flagged This Week',   val: '8' },
          { icon: 'ri-money-rupee-circle-line', cls: 'teal', label: 'Saved via Rules', val: '₹18K' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className={`stat-icon ${s.cls}`}><i className={s.icon}></i></div>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.val}</div>
          </div>
        ))}
      </div>

      {/* Tab bar */}
      <div className="tabs" style={{ marginBottom: 20 }}>
        {TABS.map((t, i) => (
          <button key={t} className={`tab-btn${activeTab === i ? ' active' : ''}`} onClick={() => setActiveTab(i)}>{t}</button>
        ))}
      </div>

      {/* Tab: TA Rules */}
      {activeTab === 0 && (
        <div className="card">
          <div className="card-header">
            <div className="card-title"><i className="ri-car-line" style={{ color: 'var(--accent)', marginRight: 6 }}></i>Travel Allowance (TA) Rules</div>
            <button className="btn btn-outline btn-sm" onClick={() => show('New TA rule added', 'success')}><i className="ri-add-line"></i> Add Rule</button>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Rule Name</th><th>Applicable Grade</th><th>Rate / Cap</th><th>Vehicle</th><th>GPS Required</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {taRules.map(r => (
                  <tr key={r.id}>
                    <td><strong>{r.name}</strong></td>
                    <td><span className="badge badge-blue">{r.grade}</span></td>
                    <td style={{ fontFamily: 'monospace', color: 'var(--accent)' }}>{r.rate}</td>
                    <td><i className={r.vehicle === '4W' ? 'ri-car-line' : r.vehicle === 'Taxi' ? 'ri-taxi-line' : 'ri-motorbike-line'} style={{ color: 'var(--accent)', marginRight: 4 }}></i>{r.vehicle}</td>
                    <td>
                      <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                        <div style={{ position: 'relative', width: 44, height: 24, flexShrink: 0 }}>
                          <input type="checkbox" checked={isOn(`ta-gps-${r.id}`, r.gpsRequired)} onChange={() => toggle(`ta-gps-${r.id}`, r.gpsRequired)} style={{ opacity: 0, position: 'absolute', width: '100%', height: '100%', zIndex: 1, cursor: 'pointer' }} />
                          <div style={{ position: 'absolute', inset: 0, borderRadius: 12, background: isOn(`ta-gps-${r.id}`, r.gpsRequired) ? 'var(--accent)' : 'var(--surface)', transition: '0.2s' }}>
                            <div style={{ position: 'absolute', width: 18, height: 18, borderRadius: '50%', background: 'white', top: 3, left: isOn(`ta-gps-${r.id}`, r.gpsRequired) ? 23 : 3, transition: '0.2s' }}></div>
                          </div>
                        </div>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{isOn(`ta-gps-${r.id}`, r.gpsRequired) ? 'Yes' : 'No'}</span>
                      </label>
                    </td>
                    <td><span className="badge badge-green">Active</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => show('Edit rule', 'info')}><i className="ri-edit-line"></i></button>
                        <button className="btn btn-danger btn-sm" onClick={() => show('Rule deleted', 'error')}><i className="ri-delete-bin-line"></i></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Meal Limits */}
      {activeTab === 1 && (
        <div className="card">
          <div className="card-header">
            <div className="card-title"><i className="ri-restaurant-line" style={{ color: 'var(--accent)', marginRight: 6 }}></i>Meal Limits by Grade & City Tier</div>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Grade</th><th>Tier-1 City</th><th>Tier-2 City</th><th>Night Halt Allowed</th></tr></thead>
              <tbody>
                {mealLimits.map(m => (
                  <tr key={m.grade}>
                    <td><span className="badge badge-blue">{m.grade}</span></td>
                    <td><strong style={{ color: 'var(--accent)' }}>₹{m.tier1}</strong></td>
                    <td><strong style={{ color: 'var(--accent)' }}>₹{m.tier2}</strong></td>
                    <td><span className={`badge ${m.night ? 'badge-green' : 'badge-gray'}`}>{m.night ? 'Yes' : 'No'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Night Halt */}
      {activeTab === 2 && (
        <div className="card">
          <div className="card-header">
            <div className="card-title"><i className="ri-hotel-line" style={{ color: 'var(--accent)', marginRight: 6 }}></i>Night Halt Allowance Rules</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 4 }}>
            {[
              { grade: 'G1–G2', city: 'Tier-2 only', actual: '₹800', da: '₹150', note: 'Hotel bill required' },
              { grade: 'G3',    city: 'Tier-1 & 2',  actual: '₹1200', da: '₹200', note: 'Hotel bill + GPS check-in' },
              { grade: 'G4',    city: 'All cities',  actual: '₹1800', da: '₹300', note: 'Hotel bill + GPS check-in' },
              { grade: 'G5',    city: 'All cities',  actual: '₹2500', da: '₹400', note: 'Actuals up to limit' },
            ].map(r => (
              <div key={r.grade} className="card" style={{ borderLeft: '3px solid var(--accent)', padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span className="badge badge-blue">{r.grade}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{r.city}</span>
                </div>
                <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--accent)', marginBottom: 4 }}>{r.actual}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Hotel cap per night</div>
                <div style={{ fontSize: 12 }}>DA: <strong style={{ color: 'var(--text)' }}>{r.da}</strong></div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>{r.note}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Geo-Fence */}
      {activeTab === 3 && (
        <div className="card">
          <div className="card-header">
            <div className="card-title"><i className="ri-map-pin-range-line" style={{ color: 'var(--accent)', marginRight: 6 }}></i>Geo-Fence & Anti-Fraud Rules</div>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Rule</th><th>Threshold</th><th>Description</th><th>Status</th><th>Toggle</th></tr></thead>
              <tbody>
                {geoRules.map(r => (
                  <tr key={r.id}>
                    <td><strong>{r.name}</strong></td>
                    <td><span style={{ fontFamily: 'monospace', background: 'var(--accent-glow)', color: 'var(--accent)', padding: '2px 8px', borderRadius: 4, fontSize: 12 }}>{r.value}</span></td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)', maxWidth: 240 }}>{r.desc}</td>
                    <td><span className="badge badge-green">Active</span></td>
                    <td>
                      <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                        <div style={{ position: 'relative', width: 44, height: 24 }}>
                          <input type="checkbox" checked={isOn(`geo-${r.id}`)} onChange={() => toggle(`geo-${r.id}`)} style={{ opacity: 0, position: 'absolute', width: '100%', height: '100%', zIndex: 1, cursor: 'pointer' }} />
                          <div style={{ position: 'absolute', inset: 0, borderRadius: 12, background: isOn(`geo-${r.id}`) ? 'var(--accent)' : 'var(--surface)', transition: '0.2s' }}>
                            <div style={{ position: 'absolute', width: 18, height: 18, borderRadius: '50%', background: 'white', top: 3, left: isOn(`geo-${r.id}`) ? 23 : 3, transition: '0.2s' }}></div>
                          </div>
                        </div>
                      </label>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Auto-Approve */}
      {activeTab === 4 && (
        <div className="card">
          <div className="card-header">
            <div className="card-title"><i className="ri-robot-line" style={{ color: 'var(--accent)', marginRight: 6 }}></i>Auto-Approval Decision Rules</div>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Rule Condition</th><th>Action</th><th>Confidence</th><th>Enabled</th></tr></thead>
              <tbody>
                {autoRules.map(r => (
                  <tr key={r.id}>
                    <td><strong>{r.rule}</strong></td>
                    <td>
                      <span className={`badge ${r.action === 'Auto-Approve' ? 'badge-green' : r.action === 'Amber Flag' ? 'badge-amber' : 'badge-blue'}`}>
                        {r.action}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ flex: 1, height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden', maxWidth: 100 }}>
                          <div style={{ height: '100%', borderRadius: 3, background: confidenceColor(r.confidence), width: `${r.confidence}%` }}></div>
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 700, color: confidenceColor(r.confidence) }}>{r.confidence}%</span>
                      </div>
                    </td>
                    <td>
                      <label style={{ cursor: 'pointer' }}>
                        <div style={{ position: 'relative', width: 44, height: 24 }}>
                          <input type="checkbox" checked={isOn(`auto-${r.id}`)} onChange={() => toggle(`auto-${r.id}`)} style={{ opacity: 0, position: 'absolute', width: '100%', height: '100%', zIndex: 1, cursor: 'pointer' }} />
                          <div style={{ position: 'absolute', inset: 0, borderRadius: 12, background: isOn(`auto-${r.id}`) ? 'var(--accent)' : 'var(--surface)', transition: '0.2s' }}>
                            <div style={{ position: 'absolute', width: 18, height: 18, borderRadius: '50%', background: 'white', top: 3, left: isOn(`auto-${r.id}`) ? 23 : 3, transition: '0.2s' }}></div>
                          </div>
                        </div>
                      </label>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Grade Matrix */}
      {activeTab === 5 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div className="card">
            <div className="card-header">
              <div className="card-title"><i className="ri-award-line" style={{ color: 'var(--accent)', marginRight: 6 }}></i>Grade Entitlement Matrix</div>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Grade</th><th>Label</th><th>Vehicle</th><th>DA/Day</th><th>TA/km</th><th>Meal Cap</th><th>Tier</th></tr></thead>
                <tbody>
                  {grades.map(g => (
                    <tr key={g.grade}>
                      <td><span className="badge badge-blue">{g.grade}</span></td>
                      <td style={{ fontSize: 12 }}>{g.label}</td>
                      <td>{g.vehicle}</td>
                      <td style={{ color: 'var(--accent)', fontWeight: 700 }}>₹{g.daRate}</td>
                      <td style={{ color: 'var(--accent)', fontWeight: 700 }}>₹{g.taRate}</td>
                      <td style={{ color: 'var(--accent)', fontWeight: 700 }}>₹{g.mealLimit}</td>
                      <td><span className={`badge ${g.tier === 1 ? 'badge-green' : 'badge-gray'}`}>T{g.tier}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-title"><i className="ri-map-2-line" style={{ color: 'var(--accent)', marginRight: 6 }}></i>City Tier Classification</div>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>City</th><th>Tier</th><th>DA Multiplier</th></tr></thead>
                <tbody>
                  {tierMatrix.map(c => (
                    <tr key={c.city}>
                      <td>{c.city}</td>
                      <td><span className={`badge ${c.tier === 1 ? 'badge-blue' : 'badge-gray'}`}>Tier {c.tier}</span></td>
                      <td style={{ color: 'var(--accent)', fontWeight: 700 }}>{c.tier === 1 ? '1.0×' : '0.85×'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
