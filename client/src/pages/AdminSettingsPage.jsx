import React, { useState } from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import { useToast } from '../context/ToastContext';

const AdminSettingsPage = () => {
  const [storeName, setStoreName] = useState('MILIVA Skincare Inc.');
  const [supportEmail, setSupportEmail] = useState('support@milivaskincare.com');
  const [razorpayKey, setRazorpayKey] = useState('rzp_test_milivaskincarekey');
  const [freeShippingLimit, setFreeShippingLimit] = useState(999);

  const { showToast } = useToast();

  const handleSaveSettings = (e) => {
    e.preventDefault();
    showToast('Platform settings saved successfully', 'success');
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-2xl">
        <div className="border-b border-neutral-200 pb-4">
          <h1 className="text-2xl font-bold text-neutral-900 font-editorial">Platform Settings</h1>
          <p className="text-xs text-neutral-500">Configure store defaults, shipping thresholds &amp; gateway keys</p>
        </div>

        <form onSubmit={handleSaveSettings} className="p-6 bg-white border border-neutral-200 space-y-4 shadow-xs">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700 block mb-1">Store Legal Name</label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-neutral-300"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700 block mb-1">Customer Support Email</label>
            <input
              type="email"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-neutral-300"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700 block mb-1">Free Shipping Order Threshold (₹)</label>
            <input
              type="number"
              value={freeShippingLimit}
              onChange={(e) => setFreeShippingLimit(Number(e.target.value))}
              className="w-full text-xs px-3 py-2 border border-neutral-300"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700 block mb-1">Razorpay Key ID</label>
            <input
              type="text"
              value={razorpayKey}
              onChange={(e) => setRazorpayKey(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-neutral-300 font-mono"
              required
            />
          </div>

          <button type="submit" className="px-6 py-2.5 bg-neutral-900 text-white text-xs uppercase font-bold tracking-widest">
            Save Settings
          </button>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminSettingsPage;
