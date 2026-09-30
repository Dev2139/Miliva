import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true, trim: true },
    comment: { type: String, required: true, trim: true },
    images: [{ type: String }],
    isVerifiedPurchase: { type: Boolean, default: true },
    isApproved: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const Review = mongoose.model('Review', reviewSchema);
export default Review;
