import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { useToast } from '../context/ToastContext';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    try {
      setSubmitting(true);
      const res = await authService.forgotPassword(email);
      setSent(true);
      if (res.resetToken) {
        setResetToken(res.resetToken);
      }
      showToast('Password reset link generated', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Request failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-light text-neutral-900 font-editorial">Reset Password</h1>
        <p className="text-xs text-neutral-500">Enter your email address to receive reset instructions.</p>
      </div>

      {sent ? (
        <div className="p-8 bg-cream border border-subtle text-center space-y-4">
          <p className="text-xs text-neutral-800 font-medium">
            Reset token dispatched for <strong>{email}</strong>.
          </p>
          {resetToken && (
            <div className="p-3 bg-white border border-neutral-300 text-xs font-mono break-all text-neutral-700">
              <span className="font-bold block text-neutral-900 mb-1">Development Demo Token:</span>
              <Link to={`/reset-password?token=${resetToken}`} className="text-neutral-900 underline font-semibold">
                Click here to reset password directly
              </Link>
            </div>
          )}
          <Link to="/login" className="inline-block text-xs uppercase font-bold tracking-widest text-neutral-900 underline pt-2">
            Back to Sign In
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-8 bg-cream border border-subtle space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700 block mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@example.com"
              className="w-full text-xs px-3 py-2.5 border border-neutral-300 bg-white focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-neutral-900 text-white text-xs uppercase font-bold tracking-widest hover:bg-black transition-colors disabled:opacity-50"
          >
            {submitting ? 'Generating Reset Link...' : 'Send Reset Link'}
          </button>

          <div className="text-center pt-2">
            <Link to="/login" className="text-xs text-neutral-600 hover:text-neutral-900 underline">
              Back to Login
            </Link>
          </div>
        </form>
      )}
    </div>
  );
};

export default ForgotPasswordPage;
