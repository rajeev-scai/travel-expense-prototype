import React, { useState } from 'react';
import AppShell from '../../components/layout/AppShell.jsx';
import { useToast } from '../../contexts/ToastContext.jsx';

const TABS = ['Vehicle Allocation', 'Allowance Rates', 'Auto-Approve Rules', 'Geo-Fence Settings'];

// Tab 1: Vehicle Allocation data
const initVehicleData = [
  { grade: 'G1', label: 'Junior Executive', can2W: true,  can4W: false, canTaxi: false },
  { grade: 'G2', label: 'Executive',        can2W: true,  can4W: false, canTaxi: false },
  { grade: 'G3', label: 'Senior Executive', can2W: true,  can4W: true,  canTaxi: false },
  { grade: 'G4', label: 'Area Manager',     can2W: false, can4W: true,  canTaxi: true  },
  { grade: 'G5', label: 'Regional Manager', can2W: false, can4W: true,  canTaxi: true  },
];

// Tab 2: Allowance Rates data
const initAllowanceData = [
  { grade: 'G1', role: 'Junior Executive',  da: [250, 180, 120], ta: [3.0, 2.5, 2.0], meal: 200,  halt: 700  },
  { grade: 'G2', role: 'Executive',         da: [380, 280, 190], ta: [4.0, 3.0, 2.5], meal: 300,  halt: 1000 },
  { grade: 'G3', role: 'Senior Executive',  da: [550, 420, 300], ta: [5.0, 4.0, 3.5], meal: 450,  halt: 1500 },
  { grade: 'G4', role: 'Area Manager',      da: [800, 620, 450], ta: [7.0, 6.0, 5.0], meal: 700,  halt: 2500 },
  { grade: 'G5', role: 'Regional Manager',  da: [1200,950, 750], ta: [10.0,8.0, 7.0], meal: 1000, halt: 4000 },
];

// Tab 3: Auto-Approve Rules
const autoApproveRules = [
  { id: 1, cat: 'Daily Allowance (DA)',   icon: 'ri-calendar-check-line', col: '#3b82f6', auto: true,  desc: 'Auto-approve full DA for the day if morning attendance is marked "Present" and at least one customer activity is logged.', condition: 'Attendance = Present + 1 Activity', threshold: '100% DA (grade-wise)' },
  { id: 2, cat: 'Half-Day DA',            icon: 'ri-time-line',           col: '#3b82f6', auto: true,  desc: 'Auto-approve 50% DA if attendance is marked half-day or if only a morning session with < 3 activities is recorded.', condition: 'Half-day attendance or < 3 activities', threshold: '50% DA (grade-wise)' },
  { id: 3, cat: 'Food / Meals',           icon: 'ri-restaurant-line',     col: '#f59e0b', auto: true,  desc: 'Auto-approve meal expense if location pin is within 500m of a logged customer activity and amount is within the grade meal limit.', condition: 'Pin ≤ 500m of activity + ≤ meal limit', threshold: 'Grade-wise meal cap' },
  { id: 4, cat: 'Night Halt',             icon: 'ri-moon-line',           col: '#8b5cf6', auto: true,  desc: 'Auto-approve night halt allowance if midnight GPS ping confirms location is 100+ km from employee home base and a next-day activity exists in the destination city.', condition: 'Midnight GPS > 100km + next-day activity', threshold: 'Grade-wise NH cap' },
  { id: 5, cat: 'Fuel Reimbursement',     icon: 'ri-gas-station-line',    col: '#00d4aa', auto: true,  desc: 'Auto-approve fuel bill if quantity × vehicle mileage ≈ GPS distance traveled for the day. Bill OCR must match pump name and amount.', condition: 'Fuel qty × mileage ≈ GPS km (±8%)', threshold: 'Grade/vehicle fuel rate' },
  { id: 6, cat: 'Toll / Highway',         icon: 'ri-road-line',           col: '#00d4aa', auto: true,  desc: 'Auto-approve toll if expense is tagged to an active outstation route and a valid FASTag or photo receipt is submitted via OCR.', condition: 'On recorded route + receipt OCR valid', threshold: 'Actuals (no cap)' },
  { id: 7, cat: 'Parking',                icon: 'ri-parking-box-line',    col: '#f59e0b', auto: true,  desc: 'Auto-approve parking charges when submitted with a valid receipt and GPS confirms the vehicle was stationary at a commercial or hospital location.', condition: 'Receipt + GPS stationary at activity', threshold: '≤ ₹200/day' },
  { id: 8, cat: 'Local Conveyance',       icon: 'ri-taxi-line',           col: '#6b7280', auto: true,  desc: 'Auto-approve auto/cab claims within the base city if distance is < 30km and a ride receipt (Ola/Uber) is attached via OCR.', condition: 'Within city + ride receipt OCR', threshold: '≤ ₹400/day' },
  { id: 9, cat: 'BYOD Internet',          icon: 'ri-wifi-line',           col: '#3b82f6', auto: true,  desc: 'Auto-approve monthly BYOD data allowance once per calendar month per employee based on grade-wise flat rate.', condition: 'Monthly flat (1× per month)', threshold: '₹300–₹700/month (grade)' },
  { id: 10, cat: 'Client Entertainment',  icon: 'ri-group-2-line',        col: '#f59e0b', auto: false, desc: 'Always requires manual manager approval. Must include client name, company, number of attendees, and business purpose.', condition: 'Manager approval required', threshold: '≤ ₹2,500/event' },
  { id: 11, cat: 'Conference / Training', icon: 'ri-presentation-line',   col: '#8b5cf6', auto: false, desc: 'Manual approval by HR + Finance required. Advance booking only. Includes registration fees, travel, accommodation.', condition: 'HR + Finance pre-approval', threshold: 'As per sanction letter' },
];

