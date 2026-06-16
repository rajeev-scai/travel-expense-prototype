import React, { useState, useRef } from 'react';
import AppShell from '../../components/layout/AppShell.jsx';
import { useToast } from '../../contexts/ToastContext.jsx';

const TABS = ['Vehicle Allocation', 'Allowance Rates', 'Auto-Approve Rules', 'Geo-Fence Settings'];

const defaultVehicleData = [
  { grade: 'G1', label: 'Junior Executive', can2W: true,  can4W: false, canTaxi: false },
  { grade: 'G2', label: 'Executive',        can2W: true,  can4W: false, canTaxi: false },
  { grade: 'G3', label: 'Senior Executive', can2W: true,  can4W: true,  canTaxi: false },
  { grade: 'G4', label: 'Area Manager',     can2W: false, can4W: true,  canTaxi: true  },
  { grade: 'G5', label: 'Regional Manager', can2W: false, can4W: true,  canTaxi: true  },
];

const defaultAllowanceData = [
  { grade: 'G1', role: 'Junior Executive',  da: [250, 180, 120], ta: [3.0, 2.5, 2.0], meal: 200,  halt: 700  },
  { grade: 'G2', role: 'Executive',         da: [380, 280, 190], ta: [4.0, 3.0, 2.5], meal: 300,  halt: 1000 },
  { grade: 'G3', role: 'Senior Executive',  da: [550, 420, 300], ta: [5.0, 4.0, 3.5], meal: 450,  halt: 1500 },
  { grade: 'G4', role: 'Area Manager',      da: [800, 620, 450], ta: [7.0, 6.0, 5.0], meal: 700,  halt: 2500 },
  { grade: 'G5', role: 'Regional Manager',  da: [1200,950, 750], ta: [10.0,8.0, 7.0], meal: 1000, halt: 4000 },
];

const defaultTierData = [
  { grade: 'G1', role: 'Junior Executive',  tier: '3', ta: 2.0,  da: 120, meal: 120, nh: 600  },
  { grade: 'G2', role: 'Executive',         tier: '2', ta: 2.5,  da: 190, meal: 190, nh: 800  },
  { grade: 'G3', role: 'Senior Executive',  tier: '2', ta: 3.5,  da: 300, meal: 300, nh: 1200 },
  { grade: 'G4', role: 'Area Manager',      tier: '1', ta: 5.0,  da: 450, meal: 450, nh: 2000 },
  { grade: 'G5', role: 'Regional Manager',  tier: '1', ta: 7.0,  da: 750, meal: 750, nh: 3500 },
];

const defaultRouteData = [
  { code: 'RT001', from: 'Mumbai', to: 'Pune',    dist: 148, rows: [{ grade:'G1',role:'Junior Executive',ta:2.0,da:200,nh:600 },{ grade:'G2',role:'Executive',ta:2.5,da:280,nh:800 },{ grade:'G3',role:'Sr Executive',ta:3.5,da:420,nh:1200 },{ grade:'G4',role:'Area Manager',ta:5.0,da:620,nh:2000 },{ grade:'G5',role:'Reg. Manager',ta:7.0,da:950,nh:3500 }] },
  { code: 'RT002', from: 'Delhi', to: 'Agra',     dist: 206, rows: [{ grade:'G1',role:'Junior Executive',ta:2.0,da:200,nh:600 },{ grade:'G2',role:'Executive',ta:2.5,da:280,nh:800 }] },
  { code: 'RT003', from: 'Chennai', to: 'Vellore', dist: 135, rows: [{ grade:'G3',role:'Sr Executive',ta:3.5,da:420,nh:1200 }] },
];

const defaultGlobalRates = {
  taLocal: 3.0, taOutstation: 4.5, taCap: 500,
  daLocal: 150, daOutstation: 300, meal: 250,
  haltA: 1500, haltB: 900, haltC: 500, haltMax: 7,
  applyUnassigned: true, applyNoRoute: false, applyCap: false,
  enabled: false,
};

const defaultByodData = [
  { category: 'BYOD Data Allowance',    desc: 'Monthly flat rate for personal device data plan', grade: 'All', amount: 500, unit: 'month' },
  { category: 'BYOD Voice Allowance',   desc: 'Monthly flat rate for call charges on personal device', grade: 'G4', amount: 300, unit: 'month' },
];

const defaultFuelData = [
  { range: 'G1-G2', tw: 90, fw: 0,   limit: 2000 },
  { range: 'G3',    tw: 90, fw: 100,  limit: 3000 },
  { range: 'G4-G5', tw: 0,  fw: 100,  limit: 5000 },
];

const defaultAutoRules = [
  { id: 1, cat: 'Daily Allowance (DA)',   icon: 'ri-calendar-check-line', col: '#3b82f6', auto: true,  desc: 'Auto-approve full DA for the day if morning attendance is marked "Present" and at least one customer activity is logged.', condition: 'Attendance = Present + 1 Activity', threshold: '100% DA (grade-wise)' },
  { id: 2, cat: 'Half-Day DA',            icon: 'ri-time-line',           col: '#3b82f6', auto: true,  desc: 'Auto-approve 50% DA if attendance is marked half-day or if only a morning session with < 3 activities is recorded.', condition: 'Half-day attendance or < 3 activities', threshold: '50% DA (grade-wise)' },
  { id: 3, cat: 'Food / Meals',           icon: 'ri-restaurant-line',     col: '#f59e0b', auto: true,  desc: 'Auto-approve meal expense if location pin is within 500m of a logged customer activity and amount is within the grade meal limit.', condition: 'Pin ≤ 500m of activity + ≤ meal limit', threshold: 'Grade-wise meal cap' },
  { id: 4, cat: 'Night Halt',             icon: 'ri-moon-line',           col: '#8b5cf6', auto: true,  desc: 'Auto-approve night halt allowance if midnight GPS ping confirms location is 100+ km from employee home base and a next-day activity exists in the destination city.', condition: 'Midnight GPS > 100km + next-day activity', threshold: 'Grade-wise NH cap' },
  { id: 5, cat: 'Fuel Reimbursement',     icon: 'ri-gas-station-line',    col: '#00d4aa', auto: true,  desc: 'Auto-approve fuel bill if quantity × vehicle mileage ≈ GPS distance traveled for the day.', condition: 'Fuel qty × mileage ≈ GPS km (±8%)', threshold: 'Grade/vehicle fuel rate' },
  { id: 6, cat: 'Toll / Highway',         icon: 'ri-road-line',           col: '#00d4aa', auto: true,  desc: 'Auto-approve toll if expense is tagged to an active outstation route and a valid FASTag or photo receipt is submitted.', condition: 'On recorded route + receipt OCR valid', threshold: 'Actuals (no cap)' },
  { id: 7, cat: 'Parking',                icon: 'ri-parking-box-line',    col: '#f59e0b', auto: true,  desc: 'Auto-approve parking charges when submitted with a valid receipt and GPS confirms the vehicle was stationary at a commercial or hospital location.', condition: 'Receipt + GPS stationary at activity', threshold: '≤ ₹200/day' },
  { id: 8, cat: 'Local Conveyance',       icon: 'ri-taxi-line',           col: '#6b7280', auto: true,  desc: 'Auto-approve auto/cab claims within the base city if distance is < 30km and a ride receipt (Ola/Uber) is attached via OCR.', condition: 'Within city + ride receipt OCR', threshold: '≤ ₹400/day' },
  { id: 9, cat: 'BYOD Internet',          icon: 'ri-wifi-line',           col: '#3b82f6', auto: true,  desc: 'Auto-approve monthly BYOD data allowance once per calendar month per employee based on grade-wise flat rate.', condition: 'Monthly flat (1× per month)', threshold: '₹300–₹700/month (grade)' },
  { id: 10, cat: 'Client Entertainment', icon: 'ri-group-2-line',        col: '#f59e0b', auto: false, desc: 'Always requires manual manager approval. Must include client name, company, number of attendees, and business purpose.', condition: 'Manager approval required', threshold: '≤ ₹2,500/event' },
  { id: 11, cat: 'Conference / Training', icon: 'ri-presentation-line',   col: '#8b5cf6', auto: false, desc: 'Manual approval by HR + Finance required. Advance booking only. Includes registration fees, travel, accommodation.', condition: 'HR + Finance pre-approval', threshold: 'As per sanction letter' },
];

