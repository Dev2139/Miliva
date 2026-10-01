import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import { useAdminToast } from '../context/AdminToastContext';
import { FiLayers, FiRefreshCw, FiCheckCircle } from 'react-icons/fi';

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
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-cream border border-subtle p-6 shadow-xs">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-500 block mb-1">
            Taxonomy & Lines
          </span>
          <h2 className="text-2xl font-light text-neutral-900 font-editorial">Skincare Categories</h2>
          <p className="text-xs text-neutral-600 mt-1">Manage cosmetic lines and product categorization.</p>
        </div>
        <button
          onClick={loadCategories}
          className="flex items-center space-x-2 bg-white hover:bg-neutral-50 text-neutral-800 font-bold px-4 py-2.5 text-xs uppercase tracking-wider transition-colors border border-neutral-300 shadow-xs"
        >
          <FiRefreshCw className="w-4 h-4" />
          <span>Refresh List</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <FiRefreshCw className="w-7 h-7 text-neutral-900 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div key={cat._id} className="bg-white border border-subtle p-6 shadow-xs hover:border-neutral-400 transition-all flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-800">
                    <FiLayers className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-mono bg-cream px-2.5 py-1 border border-subtle text-neutral-700">
                    /{cat.slug}
                  </span>
                </div>
                <h3 className="text-xl font-light text-neutral-900 font-editorial">{cat.name}</h3>
                <p className="text-xs text-neutral-500 mt-1">{cat.description || 'MILIVA official skincare category'}</p>
              </div>

              <div className="pt-3 border-t border-subtle flex items-center justify-between text-xs text-neutral-600">
                <span className="flex items-center text-emerald-800 font-bold">
                  <FiCheckCircle className="w-3.5 h-3.5 mr-1" /> Active Lineup
                </span>
                <span className="text-[10px] font-mono text-neutral-400">ID: {cat._id.substring(18)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
