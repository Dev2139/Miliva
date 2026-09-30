import React, { useState } from 'react';
import { useAdminToast } from '../context/AdminToastContext';
import { FiImage, FiSave, FiCheckCircle } from 'react-icons/fi';

export default function AdminBannersPage() {
  const [announcementText, setAnnouncementText] = useState('FREE EXPRESS SHIPPING ON ALL ORDERS ABOVE ₹499 | USE CODE: MILIVA10');
  const [heroHeading, setHeroHeading] = useState('DERMATOLOGIST FORMULATED ACNE & BRIGHTENING CARE');
  const [heroSubheading, setHeroSubheading] = useState('Clean science-backed skincare crafted for acne-prone Indian skin.');

  const { showToast } = useAdminToast();

  const handleSave = (e) => {
    e.preventDefault();
    showToast('Homepage banners & CMS settings saved successfully', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
        <div>
          <h2 className="text-xl font-bold text-white">Homepage Banners & CMS Controls</h2>
          <p className="text-neutral-400 text-sm mt-1">Update top header ticker announcement and hero marketing copy</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-6">
        <div>
          <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
            Top Header Announcement Ticker
          </label>
          <input
            type="text"
            value={announcementText}
            onChange={(e) => setAnnouncementText(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
            Hero Section Title
          </label>
          <input
            type="text"
            value={heroHeading}
            onChange={(e) => setHeroHeading(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
            Hero Subtitle Description
          </label>
          <textarea
            rows={3}
            value={heroSubheading}
            onChange={(e) => setHeroSubheading(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex justify-end pt-4 border-t border-neutral-800">
          <button
            type="submit"
            className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-bold px-6 py-2.5 rounded-xl text-sm transition-colors shadow-lg shadow-emerald-500/10"
          >
            <FiSave className="w-4 h-4" />
            <span>Save Banner Content</span>
          </button>
        </div>
      </form>
    </div>
  );
}
