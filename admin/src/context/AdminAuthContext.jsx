import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminService } from '../services/adminService';

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(() => {
    const saved = localStorage.getItem('miliva_admin_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('miliva_admin_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      if (token) {
        try {
          const res = await adminService.getMe();
          if (res.success && res.user.role === 'admin') {
            setAdminUser(res.user);
            localStorage.setItem('miliva_admin_user', JSON.stringify(res.user));
          } else {
            logout();
          }
        } catch (err) {
          console.error('Admin session invalid:', err);
          logout();
        }
      } else {
        setAdminUser(null);
      }
      setLoading(false);
    };

    verifyAuth();
  }, [token]);

  const login = async (email, password) => {
    const res = await adminService.login(email, password);
    if (res.success) {
      if (res.user.role !== 'admin') {
        logout();
        throw new Error('Access denied: User is not an administrator.');
      }
      setToken(res.token);
      setAdminUser(res.user);
      return res;
    }
    throw new Error(res.message || 'Login failed');
  };

  const logout = () => {
    adminService.logout();
    setToken(null);
    setAdminUser(null);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        adminUser,
        token,
        isAuthenticated: !!token && adminUser?.role === 'admin',
        loading,
        login,
        logout
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