const defaultFraudRules = [
  { label: 'Flag if Expense Pin is outside the configured activity proof radius (default 500m)', alwaysOn: true, enabled: true },
  { label: 'Auto-reject if GPS breadcrumb path never passed through the expense pin location', alwaysOn: true, enabled: true },
  { label: 'Flag duplicate submissions — same vendor name + date + amount by same employee', alwaysOn: true, enabled: true },
  { label: 'Alert if total daily expense claim exceeds 200% of grade-wise daily limit', alwaysOn: true, enabled: true },
  { label: 'Flag if bill timestamp and GPS timestamp differ by more than 2 hours', alwaysOn: true, enabled: true },
  { label: 'Hold if 3 or more expense claims are submitted for the same date on separate days (backdating pattern)', alwaysOn: true, enabled: true },
  { label: 'Flag if Night Halt claimed but midnight GPS shows employee within 50km of home base', alwaysOn: true, enabled: true },
  { label: 'Alert if fuel bill quantity exceeds vehicle tank capacity (suspected inflated bill)', alwaysOn: true, enabled: true },
  { label: 'Flag if same fuel pump billed more than twice in a single week', alwaysOn: false, enabled: false },
];

// ── Small reusable components ──────────────────────────────────────────────

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

function AutoTogglePill({ on, onChange }) {
  return (
    <div onClick={onChange} style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', userSelect: 'none' }}>
      <div style={{
        width: 84, height: 34, borderRadius: 17, display: 'flex', alignItems: 'center',
        padding: 3, transition: 'all 0.25s', position: 'relative',
        background: on ? 'rgba(0,212,170,0.18)' : 'rgba(239,68,68,0.12)',
        border: `2px solid ${on ? 'var(--accent)' : 'var(--red, #ef4444)'}`,
      }}>
        {on && <span style={{ position: 'absolute', left: 10, fontSize: 11, fontWeight: 800, color: 'var(--accent)', letterSpacing: '.6px' }}>AUTO</span>}
        {!on && <span style={{ position: 'absolute', right: 9, fontSize: 11, fontWeight: 800, color: 'var(--red, #ef4444)', letterSpacing: '.6px' }}>MAN</span>}
        <div style={{
          width: 26, height: 26, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, transition: 'all 0.25s', flexShrink: 0,
          background: on ? 'var(--accent)' : 'var(--red, #ef4444)',
          color: on ? '#0a1628' : '#fff',
          transform: on ? 'translateX(48px)' : 'translateX(0)',
        }}>
          <i className={on ? 'ri-robot-line' : 'ri-user-line'}></i>
        </div>
      </div>
    </div>
  );
}

function VehiclePill({ on, icon, label, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600, cursor: 'pointer', border: 'none', transition: 'all 0.15s', display: 'inline-flex', alignItems: 'center', gap: 4,
      background: on ? 'var(--accent-glow, rgba(0,212,170,0.15))' : 'var(--border)',
      color: on ? 'var(--accent)' : 'var(--text-muted)',
      border: on ? '1px solid rgba(0,212,170,0.3)' : '1px solid transparent',
    }}>
      <i className={icon}></i> {on ? label : 'Not Allowed'}
    </button>
  );
}

