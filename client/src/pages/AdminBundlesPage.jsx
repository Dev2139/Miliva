import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiBox, FiCheck } from 'react-icons/fi';
import AdminLayout from '../components/admin/AdminLayout';
import { bundleService } from '../services/bundleService';
import { productService } from '../services/productService';
import { useToast } from '../context/ToastContext';

const AdminBundlesPage = () => {
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: 'MILIVA Acne Care Combo',
    slug: 'miliva-acne-care-combo',
    shortDescription: 'Complete 2-step daily routine',
    description: 'Includes 1x MILIVA Face Cleanser + 1x MILIVA Face Serum',
    images: ['/images/combo.svg'],
    configs: [
      { title: '100 ml Cleanser + 30 ml Serum', cleanserVariantSize: '100 ml', serumVariantSize: '30 ml', price: 999, compareAtPrice: 1098, sku: 'MLV-CMB-REG', stock: 60 },
      { title: '200 ml Cleanser + 50 ml Serum', cleanserVariantSize: '200 ml', serumVariantSize: '50 ml', price: 1549, compareAtPrice: 1698, sku: 'MLV-CMB-MAX', stock: 40 }
    ],
    benefits: ['1 × MILIVA Face Cleanser', '1 × MILIVA Face Serum', 'Complete 2-step acne routine', 'Exclusive combo savings'],
    stockStrategy: 'auto',
    isActive: true
  });

  const { showToast } = useToast();

  const fetchBundles = async () => {
    try {
      setLoading(true);
      const res = await bundleService.getBundles();
      setBundles(res.bundles || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBundles();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setShowModal(true);
  };

  const handleOpenEdit = (b) => {
    setEditingId(b._id);
    setForm({
      name: b.name,
      slug: b.slug,
      shortDescription: b.shortDescription,
      description: b.description,
      images: b.images || ['/images/combo.svg'],
      configs: b.configs || [],
      benefits: b.benefits || [],
      stockStrategy: b.stockStrategy || 'auto',
      isActive: b.isActive !== undefined ? b.isActive : true
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await bundleService.updateBundle(editingId, form);
        showToast('Bundle updated successfully', 'success');
      } else {
        await bundleService.createBundle(form);
        showToast('Bundle created successfully', 'success');
      }
      setShowModal(false);
      fetchBundles();
    } catch (err) {
      showToast('Failed to save bundle', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product combo bundle?')) return;
    try {
      await bundleService.deleteBundle(id);
      showToast('Bundle deleted', 'info');
      fetchBundles();
    } catch (err) {
      showToast('Delete failed', 'error');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center border-b border-neutral-200 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 font-editorial">Bundle & Combo Management</h1>
            <p className="text-xs text-neutral-500">Manage multi-product bundles, variant combinations and special combo pricing</p>
          </div>

          <button
            onClick={handleOpenCreate}
            className="px-4 py-2 bg-neutral-900 text-white text-xs uppercase font-bold tracking-wider flex items-center gap-1.5"
          >
            <FiPlus /> Create New Combo Bundle
          </button>
        </div>

        {/* Bundle Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bundles.map((b) => (
            <div key={b._id} className="p-6 bg-white border border-neutral-200 space-y-4 shadow-xs">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <img src={b.images?.[0] || '/images/combo.svg'} alt="" className="w-16 h-16 object-cover border border-neutral-200" />
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-widest bg-neutral-900 text-white px-2 py-0.5">OFFICIAL BUNDLE</span>
                    <h3 className="text-base font-bold text-neutral-900 mt-1 font-editorial">{b.name}</h3>
                    <p className="text-xs text-neutral-500">{b.shortDescription}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => handleOpenEdit(b)} className="p-1.5 text-neutral-700 hover:text-neutral-900">
                    <FiEdit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(b._id)} className="p-1.5 text-red-600 hover:text-red-800">
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Configurations list */}
              <div className="space-y-2 text-xs border-t border-neutral-200 pt-3">
                <h4 className="font-bold text-neutral-900 uppercase tracking-wider text-[10px]">Bundle Configurations & Savings:</h4>
                {b.configs?.map((cfg, idx) => (
                  <div key={idx} className="p-3 bg-neutral-50 border border-neutral-200 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-neutral-900">{cfg.title}</p>
                      <p className="text-[10px] text-neutral-500 font-mono">SKU: {cfg.sku} &bull; Stock: {cfg.stock} units</p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-neutral-900">₹{cfg.price}</span>
                      <span className="text-neutral-400 line-through text-[11px] block">₹{cfg.compareAtPrice}</span>
                      <span className="text-emerald-700 font-bold text-[10px]">Save ₹{cfg.compareAtPrice - cfg.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Create/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <form onSubmit={handleSave} className="w-full max-w-xl bg-white p-6 space-y-4 border border-neutral-300 max-h-[90vh] overflow-y-auto">
              <h3 className="text-base font-bold uppercase tracking-wider text-neutral-900">{editingId ? 'Edit Combo Bundle' : 'Create Combo Bundle'}</h3>

              <div>
                <label className="text-xs font-semibold block mb-1">Bundle Name</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full text-xs px-3 py-2 border border-neutral-300" required />
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">Short Description</label>
                <input type="text" value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} className="w-full text-xs px-3 py-2 border border-neutral-300" required />
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">Full Description</label>
                <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full text-xs p-3 border border-neutral-300" required></textarea>
              </div>

              {/* Configurations inputs */}
              <div className="space-y-3 pt-2 border-t border-neutral-200">
                <h4 className="text-xs font-bold uppercase text-neutral-900">Configuration 1 (Regular)</h4>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <input type="text" value={form.configs[0]?.title} onChange={(e) => { const c = [...form.configs]; c[0].title = e.target.value; setForm({ ...form, configs: c }); }} className="border p-2" placeholder="Title" />
                  <input type="number" value={form.configs[0]?.price} onChange={(e) => { const c = [...form.configs]; c[0].price = Number(e.target.value); setForm({ ...form, configs: c }); }} className="border p-2" placeholder="Combo Price ₹" />
                  <input type="number" value={form.configs[0]?.compareAtPrice} onChange={(e) => { const c = [...form.configs]; c[0].compareAtPrice = Number(e.target.value); setForm({ ...form, configs: c }); }} className="border p-2" placeholder="Combined Total ₹" />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-xs uppercase font-bold text-neutral-600">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-neutral-900 text-white text-xs uppercase font-bold tracking-wider">Save Combo Bundle</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminBundlesPage;
