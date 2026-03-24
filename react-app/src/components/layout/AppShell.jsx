import React, { useState } from 'react';
import Sidebar from './Sidebar.jsx';
import TopHeader from './TopHeader.jsx';

export default function AppShell({ title, actions, children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    () => localStorage.getItem('sidebar-collapsed') === 'true'
  );

  return (
    <div className="app-shell">
      <Sidebar onCollapse={setSidebarCollapsed} />
      <div className={`main-wrap${sidebarCollapsed ? ' sidebar-collapsed' : ''}`}>
        <TopHeader title={title} actions={actions} />
        <div className="page-content">
          {children}
        </div>
      </div>
    </div>
  );
}
