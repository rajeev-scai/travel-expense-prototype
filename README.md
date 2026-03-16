# Smart Travel & Expense (T&E) Prototype

> GPS-Powered, Pinned Journey expense management system — high-fidelity working prototype built for GitHub Pages.

## 🚀 Live Demo
[Open Prototype →](https://your-org.github.io/smart-te-prototype/)

## 📋 About
High-fidelity prototype for **Smart T&E** — an expense management system that uses GPS Breadcrumbs and Activity-Linked Proofs to automate the reimbursement lifecycle.

**Key Innovation:** Every expense claim is anchored to a real GPS location and timestamp — making fraud nearly impossible while allowing 70%+ claims to be auto-approved.

---

## 🗺️ Pages

### Web Portal (for Managers & Admins)
| Page | URL | Description |
|------|-----|-------------|
| Login | `/index.html` | Role-based login (Field / Manager / Admin) |
| Dashboard | `/portal/dashboard.html` | Overview stats, charts, activity feed |
| Pinned Journey | `/portal/approval.html` | Interactive map with expense pins, approve/reject |
| Analytics | `/portal/analytics.html` | Team spend analytics, approval rates, trends |
| Rule Engine | `/portal/rules.html` | Configure vehicle matrix, DA/TA rates, auto-approve rules |
| Users | `/portal/users.html` | Employee directory, grade management |

### Mobile App (for Field Users)
| Page | URL | Description |
|------|-----|-------------|
| Home | `/mobile/home.html` | Daily summary, quick actions |
| Attendance | `/mobile/attendance.html` | GPS Clock In/Out + Odometer photo |
| Add Expense | `/mobile/expense.html` | Camera capture + OCR extraction + geo-tag |
| Trip Timeline | `/mobile/trip.html` | Day's journey with Leaflet map + event timeline |
| History | `/mobile/history.html` | Expense history with status tracking |

---

## 🎨 Design System
- **Dark Mode** (default) · **Light Mode** (toggle top-right)
- **Accent Color:** `#00d4aa` (Teal)
- **Font:** Inter
- **Icons:** Remix Icons
- **Charts:** Chart.js
- **Maps:** Leaflet.js (OpenStreetMap)

---

## 🏗️ GitHub Pages Setup

### Option 1: Direct Deploy
1. Fork this repository
2. Go to **Settings → Pages**
3. Set Source: `Deploy from a branch` → `main` → `/ (root)`
4. Visit: `https://your-username.github.io/your-repo-name/`

### Option 2: Using GitHub Actions
```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./prototype
```

---

## 🧪 Demo Credentials
- Click **Sign In** on the login page with any email/password (prototype mode)
- Select role to navigate to the appropriate view

## 📂 File Structure
```
prototype/
├── index.html              # Login page
├── assets/
│   ├── css/shared.css      # All styles + CSS variables
│   └── js/shared.js        # Auth, theme, utilities, sample data
├── portal/
│   ├── dashboard.html
│   ├── approval.html       # ← Key feature: Pinned Journey Map
│   ├── analytics.html
│   ├── rules.html          # ← Rule Engine configuration
│   └── users.html
└── mobile/
    ├── home.html
    ├── attendance.html
    ├── expense.html        # ← OCR + Geo-tagging
    ├── trip.html           # ← Trip Timeline
    └── history.html
```

---

## 🔑 Key Features Demonstrated

### 1. Pinned Journey (approval.html)
- Leaflet map with real GPS breadcrumb path
- Color-coded expense pins: Green (valid) / Amber (flagged) / Red (violation)
- Activity pins, attendance start/end markers
- Click any pin to see expense details + approve/reject

### 2. OCR Bill Capture (mobile/expense.html)
- Live camera capture (no gallery uploads)
- Simulated OCR extraction: Vendor, Date, Amount
- Real-time validation: grade limits, geo-proximity

### 3. Rule Engine (portal/rules.html)
- Vehicle matrix: Grade → 2W/4W/Taxi eligibility
- Allowance matrix: DA/TA by grade and city tier
- Auto-approve toggles per category
- Geo-fence radius settings

### 4. Auto-Approval Logic
- TA: Auto-approved if GPS ≈ odometer (±5%)
- Food: Auto-approved if pin within 500m of activity + ≤ grade meal limit
- Night Halt: Auto-approved if midnight GPS > 100km from home
- Absent days: No expenses allowed

---

Built with ❤️ as a high-fidelity prototype · © 2026 Smart T&E
