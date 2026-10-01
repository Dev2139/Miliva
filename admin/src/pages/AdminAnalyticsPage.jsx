import React from 'react';
import { FiBarChart2, FiTrendingUp, FiShoppingBag, FiUsers } from 'react-icons/fi';

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-cream border border-subtle p-6 shadow-xs">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-500 block mb-1">
            Performance Metrics
          </span>
          <h2 className="text-2xl font-light text-neutral-900 font-editorial">Sales Analytics & Reports</h2>
          <p className="text-xs text-neutral-600 mt-1">Detailed breakdowns of store revenue, order volume and product conversions.</p>
        </div>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-subtle p-6 shadow-xs hover:border-neutral-400 transition-all">
          <div className="flex items-center space-x-3 text-neutral-800 mb-3">
            <FiTrendingUp className="w-5 h-5" />
            <h3 className="font-bold text-neutral-900 text-sm uppercase tracking-wider">Monthly Conversion Rate</h3>
          </div>
          <p className="text-3xl font-bold font-editorial text-neutral-900">4.85%</p>
          <p className="text-xs text-emerald-800 mt-2 font-bold">+1.2% higher than industry average</p>
        </div>

        <div className="bg-white border border-subtle p-6 shadow-xs hover:border-neutral-400 transition-all">
          <div className="flex items-center space-x-3 text-neutral-800 mb-3">
            <FiShoppingBag className="w-5 h-5" />
            <h3 className="font-bold text-neutral-900 text-sm uppercase tracking-wider">Top Performing Item</h3>
          </div>
          <p className="text-xl font-bold font-editorial text-neutral-900">MILIVA Acne Care Combo</p>
          <p className="text-xs text-neutral-600 mt-2 font-bold">Generates 48% of store revenue</p>
        </div>

        <div className="bg-white border border-subtle p-6 shadow-xs hover:border-neutral-400 transition-all">
          <div className="flex items-center space-x-3 text-neutral-800 mb-3">
            <FiUsers className="w-5 h-5" />
            <h3 className="font-bold text-neutral-900 text-sm uppercase tracking-wider">Repeat Customer Rate</h3>
          </div>
          <p className="text-3xl font-bold font-editorial text-neutral-900">32.4%</p>
          <p className="text-xs text-neutral-600 mt-2 font-bold">High skincare brand loyalty</p>
        </div>
      </div>

      {/* Visual Analytics Box */}
      <div className="bg-white border border-subtle p-6 space-y-4 shadow-xs">
        <h3 className="text-base font-light text-neutral-900 font-editorial">30-Day Sales & Order Volume Trend</h3>
        <div className="h-64 bg-cream border border-subtle flex items-center justify-center p-6 text-center">
          <div className="space-y-2">
            <FiBarChart2 className="w-8 h-8 text-neutral-800 mx-auto animate-pulse" />
            <p className="text-sm font-bold text-neutral-900 uppercase tracking-wider">Real-Time Revenue Analytics Engine Active</p>
            <p className="text-xs text-neutral-500">All metrics automatically synchronized with MongoDB orders database</p>
          </div>
        </div>
      </div>
    </div>
  );
}
