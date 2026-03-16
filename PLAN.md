# Smart Travel & Expense Prototype — Master Plan

## BRD Summary
- **Product**: GPS Breadcrumb-based Expense & Travel Reimbursement System
- **Key Innovation**: "Pinned Journey" — every expense is anchored to a real GPS location and timestamp
- **Anti-Fraud**: Cross-reference Expense Pin with Activity Pin (within 500m = valid)

## User Roles
| Role | Platform | Key Function |
|------|----------|--------------|
| Field User | Mobile App | Clock in, log activities, capture geo-tagged bills |
| Line Manager | Web Portal | Review pinned journeys, approve/reject expenses |
| Admin/Finance | Web Portal | Configure grade-wise rates, vehicle matrix, auto-approve rules |

## Design Theme (from screen1/screen2)
- Dark Mode: bg=#1a1a2e, sidebar=#111827, card=#16213e, accent=#00d4aa
- Light Mode: bg=#f5f5f5, sidebar=#fff, card=#fff, accent=#00d4aa
- Font: Inter (Google Fonts)
- Icons: Remix Icons CDN
- Charts: Chart.js
- Maps: Leaflet.js

## Portal Pages (Web)
1. `index.html` — Login (role selector: Field User / Manager / Admin)
2. `portal/dashboard.html` — Manager Dashboard (stats, team spend chart, recent claims)
3. `portal/approval.html` — Pinned Journey Approval (Leaflet map + expense list)
4. `portal/analytics.html` — Team Analytics (charts, category breakdown, reports)
5. `portal/rules.html` — Rule Engine (Vehicle Matrix, Allowance Matrix, Auto-Approve Toggles)
6. `portal/users.html` — User Management (employees, grades, team assignment)

## Mobile Screens (simulated, max-width 390px)
1. `mobile/home.html` — Field User Home (today's status, quick actions)
2. `mobile/attendance.html` — Clock In/Out with GPS pin + odometer photo
3. `mobile/expense.html` — Add Expense (bill camera capture + OCR simulation + geo-tag)
4. `mobile/trip.html` — Daily Trip Timeline (vertical timeline with pins)
5. `mobile/history.html` — Expense History + Status tracking

## Business Rules Implemented in UI
- "Add Expense" button locked until attendance is marked
- Vehicle selector filtered by employee grade
- Auto-approve badges on qualifying expenses (TA/DA)
- Amber/Red flags on map for out-of-range expense pins
- OCR extraction simulation (Date, Amount, Vendor from photo)

## GitHub Pages Setup
- All links are relative
- No backend required — uses localStorage for state simulation
- Login sets role in localStorage, pages redirect accordingly
