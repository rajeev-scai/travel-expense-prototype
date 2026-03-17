/* =============================================
   Smart T&E Prototype — Shared JS
   Handles: theme, auth, navigation, utils
   ============================================= */

// ---- Theme Management ----
const ThemeManager = {
  key: 'te-theme',
  get() { return localStorage.getItem(this.key) || 'dark'; },
  set(t) {
    localStorage.setItem(this.key, t);
    document.documentElement.setAttribute('data-theme', t);
  },
  toggle() { this.set(this.get() === 'dark' ? 'light' : 'dark'); },
  init() {
    document.documentElement.setAttribute('data-theme', this.get());
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      this._updateIcon(btn);
      btn.addEventListener('click', () => {
        this.toggle();
        this._updateIcon(btn);
      });
    }
  },
  _updateIcon(btn) {
    const isDark = this.get() === 'dark';
    btn.innerHTML = isDark
      ? '<i class="ri-sun-line"></i>'
      : '<i class="ri-moon-line"></i>';
  }
};

// ---- Auth Simulation ----
const Auth = {
  key: 'te-user',
  login(user) { localStorage.setItem(this.key, JSON.stringify(user)); },
  logout() {
    localStorage.removeItem(this.key);
    window.location.href = this._root() + 'index.html';
  },
  getUser() {
    const u = localStorage.getItem(this.key);
    return u ? JSON.parse(u) : null;
  },
  require(roles) {
    const user = this.getUser();
    if (!user) { window.location.href = this._root() + 'index.html'; return null; }
    if (roles && !roles.includes(user.role)) {
      window.location.href = this._root() + 'index.html';
      return null;
    }
    return user;
  },

  // ── Role Guards ──────────────────────────────────────────────
  // Block field users from the web portal → send them to mobile
  requirePortal() {
    const user = this.getUser();
    if (!user) { window.location.href = this._root() + 'index.html'; return null; }
    if (user.role === 'field') {
      // Field users belong on the mobile app, not the portal
      window.location.href = this._root() + 'mobile/home.html';
      return null;
    }
    return user;
  },

  // Block non-admin users from admin-only pages → send to dashboard
  requireAdmin() {
    const user = this.getUser();
    if (!user) { window.location.href = this._root() + 'index.html'; return null; }
    if (user.role === 'field') {
      window.location.href = this._root() + 'mobile/home.html';
      return null;
    }
    if (user.role !== 'admin') {
      // Managers see an access-denied banner and are redirected
      Auth._showAccessDenied('Admin / Finance access only. Rule Engine and User Management are restricted.');
      setTimeout(() => { window.location.href = 'dashboard.html'; }, 2800);
      return null;
    }
    return user;
  },

  // Utility: show a full-page access-denied banner before redirect
  _showAccessDenied(msg) {
    document.body.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:center;min-height:100vh;background:var(--bg);font-family:Inter,sans-serif;">
        <div style="text-align:center;padding:40px;background:var(--card);border:1px solid rgba(239,68,68,0.4);border-radius:16px;max-width:440px;">
          <div style="font-size:48px;margin-bottom:16px;">🔒</div>
          <div style="font-size:18px;font-weight:700;color:#ef4444;margin-bottom:10px;">Access Restricted</div>
          <div style="font-size:14px;color:#8b9dc3;line-height:1.6;margin-bottom:20px;">${msg}</div>
          <div style="font-size:12px;color:#4a5568;">Redirecting to dashboard…</div>
        </div>
      </div>`;
  },

  isAdmin()   { const u = this.getUser(); return u && u.role === 'admin'; },
  isManager() { const u = this.getUser(); return u && u.role === 'manager'; },
  isField()   { const u = this.getUser(); return u && u.role === 'field'; },

  _root() {
    const p = window.location.pathname;
    if (p.includes('/portal/') || p.includes('/mobile/')) return '../';
    return '';
  }
};

// ---- Sidebar ----
const Sidebar = {
  init() {
    const toggle = document.getElementById('sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    const mainWrap = document.querySelector('.main-wrap');
    if (!sidebar) return;

    const _updateToggleIcon = () => {
      if (!toggle) return;
      const isCollapsed = sidebar.classList.contains('collapsed');
      toggle.innerHTML = isCollapsed
        ? '<i class="ri-menu-unfold-line"></i>'
        : '<i class="ri-menu-fold-line"></i>';
      toggle.title = isCollapsed ? 'Expand sidebar' : 'Collapse sidebar';
    };

    const collapsed = localStorage.getItem('sidebar-collapsed') === 'true';
    if (collapsed) {
      sidebar.classList.add('collapsed');
      mainWrap?.classList.add('sidebar-collapsed');
    }
    _updateToggleIcon();

    toggle?.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
      mainWrap?.classList.toggle('sidebar-collapsed');
      localStorage.setItem('sidebar-collapsed', sidebar.classList.contains('collapsed'));
      _updateToggleIcon();
    });

    // Logout
    document.querySelectorAll('.logout-btn').forEach(b => b.addEventListener('click', () => Auth.logout()));

    // Populate user card
    const user = Auth.getUser();
    if (user) {
      const nameEl  = document.getElementById('sidebar-user-name');
      const roleEl  = document.getElementById('sidebar-user-role');
      const avatarEl = document.getElementById('sidebar-avatar');
      if (nameEl)   nameEl.textContent  = user.name;
      if (roleEl)   roleEl.textContent  = user.roleLabel;
      if (avatarEl) avatarEl.textContent = user.name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase();

      // ── Role-based nav visibility ───────────────────────────
      // Admin-only nav items: hide completely for managers
      if (user.role !== 'admin') {
        document.querySelectorAll('.nav-admin-only').forEach(el => {
          el.style.display = 'none';
        });
        // Also hide the "Admin" section label if present
        document.querySelectorAll('.sidebar-section-admin').forEach(el => {
          el.style.display = 'none';
        });
      }

      // Add a visible role badge in the sidebar footer
      const roleChip = document.getElementById('sidebar-role-chip');
      if (roleChip) {
        const roleConfig = {
          admin:   { label: 'Admin', color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
          manager: { label: 'Manager', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
          field:   { label: 'Field User', color: '#00d4aa', bg: 'rgba(0,212,170,0.12)' },
        };
        const cfg = roleConfig[user.role] || roleConfig.manager;
        roleChip.style.cssText = `
          display:inline-block; font-size:10px; font-weight:700; padding:2px 8px;
          border-radius:8px; color:${cfg.color}; background:${cfg.bg};
          border:1px solid ${cfg.color}33; margin-top:4px; letter-spacing:0.5px;
          text-transform:uppercase;`;
        roleChip.textContent = cfg.label;
      }
    }
  }
};

// ---- Tabs ----
const Tabs = {
  init(container) {
    const el = document.querySelector(container || '[data-tabs]');
    if (!el) return;
    el.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        el.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        el.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        const target = document.getElementById(btn.dataset.tab);
        if (target) target.classList.add('active');
      });
    });
  }
};

// ---- Toast Notifications ----
const Toast = {
  show(msg, type='info', duration=3000) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.style.cssText = `
        position:fixed; bottom:24px; right:24px; z-index:9999;
        display:flex; flex-direction:column; gap:8px;
      `;
      document.body.appendChild(container);
    }
    const colors = { success: '#00d4aa', error: '#ef4444', warning: '#f59e0b', info: '#3b82f6' };
    const toast = document.createElement('div');
    toast.style.cssText = `
      background: var(--card); border: 1px solid ${colors[type]};
      color: var(--text); padding: 12px 16px; border-radius: 8px;
      font-size: 13px; font-weight: 500; border-left: 3px solid ${colors[type]};
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      animation: fadeIn 0.2s ease; min-width: 240px; max-width: 360px;
    `;
    toast.textContent = msg;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), duration);
  }
};

// ---- Format Helpers ----
const Fmt = {
  currency(n, currency='₹') { return `${currency}${Number(n).toLocaleString('en-IN')}`; },
  date(d) { return new Date(d).toLocaleDateString('en-IN', {day:'2-digit',month:'short',year:'numeric'}); },
  dateShort(d) { return new Date(d).toLocaleDateString('en-IN', {day:'2-digit',month:'short'}); },
  time(d) { return new Date(d).toLocaleTimeString('en-IN', {hour:'2-digit',minute:'2-digit'}); },
  km(n) { return `${Number(n).toFixed(1)} km`; }
};

// ---- Sample Data ----
const SampleData = {
  employees: [
    { id: 1, name: 'Rahul Sharma', grade: 'G3', team: 'Sales', manager: 'Priya Mehta', vehicle: '2W', city: 'Mumbai' },
    { id: 2, name: 'Anjali Singh', grade: 'G4', team: 'Sales', manager: 'Priya Mehta', vehicle: '4W', city: 'Delhi' },
    { id: 3, name: 'Vikram Patel', grade: 'G3', team: 'Support', manager: 'Raj Kumar', vehicle: '2W', city: 'Ahmedabad' },
    { id: 4, name: 'Sneha Nair', grade: 'G2', team: 'Sales', manager: 'Priya Mehta', vehicle: '2W', city: 'Chennai' },
    { id: 5, name: 'Arjun Kapoor', grade: 'G4', team: 'Tech', manager: 'Raj Kumar', vehicle: '4W', city: 'Bangalore' },
  ],
  expenses: [
    { id: 'EXP-001', emp: 'Rahul Sharma', date: '2026-03-15', category: 'Travel (TA)', amount: 420, distance: '35 km', status: 'auto-approved', pin: 'valid', note: '' },
    { id: 'EXP-002', emp: 'Anjali Singh', date: '2026-03-15', category: 'Food/Meals', amount: 380, distance: '—', status: 'pending', pin: 'valid', note: 'Near activity pin' },
    { id: 'EXP-003', emp: 'Vikram Patel', date: '2026-03-14', category: 'Food/Meals', amount: 950, distance: '—', status: 'flagged', pin: 'amber', note: 'Bill 5km from activity' },
    { id: 'EXP-004', emp: 'Sneha Nair', date: '2026-03-14', category: 'Night Halt', amount: 1800, distance: '—', status: 'auto-approved', pin: 'valid', note: '' },
    { id: 'EXP-005', emp: 'Arjun Kapoor', date: '2026-03-13', category: 'Toll', amount: 120, distance: '—', status: 'manual-review', pin: 'valid', note: 'No activity found at location' },
    { id: 'EXP-006', emp: 'Rahul Sharma', date: '2026-03-13', category: 'Travel (TA)', amount: 600, distance: '50 km', status: 'auto-approved', pin: 'valid', note: '' },
    { id: 'EXP-007', emp: 'Anjali Singh', date: '2026-03-12', category: 'BYOD Internet', amount: 500, distance: '—', status: 'auto-approved', pin: 'valid', note: '' },
  ],
  grades: [
    { grade: 'G1', label: 'Junior Executive', vehicle: '2W', daRate: 200, taRate: 2.5, mealLimit: 150, tier: 2 },
    { grade: 'G2', label: 'Executive', vehicle: '2W', daRate: 300, taRate: 3.0, mealLimit: 200, tier: 2 },
    { grade: 'G3', label: 'Senior Executive', vehicle: '2W/4W', daRate: 400, taRate: 4.0, mealLimit: 300, tier: 1 },
    { grade: 'G4', label: 'Manager', vehicle: '4W', daRate: 600, taRate: 6.0, mealLimit: 500, tier: 1 },
    { grade: 'G5', label: 'Senior Manager', vehicle: '4W', daRate: 800, taRate: 8.0, mealLimit: 700, tier: 1 },
  ]
};

// ---- Init on DOM Ready ----
document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
  Sidebar.init();
  Tabs.init();
  // Animate page elements
  document.querySelectorAll('.card, .stat-card').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(12px)';
    setTimeout(() => {
      el.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      el.style.opacity = '1';
      el.style.transform = 'none';
    }, i * 40);
  });
});
