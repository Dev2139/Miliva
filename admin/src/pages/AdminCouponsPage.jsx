import React, { useState } from 'react';
import { useAdminToast } from '../context/AdminToastContext';
import { FiPlus, FiTrash2 } from 'react-icons/fi';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState([
    { _id: '1', code: 'MILIVA10', discountType: 'percentage', discountValue: 10, minPurchase: 499, isActive: true },
    { _id: '2', code: 'GLOW20', discountType: 'percentage', discountValue: 20, minPurchase: 999, isActive: true },
    { _id: '3', code: 'WELCOME100', discountType: 'fixed', discountValue: 100, minPurchase: 599, isActive: true }
  ]);
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
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-cream border border-subtle p-6 shadow-xs">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-500 block mb-1">
            Promotional Engine
          </span>
          <h2 className="text-2xl font-light text-neutral-900 font-editorial">Coupons & Promo Codes</h2>
          <p className="text-xs text-neutral-600 mt-1">Configure promotional discounts and checkout offers.</p>
        </div>
      </div>

      {/* Add Form */}
      <form onSubmit={handleAddCoupon} className="bg-white border border-subtle p-6 space-y-4 shadow-xs">
        <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-widest">Create New Discount Code</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700 block mb-1">Coupon Code</label>
            <input
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full bg-white border border-neutral-300 px-3 py-2 text-neutral-900 font-mono uppercase focus:outline-none focus:border-neutral-900 text-xs"
              placeholder="e.g. GLOW15"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700 block mb-1">Discount %</label>
            <input
              type="number"
              required
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
              className="w-full bg-white border border-neutral-300 px-3 py-2 text-neutral-900 focus:outline-none focus:border-neutral-900 text-xs"
              placeholder="15"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700 block mb-1">Min Spend (₹)</label>
            <input
              type="number"
              required
              value={minPurchase}
              onChange={(e) => setMinPurchase(e.target.value)}
              className="w-full bg-white border border-neutral-300 px-3 py-2 text-neutral-900 focus:outline-none focus:border-neutral-900 text-xs"
              placeholder="499"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center space-x-2 bg-neutral-900 hover:bg-black text-white font-bold px-5 py-2.5 text-xs uppercase tracking-wider shadow-xs transition-colors"
          >
            <FiPlus className="w-4 h-4" />
            <span>Create Coupon Code</span>
          </button>
        </div>
      </form>

      {/* Coupons List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {coupons.map((c) => (
          <div key={c._id} className="bg-white border border-subtle p-5 shadow-xs hover:border-neutral-400 transition-all">
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm font-bold text-neutral-900 bg-cream px-3 py-1 border border-subtle">
                {c.code}
              </span>
              <button onClick={() => handleDelete(c._id)} className="text-rose-600 hover:text-rose-800">
                <FiTrash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-1">
              <p className="text-xl font-bold font-editorial text-neutral-900">
                {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`}
              </p>
              <p className="text-xs text-neutral-500">Min Order Spend: ₹{c.minPurchase}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
