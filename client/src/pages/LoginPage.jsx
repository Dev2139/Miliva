import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/account';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    try {
      setSubmitting(true);
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      // Error toast already displayed
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">Customer Access</span>
        <h1 className="text-3xl font-light text-neutral-900 font-editorial">Sign In to Miliva</h1>
        <p className="text-xs text-neutral-500">Access your saved addresses, orders, and wishlist.</p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 bg-cream border border-subtle space-y-4 shadow-xs">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700 block mb-1">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="alex@example.com"
            className="w-full text-xs px-3 py-2.5 border border-neutral-300 bg-white focus:outline-none focus:border-neutral-900"
            required
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700">Password</label>
            <Link to="/forgot-password" className="text-[11px] text-neutral-500 hover:text-neutral-900 underline">
              Forgot Password?
            </Link>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full text-xs px-3 py-2.5 border border-neutral-300 bg-white focus:outline-none focus:border-neutral-900"
            required
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3.5 bg-neutral-900 text-white text-xs uppercase font-bold tracking-widest hover:bg-black transition-colors disabled:opacity-50 mt-4"
        >
          {submitting ? 'Authenticating...' : 'Sign In'}
        </button>

        <div className="pt-4 border-t border-subtle text-center">
          <p className="text-xs text-neutral-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-neutral-900 underline">
              Create Account
            </Link>
          </p>
        </div>
      </form>

      {/* Demo Account Callout */}
      <div className="p-4 bg-white border border-subtle text-xs text-neutral-600 space-y-1">
        <p className="font-bold text-neutral-900 uppercase tracking-wider text-[10px]">Demo Test Credentials:</p>
        <p>Customer: <code className="bg-cream px-1">alex@example.com</code> / <code className="bg-cream px-1">Customer@123456</code></p>
        <p>Admin: <code className="bg-cream px-1">admin@miliva.com</code> / <code className="bg-cream px-1">Admin@123456</code></p>
      </div>
    </div>
  );
};

export default LoginPage;
