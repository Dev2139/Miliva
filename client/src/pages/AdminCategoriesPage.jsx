import React, { useState, useEffect } from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import AdminLayout from '../components/admin/AdminLayout';
import { productService } from '../services/productService';
import { useToast } from '../context/ToastContext';

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    productService.getCategories().then(res => setCategories(res.categories || [])).finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center border-b border-neutral-200 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 font-editorial">Official Categories</h1>
            <p className="text-xs text-neutral-500">Categories for official MILIVA products</p>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 divide-y divide-neutral-200">
          {categories.map((c) => (
            <div key={c._id} className="p-4 flex items-center justify-between text-xs">
              <div>
                <h4 className="font-bold text-neutral-900 text-sm">{c.name}</h4>
                <p className="text-neutral-500">{c.description}</p>
                <span className="text-[10px] font-mono text-neutral-400">Slug: /{c.slug}</span>
              </div>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] uppercase">Active Category</span>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCategoriesPage;
