import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import { useAdminToast } from '../context/AdminToastContext';
import { FiLayers, FiPlus, FiRefreshCw, FiCheckCircle } from 'react-icons/fi';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useAdminToast();

  const loadCategories = async () => {
    setLoading(true);
    try {
      const res = await adminService.getCategories();
      if (res.success) setCategories(res.categories || []);
    } catch (err) {
      showToast('Error loading categories', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
        <div>
          <h2 className="text-xl font-bold text-white">Product Categories</h2>
          <p className="text-neutral-400 text-sm mt-1">Manage cosmetic lines and product taxonomy</p>
        </div>
        <button
          onClick={loadCategories}
          className="flex items-center space-x-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 px-4 py-2.5 rounded-xl text-sm transition-colors border border-neutral-700"
        >
          <FiRefreshCw className="w-4 h-4" />
          <span>Refresh Categories</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <FiRefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div key={cat._id} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 hover:border-emerald-500/40 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <FiLayers className="w-5 h-5" />
                </span>
                <span className="text-xs font-mono bg-neutral-950 px-2.5 py-1 rounded-md border border-neutral-800 text-neutral-400">
                  /{cat.slug}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">{cat.name}</h3>
              <p className="text-xs text-neutral-400 mt-1">{cat.description || 'MILIVA official skincare category'}</p>

              <div className="mt-4 pt-4 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-300">
                <span className="flex items-center text-emerald-400 font-semibold">
                  <FiCheckCircle className="w-3.5 h-3.5 mr-1" /> Active Lineup
                </span>
                <span className="text-neutral-400">Category ID: {cat._id.substring(18)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
