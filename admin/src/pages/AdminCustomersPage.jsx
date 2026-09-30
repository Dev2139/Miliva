import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import { useAdminToast } from '../context/AdminToastContext';
import { FiUsers, FiRefreshCw, FiShoppingBag, FiDollarSign, FiUserX, FiUserCheck } from 'react-icons/fi';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useAdminToast();

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const res = await adminService.getCustomers();
      if (res.success) setCustomers(res.customers || []);
    } catch (err) {
      showToast('Error fetching customer database', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleToggleStatus = async (userId) => {
    try {
      const res = await adminService.toggleUserStatus(userId);
      if (res.success) {
        showToast(res.message, 'success');
        loadCustomers();
      }
    } catch (err) {
      showToast('Failed to update user status', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
        <div>
          <h2 className="text-xl font-bold text-white">Registered Customer Accounts</h2>
          <p className="text-neutral-400 text-sm mt-1">Customer profiles, total orders count & lifetime spending metrics</p>
        </div>
        <button
          onClick={loadCustomers}
          className="flex items-center space-x-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 px-4 py-2.5 rounded-xl text-sm transition-colors border border-neutral-700"
        >
          <FiRefreshCw className="w-4 h-4" />
          <span>Refresh Database</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <FiRefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
        </div>
      ) : customers.length === 0 ? (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-12 text-center">
          <FiUsers className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No customer accounts registered yet</h3>
        </div>
      ) : (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-800 bg-neutral-950/50 text-neutral-400 text-xs uppercase tracking-wider font-semibold">
                  <th className="py-4 px-6">Customer Name</th>
                  <th className="py-4 px-6">Email Address</th>
                  <th className="py-4 px-6">Joined Date</th>
                  <th className="py-4 px-6">Orders Count</th>
                  <th className="py-4 px-6">Lifetime Spend</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Account Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {customers.map((cust) => (
                  <tr key={cust._id} className="hover:bg-neutral-800/30 transition-colors">
                    <td className="py-4 px-6 font-bold text-white">
                      {cust.name}
                    </td>
                    <td className="py-4 px-6 text-neutral-300 font-mono text-xs">
                      {cust.email}
                    </td>
                    <td className="py-4 px-6 text-neutral-400 text-xs">
                      {new Date(cust.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 font-bold text-emerald-400">
                      {cust.orderCount || 0} orders
                    </td>
                    <td className="py-4 px-6 font-extrabold text-white">
                      ₹{(cust.totalSpent || 0).toLocaleString()}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        cust.isActive !== false 
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-red-500/15 text-red-400 border border-red-500/30'
                      }`}>
                        {cust.isActive !== false ? 'Active' : 'Blocked'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleToggleStatus(cust._id)}
                        className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
                          cust.isActive !== false
                            ? 'bg-neutral-800 hover:bg-red-500/20 text-red-400 border-neutral-700'
                            : 'bg-neutral-800 hover:bg-emerald-500/20 text-emerald-400 border-neutral-700'
                        }`}
                      >
                        {cust.isActive !== false ? (
                          <>
                            <FiUserX className="w-3.5 h-3.5" />
                            <span>Deactivate Account</span>
                          </>
                        ) : (
                          <>
                            <FiUserCheck className="w-3.5 h-3.5" />
                            <span>Activate Account</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
