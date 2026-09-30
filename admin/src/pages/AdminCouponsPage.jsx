import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import { useAdminToast } from '../context/AdminToastContext';
import { FiTag, FiPlus, FiTrash2, FiRefreshCw, FiCheckCircle } from 'react-icons/fi';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState([
    { _id: '1', code: 'MILIVA10', discountType: 'percentage', discountValue: 10, minPurchase: 499, isActive: true },
    { _id: '2', code: 'GLOW20', discountType: 'percentage', discountValue: 20, minPurchase: 999, isActive: true },
    { _id: '3', code: 'WELCOME100', discountType: 'fixed', discountValue: 100, minPurchase: 599, isActive: true }
  ]);
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState('');
  const [discountValue, setDiscountValue] = useState(15);
  const [minPurchase, setMinPurchase] = useState(500);

  const { showToast } = useAdminToast();

  const handleAddCoupon = (e) => {
    e.preventDefault();
    if (!code) return;
    const newC = {
      _id: Date.now().toString(),
      code: code.toUpperCase(),
      discountType: 'percentage',
      discountValue: Number(discountValue),
      minPurchase: Number(minPurchase),
      isActive: true
    };
    setCoupons(prev => [newC, ...prev]);
    showToast(`Coupon ${newC.code} added successfully`, 'success');
    setCode('');
  };

  const handleDelete = (id) => {
    setCoupons(prev => prev.filter(c => c._id !== id));
    showToast('Coupon removed', 'info');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
        <div>
          <h2 className="text-xl font-bold text-white">Coupons & Promo Codes</h2>
          <p className="text-neutral-400 text-sm mt-1">Configure promotional discounts and checkout offers</p>
        </div>
      </div>

      {/* Add Form */}
      <form onSubmit={handleAddCoupon} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Create New Discount Code</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase mb-1">Coupon Code</label>
            <input
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white font-mono uppercase focus:outline-none focus:border-emerald-500 text-xs"
              placeholder="e.g. GLOW15"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase mb-1">Discount %</label>
            <input
              type="number"
              required
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500 text-xs"
              placeholder="15"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase mb-1">Min Spend (₹)</label>
            <input
              type="number"
              required
              value={minPurchase}
              onChange={(e) => setMinPurchase(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500 text-xs"
              placeholder="499"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-bold px-5 py-2.5 rounded-xl text-xs transition-colors"
          >
            <FiPlus className="w-4 h-4" />
            <span>Create Coupon Code</span>
          </button>
        </div>
      </form>

      {/* Coupons List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {coupons.map((c) => (
          <div key={c._id} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 hover:border-emerald-500/30 transition-all">
            <div className="flex items-center justify-between">
              <span className="font-mono text-base font-black text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/30">
                {c.code}
              </span>
              <button onClick={() => handleDelete(c._id)} className="text-red-400 hover:text-red-300">
                <FiTrash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-1">
              <p className="text-lg font-bold text-white">
                {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`}
              </p>
              <p className="text-xs text-neutral-400">Min Order Spend: ₹{c.minPurchase}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
