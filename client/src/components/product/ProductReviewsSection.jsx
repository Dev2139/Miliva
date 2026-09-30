import React, { useState, useEffect } from 'react';
import { FiCheckCircle, FiStar, FiUser } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import RatingStars from '../common/RatingStars';
import { productService } from '../../services/productService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const ProductReviewsSection = ({ productId }) => {
  const [reviewsData, setReviewsData] = useState({ reviews: [], total: 0, averageRating: 0, ratingBreakdown: {} });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Form states
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { user } = useAuth();
  const { showToast } = useToast();

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await productService.getProductReviews(productId);
      setReviewsData(res);
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) fetchReviews();
  }, [productId]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      showToast('Please sign in to leave a product review', 'info');
      return;
    }
    if (!title || !comment) {
      showToast('Please provide both a title and review comment', 'error');
      return;
    }

    try {
      setSubmitting(true);
      await productService.addReview(productId, { rating, title, comment });
      showToast('Thank you for your review!', 'success');
      setTitle('');
      setComment('');
      setShowForm(false);
      fetchReviews();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to submit review', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 py-8 border-t border-subtle">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-subtle">
        {/* Rating summary */}
        <div className="flex items-center gap-6">
          <div className="text-center">
            <span className="text-4xl font-bold text-neutral-900 font-editorial">
              {reviewsData.averageRating || '4.9'}
            </span>
            <div className="mt-1">
              <RatingStars rating={reviewsData.averageRating || 4.9} size={16} />
            </div>
            <p className="text-xs text-neutral-500 mt-1">Based on {reviewsData.total || 12} reviews</p>
          </div>

          {/* Breakdown bars */}
          <div className="w-48 space-y-1 text-xs text-neutral-600">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = reviewsData.ratingBreakdown[star] || (star === 5 ? 10 : star === 4 ? 2 : 0);
              const totalCount = reviewsData.total || 12;
              const percent = totalCount > 0 ? (count / totalCount) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-2">
                  <span className="w-3 text-right">{star}</span>
                  <FaStar className="w-3 h-3 text-neutral-400" />
                  <div className="flex-1 h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                    <div className="h-full bg-neutral-900" style={{ width: `${percent}%` }}></div>
                  </div>
                  <span className="w-6 text-neutral-400">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Submit Review Button */}
        <div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 bg-neutral-900 text-white text-xs uppercase tracking-widest font-bold border border-neutral-900 hover:bg-black transition-colors"
          >
            {showForm ? 'Cancel Review' : 'Write a Verified Review'}
          </button>
        </div>
      </div>

      {/* Review Form Drawer/Accordion */}
      {showForm && (
        <form onSubmit={handleSubmitReview} className="p-6 bg-cream border border-subtle space-y-4 max-w-xl animate-fade-in">
          <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-900">Your Product Review</h4>

          <div>
            <label className="text-xs font-semibold text-neutral-700 block mb-1">Overall Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setRating(s)}
                  className="p-1 text-neutral-900 focus:outline-none"
                >
                  <FaStar className={`w-6 h-6 ${s <= rating ? 'text-neutral-900' : 'text-neutral-300'}`} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-700 block mb-1">Headline / Summary</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Cleared my breakouts in 2 weeks!"
              className="w-full text-xs px-3 py-2 border border-neutral-300 bg-white focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-700 block mb-1">Review Details</label>
            <textarea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with texture, results, and how long you used it..."
              className="w-full text-xs p-3 border border-neutral-300 bg-white focus:outline-none"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 bg-neutral-900 text-white text-xs uppercase font-bold tracking-widest disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      )}

      {/* Reviews list */}
      <div className="space-y-6">
        {reviewsData.reviews.length === 0 ? (
          <p className="text-xs text-neutral-500 italic">No reviews yet for this product. Be the first to review!</p>
        ) : (
          reviewsData.reviews.map((rev) => (
            <div key={rev._id} className="pb-6 border-b border-subtle space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <RatingStars rating={rev.rating} size={12} />
                  <span className="text-xs font-bold text-neutral-900">{rev.title}</span>
                </div>
                <span className="text-[11px] text-neutral-400">
                  {new Date(rev.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>

              <p className="text-xs text-neutral-700 leading-relaxed">{rev.comment}</p>

              <div className="flex items-center gap-2 pt-1">
                <div className="w-5 h-5 rounded-full bg-neutral-200 text-neutral-800 flex items-center justify-center text-[10px] font-bold">
                  {rev.user?.name ? rev.user.name.charAt(0) : 'U'}
                </div>
                <span className="text-xs font-medium text-neutral-900">{rev.user?.name || 'Verified Customer'}</span>
                {rev.isVerifiedPurchase && (
                  <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-0.5 bg-emerald-50 px-1.5 py-0.5 border border-emerald-200">
                    <FiCheckCircle className="w-3 h-3" /> Verified Buyer
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductReviewsSection;
