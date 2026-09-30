import React, { useState } from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import { useToast } from '../context/ToastContext';

const AdminBannersPage = () => {
  const [announcementText, setAnnouncementText] = useState('Free Express Shipping on all orders above ₹999 | Use Code WELCOME10 for 10% OFF');
  const [heroHeading, setHeroHeading] = useState('Skincare, simplified.');
  const [heroSubtext, setHeroSubtext] = useState('Effective formulations designed around active ingredients that work.');

  const { showToast } = useToast();

  const handleSaveCMS = (e) => {
    e.preventDefault();
    showToast('Storefront content updated successfully', 'success');
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-2xl">
        <div className="border-b border-neutral-200 pb-4">
          <h1 className="text-2xl font-bold text-neutral-900 font-editorial">Homepage CMS &amp; Banners</h1>
          <p className="text-xs text-neutral-500">Edit storefront top announcement bar and hero banner copy</p>
        </div>

        <form onSubmit={handleSaveCMS} className="p-6 bg-white border border-neutral-200 space-y-4 shadow-xs">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700 block mb-1">Top Announcement Bar Text</label>
            <input
              type="text"
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-neutral-300"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700 block mb-1">Hero Banner Heading</label>
            <input
              type="text"
              value={heroHeading}
              onChange={(e) => setHeroHeading(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-neutral-300"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700 block mb-1">Hero Subtext</label>
            <textarea
              rows={3}
              value={heroSubtext}
              onChange={(e) => setHeroSubtext(e.target.value)}
              className="w-full text-xs p-3 border border-neutral-300"
              required
            ></textarea>
          </div>

          <button type="submit" className="px-6 py-2.5 bg-neutral-900 text-white text-xs uppercase font-bold tracking-widest">
            Publish Changes
          </button>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminBannersPage;
