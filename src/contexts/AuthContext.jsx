import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('civic_user');
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  });

  const login = (userData, token) => {
    localStorage.setItem('civic_token', token);
    localStorage.setItem('civic_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('civic_token');
    localStorage.removeItem('civic_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
