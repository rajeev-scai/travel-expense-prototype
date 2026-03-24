import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem('te-user');
    return u ? JSON.parse(u) : null;
  });

  const login = (userData) => {
    localStorage.setItem('te-user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('te-user');
    setUser(null);
  };

  const isAdmin   = () => user?.role === 'admin';
  const isManager = () => user?.role === 'manager';
  const isField   = () => user?.role === 'field';

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, isManager, isField }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
