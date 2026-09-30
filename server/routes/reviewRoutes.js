import express from 'express';
import { getProductReviews, addReview } from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router({ mergeParams: true });

router.get('/', getProductReviews);
router.post('/', protect, addReview);

export default router;
