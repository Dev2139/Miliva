import React, { useState, useEffect } from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import AdminSidebar from '../components/admin/AdminSidebar';
import { couponService } from '../services/couponService';
import { useToast } from '../context/ToastContext';

const AdminCouponsPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    code: '',
    discountType: 'percentage',
    discountAmount: 10,
    minOrderValue: 499,
    maxDiscountAmount: 300,
    expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    usageLimit: 500
  });

  const { showToast } = useToast();

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await couponService.getCoupons();
      setCoupons(res.coupons || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    try {
      await couponService.createCoupon(form);
      showToast('Coupon created', 'success');
      setShowModal(false);
      fetchCoupons();
    } catch (err) {
      showToast(err.response?.data?.message || 'Creation failed', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this coupon?')) return;
    try {
      await couponService.deleteCoupon(id);
      showToast('Coupon deleted', 'info');
      fetchCoupons();
    } catch (err) {
      showToast('Delete failed', 'error');
    }
  };

  return (
    <div className="flex min-h-screen bg-neutral-100">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-6">
        <div className="flex justify-between items-center border-b border-neutral-300 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 font-editorial">Coupons & Promotions</h1>
            <p className="text-xs text-neutral-500">Manage promo codes, minimum spend thresholds & limits</p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-neutral-900 text-white text-xs uppercase font-bold tracking-wider flex items-center gap-1.5"
          >
            <FiPlus /> Create New Coupon
          </button>
        </div>

        <div className="bg-white border border-neutral-200 overflow-x-auto shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-900 text-white uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Code</th>
                <th className="p-4">Discount</th>
                <th className="p-4">Min Spend</th>
                <th className="p-4">Max Discount</th>
                <th className="p-4">Expires</th>
                <th className="p-4">Usage</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {coupons.map((c) => (
                <tr key={c._id} className="hover:bg-neutral-50">
                  <td className="p-4 font-bold font-mono text-neutral-900">{c.code}</td>
                  <td className="p-4 font-bold">
                    {c.discountType === 'percentage' ? `${c.discountAmount}% OFF` : `₹${c.discountAmount} FLAT`}
                  </td>
                  <td className="p-4">₹{c.minOrderValue}</td>
                  <td className="p-4">{c.maxDiscountAmount ? `₹${c.maxDiscountAmount}` : 'No cap'}</td>
                  <td className="p-4">{new Date(c.expiresAt).toLocaleDateString('en-IN')}</td>
                  <td className="p-4">{c.usageCount || 0} / {c.usageLimit}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleDelete(c._id)} className="p-1.5 text-red-600 hover:text-red-800">
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal Form */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <form onSubmit={handleCreateCoupon} className="w-full max-w-md bg-white p-6 space-y-4 border border-neutral-300">
              <h3 className="text-base font-bold uppercase tracking-wider text-neutral-900">Create Coupon Code</h3>

              <div>
                <label className="text-xs font-semibold block mb-1">Coupon Code</label>
                <input
                  type="text"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. SUMMER20"
                  className="w-full text-xs px-3 py-2 border border-neutral-300 uppercase"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold block mb-1">Discount Type</label>
                  <select
                    value={form.discountType}
                    onChange={(e) => setForm({ ...form, discountType: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 bg-white"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1">Discount Value</label>
                  <input
                    type="number"
                    value={form.discountAmount}
                    onChange={(e) => setForm({ ...form, discountAmount: Number(e.target.value) })}
                    className="w-full text-xs px-3 py-2 border border-neutral-300"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold block mb-1">Min Spend (₹)</label>
                  <input
                    type="number"
                    value={form.minOrderValue}
                    onChange={(e) => setForm({ ...form, minOrderValue: Number(e.target.value) })}
                    className="w-full text-xs px-3 py-2 border border-neutral-300"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1">Max Discount (₹)</label>
                  <input
                    type="number"
                    value={form.maxDiscountAmount}
                    onChange={(e) => setForm({ ...form, maxDiscountAmount: Number(e.target.value) })}
                    className="w-full text-xs px-3 py-2 border border-neutral-300"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">Expiration Date</label>
                <input
                  type="date"
                  value={form.expiresAt}
                  onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-neutral-300"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-xs uppercase font-bold text-neutral-600">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-neutral-900 text-white text-xs uppercase font-bold tracking-wider">Create Coupon</button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminCouponsPage;
