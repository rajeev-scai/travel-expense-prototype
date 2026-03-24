import React from 'react';
import { useTheme } from '../../contexts/ThemeContext.jsx';

export default function TopHeader({ title, actions }) {
  const { theme, toggle } = useTheme();

  return (
    <div className="top-header">
      <div className="page-title">{title}</div>
      <div className="header-actions">
        {actions}
        <button className="icon-btn" onClick={toggle} title="Toggle Theme">
          <i className={theme === 'dark' ? 'ri-sun-line' : 'ri-moon-line'}></i>
        </button>
        <button className="icon-btn" title="Notifications">
          <i className="ri-notification-3-line"></i>
          <span className="badge"></span>
        </button>
        <div className="credits-pill">
          <i className="ri-shield-check-line"></i>
          <span>Auto: 70%</span>
        </div>
      </div>
    </div>
  );
}
