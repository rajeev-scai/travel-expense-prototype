import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import MobileShell from '../../components/layout/MobileShell.jsx';

const PATH = [
  [19.1136, 72.8697],
  [19.1200, 72.8760],
  [19.1280, 72.8820],
  [19.1310, 72.8860],
  [19.1420, 72.9000],
  [19.1500, 72.9150],
  [19.1650, 72.9300],
  [19.1700, 72.9350],
  [19.1800, 72.9500],
  [19.1900, 72.9600],
  [19.2000, 72.9650],
  [19.2050, 72.9700],
  [19.2183, 72.9781],
];

const PIN_DATA = [
  { lat: 19.1136, lng: 72.8697, color: '#8b5cf6', label: 'S' },
  { lat: 19.1310, lng: 72.8860, color: '#3b82f6', label: '1' },
  { lat: 19.1700, lng: 72.9350, color: '#3b82f6', label: '2' },
  { lat: 19.2000, lng: 72.9650, color: '#3b82f6', label: '3' },
  { lat: 19.2183, lng: 72.9781, color: '#8b5cf6', label: 'E' },
  { lat: 19.1290, lng: 72.8830, color: '#00d4aa', label: '₹' },
  { lat: 19.2450, lng: 73.0100, color: '#f59e0b', label: '!' },
];

const EVENTS = [
  {
    time: '9:02 AM', type: 'attendance', title: 'Attendance Marked',
    sub: 'Andheri East, Mumbai · GPS pinned', cardClass: 'highlight',
    extra: null,
  },
  {
    time: '9:15 AM', type: 'travel', title: 'En Route',
    sub: 'GPS tracking active · 2-Wheeler', cardClass: '',
    extra: { km: '12.3 km tracked so far' },
  },
  {
    time: '10:30 AM', type: 'activity', title: 'Client Visit · Zomato HQ',
    sub: 'Andheri East · 45 min meeting', cardClass: '',
    extra: { badge: { cls: 'badge-green', text: 'Proof captured' } },
  },
  {
    time: '1:18 PM', type: 'expense', title: 'Lunch Bill · Café Mumbai Express',
    sub: 'Receipt: ₹280 · Vendor verified', cardClass: 'highlight',
    extra: { badge: { cls: 'badge-green', text: 'Auto-Approved' }, amount: '₹280', amountColor: 'var(--accent)' },
  },
  {
    time: '2:00 PM', type: 'activity', title: 'Client Visit · Meesho Office',
    sub: 'Santacruz · 50 min meeting', cardClass: '',
    extra: { badge: { cls: 'badge-green', text: 'Proof captured' } },
  },
  {
    time: '3:20 PM', type: 'expense', title: 'Toll · Western Express Highway',
    sub: 'Receipt: ₹60 · Route verified', cardClass: 'highlight',
    extra: { badge: { cls: 'badge-green', text: 'Auto-Approved' }, amount: '₹60', amountColor: 'var(--accent)' },
  },
  {
    time: '4:30 PM', type: 'activity', title: 'Client Visit · Nykaa, Thane',
    sub: 'Thane West · 40 min meeting', cardClass: '',
    extra: { badge: { cls: 'badge-green', text: 'Proof captured' } },
  },
  {
    time: '5:00 PM', type: 'expense', title: 'Evening Snacks',
    sub: 'Receipt: ₹350 · Near activity pin', cardClass: 'highlight',
    extra: { badge: { cls: 'badge-green', text: 'Auto-Approved' }, amount: '₹350', amountColor: 'var(--accent)' },
  },
  {
    time: '7:30 PM', type: 'expense', title: 'Dinner Bill (Flagged)',
    sub: '5.2 km from nearest activity', cardClass: 'flag',
    extra: { badge: { cls: 'badge-amber', text: 'Needs Justification' }, amount: '₹420', amountColor: 'var(--amber)' },
  },
  {
    time: '6:45 PM', type: 'attendance', title: 'Clock Out',
    sub: 'Thane · 48.2 km total · Auto-TA ₹420', cardClass: 'highlight',
    extra: { badge: { cls: 'badge-green', text: 'TA Auto-Approved' } },
  },
];

const TYPE_ICON  = { attendance: 'ri-map-pin-2-fill', travel: 'ri-car-line', activity: 'ri-user-location-line', expense: 'ri-receipt-line' };
const TYPE_COLOR = { attendance: '#8b5cf6', travel: '#00d4aa', activity: '#3b82f6', expense: '#00d4aa' };

const CARD_STYLE = {
  '':         { border: '1px solid var(--border)',              background: 'var(--card)' },
  highlight:  { border: '1px solid rgba(0,212,170,0.4)',        background: 'rgba(0,212,170,0.05)' },
  flag:       { border: '1px solid rgba(245,158,11,0.4)',       background: 'rgba(245,158,11,0.05)' },
  violation:  { border: '1px solid rgba(239,68,68,0.4)',        background: 'rgba(239,68,68,0.05)' },
};

