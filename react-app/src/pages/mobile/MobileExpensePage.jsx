import React, { useState } from 'react';
import MobileShell from '../../components/layout/MobileShell.jsx';
import { useToast } from '../../contexts/ToastContext.jsx';

const CATEGORIES = [
  { key: 'food',   label: 'Food/Meal',  icon: 'ri-restaurant-line',  color: '#f59e0b' },
  { key: 'travel', label: 'Travel TA',  icon: 'ri-road-map-line',     color: '#3b82f6' },
  { key: 'toll',   label: 'Toll',       icon: 'ri-road-line',         color: '#8b5cf6' },
  { key: 'hotel',  label: 'Night Halt', icon: 'ri-hotel-line',        color: '#ec4899' },
  { key: 'misc',   label: 'Misc',       icon: 'ri-more-2-line',       color: '#64748b' },
];

const MEAL_LIMIT = 350;

const initForm = () => ({
  // food
  amount: '',
  vendorName: '',
  // travel
  fromLocation: '',
  toLocation: '',
  distanceKm: '',
  vehicle: '2W',
  purpose: '',
  // toll
  highway: '',
  // hotel
  hotelName: '',
  checkInDate: '',
  // misc
  description: '',
  // shared
  note: '',
  photoCaptured: false,
});

export default function MobileExpensePage() {
  const { show } = useToast();
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState(null);
  const [form, setForm] = useState(initForm());
  const [submitted, setSubmitted] = useState(false);

  const cat = CATEGORIES.find(c => c.key === category);
  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const handlePhoto = (e) => { if (e.target.files?.[0]) set('photoCaptured', true); };

  const isMeal = category === 'food';
  const isTravel = category === 'travel';
  const isToll = category === 'toll';
  const isHotel = category === 'hotel';

  const amountNum = parseFloat(form.amount) || 0;
  const mealExceeded = isMeal && amountNum > MEAL_LIMIT && amountNum > 0;

  const canProceed = () => {
    if (isTravel) return form.fromLocation && form.toLocation && form.distanceKm;
    if (isHotel) return form.hotelName && form.amount;
    if (category === 'misc') return form.description && form.amount;
    return form.amount;
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const label = isTravel ? `${form.distanceKm} km TA` : `₹${form.amount} ${cat?.label}`;
    show(`✓ ${label} submitted! GPS-pinned · Under review.`, 'success');
  };

  const reset = () => { setStep(1); setCategory(null); setForm(initForm()); setSubmitted(false); };

  /* ── Success screen ── */
  if (submitted) {
    return (
      <MobileShell>
        <div style={{ padding: '80px 24px 24px', textAlign: 'center' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(0,212,170,0.15)', border: '2px solid var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, margin: '0 auto 20px' }}>✓</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--accent)', marginBottom: 8 }}>Submitted!</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 32, lineHeight: 1.6 }}>
            {isTravel
              ? `Travel TA for ${form.distanceKm} km — pending approval`
              : `₹${form.amount} ${cat?.label} — GPS pinned · pending review`}
          </div>
          <button onClick={reset} style={{ display: 'block', width: '100%', padding: 16, background: 'var(--accent)', color: '#0a1628', border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
            <i className="ri-add-line"></i> Add Another Expense
          </button>
        </div>
      </MobileShell>
    );
  }

  return (
    <MobileShell>
      {/* Header */}
      <div style={{ padding: '60px 16px 10px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ fontSize: 16, fontWeight: 700, flex: 1 }}>Add Expense</div>
        <span className="badge badge-green" style={{ fontSize: 11 }}><i className="ri-map-pin-line"></i> GPS Pinned</span>
      </div>

      {/* Step bar */}
      <div style={{ display: 'flex', gap: 4, padding: '0 16px', marginBottom: 14 }}>
        {[1, 2, 3].map(s => (
          <div key={s} style={{ flex: 1, height: 3, borderRadius: 2, background: step >= s ? 'var(--accent)' : 'var(--border)', transition: 'background 0.2s' }}></div>
        ))}
      </div>

      {/* ── STEP 1: Pick category ── */}
      {step === 1 && (
        <div style={{ padding: '0 16px 24px' }}>
          <div style={{ padding: '8px 12px', background: 'rgba(0,212,170,0.08)', border: '1px solid rgba(0,212,170,0.25)', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
            <i className="ri-checkbox-circle-fill" style={{ color: 'var(--accent)', fontSize: 15 }}></i>
            <span style={{ fontSize: 12 }}>Attendance marked · Clocked in at 9:02 AM</span>
          </div>

          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 12 }}>Select Expense Type</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat.key}
                onClick={() => { setCategory(cat.key); setStep(2); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '14px 16px', borderRadius: 14, cursor: 'pointer', textAlign: 'left',
                  border: `1.5px solid var(--border)`,
                  background: 'var(--card)',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = cat.color; e.currentTarget.style.background = `${cat.color}10`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--card)'; }}
              >
                <div style={{ width: 42, height: 42, borderRadius: 12, background: `${cat.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: cat.color, flexShrink: 0 }}>
                  <i className={cat.icon}></i>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>{cat.label}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    {cat.key === 'food'   && 'Meal, snacks, client lunch — receipt required'}
                    {cat.key === 'travel' && 'Distance-based TA — from/to + km entry'}
                    {cat.key === 'toll'   && 'Highway toll, bridge, parking — receipt required'}
                    {cat.key === 'hotel'  && 'Overnight stay — hotel name + receipt'}
                    {cat.key === 'misc'   && 'Other business expenses — description required'}
                  </div>
                </div>
                <i className="ri-arrow-right-s-line" style={{ fontSize: 18, color: 'var(--text-muted)' }}></i>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── STEP 2: Category-specific form ── */}
      {step === 2 && cat && (
        <div style={{ padding: '0 16px 24px' }}>
          {/* Category header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18, padding: '10px 14px', background: `${cat.color}12`, border: `1px solid ${cat.color}30`, borderRadius: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: `${cat.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: cat.color, flexShrink: 0 }}>
              <i className={cat.icon}></i>
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{cat.label}</div>
              <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: 11, cursor: 'pointer', padding: 0 }}>Change category</button>
            </div>
          </div>

          {/* ─ FOOD/MEAL fields ─ */}
          {isMeal && (
            <>
              <PhotoCapture label="Bill Photo" captured={form.photoCaptured} onChange={handlePhoto} />
              <AmountField value={form.amount} onChange={v => set('amount', v)} warning={mealExceeded ? `Exceeds G3 meal limit of ₹${MEAL_LIMIT} — needs manual review` : null} hint={!mealExceeded && amountNum > 0 ? `Within G3 meal limit of ₹${MEAL_LIMIT}` : null} />
              <TextField label="Vendor / Restaurant (optional)" placeholder="e.g. Café Mumbai Express" value={form.vendorName} onChange={v => set('vendorName', v)} />
              <TextField label="Notes (optional)" placeholder="e.g. Client lunch — Zomato team" value={form.note} onChange={v => set('note', v)} />
            </>
          )}

          {/* ─ TRAVEL TA fields ─ */}
          {isTravel && (
            <>
              <TextField label="From" placeholder="e.g. Andheri East, Mumbai" value={form.fromLocation} onChange={v => set('fromLocation', v)} icon="ri-map-pin-line" />
              <TextField label="To" placeholder="e.g. Thane West, Mumbai" value={form.toLocation} onChange={v => set('toLocation', v)} icon="ri-map-pin-2-fill" iconColor="var(--accent)" />
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>Distance Travelled</div>
                <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input
                    type="number"
                    placeholder="0"
                    value={form.distanceKm}
                    onChange={e => set('distanceKm', e.target.value)}
                    style={{ flex: 1, fontSize: 22, fontWeight: 800, background: 'none', border: 'none', borderBottom: '2px solid var(--border)', outline: 'none', color: 'var(--text)' }}
                  />
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-muted)' }}>km</span>
                </div>
                {form.distanceKm > 0 && (
                  <div style={{ marginTop: 6, fontSize: 11, color: 'var(--text-muted)' }}>
                    <i className="ri-information-line"></i> TA rate applied at reimbursement based on grade &amp; vehicle
                  </div>
                )}
              </div>
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>Vehicle Used</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {['2W', '4W', 'Taxi'].map(v => (
                    <button key={v} onClick={() => set('vehicle', v)} style={{ flex: 1, padding: '10px 0', borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: `1.5px solid ${form.vehicle === v ? 'var(--accent)' : 'var(--border)'}`, background: form.vehicle === v ? 'rgba(0,212,170,0.1)' : 'var(--bg)', color: form.vehicle === v ? 'var(--accent)' : 'var(--text-muted)' }}>
                      {v}
                    </button>
                  ))}
                </div>
              </div>
              <TextField label="Purpose (optional)" placeholder="e.g. Client visit — Zomato HQ" value={form.purpose} onChange={v => set('purpose', v)} />
            </>
          )}

          {/* ─ TOLL fields ─ */}
          {isToll && (
            <>
              <PhotoCapture label="Toll Receipt" captured={form.photoCaptured} onChange={handlePhoto} />
              <AmountField value={form.amount} onChange={v => set('amount', v)} />
              <TextField label="Highway / Route (optional)" placeholder="e.g. Western Express Highway" value={form.highway} onChange={v => set('highway', v)} icon="ri-road-line" />
            </>
          )}

          {/* ─ NIGHT HALT fields ─ */}
          {isHotel && (
            <>
              <PhotoCapture label="Hotel Bill" captured={form.photoCaptured} onChange={handlePhoto} />
              <TextField label="Hotel Name" placeholder="e.g. Taj Lands End, Mumbai" value={form.hotelName} onChange={v => set('hotelName', v)} icon="ri-hotel-line" />
              <AmountField value={form.amount} onChange={v => set('amount', v)} />
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>Check-in Date</div>
                <input
                  type="date"
                  value={form.checkInDate}
                  onChange={e => set('checkInDate', e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--card)', color: 'var(--text)', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
            </>
          )}

          {/* ─ MISC fields ─ */}
          {category === 'misc' && (
            <>
              <PhotoCapture label="Supporting Document (optional)" captured={form.photoCaptured} onChange={handlePhoto} required={false} />
              <TextField label="What is this expense for?" placeholder="e.g. Office stationery, internet bill…" value={form.description} onChange={v => set('description', v)} />
              <AmountField value={form.amount} onChange={v => set('amount', v)} />
            </>
          )}

          {/* Geo tag — always shown */}
          <div style={{ marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: '10px 14px' }}>
            <i className="ri-map-pin-fill" style={{ color: '#3b82f6', fontSize: 18 }}></i>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600 }}>Auto Geo-Tagged</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Pinned to current GPS location</div>
            </div>
            <span className="badge badge-green" style={{ fontSize: 10 }}><i className="ri-check-line"></i> Valid</span>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => setStep(1)} style={{ flex: 1, padding: 14, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, color: 'var(--text)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Back</button>
            <button
              onClick={() => canProceed() && setStep(3)}
              style={{ flex: 2, padding: 14, background: canProceed() ? 'var(--accent)' : 'var(--border)', border: 'none', borderRadius: 12, color: canProceed() ? '#0a1628' : 'var(--text-muted)', fontSize: 13, fontWeight: 700, cursor: canProceed() ? 'pointer' : 'not-allowed', transition: 'all 0.15s' }}
            >
              Review →
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 3: Review & Submit ── */}
      {step === 3 && cat && (
        <div style={{ padding: '0 16px 24px' }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Review &amp; Submit</div>

          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden', marginBottom: 14 }}>
            {buildReviewRows(category, form, cat).map(([label, value, flag], i, arr) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{label}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: flag ? 'var(--amber)' : 'var(--text)' }}>{value}</span>
              </div>
            ))}
          </div>

          {/* Validation */}
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 12, marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>Auto-Validation</div>
            {buildValidation(category, form, mealExceeded).map((c, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, marginBottom: 5 }}>
                <i className={c.pass ? 'ri-checkbox-circle-fill' : 'ri-close-circle-fill'} style={{ color: c.pass ? 'var(--green)' : 'var(--red)' }}></i>
                <span style={{ color: c.pass ? 'var(--text)' : 'var(--red)' }}>{c.text}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => setStep(2)} style={{ flex: 1, padding: 14, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, color: 'var(--text)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Edit</button>
            <button onClick={handleSubmit} style={{ flex: 2, padding: 16, background: 'var(--accent)', border: 'none', borderRadius: 14, color: '#0a1628', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
              <i className="ri-send-plane-fill"></i> Submit
            </button>
          </div>
        </div>
      )}
    </MobileShell>
  );
}

/* ── Small reusable sub-components ── */

function PhotoCapture({ label, captured, onChange, required = true }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>
        <i className="ri-camera-2-line" style={{ marginRight: 4 }}></i>{label}{required && ' *'}
      </div>
      <label style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '14px 16px', borderRadius: 14, cursor: 'pointer',
        border: `1.5px ${captured ? 'solid var(--accent)' : 'dashed rgba(0,212,170,0.4)'}`,
        background: captured ? 'rgba(0,212,170,0.06)' : 'var(--bg)',
      }}>
        <input type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={onChange} />
        <div style={{ width: 40, height: 40, borderRadius: 10, background: captured ? 'rgba(0,212,170,0.15)' : 'rgba(100,116,139,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: captured ? 'var(--accent)' : 'var(--text-muted)', flexShrink: 0 }}>
          <i className={captured ? 'ri-checkbox-circle-fill' : 'ri-camera-2-line'}></i>
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: captured ? 'var(--accent)' : 'var(--text)' }}>
            {captured ? 'Photo captured' : 'Tap to capture'}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
            {captured ? 'GPS-tagged · Proof recorded' : 'Camera only · GPS auto-tagged'}
          </div>
        </div>
      </label>
    </div>
  );
}

function AmountField({ value, onChange, warning, hint }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>Amount</div>
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: '10px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 22, fontWeight: 800, color: 'var(--accent)' }}>₹</span>
          <input
            type="number"
            placeholder="0"
            value={value}
            onChange={e => onChange(e.target.value)}
            style={{ flex: 1, fontSize: 26, fontWeight: 800, background: 'none', border: 'none', borderBottom: `2px solid ${warning ? 'var(--red)' : 'var(--border)'}`, outline: 'none', color: 'var(--text)' }}
          />
        </div>
        {warning && <div style={{ marginTop: 6, fontSize: 11, color: 'var(--red)', display: 'flex', alignItems: 'center', gap: 4 }}><i className="ri-alert-line"></i>{warning}</div>}
        {hint && <div style={{ marginTop: 6, fontSize: 11, color: 'var(--green)', display: 'flex', alignItems: 'center', gap: 4 }}><i className="ri-checkbox-circle-fill"></i>{hint}</div>}
      </div>
    </div>
  );
}

