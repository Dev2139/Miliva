import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useAdminToast } from '../context/AdminToastContext';
import { FiLock, FiMail, FiShield, FiArrowRight } from 'react-icons/fi';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('admin@miliva.com');
  const [password, setPassword] = useState('Admin@123456');
  const [loading, setLoading] = useState(false);

  const { login } = useAdminAuth();
  const { showToast } = useAdminToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      showToast('Welcome back, Admin!', 'success');
      navigate('/');
    } catch (err) {
      showToast(err.message || 'Invalid credentials', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <img
            src="https://res.cloudinary.com/urzka7oz/image/upload/v1790754694/Screenshot_2026-09-30_131941-removebg-preview.png"
            alt="Miliva Skincare Logo"
            className="h-12 w-auto object-contain mx-auto mb-3 brightness-0 invert"
          />
          <p className="text-xs font-semibold tracking-wider text-emerald-400 uppercase mt-1">SKINCARE ADMINISTRATOR PORTAL</p>
          <p className="text-sm text-neutral-400 mt-2">Sign in to manage products, orders, inventory & analytics</p>
        </div>

        {/* Card */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-neutral-300 uppercase tracking-wider mb-2">
                Admin Email
              </label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  placeholder="admin@miliva.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-neutral-950 font-bold rounded-xl text-sm transition-colors flex items-center justify-center space-x-2"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Admin Dashboard'}</span>
              {!loading && <FiArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-neutral-800 text-center">
            <p className="text-xs text-neutral-500">
              Demo Credentials: <span className="text-emerald-400">admin@miliva.com</span> / <span className="text-emerald-400">Admin@123456</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
