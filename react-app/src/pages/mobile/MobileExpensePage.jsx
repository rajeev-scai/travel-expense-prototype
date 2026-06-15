import React, { useState } from 'react';
import MobileShell from '../../components/layout/MobileShell.jsx';
import { useToast } from '../../contexts/ToastContext.jsx';
import { Fmt } from '../../utils/fmt.js';

const CATEGORIES = ['Travel (TA)', 'Food/Meals', 'Fuel', 'Night Halt', 'Toll', 'Parking', 'BYOD Internet', 'Miscellaneous'];
const CAT_ICONS = { 'Travel (TA)': 'ri-car-line', 'Food/Meals': 'ri-restaurant-line', 'Fuel': 'ri-gas-station-line', 'Night Halt': 'ri-hotel-line', 'Toll': 'ri-road-map-line', 'Parking': 'ri-parking-box-line', 'BYOD Internet': 'ri-wifi-line', 'Miscellaneous': 'ri-more-2-line' };

export default function MobileExpensePage() {
  const { show } = useToast();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ category: '', amount: '', note: '', date: new Date().toISOString().slice(0, 10), receiptFile: null });
  const [submitted, setSubmitted] = useState(false);

  const setField = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = () => {
    if (!form.category || !form.amount) { show('Please fill all required fields.', 'warning'); return; }
    setSubmitted(true);
    show(`✓ ${form.category} expense ₹${form.amount} submitted!`, 'success');
  };

  const reset = () => { setForm({ category: '', amount: '', note: '', date: new Date().toISOString().slice(0, 10), receiptFile: null }); setStep(1); setSubmitted(false); };

  return (
    <MobileShell>
      <div style={{ padding: '60px 16px 16px', background: 'linear-gradient(180deg, var(--bg2) 0%, var(--bg) 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ fontSize: 18, fontWeight: 800 }}><i className="ri-camera-line" style={{ color: 'var(--accent)', marginRight: 8 }}></i>Add Expense</div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
            {[1, 2, 3].map(s => (
              <div key={s} style={{ width: 24, height: 4, borderRadius: 2, background: step >= s ? 'var(--accent)' : 'var(--border)' }}></div>
            ))}
          </div>
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
          {step === 1 ? 'Select category' : step === 2 ? 'Enter details & attach receipt' : 'Review & submit'}
        </div>
      </div>

      {submitted ? (
        <div style={{ padding: 24, textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--accent)', marginBottom: 8 }}>Expense Submitted!</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 }}>
            {form.category} · {Fmt.currency(Number(form.amount))} · {form.date}<br />
            <span className="badge badge-amber" style={{ marginTop: 8 }}>Pending Approval</span>
          </div>
          <div style={{ background: 'rgba(0,212,170,0.1)', border: '1px solid rgba(0,212,170,0.3)', borderRadius: 12, padding: 14, marginBottom: 20, fontSize: 12, color: 'var(--accent)' }}>
            <i className="ri-robot-line" style={{ marginRight: 6 }}></i>Rule engine analysing… Auto-approval expected in ~30 seconds
          </div>
          <button onClick={reset} className="btn btn-primary" style={{ width: '100%', padding: 14 }}>
            <i className="ri-add-line"></i> Add Another Expense
          </button>
        </div>
      ) : (
        <>
          {/* Step 1: Category */}
          {step === 1 && (
            <div style={{ padding: '16px 16px 24px' }}>
              <div style={{ fontWeight: 600, marginBottom: 12, fontSize: 13 }}>Choose Category</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {CATEGORIES.map(cat => (
                  <button key={cat} onClick={() => { setField('category', cat); setStep(2); }} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', background: form.category === cat ? 'rgba(0,212,170,0.1)' : 'var(--card)', border: `1px solid ${form.category === cat ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 12, cursor: 'pointer', color: 'var(--text)', textAlign: 'left' }}>
                    <i className={CAT_ICONS[cat] || 'ri-receipt-line'} style={{ fontSize: 18, color: 'var(--accent)' }}></i>
                    <span style={{ fontSize: 12, fontWeight: 500 }}>{cat}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Details */}
          {step === 2 && (
            <div style={{ padding: '16px 16px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, padding: '10px 14px', background: 'var(--card)', border: '1px solid var(--accent)', borderRadius: 12 }}>
                <i className={CAT_ICONS[form.category] || 'ri-receipt-line'} style={{ fontSize: 20, color: 'var(--accent)' }}></i>
                <span style={{ fontWeight: 600 }}>{form.category}</span>
                <button onClick={() => setStep(1)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 12 }}>Change</button>
              </div>

              <div className="form-group">
                <label className="form-label">Amount (₹) *</label>
                <input className="form-control" type="number" placeholder="0" value={form.amount} onChange={e => setField('amount', e.target.value)} style={{ fontSize: 20, fontWeight: 700 }} />
              </div>
              <div className="form-group">
                <label className="form-label">Date</label>
                <input className="form-control" type="date" value={form.date} onChange={e => setField('date', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Note (optional)</label>
                <textarea className="form-control" rows={2} placeholder="Brief description…" value={form.note} onChange={e => setField('note', e.target.value)} />
              </div>

              <label style={{ display: 'block', background: 'var(--card)', border: `2px dashed ${form.receiptFile ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 12, padding: 20, textAlign: 'center', cursor: 'pointer', marginBottom: 20 }}>
                <input type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={e => setField('receiptFile', e.target.files[0] || null)} />
                {form.receiptFile ? (
                  <><i className="ri-check-line" style={{ fontSize: 28, color: 'var(--accent)' }}></i><div style={{ fontSize: 12, color: 'var(--accent)', marginTop: 4, fontWeight: 600 }}>Receipt attached ✓</div><div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{form.receiptFile.name}</div></>
                ) : (
                  <><i className="ri-camera-line" style={{ fontSize: 28, color: 'var(--text-muted)' }}></i><div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Tap to attach receipt (optional)</div></>
                )}
              </label>

              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setStep(1)}>Back</button>
                <button className="btn btn-primary" style={{ flex: 2 }} onClick={() => setStep(3)}>Review →</button>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div style={{ padding: '16px 16px 24px' }}>
              <div style={{ fontWeight: 600, marginBottom: 14, fontSize: 13 }}>Review & Submit</div>
              <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', marginBottom: 16 }}>
                {[
                  ['Category', form.category],
                  ['Amount', Fmt.currency(Number(form.amount))],
                  ['Date', form.date],
                  ['Receipt', form.receiptFile ? `✓ ${form.receiptFile.name}` : '✕ Not attached'],
                  ['Note', form.note || '—'],
                ].map(([label, value], i) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 14px', borderBottom: i < 4 ? '1px solid var(--border)' : 'none' }}>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{label}</span>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{value}</span>
                  </div>
                ))}
              </div>

              <div style={{ background: 'rgba(0,212,170,0.08)', border: '1px solid rgba(0,212,170,0.2)', borderRadius: 12, padding: 12, marginBottom: 16, fontSize: 11, color: 'var(--accent)' }}>
                <i className="ri-shield-check-line" style={{ marginRight: 4 }}></i>
                GPS location will be captured and verified against activity pins.
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setStep(2)}>Edit</button>
                <button className="btn btn-primary" style={{ flex: 2 }} onClick={handleSubmit}>Submit Expense</button>
              </div>
            </div>
          )}
        </>
      )}
    </MobileShell>
  );
}
