# Smart T&E — React App

Converted from the HTML prototype to a full React + Vite application.

## Quick Start

```bash
cd react-app
npm install
npm run dev       # starts at http://localhost:3000
```

## Build for Production

```bash
npm run build     # outputs to dist/
npm run preview   # preview the production build
```

## Routes

| Path | Page | Access |
|------|------|--------|
| `/` | Login | Public |
| `/portal/dashboard` | Dashboard | Manager + Admin |
| `/portal/approval` | Journey Review (Leaflet map) | Manager + Admin |
| `/portal/expenses` | Expense Claims (category grouped) | Manager + Admin |
| `/portal/analytics` | Team Analytics | Manager + Admin |
| `/portal/rules` | Rule Engine | Admin only |
| `/portal/users` | Users & Grades | Admin only |
| `/mobile/home` | Mobile Home | All |
| `/mobile/attendance` | Attendance + Map | All |
| `/mobile/expense` | Add Expense (3-step wizard) | All |
| `/mobile/trip` | Journey Map | All |
| `/mobile/history` | Expense History | All |

## Structure

```
src/
  App.jsx               # Router + providers
  main.jsx              # Entry point
  styles/shared.css     # Design system CSS variables + utilities
  contexts/
    AuthContext.jsx     # Auth state (login/logout/role guards)
    ThemeContext.jsx    # Dark/light theme
    ToastContext.jsx    # Toast notifications
  utils/
    fmt.js              # Currency, date, km formatters
    sampleData.js       # All sample data (employees, expenses, journey)
  components/layout/
    AppShell.jsx        # Portal page shell (Sidebar + TopHeader + content)
    Sidebar.jsx         # Collapsible sidebar with role-based nav
    TopHeader.jsx       # Top bar with theme toggle
    MobileShell.jsx     # Mobile frame wrapper with bottom nav
    PortalRoute.jsx     # Auth guard for portal pages
    AdminRoute.jsx      # Auth guard for admin-only pages
    MobileRoute.jsx     # Auth guard for mobile pages
  pages/
    LoginPage.jsx
    portal/ (6 pages)
    mobile/ (5 pages)
```

## Notes

- Leaflet maps use the CDN version (loaded in index.html). The `window.L` pattern is used in map components.
- Chart.js is imported via react-chartjs-2 (registered once per page).
- All decision state (approve/reject/flag) is managed in React state within each page.
