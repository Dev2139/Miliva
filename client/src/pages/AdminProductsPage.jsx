import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiCheck, FiX } from 'react-icons/fi';
import AdminSidebar from '../components/admin/AdminSidebar';
import { productService } from '../services/productService';
import { adminService } from '../services/adminService';
import { useToast } from '../context/ToastContext';

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal form state
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: '',
    slug: '',
    shortDescription: '',
    description: '',
    category: '',
    price: 0,
    compareAtPrice: 0,
    sku: '',
    stock: 50,
    size: '30 ml',
    images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop'],
    isBestSeller: false,
    isNew: false,
    isFeatured: true
  });

  const { showToast } = useToast();

  const loadData = async () => {
    try {
      setLoading(true);
      const [pRes, cRes] = await Promise.all([
        productService.getProducts({ limit: 100 }),
        productService.getCategories()
      ]);
      setProducts(pRes.products || []);
      setCategories(cRes.categories || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setForm({
      name: '',
      slug: '',
      shortDescription: '',
      description: '',
      category: categories[0]?._id || '',
      price: 599,
      compareAtPrice: 699,
      sku: `MLV-NEW-${Date.now().toString().slice(-4)}`,
      stock: 50,
      size: '30 ml',
      images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop'],
      isBestSeller: false,
      isNew: true,
      isFeatured: false
    });
    setShowModal(true);
  };

  const handleOpenEdit = (prod) => {
    setEditingId(prod._id);
    setForm({
      name: prod.name,
      slug: prod.slug,
      shortDescription: prod.shortDescription,
      description: prod.description,
      category: prod.category?._id || prod.category,
      price: prod.price,
      compareAtPrice: prod.compareAtPrice || 0,
      sku: prod.sku,
      stock: prod.stock,
      size: prod.size,
      images: prod.images || [],
      isBestSeller: prod.isBestSeller || false,
      isNew: prod.isNew || false,
      isFeatured: prod.isFeatured || false
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.sku) {
      showToast('Name, price and SKU are required', 'error');
      return;
    }

    try {
      const payload = {
        ...form,
        slug: form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
      };

      if (editingId) {
        await adminService.updateProduct(editingId, payload);
        showToast('Product updated', 'success');
      } else {
        await adminService.createProduct(payload);
        showToast('Product created', 'success');
      }
      setShowModal(false);
      loadData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Save failed', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deactivate this product formulation?')) return;
    try {
      await adminService.deleteProduct(id);
      showToast('Product deactivated', 'info');
      loadData();
    } catch (err) {
      showToast('Failed to deactivate', 'error');
    }
  };

  return (
    <div className="flex min-h-screen bg-neutral-100">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-6">
        <div className="flex justify-between items-center border-b border-neutral-300 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 font-editorial">Product Management</h1>
            <p className="text-xs text-neutral-500">Create, edit and manage product inventory & pricing</p>
          </div>

          <button
            onClick={handleOpenCreate}
            className="px-4 py-2 bg-neutral-900 text-white text-xs uppercase font-bold tracking-wider flex items-center gap-1.5"
          >
            <FiPlus /> Create New Product
          </button>
        </div>

        {/* Product Table */}
        <div className="bg-white border border-neutral-200 overflow-x-auto shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-900 text-white uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Product</th>
                <th className="p-4">SKU</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Badges</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {products.map((p) => (
                <tr key={p._id} className="hover:bg-neutral-50">
                  <td className="p-4 flex items-center gap-3">
                    <img src={p.images?.[0]} alt="" className="w-10 h-10 object-cover border border-neutral-200" />
                    <div>
                      <p className="font-bold text-neutral-900">{p.name}</p>
                      <p className="text-neutral-500 text-[10px]">{p.size}</p>
                    </div>
                  </td>
                  <td className="p-4 font-mono">{p.sku}</td>
                  <td className="p-4">{p.category?.name || 'Skincare'}</td>
                  <td className="p-4 font-bold">₹{p.price}</td>
                  <td className="p-4 font-bold">
                    <span className={p.stock <= 10 ? 'text-red-600' : 'text-neutral-900'}>{p.stock} units</span>
                  </td>
                  <td className="p-4 space-x-1">
                    {p.isBestSeller && <span className="bg-neutral-900 text-white text-[9px] font-bold px-1.5 py-0.5">BESTSELLER</span>}
                    {p.isNew && <span className="bg-neutral-200 text-neutral-900 text-[9px] font-bold px-1.5 py-0.5">NEW</span>}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button onClick={() => handleOpenEdit(p)} className="p-1.5 text-neutral-700 hover:text-neutral-900">
                      <FiEdit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(p._id)} className="p-1.5 text-red-600 hover:text-red-800">
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal Form */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <form onSubmit={handleSave} className="w-full max-w-2xl bg-white p-6 space-y-4 border border-neutral-300 max-h-[90vh] overflow-y-auto">
              <h3 className="text-base font-bold uppercase tracking-wider text-neutral-900">{editingId ? 'Edit Product' : 'Create Product'}</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold block mb-1">Product Name</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full text-xs px-3 py-2 border border-neutral-300" required />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1">SKU</label>
                  <input type="text" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} className="w-full text-xs px-3 py-2 border border-neutral-300" required />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">Short Description</label>
                <input type="text" value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} className="w-full text-xs px-3 py-2 border border-neutral-300" required />
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">Full Description</label>
                <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full text-xs p-3 border border-neutral-300" required></textarea>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold block mb-1">Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full text-xs px-3 py-2 border border-neutral-300">
                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1">Price (₹)</label>
                  <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className="w-full text-xs px-3 py-2 border border-neutral-300" required />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1">Compare Price (₹)</label>
                  <input type="number" value={form.compareAtPrice} onChange={(e) => setForm({ ...form, compareAtPrice: Number(e.target.value) })} className="w-full text-xs px-3 py-2 border border-neutral-300" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold block mb-1">Stock Quantity</label>
                  <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} className="w-full text-xs px-3 py-2 border border-neutral-300" required />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1">Size / Volume</label>
                  <input type="text" value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} className="w-full text-xs px-3 py-2 border border-neutral-300" required />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">Image URL</label>
                <input type="text" value={form.images[0]} onChange={(e) => setForm({ ...form, images: [e.target.value] })} className="w-full text-xs px-3 py-2 border border-neutral-300" required />
              </div>

              <div className="flex gap-4 pt-2 text-xs">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" checked={form.isBestSeller} onChange={(e) => setForm({ ...form, isBestSeller: e.target.checked })} />
                  <span>Bestseller Badge</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" checked={form.isNew} onChange={(e) => setForm({ ...form, isNew: e.target.checked })} />
                  <span>New Arrival Badge</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-xs uppercase font-bold text-neutral-600">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-neutral-900 text-white text-xs uppercase font-bold tracking-wider">Save Formulation</button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminProductsPage;
