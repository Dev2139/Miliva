import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import { useAdminToast } from '../context/AdminToastContext';
import { FiPackage, FiRefreshCw, FiCheckCircle } from 'react-icons/fi';

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
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-cream border border-subtle p-6 shadow-xs">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-500 block mb-1">
            Value Sets & Combos
          </span>
          <h2 className="text-2xl font-light text-neutral-900 font-editorial">Bundles & Duo Packs</h2>
          <p className="text-xs text-neutral-600 mt-1">Manage duo packs (Cleanser + Serum) and special value kits.</p>
        </div>
        <button
          onClick={loadBundles}
          className="flex items-center space-x-2 bg-white hover:bg-neutral-50 text-neutral-800 font-bold px-4 py-2.5 text-xs uppercase tracking-wider transition-colors border border-neutral-300 shadow-xs"
        >
          <FiRefreshCw className="w-4 h-4" />
          <span>Refresh Bundles</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <FiRefreshCw className="w-7 h-7 text-neutral-900 animate-spin" />
        </div>
      ) : bundles.length === 0 ? (
        <div className="bg-white border border-subtle p-12 text-center shadow-xs">
          <FiPackage className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
          <h3 className="text-lg font-light text-neutral-900 font-editorial">No active bundles configured</h3>
          <p className="text-xs text-neutral-500 mt-1">Bundles like the MILIVA Acne Care Combo will display here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bundles.map((bundle) => (
            <div key={bundle._id} className="bg-white border border-subtle p-6 shadow-xs space-y-4 hover:border-neutral-400 transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-neutral-100 border border-neutral-200 text-neutral-800">
                    Official MILIVA Combo
                  </span>
                  <h3 className="text-xl font-light text-neutral-900 font-editorial mt-2">{bundle.name}</h3>
                  <p className="text-xs text-neutral-500 mt-1 line-clamp-2">{bundle.description}</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold font-editorial text-neutral-900 block">₹{bundle.bundlePrice}</span>
                  <span className="text-xs text-neutral-400 line-through">₹{bundle.originalPrice}</span>
                </div>
              </div>

              {/* Items included */}
              <div className="pt-3 border-t border-subtle space-y-2">
                <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Bundle Components:</p>
                {bundle.items?.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs bg-cream p-2.5 border border-subtle">
                    <span className="text-neutral-800 font-semibold">
                      {item.product?.name || 'MILIVA Product'} ({item.size})
                    </span>
                    <span className="text-neutral-900 font-bold">Qty: {item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center text-xs text-neutral-500 pt-3 border-t border-subtle">
                <span>Savings: <strong className="text-emerald-800 font-bold">₹{bundle.originalPrice - bundle.bundlePrice} OFF</strong></span>
                <span className="font-mono text-neutral-700">SKU: {bundle.sku}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