// Tab 4: Geo-Fence fraud rules (always-on)
const fraudRulesData = [
  { label: 'Flag if Expense Pin is outside the configured activity proof radius (default 500m)', enabled: true },
  { label: 'Auto-reject if GPS breadcrumb path never passed through the expense pin location', enabled: true },
  { label: 'Flag duplicate submissions — same vendor name + date + amount by same employee', enabled: true },
  { label: 'Alert if total daily expense claim exceeds 200% of grade-wise daily limit', enabled: true },
  { label: 'Flag if bill timestamp and GPS timestamp differ by more than 2 hours', enabled: true },
  { label: 'Hold if 3 or more expense claims are submitted for the same date on separate days (backdating pattern)', enabled: true },
  { label: 'Flag if Night Halt claimed but midnight GPS shows employee within 50km of home base', enabled: true },
  { label: 'Alert if fuel bill quantity exceeds vehicle tank capacity (suspected inflated bill)', enabled: true },
  { label: 'Flag if same fuel pump billed more than twice in a single week', enabled: false },
];

function Toggle({ on, onChange }) {
  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
      <div style={{ position: 'relative', width: 44, height: 24, flexShrink: 0 }}>
        <input type="checkbox" checked={on} onChange={onChange} style={{ opacity: 0, position: 'absolute', width: '100%', height: '100%', zIndex: 1, cursor: 'pointer' }} />
        <div style={{ position: 'absolute', inset: 0, borderRadius: 12, background: on ? 'var(--accent)' : 'var(--border)', transition: '0.2s' }}>
          <div style={{ position: 'absolute', width: 18, height: 18, borderRadius: '50%', background: 'white', top: 3, left: on ? 23 : 3, transition: '0.2s' }}></div>
        </div>
      </div>
    </label>
  );
}

function VehiclePill({ on, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: '5px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: 'none', transition: 'all 0.15s',
      background: on ? 'var(--accent)' : 'transparent',
      color: on ? '#0a1628' : 'var(--text-muted)',
      boxShadow: on ? 'none' : 'inset 0 0 0 1.5px var(--border)',
    }}>
      {on ? <><i className="ri-check-line" style={{ marginRight: 4 }}></i>Allowed</> : 'Not Allowed'}
    </button>
  );
}

