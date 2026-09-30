import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiDollarSign, FiShoppingBag, FiUsers, FiPackage, FiAlertTriangle, FiArrowUpRight } from 'react-icons/fi';
import AdminSidebar from '../components/admin/AdminSidebar';
import { adminService } from '../services/adminService';

const AdminDashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await adminService.getDashboardStats();
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="flex min-h-screen bg-neutral-100">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-8 overflow-y-auto">
        <div className="flex justify-between items-center border-b border-neutral-300 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 font-editorial">Admin Operations Overview</h1>
            <p className="text-xs text-neutral-500">Real-time metrics for Miliva D2C Skincare Platform</p>
          </div>
          <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 border border-emerald-300">
            System Operational &bull; Live
          </span>
        </div>

        {loading ? (
          <div className="py-20 text-center text-xs text-neutral-500">Loading analytics pipeline...</div>
        ) : (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 bg-white border border-neutral-200 space-y-2 shadow-xs">
                <div className="flex justify-between items-center text-neutral-500">
                  <span className="text-xs uppercase font-bold tracking-wider">Total Sales Revenue</span>
                  <FiDollarSign className="w-5 h-5 text-neutral-900" />
                </div>
                <p className="text-3xl font-bold font-editorial text-neutral-900">₹{(data?.stats?.totalSales || 0).toLocaleString('en-IN')}</p>
                <p className="text-[11px] text-neutral-500">Today: ₹{(data?.stats?.todaySales || 0).toLocaleString('en-IN')}</p>
              </div>

              <div className="p-6 bg-white border border-neutral-200 space-y-2 shadow-xs">
                <div className="flex justify-between items-center text-neutral-500">
                  <span className="text-xs uppercase font-bold tracking-wider">Total Orders</span>
                  <FiShoppingBag className="w-5 h-5 text-neutral-900" />
                </div>
                <p className="text-3xl font-bold font-editorial text-neutral-900">{data?.stats?.totalOrders || 0}</p>
                <p className="text-[11px] text-neutral-500">{data?.stats?.todayOrdersCount || 0} orders placed today</p>
              </div>

              <div className="p-6 bg-white border border-neutral-200 space-y-2 shadow-xs">
                <div className="flex justify-between items-center text-neutral-500">
                  <span className="text-xs uppercase font-bold tracking-wider">Avg Order Value</span>
                  <FiPackage className="w-5 h-5 text-neutral-900" />
                </div>
                <p className="text-3xl font-bold font-editorial text-neutral-900">₹{data?.stats?.avgOrderValue || 0}</p>
                <p className="text-[11px] text-neutral-500">Per transaction mean</p>
              </div>

              <div className="p-6 bg-white border border-neutral-200 space-y-2 shadow-xs">
                <div className="flex justify-between items-center text-neutral-500">
                  <span className="text-xs uppercase font-bold tracking-wider">Registered Customers</span>
                  <FiUsers className="w-5 h-5 text-neutral-900" />
                </div>
                <p className="text-3xl font-bold font-editorial text-neutral-900">{data?.stats?.totalCustomers || 0}</p>
                <p className="text-[11px] text-neutral-500">Active accounts</p>
              </div>
            </div>

            {/* Low stock alerts if any */}
            {data?.lowStockProducts?.length > 0 && (
              <div className="p-4 bg-amber-50 border border-amber-300 text-amber-900 space-y-2">
                <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider">
                  <FiAlertTriangle className="w-4 h-4 text-amber-700" />
                  <span>Low Stock Inventory Warning ({data.lowStockProducts.length} items low)</span>
                </div>
                <div className="flex flex-wrap gap-4 text-xs">
                  {data.lowStockProducts.map((p) => (
                    <div key={p._id} className="p-2 bg-white border border-amber-200 text-neutral-800">
                      <strong>{p.name}</strong> - Only <span className="text-red-600 font-bold">{p.stock} units left</span> (SKU: {p.sku})
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Orders and Top Formulations */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Recent Orders List */}
              <div className="lg:col-span-7 bg-white p-6 border border-neutral-200 space-y-4">
                <div className="flex justify-between items-center border-b border-neutral-200 pb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">Recent Customer Orders</h3>
                  <Link to="/admin/orders" className="text-xs text-neutral-900 font-bold underline">Manage All Orders</Link>
                </div>

                <div className="divide-y divide-neutral-200 text-xs">
                  {data?.recentOrders?.map((ord) => (
                    <div key={ord._id} className="py-3 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-neutral-900 font-mono">#{ord.orderNumber}</span>
                        <p className="text-neutral-500 text-[11px]">{ord.user?.name || 'Customer'}</p>
                      </div>
                      <span className="font-bold text-neutral-900">₹{ord.totalAmount}</span>
                      <span className="px-2 py-0.5 text-[10px] uppercase font-bold bg-neutral-100 border border-neutral-300">
                        {ord.orderStatus}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Formulations */}
              <div className="lg:col-span-5 bg-white p-6 border border-neutral-200 space-y-4">
                <div className="border-b border-neutral-200 pb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">Top Selling Products</h3>
                </div>

                <div className="divide-y divide-neutral-200 text-xs space-y-2">
                  {data?.topProducts?.map((p) => (
                    <div key={p._id} className="py-2 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={p.images?.[0]} alt="" className="w-10 h-10 object-cover border border-neutral-200" />
                        <div>
                          <p className="font-bold text-neutral-900 line-clamp-1">{p.name}</p>
                          <p className="text-neutral-500 text-[10px]">Rating: ★{p.rating} ({p.reviewCount})</p>
                        </div>
                      </div>
                      <span className="font-bold">₹{p.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboardPage;
