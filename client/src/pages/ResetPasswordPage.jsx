import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { useToast } from '../context/ToastContext';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }
    try {
      setSubmitting(true);
      await authService.resetPassword({ resetToken: token, password });
      showToast('Password reset successfully. Please log in.', 'success');
      navigate('/login');
    } catch (err) {
      showToast(err.response?.data?.message || 'Password reset failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-light text-neutral-900 font-editorial">Set New Password</h1>
        <p className="text-xs text-neutral-500">Enter your new secure password below.</p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 bg-cream border border-subtle space-y-4">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700 block mb-1">New Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full text-xs px-3 py-2.5 border border-neutral-300 bg-white focus:outline-none"
            required
            minLength={6}
          />
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700 block mb-1">Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full text-xs px-3 py-2.5 border border-neutral-300 bg-white focus:outline-none"
            required
            minLength={6}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3.5 bg-neutral-900 text-white text-xs uppercase font-bold tracking-widest hover:bg-black transition-colors disabled:opacity-50"
        >
          {submitting ? 'Updating Password...' : 'Save New Password'}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
