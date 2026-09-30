import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    try {
      setSubmitting(true);
      await register({ name, email, phone, password });
      navigate('/account');
    } catch (err) {
      // Toast handled
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 font-editorial">Join Miliva</span>
        <h1 className="text-3xl font-light text-neutral-900 font-editorial">Create Account</h1>
        <p className="text-xs text-neutral-500">Create your personal skincare profile and track formulations.</p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 bg-cream border border-subtle space-y-4 shadow-xs">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700 block mb-1">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Maya Lin"
            className="w-full text-xs px-3 py-2.5 border border-neutral-300 bg-white focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700 block mb-1">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="maya@example.com"
            className="w-full text-xs px-3 py-2.5 border border-neutral-300 bg-white focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700 block mb-1">Mobile Phone (Optional)</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 9876543210"
            className="w-full text-xs px-3 py-2.5 border border-neutral-300 bg-white focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700 block mb-1">Password (Min 6 chars)</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full text-xs px-3 py-2.5 border border-neutral-300 bg-white focus:outline-none"
            required
            minLength={6}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3.5 bg-neutral-900 text-white text-xs uppercase font-bold tracking-widest hover:bg-black transition-colors disabled:opacity-50 mt-4"
        >
          {submitting ? 'Creating Profile...' : 'Register Account'}
        </button>

        <div className="pt-4 border-t border-subtle text-center">
          <p className="text-xs text-neutral-600">
            Already registered?{' '}
            <Link to="/login" className="font-bold text-neutral-900 underline">
              Sign In
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
