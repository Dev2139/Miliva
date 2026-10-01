import React, { useState } from 'react';
import { useAdminToast } from '../context/AdminToastContext';
import { FiSave } from 'react-icons/fi';

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
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-cream border border-subtle p-6 shadow-xs">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-500 block mb-1">
            System Configuration
          </span>
          <h2 className="text-2xl font-light text-neutral-900 font-editorial">MILIVA Store Settings</h2>
          <p className="text-xs text-neutral-600 mt-1">Payment gateway integration, business support email & currency settings.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-white border border-subtle p-6 space-y-6 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700 block mb-1">
              Brand / Store Title
            </label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 border border-neutral-300 bg-white text-neutral-900 focus:outline-none focus:border-neutral-900"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700 block mb-1">
              Customer Support Email
            </label>
            <input
              type="email"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 border border-neutral-300 bg-white text-neutral-900 focus:outline-none focus:border-neutral-900"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700 block mb-1">
              Base Currency
            </label>
            <input
              type="text"
              disabled
              value={currency}
              className="w-full text-xs px-3.5 py-2.5 border border-neutral-200 bg-neutral-100 text-neutral-600 font-bold"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700 block mb-1">
              Razorpay Live Key ID
            </label>
            <input
              type="text"
              value={razorpayKey}
              onChange={(e) => setRazorpayKey(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 border border-neutral-300 bg-white text-neutral-900 font-mono focus:outline-none focus:border-neutral-900"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-subtle">
          <button
            type="submit"
            className="flex items-center space-x-2 bg-neutral-900 hover:bg-black text-white font-bold px-6 py-2.5 text-xs uppercase tracking-wider shadow-xs transition-colors"
          >
            <FiSave className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