export default function TripPage() {
  const mapRef  = useRef(null);
  const mapInst = useRef(null);

  useEffect(() => {
    if (mapInst.current || !mapRef.current) return;
    const map = L.map(mapRef.current, { zoomControl: false, dragging: false, scrollWheelZoom: false });
    mapInst.current = map;
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OSM' }).addTo(map);
    L.polyline(PATH, { color: '#00d4aa', weight: 3, opacity: 0.8 }).addTo(map);
    PIN_DATA.forEach(p => {
      const icon = L.divIcon({
        className: '',
        html: `<div style="background:${p.color};border:2px solid #fff;width:16px;height:16px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:8px;color:#fff;font-weight:700;">${p.label}</div>`,
        iconSize: [16, 16], iconAnchor: [8, 8],
      });
      L.marker([p.lat, p.lng], { icon }).addTo(map);
    });
    map.fitBounds(L.latLngBounds(PATH), { padding: [20, 20] });
    return () => { map.remove(); mapInst.current = null; };
  }, []);

  return (
    <MobileShell>
      {/* Top Bar with date input */}
      <div style={{ padding: '60px 16px 12px', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 700 }}>Today's Journey</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Mon, 16 Mar 2026</div>
        </div>
        <input
          type="date"
          defaultValue="2026-03-16"
          style={{ fontSize: 11, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: '4px 8px', color: 'var(--text)', outline: 'none' }}
        />
      </div>

      {/* Map */}
      <div ref={mapRef} style={{ height: 200, width: '100%' }}></div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6, margin: '10px 16px' }}>
        {[
          { val: '48.2', lbl: 'km GPS',   color: 'var(--accent)' },
          { val: '9h 43m', lbl: 'Duration', color: 'var(--text)' },
          { val: '3',    lbl: 'Visits',   color: 'var(--text)' },
          { val: '₹1,110', lbl: 'Total',  color: 'var(--accent)' },
        ].map(s => (
          <div key={s.lbl} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 6px', textAlign: 'center' }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: s.color }}>{s.val}</div>
            <div style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 2 }}>{s.lbl}</div>
          </div>
        ))}
      </div>

      {/* Reimbursement banner */}
      <div style={{ margin: '0 16px 14px', background: 'rgba(0,212,170,0.08)', border: '1px solid rgba(0,212,170,0.3)', borderRadius: 12, padding: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Estimated Reimbursement</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--accent)' }}>₹ 1,110</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span className="badge badge-green"><i className="ri-robot-line"></i> 5 Auto</span>
            <br />
            <span className="badge badge-amber" style={{ marginTop: 4 }}><i className="ri-flag-line"></i> 1 Flagged</span>
          </div>
        </div>
      </div>

      {/* Timeline header */}
      <div style={{ padding: '0 16px', marginBottom: 8 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Journey Timeline</div>
      </div>

      {/* Timeline */}
      <div style={{ padding: '0 16px', marginBottom: 16 }}>
        {EVENTS.map((ev, i) => {
          const isLast   = i === EVENTS.length - 1;
          const dotColor = TYPE_COLOR[ev.type] || '#00d4aa';
          const cardSt   = CARD_STYLE[ev.cardClass] || CARD_STYLE[''];
          return (
            <div key={i} style={{ display: 'flex', gap: 14, position: 'relative', paddingBottom: 4 }}>
              {/* Left column */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 28, flexShrink: 0 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0, background: `${dotColor}22`, color: dotColor, zIndex: 1 }}>
                  <i className={TYPE_ICON[ev.type]}></i>
                </div>
                {!isLast && (
                  <div style={{ width: 2, flex: 1, minHeight: 20, background: i < EVENTS.length - 3 ? 'linear-gradient(180deg, var(--accent), var(--border))' : 'var(--border)', marginTop: 4 }}></div>
                )}
              </div>
              {/* Content */}
              <div style={{ flex: 1, paddingBottom: 16 }}>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 4 }}>{ev.time}</div>
                <div style={{ ...cardSt, borderRadius: 12, padding: 12 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{ev.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{ev.sub}</div>
                  {ev.extra && (
                    <div style={{ marginTop: 6 }}>
                      {ev.extra.km && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-muted)' }}>
                          <i className="ri-route-line"></i> {ev.extra.km}
                        </span>
                      )}
                      {ev.extra.badge && (
                        <span className={`badge ${ev.extra.badge.cls}`} style={{ fontSize: 10 }}>{ev.extra.badge.text}</span>
                      )}
                      {ev.extra.amount && (
                        <span style={{ fontSize: 14, fontWeight: 700, color: ev.extra.amountColor, float: 'right' }}>{ev.extra.amount}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </MobileShell>
  );
}
