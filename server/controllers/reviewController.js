import Review from '../models/Review.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

// @desc    Get reviews for a product
// @route   GET /api/products/:id/reviews
export const getProductReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ product: req.params.id, isApproved: true })
      .populate('user', 'name profileImage')
      .sort({ createdAt: -1 });

    const total = reviews.length;
    const ratingBreakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let sum = 0;

    reviews.forEach((rev) => {
      ratingBreakdown[rev.rating] = (ratingBreakdown[rev.rating] || 0) + 1;
      sum += rev.rating;
    });

    const averageRating = total > 0 ? (sum / total).toFixed(1) : 0;

    res.json({
      success: true,
      reviews,
      total,
      averageRating: Number(averageRating),
      ratingBreakdown
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add review for a product
// @route   POST /api/products/:id/reviews
export const addReview = async (req, res, next) => {
  try {
    const { rating, title, comment, images } = req.body;
    const productId = req.params.id;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Check if user already reviewed
    const existingReview = await Review.findOne({ user: req.user._id, product: productId });
    if (existingReview) {
      return res.status(400).json({ success: false, message: 'You have already submitted a review for this product' });
    }

    // Check verified purchase
    const userOrder = await Order.findOne({
      user: req.user._id,
      'items.product': productId,
      orderStatus: { $in: ['Delivered', 'Confirmed', 'Processing', 'Packed', 'Shipped', 'Out for Delivery'] }
    });

    const isVerifiedPurchase = !!userOrder;

    const review = await Review.create({
      user: req.user._id,
      product: productId,
      rating: Number(rating),
      title,
      comment,
      images: images || [],
      isVerifiedPurchase,
      isApproved: true
    });

    // Update product rating and review count
    const allReviews = await Review.find({ product: productId, isApproved: true });
    const count = allReviews.length;
    const avg = allReviews.reduce((acc, r) => acc + r.rating, 0) / count;

    product.rating = Number(avg.toFixed(1));
    product.reviewCount = count;
    await product.save();

    const populatedReview = await Review.findById(review._id).populate('user', 'name profileImage');

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      review: populatedReview
    });
  } catch (error) {
    next(error);
  }
};
