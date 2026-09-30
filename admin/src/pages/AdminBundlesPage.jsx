import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import { useAdminToast } from '../context/AdminToastContext';
import { FiPackage, FiRefreshCw, FiPlus, FiCheckCircle, FiEdit, FiTrash2 } from 'react-icons/fi';

export default function AdminBundlesPage() {
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useAdminToast();

  const loadBundles = async () => {
    setLoading(true);
    try {
      const res = await adminService.getBundles();
      if (res.success) setBundles(res.bundles || []);
    } catch (err) {
      showToast('Error fetching bundle packages', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBundles();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
        <div>
          <h2 className="text-xl font-bold text-white">Bundles & Combo Offers</h2>
          <p className="text-neutral-400 text-sm mt-1">Manage duo packs (Face Cleanser + Face Serum) and special value sets</p>
        </div>
        <button
          onClick={loadBundles}
          className="flex items-center space-x-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 px-4 py-2.5 rounded-xl text-sm transition-colors border border-neutral-700"
        >
          <FiRefreshCw className="w-4 h-4" />
          <span>Refresh Bundles</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <FiRefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
        </div>
      ) : bundles.length === 0 ? (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-12 text-center">
          <FiPackage className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No bundles configured</h3>
          <p className="text-neutral-400 text-sm mt-1">Bundles like the MILIVA Acne Care Combo will display here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bundles.map((bundle) => (
            <div key={bundle._id} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    Official MILIVA Combo
                  </span>
                  <h3 className="text-xl font-bold text-white mt-2">{bundle.name}</h3>
                  <p className="text-xs text-neutral-400 mt-1 line-clamp-2">{bundle.description}</p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-extrabold text-emerald-400 block">₹{bundle.bundlePrice}</span>
                  <span className="text-xs text-neutral-500 line-through">₹{bundle.originalPrice}</span>
                </div>
              </div>

              {/* Items included */}
              <div className="mt-4 pt-4 border-t border-neutral-800 space-y-2">
                <p className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">Bundle Components:</p>
                {bundle.items?.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs bg-neutral-950 p-2.5 rounded-lg border border-neutral-800">
                    <span className="text-neutral-200 font-medium">
                      {item.product?.name || 'MILIVA Product'} ({item.size})
                    </span>
                    <span className="text-emerald-400 font-bold">Qty: {item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex justify-between items-center text-xs text-neutral-400 pt-3 border-t border-neutral-800">
                <span>Savings: <strong className="text-emerald-400">₹{bundle.originalPrice - bundle.bundlePrice} OFF</strong></span>
                <span className="font-mono">SKU: {bundle.sku}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
