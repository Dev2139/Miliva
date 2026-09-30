import React, { useState, useEffect } from 'react';
import { FiTrendingUp, FiDollarSign, FiShoppingBag, FiUsers } from 'react-icons/fi';
import AdminLayout from '../components/admin/AdminLayout';
import { adminService } from '../services/adminService';

const AdminAnalyticsPage = () => {
  const [range, setRange] = useState('30days');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getDashboardStats().then(res => setData(res)).finally(() => setLoading(false));
  }, [range]);

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 font-editorial">Business Analytics &amp; Intelligence</h1>
            <p className="text-xs text-neutral-500">Database-derived sales metrics, order performance &amp; product velocity</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-500">Timeframe:</span>
            <select
              value={range}
              onChange={(e) => setRange(e.target.value)}
              className="text-xs px-3 py-1.5 border border-neutral-300 bg-white font-bold"
            >
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="thisMonth">This Month</option>
            </select>
          </div>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-white border border-neutral-200 space-y-2">
            <span className="text-xs uppercase font-bold text-neutral-500">Total Net Revenue</span>
            <p className="text-3xl font-bold text-neutral-900 font-editorial">₹{(data?.stats?.totalSales || 0).toLocaleString('en-IN')}</p>
            <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 border border-emerald-200">Real Database Sales</span>
          </div>

          <div className="p-6 bg-white border border-neutral-200 space-y-2">
            <span className="text-xs uppercase font-bold text-neutral-500">Orders Processed</span>
            <p className="text-3xl font-bold text-neutral-900 font-editorial">{data?.stats?.totalOrders || 0}</p>
            <span className="text-[10px] text-neutral-500 font-semibold">{data?.stats?.todayOrdersCount || 0} today</span>
          </div>

          <div className="p-6 bg-white border border-neutral-200 space-y-2">
            <span className="text-xs uppercase font-bold text-neutral-500">Average Order Value</span>
            <p className="text-3xl font-bold text-neutral-900 font-editorial">₹{data?.stats?.avgOrderValue || 0}</p>
            <span className="text-[10px] text-neutral-500">Per cart total</span>
          </div>

          <div className="p-6 bg-white border border-neutral-200 space-y-2">
            <span className="text-xs uppercase font-bold text-neutral-500">Customer Accounts</span>
            <p className="text-3xl font-bold text-neutral-900 font-editorial">{data?.stats?.totalCustomers || 0}</p>
            <span className="text-[10px] text-neutral-500">Registered users</span>
          </div>
        </div>

        {/* Breakdown by Product */}
        <div className="p-6 bg-white border border-neutral-200 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 font-editorial border-b border-neutral-200 pb-3">
            Product Revenue &amp; Rating Breakdown
          </h3>

          <div className="divide-y divide-neutral-200 text-xs">
            {data?.topProducts?.map((p) => (
              <div key={p._id} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={p.images?.[0]} alt="" className="w-10 h-10 object-cover border border-neutral-200" />
                  <div>
                    <p className="font-bold text-neutral-900">{p.name}</p>
                    <p className="text-neutral-500">Stock Available: {p.stock} units</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-neutral-900">₹{p.price}</span>
                  <span className="text-neutral-500 text-[10px] block">★{p.rating} ({p.reviewCount} reviews)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalyticsPage;
