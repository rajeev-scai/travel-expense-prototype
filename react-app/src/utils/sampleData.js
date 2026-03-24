export const employees = [
  { id: 1, name: 'Rahul Sharma',  grade: 'G3', team: 'Sales',   manager: 'Priya Mehta', vehicle: '2W', city: 'Mumbai' },
  { id: 2, name: 'Anjali Singh',  grade: 'G4', team: 'Sales',   manager: 'Priya Mehta', vehicle: '4W', city: 'Delhi' },
  { id: 3, name: 'Vikram Patel',  grade: 'G3', team: 'Support', manager: 'Raj Kumar',   vehicle: '2W', city: 'Ahmedabad' },
  { id: 4, name: 'Sneha Nair',    grade: 'G2', team: 'Sales',   manager: 'Priya Mehta', vehicle: '2W', city: 'Chennai' },
  { id: 5, name: 'Arjun Kapoor',  grade: 'G4', team: 'Tech',    manager: 'Raj Kumar',   vehicle: '4W', city: 'Bangalore' },
];

export const grades = [
  { grade: 'G1', label: 'Junior Executive', vehicle: '2W',    daRate: 200, taRate: 2.5, mealLimit: 150, tier: 2 },
  { grade: 'G2', label: 'Executive',        vehicle: '2W',    daRate: 300, taRate: 3.0, mealLimit: 200, tier: 2 },
  { grade: 'G3', label: 'Senior Executive', vehicle: '2W/4W', daRate: 400, taRate: 4.0, mealLimit: 300, tier: 1 },
  { grade: 'G4', label: 'Manager',          vehicle: '4W',    daRate: 600, taRate: 6.0, mealLimit: 500, tier: 1 },
  { grade: 'G5', label: 'Senior Manager',   vehicle: '4W',    daRate: 800, taRate: 8.0, mealLimit: 700, tier: 1 },
];

export const expenses = [
  { id: 'EXP-001', emp: 'Rahul Sharma',  date: '2026-03-15', category: 'Travel (TA)', amount: 420,  distance: '35 km', status: 'auto-approved',  pin: 'valid', note: '' },
  { id: 'EXP-002', emp: 'Anjali Singh',  date: '2026-03-15', category: 'Food/Meals', amount: 380,  distance: '—',     status: 'pending',         pin: 'valid', note: 'Near activity pin' },
  { id: 'EXP-003', emp: 'Vikram Patel',  date: '2026-03-14', category: 'Food/Meals', amount: 950,  distance: '—',     status: 'flagged',         pin: 'amber', note: 'Bill 5km from activity' },
  { id: 'EXP-004', emp: 'Sneha Nair',    date: '2026-03-14', category: 'Night Halt', amount: 1800, distance: '—',     status: 'auto-approved',   pin: 'valid', note: '' },
  { id: 'EXP-005', emp: 'Arjun Kapoor',  date: '2026-03-13', category: 'Toll',       amount: 120,  distance: '—',     status: 'manual-review',   pin: 'valid', note: 'No activity found at location' },
  { id: 'EXP-006', emp: 'Rahul Sharma',  date: '2026-03-13', category: 'Travel (TA)', amount: 600, distance: '50 km', status: 'auto-approved',  pin: 'valid', note: '' },
  { id: 'EXP-007', emp: 'Anjali Singh',  date: '2026-03-12', category: 'BYOD Internet', amount: 500, distance: '—',  status: 'auto-approved',   pin: 'valid', note: '' },
];

