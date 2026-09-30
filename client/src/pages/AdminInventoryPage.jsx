import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/admin/AdminSidebar';
import { adminService } from '../services/adminService';
import { useToast } from '../context/ToastContext';

const AdminInventoryPage = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const res = await adminService.getInventory();
      setReport(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleQuickUpdateStock = async (prod, newStock) => {
    try {
      await adminService.updateProduct(prod._id, { stock: newStock });
      showToast(`Stock updated for ${prod.name}`, 'success');
      fetchInventory();
    } catch (err) {
      showToast('Stock update failed', 'error');
    }
  };

  return (
    <div className="flex min-h-screen bg-neutral-100">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-6">
        <div className="border-b border-neutral-300 pb-4">
          <h1 className="text-2xl font-bold text-neutral-900 font-editorial">Inventory & Stock Control</h1>
          <p className="text-xs text-neutral-500">Monitor stock levels, low stock warnings and SKU movements</p>
        </div>

        {/* Stock Level Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          <div className="p-5 bg-white border border-neutral-200">
            <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-500">Total Formulations</span>
            <p className="text-2xl font-bold text-neutral-900 mt-1 font-editorial">{report?.summary?.totalItems || 0}</p>
          </div>
          <div className="p-5 bg-white border border-neutral-200">
            <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-500">In Stock (&gt;10)</span>
            <p className="text-2xl font-bold text-emerald-700 mt-1 font-editorial">{report?.summary?.inStock || 0}</p>
          </div>
          <div className="p-5 bg-white border border-neutral-200">
            <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-500">Low Stock (&le;10)</span>
            <p className="text-2xl font-bold text-amber-600 mt-1 font-editorial">{report?.summary?.lowStock || 0}</p>
          </div>
          <div className="p-5 bg-white border border-neutral-200">
            <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-500">Out of Stock (0)</span>
            <p className="text-2xl font-bold text-red-600 mt-1 font-editorial">{report?.summary?.outOfStock || 0}</p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-neutral-200 overflow-x-auto shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-900 text-white uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">SKU</th>
                <th className="p-4">Product Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock Level</th>
                <th className="p-4 text-right">Quick Stock Adjustment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {report?.products?.map((p) => (
                <tr key={p._id} className="hover:bg-neutral-50">
                  <td className="p-4 font-mono font-bold">{p.sku}</td>
                  <td className="p-4 font-semibold text-neutral-900">{p.name}</td>
                  <td className="p-4">{p.category?.name || 'Skincare'}</td>
                  <td className="p-4">₹{p.price}</td>
                  <td className="p-4">
                    <span className={`font-bold px-2 py-0.5 text-[10px] uppercase ${
                      p.stock === 0 ? 'bg-red-100 text-red-800' : p.stock <= 10 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {p.stock} units
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => handleQuickUpdateStock(p, Math.max(0, p.stock - 10))}
                        className="px-2 py-1 bg-neutral-200 text-neutral-800 text-[10px] font-bold uppercase hover:bg-neutral-300"
                      >
                        -10
                      </button>
                      <button
                        onClick={() => handleQuickUpdateStock(p, p.stock + 50)}
                        className="px-2 py-1 bg-neutral-900 text-white text-[10px] font-bold uppercase hover:bg-black"
                      >
                        +50 Restock
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AdminInventoryPage;
