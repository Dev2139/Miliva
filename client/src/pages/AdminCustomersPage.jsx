import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/admin/AdminSidebar';
import { adminService } from '../services/adminService';
import { useToast } from '../context/ToastContext';

const AdminCustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await adminService.getCustomers();
      setCustomers(res.customers || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleToggle = async (id) => {
    try {
      const res = await adminService.toggleUserStatus(id);
      showToast(res.message, 'info');
      fetchCustomers();
    } catch (err) {
      showToast('Toggle failed', 'error');
    }
  };

  return (
    <div className="flex min-h-screen bg-neutral-100">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-6">
        <div className="border-b border-neutral-300 pb-4">
          <h1 className="text-2xl font-bold text-neutral-900 font-editorial">Customer Accounts</h1>
          <p className="text-xs text-neutral-500">View customer lifetime spending, order counts and status</p>
        </div>

        <div className="bg-white border border-neutral-200 overflow-x-auto shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-900 text-white uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Customer</th>
                <th className="p-4">Email</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Total Orders</th>
                <th className="p-4">Lifetime Spent</th>
                <th className="p-4">Account Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {customers.map((c) => (
                <tr key={c._id} className="hover:bg-neutral-50">
                  <td className="p-4 font-bold text-neutral-900">{c.name}</td>
                  <td className="p-4">{c.email}</td>
                  <td className="p-4 font-mono">{c.phone || '-'}</td>
                  <td className="p-4 font-semibold">{c.orderCount || 0}</td>
                  <td className="p-4 font-bold text-neutral-900">₹{(c.totalSpent || 0).toLocaleString('en-IN')}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 text-[10px] uppercase font-bold ${c.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                      {c.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleToggle(c._id)}
                      className="px-3 py-1 bg-neutral-900 text-white text-[10px] uppercase font-bold tracking-wider"
                    >
                      {c.isActive ? 'Disable' : 'Enable'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AdminCustomersPage;
