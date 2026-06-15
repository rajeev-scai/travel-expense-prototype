import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import MobileShell from '../../components/layout/MobileShell.jsx';

const PATH = [
  [19.076, 72.8777], [19.082, 72.880], [19.090, 72.885],
  [19.098, 72.890], [19.107, 72.895], [19.115, 72.898],
  [19.120, 72.902], [19.128, 72.908], [19.135, 72.912],
];

const STOPS = [
  { label: 'Home', coords: [19.076, 72.8777], time: '9:02 AM', type: 'home' },
  { label: 'Dadar Office', coords: [19.107, 72.895], time: '10:30 AM', type: 'visit' },
  { label: 'Current', coords: [19.135, 72.912], time: 'Now', type: 'current' },
];

export default function TripPage() {
  const mapRef = useRef(null);
  const mapInst = useRef(null);

  useEffect(() => {
    if (mapInst.current || !mapRef.current) return;

    const map = L.map(mapRef.current, { zoomControl: false });
    mapInst.current = map;

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '© CARTO', maxZoom: 19,
    }).addTo(map);

    L.polyline(PATH, { color: '#0f172a', weight: 18, opacity: 0.15 }).addTo(map);
    L.polyline(PATH, { color: '#ffffff',  weight: 12, opacity: 0.8 }).addTo(map);
    L.polyline(PATH, { color: '#00d4aa',  weight: 7,  opacity: 1.0 }).addTo(map);

    const colors = { home: '#8b5cf6', visit: '#3b82f6', current: '#00d4aa' };
    STOPS.forEach((s, i) => {
      const c = colors[s.type];
      const icon = L.divIcon({
        className: '', iconSize: [32, 42], iconAnchor: [16, 42],
        html: `<div style="display:flex;flex-direction:column;align-items:center;">
          <div style="width:32px;height:32px;border-radius:50%;background:${c};border:2px solid #fff;display:flex;align-items:center;justify-content:center;font-size:13px;color:#fff;font-weight:800;box-shadow:0 4px 12px ${c}88;">${i + 1}</div>
          <div style="width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-top:10px solid ${c};"></div>
        </div>`,
      });
      L.marker(s.coords, { icon }).bindTooltip(`<b>${s.label}</b><br>${s.time}`, { direction: 'top' }).addTo(map);
    });

    map.fitBounds(L.latLngBounds(PATH), { padding: [30, 30] });
    return () => { map.remove(); mapInst.current = null; };
  }, []);

  return (
    <MobileShell>
      <div style={{ padding: '60px 16px 12px', background: 'linear-gradient(180deg, var(--bg2) 0%, var(--bg) 100%)' }}>
        <div style={{ fontSize: 18, fontWeight: 800 }}><i className="ri-route-line" style={{ color: 'var(--accent)', marginRight: 8 }}></i>Today's Journey</div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Monday, 16 March 2026</div>
      </div>

      {/* Stats strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 1, margin: '0 16px 12px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
        {[['18.4 km', 'Distance', 'var(--accent)'], ['2', 'Stops', '#3b82f6'], ['2h 38m', 'On Road', '#fff'], ['₹650', 'Claimed', '#fff']].map(([v, l, c]) => (
          <div key={l} style={{ padding: '12px 8px', textAlign: 'center', borderRight: '1px solid var(--border)' }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: c }}>{v}</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Map */}
      <div style={{ margin: '0 16px 12px' }}>
        <div ref={mapRef} style={{ height: 260, borderRadius: 14, overflow: 'hidden', border: '1px solid var(--border)' }}></div>
      </div>

      {/* Timeline */}
      <div style={{ margin: '0 16px 16px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)', fontWeight: 600, fontSize: 13 }}>Route Timeline</div>
        {STOPS.map((s, i) => {
          const c = { home: '#8b5cf6', visit: '#3b82f6', current: '#00d4aa' }[s.type];
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderBottom: i < STOPS.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: `${c}20`, color: c, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{s.label}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.time}</div>
              </div>
              {s.type === 'current' && <span className="badge badge-green" style={{ fontSize: 10 }}>You are here</span>}
            </div>
          );
        })}
      </div>

      {/* Breadcrumb info */}
      <div style={{ margin: '0 16px 24px', background: 'rgba(0,212,170,0.08)', border: '1px solid rgba(0,212,170,0.2)', borderRadius: 12, padding: 12, fontSize: 11, color: 'var(--accent)' }}>
        <i className="ri-shield-check-line" style={{ marginRight: 4 }}></i>
        GPS breadcrumb recording active — location pinned every 60s. Path verified for expense claims.
      </div>
    </MobileShell>
  );
}