export default function RulesPage() {
  const { show } = useToast();
  const [activeTab, setActiveTab] = useState(0);

  // Tab 1 state
  const [vehicleData, setVehicleData] = useState(initVehicleData);

  // Tab 2 state
  const [allowanceData, setAllowanceData] = useState(initAllowanceData);
  const updateAllowance = (idx, field, subIdx, val) => {
    setAllowanceData(prev => prev.map((row, i) => {
      if (i !== idx) return row;
      if (subIdx !== undefined) {
        const arr = [...row[field]];
        arr[subIdx] = parseFloat(val) || 0;
        return { ...row, [field]: arr };
      }
      return { ...row, [field]: parseFloat(val) || 0 };
    }));
  };

  // Tab 3 state
  const [autoToggles, setAutoToggles] = useState(() => Object.fromEntries(autoApproveRules.map(r => [r.id, r.auto])));

  // Tab 4 state
  const [fraudRules, setFraudRules] = useState(fraudRulesData);
  const [geoRadius, setGeoRadius] = useState(500);
  const [haltRadius, setHaltRadius] = useState(100);

  const rateInput = {
    background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 6,
    padding: '4px 6px', color: 'var(--text)', fontSize: 12, width: 68, textAlign: 'center',
  };

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

      {/* Tab 1: Vehicle Allocation */}
      {activeTab === 0 && (
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Grade → Vehicle Allocation</div>
              <div className="card-subtitle">Define which vehicle types each grade is eligible to use. Click a pill to toggle.</div>
            </div>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Grade</th><th>Role</th><th>2-Wheeler</th><th>4-Wheeler</th><th>Taxi/Cab</th>
                </tr>
              </thead>
              <tbody>
                {vehicleData.map((v, idx) => (
                  <tr key={v.grade}>
                    <td><span className="badge badge-blue">{v.grade}</span></td>
                    <td style={{ fontSize: 13 }}>{v.label}</td>
                    <td><VehiclePill on={v.can2W} onClick={() => setVehicleData(prev => prev.map((r, i) => i === idx ? { ...r, can2W: !r.can2W } : r))} /></td>
                    <td><VehiclePill on={v.can4W} onClick={() => setVehicleData(prev => prev.map((r, i) => i === idx ? { ...r, can4W: !r.can4W } : r))} /></td>
                    <td><VehiclePill on={v.canTaxi} onClick={() => setVehicleData(prev => prev.map((r, i) => i === idx ? { ...r, canTaxi: !r.canTaxi } : r))} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Allowance Rates */}
      {activeTab === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Daily Allowance (DA) &amp; Travel Allowance (TA) Matrix</div>
                <div className="card-subtitle">Rates applied per grade and city tier. Edit inline and save.</div>
              </div>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Grade</th><th>Role</th>
                    <th>DA Tier 1<br /><small style={{ color: 'var(--text-muted)', fontWeight: 400 }}>₹/day</small></th>
                    <th>DA Tier 2<br /><small>₹/day</small></th>
                    <th>DA Tier 3<br /><small>₹/day</small></th>
                    <th>TA Tier 1<br /><small>₹/km</small></th>
                    <th>TA Tier 2<br /><small>₹/km</small></th>
                    <th>TA Tier 3<br /><small>₹/km</small></th>
                    <th>Meal Limit<br /><small>₹/day</small></th>
                    <th>Night Halt<br /><small>₹/night</small></th>
                  </tr>
                </thead>
                <tbody>
                  {allowanceData.map((a, idx) => (
                    <tr key={a.grade}>
                      <td><span className="badge badge-blue">{a.grade}</span></td>
                      <td style={{ fontSize: 12 }}>{a.role}</td>
                      <td><input style={rateInput} type="number" value={a.da[0]} onChange={e => updateAllowance(idx, 'da', 0, e.target.value)} /></td>
                      <td><input style={rateInput} type="number" value={a.da[1]} onChange={e => updateAllowance(idx, 'da', 1, e.target.value)} /></td>
                      <td><input style={rateInput} type="number" value={a.da[2]} onChange={e => updateAllowance(idx, 'da', 2, e.target.value)} /></td>
                      <td><input style={rateInput} type="number" value={a.ta[0]} onChange={e => updateAllowance(idx, 'ta', 0, e.target.value)} /></td>
                      <td><input style={rateInput} type="number" value={a.ta[1]} onChange={e => updateAllowance(idx, 'ta', 1, e.target.value)} /></td>
                      <td><input style={rateInput} type="number" value={a.ta[2]} onChange={e => updateAllowance(idx, 'ta', 2, e.target.value)} /></td>
                      <td><input style={rateInput} type="number" value={a.meal} onChange={e => updateAllowance(idx, 'meal', undefined, e.target.value)} /></td>
                      <td><input style={rateInput} type="number" value={a.halt} onChange={e => updateAllowance(idx, 'halt', undefined, e.target.value)} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: 10, padding: '10px 14px', background: 'var(--bg)', borderRadius: 8, fontSize: 12, color: 'var(--text-muted)' }}>
              <i className="ri-information-line" style={{ marginRight: 4 }}></i>
              Tier 1 = Metro cities (Mumbai, Delhi, Bengaluru, Chennai, Hyderabad, Pune, Kolkata) · Tier 2 = Tier-2 cities · Tier 3 = Small towns &amp; rural
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Auto-Approve Rules */}
      {activeTab === 2 && (
        <div className="card">
          <div className="card-header">
            <div className="card-title"><i className="ri-robot-line" style={{ color: 'var(--accent)', marginRight: 6 }}></i>Auto-Approve Rules</div>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{Object.values(autoToggles).filter(Boolean).length} of {autoApproveRules.length} enabled</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {autoApproveRules.map((r, i) => {
              const on = autoToggles[r.id];
              return (
                <div key={r.id} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 16, padding: '16px 0',
                  borderBottom: i < autoApproveRules.length - 1 ? '1px solid var(--border)' : 'none',
                  opacity: on ? 1 : 0.55,
                }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: `${r.col}20`, color: r.col, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <i className={r.icon}></i>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontWeight: 700, fontSize: 14 }}>{r.cat}</span>
                      <span className={`badge ${on ? 'badge-green' : 'badge-red'}`} style={{ fontSize: 10 }}>
                        {on ? 'Auto-Approve' : 'Manual'}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>{r.desc}</div>
                    <div style={{ display: 'flex', gap: 16, fontSize: 11, color: 'var(--text-muted)' }}>
                      <span><i className="ri-git-branch-line" style={{ marginRight: 4 }}></i>{r.condition}</span>
                      <span><i className="ri-money-rupee-circle-line" style={{ marginRight: 4 }}></i>{r.threshold}</span>
                    </div>
                  </div>
                  <Toggle on={!!on} onChange={() => setAutoToggles(prev => ({ ...prev, [r.id]: !prev[r.id] }))} />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 4: Geo-Fence Settings */}
      {activeTab === 3 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Anti-fraud rules */}
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title"><i className="ri-shield-flash-line" style={{ color: 'var(--accent)', marginRight: 6 }}></i>Anti-Fraud Rules</div>
                <div className="card-subtitle">System-level rules that protect against expense fraud. Always-on rules cannot be disabled.</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {fraudRules.map((fr, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 0', borderBottom: i < fraudRules.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: 13 }}>{fr.label}</span>
                    {fr.enabled && i < 8 && <span className="badge badge-green" style={{ marginLeft: 8, fontSize: 10 }}>Always On</span>}
                  </div>
                  {i >= 8
                    ? <Toggle on={fr.enabled} onChange={() => setFraudRules(prev => prev.map((r, j) => j === i ? { ...r, enabled: !r.enabled } : r))} />
                    : <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>LOCKED</span>
                  }
                </div>
              ))}
            </div>
          </div>

          {/* Geo radius settings */}
          <div className="card">
            <div className="card-header">
              <div className="card-title"><i className="ri-map-pin-range-line" style={{ color: 'var(--accent)', marginRight: 6 }}></i>Geo-Fence Radius Settings</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="form-group">
                <label className="form-label">Activity Proof Radius</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <input type="range" min={100} max={2000} value={geoRadius} onChange={e => setGeoRadius(Number(e.target.value))} style={{ flex: 1 }} />
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent)', minWidth: 60 }}>{geoRadius} m</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>If Expense Pin is within this radius of an Activity Pin, proof is considered valid.</div>
              </div>
              <div className="form-group">
                <label className="form-label">Night Halt Verification Distance</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <input type="range" min={50} max={500} value={haltRadius} onChange={e => setHaltRadius(Number(e.target.value))} style={{ flex: 1 }} />
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent)', minWidth: 60 }}>{haltRadius} km</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>Minimum distance from home base required to claim night halt allowance.</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
