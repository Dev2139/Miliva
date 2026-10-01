import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useAdminToast } from '../context/AdminToastContext';
import { FiLock, FiMail, FiArrowRight } from 'react-icons/fi';

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
    <div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Brand Title / Header */}
        <div className="text-center space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-500 bg-neutral-200/60 px-3 py-1 border border-neutral-300 rounded-xs inline-block">
            Administrative Management
          </span>
          <h1 className="text-3xl font-light text-neutral-900 font-editorial">Sign In to Miliva</h1>
          <p className="text-xs text-neutral-500">Access products, inventory, customer orders & analytics portal.</p>
        </div>

        {/* Clean Luxury Cream Card */}
        <form onSubmit={handleSubmit} className="p-8 bg-cream border border-subtle space-y-4 shadow-xs">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700 block mb-1">
              Admin Email
            </label>
            <div className="relative">
              <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@miliva.com"
                className="w-full text-xs pl-10 pr-3 py-2.5 border border-neutral-300 bg-white text-neutral-900 focus:outline-none focus:border-neutral-900 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700 block mb-1">
              Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs pl-10 pr-3 py-2.5 border border-neutral-300 bg-white text-neutral-900 focus:outline-none focus:border-neutral-900 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-neutral-900 text-white text-xs uppercase font-bold tracking-widest hover:bg-black transition-colors disabled:opacity-50 mt-4 flex items-center justify-center space-x-2"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Admin Dashboard'}</span>
            {!loading && <FiArrowRight className="w-4 h-4" />}
          </button>

          <div className="pt-4 border-t border-subtle text-center">
            <p className="text-[11px] text-neutral-500">
              Demo Credentials: <code className="bg-white px-1.5 py-0.5 border border-neutral-300 font-semibold text-neutral-800">admin@miliva.com</code> / <code className="bg-white px-1.5 py-0.5 border border-neutral-300 font-semibold text-neutral-800">Admin@123456</code>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
