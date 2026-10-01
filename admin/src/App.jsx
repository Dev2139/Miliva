import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import { AdminToastProvider } from './context/AdminToastContext';

import AdminLayout from './components/AdminLayout';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminProductsPage from './pages/AdminProductsPage';
import AdminCategoriesPage from './pages/AdminCategoriesPage';
import AdminBundlesPage from './pages/AdminBundlesPage';
import AdminInventoryPage from './pages/AdminInventoryPage';
import AdminOrdersPage from './pages/AdminOrdersPage';
import AdminCustomersPage from './pages/AdminCustomersPage';
import AdminReviewsPage from './pages/AdminReviewsPage';
import AdminCouponsPage from './pages/AdminCouponsPage';
import AdminAnalyticsPage from './pages/AdminAnalyticsPage';
import AdminBannersPage from './pages/AdminBannersPage';
import AdminSettingsPage from './pages/AdminSettingsPage';

function ProtectedAdminRoute({ children }) {
  const { isAuthenticated, loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-neutral-900 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  return (
    <AdminToastProvider>
      <AdminAuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Login Route */}
            <Route path="/login" element={<AdminLoginPage />} />

            {/* Protected Admin Console Routes */}
            <Route
              path="/"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout />
                </ProtectedAdminRoute>
              }
            >
              <Route index element={<AdminDashboardPage />} />
              <Route path="products" element={<AdminProductsPage />} />
              <Route path="categories" element={<AdminCategoriesPage />} />
              <Route path="bundles" element={<AdminBundlesPage />} />
              <Route path="inventory" element={<AdminInventoryPage />} />
              <Route path="orders" element={<AdminOrdersPage />} />
              <Route path="customers" element={<AdminCustomersPage />} />
              <Route path="reviews" element={<AdminReviewsPage />} />
              <Route path="coupons" element={<AdminCouponsPage />} />
              <Route path="analytics" element={<AdminAnalyticsPage />} />
              <Route path="banners" element={<AdminBannersPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AdminAuthProvider>
    </AdminToastProvider>
  );
}
