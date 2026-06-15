import React, { useState, useEffect } from 'react';
import MobileShell from '../../components/layout/MobileShell.jsx';
import { useToast } from '../../contexts/ToastContext.jsx';

const CATEGORIES = [
  { key: 'food',   label: 'Food/Meal',  icon: 'ri-restaurant-line' },
  { key: 'travel', label: 'Travel TA',  icon: 'ri-road-map-line' },
  { key: 'toll',   label: 'Toll',       icon: 'ri-road-line' },
  { key: 'hotel',  label: 'Night Halt', icon: 'ri-hotel-line' },
  { key: 'misc',   label: 'Misc',       icon: 'ri-more-2-line' },
];

const MEAL_LIMIT = 350;

export default function MobileExpensePage() {
  const { show } = useToast();
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState('food');
  const [amount, setAmount] = useState('280');
  const [note, setNote] = useState('');
  const [photoCaptured, setPhotoCaptured] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const isMeal = category === 'food';
  const amountNum = parseFloat(amount) || 0;
  const limitExceeded = isMeal && amountNum > MEAL_LIMIT;

  const handlePhoto = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPhotoCaptured(true);
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
    show(`✓ Expense submitted! Auto-approved ₹${amount} — Pinned to Zomato HQ.`, 'success');
  };

  const reset = () => { setStep(1); setCategory('food'); setAmount(''); setNote(''); setPhotoCaptured(false); setSubmitted(false); };

  if (submitted) {
    return (
      <MobileShell>
        <div style={{ padding: '60px 16px 16px' }}>
          <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>Add Expense</div>
        </div>
        <div style={{ padding: 24, textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--accent)', marginBottom: 8 }}>Expense Submitted!</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 }}>
            Auto-approved ₹{amount} — Pinned to Zomato HQ
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
      {/* Top Bar */}
      <div style={{ padding: '60px 16px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ fontSize: 16, fontWeight: 700, flex: 1 }}>Add Expense</div>
        <span className="badge badge-green" style={{ fontSize: 11 }}><i className="ri-map-pin-line"></i> GPS Pinned</span>
      </div>

      {/* Step indicator */}
      <div style={{ display: 'flex', gap: 6, padding: '0 16px', marginBottom: 10 }}>
        {[1, 2, 3].map(s => (
          <div key={s} style={{ flex: 1, height: 4, borderRadius: 2, background: step >= s ? 'var(--accent)' : 'var(--border)' }}></div>
        ))}
      </div>

      {/* ── STEP 1: Category ── */}
      {step === 1 && (
        <div style={{ padding: '0 0 24px' }}>
          {/* Attendance banner */}
          <div style={{ margin: '0 16px 12px', padding: '10px 12px', background: 'rgba(0,212,170,0.08)', border: '1px solid rgba(0,212,170,0.3)', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
            <i className="ri-checkbox-circle-fill" style={{ color: 'var(--accent)', fontSize: 16 }}></i>
            <span style={{ fontSize: 12 }}>Attendance marked · Clocked in at 9:02 AM</span>
          </div>

          <div style={{ padding: '0 16px', marginBottom: 6 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Expense Category</div>
          </div>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '0 16px 12px', scrollbarWidth: 'none' }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat.key}
                onClick={() => { setCategory(cat.key); setStep(2); }}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                  minWidth: 64, padding: '10px 6px', borderRadius: 12, flexShrink: 0,
                  border: `2px solid ${category === cat.key ? 'var(--accent)' : 'var(--border)'}`,
                  background: category === cat.key ? 'rgba(0,212,170,0.1)' : 'var(--bg)',
                  cursor: 'pointer',
                }}
              >
                <i className={cat.icon} style={{ fontSize: 22, color: category === cat.key ? 'var(--accent)' : 'var(--text-muted)' }}></i>
                <span style={{ fontSize: 10, fontWeight: 600, color: category === cat.key ? 'var(--accent)' : 'var(--text-muted)', whiteSpace: 'nowrap' }}>{cat.label}</span>
              </button>
            ))}
          </div>
          <div style={{ padding: '0 16px', marginTop: 8 }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Select a category to continue →</div>
          </div>
        </div>
      )}

      {/* ── STEP 2: Details ── */}
      {step === 2 && (
        <div style={{ padding: '0 0 24px' }}>
          {/* Attendance banner */}
          <div style={{ margin: '0 16px 12px', padding: '10px 12px', background: 'rgba(0,212,170,0.08)', border: '1px solid rgba(0,212,170,0.3)', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
            <i className="ri-checkbox-circle-fill" style={{ color: 'var(--accent)', fontSize: 16 }}></i>
            <span style={{ fontSize: 12 }}>Attendance marked · Clocked in at 9:02 AM</span>
          </div>

          {/* Selected category chips */}
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '0 16px 12px', scrollbarWidth: 'none' }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat.key}
                onClick={() => setCategory(cat.key)}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                  minWidth: 64, padding: '10px 6px', borderRadius: 12, flexShrink: 0,
                  border: `2px solid ${category === cat.key ? 'var(--accent)' : 'var(--border)'}`,
                  background: category === cat.key ? 'rgba(0,212,170,0.1)' : 'var(--bg)',
                  cursor: 'pointer',
                }}
              >
                <i className={cat.icon} style={{ fontSize: 22, color: category === cat.key ? 'var(--accent)' : 'var(--text-muted)' }}></i>
                <span style={{ fontSize: 10, fontWeight: 600, color: category === cat.key ? 'var(--accent)' : 'var(--text-muted)', whiteSpace: 'nowrap' }}>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Camera zone (not for travel) */}
          {category !== 'travel' && (
            <>
              <div style={{ padding: '0 16px', marginBottom: 6 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>📷 Bill Photo (Live Camera Only)</div>
              </div>
              <label style={{
                margin: '0 16px 14px', height: 160, borderRadius: 16,
                background: 'linear-gradient(135deg,#0a1628,#16213e)',
                border: `2px ${photoCaptured ? 'solid' : 'dashed'} ${photoCaptured ? 'var(--accent)' : 'rgba(0,212,170,0.4)'}`,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
              }}>
                <input type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={handlePhoto} />
                {photoCaptured ? (
                  <>
                    <i className="ri-checkbox-circle-fill" style={{ fontSize: 40, color: 'var(--accent)', marginBottom: 10 }}></i>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)' }}>📸 Photo Captured!</div>
                  </>
                ) : (
                  <>
                    <i className="ri-camera-2-line" style={{ fontSize: 40, color: 'rgba(0,212,170,0.6)', marginBottom: 10 }}></i>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#8b9dc3' }}>Tap to Capture Bill</div>
                    <div style={{ fontSize: 11, color: '#4a5568', marginTop: 4 }}>Gallery uploads not allowed · GPS auto-tagged</div>
                  </>
                )}
              </label>
            </>
          )}

          {/* Amount input */}
          <div style={{ margin: '0 16px 14px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Amount</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
              <span style={{ fontSize: 24, fontWeight: 800, color: 'var(--accent)' }}>₹</span>
              <input
                type="number"
                value={amount}
                placeholder="0"
                onChange={e => setAmount(e.target.value)}
                style={{ fontSize: 28, fontWeight: 800, background: 'none', border: 'none', borderBottom: `2px solid ${limitExceeded ? 'var(--red)' : 'var(--border)'}`, color: 'var(--text)', outline: 'none', width: '100%' }}
              />
            </div>
            {isMeal && amountNum > 0 && (
              <div style={{ marginTop: 8, fontSize: 11, color: limitExceeded ? 'var(--red)' : 'var(--green)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <i className={limitExceeded ? 'ri-alert-line' : 'ri-checkbox-circle-fill'}></i>
                {limitExceeded
                  ? 'Exceeds G3 meal limit of ₹350 — will require manual review'
                  : 'Within G3 meal limit of ₹350'}
              </div>
            )}
          </div>

          {/* Geo Tag */}
          <div style={{ margin: '0 16px 14px', display: 'flex', alignItems: 'center', gap: 10, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(59,130,246,0.15)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
              <i className="ri-map-pin-fill"></i>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600 }}>Auto Geo-Tagged</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Pinned to current GPS location</div>
            </div>
            <span className="badge badge-green" style={{ fontSize: 10 }}><i className="ri-check-line"></i> Valid</span>
          </div>

          {/* Auto-Validation checklist */}
          <div style={{ margin: '0 16px 14px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>Auto-Validation</div>
            {[
              { pass: true,          text: 'Attendance marked for today' },
              { pass: true,          text: 'Expense pin within 500m of activity' },
              { pass: photoCaptured, text: photoCaptured ? 'Receipt captured via live camera' : 'Receipt capture pending' },
              { pass: !limitExceeded, text: limitExceeded ? 'Amount exceeds grade meal limit' : 'Amount within grade meal limit' },
            ].map((c, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, marginBottom: 6, color: c.pass ? 'var(--green)' : 'var(--red)' }}>
                <i className={c.pass ? 'ri-checkbox-circle-fill' : (c.text.includes('pending') ? 'ri-time-line' : 'ri-close-circle-fill')} style={{ color: c.pass ? 'var(--green)' : (c.text.includes('pending') ? 'var(--text-muted)' : 'var(--red)') }}></i>
                <span style={{ color: c.pass ? 'var(--text)' : (c.text.includes('pending') ? 'var(--text-muted)' : 'var(--red)') }}>{c.text}</span>
              </div>
            ))}
          </div>

          {/* Notes */}
          <div style={{ padding: '0 16px', marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6 }}>Notes (Optional)</div>
            <textarea
              className="form-control"
              rows={2}
              placeholder="e.g., Lunch with client Zomato team"
              value={note}
              onChange={e => setNote(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: 10, padding: '0 16px' }}>
            <button onClick={() => setStep(1)} style={{ flex: 1, padding: 14, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, color: 'var(--text)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Back</button>
            <button onClick={() => setStep(3)} style={{ flex: 2, padding: 14, background: 'var(--accent)', border: 'none', borderRadius: 12, color: '#0a1628', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Review →</button>
          </div>
        </div>
      )}

      {/* ── STEP 3: Review & Submit ── */}
      {step === 3 && (
        <div style={{ padding: '0 0 24px' }}>
          <div style={{ padding: '0 16px', marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Review & Submit</div>
          </div>

          <div style={{ margin: '0 16px 14px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
            {[
              ['Category', CATEGORIES.find(c => c.key === category)?.label || category],
              ['Amount', `₹${amount}`],
              ['Receipt', photoCaptured ? '✓ Photo captured' : '✕ Not captured'],
              ['Location', 'Zomato HQ Area, Andheri E · GPS pinned'],
              ['Notes', note || '—'],
            ].map(([label, value], i, arr) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 14px', borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{label}</span>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{value}</span>
              </div>
            ))}
          </div>

          {/* Validation summary */}
          <div style={{ margin: '0 16px 14px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>Auto-Validation</div>
            {[
              { pass: true,          text: 'Attendance marked for today' },
              { pass: true,          text: 'Expense pin within 500m of activity' },
              { pass: photoCaptured, text: photoCaptured ? 'Receipt captured via live camera' : 'Receipt capture pending' },
              { pass: !limitExceeded, text: limitExceeded ? 'Amount exceeds grade meal limit' : 'Amount within grade meal limit' },
            ].map((c, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, marginBottom: 6 }}>
                <i className={c.pass ? 'ri-checkbox-circle-fill' : 'ri-close-circle-fill'} style={{ color: c.pass ? 'var(--green)' : 'var(--red)' }}></i>
                <span style={{ color: c.pass ? 'var(--text)' : 'var(--red)' }}>{c.text}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 10, padding: '0 16px' }}>
            <button onClick={() => setStep(2)} style={{ flex: 1, padding: 14, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, color: 'var(--text)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Edit</button>
            <button onClick={handleSubmit} style={{ flex: 2, padding: 16, background: 'var(--accent)', border: 'none', borderRadius: 14, color: '#0a1628', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
              <i className="ri-send-plane-fill"></i> Submit Expense
            </button>
          </div>
        </div>
      )}
    </MobileShell>
  );
}
