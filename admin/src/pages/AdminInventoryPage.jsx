import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import { useAdminToast } from '../context/AdminToastContext';
import { FiShoppingBag, FiRefreshCw, FiAlertTriangle, FiCheckCircle, FiPlus, FiMinus } from 'react-icons/fi';

export default function AdminInventoryPage() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useAdminToast();

  const loadInventory = async () => {
    setLoading(true);
    try {
      const res = await adminService.getInventory();
      if (res.success) {
        setReport(res);
      }
    } catch (err) {
      showToast('Error loading inventory report', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const handleQuickStockUpdate = async (productId, currentStock, delta) => {
    const newStock = Math.max(0, currentStock + delta);
    try {
      const res = await adminService.updateProduct(productId, { stock: newStock });
      if (res.success) {
        showToast(`Stock updated to ${newStock}`, 'success');
        loadInventory();
      }
    } catch (err) {
      showToast('Failed to update stock', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
        <div>
          <h2 className="text-xl font-bold text-white">MILIVA Stock & Inventory Control</h2>
          <p className="text-neutral-400 text-sm mt-1">Monitor warehouse inventory levels and fast restock</p>
        </div>
        <button
          onClick={loadInventory}
          className="flex items-center space-x-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 px-4 py-2.5 rounded-xl text-sm transition-colors border border-neutral-700"
        >
          <FiRefreshCw className="w-4 h-4" />
          <span>Refresh Stock</span>
        </button>
      </div>

      {/* Summary Cards */}
      {report && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
            <span className="text-xs font-semibold text-neutral-400 uppercase">Active Products</span>
            <h3 className="text-2xl font-black text-white mt-1">{report.summary?.totalItems || 0}</h3>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
            <span className="text-xs font-semibold text-emerald-400 uppercase">In Stock</span>
            <h3 className="text-2xl font-black text-emerald-400 mt-1">{report.summary?.inStock || 0}</h3>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
            <span className="text-xs font-semibold text-amber-400 uppercase">Low Stock Alert</span>
            <h3 className="text-2xl font-black text-amber-400 mt-1">{report.summary?.lowStock || 0}</h3>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
            <span className="text-xs font-semibold text-red-400 uppercase">Out of Stock</span>
            <h3 className="text-2xl font-black text-red-400 mt-1">{report.summary?.outOfStock || 0}</h3>
          </div>
        </div>
      )}

      {/* Product Stock Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <FiRefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
        </div>
      ) : (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-800 bg-neutral-950/50 text-neutral-400 text-xs uppercase tracking-wider font-semibold">
                  <th className="py-4 px-6">Product & SKU</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Price</th>
                  <th className="py-4 px-6">Stock Status</th>
                  <th className="py-4 px-6 text-right">Quick Restock Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {report?.products?.map((prod) => (
                  <tr key={prod._id} className="hover:bg-neutral-800/30 transition-colors">
                    <td className="py-4 px-6">
                      <p className="font-bold text-white text-sm">{prod.name}</p>
                      <p className="text-xs font-mono text-neutral-400">SKU: {prod.sku || 'N/A'}</p>
                    </td>
                    <td className="py-4 px-6 text-neutral-300">
                      {prod.category?.name || 'Skincare'}
                    </td>
                    <td className="py-4 px-6 font-semibold text-white">
                      ₹{prod.price}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${
                        prod.stock > 10 
                          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                          : prod.stock > 0
                          ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                          : 'bg-red-500/15 text-red-400 border-red-500/30'
                      }`}>
                        {prod.stock} units available
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => handleQuickStockUpdate(prod._id, prod.stock, 50)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30 transition-colors"
                      >
                        +50 Units
                      </button>
                      <button
                        onClick={() => handleQuickStockUpdate(prod._id, prod.stock, 20)}
                        className="px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-xs font-bold border border-blue-500/30 transition-colors"
                      >
                        +20 Units
                      </button>
                      <button
                        onClick={() => handleQuickStockUpdate(prod._id, prod.stock, -10)}
                        className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold border border-red-500/30 transition-colors"
                      >
                        -10 Units
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
