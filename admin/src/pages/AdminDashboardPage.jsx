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
          <FiRefreshCw className="w-7 h-7 text-neutral-900 animate-spin" />
          <p className="text-neutral-500 text-xs uppercase tracking-wider font-semibold">Loading MILIVA Dashboard Metrics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-cream border border-subtle p-6 shadow-xs">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-500 block mb-1">
            Storefront Intelligence
          </span>
          <h2 className="text-2xl font-light text-neutral-900 font-editorial">MILIVA Operations Dashboard</h2>
          <p className="text-xs text-neutral-600 mt-1">Real-time performance metrics, orders log & inventory alerts.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/products"
            className="flex items-center space-x-2 bg-neutral-900 hover:bg-black text-white font-bold px-4 py-2.5 text-xs uppercase tracking-wider transition-colors shadow-xs"
          >
            <FiPlus className="w-4 h-4" />
            <span>Manage Products</span>
          </Link>
          <button
            onClick={loadDashboard}
            className="flex items-center space-x-2 bg-white hover:bg-neutral-50 text-neutral-800 font-bold px-4 py-2.5 text-xs uppercase tracking-wider transition-colors border border-neutral-300 shadow-xs"
          >
            <FiRefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sales */}
        <div className="bg-white border border-subtle p-5 shadow-xs hover:border-neutral-400 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Total Sales</span>
            <div className="w-9 h-9 rounded bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-800">
              <FiDollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold font-editorial text-neutral-900">₹{(stats?.totalSales || 0).toLocaleString()}</h3>
            <p className="text-xs text-emerald-700 mt-1.5 flex items-center font-semibold">
              <FiTrendingUp className="w-3.5 h-3.5 mr-1 text-emerald-600" />
              Today: ₹{(stats?.todaySales || 0).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white border border-subtle p-5 shadow-xs hover:border-neutral-400 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Total Orders</span>
            <div className="w-9 h-9 rounded bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-800">
              <FiShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold font-editorial text-neutral-900">{stats?.totalOrders || 0}</h3>
            <p className="text-xs text-neutral-600 mt-1.5 font-semibold">
              Today: {stats?.todayOrdersCount || 0} orders
            </p>
          </div>
        </div>

        {/* Total Customers */}
        <div className="bg-white border border-subtle p-5 shadow-xs hover:border-neutral-400 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Registered Users</span>
            <div className="w-9 h-9 rounded bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-800">
              <FiUsers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold font-editorial text-neutral-900">{stats?.totalCustomers || 0}</h3>
            <p className="text-xs text-neutral-600 mt-1.5 font-semibold">Active Customer Accounts</p>
          </div>
        </div>

        {/* Avg Order Value */}
        <div className="bg-white border border-subtle p-5 shadow-xs hover:border-neutral-400 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Avg Order Value</span>
            <div className="w-9 h-9 rounded bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-800">
              <FiBox className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold font-editorial text-neutral-900">₹{(stats?.avgOrderValue || 0).toLocaleString()}</h3>
            <p className="text-xs text-neutral-600 mt-1.5 font-semibold">Per checkout average</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Orders & Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders (2 cols) */}
        <div className="lg:col-span-2 bg-white border border-subtle p-6 shadow-xs">
          <div className="flex items-center justify-between mb-5 pb-4 border-b border-subtle">
            <div>
              <h3 className="text-lg font-light text-neutral-900 font-editorial">Recent Storefront Orders</h3>
              <p className="text-xs text-neutral-500">Latest transactions logged by customers</p>
            </div>
            <Link
              to="/orders"
              className="text-xs font-bold uppercase tracking-wider text-neutral-900 hover:underline flex items-center"
            >
              View All Orders <FiArrowUpRight className="ml-1" />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-xs text-neutral-500 py-8 text-center italic">No recent orders recorded.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-cream border-b border-subtle text-neutral-700 text-[10px] uppercase tracking-wider font-bold">
                    <th className="py-2.5 px-3">Order #</th>
                    <th className="py-2.5 px-3">Customer</th>
                    <th className="py-2.5 px-3">Amount</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {recentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-[#FDFBF7] transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-neutral-900">
                        #{order.orderNumber || order._id.substring(18)}
                      </td>
                      <td className="py-3 px-3 font-semibold text-neutral-800">
                        {order.user?.name || order.shippingAddress?.fullName || 'Customer'}
                      </td>
                      <td className="py-3 px-3 font-bold text-neutral-900">
                        ₹{order.totalAmount}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${
                          order.orderStatus === 'Delivered' 
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : order.orderStatus === 'Shipped'
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}>
                          {order.orderStatus || 'Processing'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-neutral-500">
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
        <div className="bg-white border border-subtle p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-subtle">
              <div className="flex items-center space-x-2">
                <FiAlertTriangle className="w-4 h-4 text-amber-600" />
                <h3 className="text-lg font-light text-neutral-900 font-editorial">Stock Alerts</h3>
              </div>
              <Link to="/inventory" className="text-xs font-bold uppercase tracking-wider text-neutral-900 hover:underline">
                Inventory
              </Link>
            </div>

            {lowStockProducts.length === 0 ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-center">
                <p className="text-emerald-800 text-xs font-bold">All Products Fully Stocked</p>
                <p className="text-emerald-700 text-[11px] mt-0.5">No products below 10 units threshold.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {lowStockProducts.map((prod) => (
                  <div 
                    key={prod._id}
                    className="flex items-center justify-between p-3 bg-cream border border-subtle"
                  >
                    <div className="flex items-center space-x-3">
                      <img 
                        src={prod.images?.[0]?.url || prod.images?.[0] || '/images/cleanser.svg'} 
                        alt={prod.name}
                        className="w-9 h-9 object-contain bg-white p-1 border border-neutral-200"
                      />
                      <div>
                        <p className="text-xs font-bold text-neutral-900 truncate max-w-[130px]">{prod.name}</p>
                        <p className="text-[10px] font-mono text-neutral-500">SKU: {prod.sku}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-amber-100 text-amber-900 border border-amber-300">
                      {prod.stock} left
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Lineup summary */}
          <div className="mt-6 pt-4 border-t border-subtle space-y-2 text-xs">
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">MILIVA Core Catalog</span>
            <div className="flex justify-between text-neutral-700 py-0.5">
              <span>MILIVA Face Cleanser</span>
              <span className="font-bold text-neutral-900">2 Size Variants</span>
            </div>
            <div className="flex justify-between text-neutral-700 py-0.5">
              <span>MILIVA Face Serum</span>
              <span className="font-bold text-neutral-900">2 Size Variants</span>
            </div>
            <div className="flex justify-between text-neutral-700 py-0.5">
              <span>Acne Care Combo</span>
              <span className="font-bold text-neutral-900">Value Set</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
