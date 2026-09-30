import React, { useState } from 'react';
import { useAdminToast } from '../context/AdminToastContext';
import { FiSettings, FiSave, FiCreditCard, FiMail, FiGlobe } from 'react-icons/fi';

export default function AdminSettingsPage() {
  const [storeName, setStoreName] = useState('MILIVA');
  const [supportEmail, setSupportEmail] = useState('support@miliva.com');
  const [currency, setCurrency] = useState('INR (₹)');
  const [razorpayKey, setRazorpayKey] = useState('rzp_test_983247923847');

  const { showToast } = useAdminToast();

  const handleSave = (e) => {
    e.preventDefault();
    showToast('Store settings updated successfully', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
        <div>
          <h2 className="text-xl font-bold text-white">MILIVA Store Configuration</h2>
          <p className="text-neutral-400 text-sm mt-1">Payment gateway integration, business email & regional options</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
              Brand / Store Title
            </label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
              Customer Support Email
            </label>
            <input
              type="email"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
              Base Currency
            </label>
            <input
              type="text"
              disabled
              value={currency}
              className="w-full bg-neutral-950/60 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-400 font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
              Razorpay Live Key ID
            </label>
            <input
              type="text"
              value={razorpayKey}
              onChange={(e) => setRazorpayKey(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-neutral-800">
          <button
            type="submit"
            className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-bold px-6 py-2.5 rounded-xl text-sm transition-colors shadow-lg shadow-emerald-500/10"
          >
            <FiSave className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
