import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { ToastProvider } from './contexts/ToastContext.jsx';

// Pages
import LoginPage from './pages/LoginPage.jsx';

// Portal pages
import DashboardPage from './pages/portal/DashboardPage.jsx';
import ApprovalPage from './pages/portal/ApprovalPage.jsx';
import ExpensesPage from './pages/portal/ExpensesPage.jsx';
import AnalyticsPage from './pages/portal/AnalyticsPage.jsx';
import RulesPage from './pages/portal/RulesPage.jsx';
import UsersPage from './pages/portal/UsersPage.jsx';

// Mobile pages
import MobileHomePage from './pages/mobile/MobileHomePage.jsx';
import AttendancePage from './pages/mobile/AttendancePage.jsx';
import MobileExpensePage from './pages/mobile/MobileExpensePage.jsx';
import TripPage from './pages/mobile/TripPage.jsx';
import HistoryPage from './pages/mobile/HistoryPage.jsx';

// Route guards
import PortalRoute from './components/layout/PortalRoute.jsx';
import AdminRoute from './components/layout/AdminRoute.jsx';
import MobileRoute from './components/layout/MobileRoute.jsx';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/login" element={<LoginPage />} />

              {/* Portal routes */}
              <Route path="/portal/dashboard" element={<PortalRoute><DashboardPage /></PortalRoute>} />
              <Route path="/portal/approval" element={<PortalRoute><ApprovalPage /></PortalRoute>} />
              <Route path="/portal/expenses" element={<PortalRoute><ExpensesPage /></PortalRoute>} />
              <Route path="/portal/analytics" element={<PortalRoute><AnalyticsPage /></PortalRoute>} />
              <Route path="/portal/rules" element={<AdminRoute><RulesPage /></AdminRoute>} />
              <Route path="/portal/users" element={<AdminRoute><UsersPage /></AdminRoute>} />

              {/* Mobile routes */}
              <Route path="/mobile/home" element={<MobileRoute><MobileHomePage /></MobileRoute>} />
              <Route path="/mobile/attendance" element={<MobileRoute><AttendancePage /></MobileRoute>} />
              <Route path="/mobile/expense" element={<MobileRoute><MobileExpensePage /></MobileRoute>} />
              <Route path="/mobile/trip" element={<MobileRoute><TripPage /></MobileRoute>} />
              <Route path="/mobile/history" element={<MobileRoute><HistoryPage /></MobileRoute>} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
