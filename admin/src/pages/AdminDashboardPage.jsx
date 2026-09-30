import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../services/adminService';
import { useAdminToast } from '../context/AdminToastContext';
import { 
  FiDollarSign, 
  FiShoppingBag, 
  FiUsers, 
  FiBox, 
  FiAlertTriangle, 
  FiTrendingUp, 
  FiArrowUpRight,
  FiPlus,
  FiRefreshCw
} from 'react-icons/fi';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useAdminToast();

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const res = await adminService.getDashboardStats();
      if (res.success) {
        setStats(res.stats);
        setRecentOrders(res.recentOrders || []);
        setLowStockProducts(res.lowStockProducts || []);
      }
    } catch (err) {
      showToast('Failed to load dashboard statistics', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-3">
          <FiRefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
          <p className="text-neutral-400 text-sm">Loading MILIVA Admin Analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
        <div>
          <h2 className="text-xl font-bold text-white">MILIVA Store Overview</h2>
          <p className="text-neutral-400 text-sm mt-1">Real-time performance metrics and store management</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/products"
            className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-bold px-4 py-2.5 rounded-xl text-sm transition-colors"
          >
            <FiPlus className="w-4 h-4" />
            <span>Manage Products</span>
          </Link>
          <button
            onClick={loadDashboard}
            className="flex items-center space-x-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 px-4 py-2.5 rounded-xl text-sm transition-colors border border-neutral-700"
          >
            <FiRefreshCw className="w-4 h-4" />
            <span>Refresh Data</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 hover:border-neutral-700 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Total Sales</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <FiDollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-white">₹{(stats?.totalSales || 0).toLocaleString()}</h3>
            <p className="text-xs text-emerald-400 mt-1 flex items-center font-medium">
              <FiTrendingUp className="w-3.5 h-3.5 mr-1" />
              Today: ₹{(stats?.todaySales || 0).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 hover:border-neutral-700 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Total Orders</span>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <FiShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-white">{stats?.totalOrders || 0}</h3>
            <p className="text-xs text-blue-400 mt-1 font-medium">
              Today: {stats?.todayOrdersCount || 0} orders
            </p>
          </div>
        </div>

        {/* Total Customers */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 hover:border-neutral-700 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Registered Users</span>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <FiUsers className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-white">{stats?.totalCustomers || 0}</h3>
            <p className="text-xs text-purple-400 mt-1 font-medium">Active Customer Accounts</p>
          </div>
        </div>

        {/* Avg Order Value */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 hover:border-neutral-700 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Avg Order Value</span>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <FiBox className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-white">₹{(stats?.avgOrderValue || 0).toLocaleString()}</h3>
            <p className="text-xs text-amber-400 mt-1 font-medium">Per checkout average</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Orders & Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders (2 cols) */}
        <div className="lg:col-span-2 bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-white">Recent Orders</h3>
              <p className="text-xs text-neutral-400">Latest customer transactions</p>
            </div>
            <Link
              to="/orders"
              className="text-xs font-semibold text-emerald-400 hover:underline flex items-center"
            >
              View All Orders <FiArrowUpRight className="ml-1" />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-sm text-neutral-500 py-6 text-center">No orders placed yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-neutral-800 text-neutral-500 text-xs uppercase font-medium">
                    <th className="pb-3 px-2">Order #</th>
                    <th className="pb-3 px-2">Customer</th>
                    <th className="pb-3 px-2">Amount</th>
                    <th className="pb-3 px-2">Status</th>
                    <th className="pb-3 px-2">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {recentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-neutral-800/30 transition-colors">
                      <td className="py-3 px-2 font-mono text-emerald-400 font-semibold text-xs">
                        #{order.orderNumber || order._id.substring(18)}
                      </td>
                      <td className="py-3 px-2 text-neutral-200">
                        {order.user?.name || order.shippingAddress?.fullName || 'Customer'}
                      </td>
                      <td className="py-3 px-2 font-semibold text-white">
                        ₹{order.totalAmount}
                      </td>
                      <td className="py-3 px-2">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          order.orderStatus === 'Delivered' 
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : order.orderStatus === 'Shipped'
                            ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                            : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        }`}>
                          {order.orderStatus || 'Processing'}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-xs text-neutral-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Low Stock Alerts (1 col) */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <FiAlertTriangle className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-bold text-white">Inventory Alerts</h3>
            </div>
            <Link to="/inventory" className="text-xs font-semibold text-emerald-400 hover:underline">
              Inventory
            </Link>
          </div>

          {lowStockProducts.length === 0 ? (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
              <p className="text-emerald-400 text-xs font-semibold">All products well-stocked!</p>
              <p className="text-neutral-400 text-xs mt-1">No products below 10 units.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {lowStockProducts.map((prod) => (
                <div 
                  key={prod._id}
                  className="flex items-center justify-between p-3 rounded-xl bg-neutral-950 border border-amber-500/20"
                >
                  <div className="flex items-center space-x-3">
                    <img 
                      src={prod.images?.[0]?.url || prod.images?.[0] || '/images/cleanser.svg'} 
                      alt={prod.name}
                      className="w-10 h-10 rounded-lg object-contain bg-neutral-900 p-1"
                    />
                    <div>
                      <p className="text-sm font-semibold text-white truncate max-w-[150px]">{prod.name}</p>
                      <p className="text-xs text-neutral-400">SKU: {prod.sku}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-amber-400 px-2 py-1 bg-amber-500/10 rounded-md border border-amber-500/30">
                      {prod.stock} left
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quick Info Box */}
          <div className="mt-6 pt-6 border-t border-neutral-800">
            <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">MILIVA Active Lineup</h4>
            <div className="space-y-2 text-xs text-neutral-300">
              <div className="flex justify-between py-1">
                <span>MILIVA Face Cleanser</span>
                <span className="font-semibold text-emerald-400">2 Size Variants</span>
              </div>
              <div className="flex justify-between py-1">
                <span>MILIVA Face Serum</span>
                <span className="font-semibold text-emerald-400">2 Size Variants</span>
              </div>
              <div className="flex justify-between py-1">
                <span>MILIVA Acne Care Combo</span>
                <span className="font-semibold text-emerald-400">Active Bundle</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
