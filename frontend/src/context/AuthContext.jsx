import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: !!localStorage.getItem('access_token'),
    userType: localStorage.getItem('userType') || null,
    accessToken: localStorage.getItem('access_token') || null,
    refreshToken: localStorage.getItem('refresh_token') || null,
  });

  useEffect(() => {
    console.log('Auth State Updated:', authState);
  }, [authState]);

  const login = (accessToken, refreshToken, userType) => {
    console.log('Logging in with:', { accessToken, refreshToken, userType });
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    localStorage.setItem('userType', userType);
    setAuthState({
      isAuthenticated: true,
      userType,
      accessToken,
      refreshToken,
    });
  };

  const logout = () => {
    console.log('Logging out');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('userType');
    setAuthState({
      isAuthenticated: false,
      userType: null,
      accessToken: null,
      refreshToken: null,
    });
  };

  const refreshToken = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/token/refresh/', {
        refresh: authState.refreshToken,
      });
      const { access } = response.data;
      localStorage.setItem('access_token', access);
      setAuthState({ ...authState, accessToken: access });
      return access;
    } catch (err) {
      console.error('Token refresh failed:', err);
      logout();
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
};