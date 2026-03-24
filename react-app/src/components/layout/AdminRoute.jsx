import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';

export default function AdminRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  if (user.role === 'field') return <Navigate to="/mobile/home" replace />;
  if (user.role !== 'admin') return <Navigate to="/portal/dashboard" replace />;
  return children;
}