// Extended expenses for Expenses page (multi-user, multi-category)
export const allExpenses = [
  // Travel (TA)
  { id: 'EXP-101', emp: 'Rahul Sharma',  empId: 1, date: '2026-03-15', category: 'Travel (TA)',    amount: 420,  pin: 'valid', decision: 'pending',  remarks: '', note: '35 km from Andheri to Dadar' },
  { id: 'EXP-102', emp: 'Anjali Singh',  empId: 2, date: '2026-03-14', category: 'Travel (TA)',    amount: 780,  pin: 'valid', decision: 'pending',  remarks: '', note: '65 km sales run' },
  { id: 'EXP-103', emp: 'Vikram Patel',  empId: 3, date: '2026-03-14', category: 'Travel (TA)',    amount: 360,  pin: 'valid', decision: 'approved', remarks: '', note: '30 km city travel' },
  { id: 'EXP-104', emp: 'Sneha Nair',    empId: 4, date: '2026-03-13', category: 'Travel (TA)',    amount: 240,  pin: 'amber', decision: 'pending',  remarks: '', note: 'Path deviation detected' },
  // Food/Meals
  { id: 'EXP-201', emp: 'Rahul Sharma',  empId: 1, date: '2026-03-15', category: 'Food/Meals',    amount: 380,  pin: 'valid', decision: 'pending',  remarks: '', note: 'Client lunch near office' },
  { id: 'EXP-202', emp: 'Anjali Singh',  empId: 2, date: '2026-03-14', category: 'Food/Meals',    amount: 950,  pin: 'amber', decision: 'pending',  remarks: '', note: 'Bill 5km from activity' },
  { id: 'EXP-203', emp: 'Arjun Kapoor',  empId: 5, date: '2026-03-13', category: 'Food/Meals',    amount: 290,  pin: 'valid', decision: 'approved', remarks: '', note: 'Team lunch' },
  { id: 'EXP-204', emp: 'Vikram Patel',  empId: 3, date: '2026-03-12', category: 'Food/Meals',    amount: 1200, pin: 'red',   decision: 'pending',  remarks: '', note: 'No nearby activity (8km away)' },
  // Fuel
  { id: 'EXP-301', emp: 'Arjun Kapoor',  empId: 5, date: '2026-03-15', category: 'Fuel',          amount: 2400, pin: 'valid', decision: 'pending',  remarks: '', note: 'Monthly fuel fill — petrol pump receipt' },
  { id: 'EXP-302', emp: 'Anjali Singh',  empId: 2, date: '2026-03-13', category: 'Fuel',          amount: 1800, pin: 'valid', decision: 'pending',  remarks: '', note: '60 litres diesel' },
  { id: 'EXP-303', emp: 'Rahul Sharma',  empId: 1, date: '2026-03-12', category: 'Fuel',          amount: 900,  pin: 'amber', decision: 'flagged',  remarks: 'Fuel station 4km from claimed route', note: '' },
  // Night Halt
  { id: 'EXP-401', emp: 'Arjun Kapoor',  empId: 5, date: '2026-03-14', category: 'Night Halt',    amount: 1800, pin: 'valid', decision: 'pending',  remarks: '', note: 'Pune overnight stay — hotel bill' },
  { id: 'EXP-402', emp: 'Anjali Singh',  empId: 2, date: '2026-03-13', category: 'Night Halt',    amount: 2200, pin: 'amber', decision: 'pending',  remarks: '', note: 'Bill above G4 limit' },
  // Toll
  { id: 'EXP-501', emp: 'Arjun Kapoor',  empId: 5, date: '2026-03-15', category: 'Toll',          amount: 120,  pin: 'valid', decision: 'approved', remarks: '', note: 'Mumbai-Pune expressway' },
  { id: 'EXP-502', emp: 'Anjali Singh',  empId: 2, date: '2026-03-14', category: 'Toll',          amount: 240,  pin: 'valid', decision: 'pending',  remarks: '', note: 'Delhi-Noida-Delhi' },
  // Parking
  { id: 'EXP-601', emp: 'Arjun Kapoor',  empId: 5, date: '2026-03-15', category: 'Parking',       amount: 80,   pin: 'valid', decision: 'approved', remarks: '', note: 'Client office parking' },
  { id: 'EXP-602', emp: 'Rahul Sharma',  empId: 1, date: '2026-03-14', category: 'Parking',       amount: 150,  pin: 'red',   decision: 'pending',  remarks: '', note: 'No GPS activity nearby' },
  // BYOD Internet
  { id: 'EXP-701', emp: 'Sneha Nair',    empId: 4, date: '2026-03-01', category: 'BYOD Internet', amount: 399,  pin: 'valid', decision: 'approved', remarks: '', note: 'Monthly data plan' },
  { id: 'EXP-702', emp: 'Vikram Patel',  empId: 3, date: '2026-03-01', category: 'BYOD Internet', amount: 499,  pin: 'valid', decision: 'pending',  remarks: '', note: 'Upgraded plan' },
  // Accommodation
  { id: 'EXP-801', emp: 'Arjun Kapoor',  empId: 5, date: '2026-03-10', category: 'Accommodation', amount: 3500, pin: 'valid', decision: 'pending',  remarks: '', note: 'Client visit — Hyderabad 2 nights' },
  { id: 'EXP-802', emp: 'Anjali Singh',  empId: 2, date: '2026-03-08', category: 'Accommodation', amount: 4200, pin: 'amber', decision: 'pending',  remarks: '', note: 'Above grade limit (G4 cap ₹3500)' },
  // Miscellaneous
  { id: 'EXP-901', emp: 'Rahul Sharma',  empId: 1, date: '2026-03-15', category: 'Miscellaneous', amount: 320,  pin: 'valid', decision: 'pending',  remarks: '', note: 'Stationery for field demo' },
  { id: 'EXP-902', emp: 'Sneha Nair',    empId: 4, date: '2026-03-13', category: 'Miscellaneous', amount: 180,  pin: 'valid', decision: 'approved', remarks: '', note: 'Courier charges' },
  // DA (Daily Allowance)
  { id: 'EXP-A01', emp: 'Rahul Sharma',  empId: 1, date: '2026-03-15', category: 'DA',            amount: 400,  pin: 'valid', decision: 'approved', remarks: '', note: 'Full day field — G3 tier-1' },
  { id: 'EXP-A02', emp: 'Sneha Nair',    empId: 4, date: '2026-03-15', category: 'DA',            amount: 300,  pin: 'valid', decision: 'pending',  remarks: '', note: 'Full day — G2' },
  { id: 'EXP-A03', emp: 'Vikram Patel',  empId: 3, date: '2026-03-14', category: 'DA',            amount: 400,  pin: 'valid', decision: 'approved', remarks: '', note: 'Full day — G3' },
];

