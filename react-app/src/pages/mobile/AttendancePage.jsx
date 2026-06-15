import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import MobileShell from '../../components/layout/MobileShell.jsx';
import { useToast } from '../../contexts/ToastContext.jsx';

const HOME = [19.1136, 72.8697];

export default function AttendancePage() {
  const mapRef  = useRef(null);
  const mapInst = useRef(null);
  const { show } = useToast();

  const [checkedIn, setCheckedIn]     = useState(false);
  const [checkInTime]                 = useState('9:02 AM');
  const [vehicle, setVehicle]         = useState('2w');
  const [odoCaptured, setOdoCaptured] = useState(false);
  const [purpose, setPurpose]         = useState('');

  useEffect(() => {
    if (mapInst.current || !mapRef.current) return;
    const map = L.map(mapRef.current, { zoomControl: false, dragging: false, scrollWheelZoom: false });
    mapInst.current = map;
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OSM' }).addTo(map);
    map.setView(HOME, 15);
    const icon = L.divIcon({
      className: '',
      html: `<div style="position:relative;">
        <div style="width:60px;height:60px;background:rgba(0,212,170,0.15);border:2px solid rgba(0,212,170,0.4);position:absolute;top:-30px;left:-30px;border-radius:50%;"></div>
        <div style="width:18px;height:18px;background:#00d4aa;border:3px solid #fff;border-radius:50%;box-shadow:0 0 12px rgba(0,212,170,0.8);position:absolute;top:-9px;left:-9px;"></div>
      </div>`,
      iconSize: [0, 0],
    });
    L.marker(HOME, { icon }).addTo(map);
    return () => { map.remove(); mapInst.current = null; };
  }, []);

  const handleClockIn = () => {
    setCheckedIn(true);
    show('✓ Clocked in! GPS journey started.', 'success');
  };

  const handleClockOut = () => {
    setCheckedIn(false);
    show('Journey ended. 48.2 km tracked. TA auto-calculated.', 'success');
  };

  return (
    <MobileShell>
      {/* Top Bar */}
      <div style={{ padding: '60px 16px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ fontSize: 16, fontWeight: 700, flex: 1 }}>Mark Attendance</div>
        <span className="badge badge-green" style={{ fontSize: 11 }}><i className="ri-gps-fill"></i> GPS Active</span>
      </div>

      {/* Map */}
      <div style={{ position: 'relative' }}>
        <div ref={mapRef} style={{ height: 220, width: '100%' }}></div>
        <div style={{ position: 'absolute', top: 8, left: 8, zIndex: 1000, background: 'rgba(17,24,39,0.9)', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 10px', fontSize: 11, color: 'var(--accent)' }}>
          <i className="ri-map-pin-fill"></i> Your Location Detected
        </div>
      </div>

      {/* Location card */}
      <div style={{ margin: '12px 16px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(0,212,170,0.15)', border: '2px solid var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: 'var(--accent)', flexShrink: 0 }}>
            <i className="ri-map-pin-2-fill"></i>
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Andheri East, Mumbai</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>19.1136° N, 72.8697° E</div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 6, fontSize: 11, color: 'var(--green)' }}>
              <i className="ri-checkbox-circle-fill"></i> Accuracy: ±8 meters
            </div>
          </div>
        </div>
      </div>

      {/* Vehicle Selection */}
      <div style={{ padding: '0 16px', marginBottom: 10 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>Select Vehicle</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {/* 2-Wheeler */}
          <div
            onClick={() => setVehicle('2w')}
            style={{
              flex: 1, padding: '12px 8px', borderRadius: 12, textAlign: 'center', cursor: 'pointer',
              border: `2px solid ${vehicle === '2w' ? 'var(--accent)' : 'var(--border)'}`,
              background: vehicle === '2w' ? 'rgba(0,212,170,0.1)' : 'var(--bg)',
            }}
          >
            <i className="ri-motorbike-line" style={{ fontSize: 24, display: 'block', marginBottom: 6, color: vehicle === '2w' ? 'var(--accent)' : 'var(--text-muted)' }}></i>
            <span style={{ fontSize: 11, fontWeight: 600, color: vehicle === '2w' ? 'var(--accent)' : 'var(--text-muted)' }}>2-Wheeler</span>
          </div>
          {/* 4-Wheeler — locked */}
          <div
            onClick={() => show('4W not allowed for G3 grade', 'warning')}
            style={{
              flex: 1, padding: '12px 8px', borderRadius: 12, textAlign: 'center', cursor: 'not-allowed',
              border: '2px solid var(--border)', background: 'var(--bg)', opacity: 0.5,
            }}
          >
            <i className="ri-car-line" style={{ fontSize: 24, display: 'block', marginBottom: 6, color: 'var(--text-muted)' }}></i>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)' }}>4-Wheeler</span>
            <div style={{ fontSize: 9, color: 'var(--red)', marginTop: 2 }}>G4+ Only</div>
          </div>
        </div>
      </div>

      {/* Odometer Photo */}
      <div style={{ margin: '0 16px 12px' }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>📷 Start Odometer Photo</div>
        <label style={{
          display: 'block', border: `2px ${odoCaptured ? 'solid var(--accent)' : 'dashed var(--border)'}`,
          borderRadius: 14, padding: 24, textAlign: 'center', cursor: 'pointer',
          background: odoCaptured ? 'rgba(0,212,170,0.08)' : 'var(--bg)',
        }}>
          <input
            type="file" accept="image/*" capture="environment"
            style={{ display: 'none' }}
            onChange={e => { if (e.target.files && e.target.files[0]) setOdoCaptured(true); }}
          />
          <i className={odoCaptured ? 'ri-checkbox-circle-fill' : 'ri-camera-2-line'}
            style={{ fontSize: 32, display: 'block', marginBottom: 8, color: odoCaptured ? 'var(--accent)' : 'var(--text-muted)' }}>
          </i>
          <span style={{ fontSize: 13, color: odoCaptured ? 'var(--accent)' : 'var(--text-muted)' }}>
            {odoCaptured ? '✓ Photo captured' : 'Tap to capture odometer reading'}
          </span>
        </label>
        {odoCaptured && (
          <div style={{ marginTop: 8, textAlign: 'center' }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Reading detected: </span>
            <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--accent)' }}>48,720 km</span>
          </div>
        )}
      </div>

      {/* Purpose of Visit */}
      <div style={{ padding: '0 16px', marginBottom: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>Purpose of Visit (Optional)</div>
        <textarea
          className="form-control"
          rows={2}
          placeholder="e.g. Client meeting, Sales call…"
          value={purpose}
          onChange={e => setPurpose(e.target.value)}
        />
      </div>

      {/* Clock In / Clock Out */}
      {!checkedIn ? (
        <button
          onClick={handleClockIn}
          style={{ display: 'block', width: 'calc(100% - 32px)', margin: '0 16px 16px', padding: 16, background: 'var(--accent)', color: '#0a1628', border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 700, cursor: 'pointer', textAlign: 'center' }}
        >
          <i className="ri-map-pin-2-fill"></i> Clock In &amp; Start Journey
        </button>
      ) : (
        <div style={{ padding: '0 16px 24px' }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, textAlign: 'center' }}>Already clocked in at {checkInTime}</div>
          <button
            onClick={handleClockOut}
            style={{ display: 'block', width: '100%', padding: 16, background: 'rgba(239,68,68,0.15)', color: 'var(--red)', border: '2px solid var(--red)', borderRadius: 14, fontSize: 15, fontWeight: 700, cursor: 'pointer', textAlign: 'center' }}
          >
            <i className="ri-logout-box-r-line"></i> Clock Out &amp; End Journey
          </button>
        </div>
      )}
    </MobileShell>
  );
}
