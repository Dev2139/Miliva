import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import { useAdminToast } from '../context/AdminToastContext';
import { FiUsers, FiRefreshCw, FiUserX, FiUserCheck } from 'react-icons/fi';

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
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-cream border border-subtle p-6 shadow-xs">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-500 block mb-1">
            Customer Directory
          </span>
          <h2 className="text-2xl font-light text-neutral-900 font-editorial">Registered Customer Accounts</h2>
          <p className="text-xs text-neutral-600 mt-1">Manage user profiles, total orders count & lifetime spending metrics.</p>
        </div>
        <button
          onClick={loadCustomers}
          className="flex items-center space-x-2 bg-white hover:bg-neutral-50 text-neutral-800 font-bold px-4 py-2.5 text-xs uppercase tracking-wider transition-colors border border-neutral-300 shadow-xs"
        >
          <FiRefreshCw className="w-4 h-4" />
          <span>Refresh Database</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <FiRefreshCw className="w-7 h-7 text-neutral-900 animate-spin" />
        </div>
      ) : customers.length === 0 ? (
        <div className="bg-white border border-subtle p-12 text-center shadow-xs">
          <FiUsers className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
          <h3 className="text-lg font-light text-neutral-900 font-editorial">No customer accounts registered yet</h3>
        </div>
      ) : (
        <div className="bg-white border border-subtle overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-cream border-b border-subtle text-neutral-700 text-[10px] uppercase tracking-wider font-bold">
                  <th className="py-3.5 px-6">Customer Name</th>
                  <th className="py-3.5 px-6">Email Address</th>
                  <th className="py-3.5 px-6">Joined Date</th>
                  <th className="py-3.5 px-6">Orders Count</th>
                  <th className="py-3.5 px-6">Lifetime Spend</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Account Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {customers.map((cust) => (
                  <tr key={cust._id} className="hover:bg-[#FDFBF7] transition-colors">
                    <td className="py-4 px-6 font-bold text-neutral-900">
                      {cust.name}
                    </td>
                    <td className="py-4 px-6 text-neutral-600 font-mono">
                      {cust.email}
                    </td>
                    <td className="py-4 px-6 text-neutral-500">
                      {new Date(cust.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 font-bold text-emerald-800">
                      {cust.orderCount || 0} orders
                    </td>
                    <td className="py-4 px-6 font-bold font-editorial text-neutral-900 text-sm">
                      ₹{(cust.totalSpent || 0).toLocaleString()}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border ${
                        cust.isActive !== false 
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-rose-50 text-rose-800 border-rose-200'
                      }`}>
                        {cust.isActive !== false ? 'Active' : 'Blocked'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleToggleStatus(cust._id)}
                        className={`inline-flex items-center space-x-1 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors ${
                          cust.isActive !== false
                            ? 'bg-white border border-neutral-300 text-rose-700 hover:bg-rose-50'
                            : 'bg-neutral-900 text-white hover:bg-black'
                        }`}
                      >
                        {cust.isActive !== false ? (
                          <>
                            <FiUserX className="w-3.5 h-3.5" />
                            <span>Deactivate</span>
                          </>
                        ) : (
                          <>
                            <FiUserCheck className="w-3.5 h-3.5" />
                            <span>Activate</span>
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
