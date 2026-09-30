import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('miliva_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('miliva_token');
      if (token) {
        try {
          const res = await authService.getMe();
          if (res.user) {
            setUser(res.user);
            localStorage.setItem('miliva_user', JSON.stringify(res.user));
          }
        } catch (err) {
          authService.logout();
          setUser(null);
        }
      }
      setLoading(false);
    };
    checkLoggedIn();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await authService.login({ email, password });
      setUser(res.user);
      showToast('Welcome back to Miliva!', 'success');
      return res;
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      showToast(msg, 'error');
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      const res = await authService.register(userData);
      setUser(res.user);
      showToast('Account created successfully!', 'success');
      return res;
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      showToast(msg, 'error');
      throw err;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    showToast('Logged out successfully', 'info');
  };

  const updateProfile = async (data) => {
    try {
      const res = await authService.updateProfile(data);
      setUser(res.user);
      showToast('Profile updated successfully', 'success');
      return res;
    } catch (err) {
      const msg = err.response?.data?.message || 'Update failed';
      showToast(msg, 'error');
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
