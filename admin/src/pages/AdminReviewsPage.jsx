import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import { useAdminToast } from '../context/AdminToastContext';
import { FiStar, FiRefreshCw, FiCheckCircle, FiTrash2, FiMessageSquare } from 'react-icons/fi';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([
    {
      _id: 'rev1',
      productName: 'MILIVA Face Cleanser',
      userName: 'Aanya Sharma',
      rating: 5,
      title: 'Remarkable Cleanser for Acne',
      comment: 'Reduced my active breakouts significantly within 10 days! Doesn’t dry out my skin at all.',
      isApproved: true,
      createdAt: new Date().toISOString()
    },
    {
      _id: 'rev2',
      productName: 'MILIVA Face Serum',
      userName: 'Rohan Mehta',
      rating: 5,
      title: 'Amazing Glow & Fast Absorption',
      comment: 'Non-sticky formula, feels ultra premium. Niacinamide worked wonders for my dark spots.',
      isApproved: true,
      createdAt: new Date().toISOString()
    }
  ]);
  const [loading, setLoading] = useState(false);
  const { showToast } = useAdminToast();

  const handleApprove = (id) => {
    setReviews(prev => prev.map(r => r._id === id ? { ...r, isApproved: !r.isApproved } : r));
    showToast('Review status updated', 'success');
  };

  const handleDelete = (id) => {
    setReviews(prev => prev.filter(r => r._id !== id));
    showToast('Review removed', 'info');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
        <div>
          <h2 className="text-xl font-bold text-white">Product Customer Reviews</h2>
          <p className="text-neutral-400 text-sm mt-1">Moderate customer ratings & verified buyer testimonials</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reviews.map((rev) => (
          <div key={rev._id} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 hover:border-neutral-700 transition-all space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/30">
                {rev.productName}
              </span>
              <div className="flex items-center text-amber-400 space-x-1">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-700'}`} />
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-white text-base">"{rev.title}"</h4>
              <p className="text-xs text-neutral-300 mt-1">{rev.comment}</p>
            </div>

            <div className="pt-3 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
              <span>By <strong className="text-white">{rev.userName}</strong></span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleApprove(rev._id)}
                  className={`px-2.5 py-1 rounded-lg font-semibold border ${
                    rev.isApproved 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                      : 'bg-neutral-800 text-neutral-400'
                  }`}
                >
                  {rev.isApproved ? 'Approved' : 'Approve'}
                </button>
                <button
                  onClick={() => handleDelete(rev._id)}
                  className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
