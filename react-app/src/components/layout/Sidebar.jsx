import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';

export default function Sidebar({ onCollapse }) {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem('sidebar-collapsed') === 'true');

  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', collapsed);
    onCollapse?.(collapsed);
  }, [collapsed]);

  const avatar = user ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'U';

  const roleConfig = {
    admin:   { label: 'Admin',    color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
    manager: { label: 'Manager',  color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
    field:   { label: 'Field',    color: '#00d4aa', bg: 'rgba(0,212,170,0.12)' },
  };
  const roleCfg = roleConfig[user?.role] || roleConfig.manager;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className={`sidebar${collapsed ? ' collapsed' : ''}`}>
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">T&E</div>
        {!collapsed && <div className="logo-text">Smart <span>T&E</span></div>}
        <button className="sidebar-toggle" onClick={() => setCollapsed(c => !c)} title={collapsed ? 'Expand' : 'Collapse'}>
          <i className={collapsed ? 'ri-menu-unfold-line' : 'ri-menu-fold-line'}></i>
        </button>
      </div>

      {/* Main Navigation */}
      <div className="sidebar-section">
        {!collapsed && <div className="sidebar-section-label">Main</div>}
        <NavLink className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`} to="/portal/dashboard">
          <span className="nav-icon"><i className="ri-dashboard-line"></i></span>
          {!collapsed && <span>Dashboard</span>}
        </NavLink>
      </div>

      {/* Approvals Navigation */}
      <div className="sidebar-section">
        {!collapsed && <div className="sidebar-section-label">Approvals</div>}
        <NavLink className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`} to="/portal/approval">
          <span className="nav-icon"><i className="ri-map-2-line"></i></span>
          {!collapsed && <span>Journey Review</span>}
          {!collapsed && <span className="nav-dot"></span>}
        </NavLink>
        <NavLink className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`} to="/portal/expenses">
          <span className="nav-icon"><i className="ri-file-list-3-line"></i></span>
          {!collapsed && <span>Expense Claims</span>}
        </NavLink>
        <NavLink className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`} to="/portal/analytics">
          <span className="nav-icon"><i className="ri-bar-chart-2-line"></i></span>
          {!collapsed && <span>Analytics</span>}
        </NavLink>
      </div>

      {/* Admin Navigation */}
      {isAdmin() && (
        <div className="sidebar-section sidebar-section-admin">
          {!collapsed && <div className="sidebar-section-label">Admin</div>}
          <NavLink className={({ isActive }) => `nav-item nav-admin-only${isActive ? ' active' : ''}`} to="/portal/rules">
            <span className="nav-icon"><i className="ri-settings-3-line"></i></span>
            {!collapsed && <span>Rule Engine</span>}
          </NavLink>
          <NavLink className={({ isActive }) => `nav-item nav-admin-only${isActive ? ' active' : ''}`} to="/portal/users">
            <span className="nav-icon"><i className="ri-team-line"></i></span>
            {!collapsed && <span>Users & Grades</span>}
          </NavLink>
        </div>
      )}

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="user-card">
          <div className="user-avatar">{avatar}</div>
          {!collapsed && (
            <div className="user-info">
              <div className="user-name">{user?.name}</div>
              <div id="sidebar-role-chip" style={{
                display: 'inline-block', fontSize: 10, fontWeight: 700,
                padding: '2px 8px', borderRadius: 8,
                color: roleCfg.color, background: roleCfg.bg,
                border: `1px solid ${roleCfg.color}33`,
                marginTop: 2, letterSpacing: '0.5px', textTransform: 'uppercase',
              }}>{roleCfg.label}</div>
            </div>
          )}
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          <span className="nav-icon"><i className="ri-logout-box-line"></i></span>
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );
}
