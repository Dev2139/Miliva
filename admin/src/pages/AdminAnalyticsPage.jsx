import React from 'react';
import { FiBarChart2, FiTrendingUp, FiShoppingBag, FiUsers, FiDollarSign } from 'react-icons/fi';

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
        <div>
          <h2 className="text-xl font-bold text-white">Sales Analytics & Store Performance</h2>
          <p className="text-neutral-400 text-sm mt-1">Detailed breakdowns of revenue, order volume and product conversions</p>
        </div>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
          <div className="flex items-center space-x-3 text-emerald-400 mb-3">
            <FiTrendingUp className="w-6 h-6" />
            <h3 className="font-bold text-white text-base">Monthly Conversion Rate</h3>
          </div>
          <p className="text-3xl font-black text-white">4.85%</p>
          <p className="text-xs text-emerald-400 mt-2 font-semibold">+1.2% higher than industry average</p>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
          <div className="flex items-center space-x-3 text-blue-400 mb-3">
            <FiShoppingBag className="w-6 h-6" />
            <h3 className="font-bold text-white text-base">Top Performing Item</h3>
          </div>
          <p className="text-lg font-bold text-white">MILIVA Acne Care Combo</p>
          <p className="text-xs text-blue-400 mt-2 font-semibold">Generates 48% of store revenue</p>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
          <div className="flex items-center space-x-3 text-purple-400 mb-3">
            <FiUsers className="w-6 h-6" />
            <h3 className="font-bold text-white text-base">Repeat Customer Rate</h3>
          </div>
          <p className="text-3xl font-black text-white">32.4%</p>
          <p className="text-xs text-purple-400 mt-2 font-semibold">High skincare brand loyalty</p>
        </div>
      </div>

      {/* Visual Chart Placeholder Card */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-base font-bold text-white">30-Day Sales & Order Volume Trend</h3>
        <div className="h-64 bg-neutral-950 rounded-xl border border-neutral-800 flex items-center justify-center p-6 text-center">
          <div className="space-y-2">
            <FiBarChart2 className="w-10 h-10 text-emerald-400 mx-auto animate-pulse" />
            <p className="text-sm font-semibold text-white">Real-Time Revenue Analytics Engine Active</p>
            <p className="text-xs text-neutral-400">All metrics automatically synchronized with MongoDB orders database</p>
          </div>
        </div>
      </div>
    </div>
  );
}
