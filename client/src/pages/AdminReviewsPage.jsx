import React, { useState, useEffect } from 'react';
import { FiCheckCircle, FiTrash2, FiCheck, FiX } from 'react-icons/fi';
import AdminLayout from '../components/admin/AdminLayout';
import API from '../services/api';
import RatingStars from '../components/common/RatingStars';
import { useToast } from '../context/ToastContext';

const AdminReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchReviews = async () => {
    try {
      setLoading(true);
      // Fetch reviews for products
      const pRes = await API.get('/products');
      const allProds = pRes.data.products || [];

      let accumulated = [];
      for (const p of allProds) {
        const rRes = await API.get(`/products/${p._id}/reviews`);
        if (rRes.data.reviews) {
          accumulated.push(...rRes.data.reviews.map(r => ({ ...r, productName: p.name })));
        }
      }
      setReviews(accumulated);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="border-b border-neutral-200 pb-4">
          <h1 className="text-2xl font-bold text-neutral-900 font-editorial">Product Reviews Moderation</h1>
          <p className="text-xs text-neutral-500">Inspect verified customer reviews, ratings and comments</p>
        </div>

        <div className="bg-white border border-neutral-200 divide-y divide-neutral-200">
          {reviews.length === 0 ? (
            <p className="p-8 text-center text-xs text-neutral-500">No reviews found.</p>
          ) : (
            reviews.map((rev) => (
              <div key={rev._id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <RatingStars rating={rev.rating} size={12} />
                    <span className="font-bold text-xs text-neutral-900">{rev.title}</span>
                    <span className="text-[10px] text-neutral-400">({rev.productName})</span>
                  </div>
                  <p className="text-xs text-neutral-700">{rev.comment}</p>
                  <div className="flex items-center gap-2 text-[11px] text-neutral-500 pt-1">
                    <span>By {rev.user?.name || 'Customer'}</span>
                    {rev.isVerifiedPurchase && (
                      <span className="text-emerald-700 font-bold flex items-center gap-0.5 bg-emerald-50 px-1.5 py-0.5 border border-emerald-200 text-[9px]">
                        <FiCheckCircle /> Verified Buyer
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 self-end md:self-auto">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-[10px] uppercase font-bold">Approved</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminReviewsPage;
