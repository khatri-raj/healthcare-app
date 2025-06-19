import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: !!localStorage.getItem('access_token'),
    userType: localStorage.getItem('userType') || null,
    accessToken: localStorage.getItem('access_token') || null,
  });

  const login = (accessToken, userType) => {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('userType', userType);
    setAuthState({ isAuthenticated: true, userType, accessToken });
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('userType');
    setAuthState({ isAuthenticated: false, userType: null, accessToken: null });
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};