function TextField({ label, placeholder, value, onChange, icon, iconColor }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: '10px 14px' }}>
        {icon && <i className={icon} style={{ color: iconColor || 'var(--text-muted)', fontSize: 16, flexShrink: 0 }}></i>}
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{ flex: 1, fontSize: 13, background: 'none', border: 'none', outline: 'none', color: 'var(--text)' }}
        />
      </div>
    </div>
  );
}

/* ── Review row builder ── */
function buildReviewRows(category, form, cat) {
  const rows = [['Type', cat.label]];
  if (category === 'food') {
    rows.push(['Amount', form.amount ? `₹${form.amount}` : '—']);
    if (form.vendorName) rows.push(['Vendor', form.vendorName]);
    rows.push(['Receipt', form.photoCaptured ? '✓ Captured' : '✕ Not captured', !form.photoCaptured]);
  } else if (category === 'travel') {
    rows.push(['From', form.fromLocation || '—']);
    rows.push(['To', form.toLocation || '—']);
    rows.push(['Distance', form.distanceKm ? `${form.distanceKm} km` : '—']);
    rows.push(['Vehicle', form.vehicle]);
    if (form.purpose) rows.push(['Purpose', form.purpose]);
    rows.push(['TA Rate', 'Applied at reimbursement per grade']);
  } else if (category === 'toll') {
    rows.push(['Amount', form.amount ? `₹${form.amount}` : '—']);
    if (form.highway) rows.push(['Route', form.highway]);
    rows.push(['Receipt', form.photoCaptured ? '✓ Captured' : '✕ Not captured', !form.photoCaptured]);
  } else if (category === 'hotel') {
    rows.push(['Hotel', form.hotelName || '—']);
    rows.push(['Amount', form.amount ? `₹${form.amount}` : '—']);
    if (form.checkInDate) rows.push(['Check-in', form.checkInDate]);
    rows.push(['Bill', form.photoCaptured ? '✓ Captured' : '✕ Not captured', !form.photoCaptured]);
  } else {
    rows.push(['Description', form.description || '—']);
    rows.push(['Amount', form.amount ? `₹${form.amount}` : '—']);
    if (form.photoCaptured) rows.push(['Document', '✓ Captured']);
  }
  rows.push(['Location', 'Andheri East · GPS pinned']);
  if (form.note) rows.push(['Notes', form.note]);
  return rows;
}

/* ── Validation builder ── */
function buildValidation(category, form, mealExceeded) {
  const checks = [
    { pass: true, text: 'Attendance marked for today' },
    { pass: true, text: 'GPS pin within 500m of activity' },
  ];
  if (category !== 'travel' && category !== 'misc') {
    checks.push({ pass: form.photoCaptured, text: form.photoCaptured ? 'Receipt captured' : 'Receipt not captured' });
  }
  if (category === 'food') {
    checks.push({ pass: !mealExceeded, text: mealExceeded ? 'Exceeds grade meal limit — needs review' : 'Within grade meal limit' });
  }
  if (category === 'travel') {
    checks.push({ pass: !!(form.fromLocation && form.toLocation), text: 'Route details provided' });
    checks.push({ pass: !!form.distanceKm, text: 'Distance entered' });
  }
  return checks;
}