function Modal({ open, onClose, title, children, width = 480 }) {
  if (!open) return null;
  return (
    <div onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'var(--sidebar)', border: '1px solid var(--border)', borderRadius: 16, padding: 24, width, maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 48px rgba(0,0,0,0.4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ fontSize: 16, fontWeight: 700 }}>{title}</div>
          <button className="icon-btn" onClick={onClose}><i className="ri-close-line"></i></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function ModalError({ msg }) {
  if (!msg) return null;
  return <div style={{ padding: '8px 12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, fontSize: 12, color: 'var(--red, #ef4444)', marginBottom: 14 }}><i className="ri-error-warning-line"></i> {msg}</div>;
}

const rateInput = {
  background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 6,
  padding: '4px 6px', color: 'var(--text)', fontSize: 12, width: 68, textAlign: 'center',
};

// ── Main Page ──────────────────────────────────────────────────────────────

export default function RulesPage() {
  const { show } = useToast();
  const [activeTab, setActiveTab] = useState(0);

  // Tab 1
  const [vehicleData, setVehicleData] = useState(defaultVehicleData);
  const [vehicleModal, setVehicleModal] = useState(false);
  const [vmGrade, setVmGrade] = useState('');
  const [vmRole, setVmRole] = useState('');
  const [vm2W, setVm2W] = useState(true);
  const [vm4W, setVm4W] = useState(false);
  const [vmTaxi, setVmTaxi] = useState(false);
  const [vmErr, setVmErr] = useState('');

  // Tab 2
  const [allowanceData, setAllowanceData] = useState(defaultAllowanceData);
  const [tierData, setTierData] = useState(defaultTierData);
  const [routeData, setRouteData] = useState(defaultRouteData);
  const [gradeFilter, setGradeFilter] = useState('all');
  const [globalRates, setGlobalRates] = useState(defaultGlobalRates);
  const [byodData, setByodData] = useState(defaultByodData);
  const [fuelData, setFuelData] = useState(defaultFuelData);

  // Tab 2 – Add Allowance Row modal
  const [allowModal, setAllowModal] = useState(false);
  const [amGrade, setAmGrade] = useState('');
  const [amRole, setAmRole] = useState('');
  const [amDa, setAmDa] = useState(['', '', '']);
  const [amTa, setAmTa] = useState(['', '', '']);
  const [amMeal, setAmMeal] = useState('');
  const [amHalt, setAmHalt] = useState('');
  const [amErr, setAmErr] = useState('');

  // Tab 2 – City Tier modal
  const [tierModal, setTierModal] = useState(false);
  const [tmGrade, setTmGrade] = useState('');
  const [tmRole, setTmRole] = useState('');
  const [tmTier, setTmTier] = useState('');
  const [tmTa, setTmTa] = useState('');
  const [tmDa, setTmDa] = useState('');
  const [tmMeal, setTmMeal] = useState('');
  const [tmNh, setTmNh] = useState('');
  const [tmErr, setTmErr] = useState('');

  // Tab 2 – Add Route modal
  const [routeModal, setRouteModal] = useState(false);
  const [rmCode, setRmCode] = useState('');
  const [rmFrom, setRmFrom] = useState('');
  const [rmTo, setRmTo] = useState('');
  const [rmDist, setRmDist] = useState('');
  const [rmRows, setRmRows] = useState([{ grade: '', role: '', ta: '', da: '', nh: '' }]);
  const [rmErr, setRmErr] = useState('');

  // Tab 2 – BYOD modal
  const [byodModal, setByodModal] = useState(false);
  const [byCat, setByCat] = useState('');
  const [byDesc, setByDesc] = useState('');
  const [byGrade, setByGrade] = useState('');
  const [byAmt, setByAmt] = useState('');
  const [byUnit, setByUnit] = useState('');
  const [byErr, setByErr] = useState('');

  // Tab 2 – Fuel modal
  const [fuelModal, setFuelModal] = useState(false);
  const [fmRange, setFmRange] = useState('');
  const [fm2w, setFm2w] = useState('');
  const [fm4w, setFm4w] = useState('');
  const [fmLimit, setFmLimit] = useState('');
  const [fmErr, setFmErr] = useState('');

  // Tab 3
  const [autoRules, setAutoRules] = useState(defaultAutoRules);
  const [arModal, setArModal] = useState(false);
  const [arEdit, setArEdit] = useState(null);
  const [arCat, setArCat] = useState('');
  const [arDesc, setArDesc] = useState('');
  const [arCond, setArCond] = useState('');
  const [arThresh, setArThresh] = useState('');
  const [arAuto, setArAuto] = useState(true);
  const [arErr, setArErr] = useState('');

  // Tab 4
  const [fraudRules, setFraudRules] = useState(defaultFraudRules);
  const [geoRadius, setGeoRadius] = useState(500);
  const [haltRadius, setHaltRadius] = useState(100);
  const [odoVariance, setOdoVariance] = useState(5);
  const [frModal, setFrModal] = useState(false);
  const [frDesc, setFrDesc] = useState('');
  const [frEnabled, setFrEnabled] = useState(true);
  const [frErr, setFrErr] = useState('');
  const bulkRef = useRef();

  // ── Helpers ──
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

  // ── Vehicle modal ──
  function openVehicleModal() {
    setVmGrade(''); setVmRole(''); setVm2W(true); setVm4W(false); setVmTaxi(false); setVmErr('');
    setVehicleModal(true);
  }
  function confirmVehicleRow() {
    const grade = vmGrade.trim().toUpperCase();
    const label = vmRole.trim();
    if (!grade) return setVmErr('Grade is required');
    if (!label) return setVmErr('Role / Designation is required');
    if (!vm2W && !vm4W && !vmTaxi) return setVmErr('At least one vehicle type must be selected');
    setVehicleData(prev => [...prev, { grade, label, can2W: vm2W, can4W: vm4W, canTaxi: vmTaxi }]);
    setVehicleModal(false);
    show(`Grade "${grade}" added successfully.`, 'success');
  }

  // ── Allowance modal ──
  function openAllowModal() {
    setAmGrade(''); setAmRole(''); setAmDa(['','','']); setAmTa(['','','']); setAmMeal(''); setAmHalt(''); setAmErr('');
    setAllowModal(true);
  }
  function confirmAllowRow() {
    const grade = amGrade.trim().toUpperCase();
    const role = amRole.trim();
    if (!grade || !role) return setAmErr('Grade and Role are required');
    setAllowanceData(prev => [...prev, {
      grade, role,
      da: amDa.map(v => parseFloat(v) || 0),
      ta: amTa.map(v => parseFloat(v) || 0),
      meal: parseFloat(amMeal) || 0,
      halt: parseFloat(amHalt) || 0,
    }]);
    setAllowModal(false);
    show(`Grade "${grade}" row added.`, 'success');
  }

  // ── City Tier modal ──
  function openTierModal() {
    setTmGrade(''); setTmRole(''); setTmTier(''); setTmTa(''); setTmDa(''); setTmMeal(''); setTmNh(''); setTmErr('');
    setTierModal(true);
  }
  function confirmTierRow() {
    const grade = tmGrade.trim().toUpperCase();
    const role = tmRole.trim();
    if (!grade || !role || !tmTier) return setTmErr('Grade, Role and City Tier are required');
    setTierData(prev => [...prev, { grade, role, tier: tmTier, ta: parseFloat(tmTa)||0, da: parseFloat(tmDa)||0, meal: parseFloat(tmMeal)||0, nh: parseFloat(tmNh)||0 }]);
    setTierModal(false);
    show(`Tier row for "${grade}" added.`, 'success');
  }

  // ── Route modal ──
  function openRouteModal() {
    setRmCode(''); setRmFrom(''); setRmTo(''); setRmDist('');
    setRmRows([{ grade: '', role: '', ta: '', da: '', nh: '' }]);
    setRmErr('');
    setRouteModal(true);
  }
  function confirmRoute() {
    const code = rmCode.trim().toUpperCase();
    const from = rmFrom.trim();
    const to = rmTo.trim();
    if (!code || !from || !to) return setRmErr('Route Code, From Town, and To Town are required');
    if (rmRows.some(r => !r.grade)) return setRmErr('All grade rows must have a Grade value');
    setRouteData(prev => [...prev, { code, from, to, dist: parseFloat(rmDist)||0, rows: rmRows.map(r => ({ ...r, ta: parseFloat(r.ta)||0, da: parseFloat(r.da)||0, nh: parseFloat(r.nh)||0 })) }]);
    setRouteModal(false);
    show(`Route "${code}" added.`, 'success');
  }
  function downloadRouteTemplate() {
    const csv = 'route_code,from_town,to_town,distance_km,grade,role,ta_per_km,da_per_day,nh_per_night\nRT001,Mumbai,Pune,148,G1,Junior Exec,2.5,200,600\nRT001,Mumbai,Pune,148,G2,Executive,3.0,280,800\n';
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'route_template.csv'; a.click();
    URL.revokeObjectURL(url);
  }
  function handleBulkCSV(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const lines = ev.target.result.trim().split('\n').slice(1);
      const grouped = {};
      lines.forEach(line => {
        const [code, from, to, dist, grade, role, ta, da, nh] = line.split(',').map(s => s.trim());
        if (!code) return;
        if (!grouped[code]) grouped[code] = { code, from, to, dist: parseFloat(dist)||0, rows: [] };
        grouped[code].rows.push({ grade, role, ta: parseFloat(ta)||0, da: parseFloat(da)||0, nh: parseFloat(nh)||0 });
      });
      const newRoutes = Object.values(grouped);
      setRouteData(prev => {
        const existing = new Set(prev.map(r => r.code));
        return [...prev, ...newRoutes.filter(r => !existing.has(r.code))];
      });
      show(`Imported ${newRoutes.length} route(s) from CSV.`, 'success');
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  // ── BYOD modal ──
  function openByodModal() {
    setByCat(''); setByDesc(''); setByGrade(''); setByAmt(''); setByUnit(''); setByErr('');
    setByodModal(true);
  }
  function confirmByod() {
    if (!byCat.trim() || !byDesc.trim() || !byGrade || !byAmt || !byUnit) return setByErr('All fields are required');
    setByodData(prev => [...prev, { category: byCat.trim(), desc: byDesc.trim(), grade: byGrade, amount: parseFloat(byAmt)||0, unit: byUnit }]);
    setByodModal(false);
    show('BYOD entry added.', 'success');
  }

  // ── Fuel modal ──
  function openFuelModal() {
    setFmRange(''); setFm2w(''); setFm4w(''); setFmLimit(''); setFmErr('');
    setFuelModal(true);
  }
  function confirmFuel() {
    if (!fmRange.trim()) return setFmErr('Grade / Range label is required');
    if (!fmLimit) return setFmErr('Monthly fuel limit is required');
    setFuelData(prev => [...prev, { range: fmRange.trim().toUpperCase(), tw: parseFloat(fm2w)||0, fw: parseFloat(fm4w)||0, limit: parseFloat(fmLimit)||0 }]);
    setFuelModal(false);
    show('Fuel row added.', 'success');
  }

  // ── Auto-Approve modal ──
  function openArModal(rule = null) {
    setArEdit(rule ? rule.id : null);
    setArCat(rule ? rule.cat : '');
    setArDesc(rule ? rule.desc : '');
    setArCond(rule ? rule.condition : '');
    setArThresh(rule ? rule.threshold : '');
    setArAuto(rule ? rule.auto : true);
    setArErr('');
    setArModal(true);
  }
  function confirmArRule() {
    const cat = arCat.trim();
    const desc = arDesc.trim();
    const cond = arCond.trim();
    const thresh = arThresh.trim();
    if (!cat || !desc || !cond || !thresh) return setArErr('All fields are required');
    if (arEdit !== null) {
      setAutoRules(prev => prev.map(r => r.id === arEdit ? { ...r, cat, desc, condition: cond, threshold: thresh, auto: arAuto } : r));
      show('Rule updated.', 'success');
    } else {
      const newId = Math.max(...autoRules.map(r => r.id), 0) + 1;
      setAutoRules(prev => [...prev, { id: newId, cat, desc, condition: cond, threshold: thresh, auto: arAuto, icon: 'ri-settings-3-line', col: '#6b7280' }]);
      show('Rule added.', 'success');
    }
    setArModal(false);
  }

  // ── Fraud rule modal ──
  function openFrModal() {
    setFrDesc(''); setFrEnabled(true); setFrErr('');
    setFrModal(true);
  }
  function confirmFrRule() {
    if (!frDesc.trim()) return setFrErr('Rule description is required');
    setFraudRules(prev => [...prev, { label: frDesc.trim(), alwaysOn: false, enabled: frEnabled }]);
    setFrModal(false);
    show('Anti-fraud rule added.', 'success');
  }

  // ── Filtered routes ──
  const filteredRouteRows = routeData.flatMap(rt =>
    rt.rows
      .filter(r => gradeFilter === 'all' || r.grade === gradeFilter)
      .map(r => ({ ...r, code: rt.code, from: rt.from, to: rt.to, dist: rt.dist }))
  );

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

      {/* ── Tab 1: Vehicle Allocation ── */}
      {activeTab === 0 && (
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Grade → Vehicle Allocation</div>
              <div className="card-subtitle">Define which vehicle types each grade is eligible to use. Click a pill to toggle.</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-primary btn-sm" onClick={openVehicleModal}><i className="ri-add-line"></i> Add Grade</button>
              <button className="btn btn-outline btn-sm" onClick={() => { setVehicleData(defaultVehicleData); show('Vehicle matrix reset.', 'info'); }}><i className="ri-refresh-line"></i> Reset</button>
            </div>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Grade</th><th>Role</th><th>2-Wheeler</th><th>4-Wheeler</th><th>Taxi/Cab</th><th></th></tr>
              </thead>
              <tbody>
                {vehicleData.map((v, idx) => (
                  <tr key={idx}>
                    <td><span className="badge badge-blue">{v.grade}</span></td>
                    <td style={{ fontSize: 13 }}>{v.label}</td>
                    <td><VehiclePill on={v.can2W} icon="ri-motorbike-line" label="2W" onClick={() => setVehicleData(prev => prev.map((r, i) => i === idx ? { ...r, can2W: !r.can2W } : r))} /></td>
                    <td><VehiclePill on={v.can4W} icon="ri-car-line" label="4W" onClick={() => setVehicleData(prev => prev.map((r, i) => i === idx ? { ...r, can4W: !r.can4W } : r))} /></td>
                    <td><VehiclePill on={v.canTaxi} icon="ri-taxi-line" label="Taxi" onClick={() => setVehicleData(prev => prev.map((r, i) => i === idx ? { ...r, canTaxi: !r.canTaxi } : r))} /></td>
                    <td>
                      <button className="icon-btn" style={{ color: 'var(--red, #ef4444)' }} title="Remove row"
                        onClick={() => { if (vehicleData.length <= 1) { show('At least one grade row is required.', 'error'); return; } setVehicleData(prev => prev.filter((_, i) => i !== idx)); show('Row removed.', 'info'); }}>
                        <i className="ri-delete-bin-line"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Tab 2: Allowance Rates ── */}
      {activeTab === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* DA/TA Matrix */}
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Daily Allowance (DA) &amp; Travel Allowance (TA) Matrix</div>
                <div className="card-subtitle">Rates applied per grade and city tier. Edit inline and save.</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-primary btn-sm" onClick={openAllowModal}><i className="ri-add-line"></i> Add Grade Row</button>
                <button className="btn btn-outline btn-sm" onClick={() => { setAllowanceData(defaultAllowanceData); show('Rates reset to defaults.', 'info'); }}><i className="ri-refresh-line"></i> Reset</button>
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
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {allowanceData.map((a, idx) => (
                    <tr key={idx}>
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
                      <td>
                        <button className="icon-btn" style={{ color: 'var(--red, #ef4444)' }} onClick={() => { setAllowanceData(prev => prev.filter((_, i) => i !== idx)); show('Row removed.', 'info'); }}>
                          <i className="ri-delete-bin-line"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: 10, padding: '10px 14px', background: 'var(--bg)', borderRadius: 8, fontSize: 12, color: 'var(--text-muted)' }}>
              <i className="ri-information-line" style={{ marginRight: 4 }}></i>
              <strong>Tier 1</strong> = Metro cities (Mumbai, Delhi, Bengaluru, Chennai, Hyderabad, Pune, Kolkata) · <strong>Tier 2</strong> = Tier-2 cities · <strong>Tier 3</strong> = Small towns &amp; rural
            </div>
          </div>

          {/* Grade → City Tier Assignment */}
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title"><i className="ri-building-4-line" style={{ color: 'var(--accent)', marginRight: 6 }}></i>Grade → City Tier Assignment</div>
                <div className="card-subtitle">Maps each grade to a city tier, determining which DA/TA column applies when the employee visits a city of that tier.</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-primary btn-sm" onClick={openTierModal}><i className="ri-add-line"></i> Add Row</button>
                <button className="btn btn-outline btn-sm" onClick={() => { setTierData(defaultTierData); show('Tier matrix reset.', 'info'); }}><i className="ri-refresh-line"></i> Reset</button>
              </div>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Grade</th><th>Role / Label</th><th>City Tier</th>
                    <th>TA Rate<br /><small style={{ color: 'var(--text-muted)', fontWeight: 400 }}>₹/km</small></th>
                    <th>DA Rate<br /><small>₹/day</small></th>
                    <th>Meal Limit<br /><small>₹/day</small></th>
                    <th>Night Halt<br /><small>₹/night</small></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {tierData.map((t, idx) => (
                    <tr key={idx}>
                      <td><span className="badge badge-blue">{t.grade}</span></td>
                      <td style={{ fontSize: 12 }}>{t.role}</td>
                      <td><span className={`badge ${t.tier === '1' ? 'badge-green' : t.tier === '2' ? 'badge-blue' : 'badge-red'}`}>Tier {t.tier}</span></td>
                      <td><input style={rateInput} type="number" value={t.ta} onChange={e => setTierData(prev => prev.map((r, i) => i === idx ? { ...r, ta: parseFloat(e.target.value)||0 } : r))} /></td>
                      <td><input style={rateInput} type="number" value={t.da} onChange={e => setTierData(prev => prev.map((r, i) => i === idx ? { ...r, da: parseFloat(e.target.value)||0 } : r))} /></td>
                      <td><input style={rateInput} type="number" value={t.meal} onChange={e => setTierData(prev => prev.map((r, i) => i === idx ? { ...r, meal: parseFloat(e.target.value)||0 } : r))} /></td>
                      <td><input style={rateInput} type="number" value={t.nh} onChange={e => setTierData(prev => prev.map((r, i) => i === idx ? { ...r, nh: parseFloat(e.target.value)||0 } : r))} /></td>
                      <td>
                        <button className="icon-btn" style={{ color: 'var(--red, #ef4444)' }} onClick={() => { setTierData(prev => prev.filter((_, i) => i !== idx)); show('Row removed.', 'info'); }}>
                          <i className="ri-delete-bin-line"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Route-wise TA/DA Matrix */}
          <div className="card">
            <div className="card-header" style={{ flexWrap: 'wrap', gap: 10 }}>
              <div>
                <div className="card-title"><i className="ri-route-line" style={{ color: 'var(--accent)', marginRight: 6 }}></i>Route-wise TA / DA &amp; Night Allowance Matrix</div>
                <div className="card-subtitle">Configure TA · DA · Night Halt per Route Code, From Town → To Town, Grade &amp; Role</div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                <span className="badge badge-green"><i className="ri-map-pin-2-line"></i> {routeData.length} Routes</span>
                <button className="btn btn-primary btn-sm" onClick={openRouteModal}><i className="ri-add-line"></i> Add Route</button>
                <button className="btn btn-outline btn-sm" onClick={downloadRouteTemplate}><i className="ri-download-2-line"></i> Download Template</button>
                <button className="btn btn-outline btn-sm" style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }} onClick={() => bulkRef.current?.click()}>
                  <i className="ri-upload-cloud-2-line"></i> Bulk Upload
                </button>
                <input ref={bulkRef} type="file" accept=".csv" style={{ display: 'none' }} onChange={handleBulkCSV} />
                <button className="btn btn-outline btn-sm" onClick={() => { setRouteData(defaultRouteData); show('Routes reset.', 'info'); }}><i className="ri-refresh-line"></i> Reset</button>
              </div>
            </div>
            {/* Grade filter pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', borderBottom: '1px solid var(--border)', flexWrap: 'wrap', background: 'var(--bg)' }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)' }}>FILTER BY GRADE:</span>
              {['all','G1','G2','G3','G4','G5'].map(g => (
                <button key={g} className={`tab-btn${gradeFilter === g ? ' active' : ''}`} style={{ padding: '3px 12px', fontSize: 11 }} onClick={() => setGradeFilter(g)}>
                  {g === 'all' ? 'All Grades' : g}
                </button>
              ))}
            </div>
            <div className="table-wrap" style={{ maxHeight: 400, overflowY: 'auto' }}>
              <table>
                <thead style={{ position: 'sticky', top: 0, zIndex: 2 }}>
                  <tr>
                    <th>Route Code</th><th>From Town</th><th>To Town</th><th>Dist km</th>
                    <th>Grade</th><th>Role</th>
                    <th style={{ background: 'rgba(0,212,170,0.08)' }}>TA<br /><small style={{ fontWeight: 400, color: 'var(--text-muted)' }}>₹/km</small></th>
                    <th style={{ background: 'rgba(59,130,246,0.08)' }}>DA<br /><small style={{ fontWeight: 400, color: 'var(--text-muted)' }}>₹/day</small></th>
                    <th style={{ background: 'rgba(139,92,246,0.08)' }}>NH Allowance<br /><small style={{ fontWeight: 400, color: 'var(--text-muted)' }}>₹/night</small></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRouteRows.length === 0 ? (
                    <tr><td colSpan={10} style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>
                      <i className="ri-route-line" style={{ fontSize: 32, display: 'block', marginBottom: 8 }}></i>
                      No route configurations yet.
                    </td></tr>
                  ) : filteredRouteRows.map((r, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 700 }}>{r.code}</td>
                      <td>{r.from}</td>
                      <td>{r.to}</td>
                      <td>{r.dist}</td>
                      <td><span className="badge badge-blue">{r.grade}</span></td>
                      <td style={{ fontSize: 12 }}>{r.role}</td>
                      <td><input style={rateInput} type="number" defaultValue={r.ta} /></td>
                      <td><input style={rateInput} type="number" defaultValue={r.da} /></td>
                      <td><input style={rateInput} type="number" defaultValue={r.nh} /></td>
                      <td>
                        <button className="icon-btn" style={{ color: 'var(--red, #ef4444)' }}
                          onClick={() => {
                            setRouteData(prev => prev.map(rt => ({
                              ...rt,
                              rows: rt.rows.filter(row => !(rt.code === r.code && row.grade === r.grade))
                            })).filter(rt => rt.rows.length > 0));
                            show('Route row removed.', 'info');
                          }}>
                          <i className="ri-delete-bin-line"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', padding: '10px 16px', borderTop: '1px solid var(--border)', background: 'var(--bg)', fontSize: 11, color: 'var(--text-muted)' }}>
              <span><i className="ri-pencil-line" style={{ color: 'var(--accent)' }}></i> Click any cell to edit inline</span>
              <span><i className="ri-information-line" style={{ color: '#3b82f6' }}></i> TA = Travel Allowance per km on this route</span>
              <span><i className="ri-moon-line" style={{ color: '#8b5cf6' }}></i> NH = Night Halt hotel allowance per night</span>
            </div>
          </div>

          {/* Global TA/DA/Night Halt */}
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title"><i className="ri-global-line" style={{ color: 'var(--accent)', marginRight: 6 }}></i>Global TA / DA &amp; Night Halt Allowance</div>
                <div className="card-subtitle">Fallback rates applied when no grade-specific rule matches. Also used as caps for reimbursement.</div>
              </div>
              <Toggle on={globalRates.enabled} onChange={() => setGlobalRates(p => ({ ...p, enabled: !p.enabled }))} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, padding: '4px 0 16px' }}>
              {/* TA Block */}
              <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, padding: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', letterSpacing: '.5px', marginBottom: 12 }}><i className="ri-road-map-line"></i> TRAVEL ALLOWANCE (TA)</div>
                {[['taLocal', 'Local TA (within city)', '₹/km'], ['taOutstation', 'Outstation TA (town-to-town)', '₹/km'], ['taCap', 'Max TA per day (cap)', '₹/day']].map(([k, label, unit]) => (
                  <div key={k} className="form-group" style={{ marginBottom: 10 }}>
                    <label className="form-label">{label}</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <input type="number" style={{ ...rateInput, width: 80 }} value={globalRates[k]} onChange={e => setGlobalRates(p => ({ ...p, [k]: parseFloat(e.target.value)||0 }))} />
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{unit}</span>
                    </div>
                  </div>
                ))}
              </div>
              {/* DA Block */}
              <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, padding: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#3b82f6', letterSpacing: '.5px', marginBottom: 12 }}><i className="ri-calendar-check-line"></i> DAILY ALLOWANCE (DA)</div>
                {[['daLocal', 'Local DA (home city)', '₹/day'], ['daOutstation', 'Outstation DA (on road)', '₹/day'], ['meal', 'Global Meal Allowance', '₹/day']].map(([k, label, unit]) => (
                  <div key={k} className="form-group" style={{ marginBottom: 10 }}>
                    <label className="form-label">{label}</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <input type="number" style={{ ...rateInput, width: 80 }} value={globalRates[k]} onChange={e => setGlobalRates(p => ({ ...p, [k]: parseFloat(e.target.value)||0 }))} />
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{unit}</span>
                    </div>
                  </div>
                ))}
              </div>
              {/* Night Halt Block */}
              <div style={{ background: 'var(--bg)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 8, padding: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#8b5cf6', letterSpacing: '.5px', marginBottom: 12 }}><i className="ri-moon-line"></i> NIGHT HALT ALLOWANCE</div>
                {[['haltA', 'Class A City (Metro)', '₹/night'], ['haltB', 'Class B Town (Tier 2)', '₹/night'], ['haltC', 'Class C Town (Tier 3 / Rural)', '₹/night'], ['haltMax', 'Max Halt Duration', 'nights']].map(([k, label, unit]) => (
                  <div key={k} className="form-group" style={{ marginBottom: 10 }}>
                    <label className="form-label">{label}</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <input type="number" style={{ ...rateInput, width: 80 }} value={globalRates[k]} onChange={e => setGlobalRates(p => ({ ...p, [k]: parseFloat(e.target.value)||0 }))} />
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ padding: '12px 16px', background: 'rgba(0,212,170,0.05)', border: '1px solid rgba(0,212,170,0.15)', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)' }}><i className="ri-information-line"></i> Apply Global Rates To:</span>
              {[['applyUnassigned', 'Unassigned / new grades'], ['applyNoRoute', 'Routes with no specific rule'], ['applyCap', 'Use as upper cap for all grade-specific rates']].map(([k, label]) => (
                <label key={k} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, cursor: 'pointer' }}>
                  <input type="checkbox" checked={globalRates[k]} onChange={() => setGlobalRates(p => ({ ...p, [k]: !p[k] }))} /> <span>{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* BYOD + Fuel side-by-side */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div className="card">
              <div className="card-header">
                <div className="card-title"><i className="ri-phone-line" style={{ color: 'var(--accent)' }}></i> BYOD Internet Allowance</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-primary btn-sm" onClick={openByodModal}><i className="ri-add-line"></i> Add Entry</button>
                  <button className="btn btn-outline btn-sm" onClick={() => { setByodData(defaultByodData); show('BYOD reset.', 'info'); }}><i className="ri-refresh-line"></i> Reset</button>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {byodData.map((b, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 0', borderBottom: i < byodData.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 13 }}>{b.category}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{b.desc}</div>
                      <div style={{ fontSize: 11, marginTop: 4 }}>
                        <span className="badge badge-blue" style={{ fontSize: 10 }}>{b.grade}</span>
                        <span style={{ marginLeft: 8, color: 'var(--accent)', fontWeight: 700 }}>₹{b.amount}/{b.unit}</span>
                      </div>
                    </div>
                    <button className="icon-btn" style={{ color: 'var(--red, #ef4444)' }} onClick={() => { setByodData(prev => prev.filter((_, j) => j !== i)); show('BYOD entry removed.', 'info'); }}>
                      <i className="ri-delete-bin-line"></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <div className="card-title"><i className="ri-fuel-line" style={{ color: 'var(--accent)' }}></i> Grade-wise Fuel Charges</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-primary btn-sm" onClick={openFuelModal}><i className="ri-add-line"></i> Add Row</button>
                  <button className="btn btn-outline btn-sm" onClick={() => { setFuelData(defaultFuelData); show('Fuel matrix reset.', 'info'); }}><i className="ri-refresh-line"></i> Reset</button>
                </div>
              </div>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Grade</th><th>2W ₹/L</th><th>4W ₹/L</th><th>Fuel Limit ₹/mo</th><th></th></tr></thead>
                  <tbody>
                    {fuelData.map((f, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: 700 }}>{f.range}</td>
                        <td><input style={rateInput} type="number" value={f.tw} onChange={e => setFuelData(prev => prev.map((r, j) => j === i ? { ...r, tw: parseFloat(e.target.value)||0 } : r))} /></td>
                        <td><input style={rateInput} type="number" value={f.fw} onChange={e => setFuelData(prev => prev.map((r, j) => j === i ? { ...r, fw: parseFloat(e.target.value)||0 } : r))} /></td>
                        <td><input style={{ ...rateInput, width: 80 }} type="number" value={f.limit} onChange={e => setFuelData(prev => prev.map((r, j) => j === i ? { ...r, limit: parseFloat(e.target.value)||0 } : r))} /></td>
                        <td>
                          <button className="icon-btn" style={{ color: 'var(--red, #ef4444)' }} onClick={() => { setFuelData(prev => prev.filter((_, j) => j !== i)); show('Row removed.', 'info'); }}>
                            <i className="ri-delete-bin-line"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Tab 3: Auto-Approve Rules ── */}
      {activeTab === 2 && (
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title"><i className="ri-robot-line" style={{ color: 'var(--accent)', marginRight: 6 }}></i>Auto-Approval Rule Configuration</div>
              <div className="card-subtitle">Define which expense categories are eligible for automatic approval and set conditions.</div>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{autoRules.filter(r => r.auto).length} of {autoRules.length} enabled</span>
              <button className="btn btn-primary btn-sm" onClick={() => openArModal()}><i className="ri-add-line"></i> Add Rule</button>
              <button className="btn btn-outline btn-sm" onClick={() => { setAutoRules(defaultAutoRules); show('Auto-approve rules reset.', 'info'); }}><i className="ri-refresh-line"></i> Reset</button>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {autoRules.map((r, i) => (
              <div key={r.id} style={{
                display: 'flex', alignItems: 'flex-start', gap: 16, padding: '16px 0',
                borderBottom: i < autoRules.length - 1 ? '1px solid var(--border)' : 'none',
                opacity: r.auto ? 1 : 0.55,
              }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: `${r.col}20`, color: r.col, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <i className={r.icon}></i>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, fontSize: 14 }}>{r.cat}</span>
                    <span className={`badge ${r.auto ? 'badge-green' : 'badge-red'}`} style={{ fontSize: 10 }}>
                      {r.auto ? 'Auto-Approve' : 'Manual'}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>{r.desc}</div>
                  <div style={{ display: 'flex', gap: 16, fontSize: 11, color: 'var(--text-muted)' }}>
                    <span><i className="ri-git-branch-line" style={{ marginRight: 4 }}></i>{r.condition}</span>
                    <span><i className="ri-money-rupee-circle-line" style={{ marginRight: 4 }}></i>{r.threshold}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                  <AutoTogglePill on={r.auto} onChange={() => setAutoRules(prev => prev.map(x => x.id === r.id ? { ...x, auto: !x.auto } : x))} />
                  <button className="icon-btn" title="Edit" onClick={() => openArModal(r)}><i className="ri-pencil-line"></i></button>
                  <button className="icon-btn" style={{ color: 'var(--red, #ef4444)' }} title="Delete"
                    onClick={() => { setAutoRules(prev => prev.filter(x => x.id !== r.id)); show('Rule removed.', 'info'); }}>
                    <i className="ri-delete-bin-line"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Tab 4: Geo-Fence Settings ── */}
      {activeTab === 3 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* Geo-Fence Parameters */}
          <div className="card">
            <div className="card-header">
              <div className="card-title"><i className="ri-map-pin-range-line" style={{ color: 'var(--accent)', marginRight: 6 }}></i>Geo-Fence Parameters</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="form-group">
                <label className="form-label">Activity Proof Radius (meters)</label>
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
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>Midnight GPS ping must confirm user is more than this distance from home base.</div>
              </div>
              <div className="form-group">
                <label className="form-label">Odometer vs GPS Variance Tolerance</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <input type="range" min={1} max={20} value={odoVariance} onChange={e => setOdoVariance(Number(e.target.value))} style={{ flex: 1 }} />
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent)', minWidth: 60 }}>{odoVariance}%</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>Auto-approve TA if odometer reading is within this % of GPS path distance.</div>
              </div>
            </div>
          </div>

          {/* Anti-Fraud Rules */}
          <div className="card">
            <div className="card-header">
              <div className="card-title"><i className="ri-shield-keyhole-line" style={{ color: 'var(--accent)', marginRight: 6 }}></i>Anti-Fraud Rules</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-primary btn-sm" onClick={openFrModal}><i className="ri-add-line"></i> Add Rule</button>
                <button className="btn btn-outline btn-sm" onClick={() => { setFraudRules(defaultFraudRules); show('Fraud rules reset.', 'info'); }}><i className="ri-refresh-line"></i> Reset</button>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {fraudRules.map((fr, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < fraudRules.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: 12 }}>{fr.label}</span>
                    {fr.alwaysOn && <span className="badge badge-green" style={{ marginLeft: 8, fontSize: 10 }}>Always On</span>}
                  </div>
                  {fr.alwaysOn
                    ? <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, flexShrink: 0 }}>LOCKED</span>
                    : <>
                        <Toggle on={fr.enabled} onChange={() => setFraudRules(prev => prev.map((r, j) => j === i ? { ...r, enabled: !r.enabled } : r))} />
                        <button className="icon-btn" style={{ color: 'var(--red, #ef4444)', flexShrink: 0 }} onClick={() => { setFraudRules(prev => prev.filter((_, j) => j !== i)); show('Rule removed.', 'info'); }}>
                          <i className="ri-delete-bin-line"></i>
                        </button>
                      </>
                  }
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16, padding: 14, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--red, #ef4444)', marginBottom: 8 }}><i className="ri-alert-line"></i> Always-On Rules (Cannot be disabled)</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.8 }}>
                • No expense on dates marked "Absent" in attendance<br />
                • Duplicate bill detection (same vendor + date + amount)<br />
                • Vehicle grade enforcement — cannot claim higher grade vehicle<br />
                • Backdating limit — bills older than 30 days auto-rejected
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Modals ── */}

      {/* Vehicle Add Modal */}
      <Modal open={vehicleModal} onClose={() => setVehicleModal(false)} title={<><i className="ri-add-circle-line" style={{ color: 'var(--accent)', marginRight: 8 }}></i>Add Grade</>}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Grade <span style={{ color: 'var(--red, #ef4444)' }}>*</span></label>
            <input className="form-control" value={vmGrade} onChange={e => setVmGrade(e.target.value)} placeholder="e.g. G6" style={{ fontWeight: 700, textTransform: 'uppercase' }} />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Role / Designation <span style={{ color: 'var(--red, #ef4444)' }}>*</span></label>
            <input className="form-control" value={vmRole} onChange={e => setVmRole(e.target.value)} placeholder="e.g. Deputy Manager" />
          </div>
        </div>
        <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, padding: 14, marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', letterSpacing: '.5px', marginBottom: 12 }}><i className="ri-car-line"></i> VEHICLE ELIGIBILITY</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[['vm2W', '2-Wheeler', vm2W, setVm2W], ['vm4W', '4-Wheeler', vm4W, setVm4W], ['vmTaxi', 'Taxi / Cab', vmTaxi, setVmTaxi]].map(([k, label, val, setter]) => (
              <label key={k} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                <input type="checkbox" checked={val} onChange={() => setter(v => !v)} />
                <span style={{ fontSize: 12 }}>{label}</span>
              </label>
            ))}
          </div>
        </div>
        <ModalError msg={vmErr} />
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button className="btn btn-outline btn-sm" onClick={() => setVehicleModal(false)}>Cancel</button>
          <button className="btn btn-primary btn-sm" onClick={confirmVehicleRow}><i className="ri-check-line"></i> Add Grade</button>
        </div>
      </Modal>

      {/* Allowance Add Modal */}
      <Modal open={allowModal} onClose={() => setAllowModal(false)} title={<><i className="ri-add-circle-line" style={{ color: 'var(--accent)', marginRight: 8 }}></i>Add Grade Row</>} width={500}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Grade <span style={{ color: 'var(--red, #ef4444)' }}>*</span></label>
            <input className="form-control" value={amGrade} onChange={e => setAmGrade(e.target.value)} placeholder="e.g. G6" style={{ fontWeight: 700 }} />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Role / Designation <span style={{ color: 'var(--red, #ef4444)' }}>*</span></label>
            <input className="form-control" value={amRole} onChange={e => setAmRole(e.target.value)} placeholder="e.g. Deputy Manager" />
          </div>
        </div>
        <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, padding: 14, marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#3b82f6', marginBottom: 10 }}><i className="ri-calendar-check-line"></i> DAILY ALLOWANCE (DA)</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            {['Tier 1', 'Tier 2', 'Tier 3'].map((t, ti) => (
              <div key={ti} className="form-group" style={{ margin: 0 }}>
                <label className="form-label">{t} <small style={{ color: 'var(--text-muted)' }}>₹/day</small></label>
                <input type="number" className="form-control" value={amDa[ti]} onChange={e => setAmDa(prev => { const a = [...prev]; a[ti] = e.target.value; return a; })} placeholder="0" />
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, padding: 14, marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', marginBottom: 10 }}><i className="ri-road-map-line"></i> TRAVEL ALLOWANCE (TA)</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            {['Tier 1', 'Tier 2', 'Tier 3'].map((t, ti) => (
              <div key={ti} className="form-group" style={{ margin: 0 }}>
                <label className="form-label">{t} <small style={{ color: 'var(--text-muted)' }}>₹/km</small></label>
                <input type="number" className="form-control" value={amTa[ti]} onChange={e => setAmTa(prev => { const a = [...prev]; a[ti] = e.target.value; return a; })} placeholder="0" step="0.5" />
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, padding: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#f59e0b', marginBottom: 10 }}><i className="ri-restaurant-line"></i> MEAL LIMIT</div>
            <label className="form-label">Per Day <small style={{ color: 'var(--text-muted)' }}>₹/day</small></label>
            <input type="number" className="form-control" value={amMeal} onChange={e => setAmMeal(e.target.value)} placeholder="e.g. 700" />
          </div>
          <div style={{ background: 'var(--bg)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 8, padding: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#8b5cf6', marginBottom: 10 }}><i className="ri-moon-line"></i> NIGHT HALT</div>
            <label className="form-label">Per Night <small style={{ color: 'var(--text-muted)' }}>₹/night</small></label>
            <input type="number" className="form-control" value={amHalt} onChange={e => setAmHalt(e.target.value)} placeholder="e.g. 2800" />
          </div>
        </div>
        <ModalError msg={amErr} />
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button className="btn btn-outline btn-sm" onClick={() => setAllowModal(false)}>Cancel</button>
          <button className="btn btn-primary btn-sm" onClick={confirmAllowRow}><i className="ri-check-line"></i> Add Row</button>
        </div>
      </Modal>

      {/* City Tier Modal */}
      <Modal open={tierModal} onClose={() => setTierModal(false)} title={<><i className="ri-add-circle-line" style={{ color: 'var(--accent)', marginRight: 8 }}></i>Add Tier Row</>}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Grade <span style={{ color: 'var(--red, #ef4444)' }}>*</span></label>
            <input className="form-control" value={tmGrade} onChange={e => setTmGrade(e.target.value)} placeholder="e.g. G6" style={{ fontWeight: 700 }} />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Role / Designation <span style={{ color: 'var(--red, #ef4444)' }}>*</span></label>
            <input className="form-control" value={tmRole} onChange={e => setTmRole(e.target.value)} placeholder="e.g. Deputy Manager" />
          </div>
        </div>
        <div className="form-group" style={{ marginBottom: 14 }}>
          <label className="form-label">City Tier <span style={{ color: 'var(--red, #ef4444)' }}>*</span></label>
          <select className="form-control" value={tmTier} onChange={e => setTmTier(e.target.value)}>
            <option value="">-- Select Tier --</option>
            <option value="1">Tier 1 (Metro)</option>
            <option value="2">Tier 2</option>
            <option value="3">Tier 3 (Other)</option>
          </select>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
          {[['tmTa', setTmTa, 'TA Rate', '₹/km', tmTa], ['tmDa', setTmDa, 'DA Rate', '₹/day', tmDa], ['tmMeal', setTmMeal, 'Meal Limit', '₹/day', tmMeal], ['tmNh', setTmNh, 'Night Halt', '₹/night', tmNh]].map(([k, setter, label, unit, val]) => (
            <div key={k} className="form-group" style={{ margin: 0 }}>
              <label className="form-label">{label} <small style={{ color: 'var(--text-muted)' }}>{unit}</small></label>
              <input type="number" className="form-control" value={val} onChange={e => setter(e.target.value)} placeholder="0" />
            </div>
          ))}
        </div>
        <ModalError msg={tmErr} />
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button className="btn btn-outline btn-sm" onClick={() => setTierModal(false)}>Cancel</button>
          <button className="btn btn-primary btn-sm" onClick={confirmTierRow}><i className="ri-check-line"></i> Add Row</button>
        </div>
      </Modal>

      {/* Add Route Modal */}
      <Modal open={routeModal} onClose={() => setRouteModal(false)} title={<><i className="ri-route-line" style={{ color: 'var(--accent)', marginRight: 8 }}></i>Add Route Configuration</>} width={520}>
        <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, padding: 14, marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', marginBottom: 10 }}>ROUTE DETAILS</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Route Code</label>
              <input className="form-control" value={rmCode} onChange={e => setRmCode(e.target.value)} placeholder="e.g. RT006" style={{ fontWeight: 700 }} />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Distance (km)</label>
              <input type="number" className="form-control" value={rmDist} onChange={e => setRmDist(e.target.value)} placeholder="e.g. 148" />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">From Town</label>
              <input className="form-control" value={rmFrom} onChange={e => setRmFrom(e.target.value)} placeholder="e.g. Mumbai" />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">To Town</label>
              <input className="form-control" value={rmTo} onChange={e => setRmTo(e.target.value)} placeholder="e.g. Pune" />
            </div>
          </div>
        </div>
        <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, padding: 14, marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 10 }}>GRADE-WISE ALLOWANCE RATES</div>
          {rmRows.map((row, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '80px 1fr 60px 60px 60px 28px', gap: 6, marginBottom: 8, alignItems: 'center' }}>
              <input className="form-control" value={row.grade} onChange={e => setRmRows(prev => prev.map((r, j) => j === i ? { ...r, grade: e.target.value } : r))} placeholder="Grade" style={{ fontSize: 12, padding: '4px 6px' }} />
              <input className="form-control" value={row.role} onChange={e => setRmRows(prev => prev.map((r, j) => j === i ? { ...r, role: e.target.value } : r))} placeholder="Role" style={{ fontSize: 12, padding: '4px 6px' }} />
              <input type="number" className="form-control" value={row.ta} onChange={e => setRmRows(prev => prev.map((r, j) => j === i ? { ...r, ta: e.target.value } : r))} placeholder="TA" style={{ fontSize: 12, padding: '4px 6px' }} />
              <input type="number" className="form-control" value={row.da} onChange={e => setRmRows(prev => prev.map((r, j) => j === i ? { ...r, da: e.target.value } : r))} placeholder="DA" style={{ fontSize: 12, padding: '4px 6px' }} />
              <input type="number" className="form-control" value={row.nh} onChange={e => setRmRows(prev => prev.map((r, j) => j === i ? { ...r, nh: e.target.value } : r))} placeholder="NH" style={{ fontSize: 12, padding: '4px 6px' }} />
              <button className="icon-btn" style={{ color: 'var(--red, #ef4444)', fontSize: 13 }} onClick={() => setRmRows(prev => prev.filter((_, j) => j !== i))}><i className="ri-close-line"></i></button>
            </div>
          ))}
          <button className="btn btn-outline btn-sm" style={{ fontSize: 11 }} onClick={() => setRmRows(prev => [...prev, { grade: '', role: '', ta: '', da: '', nh: '' }])}><i className="ri-add-line"></i> Add Grade Row</button>
        </div>
        <ModalError msg={rmErr} />
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button className="btn btn-outline btn-sm" onClick={() => setRouteModal(false)}>Cancel</button>
          <button className="btn btn-primary btn-sm" onClick={confirmRoute}><i className="ri-check-line"></i> Add Route Config</button>
        </div>
      </Modal>

      {/* BYOD Modal */}
      <Modal open={byodModal} onClose={() => setByodModal(false)} title={<><i className="ri-add-circle-line" style={{ color: 'var(--accent)', marginRight: 8 }}></i>Add BYOD Entry</>}>
        {[['Category Name', byCat, setByCat, 'e.g. BYOD Data Allowance', 'text'], ['Description', byDesc, setByDesc, 'e.g. Monthly flat rate for personal device usage', 'text']].map(([label, val, setter, placeholder]) => (
          <div key={label} className="form-group" style={{ marginBottom: 14 }}>
            <label className="form-label">{label} <span style={{ color: 'var(--red, #ef4444)' }}>*</span></label>
            <input className="form-control" value={val} onChange={e => setter(e.target.value)} placeholder={placeholder} />
          </div>
        ))}
        <div className="form-group" style={{ marginBottom: 14 }}>
          <label className="form-label">Applicable Grade <span style={{ color: 'var(--red, #ef4444)' }}>*</span></label>
          <select className="form-control" value={byGrade} onChange={e => setByGrade(e.target.value)}>
            <option value="">-- Select Grade --</option>
            <option value="All">All Grades</option>
            {['G1','G2','G3','G4','G5'].map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Amount <span style={{ color: 'var(--red, #ef4444)' }}>*</span></label>
            <input type="number" className="form-control" value={byAmt} onChange={e => setByAmt(e.target.value)} placeholder="e.g. 500" />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Unit <span style={{ color: 'var(--red, #ef4444)' }}>*</span></label>
            <select className="form-control" value={byUnit} onChange={e => setByUnit(e.target.value)}>
              <option value="">-- Select Unit --</option>
              <option value="month">₹/month</option>
              <option value="day">₹/day</option>
              <option value="year">₹/year</option>
            </select>
          </div>
        </div>
        <ModalError msg={byErr} />
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button className="btn btn-outline btn-sm" onClick={() => setByodModal(false)}>Cancel</button>
          <button className="btn btn-primary btn-sm" onClick={confirmByod}><i className="ri-check-line"></i> Add Entry</button>
        </div>
      </Modal>

      {/* Fuel Modal */}
      <Modal open={fuelModal} onClose={() => setFuelModal(false)} title={<><i className="ri-add-circle-line" style={{ color: 'var(--accent)', marginRight: 8 }}></i>Add Fuel Rate Row</>}>
        <div className="form-group" style={{ marginBottom: 14 }}>
          <label className="form-label">Grade / Range Label <span style={{ color: 'var(--red, #ef4444)' }}>*</span></label>
          <input className="form-control" value={fmRange} onChange={e => setFmRange(e.target.value)} placeholder="e.g. G1-G2" style={{ fontWeight: 700, textTransform: 'uppercase' }} />
        </div>
        <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, padding: 14, marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', marginBottom: 10 }}><i className="ri-fuel-line"></i> FUEL RATES</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">2-Wheeler ₹/L <small style={{ color: 'var(--text-muted)' }}>(0 = N/A)</small></label>
              <input type="number" className="form-control" value={fm2w} onChange={e => setFm2w(e.target.value)} placeholder="e.g. 90" step="0.5" />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">4-Wheeler ₹/L <small style={{ color: 'var(--text-muted)' }}>(0 = N/A)</small></label>
              <input type="number" className="form-control" value={fm4w} onChange={e => setFm4w(e.target.value)} placeholder="e.g. 100" step="0.5" />
            </div>
          </div>
        </div>
        <div className="form-group" style={{ marginBottom: 16 }}>
          <label className="form-label">Monthly Fuel Limit ₹ <span style={{ color: 'var(--red, #ef4444)' }}>*</span></label>
          <input type="number" className="form-control" value={fmLimit} onChange={e => setFmLimit(e.target.value)} placeholder="e.g. 4000" />
        </div>
        <ModalError msg={fmErr} />
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button className="btn btn-outline btn-sm" onClick={() => setFuelModal(false)}>Cancel</button>
          <button className="btn btn-primary btn-sm" onClick={confirmFuel}><i className="ri-check-line"></i> Add Row</button>
        </div>
      </Modal>

      {/* Auto-Approve Rule Modal */}
      <Modal open={arModal} onClose={() => setArModal(false)} title={<><i className="ri-add-circle-line" style={{ color: 'var(--accent)', marginRight: 8 }}></i>{arEdit !== null ? 'Edit' : 'Add'} Auto-Approval Rule</>} width={520}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, alignItems: 'end', marginBottom: 14 }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Category Name <span style={{ color: 'var(--red, #ef4444)' }}>*</span></label>
            <input className="form-control" value={arCat} onChange={e => setArCat(e.target.value)} placeholder="e.g. Travel (TA)" />
          </div>
          <div style={{ textAlign: 'center', paddingBottom: 2 }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6, fontWeight: 600 }}>APPROVAL MODE</div>
            <AutoTogglePill on={arAuto} onChange={() => setArAuto(v => !v)} />
          </div>
        </div>
        <div className="form-group" style={{ marginBottom: 14 }}>
          <label className="form-label">Description <span style={{ color: 'var(--red, #ef4444)' }}>*</span></label>
          <input className="form-control" value={arDesc} onChange={e => setArDesc(e.target.value)} placeholder="e.g. Auto-approve if GPS path ≈ Odometer reading" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Condition <span style={{ color: 'var(--red, #ef4444)' }}>*</span></label>
            <input className="form-control" value={arCond} onChange={e => setArCond(e.target.value)} placeholder="e.g. Path ≈ Odometer" />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Threshold <span style={{ color: 'var(--red, #ef4444)' }}>*</span></label>
            <input className="form-control" value={arThresh} onChange={e => setArThresh(e.target.value)} placeholder="e.g. ±5% variance" />
          </div>
        </div>
        <ModalError msg={arErr} />
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button className="btn btn-outline btn-sm" onClick={() => setArModal(false)}>Cancel</button>
          <button className="btn btn-primary btn-sm" onClick={confirmArRule}><i className="ri-check-line"></i> {arEdit !== null ? 'Update' : 'Add'} Rule</button>
        </div>
      </Modal>

      {/* Anti-Fraud Rule Modal */}
      <Modal open={frModal} onClose={() => setFrModal(false)} title={<><i className="ri-add-circle-line" style={{ color: 'var(--accent)', marginRight: 8 }}></i>Add Anti-Fraud Rule</>}>
        <div className="form-group" style={{ marginBottom: 14 }}>
          <label className="form-label">Rule Description <span style={{ color: 'var(--red, #ef4444)' }}>*</span></label>
          <input className="form-control" value={frDesc} onChange={e => setFrDesc(e.target.value)} placeholder="e.g. Flag if Expense Pin > radius from Activity" />
        </div>
        <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, padding: 14, marginBottom: 16 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
            <input type="checkbox" checked={frEnabled} onChange={() => setFrEnabled(v => !v)} />
            <span style={{ fontSize: 12, fontWeight: 600 }}>Enable this anti-fraud rule</span>
          </label>
        </div>
        <ModalError msg={frErr} />
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button className="btn btn-outline btn-sm" onClick={() => setFrModal(false)}>Cancel</button>
          <button className="btn btn-primary btn-sm" onClick={confirmFrRule}><i className="ri-check-line"></i> Add Rule</button>
        </div>
      </Modal>

    </AppShell>
  );
}
