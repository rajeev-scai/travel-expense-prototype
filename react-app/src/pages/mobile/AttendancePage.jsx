import React, { useEffect, useRef, useState } from 'react';
import MobileShell from '../../components/layout/MobileShell.jsx';
import { useToast } from '../../contexts/ToastContext.jsx';

const PATH = [
  [19.076, 72.8777], [19.082, 72.880], [19.090, 72.885],
  [19.098, 72.890], [19.107, 72.895], [19.115, 72.898],
];

export default function AttendancePage() {
  const mapRef = useRef(null);
  const mapInst = useRef(null);
  const { show } = useToast();
  const [checkedIn, setCheckedIn] = useState(true);
  const [checkInTime] = useState('9:02 AM');

  useEffect(() => {
    if (mapInst.current || !mapRef.current) return;
    const L = window.L;
    if (!L) return;

    const map = L.map(mapRef.current, { zoomControl: false });
    mapInst.current = map;

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '© CARTO', maxZoom: 19,
    }).addTo(map);

    L.polyline(PATH, { color: '#0f172a', weight: 14, opacity: 0.15 }).addTo(map);
    L.polyline(PATH, { color: '#ffffff',  weight: 9,  opacity: 0.8 }).addTo(map);
    L.polyline(PATH, { color: '#00d4aa',  weight: 5,  opacity: 1.0 }).addTo(map);

    const homeIcon = L.divIcon({ className: '', iconSize: [32, 42], iconAnchor: [16, 42], html: `<div style="display:flex;flex-direction:column;align-items:center;"><div style="width:32px;height:32px;border-radius:50%;background:#8b5cf6;border:2px solid #fff;display:flex;align-items:center;justify-content:center;font-size:14px;color:#fff;font-weight:800;">H</div><div style="width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-top:10px solid #8b5cf6;"></div></div>` });
    const curIcon  = L.divIcon({ className: '', iconSize: [32, 42], iconAnchor: [16, 42], html: `<div style="display:flex;flex-direction:column;align-items:center;"><div style="width:32px;height:32px;border-radius:50%;background:#00d4aa;border:2px solid #fff;display:flex;align-items:center;justify-content:center;font-size:14px;color:#0a1628;font-weight:800;">●</div><div style="width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-top:10px solid #00d4aa;"></div></div>` });

    L.marker(PATH[0], { icon: homeIcon }).addTo(map);
    L.marker(PATH[PATH.length - 1], { icon: curIcon }).addTo(map);

    map.fitBounds(L.latLngBounds(PATH), { padding: [30, 30] });
    return () => { map.remove(); mapInst.current = null; };
  }, []);

  const handleCheckOut = () => {
    setCheckedIn(false);
    show('Checked out at 6:38 PM. Great work today!', 'success');
  };

  return (
    <MobileShell>
      {/* Header */}
      <div style={{ padding: '60px 16px 12px', background: 'linear-gradient(180deg, var(--bg2) 0%, var(--bg) 100%)' }}>
        <div style={{ fontSize: 18, fontWeight: 800 }}><i className="ri-map-pin-2-fill" style={{ color: 'var(--accent)', marginRight: 8 }}></i>Attendance</div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Monday, 16 March 2026</div>
      </div>

      {/* Status card */}
      <div style={{ margin: '0 16px 16px', background: 'linear-gradient(135deg, #0f3460, #16213e)', border: '1px solid rgba(0,212,170,0.3)', borderRadius: 16, padding: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: checkedIn ? 'var(--accent)' : '#ef4444', boxShadow: `0 0 8px ${checkedIn ? 'var(--accent)' : '#ef4444'}`, animation: 'pulse 2s infinite' }}></div>
          <span style={{ fontSize: 12, fontWeight: 600, color: checkedIn ? 'var(--accent)' : '#ef4444' }}>{checkedIn ? 'CLOCKED IN' : 'CLOCKED OUT'}</span>
        </div>
        <div style={{ fontSize: 24, fontWeight: 800, color: '#fff' }}>{checkedIn ? checkInTime : '6:38 PM'}</div>
        <div style={{ fontSize: 11, color: '#8b9dc3', marginTop: 2 }}>
          <i className="ri-map-pin-line"></i> Andheri East, Mumbai
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginTop: 14 }}>
          {[['18.4 km', 'GPS Tracked', 'var(--accent)'], ['2', 'Activities', '#fff'], ['₹650', 'Claimed', '#fff']].map(([v, l, c]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: c }}>{v}</div>
              <div style={{ fontSize: 10, color: '#8b9dc3', marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Map */}
      <div style={{ margin: '0 16px 16px' }}>
        <div ref={mapRef} style={{ height: 220, borderRadius: 14, overflow: 'hidden', border: '1px solid var(--border)' }}></div>
      </div>

      {/* Activity log */}
      <div style={{ margin: '0 16px 16px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)', fontWeight: 600, fontSize: 13 }}>Activity Log</div>
        {[
          { icon: 'ri-home-line',        color: '#8b5cf6', label: 'Left Home',                  loc: 'Andheri West',    time: '9:02 AM' },
          { icon: 'ri-map-pin-2-fill',   color: 'var(--accent)', label: 'Client Visit — Check In', loc: 'Dadar Office',  time: '10:30 AM' },
          { icon: 'ri-map-pin-2-line',   color: 'var(--accent)', label: 'Client Visit — Check Out', loc: 'Dadar Office', time: '11:45 AM' },
          { icon: 'ri-map-pin-2-fill',   color: '#3b82f6', label: 'Client Visit — Check In',   loc: 'Zomato HQ',       time: '1:15 PM' },
        ].map((a, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderBottom: i < 3 ? '1px solid var(--border)' : 'none' }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: `${a.color}20`, color: a.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}><i className={a.icon}></i></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600 }}>{a.label}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{a.loc}</div>
            </div>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{a.time}</span>
          </div>
        ))}
      </div>

      {/* Check out button */}
      <div style={{ padding: '0 16px 24px' }}>
        {checkedIn ? (
          <button onClick={handleCheckOut} style={{ display: 'block', width: '100%', background: '#ef4444', color: '#fff', border: 'none', textAlign: 'center', padding: 14, borderRadius: 14, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
            <i className="ri-map-pin-line"></i> Check Out
          </button>
        ) : (
          <div style={{ textAlign: 'center', padding: 14, background: 'rgba(0,212,170,0.1)', borderRadius: 14, fontSize: 13, color: 'var(--accent)', fontWeight: 600 }}>
            <i className="ri-check-double-line"></i> Checked out · Day complete
          </div>
        )}
      </div>
    </MobileShell>
  );
}
