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
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-cream border border-subtle p-6 shadow-xs">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-500 block mb-1">
            Warehouse Control
          </span>
          <h2 className="text-2xl font-light text-neutral-900 font-editorial">Stock & Inventory Management</h2>
          <p className="text-xs text-neutral-600 mt-1">Monitor warehouse stock levels and execute quick restock operations.</p>
        </div>
        <button
          onClick={loadInventory}
          className="flex items-center space-x-2 bg-white hover:bg-neutral-50 text-neutral-800 font-bold px-4 py-2.5 text-xs uppercase tracking-wider transition-colors border border-neutral-300 shadow-xs"
        >
          <FiRefreshCw className="w-4 h-4" />
          <span>Refresh Stock</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      {report && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white border border-subtle p-5 shadow-xs">
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Active Products</span>
            <h3 className="text-2xl font-bold font-editorial text-neutral-900 mt-1">{report.summary?.totalItems || 0}</h3>
          </div>
          <div className="bg-white border border-subtle p-5 shadow-xs">
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest">In Stock</span>
            <h3 className="text-2xl font-bold font-editorial text-emerald-800 mt-1">{report.summary?.inStock || 0}</h3>
          </div>
          <div className="bg-white border border-subtle p-5 shadow-xs">
            <span className="text-[10px] font-bold text-amber-800 uppercase tracking-widest">Low Stock Alert</span>
            <h3 className="text-2xl font-bold font-editorial text-amber-800 mt-1">{report.summary?.lowStock || 0}</h3>
          </div>
          <div className="bg-white border border-subtle p-5 shadow-xs">
            <span className="text-[10px] font-bold text-rose-800 uppercase tracking-widest">Out of Stock</span>
            <h3 className="text-2xl font-bold font-editorial text-rose-800 mt-1">{report.summary?.outOfStock || 0}</h3>
          </div>
        </div>
      )}

      {/* Product Stock Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <FiRefreshCw className="w-7 h-7 text-neutral-900 animate-spin" />
        </div>
      ) : (
        <div className="bg-white border border-subtle overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-cream border-b border-subtle text-neutral-700 text-[10px] uppercase tracking-wider font-bold">
                  <th className="py-3.5 px-6">Product & SKU</th>
                  <th className="py-3.5 px-6">Category</th>
                  <th className="py-3.5 px-6">Price</th>
                  <th className="py-3.5 px-6">Stock Status</th>
                  <th className="py-3.5 px-6 text-right">Quick Restock Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {report?.products?.map((prod) => (
                  <tr key={prod._id} className="hover:bg-[#FDFBF7] transition-colors">
                    <td className="py-4 px-6">
                      <p className="font-bold text-neutral-900 text-sm">{prod.name}</p>
                      <p className="text-[11px] font-mono text-neutral-500">SKU: {prod.sku || 'N/A'}</p>
                    </td>
                    <td className="py-4 px-6 text-neutral-700">
                      {prod.category?.name || 'Skincare'}
                    </td>
                    <td className="py-4 px-6 font-bold text-neutral-900">
                      ₹{prod.price}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border ${
                        prod.stock > 10 
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : prod.stock > 0
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-rose-50 text-rose-800 border-rose-200'
                      }`}>
                        {prod.stock} units available
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => handleQuickStockUpdate(prod._id, prod.stock, 50)}
                        className="px-3 py-1.5 bg-neutral-900 hover:bg-black text-white text-[10px] font-bold uppercase tracking-wider transition-colors shadow-2xs"
                      >
                        +50 Units
                      </button>
                      <button
                        onClick={() => handleQuickStockUpdate(prod._id, prod.stock, 20)}
                        className="px-3 py-1.5 bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-800 text-[10px] font-bold uppercase tracking-wider transition-colors shadow-2xs"
                      >
                        +20 Units
                      </button>
                      <button
                        onClick={() => handleQuickStockUpdate(prod._id, prod.stock, -10)}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-[10px] font-bold uppercase tracking-wider transition-colors"
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
