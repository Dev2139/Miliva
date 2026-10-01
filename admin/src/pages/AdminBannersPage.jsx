import React, { useState } from 'react';
import { useAdminToast } from '../context/AdminToastContext';
import { FiSave } from 'react-icons/fi';

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
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-cream border border-subtle p-6 shadow-xs">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-500 block mb-1">
            Storefront CMS
          </span>
          <h2 className="text-2xl font-light text-neutral-900 font-editorial">Homepage Banners & Marketing Copy</h2>
          <p className="text-xs text-neutral-600 mt-1">Update top header ticker announcement and hero marketing banners.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-white border border-subtle p-6 space-y-6 shadow-xs">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700 block mb-1">
            Top Header Announcement Ticker
          </label>
          <input
            type="text"
            value={announcementText}
            onChange={(e) => setAnnouncementText(e.target.value)}
            className="w-full text-xs px-3.5 py-2.5 border border-neutral-300 bg-white text-neutral-900 focus:outline-none focus:border-neutral-900"
          />
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700 block mb-1">
            Hero Section Title
          </label>
          <input
            type="text"
            value={heroHeading}
            onChange={(e) => setHeroHeading(e.target.value)}
            className="w-full text-xs px-3.5 py-2.5 border border-neutral-300 bg-white text-neutral-900 focus:outline-none focus:border-neutral-900 font-editorial text-base"
          />
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700 block mb-1">
            Hero Subtitle Description
          </label>
          <textarea
            rows={3}
            value={heroSubheading}
            onChange={(e) => setHeroSubheading(e.target.value)}
            className="w-full text-xs px-3.5 py-2.5 border border-neutral-300 bg-white text-neutral-900 focus:outline-none focus:border-neutral-900"
          />
        </div>

        <div className="flex justify-end pt-4 border-t border-subtle">
          <button
            type="submit"
            className="flex items-center space-x-2 bg-neutral-900 hover:bg-black text-white font-bold px-6 py-2.5 text-xs uppercase tracking-wider shadow-xs transition-colors"
          >
            <FiSave className="w-4 h-4" />
            <span>Save Banner Content</span>
          </button>
        </div>
      </form>
    </div>
  );
}
