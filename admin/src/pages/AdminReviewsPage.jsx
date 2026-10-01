import React, { useState } from 'react';
import { useAdminToast } from '../context/AdminToastContext';
import { FiStar, FiTrash2 } from 'react-icons/fi';

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
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-cream border border-subtle p-6 shadow-xs">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-500 block mb-1">
            Community Feedback
          </span>
          <h2 className="text-2xl font-light text-neutral-900 font-editorial">Customer Reviews Moderation</h2>
          <p className="text-xs text-neutral-600 mt-1">Moderate product ratings & verified buyer testimonials.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reviews.map((rev) => (
          <div key={rev._id} className="bg-white border border-subtle p-5 shadow-xs hover:border-neutral-400 transition-all space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-neutral-800 uppercase tracking-wider bg-cream px-2.5 py-1 border border-subtle">
                {rev.productName}
              </span>
              <div className="flex items-center text-amber-500 space-x-1">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-500 text-amber-500' : 'text-neutral-300'}`} />
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-light text-neutral-900 text-base font-editorial">"{rev.title}"</h4>
              <p className="text-xs text-neutral-600 mt-1">{rev.comment}</p>
            </div>

            <div className="pt-3 border-t border-subtle flex items-center justify-between text-xs text-neutral-500">
              <span>By <strong className="text-neutral-900">{rev.userName}</strong></span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleApprove(rev._id)}
                  className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider border ${
                    rev.isApproved 
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                      : 'bg-white text-neutral-700 border-neutral-300'
                  }`}
                >
                  {rev.isApproved ? 'Approved' : 'Approve'}
                </button>
                <button
                  onClick={() => handleDelete(rev._id)}
                  className="p-1.5 text-rose-600 hover:bg-rose-50"
                  title="Delete Review"
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