// Journey data for Approval page map
export const journey = {
  employee: { name: 'Rahul Sharma', id: 'EMP-0042', grade: 'G3', vehicle: '2W', city: 'Mumbai' },
  date: '15 Mar 2026',
  startTime: '09:14 AM',
  endTime: '06:38 PM',
  totalKm: 47.3,
  stops: 6,
  path: [
    [19.076, 72.8777], [19.082, 72.880], [19.090, 72.885],
    [19.098, 72.890], [19.107, 72.895], [19.115, 72.898],
    [19.120, 72.902], [19.128, 72.908], [19.135, 72.912],
    [19.140, 72.918], [19.148, 72.924], [19.155, 72.928],
  ],
  attendance: [
    { label: 'Home', coords: [19.076, 72.8777], time: '09:14 AM', type: 'home' },
    { label: 'Check-In', coords: [19.115, 72.898], time: '10:22 AM', type: 'checkin' },
    { label: 'Check-Out', coords: [19.155, 72.928], time: '06:38 PM', type: 'checkout' },
  ],
  expenses: [
    { id: 1, seq: 1, category: 'Travel (TA)', amount: 420,  coords: [19.090, 72.885], pin: 'valid', decision: 'pending', remarks: '', note: '35 km — route matches GPS breadcrumb',      time: '10:15 AM', receipt: true  },
    { id: 2, seq: 2, category: 'Food/Meals',  amount: 380,  coords: [19.098, 72.890], pin: 'valid', decision: 'pending', remarks: '', note: 'Restaurant near activity — within 500m',   time: '01:20 PM', receipt: true  },
    { id: 3, seq: 3, category: 'Food/Meals',  amount: 950,  coords: [19.107, 72.895], pin: 'amber', decision: 'pending', remarks: '', note: 'Bill location 5.2km from nearest activity', time: '02:45 PM', receipt: true  },
    { id: 4, seq: 4, category: 'Night Halt',  amount: 1800, coords: [19.120, 72.902], pin: 'valid', decision: 'pending', remarks: '', note: 'Hotel booking matches date & location',     time: '08:00 PM', receipt: true  },
    { id: 5, seq: 5, category: 'Toll',        amount: 120,  coords: [19.135, 72.912], pin: 'valid', decision: 'pending', remarks: '', note: 'FASTag record — expressway exit detected',  time: '09:30 AM', receipt: false },
    { id: 6, seq: 6, category: 'Fuel',        amount: 600,  coords: [19.148, 72.924], pin: 'valid', decision: 'pending', remarks: '', note: 'Petrol pump on route — matches odometer',   time: '05:15 PM', receipt: true  },
    { id: 7, seq: 7, category: 'Travel (TA)', amount: 280,  coords: [19.155, 72.928], pin: 'red',   decision: 'pending', remarks: '', note: 'No GPS activity nearby (8km away)',          time: '04:30 PM', receipt: false },
  ],
};

export const CAT_META = {
  'Travel (TA)':    { icon: 'ri-car-line',           color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
  'Food/Meals':     { icon: 'ri-restaurant-line',    color: '#f97316', bg: 'rgba(249,115,22,0.12)' },
  'Fuel':           { icon: 'ri-gas-station-line',   color: '#eab308', bg: 'rgba(234,179,8,0.12)' },
  'Night Halt':     { icon: 'ri-hotel-line',         color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)' },
  'Toll':           { icon: 'ri-road-map-line',      color: '#06b6d4', bg: 'rgba(6,182,212,0.12)' },
  'Parking':        { icon: 'ri-parking-box-line',   color: '#64748b', bg: 'rgba(100,116,139,0.12)' },
  'BYOD Internet':  { icon: 'ri-wifi-line',          color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
  'Accommodation':  { icon: 'ri-building-line',      color: '#ec4899', bg: 'rgba(236,72,153,0.12)' },
  'Miscellaneous':  { icon: 'ri-more-2-line',        color: '#94a3b8', bg: 'rgba(148,163,184,0.12)' },
  'DA':             { icon: 'ri-money-dollar-circle-line', color: '#00d4aa', bg: 'rgba(0,212,170,0.12)' },
};
